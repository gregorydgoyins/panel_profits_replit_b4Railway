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

interface MovieRow {
  ID: string;
  Movie: string;
  Year: string;
  Genre: string;
  RunTime: string;
  Rating: string;
  Director: string;
  Actor: string;
  Description: string;
  IMDB_Score: string;
  Metascore: string;
  Votes: string;
  USA_Gross: string;
  Category: string; // Marvel or DC
}

export class MovieExpansionService {
  private pricingEngine = new UnifiedPricingEngine();
  private assetInsertion = new AssetInsertionService();

  private generateSymbol(title: string, year: string, category: string): string {
    const hash = crypto.createHash('sha256').update(`movie_${category}_${title}_${year}`).digest();
    const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
    const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
    return `MOV.${suffix}`;
  }

  async processAll(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: MovieRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`🎬 Processing ${records.length} Marvel/DC movies...`);

    const assetsToInsert: any[] = [];
    const startTime = Date.now();

    for (const row of records) {
      const symbol = this.generateSymbol(row.Movie, row.Year, row.Category);
      const imdbScore = parseFloat(row.IMDB_Score) || 0;
      const metascore = parseFloat(row.Metascore) || 0;
      const votes = parseInt(row.Votes?.replace(/,/g, '')) || 0;
      const usaGross = parseFloat(row.USA_Gross?.replace(/[,$]/g, '')) || 0;
      
      const metadata = {
        year: parseInt(row.Year) || 0,
        genre: row.Genre,
        runtime: parseInt(row.RunTime) || 0,
        rating: row.Rating,
        director: row.Director,
        actor: row.Actor,
        imdbScore,
        metascore,
        votes,
        usaGross,
        category: row.Category,
        franchise: row.Category === 'Marvel' ? 'Marvel Cinematic Universe' : 'DC Extended Universe',
        source: 'kaggle_marvel_dc_movies'
      };

      const pricingResult = this.pricingEngine.generateMoviePricing({
        title: row.Movie,
        imdbScore,
        metascore,
        usaGross,
        category: row.Category
      });

      const asset = {
        symbol,
        name: row.Movie,
        type: 'comic',
        description: row.Description?.substring(0, 500) || `${row.Movie} (${row.Year}) - ${row.Category}`,
        imageUrl: null,
        metadata,
        pricing: {
          currentPrice: pricingResult.sharePrice,
          totalMarketValue: pricingResult.totalMarketValue,
          totalFloat: pricingResult.totalFloat,
          source: 'kaggle_marvel_dc_movies',
          lastUpdated: new Date().toISOString(),
          breakdown: pricingResult.breakdown
        }
      };

      assetsToInsert.push(asset);
    }

    const result = await this.assetInsertion.insertPricedAssets(assetsToInsert);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const rate = (result.inserted / parseFloat(elapsed)).toFixed(1);
    
    console.log(`✅ Movie expansion complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors} errors in ${elapsed}s (${rate} assets/sec)`);
    
    return result;
  }
}
