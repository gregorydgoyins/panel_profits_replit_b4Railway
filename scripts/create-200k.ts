#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const PUBLISHERS = ['Marvel', 'DC', 'Image', 'Dark Horse', 'IDW', 'Vertigo', 'Boom', 'Valiant', 'Dynamite', 'AfterShock'];
const TYPES = ['character', 'comic', 'creator', 'franchise', 'series'];

function randomPrice(): number {
  return 50 + Math.random() * 1950; // $50-$2000
}

async function create200K() {
  console.log('🚀 Creating 200,000 assets with prices...\n');
  
  const startTime = Date.now();
  const batchSize = 2000; // Larger batches for speed
  const totalAssets = 200000;
  const totalBatches = totalAssets / batchSize;
  
  for (let batch = 0; batch < totalBatches; batch++) {
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (let i = 0; i < batchSize; i++) {
      const id = batch * batchSize + i + 10005; // Start after existing assets
      const publisher = PUBLISHERS[id % PUBLISHERS.length];
      const type = TYPES[id % TYPES.length];
      const price = randomPrice();
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol: `A${id}`,
        name: `${publisher} ${type} #${id}`,
        type,
        description: `${publisher} trading asset`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 0.9 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'BulkGeneration',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 10000)
      });
    }
    
    // Bulk insert
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    
    // Add IDs and insert prices
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    
    await db.insert(assetCurrentPrices).values(pricesWithIds);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const progress = ((batch + 1) / totalBatches * 100).toFixed(1);
    console.log(`✅ ${(batch + 1) * batchSize} / ${totalAssets} (${progress}%) - ${elapsed}s elapsed`);
  }
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const rate = (totalAssets / (Date.now() - startTime) * 1000).toFixed(0);
  
  console.log(`\n🏁 COMPLETE!`);
  console.log(`   Created: 200,000 assets with prices`);
  console.log(`   Time: ${totalTime} seconds`);
  console.log(`   Rate: ${rate} assets/second`);
  console.log(`   Price range: $50-$2,000/share`);
}

create200K().catch(console.error).finally(() => process.exit());
