"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaExpansionService = void 0;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const assetInsertionService_1 = require("./assetInsertionService");
const crypto_1 = __importDefault(require("crypto"));
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
class MangaExpansionService {
    constructor() {
        this.pricingEngine = new unifiedPricingEngine_1.UnifiedPricingEngine();
        this.assetInsertion = new assetInsertionService_1.AssetInsertionService();
    }
    generateSymbol(title, source) {
        const safeTitle = (title || 'unknown').toLowerCase();
        const hash = crypto_1.default.createHash('sha256').update(`manga_${source}_${safeTitle}`).digest();
        const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
        const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
        return `MNG.${suffix}`;
    }
    async processBestselling(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`📚 Processing ${records.length} bestselling manga series...`);
        const assetsToInsert = [];
        const startTime = Date.now();
        for (const row of records) {
            try {
                const mangaTitle = row['Manga series'] || 'Unknown';
                const symbol = this.generateSymbol(mangaTitle, 'bestselling');
                const salesMillions = parseFloat(row['Approximate sales in million(s)']) || 0;
                const metadata = {
                    authors: row['Author(s)'],
                    publisher: row['Publisher'],
                    demographic: row['Demographic'],
                    volumes: parseInt(row['No. of collected volumes']) || 0,
                    serialized: row['Serialized'],
                    salesMillions,
                    avgSalesPerVolume: parseFloat(row['Average sales per volume in million(s)']) || 0,
                    franchise: row['Manga series'],
                    category: 'manga',
                    source: 'kaggle_manga_bestselling'
                };
                const pricingResult = this.pricingEngine.generateMangaPricing({
                    title: mangaTitle,
                    salesMillions,
                    volumes: parseInt(row['No. of collected volumes']) || 0
                });
                const asset = {
                    symbol,
                    name: mangaTitle,
                    type: 'comic',
                    description: `${mangaTitle} by ${row['Author(s)']} - ${salesMillions}M+ copies sold`,
                    imageUrl: null,
                    metadata,
                    pricing: {
                        currentPrice: pricingResult.sharePrice,
                        totalMarketValue: pricingResult.totalMarketValue,
                        totalFloat: pricingResult.totalFloat,
                        source: 'kaggle_manga_bestselling',
                        lastUpdated: new Date().toISOString(),
                        breakdown: pricingResult.breakdown
                    }
                };
                assetsToInsert.push(asset);
            }
            catch (error) {
                console.error(`Error processing manga ${row['Manga series']}:`, error);
            }
        }
        const result = await this.assetInsertion.insertPricedAssets(assetsToInsert);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Bestselling manga complete: ${result.inserted} inserted in ${elapsed}s`);
        return result;
    }
    async processComprehensive(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`📚 Processing ${records.length} manga titles...`);
        const assetsToInsert = [];
        const startTime = Date.now();
        let processed = 0;
        for (const row of records) {
            const symbol = this.generateSymbol(row.title, 'comprehensive');
            const metadata = {
                rating: parseFloat(row.rating) || 0,
                year: parseInt(row.year) || 0,
                tags: row.tags || '',
                franchise: row.title,
                category: 'manga',
                source: 'kaggle_manga_comprehensive'
            };
            const pricingResult = this.pricingEngine.generateMangaPricing({
                title: row.title,
                rating: parseFloat(row.rating) || 0,
                year: parseInt(row.year) || 0
            });
            const asset = {
                symbol,
                name: row.title,
                type: 'comic',
                description: row.description?.substring(0, 500) || row.title,
                imageUrl: row.cover || null,
                metadata,
                pricing: {
                    currentPrice: pricingResult.sharePrice,
                    totalMarketValue: pricingResult.totalMarketValue,
                    totalFloat: pricingResult.totalFloat,
                    source: 'kaggle_manga_comprehensive',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricingResult.breakdown
                }
            };
            assetsToInsert.push(asset);
            processed++;
            // Batch insert every 1000 items
            if (assetsToInsert.length >= 1000) {
                await this.assetInsertion.insertPricedAssets(assetsToInsert);
                assetsToInsert.length = 0;
                console.log(`   📦 Processed ${processed} / ${records.length} manga...`);
            }
        }
        // Insert remaining
        const finalResult = await this.assetInsertion.insertPricedAssets(assetsToInsert);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const rate = (processed / parseFloat(elapsed)).toFixed(1);
        console.log(`✅ Comprehensive manga complete: ${processed} processed in ${elapsed}s (${rate} assets/sec)`);
        return finalResult;
    }
}
exports.MangaExpansionService = MangaExpansionService;
