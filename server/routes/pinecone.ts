import { Router } from "express";
import { pineconeService } from "../services/pineconeService";
import { openaiService } from "../services/openaiService";

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
    // Query with a generic embedding to get sample results
    const sampleQuery = "superhero comic book character";
    const embedding = await openaiService.generateEmbedding(sampleQuery);
    
    if (!embedding) {
      return res.status(500).json({ error: "Failed to generate sample embedding" });
    }

    const results = await pineconeService.querySimilar(embedding, 5);

    res.json({
      message: "Sample records from Pinecone index",
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

export default router;
