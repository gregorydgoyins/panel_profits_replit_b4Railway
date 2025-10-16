"use strict";
/**
 * Panel Profits - Seven Houses Assignment System
 * Maps assets to houses based on alignment/publisher and sets influence/narrative weights
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sevenHousesAssignment = exports.SevenHousesAssignmentService = void 0;
const databaseStorage_1 = require("./databaseStorage");
const schema_js_1 = require("../shared/schema.js");
const drizzle_orm_1 = require("drizzle-orm");
class SevenHousesAssignmentService {
    /**
     * Map asset to appropriate house based on alignment and publisher
     */
    determineHouse(asset) {
        const metadata = asset.metadata;
        const publisher = metadata?.publisher?.toLowerCase() || '';
        const alignment = metadata?.alignment?.toLowerCase() || '';
        const description = (asset.description || '').toLowerCase();
        const type = asset.type;
        // Marvel assets → House of Marvel
        if (publisher.includes('marvel')) {
            return {
                houseId: 'marvel-house',
                influencePercent: 85 + Math.random() * 10, // 85-95%
                narrativeWeight: 75 + Math.random() * 15, // 75-90%
                reason: 'Marvel Comics publisher'
            };
        }
        // DC assets → House of DC
        if (publisher.includes('dc')) {
            return {
                houseId: 'dc-house',
                influencePercent: 85 + Math.random() * 10,
                narrativeWeight: 75 + Math.random() * 15,
                reason: 'DC Comics publisher'
            };
        }
        // Villains → Dark House
        if (type === 'VIL' || alignment === 'evil' || alignment === 'bad') {
            return {
                houseId: 'dark-house',
                influencePercent: 70 + Math.random() * 20,
                narrativeWeight: 80 + Math.random() * 15,
                reason: 'Villain alignment'
            };
        }
        // Heroes → Light House
        if (type === 'HER' || alignment === 'good') {
            return {
                houseId: 'light-house',
                influencePercent: 70 + Math.random() * 20,
                narrativeWeight: 75 + Math.random() * 15,
                reason: 'Hero alignment'
            };
        }
        // Teams → Unity House
        if (type === 'TEM') {
            return {
                houseId: 'unity-house',
                influencePercent: 65 + Math.random() * 25,
                narrativeWeight: 70 + Math.random() * 20,
                reason: 'Team asset'
            };
        }
        // Creators → Artisan House
        if (type === 'CRT') {
            return {
                houseId: 'artisan-house',
                influencePercent: 90 + Math.random() * 10,
                narrativeWeight: 85 + Math.random() * 10,
                reason: 'Creator/artist asset'
            };
        }
        // Gadgets/Objects → Tech House
        if (type === 'GAD') {
            return {
                houseId: 'tech-house',
                influencePercent: 60 + Math.random() * 30,
                narrativeWeight: 65 + Math.random() * 25,
                reason: 'Gadget/technology asset'
            };
        }
        // Default: Neutral house for unclassified assets
        return {
            houseId: 'neutral-house',
            influencePercent: 50 + Math.random() * 30,
            narrativeWeight: 50 + Math.random() * 30,
            reason: 'Unclassified asset'
        };
    }
    /**
     * Calculate narrative weight based on asset characteristics
     */
    calculateNarrativeWeight(asset, baseWeight) {
        const metadata = asset.metadata;
        let weight = baseWeight;
        // Increase weight for popular assets
        const popularity = metadata?.popularity || 50;
        if (popularity > 80) {
            weight += 10;
        }
        else if (popularity > 60) {
            weight += 5;
        }
        // Increase weight for high market cap assets
        const marketCap = metadata?.estimatedMarketCap || 0;
        if (marketCap > 50000000) { // $50M+
            weight += 10;
        }
        else if (marketCap > 10000000) { // $10M+
            weight += 5;
        }
        // Key issues have higher narrative weight
        if (asset.type === 'KEY') {
            weight += 15;
        }
        return Math.min(weight, 100);
    }
    /**
     * Assign house to a single asset
     */
    async assignHouseToAsset(assetId) {
        const [asset] = await databaseStorage_1.db.select().from(schema_js_1.assets).where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, assetId)).limit(1);
        if (!asset) {
            console.error(`Asset ${assetId} not found`);
            return;
        }
        const mapping = this.determineHouse(asset);
        if (!mapping) {
            return;
        }
        // Calculate final narrative weight
        const narrativeWeight = this.calculateNarrativeWeight(asset, mapping.narrativeWeight);
        try {
            await databaseStorage_1.db.update(schema_js_1.assets)
                .set({
                houseId: mapping.houseId,
                houseInfluencePercent: mapping.influencePercent.toFixed(2),
                narrativeWeight: narrativeWeight.toFixed(2),
                controlledSince: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, assetId));
            console.log(`✅ Assigned ${asset.symbol} to ${mapping.houseId} (${mapping.influencePercent.toFixed(0)}% influence, ${narrativeWeight.toFixed(0)}% narrative weight)`);
        }
        catch (error) {
            console.error(`Error assigning house to ${asset.symbol}:`, error);
        }
    }
    /**
     * Assign houses to all assets in the database
     */
    async assignHousesToAllAssets() {
        console.log('🏛️ Starting Seven Houses assignment...\n');
        const allAssets = await databaseStorage_1.db.select().from(schema_js_1.assets);
        console.log(`Found ${allAssets.length} assets to assign to houses\n`);
        // Track assignments by house
        const houseStats = {};
        for (const asset of allAssets) {
            const mapping = this.determineHouse(asset);
            if (!mapping)
                continue;
            const narrativeWeight = this.calculateNarrativeWeight(asset, mapping.narrativeWeight);
            try {
                await databaseStorage_1.db.update(schema_js_1.assets)
                    .set({
                    houseId: mapping.houseId,
                    houseInfluencePercent: mapping.influencePercent.toFixed(2),
                    narrativeWeight: narrativeWeight.toFixed(2),
                    controlledSince: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(schema_js_1.assets.id, asset.id));
                houseStats[mapping.houseId] = (houseStats[mapping.houseId] || 0) + 1;
            }
            catch (error) {
                console.error(`Error assigning house to ${asset.symbol}:`, error);
            }
        }
        console.log('\n' + '='.repeat(60));
        console.log('✨ Seven Houses assignment complete!');
        console.log('='.repeat(60));
        console.log('\n📊 House Distribution:');
        Object.entries(houseStats).forEach(([houseId, count]) => {
            console.log(`   ${houseId}: ${count} assets`);
        });
    }
    /**
     * Initialize Seven Houses in database (if not already created)
     */
    async ensureHousesExist() {
        const houses = [
            {
                id: 'marvel-house',
                name: 'House of Marvel',
                description: 'Controllers of the Marvel Universe assets',
                specialization: 'Marvel Comics',
                color: '#ED1D24',
                symbol: 'shield'
            },
            {
                id: 'dc-house',
                name: 'House of DC',
                description: 'Controllers of the DC Comics assets',
                specialization: 'DC Comics',
                color: '#0078F0',
                symbol: 'shield-check'
            },
            {
                id: 'dark-house',
                name: 'House of Shadows',
                description: 'Controllers of villain and antagonist assets',
                specialization: 'Villains & Antagonists',
                color: '#8B0000',
                symbol: 'skull'
            },
            {
                id: 'light-house',
                name: 'House of Light',
                description: 'Controllers of hero and protagonist assets',
                specialization: 'Heroes & Protagonists',
                color: '#FFD700',
                symbol: 'star'
            },
            {
                id: 'unity-house',
                name: 'House of Unity',
                description: 'Controllers of team and alliance assets',
                specialization: 'Teams & Alliances',
                color: '#4CAF50',
                symbol: 'users'
            },
            {
                id: 'artisan-house',
                name: 'House of Artisans',
                description: 'Controllers of creator and artist assets',
                specialization: 'Creators & Artists',
                color: '#9C27B0',
                symbol: 'palette'
            },
            {
                id: 'tech-house',
                name: 'House of Technology',
                description: 'Controllers of gadget and technology assets',
                specialization: 'Gadgets & Technology',
                color: '#00BCD4',
                symbol: 'cpu'
            },
            {
                id: 'neutral-house',
                name: 'House of Neutrality',
                description: 'Controllers of unaligned and neutral assets',
                specialization: 'Neutral Assets',
                color: '#9E9E9E',
                symbol: 'circle'
            }
        ];
        for (const house of houses) {
            try {
                const existing = await databaseStorage_1.db.select().from(schema_js_1.sevenHouses).where((0, drizzle_orm_1.eq)(schema_js_1.sevenHouses.id, house.id)).limit(1);
                if (existing.length === 0) {
                    await databaseStorage_1.db.insert(schema_js_1.sevenHouses).values(house);
                    console.log(`✅ Created house: ${house.name}`);
                }
            }
            catch (error) {
                console.error(`Error creating house ${house.name}:`, error);
            }
        }
    }
    /**
     * Update house statistics based on controlled assets
     */
    async updateHouseStatistics() {
        console.log('\n📊 Updating house statistics...');
        const houses = await databaseStorage_1.db.select().from(schema_js_1.sevenHouses);
        for (const house of houses) {
            const controlledAssets = await databaseStorage_1.db
                .select()
                .from(schema_js_1.assets)
                .where((0, drizzle_orm_1.eq)(schema_js_1.assets.houseId, house.id));
            const totalMarketCap = controlledAssets.reduce((sum, asset) => {
                const metadata = asset.metadata;
                return sum + (metadata?.estimatedMarketCap || 0);
            }, 0);
            const avgInfluence = controlledAssets.reduce((sum, asset) => {
                return sum + parseFloat(asset.houseInfluencePercent || '0');
            }, 0) / (controlledAssets.length || 1);
            await databaseStorage_1.db.update(schema_js_1.sevenHouses)
                .set({
                controlledAssetsCount: controlledAssets.length,
                marketCap: totalMarketCap.toFixed(2),
                powerLevel: avgInfluence.toFixed(2)
            })
                .where((0, drizzle_orm_1.eq)(schema_js_1.sevenHouses.id, house.id));
            console.log(`  ✅ ${house.name}: ${controlledAssets.length} assets, $${(totalMarketCap / 1000000).toFixed(1)}M market cap`);
        }
    }
}
exports.SevenHousesAssignmentService = SevenHousesAssignmentService;
exports.sevenHousesAssignment = new SevenHousesAssignmentService();
