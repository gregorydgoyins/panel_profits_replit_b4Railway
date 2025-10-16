"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pineconeAssetExpansion_1 = require("../services/pineconeAssetExpansion");
const openaiService_1 = require("../services/openaiService");
const pineconeService_1 = require("../services/pineconeService");
async function quickTest() {
    console.log('🧪 QUICK TEST: 100 Pinecone Assets\n');
    // Initialize services
    await pineconeService_1.pineconeService.init();
    await openaiService_1.openaiService.init();
    console.log('✅ Services initialized\n');
    const expansionService = new pineconeAssetExpansion_1.PineconeAssetExpansionService();
    // Run small expansion (33 per category = ~100 total)
    const result = await expansionService.expandAssetDatabase(33);
    if (!result || result.totalAssets === 0) {
        console.error('❌ No assets generated');
        return;
    }
    const allAssets = [...result.characterAssets, ...result.creatorAssets, ...result.comicAssets];
    const prices = allAssets.filter(a => a.pricing).map(a => a.pricing.currentPrice);
    console.log('\n📊 RESULTS:');
    console.log(`Total: ${result.totalAssets} assets`);
    console.log(`Characters: ${result.characterAssets.length}`);
    console.log(`Creators: ${result.creatorAssets.length}`);
    console.log(`Comics: ${result.comicAssets.length}`);
    console.log(`\nPrice range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
    console.log(`Within $50-$6K: ${prices.every(p => p >= 50 && p <= 6000) ? '✅' : '❌'}`);
    // Sample
    console.log('\n📋 SAMPLES:');
    allAssets.slice(0, 5).forEach(a => {
        console.log(`${a.symbol.padEnd(20)} ${a.name.padEnd(30)} $${a.pricing?.currentPrice || 0}`);
    });
}
quickTest().catch(console.error).finally(() => process.exit(0));
