import { BaseEntityScraper, EntityData, ScraperConfig } from './BaseEntityScraper';

/**
 * Grand Comics Database (GCD) Scraper
 * 
 * Uses the community comiccover.org API (GCD data dump from 2022-12-01)
 * Excellent for: creator contributions, story credits, awards, detailed comic data
 * 
 * Reliability: 0.88 (high quality, but data from 2022)
 * Rate Limit: 1 req/sec (conservative)
 * 
 * API Endpoints:
 * - /v1/creator/?name={name} - Search creators
 * - /v1/creator/{id}/awards - Creator awards
 * - /v1/creator/{id}/relations - Creator relationships
 * - /v1/story/{id}/credits - Story credits (who wrote/drew what)
 * - /v1/series/{id} - Series information
 * - /v1/issue/{id}/stories - Issue stories
 */
export class GCDScraper extends BaseEntityScraper {
  private readonly baseUrl = 'https://www.comiccover.org/api/v1';

  constructor() {
    const config: ScraperConfig = {
      sourceName: 'gcd',
      sourceReliability: 0.88,
      rateLimit: 1000, // 1 second between requests
      maxRetries: 3,
      timeout: 10000
    };
    super(config);
  }

  async scrapeEntities(query?: { 
    entityType?: string; 
    publisher?: string; 
    limit?: number;
    offset?: number;
  }): Promise<EntityData[]> {
    const { limit = 10, entityType = 'creator', publisher, offset = 0 } = query || {};
    const entities: EntityData[] = [];

    try {
      if (entityType === 'creator') {
        // Search for creators (artists, writers, etc.)
        const creators = await this.searchCreators(limit, publisher, offset);
        entities.push(...creators);
      } else if (entityType === 'character' || entityType === 'team') {
        // GCD doesn't have direct character search, but we can extract from features
        const characters = await this.searchFeatures(limit, publisher, offset);
        entities.push(...characters);
      }

      return entities;
    } catch (error) {
      console.error(`GCD scraper error:`, error);
      return entities;
    }
  }

  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    try {
      // Extract type and ID from sourceEntityId format: gcd_creator_123 or gcd_feature_456
      const parts = sourceEntityId.split('_');
      if (parts.length < 3) return null;
      
      const type = parts[1]; // 'creator' or 'feature'
      const id = parts[2];
      
      await this.rateLimit();
      
      if (type === 'creator') {
        const response = await fetch(`${this.baseUrl}/creator/${id}`);
        if (!response.ok) return null;
        
        const creator = await response.json();
        const [awards, relations] = await Promise.all([
          this.fetchCreatorAwards(parseInt(id)),
          this.fetchCreatorRelations(parseInt(id))
        ]);
        
        return this.buildCreatorEntity(creator, awards, relations);
      } else if (type === 'feature') {
        const response = await fetch(`${this.baseUrl}/feature/${id}`);
        if (!response.ok) return null;
        
        const feature = await response.json();
        return this.buildFeatureEntity(feature);
      }
      
      return null;
    } catch (error) {
      console.error(`Error scraping entity ${sourceEntityId}:`, error);
      return null;
    }
  }

  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    try {
      await this.rateLimit();
      
      if (entityType === 'creator') {
        const response = await fetch(`${this.baseUrl}/creator/?name=${encodeURIComponent(entityName)}`);
        if (!response.ok) return false;
        
        const data = await response.json();
        return (data.results || []).length > 0;
      } else if (entityType === 'character' || entityType === 'team') {
        const response = await fetch(`${this.baseUrl}/feature/?name=${encodeURIComponent(entityName)}`);
        if (!response.ok) return false;
        
        const data = await response.json();
        return (data.results || []).length > 0;
      }
      
      return false;
    } catch (error) {
      console.error(`Error checking entity data for ${entityName}:`, error);
      return false;
    }
  }

  /**
   * Search for creators (writers, artists, etc.)
   */
  private async searchCreators(limit: number, publisher?: string, offset: number = 0): Promise<EntityData[]> {
    const entities: EntityData[] = [];
    
    try {
      // Search for prominent creators
      const searchTerms = ['stan lee', 'jack kirby', 'steve ditko', 'john byrne', 'chris claremont', 
                          'frank miller', 'alan moore', 'neil gaiman', 'grant morrison', 'todd mcfarlane'];
      
      for (const term of searchTerms.slice(offset, offset + Math.ceil(limit / 2))) {
        await this.rateLimit();
        
        const response = await fetch(`${this.baseUrl}/creator/?name=${encodeURIComponent(term)}`);
        if (!response.ok) continue;
        
        const data = await response.json();
        const results = data.results || [];
        
        for (const creator of results.slice(0, 2)) {
          const [awards, relations] = await Promise.all([
            this.fetchCreatorAwards(creator.id),
            this.fetchCreatorRelations(creator.id)
          ]);
          
          const entity = this.buildCreatorEntity(creator, awards, relations);
          entities.push(entity);
          
          if (entities.length >= limit) break;
        }
        
        if (entities.length >= limit) break;
      }
      
      return entities;
    } catch (error) {
      console.error('Error searching GCD creators:', error);
      return entities;
    }
  }

  /**
   * Search for features (characters, teams, etc.)
   */
  private async searchFeatures(limit: number, publisher?: string, offset: number = 0): Promise<EntityData[]> {
    const entities: EntityData[] = [];
    
    try {
      // Search for prominent characters
      const searchTerms = ['spider-man', 'batman', 'superman', 'wolverine', 'iron man', 'x-men', 'avengers'];
      
      for (const term of searchTerms.slice(offset, offset + limit)) {
        await this.rateLimit();
        
        const response = await fetch(`${this.baseUrl}/feature/?name=${encodeURIComponent(term)}`);
        if (!response.ok) continue;
        
        const data = await response.json();
        const results = data.results || [];
        
        for (const feature of results.slice(0, 1)) {
          const entity = this.buildFeatureEntity(feature);
          entities.push(entity);
          
          if (entities.length >= limit) break;
        }
        
        if (entities.length >= limit) break;
      }
      
      return entities;
    } catch (error) {
      console.error('Error searching GCD features:', error);
      return entities;
    }
  }

  /**
   * Build creator entity from GCD data
   */
  private buildCreatorEntity(creator: any, awards: any[], relations: any[]): EntityData {
    const entity: EntityData = {
      entityId: `gcd_creator_${creator.id}`,
      entityName: creator.gcd_official_name || creator.sort_name || 'Unknown',
      entityType: 'creator',
      sourceEntityId: creator.id.toString(),
      sourceUrl: `https://www.comics.org/creator/${creator.id}`,
      firstAppearance: creator.birth_date?.year ? {
        comicTitle: `Born: ${creator.birth_date.year}`,
        year: creator.birth_date.year,
      } : undefined,
      attributes: [],
      relationships: relations.map((rel: any) => ({
        targetEntityId: `gcd_creator_${rel.to_creator}`,
        targetEntityName: rel.to_creator_name || 'Unknown',
        targetEntityType: 'creator',
        relationshipType: this.mapRelationType(rel.relation_type_name)
      })),
      sourceData: creator
    };
    
    // Add attributes
    if (creator.birth_date?.year) {
      entity.attributes?.push({ 
        category: 'origin', 
        name: 'Birth Year', 
        description: creator.birth_date.year.toString() 
      });
    }
    
    if (creator.death_date?.year) {
      entity.attributes?.push({ 
        category: 'death', 
        name: 'Death Year', 
        description: creator.death_date.year.toString() 
      });
    }
    
    if (awards.length > 0) {
      for (const award of awards.slice(0, 3)) {
        entity.attributes?.push({ 
          category: 'ability', 
          name: award.award_name || 'Award', 
          description: `Received in ${award.award_year || 'N/A'}` 
        });
      }
    }
    
    return entity;
  }

  /**
   * Build feature entity from GCD data
   */
  private buildFeatureEntity(feature: any): EntityData {
    return {
      entityId: `gcd_feature_${feature.id}`,
      entityName: feature.name || 'Unknown',
      entityType: feature.feature_type === 2 ? 'team' : 'character', // type 2 = team
      sourceEntityId: feature.id.toString(),
      sourceUrl: `https://www.comics.org/feature/${feature.id}`,
      attributes: feature.notes ? [{
        category: 'origin',
        name: 'Notes',
        description: feature.notes
      }] : [],
      relationships: [],
      sourceData: feature
    };
  }

  /**
   * Fetch creator awards
   */
  private async fetchCreatorAwards(creatorId: number): Promise<any[]> {
    try {
      await this.rateLimit();
      const response = await fetch(`${this.baseUrl}/creator/${creatorId}/awards`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error fetching awards for creator ${creatorId}:`, error);
      return [];
    }
  }

  /**
   * Fetch creator relationships
   */
  private async fetchCreatorRelations(creatorId: number): Promise<any[]> {
    try {
      await this.rateLimit();
      const response = await fetch(`${this.baseUrl}/creator/${creatorId}/relations`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error fetching relations for creator ${creatorId}:`, error);
      return [];
    }
  }

  /**
   * Map GCD relation types to our relationship types
   */
  private mapRelationType(gcdType: string): 'ally' | 'enemy' | 'nemesis' | 'sidekick' | 'mentor' | 'teammate' | 'family' | 'romantic' | 'rival' | 'creator' | 'wields' | 'located_in' {
    const lowerType = (gcdType || '').toLowerCase();
    
    if (lowerType.includes('spouse') || lowerType.includes('married')) return 'family';
    if (lowerType.includes('sibling') || lowerType.includes('parent') || lowerType.includes('child')) return 'family';
    if (lowerType.includes('mentor') || lowerType.includes('teacher')) return 'mentor';
    if (lowerType.includes('student') || lowerType.includes('apprentice')) return 'mentor';
    if (lowerType.includes('collabor')) return 'ally';
    if (lowerType.includes('rival')) return 'rival';
    
    return 'ally'; // Default
  }
}
