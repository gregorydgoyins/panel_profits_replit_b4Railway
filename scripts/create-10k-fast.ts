#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const PUBLISHERS = ['Marvel', 'DC', 'Image', 'Dark Horse', 'IDW'];
const TYPES = ['character', 'comic', 'creator'];

function randomPrice(): number {
  return 50 + Math.random() * 1950; // $50-$2000
}

async function create10KFast() {
  console.log('⚡ Creating 10,000 assets with prices FAST...\n');
  
  const batchSize = 1000;
  const totalAssets = 10000;
  
  for (let batch = 0; batch < totalAssets / batchSize; batch++) {
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (let i = 0; i < batchSize; i++) {
      const id = batch * batchSize + i;
      const publisher = PUBLISHERS[id % PUBLISHERS.length];
      const type = TYPES[id % TYPES.length];
      const price = randomPrice();
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol: `ASSET${id}`,
        name: `${publisher} ${type} #${id}`,
        type,
        description: `Trading asset #${id}`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 0.9 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'FastGeneration',
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
    
    console.log(`✅ Batch ${batch + 1}/10: ${(batch + 1) * batchSize} assets created`);
  }
  
  console.log(`\n🏁 COMPLETE: 10,000 assets with prices!`);
  console.log(`   Price range: $50-$2,000/share`);
  console.log(`   All priced and ready to stream!`);
}

create10KFast().catch(console.error).finally(() => process.exit());
