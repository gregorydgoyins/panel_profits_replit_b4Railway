"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const replitAuth_1 = require("../replitAuth");
const storage_1 = require("../storage");
const progressionService_1 = require("../progressionService");
const zod_1 = require("zod");
const schema_1 = require("@shared/schema");
const router = express_1.default.Router();
const progressionService = new progressionService_1.ProgressionService(storage_1.storage);
// ============================================================================
// PROGRESSION DASHBOARD AND STATUS ROUTES
// ============================================================================
// Get user's complete progression dashboard
router.get("/dashboard", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const dashboard = await progressionService.getUserProgressionDashboard(userId);
        res.json(dashboard);
    }
    catch (error) {
        console.error("Error fetching progression dashboard:", error);
        res.status(500).json({ error: "Failed to fetch progression dashboard" });
    }
});
// Get user's progression status
router.get("/status", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const status = await storage_1.storage.getUserProgressionStatus(userId);
        res.json(status);
    }
    catch (error) {
        console.error("Error fetching progression status:", error);
        res.status(500).json({ error: "Failed to fetch progression status" });
    }
});
// Recalculate user's progression (admin/debug endpoint)
router.post("/recalculate", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const updatedStatus = await progressionService.recalculateUserProgression(userId);
        res.json(updatedStatus);
    }
    catch (error) {
        console.error("Error recalculating progression:", error);
        res.status(500).json({ error: "Failed to recalculate progression" });
    }
});
// ============================================================================
// COMIC COLLECTION ROUTES
// ============================================================================
// Get user's comic collection
router.get("/collection", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { sortBy = "acquiredAt", sortOrder = "desc", filterBy } = req.query;
        let collections = await storage_1.storage.getUserComicCollections(userId);
        // Apply filters
        if (filterBy) {
            switch (filterBy) {
                case "variants":
                    collections = collections.filter(c => c.contributesToProgression);
                    break;
                case "tradeable":
                    collections = collections.filter(c => c.availableForTrade);
                    break;
                case "recent":
                    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    collections = collections.filter(c => new Date(c.acquiredAt) > oneWeekAgo);
                    break;
            }
        }
        // Apply sorting
        collections.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            const direction = sortOrder === "desc" ? -1 : 1;
            if (aVal < bVal)
                return -1 * direction;
            if (aVal > bVal)
                return 1 * direction;
            return 0;
        });
        res.json(collections);
    }
    catch (error) {
        console.error("Error fetching comic collection:", error);
        res.status(500).json({ error: "Failed to fetch comic collection" });
    }
});
// Add comic to collection
router.post("/collection", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const data = schema_1.insertUserComicCollectionSchema.parse({
            ...req.body,
            userId
        });
        const collection = await progressionService.addComicToCollection(userId, data.variantId, data);
        res.json(collection);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: "Invalid collection data", details: error.errors });
            return;
        }
        console.error("Error adding comic to collection:", error);
        res.status(500).json({ error: "Failed to add comic to collection" });
    }
});
// Update collection item
router.put("/collection/:id", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { id } = req.params;
        // Verify ownership
        const existing = await storage_1.storage.getUserComicCollectionItem(id);
        if (!existing || existing.userId !== userId) {
            res.status(404).json({ error: "Collection item not found" });
            return;
        }
        const updateData = req.body;
        const updated = await storage_1.storage.updateUserComicCollection(id, updateData);
        // Recalculate progression after update
        await progressionService.recalculateUserProgression(userId);
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating collection item:", error);
        res.status(500).json({ error: "Failed to update collection item" });
    }
});
// ============================================================================
// COMIC VARIANTS AND ISSUES ROUTES
// ============================================================================
// Get available comic variants (for collection/purchase)
router.get("/variants", async (req, res) => {
    try {
        const { coverType, issueType, primaryHouse, minRarity, maxPrice, search, limit = 50, offset = 0 } = req.query;
        const filters = {
            coverType: coverType,
            issueType: issueType,
            primaryHouse: primaryHouse,
            minRarity: minRarity ? Number(minRarity) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            search: search
        };
        const variants = await storage_1.storage.getComicIssueVariants(filters, Number(limit), Number(offset));
        res.json(variants);
    }
    catch (error) {
        console.error("Error fetching comic variants:", error);
        res.status(500).json({ error: "Failed to fetch comic variants" });
    }
});
// Get specific comic variant details
router.get("/variants/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const variant = await storage_1.storage.getComicIssueVariant(id);
        if (!variant) {
            res.status(404).json({ error: "Comic variant not found" });
            return;
        }
        res.json(variant);
    }
    catch (error) {
        console.error("Error fetching comic variant:", error);
        res.status(500).json({ error: "Failed to fetch comic variant" });
    }
});
// ============================================================================
// HOUSE PROGRESSION ROUTES
// ============================================================================
// Get user's house progressions
router.get("/houses", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const progressions = await storage_1.storage.getUserHouseProgressions(userId);
        res.json(progressions);
    }
    catch (error) {
        console.error("Error fetching house progressions:", error);
        res.status(500).json({ error: "Failed to fetch house progressions" });
    }
});
// Get specific house progression
router.get("/houses/:houseId", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { houseId } = req.params;
        const progression = await storage_1.storage.getUserHouseProgression(userId, houseId);
        if (!progression) {
            res.status(404).json({ error: "House progression not found" });
            return;
        }
        // Also get the progression path details
        const progressionPaths = await storage_1.storage.getHouseProgressionPaths(houseId);
        res.json({
            progression,
            progressionPaths
        });
    }
    catch (error) {
        console.error("Error fetching house progression:", error);
        res.status(500).json({ error: "Failed to fetch house progression" });
    }
});
// Get all house progression paths (for reference)
router.get("/houses/paths/all", async (req, res) => {
    try {
        const paths = await storage_1.storage.getAllHouseProgressionPaths();
        res.json(paths);
    }
    catch (error) {
        console.error("Error fetching house progression paths:", error);
        res.status(500).json({ error: "Failed to fetch house progression paths" });
    }
});
// ============================================================================
// ACHIEVEMENT ROUTES
// ============================================================================
// Get user's achievements
router.get("/achievements", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { category, tier, unlocked } = req.query;
        let achievements = await storage_1.storage.getUserAchievements(userId);
        // Apply filters
        if (category) {
            achievements = achievements.filter(a => a.category === category);
        }
        if (tier) {
            achievements = achievements.filter(a => a.tier === tier);
        }
        if (unlocked !== undefined) {
            const isUnlocked = unlocked === "true";
            achievements = achievements.filter(a => !!a.unlockedAt === isUnlocked);
        }
        res.json(achievements);
    }
    catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ error: "Failed to fetch achievements" });
    }
});
// Get available comic collection achievements
router.get("/achievements/available", async (req, res) => {
    try {
        const { category, tier, isHidden } = req.query;
        const filters = {
            category: category,
            tier: tier,
            isHidden: isHidden === "true"
        };
        const achievements = await storage_1.storage.getComicCollectionAchievements(filters);
        res.json(achievements);
    }
    catch (error) {
        console.error("Error fetching available achievements:", error);
        res.status(500).json({ error: "Failed to fetch available achievements" });
    }
});
// Check for new achievements (manual trigger)
router.post("/achievements/check", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const newAchievements = await progressionService.checkAndAwardAchievements(userId);
        res.json({ newAchievements, count: newAchievements.length });
    }
    catch (error) {
        console.error("Error checking achievements:", error);
        res.status(500).json({ error: "Failed to check achievements" });
    }
});
// ============================================================================
// TRADING TOOL UNLOCKS ROUTES
// ============================================================================
// Get user's trading tool unlocks
router.get("/trading-tools", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { category, unlocked } = req.query;
        let tools = await storage_1.storage.getTradingToolUnlocks(userId);
        // Apply filters
        if (category) {
            tools = tools.filter(t => t.toolCategory === category);
        }
        if (unlocked !== undefined) {
            const isUnlocked = unlocked === "true";
            tools = tools.filter(t => t.isUnlocked === isUnlocked);
        }
        res.json(tools);
    }
    catch (error) {
        console.error("Error fetching trading tool unlocks:", error);
        res.status(500).json({ error: "Failed to fetch trading tool unlocks" });
    }
});
// Check and unlock new trading tools
router.post("/trading-tools/check", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const newUnlocks = await progressionService.checkAndUnlockTradingTools(userId);
        res.json({ newUnlocks, count: newUnlocks.length });
    }
    catch (error) {
        console.error("Error checking trading tool unlocks:", error);
        res.status(500).json({ error: "Failed to check trading tool unlocks" });
    }
});
// ============================================================================
// COLLECTION CHALLENGES ROUTES
// ============================================================================
// Get active collection challenges
router.get("/challenges", async (req, res) => {
    try {
        const { challengeType, houseSpecific, active = "true" } = req.query;
        const filters = {
            challengeType: challengeType,
            houseSpecific: houseSpecific === "true",
            isActive: active === "true"
        };
        const challenges = await storage_1.storage.getCollectionChallenges(filters);
        res.json(challenges);
    }
    catch (error) {
        console.error("Error fetching collection challenges:", error);
        res.status(500).json({ error: "Failed to fetch collection challenges" });
    }
});
// Get user's challenge participations
router.get("/challenges/participation", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { status, challengeType } = req.query;
        let participations = await storage_1.storage.getUserChallengeParticipations(userId);
        // Apply filters
        if (status) {
            participations = participations.filter(p => p.participationStatus === status);
        }
        res.json(participations);
    }
    catch (error) {
        console.error("Error fetching challenge participations:", error);
        res.status(500).json({ error: "Failed to fetch challenge participations" });
    }
});
// Participate in a challenge
router.post("/challenges/:challengeId/participate", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { challengeId } = req.params;
        const participation = await progressionService.participateInChallenge(userId, challengeId);
        res.json(participation);
    }
    catch (error) {
        console.error("Error participating in challenge:", error);
        res.status(500).json({ error: "Failed to participate in challenge" });
    }
});
// ============================================================================
// LEADERBOARDS AND RANKINGS ROUTES
// ============================================================================
// Get progression leaderboards
router.get("/leaderboards", async (req, res) => {
    try {
        const { category = "overall", timeframe = "all_time", limit = 100 } = req.query;
        const leaderboard = await progressionService.getProgressionLeaderboard(category, timeframe);
        // Limit results if specified
        const limitedResults = leaderboard.slice(0, Number(limit));
        res.json({
            category,
            timeframe,
            entries: limitedResults,
            totalEntries: leaderboard.length
        });
    }
    catch (error) {
        console.error("Error fetching progression leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch progression leaderboard" });
    }
});
// Get user's ranking in specific category
router.get("/leaderboards/rank", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { category = "overall", timeframe = "all_time" } = req.query;
        const leaderboard = await progressionService.getProgressionLeaderboard(category, timeframe);
        const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        res.json({
            rank: userRank || null,
            entry: userEntry || null,
            totalEntries: leaderboard.length
        });
    }
    catch (error) {
        console.error("Error fetching user ranking:", error);
        res.status(500).json({ error: "Failed to fetch user ranking" });
    }
});
// ============================================================================
// STATISTICS AND ANALYTICS ROUTES
// ============================================================================
// Get progression statistics
router.get("/stats", replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const [progressionStatus, collections, achievements, houseProgressions, tradingUnlocks] = await Promise.all([
            storage_1.storage.getUserProgressionStatus(userId),
            storage_1.storage.getUserComicCollections(userId),
            storage_1.storage.getUserAchievements(userId),
            storage_1.storage.getUserHouseProgressions(userId),
            storage_1.storage.getTradingToolUnlocks(userId)
        ]);
        // Calculate comprehensive statistics
        const stats = {
            collection: {
                totalItems: collections.length,
                totalValue: progressionStatus?.totalCollectionValue || 0,
                variantsByRarity: {
                    standard: progressionStatus?.standardCoversOwned || 0,
                    variant: progressionStatus?.variantCoversOwned || 0,
                    rare: progressionStatus?.rareVariantsOwned || 0,
                    ultraRare: progressionStatus?.ultraRareVariantsOwned || 0,
                    legendary: progressionStatus?.legendaryVariantsOwned || 0
                },
                issuesByType: {
                    firstAppearances: progressionStatus?.firstAppearancesOwned || 0,
                    deaths: progressionStatus?.deathIssuesOwned || 0,
                    resurrections: progressionStatus?.resurrectionIssuesOwned || 0,
                    keyStorylines: progressionStatus?.keyStorylineIssuesOwned || 0,
                    crossovers: progressionStatus?.crossoverIssuesOwned || 0
                }
            },
            progression: {
                tier: progressionStatus?.overallProgressionTier || 1,
                title: progressionStatus?.progressionTitle || "Rookie Collector",
                maxTradingTier: progressionStatus?.maxTradingTier || 1,
                achievementMilestones: progressionStatus?.achievementMilestonesCompleted || 0,
                legendaryAchievements: progressionStatus?.legendaryAchievementsUnlocked || 0
            },
            achievements: {
                total: achievements.length,
                byTier: achievements.reduce((acc, a) => {
                    acc[a.tier] = (acc[a.tier] || 0) + 1;
                    return acc;
                }, {}),
                totalPoints: achievements.reduce((sum, a) => sum + (a.points || 0), 0)
            },
            houses: {
                activeHouses: houseProgressions.length,
                averageLevel: houseProgressions.reduce((sum, h) => sum + h.currentLevel, 0) / Math.max(houseProgressions.length, 1),
                totalXP: houseProgressions.reduce((sum, h) => sum + h.totalXPEarned, 0)
            },
            trading: {
                unlockedTools: tradingUnlocks.filter(t => t.isUnlocked).length,
                totalTools: tradingUnlocks.length,
                highestCategory: tradingUnlocks
                    .filter(t => t.isUnlocked)
                    .sort((a, b) => {
                    const categoryOrder = { basic: 1, advanced: 2, expert: 3, legendary: 4 };
                    return categoryOrder[b.toolCategory] -
                        categoryOrder[a.toolCategory];
                })[0]?.toolCategory || 'basic'
            }
        };
        res.json(stats);
    }
    catch (error) {
        console.error("Error fetching progression statistics:", error);
        res.status(500).json({ error: "Failed to fetch progression statistics" });
    }
});
exports.default = router;
