#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { sql, isNull } from 'drizzle-orm';

setInterval(() => {}, 1000);

async function beastMode() {
  console.log('🦁 COVER BEAST - BATCHED SQL (FIXED)\n');
  
  let total = 0;
  const start = Date.now();
  
  while (true) {
    try {
      const batch = await db.select()
        .from(assets)
        .where(isNull(assets.coverImageUrl))
        .limit(500);
      
      if (batch.length === 0) {
        console.log('✅ ALL COVERED!');
        await new Promise(r => setTimeout(r, 30000));
        continue;
      }
      
      // Build CASE statement with properly quoted IDs
      const cases: string[] = [];
      const ids: string[] = [];
      
      for (const a of batch) {
        ids.push(`'${a.id}'`);
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
        
        cases.push(`WHEN '${a.id}' THEN '${url.replace(/'/g, "''")}'`);
      }
      
      const updateSQL = `
        UPDATE assets 
        SET cover_image_url = CASE id 
          ${cases.join(' ')}
        END
        WHERE id IN (${ids.join(',')})
      `;
      
      await db.execute(sql.raw(updateSQL));
      
      total += batch.length;
      const rate = (total / ((Date.now() - start) / 1000)).toFixed(1);
      const mb = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
      console.log(`🔥 ${total.toLocaleString()} | ${rate}/s | ${mb}MB | ${batch.length}`);
      
    } catch (e: any) {
      console.error(`❌ ${e.message}`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

beastMode();
