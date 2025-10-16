"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.narrativeTradingMetricsService = exports.NarrativeTradingMetricsService = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const drizzle_orm_1 = require("drizzle-orm");
const schema_js_1 = require("@shared/schema.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
/**
 * Narrative Trading Metrics Service for Phase 2
 * Revolutionary system connecting comic book mythology to sophisticated financial trading
 */
class NarrativeTradingMetricsService {
    constructor() {
        // Trading House Themes and Characteristics
        this.HOUSE_THEMES = {
            heroes: {
                keywords: ['hero', 'captain', 'spider', 'superman', 'wonder', 'flash', 'heroic', 'justice', 'protect'],
                volatilityProfile: 'moderate',
                baseVolatilityMultiplier: 1.2,
                trendStrengthModifier: 1.3,
                meanReversionFactor: 0.15,
                marketPatternType: 'heroic_growth',
                riskToleranceLevel: 'moderate',
                leveragePreference: 1.1,
                cosmicEventSensitivity: 0.8,
                specialtyAssetTypes: ['character', 'comic'],
                weaknessAssetTypes: ['publisher'],
                tradingBonusPercentage: 0.05,
                penaltyPercentage: 0.02
            },
            wisdom: {
                keywords: ['doctor', 'professor', 'sage', 'oracle', 'scholar', 'strange', 'detective', 'mystery'],
                volatilityProfile: 'stable',
                baseVolatilityMultiplier: 0.8,
                trendStrengthModifier: 0.9,
                meanReversionFactor: 0.25,
                marketPatternType: 'wisdom_stability',
                riskToleranceLevel: 'conservative',
                leveragePreference: 0.9,
                cosmicEventSensitivity: 0.6,
                specialtyAssetTypes: ['creator', 'publisher'],
                weaknessAssetTypes: ['character'],
                tradingBonusPercentage: 0.03,
                penaltyPercentage: 0.01
            },
            power: {
                keywords: ['hulk', 'thor', 'strength', 'cosmic', 'phoenix', 'galactus', 'omega', 'infinity'],
                volatilityProfile: 'extreme',
                baseVolatilityMultiplier: 2.5,
                trendStrengthModifier: 1.8,
                meanReversionFactor: 0.05,
                marketPatternType: 'power_volatility',
                riskToleranceLevel: 'extreme',
                leveragePreference: 1.5,
                cosmicEventSensitivity: 2.0,
                specialtyAssetTypes: ['character'],
                weaknessAssetTypes: ['publisher', 'creator'],
                tradingBonusPercentage: 0.15,
                penaltyPercentage: 0.10
            },
            mystery: {
                keywords: ['batman', 'shadow', 'night', 'dark', 'mystic', 'occult', 'secret', 'hidden'],
                volatilityProfile: 'chaotic',
                baseVolatilityMultiplier: 1.8,
                trendStrengthModifier: 0.7,
                meanReversionFactor: 0.08,
                marketPatternType: 'mystery_unpredictable',
                riskToleranceLevel: 'aggressive',
                leveragePreference: 1.3,
                cosmicEventSensitivity: 1.2,
                specialtyAssetTypes: ['character', 'comic'],
                weaknessAssetTypes: ['creator'],
                tradingBonusPercentage: 0.12,
                penaltyPercentage: 0.08
            },
            elements: {
                keywords: ['storm', 'fire', 'ice', 'earth', 'water', 'elemental', 'nature', 'environment'],
                volatilityProfile: 'moderate',
                baseVolatilityMultiplier: 1.1,
                trendStrengthModifier: 1.1,
                meanReversionFactor: 0.12,
                marketPatternType: 'elemental_cycles',
                riskToleranceLevel: 'moderate',
                leveragePreference: 1.0,
                cosmicEventSensitivity: 0.9,
                specialtyAssetTypes: ['character', 'comic'],
                weaknessAssetTypes: ['publisher'],
                tradingBonusPercentage: 0.08,
                penaltyPercentage: 0.04
            },
            time: {
                keywords: ['time', 'temporal', 'chrono', 'speed', 'future', 'past', 'timeline', 'paradox'],
                volatilityProfile: 'high',
                baseVolatilityMultiplier: 1.6,
                trendStrengthModifier: 0.8,
                meanReversionFactor: 0.20,
                marketPatternType: 'temporal_paradox',
                riskToleranceLevel: 'aggressive',
                leveragePreference: 1.2,
                cosmicEventSensitivity: 1.5,
                specialtyAssetTypes: ['character'],
                weaknessAssetTypes: ['creator', 'publisher'],
                tradingBonusPercentage: 0.10,
                penaltyPercentage: 0.06
            },
            spirit: {
                keywords: ['ghost', 'spirit', 'soul', 'astral', 'phantom', 'supernatural', 'afterlife', 'mystical'],
                volatilityProfile: 'high',
                baseVolatilityMultiplier: 1.4,
                trendStrengthModifier: 1.0,
                meanReversionFactor: 0.18,
                marketPatternType: 'mystical_patterns',
                riskToleranceLevel: 'aggressive',
                leveragePreference: 1.1,
                cosmicEventSensitivity: 1.3,
                specialtyAssetTypes: ['character', 'comic'],
                weaknessAssetTypes: ['creator'],
                tradingBonusPercentage: 0.09,
                penaltyPercentage: 0.05
            }
        };
        // Power Level Impact Factors
        this.POWER_LEVEL_FACTORS = {
            'Street Level': { volatilityFactor: 0.8, momentumMultiplier: 0.9, marginRequirement: 45.0 },
            'Enhanced Human': { volatilityFactor: 1.0, momentumMultiplier: 1.0, marginRequirement: 50.0 },
            'Superhuman': { volatilityFactor: 1.3, momentumMultiplier: 1.2, marginRequirement: 60.0 },
            'Cosmic': { volatilityFactor: 2.5, momentumMultiplier: 2.0, marginRequirement: 85.0 },
            'Omega Level': { volatilityFactor: 3.5, momentumMultiplier: 3.0, marginRequirement: 100.0 },
            'Universal': { volatilityFactor: 5.0, momentumMultiplier: 4.0, marginRequirement: 150.0 }
        };
        // Story Beat Impact Multipliers
        this.STORY_BEAT_IMPACTS = {
            'character_death': { volatilitySpike: 0.8, momentumShift: -0.5, priceImpact: -0.15 },
            'resurrection': { volatilitySpike: 1.2, momentumShift: 0.8, priceImpact: 0.25 },
            'power_upgrade': { volatilitySpike: 0.6, momentumShift: 0.4, priceImpact: 0.12 },
            'power_loss': { volatilitySpike: 0.7, momentumShift: -0.3, priceImpact: -0.08 },
            'identity_reveal': { volatilitySpike: 0.9, momentumShift: 0.2, priceImpact: 0.05 },
            'team_formation': { volatilitySpike: 0.4, momentumShift: 0.3, priceImpact: 0.08 },
            'betrayal': { volatilitySpike: 1.1, momentumShift: -0.4, priceImpact: -0.12 },
            'cosmic_event': { volatilitySpike: 2.0, momentumShift: 1.0, priceImpact: 0.30 },
            'origin_story': { volatilitySpike: 0.3, momentumShift: 0.6, priceImpact: 0.10 },
            'finale': { volatilitySpike: 0.8, momentumShift: -0.2, priceImpact: 0.05 }
        };
        console.log('🔮 Narrative Trading Metrics Service: Connecting mythology to market movements...');
    }
    /**
     * Initialize the Seven Houses Financial Profiles
     */
    async initializeHouseFinancialProfiles() {
        console.log('🏛️ Initializing Seven Houses Financial Profiles...');
        for (const [houseId, profile] of Object.entries(this.HOUSE_THEMES)) {
            try {
                // Check if profile already exists
                const existingProfile = await db.select()
                    .from(schema_js_1.houseFinancialProfiles)
                    .where((0, drizzle_orm_1.eq)(schema_js_1.houseFinancialProfiles.houseId, houseId))
                    .limit(1);
                if (existingProfile.length > 0) {
                    console.log(`📊 House ${houseId} profile already exists, skipping...`);
                    continue;
                }
                // Create house financial profile
                const houseProfile = {
                    houseId: houseId,
                    houseName: `House of ${houseId.charAt(0).toUpperCase() + houseId.slice(1)}`,
                    volatilityProfile: profile.volatilityProfile,
                    baseVolatilityMultiplier: profile.baseVolatilityMultiplier.toString(),
                    trendStrengthModifier: profile.trendStrengthModifier.toString(),
                    meanReversionFactor: profile.meanReversionFactor.toString(),
                    marketPatternType: profile.marketPatternType,
                    riskToleranceLevel: profile.riskToleranceLevel,
                    leveragePreference: profile.leveragePreference.toString(),
                    cosmicEventSensitivity: profile.cosmicEventSensitivity.toString(),
                    specialtyAssetTypes: profile.specialtyAssetTypes,
                    weaknessAssetTypes: profile.weaknessAssetTypes,
                    tradingBonusPercentage: profile.tradingBonusPercentage.toString(),
                    penaltyPercentage: profile.penaltyPercentage.toString(),
                    // Complex JSONB fields
                    seasonalityPattern: this.generateSeasonalityPattern(houseId),
                    eventResponseProfile: this.generateEventResponseProfile(houseId),
                    storyBeatMultipliers: this.generateStoryBeatMultipliers(houseId),
                    characterPowerLevelWeights: this.generatePowerLevelWeights(houseId),
                    alignmentRequirements: this.generateAlignmentRequirements(houseId),
                    synergisticHouses: this.getSynergisticHouses(houseId),
                    conflictingHouses: this.getConflictingHouses(houseId)
                };
                await db.insert(schema_js_1.houseFinancialProfiles).values(houseProfile);
                console.log(`✨ Created House ${houseId} financial profile`);
            }
            catch (error) {
                console.error(`❌ Error creating House ${houseId} profile:`, error);
            }
        }
    }
    /**
     * Calculate Mythic Volatility Score for an asset
     */
    async calculateMythicVolatility(asset, characterData) {
        let mythicVolatility = 0.025; // Base 2.5% volatility
        try {
            // Character Power Level Factor
            if (characterData?.powerLevel) {
                const powerFactor = this.POWER_LEVEL_FACTORS[characterData.powerLevel];
                if (powerFactor) {
                    mythicVolatility *= powerFactor.volatilityFactor;
                }
            }
            // House Affiliation Multiplier
            const houseAffiliation = await this.determineHouseAffiliation(asset, characterData);
            if (houseAffiliation) {
                const houseProfile = this.HOUSE_THEMES[houseAffiliation];
                if (houseProfile) {
                    mythicVolatility *= houseProfile.baseVolatilityMultiplier;
                }
            }
            // Story Arc Phase Adjustment
            const storyArcPhase = await this.determineStoryArcPhase(asset);
            mythicVolatility *= this.getStoryArcVolatilityMultiplier(storyArcPhase);
            // Recent Cosmic Events Boost
            const cosmicEventBoost = await this.calculateCosmicEventBoost(asset);
            mythicVolatility += cosmicEventBoost;
            // Cap volatility at reasonable bounds
            return Math.min(Math.max(mythicVolatility, 0.001), 10.0);
        }
        catch (error) {
            console.error('Error calculating mythic volatility:', error);
            return 0.025; // Return base volatility on error
        }
    }
    /**
     * Calculate Narrative Momentum Score
     */
    async calculateNarrativeMomentum(asset, characterData) {
        let narrativeMomentum = 0.0;
        try {
            // Cultural Impact Index
            const culturalImpact = await this.calculateCulturalImpact(asset, characterData);
            narrativeMomentum += culturalImpact * 0.4;
            // Story Progression Rate
            const progressionRate = await this.calculateStoryProgressionRate(asset);
            narrativeMomentum += progressionRate * 0.3;
            // Theme Relevance Score
            const themeRelevance = await this.calculateThemeRelevance(asset);
            narrativeMomentum += themeRelevance * 0.2;
            // Media Boost Factor (movies, TV shows, comics)
            const mediaBoost = await this.calculateMediaBoost(asset);
            narrativeMomentum += mediaBoost * 0.1;
            // Apply momentum decay for older events
            const decayFactor = await this.calculateMomentumDecay(asset);
            narrativeMomentum *= decayFactor;
            // Normalize to -5.0 to 5.0 range
            return Math.min(Math.max(narrativeMomentum, -5.0), 5.0);
        }
        catch (error) {
            console.error('Error calculating narrative momentum:', error);
            return 0.0;
        }
    }
    /**
     * Generate comprehensive trading metrics for an asset
     */
    async generateTradingMetrics(assetId) {
        try {
            // Get asset and character data
            const asset = await db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, assetId)).limit(1);
            if (!asset[0])
                throw new Error(`Asset ${assetId} not found`);
            let characterData;
            if (asset[0].type === 'character') {
                const characters = await db.select().from(schema_js_1.enhancedCharacters)
                    .where((0, drizzle_orm_1.eq)(schema_js_1.enhancedCharacters.name, asset[0].name))
                    .limit(1);
                characterData = characters[0];
            }
            // Calculate core metrics
            const mythicVolatilityScore = await this.calculateMythicVolatility(asset[0], characterData);
            const narrativeMomentumScore = await this.calculateNarrativeMomentum(asset[0], characterData);
            const houseAffiliation = await this.determineHouseAffiliation(asset[0], characterData);
            // House-specific calculations
            const houseProfile = houseAffiliation ? this.HOUSE_THEMES[houseAffiliation] : null;
            const houseVolatilityProfile = houseProfile?.volatilityProfile || 'moderate';
            const houseTradingMultiplier = houseProfile?.baseVolatilityMultiplier || 1.0;
            const houseSpecialtyBonus = this.calculateHouseSpecialtyBonus(asset[0], houseProfile);
            // Enhanced margin and risk calculations
            const narrativeMarginRequirement = await this.calculateNarrativeMarginRequirement(asset[0], characterData);
            const storyRiskAdjustment = await this.calculateStoryRiskAdjustment(asset[0]);
            const volatilityRiskPremium = mythicVolatilityScore > 0.1 ? mythicVolatilityScore * 0.02 : 0.0;
            // Story beat sensitivity and impact factors
            const storyBeatSensitivity = await this.calculateStoryBeatSensitivity(asset[0]);
            const characterDeathImpact = await this.calculateCharacterDeathImpact(asset[0], characterData);
            const powerUpgradeImpact = await this.calculatePowerUpgradeImpact(asset[0], characterData);
            const resurrectionImpact = await this.calculateResurrectionImpact(asset[0], characterData);
            // Cultural and temporal factors
            const culturalImpactIndex = await this.calculateCulturalImpact(asset[0], characterData);
            const storyProgressionRate = await this.calculateStoryProgressionRate(asset[0]);
            const themeRelevanceScore = await this.calculateThemeRelevance(asset[0]);
            const mediaBoostFactor = await this.calculateMediaBoost(asset[0]);
            const momentumDecayRate = await this.calculateMomentumDecay(asset[0]);
            // Narrative correlation strength
            const narrativeCorrelationStrength = await this.calculateNarrativeCorrelation(asset[0]);
            // Temporal predictions
            const lastNarrativeEvent = await this.getLastNarrativeEvent(assetId);
            const nextPredictedEvent = await this.predictNextNarrativeEvent(assetId);
            const storyArcPhase = await this.determineStoryArcPhase(asset[0]);
            const seasonalNarrativePattern = JSON.stringify(this.generateSeasonalNarrativePattern(asset[0]));
            // Performance metrics
            const metricsReliabilityScore = await this.calculateMetricsReliability(assetId);
            const predictionAccuracy = await this.calculatePredictionAccuracy(assetId);
            // Construct narrative trading metrics
            const tradingMetrics = {
                assetId: assetId,
                // Mythic Volatility Metrics
                mythicVolatilityScore: mythicVolatilityScore.toString(),
                baseVolatility: "0.0250",
                storyArcVolatilityMultiplier: this.getStoryArcVolatilityMultiplier(storyArcPhase).toString(),
                powerLevelVolatilityFactor: characterData ?
                    (this.POWER_LEVEL_FACTORS[characterData.powerLevel]?.volatilityFactor || 1.0).toString() : "1.0000",
                cosmicEventVolatilityBoost: (await this.calculateCosmicEventBoost(asset[0])).toString(),
                // Narrative Momentum Tracking
                narrativeMomentumScore: narrativeMomentumScore.toString(),
                culturalImpactIndex: culturalImpactIndex.toString(),
                storyProgressionRate: storyProgressionRate.toString(),
                themeRelevanceScore: themeRelevanceScore.toString(),
                mediaBoostFactor: mediaBoostFactor.toString(),
                momentumDecayRate: momentumDecayRate.toString(),
                // House-Based Financial Modifiers
                houseAffiliation: houseAffiliation,
                houseVolatilityProfile: houseVolatilityProfile,
                houseTradingMultiplier: houseTradingMultiplier.toString(),
                houseSpecialtyBonus: houseSpecialtyBonus.toString(),
                // Narrative Correlation Factors
                narrativeCorrelationStrength: narrativeCorrelationStrength.toString(),
                storyBeatSensitivity: storyBeatSensitivity.toString(),
                characterDeathImpact: characterDeathImpact.toString(),
                powerUpgradeImpact: powerUpgradeImpact.toString(),
                resurrectionImpact: resurrectionImpact.toString(),
                // Enhanced Margin and Risk Calculations
                narrativeMarginRequirement: narrativeMarginRequirement.toString(),
                storyRiskAdjustment: storyRiskAdjustment.toString(),
                volatilityRiskPremium: volatilityRiskPremium.toString(),
                // Temporal Factors
                lastNarrativeEvent: lastNarrativeEvent,
                nextPredictedEvent: nextPredictedEvent,
                storyArcPhase: storyArcPhase,
                seasonalNarrativePattern: seasonalNarrativePattern,
                // Performance Tracking
                metricsReliabilityScore: metricsReliabilityScore.toString(),
                predictionAccuracy: predictionAccuracy.toString(),
                calculationVersion: 1
            };
            return tradingMetrics;
        }
        catch (error) {
            console.error(`Error generating trading metrics for asset ${assetId}:`, error);
            throw error;
        }
    }
    /**
     * Process story events and create market triggers
     */
    async processStoryEventTriggers(storyBeat) {
        const triggerIds = [];
        try {
            // Determine trigger severity based on story beat type and content
            const eventSeverity = this.assessEventSeverity(storyBeat);
            const triggerType = this.classifyTriggerType(storyBeat);
            // Calculate market impact based on story beat
            const beatImpact = this.STORY_BEAT_IMPACTS[storyBeat.beatType] ||
                { volatilitySpike: 0.1, momentumShift: 0.0, priceImpact: 0.0 };
            // Get affected assets
            const affectedAssets = await this.getAffectedAssets(storyBeat);
            const houseResponseMultipliers = this.calculateHouseResponseMultipliers(storyBeat);
            // Create story event trigger
            const trigger = {
                triggerName: `${storyBeat.beatTitle} - ${storyBeat.beatType}`,
                triggerType: triggerType,
                eventSeverity: eventSeverity,
                storyBeatId: storyBeat.id,
                characterId: storyBeat.primaryCharacterId,
                timelineId: storyBeat.timelineId,
                priceImpactRange: {
                    min: beatImpact.priceImpact * 0.5,
                    max: beatImpact.priceImpact * 1.5
                },
                volatilityImpactMultiplier: (1 + beatImpact.volatilitySpike).toString(),
                volumeImpactMultiplier: (1 + Math.abs(beatImpact.priceImpact) * 2).toString(),
                sentimentShift: beatImpact.momentumShift.toString(),
                affectedAssetTypes: this.determineAffectedAssetTypes(storyBeat),
                directlyAffectedAssets: affectedAssets.direct,
                indirectlyAffectedAssets: affectedAssets.indirect,
                houseResponseMultipliers: houseResponseMultipliers,
                crossHouseEffects: this.calculateCrossHouseEffects(storyBeat),
                immediateImpactDuration: this.calculateImpactDuration(eventSeverity, 'immediate'),
                mediumTermEffectDuration: this.calculateImpactDuration(eventSeverity, 'medium'),
                longTermMemoryDecay: this.calculateMemoryDecay(eventSeverity).toString(),
                triggerConditions: this.generateTriggerConditions(storyBeat),
                cooldownPeriod: this.calculateCooldownPeriod(eventSeverity),
                maxActivationsPerDay: this.calculateMaxActivations(eventSeverity)
            };
            const [insertedTrigger] = await db.insert(schema_js_1.storyEventTriggers).values(trigger).returning();
            triggerIds.push(insertedTrigger.id);
            console.log(`🎬 Created story event trigger: ${trigger.triggerName}`);
        }
        catch (error) {
            console.error('Error processing story event trigger:', error);
        }
        return triggerIds;
    }
    /**
     * Generate enhanced market insights with narrative-driven sentiment
     */
    async generateNarrativeMarketInsights(assetId) {
        const insights = [];
        try {
            // Get asset and its narrative trading metrics
            const asset = await db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, assetId)).limit(1);
            if (!asset[0])
                return insights;
            const metrics = await db.select().from(schema_js_1.narrativeTradingMetrics)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, assetId))
                .limit(1);
            if (!metrics[0])
                return insights;
            // Generate insights based on narrative metrics
            const volatilityInsight = this.generateVolatilityInsight(asset[0], metrics[0]);
            const momentumInsight = this.generateMomentumInsight(asset[0], metrics[0]);
            const houseInsight = this.generateHouseSpecificInsight(asset[0], metrics[0]);
            const storyArcInsight = this.generateStoryArcInsight(asset[0], metrics[0]);
            insights.push(volatilityInsight, momentumInsight, houseInsight, storyArcInsight);
            console.log(`📊 Generated ${insights.length} narrative market insights for ${asset[0].name}`);
        }
        catch (error) {
            console.error('Error generating narrative market insights:', error);
        }
        return insights;
    }
    /**
     * Update all asset trading metrics (batch processing)
     */
    async updateAllTradingMetrics() {
        let updatedCount = 0;
        try {
            console.log('🔄 Starting batch update of all trading metrics...');
            // Get all assets
            const allAssets = await db.select().from(schema_js_1.assets);
            // Process in batches of 50
            const batchSize = 50;
            for (let i = 0; i < allAssets.length; i += batchSize) {
                const batch = allAssets.slice(i, i + batchSize);
                for (const asset of batch) {
                    try {
                        // Check if metrics exist
                        const existingMetrics = await db.select()
                            .from(schema_js_1.narrativeTradingMetrics)
                            .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, asset.id))
                            .limit(1);
                        const newMetrics = await this.generateTradingMetrics(asset.id);
                        if (existingMetrics.length > 0) {
                            // Update existing metrics
                            await db.update(schema_js_1.narrativeTradingMetrics)
                                .set(newMetrics)
                                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, asset.id));
                        }
                        else {
                            // Insert new metrics
                            await db.insert(schema_js_1.narrativeTradingMetrics).values(newMetrics);
                        }
                        updatedCount++;
                    }
                    catch (error) {
                        console.error(`Error updating metrics for asset ${asset.id}:`, error);
                    }
                }
                // Brief pause between batches to avoid overwhelming the database
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            console.log(`✅ Updated trading metrics for ${updatedCount} assets`);
        }
        catch (error) {
            console.error('Error in batch trading metrics update:', error);
        }
        return updatedCount;
    }
    // ========================================================================================
    // PRIVATE HELPER METHODS
    // ========================================================================================
    async determineHouseAffiliation(asset, characterData) {
        // Use character data or asset metadata to determine house affiliation
        const searchText = `${asset.name} ${asset.description || ''} ${characterData?.alignment || ''} ${characterData?.abilities?.join(' ') || ''}`.toLowerCase();
        let bestMatch = { house: null, score: 0 };
        for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
            let score = 0;
            for (const keyword of houseData.keywords) {
                if (searchText.includes(keyword)) {
                    score += 1;
                }
            }
            if (score > bestMatch.score) {
                bestMatch = { house: houseId, score };
            }
        }
        return bestMatch.score > 0 ? bestMatch.house : 'heroes'; // Default to heroes
    }
    async determineStoryArcPhase(asset) {
        // Analyze recent story beats to determine current phase
        try {
            const recentTimelines = await db.select()
                .from(schema_js_1.narrativeTimelines)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTimelines.primaryCharacter, asset.name))
                .orderBy((0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.createdAt))
                .limit(3);
            if (recentTimelines.length > 0) {
                const timeline = recentTimelines[0];
                // Analyze timeline progress to determine phase
                return timeline.currentPhase || 'rising_action';
            }
        }
        catch (error) {
            console.error('Error determining story arc phase:', error);
        }
        return 'rising_action'; // Default phase
    }
    getStoryArcVolatilityMultiplier(phase) {
        const multipliers = {
            'origin': 1.2,
            'rising_action': 1.1,
            'climax': 1.8,
            'falling_action': 0.9,
            'resolution': 0.8
        };
        return multipliers[phase] || 1.0;
    }
    async calculateCosmicEventBoost(asset) {
        // Check for recent cosmic-level events affecting this asset
        try {
            const recentCosmicEvents = await db.select()
                .from(schema_js_1.storyBeats)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.beatType, 'cosmic_event'), (0, drizzle_orm_1.gte)(schema_js_1.storyBeats.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
            ))
                .limit(5);
            return recentCosmicEvents.length * 0.05; // 5% boost per recent cosmic event
        }
        catch (error) {
            return 0.0;
        }
    }
    async calculateCulturalImpact(asset, characterData) {
        // Calculate cultural relevance based on appearances, fan data, media presence
        let impact = 1.0;
        if (characterData) {
            // Factor in appearance count
            if (characterData.appearances) {
                impact += Math.log10(characterData.appearances + 1) * 0.1;
            }
            // Factor in power level cultural significance
            if (characterData.powerLevel === 'Cosmic' || characterData.powerLevel === 'Universal') {
                impact += 0.3;
            }
        }
        return Math.min(impact, 3.0); // Cap at 3.0
    }
    async calculateStoryProgressionRate(asset) {
        // Analyze frequency of story beats for this asset
        try {
            const recentBeats = await db.select()
                .from(schema_js_1.storyBeats)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.primaryCharacterId, asset.id), (0, drizzle_orm_1.gte)(schema_js_1.storyBeats.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
            ));
            return Math.min(recentBeats.length * 0.1, 2.0); // 0.1 per recent beat, capped at 2.0
        }
        catch (error) {
            return 0.0;
        }
    }
    async calculateThemeRelevance(asset) {
        // Calculate how relevant the asset is to current trending themes
        // This could be enhanced with AI analysis of current comic trends
        return 1.0; // Placeholder - could integrate with trending analysis
    }
    async calculateMediaBoost(asset) {
        // Check for recent movie/TV show releases
        try {
            const recentMovies = await db.select()
                .from(schema_js_1.moviePerformanceData)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.moviePerformanceData.primaryCharacter, asset.name), (0, drizzle_orm_1.gte)(schema_js_1.moviePerformanceData.releaseDate, new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)) // Last 6 months
            ));
            return Math.min(recentMovies.length * 0.2, 1.0); // 0.2 boost per recent movie/show
        }
        catch (error) {
            return 1.0;
        }
    }
    async calculateMomentumDecay(asset) {
        // Calculate how much momentum has decayed based on time since last event
        try {
            const lastEvent = await this.getLastNarrativeEvent(asset.id);
            if (!lastEvent)
                return 0.95; // Slight decay if no events
            const daysSinceEvent = (Date.now() - lastEvent.getTime()) / (24 * 60 * 60 * 1000);
            const decayRate = 0.02; // 2% decay per day
            return Math.max(1.0 - (daysSinceEvent * decayRate), 0.5); // Minimum 50% retention
        }
        catch (error) {
            return 0.95;
        }
    }
    calculateHouseSpecialtyBonus(asset, houseProfile) {
        if (!houseProfile)
            return 0.0;
        const isSpecialty = houseProfile.specialtyAssetTypes.includes(asset.type);
        const isWeakness = houseProfile.weaknessAssetTypes.includes(asset.type);
        if (isSpecialty)
            return houseProfile.tradingBonusPercentage;
        if (isWeakness)
            return -houseProfile.penaltyPercentage;
        return 0.0;
    }
    async calculateNarrativeMarginRequirement(asset, characterData) {
        let baseMargin = 50.0;
        if (characterData?.powerLevel) {
            const powerFactor = this.POWER_LEVEL_FACTORS[characterData.powerLevel];
            if (powerFactor) {
                baseMargin = powerFactor.marginRequirement;
            }
        }
        return baseMargin;
    }
    async calculateStoryRiskAdjustment(asset) {
        // Adjust risk based on story volatility and unpredictability
        const storyArcPhase = await this.determineStoryArcPhase(asset);
        const adjustments = {
            'origin': 0.02,
            'rising_action': 0.05,
            'climax': 0.15,
            'falling_action': 0.03,
            'resolution': 0.01
        };
        return adjustments[storyArcPhase] || 0.05;
    }
    // Additional helper methods would continue here...
    // For brevity, I'm including key methods but there would be many more helper functions
    generateSeasonalityPattern(houseId) {
        // Generate seasonal trading patterns for each house
        const patterns = {
            heroes: { Q1: 1.1, Q2: 1.2, Q3: 1.0, Q4: 1.15 }, // Summer blockbuster boost
            wisdom: { Q1: 1.0, Q2: 1.0, Q3: 1.0, Q4: 1.0 }, // Stable year-round
            power: { Q1: 1.2, Q2: 1.3, Q3: 1.1, Q4: 1.25 }, // High volatility with peaks
            mystery: { Q1: 0.9, Q2: 1.1, Q3: 1.2, Q4: 1.3 }, // Dark themes peak in fall/winter
            elements: { Q1: 1.1, Q2: 1.2, Q3: 1.3, Q4: 0.9 }, // Nature themes peak in spring/summer
            time: { Q1: 1.0, Q2: 1.1, Q3: 1.0, Q4: 1.2 }, // Sci-fi themes
            spirit: { Q1: 1.0, Q2: 0.9, Q3: 1.1, Q4: 1.4 } // Supernatural themes peak in October
        };
        return patterns[houseId] || patterns.heroes;
    }
    generateEventResponseProfile(houseId) {
        // Define how each house responds to different types of events
        return {
            character_death: this.HOUSE_THEMES[houseId]?.baseVolatilityMultiplier || 1.0,
            power_upgrade: (this.HOUSE_THEMES[houseId]?.baseVolatilityMultiplier || 1.0) * 0.8,
            cosmic_event: (this.HOUSE_THEMES[houseId]?.cosmicEventSensitivity || 1.0),
            team_formation: 1.1,
            betrayal: 1.3,
            resurrection: 1.5
        };
    }
    generateStoryBeatMultipliers(houseId) {
        const baseMultiplier = this.HOUSE_THEMES[houseId]?.baseVolatilityMultiplier || 1.0;
        return {
            introduction: baseMultiplier * 0.8,
            climax: baseMultiplier * 1.5,
            resolution: baseMultiplier * 0.9,
            plot_twist: baseMultiplier * 1.3,
            character_death: baseMultiplier * 1.4,
            power_revelation: baseMultiplier * 1.2
        };
    }
    generatePowerLevelWeights(houseId) {
        const sensitivity = this.HOUSE_THEMES[houseId]?.cosmicEventSensitivity || 1.0;
        return {
            'Street Level': 0.8 * sensitivity,
            'Enhanced Human': 1.0 * sensitivity,
            'Superhuman': 1.2 * sensitivity,
            'Cosmic': 1.8 * sensitivity,
            'Omega Level': 2.5 * sensitivity,
            'Universal': 3.0 * sensitivity
        };
    }
    generateAlignmentRequirements(houseId) {
        const requirements = {
            heroes: { good_evil_min: 20, lawful_chaotic_min: -50 },
            wisdom: { good_evil_min: 0, lawful_chaotic_min: 0 },
            power: { good_evil_min: -100, lawful_chaotic_min: -100 },
            mystery: { good_evil_min: -20, lawful_chaotic_min: -20 },
            elements: { good_evil_min: -10, lawful_chaotic_min: -30 },
            time: { good_evil_min: -30, lawful_chaotic_min: -10 },
            spirit: { good_evil_min: 10, lawful_chaotic_min: -40 }
        };
        return requirements[houseId] || requirements.heroes;
    }
    getSynergisticHouses(houseId) {
        const synergies = {
            heroes: ['wisdom', 'spirit'],
            wisdom: ['heroes', 'time'],
            power: ['mystery', 'elements'],
            mystery: ['power', 'spirit'],
            elements: ['power', 'time'],
            time: ['wisdom', 'elements'],
            spirit: ['heroes', 'mystery']
        };
        return synergies[houseId] || [];
    }
    getConflictingHouses(houseId) {
        const conflicts = {
            heroes: ['power', 'mystery'],
            wisdom: ['power'],
            power: ['heroes', 'wisdom'],
            mystery: ['heroes'],
            elements: [],
            time: [],
            spirit: []
        };
        return conflicts[houseId] || [];
    }
    // Additional helper methods for market insight generation
    generateVolatilityInsight(asset, metrics) {
        const volatility = parseFloat(metrics.mythicVolatilityScore);
        let category;
        let title;
        let content;
        if (volatility > 0.15) {
            category = 'alert';
            title = `High Mythic Volatility Alert: ${asset.name}`;
            content = `${asset.name} is experiencing elevated volatility (${(volatility * 100).toFixed(1)}%) due to narrative events. House ${metrics.houseAffiliation} traders should exercise caution.`;
        }
        else if (volatility > 0.08) {
            category = 'bullish';
            title = `Moderate Volatility Opportunity: ${asset.name}`;
            content = `${asset.name} shows moderate volatility (${(volatility * 100).toFixed(1)}%) creating potential trading opportunities for experienced traders.`;
        }
        else {
            category = 'neutral';
            title = `Stable Trading Environment: ${asset.name}`;
            content = `${asset.name} maintains low volatility (${(volatility * 100).toFixed(1)}%), suitable for conservative trading strategies.`;
        }
        return {
            assetId: asset.id,
            title,
            content,
            sentimentScore: volatility > 0.1 ? "-0.3" : "0.1",
            confidence: "0.85",
            tags: ['volatility', 'mythic-trading', metrics.houseAffiliation || 'neutral'],
            source: 'Narrative Trading Metrics',
            category
        };
    }
    generateMomentumInsight(asset, metrics) {
        const momentum = parseFloat(metrics.narrativeMomentumScore);
        let category;
        let title;
        let content;
        if (momentum > 1.0) {
            category = 'bullish';
            title = `Strong Narrative Momentum: ${asset.name}`;
            content = `${asset.name} shows strong positive momentum (${momentum.toFixed(2)}) driven by story progression and cultural impact.`;
        }
        else if (momentum < -1.0) {
            category = 'bearish';
            title = `Negative Momentum Warning: ${asset.name}`;
            content = `${asset.name} faces negative momentum (${momentum.toFixed(2)}) following recent narrative developments.`;
        }
        else {
            category = 'neutral';
            title = `Balanced Momentum: ${asset.name}`;
            content = `${asset.name} maintains neutral momentum (${momentum.toFixed(2)}) with balanced narrative factors.`;
        }
        return {
            assetId: asset.id,
            title,
            content,
            sentimentScore: (momentum / 5.0).toFixed(2), // Normalize to -1 to 1 range
            confidence: "0.78",
            tags: ['momentum', 'narrative-analysis', metrics.houseAffiliation || 'neutral'],
            source: 'Narrative Momentum Tracker',
            category
        };
    }
    generateHouseSpecificInsight(asset, metrics) {
        const house = metrics.houseAffiliation || 'neutral';
        const multiplier = parseFloat(metrics.houseTradingMultiplier);
        return {
            assetId: asset.id,
            title: `House ${house.charAt(0).toUpperCase() + house.slice(1)} Trading Profile: ${asset.name}`,
            content: `As a ${house} house asset, ${asset.name} exhibits ${this.HOUSE_THEMES[house]?.volatilityProfile || 'moderate'} volatility patterns with a ${multiplier.toFixed(2)}x trading multiplier. Recommended for traders aligned with ${house} house strategies.`,
            sentimentScore: (multiplier - 1.0).toFixed(2),
            confidence: "0.90",
            tags: ['house-trading', house, 'specialization'],
            source: 'House Financial Profiles',
            category: 'neutral'
        };
    }
    generateStoryArcInsight(asset, metrics) {
        const phase = metrics.storyArcPhase || 'unknown';
        const phaseDescriptions = {
            'origin': 'establishing foundational value with growth potential',
            'rising_action': 'building momentum toward major developments',
            'climax': 'experiencing peak volatility and maximum trading opportunity',
            'falling_action': 'consolidating gains following major events',
            'resolution': 'entering stable phase with reduced volatility'
        };
        return {
            assetId: asset.id,
            title: `Story Arc Analysis: ${asset.name} in ${phase} Phase`,
            content: `${asset.name} is currently in the ${phase} phase of its narrative arc, ${phaseDescriptions[phase] || 'with uncertain market implications'}. Trading strategies should account for phase-specific volatility patterns.`,
            sentimentScore: this.getPhasesentiment(phase).toFixed(2),
            confidence: "0.82",
            tags: ['story-arc', 'phase-analysis', phase],
            source: 'Narrative Arc Tracker',
            category: this.getPhaseCategory(phase)
        };
    }
    getPhaseCategory(phase) {
        const categories = {
            'origin': 'bullish',
            'rising_action': 'bullish',
            'climax': 'alert',
            'falling_action': 'bearish',
            'resolution': 'neutral'
        };
        return categories[phase] || 'neutral';
    }
    getPhasesentiment(phase) {
        const sentiments = {
            'origin': 0.3,
            'rising_action': 0.5,
            'climax': 0.1, // High volatility but uncertain direction
            'falling_action': -0.2,
            'resolution': 0.0
        };
        return sentiments[phase] || 0.0;
    }
    // Additional utility methods...
    async getLastNarrativeEvent(assetId) {
        try {
            const lastEvent = await db.select()
                .from(schema_js_1.storyBeats)
                .where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.primaryCharacterId, assetId))
                .orderBy((0, drizzle_orm_1.desc)(schema_js_1.storyBeats.createdAt))
                .limit(1);
            return lastEvent[0]?.createdAt || null;
        }
        catch (error) {
            return null;
        }
    }
    async predictNextNarrativeEvent(assetId) {
        // Simplified prediction - could be enhanced with AI analysis
        const lastEvent = await this.getLastNarrativeEvent(assetId);
        if (lastEvent) {
            // Predict next event in 30-90 days based on historical patterns
            const daysToAdd = 30 + Math.random() * 60;
            return new Date(lastEvent.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        }
        return null;
    }
    generateSeasonalNarrativePattern(asset) {
        // Generate 12-month narrative pattern (simplified)
        return Array.from({ length: 12 }, (_, i) => 0.8 + 0.4 * Math.sin((i + 3) * Math.PI / 6) // Seasonal wave pattern
        );
    }
    async calculateMetricsReliability(assetId) {
        // Calculate how reliable our metrics are based on data quality
        // This would analyze data completeness, recency, source reliability
        return 0.75; // Placeholder - 75% reliability
    }
    async calculatePredictionAccuracy(assetId) {
        // Calculate how accurate our previous predictions were
        // This would compare predicted vs actual market movements
        return 0.65; // Placeholder - 65% accuracy
    }
    // Story event processing helper methods
    assessEventSeverity(storyBeat) {
        const severityKeywords = {
            'universe_altering': ['multiverse', 'reality', 'universe', 'dimensional', 'cosmic crisis'],
            'cosmic': ['galactus', 'infinity', 'cosmic', 'celestial', 'abstract'],
            'major': ['death', 'resurrection', 'identity', 'reveal', 'wedding', 'betrayal'],
            'moderate': ['fight', 'team', 'conflict', 'discovery', 'relationship'],
            'minor': ['training', 'daily', 'conversation', 'travel', 'research']
        };
        const content = `${storyBeat.beatTitle} ${storyBeat.description || ''}`.toLowerCase();
        for (const [severity, keywords] of Object.entries(severityKeywords)) {
            if (keywords.some(keyword => content.includes(keyword))) {
                return severity;
            }
        }
        return 'moderate';
    }
    classifyTriggerType(storyBeat) {
        if (storyBeat.beatType.includes('cosmic'))
            return 'cosmic_event';
        if (storyBeat.beatType.includes('character'))
            return 'character_event';
        if (storyBeat.mediaReferences && storyBeat.mediaReferences.length > 0)
            return 'media_release';
        return 'story_beat';
    }
    async getAffectedAssets(storyBeat) {
        const direct = [];
        const indirect = [];
        // Direct effects - primary character and related assets
        if (storyBeat.primaryCharacterId) {
            direct.push(storyBeat.primaryCharacterId);
        }
        // Indirect effects - team members, related characters, same universe
        // This would require more complex relationship analysis
        return { direct, indirect };
    }
    calculateHouseResponseMultipliers(storyBeat) {
        const multipliers = {};
        for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
            // Calculate how this house would respond to this story beat
            const eventResponse = this.generateEventResponseProfile(houseId);
            const beatTypeMultiplier = eventResponse[storyBeat.beatType] || 1.0;
            multipliers[houseId] = beatTypeMultiplier;
        }
        return multipliers;
    }
    calculateCrossHouseEffects(storyBeat) {
        // Calculate secondary effects between houses
        return {
            alliance_effects: [], // Houses that might form temporary alliances
            conflict_effects: [], // Houses that might be in opposition
            neutral_effects: [] // Houses unaffected
        };
    }
    determineAffectedAssetTypes(storyBeat) {
        const types = ['character'];
        if (storyBeat.beatType.includes('comic') || storyBeat.mediaReferences?.length > 0) {
            types.push('comic');
        }
        if (storyBeat.beatCategory === 'team_moment') {
            types.push('creator'); // Team stories often affect creators
        }
        return types;
    }
    calculateImpactDuration(severity, term) {
        const durations = {
            immediate: {
                'minor': 60, // 1 hour
                'moderate': 240, // 4 hours  
                'major': 720, // 12 hours
                'cosmic': 1440, // 24 hours
                'universe_altering': 2880 // 48 hours
            },
            medium: {
                'minor': 1440, // 1 day
                'moderate': 4320, // 3 days
                'major': 10080, // 7 days
                'cosmic': 20160, // 14 days
                'universe_altering': 43200 // 30 days
            }
        };
        return durations[term]?.[severity] || durations[term]?.['moderate'] || 1440;
    }
    calculateMemoryDecay(severity) {
        const decayRates = {
            'minor': 0.05, // 5% daily decay
            'moderate': 0.03, // 3% daily decay
            'major': 0.02, // 2% daily decay
            'cosmic': 0.01, // 1% daily decay
            'universe_altering': 0.005 // 0.5% daily decay
        };
        return decayRates[severity] || 0.03;
    }
    generateTriggerConditions(storyBeat) {
        return {
            required_phase: null, // Required story arc phase
            character_alive: true, // Character must be alive
            minimum_relevance: 0.1, // Minimum narrative relevance
            cooldown_elapsed: true, // Cooldown period must have passed
            market_conditions: 'any' // Market state requirements
        };
    }
    calculateCooldownPeriod(severity) {
        const cooldowns = {
            'minor': 60, // 1 hour
            'moderate': 240, // 4 hours
            'major': 720, // 12 hours
            'cosmic': 1440, // 24 hours
            'universe_altering': 4320 // 72 hours
        };
        return cooldowns[severity] || 240;
    }
    calculateMaxActivations(severity) {
        const maxActivations = {
            'minor': 10,
            'moderate': 5,
            'major': 3,
            'cosmic': 2,
            'universe_altering': 1
        };
        return maxActivations[severity] || 5;
    }
    async calculateStoryBeatSensitivity(asset) {
        // How sensitive this asset is to story beat changes
        const assetType = asset.type;
        const sensitivities = {
            'character': 1.0,
            'comic': 0.8,
            'creator': 0.6,
            'publisher': 0.4
        };
        return sensitivities[assetType] || 0.5;
    }
    async calculateCharacterDeathImpact(asset, characterData) {
        if (!characterData)
            return 0.0;
        // Higher impact for more popular/powerful characters
        let impact = 0.1; // Base impact
        if (characterData.powerLevel === 'Cosmic' || characterData.powerLevel === 'Universal') {
            impact += 0.3;
        }
        if (characterData.appearances && characterData.appearances > 1000) {
            impact += 0.2;
        }
        return Math.min(impact, 1.0);
    }
    async calculatePowerUpgradeImpact(asset, characterData) {
        if (!characterData)
            return 0.0;
        // Power upgrades have positive impact
        let impact = 0.08; // Base positive impact
        if (characterData.powerLevel === 'Enhanced Human' || characterData.powerLevel === 'Street Level') {
            impact += 0.12; // Bigger impact for lower-tier characters getting upgrades
        }
        return Math.min(impact, 0.5);
    }
    async calculateResurrectionImpact(asset, characterData) {
        if (!characterData)
            return 0.0;
        // Resurrections typically have large positive impact
        let impact = 0.2; // Base resurrection impact
        if (characterData.powerLevel === 'Cosmic' || characterData.powerLevel === 'Universal') {
            impact += 0.3; // Cosmic characters returning is huge
        }
        return Math.min(impact, 0.8);
    }
    async calculateNarrativeCorrelation(asset) {
        // How strongly correlated this asset is with narrative events
        const assetType = asset.type;
        const correlations = {
            'character': 0.9,
            'comic': 0.7,
            'creator': 0.5,
            'publisher': 0.3
        };
        return correlations[assetType] || 0.5;
    }
}
exports.NarrativeTradingMetricsService = NarrativeTradingMetricsService;
// Export singleton instance
exports.narrativeTradingMetricsService = new NarrativeTradingMetricsService();
