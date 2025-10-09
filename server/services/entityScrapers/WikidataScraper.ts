import { BaseEntityScraper, EntityData } from './BaseEntityScraper';

/**
 * Wikidata SPARQL Scraper
 * 
 * Scrapes comic book entities from Wikidata using SPARQL queries.
 * Supports characters, comics, creators, publishers across all publishers.
 * 
 * Data Coverage:
 * - Characters: powers, abilities, first appearances, affiliations
 * - Comics: issues, series, publication dates, creators
 * - Creators: works, awards, collaborations
 * - Publishers: series, characters, imprints
 * 
 * Reliability: 0.90 (high-quality structured data)
 */
export class WikidataScraper extends BaseEntityScraper {
  private readonly endpoint = 'https://query.wikidata.org/sparql';
  private readonly userAgent = 'PanelProfitsBot/1.0 (Entity Scraper)';

  constructor() {
    super({
      sourceName: 'wikidata',
      sourceReliability: 0.90,
      rateLimit: 1000 // 1 second between requests
    });
  }

  /**
   * Execute SPARQL query against Wikidata endpoint
   */
  private async executeSparql(query: string): Promise<any> {
    await this.rateLimit();

    const params = new URLSearchParams({
      query,
      format: 'json'
    });

    const response = await fetch(`${this.endpoint}?${params}`, {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'application/sparql-results+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Wikidata SPARQL error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Scrape multiple comic book entities from Wikidata
   */
  async scrapeEntities(query?: { 
    entityType?: string; 
    publisher?: string; 
    limit?: number;
    offset?: number;
  }): Promise<EntityData[]> {
    try {
      const entityType = query?.entityType || 'character';
      const publisher = query?.publisher;
      const limit = query?.limit || 50;

      let sparqlQuery: string;

      if (entityType === 'character') {
        sparqlQuery = this.buildCharacterQuery(limit, publisher);
      } else if (entityType === 'creator') {
        sparqlQuery = this.buildCreatorQuery(limit);
      } else {
        // Default to characters
        sparqlQuery = this.buildCharacterQuery(limit, publisher);
      }

      const result = await this.executeSparql(sparqlQuery);
      const bindings = result.results?.bindings || [];

      console.log(`Retrieved ${bindings.length} ${entityType}s from Wikidata`);

      const entities: EntityData[] = [];

      for (const binding of bindings) {
        const entityId = this.extractEntityId(binding.entity?.value);
        if (!entityId) continue;

        const entity = await this.scrapeEntity(entityId);
        if (entity) {
          entities.push(entity);
        }
      }

      return entities;
    } catch (error) {
      console.error(`Error scraping Wikidata entities:`, error);
      return [];
    }
  }

  /**
   * Scrape a single entity from Wikidata by QID
   */
  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    try {
      const query = this.buildEntityDetailsQuery(sourceEntityId);
      const result = await this.executeSparql(query);
      const bindings = result.results?.bindings || [];

      if (bindings.length === 0) {
        return null;
      }

      const entityData = bindings[0];
      const entityType = await this.determineEntityType(sourceEntityId);

      const entity: EntityData = {
        entityId: `wikidata_${sourceEntityId}`,
        entityName: entityData.entityLabel?.value || 'Unknown',
        entityType,
        publisher: this.extractPublisher(entityData),
        sourceEntityId,
        sourceUrl: `https://www.wikidata.org/wiki/${sourceEntityId}`
      };

      // Extract description
      if (entityData.description?.value) {
        entity.sourceData = {
          description: entityData.description.value
        };
      }

      // Extract attributes
      entity.attributes = this.extractAttributes(bindings);

      // Extract relationships
      entity.relationships = await this.extractRelationships(sourceEntityId);

      // Extract first appearance
      const firstAppearance = this.extractFirstAppearance(bindings);
      if (firstAppearance) {
        entity.firstAppearance = firstAppearance;
      }

      return entity;
    } catch (error) {
      console.error(`Error scraping Wikidata entity ${sourceEntityId}:`, error);
      return null;
    }
  }

  /**
   * Check if Wikidata has data for entity
   */
  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    try {
      const query = `
        SELECT ?entity WHERE {
          ?entity rdfs:label "${entityName}"@en.
          ?entity wdt:P31 ?type.
          FILTER(?type IN (wd:Q1114461, wd:Q8261, wd:Q1114461, wd:Q1107656))
        } LIMIT 1
      `;

      const result = await this.executeSparql(query);
      return (result.results?.bindings?.length || 0) > 0;
    } catch (error) {
      console.error(`Error checking Wikidata for ${entityName}:`, error);
      return false;
    }
  }

  /**
   * Build SPARQL query for characters
   */
  private buildCharacterQuery(limit: number, publisher?: string): string {
    let publisherQIDs: string[] = [];
    
    if (publisher) {
      // Publisher-specific QID filters
      if (publisher.toLowerCase().includes('marvel')) {
        publisherQIDs = ['wd:Q173496'];  // Marvel Comics publisher
      } else if (publisher.toLowerCase().includes('dc')) {
        publisherQIDs = ['wd:Q2924461'];  // DC Comics publisher
      } else if (publisher.toLowerCase().includes('image')) {
        publisherQIDs = ['wd:Q1130714'];  // Image Comics publisher
      }
    }

    const publisherFilter = publisherQIDs.length > 0 
      ? `FILTER(?publisher IN (${publisherQIDs.join(', ')}))`
      : '';

    return `
      SELECT DISTINCT ?entity ?entityLabel ?description WHERE {
        ?entity wdt:P31 wd:Q1114461.  # instance of: fictional character
        
        # Filter for characters with comic appearances or from comic publishers
        {
          ?entity wdt:P1441 ?work.     # present in work
          ?work wdt:P31 wd:Q1004.      # work is a comic book
          ${publisherFilter ? '?work wdt:P123 ?publisher.' : ''}  # work's publisher
          ${publisherFilter}
        } UNION {
          ?entity wdt:P1080 ?universe. # from fictional universe
          ${publisherFilter ? '?universe wdt:P170 ?creator. ?creator wdt:P108 ?publisher.' : ''}  # universe creator's employer
          ${publisherFilter}
        }
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?entity rdfs:label ?entityLabel.
          ?entity schema:description ?description.
        }
      }
      LIMIT ${limit}
    `;
  }

  /**
   * Build SPARQL query for comics
   */
  private buildComicQuery(limit: number): string {
    return `
      SELECT DISTINCT ?entity ?entityLabel ?description WHERE {
        ?entity wdt:P31 wd:Q1004.  # instance of: comic book
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?entity rdfs:label ?entityLabel.
          ?entity schema:description ?description.
        }
      }
      LIMIT ${limit}
    `;
  }

  /**
   * Build SPARQL query for creators
   */
  private buildCreatorQuery(limit: number): string {
    return `
      SELECT DISTINCT ?entity ?entityLabel ?description WHERE {
        ?entity wdt:P106 wd:Q11631832.  # occupation: comics writer
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?entity rdfs:label ?entityLabel.
          ?entity schema:description ?description.
        }
      }
      LIMIT ${limit}
    `;
  }

  /**
   * Build detailed query for single entity
   */
  private buildEntityDetailsQuery(qid: string): string {
    return `
      SELECT ?entityLabel ?description ?power ?powerLabel ?firstAppearance ?firstAppearanceLabel 
             ?team ?teamLabel ?enemy ?enemyLabel ?publisher ?publisherLabel WHERE {
        BIND(wd:${qid} AS ?entity)
        
        OPTIONAL { ?entity wdt:P2563 ?power }
        OPTIONAL { ?entity wdt:P1441 ?firstAppearance }
        OPTIONAL { ?entity wdt:P463 ?team }
        OPTIONAL { ?entity wdt:P7047 ?enemy }
        OPTIONAL { ?entity wdt:P123 ?publisher }
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?entity rdfs:label ?entityLabel.
          ?entity schema:description ?description.
          ?power rdfs:label ?powerLabel.
          ?firstAppearance rdfs:label ?firstAppearanceLabel.
          ?team rdfs:label ?teamLabel.
          ?enemy rdfs:label ?enemyLabel.
          ?publisher rdfs:label ?publisherLabel.
        }
      }
    `;
  }

  /**
   * Extract Wikidata entity ID from URI
   */
  private extractEntityId(uri: string): string | null {
    const match = uri?.match(/Q\d+$/);
    return match ? match[0] : null;
  }

  /**
   * Determine entity type from Wikidata instance-of (P31) property
   */
  private async determineEntityType(qid: string): Promise<'character' | 'creator' | 'location' | 'gadget' | 'team' | 'concept'> {
    // Optimized: Single query with priority-based type detection
    const query = `
      SELECT ?entityType (MIN(?priority) AS ?minPriority) WHERE {
        {
          # Check for team/organization (HIGHEST PRIORITY = 1)
          wd:${qid} wdt:P31 ?type.
          FILTER(?type IN (wd:Q14514600, wd:Q16887380, wd:Q14514609))  # fictional organization, superhero team, fictional group
          BIND("team" AS ?entityType)
          BIND(1 AS ?priority)
        } UNION {
          # Check for character (PRIORITY = 2)
          wd:${qid} wdt:P31 ?type.
          FILTER(?type IN (wd:Q1114461, wd:Q15632617))  # fictional character, fictional human
          BIND("character" AS ?entityType)
          BIND(2 AS ?priority)
        } UNION {
          # Check for creator (PRIORITY = 3)
          wd:${qid} wdt:P106 ?occupation.
          FILTER(?occupation IN (wd:Q11631832, wd:Q3391743, wd:Q715301, wd:Q10862983))  # comics writer, visual artist, cartoonist, comics artist
          BIND("creator" AS ?entityType)
          BIND(3 AS ?priority)
        }
      }
      GROUP BY ?entityType
      ORDER BY ASC(?minPriority)
      LIMIT 1
    `;

    try {
      const result = await this.executeSparql(query);
      const bindings = result.results?.bindings || [];
      
      if (bindings.length > 0) {
        const entityType = bindings[0].entityType?.value;
        if (entityType === 'team') return 'team';
        if (entityType === 'character') return 'character';
        if (entityType === 'creator') return 'creator';
      }

      // Default to character for fictional entities
      return 'character';
    } catch (error) {
      console.error('Error determining entity type:', error);
      return 'character';
    }
  }

  /**
   * Extract publisher from entity data
   */
  private extractPublisher(data: any): string {
    const publisher = data.publisherLabel?.value;
    
    if (!publisher) return 'Unknown';
    
    // Map to standard publisher names
    if (publisher.includes('Marvel')) return 'Marvel Comics';
    if (publisher.includes('DC')) return 'DC Comics';
    if (publisher.includes('Image')) return 'Image Comics';
    if (publisher.includes('Dark Horse')) return 'Dark Horse';
    if (publisher.includes('IDW')) return 'IDW';
    
    return publisher;
  }

  /**
   * Extract attributes (powers, abilities) from bindings
   */
  private extractAttributes(bindings: any[]): Array<{
    category: 'power' | 'weakness' | 'origin' | 'death' | 'resurrection' | 'ability' | 'equipment';
    name: string;
    description?: string;
    level?: 'primary' | 'secondary' | 'situational' | 'former';
    isActive?: boolean;
    firstMentionedIn?: string;
    originType?: 'accident' | 'birth' | 'experiment' | 'magic' | 'technology' | 'mutation';
  }> {
    const attributes: Array<{
      category: 'power' | 'weakness' | 'origin' | 'death' | 'resurrection' | 'ability' | 'equipment';
      name: string;
    }> = [];
    const seen = new Set<string>();

    for (const binding of bindings) {
      if (binding.powerLabel?.value) {
        const powerName = binding.powerLabel.value;
        if (!seen.has(powerName)) {
          seen.add(powerName);
          attributes.push({
            category: 'power',
            name: powerName
          });
        }
      }
    }

    return attributes;
  }

  /**
   * Extract relationships from entity with optimized type detection
   */
  private async extractRelationships(qid: string): Promise<Array<{
    targetEntityId: string;
    targetEntityName: string;
    targetEntityType: string;
    relationshipType: 'ally' | 'enemy' | 'nemesis' | 'sidekick' | 'mentor' | 'teammate' | 'family' | 'romantic' | 'rival' | 'creator' | 'wields' | 'located_in';
    relationshipSubtype?: string;
    strength?: number;
    isActive?: boolean;
    firstEstablishedIn?: string;
  }>> {
    // Optimized query that includes target entity type detection inline
    const query = `
      SELECT ?relationType ?target ?targetLabel ?targetType WHERE {
        BIND(wd:${qid} AS ?entity)
        
        {
          ?entity wdt:P463 ?target.  # member of
          BIND("teammate" AS ?relationType)
        } UNION {
          ?entity wdt:P7047 ?target.  # enemy of
          BIND("enemy" AS ?relationType)
        } UNION {
          ?entity wdt:P26 ?target.  # spouse
          BIND("romantic" AS ?relationType)
        } UNION {
          ?entity wdt:P451 ?target.  # unmarried partner
          BIND("romantic" AS ?relationType)
        }
        
        # Determine target type inline (team has priority)
        OPTIONAL {
          ?target wdt:P31 ?instanceOf.
          BIND(
            IF(?instanceOf IN (wd:Q14514600, wd:Q16887380, wd:Q14514609), "team",
              IF(?instanceOf IN (wd:Q1114461, wd:Q15632617), "character", "character")
            ) AS ?targetType
          )
        }
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?target rdfs:label ?targetLabel.
        }
      }
    `;

    try {
      const result = await this.executeSparql(query);
      const bindings = result.results?.bindings || [];

      const relationships: Array<{
        targetEntityId: string;
        targetEntityName: string;
        targetEntityType: string;
        relationshipType: 'ally' | 'enemy' | 'nemesis' | 'sidekick' | 'mentor' | 'teammate' | 'family' | 'romantic' | 'rival' | 'creator' | 'wields' | 'located_in';
      }> = [];
      
      // Use Set for deduplication
      const seen = new Set<string>();

      for (const binding of bindings) {
        const targetId = this.extractEntityId(binding.target?.value);
        if (!targetId) continue;

        const targetType = binding.targetType?.value || 'character';
        const relationType = binding.relationType?.value as any || 'ally';
        
        // Create unique key for deduplication
        const key = `${relationType}:${targetId}`;
        if (seen.has(key)) continue;
        seen.add(key);

        relationships.push({
          targetEntityId: `wikidata_${targetId}`,
          targetEntityName: binding.targetLabel?.value || 'Unknown',
          targetEntityType: targetType,
          relationshipType: relationType
        });
      }

      return relationships;
    } catch (error) {
      console.error('Error extracting relationships:', error);
      return [];
    }
  }

  /**
   * Extract first appearance from bindings
   */
  private extractFirstAppearance(bindings: any[]): { comicTitle: string; issue?: string } | null {
    const firstAppearanceLabel = bindings[0]?.firstAppearanceLabel?.value;
    
    if (!firstAppearanceLabel) return null;

    // Try to parse issue number from title
    const issueMatch = firstAppearanceLabel.match(/#(\d+)/);
    
    return {
      comicTitle: firstAppearanceLabel,
      issue: issueMatch ? issueMatch[1] : undefined
    };
  }

  /**
   * Scrape story arcs/major events from Wikidata
   * Queries for comic book storylines, crossover events, and narrative arcs
   */
  async scrapeStoryArcs(query?: {
    publisher?: string;
    arcType?: string;
    startYear?: number;
    endYear?: number;
    limit?: number;
    offset?: number;
  }): Promise<import('./BaseEntityScraper').StoryArcData[]> {
    try {
      const limit = query?.limit || 20;
      const publisher = query?.publisher;
      const startYear = query?.startYear;
      const endYear = query?.endYear;

      // Build SPARQL query for story arcs
      const sparqlQuery = this.buildStoryArcQuery(limit, publisher, startYear, endYear);
      const result = await this.executeSparql(sparqlQuery);
      const bindings = result.results?.bindings || [];

      console.log(`Retrieved ${bindings.length} story arcs from Wikidata`);

      const storyArcs: import('./BaseEntityScraper').StoryArcData[] = [];

      for (const binding of bindings) {
        const arcData = this.parseStoryArcBinding(binding);
        if (arcData) {
          storyArcs.push(arcData);
        }
      }

      return storyArcs;
    } catch (error) {
      console.error(`Error scraping Wikidata story arcs:`, error);
      return [];
    }
  }

  /**
   * Build SPARQL query for story arcs
   */
  private buildStoryArcQuery(limit: number, publisher?: string, startYear?: number, endYear?: number): string {
    let publisherFilter = '';
    
    if (publisher) {
      const publisherQIDs: string[] = [];
      
      if (publisher.toLowerCase().includes('marvel')) {
        publisherQIDs.push('wd:Q173496'); // Marvel Comics
      }
      if (publisher.toLowerCase().includes('dc')) {
        publisherQIDs.push('wd:Q2924461'); // DC Comics
      }
      if (publisher.toLowerCase().includes('image')) {
        publisherQIDs.push('wd:Q738562'); // Image Comics
      }
      
      if (publisherQIDs.length > 0) {
        publisherFilter = `FILTER(?publisher IN (${publisherQIDs.join(', ')}))`;
      }
    }

    let yearFilter = '';
    if (startYear) {
      yearFilter += `FILTER(YEAR(?publicationDate) >= ${startYear})`;
    }
    if (endYear) {
      yearFilter += `FILTER(YEAR(?publicationDate) <= ${endYear})`;
    }

    // Broadened query: Accept multiple story arc classes and relax constraints
    return `
      SELECT DISTINCT ?arc ?arcLabel ?description ?publicationDate ?publisher ?publisherLabel ?universe ?universeLabel WHERE {
        # Multiple story arc types (broadened from architect feedback)
        {
          ?arc wdt:P31 wd:Q7725310.  # comics storyline
        } UNION {
          ?arc wdt:P31 wd:Q21191270.  # comic book story arc
        } UNION {
          ?arc wdt:P31 wd:Q1002954;  # narrative
               wdt:P1441 ?work.
          ?work wdt:P31 wd:Q1114461.  # work is a comic book
        }
        
        # Publisher (relaxed - check both arc and work)
        OPTIONAL { 
          ?arc wdt:P123 ?publisher.
        }
        ${publisherFilter}
        
        # Publication date (relaxed)
        OPTIONAL { 
          ?arc wdt:P577 ?publicationDate.
        }
        ${yearFilter}
        
        # Fictional universe
        OPTIONAL { 
          ?arc wdt:P1445 ?universe.
        }
        
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "en". 
          ?arc rdfs:label ?arcLabel.
          ?arc schema:description ?description.
          ?publisher rdfs:label ?publisherLabel.
          ?universe rdfs:label ?universeLabel.
        }
      }
      LIMIT ${limit}
    `;
  }

  /**
   * Parse story arc binding from SPARQL result
   */
  private parseStoryArcBinding(binding: any): import('./BaseEntityScraper').StoryArcData | null {
    const arcName = binding.arcLabel?.value;
    if (!arcName) return null;

    const arcId = this.extractEntityId(binding.arc?.value);
    if (!arcId) return null;

    // Determine arc type from description/name
    const description = binding.description?.value || '';
    const nameLower = arcName.toLowerCase();
    
    let arcType: 'major_event' | 'character_arc' | 'team_storyline' | 'crossover' | 'origin_story' | 'death_arc' | 'resurrection_arc' = 'major_event';
    
    if (nameLower.includes('origin') || description.includes('origin')) {
      arcType = 'origin_story';
    } else if (nameLower.includes('death') || description.includes('death')) {
      arcType = 'death_arc';
    } else if (nameLower.includes('resurrection') || description.includes('return')) {
      arcType = 'resurrection_arc';
    } else if (nameLower.includes('crossover') || description.includes('crossover')) {
      arcType = 'crossover';
    }

    // Extract year from publication date
    const publicationDate = binding.publicationDate?.value;
    const year = publicationDate ? parseInt(publicationDate.substring(0, 4)) : undefined;

    return {
      arcName,
      arcType,
      arcDescription: description,
      publisher: binding.publisherLabel?.value || 'Unknown',
      universe: binding.universeLabel?.value,
      startYear: year,
      sourceEntityId: arcId,
      sourceUrl: `https://www.wikidata.org/wiki/${arcId}`
    };
  }
}
