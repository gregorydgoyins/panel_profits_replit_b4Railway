"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pineconeAssetExpansion = exports.PineconeAssetExpansionService = void 0;
const pineconeService_1 = require("./pineconeService");
const openaiService_1 = require("./openaiService");
const unifiedPricingEngine_1 = require("./unifiedPricingEngine");
const tierClassificationService_1 = require("./tierClassificationService");
const crypto_1 = __importDefault(require("crypto"));
class PineconeAssetExpansionService {
    /**
     * Helper function to add delay for rate limiting
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Parse metadata from Pinecone description to extract pricing inputs
     * Looks for appearance counts, franchise indicators, etc.
     */
    parseMetadata(description) {
        // Default values
        let appearances = 50;
        let keyAppearances = 10;
        let franchiseTier = 2;
        if (!description)
            return { appearances, keyAppearances, franchiseTier };
        // Extract appearance counts from description
        const appearanceMatch = description.match(/(\d+)\s*appearance/i);
        if (appearanceMatch) {
            appearances = parseInt(appearanceMatch[1], 10);
            keyAppearances = Math.floor(appearances * 0.2); // Assume 20% are key
        }
        // Look for franchise indicators
        if (/(flagship|main|original|first|primary)/i.test(description)) {
            franchiseTier = 1;
        }
        else if (/(variant|alternate|incarnation|version)/i.test(description)) {
            franchiseTier = 2;
        }
        return { appearances, keyAppearances, franchiseTier };
    }
    /**
     * Determine era from character/comic name and metadata
     * Golden: 1938-1956, Silver: 1956-1970, Bronze: 1970-1985, Modern: 1985+
     */
    determineEra(name, metadata) {
        // Check for era indicators in name
        if (/(golden age|1940s|1950s)/i.test(name))
            return 'golden';
        if (/(silver age|1960s)/i.test(name))
            return 'silver';
        if (/(bronze age|1970s|1980s)/i.test(name))
            return 'bronze';
        if (/(modern|2000s|2010s)/i.test(name))
            return 'modern';
        // Default to silver age for Marvel characters (most Pinecone data is silver/bronze era)
        return 'silver';
    }
    /**
     * Enrich asset with mathematical pricing using unified pricing engine
     * No API calls - pure mathematical formula based on metadata
     */
    async enrichAssetWithPricing(asset) {
        try {
            if (asset.type === 'character') {
                const characterName = asset.baseName || asset.name;
                const parsedMeta = this.parseMetadata(asset.metadata?.description);
                const era = this.determineEra(asset.name, asset.metadata);
                // Classify tier using tier classification service
                const classification = tierClassificationService_1.tierClassificationService.classifyCharacter({
                    name: characterName,
                    publisher: asset.metadata?.publisher,
                    appearances: parsedMeta.appearances,
                    isVariant: !!asset.variant
                });
                const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                    assetType: 'character',
                    name: characterName,
                    era,
                    keyAppearances: parsedMeta.keyAppearances,
                    franchiseTier: classification.tier,
                    isVariant: classification.isVariant
                });
                return {
                    ...asset,
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
            else if (asset.type === 'creator') {
                const parsedMeta = this.parseMetadata(asset.metadata?.description);
                // Classify tier using tier classification service (includes role weighting)
                const classification = tierClassificationService_1.tierClassificationService.classifyCreator({
                    name: asset.name,
                    appearances: parsedMeta.appearances
                });
                const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                    assetType: 'creator',
                    name: asset.name,
                    era: 'silver',
                    roleWeightedAppearances: classification.roleWeightedAppearances,
                    creatorTier: classification.tier
                });
                return {
                    ...asset,
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
            else if (asset.type === 'comic') {
                const era = this.determineEra(asset.name, asset.metadata);
                const parsedMeta = this.parseMetadata(asset.metadata?.description);
                const pricingResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                    assetType: 'comic',
                    name: asset.name,
                    era,
                    keyAppearances: parsedMeta.keyAppearances,
                    franchiseTier: parsedMeta.franchiseTier
                });
                return {
                    ...asset,
                    pricing: {
                        currentPrice: pricingResult.sharePrice,
                        totalMarketValue: pricingResult.totalMarketValue,
                        totalFloat: pricingResult.totalFloat,
                        source: 'mathematical',
                        lastUpdated: new Date().toISOString(),
                        breakdown: pricingResult.breakdown
                    }
                };
            }
            return asset;
        }
        catch (error) {
            console.warn(`⚠️ Failed to price ${asset.type} "${asset.name}":`, error instanceof Error ? error.message : 'Unknown error');
            // Fallback to default tier 2 pricing
            const fallbackResult = unifiedPricingEngine_1.unifiedPricingEngine.calculatePrice({
                assetType: asset.type === 'creator' ? 'creator' : 'character',
                name: asset.name,
                era: 'silver',
                keyAppearances: 10,
                franchiseTier: asset.type === 'creator' ? undefined : 2,
                creatorTier: asset.type === 'creator' ? 2 : undefined,
                roleWeightedAppearances: asset.type === 'creator' ? 50 : undefined
            });
            return {
                ...asset,
                pricing: {
                    currentPrice: fallbackResult.sharePrice,
                    totalMarketValue: fallbackResult.totalMarketValue,
                    totalFloat: fallbackResult.totalFloat,
                    source: 'mathematical_fallback',
                    lastUpdated: new Date().toISOString()
                }
            };
        }
    }
    /**
     * Fetch all records from Pinecone by category
     * Uses multiple search strategies to get diverse results
     */
    async fetchRecordsByCategory(category, limit = 1000) {
        try {
            // Use multiple queries per category for better diversity
            const queries = {
                Characters: [
                    "Marvel superhero character Spider-Man Batman",
                    "DC character powers abilities origin story",
                    "comic book hero villain mutant team",
                    "X-Men Avengers Justice League character profile"
                ],
                Creators: [
                    "comic book artist writer Stan Lee Jack Kirby",
                    "penciler inker colorist letterer creator",
                    "Marvel DC artist illustrator author",
                    "comic book creator biography portfolio"
                ],
                Comics: [
                    "comic book issue #1 Amazing Spider-Man",
                    "Detective Comics Action Comics series",
                    "Marvel comic book publication volume",
                    "X-Men comic issue story arc event"
                ]
            };
            const allResults = [];
            const seenIds = new Set();
            // Run multiple queries to get diverse results
            for (const query of queries[category]) {
                const embedding = await openaiService_1.openaiService.generateEmbedding(query);
                if (!embedding) {
                    console.warn(`⚠️ Failed to generate embedding for query: "${query.substring(0, 50)}..."`);
                    continue;
                }
                const results = await pineconeService_1.pineconeService.querySimilar(embedding, Math.ceil(limit / queries[category].length));
                if (!results)
                    continue;
                // Filter and deduplicate
                for (const match of results) {
                    if (seenIds.has(match.id))
                        continue;
                    // Check if it matches our category
                    const matchesCategory = (category === 'Characters' && match.metadata?.category === 'Characters') ||
                        (category === 'Creators' && match.metadata?.category === 'Creators') ||
                        (category === 'Comics' && (match.metadata?.type === 'comics' || match.id.startsWith('comics_')));
                    if (matchesCategory) {
                        allResults.push({
                            id: match.id,
                            metadata: match.metadata || {}
                        });
                        seenIds.add(match.id);
                    }
                }
            }
            console.log(`✅ Fetched ${allResults.length} ${category} records from Pinecone`);
            return allResults.slice(0, limit);
        }
        catch (error) {
            console.error(`❌ Error fetching ${category} records:`, error);
            return [];
        }
    }
    /**
     * Sample diverse records across all categories
     */
    async sampleDiverseRecords(samplesPerCategory = 100) {
        console.log('🔍 Sampling diverse records from Pinecone...');
        const [characters, creators, comics] = await Promise.all([
            this.fetchRecordsByCategory('Characters', samplesPerCategory),
            this.fetchRecordsByCategory('Creators', samplesPerCategory),
            this.fetchRecordsByCategory('Comics', samplesPerCategory)
        ]);
        return { characters, creators, comics };
    }
    /**
     * Extract character name from filename
     */
    extractCharacterName(filename) {
        return filename.replace('.md', '').replace(/_/g, ' ');
    }
    /**
     * Parse character incarnation details
     * Example: "Captain America (House of M)" → { base: "Captain America", variant: "House of M" }
     */
    parseCharacterIncarnation(name) {
        const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);
        if (match) {
            return {
                baseName: match[1].trim(),
                variant: match[2].trim(),
                fullName: name
            };
        }
        return {
            baseName: name,
            variant: null,
            fullName: name
        };
    }
    /**
     * Extract creator name from filename
     */
    extractCreatorName(filename) {
        return filename.replace('.md', '').replace(/_/g, ' ');
    }
    /**
     * Generate asset symbol from name
     * For variants, includes variant suffix: "CAP.HOM" for "Captain America (House of M)"
     * Adds deterministic hash suffix to prevent collisions while maintaining idempotency
     * Uses crypto hash for strong collision resistance at scale
     */
    generateAssetSymbol(name, variant, pineconeId) {
        // Parse base name and variant if not provided
        const parsed = variant !== undefined ?
            { baseName: name, variant } :
            this.parseCharacterIncarnation(name);
        // Generate base symbol from first letters
        const words = parsed.baseName.split(' ').filter(w => w.length > 0);
        let baseSymbol = words
            .map(w => w[0].toUpperCase())
            .join('')
            .substring(0, 5);
        // If variant exists, add variant suffix
        if (parsed.variant) {
            const variantWords = parsed.variant.split(' ').filter(w => w.length > 0);
            const variantSuffix = variantWords
                .map(w => w[0].toUpperCase())
                .join('')
                .substring(0, 3);
            baseSymbol = `${baseSymbol}.${variantSuffix}`;
        }
        // Add deterministic crypto hash suffix for strong collision resistance
        // Uses SHA-256 with fixed 11-char base-36 suffix (36^11 ≈ 131 quadrillion unique values)
        // Input: normalized name + variant + pineconeId for deterministic uniqueness
        const hashInput = `${parsed.baseName.toLowerCase()}|${parsed.variant?.toLowerCase() || ''}|${pineconeId || ''}`;
        const hash = crypto_1.default.createHash('sha256').update(hashInput).digest('hex');
        // Use BigInt to map full hash into 36^11 symbol space (≈56.5 bits for 131Q range)
        // Take first 16 hex chars (64 bits) and reduce modulo 36^11 for uniform distribution
        // Provides <0.01% collision probability at 1M assets, <0.04% at 10M assets
        const hashBigInt = BigInt('0x' + hash.substring(0, 16));
        const symbolSpace = BigInt(36 ** 11); // 131,621,703,842,267,136
        const hashMod = hashBigInt % symbolSpace;
        const hashSuffix = hashMod.toString(36).toUpperCase().padStart(11, '0');
        return `${baseSymbol || 'ASSET'}.${hashSuffix}`;
    }
    /**
     * Transform Pinecone records into asset proposals
     * Now includes pricing enrichment with rate limiting
     */
    async transformRecordsToAssets(records) {
        console.log('🔄 Transforming Pinecone records into tradeable assets...');
        // Transform characters (with incarnation support)
        const characterAssets = records.characters.map(record => {
            const fullName = record.metadata.filename
                ? this.extractCharacterName(record.metadata.filename)
                : record.id;
            const incarnation = this.parseCharacterIncarnation(fullName);
            return {
                type: 'character',
                name: incarnation.fullName,
                baseName: incarnation.baseName,
                variant: incarnation.variant,
                symbol: this.generateAssetSymbol(incarnation.baseName, incarnation.variant, record.id),
                category: 'CHARACTER',
                metadata: {
                    source: 'pinecone',
                    pineconeId: record.id,
                    filepath: record.metadata.filepath,
                    processedDate: record.metadata.processed_date,
                    publisher: record.metadata.publisher || 'Marvel',
                    isIncarnation: !!incarnation.variant,
                    baseCharacter: incarnation.baseName
                }
            };
        });
        // Transform creators
        const creatorAssets = records.creators.map(record => ({
            type: 'creator',
            name: record.metadata.filename
                ? this.extractCreatorName(record.metadata.filename)
                : record.id,
            symbol: record.metadata.filename
                ? this.generateAssetSymbol(this.extractCreatorName(record.metadata.filename), null, record.id)
                : this.generateAssetSymbol(record.id, null, record.id),
            category: 'CREATOR',
            metadata: {
                source: 'pinecone',
                pineconeId: record.id,
                filepath: record.metadata.filepath,
                processedDate: record.metadata.processed_date,
                publisher: record.metadata.publisher
            }
        }));
        // Transform comics
        const comicAssets = records.comics.map(record => ({
            type: 'comic',
            name: record.metadata.name || record.id,
            symbol: record.metadata.name
                ? this.generateAssetSymbol(record.metadata.name, null, record.id)
                : this.generateAssetSymbol(record.id, null, record.id),
            category: 'COMIC',
            metadata: {
                source: 'pinecone',
                pineconeId: record.id,
                description: record.metadata.description,
                publisher: record.metadata.publisher,
                modified: record.metadata.modified,
                issueType: record.metadata.type
            }
        }));
        console.log(`✅ Transformed ${characterAssets.length} characters, ${creatorAssets.length} creators, ${comicAssets.length} comics`);
        // Step 2: Enrich with mathematical pricing (instant - no API calls)
        console.log('💰 Calculating mathematical pricing for assets...');
        const allAssets = [...characterAssets, ...creatorAssets, ...comicAssets];
        // Parallel pricing calculation (no API limits - pure math)
        const enrichedAssets = await Promise.all(allAssets.map(asset => this.enrichAssetWithPricing(asset)));
        const enrichedCharacters = enrichedAssets.filter(a => a.type === 'character');
        const enrichedCreators = enrichedAssets.filter(a => a.type === 'creator');
        const enrichedComics = enrichedAssets.filter(a => a.type === 'comic');
        const mathematicalCount = enrichedAssets.filter(a => a.pricing?.source === 'mathematical').length;
        const fallbackCount = enrichedAssets.filter(a => a.pricing?.source === 'mathematical_fallback').length;
        const avgPrice = enrichedAssets.reduce((sum, a) => sum + (a.pricing?.currentPrice || 0), 0) / enrichedAssets.length;
        console.log(`✅ Pricing calculation complete:`);
        console.log(`   📊 Mathematical prices: ${mathematicalCount} assets`);
        console.log(`   📊 Fallback prices: ${fallbackCount} assets`);
        console.log(`   💵 Average share price: $${avgPrice.toFixed(2)}`);
        return {
            characterAssets: enrichedCharacters,
            creatorAssets: enrichedCreators,
            comicAssets: enrichedComics
        };
    }
    /**
     * Main expansion pipeline: Fetch → Transform → Report
     * Supports batching for massive scale (millions of assets)
     */
    async expandAssetDatabase(samplesPerCategory = 100, options) {
        console.log('🚀 STARTING PINECONE ASSET EXPANSION PIPELINE');
        console.log(`📊 Target: ${samplesPerCategory} samples per category`);
        const batchSize = options?.batchSize || samplesPerCategory;
        const batches = Math.ceil(samplesPerCategory / batchSize);
        try {
            let allAssets = {
                characterAssets: [],
                creatorAssets: [],
                comicAssets: []
            };
            let allRecords = {
                characters: [],
                creators: [],
                comics: []
            };
            // Process in batches for scalability
            for (let i = 0; i < batches; i++) {
                const currentBatchSize = Math.min(batchSize, samplesPerCategory - (i * batchSize));
                console.log(`📦 Processing batch ${i + 1}/${batches} (${currentBatchSize} samples)...`);
                // Step 1: Sample diverse records
                const records = await this.sampleDiverseRecords(currentBatchSize);
                // Step 2: Transform to assets
                const assets = await this.transformRecordsToAssets(records);
                // Accumulate results
                allAssets.characterAssets.push(...assets.characterAssets);
                allAssets.creatorAssets.push(...assets.creatorAssets);
                allAssets.comicAssets.push(...assets.comicAssets);
                allRecords.characters.push(...records.characters);
                allRecords.creators.push(...records.creators);
                allRecords.comics.push(...records.comics);
                const totalSoFar = allAssets.characterAssets.length +
                    allAssets.creatorAssets.length +
                    allAssets.comicAssets.length;
                options?.onBatchComplete?.(i + 1, totalSoFar);
            }
            // Step 3: Report
            const totalAssets = allAssets.characterAssets.length +
                allAssets.creatorAssets.length +
                allAssets.comicAssets.length;
            console.log('📈 EXPANSION PIPELINE COMPLETE');
            console.log(`📦 Total Assets Generated: ${totalAssets}`);
            console.log(`👥 Characters: ${allAssets.characterAssets.length}`);
            console.log(`🎨 Creators: ${allAssets.creatorAssets.length}`);
            console.log(`📚 Comics: ${allAssets.comicAssets.length}`);
            // Defensive check: Warn if no assets were generated
            if (totalAssets === 0) {
                console.warn('⚠️ WARNING: No assets were generated. This may indicate:');
                console.warn('   1. OpenAI embedding service not initialized');
                console.warn('   2. Pinecone query failures');
                console.warn('   3. Category filtering too strict');
            }
            return {
                success: true,
                totalAssets,
                assets: allAssets,
                records: allRecords
            };
        }
        catch (error) {
            console.error('❌ Asset expansion pipeline failed:', error);
            return {
                success: false,
                totalAssets: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * EXHAUSTIVE EXPANSION: Mine ALL 63,934+ Pinecone vectors
     * Uses listPaginated() to fetch every single vector ID, then processes them all
     */
    async expandAllVectorsExhaustively() {
        console.log('🔥 STARTING EXHAUSTIVE PINECONE MINING - ALL 63,934+ VECTORS');
        console.log('⚠️  This will process EVERY vector in Pinecone exhaustively');
        try {
            // Step 1: Fetch ALL vectors with metadata
            const allVectors = await pineconeService_1.pineconeService.fetchAllVectorsExhaustively();
            if (allVectors.length === 0) {
                console.error('❌ No vectors returned from Pinecone');
                return {
                    success: false,
                    totalAssets: 0,
                    error: 'No vectors found'
                };
            }
            console.log(`📦 Retrieved ${allVectors.length} vectors from Pinecone`);
            // Debug: Log sample metadata to understand structure
            if (allVectors.length > 0) {
                console.log('🔍 Sample vector metadata:', JSON.stringify(allVectors[0].metadata, null, 2));
                console.log('🔍 Sample vector ID:', allVectors[0].id);
            }
            // Step 2: Separate by category using ID prefixes
            const characters = [];
            const creators = [];
            const comics = [];
            for (const vector of allVectors) {
                const id = vector.id || '';
                const metadata = vector.metadata || {};
                // Use ID prefixes to categorize (characters_, creators_, comics_, stories_)
                if (id.startsWith('characters_')) {
                    characters.push({ id: vector.id, metadata: vector.metadata });
                }
                else if (id.startsWith('creators_')) {
                    creators.push({ id: vector.id, metadata: vector.metadata });
                }
                else if (id.startsWith('comics_') || id.startsWith('stories_')) {
                    comics.push({ id: vector.id, metadata: vector.metadata });
                }
            }
            console.log(`📊 Categorized vectors:`);
            console.log(`   👥 Characters: ${characters.length}`);
            console.log(`   🎨 Creators: ${creators.length}`);
            console.log(`   📚 Comics: ${comics.length}`);
            // Step 3: Transform to tradeable assets
            console.log('🔄 Transforming vectors into tradeable assets...');
            const assets = await this.transformRecordsToAssets({
                characters,
                creators,
                comics
            });
            // Step 4: Calculate pricing for all assets
            console.log('💰 Calculating mathematical pricing for assets...');
            const enrichedCharacters = await Promise.all(assets.characterAssets.map(asset => this.enrichAssetWithPricing(asset)));
            const enrichedCreators = await Promise.all(assets.creatorAssets.map(asset => this.enrichAssetWithPricing(asset)));
            const enrichedComics = await Promise.all(assets.comicAssets.map(asset => this.enrichAssetWithPricing(asset)));
            const totalAssets = enrichedCharacters.length + enrichedCreators.length + enrichedComics.length;
            const priced = enrichedCharacters.concat(enrichedCreators, enrichedComics).filter(a => a.pricing);
            const fallback = totalAssets - priced.length;
            console.log('✅ Pricing calculation complete:');
            console.log(`   📊 Mathematical prices: ${priced.length} assets`);
            console.log(`   📊 Fallback prices: ${fallback} assets`);
            if (priced.length > 0) {
                const avgPrice = priced.reduce((sum, a) => sum + a.pricing.currentPrice, 0) / priced.length;
                console.log(`   💵 Average share price: $${avgPrice.toFixed(2)}`);
            }
            console.log('📈 EXHAUSTIVE EXPANSION COMPLETE');
            console.log(`📦 Total Assets Generated: ${totalAssets}`);
            console.log(`👥 Characters: ${enrichedCharacters.length}`);
            console.log(`🎨 Creators: ${enrichedCreators.length}`);
            console.log(`📚 Comics: ${enrichedComics.length}`);
            return {
                success: true,
                totalAssets,
                assets: {
                    characterAssets: enrichedCharacters,
                    creatorAssets: enrichedCreators,
                    comicAssets: enrichedComics
                },
                records: {
                    characters,
                    creators,
                    comics
                }
            };
        }
        catch (error) {
            console.error('❌ Exhaustive expansion failed:', error);
            return {
                success: false,
                totalAssets: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
exports.PineconeAssetExpansionService = PineconeAssetExpansionService;
exports.pineconeAssetExpansion = new PineconeAssetExpansionService();
