/**
 * Panel Profits - Derivative Asset Generator
 * Creates options, bonds, LEAPs, and ETFs from base hierarchical tickers
 * 
 * Derivative Ticker Formats:
 * - Options: BASE.MONTH.YEAR.STRIKE.TYPE (e.g., BTMN.JAN.2025.100.C)
 * - Bonds: BASE.MONTH.YEAR.COUPON (e.g., BTMN.DEC.2025.5.0)
 * - LEAPs: BASE.MONTH.YEAR.STRIKE.TYPE.LEAP (e.g., BTMN.JAN.2027.150.C.LEAP)
 * - ETFs: SERIES.ETF (e.g., MRV.ETF, DC.ETF)
 */

import { db } from './databaseStorage';
import { assets, insertAssetSchema } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

export type OptionType = 'C' | 'P'; // Call or Put
export type MonthCode = 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC';

interface OptionParams {
  baseTicker: string;
  month: MonthCode;
  year: number;
  strikePrice: number;
  type: OptionType;
  isLEAP?: boolean;
}

interface BondParams {
  baseTicker: string;
  month: MonthCode;
  year: number;
  couponRate: number; // e.g., 5.0 for 5%
}

interface ETFParams {
  seriesCode: string; // e.g., "MRV" for Marvel, "DC" for DC Comics
  name: string;
  description: string;
  constituents: string[]; // Base ticker symbols
}

export class DerivativeGenerator {
  /**
   * Generate option ticker from parameters
   */
  generateOptionTicker(params: OptionParams): string {
    const { baseTicker, month, year, strikePrice, type, isLEAP } = params;
    const strike = strikePrice.toFixed(0);
    
    if (isLEAP) {
      return `${baseTicker}.${month}.${year}.${strike}.${type}.LEAP`;
    }
    
    return `${baseTicker}.${month}.${year}.${strike}.${type}`;
  }

  /**
   * Generate bond ticker from parameters
   */
  generateBondTicker(params: BondParams): string {
    const { baseTicker, month, year, couponRate } = params;
    return `${baseTicker}.${month}.${year}.${couponRate.toFixed(1)}`;
  }

  /**
   * Generate ETF ticker from series code
   */
  generateETFTicker(seriesCode: string): string {
    return `${seriesCode}.ETF`;
  }

  /**
   * Extract base ticker from hierarchical ticker (SERIES.YEAR.CATEGORY.INDEX → first component)
   */
  extractBaseTicker(hierarchicalTicker: string): string {
    return hierarchicalTicker.split('.')[0];
  }

  /**
   * Create call and put options at multiple strike prices for a base asset
   */
  async createOptionsChain(params: {
    assetId: string;
    baseTicker: string;
    basePrice: number;
    expirationDates: Array<{ month: MonthCode; year: number }>;
    strikeSpacing?: number; // Dollar spacing between strikes
    numStrikes?: number; // Number of strikes above and below current price
  }): Promise<number> {
    const { assetId, baseTicker, basePrice, expirationDates, strikeSpacing = 10, numStrikes = 5 } = params;
    let created = 0;

    for (const expDate of expirationDates) {
      // Determine if this is a LEAP (>1 year out)
      const isLEAP = expDate.year > new Date().getFullYear() + 1;

      // Generate strikes around current price
      for (let i = -numStrikes; i <= numStrikes; i++) {
        const strikePrice = basePrice + (i * strikeSpacing);
        
        if (strikePrice <= 0) continue;

        // Create Call
        const callTicker = this.generateOptionTicker({
          baseTicker,
          month: expDate.month,
          year: expDate.year,
          strikePrice,
          type: 'C',
          isLEAP
        });

        await this.createOption({
          ticker: callTicker,
          baseTicker,
          baseAssetId: assetId,
          strikePrice,
          expirationMonth: expDate.month,
          expirationYear: expDate.year,
          optionType: 'C',
          isLEAP
        });
        created++;

        // Create Put
        const putTicker = this.generateOptionTicker({
          baseTicker,
          month: expDate.month,
          year: expDate.year,
          strikePrice,
          type: 'P',
          isLEAP
        });

        await this.createOption({
          ticker: putTicker,
          baseTicker,
          baseAssetId: assetId,
          strikePrice,
          expirationMonth: expDate.month,
          expirationYear: expDate.year,
          optionType: 'P',
          isLEAP
        });
        created++;
      }
    }

    return created;
  }

  /**
   * Create a single option asset
   */
  private async createOption(params: {
    ticker: string;
    baseTicker: string;
    baseAssetId: string;
    strikePrice: number;
    expirationMonth: MonthCode;
    expirationYear: number;
    optionType: OptionType;
    isLEAP: boolean;
  }) {
    const { ticker, baseTicker, baseAssetId, strikePrice, expirationMonth, expirationYear, optionType, isLEAP } = params;

    try {
      const optionAsset = {
        symbol: ticker,
        name: `${baseTicker} ${expirationMonth} ${expirationYear} ${strikePrice} ${optionType === 'C' ? 'Call' : 'Put'}${isLEAP ? ' (LEAP)' : ''}`,
        type: isLEAP ? 'LEAP' : 'OPT',
        description: `${optionType === 'C' ? 'Call' : 'Put'} option for ${baseTicker} with strike price $${strikePrice}, expiring ${expirationMonth} ${expirationYear}`,
        metadata: {
          derivativeType: isLEAP ? 'leap' : 'option',
          baseAssetId,
          baseTicker,
          strikePrice,
          expirationMonth,
          expirationYear,
          optionType,
          isLEAP,
          contractSize: 100
        }
      };

      const validated = insertAssetSchema.parse(optionAsset);
      await db.insert(assets).values(validated);
      
      console.log(`✅ Created option: ${ticker}`);
    } catch (error) {
      console.error(`Failed to create option ${ticker}:`, error);
    }
  }

