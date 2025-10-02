#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq, isNull } from 'drizzle-orm';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;

async function scrapeComicVine(name: string): Promise<string | null> {
  try {
    const url = `https://comicvine.gamespot.com/api/search/?api_key=${COMIC_VINE_API_KEY}&format=json&query=${encodeURIComponent(name)}&resources=character,issue&limit=1`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Panel Profits' }
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.results?.[0]?.image?.medium_url || null;
  } catch {
    return null;
  }
}

async function scrapeCoversToDatabase() {
  console.log('🕷️ SCRAPING COMIC COVERS AT SCALE...\n');
  
  // Get assets without covers
  const assetsNeeded = await db.select()
    .from(assets)
    .where(isNull(assets.coverImageUrl))
    .limit(1000);
  
  console.log(`📦 Scraping ${assetsNeeded.length} covers\n`);
  console.log(`⏱️  Rate: 200/hour (Comic Vine limit)`);
  console.log(`   Total time: ~${Math.ceil(assetsNeeded.length / 200)} hours\n`);
  
  let scraped = 0;
  const batchSize = 10;
  
  for (let i = 0; i < assetsNeeded.length; i += batchSize) {
    const batch = assetsNeeded.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (asset) => {
      const coverUrl = await scrapeComicVine(asset.name);
      
      if (coverUrl) {
        await db.update(assets)
          .set({ coverImageUrl: coverUrl })
          .where(eq(assets.id, asset.id));
        
        scraped++;
        console.log(`✅ [${scraped}/${assetsNeeded.length}] ${asset.name}`);
      }
    }));
    
    // Rate limit: 18 seconds between batches
    await new Promise(r => setTimeout(r, 18000));
  }
  
  console.log(`\n🏁 Scraped ${scraped} covers!`);
}

scrapeCoversToDatabase().catch(console.error).finally(() => process.exit());
