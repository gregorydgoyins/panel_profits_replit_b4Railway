#!/usr/bin/env tsx
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { assets, marketData } from '../shared/schema.js';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

interface PineconeRecord {
  id: string;
  metadata: {
    category?: string;
    filename?: string;
    filepath?: string;
    processed_date?: string;
    publisher?: string;
    name?: string;
    description?: string;
    type?: string;
    modified?: string;
  };
}

interface ExpandedAsset {
  symbol: string;
  name: string;
  type: 'character' | 'creator' | 'comic';
  description: string;
  baseName?: string;
  variant?: string;
  metadata: any;
  price: number;
}

class PineconeMassExpansionService {
  private db: any;
  private pinecone: Pinecone | null = null;
  private openai: OpenAI | null = null;
  private indexName: string;
  private existingSymbols: Set<string> = new Set();
  private processedIds: Set<string> = new Set();
  
  constructor() {
    const sql_connection = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql_connection);
    this.indexName = process.env.PINECONE_INDEX_NAME || 'core';
  }

  async init() {
    console.log('🚀 PINECONE MASS EXPANSION - INITIALIZING\n');

    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY not found');
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found');
    }

    this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log('📥 Loading existing symbols into memory...');
    const loadStart = Date.now();
    const existingRecords = await this.db.select({ symbol: assets.symbol }).from(assets);
    this.existingSymbols = new Set(existingRecords.map((r: any) => r.symbol));
    console.log(`✅ Loaded ${this.existingSymbols.size.toLocaleString()} existing symbols in ${Date.now() - loadStart}ms\n`);
  }

  /**
   * Generate embedding using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openai) return null;
    
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        dimensions: 1024
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('❌ Embedding error:', error instanceof Error ? error.message : 'Unknown');
      return null;
    }
  }

  /**
   * Query Pinecone with multiple diverse queries to get all records
   */
  async queryAllPineconeRecords(): Promise<PineconeRecord[]> {
    console.log('🔍 Querying ALL Pinecone records with diverse search strategies...\n');
    
    if (!this.pinecone) {
      throw new Error('Pinecone not initialized');
    }

    const index = this.pinecone.index(this.indexName);
    const allRecords: PineconeRecord[] = [];
    const seenIds = new Set<string>();

    const diverseQueries = [
      "Marvel character Spider-Man Captain America Iron Man",
      "DC character Batman Superman Wonder Woman",
      "X-Men Avengers Justice League superhero team",
      "comic book character hero villain mutant",
      "Stan Lee Jack Kirby comic creator artist writer",
      "Amazing Spider-Man Detective Comics Action Comics",
      "Marvel comic book series issue story",
      "DC Comics publication graphic novel",
      "superhero origin story first appearance",
      "comic book character profile biography",
      "Marvel Universe DC Universe character",
      "comic creator illustrator penciler inker"
    ];

    for (let i = 0; i < diverseQueries.length; i++) {
      const query = diverseQueries[i];
      console.log(`  🔎 Query ${i + 1}/${diverseQueries.length}: "${query.substring(0, 50)}..."`);
      
      const embedding = await this.generateEmbedding(query);
      if (!embedding) {
        console.warn(`     ⚠️ Failed to generate embedding, skipping...`);
        continue;
      }

      try {
        const results = await index.query({
          vector: embedding,
          topK: 10000,
          includeMetadata: true,
          includeValues: false
        });

        let newRecords = 0;
        for (const match of results.matches) {
          if (!seenIds.has(match.id)) {
            allRecords.push({
              id: match.id,
              metadata: match.metadata || {}
            });
            seenIds.add(match.id);
            newRecords++;
          }
        }

        console.log(`     ✅ Found ${results.matches.length} results, ${newRecords} new unique records`);
        console.log(`     📊 Total unique: ${seenIds.size.toLocaleString()}\n`);

        await this.sleep(500);
      } catch (error) {
        console.error(`     ❌ Query failed:`, error instanceof Error ? error.message : 'Unknown');
      }
    }

    console.log(`\n✅ Retrieved ${allRecords.length.toLocaleString()} unique Pinecone records\n`);
    return allRecords;
  }

  /**
   * Parse variant information from name
   * Examples: "Captain America (House of M)", "Spider-Man [2099]", "Batman - Dark Knight"
   */
  parseVariant(name: string): { baseName: string; variant?: string } {
    const parenthesesMatch = name.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (parenthesesMatch) {
      return {
        baseName: parenthesesMatch[1].trim(),
        variant: parenthesesMatch[2].trim()
      };
    }

    const bracketsMatch = name.match(/^(.+?)\s*\[([^\]]+)\]$/);
    if (bracketsMatch) {
      return {
        baseName: bracketsMatch[1].trim(),
        variant: bracketsMatch[2].trim()
      };
    }

    const dashMatch = name.match(/^(.+?)\s*-\s*(.+)$/);
    if (dashMatch && dashMatch[2].length < 30) {
      return {
        baseName: dashMatch[1].trim(),
        variant: dashMatch[2].trim()
      };
    }

    return { baseName: name };
  }

  /**
   * Generate unique symbol with variant support
   * Examples: SPIDEY, SPIDEY.2099, CAPTAMER.HOM
   */
  generateUniqueSymbol(name: string, variant?: string, publisher?: string): string {
    const { baseName, variant: parsedVariant } = this.parseVariant(name);
    const effectiveVariant = variant || parsedVariant;

    let base = baseName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8);
    
    if (!base) base = 'ASSET';

    if (effectiveVariant) {
      const variantCode = effectiveVariant
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 5);
      base = `${base}.${variantCode}`;
    } else if (publisher) {
      const pub = publisher.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
      if (pub) base = `${base}.${pub}`;
    }

    if (this.existingSymbols.has(base)) {
      let counter = 1;
      let uniqueSymbol = `${base}${counter}`;
      while (this.existingSymbols.has(uniqueSymbol)) {
        counter++;
        uniqueSymbol = `${base}${counter}`;
      }
      return uniqueSymbol;
    }

    return base;
  }

  /**
   * Aggressive multi-query expansion - generate up to 12 assets per record
   */
  expandRecord(record: PineconeRecord): ExpandedAsset[] {
    const expandedAssets: ExpandedAsset[] = [];
    const metadata = record.metadata;
    const name = metadata.name || metadata.filename || record.id;
    const publisher = metadata.publisher || 
                     (record.id.includes('marvel') ? 'Marvel' : 
                      record.id.includes('dc') ? 'DC' : 'Unknown');
    
    const category = metadata.category;
    let type: 'character' | 'creator' | 'comic' = 'character';
    
    if (category === 'Creators' || record.id.includes('creator')) {
      type = 'creator';
    } else if (category === 'Comics' || record.id.includes('comic') || metadata.type === 'comics') {
      type = 'comic';
    }

    const { baseName, variant } = this.parseVariant(name);

    if (type === 'character') {
      const baseSymbol = this.generateUniqueSymbol(baseName, undefined, publisher);
      this.existingSymbols.add(baseSymbol);
      expandedAssets.push({
        symbol: baseSymbol,
        name: baseName,
        type: 'character',
        description: metadata.description || `${baseName} - ${publisher} character`,
        baseName,
        metadata: { ...metadata, pineconeId: record.id, category, publisher },
        price: Math.random() * 10000 + 1000
      });

      if (variant) {
        const variantSymbol = this.generateUniqueSymbol(baseName, variant, publisher);
        this.existingSymbols.add(variantSymbol);
        expandedAssets.push({
          symbol: variantSymbol,
          name: `${baseName} (${variant})`,
          type: 'character',
          description: `${baseName} - ${variant} incarnation`,
          baseName,
          variant,
          metadata: { ...metadata, pineconeId: record.id, category, publisher, variant },
          price: Math.random() * 15000 + 2000
        });
      }

      const variants = [
        { suffix: 'COSTUME', name: `${baseName} (Costume Variant)`, priceMultiplier: 1.2 },
        { suffix: 'ORIGIN', name: `${baseName} (Origin Story)`, priceMultiplier: 1.5 },
        { suffix: 'MODERN', name: `${baseName} (Modern Age)`, priceMultiplier: 1.1 },
        { suffix: 'GOLDEN', name: `${baseName} (Golden Age)`, priceMultiplier: 2.0 }
      ];

      for (const v of variants) {
        const varSymbol = this.generateUniqueSymbol(baseName, v.suffix, publisher);
        if (!this.existingSymbols.has(varSymbol)) {
          this.existingSymbols.add(varSymbol);
          expandedAssets.push({
            symbol: varSymbol,
            name: v.name,
            type: 'character',
            description: `${v.name} - Special variant`,
            baseName,
            variant: v.suffix,
            metadata: { ...metadata, pineconeId: record.id, category, publisher, variant: v.suffix },
            price: (Math.random() * 10000 + 1000) * v.priceMultiplier
          });
        }
      }

    } else if (type === 'creator') {
      const baseSymbol = this.generateUniqueSymbol(baseName, undefined, publisher);
      this.existingSymbols.add(baseSymbol);
      expandedAssets.push({
        symbol: baseSymbol,
        name: baseName,
        type: 'creator',
        description: metadata.description || `${baseName} - Comic creator`,
        metadata: { ...metadata, pineconeId: record.id, category, publisher },
        price: Math.random() * 25000 + 5000
      });

      const creatorVariants = [
        { suffix: 'ART', name: `${baseName} (Artwork)`, priceMultiplier: 1.3 },
        { suffix: 'WRITE', name: `${baseName} (Writing)`, priceMultiplier: 1.2 }
      ];

      for (const v of creatorVariants) {
        const varSymbol = this.generateUniqueSymbol(baseName, v.suffix, publisher);
        if (!this.existingSymbols.has(varSymbol)) {
          this.existingSymbols.add(varSymbol);
          expandedAssets.push({
            symbol: varSymbol,
            name: v.name,
            type: 'creator',
            description: `${v.name} - Creator portfolio`,
            baseName,
            variant: v.suffix,
            metadata: { ...metadata, pineconeId: record.id, category, publisher, variant: v.suffix },
            price: (Math.random() * 25000 + 5000) * v.priceMultiplier
          });
        }
      }

    } else if (type === 'comic') {
      const baseSymbol = this.generateUniqueSymbol(baseName, undefined, publisher);
      this.existingSymbols.add(baseSymbol);
      expandedAssets.push({
        symbol: baseSymbol,
        name: baseName,
        type: 'comic',
        description: metadata.description || `${baseName} - ${publisher} comic`,
        metadata: { ...metadata, pineconeId: record.id, category, publisher },
        price: Math.random() * 5000 + 500
      });

      const comicGrades = [
        { suffix: 'CGC98', name: `${baseName} (CGC 9.8)`, priceMultiplier: 3.0 },
        { suffix: 'CGC95', name: `${baseName} (CGC 9.5)`, priceMultiplier: 2.0 },
        { suffix: 'CGC90', name: `${baseName} (CGC 9.0)`, priceMultiplier: 1.5 }
      ];

      for (const v of comicGrades) {
        const varSymbol = this.generateUniqueSymbol(baseName, v.suffix, publisher);
        if (!this.existingSymbols.has(varSymbol)) {
          this.existingSymbols.add(varSymbol);
          expandedAssets.push({
            symbol: varSymbol,
            name: v.name,
            type: 'comic',
            description: `${v.name} - Graded comic`,
            baseName,
            variant: v.suffix,
            metadata: { ...metadata, pineconeId: record.id, category, publisher, variant: v.suffix },
            price: (Math.random() * 5000 + 500) * v.priceMultiplier
          });
        }
      }
    }

    return expandedAssets;
  }

  /**
   * Bulk insert assets in batches
   */
  async bulkInsertAssets(allAssets: ExpandedAsset[]): Promise<{ inserted: number; errors: number }> {
    console.log('💾 Bulk inserting assets into database...\n');
    
    const BATCH_SIZE = 1000;
    let totalInserted = 0;
    let errorCount = 0;
    const insertStart = Date.now();

    for (let i = 0; i < allAssets.length; i += BATCH_SIZE) {
      const chunk = allAssets.slice(i, i + BATCH_SIZE);
      
      try {
        const insertedAssets = await this.db.insert(assets).values(
          chunk.map(a => ({
            symbol: a.symbol,
            name: a.name,
            type: a.type,
            description: a.description,
            metadata: a.metadata,
          }))
        ).returning();

        if (insertedAssets.length > 0) {
          const marketDataBatch = insertedAssets.map((asset: any, idx: number) => ({
            assetId: asset.id,
            timeframe: '1d',
            periodStart: new Date(),
            open: chunk[idx].price.toFixed(2),
            high: (chunk[idx].price * 1.02).toFixed(2),
            low: (chunk[idx].price * 0.98).toFixed(2),
            close: chunk[idx].price.toFixed(2),
            volume: Math.floor(1000 + Math.random() * 4000),
            marketCap: (chunk[idx].price * Math.floor(10000 + Math.random() * 90000)).toFixed(2),
          }));
          
          await this.db.insert(marketData).values(marketDataBatch);
        }

        totalInserted += insertedAssets.length;

        if ((i + BATCH_SIZE) % 10000 === 0 || i + BATCH_SIZE >= allAssets.length) {
          const elapsed = (Date.now() - insertStart) / 1000;
          const rate = totalInserted / elapsed;
          const remaining = allAssets.length - totalInserted;
          const eta = remaining / rate;
          
          console.log(`  ⏳ ${totalInserted.toLocaleString()}/${allAssets.length.toLocaleString()} inserted | ${rate.toFixed(0)} rec/s | ETA: ${eta.toFixed(0)}s`);
        }
      } catch (error: any) {
        console.error(`  ⚠️ Error in batch ${i}:`, error.message);
        errorCount += chunk.length;
      }
    }

    return { inserted: totalInserted, errors: errorCount };
  }

  /**
   * Main execution pipeline
   */
  async run() {
    const startTime = Date.now();

    try {
      await this.init();

      console.log('='.repeat(70));
      console.log('📊 PHASE 1: RETRIEVE ALL PINECONE RECORDS');
      console.log('='.repeat(70) + '\n');

      const allRecords = await this.queryAllPineconeRecords();

      if (allRecords.length === 0) {
        console.log('⚠️ No records retrieved from Pinecone\n');
        return;
      }

      console.log('='.repeat(70));
      console.log('🔬 PHASE 2: AGGRESSIVE MULTI-QUERY EXPANSION');
      console.log('='.repeat(70) + '\n');

      const expandStart = Date.now();
      const allExpandedAssets: ExpandedAsset[] = [];
      let lastProgressPercent = 0;

      for (let i = 0; i < allRecords.length; i++) {
        const record = allRecords[i];
        
        if (this.processedIds.has(record.id)) continue;
        this.processedIds.add(record.id);

        const expandedAssets = this.expandRecord(record);
        allExpandedAssets.push(...expandedAssets);

        const progress = Math.floor((i / allRecords.length) * 100);
        if (progress >= lastProgressPercent + 10) {
          const expansionRatio = (allExpandedAssets.length / (i + 1)).toFixed(2);
          console.log(`  🔄 Processing: ${i.toLocaleString()}/${allRecords.length.toLocaleString()} (${progress}%) | Generated: ${allExpandedAssets.length.toLocaleString()} assets | Ratio: ${expansionRatio}x`);
          lastProgressPercent = progress;
        }
      }

      const expandElapsed = (Date.now() - expandStart) / 1000;
      console.log(`\n✅ Expansion complete in ${expandElapsed.toFixed(1)}s`);
      console.log(`📊 Expansion stats:`);
      console.log(`   - Pinecone records: ${allRecords.length.toLocaleString()}`);
      console.log(`   - Expanded assets: ${allExpandedAssets.length.toLocaleString()}`);
      console.log(`   - Expansion ratio: ${(allExpandedAssets.length / allRecords.length).toFixed(2)}x\n`);

      console.log('='.repeat(70));
      console.log('💾 PHASE 3: BULK DATABASE INSERTION');
      console.log('='.repeat(70) + '\n');

      const { inserted, errors } = await this.bulkInsertAssets(allExpandedAssets);

      const totalTime = (Date.now() - startTime) / 1000;

      console.log('\n' + '='.repeat(70));
      console.log('✅ MASS EXPANSION COMPLETE');
      console.log('='.repeat(70));
      console.log(`📊 Final Statistics:`);
      console.log(`   - Pinecone records processed: ${allRecords.length.toLocaleString()}`);
      console.log(`   - Assets generated: ${allExpandedAssets.length.toLocaleString()}`);
      console.log(`   - Assets inserted: ${inserted.toLocaleString()}`);
      console.log(`   - Expansion ratio: ${(allExpandedAssets.length / allRecords.length).toFixed(2)}x`);
      console.log(`   - Errors: ${errors}`);
      console.log(`   - Total time: ${totalTime.toFixed(1)}s`);
      console.log(`   - Processing rate: ${(allRecords.length / totalTime).toFixed(0)} records/s`);
      console.log(`   - Asset creation rate: ${(inserted / totalTime).toFixed(0)} assets/s`);
      console.log('='.repeat(70));

    } catch (error) {
      console.error('\n❌ FATAL ERROR:', error);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const service = new PineconeMassExpansionService();
  await service.run();
}

main().catch(console.error);
