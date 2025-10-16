"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.narrativeMarketIntegration = exports.NarrativeMarketIntegration = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const drizzle_orm_1 = require("drizzle-orm");
const narrativeTradingMetricsService_js_1 = require("./narrativeTradingMetricsService.js");
const schema_js_1 = require("@shared/schema.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
/**
 * Narrative Market Integration Service
 * Connects story events to real-time market movements and price adjustments
 */
class NarrativeMarketIntegration {
    constructor() {
        this.marketSimulationEngine = null;
        this.activeMarketEvents = new Map();
        this.narrativeEventQueue = [];
        this.processingInterval = null;
        // Configuration Constants
        this.NARRATIVE_UPDATE_INTERVAL = 30000; // 30 seconds
        this.MAX_PRICE_IMPACT = 0.50; // Maximum 50% price impact from single narrative event
        this.MIN_PRICE_IMPACT = 0.001; // Minimum 0.1% price impact
        this.EVENT_MEMORY_HOURS = 168; // 7 days event memory
        this.MAX_CONCURRENT_EVENTS = 10; // Maximum simultaneous narrative events affecting one asset
        // Price Impact Curves by Event Severity
        this.SEVERITY_IMPACT_CURVES = {
            'minor': { immediate: 0.02, peak: 0.05, decay: 0.95 },
            'moderate': { immediate: 0.05, peak: 0.12, decay: 0.90 },
            'major': { immediate: 0.12, peak: 0.25, decay: 0.85 },
            'cosmic': { immediate: 0.25, peak: 0.50, decay: 0.80 },
            'universe_altering': { immediate: 0.40, peak: 0.75, decay: 0.75 }
        };
        // House Volatility Response Patterns
        this.HOUSE_VOLATILITY_RESPONSES = {
            heroes: { multiplier: 1.2, stability: 0.8, recovery: 1.1 },
            wisdom: { multiplier: 0.8, stability: 1.4, recovery: 1.3 },
            power: { multiplier: 2.2, stability: 0.4, recovery: 0.7 },
            mystery: { multiplier: 1.8, stability: 0.6, recovery: 0.9 },
            elements: { multiplier: 1.1, stability: 0.9, recovery: 1.0 },
            time: { multiplier: 1.6, stability: 0.7, recovery: 1.2 },
            spirit: { multiplier: 1.4, stability: 0.8, recovery: 1.1 }
        };
        console.log('🎭 Narrative Market Integration: Connecting story events to market dynamics...');
    }
    /**
     * Initialize narrative market integration with market simulation engine
     */
    async initialize(marketEngine) {
        this.marketSimulationEngine = marketEngine;
        // Load active narrative market events
        await this.loadActiveNarrativeEvents();
        // Start narrative event processing
        this.startNarrativeEventProcessing();
        console.log('📈 Narrative Market Integration initialized with market simulation engine');
    }
    /**
     * Process a new story beat and trigger market events
     */
    async processStoryBeat(storyBeat) {
        try {
            console.log(`🎬 Processing story beat: ${storyBeat.beatTitle}`);
            // Generate story event triggers
            const triggerIds = await narrativeTradingMetricsService_js_1.narrativeTradingMetricsService.processStoryEventTriggers(storyBeat);
            // Process each trigger to create market events
            for (const triggerId of triggerIds) {
                await this.processEventTrigger(triggerId);
            }
            // Update affected asset trading metrics
            await this.updateAffectedAssetMetrics(storyBeat);
        }
        catch (error) {
            console.error('Error processing story beat:', error);
        }
    }
    /**
     * Apply narrative-driven price adjustments to market simulation
     */
    async applyNarrativePriceAdjustments(assetId, currentPrice) {
        try {
            // Get narrative trading metrics for asset
            const metrics = await db.select()
                .from(schema_js_1.narrativeTradingMetrics)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, assetId))
                .limit(1);
            if (!metrics[0])
                return currentPrice;
            // Get active narrative events affecting this asset
            const activeEvents = await this.getActiveEventsForAsset(assetId);
            if (activeEvents.length === 0)
                return currentPrice;
            let adjustedPrice = currentPrice;
            let totalVolatilityAdjustment = 0;
            // Apply each active event's impact
            for (const event of activeEvents) {
                const { priceAdjustment, volatilityAdjustment } = await this.calculateEventImpact(event, assetId, metrics[0]);
                adjustedPrice *= (1 + priceAdjustment);
                totalVolatilityAdjustment += volatilityAdjustment;
            }
            // Apply house-specific volatility patterns
            const houseAdjustment = await this.applyHouseVolatilityPattern(assetId, metrics[0], totalVolatilityAdjustment);
            adjustedPrice *= (1 + houseAdjustment);
            // Apply safety bounds
            const safePrice = this.applySafetyBounds(currentPrice, adjustedPrice);
            // Log significant price movements
            if (Math.abs(safePrice - currentPrice) / currentPrice > 0.05) {
                console.log(`📊 Narrative price adjustment: ${assetId} ${currentPrice} → ${safePrice} (${((safePrice - currentPrice) / currentPrice * 100).toFixed(2)}%)`);
            }
            return safePrice;
        }
        catch (error) {
            console.error(`Error applying narrative price adjustments for ${assetId}:`, error);
            return currentPrice;
        }
    }
    /**
     * Calculate mythic volatility adjustment for asset
     */
    async calculateMythicVolatility(assetId, baseVolatility) {
        try {
            const metrics = await db.select()
                .from(schema_js_1.narrativeTradingMetrics)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, assetId))
                .limit(1);
            if (!metrics[0])
                return baseVolatility;
            const mythicVolatilityScore = parseFloat(metrics[0].mythicVolatilityScore);
            const storyArcMultiplier = parseFloat(metrics[0].storyArcVolatilityMultiplier);
            const powerLevelFactor = parseFloat(metrics[0].powerLevelVolatilityFactor);
            const cosmicEventBoost = parseFloat(metrics[0].cosmicEventVolatilityBoost);
            // Calculate enhanced volatility
            let enhancedVolatility = baseVolatility * mythicVolatilityScore;
            enhancedVolatility *= storyArcMultiplier;
            enhancedVolatility *= powerLevelFactor;
            enhancedVolatility += cosmicEventBoost;
            // Apply house volatility profile
            if (metrics[0].houseAffiliation) {
                const houseResponse = this.HOUSE_VOLATILITY_RESPONSES[metrics[0].houseAffiliation];
                if (houseResponse) {
                    enhancedVolatility *= houseResponse.multiplier;
                }
            }
            // Bound volatility to reasonable limits
            return Math.min(Math.max(enhancedVolatility, 0.001), 2.0); // 0.1% to 200%
        }
        catch (error) {
            console.error(`Error calculating mythic volatility for ${assetId}:`, error);
            return baseVolatility;
        }
    }
    /**
     * Get narrative momentum impact on asset price trend
     */
    async getNarrativeMomentumImpact(assetId) {
        try {
            const metrics = await db.select()
                .from(schema_js_1.narrativeTradingMetrics)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, assetId))
                .limit(1);
            if (!metrics[0])
                return 0.0;
            const momentumScore = parseFloat(metrics[0].narrativeMomentumScore);
            const culturalImpact = parseFloat(metrics[0].culturalImpactIndex);
            const storyProgression = parseFloat(metrics[0].storyProgressionRate);
            const mediaBoost = parseFloat(metrics[0].mediaBoostFactor);
            const decayRate = parseFloat(metrics[0].momentumDecayRate);
            // Calculate momentum impact (normalized to -0.1 to 0.1 range for price trend)
            let momentumImpact = (momentumScore / 5.0) * 0.1; // Normalize from -5..5 to -0.1..0.1
            momentumImpact *= culturalImpact;
            momentumImpact *= (1 + storyProgression * 0.2);
            momentumImpact *= mediaBoost;
            momentumImpact *= (1 - decayRate);
            return Math.min(Math.max(momentumImpact, -0.1), 0.1);
        }
        catch (error) {
            console.error(`Error calculating narrative momentum impact for ${assetId}:`, error);
            return 0.0;
        }
    }
    /**
     * Generate narrative-driven market events based on story beats
     */
    async generateNarrativeMarketEvent(trigger, storyBeat) {
        try {
            // Calculate affected assets
            const directAssets = trigger.directlyAffectedAssets || [];
            const indirectAssets = trigger.indirectlyAffectedAssets || [];
            const allAffectedAssets = [...directAssets, ...indirectAssets];
            // Calculate market impacts
            const priceImpacts = await this.calculatePriceImpacts(trigger, directAssets, indirectAssets);
            const volumeChanges = await this.calculateVolumeChanges(trigger, allAffectedAssets);
            const volatilityAdjustments = await this.calculateVolatilityAdjustments(trigger, allAffectedAssets);
            const houseImpacts = await this.calculateHouseImpacts(trigger, storyBeat);
            // Determine event duration
            const eventStartTime = new Date();
            const eventEndTime = new Date(eventStartTime.getTime() + trigger.immediateImpactDuration * 60000);
            const peakImpactTime = new Date(eventStartTime.getTime() + (trigger.immediateImpactDuration * 0.3) * 60000);
            // Create narrative market event
            const marketEvent = {
                triggerEventId: trigger.id,
                eventTitle: `Market Response: ${storyBeat.beatTitle}`,
                eventDescription: `Markets react to ${storyBeat.beatType} event: ${storyBeat.description || 'Narrative development affects trading sentiment'}`,
                narrativeContext: `Story Arc Phase: ${storyBeat.storyArcPhase || 'unknown'} | Beat Category: ${storyBeat.beatCategory} | Impact Level: ${trigger.eventSeverity}`,
                affectedAssets: allAffectedAssets,
                priceImpacts: priceImpacts,
                volumeChanges: volumeChanges,
                volatilityAdjustments: volatilityAdjustments,
                houseImpacts: houseImpacts,
                crossHouseInteractions: trigger.crossHouseEffects || {},
                eventStartTime: eventStartTime,
                eventEndTime: eventEndTime,
                peakImpactTime: peakImpactTime,
                currentPhase: 'immediate',
                narrativeRelevanceScore: storyBeat.narrativeSignificance?.toString() || "1.0000",
                culturalImpactMeasure: storyBeat.culturalImpact?.toString() || "0.0000"
            };
            const [insertedEvent] = await db.insert(schema_js_1.narrativeMarketEvents).values(marketEvent).returning();
            // Add to active events cache
            this.activeMarketEvents.set(insertedEvent.id, insertedEvent);
            console.log(`📈 Generated narrative market event: ${marketEvent.eventTitle}`);
            return insertedEvent.id;
        }
        catch (error) {
            console.error('Error generating narrative market event:', error);
            throw error;
        }
    }
    /**
     * Update asset trading metrics based on narrative events
     */
    async updateAssetTradingMetrics(assetId) {
        try {
            // Generate new trading metrics
            const newMetrics = await narrativeTradingMetricsService_js_1.narrativeTradingMetricsService.generateTradingMetrics(assetId);
            // Check if metrics exist
            const existingMetrics = await db.select()
                .from(schema_js_1.narrativeTradingMetrics)
                .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, assetId))
                .limit(1);
            if (existingMetrics.length > 0) {
                // Update existing metrics
                await db.update(schema_js_1.narrativeTradingMetrics)
                    .set({
                    ...newMetrics,
                    calculationVersion: existingMetrics[0].calculationVersion + 1,
                    lastRecalculation: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.assetId, assetId));
            }
            else {
                // Insert new metrics
                await db.insert(schema_js_1.narrativeTradingMetrics).values(newMetrics);
            }
        }
        catch (error) {
            console.error(`Error updating trading metrics for asset ${assetId}:`, error);
        }
    }
    /**
     * Process house-based trading strategies for NPCs
     */
    async processHouseTradingStrategies() {
        try {
            console.log('🏛️ Processing house-based trading strategies...');
            // Get all house financial profiles
            const houseProfiles = await db.select().from(houseFinancialProfiles);
            for (const house of houseProfiles) {
                if (!house.isActive)
                    continue;
                // Get assets aligned with this house
                const houseAssets = await db.select()
                    .from(schema_js_1.narrativeTradingMetrics)
                    .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTradingMetrics.houseAffiliation, house.houseId));
                // Process house-specific trading opportunities
                for (const assetMetrics of houseAssets) {
                    await this.evaluateHouseTradingOpportunity(house, assetMetrics);
                }
            }
        }
        catch (error) {
            console.error('Error processing house trading strategies:', error);
        }
    }
    /**
     * Generate real-time narrative insights for market analysis
     */
    async generateRealTimeNarrativeInsights() {
        try {
            // Get recently updated assets with high narrative activity
            const activeAssets = await db.select()
                .from(schema_js_1.narrativeTradingMetrics)
                .where((0, drizzle_orm_1.gte)(schema_js_1.narrativeTradingMetrics.lastRecalculation, new Date(Date.now() - 60000))) // Last minute
                .limit(20);
            for (const metrics of activeAssets) {
                // Generate narrative insights for each active asset
                const insights = await narrativeTradingMetricsService_js_1.narrativeTradingMetricsService.generateNarrativeMarketInsights(metrics.assetId);
                // Here we would save insights to database and broadcast to clients
                // This integration would connect to the real-time updates system
            }
        }
        catch (error) {
            console.error('Error generating real-time narrative insights:', error);
        }
    }
    // ========================================================================================
    // PRIVATE HELPER METHODS
    // ========================================================================================
    async loadActiveNarrativeEvents() {
        try {
            const activeEvents = await db.select()
                .from(schema_js_1.narrativeMarketEvents)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.narrativeMarketEvents.isActive, true), (0, drizzle_orm_1.gte)(schema_js_1.narrativeMarketEvents.eventStartTime, new Date(Date.now() - this.EVENT_MEMORY_HOURS * 60 * 60 * 1000))));
            this.activeMarketEvents.clear();
            for (const event of activeEvents) {
                this.activeMarketEvents.set(event.id, event);
            }
            console.log(`📚 Loaded ${activeEvents.length} active narrative market events`);
        }
        catch (error) {
            console.error('Error loading active narrative events:', error);
        }
    }
    startNarrativeEventProcessing() {
        this.processingInterval = setInterval(async () => {
            try {
                // Process narrative event queue
                await this.processNarrativeEventQueue();
                // Update event phases (immediate → medium → decay)
                await this.updateEventPhases();
                // Generate real-time insights
                await this.generateRealTimeNarrativeInsights();
                // Process house trading strategies
                await this.processHouseTradingStrategies();
            }
            catch (error) {
                console.error('Error in narrative event processing:', error);
            }
        }, this.NARRATIVE_UPDATE_INTERVAL);
    }
    async processEventTrigger(triggerId) {
        try {
            const trigger = await db.select()
                .from(schema_js_1.storyEventTriggers)
                .where((0, drizzle_orm_1.eq)(schema_js_1.storyEventTriggers.id, triggerId))
                .limit(1);
            if (!trigger[0] || !trigger[0].isActive)
                return;
            // Get associated story beat
            if (trigger[0].storyBeatId) {
                const storyBeat = await db.select()
                    .from(schema_js_1.storyBeats)
                    .where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.id, trigger[0].storyBeatId))
                    .limit(1);
                if (storyBeat[0]) {
                    await this.generateNarrativeMarketEvent(trigger[0], storyBeat[0]);
                }
            }
        }
        catch (error) {
            console.error(`Error processing event trigger ${triggerId}:`, error);
        }
    }
    async updateAffectedAssetMetrics(storyBeat) {
        try {
            // Get assets that need metric updates based on story beat
            const affectedAssetIds = [];
            if (storyBeat.primaryCharacterId) {
                affectedAssetIds.push(storyBeat.primaryCharacterId);
            }
            if (storyBeat.secondaryCharacterIds) {
                affectedAssetIds.push(...storyBeat.secondaryCharacterIds);
            }
            // Update metrics for each affected asset
            for (const assetId of affectedAssetIds) {
                await this.updateAssetTradingMetrics(assetId);
            }
        }
        catch (error) {
            console.error('Error updating affected asset metrics:', error);
        }
    }
    async getActiveEventsForAsset(assetId) {
        const activeEvents = [];
        for (const event of this.activeMarketEvents.values()) {
            if (event.affectedAssets && event.affectedAssets.includes(assetId)) {
                // Check if event is still active
                const now = new Date();
                if (event.eventEndTime && now < event.eventEndTime) {
                    activeEvents.push(event);
                }
            }
        }
        return activeEvents;
    }
    async calculateEventImpact(event, assetId, metrics) {
        // Get time-based impact curve
        const now = new Date();
        const eventStart = event.eventStartTime;
        const eventEnd = event.eventEndTime;
        const peakTime = event.peakImpactTime;
        if (!eventEnd || now > eventEnd) {
            return { priceAdjustment: 0, volatilityAdjustment: 0 };
        }
        // Calculate time progression (0 to 1)
        const totalDuration = eventEnd.getTime() - eventStart.getTime();
        const elapsed = now.getTime() - eventStart.getTime();
        const timeProgress = Math.min(elapsed / totalDuration, 1.0);
        // Get base impact from event data
        const priceImpacts = event.priceImpacts;
        const volatilityAdjustments = event.volatilityAdjustments;
        const basePriceImpact = priceImpacts?.[assetId] || 0;
        const baseVolatilityImpact = volatilityAdjustments?.[assetId] || 0;
        // Apply time-based curve (peak at 30% of duration, then decay)
        let timeCurve;
        if (timeProgress < 0.3) {
            // Rising to peak
            timeCurve = timeProgress / 0.3;
        }
        else {
            // Decaying from peak
            const decayProgress = (timeProgress - 0.3) / 0.7;
            timeCurve = 1.0 - (decayProgress * 0.7); // Decay to 30% of peak
        }
        // Apply house sensitivity
        const houseMultiplier = metrics.houseAffiliation ?
            (this.HOUSE_VOLATILITY_RESPONSES[metrics.houseAffiliation]?.multiplier || 1.0) : 1.0;
        const finalPriceAdjustment = basePriceImpact * timeCurve * houseMultiplier;
        const finalVolatilityAdjustment = baseVolatilityImpact * timeCurve * houseMultiplier;
        return {
            priceAdjustment: finalPriceAdjustment,
            volatilityAdjustment: finalVolatilityAdjustment
        };
    }
    async applyHouseVolatilityPattern(assetId, metrics, volatilityAdjustment) {
        if (!metrics.houseAffiliation)
            return 0;
        const houseResponse = this.HOUSE_VOLATILITY_RESPONSES[metrics.houseAffiliation];
        if (!houseResponse)
            return 0;
        // Apply house-specific volatility pattern
        const houseVolatilityMultiplier = parseFloat(metrics.houseTradingMultiplier);
        const stabilityFactor = houseResponse.stability;
        // Calculate house-adjusted price movement
        let houseAdjustment = volatilityAdjustment * houseVolatilityMultiplier;
        houseAdjustment *= (2.0 - stabilityFactor); // Higher stability = lower price movement
        return Math.min(Math.max(houseAdjustment, -0.1), 0.1); // Cap at ±10%
    }
    applySafetyBounds(originalPrice, adjustedPrice) {
        const change = (adjustedPrice - originalPrice) / originalPrice;
        const maxChange = this.MAX_PRICE_IMPACT;
        if (Math.abs(change) > maxChange) {
            const signedMaxChange = change > 0 ? maxChange : -maxChange;
            return originalPrice * (1 + signedMaxChange);
        }
        return adjustedPrice;
    }
    async calculatePriceImpacts(trigger, directAssets, indirectAssets) {
        const impacts = {};
        const baseImpact = trigger.priceImpactRange;
        const directImpact = baseImpact?.max || 0.05;
        const indirectImpact = (baseImpact?.min || 0.01);
        // Direct assets get full impact
        for (const assetId of directAssets) {
            impacts[assetId] = directImpact;
        }
        // Indirect assets get reduced impact
        for (const assetId of indirectAssets) {
            impacts[assetId] = indirectImpact;
        }
        return impacts;
    }
    async calculateVolumeChanges(trigger, assets) {
        const volumeChanges = {};
        const baseVolumeMultiplier = parseFloat(trigger.volatilityImpactMultiplier);
        for (const assetId of assets) {
            // Higher volatility events typically increase trading volume
            volumeChanges[assetId] = Math.max(baseVolumeMultiplier, 1.1); // At least 10% volume increase
        }
        return volumeChanges;
    }
    async calculateVolatilityAdjustments(trigger, assets) {
        const adjustments = {};
        const baseVolatilityMultiplier = parseFloat(trigger.volatilityImpactMultiplier);
        for (const assetId of assets) {
            adjustments[assetId] = baseVolatilityMultiplier;
        }
        return adjustments;
    }
    async calculateHouseImpacts(trigger, storyBeat) {
        const houseImpacts = {};
        const houseResponseMultipliers = trigger.houseResponseMultipliers;
        for (const [houseId, multiplier] of Object.entries(houseResponseMultipliers || {})) {
            houseImpacts[houseId] = {
                volatilityMultiplier: multiplier,
                sentimentShift: parseFloat(trigger.sentimentShift),
                tradingVolumeChange: multiplier * 0.5
            };
        }
        return houseImpacts;
    }
    async processNarrativeEventQueue() {
        while (this.narrativeEventQueue.length > 0) {
            const storyBeat = this.narrativeEventQueue.shift();
            if (storyBeat) {
                await this.processStoryBeat(storyBeat);
            }
        }
    }
    async updateEventPhases() {
        const now = new Date();
        for (const [eventId, event] of this.activeMarketEvents.entries()) {
            let newPhase = event.currentPhase;
            // Determine current phase based on time elapsed
            const eventDuration = event.eventEndTime?.getTime() - event.eventStartTime.getTime();
            const elapsed = now.getTime() - event.eventStartTime.getTime();
            if (eventDuration) {
                const progress = elapsed / eventDuration;
                if (progress < 0.3) {
                    newPhase = 'immediate';
                }
                else if (progress < 0.8) {
                    newPhase = 'medium_term';
                }
                else {
                    newPhase = 'decay';
                }
            }
            // Update phase if changed
            if (newPhase !== event.currentPhase) {
                await db.update(schema_js_1.narrativeMarketEvents)
                    .set({ currentPhase: newPhase })
                    .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeMarketEvents.id, eventId));
                event.currentPhase = newPhase;
            }
            // Remove expired events
            if (event.eventEndTime && now > event.eventEndTime) {
                await db.update(schema_js_1.narrativeMarketEvents)
                    .set({ isActive: false })
                    .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeMarketEvents.id, eventId));
                this.activeMarketEvents.delete(eventId);
            }
        }
    }
    async evaluateHouseTradingOpportunity(house, assetMetrics) {
        // This would integrate with NPC trading systems to create house-specific trading strategies
        // For now, this is a placeholder for the sophisticated house-based trading logic
        try {
            const asset = await db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, assetMetrics.assetId)).limit(1);
            if (!asset[0])
                return;
            // Evaluate if this asset fits the house's trading strategy
            const isSpecialtyAsset = house.specialtyAssetTypes?.includes(asset[0].type);
            const isWeaknessAsset = house.weaknessAssetTypes?.includes(asset[0].type);
            if (isSpecialtyAsset && !isWeaknessAsset) {
                // This would trigger house-specific trading decisions
                console.log(`🏛️ ${house.houseName} identified trading opportunity: ${asset[0].name}`);
            }
        }
        catch (error) {
            console.error('Error evaluating house trading opportunity:', error);
        }
    }
    /**
     * Public method to add story beats to processing queue
     */
    addStoryBeatToQueue(storyBeat) {
        this.narrativeEventQueue.push(storyBeat);
    }
    /**
     * Get current narrative market statistics
     */
    async getNarrativeMarketStats() {
        return {
            activeEvents: this.activeMarketEvents.size,
            queuedBeats: this.narrativeEventQueue.length,
            totalEventsToday: await this.getTotalEventsToday(),
            averageVolatilityImpact: await this.getAverageVolatilityImpact(),
            houseActivityLevels: await this.getHouseActivityLevels()
        };
    }
    async getTotalEventsToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await db.select()
            .from(schema_js_1.narrativeMarketEvents)
            .where((0, drizzle_orm_1.gte)(schema_js_1.narrativeMarketEvents.eventStartTime, today));
        return events.length;
    }
    async getAverageVolatilityImpact() {
        // Calculate average volatility impact across all assets
        const metrics = await db.select()
            .from(schema_js_1.narrativeTradingMetrics)
            .where((0, drizzle_orm_1.gte)(schema_js_1.narrativeTradingMetrics.lastRecalculation, new Date(Date.now() - 24 * 60 * 60 * 1000)));
        if (metrics.length === 0)
            return 0;
        const totalVolatility = metrics.reduce((sum, m) => sum + parseFloat(m.mythicVolatilityScore), 0);
        return totalVolatility / metrics.length;
    }
    async getHouseActivityLevels() {
        const houseActivity = {};
        const metrics = await db.select()
            .from(schema_js_1.narrativeTradingMetrics)
            .where((0, drizzle_orm_1.gte)(schema_js_1.narrativeTradingMetrics.lastRecalculation, new Date(Date.now() - 60 * 60 * 1000))); // Last hour
        for (const metric of metrics) {
            if (metric.houseAffiliation) {
                houseActivity[metric.houseAffiliation] = (houseActivity[metric.houseAffiliation] || 0) + 1;
            }
        }
        return houseActivity;
    }
    /**
     * Cleanup method
     */
    async shutdown() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
        this.activeMarketEvents.clear();
        this.narrativeEventQueue = [];
        console.log('🎭 Narrative Market Integration shutdown complete');
    }
}
exports.NarrativeMarketIntegration = NarrativeMarketIntegration;
// Export singleton instance
exports.narrativeMarketIntegration = new NarrativeMarketIntegration();
