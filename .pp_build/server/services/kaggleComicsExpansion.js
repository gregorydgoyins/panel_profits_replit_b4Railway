"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KaggleComicsExpansionService = void 0;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const assetInsertionService_1 = require("./assetInsertionService");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
class KaggleComicsExpansionService {
    constructor() {
        this.assetService = new assetInsertionService_1.AssetInsertionService();
    }
    async processMarvelComics(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`📚 Processing ${records.length} Marvel comics from Kaggle...`);
        const assets = records.map(row => {
            const name = row.issue_title || row.comic_name;
            const symbol = this.generateSymbol('M', name);
            const era = this.determineEra(row.publish_date);
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'comic',
                name,
                era,
                franchiseTier: 3
            });
            return {
                type: 'comic',
                name,
                symbol,
                category: 'comic',
                metadata: {
                    source: 'kaggle_marvel_comics',
                    publisher: 'Marvel',
                    activeYears: row.active_years,
                    publishDate: row.publish_date,
                    description: row.issue_description,
                    penciler: row.penciler,
                    writer: row.writer,
                    coverArtist: row.cover_artist,
                    imprint: row.Imprint,
                    format: row.Format,
                    rating: row.Rating,
                    price: row.Price,
                    era,
                    tier: 3
                },
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'kaggle_marvel_comics',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing.breakdown
                }
            };
        });
        const result = await this.assetService.insertPricedAssets(assets, 100);
        return { inserted: result.inserted, skipped: result.skipped, errors: result.errors };
    }
    async processDCComics(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`📚 Processing ${records.length} DC comics from Kaggle...`);
        const assets = records.map(row => {
            const name = row.Issue_Name;
            const symbol = this.generateSymbol('DC', name);
            const era = this.determineEra(row.Release_Date);
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'comic',
                name,
                era,
                franchiseTier: 3
            });
            return {
                type: 'comic',
                name,
                symbol,
                category: 'comic',
                metadata: {
                    source: 'kaggle_dc_comics',
                    publisher: 'DC Comics',
                    categoryTitle: row.Catergory_Title,
                    issueLink: row.Issue_Link,
                    pencilers: row.Pencilers,
                    coverArtists: row.Cover_Artists,
                    inkers: row.Inkers,
                    writers: row.Writers,
                    editors: row.Editors,
                    executiveEditor: row.Executive_Editor,
                    letterers: row.Letterers,
                    colourists: row.Colourists,
                    rating: row.Rating,
                    releaseDate: row.Release_Date,
                    comicSeries: row.Comic_Series,
                    comicType: row.Comic_Type,
                    era,
                    tier: 3
                },
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'kaggle_dc_comics',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing.breakdown
                }
            };
        });
        const result = await this.assetService.insertPricedAssets(assets, 100);
        return { inserted: result.inserted, skipped: result.skipped, errors: result.errors };
    }
    generateSymbol(prefix, name) {
        const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const hash = this.simpleHash(normalized);
        return `${prefix}.${hash.substring(0, 9).toUpperCase()}`;
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
    determineEra(dateStr) {
        if (!dateStr)
            return 'modern';
        const yearMatch = dateStr.match(/\d{4}/);
        if (!yearMatch)
            return 'modern';
        const year = parseInt(yearMatch[0]);
        if (year <= 1955)
            return 'golden';
        if (year <= 1970)
            return 'silver';
        if (year <= 1985)
            return 'bronze';
        return 'modern';
    }
}
exports.KaggleComicsExpansionService = KaggleComicsExpansionService;
