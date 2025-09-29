import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, asc, sql, inArray, gte, lte, ilike } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import {
  narrativeTimelines, storyBeats, assets, enhancedCharacters,
  battleScenarios, enhancedComicIssues, marketInsights, assetFinancialMapping
} from '@shared/schema.js';
import { VisualStorytellingService } from '../services/visualStorytellingService.js';

// Initialize database connection
const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

const router = Router();

// Initialize the visual storytelling service
const visualStorytellingService = new VisualStorytellingService();

// =============================================
// NARRATIVE TIMELINES ROUTES
// =============================================

// Get all narrative timelines with filtering
router.get('/timelines', async (req, res) => {
  try {
    const {
      house,
      universe,
      timelineType,
      scope,
      status,
      limit = '20',
      offset = '0',
      sortBy = 'marketInfluence',
      sortOrder = 'desc'
    } = req.query;

    let query = db.select({
      id: narrativeTimelines.id,
      timelineName: narrativeTimelines.timelineName,
      timelineType: narrativeTimelines.timelineType,
      scope: narrativeTimelines.scope,
      universe: narrativeTimelines.universe,
      continuity: narrativeTimelines.continuity,
      timelineStatus: narrativeTimelines.timelineStatus,
      primaryHouse: narrativeTimelines.primaryHouse,
      associatedHouses: narrativeTimelines.associatedHouses,
      houseRelevanceScore: narrativeTimelines.houseRelevanceScore,
      marketInfluence: narrativeTimelines.marketInfluence,
      volatilityPotential: narrativeTimelines.volatilityPotential,
      speculativeValue: narrativeTimelines.speculativeValue,
      longTermImpact: narrativeTimelines.longTermImpact,
      totalStoryBeats: narrativeTimelines.totalStoryBeats,
      completedStoryBeats: narrativeTimelines.completedStoryBeats,
      criticalStoryBeats: narrativeTimelines.criticalStoryBeats,
      plotComplexity: narrativeTimelines.plotComplexity,
      primaryThemes: narrativeTimelines.primaryThemes,
      moralAlignment: narrativeTimelines.moralAlignment,
      emotionalTone: narrativeTimelines.emotionalTone,
      narrativeGenre: narrativeTimelines.narrativeGenre,
      culturalSignificance: narrativeTimelines.culturalSignificance,
      fandomEngagement: narrativeTimelines.fandomEngagement,
      iconicStatus: narrativeTimelines.iconicStatus,
      qualityScore: narrativeTimelines.qualityScore,
      createdAt: narrativeTimelines.createdAt,
      updatedAt: narrativeTimelines.updatedAt
    }).from(narrativeTimelines);

    // Apply filters
    const conditions = [];
    
    if (house) {
      if (typeof house === 'string') {
        conditions.push(sql`${narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${narrativeTimelines.associatedHouses})`);
      }
    }
    
    if (universe) {
      conditions.push(eq(narrativeTimelines.universe, universe as string));
    }
    
    if (timelineType) {
      conditions.push(eq(narrativeTimelines.timelineType, timelineType as string));
    }
    
    if (scope) {
      conditions.push(eq(narrativeTimelines.scope, scope as string));
    }
    
    if (status) {
      conditions.push(eq(narrativeTimelines.timelineStatus, status as string));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const validSortFields = ['marketInfluence', 'volatilityPotential', 'culturalSignificance', 'qualityScore', 'createdAt'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'marketInfluence';
    const order = sortOrder === 'asc' ? asc : desc;
    
    query = query.orderBy(order(narrativeTimelines[sortField as keyof typeof narrativeTimelines]));

    // Apply pagination
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const offsetNum = Math.max(parseInt(offset as string, 10), 0);
    query = query.limit(limitNum).offset(offsetNum);

    const timelines = await query;

    // Get total count for pagination
    const [{ count }] = await db.select({ count: sql`count(*)` }).from(narrativeTimelines);

    res.json({
      timelines,
      pagination: {
        total: Number(count),
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < Number(count)
      }
    });

  } catch (error) {
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
    const [timeline] = await db.select().from(narrativeTimelines)
      .where(eq(narrativeTimelines.id, id))
      .limit(1);

    if (!timeline) {
      return res.status(404).json({ error: 'Timeline not found' });
    }

    let storyBeatsData = [];
    if (includeBeats === 'true') {
      // Get associated story beats
      storyBeatsData = await db.select().from(storyBeats)
        .where(eq(storyBeats.timelineId, id))
        .orderBy(asc(storyBeats.chronologicalOrder));
    }

    // Get primary entities (characters) details
    let primaryEntitiesDetails = [];
    if (timeline.primaryEntities && timeline.primaryEntities.length > 0) {
      primaryEntitiesDetails = await db.select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        type: assets.type,
        imageUrl: assets.imageUrl,
        metadata: assets.metadata
      }).from(assets)
      .where(inArray(assets.id, timeline.primaryEntities));
    }

    res.json({
      timeline,
      storyBeats: storyBeatsData,
      primaryEntities: primaryEntitiesDetails
    });

  } catch (error) {
    console.error('Error fetching timeline details:', error);
    res.status(500).json({ error: 'Failed to fetch timeline details' });
  }
});

