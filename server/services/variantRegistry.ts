import type { DatabaseStorage } from '../databaseStorage.js';
import type {
  VariantCoverRegistry,
  InsertVariantCoverRegistry,
  Asset,
  MarketData,
  GradedAssetProfile
} from '../../shared/schema.js';

// Variant type classifications with market multipliers
export const VARIANT_CLASSIFICATIONS = {
  SKETCH: {
    baseMultiplier: 5.0,
    rarityBonus: 40,
    description: 'Artist sketch variant covers'
  },
  INCENTIVE: {
    baseMultiplier: 3.0,
    rarityBonus: 35,
    description: 'Retailer incentive variants'
  },
  CONVENTION: {
    baseMultiplier: 2.5,
    rarityBonus: 30,
    description: 'Convention exclusive variants'
  },
  ARTIST: {
    baseMultiplier: 2.0,
    rarityBonus: 25,
    description: 'Artist exclusive variants'
  },
  RETAILER: {
    baseMultiplier: 1.8,
    rarityBonus: 20,
    description: 'Retailer exclusive variants'
  },
  VIRGIN: {
    baseMultiplier: 1.5,
    rarityBonus: 15,
    description: 'Virgin cover variants (no text/logos)'
  },
  RATIO: {
    baseMultiplier: 1.3,
    rarityBonus: 10,
    description: 'Ratio variants (1:25, 1:50, etc.)'
  }
} as const;

// Incentive ratio multipliers
export const INCENTIVE_RATIOS = {
  '1:500': 10.0,
  '1:200': 8.0,
  '1:100': 6.0,
  '1:50': 4.0,
  '1:25': 2.5,
  '1:15': 2.0,
  '1:10': 1.5,
  '1:5': 1.2
} as const;

// Market valuation interface
export interface VariantValuation {
  baseValue: number;
  premiumMultiplier: number;
  estimatedValue: number;
  confidenceLevel: number;
  marketFactors: {
    scarcityScore: number;
    demandScore: number;
    artistPopularity: number;
    publisherPrestige: number;
  };
}

// Variant cataloging metadata
export interface VariantCatalogData {
  variantIdentifier: string;
  variantName: string;
  coverArtist?: string;
  variantType: string;
  printRun?: number;
  incentiveRatio?: string;
  exclusiveRetailer?: string;
  releaseDate?: Date;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  backCoverUrl?: string;
  description?: string;
  specialFeatures?: string[];
}

// Variant discovery interface
export interface VariantDiscovery {
  variants: VariantCoverRegistry[];
  totalVariants: number;
  rarityDistribution: {
    [key: string]: number;
  };
  marketSummary: {
    averagePremium: number;
    highestPremium: number;
    mostValuableVariant: VariantCoverRegistry | null;
  };
}

export class VariantRegistryService {
  constructor(private storage: DatabaseStorage) {}

  /**
   * Catalog a new variant cover
   */
  async catalogVariant(
    baseAssetId: string,
    variantData: VariantCatalogData,
    marketData?: {
      baseAssetPrice: number;
      variantPrice: number;
      recentSales: Array<{
        price: number;
        date: Date;
        marketplace: string;
      }>;
    }
  ): Promise<VariantCoverRegistry> {
    // Validate base asset exists
    const baseAsset = await this.storage.getAssetById(baseAssetId);
    if (!baseAsset) {
      throw new Error(`Base asset not found: ${baseAssetId}`);
    }

    // Calculate variant valuation
    const valuation = this.calculateVariantValuation(
      variantData,
      marketData?.baseAssetPrice,
      marketData?.variantPrice,
      marketData?.recentSales
    );

    // Create variant registry entry
    const variantRegistryData: InsertVariantCoverRegistry = {
      baseAssetId,
      variantIdentifier: variantData.variantIdentifier,
      variantName: variantData.variantName,
      coverArtist: variantData.coverArtist,
      variantType: variantData.variantType,
      printRun: variantData.printRun,
      incentiveRatio: variantData.incentiveRatio,
      exclusiveRetailer: variantData.exclusiveRetailer,
      releaseDate: variantData.releaseDate,
      coverImageUrl: variantData.coverImageUrl,
      thumbnailUrl: variantData.thumbnailUrl,
      backCoverUrl: variantData.backCoverUrl,
      baseRarityMultiplier: valuation.premiumMultiplier.toString(),
      currentPremium: valuation.estimatedValue.toString(),
      description: variantData.description,
      specialFeatures: variantData.specialFeatures
    };

    const catalogedVariant = await this.storage.createVariantCoverRegistry(variantRegistryData);

    return catalogedVariant;
  }

