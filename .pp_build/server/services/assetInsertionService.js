"use strict";
/**
 * Asset Insertion Service
 * Handles bulk insertion of priced assets from Pinecone expansion into database
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetInsertionService = exports.AssetInsertionService = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const schema_1 = require("@shared/schema");
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
class AssetInsertionService {
    /**
     * Bulk insert priced assets into database
     * Handles both assets and currentPrices tables
     */
    async insertPricedAssets(pricedAssets, batchSize = 100) {
        const result = {
            success: true,
            inserted: 0,
            skipped: 0,
            errors: 0,
            errorMessages: [],
            assetIds: []
        };
        // Process in batches
        for (let i = 0; i < pricedAssets.length; i += batchSize) {
            const batch = pricedAssets.slice(i, i + batchSize);
            try {
                const batchResult = await this.insertBatch(batch);
                result.inserted += batchResult.inserted;
                result.skipped += batchResult.skipped;
                result.errors += batchResult.errors;
                result.errorMessages.push(...batchResult.errorMessages);
                result.assetIds.push(...batchResult.assetIds);
                console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${batchResult.inserted} inserted, ${batchResult.skipped} skipped, ${batchResult.errors} errors`);
            }
            catch (error) {
                console.error(`   ❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
                result.errors += batch.length;
                result.errorMessages.push(`Batch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                result.success = false;
            }
        }
        return result;
    }
    /**
     * Insert a single batch of assets
     */
    async insertBatch(batch) {
        const result = {
            success: true,
            inserted: 0,
            skipped: 0,
            errors: 0,
            errorMessages: [],
            assetIds: []
        };
        // Prepare asset records
        const assetRecords = [];
        const priceRecords = [];
        for (const pricedAsset of batch) {
            try {
                // Create asset record with safe fallbacks and metadata merging
                const assetRecord = {
                    symbol: pricedAsset.symbol,
                    name: pricedAsset.name,
                    type: pricedAsset.type,
                    description: pricedAsset.description ||
                        pricedAsset.metadata?.description ||
                        `${pricedAsset.type} asset from Pinecone`,
                    imageUrl: pricedAsset.imageUrl || null,
                    coverImageUrl: pricedAsset.coverImageUrl || null,
                    metadata: {
                        // Preserve all existing metadata from Pinecone
                        ...pricedAsset.metadata,
                        // Add expansion-specific fields
                        pineconeId: pricedAsset.metadata?.pineconeId,
                        publisher: pricedAsset.metadata?.publisher,
                        baseName: pricedAsset.baseName,
                        variant: pricedAsset.variant,
                        tier: pricedAsset.tier,
                        category: pricedAsset.category,
                        pricing: pricedAsset.pricing,
                        pricingBreakdown: pricedAsset.pricing?.breakdown,
                        totalMarketValue: pricedAsset.pricing?.totalMarketValue,
                        totalFloat: pricedAsset.pricing?.totalFloat
                    }
                };
                assetRecords.push(assetRecord);
            }
            catch (error) {
                result.errors++;
                result.errorMessages.push(`Failed to prepare asset ${pricedAsset.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Insert assets
        if (assetRecords.length > 0) {
            try {
                const insertedAssets = await db.insert(schema_1.assets)
                    .values(assetRecords)
                    .onConflictDoNothing()
                    .returning({ id: schema_1.assets.id, symbol: schema_1.assets.symbol });
                result.inserted = insertedAssets.length;
                result.skipped = assetRecords.length - insertedAssets.length;
                // Create price records for inserted assets
                for (let i = 0; i < insertedAssets.length; i++) {
                    const insertedAsset = insertedAssets[i];
                    const originalIndex = batch.findIndex(a => a.symbol === insertedAsset.symbol);
                    if (originalIndex !== -1 && batch[originalIndex].pricing) {
                        const pricedAsset = batch[originalIndex];
                        result.assetIds.push(insertedAsset.id);
                        const priceRecord = {
                            assetId: insertedAsset.id,
                            currentPrice: pricedAsset.pricing.currentPrice.toString(),
                            bidPrice: (pricedAsset.pricing.currentPrice * 0.99).toFixed(2),
                            askPrice: (pricedAsset.pricing.currentPrice * 1.01).toFixed(2),
                            dayChange: '0.00',
                            dayChangePercent: '0.00',
                            volume: 0,
                            priceSource: pricedAsset.pricing.source
                        };
                        priceRecords.push(priceRecord);
                    }
                }
                // Insert prices
                if (priceRecords.length > 0) {
                    await db.insert(schema_1.assetCurrentPrices)
                        .values(priceRecords)
                        .onConflictDoNothing();
                }
            }
            catch (error) {
                console.error('Database insertion error:', error);
                result.errors = assetRecords.length;
                result.errorMessages.push(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                result.success = false;
            }
        }
        return result;
    }
    /**
     * Get total asset count from database
     */
    async getTotalAssetCount() {
        const result = await db.execute(`SELECT COUNT(*) as count FROM assets`);
        return Number(result.rows[0]?.count || 0);
    }
    /**
     * Get asset count by type
     */
    async getAssetCountByType() {
        const result = await db.execute(`SELECT type, COUNT(*) as count FROM assets GROUP BY type`);
        const counts = {};
        for (const row of result.rows) {
            counts[row.type] = Number(row.count);
        }
        return counts;
    }
    /**
     * Get asset count with prices
     */
    async getAssetCountWithPrices() {
        const result = await db.execute(`SELECT COUNT(DISTINCT a.id) as count 
       FROM assets a 
       INNER JOIN asset_current_prices p ON a.id = p.asset_id`);
        return Number(result.rows[0]?.count || 0);
    }
}
exports.AssetInsertionService = AssetInsertionService;
exports.assetInsertionService = new AssetInsertionService();
