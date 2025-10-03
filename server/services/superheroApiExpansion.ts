/**
 * Superhero API Expansion Service
 * Scrapes character data from superheroapi.com to expand tradeable assets
 */

import { storage } from '../storage.js';
import type { InsertAsset } from '@shared/schema.js';

const SUPERHERO_API_BASE = 'https://superheroapi.com/api';
const API_TOKEN = process.env.SUPERHERO_API_TOKEN;

interface SuperheroCharacter {
  id: string;
  name: string;
  powerstats: {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
  };
  biography: {
    'full-name': string;
    'alter-egos': string;
    aliases: string[];
    'place-of-birth': string;
    'first-appearance': string;
    publisher: string;
    alignment: string;
  };
  appearance: {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    'group-affiliation': string;
    relatives: string;
  };
  image: {
    url: string;
  };
}

export class SuperheroApiExpansionService {
  /**
   * Fetch character by ID
   */
  static async fetchCharacterById(id: number): Promise<SuperheroCharacter | null> {
    if (!API_TOKEN) {
      console.error('SUPERHERO_API_TOKEN not configured');
      return null;
    }

    try {
      const response = await fetch(`${SUPERHERO_API_BASE}/${API_TOKEN}/${id}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch character ${id}:`, response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.response === 'error') {
        return null; // Character doesn't exist
      }

      return data as SuperheroCharacter;
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      return null;
    }
  }

  /**
   * Search characters by name
   */
  static async searchCharacter(name: string): Promise<SuperheroCharacter[]> {
    if (!API_TOKEN) {
      console.error('SUPERHERO_API_TOKEN not configured');
      return [];
    }

    try {
      const response = await fetch(`${SUPERHERO_API_BASE}/${API_TOKEN}/search/${encodeURIComponent(name)}`);
      
      if (!response.ok) {
        console.error(`Failed to search for "${name}":`, response.status);
        return [];
      }

      const data = await response.json();
      
      if (data.response === 'error' || !data.results) {
        return [];
      }

      return data.results as SuperheroCharacter[];
    } catch (error) {
      console.error(`Error searching for "${name}":`, error);
      return [];
    }
  }

  /**
   * Expand database with all Superhero API characters (IDs 1-731)
   */
  static async expandAll(): Promise<{ processed: number; created: number; skipped: number; errors: number }> {
    console.log('🦸 Starting Superhero API expansion...');
    
    let processed = 0;
    let created = 0;
    let skipped = 0;
    let errors = 0;

    const MAX_ID = 731; // Superhero API has ~731 characters
    const BATCH_SIZE = 10; // Process 10 at a time to respect rate limits

    for (let startId = 1; startId <= MAX_ID; startId += BATCH_SIZE) {
      const endId = Math.min(startId + BATCH_SIZE - 1, MAX_ID);
      const promises = [];

      for (let id = startId; id <= endId; id++) {
        promises.push(this.processCharacter(id));
      }

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result === 'created') created++;
        else if (result === 'skipped') skipped++;
        else if (result === 'error') errors++;
        processed++;
      });

      console.log(`📊 Progress: ${processed}/${MAX_ID} processed (${created} created, ${skipped} skipped, ${errors} errors)`);

      // Rate limit protection: wait 1 second between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Superhero API expansion complete: ${created} characters added`);
    return { processed, created, skipped, errors };
  }

  /**
   * Process a single character
   */
  private static async processCharacter(id: number): Promise<'created' | 'skipped' | 'error'> {
    try {
      const character = await this.fetchCharacterById(id);
      
      if (!character) {
        return 'skipped';
      }

      // Generate deterministic symbol
      const symbol = this.generateSymbol(character.name);

      // Check if already exists
      const existing = await storage.getAssetBySymbol(symbol);
      if (existing) {
        return 'skipped';
      }

      // Create asset
      const asset: InsertAsset = {
        symbol,
        name: character.name,
        type: 'character',
        description: `${character.biography['full-name'] || character.name} - ${character.biography.publisher}`,
        totalShares: '1000000', // 1M shares per character
        availableShares: '1000000',
        metadata: {
          source: 'superhero_api',
          superheroApiId: character.id,
          publisher: character.biography.publisher || 'Unknown',
          powerstats: character.powerstats,
          biography: character.biography,
          appearance: character.appearance,
          work: character.work,
          connections: character.connections,
          imageUrl: character.image.url,
        },
      };

      await storage.createAsset(asset);
      return 'created';

    } catch (error) {
      console.error(`Error processing character ${id}:`, error);
      return 'error';
    }
  }

  /**
   * Generate deterministic trading symbol from character name
   */
  private static generateSymbol(name: string): string {
    const cleaned = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8);
    
    return `SH${cleaned}`;
  }
}
