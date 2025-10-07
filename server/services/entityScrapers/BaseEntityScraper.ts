import type { EntityFirstAppearance, EntityAttribute, EntityRelationship, EntityAppearance, EntityDataSource } from "@shared/schema";

export interface ScraperConfig {
  sourceName: string;
  sourceReliability: number; // 0.00 to 1.00
  rateLimit?: number; // milliseconds between requests
  maxRetries?: number;
  timeout?: number; // request timeout in ms
}

export interface EntityData {
  entityId: string;
  entityName: string;
  entityType: 'character' | 'creator' | 'location' | 'gadget' | 'team' | 'concept';
  publisher?: string;
  
  // First appearance data
  firstAppearance?: {
    comicTitle: string;
    issue?: string;
    year?: number;
    month?: string;
    coverUrl?: string;
    franchise?: string;
    universe?: string;
  };
  
  // Attributes (powers, weaknesses, origins, etc.)
  attributes?: Array<{
    category: 'power' | 'weakness' | 'origin' | 'death' | 'resurrection' | 'ability' | 'equipment';
    name: string;
    description?: string;
    level?: 'primary' | 'secondary' | 'situational' | 'former';
    isActive?: boolean;
    firstMentionedIn?: string;
    originType?: 'accident' | 'birth' | 'experiment' | 'magic' | 'technology' | 'mutation';
  }>;
  
  // Relationships
  relationships?: Array<{
    targetEntityId: string;
    targetEntityName: string;
    targetEntityType: string;
    relationshipType: 'ally' | 'enemy' | 'nemesis' | 'sidekick' | 'mentor' | 'teammate' | 'family' | 'romantic' | 'rival' | 'creator' | 'wields' | 'located_in';
    relationshipSubtype?: string;
    strength?: number; // 0.00 to 1.00
    isActive?: boolean;
    firstEstablishedIn?: string;
  }>;
  
  // Comic appearances
  appearances?: Array<{
    comicTitle: string;
    issueNumber?: string;
    publicationYear?: number;
    publicationMonth?: string;
    appearanceType?: 'main' | 'supporting' | 'cameo' | 'mentioned' | 'flashback';
    isOnCover?: boolean;
    coverImageUrl?: string;
  }>;
  
  // Raw source data
  sourceData?: any;
  sourceEntityId: string;
  sourceUrl?: string;
}

export interface ScraperResult {
  success: boolean;
  entitiesScraped: number;
  entitiesWithFirstAppearance: number;
  entitiesWithAttributes: number;
  entitiesWithRelationships: number;
  entitiesWithAppearances: number;
  errors: Array<{ entityId: string; message: string }>;
  duration: number; // milliseconds
}

/**
 * Base class for all entity scrapers
 * Provides common functionality for rate limiting, error handling, and data normalization
 */
export abstract class BaseEntityScraper {
  protected config: ScraperConfig;
  protected lastRequestTime: number = 0;
  
  constructor(config: ScraperConfig) {
    this.config = config;
  }
  
  /**
   * Main entry point - scrape entities based on query/filter
   */
  abstract scrapeEntities(query?: { 
    entityType?: string; 
    publisher?: string; 
    limit?: number;
    offset?: number;
  }): Promise<EntityData[]>;
  
  /**
   * Scrape a single entity by ID
   */
  abstract scrapeEntity(sourceEntityId: string): Promise<EntityData | null>;
  
  /**
   * Check if source has data for a given entity
   */
  abstract hasEntityData(entityName: string, entityType: string): Promise<boolean>;
  
  /**
   * Rate limiting - ensures we don't exceed source limits
   */
  protected async rateLimit(): Promise<void> {
    if (!this.config.rateLimit) return;
    
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.config.rateLimit) {
      const waitTime = this.config.rateLimit - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  /**
   * Retry logic for failed requests
   */
  protected async retryRequest<T>(
    fn: () => Promise<T>,
    retries: number = this.config.maxRetries || 3
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second backoff
        return this.retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }
  
  /**
   * Normalize entity name across sources (remove variations, handle aliases)
   */
  protected normalizeEntityName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ') // normalize whitespace
      .replace(/[^\w\s-]/g, '') // remove special chars
      .toLowerCase();
  }
  
  /**
   * Convert scraped data to database format
   */
  protected toDataSource(entityData: EntityData): Omit<EntityDataSource, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      entityId: entityData.entityId,
      entityName: entityData.entityName,
      entityType: entityData.entityType,
      sourceName: this.config.sourceName,
      sourceEntityId: entityData.sourceEntityId,
      sourceUrl: entityData.sourceUrl || null,
      hasFirstAppearance: !!entityData.firstAppearance,
      hasAttributes: !!entityData.attributes && entityData.attributes.length > 0,
      hasRelationships: !!entityData.relationships && entityData.relationships.length > 0,
      hasAppearances: !!entityData.appearances && entityData.appearances.length > 0,
      hasImages: !!entityData.firstAppearance?.coverUrl,
      hasBiography: !!entityData.sourceData?.biography,
      dataCompleteness: this.calculateCompleteness(entityData),
      dataFreshness: new Date(),
      sourceReliability: String(this.config.sourceReliability) as any,
      sourceData: entityData.sourceData,
      lastSyncedAt: new Date(),
      nextSyncScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      syncStatus: 'synced',
      syncErrorMessage: null,
    };
  }
  
  /**
   * Calculate data completeness score (0.00 to 1.00)
   */
  protected calculateCompleteness(entityData: EntityData): string {
    let score = 0;
    let maxScore = 6;
    
    if (entityData.firstAppearance) score += 1;
    if (entityData.attributes && entityData.attributes.length > 0) score += 1;
    if (entityData.relationships && entityData.relationships.length > 0) score += 1;
    if (entityData.appearances && entityData.appearances.length > 0) score += 1;
    if (entityData.firstAppearance?.coverUrl) score += 1;
    if (entityData.sourceData?.biography) score += 1;
    
    return (score / maxScore).toFixed(2);
  }
  
  /**
   * Get source configuration
   */
  getConfig(): ScraperConfig {
    return this.config;
  }
}
