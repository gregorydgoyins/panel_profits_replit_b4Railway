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

interface FunkoRow {
  uid: string;
  title: string;
  product_type: string;
  price: string;
  interest: string;
  license: string;
  tags: string;
  vendor: string;
  form_factor: string;
  feature: string;
  related: string;
  description: string;
  gid: string;
  created_at: string;
  published_at: string;
  updated_at: string;
  handle: string;
  img: string;
}

export class FunkoExpansionService {
  private pricingEngine = new UnifiedPricingEngine();
  private assetInsertion = new AssetInsertionService();

  private safeParseArray(value: string): string[] {
    if (!value || value === '[]') return [];
    try {
      const cleaned = value.replace(/'/g, '"');
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }

  private generateSymbol(title: string, uid: string): string {
    const hash = crypto.createHash('sha256').update(`funko_${uid}`).digest();
    const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
    const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
    return `FNK.${suffix}`;
  }

  async processAll(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: FunkoRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`🎭 Processing ${records.length} Funko Pops...`);

    const assetsToInsert: any[] = [];
    const startTime = Date.now();

    for (const row of records) {
      const symbol = this.generateSymbol(row.title, row.uid);
      const interests = this.safeParseArray(row.interest);
      const licenses = this.safeParseArray(row.license);
      const tags = this.safeParseArray(row.tags);
      
      // Build metadata
      const metadata = {
        uid: row.uid,
        productType: row.product_type,
        interests,
        licenses,
        tags,
        vendor: row.vendor,
        handle: row.handle,
        price: parseFloat(row.price) || 0,
        franchise: licenses[0] || 'Unknown',
        category: 'collectible',
        source: 'kaggle_funko'
      };

      // Generate pricing based on retail price and franchise
      const pricingResult = this.pricingEngine.generateFunkoPricing({
        title: row.title,
        retailPrice: parseFloat(row.price) || 0,
        franchise: licenses[0] || 'Unknown',
        interests
      });

      const asset = {
        symbol,
        name: row.title,
        type: 'collectible',
        description: row.description?.substring(0, 500) || `${row.title} Funko Pop collectible`,
        imageUrl: row.img || null,
        metadata,
        pricing: {
          currentPrice: pricingResult.sharePrice,
          totalMarketValue: pricingResult.totalMarketValue,
          totalFloat: pricingResult.totalFloat,
          source: 'kaggle_funko',
          lastUpdated: new Date().toISOString(),
          breakdown: pricingResult.breakdown
        }
      };

      assetsToInsert.push(asset);
    }

    // Batch insert
    const result = await this.assetInsertion.insertPricedAssets(assetsToInsert);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const rate = (result.inserted / parseFloat(elapsed)).toFixed(1);
    
    console.log(`✅ Funko expansion complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors} errors in ${elapsed}s (${rate} assets/sec)`);
    
    return result;
  }
}
