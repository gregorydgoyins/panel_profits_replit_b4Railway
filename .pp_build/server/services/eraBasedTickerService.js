"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eraBasedTickerService = exports.EraBasedTickerService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Era-Based Float System
 * Older eras = smaller float (rarer, more volatile)
 * Newer eras = larger float (more common, more stable)
 */
const ERA_FLOAT_SIZES = {
    'Golden Age': 10000, // 10K float - ultra rare, high volatility
    'Silver Age': 25000, // 25K float - rare, high volatility  
    'Bronze Age': 50000, // 50K float - uncommon, moderate volatility
    'Copper Age': 75000, // 75K float - moderate availability
    'Modern Age': 100000, // 100K float - common, lower volatility
    'Indie/Digital Age': 150000, // 150K float - very common
    'Post-Modern Age': 200000, // 200K float - most common, lowest volatility
    'Unknown Era': 50000, // Default fallback
};
class EraBasedTickerService {
    /**
     * Get ticker assets with era-based float weighting
     * Prioritizes older eras (smaller float, more interesting price action)
     */
    async getTickerAssets(limit = 30) {
        try {
            // Get assets with recent price data
            const assetsWithPrices = await databaseStorage_1.db
                .select({
                assetId: schema_1.assets.id,
                symbol: schema_1.assets.symbol,
                name: schema_1.assets.name,
                firstAppearanceYear: schema_1.assets.firstAppearanceYear,
                currentPrice: schema_1.assetPrices.price,
                previousPrice: (0, drizzle_orm_1.sql) `LAG(${schema_1.assetPrices.price}) OVER (PARTITION BY ${schema_1.assetPrices.assetId} ORDER BY ${schema_1.assetPrices.timestamp} DESC)`,
                timestamp: schema_1.assetPrices.timestamp,
            })
                .from(schema_1.assets)
                .innerJoin(schema_1.assetPrices, (0, drizzle_orm_1.sql) `${schema_1.assetPrices.assetId} = ${schema_1.assets.id}`)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.assetPrices.timestamp, (0, drizzle_orm_1.sql) `NOW() - INTERVAL '1 hour'`)))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.assetPrices.timestamp))
                .limit(limit * 3); // Get more to filter
            // Process and calculate era-based metrics
            const tickerAssets = [];
            const seenSymbols = new Set();
            for (const asset of assetsWithPrices) {
                if (seenSymbols.has(asset.symbol))
                    continue;
                seenSymbols.add(asset.symbol);
                const era = asset.firstAppearanceYear
                    ? (0, schema_1.getComicEra)(asset.firstAppearanceYear)
                    : 'Unknown Era';
                const float = ERA_FLOAT_SIZES[era] || 50000;
                // Calculate price change
                const currentPrice = Number(asset.currentPrice);
                const previousPrice = Number(asset.previousPrice) || currentPrice;
                const change = currentPrice - previousPrice;
                const changePercent = previousPrice > 0
                    ? (change / previousPrice) * 100
                    : 0;
                // Simulate volume based on float size (smaller float = lower volume typically)
                const volume24h = Math.floor((float / 10) * (Math.random() * 0.5 + 0.75));
                tickerAssets.push({
                    symbol: asset.symbol,
                    name: asset.name,
                    currentPrice,
                    change,
                    changePercent,
                    era,
                    float,
                    volume24h,
                });
                if (tickerAssets.length >= limit)
                    break;
            }
            // Sort by era rarity (Golden Age first) for more interesting ticker
            return tickerAssets.sort((a, b) => {
                // Prioritize older eras (smaller float)
                return a.float - b.float;
            });
        }
        catch (error) {
            console.error('Era-based ticker error:', error);
            return [];
        }
    }
    /**
     * Get era distribution stats for the market
     */
    async getEraDistribution() {
        try {
            const distribution = await databaseStorage_1.db
                .select({
                firstAppearanceYear: schema_1.assets.firstAppearanceYear,
                count: (0, drizzle_orm_1.sql) `COUNT(*)`,
            })
                .from(schema_1.assets)
                .where((0, drizzle_orm_1.sql) `${schema_1.assets.firstAppearanceYear} IS NOT NULL`)
                .groupBy(schema_1.assets.firstAppearanceYear);
            const eraStats = new Map();
            for (const row of distribution) {
                const era = (0, schema_1.getComicEra)(row.firstAppearanceYear);
                const stats = eraStats.get(era) || { count: 0, years: [] };
                stats.count += Number(row.count);
                stats.years.push(row.firstAppearanceYear);
                eraStats.set(era, stats);
            }
            return Array.from(eraStats.entries()).map(([era, stats]) => ({
                era,
                count: stats.count,
                avgFloat: ERA_FLOAT_SIZES[era] || 50000,
            }));
        }
        catch (error) {
            console.error('Era distribution error:', error);
            return [];
        }
    }
    /**
     * Get assets from a specific era
     */
    async getEraAssets(era, limit = 20) {
        try {
            const eraInfo = schema_1.COMIC_ERAS.find(e => e.name === era);
            if (!eraInfo)
                return [];
            const assetsInEra = await databaseStorage_1.db
                .select({
                assetId: schema_1.assets.id,
                symbol: schema_1.assets.symbol,
                name: schema_1.assets.name,
                firstAppearanceYear: schema_1.assets.firstAppearanceYear,
                currentPrice: schema_1.assetPrices.price,
                timestamp: schema_1.assetPrices.timestamp,
            })
                .from(schema_1.assets)
                .innerJoin(schema_1.assetPrices, (0, drizzle_orm_1.sql) `${schema_1.assetPrices.assetId} = ${schema_1.assets.id}`)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.assets.firstAppearanceYear, eraInfo.startYear), (0, drizzle_orm_1.sql) `${schema_1.assets.firstAppearanceYear} <= ${eraInfo.endYear}`, (0, drizzle_orm_1.gte)(schema_1.assetPrices.timestamp, (0, drizzle_orm_1.sql) `NOW() - INTERVAL '1 hour'`)))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.assetPrices.timestamp))
                .limit(limit);
            const float = ERA_FLOAT_SIZES[era] || 50000;
            return assetsInEra.map(asset => ({
                symbol: asset.symbol,
                name: asset.name,
                currentPrice: Number(asset.currentPrice),
                change: 0, // Would need previous price
                changePercent: 0,
                era,
                float,
                volume24h: Math.floor((float / 10) * (Math.random() * 0.5 + 0.75)),
            }));
        }
        catch (error) {
            console.error(`Era assets error for ${era}:`, error);
            return [];
        }
    }
}
exports.EraBasedTickerService = EraBasedTickerService;
exports.eraBasedTickerService = new EraBasedTickerService();
