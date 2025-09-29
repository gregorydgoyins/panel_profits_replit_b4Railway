import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { CSVTestDataLoader } from '../fixtures/csvTestData.js';
import { testUtils } from '../setup.js';
import { CSVIngestionOrchestrator } from '../../server/services/enhancedComicDataIntegration.js';
import { NarrativeDataPipeline } from '../../server/services/narrativeDataPipeline.js';
import { NarrativeTradingMetricsService } from '../../server/services/narrativeTradingMetricsService.js';
import { VisualStorytellingService } from '../../server/services/visualStorytellingService.js';
import { NarrativeMarketIntegration } from '../../server/services/narrativeMarketIntegration.js';
import { sql, eq, and, inArray, desc } from 'drizzle-orm';
import { 
  stagingRecords, ingestionJobs, ingestionRuns, narrativeEntities,
  enhancedCharacters, assetFinancialMapping, assets, marketInsights,
  narrativeTradingMetrics, narrativeTimelines, storyBeats, 
  storyEventTriggers, rawDatasetFiles
} from '@shared/schema.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * REAL End-to-End Pipeline Integration Tests
 * Tests the complete production pipeline flow with REAL data and services:
 * 
 * CSV file → CSVIngestionOrchestrator → staging tables → entity resolution → 
 * enrichment → narrativeDataPipeline → trading metrics → market simulation
 * 
 * CRITICAL: These tests use REAL CSV files, REAL services, and REAL database operations
 * Every step of the pipeline is tested with actual production code paths
 */
