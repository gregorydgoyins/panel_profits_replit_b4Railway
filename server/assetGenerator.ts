/**
 * Asset Generation Engine
 * Pulls from Comic Vine, Marvel, and Superhero APIs to create comprehensive asset universe
 */

import crypto from 'crypto';
import { tickerGenerator } from './tickerGenerator.js';
import { db } from './db.js';
import { assets, insertAssetSchema } from '../shared/schema.js';

interface AssetData {
  name: string;
  description: string;
  category: 'character' | 'creator' | 'issue' | 'location' | 'team' | 'publisher';
  metadata: Record<string, any>;
  estimatedMarketCap: number; // In dollars
  popularity: number; // 1-100
}

export class AssetGenerator {
  private readonly COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;
  private readonly MARVEL_PUBLIC_KEY = process.env.MARVEL_API_PUBLIC_KEY;
  private readonly MARVEL_PRIVATE_KEY = process.env.MARVEL_API_PRIVATE_KEY;
  private readonly SUPERHERO_API_TOKEN = process.env.SUPERHERO_API_TOKEN;

  /**
   * Calculate share float based on market cap to keep price in desired range
   * Target: Most assets should be $1-$500/share
   */
  private calculateFloat(marketCap: number, targetPriceRange: [number, number] = [50, 200]): number {
    const [minPrice, maxPrice] = targetPriceRange;
    const targetPrice = (minPrice + maxPrice) / 2;
    
    // Float = Market Cap / Target Price
    const float = Math.floor(marketCap / targetPrice);
    
    // Round to nice numbers
    if (float < 1000) return Math.ceil(float / 100) * 100;
    if (float < 10000) return Math.ceil(float / 1000) * 1000;
    if (float < 100000) return Math.ceil(float / 10000) * 10000;
    if (float < 1000000) return Math.ceil(float / 100000) * 100000;
    return Math.ceil(float / 1000000) * 1000000;
  }

  /**
   * Calculate initial price based on float
   */
  private calculateInitialPrice(marketCap: number, float: number): number {
    return Number((marketCap / float).toFixed(2));
  }

  /**
   * Fetch characters from Comic Vine
   */
  async fetchComicVineCharacters(limit: number = 100): Promise<AssetData[]> {
    if (!this.COMIC_VINE_API_KEY) {
      console.warn('Comic Vine API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://comicvine.gamespot.com/api/characters/?api_key=${this.COMIC_VINE_API_KEY}&format=json&limit=${limit}&sort=name:asc`,
        {
          headers: {
            'User-Agent': 'Panel Profits Trading Platform'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Comic Vine API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return (data.results || []).map((char: any) => ({
        name: char.name,
        description: char.deck || char.description || `${char.name} is a character from the comic book universe.`,
        category: 'character' as const,
        metadata: {
          publisher: char.publisher?.name,
          realName: char.real_name,
          aliases: char.aliases,
          firstAppearance: char.first_appeared_in_issue?.name,
          imageUrl: char.image?.medium_url,
          comicVineId: char.id
        },
        estimatedMarketCap: this.estimateCharacterMarketCap(char),
        popularity: this.calculatePopularity(char)
      }));
    } catch (error) {
      console.error('Error fetching from Comic Vine:', error);
      return [];
    }
  }

  /**
   * Fetch characters from Marvel API
   */
  async fetchMarvelCharacters(limit: number = 100): Promise<AssetData[]> {
    if (!this.MARVEL_PUBLIC_KEY || !this.MARVEL_PRIVATE_KEY) {
      console.warn('Marvel API keys not found');
      return [];
    }

    try {
      const ts = Date.now().toString();
      const hash = crypto
        .createHash('md5')
        .update(ts + this.MARVEL_PRIVATE_KEY + this.MARVEL_PUBLIC_KEY)
        .digest('hex');

      const response = await fetch(
        `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${this.MARVEL_PUBLIC_KEY}&hash=${hash}&limit=${limit}&orderBy=name`
      );

      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.statusText}`);
      }

      const data = await response.json();

      return (data.data?.results || []).map((char: any) => ({
        name: char.name,
        description: char.description || `${char.name} is a Marvel Universe character.`,
        category: 'character' as const,
        metadata: {
          publisher: 'Marvel Comics',
          comics: char.comics?.available,
          series: char.series?.available,
          stories: char.stories?.available,
          imageUrl: `${char.thumbnail?.path}.${char.thumbnail?.extension}`,
          marvelId: char.id
        },
        estimatedMarketCap: this.estimateMarvelCharacterMarketCap(char),
        popularity: this.calculateMarvelPopularity(char)
      }));
    } catch (error) {
      console.error('Error fetching from Marvel API:', error);
      return [];
    }
  }

  /**
   * Fetch character data from Superhero API
   */
  async fetchSuperheroCharacters(ids: number[]): Promise<AssetData[]> {
    if (!this.SUPERHERO_API_TOKEN) {
      console.warn('Superhero API token not found');
      return [];
    }

    const characters: AssetData[] = [];

    for (const id of ids) {
      try {
        const response = await fetch(
          `https://superheroapi.com/api/${this.SUPERHERO_API_TOKEN}/${id}`
        );

        if (!response.ok) continue;

        const char = await response.json();

        characters.push({
          name: char.name,
          description: `${char.name} - ${char.biography?.['full-name'] || 'Superhero'}`,
          category: 'character' as const,
          metadata: {
            publisher: char.biography?.publisher,
            realName: char.biography?.['full-name'],
            aliases: char.biography?.aliases,
            alignment: char.biography?.alignment,
            race: char.appearance?.race,
            gender: char.appearance?.gender,
            occupation: char.work?.occupation,
            imageUrl: char.image?.url,
            powerstats: char.powerstats
          },
          estimatedMarketCap: this.estimateSuperheroMarketCap(char),
          popularity: this.calculateSuperheroPopularity(char)
        });
      } catch (error) {
        console.error(`Error fetching superhero ${id}:`, error);
      }
    }

    return characters;
  }

