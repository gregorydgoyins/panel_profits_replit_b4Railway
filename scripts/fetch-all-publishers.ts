#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY!;

// Comic Vine Publisher IDs
const PUBLISHERS = [
  { id: 10, name: 'DC Comics', prefix: 'DC' },
  { id: 56, name: 'Dark Horse Comics', prefix: 'DH' },
  { id: 4, name: 'Marvel', prefix: 'MRV' },
  { id: 1, name: 'Image Comics', prefix: 'IMG' },
  { id: 10, name: 'IDW Publishing', prefix: 'IDW' },
  { id: 2909, name: 'BOOM! Studios', prefix: 'BOOM' },
  { id: 2934, name: 'Valiant Comics', prefix: 'VAL' },
  { id: 2918, name: 'Dynamite Entertainment', prefix: 'DYN' },
  { id: 2929, name: 'Archie Comics', prefix: 'ARCH' },
  { id: 752, name: 'Vertigo', prefix: 'VERT' }
];

async function fetchCharacters(publisherName: string, offset: number = 0): Promise<any> {
  // Search by publisher name instead of ID to avoid auth issues
  const url = `https://comicvine.gamespot.com/api/characters/?api_key=${COMIC_VINE_API_KEY}&format=json&limit=100&offset=${offset}`;
  
  const response = await fetch(url, {
    headers: { 'User-Agent': 'PanelProfits/1.0' }
  });
  
  if (!response.ok) {
    throw new Error(`Comic Vine error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Filter by publisher in results
  const filtered = data.results.filter((char: any) => 
    char.publisher && char.publisher.name && 
    char.publisher.name.toLowerCase().includes(publisherName.toLowerCase())
  );
  
  return { ...data, results: filtered };
}

function calculatePrice(appearances: number, publisher: string): number {
  const basePrice = publisher.includes('Marvel') || publisher.includes('DC') ? 85 : 70;
  const bonus = Math.min(appearances * 3, 1400);
  return Math.min(Math.max(basePrice + bonus, 70), 5000);
}

async function importAllPublishers() {
  console.log('📚 FETCHING CHARACTERS FROM ALL PUBLISHERS...\n');
  
  let totalImported = 0;
  
  for (const publisher of PUBLISHERS) {
    console.log(`\n\n🎯 IMPORTING: ${publisher.name}`);
    console.log(`${'='.repeat(50)}\n`);
    
    let publisherTotal = 0;
    
    for (let offset = 0; offset < 5000; offset += 100) {
      try {
        console.log(`📦 Fetching ${publisher.name} characters ${offset}-${offset + 100}...`);
        
        const data = await fetchCharacters(publisher.name, offset);
        const characters = data.results;
        
        if (characters.length === 0) {
          console.log(`   No more ${publisher.name} characters found.`);
          break;
        }
        
        const assetBatch: any[] = [];
        const priceBatch: any[] = [];
        
        for (const char of characters) {
          const name = char.name || `${publisher.prefix}-${publisherTotal}`;
          const description = char.deck || `${publisher.name} character`;
          const imageUrl = char.image?.medium_url || null;
          const appearances = char.count_of_issue_appearances || 0;
          
          const symbol = `${publisher.prefix}${Date.now()}${publisherTotal}`;
          const price = calculatePrice(appearances, publisher.name);
          const float = 100000 + Math.floor(Math.random() * 900000);
          
          assetBatch.push({
            symbol,
            name,
            type: 'character',
            description: description.substring(0, 500),
            coverImageUrl: imageUrl,
            metadata: {
              comicVineId: char.id,
              publisher: publisher.name,
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
            priceSource: `ComicVine-${publisher.prefix}`,
            marketStatus: 'open',
            volume: Math.floor(Math.random() * 10000)
          });
          
          publisherTotal++;
          totalImported++;
        }
        
        if (assetBatch.length > 0) {
          const insertedAssets = await db.insert(assets).values(assetBatch).returning();
          const pricesWithIds = priceBatch.map((p, idx) => ({
            ...p,
            assetId: insertedAssets[idx].id
          }));
          await db.insert(assetCurrentPrices).values(pricesWithIds);
        }
        
        console.log(`   ✅ ${publisher.name}: ${publisherTotal} characters`);
        
        // Rate limit: 18 seconds
        await new Promise(r => setTimeout(r, 18000));
        
      } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`);
        await new Promise(r => setTimeout(r, 60000));
        break;
      }
    }
    
    console.log(`\n✅ ${publisher.name} COMPLETE: ${publisherTotal} characters imported!`);
  }
  
  console.log(`\n\n🏁 ALL PUBLISHERS COMPLETE!`);
  console.log(`   Total imported: ${totalImported} characters`);
}

importAllPublishers().catch(console.error).finally(() => process.exit());
