#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

const BATCH_SIZE = 1000; // Reduced from 5000 to avoid "value too large"
const TOTAL_TO_GENERATE = 320000;

// Diverse publishers
const PUBLISHERS = [
  'DC Comics', 'Marvel Comics', 'Image Comics', 'Dark Horse', 'IDW Publishing',
  'Boom! Studios', 'Dynamite', 'Valiant', 'Archie Comics', 'Aftershock',
  'Shueisha', 'Kodansha', 'Shogakukan', 'Square Enix', 'Hakusensha',
  'Dupuis', 'Dargaud', 'Casterman', 'Le Lombard', 'Glénat',
  'Vertigo', 'WildStorm', 'Top Cow', 'CrossGen', 'Zenescope',
  'Avatar Press', 'Black Mask', 'Rebellion', '2000 AD', 'Titan Comics'
];

const TYPES = ['character', 'comic', 'creator', 'franchise'];
const GENRES = ['superhero', 'sci-fi', 'fantasy', 'horror', 'crime', 'western', 'manga', 'bd'];

function generateAssetName(index: number): string {
  const prefixes = ['The', 'Super', 'Dark', 'Mega', 'Ultra', 'Neo', 'Cyber', 'Iron', 'Silver', 'Golden'];
  const middles = ['Shadow', 'Thunder', 'Dragon', 'Phoenix', 'Warrior', 'Knight', 'Phantom', 'Storm', 'Blade', 'Viper'];
  const suffixes = ['Chronicles', 'Legacy', 'Origins', 'Unlimited', 'Prime', 'Force', 'Squad', 'Tales', 'Saga', 'Adventures'];
  
  const prefix = prefixes[index % prefixes.length];
  const middle = middles[Math.floor(index / 100) % middles.length];
  const suffix = suffixes[Math.floor(index / 1000) % suffixes.length];
  
  return `${prefix} ${middle} ${suffix} #${index}`;
}

function calculatePrice(type: string, popularity: number): number {
  // Target range: $50-$6000 as per user requirements
  let basePrice: number;
  
  if (type === 'character') {
    basePrice = 150 + (popularity * 2000); // $150-$2150
  } else if (type === 'comic') {
    basePrice = 80 + (popularity * 1500); // $80-$1580
  } else if (type === 'creator') {
    basePrice = 200 + (popularity * 2500); // $200-$2700
  } else { // franchise
    basePrice = 300 + (popularity * 3000); // $300-$3300
  }
  
  // Add variance
  const variance = (Math.random() - 0.5) * 400;
  const finalPrice = Math.max(50, Math.min(6000, basePrice + variance));
  
  return parseFloat(finalPrice.toFixed(2));
}

async function generate320kAssets() {
  console.log('🚀 GENERATING 320,000 MORE ASSETS!\n');
  console.log(`📊 Batch size: ${BATCH_SIZE.toLocaleString()}`);
  console.log(`🎯 Total batches: ${(TOTAL_TO_GENERATE / BATCH_SIZE).toLocaleString()}`);
  console.log(`💰 Price range: $50-$6,000\n`);
  
  let generated = 0;
  const startTime = Date.now();
  
  for (let batch = 0; batch < TOTAL_TO_GENERATE / BATCH_SIZE; batch++) {
    const batchStart = Date.now();
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (let i = 0; i < BATCH_SIZE; i++) {
      const index = batch * BATCH_SIZE + i;
      const publisher = PUBLISHERS[index % PUBLISHERS.length];
      const type = TYPES[index % TYPES.length];
      const genre = GENRES[index % GENRES.length];
      const popularity = Math.random();
      
      const symbol = `GEN${index}`;
      const name = generateAssetName(index);
      const price = calculatePrice(type, popularity);
      const float = 100000 + Math.floor(Math.random() * 900000); // 100K-1M shares
      
      assetBatch.push({
        symbol,
        name,
        type,
        description: `${name} - ${publisher} ${genre} ${type}`,
        metadata: {
          publisher,
          genre,
          generationBatch: batch
        }
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: parseFloat((0.90 + Math.random() * 0.30).toFixed(3)),
        averageComicValue: price * 100,
        priceSource: 'MassGeneration-2',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 100000)
      });
      
      generated++;
    }
    
    // Insert batch
    try {
      const insertedAssets = await db.insert(assets).values(assetBatch).returning();
      const pricesWithIds = priceBatch.map((p, idx) => ({
        ...p,
        assetId: insertedAssets[idx].id
      }));
      await db.insert(assetCurrentPrices).values(pricesWithIds);
      
      const batchTime = ((Date.now() - batchStart) / 1000).toFixed(2);
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
      const rate = (generated / (Date.now() - startTime) * 1000).toFixed(0);
      const remaining = TOTAL_TO_GENERATE - generated;
      const eta = ((remaining / parseInt(rate)) / 60).toFixed(1);
      
      console.log(`✅ Batch ${(batch + 1).toString().padStart(3)}/${TOTAL_TO_GENERATE / BATCH_SIZE}: ${generated.toLocaleString().padStart(7)}/${TOTAL_TO_GENERATE.toLocaleString()} (${batchTime.padStart(5)}s) | ${rate.padStart(4)}/s | ETA: ${eta}m`);
    } catch (err: any) {
      console.error(`❌ Batch ${batch + 1} failed: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  
  console.log(`\n\n🏁 GENERATION COMPLETE!`);
  console.log(`   Generated: ${generated.toLocaleString()} assets`);
  console.log(`   Total time: ${totalTime} minutes`);
  console.log(`   Price range: $50-$6,000`);
  console.log(`   All assets priced and ready to trade!`);
}

generate320kAssets().catch(console.error).finally(() => process.exit());
