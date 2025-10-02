#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const BATCH_SIZE = 500; // Smaller batches for stability
const TOTAL_REMAINING = 305000;

const PUBLISHERS = [
  'DC Comics', 'Marvel Comics', 'Image Comics', 'Dark Horse', 'IDW',
  'Boom! Studios', 'Dynamite', 'Valiant', 'Archie', 'Aftershock',
  'Shueisha', 'Kodansha', 'Shogakukan', 'Dupuis', 'Dargaud'
];

const TYPES = ['character', 'comic', 'creator', 'franchise'];

function genName(i: number) {
  return `Asset ${i + 15000}`;
}

function genPrice(type: string): number {
  const bases = { character: 150, comic: 80, creator: 200, franchise: 300 };
  const base = bases[type] || 100;
  return parseFloat((base + Math.random() * 1000).toFixed(2));
}

async function continueGeneration() {
  console.log(`🚀 CONTINUING GENERATION: ${TOTAL_REMAINING.toLocaleString()} MORE ASSETS\n`);
  
  let generated = 0;
  const start = Date.now();
  
  for (let batch = 0; batch < TOTAL_REMAINING / BATCH_SIZE; batch++) {
    try {
      const assets_batch: any[] = [];
      const prices_batch: any[] = [];
      
      for (let i = 0; i < BATCH_SIZE; i++) {
        const idx = batch * BATCH_SIZE + i + 15000;
        const type = TYPES[idx % TYPES.length];
        const pub = PUBLISHERS[idx % PUBLISHERS.length];
        const price = genPrice(type);
        const float = 100000 + Math.floor(Math.random() * 900000);
        
        assets_batch.push({
          symbol: `GEN${idx}`,
          name: genName(idx),
          type,
          description: `${genName(idx)} - ${pub}`,
          metadata: { publisher: pub, batch }
        });
        
        prices_batch.push({
          currentPrice: price,
          totalMarketValue: price * float,
          totalFloat: float,
          sharesPerCopy: 100,
          scarcityModifier: parseFloat((0.9 + Math.random() * 0.3).toFixed(3)),
          averageComicValue: price * 100,
          priceSource: 'MassGeneration-2',
          marketStatus: 'open',
          volume: Math.floor(Math.random() * 100000)
        });
        
        generated++;
      }
      
      const inserted = await db.insert(assets).values(assets_batch).returning();
      const prices_with_ids = prices_batch.map((p, i) => ({ ...p, assetId: inserted[i].id }));
      await db.insert(assetCurrentPrices).values(prices_with_ids);
      
      const rate = (generated / (Date.now() - start) * 1000).toFixed(0);
      const eta = ((TOTAL_REMAINING - generated) / parseInt(rate) / 60).toFixed(1);
      
      if (batch % 10 === 0) {
        console.log(`✅ ${generated.toLocaleString()}/${TOTAL_REMAINING.toLocaleString()} | ${rate}/s | ETA: ${eta}m`);
      }
      
    } catch (err: any) {
      console.error(`❌ Batch ${batch}: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  console.log(`\n🏁 COMPLETE! Generated ${generated.toLocaleString()} assets`);
}

continueGeneration().catch(console.error).finally(() => process.exit());