  /**
   * Create bond assets for a base ticker
   */
  async createBondSeries(params: {
    assetId: string;
    baseTicker: string;
    maturities: Array<{ month: MonthCode; year: number; couponRate: number }>;
  }): Promise<number> {
    const { assetId, baseTicker, maturities } = params;
    let created = 0;

    for (const maturity of maturities) {
      const bondTicker = this.generateBondTicker({
        baseTicker,
        month: maturity.month,
        year: maturity.year,
        couponRate: maturity.couponRate
      });

      try {
        const bondAsset = {
          symbol: bondTicker,
          name: `${baseTicker} ${maturity.month} ${maturity.year} ${maturity.couponRate}% Bond`,
          type: 'BND',
          description: `Corporate bond for ${baseTicker} with ${maturity.couponRate}% coupon, maturing ${maturity.month} ${maturity.year}`,
          metadata: {
            derivativeType: 'bond',
            baseAssetId: assetId,
            baseTicker,
            couponRate: maturity.couponRate,
            maturityMonth: maturity.month,
            maturityYear: maturity.year,
            faceValue: 1000,
            paymentFrequency: 'semi-annual'
          }
        };

        const validated = insertAssetSchema.parse(bondAsset);
        await db.insert(assets).values(validated);
        
        console.log(`✅ Created bond: ${bondTicker}`);
        created++;
      } catch (error) {
        console.error(`Failed to create bond ${bondTicker}:`, error);
      }
    }

    return created;
  }

  /**
   * Create ETF from multiple base assets
   */
  async createETF(params: ETFParams): Promise<void> {
    const { seriesCode, name, description, constituents } = params;
    const ticker = this.generateETFTicker(seriesCode);

    try {
      const etfAsset = {
        symbol: ticker,
        name,
        type: 'ETF',
        description,
        metadata: {
          derivativeType: 'etf',
          seriesCode,
          constituents,
          expenseRatio: 0.5,
          assetClass: 'Comic Book Assets'
        }
      };

      const validated = insertAssetSchema.parse(etfAsset);
      await db.insert(assets).values(validated);
      
      console.log(`✅ Created ETF: ${ticker} - ${name}`);
    } catch (error) {
      console.error(`Failed to create ETF ${ticker}:`, error);
    }
  }

  /**
   * Create comprehensive derivative suite for top assets
   */
  async generateDerivatives(topAssetIds: string[], limit: number = 10): Promise<void> {
    console.log(`\n📊 Generating derivatives for top ${limit} assets...\n`);

    const topAssets = await db
      .select()
      .from(assets)
      .where(eq(assets.type, 'HER'))
      .limit(limit);

    let totalOptions = 0;
    let totalBonds = 0;

    // Generate options and bonds for each asset
    for (const asset of topAssets) {
      if (!asset.metadata || typeof asset.metadata !== 'object') continue;
      
      const metadata = asset.metadata as any;
      const basePrice = metadata.initialPrice || 100;
      const baseTicker = this.extractBaseTicker(asset.symbol);

      console.log(`\n🎯 Processing ${asset.name} (${asset.symbol})...`);

      // Create quarterly options for next year
      const optionExpirations = [
        { month: 'MAR' as MonthCode, year: 2025 },
        { month: 'JUN' as MonthCode, year: 2025 },
        { month: 'SEP' as MonthCode, year: 2025 },
        { month: 'DEC' as MonthCode, year: 2025 },
        { month: 'JAN' as MonthCode, year: 2026 }, // LEAP
      ];

      const optionsCreated = await this.createOptionsChain({
        assetId: asset.id,
        baseTicker,
        basePrice,
        expirationDates: optionExpirations,
        strikeSpacing: 25,
        numStrikes: 3
      });
      totalOptions += optionsCreated;

      // Create bonds with 2, 5, 10 year maturities
      const bondMaturities = [
        { month: 'DEC' as MonthCode, year: 2026, couponRate: 4.5 },
        { month: 'DEC' as MonthCode, year: 2029, couponRate: 5.0 },
        { month: 'DEC' as MonthCode, year: 2034, couponRate: 5.5 },
      ];

      const bondsCreated = await this.createBondSeries({
        assetId: asset.id,
        baseTicker,
        maturities: bondMaturities
      });
      totalBonds += bondsCreated;
    }

    // Create ETFs for major publishers
    await this.createETF({
      seriesCode: 'MRV',
      name: 'Marvel Universe ETF',
      description: 'Tracks the performance of Marvel Comics assets including heroes, villains, and key issues',
      constituents: topAssets.filter(a => a.metadata && (a.metadata as any).publisher?.includes('Marvel')).map(a => a.symbol)
    });

    await this.createETF({
      seriesCode: 'DC',
      name: 'DC Comics ETF',
      description: 'Tracks the performance of DC Comics assets including heroes, villains, and key issues',
      constituents: topAssets.filter(a => a.metadata && (a.metadata as any).publisher?.includes('DC')).map(a => a.symbol)
    });

    console.log(`\n✨ Derivative generation complete!`);
    console.log(`📊 Options/LEAPs created: ${totalOptions}`);
    console.log(`📊 Bonds created: ${totalBonds}`);
    console.log(`📊 ETFs created: 2`);
  }
}

export const derivativeGenerator = new DerivativeGenerator();
