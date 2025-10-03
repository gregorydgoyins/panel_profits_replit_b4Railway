import { Router } from "express";
import { pineconeService } from "../services/pineconeService";
import { openaiService } from "../services/openaiService";
import { pineconeAssetExpansion } from "../services/pineconeAssetExpansion";
import { pineconeAssetSeeder } from "../services/pineconeAssetSeeder";
import { pineconeMarketDataMigration } from "../services/pineconeMarketDataMigration";
import { assetInsertionService } from "../services/assetInsertionService";
import { kaggleAssetExpansion } from "../services/kaggleAssetExpansion";

const router = Router();

/**
 * Search Pinecone for similar items
 * POST /api/pinecone/search
 * Body: { query: string, topK?: number }
 */
router.post("/search", async (req, res) => {
  try {
    const { query, topK = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Generate embedding for the query using OpenAI
    const embedding = await openaiService.generateEmbedding(query);
    
    if (!embedding) {
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    // Query Pinecone
    const results = await pineconeService.querySimilar(embedding, topK);

    res.json({
      query,
      results: results?.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata
      })) || []
    });
  } catch (error) {
    console.error('Pinecone search error:', error);
    res.status(500).json({ error: "Search failed" });
  }
});

/**
 * Get sample records from Pinecone to understand structure
 * GET /api/pinecone/sample
 */
router.get("/sample", async (req, res) => {
  try {
    // Use a zero vector to get random samples (no semantic meaning needed)
    const zeroVector = new Array(1024).fill(0);
    zeroVector[0] = 0.1; // Small value to avoid errors
    
    const results = await pineconeService.querySimilar(zeroVector, 10);

    res.json({
      message: "Sample records from Pinecone index (no OpenAI required)",
      totalRecords: 63934,
      dimension: 1024,
      samples: results?.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata
      })) || []
    });
  } catch (error) {
    console.error('Pinecone sample error:', error);
    res.status(500).json({ error: "Failed to fetch samples" });
  }
});

/**
 * Fetch specific records by ID (no OpenAI needed)
 * POST /api/pinecone/fetch
 * Body: { ids: string[] }
 */
router.post("/fetch", async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "IDs array is required" });
    }

    const records = await pineconeService.fetchVectors(ids);

    res.json({
      records: Object.entries(records || {}).map(([id, record]: [string, any]) => ({
        id,
        metadata: record.metadata,
        values: record.values
      }))
    });
  } catch (error) {
    console.error('Pinecone fetch error:', error);
    res.status(500).json({ error: "Fetch failed" });
  }
});

/**
 * Expand Pinecone records into tradeable assets
 * POST /api/pinecone/expand
 * Body: { samplesPerCategory?: number }
 */
router.post("/expand", async (req, res) => {
  try {
    const { samplesPerCategory = 50 } = req.body;
    
    console.log(`🚀 Starting asset expansion with ${samplesPerCategory} samples per category...`);
    
    const result = await pineconeAssetExpansion.expandAssetDatabase(samplesPerCategory);
    
    res.json(result);
  } catch (error) {
    console.error('Asset expansion error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : "Expansion failed" 
    });
  }
});

/**
 * Seed assets from Pinecone into the database
 * POST /api/pinecone/seed-assets
 * Body: { 
 *   batchSize?: number,           // Assets per batch (default: 100)
 *   totalSamples?: number,         // Total samples to process (overrides samplesPerCategory)
 *   samplesPerCategory?: number    // Samples per category (default: 100)
 * }
 * 
 * Returns: {
 *   success: boolean,
 *   totalProcessed: number,
 *   inserted: number,
 *   skipped: number,
 *   errors: number,
 *   processingTime: number,
 *   errorDetails?: string[]
 * }
 */
