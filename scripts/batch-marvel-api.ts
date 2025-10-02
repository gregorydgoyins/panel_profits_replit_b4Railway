#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import crypto from 'crypto';

const MARVEL_PUBLIC_KEY = process.env.MARVEL_API_PUBLIC_KEY!;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_API_PRIVATE_KEY!;

function generateMarvelAuth() {
  const ts = Date.now().toString();
  const hash = crypto.createHash('md5')
    .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
    .digest('hex');
  return { ts, hash };
}

async function fetchMarvelCharacters(offset: number = 0): Promise<any> {
  const { ts, hash } = generateMarvelAuth();
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}&limit=100&offset=${offset}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Marvel API error: ${response.status}`);
  }
  
  return await response.json();
}

async function fetchMarvelComics(offset: number = 0): Promise<any> {
  const { ts, hash } = generateMarvelAuth();
  const url = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}&limit=100&offset=${offset}&orderBy=-focDate`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Marvel API error: ${response.status}`);
  }
  
  return await response.json();
}

function calculateMarvelPrice(comics: number, series: number): number {
  const basePrice = 150;
  const comicBonus = Math.min(comics * 2, 800);
  const seriesBonus = Math.min(series * 50, 1200);
  return Math.min(Math.max(basePrice + comicBonus + seriesBonus, 100), 5000);
}

async function batchImportMarvel() {
  console.log('⚡ BATCH IMPORTING FROM MARVEL API\n');
  
  // Characters
  console.log('🦸 IMPORTING MARVEL CHARACTERS...\n');
  
  try {
    const firstBatch = await fetchMarvelCharacters(0);
    const total = firstBatch.data.total;
    console.log(`   Total Marvel characters: ${total.toLocaleString()}`);
    console.log(`   Importing in batches of 100...\n`);
    
    let charImported = 0;
    
    for (let offset = 0; offset < Math.min(total, 5000); offset += 100) {
      try {
        console.log(`   📦 Fetching characters ${offset}-${offset + 100}...`);
        
        const data = await fetchMarvelCharacters(offset);
        const characters = data.data.results;
        
        const assetBatch: any[] = [];
        const priceBatch: any[] = [];
        
        for (const char of characters) {
          const name = char.name;
          const description = char.description || `Marvel character: ${name}`;
          const imageUrl = char.thumbnail ? `${char.thumbnail.path}.${char.thumbnail.extension}` : null;
          const comics = char.comics?.available || 0;
          const series = char.series?.available || 0;
          
          const symbol = `MRV${char.id}`;
          const price = calculateMarvelPrice(comics, series);
          const float = 200000 + Math.floor(Math.random() * 800000);
          
          assetBatch.push({
            symbol,
            name,
            type: 'character',
            description: description.substring(0, 500),
            coverImageUrl: imageUrl,
            metadata: {
              marvelId: char.id,
              publisher: 'Marvel Comics',
              comicsAppeared: comics,
              seriesAppeared: series,
              urls: char.urls
            }
          });
          
          priceBatch.push({
            currentPrice: price,
            totalMarketValue: price * float,
            totalFloat: float,
            sharesPerCopy: 100,
            scarcityModifier: 0.95 + Math.random() * 0.20,
            averageComicValue: price * 100,
            priceSource: 'Marvel-API',
            marketStatus: 'open',
            volume: Math.floor(Math.random() * 50000)
          });
          
          charImported++;
        }
        
        if (assetBatch.length > 0) {
          const insertedAssets = await db.insert(assets).values(assetBatch).returning();
          const pricesWithIds = priceBatch.map((p, idx) => ({
            ...p,
            assetId: insertedAssets[idx].id
          }));
          await db.insert(assetCurrentPrices).values(pricesWithIds);
        }
        
        console.log(`      ✅ ${charImported}/${Math.min(total, 5000)} characters imported`);
        
        // Rate limit: 3000/day = 28.8 seconds between batches
        await new Promise(r => setTimeout(r, 30000));
        
      } catch (err: any) {
        console.error(`      ❌ Error at offset ${offset}: ${err.message}`);
        await new Promise(r => setTimeout(r, 60000));
      }
    }
    
    console.log(`\n   ✅ Marvel characters complete: ${charImported} imported\n`);
    
  } catch (err: any) {
    console.error(`   ❌ Marvel characters failed: ${err.message}\n`);
  }
  
  // Comics
  console.log('\n📚 IMPORTING MARVEL COMICS...\n');
  
  try {
    const firstBatch = await fetchMarvelComics(0);
    const total = firstBatch.data.total;
    console.log(`   Total Marvel comics: ${total.toLocaleString()}`);
    console.log(`   Importing in batches of 100...\n`);
    
    let comicImported = 0;
    
    for (let offset = 0; offset < Math.min(total, 5000); offset += 100) {
      try {
        console.log(`   📦 Fetching comics ${offset}-${offset + 100}...`);
        
        const data = await fetchMarvelComics(offset);
        const comics = data.data.results;
        
        const assetBatch: any[] = [];
        const priceBatch: any[] = [];
        
        for (const comic of comics) {
          const title = comic.title;
          const description = comic.description || `Marvel comic: ${title}`;
          const imageUrl = comic.thumbnail ? `${comic.thumbnail.path}.${comic.thumbnail.extension}` : null;
          const pageCount = comic.pageCount || 32;
          const issueNumber = comic.issueNumber || 0;
          
          const symbol = `MRVC${comic.id}`;
          const price = 80 + (pageCount * 2) + (issueNumber === 1 ? 500 : 0);
          const float = 100000 + Math.floor(Math.random() * 400000);
          
          assetBatch.push({
            symbol,
            name: title,
            type: 'comic',
            description: description.substring(0, 500),
            coverImageUrl: imageUrl,
            metadata: {
              marvelId: comic.id,
              publisher: 'Marvel Comics',
              issueNumber,
              pageCount,
              seriesName: comic.series?.name
            }
          });
          
          priceBatch.push({
            currentPrice: Math.min(price, 4000),
            totalMarketValue: price * float,
            totalFloat: float,
            sharesPerCopy: 100,
            scarcityModifier: 1.0 + Math.random() * 0.15,
            averageComicValue: price * 100,
            priceSource: 'Marvel-API',
            marketStatus: 'open',
            volume: Math.floor(Math.random() * 75000)
          });
          
          comicImported++;
        }
        
        if (assetBatch.length > 0) {
          const insertedAssets = await db.insert(assets).values(assetBatch).returning();
          const pricesWithIds = priceBatch.map((p, idx) => ({
            ...p,
            assetId: insertedAssets[idx].id
          }));
          await db.insert(assetCurrentPrices).values(pricesWithIds);
        }
        
        console.log(`      ✅ ${comicImported}/${Math.min(total, 5000)} comics imported`);
        
        // Rate limit
        await new Promise(r => setTimeout(r, 30000));
        
      } catch (err: any) {
        console.error(`      ❌ Error at offset ${offset}: ${err.message}`);
        await new Promise(r => setTimeout(r, 60000));
      }
    }
    
    console.log(`\n   ✅ Marvel comics complete: ${comicImported} imported\n`);
    
  } catch (err: any) {
    console.error(`   ❌ Marvel comics failed: ${err.message}\n`);
  }
  
  console.log(`\n\n🏁 MARVEL API BATCH COMPLETE!`);
  console.log(`   All Marvel data imported with official API!`);
}

batchImportMarvel().catch(console.error).finally(() => process.exit());
