#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

function calculatePrice(appearances: number, firstYear: number): number {
  const basePrice = 50;
  
  // More appearances = higher price
  const popularityBonus = Math.min(appearances * 2, 1000);
  
  // Older = rarer = more valuable
  const age = 2025 - firstYear;
  const ageBonus = Math.min(age * 5, 500);
  
  const price = basePrice + popularityBonus + ageBonus;
  return Math.min(Math.max(price, 50), 5000);
}

async function importKaggleCharacters() {
  console.log('📊 Importing FiveThirtyEight Comic Characters Dataset...\n');
  
  const csvPath = 'attached_assets/comic_characters_1759075358597.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  console.log(`✅ Found ${records.length} characters in CSV\n`);
  
  const batchSize = 1000;
  let imported = 0;
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const record of batch) {
      const name = record.Name || `Character-${imported}`;
      const appearances = parseInt(record.Appearances) || 1;
      const firstYear = parseInt(record.First_appeared?.split(',')[0]) || 2000;
      const universe = record.Universe || 'Unknown';
      const alignment = record.Alignment || 'Neutral';
      
      const symbol = name.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '') || `CHAR${imported}`;
      const price = calculatePrice(appearances, firstYear);
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol: `${symbol}${imported}`,
        name,
        type: 'character',
        description: `${name} (${universe}) - ${appearances} appearances since ${firstYear} - ${alignment}`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 0.9 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'Kaggle-FiveThirtyEight',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 10000)
      });
      
      imported++;
    }
    
    // Insert
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    await db.insert(assetCurrentPrices).values(pricesWithIds);
    
    console.log(`✅ Imported ${imported} / ${records.length} characters`);
  }
  
  console.log(`\n🏁 COMPLETE! Imported ${imported} REAL characters from Kaggle!`);
  console.log(`   Source: FiveThirtyEight Comic Characters Dataset`);
  console.log(`   Price formula: Based on appearances + debut year`);
}

importKaggleCharacters().catch(console.error).finally(() => process.exit());