router.post("/seed-assets", async (req, res) => {
  try {
    const { 
      batchSize = 100, 
      totalSamples,
      samplesPerCategory = 100 
    } = req.body;

    // Validate parameters
    if (batchSize && (typeof batchSize !== 'number' || batchSize < 1 || batchSize > 500)) {
      return res.status(400).json({ 
        error: "batchSize must be a number between 1 and 500" 
      });
    }

    if (samplesPerCategory && (typeof samplesPerCategory !== 'number' || samplesPerCategory < 1)) {
      return res.status(400).json({ 
        error: "samplesPerCategory must be a positive number" 
      });
    }

    // Use totalSamples to override samplesPerCategory if provided
    const effectiveSamplesPerCategory = totalSamples 
      ? Math.ceil(totalSamples / 3) // Divide by 3 for characters, creators, comics
      : samplesPerCategory;

    console.log(`🌱 Starting Pinecone asset seeding pipeline...`);
    console.log(`   - Batch size: ${batchSize}`);
    console.log(`   - Samples per category: ${effectiveSamplesPerCategory}`);
    
    const result = await pineconeAssetSeeder.seedAssets({
      batchSize,
      samplesPerCategory: effectiveSamplesPerCategory
    });
    
    res.json(result);
  } catch (error) {
    console.error('❌ Asset seeding error:', error);
    res.status(500).json({ 
      success: false,
      totalProcessed: 0,
      inserted: 0,
      skipped: 0,
      errors: 1,
      processingTime: 0,
      errorDetails: [error instanceof Error ? error.message : "Seeding failed"]
    });
  }
});

/**
 * EXHAUSTIVELY mine ALL 63,934+ Pinecone vectors
 * POST /api/pinecone/seed-all-vectors
 * Body: { batchSize?: number }
 * 
 * This endpoint:
 * 1. Lists ALL vector IDs using listPaginated()
 * 2. Fetches all vectors with metadata
 * 3. Transforms them into tradeable assets with pricing
 * 4. Bulk inserts into database
 * 
 * Returns: {
 *   success: boolean,
 *   totalProcessed: number,
 *   inserted: number,
 *   skipped: number,
 *   errors: number,
 *   processingTime: number
 * }
 */
router.post("/seed-all-vectors", async (req, res) => {
  try {
    const { batchSize = 100 } = req.body;
    
    console.log('🔥 STARTING EXHAUSTIVE PINECONE MINING');
    console.log(`   Processing ALL 63,934+ vectors exhaustively`);
    const startTime = Date.now();
    
    // Step 1: Exhaustively mine all vectors
    const expansionResult = await pineconeAssetExpansion.expandAllVectorsExhaustively();
    
    if (!expansionResult.success) {
      return res.status(500).json({
        success: false,
        totalProcessed: 0,
        inserted: 0,
        skipped: 0,
        errors: 1,
        processingTime: Date.now() - startTime,
        errorDetails: [expansionResult.error || 'Expansion failed']
      });
    }

    console.log(`✅ Expansion complete: ${expansionResult.totalAssets} assets ready for seeding`);

    // Step 2: Combine all assets for bulk insertion
    const allAssets = [
      ...expansionResult.assets.characterAssets,
      ...expansionResult.assets.creatorAssets,
      ...expansionResult.assets.comicAssets
    ];

    console.log(`💾 Starting bulk insertion of ${allAssets.length} assets...`);
    
    const insertionResult = await assetInsertionService.insertPricedAssets(allAssets, batchSize);

    const processingTime = Date.now() - startTime;
    
    console.log('═══════════════════════════════════════');
    console.log('✅ EXHAUSTIVE PINECONE MINING COMPLETE');
    console.log(`📊 Total processed: ${allAssets.length}`);
    console.log(`✅ Inserted: ${insertionResult.inserted}`);
    console.log(`⏭️  Skipped: ${insertionResult.skipped}`);
    console.log(`❌ Errors: ${insertionResult.errors}`);
    console.log(`⏱️  Time: ${(processingTime / 1000).toFixed(2)}s`);
    console.log('═══════════════════════════════════════');

    res.json({
      success: true,
      totalProcessed: allAssets.length,
      inserted: insertionResult.inserted,
      skipped: insertionResult.skipped,
      errors: insertionResult.errors,
      processingTime,
      errorDetails: insertionResult.errorMessages.length > 0 ? insertionResult.errorMessages.slice(0, 10) : undefined
    });
  } catch (error) {
    console.error('❌ Exhaustive mining error:', error);
    res.status(500).json({
      success: false,
      totalProcessed: 0,
      inserted: 0,
      skipped: 0,
      errors: 1,
      processingTime: 0,
      errorDetails: [error instanceof Error ? error.message : 'Unknown error']
    });
  }
});

