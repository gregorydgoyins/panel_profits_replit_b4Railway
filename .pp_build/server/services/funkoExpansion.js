"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunkoExpansionService = void 0;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const assetInsertionService_1 = require("./assetInsertionService");
const crypto_1 = __importDefault(require("crypto"));
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
class FunkoExpansionService {
    constructor() {
        this.pricingEngine = new unifiedPricingEngine_1.UnifiedPricingEngine();
        this.assetInsertion = new assetInsertionService_1.AssetInsertionService();
    }
    safeParseArray(value) {
        if (!value || value === '[]')
            return [];
        try {
            const cleaned = value.replace(/'/g, '"');
            return JSON.parse(cleaned);
        }
        catch {
            return [];
        }
    }
    generateSymbol(title, uid) {
        const hash = crypto_1.default.createHash('sha256').update(`funko_${uid}`).digest();
        const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
        const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
        return `FNK.${suffix}`;
    }
    async processAll(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`🎭 Processing ${records.length} Funko Pops...`);
        const assetsToInsert = [];
        const startTime = Date.now();
        for (const row of records) {
            const symbol = this.generateSymbol(row.title, row.uid);
            const interests = this.safeParseArray(row.interest);
            const licenses = this.safeParseArray(row.license);
            const tags = this.safeParseArray(row.tags);
            // Build metadata
            const metadata = {
                uid: row.uid,
                productType: row.product_type,
                interests,
                licenses,
                tags,
                vendor: row.vendor,
                handle: row.handle,
                price: parseFloat(row.price) || 0,
                franchise: licenses[0] || 'Unknown',
                category: 'collectible',
                source: 'kaggle_funko'
            };
            // Generate pricing based on retail price and franchise
            const pricingResult = this.pricingEngine.generateFunkoPricing({
                title: row.title,
                retailPrice: parseFloat(row.price) || 0,
                franchise: licenses[0] || 'Unknown',
                interests
            });
            const asset = {
                symbol,
                name: row.title,
                type: 'collectible',
                description: row.description?.substring(0, 500) || `${row.title} Funko Pop collectible`,
                imageUrl: row.img || null,
                metadata,
                pricing: {
                    currentPrice: pricingResult.sharePrice,
                    totalMarketValue: pricingResult.totalMarketValue,
                    totalFloat: pricingResult.totalFloat,
                    source: 'kaggle_funko',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricingResult.breakdown
                }
            };
            assetsToInsert.push(asset);
        }
        // Batch insert
        const result = await this.assetInsertion.insertPricedAssets(assetsToInsert);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const rate = (result.inserted / parseFloat(elapsed)).toFixed(1);
        console.log(`✅ Funko expansion complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors} errors in ${elapsed}s (${rate} assets/sec)`);
        return result;
    }
}
exports.FunkoExpansionService = FunkoExpansionService;