// Get timelines by trading house
router.get('/houses/:houseId/timelines', async (req, res) => {
  try {
    const { houseId } = req.params;
    const { limit = '10', includeMetrics = 'true' } = req.query;

    const limitNum = Math.min(parseInt(limit as string, 10), 50);

    let query = db.select().from(narrativeTimelines)
      .where(sql`${narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${narrativeTimelines.associatedHouses})`)
      .orderBy(desc(narrativeTimelines.houseRelevanceScore))
      .limit(limitNum);

    const timelines = await query;

    let houseMetrics = null;
    if (includeMetrics === 'true') {
      // Calculate house-specific metrics
      const [metrics] = await db.select({
        totalTimelines: sql`count(*)`,
        avgMarketInfluence: sql`avg(${narrativeTimelines.marketInfluence})`,
        avgVolatilityPotential: sql`avg(${narrativeTimelines.volatilityPotential})`,
        avgCulturalSignificance: sql`avg(${narrativeTimelines.culturalSignificance})`,
        totalStoryBeats: sql`sum(${narrativeTimelines.totalStoryBeats})`,
        avgQualityScore: sql`avg(${narrativeTimelines.qualityScore})`
      }).from(narrativeTimelines)
      .where(sql`${narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${narrativeTimelines.associatedHouses})`);

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

  } catch (error) {
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
    const {
      timelineId,
      beatType,
      beatCategory,
      house,
      minMarketRelevance,
      limit = '20',
      offset = '0'
    } = req.query;

    let query = db.select().from(storyBeats);
    const conditions = [];

    if (timelineId) {
      conditions.push(eq(storyBeats.timelineId, timelineId as string));
    }

    if (beatType) {
      conditions.push(eq(storyBeats.beatType, beatType as string));
    }

    if (beatCategory) {
      conditions.push(eq(storyBeats.beatCategory, beatCategory as string));
    }

    if (house) {
      conditions.push(eq(storyBeats.primaryHouse, house as string));
    }

    if (minMarketRelevance) {
      conditions.push(gte(storyBeats.marketRelevance, minMarketRelevance as string));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(storyBeats.marketRelevance));

    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    const offsetNum = Math.max(parseInt(offset as string, 10), 0);
    query = query.limit(limitNum).offset(offsetNum);

    const beats = await query;

    res.json({ storyBeats: beats });

  } catch (error) {
    console.error('Error fetching story beats:', error);
    res.status(500).json({ error: 'Failed to fetch story beats' });
  }
});

// Get critical story beats (high market impact)
router.get('/story-beats/critical', async (req, res) => {
  try {
    const { house, limit = '15' } = req.query;

    let query = db.select({
      id: storyBeats.id,
      timelineId: storyBeats.timelineId,
      beatTitle: storyBeats.beatTitle,
      beatType: storyBeats.beatType,
      beatCategory: storyBeats.beatCategory,
      primaryHouse: storyBeats.primaryHouse,
      marketRelevance: storyBeats.marketRelevance,
      priceImpactPotential: storyBeats.priceImpactPotential,
      volatilityTrigger: storyBeats.volatilityTrigger,
      speculationOpportunity: storyBeats.speculationOpportunity,
      plotSignificance: storyBeats.plotSignificance,
      iconicStatus: storyBeats.iconicStatus,
      description: storyBeats.description,
      thematicElements: storyBeats.thematicElements,
      emotionalImpact: storyBeats.emotionalImpact,
      createdAt: storyBeats.createdAt
    }).from(storyBeats)
      .where(sql`${storyBeats.plotSignificance} > 0.8 OR ${storyBeats.volatilityTrigger} > 0.8`);

    if (house) {
      query = query.where(eq(storyBeats.primaryHouse, house as string));
    }

    query = query.orderBy(desc(storyBeats.plotSignificance))
      .limit(parseInt(limit as string, 10));

    const criticalBeats = await query;

    res.json({ criticalBeats });

  } catch (error) {
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

    let query = db.select().from(marketInsights)
      .where(eq(marketInsights.category, category as string));

    if (house) {
      query = query.where(sql`${house} = ANY(${marketInsights.tags})`);
    }

    query = query.orderBy(desc(marketInsights.createdAt))
      .limit(parseInt(limit as string, 10));

    const insights = await query;

    res.json({ insights });

  } catch (error) {
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
      const ids = (assetIds as string).split(',');
      assetConditions.push(inArray(assetFinancialMapping.assetId, ids));
    }

    if (house) {
      assetConditions.push(sql`${assetFinancialMapping.correlationFactors}->>'houseAlignment' = ${house}`);
    }

    let query = db.select({
      assetId: assetFinancialMapping.assetId,
      volatilityMultiplier: assetFinancialMapping.volatilityMultiplier,
      trendDirection: assetFinancialMapping.trendDirection,
      beta: assetFinancialMapping.beta,
      correlationFactors: assetFinancialMapping.correlationFactors,
      updatedAt: assetFinancialMapping.updatedAt,
      // Join with asset details
      assetSymbol: assets.symbol,
      assetName: assets.name,
      assetType: assets.type
    }).from(assetFinancialMapping)
      .leftJoin(assets, eq(assetFinancialMapping.assetId, assets.id));

    if (assetConditions.length > 0) {
      query = query.where(and(...assetConditions));
    }

    query = query.orderBy(desc(assetFinancialMapping.volatilityMultiplier))
      .limit(20);

    const momentum = await query;

    res.json({ narrativeMomentum: momentum });

  } catch (error) {
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
        totalTimelines: sql`count(*)`,
        avgMarketInfluence: sql`avg(${narrativeTimelines.marketInfluence})`,
        avgVolatilityPotential: sql`avg(${narrativeTimelines.volatilityPotential})`,
        avgCulturalSignificance: sql`avg(${narrativeTimelines.culturalSignificance})`,
        totalStoryBeats: sql`sum(${narrativeTimelines.totalStoryBeats})`,
        avgQualityScore: sql`avg(${narrativeTimelines.qualityScore})`,
        avgIconicStatus: sql`avg(${narrativeTimelines.iconicStatus})`
      }).from(narrativeTimelines)
      .where(sql`${narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${narrativeTimelines.associatedHouses})`);

      const [beat_stats] = await db.select({
        totalBeats: sql`count(*)`,
        criticalBeats: sql`count(*) FILTER (WHERE ${storyBeats.plotSignificance} > 0.8)`,
        avgMarketRelevance: sql`avg(${storyBeats.marketRelevance})`,
        avgVolatilityTrigger: sql`avg(${storyBeats.volatilityTrigger})`,
        avgSpeculationOpportunity: sql`avg(${storyBeats.speculationOpportunity})`
      }).from(storyBeats)
      .where(eq(storyBeats.primaryHouse, houseId));

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

  } catch (error) {
    console.error('Error fetching house analytics:', error);
    res.status(500).json({ error: 'Failed to fetch house analytics' });
  }
});

