import { BaseEntityScraper, type EntityData, type ScraperConfig } from './BaseEntityScraper';

interface AniListCharacter {
  id: number;
  name: {
    full: string;
    native?: string;
    alternative?: string[];
  };
  image?: {
    large: string;
  };
  description?: string;
  gender?: string;
  age?: string;
  dateOfBirth?: {
    year?: number;
    month?: number;
    day?: number;
  };
  media?: {
    nodes: Array<{
      id: number;
      title: {
        romaji: string;
        english?: string;
      };
      type: 'ANIME' | 'MANGA';
      startDate?: {
        year?: number;
        month?: number;
      };
      coverImage?: {
        large: string;
      };
    }>;
  };
}

interface AniListStaff {
  id: number;
  name: {
    full: string;
    native?: string;
  };
  image?: {
    large: string;
  };
  description?: string;
  languageV2?: string;
  staffMedia?: {
    nodes: Array<{
      id: number;
      title: {
        romaji: string;
        english?: string;
      };
      type: 'ANIME' | 'MANGA';
    }>;
  };
}

/**
 * AniList GraphQL scraper - Anime/Manga character and creator data
 * 500k+ entries, no authentication required, 90 requests/minute
 */
export class AniListScraper extends BaseEntityScraper {
  private graphqlUrl = 'https://graphql.anilist.co';
  
  constructor() {
    super({
      sourceName: 'anilist',
      sourceReliability: 0.90,
      rateLimit: 667, // 90 requests/minute = 1 request per 0.667 seconds
      maxRetries: 3,
      timeout: 10000,
    });
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
    const limit = Math.min(query?.limit || 10, 50); // AniList recommends max 50
    const page = Math.floor((query?.offset || 0) / limit) + 1;
    
    await this.rateLimit();
    
    try {
      if (entityType === 'character') {
        return await this.scrapeCharacters(page, limit);
      } else if (entityType === 'creator') {
        return await this.scrapeStaff(page, limit);
      }
      
      return [];
    } catch (error) {
      console.error(`AniList scrape entities error:`, error);
      return [];
    }
  }
  