  /**
   * Estimate market cap for Comic Vine character
   */
  private estimateCharacterMarketCap(char: any): number {
    let baseCap = 1000000; // $1M base

    // Adjust based on issue count
    const issueCount = char.count_of_issue_appearances || 0;
    baseCap += issueCount * 10000;

    // Adjust for major publishers
    const publisher = char.publisher?.name?.toLowerCase() || '';
    if (publisher.includes('marvel') || publisher.includes('dc')) {
      baseCap *= 5;
    }

    return Math.min(baseCap, 10000000000); // Cap at $10B
  }

  /**
   * Estimate market cap for Marvel character
   */
  private estimateMarvelCharacterMarketCap(char: any): number {
    let baseCap = 5000000; // $5M base for Marvel characters

    // Comics appearances
    baseCap += (char.comics?.available || 0) * 20000;
    baseCap += (char.series?.available || 0) * 50000;
    baseCap += (char.stories?.available || 0) * 5000;

    return Math.min(baseCap, 20000000000); // Cap at $20B
  }

  /**
   * Estimate market cap for Superhero API character
   */
  private estimateSuperheroMarketCap(char: any): number {
    let baseCap = 2000000; // $2M base

    // Adjust based on power stats
    const powerTotal = Object.values(char.powerstats || {})
      .reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
    
    baseCap += powerTotal * 10000;

    // Premium for major publishers
    const publisher = char.biography?.publisher?.toLowerCase() || '';
    if (publisher.includes('marvel') || publisher.includes('dc')) {
      baseCap *= 3;
    }

    return Math.min(baseCap, 15000000000); // Cap at $15B
  }

  /**
   * Calculate popularity score (1-100)
   */
  private calculatePopularity(char: any): number {
    let score = 50; // Base

    const appearances = char.count_of_issue_appearances || 0;
    score += Math.min(appearances / 10, 30);

    const publisher = char.publisher?.name?.toLowerCase() || '';
    if (publisher.includes('marvel') || publisher.includes('dc')) {
      score += 15;
    }

    return Math.min(Math.round(score), 100);
  }

  private calculateMarvelPopularity(char: any): number {
    let score = 60; // Base for Marvel

    score += Math.min((char.comics?.available || 0) / 20, 20);
    score += Math.min((char.series?.available || 0) / 5, 15);

    return Math.min(Math.round(score), 100);
  }

