"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_1 = require("../storage");
const noirJournalService_1 = require("../services/noirJournalService");
const replitAuth_1 = require("../replitAuth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Schema for generate journal entry request
const generateEntrySchema = zod_1.z.object({
    tradeId: zod_1.z.string().optional(),
    entryType: zod_1.z.enum(['trade', 'daily', 'milestone', 'confession']).optional(),
});
// Schema for get entries query params
const getEntriesSchema = zod_1.z.object({
    entryType: zod_1.z.string().optional(),
    limit: zod_1.z.string().transform(Number).default('50'),
    offset: zod_1.z.string().transform(Number).default('0'),
    fromDate: zod_1.z.string().optional(),
    toDate: zod_1.z.string().optional(),
});
/**
 * POST /api/journal/generate
 * Trigger AI generation of journal entry after trades
 */
router.post('/generate', replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { tradeId, entryType } = generateEntrySchema.parse(req.body);
        // Get user's moral standing
        const moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (!moralStanding) {
            return res.status(404).json({ error: 'Moral standing not found' });
        }
        const corruptionLevel = parseFloat(moralStanding.corruptionLevel);
        // Generate based on entry type
        if (tradeId) {
            // Generate entry for specific trade
            const trade = await storage_1.storage.getTrade(tradeId);
            if (!trade) {
                return res.status(404).json({ error: 'Trade not found' });
            }
            // Get victim if this was a profitable trade
            const victims = await storage_1.storage.getVictimsByTrade(tradeId);
            const victim = victims[0]; // Use first victim for entry
            const entry = await noirJournalService_1.noirJournalService.generateNoirEntry({
                trade,
                victim,
                corruptionLevel,
                userId,
            });
            return res.json(entry);
        }
        else if (entryType === 'daily') {
            // Generate daily summary
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // Get today's trades
            const allTrades = await storage_1.storage.getTrades(userId, userId, 100); // Get recent trades
            const dailyTrades = allTrades.filter(t => new Date(t.executedAt) >= today);
            // Get today's victims
            const allVictims = await storage_1.storage.getTradingVictims(userId, 100);
            const dailyVictims = allVictims.filter(v => new Date(v.createdAt) >= today);
            const entry = await noirJournalService_1.noirJournalService.generateDailySummary(userId, dailyTrades, dailyVictims, corruptionLevel);
            return res.json(entry);
        }
        else {
            // Generate general noir observation
            const entry = await noirJournalService_1.noirJournalService.generateNoirEntry({
                corruptionLevel,
                userId,
            });
            return res.json(entry);
        }
    }
    catch (error) {
        console.error('Failed to generate journal entry:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid request data', details: error.errors });
        }
        res.status(500).json({ error: 'Failed to generate journal entry' });
    }
});
/**
 * GET /api/journal/entries
 * Get user's journal entries with optional filters
 */
router.get('/entries', replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const filters = getEntriesSchema.parse(req.query);
        const entries = await storage_1.storage.getJournalEntries(userId, {
            entryType: filters.entryType,
            limit: filters.limit,
            offset: filters.offset,
            fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
            toDate: filters.toDate ? new Date(filters.toDate) : undefined,
        });
        res.json(entries);
    }
    catch (error) {
        console.error('Failed to fetch journal entries:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
        }
        res.status(500).json({ error: 'Failed to fetch journal entries' });
    }
});
/**
 * GET /api/journal/analysis
 * Get psychological analysis of the trader
 */
router.get('/analysis', replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Get existing profile or generate new one
        let profile = await storage_1.storage.getPsychologicalProfile(userId);
        if (!profile) {
            // Generate new psychological profile
            const trades = await storage_1.storage.getTrades(userId, userId, 100);
            const victims = await storage_1.storage.getTradingVictims(userId, 100);
            const moralStanding = await storage_1.storage.getMoralStanding(userId);
            if (!moralStanding) {
                return res.status(404).json({ error: 'Moral standing not found' });
            }
            profile = await noirJournalService_1.noirJournalService.analyzeTraderPsychology(userId, trades, victims, moralStanding);
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Failed to get psychological analysis:', error);
        res.status(500).json({ error: 'Failed to get psychological analysis' });
    }
});
/**
 * POST /api/journal/milestone
 * Generate corruption milestone entry
 */
router.post('/milestone', replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { milestone } = zod_1.z.object({ milestone: zod_1.z.number() }).parse(req.body);
        // Get user's moral standing
        const moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (!moralStanding) {
            return res.status(404).json({ error: 'Moral standing not found' });
        }
        const corruptionLevel = parseFloat(moralStanding.corruptionLevel);
        // Generate milestone entry
        const entry = await noirJournalService_1.noirJournalService.writeCorruptionNarrative(userId, corruptionLevel, milestone);
        res.json(entry);
    }
    catch (error) {
        console.error('Failed to generate milestone entry:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid request data', details: error.errors });
        }
        res.status(500).json({ error: 'Failed to generate milestone entry' });
    }
});
/**
 * POST /api/journal/confession
 * Generate shadow market confession
 */
router.post('/confession', replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { shadowActivity } = req.body;
        // Get user's moral standing
        const moralStanding = await storage_1.storage.getMoralStanding(userId);
        if (!moralStanding) {
            return res.status(404).json({ error: 'Moral standing not found' });
        }
        const corruptionLevel = parseFloat(moralStanding.corruptionLevel);
        // Generate shadow confession
        const entry = await noirJournalService_1.noirJournalService.generateShadowConfession(userId, shadowActivity, corruptionLevel);
        res.json(entry);
    }
    catch (error) {
        console.error('Failed to generate confession:', error);
        res.status(500).json({ error: 'Failed to generate confession' });
    }
});
/**
 * GET /api/journal/latest
 * Get the latest journal entry
 */
router.get('/latest', replitAuth_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { entryType } = req.query;
        const entry = await storage_1.storage.getLatestJournalEntry(userId, entryType);
        if (!entry) {
            return res.status(404).json({ error: 'No journal entries found' });
        }
        res.json(entry);
    }
    catch (error) {
        console.error('Failed to fetch latest entry:', error);
        res.status(500).json({ error: 'Failed to fetch latest entry' });
    }
});
exports.default = router;
