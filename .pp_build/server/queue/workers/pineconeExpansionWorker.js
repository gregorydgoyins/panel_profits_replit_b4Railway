"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pineconeExpansionWorker = void 0;
const bullmq_1 = require("bullmq");
const config_1 = require("../config");
const types_1 = require("../types");
const pineconeAssetExpansion_1 = require("../../services/pineconeAssetExpansion");
const databaseStorage_1 = require("../../databaseStorage");
const schema_1 = require("@shared/schema");
async function processPineconeExpansionJob(job) {
    const { batchStart, batchSize, namespace } = job.data;
    console.log(`📦 Processing Pinecone batch ${batchStart}-${batchStart + batchSize} (namespace: ${namespace || 'default'})`);
    try {
        // Step 1: Fetch records from Pinecone using batch parameters
        const records = await pineconeAssetExpansion_1.pineconeAssetExpansion.sampleDiverseRecords(batchSize);
        if (!records) {
            throw new Error('Failed to fetch Pinecone records');
        }
        const totalRecords = records.characters.length +
            records.creators.length +
            records.comics.length;
        if (totalRecords === 0) {
            console.warn('⚠️ No records fetched from Pinecone');
            return { success: true, assetsCreated: 0, message: 'No records to process' };
        }
        await job.updateProgress(20);
        // Step 2: Transform to assets with pricing
        const transformedAssets = await pineconeAssetExpansion_1.pineconeAssetExpansion.transformRecordsToAssets(records);
        await job.updateProgress(40);
        // Step 3: Prepare all assets for bulk insert
        const allAssets = [
            ...transformedAssets.characterAssets,
            ...transformedAssets.creatorAssets,
            ...transformedAssets.comicAssets,
        ];
        if (allAssets.length === 0) {
            return { success: true, assetsCreated: 0, message: 'No assets to insert' };
        }
        await job.updateProgress(60);
        // Step 4: Bulk insert assets with conflict handling
        const assetValues = allAssets.map(asset => ({
            symbol: asset.symbol,
            name: asset.name,
            type: asset.type,
            description: asset.metadata?.description,
            metadata: {
                ...asset.metadata,
                source: 'pinecone',
                pineconeId: asset.metadata?.pineconeId,
                batchStart,
                namespace: namespace || 'default',
            },
        }));
        const insertedAssets = await databaseStorage_1.db
            .insert(schema_1.assets)
            .values(assetValues)
            .onConflictDoNothing({ target: schema_1.assets.symbol })
            .returning();
        const assetsCreated = insertedAssets.length;
        const skipped = allAssets.length - assetsCreated;
        console.log(`📊 Inserted ${assetsCreated} assets, skipped ${skipped} duplicates`);
        await job.updateProgress(80);
        // Step 5: Bulk insert price history for created assets
        const priceValues = [];
        for (const insertedAsset of insertedAssets) {
            const originalAsset = allAssets.find(a => a.symbol === insertedAsset.symbol);
            if (originalAsset?.pricing) {
                priceValues.push({
                    assetId: insertedAsset.id,
                    grade: 'ungraded',
                    price: originalAsset.pricing.currentPrice.toString(),
                    source: originalAsset.pricing.source,
                    snapshotDate: new Date(),
                    metadata: {
                        grades: originalAsset.pricing.grades,
                        highestPrice: originalAsset.pricing.highestPrice,
                        bestGrade: originalAsset.pricing.bestGrade,
                    },
                });
            }
        }
        let assetsPriced = 0;
        if (priceValues.length > 0) {
            const insertedPrices = await databaseStorage_1.db
                .insert(schema_1.priceHistory)
                .values(priceValues)
                .returning();
            assetsPriced = insertedPrices.length;
        }
        await job.updateProgress(100);
        const result = {
            success: true,
            assetsCreated,
            assetsPriced,
            skippedDuplicates: skipped,
            totalProcessed: allAssets.length,
            breakdown: {
                characters: transformedAssets.characterAssets.length,
                creators: transformedAssets.creatorAssets.length,
                comics: transformedAssets.comicAssets.length,
            },
        };
        console.log(`✅ Batch complete: ${assetsCreated} new assets, ${assetsPriced} priced, ${skipped} duplicates skipped`);
        return result;
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Pinecone expansion job failed:`, errorMsg);
        // Structured error for retry logic
        if (errorMsg.includes('Pinecone') || errorMsg.includes('embedding')) {
            throw new Error(`TRANSIENT: ${errorMsg}`);
        }
        else if (errorMsg.includes('database') || errorMsg.includes('connection')) {
            throw new Error(`TRANSIENT: ${errorMsg}`);
        }
        else {
            throw new Error(`PERMANENT: ${errorMsg}`);
        }
    }
}
exports.pineconeExpansionWorker = new bullmq_1.Worker(types_1.QueueName.PINECONE_EXPANSION, processPineconeExpansionJob, {
    connection: config_1.redisConnectionConfig,
    ...config_1.defaultWorkerOptions,
    concurrency: 5, // Process 5 batches concurrently
});
exports.pineconeExpansionWorker.on('completed', (job) => {
    console.log(`✅ Pinecone expansion job ${job.id} completed`);
});
exports.pineconeExpansionWorker.on('failed', (job, err) => {
    console.error(`❌ Pinecone expansion job ${job?.id} failed:`, err.message);
});
exports.pineconeExpansionWorker.on('error', (err) => {
    console.error('❌ Pinecone expansion worker error:', err);
});
console.log('🎯 Pinecone expansion worker started');
