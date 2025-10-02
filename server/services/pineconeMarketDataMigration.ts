import { storage } from '../storage';
import type { Asset } from '@shared/schema';

/**
 * Pinecone Market Data Migration Service
 * Fixes existing Pinecone assets that have pricing in metadata but no market_data entries
 */

interface MigrationResult {
  processed: number;
  created: number;
  skipped: number;
  errors: number;
  errorDetails?: string[];
}

class PineconeMarketDataMigrationService {
  /**
   * Extract price from asset metadata
   * For comics with CGC grades: Use highestPrice from pricing.grades
   * For characters/creators: Use pricing.currentPrice
   */
  private extractPriceFromAssetMetadata(asset: Asset): number {
    const metadata = asset.metadata as any;
    
    if (!metadata || !metadata.pricing) {
      return 100; // Default fallback price
    }

    // For comics with CGC grade pricing
    if (asset.type === 'comic' && metadata.pricing.highestPrice) {
      return metadata.pricing.highestPrice;
    }

    // For characters and creators
    if (metadata.pricing.currentPrice) {
      return metadata.pricing.currentPrice;
    }

    // Fallback
    return 100;
  }

  /**
   * Check if an asset is a Pinecone asset
   */
  private isPineconeAsset(asset: Asset): boolean {
    const metadata = asset.metadata as any;
    return !!(metadata && metadata.pineconeId);
  }

  /**
   * Migrate market_data for all Pinecone assets
   * Finds assets with metadata.pineconeId and creates market_data entries if missing
   */
  async migrateMarketData(): Promise<MigrationResult> {
    console.log('🔄 Starting Pinecone market_data migration...');
    
    let processed = 0;
    let created = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    try {
      // Step 1: Fetch all assets
      console.log('📊 Fetching all assets...');
      const allAssets = await storage.getAssets();
      console.log(`✅ Found ${allAssets.length} total assets`);

      // Step 2: Filter for Pinecone assets
      const pineconeAssets = allAssets.filter(asset => this.isPineconeAsset(asset));
      console.log(`🎯 Found ${pineconeAssets.length} Pinecone assets to check`);

      if (pineconeAssets.length === 0) {
        console.log('⚠️ No Pinecone assets found');
        return { processed: 0, created: 0, skipped: 0, errors: 0 };
      }

      // Step 3: Process each Pinecone asset
      for (const asset of pineconeAssets) {
        try {
          processed++;
          
          // Check if market_data already exists
          const existingMarketData = await storage.getLatestMarketData(asset.symbol, '1d');
          
          if (existingMarketData) {
            skipped++;
            console.log(`   ⏭️  Skipped ${asset.symbol}: market_data already exists`);
            continue;
          }

          // Extract price from metadata
          const price = this.extractPriceFromAssetMetadata(asset);

          // Create market_data entry using asset.id (UUID), not symbol
          await storage.createMarketData({
            assetId: asset.id,
            timeframe: '1d',
            periodStart: new Date(),
            open: price.toString(),
            high: (price * 1.02).toString(),
            low: (price * 0.98).toString(),
            close: price.toString(),
            volume: Math.floor(1000 + Math.random() * 4000),
            change: '0',
            percentChange: '0'
          });

          created++;
          console.log(`   ✅ Created market_data for ${asset.symbol} (${asset.name}) @ $${price}`);
          
          // Progress update every 5 assets
          if (created % 5 === 0) {
            console.log(`📈 Progress: ${created} market_data entries created...`);
          }
        } catch (error) {
          errors++;
          const errorMsg = `Failed to migrate ${asset.type} "${asset.name}" (${asset.symbol}): ${error instanceof Error ? error.message : 'Unknown error'}`;
          errorDetails.push(errorMsg);
          console.error(`   ❌ ${errorMsg}`);
        }
      }

      // Step 4: Report results
      console.log('\n✅ MIGRATION COMPLETE');
      console.log('═══════════════════════════════════════');
      console.log(`📊 Migration Statistics:`);
      console.log(`   - Total processed: ${processed}`);
      console.log(`   - Market_data created: ${created}`);
      console.log(`   - Skipped (already exist): ${skipped}`);
      console.log(`   - Errors: ${errors}`);

      if (errors > 0 && errorDetails.length > 0) {
        console.log(`\n⚠️ Error Summary:`);
        errorDetails.forEach(err => console.log(`   - ${err}`));
      }

      return {
        processed,
        created,
        skipped,
        errors,
        errorDetails: errorDetails.length > 0 ? errorDetails : undefined
      };
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        processed,
        created,
        skipped,
        errors: errors + 1,
        errorDetails: [
          ...errorDetails,
          `Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`
        ]
      };
    }
  }
}

export const pineconeMarketDataMigration = new PineconeMarketDataMigrationService();
