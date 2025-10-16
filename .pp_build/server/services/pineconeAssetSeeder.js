"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pineconeAssetSeeder = void 0;
const pineconeAssetExpansion_1 = require("./pineconeAssetExpansion");
const assetInsertionService_1 = require("./assetInsertionService");
class PineconeAssetSeederService {
    /**
     * Helper function to add delay for rate limiting
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Main seeding pipeline
     * Generates assets from Pinecone and inserts them into the database
     */
    async seedAssets(options = {}) {
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
        const allErrorDetails = [];
        try {
            // Step 1: Expand assets from Pinecone
            console.log('\n🔍 Step 1: Fetching and expanding assets from Pinecone...');
            const expansionResult = await pineconeAssetExpansion_1.pineconeAssetExpansion.expandAssetDatabase(samplesPerCategory);
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
            // Step 2: Bulk insert assets into database
            console.log('\n💾 Step 2: Bulk inserting assets into database...');
            console.log(`   Using high-speed bulk insertion (${batchSize} assets per batch)`);
            const insertionResult = await assetInsertionService_1.assetInsertionService.insertPricedAssets(allAssets, batchSize);
            totalInserted = insertionResult.inserted;
            totalSkipped = insertionResult.skipped;
            totalErrors = insertionResult.errors;
            allErrorDetails.push(...insertionResult.errorMessages);
            console.log(`\n💫 Bulk insertion complete!`);
            console.log(`   ✅ Inserted: ${totalInserted}`);
            console.log(`   ⏭️  Skipped: ${totalSkipped}`);
            console.log(`   ❌ Errors: ${totalErrors}`);
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
        }
        catch (error) {
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
exports.pineconeAssetSeeder = new PineconeAssetSeederService();
