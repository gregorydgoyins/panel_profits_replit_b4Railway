#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq, sql } from 'drizzle-orm';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;
const MARVEL_PUBLIC = process.env.MARVEL_API_PUBLIC_KEY;
const MARVEL_PRIVATE = process.env.MARVEL_API_PRIVATE_KEY;

async function scrapeComicVine(name: string): Promise<string | null> {
  try {
    const url = `https://comicvine.gamespot.com/api/search/?api_key=${COMIC_VINE_API_KEY}&format=json&query=${encodeURIComponent(name)}&resources=character,issue,volume&limit=1`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PanelProfits/1.0' }
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.results?.[0]?.image?.medium_url || null;
  } catch {
    return null;
  }
}

async function scrapeMarvel(name: string): Promise<string | null> {
  try {
    const crypto = await import('crypto');
    const ts = Date.now();
    const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE + MARVEL_PUBLIC).digest('hex');
    
    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${encodeURIComponent(name.substring(0, 20))}&ts=${ts}&apikey=${MARVEL_PUBLIC}&hash=${hash}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const char = data.data?.results?.[0];
    return char?.thumbnail ? `${char.thumbnail.path}.${char.thumbnail.extension}` : null;
  } catch {
    return null;
  }
}

async function massScrapeCover() {
  console.log('🕷️ MASS COVER SCRAPING - LONE STAR OPERATION\n');
  console.log('🎯 Target: 320K+ assets');
  console.log('⏱️  Rate: ~200/hour (API limits)');
  console.log('📅 Duration: ~67 days continuous\n');
  
  let scraped = 0;
  let batch = 0;
  const batchSize = 100;
  
  while (true) {
    // Get next 100 assets without covers
    const assetsToScrape = await db.select()
      .from(assets)
      .where(sql`${assets.coverImageUrl} IS NULL`)
      .limit(batchSize);
    
    if (assetsToScrape.length === 0) {
      console.log('\n🏁 ALL ASSETS HAVE COVERS!');
      break;
    }
    
    console.log(`\n📦 Batch ${++batch}: Processing ${assetsToScrape.length} assets...`);
    
    for (const asset of assetsToScrape) {
      let coverUrl = await scrapeComicVine(asset.name);
      
      if (!coverUrl && asset.type === 'character') {
        coverUrl = await scrapeMarvel(asset.name);
      }
      
      if (coverUrl) {
        await db.update(assets)
          .set({ coverImageUrl: coverUrl })
          .where(eq(assets.id, asset.id));
        
        scraped++;
      }
      
      // Rate limit: 18 seconds (200/hour for Comic Vine)
      await new Promise(r => setTimeout(r, 18000));
    }
    
    console.log(`✅ Progress: ${scraped} covers scraped total`);
  }
  
  console.log(`\n🏁 SCRAPING COMPLETE: ${scraped} covers!`);
}

massScrapeCover().catch(console.error).finally(() => process.exit());
