import type { EntityFirstAppearance, EntityAttribute, EntityRelationship, EntityAppearance, EntityDataSource } from "@shared/schema";

export interface ScraperConfig {
  sourceName: string;
  sourceReliability: number; // 0.00 to 1.00
  rateLimit?: number; // milliseconds between requests
  maxRetries?: number;
  timeout?: number; // request timeout in ms
}

export interface StoryArcData {
  arcName: string; // "Civil War", "Infinity Gauntlet", "Crisis on Infinite Earths"
  arcType: 'major_event' | 'character_arc' | 'team_storyline' | 'crossover' | 'origin_story' | 'death_arc' | 'resurrection_arc';
  arcDescription?: string;
  
  // Publisher and scope
  publisher: string; // 'Marvel', 'DC Comics', 'Image', 'Dark Horse'
  universe?: string; // 'Earth-616', 'Earth-1', 'Ultimate Universe'
  arcScope?: 'universal' | 'street_level' | 'cosmic' | 'multiversal' | 'single_series';
  
  // Timeline
  startYear?: number;
  endYear?: number;
  startIssue?: string; // "Iron Man #225"
  endIssue?: string; // "Iron Man #232"
  issueCount?: number;
  
  // Comic references
  keyIssues?: string[]; // Major issues in the arc
  tieInIssues?: string[]; // Crossover tie-ins
  coverImageUrl?: string;
  
  // Participating entities
  featuredCharacters?: string[]; // Entity names
  featuredCreators?: string[]; // Creator names
  featuredLocations?: string[]; // Location names
  featuredGadgets?: string[]; // Gadget names
  
  // Story impact
  narrativeImpact?: string; // "Introduction of symbiote", "Death of Superman"
  characterImpacts?: Record<string, string>; // {"spider-man": "identity_revealed"}
  universeImpacts?: string; // Long-term changes
  
  // Cultural significance
  culturalImpact?: string;
  criticalReception?: string;
  commercialSuccess?: string;
  
  // Source tracking
  sourceEntityId: string;
  sourceUrl?: string;
}

export interface NarrativeMilestoneData {
  // Entity identification
  entityId: string;
  entityName: string;
  entityType: 'character' | 'team' | 'location';
  
  // Milestone classification
  milestoneType: 'costume_change' | 'power_upgrade' | 'identity_reveal' | 'origin_retold' | 'team_formation' | 'team_departure' | 'title_change' | 'alignment_shift' | 'mentor_relationship' | 'major_defeat' | 'major_victory' | 'death' | 'resurrection';
  milestoneSubtype?: string; // 'symbiote_suit', 'cosmic_powers', 'public_reveal', 'secret_revealed_to_ally'
  
  // Milestone details
  milestoneName: string; // "Spider-Man Gets Black Suit", "Captain America Loses Super Soldier Serum"
  milestoneDescription?: string; // Full context and impact
  
  // Comic reference
  occurredInComicId?: string;
  occurredInComicTitle: string; // "Secret Wars #8"
  occurredInIssue?: string; // "#8"
  occurredYear?: number;
  occurredMonth?: string;
  coverImageUrl?: string;
  
  // Impact tracking
  isPermanent?: boolean; // Lasting change or temporary
  wasReversed?: boolean; // Later undone
  reversedInComicTitle?: string;
  reversedYear?: number;
  
  // Character impact
  narrativeImpact?: string; // "Gained alien symbiote", "Lost powers permanently"
  powerLevelChange?: string; // 'increase', 'decrease', 'transformation'
  
  // Source tracking
  sourceEntityId: string;
  sourceUrl?: string;
}

export interface CreatorContributionData {
  // Creator identification
  creatorEntityId: string;
  creatorName: string;
  
  // Work identification
  workType: 'character_creation' | 'series_run' | 'story_arc' | 'single_issue' | 'cover_art' | 'variant_cover';
  workEntityId?: string; // Entity ID of character/series they worked on
  workEntityName?: string; // Name of character/series
  workEntityType?: 'character' | 'series' | 'story_arc' | 'comic';
  
