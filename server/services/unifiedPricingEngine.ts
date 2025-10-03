/**
 * Unified Pricing Engine - Comprehensive asset pricing for Panel Profits
 * Handles: Characters, Creators, Comics, Manga, Publishers, Bonds
 * Uses era-based supply + franchise tiers + appearance modifiers
 * All prices constrained to $50-$6,000 range
 */

type Era = 'golden' | 'silver' | 'bronze' | 'modern' | 'tezuka' | 'shonen' | 'digital';
type AssetType = 'character' | 'creator' | 'comic' | 'manga' | 'publisher' | 'bond';
type Region = 'western' | 'japan' | 'korea' | 'china' | 'europe' | 'indie';

interface EraConfig {
  baseMarketValue: number;
  totalSupply: number; // physical copies
  sharesPerCopy: number;
  yearRange: [number, number];
}

interface FranchiseTier {
  weight: number; // FranchiseWeight or CreatorPrestigeWeight
  description: string;
}

interface PricingInput {
  assetType: AssetType;
  name: string;
  era: Era;
  region?: Region;
  
  // Franchise/Character specific
  franchiseTier?: 1 | 2 | 3 | 4;
  keyAppearances?: number;
  isVariant?: boolean;
  variantOf?: string;
  
  // Creator specific
  creatorTier?: 1 | 2 | 3 | 4;
  roleWeightedAppearances?: number;
  
  // Publisher specific
  publisherHealth?: number; // 0.6-1.4
  assetPortfolioValue?: number;
  
  // Bond specific
  couponRate?: number;
  yearsToMaturity?: number;
  creditRating?: 'major' | 'minor' | 'indie';
}

interface PricingResult {
  sharePrice: number;
  totalMarketValue: number;
  totalFloat: number;
  scarcityModifier: number;
  breakdown: {
    baseMarketValue: number;
    tierMultiplier: number;
    appearanceModifier: number;
    franchiseWeight: number;
    regionalScalar?: number;
  };
}

class UnifiedPricingEngine {
  private readonly MIN_PRICE = 50;
  private readonly MAX_PRICE = 6000;
  
  /**
   * Era configurations for Western comics
   * Base values calibrated to hit $50-$6,000 target range
   * Formula: baseMarketValue = targetPrice × totalFloat / avgMultiplier
   * Golden: $3,500 target × 300,000 shares = $1.05B
   * Silver: $1,000 target × 800,000 shares = $800M
   * Bronze: $500 target × 1.5M shares = $750M
   * Modern: $150 target × 2M shares = $300M
   */
  private readonly eraConfigs: Record<Era, EraConfig> = {
    golden: {
      baseMarketValue: 1050000000, // $1.05 billion
      totalSupply: 3000,
      sharesPerCopy: 100,
      yearRange: [1938, 1955]
    },
    silver: {
      baseMarketValue: 800000000, // $800 million
      totalSupply: 8000,
      sharesPerCopy: 100,
      yearRange: [1956, 1970]
    },
    bronze: {
      baseMarketValue: 750000000, // $750 million
      totalSupply: 15000,
      sharesPerCopy: 100,
      yearRange: [1971, 1985]
    },
    modern: {
      baseMarketValue: 300000000, // $300 million
      totalSupply: 20000,
      sharesPerCopy: 100,
      yearRange: [1986, 2025]
    },
    // Manga eras (with Japan scalar 0.85 already applied)
    tezuka: {
      baseMarketValue: 850000000, // Adjusted for manga market
      totalSupply: 10000,
      sharesPerCopy: 100,
      yearRange: [1945, 1970]
    },
    shonen: {
      baseMarketValue: 500000000, // Adjusted for manga market
      totalSupply: 12000,
      sharesPerCopy: 100,
      yearRange: [1970, 1999]
    },
    digital: {
      baseMarketValue: 250000000, // Adjusted for manga market
      totalSupply: 18000,
      sharesPerCopy: 100,
      yearRange: [2000, 2025]
    }
  };
  
  /**
   * Regional market scalars
   */
  private readonly regionalScalars: Record<Region, number> = {
    western: 1.0,
    japan: 0.85,
    korea: 0.75,
    china: 0.75,
    europe: 0.80,
    indie: 0.65
  };
  
