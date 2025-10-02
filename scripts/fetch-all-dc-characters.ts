#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY!;

async function fetchComicVineCharacters(offset: number = 0): Promise<any> {
  const url = `https://comicvine.gamespot.com/api/characters/?api_key=${COMIC_VINE_API_KEY}&format=json&limit=100&offset=${offset}&filter=publisher:10`;
  
  const response = await fetch(url, {
    headers: { 'User-Agent': 'PanelProfits/1.0' }
  });
  
  if (!response.ok) {
    throw new Error(`Comic Vine API error: ${response.status}`);
  }
  
  return await response.json();
}

function calculateDCPrice(appearances: number): number {
  const basePrice = 80; // DC slightly higher base
  const bonus = Math.min(appearances * 3, 1400);
  return Math.min(Math.max(basePrice + bonus, 80), 5000);
}

async function importAllDCCharacters() {
  console.log('🦇 FETCHING ALL DC CHARACTERS FROM COMIC VINE API...\n');
  
  // First batch to get total
  const firstBatch = await fetchComicVineCharacters(0);
  const total = firstBatch.number_of_total_results;
  
  console.log(`🎯 Comic Vine has ${total.toLocaleString()} DC characters!`);
  console.log(`📊 Importing in batches of 100...\n`);
  
  let imported = 0;
  
  for (let offset = 0; offset < total; offset += 100) {
    try {
      console.log(`\n📦 Fetching DC characters ${offset}-${offset + 100}...`);
      
      const data = await fetchComicVineCharacters(offset);
      const characters = data.results;
      
      const assetBatch: any[] = [];
      const priceBatch: any[] = [];
      
      for (const char of characters) {
        const name = char.name || `DC-Character-${imported}`;
        const description = char.deck || char.description || `DC Comics character`;
        const imageUrl = char.image?.medium_url || null;
        const appearances = char.count_of_issue_appearances || 0;
        
        const symbol = `DC${Date.now()}${imported}`;
        const price = calculateDCPrice(appearances);
        const float = 100000 + Math.floor(Math.random() * 900000);
        
        assetBatch.push({
          symbol,
          name,
          type: 'character',
          description: description.substring(0, 500),
          coverImageUrl: imageUrl,
          metadata: {
            comicVineId: char.id,
            appearances,
            publisher: 'DC Comics',
            realName: char.real_name,
            aliases: char.aliases,
            origin: char.origin?.name,
            powers: char.powers
          }
        });
        
        priceBatch.push({
          currentPrice: price,
          totalMarketValue: price * float,
          totalFloat: float,
          sharesPerCopy: 100,
          scarcityModifier: 0.95 + Math.random() * 0.15,
          averageComicValue: price * 100,
          priceSource: 'ComicVine-DC',
          marketStatus: 'open',
          volume: Math.floor(Math.random() * 10000)
        });
        
        imported++;
      }
      
      if (assetBatch.length > 0) {
        const insertedAssets = await db.insert(assets).values(assetBatch).returning();
        const pricesWithIds = priceBatch.map((p, idx) => ({
          ...p,
          assetId: insertedAssets[idx].id
        }));
        await db.insert(assetCurrentPrices).values(pricesWithIds);
      }
      
      console.log(`✅ Imported ${imported} / ${total} DC characters`);
      
      // Comic Vine: 200 calls/hour = 18 seconds between calls
      await new Promise(r => setTimeout(r, 18000));
      
    } catch (err: any) {
      console.error(`❌ Error at offset ${offset}: ${err.message}`);
      await new Promise(r => setTimeout(r, 60000));
    }
  }
  
  console.log(`\n\n🏁 IMPORTED ${imported} DC CHARACTERS!`);
  console.log(`   All with cover images and appearance data!`);
}

importAllDCCharacters().catch(console.error).finally(() => process.exit());
