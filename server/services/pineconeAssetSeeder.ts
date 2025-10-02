import { pineconeAssetExpansion } from './pineconeAssetExpansion';
import { storage } from '../storage';
import type { InsertAsset } from '@shared/schema';

/**
 * Pinecone Asset Seeding Service
 * Populates the database with millions of tradeable assets from Pinecone expansion
 */

interface SeederOptions {
  batchSize?: number;
  totalSamples?: number;
  samplesPerCategory?: number;
}

interface SeederResult {
  success: boolean;
  totalProcessed: number;
  inserted: number;
  skipped: number;
  errors: number;
  processingTime: number;
  errorDetails?: string[];
}

class PineconeAssetSeederService {
  /**
   * Helper function to add delay for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Map expanded asset to database schema
   */
  private mapAssetToSchema(asset: any): InsertAsset {
    return {
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      description: asset.description || asset.metadata?.description || `${asset.type} asset from Pinecone`,
      imageUrl: asset.imageUrl || undefined,
      metadata: {
        ...asset.metadata,
        pineconeId: asset.metadata?.pineconeId,
        pricing: asset.pricing,
        variant: asset.variant,
        baseName: asset.baseName,
        category: asset.category,
        publisher: asset.metadata?.publisher
      }
    };
  }

  /**
   * Process a batch of assets - check duplicates and insert
   */
  private async processBatch(assets: any[], batchNumber: number, totalBatches: number): Promise<{
    inserted: number;
    skipped: number;
    errors: number;
    errorDetails: string[];
  }> {
    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${assets.length} assets)...`);

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      
      try {
        // Check for duplicates by symbol
        const existing = await storage.getAssetBySymbol(asset.symbol);
        
        if (existing) {
          skipped++;
          if (i % 10 === 0) {
            console.log(`   ⏭️  Skipped ${skipped} duplicates so far...`);
          }
          continue;
        }

        // Map to database schema
        const assetData = this.mapAssetToSchema(asset);

        // Insert into database
        await storage.createAsset(assetData);
        inserted++;

        // Log progress every 10 assets
        if (inserted % 10 === 0) {
          console.log(`   ✅ Inserted ${inserted} assets...`);
        }
      } catch (error) {
        errors++;
        const errorMsg = `Failed to process ${asset.type} "${asset.name}" (${asset.symbol}): ${error instanceof Error ? error.message : 'Unknown error'}`;
        errorDetails.push(errorMsg);
        console.error(`   ❌ ${errorMsg}`);
      }
    }

    console.log(`📊 Batch ${batchNumber} complete: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);

    return { inserted, skipped, errors, errorDetails };
  }

  /**
   * Main seeding pipeline
   * Generates assets from Pinecone and inserts them into the database
   */
  async seedAssets(options: SeederOptions = {}): Promise<SeederResult> {
    const startTime = Date.now();
    
    // Extract options with defaults
    const batchSize = options.batchSize || 100;
    const samplesPerCategory = options.samplesPerCategory || 100;
    
    console.log('🚀 STARTING PINECONE ASSET SEEDING PIPELINE');
    console.log(`📊 Configuration:`);
    console.log(`   - Batch size: ${batchSize} assets per batch`);
    console.log(`   - Samples per category: ${samplesPerCategory}`);
    console.log(`   - Expected total: ~${samplesPerCategory * 3} assets (characters, creators, comics)`);

    let totalProcessed = 0;
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const allErrorDetails: string[] = [];

    try {
      // Step 1: Expand assets from Pinecone
      console.log('\n🔍 Step 1: Fetching and expanding assets from Pinecone...');
      const expansionResult = await pineconeAssetExpansion.expandAssetDatabase(samplesPerCategory);

      if (!expansionResult.success || !expansionResult.assets) {
        throw new Error(expansionResult.error || 'Asset expansion failed');
      }

      // Combine all assets into a single array
      const allAssets = [
        ...expansionResult.assets.characterAssets,
        ...expansionResult.assets.creatorAssets,
        ...expansionResult.assets.comicAssets
      ];

      totalProcessed = allAssets.length;

      if (totalProcessed === 0) {
        console.warn('⚠️ No assets were generated from Pinecone expansion');
        return {
          success: false,
          totalProcessed: 0,
          inserted: 0,
          skipped: 0,
          errors: 0,
          processingTime: Date.now() - startTime,
          errorDetails: ['No assets were generated from Pinecone expansion']
        };
      }

      console.log(`✅ Expansion complete: ${totalProcessed} assets ready for seeding`);
      console.log(`   👥 Characters: ${expansionResult.assets.characterAssets.length}`);
      console.log(`   🎨 Creators: ${expansionResult.assets.creatorAssets.length}`);
      console.log(`   📚 Comics: ${expansionResult.assets.comicAssets.length}`);

      // Step 2: Process in batches
      console.log('\n💾 Step 2: Inserting assets into database...');
      const batches = Math.ceil(totalProcessed / batchSize);
      let lastProgressPercent = 0;

      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, totalProcessed);
        const batch = allAssets.slice(start, end);

        // Process batch
        const result = await this.processBatch(batch, i + 1, batches);
        
        totalInserted += result.inserted;
        totalSkipped += result.skipped;
        totalErrors += result.errors;
        allErrorDetails.push(...result.errorDetails);

        // Log progress milestones (every 10%)
        const progressPercent = Math.floor(((i + 1) / batches) * 100);
        if (progressPercent >= lastProgressPercent + 10) {
          console.log(`\n📈 Progress: ${progressPercent}% complete (${totalInserted + totalSkipped + totalErrors}/${totalProcessed} processed)`);
          lastProgressPercent = progressPercent;
        }

        // Rate limiting between batches
        if (i < batches - 1) {
          await this.sleep(100);
        }
      }

      // Step 3: Report results
      const processingTime = Date.now() - startTime;
      
      console.log('\n✅ SEEDING PIPELINE COMPLETE');
      console.log('═══════════════════════════════════════');
      console.log(`📊 Final Statistics:`);
      console.log(`   - Total processed: ${totalProcessed}`);
      console.log(`   - Successfully inserted: ${totalInserted}`);
      console.log(`   - Skipped (duplicates): ${totalSkipped}`);
      console.log(`   - Errors: ${totalErrors}`);
      console.log(`   - Processing time: ${(processingTime / 1000).toFixed(2)}s`);
      console.log(`   - Average speed: ${(totalProcessed / (processingTime / 1000)).toFixed(2)} assets/second`);
      
      if (totalErrors > 0 && allErrorDetails.length > 0) {
        console.log(`\n⚠️ Error Summary (first 5):`);
        allErrorDetails.slice(0, 5).forEach(err => console.log(`   - ${err}`));
      }

      return {
        success: true,
        totalProcessed,
        inserted: totalInserted,
        skipped: totalSkipped,
        errors: totalErrors,
        processingTime,
        errorDetails: allErrorDetails.length > 0 ? allErrorDetails : undefined
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ SEEDING PIPELINE FAILED:', error);
      
      return {
        success: false,
        totalProcessed,
        inserted: totalInserted,
        skipped: totalSkipped,
        errors: totalErrors + 1,
        processingTime,
        errorDetails: [
          ...allErrorDetails,
          `Pipeline error: ${error instanceof Error ? error.message : 'Unknown error'}`
        ]
      };
    }
  }
}

export const pineconeAssetSeeder = new PineconeAssetSeederService();
