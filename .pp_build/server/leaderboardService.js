"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardService = exports.LeaderboardService = void 0;
const databaseStorage_js_1 = require("./databaseStorage.js");
class LeaderboardService {
    static getInstance() {
        if (!LeaderboardService.instance) {
            LeaderboardService.instance = new LeaderboardService();
        }
        return LeaderboardService.instance;
    }
    // Initialize default leaderboard categories
    async initializeDefaultCategories() {
        const existingCategories = await databaseStorage_js_1.databaseStorage.getLeaderboardCategories();
        if (existingCategories.length === 0) {
            const defaultCategories = [
                {
                    name: "All-Time Leaders",
                    categoryType: "total_return",
                    timeframe: "all_time",
                    description: "Top traders by lifetime performance",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 1
                },
                {
                    name: "Monthly Leaders",
                    categoryType: "total_return",
                    timeframe: "monthly",
                    description: "Top performers this month",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 2
                },
                {
                    name: "Weekly Leaders",
                    categoryType: "total_return",
                    timeframe: "weekly",
                    description: "Top performers this week",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 3
                },
                {
                    name: "Daily Leaders",
                    categoryType: "total_return",
                    timeframe: "daily",
                    description: "Top performers today",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 4
                },
                {
                    name: "Volume Leaders",
                    categoryType: "volume",
                    timeframe: "all_time",
                    description: "Highest trading volume",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 5
                },
                {
                    name: "Win Rate Champions",
                    categoryType: "win_rate",
                    timeframe: "all_time",
                    description: "Most consistent winners",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 6
                },
                {
                    name: "Consistency Leaders",
                    categoryType: "consistency",
                    timeframe: "all_time",
                    description: "Most stable returns",
                    sortOrder: "desc",
                    isActive: true,
                    displayOrder: 7
                }
            ];
            for (const category of defaultCategories) {
                await databaseStorage_js_1.databaseStorage.createLeaderboardCategory(category);
            }
        }
    }
    // Calculate trading performance from order and portfolio data
    async calculateTradingPerformance(userId, order) {
        // Get user's portfolio to calculate current value
        const portfolio = await databaseStorage_js_1.databaseStorage.getUserDefaultPortfolio(userId);
        if (!portfolio) {
            throw new Error('User portfolio not found');
        }
        // Get current holdings for portfolio value calculation
        const holdings = await databaseStorage_js_1.databaseStorage.getPortfolioHoldings(portfolio.id);
        let portfolioValue = parseFloat(portfolio.cashBalance || "0");
        // Calculate current holdings value
        for (const holding of holdings) {
            const currentPrice = await databaseStorage_js_1.databaseStorage.getAssetCurrentPrice(holding.assetId);
            if (currentPrice) {
                portfolioValue += parseFloat(holding.quantity || "0") * parseFloat(currentPrice.currentPrice || "0");
            }
        }
        // Calculate P&L for this specific trade
        const orderValue = parseFloat(order.totalValue || "0");
        const orderQuantity = parseFloat(order.quantity || "0");
        const orderPrice = parseFloat(order.averageFillPrice || order.price || "0");
        let tradePnL = 0;
        let isProfitable = false;
        if (order.type === 'sell') {
            // For sell orders, check if we're selling at a profit
            const holding = holdings.find(h => h.assetId === order.assetId);
            if (holding) {
                const avgCost = parseFloat(holding.averageCost || "0");
                tradePnL = (orderPrice - avgCost) * orderQuantity;
                isProfitable = tradePnL > 0;
            }
        }
        else if (order.type === 'buy') {
            // For buy orders, the immediate P&L is the transaction cost (negative)
            tradePnL = -orderValue;
            isProfitable = false; // Buy orders are not immediately profitable
        }
        // Calculate unrealized P&L for all holdings
        let unrealizedPnL = 0;
        for (const holding of holdings) {
            const currentPrice = await databaseStorage_js_1.databaseStorage.getAssetCurrentPrice(holding.assetId);
            if (currentPrice) {
                const marketValue = parseFloat(holding.quantity || "0") * parseFloat(currentPrice.currentPrice || "0");
                const costBasis = parseFloat(holding.quantity || "0") * parseFloat(holding.averageCost || "0");
                unrealizedPnL += marketValue - costBasis;
            }
        }
        return {
            portfolioValue: portfolioValue.toFixed(2),
            realizedPnL: tradePnL.toFixed(2),
            unrealizedPnL: unrealizedPnL.toFixed(2),
            totalPnL: (tradePnL + unrealizedPnL).toFixed(2),
            tradeSize: orderValue.toFixed(2),
            volume: orderValue.toFixed(2),
            isProfitable
        };
    }
    // Update trader statistics after a trade
    async updateTraderStatsFromOrder(userId, order) {
        try {
            const performance = await this.calculateTradingPerformance(userId, order);
            const updatedStats = await databaseStorage_js_1.databaseStorage.updateTraderStatsFromTrade(userId, {
                portfolioValue: performance.portfolioValue,
                pnl: performance.totalPnL,
                tradeSize: performance.tradeSize,
                isProfitable: performance.isProfitable,
                volume: performance.volume
            });
            // Check for new achievements after trade
            if (updatedStats) {
                await this.processAchievements(userId, 'trade_completed');
            }
            return updatedStats;
        }
        catch (error) {
            console.error('Error updating trader stats from order:', error);
            return undefined;
        }
    }
    // Generate leaderboard for a specific category
    async generateLeaderboard(categoryId, limit = 50) {
        const category = await databaseStorage_js_1.databaseStorage.getLeaderboardCategory(categoryId);
        if (!category) {
            throw new Error('Leaderboard category not found');
        }
        const rawEntries = await databaseStorage_js_1.databaseStorage.getLeaderboardByCategoryId(categoryId, limit);
        // Calculate period dates based on timeframe
        const now = new Date();
        let periodStart;
        let periodEnd = now;
        switch (category.timeframe) {
            case 'daily':
                periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'weekly':
                const weekStart = now.getDate() - now.getDay();
                periodStart = new Date(now.getFullYear(), now.getMonth(), weekStart);
                break;
            case 'monthly':
                periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                periodStart = new Date(2024, 0, 1); // Start of 2024 for all-time
        }
        // Transform raw entries to LeaderboardEntry format
        const entries = rawEntries.map((entry, index) => ({
            rank: index + 1,
            userId: entry.userId,
            user: entry.user,
            stats: entry,
            change: 0 // TODO: Calculate rank change from previous period
        }));
        // Get total participants
        const allStats = await databaseStorage_js_1.databaseStorage.getAllTraderStats({ minTrades: 1 });
        return {
            category,
            entries,
            lastUpdated: now,
            totalParticipants: allStats.length,
            periodStart,
            periodEnd
        };
    }
    // Get multiple leaderboards at once
    async getMultipleLeaderboards(categoryIds, limit = 25) {
        const leaderboards = await Promise.all(categoryIds.map(id => this.generateLeaderboard(id, limit)));
        return leaderboards;
    }
    // Get user's ranking across all categories
    async getUserRankings(userId) {
        const categories = await databaseStorage_js_1.databaseStorage.getLeaderboardCategories({ isActive: true });
        const rankings = await Promise.all(categories.map(async (category) => {
            const ranking = await databaseStorage_js_1.databaseStorage.getUserRankInCategory(userId, category.categoryType, category.timeframe);
            return ranking ? {
                category,
                rank: ranking.rank,
                totalUsers: ranking.totalUsers,
                stats: ranking.stats
            } : null;
        }));
        return rankings.filter(r => r !== null);
    }
    // Process achievements for a user
    async processAchievements(userId, context) {
        return await databaseStorage_js_1.databaseStorage.checkAndAwardAchievements(userId, context);
    }
    // Get leaderboard overview statistics
    async getLeaderboardOverview() {
        const overview = await databaseStorage_js_1.databaseStorage.getLeaderboardOverview();
        // Get recent achievements (last 24 hours)
        const allStats = await databaseStorage_js_1.databaseStorage.getAllTraderStats({ limit: 10 });
        const recentAchievements = [];
        for (const stats of allStats) { // Limit to prevent performance issues
            const user = await databaseStorage_js_1.databaseStorage.getUser(stats.userId);
            if (!user)
                continue;
            const achievements = await databaseStorage_js_1.databaseStorage.getUserAchievements(user.id, { isVisible: true });
            const recent = achievements.filter(a => a.unlockedAt &&
                (new Date().getTime() - new Date(a.unlockedAt).getTime()) < 24 * 60 * 60 * 1000);
            recentAchievements.push(...recent.map(a => ({ ...a, user })));
        }
        // Sort by unlock date
        recentAchievements.sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime());
        return {
            ...overview,
            recentAchievements: recentAchievements.slice(0, 10) // Latest 10 achievements
        };
    }
    // Calculate rank changes between periods
    async calculateRankChanges(categoryId) {
        // This would compare current rankings with previous period rankings
        // For now, return empty map - would require historical rank storage
        return new Map();
    }
    // Recalculate all rankings (background job)
    async recalculateAllRankings() {
        await databaseStorage_js_1.databaseStorage.recalculateAllTraderStats();
        await databaseStorage_js_1.databaseStorage.updateLeaderboardRankings();
    }
    // Get trading activity summary for analytics
    async getTradingActivitySummary(timeframe) {
        const summary = await databaseStorage_js_1.databaseStorage.getTradingActivitySummary(timeframe);
        // Count achievements in timeframe
        let achievementCount = 0;
        const cutoffDate = new Date();
        switch (timeframe) {
            case 'daily':
                cutoffDate.setDate(cutoffDate.getDate() - 1);
                break;
            case 'weekly':
                cutoffDate.setDate(cutoffDate.getDate() - 7);
                break;
            case 'monthly':
                cutoffDate.setMonth(cutoffDate.getMonth() - 1);
                break;
        }
        // This is a simplified count - in production would need more efficient query
        const allStats = await databaseStorage_js_1.databaseStorage.getAllTraderStats({ limit: 20 });
        for (const stats of allStats) { // Limit for performance
            const user = await databaseStorage_js_1.databaseStorage.getUser(stats.userId);
            if (!user)
                continue;
            const achievements = await databaseStorage_js_1.databaseStorage.getUserAchievements(user.id);
            achievementCount += achievements.filter(a => a.unlockedAt && new Date(a.unlockedAt) >= cutoffDate).length;
        }
        return {
            ...summary,
            achievements: achievementCount
        };
    }
}
exports.LeaderboardService = LeaderboardService;
// Export singleton instance
exports.leaderboardService = LeaderboardService.getInstance();
