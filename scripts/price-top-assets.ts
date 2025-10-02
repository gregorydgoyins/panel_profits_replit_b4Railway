#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';
import { eq } from 'drizzle-orm';

// Top comics to price with REAL data
const TOP_COMICS = [
  'Spider-Man',
  'Batman',
  'X-Men',
  'The Avengers',
  'Wolverine',
  'Amazing Spider-Man #1',
  'Action Comics #1',
  'Detective Comics #27',
  'X-Men #1',
  'Fantastic Four #1',
  'Incredible Hulk #1',
  'Iron Man #1',
  'Captain America',
  'Thor',
  'Daredevil',
  'Green Lantern',
  'Flash',
  'Wonder Woman',
  'Superman',
  'Justice League'
];

async function priceTopAssets() {
  console.log('💰 Pricing top comics with REAL formula...\n');
  
  let priced = 0;
  
  for (const comicName of TOP_COMICS) {
    try {
      console.log(`\n📖 ${comicName}...`);
      
      // Calculate REAL pricing
      const result = await weightedMarketCapService.calculateWeightedPricing(comicName, 100);
      
      if (result && result.sharePrice >= 10 && result.sharePrice <= 10000) {
        // Find or create asset
        let asset = await db.select().from(assets).where(eq(assets.name, comicName)).limit(1);
        
        if (asset.length === 0) {
          // Create new asset
          const symbol = comicName.substring(0, 6).toUpperCase().replace(/[^A-Z]/g, '');
          asset = await db.insert(assets).values({
            symbol,
            name: comicName,
            type: 'comic',
            description: `${comicName} comic book asset`
          }).returning();
        }
        
        // Insert price
        await db.insert(assetCurrentPrices).values({
          assetId: asset[0].id,
          currentPrice: result.sharePrice,
          totalMarketValue: result.totalMarketValue,
          totalFloat: result.totalFloat,
          sharesPerCopy: result.sharesPerCopy,
          censusDistribution: result.censusDistribution,
          scarcityModifier: result.scarcityModifier,
          averageComicValue: result.averageComicValue,
          priceSource: 'PriceCharting+GoCollect',
          marketStatus: 'open',
          volume: 0
        }).onConflictDoUpdate({
          target: [assetCurrentPrices.assetId],
          set: {
            currentPrice: result.sharePrice,
            totalMarketValue: result.totalMarketValue,
            totalFloat: result.totalFloat,
            updatedAt: new Date()
          }
        });
        
        priced++;
        console.log(`  ✅ $${result.sharePrice.toFixed(2)}/share | TMV: $${result.totalMarketValue.toLocaleString()}`);
      } else {
        console.log(`  ⏭️  No valid pricing`);
      }
      
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
    }
  }
  
  console.log(`\n\n🏁 Priced ${priced} comics with REAL data!`);
}

priceTopAssets().catch(console.error).finally(() => process.exit());
