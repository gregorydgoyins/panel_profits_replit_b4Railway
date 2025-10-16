"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_1 = require("../storage");
const router = (0, express_1.Router)();
/**
 * Enhanced Characters API - Real character data with battle stats
 */
router.get('/enhanced-characters', async (req, res) => {
    try {
        const { sort = 'power_level', limit = 50, universe, search, minPowerLevel, maxPowerLevel } = req.query;
        // Build query parameters
        const queryParams = {
            limit: parseInt(limit),
            sort: sort
        };
        if (universe)
            queryParams.universe = universe;
        if (search)
            queryParams.search = search;
        if (minPowerLevel)
            queryParams.minPowerLevel = parseFloat(minPowerLevel);
        if (maxPowerLevel)
            queryParams.maxPowerLevel = parseFloat(maxPowerLevel);
        const characters = await storage_1.storage.getEnhancedCharacters(queryParams);
        res.json({
            success: true,
            data: characters,
            count: characters.length
        });
    }
    catch (error) {
        console.error('Enhanced characters API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enhanced characters',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Character Search API - Full-text search across character database
 */
router.get('/enhanced-characters/search', async (req, res) => {
    try {
        const { q, universe, limit = 20 } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query (q) parameter is required'
            });
        }
        const results = await storage_1.storage.getEnhancedCharacters({
            search: q,
            universe: universe,
            limit: parseInt(limit)
        });
        res.json({
            success: true,
            data: results,
            query: q,
            count: results.length
        });
    }
    catch (error) {
        console.error('Character search error:', error);
        res.status(500).json({
            success: false,
            message: 'Character search failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Enhanced Comic Issues API - Real comic data with market valuations
 */
router.get('/comic-issues', async (req, res) => {
    try {
        const { sort = 'current_market_value', limit = 25, series, minValue, maxValue, minRating, search } = req.query;
        const queryParams = {
            limit: parseInt(limit),
            sort: sort
        };
        if (series)
            queryParams.series = series;
        if (search)
            queryParams.search = search;
        if (minValue)
            queryParams.minValue = parseFloat(minValue);
        if (maxValue)
            queryParams.maxValue = parseFloat(maxValue);
        if (minRating)
            queryParams.minRating = parseFloat(minRating);
        const comics = await storage_1.storage.getEnhancedComicIssues(queryParams);
        res.json({
            success: true,
            data: comics,
            count: comics.length
        });
    }
    catch (error) {
        console.error('Enhanced comics API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enhanced comics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Battle Intelligence API - Combat outcomes affecting market prices
 */
router.get('/battle-intelligence', async (req, res) => {
    try {
        const { timeframe = '24h', limit = 20 } = req.query;
        // Convert timeframe to hours
        const timeframeHours = {
            '1h': 1,
            '24h': 24,
            '7d': 168,
            '30d': 720
        }[timeframe] || 24;
        const battles = await storage_1.storage.getBattleScenarios({
            timeframe: timeframe,
            limit: parseInt(limit)
        });
        res.json({
            success: true,
            data: battles,
            timeframe,
            count: battles.length
        });
    }
    catch (error) {
        console.error('Battle outcomes API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch battle outcomes',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Power Shifts API - Character power level changes
 */
router.get('/power-shifts', async (req, res) => {
    try {
        const { timeframe = '24h', limit = 15 } = req.query;
        const timeframeHours = {
            '1h': 1,
            '24h': 24,
            '7d': 168,
            '30d': 720
        }[timeframe] || 24;
        const shifts = await storage_1.storage.getEnhancedCharacters({
            sort: 'power_level',
            limit: parseInt(limit)
        });
        res.json({
            success: true,
            data: shifts,
            timeframe,
            count: shifts.length
        });
    }
    catch (error) {
        console.error('Power shifts API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch power shifts',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Combat Analytics API - Battle performance statistics
 */
router.get('/combat-analytics/summary', async (req, res) => {
    try {
        const analytics = await storage_1.storage.getBattleIntelligenceSummary();
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        console.error('Combat analytics API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch combat analytics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Movie Performance API - Box office data affecting character values
 */
router.get('/movie-performance', async (req, res) => {
    try {
        const { sort = 'impact_score', limit = 10, franchise, minGross, minScore } = req.query;
        const queryParams = {
            limit: parseInt(limit),
            sort: sort
        };
        if (franchise)
            queryParams.franchise = franchise;
        if (minGross)
            queryParams.minGross = parseFloat(minGross);
        if (minScore)
            queryParams.minScore = parseInt(minScore);
        const movies = await storage_1.storage.getMoviePerformanceData(queryParams);
        res.json({
            success: true,
            data: movies,
            count: movies.length
        });
    }
    catch (error) {
        console.error('Movie performance API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch movie performance data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Market Intelligence Summary - Combined data for dashboard
 */
router.get('/market-intelligence/summary', async (req, res) => {
    try {
        // Fetch multiple data sources in parallel
        const [topCharacters, topComics, recentBattles, movieData, marketOverview] = await Promise.all([
            storage_1.storage.getEnhancedCharacters({ limit: 10, sort: 'market_value' }),
            storage_1.storage.getEnhancedComicIssues({ limit: 10, sort: 'current_market_value' }),
            storage_1.storage.getBattleScenarios({ timeframe: '24h', limit: 5 }),
            storage_1.storage.getMoviePerformanceData({ limit: 5, sort: 'impact_score' }),
            storage_1.storage.getMarketOverview()
        ]);
        res.json({
            success: true,
            data: {
                topCharacters,
                topComics,
                recentBattles,
                movieImpacts: movieData,
                marketOverview,
                lastUpdated: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Market intelligence API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch market intelligence summary',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
/**
 * Battle Intelligence Summary - Real-time battle data
 */
router.get('/battle-intelligence/summary', async (req, res) => {
    try {
        const [recentBattles, trendingWarriors, powerShifts] = await Promise.all([
            storage_1.storage.getBattleScenarios({ timeframe: '1h', limit: 10 }),
            storage_1.storage.getEnhancedCharacters({ limit: 8, sort: 'battle_win_rate' }),
            storage_1.storage.getEnhancedCharacters({ limit: 6, sort: 'power_level' })
        ]);
        res.json({
            success: true,
            data: {
                recentBattles,
                trendingWarriors,
                powerShifts,
                activeBattlesCount: recentBattles.length,
                lastUpdated: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Battle intelligence summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch battle intelligence summary',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
