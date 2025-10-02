#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';
import path from 'path';

// Fast pricing formula based on popularity
function calculateFastPrice(appearances: number, year: number): number {
  const basePrice = 50;
  const maxPrice = 5000;
  
  // More appearances = higher price
  const popularityMultiplier = Math.min(appearances / 100, 50);
  
  // Older = rarer = more expensive
  const currentYear = 2025;
  const age = Math.max(0, currentYear - year);
  const ageMultiplier = Math.min(age / 10, 20);
  
  const price = basePrice + (popularityMultiplier * 30) + (ageMultiplier * 50);
  
  return Math.min(Math.max(price, 50), maxPrice);
}

async function fastBulkPricing() {
  console.log('⚡ FAST BULK PRICING - 10K assets in minutes...\n');
  
  // Load Kaggle data
  const manifestPath = path.join(process.cwd(), 'data', 'kaggle-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  const targetAssets = 10000;
  let created = 0;
  const batchSize = 1000;
  
  for (const file of manifest.files) {
    if (created >= targetAssets) break;
    
    console.log(`\n📦 Processing: ${file.file}...`);
    const filePath = path.join(process.cwd(), 'data', file.file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const record of data) {
      if (created >= targetAssets) break;
      
      const name = record.name || record.title || `Character-${created}`;
      const symbol = name.substring(0, 8).toUpperCase().replace(/[^A-Z]/g, '') || `CHAR${created}`;
      const appearances = parseInt(record.APPEARANCES) || 10;
      const year = parseInt(record.YEAR) || 2000;
      
      const price = calculateFastPrice(appearances, year);
      const float = 100000 + Math.floor(Math.random() * 900000);
      const marketValue = price * float;
      
      assetBatch.push({
        symbol: symbol + created,
        name,
        type: 'character',
        description: `${name} - ${appearances} appearances since ${year}`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: marketValue,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 1.0,
        averageComicValue: price * 100,
        priceSource: 'Kaggle-FastFormula',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 10000)
      });
      
      created++;
      
      if (assetBatch.length >= batchSize) {
        // Bulk insert
        const insertedAssets = await db.insert(assets).values(assetBatch).returning();
        
        // Add asset IDs to prices
        const pricesWithIds = priceBatch.map((p, idx) => ({
          ...p,
          assetId: insertedAssets[idx].id
        }));
        
        await db.insert(assetCurrentPrices).values(pricesWithIds);
        
        console.log(`  ✅ Created ${assetBatch.length} assets (Total: ${created})`);
        
        assetBatch.length = 0;
        priceBatch.length = 0;
      }
    }
    
    // Insert remaining
    if (assetBatch.length > 0) {
      const insertedAssets = await db.insert(assets).values(assetBatch).returning();
      const pricesWithIds = priceBatch.map((p, idx) => ({
        ...p,
        assetId: insertedAssets[idx].id
      }));
      await db.insert(assetCurrentPrices).values(pricesWithIds);
      console.log(`  ✅ Created ${assetBatch.length} assets (Total: ${created})`);
    }
  }
  
  console.log(`\n\n🏁 CREATED ${created} ASSETS WITH PRICES IN MINUTES!`);
  console.log(`   Price range: $50 - $5,000/share`);
  console.log(`   Based on: Appearance count + debut year`);
}

fastBulkPricing().catch(console.error).finally(() => process.exit());
