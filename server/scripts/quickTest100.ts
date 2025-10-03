import { db } from '../databaseStorage';
import { PineconeAssetExpansionService } from '../services/pineconeAssetExpansion';
import { openaiService } from '../services/openaiService';
import { pineconeService } from '../services/pineconeService';
import { sql } from 'drizzle-orm';

async function quickTest() {
  console.log('🧪 QUICK TEST: 100 Pinecone Assets\n');
  
  // Initialize services
  await pineconeService.init();
  await openaiService.init();
  console.log('✅ Services initialized\n');
  
  const expansionService = new PineconeAssetExpansionService();
  
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
