#!/usr/bin/env tsx
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';
import { eq, and, or, sql } from 'drizzle-orm';

const db = drizzle(neon(process.env.DATABASE_URL!));

async function smartRealPricing() {
  console.log('💰 SMART REAL PRICING WORKER - STARTING\n');
  console.log('🎯 Strategy: Target high-value tradeable assets\n');

  let totalPriced = 0;
  let totalSkipped = 0;
  const startTime = Date.now();

  // PHASE 1: Comics (most tradeable, have real pricing data)
  console.log('📚 PHASE 1: Processing COMICS (top 1000)...\n');
  
  const comics = await db.select()
    .from(assets)
    .where(eq(assets.type, 'comic'))
    .limit(1000);

  for (const asset of comics) {
    try {
      const result = await weightedMarketCapService.calculateWeightedPricing(
        asset.name,
        100 // shares per copy
      );
      
      if (result && result.sharePrice >= 10 && result.sharePrice <= 10000) {
        const existing = await db.select()
          .from(assetCurrentPrices)
          .where(eq(assetCurrentPrices.assetId, asset.id))
          .limit(1);
        
        const priceData = {
          assetId: asset.id,
          currentPrice: result.sharePrice.toString(),
          totalMarketValue: result.totalMarketValue.toString(),
          totalFloat: result.totalFloat,
          sharesPerCopy: result.sharesPerCopy,
          censusDistribution: result.censusDistribution,
          scarcityModifier: result.scarcityModifier.toString(),
          averageComicValue: result.averageComicValue.toString(),
          priceSource: 'PriceCharting+GoCollect',
          marketStatus: 'open',
          volume: 0,
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
        if (totalPriced % 10 === 0) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          const rate = (totalPriced / (Date.now() - startTime) * 1000).toFixed(1);
          console.log(`✅ ${totalPriced} priced | ${rate}/s | ${elapsed}s elapsed`);
        }
      } else {
        totalSkipped++;
      }
      
      // Rate limit: 1.5s per request (safe for API limits)
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (err: any) {
      totalSkipped++;
      if (totalSkipped % 50 === 0) {
        console.log(`⏭️  Skipped ${totalSkipped} (no data available)`);
      }
    }
  }

  console.log(`\n✅ PHASE 1 COMPLETE: ${totalPriced} comics priced, ${totalSkipped} skipped`);
  
  // PHASE 2: Top characters (by name recognition)
  console.log(`\n👥 PHASE 2: Processing TOP CHARACTERS (500)...\n`);
  
  const topCharacters = await db.select()
    .from(assets)
    .where(eq(assets.type, 'character'))
    .limit(500);

  let phase2Priced = 0;
  for (const asset of topCharacters) {
    try {
      const result = await weightedMarketCapService.calculateWeightedPricing(
        asset.name,
        100
      );
      
      if (result && result.sharePrice >= 10 && result.sharePrice <= 10000) {
        const existing = await db.select()
          .from(assetCurrentPrices)
          .where(eq(assetCurrentPrices.assetId, asset.id))
          .limit(1);
        
        const priceData = {
          assetId: asset.id,
          currentPrice: result.sharePrice.toString(),
          totalMarketValue: result.totalMarketValue.toString(),
          totalFloat: result.totalFloat,
          sharesPerCopy: result.sharesPerCopy,
          censusDistribution: result.censusDistribution,
          scarcityModifier: result.scarcityModifier.toString(),
          averageComicValue: result.averageComicValue.toString(),
          priceSource: 'PriceCharting+GoCollect',
          marketStatus: 'open',
          volume: 0,
          updatedAt: new Date()
        };
        
        if (existing.length > 0) {
          await db.update(assetCurrentPrices)
            .set(priceData)
            .where(eq(assetCurrentPrices.assetId, asset.id));
        } else {
          await db.insert(assetCurrentPrices).values(priceData);
        }
        
        phase2Priced++;
        totalPriced++;
        if (totalPriced % 10 === 0) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          const rate = (totalPriced / (Date.now() - startTime) * 1000).toFixed(1);
          console.log(`✅ ${totalPriced} priced | ${rate}/s | ${elapsed}s elapsed`);
        }
      } else {
        totalSkipped++;
      }
      
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (err: any) {
      totalSkipped++;
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n🏁 SMART REAL PRICING COMPLETE!`);
  console.log(`   ✅ ${totalPriced} assets with REAL pricing`);
  console.log(`   ⏭️  ${totalSkipped} skipped (no data)`);
  console.log(`   ⏱️  ${totalElapsed} minutes`);
}

smartRealPricing().catch(console.error).finally(() => process.exit());