  /**
   * Franchise tier weights for superheroes/villains
   */
  private readonly franchiseTiers: Record<number, FranchiseTier> = {
    1: { weight: 0.35, description: 'Flagship Heroes (Superman, Spider-Man, Batman)' },
    2: { weight: 0.15, description: 'Variants & Second-Gen (Miles Morales, All-Star)' },
    3: { weight: -0.10, description: 'Sidekicks (Robin, Bucky, Kid Flash)' },
    4: { weight: -0.25, description: 'Henchmen & Minor Villains' }
  };
  
  /**
   * Creator prestige tier weights
   */
  private readonly creatorTiers: Record<number, FranchiseTier> = {
    1: { weight: 0.40, description: 'Legends (Stan Lee, Kirby, Kane, Finger)' },
    2: { weight: 0.22, description: 'Superstars (Claremont, Dell\'Otto, Miller)' },
    3: { weight: 0.10, description: 'Top Artists (Adam Hughes, Alex Ross)' },
    4: { weight: -0.20, description: 'Unknowns & New Creators' }
  };
  
  /**
   * Calculate appearance modifier using logarithmic curve
   * Formula: min(0.45, ln(1 + keyAppearances) / 5)
   */
  private calculateAppearanceModifier(appearances: number): number {
    if (appearances <= 0) return 0;
    return Math.min(0.45, Math.log(1 + appearances) / 5);
  }
  
  /**
   * Calculate scarcity modifier (0.90-1.10 range)
   */
  private calculateScarcityModifier(totalSupply: number, baseSupply: number): number {
    const alpha = 0.20;
    const modifier = 1 + alpha * ((baseSupply - totalSupply) / baseSupply);
    return Math.max(0.90, Math.min(1.10, modifier));
  }
  
  /**
   * Calculate variant discount multiplier
   */
  private calculateVariantMultiplier(isVariant: boolean): number {
    return isVariant ? 0.6 : 1.0; // Variants are 60% of original
  }
  
  /**
   * Main pricing calculation
   */
  calculatePrice(input: PricingInput): PricingResult {
    const eraConfig = this.eraConfigs[input.era];
    const region = input.region || 'western';
    const regionalScalar = this.regionalScalars[region];
    
    // Base calculation components
    let baseMarketValue = eraConfig.baseMarketValue * regionalScalar;
    let tierMultiplier = 1.0;
    let appearanceModifier = 0;
    let franchiseWeight = 0;
    
    // Asset-type specific calculations
    switch (input.assetType) {
      case 'character':
        if (input.franchiseTier) {
          franchiseWeight = this.franchiseTiers[input.franchiseTier].weight;
        }
        if (input.keyAppearances) {
          appearanceModifier = this.calculateAppearanceModifier(input.keyAppearances);
        }
        if (input.isVariant) {
          tierMultiplier *= this.calculateVariantMultiplier(true);
        }
        break;
        
      case 'creator':
        if (input.creatorTier) {
          franchiseWeight = this.creatorTiers[input.creatorTier].weight;
        }
        if (input.roleWeightedAppearances) {
          appearanceModifier = this.calculateAppearanceModifier(input.roleWeightedAppearances);
        }
        break;
        
      case 'comic':
      case 'manga':
        // Comics use base pricing with minimal modifiers
        appearanceModifier = 0;
        break;
        
      case 'publisher':
        return this.calculatePublisherPrice(input, eraConfig);
        
      case 'bond':
        return this.calculateBondPrice(input);
    }
    
    // Calculate total float
    const totalFloat = eraConfig.totalSupply * eraConfig.sharesPerCopy;
    
    // Scarcity modifier
    const scarcityModifier = this.calculateScarcityModifier(
      eraConfig.totalSupply,
      eraConfig.totalSupply
    );
    
    // Master formula:
    // sharePrice = (BaseEraMarketValue × TierMultiplier × 
    //               (1 + AppearanceModifier + FranchiseWeight) × 
    //               ScarcityModifier) ÷ TotalFloat
    let totalMarketValue = baseMarketValue * tierMultiplier * 
      (1 + appearanceModifier + franchiseWeight) * scarcityModifier;
    
    let sharePrice = totalMarketValue / totalFloat;
    
    // CLAMP to $50-$6,000 range
    sharePrice = Math.max(this.MIN_PRICE, Math.min(this.MAX_PRICE, sharePrice));
    
    // Round to cents
    sharePrice = Math.round(sharePrice * 100) / 100;
    
    // Recalculate totalMarketValue from final sharePrice to maintain invariant
    totalMarketValue = sharePrice * totalFloat;
    
    return {
      sharePrice,
      totalMarketValue: Math.round(totalMarketValue * 100) / 100,
      totalFloat,
      scarcityModifier,
      breakdown: {
        baseMarketValue,
        tierMultiplier,
        appearanceModifier,
        franchiseWeight,
        regionalScalar: region !== 'western' ? regionalScalar : undefined
      }
    };
  }
  
