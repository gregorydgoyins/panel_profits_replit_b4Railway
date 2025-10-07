import { Router } from 'express';
import { marvelExpansionService } from '../services/marvelExpansionService';
import { MarvelCoverBot } from '../services/marvelCoverBot';

const router = Router();
const coverBot = new MarvelCoverBot();

/**
 * Get Marvel API status
 */
router.get('/status', async (req, res) => {
  try {
    // Test API connection by fetching 1 character
    const result = await marvelExpansionService.fetchCharacters(1, 0);
    
    res.json({
      success: true,
      connected: true,
      totalCharacters: result.data.total,
      totalComics: 0, // We'll fetch this separately to save API calls
      totalCreators: 0,
      message: `Marvel API connected. ${result.data.total.toLocaleString()} characters available.`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      connected: false,
      error: error.message
    });
  }
});

/**
 * Get available resource counts
 */
router.get('/counts', async (req, res) => {
  try {
    const [characters, comics, creators] = await Promise.all([
      marvelExpansionService.fetchCharacters(1, 0),
      marvelExpansionService.fetchComics(1, 0),
      marvelExpansionService.fetchCreators(1, 0)
    ]);
    
    res.json({
      success: true,
      counts: {
        characters: characters.data.total,
        comics: comics.data.total,
        creators: creators.data.total,
        total: characters.data.total + comics.data.total + creators.data.total
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Expand characters from Marvel API
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/characters', async (req, res) => {
  try {
    const startOffset = parseInt(req.query.startOffset as string) || 0;
    const maxToProcess = parseInt(req.query.maxToProcess as string) || 1000;
    
    console.log(`\n🦸 Starting Marvel character expansion`);
    console.log(`   Start Offset: ${startOffset}`);
    console.log(`   Max To Process: ${maxToProcess}`);
    
    // Start expansion
    const progress = await marvelExpansionService.expandCharacters(
      startOffset,
      maxToProcess
    );
    
    res.json({
      success: true,
      progress
    });
  } catch (error: any) {
    console.error('❌ Character expansion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Expand comics from Marvel API
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/comics', async (req, res) => {
  try {
    const startOffset = parseInt(req.query.startOffset as string) || 0;
    const maxToProcess = parseInt(req.query.maxToProcess as string) || 1000;
    
    console.log(`\n📚 Starting Marvel comic expansion`);
    console.log(`   Start Offset: ${startOffset}`);
    console.log(`   Max To Process: ${maxToProcess}`);
    
    // Start expansion
    const progress = await marvelExpansionService.expandComics(
      startOffset,
      maxToProcess
    );
    
    res.json({
      success: true,
      progress
    });
  } catch (error: any) {
    console.error('❌ Comic expansion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Expand creators from Marvel API
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/creators', async (req, res) => {
  try {
    const startOffset = parseInt(req.query.startOffset as string) || 0;
    const maxToProcess = parseInt(req.query.maxToProcess as string) || 1000;
    
    console.log(`\n✍️ Starting Marvel creator expansion`);
    console.log(`   Start Offset: ${startOffset}`);
    console.log(`   Max To Process: ${maxToProcess}`);
    
    // Start expansion
    const progress = await marvelExpansionService.expandCreators(
      startOffset,
      maxToProcess
    );
    
    res.json({
      success: true,
      progress
    });
  } catch (error: any) {
    console.error('❌ Creator expansion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test endpoint - fetch small sample without inserting
 */
router.get('/test/sample', async (req, res) => {
  try {
    const resourceType = (req.query.type as string) || 'characters';
    const limit = parseInt(req.query.limit as string) || 5;
    
    let results;
    if (resourceType === 'characters') {
      results = await marvelExpansionService.fetchCharacters(limit, 0);
    } else if (resourceType === 'comics') {
      results = await marvelExpansionService.fetchComics(limit, 0);
    } else if (resourceType === 'creators') {
      results = await marvelExpansionService.fetchCreators(limit, 0);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid resource type. Use: characters, comics, or creators'
      });
    }
    
    res.json({
      success: true,
      resourceType,
      total: results.data.total,
      sampleSize: results.data.results.length,
      sample: results.data.results.slice(0, 3).map((item: any) => ({
        id: item.id,
        name: item.name || item.title || item.fullName,
        thumbnail: item.thumbnail,
        modified: item.modified
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Marvel Cover Bot - Fetch and store comic cover images
 * POST /api/marvel/covers/fetch
 * Body: { limit?: number, titleStartsWith?: string, noVariants?: boolean }
 */
router.post('/covers/fetch', async (req, res) => {
  try {
    const { limit, titleStartsWith, noVariants } = req.body;
    
    console.log(`\n📸 Starting Marvel cover fetch`);
    console.log(`   Limit: ${limit || 20}`);
    console.log(`   Title filter: ${titleStartsWith || 'none'}`);
    console.log(`   No variants: ${noVariants || false}`);
    
    const result = await coverBot.fetchAndStoreCovers({
      limit: limit || 20,
      titleStartsWith,
      noVariants: noVariants || false,
      skipExisting: true,
    });
    
    res.json({
      success: true,
      result,
      message: `Processed ${result.totalProcessed} comics: ${result.successCount} saved, ${result.skippedCount} skipped, ${result.failureCount} failed`
    });
  } catch (error: any) {
    console.error('❌ Cover fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Fetch key issues for a specific series
 * POST /api/marvel/covers/key-issues
 * Body: { series: string, limit?: number }
 */
router.post('/covers/key-issues', async (req, res) => {
  try {
    const { series, limit } = req.body;
    
    if (!series) {
      return res.status(400).json({
        success: false,
        error: 'Series title is required'
      });
    }
    
    console.log(`\n🔑 Fetching key issues for: ${series}`);
    
    const result = await coverBot.fetchKeyIssues(series, limit || 50);
    
    res.json({
      success: true,
      result,
      message: `Found ${result.successCount} key issues for ${series}`
    });
  } catch (error: any) {
    console.error('❌ Key issues fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Fetch first issues for multiple series
 * POST /api/marvel/covers/first-issues
 * Body: { series: string[] }
 */
router.post('/covers/first-issues', async (req, res) => {
  try {
    const { series } = req.body;
    
    if (!Array.isArray(series) || series.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Array of series titles is required'
      });
    }
    
    console.log(`\n#️⃣1️⃣ Fetching #1 issues for ${series.length} series`);
    
    const result = await coverBot.fetchSeriesFirstIssues(series);
    
    res.json({
      success: true,
      result,
      message: `Collected ${result.successCount} first issues from ${series.length} series`
    });
  } catch (error: any) {
    console.error('❌ First issues fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get cover collection statistics
 * GET /api/marvel/covers/stats
 */
router.get('/covers/stats', async (req, res) => {
  try {
    const stats = await coverBot.getCoverStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('❌ Stats fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
