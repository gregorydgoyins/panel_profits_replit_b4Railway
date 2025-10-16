"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KaggleRound2ExpansionService = void 0;
const fs_1 = require("fs");
const sync_1 = require("csv-parse/sync");
const assetInsertionService_1 = require("./assetInsertionService");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
class KaggleRound2ExpansionService {
    constructor() {
        this.assetService = new assetInsertionService_1.AssetInsertionService();
    }
    async processIndieComics(csvPaths) {
        const assets = [];
        for (const csvPath of csvPaths) {
            const publisher = csvPath.includes('dark-horse') ? 'Dark Horse' :
                csvPath.includes('dynamite') ? 'Dynamite' :
                    csvPath.includes('image') ? 'Image Comics' :
                        csvPath.includes('valiant') ? 'Valiant' : 'Indie';
            const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
            const records = (0, sync_1.parse)(csvContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
            console.log(`📚 Processing ${records.length} ${publisher} characters...`);
            for (const row of records) {
                if (!row.Name)
                    continue;
                const symbol = this.generateSymbol(row.Name, 'indie');
                const realName = row['Real Name'] || row['Real name'] || row.Name;
                const alignment = (row.Alignment || '').toLowerCase();
                const tier = alignment.includes('good') ? 2 :
                    alignment.includes('bad') || alignment.includes('villain') ? 4 : 3;
                const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                    assetType: 'character',
                    name: row.Name,
                    era: 'modern',
                    franchiseTier: tier
                });
                assets.push({
                    symbol,
                    name: row.Name,
                    type: 'character',
                    description: `${row.Name} - ${publisher} Comics`,
                    imageUrl: undefined,
                    category: 'character',
                    metadata: {
                        source: 'kaggle_indie_comics',
                        publisher,
                        realName,
                        alignment: row.Alignment,
                        gender: row.Gender,
                        affiliation: row.Affiliation || row.Affiliations,
                        creators: row.Creators,
                        firstAppearance: row['First appearance'],
                        tier
                    },
                    pricing: {
                        currentPrice: pricing.sharePrice,
                        totalMarketValue: pricing.totalMarketValue,
                        totalFloat: pricing.totalFloat,
                        source: 'kaggle_indie_comics',
                        lastUpdated: new Date().toISOString(),
                        breakdown: pricing.breakdown
                    }
                });
            }
        }
        console.log(`📦 Inserting ${assets.length} indie comic characters...`);
        return await this.assetService.insertPricedAssets(assets);
    }
    async processDBZ(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`⚡ Processing ${records.length} Dragon Ball Z characters...`);
        const assets = records.map(row => {
            const symbol = this.generateSymbol(row.Name, 'dbz');
            const powerLevel = parseInt(row['Power Level']) || 0;
            const tier = powerLevel > 5000 ? 1 : powerLevel > 1000 ? 2 : 3;
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'character',
                name: row.Name,
                era: 'modern',
                franchiseTier: tier
            });
            return {
                symbol,
                name: row.Name,
                type: 'character',
                description: `${row.Name} - Dragon Ball Z`,
                imageUrl: null,
                category: 'character',
                metadata: {
                    source: 'kaggle_dbz',
                    franchise: 'Dragon Ball Z',
                    race: row.Race,
                    gender: row.Gender,
                    powerLevel,
                    kiBlast: row['Ki Blast'],
                    transformation: row.Transformation,
                    tier
                },
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'kaggle_dbz',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing.breakdown
                }
            };
        });
        return await this.assetService.insertPricedAssets(assets);
    }
    async processAnimeCharacters(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`🎌 Processing ${records.length} anime characters...`);
        const assets = records.map(row => {
            const symbol = this.generateSymbol(row.name_english, 'anime');
            const favorites = parseInt(row.favorites || '0');
            const tier = favorites > 50000 ? 1 : favorites > 10000 ? 2 : 3;
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'character',
                name: row.name_english,
                era: 'modern',
                franchiseTier: tier
            });
            return {
                symbol,
                name: row.name_english,
                type: 'character',
                description: `${row.name_english} - Anime Character`,
                imageUrl: null,
                category: 'character',
                metadata: {
                    source: 'kaggle_anime',
                    nameJapanese: row.name_japanese,
                    titles: row.anime_manga_titles,
                    favorites,
                    tier
                },
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'kaggle_anime',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing.breakdown
                }
            };
        });
        return await this.assetService.insertPricedAssets(assets);
    }
    async processGenshin(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`🌸 Processing ${records.length} Genshin Impact characters...`);
        const assets = records.filter(row => row.character_name).map(row => {
            const symbol = this.generateSymbol(row.character_name, 'genshin');
            const rarity = parseInt(row.star_rarity);
            const tier = rarity === 5 ? 1 : rarity === 4 ? 2 : 3;
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'character',
                name: row.character_name,
                era: 'modern',
                franchiseTier: tier
            });
            return {
                symbol,
                name: row.character_name,
                type: 'character',
                description: `${row.character_name} - Genshin Impact`,
                imageUrl: null,
                category: 'character',
                metadata: {
                    source: 'kaggle_genshin',
                    franchise: 'Genshin Impact',
                    rarity,
                    region: row.region,
                    vision: row.vision,
                    weaponType: row.weapon_type,
                    tier
                },
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'kaggle_genshin',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing.breakdown
                }
            };
        });
        return await this.assetService.insertPricedAssets(assets);
    }
    async processHonkai(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`⭐ Processing ${records.length} Honkai Star Rail characters...`);
        const assets = records.filter(row => row.character).map(row => {
            const symbol = this.generateSymbol(row.character, 'honkai');
            const rarity = parseInt(row.rarity);
            const tier = rarity === 5 ? 1 : rarity === 4 ? 2 : 3;
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'character',
                name: row.character,
                era: 'modern',
                franchiseTier: tier
            });
            return {
                symbol,
                name: row.character,
                type: 'character',
                description: `${row.character} - Honkai Star Rail`,
                imageUrl: null,
                category: 'character',
                metadata: {
                    source: 'kaggle_honkai',
                    franchise: 'Honkai Star Rail',
                    rarity,
                    path: row.path,
                    combatType: row.combat_type,
                    tier
                },
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'kaggle_honkai',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing.breakdown
                }
            };
        });
        return await this.assetService.insertPricedAssets(assets);
    }
    async processAll() {
        const results = {
            indieComics: await this.processIndieComics([
                '/tmp/kaggle_expansion/indie_comics/dark-horse-fandom-data.csv',
                '/tmp/kaggle_expansion/indie_comics/dynamite-fandom-data.csv',
                '/tmp/kaggle_expansion/indie_comics/image-fandom-data.csv',
                '/tmp/kaggle_expansion/indie_comics/valiant-fandom-data.csv'
            ]),
            dbz: await this.processDBZ('/tmp/kaggle_expansion/dbz/dragon_ball_z.csv'),
            anime: await this.processAnimeCharacters('/tmp/kaggle_expansion/anime_chars/top_anime_characters_cleaned.csv'),
            genshin: await this.processGenshin('/tmp/kaggle_expansion/genshin/genshin_characters_v1.csv'),
            honkai: await this.processHonkai('/tmp/kaggle_expansion/honkai/hsr_character-data.csv')
        };
        const total = {
            inserted: Object.values(results).reduce((sum, r) => sum + r.inserted, 0),
            skipped: Object.values(results).reduce((sum, r) => sum + r.skipped, 0),
            errors: Object.values(results).reduce((sum, r) => sum + r.errors, 0)
        };
        console.log(`\n✅ Kaggle Round 2 Complete: ${total.inserted} inserted, ${total.skipped} skipped, ${total.errors} errors`);
        return total;
    }
    generateSymbol(name, prefix) {
        if (!name) {
            name = 'unknown';
        }
        const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const hash = this.simpleHash(normalized + prefix);
        const suffix = hash.substring(0, 11).toUpperCase();
        return `${prefix.substring(0, 3).toUpperCase()}.${suffix}`;
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
}
exports.KaggleRound2ExpansionService = KaggleRound2ExpansionService;
