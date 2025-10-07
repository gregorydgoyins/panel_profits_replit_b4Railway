import { Router } from 'express';
import { storage } from '../storage';
import { symbolGeneratorService } from '../services/SymbolGeneratorService';
import { symbolRegistry } from '../services/SymbolRegistryService';
import { isTickerGenerationFrozen, isNewSymbolRegistryEnabled, getMigrationStatus } from '../config/tickerMigration';

const router = Router();

/**
 * Get migration status
 * GET /api/symbols/migration-status
 */
router.get('/migration-status', (req, res) => {
  res.json({
    status: getMigrationStatus(),
    frozenOldGeneration: isTickerGenerationFrozen(),
    newRegistryEnabled: isNewSymbolRegistryEnabled(),
  });
});

/**
 * Test symbol generation without creating assets
 * POST /api/symbols/test
 */
router.post('/test', async (req, res) => {
  // Check if old ticker generation is frozen
  if (isTickerGenerationFrozen() && !req.body.forceOld) {
    return res.status(423).json({
      error: 'Ticker generation is currently frozen for migration',
      status: getMigrationStatus(),
      hint: 'Use the new Symbol Registry or set forceOld=true to bypass'
    });
  }
  try {
    const { type, name, metadata } = req.body;
    
    if (!type || !name) {
      return res.status(400).json({ error: 'Type and name are required' });
    }
    
    const symbol = symbolGeneratorService.generateSymbol(type, name, metadata);
    
    res.json({
      success: true,
      input: { type, name, metadata },
      generatedSymbol: symbol
    });
  } catch (error: any) {
    console.error('Symbol generation test error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Regenerate symbols for a batch of assets
 * POST /api/symbols/regenerate
 */
router.post('/regenerate', async (req, res) => {
  try {
    const { assetIds, dryRun = true } = req.body;
    
    if (!assetIds || !Array.isArray(assetIds)) {
      return res.status(400).json({ error: 'assetIds array is required' });
    }
    
    const results = [];
    
    for (const assetId of assetIds) {
      const asset = await storage.getAssetById(assetId);
      
      if (!asset) {
        results.push({
          assetId,
          success: false,
          error: 'Asset not found'
        });
        continue;
      }
      
      // Generate new symbol
      const newSymbol = symbolGeneratorService.generateSymbol(
        asset.type,
        asset.name,
        asset.metadata
      );
      
      // Make it unique
      const uniqueSymbol = await symbolGeneratorService.makeUnique(
        newSymbol,
        async (symbol) => {
          const existing = await storage.getAssetBySymbol(symbol);
          return !!existing && existing.id !== assetId;
        }
      );
      
      results.push({
        assetId,
        oldSymbol: asset.symbol,
        newSymbol: uniqueSymbol,
        name: asset.name,
        type: asset.type,
        success: true,
        changed: asset.symbol !== uniqueSymbol
      });
      
      // If not dry run, update the asset
      if (!dryRun) {
        await storage.updateAsset(assetId, { symbol: uniqueSymbol });
      }
    }
    
    res.json({
      success: true,
      dryRun,
      processed: results.length,
      changed: results.filter(r => r.changed).length,
      results
    });
  } catch (error: any) {
    console.error('Symbol regeneration error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Regenerate symbols for all assets of a type
 * POST /api/symbols/regenerate-by-type
 */
router.post('/regenerate-by-type', async (req, res) => {
  try {
    const { type, limit = 100, dryRun = true } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }
    
    // Get assets of this type
    const assets = await storage.getAssetsByType(type, limit);
    
    const results = [];
    
    for (const asset of assets) {
      // Generate new symbol
      const newSymbol = symbolGeneratorService.generateSymbol(
        asset.type,
        asset.name,
        asset.metadata
      );
      
      // Make it unique
      const uniqueSymbol = await symbolGeneratorService.makeUnique(
        newSymbol,
        async (symbol) => {
          const existing = await storage.getAssetBySymbol(symbol);
          return !!existing && existing.id !== asset.id;
        }
      );
      
      results.push({
        assetId: asset.id,
        oldSymbol: asset.symbol,
        newSymbol: uniqueSymbol,
        name: asset.name,
        type: asset.type,
        success: true,
        changed: asset.symbol !== uniqueSymbol
      });
      
      // If not dry run, update the asset
      if (!dryRun) {
        await storage.updateAsset(asset.id, { symbol: uniqueSymbol });
      }
    }
    
    res.json({
      success: true,
      dryRun,
      type,
      processed: results.length,
      changed: results.filter(r => r.changed).length,
      results: results.slice(0, 20), // Return first 20 for preview
      summary: {
        total: results.length,
        changed: results.filter(r => r.changed).length,
        unchanged: results.filter(r => !r.changed).length
      }
    });
  } catch (error: any) {
    console.error('Symbol regeneration by type error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Regenerate symbols for ALL assets (in batches to avoid timeout)
 * POST /api/symbols/regenerate-all
 */
router.post('/regenerate-all', async (req, res) => {
  try {
    const { batchSize = 500, dryRun = false } = req.body;
    
    console.log(`🔄 Starting bulk symbol regeneration (dryRun: ${dryRun}, batchSize: ${batchSize})...`);
    
    // Get all assets in batches
    let offset = 0;
    let totalProcessed = 0;
    let totalChanged = 0;
    const assetTypes = ['comic', 'character', 'creator', 'franchise', 'series'];
    
    for (const type of assetTypes) {
      const assets = await storage.getAssetsByType(type, batchSize);
      
      console.log(`📦 Processing ${assets.length} ${type} assets...`);
      
      for (const asset of assets) {
        // Generate new symbol
        const newSymbol = symbolGeneratorService.generateSymbol(
          asset.type,
          asset.name,
          asset.metadata
        );
        
        // Make it unique
        const uniqueSymbol = await symbolGeneratorService.makeUnique(
          newSymbol,
          async (symbol) => {
            const existing = await storage.getAssetBySymbol(symbol);
            return !!existing && existing.id !== asset.id;
          }
        );
        
        if (asset.symbol !== uniqueSymbol) {
          totalChanged++;
          
          // If not dry run, update the asset
          if (!dryRun) {
            await storage.updateAsset(asset.id, { symbol: uniqueSymbol });
          }
        }
        
        totalProcessed++;
      }
    }
    
    console.log(`✅ Bulk symbol regeneration complete: ${totalProcessed} processed, ${totalChanged} changed`);
    
    res.json({
      success: true,
      dryRun,
      processed: totalProcessed,
      changed: totalChanged,
      unchanged: totalProcessed - totalChanged,
      message: dryRun 
        ? `Preview: ${totalChanged} symbols would be updated out of ${totalProcessed} assets`
        : `Successfully updated ${totalChanged} symbols out of ${totalProcessed} assets`
    });
  } catch (error: any) {
    console.error('Bulk symbol regeneration error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
