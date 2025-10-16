"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseStorage_1 = require("../databaseStorage");
const pineconeAssetExpansion_1 = require("../services/pineconeAssetExpansion");
const openaiService_1 = require("../services/openaiService");
const pineconeService_1 = require("../services/pineconeService");
const drizzle_orm_1 = require("drizzle-orm");
async function expand1000Assets() {
    console.log('🚀 SMALL BATCH TEST: Expanding 1,000 Pinecone Assets\n');
    console.log('='.repeat(80));
    // Initialize required services
    console.log('🔧 Initializing services...');
    await pineconeService_1.pineconeService.init();
    console.log('   ✓ Pinecone connected');
    await openaiService_1.openaiService.init();
    console.log('   ✓ OpenAI initialized\n');
    // Check current asset count
    const beforeCount = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) as count FROM assets`);
    const startCount = Number(beforeCount.rows[0].count);
    console.log(`📊 Current assets in database: ${startCount.toLocaleString()}\n`);
    // Initialize expansion service
    const expansionService = new pineconeAssetExpansion_1.PineconeAssetExpansionService();
    // Run expansion for ~333 samples per category = ~1000 total assets
    console.log('🔄 Starting Pinecone expansion (333 samples per category)...\n');
    const result = await expansionService.expandAssetDatabase(333, {
        batchSize: 100,
        onBatchComplete: (batchNum, totalAssets) => {
            console.log(`   ✓ Batch ${batchNum} complete - ${totalAssets} assets processed so far`);
        }
    });
    if (!result || result.totalAssets === 0) {
        console.error('❌ No assets generated from expansion');
        return;
    }
    console.log('\n' + '─'.repeat(80));
    console.log('📦 EXPANSION SUMMARY:');
    console.log(`   Total Generated: ${result.totalAssets}`);
    console.log(`   Characters: ${result.characterAssets.length}`);
    console.log(`   Creators: ${result.creatorAssets.length}`);
    console.log(`   Comics: ${result.comicAssets.length}`);
    // Check pricing distribution
    const pricedAssets = [...result.characterAssets, ...result.creatorAssets, ...result.comicAssets]
        .filter(a => a.pricing);
    const prices = pricedAssets.map(a => a.pricing.currentPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    console.log('\n💰 PRICING ANALYSIS:');
    console.log(`   Min: $${minPrice.toLocaleString()}`);
    console.log(`   Max: $${maxPrice.toLocaleString()}`);
    console.log(`   Avg: $${avgPrice.toFixed(2)}`);
    console.log(`   Within $50-$6,000: ${prices.every(p => p >= 50 && p <= 6000) ? '✅ YES' : '❌ NO'}`);
    // Check for duplicate symbols
    const symbols = [...result.characterAssets, ...result.creatorAssets, ...result.comicAssets]
        .map(a => a.symbol);
    const uniqueSymbols = new Set(symbols);
    console.log('\n🔍 DUPLICATE CHECK:');
    console.log(`   Total symbols: ${symbols.length}`);
    console.log(`   Unique symbols: ${uniqueSymbols.size}`);
    console.log(`   Duplicates: ${symbols.length - uniqueSymbols.size === 0 ? '✅ NONE' : `❌ ${symbols.length - uniqueSymbols.size}`}`);
    // Show sample assets
    console.log('\n📋 SAMPLE ASSETS (first 10):');
    const sampleAssets = [...result.characterAssets, ...result.creatorAssets, ...result.comicAssets].slice(0, 10);
    sampleAssets.forEach((asset, i) => {
        const price = asset.pricing?.currentPrice || 0;
        console.log(`   ${i + 1}. ${asset.symbol.padEnd(20)} | ${asset.name.padEnd(35)} | $${price.toLocaleString()}`);
    });
    console.log('\n' + '='.repeat(80));
    console.log('✅ TEST EXPANSION COMPLETE\n');
    console.log('📈 Next step: Review output, then run full expansion to millions of assets');
    console.log('='.repeat(80));
}
expand1000Assets().catch(console.error).finally(() => process.exit(0));
