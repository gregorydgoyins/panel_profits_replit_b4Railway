"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comicVineExpansionService = exports.ComicVineExpansionService = void 0;
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const tierClassificationService_1 = require("./tierClassificationService");
const assetInsertionService_1 = require("./assetInsertionService");
const SymbolGeneratorService_1 = require("./SymbolGeneratorService");
const crypto_1 = __importDefault(require("crypto"));
class ComicVineExpansionService {
    constructor() {
        this.baseUrl = 'https://comicvine.gamespot.com/api';
        this.rateLimit = 18000; // 18 seconds between requests (200/hour safe limit)
        this.maxRetries = 3;
        this.apiKey = process.env.COMIC_VINE_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ COMIC_VINE_API_KEY not set - Comic Vine expansion will not work');
        }
    }
    /**
     * Rate limiting helper
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Make API request with retries and rate limiting
     */
    async makeRequest(endpoint, params = {}, retryCount = 0) {
        const queryParams = new URLSearchParams({
            api_key: this.apiKey,
            format: 'json',
            ...params
        });
        const url = `${this.baseUrl}/${endpoint}/?${queryParams}`;
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'PanelProfits/1.0' }
            });
            if (!response.ok) {
                if (response.status === 429 && retryCount < this.maxRetries) {
                    // Rate limited - wait longer and retry
                    console.warn(`⚠️ Rate limited, waiting 60s before retry ${retryCount + 1}/${this.maxRetries}`);
                    await this.sleep(60000);
                    return this.makeRequest(endpoint, params, retryCount + 1);
                }
                const text = await response.text();
                throw new Error(`Comic Vine API error ${response.status}: ${text.substring(0, 200)}`);
            }
            const data = await response.json();
            if (data.status_code !== 1) {
                throw new Error(`Comic Vine error: ${data.error}`);
            }
            return data;
        }
        catch (error) {
            if (retryCount < this.maxRetries) {
                console.warn(`⚠️ Request failed, retry ${retryCount + 1}/${this.maxRetries}: ${error}`);
                await this.sleep(30000);
                return this.makeRequest(endpoint, params, retryCount + 1);
            }
            throw error;
        }
    }
    /**
     * Generate deterministic symbol from Comic Vine ID and name
     */
    generateAssetSymbol(name, variant, comicVineId) {
        const normalized = `${name}-${variant || 'base'}-cv${comicVineId}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const hash = crypto_1.default.createHash('sha256').update(normalized).digest();
        const hashNum = BigInt('0x' + hash.toString('hex').substring(0, 16));
        const suffix = (hashNum % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
        const prefix = name
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 5);
        if (variant) {
            const variantPrefix = variant
                .split(/\s+/)
                .map(word => word.charAt(0).toUpperCase())
                .join('')
                .substring(0, 3);
            return `${prefix}.${variantPrefix}.${suffix}`;
        }
        return `${prefix}.${suffix}`;
    }
    /**
     * Determine era from year
     */
    determineEraFromYear(year) {
        if (!year)
            return 'modern';
        const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
        if (yearNum < 1956)
            return 'golden';
        if (yearNum < 1971)
            return 'silver';
        if (yearNum < 1986)
            return 'bronze';
        return 'modern';
    }
    /**
     * Transform Comic Vine character to tradeable asset
     */
    async transformCharacter(character) {
        const name = character.name;
        const appearances = character.count_of_issue_appearances || 0;
        const publisher = character.publisher?.name || 'Unknown Publisher';
        // Classify tier
        const classification = tierClassificationService_1.tierClassificationService.classifyCharacter({
            name,
            publisher,
            appearances,
            isVariant: false
        });
        // Determine era from first appearance
        const firstAppearanceYear = character.first_appeared_in_issue?.name?.match(/\((\d{4})\)/)?.[1];
        const era = this.determineEraFromYear(firstAppearanceYear);
        // Calculate pricing
        const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
            assetType: 'character',
            name,
            era,
            keyAppearances: Math.floor(appearances * 0.2),
            franchiseTier: classification.tier,
            isVariant: false
        });
        return {
            type: 'character',
            name,
            baseName: name,
            variant: null,
            symbol: this.generateAssetSymbol(name, null, character.id),
            category: 'CHARACTER',
            description: character.deck || character.description?.substring(0, 500) || `${publisher} character`,
            imageUrl: character.image?.medium_url || character.image?.small_url || undefined,
            coverImageUrl: character.image?.super_url || character.image?.screen_url || undefined,
            metadata: {
                source: 'comicvine',
                comicVineId: character.id,
                publisher,
                appearances,
                realName: character.real_name,
                firstAppearance: character.first_appeared_in_issue,
                origin: character.origin,
                powers: character.powers,
                dateAdded: character.date_added,
                siteUrl: character.site_detail_url
            },
            pricing: {
                currentPrice: pricingResult.sharePrice,
                totalMarketValue: pricingResult.totalMarketValue,
                totalFloat: pricingResult.totalFloat,
                source: 'mathematical',
                lastUpdated: new Date().toISOString(),
                breakdown: pricingResult.breakdown
            },
            tier: classification.tier
        };
    }
    /**
     * Transform Comic Vine issue to tradeable asset
     */
    async transformIssue(issue) {
        const name = `${issue.volume.name} #${issue.issue_number}`;
        const publisher = issue.publisher?.name || 'Unknown Publisher';
        // Determine era from cover date
        const coverYear = issue.cover_date?.match(/^(\d{4})/)?.[1];
        const era = this.determineEraFromYear(coverYear);
        // Generate symbol using centralized service with new nomenclature
        // Format: TICKR.V#.#ISSUE (e.g., ASM.V1.#300)
        const symbol = SymbolGeneratorService_1.symbolGeneratorService.generateComicSymbol(name, {
            year: coverYear,
            publisher: publisher
        });
        // Calculate pricing for comic issue
        const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
            assetType: 'comic',
            name,
            era,
            keyAppearances: 0,
            franchiseTier: 3, // Most issues are tier 3
            isVariant: false
        });
        return {
            type: 'comic',
            name,
            symbol,
            category: 'COMIC',
            description: issue.deck || issue.description?.substring(0, 500) || `${publisher} comic issue`,
            imageUrl: issue.image?.medium_url || issue.image?.small_url || undefined,
            coverImageUrl: issue.image?.super_url || issue.image?.screen_url || undefined,
            metadata: {
                source: 'comicvine',
                comicVineId: issue.id,
                publisher,
                issueNumber: issue.issue_number,
                volume: issue.volume,
                coverDate: issue.cover_date,
                storeDate: issue.store_date,
                characters: issue.character_credits,
                creators: issue.person_credits,
                dateAdded: issue.date_added
            },
            pricing: {
                currentPrice: pricingResult.sharePrice,
                totalMarketValue: pricingResult.totalMarketValue,
                totalFloat: pricingResult.totalFloat,
                source: 'mathematical',
                lastUpdated: new Date().toISOString(),
                breakdown: pricingResult.breakdown
            },
            tier: 3
        };
    }
    /**
     * Transform Comic Vine creator/person to tradeable asset
     */
    async transformCreator(creator) {
        const name = creator.name;
        // Calculate pricing for creator
        const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
            assetType: 'creator',
            name,
            era: 'modern',
            creatorTier: 2,
            roleWeightedAppearances: 100
        });
        return {
            type: 'creator',
            name,
            symbol: this.generateAssetSymbol(name, null, creator.id),
            category: 'CREATOR',
            description: creator.deck || creator.description?.substring(0, 500) || 'Comic creator',
            imageUrl: creator.image?.medium_url || creator.image?.small_url || undefined,
            coverImageUrl: creator.image?.super_url || creator.image?.screen_url || undefined,
            metadata: {
                source: 'comicvine',
                comicVineId: creator.id,
                country: creator.country,
                hometown: creator.hometown,
                birth: creator.birth,
                death: creator.death,
                dateAdded: creator.date_added
            },
            pricing: {
                currentPrice: pricingResult.sharePrice,
                totalMarketValue: pricingResult.totalMarketValue,
                totalFloat: pricingResult.totalFloat,
                source: 'mathematical',
                lastUpdated: new Date().toISOString(),
                breakdown: pricingResult.breakdown
            },
            tier: 2
        };
    }
    /**
     * Fetch characters from Comic Vine
     */
    async fetchCharacters(limit = 100, offset = 0) {
        const response = await this.makeRequest('characters', { limit, offset });
        return {
            total: response.number_of_total_results,
            results: response.results
        };
    }
    /**
     * Fetch issues from Comic Vine
     */
    async fetchIssues(limit = 100, offset = 0) {
        const response = await this.makeRequest('issues', { limit, offset });
        return {
            total: response.number_of_total_results,
            results: response.results
        };
    }
    /**
     * Fetch creators from Comic Vine
     */
    async fetchCreators(limit = 100, offset = 0) {
        const response = await this.makeRequest('people', { limit, offset });
        return {
            total: response.number_of_total_results,
            results: response.results
        };
    }
    /**
     * Expand characters with progress tracking
     */
    async expandCharacters(startOffset = 0, maxToProcess = 10000, onProgress) {
        console.log('🦸 Starting Comic Vine character expansion...');
        const progress = {
            resourceType: 'characters',
            totalAvailable: 0,
            processed: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
            startTime: new Date().toISOString(),
            lastOffset: startOffset,
            isComplete: false
        };
        try {
            // Get total count
            const firstBatch = await this.fetchCharacters(1, 0);
            progress.totalAvailable = firstBatch.total;
            console.log(`📊 Found ${progress.totalAvailable.toLocaleString()} total characters in Comic Vine`);
            console.log(`🎯 Processing ${maxToProcess.toLocaleString()} characters starting from offset ${startOffset}`);
            const batchSize = 100;
            const endOffset = Math.min(startOffset + maxToProcess, progress.totalAvailable);
            for (let offset = startOffset; offset < endOffset; offset += batchSize) {
                try {
                    console.log(`\n📦 Fetching characters ${offset}-${offset + batchSize}...`);
                    const batch = await this.fetchCharacters(batchSize, offset);
                    const characters = batch.results;
                    // Transform to priced assets
                    const pricedAssets = [];
                    for (const character of characters) {
                        try {
                            const asset = await this.transformCharacter(character);
                            pricedAssets.push(asset);
                        }
                        catch (error) {
                            console.error(`❌ Error transforming character ${character.name}:`, error);
                            progress.errors++;
                        }
                    }
                    // Insert batch
                    if (pricedAssets.length > 0) {
                        const result = await assetInsertionService_1.assetInsertionService.insertPricedAssets(pricedAssets, 100);
                        progress.inserted += result.inserted;
                        progress.skipped += result.skipped;
                        progress.errors += result.errors;
                    }
                    progress.processed += characters.length;
                    progress.lastOffset = offset;
                    console.log(`✅ Progress: ${progress.processed}/${Math.min(maxToProcess, progress.totalAvailable)} | Inserted: ${progress.inserted} | Skipped: ${progress.skipped} | Errors: ${progress.errors}`);
                    if (onProgress) {
                        onProgress(progress);
                    }
                    // Rate limiting
                    await this.sleep(this.rateLimit);
                }
                catch (error) {
                    console.error(`❌ Error processing batch at offset ${offset}:`, error);
                    progress.errors += batchSize;
                    await this.sleep(60000); // Wait longer on error
                }
            }
            progress.isComplete = progress.lastOffset + batchSize >= endOffset;
            console.log(`\n🏁 Character expansion complete!`);
            console.log(`   Total Processed: ${progress.processed}`);
            console.log(`   Inserted: ${progress.inserted}`);
            console.log(`   Skipped: ${progress.skipped}`);
            console.log(`   Errors: ${progress.errors}`);
        }
        catch (error) {
            console.error('❌ Fatal error in character expansion:', error);
            throw error;
        }
        return progress;
    }
    /**
     * Expand issues with progress tracking
     */
    async expandIssues(startOffset = 0, maxToProcess = 10000, onProgress) {
        console.log('📚 Starting Comic Vine issue expansion...');
        const progress = {
            resourceType: 'issues',
            totalAvailable: 0,
            processed: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
            startTime: new Date().toISOString(),
            lastOffset: startOffset,
            isComplete: false
        };
        try {
            // Get total count
            const firstBatch = await this.fetchIssues(1, 0);
            progress.totalAvailable = firstBatch.total;
            console.log(`📊 Found ${progress.totalAvailable.toLocaleString()} total issues in Comic Vine`);
            console.log(`🎯 Processing ${maxToProcess.toLocaleString()} issues starting from offset ${startOffset}`);
            const batchSize = 100;
            const endOffset = Math.min(startOffset + maxToProcess, progress.totalAvailable);
            for (let offset = startOffset; offset < endOffset; offset += batchSize) {
                try {
                    console.log(`\n📦 Fetching issues ${offset}-${offset + batchSize}...`);
                    const batch = await this.fetchIssues(batchSize, offset);
                    const issues = batch.results;
                    // Transform to priced assets
                    const pricedAssets = [];
                    for (const issue of issues) {
                        try {
                            const asset = await this.transformIssue(issue);
                            pricedAssets.push(asset);
                        }
                        catch (error) {
                            console.error(`❌ Error transforming issue ${issue.name}:`, error);
                            progress.errors++;
                        }
                    }
                    // Insert batch
                    if (pricedAssets.length > 0) {
                        const result = await assetInsertionService_1.assetInsertionService.insertPricedAssets(pricedAssets, 100);
                        progress.inserted += result.inserted;
                        progress.skipped += result.skipped;
                        progress.errors += result.errors;
                    }
                    progress.processed += issues.length;
                    progress.lastOffset = offset;
                    console.log(`✅ Progress: ${progress.processed}/${Math.min(maxToProcess, progress.totalAvailable)} | Inserted: ${progress.inserted} | Skipped: ${progress.skipped} | Errors: ${progress.errors}`);
                    if (onProgress) {
                        onProgress(progress);
                    }
                    // Rate limiting
                    await this.sleep(this.rateLimit);
                }
                catch (error) {
                    console.error(`❌ Error processing batch at offset ${offset}:`, error);
                    progress.errors += batchSize;
                    await this.sleep(60000);
                }
            }
            progress.isComplete = progress.lastOffset + batchSize >= endOffset;
            console.log(`\n🏁 Issue expansion complete!`);
            console.log(`   Total Processed: ${progress.processed}`);
            console.log(`   Inserted: ${progress.inserted}`);
            console.log(`   Skipped: ${progress.skipped}`);
            console.log(`   Errors: ${progress.errors}`);
        }
        catch (error) {
            console.error('❌ Fatal error in issue expansion:', error);
            throw error;
        }
        return progress;
    }
    /**
     * Expand creators with progress tracking
     */
    async expandCreators(startOffset = 0, maxToProcess = 10000, onProgress) {
        console.log('✍️ Starting Comic Vine creator expansion...');
        const progress = {
            resourceType: 'creators',
            totalAvailable: 0,
            processed: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
            startTime: new Date().toISOString(),
            lastOffset: startOffset,
            isComplete: false
        };
        try {
            // Get total count
            const firstBatch = await this.fetchCreators(1, 0);
            progress.totalAvailable = firstBatch.total;
            console.log(`📊 Found ${progress.totalAvailable.toLocaleString()} total creators in Comic Vine`);
            console.log(`🎯 Processing ${maxToProcess.toLocaleString()} creators starting from offset ${startOffset}`);
            const batchSize = 100;
            const endOffset = Math.min(startOffset + maxToProcess, progress.totalAvailable);
            for (let offset = startOffset; offset < endOffset; offset += batchSize) {
                try {
                    console.log(`\n📦 Fetching creators ${offset}-${offset + batchSize}...`);
                    const batch = await this.fetchCreators(batchSize, offset);
                    const creators = batch.results;
                    // Transform to priced assets
                    const pricedAssets = [];
                    for (const creator of creators) {
                        try {
                            const asset = await this.transformCreator(creator);
                            pricedAssets.push(asset);
                        }
                        catch (error) {
                            console.error(`❌ Error transforming creator ${creator.name}:`, error);
                            progress.errors++;
                        }
                    }
                    // Insert batch
                    if (pricedAssets.length > 0) {
                        const result = await assetInsertionService_1.assetInsertionService.insertPricedAssets(pricedAssets, 100);
                        progress.inserted += result.inserted;
                        progress.skipped += result.skipped;
                        progress.errors += result.errors;
                    }
                    progress.processed += creators.length;
                    progress.lastOffset = offset;
                    console.log(`✅ Progress: ${progress.processed}/${Math.min(maxToProcess, progress.totalAvailable)} | Inserted: ${progress.inserted} | Skipped: ${progress.skipped} | Errors: ${progress.errors}`);
                    if (onProgress) {
                        onProgress(progress);
                    }
                    // Rate limiting
                    await this.sleep(this.rateLimit);
                }
                catch (error) {
                    console.error(`❌ Error processing batch at offset ${offset}:`, error);
                    progress.errors += batchSize;
                    await this.sleep(60000);
                }
            }
            progress.isComplete = progress.lastOffset + batchSize >= endOffset;
            console.log(`\n🏁 Creator expansion complete!`);
            console.log(`   Total Processed: ${progress.processed}`);
            console.log(`   Inserted: ${progress.inserted}`);
            console.log(`   Skipped: ${progress.skipped}`);
            console.log(`   Errors: ${progress.errors}`);
        }
        catch (error) {
            console.error('❌ Fatal error in creator expansion:', error);
            throw error;
        }
        return progress;
    }
}
exports.ComicVineExpansionService = ComicVineExpansionService;
exports.comicVineExpansionService = new ComicVineExpansionService();
