#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

function calculateVillainPrice(appearances: number, year: number): number {
  const basePrice = 75; // Villains start higher
  const popularityBonus = Math.min(appearances * 3, 1200);
  const age = Math.max(0, 2025 - year);
  const ageBonus = Math.min(age * 6, 600);
  return Math.min(Math.max(basePrice + popularityBonus + ageBonus, 75), 5000);
}

async function importVillains() {
  console.log('😈 IMPORTING SUPERVILLAINS FROM ALL DATASETS...\n');
  
  // FiveThirtyEight Marvel
  const marvelPath = '/home/runner/.cache/kagglehub/datasets/fivethirtyeight/fivethirtyeight-comic-characters-dataset/versions/111/marvel-wikia-data.csv';
  const marvelCsv = fs.readFileSync(marvelPath, 'utf-8');
  const marvelRecords = parse(marvelCsv, { columns: true, skip_empty_lines: true });
  
  const marvelVillains = marvelRecords.filter((r: any) => 
    r.ALIGN && (r.ALIGN.toLowerCase().includes('bad') || r.ALIGN.toLowerCase().includes('evil'))
  );
  
  console.log(`😈 Marvel Villains: ${marvelVillains.length}`);
  
  // FiveThirtyEight DC
  const dcPath = '/home/runner/.cache/kagglehub/datasets/fivethirtyeight/fivethirtyeight-comic-characters-dataset/versions/111/dc-wikia-data.csv';
  const dcCsv = fs.readFileSync(dcPath, 'utf-8');
  const dcRecords = parse(dcCsv, { columns: true, skip_empty_lines: true });
  
  const dcVillains = dcRecords.filter((r: any) => 
    r.ALIGN && (r.ALIGN.toLowerCase().includes('bad') || r.ALIGN.toLowerCase().includes('evil'))
  );
  
  console.log(`😈 DC Villains: ${dcVillains.length}`);
  
  // Superhero Set
  const heroPath = '/home/runner/.cache/kagglehub/datasets/claudiodavi/superhero-set/versions/1/heroes_information.csv';
  const heroCsv = fs.readFileSync(heroPath, 'utf-8');
  const heroRecords = parse(heroCsv, { columns: true, skip_empty_lines: true });
  
  const superheroVillains = heroRecords.filter((r: any) => 
    r.Alignment && r.Alignment.toLowerCase().includes('bad')
  );
  
  console.log(`😈 Superhero Set Villains: ${superheroVillains.length}\n`);
  
  const allVillains = [...marvelVillains, ...dcVillains, ...superheroVillains];
  console.log(`😈 TOTAL VILLAINS TO IMPORT: ${allVillains.length}\n`);
  
  let imported = 0;
  const batchSize = 1000;
  
  for (let i = 0; i < allVillains.length; i += batchSize) {
    const batch = allVillains.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const villain of batch) {
      const name = villain.name || villain.Name || `Villain-${imported}`;
      const appearances = parseInt(villain.APPEARANCES || villain.Appearances) || 1;
      const year = parseInt(villain.YEAR || villain.Year) || 1980;
      const align = villain.ALIGN || villain.Alignment || 'Bad';
      
      const symbol = `VIL${Date.now()}${imported}`;
      const price = calculateVillainPrice(appearances, year);
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol,
        name,
        type: 'character',
        description: `😈 ${name} - VILLAIN (${align}) - ${appearances} appearances since ${year}`
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 1.1 + Math.random() * 0.2, // Villains more scarce
        averageComicValue: price * 100,
        priceSource: 'Kaggle-Villains',
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
    
    console.log(`✅ ${imported} / ${allVillains.length} villains imported`);
  }
  
  console.log(`\n🏁 IMPORTED ${imported} SUPERVILLAINS!`);
}

importVillains().catch(console.error).finally(() => process.exit());
