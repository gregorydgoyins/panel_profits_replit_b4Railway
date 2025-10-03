import { Router } from 'express';
import { comicVineExpansionService } from '../services/comicVineExpansionService';

const router = Router();

/**
 * Get Comic Vine API status
 */
router.get('/status', async (req, res) => {
  try {
    // Test API connection by fetching 1 character
    const result = await comicVineExpansionService.fetchCharacters(1, 0);
    
    res.json({
      success: true,
      connected: true,
      totalCharacters: result.total,
      message: `Comic Vine API connected. ${result.total.toLocaleString()} characters available.`
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
    const [characters, issues, creators] = await Promise.all([
      comicVineExpansionService.fetchCharacters(1, 0),
      comicVineExpansionService.fetchIssues(1, 0),
      comicVineExpansionService.fetchCreators(1, 0)
    ]);
    
    res.json({
      success: true,
      counts: {
        characters: characters.total,
        issues: issues.total,
        creators: creators.total,
        total: characters.total + issues.total + creators.total
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
 * Expand characters from Comic Vine
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/characters', async (req, res) => {
  try {
    const startOffset = parseInt(req.query.startOffset as string) || 0;
    const maxToProcess = parseInt(req.query.maxToProcess as string) || 1000;
    
    console.log(`\n🚀 Starting Comic Vine character expansion`);
    console.log(`   Start Offset: ${startOffset}`);
    console.log(`   Max To Process: ${maxToProcess}`);
    
    // Start expansion (this will take a while)
    const progress = await comicVineExpansionService.expandCharacters(
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
 * Expand issues from Comic Vine
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/issues', async (req, res) => {
  try {
    const startOffset = parseInt(req.query.startOffset as string) || 0;
    const maxToProcess = parseInt(req.query.maxToProcess as string) || 1000;
    
    console.log(`\n🚀 Starting Comic Vine issue expansion`);
    console.log(`   Start Offset: ${startOffset}`);
    console.log(`   Max To Process: ${maxToProcess}`);
    
    // Start expansion
    const progress = await comicVineExpansionService.expandIssues(
      startOffset,
      maxToProcess
    );
    
    res.json({
      success: true,
      progress
    });
  } catch (error: any) {
    console.error('❌ Issue expansion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Expand creators from Comic Vine
 * Query params:
 *   - startOffset: Starting offset (default: 0)
 *   - maxToProcess: Max items to process (default: 1000)
 */
router.post('/expand/creators', async (req, res) => {
  try {
    const startOffset = parseInt(req.query.startOffset as string) || 0;
    const maxToProcess = parseInt(req.query.maxToProcess as string) || 1000;
    
    console.log(`\n🚀 Starting Comic Vine creator expansion`);
    console.log(`   Start Offset: ${startOffset}`);
    console.log(`   Max To Process: ${maxToProcess}`);
    
    // Start expansion
    const progress = await comicVineExpansionService.expandCreators(
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
      results = await comicVineExpansionService.fetchCharacters(limit, 0);
    } else if (resourceType === 'issues') {
      results = await comicVineExpansionService.fetchIssues(limit, 0);
    } else if (resourceType === 'creators') {
      results = await comicVineExpansionService.fetchCreators(limit, 0);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid resource type. Use: characters, issues, or creators'
      });
    }
    
    res.json({
      success: true,
      resourceType,
      total: results.total,
      sampleSize: results.results.length,
      sample: results.results.slice(0, 3).map((item: any) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher?.name,
        image: item.image?.medium_url
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
