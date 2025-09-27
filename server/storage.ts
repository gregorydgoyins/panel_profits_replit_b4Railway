import { 
  type User, type InsertUser,
  type Asset, type InsertAsset,
  type MarketData, type InsertMarketData,
  type Portfolio, type InsertPortfolio,
  type Holding, type InsertHolding,
  type MarketInsight, type InsertMarketInsight,
  type MarketIndex, type InsertMarketIndex,
  type MarketIndexData, type InsertMarketIndexData,
  type Watchlist, type InsertWatchlist,
  type WatchlistAsset, type InsertWatchlistAsset,
  type Order, type InsertOrder,
  type MarketEvent, type InsertMarketEvent,
  type BeatTheAIChallenge, type InsertBeatTheAIChallenge,
  type BeatTheAIPrediction, type InsertBeatTheAIPrediction,
  type BeatTheAILeaderboard, type InsertBeatTheAILeaderboard,
  type ComicGradingPrediction, type InsertComicGradingPrediction
} from "@shared/schema";
import { randomUUID } from "crypto";

// Time-series data management with memory limits
interface TimeSeriesBuffer<T> {
  items: T[];
  maxSize: number;
  addDataPoint(point: T): void;
  getByTimeframe(timeframe: string, limit?: number, from?: Date, to?: Date): T[];
  clear(): void;
}

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Asset management
  getAsset(id: string): Promise<Asset | undefined>;
  getAssetBySymbol(symbol: string): Promise<Asset | undefined>;
  getAssets(filters?: { type?: string; search?: string; publisher?: string }): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;

  // Market data (OHLC time-series)
  getLatestMarketData(assetId: string, timeframe?: string): Promise<MarketData | undefined>;
  getMarketDataHistory(assetId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketData[]>;
  createMarketData(marketData: InsertMarketData): Promise<MarketData>;
  getBulkLatestMarketData(assetIds: string[], timeframe?: string): Promise<MarketData[]>;
  createBulkMarketData(marketDataList: InsertMarketData[]): Promise<MarketData[]>;

  // Portfolio management
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  getUserPortfolios(userId: string): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: string): Promise<boolean>;

  // Holdings
  getPortfolioHoldings(portfolioId: string): Promise<Holding[]>;
  getHolding(portfolioId: string, assetId: string): Promise<Holding | undefined>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(id: string, holding: Partial<InsertHolding>): Promise<Holding | undefined>;
  deleteHolding(id: string): Promise<boolean>;

  // Market insights
  getMarketInsights(filters?: { assetId?: string; category?: string; isActive?: boolean }): Promise<MarketInsight[]>;
  createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight>;
  updateMarketInsight(id: string, insight: Partial<InsertMarketInsight>): Promise<MarketInsight | undefined>;

  // Market indices
  getMarketIndex(symbol: string): Promise<MarketIndex | undefined>;
  getMarketIndices(): Promise<MarketIndex[]>;
  createMarketIndex(index: InsertMarketIndex): Promise<MarketIndex>;
  updateMarketIndex(id: string, index: Partial<InsertMarketIndex>): Promise<MarketIndex | undefined>;

  // Market index data (OHLC time-series)
  getLatestMarketIndexData(indexId: string, timeframe?: string): Promise<MarketIndexData | undefined>;
  getMarketIndexDataHistory(indexId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketIndexData[]>;
  createMarketIndexData(indexData: InsertMarketIndexData): Promise<MarketIndexData>;

  // Watchlists
  getUserWatchlists(userId: string): Promise<Watchlist[]>;
  getWatchlistAssets(watchlistId: string): Promise<WatchlistAsset[]>;
  createWatchlist(watchlist: InsertWatchlist): Promise<Watchlist>;
  addAssetToWatchlist(watchlistAsset: InsertWatchlistAsset): Promise<WatchlistAsset>;
  removeAssetFromWatchlist(watchlistId: string, assetId: string): Promise<boolean>;
  deleteWatchlist(id: string): Promise<boolean>;

  // Orders and trading
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string, status?: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
  cancelOrder(id: string): Promise<Order | undefined>;

  // Market events
  getMarketEvents(filters?: { isActive?: boolean; category?: string }): Promise<MarketEvent[]>;
  createMarketEvent(event: InsertMarketEvent): Promise<MarketEvent>;
  updateMarketEvent(id: string, event: Partial<InsertMarketEvent>): Promise<MarketEvent | undefined>;

  // Beat the AI Challenges
  getBeatTheAIChallenge(id: string): Promise<BeatTheAIChallenge | undefined>;
  getBeatTheAIChallenges(filters?: { status?: string }): Promise<BeatTheAIChallenge[]>;
  createBeatTheAIChallenge(challenge: InsertBeatTheAIChallenge): Promise<BeatTheAIChallenge>;
  updateBeatTheAIChallenge(id: string, challenge: Partial<InsertBeatTheAIChallenge>): Promise<BeatTheAIChallenge | undefined>;

  // Beat the AI Predictions
  getBeatTheAIPrediction(id: string): Promise<BeatTheAIPrediction | undefined>;
  getBeatTheAIPredictions(filters?: { challengeId?: string; userId?: string }): Promise<BeatTheAIPrediction[]>;
  createBeatTheAIPrediction(prediction: InsertBeatTheAIPrediction): Promise<BeatTheAIPrediction>;
  updateBeatTheAIPrediction(id: string, prediction: Partial<BeatTheAIPrediction>): Promise<BeatTheAIPrediction | undefined>;

  // Beat the AI Leaderboard
  getBeatTheAILeaderboard(limit?: number): Promise<BeatTheAILeaderboard[]>;
  getBeatTheAILeaderboardEntry(userId: string): Promise<BeatTheAILeaderboard | undefined>;
  createBeatTheAILeaderboardEntry(entry: InsertBeatTheAILeaderboard): Promise<BeatTheAILeaderboard>;
  updateBeatTheAILeaderboardEntry(userId: string, entry: Partial<BeatTheAILeaderboard>): Promise<BeatTheAILeaderboard | undefined>;
  recalculateLeaderboard(): Promise<void>;

  // Comic Grading Predictions
  getComicGradingPrediction(id: string): Promise<ComicGradingPrediction | undefined>;
  getComicGradingPredictions(filters?: { userId?: string; status?: string }): Promise<ComicGradingPrediction[]>;
  createComicGradingPrediction(prediction: InsertComicGradingPrediction): Promise<ComicGradingPrediction>;
  updateComicGradingPrediction(id: string, prediction: Partial<InsertComicGradingPrediction>): Promise<ComicGradingPrediction | undefined>;
}

