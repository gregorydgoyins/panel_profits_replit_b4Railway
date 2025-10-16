"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.karmicAlignmentService = exports.KarmicAlignmentService = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const drizzle_orm_1 = require("drizzle-orm");
const schema_js_1 = require("@shared/schema.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
/**
 * Karmic Alignment Service - Comprehensive karma tracking and alignment calculation
 * Handles the mystical forces that govern trading destiny in the Panel Profits realm
 */
class KarmicAlignmentService {
    constructor() {
        // House-specific karma multipliers and alignment influences
        this.HOUSE_KARMA_MODIFIERS = {
            heroes: {
                karmaMultiplier: 1.2,
                lawfulBias: 0.8, // Heroes tend toward lawful
                goodBias: 0.9, // Heroes tend toward good
                specialties: ['character_trades', 'heroic_actions', 'protective_trades']
            },
            wisdom: {
                karmaMultiplier: 1.15,
                lawfulBias: 0.6, // Scholars prefer order but not rigid
                goodBias: 0.5, // Neutral on good/evil axis
                specialties: ['research_actions', 'educational_sharing', 'analytical_trades']
            },
            power: {
                karmaMultiplier: 1.0,
                lawfulBias: 0.3, // Power can be chaotic or lawful
                goodBias: -0.2, // Slight bias toward pragmatic/evil
                specialties: ['high_volume_trades', 'dominant_actions', 'competitive_plays']
            },
            mystery: {
                karmaMultiplier: 1.25,
                lawfulBias: -0.3, // Mystery prefers unpredictability
                goodBias: 0.3, // Slightly good but enigmatic
                specialties: ['rare_asset_trades', 'unexpected_actions', 'secretive_behavior']
            },
            elements: {
                karmaMultiplier: 1.1,
                lawfulBias: 0.0, // Perfectly balanced
                goodBias: 0.0, // Perfectly balanced
                specialties: ['diversified_trades', 'balanced_actions', 'harmony_seeking']
            },
            time: {
                karmaMultiplier: 1.3,
                lawfulBias: 0.9, // Time values order and patience
                goodBias: 0.4, // Wisdom brings goodness
                specialties: ['patient_trades', 'long_term_actions', 'historical_analysis']
            },
            spirit: {
                karmaMultiplier: 1.25,
                lawfulBias: 0.2, // Community can be organized or free
                goodBias: 0.8, // Community values are inherently good
                specialties: ['social_trades', 'community_actions', 'collaborative_behavior']
            }
        };
        // Action type mappings to karma and alignment impacts
        this.ACTION_KARMA_IMPACTS = {
            // Trading behavior patterns
            aggressive_trade: { karma: -5, lawfulChaotic: -10, goodEvil: -8, severity: 'minor' },
            patient_trade: { karma: 3, lawfulChaotic: 8, goodEvil: 2, severity: 'minor' },
            risky_speculation: { karma: -3, lawfulChaotic: -15, goodEvil: -5, severity: 'minor' },
            calculated_investment: { karma: 5, lawfulChaotic: 12, goodEvil: 3, severity: 'minor' },
            panic_selling: { karma: -8, lawfulChaotic: -20, goodEvil: -10, severity: 'moderate' },
            diamond_hands: { karma: 7, lawfulChaotic: 15, goodEvil: 5, severity: 'minor' },
            // Social and community actions
            community_help: { karma: 10, lawfulChaotic: 5, goodEvil: 15, severity: 'major' },
            resource_sharing: { karma: 8, lawfulChaotic: 3, goodEvil: 12, severity: 'moderate' },
            market_manipulation: { karma: -15, lawfulChaotic: -25, goodEvil: -20, severity: 'severe' },
            insider_trading: { karma: -20, lawfulChaotic: -30, goodEvil: -25, severity: 'severe' },
            mentoring_newbie: { karma: 12, lawfulChaotic: 8, goodEvil: 18, severity: 'major' },
            // Competitive actions
            healthy_competition: { karma: 2, lawfulChaotic: 5, goodEvil: 1, severity: 'minor' },
            unsportsmanlike_conduct: { karma: -10, lawfulChaotic: -15, goodEvil: -18, severity: 'moderate' },
            achievement_unlock: { karma: 5, lawfulChaotic: 3, goodEvil: 2, severity: 'minor' },
            // House-specific actions
            house_loyalty: { karma: 6, lawfulChaotic: 10, goodEvil: 8, severity: 'moderate' },
            house_betrayal: { karma: -25, lawfulChaotic: -40, goodEvil: -30, severity: 'critical' },
            cross_house_collaboration: { karma: 8, lawfulChaotic: -5, goodEvil: 12, severity: 'moderate' },
            // Special mystical actions
            divine_intervention: { karma: 50, lawfulChaotic: 30, goodEvil: 40, severity: 'legendary' },
            dark_pact: { karma: -50, lawfulChaotic: -30, goodEvil: -40, severity: 'legendary' },
            cosmic_balance_restored: { karma: 25, lawfulChaotic: 0, goodEvil: 0, severity: 'critical' }
        };
    }
    /**
     * Record a detailed karma action and calculate alignment impact
     */
    async recordKarmaAction(userId, actionType, context) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0])
            throw new Error('User not found');
        const currentUser = user[0];
        const actionImpact = this.ACTION_KARMA_IMPACTS[actionType];
        const houseModifiers = currentUser.houseId ? this.HOUSE_KARMA_MODIFIERS[currentUser.houseId] : null;
        // Calculate karma change with house modifiers
        const baseKarmaChange = actionImpact.karma;
        const houseMultiplier = houseModifiers?.karmaMultiplier || 1.0;
        const finalKarmaChange = Math.round(baseKarmaChange * houseMultiplier);
        // Calculate alignment impacts with house biases
        const baseLawfulChaoticImpact = actionImpact.lawfulChaotic;
        const baseGoodEvilImpact = actionImpact.goodEvil;
        let finalLawfulChaoticImpact = baseLawfulChaoticImpact;
        let finalGoodEvilImpact = baseGoodEvilImpact;
        if (houseModifiers) {
            // Apply house biases to alignment changes
            finalLawfulChaoticImpact += (Math.abs(baseLawfulChaoticImpact) * houseModifiers.lawfulBias * 0.3);
            finalGoodEvilImpact += (Math.abs(baseGoodEvilImpact) * houseModifiers.goodBias * 0.3);
        }
        // Determine trading behavior pattern
        const behaviorPattern = this.determineBehaviorPattern(actionType, context);
        const mysticalDescription = this.generateMysticalDescription(actionType, currentUser.houseId, actionImpact.severity);
        // Record detailed karma action
        const karmaAction = {
            userId,
            actionType,
            actionCategory: this.categorizeAction(actionType),
            actionSubtype: this.getActionSubtype(actionType),
            karmaChange: finalKarmaChange,
            lawfulChaoticImpact: finalLawfulChaoticImpact.toString(),
            goodEvilImpact: finalGoodEvilImpact.toString(),
            tradingBehaviorPattern: behaviorPattern.trading,
            communityInteraction: behaviorPattern.community,
            riskTakingBehavior: behaviorPattern.risk,
            assetId: context.assetId,
            orderId: context.orderId,
            houseId: currentUser.houseId,
            houseAlignmentBonus: houseMultiplier.toString(),
            tradingConsequenceTriggered: false, // Will be updated if consequence applied
            consequenceSeverity: actionImpact.severity,
            mysticalDescription: context.customDescription || mysticalDescription,
            timeOfDay: this.getCurrentTimeOfDay(),
            tradingVolume: context.tradingVolume?.toString(),
            portfolioValue: context.portfolioValue?.toString(),
            actionDuration: context.actionDuration
        };
        await db.insert(schema_js_1.detailedKarmaActions).values(karmaAction);
        // Update user's alignment and karma
        await this.updateUserAlignment(userId, finalKarmaChange, finalLawfulChaoticImpact, finalGoodEvilImpact);
        // Check for threshold crossings and consequences
        await this.checkAlignmentThresholds(userId);
    }
    /**
     * Update user's karma and alignment values
     */
    async updateUserAlignment(userId, karmaChange, lawfulChaoticImpact, goodEvilImpact) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0])
            return;
        const currentUser = user[0];
        // Calculate new values
        const newKarma = (currentUser.karma || 0) + karmaChange;
        const currentLC = parseFloat(currentUser.lawfulChaoticAlignment || '0');
        const currentGE = parseFloat(currentUser.goodEvilAlignment || '0');
        // Apply dampening for extreme values to prevent runaway alignment
        const lcDampening = Math.abs(currentLC) > 80 ? 0.5 : 1.0;
        const geDampening = Math.abs(currentGE) > 80 ? 0.5 : 1.0;
        const newLawfulChaotic = Math.max(-100, Math.min(100, currentLC + (lawfulChaoticImpact * lcDampening)));
        const newGoodEvil = Math.max(-100, Math.min(100, currentGE + (goodEvilImpact * geDampening)));
        // Check if this is a significant alignment shift
        const alignmentShift = Math.sqrt(Math.pow(newLawfulChaotic - currentLC, 2) + Math.pow(newGoodEvil - currentGE, 2));
        // Record alignment history if significant change
        if (alignmentShift >= 5.0) {
            await this.recordAlignmentHistory(userId, {
                previousLawfulChaotic: currentLC.toString(),
                previousGoodEvil: currentGE.toString(),
                newLawfulChaotic: newLawfulChaotic.toString(),
                newGoodEvil: newGoodEvil.toString(),
                alignmentShiftMagnitude: alignmentShift.toString(),
                triggeringActionType: 'karma_accumulation',
                karmaAtTimeOfShift: newKarma,
                houseId: currentUser.houseId,
                alignmentPhase: this.determineAlignmentPhase(alignmentShift),
                significanceLevel: this.determineSignificanceLevel(alignmentShift)
            });
        }
        // Update user record
        await db.update(schema_js_1.users)
            .set({
            karma: newKarma,
            lawfulChaoticAlignment: newLawfulChaotic.toString(),
            goodEvilAlignment: newGoodEvil.toString(),
            alignmentLastUpdated: new Date(),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId));
        // Update or create karmic profile
        await this.updateKarmicProfile(userId);
    }
    /**
     * Record significant alignment history events
     */
    async recordAlignmentHistory(userId, historyData) {
        const alignmentRecord = {
            userId,
            previousLawfulChaotic: historyData.previousLawfulChaotic || '0',
            previousGoodEvil: historyData.previousGoodEvil || '0',
            newLawfulChaotic: historyData.newLawfulChaotic || '0',
            newGoodEvil: historyData.newGoodEvil || '0',
            alignmentShiftMagnitude: historyData.alignmentShiftMagnitude || '0',
            triggeringActionType: historyData.triggeringActionType || 'unknown',
            triggeringActionId: historyData.triggeringActionId,
            karmaAtTimeOfShift: historyData.karmaAtTimeOfShift || 0,
            houseId: historyData.houseId,
            alignmentPhase: historyData.alignmentPhase || 'journey',
            cosmicEvent: this.generateCosmicEvent(),
            prophecyUnlocked: this.generateProphecy(historyData.alignmentPhase || 'journey'),
            significanceLevel: historyData.significanceLevel || 'minor'
        };
        await db.insert(schema_js_1.alignmentHistory).values(alignmentRecord);
    }
    /**
     * Check if user has crossed any alignment thresholds
     */
    async checkAlignmentThresholds(userId) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0])
            return;
        const currentUser = user[0];
        const lawfulChaotic = parseFloat(currentUser.lawfulChaoticAlignment || '0');
        const goodEvil = parseFloat(currentUser.goodEvilAlignment || '0');
        const karma = currentUser.karma || 0;
        // Get all active thresholds
        const thresholds = await db.select()
            .from(schema_js_1.alignmentThresholds)
            .where((0, drizzle_orm_1.eq)(schema_js_1.alignmentThresholds.isActive, true));
        // Check each threshold
        for (const threshold of thresholds) {
            const withinLCRange = this.isWithinRange(lawfulChaotic, threshold.minLawfulChaotic, threshold.maxLawfulChaotic);
            const withinGERange = this.isWithinRange(goodEvil, threshold.minGoodEvil, threshold.maxGoodEvil);
            const withinKarmaRange = this.isWithinRange(karma, threshold.minKarma, threshold.maxKarma);
            if (withinLCRange && withinGERange && withinKarmaRange) {
                await this.applyAlignmentThreshold(userId, threshold);
            }
        }
    }
    /**
     * Apply trading consequences based on alignment threshold
     */
    async applyAlignmentThreshold(userId, threshold) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0])
            return;
        const tradingBonuses = threshold.tradingBonuses;
        if (!tradingBonuses)
            return;
        // Create trading consequences for each bonus
        for (const [bonusType, bonusValue] of Object.entries(tradingBonuses)) {
            const consequence = {
                userId,
                userLawfulChaotic: user[0].lawfulChaoticAlignment || '0',
                userGoodEvil: user[0].goodEvilAlignment || '0',
                userKarma: user[0].karma || 0,
                userHouseId: user[0].houseId,
                consequenceType: bonusType,
                consequenceCategory: 'alignment_threshold_bonus',
                modifierValue: bonusValue.toString(),
                modifierType: 'multiplier',
                impactDescription: `${threshold.cosmicTitle} grants enhanced ${bonusType}`,
                mysticalFlavor: `The cosmic forces align to grant you the power of ${threshold.cosmicTitle}. ${threshold.mysticalDescription}`,
                isTemporary: false,
                stacksWithOthers: true,
                consequenceApplied: true,
                resultingOutcome: 'success'
            };
            await db.insert(schema_js_1.tradingConsequences).values(consequence);
        }
    }
    /**
     * Update or create comprehensive karmic profile for user
     */
    async updateKarmicProfile(userId) {
        const user = await db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, userId)).limit(1);
        if (!user[0])
            return;
        const currentUser = user[0];
        // Get recent karma actions for pattern analysis
        const recentActions = await db.select()
            .from(schema_js_1.detailedKarmaActions)
            .where((0, drizzle_orm_1.eq)(schema_js_1.detailedKarmaActions.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.detailedKarmaActions.createdAt))
            .limit(50);
        // Analyze behavioral patterns
        const behaviorAnalysis = this.analyzeBehaviorPatterns(recentActions);
        // Calculate karma statistics
        const karmaStats = this.calculateKarmaStats(recentActions);
        // Determine alignment stability and trend
        const alignmentAnalysis = await this.analyzeAlignmentTrend(userId);
        // Create or update karmic profile
        const profileData = {
            userId,
            alignmentStability: alignmentAnalysis.stability.toString(),
            alignmentTrend: alignmentAnalysis.trend,
            dominantBehaviorPattern: behaviorAnalysis.dominant,
            secondaryBehaviorPattern: behaviorAnalysis.secondary,
            behaviorConsistency: behaviorAnalysis.consistency.toString(),
            tradingPersonality: this.determineTradingPersonality(behaviorAnalysis),
            riskProfile: behaviorAnalysis.riskProfile,
            socialTrading: behaviorAnalysis.socialBehavior,
            karmaAccelerationRate: karmaStats.accelerationRate.toString(),
            totalKarmaEarned: karmaStats.totalEarned,
            totalKarmaLost: karmaStats.totalLost,
            largestKarmaGain: karmaStats.largestGain,
            largestKarmaLoss: karmaStats.largestLoss,
            houseAlignmentCompatibility: this.calculateHouseCompatibility(currentUser),
            optimalHouseId: this.determineOptimalHouse(currentUser),
            alignmentConflictLevel: this.determineConflictLevel(currentUser),
            predictedAlignmentDirection: alignmentAnalysis.predictedDirection,
            nextThresholdDistance: alignmentAnalysis.nextThresholdDistance.toString(),
            cosmicResonance: this.calculateCosmicResonance(currentUser).toString(),
            divineFavor: this.calculateDivineFavor(currentUser).toString(),
            shadowInfluence: this.calculateShadowInfluence(currentUser).toString(),
            alignmentShiftsCount: alignmentAnalysis.shiftsCount,
            lastMajorShift: alignmentAnalysis.lastMajorShift,
            nextRecalculationDue: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        };
        // Check if profile exists
        const existingProfile = await db.select()
            .from(schema_js_1.karmicProfiles)
            .where((0, drizzle_orm_1.eq)(schema_js_1.karmicProfiles.userId, userId))
            .limit(1);
        if (existingProfile[0]) {
            await db.update(schema_js_1.karmicProfiles)
                .set({ ...profileData, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_js_1.karmicProfiles.userId, userId));
        }
        else {
            await db.insert(schema_js_1.karmicProfiles).values(profileData);
        }
    }
    // Helper methods for calculations and analysis
    determineBehaviorPattern(actionType, context) {
        const patterns = {
            trading: 'balanced',
            community: 'neutral',
            risk: 'moderate'
        };
        // Analyze trading behavior
        if (['aggressive_trade', 'panic_selling', 'risky_speculation'].includes(actionType)) {
            patterns.trading = 'aggressive';
            patterns.risk = 'reckless';
        }
        else if (['patient_trade', 'calculated_investment', 'diamond_hands'].includes(actionType)) {
            patterns.trading = 'patient';
            patterns.risk = 'conservative';
        }
        // Analyze community behavior
        if (['community_help', 'resource_sharing', 'mentoring_newbie'].includes(actionType)) {
            patterns.community = 'helpful';
        }
        else if (['market_manipulation', 'unsportsmanlike_conduct'].includes(actionType)) {
            patterns.community = 'harmful';
        }
        return patterns;
    }
    categorizeAction(actionType) {
        if (actionType.includes('trade') || actionType.includes('selling') || actionType.includes('investment')) {
            return 'trading';
        }
        else if (actionType.includes('community') || actionType.includes('sharing') || actionType.includes('mentoring')) {
            return 'social';
        }
        else if (actionType.includes('competition') || actionType.includes('achievement')) {
            return 'competitive';
        }
        else if (actionType.includes('house') || actionType.includes('divine') || actionType.includes('cosmic')) {
            return 'mystical';
        }
        return 'general';
    }
    getActionSubtype(actionType) {
        return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    generateMysticalDescription(actionType, houseId, severity) {
        const houseDescriptions = {
            heroes: "The sacred flames of heroism burn within your actions",
            wisdom: "Ancient knowledge guides your mystical path",
            power: "Imperial authority flows through your trading commands",
            mystery: "Enigmatic forces shape your mysterious destiny",
            elements: "Elemental balance resonates through your choices",
            time: "The eternal flow of time blesses your patience",
            spirit: "Community bonds strengthen your spiritual essence"
        };
        const severityDescriptions = {
            minor: "A gentle ripple in the cosmic order",
            moderate: "The celestial spheres take notice",
            major: "Divine attention focuses upon your actions",
            severe: "The cosmic balance trembles",
            critical: "Reality itself shifts in response",
            legendary: "Legends speak of such deeds across the ages"
        };
        const houseDesc = houseId ? houseDescriptions[houseId] : "Mystical energies swirl around your unaligned soul";
        const severityDesc = severityDescriptions[severity];
        return `${houseDesc}. ${severityDesc}. The karmic threads of fate weave a new pattern in the grand tapestry of trading destiny.`;
    }
    getCurrentTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 6)
            return 'night';
        if (hour < 9)
            return 'dawn';
        if (hour < 12)
            return 'morning';
        if (hour < 15)
            return 'midday';
        if (hour < 18)
            return 'afternoon';
        if (hour < 21)
            return 'evening';
        return 'night';
    }
    determineAlignmentPhase(shiftMagnitude) {
        if (shiftMagnitude < 10)
            return 'awakening';
        if (shiftMagnitude < 25)
            return 'journey';
        if (shiftMagnitude < 50)
            return 'transformation';
        return 'mastery';
    }
    determineSignificanceLevel(shiftMagnitude) {
        if (shiftMagnitude < 5)
            return 'minor';
        if (shiftMagnitude < 15)
            return 'moderate';
        if (shiftMagnitude < 30)
            return 'major';
        if (shiftMagnitude < 50)
            return 'critical';
        return 'legendary';
    }
    generateCosmicEvent() {
        const events = [
            'solar_eclipse', 'lunar_blessing', 'stellar_alignment', 'cosmic_convergence',
            'divine_intervention', 'shadow_whispers', 'elemental_awakening', 'temporal_flux',
            'spiritual_ascension', 'karmic_resonance', 'celestial_dance', 'void_touching'
        ];
        return events[Math.floor(Math.random() * events.length)];
    }
    generateProphecy(phase) {
        const prophecies = {
            awakening: "As dawn breaks upon the mystical realm, new powers stir within...",
            journey: "The path forward reveals itself to those who seek balance...",
            transformation: "Great change approaches on wings of cosmic fire...",
            mastery: "The ancient powers recognize a worthy bearer of destiny..."
        };
        return prophecies[phase] || prophecies.journey;
    }
    isWithinRange(value, min, max) {
        if (min !== null && value < parseFloat(min))
            return false;
        if (max !== null && value > parseFloat(max))
            return false;
        return true;
    }
    analyzeBehaviorPatterns(actions) {
        // Analyze dominant patterns from recent actions
        const tradingPatterns = actions.map(a => a.tradingBehaviorPattern).filter(Boolean);
        const communityPatterns = actions.map(a => a.communityInteraction).filter(Boolean);
        const riskPatterns = actions.map(a => a.riskTakingBehavior).filter(Boolean);
        return {
            dominant: this.getMostCommon(tradingPatterns) || 'balanced',
            secondary: this.getSecondMostCommon(tradingPatterns) || 'exploring',
            consistency: this.calculateConsistency(tradingPatterns),
            riskProfile: this.getMostCommon(riskPatterns) || 'moderate',
            socialBehavior: this.getMostCommon(communityPatterns) || 'neutral'
        };
    }
    calculateKarmaStats(actions) {
        const karmaChanges = actions.map(a => a.karmaChange).filter(k => k !== null);
        const totalEarned = karmaChanges.filter(k => k > 0).reduce((sum, k) => sum + k, 0);
        const totalLost = Math.abs(karmaChanges.filter(k => k < 0).reduce((sum, k) => sum + k, 0));
        return {
            accelerationRate: actions.length > 10 ? Math.min(3.0, actions.length / 10) : 1.0,
            totalEarned,
            totalLost,
            largestGain: Math.max(...karmaChanges.filter(k => k > 0), 0),
            largestLoss: Math.abs(Math.min(...karmaChanges.filter(k => k < 0), 0))
        };
    }
    async analyzeAlignmentTrend(userId) {
        const history = await db.select()
            .from(schema_js_1.alignmentHistory)
            .where((0, drizzle_orm_1.eq)(schema_js_1.alignmentHistory.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.alignmentHistory.recordedAt))
            .limit(10);
        const shiftsCount = history.length;
        const lastMajorShift = history.find(h => ['major', 'critical', 'legendary'].includes(h.significanceLevel || ''))?.recordedAt || null;
        return {
            stability: shiftsCount < 3 ? 90 : Math.max(20, 90 - (shiftsCount * 8)),
            trend: this.calculateAlignmentTrend(history),
            predictedDirection: this.predictAlignmentDirection(history),
            nextThresholdDistance: 25.0, // Placeholder calculation
            shiftsCount,
            lastMajorShift
        };
    }
    calculateAlignmentTrend(history) {
        if (history.length < 2)
            return 'stable';
        const recent = history[0];
        const older = history[1];
        const recentMagnitude = parseFloat(recent.alignmentShiftMagnitude || '0');
        const olderMagnitude = parseFloat(older.alignmentShiftMagnitude || '0');
        if (recentMagnitude > olderMagnitude * 1.2)
            return 'ascending';
        if (recentMagnitude < olderMagnitude * 0.8)
            return 'descending';
        return 'stable';
    }
    predictAlignmentDirection(history) {
        // Simplified prediction based on recent trends
        if (history.length === 0)
            return 'unknown';
        const recentShifts = history.slice(0, 3);
        const avgLCChange = recentShifts.reduce((sum, h) => {
            const lcChange = parseFloat(h.newLawfulChaotic) - parseFloat(h.previousLawfulChaotic);
            return sum + lcChange;
        }, 0) / recentShifts.length;
        const avgGEChange = recentShifts.reduce((sum, h) => {
            const geChange = parseFloat(h.newGoodEvil) - parseFloat(h.previousGoodEvil);
            return sum + geChange;
        }, 0) / recentShifts.length;
        if (Math.abs(avgLCChange) > Math.abs(avgGEChange)) {
            return avgLCChange > 0 ? 'toward_lawful' : 'toward_chaotic';
        }
        else {
            return avgGEChange > 0 ? 'toward_good' : 'toward_evil';
        }
    }
    determineTradingPersonality(analysis) {
        const { dominant, riskProfile, socialBehavior } = analysis;
        if (dominant === 'patient' && riskProfile === 'conservative')
            return 'patient_strategist';
        if (dominant === 'aggressive' && riskProfile === 'reckless')
            return 'aggressive_opportunist';
        if (socialBehavior === 'helpful')
            return 'community_leader';
        if (socialBehavior === 'competitive')
            return 'competitive_trader';
        return 'balanced_explorer';
    }
    calculateHouseCompatibility(user) {
        if (!user.houseId)
            return 50.0;
        const houseModifiers = this.HOUSE_KARMA_MODIFIERS[user.houseId];
        const userLC = parseFloat(user.lawfulChaoticAlignment || '0');
        const userGE = parseFloat(user.goodEvilAlignment || '0');
        // Calculate how well user alignment matches house preferences
        const lcCompatibility = 100 - Math.abs(userLC - (houseModifiers.lawfulBias * 100));
        const geCompatibility = 100 - Math.abs(userGE - (houseModifiers.goodBias * 100));
        return (lcCompatibility + geCompatibility) / 2;
    }
    determineOptimalHouse(user) {
        const userLC = parseFloat(user.lawfulChaoticAlignment || '0');
        const userGE = parseFloat(user.goodEvilAlignment || '0');
        let bestHouse = 'elements'; // Default balanced house
        let bestCompatibility = 0;
        for (const [houseId, modifiers] of Object.entries(this.HOUSE_KARMA_MODIFIERS)) {
            const lcDiff = Math.abs(userLC - (modifiers.lawfulBias * 100));
            const geDiff = Math.abs(userGE - (modifiers.goodBias * 100));
            const compatibility = 100 - ((lcDiff + geDiff) / 2);
            if (compatibility > bestCompatibility) {
                bestCompatibility = compatibility;
                bestHouse = houseId;
            }
        }
        return bestHouse;
    }
    determineConflictLevel(user) {
        const compatibility = this.calculateHouseCompatibility(user);
        if (compatibility >= 80)
            return 'none';
        if (compatibility >= 60)
            return 'minor';
        if (compatibility >= 40)
            return 'moderate';
        return 'severe';
    }
    calculateCosmicResonance(user) {
        const karma = user.karma || 0;
        const alignment = Math.sqrt(Math.pow(parseFloat(user.lawfulChaoticAlignment || '0'), 2) +
            Math.pow(parseFloat(user.goodEvilAlignment || '0'), 2));
        return Math.min(100, (karma / 10) + (alignment / 2));
    }
    calculateDivineFavor(user) {
        const karma = user.karma || 0;
        const goodAlignment = parseFloat(user.goodEvilAlignment || '0');
        return Math.max(0, Math.min(100, (karma / 5) + goodAlignment));
    }
    calculateShadowInfluence(user) {
        const karma = user.karma || 0;
        const evilAlignment = -parseFloat(user.goodEvilAlignment || '0');
        return Math.max(0, Math.min(100, (-karma / 5) + evilAlignment));
    }
    // Utility methods
    getMostCommon(arr) {
        if (arr.length === 0)
            return null;
        const counts = arr.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
    }
    getSecondMostCommon(arr) {
        if (arr.length < 2)
            return null;
        const counts = arr.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted[1] ? sorted[1][0] : null;
    }
    calculateConsistency(patterns) {
        if (patterns.length === 0)
            return 50;
        const mostCommon = this.getMostCommon(patterns);
        if (!mostCommon)
            return 50;
        const count = patterns.filter(p => p === mostCommon).length;
        return (count / patterns.length) * 100;
    }
    /**
     * Get current user's karmic profile with alignment analysis
     */
    async getUserKarmicProfile(userId) {
        const profile = await db.select()
            .from(schema_js_1.karmicProfiles)
            .where((0, drizzle_orm_1.eq)(schema_js_1.karmicProfiles.userId, userId))
            .limit(1);
        return profile[0] || null;
    }
    /**
     * Get user's alignment history for timeline display
     */
    async getUserAlignmentHistory(userId, limit = 20) {
        return await db.select()
            .from(schema_js_1.alignmentHistory)
            .where((0, drizzle_orm_1.eq)(schema_js_1.alignmentHistory.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.alignmentHistory.recordedAt))
            .limit(limit);
    }
    /**
     * Get active trading consequences for user
     */
    async getActiveTradingConsequences(userId) {
        return await db.select()
            .from(schema_js_1.tradingConsequences)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.tradingConsequences.userId, userId), (0, drizzle_orm_1.eq)(schema_js_1.tradingConsequences.consequenceApplied, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.tradingConsequences.createdAt));
    }
}
exports.KarmicAlignmentService = KarmicAlignmentService;
// Export singleton instance
exports.karmicAlignmentService = new KarmicAlignmentService();