  /**
   * Update variant market valuation
   */
  async updateVariantValuation(
    variantId: string,
    newMarketData: {
      baseAssetPrice: number;
      variantPrice: number;
      recentSales: Array<{
        price: number;
        date: Date;
        marketplace: string;
      }>;
    }
  ): Promise<VariantCoverRegistry> {
    const variant = await this.storage.getVariantCoverRegistry(variantId);
    if (!variant) {
      throw new Error(`Variant not found: ${variantId}`);
    }

    // Recalculate valuation with new market data
    const variantData = {
      variantType: variant.variantType,
      incentiveRatio: variant.incentiveRatio,
      printRun: variant.printRun,
      exclusiveRetailer: variant.exclusiveRetailer
    };

    const newValuation = this.calculateVariantValuation(
      variantData,
      newMarketData.baseAssetPrice,
      newMarketData.variantPrice,
      newMarketData.recentSales
    );

    // Update variant with new valuation
    const updatedVariant = await this.storage.updateVariantCoverRegistry(variantId, {
      baseRarityMultiplier: newValuation.premiumMultiplier.toString(),
      currentPremium: newValuation.estimatedValue.toString()
    });

    return updatedVariant;
  }

  /**
   * Discover all variants for a base asset
   */
  async discoverVariants(baseAssetId: string): Promise<VariantDiscovery> {
    const variants = await this.storage.getVariantsByBaseAsset(baseAssetId);

    // Calculate rarity distribution
    const rarityDistribution: { [key: string]: number } = {};
    variants.forEach(variant => {
      const rarity = this.calculateVariantRarity(variant);
      rarityDistribution[rarity] = (rarityDistribution[rarity] || 0) + 1;
    });

    // Calculate market summary
    const premiums = variants.map(v => parseFloat(v.currentPremium?.toString() || '0'));
    const averagePremium = premiums.reduce((sum, premium) => sum + premium, 0) / premiums.length || 0;
    const highestPremium = Math.max(...premiums);
    const mostValuableVariant = variants.find(v => 
      parseFloat(v.currentPremium?.toString() || '0') === highestPremium
    ) || null;

    return {
      variants,
      totalVariants: variants.length,
      rarityDistribution,
      marketSummary: {
        averagePremium,
        highestPremium,
        mostValuableVariant
      }
    };
  }

  /**
   * Search variants by criteria
   */
  async searchVariants(criteria: {
    variantType?: string;
    coverArtist?: string;
    publisher?: string;
    minRarity?: string;
    maxPrice?: number;
    hasSpecialFeatures?: boolean;
  }): Promise<VariantCoverRegistry[]> {
    // This would implement complex search logic
    // For now, return basic filtering
    const allVariants = await this.storage.getAllVariantCovers();
    
    return allVariants.filter(variant => {
      if (criteria.variantType && variant.variantType !== criteria.variantType) return false;
      if (criteria.coverArtist && variant.coverArtist !== criteria.coverArtist) return false;
      if (criteria.maxPrice) {
        const currentPrice = parseFloat(variant.currentPremium?.toString() || '0');
        if (currentPrice > criteria.maxPrice) return false;
      }
      if (criteria.hasSpecialFeatures && (!variant.specialFeatures || variant.specialFeatures.length === 0)) return false;
      
      return true;
    });
  }

