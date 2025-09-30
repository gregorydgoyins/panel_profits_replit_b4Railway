import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, desc, ilike, sql, inArray } from 'drizzle-orm';
import {
  assets, marketData, portfolios, holdings, marketInsights, marketIndices,
  marketIndexData, watchlists, watchlistAssets, orders, marketEvents,
  beatTheAIChallenge, beatTheAIPrediction, beatTheAILeaderboard,
  comicGradingPredictions, users, comicSeries, comicIssues, comicCreators, featuredComics,
  // Phase 1 Trading Extensions
  tradingSessions, assetCurrentPrices, tradingLimits,
  // Phase 1 Core Trading Foundations
  trades, positions, balances,
  // Leaderboard System Tables
  traderStats, leaderboardCategories, userAchievements,
  // Enhanced Data Tables
  enhancedCharacters, battleScenarios, enhancedComicIssues, moviePerformanceData,
  // Learning System Tables
  learningPaths, sacredLessons, mysticalSkills, userLessonProgress, userSkillUnlocks,
  trialsOfMastery, userTrialAttempts, divineCertifications, userCertifications, learningAnalytics,
  // Phase 8: External Integration Tables
  externalIntegrations, integrationWebhooks, integrationSyncLogs, workflowAutomations,
  workflowExecutions, integrationAnalytics, externalUserMappings,
  // Phase 1: Core Trading Foundation Tables
  imfVaultSettings, tradingFirms, assetFinancialMapping, globalMarketHours,
  optionsChain, marginAccounts, shortPositions, npcTraders, informationTiers, newsArticles,
  // Phase 3: Art-Driven Progression System Tables
  comicIssueVariants, userComicCollection, userProgressionStatus, houseProgressionPaths,
  userHouseProgression, tradingToolUnlocks, comicCollectionAchievements,
  collectionChallenges, userChallengeParticipation,
  // Moral Consequence System Tables
  moralStandings, tradingVictims,
  // Entry Test Alignment System Tables
  alignmentScores, userDecisions,
  // Knowledge Test Tables
  knowledgeTestResults, knowledgeTestResponses
} from '@shared/schema.js';
import type {
  User, InsertUser, UpsertUser, Asset, InsertAsset, MarketData, InsertMarketData,
  Portfolio, InsertPortfolio, Holding, InsertHolding, MarketInsight, InsertMarketInsight,
  MarketIndex, InsertMarketIndex, MarketIndexData, InsertMarketIndexData,
  Watchlist, InsertWatchlist, WatchlistAsset, InsertWatchlistAsset,
  Order, InsertOrder, MarketEvent, InsertMarketEvent,
  BeatTheAIChallenge, InsertBeatTheAIChallenge, BeatTheAIPrediction, InsertBeatTheAIPrediction,
  BeatTheAILeaderboard, InsertBeatTheAILeaderboard, ComicGradingPrediction, InsertComicGradingPrediction,
  ComicSeries, InsertComicSeries, ComicIssue, InsertComicIssue, ComicCreator, InsertComicCreator,
  FeaturedComic, InsertFeaturedComic,
  // Phase 1 Trading Extensions
  TradingSession, InsertTradingSession, AssetCurrentPrice, InsertAssetCurrentPrice,
  TradingLimit, InsertTradingLimit,
  // Phase 1 Core Trading Foundations
  Trade, InsertTrade, Position, InsertPosition, Balance, InsertBalance,
  // Leaderboard System Types
  TraderStats, InsertTraderStats, LeaderboardCategory, InsertLeaderboardCategory,
  UserAchievement, InsertUserAchievement,
  // Enhanced Data Types
  EnhancedCharacter, InsertEnhancedCharacter, BattleScenario, InsertBattleScenario,
  EnhancedComicIssue, InsertEnhancedComicIssue, MoviePerformanceData, InsertMoviePerformanceData,
  // Learning System Types
  LearningPath, InsertLearningPath, SacredLesson, InsertSacredLesson, MysticalSkill, InsertMysticalSkill,
  UserLessonProgress, InsertUserLessonProgress, UserSkillUnlock, InsertUserSkillUnlock,
  TrialOfMastery, InsertTrialOfMastery, UserTrialAttempt, InsertUserTrialAttempt,
  DivineCertification, InsertDivineCertification, UserCertification, InsertUserCertification,
  LearningAnalytics, InsertLearningAnalytics,
  // Phase 8: External Integration Types
  ExternalIntegration, InsertExternalIntegration, IntegrationWebhook, InsertIntegrationWebhook,
  IntegrationSyncLog, InsertIntegrationSyncLog, WorkflowAutomation, InsertWorkflowAutomation,
  WorkflowExecution, InsertWorkflowExecution, IntegrationAnalytics, InsertIntegrationAnalytics,
  ExternalUserMapping, InsertExternalUserMapping,
  // Phase 1: Core Trading Foundation Types
  ImfVaultSettings, InsertImfVaultSettings, TradingFirm, InsertTradingFirm,
  AssetFinancialMapping, InsertAssetFinancialMapping, GlobalMarketHours, InsertGlobalMarketHours,
  OptionsChain, InsertOptionsChain, MarginAccount, InsertMarginAccount,
  ShortPosition, InsertShortPosition, NpcTrader, InsertNpcTrader,
  InformationTier, InsertInformationTier, NewsArticle, InsertNewsArticle,
  // Phase 3: Art-Driven Progression System Types
  ComicIssueVariant, InsertComicIssueVariant, UserComicCollection, InsertUserComicCollection,
  UserProgressionStatus, InsertUserProgressionStatus, HouseProgressionPath, InsertHouseProgressionPath,
  UserHouseProgression, InsertUserHouseProgression, TradingToolUnlock, InsertTradingToolUnlock,
  ComicCollectionAchievement, InsertComicCollectionAchievement, CollectionChallenge, InsertCollectionChallenge,
  UserChallengeParticipation, InsertUserChallengeParticipation,
  // Moral Consequence System Types
  MoralStanding, InsertMoralStanding, TradingVictim, InsertTradingVictim,
  // Entry Test Alignment System Types
  AlignmentScore, InsertAlignmentScore, UserDecision, InsertUserDecision
} from '@shared/schema.js';
import type { IStorage } from './storage.js';

// Initialize database connection
const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

/**
 * Database Storage Implementation using Drizzle ORM and PostgreSQL
 * Provides persistent storage with vector embedding support
 */
