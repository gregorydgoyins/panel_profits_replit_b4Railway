/**
 * Phase 1 Scheduled Services Architecture
 * 
 * Coordinates all Phase 1 trading foundation engines with proper intervals
 * and ensures continuous operation of sophisticated trading mechanics.
 */

import { storage } from './storage.js';
import { 
  OptionsCalculator, 
  NpcTradingEngine, 
  InformationTierManager 
} from './tradingEngine.js';
import { orderMatchingEngine } from './services/orderMatchingEngine.js';
import type { 
  AssetCurrentPrice, 
  OptionsChain, 
  NewsArticle, 
  NpcTrader,
  MarginAccount 
} from '@shared/schema.js';

export interface ScheduledServiceConfig {
  optionsUpdateInterval: number; // milliseconds
  npcTradingInterval: number;
  marginMaintenanceInterval: number;
  newsDistributionInterval: number;
  informationTierSyncInterval: number;
  orderMatchingInterval: number; // New: Order matching engine interval
}

export const DEFAULT_SERVICE_CONFIG: ScheduledServiceConfig = {
  optionsUpdateInterval: 30000,  // 30 seconds
  npcTradingInterval: 60000,     // 1 minute  
  marginMaintenanceInterval: 300000, // 5 minutes
  newsDistributionInterval: 120000,  // 2 minutes
  informationTierSyncInterval: 600000, // 10 minutes
  orderMatchingInterval: 5000, // 5 seconds - Fast order matching for responsive trading
};

export class Phase1ScheduledServices {
  private config: ScheduledServiceConfig;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;
  
  constructor(config: ScheduledServiceConfig = DEFAULT_SERVICE_CONFIG) {
    this.config = config;
  }

  /**
   * Start all Phase 1 scheduled services
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('⚠️ Phase 1 scheduled services already running');
      return;
    }

    console.log('🚀 Starting Phase 1 Scheduled Services Architecture...');
    
    // Options Chain Live Updates
    this.startOptionsChainUpdates();
    
    // NPC Trading Automation - temporarily disabled due to schema migration
    // this.startNpcTradingAutomation();
    
    // Margin Maintenance Cycle
    this.startMarginMaintenanceCycle();
    
    // Information Tier News Distribution
    this.startInformationTierServices();
    
    // Order Matching Engine - Core Trading Foundation
    this.startOrderMatchingEngine();
    
    this.isRunning = true;
    console.log('✅ Phase 1 Scheduled Services started successfully');
  }

  /**
   * Stop all scheduled services
   */
  stop(): void {
    console.log('🛑 Stopping Phase 1 Scheduled Services...');
    
    for (const [serviceName, interval] of this.intervals) {
      clearInterval(interval);
      console.log(`   Stopped: ${serviceName}`);
    }
    
    this.intervals.clear();
    this.isRunning = false;
    console.log('✅ All Phase 1 services stopped');
  }

  /**
   * CRITICAL: Options Chain Live Updates
   * Ties OptionsCalculator to current underlying prices
   */
  private startOptionsChainUpdates(): void {
    const interval = setInterval(async () => {
      try {
        await this.updateOptionsChains();
      } catch (error) {
        console.error('Options chain update failed:', error);
      }
    }, this.config.optionsUpdateInterval);
    
    this.intervals.set('optionsChainUpdates', interval);
    console.log(`📊 Options Chain updates scheduled every ${this.config.optionsUpdateInterval / 1000}s`);
  }

