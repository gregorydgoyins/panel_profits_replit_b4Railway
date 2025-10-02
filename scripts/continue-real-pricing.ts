#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import { weightedMarketCapService } from '../server/services/weightedMarketCapService.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function continueRealPricing() {
  console.log('💰 CONTINUING REAL PRICING (Running in background)...\n');
  
  const csvPath = 'attached_assets/comic_characters_1759075358597.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  const topCharacters = records
    .filter((r: any) => r.Appearances && parseInt(r.Appearances) > 30)
    .sort((a: any, b: any) => parseInt(b.Appearances) - parseInt(a.Appearances))
    .slice(0, 500);
  
  console.log(`🎯 Processing TOP 500 characters with REAL pricing`);
  console.log(`   This will run for ~12 minutes\n`);
  
  let created = 0;
  let skipped = 0;
  
  for (const record of topCharacters) {
    try {
      const name = record.Name;
      const appearances = parseInt(record.Appearances);
      
      const pricing = await weightedMarketCapService.calculateWeightedPricing(name, 100);
      
      if (pricing && pricing.sharePrice >= 10 && pricing.sharePrice <= 10000) {
        const symbol = name.substring(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, '') + created;
        
        const asset = await db.insert(assets).values({
          symbol,
          name,
          type: 'character',
          description: `${name} - ${appearances} appearances`
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
        if (created % 10 === 0) {
          console.log(`✅ ${created} real prices created...`);
        }
      } else {
        skipped++;
      }
      
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (err: any) {
      skipped++;
    }
  }
  
  console.log(`\n🏁 Created ${created} assets with REAL prices (skipped ${skipped})`);
}

continueRealPricing().catch(console.error).finally(() => process.exit());
