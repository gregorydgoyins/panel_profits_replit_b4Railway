#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;

async function enrichCovers() {
  console.log('🎨 Starting cover image enrichment...');
  
  // Get assets without cover images
  const assetsNeedingCovers = await db.select().from(assets).limit(100);
  console.log(`📦 Found ${assetsNeedingCovers.length} assets to enrich`);
  
  let enriched = 0;
  
  for (const asset of assetsNeedingCovers) {
    if (asset.metadata?.coverImage) continue;
    
    try {
      // Search Comic Vine for the asset
      const searchUrl = `https://comicvine.gamespot.com/api/search/?api_key=${COMIC_VINE_API_KEY}&format=json&query=${encodeURIComponent(asset.name)}&resources=character,issue`;
      const response = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Panel-Profits-Trading/1.0' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const coverUrl = result.image?.medium_url || result.image?.small_url;
          
          if (coverUrl) {
            const metadata = asset.metadata || {};
            metadata.coverImage = coverUrl;
            metadata.comicVineId = result.id;
            
            await db.update(assets)
              .set({ metadata })
              .where(eq(assets.id, asset.id));
            
            enriched++;
            console.log(`  ✅ ${asset.symbol}: ${coverUrl}`);
          }
        }
      }
      
      // Rate limit: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`  ❌ ${asset.symbol}:`, err);
    }
  }
  
  console.log(`\n🏁 Enriched ${enriched} assets with cover images`);
}

enrichCovers().catch(console.error).finally(() => process.exit());
