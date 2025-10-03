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

interface PokemonRow {
  Name: string;
  Type1: string;
  Type2: string;
  Evolution: string;
}

export class PokemonExpansionService {
  private pricingEngine = new UnifiedPricingEngine();
  private assetInsertion = new AssetInsertionService();

  private generateSymbol(name: string): string {
    const hash = crypto.createHash('sha256').update(`pokemon_${name.toLowerCase()}`).digest();
    const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
    const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
    return `PKM.${suffix}`;
  }

  async processAll(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: PokemonRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`🎮 Processing ${records.length} Pokemon...`);

    const assetsToInsert: any[] = [];
    const startTime = Date.now();

    for (const row of records) {
      const symbol = this.generateSymbol(row.Name);
      const imagePath = `/tmp/kaggle_pokemon/images/${row.Name.toLowerCase()}.png`;
      
      // Build metadata
      const metadata = {
        type1: row.Type1,
        type2: row.Type2 || null,
        evolution: row.Evolution || null,
        franchise: 'Pokemon',
        category: 'character',
        source: 'kaggle_pokemon'
      };

      // Generate pricing
      const pricingResult = this.pricingEngine.generatePokemonPricing({
        name: row.Name,
        type1: row.Type1,
        type2: row.Type2,
        evolution: row.Evolution
      });

      const asset = {
        symbol,
        name: row.Name,
        type: 'character',
        description: `${row.Name} - ${row.Type1}${row.Type2 ? '/' + row.Type2 : ''} type Pokemon`,
        imageUrl: null, // Will upload to object storage later
        metadata,
        pricing: {
          currentPrice: pricingResult.sharePrice,
          totalMarketValue: pricingResult.totalMarketValue,
          totalFloat: pricingResult.totalFloat,
          source: 'kaggle_pokemon',
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
    
    console.log(`✅ Pokemon expansion complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors} errors in ${elapsed}s (${rate} assets/sec)`);
    
    return result;
  }
}
