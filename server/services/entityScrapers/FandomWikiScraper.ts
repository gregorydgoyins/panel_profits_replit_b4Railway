import { BaseEntityScraper, EntityData, ScraperConfig } from './BaseEntityScraper.js';

/**
 * Fandom MediaWiki scraper for publisher-specific wikis
 * Supports: Dark Horse, Image Comics, Spawn, Walking Dead, IDW, etc.
 */

interface FandomWikiConfig {
  baseUrl: string;
  publisher: string;
  characterCategory?: string;
  creatorCategory?: string;
}

export const FANDOM_WIKIS: Record<string, FandomWikiConfig> = {
  'dark_horse': {
    baseUrl: 'https://darkhorse.fandom.com',
    publisher: 'Dark Horse',
    characterCategory: 'Category:Characters'
  },
  'image': {
    baseUrl: 'https://imagecomics.fandom.com',
    publisher: 'Image Comics',
    characterCategory: 'Category:Characters'
  },
  'spawn': {
    baseUrl: 'https://spawn.fandom.com',
    publisher: 'Image Comics',
    characterCategory: 'Category:Characters'
  },
  'walking_dead': {
    baseUrl: 'https://walkingdead.fandom.com',
    publisher: 'Image Comics',
    characterCategory: 'Category:Comic_Series_Characters'
  },
  'idw': {
    baseUrl: 'https://idwpublishing.fandom.com',
    publisher: 'IDW',
    characterCategory: 'Category:Characters'
  },
  'valiant': {
    baseUrl: 'https://valiant.fandom.com',
    publisher: 'Valiant',
    characterCategory: 'Category:Characters'
  },
  'boom': {
    baseUrl: 'https://boom-studios.fandom.com',
    publisher: 'Boom Studios',
    characterCategory: 'Category:Characters'
  }
};

interface MediaWikiPage {
  pageid: number;
  ns: number;
  title: string;
  extract?: string;
  revisions?: Array<{
    slots?: {
      main?: {
        '*': string;
      };
    };
  }>;
  images?: Array<{
    title: string;
  }>;
}

interface CategoryMembersResponse {
  query?: {
    categorymembers?: Array<{
      pageid: number;
      ns: number;
      title: string;
    }>;
  };
  continue?: {
    cmcontinue: string;
  };
}

interface PageContentResponse {
  query?: {
    pages?: Record<string, MediaWikiPage>;
  };
}

export class FandomWikiScraper extends BaseEntityScraper {
  private wikiConfig: FandomWikiConfig;

  constructor(wikiKey: string, reliability: number = 0.75) {
    const wikiConfig = FANDOM_WIKIS[wikiKey];
    if (!wikiConfig) {
      throw new Error(`Unknown Fandom wiki: ${wikiKey}. Available: ${Object.keys(FANDOM_WIKIS).join(', ')}`);
    }

    const scraperConfig: ScraperConfig = {
      sourceName: `fandom-${wikiKey}`,
      sourceReliability: reliability,
      rateLimit: 1000, // 1 second between requests
      maxRetries: 3,
      timeout: 10000
    };
    
    super(scraperConfig);
    this.wikiConfig = wikiConfig;
  }

  getSourceName(): string {
    return `Fandom Wiki: ${this.wikiConfig.publisher}`;
  }

