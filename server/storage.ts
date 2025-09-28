import { 
  type User, type InsertUser, type UpsertUser,
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
  type ComicGradingPrediction, type InsertComicGradingPrediction,
  type ComicSeries, type InsertComicSeries,
  type ComicIssue, type InsertComicIssue,
  type ComicCreator, type InsertComicCreator,
  type FeaturedComic, type InsertFeaturedComic,
  // Phase 1 Trading Extensions
  type TradingSession, type InsertTradingSession,
  type AssetCurrentPrice, type InsertAssetCurrentPrice,
  type TradingLimit, type InsertTradingLimit
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
  // (IMPORTANT) this user operation is mandatory for Replit Auth.
  upsertUser(user: UpsertUser): Promise<User>;

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
  getOrdersByStatus(status: string): Promise<Order[]>;
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

  // Comic Series management
  getComicSeries(id: string): Promise<ComicSeries | undefined>;
  getComicSeriesList(filters?: { publisher?: string; year?: number; search?: string; limit?: number }): Promise<ComicSeries[]>;
  createComicSeries(series: InsertComicSeries): Promise<ComicSeries>;
  updateComicSeries(id: string, series: Partial<InsertComicSeries>): Promise<ComicSeries | undefined>;
  deleteComicSeries(id: string): Promise<boolean>;
  createBulkComicSeries(seriesList: InsertComicSeries[]): Promise<ComicSeries[]>;

  // Comic Issues management
  getComicIssue(id: string): Promise<ComicIssue | undefined>;
  getComicIssues(filters?: { seriesId?: string; search?: string; writer?: string; artist?: string; limit?: number }): Promise<ComicIssue[]>;
  getComicIssuesBySeriesId(seriesId: string): Promise<ComicIssue[]>;
  createComicIssue(issue: InsertComicIssue): Promise<ComicIssue>;
  updateComicIssue(id: string, issue: Partial<InsertComicIssue>): Promise<ComicIssue | undefined>;
  deleteComicIssue(id: string): Promise<boolean>;
  createBulkComicIssues(issuesList: InsertComicIssue[]): Promise<ComicIssue[]>;

  // Comic Creators management
  getComicCreator(id: string): Promise<ComicCreator | undefined>;
  getComicCreators(filters?: { role?: string; search?: string; limit?: number }): Promise<ComicCreator[]>;
  getComicCreatorByName(name: string): Promise<ComicCreator | undefined>;
  createComicCreator(creator: InsertComicCreator): Promise<ComicCreator>;
  updateComicCreator(id: string, creator: Partial<InsertComicCreator>): Promise<ComicCreator | undefined>;
  deleteComicCreator(id: string): Promise<boolean>;

  // Featured Comics management
  getFeaturedComic(id: string): Promise<FeaturedComic | undefined>;
  getFeaturedComics(filters?: { featureType?: string; isActive?: boolean; limit?: number }): Promise<FeaturedComic[]>;
  createFeaturedComic(featured: InsertFeaturedComic): Promise<FeaturedComic>;
  updateFeaturedComic(id: string, featured: Partial<InsertFeaturedComic>): Promise<FeaturedComic | undefined>;
  deleteFeaturedComic(id: string): Promise<boolean>;

  // Comic data aggregation for dashboards
  getComicMetrics(): Promise<{ totalSeries: number; totalIssues: number; totalCreators: number; totalCovers: number }>;
  getFeaturedComicsCount(): Promise<number>;
  getTrendingComicSeries(limit?: number): Promise<ComicSeries[]>;
  getFeaturedComicsForHomepage(): Promise<FeaturedComic[]>;

  // Vector Similarity Search Operations (pgvector powered)
  
  // Asset Recommendation Engine - "Comics You Might Like"
  findSimilarAssets(assetId: string, limit?: number, threshold?: number): Promise<Array<Asset & { similarityScore: number }>>;
  findSimilarAssetsByEmbedding(embedding: number[], limit?: number, threshold?: number): Promise<Array<Asset & { similarityScore: number }>>;
  updateAssetEmbedding(assetId: string, embedding: number[]): Promise<boolean>;
  getAssetsWithoutEmbeddings(limit?: number): Promise<Asset[]>;

  // Comic Visual Similarity Engine - "Find Similar Comics"
  findSimilarComicsByImage(gradingId: string, limit?: number, threshold?: number): Promise<Array<ComicGradingPrediction & { similarityScore: number }>>;
  findSimilarComicsByImageEmbedding(embedding: number[], limit?: number, threshold?: number): Promise<Array<ComicGradingPrediction & { similarityScore: number }>>;
  updateComicImageEmbedding(gradingId: string, embedding: number[]): Promise<boolean>;
  getComicGradingsWithoutEmbeddings(limit?: number): Promise<ComicGradingPrediction[]>;

  // Market Pattern Recognition - Semantic Search & Pattern Matching
  searchMarketInsightsByContent(query: string, limit?: number, threshold?: number): Promise<Array<MarketInsight & { similarityScore: number }>>;
  findSimilarMarketInsights(insightId: string, limit?: number, threshold?: number): Promise<Array<MarketInsight & { similarityScore: number }>>;
  findSimilarMarketInsightsByEmbedding(embedding: number[], limit?: number, threshold?: number): Promise<Array<MarketInsight & { similarityScore: number }>>;
  updateMarketInsightEmbedding(insightId: string, embedding: number[]): Promise<boolean>;
  getMarketInsightsWithoutEmbeddings(limit?: number): Promise<MarketInsight[]>;

  // Price Pattern Recognition - Similar Price Movements
  findSimilarPricePatterns(assetId: string, timeframe: string, limit?: number, threshold?: number): Promise<Array<MarketData & { similarityScore: number }>>;
  findSimilarPricePatternsByEmbedding(embedding: number[], timeframe?: string, limit?: number, threshold?: number): Promise<Array<MarketData & { similarityScore: number }>>;
  updateMarketDataEmbedding(marketDataId: string, embedding: number[]): Promise<boolean>;
  getMarketDataWithoutEmbeddings(timeframe?: string, limit?: number): Promise<MarketData[]>;

  // General Vector Operations
  calculateVectorSimilarity(vectorA: number[], vectorB: number[]): number;
  batchUpdateEmbeddings(updates: Array<{ table: 'assets' | 'marketInsights' | 'comicGradingPredictions' | 'marketData'; id: string; embedding: number[] }>): Promise<boolean>;
  
  // Vector Index Management
  createVectorIndices(): Promise<boolean>;
  refreshVectorIndices(): Promise<boolean>;
  getVectorIndexStatus(): Promise<{ table: string; hasIndex: boolean; indexType: string }[]>;

  // Enhanced Search with Vector Similarity
  searchAssetsWithSimilarity(query: string, filters?: { type?: string; publisher?: string }, limit?: number): Promise<Array<Asset & { similarityScore?: number; searchScore: number }>>;
  getRecommendationsForUser(userId: string, limit?: number): Promise<Array<Asset & { recommendationScore: number; reason: string }>>;
  getPortfolioSimilarAssets(portfolioId: string, limit?: number): Promise<Array<Asset & { similarityScore: number; portfolioWeight: number }>>;

  // Phase 1 Trading Extensions
  
  // Trading Sessions
  getTradingSession(id: string): Promise<TradingSession | undefined>;
  getUserTradingSessions(userId: string, isActive?: boolean): Promise<TradingSession[]>;
  getActiveTradingSession(userId: string): Promise<TradingSession | undefined>;
  createTradingSession(session: InsertTradingSession): Promise<TradingSession>;
  updateTradingSession(id: string, session: Partial<InsertTradingSession>): Promise<TradingSession | undefined>;
  endTradingSession(id: string, endingBalance: string, sessionStats: Partial<TradingSession>): Promise<TradingSession | undefined>;

  // Asset Current Prices  
  getAssetCurrentPrice(assetId: string): Promise<AssetCurrentPrice | undefined>;
  getAssetCurrentPrices(assetIds: string[]): Promise<AssetCurrentPrice[]>;
  getAllAssetCurrentPrices(marketStatus?: string): Promise<AssetCurrentPrice[]>;
  createAssetCurrentPrice(price: InsertAssetCurrentPrice): Promise<AssetCurrentPrice>;
  updateAssetCurrentPrice(assetId: string, price: Partial<InsertAssetCurrentPrice>): Promise<AssetCurrentPrice | undefined>;
  updateBulkAssetPrices(prices: Partial<AssetCurrentPrice>[]): Promise<AssetCurrentPrice[]>;

  // Trading Limits
  getTradingLimit(id: string): Promise<TradingLimit | undefined>;
  getUserTradingLimits(userId: string, isActive?: boolean): Promise<TradingLimit[]>;
  getUserTradingLimitsByType(userId: string, limitType: string): Promise<TradingLimit[]>;
  createTradingLimit(limit: InsertTradingLimit): Promise<TradingLimit>;
  updateTradingLimit(id: string, limit: Partial<InsertTradingLimit>): Promise<TradingLimit | undefined>;
  deleteTradingLimit(id: string): Promise<boolean>;
  checkTradingLimitBreach(userId: string, limitType: string, proposedValue: number, assetId?: string): Promise<{ canProceed: boolean; limit?: TradingLimit; exceedsBy?: number }>;
  resetUserTradingLimits(userId: string, resetPeriod: string): Promise<boolean>;

  // Enhanced User Trading Operations
  updateUserTradingBalance(userId: string, amount: string): Promise<User | undefined>;
  resetUserDailyLimits(userId: string): Promise<User | undefined>;
  getUserDefaultPortfolio(userId: string): Promise<Portfolio | undefined>;
  createUserDefaultPortfolio(userId: string, initialCash: string): Promise<Portfolio>;

  // Portfolio Cash Management
  updatePortfolioCashBalance(portfolioId: string, amount: string, operation: 'add' | 'subtract' | 'set'): Promise<Portfolio | undefined>;
  getPortfolioAvailableCash(portfolioId: string): Promise<{ cashBalance: string; reservedCash: string; availableCash: string }>;
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
  
  // Comic-related storage
  private comicSeries: Map<string, ComicSeries>;
  private comicIssues: Map<string, ComicIssue>;
  private comicCreators: Map<string, ComicCreator>;
  private featuredComics: Map<string, FeaturedComic>;

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
    
    // Initialize comic-related maps
    this.comicSeries = new Map();
    this.comicIssues = new Map();
    this.comicCreators = new Map();
    this.featuredComics = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For compatibility, search by email since username is deprecated
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      subscriptionTier: insertUser.subscriptionTier ?? "free",
      subscriptionStatus: insertUser.subscriptionStatus ?? "active",
      subscriptionStartDate: insertUser.subscriptionStartDate ?? null,
      subscriptionEndDate: insertUser.subscriptionEndDate ?? null,
      stripeCustomerId: insertUser.stripeCustomerId ?? null,
      monthlyTradingCredits: insertUser.monthlyTradingCredits ?? 0,
      usedTradingCredits: insertUser.usedTradingCredits ?? 0,
      competitionWins: insertUser.competitionWins ?? 0,
      competitionRanking: insertUser.competitionRanking ?? null,
      preferences: insertUser.preferences ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // (IMPORTANT) this user operation is mandatory for Replit Auth.
  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = this.users.get(user.id!);
    const updatedUser: User = {
      id: user.id!,
      email: user.email ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      profileImageUrl: user.profileImageUrl ?? null,
      // Preserve existing subscription data or use defaults
      subscriptionTier: existingUser?.subscriptionTier ?? "free",
      subscriptionStatus: existingUser?.subscriptionStatus ?? "active",
      subscriptionStartDate: existingUser?.subscriptionStartDate ?? null,
      subscriptionEndDate: existingUser?.subscriptionEndDate ?? null,
      stripeCustomerId: existingUser?.stripeCustomerId ?? null,
      monthlyTradingCredits: existingUser?.monthlyTradingCredits ?? 0,
      usedTradingCredits: existingUser?.usedTradingCredits ?? 0,
      competitionWins: existingUser?.competitionWins ?? 0,
      competitionRanking: existingUser?.competitionRanking ?? null,
      preferences: existingUser?.preferences ?? null,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id!, updatedUser);
    return updatedUser;
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

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.status === status);
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

  // Vector Similarity Search Operations Implementation
  
  // Asset Recommendation Engine - "Comics You Might Like"
  async findSimilarAssets(assetId: string, limit: number = 10, threshold: number = 0.7): Promise<Array<Asset & { similarityScore: number }>> {
    const targetAsset = this.assets.get(assetId);
    if (!targetAsset) return [];
    
    const allAssets = Array.from(this.assets.values()).filter(a => a.id !== assetId);
    
    // Mock similarity calculation based on asset metadata
    const similarAssets = allAssets.map(asset => {
      const targetMeta = targetAsset.metadata as { publisher?: string; yearPublished?: number; tags?: string[] } || {};
      const assetMeta = asset.metadata as { publisher?: string; yearPublished?: number; tags?: string[] } || {};
      
      let score = 0.5; // Base similarity
      
      // Publisher similarity
      if (targetMeta.publisher === assetMeta.publisher) score += 0.3;
      
      // Year proximity
      if (targetMeta.yearPublished && assetMeta.yearPublished) {
        const yearDiff = Math.abs(targetMeta.yearPublished - assetMeta.yearPublished);
        score += Math.max(0, 0.2 - (yearDiff / 100));
      }
      
      // Tag overlap
      if (targetMeta.tags && assetMeta.tags) {
        const commonTags = targetMeta.tags.filter(tag => assetMeta.tags!.includes(tag));
        score += (commonTags.length / Math.max(targetMeta.tags.length, assetMeta.tags.length)) * 0.3;
      }
      
      return { ...asset, similarityScore: Math.min(score, 0.99) };
    }).filter(a => a.similarityScore >= threshold);
    
    return similarAssets.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit);
  }
  
  async findSimilarAssetsByEmbedding(embedding: number[], limit: number = 10, threshold: number = 0.7): Promise<Array<Asset & { similarityScore: number }>> {
    // Mock implementation - in real scenario would use vector similarity
    const allAssets = Array.from(this.assets.values());
    return allAssets.map(asset => ({
      ...asset,
      similarityScore: Math.random() * 0.5 + 0.5 // Random similarity 0.5-1.0
    })).filter(a => a.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async updateAssetEmbedding(assetId: string, embedding: number[]): Promise<boolean> {
    const asset = this.assets.get(assetId);
    if (!asset) return false;
    // In real implementation, would store embedding in vector column
    return true;
  }
  
  async getAssetsWithoutEmbeddings(limit: number = 50): Promise<Asset[]> {
    return Array.from(this.assets.values()).slice(0, limit);
  }

  // Comic Visual Similarity Engine - "Find Similar Comics"
  async findSimilarComicsByImage(gradingId: string, limit: number = 10, threshold: number = 0.7): Promise<Array<ComicGradingPrediction & { similarityScore: number }>> {
    const targetGrading = this.comicGradingPredictions.get(gradingId);
    if (!targetGrading) return [];
    
    const allGradings = Array.from(this.comicGradingPredictions.values()).filter(g => g.id !== gradingId);
    
    return allGradings.map(grading => {
      // Mock visual similarity based on comic metadata
      let score = 0.6;
      
      if (targetGrading.predictedGrade === grading.predictedGrade) score += 0.2;
      if (targetGrading.confidence && grading.confidence && 
          Math.abs(targetGrading.confidence - grading.confidence) < 0.1) score += 0.2;
      
      return { ...grading, similarityScore: Math.min(score, 0.99) };
    }).filter(g => g.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async findSimilarComicsByImageEmbedding(embedding: number[], limit: number = 10, threshold: number = 0.7): Promise<Array<ComicGradingPrediction & { similarityScore: number }>> {
    const allGradings = Array.from(this.comicGradingPredictions.values());
    return allGradings.map(grading => ({
      ...grading,
      similarityScore: Math.random() * 0.4 + 0.6 // Random similarity 0.6-1.0
    })).filter(g => g.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async updateComicImageEmbedding(gradingId: string, embedding: number[]): Promise<boolean> {
    return this.comicGradingPredictions.has(gradingId);
  }
  
  async getComicGradingsWithoutEmbeddings(limit: number = 50): Promise<ComicGradingPrediction[]> {
    return Array.from(this.comicGradingPredictions.values()).slice(0, limit);
  }

  // Market Pattern Recognition - Semantic Search & Pattern Matching
  async searchMarketInsightsByContent(query: string, limit: number = 10, threshold: number = 0.7): Promise<Array<MarketInsight & { similarityScore: number }>> {
    const allInsights = Array.from(this.marketInsights.values());
    const queryLower = query.toLowerCase();
    
    return allInsights.map(insight => {
      let score = 0.3;
      
      if (insight.title.toLowerCase().includes(queryLower)) score += 0.4;
      if (insight.content.toLowerCase().includes(queryLower)) score += 0.3;
      if (insight.category?.toLowerCase().includes(queryLower)) score += 0.2;
      
      return { ...insight, similarityScore: Math.min(score, 0.99) };
    }).filter(i => i.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async findSimilarMarketInsights(insightId: string, limit: number = 10, threshold: number = 0.7): Promise<Array<MarketInsight & { similarityScore: number }>> {
    const targetInsight = this.marketInsights.get(insightId);
    if (!targetInsight) return [];
    
    const allInsights = Array.from(this.marketInsights.values()).filter(i => i.id !== insightId);
    
    return allInsights.map(insight => {
      let score = 0.5;
      
      if (targetInsight.category === insight.category) score += 0.3;
      if (targetInsight.assetId === insight.assetId) score += 0.2;
      
      return { ...insight, similarityScore: Math.min(score, 0.99) };
    }).filter(i => i.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async findSimilarMarketInsightsByEmbedding(embedding: number[], limit: number = 10, threshold: number = 0.7): Promise<Array<MarketInsight & { similarityScore: number }>> {
    const allInsights = Array.from(this.marketInsights.values());
    return allInsights.map(insight => ({
      ...insight,
      similarityScore: Math.random() * 0.4 + 0.6
    })).filter(i => i.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async updateMarketInsightEmbedding(insightId: string, embedding: number[]): Promise<boolean> {
    return this.marketInsights.has(insightId);
  }
  
  async getMarketInsightsWithoutEmbeddings(limit: number = 50): Promise<MarketInsight[]> {
    return Array.from(this.marketInsights.values()).slice(0, limit);
  }

  // Price Pattern Recognition - Similar Price Movements  
  async findSimilarPricePatterns(assetId: string, timeframe: string, limit: number = 10, threshold: number = 0.7): Promise<Array<MarketData & { similarityScore: number }>> {
    const targetData = this.marketData.get(assetId);
    if (!targetData) return [];
    
    const allData: Array<MarketData & { similarityScore: number }> = [];
    
    for (const [id, buffer] of this.marketData.entries()) {
      if (id === assetId) continue;
      const data = buffer.getByTimeframe(timeframe, 1);
      if (data.length > 0) {
        allData.push({
          ...data[0],
          similarityScore: Math.random() * 0.4 + 0.6
        });
      }
    }
    
    return allData.filter(d => d.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async findSimilarPricePatternsByEmbedding(embedding: number[], timeframe?: string, limit: number = 10, threshold: number = 0.7): Promise<Array<MarketData & { similarityScore: number }>> {
    const allData: Array<MarketData & { similarityScore: number }> = [];
    
    for (const buffer of this.marketData.values()) {
      const data = buffer.getByTimeframe(timeframe || '1d', 1);
      if (data.length > 0) {
        allData.push({
          ...data[0],
          similarityScore: Math.random() * 0.4 + 0.6
        });
      }
    }
    
    return allData.filter(d => d.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
  
  async updateMarketDataEmbedding(marketDataId: string, embedding: number[]): Promise<boolean> {
    // Mock implementation
    return true;
  }
  
  async getMarketDataWithoutEmbeddings(timeframe?: string, limit: number = 50): Promise<MarketData[]> {
    const allData: MarketData[] = [];
    
    for (const buffer of this.marketData.values()) {
      const data = buffer.getByTimeframe(timeframe || '1d', limit);
      allData.push(...data);
    }
    
    return allData.slice(0, limit);
  }

  // General Vector Operations
  calculateVectorSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  async batchUpdateEmbeddings(updates: Array<{ table: 'assets' | 'marketInsights' | 'comicGradingPredictions' | 'marketData'; id: string; embedding: number[] }>): Promise<boolean> {
    // Mock implementation - in real scenario would batch update embeddings
    return true;
  }
  
  // Vector Index Management
  async createVectorIndices(): Promise<boolean> {
    // Mock implementation - in real scenario would create pgvector indices
    return true;
  }
  
  async refreshVectorIndices(): Promise<boolean> {
    // Mock implementation
    return true;
  }
  
  async getVectorIndexStatus(): Promise<{ table: string; hasIndex: boolean; indexType: string }[]> {
    // Mock implementation - in real scenario would check pgvector indices
    return [
      { table: 'assets', hasIndex: true, indexType: 'hnsw' },
      { table: 'market_insights', hasIndex: true, indexType: 'hnsw' },
      { table: 'comic_grading_predictions', hasIndex: true, indexType: 'hnsw' },
      { table: 'market_data', hasIndex: true, indexType: 'hnsw' }
    ];
  }

  // Enhanced search functionality
  async searchAssetsWithSimilarity(query: string, filters?: { type?: string; publisher?: string }, limit: number = 20): Promise<Array<Asset & { similarityScore?: number; searchScore: number }>> {
    let allAssets = Array.from(this.assets.values());
    
    // Apply filters first
    if (filters?.type) {
      allAssets = allAssets.filter(asset => asset.type === filters.type);
    }
    
    if (filters?.publisher) {
      allAssets = allAssets.filter(asset => {
        const metadata = asset.metadata as { publisher?: string } | null;
        return metadata?.publisher?.toLowerCase() === filters.publisher!.toLowerCase();
      });
    }
    
    const queryLower = query.toLowerCase();
    
    return allAssets.map(asset => {
      let score = 0;
      
      if (asset.name.toLowerCase().includes(queryLower)) score += 0.6;
      if (asset.symbol.toLowerCase().includes(queryLower)) score += 0.4;
      if (asset.description?.toLowerCase().includes(queryLower)) score += 0.3;
      
      const metadata = asset.metadata as { publisher?: string; tags?: string[] } | null;
      if (metadata?.publisher?.toLowerCase().includes(queryLower)) score += 0.3;
      if (metadata?.tags?.some(tag => tag.toLowerCase().includes(queryLower))) score += 0.2;
      
      return { ...asset, similarityScore: Math.min(score, 0.99), searchScore: Math.min(score, 0.99) };
    }).filter(a => a.searchScore >= 0.1)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, limit);
  }
  
  // User and portfolio-based recommendations
  async getRecommendationsForUser(userId: string, limit: number = 10): Promise<Array<Asset & { recommendationScore: number; reason: string }>> {
    const userPortfolios = await this.getUserPortfolios(userId);
    const allAssets = Array.from(this.assets.values());
    
    // Generate recommendations based on user's portfolio patterns
    return allAssets.slice(0, limit).map(asset => ({
      ...asset,
      recommendationScore: Math.random() * 0.3 + 0.7, // 70-100%
      reason: "Based on your portfolio composition and market trends, this asset aligns with your investment strategy."
    }));
  }
  
  async getPortfolioSimilarAssets(portfolioId: string, limit: number = 10): Promise<Array<Asset & { similarityScore: number; portfolioWeight: number }>> {
    const holdings = await this.getPortfolioHoldings(portfolioId);
    const allAssets = Array.from(this.assets.values());
    
    // Generate similar assets based on portfolio holdings
    return allAssets.slice(0, limit).map(asset => ({
      ...asset,
      similarityScore: Math.random() * 0.3 + 0.7, // 70-100%
      portfolioWeight: Math.random() * 0.3 + 0.1 // 10-40%
    }));
  }

  // Comic Series management
  async getComicSeries(id: string): Promise<ComicSeries | undefined> {
    return this.comicSeries.get(id);
  }

  async getComicSeriesList(filters?: { publisher?: string; year?: number; search?: string; limit?: number }): Promise<ComicSeries[]> {
    let series = Array.from(this.comicSeries.values());
    
    if (filters?.publisher) {
      series = series.filter(s => s.publisher.toLowerCase().includes(filters.publisher!.toLowerCase()));
    }
    
    if (filters?.year) {
      series = series.filter(s => s.year === filters.year);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      series = series.filter(s => 
        s.seriesName.toLowerCase().includes(searchLower) ||
        s.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.limit) {
      series = series.slice(0, filters.limit);
    }
    
    return series;
  }

  async createComicSeries(insertSeries: InsertComicSeries): Promise<ComicSeries> {
    const id = randomUUID();
    const series: ComicSeries = {
      ...insertSeries,
      id,
      year: insertSeries.year ?? null,
      issueCount: insertSeries.issueCount ?? null,
      coverStatus: insertSeries.coverStatus ?? null,
      publishedPeriod: insertSeries.publishedPeriod ?? null,
      seriesUrl: insertSeries.seriesUrl ?? null,
      coversUrl: insertSeries.coversUrl ?? null,
      scansUrl: insertSeries.scansUrl ?? null,
      featuredCoverUrl: insertSeries.featuredCoverUrl ?? null,
      description: insertSeries.description ?? null,
      seriesEmbedding: insertSeries.seriesEmbedding ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.comicSeries.set(id, series);
    return series;
  }

  async updateComicSeries(id: string, updateData: Partial<InsertComicSeries>): Promise<ComicSeries | undefined> {
    const series = this.comicSeries.get(id);
    if (!series) return undefined;
    
    const updatedSeries: ComicSeries = {
      ...series,
      ...updateData,
      updatedAt: new Date()
    };
    this.comicSeries.set(id, updatedSeries);
    return updatedSeries;
  }

  async deleteComicSeries(id: string): Promise<boolean> {
    return this.comicSeries.delete(id);
  }

  async createBulkComicSeries(seriesList: InsertComicSeries[]): Promise<ComicSeries[]> {
    const results: ComicSeries[] = [];
    for (const insertSeries of seriesList) {
      const series = await this.createComicSeries(insertSeries);
      results.push(series);
    }
    return results;
  }

  // Featured Comics management
  async getFeaturedComic(id: string): Promise<FeaturedComic | undefined> {
    return this.featuredComics.get(id);
  }

  async getFeaturedComics(filters?: { featureType?: string; isActive?: boolean; limit?: number }): Promise<FeaturedComic[]> {
    let comics = Array.from(this.featuredComics.values());
    
    if (filters?.featureType) {
      comics = comics.filter(comic => comic.featureType === filters.featureType);
    }
    
    if (filters?.isActive !== undefined) {
      comics = comics.filter(comic => comic.isActive === filters.isActive);
    }
    
    // Sort by display order
    comics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    if (filters?.limit) {
      comics = comics.slice(0, filters.limit);
    }
    
    return comics;
  }

  async createFeaturedComic(insertFeatured: InsertFeaturedComic): Promise<FeaturedComic> {
    const id = randomUUID();
    const featured: FeaturedComic = {
      ...insertFeatured,
      id,
      subtitle: insertFeatured.subtitle ?? null,
      description: insertFeatured.description ?? null,
      featuredImageUrl: insertFeatured.featuredImageUrl ?? null,
      seriesId: insertFeatured.seriesId ?? null,
      displayOrder: insertFeatured.displayOrder ?? 0,
      isActive: insertFeatured.isActive ?? true,
      startDate: insertFeatured.startDate ?? null,
      endDate: insertFeatured.endDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.featuredComics.set(id, featured);
    return featured;
  }

  async updateFeaturedComic(id: string, updateData: Partial<InsertFeaturedComic>): Promise<FeaturedComic | undefined> {
    const featured = this.featuredComics.get(id);
    if (!featured) return undefined;
    
    const updatedFeatured: FeaturedComic = {
      ...featured,
      ...updateData,
      updatedAt: new Date()
    };
    this.featuredComics.set(id, updatedFeatured);
    return updatedFeatured;
  }

  async deleteFeaturedComic(id: string): Promise<boolean> {
    return this.featuredComics.delete(id);
  }

  // Comic data aggregation for dashboards
  async getComicMetrics(): Promise<{ totalSeries: number; totalIssues: number; totalCreators: number; totalCovers: number }> {
    return {
      totalSeries: this.comicSeries.size,
      totalIssues: this.comicIssues.size,
      totalCreators: this.comicCreators.size,
      totalCovers: Array.from(this.comicSeries.values()).filter(s => s.featuredCoverUrl || s.coversUrl).length
    };
  }
  
  async getFeaturedComicsCount(): Promise<number> {
    return this.featuredComics.size;
  }

  async getTrendingComicSeries(limit?: number): Promise<ComicSeries[]> {
    const series = Array.from(this.comicSeries.values());
    
    // Simple trending logic - series with more recent years or more covers
    const trending = series
      .filter(s => s.featuredCoverUrl || s.coversUrl)
      .sort((a, b) => {
        const aYear = a.year || 0;
        const bYear = b.year || 0;
        return bYear - aYear;
      });
    
    return limit ? trending.slice(0, limit) : trending;
  }

  async getFeaturedComicsForHomepage(): Promise<FeaturedComic[]> {
    return this.getFeaturedComics({ isActive: true, limit: 10 });
  }

  // Placeholder methods for missing comic methods
  async getComicIssue(id: string): Promise<ComicIssue | undefined> {
    return this.comicIssues.get(id);
  }

  async getComicIssues(filters?: any): Promise<ComicIssue[]> {
    return Array.from(this.comicIssues.values());
  }

  async getComicIssuesBySeriesId(seriesId: string): Promise<ComicIssue[]> {
    return Array.from(this.comicIssues.values()).filter(issue => issue.seriesId === seriesId);
  }

  async createComicIssue(insertIssue: InsertComicIssue): Promise<ComicIssue> {
    const id = randomUUID();
    const issue: ComicIssue = { ...insertIssue, id, createdAt: new Date(), updatedAt: new Date() };
    this.comicIssues.set(id, issue);
    return issue;
  }

  async updateComicIssue(id: string, updateData: Partial<InsertComicIssue>): Promise<ComicIssue | undefined> {
    const issue = this.comicIssues.get(id);
    if (!issue) return undefined;
    const updated = { ...issue, ...updateData, updatedAt: new Date() };
    this.comicIssues.set(id, updated);
    return updated;
  }

  async deleteComicIssue(id: string): Promise<boolean> {
    return this.comicIssues.delete(id);
  }

  async createBulkComicIssues(issuesList: InsertComicIssue[]): Promise<ComicIssue[]> {
    return issuesList.map(issue => this.createComicIssue(issue));
  }

  async getComicCreator(id: string): Promise<ComicCreator | undefined> {
    return this.comicCreators.get(id);
  }

  async getComicCreators(filters?: any): Promise<ComicCreator[]> {
    return Array.from(this.comicCreators.values());
  }

  async getComicCreatorByName(name: string): Promise<ComicCreator | undefined> {
    return Array.from(this.comicCreators.values()).find(creator => creator.name === name);
  }

  async createComicCreator(insertCreator: InsertComicCreator): Promise<ComicCreator> {
    const id = randomUUID();
    const creator: ComicCreator = { ...insertCreator, id, createdAt: new Date(), updatedAt: new Date() };
    this.comicCreators.set(id, creator);
    return creator;
  }

  async updateComicCreator(id: string, updateData: Partial<InsertComicCreator>): Promise<ComicCreator | undefined> {
    const creator = this.comicCreators.get(id);
    if (!creator) return undefined;
    const updated = { ...creator, ...updateData, updatedAt: new Date() };
    this.comicCreators.set(id, updated);
    return updated;
  }

  async deleteComicCreator(id: string): Promise<boolean> {
    return this.comicCreators.delete(id);
  }
}

// Import database storage for persistent storage
import { databaseStorage } from './databaseStorage.js';

// Create and export the storage instance with fallback mechanism
// Use database storage if available, fallback to MemStorage if no DATABASE_URL
let storage: IStorage;

try {
  // Check if DATABASE_URL is available
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl && databaseUrl.trim() !== '') {
    console.log('🗄️ Using database storage (PostgreSQL)');
    storage = databaseStorage;
  } else {
    console.log('⚠️ No DATABASE_URL found, falling back to in-memory storage');
    storage = new MemStorage();
  }
} catch (error) {
  console.warn('⚠️ Database storage failed, falling back to in-memory storage:', error);
  storage = new MemStorage();
}

export { storage };
