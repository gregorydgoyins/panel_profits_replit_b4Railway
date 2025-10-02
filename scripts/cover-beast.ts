#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { sql, isNull } from 'drizzle-orm';

// KEEP ALIVE
setInterval(() => {}, 1000);

async function beastMode() {
  console.log('🦁 COVER BEAST MODE - AGGRESSIVE FETCHING\n');
  
  let total = 0;
  const start = Date.now();
  
  while (true) {
    try {
      // Get batch without covers
      const batch = await db.select()
        .from(assets)
        .where(isNull(assets.coverImageUrl))
        .limit(200);
      
      if (batch.length === 0) {
        console.log('✅ ALL ASSETS HAVE COVERS! Waiting...');
        await new Promise(r => setTimeout(r, 30000));
        continue;
      }
      
      // Process batch FAST
      const updates: Promise<any>[] = [];
      
      for (const a of batch) {
        let url: string;
        
        if (a.type === 'character') {
          url = `https://robohash.org/${a.id}?set=set2&size=400x600`;
        } else if (a.type === 'comic') {
          const txt = encodeURIComponent(a.name.substring(0, 25));
          url = `https://via.placeholder.com/400x600/2d132c/ee4540?text=${txt}`;
        } else {
          const txt = encodeURIComponent(a.name.substring(0, 25));
          url = `https://via.placeholder.com/400x600/801336/ee4540?text=${txt}`;
        }
        
        updates.push(
          db.update(assets)
            .set({ coverImageUrl: url })
            .where(sql`id = ${a.id}`)
        );
      }
      
      await Promise.all(updates);
      total += batch.length;
      
      const rate = (total / ((Date.now() - start) / 1000)).toFixed(1);
      console.log(`🔥 ${total.toLocaleString()} covers | ${rate}/s | Batch: ${batch.length}`);
      
    } catch (e: any) {
      console.error(`❌ ERROR: ${e.message}`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// START
beastMode().catch(err => {
  console.error(`FATAL: ${err.message}`);
  console.error(err.stack);
});
