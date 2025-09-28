import { storage } from './storage.js';
import type { 
  Asset, AssetCurrentPrice, InsertAssetCurrentPrice, InsertMarketData,
  Order, InsertOrder, Portfolio, Holding, InsertHolding,
  MarketEvent
} from '@shared/schema.js';

/**
 * Market Simulation Engine for Panel Profits Phase 1 Trading Platform
 * 
 * Provides realistic price generation, order matching, and market dynamics
 * for comic asset trading simulation.
 */

export interface MarketConfig {
  // Price generation parameters
  baseVolatility: number; // Base daily volatility (0.02 = 2%)
  trendStrength: number; // How strong trends are (0.0-1.0)
  meanReversion: number; // Mean reversion factor (0.0-1.0)
  
  // Spread and liquidity parameters
  minSpreadPercent: number; // Minimum bid-ask spread (0.001 = 0.1%)
  maxSpreadPercent: number; // Maximum bid-ask spread (0.05 = 5%)
  liquidityFactor: number; // Base liquidity multiplier
  
  // Volume simulation
  baseVolumePerDay: number; // Base trading volume per day
  volumeVariability: number; // Volume randomness factor
  
  // Order execution
  slippageFactor: number; // Price impact from large orders
  commissionRate: number; // Trading commission (0.001 = 0.1%)
  
  // Market hours
  marketOpenHour: number; // Market open hour (9 = 9 AM)
  marketCloseHour: number; // Market close hour (16 = 4 PM)
}

export const DEFAULT_MARKET_CONFIG: MarketConfig = {
  baseVolatility: 0.025, // 2.5% daily volatility
  trendStrength: 0.3,
  meanReversion: 0.1,
  minSpreadPercent: 0.002, // 0.2%
  maxSpreadPercent: 0.02, // 2%
  liquidityFactor: 1.0,
  baseVolumePerDay: 1000,
  volumeVariability: 0.3,
  slippageFactor: 0.001,
  commissionRate: 0.001, // 0.1%
  marketOpenHour: 9,
  marketCloseHour: 16,
};

interface AssetMarketData {
  asset: Asset;
  currentPrice: AssetCurrentPrice;
  priceHistory: number[];
  trend: number; // -1 to 1, negative = bearish, positive = bullish
  momentum: number;
  volatility: number;
  volume24h: number;
  marketCap?: number;
}

interface OrderExecution {
  orderId: string;
  executedQuantity: number;
  executedPrice: number;
  fees: number;
  slippage: number;
  timestamp: Date;
}

export class MarketSimulationEngine {
  private config: MarketConfig;
  private marketData: Map<string, AssetMarketData> = new Map();
  private marketEvents: MarketEvent[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;
  private lastUpdateTime: Date = new Date();
  
  constructor(config: MarketConfig = DEFAULT_MARKET_CONFIG) {
    this.config = config;
  }

  /**
   * Initialize the market simulation engine
   */
  async initialize(): Promise<void> {
    console.log('🏪 Initializing Market Simulation Engine...');
    
    // Load all assets and their current prices
    const assets = await storage.getAssets();
    
    for (const asset of assets) {
      await this.initializeAssetMarketData(asset);
    }
    
    // Load active market events
    this.marketEvents = await storage.getMarketEvents({ isActive: true });
    
    console.log(`📈 Market simulation initialized with ${assets.length} assets`);
  }

  /**
   * Start the market simulation (real-time price updates)
   */
  start(updateIntervalMs: number = 60000): void { // Default: 1 minute updates
    if (this.simulationInterval) {
      console.warn('⚠️ Market simulation already running');
      return;
    }

    console.log('🚀 Starting market simulation engine...');
    
    this.simulationInterval = setInterval(async () => {
      if (this.isMarketOpen()) {
        await this.updateAllAssetPrices();
        
        // Generate random market events occasionally
        if (Math.random() < 0.05) { // 5% chance per update cycle
          await this.generateRandomMarketEvent();
        }
        
        // Process pending orders every few update cycles
        if (Math.random() < 0.3) { // 30% chance = roughly every 3rd update cycle
          await orderMatching.processAllPendingOrders();
        }
      }
    }, updateIntervalMs);
  }

  /**
   * Stop the market simulation
   */
  stop(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log('🛑 Market simulation stopped');
    }
  }

