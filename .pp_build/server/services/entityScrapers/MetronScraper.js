"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetronScraper = void 0;
const BaseEntityScraper_1 = require("./BaseEntityScraper");
/**
 * Metron Comic Book Database Scraper
 * Free REST API for multi-publisher comic data
 * https://metron.cloud/
 */
class MetronScraper extends BaseEntityScraper_1.BaseEntityScraper {
    constructor() {
        super({
            sourceName: 'metron',
            sourceReliability: 0.80, // 80% reliability (community-maintained)
            rateLimit: 500, // 500ms between requests to be respectful
            maxRetries: 3,
            timeout: 10000,
        });
        this.baseUrl = 'https://metron.cloud/api';
    }
    /**
     * Scrape characters from Metron
     */
    async scrapeEntities(query) {
        const entities = [];
        try {
            await this.rateLimit();
            // Metron API endpoint for characters
            const url = new URL(`${this.baseUrl}/character/`);
            if (query?.limit)
                url.searchParams.set('per_page', String(query.limit));
            if (query?.offset)
                url.searchParams.set('page', String(Math.floor(query.offset / (query.limit || 20)) + 1));
            const response = await this.retryRequest(async () => {
                const res = await fetch(url.toString(), {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'PanelProfits-EntityScraper/1.0',
                    },
                    signal: AbortSignal.timeout(this.config.timeout || 10000),
                });
                if (!res.ok) {
                    throw new Error(`Metron API error: ${res.status} ${res.statusText}`);
                }
                return res.json();
            });
            const characters = response.results || [];
            for (const char of characters) {
                const entityData = await this.scrapeEntity(String(char.id));
                if (entityData) {
                    entities.push(entityData);
                }
            }
            return entities;
        }
        catch (error) {
            console.error('Metron scrape failed:', error);
            return entities;
        }
    }
    /**
     * Scrape a single character from Metron
     */
    async scrapeEntity(sourceEntityId) {
        try {
            await this.rateLimit();
            const charResponse = await this.retryRequest(async () => {
                const res = await fetch(`${this.baseUrl}/character/${sourceEntityId}/`, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'PanelProfits-EntityScraper/1.0',
                    },
                    signal: AbortSignal.timeout(this.config.timeout || 10000),
                });
                if (!res.ok) {
                    throw new Error(`Metron character ${sourceEntityId} not found: ${res.status}`);
                }
                return res.json();
            });
            const char = charResponse;
            // Get first appearance if available
            const firstAppearance = await this.getFirstAppearance(char.id);
            // Build relationships from teams and creators
            const relationships = this.buildRelationships(char);
            // Build attributes from description
            const attributes = this.extractAttributes(char);
            const entityData = {
                entityId: `metron-char-${char.id}`,
                entityName: char.name,
                entityType: 'character',
                publisher: 'Unknown', // Metron is multi-publisher, set default
                sourceEntityId: String(char.id),
                sourceUrl: `https://metron.cloud/character/${char.id}/`,
                firstAppearance,
                attributes,
                relationships,
                sourceData: {
                    sourceName: this.config.sourceName, // Include source name for tracking
                    sourceReliability: this.config.sourceReliability,
                    aliases: char.alias,
                    description: char.desc,
                    image: char.image,
                    modified: char.modified,
                },
            };
            return entityData;
        }
        catch (error) {
            console.error(`Failed to scrape Metron entity ${sourceEntityId}:`, error);
            return null;
        }
    }
    /**
     * Get first appearance comic for a character
     */
    async getFirstAppearance(characterId) {
        try {
            await this.rateLimit();
            // Search for issues featuring this character
            const issuesResponse = await fetch(`${this.baseUrl}/issue/?characters=${characterId}&per_page=100&ordering=cover_date`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'PanelProfits-EntityScraper/1.0',
                },
            });
            if (!issuesResponse.ok)
                return undefined;
            const issuesData = await issuesResponse.json();
            const issues = (issuesData.results || []);
            if (issues.length === 0)
                return undefined;
            // First issue in chronological order is likely first appearance
            const firstIssue = issues[0];
            const coverDate = new Date(firstIssue.cover_date);
            return {
                comicTitle: `${firstIssue.series.name} #${firstIssue.number}`,
                issue: firstIssue.number,
                year: coverDate.getFullYear(),
                month: coverDate.toLocaleString('en-US', { month: 'long' }),
                coverUrl: firstIssue.image,
            };
        }
        catch (error) {
            console.error('Failed to get first appearance from Metron:', error);
            return undefined;
        }
    }
    /**
     * Build relationships from character teams and creators
     */
    buildRelationships(char) {
        const relationships = [];
        // Team relationships
        if (char.teams) {
            for (const team of char.teams) {
                relationships.push({
                    targetEntityId: `metron-team-${team.id}`,
                    targetEntityName: team.name,
                    targetEntityType: 'team',
                    relationshipType: 'teammate',
                    strength: 0.80,
                    isActive: true,
                });
            }
        }
        // Creator relationships
        if (char.creators) {
            for (const creator of char.creators) {
                relationships.push({
                    targetEntityId: `metron-creator-${creator.id}`,
                    targetEntityName: creator.name,
                    targetEntityType: 'creator',
                    relationshipType: 'creator',
                    strength: 1.00,
                    isActive: true,
                });
            }
        }
        return relationships;
    }
    /**
     * Extract attributes from description text
     */
    extractAttributes(char) {
        const attributes = [];
        if (!char.desc)
            return attributes;
        const desc = char.desc.toLowerCase();
        // Simple keyword-based attribute extraction
        const powerKeywords = ['super', 'power', 'strength', 'speed', 'flight', 'invulnerable', 'telepathy', 'telekinesis'];
        const weaknessKeywords = ['weakness', 'vulnerable', 'kryptonite', 'mortal', 'fear'];
        for (const keyword of powerKeywords) {
            if (desc.includes(keyword)) {
                attributes.push({
                    category: 'power',
                    name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
                    description: `Extracted from: ${char.desc.substring(0, 100)}...`,
                    level: 'secondary',
                    isActive: true,
                });
            }
        }
        for (const keyword of weaknessKeywords) {
            if (desc.includes(keyword)) {
                attributes.push({
                    category: 'weakness',
                    name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
                    description: `Extracted from: ${char.desc.substring(0, 100)}...`,
                    level: 'primary',
                    isActive: true,
                });
            }
        }
        return attributes;
    }
    /**
     * Check if Metron has data for an entity
     */
    async hasEntityData(entityName, entityType) {
        if (entityType !== 'character')
            return false;
        try {
            await this.rateLimit();
            const normalized = this.normalizeEntityName(entityName);
            const response = await fetch(`${this.baseUrl}/character/?name=${encodeURIComponent(normalized)}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'PanelProfits-EntityScraper/1.0',
                },
            });
            if (!response.ok)
                return false;
            const data = await response.json();
            return (data.results?.length || 0) > 0;
        }
        catch (error) {
            console.error('Metron availability check failed:', error);
            return false;
        }
    }
}
exports.MetronScraper = MetronScraper;
