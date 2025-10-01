/**
 * Asset Generation Engine
 * Pulls from Comic Vine, Marvel, and Superhero APIs to create comprehensive asset universe
 */

import crypto from 'crypto';
import { tickerGenerator, type AssetCategory } from './tickerGenerator.js';
import { db } from './databaseStorage';
import { assets, insertAssetSchema } from '../shared/schema.js';

interface AssetData {
  name: string;
  description: string;
  category: AssetCategory;
  series?: string;          // e.g., "Detective Comics", "Amazing Spider-Man"
  year?: number;            // e.g., 1939, 1963
  metadata: Record<string, any>;
  estimatedMarketCap: number; // In dollars
  popularity: number; // 1-100
}

/**
 * Determine asset category based on metadata
 * Categories: HER, VIL, GAD, LOC, KEY, CRT, TEM, SID, HEN
 */
function determineCategory(char: any, source: 'comicvine' | 'marvel' | 'superhero'): AssetCategory {
  const name = (char.name || '').toLowerCase();
  const description = (char.description || char.deck || '').toLowerCase();
  const alignment = char.biography?.alignment?.toLowerCase() || '';
  
  // Check for creators (writers, artists, editors)
  if (char.resource_type === 'person' || 
      char.api_detail_url?.includes('/people/') ||
      description.includes('writer') || 
      description.includes('artist') || 
      description.includes('created by') ||
      description.includes('creator') ||
      char.creator_credits) {
    return 'CRT';
  }

  // Check for comic issues (key issues)
  if (char.issue_number || 
      char.volume?.name || 
      char.resource_type === 'issue' ||
      name.includes('#') ||
      description.includes('issue #')) {
    return 'KEY';
  }

  // Check for teams/groups
  if (char.resource_type === 'team' ||
      char.api_detail_url?.includes('/teams/') ||
      description.includes('team of') ||
      description.includes('group of') ||
      description.includes('squad') ||
      description.includes('league') ||
      description.includes('alliance') ||
      name.includes('team') ||
      name.includes('squad') ||
      name.includes('force')) {
    return 'TEM';
  }

  // Check for locations
  if (char.resource_type === 'location' ||
      char.api_detail_url?.includes('/locations/') ||
      description.includes('city') ||
      description.includes('planet') ||
      description.includes('dimension') ||
      description.includes('realm') ||
      description.includes('kingdom') ||
      description.includes('island') ||
      name.includes('city') ||
      name.includes('island')) {
    return 'LOC';
  }

  // Check for gadgets/objects/weapons
  if (char.resource_type === 'object' ||
      char.api_detail_url?.includes('/objects/') ||
      description.includes('weapon') ||
      description.includes('device') ||
      description.includes('artifact') ||
      description.includes('gadget') ||
      description.includes('armor') ||
      description.includes('suit') ||
      description.includes('shield') ||
      description.includes('hammer') ||
      description.includes('ring') ||
      name.includes('armor') ||
      name.includes('suit')) {
    return 'GAD';
  }

  // Character categorization (heroes, villains, sidekicks, henchmen)
  if (alignment === 'bad' || 
      alignment === 'evil' || 
      description.includes('villain') ||
      description.includes('enemy of') ||
      description.includes('nemesis') ||
      description.includes('archenemy')) {
    return 'VIL';
  }
  
  if (description.includes('sidekick') || 
      description.includes('partner of') ||
      description.includes('protégé')) {
    return 'SID';
  }
  
  if (description.includes('henchman') || 
      description.includes('hench') ||
      description.includes('minion') ||
      description.includes('lackey')) {
    return 'HEN';
  }
  
  // Default to hero for characters
  return 'HER';
}

/**
 * Extract series and year from metadata
 */
