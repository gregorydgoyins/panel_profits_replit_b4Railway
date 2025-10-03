import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { AssetInsertionService } from './assetInsertionService';
import { unifiedPricingEngine } from './unifiedPricingEngine';

interface MarvelComicRow {
  comic_name: string;
  active_years: string;
  issue_title: string;
  publish_date: string;
  issue_description: string;
  penciler: string;
  writer: string;
  cover_artist: string;
  Imprint: string;
  Format: string;
  Rating: string;
  Price: string;
}

interface DCComicRow {
  Catergory_Title: string;
  Issue_Name: string;
  Issue_Link: string;
  Pencilers: string;
  Cover_Artists: string;
  Inkers: string;
  Writers: string;
  Editors: string;
  Executive_Editor: string;
  Letterers: string;
  Colourists: string;
  Rating: string;
  Release_Date: string;
  Comic_Series: string;
  Comic_Type: string;
}

export class KaggleComicsExpansionService {
  private assetService = new AssetInsertionService();

  async processMarvelComics(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: MarvelComicRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`📚 Processing ${records.length} Marvel comics from Kaggle...`);

    const assets = records.map(row => {
      const name = row.issue_title || row.comic_name;
      const symbol = this.generateSymbol('M', name);
      const era = this.determineEra(row.publish_date);
      
      const pricing = unifiedPricingEngine.calculatePrice({
        assetType: 'comic',
        name,
        era,
        franchiseTier: 3
      });

      return {
        type: 'comic',
        name,
        symbol,
        category: 'comic',
        metadata: {
          source: 'kaggle_marvel_comics',
          publisher: 'Marvel',
          activeYears: row.active_years,
          publishDate: row.publish_date,
          description: row.issue_description,
          penciler: row.penciler,
          writer: row.writer,
          coverArtist: row.cover_artist,
          imprint: row.Imprint,
          format: row.Format,
          rating: row.Rating,
          price: row.Price,
          era,
          tier: 3
        },
        pricing: {
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          source: 'kaggle_marvel_comics',
          lastUpdated: new Date().toISOString(),
          breakdown: pricing.breakdown
        }
      };
    });

    const result = await this.assetService.insertPricedAssets(assets, 100);
    return { inserted: result.inserted, skipped: result.skipped, errors: result.errors };
  }

  async processDCComics(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: DCComicRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`📚 Processing ${records.length} DC comics from Kaggle...`);

    const assets = records.map(row => {
      const name = row.Issue_Name;
      const symbol = this.generateSymbol('DC', name);
      const era = this.determineEra(row.Release_Date);
      
      const pricing = unifiedPricingEngine.calculatePrice({
        assetType: 'comic',
        name,
        era,
        franchiseTier: 3
      });

      return {
        type: 'comic',
        name,
        symbol,
        category: 'comic',
        metadata: {
          source: 'kaggle_dc_comics',
          publisher: 'DC Comics',
          categoryTitle: row.Catergory_Title,
          issueLink: row.Issue_Link,
          pencilers: row.Pencilers,
          coverArtists: row.Cover_Artists,
          inkers: row.Inkers,
          writers: row.Writers,
          editors: row.Editors,
          executiveEditor: row.Executive_Editor,
          letterers: row.Letterers,
          colourists: row.Colourists,
          rating: row.Rating,
          releaseDate: row.Release_Date,
          comicSeries: row.Comic_Series,
          comicType: row.Comic_Type,
          era,
          tier: 3
        },
        pricing: {
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          source: 'kaggle_dc_comics',
          lastUpdated: new Date().toISOString(),
          breakdown: pricing.breakdown
        }
      };
    });

    const result = await this.assetService.insertPricedAssets(assets, 100);
    return { inserted: result.inserted, skipped: result.skipped, errors: result.errors };
  }

  private generateSymbol(prefix: string, name: string): string {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = this.simpleHash(normalized);
    return `${prefix}.${hash.substring(0, 9).toUpperCase()}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private determineEra(dateStr?: string): 'golden' | 'silver' | 'bronze' | 'modern' {
    if (!dateStr) return 'modern';
    
    const yearMatch = dateStr.match(/\d{4}/);
    if (!yearMatch) return 'modern';
    
    const year = parseInt(yearMatch[0]);
    if (year <= 1955) return 'golden';
    if (year <= 1970) return 'silver';
    if (year <= 1985) return 'bronze';
    return 'modern';
  }
}
