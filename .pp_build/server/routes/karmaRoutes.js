"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const replitAuth_js_1 = require("../replitAuth.js");
const karmicAlignmentService_js_1 = require("../services/karmicAlignmentService.js");
const storage_js_1 = require("../storage.js");
const router = (0, express_1.Router)();
// GET /api/karma/alignment - Get user's current alignment data
router.get('/alignment', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const user = await storage_js_1.storage.getUser(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const alignmentData = {
            lawfulChaoticAlignment: parseFloat(user.lawfulChaoticAlignment || '0'),
            goodEvilAlignment: parseFloat(user.goodEvilAlignment || '0'),
            karma: user.karma || 0,
            alignmentRevealed: user.alignmentRevealed || false,
            houseId: user.houseId,
            alignmentLastUpdated: user.alignmentLastUpdated?.toISOString() || new Date().toISOString()
        };
        res.json({
            success: true,
            alignment: alignmentData
        });
    }
    catch (error) {
        console.error('Error fetching alignment data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch alignment data'
        });
    }
});
// POST /api/karma/reveal-alignment - Reveal alignment for first time
router.post('/reveal-alignment', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const user = await storage_js_1.storage.getUser(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (user.alignmentRevealed) {
            return res.json({
                success: true,
                message: 'Alignment already revealed',
                alreadyRevealed: true
            });
        }
        // Update user to mark alignment as revealed
        await storage_js_1.storage.updateUser(userId, {
            alignmentRevealed: true,
            alignmentLastUpdated: new Date(),
            updatedAt: new Date()
        });
        // Record this as a special karma action
        await karmicAlignmentService_js_1.karmicAlignmentService.recordKarmaAction(userId, 'divine_intervention', {
            customDescription: 'The Sacred Scrying Crystal reveals the cosmic truth of your alignment. The veil of mystery is lifted, and your karmic path becomes clear.',
            actionDuration: 0
        });
        res.json({
            success: true,
            message: 'Alignment successfully revealed through sacred scrying',
            cosmicEvent: 'Sacred_Scrying_Revelation'
        });
    }
    catch (error) {
        console.error('Error revealing alignment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reveal alignment'
        });
    }
});
// GET /api/karma/alignment-history - Get user's alignment change history
router.get('/alignment-history/:timeframe?', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const timeframe = req.params.timeframe || 'month';
        let limit = 20;
        // Adjust limit based on timeframe
        switch (timeframe) {
            case 'week':
                limit = 10;
                break;
            case 'month':
                limit = 20;
                break;
            case 'all':
                limit = 100;
                break;
        }
        const history = await karmicAlignmentService_js_1.karmicAlignmentService.getUserAlignmentHistory(userId, limit);
        // Transform for frontend consumption
        const formattedHistory = history.map(event => ({
            id: event.id,
            previousLawfulChaotic: parseFloat(event.previousLawfulChaotic),
            previousGoodEvil: parseFloat(event.previousGoodEvil),
            newLawfulChaotic: parseFloat(event.newLawfulChaotic),
            newGoodEvil: parseFloat(event.newGoodEvil),
            alignmentShiftMagnitude: parseFloat(event.alignmentShiftMagnitude),
            triggeringActionType: event.triggeringActionType,
            karmaAtTimeOfShift: event.karmaAtTimeOfShift,
            alignmentPhase: event.alignmentPhase,
            cosmicEvent: event.cosmicEvent,
            prophecyUnlocked: event.prophecyUnlocked,
            significanceLevel: event.significanceLevel,
            recordedAt: event.recordedAt?.toISOString() || new Date().toISOString()
        }));
        res.json({
            success: true,
            history: formattedHistory,
            timeframe,
            count: formattedHistory.length
        });
    }
    catch (error) {
        console.error('Error fetching alignment history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch alignment history'
        });
    }
});
// GET /api/karma/profile - Get user's detailed karmic profile
router.get('/profile', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const profile = await karmicAlignmentService_js_1.karmicAlignmentService.getUserKarmicProfile(userId);
        if (!profile) {
            return res.json({
                success: true,
                profile: null,
                message: 'Karmic profile not yet formed. Continue trading to develop your cosmic essence.'
            });
        }
        // Transform for frontend consumption
        const formattedProfile = {
            id: profile.id,
            currentAlignmentThreshold: profile.currentAlignmentThreshold,
            alignmentStability: parseFloat(profile.alignmentStability),
            alignmentTrend: profile.alignmentTrend,
            dominantBehaviorPattern: profile.dominantBehaviorPattern,
            secondaryBehaviorPattern: profile.secondaryBehaviorPattern,
            behaviorConsistency: parseFloat(profile.behaviorConsistency),
            tradingPersonality: profile.tradingPersonality,
            riskProfile: profile.riskProfile,
            socialTrading: profile.socialTrading,
            karmaAccelerationRate: parseFloat(profile.karmaAccelerationRate),
            totalKarmaEarned: profile.totalKarmaEarned,
            totalKarmaLost: profile.totalKarmaLost,
            largestKarmaGain: profile.largestKarmaGain,
            largestKarmaLoss: profile.largestKarmaLoss,
            houseAlignmentCompatibility: parseFloat(profile.houseAlignmentCompatibility),
            optimalHouseId: profile.optimalHouseId,
            alignmentConflictLevel: profile.alignmentConflictLevel,
            predictedAlignmentDirection: profile.predictedAlignmentDirection,
            nextThresholdDistance: parseFloat(profile.nextThresholdDistance),
            cosmicResonance: parseFloat(profile.cosmicResonance),
            divineFavor: parseFloat(profile.divineFavor),
            shadowInfluence: parseFloat(profile.shadowInfluence),
            alignmentShiftsCount: profile.alignmentShiftsCount,
            lastMajorShift: profile.lastMajorShift?.toISOString(),
            profileLastCalculated: profile.profileLastCalculated?.toISOString(),
            nextRecalculationDue: profile.nextRecalculationDue?.toISOString()
        };
        res.json({
            success: true,
            profile: formattedProfile
        });
    }
    catch (error) {
        console.error('Error fetching karmic profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch karmic profile'
        });
    }
});
// GET /api/karma/consequences - Get active trading consequences for user
router.get('/consequences', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const consequences = await karmicAlignmentService_js_1.karmicAlignmentService.getActiveTradingConsequences(userId);
        // Transform for frontend consumption
        const formattedConsequences = consequences.map(consequence => ({
            id: consequence.id,
            consequenceType: consequence.consequenceType,
            consequenceCategory: consequence.consequenceCategory,
            modifierValue: parseFloat(consequence.modifierValue),
            modifierType: consequence.modifierType,
            impactDescription: consequence.impactDescription,
            mysticalFlavor: consequence.mysticalFlavor,
            isTemporary: consequence.isTemporary,
            durationMinutes: consequence.durationMinutes,
            expiresAt: consequence.expiresAt?.toISOString(),
            stacksWithOthers: consequence.stacksWithOthers,
            resultingOutcome: consequence.resultingOutcome,
            createdAt: consequence.createdAt?.toISOString() || new Date().toISOString()
        }));
        res.json({
            success: true,
            consequences: formattedConsequences,
            activeCount: formattedConsequences.length
        });
    }
    catch (error) {
        console.error('Error fetching trading consequences:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch trading consequences'
        });
    }
});
// POST /api/karma/action - Record a karma action (for manual testing)
router.post('/action', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const { actionType, context } = req.body;
        if (!actionType) {
            return res.status(400).json({
                success: false,
                error: 'Action type is required'
            });
        }
        // Validate action type
        const validActionTypes = [
            'aggressive_trade', 'patient_trade', 'risky_speculation', 'calculated_investment',
            'panic_selling', 'diamond_hands', 'community_help', 'resource_sharing',
            'market_manipulation', 'insider_trading', 'mentoring_newbie', 'healthy_competition',
            'unsportsmanlike_conduct', 'achievement_unlock', 'house_loyalty', 'house_betrayal',
            'cross_house_collaboration', 'divine_intervention', 'dark_pact', 'cosmic_balance_restored'
        ];
        if (!validActionTypes.includes(actionType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid action type'
            });
        }
        await karmicAlignmentService_js_1.karmicAlignmentService.recordKarmaAction(userId, actionType, context || {});
        res.json({
            success: true,
            message: `Karma action '${actionType}' recorded successfully`,
            actionType
        });
    }
    catch (error) {
        console.error('Error recording karma action:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to record karma action'
        });
    }
});
// GET /api/karma/summary - Get comprehensive karma summary for user
router.get('/summary', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const user = await storage_js_1.storage.getUser(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const profile = await karmicAlignmentService_js_1.karmicAlignmentService.getUserKarmicProfile(userId);
        const consequences = await karmicAlignmentService_js_1.karmicAlignmentService.getActiveTradingConsequences(userId);
        const recentHistory = await karmicAlignmentService_js_1.karmicAlignmentService.getUserAlignmentHistory(userId, 5);
        const summary = {
            alignment: {
                lawfulChaotic: parseFloat(user.lawfulChaoticAlignment || '0'),
                goodEvil: parseFloat(user.goodEvilAlignment || '0'),
                revealed: user.alignmentRevealed || false
            },
            karma: user.karma || 0,
            houseId: user.houseId,
            profile: profile ? {
                stability: parseFloat(profile.alignmentStability),
                trend: profile.alignmentTrend,
                personality: profile.tradingPersonality,
                cosmicResonance: parseFloat(profile.cosmicResonance),
                divineFavor: parseFloat(profile.divineFavor),
                shadowInfluence: parseFloat(profile.shadowInfluence),
                houseCompatibility: parseFloat(profile.houseAlignmentCompatibility)
            } : null,
            activeConsequences: consequences.length,
            recentShifts: recentHistory.length,
            lastUpdate: user.alignmentLastUpdated?.toISOString() || new Date().toISOString()
        };
        res.json({
            success: true,
            summary
        });
    }
    catch (error) {
        console.error('Error fetching karma summary:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch karma summary'
        });
    }
});
exports.default = router;