// Time-series buffer implementation with memory limits and proper chronological ordering
class TimeSeriesBuffer<T extends { timeframe: string; periodStart: Date }> implements TimeSeriesBuffer<T> {
  private timeframeData: Map<string, T[]> = new Map();
  maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  get data(): T[] {
    // Return all data points across all timeframes
    const allData: T[] = [];
    for (const timeframeArray of Array.from(this.timeframeData.values())) {
      allData.push(...timeframeArray);
    }
    // Sort by periodStart descending (latest first)
    return allData.sort((a, b) => b.periodStart.getTime() - a.periodStart.getTime());
  }

  addDataPoint(point: T): void {
    const { timeframe } = point;
    
    // Get or create timeframe array
    let timeframeArray = this.timeframeData.get(timeframe);
    if (!timeframeArray) {
      timeframeArray = [];
      this.timeframeData.set(timeframe, timeframeArray);
    }

    // Check if this data point already exists (same timeframe and periodStart)
    const existingIndex = timeframeArray.findIndex(item => 
      item.periodStart.getTime() === point.periodStart.getTime()
    );
    
    if (existingIndex !== -1) {
      // Update existing data point
      timeframeArray[existingIndex] = point;
      return;
    }

    // Insert in chronological order (latest first for efficient access)
    const insertIndex = timeframeArray.findIndex(item => 
      item.periodStart < point.periodStart
    );
    
    if (insertIndex === -1) {
      // This is the oldest point, add to end
      timeframeArray.push(point);
    } else {
      // Insert at correct position
      timeframeArray.splice(insertIndex, 0, point);
    }

    // Trim oldest entries if over max size for this timeframe
    const maxPerTimeframe = Math.floor(this.maxSize / Math.max(1, this.timeframeData.size));
    if (timeframeArray.length > maxPerTimeframe) {
      // Remove oldest entries (from the end since we keep latest first)
      timeframeArray.splice(maxPerTimeframe);
    }
  }

