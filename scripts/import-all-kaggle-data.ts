#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

function calculatePrice(appearances: number, year: number): number {
  const basePrice = 50;
  const popularityBonus = Math.min(appearances * 2, 1000);
  const age = Math.max(0, 2025 - year);
  const ageBonus = Math.min(age * 5, 500);
  return Math.min(Math.max(basePrice + popularityBonus + ageBonus, 50), 5000);
}

async function importAllKaggleData() {
  console.log('📊 IMPORTING ALL KAGGLE COMIC DATA...\n');
  
  const manifest = JSON.parse(fs.readFileSync('data/kaggle-downloads.json', 'utf-8'));
  
  let totalImported = 0;
  const batchSize = 1000;
  
  // 1. FIVETHIRTYEIGHT DATASET
  console.log('\n📖 DATASET 1: FiveThirtyEight Comic Characters\n');
  const ft538Path = manifest[0].path;
  
  // Marvel Wikia
  const marvelCsv = fs.readFileSync(path.join(ft538Path, 'marvel-wikia-data.csv'), 'utf-8');
  const marvelRecords = parse(marvelCsv, { columns: true, skip_empty_lines: true });
  console.log(`   📦 Marvel: ${marvelRecords.length} characters`);
  
  // DC Wikia
  const dcCsv = fs.readFileSync(path.join(ft538Path, 'dc-wikia-data.csv'), 'utf-8');
  const dcRecords = parse(dcCsv, { columns: true, skip_empty_lines: true });
  console.log(`   📦 DC: ${dcRecords.length} characters`);
  
  const allFT538 = [...marvelRecords, ...dcRecords];
  
  for (let i = 0; i < allFT538.length; i += batchSize) {
    const batch = allFT538.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const record of batch) {
      const name = record.Name || record.name || `Character-${totalImported}`;
      const appearances = parseInt(record.Appearances || record.APPEARANCES) || 1;
      const year = parseInt(record.First_appeared || record.Year || record.YEAR) || 2000;
      const align = record.Alignment || record.ALIGN || 'Neutral';
      
      const symbol = `${name.substring(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, '')}${totalImported}`;
      const price = calculatePrice(appearances, year);
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol,
        name,
        type: 'character',
        description: `${name} - ${appearances} appearances since ${year} (${align})`
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
      
      totalImported++;
    }
    
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    await db.insert(assetCurrentPrices).values(pricesWithIds);
    
    if (i % 5000 === 0) {
      console.log(`   ✅ ${totalImported} characters imported...`);
    }
  }
  
  console.log(`   ✅ FiveThirtyEight: ${allFT538.length} characters imported!\n`);
  
  // 2. MARVEL SUPERHEROES DATASET
  console.log('📖 DATASET 2: Marvel Superheroes\n');
  const marvelPath = manifest[1].path;
  
  // Comics
  const comicsCsv = fs.readFileSync(path.join(marvelPath, 'comics.csv'), 'utf-8');
  const comicsRecords = parse(comicsCsv, { columns: true, skip_empty_lines: true });
  console.log(`   📦 Comics: ${comicsRecords.length} issues`);
  
  for (let i = 0; i < comicsRecords.length; i += batchSize) {
    const batch = comicsRecords.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const record of batch) {
      const title = record.title || `Comic-${totalImported}`;
      const symbol = `C${totalImported}`;
      const price = 50 + Math.random() * 450;
      const float = 100000 + Math.floor(Math.random() * 900000);
      
      assetBatch.push({
        symbol,
        name: title,
        type: 'comic',
        description: title
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 0.9 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'Kaggle-MarvelSuperheroes',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 10000)
      });
      
      totalImported++;
    }
    
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    await db.insert(assetCurrentPrices).values(pricesWithIds);
    
    if (i % 5000 === 0) {
      console.log(`   ✅ ${totalImported} total imported...`);
    }
  }
  
  console.log(`   ✅ Marvel Comics: ${comicsRecords.length} issues imported!\n`);
  
  // 3. SUPERHERO SET DATASET
  console.log('📖 DATASET 3: Superhero Set\n');
  const heroPath = manifest[2].path;
  
  const heroesCsv = fs.readFileSync(path.join(heroPath, 'heroes_information.csv'), 'utf-8');
  const heroesRecords = parse(heroesCsv, { columns: true, skip_empty_lines: true });
  console.log(`   📦 Heroes: ${heroesRecords.length} heroes`);
  
  for (let i = 0; i < heroesRecords.length; i += batchSize) {
    const batch = heroesRecords.slice(i, i + batchSize);
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const record of batch) {
      const name = record.name || `Hero-${totalImported}`;
      const publisher = record.Publisher || 'Unknown';
      const symbol = `H${totalImported}`;
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
      
      totalImported++;
    }
    
    const insertedAssets = await db.insert(assets).values(assetBatch).returning();
    const pricesWithIds = priceBatch.map((p, idx) => ({
      ...p,
      assetId: insertedAssets[idx].id
    }));
    await db.insert(assetCurrentPrices).values(pricesWithIds);
  }
  
  console.log(`   ✅ Heroes: ${heroesRecords.length} heroes imported!\n`);
  
  console.log(`\n🏁 TOTAL IMPORTED: ${totalImported} ASSETS FROM ALL KAGGLE DATASETS!`);
  console.log(`   Sources: FiveThirtyEight, Marvel Superheroes, Superhero Set`);
}

importAllKaggleData().catch(console.error).finally(() => process.exit());
