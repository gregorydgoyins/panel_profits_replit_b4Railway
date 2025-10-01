import { storage } from '../storage.js';
import { marketSimulation } from '../marketSimulation.js';
import type { Asset, AssetCurrentPrice } from '@shared/schema.js';
import type { WebSocket } from 'ws';

/**
 * Real-time Price Streaming Service for Panel Profits
 * 
 * Generates and broadcasts realistic price movements to create
 * a living, breathing market experience with constant price updates
 */

export interface PriceUpdate {
  type: 'PRICE_UPDATE';
  assetId: string;
  symbol: string;
  name: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  timestamp: string;
  trend: 'up' | 'down' | 'stable';
  intensity: number; // 0-1 for price flash intensity
}

export interface OrderBookUpdate {
  type: 'ORDERBOOK_UPDATE';
  assetId: string;
  symbol: string;
  bids: Array<{ price: number; quantity: number; total: number }>;
  asks: Array<{ price: number; quantity: number; total: number }>;
  spread: number;
  spreadPercent: number;
  timestamp: string;
}

export interface MarketPulse {
  type: 'MARKET_PULSE';
  totalAssets: number;
  activeTraders: number;
  volumePulse: number; // 0-1 intensity
  volatilityIndex: number; // Market-wide volatility
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: string;
}

interface AssetStreamData {
  asset: Asset;
  currentPrice: number;
  previousPrice: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  volume24h: number;
  priceHistory: number[];
  volatility: number;
  momentum: number;
  trend: number; // -1 to 1
  lastUpdate: Date;
  subscriberCount: number;
}

interface MarketHours {
  isOpen: boolean;
  currentSession: 'pre-market' | 'market' | 'after-hours' | 'closed';
  volatilityMultiplier: number;
}

export class PriceStreamingService {
  private streamingInterval: NodeJS.Timeout | null = null;
  private orderBookInterval: NodeJS.Timeout | null = null;
  private pulseInterval: NodeJS.Timeout | null = null;
  private assetStreams: Map<string, AssetStreamData> = new Map();
  private connectedClients: Set<WebSocket> = new Set();
  private assetSubscriptions: Map<string, Set<WebSocket>> = new Map();
  private lastPriceUpdate: Map<string, number> = new Map();
  
  // Price generation parameters
  private readonly BASE_UPDATE_INTERVAL = 500; // 500ms for smooth updates
  private readonly ORDERBOOK_UPDATE_INTERVAL = 1000; // 1 second for order book
  private readonly PULSE_UPDATE_INTERVAL = 2000; // 2 seconds for market pulse
  private readonly MAX_PRICE_CHANGE_PER_TICK = 0.005; // 0.5% max change per update
  private readonly VOLATILITY_BASE = 0.002; // Base volatility
  
  constructor() {
    console.log('💹 Price Streaming Service initialized');
  }

  /**
   * Start the price streaming engine
   */
  async start(): Promise<void> {
    console.log('🚀 Starting real-time price streaming engine...');
    
    // Initialize asset streams
    await this.initializeAssetStreams();
    
    // Start price update stream (500ms intervals for smooth movement)
    this.streamingInterval = setInterval(() => {
      this.generateAndBroadcastPriceUpdates();
    }, this.BASE_UPDATE_INTERVAL);
    
    // Start order book updates (1 second intervals)
    this.orderBookInterval = setInterval(() => {
      this.generateAndBroadcastOrderBooks();
    }, this.ORDERBOOK_UPDATE_INTERVAL);
    
    // Start market pulse updates (2 second intervals)
    this.pulseInterval = setInterval(() => {
      this.generateAndBroadcastMarketPulse();
    }, this.PULSE_UPDATE_INTERVAL);
    
    console.log('✅ Price streaming engine started successfully');
  }

