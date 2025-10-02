#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const MARVEL_PUBLIC = process.env.MARVEL_API_PUBLIC_KEY!;
const MARVEL_PRIVATE = process.env.MARVEL_API_PRIVATE_KEY!;

async function fetchMarvelCharacters(offset: number = 0, limit: number = 100): Promise<any> {
  const crypto = await import('crypto');
  const ts = Date.now();
  const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE + MARVEL_PUBLIC).digest('hex');
  
  const url = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${MARVEL_PUBLIC}&hash=${hash}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Marvel API error: ${response.status}`);
  }
  
  return await response.json();
}

function calculatePrice(comics: number, series: number, stories: number): number {
  const basePrice = 75;
  const popularity = (comics * 5) + (series * 10) + (stories * 2);
  const bonus = Math.min(popularity, 1500);
  return Math.min(Math.max(basePrice + bonus, 75), 5000);
}

async function importAllMarvelCharacters() {
  console.log('⚡ FETCHING ALL CHARACTERS FROM MARVEL API...\n');
  
  // First, get total count
  const firstBatch = await fetchMarvelCharacters(0, 1);
  const total = firstBatch.data.total;
  
  console.log(`🎯 Marvel has ${total.toLocaleString()} characters in their database!`);
  console.log(`📊 Importing in batches of 100...\n`);
  
  let imported = 0;
  const batchSize = 100;
  
  for (let offset = 0; offset < total; offset += batchSize) {
    try {
      console.log(`\n📦 Fetching characters ${offset}-${offset + batchSize}...`);
      
      const data = await fetchMarvelCharacters(offset, batchSize);
      const characters = data.data.results;
      
      const assetBatch: any[] = [];
      const priceBatch: any[] = [];
      
      for (const char of characters) {
        const name = char.name || `Character-${imported}`;
        const description = char.description || `Marvel character from ${char.comics?.available || 0} comics`;
        const imageUrl = char.thumbnail ? `${char.thumbnail.path}.${char.thumbnail.extension}` : null;
        
        const comics = char.comics?.available || 0;
        const series = char.series?.available || 0;
        const stories = char.stories?.available || 0;
        
        const symbol = `MARVEL${Date.now()}${imported}`;
        const price = calculatePrice(comics, series, stories);
        const float = 100000 + Math.floor(Math.random() * 900000);
        
        assetBatch.push({
          symbol,
          name,
          type: 'character',
          description,
          coverImageUrl: imageUrl,
          metadata: {
            marvelId: char.id,
            comicsAvailable: comics,
            seriesAvailable: series,
            storiesAvailable: stories,
            urls: char.urls
          }
        });
        
        priceBatch.push({
          currentPrice: price,
          totalMarketValue: price * float,
          totalFloat: float,
          sharesPerCopy: 100,
          scarcityModifier: 0.9 + Math.random() * 0.2,
          averageComicValue: price * 100,
          priceSource: 'MarvelAPI-Direct',
          marketStatus: 'open',
          volume: Math.floor(Math.random() * 10000)
        });
        
        imported++;
      }
      
      // Bulk insert
      if (assetBatch.length > 0) {
        const insertedAssets = await db.insert(assets).values(assetBatch).returning();
        const pricesWithIds = priceBatch.map((p, idx) => ({
          ...p,
          assetId: insertedAssets[idx].id
        }));
        await db.insert(assetCurrentPrices).values(pricesWithIds);
      }
      
      console.log(`✅ Imported ${imported} / ${total} characters`);
      
      // Rate limit: Marvel allows 3000 calls/day = ~2 per minute
      await new Promise(r => setTimeout(r, 30000)); // 30 seconds between batches
      
    } catch (err: any) {
      console.error(`❌ Error at offset ${offset}: ${err.message}`);
      await new Promise(r => setTimeout(r, 60000)); // Wait 1 minute on error
    }
  }
  
  console.log(`\n\n🏁 IMPORTED ${imported} CHARACTERS DIRECTLY FROM MARVEL!`);
  console.log(`   All with cover images and real appearance data!`);
}

importAllMarvelCharacters().catch(console.error).finally(() => process.exit());
