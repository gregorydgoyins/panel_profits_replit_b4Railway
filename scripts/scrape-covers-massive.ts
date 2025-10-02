#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq, sql, isNull } from 'drizzle-orm';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;
const MARVEL_PUBLIC = process.env.MARVEL_API_PUBLIC_KEY;
const MARVEL_PRIVATE = process.env.MARVEL_API_PRIVATE_KEY;

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

async function scrapeMarvel(name: string): Promise<string | null> {
  try {
    const crypto = await import('crypto');
    const ts = Date.now();
    const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE + MARVEL_PUBLIC).digest('hex');
    
    const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(name)}&ts=${ts}&apikey=${MARVEL_PUBLIC}&hash=${hash}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const char = data.data?.results?.[0];
    return char?.thumbnail ? `${char.thumbnail.path}.${char.thumbnail.extension}` : null;
  } catch {
    return null;
  }
}

async function scrapeMassiveCovers() {
  console.log('🕷️ SCRAPING MASSIVE COVER IMAGES...\n');
  
  // Get assets without covers
  const assetsNeeded = await db.select()
    .from(assets)
    .where(sql`${assets.coverImageUrl} IS NULL`)
    .limit(10000);
  
  console.log(`📦 Scraping ${assetsNeeded.length} covers`);
  console.log(`🔄 Using Comic Vine + Marvel APIs\n`);
  
  let scraped = 0;
  let errors = 0;
  
  for (const asset of assetsNeeded) {
    try {
      // Try Comic Vine first
      let coverUrl = await scrapeComicVine(asset.name);
      
      // If failed, try Marvel API
      if (!coverUrl && asset.type === 'character') {
        coverUrl = await scrapeMarvel(asset.name);
      }
      
      if (coverUrl) {
        await db.update(assets)
          .set({ coverImageUrl: coverUrl })
          .where(eq(assets.id, asset.id));
        
        scraped++;
        
        if (scraped % 100 === 0) {
          console.log(`✅ ${scraped} covers scraped (${errors} errors)`);
        }
      } else {
        errors++;
      }
      
      // Rate limit: 18 seconds for Comic Vine (200/hour)
      await new Promise(r => setTimeout(r, 18000));
      
    } catch (err) {
      errors++;
    }
  }
  
  console.log(`\n🏁 Scraped ${scraped} covers (${errors} failed)!`);
}

scrapeMassiveCovers().catch(console.error).finally(() => process.exit());