  /**
   * Stop the price streaming engine
   */
  stop(): void {
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
    if (this.orderBookInterval) {
      clearInterval(this.orderBookInterval);
      this.orderBookInterval = null;
    }
    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }
    console.log('🛑 Price streaming engine stopped');
  }

  /**
   * Initialize asset streaming data
   */
  private async initializeAssetStreams(): Promise<void> {
    try {
      console.log('  📦 Loading assets for streaming...');
      const assets = await storage.getAssets();
      console.log(`  📦 Loaded ${assets.length} assets`);
      
      // Load all prices at once for fast lookup
      console.log('  💰 Loading asset prices for streaming...');
      const allPrices = await storage.getAllAssetCurrentPrices();
      const priceMap = new Map(allPrices.map(p => [p.assetId, p]));
      console.log(`  💰 Loaded ${allPrices.length} prices`);
      
      let initializedCount = 0;
      for (const asset of assets) {
        const currentPrice = priceMap.get(asset.id);
        if (currentPrice) {
          const price = parseFloat(currentPrice.currentPrice);
          this.assetStreams.set(asset.id, {
            asset,
            currentPrice: price,
            previousPrice: price,
            dayOpen: price,
            dayHigh: price,
            dayLow: price,
            volume24h: currentPrice.volume || 0,
            priceHistory: [price],
            volatility: this.VOLATILITY_BASE,
            momentum: 0,
            trend: 0,
            lastUpdate: new Date(),
            subscriberCount: 0
          });
          initializedCount++;
        }
      }
      
      console.log(`📊 Initialized streaming for ${initializedCount} assets`);
    } catch (error) {
      console.error('❌ Error initializing asset streams:', error);
      throw error;
    }
  }

  /**
   * Get current market hours and volatility settings
   */
  private getMarketHours(): MarketHours {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 9 && hour < 16) {
      return {
        isOpen: true,
        currentSession: 'market',
        volatilityMultiplier: 1.0
      };
    } else if (hour >= 4 && hour < 9) {
      return {
        isOpen: true,
        currentSession: 'pre-market',
        volatilityMultiplier: 1.5 // More volatile in pre-market
      };
    } else if (hour >= 16 && hour < 20) {
      return {
        isOpen: true,
        currentSession: 'after-hours',
        volatilityMultiplier: 1.3 // Moderate volatility after hours
      };
    } else {
      return {
        isOpen: false,
        currentSession: 'closed',
        volatilityMultiplier: 0.1 // Minimal movement when closed
      };
    }
  }

  /**
   * Generate and broadcast price updates for all assets
   */
  private generateAndBroadcastPriceUpdates(): void {
    const marketHours = this.getMarketHours();
    const updates: PriceUpdate[] = [];
    
    for (const [assetId, streamData] of this.assetStreams) {
      // Skip if no subscribers for this asset
      const subscribers = this.assetSubscriptions.get(assetId);
      if (!subscribers || subscribers.size === 0) continue;
      
      // Generate realistic price movement
      const priceUpdate = this.generatePriceMovement(streamData, marketHours);
      
      // Update stream data
      streamData.previousPrice = streamData.currentPrice;
      streamData.currentPrice = priceUpdate.newPrice;
      streamData.volume24h += priceUpdate.volumeDelta;
      streamData.momentum = priceUpdate.momentum;
      streamData.trend = priceUpdate.trend;
      streamData.lastUpdate = new Date();
      
      // Update day high/low
      if (priceUpdate.newPrice > streamData.dayHigh) {
        streamData.dayHigh = priceUpdate.newPrice;
      }
      if (priceUpdate.newPrice < streamData.dayLow) {
        streamData.dayLow = priceUpdate.newPrice;
      }
      
      // Add to price history (keep last 100 ticks)
      streamData.priceHistory.push(priceUpdate.newPrice);
      if (streamData.priceHistory.length > 100) {
        streamData.priceHistory.shift();
      }
      
      // Calculate change metrics
      const change = priceUpdate.newPrice - streamData.dayOpen;
      const changePercent = (change / streamData.dayOpen) * 100;
      
      // Determine trend direction and intensity
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
      const intensity = Math.min(1, Math.abs(priceUpdate.momentum) * 10);
      
      // Create price update message
      const update: PriceUpdate = {
        type: 'PRICE_UPDATE',
        assetId: streamData.asset.id,
        symbol: streamData.asset.symbol,
        name: streamData.asset.name,
        price: priceUpdate.newPrice,
        bid: priceUpdate.newPrice * (1 - priceUpdate.spread / 2),
        ask: priceUpdate.newPrice * (1 + priceUpdate.spread / 2),
        volume: Math.floor(streamData.volume24h),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        high24h: streamData.dayHigh,
        low24h: streamData.dayLow,
        timestamp: new Date().toISOString(),
        trend: trend as 'up' | 'down' | 'stable',
        intensity
      };
      
      // Broadcast to subscribers
      this.broadcastToAssetSubscribers(assetId, update);
    }
  }

  /**
   * Generate realistic price movement for an asset
   */
  private generatePriceMovement(
    streamData: AssetStreamData,
    marketHours: MarketHours
  ): {
    newPrice: number;
    momentum: number;
    trend: number;
    spread: number;
    volumeDelta: number;
  } {
    const { currentPrice, momentum, trend, volatility } = streamData;
    
    // Random walk component
    const randomWalk = (Math.random() - 0.5) * 2;
    
    // Momentum component (prices tend to continue in the same direction)
    const momentumComponent = momentum * 0.3;
    
    // Mean reversion component (prices tend to revert to mean)
    const meanReversion = -trend * 0.1;
    
    // Market sentiment component (random bursts of activity)
    const sentimentBurst = Math.random() < 0.02 ? (Math.random() - 0.5) * 5 : 0;
    
    // Combine all components with volatility and market hours adjustment
    const priceChangePercent = (
      randomWalk * volatility +
      momentumComponent * volatility +
      meanReversion * volatility +
      sentimentBurst * volatility
    ) * marketHours.volatilityMultiplier;
    
    // Cap maximum change per tick
    const cappedChange = Math.max(
      -this.MAX_PRICE_CHANGE_PER_TICK,
      Math.min(this.MAX_PRICE_CHANGE_PER_TICK, priceChangePercent)
    );
    
    // Calculate new price
    const newPrice = currentPrice * (1 + cappedChange);
    
    // Update momentum and trend
    const newMomentum = momentum * 0.9 + cappedChange * 0.1;
    const newTrend = trend * 0.95 + cappedChange * 5;
    
    // Calculate dynamic spread based on volatility
    const baseSpread = 0.001; // 0.1% base spread
    const volatilitySpread = volatility * 2;
    const spread = baseSpread + volatilitySpread;
    
    // Generate volume delta
    const volumeDelta = Math.floor(
      Math.random() * 100 * (1 + Math.abs(cappedChange) * 50)
    );
    
    return {
      newPrice: parseFloat(newPrice.toFixed(2)),
      momentum: newMomentum,
      trend: Math.max(-1, Math.min(1, newTrend)),
      spread,
      volumeDelta
    };
  }

  /**
   * Generate and broadcast order book updates
   */
  private generateAndBroadcastOrderBooks(): void {
    for (const [assetId, streamData] of this.assetStreams) {
      // Skip if no subscribers
      const subscribers = this.assetSubscriptions.get(assetId);
      if (!subscribers || subscribers.size === 0) continue;
      
      const orderBook = this.generateOrderBook(streamData);
      this.broadcastToAssetSubscribers(assetId, orderBook);
    }
  }

  /**
   * Generate realistic order book for an asset
   */
  private generateOrderBook(streamData: AssetStreamData): OrderBookUpdate {
    const { currentPrice, volatility } = streamData;
    const spread = currentPrice * (0.001 + volatility); // Dynamic spread
    
    // Generate bid orders (buy orders below current price)
    const bids: Array<{ price: number; quantity: number; total: number }> = [];
    let bidPrice = currentPrice - spread / 2;
    
    for (let i = 0; i < 10; i++) {
      const quantity = Math.floor(Math.random() * 1000 + 100);
      const price = parseFloat((bidPrice - i * currentPrice * 0.001).toFixed(2));
      bids.push({
        price,
        quantity,
        total: parseFloat((price * quantity).toFixed(2))
      });
    }
    
    // Generate ask orders (sell orders above current price)
    const asks: Array<{ price: number; quantity: number; total: number }> = [];
    let askPrice = currentPrice + spread / 2;
    
    for (let i = 0; i < 10; i++) {
      const quantity = Math.floor(Math.random() * 1000 + 100);
      const price = parseFloat((askPrice + i * currentPrice * 0.001).toFixed(2));
      asks.push({
        price,
        quantity,
        total: parseFloat((price * quantity).toFixed(2))
      });
    }
    
    return {
      type: 'ORDERBOOK_UPDATE',
      assetId: streamData.asset.id,
      symbol: streamData.asset.symbol,
      bids,
      asks,
      spread: parseFloat(spread.toFixed(4)),
      spreadPercent: parseFloat(((spread / currentPrice) * 100).toFixed(4)),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate and broadcast market pulse
   */
  private generateAndBroadcastMarketPulse(): void {
    const activeAssets = Array.from(this.assetStreams.values());
    
    // Calculate market-wide metrics
    const avgVolatility = activeAssets.reduce((sum, asset) => sum + asset.volatility, 0) / activeAssets.length;
    const bullishAssets = activeAssets.filter(a => a.trend > 0.1).length;
    const bearishAssets = activeAssets.filter(a => a.trend < -0.1).length;
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (bullishAssets > bearishAssets * 1.5) sentiment = 'bullish';
    else if (bearishAssets > bullishAssets * 1.5) sentiment = 'bearish';
    
    const pulse: MarketPulse = {
      type: 'MARKET_PULSE',
      totalAssets: this.assetStreams.size,
      activeTraders: Math.floor(Math.random() * 500 + 100), // Simulated active traders
      volumePulse: Math.random(), // Random pulse intensity
      volatilityIndex: parseFloat((avgVolatility * 100).toFixed(2)),
      sentiment,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to all connected clients
    this.broadcastToAll(pulse);
  }

  /**
   * Add a WebSocket client
   */
  addClient(ws: WebSocket): void {
    this.connectedClients.add(ws);
    console.log(`📡 Client connected. Total clients: ${this.connectedClients.size}`);
  }

  /**
   * Remove a WebSocket client
   */
  removeClient(ws: WebSocket): void {
    this.connectedClients.delete(ws);
    
    // Remove from all asset subscriptions
    for (const [assetId, subscribers] of this.assetSubscriptions) {
      subscribers.delete(ws);
      if (subscribers.size === 0) {
        this.assetSubscriptions.delete(assetId);
      }
    }
    
    console.log(`📡 Client disconnected. Total clients: ${this.connectedClients.size}`);
  }

  /**
   * Subscribe a client to an asset's price updates
   */
  subscribeToAsset(ws: WebSocket, assetId: string): void {
    if (!this.assetSubscriptions.has(assetId)) {
      this.assetSubscriptions.set(assetId, new Set());
    }
    this.assetSubscriptions.get(assetId)!.add(ws);
    
    const streamData = this.assetStreams.get(assetId);
    if (streamData) {
      streamData.subscriberCount++;
    }
    
    console.log(`📈 Client subscribed to asset ${assetId}`);
  }

  /**
   * Unsubscribe a client from an asset's price updates
   */
  unsubscribeFromAsset(ws: WebSocket, assetId: string): void {
    const subscribers = this.assetSubscriptions.get(assetId);
    if (subscribers) {
      subscribers.delete(ws);
      if (subscribers.size === 0) {
        this.assetSubscriptions.delete(assetId);
      }
      
      const streamData = this.assetStreams.get(assetId);
      if (streamData && streamData.subscriberCount > 0) {
        streamData.subscriberCount--;
      }
    }
    
    console.log(`📉 Client unsubscribed from asset ${assetId}`);
  }

  /**
   * Broadcast message to asset subscribers
   */
  private broadcastToAssetSubscribers(assetId: string, message: any): void {
    const subscribers = this.assetSubscriptions.get(assetId);
    if (!subscribers) return;
    
    const messageStr = JSON.stringify(message);
    for (const client of subscribers) {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(messageStr);
        } catch (error) {
          console.error('Error broadcasting to client:', error);
          this.removeClient(client);
        }
      }
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  private broadcastToAll(message: any): void {
    const messageStr = JSON.stringify(message);
    for (const client of this.connectedClients) {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(messageStr);
        } catch (error) {
          console.error('Error broadcasting to client:', error);
          this.removeClient(client);
        }
      }
    }
  }

  /**
   * Get streaming statistics
   */
  getStats(): {
    connectedClients: number;
    activeAssets: number;
    totalSubscriptions: number;
  } {
    let totalSubscriptions = 0;
    for (const subscribers of this.assetSubscriptions.values()) {
      totalSubscriptions += subscribers.size;
    }
    
    return {
      connectedClients: this.connectedClients.size,
      activeAssets: this.assetSubscriptions.size,
      totalSubscriptions
    };
  }
}

// Export singleton instance
export const priceStreamingService = new PriceStreamingService();