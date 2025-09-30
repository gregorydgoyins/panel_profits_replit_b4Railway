import { type User, type Asset } from "@shared/schema";
import type { ShadowTrade, DarkPool, InsertShadowTrade } from "@shared/schema";
import { storage } from "../storage";

export interface ShadowPrice {
  assetId: string;
  realPrice: number;
  shadowPrice: number;
  divergence: number; // Percentage difference from real price
  corruptionRequired: number;
  arbitrageOpportunity: number; // Potential profit percentage
}

export interface ShadowOrderType {
  type: 'predatory' | 'vampire' | 'ghost';
  name: string;
  description: string;
  corruptionCost: number;
  profitMultiplier: number;
  targetingMechanism?: string;
}

export class ShadowEconomyService {
  private readonly CORRUPTION_THRESHOLDS = {
    LOW: { min: 0, max: 30, priceRange: { min: 0.95, max: 1.00 } },
    MEDIUM: { min: 30, max: 60, priceRange: { min: 0.80, max: 0.95 } },
    HIGH: { min: 60, max: 100, priceRange: { min: 0.60, max: 0.80 } },
  };

  private readonly SHADOW_ORDER_TYPES: ShadowOrderType[] = [
    {
      type: 'predatory',
      name: 'Predatory Order',
      description: 'Targets specific traders\' stop losses for guaranteed profit',
      corruptionCost: 15,
      profitMultiplier: 1.8,
      targetingMechanism: 'stop-loss-hunting'
    },
    {
      type: 'vampire',
      name: 'Vampire Trade',
      description: 'Siphons value from other active positions',
      corruptionCost: 20,
      profitMultiplier: 2.2,
      targetingMechanism: 'value-siphoning'
    },
    {
      type: 'ghost',
      name: 'Ghost Order',
      description: 'Invisible to normal traders, executes in the shadows',
      corruptionCost: 10,
      profitMultiplier: 1.5,
      targetingMechanism: 'hidden-execution'
    }
  ];

  /**
   * Calculate shadow price based on user's corruption level
   * More corrupt = better shadow prices (darker opportunities)
   */
  calculateShadowPrice(realPrice: number, userCorruption: number): ShadowPrice {
    // Determine corruption tier
    const tier = this.getCorruptionTier(userCorruption);
    
    // Calculate price multiplier based on corruption
    const { min, max } = tier.priceRange;
    const corruptionNormalized = (userCorruption - tier.min) / (tier.max - tier.min);
    
    // Inverted - higher corruption = lower shadow prices (better deals)
    const multiplier = max - (corruptionNormalized * (max - min));
    
    const shadowPrice = realPrice * multiplier;
    const divergence = ((realPrice - shadowPrice) / realPrice) * 100;
    const arbitrageOpportunity = divergence; // Direct correlation for now
    
    return {
      assetId: '',
      realPrice,
      shadowPrice,
      divergence,
      corruptionRequired: tier.min,
      arbitrageOpportunity
    };
  }

  /**
   * Calculate shadow prices for multiple assets
   */
  async calculateBulkShadowPrices(
    assetPrices: Map<string, number>, 
    userCorruption: number
  ): Promise<Map<string, ShadowPrice>> {
    const shadowPrices = new Map<string, ShadowPrice>();
    
    for (const [assetId, realPrice] of assetPrices) {
      const shadowPrice = this.calculateShadowPrice(realPrice, userCorruption);
      shadowPrice.assetId = assetId;
      shadowPrices.set(assetId, shadowPrice);
    }
    
    return shadowPrices;
  }

  /**
   * Get available shadow order types based on corruption level
   */
  getAvailableShadowOrders(userCorruption: number): ShadowOrderType[] {
    return this.SHADOW_ORDER_TYPES.filter(order => {
      // More corrupt = more order types available
      if (userCorruption >= 60) return true; // All types
      if (userCorruption >= 40) return order.type !== 'vampire'; // No vampire yet
      if (userCorruption >= 30) return order.type === 'ghost'; // Only ghost
      return []; // No shadow orders below 30
    });
  }

  /**
   * Execute a shadow market trade
   */
  async executeShadowTrade(
    userId: string,
    assetId: string,
    quantity: number,
    shadowPrice: number,
    realPrice: number,
    orderType: 'predatory' | 'vampire' | 'ghost',
    side: 'buy' | 'sell'
  ): Promise<{ trade: ShadowTrade; victim?: any; corruptionGained: number }> {
    const orderConfig = this.SHADOW_ORDER_TYPES.find(o => o.type === orderType);
    if (!orderConfig) {
      throw new Error('Invalid shadow order type');
    }

    // Calculate corruption gained (more for harmful trades)
    const baseCorruption = orderConfig.corruptionCost;
    const volumeMultiplier = Math.log10(quantity * shadowPrice) / 10;
    const corruptionGained = Math.floor(baseCorruption * (1 + volumeMultiplier));

    // Calculate profit/loss
    const profitMultiplier = orderConfig.profitMultiplier;
    const baseProfitLoss = (realPrice - shadowPrice) * quantity * (side === 'buy' ? 1 : -1);
    const finalProfitLoss = baseProfitLoss * profitMultiplier;

    // Create shadow trade record
    const shadowTrade: InsertShadowTrade = {
      userId,
      assetId,
      shadowPrice,
      realPrice,
      quantity,
      side,
      orderType,
      profitLoss: finalProfitLoss,
      corruptionGained,
      executedAt: new Date()
    };

    // Store the trade (temporarily return mock until storage is updated)
    const trade = { ...shadowTrade, id: 'temp-id' } as ShadowTrade;

    // Identify and create victim record if predatory/vampire trade
    let victim;
    if (orderType === 'predatory' || orderType === 'vampire') {
      victim = await this.createVictimRecord(userId, assetId, quantity, finalProfitLoss, orderType);
    }

    // Update user corruption
    await this.updateUserCorruption(userId, corruptionGained);

    return { trade, victim, corruptionGained };
  }

