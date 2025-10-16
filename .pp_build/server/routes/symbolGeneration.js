"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_1 = require("../storage");
const SymbolGeneratorService_1 = require("../services/SymbolGeneratorService");
const SymbolRegistryService_1 = require("../services/SymbolRegistryService");
const tickerMigration_1 = require("../config/tickerMigration");
const router = (0, express_1.Router)();
/**
 * Get migration status
 * GET /api/symbols/migration-status
 */
router.get('/migration-status', (req, res) => {
    res.json({
        status: (0, tickerMigration_1.getMigrationStatus)(),
        frozenOldGeneration: (0, tickerMigration_1.isTickerGenerationFrozen)(),
        newRegistryEnabled: (0, tickerMigration_1.isNewSymbolRegistryEnabled)(),
    });
});
/**
 * Test new Symbol Registry (without DB writes)
 * POST /api/symbols/test-registry
 */
router.post('/test-registry', async (req, res) => {
    try {
        if (!(0, tickerMigration_1.isNewSymbolRegistryEnabled)()) {
            return res.status(403).json({
                error: 'New Symbol Registry is not enabled',
                hint: 'Enable it in ticker migration config'
            });
        }
        const { type, params } = req.body;
        if (!type || !params) {
            return res.status(400).json({ error: 'Type and params are required' });
        }
        // Mock check function (always returns false for testing)
        const mockCheckExists = async () => false;
        const symbol = await SymbolRegistryService_1.symbolRegistry.generateSymbol(type, params, mockCheckExists);
        res.json({
            success: true,
            input: { type, params },
            generatedSymbol: symbol,
            system: 'New Symbol Registry v2.0'
        });
    }
    catch (error) {
        console.error('Symbol Registry test error:', error);
        res.status(500).json({ error: error.message });
    }
});
/**
 * Test symbol generation without creating assets
 * POST /api/symbols/test
 */
router.post('/test', async (req, res) => {
    // Check if old ticker generation is frozen
    if ((0, tickerMigration_1.isTickerGenerationFrozen)() && !req.body.forceOld) {
        return res.status(423).json({
            error: 'Ticker generation is currently frozen for migration',
            status: (0, tickerMigration_1.getMigrationStatus)(),
            hint: 'Use the new Symbol Registry or set forceOld=true to bypass'
        });
    }
    try {
        const { type, name, metadata } = req.body;
        if (!type || !name) {
            return res.status(400).json({ error: 'Type and name are required' });
        }
        const symbol = SymbolGeneratorService_1.symbolGeneratorService.generateSymbol(type, name, metadata);
        res.json({
            success: true,
            input: { type, name, metadata },
            generatedSymbol: symbol
        });
    }
    catch (error) {
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
            const asset = await storage_1.storage.getAssetById(assetId);
            if (!asset) {
                results.push({
                    assetId,
                    success: false,
                    error: 'Asset not found'
                });
                continue;
            }
            // Generate new symbol
            const newSymbol = SymbolGeneratorService_1.symbolGeneratorService.generateSymbol(asset.type, asset.name, asset.metadata);
            // Make it unique
            const uniqueSymbol = await SymbolGeneratorService_1.symbolGeneratorService.makeUnique(newSymbol, async (symbol) => {
                const existing = await storage_1.storage.getAssetBySymbol(symbol);
                return !!existing && existing.id !== assetId;
            });
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
                await storage_1.storage.updateAsset(assetId, { symbol: uniqueSymbol });
            }
        }
        res.json({
            success: true,
            dryRun,
            processed: results.length,
            changed: results.filter(r => r.changed).length,
            results
        });
    }
    catch (error) {
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
        const assets = await storage_1.storage.getAssetsByType(type, limit);
        const results = [];
        for (const asset of assets) {
            // Generate new symbol
            const newSymbol = SymbolGeneratorService_1.symbolGeneratorService.generateSymbol(asset.type, asset.name, asset.metadata);
            // Make it unique
            const uniqueSymbol = await SymbolGeneratorService_1.symbolGeneratorService.makeUnique(newSymbol, async (symbol) => {
                const existing = await storage_1.storage.getAssetBySymbol(symbol);
                return !!existing && existing.id !== asset.id;
            });
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
                await storage_1.storage.updateAsset(asset.id, { symbol: uniqueSymbol });
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
    }
    catch (error) {
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
            const assets = await storage_1.storage.getAssetsByType(type, batchSize);
            console.log(`📦 Processing ${assets.length} ${type} assets...`);
            for (const asset of assets) {
                // Generate new symbol
                const newSymbol = SymbolGeneratorService_1.symbolGeneratorService.generateSymbol(asset.type, asset.name, asset.metadata);
                // Make it unique
                const uniqueSymbol = await SymbolGeneratorService_1.symbolGeneratorService.makeUnique(newSymbol, async (symbol) => {
                    const existing = await storage_1.storage.getAssetBySymbol(symbol);
                    return !!existing && existing.id !== asset.id;
                });
                if (asset.symbol !== uniqueSymbol) {
                    totalChanged++;
                    // If not dry run, update the asset
                    if (!dryRun) {
                        await storage_1.storage.updateAsset(asset.id, { symbol: uniqueSymbol });
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
    }
    catch (error) {
        console.error('Bulk symbol regeneration error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