// Get timeline performance metrics
router.get('/analytics/timeline-performance', async (req, res) => {
  try {
    const { timeframe = '30' } = req.query;

    const daysAgo = parseInt(timeframe as string, 10);
    const since = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const performance = await db.select({
      timelineType: narrativeTimelines.timelineType,
      universe: narrativeTimelines.universe,
      primaryHouse: narrativeTimelines.primaryHouse,
      count: sql`count(*)`,
      avgMarketInfluence: sql`avg(${narrativeTimelines.marketInfluence})`,
      avgVolatilityPotential: sql`avg(${narrativeTimelines.volatilityPotential})`,
      avgCulturalSignificance: sql`avg(${narrativeTimelines.culturalSignificance})`,
      avgQualityScore: sql`avg(${narrativeTimelines.qualityScore})`
    }).from(narrativeTimelines)
    .where(gte(narrativeTimelines.createdAt, since))
    .groupBy(
      narrativeTimelines.timelineType,
      narrativeTimelines.universe,
      narrativeTimelines.primaryHouse
    )
    .orderBy(desc(sql`avg(${narrativeTimelines.marketInfluence})`));

    res.json({ performance });

  } catch (error) {
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
    const [existingCount] = await db.select({ count: sql`count(*)` }).from(narrativeTimelines);
    
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

  } catch (error) {
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

  } catch (error) {
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
      id: narrativeTimelines.id,
      timelineName: narrativeTimelines.timelineName,
      timelineType: narrativeTimelines.timelineType,
      universe: narrativeTimelines.universe,
      primaryHouse: narrativeTimelines.primaryHouse,
      primaryThemes: narrativeTimelines.primaryThemes,
      moralAlignment: narrativeTimelines.moralAlignment,
      narrativeGenre: narrativeTimelines.narrativeGenre,
      marketInfluence: narrativeTimelines.marketInfluence,
      culturalSignificance: narrativeTimelines.culturalSignificance,
      qualityScore: narrativeTimelines.qualityScore,
      // Text search ranking
      rank: sql`ts_rank(to_tsvector('english', ${narrativeTimelines.timelineName} || ' ' || coalesce(${narrativeTimelines.primaryThemes}, '') || ' ' || coalesce(${narrativeTimelines.narrativeGenre}, '')), plainto_tsquery('english', ${searchQuery}))`
    }).from(narrativeTimelines)
    .where(sql`to_tsvector('english', ${narrativeTimelines.timelineName} || ' ' || coalesce(${narrativeTimelines.primaryThemes}, '') || ' ' || coalesce(${narrativeTimelines.narrativeGenre}, '')) @@ plainto_tsquery('english', ${searchQuery})`);

    if (house) {
      query = query.where(sql`${narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${narrativeTimelines.associatedHouses})`);
    }

    query = query.orderBy(desc(sql`rank`))
      .limit(parseInt(limit as string, 10));

    const results = await query;

    res.json({ searchResults: results });

  } catch (error) {
    console.error('Error searching timelines:', error);
    res.status(500).json({ error: 'Failed to search timelines' });
  }
});