export class DatabaseStorage implements IStorage {
  
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Note: This method is kept for backward compatibility but email should be used instead
    const result = await db.select().from(users).where(eq(users.email, username)).limit(1);
    return result[0];
  }

  // (IMPORTANT) this user operation is mandatory for Replit Auth.
  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // First try to find existing user by id
      if (userData.id) {
        const existingUser = await db.select().from(users).where(eq(users.id, userData.id)).limit(1);
        if (existingUser[0]) {
          // Update existing user
          const [updated] = await db
            .update(users)
            .set({
              ...userData,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userData.id))
            .returning();
          return updated;
        }
      }

      // Check if username already exists
      const existingByUsername = await db.select().from(users).where(eq(users.username, userData.username)).limit(1);
      if (existingByUsername[0]) {
        // Update existing user by username
        const [updated] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.username, userData.username))
          .returning();
        return updated;
      }

      // Create new user if neither id nor username exists
      const [newUser] = await db.insert(users).values(userData).returning();
      return newUser;
    } catch (error: any) {
      // Handle duplicate key constraint violation
      if (error?.code === '23505') {
        // Duplicate key error - try to find and update the existing user
        if (error.constraint === 'users_username_unique') {
          // Username conflict - update by username
          const [updated] = await db
            .update(users)
            .set({
              ...userData,
              updatedAt: new Date(),
            })
            .where(eq(users.username, userData.username))
            .returning();
          return updated;
        } else if (error.constraint === 'users_email_unique' && userData.email) {
          // Email conflict - update by email
          const [updated] = await db
            .update(users)
            .set({
              ...userData,
              updatedAt: new Date(),
            })
            .where(eq(users.email, userData.email))
            .returning();
          return updated;
        }
      }
      
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Asset management
  async getAsset(id: string): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.id, id)).limit(1);
    return result[0];
  }

  async getAssetBySymbol(symbol: string): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.symbol, symbol)).limit(1);
    return result[0];
  }

  async getAssets(filters?: { type?: string; search?: string; publisher?: string }): Promise<Asset[]> {
    let query = db.select().from(assets);
    
    const conditions = [];
    
    if (filters?.type) {
      conditions.push(eq(assets.type, filters.type));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`(
          ${assets.name} ILIKE ${`%${filters.search}%`} OR 
          ${assets.symbol} ILIKE ${`%${filters.search}%`} OR 
          ${assets.description} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    
    if (filters?.publisher) {
      conditions.push(sql`${assets.metadata}->>'publisher' = ${filters.publisher}`);
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(assets.createdAt));
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const result = await db.insert(assets).values(asset).returning();
    return result[0];
  }

  async updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined> {
    const result = await db.update(assets).set(asset).where(eq(assets.id, id)).returning();
    return result[0];
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return result.rowCount > 0;
  }

  // Market data
  async getLatestMarketData(assetId: string, timeframe?: string): Promise<MarketData | undefined> {
    let query = db.select().from(marketData).where(eq(marketData.assetId, assetId));
    
    if (timeframe) {
      query = query.where(and(eq(marketData.assetId, assetId), eq(marketData.timeframe, timeframe)));
    }
    
    const result = await query.orderBy(desc(marketData.periodStart)).limit(1);
    return result[0];
  }

  async getMarketDataHistory(assetId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketData[]> {
    let query = db.select().from(marketData)
      .where(and(eq(marketData.assetId, assetId), eq(marketData.timeframe, timeframe)));
    
    if (from && to) {
      query = query.where(and(
        eq(marketData.assetId, assetId),
        eq(marketData.timeframe, timeframe),
        sql`${marketData.periodStart} BETWEEN ${from} AND ${to}`
      ));
    }
    
    query = query.orderBy(desc(marketData.periodStart));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const result = await db.insert(marketData).values(data).returning();
    return result[0];
  }

  async getBulkLatestMarketData(assetIds: string[], timeframe?: string): Promise<MarketData[]> {
    let query = db.select().from(marketData).where(inArray(marketData.assetId, assetIds));
    
    if (timeframe) {
      query = query.where(and(inArray(marketData.assetId, assetIds), eq(marketData.timeframe, timeframe)));
    }
    
    return await query.orderBy(desc(marketData.periodStart));
  }

  async createBulkMarketData(marketDataList: InsertMarketData[]): Promise<MarketData[]> {
    if (marketDataList.length === 0) return [];
    
    const result = await db.insert(marketData).values(marketDataList).returning();
    return result;
  }

  // Portfolio management
  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    const result = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
    return result[0];
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return await db.select().from(portfolios).where(eq(portfolios.userId, userId)).orderBy(desc(portfolios.createdAt));
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const result = await db.insert(portfolios).values(portfolio).returning();
    return result[0];
  }

  async updatePortfolio(id: string, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const result = await db.update(portfolios).set(portfolio).where(eq(portfolios.id, id)).returning();
    return result[0];
  }

  async deletePortfolio(id: string): Promise<boolean> {
    const result = await db.delete(portfolios).where(eq(portfolios.id, id));
    return result.rowCount > 0;
  }

  // Holdings
  async getPortfolioHoldings(portfolioId: string): Promise<Holding[]> {
    return await db.select().from(holdings).where(eq(holdings.portfolioId, portfolioId));
  }

  async getHolding(portfolioId: string, assetId: string): Promise<Holding | undefined> {
    const result = await db.select().from(holdings)
      .where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.assetId, assetId)))
      .limit(1);
    return result[0];
  }

  async createHolding(holding: InsertHolding): Promise<Holding> {
    const result = await db.insert(holdings).values(holding).returning();
    return result[0];
  }

  async updateHolding(id: string, holding: Partial<InsertHolding>): Promise<Holding | undefined> {
    const result = await db.update(holdings).set(holding).where(eq(holdings.id, id)).returning();
    return result[0];
  }

  async deleteHolding(id: string): Promise<boolean> {
    const result = await db.delete(holdings).where(eq(holdings.id, id));
    return result.rowCount > 0;
  }

  // Market insights
  async getMarketInsights(filters?: { assetId?: string; category?: string; isActive?: boolean }): Promise<MarketInsight[]> {
    let query = db.select().from(marketInsights);
    
    const conditions = [];
    
    if (filters?.assetId) {
      conditions.push(eq(marketInsights.assetId, filters.assetId));
    }
    
    if (filters?.category) {
      conditions.push(eq(marketInsights.category, filters.category));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(marketInsights.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(marketInsights.createdAt));
  }

  async createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight> {
    const result = await db.insert(marketInsights).values(insight).returning();
    return result[0];
  }

  async updateMarketInsight(id: string, insight: Partial<InsertMarketInsight>): Promise<MarketInsight | undefined> {
    const result = await db.update(marketInsights).set(insight).where(eq(marketInsights.id, id)).returning();
    return result[0];
  }

  // Market indices
  async getMarketIndex(symbol: string): Promise<MarketIndex | undefined> {
    const result = await db.select().from(marketIndices).where(eq(marketIndices.symbol, symbol)).limit(1);
    return result[0];
  }

  async getMarketIndices(): Promise<MarketIndex[]> {
    return await db.select().from(marketIndices).orderBy(desc(marketIndices.createdAt));
  }

  async createMarketIndex(index: InsertMarketIndex): Promise<MarketIndex> {
    const result = await db.insert(marketIndices).values(index).returning();
    return result[0];
  }

  async updateMarketIndex(id: string, index: Partial<InsertMarketIndex>): Promise<MarketIndex | undefined> {
    const result = await db.update(marketIndices).set(index).where(eq(marketIndices.id, id)).returning();
    return result[0];
  }

  // Market index data
  async getLatestMarketIndexData(indexId: string, timeframe?: string): Promise<MarketIndexData | undefined> {
    let query = db.select().from(marketIndexData).where(eq(marketIndexData.indexId, indexId));
    
    if (timeframe) {
      query = query.where(and(eq(marketIndexData.indexId, indexId), eq(marketIndexData.timeframe, timeframe)));
    }
    
    const result = await query.orderBy(desc(marketIndexData.periodStart)).limit(1);
    return result[0];
  }

  async getMarketIndexDataHistory(indexId: string, timeframe: string, limit?: number, from?: Date, to?: Date): Promise<MarketIndexData[]> {
    let query = db.select().from(marketIndexData)
      .where(and(eq(marketIndexData.indexId, indexId), eq(marketIndexData.timeframe, timeframe)));
    
    if (from && to) {
      query = query.where(and(
        eq(marketIndexData.indexId, indexId),
        eq(marketIndexData.timeframe, timeframe),
        sql`${marketIndexData.periodStart} BETWEEN ${from} AND ${to}`
      ));
    }
    
    query = query.orderBy(desc(marketIndexData.periodStart));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async createMarketIndexData(indexData: InsertMarketIndexData): Promise<MarketIndexData> {
    const result = await db.insert(marketIndexData).values(indexData).returning();
    return result[0];
  }

  // Watchlists
  async getUserWatchlists(userId: string): Promise<Watchlist[]> {
    return await db.select().from(watchlists).where(eq(watchlists.userId, userId)).orderBy(desc(watchlists.createdAt));
  }

  async getWatchlistAssets(watchlistId: string): Promise<WatchlistAsset[]> {
    return await db.select().from(watchlistAssets).where(eq(watchlistAssets.watchlistId, watchlistId));
  }

  async createWatchlist(watchlist: InsertWatchlist): Promise<Watchlist> {
    const result = await db.insert(watchlists).values(watchlist).returning();
    return result[0];
  }

  async addAssetToWatchlist(watchlistAsset: InsertWatchlistAsset): Promise<WatchlistAsset> {
    const result = await db.insert(watchlistAssets).values(watchlistAsset).returning();
    return result[0];
  }

  async removeAssetFromWatchlist(watchlistId: string, assetId: string): Promise<boolean> {
    const result = await db.delete(watchlistAssets)
      .where(and(eq(watchlistAssets.watchlistId, watchlistId), eq(watchlistAssets.assetId, assetId)));
    return result.rowCount > 0;
  }

  async deleteWatchlist(id: string): Promise<boolean> {
    const result = await db.delete(watchlists).where(eq(watchlists.id, id));
    return result.rowCount > 0;
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    let query = db.select().from(orders).where(eq(orders.userId, userId));
    
    if (status) {
      query = query.where(and(eq(orders.userId, userId), eq(orders.status, status)));
    }
    
    return await query.orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount > 0;
  }

  async cancelOrder(id: string): Promise<Order | undefined> {
    const result = await db.update(orders)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  // Market events
  async getMarketEvents(filters?: { isActive?: boolean; category?: string }): Promise<MarketEvent[]> {
    let query = db.select().from(marketEvents);
    
    const conditions = [];
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(marketEvents.isActive, filters.isActive));
    }
    
    if (filters?.category) {
      conditions.push(eq(marketEvents.category, filters.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(marketEvents.createdAt));
  }

  async createMarketEvent(event: InsertMarketEvent): Promise<MarketEvent> {
    const result = await db.insert(marketEvents).values(event).returning();
    return result[0];
  }

  async updateMarketEvent(id: string, event: Partial<InsertMarketEvent>): Promise<MarketEvent | undefined> {
    const result = await db.update(marketEvents).set(event).where(eq(marketEvents.id, id)).returning();
    return result[0];
  }

  // Beat the AI - Implementation stubs (simplified for this task)
  async getBeatTheAIChallenge(id: string): Promise<BeatTheAIChallenge | undefined> {
    const result = await db.select().from(beatTheAIChallenge).where(eq(beatTheAIChallenge.id, id)).limit(1);
    return result[0];
  }

  async getBeatTheAIChallenges(filters?: { status?: string }): Promise<BeatTheAIChallenge[]> {
    return await db.select().from(beatTheAIChallenge);
  }

  async createBeatTheAIChallenge(challenge: InsertBeatTheAIChallenge): Promise<BeatTheAIChallenge> {
    const result = await db.insert(beatTheAIChallenge).values(challenge).returning();
    return result[0];
  }

  async updateBeatTheAIChallenge(id: string, challenge: Partial<InsertBeatTheAIChallenge>): Promise<BeatTheAIChallenge | undefined> {
    const result = await db.update(beatTheAIChallenge).set(challenge).where(eq(beatTheAIChallenge.id, id)).returning();
    return result[0];
  }

  async getBeatTheAIPrediction(id: string): Promise<BeatTheAIPrediction | undefined> {
    const result = await db.select().from(beatTheAIPrediction).where(eq(beatTheAIPrediction.id, id)).limit(1);
    return result[0];
  }

  async getBeatTheAIPredictions(filters?: { challengeId?: string; userId?: string }): Promise<BeatTheAIPrediction[]> {
    return await db.select().from(beatTheAIPrediction);
  }

  async createBeatTheAIPrediction(prediction: InsertBeatTheAIPrediction): Promise<BeatTheAIPrediction> {
    const result = await db.insert(beatTheAIPrediction).values(prediction).returning();
    return result[0];
  }

  async updateBeatTheAIPrediction(id: string, prediction: Partial<BeatTheAIPrediction>): Promise<BeatTheAIPrediction | undefined> {
    const result = await db.update(beatTheAIPrediction).set(prediction).where(eq(beatTheAIPrediction.id, id)).returning();
    return result[0];
  }

  async getBeatTheAILeaderboard(limit?: number): Promise<BeatTheAILeaderboard[]> {
    return await db.select().from(beatTheAILeaderboard);
  }

  async getBeatTheAILeaderboardEntry(userId: string): Promise<BeatTheAILeaderboard | undefined> {
    const result = await db.select().from(beatTheAILeaderboard).where(eq(beatTheAILeaderboard.userId, userId)).limit(1);
    return result[0];
  }

  async createBeatTheAILeaderboardEntry(entry: InsertBeatTheAILeaderboard): Promise<BeatTheAILeaderboard> {
    const result = await db.insert(beatTheAILeaderboard).values(entry).returning();
    return result[0];
  }

  async updateBeatTheAILeaderboardEntry(userId: string, entry: Partial<BeatTheAILeaderboard>): Promise<BeatTheAILeaderboard | undefined> {
    const result = await db.update(beatTheAILeaderboard).set(entry).where(eq(beatTheAILeaderboard.userId, userId)).returning();
    return result[0];
  }

  async recalculateLeaderboard(): Promise<void> {
    // Implementation stub
  }

  async getComicGradingPrediction(id: string): Promise<ComicGradingPrediction | undefined> {
    const result = await db.select().from(comicGradingPredictions).where(eq(comicGradingPredictions.id, id)).limit(1);
    return result[0];
  }

  async getComicGradingPredictions(filters?: { userId?: string; status?: string }): Promise<ComicGradingPrediction[]> {
    return await db.select().from(comicGradingPredictions);
  }

  async createComicGradingPrediction(prediction: InsertComicGradingPrediction): Promise<ComicGradingPrediction> {
    const result = await db.insert(comicGradingPredictions).values(prediction).returning();
    return result[0];
  }

  async updateComicGradingPrediction(id: string, prediction: Partial<InsertComicGradingPrediction>): Promise<ComicGradingPrediction | undefined> {
    const result = await db.update(comicGradingPredictions).set(prediction).where(eq(comicGradingPredictions.id, id)).returning();
    return result[0];
  }

  // Vector similarity search operations (simplified implementations for this task)
  async findSimilarAssets(assetId: string, limit: number = 10, threshold: number = 0.7): Promise<Array<Asset & { similarityScore: number }>> {
    // Vector similarity search using pgvector
    const result = await db.execute(sql`
      WITH target AS (
        SELECT metadata_embedding FROM ${assets} WHERE id = ${assetId}
      )
      SELECT *, 
             (1 - (metadata_embedding <=> target.metadata_embedding)) as similarity_score
      FROM ${assets}, target
      WHERE metadata_embedding IS NOT NULL
        AND id != ${assetId}
        AND (1 - (metadata_embedding <=> target.metadata_embedding)) > ${threshold}
      ORDER BY metadata_embedding <=> target.metadata_embedding
      LIMIT ${limit}
    `);
    
    return result.rows as Array<Asset & { similarityScore: number }>;
  }

  async findSimilarAssetsByEmbedding(embedding: number[], limit: number = 10, threshold: number = 0.7): Promise<Array<Asset & { similarityScore: number }>> {
    const vectorString = `[${embedding.join(',')}]`;
    
    const result = await db.execute(sql`
      SELECT *, 
             (1 - (metadata_embedding <=> ${vectorString}::vector)) as similarity_score
      FROM ${assets}
      WHERE metadata_embedding IS NOT NULL
        AND (1 - (metadata_embedding <=> ${vectorString}::vector)) > ${threshold}
      ORDER BY metadata_embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `);
    
    return result.rows as Array<Asset & { similarityScore: number }>;
  }

  async updateAssetEmbedding(assetId: string, embedding: number[]): Promise<boolean> {
    const vectorString = `[${embedding.join(',')}]`;
    const result = await db.update(assets)
      .set({ metadataEmbedding: sql`${vectorString}::vector` })
      .where(eq(assets.id, assetId));
    return result.rowCount > 0;
  }

  async getAssetsWithoutEmbeddings(limit: number = 50): Promise<Asset[]> {
    return await db.select().from(assets)
      .where(sql`metadata_embedding IS NULL`)
      .limit(limit);
  }

  // Simplified implementations for other vector methods
  async findSimilarComicsByImage(): Promise<any[]> { return []; }
  async findSimilarComicsByImageEmbedding(): Promise<any[]> { return []; }
  async updateComicImageEmbedding(): Promise<boolean> { return true; }
  async getComicGradingsWithoutEmbeddings(): Promise<any[]> { return []; }
  async searchMarketInsightsByContent(): Promise<any[]> { return []; }
  async findSimilarMarketInsights(): Promise<any[]> { return []; }
  async findSimilarMarketInsightsByEmbedding(): Promise<any[]> { return []; }
  async updateMarketInsightEmbedding(): Promise<boolean> { return true; }
  async getMarketInsightsWithoutEmbeddings(): Promise<any[]> { return []; }
  async findSimilarPricePatterns(): Promise<any[]> { return []; }
  async findSimilarPricePatternsByEmbedding(): Promise<any[]> { return []; }
  async updateMarketDataEmbedding(): Promise<boolean> { return true; }
  async getMarketDataWithoutEmbeddings(): Promise<any[]> { return []; }
  async calculateVectorSimilarity(): number { return 0; }
  async batchUpdateEmbeddings(): Promise<boolean> { return true; }
  async createVectorIndices(): Promise<boolean> { return true; }
  async refreshVectorIndices(): Promise<boolean> { return true; }
  async getVectorIndexStatus(): Promise<any[]> { return []; }
  async searchAssetsWithSimilarity(query: string, filters?: { type?: string; publisher?: string }, limit: number = 20): Promise<Array<Asset & { similarityScore?: number; searchScore: number }>> {
    const allAssets = await this.getAssets(filters);
    const queryLower = query.toLowerCase();
    
    return allAssets.map(asset => {
      let score = 0;
      
      if (asset.name.toLowerCase().includes(queryLower)) score += 0.6;
      if (asset.symbol.toLowerCase().includes(queryLower)) score += 0.4;
      if (asset.description?.toLowerCase().includes(queryLower)) score += 0.3;
      
      const metadata = asset.metadata as { publisher?: string; tags?: string[] } | null;
      if (metadata?.publisher?.toLowerCase().includes(queryLower)) score += 0.3;
      if (metadata?.tags?.some(tag => tag.toLowerCase().includes(queryLower))) score += 0.2;
      
      return { ...asset, searchScore: Math.min(score, 0.99) };
    }).filter(a => a.searchScore >= 0.1)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, limit);
  }
  async getRecommendationsForUser(): Promise<any> { return { success: false, userId: '', recommendations: [], count: 0 }; }
  async getPortfolioSimilarAssets(): Promise<any> { return { success: false, portfolioId: '', similarAssets: [], count: 0 }; }

  // Comic Series management
  async getComicSeries(id: string): Promise<ComicSeries | undefined> {
    const result = await db.select().from(comicSeries).where(eq(comicSeries.id, id)).limit(1);
    return result[0];
  }

  async getComicSeriesList(filters?: { publisher?: string; year?: number; search?: string; limit?: number }): Promise<ComicSeries[]> {
    let query = db.select().from(comicSeries);
    
    const conditions = [];
    
    if (filters?.publisher) {
      conditions.push(ilike(comicSeries.publisher, `%${filters.publisher}%`));
    }
    
    if (filters?.year) {
      conditions.push(eq(comicSeries.year, filters.year));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`(
          ${comicSeries.seriesName} ILIKE ${`%${filters.search}%`} OR 
          ${comicSeries.description} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(comicSeries.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    return await query;
  }

  async createComicSeries(series: InsertComicSeries): Promise<ComicSeries> {
    const result = await db.insert(comicSeries).values(series).returning();
    return result[0];
  }

  async updateComicSeries(id: string, series: Partial<InsertComicSeries>): Promise<ComicSeries | undefined> {
    const result = await db.update(comicSeries).set(series).where(eq(comicSeries.id, id)).returning();
    return result[0];
  }

  async deleteComicSeries(id: string): Promise<boolean> {
    const result = await db.delete(comicSeries).where(eq(comicSeries.id, id));
    return result.rowCount > 0;
  }

  async createBulkComicSeries(seriesList: InsertComicSeries[]): Promise<ComicSeries[]> {
    if (seriesList.length === 0) return [];
    const result = await db.insert(comicSeries).values(seriesList).returning();
    return result;
  }

  // Comic Issues management
  async getComicIssue(id: string): Promise<ComicIssue | undefined> {
    const result = await db.select().from(comicIssues).where(eq(comicIssues.id, id)).limit(1);
    return result[0];
  }

  async getComicIssues(filters?: { seriesId?: string; search?: string; writer?: string; artist?: string; limit?: number }): Promise<ComicIssue[]> {
    let query = db.select().from(comicIssues);
    
    const conditions = [];
    
    if (filters?.seriesId) {
      conditions.push(eq(comicIssues.seriesId, filters.seriesId));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`(
          ${comicIssues.issueTitle} ILIKE ${`%${filters.search}%`} OR 
          ${comicIssues.issueDescription} ILIKE ${`%${filters.search}%`} OR
          ${comicIssues.comicName} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    
    if (filters?.writer) {
      conditions.push(ilike(comicIssues.writer, `%${filters.writer}%`));
    }
    
    if (filters?.artist) {
      conditions.push(
        sql`(
          ${comicIssues.penciler} ILIKE ${`%${filters.artist}%`} OR 
          ${comicIssues.coverArtist} ILIKE ${`%${filters.artist}%`}
        )`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(comicIssues.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    return await query;
  }

  async getComicIssuesBySeriesId(seriesId: string): Promise<ComicIssue[]> {
    return await db.select().from(comicIssues).where(eq(comicIssues.seriesId, seriesId)).orderBy(comicIssues.issueNumber);
  }

  async createComicIssue(issue: InsertComicIssue): Promise<ComicIssue> {
    const result = await db.insert(comicIssues).values(issue).returning();
    return result[0];
  }

  async updateComicIssue(id: string, issue: Partial<InsertComicIssue>): Promise<ComicIssue | undefined> {
    const result = await db.update(comicIssues).set(issue).where(eq(comicIssues.id, id)).returning();
    return result[0];
  }

  async deleteComicIssue(id: string): Promise<boolean> {
    const result = await db.delete(comicIssues).where(eq(comicIssues.id, id));
    return result.rowCount > 0;
  }

  async createBulkComicIssues(issuesList: InsertComicIssue[]): Promise<ComicIssue[]> {
    if (issuesList.length === 0) return [];
    const result = await db.insert(comicIssues).values(issuesList).returning();
    return result;
  }

  // Comic Creators management
  async getComicCreator(id: string): Promise<ComicCreator | undefined> {
    const result = await db.select().from(comicCreators).where(eq(comicCreators.id, id)).limit(1);
    return result[0];
  }

  async getComicCreators(filters?: { role?: string; search?: string; limit?: number }): Promise<ComicCreator[]> {
    let query = db.select().from(comicCreators);
    
    const conditions = [];
    
    if (filters?.role) {
      conditions.push(eq(comicCreators.role, filters.role));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`(
          ${comicCreators.name} ILIKE ${`%${filters.search}%`} OR 
          ${comicCreators.biography} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(comicCreators.marketInfluence));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    return await query;
  }

  async getComicCreatorByName(name: string): Promise<ComicCreator | undefined> {
    const result = await db.select().from(comicCreators).where(eq(comicCreators.name, name)).limit(1);
    return result[0];
  }

  async createComicCreator(creator: InsertComicCreator): Promise<ComicCreator> {
    const result = await db.insert(comicCreators).values(creator).returning();
    return result[0];
  }

  async updateComicCreator(id: string, creator: Partial<InsertComicCreator>): Promise<ComicCreator | undefined> {
    const result = await db.update(comicCreators).set(creator).where(eq(comicCreators.id, id)).returning();
    return result[0];
  }

  async deleteComicCreator(id: string): Promise<boolean> {
    const result = await db.delete(comicCreators).where(eq(comicCreators.id, id));
    return result.rowCount > 0;
  }

  // Featured Comics management
  async getFeaturedComic(id: string): Promise<FeaturedComic | undefined> {
    const result = await db.select().from(featuredComics).where(eq(featuredComics.id, id)).limit(1);
    return result[0];
  }

  async getFeaturedComics(filters?: { featureType?: string; isActive?: boolean; limit?: number }): Promise<FeaturedComic[]> {
    let query = db.select().from(featuredComics);
    
    const conditions = [];
    
    if (filters?.featureType) {
      conditions.push(eq(featuredComics.featureType, filters.featureType));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(featuredComics.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(featuredComics.displayOrder);
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    return await query;
  }

  async createFeaturedComic(featured: InsertFeaturedComic): Promise<FeaturedComic> {
    const result = await db.insert(featuredComics).values(featured).returning();
    return result[0];
  }

  async updateFeaturedComic(id: string, featured: Partial<InsertFeaturedComic>): Promise<FeaturedComic | undefined> {
    const result = await db.update(featuredComics).set(featured).where(eq(featuredComics.id, id)).returning();
    return result[0];
  }

  async deleteFeaturedComic(id: string): Promise<boolean> {
    const result = await db.delete(featuredComics).where(eq(featuredComics.id, id));
    return result.rowCount > 0;
  }

  // Comic data aggregation for dashboards
  async getComicMetrics(): Promise<{ totalSeries: number; totalIssues: number; totalCreators: number; totalCovers: number }> {
    const [seriesCount, issuesCount, creatorsCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(comicSeries),
      db.select({ count: sql<number>`count(*)` }).from(comicIssues),
      db.select({ count: sql<number>`count(*)` }).from(comicCreators)
    ]);
    
    const coversCount = await db.select({ count: sql<number>`count(*)` })
      .from(comicSeries)
      .where(sql`${comicSeries.featuredCoverUrl} IS NOT NULL OR ${comicSeries.coversUrl} IS NOT NULL`);
    
    return {
      totalSeries: seriesCount[0]?.count || 0,
      totalIssues: issuesCount[0]?.count || 0,
      totalCreators: creatorsCount[0]?.count || 0,
      totalCovers: coversCount[0]?.count || 0
    };
  }
  
  async getFeaturedComicsCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(featuredComics);
    return result[0]?.count || 0;
  }

  async getTrendingComicSeries(limit?: number): Promise<ComicSeries[]> {
    let query = db.select().from(comicSeries)
      .where(sql`${comicSeries.featuredCoverUrl} IS NOT NULL OR ${comicSeries.coversUrl} IS NOT NULL`)
      .orderBy(desc(comicSeries.year));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getFeaturedComicsForHomepage(): Promise<FeaturedComic[]> {
    return this.getFeaturedComics({ isActive: true, limit: 10 });
  }

  // =========================================================================
  // PHASE 1 TRADING EXTENSIONS
  // =========================================================================

  // Trading Sessions
  async getTradingSession(id: string): Promise<TradingSession | undefined> {
    const result = await db.select().from(tradingSessions).where(eq(tradingSessions.id, id)).limit(1);
    return result[0];
  }

  async getUserTradingSessions(userId: string, isActive?: boolean): Promise<TradingSession[]> {
    let query = db.select().from(tradingSessions).where(eq(tradingSessions.userId, userId));
    
    if (isActive !== undefined) {
      query = query.where(and(eq(tradingSessions.userId, userId), eq(tradingSessions.isActive, isActive)));
    }
    
    return await query.orderBy(desc(tradingSessions.sessionStart));
  }

  async getActiveTradingSession(userId: string): Promise<TradingSession | undefined> {
    const result = await db.select().from(tradingSessions)
      .where(and(eq(tradingSessions.userId, userId), eq(tradingSessions.isActive, true)))
      .limit(1);
    return result[0];
  }

  async createTradingSession(session: InsertTradingSession): Promise<TradingSession> {
    const result = await db.insert(tradingSessions).values(session).returning();
    return result[0];
  }

  async updateTradingSession(id: string, session: Partial<InsertTradingSession>): Promise<TradingSession | undefined> {
    const result = await db.update(tradingSessions).set(session).where(eq(tradingSessions.id, id)).returning();
    return result[0];
  }

  async endTradingSession(id: string, endingBalance: string, sessionStats: Partial<TradingSession>): Promise<TradingSession | undefined> {
    const result = await db.update(tradingSessions)
      .set({
        sessionEnd: new Date(),
        endingBalance,
        isActive: false,
        ...sessionStats
      })
      .where(eq(tradingSessions.id, id))
      .returning();
    return result[0];
  }

  // Asset Current Prices  
  async getAssetCurrentPrice(assetId: string): Promise<AssetCurrentPrice | undefined> {
    const result = await db.select().from(assetCurrentPrices).where(eq(assetCurrentPrices.assetId, assetId)).limit(1);
    return result[0];
  }

  async getAssetCurrentPrices(assetIds: string[]): Promise<AssetCurrentPrice[]> {
    return await db.select().from(assetCurrentPrices).where(inArray(assetCurrentPrices.assetId, assetIds));
  }

  async getAllAssetCurrentPrices(marketStatus?: string): Promise<AssetCurrentPrice[]> {
    let query = db.select().from(assetCurrentPrices);
    
    if (marketStatus) {
      query = query.where(eq(assetCurrentPrices.marketStatus, marketStatus));
    }
    
    return await query.orderBy(desc(assetCurrentPrices.updatedAt));
  }

  async createAssetCurrentPrice(price: InsertAssetCurrentPrice): Promise<AssetCurrentPrice> {
    const result = await db.insert(assetCurrentPrices).values(price).returning();
    return result[0];
  }

  async updateAssetCurrentPrice(assetId: string, price: Partial<InsertAssetCurrentPrice>): Promise<AssetCurrentPrice | undefined> {
    const result = await db.update(assetCurrentPrices)
      .set({ ...price, updatedAt: new Date() })
      .where(eq(assetCurrentPrices.assetId, assetId))
      .returning();
    return result[0];
  }

  async updateBulkAssetPrices(prices: Partial<AssetCurrentPrice>[]): Promise<AssetCurrentPrice[]> {
    if (prices.length === 0) return [];
    
    const results: AssetCurrentPrice[] = [];
    
    // Update each price individually since bulk updates with WHERE clauses are complex in Drizzle
    for (const price of prices) {
      if (price.assetId) {
        const result = await this.updateAssetCurrentPrice(price.assetId, price);
        if (result) results.push(result);
      }
    }
    
    return results;
  }

  // Trading Limits
  async getTradingLimit(id: string): Promise<TradingLimit | undefined> {
    const result = await db.select().from(tradingLimits).where(eq(tradingLimits.id, id)).limit(1);
    return result[0];
  }

  async getUserTradingLimits(userId: string, isActive?: boolean): Promise<TradingLimit[]> {
    let query = db.select().from(tradingLimits).where(eq(tradingLimits.userId, userId));
    
    if (isActive !== undefined) {
      query = query.where(and(eq(tradingLimits.userId, userId), eq(tradingLimits.isActive, isActive)));
    }
    
    return await query.orderBy(desc(tradingLimits.createdAt));
  }

  async getUserTradingLimitsByType(userId: string, limitType: string): Promise<TradingLimit[]> {
    return await db.select().from(tradingLimits)
      .where(and(eq(tradingLimits.userId, userId), eq(tradingLimits.limitType, limitType)))
      .orderBy(desc(tradingLimits.createdAt));
  }

  async createTradingLimit(limit: InsertTradingLimit): Promise<TradingLimit> {
    const result = await db.insert(tradingLimits).values(limit).returning();
    return result[0];
  }

  async updateTradingLimit(id: string, limit: Partial<InsertTradingLimit>): Promise<TradingLimit | undefined> {
    const result = await db.update(tradingLimits)
      .set({ ...limit, updatedAt: new Date() })
      .where(eq(tradingLimits.id, id))
      .returning();
    return result[0];
  }

  async deleteTradingLimit(id: string): Promise<boolean> {
    const result = await db.delete(tradingLimits).where(eq(tradingLimits.id, id));
    return result.rowCount > 0;
  }

  async checkTradingLimitBreach(userId: string, limitType: string, proposedValue: number, assetId?: string): Promise<{ canProceed: boolean; limit?: TradingLimit; exceedsBy?: number }> {
    let query = db.select().from(tradingLimits)
      .where(and(
        eq(tradingLimits.userId, userId),
        eq(tradingLimits.limitType, limitType),
        eq(tradingLimits.isActive, true)
      ));
    
    if (assetId) {
      query = query.where(and(
        eq(tradingLimits.userId, userId),
        eq(tradingLimits.limitType, limitType),
        eq(tradingLimits.isActive, true),
        eq(tradingLimits.assetId, assetId)
      ));
    }
    
    const limits = await query;
    
    for (const limit of limits) {
      const currentUsage = parseFloat(limit.currentUsage);
      const limitValue = parseFloat(limit.limitValue);
      const newUsage = currentUsage + proposedValue;
      
      if (newUsage > limitValue) {
        return {
          canProceed: false,
          limit,
          exceedsBy: newUsage - limitValue
        };
      }
    }
    
    return { canProceed: true };
  }

  async resetUserTradingLimits(userId: string, resetPeriod: string): Promise<boolean> {
    const result = await db.update(tradingLimits)
      .set({ 
        currentUsage: "0.00",
        lastReset: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(tradingLimits.userId, userId),
        eq(tradingLimits.resetPeriod, resetPeriod),
        eq(tradingLimits.isActive, true)
      ));
    
    return result.rowCount > 0;
  }

  // Enhanced User Trading Operations
  async updateUserTradingBalance(userId: string, amount: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ 
        virtualTradingBalance: amount,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async resetUserDailyLimits(userId: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ 
        dailyTradingUsed: "0.00",
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getUserDefaultPortfolio(userId: string): Promise<Portfolio | undefined> {
    const result = await db.select().from(portfolios)
      .where(and(eq(portfolios.userId, userId), eq(portfolios.isDefault, true)))
      .limit(1);
    return result[0];
  }

  async createUserDefaultPortfolio(userId: string, initialCash: string): Promise<Portfolio> {
    const portfolioData: InsertPortfolio = {
      userId,
      name: "Default Trading Portfolio",
      description: "Your primary trading portfolio",
      isDefault: true,
      cashBalance: initialCash,
      initialCashAllocation: initialCash,
      portfolioType: "default"
    };
    
    const result = await db.insert(portfolios).values(portfolioData).returning();
    return result[0];
  }

  // Portfolio Cash Management
  async updatePortfolioCashBalance(portfolioId: string, amount: string, operation: 'add' | 'subtract' | 'set'): Promise<Portfolio | undefined> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) return undefined;
    
    let newBalance: string;
    const currentBalance = parseFloat(portfolio.cashBalance || "0");
    const changeAmount = parseFloat(amount);
    
    switch (operation) {
      case 'add':
        newBalance = (currentBalance + changeAmount).toFixed(2);
        break;
      case 'subtract':
        newBalance = (currentBalance - changeAmount).toFixed(2);
        break;
      case 'set':
        newBalance = changeAmount.toFixed(2);
        break;
      default:
        return undefined;
    }
    
    const result = await db.update(portfolios)
      .set({ 
        cashBalance: newBalance,
        updatedAt: new Date()
      })
      .where(eq(portfolios.id, portfolioId))
      .returning();
    
    return result[0];
  }

  async getPortfolioAvailableCash(portfolioId: string): Promise<{ cashBalance: string; reservedCash: string; availableCash: string }> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) {
      return { cashBalance: "0.00", reservedCash: "0.00", availableCash: "0.00" };
    }
    
    // Calculate reserved cash from pending orders
    const pendingOrders = await this.getUserOrders(portfolio.userId, "pending");
    const reservedCash = pendingOrders
      .filter(order => order.portfolioId === portfolioId && order.type === 'buy')
      .reduce((total, order) => total + parseFloat(order.totalValue || "0"), 0);
    
    const cashBalance = parseFloat(portfolio.cashBalance || "0");
    const availableCash = Math.max(0, cashBalance - reservedCash);
    
    return {
      cashBalance: cashBalance.toFixed(2),
      reservedCash: reservedCash.toFixed(2),
      availableCash: availableCash.toFixed(2)
    };
  }

  // LEADERBOARD SYSTEM IMPLEMENTATION

  // Trader Statistics
  async getTraderStats(userId: string): Promise<TraderStats | undefined> {
    const result = await db.select().from(traderStats).where(eq(traderStats.userId, userId)).limit(1);
    return result[0];
  }

  async getAllTraderStats(filters?: { minTrades?: number; limit?: number; offset?: number }): Promise<TraderStats[]> {
    let query = db.select().from(traderStats);
    
    const conditions = [];
    if (filters?.minTrades) {
      conditions.push(sql`${traderStats.totalTrades} >= ${filters.minTrades}`);
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(traderStats.rankPoints));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async createTraderStats(stats: InsertTraderStats): Promise<TraderStats> {
    const result = await db.insert(traderStats).values(stats).returning();
    return result[0];
  }

  async updateTraderStats(userId: string, stats: Partial<InsertTraderStats>): Promise<TraderStats | undefined> {
    const result = await db.update(traderStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(traderStats.userId, userId))
      .returning();
    return result[0];
  }

  async updateTraderStatsFromTrade(userId: string, tradeData: { 
    portfolioValue: string; 
    pnl: string; 
    tradeSize: string; 
    isProfitable: boolean;
    volume: string;
  }): Promise<TraderStats | undefined> {
    // Get existing stats or create new
    let currentStats = await this.getTraderStats(userId);
    if (!currentStats) {
      currentStats = await this.createTraderStats({
        userId,
        totalPortfolioValue: tradeData.portfolioValue,
        totalTrades: 1,
        profitableTrades: tradeData.isProfitable ? 1 : 0,
        totalTradingVolume: tradeData.volume,
        firstTradeDate: new Date(),
        lastTradeDate: new Date()
      });
    }

    // Calculate updated metrics
    const newTotalTrades = currentStats.totalTrades + 1;
    const newProfitableTrades = currentStats.profitableTrades + (tradeData.isProfitable ? 1 : 0);
    const newWinRate = (newProfitableTrades / newTotalTrades) * 100;
    const currentVolume = parseFloat(currentStats.totalTradingVolume || "0");
    const newVolume = currentVolume + parseFloat(tradeData.volume);
    const newAvgTradeSize = newVolume / newTotalTrades;
    
    // Update P&L
    const currentPnL = parseFloat(currentStats.totalPnL || "0");
    const tradePnL = parseFloat(tradeData.pnl);
    const newTotalPnL = currentPnL + tradePnL;
    
    // Update win/loss streaks
    let newWinningStreak = currentStats.currentWinningStreak;
    let newLosingStreak = currentStats.currentLosingStreak;
    
    if (tradeData.isProfitable) {
      newWinningStreak += 1;
      newLosingStreak = 0;
    } else {
      newLosingStreak += 1;
      newWinningStreak = 0;
    }
    
    // Calculate rank points (composite score)
    const rankPoints = this.calculateRankPoints(newTotalPnL, newWinRate, newVolume, newTotalTrades);

    return await this.updateTraderStats(userId, {
      totalPortfolioValue: tradeData.portfolioValue,
      totalPnL: newTotalPnL.toFixed(2),
      totalTrades: newTotalTrades,
      profitableTrades: newProfitableTrades,
      winRate: newWinRate.toFixed(2),
      averageTradeSize: newAvgTradeSize.toFixed(2),
      totalTradingVolume: newVolume.toFixed(2),
      currentWinningStreak: newWinningStreak,
      currentLosingStreak: newLosingStreak,
      longestWinningStreak: Math.max(currentStats.longestWinningStreak, newWinningStreak),
      longestLosingStreak: Math.max(currentStats.longestLosingStreak, newLosingStreak),
      biggestWin: tradePnL > 0 ? Math.max(parseFloat(currentStats.biggestWin || "0"), tradePnL).toFixed(2) : currentStats.biggestWin,
      biggestLoss: tradePnL < 0 ? Math.min(parseFloat(currentStats.biggestLoss || "0"), tradePnL).toFixed(2) : currentStats.biggestLoss,
      rankPoints: rankPoints.toFixed(2),
      lastTradeDate: new Date()
    });
  }

  private calculateRankPoints(totalPnL: number, winRate: number, volume: number, totalTrades: number): number {
    // Composite scoring algorithm
    const pnlScore = Math.max(0, totalPnL) * 0.4; // 40% weight on profits
    const winRateScore = winRate * 2; // 20% weight (winRate is 0-100, so *2 gives 0-200 points)
    const volumeScore = Math.log10(Math.max(1, volume)) * 100; // 30% weight on volume (log scale)
    const activityScore = Math.min(totalTrades, 1000) * 0.1; // 10% weight on activity
    
    return pnlScore + winRateScore + volumeScore + activityScore;
  }

  async recalculateAllTraderStats(): Promise<void> {
    // This would be a background job that recalculates all stats from orders table
    // For now, we'll implement a basic version
    const allUsers = await db.select({ id: users.id }).from(users);
    
    for (const user of allUsers) {
      const userOrders = await this.getUserOrders(user.id, 'filled');
      
      if (userOrders.length > 0) {
        // Calculate stats from orders
        let totalVolume = 0;
        let totalPnL = 0;
        let profitableTrades = 0;
        
        for (const order of userOrders) {
          totalVolume += parseFloat(order.totalValue || "0");
          // For simplicity, assume profit if order type is sell with higher price
          if (order.type === 'sell') {
            totalPnL += parseFloat(order.totalValue || "0") - parseFloat(order.averageFillPrice || order.price || "0") * parseFloat(order.quantity || "0");
            if (totalPnL > 0) profitableTrades++;
          }
        }
        
        await this.updateTraderStats(user.id, {
          totalTrades: userOrders.length,
          profitableTrades,
          winRate: ((profitableTrades / userOrders.length) * 100).toFixed(2),
          totalTradingVolume: totalVolume.toFixed(2),
          totalPnL: totalPnL.toFixed(2),
          rankPoints: this.calculateRankPoints(totalPnL, (profitableTrades / userOrders.length) * 100, totalVolume, userOrders.length).toFixed(2)
        });
      }
    }
  }

  async getTopTradersByMetric(metric: 'totalPnL' | 'winRate' | 'totalTradingVolume' | 'roiPercentage', limit?: number): Promise<TraderStats[]> {
    let orderByField;
    switch (metric) {
      case 'totalPnL':
        orderByField = desc(traderStats.totalPnL);
        break;
      case 'winRate':
        orderByField = desc(traderStats.winRate);
        break;
      case 'totalTradingVolume':
        orderByField = desc(traderStats.totalTradingVolume);
        break;
      case 'roiPercentage':
        orderByField = desc(traderStats.roiPercentage);
        break;
    }
    
    let query = db.select().from(traderStats).orderBy(orderByField);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  // Leaderboard Categories
  async getLeaderboardCategory(id: string): Promise<LeaderboardCategory | undefined> {
    const result = await db.select().from(leaderboardCategories).where(eq(leaderboardCategories.id, id)).limit(1);
    return result[0];
  }

  async getLeaderboardCategories(filters?: { isActive?: boolean; timeframe?: string }): Promise<LeaderboardCategory[]> {
    let query = db.select().from(leaderboardCategories);
    
    const conditions = [];
    if (filters?.isActive !== undefined) {
      conditions.push(eq(leaderboardCategories.isActive, filters.isActive));
    }
    if (filters?.timeframe) {
      conditions.push(eq(leaderboardCategories.timeframe, filters.timeframe));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(leaderboardCategories.displayOrder);
  }

  async createLeaderboardCategory(category: InsertLeaderboardCategory): Promise<LeaderboardCategory> {
    const result = await db.insert(leaderboardCategories).values(category).returning();
    return result[0];
  }

  async updateLeaderboardCategory(id: string, category: Partial<InsertLeaderboardCategory>): Promise<LeaderboardCategory | undefined> {
    const result = await db.update(leaderboardCategories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(leaderboardCategories.id, id))
      .returning();
    return result[0];
  }

  async deleteLeaderboardCategory(id: string): Promise<boolean> {
    const result = await db.delete(leaderboardCategories).where(eq(leaderboardCategories.id, id));
    return result.rowCount > 0;
  }

  // Leaderboard Generation and Rankings
  async generateLeaderboard(categoryType: string, timeframe: string, limit?: number): Promise<Array<TraderStats & { user: User; rank: number }>> {
    // Join trader stats with users and rank them
    const query = sql`
      SELECT ts.*, u.email, u."firstName", u."lastName", u."profileImageUrl",
             ROW_NUMBER() OVER (ORDER BY 
               CASE 
                 WHEN ${categoryType} = 'total_return' THEN ts.total_pnl::numeric
                 WHEN ${categoryType} = 'win_rate' THEN ts.win_rate::numeric
                 WHEN ${categoryType} = 'volume' THEN ts.total_trading_volume::numeric
                 WHEN ${categoryType} = 'roi' THEN ts.roi_percentage::numeric
                 ELSE ts.rank_points::numeric
               END DESC
             ) as rank
      FROM trader_stats ts
      JOIN users u ON ts.user_id = u.id
      WHERE ts.total_trades >= 1
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;
    
    const result = await db.execute(query);
    return result.rows as any[];
  }

  async getLeaderboardByCategoryId(categoryId: string, limit?: number): Promise<Array<TraderStats & { user: User; rank: number }>> {
    const category = await this.getLeaderboardCategory(categoryId);
    if (!category) return [];
    
    return await this.generateLeaderboard(category.categoryType, category.timeframe, limit);
  }

  async getUserRankInCategory(userId: string, categoryType: string, timeframe: string): Promise<{ rank: number; totalUsers: number; stats: TraderStats } | undefined> {
    const userStats = await this.getTraderStats(userId);
    if (!userStats) return undefined;
    
    // Get user's rank in this category
    const rankQuery = sql`
      SELECT COUNT(*) + 1 as rank
      FROM trader_stats ts
      WHERE (
        CASE 
          WHEN ${categoryType} = 'total_return' THEN ts.total_pnl::numeric
          WHEN ${categoryType} = 'win_rate' THEN ts.win_rate::numeric
          WHEN ${categoryType} = 'volume' THEN ts.total_trading_volume::numeric
          WHEN ${categoryType} = 'roi' THEN ts.roi_percentage::numeric
          ELSE ts.rank_points::numeric
        END
      ) > (
        CASE 
          WHEN ${categoryType} = 'total_return' THEN ${userStats.totalPnL}::numeric
          WHEN ${categoryType} = 'win_rate' THEN ${userStats.winRate}::numeric
          WHEN ${categoryType} = 'volume' THEN ${userStats.totalTradingVolume}::numeric
          WHEN ${categoryType} = 'roi' THEN ${userStats.roiPercentage}::numeric
          ELSE ${userStats.rankPoints}::numeric
        END
      )
      AND ts.total_trades >= 1
    `;
    
    const totalQuery = sql`SELECT COUNT(*) as total FROM trader_stats WHERE total_trades >= 1`;
    
    const [rankResult, totalResult] = await Promise.all([
      db.execute(rankQuery),
      db.execute(totalQuery)
    ]);
    
    return {
      rank: Number(rankResult.rows[0]?.rank || 0),
      totalUsers: Number(totalResult.rows[0]?.total || 0),
      stats: userStats
    };
  }

  async updateLeaderboardRankings(categoryType?: string): Promise<void> {
    // Update current rank for all users
    const updateQuery = sql`
      UPDATE trader_stats 
      SET current_rank = ranked.rank
      FROM (
        SELECT user_id, 
               ROW_NUMBER() OVER (ORDER BY rank_points DESC) as rank
        FROM trader_stats 
        WHERE total_trades >= 1
      ) ranked
      WHERE trader_stats.user_id = ranked.user_id
    `;
    
    await db.execute(updateQuery);
  }

  // User Achievements
  async getUserAchievement(id: string): Promise<UserAchievement | undefined> {
    const result = await db.select().from(userAchievements).where(eq(userAchievements.id, id)).limit(1);
    return result[0];
  }

  async getUserAchievements(userId: string, filters?: { category?: string; tier?: string; isVisible?: boolean }): Promise<UserAchievement[]> {
    let query = db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
    
    const conditions = [eq(userAchievements.userId, userId)];
    
    if (filters?.category) {
      conditions.push(eq(userAchievements.category, filters.category));
    }
    if (filters?.tier) {
      conditions.push(eq(userAchievements.tier, filters.tier));
    }
    if (filters?.isVisible !== undefined) {
      conditions.push(eq(userAchievements.isVisible, filters.isVisible));
    }
    
    return await db.select().from(userAchievements)
      .where(and(...conditions))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const result = await db.insert(userAchievements).values(achievement).returning();
    return result[0];
  }

  async updateUserAchievement(id: string, achievement: Partial<InsertUserAchievement>): Promise<UserAchievement | undefined> {
    const result = await db.update(userAchievements)
      .set(achievement)
      .where(eq(userAchievements.id, id))
      .returning();
    return result[0];
  }

  async deleteUserAchievement(id: string): Promise<boolean> {
    const result = await db.delete(userAchievements).where(eq(userAchievements.id, id));
    return result.rowCount > 0;
  }

  // Achievement Processing
  async checkAndAwardAchievements(userId: string, context: 'trade_completed' | 'milestone_reached' | 'streak_achieved'): Promise<UserAchievement[]> {
    const userStats = await this.getTraderStats(userId);
    if (!userStats) return [];
    
    const newAchievements: UserAchievement[] = [];
    const achievementDefinitions = this.getAchievementDefinitions();
    
    for (const def of achievementDefinitions) {
      // Check if user already has this achievement
      const existing = await db.select()
        .from(userAchievements)
        .where(and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, def.id)
        ))
        .limit(1);
        
      if (existing.length > 0) continue; // Already has this achievement
      
      // Check if user meets criteria
      if (this.meetsAchievementCriteria(userStats, def)) {
        const achievement = await this.createUserAchievement({
          userId,
          achievementId: def.id,
          title: def.title,
          description: def.description,
          category: def.category,
          iconName: def.iconName,
          badgeColor: def.badgeColor,
          tier: def.tier,
          points: def.points,
          rarity: def.rarity,
          criteria: def.criteria,
          progress: def.progress
        });
        
        newAchievements.push(achievement);
      }
    }
    
    return newAchievements;
  }

  private getAchievementDefinitions() {
    return [
      {
        id: "first_trade",
        title: "First Trade",
        description: "Complete your first trade",
        category: "trading",
        iconName: "TrendingUp",
        badgeColor: "blue",
        tier: "bronze",
        points: 10,
        rarity: "common",
        criteria: { minTrades: 1 },
        progress: {}
      },
      {
        id: "profit_milestone_1000",
        title: "$1,000 Profit",
        description: "Reach $1,000 in total profits",
        category: "profit",
        iconName: "DollarSign",
        badgeColor: "green",
        tier: "silver",
        points: 50,
        rarity: "rare",
        criteria: { minProfit: 1000 },
        progress: {}
      },
      {
        id: "volume_trader_10k",
        title: "Volume Trader",
        description: "Trade $10,000 in total volume",
        category: "volume",
        iconName: "BarChart3",
        badgeColor: "purple",
        tier: "silver",
        points: 30,
        rarity: "rare",
        criteria: { minVolume: 10000 },
        progress: {}
      },
      {
        id: "winning_streak_5",
        title: "Win Streak",
        description: "Achieve 5 profitable trades in a row",
        category: "streak",
        iconName: "Star",
        badgeColor: "yellow",
        tier: "gold",
        points: 25,
        rarity: "epic",
        criteria: { minWinStreak: 5 },
        progress: {}
      }
    ];
  }
  
  private meetsAchievementCriteria(stats: TraderStats, def: any): boolean {
    if (def.criteria.minTrades && stats.totalTrades < def.criteria.minTrades) return false;
    if (def.criteria.minProfit && parseFloat(stats.totalPnL || "0") < def.criteria.minProfit) return false;
    if (def.criteria.minVolume && parseFloat(stats.totalTradingVolume || "0") < def.criteria.minVolume) return false;
    if (def.criteria.minWinStreak && stats.currentWinningStreak < def.criteria.minWinStreak) return false;
    
    return true;
  }

  async getAvailableAchievements(): Promise<Array<{ id: string; title: string; description: string; category: string; tier: string; criteria: any }>> {
    return this.getAchievementDefinitions();
  }

  async getUserAchievementProgress(userId: string, achievementId: string): Promise<{ current: number; required: number; percentage: number } | undefined> {
    const userStats = await this.getTraderStats(userId);
    if (!userStats) return undefined;
    
    const def = this.getAchievementDefinitions().find(d => d.id === achievementId);
    if (!def) return undefined;
    
    let current = 0;
    let required = 0;
    
    if (def.criteria.minTrades) {
      current = userStats.totalTrades;
      required = def.criteria.minTrades;
    } else if (def.criteria.minProfit) {
      current = parseFloat(userStats.totalPnL || "0");
      required = def.criteria.minProfit;
    } else if (def.criteria.minVolume) {
      current = parseFloat(userStats.totalTradingVolume || "0");
      required = def.criteria.minVolume;
    } else if (def.criteria.minWinStreak) {
      current = userStats.longestWinningStreak;
      required = def.criteria.minWinStreak;
    }
    
    return {
      current,
      required,
      percentage: Math.min(100, (current / required) * 100)
    };
  }

  // Leaderboard Analytics and Statistics
  async getLeaderboardOverview(): Promise<{
    totalActiveTraders: number;
    totalTrades: number;
    totalVolume: string;
    topPerformer: TraderStats & { user: User };
    categories: LeaderboardCategory[];
  }> {
    const [activeTraders, totalStatsQuery, topPerformerQuery, categories] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM trader_stats WHERE total_trades >= 1`),
      db.execute(sql`SELECT SUM(total_trades) as trades, SUM(total_trading_volume::numeric) as volume FROM trader_stats`),
      this.generateLeaderboard('total_return', 'all_time', 1),
      this.getLeaderboardCategories({ isActive: true })
    ]);
    
    const totalActiveTraders = Number(activeTraders.rows[0]?.count || 0);
    const totalTrades = Number(totalStatsQuery.rows[0]?.trades || 0);
    const totalVolume = String(totalStatsQuery.rows[0]?.volume || "0");
    const topPerformer = topPerformerQuery[0];
    
    return {
      totalActiveTraders,
      totalTrades,
      totalVolume,
      topPerformer,
      categories
    };
  }

  async getTradingActivitySummary(timeframe: 'daily' | 'weekly' | 'monthly'): Promise<{
    newTraders: number;
    totalTrades: number;
    totalVolume: string;
    avgTradeSize: string;
    topMovers: Array<TraderStats & { user: User }>;
  }> {
    let dateFilter: string;
    switch (timeframe) {
      case 'daily':
        dateFilter = "last_trade_date >= CURRENT_DATE";
        break;
      case 'weekly':
        dateFilter = "last_trade_date >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'monthly':
        dateFilter = "last_trade_date >= CURRENT_DATE - INTERVAL '30 days'";
        break;
    }
    
    const [newTradersQuery, activityQuery, topMovers] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM trader_stats WHERE first_trade_date >= CURRENT_DATE - INTERVAL '30 days'`),
      db.execute(sql`
        SELECT SUM(total_trades) as trades, 
               SUM(total_trading_volume::numeric) as volume,
               AVG(average_trade_size::numeric) as avg_size
        FROM trader_stats 
        WHERE ${sql.raw(dateFilter)}
      `),
      this.generateLeaderboard('total_return', timeframe, 5)
    ]);
    
    const newTraders = Number(newTradersQuery.rows[0]?.count || 0);
    const totalTrades = Number(activityQuery.rows[0]?.trades || 0);
    const totalVolume = String(activityQuery.rows[0]?.volume || "0");
    const avgTradeSize = String(activityQuery.rows[0]?.avg_size || "0");
    
    return {
      newTraders,
      totalTrades,
      totalVolume,
      avgTradeSize,
      topMovers
    };
  }

  // ===== ENHANCED TRADING DATA METHODS =====

  // Enhanced Characters - For character trading and battle data
  async getEnhancedCharacters(filters?: {
    universe?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
    minPowerLevel?: number;
    maxPowerLevel?: number;
  }): Promise<EnhancedCharacter[]> {
    let query = db.select().from(enhancedCharacters);
    const conditions = [];
    
    if (filters?.universe && filters.universe !== 'all') {
      conditions.push(ilike(enhancedCharacters.universe, `%${filters.universe}%`));
    }
    
    if (filters?.search) {
      conditions.push(
        sql`(
          ${enhancedCharacters.name} ILIKE ${`%${filters.search}%`} OR 
          ${enhancedCharacters.creators} @> ${[filters.search]} OR
          ${enhancedCharacters.specialAbilities} @> ${[filters.search]}
        )`
      );
    }
    
    if (filters?.minPowerLevel !== undefined) {
      conditions.push(sql`${enhancedCharacters.powerLevel} >= ${filters.minPowerLevel}`);
    }
    
    if (filters?.maxPowerLevel !== undefined) {
      conditions.push(sql`${enhancedCharacters.powerLevel} <= ${filters.maxPowerLevel}`);
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    switch (filters?.sort) {
      case 'power_level':
        query = query.orderBy(desc(enhancedCharacters.powerLevel));
        break;
      case 'battle_win_rate':
        query = query.orderBy(desc(enhancedCharacters.battleWinRate));
        break;
      case 'market_value':
        query = query.orderBy(desc(enhancedCharacters.marketValue));
        break;
      case 'name':
        query = query.orderBy(enhancedCharacters.name);
        break;
      default:
        query = query.orderBy(desc(enhancedCharacters.powerLevel));
        break;
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getEnhancedCharacter(id: string): Promise<EnhancedCharacter | undefined> {
    const result = await db.select().from(enhancedCharacters).where(eq(enhancedCharacters.id, id)).limit(1);
    return result[0];
  }

  async getCharactersByUniverse(universe: string): Promise<EnhancedCharacter[]> {
    return await db.select()
      .from(enhancedCharacters)
      .where(ilike(enhancedCharacters.universe, `%${universe}%`))
      .orderBy(desc(enhancedCharacters.powerLevel))
      .limit(50);
  }

  // Enhanced Comic Issues - For comic market data and discovery
  async getEnhancedComicIssues(filters?: {
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
    minValue?: number;
    maxValue?: number;
    minKeyRating?: number;
  }): Promise<EnhancedComicIssue[]> {
    let query = db.select().from(enhancedComicIssues);
    const conditions = [];
    
    if (filters?.search) {
      conditions.push(
        sql`(
          ${enhancedComicIssues.categoryTitle} ILIKE ${`%${filters.search}%`} OR 
          ${enhancedComicIssues.issueName} ILIKE ${`%${filters.search}%`} OR
          ${enhancedComicIssues.comicSeries} ILIKE ${`%${filters.search}%`} OR
          ${enhancedComicIssues.writers} @> ${[filters.search]}
        )`
      );
    }
    
    if (filters?.minValue !== undefined) {
      conditions.push(sql`${enhancedComicIssues.currentMarketValue} >= ${filters.minValue}`);
    }
    
    if (filters?.maxValue !== undefined) {
      conditions.push(sql`${enhancedComicIssues.currentMarketValue} <= ${filters.maxValue}`);
    }
    
    if (filters?.minKeyRating !== undefined) {
      conditions.push(sql`${enhancedComicIssues.keyIssueRating} >= ${filters.minKeyRating}`);
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    switch (filters?.sort) {
      case 'current_market_value':
        query = query.orderBy(desc(enhancedComicIssues.currentMarketValue));
        break;
      case 'key_issue_rating':
        query = query.orderBy(desc(enhancedComicIssues.keyIssueRating));
        break;
      case 'rarity_score':
        query = query.orderBy(desc(enhancedComicIssues.rarityScore));
        break;
      case 'issue_name':
        query = query.orderBy(enhancedComicIssues.issueName);
        break;
      default:
        query = query.orderBy(desc(enhancedComicIssues.currentMarketValue));
        break;
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getEnhancedComicIssue(id: string): Promise<EnhancedComicIssue | undefined> {
    const result = await db.select().from(enhancedComicIssues).where(eq(enhancedComicIssues.id, id)).limit(1);
    return result[0];
  }

  // Battle Scenarios - For battle intelligence and outcomes
  async getBattleScenarios(filters?: {
    characterId?: string;
    battleType?: string;
    timeframe?: string;
    limit?: number;
    offset?: number;
  }): Promise<BattleScenario[]> {
    let query = db.select().from(battleScenarios);
    const conditions = [];
    
    if (filters?.characterId) {
      conditions.push(
        sql`(${battleScenarios.character1Id} = ${filters.characterId} OR ${battleScenarios.character2Id} = ${filters.characterId})`
      );
    }
    
    if (filters?.battleType) {
      conditions.push(eq(battleScenarios.battleType, filters.battleType));
    }
    
    if (filters?.timeframe) {
      switch (filters.timeframe) {
        case '1h':
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '1 hour'`);
          break;
        case '24h':
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '24 hours'`);
          break;
        case '7d':
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '7 days'`);
          break;
        case '30d':
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '30 days'`);
          break;
      }
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(battleScenarios.eventDate));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getBattleIntelligenceSummary(): Promise<{
    recentBattles: Array<{
      id: string;
      character1Name: string;
      character2Name?: string;
      winner: string;
      marketImpact: number;
      timestamp: string;
    }>;
    totalBattles: number;
    avgMarketImpact: number;
  }> {
    // Get recent battles with character names
    const recentBattlesQuery = await db.execute(sql`
      SELECT 
        bs.id,
        c1.name as character1_name,
        c2.name as character2_name,
        CASE 
          WHEN bs.outcome = 1 THEN c1.name 
          ELSE COALESCE(c2.name, 'Unknown')
        END as winner,
        bs.market_impact_percent as market_impact,
        bs.event_date as timestamp
      FROM battle_scenarios bs
      LEFT JOIN enhanced_characters c1 ON bs.character1_id = c1.id
      LEFT JOIN enhanced_characters c2 ON bs.character2_id = c2.id
      ORDER BY bs.event_date DESC
      LIMIT 20
    `);

    // Get battle statistics
    const statsQuery = await db.execute(sql`
      SELECT 
        COUNT(*) as total_battles,
        AVG(market_impact_percent::numeric) as avg_market_impact
      FROM battle_scenarios
      WHERE event_date >= NOW() - INTERVAL '30 days'
    `);

    const recentBattles = recentBattlesQuery.rows.map((row: any) => ({
      id: row.id,
      character1Name: row.character1_name,
      character2Name: row.character2_name,
      winner: row.winner,
      marketImpact: parseFloat(row.market_impact || '0'),
      timestamp: row.timestamp
    }));

    const stats = statsQuery.rows[0];

    return {
      recentBattles,
      totalBattles: parseInt(stats?.total_battles || '0'),
      avgMarketImpact: parseFloat(stats?.avg_market_impact || '0')
    };
  }

  // Movie Performance Data - For box office impact analysis
  async getMoviePerformanceData(filters?: {
    franchise?: string;
    characterFamily?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }): Promise<MoviePerformanceData[]> {
    let query = db.select().from(moviePerformanceData);
    const conditions = [];
    
    if (filters?.franchise && filters.franchise !== 'all') {
      conditions.push(ilike(moviePerformanceData.franchise, `%${filters.franchise}%`));
    }
    
    if (filters?.characterFamily) {
      conditions.push(ilike(moviePerformanceData.characterFamily, `%${filters.characterFamily}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    switch (filters?.sort) {
      case 'worldwide_gross':
        query = query.orderBy(desc(moviePerformanceData.worldwideGross));
        break;
      case 'impact_score':
        query = query.orderBy(desc(moviePerformanceData.marketImpactScore));
        break;
      case 'rotten_tomatoes_score':
        query = query.orderBy(desc(moviePerformanceData.rottenTomatoesScore));
        break;
      case 'release_date':
        query = query.orderBy(desc(moviePerformanceData.releaseDate));
        break;
      default:
        query = query.orderBy(desc(moviePerformanceData.marketImpactScore));
        break;
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getMoviePerformanceItem(id: string): Promise<MoviePerformanceData | undefined> {
    const result = await db.select().from(moviePerformanceData).where(eq(moviePerformanceData.id, id)).limit(1);
    return result[0];
  }

  async getTopMoviesByImpact(limit: number = 10): Promise<MoviePerformanceData[]> {
    return await db.select()
      .from(moviePerformanceData)
      .orderBy(desc(moviePerformanceData.marketImpactScore))
      .limit(limit);
  }

  // MYTHOLOGICAL HOUSES SYSTEM METHODS

  async getHouseMembers(houseId: string): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(eq(users.currentHouse, houseId));
  }

  async getHouseMemberCount(houseId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.currentHouse, houseId));
    return result[0]?.count || 0;
  }

  async getHouseTopTraders(houseId: string, limit: number = 10): Promise<Array<User & { karma: number; rank: number }>> {
    const result = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      currentHouse: users.currentHouse,
      karma: users.karma,
      tradingBalance: users.tradingBalance,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
      .from(users)
      .where(eq(users.currentHouse, houseId))
      .orderBy(desc(users.karma))
      .limit(limit);

    return result.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }

  async getUserHouseRank(userId: string, houseId: string): Promise<{ rank: number; totalMembers: number } | undefined> {
    const user = await this.getUser(userId);
    if (!user || user.currentHouse !== houseId) {
      return undefined;
    }

    const [rankResult, totalResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(and(
          eq(users.currentHouse, houseId),
          sql`${users.karma} > ${user.karma}`
        )),
      this.getHouseMemberCount(houseId)
    ]);

    return {
      rank: (rankResult[0]?.count || 0) + 1,
      totalMembers: totalResult
    };
  }

  async getUserKarma(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    return user?.karma || 0;
  }

  async recordKarmaAction(userId: string, action: string, karmaChange: number, reason?: string): Promise<boolean> {
    try {
      // Update user karma
      await db.update(users)
        .set({
          karma: sql`${users.karma} + ${karmaChange}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      // Note: We could also create a karma_actions table here for logging
      // For now, just return success
      return true;
    } catch (error) {
      console.error('Error recording karma action:', error);
      return false;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const [updated] = await db.update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // ========================================================================================
  // COMPREHENSIVE LEARNING SYSTEM IMPLEMENTATION
  // ========================================================================================

  // Learning Paths Management
  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    try {
      const result = await db.select().from(learningPaths).where(eq(learningPaths.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching learning path:', error);
      return undefined;
    }
  }

  async getLearningPaths(filters?: { houseId?: string; difficultyLevel?: string; isActive?: boolean }): Promise<LearningPath[]> {
    try {
      let query = db.select().from(learningPaths);
      const conditions = [];

      if (filters?.houseId) {
        conditions.push(eq(learningPaths.houseId, filters.houseId));
      }
      if (filters?.difficultyLevel) {
        conditions.push(eq(learningPaths.difficultyLevel, filters.difficultyLevel));
      }
      if (filters?.isActive !== undefined) {
        conditions.push(eq(learningPaths.isActive, filters.isActive));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      return await query.orderBy(learningPaths.displayOrder, learningPaths.createdAt);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  }

  async getLearningPathsByHouse(houseId: string): Promise<LearningPath[]> {
    return await this.getLearningPaths({ houseId, isActive: true });
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    try {
      const result = await db.insert(learningPaths).values(path).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating learning path:', error);
      throw error;
    }
  }

  async updateLearningPath(id: string, path: Partial<InsertLearningPath>): Promise<LearningPath | undefined> {
    try {
      const [updated] = await db.update(learningPaths)
        .set({ ...path, updatedAt: new Date() })
        .where(eq(learningPaths.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating learning path:', error);
      return undefined;
    }
  }

  async deleteLearningPath(id: string): Promise<boolean> {
    try {
      await db.delete(learningPaths).where(eq(learningPaths.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting learning path:', error);
      return false;
    }
  }

  // Sacred Lessons Management
  async getSacredLesson(id: string): Promise<SacredLesson | undefined> {
    try {
      const result = await db.select().from(sacredLessons).where(eq(sacredLessons.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching sacred lesson:', error);
      return undefined;
    }
  }

  async getSacredLessons(filters?: { houseId?: string; pathId?: string; lessonType?: string; difficultyLevel?: string; isActive?: boolean }): Promise<SacredLesson[]> {
    try {
      let query = db.select().from(sacredLessons);
      const conditions = [];

      if (filters?.houseId) {
        conditions.push(eq(sacredLessons.houseId, filters.houseId));
      }
      if (filters?.pathId) {
        conditions.push(eq(sacredLessons.pathId, filters.pathId));
      }
      if (filters?.lessonType) {
        conditions.push(eq(sacredLessons.lessonType, filters.lessonType));
      }
      if (filters?.difficultyLevel) {
        conditions.push(eq(sacredLessons.difficultyLevel, filters.difficultyLevel));
      }
      if (filters?.isActive !== undefined) {
        conditions.push(eq(sacredLessons.isActive, filters.isActive));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      return await query.orderBy(sacredLessons.createdAt);
    } catch (error) {
      console.error('Error fetching sacred lessons:', error);
      return [];
    }
  }

  async getLessonsByPath(pathId: string): Promise<SacredLesson[]> {
    return await this.getSacredLessons({ pathId, isActive: true });
  }

  async getLessonsByHouse(houseId: string): Promise<SacredLesson[]> {
    return await this.getSacredLessons({ houseId, isActive: true });
  }

  async createSacredLesson(lesson: InsertSacredLesson): Promise<SacredLesson> {
    try {
      const result = await db.insert(sacredLessons).values(lesson).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating sacred lesson:', error);
      throw error;
    }
  }

  async updateSacredLesson(id: string, lesson: Partial<InsertSacredLesson>): Promise<SacredLesson | undefined> {
    try {
      const [updated] = await db.update(sacredLessons)
        .set({ ...lesson, updatedAt: new Date() })
        .where(eq(sacredLessons.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating sacred lesson:', error);
      return undefined;
    }
  }

  async deleteSacredLesson(id: string): Promise<boolean> {
    try {
      await db.delete(sacredLessons).where(eq(sacredLessons.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting sacred lesson:', error);
      return false;
    }
  }

  async searchLessons(searchTerm: string, filters?: { houseId?: string; difficultyLevel?: string }): Promise<SacredLesson[]> {
    try {
      let query = db.select().from(sacredLessons);
      const conditions = [
        sql`(
          ${sacredLessons.title} ILIKE ${`%${searchTerm}%`} OR 
          ${sacredLessons.description} ILIKE ${`%${searchTerm}%`} OR 
          ${sacredLessons.sacredTitle} ILIKE ${`%${searchTerm}%`}
        )`
      ];

      if (filters?.houseId) {
        conditions.push(eq(sacredLessons.houseId, filters.houseId));
      }
      if (filters?.difficultyLevel) {
        conditions.push(eq(sacredLessons.difficultyLevel, filters.difficultyLevel));
      }
      
      conditions.push(eq(sacredLessons.isActive, true));

      query = query.where(and(...conditions));
      return await query.orderBy(sacredLessons.createdAt);
    } catch (error) {
      console.error('Error searching lessons:', error);
      return [];
    }
  }

  // Mystical Skills Management
  async getMysticalSkill(id: string): Promise<MysticalSkill | undefined> {
    try {
      const result = await db.select().from(mysticalSkills).where(eq(mysticalSkills.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching mystical skill:', error);
      return undefined;
    }
  }

  async getMysticalSkills(filters?: { houseId?: string; skillCategory?: string; tier?: string; rarityLevel?: string; isActive?: boolean }): Promise<MysticalSkill[]> {
    try {
      let query = db.select().from(mysticalSkills);
      const conditions = [];

      if (filters?.houseId) {
        conditions.push(eq(mysticalSkills.houseId, filters.houseId));
      }
      if (filters?.skillCategory) {
        conditions.push(eq(mysticalSkills.skillCategory, filters.skillCategory));
      }
      if (filters?.tier) {
        conditions.push(eq(mysticalSkills.tier, filters.tier));
      }
      if (filters?.rarityLevel) {
        conditions.push(eq(mysticalSkills.rarityLevel, filters.rarityLevel));
      }
      if (filters?.isActive !== undefined) {
        conditions.push(eq(mysticalSkills.isActive, filters.isActive));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      return await query.orderBy(mysticalSkills.createdAt);
    } catch (error) {
      console.error('Error fetching mystical skills:', error);
      return [];
    }
  }

  async getSkillsByHouse(houseId: string): Promise<MysticalSkill[]> {
    return await this.getMysticalSkills({ houseId, isActive: true });
  }

  async getSkillsByCategory(category: string): Promise<MysticalSkill[]> {
    return await this.getMysticalSkills({ skillCategory: category, isActive: true });
  }

  async getSkillTree(houseId?: string): Promise<Array<MysticalSkill & { prerequisites: MysticalSkill[]; unlocks: MysticalSkill[] }>> {
    try {
      const filters = houseId ? { houseId, isActive: true } : { isActive: true };
      const skills = await this.getMysticalSkills(filters);
      
      const skillTree = [];
      
      for (const skill of skills) {
        const prerequisites = [];
        const unlocks = [];
        
        // Get prerequisite skills
        if (skill.prerequisiteSkills && skill.prerequisiteSkills.length > 0) {
          for (const prereqId of skill.prerequisiteSkills) {
            const prereqSkill = skills.find(s => s.id === prereqId);
            if (prereqSkill) prerequisites.push(prereqSkill);
          }
        }
        
        // Get skills this unlocks
        if (skill.childSkills && skill.childSkills.length > 0) {
          for (const childId of skill.childSkills) {
            const childSkill = skills.find(s => s.id === childId);
            if (childSkill) unlocks.push(childSkill);
          }
        }
        
        skillTree.push({
          ...skill,
          prerequisites,
          unlocks,
        });
      }
      
      return skillTree;
    } catch (error) {
      console.error('Error fetching skill tree:', error);
      return [];
    }
  }

  async createMysticalSkill(skill: InsertMysticalSkill): Promise<MysticalSkill> {
    try {
      const result = await db.insert(mysticalSkills).values(skill).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating mystical skill:', error);
      throw error;
    }
  }

  async updateMysticalSkill(id: string, skill: Partial<InsertMysticalSkill>): Promise<MysticalSkill | undefined> {
    try {
      const [updated] = await db.update(mysticalSkills)
        .set({ ...skill, updatedAt: new Date() })
        .where(eq(mysticalSkills.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating mystical skill:', error);
      return undefined;
    }
  }

  async deleteMysticalSkill(id: string): Promise<boolean> {
    try {
      await db.delete(mysticalSkills).where(eq(mysticalSkills.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting mystical skill:', error);
      return false;
    }
  }

  // User Learning Progress Tracking  
  async getUserLessonProgress(id: string): Promise<UserLessonProgress | undefined> {
    try {
      const result = await db.select().from(userLessonProgress).where(eq(userLessonProgress.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching user lesson progress:', error);
      return undefined;
    }
  }

  async getUserLessonProgresses(userId: string, filters?: { pathId?: string; status?: string; lessonId?: string }): Promise<UserLessonProgress[]> {
    try {
      let query = db.select().from(userLessonProgress);
      const conditions = [eq(userLessonProgress.userId, userId)];

      if (filters?.pathId) {
        conditions.push(eq(userLessonProgress.pathId, filters.pathId));
      }
      if (filters?.status) {
        conditions.push(eq(userLessonProgress.status, filters.status));
      }
      if (filters?.lessonId) {
        conditions.push(eq(userLessonProgress.lessonId, filters.lessonId));
      }

      query = query.where(and(...conditions));
      return await query.orderBy(desc(userLessonProgress.lastAccessedAt));
    } catch (error) {
      console.error('Error fetching user lesson progresses:', error);
      return [];
    }
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | undefined> {
    try {
      const result = await db.select().from(userLessonProgress)
        .where(and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, lessonId)
        ))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return undefined;
    }
  }

  async createUserLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress> {
    try {
      const result = await db.insert(userLessonProgress).values(progress).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user lesson progress:', error);
      throw error;
    }
  }

  async updateUserLessonProgress(id: string, progress: Partial<InsertUserLessonProgress>): Promise<UserLessonProgress | undefined> {
    try {
      const [updated] = await db.update(userLessonProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(eq(userLessonProgress.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating user lesson progress:', error);
      return undefined;
    }
  }

  async startLesson(userId: string, lessonId: string): Promise<UserLessonProgress> {
    // Check if progress already exists
    const existing = await this.getLessonProgress(userId, lessonId);
    if (existing) {
      return existing;
    }

    const progressData: InsertUserLessonProgress = {
      userId,
      lessonId,
      status: 'in_progress',
      progressPercent: 0,
      currentSection: 1,
      sectionsCompleted: [],
      timeSpentMinutes: 0,
      attempts: 1,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    };

    return await this.createUserLessonProgress(progressData);
  }

  async completeLesson(userId: string, lessonId: string, score: number, timeSpent: number): Promise<UserLessonProgress> {
    const progress = await this.getLessonProgress(userId, lessonId);
    if (!progress) {
      throw new Error('No progress found for this lesson');
    }

    const lesson = await this.getSacredLesson(lessonId);
    const masteryAchieved = lesson ? score >= parseFloat(lesson.masteryThreshold.toString()) : false;

    const updateData = {
      status: masteryAchieved ? 'mastered' : 'completed' as const,
      progressPercent: 100,
      timeSpentMinutes: (progress.timeSpentMinutes || 0) + timeSpent,
      latestScore: score,
      bestScore: Math.max(score, parseFloat(progress.bestScore?.toString() || '0')),
      masteryAchieved,
      completedAt: new Date(),
      experienceAwarded: lesson?.experienceReward || 0,
      karmaAwarded: lesson?.karmaReward || 0,
    };

    const updated = await this.updateUserLessonProgress(progress.id, updateData);
    if (!updated) {
      throw new Error('Failed to update lesson progress');
    }

    return updated;
  }

  async updateLessonProgress(userId: string, lessonId: string, progressData: { 
    progressPercent: number; 
    currentSection: number; 
    timeSpent: number; 
    interactionData?: any 
  }): Promise<UserLessonProgress> {
    const progress = await this.getLessonProgress(userId, lessonId);
    if (!progress) {
      throw new Error('No progress found for this lesson');
    }

    const updateData = {
      progressPercent: progressData.progressPercent,
      currentSection: progressData.currentSection,
      timeSpentMinutes: (progress.timeSpentMinutes || 0) + progressData.timeSpent,
      interactionData: progressData.interactionData,
      lastAccessedAt: new Date(),
    };

    const updated = await this.updateUserLessonProgress(progress.id, updateData);
    if (!updated) {
      throw new Error('Failed to update lesson progress');
    }

    return updated;
  }

  // Placeholder implementations for remaining methods (would need full implementation)
  async getUserSkillUnlock(id: string): Promise<UserSkillUnlock | undefined> { return undefined; }
  async getUserSkillUnlocks(userId: string, filters?: { skillId?: string; masteryLevel?: number }): Promise<UserSkillUnlock[]> { return []; }
  async getUserSkillById(userId: string, skillId: string): Promise<UserSkillUnlock | undefined> { return undefined; }
  async createUserSkillUnlock(unlock: InsertUserSkillUnlock): Promise<UserSkillUnlock> { throw new Error('Not implemented'); }
  async updateUserSkillUnlock(id: string, unlock: Partial<InsertUserSkillUnlock>): Promise<UserSkillUnlock | undefined> { return undefined; }
  async unlockSkill(userId: string, skillId: string, unlockMethod: string): Promise<UserSkillUnlock> { throw new Error('Not implemented'); }
  async upgradeSkillMastery(userId: string, skillId: string, experienceSpent: number): Promise<UserSkillUnlock | undefined> { return undefined; }
  async getUserSkillBonuses(userId: string): Promise<Array<{ skill: MysticalSkill; unlock: UserSkillUnlock; effectiveBonus: number }>> { return []; }
  async checkSkillUnlockEligibility(userId: string, skillId: string): Promise<{ eligible: boolean; requirements: any; missing: any }> { 
    return { eligible: false, requirements: {}, missing: [] }; 
  }

  // Trials of Mastery Management
  async getTrialOfMastery(id: string): Promise<TrialOfMastery | undefined> { return undefined; }
  async getTrialsOfMastery(filters?: { houseId?: string; trialType?: string; difficultyLevel?: string; isActive?: boolean }): Promise<TrialOfMastery[]> { return []; }
  async getTrialsByHouse(houseId: string): Promise<TrialOfMastery[]> { return []; }
  async createTrialOfMastery(trial: InsertTrialOfMastery): Promise<TrialOfMastery> { throw new Error('Not implemented'); }
  async updateTrialOfMastery(id: string, trial: Partial<InsertTrialOfMastery>): Promise<TrialOfMastery | undefined> { return undefined; }
  async deleteTrialOfMastery(id: string): Promise<boolean> { return false; }

  // User Trial Attempts Management
  async getUserTrialAttempt(id: string): Promise<UserTrialAttempt | undefined> { return undefined; }
  async getUserTrialAttempts(userId: string, filters?: { trialId?: string; status?: string; passed?: boolean }): Promise<UserTrialAttempt[]> { return []; }
  async getTrialAttempts(trialId: string, filters?: { status?: string; passed?: boolean }): Promise<UserTrialAttempt[]> { return []; }
  async createUserTrialAttempt(attempt: InsertUserTrialAttempt): Promise<UserTrialAttempt> { throw new Error('Not implemented'); }
  async updateUserTrialAttempt(id: string, attempt: Partial<InsertUserTrialAttempt>): Promise<UserTrialAttempt | undefined> { return undefined; }
  async startTrial(userId: string, trialId: string): Promise<UserTrialAttempt> { throw new Error('Not implemented'); }
  async submitTrialResults(userId: string, trialId: string, attemptId: string, results: { 
    phaseScores: any; 
    overallScore: number; 
    timeSpent: number; 
    responses: any 
  }): Promise<UserTrialAttempt> { throw new Error('Not implemented'); }
  async checkTrialEligibility(userId: string, trialId: string): Promise<{ eligible: boolean; requirements: any; missing: any }> { 
    return { eligible: false, requirements: {}, missing: [] }; 
  }

  // Divine Certifications Management
  async getDivineCertification(id: string): Promise<DivineCertification | undefined> { return undefined; }
  async getDivineCertifications(filters?: { houseId?: string; certificationLevel?: string; category?: string; rarityLevel?: string; isActive?: boolean }): Promise<DivineCertification[]> { return []; }
  async getCertificationsByHouse(houseId: string): Promise<DivineCertification[]> { return []; }
  async createDivineCertification(certification: InsertDivineCertification): Promise<DivineCertification> { throw new Error('Not implemented'); }
  async updateDivineCertification(id: string, certification: Partial<InsertDivineCertification>): Promise<DivineCertification | undefined> { return undefined; }
  async deleteDivineCertification(id: string): Promise<boolean> { return false; }

  // User Certifications Management
  async getUserCertification(id: string): Promise<UserCertification | undefined> { return undefined; }
  async getUserCertifications(userId: string, filters?: { certificationId?: string; status?: string; displayInProfile?: boolean }): Promise<UserCertification[]> { return []; }
  async getCertificationHolders(certificationId: string): Promise<UserCertification[]> { return []; }
  async createUserCertification(certification: InsertUserCertification): Promise<UserCertification> { throw new Error('Not implemented'); }
  async updateUserCertification(id: string, certification: Partial<InsertUserCertification>): Promise<UserCertification | undefined> { return undefined; }
  async awardCertification(userId: string, certificationId: string, achievementMethod: string, verificationData?: any): Promise<UserCertification> { throw new Error('Not implemented'); }
  async revokeCertification(userId: string, certificationId: string, reason: string): Promise<boolean> { return false; }
  async checkCertificationEligibility(userId: string, certificationId: string): Promise<{ eligible: boolean; requirements: any; missing: any }> { 
    return { eligible: false, requirements: {}, missing: [] }; 
  }

  // Learning Analytics Management
  async getLearningAnalytics(userId: string): Promise<LearningAnalytics | undefined> { return undefined; }
  async createLearningAnalytics(analytics: InsertLearningAnalytics): Promise<LearningAnalytics> { throw new Error('Not implemented'); }
  async updateLearningAnalytics(userId: string, analytics: Partial<InsertLearningAnalytics>): Promise<LearningAnalytics | undefined> { return undefined; }
  async recalculateLearningAnalytics(userId: string): Promise<LearningAnalytics> { throw new Error('Not implemented'); }
  async generateLearningRecommendations(userId: string): Promise<{ 
    recommendedPaths: LearningPath[]; 
    suggestedLessons: SacredLesson[]; 
    skillsToUnlock: MysticalSkill[]; 
    interventions: any[] 
  }> { 
    return { recommendedPaths: [], suggestedLessons: [], skillsToUnlock: [], interventions: [] }; 
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
    return {
      totalPaths: 0,
      totalLessons: 0,
      totalSkills: 0,
      averageProgress: 0,
      topPerformers: [],
      engagement: 0,
    };
  }

  async getGlobalLearningStats(): Promise<{
    totalLearners: number;
    totalLessonsCompleted: number;
    totalSkillsUnlocked: number;
    averageTimeToComplete: number;
    houseComparisons: Array<{ houseId: string; avgProgress: number; engagement: number }>;
  }> {
    return {
      totalLearners: 0,
      totalLessonsCompleted: 0,
      totalSkillsUnlocked: 0,
      averageTimeToComplete: 0,
      houseComparisons: [],
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
    const analytics = await this.getLearningAnalytics(userId);
    const recentProgress = await this.getUserLessonProgresses(userId);
    const paths = await this.getLearningPaths({ isActive: true });
    const lessons = await this.getSacredLessons({ isActive: true });
    const skills = await this.getMysticalSkills({ isActive: true });

    return {
      analytics: analytics || {} as LearningAnalytics,
      currentPaths: paths.slice(0, 3),
      recentProgress: recentProgress.slice(0, 5),
      unlockedSkills: [],
      certifications: [],
      recommendations: {
        paths: paths.slice(0, 3),
        lessons: lessons.slice(0, 5),
        skills: skills.slice(0, 3),
      },
      achievements: [],
    };
  }

  // Advanced Learning Features (Placeholder implementations)
  async generatePersonalizedLearningPath(userId: string, preferences: { 
    preferredHouses: string[]; 
    difficultyPreference: string; 
    timeCommitment: number; 
    learningGoals: string[] 
  }): Promise<LearningPath> { throw new Error('Not implemented'); }

  async detectLearningPatterns(userId: string): Promise<{
    learningStyle: string;
    optimalSessionLength: number;
    preferredContentTypes: string[];
    strugglingAreas: string[];
    strengthAreas: string[];
  }> {
    return {
      learningStyle: 'visual',
      optimalSessionLength: 30,
      preferredContentTypes: ['crystal_orb'],
      strugglingAreas: [],
      strengthAreas: [],
    };
  }

  async predictLearningOutcomes(userId: string, pathId: string): Promise<{
    estimatedCompletionTime: number;
    successProbability: number;
    recommendedPrerequisites: LearningPath[];
    riskFactors: string[];
  }> {
    return {
      estimatedCompletionTime: 30,
      successProbability: 0.85,
      recommendedPrerequisites: [],
      riskFactors: [],
    };
  }

  // =============================================
  // PHASE 8: EXTERNAL INTEGRATION METHODS
  // =============================================

  // External Integrations
  async getExternalIntegration(id: string): Promise<ExternalIntegration | undefined> {
    const result = await db.select().from(externalIntegrations).where(eq(externalIntegrations.id, id)).limit(1);
    return result[0];
  }

  async getUserExternalIntegrations(userId: string, filters?: { integrationName?: string; status?: string }): Promise<ExternalIntegration[]> {
    let query = db.select().from(externalIntegrations).where(eq(externalIntegrations.userId, userId));
    
    const conditions = [eq(externalIntegrations.userId, userId)];
    
    if (filters?.integrationName) {
      conditions.push(eq(externalIntegrations.integrationName, filters.integrationName));
    }
    
    if (filters?.status) {
      conditions.push(eq(externalIntegrations.status, filters.status));
    }
    
    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(externalIntegrations.createdAt));
  }

  async createExternalIntegration(integration: InsertExternalIntegration): Promise<ExternalIntegration> {
    const result = await db.insert(externalIntegrations).values(integration).returning();
    return result[0];
  }

  async updateExternalIntegration(id: string, integration: Partial<InsertExternalIntegration>): Promise<ExternalIntegration | undefined> {
    const result = await db.update(externalIntegrations)
      .set({ ...integration, updatedAt: new Date() })
      .where(eq(externalIntegrations.id, id))
      .returning();
    return result[0];
  }

  async deleteExternalIntegration(id: string): Promise<boolean> {
    const result = await db.delete(externalIntegrations).where(eq(externalIntegrations.id, id));
    return result.rowCount > 0;
  }

  // Integration Webhooks
  async getIntegrationWebhook(id: string): Promise<IntegrationWebhook | undefined> {
    const result = await db.select().from(integrationWebhooks).where(eq(integrationWebhooks.id, id)).limit(1);
    return result[0];
  }

  async getIntegrationWebhooks(integrationId: string, filters?: { webhookType?: string; eventType?: string; isActive?: boolean }): Promise<IntegrationWebhook[]> {
    const conditions = [eq(integrationWebhooks.integrationId, integrationId)];
    
    if (filters?.webhookType) {
      conditions.push(eq(integrationWebhooks.webhookType, filters.webhookType));
    }
    
    if (filters?.eventType) {
      conditions.push(eq(integrationWebhooks.eventType, filters.eventType));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(integrationWebhooks.isActive, filters.isActive));
    }

    return await db.select().from(integrationWebhooks)
      .where(and(...conditions))
      .orderBy(desc(integrationWebhooks.createdAt));
  }

  async createIntegrationWebhook(webhook: InsertIntegrationWebhook): Promise<IntegrationWebhook> {
    const result = await db.insert(integrationWebhooks).values(webhook).returning();
    return result[0];
  }

  async updateIntegrationWebhook(id: string, webhook: Partial<InsertIntegrationWebhook>): Promise<IntegrationWebhook | undefined> {
    const result = await db.update(integrationWebhooks)
      .set({ ...webhook, updatedAt: new Date() })
      .where(eq(integrationWebhooks.id, id))
      .returning();
    return result[0];
  }

  async deleteIntegrationWebhook(id: string): Promise<boolean> {
    const result = await db.delete(integrationWebhooks).where(eq(integrationWebhooks.id, id));
    return result.rowCount > 0;
  }

  // Integration Sync Logs
  async getIntegrationSyncLog(id: string): Promise<IntegrationSyncLog | undefined> {
    const result = await db.select().from(integrationSyncLogs).where(eq(integrationSyncLogs.id, id)).limit(1);
    return result[0];
  }

  async getIntegrationSyncLogs(integrationId: string, filters?: { syncType?: string; status?: string; limit?: number }): Promise<IntegrationSyncLog[]> {
    const conditions = [eq(integrationSyncLogs.integrationId, integrationId)];
    
    if (filters?.syncType) {
      conditions.push(eq(integrationSyncLogs.syncType, filters.syncType));
    }
    
    if (filters?.status) {
      conditions.push(eq(integrationSyncLogs.status, filters.status));
    }

    let query = db.select().from(integrationSyncLogs)
      .where(and(...conditions))
      .orderBy(desc(integrationSyncLogs.startedAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async createIntegrationSyncLog(syncLog: InsertIntegrationSyncLog): Promise<IntegrationSyncLog> {
    const result = await db.insert(integrationSyncLogs).values(syncLog).returning();
    return result[0];
  }

  async updateIntegrationSyncLog(id: string, syncLog: Partial<InsertIntegrationSyncLog>): Promise<IntegrationSyncLog | undefined> {
    const result = await db.update(integrationSyncLogs)
      .set(syncLog)
      .where(eq(integrationSyncLogs.id, id))
      .returning();
    return result[0];
  }

  async deleteIntegrationSyncLog(id: string): Promise<boolean> {
    const result = await db.delete(integrationSyncLogs).where(eq(integrationSyncLogs.id, id));
    return result.rowCount > 0;
  }

  // Workflow Automations
  async getWorkflowAutomation(id: string): Promise<WorkflowAutomation | undefined> {
    const result = await db.select().from(workflowAutomations).where(eq(workflowAutomations.id, id)).limit(1);
    return result[0];
  }

  async getUserWorkflowAutomations(userId: string, filters?: { category?: string; isActive?: boolean; ritualType?: string }): Promise<WorkflowAutomation[]> {
    const conditions = [eq(workflowAutomations.userId, userId)];
    
    if (filters?.category) {
      conditions.push(eq(workflowAutomations.category, filters.category));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(workflowAutomations.isActive, filters.isActive));
    }
    
    if (filters?.ritualType) {
      conditions.push(sql`${workflowAutomations.metadata}->>'ritualType' = ${filters.ritualType}`);
    }

    return await db.select().from(workflowAutomations)
      .where(and(...conditions))
      .orderBy(desc(workflowAutomations.createdAt));
  }

  async createWorkflowAutomation(workflow: InsertWorkflowAutomation): Promise<WorkflowAutomation> {
    const result = await db.insert(workflowAutomations).values(workflow).returning();
    return result[0];
  }

  async updateWorkflowAutomation(id: string, workflow: Partial<InsertWorkflowAutomation>): Promise<WorkflowAutomation | undefined> {
    const result = await db.update(workflowAutomations)
      .set({ ...workflow, updatedAt: new Date() })
      .where(eq(workflowAutomations.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkflowAutomation(id: string): Promise<boolean> {
    const result = await db.delete(workflowAutomations).where(eq(workflowAutomations.id, id));
    return result.rowCount > 0;
  }

  // Workflow Executions
  async getWorkflowExecution(id: string): Promise<WorkflowExecution | undefined> {
    const result = await db.select().from(workflowExecutions).where(eq(workflowExecutions.id, id)).limit(1);
    return result[0];
  }

  async getWorkflowExecutions(workflowId: string, filters?: { status?: string; limit?: number }): Promise<WorkflowExecution[]> {
    const conditions = [eq(workflowExecutions.workflowId, workflowId)];
    
    if (filters?.status) {
      conditions.push(eq(workflowExecutions.status, filters.status));
    }

    let query = db.select().from(workflowExecutions)
      .where(and(...conditions))
      .orderBy(desc(workflowExecutions.startedAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution> {
    const result = await db.insert(workflowExecutions).values(execution).returning();
    return result[0];
  }

  async updateWorkflowExecution(id: string, execution: Partial<InsertWorkflowExecution>): Promise<WorkflowExecution | undefined> {
    const result = await db.update(workflowExecutions)
      .set(execution)
      .where(eq(workflowExecutions.id, id))
      .returning();
    return result[0];
  }

  async getUserWorkflowExecutions(userId: string, filters?: { status?: string; limit?: number }): Promise<WorkflowExecution[]> {
    // Join with workflowAutomations to filter by userId
    let query = db.select({
      id: workflowExecutions.id,
      workflowId: workflowExecutions.workflowId,
      executionId: workflowExecutions.executionId,
      status: workflowExecutions.status,
      triggerSource: workflowExecutions.triggerSource,
      triggerData: workflowExecutions.triggerData,
      startedAt: workflowExecutions.startedAt,
      completedAt: workflowExecutions.completedAt,
      durationMs: workflowExecutions.durationMs,
      errorMessage: workflowExecutions.errorMessage,
      stepsCompleted: workflowExecutions.stepsCompleted,
      totalSteps: workflowExecutions.totalSteps,
      outputData: workflowExecutions.outputData,
      createdAt: workflowExecutions.createdAt,
      updatedAt: workflowExecutions.updatedAt,
    }).from(workflowExecutions)
      .innerJoin(workflowAutomations, eq(workflowExecutions.workflowId, workflowAutomations.id))
      .where(eq(workflowAutomations.userId, userId));

    if (filters?.status) {
      query = query.where(and(
        eq(workflowAutomations.userId, userId),
        eq(workflowExecutions.status, filters.status)
      ));
    }

    query = query.orderBy(desc(workflowExecutions.startedAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  // Integration Analytics
  async getIntegrationAnalytics(id: string): Promise<IntegrationAnalytics | undefined> {
    const result = await db.select().from(integrationAnalytics).where(eq(integrationAnalytics.id, id)).limit(1);
    return result[0];
  }

  async getUserIntegrationAnalytics(userId: string, filters?: { timeframe?: string; integrationName?: string }): Promise<IntegrationAnalytics[]> {
    const conditions = [eq(integrationAnalytics.userId, userId)];
    
    if (filters?.timeframe) {
      conditions.push(eq(integrationAnalytics.timeframe, filters.timeframe));
    }
    
    if (filters?.integrationName) {
      conditions.push(eq(integrationAnalytics.integrationName, filters.integrationName));
    }

    return await db.select().from(integrationAnalytics)
      .where(and(...conditions))
      .orderBy(desc(integrationAnalytics.periodStart));
  }

  async createIntegrationAnalytics(analytics: InsertIntegrationAnalytics): Promise<IntegrationAnalytics> {
    const result = await db.insert(integrationAnalytics).values(analytics).returning();
    return result[0];
  }

  async updateIntegrationAnalytics(id: string, analytics: Partial<InsertIntegrationAnalytics>): Promise<IntegrationAnalytics | undefined> {
    const result = await db.update(integrationAnalytics)
      .set({ ...analytics, updatedAt: new Date() })
      .where(eq(integrationAnalytics.id, id))
      .returning();
    return result[0];
  }

  // External User Mappings
  async getExternalUserMapping(id: string): Promise<ExternalUserMapping | undefined> {
    const result = await db.select().from(externalUserMappings).where(eq(externalUserMappings.id, id)).limit(1);
    return result[0];
  }

  async getUserExternalMappings(userId: string, integrationId?: string): Promise<ExternalUserMapping[]> {
    const conditions = [eq(externalUserMappings.userId, userId)];
    
    if (integrationId) {
      conditions.push(eq(externalUserMappings.integrationId, integrationId));
    }

    return await db.select().from(externalUserMappings)
      .where(and(...conditions))
      .orderBy(desc(externalUserMappings.createdAt));
  }

  async getExternalUserMappingByExternalId(integrationId: string, externalUserId: string): Promise<ExternalUserMapping | undefined> {
    const result = await db.select().from(externalUserMappings)
      .where(and(
        eq(externalUserMappings.integrationId, integrationId),
        eq(externalUserMappings.externalUserId, externalUserId)
      ))
      .limit(1);
    return result[0];
  }

  async createExternalUserMapping(mapping: InsertExternalUserMapping): Promise<ExternalUserMapping> {
    const result = await db.insert(externalUserMappings).values(mapping).returning();
    return result[0];
  }

  async updateExternalUserMapping(id: string, mapping: Partial<InsertExternalUserMapping>): Promise<ExternalUserMapping | undefined> {
    const result = await db.update(externalUserMappings)
      .set({ ...mapping, updatedAt: new Date() })
      .where(eq(externalUserMappings.id, id))
      .returning();
    return result[0];
  }

  async deleteExternalUserMapping(id: string): Promise<boolean> {
    const result = await db.delete(externalUserMappings).where(eq(externalUserMappings.id, id));
    return result.rowCount > 0;
  }

  // Integration Health and Monitoring
  async updateIntegrationHealth(integrationId: string, healthStatus: string, errorMessage?: string): Promise<void> {
    await db.update(externalIntegrations)
      .set({ 
        healthStatus, 
        errorMessage, 
        lastHealthCheck: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(externalIntegrations.id, integrationId));
  }

  async getUnhealthyIntegrations(): Promise<ExternalIntegration[]> {
    return await db.select().from(externalIntegrations)
      .where(sql`${externalIntegrations.healthStatus} IN ('unhealthy', 'degraded')`)
      .orderBy(desc(externalIntegrations.lastHealthCheck));
  }

  async getIntegrationUsageStats(integrationId: string, timeframe: string): Promise<{
    totalApiCalls: number;
    successRate: number;
    averageResponseTime: number;
    errorCount: number;
  }> {
    // This would typically aggregate from integration analytics or sync logs
    // For now, return placeholder data
    return {
      totalApiCalls: 0,
      successRate: 1.0,
      averageResponseTime: 250,
      errorCount: 0,
    };
  }

  // Workflow Automation Helpers
  async getActiveWorkflowAutomations(category?: string): Promise<WorkflowAutomation[]> {
    let query = db.select().from(workflowAutomations)
      .where(eq(workflowAutomations.isActive, true));

    if (category) {
      query = query.where(and(
        eq(workflowAutomations.isActive, true),
        eq(workflowAutomations.category, category)
      ));
    }

    return await query.orderBy(desc(workflowAutomations.priority));
  }

  async getScheduledWorkflows(beforeDate?: Date): Promise<WorkflowAutomation[]> {
    const cutoffDate = beforeDate || new Date();
    
    return await db.select().from(workflowAutomations)
      .where(and(
        eq(workflowAutomations.isActive, true),
        sql`${workflowAutomations.nextRunAt} <= ${cutoffDate}`
      ))
      .orderBy(workflowAutomations.nextRunAt);
  }

  async updateWorkflowLastRun(workflowId: string, success: boolean, errorMessage?: string): Promise<void> {
    const updates: any = {
      lastRunAt: new Date(),
      updatedAt: new Date(),
    };

    if (success) {
      updates.lastSuccessfulRunAt = new Date();
      updates.errorMessage = null;
    } else if (errorMessage) {
      updates.errorMessage = errorMessage;
    }

    await db.update(workflowAutomations)
      .set(updates)
      .where(eq(workflowAutomations.id, workflowId));
  }

  async incrementWorkflowStats(workflowId: string, success: boolean, executionTime: number): Promise<void> {
    // Update workflow statistics
    const workflow = await this.getWorkflowAutomation(workflowId);
    if (workflow) {
      const updates: any = {
        totalExecutions: (workflow.totalExecutions || 0) + 1,
        updatedAt: new Date(),
      };

      if (success) {
        updates.successfulExecutions = (workflow.successfulExecutions || 0) + 1;
        updates.averageExecutionTimeMs = Math.round(
          ((workflow.averageExecutionTimeMs || 0) * (workflow.totalExecutions || 0) + executionTime) / 
          ((workflow.totalExecutions || 0) + 1)
        );
      }

      await db.update(workflowAutomations)
        .set(updates)
        .where(eq(workflowAutomations.id, workflowId));
    }
  }

  // =============================================
  // PHASE 1: CORE TRADING FOUNDATION METHODS
  // =============================================

  // IMF Vaulting System Methods
  async createImfVaultSettings(vaultSettings: InsertImfVaultSettings): Promise<ImfVaultSettings> {
    const result = await db.insert(imfVaultSettings).values(vaultSettings).returning();
    return result[0];
  }

  async getImfVaultSettings(assetId: string): Promise<ImfVaultSettings | undefined> {
    const result = await db.select().from(imfVaultSettings)
      .where(eq(imfVaultSettings.assetId, assetId))
      .limit(1);
    return result[0];
  }

  async getAllImfVaultSettings(): Promise<ImfVaultSettings[]> {
    return await db.select().from(imfVaultSettings)
      .orderBy(desc(imfVaultSettings.scarcityMultiplier));
  }

  async updateImfVaultSettings(assetId: string, updates: Partial<ImfVaultSettings>): Promise<ImfVaultSettings> {
    const result = await db.update(imfVaultSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(imfVaultSettings.assetId, assetId))
      .returning();

    if (!result[0]) {
      throw new Error('IMF vault settings not found');
    }

    return result[0];
  }

  async deleteImfVaultSettings(assetId: string): Promise<void> {
    await db.delete(imfVaultSettings).where(eq(imfVaultSettings.assetId, assetId));
  }

  // Trading Firms Methods
  async createTradingFirm(firm: InsertTradingFirm): Promise<TradingFirm> {
    const result = await db.insert(tradingFirms).values(firm).returning();
    return result[0];
  }

  async getTradingFirm(id: string): Promise<TradingFirm | undefined> {
    const result = await db.select().from(tradingFirms)
      .where(eq(tradingFirms.id, id))
      .limit(1);
    return result[0];
  }

  async getTradingFirmByCode(firmCode: string): Promise<TradingFirm | undefined> {
    const result = await db.select().from(tradingFirms)
      .where(eq(tradingFirms.firmCode, firmCode))
      .limit(1);
    return result[0];
  }

  async getTradingFirmsByHouse(houseId: string): Promise<TradingFirm[]> {
    return await db.select().from(tradingFirms)
      .where(eq(tradingFirms.houseId, houseId))
      .orderBy(desc(tradingFirms.totalAssetsUnderManagement));
  }

  async getAllTradingFirms(): Promise<TradingFirm[]> {
    return await db.select().from(tradingFirms)
      .where(eq(tradingFirms.isActive, true))
      .orderBy(desc(tradingFirms.reputation));
  }

  async updateTradingFirm(id: string, updates: Partial<TradingFirm>): Promise<TradingFirm> {
    const result = await db.update(tradingFirms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tradingFirms.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('Trading firm not found');
    }

    return result[0];
  }

  async deleteTradingFirm(id: string): Promise<void> {
    await db.delete(tradingFirms).where(eq(tradingFirms.id, id));
  }

  // Asset Financial Mapping Methods
  async createAssetFinancialMapping(mapping: InsertAssetFinancialMapping): Promise<AssetFinancialMapping> {
    const result = await db.insert(assetFinancialMapping).values(mapping).returning();
    return result[0];
  }

  async getAssetFinancialMapping(assetId: string): Promise<AssetFinancialMapping | undefined> {
    const result = await db.select().from(assetFinancialMapping)
      .where(eq(assetFinancialMapping.assetId, assetId))
      .limit(1);
    return result[0];
  }

  async getAssetFinancialMappingsByType(instrumentType: string): Promise<AssetFinancialMapping[]> {
    return await db.select().from(assetFinancialMapping)
      .where(eq(assetFinancialMapping.instrumentType, instrumentType))
      .orderBy(assetFinancialMapping.assetId);
  }

  async updateAssetFinancialMapping(assetId: string, updates: Partial<AssetFinancialMapping>): Promise<AssetFinancialMapping> {
    const result = await db.update(assetFinancialMapping)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assetFinancialMapping.assetId, assetId))
      .returning();

    if (!result[0]) {
      throw new Error('Asset financial mapping not found');
    }

    return result[0];
  }

  async deleteAssetFinancialMapping(assetId: string): Promise<void> {
    await db.delete(assetFinancialMapping).where(eq(assetFinancialMapping.assetId, assetId));
  }

  // Global Market Hours Methods
  async createGlobalMarketHours(marketHours: InsertGlobalMarketHours): Promise<GlobalMarketHours> {
    const result = await db.insert(globalMarketHours).values(marketHours).returning();
    return result[0];
  }

  async getGlobalMarketHours(marketCode: string): Promise<GlobalMarketHours | undefined> {
    const result = await db.select().from(globalMarketHours)
      .where(eq(globalMarketHours.marketCode, marketCode))
      .limit(1);
    return result[0];
  }

  async getAllGlobalMarketHours(): Promise<GlobalMarketHours[]> {
    return await db.select().from(globalMarketHours)
      .where(eq(globalMarketHours.isActive, true))
      .orderBy(desc(globalMarketHours.influenceWeight));
  }

  async getActiveMarkets(): Promise<GlobalMarketHours[]> {
    return await db.select().from(globalMarketHours)
      .where(and(
        eq(globalMarketHours.isActive, true),
        eq(globalMarketHours.currentStatus, 'open')
      ))
      .orderBy(desc(globalMarketHours.influenceWeight));
  }

  async updateGlobalMarketHours(marketCode: string, updates: Partial<GlobalMarketHours>): Promise<GlobalMarketHours> {
    const result = await db.update(globalMarketHours)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(globalMarketHours.marketCode, marketCode))
      .returning();

    if (!result[0]) {
      throw new Error('Global market hours not found');
    }

    return result[0];
  }

  async deleteGlobalMarketHours(marketCode: string): Promise<void> {
    await db.delete(globalMarketHours).where(eq(globalMarketHours.marketCode, marketCode));
  }

  // Options Chain Methods
  async createOptionsChain(option: InsertOptionsChain): Promise<OptionsChain> {
    const result = await db.insert(optionsChain).values(option).returning();
    return result[0];
  }

  async getOptionsChain(id: string): Promise<OptionsChain | undefined> {
    const result = await db.select().from(optionsChain)
      .where(eq(optionsChain.id, id))
      .limit(1);
    return result[0];
  }

  async getOptionsChainBySymbol(optionSymbol: string): Promise<OptionsChain | undefined> {
    const result = await db.select().from(optionsChain)
      .where(eq(optionsChain.optionSymbol, optionSymbol))
      .limit(1);
    return result[0];
  }

  async getOptionsChainByUnderlying(underlyingAssetId: string): Promise<OptionsChain[]> {
    return await db.select().from(optionsChain)
      .where(and(
        eq(optionsChain.underlyingAssetId, underlyingAssetId),
        eq(optionsChain.isActive, true)
      ))
      .orderBy(optionsChain.expirationDate, optionsChain.strikePrice);
  }

  async getOptionsChainByExpiration(expirationDate: Date): Promise<OptionsChain[]> {
    return await db.select().from(optionsChain)
      .where(and(
        eq(optionsChain.expirationDate, expirationDate),
        eq(optionsChain.isActive, true)
      ))
      .orderBy(optionsChain.underlyingAssetId, optionsChain.strikePrice);
  }

  async updateOptionsChain(id: string, updates: Partial<OptionsChain>): Promise<OptionsChain> {
    const result = await db.update(optionsChain)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(optionsChain.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('Options chain not found');
    }

    return result[0];
  }

  async deleteOptionsChain(id: string): Promise<void> {
    await db.delete(optionsChain).where(eq(optionsChain.id, id));
  }

  // Margin Account Methods
  async createMarginAccount(marginAccount: InsertMarginAccount): Promise<MarginAccount> {
    const result = await db.insert(marginAccounts).values(marginAccount).returning();
    return result[0];
  }

  async getMarginAccount(userId: string, portfolioId: string): Promise<MarginAccount | undefined> {
    const result = await db.select().from(marginAccounts)
      .where(and(
        eq(marginAccounts.userId, userId),
        eq(marginAccounts.portfolioId, portfolioId)
      ))
      .limit(1);
    return result[0];
  }

  async getUserMarginAccounts(userId: string): Promise<MarginAccount[]> {
    return await db.select().from(marginAccounts)
      .where(eq(marginAccounts.userId, userId))
      .orderBy(desc(marginAccounts.buyingPower));
  }

  async updateMarginAccount(userId: string, portfolioId: string, updates: Partial<MarginAccount>): Promise<MarginAccount> {
    const result = await db.update(marginAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(marginAccounts.userId, userId),
        eq(marginAccounts.portfolioId, portfolioId)
      ))
      .returning();

    if (!result[0]) {
      throw new Error('Margin account not found');
    }

    return result[0];
  }

  async deleteMarginAccount(userId: string, portfolioId: string): Promise<void> {
    await db.delete(marginAccounts)
      .where(and(
        eq(marginAccounts.userId, userId),
        eq(marginAccounts.portfolioId, portfolioId)
      ));
  }

  // Short Position Methods
  async createShortPosition(shortPosition: InsertShortPosition): Promise<ShortPosition> {
    const result = await db.insert(shortPositions).values(shortPosition).returning();
    return result[0];
  }

  async getShortPosition(id: string): Promise<ShortPosition | undefined> {
    const result = await db.select().from(shortPositions)
      .where(eq(shortPositions.id, id))
      .limit(1);
    return result[0];
  }

  async getUserShortPositions(userId: string): Promise<ShortPosition[]> {
    return await db.select().from(shortPositions)
      .where(and(
        eq(shortPositions.userId, userId),
        eq(shortPositions.positionStatus, 'open')
      ))
      .orderBy(desc(shortPositions.openedAt));
  }

  async getPortfolioShortPositions(portfolioId: string): Promise<ShortPosition[]> {
    return await db.select().from(shortPositions)
      .where(and(
        eq(shortPositions.portfolioId, portfolioId),
        eq(shortPositions.positionStatus, 'open')
      ))
      .orderBy(desc(shortPositions.openedAt));
  }

  async updateShortPosition(id: string, updates: Partial<ShortPosition>): Promise<ShortPosition> {
    const result = await db.update(shortPositions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(shortPositions.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('Short position not found');
    }

    return result[0];
  }

  async deleteShortPosition(id: string): Promise<void> {
    await db.delete(shortPositions).where(eq(shortPositions.id, id));
  }

  // NPC Trader Methods
  async createNpcTrader(npcTrader: InsertNpcTrader): Promise<NpcTrader> {
    const result = await db.insert(npcTraders).values(npcTrader).returning();
    return result[0];
  }

  async getNpcTrader(id: string): Promise<NpcTrader | undefined> {
    const result = await db.select().from(npcTraders)
      .where(eq(npcTraders.id, id))
      .limit(1);
    return result[0];
  }

  async getNpcTradersByType(traderType: string): Promise<NpcTrader[]> {
    return await db.select().from(npcTraders)
      .where(and(
        eq(npcTraders.traderType, traderType),
        eq(npcTraders.isActive, true)
      ))
      .orderBy(desc(npcTraders.availableCapital));
  }

  async getNpcTradersByFirm(firmId: string): Promise<NpcTrader[]> {
    return await db.select().from(npcTraders)
      .where(and(
        eq(npcTraders.firmId, firmId),
        eq(npcTraders.isActive, true)
      ))
      .orderBy(desc(npcTraders.totalPnL));
  }

  async getActiveNpcTraders(): Promise<NpcTrader[]> {
    return await db.select().from(npcTraders)
      .where(eq(npcTraders.isActive, true))
      .orderBy(desc(npcTraders.influenceOnMarket));
  }

  async updateNpcTrader(id: string, updates: Partial<NpcTrader>): Promise<NpcTrader> {
    const result = await db.update(npcTraders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(npcTraders.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('NPC trader not found');
    }

    return result[0];
  }

  async deleteNpcTrader(id: string): Promise<void> {
    await db.delete(npcTraders).where(eq(npcTraders.id, id));
  }

  // Information Tier Methods
  async createInformationTier(tier: InsertInformationTier): Promise<InformationTier> {
    const result = await db.insert(informationTiers).values(tier).returning();
    return result[0];
  }

  async getInformationTier(tierName: string): Promise<InformationTier | undefined> {
    const result = await db.select().from(informationTiers)
      .where(eq(informationTiers.tierName, tierName))
      .limit(1);
    return result[0];
  }

  async getAllInformationTiers(): Promise<InformationTier[]> {
    return await db.select().from(informationTiers)
      .where(eq(informationTiers.isActive, true))
      .orderBy(informationTiers.tierLevel);
  }

  async updateInformationTier(tierName: string, updates: Partial<InformationTier>): Promise<InformationTier> {
    const result = await db.update(informationTiers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(informationTiers.tierName, tierName))
      .returning();

    if (!result[0]) {
      throw new Error('Information tier not found');
    }

    return result[0];
  }

  async deleteInformationTier(tierName: string): Promise<void> {
    await db.delete(informationTiers).where(eq(informationTiers.tierName, tierName));
  }

  // News Article Methods
  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const result = await db.insert(newsArticles).values(article).returning();
    return result[0];
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles)
      .where(eq(newsArticles.id, id))
      .limit(1);
    return result[0];
  }

  async getNewsArticlesByTier(userTier: 'elite' | 'pro' | 'free', limit?: number): Promise<NewsArticle[]> {
    const now = new Date();
    let condition;

    switch (userTier) {
      case 'elite':
        condition = sql`${newsArticles.eliteReleaseTime} <= ${now}`;
        break;
      case 'pro':
        condition = sql`${newsArticles.proReleaseTime} <= ${now}`;
        break;
      case 'free':
        condition = sql`${newsArticles.freeReleaseTime} <= ${now}`;
        break;
    }

    let query = db.select().from(newsArticles)
      .where(and(
        eq(newsArticles.isActive, true),
        condition
      ))
      .orderBy(desc(newsArticles.publishTime));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  async getNewsArticlesByAsset(assetId: string, limit?: number): Promise<NewsArticle[]> {
    let query = db.select().from(newsArticles)
      .where(and(
        eq(newsArticles.isActive, true),
        sql`${assetId} = ANY(${newsArticles.affectedAssets})`
      ))
      .orderBy(desc(newsArticles.publishTime));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    const result = await db.update(newsArticles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(newsArticles.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('News article not found');
    }

    return result[0];
  }

  async deleteNewsArticle(id: string): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Options Chain Methods for Phase 1 Scheduled Services
  async getAllOptionsChains(): Promise<OptionsChain[]> {
    return await db.select().from(optionsChain)
      .where(eq(optionsChain.isActive, true))
      .orderBy(desc(optionsChain.expirationDate));
  }

  async updateOptionsChain(id: string, updates: Partial<InsertOptionsChain>): Promise<OptionsChain | undefined> {
    const result = await db.update(optionsChain)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(optionsChain.id, id))
      .returning();
    return result[0];
  }

  // Missing methods for Phase1ScheduledServices
  async getAllNpcTraders(): Promise<NpcTrader[]> {
    return await db.select().from(npcTraders)
      .where(eq(npcTraders.isActive, true))
      .orderBy(desc(npcTraders.availableCapital));
  }

  async getNewsArticles(filters?: { category?: string; assetId?: string; limit?: number }): Promise<NewsArticle[]> {
    let query = db.select().from(newsArticles)
      .where(eq(newsArticles.isActive, true))
      .orderBy(desc(newsArticles.publishTime));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  // ============================================================================
  // PHASE 3: ART-DRIVEN PROGRESSION SYSTEM STORAGE METHODS
  // ============================================================================

  // Comic Issue Variant Methods
  async getComicIssueVariant(id: string): Promise<ComicIssueVariant | undefined> {
    const result = await db.select().from(comicIssueVariants)
      .where(eq(comicIssueVariants.id, id))
      .limit(1);
    return result[0];
  }

  async getComicIssueVariants(filters?: { 
    coverType?: string; 
    issueType?: string; 
    primaryHouse?: string; 
    minRarity?: number; 
    maxPrice?: number; 
    search?: string 
  }, limit?: number, offset?: number): Promise<ComicIssueVariant[]> {
    let query = db.select().from(comicIssueVariants);
    
    const conditions = [];
    
    if (filters?.coverType) {
      conditions.push(eq(comicIssueVariants.coverType, filters.coverType));
    }
    
    if (filters?.issueType) {
      conditions.push(eq(comicIssueVariants.issueType, filters.issueType));
    }
    
    if (filters?.primaryHouse) {
      conditions.push(eq(comicIssueVariants.primaryHouse, filters.primaryHouse));
    }
    
    if (filters?.minRarity) {
      conditions.push(sql`${comicIssueVariants.rarity} >= ${filters.minRarity}`);
    }
    
    if (filters?.maxPrice) {
      conditions.push(sql`${comicIssueVariants.baseMarketValue} <= ${filters.maxPrice}`);
    }
    
    if (filters?.search) {
      conditions.push(
        sql`${comicIssueVariants.variantTitle} ILIKE ${`%${filters.search}%`} OR ${comicIssueVariants.coverDescription} ILIKE ${`%${filters.search}%`}`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(comicIssueVariants.rarity), desc(comicIssueVariants.baseMarketValue));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    return await query;
  }

  async createComicIssueVariant(variant: InsertComicIssueVariant): Promise<ComicIssueVariant> {
    const result = await db.insert(comicIssueVariants).values(variant).returning();
    return result[0];
  }

  async updateComicIssueVariant(id: string, variant: Partial<InsertComicIssueVariant>): Promise<ComicIssueVariant | undefined> {
    const result = await db.update(comicIssueVariants)
      .set({ ...variant, updatedAt: new Date() })
      .where(eq(comicIssueVariants.id, id))
      .returning();
    return result[0];
  }

  // User Comic Collection Methods
  async getUserComicCollections(userId: string): Promise<UserComicCollection[]> {
    return await db.select().from(userComicCollection)
      .where(eq(userComicCollection.userId, userId))
      .orderBy(desc(userComicCollection.acquiredAt));
  }

  async getUserComicCollectionByVariant(userId: string, variantId: string): Promise<UserComicCollection | undefined> {
    const result = await db.select().from(userComicCollection)
      .where(and(
        eq(userComicCollection.userId, userId),
        eq(userComicCollection.variantId, variantId)
      ))
      .limit(1);
    return result[0];
  }

  async getUserComicCollectionItem(id: string): Promise<UserComicCollection | undefined> {
    const result = await db.select().from(userComicCollection)
      .where(eq(userComicCollection.id, id))
      .limit(1);
    return result[0];
  }

  async createUserComicCollection(collection: InsertUserComicCollection): Promise<UserComicCollection> {
    const result = await db.insert(userComicCollection).values(collection).returning();
    return result[0];
  }

  async updateUserComicCollection(id: string, collection: Partial<InsertUserComicCollection>): Promise<UserComicCollection | undefined> {
    const result = await db.update(userComicCollection)
      .set(collection)
      .where(eq(userComicCollection.id, id))
      .returning();
    return result[0];
  }

  async deleteUserComicCollection(id: string): Promise<boolean> {
    const result = await db.delete(userComicCollection)
      .where(eq(userComicCollection.id, id))
      .returning();
    return result.length > 0;
  }

  // User Progression Status Methods
  async getUserProgressionStatus(userId: string): Promise<UserProgressionStatus | undefined> {
    const result = await db.select().from(userProgressionStatus)
      .where(eq(userProgressionStatus.userId, userId))
      .limit(1);
    return result[0];
  }

  async createUserProgressionStatus(status: InsertUserProgressionStatus): Promise<UserProgressionStatus> {
    const result = await db.insert(userProgressionStatus).values(status).returning();
    return result[0];
  }

  async updateUserProgressionStatus(id: string, status: Partial<InsertUserProgressionStatus>): Promise<UserProgressionStatus | undefined> {
    const result = await db.update(userProgressionStatus)
      .set({ ...status, lastProgressionUpdate: new Date() })
      .where(eq(userProgressionStatus.id, id))
      .returning();
    return result[0];
  }

  // House Progression Methods
  async getHouseProgressionPaths(houseId?: string): Promise<HouseProgressionPath[]> {
    let query = db.select().from(houseProgressionPaths)
      .where(eq(houseProgressionPaths.isActive, true));
    
    if (houseId) {
      query = query.where(eq(houseProgressionPaths.houseId, houseId));
    }
    
    return await query.orderBy(houseProgressionPaths.levelNumber);
  }

  async getUserHouseProgression(userId: string, houseId?: string): Promise<UserHouseProgression[]> {
    let query = db.select().from(userHouseProgression)
      .where(eq(userHouseProgression.userId, userId));
    
    if (houseId) {
      query = query.where(eq(userHouseProgression.houseId, houseId));
    }
    
    return await query.orderBy(desc(userHouseProgression.currentLevel));
  }

  async createUserHouseProgression(progression: InsertUserHouseProgression): Promise<UserHouseProgression> {
    const result = await db.insert(userHouseProgression).values(progression).returning();
    return result[0];
  }

  async updateUserHouseProgression(id: string, progression: Partial<InsertUserHouseProgression>): Promise<UserHouseProgression | undefined> {
    const result = await db.update(userHouseProgression)
      .set({ ...progression, lastProgressionActivity: new Date(), updatedAt: new Date() })
      .where(eq(userHouseProgression.id, id))
      .returning();
    return result[0];
  }

  // Trading Tool Unlock Methods
  async getUserTradingToolUnlocks(userId: string): Promise<TradingToolUnlock[]> {
    return await db.select().from(tradingToolUnlocks)
      .where(eq(tradingToolUnlocks.userId, userId))
      .orderBy(desc(tradingToolUnlocks.unlockedAt));
  }

  async createTradingToolUnlock(unlock: InsertTradingToolUnlock): Promise<TradingToolUnlock> {
    const result = await db.insert(tradingToolUnlocks).values(unlock).returning();
    return result[0];
  }

  async updateTradingToolUnlock(id: string, unlock: Partial<InsertTradingToolUnlock>): Promise<TradingToolUnlock | undefined> {
    const result = await db.update(tradingToolUnlocks)
      .set({ ...unlock, updatedAt: new Date() })
      .where(eq(tradingToolUnlocks.id, id))
      .returning();
    return result[0];
  }

  // Comic Collection Achievement Methods
  async getComicCollectionAchievements(filters?: { 
    category?: string; 
    tier?: string; 
    isActive?: boolean 
  }): Promise<ComicCollectionAchievement[]> {
    let query = db.select().from(comicCollectionAchievements);
    
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(comicCollectionAchievements.category, filters.category));
    }
    
    if (filters?.tier) {
      conditions.push(eq(comicCollectionAchievements.tier, filters.tier));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(comicCollectionAchievements.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(comicCollectionAchievements.displayOrder);
  }

  async createComicCollectionAchievement(achievement: InsertComicCollectionAchievement): Promise<ComicCollectionAchievement> {
    const result = await db.insert(comicCollectionAchievements).values(achievement).returning();
    return result[0];
  }

  async updateComicCollectionAchievement(id: string, achievement: Partial<InsertComicCollectionAchievement>): Promise<ComicCollectionAchievement | undefined> {
    const result = await db.update(comicCollectionAchievements)
      .set({ ...achievement, updatedAt: new Date() })
      .where(eq(comicCollectionAchievements.id, id))
      .returning();
    return result[0];
  }

  // Collection Challenge Methods
  async getCollectionChallenges(filters?: { 
    isActive?: boolean; 
    challengeType?: string; 
    currentOnly?: boolean 
  }): Promise<CollectionChallenge[]> {
    let query = db.select().from(collectionChallenges);
    
    const conditions = [];
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(collectionChallenges.isActive, filters.isActive));
    }
    
    if (filters?.challengeType) {
      conditions.push(eq(collectionChallenges.challengeType, filters.challengeType));
    }
    
    if (filters?.currentOnly) {
      const now = new Date();
      conditions.push(
        and(
          sql`${collectionChallenges.startDate} <= ${now}`,
          sql`${collectionChallenges.endDate} >= ${now}`
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(collectionChallenges.startDate));
  }

  async getUserChallengeParticipation(userId: string, challengeId?: string): Promise<UserChallengeParticipation[]> {
    let query = db.select().from(userChallengeParticipation)
      .where(eq(userChallengeParticipation.userId, userId));
    
    if (challengeId) {
      query = query.where(eq(userChallengeParticipation.challengeId, challengeId));
    }
    
    return await query.orderBy(desc(userChallengeParticipation.enrolledAt));
  }

  async createUserChallengeParticipation(participation: InsertUserChallengeParticipation): Promise<UserChallengeParticipation> {
    const result = await db.insert(userChallengeParticipation).values(participation).returning();
    return result[0];
  }

  async updateUserChallengeParticipation(id: string, participation: Partial<InsertUserChallengeParticipation>): Promise<UserChallengeParticipation | undefined> {
    const result = await db.update(userChallengeParticipation)
      .set({ ...participation, lastProgressUpdate: new Date(), updatedAt: new Date() })
      .where(eq(userChallengeParticipation.id, id))
      .returning();
    return result[0];
  }

  // Additional Missing Methods for Phase 1 Core Trading Foundation
  async getAllMarginAccounts(): Promise<MarginAccount[]> {
    return await db.select().from(marginAccounts)
      .where(eq(marginAccounts.isActive, true))
      .orderBy(desc(marginAccounts.accountValue));
  }

  // =============================================================================
  // COLLECTOR-GRADE ASSET DISPLAY METHODS
  // =============================================================================

  // Graded Asset Profile Methods
  async createGradedAssetProfile(profileData: InsertGradedAssetProfile): Promise<GradedAssetProfile> {
    const result = await db.insert(gradedAssetProfiles).values(profileData).returning();
    return result[0];
  }

  async getUserGradedAssetProfiles(userId: string, filters?: {
    rarityFilter?: string;
    storageTypeFilter?: string;
    sortBy?: string;
  }): Promise<GradedAssetProfile[]> {
    // CRITICAL SECURITY FIX: Build all conditions in array and combine with and()
    // to ensure userId filter is NEVER lost when applying additional filters
    const conditions = [eq(gradedAssetProfiles.userId, userId)];
    
    if (filters?.rarityFilter) {
      conditions.push(eq(gradedAssetProfiles.rarityTier, filters.rarityFilter));
    }
    
    if (filters?.storageTypeFilter) {
      conditions.push(eq(gradedAssetProfiles.storageType, filters.storageTypeFilter));
    }
    
    // Apply all conditions using and() to maintain proper user isolation
    const query = db.select().from(gradedAssetProfiles)
      .where(and(...conditions));
    
    // Default sort by display priority, then acquisition date
    const sortField = filters?.sortBy === 'grade' ? gradedAssetProfiles.overallGrade 
                    : filters?.sortBy === 'value' ? gradedAssetProfiles.currentMarketValue
                    : gradedAssetProfiles.displayPriority;
    
    return await query.orderBy(desc(sortField), desc(gradedAssetProfiles.acquisitionDate));
  }

  async getGradedAssetProfile(profileId: string, userId?: string): Promise<GradedAssetProfile | undefined> {
    // CRITICAL SECURITY FIX: Add user ownership validation to prevent cross-user access
    const conditions = [eq(gradedAssetProfiles.id, profileId)];
    
    // If userId is provided, ensure the profile belongs to that user
    if (userId) {
      conditions.push(eq(gradedAssetProfiles.userId, userId));
    }
    
    const result = await db.select().from(gradedAssetProfiles)
      .where(and(...conditions));
    return result[0];
  }

  async updateGradedAssetProfile(profileId: string, updates: Partial<InsertGradedAssetProfile>, userId?: string): Promise<GradedAssetProfile | undefined> {
    // CRITICAL SECURITY FIX: Add user ownership validation to prevent unauthorized updates
    const conditions = [eq(gradedAssetProfiles.id, profileId)];
    
    // If userId is provided, ensure the profile belongs to that user
    if (userId) {
      conditions.push(eq(gradedAssetProfiles.userId, userId));
    }
    
    const result = await db.update(gradedAssetProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0];
  }

  async deleteGradedAssetProfile(profileId: string, userId?: string): Promise<boolean> {
    // CRITICAL SECURITY FIX: Add user ownership validation to prevent unauthorized deletions
    const conditions = [eq(gradedAssetProfiles.id, profileId)];
    
    // If userId is provided, ensure the profile belongs to that user
    if (userId) {
      conditions.push(eq(gradedAssetProfiles.userId, userId));
    }
    
    const result = await db.delete(gradedAssetProfiles)
      .where(and(...conditions))
      .returning();
    return result.length > 0;
  }

  // Collection Storage Box Methods
  // CRITICAL SECURITY: This method requires userId to ensure users can only see their own storage boxes
  async getCollectionStorageBoxes(userId: string, filters?: { boxType?: string; sortBy?: string }): Promise<CollectionStorageBox[]> {
    // CRITICAL SECURITY FIX: Build all conditions in array and combine with and()
    // to ensure userId filter is NEVER lost when applying additional filters
    const conditions = [eq(collectionStorageBoxes.userId, userId)];
    
    if (filters?.boxType) {
      conditions.push(eq(collectionStorageBoxes.boxType, filters.boxType));
    }
    
    let query = db.select().from(collectionStorageBoxes)
      .where(and(...conditions));
    
    // Apply sorting
    if (filters?.sortBy === 'name') {
      query = query.orderBy(collectionStorageBoxes.boxName);
    } else {
      query = query.orderBy(desc(collectionStorageBoxes.createdAt));
    }
    
    return await query;
  }

  async createCollectionStorageBox(boxData: InsertCollectionStorageBox): Promise<CollectionStorageBox> {
    const result = await db.insert(collectionStorageBoxes).values(boxData).returning();
    return result[0];
  }

  async updateCollectionStorageBox(boxId: string, updates: Partial<InsertCollectionStorageBox>, userId?: string): Promise<CollectionStorageBox | undefined> {
    // CRITICAL SECURITY FIX: Add user ownership validation to prevent unauthorized updates
    const conditions = [eq(collectionStorageBoxes.id, boxId)];
    
    // If userId is provided, ensure the storage box belongs to that user
    if (userId) {
      conditions.push(eq(collectionStorageBoxes.userId, userId));
    }
    
    const result = await db.update(collectionStorageBoxes)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0];
  }

  // Variant Cover Registry Methods
  async getVariantCoversByAsset(baseAssetId: string): Promise<VariantCoverRegistry[]> {
    return await db.select().from(variantCoverRegistry)
      .where(eq(variantCoverRegistry.baseAssetId, baseAssetId))
      .orderBy(desc(variantCoverRegistry.baseRarityMultiplier));
  }

  async createVariantCover(variantData: InsertVariantCoverRegistry): Promise<VariantCoverRegistry> {
    const result = await db.insert(variantCoverRegistry).values(variantData).returning();
    return result[0];
  }

  async getVariantCover(variantId: string): Promise<VariantCoverRegistry | undefined> {
    const result = await db.select().from(variantCoverRegistry)
      .where(eq(variantCoverRegistry.id, variantId));
    return result[0];
  }

  async searchVariantCovers(criteria: {
    variantType?: string;
    coverArtist?: string;
    publisher?: string;
    minRarity?: string;
    maxPrice?: number;
  }): Promise<VariantCoverRegistry[]> {
    let query = db.select().from(variantCoverRegistry);
    const conditions = [];

    if (criteria.variantType) {
      conditions.push(eq(variantCoverRegistry.variantType, criteria.variantType));
    }
    
    if (criteria.coverArtist) {
      conditions.push(ilike(variantCoverRegistry.coverArtist, `%${criteria.coverArtist}%`));
    }
    
    if (criteria.maxPrice) {
      conditions.push(sql`${variantCoverRegistry.currentPremium} <= ${criteria.maxPrice}`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(variantCoverRegistry.baseRarityMultiplier));
  }

  // Collection Analytics Methods
  async getCollectionAnalytics(userId: string): Promise<{
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
  }> {
    // Get all graded profiles for the user
    const profiles = await this.getUserGradedAssetProfiles(userId);
    
    if (profiles.length === 0) {
      return {
        totalItems: 0,
        totalValue: 0,
        averageGrade: 0,
        gradeDistribution: {},
        rarityDistribution: {},
        houseDistribution: {},
        keyIssuesCount: 0,
        signedCount: 0,
        growthRate: 0,
        topPerformers: []
      };
    }

    // Calculate analytics
    const totalValue = profiles.reduce((sum, profile) => sum + (profile.currentMarketValue || 0), 0);
    const averageGrade = profiles.reduce((sum, profile) => sum + profile.overallGrade, 0) / profiles.length;
    
    // Grade distribution
    const gradeDistribution: { [grade: string]: number } = {};
    profiles.forEach(profile => {
      const gradeRange = Math.floor(profile.overallGrade);
      const key = `${gradeRange}.0-${gradeRange}.9`;
      gradeDistribution[key] = (gradeDistribution[key] || 0) + 1;
    });

    // Rarity distribution
    const rarityDistribution: { [rarity: string]: number } = {};
    profiles.forEach(profile => {
      rarityDistribution[profile.rarityTier] = (rarityDistribution[profile.rarityTier] || 0) + 1;
    });

    // House distribution
    const houseDistribution: { [house: string]: number } = {};
    profiles.forEach(profile => {
      if (profile.houseAffiliation) {
        houseDistribution[profile.houseAffiliation] = (houseDistribution[profile.houseAffiliation] || 0) + 1;
      }
    });

    // Key issues and signed count
    const keyIssuesCount = profiles.filter(p => p.isKeyIssue).length;
    const signedCount = profiles.filter(p => p.isSigned).length;

    // Calculate growth rate (simplified - based on average market value appreciation)
    const totalAcquisitionValue = profiles.reduce((sum, profile) => sum + (profile.acquisitionPrice || 0), 0);
    const growthRate = totalAcquisitionValue > 0 ? ((totalValue - totalAcquisitionValue) / totalAcquisitionValue) * 100 : 0;

    // Top performers (highest value appreciation)
    const topPerformers = profiles
      .filter(p => p.acquisitionPrice && p.currentMarketValue)
      .sort((a, b) => {
        const aAppreciation = (a.currentMarketValue! - a.acquisitionPrice!) / a.acquisitionPrice!;
        const bAppreciation = (b.currentMarketValue! - b.acquisitionPrice!) / b.acquisitionPrice!;
        return bAppreciation - aAppreciation;
      })
      .slice(0, 5);

    return {
      totalItems: profiles.length,
      totalValue,
      averageGrade: Math.round(averageGrade * 10) / 10,
      gradeDistribution,
      rarityDistribution,
      houseDistribution,
      keyIssuesCount,
      signedCount,
      growthRate: Math.round(growthRate * 100) / 100,
      topPerformers
    };
  }

  // ==========================================
  // PHASE 1 CORE TRADING FOUNDATIONS
  // ==========================================

  // Trades - Executed trades with P&L tracking
  async getTrade(id: string): Promise<Trade | undefined> {
    const [trade] = await this.db.select().from(trades).where(eq(trades.id, id)).limit(1);
    return trade;
  }

  async getTrades(userId: string, portfolioId: string, limit?: number): Promise<Trade[]> {
    const query = this.db
      .select()
      .from(trades)
      .where(and(
        eq(trades.userId, userId),
        eq(trades.portfolioId, portfolioId)
      ))
      .orderBy(desc(trades.executedAt));
    
    return limit ? await query.limit(limit) : await query;
  }

  async getTradesByAsset(userId: string, assetId: string, limit?: number): Promise<Trade[]> {
    const query = this.db
      .select()
      .from(trades)
      .where(and(
        eq(trades.userId, userId),
        eq(trades.assetId, assetId)
      ))
      .orderBy(desc(trades.executedAt));
    
    return limit ? await query.limit(limit) : await query;
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const [newTrade] = await this.db.insert(trades).values(trade).returning();
    return newTrade;
  }

  async updateTrade(id: string, trade: Partial<InsertTrade>): Promise<Trade | undefined> {
    const [updated] = await this.db
      .update(trades)
      .set({ ...trade, updatedAt: new Date() })
      .where(eq(trades.id, id))
      .returning();
    return updated;
  }
  
  // Positions - Current open positions with unrealized P&L
  async getPosition(userId: string, portfolioId: string, assetId: string): Promise<Position | undefined> {
    const [position] = await this.db
      .select()
      .from(positions)
      .where(and(
        eq(positions.userId, userId),
        eq(positions.portfolioId, portfolioId),
        eq(positions.assetId, assetId)
      ))
      .limit(1);
    return position;
  }

  async getPositions(userId: string, portfolioId: string): Promise<Position[]> {
    return await this.db
      .select()
      .from(positions)
      .where(and(
        eq(positions.userId, userId),
        eq(positions.portfolioId, portfolioId)
      ))
      .orderBy(desc(positions.currentValue));
  }

  async getPositionById(id: string): Promise<Position | undefined> {
    const [position] = await this.db.select().from(positions).where(eq(positions.id, id)).limit(1);
    return position;
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    const [newPosition] = await this.db.insert(positions).values(position).returning();
    return newPosition;
  }

  async updatePosition(id: string, position: Partial<InsertPosition>): Promise<Position | undefined> {
    const [updated] = await this.db
      .update(positions)
      .set({ ...position, updatedAt: new Date() })
      .where(eq(positions.id, id))
      .returning();
    return updated;
  }

  async deletePosition(id: string): Promise<boolean> {
    const result = await this.db.delete(positions).where(eq(positions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  
  // Balances - User account balances and buying power
  async getBalance(userId: string, portfolioId: string): Promise<Balance | undefined> {
    const [balance] = await this.db
      .select()
      .from(balances)
      .where(and(
        eq(balances.userId, userId),
        eq(balances.portfolioId, portfolioId)
      ))
      .limit(1);
    return balance;
  }

  async getBalanceById(id: string): Promise<Balance | undefined> {
    const [balance] = await this.db.select().from(balances).where(eq(balances.id, id)).limit(1);
    return balance;
  }

  async createBalance(balance: InsertBalance): Promise<Balance> {
    const [newBalance] = await this.db.insert(balances).values(balance).returning();
    return newBalance;
  }

  async updateBalance(id: string, balance: Partial<InsertBalance>): Promise<Balance | undefined> {
    const [updated] = await this.db
      .update(balances)
      .set({ ...balance, updatedAt: new Date() })
      .where(eq(balances.id, id))
      .returning();
    return updated;
  }

  async recalculateBalance(userId: string, portfolioId: string): Promise<Balance | undefined> {
    // Get current positions
    const userPositions = await this.getPositions(userId, portfolioId);
    
    // Calculate total value from positions
    const positionsValue = userPositions.reduce((sum, position) => 
      sum + parseFloat(position.currentValue || '0'), 0
    );
    
    // Get current balance
    const balance = await this.getBalance(userId, portfolioId);
    
    if (balance) {
      const cash = parseFloat(balance.cash);
      const reservedCash = parseFloat(balance.reservedCash || '0');
      const totalValue = cash + positionsValue;
      const buyingPower = cash - reservedCash;
      
      return await this.updateBalance(balance.id, {
        totalValue: totalValue.toString(),
        buyingPower: buyingPower.toString()
      });
    }
    
    return undefined;
  }
  
  // Moral Consequence System Methods
  async createVictim(victim: InsertTradingVictim): Promise<TradingVictim> {
    const [newVictim] = await this.db.insert(tradingVictims).values(victim).returning();
    return newVictim;
  }
  
  async getMoralStanding(userId: string): Promise<MoralStanding | undefined> {
    const [standing] = await this.db
      .select()
      .from(moralStandings)
      .where(eq(moralStandings.userId, userId))
      .limit(1);
    return standing;
  }
  
  async createMoralStanding(moralStanding: InsertMoralStanding): Promise<MoralStanding> {
    const [newStanding] = await this.db.insert(moralStandings).values(moralStanding).returning();
    return newStanding;
  }
  
  async updateMoralStanding(userId: string, updates: Partial<InsertMoralStanding>): Promise<MoralStanding | undefined> {
    const [updated] = await this.db
      .update(moralStandings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(moralStandings.userId, userId))
      .returning();
    return updated;
  }
  
  // Alignment Score Methods for Entry Test
  async getUserAlignmentScore(userId: string): Promise<AlignmentScore | undefined> {
    const [score] = await db
      .select()
      .from(alignmentScores)
      .where(eq(alignmentScores.userId, userId))
      .limit(1);
    return score;
  }
  
  async createAlignmentScore(score: InsertAlignmentScore): Promise<AlignmentScore> {
    const [newScore] = await db.insert(alignmentScores).values(score).returning();
    return newScore;
  }
  
  async updateAlignmentScore(userId: string, updates: Partial<InsertAlignmentScore>): Promise<AlignmentScore | undefined> {
    const [updated] = await db
      .update(alignmentScores)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alignmentScores.userId, userId))
      .returning();
    return updated;
  }
  
  // User Decision Methods for Entry Test
  async recordUserDecision(decision: InsertUserDecision): Promise<UserDecision> {
    const [newDecision] = await db.insert(userDecisions).values(decision).returning();
    return newDecision;
  }
  
  async getUserDecisions(userId: string, filters?: {
    scenarioId?: string;
    sessionId?: string;
    limit?: number;
  }): Promise<UserDecision[]> {
    let query = db
      .select()
      .from(userDecisions)
      .where(eq(userDecisions.userId, userId))
      .$dynamic();
      
    if (filters?.scenarioId) {
      query = query.where(eq(userDecisions.scenarioId, filters.scenarioId));
    }
    
    if (filters?.sessionId) {
      query = query.where(eq(userDecisions.sessionId, filters.sessionId));
    }
    
    if (filters?.limit && filters.limit > 0) {
      query = query.limit(filters.limit);
    }
    
    const decisions = await query.orderBy(desc(userDecisions.timestamp));
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

  // Knowledge Test Methods
  async createKnowledgeTestResult(data: any): Promise<any> {
    const result = await db.insert(knowledgeTestResults).values(data).returning();
    return result[0];
  }

  async getLatestKnowledgeTestResult(userId: string): Promise<any> {
    const result = await db.select()
      .from(knowledgeTestResults)
      .where(eq(knowledgeTestResults.userId, userId))
      .orderBy(desc(knowledgeTestResults.completedAt))
      .limit(1);
    return result[0];
  }

  async createKnowledgeTestResponse(data: any): Promise<any> {
    const result = await db.insert(knowledgeTestResponses).values(data).returning();
    return result[0];
  }

  async getKnowledgeTestResponses(resultId: string): Promise<any[]> {
    return await db.select()
      .from(knowledgeTestResponses)
      .where(eq(knowledgeTestResponses.resultId, resultId));
  }
}

export const databaseStorage = new DatabaseStorage();