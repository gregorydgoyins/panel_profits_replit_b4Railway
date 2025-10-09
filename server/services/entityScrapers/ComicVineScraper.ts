import { BaseEntityScraper, type EntityData, type ScraperConfig } from './BaseEntityScraper';

interface ComicVineCharacter {
  id: number;
  name: string;
  aliases?: string;
  real_name?: string;
  publisher?: { name: string };
  first_appeared_in_issue?: {
    id: number;
    name: string;
    volume: { name: string };
    cover_date?: string;
    image?: { medium_url: string };
  };
  powers?: Array<{ name: string }>;
  enemies?: Array<{ id: number; name: string }>;
  friends?: Array<{ id: number; name: string }>;
  teams?: Array<{ id: number; name: string }>;
  character_enemies?: Array<{ id: number; name: string }>;
  character_friends?: Array<{ id: number; name: string }>;
  creators?: Array<{ id: number; name: string }>;
  origin?: { name: string };
  image?: { medium_url: string };
  api_detail_url: string;
}

interface ComicVineResponse<T> {
  error: string;
  limit: number;
  offset: number;
  number_of_page_results: number;
  number_of_total_results: number;
  status_code: number;
  results: T;
}

/**
 * Comic Vine scraper - Universal coverage for all comic publishers
 * Covers: Marvel, DC, Dark Horse, Image, IDW, Valiant, Boom, Dynamite, and more
 */
export class ComicVineScraper extends BaseEntityScraper {
  private apiKey: string;
  private baseUrl = 'https://comicvine.gamespot.com/api';
  private publisherCache: Map<string, number> = new Map();
  
  constructor(apiKey: string) {
    super({
      sourceName: 'comic_vine',
      sourceReliability: 0.92,
      rateLimit: 18000, // 200 requests/hour = 1 request per 18 seconds
      maxRetries: 3,
      timeout: 10000,
    });
    this.apiKey = apiKey;
    this.initializePublisherCache();
  }
  
  /**
   * Pre-populate publisher IDs for major publishers
   */
  private initializePublisherCache(): void {
    // Comic Vine publisher IDs (obtained from API documentation/testing)
    this.publisherCache.set('marvel', 31);
    this.publisherCache.set('dc', 10);
    this.publisherCache.set('dark horse', 16);
    this.publisherCache.set('image', 55);
    this.publisherCache.set('idw', 53);
    this.publisherCache.set('valiant', 2190);
    this.publisherCache.set('boom', 2304);
    this.publisherCache.set('dynamite', 2632);
  }
  
  /**
   * Get publisher ID by name (cached or API lookup)
   */
  private async getPublisherId(publisherName: string): Promise<number | null> {
    const normalized = publisherName.toLowerCase();
    
    // Check cache first
    if (this.publisherCache.has(normalized)) {
      return this.publisherCache.get(normalized)!;
    }
    
    // Try API search (MUST include field_list=id,name for Comic Vine to return IDs)
    await this.rateLimit();
    const url = `${this.baseUrl}/publishers/?api_key=${this.apiKey}&format=json&field_list=id,name&filter=name:${encodeURIComponent(publisherName)}&limit=1`;
    
    const response = await this.makeRequest<any[]>(url);
    if (response?.results?.[0]?.id) {
      const id = response.results[0].id;
      this.publisherCache.set(normalized, id);
      return id;
    }
    
    return null;
  }
  
