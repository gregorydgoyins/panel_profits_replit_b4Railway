import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, desc, ilike, sql, inArray } from 'drizzle-orm';
import {
  assets, marketData, portfolios, holdings, marketInsights, marketIndices,
  marketIndexData, watchlists, watchlistAssets, orders, marketEvents,
  beatTheAIChallenge, beatTheAIPrediction, beatTheAILeaderboard,
  comicGradingPredictions, users, comicSeries, comicIssues, comicCreators, featuredComics,
  // Phase 1 Trading Extensions
  tradingSessions, assetCurrentPrices, tradingLimits
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
  TradingLimit, InsertTradingLimit
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
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
}

export const databaseStorage = new DatabaseStorage();