  /**
   * Scrape characters from AniList
   */
  private async scrapeCharacters(page: number, limit: number): Promise<EntityData[]> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          characters {
            id
            name {
              full
              native
              alternative
            }
            image {
              large
            }
            description
            gender
            age
            dateOfBirth {
              year
              month
              day
            }
            media(sort: START_DATE) {
              nodes {
                id
                title {
                  romaji
                  english
                }
                type
                startDate {
                  year
                  month
                }
                coverImage {
                  large
                }
              }
            }
          }
        }
      }
    `;
    
    const response = await this.makeGraphQLRequest<{ Page: { characters: AniListCharacter[] } }>(
      query,
      { page, perPage: limit }
    );
    
    if (!response?.data?.Page?.characters) {
      return [];
    }
    
    return response.data.Page.characters
      .map(char => this.parseCharacter(char))
      .filter((e): e is EntityData => e !== null);
  }
  
  /**
   * Scrape staff/creators from AniList
   */
  private async scrapeStaff(page: number, limit: number): Promise<EntityData[]> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          staff {
            id
            name {
              full
              native
            }
            image {
              large
            }
            description
            languageV2
            staffMedia(sort: START_DATE) {
              nodes {
                id
                title {
                  romaji
                  english
                }
                type
              }
            }
          }
        }
      }
    `;
    
    const response = await this.makeGraphQLRequest<{ Page: { staff: AniListStaff[] } }>(
      query,
      { page, perPage: limit }
    );
    
    if (!response?.data?.Page?.staff) {
      return [];
    }
    
    return response.data.Page.staff
      .map(staff => this.parseStaff(staff))
      .filter((e): e is EntityData => e !== null);
  }
  
  /**
   * Scrape single entity by ID
   */
  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    await this.rateLimit();
    
    try {
      const query = `
        query ($id: Int) {
          Character(id: $id) {
            id
            name {
              full
              native
              alternative
            }
            image {
              large
            }
            description
            gender
            age
            media(sort: START_DATE) {
              nodes {
                id
                title {
                  romaji
                  english
                }
                type
                startDate {
                  year
                  month
                }
                coverImage {
                  large
                }
              }
            }
          }
        }
      `;
      
      const response = await this.makeGraphQLRequest<{ Character: AniListCharacter }>(
        query,
        { id: parseInt(sourceEntityId) }
      );
      
      if (!response?.data?.Character) {
        return null;
      }
      
      return this.parseCharacter(response.data.Character);
    } catch (error) {
      console.error(`AniList scrape entity error (${sourceEntityId}):`, error);
      return null;
    }
  }
  
  /**
   * Check if source has entity data
   */
  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    await this.rateLimit();
    
    try {
      const query = `
        query ($search: String) {
          Page(page: 1, perPage: 1) {
            ${entityType === 'character' ? 'characters' : 'staff'}(search: $search) {
              id
            }
          }
        }
      `;
      
      const response = await this.makeGraphQLRequest<any>(query, { search: entityName });
      const results = entityType === 'character' 
        ? response?.data?.Page?.characters 
        : response?.data?.Page?.staff;
      
      return (results?.length || 0) > 0;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Parse AniList character into EntityData
   */
  private parseCharacter(char: AniListCharacter): EntityData | null {
    if (!char?.id || !char?.name?.full) {
      return null;
    }
    
    const entityData: EntityData = {
      entityId: `anilist_char_${char.id}`,
      entityName: char.name.full,
      entityType: 'character',
      publisher: 'Anime/Manga',
      sourceEntityId: char.id.toString(),
      sourceUrl: `https://anilist.co/character/${char.id}`,
      sourceData: {
        sourceName: 'anilist',
        nativeName: char.name.native,
        aliases: char.name.alternative,
        gender: char.gender,
        age: char.age,
      },
    };
    
    // First appearance (earliest media appearance - deterministically sorted)
    if (char.media?.nodes && char.media.nodes.length > 0) {
      // Find earliest by year/month (already sorted by query, but verify)
      const sortedMedia = [...char.media.nodes].sort((a, b) => {
        const yearA = a.startDate?.year || 9999;
        const yearB = b.startDate?.year || 9999;
        if (yearA !== yearB) return yearA - yearB;
        
        const monthA = a.startDate?.month || 12;
        const monthB = b.startDate?.month || 12;
        return monthA - monthB;
      });
      
      const firstMedia = sortedMedia[0];
      entityData.firstAppearance = {
        comicTitle: firstMedia.title.english || firstMedia.title.romaji,
        year: firstMedia.startDate?.year,
        coverUrl: firstMedia.coverImage?.large,
        franchise: firstMedia.type === 'ANIME' ? 'Anime' : 'Manga',
      };
      
      if (firstMedia.startDate?.month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        entityData.firstAppearance.month = months[firstMedia.startDate.month - 1];
      }
    }
    
    // Parse description as attributes (clean HTML and entities)
    if (char.description) {
      const cleanDescription = this.cleanHtmlDescription(char.description);
      entityData.attributes = [{
        category: 'origin' as const,
        name: 'Character Bio',
        description: cleanDescription,
      }];
    }
    
    // Gender as attribute
    if (char.gender) {
      if (!entityData.attributes) {
        entityData.attributes = [];
      }
      entityData.attributes.push({
        category: 'ability' as const,
        name: 'Gender',
        description: char.gender,
      });
    }
    
    return entityData;
  }
  
  /**
   * Parse AniList staff into EntityData
   */
  private parseStaff(staff: AniListStaff): EntityData | null {
    if (!staff?.id || !staff?.name?.full) {
      return null;
    }
    
    const entityData: EntityData = {
      entityId: `anilist_staff_${staff.id}`,
      entityName: staff.name.full,
      entityType: 'creator',
      publisher: 'Anime/Manga',
      sourceEntityId: staff.id.toString(),
      sourceUrl: `https://anilist.co/staff/${staff.id}`,
      sourceData: {
        sourceName: 'anilist',
        nativeName: staff.name.native,
        language: staff.languageV2,
      },
    };
    
    // Parse description (clean HTML and entities)
    if (staff.description) {
      const cleanDescription = this.cleanHtmlDescription(staff.description);
      entityData.attributes = [{
        category: 'origin' as const,
        name: 'Creator Bio',
        description: cleanDescription,
      }];
    }
    
    // First work (earliest media)
    if (staff.staffMedia?.nodes && staff.staffMedia.nodes.length > 0) {
      const firstWork = staff.staffMedia.nodes[0];
      entityData.firstAppearance = {
        comicTitle: firstWork.title.english || firstWork.title.romaji,
        franchise: firstWork.type === 'ANIME' ? 'Anime' : 'Manga',
      };
    }
    
    return entityData;
  }
  
  /**
   * Clean HTML description - strip tags and decode entities
   */
  private cleanHtmlDescription(html: string): string {
    // Strip HTML tags
    let clean = html.replace(/<[^>]*>/g, '');
    
    // Decode common HTML entities
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&mdash;': '—',
      '&ndash;': '–',
      '&hellip;': '…',
    };
    
    for (const [entity, char] of Object.entries(entities)) {
      clean = clean.replace(new RegExp(entity, 'g'), char);
    }
    
    // Trim and normalize whitespace
    return clean.trim().replace(/\s+/g, ' ');
  }
  
  /**
   * Make GraphQL request
   */
  private async makeGraphQLRequest<T>(
    query: string,
    variables: Record<string, any>
  ): Promise<{ data: T } | null> {
    const maxRetries = this.config.maxRetries || 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 10000);
        
        const response = await fetch(this.graphqlUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ query, variables }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }
        
        return data;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    console.error(`AniList request failed after ${maxRetries} attempts:`, lastError);
    return null;
  }
}
