#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const TARGET = 300000;
const BATCH = 500;

const PUBS = ['DC Comics', 'Marvel Comics', 'Image', 'Dark Horse', 'IDW', 'Boom!', 'Dynamite', 'Valiant'];
const TYPES = ['character', 'comic', 'creator', 'franchise'];

async function fastGen() {
  console.log(`🚀 FAST GENERATION: ${TARGET.toLocaleString()} ASSETS\n`);
  
  let done = 0;
  const start = Date.now();
  
  for (let b = 0; b < TARGET / BATCH; b++) {
    const aB: any[] = [];
    const pB: any[] = [];
    
    for (let i = 0; i < BATCH; i++) {
      const idx = b * BATCH + i;
      const type = TYPES[idx % 4];
      const pub = PUBS[idx % 8];
      const price = 50 + Math.random() * 950;
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      aB.push({
        symbol: `FAST${idx + 20000}`,
        name: `Asset ${idx + 20000}`,
        type,
        description: `${pub} ${type}`,
        metadata: { publisher: pub }
      });
      
      pB.push({
        currentPrice: parseFloat(price.toFixed(2)),
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: parseFloat((0.9 + Math.random() * 0.3).toFixed(3)),
        averageComicValue: price * 100,
        priceSource: 'FastGen-3',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 100000)
      });
    }
    
    try {
      const ins = await db.insert(assets).values(aB).returning();
      await db.insert(assetCurrentPrices).values(pB.map((p, i) => ({ ...p, assetId: ins[i].id })));
      done += BATCH;
      
      if (b % 20 === 0) {
        const r = (done / ((Date.now() - start) / 1000)).toFixed(0);
        const eta = ((TARGET - done) / parseInt(r) / 60).toFixed(1);
        console.log(`✅ ${done.toLocaleString()}/${TARGET.toLocaleString()} | ${r}/s | ETA: ${eta}m`);
      }
    } catch (e: any) {
      console.error(`❌ Batch ${b}: ${e.message}`);
    }
  }
  
  console.log(`\n🏁 DONE! ${done.toLocaleString()} assets`);
}

fastGen().catch(console.error).finally(() => process.exit());
