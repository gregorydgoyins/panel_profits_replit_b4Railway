"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntityScraper = void 0;
/**
 * Base class for all entity scrapers
 * Provides common functionality for rate limiting, error handling, and data normalization
 */
class BaseEntityScraper {
    constructor(config) {
        this.lastRequestTime = 0;
        this.config = config;
    }
    /**
     * Rate limiting - ensures we don't exceed source limits
     */
    async rateLimit() {
        if (!this.config.rateLimit)
            return;
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.config.rateLimit) {
            const waitTime = this.config.rateLimit - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastRequestTime = Date.now();
    }
    /**
     * Retry logic for failed requests
     */
    async retryRequest(fn, retries = this.config.maxRetries || 3) {
        try {
            return await fn();
        }
        catch (error) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second backoff
                return this.retryRequest(fn, retries - 1);
            }
            throw error;
        }
    }
    /**
     * Normalize entity name across sources (remove variations, handle aliases)
     */
    normalizeEntityName(name) {
        return name
            .trim()
            .replace(/\s+/g, ' ') // normalize whitespace
            .replace(/[^\w\s-]/g, '') // remove special chars
            .toLowerCase();
    }
    /**
     * Convert scraped data to database format
     */
    toDataSource(entityData) {
        return {
            entityId: entityData.entityId,
            entityName: entityData.entityName,
            entityType: entityData.entityType,
            sourceName: this.config.sourceName,
            sourceEntityId: entityData.sourceEntityId,
            sourceUrl: entityData.sourceUrl || null,
            hasFirstAppearance: !!entityData.firstAppearance,
            hasAttributes: !!entityData.attributes && entityData.attributes.length > 0,
            hasRelationships: !!entityData.relationships && entityData.relationships.length > 0,
            hasAppearances: !!entityData.appearances && entityData.appearances.length > 0,
            hasImages: !!entityData.firstAppearance?.coverUrl,
            hasBiography: !!entityData.sourceData?.biography,
            dataCompleteness: this.calculateCompleteness(entityData),
            dataFreshness: new Date(),
            sourceReliability: String(this.config.sourceReliability),
            sourceData: entityData.sourceData,
            lastSyncedAt: new Date(),
            nextSyncScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            syncStatus: 'synced',
            syncErrorMessage: null,
        };
    }
    /**
     * Calculate data completeness score (0.00 to 1.00)
     */
    calculateCompleteness(entityData) {
        let score = 0;
        let maxScore = 6;
        if (entityData.firstAppearance)
            score += 1;
        if (entityData.attributes && entityData.attributes.length > 0)
            score += 1;
        if (entityData.relationships && entityData.relationships.length > 0)
            score += 1;
        if (entityData.appearances && entityData.appearances.length > 0)
            score += 1;
        if (entityData.firstAppearance?.coverUrl)
            score += 1;
        if (entityData.sourceData?.biography)
            score += 1;
        return (score / maxScore).toFixed(2);
    }
    /**
     * Get source configuration
     */
    getConfig() {
        return this.config;
    }
}
exports.BaseEntityScraper = BaseEntityScraper;