  /**
   * Check if market is currently open
   */
  isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    
    // Simple market hours check (can be enhanced for weekends, holidays)
    return hour >= this.config.marketOpenHour && hour < this.config.marketCloseHour;
  }

  /**
   * Initialize market data for a specific asset
   */
  private async initializeAssetMarketData(asset: Asset): Promise<void> {
    let currentPrice = await storage.getAssetCurrentPrice(asset.id);
    
    if (!currentPrice) {
      // Generate initial price based on asset characteristics
      const initialPrice = this.generateInitialPrice(asset);
      
      const newPrice: InsertAssetCurrentPrice = {
        assetId: asset.id,
        currentPrice: initialPrice.toString(),
        bidPrice: (initialPrice * 0.999).toString(),
        askPrice: (initialPrice * 1.001).toString(),
        volume: Math.floor(Math.random() * this.config.baseVolumePerDay),
        volatility: this.calculateAssetVolatility(asset).toString(),
        marketStatus: 'open',
        priceSource: 'simulation',
      };
      
      currentPrice = await storage.createAssetCurrentPrice(newPrice);
    }
    
    const marketData: AssetMarketData = {
      asset,
      currentPrice,
      priceHistory: [parseFloat(currentPrice.currentPrice)],
      trend: (Math.random() - 0.5) * 2, // Random initial trend
      momentum: 0,
      volatility: parseFloat(currentPrice.volatility || '0.02'),
      volume24h: currentPrice.volume,
      marketCap: this.calculateMarketCap(asset, parseFloat(currentPrice.currentPrice)),
    };
    
    this.marketData.set(asset.id, marketData);
  }

  /**
   * Generate realistic initial price for an asset
   */
  private generateInitialPrice(asset: Asset): number {
    const metadata = asset.metadata as any;
    
    // Base price factors
    let basePrice = 10; // Default $10
    
    // Asset type multipliers
    switch (asset.type) {
      case 'character':
        basePrice = 25; // Characters typically more valuable
        break;
      case 'comic':
        basePrice = 15;
        break;
      case 'creator':
        basePrice = 30; // Creators can be premium
        break;
      case 'publisher':
        basePrice = 50; // Publishers typically highest value
        break;
    }
    
    // Popularity/rarity modifiers
    if (metadata?.popularity) {
      const popularity = parseFloat(metadata.popularity) || 0.5;
      basePrice *= (0.5 + popularity * 1.5); // 0.5x to 2x multiplier
    }
    
    if (metadata?.rarity) {
      const rarity = parseFloat(metadata.rarity) || 0.5;
      basePrice *= (0.8 + rarity * 0.4); // 0.8x to 1.2x multiplier
    }
    
    // Add some randomness
    basePrice *= (0.8 + Math.random() * 0.4); // ±20% random variation
    
    return Math.round(basePrice * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate asset volatility based on characteristics
   */
  private calculateAssetVolatility(asset: Asset): number {
    const metadata = asset.metadata as any;
    let volatility = this.config.baseVolatility;
    
    // More popular assets might be less volatile
    if (metadata?.popularity) {
      const popularity = parseFloat(metadata.popularity) || 0.5;
      volatility *= (1.5 - popularity * 0.5); // High popularity = lower volatility
    }
    
    // Rare assets might be more volatile
    if (metadata?.rarity) {
      const rarity = parseFloat(metadata.rarity) || 0.5;
      volatility *= (0.8 + rarity * 0.4); // Higher rarity = higher volatility
    }
    
    // Asset type modifiers
    switch (asset.type) {
      case 'character':
        volatility *= 1.2; // Characters more volatile
        break;
      case 'comic':
        volatility *= 1.0; // Base volatility
        break;
      case 'creator':
        volatility *= 0.9; // Creators slightly less volatile
        break;
      case 'publisher':
        volatility *= 0.7; // Publishers least volatile
        break;
    }
    
    return Math.max(0.005, Math.min(0.1, volatility)); // Clamp between 0.5% and 10%
  }

  /**
   * Calculate market cap for an asset
   */
  private calculateMarketCap(asset: Asset, price: number): number {
    const metadata = asset.metadata as any;
    
    // Estimate total supply based on asset type
    let estimatedSupply = 1000000; // Default 1M shares
    
    switch (asset.type) {
      case 'character':
        estimatedSupply = 500000; // Characters have lower supply
        break;
      case 'comic':
        estimatedSupply = 750000;
        break;
      case 'creator':
        estimatedSupply = 300000; // Creators have lowest supply
        break;
      case 'publisher':
        estimatedSupply = 2000000; // Publishers have highest supply
        break;
    }
    
    if (metadata?.totalSupply) {
      estimatedSupply = parseInt(metadata.totalSupply);
    }
    
    return price * estimatedSupply;
  }

  /**
   * Update prices for all assets
   */
  private async updateAllAssetPrices(): Promise<void> {
    const now = new Date();
    const timeDelta = (now.getTime() - this.lastUpdateTime.getTime()) / 1000 / 60; // Minutes
    
    const priceUpdates: Promise<void>[] = [];
    
    for (const [assetId, marketData] of this.marketData) {
      priceUpdates.push(this.updateAssetPrice(assetId, marketData, timeDelta));
    }
    
    await Promise.all(priceUpdates);
    this.lastUpdateTime = now;
    
    console.log(`📊 Updated prices for ${this.marketData.size} assets`);
  }

  /**
   * Update price for a specific asset
   */
  private async updateAssetPrice(assetId: string, marketData: AssetMarketData, timeDelta: number): Promise<void> {
    const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
    
    // Generate price movement
    const priceChange = this.generatePriceMovement(marketData, timeDelta);
    const newPrice = Math.max(0.01, currentPrice * (1 + priceChange));
    
    // Update trend and momentum
    marketData.trend = this.updateTrend(marketData.trend, priceChange);
    marketData.momentum = priceChange;
    
    // Calculate bid/ask spread
    const spread = this.calculateSpread(marketData);
    const bidPrice = newPrice * (1 - spread / 2);
    const askPrice = newPrice * (1 + spread / 2);
    
    // Simulate volume
    const newVolume = this.simulateVolume(marketData);
    
    // Update market data
    marketData.priceHistory.push(newPrice);
    if (marketData.priceHistory.length > 1440) { // Keep 24 hours of minute data
      marketData.priceHistory.shift();
    }
    
    // Update in database
    const updatedPrice = await storage.updateAssetCurrentPrice(assetId, {
      currentPrice: newPrice.toFixed(2),
      bidPrice: bidPrice.toFixed(2),
      askPrice: askPrice.toFixed(2),
      dayChange: ((newPrice - currentPrice)).toFixed(2),
      dayChangePercent: ((newPrice / currentPrice - 1) * 100).toFixed(2),
      volume: newVolume,
      lastTradePrice: newPrice.toFixed(2),
      lastTradeTime: new Date(),
    });
    
    if (updatedPrice) {
      marketData.currentPrice = updatedPrice;
    }
    
    // Store historical data (every 5 minutes to avoid too much data)
    if (Math.random() < 0.2) { // 20% chance = roughly every 5 updates
      await this.storeHistoricalData(assetId, newPrice, newVolume);
    }
  }

  /**
   * Generate realistic price movement
   */
  private generatePriceMovement(marketData: AssetMarketData, timeDelta: number): number {
    const { volatility, trend } = marketData;
    
    // Random walk component
    const randomComponent = (Math.random() - 0.5) * 2;
    
    // Trend component
    const trendComponent = trend * this.config.trendStrength;
    
    // Mean reversion component
    const meanReversionComponent = -trend * this.config.meanReversion;
    
    // Apply market events
    const eventComponent = this.applyMarketEvents(marketData.asset);
    
    // Combine components
    const totalMovement = (
      randomComponent * volatility * 0.7 +
      trendComponent * volatility * 0.2 +
      meanReversionComponent * volatility * 0.1 +
      eventComponent
    );
    
    // Scale by time delta (for different update frequencies)
    return totalMovement * Math.sqrt(timeDelta / 60); // Normalize to hourly movements
  }

  /**
   * Update trend based on recent price movements
   */
  private updateTrend(currentTrend: number, priceChange: number): number {
    // Momentum-based trend updates
    const momentumImpact = priceChange * 10; // Amplify momentum effect
    let newTrend = currentTrend * 0.95 + momentumImpact * 0.05; // Slow trend changes
    
    // Clamp trend between -1 and 1
    return Math.max(-1, Math.min(1, newTrend));
  }

  /**
   * Calculate bid-ask spread based on volatility and liquidity
   */
  private calculateSpread(marketData: AssetMarketData): number {
    const { volatility } = marketData;
    const { minSpreadPercent, maxSpreadPercent } = this.config;
    
    // Base spread increases with volatility
    let spread = minSpreadPercent + (volatility * 2); // Higher volatility = wider spread
    
    // Liquidity factor (could be enhanced with order book depth)
    spread /= this.config.liquidityFactor;
    
    // Clamp spread
    return Math.max(minSpreadPercent, Math.min(maxSpreadPercent, spread));
  }

  /**
   * Simulate trading volume
   */
  private simulateVolume(marketData: AssetMarketData): number {
    const baseVolume = this.config.baseVolumePerDay / (24 * 60); // Per minute
    
    // Volume influenced by price movement and trend
    const priceMovementFactor = 1 + Math.abs(marketData.momentum) * 5;
    const trendFactor = 1 + Math.abs(marketData.trend) * 0.3;
    
    // Add randomness
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7x to 1.3x
    
    return Math.floor(baseVolume * priceMovementFactor * trendFactor * randomFactor);
  }

  /**
   * Apply market events to price movements with enhanced simulation
   */
  private applyMarketEvents(asset: Asset): number {
    let eventImpact = 0;
    
    for (const event of this.marketEvents) {
      if (event.affectedAssets?.includes(asset.id)) {
        const impact = this.calculateEventImpact(event, asset);
        
        // Events decay over time with different rates based on type
        const eventAge = new Date().getTime() - new Date(event.eventDate || event.createdAt).getTime();
        const ageInDays = eventAge / (1000 * 60 * 60 * 24);
        const decayFactor = this.getEventDecayFactor(event.category, ageInDays);
        
        eventImpact += impact * decayFactor;
      }
    }
    
    return eventImpact;
  }

  /**
   * Calculate sophisticated event impact based on type and asset characteristics
   */
  private calculateEventImpact(event: MarketEvent, asset: Asset): number {
    let baseImpact = 0;
    
    // Base impact from event type
    switch (event.impact) {
      case 'positive':
        baseImpact = 0.05; // 5% base positive impact
        break;
      case 'negative':
        baseImpact = -0.05; // 5% base negative impact
        break;
      case 'neutral':
        baseImpact = 0;
        break;
    }

    // Category-specific multipliers
    const categoryMultiplier = this.getCategoryMultiplier(event.category, asset);
    
    // Significance multiplier (0.5x to 3x)
    const significanceMultiplier = 0.5 + (parseFloat(event.significance || '5') / 10) * 2.5;
    
    // Asset-specific factors
    const assetMultiplier = this.getAssetEventMultiplier(asset, event);
    
    return baseImpact * categoryMultiplier * significanceMultiplier * assetMultiplier;
  }

  /**
   * Get category-specific impact multipliers
   */
  private getCategoryMultiplier(category: string | null, asset: Asset): number {
    const metadata = asset.metadata as any;
    
    switch (category) {
      case 'movie_release':
        // Movies have huge impact on character assets
        return asset.type === 'character' ? 2.5 : 1.2;
      
      case 'comic_convention':
        // Conventions boost all comic-related assets
        return 1.8;
      
      case 'creator_news':
        // Creator news impacts creator assets and their associated works
        return asset.type === 'creator' ? 3.0 : 1.5;
      
      case 'publisher_announcement':
        // Publisher news impacts publisher and their properties
        const assetPublisher = metadata?.publisher;
        return asset.type === 'publisher' || assetPublisher === event.title ? 2.2 : 1.0;
      
      case 'industry_news':
        // Industry news has moderate impact across all assets
        return 1.3;
      
      case 'award_ceremony':
        // Awards boost specific assets significantly
        return 2.0;
      
      case 'tv_series':
        // TV series have sustained impact on character assets
        return asset.type === 'character' ? 2.0 : 1.1;
      
      default:
        return 1.0;
    }
  }

  /**
   * Get asset-specific event multipliers
   */
  private getAssetEventMultiplier(asset: Asset, event: MarketEvent): number {
    const metadata = asset.metadata as any;
    let multiplier = 1.0;
    
    // Popularity factor (more popular = more sensitive to events)
    if (metadata?.popularity) {
      const popularity = parseFloat(metadata.popularity) || 0.5;
      multiplier *= (0.8 + popularity * 0.4); // 0.8x to 1.2x based on popularity
    }
    
    // Rarity factor (rare assets less affected by general events)
    if (metadata?.rarity) {
      const rarity = parseFloat(metadata.rarity) || 0.5;
      if (event.category !== 'creator_news' && event.category !== 'award_ceremony') {
        multiplier *= (1.2 - rarity * 0.4); // Less impact for rare assets on general events
      }
    }
    
    // Market cap factor (larger market cap = less volatile)
    const marketData = this.marketData.get(asset.id);
    if (marketData?.marketCap) {
      const capMultiplier = Math.max(0.5, Math.min(1.5, 100000000 / marketData.marketCap));
      multiplier *= capMultiplier;
    }
    
    return multiplier;
  }

  /**
   * Get event decay factor based on category and age
   */
  private getEventDecayFactor(category: string | null, ageInDays: number): number {
    const decayRates = {
      'movie_release': 30, // Movies have long-lasting impact
      'tv_series': 60, // TV series have very long impact
      'comic_convention': 7, // Conventions are short-term
      'creator_news': 14, // Creator news moderate duration
      'publisher_announcement': 21, // Publisher news longer impact
      'industry_news': 10, // Industry news moderate
      'award_ceremony': 14, // Awards moderate duration
      'default': 7
    };
    
    const decayPeriod = decayRates[category as keyof typeof decayRates] || decayRates.default;
    return Math.exp(-ageInDays / decayPeriod);
  }

  /**
   * Generate random market events to simulate dynamic market conditions
   */
  async generateRandomMarketEvent(): Promise<void> {
    // Only generate events occasionally
    if (Math.random() > 0.1) return; // 10% chance
    
    const eventTypes = [
      { category: 'industry_news', weight: 3 },
      { category: 'comic_convention', weight: 2 },
      { category: 'creator_news', weight: 2 },
      { category: 'publisher_announcement', weight: 2 },
      { category: 'movie_release', weight: 1 },
      { category: 'tv_series', weight: 1 },
      { category: 'award_ceremony', weight: 1 },
    ];
    
    // Weighted random selection
    const totalWeight = eventTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedCategory = 'industry_news';
    for (const type of eventTypes) {
      random -= type.weight;
      if (random <= 0) {
        selectedCategory = type.category;
        break;
      }
    }
    
    // Generate event details
    const impact = Math.random() > 0.5 ? 'positive' : 'negative';
    const significance = Math.floor(Math.random() * 10) + 1; // 1-10
    
    // Select affected assets (1-3 random assets)
    const allAssets = Array.from(this.marketData.keys());
    const numAffected = Math.floor(Math.random() * 3) + 1;
    const affectedAssets = this.shuffleArray(allAssets).slice(0, numAffected);
    
    const event = {
      title: this.generateEventTitle(selectedCategory, impact),
      description: this.generateEventDescription(selectedCategory, impact),
      category: selectedCategory,
      impact,
      significance: significance.toString(),
      affectedAssets,
      eventDate: new Date(),
      isActive: true,
    };
    
    try {
      await storage.createMarketEvent(event);
      console.log(`📰 Generated market event: ${event.title} (${impact}, significance: ${significance})`);
    } catch (error) {
      console.error('Error creating market event:', error);
    }
  }

  /**
   * Generate realistic event titles
   */
  private generateEventTitle(category: string, impact: string): string {
    const titles = {
      movie_release: {
        positive: ['Major Studio Announces Blockbuster Adaptation', 'Star-Studded Cast Revealed for Upcoming Film', 'Record Box Office Opening Weekend Predicted'],
        negative: ['Film Adaptation Faces Production Delays', 'Director Drops Out of Highly Anticipated Movie', 'Studio Cuts Budget for Planned Adaptation']
      },
      comic_convention: {
        positive: ['Major Comic Convention Announces Record Attendance', 'Exclusive Reveals Expected at Upcoming Convention', 'Industry Veterans Confirm Convention Appearances'],
        negative: ['Comic Convention Faces Venue Issues', 'Major Publishers Skip Upcoming Convention', 'Convention Tickets Sales Below Expectations']
      },
      creator_news: {
        positive: ['Legendary Creator Signs Exclusive Deal', 'Award-Winning Creator Announces New Project', 'Creator\'s Work Adapted for Streaming Platform'],
        negative: ['Creator Announces Retirement from Industry', 'Legal Issues Surrounding Creator\'s Work', 'Creator\'s New Project Receives Mixed Reviews']
      },
      industry_news: {
        positive: ['Comic Industry Reports Record Sales Growth', 'Digital Comics Platform Gains Major Traction', 'New Investment Flows into Comic Industry'],
        negative: ['Comic Sales Decline in Recent Quarter', 'Industry Faces Distribution Challenges', 'Print Comics Market Shows Weakness']
      }
    };
    
    const categoryTitles = titles[category as keyof typeof titles] || titles.industry_news;
    const impactTitles = categoryTitles[impact as keyof typeof categoryTitles];
    
    return impactTitles[Math.floor(Math.random() * impactTitles.length)];
  }

  /**
   * Generate realistic event descriptions
   */
  private generateEventDescription(category: string, impact: string): string {
    const descriptions = {
      movie_release: impact === 'positive' 
        ? 'Industry sources report strong market confidence in upcoming adaptations.'
        : 'Market concerns grow over adaptation quality and production timeline.',
      comic_convention: impact === 'positive'
        ? 'Strong attendance and industry engagement expected to boost market sentiment.'
        : 'Reduced industry participation may signal weakening market confidence.',
      creator_news: impact === 'positive'
        ? 'Creator developments typically drive significant interest in related properties.'
        : 'Changes in creator status often impact associated asset valuations.',
      industry_news: impact === 'positive'
        ? 'Positive industry trends support broad market growth expectations.'
        : 'Industry challenges may create headwinds for market performance.'
    };
    
    return descriptions[category as keyof typeof descriptions] || descriptions.industry_news;
  }

  /**
   * Utility function to shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Store historical market data with multi-timeframe support
   */
  private async storeHistoricalData(assetId: string, price: number, volume: number): Promise<void> {
    const now = new Date();
    const marketData = this.marketData.get(assetId);
    if (!marketData) return;

    // Always store 1-minute data as base timeframe
    await this.storeOHLCData(assetId, '1m', now, price, volume, marketData);
    
    // Aggregate and store higher timeframes periodically
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const day = now.getDate();
    
    // Store 5-minute data every 5 minutes
    if (minutes % 5 === 0) {
      await this.aggregateAndStoreTimeframe(assetId, '5m', now, 5);
    }
    
    // Store 15-minute data every 15 minutes
    if (minutes % 15 === 0) {
      await this.aggregateAndStoreTimeframe(assetId, '15m', now, 15);
    }
    
    // Store 1-hour data every hour
    if (minutes === 0) {
      await this.aggregateAndStoreTimeframe(assetId, '1h', now, 60);
    }
    
    // Store 4-hour data every 4 hours
    if (minutes === 0 && hours % 4 === 0) {
      await this.aggregateAndStoreTimeframe(assetId, '4h', now, 240);
    }
    
    // Store daily data at midnight
    if (minutes === 0 && hours === 0) {
      await this.aggregateAndStoreTimeframe(assetId, '1d', now, 1440);
    }
  }

  /**
   * Store OHLC data for a specific timeframe
   */
  private async storeOHLCData(
    assetId: string, 
    timeframe: string, 
    timestamp: Date, 
    price: number, 
    volume: number,
    marketData: AssetMarketData
  ): Promise<void> {
    // Calculate realistic OHLC based on volatility and recent price history
    const volatility = marketData.volatility;
    const priceVariation = price * volatility * 0.1; // Small intraperiod variation
    
    const open = price;
    const high = price + (Math.random() * priceVariation);
    const low = price - (Math.random() * priceVariation);
    const close = price + (Math.random() - 0.5) * priceVariation * 0.5;
    
    // Calculate change from previous period
    const previousPrice = marketData.priceHistory[marketData.priceHistory.length - 2] || price;
    const change = close - previousPrice;
    const percentChange = (change / previousPrice) * 100;

    const ohlcData: InsertMarketData = {
      assetId,
      timeframe,
      periodStart: this.roundTimeToTimeframe(timestamp, timeframe),
      open: open.toFixed(2),
      high: Math.max(open, high, low, close).toFixed(2),
      low: Math.min(open, high, low, close).toFixed(2),
      close: close.toFixed(2),
      volume,
      change: change.toFixed(2),
      percentChange: percentChange.toFixed(2),
      technicalIndicators: await this.calculateTechnicalIndicators(assetId, timeframe, close),
    };
    
    try {
      await storage.createMarketData(ohlcData);
    } catch (error) {
      console.error(`Error storing ${timeframe} data for ${assetId}:`, error);
    }
  }

  /**
   * Aggregate minute data into higher timeframes
   */
  private async aggregateAndStoreTimeframe(
    assetId: string, 
    timeframe: string, 
    currentTime: Date, 
    minutes: number
  ): Promise<void> {
    try {
      const endTime = new Date(currentTime);
      const startTime = new Date(endTime.getTime() - (minutes * 60 * 1000));
      
      // Get 1-minute data for aggregation
      const minuteData = await storage.getMarketDataHistory(assetId, '1m', minutes, startTime, endTime);
      
      if (minuteData.length === 0) return;
      
      // Aggregate OHLC data
      const open = parseFloat(minuteData[minuteData.length - 1].open); // First in chronological order
      const close = parseFloat(minuteData[0].close); // Last in chronological order
      const high = Math.max(...minuteData.map(d => parseFloat(d.high)));
      const low = Math.min(...minuteData.map(d => parseFloat(d.low)));
      const volume = minuteData.reduce((sum, d) => sum + d.volume, 0);
      
      const change = close - open;
      const percentChange = (change / open) * 100;

      const aggregatedData: InsertMarketData = {
        assetId,
        timeframe,
        periodStart: this.roundTimeToTimeframe(currentTime, timeframe),
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: close.toFixed(2),
        volume,
        change: change.toFixed(2),
        percentChange: percentChange.toFixed(2),
        technicalIndicators: await this.calculateTechnicalIndicators(assetId, timeframe, close),
      };
      
      await storage.createMarketData(aggregatedData);
      console.log(`📊 Aggregated ${timeframe} data for ${assetId}: O:${open.toFixed(2)} H:${high.toFixed(2)} L:${low.toFixed(2)} C:${close.toFixed(2)}`);
    } catch (error) {
      console.error(`Error aggregating ${timeframe} data for ${assetId}:`, error);
    }
  }

  /**
   * Round timestamp to appropriate timeframe boundary
   */
  private roundTimeToTimeframe(timestamp: Date, timeframe: string): Date {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case '1m':
        date.setSeconds(0, 0);
        break;
      case '5m':
        date.setMinutes(Math.floor(date.getMinutes() / 5) * 5, 0, 0);
        break;
      case '15m':
        date.setMinutes(Math.floor(date.getMinutes() / 15) * 15, 0, 0);
        break;
      case '1h':
        date.setMinutes(0, 0, 0);
        break;
      case '4h':
        date.setHours(Math.floor(date.getHours() / 4) * 4, 0, 0, 0);
        break;
      case '1d':
        date.setHours(0, 0, 0, 0);
        break;
      default:
        date.setSeconds(0, 0);
    }
    
    return date;
  }

  /**
   * Get current market overview
   */
  async getMarketOverview(): Promise<{
    totalAssets: number;
    totalMarketCap: number;
    totalVolume24h: number;
    marketStatus: string;
    topGainers: Array<{ assetId: string; symbol: string; change: number }>;
    topLosers: Array<{ assetId: string; symbol: string; change: number }>;
  }> {
    const assets = Array.from(this.marketData.values());
    
    const totalMarketCap = assets.reduce((sum, data) => sum + (data.marketCap || 0), 0);
    const totalVolume24h = assets.reduce((sum, data) => sum + data.volume24h, 0);
    
    // Sort by day change for gainers/losers
    const sorted = assets
      .map(data => ({
        assetId: data.asset.id,
        symbol: data.asset.symbol,
        change: parseFloat(data.currentPrice.dayChangePercent || '0'),
      }))
      .sort((a, b) => b.change - a.change);
    
    return {
      totalAssets: assets.length,
      totalMarketCap,
      totalVolume24h,
      marketStatus: this.isMarketOpen() ? 'open' : 'closed',
      topGainers: sorted.slice(0, 5),
      topLosers: sorted.slice(-5).reverse(),
    };
  }

  /**
   * Get detailed market data for a specific asset
   */
  getAssetMarketData(assetId: string): AssetMarketData | undefined {
    return this.marketData.get(assetId);
  }

  /**
   * Get current prices for multiple assets
   */
  async getCurrentPrices(assetIds: string[]): Promise<AssetCurrentPrice[]> {
    return await storage.getAssetCurrentPrices(assetIds);
  }

  /**
   * Calculate technical indicators for market data
   */
  private async calculateTechnicalIndicators(assetId: string, timeframe: string, currentPrice: number): Promise<any> {
    try {
      // Get historical data for calculations (last 50 periods for most indicators)
      const historicalData = await storage.getMarketDataHistory(assetId, timeframe, 50);
      
      if (historicalData.length < 14) {
        // Not enough data for most indicators
        return {
          sma_20: currentPrice,
          ema_12: currentPrice,
          ema_26: currentPrice,
          rsi_14: 50, // Neutral RSI
          macd: { signal: 0, histogram: 0, macd: 0 },
          volume_sma: 0,
        };
      }

      const prices = [currentPrice, ...historicalData.map(d => parseFloat(d.close))];
      const volumes = [0, ...historicalData.map(d => d.volume)];

      return {
        sma_20: this.calculateSMA(prices, 20),
        ema_12: this.calculateEMA(prices, 12),
        ema_26: this.calculateEMA(prices, 26),
        rsi_14: this.calculateRSI(prices, 14),
        macd: this.calculateMACD(prices),
        volume_sma: this.calculateSMA(volumes, 20),
        bollinger: this.calculateBollingerBands(prices, 20, 2),
      };
    } catch (error) {
      console.error('Error calculating technical indicators:', error);
      return {};
    }
  }

  /**
   * Simple Moving Average
   */
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[0] || 0;
    
    const slice = prices.slice(0, period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  }

  /**
   * Exponential Moving Average
   */
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[0] || 0;
    
    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(prices.slice(-period), period);
    
    for (let i = prices.length - period - 1; i >= 0; i--) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  /**
   * Relative Strength Index
   */
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length && i <= period; i++) {
      const change = prices[i - 1] - prices[i];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  /**
   * MACD (Moving Average Convergence Divergence)
   */
  private calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    
    // Signal line is 9-period EMA of MACD line
    // For simplicity, using approximation here
    const signal = macd * 0.2; // Simplified signal line
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  }

  /**
   * Bollinger Bands
   */
  private calculateBollingerBands(prices: number[], period: number, stdDev: number): { upper: number; middle: number; lower: number } {
    const sma = this.calculateSMA(prices, period);
    const slice = prices.slice(0, period);
    
    // Calculate standard deviation
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev),
    };
  }
}