  /**
   * Update options chains with current underlying prices
   */
  private async updateOptionsChains(): Promise<void> {
    try {
      // Get all options chains that need updates
      const optionsChains = await storage.getAllOptionsChains();
      
      if (optionsChains.length === 0) return;
      
      console.log(`📈 Updating ${optionsChains.length} options chains...`);
      
      let updatedCount = 0;
      
      for (const chain of optionsChains) {
        try {
          // Get current underlying price
          const currentPrice = await storage.getAssetCurrentPrice(chain.underlyingAssetId);
          if (!currentPrice) continue;
          
          const underlyingPrice = parseFloat(currentPrice.currentPrice);
          const strikePrice = parseFloat(chain.strikePrice);
          const volatility = parseFloat(currentPrice.volatility || '0.25');
          
          // Calculate time to expiration in years
          const expirationDate = new Date(chain.expirationDate);
          const now = new Date();
          const timeToExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
          
          if (timeToExpiration <= 0) {
            // Option expired, mark as such
            await storage.updateOptionsChain(chain.id, {
              isActive: false,
              lastUpdate: new Date()
            });
            continue;
          }
          
          // Calculate option pricing and Greeks
          const pricing = OptionsCalculator.calculateOptionPricing(
            underlyingPrice,
            strikePrice,
            timeToExpiration,
            0.05, // risk-free rate
            volatility,
            chain.optionType as 'call' | 'put'
          );
          
          // Update options chain with new pricing
          await storage.updateOptionsChain(chain.id, {
            bidPrice: (pricing.price * 0.995).toString(), // Bid slightly below theoretical
            askPrice: (pricing.price * 1.005).toString(), // Ask slightly above theoretical
            lastPrice: pricing.price.toString(),
            markPrice: pricing.price.toString(),
            impliedVolatility: volatility.toString(),
            delta: pricing.delta.toString(),
            gamma: pricing.gamma.toString(),
            theta: pricing.theta.toString(),
            vega: pricing.vega.toString(),
            rho: pricing.rho.toString(),
            intrinsicValue: pricing.intrinsicValue.toString(),
            timeValue: pricing.timeValue.toString(),
            lastUpdate: new Date()
          });
          
          updatedCount++;
          
        } catch (error) {
          console.error(`Failed to update options chain ${chain.id}:`, error);
        }
      }
      
      if (updatedCount > 0) {
        console.log(`📊 Updated ${updatedCount} options chains with live pricing`);
      }
      
    } catch (error) {
      console.error('Options chain update cycle failed:', error);
    }
  }

  /**
   * CRITICAL: NPC Trading Automation
   * Executes NPC whale trading cycles for market liquidity
   */
  private startNpcTradingAutomation(): void {
    const interval = setInterval(async () => {
      try {
        const results = await NpcTradingEngine.executeNpcTradingCycle(storage, null);
        
        if (results.ordersCreated > 0) {
          console.log(`🤖 NPC Trading: ${results.ordersCreated} orders, $${results.totalVolume.toFixed(2)} volume`);
        }
        
        if (results.errors.length > 0) {
          console.error('NPC Trading errors:', results.errors);
        }
        
      } catch (error) {
        console.error('NPC trading automation failed:', error);
      }
    }, this.config.npcTradingInterval);
    
    this.intervals.set('npcTradingAutomation', interval);
    console.log(`🤖 NPC Trading automated every ${this.config.npcTradingInterval / 1000}s`);
  }

  /**
   * CRITICAL: Margin Maintenance Cycle
   * Monitors margin accounts and triggers margin calls
   */
  private startMarginMaintenanceCycle(): void {
    const interval = setInterval(async () => {
      try {
        await this.performMarginMaintenance();
      } catch (error) {
        console.error('Margin maintenance failed:', error);
      }
    }, this.config.marginMaintenanceInterval);
    
    this.intervals.set('marginMaintenance', interval);
    console.log(`💳 Margin maintenance scheduled every ${this.config.marginMaintenanceInterval / 1000}s`);
  }

