/**
 * WebSocket Service for Real-time Market Data
 * Connects to the market simulation engine for live price updates
 */

interface MarketDataUpdate {
  assetId: string;
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface PriceUpdate {
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
  intensity: number;
}

interface OrderBookUpdate {
  type: 'ORDERBOOK_UPDATE';
  assetId: string;
  symbol: string;
  bids: Array<{ price: number; quantity: number; total: number }>;
  asks: Array<{ price: number; quantity: number; total: number }>;
  spread: number;
  spreadPercent: number;
  timestamp: string;
}

interface MarketPulse {
  type: 'MARKET_PULSE';
  totalAssets: number;
  activeTraders: number;
  volumePulse: number;
  volatilityIndex: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: string;
}

interface PortfolioUpdate {
  portfolioId: string;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  timestamp: string;
}

interface MarketEventUpdate {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  relatedAssets: string[];
}

type WebSocketMessage = {
  type: 'market_data';
  data: MarketDataUpdate;
} | {
  type: 'portfolio_update';
  data: PortfolioUpdate;
} | {
  type: 'market_event';
  data: MarketEventUpdate;
} | {
  type: 'market_status';
  data: { status: 'open' | 'closed'; timestamp: string };
} | {
  type: 'market_overview' | 'market_update';
  data: any;
} | {
  type: 'pong';
  timestamp: number;
} | PriceUpdate | OrderBookUpdate | MarketPulse;

type WebSocketEventCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000; // 5 seconds
  private maxReconnectAttempts: number = 3; // Reduced from 10 to 3
  private reconnectAttempts: number = 0;
  private isConnecting: boolean = false;
  private eventHandlers: Map<string, WebSocketEventCallback[]> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    
    try {
      // Use the same protocol as the current page (ws for http, wss for https)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/market-data`;
      
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('connection', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.emit('connection', { status: 'disconnected' });
        
        // Only reconnect on abnormal closures (not 1000) and not on Vite HMR issues (1006)
        // 1006 is typically Vite HMR - don't aggressively reconnect
        if (event.code !== 1000 && event.code !== 1006 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else if (event.code === 1006 && this.reconnectAttempts === 0) {
          // On first 1006 error, try once more after longer delay
          console.log('⚠️ WebSocket closed abnormally (HMR issue) - will not auto-reconnect');
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
        this.emit('connection', { status: 'error', error });
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'market_data':
        this.emit('marketData', message.data);
        break;
      case 'market_data_snapshot':
        // Handle array of market data from initial snapshot
        if (Array.isArray(message.data)) {
          message.data.forEach((marketData: any) => {
            this.emit('marketData', marketData);
          });
        }
        break;
      case 'portfolio_update':
        this.emit('portfolioUpdate', message.data);
        break;
      case 'market_event':
        this.emit('marketEvent', message.data);
        break;
      case 'market_status':
        this.emit('marketStatus', message.data);
        break;
      case 'PRICE_UPDATE':
        this.emit('priceUpdate', message as PriceUpdate);
        this.emit('marketData', {
          assetId: message.assetId,
          symbol: message.symbol,
          currentPrice: message.price,
          change: message.change,
          changePercent: message.changePercent,
          volume: message.volume,
          timestamp: message.timestamp
        });
        break;
      case 'ORDERBOOK_UPDATE':
        this.emit('orderBookUpdate', message as OrderBookUpdate);
        break;
      case 'MARKET_PULSE':
        this.emit('marketPulse', message as MarketPulse);
        break;
      case 'market_overview':
      case 'market_update':
        // Handle market overview/update messages from server
        this.emit('marketOverview', message.data);
        break;
      case 'pong':
        // Handle pong responses for keepalive
        break;
      default:
        console.warn('🤷 Unknown WebSocket message type:', message);
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * this.reconnectAttempts, 30000); // Max 30 seconds
    
    console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect();
      } else {
        console.error('❌ Max reconnection attempts reached. Please refresh the page.');
        this.emit('connection', { status: 'failed', message: 'Max reconnection attempts reached' });
      }
    }, delay);
  }

  /**
   * Start sending heartbeat pings to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop the heartbeat interval
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Subscribe to specific asset updates
   */
  subscribeToAsset(assetId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe_asset',
        assetId: assetId
      }));
      console.log('📡 Subscribed to asset updates:', assetId);
    }
  }
  
  /**
   * Subscribe to multiple assets at once
   */
  subscribeToAssets(assetIds: string[]): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe_assets',
        assetIds: assetIds
      }));
      console.log(`📡 Subscribed to ${assetIds.length} assets`);
    }
  }

  /**
   * Unsubscribe from specific asset updates
   */
  unsubscribeFromAsset(assetId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe_asset',
        assetId: assetId
      }));
      console.log('📡 Unsubscribed from asset updates:', assetId);
    }
  }

  /**
   * Subscribe to portfolio updates
   */
  subscribeToPortfolio(portfolioId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe_portfolio',
        data: { portfolioId }
      }));
      console.log('📡 Subscribed to portfolio updates:', portfolioId);
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: WebSocketEventCallback): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: WebSocketEventCallback): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`❌ Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'disconnecting';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }

  /**
   * Manually disconnect
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      // Use RFC 6455 compliant close code
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
  }

  /**
   * Cleanup when service is destroyed
   */
  destroy(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.disconnect();
    this.eventHandlers.clear();
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();

// Export types for use in components
export type { MarketDataUpdate, PortfolioUpdate, MarketEventUpdate, WebSocketMessage, PriceUpdate, OrderBookUpdate, MarketPulse };