/**
 * Order Matching Engine for processing trades
 */
export class OrderMatchingEngine {
  private config: MarketConfig;
  private marketEngine: MarketSimulationEngine;

  constructor(marketEngine: MarketSimulationEngine, config: MarketConfig = DEFAULT_MARKET_CONFIG) {
    this.marketEngine = marketEngine;
    this.config = config;
  }

  /**
   * Process a new order - either market or limit order
   */
  async processOrder(order: Order): Promise<OrderExecution | null> {
    try {
      // Validate order
      const validationResult = await this.validateOrder(order);
      if (!validationResult.isValid) {
        await this.rejectOrder(order.id, validationResult.reason || 'Order validation failed');
        return null;
      }

      // Process based on order type
      switch (order.orderType) {
        case 'market':
          return await this.processMarketOrder(order);
        case 'limit':
          return await this.processLimitOrder(order);
        case 'stop':
          return await this.processStopOrder(order);
        default:
          await this.rejectOrder(order.id, `Unsupported order type: ${order.orderType}`);
          return null;
      }
    } catch (error) {
      console.error('Error processing order:', error);
      await this.rejectOrder(order.id, 'Internal error processing order');
      return null;
    }
  }

  /**
   * Process market order - immediate execution at current price
   */
  private async processMarketOrder(order: Order): Promise<OrderExecution | null> {
    const marketData = this.marketEngine.getAssetMarketData(order.assetId);
    if (!marketData) {
      await this.rejectOrder(order.id, 'Asset not found');
      return null;
    }

    const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
    const quantity = parseFloat(order.quantity);
    
    // Determine execution price based on order side
    let executionPrice: number;
    if (order.type === 'buy') {
      executionPrice = parseFloat(marketData.currentPrice.askPrice || currentPrice.toString());
    } else {
      executionPrice = parseFloat(marketData.currentPrice.bidPrice || currentPrice.toString());
    }

    // Calculate slippage for large orders
    const slippage = this.calculateSlippage(quantity, marketData);
    if (order.type === 'buy') {
      executionPrice *= (1 + slippage);
    } else {
      executionPrice *= (1 - slippage);
    }

    // Calculate fees
    const totalValue = quantity * executionPrice;
    const fees = this.calculateOrderFees(totalValue);

    // Execute the order
    const execution: OrderExecution = {
      orderId: order.id,
      executedQuantity: quantity,
      executedPrice: executionPrice,
      fees,
      slippage: slippage * 100, // Convert to percentage
      timestamp: new Date(),
    };

    // Update order status
    await storage.updateOrder(order.id, {
      status: 'filled',
      filledQuantity: quantity.toString(),
      averageFillPrice: executionPrice.toString(),
      fees: fees.toString(),
      filledAt: new Date(),
      executionDetails: {
        executionType: 'market',
        slippage: execution.slippage,
        marketPrice: currentPrice,
      },
    });

    // Update portfolio holdings
    await this.updatePortfolioHoldings(order, execution);

    // Update market data (add volume, update last trade)
    await this.updateMarketAfterTrade(order.assetId, quantity, executionPrice);

    return execution;
  }