  /**
   * Perform margin maintenance checks
   */
  private async performMarginMaintenance(): Promise<void> {
    try {
      const marginAccounts = await storage.getAllMarginAccounts();
      
      if (marginAccounts.length === 0) return;
      
      console.log(`💳 Checking ${marginAccounts.length} margin accounts...`);
      
      let maintenanceCallsIssued = 0;
      
      for (const account of marginAccounts) {
        try {
          const marginEquity = parseFloat(account.marginEquity);
          const marginDebt = parseFloat(account.marginDebt);
          const maintenanceMargin = parseFloat(account.maintenanceMargin);
          
          // Check if account is below maintenance margin
          if (marginEquity < maintenanceMargin && marginDebt > 0) {
            
            // Calculate required deposit
            const shortfall = maintenanceMargin - marginEquity;
            
            // Update account status and issue margin call
            await storage.updateMarginAccount(account.id, {
              marginCallDate: new Date(),
              marginCallAmount: shortfall.toString(),
              accountStatus: 'margin_call'
            });
            
            console.log(`⚠️ Margin call issued for user ${account.userId}: $${shortfall.toFixed(2)} required`);
            maintenanceCallsIssued++;
            
            // TODO: Trigger notification to user about margin call
          }
          
        } catch (error) {
          console.error(`Failed to check margin account ${account.id}:`, error);
        }
      }
      
      if (maintenanceCallsIssued > 0) {
        console.log(`💳 Issued ${maintenanceCallsIssued} margin calls`);
      }
      
    } catch (error) {
      console.error('Margin maintenance cycle failed:', error);
    }
  }

  /**
   * CRITICAL: Information Tier Services
   * Makes information tier the SINGLE source of truth for market news
   */
  private startInformationTierServices(): void {
    const interval = setInterval(async () => {
      try {
        await this.distributeInformationTierNews();
      } catch (error) {
        console.error('Information tier services failed:', error);
      }
    }, this.config.newsDistributionInterval);
    
    this.intervals.set('informationTierServices', interval);
    console.log(`📰 Information tier services scheduled every ${this.config.newsDistributionInterval / 1000}s`);
  }

  /**
   * Distribute news based on information tiers
   */
  private async distributeInformationTierNews(): Promise<void> {
    try {
      // Get all active news articles that haven't been distributed yet
      const pendingNews = await storage.getNewsArticles({ 
        isActive: true,
        distributionStatus: 'pending' 
      });
      
      if (pendingNews.length === 0) return;
      
      console.log(`📰 Distributing ${pendingNews.length} news articles by information tier...`);
      
      // Get all information tiers
      const informationTiers = await storage.getAllInformationTiers();
      
      for (const newsArticle of pendingNews) {
        try {
          const requiredTier = newsArticle.requiredInformationTier;
          const tierData = informationTiers.find(t => t.id === requiredTier);
          
          if (!tierData) {
            console.warn(`No tier data found for tier ${requiredTier}`);
            continue;
          }
          
          // Get users with access to this tier
          const eligibleUsers = await storage.getUsersByInformationTier(requiredTier);
          
          // Distribute to eligible users
          for (const user of eligibleUsers) {
            // TODO: Create user-specific news delivery record
            // This would track who has access to what news when
          }
          
          // Mark article as distributed
          await storage.updateNewsArticle(newsArticle.id, {
            distributionStatus: 'distributed',
            distributionTime: new Date()
          });
          
          console.log(`📰 Distributed "${newsArticle.headline}" to ${eligibleUsers.length} ${tierData.name} tier users`);
          
        } catch (error) {
          console.error(`Failed to distribute news article ${newsArticle.id}:`, error);
        }
      }
      
    } catch (error) {
      console.error('News distribution cycle failed:', error);
    }
  }

  /**
   * CRITICAL: Order Matching Engine
   * Matches limit orders and executes trades based on price movements
   */
  private startOrderMatchingEngine(): void {
    const interval = setInterval(async () => {
      try {
        await orderMatchingEngine.processOrders();
      } catch (error) {
        console.error('Order matching engine failed:', error);
      }
    }, this.config.orderMatchingInterval);
    
    this.intervals.set('orderMatchingEngine', interval);
    console.log(`⚡ Order Matching Engine scheduled every ${this.config.orderMatchingInterval / 1000}s`);
  }

  /**
   * Get status of all scheduled services
   */
  getStatus(): {
    isRunning: boolean;
    activeServices: string[];
    config: ScheduledServiceConfig;
  } {
    return {
      isRunning: this.isRunning,
      activeServices: Array.from(this.intervals.keys()),
      config: this.config
    };
  }
}

// Global instance for use throughout the application
export const phase1Services = new Phase1ScheduledServices();