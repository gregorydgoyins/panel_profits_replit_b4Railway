"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostomaniaScraper = void 0;
const BaseEntityScraper_1 = require("./BaseEntityScraper");
const cheerio = __importStar(require("cheerio"));
/**
 * Nostomania Web Scraper
 *
 * Scrapes vintage comic book pricing data from Nostomania.com
 * Direct HTML scraping - no official API.
 *
 * Data Coverage:
 * - Pricing: Vintage comic valuations by condition
 * - Historical data: Golden Age, Silver Age, Bronze Age comics
 * - Creator information: Writers, artists for relationship mapping
 * - Issue details: Publication years, series data
 * - Cover images: Vintage comic scans
 *
 * Reliability: 0.88 (vintage pricing specialist, reliable for Golden/Silver age)
 */
class NostomaniaScraper extends BaseEntityScraper_1.BaseEntityScraper {
    constructor() {
        super({
            sourceName: 'nostomania',
            sourceReliability: 0.88,
            rateLimit: 2000 // 2 seconds between requests
        });
        this.baseUrl = 'https://www.nostomania.com';
        this.searchUrl = 'https://www.nostomania.com/search';
    }
    /**
     * Search for vintage comics and scrape pricing data
     */
    async scrapeEntities(query) {
        try {
            const searchTerm = query?.searchTerm || '';
            const limit = query?.limit || 20;
            console.log(`🔍 Searching Nostomania for: "${searchTerm}"`);
            await this.rateLimit();
            // Build search URL
            const searchParams = new URLSearchParams();
            if (searchTerm)
                searchParams.append('search', searchTerm);
            if (query?.publisher)
                searchParams.append('publisher', query.publisher);
            if (query?.era)
                searchParams.append('era', query.era);
            const url = `${this.searchUrl}?${searchParams}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfitsBot/1.0 (Nostomania Scraper)'
                }
            });
            if (!response.ok) {
                console.error(`❌ Nostomania search failed: ${response.status}`);
                return [];
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            const entities = [];
            // Parse search results - adapt selectors based on actual site structure
            $('.comic-item, .search-result, .result-item, .product').slice(0, limit).each((_, element) => {
                const $el = $(element);
                const title = $el.find('.comic-title, h3, .title, h4').first().text().trim();
                const link = $el.find('a').first().attr('href');
                const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
                const priceText = $el.find('.price, .value, .cost').first().text().trim();
                const publisher = $el.find('.publisher, .pub').first().text().trim();
                const yearText = $el.find('.year, .date').first().text().trim();
                const issueNum = $el.find('.issue, .number').first().text().trim();
                if (title && (coverUrl || link)) {
                    const entity = {
                        entityId: this.generateEntityId(title, publisher, issueNum),
                        entityName: title,
                        entityType: 'concept', // Comic as tradeable concept
                        publisher: publisher || 'Unknown',
                        sourceUrl: link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : url,
                        firstAppearance: {
                            comicTitle: `${title} ${issueNum}`.trim(),
                            issue: issueNum,
                            year: this.parseYear(yearText),
                            coverUrl: coverUrl ? (coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`) : undefined
                        },
                        sourceEntityId: this.generateEntityId(title, publisher, issueNum),
                        sourceData: {
                            price: this.parsePrice(priceText),
                            priceDisplay: priceText,
                            publisher: publisher,
                            year: this.parseYear(yearText),
                            era: this.determineEra(yearText),
                            issueNumber: issueNum,
                            scrapedFrom: 'nostomania',
                            dataSource: 'vintage_pricing'
                        }
                    };
                    entities.push(entity);
                }
            });
            console.log(`✅ Found ${entities.length} comics on Nostomania`);
            return entities;
        }
        catch (error) {
            console.error('❌ Nostomania scrape error:', error);
            return [];
        }
    }
    /**
     * Fetch detailed entity data including full pricing breakdown
     */
    async scrapeEntity(entityIdentifier) {
        try {
            console.log(`📖 Fetching Nostomania details for: ${entityIdentifier}`);
            await this.rateLimit();
            // If entityIdentifier is a URL, use it directly; otherwise search
            const url = entityIdentifier.startsWith('http')
                ? entityIdentifier
                : `${this.searchUrl}?search=${encodeURIComponent(entityIdentifier)}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfitsBot/1.0 (Nostomania Scraper)'
                }
            });
            if (!response.ok) {
                console.error(`❌ Nostomania detail failed: ${response.status}`);
                return null;
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            const title = $('.comic-title, h1, .title').first().text().trim();
            const coverUrl = $('.comic-cover img, .main-image img, .cover img').first().attr('src');
            const description = $('.description, .synopsis, .summary').first().text().trim();
            const publisher = $('.publisher, .pub-name').first().text().trim();
            const yearText = $('.year, .publish-date, .date').first().text().trim();
            const issueNum = $('.issue, .number').first().text().trim();
            // Extract pricing data
            const pricing = this.scrapePricingData($);
            // Extract creators
            const creators = [];
            $('.creators .creator, .artist, .writer').each((_, el) => {
                const name = $(el).text().trim();
                if (name)
                    creators.push(name);
            });
            // Build relationships for creators
            const relationships = creators.map(creatorName => ({
                targetEntityId: this.generateEntityId(creatorName),
                targetEntityName: creatorName,
                targetEntityType: 'creator',
                relationshipType: 'creator',
                isActive: true
            }));
            const entity = {
                entityId: this.generateEntityId(title, publisher, issueNum),
                entityName: title,
                entityType: 'concept',
                publisher: publisher || 'Unknown',
                sourceUrl: url,
                firstAppearance: {
                    comicTitle: `${title} ${issueNum}`.trim(),
                    issue: issueNum,
                    year: this.parseYear(yearText),
                    coverUrl: coverUrl ? (coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`) : undefined
                },
                relationships: relationships.length > 0 ? relationships : undefined,
                sourceEntityId: this.generateEntityId(title, publisher, issueNum),
                sourceData: {
                    description,
                    publisher,
                    year: this.parseYear(yearText),
                    era: this.determineEra(yearText),
                    creators,
                    pricing,
                    issueNumber: issueNum,
                    scrapedFrom: 'nostomania',
                    dataSource: 'vintage_pricing'
                }
            };
            return entity;
        }
        catch (error) {
            console.error('❌ Nostomania detail error:', error);
            return null;
        }
    }
    /**
     * Scrape vintage comics by era
     */
    async scrapeVintageComics(era) {
        const eraYears = {
            golden: '1938-1956',
            silver: '1956-1970',
            bronze: '1970-1985'
        };
        const searchTerm = era ? eraYears[era] : 'vintage comics';
        return this.scrapeEntities({ searchTerm, era });
    }
    /**
     * Scrape high-value vintage comics
     */
    async scrapeHighValueComics() {
        return this.scrapeEntities({ searchTerm: 'high value' });
    }
    /**
     * Check if Nostomania has data for an entity
     */
    async hasEntityData(entityName, entityType) {
        try {
            const results = await this.scrapeEntities({
                searchTerm: entityName,
                limit: 1
            });
            return results.length > 0;
        }
        catch (error) {
            return false;
        }
    }
    // Helper methods
    scrapePricingData($) {
        const pricing = {};
        // Parse condition-based pricing
        $('.price-table tr, .pricing-row, .grade-price').each((_, row) => {
            const $row = $(row);
            const condition = $row.find('.condition, .grade, td:first-child').text().trim();
            const priceText = $row.find('.price, .value, td:last-child').text().trim();
            const price = this.parsePrice(priceText);
            if (condition && price > 0) {
                pricing[condition.toLowerCase()] = price;
            }
        });
        // Fallback: single price
        if (Object.keys(pricing).length === 0) {
            const singlePrice = $('.current-price, .value, .price').first().text().trim();
            const price = this.parsePrice(singlePrice);
            if (price > 0) {
                pricing.current = price;
            }
        }
        return pricing;
    }
    parsePrice(text) {
        const cleaned = text.replace(/[^0-9.,]/g, '');
        const match = cleaned.match(/[\d,]+(?:\.\d{2})?/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }
    parseYear(text) {
        const match = text.match(/\d{4}/);
        return match ? parseInt(match[0]) : undefined;
    }
    determineEra(yearText) {
        const year = this.parseYear(yearText);
        if (!year)
            return 'unknown';
        if (year <= 1956)
            return 'golden';
        if (year <= 1970)
            return 'silver';
        if (year <= 1985)
            return 'bronze';
        return 'modern';
    }
    generateEntityId(...parts) {
        return parts
            .filter(Boolean)
            .join('-')
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
exports.NostomaniaScraper = NostomaniaScraper;