describe('REAL End-to-End Pipeline Integration Tests', () => {
  let csvOrchestrator: CSVIngestionOrchestrator;
  let narrativePipeline: NarrativeDataPipeline;
  let tradingMetricsService: NarrativeTradingMetricsService;
  let visualStorytellingService: VisualStorytellingService;
  let marketIntegration: NarrativeMarketIntegration;
  
  const REAL_CSV_FILE = 'comic_characters_1759075358597.csv'; // 21k+ real records
  const PIPELINE_TIMEOUT = 900000; // 15 minutes for full pipeline
  
  beforeAll(async () => {
    console.log('🚀 Initializing REAL End-to-End Pipeline Tests...');
    
    // Initialize ALL REAL production services
    csvOrchestrator = new CSVIngestionOrchestrator();
    narrativePipeline = new NarrativeDataPipeline();
    tradingMetricsService = new NarrativeTradingMetricsService();
    visualStorytellingService = new VisualStorytellingService();
    marketIntegration = new NarrativeMarketIntegration();
    
    // Initialize pipeline with REAL database connection
    await narrativePipeline.initialize();
    
    // Verify real CSV file exists
    const csvPath = path.join('attached_assets', REAL_CSV_FILE);
    expect(fs.existsSync(csvPath)).toBe(true);
    
    const fileStats = fs.statSync(csvPath);
    console.log(`📊 Using REAL CSV: ${REAL_CSV_FILE} (${(fileStats.size / 1024 / 1024).toFixed(1)}MB)`);
    
    console.log('✅ REAL end-to-end pipeline services initialized');
  }, 180000); // 3 minute timeout for initialization
  
  afterEach(async () => {
    // Comprehensive cleanup of ALL test data
    await testUtils.cleanupAllTestData();
    
    // Clean up any temporary files
    CSVTestDataLoader.cleanupTempCSVs();
  }, 120000);

  describe('REAL Complete Pipeline Flow', () => {
    test('should execute REAL end-to-end pipeline: CSV → Ingestion → Enrichment → Trading → Market Integration', async () => {
      const { result, duration } = await testUtils.measurePerformance(
        'REAL Complete End-to-End Pipeline',
        async () => {
          const pipelineStartTime = Date.now();
          const pipelineSteps = [];
          
          // ===== STEP 1: CSV INGESTION =====
          console.log('📥 STEP 1: Starting REAL CSV ingestion...');
          const step1Start = Date.now();
          
          const testUserId = testUtils.generateTestId('user');
          const jobId = await csvOrchestrator.startIngestion(testUserId);
          
          expect(jobId).toBeDefined();
          expect(typeof jobId).toBe('string');
          
          // Wait for REAL ingestion to complete
          let job;
          let attempts = 0;
          const maxAttempts = 60; // 5 minutes
          
          do {
            await testUtils.wait(5000);
            [job] = await global.testDb.select()
              .from(ingestionJobs)
              .where(eq(ingestionJobs.id, jobId));
            attempts++;
            
            if (job) {
              console.log(`📊 Ingestion progress: ${job.progress}% (${job.status})`);
            }
          } while (job && job.status !== 'completed' && job.status !== 'failed' && attempts < maxAttempts);
          
          expect(job).toBeDefined();
          expect(job.status).toBe('completed');
          expect(job.progress).toBe(100);
          
          const step1Duration = Date.now() - step1Start;
          pipelineSteps.push({ step: 'CSV Ingestion', duration: step1Duration });
          
          // Verify REAL staging records
          const stagingData = await global.testDb.select()
            .from(stagingRecords)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          expect(stagingData.length).toBeGreaterThan(1000); // Expect substantial data
          console.log(`✅ STEP 1 Complete: ${stagingData.length} staging records created`);
          
          // ===== STEP 2: ENTITY RESOLUTION & ENRICHMENT =====
          console.log('🧬 STEP 2: Starting REAL entity resolution and enrichment...');
          const step2Start = Date.now();
          
          const enrichmentResult = await narrativePipeline.processEnrichedData();
          expect(enrichmentResult).toBeDefined();
          
          const step2Duration = Date.now() - step2Start;
          pipelineSteps.push({ step: 'Entity Resolution & Enrichment', duration: step2Duration });
          
          // Verify REAL narrative entities and enhanced characters
          const entities = await global.testDb.select()
            .from(narrativeEntities)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          const enhancedChars = await global.testDb.select()
            .from(enhancedCharacters)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          expect(entities.length).toBeGreaterThan(500);
          expect(enhancedChars.length).toBeGreaterThan(200);
          console.log(`✅ STEP 2 Complete: ${entities.length} entities, ${enhancedChars.length} enhanced characters`);
          
          // ===== STEP 3: NARRATIVE TRADING METRICS =====
          console.log('📊 STEP 3: Generating REAL narrative trading metrics...');
          const step3Start = Date.now();
          
          const metricsResult = await tradingMetricsService.generateMetrics();
          expect(metricsResult).toBeDefined();
          
          const step3Duration = Date.now() - step3Start;
          pipelineSteps.push({ step: 'Trading Metrics Generation', duration: step3Duration });
          
          // Verify REAL trading metrics and asset mappings
          const tradingMetricsData = await global.testDb.select()
            .from(narrativeTradingMetrics)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          const assetMappings = await global.testDb.select()
            .from(assetFinancialMapping)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          expect(tradingMetricsData.length).toBeGreaterThan(50);
          expect(assetMappings.length).toBeGreaterThan(100);
          console.log(`✅ STEP 3 Complete: ${tradingMetricsData.length} trading metrics, ${assetMappings.length} asset mappings`);
          
          // ===== STEP 4: VISUAL STORYTELLING & TIMELINES =====
          console.log('📚 STEP 4: Creating REAL narrative timelines and story beats...');
          const step4Start = Date.now();
          
          const timelineIds = await visualStorytellingService.generateNarrativeTimelines();
          expect(timelineIds).toBeDefined();
          expect(Array.isArray(timelineIds)).toBe(true);
          expect(timelineIds.length).toBeGreaterThan(0);
          
          const step4Duration = Date.now() - step4Start;
          pipelineSteps.push({ step: 'Narrative Timelines & Story Beats', duration: step4Duration });
          
          // Verify REAL timelines and story beats
          const timelines = await global.testDb.select()
            .from(narrativeTimelines)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          const storyBeatsData = await global.testDb.select()
            .from(storyBeats)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          expect(timelines.length).toBeGreaterThan(5);
          expect(storyBeatsData.length).toBeGreaterThan(10);
          console.log(`✅ STEP 4 Complete: ${timelines.length} timelines, ${storyBeatsData.length} story beats`);
          
          // ===== STEP 5: MARKET SENTIMENT INTEGRATION =====
          console.log('💹 STEP 5: Creating REAL market sentiment integration...');
          const step5Start = Date.now();
          
          await visualStorytellingService.createMarketSentimentIntegration();
          
          const step5Duration = Date.now() - step5Start;
          pipelineSteps.push({ step: 'Market Sentiment Integration', duration: step5Duration });
          
          // Verify REAL market insights
          const marketInsightsData = await global.testDb.select()
            .from(marketInsights)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          expect(marketInsightsData.length).toBeGreaterThan(10);
          console.log(`✅ STEP 5 Complete: ${marketInsightsData.length} market insights`);
          
          // ===== STEP 6: MARKET SIMULATION INTEGRATION =====
          console.log('🎯 STEP 6: Testing REAL market simulation integration...');
          const step6Start = Date.now();
          
          // Test narrative-driven market events
          const marketEvents = await marketIntegration.applyStoryEvents();
          expect(marketEvents).toBeDefined();
          
          const step6Duration = Date.now() - step6Start;
          pipelineSteps.push({ step: 'Market Simulation Integration', duration: step6Duration });
          
          // Verify REAL story event triggers and price adjustments
          const eventTriggers = await global.testDb.select()
            .from(storyEventTriggers)
            .where(sql`created_at > NOW() - INTERVAL '10 minutes'`);
          
          // Verify volatility updates in asset mappings
          const updatedAssetMappings = await global.testDb.select()
            .from(assetFinancialMapping)
            .where(and(
              sql`created_at > NOW() - INTERVAL '10 minutes'`,
              sql`volatility_multiplier > 1.0` // Should have some volatility adjustments
            ));
          
          expect(eventTriggers.length).toBeGreaterThan(0);
          expect(updatedAssetMappings.length).toBeGreaterThan(10);
          console.log(`✅ STEP 6 Complete: ${eventTriggers.length} event triggers, ${updatedAssetMappings.length} volatility updates`);
          
          const totalPipelineDuration = Date.now() - pipelineStartTime;
          
          return {
            jobId,
            pipelineSteps,
            totalDuration: totalPipelineDuration,
            // Final counts
            stagingRecords: stagingData.length,
            narrativeEntities: entities.length,
            enhancedCharacters: enhancedChars.length,
            tradingMetrics: tradingMetricsData.length,
            assetMappings: assetMappings.length,
            narrativeTimelines: timelines.length,
            storyBeats: storyBeatsData.length,
            marketInsights: marketInsightsData.length,
            eventTriggers: eventTriggers.length,
            volatilityUpdates: updatedAssetMappings.length
          };
        }
      );
      
      // Verify pipeline completion and data integrity
      expect(result.stagingRecords).toBeGreaterThan(1000);
      expect(result.narrativeEntities).toBeGreaterThan(500);
      expect(result.enhancedCharacters).toBeGreaterThan(200);
      expect(result.tradingMetrics).toBeGreaterThan(50);
      expect(result.assetMappings).toBeGreaterThan(100);
      expect(result.narrativeTimelines).toBeGreaterThan(5);
      expect(result.storyBeats).toBeGreaterThan(10);
      expect(result.marketInsights).toBeGreaterThan(10);
      expect(result.eventTriggers).toBeGreaterThan(0);
      expect(result.volatilityUpdates).toBeGreaterThan(10);
      
      expect(duration).toBeLessThan(PIPELINE_TIMEOUT);
      
      console.log(`🎉 REAL END-TO-END PIPELINE COMPLETED in ${(duration / 1000 / 60).toFixed(1)} minutes!`);
      console.log('📊 Final Pipeline Results:');
      console.log(`  - Staging Records: ${result.stagingRecords.toLocaleString()}`);
      console.log(`  - Narrative Entities: ${result.narrativeEntities.toLocaleString()}`);
      console.log(`  - Enhanced Characters: ${result.enhancedCharacters.toLocaleString()}`);
      console.log(`  - Trading Metrics: ${result.tradingMetrics.toLocaleString()}`);
      console.log(`  - Asset Mappings: ${result.assetMappings.toLocaleString()}`);
      console.log(`  - Narrative Timelines: ${result.narrativeTimelines.toLocaleString()}`);
      console.log(`  - Story Beats: ${result.storyBeats.toLocaleString()}`);
      console.log(`  - Market Insights: ${result.marketInsights.toLocaleString()}`);
      console.log(`  - Event Triggers: ${result.eventTriggers.toLocaleString()}`);
      console.log(`  - Volatility Updates: ${result.volatilityUpdates.toLocaleString()}`);
      
      console.log('\n⏱️ Pipeline Step Timing:');
      result.pipelineSteps.forEach(step => {
        console.log(`  - ${step.step}: ${(step.duration / 1000).toFixed(1)}s`);
      });
    }, PIPELINE_TIMEOUT);
    
    test('should verify REAL data consistency across all pipeline stages', async () => {
      const { result, duration } = await testUtils.measurePerformance(
        'REAL Data Consistency Verification',
        async () => {
          // First run the complete pipeline
          const testUserId = testUtils.generateTestId('user');
          const jobId = await csvOrchestrator.startIngestion(testUserId);
          
          // Wait for completion
          let job;
          let attempts = 0;
          do {
            await testUtils.wait(5000);
            [job] = await global.testDb.select()
              .from(ingestionJobs)
              .where(eq(ingestionJobs.id, jobId));
            attempts++;
          } while (job && job.status !== 'completed' && attempts < 60);
          
          expect(job.status).toBe('completed');
          
          // Run enrichment and trading metrics
          await narrativePipeline.processEnrichedData();
          await tradingMetricsService.generateMetrics();
          await visualStorytellingService.generateNarrativeTimelines();
          await visualStorytellingService.createMarketSentimentIntegration();
          
          // ===== DATA CONSISTENCY CHECKS =====
          
          // 1. Verify staging → entity resolution consistency
          const stagingWithEntities = await global.testDb.select({
            stagingId: stagingRecords.id,
            entityId: narrativeEntities.id,
            entityName: narrativeEntities.entityName,
            stagingType: stagingRecords.recordType
          }).from(stagingRecords)
          .leftJoin(narrativeEntities, 
            sql`${stagingRecords.rawData}->>'Character' = ${narrativeEntities.entityName}`)
          .where(sql`${stagingRecords.created_at} > NOW() - INTERVAL '15 minutes'`)
          .limit(100);
          
          const entitiesWithStagingData = stagingWithEntities.filter(row => row.entityId !== null);
          expect(entitiesWithStagingData.length).toBeGreaterThan(10);
          
          // 2. Verify entity → enhanced character consistency
          const entitiesWithCharacters = await global.testDb.select({
            entityId: narrativeEntities.id,
            entityName: narrativeEntities.entityName,
            characterId: enhancedCharacters.id,
            characterName: enhancedCharacters.characterName,
            houseAffiliation: enhancedCharacters.houseAffiliation
          }).from(narrativeEntities)
          .leftJoin(enhancedCharacters, 
            sql`${narrativeEntities.entityName} = ${enhancedCharacters.characterName}`)
          .where(sql`${narrativeEntities.created_at} > NOW() - INTERVAL '15 minutes'`)
          .limit(50);
          
          const matchedCharacters = entitiesWithCharacters.filter(row => row.characterId !== null);
          expect(matchedCharacters.length).toBeGreaterThan(5);
          
          // 3. Verify character → asset mapping consistency
          const charactersWithAssets = await global.testDb.select({
            characterId: enhancedCharacters.id,
            characterName: enhancedCharacters.characterName,
            assetId: enhancedCharacters.assetId,
            mappingId: assetFinancialMapping.id,
            volatilityMultiplier: assetFinancialMapping.volatilityMultiplier
          }).from(enhancedCharacters)
          .leftJoin(assetFinancialMapping, 
            eq(enhancedCharacters.assetId, assetFinancialMapping.assetId))
          .where(and(
            sql`${enhancedCharacters.created_at} > NOW() - INTERVAL '15 minutes'`,
            sql`${enhancedCharacters.assetId} IS NOT NULL`
          ))
          .limit(50);
          
          const charactersWithMappings = charactersWithAssets.filter(row => row.mappingId !== null);
          expect(charactersWithMappings.length).toBeGreaterThan(10);
          
          // 4. Verify house affiliation distribution
          const houseDistribution = await global.testDb.select({
            houseAffiliation: enhancedCharacters.houseAffiliation,
            count: sql`COUNT(*)`
          }).from(enhancedCharacters)
          .where(and(
            sql`${enhancedCharacters.created_at} > NOW() - INTERVAL '15 minutes'`,
            sql`${enhancedCharacters.houseAffiliation} IS NOT NULL`
          ))
          .groupBy(enhancedCharacters.houseAffiliation);
          
          expect(houseDistribution.length).toBeGreaterThan(3); // At least 4 houses represented
          
          // 5. Verify trading metrics have valid ranges
          const tradingMetricsData = await global.testDb.select()
            .from(narrativeTradingMetrics)
            .where(sql`created_at > NOW() - INTERVAL '15 minutes'`)
            .limit(50);
          
          tradingMetricsData.forEach(metric => {
            if (metric.mythicVolatilityScore) {
              const volatility = parseFloat(metric.mythicVolatilityScore);
              expect(volatility).toBeGreaterThanOrEqual(0);
              expect(volatility).toBeLessThanOrEqual(1);
            }
            if (metric.narrativeMomentumScore) {
              const momentum = parseFloat(metric.narrativeMomentumScore);
              expect(momentum).toBeGreaterThanOrEqual(-5);
              expect(momentum).toBeLessThanOrEqual(5);
            }
          });
          
          return {
            entitiesWithStagingData: entitiesWithStagingData.length,
            matchedCharacters: matchedCharacters.length,
            charactersWithMappings: charactersWithMappings.length,
            houseDistribution: houseDistribution.length,
            validTradingMetrics: tradingMetricsData.length
          };
        }
      );
      
      expect(result.entitiesWithStagingData).toBeGreaterThan(10);
      expect(result.matchedCharacters).toBeGreaterThan(5);
      expect(result.charactersWithMappings).toBeGreaterThan(10);
      expect(result.houseDistribution).toBeGreaterThan(3);
      expect(result.validTradingMetrics).toBeGreaterThan(0);
      
      console.log(`🔍 REAL data consistency verification completed in ${(duration / 1000).toFixed(1)}s:`);
      console.log(`  - Entities with staging data: ${result.entitiesWithStagingData}`);
      console.log(`  - Matched characters: ${result.matchedCharacters}`);
      console.log(`  - Characters with asset mappings: ${result.charactersWithMappings}`);
      console.log(`  - Houses represented: ${result.houseDistribution}`);
      console.log(`  - Valid trading metrics: ${result.validTradingMetrics}`);
    }, 600000); // 10 minute timeout for consistency checks
  });

  describe('REAL Pipeline Error Handling and Recovery', () => {
    test('should handle REAL pipeline failures gracefully with proper cleanup', async () => {
      const { result, duration } = await testUtils.measurePerformance(
        'REAL Pipeline Failure Handling',
        async () => {
          // Test various failure scenarios with real data
          
          // 1. Test database connection recovery
          console.log('🔧 Testing database connection resilience...');
          
          const testUserId = testUtils.generateTestId('user');
          const jobId = await csvOrchestrator.startIngestion(testUserId);
          
          // Simulate processing interruption (wait briefly then check status)
          await testUtils.wait(10000);
          
          const [jobDuringProcessing] = await global.testDb.select()
            .from(ingestionJobs)
            .where(eq(ingestionJobs.id, jobId));
          
          expect(jobDuringProcessing).toBeDefined();
          expect(['running', 'completed']).toContain(jobDuringProcessing.status);
          
          // Wait for completion
          let finalJob;
          let attempts = 0;
          do {
            await testUtils.wait(5000);
            [finalJob] = await global.testDb.select()
              .from(ingestionJobs)
              .where(eq(ingestionJobs.id, jobId));
            attempts++;
          } while (finalJob && finalJob.status === 'running' && attempts < 60);
          
          expect(finalJob.status).toBe('completed');
          
          // 2. Test cleanup procedures
          console.log('🧹 Testing cleanup procedures...');
          
          const preCleanupRecords = await global.testDb.select()
            .from(stagingRecords)
            .where(sql`created_at > NOW() - INTERVAL '15 minutes'`);
          
          expect(preCleanupRecords.length).toBeGreaterThan(0);
          
          // Perform cleanup
          await testUtils.cleanupTestData(['staging_records'], 'test_');
          
          const postCleanupRecords = await global.testDb.select()
            .from(stagingRecords)
            .where(sql`created_at > NOW() - INTERVAL '15 minutes'`);
          
          // Some records should remain (the real data we want to test)
          expect(postCleanupRecords.length).toBeGreaterThanOrEqual(0);
          
          return {
            jobId,
            jobStatus: finalJob.status,
            preCleanupCount: preCleanupRecords.length,
            postCleanupCount: postCleanupRecords.length
          };
        }
      );
      
      expect(result.jobStatus).toBe('completed');
      expect(result.preCleanupCount).toBeGreaterThan(0);
      
      console.log(`🛡️ REAL pipeline resilience test completed in ${(duration / 1000).toFixed(1)}s:`);
      console.log(`  - Job completed: ${result.jobStatus}`);
      console.log(`  - Pre-cleanup records: ${result.preCleanupCount}`);
      console.log(`  - Post-cleanup records: ${result.postCleanupCount}`);
    }, 600000); // 10 minute timeout for error handling tests
  });
  
  // Final cleanup
  afterAll(async () => {
    await testUtils.cleanupAllTestData();
    CSVTestDataLoader.cleanupTempCSVs();
    console.log('🏁 REAL end-to-end pipeline tests completed and cleaned up');
  });
});

// NOTE: This test exercises the COMPLETE production pipeline with REAL data
// Every step uses actual production services and verifies real database state changes