  /**
   * Get dark pool liquidity for an asset
   */
  async getDarkPoolLiquidity(assetId: string, userCorruption: number): Promise<DarkPool | null> {
    if (userCorruption < 30) return null; // No access to dark pools
    
    // Temporarily return null until storage is updated
    const pool = null;
    if (!pool) return null;

    // Filter based on access level
    if (pool.accessLevel > userCorruption) return null;
    
    return pool;
  }

  /**
   * Calculate dark pool metrics
   */
  async calculateDarkPoolMetrics(assetId: string): Promise<{
    shadowLiquidity: number;
    hiddenOrders: number;
    averageDivergence: number;
    bloodInTheWater: boolean; // Recent losses detected
  }> {
    // Temporarily use empty array until storage is updated
    const recentTrades: ShadowTrade[] = [];
    
    const shadowLiquidity = recentTrades.reduce((sum, t) => 
      sum + (t.quantity * t.shadowPrice), 0
    );
    
    const hiddenOrders = recentTrades.filter(t => t.orderType === 'ghost').length;
    
    const divergences = recentTrades.map(t => 
      Math.abs(((t.realPrice - t.shadowPrice) / t.realPrice) * 100)
    );
    const averageDivergence = divergences.reduce((a, b) => a + b, 0) / divergences.length;
    
    // Check for recent losses (blood in the water)
    const recentLosses = recentTrades.filter(t => 
      t.profitLoss < 0 && 
      new Date(t.executedAt).getTime() > Date.now() - 300000 // Last 5 minutes
    );
    const bloodInTheWater = recentLosses.length > 3;
    
    return {
      shadowLiquidity,
      hiddenOrders,
      averageDivergence,
      bloodInTheWater
    };
  }

  /**
   * Identify shadow market arbitrage opportunities
   */
  async findArbitrageOpportunities(
    userCorruption: number,
    minProfit: number = 5 // Minimum 5% profit
  ): Promise<Array<{
    assetId: string;
    symbol: string;
    realPrice: number;
    shadowPrice: number;
    potentialProfit: number;
    requiredCorruption: number;
  }>> {
    if (userCorruption < 30) return []; // No access to shadow market
    
    const assets = await storage.getAssets();
    const opportunities = [];
    
    for (const asset of assets) {
      // Temporarily use mock price until storage is updated
      const latestPrice = { price: Math.random() * 1000 + 100 };
      if (!latestPrice) continue;
      
      const shadowPrice = this.calculateShadowPrice(latestPrice.price, userCorruption);
      
      if (shadowPrice.arbitrageOpportunity >= minProfit) {
        opportunities.push({
          assetId: asset.id,
          symbol: asset.symbol,
          realPrice: latestPrice.price,
          shadowPrice: shadowPrice.shadowPrice,
          potentialProfit: shadowPrice.arbitrageOpportunity,
          requiredCorruption: shadowPrice.corruptionRequired
        });
      }
    }
    
    // Sort by profit potential
    return opportunities.sort((a, b) => b.potentialProfit - a.potentialProfit);
  }

  // Private helper methods
  private getCorruptionTier(corruption: number) {
    if (corruption >= 60) return this.CORRUPTION_THRESHOLDS.HIGH;
    if (corruption >= 30) return this.CORRUPTION_THRESHOLDS.MEDIUM;
    return this.CORRUPTION_THRESHOLDS.LOW;
  }

  private async createVictimRecord(
    attackerId: string, 
    assetId: string,
    quantity: number,
    profit: number,
    attackType: string
  ) {
    // Find a random user to be the "victim"
    // Temporarily use empty array until storage is updated
    const victims: User[] = [];
    if (victims.length === 0) return null;
    
    const victim = victims[0];
    
    // Temporarily skip victim record until storage is updated
    const victimRecord = null;
    /*await storage.createTradingVictim({
      victimId: victim.id,
      attackerId,
      assetId,
      lossAmount: Math.abs(profit), // Attacker's profit is victim's loss
      attackType,
      attackTimestamp: new Date()
    });*/
    
    return {
      ...victimRecord,
      victimName: victim.username,
      victimLevel: Math.floor(Math.random() * 50) + 1 // Random level for effect
    };
  }

  private async updateUserCorruption(userId: string, corruptionGained: number) {
    const user = await storage.getUser(userId);
    if (!user) return;
    
    const newCorruption = Math.min(100, (user.moralStanding?.corruption || 0) + corruptionGained);
    
    // Temporarily skip moral standing update until storage is updated
    /*await storage.updateMoralStanding(userId, {
      corruption: newCorruption,
      soulWeight: Math.max(0, 100 - newCorruption),
      lastCorruptAction: new Date()
    });*/
  }
}

// Export singleton instance
export const shadowEconomyService = new ShadowEconomyService();