"use strict";
/**
 * Panel Profits - Batched Asset Fetcher
 * Scales API calls to 10,000+ assets with rate limiting and deduplication
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchedAssetFetcher = exports.BatchedAssetFetcher = void 0;
const assetGenerator_js_1 = require("./assetGenerator.js");
class BatchedAssetFetcher {
    constructor() {
        this.seenNames = new Set();
        this.stats = {
            totalFetched: 0,
            duplicates: 0,
            errors: 0,
            apiCalls: 0
        };
    }
    /**
     * Rate limiter to prevent API throttling
     */
    async rateLimit(delayMs = 1000) {
        return new Promise(resolve => setTimeout(resolve, delayMs));
    }
    /**
     * Deduplicate assets by name (case-insensitive)
     */
    isDuplicate(name) {
        const normalized = name.toLowerCase().trim();
        if (this.seenNames.has(normalized)) {
            this.stats.duplicates++;
            return true;
        }
        this.seenNames.add(normalized);
        return false;
    }
    /**
     * Fetch Comic Vine characters in batches
     */
    async fetchComicVineCharactersBatched(targetCount, batchSize = 100) {
        const results = [];
        let offset = 0;
        const maxOffset = 10000; // Comic Vine API limit
        console.log(`📚 Fetching up to ${targetCount} Comic Vine characters in batches of ${batchSize}...`);
        while (results.length < targetCount && offset < maxOffset) {
            try {
                this.stats.apiCalls++;
                const batch = await assetGenerator_js_1.assetGenerator['fetchComicVineCharacters'](batchSize, offset);
                // Deduplicate
                const unique = batch.filter(asset => !this.isDuplicate(asset.name));
                results.push(...unique);
                console.log(`  Fetched ${batch.length}, unique: ${unique.length}, total: ${results.length}`);
                offset += batchSize;
                if (batch.length < batchSize)
                    break; // No more results
                // Rate limit
                await this.rateLimit(1100); // Comic Vine: 1 request per second
            }
            catch (error) {
                console.error(`Error fetching batch at offset ${offset}:`, error);
                this.stats.errors++;
                await this.rateLimit(3000); // Longer delay on error
            }
        }
        this.stats.totalFetched += results.length;
        return results;
    }
    /**
     * Fetch Comic Vine teams in batches
     */
    async fetchComicVineTeamsBatched(targetCount, batchSize = 100) {
        const results = [];
        let offset = 0;
        const maxOffset = 5000;
        console.log(`👥 Fetching up to ${targetCount} Comic Vine teams in batches of ${batchSize}...`);
        while (results.length < targetCount && offset < maxOffset) {
            try {
                this.stats.apiCalls++;
                const batch = await assetGenerator_js_1.assetGenerator['fetchComicVineTeams'](batchSize, offset);
                const unique = batch.filter(asset => !this.isDuplicate(asset.name));
                results.push(...unique);
                console.log(`  Fetched ${batch.length}, unique: ${unique.length}, total: ${results.length}`);
                offset += batchSize;
                if (batch.length < batchSize)
                    break;
                await this.rateLimit(1100);
            }
            catch (error) {
                console.error(`Error fetching teams at offset ${offset}:`, error);
                this.stats.errors++;
                await this.rateLimit(3000);
            }
        }
        this.stats.totalFetched += results.length;
        return results;
    }
    /**
     * Fetch Comic Vine locations in batches
     */
    async fetchComicVineLocationsBatched(targetCount, batchSize = 100) {
        const results = [];
        let offset = 0;
        const maxOffset = 5000;
        console.log(`🌍 Fetching up to ${targetCount} Comic Vine locations in batches of ${batchSize}...`);
        while (results.length < targetCount && offset < maxOffset) {
            try {
                this.stats.apiCalls++;
                const batch = await assetGenerator_js_1.assetGenerator['fetchComicVineLocations'](batchSize, offset);
                const unique = batch.filter(asset => !this.isDuplicate(asset.name));
                results.push(...unique);
                console.log(`  Fetched ${batch.length}, unique: ${unique.length}, total: ${results.length}`);
                offset += batchSize;
                if (batch.length < batchSize)
                    break;
                await this.rateLimit(1100);
            }
            catch (error) {
                console.error(`Error fetching locations at offset ${offset}:`, error);
                this.stats.errors++;
                await this.rateLimit(3000);
            }
        }
        this.stats.totalFetched += results.length;
        return results;
    }
    /**
     * Fetch Comic Vine objects in batches
     */
    async fetchComicVineObjectsBatched(targetCount, batchSize = 100) {
        const results = [];
        let offset = 0;
        const maxOffset = 5000;
        console.log(`🔧 Fetching up to ${targetCount} Comic Vine objects in batches of ${batchSize}...`);
        while (results.length < targetCount && offset < maxOffset) {
            try {
                this.stats.apiCalls++;
                const batch = await assetGenerator_js_1.assetGenerator['fetchComicVineObjects'](batchSize, offset);
                const unique = batch.filter(asset => !this.isDuplicate(asset.name));
                results.push(...unique);
                console.log(`  Fetched ${batch.length}, unique: ${unique.length}, total: ${results.length}`);
                offset += batchSize;
                if (batch.length < batchSize)
                    break;
                await this.rateLimit(1100);
            }
            catch (error) {
                console.error(`Error fetching objects at offset ${offset}:`, error);
                this.stats.errors++;
                await this.rateLimit(3000);
            }
        }
        this.stats.totalFetched += results.length;
        return results;
    }
    /**
     * Fetch Comic Vine creators in batches
     */
    async fetchComicVineCreatorsBatched(targetCount, batchSize = 100) {
        const results = [];
        let offset = 0;
        const maxOffset = 5000;
        console.log(`✍️ Fetching up to ${targetCount} Comic Vine creators in batches of ${batchSize}...`);
        while (results.length < targetCount && offset < maxOffset) {
            try {
                this.stats.apiCalls++;
                const batch = await assetGenerator_js_1.assetGenerator['fetchComicVineCreators'](batchSize);
                const unique = batch.filter(asset => !this.isDuplicate(asset.name));
                results.push(...unique);
                console.log(`  Fetched ${batch.length}, unique: ${unique.length}, total: ${results.length}`);
                offset += batchSize;
                if (batch.length < batchSize)
                    break;
                await this.rateLimit(1100);
            }
            catch (error) {
                console.error(`Error fetching creators at offset ${offset}:`, error);
                this.stats.errors++;
                await this.rateLimit(3000);
            }
        }
        this.stats.totalFetched += results.length;
        return results;
    }
    /**
     * Fetch Marvel characters in batches (max 100 per request)
     */
    async fetchMarvelCharactersBatched(targetCount) {
        const results = [];
        const batchSize = 100; // Marvel API limit
        let offset = 0;
        console.log(`🦸 Fetching up to ${targetCount} Marvel characters in batches of ${batchSize}...`);
        while (results.length < targetCount && offset < 1500) { // Marvel API typical limit
            try {
                this.stats.apiCalls++;
                const batch = await assetGenerator_js_1.assetGenerator['fetchMarvelCharacters'](batchSize);
                const unique = batch.filter(asset => !this.isDuplicate(asset.name));
                results.push(...unique);
                console.log(`  Fetched ${batch.length}, unique: ${unique.length}, total: ${results.length}`);
                offset += batchSize;
                if (batch.length < batchSize)
                    break;
                await this.rateLimit(500); // Marvel: ~3000 requests/day, be conservative
            }
            catch (error) {
                console.error(`Error fetching Marvel batch at offset ${offset}:`, error);
                this.stats.errors++;
                await this.rateLimit(3000);
            }
        }
        this.stats.totalFetched += results.length;
        return results;
    }
    /**
     * Generate comprehensive asset universe with batched fetching
     */
    async generateLargeAssetUniverse(options = {}) {
        const { targetCharacters = 5000, targetTeams = 1000, targetLocations = 1000, targetObjects = 1000, targetCreators = 500 } = options;
        console.log('🚀 Starting large-scale batched asset generation...\n');
        console.log(`Target: ${targetCharacters + targetTeams + targetLocations + targetObjects + targetCreators} total assets\n`);
        const allAssets = [];
        // Fetch characters (Comic Vine + Marvel)
        const cvCharacters = await this.fetchComicVineCharactersBatched(Math.floor(targetCharacters * 0.7));
        allAssets.push(...cvCharacters);
        const marvelCharacters = await this.fetchMarvelCharactersBatched(Math.floor(targetCharacters * 0.3));
        allAssets.push(...marvelCharacters);
        // Fetch teams
        const teams = await this.fetchComicVineTeamsBatched(targetTeams);
        allAssets.push(...teams);
        // Fetch locations
        const locations = await this.fetchComicVineLocationsBatched(targetLocations);
        allAssets.push(...locations);
        // Fetch objects/gadgets
        const objects = await this.fetchComicVineObjectsBatched(targetObjects);
        allAssets.push(...objects);
        // Fetch creators
        const creators = await this.fetchComicVineCreatorsBatched(targetCreators);
        allAssets.push(...creators);
        // Generate assets in database
        console.log(`\n💾 Generating ${allAssets.length} assets in database...`);
        const inserted = await assetGenerator_js_1.assetGenerator['generateAssets'](allAssets);
        // Display statistics
        console.log('\n' + '='.repeat(60));
        console.log('✨ Batched asset generation complete!');
        console.log('='.repeat(60));
        console.log(`\n📊 Statistics:`);
        console.log(`   Total fetched: ${this.stats.totalFetched}`);
        console.log(`   Duplicates removed: ${this.stats.duplicates}`);
        console.log(`   Errors encountered: ${this.stats.errors}`);
        console.log(`   API calls made: ${this.stats.apiCalls}`);
        console.log(`   Assets inserted: ${inserted}`);
        // Category breakdown
        const categoryBreakdown = allAssets.reduce((acc, asset) => {
            acc[asset.category] = (acc[asset.category] || 0) + 1;
            return acc;
        }, {});
        console.log(`\n📊 Category Breakdown:`);
        Object.entries(categoryBreakdown).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} assets`);
        });
    }
    /**
     * Get fetching statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Reset statistics and deduplication cache
     */
    reset() {
        this.seenNames.clear();
        this.stats = {
            totalFetched: 0,
            duplicates: 0,
            errors: 0,
            apiCalls: 0
        };
    }
}
exports.BatchedAssetFetcher = BatchedAssetFetcher;
exports.batchedAssetFetcher = new BatchedAssetFetcher();
