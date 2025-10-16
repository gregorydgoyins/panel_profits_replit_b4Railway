"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const schema_js_1 = require("@shared/schema.js");
const visualStorytellingService_js_1 = require("../services/visualStorytellingService.js");
// Initialize database connection
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
const router = (0, express_1.Router)();
// Initialize the visual storytelling service
const visualStorytellingService = new visualStorytellingService_js_1.VisualStorytellingService();
// =============================================
// NARRATIVE TIMELINES ROUTES
// =============================================
// Get all narrative timelines with filtering
router.get('/timelines', async (req, res) => {
    try {
        const { house, universe, timelineType, scope, status, limit = '20', offset = '0', sortBy = 'marketInfluence', sortOrder = 'desc' } = req.query;
        let query = db.select({
            id: schema_js_1.narrativeTimelines.id,
            timelineName: schema_js_1.narrativeTimelines.timelineName,
            timelineType: schema_js_1.narrativeTimelines.timelineType,
            scope: schema_js_1.narrativeTimelines.scope,
            universe: schema_js_1.narrativeTimelines.universe,
            continuity: schema_js_1.narrativeTimelines.continuity,
            timelineStatus: schema_js_1.narrativeTimelines.timelineStatus,
            primaryHouse: schema_js_1.narrativeTimelines.primaryHouse,
            associatedHouses: schema_js_1.narrativeTimelines.associatedHouses,
            houseRelevanceScore: schema_js_1.narrativeTimelines.houseRelevanceScore,
            marketInfluence: schema_js_1.narrativeTimelines.marketInfluence,
            volatilityPotential: schema_js_1.narrativeTimelines.volatilityPotential,
            speculativeValue: schema_js_1.narrativeTimelines.speculativeValue,
            longTermImpact: schema_js_1.narrativeTimelines.longTermImpact,
            totalStoryBeats: schema_js_1.narrativeTimelines.totalStoryBeats,
            completedStoryBeats: schema_js_1.narrativeTimelines.completedStoryBeats,
            criticalStoryBeats: schema_js_1.narrativeTimelines.criticalStoryBeats,
            plotComplexity: schema_js_1.narrativeTimelines.plotComplexity,
            primaryThemes: schema_js_1.narrativeTimelines.primaryThemes,
            moralAlignment: schema_js_1.narrativeTimelines.moralAlignment,
            emotionalTone: schema_js_1.narrativeTimelines.emotionalTone,
            narrativeGenre: schema_js_1.narrativeTimelines.narrativeGenre,
            culturalSignificance: schema_js_1.narrativeTimelines.culturalSignificance,
            fandomEngagement: schema_js_1.narrativeTimelines.fandomEngagement,
            iconicStatus: schema_js_1.narrativeTimelines.iconicStatus,
            qualityScore: schema_js_1.narrativeTimelines.qualityScore,
            createdAt: schema_js_1.narrativeTimelines.createdAt,
            updatedAt: schema_js_1.narrativeTimelines.updatedAt
        }).from(schema_js_1.narrativeTimelines);
        // Apply filters
        const conditions = [];
        if (house) {
            if (typeof house === 'string') {
                conditions.push((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`);
            }
        }
        if (universe) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.narrativeTimelines.universe, universe));
        }
        if (timelineType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.narrativeTimelines.timelineType, timelineType));
        }
        if (scope) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.narrativeTimelines.scope, scope));
        }
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.narrativeTimelines.timelineStatus, status));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        // Apply sorting
        const validSortFields = ['marketInfluence', 'volatilityPotential', 'culturalSignificance', 'qualityScore', 'createdAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'marketInfluence';
        const order = sortOrder === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
        query = query.orderBy(order(schema_js_1.narrativeTimelines[sortField]));
        // Apply pagination
        const limitNum = Math.min(parseInt(limit, 10), 100);
        const offsetNum = Math.max(parseInt(offset, 10), 0);
        query = query.limit(limitNum).offset(offsetNum);
        const timelines = await query;
        // Get total count for pagination
        const [{ count }] = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_js_1.narrativeTimelines);
        res.json({
            timelines,
            pagination: {
                total: Number(count),
                limit: limitNum,
                offset: offsetNum,
                hasMore: offsetNum + limitNum < Number(count)
            }
        });
    }
    catch (error) {
        console.error('Error fetching narrative timelines:', error);
        res.status(500).json({ error: 'Failed to fetch narrative timelines' });
    }
});
// Get specific timeline with full details and story beats
router.get('/timelines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { includeBeats = 'true' } = req.query;
        // Get timeline details
        const [timeline] = await db.select().from(schema_js_1.narrativeTimelines)
            .where((0, drizzle_orm_1.eq)(schema_js_1.narrativeTimelines.id, id))
            .limit(1);
        if (!timeline) {
            return res.status(404).json({ error: 'Timeline not found' });
        }
        let storyBeatsData = [];
        if (includeBeats === 'true') {
            // Get associated story beats
            storyBeatsData = await db.select().from(schema_js_1.storyBeats)
                .where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.timelineId, id))
                .orderBy((0, drizzle_orm_1.asc)(schema_js_1.storyBeats.chronologicalOrder));
        }
        // Get primary entities (characters) details
        let primaryEntitiesDetails = [];
        if (timeline.primaryEntities && timeline.primaryEntities.length > 0) {
            primaryEntitiesDetails = await db.select({
                id: schema_js_1.assets.id,
                symbol: schema_js_1.assets.symbol,
                name: schema_js_1.assets.name,
                type: schema_js_1.assets.type,
                imageUrl: schema_js_1.assets.imageUrl,
                metadata: schema_js_1.assets.metadata
            }).from(schema_js_1.assets)
                .where((0, drizzle_orm_1.inArray)(schema_js_1.assets.id, timeline.primaryEntities));
        }
        res.json({
            timeline,
            storyBeats: storyBeatsData,
            primaryEntities: primaryEntitiesDetails
        });
    }
    catch (error) {
        console.error('Error fetching timeline details:', error);
        res.status(500).json({ error: 'Failed to fetch timeline details' });
    }
});
// Get timelines by trading house
router.get('/houses/:houseId/timelines', async (req, res) => {
    try {
        const { houseId } = req.params;
        const { limit = '10', includeMetrics = 'true' } = req.query;
        const limitNum = Math.min(parseInt(limit, 10), 50);
        let query = db.select().from(schema_js_1.narrativeTimelines)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.houseRelevanceScore))
            .limit(limitNum);
        const timelines = await query;
        let houseMetrics = null;
        if (includeMetrics === 'true') {
            // Calculate house-specific metrics
            const [metrics] = await db.select({
                totalTimelines: (0, drizzle_orm_1.sql) `count(*)`,
                avgMarketInfluence: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.marketInfluence})`,
                avgVolatilityPotential: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.volatilityPotential})`,
                avgCulturalSignificance: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.culturalSignificance})`,
                totalStoryBeats: (0, drizzle_orm_1.sql) `sum(${schema_js_1.narrativeTimelines.totalStoryBeats})`,
                avgQualityScore: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.qualityScore})`
            }).from(schema_js_1.narrativeTimelines)
                .where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`);
            houseMetrics = {
                totalTimelines: Number(metrics.totalTimelines),
                avgMarketInfluence: Number(metrics.avgMarketInfluence || 0),
                avgVolatilityPotential: Number(metrics.avgVolatilityPotential || 0),
                avgCulturalSignificance: Number(metrics.avgCulturalSignificance || 0),
                totalStoryBeats: Number(metrics.totalStoryBeats || 0),
                avgQualityScore: Number(metrics.avgQualityScore || 0)
            };
        }
        res.json({
            houseId,
            timelines,
            metrics: houseMetrics
        });
    }
    catch (error) {
        console.error('Error fetching house timelines:', error);
        res.status(500).json({ error: 'Failed to fetch house timelines' });
    }
});
// =============================================
// STORY BEATS ROUTES
// =============================================
// Get story beats with filtering
router.get('/story-beats', async (req, res) => {
    try {
        const { timelineId, beatType, beatCategory, house, minMarketRelevance, limit = '20', offset = '0' } = req.query;
        let query = db.select().from(schema_js_1.storyBeats);
        const conditions = [];
        if (timelineId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.timelineId, timelineId));
        }
        if (beatType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.beatType, beatType));
        }
        if (beatCategory) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.beatCategory, beatCategory));
        }
        if (house) {
            conditions.push((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.primaryHouse, house));
        }
        if (minMarketRelevance) {
            conditions.push((0, drizzle_orm_1.gte)(schema_js_1.storyBeats.marketRelevance, minMarketRelevance));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.storyBeats.marketRelevance));
        const limitNum = Math.min(parseInt(limit, 10), 100);
        const offsetNum = Math.max(parseInt(offset, 10), 0);
        query = query.limit(limitNum).offset(offsetNum);
        const beats = await query;
        res.json({ storyBeats: beats });
    }
    catch (error) {
        console.error('Error fetching story beats:', error);
        res.status(500).json({ error: 'Failed to fetch story beats' });
    }
});
// Get critical story beats (high market impact)
router.get('/story-beats/critical', async (req, res) => {
    try {
        const { house, limit = '15' } = req.query;
        let query = db.select({
            id: schema_js_1.storyBeats.id,
            timelineId: schema_js_1.storyBeats.timelineId,
            beatTitle: schema_js_1.storyBeats.beatTitle,
            beatType: schema_js_1.storyBeats.beatType,
            beatCategory: schema_js_1.storyBeats.beatCategory,
            primaryHouse: schema_js_1.storyBeats.primaryHouse,
            marketRelevance: schema_js_1.storyBeats.marketRelevance,
            priceImpactPotential: schema_js_1.storyBeats.priceImpactPotential,
            volatilityTrigger: schema_js_1.storyBeats.volatilityTrigger,
            speculationOpportunity: schema_js_1.storyBeats.speculationOpportunity,
            plotSignificance: schema_js_1.storyBeats.plotSignificance,
            iconicStatus: schema_js_1.storyBeats.iconicStatus,
            description: schema_js_1.storyBeats.description,
            thematicElements: schema_js_1.storyBeats.thematicElements,
            emotionalImpact: schema_js_1.storyBeats.emotionalImpact,
            createdAt: schema_js_1.storyBeats.createdAt
        }).from(schema_js_1.storyBeats)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.storyBeats.plotSignificance} > 0.8 OR ${schema_js_1.storyBeats.volatilityTrigger} > 0.8`);
        if (house) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.primaryHouse, house));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.storyBeats.plotSignificance))
            .limit(parseInt(limit, 10));
        const criticalBeats = await query;
        res.json({ criticalBeats });
    }
    catch (error) {
        console.error('Error fetching critical story beats:', error);
        res.status(500).json({ error: 'Failed to fetch critical story beats' });
    }
});
// =============================================
// MARKET SENTIMENT ROUTES
// =============================================
// Get narrative-driven market insights
router.get('/market-insights', async (req, res) => {
    try {
        const { house, category = 'narrative_event', limit = '10' } = req.query;
        let query = db.select().from(schema_js_1.marketInsights)
            .where((0, drizzle_orm_1.eq)(schema_js_1.marketInsights.category, category));
        if (house) {
            query = query.where((0, drizzle_orm_1.sql) `${house} = ANY(${schema_js_1.marketInsights.tags})`);
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.marketInsights.createdAt))
            .limit(parseInt(limit, 10));
        const insights = await query;
        res.json({ insights });
    }
    catch (error) {
        console.error('Error fetching market insights:', error);
        res.status(500).json({ error: 'Failed to fetch market insights' });
    }
});
// Get narrative momentum for assets
router.get('/narrative-momentum', async (req, res) => {
    try {
        const { assetIds, house } = req.query;
        let assetConditions = [];
        if (assetIds) {
            const ids = assetIds.split(',');
            assetConditions.push((0, drizzle_orm_1.inArray)(schema_js_1.assetFinancialMapping.assetId, ids));
        }
        if (house) {
            assetConditions.push((0, drizzle_orm_1.sql) `${schema_js_1.assetFinancialMapping.correlationFactors}->>'houseAlignment' = ${house}`);
        }
        let query = db.select({
            assetId: schema_js_1.assetFinancialMapping.assetId,
            volatilityMultiplier: schema_js_1.assetFinancialMapping.volatilityMultiplier,
            trendDirection: schema_js_1.assetFinancialMapping.trendDirection,
            beta: schema_js_1.assetFinancialMapping.beta,
            correlationFactors: schema_js_1.assetFinancialMapping.correlationFactors,
            updatedAt: schema_js_1.assetFinancialMapping.updatedAt,
            // Join with asset details
            assetSymbol: schema_js_1.assets.symbol,
            assetName: schema_js_1.assets.name,
            assetType: schema_js_1.assets.type
        }).from(schema_js_1.assetFinancialMapping)
            .leftJoin(schema_js_1.assets, (0, drizzle_orm_1.eq)(schema_js_1.assetFinancialMapping.assetId, schema_js_1.assets.id));
        if (assetConditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...assetConditions));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.assetFinancialMapping.volatilityMultiplier))
            .limit(20);
        const momentum = await query;
        res.json({ narrativeMomentum: momentum });
    }
    catch (error) {
        console.error('Error fetching narrative momentum:', error);
        res.status(500).json({ error: 'Failed to fetch narrative momentum' });
    }
});
// =============================================
// STORYTELLING ANALYTICS ROUTES
// =============================================
// Get house-specific storytelling analytics
router.get('/analytics/houses', async (req, res) => {
    try {
        // Get analytics for all seven houses
        const houseAnalytics = await Promise.all([
            'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
        ].map(async (houseId) => {
            const [timeline_stats] = await db.select({
                totalTimelines: (0, drizzle_orm_1.sql) `count(*)`,
                avgMarketInfluence: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.marketInfluence})`,
                avgVolatilityPotential: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.volatilityPotential})`,
                avgCulturalSignificance: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.culturalSignificance})`,
                totalStoryBeats: (0, drizzle_orm_1.sql) `sum(${schema_js_1.narrativeTimelines.totalStoryBeats})`,
                avgQualityScore: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.qualityScore})`,
                avgIconicStatus: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.iconicStatus})`
            }).from(schema_js_1.narrativeTimelines)
                .where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`);
            const [beat_stats] = await db.select({
                totalBeats: (0, drizzle_orm_1.sql) `count(*)`,
                criticalBeats: (0, drizzle_orm_1.sql) `count(*) FILTER (WHERE ${schema_js_1.storyBeats.plotSignificance} > 0.8)`,
                avgMarketRelevance: (0, drizzle_orm_1.sql) `avg(${schema_js_1.storyBeats.marketRelevance})`,
                avgVolatilityTrigger: (0, drizzle_orm_1.sql) `avg(${schema_js_1.storyBeats.volatilityTrigger})`,
                avgSpeculationOpportunity: (0, drizzle_orm_1.sql) `avg(${schema_js_1.storyBeats.speculationOpportunity})`
            }).from(schema_js_1.storyBeats)
                .where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.primaryHouse, houseId));
            return {
                houseId,
                timelineStats: {
                    totalTimelines: Number(timeline_stats.totalTimelines),
                    avgMarketInfluence: Number(timeline_stats.avgMarketInfluence || 0),
                    avgVolatilityPotential: Number(timeline_stats.avgVolatilityPotential || 0),
                    avgCulturalSignificance: Number(timeline_stats.avgCulturalSignificance || 0),
                    totalStoryBeats: Number(timeline_stats.totalStoryBeats || 0),
                    avgQualityScore: Number(timeline_stats.avgQualityScore || 0),
                    avgIconicStatus: Number(timeline_stats.avgIconicStatus || 0)
                },
                beatStats: {
                    totalBeats: Number(beat_stats.totalBeats),
                    criticalBeats: Number(beat_stats.criticalBeats),
                    avgMarketRelevance: Number(beat_stats.avgMarketRelevance || 0),
                    avgVolatilityTrigger: Number(beat_stats.avgVolatilityTrigger || 0),
                    avgSpeculationOpportunity: Number(beat_stats.avgSpeculationOpportunity || 0)
                }
            };
        }));
        res.json({ houseAnalytics });
    }
    catch (error) {
        console.error('Error fetching house analytics:', error);
        res.status(500).json({ error: 'Failed to fetch house analytics' });
    }
});
// Get timeline performance metrics
router.get('/analytics/timeline-performance', async (req, res) => {
    try {
        const { timeframe = '30' } = req.query;
        const daysAgo = parseInt(timeframe, 10);
        const since = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const performance = await db.select({
            timelineType: schema_js_1.narrativeTimelines.timelineType,
            universe: schema_js_1.narrativeTimelines.universe,
            primaryHouse: schema_js_1.narrativeTimelines.primaryHouse,
            count: (0, drizzle_orm_1.sql) `count(*)`,
            avgMarketInfluence: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.marketInfluence})`,
            avgVolatilityPotential: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.volatilityPotential})`,
            avgCulturalSignificance: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.culturalSignificance})`,
            avgQualityScore: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.qualityScore})`
        }).from(schema_js_1.narrativeTimelines)
            .where((0, drizzle_orm_1.gte)(schema_js_1.narrativeTimelines.createdAt, since))
            .groupBy(schema_js_1.narrativeTimelines.timelineType, schema_js_1.narrativeTimelines.universe, schema_js_1.narrativeTimelines.primaryHouse)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.marketInfluence})`));
        res.json({ performance });
    }
    catch (error) {
        console.error('Error fetching timeline performance:', error);
        res.status(500).json({ error: 'Failed to fetch timeline performance' });
    }
});
// =============================================
// STORYTELLING GENERATION ROUTES
// =============================================
// Generate new narrative timelines from existing data
router.post('/generate-timelines', async (req, res) => {
    try {
        const { force = false } = req.body;
        // Check if timelines already exist
        const [existingCount] = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_js_1.narrativeTimelines);
        if (Number(existingCount.count) > 0 && !force) {
            return res.json({
                message: 'Timelines already exist. Use force=true to regenerate.',
                existingCount: Number(existingCount.count)
            });
        }
        console.log('🎬 Starting narrative timeline generation...');
        const timelineIds = await visualStorytellingService.generateNarrativeTimelines();
        res.json({
            success: true,
            message: `Successfully generated ${timelineIds.length} narrative timelines`,
            timelineIds: timelineIds
        });
    }
    catch (error) {
        console.error('Error generating narrative timelines:', error);
        res.status(500).json({ error: 'Failed to generate narrative timelines' });
    }
});
// Create market sentiment integration
router.post('/create-market-integration', async (req, res) => {
    try {
        console.log('🎭 Creating market sentiment integration...');
        await visualStorytellingService.createMarketSentimentIntegration();
        res.json({
            success: true,
            message: 'Market sentiment integration created successfully'
        });
    }
    catch (error) {
        console.error('Error creating market sentiment integration:', error);
        res.status(500).json({ error: 'Failed to create market sentiment integration' });
    }
});
// =============================================
// SEARCH AND DISCOVERY ROUTES
// =============================================
// Search timelines by theme or content
router.get('/search/timelines', async (req, res) => {
    try {
        const { query: searchQuery, house, limit = '10' } = req.query;
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        let query = db.select({
            id: schema_js_1.narrativeTimelines.id,
            timelineName: schema_js_1.narrativeTimelines.timelineName,
            timelineType: schema_js_1.narrativeTimelines.timelineType,
            universe: schema_js_1.narrativeTimelines.universe,
            primaryHouse: schema_js_1.narrativeTimelines.primaryHouse,
            primaryThemes: schema_js_1.narrativeTimelines.primaryThemes,
            moralAlignment: schema_js_1.narrativeTimelines.moralAlignment,
            narrativeGenre: schema_js_1.narrativeTimelines.narrativeGenre,
            marketInfluence: schema_js_1.narrativeTimelines.marketInfluence,
            culturalSignificance: schema_js_1.narrativeTimelines.culturalSignificance,
            qualityScore: schema_js_1.narrativeTimelines.qualityScore,
            // Text search ranking
            rank: (0, drizzle_orm_1.sql) `ts_rank(to_tsvector('english', ${schema_js_1.narrativeTimelines.timelineName} || ' ' || coalesce(${schema_js_1.narrativeTimelines.primaryThemes}, '') || ' ' || coalesce(${schema_js_1.narrativeTimelines.narrativeGenre}, '')), plainto_tsquery('english', ${searchQuery}))`
        }).from(schema_js_1.narrativeTimelines)
            .where((0, drizzle_orm_1.sql) `to_tsvector('english', ${schema_js_1.narrativeTimelines.timelineName} || ' ' || coalesce(${schema_js_1.narrativeTimelines.primaryThemes}, '') || ' ' || coalesce(${schema_js_1.narrativeTimelines.narrativeGenre}, '')) @@ plainto_tsquery('english', ${searchQuery})`);
        if (house) {
            query = query.where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`);
        }
        query = query.orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `rank`))
            .limit(parseInt(limit, 10));
        const results = await query;
        res.json({ searchResults: results });
    }
    catch (error) {
        console.error('Error searching timelines:', error);
        res.status(500).json({ error: 'Failed to search timelines' });
    }
});
// Get recommended timelines based on user preferences or house
router.get('/recommendations', async (req, res) => {
    try {
        const { house, userId, limit = '8' } = req.query;
        let query = db.select().from(schema_js_1.narrativeTimelines);
        if (house) {
            // House-based recommendations
            query = query.where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`)
                .orderBy((0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.houseRelevanceScore), (0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.marketInfluence));
        }
        else {
            // General high-quality recommendations
            query = query.where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.qualityScore} > 0.7 AND ${schema_js_1.narrativeTimelines.marketInfluence} > 0.6`)
                .orderBy((0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.culturalSignificance), (0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.iconicStatus));
        }
        query = query.limit(parseInt(limit, 10));
        const recommendations = await query;
        res.json({ recommendations });
    }
    catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});
// =============================================
// WIDGET DATA ROUTES FOR FRONTEND
// =============================================
// Get featured timeline widget data
router.get('/widgets/featured-timeline', async (req, res) => {
    try {
        const { house } = req.query;
        let query = db.select({
            id: schema_js_1.narrativeTimelines.id,
            timelineName: schema_js_1.narrativeTimelines.timelineName,
            timelineType: schema_js_1.narrativeTimelines.timelineType,
            universe: schema_js_1.narrativeTimelines.universe,
            primaryHouse: schema_js_1.narrativeTimelines.primaryHouse,
            primaryThemes: schema_js_1.narrativeTimelines.primaryThemes,
            emotionalTone: schema_js_1.narrativeTimelines.emotionalTone,
            marketInfluence: schema_js_1.narrativeTimelines.marketInfluence,
            culturalSignificance: schema_js_1.narrativeTimelines.culturalSignificance,
            iconicStatus: schema_js_1.narrativeTimelines.iconicStatus,
            totalStoryBeats: schema_js_1.narrativeTimelines.totalStoryBeats,
            qualityScore: schema_js_1.narrativeTimelines.qualityScore
        }).from(schema_js_1.narrativeTimelines);
        if (house) {
            query = query.where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`);
        }
        // Get the highest quality, most culturally significant timeline
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.qualityScore), (0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.culturalSignificance))
            .limit(1);
        const [featuredTimeline] = await query;
        if (!featuredTimeline) {
            return res.json({ featuredTimeline: null });
        }
        // Get a few story beats for preview
        const previewBeats = await db.select({
            id: schema_js_1.storyBeats.id,
            beatTitle: schema_js_1.storyBeats.beatTitle,
            beatType: schema_js_1.storyBeats.beatType,
            plotSignificance: schema_js_1.storyBeats.plotSignificance,
            emotionalImpact: schema_js_1.storyBeats.emotionalImpact,
            description: schema_js_1.storyBeats.description
        }).from(schema_js_1.storyBeats)
            .where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.timelineId, featuredTimeline.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.storyBeats.plotSignificance))
            .limit(3);
        res.json({
            featuredTimeline: {
                ...featuredTimeline,
                previewBeats
            }
        });
    }
    catch (error) {
        console.error('Error fetching featured timeline widget:', error);
        res.status(500).json({ error: 'Failed to fetch featured timeline widget' });
    }
});
// Get market sentiment widget data
router.get('/widgets/market-sentiment', async (req, res) => {
    try {
        const { house, limit = '5' } = req.query;
        // Get recent high-impact story beats
        let query = db.select({
            id: schema_js_1.storyBeats.id,
            timelineId: schema_js_1.storyBeats.timelineId,
            beatTitle: schema_js_1.storyBeats.beatTitle,
            beatType: schema_js_1.storyBeats.beatType,
            primaryHouse: schema_js_1.storyBeats.primaryHouse,
            marketRelevance: schema_js_1.storyBeats.marketRelevance,
            volatilityTrigger: schema_js_1.storyBeats.volatilityTrigger,
            speculationOpportunity: schema_js_1.storyBeats.speculationOpportunity,
            plotSignificance: schema_js_1.storyBeats.plotSignificance,
            emotionalImpact: schema_js_1.storyBeats.emotionalImpact,
            description: schema_js_1.storyBeats.description,
            createdAt: schema_js_1.storyBeats.createdAt
        }).from(schema_js_1.storyBeats)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.storyBeats.volatilityTrigger} > 0.7 OR ${schema_js_1.storyBeats.speculationOpportunity} > 0.7`);
        if (house) {
            query = query.where((0, drizzle_orm_1.eq)(schema_js_1.storyBeats.primaryHouse, house));
        }
        query = query.orderBy((0, drizzle_orm_1.desc)(schema_js_1.storyBeats.createdAt), (0, drizzle_orm_1.desc)(schema_js_1.storyBeats.volatilityTrigger))
            .limit(parseInt(limit, 10));
        const sentimentBeats = await query;
        res.json({ sentimentBeats });
    }
    catch (error) {
        console.error('Error fetching market sentiment widget:', error);
        res.status(500).json({ error: 'Failed to fetch market sentiment widget' });
    }
});
// Get house storytelling overview widget
router.get('/widgets/house-overview/:houseId', async (req, res) => {
    try {
        const { houseId } = req.params;
        // Get house statistics
        const [houseStats] = await db.select({
            totalTimelines: (0, drizzle_orm_1.sql) `count(*)`,
            avgMarketInfluence: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.marketInfluence})`,
            avgCulturalSignificance: (0, drizzle_orm_1.sql) `avg(${schema_js_1.narrativeTimelines.culturalSignificance})`,
            totalStoryBeats: (0, drizzle_orm_1.sql) `sum(${schema_js_1.narrativeTimelines.totalStoryBeats})`,
            mostCommonTheme: (0, drizzle_orm_1.sql) `mode() within group (order by unnest(${schema_js_1.narrativeTimelines.primaryThemes}))`,
            mostCommonGenre: (0, drizzle_orm_1.sql) `mode() within group (order by unnest(${schema_js_1.narrativeTimelines.narrativeGenre}))`,
            highestQualityScore: (0, drizzle_orm_1.sql) `max(${schema_js_1.narrativeTimelines.qualityScore})`
        }).from(schema_js_1.narrativeTimelines)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`);
        // Get top 3 timelines for this house
        const topTimelines = await db.select({
            id: schema_js_1.narrativeTimelines.id,
            timelineName: schema_js_1.narrativeTimelines.timelineName,
            timelineType: schema_js_1.narrativeTimelines.timelineType,
            marketInfluence: schema_js_1.narrativeTimelines.marketInfluence,
            qualityScore: schema_js_1.narrativeTimelines.qualityScore,
            iconicStatus: schema_js_1.narrativeTimelines.iconicStatus
        }).from(schema_js_1.narrativeTimelines)
            .where((0, drizzle_orm_1.sql) `${schema_js_1.narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${schema_js_1.narrativeTimelines.associatedHouses})`)
            .orderBy((0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.qualityScore), (0, drizzle_orm_1.desc)(schema_js_1.narrativeTimelines.iconicStatus))
            .limit(3);
        res.json({
            houseId,
            stats: {
                totalTimelines: Number(houseStats.totalTimelines),
                avgMarketInfluence: Number(houseStats.avgMarketInfluence || 0),
                avgCulturalSignificance: Number(houseStats.avgCulturalSignificance || 0),
                totalStoryBeats: Number(houseStats.totalStoryBeats || 0),
                mostCommonTheme: houseStats.mostCommonTheme,
                mostCommonGenre: houseStats.mostCommonGenre,
                highestQualityScore: Number(houseStats.highestQualityScore || 0)
            },
            topTimelines
        });
    }
    catch (error) {
        console.error('Error fetching house overview widget:', error);
        res.status(500).json({ error: 'Failed to fetch house overview widget' });
    }
});
exports.default = router;
