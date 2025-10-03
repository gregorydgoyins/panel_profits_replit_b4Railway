import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { AssetInsertionService } from './assetInsertionService';
import { unifiedPricingEngine } from './unifiedPricingEngine';

interface IndieComicRow {
  Name: string;
  'Real Name'?: string;
  'Real name'?: string;
  Alignment?: string;
  Gender?: string;
  Affiliation?: string;
  Affiliations?: string;
  Creators?: string;
  'First appearance'?: string;
}

interface DBZRow {
  Name: string;
  Race: string;
  Gender: string;
  'Power Level': string;
  'Ki Blast'?: string;
  Transformation?: string;
}

interface AnimeRow {
  name_english: string;
  name_japanese?: string;
  anime_manga_titles?: string;
  favorites?: string;
}

interface GenshinRow {
  character_name: string;
  star_rarity: string;
  region: string;
  vision: string;
  weapon_type: string;
}

interface HonkaiRow {
  character: string;
  rarity: string;
  path: string;
  combat_type: string;
}

export class KaggleRound2ExpansionService {
  private assetService = new AssetInsertionService();

  async processIndieComics(csvPaths: string[]): Promise<{ inserted: number; skipped: number; errors: number }> {
    const assets: any[] = [];
    
    for (const csvPath of csvPaths) {
      const publisher = csvPath.includes('dark-horse') ? 'Dark Horse' :
                       csvPath.includes('dynamite') ? 'Dynamite' :
                       csvPath.includes('image') ? 'Image Comics' :
                       csvPath.includes('valiant') ? 'Valiant' : 'Indie';
      
      const csvContent = readFileSync(csvPath, 'utf-8');
      const records: IndieComicRow[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`📚 Processing ${records.length} ${publisher} characters...`);

      for (const row of records) {
        if (!row.Name) continue;

        const symbol = this.generateSymbol(row.Name, 'indie');
        const realName = row['Real Name'] || row['Real name'] || row.Name;
        const alignment = (row.Alignment || '').toLowerCase();
        
        const tier = alignment.includes('good') ? 2 : 
                    alignment.includes('bad') || alignment.includes('villain') ? 4 : 3;

        const pricing = unifiedPricingEngine.calculatePrice({
          assetType: 'character',
          name: row.Name,
          era: 'modern',
          franchiseTier: tier
        });

        assets.push({
          symbol,
          name: row.Name,
          type: 'character',
          description: `${row.Name} - ${publisher} Comics`,
          imageUrl: undefined,
          category: 'character',
          metadata: {
            source: 'kaggle_indie_comics',
            publisher,
            realName,
            alignment: row.Alignment,
            gender: row.Gender,
            affiliation: row.Affiliation || row.Affiliations,
            creators: row.Creators,
            firstAppearance: row['First appearance'],
            tier
          },
          pricing: {
            currentPrice: pricing.sharePrice,
            totalMarketValue: pricing.totalMarketValue,
            totalFloat: pricing.totalFloat,
            source: 'kaggle_indie_comics',
            lastUpdated: new Date().toISOString(),
            breakdown: pricing.breakdown
          }
        });
      }
    }

    console.log(`📦 Inserting ${assets.length} indie comic characters...`);
    return await this.assetService.insertPricedAssets(assets);
  }

  async processDBZ(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: DBZRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`⚡ Processing ${records.length} Dragon Ball Z characters...`);

    const assets = records.map(row => {
      const symbol = this.generateSymbol(row.Name, 'dbz');
      const powerLevel = parseInt(row['Power Level']) || 0;
      const tier = powerLevel > 5000 ? 1 : powerLevel > 1000 ? 2 : 3;

      const pricing = unifiedPricingEngine.calculatePrice({
        assetType: 'character',
        name: row.Name,
        era: 'modern',
        franchiseTier: tier
      });

      return {
        symbol,
        name: row.Name,
        type: 'character',
        description: `${row.Name} - Dragon Ball Z`,
        imageUrl: null,
        category: 'character',
        metadata: {
          source: 'kaggle_dbz',
          franchise: 'Dragon Ball Z',
          race: row.Race,
          gender: row.Gender,
          powerLevel,
          kiBlast: row['Ki Blast'],
          transformation: row.Transformation,
          tier
        },
        pricing: {
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          source: 'kaggle_dbz',
          lastUpdated: new Date().toISOString(),
          breakdown: pricing.breakdown
        }
      };
    });

