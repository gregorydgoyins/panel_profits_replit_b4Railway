import express from 'express';
import { marvelDcDataImportService } from '../services/marvelDcDataImportService.js';
import { ComicDataImportService } from '../services/comicDataImportService.js';
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

// Import comprehensive Marvel Comics CSV (40,506 issues)
router.post('/marvel-comics', async (req, res) => {
  try {
    console.log('🚀 Starting comprehensive Marvel Comics CSV import...');
    console.log('📋 Processing 40,506 comic issues with full metadata extraction...');
    
    const result = await ComicDataImportService.importMarvelComicsCSV();
    
    const totalImported = result.seriesResults.imported + result.issuesResults.imported + result.creatorsResults.imported;
    const totalErrors = result.seriesResults.errors.length + result.issuesResults.errors.length + result.creatorsResults.errors.length;
    
    if (totalImported > 0) {
      res.status(200).json({
        success: true,
        message: `Successfully imported comprehensive Marvel Comics data`,
        data: {
          summary: {
            totalImported,
            totalErrors,
            featuredComics: result.featuredResults.created
          },
          series: {
            imported: result.seriesResults.imported,
            errors: result.seriesResults.errors.length
          },
          issues: {
            imported: result.issuesResults.imported,
            errors: result.issuesResults.errors.length
          },
          creators: {
            imported: result.creatorsResults.imported,
            errors: result.creatorsResults.errors.length
          },
          featured: {
            created: result.featuredResults.created,
            errors: result.featuredResults.errors.length
          },
          errors: {
            series: result.seriesResults.errors.slice(0, 5),
            issues: result.issuesResults.errors.slice(0, 5),
            creators: result.creatorsResults.errors.slice(0, 5),
            featured: result.featuredResults.errors
          }
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Marvel Comics import failed - no data imported',
        data: {
          errors: {
            series: result.seriesResults.errors,
            issues: result.issuesResults.errors,
            creators: result.creatorsResults.errors,
            featured: result.featuredResults.errors
          }
        }
      });
    }
    
  } catch (error) {
    console.error('🚨 Marvel Comics import API error:', error);
    res.status(500).json({
      success: false,
      message: 'Marvel Comics import process failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Marvel Comics import status and statistics
router.get('/marvel-comics/status', async (req, res) => {
  try {
    const statistics = await ComicDataImportService.getImportStatistics();
    
    res.json({
      success: true,
      data: {
        statistics,
        isImported: statistics.totalIssues > 1000, // Consider imported if we have substantial data
        importProgress: statistics.totalIssues >= 40000 ? 100 : Math.round((statistics.totalIssues / 40506) * 100),
        marvelComicsComplete: statistics.totalIssues >= 40000
      }
    });
    
  } catch (error) {
    console.error('🚨 Marvel Comics status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check Marvel Comics import status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;