import { db } from '../databaseStorage';
import { assets, assetPrices, COMIC_ERAS, getComicEra } from '@shared/schema';
import { desc, sql, and, gte } from 'drizzle-orm';

/**
 * Era-Based Float System
 * Older eras = smaller float (rarer, more volatile)
 * Newer eras = larger float (more common, more stable)
 */
const ERA_FLOAT_SIZES = {
  'Golden Age': 10000,       // 10K float - ultra rare, high volatility
  'Silver Age': 25000,       // 25K float - rare, high volatility  
  'Bronze Age': 50000,       // 50K float - uncommon, moderate volatility
  'Copper Age': 75000,       // 75K float - moderate availability
  'Modern Age': 100000,      // 100K float - common, lower volatility
  'Indie/Digital Age': 150000,    // 150K float - very common
  'Post-Modern Age': 200000,      // 200K float - most common, lowest volatility
  'Unknown Era': 50000,      // Default fallback
} as const;

interface TickerAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  era: string;
  float: number;
  volume24h: number;
}

export class EraBasedTickerService {
  /**
   * Get ticker assets with era-based float weighting
   * Prioritizes older eras (smaller float, more interesting price action)
   */
  async getTickerAssets(limit: number = 30): Promise<TickerAsset[]> {
    try {
      // Get assets with recent price data
      const assetsWithPrices = await db
        .select({
          assetId: assets.id,
          symbol: assets.symbol,
          name: assets.name,
          firstAppearanceYear: assets.firstAppearanceYear,
          currentPrice: assetPrices.price,
          previousPrice: sql<number>`LAG(${assetPrices.price}) OVER (PARTITION BY ${assetPrices.assetId} ORDER BY ${assetPrices.timestamp} DESC)`,
          timestamp: assetPrices.timestamp,
        })
        .from(assets)
        .innerJoin(assetPrices, sql`${assetPrices.assetId} = ${assets.id}`)
        .where(
          and(
            gte(assetPrices.timestamp, sql`NOW() - INTERVAL '1 hour'`),
          )
        )
        .orderBy(desc(assetPrices.timestamp))
        .limit(limit * 3); // Get more to filter

      // Process and calculate era-based metrics
      const tickerAssets: TickerAsset[] = [];
      const seenSymbols = new Set<string>();

      for (const asset of assetsWithPrices) {
        if (seenSymbols.has(asset.symbol)) continue;
        seenSymbols.add(asset.symbol);

        const era = asset.firstAppearanceYear 
          ? getComicEra(asset.firstAppearanceYear)
          : 'Unknown Era';
        
        const float = ERA_FLOAT_SIZES[era as keyof typeof ERA_FLOAT_SIZES] || 50000;
        
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

        if (tickerAssets.length >= limit) break;
      }

      // Sort by era rarity (Golden Age first) for more interesting ticker
      return tickerAssets.sort((a, b) => {
        // Prioritize older eras (smaller float)
        return a.float - b.float;
      });

    } catch (error) {
      console.error('Era-based ticker error:', error);
      return [];
    }
  }

  /**
   * Get era distribution stats for the market
   */
  async getEraDistribution(): Promise<{ era: string; count: number; avgFloat: number }[]> {
    try {
      const distribution = await db
        .select({
          firstAppearanceYear: assets.firstAppearanceYear,
          count: sql<number>`COUNT(*)`,
        })
        .from(assets)
        .where(sql`${assets.firstAppearanceYear} IS NOT NULL`)
        .groupBy(assets.firstAppearanceYear);

      const eraStats = new Map<string, { count: number; years: number[] }>();

      for (const row of distribution) {
        const era = getComicEra(row.firstAppearanceYear!);
        const stats = eraStats.get(era) || { count: 0, years: [] };
        stats.count += Number(row.count);
        stats.years.push(row.firstAppearanceYear!);
        eraStats.set(era, stats);
      }

      return Array.from(eraStats.entries()).map(([era, stats]) => ({
        era,
        count: stats.count,
        avgFloat: ERA_FLOAT_SIZES[era as keyof typeof ERA_FLOAT_SIZES] || 50000,
      }));

    } catch (error) {
      console.error('Era distribution error:', error);
      return [];
    }
  }

  /**
   * Get assets from a specific era
   */
  async getEraAssets(era: string, limit: number = 20): Promise<TickerAsset[]> {
    try {
      const eraInfo = COMIC_ERAS.find(e => e.name === era);
      if (!eraInfo) return [];

      const assetsInEra = await db
        .select({
          assetId: assets.id,
          symbol: assets.symbol,
          name: assets.name,
          firstAppearanceYear: assets.firstAppearanceYear,
          currentPrice: assetPrices.price,
          timestamp: assetPrices.timestamp,
        })
        .from(assets)
        .innerJoin(assetPrices, sql`${assetPrices.assetId} = ${assets.id}`)
        .where(
          and(
            gte(assets.firstAppearanceYear!, eraInfo.startYear),
            sql`${assets.firstAppearanceYear} <= ${eraInfo.endYear}`,
            gte(assetPrices.timestamp, sql`NOW() - INTERVAL '1 hour'`)
          )
        )
        .orderBy(desc(assetPrices.timestamp))
        .limit(limit);

      const float = ERA_FLOAT_SIZES[era as keyof typeof ERA_FLOAT_SIZES] || 50000;

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

    } catch (error) {
      console.error(`Era assets error for ${era}:`, error);
      return [];
    }
  }
}

export const eraBasedTickerService = new EraBasedTickerService();
