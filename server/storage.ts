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
  type TradingLimit, type InsertTradingLimit,
  // Phase 1 Core Trading Foundations
  type Trade, type InsertTrade,
  type Position, type InsertPosition,
  type Balance, type InsertBalance,
  // Notification System Types
  type Notification, type InsertNotification,
  type PriceAlert, type InsertPriceAlert,
  type NotificationPreferences, type InsertNotificationPreferences,
  type NotificationTemplate, type InsertNotificationTemplate,
  // Leaderboard System Types
  type TraderStats, type InsertTraderStats,
  type LeaderboardCategory, type InsertLeaderboardCategory,
  type UserAchievement, type InsertUserAchievement,
  // Learning System Types
  type LearningPath, type InsertLearningPath,
  type SacredLesson, type InsertSacredLesson,
  type MysticalSkill, type InsertMysticalSkill,
  type UserLessonProgress, type InsertUserLessonProgress,
  type UserSkillUnlock, type InsertUserSkillUnlock,
  type TrialOfMastery, type InsertTrialOfMastery,
  type UserTrialAttempt, type InsertUserTrialAttempt,
  type DivineCertification, type InsertDivineCertification,
  type UserCertification, type InsertUserCertification,
  type LearningAnalytics, type InsertLearningAnalytics,
  // Phase 8: External Integration Types
  type ExternalIntegration, type InsertExternalIntegration,
  type IntegrationWebhook, type InsertIntegrationWebhook,
  type IntegrationSyncLog, type InsertIntegrationSyncLog,
  type WorkflowAutomation, type InsertWorkflowAutomation,
  type WorkflowExecution, type InsertWorkflowExecution,
  type IntegrationAnalytics, type InsertIntegrationAnalytics,
  type ExternalUserMapping, type InsertExternalUserMapping,
  // Phase 3: Art-Driven Progression System Types
  type ComicIssueVariant, type InsertComicIssueVariant,
  type UserComicCollection, type InsertUserComicCollection,
  type UserProgressionStatus, type InsertUserProgressionStatus,
  type HouseProgressionPath, type InsertHouseProgressionPath,
  type UserHouseProgression, type InsertUserHouseProgression,
  type TradingToolUnlock, type InsertTradingToolUnlock,
  type ComicCollectionAchievement, type InsertComicCollectionAchievement,
  type CollectionChallenge, type InsertCollectionChallenge,
  type UserChallengeParticipation, type InsertUserChallengeParticipation,
  // Collector System Types - CRITICAL for tenant isolation
  type GradedAssetProfile, type InsertGradedAssetProfile,
  type CollectionStorageBox, type InsertCollectionStorageBox,
  type VariantCoverRegistry, type InsertVariantCoverRegistry,
  // Moral Consequence System Types
  type MoralStanding, type InsertMoralStanding,
  type TradingVictim, type InsertTradingVictim,
  // Noir Journal System Types
  type JournalEntry, type InsertJournalEntry,
  type PsychologicalProfile, type InsertPsychologicalProfile,
  // Social Warfare System Types
  type ShadowTrader, type InsertShadowTrader,
  type StolenPosition, type InsertStolenPosition,
  type TraderWarfare, type InsertTraderWarfare,
  // Seven Houses of Paneltown Types
  type SevenHouse, type InsertSevenHouse,
  type HousePowerRanking, type InsertHousePowerRanking,
  type HouseMarketEvent, type InsertHouseMarketEvent,
  // Narrative Events System Types
  type NarrativeEvent, type InsertNarrativeEvent,
  // Hidden Alignment Tracking Types
  type AlignmentScore, type InsertAlignmentScore,
  type UserDecision, type InsertUserDecision,
  // Price History Types
  type PriceHistory, type InsertPriceHistory
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
  getAssetById(id: string): Promise<Asset | undefined>;
  getAssetBySymbol(symbol: string): Promise<Asset | undefined>;
  getAssets(filters?: { type?: string; search?: string; publisher?: string; limit?: number; offset?: number }): Promise<Asset[]>;
  getAssetsByType(type: string, limit?: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;

  // Market data (OHLC time-series)
  getLatestMarketData(assetId: string, timeframe?: string): Promise<MarketData | undefined>;
  getMarketDataHistory(assetId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketData[]>;
  createMarketData(marketData: InsertMarketData): Promise<MarketData>;
  getBulkLatestMarketData(assetIds: string[], timeframe?: string): Promise<MarketData[]>;
  createBulkMarketData(marketDataList: InsertMarketData[]): Promise<MarketData[]>;

  // Price history (graded comic book pricing)
  createPriceHistory(data: InsertPriceHistory): Promise<PriceHistory>;
  createPriceHistoryBatch(data: InsertPriceHistory[]): Promise<PriceHistory[]>;
  getPriceHistory(assetId: string, grade: string, days: number): Promise<PriceHistory[]>;
  getLatestPricesByGrade(assetId: string): Promise<PriceHistory[]>;
  getPriceTrends(assetId: string, timeframe: '30d' | '90d' | '1y'): Promise<{
    assetId: string;
    timeframe: string;
    percentChange: number;
    priceChange: number;
    high: number;
    low: number;
    average: number;
  }>;

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

  // Narrative Events - Comic book plot events that affect prices
  getNarrativeEvent(id: string): Promise<NarrativeEvent | undefined>;
  getNarrativeEvents(filters?: { isActive?: boolean; eventType?: string; severity?: string; affectedHouse?: string; affectedAsset?: string }): Promise<NarrativeEvent[]>;
  getActiveNarrativeEvents(): Promise<NarrativeEvent[]>;
  createNarrativeEvent(event: InsertNarrativeEvent): Promise<NarrativeEvent>;
  updateNarrativeEvent(id: string, event: Partial<InsertNarrativeEvent>): Promise<NarrativeEvent | undefined>;
  deactivateNarrativeEvent(id: string): Promise<NarrativeEvent | undefined>;
  deleteNarrativeEvent(id: string): Promise<boolean>;
  getEventsByAsset(assetId: string): Promise<NarrativeEvent[]>;
  getEventsByHouse(houseId: string): Promise<NarrativeEvent[]>;

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
  getAllAssetCurrentPrices(marketStatus?: string, limit?: number): Promise<AssetCurrentPrice[]>;
  getAssetsWithPrices(limit?: number): Promise<Array<{ asset: Asset; price: AssetCurrentPrice }>>;
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

  // PHASE 1 CORE TRADING FOUNDATIONS

  // Trades - Executed trades with P&L tracking
  getTrade(id: string): Promise<Trade | undefined>;
  getTrades(userId: string, portfolioId: string, limit?: number): Promise<Trade[]>;
  getTradesByAsset(userId: string, assetId: string, limit?: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, trade: Partial<InsertTrade>): Promise<Trade | undefined>;
  
  // Positions - Current open positions with unrealized P&L
  getPosition(userId: string, portfolioId: string, assetId: string): Promise<Position | undefined>;
  getPositions(userId: string, portfolioId: string): Promise<Position[]>;
  getPositionById(id: string): Promise<Position | undefined>;
  createPosition(position: InsertPosition): Promise<Position>;
  updatePosition(id: string, position: Partial<InsertPosition>): Promise<Position | undefined>;
  deletePosition(id: string): Promise<boolean>;
  
  // Balances - User account balances and buying power
  getBalance(userId: string, portfolioId: string): Promise<Balance | undefined>;
  getBalanceById(id: string): Promise<Balance | undefined>;
  createBalance(balance: InsertBalance): Promise<Balance>;
  updateBalance(id: string, balance: Partial<InsertBalance>): Promise<Balance | undefined>;
  recalculateBalance(userId: string, portfolioId: string): Promise<Balance | undefined>;

  // NOTIFICATION SYSTEM METHODS

  // Notifications
  getNotification(id: string): Promise<Notification | undefined>;
  getUserNotifications(userId: string, filters?: { type?: string; read?: boolean; priority?: string; limit?: number }): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: string, notification: Partial<InsertNotification>): Promise<Notification | undefined>;
  deleteNotification(id: string): Promise<boolean>;
  markNotificationAsRead(notificationId: string): Promise<boolean>;
  markAllNotificationsAsRead(userId: string): Promise<boolean>;
  deleteExpiredNotifications(): Promise<number>;
  getUserUnreadNotificationCount(userId: string): Promise<number>;

  // Price Alerts
  getPriceAlert(id: string): Promise<PriceAlert | undefined>;
  getUserPriceAlerts(userId: string, filters?: { assetId?: string; isActive?: boolean }): Promise<PriceAlert[]>;
  getPriceAlerts(filters?: { isActive?: boolean; assetId?: string; alertType?: string }): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  updatePriceAlert(id: string, alert: Partial<InsertPriceAlert>): Promise<PriceAlert | undefined>;
  deletePriceAlert(id: string): Promise<boolean>;

  // Notification Preferences
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  createNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: string, preferences: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences | undefined>;

  // Notification Templates
  getNotificationTemplate(type: string): Promise<NotificationTemplate | undefined>;
  getNotificationTemplates(filters?: { isActive?: boolean }): Promise<NotificationTemplate[]>;
  createNotificationTemplate(template: InsertNotificationTemplate): Promise<NotificationTemplate>;
  updateNotificationTemplate(id: string, template: Partial<InsertNotificationTemplate>): Promise<NotificationTemplate | undefined>;

  // LEADERBOARD SYSTEM METHODS

  // Trader Statistics
  getTraderStats(userId: string): Promise<TraderStats | undefined>;
  getAllTraderStats(filters?: { minTrades?: number; limit?: number; offset?: number }): Promise<TraderStats[]>;
  createTraderStats(stats: InsertTraderStats): Promise<TraderStats>;
  updateTraderStats(userId: string, stats: Partial<InsertTraderStats>): Promise<TraderStats | undefined>;
  updateTraderStatsFromTrade(userId: string, tradeData: { 
    portfolioValue: string; 
    pnl: string; 
    tradeSize: string; 
    isProfitable: boolean;
    volume: string;
  }): Promise<TraderStats | undefined>;
  recalculateAllTraderStats(): Promise<void>;
  getTopTradersByMetric(metric: 'totalPnL' | 'winRate' | 'totalTradingVolume' | 'roiPercentage', limit?: number): Promise<TraderStats[]>;

  // Leaderboard Categories
  getLeaderboardCategory(id: string): Promise<LeaderboardCategory | undefined>;
  getLeaderboardCategories(filters?: { isActive?: boolean; timeframe?: string }): Promise<LeaderboardCategory[]>;
  createLeaderboardCategory(category: InsertLeaderboardCategory): Promise<LeaderboardCategory>;
  updateLeaderboardCategory(id: string, category: Partial<InsertLeaderboardCategory>): Promise<LeaderboardCategory | undefined>;
  deleteLeaderboardCategory(id: string): Promise<boolean>;

  // Leaderboard Generation and Rankings
  generateLeaderboard(categoryType: string, timeframe: string, limit?: number): Promise<Array<TraderStats & { user: User; rank: number }>>;
  getLeaderboardByCategoryId(categoryId: string, limit?: number): Promise<Array<TraderStats & { user: User; rank: number }>>;
  getUserRankInCategory(userId: string, categoryType: string, timeframe: string): Promise<{ rank: number; totalUsers: number; stats: TraderStats } | undefined>;
  updateLeaderboardRankings(categoryType?: string): Promise<void>;

  // User Achievements
  getUserAchievement(id: string): Promise<UserAchievement | undefined>;
  getUserAchievements(userId: string, filters?: { category?: string; tier?: string; isVisible?: boolean }): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
  updateUserAchievement(id: string, achievement: Partial<InsertUserAchievement>): Promise<UserAchievement | undefined>;
  deleteUserAchievement(id: string): Promise<boolean>;
  
  // Achievement Processing
  checkAndAwardAchievements(userId: string, context: 'trade_completed' | 'milestone_reached' | 'streak_achieved'): Promise<UserAchievement[]>;
  getAvailableAchievements(): Promise<Array<{ id: string; title: string; description: string; category: string; tier: string; criteria: any }>>;
  getUserAchievementProgress(userId: string, achievementId: string): Promise<{ current: number; required: number; percentage: number } | undefined>;

  // Leaderboard Analytics and Statistics  
  getLeaderboardOverview(): Promise<{
    totalActiveTraders: number;
    totalTrades: number;
    totalVolume: string;
    topPerformer: TraderStats & { user: User };
    categories: LeaderboardCategory[];
  }>;
  getTradingActivitySummary(timeframe: 'daily' | 'weekly' | 'monthly'): Promise<{
    newTraders: number;
    totalTrades: number;
    totalVolume: string;
    avgTradeSize: string;
    topMovers: Array<TraderStats & { user: User }>;
  }>;

  // MYTHOLOGICAL HOUSES SYSTEM METHODS

  // House Member Management
  getHouseMembers(houseId: string): Promise<User[]>;
  getHouseMemberCount(houseId: string): Promise<number>;
  getHouseTopTraders(houseId: string, limit?: number): Promise<Array<User & { karma: number; rank: number }>>;
  getUserHouseRank(userId: string, houseId: string): Promise<{ rank: number; totalMembers: number } | undefined>;

  // Karma System
  getUserKarma(userId: string): Promise<number>;
  recordKarmaAction(userId: string, action: string, karmaChange: number, reason?: string): Promise<boolean>;

  // User Updates (for house joining)
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // COMPREHENSIVE LEARNING SYSTEM METHODS

  // Learning Paths Management
  getLearningPath(id: string): Promise<LearningPath | undefined>;
  getLearningPaths(filters?: { houseId?: string; difficultyLevel?: string; isActive?: boolean }): Promise<LearningPath[]>;
  getLearningPathsByHouse(houseId: string): Promise<LearningPath[]>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(id: string, path: Partial<InsertLearningPath>): Promise<LearningPath | undefined>;
  deleteLearningPath(id: string): Promise<boolean>;

  // Sacred Lessons Management
  getSacredLesson(id: string): Promise<SacredLesson | undefined>;
  getSacredLessons(filters?: { houseId?: string; pathId?: string; lessonType?: string; difficultyLevel?: string; isActive?: boolean }): Promise<SacredLesson[]>;
  getLessonsByPath(pathId: string): Promise<SacredLesson[]>;
  getLessonsByHouse(houseId: string): Promise<SacredLesson[]>;
  createSacredLesson(lesson: InsertSacredLesson): Promise<SacredLesson>;
  updateSacredLesson(id: string, lesson: Partial<InsertSacredLesson>): Promise<SacredLesson | undefined>;
  deleteSacredLesson(id: string): Promise<boolean>;
  searchLessons(searchTerm: string, filters?: { houseId?: string; difficultyLevel?: string }): Promise<SacredLesson[]>;

  // Mystical Skills Management
  getMysticalSkill(id: string): Promise<MysticalSkill | undefined>;
  getMysticalSkills(filters?: { houseId?: string; skillCategory?: string; tier?: string; rarityLevel?: string; isActive?: boolean }): Promise<MysticalSkill[]>;
  getSkillsByHouse(houseId: string): Promise<MysticalSkill[]>;
  getSkillsByCategory(category: string): Promise<MysticalSkill[]>;
  getSkillTree(houseId?: string): Promise<Array<MysticalSkill & { prerequisites: MysticalSkill[]; unlocks: MysticalSkill[] }>>;
  createMysticalSkill(skill: InsertMysticalSkill): Promise<MysticalSkill>;
  updateMysticalSkill(id: string, skill: Partial<InsertMysticalSkill>): Promise<MysticalSkill | undefined>;
  deleteMysticalSkill(id: string): Promise<boolean>;

  // User Learning Progress Tracking
  getUserLessonProgress(id: string): Promise<UserLessonProgress | undefined>;
  getUserLessonProgresses(userId: string, filters?: { pathId?: string; status?: string; lessonId?: string }): Promise<UserLessonProgress[]>;
  getLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | undefined>;
  createUserLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress>;
  updateUserLessonProgress(id: string, progress: Partial<InsertUserLessonProgress>): Promise<UserLessonProgress | undefined>;
  startLesson(userId: string, lessonId: string): Promise<UserLessonProgress>;
  completeLesson(userId: string, lessonId: string, score: number, timeSpent: number): Promise<UserLessonProgress>;
  updateLessonProgress(userId: string, lessonId: string, progressData: { 
    progressPercent: number; 
    currentSection: number; 
    timeSpent: number; 
    interactionData?: any 
  }): Promise<UserLessonProgress>;

  // User Skill Unlocks Management
  getUserSkillUnlock(id: string): Promise<UserSkillUnlock | undefined>;
  getUserSkillUnlocks(userId: string, filters?: { skillId?: string; masteryLevel?: number }): Promise<UserSkillUnlock[]>;
  getUserSkillById(userId: string, skillId: string): Promise<UserSkillUnlock | undefined>;
  createUserSkillUnlock(unlock: InsertUserSkillUnlock): Promise<UserSkillUnlock>;
  updateUserSkillUnlock(id: string, unlock: Partial<InsertUserSkillUnlock>): Promise<UserSkillUnlock | undefined>;
  unlockSkill(userId: string, skillId: string, unlockMethod: string): Promise<UserSkillUnlock>;
  upgradeSkillMastery(userId: string, skillId: string, experienceSpent: number): Promise<UserSkillUnlock | undefined>;
  getUserSkillBonuses(userId: string): Promise<Array<{ skill: MysticalSkill; unlock: UserSkillUnlock; effectiveBonus: number }>>;
  checkSkillUnlockEligibility(userId: string, skillId: string): Promise<{ eligible: boolean; requirements: any; missing: any }>;

  // Trials of Mastery Management
  getTrialOfMastery(id: string): Promise<TrialOfMastery | undefined>;
  getTrialsOfMastery(filters?: { houseId?: string; trialType?: string; difficultyLevel?: string; isActive?: boolean }): Promise<TrialOfMastery[]>;
  getTrialsByHouse(houseId: string): Promise<TrialOfMastery[]>;
  createTrialOfMastery(trial: InsertTrialOfMastery): Promise<TrialOfMastery>;
  updateTrialOfMastery(id: string, trial: Partial<InsertTrialOfMastery>): Promise<TrialOfMastery | undefined>;
  deleteTrialOfMastery(id: string): Promise<boolean>;

  // User Trial Attempts Management
  getUserTrialAttempt(id: string): Promise<UserTrialAttempt | undefined>;
  getUserTrialAttempts(userId: string, filters?: { trialId?: string; status?: string; passed?: boolean }): Promise<UserTrialAttempt[]>;
  getTrialAttempts(trialId: string, filters?: { status?: string; passed?: boolean }): Promise<UserTrialAttempt[]>;
  createUserTrialAttempt(attempt: InsertUserTrialAttempt): Promise<UserTrialAttempt>;
  updateUserTrialAttempt(id: string, attempt: Partial<InsertUserTrialAttempt>): Promise<UserTrialAttempt | undefined>;
  startTrial(userId: string, trialId: string): Promise<UserTrialAttempt>;
  submitTrialResults(userId: string, trialId: string, attemptId: string, results: { 
    phaseScores: any; 
    overallScore: number; 
    timeSpent: number; 
    responses: any 
  }): Promise<UserTrialAttempt>;
  checkTrialEligibility(userId: string, trialId: string): Promise<{ eligible: boolean; requirements: any; missing: any }>;

  // Divine Certifications Management
  getDivineCertification(id: string): Promise<DivineCertification | undefined>;
  getDivineCertifications(filters?: { houseId?: string; certificationLevel?: string; category?: string; rarityLevel?: string; isActive?: boolean }): Promise<DivineCertification[]>;
  getCertificationsByHouse(houseId: string): Promise<DivineCertification[]>;
  createDivineCertification(certification: InsertDivineCertification): Promise<DivineCertification>;
  updateDivineCertification(id: string, certification: Partial<InsertDivineCertification>): Promise<DivineCertification | undefined>;
  deleteDivineCertification(id: string): Promise<boolean>;

  // User Certifications Management
  getUserCertification(id: string): Promise<UserCertification | undefined>;
  getUserCertifications(userId: string, filters?: { certificationId?: string; status?: string; displayInProfile?: boolean }): Promise<UserCertification[]>;
  getCertificationHolders(certificationId: string): Promise<UserCertification[]>;
  createUserCertification(certification: InsertUserCertification): Promise<UserCertification>;
  updateUserCertification(id: string, certification: Partial<InsertUserCertification>): Promise<UserCertification | undefined>;
  awardCertification(userId: string, certificationId: string, achievementMethod: string, verificationData?: any): Promise<UserCertification>;
  revokeCertification(userId: string, certificationId: string, reason: string): Promise<boolean>;
  checkCertificationEligibility(userId: string, certificationId: string): Promise<{ eligible: boolean; requirements: any; missing: any }>;

  // Learning Analytics Management
  getLearningAnalytics(userId: string): Promise<LearningAnalytics | undefined>;
  createLearningAnalytics(analytics: InsertLearningAnalytics): Promise<LearningAnalytics>;
  updateLearningAnalytics(userId: string, analytics: Partial<InsertLearningAnalytics>): Promise<LearningAnalytics | undefined>;
  recalculateLearningAnalytics(userId: string): Promise<LearningAnalytics>;
  generateLearningRecommendations(userId: string): Promise<{ 
    recommendedPaths: LearningPath[]; 
    suggestedLessons: SacredLesson[]; 
    skillsToUnlock: MysticalSkill[]; 
    interventions: any[] 
  }>;

  // Hidden Alignment Tracking Methods (for psychological profiling)
  getUserAlignmentScore(userId: string): Promise<AlignmentScore | undefined>;
  createAlignmentScore(score: InsertAlignmentScore): Promise<AlignmentScore>;
  updateAlignmentScore(userId: string, adjustments: {
    ruthlessnessDelta?: number;
    individualismDelta?: number;
    lawfulnessDelta?: number;
    greedDelta?: number;
  }): Promise<AlignmentScore | undefined>;
  
  // Record user decisions for hidden tracking
  recordUserDecision(decision: InsertUserDecision): Promise<UserDecision>;
  getUserDecisions(userId: string, filters?: { 
    decisionType?: string; 
    scenarioId?: string; 
    limit?: number 
  }): Promise<UserDecision[]>;
  
  // Calculate House assignment based on hidden alignment
  calculateHouseAssignment(userId: string): Promise<{
    primaryHouse: string;
    secondaryHouse?: string;
    alignmentProfile: {
      ruthlessness: number;
      individualism: number;
      lawfulness: number;
      greed: number;
    };
    confidence: number;
  }>;

  // Learning System Analytics and Insights
  getHouseLearningStats(houseId: string): Promise<{
    totalPaths: number;
    totalLessons: number;
    totalSkills: number;
    averageProgress: number;
    topPerformers: Array<User & { progress: number }>;
    engagement: number;
  }>;
  getGlobalLearningStats(): Promise<{
    totalLearners: number;
    totalLessonsCompleted: number;
    totalSkillsUnlocked: number;
    averageTimeToComplete: number;
    houseComparisons: Array<{ houseId: string; avgProgress: number; engagement: number }>;
  }>;
  getUserLearningDashboard(userId: string): Promise<{
    analytics: LearningAnalytics;
    currentPaths: LearningPath[];
    recentProgress: UserLessonProgress[];
    unlockedSkills: Array<UserSkillUnlock & { skill: MysticalSkill }>;
    certifications: Array<UserCertification & { certification: DivineCertification }>;
    recommendations: { paths: LearningPath[]; lessons: SacredLesson[]; skills: MysticalSkill[] };
    achievements: any[];
  }>;

  // Advanced Learning Features
  generatePersonalizedLearningPath(userId: string, preferences: { 
    preferredHouses: string[]; 
    difficultyPreference: string; 
    timeCommitment: number; 
    learningGoals: string[] 
  }): Promise<LearningPath>;
  detectLearningPatterns(userId: string): Promise<{
    learningStyle: string;
    optimalSessionLength: number;
    preferredContentTypes: string[];
    strugglingAreas: string[];
    strengthAreas: string[];
  }>;
  predictLearningOutcomes(userId: string, pathId: string): Promise<{
    estimatedCompletionTime: number;
    successProbability: number;
    recommendedPrerequisites: LearningPath[];
    riskFactors: string[];
  }>;

  // =============================================
  // INVESTMENT CLUBS METHODS
  // =============================================

  // Investment Clubs
  getInvestmentClub(id: string): Promise<InvestmentClub | undefined>;
  getInvestmentClubs(filters?: { status?: string; ownerId?: string }): Promise<InvestmentClub[]>;
  getUserInvestmentClubs(userId: string): Promise<InvestmentClub[]>;
  createInvestmentClub(club: InsertInvestmentClub): Promise<InvestmentClub>;
  updateInvestmentClub(id: string, club: Partial<InsertInvestmentClub>): Promise<InvestmentClub | undefined>;
  deleteInvestmentClub(id: string): Promise<boolean>;

  // Club Memberships
  getClubMembership(clubId: string, userId: string): Promise<ClubMembership | undefined>;
  getClubMemberships(clubId: string, status?: string): Promise<ClubMembership[]>;
  getUserClubMemberships(userId: string, status?: string): Promise<ClubMembership[]>;
  createClubMembership(membership: InsertClubMembership): Promise<ClubMembership>;
  updateClubMembership(id: string, membership: Partial<InsertClubMembership>): Promise<ClubMembership | undefined>;
  deleteClubMembership(id: string): Promise<boolean>;

  // Club Portfolios
  getClubPortfolio(id: string): Promise<ClubPortfolio | undefined>;
  getClubPortfolioByClubId(clubId: string): Promise<ClubPortfolio | undefined>;
  createClubPortfolio(portfolio: InsertClubPortfolio): Promise<ClubPortfolio>;
  updateClubPortfolio(id: string, portfolio: Partial<InsertClubPortfolio>): Promise<ClubPortfolio | undefined>;

  // Club Proposals
  getClubProposal(id: string): Promise<ClubProposal | undefined>;
  getClubProposals(clubId: string, filters?: { status?: string; proposalType?: string }): Promise<ClubProposal[]>;
  createClubProposal(proposal: InsertClubProposal): Promise<ClubProposal>;
  updateClubProposal(id: string, proposal: Partial<InsertClubProposal>): Promise<ClubProposal | undefined>;
  deleteClubProposal(id: string): Promise<boolean>;

  // Club Votes
  getClubVote(proposalId: string, userId: string): Promise<ClubVote | undefined>;
  getClubVotes(proposalId: string): Promise<ClubVote[]>;
  createClubVote(vote: InsertClubVote): Promise<ClubVote>;

  // Club Activity Log
  getClubActivityLog(clubId: string, limit?: number): Promise<ClubActivityLog[]>;
  createClubActivityLog(log: InsertClubActivityLog): Promise<ClubActivityLog>;

  // Career Pathway (for eligibility checks)
  getCareerPathwayLevel(id: string): Promise<CareerPathwayLevel | undefined>;
  getUserPathwayProgress(userId: string): Promise<UserPathwayProgress | undefined>;

  // =============================================
  // PHASE 8: EXTERNAL INTEGRATION METHODS
  // =============================================

  // External Integrations
  getExternalIntegration(id: string): Promise<ExternalIntegration | undefined>;
  getUserExternalIntegrations(userId: string, filters?: { integrationName?: string; status?: string }): Promise<ExternalIntegration[]>;
  createExternalIntegration(integration: InsertExternalIntegration): Promise<ExternalIntegration>;
  updateExternalIntegration(id: string, integration: Partial<InsertExternalIntegration>): Promise<ExternalIntegration | undefined>;
  deleteExternalIntegration(id: string): Promise<boolean>;

  // Integration Webhooks
  getIntegrationWebhook(id: string): Promise<IntegrationWebhook | undefined>;
  getIntegrationWebhooks(integrationId: string, filters?: { webhookType?: string; eventType?: string; isActive?: boolean }): Promise<IntegrationWebhook[]>;
  createIntegrationWebhook(webhook: InsertIntegrationWebhook): Promise<IntegrationWebhook>;
  updateIntegrationWebhook(id: string, webhook: Partial<InsertIntegrationWebhook>): Promise<IntegrationWebhook | undefined>;
  deleteIntegrationWebhook(id: string): Promise<boolean>;

  // Integration Sync Logs
  getIntegrationSyncLog(id: string): Promise<IntegrationSyncLog | undefined>;
  getIntegrationSyncLogs(integrationId: string, filters?: { syncType?: string; status?: string; limit?: number }): Promise<IntegrationSyncLog[]>;
  createIntegrationSyncLog(syncLog: InsertIntegrationSyncLog): Promise<IntegrationSyncLog>;
  updateIntegrationSyncLog(id: string, syncLog: Partial<InsertIntegrationSyncLog>): Promise<IntegrationSyncLog | undefined>;
  deleteIntegrationSyncLog(id: string): Promise<boolean>;

  // Workflow Automations
  getWorkflowAutomation(id: string): Promise<WorkflowAutomation | undefined>;
  getUserWorkflowAutomations(userId: string, filters?: { category?: string; isActive?: boolean; ritualType?: string }): Promise<WorkflowAutomation[]>;
  createWorkflowAutomation(workflow: InsertWorkflowAutomation): Promise<WorkflowAutomation>;
  updateWorkflowAutomation(id: string, workflow: Partial<InsertWorkflowAutomation>): Promise<WorkflowAutomation | undefined>;
  deleteWorkflowAutomation(id: string): Promise<boolean>;

  // Workflow Executions
  getWorkflowExecution(id: string): Promise<WorkflowExecution | undefined>;
  getWorkflowExecutions(workflowId: string, filters?: { status?: string; limit?: number }): Promise<WorkflowExecution[]>;
  createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution>;
  updateWorkflowExecution(id: string, execution: Partial<InsertWorkflowExecution>): Promise<WorkflowExecution | undefined>;
  getUserWorkflowExecutions(userId: string, filters?: { status?: string; limit?: number }): Promise<WorkflowExecution[]>;

  // Integration Analytics
  getIntegrationAnalytics(id: string): Promise<IntegrationAnalytics | undefined>;
  getUserIntegrationAnalytics(userId: string, filters?: { timeframe?: string; integrationName?: string }): Promise<IntegrationAnalytics[]>;
  createIntegrationAnalytics(analytics: InsertIntegrationAnalytics): Promise<IntegrationAnalytics>;
  updateIntegrationAnalytics(id: string, analytics: Partial<InsertIntegrationAnalytics>): Promise<IntegrationAnalytics | undefined>;
  
  // External User Mappings
  getExternalUserMapping(id: string): Promise<ExternalUserMapping | undefined>;
  getUserExternalMappings(userId: string, integrationId?: string): Promise<ExternalUserMapping[]>;
  getExternalUserMappingByExternalId(integrationId: string, externalUserId: string): Promise<ExternalUserMapping | undefined>;
  createExternalUserMapping(mapping: InsertExternalUserMapping): Promise<ExternalUserMapping>;
  updateExternalUserMapping(id: string, mapping: Partial<InsertExternalUserMapping>): Promise<ExternalUserMapping | undefined>;
  deleteExternalUserMapping(id: string): Promise<boolean>;

  // Integration Health and Monitoring
  updateIntegrationHealth(integrationId: string, healthStatus: string, errorMessage?: string): Promise<void>;
  getUnhealthyIntegrations(): Promise<ExternalIntegration[]>;
  getIntegrationUsageStats(integrationId: string, timeframe: string): Promise<{
    totalApiCalls: number;
    successRate: number;
    averageResponseTime: number;
    errorCount: number;
  }>;

  // Workflow Automation Helpers
  getActiveWorkflowAutomations(category?: string): Promise<WorkflowAutomation[]>;
  getScheduledWorkflows(beforeDate?: Date): Promise<WorkflowAutomation[]>;
  updateWorkflowLastRun(workflowId: string, success: boolean, errorMessage?: string): Promise<void>;
  incrementWorkflowStats(workflowId: string, success: boolean, executionTime: number): Promise<void>;

  // ===== PHASE 3: ART-DRIVEN PROGRESSION SYSTEM =====
  
  // Comic Issue Variants
  getComicIssueVariant(id: string): Promise<ComicIssueVariant | undefined>;
  getComicIssueVariants(filters?: { coverType?: string; issueType?: string; primaryHouse?: string; minRarity?: number; maxPrice?: number; search?: string }, limit?: number, offset?: number): Promise<ComicIssueVariant[]>;
  createComicIssueVariant(variant: InsertComicIssueVariant): Promise<ComicIssueVariant>;
  updateComicIssueVariant(id: string, variant: Partial<InsertComicIssueVariant>): Promise<ComicIssueVariant | undefined>;

  // User Comic Collection
  getUserComicCollections(userId: string): Promise<UserComicCollection[]>;
  getUserComicCollectionByVariant(userId: string, variantId: string): Promise<UserComicCollection | undefined>;
  getUserComicCollectionItem(id: string): Promise<UserComicCollection | undefined>;
  createUserComicCollection(collection: InsertUserComicCollection): Promise<UserComicCollection>;
  updateUserComicCollection(id: string, collection: Partial<InsertUserComicCollection>): Promise<UserComicCollection | undefined>;
  deleteUserComicCollection(id: string): Promise<boolean>;

  // User Progression Status
  getUserProgressionStatus(userId: string): Promise<UserProgressionStatus | undefined>;
  createUserProgressionStatus(status: InsertUserProgressionStatus): Promise<UserProgressionStatus>;
  updateUserProgressionStatus(id: string, status: Partial<InsertUserProgressionStatus>): Promise<UserProgressionStatus | undefined>;

  // House Progression Paths
  getHouseProgressionPath(houseId: string, level: number): Promise<HouseProgressionPath | undefined>;
  getHouseProgressionPaths(houseId: string): Promise<HouseProgressionPath[]>;
  getAllHouseProgressionPaths(): Promise<HouseProgressionPath[]>;
  createHouseProgressionPath(path: InsertHouseProgressionPath): Promise<HouseProgressionPath>;
  updateHouseProgressionPath(id: string, path: Partial<InsertHouseProgressionPath>): Promise<HouseProgressionPath | undefined>;

  // User House Progression
  getUserHouseProgression(userId: string, houseId: string): Promise<UserHouseProgression | undefined>;
  getUserHouseProgressions(userId: string): Promise<UserHouseProgression[]>;
  createUserHouseProgression(progression: InsertUserHouseProgression): Promise<UserHouseProgression>;
  updateUserHouseProgression(id: string, progression: Partial<InsertUserHouseProgression>): Promise<UserHouseProgression | undefined>;

  // Trading Tool Unlocks
  getTradingToolUnlock(userId: string, toolName: string): Promise<TradingToolUnlock | undefined>;
  getTradingToolUnlocks(userId: string): Promise<TradingToolUnlock[]>;
  createTradingToolUnlock(unlock: InsertTradingToolUnlock): Promise<TradingToolUnlock>;
  updateTradingToolUnlock(id: string, unlock: Partial<InsertTradingToolUnlock>): Promise<TradingToolUnlock | undefined>;

  // Comic Collection Achievements
  getComicCollectionAchievements(filters?: { category?: string; tier?: string; isHidden?: boolean }): Promise<ComicCollectionAchievement[]>;
  getComicCollectionAchievement(achievementId: string): Promise<ComicCollectionAchievement | undefined>;
  createComicCollectionAchievement(achievement: InsertComicCollectionAchievement): Promise<ComicCollectionAchievement>;
  updateComicCollectionAchievement(id: string, achievement: Partial<InsertComicCollectionAchievement>): Promise<ComicCollectionAchievement | undefined>;

  // User Achievement Management (extend existing)
  getUserAchievementByAchievementId(userId: string, achievementId: string): Promise<UserAchievement | undefined>;

  // Collection Challenges
  getCollectionChallenges(filters?: { challengeType?: string; houseSpecific?: boolean; isActive?: boolean }): Promise<CollectionChallenge[]>;
  getCollectionChallenge(id: string): Promise<CollectionChallenge | undefined>;
  getActiveChallengesForUser(userId: string): Promise<CollectionChallenge[]>;
  createCollectionChallenge(challenge: InsertCollectionChallenge): Promise<CollectionChallenge>;
  updateCollectionChallenge(id: string, challenge: Partial<InsertCollectionChallenge>): Promise<CollectionChallenge | undefined>;

  // User Challenge Participation
  getUserChallengeParticipation(userId: string, challengeId: string): Promise<UserChallengeParticipation | undefined>;
  getUserChallengeParticipations(userId: string): Promise<UserChallengeParticipation[]>;
  createUserChallengeParticipation(participation: InsertUserChallengeParticipation): Promise<UserChallengeParticipation>;
  updateUserChallengeParticipation(id: string, participation: Partial<InsertUserChallengeParticipation>): Promise<UserChallengeParticipation | undefined>;

  // Progression Leaderboards
  getProgressionLeaderboard(category: string, timeframe: string): Promise<any[]>;
  
  // ============================================================================
  // COLLECTOR SYSTEM - CRITICAL SECURITY: All methods require userId validation
  // ============================================================================
  
  // Graded Asset Profile Methods (CRITICAL: userId required for tenant isolation)
  createGradedAssetProfile(profileData: InsertGradedAssetProfile): Promise<GradedAssetProfile>;
  getUserGradedAssetProfiles(userId: string, filters?: {
    rarityFilter?: string;
    storageTypeFilter?: string;
    sortBy?: string;
  }): Promise<GradedAssetProfile[]>;
  getGradedAssetProfile(profileId: string, userId?: string): Promise<GradedAssetProfile | undefined>;
  updateGradedAssetProfile(profileId: string, updates: Partial<InsertGradedAssetProfile>, userId?: string): Promise<GradedAssetProfile | undefined>;
  deleteGradedAssetProfile(profileId: string, userId?: string): Promise<boolean>;
  
  // Collection Storage Box Methods (CRITICAL: userId required for tenant isolation)
  getCollectionStorageBoxes(userId: string, filters?: { boxType?: string; sortBy?: string }): Promise<CollectionStorageBox[]>;
  createCollectionStorageBox(boxData: InsertCollectionStorageBox): Promise<CollectionStorageBox>;
  updateCollectionStorageBox(boxId: string, updates: Partial<InsertCollectionStorageBox>, userId?: string): Promise<CollectionStorageBox | undefined>;
  
  // Variant Cover Registry Methods
  getVariantCoversByAsset(baseAssetId: string): Promise<VariantCoverRegistry[]>;
  createVariantCover(variantData: InsertVariantCoverRegistry): Promise<VariantCoverRegistry>;
  getVariantCover(variantId: string): Promise<VariantCoverRegistry | undefined>;
  searchVariantCovers(criteria: {
    variantType?: string;
    coverArtist?: string;
    publisher?: string;
    minRarity?: string;
    maxPrice?: number;
  }): Promise<VariantCoverRegistry[]>;
  
  // Collection Analytics Methods (CRITICAL: userId required for tenant isolation)
  getCollectionAnalytics(userId: string): Promise<{
    totalItems: number;
    totalValue: number;
    averageGrade: number;
    gradeDistribution: { [grade: string]: number };
    rarityDistribution: { [rarity: string]: number };
    houseDistribution: { [house: string]: number };
    keyIssuesCount: number;
    signedCount: number;
    growthRate: number;
    topPerformers: GradedAssetProfile[];
  }>;
  
  // Moral Consequence System Methods
  createVictim(victim: InsertTradingVictim): Promise<TradingVictim>;
  getMoralStanding(userId: string): Promise<MoralStanding | undefined>;
  createMoralStanding(moralStanding: InsertMoralStanding): Promise<MoralStanding>;
  updateMoralStanding(userId: string, updates: Partial<InsertMoralStanding>): Promise<MoralStanding | undefined>;

  // Noir Journal System operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string, filters?: { 
    entryType?: string; 
    limit?: number; 
    offset?: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  getLatestJournalEntry(userId: string, entryType?: string): Promise<JournalEntry | undefined>;
  createPsychologicalProfile(profile: InsertPsychologicalProfile): Promise<PsychologicalProfile>;
  getPsychologicalProfile(userId: string): Promise<PsychologicalProfile | undefined>;
  updatePsychologicalProfile(userId: string, profile: Partial<InsertPsychologicalProfile>): Promise<PsychologicalProfile | undefined>;

  // Social Warfare System operations
  createShadowTrader(shadow: InsertShadowTrader): Promise<ShadowTrader>;
  getShadowTrader(id: string): Promise<ShadowTrader | undefined>;
  getShadowTraderByUserId(userId: string): Promise<ShadowTrader | undefined>;
  getShadowTradersByStatus(status: string): Promise<ShadowTrader[]>;
  getAllShadowTraders(): Promise<ShadowTrader[]>;
  getAIShadowTraders(limit: number): Promise<ShadowTrader[]>;
  updateShadowTrader(id: string, updates: Partial<InsertShadowTrader>): Promise<ShadowTrader | undefined>;
  
  createStolenPosition(stolenPosition: InsertStolenPosition): Promise<StolenPosition>;
  getStolenPositionsByThief(thiefId: string): Promise<StolenPosition[]>;
  getStolenPositionsByVictim(victimId: string): Promise<StolenPosition[]>;
  
  createTraderWarfare(warfare: InsertTraderWarfare): Promise<TraderWarfare>;
  getTraderWarfareByAttacker(attackerId: string): Promise<TraderWarfare[]>;
  getTraderWarfareByDefender(defenderId: string): Promise<TraderWarfare[]>;
  getAllTraderWarfare(limit?: number): Promise<TraderWarfare[]>;

  // Helper methods for warfare
  getAllUsers(): Promise<User[]>;
  getUserBalance(userId: string): Promise<Balance | undefined>;
  getUserPositions(userId: string): Promise<Position[]>;
  updatePosition(id: string, updates: Partial<InsertPosition>): Promise<Position | undefined>;
  createTradingVictim(victim: InsertTradingVictim): Promise<TradingVictim>;

  // Seven Houses of Paneltown Operations
  getSevenHouse(id: string): Promise<SevenHouse | undefined>;
  getSevenHouseByName(name: string): Promise<SevenHouse | undefined>;
  getAllSevenHouses(): Promise<SevenHouse[]>;
  createSevenHouse(house: InsertSevenHouse): Promise<SevenHouse>;
  updateSevenHouse(id: string, house: Partial<InsertSevenHouse>): Promise<SevenHouse | undefined>;
  
  // Convenience aliases for Seven Houses (for consistent API)
  getHouse(id: string): Promise<SevenHouse | undefined>;
  getAllHouses(): Promise<SevenHouse[]>;
  createHouse(house: InsertSevenHouse): Promise<SevenHouse>;
  
  // House Power Rankings
  getLatestPowerRankings(): Promise<HousePowerRanking[]>;
  getPowerRankingsByWeek(week: Date): Promise<HousePowerRanking[]>;
  createPowerRanking(ranking: InsertHousePowerRanking): Promise<HousePowerRanking>;
  updateHousePowerMetrics(houseId: string, metrics: {
    marketCap?: string;
    dailyVolume?: string;
    powerLevel?: string;
  }): Promise<SevenHouse | undefined>;
  
  // House Market Events
  getHouseMarketEvents(filters?: {
    houseId?: string;
    eventType?: string;
    limit?: number;
  }): Promise<HouseMarketEvent[]>;
  createHouseMarketEvent(event: InsertHouseMarketEvent): Promise<HouseMarketEvent>;
  getRecentHouseEvents(limit?: number): Promise<HouseMarketEvent[]>;
  
  // House Asset Control
  getAssetsByHouse(houseId: string): Promise<Asset[]>;
  transferAssetControl(assetId: string, newHouseId: string): Promise<Asset | undefined>;
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
  
  // Hidden alignment tracking storage
  private alignmentScores: Map<string, AlignmentScore>; // keyed by userId
  private userDecisions: Map<string, UserDecision[]>; // keyed by userId

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
    
    // Initialize alignment tracking maps
    this.alignmentScores = new Map();
    this.userDecisions = new Map();
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
      username: insertUser.username ?? insertUser.email ?? "user_" + id.substring(0, 8), // Generate username from email or ID
      password: insertUser.password ?? null,
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
      // Phase 1 Trading fields
      virtualTradingBalance: insertUser.virtualTradingBalance ?? "100000.00",
      dailyTradingLimit: insertUser.dailyTradingLimit ?? "10000.00",
      dailyTradingUsed: insertUser.dailyTradingUsed ?? "0.00",
      maxPositionSize: insertUser.maxPositionSize ?? "5000.00",
      riskTolerance: insertUser.riskTolerance ?? "moderate",
      tradingPermissions: insertUser.tradingPermissions ?? { canTrade: true, canUseMargin: false, canShort: false },
      lastTradingActivity: insertUser.lastTradingActivity ?? null,
      tradingStreakDays: insertUser.tradingStreakDays ?? 0,
      totalTradingProfit: insertUser.totalTradingProfit ?? "0.00",
      // Mythological Houses System
      houseId: insertUser.houseId ?? null,
      houseJoinedAt: insertUser.houseJoinedAt ?? null,
      karma: insertUser.karma ?? 0,
      // Karmic Alignment System
      lawfulChaoticAlignment: insertUser.lawfulChaoticAlignment ?? "0.00",
      goodEvilAlignment: insertUser.goodEvilAlignment ?? "0.00",
      alignmentRevealed: insertUser.alignmentRevealed ?? false,
      alignmentLastUpdated: insertUser.alignmentLastUpdated ?? new Date(),
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
      username: user.username ?? existingUser?.username ?? user.email ?? "user_" + user.id!.substring(0, 8),
      password: user.password ?? existingUser?.password ?? null,
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
      // Phase 1 Trading fields - preserve existing or use defaults
      virtualTradingBalance: existingUser?.virtualTradingBalance ?? "100000.00",
      dailyTradingLimit: existingUser?.dailyTradingLimit ?? "10000.00",
      dailyTradingUsed: existingUser?.dailyTradingUsed ?? "0.00",
      maxPositionSize: existingUser?.maxPositionSize ?? "5000.00",
      riskTolerance: existingUser?.riskTolerance ?? "moderate",
      tradingPermissions: existingUser?.tradingPermissions ?? { canTrade: true, canUseMargin: false, canShort: false },
      lastTradingActivity: existingUser?.lastTradingActivity ?? null,
      tradingStreakDays: existingUser?.tradingStreakDays ?? 0,
      totalTradingProfit: existingUser?.totalTradingProfit ?? "0.00",
      // Mythological Houses System - preserve existing
      houseId: existingUser?.houseId ?? null,
      houseJoinedAt: existingUser?.houseJoinedAt ?? null,
      karma: existingUser?.karma ?? 0,
      // Karmic Alignment System - preserve existing
      lawfulChaoticAlignment: existingUser?.lawfulChaoticAlignment ?? "0.00",
      goodEvilAlignment: existingUser?.goodEvilAlignment ?? "0.00",
      alignmentRevealed: existingUser?.alignmentRevealed ?? false,
      alignmentLastUpdated: existingUser?.alignmentLastUpdated ?? new Date(),
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

  async getAssetById(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetBySymbol(symbol: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(asset => asset.symbol === symbol);
  }

  async getAssets(filters?: { type?: string; search?: string; publisher?: string; limit?: number; offset?: number }): Promise<Asset[]> {
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
    
    // Apply limit with default of 100
    const limit = filters?.limit ?? 100;
    const offset = filters?.offset ?? 0;
    
    return assets.slice(offset, offset + limit);
  }

  async getAssetsByType(type: string, limit: number = 100): Promise<Asset[]> {
    return Array.from(this.assets.values())
      .filter(asset => asset.type === type)
      .slice(0, limit);
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

  // ========================================================================================
  // COMPREHENSIVE LEARNING SYSTEM METHODS - MemStorage Implementation
  // ========================================================================================

  // Storage for learning system entities
  private learningPaths = new Map<string, LearningPath>();
  private sacredLessons = new Map<string, SacredLesson>();
  private mysticalSkills = new Map<string, MysticalSkill>();
  private userLessonProgress = new Map<string, UserLessonProgress>();
  private userSkillUnlocks = new Map<string, UserSkillUnlock>();
  private trialsOfMastery = new Map<string, TrialOfMastery>();
  private userTrialAttempts = new Map<string, UserTrialAttempt>();
  private divineCertifications = new Map<string, DivineCertification>();
  private userCertifications = new Map<string, UserCertification>();
  private learningAnalytics = new Map<string, LearningAnalytics>();

  // Learning Paths Management
  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async getLearningPaths(filters?: { houseId?: string; difficultyLevel?: string; isActive?: boolean }): Promise<LearningPath[]> {
    let paths = Array.from(this.learningPaths.values());
    
    if (filters?.houseId) {
      paths = paths.filter(path => path.houseId === filters.houseId);
    }
    if (filters?.difficultyLevel) {
      paths = paths.filter(path => path.difficultyLevel === filters.difficultyLevel);
    }
    if (filters?.isActive !== undefined) {
      paths = paths.filter(path => path.isActive === filters.isActive);
    }
    
    return paths.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getLearningPathsByHouse(houseId: string): Promise<LearningPath[]> {
    return this.getLearningPaths({ houseId, isActive: true });
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const id = randomUUID();
    const newPath: LearningPath = { 
      ...path, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.learningPaths.set(id, newPath);
    return newPath;
  }

  async updateLearningPath(id: string, path: Partial<InsertLearningPath>): Promise<LearningPath | undefined> {
    const existing = this.learningPaths.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...path, updatedAt: new Date() };
    this.learningPaths.set(id, updated);
    return updated;
  }

  async deleteLearningPath(id: string): Promise<boolean> {
    return this.learningPaths.delete(id);
  }

  // Sacred Lessons Management
  async getSacredLesson(id: string): Promise<SacredLesson | undefined> {
    return this.sacredLessons.get(id);
  }

  async getSacredLessons(filters?: { houseId?: string; pathId?: string; lessonType?: string; difficultyLevel?: string; isActive?: boolean }): Promise<SacredLesson[]> {
    let lessons = Array.from(this.sacredLessons.values());
    
    if (filters?.houseId) {
      lessons = lessons.filter(lesson => lesson.houseId === filters.houseId);
    }
    if (filters?.pathId) {
      lessons = lessons.filter(lesson => lesson.pathId === filters.pathId);
    }
    if (filters?.lessonType) {
      lessons = lessons.filter(lesson => lesson.lessonType === filters.lessonType);
    }
    if (filters?.difficultyLevel) {
      lessons = lessons.filter(lesson => lesson.difficultyLevel === filters.difficultyLevel);
    }
    if (filters?.isActive !== undefined) {
      lessons = lessons.filter(lesson => lesson.isActive === filters.isActive);
    }
    
    return lessons.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getLessonsByPath(pathId: string): Promise<SacredLesson[]> {
    return this.getSacredLessons({ pathId, isActive: true });
  }

  async getLessonsByHouse(houseId: string): Promise<SacredLesson[]> {
    return this.getSacredLessons({ houseId, isActive: true });
  }

  async createSacredLesson(lesson: InsertSacredLesson): Promise<SacredLesson> {
    const id = randomUUID();
    const newLesson: SacredLesson = { 
      ...lesson, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.sacredLessons.set(id, newLesson);
    return newLesson;
  }

  async updateSacredLesson(id: string, lesson: Partial<InsertSacredLesson>): Promise<SacredLesson | undefined> {
    const existing = this.sacredLessons.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...lesson, updatedAt: new Date() };
    this.sacredLessons.set(id, updated);
    return updated;
  }

  async deleteSacredLesson(id: string): Promise<boolean> {
    return this.sacredLessons.delete(id);
  }

  async searchLessons(searchTerm: string, filters?: { houseId?: string; difficultyLevel?: string }): Promise<SacredLesson[]> {
    const allLessons = await this.getSacredLessons(filters);
    const searchLower = searchTerm.toLowerCase();
    
    return allLessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchLower) ||
      lesson.description.toLowerCase().includes(searchLower) ||
      (lesson.mysticalNarrative && lesson.mysticalNarrative.toLowerCase().includes(searchLower))
    );
  }

  // Mystical Skills Management
  async getMysticalSkill(id: string): Promise<MysticalSkill | undefined> {
    return this.mysticalSkills.get(id);
  }

  async getMysticalSkills(filters?: { houseId?: string; skillCategory?: string; tier?: string; rarityLevel?: string; isActive?: boolean }): Promise<MysticalSkill[]> {
    let skills = Array.from(this.mysticalSkills.values());
    
    if (filters?.houseId) {
      skills = skills.filter(skill => skill.houseId === filters.houseId);
    }
    if (filters?.skillCategory) {
      skills = skills.filter(skill => skill.skillCategory === filters.skillCategory);
    }
    if (filters?.tier) {
      skills = skills.filter(skill => skill.tier === filters.tier);
    }
    if (filters?.rarityLevel) {
      skills = skills.filter(skill => skill.rarityLevel === filters.rarityLevel);
    }
    if (filters?.isActive !== undefined) {
      skills = skills.filter(skill => skill.isActive === filters.isActive);
    }
    
    return skills.sort((a, b) => (a.tier || '').localeCompare(b.tier || ''));
  }

  async getSkillsByHouse(houseId: string): Promise<MysticalSkill[]> {
    return this.getMysticalSkills({ houseId, isActive: true });
  }

  async getSkillsByCategory(category: string): Promise<MysticalSkill[]> {
    return this.getMysticalSkills({ skillCategory: category, isActive: true });
  }

  async getSkillTree(houseId?: string): Promise<Array<MysticalSkill & { prerequisites: MysticalSkill[]; unlocks: MysticalSkill[] }>> {
    const skills = houseId ? await this.getSkillsByHouse(houseId) : Array.from(this.mysticalSkills.values());
    
    return skills.map(skill => ({
      ...skill,
      prerequisites: [], // Simplified for in-memory
      unlocks: [] // Simplified for in-memory
    }));
  }

  async createMysticalSkill(skill: InsertMysticalSkill): Promise<MysticalSkill> {
    const id = randomUUID();
    const newSkill: MysticalSkill = { 
      ...skill, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.mysticalSkills.set(id, newSkill);
    return newSkill;
  }

  async updateMysticalSkill(id: string, skill: Partial<InsertMysticalSkill>): Promise<MysticalSkill | undefined> {
    const existing = this.mysticalSkills.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...skill, updatedAt: new Date() };
    this.mysticalSkills.set(id, updated);
    return updated;
  }

  async deleteMysticalSkill(id: string): Promise<boolean> {
    return this.mysticalSkills.delete(id);
  }

  // User Learning Progress Tracking
  async getUserLessonProgress(id: string): Promise<UserLessonProgress | undefined> {
    return this.userLessonProgress.get(id);
  }

  async getUserLessonProgresses(userId: string, filters?: { pathId?: string; status?: string; lessonId?: string }): Promise<UserLessonProgress[]> {
    let progresses = Array.from(this.userLessonProgress.values()).filter(p => p.userId === userId);
    
    if (filters?.pathId) {
      progresses = progresses.filter(p => p.pathId === filters.pathId);
    }
    if (filters?.status) {
      progresses = progresses.filter(p => p.status === filters.status);
    }
    if (filters?.lessonId) {
      progresses = progresses.filter(p => p.lessonId === filters.lessonId);
    }
    
    return progresses.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | undefined> {
    const progresses = await this.getUserLessonProgresses(userId, { lessonId });
    return progresses[0];
  }

  async createUserLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress> {
    const id = randomUUID();
    const newProgress: UserLessonProgress = { 
      ...progress, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.userLessonProgress.set(id, newProgress);
    return newProgress;
  }

  async updateUserLessonProgress(id: string, progress: Partial<InsertUserLessonProgress>): Promise<UserLessonProgress | undefined> {
    const existing = this.userLessonProgress.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...progress, updatedAt: new Date() };
    this.userLessonProgress.set(id, updated);
    return updated;
  }

  async startLesson(userId: string, lessonId: string): Promise<UserLessonProgress> {
    const progressData: InsertUserLessonProgress = {
      userId,
      lessonId,
      pathId: '', // Will be filled by service layer
      status: 'in_progress',
      progressPercent: 0,
      currentSection: 1,
      timeSpent: 0,
      score: null,
      startedAt: new Date(),
      completedAt: null,
      interactionData: {}
    };
    
    return this.createUserLessonProgress(progressData);
  }

  async completeLesson(userId: string, lessonId: string, score: number, timeSpent: number): Promise<UserLessonProgress> {
    const existing = await this.getLessonProgress(userId, lessonId);
    if (!existing) {
      throw new Error('No lesson progress found to complete');
    }
    
    const updated = await this.updateUserLessonProgress(existing.id, {
      status: 'completed',
      progressPercent: 100,
      score,
      timeSpent: existing.timeSpent + timeSpent,
      completedAt: new Date()
    });
    
    return updated!;
  }

  async updateLessonProgress(userId: string, lessonId: string, progressData: { 
    progressPercent: number; 
    currentSection: number; 
    timeSpent: number; 
    interactionData?: any 
  }): Promise<UserLessonProgress> {
    const existing = await this.getLessonProgress(userId, lessonId);
    if (!existing) {
      throw new Error('No lesson progress found to update');
    }
    
    const updated = await this.updateUserLessonProgress(existing.id, {
      progressPercent: progressData.progressPercent,
      currentSection: progressData.currentSection,
      timeSpent: existing.timeSpent + progressData.timeSpent,
      interactionData: { ...existing.interactionData, ...progressData.interactionData }
    });
    
    return updated!;
  }

  // User Skill Unlocks Management
  async getUserSkillUnlock(id: string): Promise<UserSkillUnlock | undefined> {
    return this.userSkillUnlocks.get(id);
  }

  async getUserSkillUnlocks(userId: string, filters?: { skillId?: string; masteryLevel?: number }): Promise<UserSkillUnlock[]> {
    let unlocks = Array.from(this.userSkillUnlocks.values()).filter(u => u.userId === userId);
    
    if (filters?.skillId) {
      unlocks = unlocks.filter(u => u.skillId === filters.skillId);
    }
    if (filters?.masteryLevel !== undefined) {
      unlocks = unlocks.filter(u => u.masteryLevel >= filters.masteryLevel);
    }
    
    return unlocks.sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async getUserSkillById(userId: string, skillId: string): Promise<UserSkillUnlock | undefined> {
    const unlocks = await this.getUserSkillUnlocks(userId, { skillId });
    return unlocks[0];
  }

  async createUserSkillUnlock(unlock: InsertUserSkillUnlock): Promise<UserSkillUnlock> {
    const id = randomUUID();
    const newUnlock: UserSkillUnlock = { 
      ...unlock, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.userSkillUnlocks.set(id, newUnlock);
    return newUnlock;
  }

  async updateUserSkillUnlock(id: string, unlock: Partial<InsertUserSkillUnlock>): Promise<UserSkillUnlock | undefined> {
    const existing = this.userSkillUnlocks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...unlock, updatedAt: new Date() };
    this.userSkillUnlocks.set(id, updated);
    return updated;
  }

  async unlockSkill(userId: string, skillId: string, unlockMethod: string): Promise<UserSkillUnlock> {
    const unlockData: InsertUserSkillUnlock = {
      userId,
      skillId,
      unlockedAt: new Date(),
      masteryLevel: 1,
      experienceSpent: 0,
      unlockMethod,
      bonusMultiplier: 1.0,
      isActive: true
    };
    
    return this.createUserSkillUnlock(unlockData);
  }

  async upgradeSkillMastery(userId: string, skillId: string, experienceSpent: number): Promise<UserSkillUnlock | undefined> {
    const existing = await this.getUserSkillById(userId, skillId);
    if (!existing) return undefined;
    
    return this.updateUserSkillUnlock(existing.id, {
      masteryLevel: existing.masteryLevel + 1,
      experienceSpent: existing.experienceSpent + experienceSpent
    });
  }

  async getUserSkillBonuses(userId: string): Promise<Array<{ skill: MysticalSkill; unlock: UserSkillUnlock; effectiveBonus: number }>> {
    const unlocks = await this.getUserSkillUnlocks(userId);
    const results = [];
    
    for (const unlock of unlocks) {
      const skill = await this.getMysticalSkill(unlock.skillId);
      if (skill) {
        results.push({
          skill,
          unlock,
          effectiveBonus: unlock.bonusMultiplier * unlock.masteryLevel
        });
      }
    }
    
    return results;
  }

  async checkSkillUnlockEligibility(userId: string, skillId: string): Promise<{ eligible: boolean; requirements: any; missing: any }> {
    // Simplified eligibility check for in-memory storage
    return { eligible: true, requirements: {}, missing: {} };
  }

  // Trials of Mastery Management
  async getTrialOfMastery(id: string): Promise<TrialOfMastery | undefined> {
    return this.trialsOfMastery.get(id);
  }

  async getTrialsOfMastery(filters?: { houseId?: string; trialType?: string; difficultyLevel?: string; isActive?: boolean }): Promise<TrialOfMastery[]> {
    let trials = Array.from(this.trialsOfMastery.values());
    
    if (filters?.houseId) {
      trials = trials.filter(trial => trial.houseId === filters.houseId);
    }
    if (filters?.trialType) {
      trials = trials.filter(trial => trial.trialType === filters.trialType);
    }
    if (filters?.difficultyLevel) {
      trials = trials.filter(trial => trial.difficultyLevel === filters.difficultyLevel);
    }
    if (filters?.isActive !== undefined) {
      trials = trials.filter(trial => trial.isActive === filters.isActive);
    }
    
    return trials.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getTrialsByHouse(houseId: string): Promise<TrialOfMastery[]> {
    return this.getTrialsOfMastery({ houseId, isActive: true });
  }

  async createTrialOfMastery(trial: InsertTrialOfMastery): Promise<TrialOfMastery> {
    const id = randomUUID();
    const newTrial: TrialOfMastery = { 
      ...trial, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.trialsOfMastery.set(id, newTrial);
    return newTrial;
  }

  async updateTrialOfMastery(id: string, trial: Partial<InsertTrialOfMastery>): Promise<TrialOfMastery | undefined> {
    const existing = this.trialsOfMastery.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...trial, updatedAt: new Date() };
    this.trialsOfMastery.set(id, updated);
    return updated;
  }

  async deleteTrialOfMastery(id: string): Promise<boolean> {
    return this.trialsOfMastery.delete(id);
  }

  // User Trial Attempts Management
  async getUserTrialAttempt(id: string): Promise<UserTrialAttempt | undefined> {
    return this.userTrialAttempts.get(id);
  }

  async getUserTrialAttempts(userId: string, filters?: { trialId?: string; status?: string; passed?: boolean }): Promise<UserTrialAttempt[]> {
    let attempts = Array.from(this.userTrialAttempts.values()).filter(a => a.userId === userId);
    
    if (filters?.trialId) {
      attempts = attempts.filter(a => a.trialId === filters.trialId);
    }
    if (filters?.status) {
      attempts = attempts.filter(a => a.status === filters.status);
    }
    if (filters?.passed !== undefined) {
      attempts = attempts.filter(a => a.passed === filters.passed);
    }
    
    return attempts.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  async getTrialAttempts(trialId: string, filters?: { status?: string; passed?: boolean }): Promise<UserTrialAttempt[]> {
    let attempts = Array.from(this.userTrialAttempts.values()).filter(a => a.trialId === trialId);
    
    if (filters?.status) {
      attempts = attempts.filter(a => a.status === filters.status);
    }
    if (filters?.passed !== undefined) {
      attempts = attempts.filter(a => a.passed === filters.passed);
    }
    
    return attempts.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  async createUserTrialAttempt(attempt: InsertUserTrialAttempt): Promise<UserTrialAttempt> {
    const id = randomUUID();
    const newAttempt: UserTrialAttempt = { 
      ...attempt, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.userTrialAttempts.set(id, newAttempt);
    return newAttempt;
  }

  async updateUserTrialAttempt(id: string, attempt: Partial<InsertUserTrialAttempt>): Promise<UserTrialAttempt | undefined> {
    const existing = this.userTrialAttempts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...attempt, updatedAt: new Date() };
    this.userTrialAttempts.set(id, updated);
    return updated;
  }

  async startTrial(userId: string, trialId: string): Promise<UserTrialAttempt> {
    const attemptData: InsertUserTrialAttempt = {
      userId,
      trialId,
      attemptNumber: 1, // Should be calculated properly
      status: 'in_progress',
      startedAt: new Date(),
      completedAt: null,
      timeSpent: 0,
      phaseScores: {},
      overallScore: 0,
      passed: false,
      responses: {},
      feedback: null,
      bonusPoints: 0,
      trialContext: {}
    };
    
    return this.createUserTrialAttempt(attemptData);
  }

  async submitTrialResults(userId: string, trialId: string, attemptId: string, results: { 
    phaseScores: any; 
    overallScore: number; 
    timeSpent: number; 
    responses: any 
  }): Promise<UserTrialAttempt> {
    const updated = await this.updateUserTrialAttempt(attemptId, {
      status: 'completed',
      completedAt: new Date(),
      timeSpent: results.timeSpent,
      phaseScores: results.phaseScores,
      overallScore: results.overallScore,
      passed: results.overallScore >= 70, // Default passing score
      responses: results.responses
    });
    
    return updated!;
  }

  async checkTrialEligibility(userId: string, trialId: string): Promise<{ eligible: boolean; requirements: any; missing: any }> {
    // Simplified eligibility check for in-memory storage
    return { eligible: true, requirements: {}, missing: {} };
  }

  // Divine Certifications Management
  async getDivineCertification(id: string): Promise<DivineCertification | undefined> {
    return this.divineCertifications.get(id);
  }

  async getDivineCertifications(filters?: { houseId?: string; certificationLevel?: string; category?: string; rarityLevel?: string; isActive?: boolean }): Promise<DivineCertification[]> {
    let certs = Array.from(this.divineCertifications.values());
    
    if (filters?.houseId) {
      certs = certs.filter(cert => cert.houseId === filters.houseId);
    }
    if (filters?.certificationLevel) {
      certs = certs.filter(cert => cert.certificationLevel === filters.certificationLevel);
    }
    if (filters?.category) {
      certs = certs.filter(cert => cert.category === filters.category);
    }
    if (filters?.rarityLevel) {
      certs = certs.filter(cert => cert.rarityLevel === filters.rarityLevel);
    }
    if (filters?.isActive !== undefined) {
      certs = certs.filter(cert => cert.isActive === filters.isActive);
    }
    
    return certs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getCertificationsByHouse(houseId: string): Promise<DivineCertification[]> {
    return this.getDivineCertifications({ houseId, isActive: true });
  }

  async createDivineCertification(certification: InsertDivineCertification): Promise<DivineCertification> {
    const id = randomUUID();
    const newCert: DivineCertification = { 
      ...certification, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.divineCertifications.set(id, newCert);
    return newCert;
  }

  async updateDivineCertification(id: string, certification: Partial<InsertDivineCertification>): Promise<DivineCertification | undefined> {
    const existing = this.divineCertifications.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...certification, updatedAt: new Date() };
    this.divineCertifications.set(id, updated);
    return updated;
  }

  async deleteDivineCertification(id: string): Promise<boolean> {
    return this.divineCertifications.delete(id);
  }

  // User Certifications Management
  async getUserCertification(id: string): Promise<UserCertification | undefined> {
    return this.userCertifications.get(id);
  }

  async getUserCertifications(userId: string, filters?: { certificationId?: string; status?: string; displayInProfile?: boolean }): Promise<UserCertification[]> {
    let certs = Array.from(this.userCertifications.values()).filter(c => c.userId === userId);
    
    if (filters?.certificationId) {
      certs = certs.filter(c => c.certificationId === filters.certificationId);
    }
    if (filters?.status) {
      certs = certs.filter(c => c.status === filters.status);
    }
    if (filters?.displayInProfile !== undefined) {
      certs = certs.filter(c => c.displayInProfile === filters.displayInProfile);
    }
    
    return certs.sort((a, b) => b.awardedAt.getTime() - a.awardedAt.getTime());
  }

  async getCertificationHolders(certificationId: string): Promise<UserCertification[]> {
    return Array.from(this.userCertifications.values()).filter(c => c.certificationId === certificationId);
  }

  async createUserCertification(certification: InsertUserCertification): Promise<UserCertification> {
    const id = randomUUID();
    const newCert: UserCertification = { 
      ...certification, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.userCertifications.set(id, newCert);
    return newCert;
  }

  async updateUserCertification(id: string, certification: Partial<InsertUserCertification>): Promise<UserCertification | undefined> {
    const existing = this.userCertifications.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...certification, updatedAt: new Date() };
    this.userCertifications.set(id, updated);
    return updated;
  }

  async awardCertification(userId: string, certificationId: string, achievementMethod: string, verificationData?: any): Promise<UserCertification> {
    const certData: InsertUserCertification = {
      userId,
      certificationId,
      awardedAt: new Date(),
      achievementMethod,
      verificationData,
      status: 'active',
      displayInProfile: true,
      metadata: {}
    };
    
    return this.createUserCertification(certData);
  }

  async revokeCertification(userId: string, certificationId: string, reason: string): Promise<boolean> {
    const userCerts = await this.getUserCertifications(userId, { certificationId });
    if (userCerts.length === 0) return false;
    
    const updated = await this.updateUserCertification(userCerts[0].id, {
      status: 'revoked',
      displayInProfile: false,
      metadata: { revokedReason: reason, revokedAt: new Date() }
    });
    
    return !!updated;
  }

  async checkCertificationEligibility(userId: string, certificationId: string): Promise<{ eligible: boolean; requirements: any; missing: any }> {
    // Simplified eligibility check for in-memory storage
    return { eligible: true, requirements: {}, missing: {} };
  }

  // Learning Analytics Management
  async getLearningAnalytics(userId: string): Promise<LearningAnalytics | undefined> {
    return this.learningAnalytics.get(userId);
  }

  async createLearningAnalytics(analytics: InsertLearningAnalytics): Promise<LearningAnalytics> {
    const newAnalytics: LearningAnalytics = { 
      ...analytics, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.learningAnalytics.set(analytics.userId, newAnalytics);
    return newAnalytics;
  }

  async updateLearningAnalytics(userId: string, analytics: Partial<InsertLearningAnalytics>): Promise<LearningAnalytics | undefined> {
    const existing = this.learningAnalytics.get(userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...analytics, updatedAt: new Date() };
    this.learningAnalytics.set(userId, updated);
    return updated;
  }

  async recalculateLearningAnalytics(userId: string): Promise<LearningAnalytics> {
    // Simplified recalculation for in-memory storage
    const progresses = await this.getUserLessonProgresses(userId);
    const unlocks = await this.getUserSkillUnlocks(userId);
    const attempts = await this.getUserTrialAttempts(userId);
    
    const analyticsData: InsertLearningAnalytics = {
      userId,
      totalLessonsStarted: progresses.length,
      totalLessonsCompleted: progresses.filter(p => p.status === 'completed').length,
      totalTimeSpent: progresses.reduce((sum, p) => sum + p.timeSpent, 0),
      averageScore: progresses.length > 0 ? progresses.reduce((sum, p) => sum + (p.score || 0), 0) / progresses.length : 0,
      skillsUnlocked: unlocks.length,
      trialsAttempted: attempts.length,
      trialsPassed: attempts.filter(a => a.passed).length,
      currentStreak: 0, // Simplified
      longestStreak: 0, // Simplified
      lastActiveDate: new Date(),
      performanceTrends: {},
      strengths: [],
      weaknesses: [],
      recommendedFocus: [],
      engagementScore: 50 // Default
    };
    
    const existing = await this.getLearningAnalytics(userId);
    if (existing) {
      return this.updateLearningAnalytics(userId, analyticsData)!;
    } else {
      return this.createLearningAnalytics(analyticsData);
    }
  }

  async generateLearningRecommendations(userId: string): Promise<{ 
    recommendedPaths: LearningPath[]; 
    suggestedLessons: SacredLesson[]; 
    skillsToUnlock: MysticalSkill[]; 
    interventions: any[] 
  }> {
    // Simplified recommendations for in-memory storage
    const allPaths = await this.getLearningPaths({ isActive: true });
    const allLessons = await this.getSacredLessons({ isActive: true });
    const allSkills = await this.getMysticalSkills({ isActive: true });
    
    return {
      recommendedPaths: allPaths.slice(0, 3),
      suggestedLessons: allLessons.slice(0, 5),
      skillsToUnlock: allSkills.slice(0, 3),
      interventions: []
    };
  }

  // Learning System Analytics and Insights
  async getHouseLearningStats(houseId: string): Promise<{
    totalPaths: number;
    totalLessons: number;
    totalSkills: number;
    averageProgress: number;
    topPerformers: Array<User & { progress: number }>;
    engagement: number;
  }> {
    const paths = await this.getLearningPathsByHouse(houseId);
    const lessons = await this.getLessonsByHouse(houseId);
    const skills = await this.getSkillsByHouse(houseId);
    
    return {
      totalPaths: paths.length,
      totalLessons: lessons.length,
      totalSkills: skills.length,
      averageProgress: 50, // Simplified
      topPerformers: [], // Simplified
      engagement: 75 // Simplified
    };
  }

  async getGlobalLearningStats(): Promise<{
    totalLearners: number;
    totalLessonsCompleted: number;
    totalSkillsUnlocked: number;
    averageTimeToComplete: number;
    houseComparisons: Array<{ houseId: string; avgProgress: number; engagement: number }>;
  }> {
    const totalProgresses = Array.from(this.userLessonProgress.values());
    const totalUnlocks = Array.from(this.userSkillUnlocks.values());
    
    return {
      totalLearners: new Set(totalProgresses.map(p => p.userId)).size,
      totalLessonsCompleted: totalProgresses.filter(p => p.status === 'completed').length,
      totalSkillsUnlocked: totalUnlocks.length,
      averageTimeToComplete: 3600, // 1 hour simplified
      houseComparisons: [] // Simplified
    };
  }

  async getUserLearningDashboard(userId: string): Promise<{
    analytics: LearningAnalytics;
    currentPaths: LearningPath[];
    recentProgress: UserLessonProgress[];
    unlockedSkills: Array<UserSkillUnlock & { skill: MysticalSkill }>;
    certifications: Array<UserCertification & { certification: DivineCertification }>;
    recommendations: { paths: LearningPath[]; lessons: SacredLesson[]; skills: MysticalSkill[] };
    achievements: any[];
  }> {
    let analytics = await this.getLearningAnalytics(userId);
    if (!analytics) {
      analytics = await this.recalculateLearningAnalytics(userId);
    }
    
    const recentProgress = await this.getUserLessonProgresses(userId);
    const skillUnlocks = await this.getUserSkillUnlocks(userId);
    const userCerts = await this.getUserCertifications(userId);
    const recommendations = await this.generateLearningRecommendations(userId);
    
    // Populate related data
    const unlockedSkills = [];
    for (const unlock of skillUnlocks) {
      const skill = await this.getMysticalSkill(unlock.skillId);
      if (skill) {
        unlockedSkills.push({ ...unlock, skill });
      }
    }
    
    const certifications = [];
    for (const userCert of userCerts) {
      const cert = await this.getDivineCertification(userCert.certificationId);
      if (cert) {
        certifications.push({ ...userCert, certification: cert });
      }
    }
    
    return {
      analytics,
      currentPaths: [], // Simplified
      recentProgress: recentProgress.slice(0, 10),
      unlockedSkills,
      certifications,
      recommendations,
      achievements: [] // Simplified
    };
  }

  // Advanced Learning Features
  async generatePersonalizedLearningPath(userId: string, preferences: { 
    preferredHouses: string[]; 
    difficultyPreference: string; 
    timeCommitment: number; 
    learningGoals: string[] 
  }): Promise<LearningPath> {
    // Simplified personalized path generation
    const pathData: InsertLearningPath = {
      name: `Personalized Path for ${userId}`,
      description: 'A customized learning journey based on your preferences',
      houseId: preferences.preferredHouses[0] || 'heroes',
      specialization: 'trading',
      difficultyLevel: preferences.difficultyPreference,
      prerequisites: [],
      estimatedHours: preferences.timeCommitment,
      experienceReward: 1000,
      karmaReward: 100,
      sacredTitle: 'Personalized Seeker',
      mysticalDescription: 'Your unique path to mastery',
      pathIcon: 'star',
      pathColor: '#gold',
      lessonSequence: [],
      unlockConditions: {},
      completionRewards: {},
      isActive: true,
      displayOrder: 0
    };
    
    return this.createLearningPath(pathData);
  }

  async detectLearningPatterns(userId: string): Promise<{
    learningStyle: string;
    optimalSessionLength: number;
    preferredContentTypes: string[];
    strugglingAreas: string[];
    strengthAreas: string[];
  }> {
    // Simplified pattern detection
    return {
      learningStyle: 'visual',
      optimalSessionLength: 30,
      preferredContentTypes: ['video', 'interactive'],
      strugglingAreas: [],
      strengthAreas: []
    };
  }
  
  // Hidden Alignment Tracking Methods
  async getUserAlignmentScore(userId: string): Promise<AlignmentScore | undefined> {
    return this.alignmentScores.get(userId);
  }
  
  async createAlignmentScore(score: InsertAlignmentScore): Promise<AlignmentScore> {
    const id = randomUUID();
    const alignmentScore: AlignmentScore = {
      id,
      userId: score.userId,
      ruthlessnessScore: score.ruthlessnessScore ?? "0.00",
      individualismScore: score.individualismScore ?? "0.00",
      lawfulnessScore: score.lawfulnessScore ?? "0.00",
      greedScore: score.greedScore ?? "0.00",
      ruthlessnessConfidence: score.ruthlessnessConfidence ?? "1.00",
      individualismConfidence: score.individualismConfidence ?? "1.00",
      lawfulnessConfidence: score.lawfulnessConfidence ?? "1.00",
      greedConfidence: score.greedConfidence ?? "1.00",
      assignedHouseId: score.assignedHouseId ?? null,
      assignmentScore: score.assignmentScore ?? null,
      secondaryHouseId: score.secondaryHouseId ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.alignmentScores.set(score.userId, alignmentScore);
    return alignmentScore;
  }
  
  async updateAlignmentScore(userId: string, adjustments: {
    ruthlessnessDelta?: number;
    individualismDelta?: number;
    lawfulnessDelta?: number;
    greedDelta?: number;
  }): Promise<AlignmentScore | undefined> {
    const existing = this.alignmentScores.get(userId);
    if (!existing) {
      // Create new alignment score if none exists
      const newScore = await this.createAlignmentScore({ userId });
      return this.updateAlignmentScore(userId, adjustments);
    }
    
    // Apply adjustments with soft caps at -100 to +100
    const clamp = (value: number) => Math.max(-100, Math.min(100, value));
    
    existing.ruthlessnessScore = String(clamp(
      parseFloat(existing.ruthlessnessScore) + (adjustments.ruthlessnessDelta ?? 0)
    ));
    existing.individualismScore = String(clamp(
      parseFloat(existing.individualismScore) + (adjustments.individualismDelta ?? 0)
    ));
    existing.lawfulnessScore = String(clamp(
      parseFloat(existing.lawfulnessScore) + (adjustments.lawfulnessDelta ?? 0)
    ));
    existing.greedScore = String(clamp(
      parseFloat(existing.greedScore) + (adjustments.greedDelta ?? 0)
    ));
    
    existing.updatedAt = new Date();
    return existing;
  }
  
  async recordUserDecision(decision: InsertUserDecision): Promise<UserDecision> {
    const id = randomUUID();
    const userDecision: UserDecision = {
      id,
      userId: decision.userId,
      decisionType: decision.decisionType,
      scenarioId: decision.scenarioId ?? null,
      choiceId: decision.choiceId ?? null,
      ruthlessnessImpact: decision.ruthlessnessImpact ?? "0.00",
      individualismImpact: decision.individualismImpact ?? "0.00",
      lawfulnessImpact: decision.lawfulnessImpact ?? "0.00",
      greedImpact: decision.greedImpact ?? "0.00",
      displayedScore: decision.displayedScore ?? null,
      displayedFeedback: decision.displayedFeedback ?? null,
      responseTime: decision.responseTime ?? null,
      contextData: decision.contextData ?? null,
      createdAt: new Date()
    };
    
    const userDecisions = this.userDecisions.get(decision.userId) || [];
    userDecisions.push(userDecision);
    this.userDecisions.set(decision.userId, userDecisions);
    
    return userDecision;
  }
  
  async getUserDecisions(userId: string, filters?: {
    decisionType?: string;
    scenarioId?: string;
    limit?: number;
  }): Promise<UserDecision[]> {
    let decisions = this.userDecisions.get(userId) || [];
    
    if (filters?.decisionType) {
      decisions = decisions.filter(d => d.decisionType === filters.decisionType);
    }
    
    if (filters?.scenarioId) {
      decisions = decisions.filter(d => d.scenarioId === filters.scenarioId);
    }
    
    if (filters?.limit && filters.limit > 0) {
      decisions = decisions.slice(0, filters.limit);
    }
    
    return decisions;
  }
  
  async calculateHouseAssignment(userId: string): Promise<{
    primaryHouse: string;
    secondaryHouse?: string;
    alignmentProfile: {
      ruthlessness: number;
      individualism: number;
      lawfulness: number;
      greed: number;
    };
    confidence: number;
  }> {
    const alignmentScore = await this.getUserAlignmentScore(userId);
    
    if (!alignmentScore) {
      // Default neutral alignment
      return {
        primaryHouse: 'equilibrium_trust',
        secondaryHouse: 'catalyst_syndicate',
        alignmentProfile: {
          ruthlessness: 0,
          individualism: 0,
          lawfulness: 0,
          greed: 0
        },
        confidence: 0.5
      };
    }
    
    const profile = {
      ruthlessness: parseFloat(alignmentScore.ruthlessnessScore),
      individualism: parseFloat(alignmentScore.individualismScore),
      lawfulness: parseFloat(alignmentScore.lawfulnessScore),
      greed: parseFloat(alignmentScore.greedScore)
    };
    
    // Import the calculation function
    const { calculateHouseAssignment } = await import('@shared/entryTestScenarios');
    const assignment = calculateHouseAssignment(profile);
    
    // Calculate confidence based on how consistent their choices were
    const avgConfidence = (
      parseFloat(alignmentScore.ruthlessnessConfidence) +
      parseFloat(alignmentScore.individualismConfidence) +
      parseFloat(alignmentScore.lawfulnessConfidence) +
      parseFloat(alignmentScore.greedConfidence)
    ) / 4;
    
    return {
      primaryHouse: assignment.primaryHouse,
      secondaryHouse: assignment.secondaryHouse,
      alignmentProfile: profile,
      confidence: avgConfidence
    };
  }

  async predictLearningOutcomes(userId: string, pathId: string): Promise<{
    estimatedCompletionTime: number;
    successProbability: number;
    recommendedPrerequisites: LearningPath[];
    riskFactors: string[];
  }> {
    // Simplified outcome prediction
    return {
      estimatedCompletionTime: 7200, // 2 hours
      successProbability: 0.8,
      recommendedPrerequisites: [],
      riskFactors: []
    };
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
