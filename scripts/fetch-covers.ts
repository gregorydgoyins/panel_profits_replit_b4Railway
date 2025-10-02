#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;
const BASE_URL = 'https://comicvine.gamespot.com/api';

async function searchComicVine(query: string): Promise<any> {
  const url = `${BASE_URL}/search/?api_key=${COMIC_VINE_API_KEY}&format=json&query=${encodeURIComponent(query)}&resources=character,issue&limit=1`;
  
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Panel Profits Trading Platform' }
  });
  
  if (!response.ok) return null;
  const data = await response.json();
  return data.results?.[0];
}

async function fetchCovers() {
  console.log('🖼️ FETCHING COMIC COVERS FROM COMIC VINE...\n');
  
  // Get assets without cover URLs
  const assetsToFetch = await db.select()
    .from(assets)
    .limit(100);
  
  console.log(`📦 Fetching covers for ${assetsToFetch.length} assets\n`);
  
  let fetched = 0;
  
  for (const asset of assetsToFetch) {
    try {
      const result = await searchComicVine(asset.name);
      
      if (result?.image?.medium_url) {
        // Update asset with cover URL
        await db.update(assets)
          .set({ 
            coverImageUrl: result.image.medium_url,
            description: result.deck || asset.description
          })
          .where(eq(assets.id, asset.id));
        
        fetched++;
        console.log(`✅ [${fetched}] ${asset.name}: ${result.image.medium_url}`);
      }
      
      // Rate limit: Comic Vine allows 200 req/hour = 1 per 18 seconds
      await new Promise(r => setTimeout(r, 20000));
      
    } catch (err: any) {
      console.error(`❌ ${asset.name}: ${err.message}`);
    }
  }
  
  console.log(`\n🏁 Fetched ${fetched} covers!`);
}

fetchCovers().catch(console.error).finally(() => process.exit());
