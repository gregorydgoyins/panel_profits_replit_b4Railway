"use strict";
/**
 * Stat Asset Extraction Service
 * Extracts intelligence, strength, speed, combat, durability, power stats
 * from existing character assets and Superhero API, creating tradeable stat assets
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.statAssetExtractionService = exports.StatAssetExtractionService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const SymbolGeneratorService_1 = require("./SymbolGeneratorService");
const STAT_TYPES = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
class StatAssetExtractionService {
    /**
     * Fetch stats from Superhero API
     */
    async fetchSuperheroStats(characterId) {
        const apiToken = process.env.SUPERHERO_API_TOKEN;
        if (!apiToken) {
            console.warn('⚠️ SUPERHERO_API_TOKEN not configured');
            return null;
        }
        try {
            const response = await fetch(`https://superheroapi.com/api/${apiToken}/${characterId}`);
            if (!response.ok)
                return null;
            const data = await response.json();
            if (data.response === 'error' || !data.powerstats)
                return null;
            const parseStatValue = (val) => {
                if (!val || val === 'null')
                    return 0;
                const parsed = parseInt(val, 10);
                return isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
            };
            return {
                characterId: parseInt(data.id, 10),
                characterName: data.name,
                characterSymbol: '', // Will be looked up
                intelligence: parseStatValue(data.powerstats.intelligence),
                strength: parseStatValue(data.powerstats.strength),
                speed: parseStatValue(data.powerstats.speed),
                durability: parseStatValue(data.powerstats.durability),
                power: parseStatValue(data.powerstats.power),
                combat: parseStatValue(data.powerstats.combat),
            };
        }
        catch (error) {
            console.error(`❌ Error fetching stats for character ${characterId}:`, error);
            return null;
        }
    }
    /**
     * Calculate stat asset price based on rarity and value
     */
    calculateStatPrice(statType, value) {
        // Base prices by stat type
        const basePrices = {
            intelligence: 100,
            strength: 120,
            speed: 110,
            durability: 90,
            power: 150,
            combat: 130,
        };
        // Rarity multiplier based on stat value
        let rarityMultiplier = 1.0;
        if (value >= 90)
            rarityMultiplier = 10.0; // 90-100: Ultra Rare (10x)
        else if (value >= 80)
            rarityMultiplier = 5.0; // 80-89: Rare (5x)
        else if (value >= 70)
            rarityMultiplier = 3.0; // 70-79: Uncommon (3x)
        else if (value >= 50)
            rarityMultiplier = 1.5; // 50-69: Common (1.5x)
        else
            rarityMultiplier = 0.8; // 0-49: Basic (0.8x)
        // Value multiplier based on actual stat value
        const valueMultiplier = (value / 100) * 2; // 0-200% based on stat
        const price = basePrices[statType] * rarityMultiplier * (1 + valueMultiplier);
        // Clamp to reasonable range
        return Math.max(50, Math.min(2500, price));
    }
    /**
     * Generate stat asset for a character
     */
    async createStatAsset(characterName, characterSymbol, statType, value) {
        if (value === 0) {
            return { created: false }; // Skip zero stats
        }
        // Generate symbol: CHARACTER.STAT.VALUE
        // Example: BATMAN.INTELLIGENCE.100 or SUPERMAN.STRENGTH.100
        const statSymbol = `${characterSymbol}.${statType.toUpperCase()}.${value}`;
        // Check if asset already exists
        const existing = await databaseStorage_1.db
            .select()
            .from(schema_1.assets)
            .where((0, drizzle_orm_1.eq)(schema_1.assets.symbol, statSymbol))
            .limit(1);
        if (existing.length > 0) {
            return { created: false, assetId: existing[0].id, symbol: statSymbol };
        }
        // Create new stat asset
        const name = `${characterName} - ${statType.charAt(0).toUpperCase() + statType.slice(1)} (${value})`;
        const description = `Tradeable stat asset representing ${characterName}'s ${statType} rating of ${value}/100. ${this.getStatDescription(statType, value)}`;
        const price = this.calculateStatPrice(statType, value);
        const assetData = {
            symbol: statSymbol,
            name,
            type: 'stat',
            description,
            metadata: {
                characterName,
                statType,
                statValue: value,
                rarity: this.getStatRarity(value),
                source: 'superheroapi',
            },
            verificationStatus: 'verified',
            primaryDataSource: 'superheroapi',
            lastVerifiedAt: new Date(),
        };
        const [newAsset] = await databaseStorage_1.db.insert(schema_1.assets).values(assetData).returning({ id: schema_1.assets.id });
        // Create price entry
        await databaseStorage_1.db.insert(schema_1.assetCurrentPrices).values({
            assetId: newAsset.id,
            currentPrice: price.toFixed(2),
            bidPrice: (price * 0.98).toFixed(2),
            askPrice: (price * 1.02).toFixed(2),
            volume: 0,
        });
        return { created: true, assetId: newAsset.id, symbol: statSymbol };
    }
    /**
     * Get stat rarity tier
     */
    getStatRarity(value) {
        if (value >= 90)
            return 'Ultra Rare';
        if (value >= 80)
            return 'Rare';
        if (value >= 70)
            return 'Uncommon';
        if (value >= 50)
            return 'Common';
        return 'Basic';
    }
    /**
     * Get stat description flavor text
     */
    getStatDescription(statType, value) {
        const descriptions = {
            intelligence: {
                'Ultra Rare': 'Genius-level intellect capable of reshaping reality.',
                'Rare': 'Brilliant mind with exceptional problem-solving abilities.',
                'Uncommon': 'Above-average intelligence with strong analytical skills.',
                'Common': 'Average intellectual capabilities.',
                'Basic': 'Limited cognitive abilities.',
            },
            strength: {
                'Ultra Rare': 'Godlike physical power capable of moving planets.',
                'Rare': 'Superhuman strength far beyond normal limits.',
                'Uncommon': 'Enhanced strength exceeding peak human levels.',
                'Common': 'Average physical strength.',
                'Basic': 'Limited physical power.',
            },
            speed: {
                'Ultra Rare': 'Near light-speed movement capability.',
                'Rare': 'Supersonic velocity and incredible reflexes.',
                'Uncommon': 'Enhanced speed beyond normal human limits.',
                'Common': 'Average movement speed.',
                'Basic': 'Limited mobility.',
            },
            durability: {
                'Ultra Rare': 'Virtually indestructible, immune to most damage.',
                'Rare': 'Superhuman resilience and damage resistance.',
                'Uncommon': 'Enhanced durability beyond normal human limits.',
                'Common': 'Average physical resilience.',
                'Basic': 'Fragile constitution.',
            },
            power: {
                'Ultra Rare': 'Reality-warping abilities of cosmic scale.',
                'Rare': 'Tremendous power capable of affecting entire regions.',
                'Uncommon': 'Significant supernatural abilities.',
                'Common': 'Moderate special abilities.',
                'Basic': 'Minimal supernatural power.',
            },
            combat: {
                'Ultra Rare': 'Master of all combat forms, unmatched warrior.',
                'Rare': 'Highly skilled fighter with extensive training.',
                'Uncommon': 'Proficient in multiple fighting styles.',
                'Common': 'Basic combat training.',
                'Basic': 'Limited fighting ability.',
            },
        };
        const rarity = this.getStatRarity(value);
        return descriptions[statType][rarity];
    }
    /**
     * Extract stats from a character and create stat assets
     */
    async extractStatsForCharacter(characterName, superheroId) {
        console.log(`🔍 Extracting stats for ${characterName} (Superhero ID: ${superheroId})...`);
        const stats = await this.fetchSuperheroStats(superheroId);
        if (!stats) {
            console.warn(`⚠️ No stats found for ${characterName}`);
            return { characterName, statsCreated: 0, statsSkipped: 0, assets: [] };
        }
        // Find character in database to get symbol
        const characters = await databaseStorage_1.db
            .select()
            .from(schema_1.assets)
            .where((0, drizzle_orm_1.sql) `LOWER(${schema_1.assets.name}) LIKE LOWER(${`%${characterName}%`})`)
            .limit(1);
        const characterSymbol = characters.length > 0
            ? characters[0].symbol
            : SymbolGeneratorService_1.symbolGeneratorService.generateSymbol(characterName, 'character');
        let statsCreated = 0;
        let statsSkipped = 0;
        const createdAssets = [];
        // Create stat assets for each stat type
        for (const statType of STAT_TYPES) {
            const value = stats[statType];
            if (value === 0) {
                statsSkipped++;
                continue;
            }
            const result = await this.createStatAsset(characterName, characterSymbol, statType, value);
            if (result.created) {
                statsCreated++;
                createdAssets.push({
                    statType,
                    value,
                    symbol: result.symbol,
                });
                console.log(`  ✅ Created ${statType} asset: ${result.symbol} (value: ${value})`);
            }
            else {
                statsSkipped++;
            }
        }
        console.log(`✅ ${characterName}: ${statsCreated} stats created, ${statsSkipped} skipped`);
        return {
            characterName,
            statsCreated,
            statsSkipped,
            assets: createdAssets,
        };
    }
    /**
     * Bulk extract stats for multiple characters
     */
    async bulkExtractStats(characters) {
        console.log(`🚀 Starting bulk stat extraction for ${characters.length} characters...`);
        let processed = 0;
        let statsCreated = 0;
        let errors = 0;
        for (const character of characters) {
            try {
                const result = await this.extractStatsForCharacter(character.name, character.superheroId);
                processed++;
                statsCreated += result.statsCreated;
            }
            catch (error) {
                console.error(`❌ Error processing ${character.name}:`, error);
                errors++;
            }
        }
        console.log(`\n📊 Bulk Extraction Complete:`);
        console.log(`   Total: ${characters.length}`);
        console.log(`   Processed: ${processed}`);
        console.log(`   Stats Created: ${statsCreated}`);
        console.log(`   Errors: ${errors}`);
        return {
            total: characters.length,
            processed,
            statsCreated,
            errors,
        };
    }
    /**
     * Extract stats for all Superhero API characters (IDs 1-731)
     */
    async extractAllSuperheroStats() {
        console.log('🦸 Starting full Superhero API stat extraction...');
        const MAX_ID = 731; // Superhero API has ~731 characters
        let processed = 0;
        let statsCreated = 0;
        let errors = 0;
        for (let id = 1; id <= MAX_ID; id++) {
            try {
                const stats = await this.fetchSuperheroStats(id);
                if (!stats) {
                    errors++;
                    continue;
                }
                const result = await this.extractStatsForCharacter(stats.characterName, id);
                processed++;
                statsCreated += result.statsCreated;
                // Log progress every 50 characters
                if (id % 50 === 0) {
                    console.log(`📊 Progress: ${id}/${MAX_ID} characters | ${statsCreated} stats created`);
                }
                // Small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                console.error(`❌ Error processing character ${id}:`, error);
                errors++;
            }
        }
        console.log(`\n✅ Full Extraction Complete:`);
        console.log(`   Total Characters: ${MAX_ID}`);
        console.log(`   Processed: ${processed}`);
        console.log(`   Stats Created: ${statsCreated}`);
        console.log(`   Errors: ${errors}`);
        return {
            total: MAX_ID,
            processed,
            statsCreated,
            errors,
        };
    }
}
exports.StatAssetExtractionService = StatAssetExtractionService;
exports.statAssetExtractionService = new StatAssetExtractionService();
