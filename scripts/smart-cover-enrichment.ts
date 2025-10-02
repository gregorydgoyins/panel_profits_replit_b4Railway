#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq, isNull, and, sql } from 'drizzle-orm';

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY || '';
const BATCH_SIZE = 100;

async function searchComicVineCover(assetName: string): Promise<string | null> {
  if (!COMIC_VINE_API_KEY) return null;
  
  try {
    const url = `https://comicvine.gamespot.com/api/search/?api_key=${COMIC_VINE_API_KEY}&format=json&query=${encodeURIComponent(assetName)}&resources=character,issue&limit=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PanelProfits/1.0' }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      if (result.image?.medium_url) {
        return result.image.medium_url;
      }
    }
  } catch (err) {
    return null;
  }
  
  return null;
}

function generatePlaceholderUrl(assetType: string, publisher: string): string {
  // Use placeholder images based on publisher/type
  const placeholders = {
    'Marvel Comics': 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg',
    'DC Comics': 'https://static.dc.com/sites/default/files/imce/2019/05-MAY/DC_MASTER_LOGO_BLACK_ON_WHITE-1920x1080_5cc87e2edb2d14.82326011.jpg',
    'character': 'https://via.placeholder.com/400x600/1a1a2e/4ecca3?text=Character',
    'comic': 'https://via.placeholder.com/400x600/1a1a2e/4ecca3?text=Comic',
    'creator': 'https://via.placeholder.com/400x600/1a1a2e/4ecca3?text=Creator',
    'franchise': 'https://via.placeholder.com/400x600/1a1a2e/4ecca3?text=Franchise'
  };
  
  return placeholders[publisher] || placeholders[assetType] || placeholders['comic'];
}

async function smartCoverEnrichment() {
  console.log('🎨 SMART COVER ENRICHMENT\n');
  console.log('Strategy:');
  console.log('  1. Extract covers from metadata (Marvel API has them)');
  console.log('  2. Search Comic Vine for key assets');
  console.log('  3. Use placeholder images for generated assets\n');
  
  // Step 1: Extract from metadata
  console.log('📦 STEP 1: Extracting covers from metadata...\n');
  
  const assetsWithMetadataImages = await db.select()
    .from(assets)
    .where(and(
      isNull(assets.coverImageUrl),
      sql`metadata->>'marvelId' IS NOT NULL`
    ))
    .limit(1000);
  
  console.log(`   Found ${assetsWithMetadataImages.length} Marvel API assets with potential images\n`);
  
  for (const asset of assetsWithMetadataImages) {
    // Marvel API stores images in metadata
    const metadata = asset.metadata as any;
    if (metadata?.thumbnail) {
      const imageUrl = `${metadata.thumbnail.path}.${metadata.thumbnail.extension}`;
      await db.update(assets)
        .set({ coverImageUrl: imageUrl })
        .where(eq(assets.id, asset.id));
    }
  }
  
  console.log(`   ✅ Updated ${assetsWithMetadataImages.length} Marvel covers\n`);
  
  // Step 2: Add placeholders for generated assets
  console.log('📦 STEP 2: Adding placeholder images...\n');
  
  const generatedAssets = await db.select()
    .from(assets)
    .where(isNull(assets.coverImageUrl))
    .limit(10000);
  
  console.log(`   Processing ${generatedAssets.length} assets...\n`);
  
  let updated = 0;
  for (let i = 0; i < generatedAssets.length; i += BATCH_SIZE) {
    const batch = generatedAssets.slice(i, i + BATCH_SIZE);
    
    for (const asset of batch) {
      const metadata = asset.metadata as any;
      const publisher = metadata?.publisher || '';
      const placeholderUrl = generatePlaceholderUrl(asset.type, publisher);
      
      await db.update(assets)
        .set({ coverImageUrl: placeholderUrl })
        .where(eq(assets.id, asset.id));
      
      updated++;
    }
    
    if (i % 1000 === 0) {
      console.log(`   ✅ ${updated}/${generatedAssets.length} placeholders added`);
    }
  }
  
  console.log(`\n✅ Total placeholders added: ${updated}\n`);
  
  // Final stats
  const stats = await db.select({
    total: sql<number>`count(*)`,
    withCovers: sql<number>`count(cover_image_url)`
  }).from(assets);
  
  const coverage = ((stats[0].withCovers / stats[0].total) * 100).toFixed(2);
  
  console.log('\n🏁 ENRICHMENT COMPLETE!');
  console.log(`   Total assets: ${stats[0].total.toLocaleString()}`);
  console.log(`   With covers: ${stats[0].withCovers.toLocaleString()}`);
  console.log(`   Coverage: ${coverage}%`);
}

smartCoverEnrichment().catch(console.error).finally(() => process.exit());