  /**
   * Scrape entities by query
   */
  async scrapeEntities(query?: {
    entityType?: string;
    publisher?: string;
    limit?: number;
    offset?: number;
  }): Promise<EntityData[]> {
    const entityType = query?.entityType || 'character';
    const limit = Math.min(query?.limit || 10, 100); // Comic Vine max 100 per page
    const offset = query?.offset || 0;
    
    await this.rateLimit();
    
    try {
      let endpoint = '';
      let filterParams = '';
      let fieldList = '';
      
      // Get publisher ID if filtering by publisher
      if (query?.publisher) {
        const publisherId = await this.getPublisherId(query.publisher);
        if (publisherId) {
          filterParams = `&filter=publisher:${publisherId}`;
        }
      }
      
      switch (entityType) {
        case 'character':
          endpoint = 'characters';
          fieldList = 'id,name,aliases,real_name,publisher,first_appeared_in_issue,powers,enemies,friends,teams,character_enemies,character_friends,creators,origin,image,api_detail_url';
          break;
        case 'creator':
          endpoint = 'people';
          fieldList = 'id,name,aliases,image,api_detail_url,created_characters';
          // Creators don't have publisher filter
          filterParams = '';
          break;
        case 'location':
          endpoint = 'locations';
          fieldList = 'id,name,aliases,publisher,first_appeared_in_issue,image,api_detail_url';
          break;
        case 'team':
          endpoint = 'teams';
          fieldList = 'id,name,aliases,publisher,first_appeared_in_issue,characters,image,api_detail_url';
          break;
        default:
          endpoint = 'characters';
          fieldList = 'id,name,aliases,real_name,publisher,first_appeared_in_issue,powers,enemies,friends,teams,character_enemies,character_friends,creators,origin,image,api_detail_url';
      }
      
      const url = `${this.baseUrl}/${endpoint}/?api_key=${this.apiKey}&format=json&field_list=${fieldList}&limit=${limit}&offset=${offset}${filterParams}`;
      
      const response = await this.makeRequest<any[]>(url);
      
      if (!response?.results) {
        return [];
      }
      
      let results = response.results;
      
      const entities: EntityData[] = [];
      
      for (const item of results) {
        let entity: EntityData | null = null;
        
        switch (entityType) {
          case 'character':
            entity = await this.parseCharacter(item);
            break;
          case 'creator':
            entity = await this.parseCreator(item);
            break;
          case 'location':
            entity = await this.parseLocation(item);
            break;
          case 'team':
            entity = await this.parseTeam(item);
            break;
        }
        
        if (entity) {
          entities.push(entity);
        }
      }
      
      return entities;
    } catch (error) {
      console.error(`Comic Vine scrape entities error:`, error);
      return [];
    }
  }
  
  /**
   * Scrape single entity by ID
   */
  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    await this.rateLimit();
    
