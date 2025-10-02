#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices, marketData } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';
import { eq, inArray, sql } from 'drizzle-orm';

async function cleanAndReprice() {
  console.log('🧹 Cleaning assets and repricing with REAL data...\n');
  
  // Step 1: Get clean assets worth keeping
  const cleanAssets = await db.execute(sql`
    SELECT id, name, symbol, type
    FROM assets
    WHERE name ~ '^[A-Z][a-zA-Z\s\-#0-9:'']+$'
      AND name NOT LIKE '%Asset-%'
      AND name NOT LIKE '%.md%'
      AND name NOT LIKE '%(Earth-%'
      AND name NOT LIKE '%Costume%'
      AND name NOT LIKE '%Origin%'
      AND name NOT LIKE '%Golden Age%'
      AND name NOT LIKE '%Modern Age%'
      AND LENGTH(name) < 80
      AND LENGTH(name) > 3
    ORDER BY name
    LIMIT 500
  `);
  
  console.log(`✅ Found ${cleanAssets.rows.length} clean assets to keep\n`);
  
  // Step 2: Price them with REAL formula
  let priced = 0;
  let failed = 0;
  
  for (const asset of cleanAssets.rows) {
    try {
      console.log(`\n💰 Pricing: ${asset.name} (${asset.symbol})...`);
      
      const result = await weightedMarketCapService.calculateWeightedPricing(
        asset.name,
        100
      );
      
      if (result && result.sharePrice >= 1 && result.sharePrice <= 10000) {
        await db.insert(assetCurrentPrices).values({
          assetId: asset.id,
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
        });
        
        priced++;
        console.log(`  ✅ $${result.sharePrice.toFixed(2)}/share | TMV: $${result.totalMarketValue.toLocaleString()}`);
      } else {
        failed++;
        console.log(`  ⏭️  Skipped (no valid price data)`);
      }
      
      // Rate limit
      await new Promise(r => setTimeout(r, 1200));
      
    } catch (err) {
      failed++;
      console.error(`  ❌ Error:`, err.message);
    }
  }
  
  console.log(`\n\n🏁 COMPLETE:`);
  console.log(`   ✅ ${priced} assets priced with REAL data`);
  console.log(`   ⏭️  ${failed} assets skipped`);
  console.log(`\n💡 Now delete all garbage assets manually if needed`);
}

cleanAndReprice().catch(console.error).finally(() => process.exit());
