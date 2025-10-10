import { BaseEntityScraper, EntityData } from './BaseEntityScraper';
import * as cheerio from 'cheerio';

/**
 * League of Comic Geeks Web Scraper
 * 
 * Scrapes comic book data from League of Comic Geeks (600K+ comics).
 * Direct HTML scraping - no official API.
 * 
 * Data Coverage:
 * - Comics: 600K+ across all publishers
 * - Series data: titles, publishers, creators
 * - Cover images: high-quality artwork
 * - Release dates: past and upcoming
 * - Ratings: community scores
 * 
 * Reliability: 0.88 (large database, active community)
 */
export class LeagueOfGeeksScraper extends BaseEntityScraper {
  private readonly baseUrl = 'https://leagueofcomicgeeks.com';
  private readonly searchUrl = 'https://leagueofcomicgeeks.com/search';

  constructor() {
    super({
      sourceName: 'league_of_geeks',
      sourceReliability: 0.88,
      rateLimit: 2000 // 2 seconds between requests
    });
  }

  /**
   * Search for comics and scrape data
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
      
      console.log(`🔍 Searching League of Geeks for: "${searchTerm}"`);
      
      await this.rateLimit();

      // Build search URL with parameters
      const searchParams = new URLSearchParams();
      if (searchTerm) searchParams.append('keyword', searchTerm);
      if (query?.publisher) searchParams.append('publisher', query.publisher);

      const url = `${this.searchUrl}?${searchParams}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (League Scraper)',
        }
      });

      if (!response.ok) {
        console.error(`❌ League of Geeks search failed: ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const entities: EntityData[] = [];

      // Parse search results (adjust selectors based on actual site structure)
      $('.comic-item, .search-item, .result-item, .comic-card').slice(0, limit).each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('.title, .comic-title, h3, h4').first().text().trim();
        const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const detailLink = $el.find('a').first().attr('href');
        const publisher = $el.find('.publisher, .pub').first().text().trim();
        const creator = $el.find('.creator, .author, .writer').first().text().trim();
        const releaseDate = $el.find('.date, .release').first().text().trim();
        const rating = $el.find('.rating, .score').first().text().trim();

        if (title && coverUrl) {
          const entity: EntityData = {
            entityId: this.generateEntityId(title, publisher),
            entityName: title,
            entityType: 'concept', // Comic series as tradeable concept
            publisher: publisher || 'Unknown',
            sourceUrl: detailLink ? (detailLink.startsWith('http') ? detailLink : `${this.baseUrl}${detailLink}`) : url,
            firstAppearance: {
              comicTitle: title,
              year: releaseDate ? this.extractYear(releaseDate) : undefined,
              coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
            },
            relationships: creator ? [{
              targetEntityId: `creator-${creator.toLowerCase().replace(/\s+/g, '-')}`,
              targetEntityName: creator,
              targetEntityType: 'creator',
              relationshipType: 'creator' as const,
              strength: 1.0,
              isActive: true
            }] : undefined,
            sourceEntityId: this.generateEntityId(title, publisher),
            sourceData: {
              rating: rating,
              releaseDate: releaseDate,
              scrapedFrom: 'league_of_geeks'
            }
          };

          entities.push(entity);
        }
      });

      console.log(`✅ Found ${entities.length} comics from League of Geeks`);
      return entities;

    } catch (error) {
      console.error(`❌ League of Geeks scraping error:`, error);
      return [];
    }
  }

  /**
   * Scrape detailed comic data
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
          'User-Agent': 'PanelProfitsBot/1.0 (League Scraper)',
        }
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract detailed comic information
      const title = $('.comic-title, .title, h1').first().text().trim();
      const coverUrl = $('.cover-image img, .main-cover img, #comic-cover').first().attr('src') || 
                      $('.cover-image img, .main-cover img, #comic-cover').first().attr('data-src');
      const publisher = $('.publisher, .pub-name').first().text().trim();
      const description = $('.description, .synopsis, .summary').first().text().trim();
      const releaseDate = $('.release-date, .pub-date').first().text().trim();
      const rating = $('.rating, .score, .avg-rating').first().text().trim();
      
      // Extract creators
      const creators: string[] = [];
      $('.creator-list .creator, .credits .person').each((_, el) => {
        creators.push($(el).text().trim());
      });

      if (!title || !coverUrl) {
        return null;
      }

      const entity: EntityData = {
        entityId: this.generateEntityId(title, publisher),
        entityName: title,
        entityType: 'concept',
        publisher: publisher || 'Unknown',
        sourceUrl: url,
        firstAppearance: {
          comicTitle: title,
          year: releaseDate ? this.extractYear(releaseDate) : undefined,
          coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
        },
        attributes: description ? [{
          category: 'origin' as const,
          name: 'description',
          description: description,
          level: 'primary' as const,
          isActive: true
        }] : undefined,
        relationships: creators.map(creator => ({
          targetEntityId: `creator-${creator.toLowerCase().replace(/\s+/g, '-')}`,
          targetEntityName: creator,
          targetEntityType: 'creator',
          relationshipType: 'creator' as const,
          strength: 1.0,
          isActive: true
        })),
        sourceEntityId: this.generateEntityId(title, publisher),
        sourceData: {
          rating: rating,
          releaseDate: releaseDate,
          description: description,
          scrapedFrom: 'league_of_geeks',
          detailPage: url
        }
      };

      return entity;

    } catch (error) {
      console.error(`Error scraping League of Geeks entity:`, error);
      return null;
    }
  }

  /**
   * Check if League of Geeks has data for an entity
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
   * Generate unique entity ID
   */
  private generateEntityId(title: string, publisher: string): string {
    const normalized = `${publisher}-${title}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    return `log-${normalized}`;
  }

  /**
   * Extract year from date string
   */
  private extractYear(dateStr: string): number | undefined {
    const match = dateStr.match(/\d{4}/);
    return match ? parseInt(match[0]) : undefined;
  }

  /**
   * Scrape upcoming releases
   */
  async scrapeUpcomingReleases(limit: number = 50): Promise<EntityData[]> {
    try {
      await this.rateLimit();

      const url = `${this.baseUrl}/comics/new-releases`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (League Scraper)',
        }
      });

      if (!response.ok) {
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const entities: EntityData[] = [];

      $('.comic-item, .release-item').slice(0, limit).each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('.title, .comic-title').first().text().trim();
        const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const publisher = $el.find('.publisher').first().text().trim();
        const releaseDate = $el.find('.date').first().text().trim();

        if (title && coverUrl) {
          entities.push({
            entityId: this.generateEntityId(title, publisher),
            entityName: title,
            entityType: 'concept',
            publisher: publisher || 'Unknown',
            sourceUrl: url,
            firstAppearance: {
              comicTitle: title,
              year: releaseDate ? this.extractYear(releaseDate) : undefined,
              coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
            },
            sourceEntityId: this.generateEntityId(title, publisher),
            sourceData: {
              releaseDate: releaseDate,
              scrapedFrom: 'league_of_geeks',
              isUpcoming: true
            }
          });
        }
      });

      console.log(`✅ Found ${entities.length} upcoming releases from League of Geeks`);
      return entities;

    } catch (error) {
      console.error(`Error scraping upcoming releases:`, error);
      return [];
    }
  }

  /**
   * Scrape popular/trending comics
   */
  async scrapeTrendingComics(limit: number = 30): Promise<EntityData[]> {
    try {
      await this.rateLimit();

      const url = `${this.baseUrl}/comics/trending`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PanelProfitsBot/1.0 (League Scraper)',
        }
      });

      if (!response.ok) {
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const entities: EntityData[] = [];

      $('.comic-item, .trending-item').slice(0, limit).each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('.title, .comic-title').first().text().trim();
        const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
        const publisher = $el.find('.publisher').first().text().trim();
        const rating = $el.find('.rating').first().text().trim();

        if (title && coverUrl) {
          entities.push({
            entityId: this.generateEntityId(title, publisher),
            entityName: title,
            entityType: 'concept',
            publisher: publisher || 'Unknown',
            sourceUrl: url,
            firstAppearance: {
              comicTitle: title,
              coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
            },
            sourceEntityId: this.generateEntityId(title, publisher),
            sourceData: {
              rating: rating,
              scrapedFrom: 'league_of_geeks',
              isTrending: true
            }
          });
        }
      });

      console.log(`✅ Found ${entities.length} trending comics from League of Geeks`);
      return entities;

    } catch (error) {
      console.error(`Error scraping trending comics:`, error);
      return [];
    }
  }
}
