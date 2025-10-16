"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const openai_1 = require("openai");
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const pineconeAssetExpansion_1 = require("../services/pineconeAssetExpansion");
const drizzle_orm_1 = require("drizzle-orm");
const TARGET_ASSETS = 100; // Start with just 100 assets for testing
const BATCH_SIZE = 20; // Process 20 records at a time
async function sampleDiverseRecords(pinecone, count) {
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const namespace = index.namespace(''); // Use default namespace
    console.log(`🔍 Sampling ${count} diverse records from Pinecone...`);
    // Query with diverse embedding to get varied results
    const diverseQueries = [
        'superhero character with powers',
        'comic book creator writer artist',
        'iconic comic book series',
        'villain antagonist nemesis'
    ];
    const allRecords = [];
    const recordsPerQuery = Math.ceil(count / diverseQueries.length);
    for (const query of diverseQueries) {
        try {
            const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const embedding = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: query,
                dimensions: 1024
            });
            const results = await namespace.query({
                vector: embedding.data[0].embedding,
                topK: recordsPerQuery,
                includeMetadata: true
            });
            allRecords.push(...results.matches);
            console.log(`  ✓ Found ${results.matches.length} records for "${query}"`);
        }
        catch (error) {
            console.error(`  ✗ Error querying "${query}":`, error);
        }
    }
    console.log(`✅ Sampled ${allRecords.length} total records\n`);
    return allRecords;
}
async function main() {
    console.log('🚀 Starting Pinecone Test Expansion\n');
    console.log(`Target: ${TARGET_ASSETS} assets with real pricing\n`);
    // Get current asset count
    const countResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM assets`);
    const startCount = Number(countResult.rows[0].count);
    console.log(`📊 Current assets in database: ${startCount}\n`);
    // Initialize services
    const pinecone = new pinecone_1.Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const expansionService = new pineconeAssetExpansion_1.PineconeAssetExpansionService();
    // Sample diverse records
    const records = await sampleDiverseRecords(pinecone, TARGET_ASSETS);
    // Process in batches
    let totalCreated = 0;
    let totalPriced = 0;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)} (${batch.length} records)...`);
        try {
            // Transform Pinecone records to assets
            const transformResult = await expansionService.transformRecordsToAssets({
                characters: batch.filter((r) => r.metadata?.category === 'Characters'),
                creators: batch.filter((r) => r.metadata?.category === 'Creators'),
                comics: batch.filter((r) => r.metadata?.category === 'Comics')
            });
            const transformedAssets = [
                ...transformResult.characterAssets,
                ...transformResult.creatorAssets,
                ...transformResult.comicAssets
            ];
            console.log(`  ✓ Transformed ${transformedAssets.length} records into assets`);
            if (transformedAssets.length === 0)
                continue;
            // Check for duplicates
            const symbols = transformedAssets.map((a) => a.symbol);
            console.log(`  🔍 Checking ${symbols.length} symbols for duplicates...`);
            console.log(`     Sample symbols: ${symbols.slice(0, 3).join(', ')}`);
            const existing = await databaseStorage_1.db.select({ symbol: schema_1.assets.symbol })
                .from(schema_1.assets)
                .where((0, drizzle_orm_1.inArray)(schema_1.assets.symbol, symbols));
            console.log(`  📊 Found ${existing.length} existing symbols in database`);
            const existingSymbols = new Set(existing.map((e) => e.symbol));
            const newAssets = transformedAssets.filter((a) => !existingSymbols.has(a.symbol));
            if (newAssets.length === 0) {
                console.log(`  ⊘ All ${transformedAssets.length} assets already exist, skipping batch`);
                continue;
            }
            console.log(`  ✓ ${newAssets.length} new assets (${transformedAssets.length - newAssets.length} duplicates skipped)`);
            // Insert assets
            const insertedAssets = await databaseStorage_1.db.insert(schema_1.assets)
                .values(newAssets)
                .returning({ id: schema_1.assets.id, symbol: schema_1.assets.symbol, name: schema_1.assets.name });
            console.log(`  ✓ Inserted ${insertedAssets.length} assets into database`);
            // Price each asset using enrichment
            const pricedAssets = [];
            for (const asset of insertedAssets) {
                try {
                    // Find the original transformed asset to get type info
                    const originalAsset = newAssets.find((a) => a.symbol === asset.symbol);
                    if (!originalAsset)
                        continue;
                    const enriched = await expansionService.enrichAssetWithPricing(originalAsset);
                    if (enriched?.pricing) {
                        pricedAssets.push({
                            assetId: asset.id,
                            currentPrice: enriched.pricing.currentPrice.toString(),
                            volume: Math.floor(Math.random() * 100000),
                            priceSource: enriched.pricing.source
                        });
                        totalPriced++;
                    }
                }
                catch (error) {
                    console.log(`    ⚠ Could not price ${asset.symbol}: ${error}`);
                }
            }
            // Bulk insert prices
            if (pricedAssets.length > 0) {
                await databaseStorage_1.db.insert(schema_1.assetCurrentPrices).values(pricedAssets);
                console.log(`  ✓ Priced ${pricedAssets.length} assets (${insertedAssets.length - pricedAssets.length} failed)`);
            }
            totalCreated += insertedAssets.length;
            // Progress update
            console.log(`\n📈 Progress: ${totalCreated} assets created, ${totalPriced} priced`);
        }
        catch (error) {
            console.error(`  ✗ Batch error:`, error);
        }
    }
    // Final stats
    const endCountResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM assets`);
    const endCount = Number(endCountResult.rows[0].count);
    const pricedCountResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM asset_current_prices`);
    const pricedCount = Number(pricedCountResult.rows[0].count);
    console.log(`\n✨ Test Expansion Complete!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 Assets: ${startCount} → ${endCount} (+${endCount - startCount})`);
    console.log(`💰 Priced: ${pricedCount} assets`);
    console.log(`✅ Success Rate: ${totalCreated > 0 ? Math.round((totalPriced / totalCreated) * 100) : 0}% priced`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}
main().catch(console.error);
