import { db } from '../../databaseStorage';
import { 
  entityFirstAppearances, 
  entityAttributes, 
  entityRelationships, 
  entityAppearances, 
  entityDataSources,
  type InsertEntityFirstAppearance,
  type InsertEntityAttribute,
  type InsertEntityRelationship,
  type InsertEntityAppearance,
  type InsertEntityDataSource,
} from '@shared/schema';
import type { BaseEntityScraper, EntityData, ScraperResult } from './BaseEntityScraper';
import { MetronScraper } from './MetronScraper';
import { MarvelScraper } from './MarvelScraper';
import { SuperHeroScraper } from './SuperHeroScraper';
import { createMarvelWikiScraper, createDCWikiScraper } from './WikiScraper';
import { normalizationService } from './NormalizationService';

export interface OrchestratorConfig {
  enabledSources: string[]; // Source names to use
  consensusThreshold: number; // Minimum sources to verify (default 3)
  concurrentScrapers: number; // Max parallel scrapers (default 5)
  batchSize: number; // Entities per batch (default 100)
}

export interface OrchestratorResult {
  totalEntitiesProcessed: number;
  totalSourcesQueried: number;
  consensusVerified: number;
  firstAppearancesAdded: number;
  attributesAdded: number;
  relationshipsAdded: number;
  appearancesAdded: number;
  errors: Array<{ source: string; message: string }>;
  duration: number;
}

/**
 * Scraper Orchestrator - Manages multiple scrapers, deduplication, and consensus validation
 */
export class ScraperOrchestrator {
  private scrapers: Map<string, BaseEntityScraper> = new Map();
  private config: OrchestratorConfig;
  
  constructor(config?: Partial<OrchestratorConfig>) {
    this.config = {
      enabledSources: ['metron', 'marvel', 'superhero-api', 'marvel-wiki', 'dc-wiki'], // All 5 active sources
      consensusThreshold: 2, // Realistic threshold with current scrapers (will increase when more sources added)
      concurrentScrapers: 5,
      batchSize: 100,
      ...config,
    };
    
    // Adjust consensus threshold if fewer sources enabled
    if (this.config.enabledSources.length < this.config.consensusThreshold) {
      this.config.consensusThreshold = Math.max(1, this.config.enabledSources.length);
    }
    
    this.initializeScrapers();
  }
  
  /**
   * Initialize all enabled scrapers
   */
  private initializeScrapers(): void {
    const scraperMap: Record<string, () => BaseEntityScraper> = {
      metron: () => new MetronScraper(),
      marvel: () => new MarvelScraper(),
      'superhero-api': () => new SuperHeroScraper(),
      'marvel-wiki': () => createMarvelWikiScraper(),
      'dc-wiki': () => createDCWikiScraper(),
    };
    
    for (const sourceName of this.config.enabledSources) {
      const scraperFactory = scraperMap[sourceName];
      if (scraperFactory) {
        this.scrapers.set(sourceName, scraperFactory());
      }
    }
  }
  
