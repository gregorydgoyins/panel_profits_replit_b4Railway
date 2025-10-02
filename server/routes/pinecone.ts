import { Router } from "express";
import { pineconeService } from "../services/pineconeService";
import { openaiService } from "../services/openaiService";
import { pineconeAssetExpansion } from "../services/pineconeAssetExpansion";

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

export default router;