  private calculateSuperheroPopularity(char: any): number {
    let score = 55; // Base

    const powerTotal = Object.values(char.powerstats || {})
      .reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
    
    score += Math.min(powerTotal / 30, 25);

    const publisher = char.biography?.publisher?.toLowerCase() || '';
    if (publisher.includes('marvel') || publisher.includes('dc')) {
      score += 15;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Generate and insert assets into database
   */
  async generateAssets(assetData: AssetData[]): Promise<number> {
    let inserted = 0;

    for (const data of assetData) {
      try {
        // Generate ticker
        const ticker = tickerGenerator.generateTicker({ 
          baseName: data.name,
          type: 'stock'
        });

        // Calculate float and price
        const float = this.calculateFloat(data.estimatedMarketCap);
        const initialPrice = this.calculateInitialPrice(data.estimatedMarketCap, float);

        // Create asset
        const asset = {
          name: data.name,
          symbol: ticker,
          type: data.category,
          description: data.description,
          publisher: data.metadata.publisher || 'Unknown',
          currentPrice: initialPrice,
          dayChange: 0,
          dayChangePercent: 0,
          volume: Math.floor(float * 0.01), // 1% of float as daily volume
          marketCap: data.estimatedMarketCap,
          peRatio: Math.random() * 30 + 10,
          high52Week: initialPrice * 1.5,
          low52Week: initialPrice * 0.5,
          avgVolume: Math.floor(float * 0.01),
          beta: Math.random() * 2,
          dividendYield: 0,
          exDividendDate: null,
          imageUrl: data.metadata.imageUrl,
          metadata: data.metadata
        };

        const validated = insertAssetSchema.parse(asset);
        await db.insert(assets).values(validated);
        
        inserted++;
        console.log(`✅ Created ${ticker} - ${data.name} ($${initialPrice}/share, ${float.toLocaleString()} float)`);
      } catch (error) {
        console.error(`Failed to create asset for ${data.name}:`, error);
      }
    }

    return inserted;
  }

  /**
   * Generate comprehensive asset universe
   */
  async generateAssetUniverse(options: {
    comicVineCharacters?: number;
    marvelCharacters?: number;
    superheroIds?: number[];
  } = {}): Promise<void> {
    const {
      comicVineCharacters = 100,
      marvelCharacters = 100,
      superheroIds = []
    } = options;

    console.log('🚀 Starting asset generation...\n');

    const allAssetData: AssetData[] = [];

    // Fetch from Comic Vine
    if (comicVineCharacters > 0) {
      console.log(`📚 Fetching ${comicVineCharacters} characters from Comic Vine...`);
      const cvData = await this.fetchComicVineCharacters(comicVineCharacters);
      allAssetData.push(...cvData);
      console.log(`✅ Fetched ${cvData.length} Comic Vine characters\n`);
    }

    // Fetch from Marvel
    if (marvelCharacters > 0) {
      console.log(`🦸 Fetching ${marvelCharacters} characters from Marvel API...`);
      const marvelData = await this.fetchMarvelCharacters(marvelCharacters);
      allAssetData.push(...marvelData);
      console.log(`✅ Fetched ${marvelData.length} Marvel characters\n`);
    }

    // Fetch from Superhero API
    if (superheroIds.length > 0) {
      console.log(`💪 Fetching ${superheroIds.length} characters from Superhero API...`);
      const superheroData = await this.fetchSuperheroCharacters(superheroIds);
      allAssetData.push(...superheroData);
      console.log(`✅ Fetched ${superheroData.length} Superhero API characters\n`);
    }

    // Generate and insert assets
    console.log(`\n💾 Generating assets in database...`);
    const inserted = await this.generateAssets(allAssetData);
    
    console.log(`\n✨ Asset generation complete!`);
    console.log(`📊 Total assets created: ${inserted}`);
    console.log(`🎯 Ticker space used: ${tickerGenerator.getStats().totalUsed.toLocaleString()}`);
  }
}

export const assetGenerator = new AssetGenerator();
