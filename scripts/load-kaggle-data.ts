#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, marketData } from '../shared/schema.js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface ParsedRecord {
  name: string;
  publisher: string;
  symbol: string;
  description: string;
  metadata: any;
}

function generateUniqueSymbol(name: string, publisher: string, existingSymbols: Set<string>): string {
  let base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 8);
  
  let symbol = base || 'ASSET';
  
  if (publisher) {
    const pub = publisher.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    if (pub) symbol = `${symbol}.${pub}`;
  }
  
  // If symbol exists, add counter suffix
  if (existingSymbols.has(symbol)) {
    let counter = 1;
    let uniqueSymbol = `${symbol}${counter}`;
    while (existingSymbols.has(uniqueSymbol)) {
      counter++;
      uniqueSymbol = `${symbol}${counter}`;
    }
    return uniqueSymbol;
  }
  
  return symbol;
}

async function main() {
  const startTime = Date.now();
  console.log('🚀 KAGGLE DATA INGESTION - FAST MODE\n');

  // Step 1: Load ALL existing symbols into memory ONCE
  console.log('📥 Loading existing symbols into memory...');
  const loadStart = Date.now();
  const existingRecords = await db.select({ symbol: assets.symbol }).from(assets);
  const existingSymbols = new Set(existingRecords.map(r => r.symbol));
  console.log(`✅ Loaded ${existingSymbols.size.toLocaleString()} existing symbols in ${Date.now() - loadStart}ms\n`);

  const manifestPath = './data/kaggle-manifest.json';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  console.log(`📦 Datasets to process: ${manifest.downloaded.length}\n`);

  // Step 2: Parse ALL CSV records into memory first
  console.log('📖 Parsing all CSV files into memory...');
  const parseStart = Date.now();
  
  const allRecords: ParsedRecord[] = [];
  let totalParsed = 0;

  for (const slug of manifest.downloaded) {
    const datasetPath = manifest.dataset_paths[slug];
    console.log(`  📊 Reading: ${slug}`);
    
    const files = fs.readdirSync(datasetPath);
    const csvFiles = files.filter(f => f.endsWith('.csv'));
    
    for (const file of csvFiles) {
      const filePath = path.join(datasetPath, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          relax_column_count: true,
          cast: false,
        });

        console.log(`    📄 ${file}: ${records.length.toLocaleString()} records`);

        for (const record of records) {
          totalParsed++;

          const name = record.name || record.Name || record.TITLE || record.title ||
                      record.character || record.Character || record.PLAYER_NAME || 
                      record.hero_names || `Asset-${totalParsed}`;
          
          const publisher = record.publisher || record.Publisher || 
                          (slug.includes('dc') ? 'DC' :
                           slug.includes('marvel') ? 'Marvel' :
                           slug.includes('pokemon') ? 'Pokemon' : 'Unknown');
          
          // Generate unique symbol (checking in-memory Set)
          const symbol = generateUniqueSymbol(name, publisher, existingSymbols);
          
          // Add to existing symbols set to prevent duplicates within this batch
          existingSymbols.add(symbol);

          allRecords.push({
            name: name.substring(0, 255),
            publisher,
            symbol,
            description: `Kaggle: ${slug}`,
            metadata: {
              source: 'kaggle',
              dataset: slug,
              alignment: record.ALIGN || record.alignment || record.Alignment,
              appearances: record.APPEARANCES ? parseInt(record.APPEARANCES) : undefined,
            },
          });
        }
      } catch (err) {
        console.error(`    ❌ Error parsing ${file}: ${err}`);
      }
    }
  }

  const originalExistingCount = existingRecords.length;
  const newRecordsCount = allRecords.length;

  console.log(`✅ Parsed ${totalParsed.toLocaleString()} total records in ${Date.now() - parseStart}ms`);
  console.log(`📊 New records to insert: ${newRecordsCount.toLocaleString()}\n`);

  // Step 3: Bulk insert in batches with transactions
  if (allRecords.length === 0) {
    console.log('✨ No new records to insert!\n');
    const totalTime = (Date.now() - startTime) / 1000;
    console.log('\n' + '='.repeat(70));
    console.log('✅ INGESTION COMPLETE');
    console.log('='.repeat(70));
    console.log(`📊 Total parsed: ${totalParsed.toLocaleString()}`);
    console.log(`✅ New records: 0`);
    console.log(`⏭️  Already existed: ${totalParsed.toLocaleString()}`);
    console.log(`⚡ Total time: ${totalTime.toFixed(2)}s`);
    console.log('='.repeat(70));
    return;
  }

  console.log('💾 Bulk inserting records in batches of 1000...');
  const insertStart = Date.now();
  
  const BATCH_SIZE = 1000;
  let totalInserted = 0;
  let errorCount = 0;
  let lastProgressReport = 0;

  for (let i = 0; i < allRecords.length; i += BATCH_SIZE) {
    const chunk = allRecords.slice(i, i + BATCH_SIZE);
    
    try {
      // Insert assets and get IDs back
      const insertedAssets = await db.insert(assets).values(
        chunk.map(r => ({
          symbol: r.symbol,
          name: r.name,
          type: 'character' as const,
          description: r.description,
          metadata: r.metadata,
        }))
      ).returning();
      
      // Create marketData for successfully inserted assets
      if (insertedAssets.length > 0) {
        const marketDataBatch = insertedAssets.map(asset => ({
          assetId: asset.id,
          timeframe: '1d',
          periodStart: new Date(),
          open: "100.00",
          high: "100.00",
          low: "100.00",
          close: "100.00",
          volume: 0,
          marketCap: "0.00",
        }));
        
        await db.insert(marketData).values(marketDataBatch);
      }
      
      totalInserted += insertedAssets.length;
      
      // Progress reporting every 10K records
      if ((i + BATCH_SIZE) % 10000 === 0 || i + BATCH_SIZE >= allRecords.length) {
        const elapsed = (Date.now() - insertStart) / 1000;
        const rate = totalInserted / elapsed;
        const remaining = allRecords.length - totalInserted;
        const eta = remaining / rate;
        
        console.log(`  ⏳ ${totalInserted.toLocaleString()}/${allRecords.length.toLocaleString()} inserted | ${rate.toFixed(0)} rec/s | ETA: ${eta.toFixed(0)}s`);
        lastProgressReport = totalInserted;
      }
    } catch (error: any) {
      console.error(`  ⚠️  Error in batch ${i}: ${error.message}`);
      errorCount += chunk.length;
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;

  console.log('\n' + '='.repeat(70));
  console.log('✅ INGESTION COMPLETE');
  console.log('='.repeat(70));
  console.log(`📊 Total parsed: ${totalParsed.toLocaleString()}`);
  console.log(`✅ New records inserted: ${totalInserted.toLocaleString()}`);
  if (errorCount > 0) {
    console.log(`⚠️  Errors: ${errorCount.toLocaleString()}`);
  }
  console.log(`⏭️  Already existed: ${originalExistingCount.toLocaleString()}`);
  console.log(`⚡ Total time: ${totalTime.toFixed(2)}s`);
  console.log(`⚡ Rate: ${(totalInserted / totalTime).toFixed(0)} records/second`);
  console.log('='.repeat(70));
}

main().catch(console.error);