    return await this.assetService.insertPricedAssets(assets);
  }

  async processAnimeCharacters(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: AnimeRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`🎌 Processing ${records.length} anime characters...`);

    const assets = records.map(row => {
      const symbol = this.generateSymbol(row.name_english, 'anime');
      const favorites = parseInt(row.favorites || '0');
      const tier = favorites > 50000 ? 1 : favorites > 10000 ? 2 : 3;

      const pricing = unifiedPricingEngine.calculatePrice({
        assetType: 'character',
        name: row.name_english,
        era: 'modern',
        franchiseTier: tier
      });

      return {
        symbol,
        name: row.name_english,
        type: 'character',
        description: `${row.name_english} - Anime Character`,
        imageUrl: null,
        category: 'character',
        metadata: {
          source: 'kaggle_anime',
          nameJapanese: row.name_japanese,
          titles: row.anime_manga_titles,
          favorites,
          tier
        },
        pricing: {
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          source: 'kaggle_anime',
          lastUpdated: new Date().toISOString(),
          breakdown: pricing.breakdown
        }
      };
    });

    return await this.assetService.insertPricedAssets(assets);
  }

  async processGenshin(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: GenshinRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`🌸 Processing ${records.length} Genshin Impact characters...`);

    const assets = records.filter(row => row.character_name).map(row => {
      const symbol = this.generateSymbol(row.character_name, 'genshin');
      const rarity = parseInt(row.star_rarity);
      const tier = rarity === 5 ? 1 : rarity === 4 ? 2 : 3;

      const pricing = unifiedPricingEngine.calculatePrice({
        assetType: 'character',
        name: row.character_name,
        era: 'modern',
        franchiseTier: tier
      });

      return {
        symbol,
        name: row.character_name,
        type: 'character',
        description: `${row.character_name} - Genshin Impact`,
        imageUrl: null,
        category: 'character',
        metadata: {
          source: 'kaggle_genshin',
          franchise: 'Genshin Impact',
          rarity,
          region: row.region,
          vision: row.vision,
          weaponType: row.weapon_type,
          tier
        },
        pricing: {
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          source: 'kaggle_genshin',
          lastUpdated: new Date().toISOString(),
          breakdown: pricing.breakdown
        }
      };
    });

    return await this.assetService.insertPricedAssets(assets);
  }

  async processHonkai(csvPath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: HonkaiRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`⭐ Processing ${records.length} Honkai Star Rail characters...`);

    const assets = records.filter(row => row.character).map(row => {
      const symbol = this.generateSymbol(row.character, 'honkai');
      const rarity = parseInt(row.rarity);
      const tier = rarity === 5 ? 1 : rarity === 4 ? 2 : 3;

      const pricing = unifiedPricingEngine.calculatePrice({
        assetType: 'character',
        name: row.character,
        era: 'modern',
        franchiseTier: tier
      });

      return {
        symbol,
        name: row.character,
        type: 'character',
        description: `${row.character} - Honkai Star Rail`,
        imageUrl: null,
        category: 'character',
        metadata: {
          source: 'kaggle_honkai',
          franchise: 'Honkai Star Rail',
          rarity,
          path: row.path,
          combatType: row.combat_type,
          tier
        },
        pricing: {
          currentPrice: pricing.sharePrice,
          totalMarketValue: pricing.totalMarketValue,
          totalFloat: pricing.totalFloat,
          source: 'kaggle_honkai',
          lastUpdated: new Date().toISOString(),
          breakdown: pricing.breakdown
        }
      };
    });

    return await this.assetService.insertPricedAssets(assets);
  }

  async processAll(): Promise<{ inserted: number; skipped: number; errors: number }> {
    const results = {
      indieComics: await this.processIndieComics([
        '/tmp/kaggle_expansion/indie_comics/dark-horse-fandom-data.csv',
        '/tmp/kaggle_expansion/indie_comics/dynamite-fandom-data.csv',
        '/tmp/kaggle_expansion/indie_comics/image-fandom-data.csv',
        '/tmp/kaggle_expansion/indie_comics/valiant-fandom-data.csv'
      ]),
      dbz: await this.processDBZ('/tmp/kaggle_expansion/dbz/dragon_ball_z.csv'),
      anime: await this.processAnimeCharacters('/tmp/kaggle_expansion/anime_chars/top_anime_characters_cleaned.csv'),
      genshin: await this.processGenshin('/tmp/kaggle_expansion/genshin/genshin_characters_v1.csv'),
      honkai: await this.processHonkai('/tmp/kaggle_expansion/honkai/hsr_character-data.csv')
    };

    const total = {
      inserted: Object.values(results).reduce((sum, r) => sum + r.inserted, 0),
      skipped: Object.values(results).reduce((sum, r) => sum + r.skipped, 0),
      errors: Object.values(results).reduce((sum, r) => sum + r.errors, 0)
    };

    console.log(`\n✅ Kaggle Round 2 Complete: ${total.inserted} inserted, ${total.skipped} skipped, ${total.errors} errors`);

    return total;
  }

  private generateSymbol(name: string, prefix: string): string {
    if (!name) {
      name = 'unknown';
    }
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hash = this.simpleHash(normalized + prefix);
    const suffix = hash.substring(0, 11).toUpperCase();
    return `${prefix.substring(0, 3).toUpperCase()}.${suffix}`;
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
}
