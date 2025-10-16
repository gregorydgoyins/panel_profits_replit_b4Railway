"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarvelScraper = void 0;
const BaseEntityScraper_1 = require("./BaseEntityScraper");
const crypto_1 = __importDefault(require("crypto"));
class MarvelScraper extends BaseEntityScraper_1.BaseEntityScraper {
    constructor() {
        const config = {
            sourceName: 'marvel',
            sourceReliability: 0.95,
            rateLimit: 1000,
            maxRetries: 3,
            timeout: 10000,
        };
        super(config);
        this.baseUrl = 'https://gateway.marvel.com/v1/public';
        this.requestDelay = 1000; // 1 second between requests to respect rate limits
        this.publicKey = process.env.MARVEL_PUBLIC_KEY || '';
        this.privateKey = process.env.MARVEL_PRIVATE_KEY || '';
        if (!this.publicKey || !this.privateKey) {
            console.warn('Marvel API keys not configured. Set MARVEL_PUBLIC_KEY and MARVEL_PRIVATE_KEY environment variables.');
        }
    }
    async scrapeEntities(query) {
        if (!this.publicKey || !this.privateKey) {
            console.error('Marvel API keys not configured');
            return [];
        }
        const limit = query?.limit || 20;
        const offset = query?.offset || 0;
        try {
            const searchUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters`, {
                limit: limit.toString(),
                offset: offset.toString(),
            });
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data.data.results.map(character => this.mapToEntityData(character));
        }
        catch (error) {
            console.error('Marvel scraper error:', error);
            return [];
        }
    }
    async scrapeEntity(sourceEntityId) {
        if (!this.publicKey || !this.privateKey) {
            console.error('Marvel API keys not configured');
            return null;
        }
        try {
            // Get character by ID
            const characterUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters/${sourceEntityId}`);
            const response = await fetch(characterUrl);
            if (!response.ok) {
                throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.code !== 200 || data.data.count === 0) {
                console.log(`No Marvel data found for ID: ${sourceEntityId}`);
                return null;
            }
            const character = data.data.results[0];
            return this.mapToEntityData(character);
        }
        catch (error) {
            console.error(`Marvel scraper error for ${sourceEntityId}:`, error);
            return null;
        }
    }
    async hasEntityData(entityName, entityType) {
        if (!this.publicKey || !this.privateKey) {
            return false;
        }
        try {
            const searchUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters`, {
                nameStartsWith: entityName,
                limit: '1'
            });
            const response = await fetch(searchUrl);
            if (!response.ok) {
                return false;
            }
            const data = await response.json();
            return data.code === 200 && data.data.count > 0;
        }
        catch (error) {
            console.error(`Marvel hasEntityData error for ${entityName}:`, error);
            return false;
        }
    }
    buildAuthenticatedUrl(endpoint, params = {}) {
        const ts = Date.now().toString();
        const hash = crypto_1.default
            .createHash('md5')
            .update(ts + this.privateKey + this.publicKey)
            .digest('hex');
        const urlParams = new URLSearchParams({
            ts,
            apikey: this.publicKey,
            hash,
            ...params,
        });
        return `${endpoint}?${urlParams.toString()}`;
    }
    findBestMatch(characters, searchName) {
        if (characters.length === 0)
            return null;
        const normalizedSearch = searchName.toLowerCase().trim();
        // Try exact match first
        const exactMatch = characters.find(c => c.name.toLowerCase().trim() === normalizedSearch);
        if (exactMatch)
            return exactMatch;
        // Try prefix match
        const prefixMatch = characters.find(c => c.name.toLowerCase().trim().startsWith(normalizedSearch));
        if (prefixMatch)
            return prefixMatch;
        // Return first result if no better match
        return characters[0];
    }
    mapToEntityData(character) {
        const entityData = {
            entityId: `marvel-${character.id}`,
            entityName: character.name,
            entityType: 'character',
            publisher: 'Marvel Comics',
            firstAppearance: this.extractFirstAppearance(character),
            attributes: this.extractAttributes(character),
            relationships: [], // Marvel API doesn't provide relationship data
            appearances: this.extractAppearances(character),
            sourceEntityId: character.id.toString(),
            sourceUrl: character.urls.find(u => u.type === 'detail')?.url || character.resourceURI,
            sourceData: character,
        };
        return entityData;
    }
    extractFirstAppearance(character) {
        // Marvel API doesn't provide publication dates in the comics list
        // Cannot reliably determine first appearance without additional API calls
        // Consensus system will rely on WikiScraper and SuperHero API for first appearances
        // (both have dedicated first appearance fields)
        return undefined;
    }
    extractAttributes(character) {
        const attributes = [];
        // Marvel API only provides description, not detailed powers
        // We'll extract what we can and mark it appropriately
        if (character.description) {
            attributes.push({
                category: 'ability',
                name: 'Biography',
                description: character.description,
                isActive: true,
            });
        }
        return attributes;
    }
    extractAppearances(character) {
        const appearances = [];
        // Extract comic appearances
        for (const comic of character.comics.items.slice(0, 20)) { // Limit to avoid huge lists
            appearances.push({
                comicTitle: comic.name,
                issueNumber: this.extractIssueNumber(comic.name),
                appearanceType: 'main', // Default to main since Marvel API doesn't specify
            });
        }
        return appearances;
    }
    extractIssueNumber(comicName) {
        // Extract issue number from comic name like "Amazing Spider-Man (2018) #1"
        const match = comicName.match(/#(\d+)/);
        return match ? match[1] : undefined;
    }
    /**
     * Scrape creator contributions from Marvel comics data
     * Extracts writer/artist credits, runs, and collaborations
     */
    async scrapeCreatorContributions(query) {
        if (!this.publicKey || !this.privateKey) {
            console.error('Marvel API keys not configured');
            return [];
        }
        const limit = query?.limit || 20;
        const offset = query?.offset || 0;
        try {
            // Search for creator by name if specified
            if (query?.creatorName) {
                return await this.scrapeCreatorByName(query.creatorName, limit);
            }
            // Otherwise, get comics and extract creator data
            const comicsUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/comics`, {
                limit: limit.toString(),
                offset: offset.toString(),
                orderBy: '-onsaleDate' // Most recent first
            });
            const response = await fetch(comicsUrl);
            if (!response.ok) {
                throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            const contributions = [];
            for (const comic of data.data.results) {
                const comicContributions = this.extractCreatorsFromComic(comic);
                contributions.push(...comicContributions);
            }
            return contributions;
        }
        catch (error) {
            console.error('Marvel creator contributions scraper error:', error);
            return [];
        }
    }
    /**
     * Scrape creator by name and extract their contributions
     */
    async scrapeCreatorByName(creatorName, limit) {
        try {
            // Search for creator
            const creatorUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/creators`, {
                nameStartsWith: creatorName,
                limit: '1'
            });
            const creatorResponse = await fetch(creatorUrl);
            if (!creatorResponse.ok)
                return [];
            const creatorData = await creatorResponse.json();
            if (creatorData.data.count === 0)
                return [];
            const creator = creatorData.data.results[0];
            const creatorId = creator.id;
            // Get comics by this creator
            const comicsUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/creators/${creatorId}/comics`, {
                limit: limit.toString(),
                orderBy: '-onsaleDate'
            });
            const comicsResponse = await fetch(comicsUrl);
            if (!comicsResponse.ok)
                return [];
            const comicsData = await comicsResponse.json();
            const contributions = [];
            for (const comic of comicsData.data.results) {
                // Extract ALL creators from comics by this creator (includes collaborators)
                const comicContributions = this.extractCreatorsFromComic(comic);
                contributions.push(...comicContributions);
            }
            return contributions;
        }
        catch (error) {
            console.error(`Error scraping creator ${creatorName}:`, error);
            return [];
        }
    }
    /**
     * Extract creator contributions from a comic
     */
    extractCreatorsFromComic(comic) {
        const contributions = [];
        if (!comic.creators || !comic.creators.items)
            return contributions;
        for (const creator of comic.creators.items) {
            // Parse creator ID from resource URI
            const creatorId = creator.resourceURI.split('/').pop();
            const role = this.mapMarvelRoleToStandard(creator.role);
            if (!role)
                continue; // Skip unknown roles
            contributions.push({
                creatorEntityId: `marvel-creator-${creatorId}`,
                creatorName: creator.name,
                workType: 'single_issue',
                workEntityId: `marvel-comic-${comic.id}`,
                workEntityName: comic.title,
                workEntityType: 'comic',
                creatorRole: role,
                isPrimaryCreator: creator.role.toLowerCase().includes('writer') || creator.role.toLowerCase().includes('penciller'),
                comicTitle: comic.title,
                issueRange: this.extractIssueNumber(comic.title) || undefined,
                publicationYear: comic.dates?.find((d) => d.type === 'onsaleDate')?.date ?
                    new Date(comic.dates.find((d) => d.type === 'onsaleDate').date).getFullYear() : undefined,
                publisher: 'Marvel Comics',
                collaborators: comic.creators.items
                    .filter((c) => c.resourceURI !== creator.resourceURI)
                    .map((c) => `marvel-creator-${c.resourceURI.split('/').pop()}`),
                sourceEntityId: creatorId,
                sourceUrl: comic.urls?.find((u) => u.type === 'detail')?.url || comic.resourceURI
            });
        }
        return contributions;
    }
    /**
     * Scrape nth appearances for a character
     */
    async scrapeNthAppearances(query) {
        try {
            const { entityName, appearanceNumber, limit = 100 } = query || {};
            if (!entityName) {
                console.log('Entity name required for nth appearance scraping');
                return [];
            }
            // Search for character
            const searchUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters`, {
                nameStartsWith: entityName,
                limit: '1'
            });
            await this.rateLimit();
            const searchResponse = await fetch(searchUrl, {
                signal: AbortSignal.timeout(this.config.timeout || 10000)
            });
            if (!searchResponse.ok) {
                console.error(`Marvel API error: ${searchResponse.status}`);
                return [];
            }
            const searchData = await searchResponse.json();
            if (!searchData.data.results.length) {
                console.log(`No character found: ${entityName}`);
                return [];
            }
            const character = searchData.data.results[0];
            const characterId = character.id;
            const appearances = [];
            const pageSize = 100; // Marvel API max
            let currentOffset = 0;
            let totalToFetch = limit;
            // If specific appearance requested, calculate starting offset
            if (appearanceNumber) {
                currentOffset = appearanceNumber - 1; // Start at the target (0-indexed)
                totalToFetch = pageSize; // Fetch a full page to ensure we get the target
                console.log(`Seeking appearance #${appearanceNumber} starting at offset ${currentOffset}`);
            }
            // Paginate through comics until we have enough
            let fetchedCount = 0;
            while (fetchedCount < totalToFetch) {
                const fetchLimit = Math.min(pageSize, totalToFetch - fetchedCount);
                const comicsUrl = this.buildAuthenticatedUrl(`${this.baseUrl}/characters/${characterId}/comics`, {
                    orderBy: 'onsaleDate', // Chronological order
                    limit: fetchLimit.toString(),
                    offset: currentOffset.toString()
                });
                await this.rateLimit();
                const comicsResponse = await fetch(comicsUrl, {
                    signal: AbortSignal.timeout(this.config.timeout || 10000)
                });
                if (!comicsResponse.ok) {
                    console.error(`Marvel comics API error: ${comicsResponse.status}`);
                    break;
                }
                const comicsData = await comicsResponse.json();
                // No more results
                if (comicsData.data.results.length === 0) {
                    break;
                }
                for (let i = 0; i < comicsData.data.results.length; i++) {
                    const comic = comicsData.data.results[i];
                    const appearanceCount = currentOffset + i + 1; // 1-indexed appearance number
                    // If filtering by specific appearance number, only include that one
                    if (appearanceNumber && appearanceCount !== appearanceNumber) {
                        continue;
                    }
                    const onsaleDate = comic.dates?.find((d) => d.type === 'onsaleDate');
                    const year = onsaleDate?.date ? new Date(onsaleDate.date).getFullYear() : undefined;
                    const month = onsaleDate?.date ? new Date(onsaleDate.date).toLocaleString('en-US', { month: 'long' }) : undefined;
                    appearances.push({
                        entityId: `marvel-character-${characterId}`,
                        entityName: character.name,
                        entityType: 'character',
                        appearanceNumber: appearanceCount,
                        appearanceOrdinal: this.getOrdinal(appearanceCount),
                        comicId: `marvel-comic-${comic.id}`,
                        comicTitle: comic.title,
                        issueNumber: this.extractIssueNumber(comic.title) || undefined,
                        publicationYear: year,
                        publicationMonth: month,
                        publisher: 'Marvel Comics',
                        coverImageUrl: comic.thumbnail?.path && comic.thumbnail?.extension ?
                            `${comic.thumbnail.path}.${comic.thumbnail.extension}` : undefined,
                        isKeyAppearance: appearanceCount === 1, // First appearance is always key
                        sourceEntityId: characterId.toString(),
                        sourceUrl: comic.urls?.find((u) => u.type === 'detail')?.url || comic.resourceURI
                    });
                    // If we found the specific appearance, we're done
                    if (appearanceNumber && appearanceCount === appearanceNumber) {
                        return appearances;
                    }
                }
                // Move to next page
                currentOffset += comicsData.data.results.length;
                fetchedCount += comicsData.data.results.length;
                // Check if we've reached the API's total
                if (currentOffset >= comicsData.data.total) {
                    break;
                }
            }
            return appearances;
        }
        catch (error) {
            console.error(`Error scraping nth appearances:`, error);
            return [];
        }
    }
    /**
     * Convert number to ordinal string (1 -> "1st", 2 -> "2nd", etc.)
     */
    getOrdinal(n) {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
    /**
     * Map Marvel API role names to our standard role types
     */
    mapMarvelRoleToStandard(marvelRole) {
        const roleLower = marvelRole.toLowerCase();
        if (roleLower.includes('writer'))
            return 'writer';
        if (roleLower.includes('penciller') || roleLower.includes('penciler'))
            return 'penciller';
        if (roleLower.includes('inker'))
            return 'inker';
        if (roleLower.includes('colorist'))
            return 'colorist';
        if (roleLower.includes('letterer'))
            return 'letterer';
        if (roleLower.includes('editor'))
            return 'editor';
        return null; // Unknown role
    }
}
exports.MarvelScraper = MarvelScraper;
