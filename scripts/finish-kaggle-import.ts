#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

async function finishImport() {
  console.log('📦 FINISHING KAGGLE IMPORT...\n');
  
  const manifest = JSON.parse(fs.readFileSync('data/kaggle-downloads.json', 'utf-8'));
  const heroPath = manifest[2].path;
  
  const heroesCsv = fs.readFileSync(path.join(heroPath, 'heroes_information.csv'), 'utf-8');
  const heroesRecords = parse(heroesCsv, { columns: true, skip_empty_lines: true });
  
  console.log(`📦 Importing ${heroesRecords.length} heroes...\n`);
  
  let imported = 0;
  const batchSize = 1000;
  
  for (let i = 0; i < heroesRecords.length; i += batchSize) {
    const batch = heroesRecords.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const record of batch) {
      const name = record.name || `Hero-${imported}`;
      const publisher = record.Publisher || 'Unknown';
      const symbol = `HERO${Date.now()}${imported}`;
      const price = 50 + Math.random() * 950;
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol,
        name,
        type: 'character',
        description: `${name} (${publisher})`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 0.9 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'Kaggle-SuperheroSet',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 10000)
      });
      
      imported++;
    }
    
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    await db.insert(assetCurrentPrices).values(pricesWithIds);
    
    console.log(`✅ ${imported} / ${heroesRecords.length} heroes imported`);
  }
  
  console.log(`\n🏁 IMPORT COMPLETE: ${imported} heroes!`);
}

finishImport().catch(console.error).finally(() => process.exit());
