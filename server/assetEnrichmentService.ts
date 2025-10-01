/**
 * Panel Profits - Asset Enrichment Service
 * Adds historical significance, rarity classifications, and cultural impact ratings
 */

import { db } from './databaseStorage';
import { assets } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

interface EnrichmentData {
  historicalSignificance: number; // 0-100
  rarityClass: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  culturalImpact: number; // 0-100
  investmentGrade: 'JUNK' | 'BBB' | 'A' | 'AA' | 'AAA';
}

export class AssetEnrichmentService {
  /**
   * Calculate historical significance based on metadata
   */
  private calculateHistoricalSignificance(asset: any): number {
    const metadata = asset.metadata as any;
    let score = 30; // Base score

    // Year-based significance (older = more significant)
    const year = metadata?.year;
    if (year) {
      if (year < 1950) score += 40;
      else if (year < 1970) score += 30;
      else if (year < 1990) score += 20;
      else if (year < 2000) score += 10;
    }

    // First appearance significance
    if (metadata?.firstAppearance) {
      score += 15;
    }

    // Creator significance
    if (asset.type === 'CRT') {
      score += 25;
    }

    // Key issue significance
    if (asset.type === 'KEY') {
      score += 20;
    }

    // Publisher significance
    const publisher = metadata?.publisher?.toLowerCase() || '';
    if (publisher.includes('marvel') || publisher.includes('dc')) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Determine rarity class based on multiple factors
   */
  private determineRarityClass(asset: any): 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' {
    const metadata = asset.metadata as any;
    const marketCap = metadata?.estimatedMarketCap || 0;
    const popularity = metadata?.popularity || 50;
    const year = metadata?.year || 2000;

    let rarityScore = 0;

    // Market cap contribution
    if (marketCap > 100000000) rarityScore += 40; // $100M+
    else if (marketCap > 50000000) rarityScore += 30; // $50M+
    else if (marketCap > 10000000) rarityScore += 20; // $10M+
    else if (marketCap > 5000000) rarityScore += 10; // $5M+

    // Popularity contribution
    if (popularity > 90) rarityScore += 30;
    else if (popularity > 75) rarityScore += 20;
    else if (popularity > 60) rarityScore += 10;

    // Age contribution
    if (year < 1950) rarityScore += 30;
    else if (year < 1970) rarityScore += 20;
    else if (year < 1990) rarityScore += 10;

    // Type contribution
    if (asset.type === 'CRT') rarityScore += 15;
    if (asset.type === 'KEY') rarityScore += 20;

    // Determine rarity class
    if (rarityScore >= 90) return 'MYTHIC';
    if (rarityScore >= 70) return 'LEGENDARY';
    if (rarityScore >= 50) return 'EPIC';
    if (rarityScore >= 30) return 'RARE';
    if (rarityScore >= 15) return 'UNCOMMON';
    return 'COMMON';
  }

  /**
   * Calculate cultural impact rating
   */
  private calculateCulturalImpact(asset: any): number {
    const metadata = asset.metadata as any;
    let score = 40; // Base score

    // Popularity contribution
    const popularity = metadata?.popularity || 50;
    score += Math.min(popularity * 0.4, 40);

    // Publisher contribution
    const publisher = metadata?.publisher?.toLowerCase() || '';
    if (publisher.includes('marvel') || publisher.includes('dc')) {
      score += 15;
    }

    // Type-based contribution
    if (asset.type === 'HER') score += 10;
    if (asset.type === 'VIL') score += 8;
    if (asset.type === 'TEM') score += 12;
    if (asset.type === 'CRT') score += 15;
    if (asset.type === 'KEY') score += 10;

    return Math.min(score, 100);
  }

  /**
   * Determine investment grade rating
   */
  private determineInvestmentGrade(asset: any): 'JUNK' | 'BBB' | 'A' | 'AA' | 'AAA' {
    const metadata = asset.metadata as any;
    const marketCap = metadata?.estimatedMarketCap || 0;
    const popularity = metadata?.popularity || 50;
    const narrativeWeight = parseFloat(asset.narrativeWeight || '50');

    const avgScore = (
      (marketCap > 10000000 ? 80 : marketCap > 5000000 ? 60 : marketCap > 1000000 ? 40 : 20) +
      popularity +
      narrativeWeight
    ) / 3;

    if (avgScore >= 85) return 'AAA';
    if (avgScore >= 70) return 'AA';
    if (avgScore >= 55) return 'A';
    if (avgScore >= 40) return 'BBB';
    return 'JUNK';
  }

  /**
   * Enrich a single asset
   */
  async enrichAsset(assetId: string): Promise<void> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
    
    if (!asset) {
      console.error(`Asset ${assetId} not found`);
      return;
    }

    const enrichment: EnrichmentData = {
      historicalSignificance: this.calculateHistoricalSignificance(asset),
      rarityClass: this.determineRarityClass(asset),
      culturalImpact: this.calculateCulturalImpact(asset),
      investmentGrade: this.determineInvestmentGrade(asset)
    };

    // Update asset metadata with enrichment data
    const updatedMetadata = {
      ...(asset.metadata as any),
      enrichment
    };

    try {
      await db.update(assets)
        .set({ metadata: updatedMetadata })
        .where(eq(assets.id, assetId));

      console.log(`✅ Enriched ${asset.symbol}: ${enrichment.rarityClass}, Grade ${enrichment.investmentGrade}`);
    } catch (error) {
      console.error(`Error enriching ${asset.symbol}:`, error);
    }
  }

  /**
   * Enrich all assets in the database
   */
  async enrichAllAssets(): Promise<void> {
    console.log('💎 Starting asset enrichment...\n');

    const allAssets = await db.select().from(assets);
    
    console.log(`Found ${allAssets.length} assets to enrich\n`);

    const rarityStats: Record<string, number> = {};
    const gradeStats: Record<string, number> = {};

    for (const asset of allAssets) {
      const enrichment: EnrichmentData = {
        historicalSignificance: this.calculateHistoricalSignificance(asset),
        rarityClass: this.determineRarityClass(asset),
        culturalImpact: this.calculateCulturalImpact(asset),
        investmentGrade: this.determineInvestmentGrade(asset)
      };

      const updatedMetadata = {
        ...(asset.metadata as any),
        enrichment
      };

      try {
        await db.update(assets)
          .set({ metadata: updatedMetadata })
          .where(eq(assets.id, asset.id));

        rarityStats[enrichment.rarityClass] = (rarityStats[enrichment.rarityClass] || 0) + 1;
        gradeStats[enrichment.investmentGrade] = (gradeStats[enrichment.investmentGrade] || 0) + 1;
      } catch (error) {
        console.error(`Error enriching ${asset.symbol}:`, error);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Asset enrichment complete!');
    console.log('='.repeat(60));
    console.log('\n💎 Rarity Distribution:');
    Object.entries(rarityStats).forEach(([rarity, count]) => {
      console.log(`   ${rarity}: ${count} assets`);
    });
    console.log('\n📊 Investment Grade Distribution:');
    Object.entries(gradeStats).forEach(([grade, count]) => {
      console.log(`   ${grade}: ${count} assets`);
    });
  }
}

export const assetEnrichment = new AssetEnrichmentService();
