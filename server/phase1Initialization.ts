/**
 * Phase 1 Core Trading Foundation Initialization Service
 * 
 * This service initializes all Phase 1 systems with seed data:
 * - Seven House Trading Firms
 * - Global Market Hours
 * - Information Tiers
 * - Sample Asset Financial Mappings
 * - Sample News Articles
 * - Sample NPC Traders
 */

import { databaseStorage } from './databaseStorage.js';
import {
  sevenHouseTradingFirms,
  globalMarketHours,
  informationTiers,
  sampleAssetMappings,
  sampleNewsArticles,
  sampleNpcTraders
} from './phase1SeedData.js';

export class Phase1Initializer {
  
  /**
   * Initialize all Phase 1 systems
   */
  static async initializeAllSystems(): Promise<{
    success: boolean;
    initialized: string[];
    errors: string[];
  }> {
    const results = {
      success: true,
      initialized: [],
      errors: []
    };

    console.log('🚀 Starting Phase 1 Core Trading Foundation initialization...');

    // Initialize Trading Firms
    try {
      await this.initializeTradingFirms();
      results.initialized.push('Trading Firms');
      console.log('✅ Trading Firms initialized');
    } catch (error) {
      results.success = false;
      results.errors.push(`Trading Firms: ${error}`);
      console.error('❌ Failed to initialize Trading Firms:', error);
    }

    // Initialize Global Market Hours
    try {
      await this.initializeGlobalMarketHours();
      results.initialized.push('Global Market Hours');
      console.log('✅ Global Market Hours initialized');
    } catch (error) {
      results.success = false;
      results.errors.push(`Global Market Hours: ${error}`);
      console.error('❌ Failed to initialize Global Market Hours:', error);
    }

    // Initialize Information Tiers
    try {
      await this.initializeInformationTiers();
      results.initialized.push('Information Tiers');
      console.log('✅ Information Tiers initialized');
    } catch (error) {
      results.success = false;
      results.errors.push(`Information Tiers: ${error}`);
      console.error('❌ Failed to initialize Information Tiers:', error);
    }

    // Initialize Sample Asset Mappings (if we have assets)
    try {
      await this.initializeSampleAssetMappings();
      results.initialized.push('Asset Financial Mappings');
      console.log('✅ Asset Financial Mappings initialized');
    } catch (error) {
      results.success = false;
      results.errors.push(`Asset Financial Mappings: ${error}`);
      console.error('❌ Failed to initialize Asset Financial Mappings:', error);
    }

    // Initialize Sample News Articles
    try {
      await this.initializeSampleNews();
      results.initialized.push('News Articles');
      console.log('✅ News Articles initialized');
    } catch (error) {
      results.success = false;
      results.errors.push(`News Articles: ${error}`);
      console.error('❌ Failed to initialize News Articles:', error);
    }

    // Initialize Sample NPC Traders
    try {
      await this.initializeSampleNpcTraders();
      results.initialized.push('NPC Traders');
      console.log('✅ NPC Traders initialized');
    } catch (error) {
      results.success = false;
      results.errors.push(`NPC Traders: ${error}`);
      console.error('❌ Failed to initialize NPC Traders:', error);
    }

    if (results.success) {
      console.log('🎉 Phase 1 Core Trading Foundation initialization completed successfully!');
    } else {
      console.log('⚠️ Phase 1 initialization completed with some errors');
    }

    return results;
  }

