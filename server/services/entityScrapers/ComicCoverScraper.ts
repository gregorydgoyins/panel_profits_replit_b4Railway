import { BaseEntityScraper, EntityData } from './BaseEntityScraper';
import * as cheerio from 'cheerio';

/**
 * ComicCover.org Web Scraper
 * 
 * Scrapes comic book cover images from ComicCover.org (Grand Comics Database community).
 * Direct HTML scraping - no API required.
 * 
 * Data Coverage:
 * - Comic covers: high-resolution cover images
 * - Series data: title, publisher, issue numbers
 * - Creator credits: artists, writers on covers
 * - Publication dates: cover dates, on-sale dates
 * 
 * Reliability: 0.85 (community-maintained, comprehensive coverage)
 */
export class ComicCoverScraper extends BaseEntityScraper {
  private readonly baseUrl = 'https://www.comiccover.org';
  private readonly searchUrl = 'https://www.comiccover.org/search';

  constructor() {
    super({
      sourceName: 'comiccover',
      sourceReliability: 0.85,
      rateLimit: 2000 // 2 seconds between requests to be respectful
    });
  }

  /**
   * Search for comics and scrape cover data
   */
  async scrapeEntities(query?: { 
    searchTerm?: string;
    publisher?: string;
    year?: number;
    limit?: number;
  }): Promise<EntityData[]> {
    try {
      const searchTerm = query?.searchTerm || '';
      const limit = query?.limit || 20;
      
      console.log(`🔍 Searching ComicCover.org for: "${searchTerm}"`);
      
      await this.rateLimit();

      // Build search URL
      const searchParams = new URLSearchParams();
      if (searchTerm) searchParams.append('q', searchTerm);
      if (query?.publisher) searchParams.append('publisher', query.publisher);
      if (query?.year) searchParams.append('year', query.year.toString());

      const url = `${this.searchUrl}?${searchParams}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (Comic Cover Scraper)',
        }
      });

      if (!response.ok) {
        console.error(`❌ ComicCover.org search failed: ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const entities: EntityData[] = [];

      // Parse search results (adapting to actual HTML structure)
      // This is a template - adjust selectors based on actual site structure
      $('.comic-result, .search-result, .cover-item').slice(0, limit).each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('.title, .comic-title, h3, h4').first().text().trim();
        const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const detailLink = $el.find('a').first().attr('href');
        const publisher = $el.find('.publisher, .pub-name').first().text().trim();
        const issueNum = $el.find('.issue, .issue-num').first().text().trim();
        const year = $el.find('.year, .pub-date').first().text().trim();

        if (title && coverUrl) {
          const entity: EntityData = {
            entityId: this.generateEntityId(title, publisher, issueNum),
            entityName: title,
            entityType: 'concept', // Comic series as tradeable concept
            publisher: publisher || 'Unknown',
            sourceUrl: detailLink ? (detailLink.startsWith('http') ? detailLink : `${this.baseUrl}${detailLink}`) : url,
            firstAppearance: {
              comicTitle: `${title} ${issueNum}`.trim(),
              issue: issueNum,
              year: year ? parseInt(year.match(/\d{4}/)?.[0] || '0') : undefined,
              coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
            },
            sourceEntityId: this.generateEntityId(title, publisher, issueNum),
            sourceData: {
              issueNumber: issueNum,
              scrapedFrom: 'comiccover.org',
              assetType: 'comic_series'
            }
          };

          entities.push(entity);
        }
      });

      console.log(`✅ Found ${entities.length} covers from ComicCover.org`);
      return entities;

    } catch (error) {
      console.error(`❌ ComicCover.org scraping error:`, error);
      return [];
    }
  }

  /**
   * Scrape detailed cover data for a specific comic
   */
  async scrapeEntity(entityIdentifier: string): Promise<EntityData | null> {
    try {
      await this.rateLimit();

      // If entityIdentifier is a URL, use it directly
      const url = entityIdentifier.startsWith('http') 
        ? entityIdentifier 
        : `${this.baseUrl}/comic/${entityIdentifier}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (Comic Cover Scraper)',
        }
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract detailed cover information
      const title = $('.comic-title, .title, h1').first().text().trim();
      const coverUrl = $('.cover-image img, .main-cover img, #cover-img').first().attr('src') || 
                      $('.cover-image img, .main-cover img, #cover-img').first().attr('data-src');
      const publisher = $('.publisher-name, .publisher, .pub').first().text().trim();
      const issueNum = $('.issue-number, .issue, .num').first().text().trim();
      const year = $('.publication-date, .pub-date, .year').first().text().trim();
      
      // Extract creator credits
      const writers: string[] = [];
      const artists: string[] = [];
      
      $('.credits .writer, .credit-writer').each((_, el) => {
        writers.push($(el).text().trim());
      });
      
      $('.credits .artist, .credit-artist, .penciller').each((_, el) => {
        artists.push($(el).text().trim());
      });

      if (!title || !coverUrl) {
        return null;
      }

      const entity: EntityData = {
        entityId: this.generateEntityId(title, publisher, issueNum),
        entityName: title,
        entityType: 'concept', // Comic series as tradeable concept
        publisher: publisher || 'Unknown',
        sourceUrl: url,
        firstAppearance: {
          comicTitle: `${title} ${issueNum}`.trim(),
          issue: issueNum,
          year: year ? parseInt(year.match(/\d{4}/)?.[0] || '0') : undefined,
          coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
        },
        relationships: [...writers, ...artists].filter(Boolean).map(creatorName => ({
          targetEntityId: `creator-${creatorName.toLowerCase().replace(/\s+/g, '-')}`,
          targetEntityName: creatorName,
          targetEntityType: 'creator',
          relationshipType: 'creator' as const,
          relationshipSubtype: writers.includes(creatorName) ? 'writer' : 'artist',
          strength: 1.0,
          isActive: true
        })),
        sourceEntityId: this.generateEntityId(title, publisher, issueNum),
        sourceData: {
          issueNumber: issueNum,
          writers: writers,
          artists: artists,
          scrapedFrom: 'comiccover.org',
          detailPage: url,
          assetType: 'comic_series'
        }
      };

      return entity;

    } catch (error) {
      console.error(`Error scraping ComicCover.org entity:`, error);
      return null;
    }
  }

  /**
   * Check if ComicCover.org has data for an entity
   */
  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    try {
      const results = await this.scrapeEntities({
        searchTerm: entityName,
        limit: 1
      });
      return results.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate unique entity ID from comic details
   */
  private generateEntityId(title: string, publisher: string, issue: string): string {
    const normalized = `${publisher}-${title}-${issue}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    return `comiccover-${normalized}`;
  }

  /**
   * Scrape covers for a specific character (search by character name)
   */
  async scrapeCharacterCovers(characterName: string, limit: number = 10): Promise<string[]> {
    const entities = await this.scrapeEntities({
      searchTerm: characterName,
      limit
    });

    return entities
      .map(e => e.firstAppearance?.coverUrl)
      .filter((url): url is string => !!url);
  }

  /**
   * Scrape covers for a specific series
   */
  async scrapeSeriesCovers(seriesName: string, publisher?: string, limit: number = 20): Promise<string[]> {
    const entities = await this.scrapeEntities({
      searchTerm: seriesName,
      publisher,
      limit
    });

    return entities
      .map(e => e.firstAppearance?.coverUrl)
      .filter((url): url is string => !!url);
  }
}
