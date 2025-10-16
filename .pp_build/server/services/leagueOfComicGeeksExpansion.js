"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueOfComicGeeksExpansionService = void 0;
const assetInsertionService_1 = require("./assetInsertionService");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
class LeagueOfComicGeeksExpansionService {
    constructor(sessionCookie) {
        this.assetService = new assetInsertionService_1.AssetInsertionService();
        this.baseUrl = 'https://leagueofcomicgeeks.com';
        this.sessionCookie = sessionCookie;
    }
    async fetchComicsFromHTML() {
        const comics = [];
        // Scrape different sections
        const sections = [
            '/comics/new',
            '/comics/upcoming',
            '/comics/this-week',
            '/comics/last-week'
        ];
        for (const section of sections) {
            try {
                const url = `${this.baseUrl}${section}`;
                const response = await fetch(url, {
                    headers: {
                        'Cookie': `ci_session=${this.sessionCookie}`,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html'
                    }
                });
                if (!response.ok)
                    continue;
                const html = await response.text();
                // Extract comic data from HTML
                const comicRegex = /data-comic-id="(\d+)"[^>]*>.*?<div class="title">([^<]+)/g;
                const matches = Array.from(html.matchAll(comicRegex));
                for (const match of matches) {
                    const [_, id, title] = match;
                    comics.push({
                        id: parseInt(id),
                        title: title.trim()
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            catch (error) {
                console.error(`Failed to scrape ${section}:`, error);
            }
        }
        return comics;
    }
    async expandAssets() {
        let stats = { inserted: 0, skipped: 0, errors: 0 };
        try {
            console.log('📚 Scraping League of Comic Geeks...');
            const comics = await this.fetchComicsFromHTML();
            console.log(`📦 Found ${comics.length} comics from HTML scraping`);
            if (comics.length === 0) {
                return stats;
            }
            const assets = comics.map(comic => {
                const symbol = this.generateSymbol(comic.title, comic.issue_number);
                const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                    assetType: 'comic',
                    name: `${comic.title} ${comic.issue_number || ''}`.trim(),
                    era: this.determineEra(comic.release_date),
                    franchiseTier: 3
                });
                return {
                    type: 'comic',
                    name: `${comic.title} ${comic.issue_number || ''}`.trim(),
                    symbol,
                    category: 'comic',
                    metadata: {
                        source: 'league_of_comic_geeks',
                        leagueId: comic.id,
                        publisher: comic.publisher,
                        series: comic.series,
                        releaseDate: comic.release_date,
                        creators: comic.creators,
                        era: this.determineEra(comic.release_date),
                        tier: 3
                    },
                    pricing: {
                        currentPrice: pricing.sharePrice,
                        totalMarketValue: pricing.totalMarketValue,
                        totalFloat: pricing.totalFloat,
                        source: 'league_of_comic_geeks',
                        lastUpdated: new Date().toISOString(),
                        breakdown: pricing.breakdown
                    }
                };
            });
            const result = await this.assetService.insertPricedAssets(assets);
            stats.inserted += result.inserted;
            stats.skipped += result.skipped;
            stats.errors += result.errors;
            console.log(`✅ League expansion: ${result.inserted} inserted, ${result.skipped} skipped`);
        }
        catch (error) {
            console.error('League expansion failed:', error);
            stats.errors++;
        }
        return stats;
    }
    generateSymbol(title, issue) {
        const normalized = `${title}${issue || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');
        const hash = this.simpleHash(normalized);
        return `LG.${hash.substring(0, 11).toUpperCase()}`;
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    determineEra(releaseDate) {
        if (!releaseDate)
            return 'modern';
        const year = new Date(releaseDate).getFullYear();
        if (year <= 1955)
            return 'golden';
        if (year <= 1970)
            return 'silver';
        if (year <= 1985)
            return 'bronze';
        return 'modern';
    }
}
exports.LeagueOfComicGeeksExpansionService = LeagueOfComicGeeksExpansionService;
