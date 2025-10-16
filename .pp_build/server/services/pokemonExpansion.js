"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonExpansionService = void 0;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const assetInsertionService_1 = require("./assetInsertionService");
const crypto_1 = __importDefault(require("crypto"));
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
class PokemonExpansionService {
    constructor() {
        this.pricingEngine = new unifiedPricingEngine_1.UnifiedPricingEngine();
        this.assetInsertion = new assetInsertionService_1.AssetInsertionService();
    }
    generateSymbol(name) {
        const hash = crypto_1.default.createHash('sha256').update(`pokemon_${name.toLowerCase()}`).digest();
        const hashBigInt = BigInt('0x' + hash.toString('hex').substring(0, 16));
        const suffix = (hashBigInt % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
        return `PKM.${suffix}`;
    }
    async processAll(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`🎮 Processing ${records.length} Pokemon...`);
        const assetsToInsert = [];
        const startTime = Date.now();
        for (const row of records) {
            const symbol = this.generateSymbol(row.Name);
            const imagePath = `/tmp/kaggle_pokemon/images/${row.Name.toLowerCase()}.png`;
            // Build metadata
            const metadata = {
                type1: row.Type1,
                type2: row.Type2 || null,
                evolution: row.Evolution || null,
                franchise: 'Pokemon',
                category: 'character',
                source: 'kaggle_pokemon'
            };
            // Generate pricing
            const pricingResult = this.pricingEngine.generatePokemonPricing({
                name: row.Name,
                type1: row.Type1,
                type2: row.Type2,
                evolution: row.Evolution
            });
            const asset = {
                symbol,
                name: row.Name,
                type: 'character',
                description: `${row.Name} - ${row.Type1}${row.Type2 ? '/' + row.Type2 : ''} type Pokemon`,
                imageUrl: null, // Will upload to object storage later
                metadata,
                pricing: {
                    currentPrice: pricingResult.sharePrice,
                    totalMarketValue: pricingResult.totalMarketValue,
                    totalFloat: pricingResult.totalFloat,
                    source: 'kaggle_pokemon',
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
        console.log(`✅ Pokemon expansion complete: ${result.inserted} inserted, ${result.skipped} skipped, ${result.errors} errors in ${elapsed}s (${rate} assets/sec)`);
        return result;
    }
}
exports.PokemonExpansionService = PokemonExpansionService;
