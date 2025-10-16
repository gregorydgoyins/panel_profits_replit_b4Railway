"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const shadowEconomyService_1 = require("../services/shadowEconomyService");
const storage_1 = require("../storage");
const replitAuth_1 = require("../replitAuth");
const router = (0, express_1.Router)();
// Schema for shadow trade request
const shadowTradeSchema = zod_1.z.object({
    assetId: zod_1.z.string(),
    quantity: zod_1.z.number().positive(),
    side: zod_1.z.enum(['buy', 'sell']),
    orderType: zod_1.z.enum(['predatory', 'vampire', 'ghost'])
});
// Middleware to check corruption level
const requireCorruption = (minLevel) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const userId = req.user.claims.sub;
            const user = await storage_1.storage.getUser(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            // Get user's moral standing
            const moralStanding = await storage_1.storage.getMoralStanding(userId);
            const corruption = moralStanding?.corruption || 0;
            if (corruption < minLevel) {
                return res.status(403).json({
                    error: "Insufficient corruption",
                    required: minLevel,
                    current: corruption,
                    message: "Your soul is too pure for this darkness"
                });
            }
            req.userCorruption = corruption;
            req.userId = userId;
            next();
        }
        catch (error) {
            console.error("Corruption check failed:", error);
            res.status(500).json({ error: "Failed to verify corruption level" });
        }
    };
};
// GET /api/shadow/prices - Get shadow prices for assets
router.get("/prices", replitAuth_1.isAuthenticated, requireCorruption(30), async (req, res) => {
    try {
        const { assetIds } = req.query;
        const corruption = req.userCorruption;
        if (!assetIds) {
            return res.status(400).json({ error: "Asset IDs required" });
        }
        const ids = Array.isArray(assetIds) ? assetIds : [assetIds];
        const realPrices = new Map();
        // Get real prices for each asset
        for (const assetId of ids) {
            // Mock real price for now (should come from market data)
            const price = Math.random() * 1000 + 100;
            realPrices.set(assetId, price);
        }
        // Calculate shadow prices
        const shadowPrices = await shadowEconomyService_1.shadowEconomyService.calculateBulkShadowPrices(realPrices, corruption);
        // Convert map to array for response
        const result = Array.from(shadowPrices.entries()).map(([assetId, shadowPrice]) => ({
            assetId,
            ...shadowPrice
        }));
        res.json({
            prices: result,
            corruptionLevel: corruption,
            accessTier: corruption >= 60 ? 'high' : corruption >= 30 ? 'medium' : 'low'
        });
    }
    catch (error) {
        console.error("Failed to get shadow prices:", error);
        res.status(500).json({ error: "Failed to retrieve shadow prices" });
    }
});
// POST /api/shadow/trade - Execute a shadow market trade
router.post("/trade", replitAuth_1.isAuthenticated, requireCorruption(30), async (req, res) => {
    try {
        const validatedData = shadowTradeSchema.parse(req.body);
        const { assetId, quantity, side, orderType } = validatedData;
        const userId = req.userId;
        const corruption = req.userCorruption;
        // Check if user has access to this order type
        const availableOrders = shadowEconomyService_1.shadowEconomyService.getAvailableShadowOrders(corruption);
        const hasAccess = availableOrders.some(order => order.type === orderType);
        if (!hasAccess) {
            return res.status(403).json({
                error: "Order type not available",
                message: `${orderType} orders require higher corruption`,
                availableTypes: availableOrders.map(o => o.type)
            });
        }
        // Get current prices
        const realPrice = Math.random() * 1000 + 100; // Mock for now
        const shadowPriceData = shadowEconomyService_1.shadowEconomyService.calculateShadowPrice(realPrice, corruption);
        // Execute the shadow trade
        const result = await shadowEconomyService_1.shadowEconomyService.executeShadowTrade(userId, assetId, quantity, shadowPriceData.shadowPrice, realPrice, orderType, side);
        res.json({
            success: true,
            trade: result.trade,
            victim: result.victim,
            corruptionGained: result.corruptionGained,
            newCorruption: Math.min(100, corruption + result.corruptionGained),
            message: `Shadow trade executed. Your darkness grows by ${result.corruptionGained}.`
        });
    }
    catch (error) {
        console.error("Failed to execute shadow trade:", error);
        res.status(500).json({ error: "Failed to execute shadow trade" });
    }
});
// GET /api/shadow/pools - Get dark pool information
router.get("/pools/:assetId", replitAuth_1.isAuthenticated, requireCorruption(30), async (req, res) => {
    try {
        const { assetId } = req.params;
        const corruption = req.userCorruption;
        // Get dark pool liquidity
        const pool = await shadowEconomyService_1.shadowEconomyService.getDarkPoolLiquidity(assetId, corruption);
        if (!pool) {
            return res.status(404).json({
                error: "Dark pool not accessible",
                message: "No shadow liquidity available or insufficient corruption"
            });
        }
        // Calculate pool metrics
        const metrics = await shadowEconomyService_1.shadowEconomyService.calculateDarkPoolMetrics(assetId);
        res.json({
            pool,
            metrics,
            accessLevel: corruption,
            warningLevel: metrics.bloodInTheWater ? 'danger' : 'safe'
        });
    }
    catch (error) {
        console.error("Failed to get dark pool info:", error);
        res.status(500).json({ error: "Failed to retrieve dark pool information" });
    }
});
// GET /api/shadow/arbitrage - Find arbitrage opportunities
router.get("/arbitrage", replitAuth_1.isAuthenticated, requireCorruption(30), async (req, res) => {
    try {
        const corruption = req.userCorruption;
        const minProfit = req.query.minProfit ? parseFloat(req.query.minProfit) : 5;
        const opportunities = await shadowEconomyService_1.shadowEconomyService.findArbitrageOpportunities(corruption, minProfit);
        res.json({
            opportunities: opportunities.slice(0, 10), // Limit to top 10
            totalFound: opportunities.length,
            corruptionLevel: corruption,
            message: opportunities.length > 0
                ? `Found ${opportunities.length} dark opportunities`
                : "No arbitrage opportunities in the shadows"
        });
    }
    catch (error) {
        console.error("Failed to find arbitrage:", error);
        res.status(500).json({ error: "Failed to find shadow arbitrage" });
    }
});
// GET /api/shadow/order-types - Get available shadow order types
router.get("/order-types", replitAuth_1.isAuthenticated, requireCorruption(30), async (req, res) => {
    try {
        const corruption = req.userCorruption;
        const availableOrders = shadowEconomyService_1.shadowEconomyService.getAvailableShadowOrders(corruption);
        res.json({
            orderTypes: availableOrders,
            corruptionLevel: corruption,
            unlockedCount: availableOrders.length,
            totalTypes: 3,
            nextUnlock: corruption < 40 ? 40 : corruption < 60 ? 60 : null
        });
    }
    catch (error) {
        console.error("Failed to get order types:", error);
        res.status(500).json({ error: "Failed to retrieve order types" });
    }
});
// GET /api/shadow/victims - Get recent victims (for attackers)
router.get("/victims", replitAuth_1.isAuthenticated, requireCorruption(50), async (req, res) => {
    try {
        const userId = req.userId;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const victims = await storage_1.storage.getRecentVictims(userId, limit);
        res.json({
            victims,
            totalVictims: victims.length,
            message: victims.length > 0
                ? "Your victims' losses fuel your power"
                : "No victims yet. The hunt continues..."
        });
    }
    catch (error) {
        console.error("Failed to get victims:", error);
        res.status(500).json({ error: "Failed to retrieve victim data" });
    }
});
exports.default = router;
