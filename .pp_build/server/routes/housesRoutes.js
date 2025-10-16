"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MYTHOLOGICAL_HOUSES = void 0;
const express_1 = require("express");
const replitAuth_js_1 = require("../replitAuth.js");
const storage_js_1 = require("../storage.js");
const router = (0, express_1.Router)();
// Seven Mythological Houses Configuration
exports.MYTHOLOGICAL_HOUSES = {
    heroes: {
        id: 'heroes',
        name: 'House of Heroes',
        description: 'Masters of character options and futures',
        specialization: 'Character Assets',
        bonuses: {
            characterTrades: 0.15, // +15% success on hero trades
            tradingFees: 0.95, // 5% fee reduction
            earlyAccess: ['character_options', 'hero_futures']
        },
        karmaMultiplier: 1.2,
        colors: {
            primary: 'red-600',
            secondary: 'orange-500',
            accent: 'red-400'
        },
        icon: 'Shield'
    },
    wisdom: {
        id: 'wisdom',
        name: 'House of Wisdom',
        description: 'Scholars of creator bonds and intellectual property',
        specialization: 'Creator Assets',
        bonuses: {
            aiInsights: 0.25, // +25% AI insight accuracy
            creatorTrades: 0.12, // +12% success on creator assets
            researchSpeed: 0.30 // 30% faster research
        },
        karmaMultiplier: 1.15,
        colors: {
            primary: 'blue-600',
            secondary: 'indigo-500',
            accent: 'blue-400'
        },
        icon: 'BookOpen'
    },
    power: {
        id: 'power',
        name: 'House of Power',
        description: 'Rulers of publisher stocks and franchise NFTs',
        specialization: 'Publisher Assets',
        bonuses: {
            tradingLimits: 2.0, // 2x higher trading limits
            premiumAccess: true, // Access to institutional-grade features
            tradingFees: 0.85 // 15% fee reduction
        },
        karmaMultiplier: 1.0, // Neutral karma (power comes with responsibility)
        colors: {
            primary: 'purple-600',
            secondary: 'violet-500',
            accent: 'purple-400'
        },
        icon: 'Crown'
    },
    mystery: {
        id: 'mystery',
        name: 'House of Mystery',
        description: 'Seers of rare issue derivatives and speculation tokens',
        specialization: 'Rare Assets',
        bonuses: {
            rareTrades: 0.20, // +20% success on rare assets
            earlyAccess: ['exclusive_drops', 'limited_editions'],
            predictionAccuracy: 0.18 // +18% market prediction accuracy
        },
        karmaMultiplier: 1.25,
        colors: {
            primary: 'green-600',
            secondary: 'emerald-500',
            accent: 'green-400'
        },
        icon: 'Zap'
    },
    elements: {
        id: 'elements',
        name: 'House of Elements',
        description: 'Wielders of cross-universe asset baskets',
        specialization: 'Multi-Universe Assets',
        bonuses: {
            crossUniverseBonuses: 0.10, // +10% when trading across different universes
            portfolioBalance: 0.15, // +15% portfolio optimization
            elementalStacking: true // Bonuses stack across different comic universes
        },
        karmaMultiplier: 1.1,
        colors: {
            primary: 'amber-600',
            secondary: 'yellow-500',
            accent: 'amber-400'
        },
        icon: 'Flame'
    },
    time: {
        id: 'time',
        name: 'House of Time',
        description: 'Guardians of historical price prediction markets',
        specialization: 'Historical Assets',
        bonuses: {
            vintageAssets: 0.22, // +22% success on vintage comics
            timeBasedKarma: 1.5, // Time multiplies karma gains
            historicalInsights: 0.25 // +25% accuracy on historical price patterns
        },
        karmaMultiplier: 1.3, // Time rewards patience
        colors: {
            primary: 'gray-600',
            secondary: 'slate-500',
            accent: 'gray-400'
        },
        icon: 'Clock'
    },
    spirit: {
        id: 'spirit',
        name: 'House of Spirit',
        description: 'Masters of community sentiment and social trading',
        specialization: 'Social Assets',
        bonuses: {
            socialTradingBonus: 0.18, // +18% when following community trends
            sentimentAccuracy: 0.20, // +20% sentiment analysis accuracy
            communityKarma: 1.4 // Extra karma from community actions
        },
        karmaMultiplier: 1.25,
        colors: {
            primary: 'teal-600',
            secondary: 'cyan-500',
            accent: 'teal-400'
        },
        icon: 'Users'
    }
};
// GET /api/houses - List all mythological houses
router.get('/', async (req, res) => {
    try {
        const houses = Object.values(exports.MYTHOLOGICAL_HOUSES);
        res.json({
            success: true,
            houses: houses,
            count: houses.length
        });
    }
    catch (error) {
        console.error('Error fetching houses:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch houses'
        });
    }
});
// GET /api/houses/:houseId - Get specific house details
router.get('/:houseId', async (req, res) => {
    try {
        const { houseId } = req.params;
        const house = exports.MYTHOLOGICAL_HOUSES[houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House not found'
            });
        }
        // Get house member count and rankings
        const memberCount = await storage_js_1.storage.getHouseMemberCount(houseId);
        const topTraders = await storage_js_1.storage.getHouseTopTraders(houseId, 10);
        res.json({
            success: true,
            house: {
                ...house,
                memberCount,
                topTraders
            }
        });
    }
    catch (error) {
        console.error('Error fetching house details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch house details'
        });
    }
});
// POST /api/houses/:houseId/join - Join a house (one-time selection)
router.post('/:houseId/join', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const { houseId } = req.params;
        const userId = req.user.claims.sub;
        const house = exports.MYTHOLOGICAL_HOUSES[houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House not found'
            });
        }
        // Check if user already belongs to a house
        const user = await storage_js_1.storage.getUser(userId);
        if (user?.houseId) {
            return res.status(400).json({
                success: false,
                error: 'You have already joined a house. House loyalty is permanent.'
            });
        }
        // Join the house
        await storage_js_1.storage.updateUser(userId, { houseId });
        // Record house joining event for karma
        await storage_js_1.storage.recordKarmaAction(userId, {
            type: 'house_joined',
            houseId,
            karmaChange: 100, // Bonus karma for joining
            description: `Joined ${house.name}`
        });
        res.json({
            success: true,
            message: `Welcome to ${house.name}! Your legendary journey begins.`,
            house: house,
            karmaBonus: 100
        });
    }
    catch (error) {
        console.error('Error joining house:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to join house'
        });
    }
});
// GET /api/houses/:houseId/members - Get house member rankings
router.get('/:houseId/members', async (req, res) => {
    try {
        const { houseId } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        const house = exports.MYTHOLOGICAL_HOUSES[houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House not found'
            });
        }
        const members = await storage_js_1.storage.getHouseMembers(houseId, limit);
        const memberCount = await storage_js_1.storage.getHouseMemberCount(houseId);
        res.json({
            success: true,
            house: house.name,
            members,
            memberCount,
            hasMore: members.length === limit
        });
    }
    catch (error) {
        console.error('Error fetching house members:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch house members'
        });
    }
});
// GET /api/houses/:houseId/bonuses - Get current house trading bonuses
router.get('/:houseId/bonuses', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const { houseId } = req.params;
        const userId = req.user.claims.sub;
        const house = exports.MYTHOLOGICAL_HOUSES[houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House not found'
            });
        }
        // Get user's karma to calculate dynamic bonuses
        const userKarma = await storage_js_1.storage.getUserKarma(userId);
        // Calculate karma-modified bonuses
        const bonuses = {
            ...house.bonuses,
            karmaMultiplier: house.karmaMultiplier,
            currentKarmaBonus: Math.min(userKarma / 1000 * 0.05, 0.15), // Up to +15% bonus based on karma
            totalMultiplier: house.karmaMultiplier + (userKarma / 1000 * 0.05)
        };
        res.json({
            success: true,
            house: house.name,
            specialization: house.specialization,
            bonuses,
            userKarma
        });
    }
    catch (error) {
        console.error('Error fetching house bonuses:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch house bonuses'
        });
    }
});
// GET /api/houses/my-house - Get user's house info
router.get('/my-house', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const user = await storage_js_1.storage.getUser(userId);
        if (!user?.houseId) {
            return res.json({
                success: true,
                hasHouse: false,
                message: 'Choose your house to unlock mystical trading powers'
            });
        }
        const house = exports.MYTHOLOGICAL_HOUSES[user.houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House configuration not found'
            });
        }
        // Get user's house rank and stats
        const houseRank = await storage_js_1.storage.getUserHouseRank(userId);
        const memberCount = await storage_js_1.storage.getHouseMemberCount(user.houseId);
        const userKarma = await storage_js_1.storage.getUserKarma(userId);
        res.json({
            success: true,
            hasHouse: true,
            house: {
                ...house,
                memberCount,
                userRank: houseRank,
                userKarma
            }
        });
    }
    catch (error) {
        console.error('Error fetching user house:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user house'
        });
    }
});
// GET /api/houses/:houseId/competition - Get house competition data
router.get('/:houseId/competition', async (req, res) => {
    try {
        const { houseId } = req.params;
        const house = exports.MYTHOLOGICAL_HOUSES[houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House not found'
            });
        }
        // Get house competition metrics
        const memberCount = await storage_js_1.storage.getHouseMemberCount(houseId);
        const members = await storage_js_1.storage.getHouseMembers(houseId, 10); // Top 10 for calculations
        // Calculate house karma totals
        let totalKarma = 0;
        let topTraderKarma = 0;
        for (const member of members) {
            const memberKarma = await storage_js_1.storage.getUserKarma(member.id);
            totalKarma += memberKarma;
            if (memberKarma > topTraderKarma) {
                topTraderKarma = memberKarma;
            }
        }
        const avgKarmaPerMember = memberCount > 0 ? Math.round(totalKarma / memberCount) : 0;
        // Calculate weekly growth (simulated for now - in real app this would be historical)
        const weeklyGrowth = Math.random() * 20 - 10; // -10% to +10% for demo
        // Get achievements count (placeholder for now)
        const achievements = Math.floor(totalKarma / 5000) + 2; // Based on karma milestones
        res.json({
            success: true,
            house: houseId,
            data: {
                name: house.name,
                specialization: house.specialization,
                totalMembers: memberCount,
                totalKarma,
                avgKarmaPerMember,
                weeklyGrowth,
                topTraderKarma,
                achievements,
                lastUpdated: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error fetching house competition data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch house competition data'
        });
    }
});
// GET /api/houses/leaderboard - Get overall house competition leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const metric = req.query.metric || 'karma';
        const period = req.query.period || 'week';
        const houseLeaderboard = [];
        // Get data for all houses
        for (const [houseId, house] of Object.entries(exports.MYTHOLOGICAL_HOUSES)) {
            const memberCount = await storage_js_1.storage.getHouseMemberCount(houseId);
            const members = await storage_js_1.storage.getHouseMembers(houseId, 50); // Get more members for better calculations
            // Calculate house metrics
            let totalKarma = 0;
            let topTraderKarma = 0;
            for (const member of members) {
                const memberKarma = await storage_js_1.storage.getUserKarma(member.id);
                totalKarma += memberKarma;
                if (memberKarma > topTraderKarma) {
                    topTraderKarma = memberKarma;
                }
            }
            const avgKarmaPerMember = memberCount > 0 ? Math.round(totalKarma / memberCount) : 0;
            const weeklyGrowth = Math.random() * 20 - 10; // -10% to +10% for demo
            const achievements = Math.floor(totalKarma / 5000) + 2;
            houseLeaderboard.push({
                house: houseId,
                name: house.name,
                specialization: house.specialization,
                totalMembers: memberCount,
                totalKarma,
                avgKarmaPerMember,
                weeklyGrowth,
                topTraderKarma,
                achievements
            });
        }
        // Sort by the requested metric
        houseLeaderboard.sort((a, b) => {
            switch (metric) {
                case 'karma':
                    return b.totalKarma - a.totalKarma;
                case 'growth':
                    return b.weeklyGrowth - a.weeklyGrowth;
                case 'members':
                    return b.totalMembers - a.totalMembers;
                case 'avgKarma':
                    return b.avgKarmaPerMember - a.avgKarmaPerMember;
                default:
                    return b.totalKarma - a.totalKarma;
            }
        });
        // Add ranks
        houseLeaderboard.forEach((house, index) => {
            house.competitionRank = index + 1;
        });
        res.json({
            success: true,
            metric,
            period,
            leaderboard: houseLeaderboard,
            lastUpdated: new Date().toISOString(),
            totalHouses: houseLeaderboard.length
        });
    }
    catch (error) {
        console.error('Error fetching house leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch house leaderboard'
        });
    }
});
// GET /api/houses/:houseId/recommendations - Get house-specific asset recommendations
router.get('/:houseId/recommendations', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const { houseId } = req.params;
        const userId = req.user.claims.sub;
        const limit = parseInt(req.query.limit) || 5;
        const category = req.query.category || 'specialty';
        const house = exports.MYTHOLOGICAL_HOUSES[houseId];
        if (!house) {
            return res.status(404).json({
                success: false,
                error: 'House not found'
            });
        }
        // Get assets that match the house specialization
        const assets = await storage_js_1.storage.getAssets({ type: 'character' }); // For demo, get character assets
        // Create house-specific recommendations based on specialization
        const recommendations = [];
        let recommendationCount = 0;
        for (const asset of assets) {
            if (recommendationCount >= limit)
                break;
            // Determine if this asset matches house specialization
            let isSpecialtyMatch = false;
            let houseBonus = 0;
            let confidence = 50;
            let reason = 'Market analysis indicates potential';
            switch (house.specialization) {
                case 'Character Assets':
                    if (asset.type === 'character') {
                        isSpecialtyMatch = true;
                        houseBonus = Math.round((house.bonuses.characterTrades || 0.15) * 100);
                        confidence = 75 + Math.random() * 20;
                        reason = 'Strong character trading performance in your house specialty';
                    }
                    break;
                case 'Creator Assets':
                    if (asset.type === 'creator') {
                        isSpecialtyMatch = true;
                        houseBonus = Math.round((house.bonuses.creatorTrades || 0.12) * 100);
                        confidence = 70 + Math.random() * 25;
                        reason = 'Creator asset aligned with House of Wisdom expertise';
                    }
                    break;
                case 'Publisher Assets':
                    if (asset.type === 'publisher') {
                        isSpecialtyMatch = true;
                        houseBonus = Math.round(((1 - (house.bonuses.tradingFees || 0.85)) * 100));
                        confidence = 80 + Math.random() * 15;
                        reason = 'Publisher strength matches House of Power specialization';
                    }
                    break;
                case 'Rare Assets':
                    if (asset.rarity === 'rare' || asset.rarity === 'ultra-rare') {
                        isSpecialtyMatch = true;
                        houseBonus = Math.round((house.bonuses.rareTrades || 0.20) * 100);
                        confidence = 85 + Math.random() * 10;
                        reason = 'Rare asset detection by House of Mystery seers';
                    }
                    break;
            }
            // For specialty category, only include matching assets
            if (category === 'specialty' && !isSpecialtyMatch) {
                continue;
            }
            // Get current price (mock for demo)
            const currentPrice = 800 + Math.random() * 2000;
            const priceChange = (Math.random() - 0.5) * 20; // -10% to +10%
            recommendations.push({
                id: asset.id,
                name: asset.name,
                type: asset.type,
                currentPrice: Math.round(currentPrice),
                priceChange: parseFloat(priceChange.toFixed(2)),
                houseBonus: isSpecialtyMatch ? houseBonus : 0,
                confidence: Math.round(confidence),
                reason,
                specialization: house.specialization,
                isSpecialtyMatch
            });
            recommendationCount++;
        }
        res.json({
            success: true,
            house: houseId,
            houseName: house.name,
            specialization: house.specialization,
            category,
            recommendations,
            totalRecommendations: recommendations.length,
            lastUpdated: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error fetching house recommendations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch house recommendations'
        });
    }
});
exports.default = router;
