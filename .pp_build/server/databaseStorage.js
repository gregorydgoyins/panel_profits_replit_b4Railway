"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.databaseStorage = exports.DatabaseStorage = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const drizzle_orm_1 = require("drizzle-orm");
const schema_js_1 = require("@shared/schema.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
exports.db = db;
/**
 * Database Storage Implementation using Drizzle ORM and PostgreSQL
 * Provides persistent storage with vector embedding support
 */
class DatabaseStorage {
    // User management
    async getUser(id) {
        const result = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, id)).limit(1);
        return result[0];
    }
    async getUserByUsername(username) {
        // Note: This method is kept for backward compatibility but email should be used instead
        const result = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.email, username)).limit(1);
        return result[0];
    }
    // (IMPORTANT) this user operation is mandatory for Replit Auth.
    async upsertUser(userData) {
        try {
            // First try to find existing user by id
            if (userData.id) {
                const existingUser = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userData.id)).limit(1);
                if (existingUser[0]) {
                    // Update existing user
                    const [updated] = await db
                        .update(schema_js_1.users)
                        .set({
                        ...userData,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userData.id))
                        .returning();
                    return updated;
                }
            }
            // Check if username already exists
            const existingByUsername = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.username, userData.username)).limit(1);
            if (existingByUsername[0]) {
                // Update existing user by username
                const [updated] = await db
                    .update(schema_js_1.users)
                    .set({
                    ...userData,
                    updatedAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(schema_js_1.users.username, userData.username))
                    .returning();
                return updated;
            }
            // Create new user if neither id nor username exists
            const [newUser] = await db.insert(schema_js_1.users).values(userData).returning();
            return newUser;
        }
        catch (error) {
            // Handle duplicate key constraint violation
            if (error?.code === '23505') {
                // Duplicate key error - try to find and update the existing user
                if (error.constraint === 'users_username_unique') {
                    // Username conflict - update by username
                    const [updated] = await db
                        .update(schema_js_1.users)
                        .set({
                        ...userData,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema_js_1.users.username, userData.username))
                        .returning();
                    return updated;
                }
                else if (error.constraint === 'users_email_unique' && userData.email) {
                    // Email conflict - update by email
                    const [updated] = await db
                        .update(schema_js_1.users)
                        .set({
                        ...userData,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema_js_1.users.email, userData.email))
                        .returning();
                    return updated;
                }
            }
            console.error('Error upserting user:', error);
            throw error;
        }
    }
    async createUser(user) {
        const result = await db.insert(schema_js_1.users).values(user).returning();
        return result[0];
    }
    // Asset management
    async getAsset(id) {
        const result = await db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, id)).limit(1);
        return result[0];
    }
    async getAssetBySymbol(symbol) {
        const result = await db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.symbol, symbol)).limit(1);
        return result[0];
    }
    async getAssets(filters) {
        let query = db.select().from(schema_js_1.assets);
        const conditions = [];
        if (filters?.type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.assets.type, filters.type));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.assets.name} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.assets.symbol} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.assets.description} ILIKE ${`%${filters.search}%`}
        )`);
        }
        if (filters?.publisher) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.assets.metadata}->>'publisher' = ${filters.publisher}`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        // Apply limit with default of 100 to prevent overwhelming the database
        const limit = filters?.limit ?? 100;
        query = query.limit(limit);
        // Apply offset for pagination if provided
        if (filters?.offset) {
            query = query.offset(filters.offset);
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.assets.createdAt));
    }
    async getAssetById(id) {
        const result = await db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, id)).limit(1);
        return result[0];
    }
    async getAssetsByType(type, limit = 100) {
        const result = await db.select()
            .from(schema_js_1.assets)
            .where((0, drizzle_orm_1.eq)(schema_js_1.assets.type, type))
            .limit(limit)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.assets.createdAt));
        return result;
    }
    async createAsset(asset) {
        const result = await db.insert(schema_js_1.assets).values(asset).returning();
        return result[0];
    }
    async updateAsset(id, asset) {
        const result = await db.update(schema_js_1.assets).set(asset).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, id)).returning();
        return result[0];
    }
    async deleteAsset(id) {
        const result = await db.delete(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, id));
        return result.rowCount > 0;
    }
    // Market data
    async getLatestMarketData(assetId, timeframe) {
        let query = db.select().from(schema_js_1.marketData).where((0, drizzle_orm_1.eq)(schema_js_1.marketData.assetId, assetId));
        if (timeframe) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marketData.assetId, assetId), (0, drizzle_orm_1.eq)(schema_js_1.marketData.timeframe, timeframe)));
        }
        const result = await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketData.periodStart)).limit(1);
        return result[0];
    }
    async getMarketDataHistory(assetId, timeframe, limit, from, to) {
        let query = db.select().from(schema_js_1.marketData)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marketData.assetId, assetId), (0, drizzle_orm_1.eq)(schema_js_1.marketData.timeframe, timeframe)));
        if (from && to) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marketData.assetId, assetId), (0, drizzle_orm_1.eq)(schema_js_1.marketData.timeframe, timeframe), (0, drizzle_orm_1.sql) `${schema_js_1.marketData.periodStart} BETWEEN ${from} AND ${to}`));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketData.periodStart));
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    }
    async createMarketData(data) {
        const result = await db.insert(schema_js_1.marketData).values(data).returning();
        return result[0];
    }
    async getBulkLatestMarketData(assetIds, timeframe) {
        let query = db.select().from(schema_js_1.marketData).where((0, drizzle_orm_1.inArray)(schema_js_1.marketData.assetId, assetIds));
        if (timeframe) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_js_1.marketData.assetId, assetIds), (0, drizzle_orm_1.eq)(schema_js_1.marketData.timeframe, timeframe)));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketData.periodStart));
    }
    async createBulkMarketData(marketDataList) {
        if (marketDataList.length === 0)
            return [];
        const result = await db.insert(schema_js_1.marketData).values(marketDataList).returning();
        return result;
    }
    // Price history (graded comic book pricing)
    async createPriceHistory(data) {
        const [result] = await db.insert(schema_js_1.priceHistory).values(data).returning();
        return result;
    }
    async createPriceHistoryBatch(data) {
        if (data.length === 0)
            return [];
        const results = await db.insert(schema_js_1.priceHistory).values(data).returning();
        return results;
    }
    async getPriceHistory(assetId, grade, days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return await db
            .select()
            .from(schema_js_1.priceHistory)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.priceHistory.assetId, assetId), (0, drizzle_orm_1.eq)(schema_js_1.priceHistory.grade, grade), (0, drizzle_orm_1.sql) `${schema_js_1.priceHistory.snapshotDate} >= ${cutoffDate}`))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.priceHistory.snapshotDate));
    }
    async getLatestPricesByGrade(assetId) {
        const latestPrices = await db
            .select()
            .from(schema_js_1.priceHistory)
            .where((0, drizzle_orm_1.eq)(schema_js_1.priceHistory.assetId, assetId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.priceHistory.snapshotDate));
        const gradeMap = new Map();
        for (const price of latestPrices) {
            if (!gradeMap.has(price.grade)) {
                gradeMap.set(price.grade, price);
            }
        }
        return Array.from(gradeMap.values());
    }
    async getPriceTrends(assetId, timeframe) {
        const days = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const prices = await db
            .select()
            .from(schema_js_1.priceHistory)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.priceHistory.assetId, assetId), (0, drizzle_orm_1.sql) `${schema_js_1.priceHistory.snapshotDate} >= ${cutoffDate}`))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.priceHistory.snapshotDate));
        if (prices.length === 0) {
            return {
                assetId,
                timeframe,
                percentChange: 0,
                priceChange: 0,
                high: 0,
                low: 0,
                average: 0,
            };
        }
        const priceValues = prices.map(p => parseFloat(p.price));
        const currentPrice = priceValues[0];
        const oldestPrice = priceValues[priceValues.length - 1];
        const high = Math.max(...priceValues);
        const low = Math.min(...priceValues);
        const average = priceValues.reduce((sum, val) => sum + val, 0) / priceValues.length;
        const priceChange = currentPrice - oldestPrice;
        const percentChange = oldestPrice > 0 ? (priceChange / oldestPrice) * 100 : 0;
        return {
            assetId,
            timeframe,
            percentChange: parseFloat(percentChange.toFixed(2)),
            priceChange: parseFloat(priceChange.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            average: parseFloat(average.toFixed(2)),
        };
    }
    // Portfolio management
    async getPortfolio(id) {
        const result = await db.select().from(schema_js_1.portfolios).where((0, drizzle_orm_1.eq)(schema_js_1.portfolios.id, id)).limit(1);
        return result[0];
    }
    async getUserPortfolios(userId) {
        return await db.select().from(schema_js_1.portfolios).where((0, drizzle_orm_1.eq)(schema_js_1.portfolios.userId, userId)).orderBy((0, drizzle_orm_1.desc)(schema_js_1.portfolios.createdAt));
    }
    async createPortfolio(portfolio) {
        const result = await db.insert(schema_js_1.portfolios).values(portfolio).returning();
        return result[0];
    }
    async updatePortfolio(id, portfolio) {
        const result = await db.update(schema_js_1.portfolios).set(portfolio).where((0, drizzle_orm_1.eq)(schema_js_1.portfolios.id, id)).returning();
        return result[0];
    }
    async deletePortfolio(id) {
        const result = await db.delete(schema_js_1.portfolios).where((0, drizzle_orm_1.eq)(schema_js_1.portfolios.id, id));
        return result.rowCount > 0;
    }
    // Holdings
    async getPortfolioHoldings(portfolioId) {
        return await db.select().from(schema_js_1.holdings).where((0, drizzle_orm_1.eq)(schema_js_1.holdings.portfolioId, portfolioId));
    }
    async getHolding(portfolioId, assetId) {
        const result = await db.select().from(schema_js_1.holdings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.holdings.portfolioId, portfolioId), (0, drizzle_orm_1.eq)(schema_js_1.holdings.assetId, assetId)))
            .limit(1);
        return result[0];
    }
    async createHolding(holding) {
        const result = await db.insert(schema_js_1.holdings).values(holding).returning();
        return result[0];
    }
    async updateHolding(id, holding) {
        const result = await db.update(schema_js_1.holdings).set(holding).where((0, drizzle_orm_1.eq)(schema_js_1.holdings.id, id)).returning();
        return result[0];
    }
    async deleteHolding(id) {
        const result = await db.delete(schema_js_1.holdings).where((0, drizzle_orm_1.eq)(schema_js_1.holdings.id, id));
        return result.rowCount > 0;
    }
    // Market insights
    async getMarketInsights(filters) {
        let query = db.select().from(schema_js_1.marketInsights);
        const conditions = [];
        if (filters?.assetId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.marketInsights.assetId, filters.assetId));
        }
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.marketInsights.category, filters.category));
        }
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.marketInsights.isActive, filters.isActive));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketInsights.createdAt));
    }
    async createMarketInsight(insight) {
        const result = await db.insert(schema_js_1.marketInsights).values(insight).returning();
        return result[0];
    }
    async updateMarketInsight(id, insight) {
        const result = await db.update(schema_js_1.marketInsights).set(insight).where((0, drizzle_orm_1.eq)(schema_js_1.marketInsights.id, id)).returning();
        return result[0];
    }
    // Market indices
    async getMarketIndex(symbol) {
        const result = await db.select().from(schema_js_1.marketIndices).where((0, drizzle_orm_1.eq)(schema_js_1.marketIndices.symbol, symbol)).limit(1);
        return result[0];
    }
    async getMarketIndices() {
        return await db.select().from(schema_js_1.marketIndices).orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketIndices.createdAt));
    }
    async createMarketIndex(index) {
        const result = await db.insert(schema_js_1.marketIndices).values(index).returning();
        return result[0];
    }
    async updateMarketIndex(id, index) {
        const result = await db.update(schema_js_1.marketIndices).set(index).where((0, drizzle_orm_1.eq)(schema_js_1.marketIndices.id, id)).returning();
        return result[0];
    }
    // Market index data
    async getLatestMarketIndexData(indexId, timeframe) {
        let query = db.select().from(schema_js_1.marketIndexData).where((0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.indexId, indexId));
        if (timeframe) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.indexId, indexId), (0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.timeframe, timeframe)));
        }
        const result = await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketIndexData.periodStart)).limit(1);
        return result[0];
    }
    async getMarketIndexDataHistory(indexId, timeframe, limit, from, to) {
        let query = db.select().from(schema_js_1.marketIndexData)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.indexId, indexId), (0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.timeframe, timeframe)));
        if (from && to) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.indexId, indexId), (0, drizzle_orm_1.eq)(schema_js_1.marketIndexData.timeframe, timeframe), (0, drizzle_orm_1.sql) `${schema_js_1.marketIndexData.periodStart} BETWEEN ${from} AND ${to}`));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketIndexData.periodStart));
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    }
    async createMarketIndexData(indexData) {
        const result = await db.insert(schema_js_1.marketIndexData).values(indexData).returning();
        return result[0];
    }
    // Watchlists
    async getUserWatchlists(userId) {
        return await db.select().from(schema_js_1.watchlists).where((0, drizzle_orm_1.eq)(schema_js_1.watchlists.userId, userId)).orderBy((0, drizzle_orm_1.desc)(schema_js_1.watchlists.createdAt));
    }
    async getWatchlistAssets(watchlistId) {
        return await db.select().from(schema_js_1.watchlistAssets).where((0, drizzle_orm_1.eq)(schema_js_1.watchlistAssets.watchlistId, watchlistId));
    }
    async createWatchlist(watchlist) {
        const result = await db.insert(schema_js_1.watchlists).values(watchlist).returning();
        return result[0];
    }
    async addAssetToWatchlist(watchlistAsset) {
        const result = await db.insert(schema_js_1.watchlistAssets).values(watchlistAsset).returning();
        return result[0];
    }
    async removeAssetFromWatchlist(watchlistId, assetId) {
        const result = await db.delete(schema_js_1.watchlistAssets)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.watchlistAssets.watchlistId, watchlistId), (0, drizzle_orm_1.eq)(schema_js_1.watchlistAssets.assetId, assetId)));
        return result.rowCount > 0;
    }
    async deleteWatchlist(id) {
        const result = await db.delete(schema_js_1.watchlists).where((0, drizzle_orm_1.eq)(schema_js_1.watchlists.id, id));
        return result.rowCount > 0;
    }
    // Orders
    async getOrder(id) {
        const result = await db.select().from(schema_js_1.orders).where((0, drizzle_orm_1.eq)(schema_js_1.orders.id, id)).limit(1);
        return result[0];
    }
    async getUserOrders(userId, status) {
        let query = db.select().from(schema_js_1.orders).where((0, drizzle_orm_1.eq)(schema_js_1.orders.userId, userId));
        if (status) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.orders.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.orders.status, status)));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.orders.createdAt));
    }
    async getOrdersByStatus(status) {
        return await db.select().from(schema_js_1.orders)
            .where((0, drizzle_orm_1.eq)(schema_js_1.orders.status, status))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.orders.createdAt));
    }
    async createOrder(order) {
        const result = await db.insert(schema_js_1.orders).values(order).returning();
        return result[0];
    }
    async updateOrder(id, order) {
        const result = await db.update(schema_js_1.orders).set(order).where((0, drizzle_orm_1.eq)(schema_js_1.orders.id, id)).returning();
        return result[0];
    }
    async deleteOrder(id) {
        const result = await db.delete(schema_js_1.orders).where((0, drizzle_orm_1.eq)(schema_js_1.orders.id, id));
        return result.rowCount > 0;
    }
    async cancelOrder(id) {
        const result = await db.update(schema_js_1.orders)
            .set({ status: 'cancelled', updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.orders.id, id))
            .returning();
        return result[0];
    }
    // Market events
    async getMarketEvents(filters) {
        let query = db.select().from(schema_js_1.marketEvents);
        const conditions = [];
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.marketEvents.isActive, filters.isActive));
        }
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.marketEvents.category, filters.category));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketEvents.createdAt));
    }
    async createMarketEvent(event) {
        const result = await db.insert(schema_js_1.marketEvents).values(event).returning();
        return result[0];
    }
    async updateMarketEvent(id, event) {
        const result = await db.update(schema_js_1.marketEvents).set(event).where((0, drizzle_orm_1.eq)(schema_js_1.marketEvents.id, id)).returning();
        return result[0];
    }
    // Beat the AI - Implementation stubs (simplified for this task)
    async getBeatTheAIChallenge(id) {
        const result = await db.select().from(schema_js_1.beatTheAIChallenge).where((0, drizzle_orm_1.eq)(schema_js_1.beatTheAIChallenge.id, id)).limit(1);
        return result[0];
    }
    async getBeatTheAIChallenges(filters) {
        return await db.select().from(schema_js_1.beatTheAIChallenge);
    }
    async createBeatTheAIChallenge(challenge) {
        const result = await db.insert(schema_js_1.beatTheAIChallenge).values(challenge).returning();
        return result[0];
    }
    async updateBeatTheAIChallenge(id, challenge) {
        const result = await db.update(schema_js_1.beatTheAIChallenge).set(challenge).where((0, drizzle_orm_1.eq)(schema_js_1.beatTheAIChallenge.id, id)).returning();
        return result[0];
    }
    async getBeatTheAIPrediction(id) {
        const result = await db.select().from(schema_js_1.beatTheAIPrediction).where((0, drizzle_orm_1.eq)(schema_js_1.beatTheAIPrediction.id, id)).limit(1);
        return result[0];
    }
    async getBeatTheAIPredictions(filters) {
        return await db.select().from(schema_js_1.beatTheAIPrediction);
    }
    async createBeatTheAIPrediction(prediction) {
        const result = await db.insert(schema_js_1.beatTheAIPrediction).values(prediction).returning();
        return result[0];
    }
    async updateBeatTheAIPrediction(id, prediction) {
        const result = await db.update(schema_js_1.beatTheAIPrediction).set(prediction).where((0, drizzle_orm_1.eq)(schema_js_1.beatTheAIPrediction.id, id)).returning();
        return result[0];
    }
    async getBeatTheAILeaderboard(limit) {
        return await db.select().from(schema_js_1.beatTheAILeaderboard);
    }
    async getBeatTheAILeaderboardEntry(userId) {
        const result = await db.select().from(schema_js_1.beatTheAILeaderboard).where((0, drizzle_orm_1.eq)(schema_js_1.beatTheAILeaderboard.userId, userId)).limit(1);
        return result[0];
    }
    async createBeatTheAILeaderboardEntry(entry) {
        const result = await db.insert(schema_js_1.beatTheAILeaderboard).values(entry).returning();
        return result[0];
    }
    async updateBeatTheAILeaderboardEntry(userId, entry) {
        const result = await db.update(schema_js_1.beatTheAILeaderboard).set(entry).where((0, drizzle_orm_1.eq)(schema_js_1.beatTheAILeaderboard.userId, userId)).returning();
        return result[0];
    }
    async recalculateLeaderboard() {
        // Implementation stub
    }
    async getComicGradingPrediction(id) {
        const result = await db.select().from(schema_js_1.comicGradingPredictions).where((0, drizzle_orm_1.eq)(schema_js_1.comicGradingPredictions.id, id)).limit(1);
        return result[0];
    }
    async getComicGradingPredictions(filters) {
        return await db.select().from(schema_js_1.comicGradingPredictions);
    }
    async createComicGradingPrediction(prediction) {
        const result = await db.insert(schema_js_1.comicGradingPredictions).values(prediction).returning();
        return result[0];
    }
    async updateComicGradingPrediction(id, prediction) {
        const result = await db.update(schema_js_1.comicGradingPredictions).set(prediction).where((0, drizzle_orm_1.eq)(schema_js_1.comicGradingPredictions.id, id)).returning();
        return result[0];
    }
    // Vector similarity search operations (simplified implementations for this task)
    async findSimilarAssets(assetId, limit = 10, threshold = 0.7) {
        // Vector similarity search using pgvector
        const result = await db.execute((0, drizzle_orm_1.sql) `
      WITH target AS (
        SELECT metadata_embedding FROM ${schema_js_1.assets} WHERE id = ${assetId}
      )
      SELECT *, 
             (1 - (metadata_embedding <=> target.metadata_embedding)) as similarity_score
      FROM ${schema_js_1.assets}, target
      WHERE metadata_embedding IS NOT NULL
        AND id != ${assetId}
        AND (1 - (metadata_embedding <=> target.metadata_embedding)) > ${threshold}
      ORDER BY metadata_embedding <=> target.metadata_embedding
      LIMIT ${limit}
    `);
        return result.rows;
    }
    async findSimilarAssetsByEmbedding(embedding, limit = 10, threshold = 0.7) {
        const vectorString = `[${embedding.join(',')}]`;
        const result = await db.execute((0, drizzle_orm_1.sql) `
      SELECT *, 
             (1 - (metadata_embedding <=> ${vectorString}::vector)) as similarity_score
      FROM ${schema_js_1.assets}
      WHERE metadata_embedding IS NOT NULL
        AND (1 - (metadata_embedding <=> ${vectorString}::vector)) > ${threshold}
      ORDER BY metadata_embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `);
        return result.rows;
    }
    async updateAssetEmbedding(assetId, embedding) {
        const vectorString = `[${embedding.join(',')}]`;
        const result = await db.update(schema_js_1.assets)
            .set({ metadataEmbedding: (0, drizzle_orm_1.sql) `${vectorString}::vector` })
            .where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, assetId));
        return result.rowCount > 0;
    }
    async getAssetsWithoutEmbeddings(limit = 50) {
        return await db.select().from(schema_js_1.assets)
            .where((0, drizzle_orm_1.sql) `metadata_embedding IS NULL`)
            .limit(limit);
    }
    // Simplified implementations for other vector methods
    async findSimilarComicsByImage() { return []; }
    async findSimilarComicsByImageEmbedding() { return []; }
    async updateComicImageEmbedding() { return true; }
    async getComicGradingsWithoutEmbeddings() { return []; }
    async searchMarketInsightsByContent() { return []; }
    async findSimilarMarketInsights() { return []; }
    async findSimilarMarketInsightsByEmbedding() { return []; }
    async updateMarketInsightEmbedding() { return true; }
    async getMarketInsightsWithoutEmbeddings() { return []; }
    async findSimilarPricePatterns() { return []; }
    async findSimilarPricePatternsByEmbedding() { return []; }
    async updateMarketDataEmbedding() { return true; }
    async getMarketDataWithoutEmbeddings() { return []; }
    async calculateVectorSimilarity() { return 0; }
    async batchUpdateEmbeddings() { return true; }
    async createVectorIndices() { return true; }
    async refreshVectorIndices() { return true; }
    async getVectorIndexStatus() { return []; }
    async searchAssetsWithSimilarity(query, filters, limit = 20) {
        const allAssets = await this.getAssets(filters);
        const queryLower = query.toLowerCase();
        return allAssets.map(asset => {
            let score = 0;
            if (asset.name.toLowerCase().includes(queryLower))
                score += 0.6;
            if (asset.symbol.toLowerCase().includes(queryLower))
                score += 0.4;
            if (asset.description?.toLowerCase().includes(queryLower))
                score += 0.3;
            const metadata = asset.metadata;
            if (metadata?.publisher?.toLowerCase().includes(queryLower))
                score += 0.3;
            if (metadata?.tags?.some(tag => tag.toLowerCase().includes(queryLower)))
                score += 0.2;
            return { ...asset, searchScore: Math.min(score, 0.99) };
        }).filter(a => a.searchScore >= 0.1)
            .sort((a, b) => b.searchScore - a.searchScore)
            .slice(0, limit);
    }
    async getRecommendationsForUser() { return { success: false, userId: '', recommendations: [], count: 0 }; }
    async getPortfolioSimilarAssets() { return { success: false, portfolioId: '', similarAssets: [], count: 0 }; }
    // Comic Series management
    async getComicSeries(id) {
        const result = await db.select().from(schema_js_1.comicSeries).where((0, drizzle_orm_1.eq)(schema_js_1.comicSeries.id, id)).limit(1);
        return result[0];
    }
    async getComicSeriesList(filters) {
        let query = db.select().from(schema_js_1.comicSeries);
        const conditions = [];
        if (filters?.publisher) {
            conditions.push((0, drizzle_orm_1.ilike)(schema_js_1.comicSeries.publisher, `%${filters.publisher}%`));
        }
        if (filters?.year) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicSeries.year, filters.year));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.comicSeries.seriesName} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.comicSeries.description} ILIKE ${`%${filters.search}%`}
        )`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.comicSeries.createdAt));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    async createComicSeries(series) {
        const result = await db.insert(schema_js_1.comicSeries).values(series).returning();
        return result[0];
    }
    async updateComicSeries(id, series) {
        const result = await db.update(schema_js_1.comicSeries).set(series).where((0, drizzle_orm_1.eq)(schema_js_1.comicSeries.id, id)).returning();
        return result[0];
    }
    async deleteComicSeries(id) {
        const result = await db.delete(schema_js_1.comicSeries).where((0, drizzle_orm_1.eq)(schema_js_1.comicSeries.id, id));
        return result.rowCount > 0;
    }
    async createBulkComicSeries(seriesList) {
        if (seriesList.length === 0)
            return [];
        const result = await db.insert(schema_js_1.comicSeries).values(seriesList).returning();
        return result;
    }
    // Comic Issues management
    async getComicIssue(id) {
        const result = await db.select().from(schema_js_1.comicIssues).where((0, drizzle_orm_1.eq)(schema_js_1.comicIssues.id, id)).limit(1);
        return result[0];
    }
    async getComicIssues(filters) {
        let query = db.select().from(schema_js_1.comicIssues);
        const conditions = [];
        if (filters?.seriesId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicIssues.seriesId, filters.seriesId));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.comicIssues.issueTitle} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.comicIssues.issueDescription} ILIKE ${`%${filters.search}%`} OR
          ${schema_js_1.comicIssues.comicName} ILIKE ${`%${filters.search}%`}
        )`);
        }
        if (filters?.writer) {
            conditions.push((0, drizzle_orm_1.ilike)(schema_js_1.comicIssues.writer, `%${filters.writer}%`));
        }
        if (filters?.artist) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.comicIssues.penciler} ILIKE ${`%${filters.artist}%`} OR 
          ${schema_js_1.comicIssues.coverArtist} ILIKE ${`%${filters.artist}%`}
        )`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.comicIssues.createdAt));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    async getComicIssuesBySeriesId(seriesId) {
        return await db.select().from(schema_js_1.comicIssues).where((0, drizzle_orm_1.eq)(schema_js_1.comicIssues.seriesId, seriesId)).orderBy(schema_js_1.comicIssues.issueNumber);
    }
    async createComicIssue(issue) {
        const result = await db.insert(schema_js_1.comicIssues).values(issue).returning();
        return result[0];
    }
    async updateComicIssue(id, issue) {
        const result = await db.update(schema_js_1.comicIssues).set(issue).where((0, drizzle_orm_1.eq)(schema_js_1.comicIssues.id, id)).returning();
        return result[0];
    }
    async deleteComicIssue(id) {
        const result = await db.delete(schema_js_1.comicIssues).where((0, drizzle_orm_1.eq)(schema_js_1.comicIssues.id, id));
        return result.rowCount > 0;
    }
    async createBulkComicIssues(issuesList) {
        if (issuesList.length === 0)
            return [];
        const result = await db.insert(schema_js_1.comicIssues).values(issuesList).returning();
        return result;
    }
    // Comic Creators management
    async getComicCreator(id) {
        const result = await db.select().from(schema_js_1.comicCreators).where((0, drizzle_orm_1.eq)(schema_js_1.comicCreators.id, id)).limit(1);
        return result[0];
    }
    async getComicCreators(filters) {
        let query = db.select().from(schema_js_1.comicCreators);
        const conditions = [];
        if (filters?.role) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicCreators.role, filters.role));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.comicCreators.name} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.comicCreators.biography} ILIKE ${`%${filters.search}%`}
        )`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.comicCreators.marketInfluence));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    async getComicCreatorByName(name) {
        const result = await db.select().from(schema_js_1.comicCreators).where((0, drizzle_orm_1.eq)(schema_js_1.comicCreators.name, name)).limit(1);
        return result[0];
    }
    async createComicCreator(creator) {
        const result = await db.insert(schema_js_1.comicCreators).values(creator).returning();
        return result[0];
    }
    async updateComicCreator(id, creator) {
        const result = await db.update(schema_js_1.comicCreators).set(creator).where((0, drizzle_orm_1.eq)(schema_js_1.comicCreators.id, id)).returning();
        return result[0];
    }
    async deleteComicCreator(id) {
        const result = await db.delete(schema_js_1.comicCreators).where((0, drizzle_orm_1.eq)(schema_js_1.comicCreators.id, id));
        return result.rowCount > 0;
    }
    // Featured Comics management
    async getFeaturedComic(id) {
        const result = await db.select().from(schema_js_1.featuredComics).where((0, drizzle_orm_1.eq)(schema_js_1.featuredComics.id, id)).limit(1);
        return result[0];
    }
    async getFeaturedComics(filters) {
        let query = db.select().from(schema_js_1.featuredComics);
        const conditions = [];
        if (filters?.featureType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.featuredComics.featureType, filters.featureType));
        }
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.featuredComics.isActive, filters.isActive));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy(schema_js_1.featuredComics.displayOrder);
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    async createFeaturedComic(featured) {
        const result = await db.insert(schema_js_1.featuredComics).values(featured).returning();
        return result[0];
    }
    async updateFeaturedComic(id, featured) {
        const result = await db.update(schema_js_1.featuredComics).set(featured).where((0, drizzle_orm_1.eq)(schema_js_1.featuredComics.id, id)).returning();
        return result[0];
    }
    async deleteFeaturedComic(id) {
        const result = await db.delete(schema_js_1.featuredComics).where((0, drizzle_orm_1.eq)(schema_js_1.featuredComics.id, id));
        return result.rowCount > 0;
    }
    // Comic data aggregation for dashboards
    async getComicMetrics() {
        const [seriesCount, issuesCount, creatorsCount] = await Promise.all([
            db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_js_1.comicSeries),
            db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_js_1.comicIssues),
            db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_js_1.comicCreators)
        ]);
        const coversCount = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_js_1.comicSeries)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.comicSeries.featuredCoverUrl} IS NOT NULL OR ${schema_js_1.comicSeries.coversUrl} IS NOT NULL`);
        return {
            totalSeries: seriesCount[0]?.count || 0,
            totalIssues: issuesCount[0]?.count || 0,
            totalCreators: creatorsCount[0]?.count || 0,
            totalCovers: coversCount[0]?.count || 0
        };
    }
    async getFeaturedComicsCount() {
        const result = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_js_1.featuredComics);
        return result[0]?.count || 0;
    }
    async getTrendingComicSeries(limit) {
        let query = db.select().from(schema_js_1.comicSeries)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.comicSeries.featuredCoverUrl} IS NOT NULL OR ${schema_js_1.comicSeries.coversUrl} IS NOT NULL`)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.comicSeries.year));
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    }
    async getFeaturedComicsForHomepage() {
        return this.getFeaturedComics({ isActive: true, limit: 10 });
    }
    // =========================================================================
    // PHASE 1 TRADING EXTENSIONS
    // =========================================================================
    // Trading Sessions
    async getTradingSession(id) {
        const result = await db.select().from(schema_js_1.tradingSessions).where((0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.id, id)).limit(1);
        return result[0];
    }
    async getUserTradingSessions(userId, isActive) {
        let query = db.select().from(schema_js_1.tradingSessions).where((0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.userId, userId));
        if (isActive !== undefined) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.isActive, isActive)));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingSessions.sessionStart));
    }
    async getActiveTradingSession(userId) {
        const result = await db.select().from(schema_js_1.tradingSessions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.isActive, true)))
            .limit(1);
        return result[0];
    }
    async createTradingSession(session) {
        const result = await db.insert(schema_js_1.tradingSessions).values(session).returning();
        return result[0];
    }
    async updateTradingSession(id, session) {
        const result = await db.update(schema_js_1.tradingSessions).set(session).where((0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.id, id)).returning();
        return result[0];
    }
    async endTradingSession(id, endingBalance, sessionStats) {
        const result = await db.update(schema_js_1.tradingSessions)
            .set({
            sessionEnd: new Date(),
            endingBalance,
            isActive: false,
            ...sessionStats
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingSessions.id, id))
            .returning();
        return result[0];
    }
    // Asset Current Prices  
    async getAssetCurrentPrice(assetId) {
        const result = await db.select().from(schema_js_1.assetCurrentPrices).where((0, drizzle_orm_1.eq)(schema_js_1.assetCurrentPrices.assetId, assetId)).limit(1);
        return result[0];
    }
    async getAssetCurrentPrices(assetIds) {
        return await db.select().from(schema_js_1.assetCurrentPrices).where((0, drizzle_orm_1.inArray)(schema_js_1.assetCurrentPrices.assetId, assetIds));
    }
    async getAllAssetCurrentPrices(marketStatus, limit = 1000) {
        let query = db.select().from(schema_js_1.assetCurrentPrices);
        if (marketStatus) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.assetCurrentPrices.marketStatus, marketStatus));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.assetCurrentPrices.updatedAt)).limit(limit);
    }
    async getAssetsWithPrices(limit = 100) {
        const results = await db
            .select({
            asset: schema_js_1.assets,
            price: schema_js_1.assetCurrentPrices
        })
            .from(schema_js_1.assets)
            .innerJoin(schema_js_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_js_1.assets.id, schema_js_1.assetCurrentPrices.assetId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.assetCurrentPrices.updatedAt))
            .limit(limit);
        return results;
    }
    async createAssetCurrentPrice(price) {
        const result = await db.insert(schema_js_1.assetCurrentPrices).values(price).returning();
        return result[0];
    }
    async updateAssetCurrentPrice(assetId, price) {
        const result = await db.update(schema_js_1.assetCurrentPrices)
            .set({ ...price, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.assetCurrentPrices.assetId, assetId))
            .returning();
        return result[0];
    }
    async updateBulkAssetPrices(prices) {
        if (prices.length === 0)
            return [];
        const results = [];
        // Update each price individually since bulk updates with WHERE clauses are complex in Drizzle
        for (const price of prices) {
            if (price.assetId) {
                const result = await this.updateAssetCurrentPrice(price.assetId, price);
                if (result)
                    results.push(result);
            }
        }
        return results;
    }
    // Trading Limits
    async getTradingLimit(id) {
        const result = await db.select().from(schema_js_1.tradingLimits).where((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.id, id)).limit(1);
        return result[0];
    }
    async getUserTradingLimits(userId, isActive) {
        let query = db.select().from(schema_js_1.tradingLimits).where((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.userId, userId));
        if (isActive !== undefined) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.isActive, isActive)));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingLimits.createdAt));
    }
    async getUserTradingLimitsByType(userId, limitType) {
        return await db.select().from(schema_js_1.tradingLimits)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.limitType, limitType)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingLimits.createdAt));
    }
    async createTradingLimit(limit) {
        const result = await db.insert(schema_js_1.tradingLimits).values(limit).returning();
        return result[0];
    }
    async updateTradingLimit(id, limit) {
        const result = await db.update(schema_js_1.tradingLimits)
            .set({ ...limit, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.id, id))
            .returning();
        return result[0];
    }
    async deleteTradingLimit(id) {
        const result = await db.delete(schema_js_1.tradingLimits).where((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.id, id));
        return result.rowCount > 0;
    }
    async checkTradingLimitBreach(userId, limitType, proposedValue, assetId) {
        let query = db.select().from(schema_js_1.tradingLimits)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.limitType, limitType), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.isActive, true)));
        if (assetId) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.limitType, limitType), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.isActive, true), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.assetId, assetId)));
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
    async resetUserTradingLimits(userId, resetPeriod) {
        const result = await db.update(schema_js_1.tradingLimits)
            .set({
            currentUsage: "0.00",
            lastReset: new Date(),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.resetPeriod, resetPeriod), (0, drizzle_orm_1.eq)(schema_js_1.tradingLimits.isActive, true)));
        return result.rowCount > 0;
    }
    // Enhanced User Trading Operations
    async updateUserTradingBalance(userId, amount) {
        const result = await db.update(schema_js_1.users)
            .set({
            virtualTradingBalance: amount,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId))
            .returning();
        return result[0];
    }
    async resetUserDailyLimits(userId) {
        const result = await db.update(schema_js_1.users)
            .set({
            dailyTradingUsed: "0.00",
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId))
            .returning();
        return result[0];
    }
    async getUserDefaultPortfolio(userId) {
        const result = await db.select().from(schema_js_1.portfolios)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.portfolios.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.portfolios.isDefault, true)))
            .limit(1);
        return result[0];
    }
    async createUserDefaultPortfolio(userId, initialCash) {
        const portfolioData = {
            userId,
            name: "Default Trading Portfolio",
            description: "Your primary trading portfolio",
            isDefault: true,
            cashBalance: initialCash,
            initialCashAllocation: initialCash,
            portfolioType: "default"
        };
        const result = await db.insert(schema_js_1.portfolios).values(portfolioData).returning();
        return result[0];
    }
    // Portfolio Cash Management
    async updatePortfolioCashBalance(portfolioId, amount, operation) {
        const portfolio = await this.getPortfolio(portfolioId);
        if (!portfolio)
            return undefined;
        let newBalance;
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
        const result = await db.update(schema_js_1.portfolios)
            .set({
            cashBalance: newBalance,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.portfolios.id, portfolioId))
            .returning();
        return result[0];
    }
    async getPortfolioAvailableCash(portfolioId) {
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
    async getTraderStats(userId) {
        const result = await db.select().from(schema_js_1.traderStats).where((0, drizzle_orm_1.eq)(schema_js_1.traderStats.userId, userId)).limit(1);
        return result[0];
    }
    async getAllTraderStats(filters) {
        let query = db.select().from(schema_js_1.traderStats);
        const conditions = [];
        if (filters?.minTrades) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.traderStats.totalTrades} >= ${filters.minTrades}`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.traderStats.rankPoints));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        if (filters?.offset) {
            query = query.offset(filters.offset);
        }
        return await query;
    }
    async createTraderStats(stats) {
        const result = await db.insert(schema_js_1.traderStats).values(stats).returning();
        return result[0];
    }
    async updateTraderStats(userId, stats) {
        const result = await db.update(schema_js_1.traderStats)
            .set({ ...stats, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.traderStats.userId, userId))
            .returning();
        return result[0];
    }
    async updateTraderStatsFromTrade(userId, tradeData) {
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
        }
        else {
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
    calculateRankPoints(totalPnL, winRate, volume, totalTrades) {
        // Composite scoring algorithm
        const pnlScore = Math.max(0, totalPnL) * 0.4; // 40% weight on profits
        const winRateScore = winRate * 2; // 20% weight (winRate is 0-100, so *2 gives 0-200 points)
        const volumeScore = Math.log10(Math.max(1, volume)) * 100; // 30% weight on volume (log scale)
        const activityScore = Math.min(totalTrades, 1000) * 0.1; // 10% weight on activity
        return pnlScore + winRateScore + volumeScore + activityScore;
    }
    async recalculateAllTraderStats() {
        // This would be a background job that recalculates all stats from orders table
        // For now, we'll implement a basic version
        const allUsers = await db.select({ id: schema_js_1.users.id }).from(schema_js_1.users);
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
                        if (totalPnL > 0)
                            profitableTrades++;
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
    async getTopTradersByMetric(metric, limit) {
        let orderByField;
        switch (metric) {
            case 'totalPnL':
                orderByField = (0, drizzle_orm_1.desc)(schema_js_1.traderStats.totalPnL);
                break;
            case 'winRate':
                orderByField = (0, drizzle_orm_1.desc)(schema_js_1.traderStats.winRate);
                break;
            case 'totalTradingVolume':
                orderByField = (0, drizzle_orm_1.desc)(schema_js_1.traderStats.totalTradingVolume);
                break;
            case 'roiPercentage':
                orderByField = (0, drizzle_orm_1.desc)(schema_js_1.traderStats.roiPercentage);
                break;
        }
        let query = db.select().from(schema_js_1.traderStats).orderBy(orderByField);
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    }
    // Leaderboard Categories
    async getLeaderboardCategory(id) {
        const result = await db.select().from(schema_js_1.leaderboardCategories).where((0, drizzle_orm_1.eq)(schema_js_1.leaderboardCategories.id, id)).limit(1);
        return result[0];
    }
    async getLeaderboardCategories(filters) {
        let query = db.select().from(schema_js_1.leaderboardCategories);
        const conditions = [];
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.leaderboardCategories.isActive, filters.isActive));
        }
        if (filters?.timeframe) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.leaderboardCategories.timeframe, filters.timeframe));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy(schema_js_1.leaderboardCategories.displayOrder);
    }
    async createLeaderboardCategory(category) {
        const result = await db.insert(schema_js_1.leaderboardCategories).values(category).returning();
        return result[0];
    }
    async updateLeaderboardCategory(id, category) {
        const result = await db.update(schema_js_1.leaderboardCategories)
            .set({ ...category, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.leaderboardCategories.id, id))
            .returning();
        return result[0];
    }
    async deleteLeaderboardCategory(id) {
        const result = await db.delete(schema_js_1.leaderboardCategories).where((0, drizzle_orm_1.eq)(schema_js_1.leaderboardCategories.id, id));
        return result.rowCount > 0;
    }
    // Leaderboard Generation and Rankings
    async generateLeaderboard(categoryType, timeframe, limit) {
        // Join trader stats with users and rank them
        const query = (0, drizzle_orm_1.sql) `
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
      ${limit ? (0, drizzle_orm_1.sql) `LIMIT ${limit}` : (0, drizzle_orm_1.sql) ``}
    `;
        const result = await db.execute(query);
        return result.rows;
    }
    async getLeaderboardByCategoryId(categoryId, limit) {
        const category = await this.getLeaderboardCategory(categoryId);
        if (!category)
            return [];
        return await this.generateLeaderboard(category.categoryType, category.timeframe, limit);
    }
    async getUserRankInCategory(userId, categoryType, timeframe) {
        const userStats = await this.getTraderStats(userId);
        if (!userStats)
            return undefined;
        // Get user's rank in this category
        const rankQuery = (0, drizzle_orm_1.sql) `
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
        const totalQuery = (0, drizzle_orm_1.sql) `SELECT COUNT(*) as total FROM trader_stats WHERE total_trades >= 1`;
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
    async updateLeaderboardRankings(categoryType) {
        // Update current rank for all users
        const updateQuery = (0, drizzle_orm_1.sql) `
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
    async getUserAchievement(id) {
        const result = await db.select().from(schema_js_1.userAchievements).where((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.id, id)).limit(1);
        return result[0];
    }
    async getUserAchievements(userId, filters) {
        let query = db.select().from(schema_js_1.userAchievements).where((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.userId, userId));
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.userAchievements.userId, userId)];
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.category, filters.category));
        }
        if (filters?.tier) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.tier, filters.tier));
        }
        if (filters?.isVisible !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.isVisible, filters.isVisible));
        }
        return await db.select().from(schema_js_1.userAchievements)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.userAchievements.unlockedAt));
    }
    async createUserAchievement(achievement) {
        const result = await db.insert(schema_js_1.userAchievements).values(achievement).returning();
        return result[0];
    }
    async updateUserAchievement(id, achievement) {
        const result = await db.update(schema_js_1.userAchievements)
            .set(achievement)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.id, id))
            .returning();
        return result[0];
    }
    async deleteUserAchievement(id) {
        const result = await db.delete(schema_js_1.userAchievements).where((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.id, id));
        return result.rowCount > 0;
    }
    // Achievement Processing
    async checkAndAwardAchievements(userId, context) {
        const userStats = await this.getTraderStats(userId);
        if (!userStats)
            return [];
        const newAchievements = [];
        const achievementDefinitions = this.getAchievementDefinitions();
        for (const def of achievementDefinitions) {
            // Check if user already has this achievement
            const existing = await db.select()
                .from(schema_js_1.userAchievements)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.userAchievements.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.userAchievements.achievementId, def.id)))
                .limit(1);
            if (existing.length > 0)
                continue; // Already has this achievement
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
    getAchievementDefinitions() {
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
    meetsAchievementCriteria(stats, def) {
        if (def.criteria.minTrades && stats.totalTrades < def.criteria.minTrades)
            return false;
        if (def.criteria.minProfit && parseFloat(stats.totalPnL || "0") < def.criteria.minProfit)
            return false;
        if (def.criteria.minVolume && parseFloat(stats.totalTradingVolume || "0") < def.criteria.minVolume)
            return false;
        if (def.criteria.minWinStreak && stats.currentWinningStreak < def.criteria.minWinStreak)
            return false;
        return true;
    }
    async getAvailableAchievements() {
        return this.getAchievementDefinitions();
    }
    async getUserAchievementProgress(userId, achievementId) {
        const userStats = await this.getTraderStats(userId);
        if (!userStats)
            return undefined;
        const def = this.getAchievementDefinitions().find(d => d.id === achievementId);
        if (!def)
            return undefined;
        let current = 0;
        let required = 0;
        if (def.criteria.minTrades) {
            current = userStats.totalTrades;
            required = def.criteria.minTrades;
        }
        else if (def.criteria.minProfit) {
            current = parseFloat(userStats.totalPnL || "0");
            required = def.criteria.minProfit;
        }
        else if (def.criteria.minVolume) {
            current = parseFloat(userStats.totalTradingVolume || "0");
            required = def.criteria.minVolume;
        }
        else if (def.criteria.minWinStreak) {
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
    async getLeaderboardOverview() {
        const [activeTraders, totalStatsQuery, topPerformerQuery, categories] = await Promise.all([
            db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM trader_stats WHERE total_trades >= 1`),
            db.execute((0, drizzle_orm_1.sql) `SELECT SUM(total_trades) as trades, SUM(total_trading_volume::numeric) as volume FROM trader_stats`),
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
    async getTradingActivitySummary(timeframe) {
        let dateFilter;
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
            db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM trader_stats WHERE first_trade_date >= CURRENT_DATE - INTERVAL '30 days'`),
            db.execute((0, drizzle_orm_1.sql) `
        SELECT SUM(total_trades) as trades, 
               SUM(total_trading_volume::numeric) as volume,
               AVG(average_trade_size::numeric) as avg_size
        FROM trader_stats 
        WHERE ${drizzle_orm_1.sql.raw(dateFilter)}
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
    async getEnhancedCharacters(filters) {
        let query = db.select().from(schema_js_1.enhancedCharacters);
        const conditions = [];
        if (filters?.universe && filters.universe !== 'all') {
            conditions.push((0, drizzle_orm_1.ilike)(schema_js_1.enhancedCharacters.universe, `%${filters.universe}%`));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.enhancedCharacters.name} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.enhancedCharacters.creators} @> ${[filters.search]} OR
          ${schema_js_1.enhancedCharacters.specialAbilities} @> ${[filters.search]}
        )`);
        }
        if (filters?.minPowerLevel !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.enhancedCharacters.powerLevel} >= ${filters.minPowerLevel}`);
        }
        if (filters?.maxPowerLevel !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.enhancedCharacters.powerLevel} <= ${filters.maxPowerLevel}`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        // Apply sorting
        switch (filters?.sort) {
            case 'power_level':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedCharacters.powerLevel));
                break;
            case 'battle_win_rate':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedCharacters.battleWinRate));
                break;
            case 'market_value':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedCharacters.marketValue));
                break;
            case 'name':
                query = query.orderBy(schema_js_1.enhancedCharacters.name);
                break;
            default:
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedCharacters.powerLevel));
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
    async getEnhancedCharacter(id) {
        const result = await db.select().from(schema_js_1.enhancedCharacters).where((0, drizzle_orm_1.eq)(schema_js_1.enhancedCharacters.id, id)).limit(1);
        return result[0];
    }
    async getCharactersByUniverse(universe) {
        return await db.select()
            .from(schema_js_1.enhancedCharacters)
            .where((0, drizzle_orm_1.ilike)(schema_js_1.enhancedCharacters.universe, `%${universe}%`))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedCharacters.powerLevel))
            .limit(50);
    }
    // Enhanced Comic Issues - For comic market data and discovery
    async getEnhancedComicIssues(filters) {
        let query = db.select().from(schema_js_1.enhancedComicIssues);
        const conditions = [];
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `(
          ${schema_js_1.enhancedComicIssues.categoryTitle} ILIKE ${`%${filters.search}%`} OR 
          ${schema_js_1.enhancedComicIssues.issueName} ILIKE ${`%${filters.search}%`} OR
          ${schema_js_1.enhancedComicIssues.comicSeries} ILIKE ${`%${filters.search}%`} OR
          ${schema_js_1.enhancedComicIssues.writers} @> ${[filters.search]}
        )`);
        }
        if (filters?.minValue !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.enhancedComicIssues.currentMarketValue} >= ${filters.minValue}`);
        }
        if (filters?.maxValue !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.enhancedComicIssues.currentMarketValue} <= ${filters.maxValue}`);
        }
        if (filters?.minKeyRating !== undefined) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.enhancedComicIssues.keyIssueRating} >= ${filters.minKeyRating}`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        // Apply sorting
        switch (filters?.sort) {
            case 'current_market_value':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedComicIssues.currentMarketValue));
                break;
            case 'key_issue_rating':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedComicIssues.keyIssueRating));
                break;
            case 'rarity_score':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedComicIssues.rarityScore));
                break;
            case 'issue_name':
                query = query.orderBy(schema_js_1.enhancedComicIssues.issueName);
                break;
            default:
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.enhancedComicIssues.currentMarketValue));
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
    async getEnhancedComicIssue(id) {
        const result = await db.select().from(schema_js_1.enhancedComicIssues).where((0, drizzle_orm_1.eq)(schema_js_1.enhancedComicIssues.id, id)).limit(1);
        return result[0];
    }
    // Battle Scenarios - For battle intelligence and outcomes
    async getBattleScenarios(filters) {
        let query = db.select().from(schema_js_1.battleScenarios);
        const conditions = [];
        if (filters?.characterId) {
            conditions.push((0, drizzle_orm_1.sql) `(${schema_js_1.battleScenarios.character1Id} = ${filters.characterId} OR ${schema_js_1.battleScenarios.character2Id} = ${filters.characterId})`);
        }
        if (filters?.battleType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.battleScenarios.battleType, filters.battleType));
        }
        if (filters?.timeframe) {
            switch (filters.timeframe) {
                case '1h':
                    conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.battleScenarios.eventDate} >= NOW() - INTERVAL '1 hour'`);
                    break;
                case '24h':
                    conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.battleScenarios.eventDate} >= NOW() - INTERVAL '24 hours'`);
                    break;
                case '7d':
                    conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.battleScenarios.eventDate} >= NOW() - INTERVAL '7 days'`);
                    break;
                case '30d':
                    conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.battleScenarios.eventDate} >= NOW() - INTERVAL '30 days'`);
                    break;
            }
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.battleScenarios.eventDate));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        if (filters?.offset) {
            query = query.offset(filters.offset);
        }
        return await query;
    }
    async getBattleIntelligenceSummary() {
        // Get recent battles with character names
        const recentBattlesQuery = await db.execute((0, drizzle_orm_1.sql) `
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
        const statsQuery = await db.execute((0, drizzle_orm_1.sql) `
      SELECT 
        COUNT(*) as total_battles,
        AVG(market_impact_percent::numeric) as avg_market_impact
      FROM battle_scenarios
      WHERE event_date >= NOW() - INTERVAL '30 days'
    `);
        const recentBattles = recentBattlesQuery.rows.map((row) => ({
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
    async getMoviePerformanceData(filters) {
        let query = db.select().from(schema_js_1.moviePerformanceData);
        const conditions = [];
        if (filters?.franchise && filters.franchise !== 'all') {
            conditions.push((0, drizzle_orm_1.ilike)(schema_js_1.moviePerformanceData.franchise, `%${filters.franchise}%`));
        }
        if (filters?.characterFamily) {
            conditions.push((0, drizzle_orm_1.ilike)(schema_js_1.moviePerformanceData.characterFamily, `%${filters.characterFamily}%`));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        // Apply sorting
        switch (filters?.sort) {
            case 'worldwide_gross':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.moviePerformanceData.worldwideGross));
                break;
            case 'impact_score':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.moviePerformanceData.marketImpactScore));
                break;
            case 'rotten_tomatoes_score':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.moviePerformanceData.rottenTomatoesScore));
                break;
            case 'release_date':
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.moviePerformanceData.releaseDate));
                break;
            default:
                query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.moviePerformanceData.marketImpactScore));
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
    async getMoviePerformanceItem(id) {
        const result = await db.select().from(schema_js_1.moviePerformanceData).where((0, drizzle_orm_1.eq)(schema_js_1.moviePerformanceData.id, id)).limit(1);
        return result[0];
    }
    async getTopMoviesByImpact(limit = 10) {
        return await db.select()
            .from(schema_js_1.moviePerformanceData)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.moviePerformanceData.marketImpactScore))
            .limit(limit);
    }
    // MYTHOLOGICAL HOUSES SYSTEM METHODS
    async getHouseMembers(houseId) {
        return await db.select()
            .from(schema_js_1.users)
            .where((0, drizzle_orm_1.eq)(schema_js_1.users.currentHouse, houseId));
    }
    async getHouseMemberCount(houseId) {
        const result = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_js_1.users)
            .where((0, drizzle_orm_1.eq)(schema_js_1.users.currentHouse, houseId));
        return result[0]?.count || 0;
    }
    async getHouseTopTraders(houseId, limit = 10) {
        const result = await db.select({
            id: schema_js_1.users.id,
            email: schema_js_1.users.email,
            firstName: schema_js_1.users.firstName,
            lastName: schema_js_1.users.lastName,
            username: schema_js_1.users.username,
            currentHouse: schema_js_1.users.currentHouse,
            karma: schema_js_1.users.karma,
            tradingBalance: schema_js_1.users.tradingBalance,
            createdAt: schema_js_1.users.createdAt,
            updatedAt: schema_js_1.users.updatedAt
        })
            .from(schema_js_1.users)
            .where((0, drizzle_orm_1.eq)(schema_js_1.users.currentHouse, houseId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.users.karma))
            .limit(limit);
        return result.map((user, index) => ({
            ...user,
            rank: index + 1
        }));
    }
    async getUserHouseRank(userId, houseId) {
        const user = await this.getUser(userId);
        if (!user || user.currentHouse !== houseId) {
            return undefined;
        }
        const [rankResult, totalResult] = await Promise.all([
            db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(schema_js_1.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.users.currentHouse, houseId), (0, drizzle_orm_1.sql) `${schema_js_1.users.karma} > ${user.karma}`)),
            this.getHouseMemberCount(houseId)
        ]);
        return {
            rank: (rankResult[0]?.count || 0) + 1,
            totalMembers: totalResult
        };
    }
    async getUserKarma(userId) {
        const user = await this.getUser(userId);
        return user?.karma || 0;
    }
    async recordKarmaAction(userId, action, karmaChange, reason) {
        try {
            // Update user karma
            await db.update(schema_js_1.users)
                .set({
                karma: (0, drizzle_orm_1.sql) `${schema_js_1.users.karma} + ${karmaChange}`,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId));
            // Note: We could also create a karma_actions table here for logging
            // For now, just return success
            return true;
        }
        catch (error) {
            console.error('Error recording karma action:', error);
            return false;
        }
    }
    async updateUser(id, updates) {
        try {
            const [updated] = await db.update(schema_js_1.users)
                .set({ ...updates, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_js_1.users.id, id))
                .returning();
            return updated;
        }
        catch (error) {
            console.error('Error updating user:', error);
            return undefined;
        }
    }
    // ========================================================================================
    // COMPREHENSIVE LEARNING SYSTEM IMPLEMENTATION
    // ========================================================================================
    // Learning Paths Management
    async getLearningPath(id) {
        try {
            const result = await db.select().from(schema_js_1.learningPaths).where((0, drizzle_orm_1.eq)(schema_js_1.learningPaths.id, id)).limit(1);
            return result[0];
        }
        catch (error) {
            console.error('Error fetching learning path:', error);
            return undefined;
        }
    }
    async getLearningPaths(filters) {
        try {
            let query = db.select().from(schema_js_1.learningPaths);
            const conditions = [];
            if (filters?.houseId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.learningPaths.houseId, filters.houseId));
            }
            if (filters?.difficultyLevel) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.learningPaths.difficultyLevel, filters.difficultyLevel));
            }
            if (filters?.isActive !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.learningPaths.isActive, filters.isActive));
            }
            if (conditions.length > 0) {
                query = query.where((0, drizzle_orm_1.and)(...conditions));
            }
            return await query.orderBy(schema_js_1.learningPaths.displayOrder, schema_js_1.learningPaths.createdAt);
        }
        catch (error) {
            console.error('Error fetching learning paths:', error);
            return [];
        }
    }
    async getLearningPathsByHouse(houseId) {
        return await this.getLearningPaths({ houseId, isActive: true });
    }
    async createLearningPath(path) {
        try {
            const result = await db.insert(schema_js_1.learningPaths).values(path).returning();
            return result[0];
        }
        catch (error) {
            console.error('Error creating learning path:', error);
            throw error;
        }
    }
    async updateLearningPath(id, path) {
        try {
            const [updated] = await db.update(schema_js_1.learningPaths)
                .set({ ...path, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_js_1.learningPaths.id, id))
                .returning();
            return updated;
        }
        catch (error) {
            console.error('Error updating learning path:', error);
            return undefined;
        }
    }
    async deleteLearningPath(id) {
        try {
            await db.delete(schema_js_1.learningPaths).where((0, drizzle_orm_1.eq)(schema_js_1.learningPaths.id, id));
            return true;
        }
        catch (error) {
            console.error('Error deleting learning path:', error);
            return false;
        }
    }
    // Sacred Lessons Management
    async getSacredLesson(id) {
        try {
            const result = await db.select().from(schema_js_1.sacredLessons).where((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.id, id)).limit(1);
            return result[0];
        }
        catch (error) {
            console.error('Error fetching sacred lesson:', error);
            return undefined;
        }
    }
    async getSacredLessons(filters) {
        try {
            let query = db.select().from(schema_js_1.sacredLessons);
            const conditions = [];
            if (filters?.houseId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.houseId, filters.houseId));
            }
            if (filters?.pathId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.pathId, filters.pathId));
            }
            if (filters?.lessonType) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.lessonType, filters.lessonType));
            }
            if (filters?.difficultyLevel) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.difficultyLevel, filters.difficultyLevel));
            }
            if (filters?.isActive !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.isActive, filters.isActive));
            }
            if (conditions.length > 0) {
                query = query.where((0, drizzle_orm_1.and)(...conditions));
            }
            return await query.orderBy(schema_js_1.sacredLessons.createdAt);
        }
        catch (error) {
            console.error('Error fetching sacred lessons:', error);
            return [];
        }
    }
    async getLessonsByPath(pathId) {
        return await this.getSacredLessons({ pathId, isActive: true });
    }
    async getLessonsByHouse(houseId) {
        return await this.getSacredLessons({ houseId, isActive: true });
    }
    async createSacredLesson(lesson) {
        try {
            const result = await db.insert(schema_js_1.sacredLessons).values(lesson).returning();
            return result[0];
        }
        catch (error) {
            console.error('Error creating sacred lesson:', error);
            throw error;
        }
    }
    async updateSacredLesson(id, lesson) {
        try {
            const [updated] = await db.update(schema_js_1.sacredLessons)
                .set({ ...lesson, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.id, id))
                .returning();
            return updated;
        }
        catch (error) {
            console.error('Error updating sacred lesson:', error);
            return undefined;
        }
    }
    async deleteSacredLesson(id) {
        try {
            await db.delete(schema_js_1.sacredLessons).where((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.id, id));
            return true;
        }
        catch (error) {
            console.error('Error deleting sacred lesson:', error);
            return false;
        }
    }
    async searchLessons(searchTerm, filters) {
        try {
            let query = db.select().from(schema_js_1.sacredLessons);
            const conditions = [
                (0, drizzle_orm_1.sql) `(
          ${schema_js_1.sacredLessons.title} ILIKE ${`%${searchTerm}%`} OR 
          ${schema_js_1.sacredLessons.description} ILIKE ${`%${searchTerm}%`} OR 
          ${schema_js_1.sacredLessons.sacredTitle} ILIKE ${`%${searchTerm}%`}
        )`
            ];
            if (filters?.houseId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.houseId, filters.houseId));
            }
            if (filters?.difficultyLevel) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.difficultyLevel, filters.difficultyLevel));
            }
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.sacredLessons.isActive, true));
            query = query.where((0, drizzle_orm_1.and)(...conditions));
            return await query.orderBy(schema_js_1.sacredLessons.createdAt);
        }
        catch (error) {
            console.error('Error searching lessons:', error);
            return [];
        }
    }
    // Mystical Skills Management
    async getMysticalSkill(id) {
        try {
            const result = await db.select().from(schema_js_1.mysticalSkills).where((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.id, id)).limit(1);
            return result[0];
        }
        catch (error) {
            console.error('Error fetching mystical skill:', error);
            return undefined;
        }
    }
    async getMysticalSkills(filters) {
        try {
            let query = db.select().from(schema_js_1.mysticalSkills);
            const conditions = [];
            if (filters?.houseId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.houseId, filters.houseId));
            }
            if (filters?.skillCategory) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.skillCategory, filters.skillCategory));
            }
            if (filters?.tier) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.tier, filters.tier));
            }
            if (filters?.rarityLevel) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.rarityLevel, filters.rarityLevel));
            }
            if (filters?.isActive !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.isActive, filters.isActive));
            }
            if (conditions.length > 0) {
                query = query.where((0, drizzle_orm_1.and)(...conditions));
            }
            return await query.orderBy(schema_js_1.mysticalSkills.createdAt);
        }
        catch (error) {
            console.error('Error fetching mystical skills:', error);
            return [];
        }
    }
    async getSkillsByHouse(houseId) {
        return await this.getMysticalSkills({ houseId, isActive: true });
    }
    async getSkillsByCategory(category) {
        return await this.getMysticalSkills({ skillCategory: category, isActive: true });
    }
    async getSkillTree(houseId) {
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
                        if (prereqSkill)
                            prerequisites.push(prereqSkill);
                    }
                }
                // Get skills this unlocks
                if (skill.childSkills && skill.childSkills.length > 0) {
                    for (const childId of skill.childSkills) {
                        const childSkill = skills.find(s => s.id === childId);
                        if (childSkill)
                            unlocks.push(childSkill);
                    }
                }
                skillTree.push({
                    ...skill,
                    prerequisites,
                    unlocks,
                });
            }
            return skillTree;
        }
        catch (error) {
            console.error('Error fetching skill tree:', error);
            return [];
        }
    }
    async createMysticalSkill(skill) {
        try {
            const result = await db.insert(schema_js_1.mysticalSkills).values(skill).returning();
            return result[0];
        }
        catch (error) {
            console.error('Error creating mystical skill:', error);
            throw error;
        }
    }
    async updateMysticalSkill(id, skill) {
        try {
            const [updated] = await db.update(schema_js_1.mysticalSkills)
                .set({ ...skill, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.id, id))
                .returning();
            return updated;
        }
        catch (error) {
            console.error('Error updating mystical skill:', error);
            return undefined;
        }
    }
    async deleteMysticalSkill(id) {
        try {
            await db.delete(schema_js_1.mysticalSkills).where((0, drizzle_orm_1.eq)(schema_js_1.mysticalSkills.id, id));
            return true;
        }
        catch (error) {
            console.error('Error deleting mystical skill:', error);
            return false;
        }
    }
    // User Learning Progress Tracking  
    async getUserLessonProgress(id) {
        try {
            const result = await db.select().from(schema_js_1.userLessonProgress).where((0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.id, id)).limit(1);
            return result[0];
        }
        catch (error) {
            console.error('Error fetching user lesson progress:', error);
            return undefined;
        }
    }
    async getUserLessonProgresses(userId, filters) {
        try {
            let query = db.select().from(schema_js_1.userLessonProgress);
            const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.userId, userId)];
            if (filters?.pathId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.pathId, filters.pathId));
            }
            if (filters?.status) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.status, filters.status));
            }
            if (filters?.lessonId) {
                conditions.push((0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.lessonId, filters.lessonId));
            }
            query = query.where((0, drizzle_orm_1.and)(...conditions));
            return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.userLessonProgress.lastAccessedAt));
        }
        catch (error) {
            console.error('Error fetching user lesson progresses:', error);
            return [];
        }
    }
    async getLessonProgress(userId, lessonId) {
        try {
            const result = await db.select().from(schema_js_1.userLessonProgress)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.lessonId, lessonId)))
                .limit(1);
            return result[0];
        }
        catch (error) {
            console.error('Error fetching lesson progress:', error);
            return undefined;
        }
    }
    async createUserLessonProgress(progress) {
        try {
            const result = await db.insert(schema_js_1.userLessonProgress).values(progress).returning();
            return result[0];
        }
        catch (error) {
            console.error('Error creating user lesson progress:', error);
            throw error;
        }
    }
    async updateUserLessonProgress(id, progress) {
        try {
            const [updated] = await db.update(schema_js_1.userLessonProgress)
                .set({ ...progress, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_js_1.userLessonProgress.id, id))
                .returning();
            return updated;
        }
        catch (error) {
            console.error('Error updating user lesson progress:', error);
            return undefined;
        }
    }
    async startLesson(userId, lessonId) {
        // Check if progress already exists
        const existing = await this.getLessonProgress(userId, lessonId);
        if (existing) {
            return existing;
        }
        const progressData = {
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
    async completeLesson(userId, lessonId, score, timeSpent) {
        const progress = await this.getLessonProgress(userId, lessonId);
        if (!progress) {
            throw new Error('No progress found for this lesson');
        }
        const lesson = await this.getSacredLesson(lessonId);
        const masteryAchieved = lesson ? score >= parseFloat(lesson.masteryThreshold.toString()) : false;
        const updateData = {
            status: masteryAchieved ? 'mastered' : 'completed',
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
    async updateLessonProgress(userId, lessonId, progressData) {
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
    async getUserSkillUnlock(id) { return undefined; }
    async getUserSkillUnlocks(userId, filters) { return []; }
    async getUserSkillById(userId, skillId) { return undefined; }
    async createUserSkillUnlock(unlock) { throw new Error('Not implemented'); }
    async updateUserSkillUnlock(id, unlock) { return undefined; }
    async unlockSkill(userId, skillId, unlockMethod) { throw new Error('Not implemented'); }
    async upgradeSkillMastery(userId, skillId, experienceSpent) { return undefined; }
    async getUserSkillBonuses(userId) { return []; }
    async checkSkillUnlockEligibility(userId, skillId) {
        return { eligible: false, requirements: {}, missing: [] };
    }
    // Trials of Mastery Management
    async getTrialOfMastery(id) { return undefined; }
    async getTrialsOfMastery(filters) { return []; }
    async getTrialsByHouse(houseId) { return []; }
    async createTrialOfMastery(trial) { throw new Error('Not implemented'); }
    async updateTrialOfMastery(id, trial) { return undefined; }
    async deleteTrialOfMastery(id) { return false; }
    // User Trial Attempts Management
    async getUserTrialAttempt(id) { return undefined; }
    async getUserTrialAttempts(userId, filters) { return []; }
    async getTrialAttempts(trialId, filters) { return []; }
    async createUserTrialAttempt(attempt) { throw new Error('Not implemented'); }
    async updateUserTrialAttempt(id, attempt) { return undefined; }
    async startTrial(userId, trialId) { throw new Error('Not implemented'); }
    async submitTrialResults(userId, trialId, attemptId, results) { throw new Error('Not implemented'); }
    async checkTrialEligibility(userId, trialId) {
        return { eligible: false, requirements: {}, missing: [] };
    }
    // Divine Certifications Management
    async getDivineCertification(id) { return undefined; }
    async getDivineCertifications(filters) { return []; }
    async getCertificationsByHouse(houseId) { return []; }
    async createDivineCertification(certification) { throw new Error('Not implemented'); }
    async updateDivineCertification(id, certification) { return undefined; }
    async deleteDivineCertification(id) { return false; }
    // User Certifications Management
    async getUserCertification(id) { return undefined; }
    async getUserCertifications(userId, filters) { return []; }
    async getCertificationHolders(certificationId) { return []; }
    async createUserCertification(certification) { throw new Error('Not implemented'); }
    async updateUserCertification(id, certification) { return undefined; }
    async awardCertification(userId, certificationId, achievementMethod, verificationData) { throw new Error('Not implemented'); }
    async revokeCertification(userId, certificationId, reason) { return false; }
    async checkCertificationEligibility(userId, certificationId) {
        return { eligible: false, requirements: {}, missing: [] };
    }
    // Learning Analytics Management
    async getLearningAnalytics(userId) { return undefined; }
    async createLearningAnalytics(analytics) { throw new Error('Not implemented'); }
    async updateLearningAnalytics(userId, analytics) { return undefined; }
    async recalculateLearningAnalytics(userId) { throw new Error('Not implemented'); }
    async generateLearningRecommendations(userId) {
        return { recommendedPaths: [], suggestedLessons: [], skillsToUnlock: [], interventions: [] };
    }
    // Learning System Analytics and Insights
    async getHouseLearningStats(houseId) {
        return {
            totalPaths: 0,
            totalLessons: 0,
            totalSkills: 0,
            averageProgress: 0,
            topPerformers: [],
            engagement: 0,
        };
    }
    async getGlobalLearningStats() {
        return {
            totalLearners: 0,
            totalLessonsCompleted: 0,
            totalSkillsUnlocked: 0,
            averageTimeToComplete: 0,
            houseComparisons: [],
        };
    }
    async getUserLearningDashboard(userId) {
        const analytics = await this.getLearningAnalytics(userId);
        const recentProgress = await this.getUserLessonProgresses(userId);
        const paths = await this.getLearningPaths({ isActive: true });
        const lessons = await this.getSacredLessons({ isActive: true });
        const skills = await this.getMysticalSkills({ isActive: true });
        return {
            analytics: analytics || {},
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
    async generatePersonalizedLearningPath(userId, preferences) { throw new Error('Not implemented'); }
    async detectLearningPatterns(userId) {
        return {
            learningStyle: 'visual',
            optimalSessionLength: 30,
            preferredContentTypes: ['crystal_orb'],
            strugglingAreas: [],
            strengthAreas: [],
        };
    }
    async predictLearningOutcomes(userId, pathId) {
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
    async getExternalIntegration(id) {
        const result = await db.select().from(schema_js_1.externalIntegrations).where((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.id, id)).limit(1);
        return result[0];
    }
    async getUserExternalIntegrations(userId, filters) {
        let query = db.select().from(schema_js_1.externalIntegrations).where((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.userId, userId));
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.userId, userId)];
        if (filters?.integrationName) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.integrationName, filters.integrationName));
        }
        if (filters?.status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.status, filters.status));
        }
        if (conditions.length > 1) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.externalIntegrations.createdAt));
    }
    async createExternalIntegration(integration) {
        const result = await db.insert(schema_js_1.externalIntegrations).values(integration).returning();
        return result[0];
    }
    async updateExternalIntegration(id, integration) {
        const result = await db.update(schema_js_1.externalIntegrations)
            .set({ ...integration, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.id, id))
            .returning();
        return result[0];
    }
    async deleteExternalIntegration(id) {
        const result = await db.delete(schema_js_1.externalIntegrations).where((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.id, id));
        return result.rowCount > 0;
    }
    // Integration Webhooks
    async getIntegrationWebhook(id) {
        const result = await db.select().from(schema_js_1.integrationWebhooks).where((0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.id, id)).limit(1);
        return result[0];
    }
    async getIntegrationWebhooks(integrationId, filters) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.integrationId, integrationId)];
        if (filters?.webhookType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.webhookType, filters.webhookType));
        }
        if (filters?.eventType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.eventType, filters.eventType));
        }
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.isActive, filters.isActive));
        }
        return await db.select().from(schema_js_1.integrationWebhooks)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.integrationWebhooks.createdAt));
    }
    async createIntegrationWebhook(webhook) {
        const result = await db.insert(schema_js_1.integrationWebhooks).values(webhook).returning();
        return result[0];
    }
    async updateIntegrationWebhook(id, webhook) {
        const result = await db.update(schema_js_1.integrationWebhooks)
            .set({ ...webhook, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.id, id))
            .returning();
        return result[0];
    }
    async deleteIntegrationWebhook(id) {
        const result = await db.delete(schema_js_1.integrationWebhooks).where((0, drizzle_orm_1.eq)(schema_js_1.integrationWebhooks.id, id));
        return result.rowCount > 0;
    }
    // Integration Sync Logs
    async getIntegrationSyncLog(id) {
        const result = await db.select().from(schema_js_1.integrationSyncLogs).where((0, drizzle_orm_1.eq)(schema_js_1.integrationSyncLogs.id, id)).limit(1);
        return result[0];
    }
    async getIntegrationSyncLogs(integrationId, filters) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.integrationSyncLogs.integrationId, integrationId)];
        if (filters?.syncType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationSyncLogs.syncType, filters.syncType));
        }
        if (filters?.status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationSyncLogs.status, filters.status));
        }
        let query = db.select().from(schema_js_1.integrationSyncLogs)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.integrationSyncLogs.startedAt));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    async createIntegrationSyncLog(syncLog) {
        const result = await db.insert(schema_js_1.integrationSyncLogs).values(syncLog).returning();
        return result[0];
    }
    async updateIntegrationSyncLog(id, syncLog) {
        const result = await db.update(schema_js_1.integrationSyncLogs)
            .set(syncLog)
            .where((0, drizzle_orm_1.eq)(schema_js_1.integrationSyncLogs.id, id))
            .returning();
        return result[0];
    }
    async deleteIntegrationSyncLog(id) {
        const result = await db.delete(schema_js_1.integrationSyncLogs).where((0, drizzle_orm_1.eq)(schema_js_1.integrationSyncLogs.id, id));
        return result.rowCount > 0;
    }
    // Workflow Automations
    async getWorkflowAutomation(id) {
        const result = await db.select().from(schema_js_1.workflowAutomations).where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.id, id)).limit(1);
        return result[0];
    }
    async getUserWorkflowAutomations(userId, filters) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.userId, userId)];
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.category, filters.category));
        }
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.isActive, filters.isActive));
        }
        if (filters?.ritualType) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.workflowAutomations.metadata}->>'ritualType' = ${filters.ritualType}`);
        }
        return await db.select().from(schema_js_1.workflowAutomations)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.workflowAutomations.createdAt));
    }
    async createWorkflowAutomation(workflow) {
        const result = await db.insert(schema_js_1.workflowAutomations).values(workflow).returning();
        return result[0];
    }
    async updateWorkflowAutomation(id, workflow) {
        const result = await db.update(schema_js_1.workflowAutomations)
            .set({ ...workflow, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.id, id))
            .returning();
        return result[0];
    }
    async deleteWorkflowAutomation(id) {
        const result = await db.delete(schema_js_1.workflowAutomations).where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.id, id));
        return result.rowCount > 0;
    }
    // Workflow Executions
    async getWorkflowExecution(id) {
        const result = await db.select().from(schema_js_1.workflowExecutions).where((0, drizzle_orm_1.eq)(schema_js_1.workflowExecutions.id, id)).limit(1);
        return result[0];
    }
    async getWorkflowExecutions(workflowId, filters) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.workflowExecutions.workflowId, workflowId)];
        if (filters?.status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.workflowExecutions.status, filters.status));
        }
        let query = db.select().from(schema_js_1.workflowExecutions)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.workflowExecutions.startedAt));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    async createWorkflowExecution(execution) {
        const result = await db.insert(schema_js_1.workflowExecutions).values(execution).returning();
        return result[0];
    }
    async updateWorkflowExecution(id, execution) {
        const result = await db.update(schema_js_1.workflowExecutions)
            .set(execution)
            .where((0, drizzle_orm_1.eq)(schema_js_1.workflowExecutions.id, id))
            .returning();
        return result[0];
    }
    async getUserWorkflowExecutions(userId, filters) {
        // Join with workflowAutomations to filter by userId
        let query = db.select({
            id: schema_js_1.workflowExecutions.id,
            workflowId: schema_js_1.workflowExecutions.workflowId,
            executionId: schema_js_1.workflowExecutions.executionId,
            status: schema_js_1.workflowExecutions.status,
            triggerSource: schema_js_1.workflowExecutions.triggerSource,
            triggerData: schema_js_1.workflowExecutions.triggerData,
            startedAt: schema_js_1.workflowExecutions.startedAt,
            completedAt: schema_js_1.workflowExecutions.completedAt,
            durationMs: schema_js_1.workflowExecutions.durationMs,
            errorMessage: schema_js_1.workflowExecutions.errorMessage,
            stepsCompleted: schema_js_1.workflowExecutions.stepsCompleted,
            totalSteps: schema_js_1.workflowExecutions.totalSteps,
            outputData: schema_js_1.workflowExecutions.outputData,
            createdAt: schema_js_1.workflowExecutions.createdAt,
            updatedAt: schema_js_1.workflowExecutions.updatedAt,
        }).from(schema_js_1.workflowExecutions)
            .innerJoin(schema_js_1.workflowAutomations, (0, drizzle_orm_1.eq)(schema_js_1.workflowExecutions.workflowId, schema_js_1.workflowAutomations.id))
            .where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.userId, userId));
        if (filters?.status) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.workflowExecutions.status, filters.status)));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.workflowExecutions.startedAt));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    // Integration Analytics
    async getIntegrationAnalytics(id) {
        const result = await db.select().from(schema_js_1.integrationAnalytics).where((0, drizzle_orm_1.eq)(schema_js_1.integrationAnalytics.id, id)).limit(1);
        return result[0];
    }
    async getUserIntegrationAnalytics(userId, filters) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.integrationAnalytics.userId, userId)];
        if (filters?.timeframe) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationAnalytics.timeframe, filters.timeframe));
        }
        if (filters?.integrationName) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.integrationAnalytics.integrationName, filters.integrationName));
        }
        return await db.select().from(schema_js_1.integrationAnalytics)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.integrationAnalytics.periodStart));
    }
    async createIntegrationAnalytics(analytics) {
        const result = await db.insert(schema_js_1.integrationAnalytics).values(analytics).returning();
        return result[0];
    }
    async updateIntegrationAnalytics(id, analytics) {
        const result = await db.update(schema_js_1.integrationAnalytics)
            .set({ ...analytics, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.integrationAnalytics.id, id))
            .returning();
        return result[0];
    }
    // External User Mappings
    async getExternalUserMapping(id) {
        const result = await db.select().from(schema_js_1.externalUserMappings).where((0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.id, id)).limit(1);
        return result[0];
    }
    async getUserExternalMappings(userId, integrationId) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.userId, userId)];
        if (integrationId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.integrationId, integrationId));
        }
        return await db.select().from(schema_js_1.externalUserMappings)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.externalUserMappings.createdAt));
    }
    async getExternalUserMappingByExternalId(integrationId, externalUserId) {
        const result = await db.select().from(schema_js_1.externalUserMappings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.integrationId, integrationId), (0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.externalUserId, externalUserId)))
            .limit(1);
        return result[0];
    }
    async createExternalUserMapping(mapping) {
        const result = await db.insert(schema_js_1.externalUserMappings).values(mapping).returning();
        return result[0];
    }
    async updateExternalUserMapping(id, mapping) {
        const result = await db.update(schema_js_1.externalUserMappings)
            .set({ ...mapping, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.id, id))
            .returning();
        return result[0];
    }
    async deleteExternalUserMapping(id) {
        const result = await db.delete(schema_js_1.externalUserMappings).where((0, drizzle_orm_1.eq)(schema_js_1.externalUserMappings.id, id));
        return result.rowCount > 0;
    }
    // Integration Health and Monitoring
    async updateIntegrationHealth(integrationId, healthStatus, errorMessage) {
        await db.update(schema_js_1.externalIntegrations)
            .set({
            healthStatus,
            errorMessage,
            lastHealthCheck: new Date(),
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.externalIntegrations.id, integrationId));
    }
    async getUnhealthyIntegrations() {
        return await db.select().from(schema_js_1.externalIntegrations)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.externalIntegrations.healthStatus} IN ('unhealthy', 'degraded')`)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.externalIntegrations.lastHealthCheck));
    }
    async getIntegrationUsageStats(integrationId, timeframe) {
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
    async getActiveWorkflowAutomations(category) {
        let query = db.select().from(schema_js_1.workflowAutomations)
            .where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.isActive, true));
        if (category) {
            query = query.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.isActive, true), (0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.category, category)));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.workflowAutomations.priority));
    }
    async getScheduledWorkflows(beforeDate) {
        const cutoffDate = beforeDate || new Date();
        return await db.select().from(schema_js_1.workflowAutomations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.isActive, true), (0, drizzle_orm_1.sql) `${schema_js_1.workflowAutomations.nextRunAt} <= ${cutoffDate}`))
            .orderBy(schema_js_1.workflowAutomations.nextRunAt);
    }
    async updateWorkflowLastRun(workflowId, success, errorMessage) {
        const updates = {
            lastRunAt: new Date(),
            updatedAt: new Date(),
        };
        if (success) {
            updates.lastSuccessfulRunAt = new Date();
            updates.errorMessage = null;
        }
        else if (errorMessage) {
            updates.errorMessage = errorMessage;
        }
        await db.update(schema_js_1.workflowAutomations)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.id, workflowId));
    }
    async incrementWorkflowStats(workflowId, success, executionTime) {
        // Update workflow statistics
        const workflow = await this.getWorkflowAutomation(workflowId);
        if (workflow) {
            const updates = {
                totalExecutions: (workflow.totalExecutions || 0) + 1,
                updatedAt: new Date(),
            };
            if (success) {
                updates.successfulExecutions = (workflow.successfulExecutions || 0) + 1;
                updates.averageExecutionTimeMs = Math.round(((workflow.averageExecutionTimeMs || 0) * (workflow.totalExecutions || 0) + executionTime) /
                    ((workflow.totalExecutions || 0) + 1));
            }
            await db.update(schema_js_1.workflowAutomations)
                .set(updates)
                .where((0, drizzle_orm_1.eq)(schema_js_1.workflowAutomations.id, workflowId));
        }
    }
    // =============================================
    // PHASE 1: CORE TRADING FOUNDATION METHODS
    // =============================================
    // IMF Vaulting System Methods
    async createImfVaultSettings(vaultSettings) {
        const result = await db.insert(schema_js_1.imfVaultSettings).values(vaultSettings).returning();
        return result[0];
    }
    async getImfVaultSettings(assetId) {
        const result = await db.select().from(schema_js_1.imfVaultSettings)
            .where((0, drizzle_orm_1.eq)(schema_js_1.imfVaultSettings.assetId, assetId))
            .limit(1);
        return result[0];
    }
    async getAllImfVaultSettings() {
        return await db.select().from(schema_js_1.imfVaultSettings)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.imfVaultSettings.scarcityMultiplier));
    }
    async updateImfVaultSettings(assetId, updates) {
        const result = await db.update(schema_js_1.imfVaultSettings)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.imfVaultSettings.assetId, assetId))
            .returning();
        if (!result[0]) {
            throw new Error('IMF vault settings not found');
        }
        return result[0];
    }
    async deleteImfVaultSettings(assetId) {
        await db.delete(schema_js_1.imfVaultSettings).where((0, drizzle_orm_1.eq)(schema_js_1.imfVaultSettings.assetId, assetId));
    }
    // Trading Firms Methods
    async createTradingFirm(firm) {
        const result = await db.insert(schema_js_1.tradingFirms).values(firm).returning();
        return result[0];
    }
    async getTradingFirm(id) {
        const result = await db.select().from(schema_js_1.tradingFirms)
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingFirms.id, id))
            .limit(1);
        return result[0];
    }
    async getTradingFirmByCode(firmCode) {
        const result = await db.select().from(schema_js_1.tradingFirms)
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingFirms.firmCode, firmCode))
            .limit(1);
        return result[0];
    }
    async getTradingFirmsByHouse(houseId) {
        return await db.select().from(schema_js_1.tradingFirms)
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingFirms.houseId, houseId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingFirms.totalAssetsUnderManagement));
    }
    async getAllTradingFirms() {
        return await db.select().from(schema_js_1.tradingFirms)
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingFirms.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingFirms.reputation));
    }
    async updateTradingFirm(id, updates) {
        const result = await db.update(schema_js_1.tradingFirms)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingFirms.id, id))
            .returning();
        if (!result[0]) {
            throw new Error('Trading firm not found');
        }
        return result[0];
    }
    async deleteTradingFirm(id) {
        await db.delete(schema_js_1.tradingFirms).where((0, drizzle_orm_1.eq)(schema_js_1.tradingFirms.id, id));
    }
    // Asset Financial Mapping Methods
    async createAssetFinancialMapping(mapping) {
        const result = await db.insert(schema_js_1.assetFinancialMapping).values(mapping).returning();
        return result[0];
    }
    async getAssetFinancialMapping(assetId) {
        const result = await db.select().from(schema_js_1.assetFinancialMapping)
            .where((0, drizzle_orm_1.eq)(schema_js_1.assetFinancialMapping.assetId, assetId))
            .limit(1);
        return result[0];
    }
    async getAssetFinancialMappingsByType(instrumentType) {
        return await db.select().from(schema_js_1.assetFinancialMapping)
            .where((0, drizzle_orm_1.eq)(schema_js_1.assetFinancialMapping.instrumentType, instrumentType))
            .orderBy(schema_js_1.assetFinancialMapping.assetId);
    }
    async updateAssetFinancialMapping(assetId, updates) {
        const result = await db.update(schema_js_1.assetFinancialMapping)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.assetFinancialMapping.assetId, assetId))
            .returning();
        if (!result[0]) {
            throw new Error('Asset financial mapping not found');
        }
        return result[0];
    }
    async deleteAssetFinancialMapping(assetId) {
        await db.delete(schema_js_1.assetFinancialMapping).where((0, drizzle_orm_1.eq)(schema_js_1.assetFinancialMapping.assetId, assetId));
    }
    // Global Market Hours Methods
    async createGlobalMarketHours(marketHours) {
        const result = await db.insert(schema_js_1.globalMarketHours).values(marketHours).returning();
        return result[0];
    }
    async getGlobalMarketHours(marketCode) {
        const result = await db.select().from(schema_js_1.globalMarketHours)
            .where((0, drizzle_orm_1.eq)(schema_js_1.globalMarketHours.marketCode, marketCode))
            .limit(1);
        return result[0];
    }
    async getAllGlobalMarketHours() {
        return await db.select().from(schema_js_1.globalMarketHours)
            .where((0, drizzle_orm_1.eq)(schema_js_1.globalMarketHours.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.globalMarketHours.influenceWeight));
    }
    async getActiveMarkets() {
        return await db.select().from(schema_js_1.globalMarketHours)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.globalMarketHours.isActive, true), (0, drizzle_orm_1.eq)(schema_js_1.globalMarketHours.currentStatus, 'open')))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.globalMarketHours.influenceWeight));
    }
    async updateGlobalMarketHours(marketCode, updates) {
        const result = await db.update(schema_js_1.globalMarketHours)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.globalMarketHours.marketCode, marketCode))
            .returning();
        if (!result[0]) {
            throw new Error('Global market hours not found');
        }
        return result[0];
    }
    async deleteGlobalMarketHours(marketCode) {
        await db.delete(schema_js_1.globalMarketHours).where((0, drizzle_orm_1.eq)(schema_js_1.globalMarketHours.marketCode, marketCode));
    }
    // Options Chain Methods
    async createOptionsChain(option) {
        const result = await db.insert(schema_js_1.optionsChain).values(option).returning();
        return result[0];
    }
    async getOptionsChain(id) {
        const result = await db.select().from(schema_js_1.optionsChain)
            .where((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.id, id))
            .limit(1);
        return result[0];
    }
    async getOptionsChainBySymbol(optionSymbol) {
        const result = await db.select().from(schema_js_1.optionsChain)
            .where((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.optionSymbol, optionSymbol))
            .limit(1);
        return result[0];
    }
    async getOptionsChainByUnderlying(underlyingAssetId) {
        return await db.select().from(schema_js_1.optionsChain)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.underlyingAssetId, underlyingAssetId), (0, drizzle_orm_1.eq)(schema_js_1.optionsChain.isActive, true)))
            .orderBy(schema_js_1.optionsChain.expirationDate, schema_js_1.optionsChain.strikePrice);
    }
    async getOptionsChainByExpiration(expirationDate) {
        return await db.select().from(schema_js_1.optionsChain)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.expirationDate, expirationDate), (0, drizzle_orm_1.eq)(schema_js_1.optionsChain.isActive, true)))
            .orderBy(schema_js_1.optionsChain.underlyingAssetId, schema_js_1.optionsChain.strikePrice);
    }
    async updateOptionsChain(id, updates) {
        const result = await db.update(schema_js_1.optionsChain)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.id, id))
            .returning();
        if (!result[0]) {
            throw new Error('Options chain not found');
        }
        return result[0];
    }
    async deleteOptionsChain(id) {
        await db.delete(schema_js_1.optionsChain).where((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.id, id));
    }
    // Margin Account Methods
    async createMarginAccount(marginAccount) {
        const result = await db.insert(schema_js_1.marginAccounts).values(marginAccount).returning();
        return result[0];
    }
    async getMarginAccount(userId, portfolioId) {
        const result = await db.select().from(schema_js_1.marginAccounts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.portfolioId, portfolioId)))
            .limit(1);
        return result[0];
    }
    async getUserMarginAccounts(userId) {
        return await db.select().from(schema_js_1.marginAccounts)
            .where((0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.marginAccounts.buyingPower));
    }
    async updateMarginAccount(userId, portfolioId, updates) {
        const result = await db.update(schema_js_1.marginAccounts)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.portfolioId, portfolioId)))
            .returning();
        if (!result[0]) {
            throw new Error('Margin account not found');
        }
        return result[0];
    }
    async deleteMarginAccount(userId, portfolioId) {
        await db.delete(schema_js_1.marginAccounts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.marginAccounts.portfolioId, portfolioId)));
    }
    // Short Position Methods
    async createShortPosition(shortPosition) {
        const result = await db.insert(schema_js_1.shortPositions).values(shortPosition).returning();
        return result[0];
    }
    async getShortPosition(id) {
        const result = await db.select().from(schema_js_1.shortPositions)
            .where((0, drizzle_orm_1.eq)(schema_js_1.shortPositions.id, id))
            .limit(1);
        return result[0];
    }
    async getUserShortPositions(userId) {
        return await db.select().from(schema_js_1.shortPositions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.shortPositions.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.shortPositions.positionStatus, 'open')))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.shortPositions.openedAt));
    }
    async getPortfolioShortPositions(portfolioId) {
        return await db.select().from(schema_js_1.shortPositions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.shortPositions.portfolioId, portfolioId), (0, drizzle_orm_1.eq)(schema_js_1.shortPositions.positionStatus, 'open')))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.shortPositions.openedAt));
    }
    async updateShortPosition(id, updates) {
        const result = await db.update(schema_js_1.shortPositions)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.shortPositions.id, id))
            .returning();
        if (!result[0]) {
            throw new Error('Short position not found');
        }
        return result[0];
    }
    async deleteShortPosition(id) {
        await db.delete(schema_js_1.shortPositions).where((0, drizzle_orm_1.eq)(schema_js_1.shortPositions.id, id));
    }
    // NPC Trader Methods
    async createNpcTrader(npcTrader) {
        const result = await db.insert(schema_js_1.npcTraders).values(npcTrader).returning();
        return result[0];
    }
    async getNpcTrader(id) {
        const result = await db.select().from(schema_js_1.npcTraders)
            .where((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.id, id))
            .limit(1);
        return result[0];
    }
    async getNpcTradersByType(traderType) {
        return await db.select().from(schema_js_1.npcTraders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.traderType, traderType), (0, drizzle_orm_1.eq)(schema_js_1.npcTraders.isActive, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.npcTraders.availableCapital));
    }
    async getNpcTradersByFirm(firmId) {
        return await db.select().from(schema_js_1.npcTraders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.firmId, firmId), (0, drizzle_orm_1.eq)(schema_js_1.npcTraders.isActive, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.npcTraders.totalPnL));
    }
    async getActiveNpcTraders() {
        return await db.select().from(schema_js_1.npcTraders)
            .where((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.npcTraders.influenceOnMarket));
    }
    async updateNpcTrader(id, updates) {
        const result = await db.update(schema_js_1.npcTraders)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.id, id))
            .returning();
        if (!result[0]) {
            throw new Error('NPC trader not found');
        }
        return result[0];
    }
    async deleteNpcTrader(id) {
        await db.delete(schema_js_1.npcTraders).where((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.id, id));
    }
    // Information Tier Methods
    async createInformationTier(tier) {
        const result = await db.insert(schema_js_1.informationTiers).values(tier).returning();
        return result[0];
    }
    async getInformationTier(tierName) {
        const result = await db.select().from(schema_js_1.informationTiers)
            .where((0, drizzle_orm_1.eq)(schema_js_1.informationTiers.tierName, tierName))
            .limit(1);
        return result[0];
    }
    async getAllInformationTiers() {
        return await db.select().from(schema_js_1.informationTiers)
            .where((0, drizzle_orm_1.eq)(schema_js_1.informationTiers.isActive, true))
            .orderBy(schema_js_1.informationTiers.tierLevel);
    }
    async updateInformationTier(tierName, updates) {
        const result = await db.update(schema_js_1.informationTiers)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.informationTiers.tierName, tierName))
            .returning();
        if (!result[0]) {
            throw new Error('Information tier not found');
        }
        return result[0];
    }
    async deleteInformationTier(tierName) {
        await db.delete(schema_js_1.informationTiers).where((0, drizzle_orm_1.eq)(schema_js_1.informationTiers.tierName, tierName));
    }
    // News Article Methods
    async createNewsArticle(article) {
        const result = await db.insert(schema_js_1.newsArticles).values(article).returning();
        return result[0];
    }
    async getNewsArticle(id) {
        const result = await db.select().from(schema_js_1.newsArticles)
            .where((0, drizzle_orm_1.eq)(schema_js_1.newsArticles.id, id))
            .limit(1);
        return result[0];
    }
    async getNewsArticlesByTier(userTier, limit) {
        const now = new Date();
        let condition;
        switch (userTier) {
            case 'elite':
                condition = (0, drizzle_orm_1.sql) `${schema_js_1.newsArticles.eliteReleaseTime} <= ${now}`;
                break;
            case 'pro':
                condition = (0, drizzle_orm_1.sql) `${schema_js_1.newsArticles.proReleaseTime} <= ${now}`;
                break;
            case 'free':
                condition = (0, drizzle_orm_1.sql) `${schema_js_1.newsArticles.freeReleaseTime} <= ${now}`;
                break;
        }
        let query = db.select().from(schema_js_1.newsArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.newsArticles.isActive, true), condition))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.newsArticles.publishTime));
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    }
    async getNewsArticlesByAsset(assetId, limit) {
        let query = db.select().from(schema_js_1.newsArticles)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.newsArticles.isActive, true), (0, drizzle_orm_1.sql) `${assetId} = ANY(${schema_js_1.newsArticles.affectedAssets})`))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.newsArticles.publishTime));
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    }
    async updateNewsArticle(id, updates) {
        const result = await db.update(schema_js_1.newsArticles)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.newsArticles.id, id))
            .returning();
        if (!result[0]) {
            throw new Error('News article not found');
        }
        return result[0];
    }
    async deleteNewsArticle(id) {
        await db.delete(schema_js_1.newsArticles).where((0, drizzle_orm_1.eq)(schema_js_1.newsArticles.id, id));
    }
    // Options Chain Methods for Phase 1 Scheduled Services
    async getAllOptionsChains() {
        return await db.select().from(schema_js_1.optionsChain)
            .where((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.optionsChain.expirationDate));
    }
    async updateOptionsChain(id, updates) {
        const result = await db.update(schema_js_1.optionsChain)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.optionsChain.id, id))
            .returning();
        return result[0];
    }
    // Missing methods for Phase1ScheduledServices
    async getAllNpcTraders() {
        return await db.select().from(schema_js_1.npcTraders)
            .where((0, drizzle_orm_1.eq)(schema_js_1.npcTraders.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.npcTraders.availableCapital));
    }
    async getNewsArticles(filters) {
        let query = db.select().from(schema_js_1.newsArticles)
            .where((0, drizzle_orm_1.eq)(schema_js_1.newsArticles.isActive, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.newsArticles.publishTime));
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        return await query;
    }
    // ============================================================================
    // PHASE 3: ART-DRIVEN PROGRESSION SYSTEM STORAGE METHODS
    // ============================================================================
    // Comic Issue Variant Methods
    async getComicIssueVariant(id) {
        const result = await db.select().from(schema_js_1.comicIssueVariants)
            .where((0, drizzle_orm_1.eq)(schema_js_1.comicIssueVariants.id, id))
            .limit(1);
        return result[0];
    }
    async getComicIssueVariants(filters, limit, offset) {
        let query = db.select().from(schema_js_1.comicIssueVariants);
        const conditions = [];
        if (filters?.coverType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicIssueVariants.coverType, filters.coverType));
        }
        if (filters?.issueType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicIssueVariants.issueType, filters.issueType));
        }
        if (filters?.primaryHouse) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicIssueVariants.primaryHouse, filters.primaryHouse));
        }
        if (filters?.minRarity) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.comicIssueVariants.rarity} >= ${filters.minRarity}`);
        }
        if (filters?.maxPrice) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.comicIssueVariants.baseMarketValue} <= ${filters.maxPrice}`);
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.comicIssueVariants.variantTitle} ILIKE ${`%${filters.search}%`} OR ${schema_js_1.comicIssueVariants.coverDescription} ILIKE ${`%${filters.search}%`}`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.comicIssueVariants.rarity), (0, drizzle_orm_1.desc)(schema_js_1.comicIssueVariants.baseMarketValue));
        if (limit) {
            query = query.limit(limit);
        }
        if (offset) {
            query = query.offset(offset);
        }
        return await query;
    }
    async createComicIssueVariant(variant) {
        const result = await db.insert(schema_js_1.comicIssueVariants).values(variant).returning();
        return result[0];
    }
    async updateComicIssueVariant(id, variant) {
        const result = await db.update(schema_js_1.comicIssueVariants)
            .set({ ...variant, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.comicIssueVariants.id, id))
            .returning();
        return result[0];
    }
    // User Comic Collection Methods
    async getUserComicCollections(userId) {
        return await db.select().from(schema_js_1.userComicCollection)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userComicCollection.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.userComicCollection.acquiredAt));
    }
    async getUserComicCollectionByVariant(userId, variantId) {
        const result = await db.select().from(schema_js_1.userComicCollection)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.userComicCollection.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.userComicCollection.variantId, variantId)))
            .limit(1);
        return result[0];
    }
    async getUserComicCollectionItem(id) {
        const result = await db.select().from(schema_js_1.userComicCollection)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userComicCollection.id, id))
            .limit(1);
        return result[0];
    }
    async createUserComicCollection(collection) {
        const result = await db.insert(schema_js_1.userComicCollection).values(collection).returning();
        return result[0];
    }
    async updateUserComicCollection(id, collection) {
        const result = await db.update(schema_js_1.userComicCollection)
            .set(collection)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userComicCollection.id, id))
            .returning();
        return result[0];
    }
    async deleteUserComicCollection(id) {
        const result = await db.delete(schema_js_1.userComicCollection)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userComicCollection.id, id))
            .returning();
        return result.length > 0;
    }
    // User Progression Status Methods
    async getUserProgressionStatus(userId) {
        const result = await db.select().from(schema_js_1.userProgressionStatus)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userProgressionStatus.userId, userId))
            .limit(1);
        return result[0];
    }
    async createUserProgressionStatus(status) {
        const result = await db.insert(schema_js_1.userProgressionStatus).values(status).returning();
        return result[0];
    }
    async updateUserProgressionStatus(id, status) {
        const result = await db.update(schema_js_1.userProgressionStatus)
            .set({ ...status, lastProgressionUpdate: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.userProgressionStatus.id, id))
            .returning();
        return result[0];
    }
    // House Progression Methods
    async getHouseProgressionPaths(houseId) {
        let query = db.select().from(schema_js_1.houseProgressionPaths)
            .where((0, drizzle_orm_1.eq)(schema_js_1.houseProgressionPaths.isActive, true));
        if (houseId) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.houseProgressionPaths.houseId, houseId));
        }
        return await query.orderBy(schema_js_1.houseProgressionPaths.levelNumber);
    }
    async getUserHouseProgression(userId, houseId) {
        let query = db.select().from(schema_js_1.userHouseProgression)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userHouseProgression.userId, userId));
        if (houseId) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.userHouseProgression.houseId, houseId));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.userHouseProgression.currentLevel));
    }
    async createUserHouseProgression(progression) {
        const result = await db.insert(schema_js_1.userHouseProgression).values(progression).returning();
        return result[0];
    }
    async updateUserHouseProgression(id, progression) {
        const result = await db.update(schema_js_1.userHouseProgression)
            .set({ ...progression, lastProgressionActivity: new Date(), updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.userHouseProgression.id, id))
            .returning();
        return result[0];
    }
    // Trading Tool Unlock Methods
    async getUserTradingToolUnlocks(userId) {
        return await db.select().from(schema_js_1.tradingToolUnlocks)
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingToolUnlocks.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingToolUnlocks.unlockedAt));
    }
    async createTradingToolUnlock(unlock) {
        const result = await db.insert(schema_js_1.tradingToolUnlocks).values(unlock).returning();
        return result[0];
    }
    async updateTradingToolUnlock(id, unlock) {
        const result = await db.update(schema_js_1.tradingToolUnlocks)
            .set({ ...unlock, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.tradingToolUnlocks.id, id))
            .returning();
        return result[0];
    }
    // Comic Collection Achievement Methods
    async getComicCollectionAchievements(filters) {
        let query = db.select().from(schema_js_1.comicCollectionAchievements);
        const conditions = [];
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicCollectionAchievements.category, filters.category));
        }
        if (filters?.tier) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicCollectionAchievements.tier, filters.tier));
        }
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.comicCollectionAchievements.isActive, filters.isActive));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy(schema_js_1.comicCollectionAchievements.displayOrder);
    }
    async createComicCollectionAchievement(achievement) {
        const result = await db.insert(schema_js_1.comicCollectionAchievements).values(achievement).returning();
        return result[0];
    }
    async updateComicCollectionAchievement(id, achievement) {
        const result = await db.update(schema_js_1.comicCollectionAchievements)
            .set({ ...achievement, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.comicCollectionAchievements.id, id))
            .returning();
        return result[0];
    }
    // Collection Challenge Methods
    async getCollectionChallenges(filters) {
        let query = db.select().from(schema_js_1.collectionChallenges);
        const conditions = [];
        if (filters?.isActive !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.collectionChallenges.isActive, filters.isActive));
        }
        if (filters?.challengeType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.collectionChallenges.challengeType, filters.challengeType));
        }
        if (filters?.currentOnly) {
            const now = new Date();
            conditions.push((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `${schema_js_1.collectionChallenges.startDate} <= ${now}`, (0, drizzle_orm_1.sql) `${schema_js_1.collectionChallenges.endDate} >= ${now}`));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.collectionChallenges.startDate));
    }
    async getUserChallengeParticipation(userId, challengeId) {
        let query = db.select().from(schema_js_1.userChallengeParticipation)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userChallengeParticipation.userId, userId));
        if (challengeId) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.userChallengeParticipation.challengeId, challengeId));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.userChallengeParticipation.enrolledAt));
    }
    async createUserChallengeParticipation(participation) {
        const result = await db.insert(schema_js_1.userChallengeParticipation).values(participation).returning();
        return result[0];
    }
    async updateUserChallengeParticipation(id, participation) {
        const result = await db.update(schema_js_1.userChallengeParticipation)
            .set({ ...participation, lastProgressUpdate: new Date(), updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.userChallengeParticipation.id, id))
            .returning();
        return result[0];
    }
    // Additional Missing Methods for Phase 1 Core Trading Foundation
    async getAllMarginAccounts() {
        return await db.select().from(schema_js_1.marginAccounts)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.marginAccounts.marginEquity));
    }
    // =============================================================================
    // COLLECTOR-GRADE ASSET DISPLAY METHODS
    // =============================================================================
    // Graded Asset Profile Methods
    async createGradedAssetProfile(profileData) {
        const result = await db.insert(gradedAssetProfiles).values(profileData).returning();
        return result[0];
    }
    async getUserGradedAssetProfiles(userId, filters) {
        // CRITICAL SECURITY FIX: Build all conditions in array and combine with and()
        // to ensure userId filter is NEVER lost when applying additional filters
        const conditions = [(0, drizzle_orm_1.eq)(gradedAssetProfiles.userId, userId)];
        if (filters?.rarityFilter) {
            conditions.push((0, drizzle_orm_1.eq)(gradedAssetProfiles.rarityTier, filters.rarityFilter));
        }
        if (filters?.storageTypeFilter) {
            conditions.push((0, drizzle_orm_1.eq)(gradedAssetProfiles.storageType, filters.storageTypeFilter));
        }
        // Apply all conditions using and() to maintain proper user isolation
        const query = db.select().from(gradedAssetProfiles)
            .where((0, drizzle_orm_1.and)(...conditions));
        // Default sort by display priority, then acquisition date
        const sortField = filters?.sortBy === 'grade' ? gradedAssetProfiles.overallGrade
            : filters?.sortBy === 'value' ? gradedAssetProfiles.currentMarketValue
                : gradedAssetProfiles.displayPriority;
        return await query.orderBy((0, drizzle_orm_1.desc)(sortField), (0, drizzle_orm_1.desc)(gradedAssetProfiles.acquisitionDate));
    }
    async getGradedAssetProfile(profileId, userId) {
        // CRITICAL SECURITY FIX: Add user ownership validation to prevent cross-user access
        const conditions = [(0, drizzle_orm_1.eq)(gradedAssetProfiles.id, profileId)];
        // If userId is provided, ensure the profile belongs to that user
        if (userId) {
            conditions.push((0, drizzle_orm_1.eq)(gradedAssetProfiles.userId, userId));
        }
        const result = await db.select().from(gradedAssetProfiles)
            .where((0, drizzle_orm_1.and)(...conditions));
        return result[0];
    }
    async updateGradedAssetProfile(profileId, updates, userId) {
        // CRITICAL SECURITY FIX: Add user ownership validation to prevent unauthorized updates
        const conditions = [(0, drizzle_orm_1.eq)(gradedAssetProfiles.id, profileId)];
        // If userId is provided, ensure the profile belongs to that user
        if (userId) {
            conditions.push((0, drizzle_orm_1.eq)(gradedAssetProfiles.userId, userId));
        }
        const result = await db.update(gradedAssetProfiles)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.and)(...conditions))
            .returning();
        return result[0];
    }
    async deleteGradedAssetProfile(profileId, userId) {
        // CRITICAL SECURITY FIX: Add user ownership validation to prevent unauthorized deletions
        const conditions = [(0, drizzle_orm_1.eq)(gradedAssetProfiles.id, profileId)];
        // If userId is provided, ensure the profile belongs to that user
        if (userId) {
            conditions.push((0, drizzle_orm_1.eq)(gradedAssetProfiles.userId, userId));
        }
        const result = await db.delete(gradedAssetProfiles)
            .where((0, drizzle_orm_1.and)(...conditions))
            .returning();
        return result.length > 0;
    }
    // Collection Storage Box Methods
    // CRITICAL SECURITY: This method requires userId to ensure users can only see their own storage boxes
    async getCollectionStorageBoxes(userId, filters) {
        // CRITICAL SECURITY FIX: Build all conditions in array and combine with and()
        // to ensure userId filter is NEVER lost when applying additional filters
        const conditions = [(0, drizzle_orm_1.eq)(collectionStorageBoxes.userId, userId)];
        if (filters?.boxType) {
            conditions.push((0, drizzle_orm_1.eq)(collectionStorageBoxes.boxType, filters.boxType));
        }
        let query = db.select().from(collectionStorageBoxes)
            .where((0, drizzle_orm_1.and)(...conditions));
        // Apply sorting
        if (filters?.sortBy === 'name') {
            query = query.orderBy(collectionStorageBoxes.boxName);
        }
        else {
            query = query.orderBy((0, drizzle_orm_1.desc)(collectionStorageBoxes.createdAt));
        }
        return await query;
    }
    async createCollectionStorageBox(boxData) {
        const result = await db.insert(collectionStorageBoxes).values(boxData).returning();
        return result[0];
    }
    async updateCollectionStorageBox(boxId, updates, userId) {
        // CRITICAL SECURITY FIX: Add user ownership validation to prevent unauthorized updates
        const conditions = [(0, drizzle_orm_1.eq)(collectionStorageBoxes.id, boxId)];
        // If userId is provided, ensure the storage box belongs to that user
        if (userId) {
            conditions.push((0, drizzle_orm_1.eq)(collectionStorageBoxes.userId, userId));
        }
        const result = await db.update(collectionStorageBoxes)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.and)(...conditions))
            .returning();
        return result[0];
    }
    // Variant Cover Registry Methods
    async getVariantCoversByAsset(baseAssetId) {
        return await db.select().from(variantCoverRegistry)
            .where((0, drizzle_orm_1.eq)(variantCoverRegistry.baseAssetId, baseAssetId))
            .orderBy((0, drizzle_orm_1.desc)(variantCoverRegistry.baseRarityMultiplier));
    }
    async createVariantCover(variantData) {
        const result = await db.insert(variantCoverRegistry).values(variantData).returning();
        return result[0];
    }
    async getVariantCover(variantId) {
        const result = await db.select().from(variantCoverRegistry)
            .where((0, drizzle_orm_1.eq)(variantCoverRegistry.id, variantId));
        return result[0];
    }
    async searchVariantCovers(criteria) {
        let query = db.select().from(variantCoverRegistry);
        const conditions = [];
        if (criteria.variantType) {
            conditions.push((0, drizzle_orm_1.eq)(variantCoverRegistry.variantType, criteria.variantType));
        }
        if (criteria.coverArtist) {
            conditions.push((0, drizzle_orm_1.ilike)(variantCoverRegistry.coverArtist, `%${criteria.coverArtist}%`));
        }
        if (criteria.maxPrice) {
            conditions.push((0, drizzle_orm_1.sql) `${variantCoverRegistry.currentPremium} <= ${criteria.maxPrice}`);
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        return await query.orderBy((0, drizzle_orm_1.desc)(variantCoverRegistry.baseRarityMultiplier));
    }
    // Collection Analytics Methods
    async getCollectionAnalytics(userId) {
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
        const gradeDistribution = {};
        profiles.forEach(profile => {
            const gradeRange = Math.floor(profile.overallGrade);
            const key = `${gradeRange}.0-${gradeRange}.9`;
            gradeDistribution[key] = (gradeDistribution[key] || 0) + 1;
        });
        // Rarity distribution
        const rarityDistribution = {};
        profiles.forEach(profile => {
            rarityDistribution[profile.rarityTier] = (rarityDistribution[profile.rarityTier] || 0) + 1;
        });
        // House distribution
        const houseDistribution = {};
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
            const aAppreciation = (a.currentMarketValue - a.acquisitionPrice) / a.acquisitionPrice;
            const bAppreciation = (b.currentMarketValue - b.acquisitionPrice) / b.acquisitionPrice;
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
    async getTrade(id) {
        const [trade] = await this.db.select().from(schema_js_1.trades).where((0, drizzle_orm_1.eq)(schema_js_1.trades.id, id)).limit(1);
        return trade;
    }
    async getTrades(userId, portfolioId, limit) {
        const query = this.db
            .select()
            .from(schema_js_1.trades)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.trades.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.trades.portfolioId, portfolioId)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.trades.executedAt));
        return limit ? await query.limit(limit) : await query;
    }
    async getTradesByAsset(userId, assetId, limit) {
        const query = this.db
            .select()
            .from(schema_js_1.trades)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.trades.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.trades.assetId, assetId)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.trades.executedAt));
        return limit ? await query.limit(limit) : await query;
    }
    async createTrade(trade) {
        const [newTrade] = await this.db.insert(schema_js_1.trades).values(trade).returning();
        return newTrade;
    }
    async updateTrade(id, trade) {
        const [updated] = await this.db
            .update(schema_js_1.trades)
            .set({ ...trade, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.trades.id, id))
            .returning();
        return updated;
    }
    // Positions - Current open positions with unrealized P&L
    async getPosition(userId, portfolioId, assetId) {
        const [position] = await this.db
            .select()
            .from(schema_js_1.positions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.positions.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.positions.portfolioId, portfolioId), (0, drizzle_orm_1.eq)(schema_js_1.positions.assetId, assetId)))
            .limit(1);
        return position;
    }
    async getPositions(userId, portfolioId) {
        return await this.db
            .select()
            .from(schema_js_1.positions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.positions.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.positions.portfolioId, portfolioId)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.positions.currentValue));
    }
    async getPositionById(id) {
        const [position] = await this.db.select().from(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id)).limit(1);
        return position;
    }
    async createPosition(position) {
        const [newPosition] = await this.db.insert(schema_js_1.positions).values(position).returning();
        return newPosition;
    }
    async updatePosition(id, position) {
        const [updated] = await this.db
            .update(schema_js_1.positions)
            .set({ ...position, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id))
            .returning();
        return updated;
    }
    async deletePosition(id) {
        const result = await this.db.delete(schema_js_1.positions).where((0, drizzle_orm_1.eq)(schema_js_1.positions.id, id));
        return result.rowCount ? result.rowCount > 0 : false;
    }
    // Balances - User account balances and buying power
    async getBalance(userId, portfolioId) {
        const [balance] = await this.db
            .select()
            .from(schema_js_1.balances)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.balances.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.balances.portfolioId, portfolioId)))
            .limit(1);
        return balance;
    }
    async getBalanceById(id) {
        const [balance] = await this.db.select().from(schema_js_1.balances).where((0, drizzle_orm_1.eq)(schema_js_1.balances.id, id)).limit(1);
        return balance;
    }
    async createBalance(balance) {
        const [newBalance] = await this.db.insert(schema_js_1.balances).values(balance).returning();
        return newBalance;
    }
    async updateBalance(id, balance) {
        const [updated] = await this.db
            .update(schema_js_1.balances)
            .set({ ...balance, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.balances.id, id))
            .returning();
        return updated;
    }
    async recalculateBalance(userId, portfolioId) {
        // Get current positions
        const userPositions = await this.getPositions(userId, portfolioId);
        // Calculate total value from positions
        const positionsValue = userPositions.reduce((sum, position) => sum + parseFloat(position.currentValue || '0'), 0);
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
    async createVictim(victim) {
        const [newVictim] = await this.db.insert(schema_js_1.tradingVictims).values(victim).returning();
        return newVictim;
    }
    async getMoralStanding(userId) {
        const [standing] = await this.db
            .select()
            .from(schema_js_1.moralStandings)
            .where((0, drizzle_orm_1.eq)(schema_js_1.moralStandings.userId, userId))
            .limit(1);
        return standing;
    }
    async createMoralStanding(moralStanding) {
        const [newStanding] = await this.db.insert(schema_js_1.moralStandings).values(moralStanding).returning();
        return newStanding;
    }
    async updateMoralStanding(userId, updates) {
        const [updated] = await this.db
            .update(schema_js_1.moralStandings)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.moralStandings.userId, userId))
            .returning();
        return updated;
    }
    // Alignment Score Methods for Entry Test
    async getUserAlignmentScore(userId) {
        const [score] = await db
            .select()
            .from(schema_js_1.alignmentScores)
            .where((0, drizzle_orm_1.eq)(schema_js_1.alignmentScores.userId, userId))
            .limit(1);
        return score;
    }
    async createAlignmentScore(score) {
        const [newScore] = await db.insert(schema_js_1.alignmentScores).values(score).returning();
        return newScore;
    }
    async updateAlignmentScore(userId, updates) {
        const [updated] = await db
            .update(schema_js_1.alignmentScores)
            .set({ ...updates, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_js_1.alignmentScores.userId, userId))
            .returning();
        return updated;
    }
    // User Decision Methods for Entry Test
    async recordUserDecision(decision) {
        const [newDecision] = await db.insert(schema_js_1.userDecisions).values(decision).returning();
        return newDecision;
    }
    async getUserDecisions(userId, filters) {
        let query = db
            .select()
            .from(schema_js_1.userDecisions)
            .where((0, drizzle_orm_1.eq)(schema_js_1.userDecisions.userId, userId))
            .$dynamic();
        if (filters?.scenarioId) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.userDecisions.scenarioId, filters.scenarioId));
        }
        if (filters?.sessionId) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.userDecisions.sessionId, filters.sessionId));
        }
        if (filters?.limit && filters.limit > 0) {
            query = query.limit(filters.limit);
        }
        const decisions = await query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.userDecisions.timestamp));
        return decisions;
    }
    async calculateHouseAssignment(userId) {
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
        const { calculateHouseAssignment } = await Promise.resolve().then(() => __importStar(require('@shared/entryTestScenarios')));
        const assignment = calculateHouseAssignment(profile);
        // Calculate confidence based on how consistent their choices were
        const avgConfidence = (parseFloat(alignmentScore.ruthlessnessConfidence) +
            parseFloat(alignmentScore.individualismConfidence) +
            parseFloat(alignmentScore.lawfulnessConfidence) +
            parseFloat(alignmentScore.greedConfidence)) / 4;
        return {
            primaryHouse: assignment.primaryHouse,
            secondaryHouse: assignment.secondaryHouse,
            alignmentProfile: profile,
            confidence: avgConfidence
        };
    }
    // Knowledge Test Methods
    async createKnowledgeTestResult(data) {
        const result = await db.insert(schema_js_1.knowledgeTestResults).values(data).returning();
        return result[0];
    }
    async getLatestKnowledgeTestResult(userId) {
        const result = await db.select()
            .from(schema_js_1.knowledgeTestResults)
            .where((0, drizzle_orm_1.eq)(schema_js_1.knowledgeTestResults.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.knowledgeTestResults.completedAt))
            .limit(1);
        return result[0];
    }
    async createKnowledgeTestResponse(data) {
        const result = await db.insert(schema_js_1.knowledgeTestResponses).values(data).returning();
        return result[0];
    }
    async getKnowledgeTestResponses(resultId) {
        return await db.select()
            .from(schema_js_1.knowledgeTestResponses)
            .where((0, drizzle_orm_1.eq)(schema_js_1.knowledgeTestResponses.resultId, resultId));
    }
    // ============================================================================
    // SEVEN HOUSES OF PANELTOWN METHODS
    // ============================================================================
    async getSevenHouse(id) {
        const result = await db.select()
            .from(schema_js_1.sevenHouses)
            .where((0, drizzle_orm_1.eq)(schema_js_1.sevenHouses.id, id))
            .limit(1);
        return result[0];
    }
    async getSevenHouseByName(name) {
        const result = await db.select()
            .from(schema_js_1.sevenHouses)
            .where((0, drizzle_orm_1.eq)(schema_js_1.sevenHouses.name, name))
            .limit(1);
        return result[0];
    }
    async getAllSevenHouses() {
        return await db.select()
            .from(schema_js_1.sevenHouses)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.sevenHouses.powerLevel));
    }
    async createSevenHouse(house) {
        const result = await db.insert(schema_js_1.sevenHouses).values(house).returning();
        return result[0];
    }
    async updateSevenHouse(id, house) {
        const result = await db.update(schema_js_1.sevenHouses)
            .set(house)
            .where((0, drizzle_orm_1.eq)(schema_js_1.sevenHouses.id, id))
            .returning();
        return result[0];
    }
    // Convenience aliases for consistent API
    async getHouse(id) {
        return this.getSevenHouse(id);
    }
    async getAllHouses() {
        return this.getAllSevenHouses();
    }
    async createHouse(house) {
        return this.createSevenHouse(house);
    }
    // House Power Rankings
    async getLatestPowerRankings() {
        return await db.select()
            .from(schema_js_1.housePowerRankings)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.housePowerRankings.weekEnding))
            .limit(7);
    }
    async getHousePowerRankings() {
        return this.getLatestPowerRankings();
    }
    async updateHousePowerRanking(houseId, changeAmount, reason) {
        const house = await this.getSevenHouse(houseId);
        if (!house)
            throw new Error('House not found');
        const newPowerLevel = parseFloat(house.powerLevel || '100') + changeAmount;
        return await this.updateSevenHouse(houseId, {
            powerLevel: newPowerLevel.toString()
        });
    }
    // House Market Events
    async getHouseMarketEvents(limit = 10) {
        return await db.select()
            .from(schema_js_1.houseMarketEvents)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.houseMarketEvents.eventTimestamp))
            .limit(limit);
    }
    async createHouseMarketEvent(event) {
        const result = await db.insert(schema_js_1.houseMarketEvents).values(event).returning();
        return result[0];
    }
    // House Assets
    async getAssetsByHouse(houseId) {
        // For now, return empty array - this would need to be implemented based on asset schema
        return [];
    }
    async getHouseStatistics(houseId) {
        const house = await this.getSevenHouse(houseId);
        if (!house)
            return null;
        return {
            totalMarketCap: house.marketCap || '0',
            totalVolume24h: house.dailyVolume || '0',
            memberCount: house.controlledAssetsCount || 0,
            powerLevel: house.powerLevel || '100',
            reputationScore: house.reputationScore || '100'
        };
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.databaseStorage = new DatabaseStorage();
