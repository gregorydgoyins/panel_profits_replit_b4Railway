"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const pineconeAssetExpansion_1 = require("../services/pineconeAssetExpansion");
const openaiService_1 = require("../services/openaiService");
const pineconeService_1 = require("../services/pineconeService");
const drizzle_orm_1 = require("drizzle-orm");
async function efficientExpansion() {
    console.log('🚀 EFFICIENT PINECONE EXPANSION\n');
    console.log('='.repeat(80));
    // Initialize services
    console.log('🔧 Initializing services...');
    await pineconeService_1.pineconeService.init();
    await openaiService_1.openaiService.init();
    console.log('✅ Services ready\n');
    // Check starting count
    const before = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM assets`);
    const startCount = Number(before.rows[0].count);
    console.log(`📊 Starting assets: ${startCount.toLocaleString()}\n`);
    const expansionService = new pineconeAssetExpansion_1.PineconeAssetExpansionService();
    // Process in larger batches for efficiency
    const totalSamples = 10000; // Start with 10K to test efficiency
    const batchSize = 2000;
    let totalGenerated = 0;
    let totalInserted = 0;
    for (let i = 0; i < totalSamples; i += batchSize) {
        const currentBatch = Math.min(batchSize, totalSamples - i);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(totalSamples / batchSize);
        console.log(`\n📦 BATCH ${batchNum}/${totalBatches} (${currentBatch} samples)`);
        console.log('-'.repeat(80));
        const startTime = Date.now();
        try {
            const result = await expansionService.expandAssetDatabase(currentBatch, {
                batchSize: 200 // Process 200 at a time internally
            });
            if (!result || result.totalAssets === 0) {
                console.warn(`⚠️  No assets generated in this batch`);
                continue;
            }
            totalGenerated += result.totalAssets;
            // Combine all assets
            const allAssets = [
                ...result.characterAssets,
                ...result.creatorAssets,
                ...result.comicAssets
            ];
            console.log(`   Generated: ${allAssets.length} assets (${result.characterAssets.length} chars, ${result.creatorAssets.length} creators, ${result.comicAssets.length} comics)`);
            // Check for duplicates
            const symbols = allAssets.map(a => a.symbol);
            const existing = await databaseStorage_1.db.select({ symbol: schema_1.assets.symbol })
                .from(schema_1.assets)
                .where((0, drizzle_orm_1.inArray)(schema_1.assets.symbol, symbols));
            const existingSymbols = new Set(existing.map(e => e.symbol));
            const newAssets = allAssets.filter(a => !existingSymbols.has(a.symbol));
            console.log(`   Duplicates: ${existingSymbols.size} already exist`);
            console.log(`   New assets: ${newAssets.length} to insert`);
            if (newAssets.length > 0) {
                // Insert assets in chunks
                const chunkSize = 500;
                for (let j = 0; j < newAssets.length; j += chunkSize) {
                    const chunk = newAssets.slice(j, Math.min(j + chunkSize, newAssets.length));
                    // Insert assets
                    const assetInserts = chunk.map(a => ({
                        symbol: a.symbol,
                        name: a.name,
                        category: a.category,
                        description: a.metadata?.publisher || null,
                        metadata: JSON.stringify(a.metadata)
                    }));
                    await databaseStorage_1.db.insert(schema_1.assets).values(assetInserts);
                    // Insert prices
                    const priceInserts = chunk
                        .filter(a => a.pricing)
                        .map(a => ({
                        assetId: a.symbol,
                        currentPrice: a.pricing.currentPrice,
                        highPrice: a.pricing.currentPrice,
                        lowPrice: a.pricing.currentPrice,
                        volume: 0,
                        timestamp: new Date().toISOString()
                    }));
                    if (priceInserts.length > 0) {
                        await databaseStorage_1.db.insert(schema_1.assetCurrentPrices).values(priceInserts);
                    }
                }
                totalInserted += newAssets.length;
            }
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const assetsPerSec = (allAssets.length / (Date.now() - startTime) * 1000).toFixed(1);
            console.log(`   ⏱️  Time: ${elapsed}s (${assetsPerSec} assets/sec)`);
            console.log(`   📈 Total: ${totalInserted.toLocaleString()} new assets added`);
        }
        catch (error) {
            console.error(`   ❌ Batch error:`, error);
            continue;
        }
    }
    // Final summary
    const after = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM assets`);
    const endCount = Number(after.rows[0].count);
    console.log('\n' + '='.repeat(80));
    console.log('✅ EXPANSION COMPLETE');
    console.log(`📊 Assets before: ${startCount.toLocaleString()}`);
    console.log(`📊 Assets after: ${endCount.toLocaleString()}`);
    console.log(`📊 New assets added: ${(endCount - startCount).toLocaleString()}`);
    console.log(`📊 Total generated: ${totalGenerated.toLocaleString()}`);
    // Show pricing distribution
    const priceStats = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
    SELECT 
      COUNT(*) as total,
      ROUND(AVG(current_price::numeric), 2) as avg_price,
      MIN(current_price) as min_price,
      MAX(current_price) as max_price
    FROM asset_current_prices
  `);
    console.log(`\n💰 PRICING STATS:`);
    console.log(`   Total priced: ${Number(priceStats.rows[0].total).toLocaleString()}`);
    console.log(`   Average: $${Number(priceStats.rows[0].avg_price).toLocaleString()}`);
    console.log(`   Range: $${priceStats.rows[0].min_price} - $${priceStats.rows[0].max_price}`);
    console.log('='.repeat(80));
}
efficientExpansion().catch(console.error).finally(() => process.exit(0));
