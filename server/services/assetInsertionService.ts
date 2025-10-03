/**
 * Asset Insertion Service
 * Handles bulk insertion of priced assets from Pinecone expansion into database
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { assets, assetCurrentPrices } from '@shared/schema';
import type { InsertAsset, InsertAssetCurrentPrice } from '@shared/schema';

const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

interface PricedAsset {
  type: string;
  name: string;
  baseName?: string;
  variant?: string | null;
  symbol: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  metadata?: any;
  pricing?: {
    currentPrice: number;
    totalMarketValue: number;
    totalFloat: number;
    source: string;
    lastUpdated: string;
    breakdown?: any;
  };
  tier?: number;
}

interface InsertionResult {
  success: boolean;
  inserted: number;
  skipped: number;
  errors: number;
  errorMessages: string[];
  assetIds: string[];
}

export class AssetInsertionService {
  /**
   * Bulk insert priced assets into database
   * Handles both assets and currentPrices tables
   */
  async insertPricedAssets(
    pricedAssets: PricedAsset[],
    batchSize: number = 100
  ): Promise<InsertionResult> {
    const result: InsertionResult = {
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
      } catch (error) {
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
  private async insertBatch(batch: PricedAsset[]): Promise<InsertionResult> {
    const result: InsertionResult = {
      success: true,
      inserted: 0,
      skipped: 0,
      errors: 0,
      errorMessages: [],
      assetIds: []
    };

    // Prepare asset records
    const assetRecords: InsertAsset[] = [];
    const priceRecords: InsertAssetCurrentPrice[] = [];

    for (const pricedAsset of batch) {
      try {
        // Create asset record with safe fallbacks and metadata merging
        const assetRecord: InsertAsset = {
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
      } catch (error) {
        result.errors++;
        result.errorMessages.push(`Failed to prepare asset ${pricedAsset.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Insert assets
    if (assetRecords.length > 0) {
      try {
        const insertedAssets = await db.insert(assets)
          .values(assetRecords)
          .onConflictDoNothing()
          .returning({ id: assets.id, symbol: assets.symbol });

        result.inserted = insertedAssets.length;
        result.skipped = assetRecords.length - insertedAssets.length;

        // Create price records for inserted assets
        for (let i = 0; i < insertedAssets.length; i++) {
          const insertedAsset = insertedAssets[i];
          const originalIndex = batch.findIndex(a => a.symbol === insertedAsset.symbol);
          
          if (originalIndex !== -1 && batch[originalIndex].pricing) {
            const pricedAsset = batch[originalIndex];
            result.assetIds.push(insertedAsset.id);

            const priceRecord: InsertAssetCurrentPrice = {
              assetId: insertedAsset.id,
              currentPrice: pricedAsset.pricing!.currentPrice.toString(),
              bidPrice: (pricedAsset.pricing!.currentPrice * 0.99).toFixed(2),
              askPrice: (pricedAsset.pricing!.currentPrice * 1.01).toFixed(2),
              dayChange: '0.00',
              dayChangePercent: '0.00',
              volume: 0,
              priceSource: pricedAsset.pricing!.source
            };

            priceRecords.push(priceRecord);
          }
        }

        // Insert prices
        if (priceRecords.length > 0) {
          await db.insert(assetCurrentPrices)
            .values(priceRecords)
            .onConflictDoNothing();
        }

      } catch (error) {
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
  async getTotalAssetCount(): Promise<number> {
    const result = await db.execute<{ count: number }>(
      `SELECT COUNT(*) as count FROM assets`
    );
    return Number(result.rows[0]?.count || 0);
  }

  /**
   * Get asset count by type
   */
  async getAssetCountByType(): Promise<Record<string, number>> {
    const result = await db.execute<{ type: string; count: number }>(
      `SELECT type, COUNT(*) as count FROM assets GROUP BY type`
    );
    
    const counts: Record<string, number> = {};
    for (const row of result.rows) {
      counts[row.type] = Number(row.count);
    }
    return counts;
  }

  /**
   * Get asset count with prices
   */
  async getAssetCountWithPrices(): Promise<number> {
    const result = await db.execute<{ count: number }>(
      `SELECT COUNT(DISTINCT a.id) as count 
       FROM assets a 
       INNER JOIN asset_current_prices p ON a.id = p.asset_id`
    );
    return Number(result.rows[0]?.count || 0);
  }
}

export const assetInsertionService = new AssetInsertionService();
