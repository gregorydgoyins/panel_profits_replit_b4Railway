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
const express_1 = require("express");
const shadowTradersService_js_1 = require("../services/shadowTradersService.js");
const replitAuth_js_1 = require("../replitAuth.js");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Get all shadow traders
router.get('/api/warfare/shadows', async (req, res) => {
    try {
        const shadows = await shadowTradersService_js_1.shadowTradersService.trackActiveTraders();
        // Add some visual metadata for frontend
        const enhancedShadows = shadows.map(shadow => ({
            ...shadow,
            displayName: shadow.shadowName,
            glowIntensity: parseFloat(shadow.portfolioValue) / 10000, // Normalize for glow effect
            driftSpeed: 1 + Math.random() * 2, // Random drift speed
            startPosition: Math.random() * 100, // Random start position percentage
        }));
        res.json(enhancedShadows);
    }
    catch (error) {
        console.error('Failed to fetch shadow traders:', error);
        res.status(500).json({ error: 'Failed to fetch shadow traders' });
    }
});
// Get fallen traders with stealable positions
router.get('/api/warfare/fallen', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const fallenTraders = await shadowTradersService_js_1.shadowTradersService.getFallenTradersWithPositions();
        // Filter out the requesting user's own fallen status
        const userId = req.user.claims.sub;
        const availableFallen = fallenTraders.filter(f => f.shadow.userId !== userId);
        res.json(availableFallen);
    }
    catch (error) {
        console.error('Failed to fetch fallen traders:', error);
        res.status(500).json({ error: 'Failed to fetch fallen traders' });
    }
});
// Steal positions from fallen trader
const stealPositionSchema = zod_1.z.object({
    fallenTraderId: zod_1.z.string(),
    positionIds: zod_1.z.array(zod_1.z.string()).optional(), // Optional: specific positions to steal
});
router.post('/api/warfare/steal', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const { fallenTraderId, positionIds } = stealPositionSchema.parse(req.body);
        // Prevent self-stealing
        if (fallenTraderId === userId) {
            return res.status(400).json({ error: 'Cannot steal from yourself' });
        }
        const result = await shadowTradersService_js_1.shadowTradersService.enablePositionStealing(userId, fallenTraderId);
        // Return detailed result for UI updates
        res.json({
            success: true,
            stolenPositions: result.stolenPositions,
            warfareRecord: result.warfareRecord,
            totalGain: result.stolenPositions.reduce((sum, p) => sum + parseFloat(p.stolenValue), 0),
            corruptionGained: result.stolenPositions.length * 30,
            message: `Successfully consumed ${result.stolenPositions.length} positions from the fallen`
        });
    }
    catch (error) {
        console.error('Failed to steal positions:', error);
        if (error instanceof Error) {
            if (error.message === 'Target trader is not fallen') {
                return res.status(400).json({ error: 'Target trader is not fallen' });
            }
        }
        res.status(500).json({ error: 'Failed to steal positions' });
    }
});
// Get trader power rankings
router.get('/api/warfare/strength', async (req, res) => {
    try {
        const rankings = await shadowTradersService_js_1.shadowTradersService.getTraderPowerRankings();
        // Add tier classifications
        const tieredRankings = rankings.map(r => ({
            ...r,
            tier: r.rank <= 3 ? 'apex_predator' :
                r.rank <= 10 ? 'hunter' :
                    r.rank <= 20 ? 'scavenger' :
                        r.strength > 1000 ? 'survivor' : 'prey'
        }));
        res.json(tieredRankings);
    }
    catch (error) {
        console.error('Failed to fetch power rankings:', error);
        res.status(500).json({ error: 'Failed to fetch power rankings' });
    }
});
// Detect newly fallen traders (for notifications)
router.get('/api/warfare/detect-fallen', async (req, res) => {
    try {
        const fallen = await shadowTradersService_js_1.shadowTradersService.detectFallenTraders();
        // Return only newly fallen for notifications
        const newlyFallen = fallen.filter(f => {
            if (!f.fallenAt)
                return false;
            const fallenTime = new Date(f.fallenAt).getTime();
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            return fallenTime > fiveMinutesAgo;
        });
        res.json(newlyFallen);
    }
    catch (error) {
        console.error('Failed to detect fallen traders:', error);
        res.status(500).json({ error: 'Failed to detect fallen traders' });
    }
});
// Get warfare history for a user
router.get('/api/warfare/history', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const storage = await Promise.resolve().then(() => __importStar(require('../databaseStorage.js'))).then(m => m.storage);
        const [asAttacker, asDefender] = await Promise.all([
            storage.getTraderWarfareByAttacker(userId),
            storage.getTraderWarfareByDefender(userId)
        ]);
        const history = [...asAttacker, ...asDefender].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json(history);
    }
    catch (error) {
        console.error('Failed to fetch warfare history:', error);
        res.status(500).json({ error: 'Failed to fetch warfare history' });
    }
});
// Get cannibalism stats for user
router.get('/api/warfare/cannibalism-stats', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.claims.sub;
        const storage = await Promise.resolve().then(() => __importStar(require('../databaseStorage.js'))).then(m => m.storage);
        const stolenPositions = await storage.getStolenPositionsByThief(userId);
        const warfareRecords = await storage.getTraderWarfareByAttacker(userId);
        const stats = {
            tradersConsumed: new Set(stolenPositions.map(p => p.victimId)).size,
            positionsStolen: stolenPositions.length,
            totalBloodMoney: stolenPositions.reduce((sum, p) => sum + parseFloat(p.stolenValue), 0),
            totalCorruptionGained: stolenPositions.reduce((sum, p) => sum + parseFloat(p.corruptionGained), 0),
            successfulRaids: warfareRecords.filter(w => w.outcome === 'success').length,
            failedRaids: warfareRecords.filter(w => w.outcome === 'failed').length,
            brutalityScore: warfareRecords.reduce((sum, w) => sum + parseFloat(w.brutalityScore || '0'), 0),
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Failed to fetch cannibalism stats:', error);
        res.status(500).json({ error: 'Failed to fetch cannibalism stats' });
    }
});
exports.default = router;
