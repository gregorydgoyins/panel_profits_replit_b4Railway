import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { assets, assetCurrentPrices } from '@shared/schema';
import { UnifiedPricingEngine } from './unifiedPricingEngine';
import { AssetInsertionService } from './assetInsertionService';
import crypto from 'crypto';

const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

interface MangaBestsellingRow {
  'Manga series': string;
  'Author(s)': string;
  'Publisher': string;
  'Demographic': string;
  'No. of collected volumes': string;
  'Serialized': string;
  'Approximate sales in million(s)': string;
  'Average sales per volume in million(s)': string;
}

interface MangaComprehensiveRow {
  title: string;
  description: string;
  rating: string;
  year: string;
  tags: string;
  cover: string;
}

export class MangaExpansionService {
  private pricingEngine = new UnifiedPricingEngine();
  private assetInsertion = new AssetInsertionService();

  private generateSymbol(title: string, source: string): string {
    const safeTitle = (title || 'unknown').toLowerCase();
    const hash = crypto.createHash('sha256').update(`manga_${source}_${safeTitle}`).digest();
    const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
    const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
    return `MNG.${suffix}`;
  }

  async processBestselling(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: MangaBestsellingRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`📚 Processing ${records.length} bestselling manga series...`);

    const assetsToInsert: any[] = [];
    const startTime = Date.now();

    for (const row of records) {
      const symbol = this.generateSymbol(row['Manga series'], 'bestselling');
      const salesMillions = parseFloat(row['Approximate sales in million(s)']) || 0;
      
      const metadata = {
        authors: row['Author(s)'],
        publisher: row['Publisher'],
        demographic: row['Demographic'],
        volumes: parseInt(row['No. of collected volumes']) || 0,
        serialized: row['Serialized'],
        salesMillions,
        avgSalesPerVolume: parseFloat(row['Average sales per volume in million(s)']) || 0,
        franchise: row['Manga series'],
        category: 'manga',
        source: 'kaggle_manga_bestselling'
      };

      const pricingResult = this.pricingEngine.generateMangaPricing({
        title: row['Manga series'],
        salesMillions,
        volumes: parseInt(row['No. of collected volumes']) || 0
      });

      const asset = {
        symbol,
        name: row['Manga series'],
        type: 'comic',
        description: `${row['Manga series']} by ${row['Author(s)']} - ${salesMillions}M+ copies sold`,
        imageUrl: null,
        metadata,
        pricing: {
          currentPrice: pricingResult.sharePrice,
          totalMarketValue: pricingResult.totalMarketValue,
          totalFloat: pricingResult.totalFloat,
          source: 'kaggle_manga_bestselling',
          lastUpdated: new Date().toISOString(),
          breakdown: pricingResult.breakdown
        }
      };

      assetsToInsert.push(asset);
    }

    const result = await this.assetInsertion.insertPricedAssets(assetsToInsert);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Bestselling manga complete: ${result.inserted} inserted in ${elapsed}s`);
    return result;
  }

  async processComprehensive(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: MangaComprehensiveRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`📚 Processing ${records.length} manga titles...`);

    const assetsToInsert: any[] = [];
    const startTime = Date.now();
    let processed = 0;

    for (const row of records) {
      const symbol = this.generateSymbol(row.title, 'comprehensive');
      
      const metadata = {
        rating: parseFloat(row.rating) || 0,
        year: parseInt(row.year) || 0,
        tags: row.tags || '',
        franchise: row.title,
        category: 'manga',
        source: 'kaggle_manga_comprehensive'
      };

      const pricingResult = this.pricingEngine.generateMangaPricing({
        title: row.title,
        rating: parseFloat(row.rating) || 0,
        year: parseInt(row.year) || 0
      });

      const asset = {
        symbol,
        name: row.title,
        type: 'comic',
        description: row.description?.substring(0, 500) || row.title,
        imageUrl: row.cover || null,
        metadata,
        pricing: {
          currentPrice: pricingResult.sharePrice,
          totalMarketValue: pricingResult.totalMarketValue,
          totalFloat: pricingResult.totalFloat,
          source: 'kaggle_manga_comprehensive',
          lastUpdated: new Date().toISOString(),
          breakdown: pricingResult.breakdown
        }
      };

      assetsToInsert.push(asset);
      processed++;

      // Batch insert every 1000 items
      if (assetsToInsert.length >= 1000) {
        await this.assetInsertion.insertPricedAssets(assetsToInsert);
        assetsToInsert.length = 0;
        console.log(`   📦 Processed ${processed} / ${records.length} manga...`);
      }
    }

    // Insert remaining
    const finalResult = await this.assetInsertion.insertPricedAssets(assetsToInsert);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const rate = (processed / parseFloat(elapsed)).toFixed(1);
    console.log(`✅ Comprehensive manga complete: ${processed} processed in ${elapsed}s (${rate} assets/sec)`);
    
    return finalResult;
  }
}