  /**
   * Process limit order - execute only if price reaches limit
   */
  private async processLimitOrder(order: Order): Promise<OrderExecution | null> {
    const marketData = this.marketEngine.getAssetMarketData(order.assetId);
    if (!marketData) {
      await this.rejectOrder(order.id, 'Asset not found');
      return null;
    }

    const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
    const limitPrice = parseFloat(order.price || '0');
    const quantity = parseFloat(order.quantity);

    // Check if limit order can be executed
    let canExecute = false;
    let executionPrice = limitPrice;

    if (order.type === 'buy' && currentPrice <= limitPrice) {
      canExecute = true;
      // For buy orders, execute at the better of current price or limit price
      executionPrice = Math.min(currentPrice, limitPrice);
    } else if (order.type === 'sell' && currentPrice >= limitPrice) {
      canExecute = true;
      // For sell orders, execute at the better of current price or limit price
      executionPrice = Math.max(currentPrice, limitPrice);
    }

    if (!canExecute) {
      // Order remains pending
      return null;
    }

    // Calculate fees
    const totalValue = quantity * executionPrice;
    const fees = this.calculateOrderFees(totalValue);

    // Execute the order
    const execution: OrderExecution = {
      orderId: order.id,
      executedQuantity: quantity,
      executedPrice: executionPrice,
      fees,
      slippage: 0, // Limit orders don't have slippage by definition
      timestamp: new Date(),
    };

    // Update order status
    await storage.updateOrder(order.id, {
      status: 'filled',
      filledQuantity: quantity.toString(),
      averageFillPrice: executionPrice.toString(),
      fees: fees.toString(),
      filledAt: new Date(),
      executionDetails: {
        executionType: 'limit',
        limitPrice: limitPrice,
        marketPrice: currentPrice,
      },
    });

    // Update portfolio holdings
    await this.updatePortfolioHoldings(order, execution);

    // Update market data
    await this.updateMarketAfterTrade(order.assetId, quantity, executionPrice);

    return execution;
  }

