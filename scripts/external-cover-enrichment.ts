#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

const BATCH_SIZE = 100;
const CHECKPOINT_FILE = 'data/cover-progress.json';

interface Progress {
  lastId: number;
  totalProcessed: number;
}

function loadProgress(): Progress {
  try {
    const fs = require('fs');
    if (fs.existsSync(CHECKPOINT_FILE)) {
      return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { lastId: 0, totalProcessed: 0 };
}

function saveProgress(progress: Progress) {
  const fs = require('fs');
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(progress));
}

function getExternalCoverUrl(asset: any): string {
  const metadata = asset.metadata || {};
  
  // 1. Marvel API images (already have full URLs in metadata)
  if (metadata.marvelId && metadata.thumbnail) {
    return `${metadata.thumbnail.path}.${metadata.thumbnail.extension}`;
  }
  
  // 2. Comic Vine images (already in metadata)
  if (metadata.comicVineId && metadata.imageUrl) {
    return metadata.imageUrl;
  }
  
  // 3. Publisher-specific placeholder (hosted externally, no disk)
  const publisher = metadata.publisher || 'Comic';
  const type = asset.type;
  
  // Use robohash for unique, deterministic avatars
  if (type === 'character') {
    return `https://robohash.org/${asset.id}?set=set2&size=400x600`;
  }
  
  // Use placeholder.com for others
  const colors = {
    'comic': '2d132c/ee4540',
    'creator': '801336/ee4540',
    'franchise': '0f3460/16213e'
  };
  
  const color = colors[type] || colors['comic'];
  const text = encodeURIComponent(asset.name.substring(0, 25));
  
  return `https://via.placeholder.com/400x600/${color}?text=${text}`;
}

async function enrichCovers() {
  console.log('🌐 EXTERNAL COVER ENRICHMENT - USING COMIC VINE, MARVEL API, ROBOHASH\n');
  
  const progress = loadProgress();
  console.log(`📍 Starting from ID: ${progress.lastId}`);
  console.log(`   Already processed: ${progress.totalProcessed.toLocaleString()}\n`);
  
  let processed = progress.totalProcessed;
  let lastId = progress.lastId;
  const startTime = Date.now();
  
  while (true) {
    try {
      // Get next batch without covers
      const batch = await db.select()
        .from(assets)
        .where(sql`${assets.id} > ${lastId} AND ${assets.coverImageUrl} IS NULL`)
        .limit(BATCH_SIZE);
      
      if (batch.length === 0) {
        console.log('\n✅ All existing assets have covers! Waiting 30s for new assets...\n');
        await new Promise(r => setTimeout(r, 30000));
        lastId = 0; // Reset
        continue;
      }
      
      // Process batch
      for (const asset of batch) {
        const coverUrl = getExternalCoverUrl(asset);
        
        await db.update(assets)
          .set({ coverImageUrl: coverUrl })
          .where(sql`${assets.id} = ${asset.id}`);
        
        processed++;
        lastId = asset.id;
      }
      
      // Save progress
      saveProgress({ lastId, totalProcessed: processed });
      
      // Log
      const rate = (processed / ((Date.now() - startTime) / 1000)).toFixed(1);
      console.log(`✅ ${processed.toLocaleString()} covers | Last ID: ${lastId} | ${rate}/s`);
      
    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

enrichCovers().catch(err => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});