function extractSeriesAndYear(char: any): { series?: string; year?: number } {
  let series: string | undefined;
  let year: number | undefined;

  // Try to get first appearance info
  if (char.first_appeared_in_issue?.volume?.name) {
    series = char.first_appeared_in_issue.volume.name;
  } else if (char.series?.items?.[0]?.name) {
    series = char.series.items[0].name;
  } else if (char.publisher?.name) {
    series = char.publisher.name + ' Comics';
  }

  // Try to extract year from first appearance
  if (char.first_appeared_in_issue?.cover_date) {
    const match = char.first_appeared_in_issue.cover_date.match(/(\d{4})/);
    if (match) year = parseInt(match[1]);
  } else if (char.start_year) {
    year = parseInt(char.start_year);
  }

  return { series, year };
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
  async fetchComicVineCharacters(limit: number = 100, offset: number = 0): Promise<AssetData[]> {
    if (!this.COMIC_VINE_API_KEY) {
      console.warn('Comic Vine API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://comicvine.gamespot.com/api/characters/?api_key=${this.COMIC_VINE_API_KEY}&format=json&limit=${limit}&offset=${offset}&sort=name:asc`,
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
      
      return (data.results || []).map((char: any) => {
        const category = determineCategory(char, 'comicvine');
        const { series, year } = extractSeriesAndYear(char);
        
        return {
          name: char.name,
          description: char.deck || char.description || `${char.name} is a character from the comic book universe.`,
          category,
          series: series || char.publisher?.name || 'Unknown',
          year,
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
        };
      });
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

      return (data.data?.results || []).map((char: any) => {
        const category = determineCategory(char, 'marvel');
        const series = char.series?.items?.[0]?.name || 'Marvel Comics';
        const year = char.modified ? new Date(char.modified).getFullYear() : undefined;
        
        return {
          name: char.name,
          description: char.description || `${char.name} is a Marvel Universe character.`,
          category,
          series,
          year,
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
        };
      });
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

        const category = determineCategory(char, 'superhero');
        const series = char.biography?.publisher || 'Unknown';
        const year = char.biography?.['first-appearance']?.match(/(\d{4})/)?.[1] 
          ? parseInt(char.biography['first-appearance'].match(/(\d{4})/)[1]) 
          : undefined;
        
        characters.push({
          name: char.name,
          description: `${char.name} - ${char.biography?.['full-name'] || 'Superhero'}`,
          category,
          series,
          year,
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
   * Fetch teams from Comic Vine
   */
  async fetchComicVineTeams(limit: number = 100): Promise<AssetData[]> {
    if (!this.COMIC_VINE_API_KEY) {
      console.warn('Comic Vine API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://comicvine.gamespot.com/api/teams/?api_key=${this.COMIC_VINE_API_KEY}&format=json&limit=${limit}&sort=name:asc`,
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
      
      return (data.results || []).map((team: any) => {
        const category = determineCategory(team, 'comicvine');
        const { series, year } = extractSeriesAndYear(team);
        
        return {
          name: team.name,
          description: team.deck || team.description || `${team.name} is a team from the comic book universe.`,
          category,
          series: series || team.publisher?.name || 'Unknown',
          year,
          metadata: {
            publisher: team.publisher?.name,
            firstAppearance: team.first_appeared_in_issue?.name,
            imageUrl: team.image?.medium_url,
            comicVineId: team.id,
            characterCount: team.count_of_team_members
          },
          estimatedMarketCap: this.estimateCharacterMarketCap(team),
          popularity: this.calculatePopularity(team)
        };
      });
    } catch (error) {
      console.error('Error fetching teams from Comic Vine:', error);
      return [];
    }
  }

  /**
   * Fetch locations from Comic Vine
   */
  async fetchComicVineLocations(limit: number = 100): Promise<AssetData[]> {
    if (!this.COMIC_VINE_API_KEY) {
      console.warn('Comic Vine API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://comicvine.gamespot.com/api/locations/?api_key=${this.COMIC_VINE_API_KEY}&format=json&limit=${limit}&sort=name:asc`,
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
      
      return (data.results || []).map((loc: any) => {
        const category = determineCategory(loc, 'comicvine');
        const { series, year } = extractSeriesAndYear(loc);
        
        return {
          name: loc.name,
          description: loc.deck || loc.description || `${loc.name} is a location from the comic book universe.`,
          category,
          series: series || 'Unknown',
          year,
          metadata: {
            firstAppearance: loc.first_appeared_in_issue?.name,
            imageUrl: loc.image?.medium_url,
            comicVineId: loc.id
          },
          estimatedMarketCap: this.estimateCharacterMarketCap(loc),
          popularity: this.calculatePopularity(loc)
        };
      });
    } catch (error) {
      console.error('Error fetching locations from Comic Vine:', error);
      return [];
    }
  }

  /**
   * Fetch objects/gadgets from Comic Vine
   */
  async fetchComicVineObjects(limit: number = 100): Promise<AssetData[]> {
    if (!this.COMIC_VINE_API_KEY) {
      console.warn('Comic Vine API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://comicvine.gamespot.com/api/objects/?api_key=${this.COMIC_VINE_API_KEY}&format=json&limit=${limit}&sort=name:asc`,
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
      
      return (data.results || []).map((obj: any) => {
        const category = determineCategory(obj, 'comicvine');
        const { series, year } = extractSeriesAndYear(obj);
        
        return {
          name: obj.name,
          description: obj.deck || obj.description || `${obj.name} is an object from the comic book universe.`,
          category,
          series: series || 'Unknown',
          year,
          metadata: {
            firstAppearance: obj.first_appeared_in_issue?.name,
            imageUrl: obj.image?.medium_url,
            comicVineId: obj.id
          },
          estimatedMarketCap: this.estimateCharacterMarketCap(obj),
          popularity: this.calculatePopularity(obj)
        };
      });
    } catch (error) {
      console.error('Error fetching objects from Comic Vine:', error);
      return [];
    }
  }

  /**
   * Fetch creators from Comic Vine
   */
  async fetchComicVineCreators(limit: number = 100): Promise<AssetData[]> {
    if (!this.COMIC_VINE_API_KEY) {
      console.warn('Comic Vine API key not found');
      return [];
    }

    try {
      const response = await fetch(
        `https://comicvine.gamespot.com/api/people/?api_key=${this.COMIC_VINE_API_KEY}&format=json&limit=${limit}&sort=name:asc`,
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
      
      return (data.results || []).map((person: any) => {
        const category = determineCategory(person, 'comicvine');
        const year = person.birth ? new Date(person.birth).getFullYear() : undefined;
        
        return {
          name: person.name,
          description: person.deck || person.description || `${person.name} is a comic book creator.`,
          category,
          series: 'Comics Industry',
          year,
          metadata: {
            birth: person.birth,
            death: person.death,
            country: person.country,
            hometown: person.hometown,
            imageUrl: person.image?.medium_url,
            comicVineId: person.id
          },
          estimatedMarketCap: this.estimateCharacterMarketCap(person),
          popularity: this.calculatePopularity(person)
        };
      });
    } catch (error) {
      console.error('Error fetching creators from Comic Vine:', error);
      return [];
    }
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
        // Generate hierarchical ticker: SERIES.YEAR.CATEGORY.INDEX
        const ticker = tickerGenerator.generateHierarchicalTicker({
          series: data.series || 'Unknown',
          year: data.year,
          category: data.category,
          name: data.name
        });

        // Calculate float and price
        const float = this.calculateFloat(data.estimatedMarketCap);
        const initialPrice = this.calculateInitialPrice(data.estimatedMarketCap, float);

        // Create asset with only the fields that exist in the schema
        const asset = {
          symbol: ticker,
          name: data.name,
          type: data.category,
          description: data.description,
          imageUrl: data.metadata.imageUrl,
          metadata: {
            ...data.metadata,
            publisher: data.metadata.publisher || 'Unknown',
            estimatedMarketCap: data.estimatedMarketCap,
            float: float,
            initialPrice: initialPrice,
            popularity: data.popularity
          }
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
   * Generate comprehensive asset universe across all categories
   */
  async generateAssetUniverse(options: {
    comicVineCharacters?: number;
    comicVineTeams?: number;
    comicVineLocations?: number;
    comicVineObjects?: number;
    comicVineCreators?: number;
    marvelCharacters?: number;
    superheroIds?: number[];
  } = {}): Promise<void> {
    const {
      comicVineCharacters = 100,
      comicVineTeams = 50,
      comicVineLocations = 50,
      comicVineObjects = 50,
      comicVineCreators = 50,
      marvelCharacters = 100,
      superheroIds = []
    } = options;

    console.log('🚀 Starting comprehensive asset generation...\n');

    const allAssetData: AssetData[] = [];

    // Fetch characters from Comic Vine
    if (comicVineCharacters > 0) {
      console.log(`📚 Fetching ${comicVineCharacters} characters from Comic Vine...`);
      const cvData = await this.fetchComicVineCharacters(comicVineCharacters);
      allAssetData.push(...cvData);
      console.log(`✅ Fetched ${cvData.length} Comic Vine characters\n`);
    }

    // Fetch teams from Comic Vine
    if (comicVineTeams > 0) {
      console.log(`👥 Fetching ${comicVineTeams} teams from Comic Vine...`);
      const teams = await this.fetchComicVineTeams(comicVineTeams);
      allAssetData.push(...teams);
      console.log(`✅ Fetched ${teams.length} Comic Vine teams\n`);
    }

    // Fetch locations from Comic Vine
    if (comicVineLocations > 0) {
      console.log(`🌍 Fetching ${comicVineLocations} locations from Comic Vine...`);
      const locations = await this.fetchComicVineLocations(comicVineLocations);
      allAssetData.push(...locations);
      console.log(`✅ Fetched ${locations.length} Comic Vine locations\n`);
    }

    // Fetch objects/gadgets from Comic Vine
    if (comicVineObjects > 0) {
      console.log(`🔧 Fetching ${comicVineObjects} objects from Comic Vine...`);
      const objects = await this.fetchComicVineObjects(comicVineObjects);
      allAssetData.push(...objects);
      console.log(`✅ Fetched ${objects.length} Comic Vine objects\n`);
    }

    // Fetch creators from Comic Vine
    if (comicVineCreators > 0) {
      console.log(`✍️ Fetching ${comicVineCreators} creators from Comic Vine...`);
      const creators = await this.fetchComicVineCreators(comicVineCreators);
      allAssetData.push(...creators);
      console.log(`✅ Fetched ${creators.length} Comic Vine creators\n`);
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
    
    // Display category breakdown
    const categoryBreakdown = allAssetData.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Category Breakdown:');
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} assets`);
    });
  }
}

export const assetGenerator = new AssetGenerator();