  /**
   * Process stop order (basic implementation)
   */
  private async processStopOrder(order: Order): Promise<OrderExecution | null> {
    // Stop orders become market orders when triggered
    // This is a simplified implementation
    return await this.processMarketOrder(order);
  }

  /**
   * Validate order before processing
   */
  async validateOrder(order: Order): Promise<{ isValid: boolean; reason?: string }> {
    // Get user and portfolio
    const user = await storage.getUser(order.userId);
    if (!user) {
      return { isValid: false, reason: 'User not found' };
    }

    const portfolio = await storage.getPortfolio(order.portfolioId);
    if (!portfolio) {
      return { isValid: false, reason: 'Portfolio not found' };
    }

    // Check if market is open
    if (!this.marketEngine.isMarketOpen()) {
      return { isValid: false, reason: 'Market is closed' };
    }

    // Validate order parameters
    const quantity = parseFloat(order.quantity);
    if (quantity <= 0) {
      return { isValid: false, reason: 'Invalid quantity' };
    }

    // Check asset exists and has current price
    const marketData = this.marketEngine.getAssetMarketData(order.assetId);
    if (!marketData) {
      return { isValid: false, reason: 'Asset not found' };
    }

    const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
    const orderValue = quantity * currentPrice;

    // Check position size limits
    const maxPositionSize = parseFloat(user.maxPositionSize);
    if (orderValue > maxPositionSize) {
      return { isValid: false, reason: `Order exceeds maximum position size of $${maxPositionSize}` };
    }

    // Check daily trading limits
    const dailyLimit = parseFloat(user.dailyTradingLimit);
    const dailyUsed = parseFloat(user.dailyTradingUsed);
    if (dailyUsed + orderValue > dailyLimit) {
      return { isValid: false, reason: `Order exceeds daily trading limit` };
    }

    // For buy orders, check available cash
    if (order.type === 'buy') {
      const cashBalance = parseFloat(portfolio.cashBalance);
      const fees = this.calculateOrderFees(orderValue);
      const totalRequired = orderValue + fees;
      
      if (totalRequired > cashBalance) {
        return { isValid: false, reason: 'Insufficient cash balance' };
      }
    }

    // For sell orders, check available holdings
    if (order.type === 'sell') {
      const holding = await storage.getHolding(order.portfolioId, order.assetId);
      if (!holding || parseFloat(holding.quantity) < quantity) {
        return { isValid: false, reason: 'Insufficient holdings' };
      }
    }

    return { isValid: true };
  }

