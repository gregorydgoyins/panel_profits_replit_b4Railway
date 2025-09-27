import express from 'express';
import { marvelDcDataImportService } from '../services/marvelDcDataImportService.js';
import { storage } from '../storage.js';

const router = express.Router();

/**
 * Marvel vs DC Dataset Import Routes
 * Transform 1,691 movie/TV entries into tradeable comic assets
 */

// Import Marvel vs DC dataset
router.post('/marvel-dc', async (req, res) => {
  try {
    console.log('🚀 Starting Marvel vs DC dataset import via API...');
    
    const result = await marvelDcDataImportService.importMarvelDcDataset();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Successfully imported ${result.imported} assets from Marvel vs DC dataset`,
        data: {
          imported: result.imported,
          totalAssets: result.assets.length,
          errors: result.errors,
          assets: result.assets.slice(0, 10), // Return first 10 asset symbols as preview
          ...(result.assets.length > 10 && { hasMore: true })
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Dataset import failed',
        data: {
          imported: result.imported,
          errors: result.errors
        }
      });
    }
    
  } catch (error) {
    console.error('🚨 Dataset import API error:', error);
    res.status(500).json({
      success: false,
      message: 'Import process failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get import status/statistics
router.get('/marvel-dc/status', async (req, res) => {
  try {
    // Get current asset count to show import progress
    const assets = await storage.getAssets({ type: 'media' });
    const marvelAssets = await storage.getAssets();
    
    // Filter for Marvel/DC assets (basic heuristic)
    const marvelDcAssets = marvelAssets.filter(asset => 
      asset.metadata && (
        (asset.metadata as any).publisher === 'Marvel' || 
        (asset.metadata as any).publisher === 'DC' ||
        asset.symbol.includes('MARVEL') ||
        asset.symbol.includes('BATMAN') ||
        asset.symbol.includes('SUPERMAN') ||
        asset.symbol.includes('AVENGERS') ||
        asset.symbol.includes('SPIDER')
      )
    );
    
    res.json({
      success: true,
      data: {
        totalAssets: marvelAssets.length,
        marvelDcAssets: marvelDcAssets.length,
        mediaAssets: assets.length,
        isImported: marvelDcAssets.length > 100, // Assume imported if we have substantial Marvel/DC assets
        importProgress: Math.min(100, Math.round((marvelDcAssets.length / 1691) * 100))
      }
    });
    
  } catch (error) {
    console.error('🚨 Import status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check import status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test single asset transformation (for testing without full import)
router.post('/marvel-dc/test', async (req, res) => {
  try {
    const { testEntry } = req.body;
    
    if (!testEntry) {
      return res.status(400).json({
        success: false,
        message: 'testEntry required in request body'
      });
    }
    
    // Create a test transformation without saving to database
    const testAsset = {
      ID: testEntry.ID || '999',
      Movie: testEntry.Movie || 'Test Movie',
      Year: testEntry.Year || '2023',
      Genre: testEntry.Genre || 'Action,Adventure',
      RunTime: testEntry.RunTime || '120 min',
      Description: testEntry.Description || 'Test description for transformation',
      IMDB_Score: testEntry.IMDB_Score || '7.5'
    };
    
    // Use the transformation logic without saving
    const symbol = testAsset.Movie
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toUpperCase() + '_' + (testAsset.Year.match(/(\d{4})/) || ['', '2023'])[1];
    
    res.json({
      success: true,
      message: 'Test transformation completed',
      data: {
        original: testAsset,
        transformed: {
          symbol,
          name: testAsset.Movie,
          type: 'media',
          description: testAsset.Description,
          metadata: {
            publisher: testAsset.Movie.toLowerCase().includes('spider-man') ? 'Marvel' : 'DC',
            year: parseInt((testAsset.Year.match(/(\d{4})/) || ['', '2023'])[1]),
            imdbScore: parseFloat(testAsset.IMDB_Score),
            genres: testAsset.Genre.split(',').map((g: string) => g.trim())
          }
        }
      }
    });
    
  } catch (error) {
    console.error('🚨 Test transformation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test transformation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;