  /**
   * Publisher-specific pricing
   */
  private calculatePublisherPrice(input: PricingInput, eraConfig: EraConfig): PricingResult {
    const publisherHealth = input.publisherHealth || 1.0;
    const portfolioValue = input.assetPortfolioValue || 1000000;
    
    // Publisher tiers
    const tierMultipliers = {
      major: 1.4,
      minor: 1.1,
      indie: 0.8
    };
    
    const floatSizes = {
      major: 5000000,
      minor: 2000000,
      indie: 500000
    };
    
    const tier = input.franchiseTier === 1 ? 'major' : 
                 input.franchiseTier === 2 ? 'minor' : 'indie';
    
    const tierMultiplier = tierMultipliers[tier];
    const totalFloat = floatSizes[tier];
    
    let sharePrice = (portfolioValue * publisherHealth * tierMultiplier) / totalFloat;
    
    // Clamp and round
    sharePrice = Math.max(this.MIN_PRICE, Math.min(this.MAX_PRICE, sharePrice));
    sharePrice = Math.round(sharePrice * 100) / 100;
    
    // Recalculate totalMarketValue from final sharePrice
    const totalMarketValue = sharePrice * totalFloat;
    
    return {
      sharePrice,
      totalMarketValue: Math.round(totalMarketValue * 100) / 100,
      totalFloat,
      scarcityModifier: 1.0,
      breakdown: {
        baseMarketValue: portfolioValue,
        tierMultiplier,
        appearanceModifier: 0,
        franchiseWeight: publisherHealth - 1
      }
    };
  }
  
  /**
   * Bond-specific pricing
   */
  private calculateBondPrice(input: PricingInput): PricingResult {
    const par = 1000;
    const couponRate = input.couponRate || 0.05;
    const yearsToMaturity = input.yearsToMaturity || 10;
    const creditRating = input.creditRating || 'minor';
    
    const creditSpreads = {
      major: 0.02,
      minor: 0.04,
      indie: 0.06
    };
    
    const baseRiskFree = 0.03;
    const bondYield = baseRiskFree + creditSpreads[creditRating];
    
    const coupon = couponRate * par;
    const bondValue = (coupon * yearsToMaturity + par) / Math.pow(1 + bondYield, yearsToMaturity);
    
    // Adjust float to keep price in range
    const bondFloat = 50; // units
    const totalFloat = bondFloat * 100;
    let sharePrice = bondValue / totalFloat;
    
    // Clamp and round
    sharePrice = Math.max(this.MIN_PRICE, Math.min(this.MAX_PRICE, sharePrice));
    sharePrice = Math.round(sharePrice * 100) / 100;
    
    // Recalculate totalMarketValue from final sharePrice
    const totalMarketValue = sharePrice * totalFloat;
    
    return {
      sharePrice,
      totalMarketValue: Math.round(totalMarketValue * 100) / 100,
      totalFloat,
      scarcityModifier: 1.0,
      breakdown: {
        baseMarketValue: par,
        tierMultiplier: 1.0,
        appearanceModifier: couponRate,
        franchiseWeight: bondYield - baseRiskFree
      }
    };
  }
  
  /**
   * Batch pricing calculation
   */
  batchCalculate(inputs: PricingInput[]): PricingResult[] {
    return inputs.map(input => this.calculatePrice(input));
  }
  
  /**
   * Determine era from year
   */
  determineEra(year: number, isManga: boolean = false): Era {
    if (isManga) {
      if (year < 1970) return 'tezuka';
      if (year < 2000) return 'shonen';
      return 'digital';
    }
    
    if (year < 1956) return 'golden';
    if (year < 1970) return 'silver';
    if (year < 1985) return 'bronze';
    return 'modern';
  }
  
  /**
   * Get franchise tier description
   */
  getFranchiseTierInfo(tier: number): string {
    return this.franchiseTiers[tier]?.description || 'Unknown tier';
  }
  
  /**
   * Get creator tier description
   */
  getCreatorTierInfo(tier: number): string {
    return this.creatorTiers[tier]?.description || 'Unknown tier';
  }
}

export const unifiedPricingEngine = new UnifiedPricingEngine();
export type { PricingInput, PricingResult, Era, AssetType, Region };
