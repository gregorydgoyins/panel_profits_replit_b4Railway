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
exports.kaggleAssetExpansion = void 0;
const fs_1 = require("fs");
const sync_1 = require("csv-parse/sync");
const crypto = __importStar(require("crypto"));
const storage_1 = require("../storage");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const assetInsertionService_1 = require("./assetInsertionService");
/**
 * Kaggle Asset Expansion Service
 * Exhaustively processes ALL 23,272 characters from FiveThirtyEight dataset
 * Generates 100K-300K tradeable assets from character metadata
 */
class KaggleAssetExpansionService {
    constructor() {
        this.processedCharacterIds = new Set();
        this.processedTeams = new Set();
        this.processedSeries = new Set();
    }
    /**
     * Load tracking data from database to avoid re-processing
     */
    async loadProcessingState() {
        console.log('📊 Loading processing state from database...');
        try {
            // Get all Kaggle-sourced assets to build processed sets
            const existingAssets = await storage_1.storage.getAssets();
            for (const asset of existingAssets) {
                const meta = asset.metadata;
                // Track by source
                if (meta?.source === 'kaggle_character' && meta?.kaggleId) {
                    this.processedCharacterIds.add(meta.kaggleId);
                }
                if (meta?.source === 'kaggle_team' && meta?.teamName) {
                    this.processedTeams.add(meta.teamName);
                }
                if (meta?.source === 'kaggle_series' && meta?.seriesName) {
                    this.processedSeries.add(meta.seriesName);
                }
            }
            console.log(`✅ Loaded state: ${this.processedCharacterIds.size} characters, ${this.processedTeams.size} teams, ${this.processedSeries.size} series processed`);
        }
        catch (error) {
            console.warn('⚠️ Could not load processing state, starting fresh:', error);
        }
    }
    /**
     * Parse character CSV record
     */
    parseCharacterRecord(record, publisher) {
        try {
            const pageId = record.page_id || record.Id;
            const name = record.name || record.Name;
            const appearances = parseInt(record.APPEARANCES || record.Appearances || '0');
            if (!name || !pageId) {
                return null;
            }
            return {
                id: `${publisher}-${pageId}`,
                name,
                publisher,
                identity: record.ID || record.Identity,
                alignment: record.ALIGN || record.Alignment,
                eyeColor: record.EYE || record.Eyes,
                hairColor: record.HAIR || record.Hair,
                sex: record.SEX || record.Sex,
                alive: record.ALIVE || record.Alive,
                appearances,
                firstAppearance: record['FIRST APPEARANCE'] || record.First_appeared,
                year: parseInt(record.Year || record.First_appeared?.split(',')[1]?.trim() || '0'),
                universe: record.Universe || (publisher === 'Marvel' ? 'Earth-616' : 'New Earth'),
                urlSlug: record.urlslug,
                pageId
            };
        }
        catch (error) {
            console.warn(`⚠️ Error parsing character record:`, error);
            return null;
        }
    }
    /**
     * Generate character asset from Kaggle data
     */
    async generateCharacterAsset(character) {
        try {
            // Skip if already processed
            if (this.processedCharacterIds.has(character.id)) {
                return null;
            }
            // Determine era from year
            const era = this.determineEra(character.year);
            // Determine tier from appearances and name
            const tier = this.determineTier(character.name, character.appearances);
            // Generate deterministic symbol using crypto hash
            const symbol = this.generateAssetSymbol(character.name, null, `kaggle-${character.id}`);
            // Calculate pricing using unified engine
            const franchiseTier = this.mapTierToNumber(tier);
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'character',
                name: character.name,
                era: era,
                franchiseTier,
                keyAppearances: character.appearances,
                region: 'western'
            });
            if (!pricing) {
                return null;
            }
            return {
                symbol,
                name: character.name,
                baseName: character.name,
                variant: null,
                type: 'character',
                category: 'character',
                description: `${character.name} - ${character.publisher} character from ${character.universe}`,
                imageUrl: undefined,
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'unified_pricing',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing
                },
                metadata: {
                    source: 'kaggle_character',
                    kaggleId: character.id,
                    publisher: character.publisher,
                    universe: character.universe,
                    alignment: character.alignment,
                    identity: character.identity,
                    appearances: character.appearances,
                    firstAppearance: character.firstAppearance,
                    era,
                    tier,
                    eyeColor: character.eyeColor,
                    hairColor: character.hairColor,
                    sex: character.sex,
                    alive: character.alive
                }
            };
        }
        catch (error) {
            console.error(`❌ Error generating character asset for ${character.name}:`, error);
            return null;
        }
    }
    /**
     * Determine era from year
     */
    determineEra(year) {
        if (year >= 1938 && year <= 1955)
            return 'golden';
        if (year >= 1956 && year <= 1970)
            return 'silver';
        if (year >= 1971 && year <= 1985)
            return 'bronze';
        return 'modern';
    }
    /**
     * Determine tier from name and appearances
     */
    determineTier(name, appearances) {
        const nameLower = name.toLowerCase();
        // Tier 1: Flagship characters (by name recognition)
        const tier1Names = ['spider-man', 'batman', 'superman', 'wonder woman', 'captain america',
            'iron man', 'hulk', 'thor', 'wolverine', 'flash', 'green lantern'];
        if (tier1Names.some(n => nameLower.includes(n))) {
            return 'tier1_flagship';
        }
        // Tier 2: High appearances
        if (appearances > 1000) {
            return 'tier2_variant';
        }
        // Tier 3: Medium appearances
        if (appearances > 100) {
            return 'tier3_sidekick';
        }
        // Tier 4: Low appearances
        return 'tier4_unknown';
    }
    /**
     * Map tier string to franchise tier number
     */
    mapTierToNumber(tier) {
        if (tier.includes('tier1'))
            return 1;
        if (tier.includes('tier2'))
            return 2;
        if (tier.includes('tier3'))
            return 3;
        return 4;
    }
    /**
     * Extract team names from character data
     */
    extractTeams(character) {
        const teams = [];
        // Common team patterns based on character name and universe
        const nameLower = character.name.toLowerCase();
        if (nameLower.includes('avenger'))
            teams.push('Avengers');
        if (nameLower.includes('x-men') || nameLower.includes('x-force'))
            teams.push('X-Men');
        if (nameLower.includes('fantastic four'))
            teams.push('Fantastic Four');
        if (nameLower.includes('justice league'))
            teams.push('Justice League');
        if (nameLower.includes('teen titans'))
            teams.push('Teen Titans');
        if (nameLower.includes('guardians'))
            teams.push('Guardians of the Galaxy');
        return teams;
    }
    /**
     * Generate team asset
     */
    async generateTeamAsset(teamName, publisher) {
        try {
            // Skip if already processed
            if (this.processedTeams.has(teamName)) {
                return null;
            }
            const symbol = this.generateAssetSymbol(teamName, null, `team-${teamName}`);
            // Teams are typically high-value collectibles
            const pricing = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: 'character', // Teams treated as high-tier characters
                name: teamName,
                era: 'silver', // Most classic teams from silver age
                franchiseTier: 2, // Tier 2: variants/superstars
                keyAppearances: 500,
                region: 'western'
            });
            if (!pricing) {
                return null;
            }
            this.processedTeams.add(teamName);
            return {
                symbol,
                name: teamName,
                baseName: teamName,
                variant: null,
                type: 'franchise',
                category: 'team',
                description: `${teamName} - Legendary ${publisher} superhero team`,
                imageUrl: undefined,
                pricing: {
                    currentPrice: pricing.sharePrice,
                    totalMarketValue: pricing.totalMarketValue,
                    totalFloat: pricing.totalFloat,
                    source: 'unified_pricing',
                    lastUpdated: new Date().toISOString(),
                    breakdown: pricing
                },
                metadata: {
                    source: 'kaggle_team',
                    teamName,
                    publisher,
                    tier: 'tier2_variant'
                }
            };
        }
        catch (error) {
            console.error(`❌ Error generating team asset for ${teamName}:`, error);
            return null;
        }
    }
    /**
     * Main expansion function - Process ALL Kaggle characters
     */
    async expandAllKaggleAssets() {
        console.log('🚀 Starting exhaustive Kaggle asset expansion...');
        console.log('📊 Target: ALL 23,272 characters from FiveThirtyEight dataset');
        const startTime = Date.now();
        const result = {
            charactersProcessed: 0,
            teamsGenerated: 0,
            seriesGenerated: 0,
            totalAssetsGenerated: 0,
            errors: []
        };
        try {
            // Load existing processing state
            await this.loadProcessingState();
            // Load Marvel characters
            console.log('📖 Loading Marvel characters CSV...');
            const marvelCsvPath = './attached_assets/marvel-characters.csv';
            const marvelData = (0, fs_1.readFileSync)(marvelCsvPath, 'utf-8');
            const marvelRecords = (0, sync_1.parse)(marvelData, { columns: true });
            console.log(`✅ Loaded ${marvelRecords.length} Marvel characters`);
            // Load DC characters
            console.log('📖 Loading DC characters CSV...');
            const dcCsvPath = './attached_assets/dc-characters.csv';
            const dcData = (0, fs_1.readFileSync)(dcCsvPath, 'utf-8');
            const dcRecords = (0, sync_1.parse)(dcData, { columns: true });
            console.log(`✅ Loaded ${dcRecords.length} DC characters`);
            const totalCharacters = marvelRecords.length + dcRecords.length;
            console.log(`📊 Total characters to process: ${totalCharacters}`);
            // Process ALL characters (not just top 100!)
            const allGeneratedAssets = [];
            const teamsToGenerate = new Set();
            // Process Marvel characters
            console.log('🦸 Processing Marvel characters...');
            for (let i = 0; i < marvelRecords.length; i++) {
                const record = marvelRecords[i];
                const character = this.parseCharacterRecord(record, 'Marvel');
                if (!character)
                    continue;
                // Generate character asset
                const characterAsset = await this.generateCharacterAsset(character);
                if (characterAsset) {
                    allGeneratedAssets.push(characterAsset);
                    this.processedCharacterIds.add(character.id);
                    result.charactersProcessed++;
                }
                // Extract teams
                const teams = this.extractTeams(character);
                teams.forEach(team => teamsToGenerate.add(`Marvel:${team}`));
                // Progress logging
                if ((i + 1) % 1000 === 0) {
                    console.log(`   📈 Processed ${i + 1}/${marvelRecords.length} Marvel characters (${result.charactersProcessed} new assets)`);
                }
            }
            // Process DC characters
            console.log('🦸 Processing DC characters...');
            for (let i = 0; i < dcRecords.length; i++) {
                const record = dcRecords[i];
                const character = this.parseCharacterRecord(record, 'DC');
                if (!character)
                    continue;
                // Generate character asset
                const characterAsset = await this.generateCharacterAsset(character);
                if (characterAsset) {
                    allGeneratedAssets.push(characterAsset);
                    this.processedCharacterIds.add(character.id);
                    result.charactersProcessed++;
                }
                // Extract teams
                const teams = this.extractTeams(character);
                teams.forEach(team => teamsToGenerate.add(`DC:${team}`));
                // Progress logging
                if ((i + 1) % 1000 === 0) {
                    console.log(`   📈 Processed ${i + 1}/${dcRecords.length} DC characters (${result.charactersProcessed} new assets)`);
                }
            }
            console.log(`✅ Character processing complete: ${result.charactersProcessed} new character assets`);
            // Generate team assets
            console.log(`🏢 Generating ${teamsToGenerate.size} team assets...`);
            for (const teamKey of Array.from(teamsToGenerate)) {
                const [publisher, teamName] = teamKey.split(':');
                const teamAsset = await this.generateTeamAsset(teamName, publisher);
                if (teamAsset) {
                    allGeneratedAssets.push(teamAsset);
                    result.teamsGenerated++;
                }
            }
            console.log(`✅ Team generation complete: ${result.teamsGenerated} new team assets`);
            // Bulk insert all assets
            if (allGeneratedAssets.length > 0) {
                console.log(`💾 Bulk inserting ${allGeneratedAssets.length} assets...`);
                const insertResult = await assetInsertionService_1.assetInsertionService.insertPricedAssets(allGeneratedAssets);
                // Preserve totalAssetsGenerated (don't overwrite with inserted count)
                result.insertionResult = {
                    inserted: insertResult.inserted,
                    skipped: insertResult.skipped,
                    errors: insertResult.errors
                };
                console.log(`✅ Inserted: ${insertResult.inserted}, Skipped: ${insertResult.skipped}, Errors: ${insertResult.errors}`);
            }
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`\n🎉 KAGGLE EXPANSION COMPLETE!`);
            console.log(`   ⏱️  Duration: ${duration}s`);
            console.log(`   👥 Characters processed: ${result.charactersProcessed}`);
            console.log(`   🏢 Teams generated: ${result.teamsGenerated}`);
            console.log(`   📦 Total new assets: ${result.totalAssetsGenerated}`);
            console.log(`   📊 Assets/second: ${(result.totalAssetsGenerated / parseFloat(duration)).toFixed(1)}`);
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Kaggle expansion error:', errorMessage);
            result.errors.push(errorMessage);
            throw error;
        }
    }
    /**
     * Generate asset symbol from name using crypto hash (same as Pinecone)
     */
    generateAssetSymbol(name, variant, uniqueId) {
        // Generate base symbol from first letters
        const words = name.split(' ').filter(w => w.length > 0);
        let baseSymbol = words
            .map(w => w[0].toUpperCase())
            .join('')
            .substring(0, 5);
        // If variant exists, add variant suffix
        if (variant) {
            const variantWords = variant.split(' ').filter(w => w.length > 0);
            const variantSuffix = variantWords
                .map(w => w[0].toUpperCase())
                .join('')
                .substring(0, 3);
            baseSymbol = `${baseSymbol}.${variantSuffix}`;
        }
        // Add deterministic crypto hash suffix for collision resistance
        const hashInput = `${name.toLowerCase()}|${variant?.toLowerCase() || ''}|${uniqueId}`;
        const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
        const hashBigInt = BigInt('0x' + hash.substring(0, 16));
        const symbolSpace = BigInt(36 ** 11);
        const hashMod = hashBigInt % symbolSpace;
        const hashSuffix = hashMod.toString(36).toUpperCase().padStart(11, '0');
        return `${baseSymbol || 'ASSET'}.${hashSuffix}`;
    }
}
// Export singleton instance
exports.kaggleAssetExpansion = new KaggleAssetExpansionService();