// Get recommended timelines based on user preferences or house
router.get('/recommendations', async (req, res) => {
  try {
    const { house, userId, limit = '8' } = req.query;

    let query = db.select().from(narrativeTimelines);

    if (house) {
      // House-based recommendations
      query = query.where(sql`${narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${narrativeTimelines.associatedHouses})`)
        .orderBy(desc(narrativeTimelines.houseRelevanceScore), desc(narrativeTimelines.marketInfluence));
    } else {
      // General high-quality recommendations
      query = query.where(sql`${narrativeTimelines.qualityScore} > 0.7 AND ${narrativeTimelines.marketInfluence} > 0.6`)
        .orderBy(desc(narrativeTimelines.culturalSignificance), desc(narrativeTimelines.iconicStatus));
    }

    query = query.limit(parseInt(limit as string, 10));

    const recommendations = await query;

    res.json({ recommendations });

  } catch (error) {
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
      id: narrativeTimelines.id,
      timelineName: narrativeTimelines.timelineName,
      timelineType: narrativeTimelines.timelineType,
      universe: narrativeTimelines.universe,
      primaryHouse: narrativeTimelines.primaryHouse,
      primaryThemes: narrativeTimelines.primaryThemes,
      emotionalTone: narrativeTimelines.emotionalTone,
      marketInfluence: narrativeTimelines.marketInfluence,
      culturalSignificance: narrativeTimelines.culturalSignificance,
      iconicStatus: narrativeTimelines.iconicStatus,
      totalStoryBeats: narrativeTimelines.totalStoryBeats,
      qualityScore: narrativeTimelines.qualityScore
    }).from(narrativeTimelines);

    if (house) {
      query = query.where(sql`${narrativeTimelines.primaryHouse} = ${house} OR ${house} = ANY(${narrativeTimelines.associatedHouses})`);
    }

    // Get the highest quality, most culturally significant timeline
    query = query.orderBy(desc(narrativeTimelines.qualityScore), desc(narrativeTimelines.culturalSignificance))
      .limit(1);

    const [featuredTimeline] = await query;

    if (!featuredTimeline) {
      return res.json({ featuredTimeline: null });
    }

    // Get a few story beats for preview
    const previewBeats = await db.select({
      id: storyBeats.id,
      beatTitle: storyBeats.beatTitle,
      beatType: storyBeats.beatType,
      plotSignificance: storyBeats.plotSignificance,
      emotionalImpact: storyBeats.emotionalImpact,
      description: storyBeats.description
    }).from(storyBeats)
    .where(eq(storyBeats.timelineId, featuredTimeline.id))
    .orderBy(desc(storyBeats.plotSignificance))
    .limit(3);

    res.json({
      featuredTimeline: {
        ...featuredTimeline,
        previewBeats
      }
    });

  } catch (error) {
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
      id: storyBeats.id,
      timelineId: storyBeats.timelineId,
      beatTitle: storyBeats.beatTitle,
      beatType: storyBeats.beatType,
      primaryHouse: storyBeats.primaryHouse,
      marketRelevance: storyBeats.marketRelevance,
      volatilityTrigger: storyBeats.volatilityTrigger,
      speculationOpportunity: storyBeats.speculationOpportunity,
      plotSignificance: storyBeats.plotSignificance,
      emotionalImpact: storyBeats.emotionalImpact,
      description: storyBeats.description,
      createdAt: storyBeats.createdAt
    }).from(storyBeats)
    .where(sql`${storyBeats.volatilityTrigger} > 0.7 OR ${storyBeats.speculationOpportunity} > 0.7`);

    if (house) {
      query = query.where(eq(storyBeats.primaryHouse, house as string));
    }

    query = query.orderBy(desc(storyBeats.createdAt), desc(storyBeats.volatilityTrigger))
      .limit(parseInt(limit as string, 10));

    const sentimentBeats = await query;

    res.json({ sentimentBeats });

  } catch (error) {
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
      totalTimelines: sql`count(*)`,
      avgMarketInfluence: sql`avg(${narrativeTimelines.marketInfluence})`,
      avgCulturalSignificance: sql`avg(${narrativeTimelines.culturalSignificance})`,
      totalStoryBeats: sql`sum(${narrativeTimelines.totalStoryBeats})`,
      mostCommonTheme: sql`mode() within group (order by unnest(${narrativeTimelines.primaryThemes}))`,
      mostCommonGenre: sql`mode() within group (order by unnest(${narrativeTimelines.narrativeGenre}))`,
      highestQualityScore: sql`max(${narrativeTimelines.qualityScore})`
    }).from(narrativeTimelines)
    .where(sql`${narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${narrativeTimelines.associatedHouses})`);

    // Get top 3 timelines for this house
    const topTimelines = await db.select({
      id: narrativeTimelines.id,
      timelineName: narrativeTimelines.timelineName,
      timelineType: narrativeTimelines.timelineType,
      marketInfluence: narrativeTimelines.marketInfluence,
      qualityScore: narrativeTimelines.qualityScore,
      iconicStatus: narrativeTimelines.iconicStatus
    }).from(narrativeTimelines)
    .where(sql`${narrativeTimelines.primaryHouse} = ${houseId} OR ${houseId} = ANY(${narrativeTimelines.associatedHouses})`)
    .orderBy(desc(narrativeTimelines.qualityScore), desc(narrativeTimelines.iconicStatus))
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

  } catch (error) {
    console.error('Error fetching house overview widget:', error);
    res.status(500).json({ error: 'Failed to fetch house overview widget' });
  }
});

export default router;