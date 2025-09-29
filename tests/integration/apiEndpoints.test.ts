import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { CSVTestDataLoader, SAMPLE_CHARACTER_DATA } from '../fixtures/csvTestData.js';
import { testUtils } from '../setup.js';
import { CSVIngestionOrchestrator } from '../../server/services/enhancedComicDataIntegration.js';
import { VisualStorytellingService } from '../../server/services/visualStorytellingService.js';
import { NarrativeTradingMetricsService } from '../../server/services/narrativeTradingMetricsService.js';
import { sql, eq, and } from 'drizzle-orm';
import { 
  narrativeTimelines, storyBeats, marketInsights, enhancedCharacters,
  assetFinancialMapping, assets
} from '@shared/schema.js';

/**
 * REAL API Endpoint Tests for Phase 2 Storytelling System
 * Tests actual /api/storytelling/* endpoints with real HTTP requests and database operations
 * 
 * CRITICAL: These tests use the REAL Express server, REAL routes, and REAL database
 * No mocked API responses - tests hit actual production endpoints
 */
describe('REAL API Endpoints - Storytelling System', () => {
  let csvOrchestrator: CSVIngestionOrchestrator;
  let visualStorytellingService: VisualStorytellingService;
  let tradingMetricsService: NarrativeTradingMetricsService;
  let testAssetIds: string[] = [];
  
  beforeAll(async () => {
    console.log('🌐 Initializing REAL API Endpoint Tests...');
    
    // Initialize REAL production services
    csvOrchestrator = new CSVIngestionOrchestrator();
    visualStorytellingService = new VisualStorytellingService();
    tradingMetricsService = new NarrativeTradingMetricsService();
    
    // Create initial test data by running real CSV ingestion
    const testUserId = testUtils.generateTestId('user');
    await csvOrchestrator.startIngestion(testUserId);
    
    // Generate test assets for endpoint testing
    testAssetIds = [];
    const realAssets = await global.testDb.select()
      .from(assets)
      .where(sql`created_at > NOW() - INTERVAL '10 minutes'`)
      .limit(5);
    
    testAssetIds = realAssets.map(asset => asset.id);
    
    console.log(`✅ REAL API test environment initialized with ${testAssetIds.length} test assets`);
  }, 300000); // 5 minute timeout for full setup
  
  afterEach(async () => {
    // Cleanup test data but preserve test assets for other tests
    await testUtils.cleanupTestData([
      'market_insights'
    ], 'test_');
  }, 60000);

  describe('REAL Story Beat API Endpoints', () => {
    test('GET /api/storytelling/story-beats should return real paginated story beats', async () => {
      // First ensure we have story beats by creating timelines
      await visualStorytellingService.generateNarrativeTimelines();
      
      // Test basic pagination with REAL HTTP request
      const response = await request(global.testApp)
        .get('/api/storytelling/story-beats')
        .query({ page: 1, limit: 10 })
        .expect(200);
      
      expect(response.body.storyBeats).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      
      // Verify story beats have correct structure
      if (response.body.storyBeats.length > 0) {
        const beat = response.body.storyBeats[0];
        expect(beat.id).toBeDefined();
        expect(beat.beatTitle).toBeDefined();
        expect(beat.beatType).toBeDefined();
        expect(beat.timelinePosition).toBeGreaterThan(0);
        expect(beat.marketRelevance).toBeGreaterThanOrEqual(0);
        expect(beat.marketRelevance).toBeLessThanOrEqual(1);
      }
      
      console.log(`📚 Retrieved ${response.body.storyBeats.length} real story beats`);
    }, 180000);
    
    test('GET /api/storytelling/story-beats/:id should return real specific story beat', async () => {
      // Create real story beats first
      await visualStorytellingService.generateNarrativeTimelines();
      
      // Get a real story beat ID from database
      const [realBeat] = await global.testDb.select()
        .from(storyBeats)
        .where(sql`created_at > NOW() - INTERVAL '10 minutes'`)
        .limit(1);
      
      if (realBeat) {
        const response = await request(global.testApp)
          .get(`/api/storytelling/story-beats/${realBeat.id}`)
          .expect(200);
        
        expect(response.body.storyBeat).toBeDefined();
        expect(response.body.storyBeat.id).toBe(realBeat.id);
        expect(response.body.storyBeat.beatTitle).toBeDefined();
        expect(response.body.storyBeat.plotSignificance).toBeGreaterThanOrEqual(0);
        expect(response.body.storyBeat.plotSignificance).toBeLessThanOrEqual(1);
      }
    }, 120000);
    
    test('GET /api/storytelling/story-beats should support real filtering', async () => {
      // Create story beats with specific types
      await visualStorytellingService.generateNarrativeTimelines();
      
      // Test filtering by beat type
      const response = await request(global.testApp)
        .get('/api/storytelling/story-beats')
        .query({ beatType: 'origin_story' })
        .expect(200);
      
      expect(response.body.storyBeats).toBeInstanceOf(Array);
      
      // Verify all returned beats match the filter (if any exist)
      response.body.storyBeats.forEach((beat: any) => {
        if (beat.beatType) {
          expect(beat.beatType).toBe('origin_story');
        }
      });
      
      console.log(`🔍 Filtered to ${response.body.storyBeats.length} origin story beats`);
    }, 120000);
  });

  describe('REAL Narrative Timeline API Endpoints', () => {
    test('GET /api/storytelling/timelines should return real narrative timelines', async () => {
      // Generate real timelines using actual service
      const timelineIds = await visualStorytellingService.generateNarrativeTimelines();
      
      const response = await request(global.testApp)
        .get('/api/storytelling/timelines')
        .expect(200);
      
      expect(response.body.timelines).toBeInstanceOf(Array);
      expect(response.body.timelines.length).toBeGreaterThan(0);
      
      response.body.timelines.forEach((timeline: any) => {
        expect(timeline.id).toBeDefined();
        expect(timeline.timelineName).toBeDefined();
        expect(timeline.primaryHouse).toBeDefined();
        expect(timeline.marketInfluence).toBeGreaterThanOrEqual(0);
        expect(timeline.marketInfluence).toBeLessThanOrEqual(1);
      });
      
      console.log(`📖 Retrieved ${response.body.timelines.length} real narrative timelines`);
    }, 180000);
    
    test('GET /api/storytelling/timelines/:id/story-beats should return real ordered story beats', async () => {
      // Generate timelines first
      await visualStorytellingService.generateNarrativeTimelines();
      
      // Get a real timeline ID
      const [realTimeline] = await global.testDb.select()
        .from(narrativeTimelines)
        .where(sql`created_at > NOW() - INTERVAL '10 minutes'`)
        .limit(1);
      
      if (realTimeline) {
        const response = await request(global.testApp)
          .get(`/api/storytelling/timelines/${realTimeline.id}/story-beats`)
          .expect(200);
        
        expect(response.body.storyBeats).toBeInstanceOf(Array);
        
        // Verify story beats are ordered by timeline position
        if (response.body.storyBeats.length > 1) {
          const positions = response.body.storyBeats.map((beat: any) => beat.timelinePosition);
          const sortedPositions = [...positions].sort((a, b) => a - b);
          expect(positions).toEqual(sortedPositions);
        }
        
        console.log(`🎬 Timeline ${realTimeline.id} has ${response.body.storyBeats.length} story beats`);
      }
    }, 120000);
    
    test('GET /api/storytelling/timelines should support real house filtering', async () => {
      // Generate timelines first
      await visualStorytellingService.generateNarrativeTimelines();
      
      // Test filtering by house
      const response = await request(global.testApp)
        .get('/api/storytelling/timelines')
        .query({ house: 'heroes' })
        .expect(200);
      
      expect(response.body.timelines).toBeInstanceOf(Array);
      
      // Verify all returned timelines are associated with heroes house
      response.body.timelines.forEach((timeline: any) => {
        const isHeroesTimeline = 
          timeline.primaryHouse === 'heroes' || 
          (timeline.associatedHouses && timeline.associatedHouses.includes('heroes'));
        expect(isHeroesTimeline).toBe(true);
      });
      
      console.log(`🦸 Retrieved ${response.body.timelines.length} heroes house timelines`);
    }, 120000);
  });

  describe('REAL Trading Metrics API Endpoints', () => {
    test('GET /api/storytelling/trading-metrics should return real narrative-driven metrics', async () => {
      // Generate real trading metrics
      await tradingMetricsService.generateMetrics();
      
      const response = await request(global.testApp)
        .get('/api/storytelling/trading-metrics')
        .expect(200);
      
      expect(response.body.metrics).toBeInstanceOf(Array);
      expect(response.body.metrics.length).toBeGreaterThan(0);
      
      response.body.metrics.forEach((metric: any) => {
        expect(metric.assetId).toBeDefined();
        expect(metric.mythicVolatilityScore).toBeDefined();
        expect(metric.narrativeMomentumScore).toBeDefined();
        expect(metric.houseAffiliation).toBeDefined();
        
        // Validate real score ranges
        const volatility = parseFloat(metric.mythicVolatilityScore);
        const momentum = parseFloat(metric.narrativeMomentumScore);
        
        expect(volatility).toBeGreaterThanOrEqual(0);
        expect(volatility).toBeLessThanOrEqual(1);
        expect(momentum).toBeGreaterThanOrEqual(-5);
        expect(momentum).toBeLessThanOrEqual(5);
      });
      
      console.log(`📊 Retrieved ${response.body.metrics.length} real trading metrics`);
    }, 180000);
    
    test('GET /api/storytelling/trading-metrics/:assetId should return real specific asset metrics', async () => {
      // Generate metrics first
      await tradingMetricsService.generateMetrics();
      
      if (testAssetIds.length > 0) {
        const assetId = testAssetIds[0];
        
        const response = await request(global.testApp)
          .get(`/api/storytelling/trading-metrics/${assetId}`)
          .expect(200);
        
        expect(response.body.metrics).toBeDefined();
        expect(response.body.metrics.assetId).toBe(assetId);
        expect(response.body.metrics.calculationVersion).toBeGreaterThan(0);
        expect(response.body.metrics.lastRecalculation).toBeDefined();
        
        console.log(`🎯 Retrieved metrics for asset ${assetId}`);
      }
    }, 120000);
    
    test('GET /api/storytelling/trading-metrics should support real house filtering', async () => {
      // Generate metrics first
      await tradingMetricsService.generateMetrics();
      
      const houses = ['heroes', 'power', 'wisdom'];
      
      for (const house of houses) {
        const response = await request(global.testApp)
          .get('/api/storytelling/trading-metrics')
          .query({ houseAffiliation: house })
          .expect(200);
        
        expect(response.body.metrics).toBeInstanceOf(Array);
        
        // Verify all returned metrics are for the correct house
        response.body.metrics.forEach((metric: any) => {
          expect(metric.houseAffiliation).toBe(house);
        });
        
        console.log(`🏛️ House ${house}: ${response.body.metrics.length} metrics`);
      }
    }, 180000);
  });

  describe('REAL Market Insights API Endpoints', () => {
    test('GET /api/storytelling/market-insights should return real narrative market insights', async () => {
      // Create real market sentiment integration
      await visualStorytellingService.createMarketSentimentIntegration();
      
      const response = await request(global.testApp)
        .get('/api/storytelling/market-insights')
        .expect(200);
      
      expect(response.body.insights).toBeInstanceOf(Array);
      expect(response.body.insights.length).toBeGreaterThan(0);
      
      response.body.insights.forEach((insight: any) => {
        expect(insight.id).toBeDefined();
        expect(insight.insightType).toBeDefined();
        expect(insight.affectedAssets).toBeInstanceOf(Array);
        expect(insight.narrativeContext).toBeDefined();
        expect(insight.impactScore).toBeGreaterThanOrEqual(0);
        expect(insight.impactScore).toBeLessThanOrEqual(1);
        expect(insight.confidenceScore).toBeGreaterThanOrEqual(0);
        expect(insight.confidenceScore).toBeLessThanOrEqual(1);
      });
      
      console.log(`💡 Retrieved ${response.body.insights.length} real market insights`);
    }, 180000);
    
    test('GET /api/storytelling/market-insights should support real-time filtering', async () => {
      // Create market insights first
      await visualStorytellingService.createMarketSentimentIntegration();
      
      const timeFilters = [
        { timeRange: '1h', expectedMinutes: 60 },
        { timeRange: '24h', expectedMinutes: 1440 },
        { timeRange: '7d', expectedMinutes: 10080 }
      ];
      
      for (const filter of timeFilters) {
        const response = await request(global.testApp)
          .get('/api/storytelling/market-insights')
          .query({ timeRange: filter.timeRange })
          .expect(200);
        
        expect(response.body.insights).toBeInstanceOf(Array);
        
        // Verify insights are within the time window
        const cutoffTime = new Date(Date.now() - filter.expectedMinutes * 60 * 1000);
        response.body.insights.forEach((insight: any) => {
          const insightTime = new Date(insight.createdAt);
          expect(insightTime.getTime()).toBeGreaterThanOrEqual(cutoffTime.getTime());
        });
        
        console.log(`⏰ ${filter.timeRange}: ${response.body.insights.length} insights`);
      }
    }, 180000);
  });

  describe('REAL House Analytics API Endpoints', () => {
    test('GET /api/storytelling/houses should return real house analytics', async () => {
      // Generate real data first
      await csvOrchestrator.startIngestion(testUtils.generateTestId('user'));
      await tradingMetricsService.generateMetrics();
      
      const response = await request(global.testApp)
        .get('/api/storytelling/houses')
        .expect(200);
      
      expect(response.body.houses).toBeInstanceOf(Array);
      expect(response.body.houses.length).toBeGreaterThan(0); // Should have at least some houses
      
      response.body.houses.forEach((house: any) => {
        expect(house.houseId).toBeDefined();
        expect(house.houseName).toBeDefined();
        expect(house.totalAssets).toBeGreaterThanOrEqual(0);
        expect(house.avgVolatilityMultiplier).toBeGreaterThan(0);
        expect(house.activeNarrativeEvents).toBeGreaterThanOrEqual(0);
      });
      
      console.log(`🏛️ Retrieved analytics for ${response.body.houses.length} houses`);
    }, 240000);
    
    test('GET /api/storytelling/houses/:houseId/performance should return real house performance', async () => {
      // Generate data first
      await tradingMetricsService.generateMetrics();
      
      const houses = ['heroes', 'power', 'wisdom'];
      
      for (const houseId of houses) {
        const response = await request(global.testApp)
          .get(`/api/storytelling/houses/${houseId}/performance`)
          .expect(200);
        
        expect(response.body.houseId).toBe(houseId);
        expect(response.body.performance).toBeDefined();
        expect(response.body.performance.totalReturn).toBeDefined();
        expect(response.body.performance.volatility).toBeGreaterThanOrEqual(0);
        expect(response.body.performance.sharpeRatio).toBeDefined();
        expect(response.body.topAssets).toBeInstanceOf(Array);
        
        console.log(`📈 House ${houseId} performance: ${response.body.performance.totalReturn.toFixed(3)} return`);
      }
    }, 180000);
  });

  describe('REAL API Error Handling', () => {
    test('should return 404 for non-existent story beats', async () => {
      const nonExistentId = 'non_existent_beat_id_12345';
      
      const response = await request(global.testApp)
        .get(`/api/storytelling/story-beats/${nonExistentId}`)
        .expect(404);
      
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('not found');
    });
    
    test('should return 400 for invalid pagination parameters', async () => {
      const invalidParams = [
        { page: -1, limit: 10 },
        { page: 1, limit: -5 },
        { page: 'invalid', limit: 10 },
        { page: 1, limit: 1001 } // Over max limit
      ];
      
      for (const params of invalidParams) {
        const response = await request(global.testApp)
          .get('/api/storytelling/story-beats')
          .query(params)
          .expect(400);
        
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toBeDefined();
      }
    });
    
    test('should handle invalid filter parameters gracefully', async () => {
      const invalidFilters = [
        { minNarrativeSignificance: 'invalid' },
        { beatType: 123 },
        { timeRange: 'invalid_range' }
      ];
      
      for (const filter of invalidFilters) {
        const response = await request(global.testApp)
          .get('/api/storytelling/story-beats')
          .query(filter);
        
        // Should either return 400 or filter out invalid params gracefully
        expect([200, 400, 422]).toContain(response.status);
      }
    });
  });

  describe('REAL API Performance Tests', () => {
    test('should handle large result sets with real pagination', async () => {
      // Generate enough data for pagination testing
      await visualStorytellingService.generateNarrativeTimelines();
      
      const { duration } = await testUtils.measurePerformance(
        'Large result set pagination',
        async () => {
          const response = await request(global.testApp)
            .get('/api/storytelling/story-beats')
            .query({ page: 1, limit: 100 })
            .expect(200);
          
          expect(response.body.storyBeats).toBeInstanceOf(Array);
          expect(response.body.storyBeats.length).toBeLessThanOrEqual(100);
          expect(response.body.pagination).toBeDefined();
          
          return response.body.storyBeats.length;
        }
      );
      
      expect(duration).toBeLessThan(5000); // Should respond within 5 seconds
      console.log(`⚡ Large pagination completed in ${duration}ms`);
    }, 120000);
    
    test('should support concurrent real API requests', async () => {
      // Generate data first
      await tradingMetricsService.generateMetrics();
      
      const concurrentRequests = 5; // Conservative for real database
      const startTime = Date.now();
      
      const requestPromises = Array(concurrentRequests).fill(0).map(() => 
        request(global.testApp)
          .get('/api/storytelling/trading-metrics')
          .expect(200)
      );
      
      const responses = await Promise.all(requestPromises);
      const endTime = Date.now();
      
      responses.forEach(response => {
        expect(response.body.metrics).toBeDefined();
        expect(response.body.metrics).toBeInstanceOf(Array);
      });
      
      const totalTime = endTime - startTime;
      const avgResponseTime = totalTime / concurrentRequests;
      
      expect(avgResponseTime).toBeLessThan(3000); // Average under 3 seconds for real DB
      
      console.log(`📊 Concurrent API Performance: ${concurrentRequests} requests in ${totalTime}ms (avg: ${avgResponseTime.toFixed(0)}ms)`);
    }, 120000);
    
    test('should efficiently serve house analytics with real data', async () => {
      // Generate comprehensive data
      await csvOrchestrator.startIngestion(testUtils.generateTestId('user'));
      await tradingMetricsService.generateMetrics();
      
      const { duration } = await testUtils.measurePerformance(
        'House analytics API response time',
        async () => {
          const response = await request(global.testApp)
            .get('/api/storytelling/houses')
            .expect(200);
          
          return response.body.houses.length;
        }
      );
      
      expect(duration).toBeLessThan(2000); // Should respond within 2 seconds
      console.log(`🏛️ House analytics served in ${duration}ms`);
    }, 180000);
  });
  
  // Additional cleanup - ensure test data is cleaned up
  afterAll(async () => {
    await testUtils.cleanupAllTestData();
    CSVTestDataLoader.cleanupTempCSVs();
  });
});

// NOTE: All mockApiRequest functions removed - using REAL supertest HTTP requests
// No more simulated responses - tests hit actual production API endpoints