#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function realPricingImport() {
  console.log('💰 IMPORTING WITH REAL PRICECHARTING + GOCOLLECT PRICING...\n');
  
  const csvPath = 'attached_assets/comic_characters_1759075358597.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  // Take top 100 most popular characters
  const topCharacters = records
    .filter((r: any) => r.Appearances && parseInt(r.Appearances) > 50)
    .sort((a: any, b: any) => parseInt(b.Appearances) - parseInt(a.Appearances))
    .slice(0, 100);
  
  console.log(`🎯 Processing TOP 100 characters with REAL API pricing`);
  console.log(`   This will take ~2.5 minutes (1.5s per asset)\n`);
  
  let created = 0;
  let failed = 0;
  
  for (const record of topCharacters) {
    try {
      const name = record.Name;
      const appearances = parseInt(record.Appearances);
      const universe = record.Universe;
      
      console.log(`\n📖 [${created + 1}/100] ${name} (${appearances} appearances)...`);
      
      // Get REAL pricing from PriceCharting + GoCollect
      const pricing = await weightedMarketCapService.calculateWeightedPricing(name, 100);
      
      if (pricing && pricing.sharePrice >= 10 && pricing.sharePrice <= 10000) {
        const symbol = name.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, '') || `CHAR${created}`;
        
        const asset = await db.insert(assets).values({
          symbol: `${symbol}.${created}`,
          name,
          type: 'character',
          description: `${name} (${universe}) - ${appearances} appearances - REAL pricing from PriceCharting`
        }).returning();
        
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
        console.log(`  ✅ ${asset[0].symbol}: $${pricing.sharePrice.toFixed(2)}/share (REAL)`);
      } else {
        console.log(`  ⏭️  Skipped (no pricing data or out of range)`);
        failed++;
      }
      
      // Rate limit: 1.5s between requests
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (err: any) {
      console.error(`  ❌ Error: ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n\n🏁 COMPLETE!`);
  console.log(`   Created: ${created} assets with REAL prices`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Source: PriceCharting API + GoCollect API`);
}

realPricingImport().catch(console.error).finally(() => process.exit());