  /**
   * Calculate slippage based on order size and market liquidity
   */
  private calculateSlippage(quantity: number, marketData: AssetMarketData): number {
    const volume24h = marketData.volume24h;
    const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
    const orderValue = quantity * currentPrice;
    
    // Calculate order size as percentage of daily volume
    const volumeImpact = orderValue / (volume24h * currentPrice || 1);
    
    // Apply slippage factor
    const slippage = volumeImpact * this.config.slippageFactor;
    
    // Cap slippage at reasonable levels
    return Math.min(slippage, 0.05); // Max 5% slippage
  }

  /**
   * Calculate trading fees and commissions
   */
  private calculateOrderFees(orderValue: number): number {
    // Simple commission structure
    const commission = orderValue * this.config.commissionRate;
    
    // Minimum fee
    const minFee = 1.0;
    
    return Math.max(commission, minFee);
  }

  /**
   * Update portfolio holdings after order execution
   */
  private async updatePortfolioHoldings(order: Order, execution: OrderExecution): Promise<void> {
    const portfolio = await storage.getPortfolio(order.portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const { executedQuantity, executedPrice, fees } = execution;
    const totalValue = executedQuantity * executedPrice;

    if (order.type === 'buy') {
      // Deduct cash and add/update holding
      const newCashBalance = parseFloat(portfolio.cashBalance) - totalValue - fees;
      await storage.updatePortfolio(order.portfolioId, {
        cashBalance: newCashBalance.toString(),
      });

      // Update or create holding
      let holding = await storage.getHolding(order.portfolioId, order.assetId);
      
      if (holding) {
        // Update existing holding
        const existingQuantity = parseFloat(holding.quantity);
        const existingCost = parseFloat(holding.averageCost);
        const newQuantity = existingQuantity + executedQuantity;
        const newAverageCost = ((existingQuantity * existingCost) + totalValue) / newQuantity;
        
        await storage.updateHolding(holding.id, {
          quantity: newQuantity.toString(),
          averageCost: newAverageCost.toString(),
          currentValue: (newQuantity * executedPrice).toString(),
        });
      } else {
        // Create new holding
        const newHolding: InsertHolding = {
          portfolioId: order.portfolioId,
          assetId: order.assetId,
          quantity: executedQuantity.toString(),
          averageCost: executedPrice.toString(),
          currentValue: totalValue.toString(),
        };
        await storage.createHolding(newHolding);
      }
    } else {
      // Sell order: add cash and reduce/remove holding
      const newCashBalance = parseFloat(portfolio.cashBalance) + totalValue - fees;
      await storage.updatePortfolio(order.portfolioId, {
        cashBalance: newCashBalance.toString(),
      });

      // Update holding
      const holding = await storage.getHolding(order.portfolioId, order.assetId);
      if (holding) {
        const existingQuantity = parseFloat(holding.quantity);
        const newQuantity = existingQuantity - executedQuantity;
        
        if (newQuantity <= 0) {
          // Remove holding completely
          await storage.deleteHolding(holding.id);
        } else {
          // Reduce holding quantity
          await storage.updateHolding(holding.id, {
            quantity: newQuantity.toString(),
            currentValue: (newQuantity * executedPrice).toString(),
          });
        }
      }
    }

    // Update user's daily trading usage
    const user = await storage.getUser(order.userId);
    if (user) {
      const newDailyUsed = parseFloat(user.dailyTradingUsed) + totalValue;
      await storage.upsertUser({
        id: order.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        // Update the trading fields we need
        dailyTradingUsed: newDailyUsed.toString(),
        lastTradingActivity: new Date(),
      } as any);
    }
  }

  /**
   * Update market data after a trade
   */
  private async updateMarketAfterTrade(assetId: string, quantity: number, price: number): Promise<void> {
    const currentPrice = await storage.getAssetCurrentPrice(assetId);
    if (currentPrice) {
      const newVolume = currentPrice.volume + Math.floor(quantity);
      
      await storage.updateAssetCurrentPrice(assetId, {
        volume: newVolume,
        lastTradePrice: price.toString(),
        lastTradeQuantity: quantity.toString(),
        lastTradeTime: new Date(),
      });
    }
  }

  /**
   * Reject an order with a reason
   */
  private async rejectOrder(orderId: string, reason: string): Promise<void> {
    await storage.updateOrder(orderId, {
      status: 'cancelled',
      rejectionReason: reason,
    });
  }

  /**
   * Check and process pending limit orders for a specific user
   */
  async processPendingOrdersForUser(userId: string): Promise<void> {
    const pendingOrders = await storage.getUserOrders(userId, 'pending');
    
    for (const order of pendingOrders) {
      if (order.orderType === 'limit') {
        const execution = await this.processLimitOrder(order);
        if (execution) {
          console.log(`✅ Executed limit order ${order.id} at $${execution.executedPrice}`);
        }
      }
    }
  }

  /**
   * Process pending orders for all users (would need to be called periodically)
   */
  async processAllPendingOrders(): Promise<void> {
    console.log('🔄 Processing pending orders across all users...');
    
    try {
      // Get all pending orders from storage
      const pendingOrders = await storage.getOrdersByStatus('pending');
      
      if (pendingOrders.length === 0) {
        return;
      }
      
      console.log(`Found ${pendingOrders.length} pending orders to process`);
      
      // Sort orders by price/time priority
      const sortedOrders = this.sortOrdersByPriority(pendingOrders);
      
      let executedCount = 0;
      for (const order of sortedOrders) {
        const execution = await this.processOrder(order);
        if (execution) {
          executedCount++;
          console.log(`✅ Executed pending order ${order.id} at $${execution.executedPrice}`);
        }
      }
      
      if (executedCount > 0) {
        console.log(`🎯 Executed ${executedCount} pending orders`);
        // Trigger market data broadcast if available
        if ((this.marketEngine as any).broadcastUpdate) {
          await (this.marketEngine as any).broadcastUpdate();
        }
      }
    } catch (error) {
      console.error('Error processing pending orders:', error);
    }
  }
  
  /**
   * Sort orders by price/time priority
   */
  private sortOrdersByPriority(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      // For buy orders, higher prices have priority
      // For sell orders, lower prices have priority
      if (a.type === 'buy' && b.type === 'buy') {
        const priceA = parseFloat(a.price || '0');
        const priceB = parseFloat(b.price || '0');
        if (priceA !== priceB) {
          return priceB - priceA; // Higher prices first for buy orders
        }
      } else if (a.type === 'sell' && b.type === 'sell') {
        const priceA = parseFloat(a.price || '0');
        const priceB = parseFloat(b.price || '0');
        if (priceA !== priceB) {
          return priceA - priceB; // Lower prices first for sell orders
        }
      }
      
      // If prices are equal or different order types, sort by time (FIFO)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }
}

// Export singleton instances
export const marketSimulation = new MarketSimulationEngine();
export const orderMatching = new OrderMatchingEngine(marketSimulation);