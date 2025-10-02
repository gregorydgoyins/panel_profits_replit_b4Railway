#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { sql, isNull } from 'drizzle-orm';

async function enrichCovers() {
  console.log('📸 COVER WORKER STARTED\n');
  
  let total = 0;
  const start = Date.now();
  
  while (true) {
    try {
      const batch = await db.select()
        .from(assets)
        .where(isNull(assets.coverImageUrl))
        .limit(100);
      
      if (batch.length === 0) {
        console.log('✅ All assets have covers! Waiting 30s...');
        await new Promise(r => setTimeout(r, 30000));
        continue;
      }
      
      for (const a of batch) {
        const type = a.type;
        let url: string;
        
        if (type === 'character') {
          url = `https://robohash.org/${a.id}?set=set2&size=400x600`;
        } else {
          const text = encodeURIComponent(a.name.substring(0, 20));
          const color = type === 'comic' ? '2d132c/ee4540' : '801336/ee4540';
          url = `https://via.placeholder.com/400x600/${color}?text=${text}`;
        }
        
        await db.update(assets)
          .set({ coverImageUrl: url })
          .where(sql`id = ${a.id}`);
        
        total++;
      }
      
      const rate = (total / ((Date.now() - start) / 1000)).toFixed(1);
      console.log(`✅ ${total.toLocaleString()} covers | ${rate}/s`);
      
    } catch (e: any) {
      console.error(`❌ ${e.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

enrichCovers();
