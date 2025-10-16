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
exports.storage = exports.MemStorage = void 0;
const crypto_1 = require("crypto");
// Time-series buffer implementation with memory limits and proper chronological ordering
class TimeSeriesBuffer {
    constructor(maxSize = 10000) {
        this.timeframeData = new Map();
        this.maxSize = maxSize;
    }
    get data() {
        // Return all data points across all timeframes
        const allData = [];
        for (const timeframeArray of Array.from(this.timeframeData.values())) {
            allData.push(...timeframeArray);
        }
        // Sort by periodStart descending (latest first)
        return allData.sort((a, b) => b.periodStart.getTime() - a.periodStart.getTime());
    }
    addDataPoint(point) {
        const { timeframe } = point;
        // Get or create timeframe array
        let timeframeArray = this.timeframeData.get(timeframe);
        if (!timeframeArray) {
            timeframeArray = [];
            this.timeframeData.set(timeframe, timeframeArray);
        }
        // Check if this data point already exists (same timeframe and periodStart)
        const existingIndex = timeframeArray.findIndex(item => item.periodStart.getTime() === point.periodStart.getTime());
        if (existingIndex !== -1) {
            // Update existing data point
            timeframeArray[existingIndex] = point;
            return;
        }
        // Insert in chronological order (latest first for efficient access)
        const insertIndex = timeframeArray.findIndex(item => item.periodStart < point.periodStart);
        if (insertIndex === -1) {
            // This is the oldest point, add to end
            timeframeArray.push(point);
        }
        else {
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
    getByTimeframe(timeframe, limit, from, to) {
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
    clear() {
        this.timeframeData.clear();
    }
}
class MemStorage {
    constructor() {
        // ========================================================================================
        // COMPREHENSIVE LEARNING SYSTEM METHODS - MemStorage Implementation
        // ========================================================================================
        // Storage for learning system entities
        this.learningPaths = new Map();
        this.sacredLessons = new Map();
        this.mysticalSkills = new Map();
        this.userLessonProgress = new Map();
        this.userSkillUnlocks = new Map();
        this.trialsOfMastery = new Map();
        this.userTrialAttempts = new Map();
        this.divineCertifications = new Map();
        this.userCertifications = new Map();
        this.learningAnalytics = new Map();
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
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        // For compatibility, search by email since username is deprecated
        return Array.from(this.users.values()).find((user) => user.email === username);
    }
    async createUser(insertUser) {
        const id = (0, crypto_1.randomUUID)();
        const user = {
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
    async upsertUser(user) {
        const existingUser = this.users.get(user.id);
        const updatedUser = {
            id: user.id,
            username: user.username ?? existingUser?.username ?? user.email ?? "user_" + user.id.substring(0, 8),
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
        this.users.set(user.id, updatedUser);
        return updatedUser;
    }
    // Asset methods
    async getAsset(id) {
        return this.assets.get(id);
    }
    async getAssetById(id) {
        return this.assets.get(id);
    }
    async getAssetBySymbol(symbol) {
        return Array.from(this.assets.values()).find(asset => asset.symbol === symbol);
    }
    async getAssets(filters) {
        let assets = Array.from(this.assets.values());
        if (filters?.type) {
            assets = assets.filter(asset => asset.type === filters.type);
        }
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            assets = assets.filter(asset => asset.name.toLowerCase().includes(searchLower) ||
                asset.symbol.toLowerCase().includes(searchLower));
        }
        if (filters?.publisher) {
            const publisherLower = filters.publisher.toLowerCase();
            assets = assets.filter(asset => {
                const metadata = asset.metadata;
                return metadata?.publisher?.toLowerCase() === publisherLower;
            });
        }
        // Apply limit with default of 100
        const limit = filters?.limit ?? 100;
        const offset = filters?.offset ?? 0;
        return assets.slice(offset, offset + limit);
    }
    async getAssetsByType(type, limit = 100) {
        return Array.from(this.assets.values())
            .filter(asset => asset.type === type)
            .slice(0, limit);
    }
    async createAsset(insertAsset) {
        const id = (0, crypto_1.randomUUID)();
        const asset = {
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
    async updateAsset(id, updateData) {
        const asset = this.assets.get(id);
        if (!asset)
            return undefined;
        const updatedAsset = {
            ...asset,
            ...updateData,
            updatedAt: new Date()
        };
        this.assets.set(id, updatedAsset);
        return updatedAsset;
    }
    async deleteAsset(id) {
        return this.assets.delete(id);
    }
    // Market data methods (OHLC time-series)
    async getLatestMarketData(assetId, timeframe = '1d') {
        const buffer = this.marketData.get(assetId);
        if (!buffer)
            return undefined;
        const latest = buffer.getByTimeframe(timeframe, 1);
        return latest[0] || undefined;
    }
    async getMarketDataHistory(assetId, timeframe, limit, from, to) {
        const buffer = this.marketData.get(assetId);
        if (!buffer)
            return [];
        return buffer.getByTimeframe(timeframe, limit, from, to);
    }
    async createMarketData(insertMarketData) {
        const id = (0, crypto_1.randomUUID)();
        const marketData = {
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
            buffer = new TimeSeriesBuffer();
            this.marketData.set(insertMarketData.assetId, buffer);
        }
        buffer.addDataPoint(marketData);
        return marketData;
    }
    async getBulkLatestMarketData(assetIds, timeframe = '1d') {
        const results = [];
        for (const assetId of assetIds) {
            const latest = await this.getLatestMarketData(assetId, timeframe);
            if (latest)
                results.push(latest);
        }
        return results;
    }
    async createBulkMarketData(marketDataList) {
        const results = [];
        for (const insertData of marketDataList) {
            const marketData = await this.createMarketData(insertData);
            results.push(marketData);
        }
        return results;
    }
    // Portfolio methods
    async getPortfolio(id) {
        return this.portfolios.get(id);
    }
    async getUserPortfolios(userId) {
        return Array.from(this.portfolios.values()).filter(p => p.userId === userId);
    }
    async createPortfolio(insertPortfolio) {
        const id = (0, crypto_1.randomUUID)();
        const portfolio = {
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
    async updatePortfolio(id, updateData) {
        const portfolio = this.portfolios.get(id);
        if (!portfolio)
            return undefined;
        const updatedPortfolio = {
            ...portfolio,
            ...updateData,
            updatedAt: new Date()
        };
        this.portfolios.set(id, updatedPortfolio);
        return updatedPortfolio;
    }
    async deletePortfolio(id) {
        // Also remove related holdings
        this.holdings.delete(id);
        return this.portfolios.delete(id);
    }
    // Holdings methods
    async getPortfolioHoldings(portfolioId) {
        return this.holdings.get(portfolioId) || [];
    }
    async getHolding(portfolioId, assetId) {
        const holdings = this.holdings.get(portfolioId) || [];
        return holdings.find(h => h.assetId === assetId);
    }
    async createHolding(insertHolding) {
        const id = (0, crypto_1.randomUUID)();
        const holding = {
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
    async updateHolding(id, updateData) {
        for (const [portfolioId, holdings] of Array.from(this.holdings.entries())) {
            const index = holdings.findIndex(h => h.id === id);
            if (index !== -1) {
                const updatedHolding = {
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
    async deleteHolding(id) {
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
    async getMarketInsights(filters) {
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
    async createMarketInsight(insertInsight) {
        const id = (0, crypto_1.randomUUID)();
        const insight = {
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
    async updateMarketInsight(id, updateData) {
        const insight = this.marketInsights.get(id);
        if (!insight)
            return undefined;
        const updatedInsight = {
            ...insight,
            ...updateData
        };
        this.marketInsights.set(id, updatedInsight);
        return updatedInsight;
    }
    // Market indices methods
    async getMarketIndex(symbol) {
        return Array.from(this.marketIndices.values()).find(index => index.symbol === symbol);
    }
    async getMarketIndices() {
        return Array.from(this.marketIndices.values());
    }
    async createMarketIndex(insertIndex) {
        const id = (0, crypto_1.randomUUID)();
        const index = {
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
    async updateMarketIndex(id, updateData) {
        const index = this.marketIndices.get(id);
        if (!index)
            return undefined;
        const updatedIndex = {
            ...index,
            ...updateData
        };
        this.marketIndices.set(id, updatedIndex);
        return updatedIndex;
    }
    // Market index data methods (OHLC time-series)
    async getLatestMarketIndexData(indexId, timeframe = '1d') {
        const buffer = this.marketIndexData.get(indexId);
        if (!buffer)
            return undefined;
        const latest = buffer.getByTimeframe(timeframe, 1);
        return latest[0] || undefined;
    }
    async getMarketIndexDataHistory(indexId, timeframe, limit, from, to) {
        const buffer = this.marketIndexData.get(indexId);
        if (!buffer)
            return [];
        return buffer.getByTimeframe(timeframe, limit, from, to);
    }
    async createMarketIndexData(insertIndexData) {
        const id = (0, crypto_1.randomUUID)();
        const indexData = {
            ...insertIndexData,
            id,
            volume: insertIndexData.volume ?? null,
            change: insertIndexData.change ?? null,
            percentChange: insertIndexData.percentChange ?? null,
            createdAt: new Date()
        };
        let buffer = this.marketIndexData.get(insertIndexData.indexId);
        if (!buffer) {
            buffer = new TimeSeriesBuffer();
            this.marketIndexData.set(insertIndexData.indexId, buffer);
        }
        buffer.addDataPoint(indexData);
        return indexData;
    }
    // Watchlist methods
    async getUserWatchlists(userId) {
        return Array.from(this.watchlists.values()).filter(w => w.userId === userId);
    }
    async getWatchlistAssets(watchlistId) {
        return this.watchlistAssets.get(watchlistId) || [];
    }
    async createWatchlist(insertWatchlist) {
        const id = (0, crypto_1.randomUUID)();
        const watchlist = {
            ...insertWatchlist,
            id,
            description: insertWatchlist.description ?? null,
            isDefault: insertWatchlist.isDefault ?? null,
            createdAt: new Date()
        };
        this.watchlists.set(id, watchlist);
        return watchlist;
    }
    async addAssetToWatchlist(insertWatchlistAsset) {
        const id = (0, crypto_1.randomUUID)();
        const watchlistAsset = {
            ...insertWatchlistAsset,
            id,
            addedAt: new Date()
        };
        const assets = this.watchlistAssets.get(insertWatchlistAsset.watchlistId) || [];
        assets.push(watchlistAsset);
        this.watchlistAssets.set(insertWatchlistAsset.watchlistId, assets);
        return watchlistAsset;
    }
    async removeAssetFromWatchlist(watchlistId, assetId) {
        const assets = this.watchlistAssets.get(watchlistId) || [];
        const index = assets.findIndex(a => a.assetId === assetId);
        if (index !== -1) {
            assets.splice(index, 1);
            return true;
        }
        return false;
    }
    async deleteWatchlist(id) {
        // Remove related watchlist assets
        this.watchlistAssets.delete(id);
        return this.watchlists.delete(id);
    }
    // Order methods
    async getOrder(id) {
        return this.orders.get(id);
    }
    async getUserOrders(userId, status) {
        let orders = Array.from(this.orders.values()).filter(o => o.userId === userId);
        if (status) {
            orders = orders.filter(o => o.status === status);
        }
        return orders;
    }
    async getOrdersByStatus(status) {
        return Array.from(this.orders.values()).filter(o => o.status === status);
    }
    async createOrder(insertOrder) {
        const id = (0, crypto_1.randomUUID)();
        const order = {
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
    async updateOrder(id, updateData) {
        const order = this.orders.get(id);
        if (!order)
            return undefined;
        const updatedOrder = {
            ...order,
            ...updateData,
            filledAt: updateData.status === 'filled' ? new Date() : order.filledAt
        };
        this.orders.set(id, updatedOrder);
        return updatedOrder;
    }
    async deleteOrder(id) {
        return this.orders.delete(id);
    }
    async cancelOrder(id) {
        const order = this.orders.get(id);
        if (!order)
            return undefined;
        // Validate status transition
        if (order.status !== 'pending') {
            throw new Error(`Cannot cancel order with status: ${order.status}`);
        }
        return this.updateOrder(id, { status: 'cancelled' });
    }
    // Market events methods
    async getMarketEvents(filters) {
        let events = Array.from(this.marketEvents.values());
        if (filters?.isActive !== undefined) {
            events = events.filter(e => e.isActive === filters.isActive);
        }
        if (filters?.category) {
            events = events.filter(e => e.category === filters.category);
        }
        return events;
    }
    async createMarketEvent(insertEvent) {
        const id = (0, crypto_1.randomUUID)();
        const event = {
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
    async updateMarketEvent(id, updateData) {
        const event = this.marketEvents.get(id);
        if (!event)
            return undefined;
        const updatedEvent = {
            ...event,
            ...updateData
        };
        this.marketEvents.set(id, updatedEvent);
        return updatedEvent;
    }
    // Beat the AI Challenge methods
    async getBeatTheAIChallenge(id) {
        return this.beatTheAIChallenges.get(id);
    }
    async getBeatTheAIChallenges(filters) {
        let challenges = Array.from(this.beatTheAIChallenges.values());
        if (filters?.status) {
            challenges = challenges.filter(c => c.status === filters.status);
        }
        return challenges;
    }
    async createBeatTheAIChallenge(insertChallenge) {
        const id = (0, crypto_1.randomUUID)();
        const challenge = {
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
    async updateBeatTheAIChallenge(id, updateData) {
        const challenge = this.beatTheAIChallenges.get(id);
        if (!challenge)
            return undefined;
        const updatedChallenge = {
            ...challenge,
            ...updateData,
            updatedAt: new Date()
        };
        this.beatTheAIChallenges.set(id, updatedChallenge);
        return updatedChallenge;
    }
    // Beat the AI Prediction methods
    async getBeatTheAIPrediction(id) {
        return this.beatTheAIPredictions.get(id);
    }
    async getBeatTheAIPredictions(filters) {
        let predictions = Array.from(this.beatTheAIPredictions.values());
        if (filters?.challengeId) {
            predictions = predictions.filter(p => p.challengeId === filters.challengeId);
        }
        if (filters?.userId) {
            predictions = predictions.filter(p => p.userId === filters.userId);
        }
        return predictions;
    }
    async createBeatTheAIPrediction(insertPrediction) {
        const id = (0, crypto_1.randomUUID)();
        const prediction = {
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
            const uniqueUsers = new Set(Array.from(this.beatTheAIPredictions.values())
                .filter(p => p.challengeId === insertPrediction.challengeId)
                .map(p => p.userId));
            await this.updateBeatTheAIChallenge(insertPrediction.challengeId, {
                participantCount: uniqueUsers.size
            });
        }
        return prediction;
    }
    async updateBeatTheAIPrediction(id, updateData) {
        const prediction = this.beatTheAIPredictions.get(id);
        if (!prediction)
            return undefined;
        const updatedPrediction = {
            ...prediction,
            ...updateData
        };
        this.beatTheAIPredictions.set(id, updatedPrediction);
        return updatedPrediction;
    }
    // Beat the AI Leaderboard methods
    async getBeatTheAILeaderboard(limit = 100) {
        return Array.from(this.beatTheAILeaderboard.values())
            .sort((a, b) => (b.rank || 0) - (a.rank || 0))
            .slice(0, limit);
    }
    async getBeatTheAILeaderboardEntry(userId) {
        return Array.from(this.beatTheAILeaderboard.values()).find(entry => entry.userId === userId);
    }
    async createBeatTheAILeaderboardEntry(insertEntry) {
        const id = (0, crypto_1.randomUUID)();
        const entry = {
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
    async updateBeatTheAILeaderboardEntry(userId, updateData) {
        const existingEntry = await this.getBeatTheAILeaderboardEntry(userId);
        if (!existingEntry)
            return undefined;
        const updatedEntry = {
            ...existingEntry,
            ...updateData,
            lastActive: new Date()
        };
        this.beatTheAILeaderboard.set(existingEntry.id, updatedEntry);
        return updatedEntry;
    }
    async recalculateLeaderboard() {
        const predictions = Array.from(this.beatTheAIPredictions.values());
        const userStats = new Map();
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
            const correctPredictions = predictions.filter(p => p.userId === userId && p.score && parseFloat(p.score.toString()) > 50).length;
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
    async getComicGradingPrediction(id) {
        return this.comicGradingPredictions.get(id);
    }
    async getComicGradingPredictions(filters) {
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
    async createComicGradingPrediction(insertPrediction) {
        const id = (0, crypto_1.randomUUID)();
        const prediction = {
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
    async updateComicGradingPrediction(id, updateData) {
        const prediction = this.comicGradingPredictions.get(id);
        if (!prediction)
            return undefined;
        const updatedPrediction = {
            ...prediction,
            ...updateData
        };
        this.comicGradingPredictions.set(id, updatedPrediction);
        return updatedPrediction;
    }
    // Vector Similarity Search Operations Implementation
    // Asset Recommendation Engine - "Comics You Might Like"
    async findSimilarAssets(assetId, limit = 10, threshold = 0.7) {
        const targetAsset = this.assets.get(assetId);
        if (!targetAsset)
            return [];
        const allAssets = Array.from(this.assets.values()).filter(a => a.id !== assetId);
        // Mock similarity calculation based on asset metadata
        const similarAssets = allAssets.map(asset => {
            const targetMeta = targetAsset.metadata || {};
            const assetMeta = asset.metadata || {};
            let score = 0.5; // Base similarity
            // Publisher similarity
            if (targetMeta.publisher === assetMeta.publisher)
                score += 0.3;
            // Year proximity
            if (targetMeta.yearPublished && assetMeta.yearPublished) {
                const yearDiff = Math.abs(targetMeta.yearPublished - assetMeta.yearPublished);
                score += Math.max(0, 0.2 - (yearDiff / 100));
            }
            // Tag overlap
            if (targetMeta.tags && assetMeta.tags) {
                const commonTags = targetMeta.tags.filter(tag => assetMeta.tags.includes(tag));
                score += (commonTags.length / Math.max(targetMeta.tags.length, assetMeta.tags.length)) * 0.3;
            }
            return { ...asset, similarityScore: Math.min(score, 0.99) };
        }).filter(a => a.similarityScore >= threshold);
        return similarAssets.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit);
    }
    async findSimilarAssetsByEmbedding(embedding, limit = 10, threshold = 0.7) {
        // Mock implementation - in real scenario would use vector similarity
        const allAssets = Array.from(this.assets.values());
        return allAssets.map(asset => ({
            ...asset,
            similarityScore: Math.random() * 0.5 + 0.5 // Random similarity 0.5-1.0
        })).filter(a => a.similarityScore >= threshold)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    async updateAssetEmbedding(assetId, embedding) {
        const asset = this.assets.get(assetId);
        if (!asset)
            return false;
        // In real implementation, would store embedding in vector column
        return true;
    }
    async getAssetsWithoutEmbeddings(limit = 50) {
        return Array.from(this.assets.values()).slice(0, limit);
    }
    // Comic Visual Similarity Engine - "Find Similar Comics"
    async findSimilarComicsByImage(gradingId, limit = 10, threshold = 0.7) {
        const targetGrading = this.comicGradingPredictions.get(gradingId);
        if (!targetGrading)
            return [];
        const allGradings = Array.from(this.comicGradingPredictions.values()).filter(g => g.id !== gradingId);
        return allGradings.map(grading => {
            // Mock visual similarity based on comic metadata
            let score = 0.6;
            if (targetGrading.predictedGrade === grading.predictedGrade)
                score += 0.2;
            if (targetGrading.confidence && grading.confidence &&
                Math.abs(targetGrading.confidence - grading.confidence) < 0.1)
                score += 0.2;
            return { ...grading, similarityScore: Math.min(score, 0.99) };
        }).filter(g => g.similarityScore >= threshold)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    async findSimilarComicsByImageEmbedding(embedding, limit = 10, threshold = 0.7) {
        const allGradings = Array.from(this.comicGradingPredictions.values());
        return allGradings.map(grading => ({
            ...grading,
            similarityScore: Math.random() * 0.4 + 0.6 // Random similarity 0.6-1.0
        })).filter(g => g.similarityScore >= threshold)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    async updateComicImageEmbedding(gradingId, embedding) {
        return this.comicGradingPredictions.has(gradingId);
    }
    async getComicGradingsWithoutEmbeddings(limit = 50) {
        return Array.from(this.comicGradingPredictions.values()).slice(0, limit);
    }
    // Market Pattern Recognition - Semantic Search & Pattern Matching
    async searchMarketInsightsByContent(query, limit = 10, threshold = 0.7) {
        const allInsights = Array.from(this.marketInsights.values());
        const queryLower = query.toLowerCase();
        return allInsights.map(insight => {
            let score = 0.3;
            if (insight.title.toLowerCase().includes(queryLower))
                score += 0.4;
            if (insight.content.toLowerCase().includes(queryLower))
                score += 0.3;
            if (insight.category?.toLowerCase().includes(queryLower))
                score += 0.2;
            return { ...insight, similarityScore: Math.min(score, 0.99) };
        }).filter(i => i.similarityScore >= threshold)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    async findSimilarMarketInsights(insightId, limit = 10, threshold = 0.7) {
        const targetInsight = this.marketInsights.get(insightId);
        if (!targetInsight)
            return [];
        const allInsights = Array.from(this.marketInsights.values()).filter(i => i.id !== insightId);
        return allInsights.map(insight => {
            let score = 0.5;
            if (targetInsight.category === insight.category)
                score += 0.3;
            if (targetInsight.assetId === insight.assetId)
                score += 0.2;
            return { ...insight, similarityScore: Math.min(score, 0.99) };
        }).filter(i => i.similarityScore >= threshold)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    async findSimilarMarketInsightsByEmbedding(embedding, limit = 10, threshold = 0.7) {
        const allInsights = Array.from(this.marketInsights.values());
        return allInsights.map(insight => ({
            ...insight,
            similarityScore: Math.random() * 0.4 + 0.6
        })).filter(i => i.similarityScore >= threshold)
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);
    }
    async updateMarketInsightEmbedding(insightId, embedding) {
        return this.marketInsights.has(insightId);
    }
    async getMarketInsightsWithoutEmbeddings(limit = 50) {
        return Array.from(this.marketInsights.values()).slice(0, limit);
    }
    // Price Pattern Recognition - Similar Price Movements  
    async findSimilarPricePatterns(assetId, timeframe, limit = 10, threshold = 0.7) {
        const targetData = this.marketData.get(assetId);
        if (!targetData)
            return [];
        const allData = [];
        for (const [id, buffer] of this.marketData.entries()) {
            if (id === assetId)
                continue;
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
    async findSimilarPricePatternsByEmbedding(embedding, timeframe, limit = 10, threshold = 0.7) {
        const allData = [];
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
    async updateMarketDataEmbedding(marketDataId, embedding) {
        // Mock implementation
        return true;
    }
    async getMarketDataWithoutEmbeddings(timeframe, limit = 50) {
        const allData = [];
        for (const buffer of this.marketData.values()) {
            const data = buffer.getByTimeframe(timeframe || '1d', limit);
            allData.push(...data);
        }
        return allData.slice(0, limit);
    }
    // General Vector Operations
    calculateVectorSimilarity(vectorA, vectorB) {
        if (vectorA.length !== vectorB.length)
            return 0;
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
    async batchUpdateEmbeddings(updates) {
        // Mock implementation - in real scenario would batch update embeddings
        return true;
    }
    // Vector Index Management
    async createVectorIndices() {
        // Mock implementation - in real scenario would create pgvector indices
        return true;
    }
    async refreshVectorIndices() {
        // Mock implementation
        return true;
    }
    async getVectorIndexStatus() {
        // Mock implementation - in real scenario would check pgvector indices
        return [
            { table: 'assets', hasIndex: true, indexType: 'hnsw' },
            { table: 'market_insights', hasIndex: true, indexType: 'hnsw' },
            { table: 'comic_grading_predictions', hasIndex: true, indexType: 'hnsw' },
            { table: 'market_data', hasIndex: true, indexType: 'hnsw' }
        ];
    }
    // Enhanced search functionality
    async searchAssetsWithSimilarity(query, filters, limit = 20) {
        let allAssets = Array.from(this.assets.values());
        // Apply filters first
        if (filters?.type) {
            allAssets = allAssets.filter(asset => asset.type === filters.type);
        }
        if (filters?.publisher) {
            allAssets = allAssets.filter(asset => {
                const metadata = asset.metadata;
                return metadata?.publisher?.toLowerCase() === filters.publisher.toLowerCase();
            });
        }
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
            return { ...asset, similarityScore: Math.min(score, 0.99), searchScore: Math.min(score, 0.99) };
        }).filter(a => a.searchScore >= 0.1)
            .sort((a, b) => b.searchScore - a.searchScore)
            .slice(0, limit);
    }
    // User and portfolio-based recommendations
    async getRecommendationsForUser(userId, limit = 10) {
        const userPortfolios = await this.getUserPortfolios(userId);
        const allAssets = Array.from(this.assets.values());
        // Generate recommendations based on user's portfolio patterns
        return allAssets.slice(0, limit).map(asset => ({
            ...asset,
            recommendationScore: Math.random() * 0.3 + 0.7, // 70-100%
            reason: "Based on your portfolio composition and market trends, this asset aligns with your investment strategy."
        }));
    }
    async getPortfolioSimilarAssets(portfolioId, limit = 10) {
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
    async getComicSeries(id) {
        return this.comicSeries.get(id);
    }
    async getComicSeriesList(filters) {
        let series = Array.from(this.comicSeries.values());
        if (filters?.publisher) {
            series = series.filter(s => s.publisher.toLowerCase().includes(filters.publisher.toLowerCase()));
        }
        if (filters?.year) {
            series = series.filter(s => s.year === filters.year);
        }
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            series = series.filter(s => s.seriesName.toLowerCase().includes(searchLower) ||
                s.description?.toLowerCase().includes(searchLower));
        }
        if (filters?.limit) {
            series = series.slice(0, filters.limit);
        }
        return series;
    }
    async createComicSeries(insertSeries) {
        const id = (0, crypto_1.randomUUID)();
        const series = {
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
    async updateComicSeries(id, updateData) {
        const series = this.comicSeries.get(id);
        if (!series)
            return undefined;
        const updatedSeries = {
            ...series,
            ...updateData,
            updatedAt: new Date()
        };
        this.comicSeries.set(id, updatedSeries);
        return updatedSeries;
    }
    async deleteComicSeries(id) {
        return this.comicSeries.delete(id);
    }
    async createBulkComicSeries(seriesList) {
        const results = [];
        for (const insertSeries of seriesList) {
            const series = await this.createComicSeries(insertSeries);
            results.push(series);
        }
        return results;
    }
    // Featured Comics management
    async getFeaturedComic(id) {
        return this.featuredComics.get(id);
    }
    async getFeaturedComics(filters) {
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
    async createFeaturedComic(insertFeatured) {
        const id = (0, crypto_1.randomUUID)();
        const featured = {
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
    async updateFeaturedComic(id, updateData) {
        const featured = this.featuredComics.get(id);
        if (!featured)
            return undefined;
        const updatedFeatured = {
            ...featured,
            ...updateData,
            updatedAt: new Date()
        };
        this.featuredComics.set(id, updatedFeatured);
        return updatedFeatured;
    }
    async deleteFeaturedComic(id) {
        return this.featuredComics.delete(id);
    }
    // Comic data aggregation for dashboards
    async getComicMetrics() {
        return {
            totalSeries: this.comicSeries.size,
            totalIssues: this.comicIssues.size,
            totalCreators: this.comicCreators.size,
            totalCovers: Array.from(this.comicSeries.values()).filter(s => s.featuredCoverUrl || s.coversUrl).length
        };
    }
    async getFeaturedComicsCount() {
        return this.featuredComics.size;
    }
    async getTrendingComicSeries(limit) {
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
    async getFeaturedComicsForHomepage() {
        return this.getFeaturedComics({ isActive: true, limit: 10 });
    }
    // Placeholder methods for missing comic methods
    async getComicIssue(id) {
        return this.comicIssues.get(id);
    }
    async getComicIssues(filters) {
        return Array.from(this.comicIssues.values());
    }
    async getComicIssuesBySeriesId(seriesId) {
        return Array.from(this.comicIssues.values()).filter(issue => issue.seriesId === seriesId);
    }
    async createComicIssue(insertIssue) {
        const id = (0, crypto_1.randomUUID)();
        const issue = { ...insertIssue, id, createdAt: new Date(), updatedAt: new Date() };
        this.comicIssues.set(id, issue);
        return issue;
    }
    async updateComicIssue(id, updateData) {
        const issue = this.comicIssues.get(id);
        if (!issue)
            return undefined;
        const updated = { ...issue, ...updateData, updatedAt: new Date() };
        this.comicIssues.set(id, updated);
        return updated;
    }
    async deleteComicIssue(id) {
        return this.comicIssues.delete(id);
    }
    async createBulkComicIssues(issuesList) {
        return issuesList.map(issue => this.createComicIssue(issue));
    }
    async getComicCreator(id) {
        return this.comicCreators.get(id);
    }
    async getComicCreators(filters) {
        return Array.from(this.comicCreators.values());
    }
    async getComicCreatorByName(name) {
        return Array.from(this.comicCreators.values()).find(creator => creator.name === name);
    }
    async createComicCreator(insertCreator) {
        const id = (0, crypto_1.randomUUID)();
        const creator = { ...insertCreator, id, createdAt: new Date(), updatedAt: new Date() };
        this.comicCreators.set(id, creator);
        return creator;
    }
    async updateComicCreator(id, updateData) {
        const creator = this.comicCreators.get(id);
        if (!creator)
            return undefined;
        const updated = { ...creator, ...updateData, updatedAt: new Date() };
        this.comicCreators.set(id, updated);
        return updated;
    }
    async deleteComicCreator(id) {
        return this.comicCreators.delete(id);
    }
    // Learning Paths Management
    async getLearningPath(id) {
        return this.learningPaths.get(id);
    }
    async getLearningPaths(filters) {
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
    async getLearningPathsByHouse(houseId) {
        return this.getLearningPaths({ houseId, isActive: true });
    }
    async createLearningPath(path) {
        const id = (0, crypto_1.randomUUID)();
        const newPath = {
            ...path,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.learningPaths.set(id, newPath);
        return newPath;
    }
    async updateLearningPath(id, path) {
        const existing = this.learningPaths.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...path, updatedAt: new Date() };
        this.learningPaths.set(id, updated);
        return updated;
    }
    async deleteLearningPath(id) {
        return this.learningPaths.delete(id);
    }
    // Sacred Lessons Management
    async getSacredLesson(id) {
        return this.sacredLessons.get(id);
    }
    async getSacredLessons(filters) {
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
    async getLessonsByPath(pathId) {
        return this.getSacredLessons({ pathId, isActive: true });
    }
    async getLessonsByHouse(houseId) {
        return this.getSacredLessons({ houseId, isActive: true });
    }
    async createSacredLesson(lesson) {
        const id = (0, crypto_1.randomUUID)();
        const newLesson = {
            ...lesson,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.sacredLessons.set(id, newLesson);
        return newLesson;
    }
    async updateSacredLesson(id, lesson) {
        const existing = this.sacredLessons.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...lesson, updatedAt: new Date() };
        this.sacredLessons.set(id, updated);
        return updated;
    }
    async deleteSacredLesson(id) {
        return this.sacredLessons.delete(id);
    }
    async searchLessons(searchTerm, filters) {
        const allLessons = await this.getSacredLessons(filters);
        const searchLower = searchTerm.toLowerCase();
        return allLessons.filter(lesson => lesson.title.toLowerCase().includes(searchLower) ||
            lesson.description.toLowerCase().includes(searchLower) ||
            (lesson.mysticalNarrative && lesson.mysticalNarrative.toLowerCase().includes(searchLower)));
    }
    // Mystical Skills Management
    async getMysticalSkill(id) {
        return this.mysticalSkills.get(id);
    }
    async getMysticalSkills(filters) {
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
    async getSkillsByHouse(houseId) {
        return this.getMysticalSkills({ houseId, isActive: true });
    }
    async getSkillsByCategory(category) {
        return this.getMysticalSkills({ skillCategory: category, isActive: true });
    }
    async getSkillTree(houseId) {
        const skills = houseId ? await this.getSkillsByHouse(houseId) : Array.from(this.mysticalSkills.values());
        return skills.map(skill => ({
            ...skill,
            prerequisites: [], // Simplified for in-memory
            unlocks: [] // Simplified for in-memory
        }));
    }
    async createMysticalSkill(skill) {
        const id = (0, crypto_1.randomUUID)();
        const newSkill = {
            ...skill,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.mysticalSkills.set(id, newSkill);
        return newSkill;
    }
    async updateMysticalSkill(id, skill) {
        const existing = this.mysticalSkills.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...skill, updatedAt: new Date() };
        this.mysticalSkills.set(id, updated);
        return updated;
    }
    async deleteMysticalSkill(id) {
        return this.mysticalSkills.delete(id);
    }
    // User Learning Progress Tracking
    async getUserLessonProgress(id) {
        return this.userLessonProgress.get(id);
    }
    async getUserLessonProgresses(userId, filters) {
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
    async getLessonProgress(userId, lessonId) {
        const progresses = await this.getUserLessonProgresses(userId, { lessonId });
        return progresses[0];
    }
    async createUserLessonProgress(progress) {
        const id = (0, crypto_1.randomUUID)();
        const newProgress = {
            ...progress,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.userLessonProgress.set(id, newProgress);
        return newProgress;
    }
    async updateUserLessonProgress(id, progress) {
        const existing = this.userLessonProgress.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...progress, updatedAt: new Date() };
        this.userLessonProgress.set(id, updated);
        return updated;
    }
    async startLesson(userId, lessonId) {
        const progressData = {
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
    async completeLesson(userId, lessonId, score, timeSpent) {
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
        return updated;
    }
    async updateLessonProgress(userId, lessonId, progressData) {
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
        return updated;
    }
    // User Skill Unlocks Management
    async getUserSkillUnlock(id) {
        return this.userSkillUnlocks.get(id);
    }
    async getUserSkillUnlocks(userId, filters) {
        let unlocks = Array.from(this.userSkillUnlocks.values()).filter(u => u.userId === userId);
        if (filters?.skillId) {
            unlocks = unlocks.filter(u => u.skillId === filters.skillId);
        }
        if (filters?.masteryLevel !== undefined) {
            unlocks = unlocks.filter(u => u.masteryLevel >= filters.masteryLevel);
        }
        return unlocks.sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
    }
    async getUserSkillById(userId, skillId) {
        const unlocks = await this.getUserSkillUnlocks(userId, { skillId });
        return unlocks[0];
    }
    async createUserSkillUnlock(unlock) {
        const id = (0, crypto_1.randomUUID)();
        const newUnlock = {
            ...unlock,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.userSkillUnlocks.set(id, newUnlock);
        return newUnlock;
    }
    async updateUserSkillUnlock(id, unlock) {
        const existing = this.userSkillUnlocks.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...unlock, updatedAt: new Date() };
        this.userSkillUnlocks.set(id, updated);
        return updated;
    }
    async unlockSkill(userId, skillId, unlockMethod) {
        const unlockData = {
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
    async upgradeSkillMastery(userId, skillId, experienceSpent) {
        const existing = await this.getUserSkillById(userId, skillId);
        if (!existing)
            return undefined;
        return this.updateUserSkillUnlock(existing.id, {
            masteryLevel: existing.masteryLevel + 1,
            experienceSpent: existing.experienceSpent + experienceSpent
        });
    }
    async getUserSkillBonuses(userId) {
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
    async checkSkillUnlockEligibility(userId, skillId) {
        // Simplified eligibility check for in-memory storage
        return { eligible: true, requirements: {}, missing: {} };
    }
    // Trials of Mastery Management
    async getTrialOfMastery(id) {
        return this.trialsOfMastery.get(id);
    }
    async getTrialsOfMastery(filters) {
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
    async getTrialsByHouse(houseId) {
        return this.getTrialsOfMastery({ houseId, isActive: true });
    }
    async createTrialOfMastery(trial) {
        const id = (0, crypto_1.randomUUID)();
        const newTrial = {
            ...trial,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.trialsOfMastery.set(id, newTrial);
        return newTrial;
    }
    async updateTrialOfMastery(id, trial) {
        const existing = this.trialsOfMastery.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...trial, updatedAt: new Date() };
        this.trialsOfMastery.set(id, updated);
        return updated;
    }
    async deleteTrialOfMastery(id) {
        return this.trialsOfMastery.delete(id);
    }
    // User Trial Attempts Management
    async getUserTrialAttempt(id) {
        return this.userTrialAttempts.get(id);
    }
    async getUserTrialAttempts(userId, filters) {
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
    async getTrialAttempts(trialId, filters) {
        let attempts = Array.from(this.userTrialAttempts.values()).filter(a => a.trialId === trialId);
        if (filters?.status) {
            attempts = attempts.filter(a => a.status === filters.status);
        }
        if (filters?.passed !== undefined) {
            attempts = attempts.filter(a => a.passed === filters.passed);
        }
        return attempts.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    }
    async createUserTrialAttempt(attempt) {
        const id = (0, crypto_1.randomUUID)();
        const newAttempt = {
            ...attempt,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.userTrialAttempts.set(id, newAttempt);
        return newAttempt;
    }
    async updateUserTrialAttempt(id, attempt) {
        const existing = this.userTrialAttempts.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...attempt, updatedAt: new Date() };
        this.userTrialAttempts.set(id, updated);
        return updated;
    }
    async startTrial(userId, trialId) {
        const attemptData = {
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
    async submitTrialResults(userId, trialId, attemptId, results) {
        const updated = await this.updateUserTrialAttempt(attemptId, {
            status: 'completed',
            completedAt: new Date(),
            timeSpent: results.timeSpent,
            phaseScores: results.phaseScores,
            overallScore: results.overallScore,
            passed: results.overallScore >= 70, // Default passing score
            responses: results.responses
        });
        return updated;
    }
    async checkTrialEligibility(userId, trialId) {
        // Simplified eligibility check for in-memory storage
        return { eligible: true, requirements: {}, missing: {} };
    }
    // Divine Certifications Management
    async getDivineCertification(id) {
        return this.divineCertifications.get(id);
    }
    async getDivineCertifications(filters) {
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
    async getCertificationsByHouse(houseId) {
        return this.getDivineCertifications({ houseId, isActive: true });
    }
    async createDivineCertification(certification) {
        const id = (0, crypto_1.randomUUID)();
        const newCert = {
            ...certification,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.divineCertifications.set(id, newCert);
        return newCert;
    }
    async updateDivineCertification(id, certification) {
        const existing = this.divineCertifications.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...certification, updatedAt: new Date() };
        this.divineCertifications.set(id, updated);
        return updated;
    }
    async deleteDivineCertification(id) {
        return this.divineCertifications.delete(id);
    }
    // User Certifications Management
    async getUserCertification(id) {
        return this.userCertifications.get(id);
    }
    async getUserCertifications(userId, filters) {
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
    async getCertificationHolders(certificationId) {
        return Array.from(this.userCertifications.values()).filter(c => c.certificationId === certificationId);
    }
    async createUserCertification(certification) {
        const id = (0, crypto_1.randomUUID)();
        const newCert = {
            ...certification,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.userCertifications.set(id, newCert);
        return newCert;
    }
    async updateUserCertification(id, certification) {
        const existing = this.userCertifications.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...certification, updatedAt: new Date() };
        this.userCertifications.set(id, updated);
        return updated;
    }
    async awardCertification(userId, certificationId, achievementMethod, verificationData) {
        const certData = {
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
    async revokeCertification(userId, certificationId, reason) {
        const userCerts = await this.getUserCertifications(userId, { certificationId });
        if (userCerts.length === 0)
            return false;
        const updated = await this.updateUserCertification(userCerts[0].id, {
            status: 'revoked',
            displayInProfile: false,
            metadata: { revokedReason: reason, revokedAt: new Date() }
        });
        return !!updated;
    }
    async checkCertificationEligibility(userId, certificationId) {
        // Simplified eligibility check for in-memory storage
        return { eligible: true, requirements: {}, missing: {} };
    }
    // Learning Analytics Management
    async getLearningAnalytics(userId) {
        return this.learningAnalytics.get(userId);
    }
    async createLearningAnalytics(analytics) {
        const newAnalytics = {
            ...analytics,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.learningAnalytics.set(analytics.userId, newAnalytics);
        return newAnalytics;
    }
    async updateLearningAnalytics(userId, analytics) {
        const existing = this.learningAnalytics.get(userId);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...analytics, updatedAt: new Date() };
        this.learningAnalytics.set(userId, updated);
        return updated;
    }
    async recalculateLearningAnalytics(userId) {
        // Simplified recalculation for in-memory storage
        const progresses = await this.getUserLessonProgresses(userId);
        const unlocks = await this.getUserSkillUnlocks(userId);
        const attempts = await this.getUserTrialAttempts(userId);
        const analyticsData = {
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
            return this.updateLearningAnalytics(userId, analyticsData);
        }
        else {
            return this.createLearningAnalytics(analyticsData);
        }
    }
    async generateLearningRecommendations(userId) {
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
    async getHouseLearningStats(houseId) {
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
    async getGlobalLearningStats() {
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
    async getUserLearningDashboard(userId) {
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
    async generatePersonalizedLearningPath(userId, preferences) {
        // Simplified personalized path generation
        const pathData = {
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
    async detectLearningPatterns(userId) {
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
    async getUserAlignmentScore(userId) {
        return this.alignmentScores.get(userId);
    }
    async createAlignmentScore(score) {
        const id = (0, crypto_1.randomUUID)();
        const alignmentScore = {
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
    async updateAlignmentScore(userId, adjustments) {
        const existing = this.alignmentScores.get(userId);
        if (!existing) {
            // Create new alignment score if none exists
            const newScore = await this.createAlignmentScore({ userId });
            return this.updateAlignmentScore(userId, adjustments);
        }
        // Apply adjustments with soft caps at -100 to +100
        const clamp = (value) => Math.max(-100, Math.min(100, value));
        existing.ruthlessnessScore = String(clamp(parseFloat(existing.ruthlessnessScore) + (adjustments.ruthlessnessDelta ?? 0)));
        existing.individualismScore = String(clamp(parseFloat(existing.individualismScore) + (adjustments.individualismDelta ?? 0)));
        existing.lawfulnessScore = String(clamp(parseFloat(existing.lawfulnessScore) + (adjustments.lawfulnessDelta ?? 0)));
        existing.greedScore = String(clamp(parseFloat(existing.greedScore) + (adjustments.greedDelta ?? 0)));
        existing.updatedAt = new Date();
        return existing;
    }
    async recordUserDecision(decision) {
        const id = (0, crypto_1.randomUUID)();
        const userDecision = {
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
    async getUserDecisions(userId, filters) {
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
    async predictLearningOutcomes(userId, pathId) {
        // Simplified outcome prediction
        return {
            estimatedCompletionTime: 7200, // 2 hours
            successProbability: 0.8,
            recommendedPrerequisites: [],
            riskFactors: []
        };
    }
}
exports.MemStorage = MemStorage;
// Import database storage for persistent storage
const databaseStorage_js_1 = require("./databaseStorage.js");
// Create and export the storage instance with fallback mechanism
// Use database storage if available, fallback to MemStorage if no DATABASE_URL
let storage;
try {
    // Check if DATABASE_URL is available
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl && databaseUrl.trim() !== '') {
        console.log('🗄️ Using database storage (PostgreSQL)');
        exports.storage = storage = databaseStorage_js_1.databaseStorage;
    }
    else {
        console.log('⚠️ No DATABASE_URL found, falling back to in-memory storage');
        exports.storage = storage = new MemStorage();
    }
}
catch (error) {
    console.warn('⚠️ Database storage failed, falling back to in-memory storage:', error);
    exports.storage = storage = new MemStorage();
}
