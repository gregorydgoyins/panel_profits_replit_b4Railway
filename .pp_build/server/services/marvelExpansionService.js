"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marvelExpansionService = exports.MarvelExpansionService = void 0;
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const tierClassificationService_1 = require("./tierClassificationService");
const assetInsertionService_1 = require("./assetInsertionService");
const SymbolGeneratorService_1 = require("./SymbolGeneratorService");
const crypto_1 = __importDefault(require("crypto"));
class MarvelExpansionService {
    constructor() {
        this.baseUrl = 'https://gateway.marvel.com/v1/public';
        this.rateLimit = 1000; // 1 second between requests (safe for 3000/day limit)
        this.maxRetries = 3;
        this.publicKey = process.env.MARVEL_API_PUBLIC_KEY || '';
        this.privateKey = process.env.MARVEL_API_PRIVATE_KEY || '';
        if (!this.publicKey || !this.privateKey) {
            console.warn('⚠️ Marvel API keys not set - expansion will not work');
        }
    }
    /**
     * Generate MD5 hash for Marvel API authentication
     * Format: md5(timestamp + privateKey + publicKey)
     */
    generateAuthHash(timestamp) {
        const hashInput = timestamp + this.privateKey + this.publicKey;
        return crypto_1.default.createHash('md5').update(hashInput).digest('hex');
    }
    /**
     * Build authenticated API URL
     */
    buildAuthUrl(endpoint, params = {}) {
        const timestamp = Date.now().toString();
        const hash = this.generateAuthHash(timestamp);
        const queryParams = new URLSearchParams({
            ts: timestamp,
            apikey: this.publicKey,
            hash: hash,
            ...params
        });
        return `${this.baseUrl}/${endpoint}?${queryParams}`;
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
        const url = this.buildAuthUrl(endpoint, params);
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'PanelProfits/1.0',
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                if (response.status === 429 && retryCount < this.maxRetries) {
                    // Rate limited - wait and retry
                    const waitTime = Math.pow(2, retryCount) * 2000; // Exponential backoff
                    console.warn(`⚠️ Rate limited, waiting ${waitTime}ms before retry ${retryCount + 1}/${this.maxRetries}`);
                    await this.sleep(waitTime);
                    return this.makeRequest(endpoint, params, retryCount + 1);
                }
                const errorText = await response.text();
                throw new Error(`Marvel API error ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            if (data.code !== 200) {
                throw new Error(`Marvel API returned error code ${data.code}: ${data.status}`);
            }
            // Rate limit: wait before next request
            await this.sleep(this.rateLimit);
            return data;
        }
        catch (error) {
            if (retryCount < this.maxRetries) {
                console.warn(`⚠️ Request failed, retry ${retryCount + 1}/${this.maxRetries}:`, error.message);
                await this.sleep(Math.pow(2, retryCount) * 1000);
                return this.makeRequest(endpoint, params, retryCount + 1);
            }
            throw error;
        }
    }
    /**
     * Fetch characters from Marvel API
     */
    async fetchCharacters(limit = 100, offset = 0) {
        return this.makeRequest('characters', {
            limit: Math.min(limit, 100), // Marvel max is 100 per request
            offset,
            orderBy: 'name'
        });
    }
    /**
     * Fetch comics from Marvel API
     */
    async fetchComics(limit = 100, offset = 0) {
        return this.makeRequest('comics', {
            limit: Math.min(limit, 100),
            offset,
            orderBy: 'title'
        });
    }
    /**
     * Fetch creators from Marvel API
     */
    async fetchCreators(limit = 100, offset = 0) {
        return this.makeRequest('creators', {
            limit: Math.min(limit, 100),
            offset,
            orderBy: 'lastName'
        });
    }
    /**
     * Generate deterministic symbol from Marvel entity
     */
    generateSymbol(name, variant, marvelId) {
        const normalized = name.trim().toUpperCase();
        const variantPart = variant ? `_${variant.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')}` : '';
        const input = `${normalized}${variantPart}_MARVEL_${marvelId}`;
        const hash = crypto_1.default.createHash('sha256').update(input).digest('hex');
        const hashNum = BigInt('0x' + hash.slice(0, 16));
        const base36 = (hashNum % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
        return `M.${base36}`;
    }
    /**
     * Transform Marvel character into tradeable asset
     */
    async transformCharacter(character) {
        const name = character.name;
        const symbol = this.generateSymbol(name, null, character.id);
        // Classify tier based on appearance count
        const appearanceCount = character.comics.available + character.stories.available;
        const classification = tierClassificationService_1.tierClassificationService.classifyCharacter({
            name,
            appearances: appearanceCount,
            publisher: 'Marvel'
        });
        const tier = classification.tier;
        // Build image URL
        const imageUrl = character.thumbnail && character.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
            ? `${character.thumbnail.path}.${character.thumbnail.extension}`
            : undefined;
        // Determine era from modified date
        const debutYear = new Date(character.modified).getFullYear();
        const era = debutYear <= 1955 ? 'golden' :
            debutYear <= 1970 ? 'silver' :
                debutYear <= 1985 ? 'bronze' : 'modern';
        // Generate pricing using unified engine
        const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
            assetType: 'character',
            name,
            era,
            franchiseTier: tier,
            keyAppearances: appearanceCount
        });
        const pricing = {
            currentPrice: pricingResult.sharePrice,
            totalMarketValue: pricingResult.totalMarketValue,
            totalFloat: pricingResult.totalFloat,
            source: 'marvel',
            lastUpdated: new Date().toISOString(),
            breakdown: pricingResult.breakdown
        };
        return {
            type: 'character',
            name,
            symbol,
            category: 'Marvel Character',
            description: character.description || `Marvel character ${name}`,
            imageUrl,
            tier,
            pricing,
            metadata: {
                source: 'marvel',
                marvelId: character.id,
                resourceURI: character.resourceURI,
                comics: character.comics.available,
                series: character.series.available,
                stories: character.stories.available,
                events: character.events.available,
                modified: character.modified,
                urls: character.urls
            }
        };
    }
    /**
     * Transform Marvel comic into tradeable asset
     */
    async transformComic(comic) {
        const name = comic.title;
        const variant = comic.variantDescription || null;
        // Extract year from dates
        const onsaleDate = comic.dates.find(d => d.type === 'onsaleDate');
        const debutYear = onsaleDate ? new Date(onsaleDate.date).getFullYear() : new Date().getFullYear();
        // Generate symbol using centralized service with new nomenclature
        // Format: TICKR.V#.#ISSUE (e.g., ASM.V1.#300)
        const symbol = SymbolGeneratorService_1.symbolGeneratorService.generateComicSymbol(name, {
            year: debutYear,
            publisher: 'Marvel'
        });
        // Determine era from debut year
        const era = debutYear <= 1955 ? 'golden' :
            debutYear <= 1970 ? 'silver' :
                debutYear <= 1985 ? 'bronze' : 'modern';
        // Simple tier assignment based on format and creators (1-4)
        const tier = (comic.format === 'Comic' && comic.creators.available > 3) ? 1 :
            (comic.creators.available > 2) ? 2 :
                (comic.creators.available > 0) ? 3 : 4;
        const imageUrl = comic.thumbnail && comic.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
            ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
            : undefined;
        const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
            assetType: 'comic',
            name,
            era,
            franchiseTier: tier,
            isVariant: !!variant,
            variantOf: variant ? name : undefined
        });
        const pricing = {
            currentPrice: pricingResult.sharePrice,
            totalMarketValue: pricingResult.totalMarketValue,
            totalFloat: pricingResult.totalFloat,
            source: 'marvel',
            lastUpdated: new Date().toISOString(),
            breakdown: pricingResult.breakdown
        };
        return {
            type: 'comic',
            name,
            baseName: name,
            variant,
            symbol,
            category: 'Marvel Comic',
            description: comic.description || `${name} #${comic.issueNumber}`,
            imageUrl,
            coverImageUrl: imageUrl,
            tier,
            pricing,
            metadata: {
                source: 'marvel',
                marvelId: comic.id,
                digitalId: comic.digitalId,
                issueNumber: comic.issueNumber,
                variantDescription: comic.variantDescription,
                isbn: comic.isbn,
                upc: comic.upc,
                format: comic.format,
                pageCount: comic.pageCount,
                series: comic.series.name,
                dates: comic.dates,
                prices: comic.prices,
                creators: comic.creators.items,
                characters: comic.characters.items,
                modified: comic.modified
            }
        };
    }
    /**
     * Transform Marvel creator into tradeable asset
     */
    async transformCreator(creator) {
        const name = creator.fullName;
        const symbol = this.generateSymbol(name, null, creator.id);
        // Classify tier based on work count
        const workCount = creator.comics.available + creator.series.available;
        const classification = tierClassificationService_1.tierClassificationService.classifyCreator({
            name
        });
        const tier = classification.tier;
        const imageUrl = creator.thumbnail && creator.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
            ? `${creator.thumbnail.path}.${creator.thumbnail.extension}`
            : undefined;
        const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
            assetType: 'creator',
            name,
            era: 'modern', // Default to modern for creators
            creatorTier: tier,
            roleWeightedAppearances: classification.roleWeightedAppearances
        });
        const pricing = {
            currentPrice: pricingResult.sharePrice,
            totalMarketValue: pricingResult.totalMarketValue,
            totalFloat: pricingResult.totalFloat,
            source: 'marvel',
            lastUpdated: new Date().toISOString(),
            breakdown: pricingResult.breakdown
        };
        return {
            type: 'creator',
            name,
            symbol,
            category: 'Marvel Creator',
            description: `Marvel creator - ${name}`,
            imageUrl,
            tier,
            pricing,
            metadata: {
                source: 'marvel',
                marvelId: creator.id,
                firstName: creator.firstName,
                middleName: creator.middleName,
                lastName: creator.lastName,
                suffix: creator.suffix,
                resourceURI: creator.resourceURI,
                comics: creator.comics.available,
                series: creator.series.available,
                stories: creator.stories.available,
                events: creator.events.available,
                modified: creator.modified,
                urls: creator.urls
            }
        };
    }
    /**
     * Expand Marvel characters into tradeable assets
     */
    async expandCharacters(startOffset = 0, maxToProcess = 1000) {
        const progress = {
            resourceType: 'characters',
            totalAvailable: 0,
            processed: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
            startTime: new Date().toISOString(),
            lastOffset: startOffset,
            isComplete: false,
            rate: 0
        };
        const startTime = Date.now();
        try {
            // Fetch first batch to get total count
            const firstBatch = await this.fetchCharacters(100, startOffset);
            progress.totalAvailable = firstBatch.data.total;
            console.log(`\n🦸 Marvel Character Expansion Started`);
            console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);
            console.log(`   Starting Offset: ${startOffset}`);
            console.log(`   Max To Process: ${maxToProcess}`);
            let currentOffset = startOffset;
            let processedCount = 0;
            while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
                const batch = currentOffset === startOffset
                    ? firstBatch
                    : await this.fetchCharacters(100, currentOffset);
                if (batch.data.results.length === 0) {
                    break;
                }
                // Transform to assets
                const assets = [];
                for (const character of batch.data.results) {
                    try {
                        const asset = await this.transformCharacter(character);
                        assets.push(asset);
                        progress.processed++;
                    }
                    catch (error) {
                        console.error(`❌ Error transforming character ${character.name}:`, error.message);
                        progress.errors++;
                    }
                }
                // Bulk insert
                if (assets.length > 0) {
                    const result = await assetInsertionService_1.assetInsertionService.insertPricedAssets(assets);
                    progress.inserted += result.inserted;
                    progress.skipped += result.skipped;
                    progress.errors += result.errors;
                }
                currentOffset += batch.data.count;
                progress.lastOffset = currentOffset;
                processedCount += batch.data.count;
                const elapsed = (Date.now() - startTime) / 1000;
                progress.rate = progress.processed / elapsed;
                console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);
                if (processedCount >= maxToProcess) {
                    break;
                }
            }
            progress.isComplete = currentOffset >= progress.totalAvailable;
            const totalTime = (Date.now() - startTime) / 1000;
            console.log(`\n✅ Marvel Character Expansion Complete`);
            console.log(`   Processed: ${progress.processed.toLocaleString()}`);
            console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
            console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
            console.log(`   Errors: ${progress.errors}`);
            console.log(`   Time: ${totalTime.toFixed(1)}s`);
            console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);
            return progress;
        }
        catch (error) {
            console.error('❌ Marvel character expansion failed:', error);
            throw error;
        }
    }
    /**
     * Expand Marvel comics into tradeable assets
     */
    async expandComics(startOffset = 0, maxToProcess = 1000) {
        const progress = {
            resourceType: 'comics',
            totalAvailable: 0,
            processed: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
            startTime: new Date().toISOString(),
            lastOffset: startOffset,
            isComplete: false,
            rate: 0
        };
        const startTime = Date.now();
        try {
            const firstBatch = await this.fetchComics(100, startOffset);
            progress.totalAvailable = firstBatch.data.total;
            console.log(`\n📚 Marvel Comic Expansion Started`);
            console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);
            console.log(`   Starting Offset: ${startOffset}`);
            console.log(`   Max To Process: ${maxToProcess}`);
            let currentOffset = startOffset;
            let processedCount = 0;
            while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
                const batch = currentOffset === startOffset
                    ? firstBatch
                    : await this.fetchComics(100, currentOffset);
                if (batch.data.results.length === 0) {
                    break;
                }
                const assets = [];
                for (const comic of batch.data.results) {
                    try {
                        const asset = await this.transformComic(comic);
                        assets.push(asset);
                        progress.processed++;
                    }
                    catch (error) {
                        console.error(`❌ Error transforming comic ${comic.title}:`, error.message);
                        progress.errors++;
                    }
                }
                if (assets.length > 0) {
                    const result = await assetInsertionService_1.assetInsertionService.insertPricedAssets(assets);
                    progress.inserted += result.inserted;
                    progress.skipped += result.skipped;
                    progress.errors += result.errors;
                }
                currentOffset += batch.data.count;
                progress.lastOffset = currentOffset;
                processedCount += batch.data.count;
                const elapsed = (Date.now() - startTime) / 1000;
                progress.rate = progress.processed / elapsed;
                console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);
                if (processedCount >= maxToProcess) {
                    break;
                }
            }
            progress.isComplete = currentOffset >= progress.totalAvailable;
            const totalTime = (Date.now() - startTime) / 1000;
            console.log(`\n✅ Marvel Comic Expansion Complete`);
            console.log(`   Processed: ${progress.processed.toLocaleString()}`);
            console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
            console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
            console.log(`   Errors: ${progress.errors}`);
            console.log(`   Time: ${totalTime.toFixed(1)}s`);
            console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);
            return progress;
        }
        catch (error) {
            console.error('❌ Marvel comic expansion failed:', error);
            throw error;
        }
    }
    /**
     * Expand Marvel creators into tradeable assets
     */
    async expandCreators(startOffset = 0, maxToProcess = 1000) {
        const progress = {
            resourceType: 'creators',
            totalAvailable: 0,
            processed: 0,
            inserted: 0,
            skipped: 0,
            errors: 0,
            startTime: new Date().toISOString(),
            lastOffset: startOffset,
            isComplete: false,
            rate: 0
        };
        const startTime = Date.now();
        try {
            const firstBatch = await this.fetchCreators(100, startOffset);
            progress.totalAvailable = firstBatch.data.total;
            console.log(`\n✍️ Marvel Creator Expansion Started`);
            console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);
            console.log(`   Starting Offset: ${startOffset}`);
            console.log(`   Max To Process: ${maxToProcess}`);
            let currentOffset = startOffset;
            let processedCount = 0;
            while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
                const batch = currentOffset === startOffset
                    ? firstBatch
                    : await this.fetchCreators(100, currentOffset);
                if (batch.data.results.length === 0) {
                    break;
                }
                const assets = [];
                for (const creator of batch.data.results) {
                    try {
                        const asset = await this.transformCreator(creator);
                        assets.push(asset);
                        progress.processed++;
                    }
                    catch (error) {
                        console.error(`❌ Error transforming creator ${creator.fullName}:`, error.message);
                        progress.errors++;
                    }
                }
                if (assets.length > 0) {
                    const result = await assetInsertionService_1.assetInsertionService.insertPricedAssets(assets);
                    progress.inserted += result.inserted;
                    progress.skipped += result.skipped;
                    progress.errors += result.errors;
                }
                currentOffset += batch.data.count;
                progress.lastOffset = currentOffset;
                processedCount += batch.data.count;
                const elapsed = (Date.now() - startTime) / 1000;
                progress.rate = progress.processed / elapsed;
                console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);
                if (processedCount >= maxToProcess) {
                    break;
                }
            }
            progress.isComplete = currentOffset >= progress.totalAvailable;
            const totalTime = (Date.now() - startTime) / 1000;
            console.log(`\n✅ Marvel Creator Expansion Complete`);
            console.log(`   Processed: ${progress.processed.toLocaleString()}`);
            console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
            console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
            console.log(`   Errors: ${progress.errors}`);
            console.log(`   Time: ${totalTime.toFixed(1)}s`);
            console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);
            return progress;
        }
        catch (error) {
            console.error('❌ Marvel creator expansion failed:', error);
            throw error;
        }
    }
}
exports.MarvelExpansionService = MarvelExpansionService;
// Export singleton instance
exports.marvelExpansionService = new MarvelExpansionService();
