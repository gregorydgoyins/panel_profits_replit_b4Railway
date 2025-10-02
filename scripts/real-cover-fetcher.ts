#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { sql, and, or, isNull } from 'drizzle-orm';
import crypto from 'crypto';

setInterval(() => {}, 1000);

const MARVEL_PUBLIC = process.env.MARVEL_API_PUBLIC_KEY!;
const MARVEL_PRIVATE = process.env.MARVEL_API_PRIVATE_KEY!;

function marvelAuth() {
  const ts = Date.now().toString();
  const hash = crypto.createHash('md5').update(ts + MARVEL_PRIVATE + MARVEL_PUBLIC).digest('hex');
  return { ts, hash };
}

async function getMarvelCover(name: string): Promise<string | null> {
  try {
    const { ts, hash } = marvelAuth();
    const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${MARVEL_PUBLIC}&hash=${hash}&name=${encodeURIComponent(name)}&limit=1`;
    
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.data?.results?.length > 0) {
      const char = data.data.results[0];
      if (char.thumbnail && !char.thumbnail.path.includes('image_not_available')) {
        return `${char.thumbnail.path}.${char.thumbnail.extension}`;
      }
    }
  } catch (e) {}
  return null;
}

async function getComicCover(name: string): Promise<string | null> {
  try {
    const { ts, hash } = marvelAuth();
    const url = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${MARVEL_PUBLIC}&hash=${hash}&title=${encodeURIComponent(name)}&limit=1`;
    
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.data?.results?.length > 0) {
      const comic = data.data.results[0];
      if (comic.thumbnail && !comic.thumbnail.path.includes('image_not_available')) {
        return `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
      }
    }
  } catch (e) {}
  return null;
}

async function fetchRealCovers() {
  console.log('🎨 REAL COVER FETCHER - MARVEL API + FALLBACKS\n');
  
  let total = 0;
  let real = 0;
  let fallback = 0;
  const start = Date.now();
  
  while (true) {
    try {
      // Prioritize characters and comics without covers
      const batch = await db.select()
        .from(assets)
        .where(and(
          isNull(assets.coverImageUrl),
          or(
            sql`${assets.type} = 'character'`,
            sql`${assets.type} = 'comic'`
          )
        ))
        .limit(50);
      
      if (batch.length === 0) {
        console.log('✅ All priority assets have covers! Processing others...');
        
        // Process other types
        const others = await db.select()
          .from(assets)
          .where(isNull(assets.coverImageUrl))
          .limit(100);
        
        if (others.length === 0) {
          console.log('✅ ALL ASSETS HAVE COVERS! Waiting 60s...');
          await new Promise(r => setTimeout(r, 60000));
          continue;
        }
        
        // Add placeholders for non-priority
        for (const a of others) {
          const text = encodeURIComponent(a.name.substring(0, 20));
          const url = `https://via.placeholder.com/400x600/801336/ee4540?text=${text}`;
          
          await db.update(assets)
            .set({ coverImageUrl: url })
            .where(sql`id = ${a.id}`);
          
          total++;
          fallback++;
        }
        
        continue;
      }
      
      // Fetch real covers
      for (const asset of batch) {
        let coverUrl: string | null = null;
        
        // Try Marvel API
        if (asset.type === 'character') {
          coverUrl = await getMarvelCover(asset.name);
        } else if (asset.type === 'comic') {
          coverUrl = await getComicCover(asset.name);
        }
        
        // Fallback to robohash/placeholder
        if (!coverUrl) {
          if (asset.type === 'character') {
            coverUrl = `https://robohash.org/${asset.id}?set=set2&size=400x600`;
          } else {
            const text = encodeURIComponent(asset.name.substring(0, 20));
            coverUrl = `https://via.placeholder.com/400x600/2d132c/ee4540?text=${text}`;
          }
          fallback++;
        } else {
          real++;
        }
        
        await db.update(assets)
          .set({ coverImageUrl: coverUrl })
          .where(sql`id = ${asset.id}`);
        
        total++;
        
        // Marvel rate limit: 3000/day = ~2.9/sec
        if (coverUrl && !coverUrl.includes('placeholder') && !coverUrl.includes('robohash')) {
          await new Promise(r => setTimeout(r, 350));
        }
      }
      
      const rate = (total / ((Date.now() - start) / 1000)).toFixed(1);
      console.log(`✅ ${total.toLocaleString()} | Real: ${real} | Fallback: ${fallback} | ${rate}/s`);
      
    } catch (e: any) {
      console.error(`❌ ${e.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

fetchRealCovers();