  // Role details
  creatorRole: 'writer' | 'penciller' | 'inker' | 'colorist' | 'letterer' | 'editor' | 'co-creator';
  isPrimaryCreator?: boolean; // Main creator vs contributor
  isCoCreator?: boolean; // Co-created the character/concept
  
  // Comic/series references
  comicTitle?: string; // "Amazing Spider-Man"
  issueRange?: string; // "#1-38", "#500", "Vol 1 #1-100"
  publicationYear?: number;
  publisher?: string;
  
  // Work significance
  contributionSignificance?: 'iconic_run' | 'character_defining' | 'award_winning' | 'first_appearance';
  notableWorks?: string[]; // Specific issues or storylines
  awards?: string[]; // "Eisner Award 1992", "Harvey Award"
  
  // Collaboration
  collaborators?: string[]; // Other creator entity IDs who worked on this
  collaborationNotes?: string;
  
  // Source tracking
  sourceEntityId: string;
  sourceUrl?: string;
}

export interface NthAppearanceData {
  // Entity identification
  entityId: string;
  entityName: string;
  entityType: 'character' | 'creator' | 'location' | 'gadget' | 'team' | 'concept';
  
  // Appearance order
  appearanceNumber: number; // 1, 2, 3, 4, etc.
  appearanceOrdinal: string; // "1st", "2nd", "3rd", "4th"
  
  // Comic reference
  comicId?: string;
  comicTitle: string;
  issueNumber?: string;
  publicationYear?: number;
  publicationMonth?: string;
  publisher?: string;
  coverImageUrl?: string;
  
  // Appearance context
  appearanceType?: 'main' | 'supporting' | 'cameo' | 'mentioned' | 'flashback';
  appearanceSignificance?: string; // What happened in this appearance
  isKeyAppearance?: boolean; // Particularly important appearance
  
  // Narrative context
  relatedStoryArcId?: string; // If part of story arc
  relatedMilestoneId?: string; // If milestone occurred here
  
  // Source tracking
  sourceEntityId: string;
  sourceUrl?: string;
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
   * Scrape story arcs/major events (optional - not all sources have this data)
   */
  async scrapeStoryArcs?(query?: {
    publisher?: string;
    arcType?: string;
    startYear?: number;
    endYear?: number;
    limit?: number;
    offset?: number;
  }): Promise<StoryArcData[]>;
  
  /**
   * Scrape narrative milestones (optional - not all sources have this data)
   * Extracts major character evolution moments like costume changes, power upgrades, deaths/resurrections
   */
  async scrapeNarrativeMilestones?(query?: {
    entityName?: string;
    entityType?: 'character' | 'team' | 'location';
    milestoneType?: string;
    startYear?: number;
    endYear?: number;
    limit?: number;
    offset?: number;
  }): Promise<NarrativeMilestoneData[]>;
  
  /**
   * Scrape creator contributions (optional - not all sources have this data)
   * Extracts iconic runs, awards, collaborations, and significant creator work
   */
  async scrapeCreatorContributions?(query?: {
    creatorName?: string;
    workType?: string;
    publisher?: string;
    startYear?: number;
    endYear?: number;
    limit?: number;
    offset?: number;
  }): Promise<CreatorContributionData[]>;
  
  /**
   * Scrape nth appearances (optional - not all sources have this data)
   * Extracts 2nd, 3rd, nth appearances with ordinal tracking and key appearance flagging
   */
  async scrapeNthAppearances?(query?: {
    entityName?: string;
    entityType?: 'character' | 'creator' | 'location' | 'gadget' | 'team' | 'concept';
    appearanceNumber?: number; // Get specific nth appearance
    publisher?: string;
    startYear?: number;
    endYear?: number;
    limit?: number;
    offset?: number;
  }): Promise<NthAppearanceData[]>;
  
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
