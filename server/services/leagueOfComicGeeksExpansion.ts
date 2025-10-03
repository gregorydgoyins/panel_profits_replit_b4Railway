import { AssetInsertionService } from './assetInsertionService';
import { unifiedPricingEngine } from './unifiedPricingEngine';

interface LeagueComic {
  id: number;
  title: string;
  publisher?: string;
  issue_number?: string;
  release_date?: string;
  creators?: Array<{ name: string; role: string }>;
  series?: string;
}

export class LeagueOfComicGeeksExpansionService {
  private assetService = new AssetInsertionService();
  private sessionCookie: string;
  private baseUrl = 'https://leagueofcomicgeeks.com';

  constructor(sessionCookie: string) {
    this.sessionCookie = sessionCookie;
  }

  async fetchComics(page: number = 1, limit: number = 100): Promise<LeagueComic[]> {
    const url = `${this.baseUrl}/api/comics?page=${page}&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Cookie': `session=${this.sessionCookie}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`League API failed: ${response.status}`);
    }

    return await response.json();
  }

  async expandAssets(totalPages: number = 100): Promise<{ inserted: number; skipped: number; errors: number }> {
    let stats = { inserted: 0, skipped: 0, errors: 0 };

    for (let page = 1; page <= totalPages; page++) {
      try {
        const comics = await this.fetchComics(page, 100);
        
        if (comics.length === 0) break;

        const assets = comics.map(comic => {
          const symbol = this.generateSymbol(comic.title, comic.issue_number);
          const pricing = unifiedPricingEngine.calculatePrice({
            assetType: 'comic',
            name: `${comic.title} ${comic.issue_number || ''}`.trim(),
            era: this.determineEra(comic.release_date),
            franchiseTier: 3
          });

          return {
            type: 'comic',
            name: `${comic.title} ${comic.issue_number || ''}`.trim(),
            symbol,
            category: 'comic',
            metadata: {
              source: 'league_of_comic_geeks',
              leagueId: comic.id,
              publisher: comic.publisher,
              series: comic.series,
              releaseDate: comic.release_date,
              creators: comic.creators,
              era: this.determineEra(comic.release_date),
              tier: 3
            },
            pricing: {
              currentPrice: pricing.sharePrice,
              totalMarketValue: pricing.totalMarketValue,
              totalFloat: pricing.totalFloat,
              source: 'league_of_comic_geeks',
              lastUpdated: new Date().toISOString(),
              breakdown: pricing.breakdown
            }
          };
        });

        const result = await this.assetService.insertPricedAssets(assets);
        stats.inserted += result.inserted;
        stats.skipped += result.skipped;
        stats.errors += result.errors;

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Page ${page} failed:`, error);
        stats.errors++;
      }
    }

    return stats;
  }

  private generateSymbol(title: string, issue?: string): string {
    const normalized = `${title}${issue || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = this.simpleHash(normalized);
    return `LG.${hash.substring(0, 11).toUpperCase()}`;
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

  private determineEra(releaseDate?: string): 'golden' | 'silver' | 'bronze' | 'modern' {
    if (!releaseDate) return 'modern';
    
    const year = new Date(releaseDate).getFullYear();
    if (year <= 1955) return 'golden';
    if (year <= 1970) return 'silver';
    if (year <= 1985) return 'bronze';
    return 'modern';
  }
}