  /**
   * Get category members using MediaWiki API
   */
  private async getCategoryMembers(category: string, limit: number = 50): Promise<string[]> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmlimit: Math.min(limit, 500).toString(),
      cmtype: 'page',
      format: 'json'
    });

    const url = `${this.wikiConfig.baseUrl}/api.php?${params}`;
    
    await this.rateLimit();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PanelProfitsBot/1.0 (Entity Scraper)'
      }
    });

    if (!response.ok) {
      throw new Error(`MediaWiki API error: ${response.status}`);
    }

    const data: CategoryMembersResponse = await response.json();
    return data.query?.categorymembers?.map((member: any) => member.title) || [];
  }

  /**
   * Get page content with revisions
   */
  private async getPageContent(titles: string[]): Promise<MediaWikiPage[]> {
    const params = new URLSearchParams({
      action: 'query',
      titles: titles.join('|'),
      prop: 'revisions|extracts|images',
      rvprop: 'content',
      rvslots: 'main',
      exintro: 'true',
      explaintext: 'true',
      imlimit: '10',
      format: 'json'
    });

    const url = `${this.wikiConfig.baseUrl}/api.php?${params}`;
    
    await this.rateLimit();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PanelProfitsBot/1.0 (Entity Scraper)'
      }
    });

    if (!response.ok) {
      throw new Error(`MediaWiki API error: ${response.status}`);
    }

    const data: PageContentResponse = await response.json();
    const pages = data.query?.pages || {};
    return Object.values(pages);
  }

  /**
   * Parse infobox data from wikitext
   */
  private parseInfobox(wikitext: string): Record<string, string> {
    const infobox: Record<string, string> = {};
    
    // Extract infobox template
    const infoboxMatch = wikitext.match(/\{\{Infobox[^}]*\|([^}]+)\}\}/s);
    if (!infoboxMatch) return infobox;

    const content = infoboxMatch[1];
    
    // Parse key-value pairs
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*\|\s*([^=]+?)\s*=\s*(.+?)\s*$/);
      if (match) {
        const [, key, value] = match;
        infobox[key.toLowerCase().trim()] = this.cleanWikiText(value);
      }
    }

    return infobox;
  }

  /**
   * Clean wiki markup from text
   */
  private cleanWikiText(text: string): string {
    return text
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')  // [[Link|Text]] -> Text
      .replace(/\[\[([^\]]+)\]\]/g, '$1')  // [[Link]] -> Link
      .replace(/\{\{[^}]+\}\}/g, '')  // Remove templates
      .replace(/<[^>]+>/g, '')  // Remove HTML tags
      .replace(/'''(.+?)'''/g, '$1')  // Bold
      .replace(/''(.+?)''/g, '$1')  // Italic
      .replace(/&nbsp;/g, ' ')  // HTML entities
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .trim();
  }

  /**
   * Extract powers and abilities from text
   */
  private extractPowers(text: string, infobox: Record<string, string>): string[] {
    const powers: Set<string> = new Set();

    // From infobox
    const powerFields = ['powers', 'abilities', 'power', 'ability', 'superpowers'];
    for (const field of powerFields) {
      if (infobox[field]) {
        const powerList = infobox[field].split(/[,;]/).map(p => p.trim()).filter(Boolean);
        powerList.forEach(p => powers.add(p));
      }
    }

    // From "Powers and Abilities" section
    const powersSection = text.match(/==+\s*Powers\s+and\s+Abilities\s*==+\s*([^=]+)/i);
    if (powersSection) {
      const powerText = powersSection[1];
      const powerMatches = powerText.match(/\*\s*([^:\n]+)/g);
      if (powerMatches) {
        powerMatches.forEach(match => {
          const power = match.replace(/^\*\s*/, '').trim();
          if (power.length > 3 && power.length < 100) {
            powers.add(power);
          }
        });
      }
    }

    return Array.from(powers).slice(0, 20);
  }

  /**
   * Extract relationships from text
   */
  private extractRelationships(text: string, infobox: Record<string, string>): Array<{
    targetEntityId: string;
    targetEntityName: string;
    targetEntityType: string;
    relationshipType: 'ally' | 'enemy' | 'nemesis' | 'sidekick' | 'mentor' | 'teammate' | 'family' | 'romantic' | 'rival' | 'creator' | 'wields' | 'located_in';
  }> {
    const relationships: Array<{
      targetEntityId: string;
      targetEntityName: string;
      targetEntityType: string;
      relationshipType: 'ally' | 'enemy' | 'nemesis' | 'sidekick' | 'mentor' | 'teammate' | 'family' | 'romantic' | 'rival' | 'creator' | 'wields' | 'located_in';
    }> = [];

    // From infobox
    const relationFields: Record<string, 'ally' | 'enemy' | 'teammate' | 'family' | 'creator'> = {
      'allies': 'ally',
      'enemies': 'enemy',
      'team': 'teammate',
      'teams': 'teammate',
      'affiliations': 'teammate',
      'family': 'family',
      'relatives': 'family',
      'creator': 'creator',
      'creators': 'creator'
    };

    for (const [field, type] of Object.entries(relationFields)) {
      if (infobox[field]) {
        const targets = infobox[field].split(/[,;]/).map(t => t.trim()).filter(Boolean);
        targets.forEach(target => {
          if (target.length > 2 && target.length < 100) {
            relationships.push({
              targetEntityId: this.normalizeEntityName(target),
              targetEntityName: target,
              targetEntityType: type === 'teammate' ? 'team' : 'character',
              relationshipType: type
            });
          }
        });
      }
    }

    return relationships.slice(0, 50);
  }

  /**
   * Extract first appearance from text
   */
  private extractFirstAppearance(text: string, infobox: Record<string, string>): {
    comicTitle: string;
    issueNumber?: string;
    publishDate?: string;
  } | null {
    // From infobox
    if (infobox['first appearance'] || infobox['first_appearance'] || infobox['debut']) {
      const appearance = infobox['first appearance'] || infobox['first_appearance'] || infobox['debut'];
      
      // Parse comic title and issue
      const match = appearance.match(/(.+?)\s*#?(\d+|Annual|Special)/i);
      if (match) {
        return {
          comicTitle: match[1].trim(),
          issueNumber: match[2]
        };
      }
      
      return {
        comicTitle: appearance.trim()
      };
    }

    // From text
    const appearanceMatch = text.match(/first\s+appear(?:ed|ance)\s+(?:in|was)\s+(.+?)[\.\n]/i);
    if (appearanceMatch) {
      return {
        comicTitle: this.cleanWikiText(appearanceMatch[1])
      };
    }

    return null;
  }

  async scrapeEntities(query?: { entityType?: string; publisher?: string; limit?: number; offset?: number }): Promise<EntityData[]> {
    const { entityType = 'character', limit = 50 } = query || {};

    // Use publisher-specific category or default
    const category = entityType === 'character' 
      ? (this.wikiConfig.characterCategory || 'Category:Characters')
      : (this.wikiConfig.creatorCategory || 'Category:Creators');

    console.log(`Fetching ${limit} ${entityType}s from ${this.wikiConfig.publisher} wiki category: ${category}`);

    // Get category members
    const titles = await this.getCategoryMembers(category, limit);
    
    if (titles.length === 0) {
      console.log(`No ${entityType}s found in category ${category}`);
      return [];
    }

    console.log(`Found ${titles.length} ${entityType} pages, fetching content...`);

    // Fetch content in batches of 50 (MediaWiki limit)
    const entities: EntityData[] = [];
    const batchSize = 50;

    for (let i = 0; i < titles.length; i += batchSize) {
      const batch = titles.slice(i, i + batchSize);
      const pages = await this.getPageContent(batch);

      for (const page of pages) {
        try {
          const wikitext = page.revisions?.[0]?.slots?.main?.['*'] || '';
          const extract = page.extract || '';
          
          if (!wikitext && !extract) continue;

          const infobox = this.parseInfobox(wikitext);
          const fullText = wikitext || extract;

          const entity: EntityData = {
            entityId: `${this.wikiConfig.publisher.toLowerCase().replace(/\s+/g, '_')}_${page.pageid}`,
            entityName: page.title,
            entityType: (entityType as 'character' | 'creator' | 'location' | 'gadget' | 'team' | 'concept') || 'character',
            publisher: this.wikiConfig.publisher,
            sourceEntityId: String(page.pageid),
            sourceUrl: `${this.wikiConfig.baseUrl}/wiki/${encodeURIComponent(page.title)}`,
            attributes: [],
            relationships: []
          };

          // Extract powers
          const powers = this.extractPowers(fullText, infobox);
          entity.attributes = powers.map(power => ({
            category: 'power' as const,
            name: power
          }));

          // Add real name if available
          if (infobox['real name'] || infobox['real_name'] || infobox['alter ego']) {
            const realName = infobox['real name'] || infobox['real_name'] || infobox['alter ego'];
            entity.attributes?.push({
              category: 'ability' as const,
              name: 'Real Name',
              description: realName
            });
          }

          // Add species if available
          if (infobox['species'] || infobox['race']) {
            entity.attributes?.push({
              category: 'origin' as const,
              name: 'Species',
              description: infobox['species'] || infobox['race']
            });
          }

          // Extract relationships
          entity.relationships = this.extractRelationships(fullText, infobox);

          // Extract first appearance
          const firstAppearance = this.extractFirstAppearance(fullText, infobox);
          if (firstAppearance) {
            entity.firstAppearance = {
              comicTitle: firstAppearance.comicTitle,
              issue: firstAppearance.issueNumber
            };
          }

          // Add description to sourceData
          if (extract) {
            entity.sourceData = { description: extract.substring(0, 500) };
          }

          entities.push(entity);
        } catch (error) {
          console.error(`Error parsing page ${page.title}:`, error);
          continue;
        }
      }

      // Rate limiting between batches
      if (i + batchSize < titles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Successfully scraped ${entities.length} ${entityType}s from ${this.wikiConfig.publisher} wiki`);
    return entities;
  }

  /**
   * Scrape a single entity by page ID
   */
  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    try {
      // Fetch page by ID using pageids parameter
      const params = new URLSearchParams({
        action: 'query',
        pageids: sourceEntityId,
        prop: 'revisions|extracts|images',
        rvprop: 'content',
        rvslots: 'main',
        exintro: 'true',
        explaintext: 'true',
        imlimit: '10',
        format: 'json'
      });

      const url = `${this.wikiConfig.baseUrl}/api.php?${params}`;
      
      await this.rateLimit();
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (Entity Scraper)'
        }
      });

      if (!response.ok) {
        throw new Error(`MediaWiki API error: ${response.status}`);
      }

      const data: PageContentResponse = await response.json();
      const pages = data.query?.pages || {};
      const pagesArray = Object.values(pages);
      
      if (pagesArray.length === 0) {
        return null;
      }

      const page = pagesArray[0];
      const wikitext = page.revisions?.[0]?.slots?.main?.['*'] || '';
      const extract = page.extract || '';
      
      if (!wikitext && !extract) {
        return null;
      }

      const infobox = this.parseInfobox(wikitext);
      const fullText = wikitext || extract;

      const entity: EntityData = {
        entityId: `${this.wikiConfig.publisher.toLowerCase().replace(/\s+/g, '_')}_${page.pageid}`,
        entityName: page.title,
        entityType: 'character',
        publisher: this.wikiConfig.publisher,
        sourceEntityId: String(page.pageid),
        sourceUrl: `${this.wikiConfig.baseUrl}/wiki/${encodeURIComponent(page.title)}`
      };

      // Extract powers
      const powers = this.extractPowers(fullText, infobox);
      entity.attributes = powers.map(power => ({
        category: 'power' as const,
        name: power
      }));

      // Extract relationships
      entity.relationships = this.extractRelationships(fullText, infobox);

      // Extract first appearance
      const firstAppearance = this.extractFirstAppearance(fullText, infobox);
      if (firstAppearance) {
        entity.firstAppearance = {
          comicTitle: firstAppearance.comicTitle,
          issue: firstAppearance.issueNumber
        };
      }

      if (extract) {
        entity.sourceData = { description: extract.substring(0, 500) };
      }

      return entity;
    } catch (error) {
      console.error(`Error scraping entity ${sourceEntityId}:`, error);
      return null;
    }
  }

  /**
   * Check if wiki has data for a given entity
   */
  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        action: 'opensearch',
        search: entityName,
        limit: '1',
        format: 'json'
      });

      const url = `${this.wikiConfig.baseUrl}/api.php?${params}`;
      
      await this.rateLimit();
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (Entity Scraper)'
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data[1] && data[1].length > 0;
    } catch (error) {
      console.error(`Error checking entity data for ${entityName}:`, error);
      return false;
    }
  }
}
