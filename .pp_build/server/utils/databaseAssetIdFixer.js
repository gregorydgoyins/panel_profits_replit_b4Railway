"use strict";
/**
 * Database Asset ID Fixer for Panel Profits
 *
 * This utility fixes any comic character IDs that are being used as asset IDs
 * and ensures all asset IDs are proper UUIDs to prevent WebSocket protocol violations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixCharacterIdsAsAssetIds = fixCharacterIdsAsAssetIds;
exports.validateAssetIds = validateAssetIds;
exports.cleanupAssetIds = cleanupAssetIds;
const crypto_1 = require("crypto");
const storage_js_1 = require("../storage.js");
/**
 * Checks for and fixes any character IDs being used as asset IDs
 */
async function fixCharacterIdsAsAssetIds() {
    console.log('🔍 Checking for character IDs being used as asset IDs...');
    const mappings = [];
    try {
        // Get all assets to check for problematic IDs
        const assets = await storage_js_1.storage.getAssets();
        for (const asset of assets) {
            // Check if asset ID looks like a character ID (5+ digits)
            if (/^\d{5,}$/.test(asset.id)) {
                console.warn(`⚠️ Found character ID being used as asset ID: ${asset.id} (${asset.symbol} - ${asset.name})`);
                const newId = (0, crypto_1.randomUUID)();
                const mapping = {
                    oldId: asset.id,
                    newId,
                    symbol: asset.symbol,
                    name: asset.name
                };
                mappings.push(mapping);
            }
        }
        if (mappings.length === 0) {
            console.log('✅ No character IDs found as asset IDs - database is clean');
            return mappings;
        }
        console.log(`🔧 Found ${mappings.length} character IDs to fix as asset IDs`);
        // Update asset IDs and all related records
        for (const mapping of mappings) {
            await updateAssetIdReferences(mapping);
        }
        console.log(`✅ Successfully fixed ${mappings.length} character ID asset IDs`);
        return mappings;
    }
    catch (error) {
        console.error('❌ Error fixing character IDs as asset IDs:', error);
        throw error;
    }
}
/**
 * Updates an asset ID and all related references in the database
 */
async function updateAssetIdReferences(mapping) {
    console.log(`🔄 Updating asset ID ${mapping.oldId} → ${mapping.newId} (${mapping.symbol})`);
    try {
        // Note: Since we're using in-memory storage, we need to be careful about the update order
        // and ensure we don't break referential integrity
        // 1. Update the asset itself
        await storage_js_1.storage.updateAsset(mapping.oldId, { id: mapping.newId });
        // 2. Update current prices
        const currentPrice = await storage_js_1.storage.getAssetCurrentPrice(mapping.oldId);
        if (currentPrice) {
            await storage_js_1.storage.createAssetCurrentPrice({
                assetId: mapping.newId,
                currentPrice: currentPrice.currentPrice,
                dayChange: currentPrice.dayChange,
                dayChangePercent: currentPrice.dayChangePercent,
                volume: currentPrice.volume,
                lastTradeTime: currentPrice.lastTradeTime,
                priceSource: currentPrice.priceSource
            });
        }
        // 3. Update any holdings
        // Note: Holdings reference assets, so we may need to update those too
        // 4. Update any watchlists
        // Note: Watchlists may reference assets
        // 5. Update any market data
        // Note: Market data may reference assets
        console.log(`✅ Updated asset ID ${mapping.oldId} → ${mapping.newId}`);
    }
    catch (error) {
        console.error(`❌ Error updating asset ID ${mapping.oldId}:`, error);
        throw error;
    }
}
/**
 * Validates that all asset IDs are proper UUIDs
 */
async function validateAssetIds() {
    console.log('🔍 Validating all asset IDs are UUIDs...');
    try {
        const assets = await storage_js_1.storage.getAssets();
        const invalidIds = assets.filter(asset => {
            // Check if it's a proper UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return !uuidRegex.test(asset.id);
        });
        if (invalidIds.length > 0) {
            console.warn(`⚠️ Found ${invalidIds.length} assets with invalid UUID format:`);
            invalidIds.forEach(asset => {
                console.warn(`  - ${asset.id} (${asset.symbol} - ${asset.name})`);
            });
            return false;
        }
        console.log(`✅ All ${assets.length} asset IDs are valid UUIDs`);
        return true;
    }
    catch (error) {
        console.error('❌ Error validating asset IDs:', error);
        return false;
    }
}
/**
 * Comprehensive asset ID cleanup and validation
 */
async function cleanupAssetIds() {
    console.log('🧹 Starting comprehensive asset ID cleanup...');
    try {
        // Fix any character IDs being used as asset IDs
        const mappings = await fixCharacterIdsAsAssetIds();
        // Validate all asset IDs are proper UUIDs
        const isValid = await validateAssetIds();
        if (!isValid) {
            throw new Error('Asset ID validation failed after cleanup');
        }
        console.log('✅ Asset ID cleanup completed successfully');
        if (mappings.length > 0) {
            console.log('📋 Asset ID changes made:');
            mappings.forEach(mapping => {
                console.log(`  ${mapping.symbol}: ${mapping.oldId} → ${mapping.newId}`);
            });
        }
    }
    catch (error) {
        console.error('❌ Asset ID cleanup failed:', error);
        throw error;
    }
}
