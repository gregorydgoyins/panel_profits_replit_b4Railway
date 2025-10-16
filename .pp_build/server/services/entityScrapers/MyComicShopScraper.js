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
exports.MyComicShopScraper = void 0;
const BaseEntityScraper_1 = require("./BaseEntityScraper");
const cheerio = __importStar(require("cheerio"));
/**
 * MyComicShop Web Scraper
 *
 * Scrapes comic book pricing and availability data from MyComicShop.com (major retailer).
 * Direct HTML scraping - no official API.
 *
 * Data Coverage:
 * - Pricing: Retail prices across conditions (NM, VF, FN, VG, GD)
 * - Availability: In-stock status, quantity
 * - Grading: Professional grading information
 * - Cover images: High-quality scans
 * - Publisher/series: Comprehensive metadata
 *
 * Reliability: 0.90 (major retailer, accurate pricing)
 */
class MyComicShopScraper extends BaseEntityScraper_1.BaseEntityScraper {
    constructor() {
        super({
            sourceName: 'mycomicshop',
            sourceReliability: 0.90,
            rateLimit: 2000 // 2 seconds between requests
        });
        this.baseUrl = 'https://www.mycomicshop.com';
        this.searchUrl = 'https://www.mycomicshop.com/search';
    }
    /**
     * Search for comics and scrape pricing/availability data
     */
    async scrapeEntities(query) {
        try {
            const searchTerm = query?.searchTerm || '';
            const limit = query?.limit || 20;
            console.log(`🔍 Searching MyComicShop for: "${searchTerm}"`);
            await this.rateLimit();
            // Build search URL
            const searchParams = new URLSearchParams();
            if (searchTerm)
                searchParams.append('q', searchTerm);
            if (query?.publisher)
                searchParams.append('pub', query.publisher);
            if (query?.grade)
                searchParams.append('grade', query.grade); // NM, VF, FN, VG, GD
            const url = `${this.searchUrl}?${searchParams}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfitsBot/1.0 (MyComicShop Scraper)',
                }
            });
            if (!response.ok) {
                console.error(`❌ MyComicShop search failed: ${response.status}`);
                return [];
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            const entities = [];
            // Parse search results (adjust selectors based on actual site structure)
            $('.product, .comic-item, .result-item, .search-result').slice(0, limit).each((_, element) => {
                const $el = $(element);
                const title = $el.find('.title, .comic-title, h3, h4').first().text().trim();
                const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
                const detailLink = $el.find('a').first().attr('href');
                const publisher = $el.find('.publisher, .pub').first().text().trim();
                const price = $el.find('.price, .cost').first().text().trim();
                const condition = $el.find('.condition, .grade').first().text().trim();
                const availability = $el.find('.availability, .stock, .in-stock').first().text().trim();
                const issueNum = $el.find('.issue, .number').first().text().trim();
                if (title && coverUrl) {
                    const entity = {
                        entityId: this.generateEntityId(title, publisher, issueNum),
                        entityName: title,
                        entityType: 'concept', // Comic as tradeable concept
                        publisher: publisher || 'Unknown',
                        sourceUrl: detailLink ? (detailLink.startsWith('http') ? detailLink : `${this.baseUrl}${detailLink}`) : url,
                        firstAppearance: {
                            comicTitle: `${title} ${issueNum}`.trim(),
                            issue: issueNum,
                            coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
                        },
                        sourceEntityId: this.generateEntityId(title, publisher, issueNum),
                        sourceData: {
                            price: this.parsePrice(price),
                            priceDisplay: price,
                            condition: condition,
                            availability: availability,
                            inStock: availability.toLowerCase().includes('in stock') || availability.toLowerCase().includes('available'),
                            scrapedFrom: 'mycomicshop',
                            retailer: 'MyComicShop'
                        }
                    };
                    entities.push(entity);
                }
            });
            console.log(`✅ Found ${entities.length} comics from MyComicShop`);
            return entities;
        }
        catch (error) {
            console.error(`❌ MyComicShop scraping error:`, error);
            return [];
        }
    }
    /**
     * Scrape detailed pricing and availability data
     */
    async scrapeEntity(entityIdentifier) {
        try {
            await this.rateLimit();
            // If entityIdentifier is a URL, use it directly
            const url = entityIdentifier.startsWith('http')
                ? entityIdentifier
                : `${this.baseUrl}/search?q=${entityIdentifier}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfitsBot/1.0 (MyComicShop Scraper)',
                }
            });
            if (!response.ok) {
                return null;
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            // Extract detailed comic information
            const title = $('.product-title, .comic-title, h1').first().text().trim();
            const coverUrl = $('.product-image img, .cover-image img, #main-image').first().attr('src') ||
                $('.product-image img, .cover-image img, #main-image').first().attr('data-src');
            const publisher = $('.publisher, .pub-name').first().text().trim();
            const description = $('.description, .synopsis').first().text().trim();
            const issueNum = $('.issue-number, .issue').first().text().trim();
            // Extract pricing by condition
            const prices = {};
            $('.price-row, .condition-price').each((_, el) => {
                const condition = $(el).find('.condition').text().trim();
                const price = $(el).find('.price').text().trim();
                if (condition && price) {
                    prices[condition] = this.parsePrice(price);
                }
            });
            // Extract availability
            const availability = $('.availability, .stock-status').first().text().trim();
            const inStock = availability.toLowerCase().includes('in stock') ||
                availability.toLowerCase().includes('available');
            // Extract creators
            const creators = [];
            $('.creator, .writer, .artist, .author').each((_, el) => {
                creators.push($(el).text().trim());
            });
            if (!title || !coverUrl) {
                return null;
            }
            const entity = {
                entityId: this.generateEntityId(title, publisher, issueNum),
                entityName: title,
                entityType: 'concept',
                publisher: publisher || 'Unknown',
                sourceUrl: url,
                firstAppearance: {
                    comicTitle: `${title} ${issueNum}`.trim(),
                    issue: issueNum,
                    coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
                },
                attributes: description ? [{
                        category: 'origin',
                        name: 'description',
                        description: description,
                        level: 'primary',
                        isActive: true
                    }] : undefined,
                relationships: creators.map(creator => ({
                    targetEntityId: `creator-${creator.toLowerCase().replace(/\s+/g, '-')}`,
                    targetEntityName: creator,
                    targetEntityType: 'creator',
                    relationshipType: 'creator',
                    strength: 1.0,
                    isActive: true
                })),
                sourceEntityId: this.generateEntityId(title, publisher, issueNum),
                sourceData: {
                    prices: prices,
                    pricesByCondition: prices,
                    availability: availability,
                    inStock: inStock,
                    description: description,
                    scrapedFrom: 'mycomicshop',
                    retailer: 'MyComicShop',
                    detailPage: url
                }
            };
            return entity;
        }
        catch (error) {
            console.error(`Error scraping MyComicShop entity:`, error);
            return null;
        }
    }
    /**
     * Check if MyComicShop has data for an entity
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
    /**
     * Generate unique entity ID
     */
    generateEntityId(title, publisher, issue) {
        const normalized = `${publisher}-${title}-${issue}`
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50);
        return `mcs-${normalized}`;
    }
    /**
     * Parse price string to number
     */
    parsePrice(priceStr) {
        const match = priceStr.match(/[\d,.]+/);
        if (!match)
            return 0;
        return parseFloat(match[0].replace(/,/g, ''));
    }
    /**
     * Scrape hot comics / best sellers
     */
    async scrapeHotComics(limit = 30) {
        try {
            await this.rateLimit();
            const url = `${this.baseUrl}/hot-comics`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfitsBot/1.0 (MyComicShop Scraper)',
                }
            });
            if (!response.ok) {
                return [];
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            const entities = [];
            $('.product, .comic-item, .hot-item').slice(0, limit).each((_, element) => {
                const $el = $(element);
                const title = $el.find('.title, .comic-title').first().text().trim();
                const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
                const publisher = $el.find('.publisher').first().text().trim();
                const price = $el.find('.price').first().text().trim();
                const issueNum = $el.find('.issue').first().text().trim();
                if (title && coverUrl) {
                    entities.push({
                        entityId: this.generateEntityId(title, publisher, issueNum),
                        entityName: title,
                        entityType: 'concept',
                        publisher: publisher || 'Unknown',
                        sourceUrl: url,
                        firstAppearance: {
                            comicTitle: `${title} ${issueNum}`.trim(),
                            issue: issueNum,
                            coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
                        },
                        sourceEntityId: this.generateEntityId(title, publisher, issueNum),
                        sourceData: {
                            price: this.parsePrice(price),
                            priceDisplay: price,
                            scrapedFrom: 'mycomicshop',
                            isHot: true,
                            retailer: 'MyComicShop'
                        }
                    });
                }
            });
            console.log(`✅ Found ${entities.length} hot comics from MyComicShop`);
            return entities;
        }
        catch (error) {
            console.error(`Error scraping hot comics:`, error);
            return [];
        }
    }
    /**
     * Scrape new releases
     */
    async scrapeNewReleases(limit = 50) {
        try {
            await this.rateLimit();
            const url = `${this.baseUrl}/new-releases`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfitsBot/1.0 (MyComicShop Scraper)',
                }
            });
            if (!response.ok) {
                return [];
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            const entities = [];
            $('.product, .comic-item, .new-release').slice(0, limit).each((_, element) => {
                const $el = $(element);
                const title = $el.find('.title, .comic-title').first().text().trim();
                const coverUrl = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
                const publisher = $el.find('.publisher').first().text().trim();
                const price = $el.find('.price').first().text().trim();
                const releaseDate = $el.find('.date, .release-date').first().text().trim();
                const issueNum = $el.find('.issue').first().text().trim();
                if (title && coverUrl) {
                    entities.push({
                        entityId: this.generateEntityId(title, publisher, issueNum),
                        entityName: title,
                        entityType: 'concept',
                        publisher: publisher || 'Unknown',
                        sourceUrl: url,
                        firstAppearance: {
                            comicTitle: `${title} ${issueNum}`.trim(),
                            issue: issueNum,
                            coverUrl: coverUrl.startsWith('http') ? coverUrl : `${this.baseUrl}${coverUrl}`
                        },
                        sourceEntityId: this.generateEntityId(title, publisher, issueNum),
                        sourceData: {
                            price: this.parsePrice(price),
                            priceDisplay: price,
                            releaseDate: releaseDate,
                            scrapedFrom: 'mycomicshop',
                            isNewRelease: true,
                            retailer: 'MyComicShop'
                        }
                    });
                }
            });
            console.log(`✅ Found ${entities.length} new releases from MyComicShop`);
            return entities;
        }
        catch (error) {
            console.error(`Error scraping new releases:`, error);
            return [];
        }
    }
    /**
     * Scrape price data for a specific comic across conditions
     */
    async scrapePricing(comicTitle) {
        try {
            const entity = await this.scrapeEntity(comicTitle);
            if (entity?.sourceData?.pricesByCondition) {
                return entity.sourceData.pricesByCondition;
            }
            return {};
        }
        catch (error) {
            console.error(`Error scraping pricing:`, error);
            return {};
        }
    }
}
exports.MyComicShopScraper = MyComicShopScraper;