  /**
   * Initialize the Seven House Trading Firms
   */
  private static async initializeTradingFirms(): Promise<void> {
    console.log('Initializing Seven House Trading Firms...');
    
    for (const firmData of sevenHouseTradingFirms) {
      try {
        // Check if firm already exists
        const existing = await databaseStorage.getTradingFirmByCode(firmData.firmCode);
        
        if (!existing) {
          await databaseStorage.createTradingFirm(firmData);
          console.log(`  ✓ Created ${firmData.firmName} (${firmData.firmCode})`);
        } else {
          console.log(`  → ${firmData.firmName} already exists, skipping`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to create ${firmData.firmName}:`, error);
        throw error;
      }
    }
  }

  /**
   * Initialize Global Market Hours
   */
  private static async initializeGlobalMarketHours(): Promise<void> {
    console.log('Initializing Global Market Hours...');
    
    for (const marketData of globalMarketHours) {
      try {
        // Check if market already exists
        const existing = await databaseStorage.getGlobalMarketHours(marketData.marketCode);
        
        if (!existing) {
          await databaseStorage.createGlobalMarketHours(marketData);
          console.log(`  ✓ Created ${marketData.marketName} (${marketData.marketCode})`);
        } else {
          console.log(`  → ${marketData.marketName} already exists, skipping`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to create ${marketData.marketName}:`, error);
        throw error;
      }
    }
  }

  /**
   * Initialize Information Tiers
   */
  private static async initializeInformationTiers(): Promise<void> {
    console.log('Initializing Information Tiers...');
    
    for (const tierData of informationTiers) {
      try {
        // Check if tier already exists
        const existing = await databaseStorage.getInformationTier(tierData.tierName);
        
        if (!existing) {
          await databaseStorage.createInformationTier(tierData);
          console.log(`  ✓ Created ${tierData.tierName} tier`);
        } else {
          console.log(`  → ${tierData.tierName} tier already exists, skipping`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to create ${tierData.tierName} tier:`, error);
        throw error;
      }
    }
  }

  /**
   * Initialize Sample Asset Financial Mappings
   */
  private static async initializeSampleAssetMappings(): Promise<void> {
    console.log('Initializing Sample Asset Financial Mappings...');
    
    for (const mappingData of sampleAssetMappings) {
      try {
        // Check if mapping already exists
        const existing = await databaseStorage.getAssetFinancialMapping(mappingData.assetId);
        
        if (!existing) {
          await databaseStorage.createAssetFinancialMapping(mappingData);
          console.log(`  ✓ Created mapping for ${mappingData.assetId} (${mappingData.instrumentType})`);
        } else {
          console.log(`  → Mapping for ${mappingData.assetId} already exists, skipping`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to create mapping for ${mappingData.assetId}:`, error);
        // Don't throw error for sample data - asset might not exist yet
        console.log(`  → Skipping ${mappingData.assetId} (asset may not exist yet)`);
      }
    }
  }

  /**
   * Initialize Sample News Articles
   */
  private static async initializeSampleNews(): Promise<void> {
    console.log('Initializing Sample News Articles...');
    
    for (const articleData of sampleNewsArticles) {
      try {
        await databaseStorage.createNewsArticle(articleData);
        console.log(`  ✓ Created news article: ${articleData.headline.substring(0, 50)}...`);
      } catch (error) {
        console.error(`  ✗ Failed to create news article:`, error);
        throw error;
      }
    }
  }

  /**
   * Initialize Sample NPC Traders
   */
  private static async initializeSampleNpcTraders(): Promise<void> {
    console.log('Initializing Sample NPC Traders...');
    
    for (const traderData of sampleNpcTraders) {
      try {
        await databaseStorage.createNpcTrader(traderData);
        console.log(`  ✓ Created NPC trader: ${traderData.traderName} (${traderData.traderType})`);
      } catch (error) {
        console.error(`  ✗ Failed to create NPC trader ${traderData.traderName}:`, error);
        // Don't throw error for sample data - firm might not exist yet
        console.log(`  → Skipping ${traderData.traderName} (firm may not exist yet)`);
      }
    }
  }

  /**
   * Initialize Phase 1 for specific asset
   */
  static async initializeAssetPhase1(assetId: string, assetName: string, assetType: 'hero' | 'publisher' | 'creator' | 'key_comic'): Promise<void> {
    console.log(`Initializing Phase 1 systems for asset: ${assetName} (${assetId})`);

    try {
      // Create IMF Vault Settings
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() + 1); // 1 year from now

      const vaultSettings = {
        assetId,
        totalSharesIssued: "1000000.0000", // 1 million shares
        sharesInCirculation: "1000000.0000", // All shares initially in circulation
        sharesInVault: "0.0000",
        maxSharesAllowed: "1000000.0000", // No new shares after cutoff
        shareCreationCutoffDate: cutoffDate,
        vaultingThreshold: "90.00", // 90% threshold
        minHoldingPeriod: 30,
        vaultingFee: "0.0025", // 0.25% fee
        scarcityMultiplier: "1.0000",
        demandPressure: "0.00",
        supplyConstraint: "0.00",
        isVaultingActive: true,
        vaultStatus: "active",
        nextVaultingEvaluation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      await databaseStorage.createImfVaultSettings(vaultSettings);
      console.log(`  ✓ Created IMF vault settings for ${assetName}`);

      // Create Asset Financial Mapping
      let instrumentType: string;
      let instrumentSubtype: string;
      let securityType: string;

      switch (assetType) {
        case 'hero':
          instrumentType = 'common_stock';
          instrumentSubtype = 'character_stock';
          securityType = 'equity';
          break;
        case 'publisher':
          instrumentType = 'bond';
          instrumentSubtype = 'corporate_bond';
          securityType = 'debt';
          break;
        case 'creator':
          instrumentType = 'common_stock';
          instrumentSubtype = 'creator_stock';
          securityType = 'equity';
          break;
        case 'key_comic':
          instrumentType = 'preferred_stock';
          instrumentSubtype = 'key_comic_preferred';
          securityType = 'equity';
          break;
        default:
          instrumentType = 'common_stock';
          instrumentSubtype = 'general_stock';
          securityType = 'equity';
      }

      const financialMapping = {
        assetId,
        instrumentType,
        instrumentSubtype,
        shareClass: assetType === 'key_comic' ? 'P' : 'A',
        votingRights: assetType !== 'key_comic',
        dividendEligible: assetType === 'key_comic' || assetType === 'publisher',
        dividendYield: assetType === 'key_comic' ? "3.5000" : assetType === 'publisher' ? "4.2500" : undefined,
        creditRating: assetType === 'publisher' ? 'AA+' : undefined,
        couponRate: assetType === 'publisher' ? "4.2500" : undefined,
        faceValue: assetType === 'publisher' ? "1000.00" : undefined,
        securityType,
        exchangeListing: "PPX",
        lotSize: 1,
        tickSize: "0.0100",
        marginRequirement: assetType === 'publisher' ? "20.00" : "50.00",
        shortSellAllowed: assetType !== 'publisher'
      };

      await databaseStorage.createAssetFinancialMapping(financialMapping);
      console.log(`  ✓ Created financial mapping for ${assetName} as ${instrumentType}`);

    } catch (error) {
      console.error(`Failed to initialize Phase 1 for asset ${assetName}:`, error);
      throw error;
    }
  }

  /**
   * Check if Phase 1 is already initialized
   */
  static async isPhase1Initialized(): Promise<boolean> {
    try {
      const firms = await databaseStorage.getAllTradingFirms();
      const marketHours = await databaseStorage.getAllGlobalMarketHours();
      const tiers = await databaseStorage.getAllInformationTiers();

      return firms.length >= 7 && marketHours.length >= 5 && tiers.length >= 3;
    } catch (error) {
      console.error('Error checking Phase 1 initialization status:', error);
      return false;
    }
  }

  /**
   * Get Phase 1 initialization status
   */
  static async getInitializationStatus(): Promise<{
    tradingFirms: number;
    marketHours: number;
    informationTiers: number;
    assetMappings: number;
    npcTraders: number;
    newsArticles: number;
  }> {
    try {
      const [firms, markets, tiers, npcTraders] = await Promise.all([
        databaseStorage.getAllTradingFirms(),
        databaseStorage.getAllGlobalMarketHours(),
        databaseStorage.getAllInformationTiers(),
        databaseStorage.getActiveNpcTraders()
      ]);

      // Count asset mappings by type
      const [stockMappings, bondMappings, preferredMappings, etfMappings] = await Promise.all([
        databaseStorage.getAssetFinancialMappingsByType('common_stock'),
        databaseStorage.getAssetFinancialMappingsByType('bond'),
        databaseStorage.getAssetFinancialMappingsByType('preferred_stock'),
        databaseStorage.getAssetFinancialMappingsByType('etf')
      ]);

      const assetMappings = stockMappings.length + bondMappings.length + preferredMappings.length + etfMappings.length;

      // Count recent news articles (last 30 days)
      const recentNews = await databaseStorage.getNewsArticlesByTier('free', 100);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const newsArticles = recentNews.filter(article => 
        new Date(article.createdAt) >= thirtyDaysAgo
      ).length;

      return {
        tradingFirms: firms.length,
        marketHours: markets.length,
        informationTiers: tiers.length,
        assetMappings,
        npcTraders: npcTraders.length,
        newsArticles
      };
    } catch (error) {
      console.error('Error getting initialization status:', error);
      return {
        tradingFirms: 0,
        marketHours: 0,
        informationTiers: 0,
        assetMappings: 0,
        npcTraders: 0,
        newsArticles: 0
      };
    }
  }
}