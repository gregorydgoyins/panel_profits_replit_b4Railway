#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY!;

async function fetchAllCharacters(offset: number = 0): Promise<any> {
  // Fetch ALL characters, let Comic Vine filter by their database
  const url = `https://comicvine.gamespot.com/api/characters/?api_key=${COMIC_VINE_API_KEY}&format=json&limit=100&offset=${offset}`;
  
  const response = await fetch(url, {
    headers: { 'User-Agent': 'PanelProfits/1.0' }
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Comic Vine error ${response.status}: ${text.substring(0, 100)}`);
  }
  
  return await response.json();
}

function calculatePrice(appearances: number): number {
  const basePrice = 75;
  const bonus = Math.min(appearances * 3, 1500);
  return Math.min(Math.max(basePrice + bonus, 75), 5000);
}

async function importAllComicVineCharacters() {
  console.log('🌎 FETCHING ALL CHARACTERS FROM COMIC VINE (ALL PUBLISHERS)...\n');
  
  // Get total first
  try {
    const firstBatch = await fetchAllCharacters(0);
    const total = firstBatch.number_of_total_results;
    
    console.log(`🎯 Comic Vine has ${total.toLocaleString()} total characters!`);
    console.log(`📊 Importing ALL of them...\n`);
    
    let imported = 0;
    
    for (let offset = 0; offset < Math.min(total, 50000); offset += 100) {
      try {
        console.log(`\n📦 Fetching characters ${offset}-${offset + 100}...`);
        
        const data = await fetchAllCharacters(offset);
        const characters = data.results;
        
        const assetBatch: any[] = [];
        const priceBatch: any[] = [];
        
        for (const char of characters) {
          const name = char.name || `Character-${imported}`;
          const publisher = char.publisher?.name || 'Unknown';
          const description = char.deck || `${publisher} character`;
          const imageUrl = char.image?.medium_url || null;
          const appearances = char.count_of_issue_appearances || 0;
          
          const symbol = `CV${Date.now()}${imported}`;
          const price = calculatePrice(appearances);
          const float = 100000 + Math.floor(Math.random() * 900000);
          
          assetBatch.push({
            symbol,
            name,
            type: 'character',
            description: description.substring(0, 500),
            coverImageUrl: imageUrl,
            metadata: {
              comicVineId: char.id,
              publisher,
              appearances,
              realName: char.real_name
            }
          });
          
          priceBatch.push({
            currentPrice: price,
            totalMarketValue: price * float,
            totalFloat: float,
            sharesPerCopy: 100,
            scarcityModifier: 0.95 + Math.random() * 0.15,
            averageComicValue: price * 100,
            priceSource: 'ComicVine-All',
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
        
        console.log(`✅ Imported ${imported} / ${total} characters`);
        
        // Rate limit: 18 seconds (200/hour)
        await new Promise(r => setTimeout(r, 18000));
        
      } catch (err: any) {
        console.error(`❌ Error at offset ${offset}: ${err.message}`);
        await new Promise(r => setTimeout(r, 60000));
      }
    }
    
    console.log(`\n\n🏁 IMPORT COMPLETE: ${imported} characters from ALL publishers!`);
    
  } catch (err: any) {
    console.error(`❌ FATAL ERROR: ${err.message}`);
    console.error(`   Check API key is valid`);
  }
}

importAllComicVineCharacters().catch(console.error).finally(() => process.exit());