  /**
   * Get variant market trends
   */
  async getVariantMarketTrends(
    variantId: string,
    timeframe: '1w' | '1m' | '3m' | '6m' | '1y' = '3m'
  ): Promise<{
    priceHistory: Array<{
      date: Date;
      price: number;
      volume: number;
    }>;
    trendAnalysis: {
      direction: 'up' | 'down' | 'stable';
      changePercent: number;
      volatility: number;
      momentum: number;
    };
  }> {
    // This would integrate with market data sources
    // For now, return mock trend data
    const mockHistory = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      price: 50 + Math.random() * 100,
      volume: Math.floor(Math.random() * 20)
    }));

    const startPrice = mockHistory[mockHistory.length - 1].price;
    const endPrice = mockHistory[0].price;
    const changePercent = ((endPrice - startPrice) / startPrice) * 100;

    return {
      priceHistory: mockHistory,
      trendAnalysis: {
        direction: changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable',
        changePercent,
        volatility: this.calculateVolatility(mockHistory.map(h => h.price)),
        momentum: changePercent / Math.abs(changePercent || 1)
      }
    };
  }

  /**
   * Generate trading card data for variant
   */
  async generateTradingCardData(variantId: string): Promise<{
    frontData: {
      name: string;
      artist: string;
      rarity: string;
      powerLevel: number;
      specialAbilities: string[];
      imageUrl: string;
    };
    backData: {
      lore: string;
      stats: {
        scarcity: number;
        demand: number;
        artistry: number;
        collectibility: number;
      };
      marketValue: number;
      lastSale: string;
    };
    holographicEffect: boolean;
    animationTriggers: string[];
  }> {
    const variant = await this.storage.getVariantCoverRegistry(variantId);
    if (!variant) {
      throw new Error(`Variant not found: ${variantId}`);
    }

    const baseAsset = await this.storage.getAssetById(variant.baseAssetId);
    const rarity = this.calculateVariantRarity(variant);
    
    // Calculate power level based on rarity and market value
    const powerLevel = this.calculateVariantPowerLevel(variant, rarity);
    
    // Generate special abilities based on variant features
    const specialAbilities = this.generateSpecialAbilities(variant);
    
    // Determine if holographic effect should be applied
    const holographicEffect = ['legendary', 'mythic'].includes(rarity.toLowerCase());

    return {
      frontData: {
        name: variant.variantName,
        artist: variant.coverArtist || 'Unknown Artist',
        rarity: rarity,
        powerLevel,
        specialAbilities,
        imageUrl: variant.coverImageUrl || ''
      },
      backData: {
        lore: this.generateVariantLore(variant, baseAsset),
        stats: {
          scarcity: this.calculateScarcityScore(variant),
          demand: this.calculateDemandScore(variant),
          artistry: this.calculateArtistryScore(variant),
          collectibility: this.calculateCollectibilityScore(variant)
        },
        marketValue: parseFloat(variant.currentPremium?.toString() || '0'),
        lastSale: 'Recent'
      },
      holographicEffect,
      animationTriggers: this.generateAnimationTriggers(rarity)
    };
  }

  // Private helper methods

  private calculateVariantValuation(
    variantData: Partial<VariantCatalogData>,
    basePrice?: number,
    variantPrice?: number,
    recentSales?: Array<{ price: number; date: Date; marketplace: string }>
  ): VariantValuation {
    let premiumMultiplier = 1.0;

    // Base multiplier from variant type
    if (variantData.variantType && VARIANT_CLASSIFICATIONS[variantData.variantType.toUpperCase() as keyof typeof VARIANT_CLASSIFICATIONS]) {
      const classification = VARIANT_CLASSIFICATIONS[variantData.variantType.toUpperCase() as keyof typeof VARIANT_CLASSIFICATIONS];
      premiumMultiplier = classification.baseMultiplier;
    }

    // Incentive ratio multiplier
    if (variantData.incentiveRatio && INCENTIVE_RATIOS[variantData.incentiveRatio as keyof typeof INCENTIVE_RATIOS]) {
      premiumMultiplier *= INCENTIVE_RATIOS[variantData.incentiveRatio as keyof typeof INCENTIVE_RATIOS];
    }

    // Print run scarcity
    if (variantData.printRun) {
      if (variantData.printRun < 100) premiumMultiplier *= 5.0;
      else if (variantData.printRun < 500) premiumMultiplier *= 3.0;
      else if (variantData.printRun < 1000) premiumMultiplier *= 2.0;
      else if (variantData.printRun < 5000) premiumMultiplier *= 1.5;
    }

    // Exclusive retailer bonus
    if (variantData.exclusiveRetailer) {
      premiumMultiplier *= 1.2;
    }

    // Calculate estimated value
    const estimatedValue = basePrice ? basePrice * premiumMultiplier : 0;

    // Market factors (simplified)
    const marketFactors = {
      scarcityScore: Math.min(100, (premiumMultiplier - 1) * 20),
      demandScore: 50, // Default moderate demand
      artistPopularity: 60, // Default moderate artist popularity
      publisherPrestige: 70 // Default high publisher prestige
    };

    // Confidence level based on data availability
    let confidenceLevel = 0.5; // Base confidence
    if (variantPrice) confidenceLevel += 0.3;
    if (recentSales && recentSales.length > 0) confidenceLevel += 0.2;

    return {
      baseValue: basePrice || 0,
      premiumMultiplier,
      estimatedValue,
      confidenceLevel: Math.min(1.0, confidenceLevel),
      marketFactors
    };
  }

  private calculateVariantRarity(variant: VariantCoverRegistry): string {
    const multiplier = parseFloat(variant.baseRarityMultiplier?.toString() || '1');
    
    if (multiplier >= 8.0) return 'Mythic';
    if (multiplier >= 5.0) return 'Legendary';
    if (multiplier >= 3.0) return 'Epic';
    if (multiplier >= 2.0) return 'Rare';
    if (multiplier >= 1.3) return 'Uncommon';
    return 'Common';
  }

  private calculateVariantPowerLevel(variant: VariantCoverRegistry, rarity: string): number {
    const baseLevel = 50;
    const rarityBonus = {
      'Mythic': 45,
      'Legendary': 35,
      'Epic': 25,
      'Rare': 15,
      'Uncommon': 8,
      'Common': 0
    }[rarity] || 0;

    const valueBonus = Math.min(20, (parseFloat(variant.currentPremium?.toString() || '0') / 100) * 10);
    
    return Math.min(100, baseLevel + rarityBonus + valueBonus);
  }

  private generateSpecialAbilities(variant: VariantCoverRegistry): string[] {
    const abilities: string[] = [];
    
    if (variant.variantType === 'sketch') {
      abilities.push('Artistic Mastery', 'Original Creation');
    }
    if (variant.variantType === 'incentive') {
      abilities.push('Retailer Exclusive', 'Limited Distribution');
    }
    if (variant.incentiveRatio) {
      abilities.push('Ratio Rarity', 'Controlled Scarcity');
    }
    if (variant.specialFeatures && variant.specialFeatures.length > 0) {
      abilities.push(...variant.specialFeatures.map(feature => 
        feature.charAt(0).toUpperCase() + feature.slice(1)
      ));
    }

    return abilities.slice(0, 4); // Limit to 4 abilities
  }

  private generateVariantLore(variant: VariantCoverRegistry, baseAsset: Asset | null): string {
    const artistCredit = variant.coverArtist ? ` crafted by the legendary artist ${variant.coverArtist}` : '';
    const scarcityNote = variant.printRun ? ` with only ${variant.printRun} copies ever created` : '';
    const exclusiveNote = variant.exclusiveRetailer ? ` exclusively available through ${variant.exclusiveRetailer}` : '';
    
    return `A mystical ${variant.variantType} variant cover${artistCredit}${scarcityNote}${exclusiveNote}. This treasured artifact holds the power to enhance any collector's portfolio with its rare beauty and market significance.`;
  }

  private calculateScarcityScore(variant: VariantCoverRegistry): number {
    let score = 50;
    
    if (variant.printRun) {
      if (variant.printRun < 100) score += 40;
      else if (variant.printRun < 500) score += 30;
      else if (variant.printRun < 1000) score += 20;
      else if (variant.printRun < 5000) score += 10;
    }
    
    if (variant.incentiveRatio) {
      const ratio = parseInt(variant.incentiveRatio.split(':')[1] || '1');
      score += Math.min(30, 100 / ratio);
    }
    
    return Math.min(100, score);
  }

  private calculateDemandScore(variant: VariantCoverRegistry): number {
    // Simplified demand calculation based on variant type and market premium
    const typeScores = {
      'sketch': 90,
      'incentive': 80,
      'convention': 70,
      'artist': 75,
      'retailer': 65,
      'virgin': 60,
      'ratio': 70
    };
    
    const baseScore = typeScores[variant.variantType as keyof typeof typeScores] || 50;
    const premiumBonus = Math.min(20, parseFloat(variant.currentPremium?.toString() || '0') / 10);
    
    return Math.min(100, baseScore + premiumBonus);
  }

  private calculateArtistryScore(variant: VariantCoverRegistry): number {
    // Base artistry score with bonuses for known artists
    let score = 60;
    
    if (variant.coverArtist) {
      // Famous artists get bonus points (simplified)
      const famousArtists = ['Alex Ross', 'Jim Lee', 'Todd McFarlane', 'Frank Miller'];
      if (famousArtists.includes(variant.coverArtist)) {
        score += 30;
      } else {
        score += 15; // Any credited artist gets a bonus
      }
    }
    
    if (variant.specialFeatures?.includes('original_art')) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  private calculateCollectibilityScore(variant: VariantCoverRegistry): number {
    const rarity = this.calculateVariantRarity(variant);
    const rarityScores = {
      'Mythic': 95,
      'Legendary': 85,
      'Epic': 75,
      'Rare': 65,
      'Uncommon': 55,
      'Common': 45
    };
    
    return rarityScores[rarity as keyof typeof rarityScores] || 50;
  }

  private generateAnimationTriggers(rarity: string): string[] {
    const baseTriggers = ['hover', 'click'];
    
    if (['legendary', 'mythic'].includes(rarity.toLowerCase())) {
      return [...baseTriggers, 'sparkle', 'glow', 'float'];
    }
    
    if (['epic', 'rare'].includes(rarity.toLowerCase())) {
      return [...baseTriggers, 'shine', 'pulse'];
    }
    
    return baseTriggers;
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    
    return Math.sqrt(variance) / mean * 100; // Return as percentage
  }
}