  getByTimeframe(timeframe: string, limit?: number, from?: Date, to?: Date): T[] {
    const timeframeArray = this.timeframeData.get(timeframe) || [];
    let filtered = [...timeframeArray]; // Copy array
    
    if (from || to) {
      filtered = filtered.filter(item => {
        const timestamp = item.periodStart.getTime();
        const fromTime = from?.getTime() || 0;
        const toTime = to?.getTime() || Number.MAX_SAFE_INTEGER;
        return timestamp >= fromTime && timestamp <= toTime;
      });
    }
    
    // Data is already sorted by periodStart descending (latest first)
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }

  clear(): void {
    this.timeframeData.clear();
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assets: Map<string, Asset>;
  private marketData: Map<string, TimeSeriesBuffer<MarketData>>; // keyed by assetId
  private portfolios: Map<string, Portfolio>;
  private holdings: Map<string, Holding[]>; // keyed by portfolioId
  private marketInsights: Map<string, MarketInsight>;
  private marketIndices: Map<string, MarketIndex>;
  private marketIndexData: Map<string, TimeSeriesBuffer<MarketIndexData>>; // keyed by indexId
  private watchlists: Map<string, Watchlist>;
  private watchlistAssets: Map<string, WatchlistAsset[]>; // keyed by watchlistId
  private orders: Map<string, Order>;
  private marketEvents: Map<string, MarketEvent>;
  private beatTheAIChallenges: Map<string, BeatTheAIChallenge>;
  private beatTheAIPredictions: Map<string, BeatTheAIPrediction>;
  private beatTheAILeaderboard: Map<string, BeatTheAILeaderboard>;
  private comicGradingPredictions: Map<string, ComicGradingPrediction>;

  constructor() {
    this.users = new Map();
    this.assets = new Map();
    this.marketData = new Map();
    this.portfolios = new Map();
    this.holdings = new Map();
    this.marketInsights = new Map();
    this.marketIndices = new Map();
    this.marketIndexData = new Map();
    this.watchlists = new Map();
    this.watchlistAssets = new Map();
    this.orders = new Map();
    this.marketEvents = new Map();
    this.beatTheAIChallenges = new Map();
    this.beatTheAIPredictions = new Map();
    this.beatTheAILeaderboard = new Map();
    this.comicGradingPredictions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email ?? null,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      stripeCustomerId: null,
      monthlyTradingCredits: 0,
      usedTradingCredits: 0,
      competitionWins: 0,
      competitionRanking: null,
      preferences: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Asset methods
  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetBySymbol(symbol: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(asset => asset.symbol === symbol);
  }

  async getAssets(filters?: { type?: string; search?: string; publisher?: string }): Promise<Asset[]> {
    let assets = Array.from(this.assets.values());
    
    if (filters?.type) {
      assets = assets.filter(asset => asset.type === filters.type);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.symbol.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.publisher) {
      const publisherLower = filters.publisher.toLowerCase();
      assets = assets.filter(asset => {
        const metadata = asset.metadata as { publisher?: string } | null;
        return metadata?.publisher?.toLowerCase() === publisherLower;
      });
    }
    
    return assets;
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      ...insertAsset,
      id,
      description: insertAsset.description ?? null,
      imageUrl: insertAsset.imageUrl ?? null,
      metadata: insertAsset.metadata ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: string, updateData: Partial<InsertAsset>): Promise<Asset | undefined> {
    const asset = this.assets.get(id);
    if (!asset) return undefined;
    
    const updatedAsset: Asset = {
      ...asset,
      ...updateData,
      updatedAt: new Date()
    };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Market data methods (OHLC time-series)
  async getLatestMarketData(assetId: string, timeframe: string = '1d'): Promise<MarketData | undefined> {
    const buffer = this.marketData.get(assetId);
    if (!buffer) return undefined;
    
    const latest = buffer.getByTimeframe(timeframe, 1);
    return latest[0] || undefined;
  }

  async getMarketDataHistory(assetId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketData[]> {
    const buffer = this.marketData.get(assetId);
    if (!buffer) return [];
    
    return buffer.getByTimeframe(timeframe, limit, from, to);
  }

  async createMarketData(insertMarketData: InsertMarketData): Promise<MarketData> {
    const id = randomUUID();
    const marketData: MarketData = {
      ...insertMarketData,
      id,
      change: insertMarketData.change ?? null,
      percentChange: insertMarketData.percentChange ?? null,
      marketCap: insertMarketData.marketCap ?? null,
      technicalIndicators: insertMarketData.technicalIndicators ?? null,
      createdAt: new Date()
    };
    
    let buffer = this.marketData.get(insertMarketData.assetId);
    if (!buffer) {
      buffer = new TimeSeriesBuffer<MarketData>();
      this.marketData.set(insertMarketData.assetId, buffer);
    }
    
    buffer.addDataPoint(marketData);
    return marketData;
  }

  async getBulkLatestMarketData(assetIds: string[], timeframe: string = '1d'): Promise<MarketData[]> {
    const results: MarketData[] = [];
    for (const assetId of assetIds) {
      const latest = await this.getLatestMarketData(assetId, timeframe);
      if (latest) results.push(latest);
    }
    return results;
  }

  async createBulkMarketData(marketDataList: InsertMarketData[]): Promise<MarketData[]> {
    const results: MarketData[] = [];
    for (const insertData of marketDataList) {
      const marketData = await this.createMarketData(insertData);
      results.push(marketData);
    }
    return results;
  }

  // Portfolio methods
  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(p => p.userId === userId);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      description: insertPortfolio.description ?? null,
      totalValue: insertPortfolio.totalValue ?? null,
      dayChange: insertPortfolio.dayChange ?? null,
      dayChangePercent: insertPortfolio.dayChangePercent ?? null,
      totalReturn: insertPortfolio.totalReturn ?? null,
      totalReturnPercent: insertPortfolio.totalReturnPercent ?? null,
      diversificationScore: insertPortfolio.diversificationScore ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: string, updateData: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      ...updateData,
      updatedAt: new Date()
    };
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  async deletePortfolio(id: string): Promise<boolean> {
    // Also remove related holdings
    this.holdings.delete(id);
    return this.portfolios.delete(id);
  }

  // Holdings methods
  async getPortfolioHoldings(portfolioId: string): Promise<Holding[]> {
    return this.holdings.get(portfolioId) || [];
  }

  async getHolding(portfolioId: string, assetId: string): Promise<Holding | undefined> {
    const holdings = this.holdings.get(portfolioId) || [];
    return holdings.find(h => h.assetId === assetId);
  }

  async createHolding(insertHolding: InsertHolding): Promise<Holding> {
    const id = randomUUID();
    const holding: Holding = {
      ...insertHolding,
      id,
      currentValue: insertHolding.currentValue ?? null,
      unrealizedGainLoss: insertHolding.unrealizedGainLoss ?? null,
      unrealizedGainLossPercent: insertHolding.unrealizedGainLossPercent ?? null,
      updatedAt: new Date()
    };
    
    const portfolioHoldings = this.holdings.get(insertHolding.portfolioId) || [];
    portfolioHoldings.push(holding);
    this.holdings.set(insertHolding.portfolioId, portfolioHoldings);
    
    return holding;
  }

  async updateHolding(id: string, updateData: Partial<InsertHolding>): Promise<Holding | undefined> {
    for (const [portfolioId, holdings] of Array.from(this.holdings.entries())) {
      const index = holdings.findIndex(h => h.id === id);
      if (index !== -1) {
        const updatedHolding: Holding = {
          ...holdings[index],
          ...updateData,
          updatedAt: new Date()
        };
        holdings[index] = updatedHolding;
        return updatedHolding;
      }
    }
    return undefined;
  }

  async deleteHolding(id: string): Promise<boolean> {
    for (const [portfolioId, holdings] of Array.from(this.holdings.entries())) {
      const index = holdings.findIndex(h => h.id === id);
      if (index !== -1) {
        holdings.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Market insights methods
  async getMarketInsights(filters?: { assetId?: string; category?: string; isActive?: boolean }): Promise<MarketInsight[]> {
    let insights = Array.from(this.marketInsights.values());
    
    if (filters?.assetId) {
      insights = insights.filter(i => i.assetId === filters.assetId);
    }
    if (filters?.category) {
      insights = insights.filter(i => i.category === filters.category);
    }
    if (filters?.isActive !== undefined) {
      insights = insights.filter(i => i.isActive === filters.isActive);
    }
    
    return insights;
  }

  async createMarketInsight(insertInsight: InsertMarketInsight): Promise<MarketInsight> {
    const id = randomUUID();
    const insight: MarketInsight = {
      ...insertInsight,
      id,
      assetId: insertInsight.assetId ?? null,
      sentimentScore: insertInsight.sentimentScore ?? null,
      confidence: insertInsight.confidence ?? null,
      tags: insertInsight.tags ?? null,
      source: insertInsight.source ?? null,
      videoUrl: insertInsight.videoUrl ?? null,
      thumbnailUrl: insertInsight.thumbnailUrl ?? null,
      category: insertInsight.category ?? null,
      isActive: insertInsight.isActive ?? true,
      expiresAt: insertInsight.expiresAt ?? null,
      createdAt: new Date()
    };
    this.marketInsights.set(id, insight);
    return insight;
  }

  async updateMarketInsight(id: string, updateData: Partial<InsertMarketInsight>): Promise<MarketInsight | undefined> {
    const insight = this.marketInsights.get(id);
    if (!insight) return undefined;
    
    const updatedInsight: MarketInsight = {
      ...insight,
      ...updateData
    };
    this.marketInsights.set(id, updatedInsight);
    return updatedInsight;
  }

  // Market indices methods
  async getMarketIndex(symbol: string): Promise<MarketIndex | undefined> {
    return Array.from(this.marketIndices.values()).find(index => index.symbol === symbol);
  }

  async getMarketIndices(): Promise<MarketIndex[]> {
    return Array.from(this.marketIndices.values());
  }

  async createMarketIndex(insertIndex: InsertMarketIndex): Promise<MarketIndex> {
    const id = randomUUID();
    const index: MarketIndex = {
      ...insertIndex,
      id,
      description: insertIndex.description ?? null,
      methodology: insertIndex.methodology ?? null,
      constituents: insertIndex.constituents ?? null,
      rebalanceFrequency: insertIndex.rebalanceFrequency ?? "monthly",
      isActive: insertIndex.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.marketIndices.set(id, index);
    return index;
  }

  async updateMarketIndex(id: string, updateData: Partial<InsertMarketIndex>): Promise<MarketIndex | undefined> {
    const index = this.marketIndices.get(id);
    if (!index) return undefined;
    
    const updatedIndex: MarketIndex = {
      ...index,
      ...updateData
    };
    this.marketIndices.set(id, updatedIndex);
    return updatedIndex;
  }

  // Market index data methods (OHLC time-series)
  async getLatestMarketIndexData(indexId: string, timeframe: string = '1d'): Promise<MarketIndexData | undefined> {
    const buffer = this.marketIndexData.get(indexId);
    if (!buffer) return undefined;
    
    const latest = buffer.getByTimeframe(timeframe, 1);
    return latest[0] || undefined;
  }

  async getMarketIndexDataHistory(indexId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketIndexData[]> {
    const buffer = this.marketIndexData.get(indexId);
    if (!buffer) return [];
    
    return buffer.getByTimeframe(timeframe, limit, from, to);
  }

  async createMarketIndexData(insertIndexData: InsertMarketIndexData): Promise<MarketIndexData> {
    const id = randomUUID();
    const indexData: MarketIndexData = {
      ...insertIndexData,
      id,
      volume: insertIndexData.volume ?? null,
      change: insertIndexData.change ?? null,
      percentChange: insertIndexData.percentChange ?? null,
      createdAt: new Date()
    };
    
    let buffer = this.marketIndexData.get(insertIndexData.indexId);
    if (!buffer) {
      buffer = new TimeSeriesBuffer<MarketIndexData>();
      this.marketIndexData.set(insertIndexData.indexId, buffer);
    }
    
    buffer.addDataPoint(indexData);
    return indexData;
  }

  // Watchlist methods
  async getUserWatchlists(userId: string): Promise<Watchlist[]> {
    return Array.from(this.watchlists.values()).filter(w => w.userId === userId);
  }

  async getWatchlistAssets(watchlistId: string): Promise<WatchlistAsset[]> {
    return this.watchlistAssets.get(watchlistId) || [];
  }

  async createWatchlist(insertWatchlist: InsertWatchlist): Promise<Watchlist> {
    const id = randomUUID();
    const watchlist: Watchlist = {
      ...insertWatchlist,
      id,
      description: insertWatchlist.description ?? null,
      isDefault: insertWatchlist.isDefault ?? null,
      createdAt: new Date()
    };
    this.watchlists.set(id, watchlist);
    return watchlist;
  }

  async addAssetToWatchlist(insertWatchlistAsset: InsertWatchlistAsset): Promise<WatchlistAsset> {
    const id = randomUUID();
    const watchlistAsset: WatchlistAsset = {
      ...insertWatchlistAsset,
      id,
      addedAt: new Date()
    };
    
    const assets = this.watchlistAssets.get(insertWatchlistAsset.watchlistId) || [];
    assets.push(watchlistAsset);
    this.watchlistAssets.set(insertWatchlistAsset.watchlistId, assets);
    
    return watchlistAsset;
  }

  async removeAssetFromWatchlist(watchlistId: string, assetId: string): Promise<boolean> {
    const assets = this.watchlistAssets.get(watchlistId) || [];
    const index = assets.findIndex(a => a.assetId === assetId);
    if (index !== -1) {
      assets.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteWatchlist(id: string): Promise<boolean> {
    // Remove related watchlist assets
    this.watchlistAssets.delete(id);
    return this.watchlists.delete(id);
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    let orders = Array.from(this.orders.values()).filter(o => o.userId === userId);
    
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    
    return orders;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      totalValue: insertOrder.totalValue ?? null,
      price: insertOrder.price ?? null,
      createdAt: new Date(),
      filledAt: null
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      ...updateData,
      filledAt: updateData.status === 'filled' ? new Date() : order.filledAt
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }

  async cancelOrder(id: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    // Validate status transition
    if (order.status !== 'pending') {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }
    
    return this.updateOrder(id, { status: 'cancelled' });
  }

  // Market events methods
  async getMarketEvents(filters?: { isActive?: boolean; category?: string }): Promise<MarketEvent[]> {
    let events = Array.from(this.marketEvents.values());
    
    if (filters?.isActive !== undefined) {
      events = events.filter(e => e.isActive === filters.isActive);
    }
    if (filters?.category) {
      events = events.filter(e => e.category === filters.category);
    }
    
    return events;
  }

  async createMarketEvent(insertEvent: InsertMarketEvent): Promise<MarketEvent> {
    const id = randomUUID();
    const event: MarketEvent = {
      ...insertEvent,
      id,
      description: insertEvent.description ?? null,
      category: insertEvent.category ?? null,
      isActive: insertEvent.isActive ?? true,
      impact: insertEvent.impact ?? null,
      affectedAssets: insertEvent.affectedAssets ?? null,
      eventDate: insertEvent.eventDate ?? null,
      createdAt: new Date()
    };
    this.marketEvents.set(id, event);
    return event;
  }

  async updateMarketEvent(id: string, updateData: Partial<InsertMarketEvent>): Promise<MarketEvent | undefined> {
    const event = this.marketEvents.get(id);
    if (!event) return undefined;
    
    const updatedEvent: MarketEvent = {
      ...event,
      ...updateData
    };
    this.marketEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  // Beat the AI Challenge methods
  async getBeatTheAIChallenge(id: string): Promise<BeatTheAIChallenge | undefined> {
    return this.beatTheAIChallenges.get(id);
  }

  async getBeatTheAIChallenges(filters?: { status?: string }): Promise<BeatTheAIChallenge[]> {
    let challenges = Array.from(this.beatTheAIChallenges.values());
    
    if (filters?.status) {
      challenges = challenges.filter(c => c.status === filters.status);
    }
    
    return challenges;
  }

  async createBeatTheAIChallenge(insertChallenge: InsertBeatTheAIChallenge): Promise<BeatTheAIChallenge> {
    const id = randomUUID();
    const challenge: BeatTheAIChallenge = {
      ...insertChallenge,
      id,
      status: insertChallenge.status ?? "UPCOMING",
      participantCount: insertChallenge.participantCount ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.beatTheAIChallenges.set(id, challenge);
    return challenge;
  }

  async updateBeatTheAIChallenge(id: string, updateData: Partial<InsertBeatTheAIChallenge>): Promise<BeatTheAIChallenge | undefined> {
    const challenge = this.beatTheAIChallenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge: BeatTheAIChallenge = {
      ...challenge,
      ...updateData,
      updatedAt: new Date()
    };
    this.beatTheAIChallenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  // Beat the AI Prediction methods
  async getBeatTheAIPrediction(id: string): Promise<BeatTheAIPrediction | undefined> {
    return this.beatTheAIPredictions.get(id);
  }

  async getBeatTheAIPredictions(filters?: { challengeId?: string; userId?: string }): Promise<BeatTheAIPrediction[]> {
    let predictions = Array.from(this.beatTheAIPredictions.values());
    
    if (filters?.challengeId) {
      predictions = predictions.filter(p => p.challengeId === filters.challengeId);
    }
    
    if (filters?.userId) {
      predictions = predictions.filter(p => p.userId === filters.userId);
    }
    
    return predictions;
  }

  async createBeatTheAIPrediction(insertPrediction: InsertBeatTheAIPrediction): Promise<BeatTheAIPrediction> {
    const id = randomUUID();
    const prediction: BeatTheAIPrediction = {
      ...insertPrediction,
      id,
      submissionTime: new Date(),
      actualChange: null,
      score: null,
      isWinner: false
    };
    this.beatTheAIPredictions.set(id, prediction);
    
    // Update challenge participant count
    const challenge = await this.getBeatTheAIChallenge(insertPrediction.challengeId);
    if (challenge) {
      const uniqueUsers = new Set(
        Array.from(this.beatTheAIPredictions.values())
          .filter(p => p.challengeId === insertPrediction.challengeId)
          .map(p => p.userId)
      );
      await this.updateBeatTheAIChallenge(insertPrediction.challengeId, {
        participantCount: uniqueUsers.size
      });
    }
    
    return prediction;
  }

  async updateBeatTheAIPrediction(id: string, updateData: Partial<BeatTheAIPrediction>): Promise<BeatTheAIPrediction | undefined> {
    const prediction = this.beatTheAIPredictions.get(id);
    if (!prediction) return undefined;
    
    const updatedPrediction: BeatTheAIPrediction = {
      ...prediction,
      ...updateData
    };
    this.beatTheAIPredictions.set(id, updatedPrediction);
    return updatedPrediction;
  }

  // Beat the AI Leaderboard methods
  async getBeatTheAILeaderboard(limit: number = 100): Promise<BeatTheAILeaderboard[]> {
    return Array.from(this.beatTheAILeaderboard.values())
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))
      .slice(0, limit);
  }

  async getBeatTheAILeaderboardEntry(userId: string): Promise<BeatTheAILeaderboard | undefined> {
    return Array.from(this.beatTheAILeaderboard.values()).find(entry => entry.userId === userId);
  }

  async createBeatTheAILeaderboardEntry(insertEntry: InsertBeatTheAILeaderboard): Promise<BeatTheAILeaderboard> {
    const id = randomUUID();
    const entry: BeatTheAILeaderboard = {
      ...insertEntry,
      id,
      totalScore: insertEntry.totalScore ?? null,
      accuracy: insertEntry.accuracy ?? null,
      totalPredictions: insertEntry.totalPredictions ?? null,
      winnings: insertEntry.winnings ?? null,
      rank: insertEntry.rank ?? null,
      lastActive: new Date()
    };
    this.beatTheAILeaderboard.set(id, entry);
    return entry;
  }

  async updateBeatTheAILeaderboardEntry(userId: string, updateData: Partial<BeatTheAILeaderboard>): Promise<BeatTheAILeaderboard | undefined> {
    const existingEntry = await this.getBeatTheAILeaderboardEntry(userId);
    if (!existingEntry) return undefined;
    
    const updatedEntry: BeatTheAILeaderboard = {
      ...existingEntry,
      ...updateData,
      lastActive: new Date()
    };
    this.beatTheAILeaderboard.set(existingEntry.id, updatedEntry);
    return updatedEntry;
  }

  async recalculateLeaderboard(): Promise<void> {
    const predictions = Array.from(this.beatTheAIPredictions.values());
    const userStats = new Map<string, {
      username: string;
      totalScore: number;
      accuracy: number;
      totalPredictions: number;
      winnings: number;
    }>();

    // Calculate stats for each user
    for (const prediction of predictions) {
      let stats = userStats.get(prediction.userId);
      if (!stats) {
        stats = {
          username: prediction.username,
          totalScore: 0,
          accuracy: 0,
          totalPredictions: 0,
          winnings: 0
        };
        userStats.set(prediction.userId, stats);
      }

      stats.totalPredictions++;
      if (prediction.score) {
        stats.totalScore += parseFloat(prediction.score.toString());
      }
      if (prediction.isWinner) {
        stats.winnings += 1000; // Base prize per win
      }
    }

    // Calculate accuracy and update leaderboard
    for (const [userId, stats] of Array.from(userStats.entries())) {
      const correctPredictions = predictions.filter(p => 
        p.userId === userId && p.score && parseFloat(p.score.toString()) > 50
      ).length;
      
      stats.accuracy = stats.totalPredictions > 0 ? 
        (correctPredictions / stats.totalPredictions) * 100 : 0;

      await this.updateBeatTheAILeaderboardEntry(userId, {
        totalScore: stats.totalScore.toString(),
        accuracy: stats.accuracy.toString(),
        totalPredictions: stats.totalPredictions,
        winnings: stats.winnings.toString()
      });
    }

    // Assign ranks
    const entries = Array.from(this.beatTheAILeaderboard.values())
      .sort((a, b) => parseFloat(b.totalScore || '0') - parseFloat(a.totalScore || '0'));
    
    for (let i = 0; i < entries.length; i++) {
      await this.updateBeatTheAILeaderboardEntry(entries[i].userId, {
        rank: i + 1
      });
    }
  }

  // Comic Grading Prediction methods
  async getComicGradingPrediction(id: string): Promise<ComicGradingPrediction | undefined> {
    return this.comicGradingPredictions.get(id);
  }

  async getComicGradingPredictions(filters?: { userId?: string; status?: string }): Promise<ComicGradingPrediction[]> {
    let predictions = Array.from(this.comicGradingPredictions.values());
    
    if (filters?.userId) {
      predictions = predictions.filter(prediction => prediction.userId === filters.userId);
    }
    
    if (filters?.status) {
      predictions = predictions.filter(prediction => prediction.status === filters.status);
    }
    
    // Sort by creation date descending (newest first)
    predictions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    return predictions;
  }

  async createComicGradingPrediction(insertPrediction: InsertComicGradingPrediction): Promise<ComicGradingPrediction> {
    const id = randomUUID();
    const prediction: ComicGradingPrediction = {
      ...insertPrediction,
      id,
      status: insertPrediction.status ?? "processing",
      userId: insertPrediction.userId ?? null,
      imageName: insertPrediction.imageName ?? null,
      gradingNotes: insertPrediction.gradingNotes ?? null,
      processingTimeMs: insertPrediction.processingTimeMs ?? null,
      aiModel: insertPrediction.aiModel ?? null,
      createdAt: new Date()
    };
    this.comicGradingPredictions.set(id, prediction);
    return prediction;
  }

  async updateComicGradingPrediction(id: string, updateData: Partial<InsertComicGradingPrediction>): Promise<ComicGradingPrediction | undefined> {
    const prediction = this.comicGradingPredictions.get(id);
    if (!prediction) return undefined;
    
    const updatedPrediction: ComicGradingPrediction = {
      ...prediction,
      ...updateData
    };
    this.comicGradingPredictions.set(id, updatedPrediction);
    return updatedPrediction;
  }
}

export const storage = new MemStorage();
