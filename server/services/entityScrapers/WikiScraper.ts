import { BaseEntityScraper, EntityData, ScraperConfig } from './BaseEntityScraper';

interface WikiSearchResult {
  query: {
    search: Array<{
      title: string;
      pageid: number;
      snippet: string;
    }>;
  };
}

interface WikiPage {
  parse: {
    title: string;
    pageid: number;
    text: {
      '*': string; // HTML content
    };
    images?: string[];
    categories?: Array<{
      '*': string;
    }>;
  };
}

export class WikiScraper extends BaseEntityScraper {
  private baseUrl: string;
  private wikiName: string;
  private publisher: string;

  constructor(wikiUrl: string, wikiName: string, publisher: string, reliability: number = 0.80) {
    const config: ScraperConfig = {
      sourceName: `${wikiName.toLowerCase()}-wiki`,
      sourceReliability: reliability,
      rateLimit: 1000, // 1 second between requests (be respectful)
      maxRetries: 3,
      timeout: 10000,
    };
    
    super(config);
    this.baseUrl = wikiUrl;
    this.wikiName = wikiName;
    this.publisher = publisher;
  }

  async scrapeEntities(query?: { entityType?: string; publisher?: string; limit?: number; offset?: number }): Promise<EntityData[]> {
    const limit = query?.limit || 20;
    const offset = query?.offset || 0;

    try {
      // Use category members to get character list
      const categoryUrl = `${this.baseUrl}?action=query&list=categorymembers&cmtitle=Category:Characters&cmlimit=${limit}&cmoffset=${offset}&format=json&origin=*`;
      
      const response = await fetch(categoryUrl);
      if (!response.ok) {
        throw new Error(`Wiki API error: ${response.status}`);
      }

      const data = await response.json();
      const members = data.query?.categorymembers || [];

      // Scrape each character page
      const results: EntityData[] = [];
      for (const member of members.slice(0, limit)) {
        await this.rateLimit();
        const entityData = await this.scrapeByTitle(member.title);
        if (entityData) {
          results.push(entityData);
        }
      }

      return results;
      
    } catch (error) {
      console.error('Wiki scraper error:', error);
      return [];
    }
  }

  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    try {
      const pageUrl = `${this.baseUrl}?action=parse&pageid=${sourceEntityId}&format=json&origin=*`;
      
      const response = await fetch(pageUrl);
      if (!response.ok) {
        return null;
      }

      const data: WikiPage = await response.json();
      return this.mapToEntityData(data.parse);
      
    } catch (error) {
      console.error(`Wiki scraper error for ${sourceEntityId}:`, error);
      return null;
    }
  }

  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    try {
      const searchUrl = `${this.baseUrl}?action=opensearch&search=${encodeURIComponent(entityName)}&limit=1&format=json&origin=*`;
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data[1] && data[1].length > 0;
      
    } catch (error) {
      console.error(`Wiki hasEntityData error for ${entityName}:`, error);
      return false;
    }
  }

  private async scrapeByTitle(title: string): Promise<EntityData | null> {
    try {
      const pageUrl = `${this.baseUrl}?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;
      
      const response = await fetch(pageUrl);
      if (!response.ok) {
        return null;
      }

      const data: WikiPage = await response.json();
      return this.mapToEntityData(data.parse);
      
    } catch (error) {
      return null;
    }
  }

  private mapToEntityData(page: WikiPage['parse']): EntityData {
    const html = page.text?.['*'] || '';
    
    const entityData: EntityData = {
      entityId: `${this.wikiName.toLowerCase()}-wiki-${page.pageid}`,
      entityName: page.title,
      entityType: this.determineEntityType(page.title, html),
      publisher: this.publisher,
      firstAppearance: this.extractFirstAppearance(html),
      attributes: this.extractAttributes(html),
      relationships: this.extractRelationships(html),
      appearances: [], // Would need separate API calls for each appearance
      sourceEntityId: page.pageid.toString(),
      sourceUrl: `${this.baseUrl.replace('/api.php', '')}/wiki/${encodeURIComponent(page.title)}`,
      sourceData: { html, images: page.images },
    };

    return entityData;
  }

  private determineEntityType(title: string, html: string): EntityData['entityType'] {
    const lowerTitle = title.toLowerCase();
    const lowerHtml = html.toLowerCase();

    if (lowerHtml.includes('category:characters') || lowerHtml.includes('infobox character')) {
      return 'character';
    }
    if (lowerHtml.includes('category:creators') || lowerHtml.includes('writer') || lowerHtml.includes('artist')) {
      return 'creator';
    }
    if (lowerHtml.includes('category:locations') || lowerHtml.includes('infobox location')) {
      return 'location';
    }
    if (lowerHtml.includes('category:items') || lowerHtml.includes('category:weapons')) {
      return 'gadget';
    }
    if (lowerHtml.includes('category:teams') || lowerHtml.includes('infobox team')) {
      return 'team';
    }

    return 'character'; // Default assumption
  }

  private extractFirstAppearance(html: string): EntityData['firstAppearance'] {
    // Look for "First Appearance" in infobox or text
    const patterns = [
      /First\s+Appearance:?\s*<\/th>.*?<td[^>]*>(.*?)<\/td>/is,
      /First\s+appearance:?\s*<\/b>\s*(.*?)(?:<br|<\/p|<\/div)/is,
      /first\s+appeared\s+in\s+(?:<[^>]+>)*([^<]+)/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const cleanText = this.stripHtml(match[1]).trim();
        if (cleanText && cleanText.length > 0 && cleanText.length < 200) {
          return {
            comicTitle: cleanText,
            franchise: this.publisher === 'Marvel Comics' ? 'Marvel' : 'DC',
          };
        }
      }
    }

    return undefined;
  }

  private extractAttributes(html: string): EntityData['attributes'] {
    const attributes: EntityData['attributes'] = [];

    // Extract powers/abilities section
    const powersMatch = html.match(/(?:Powers?\s+and\s+Abilities|Abilities):?\s*<\/h[0-9]>(.*?)(?:<h[0-9]|$)/is);
    if (powersMatch) {
      const powersText = this.stripHtml(powersMatch[1]);
      const powersList = powersText
        .split(/[•\n]/)
        .map(p => p.trim())
        .filter(p => p.length > 3 && p.length < 500);

      for (const power of powersList.slice(0, 10)) {
        attributes.push({
          category: 'power',
          name: power.substring(0, 100),
          description: power,
          isActive: true,
        });
      }
    }

    // Extract weaknesses
    const weaknessMatch = html.match(/Weaknesses?:?\s*<\/h[0-9]>(.*?)(?:<h[0-9]|$)/is);
    if (weaknessMatch) {
      const weaknessText = this.stripHtml(weaknessMatch[1]).trim();
      if (weaknessText.length > 0) {
        attributes.push({
          category: 'weakness',
          name: 'Weaknesses',
          description: weaknessText.substring(0, 500),
          isActive: true,
        });
      }
    }

    return attributes;
  }

  private extractRelationships(html: string): EntityData['relationships'] {
    const relationships: EntityData['relationships'] = [];

    // Extract allies/enemies from infobox or sections
    const allyPattern = /Allies?:?\s*<\/th>.*?<td[^>]*>(.*?)<\/td>/is;
    const allyMatch = html.match(allyPattern);
    if (allyMatch) {
      const allies = this.extractLinks(allyMatch[1]);
      for (const ally of allies) {
        relationships.push({
          targetEntityId: `character-${ally.toLowerCase().replace(/\s+/g, '-')}`,
          targetEntityName: ally,
          targetEntityType: 'character',
          relationshipType: 'ally',
          isActive: true,
        });
      }
    }

    const enemyPattern = /Enemies?:?\s*<\/th>.*?<td[^>]*>(.*?)<\/td>/is;
    const enemyMatch = html.match(enemyPattern);
    if (enemyMatch) {
      const enemies = this.extractLinks(enemyMatch[1]);
      for (const enemy of enemies) {
        relationships.push({
          targetEntityId: `character-${enemy.toLowerCase().replace(/\s+/g, '-')}`,
          targetEntityName: enemy,
          targetEntityType: 'character',
          relationshipType: 'enemy',
          isActive: true,
        });
      }
    }

    return relationships;
  }

  private extractLinks(html: string): string[] {
    const linkPattern = /<a[^>]+title="([^"]+)"[^>]*>.*?<\/a>/g;
    const links: string[] = [];
    let match;

    while ((match = linkPattern.exec(html)) !== null) {
      links.push(match[1]);
    }

    return links.slice(0, 20); // Limit to 20 relationships
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Convenience factory functions
export function createMarvelWikiScraper(): WikiScraper {
  return new WikiScraper(
    'https://marvel.fandom.com/api.php',
    'Marvel',
    'Marvel Comics',
    0.80
  );
}

export function createDCWikiScraper(): WikiScraper {
  return new WikiScraper(
    'https://dc.fandom.com/api.php',
    'DC',
    'DC Comics',
    0.80
  );
}
