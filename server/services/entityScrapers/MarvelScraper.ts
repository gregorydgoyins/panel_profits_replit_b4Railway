import { BaseEntityScraper, EntityData, ScraperConfig } from './BaseEntityScraper';
import crypto from 'crypto';

interface MarvelCharacterResponse {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: MarvelCharacter[];
  };
}

interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  events: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export class MarvelScraper extends BaseEntityScraper {
  private publicKey: string;
  private privateKey: string;
  private baseUrl = 'https://gateway.marvel.com/v1/public';
  private requestDelay = 1000; // 1 second between requests to respect rate limits

  constructor() {
    const config: ScraperConfig = {
      sourceName: 'marvel',
      sourceReliability: 0.95,
      rateLimit: 1000,
      maxRetries: 3,
      timeout: 10000,
    };
    
    super(config);
    
    this.publicKey = process.env.MARVEL_PUBLIC_KEY || '';
    this.privateKey = process.env.MARVEL_PRIVATE_KEY || '';
    
    if (!this.publicKey || !this.privateKey) {
      console.warn('Marvel API keys not configured. Set MARVEL_PUBLIC_KEY and MARVEL_PRIVATE_KEY environment variables.');
    }
  }

  async scrapeEntities(query?: { entityType?: string; publisher?: string; limit?: number; offset?: number }): Promise<EntityData[]> {
    if (!this.publicKey || !this.privateKey) {
      console.error('Marvel API keys not configured');
      return [];
    }

    const limit = query?.limit || 20;
    const offset = query?.offset || 0;

    try {
      const searchUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters`, {
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data: MarvelCharacterResponse = await response.json();
      
      return data.data.results.map(character => this.mapToEntityData(character));
      
    } catch (error) {
      console.error('Marvel scraper error:', error);
      return [];
    }
  }

  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    if (!this.publicKey || !this.privateKey) {
      console.error('Marvel API keys not configured');
      return null;
    }

    try {
      // Get character by ID
      const characterUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters/${sourceEntityId}`);

      const response = await fetch(characterUrl);
      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data: MarvelCharacterResponse = await response.json();
      
      if (data.code !== 200 || data.data.count === 0) {
        console.log(`No Marvel data found for ID: ${sourceEntityId}`);
        return null;
      }

      const character = data.data.results[0];
      return this.mapToEntityData(character);
      
    } catch (error) {
      console.error(`Marvel scraper error for ${sourceEntityId}:`, error);
      return null;
    }
  }

  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    if (!this.publicKey || !this.privateKey) {
      return false;
    }

    try {
      const searchUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters`, {
        nameStartsWith: entityName,
        limit: '1'
      });

      const response = await fetch(searchUrl);
      if (!response.ok) {
        return false;
      }

      const data: MarvelCharacterResponse = await response.json();
      return data.code === 200 && data.data.count > 0;
      
    } catch (error) {
      console.error(`Marvel hasEntityData error for ${entityName}:`, error);
      return false;
    }
  }

  private buildAuthenticatedUrl(endpoint: string, params: Record<string, string> = {}): string {
    const ts = Date.now().toString();
    const hash = crypto
      .createHash('md5')
      .update(ts + this.privateKey + this.publicKey)
      .digest('hex');

    const urlParams = new URLSearchParams({
      ts,
      apikey: this.publicKey,
      hash,
      ...params,
    });

    return `${endpoint}?${urlParams.toString()}`;
  }

  private findBestMatch(characters: MarvelCharacter[], searchName: string): MarvelCharacter | null {
    if (characters.length === 0) return null;
    
    const normalizedSearch = searchName.toLowerCase().trim();
    
    // Try exact match first
    const exactMatch = characters.find(
      c => c.name.toLowerCase().trim() === normalizedSearch
    );
    if (exactMatch) return exactMatch;
    
    // Try prefix match
    const prefixMatch = characters.find(
      c => c.name.toLowerCase().trim().startsWith(normalizedSearch)
    );
    if (prefixMatch) return prefixMatch;
    
    // Return first result if no better match
    return characters[0];
  }

  private mapToEntityData(character: MarvelCharacter): EntityData {
    const entityData: EntityData = {
      entityId: `marvel-${character.id}`,
      entityName: character.name,
      entityType: 'character',
      publisher: 'Marvel Comics',
      firstAppearance: this.extractFirstAppearance(character),
      attributes: this.extractAttributes(character),
      relationships: [], // Marvel API doesn't provide relationship data
      appearances: this.extractAppearances(character),
      sourceEntityId: character.id.toString(),
      sourceUrl: character.urls.find(u => u.type === 'detail')?.url || character.resourceURI,
      sourceData: character,
    };

    return entityData;
  }

  private extractFirstAppearance(character: MarvelCharacter): EntityData['firstAppearance'] {
    // Marvel API doesn't provide publication dates in the comics list
    // Cannot reliably determine first appearance without additional API calls
    // Consensus system will rely on WikiScraper and SuperHero API for first appearances
    // (both have dedicated first appearance fields)
    return undefined;
  }

  private extractAttributes(character: MarvelCharacter): EntityData['attributes'] {
    const attributes: EntityData['attributes'] = [];

    // Marvel API only provides description, not detailed powers
    // We'll extract what we can and mark it appropriately
    if (character.description) {
      attributes.push({
        category: 'ability',
        name: 'Biography',
        description: character.description,
        isActive: true,
      });
    }

    return attributes;
  }

  private extractAppearances(character: MarvelCharacter): EntityData['appearances'] {
    const appearances: EntityData['appearances'] = [];

    // Extract comic appearances
    for (const comic of character.comics.items.slice(0, 20)) { // Limit to avoid huge lists
      appearances.push({
        comicTitle: comic.name,
        issueNumber: this.extractIssueNumber(comic.name),
        appearanceType: 'main', // Default to main since Marvel API doesn't specify
      });
    }

    return appearances;
  }

  private extractIssueNumber(comicName: string): string | undefined {
    // Extract issue number from comic name like "Amazing Spider-Man (2018) #1"
    const match = comicName.match(/#(\d+)/);
    return match ? match[1] : undefined;
  }
}
