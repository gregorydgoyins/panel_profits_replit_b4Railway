#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';

const REAL_COMICS = [
  { name: 'Batman', symbol: 'BATMAN' },
  { name: 'Spider-Man', symbol: 'SPIDER' },
  { name: 'X-Men', symbol: 'XMEN' },
  { name: 'The Avengers', symbol: 'AVENG' },
  { name: 'Wolverine', symbol: 'WOLVR' },
  { name: 'Action Comics #1', symbol: 'AC1' },
  { name: 'Detective Comics #27', symbol: 'DC27' },
  { name: 'Amazing Spider-Man #1', symbol: 'ASM1' },
  { name: 'X-Men #1', symbol: 'XMEN1' },
  { name: 'Fantastic Four #1', symbol: 'FF1' },
  { name: 'Incredible Hulk #1', symbol: 'HULK1' },
  { name: 'Iron Man', symbol: 'IRON' },
  { name: 'Captain America', symbol: 'CAP' },
  { name: 'Thor', symbol: 'THOR' },
  { name: 'Daredevil', symbol: 'DD' },
  { name: 'Superman', symbol: 'SUPER' },
  { name: 'Wonder Woman', symbol: 'WW' },
  { name: 'Flash', symbol: 'FLASH' },
  { name: 'Green Lantern', symbol: 'GL' },
  { name: 'Justice League', symbol: 'JL' }
];

async function createRealAssets() {
  console.log('🦸 Creating 20 REAL comics with REAL prices...\n');
  
  let created = 0;
  
  for (const comic of REAL_COMICS) {
    try {
      console.log(`\n📖 ${comic.name}...`);
      
      // Calculate REAL price
      const pricing = await weightedMarketCapService.calculateWeightedPricing(comic.name, 100);
      
      if (pricing && pricing.sharePrice >= 10 && pricing.sharePrice <= 10000) {
        // Create asset
        const asset = await db.insert(assets).values({
          symbol: comic.symbol,
          name: comic.name,
          type: 'comic',
          description: `${comic.name} comic book`
        }).returning();
        
        // Create price
        await db.insert(assetCurrentPrices).values({
          assetId: asset[0].id,
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          sharesPerCopy: pricing.sharesPerCopy,
          censusDistribution: pricing.censusDistribution,
          scarcityModifier: pricing.scarcityModifier,
          averageComicValue: pricing.averageComicValue,
          priceSource: 'PriceCharting+GoCollect',
          marketStatus: 'open',
          volume: 0
        });
        
        created++;
        console.log(`  ✅ ${comic.symbol}: $${pricing.sharePrice.toFixed(2)}/share`);
      } else {
        console.log(`  ⏭️  Skipped (price out of range or unavailable)`);
      }
      
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }
  
  console.log(`\n\n🏁 Created ${created}/20 comics with REAL prices!`);
}

createRealAssets().catch(console.error).finally(() => process.exit());
