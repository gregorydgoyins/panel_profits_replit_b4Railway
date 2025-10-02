#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';
import { eq } from 'drizzle-orm';

async function repriceAllAssets() {
  console.log('💰 Starting asset repricing with REAL formula...\n');
  
  // Get all assets with prices (limit to batches to avoid overwhelming APIs)
  const batch_size = 100;
  let offset = 0;
  let totalPriced = 0;
  let totalSkipped = 0;
  
  while (true) {
    const assetBatch = await db.select()
      .from(assets)
      .limit(batch_size)
      .offset(offset);
    
    if (assetBatch.length === 0) break;
    
    console.log(`\n📦 Processing batch ${offset/batch_size + 1} (${assetBatch.length} assets)...`);
    
    for (const asset of assetBatch) {
      try {
        // Calculate real pricing using PriceCharting + GoCollect
        const result = await weightedMarketCapService.calculateWeightedPricing(
          asset.name,
          100 // shares per copy
        );
        
        if (result) {
          // Update asset_current_prices with real data
          const existing = await db.select()
            .from(assetCurrentPrices)
            .where(eq(assetCurrentPrices.assetId, asset.id))
            .limit(1);
          
          const priceData = {
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
            updatedAt: new Date()
          };
          
          if (existing.length > 0) {
            await db.update(assetCurrentPrices)
              .set(priceData)
              .where(eq(assetCurrentPrices.assetId, asset.id));
          } else {
            await db.insert(assetCurrentPrices).values(priceData);
          }
          
          totalPriced++;
          console.log(`  ✅ ${asset.symbol}: $${result.sharePrice.toFixed(2)}/share (TMV: $${result.totalMarketValue.toLocaleString()})`);
        } else {
          totalSkipped++;
          console.log(`  ⏭️  ${asset.symbol}: No pricing data available`);
        }
        
        // Rate limit: 1 request per second (PriceCharting limit)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        totalSkipped++;
        console.error(`  ❌ ${asset.symbol}:`, err.message);
      }
    }
    
    offset += batch_size;
    console.log(`\n📊 Progress: ${totalPriced} priced, ${totalSkipped} skipped`);
  }
  
  console.log(`\n🏁 COMPLETE: ${totalPriced} assets repriced with real formula!`);
}

repriceAllAssets().catch(console.error).finally(() => process.exit());