    try {
      const url = `${this.baseUrl}/character/4005-${sourceEntityId}/?api_key=${this.apiKey}&format=json`;
      const response = await this.makeRequest<ComicVineCharacter>(url);
      
      if (!response?.results) {
        return null;
      }
      
      return await this.parseCharacter(response.results);
    } catch (error) {
      console.error(`Comic Vine scrape entity error (${sourceEntityId}):`, error);
      return null;
    }
  }
  
  /**
   * Check if source has entity data
   */
  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    await this.rateLimit();
    
    try {
      const endpoint = entityType === 'character' ? 'search' : 'search';
      const url = `${this.baseUrl}/${endpoint}/?api_key=${this.apiKey}&format=json&resources=${entityType}&query=${encodeURIComponent(entityName)}&limit=1`;
      
      const response = await this.makeRequest<any[]>(url);
      return (response?.results?.length || 0) > 0;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Parse Comic Vine character into EntityData
   */
  private async parseCharacter(char: ComicVineCharacter): Promise<EntityData | null> {
    if (!char?.id || !char?.name) {
      return null;
    }
    
    const entityData: EntityData = {
      entityId: `comic_vine_${char.id}`,
      entityName: char.name,
      entityType: 'character',
      publisher: char.publisher?.name,
      sourceEntityId: char.id.toString(),
      sourceUrl: char.api_detail_url,
      sourceData: {
        sourceName: 'comic_vine',
        realName: char.real_name,
        aliases: char.aliases,
      },
    };
    
    // Parse first appearance
    if (char.first_appeared_in_issue) {
      const issue = char.first_appeared_in_issue;
      entityData.firstAppearance = {
        comicTitle: issue.volume?.name || issue.name,
        issue: issue.name,
        coverUrl: issue.image?.medium_url,
      };
      
      // Parse year from cover_date (format: "YYYY-MM-DD")
      if (issue.cover_date) {
        const dateParts = issue.cover_date.split('-');
        if (dateParts.length >= 1) {
          entityData.firstAppearance.year = parseInt(dateParts[0]);
        }
        if (dateParts.length >= 2) {
          const monthNum = parseInt(dateParts[1]);
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
          entityData.firstAppearance.month = months[monthNum - 1];
        }
      }
    }
    
    // Parse powers as attributes
    if (char.powers && char.powers.length > 0) {
      entityData.attributes = char.powers.map(power => ({
        category: 'power' as const,
        name: power.name,
        level: 'primary' as const,
        isActive: true,
      }));
    }
    
    // Parse origin if available
    if (char.origin?.name) {
      if (!entityData.attributes) {
        entityData.attributes = [];
      }
      entityData.attributes.push({
        category: 'origin' as const,
        name: char.origin.name,
        description: char.origin.name,
      });
    }
    
    // Parse relationships
    entityData.relationships = [];
    
    // Enemies
    const enemies = char.enemies || char.character_enemies || [];
    for (const enemy of enemies) {
      if (enemy.id && enemy.name) {
        entityData.relationships.push({
          targetEntityId: `comic_vine_${enemy.id}`,
          targetEntityName: enemy.name,
          targetEntityType: 'character',
          relationshipType: 'enemy',
          strength: 0.8,
          isActive: true,
        });
      }
    }
    
    // Allies/Friends
    const friends = char.friends || char.character_friends || [];
    for (const friend of friends) {
      if (friend.id && friend.name) {
        entityData.relationships.push({
          targetEntityId: `comic_vine_${friend.id}`,
          targetEntityName: friend.name,
          targetEntityType: 'character',
          relationshipType: 'ally',
          strength: 0.7,
          isActive: true,
        });
      }
    }
    
    // Teams
    if (char.teams) {
      for (const team of char.teams) {
        if (team.id && team.name) {
          entityData.relationships.push({
            targetEntityId: `comic_vine_team_${team.id}`,
            targetEntityName: team.name,
            targetEntityType: 'team',
            relationshipType: 'teammate',
            strength: 0.9,
            isActive: true,
          });
        }
      }
    }
    
    // Creators
    if (char.creators) {
      for (const creator of char.creators) {
        if (creator.id && creator.name) {
          entityData.relationships.push({
            targetEntityId: `comic_vine_creator_${creator.id}`,
            targetEntityName: creator.name,
            targetEntityType: 'creator',
            relationshipType: 'creator',
            strength: 1.0,
            isActive: true,
          });
        }
      }
    }
    
    return entityData;
  }
  
  /**
   * Parse Comic Vine creator/person into EntityData
   */
  private async parseCreator(person: any): Promise<EntityData | null> {
    if (!person?.id || !person?.name) {
      return null;
    }
    
    const entityData: EntityData = {
      entityId: `comic_vine_creator_${person.id}`,
      entityName: person.name,
      entityType: 'creator',
      sourceEntityId: person.id.toString(),
      sourceUrl: person.api_detail_url,
      sourceData: {
        sourceName: 'comic_vine',
        aliases: person.aliases,
      },
    };
    
    // Created characters as relationships
    if (person.created_characters) {
      entityData.relationships = person.created_characters.map((char: any) => ({
        targetEntityId: `comic_vine_${char.id}`,
        targetEntityName: char.name,
        targetEntityType: 'character',
        relationshipType: 'creator' as const,
        strength: 1.0,
        isActive: true,
      }));
    }
    
    return entityData;
  }
  
  /**
   * Parse Comic Vine location into EntityData
   */
  private async parseLocation(loc: any): Promise<EntityData | null> {
    if (!loc?.id || !loc?.name) {
      return null;
    }
    
    const entityData: EntityData = {
      entityId: `comic_vine_location_${loc.id}`,
      entityName: loc.name,
      entityType: 'location',
      publisher: loc.publisher?.name,
      sourceEntityId: loc.id.toString(),
      sourceUrl: loc.api_detail_url,
      sourceData: {
        sourceName: 'comic_vine',
        aliases: loc.aliases,
      },
    };
    
    // Parse first appearance
    if (loc.first_appeared_in_issue) {
      const issue = loc.first_appeared_in_issue;
      entityData.firstAppearance = {
        comicTitle: issue.volume?.name || issue.name,
        issue: issue.name,
        coverUrl: issue.image?.medium_url,
      };
    }
    
    return entityData;
  }
  
  /**
   * Parse Comic Vine team into EntityData
   */
  private async parseTeam(team: any): Promise<EntityData | null> {
    if (!team?.id || !team?.name) {
      return null;
    }
    
    const entityData: EntityData = {
      entityId: `comic_vine_team_${team.id}`,
      entityName: team.name,
      entityType: 'team',
      publisher: team.publisher?.name,
      sourceEntityId: team.id.toString(),
      sourceUrl: team.api_detail_url,
      sourceData: {
        sourceName: 'comic_vine',
        aliases: team.aliases,
      },
    };
    
    // Parse first appearance
    if (team.first_appeared_in_issue) {
      const issue = team.first_appeared_in_issue;
      entityData.firstAppearance = {
        comicTitle: issue.volume?.name || issue.name,
        issue: issue.name,
        coverUrl: issue.image?.medium_url,
      };
    }
    
    // Team members as relationships
    if (team.characters) {
      entityData.relationships = team.characters.map((char: any) => ({
        targetEntityId: `comic_vine_${char.id}`,
        targetEntityName: char.name,
        targetEntityType: 'character' as const,
        relationshipType: 'teammate' as const,
        strength: 0.9,
        isActive: true,
      }));
    }
    
    return entityData;
  }
  
  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(url: string): Promise<ComicVineResponse<T> | null> {
    const maxRetries = this.config.maxRetries || 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 10000);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'PanelProfits/1.0 (Entity Intelligence System)',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    console.error(`Comic Vine request failed after ${maxRetries} attempts:`, lastError);
    return null;
  }
}
