"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AniListScraper = void 0;
const BaseEntityScraper_1 = require("./BaseEntityScraper");
/**
 * AniList GraphQL scraper - Anime/Manga character and creator data
 * 500k+ entries, no authentication required, 90 requests/minute
 */
class AniListScraper extends BaseEntityScraper_1.BaseEntityScraper {
    constructor() {
        super({
            sourceName: 'anilist',
            sourceReliability: 0.90,
            rateLimit: 667, // 90 requests/minute = 1 request per 0.667 seconds
            maxRetries: 3,
            timeout: 10000,
        });
        this.graphqlUrl = 'https://graphql.anilist.co';
    }
    /**
     * Scrape entities by query
     */
    async scrapeEntities(query) {
        const entityType = query?.entityType || 'character';
        const limit = Math.min(query?.limit || 10, 50); // AniList recommends max 50
        const page = Math.floor((query?.offset || 0) / limit) + 1;
        await this.rateLimit();
        try {
            if (entityType === 'character') {
                return await this.scrapeCharacters(page, limit);
            }
            else if (entityType === 'creator') {
                return await this.scrapeStaff(page, limit);
            }
            return [];
        }
        catch (error) {
            console.error(`AniList scrape entities error:`, error);
            return [];
        }
    }
    /**
     * Scrape characters from AniList
     */
    async scrapeCharacters(page, limit) {
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
        const response = await this.makeGraphQLRequest(query, { page, perPage: limit });
        if (!response?.data?.Page?.characters) {
            return [];
        }
        return response.data.Page.characters
            .map(char => this.parseCharacter(char))
            .filter((e) => e !== null);
    }
    /**
     * Scrape staff/creators from AniList
     */
    async scrapeStaff(page, limit) {
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
        const response = await this.makeGraphQLRequest(query, { page, perPage: limit });
        if (!response?.data?.Page?.staff) {
            return [];
        }
        return response.data.Page.staff
            .map(staff => this.parseStaff(staff))
            .filter((e) => e !== null);
    }
    /**
     * Scrape single entity by ID
     * Tries both Character and Staff queries since we don't know the type from just the ID
     */
    async scrapeEntity(sourceEntityId) {
        await this.rateLimit();
        const id = parseInt(sourceEntityId);
        if (isNaN(id)) {
            return null;
        }
        // Try Character first
        try {
            const characterQuery = `
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
            const charResponse = await this.makeGraphQLRequest(characterQuery, { id }, true // silent mode - suppress error logging for 404s
            );
            if (charResponse?.data?.Character) {
                return this.parseCharacter(charResponse.data.Character);
            }
        }
        catch (error) {
            // Character query failed, continue to try Staff (expected for staff IDs)
        }
        // Try Staff if Character failed
        try {
            const staffQuery = `
        query ($id: Int) {
          Staff(id: $id) {
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
      `;
            const staffResponse = await this.makeGraphQLRequest(staffQuery, { id });
            if (staffResponse?.data?.Staff) {
                return this.parseStaff(staffResponse.data.Staff);
            }
        }
        catch (error) {
            console.error(`AniList scrape entity error (${sourceEntityId}):`, error);
        }
        return null;
    }
    /**
     * Check if source has entity data
     */
    async hasEntityData(entityName, entityType) {
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
            const response = await this.makeGraphQLRequest(query, { search: entityName });
            const results = entityType === 'character'
                ? response?.data?.Page?.characters
                : response?.data?.Page?.staff;
            return (results?.length || 0) > 0;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Parse AniList character into EntityData
     */
    parseCharacter(char) {
        if (!char?.id || !char?.name?.full) {
            return null;
        }
        const entityData = {
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
                if (yearA !== yearB)
                    return yearA - yearB;
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
                    category: 'origin',
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
                category: 'ability',
                name: 'Gender',
                description: char.gender,
            });
        }
        return entityData;
    }
    /**
     * Parse AniList staff into EntityData
     */
    parseStaff(staff) {
        if (!staff?.id || !staff?.name?.full) {
            return null;
        }
        const entityData = {
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
                    category: 'origin',
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
    cleanHtmlDescription(html) {
        // Strip HTML tags
        let clean = html.replace(/<[^>]*>/g, '');
        // Decode common HTML entities
        const entities = {
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
     * @param silent - If true, suppress error logging (useful for expected 404s)
     */
    async makeGraphQLRequest(query, variables, silent = false) {
        const maxRetries = this.config.maxRetries || 3;
        let lastError = null;
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
            }
            catch (error) {
                lastError = error;
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }
        if (!silent) {
            console.error(`AniList request failed after ${maxRetries} attempts:`, lastError);
        }
        return null;
    }
}
exports.AniListScraper = AniListScraper;