/**
 * Migrate market_data for existing Pinecone assets
 * POST /api/pinecone/migrate-market-data
 * 
 * Finds all assets with metadata.pineconeId and creates market_data entries
 * for those that don't have them yet, using pricing from asset metadata.
 * 
 * Returns: {
 *   processed: number,    // Total Pinecone assets checked
 *   created: number,      // New market_data entries created
 *   skipped: number,      // Assets that already had market_data
 *   errors: number,       // Number of failures
 *   errorDetails?: string[]
 * }
 */
router.post("/migrate-market-data", async (req, res) => {
  try {
    console.log('🔄 Starting Pinecone market_data migration...');
    
    const result = await pineconeMarketDataMigration.migrateMarketData();
    
    res.json(result);
  } catch (error) {
    console.error('❌ Market data migration error:', error);
    res.status(500).json({ 
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 1,
      errorDetails: [error instanceof Error ? error.message : "Migration failed"]
    });
  }
});

/**
 * Kaggle asset expansion - Process ALL 23,272 characters exhaustively
 * POST /api/kaggle/expand-all
 * 
 * Mines FiveThirtyEight dataset (marvel-characters.csv + dc-characters.csv)
 * to create tradeable assets from characters, teams, series, and creators.
 * 
 * Expected yield: 100K-300K assets from character metadata extraction
 * 
 * Returns: {
 *   charactersProcessed: number,
 *   teamsGenerated: number,
 *   seriesGenerated: number,
 *   totalAssetsGenerated: number,
 *   insertionResults: { inserted, skipped, errors },
 *   processingTime: string,
 *   errors: string[]
 * }
 */
router.post("/kaggle/expand-all", async (req, res) => {
  try {
    console.log('═══════════════════════════════════════');
    console.log('🚀 KAGGLE EXPANSION: Processing ALL 23,272 characters');
    console.log('═══════════════════════════════════════');
    
    const startTime = Date.now();
    const result = await kaggleAssetExpansion.expandAllCharacters();
    const processingTime = Date.now() - startTime;
    
    console.log('✅ KAGGLE EXPANSION COMPLETE');
    console.log(`📊 Characters: ${result.charactersProcessed}`);
    console.log(`📊 Teams: ${result.teamsGenerated}`);
    console.log(`📊 Series: ${result.seriesGenerated}`);
    console.log(`📊 Total assets: ${result.totalAssetsGenerated}`);
    console.log(`✅ Inserted: ${result.insertionResults.inserted}`);
    console.log(`⏭️  Skipped: ${result.insertionResults.skipped}`);
    console.log(`❌ Errors: ${result.insertionResults.errors}`);
    console.log(`⏱️  Time: ${(processingTime / 1000).toFixed(2)}s`);
    console.log('═══════════════════════════════════════');
    
    res.json({
      success: true,
      ...result,
      processingTime
    });
  } catch (error) {
    console.error('❌ Kaggle expansion error:', error);
    res.status(500).json({
      success: false,
      charactersProcessed: 0,
      teamsGenerated: 0,
      seriesGenerated: 0,
      totalAssetsGenerated: 0,
      insertionResults: { inserted: 0, skipped: 0, errors: 1 },
      errors: [error instanceof Error ? error.message : 'Unknown error']
    });
  }
});

export default router;
