"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitySeedingService = void 0;
const comicDataService_1 = require("./comicDataService");
const storage_1 = require("../storage");
const priceChartingService_1 = require("./priceChartingService");
const weightedMarketCapService_1 = require("./weightedMarketCapService");
const fs_1 = require("fs");
const sync_1 = require("csv-parse/sync");
/**
 * Entity Mining & Seeding Service
 * Mines the Marvel and Comic Vine APIs to create tradable assets
 * across publishers, franchises, characters, and creators
 */
class EntitySeedingService {
    /**
     * Generate realistic ticker symbol for an entity
     */
    generateSymbol(name, type) {
        const cleanName = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const suffix = {
            publisher: 'PUB',
            franchise: 'FRNCH',
            character: 'HERO', // Will override for villains
            creator: 'CRTR'
        }[type] || 'ASSET';
        // Take first 4-6 chars of name
        const base = cleanName.slice(0, Math.min(6, cleanName.length));
        return `${base}.${suffix}`;
    }
    /**
     * Calculate realistic pricing based on entity type and metadata (fallback method)
     */
    calculateEntityPrice(entity, type) {
        let basePrice = 100; // Starting point
        switch (type) {
            case 'publisher':
                // Publishers price based on output volume and market presence
                basePrice = 1000 + Math.random() * 4000; // $1,000 - $5,000
                break;
            case 'franchise':
                // Franchises as aggregate blue-chip assets
                basePrice = 500 + Math.random() * 2500; // $500 - $3,000
                break;
            case 'character':
                // Characters priced by appearance count and significance
                const appearances = entity.metadata?.countOfIssueAppearances || 0;
                if (appearances > 1000) {
                    basePrice = 300 + Math.random() * 700; // Major characters: $300-$1,000
                }
                else if (appearances > 100) {
                    basePrice = 100 + Math.random() * 200; // Mid-tier: $100-$300
                }
                else {
                    basePrice = 20 + Math.random() * 80; // Minor: $20-$100
                }
                break;
            case 'creator':
                // Creators priced by body of work and critical acclaim
                const credits = entity.metadata?.countOfIssueAppearances || 0;
                if (credits > 500) {
                    basePrice = 200 + Math.random() * 800; // Legendary: $200-$1,000
                }
                else if (credits > 100) {
                    basePrice = 75 + Math.random() * 175; // Established: $75-$250
                }
                else {
                    basePrice = 25 + Math.random() * 75; // Rising: $25-$100
                }
                break;
        }
        return Math.floor(basePrice * 100) / 100; // Round to 2 decimals
    }
    /**
     * Get real market price for a character from PriceCharting, with fallback to calculated
     */
    async getCharacterPrice(characterName, entity) {
        try {
            const realPrice = await priceChartingService_1.priceChartingService.getPriceForCharacter(characterName);
            if (realPrice > 0) {
                console.log(`   💰 Using real PriceCharting price for ${characterName}: $${realPrice}`);
                return { price: realPrice, source: 'pricecharting' };
            }
        }
        catch (error) {
            console.warn(`   ⚠️  PriceCharting lookup failed for ${characterName}, using calculated price`);
        }
        const calculatedPrice = this.calculateEntityPrice(entity, 'character');
        console.log(`   📊 Using calculated price for ${characterName}: $${calculatedPrice}`);
        return { price: calculatedPrice, source: 'calculated' };
    }
    /**
     * Get real market price for a creator from PriceCharting, with fallback to calculated
     */
    async getCreatorPrice(creatorName, entity) {
        try {
            const realPrice = await priceChartingService_1.priceChartingService.getPriceForCreator(creatorName);
            if (realPrice > 0) {
                console.log(`   💰 Using real PriceCharting price for ${creatorName}: $${realPrice}`);
                return { price: realPrice, source: 'pricecharting' };
            }
        }
        catch (error) {
            console.warn(`   ⚠️  PriceCharting lookup failed for ${creatorName}, using calculated price`);
        }
        const calculatedPrice = this.calculateEntityPrice(entity, 'creator');
        console.log(`   📊 Using calculated price for ${creatorName}: $${calculatedPrice}`);
        return { price: calculatedPrice, source: 'calculated' };
    }
    /**
     * Get real market price for a franchise from PriceCharting, with fallback to calculated
     */
    async getFranchisePrice(franchiseName, entity) {
        try {
            const realPrice = await priceChartingService_1.priceChartingService.getPriceForSeries(franchiseName);
            if (realPrice > 0) {
                console.log(`   💰 Using real PriceCharting price for ${franchiseName}: $${realPrice}`);
                return { price: realPrice, source: 'pricecharting' };
            }
        }
        catch (error) {
            console.warn(`   ⚠️  PriceCharting lookup failed for ${franchiseName}, using calculated price`);
        }
        const calculatedPrice = this.calculateEntityPrice(entity, 'franchise');
        console.log(`   📊 Using calculated price for ${franchiseName}: $${calculatedPrice}`);
        return { price: calculatedPrice, source: 'calculated' };
    }
    /**
     * Seed major publishers from Comic Vine
     * Note: Uses calculated prices (publishers don't have direct PriceCharting data)
     */
    async seedPublishers() {
        console.log('🏢 Mining publishers from Comic Vine...');
        try {
            const publishers = await comicDataService_1.comicDataService.fetchComicVinePublishers(30);
            // Focus on major publishers
            const majorPublishers = [
                'Marvel', 'DC Comics', 'Image Comics', 'Dark Horse Comics',
                'IDW Publishing', 'Boom Studios', 'Vertigo', 'Dynamite Entertainment'
            ];
            for (const pub of publishers) {
                // Only seed major publishers
                if (!majorPublishers.some(major => pub.name.includes(major))) {
                    continue;
                }
                const symbol = this.generateSymbol(pub.name, 'publisher');
                // Publishers use calculated pricing (no direct PriceCharting data available)
                const price = this.calculateEntityPrice(pub, 'publisher');
                // Check if already exists
                const existing = await storage_1.storage.getAssetBySymbol(symbol);
                if (existing) {
                    console.log(`   ♻️  Publisher already exists: ${pub.name}`);
                    continue;
                }
                // Create publisher asset
                await storage_1.storage.createAsset({
                    symbol,
                    name: pub.name,
                    type: 'publisher',
                    description: pub.description || `Major comic book publisher`,
                    imageUrl: pub.imageUrl,
                    metadata: {
                        ...pub.metadata,
                        location: `${pub.locationCity}, ${pub.locationState}`,
                        aliases: pub.aliases
                    }
                });
                // Create initial price
                await storage_1.storage.createMarketData({
                    assetId: symbol,
                    timeframe: '1d',
                    periodStart: new Date(),
                    open: price.toString(),
                    high: (price * 1.02).toString(),
                    low: (price * 0.98).toString(),
                    close: price.toString(),
                    volume: Math.floor(1000 + Math.random() * 5000),
                    change: '0',
                    percentChange: '0'
                });
                console.log(`   ✅ Created publisher: ${pub.name} (${symbol}) @ $${price} [calculated]`);
            }
        }
        catch (error) {
            console.error('❌ Error seeding publishers:', error);
        }
    }
    /**
     * Seed major characters from Comic Vine (DC, Image, etc.)
     */
    async seedCharacters() {
        console.log('🦸 Mining characters from Comic Vine...');
        try {
            // Fetch characters from major publishers
            const characters = await comicDataService_1.comicDataService.fetchComicVineCharacters(undefined, 100);
            // Filter for major characters (high appearance count)
            const majorCharacters = characters
                .filter(char => (char.metadata?.countOfIssueAppearances || 0) > 50)
                .slice(0, 30); // Top 30 characters
            for (const char of majorCharacters) {
                // Determine if hero or villain
                const isVillain = char.name.toLowerCase().includes('joker') ||
                    char.name.toLowerCase().includes('loki') ||
                    char.name.toLowerCase().includes('magneto') ||
                    char.description?.toLowerCase().includes('villain') ||
                    char.description?.toLowerCase().includes('enemy');
                const type = 'character';
                const suffix = isVillain ? 'VILLAIN' : 'HERO';
                const symbol = `${char.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}.${suffix}`;
                // Check if already exists
                const existing = await storage_1.storage.getAssetBySymbol(symbol);
                if (existing) {
                    console.log(`   ♻️  Character already exists: ${char.name}`);
                    continue;
                }
                // Get real price from PriceCharting with fallback to calculated
                const { price, source } = await this.getCharacterPrice(char.name, char);
                // Create character asset
                await storage_1.storage.createAsset({
                    symbol,
                    name: char.name,
                    type,
                    description: char.description || `${char.publisher || 'Comic'} character with ${char.metadata?.countOfIssueAppearances || 0} appearances`,
                    imageUrl: char.imageUrl,
                    metadata: {
                        ...char.metadata,
                        realName: char.realName,
                        publisher: char.publisher,
                        firstAppearance: char.firstAppearance,
                        powers: char.powers,
                        aliases: char.aliases,
                        origin: char.origin,
                        alignment: isVillain ? 'villain' : 'hero',
                        pricingSource: source
                    }
                });
                // Create initial price
                await storage_1.storage.createMarketData({
                    assetId: symbol,
                    timeframe: '1d',
                    periodStart: new Date(),
                    open: price.toString(),
                    high: (price * 1.03).toString(),
                    low: (price * 0.97).toString(),
                    close: price.toString(),
                    volume: Math.floor(500 + Math.random() * 2000),
                    change: '0',
                    percentChange: '0'
                });
                console.log(`   ✅ Created character: ${char.name} (${symbol}) @ $${price} [${source}]`);
            }
        }
        catch (error) {
            console.error('❌ Error seeding characters:', error);
        }
    }
    /**
     * Seed hot creators from Comic Vine
     */
    async seedCreators() {
        console.log('✍️  Mining creators from Comic Vine...');
        try {
            const creators = await comicDataService_1.comicDataService.fetchComicVineCreators(100);
            // Filter for prolific creators
            const prolificCreators = creators
                .filter(creator => (creator.metadata?.countOfIssueAppearances || 0) > 50)
                .slice(0, 30); // Top 30 creators
            for (const creator of prolificCreators) {
                const symbol = this.generateSymbol(creator.name, 'creator');
                // Check if already exists
                const existing = await storage_1.storage.getAssetBySymbol(symbol);
                if (existing) {
                    console.log(`   ♻️  Creator already exists: ${creator.name}`);
                    continue;
                }
                // Get real price from PriceCharting with fallback to calculated
                const { price, source } = await this.getCreatorPrice(creator.name, creator);
                // Create creator asset
                await storage_1.storage.createAsset({
                    symbol,
                    name: creator.name,
                    type: 'creator',
                    description: creator.description || `Comic book creator with ${creator.metadata?.countOfIssueAppearances || 0} credits`,
                    imageUrl: creator.imageUrl,
                    metadata: {
                        ...creator.metadata,
                        birthDate: creator.birthDate,
                        hometown: creator.hometown,
                        country: creator.country,
                        aliases: creator.aliases,
                        pricingSource: source
                    }
                });
                // Create initial price
                await storage_1.storage.createMarketData({
                    assetId: symbol,
                    timeframe: '1d',
                    periodStart: new Date(),
                    open: price.toString(),
                    high: (price * 1.05).toString(),
                    low: (price * 0.95).toString(),
                    close: price.toString(),
                    volume: Math.floor(200 + Math.random() * 800),
                    change: '0',
                    percentChange: '0'
                });
                console.log(`   ✅ Created creator: ${creator.name} (${symbol}) @ $${price} [${source}]`);
            }
        }
        catch (error) {
            console.error('❌ Error seeding creators:', error);
        }
    }
    /**
     * Seed franchises from Comic Vine volumes
     */
    async seedFranchises() {
        console.log('📚 Mining franchises from Comic Vine...');
        try {
            const volumes = await comicDataService_1.comicDataService.fetchComicVineVolumes(undefined, 100);
            // Filter for major series (high issue count)
            const majorSeries = volumes
                .filter((vol) => vol.issueCount > 20)
                .slice(0, 20); // Top 20 series
            for (const seriesData of majorSeries) {
                // Cast to any since fetchComicVineVolumes returns transformed camelCase objects
                const series = seriesData;
                const symbol = `${series.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}.FRNCH`;
                // Check if already exists
                const existing = await storage_1.storage.getAssetBySymbol(symbol);
                if (existing) {
                    console.log(`   ♻️  Franchise already exists: ${series.name}`);
                    continue;
                }
                // Get real price from PriceCharting with fallback to calculated
                const { price, source } = await this.getFranchisePrice(series.name, series);
                // Create franchise asset
                await storage_1.storage.createAsset({
                    symbol,
                    name: series.name,
                    type: 'franchise',
                    description: series.description || `${series.publisher} franchise with ${series.issueCount} issues`,
                    imageUrl: series.imageUrl,
                    metadata: {
                        ...series.metadata,
                        publisher: series.publisher,
                        startYear: series.startYear,
                        issueCount: series.issueCount,
                        firstIssue: series.firstIssue,
                        lastIssue: series.lastIssue,
                        pricingSource: source
                    }
                });
                // Create initial price
                await storage_1.storage.createMarketData({
                    assetId: symbol,
                    timeframe: '1d',
                    periodStart: new Date(),
                    open: price.toString(),
                    high: (price * 1.04).toString(),
                    low: (price * 0.96).toString(),
                    close: price.toString(),
                    volume: Math.floor(300 + Math.random() * 1500),
                    change: '0',
                    percentChange: '0'
                });
                console.log(`   ✅ Created franchise: ${series.name} (${symbol}) @ $${price} [${source}]`);
            }
        }
        catch (error) {
            console.error('❌ Error seeding franchises:', error);
        }
    }
    /**
     * Seed comics from Kaggle character datasets + PriceCharting pricing
     */
    async seedComicsFromKaggle() {
        console.log('📚 Seeding comics from Kaggle character datasets...');
        try {
            // Character to key series mapping
            const characterSeries = {
                'Spider-Man': ['Amazing Spider-Man', 'Spectacular Spider-Man', 'Web of Spider-Man'],
                'Captain America': ['Captain America', 'Tales of Suspense'],
                'Wolverine': ['Wolverine', 'X-Men', 'Uncanny X-Men'],
                'Iron Man': ['Iron Man', 'Tales of Suspense', 'Invincible Iron Man'],
                'Thor': ['Thor', 'Journey into Mystery', 'Mighty Thor'],
                'Hulk': ['Incredible Hulk', 'Hulk'],
                'Batman': ['Batman', 'Detective Comics'],
                'Superman': ['Action Comics', 'Superman'],
                'Wonder Woman': ['Wonder Woman'],
                'Flash': ['Flash', 'The Flash'],
                'Green Lantern': ['Green Lantern'],
                'Aquaman': ['Aquaman'],
                'X-Men': ['X-Men', 'Uncanny X-Men', 'New X-Men'],
                'Avengers': ['Avengers'],
                'Justice League': ['Justice League of America', 'Justice League'],
                'Fantastic Four': ['Fantastic Four'],
                'Deadpool': ['Deadpool'],
                'Punisher': ['Punisher'],
                'Daredevil': ['Daredevil'],
                'Green Arrow': ['Green Arrow']
            };
            // Load Marvel characters CSV
            const marvelCsvPath = './attached_assets/marvel-characters.csv';
            const marvelData = (0, fs_1.readFileSync)(marvelCsvPath, 'utf-8');
            const marvelRecords = (0, sync_1.parse)(marvelData, { columns: true });
            // Load DC characters CSV  
            const dcCsvPath = './attached_assets/dc-characters.csv';
            const dcData = (0, fs_1.readFileSync)(dcCsvPath, 'utf-8');
            const dcRecords = (0, sync_1.parse)(dcData, { columns: true });
            console.log(`   Found ${marvelRecords.length} Marvel characters, ${dcRecords.length} DC characters`);
            // Get top characters by appearance count
            const allCharacters = [...marvelRecords, ...dcRecords]
                .filter(c => c.APPEARANCES && parseInt(c.APPEARANCES) > 500)
                .sort((a, b) => parseInt(b.APPEARANCES) - parseInt(a.APPEARANCES))
                .slice(0, 100); // Top 100 most popular
            console.log(`   Processing top ${allCharacters.length} characters...`);
            // Helper function to normalize character names
            const normalizeCharName = (name) => {
                // Remove parentheses content and trim
                const cleaned = name.split('(')[0].trim();
                // Convert to Title Case
                return cleaned.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            };
            // For each character, seed their key series
            for (const character of allCharacters) {
                const charName = normalizeCharName(character.name);
                const series = characterSeries[charName] || [];
                if (series.length === 0)
                    continue;
                for (const seriesName of series) {
                    // Search PriceCharting for this series
                    const comicResults = await priceChartingService_1.priceChartingService.searchComics(seriesName);
                    if (comicResults.length === 0) {
                        console.log(`   ⚠️  No pricing data for: ${seriesName}`);
                        continue;
                    }
                    // Take top 5 most valuable issues from this series
                    const topIssues = comicResults
                        .slice(0, 5)
                        .filter(c => c['product-name']);
                    for (const comic of topIssues) {
                        const symbol = `${seriesName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}.${comic.id.slice(0, 6)}`;
                        // Check if exists
                        const existing = await storage_1.storage.getAssetBySymbol(symbol);
                        if (existing)
                            continue;
                        // Calculate weighted market cap pricing using real census + price data
                        const weightedPricing = await weightedMarketCapService_1.weightedMarketCapService.calculateWeightedPricing(comic['product-name'], 100 // 100 shares per physical comic
                        );
                        if (!weightedPricing) {
                            console.log(`   ⚠️  Could not calculate weighted pricing for: ${comic['product-name']}`);
                            continue;
                        }
                        // Use share price as the trading price
                        const sharePrice = weightedPricing.sharePrice;
                        // Create comic asset with weighted market cap data
                        await storage_1.storage.createAsset({
                            symbol,
                            name: comic['product-name'],
                            type: 'comic',
                            description: `${priceChartingService_1.priceChartingService.extractSeriesName(comic['console-name'])} - Share-based pricing with real census data`,
                            imageUrl: null,
                            metadata: {
                                series: priceChartingService_1.priceChartingService.extractSeriesName(comic['console-name']),
                                publisher: comic['publisher-name'] || (seriesName.includes('Spider-Man') || seriesName.includes('X-Men') ? 'Marvel' : 'DC'),
                                releaseDate: comic['release-date'],
                                productId: comic.id,
                                pricingSource: 'weighted_market_cap',
                                totalMarketValue: weightedPricing.totalMarketValue,
                                totalFloat: weightedPricing.totalFloat,
                                sharesPerCopy: weightedPricing.sharesPerCopy,
                                averageComicValue: weightedPricing.averageComicValue,
                                scarcityModifier: weightedPricing.scarcityModifier,
                                censusDistribution: weightedPricing.censusDistribution
                            }
                        });
                        // Create initial market data using share price
                        await storage_1.storage.createMarketData({
                            assetId: symbol,
                            timeframe: '1d',
                            periodStart: new Date(),
                            open: sharePrice.toString(),
                            high: (sharePrice * 1.02).toString(),
                            low: (sharePrice * 0.98).toString(),
                            close: sharePrice.toString(),
                            volume: Math.floor(100 + Math.random() * 500),
                            change: '0',
                            percentChange: '0'
                        });
                        // Create current price entry with weighted market cap data
                        await storage_1.storage.createAssetCurrentPrice({
                            assetId: symbol,
                            currentPrice: sharePrice.toString(),
                            bidPrice: (sharePrice * 0.995).toString(),
                            askPrice: (sharePrice * 1.005).toString(),
                            dayChange: '0',
                            dayChangePercent: '0',
                            weekHigh: (sharePrice * 1.1).toString(),
                            volume: Math.floor(100 + Math.random() * 500),
                            marketStatus: 'open',
                            priceSource: 'weighted_market_cap',
                            totalMarketValue: weightedPricing.totalMarketValue.toString(),
                            totalFloat: weightedPricing.totalFloat,
                            sharesPerCopy: weightedPricing.sharesPerCopy,
                            censusDistribution: weightedPricing.censusDistribution,
                            scarcityModifier: weightedPricing.scarcityModifier.toString(),
                            averageComicValue: weightedPricing.averageComicValue.toString()
                        });
                        console.log(`   ✅ Created: ${comic['product-name']} @ $${sharePrice.toFixed(2)}/share | Float: ${weightedPricing.totalFloat.toLocaleString()} | Market Cap: $${weightedPricing.totalMarketValue.toLocaleString()}`);
                    }
                }
            }
            console.log('✅ Kaggle comic seeding complete!');
        }
        catch (error) {
            console.error('❌ Error seeding comics from Kaggle:', error);
        }
    }
    /**
     * Run complete seeding process
     */
    async seedAllEntities() {
        console.log('🎭 Starting entity mining across the comic book universe...');
        console.log('   Mining DC, Image, Dark Horse, IDW, manga, and more...\n');
        await this.seedPublishers();
        await this.seedCharacters();
        await this.seedCreators();
        await this.seedFranchises();
        await this.seedComicsFromKaggle(); // New comprehensive comic seeding
        console.log('\n✅ Entity mining complete! The mythology trading floor is ready.');
    }
}
exports.entitySeedingService = new EntitySeedingService();