  /**
   * Main orchestration method - scrapes entities from all sources
   */
  async scrapeAndAggregate(query?: {
    entityType?: string;
    publisher?: string;
    limit?: number;
  }): Promise<OrchestratorResult> {
    const startTime = Date.now();
    const result: OrchestratorResult = {
      totalEntitiesProcessed: 0,
      totalSourcesQueried: this.scrapers.size,
      consensusVerified: 0,
      firstAppearancesAdded: 0,
      attributesAdded: 0,
      relationshipsAdded: 0,
      appearancesAdded: 0,
      errors: [],
      duration: 0,
    };
    
    try {
      // Run all scrapers in parallel
      const scraperPromises = Array.from(this.scrapers.entries()).map(
        async ([sourceName, scraper]) => {
          try {
            return await scraper.scrapeEntities(query);
          } catch (error) {
            result.errors.push({
              source: sourceName,
              message: error instanceof Error ? error.message : 'Unknown error',
            });
            return [];
          }
        }
      );
      
      const allScraperResults = await Promise.all(scraperPromises);
      
      // Flatten all entity data from all sources
      const allEntityData = allScraperResults.flat();
      
      // Group entities by normalized name for deduplication
      const entityGroups = this.groupEntitiesByName(allEntityData);
      
      // Process each entity group (merge data from multiple sources)
      for (const [entityKey, entityDataList] of entityGroups.entries()) {
        try {
          const aggregatedEntity = await this.aggregateEntityData(entityDataList);
          await this.saveEntityData(aggregatedEntity, entityDataList);
          
          result.totalEntitiesProcessed++;
          
          if (aggregatedEntity.isVerified) {
            result.consensusVerified++;
          }
          
          if (aggregatedEntity.firstAppearance) {
            result.firstAppearancesAdded++;
          }
          
          result.attributesAdded += aggregatedEntity.attributes?.length || 0;
          result.relationshipsAdded += aggregatedEntity.relationships?.length || 0;
          result.appearancesAdded += aggregatedEntity.appearances?.length || 0;
        } catch (error) {
          result.errors.push({
            source: 'aggregation',
            message: `Failed to process ${entityKey}: ${error}`,
          });
        }
      }
    } catch (error) {
      result.errors.push({
        source: 'orchestrator',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    
    result.duration = Date.now() - startTime;
    return result;
  }
  
  /**
   * Group entities by fuzzy matching for intelligent deduplication
   * Uses normalization service with Levenshtein distance fuzzy matching
   */
  private groupEntitiesByName(entities: EntityData[]): Map<string, EntityData[]> {
    const groups = new Map<string, EntityData[]>();
    
    // Use normalization service for fuzzy grouping
    const entityGroups = normalizationService.groupSimilarEntities(
      entities.map(e => ({
        entityName: e.entityName,
        entityType: e.entityType,
        publisher: e.publisher,
        original: e,
      })),
      0.85 // 85% similarity threshold
    );
    
    // Convert to Map with best name as key
    for (const group of entityGroups) {
      const names = group.map(g => g.entityName);
      const bestName = normalizationService.selectBestName(names);
      const key = this.normalizeEntityKey(bestName, group[0].entityType);
      
      groups.set(key, group.map(g => g.original));
    }
    
    return groups;
  }
  
  /**
   * Normalize entity key for matching across sources
   * Now delegates to normalization service
   */
  private normalizeEntityKey(name: string, type: string): string {
    return `${type}:${normalizationService.canonicalizeName(name)}`;
  }
  
  /**
   * Aggregate entity data from multiple sources using consensus
   */
  private async aggregateEntityData(entityDataList: EntityData[]): Promise<EntityData & { 
    isVerified: boolean; 
    sourceCount: number;
    firstAppearanceSourceCount?: number; // Track actual FA contributors
  }> {
    if (entityDataList.length === 0) {
      throw new Error('No entity data to aggregate');
    }
    
    // Use first entity as base
    const base = entityDataList[0];
    const sourceCount = entityDataList.length;
    const isVerified = sourceCount >= this.config.consensusThreshold;
    
    // Merge first appearance data and track contributor count
    const firstAppearanceResult = this.mergeFirstAppearances(
      entityDataList.map(e => e.firstAppearance).filter(Boolean) as NonNullable<EntityData['firstAppearance']>[]
    );
    
    // Merge attributes (deduplicate by name)
    const attributes = this.mergeAttributes(
      entityDataList.flatMap(e => e.attributes || [])
    );
    
    // Merge relationships (deduplicate by target)
    const relationships = this.mergeRelationships(
      entityDataList.flatMap(e => e.relationships || [])
    );
    
    // Merge appearances (deduplicate by comic title)
    const appearances = this.mergeAppearances(
      entityDataList.flatMap(e => e.appearances || [])
    );
    
    return {
      ...base,
      firstAppearance: firstAppearanceResult?.value,
      firstAppearanceSourceCount: firstAppearanceResult?.sourceCount,
      attributes,
      relationships,
      appearances,
      isVerified,
      sourceCount,
    };
  }
  
  /**
   * Merge first appearance data - REQUIRES sources to AGREE on same comic
   * Field-level consensus: sources must agree on the same first appearance
   * Returns both the value AND the number of sources that contributed
   */
  private mergeFirstAppearances(firstAppearances: NonNullable<EntityData['firstAppearance']>[]): { 
    value: EntityData['firstAppearance']; 
    sourceCount: number;
  } | undefined {
    if (firstAppearances.length === 0) return undefined;
    
    // Group by normalized comic title to find consensus
    const grouped = new Map<string, NonNullable<EntityData['firstAppearance']>[]>();
    
    for (const fa of firstAppearances) {
      // Normalize comic title for matching
      const key = normalizationService.canonicalizeName(fa.comicTitle);
      const group = grouped.get(key) || [];
      group.push(fa);
      grouped.set(key, group);
    }
    
    // Find group with most sources (consensus)
    let consensusGroup: NonNullable<EntityData['firstAppearance']>[] = [];
    let maxSources = 0;
    
    for (const group of grouped.values()) {
      if (group.length > maxSources) {
        maxSources = group.length;
        consensusGroup = group;
      }
    }
    
    // Only return if consensus threshold met
    if (maxSources < this.config.consensusThreshold) {
      return undefined; // Sources disagree or insufficient consensus
    }
    
    // Return most complete entry from consensus group WITH source count
    const mostComplete = consensusGroup.sort((a, b) => {
      const scoreA = Object.values(a).filter(v => v !== null && v !== undefined).length;
      const scoreB = Object.values(b).filter(v => v !== null && v !== undefined).length;
      return scoreB - scoreA;
    })[0];
    
    return {
      value: mostComplete,
      sourceCount: maxSources, // Actual number of sources that agreed
    };
  }
  
  /**
   * Merge attributes - deduplicate by name
   */
  private mergeAttributes(attributes: NonNullable<EntityData['attributes']>): EntityData['attributes'] {
    const uniqueAttrs = new Map<string, NonNullable<EntityData['attributes']>[0]>();
    
    for (const attr of attributes) {
      const key = `${attr.category}:${attr.name.toLowerCase()}`;
      if (!uniqueAttrs.has(key)) {
        uniqueAttrs.set(key, attr);
      }
    }
    
    return Array.from(uniqueAttrs.values());
  }
  
  /**
   * Merge relationships - deduplicate by target
   */
  private mergeRelationships(relationships: NonNullable<EntityData['relationships']>): EntityData['relationships'] {
    const uniqueRels = new Map<string, NonNullable<EntityData['relationships']>[0]>();
    
    for (const rel of relationships) {
      const key = `${rel.relationshipType}:${rel.targetEntityName.toLowerCase()}`;
      if (!uniqueRels.has(key)) {
        uniqueRels.set(key, rel);
      }
    }
    
    return Array.from(uniqueRels.values());
  }
  
  /**
   * Merge appearances - deduplicate by comic title
   */
  private mergeAppearances(appearances: NonNullable<EntityData['appearances']>): EntityData['appearances'] {
    const uniqueApps = new Map<string, NonNullable<EntityData['appearances']>[0]>();
    
    for (const app of appearances) {
      const key = app.comicTitle.toLowerCase();
      if (!uniqueApps.has(key)) {
        uniqueApps.set(key, app);
      }
    }
    
    return Array.from(uniqueApps.values());
  }
  
  /**
   * Save aggregated entity data to database
   */
  private async saveEntityData(
    aggregatedEntity: EntityData & { 
      isVerified: boolean; 
      sourceCount: number; 
      firstAppearanceSourceCount?: number;
    },
    sourceDataList: EntityData[]
  ): Promise<void> {
    // Save entity data sources
    for (const sourceData of sourceDataList) {
      const dataSource: InsertEntityDataSource = {
        entityId: aggregatedEntity.entityId,
        entityName: aggregatedEntity.entityName,
        entityType: aggregatedEntity.entityType,
        sourceName: sourceData.sourceData?.sourceName || 'unknown',
        sourceEntityId: sourceData.sourceEntityId,
        sourceUrl: sourceData.sourceUrl || null,
        hasFirstAppearance: !!sourceData.firstAppearance,
        hasAttributes: (sourceData.attributes?.length || 0) > 0,
        hasRelationships: (sourceData.relationships?.length || 0) > 0,
        hasAppearances: (sourceData.appearances?.length || 0) > 0,
        hasImages: !!sourceData.firstAppearance?.coverUrl,
        hasBiography: !!sourceData.sourceData?.biography,
        dataCompleteness: this.calculateCompleteness(sourceData) as any,
        dataFreshness: new Date(),
        sourceReliability: String(sourceData.sourceData?.sourceReliability || 0.80) as any,
        sourceData: sourceData.sourceData,
        lastSyncedAt: new Date(),
        nextSyncScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        syncStatus: 'synced',
        syncErrorMessage: null,
      };
      
      await db.insert(entityDataSources).values(dataSource).onConflictDoNothing();
    }
    
    // Save first appearance (only if consensus achieved)
    if (aggregatedEntity.firstAppearance && aggregatedEntity.firstAppearanceSourceCount) {
      const faSourceCount = aggregatedEntity.firstAppearanceSourceCount;
      const faIsVerified = faSourceCount >= this.config.consensusThreshold;
      
      const firstAppearance: InsertEntityFirstAppearance = {
        entityId: aggregatedEntity.entityId,
        entityName: aggregatedEntity.entityName,
        entityType: aggregatedEntity.entityType,
        firstAppearanceTitle: aggregatedEntity.firstAppearance.comicTitle,
        firstAppearanceIssue: aggregatedEntity.firstAppearance.issue || null,
        firstAppearanceYear: aggregatedEntity.firstAppearance.year || null,
        firstAppearanceMonth: aggregatedEntity.firstAppearance.month || null,
        firstAppearanceCoverUrl: aggregatedEntity.firstAppearance.coverUrl || null,
        publisher: aggregatedEntity.publisher || null,
        franchise: aggregatedEntity.firstAppearance.franchise || null,
        universe: aggregatedEntity.firstAppearance.universe || null,
        primarySource: sourceDataList[0].sourceData?.sourceName || 'metron',
        sourceConsensusCount: faSourceCount, // Actual FA contributor count
        sourceIds: sourceDataList.reduce((acc, src) => ({
          ...acc,
          [src.sourceData?.sourceName || 'unknown']: src.sourceEntityId,
        }), {}),
        isVerified: faIsVerified, // Based on FA consensus
        verifiedAt: faIsVerified ? new Date() : null,
        verificationNotes: faIsVerified 
          ? `First appearance verified by ${faSourceCount} agreeing sources` 
          : null,
      };
      
      await db.insert(entityFirstAppearances).values(firstAppearance).onConflictDoNothing();
    }
    
    // Save attributes (bulk insert)
    if (aggregatedEntity.attributes && aggregatedEntity.attributes.length > 0) {
      const attrs: InsertEntityAttribute[] = aggregatedEntity.attributes.map(attr => ({
        entityId: aggregatedEntity.entityId,
        entityName: aggregatedEntity.entityName,
        entityType: aggregatedEntity.entityType,
        attributeCategory: attr.category,
        attributeName: attr.name,
        attributeDescription: attr.description || null,
        attributeLevel: attr.level || null,
        isActive: attr.isActive !== undefined ? attr.isActive : true,
        firstMentionedIn: attr.firstMentionedIn || null,
        keyAppearances: [],
        originType: attr.originType || null,
        originDescription: null,
        deathDate: null,
        resurrectionDate: null,
        permanenceStatus: null,
        primarySource: sourceDataList[0].sourceData?.sourceName || 'metron',
        sourceConsensusCount: 1,
        sourceIds: {},
        isVerified: false,
        verifiedAt: null,
      }));
      
      await db.insert(entityAttributes).values(attrs).onConflictDoNothing();
    }
    
    // Save relationships (bulk insert)
    if (aggregatedEntity.relationships && aggregatedEntity.relationships.length > 0) {
      const rels: InsertEntityRelationship[] = aggregatedEntity.relationships.map(rel => ({
        sourceEntityId: aggregatedEntity.entityId,
        sourceEntityName: aggregatedEntity.entityName,
        sourceEntityType: aggregatedEntity.entityType,
        targetEntityId: rel.targetEntityId,
        targetEntityName: rel.targetEntityName,
        targetEntityType: rel.targetEntityType,
        relationshipType: rel.relationshipType,
        relationshipSubtype: rel.relationshipSubtype || null,
        relationshipStrength: String(rel.strength || 0.50) as any,
        isActive: rel.isActive !== undefined ? rel.isActive : true,
        firstEstablishedIn: rel.firstEstablishedIn || null,
        firstEstablishedComicId: null,
        keyMoments: [],
        relationshipNotes: null,
        publisher: aggregatedEntity.publisher || null,
        universe: null,
        primarySource: sourceDataList[0].sourceData?.sourceName || 'metron',
        sourceConsensusCount: 1,
        sourceIds: {},
        isVerified: false,
        verifiedAt: null,
      }));
      
      await db.insert(entityRelationships).values(rels).onConflictDoNothing();
    }
    
    // Save appearances (bulk insert)
    if (aggregatedEntity.appearances && aggregatedEntity.appearances.length > 0) {
      const apps: InsertEntityAppearance[] = aggregatedEntity.appearances.map(app => ({
        entityId: aggregatedEntity.entityId,
        entityName: aggregatedEntity.entityName,
        entityType: aggregatedEntity.entityType,
        comicId: null,
        comicTitle: app.comicTitle,
        issueNumber: app.issueNumber || null,
        publicationYear: app.publicationYear || null,
        publicationMonth: app.publicationMonth || null,
        publisher: aggregatedEntity.publisher || null,
        appearanceType: app.appearanceType || null,
        appearanceSignificance: null,
        pageCount: null,
        isOnCover: app.isOnCover || false,
        coverImageUrl: app.coverImageUrl || null,
        primarySource: sourceDataList[0].sourceData?.sourceName || 'metron',
        sourceIds: {},
      }));
      
      await db.insert(entityAppearances).values(apps).onConflictDoNothing();
    }
  }
  
  /**
   * Calculate data completeness score
   */
  private calculateCompleteness(entityData: EntityData): string {
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
   * Get scraper statistics
   */
  getStats(): {
    enabledScrapers: string[];
    totalScrapers: number;
    config: OrchestratorConfig;
  } {
    return {
      enabledScrapers: Array.from(this.scrapers.keys()),
      totalScrapers: this.scrapers.size,
      config: this.config,
    };
  }
}
