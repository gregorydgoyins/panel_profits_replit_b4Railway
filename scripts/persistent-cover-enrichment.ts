#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { isNull, sql } from 'drizzle-orm';
import fs from 'fs';

const BATCH_SIZE = 500;
const CHECKPOINT_FILE = '/tmp/cover-checkpoint.json';

interface Checkpoint {
  lastProcessedId: number;
  totalProcessed: number;
  startTime: number;
}

function loadCheckpoint(): Checkpoint {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
    }
  } catch (err) {
    console.log('   No checkpoint found, starting fresh');
  }
  return { lastProcessedId: 0, totalProcessed: 0, startTime: Date.now() };
}

function saveCheckpoint(checkpoint: Checkpoint) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint));
}

function generateCoverUrl(assetType: string, publisher: string, name: string): string {
  // Generate deterministic placeholder based on asset properties
  const colors = {
    'character': '1a1a2e/4ecca3',
    'comic': '2d132c/ee4540',
    'creator': '801336/ee4540',
    'franchise': '0f3460/16213e'
  };
  
  const color = colors[assetType] || colors['comic'];
  const text = encodeURIComponent(name.substring(0, 20));
  
  return `https://via.placeholder.com/400x600/${color}?text=${text}`;
}

async function persistentEnrichment() {
  console.log('🎨 PERSISTENT COVER ENRICHMENT - NEVER DIES!\n');
  
  const checkpoint = loadCheckpoint();
  console.log(`📍 Resume from ID: ${checkpoint.lastProcessedId}`);
  console.log(`   Already processed: ${checkpoint.totalProcessed.toLocaleString()}\n`);
  
  let processed = checkpoint.totalProcessed;
  let lastId = checkpoint.lastProcessedId;
  
  while (true) {
    try {
      // Get next batch of assets without covers
      const batch = await db.select()
        .from(assets)
        .where(sql`${assets.id} > ${lastId} AND ${assets.coverImageUrl} IS NULL`)
        .limit(BATCH_SIZE);
      
      if (batch.length === 0) {
        console.log('\n✅ No more assets to process. Sleeping 60s...\n');
        await new Promise(r => setTimeout(r, 60000));
        lastId = 0; // Reset to check from beginning
        continue;
      }
      
      // Process batch
      for (const asset of batch) {
        try {
          const coverUrl = generateCoverUrl(
            asset.type,
            (asset.metadata as any)?.publisher || '',
            asset.name
          );
          
          await db.update(assets)
            .set({ coverImageUrl: coverUrl })
            .where(sql`${assets.id} = ${asset.id}`);
          
          processed++;
          lastId = asset.id;
          
        } catch (err) {
          console.error(`   ❌ Asset ${asset.id}: ${err.message}`);
        }
      }
      
      // Save checkpoint
      saveCheckpoint({
        lastProcessedId: lastId,
        totalProcessed: processed,
        startTime: checkpoint.startTime
      });
      
      // Log progress
      const rate = (processed / ((Date.now() - checkpoint.startTime) / 1000)).toFixed(1);
      console.log(`✅ Processed: ${processed.toLocaleString()} | Last ID: ${lastId} | Rate: ${rate}/s`);
      
    } catch (err) {
      console.error(`❌ Batch error: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

persistentEnrichment().catch(err => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});
