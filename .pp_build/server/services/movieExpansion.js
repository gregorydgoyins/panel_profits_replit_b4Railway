"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieExpansionService = void 0;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const assetInsertionService_1 = require("./assetInsertionService");
const crypto_1 = __importDefault(require("crypto"));
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
class MovieExpansionService {
    constructor() {
        this.pricingEngine = new unifiedPricingEngine_1.UnifiedPricingEngine();
        this.assetInsertion = new assetInsertionService_1.AssetInsertionService();
    }
    generateSymbol(title, year, category) {
        const hash = crypto_1.default.createHash('sha256').update(`movie_${category}_${title}_${year}`).digest();
        const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
        const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
        return `MOV.${suffix}`;
    }
    async processAll(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`🎬 Processing ${records.length} Marvel/DC movies...`);
        const assetsToInsert = [];
        const startTime = Date.now();
        for (const row of records) {
            const symbol = this.generateSymbol(row.Movie, row.Year, row.Category);
            const imdbScore = parseFloat(row.IMDB_Score) || 0;
            const metascore = parseFloat(row.Metascore) || 0;
            const votes = parseInt(row.Votes?.replace(/,/g, '')) || 0;
            const usaGross = parseFloat(row.USA_Gross?.replace(/[,$]/g, '')) || 0;
            const metadata = {
                year: parseInt(row.Year) || 0,
                genre: row.Genre,
                runtime: parseInt(row.RunTime) || 0,
                rating: row.Rating,
                director: row.Director,
                actor: row.Actor,
                imdbScore,
                metascore,
                votes,
                usaGross,
                category: row.Category,
                franchise: row.Category === 'Marvel' ? 'Marvel Cinematic Universe' : 'DC Extended Universe',
                source: 'kaggle_marvel_dc_movies'
            };
            const pricingResult = this.pricingEngine.generateMoviePricing({
                title: row.Movie,
                imdbScore,
                metascore,
                usaGross,
                category: row.Category
            });
            const asset = {
                symbol,
                name: row.Movie,
                type: 'comic',
                description: row.Description?.substring(0, 500) || `${row.Movie} (${row.Year}) - ${row.Category}`,
                imageUrl: null,
                metadata,
                pricing: {
                    currentPrice: pricingResult.sharePrice,
                    totalMarketValue: pricingResult.totalMarketValue,
                    totalFloat: pricingResult.totalFloat,
                    source: 'kaggle_marvel_dc_movies',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricingResult.breakdown
                }
            };
            assetsToInsert.push(asset);
        }
        const result = await this.assetInsertion.insertPricedAssets(assetsToInsert);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const rate = (result.inserted / parseFloat(elapsed)).toFixed(1);
        console.log(`✅ Movie expansion complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors} errors in ${elapsed}s (${rate} assets/sec)`);
        return result;
    }
}
exports.MovieExpansionService = MovieExpansionService;
