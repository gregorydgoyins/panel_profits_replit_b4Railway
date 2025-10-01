/**
 * Phase 1 Core Trading Foundation Engine
 * 
 * This file contains the core trading engine services for:
 * - Options Greeks Calculations (Black-Scholes)
 * - Market Hours Management
 * - IMF Vaulting System Logic
 * - NPC Trading AI Behaviors
 * - Scarcity Mechanism Calculations
 */

import type {
  OptionsChain, AssetCurrentPrice, ImfVaultSettings,
  NpcTrader, GlobalMarketHours, NewsArticle, TradingFirm
} from '@shared/schema.js';

// Black-Scholes and Options Greeks Calculator
export class OptionsCalculator {
  
  /**
   * Calculate the cumulative standard normal distribution
   */
  private static cumulativeNormalDistribution(x: number): number {
    // Approximation using polynomial
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
  }

  /**
   * Calculate d1 for Black-Scholes formula
   */
  private static calculateD1(S: number, K: number, r: number, T: number, sigma: number): number {
    return (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  }

  /**
   * Calculate d2 for Black-Scholes formula
   */
  private static calculateD2(d1: number, sigma: number, T: number): number {
    return d1 - sigma * Math.sqrt(T);
  }

  /**
   * Calculate Black-Scholes option price and Greeks
   */
  static calculateOptionPricing(
    underlyingPrice: number,
    strikePrice: number,
    timeToExpiration: number, // in years
    riskFreeRate: number = 0.05, // 5% default
    volatility: number,
    optionType: 'call' | 'put'
  ): {
    price: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    intrinsicValue: number;
    timeValue: number;
  } {
    
    const S = underlyingPrice;
    const K = strikePrice;
    const r = riskFreeRate;
    const T = timeToExpiration;
    const sigma = volatility;

    const d1 = this.calculateD1(S, K, r, T, sigma);
    const d2 = this.calculateD2(d1, sigma, T);

    const Nd1 = this.cumulativeNormalDistribution(d1);
    const Nd2 = this.cumulativeNormalDistribution(d2);
    const NminusD1 = this.cumulativeNormalDistribution(-d1);
    const NminusD2 = this.cumulativeNormalDistribution(-d2);

    let price: number;
    let delta: number;
    let rho: number;
    let intrinsicValue: number;

    if (optionType === 'call') {
      price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
      delta = Nd1;
      rho = K * T * Math.exp(-r * T) * Nd2 / 100; // Rho per 1% change in interest rate
      intrinsicValue = Math.max(S - K, 0);
    } else {
      price = K * Math.exp(-r * T) * NminusD2 - S * NminusD1;
      delta = -NminusD1;
      rho = -K * T * Math.exp(-r * T) * NminusD2 / 100;
      intrinsicValue = Math.max(K - S, 0);
    }

    // Gamma is same for calls and puts
    const gamma = Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(2 * Math.PI * T));

    // Theta (time decay) - per day
    const theta = optionType === 'call' 
      ? -(S * Math.exp(-d1 * d1 / 2) * sigma) / (2 * Math.sqrt(2 * Math.PI * T)) - r * K * Math.exp(-r * T) * Nd2
      : -(S * Math.exp(-d1 * d1 / 2) * sigma) / (2 * Math.sqrt(2 * Math.PI * T)) + r * K * Math.exp(-r * T) * NminusD2;
    
    const thetaPerDay = theta / 365;

    // Vega (volatility sensitivity) - per 1% change in volatility
    const vega = S * Math.sqrt(T) * Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI) / 100;

    const timeValue = price - intrinsicValue;

    return {
      price: Math.max(price, 0),
      delta: delta,
      gamma: gamma,
      theta: thetaPerDay,
      vega: vega,
      rho: rho,
      intrinsicValue: intrinsicValue,
      timeValue: Math.max(timeValue, 0)
    };
  }

  /**
   * Calculate implied volatility using Newton-Raphson method
   */
  static calculateImpliedVolatility(
    marketPrice: number,
    underlyingPrice: number,
    strikePrice: number,
    timeToExpiration: number,
    riskFreeRate: number = 0.05,
    optionType: 'call' | 'put',
    tolerance: number = 0.0001,
    maxIterations: number = 100
  ): number {
    
    let sigma = 0.3; // Initial guess: 30% volatility
    
    for (let i = 0; i < maxIterations; i++) {
      const pricing = this.calculateOptionPricing(
        underlyingPrice, strikePrice, timeToExpiration, riskFreeRate, sigma, optionType
      );
      
      const priceDiff = pricing.price - marketPrice;
      
      if (Math.abs(priceDiff) < tolerance) {
        return sigma;
      }
      
      const vega = pricing.vega * 100; // Convert back to absolute vega
      
      if (vega === 0) {
        break; // Avoid division by zero
      }
      
      sigma = sigma - priceDiff / vega;
      
      // Ensure volatility stays positive and reasonable
      sigma = Math.max(0.001, Math.min(sigma, 5.0));
    }
    
    return sigma;
  }
}

// Market Hours Manager
export class MarketHoursManager {
  
  /**
   * Check if a specific market is currently open
   */
  static isMarketOpen(marketHours: GlobalMarketHours): boolean {
    const now = new Date();
    const marketTime = new Date(now.toLocaleString("en-US", {timeZone: marketHours.timezone}));
    
    const [openHour, openMinute] = marketHours.regularOpenTime.split(':').map(Number);
    const [closeHour, closeMinute] = marketHours.regularCloseTime.split(':').map(Number);
    
    const openTime = new Date(marketTime);
    openTime.setHours(openHour, openMinute, 0, 0);
    
    const closeTime = new Date(marketTime);
    closeTime.setHours(closeHour, closeMinute, 0, 0);
    
    // Check if it's a weekend
    const dayOfWeek = marketTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      return false;
    }
    
    // Check if it's a holiday (simplified check)
    const today = marketTime.toISOString().split('T')[0];
    if (marketHours.holidaySchedule && marketHours.holidaySchedule.includes(today)) {
      return false;
    }
    
    return marketTime >= openTime && marketTime <= closeTime;
  }
  
  /**
   * Get the next market open time
   */
  static getNextMarketOpen(marketHours: GlobalMarketHours): Date {
    const now = new Date();
    const marketTime = new Date(now.toLocaleString("en-US", {timeZone: marketHours.timezone}));
    
    const [openHour, openMinute] = marketHours.regularOpenTime.split(':').map(Number);
    
    let nextOpen = new Date(marketTime);
    nextOpen.setHours(openHour, openMinute, 0, 0);
    
    // If market opening time has passed today, move to next business day
    if (nextOpen <= marketTime) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    // Skip weekends
    while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    return nextOpen;
  }
  
  /**
   * Calculate cross-market trading adjustment factor
   */
  static getCrossMarketAdjustment(
    primaryMarket: GlobalMarketHours,
    tradingMarket: GlobalMarketHours
  ): number {
    const primaryOpen = this.isMarketOpen(primaryMarket);
    const tradingOpen = this.isMarketOpen(tradingMarket);
    
    if (primaryOpen && tradingOpen) {
      return 1.0; // No adjustment needed
    } else if (!primaryOpen && tradingOpen) {
      return 0.8; // Reduced liquidity when primary market closed
    } else if (primaryOpen && !tradingOpen) {
      return 1.2; // Premium for off-hours trading
    } else {
      return 0.6; // Both markets closed, minimal trading
    }
  }
}

// IMF Vaulting System Engine
export class ImfVaultingEngine {
  
  /**
   * Calculate scarcity multiplier based on supply and demand
   */
  static calculateScarcityMultiplier(vaultSettings: ImfVaultSettings): number {
    const circulationRatio = Number(vaultSettings.sharesInCirculation) / Number(vaultSettings.totalSharesIssued);
    const demandPressure = Number(vaultSettings.demandPressure);
    const supplyConstraint = Number(vaultSettings.supplyConstraint);
    
    // Base scarcity calculation
    let scarcityMultiplier = 1.0;
    
    // Increase multiplier as circulation decreases (more shares vaulted)
    if (circulationRatio < 0.5) {
      scarcityMultiplier += (0.5 - circulationRatio) * 2.0; // Up to 2x multiplier
    }
    
    // Factor in demand pressure
    scarcityMultiplier += (demandPressure / 100) * 0.5;
    
    // Factor in supply constraint
    scarcityMultiplier += (supplyConstraint / 100) * 0.3;
    
    // Ensure reasonable bounds
    return Math.max(1.0, Math.min(scarcityMultiplier, 5.0));
  }
  
  /**
   * Determine if an asset should be vaulted based on market conditions
   */
  static shouldTriggerVaulting(
    vaultSettings: ImfVaultSettings,
    currentPrice: number,
    marketCap: number,
    volumeRatio: number
  ): boolean {
    const vaultingThreshold = Number(vaultSettings.vaultingThreshold);
    const minHoldingPeriod = vaultSettings.minHoldingPeriod || 30;
    
    // Check if enough time has passed since last evaluation
    const lastUpdate = new Date(vaultSettings.lastScarcityUpdate || Date.now());
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < minHoldingPeriod) {
      return false;
    }
    
    // Check market cap threshold
    const totalValue = Number(vaultSettings.totalSharesIssued) * currentPrice;
    const marketCapThreshold = totalValue * (vaultingThreshold / 100);
    
    // Trigger vaulting if market cap exceeds threshold and volume is low
    return marketCap >= marketCapThreshold && volumeRatio < 0.1; // Low volume indicates holding
  }
  
  /**
   * Calculate vaulting fee
   */
  static calculateVaultingFee(
    vaultSettings: ImfVaultSettings,
    sharesAmount: number,
    currentPrice: number
  ): number {
    const feeRate = Number(vaultSettings.vaultingFee);
    const tradeValue = sharesAmount * currentPrice;
    return tradeValue * feeRate;
  }
}

// NPC Trading AI Engine
export class NpcTradingEngine {
  
  /**
   * Calculate NPC trading decision based on personality and market conditions
   */
  static calculateTradingDecision(
    trader: NpcTrader,
    assetPrice: number,
    priceHistory: number[],
    marketSentiment: number,
    volumeProfile: number
  ): {
    action: 'buy' | 'sell' | 'hold';
    quantity: number;
    urgency: number;
    confidence: number;
  } {
    
    const personality = trader.tradingPersonality as any;
    const aggressiveness = Number(trader.aggressiveness) / 100;
    const intelligence = Number(trader.intelligence) / 100;
    const emotionality = Number(trader.emotionality) / 100;
    const adaptability = Number(trader.adaptability) / 100;
    
    // Calculate price momentum
    const momentum = priceHistory.length >= 2 
      ? (assetPrice - priceHistory[priceHistory.length - 2]) / priceHistory[priceHistory.length - 2]
      : 0;
    
    // Calculate volatility
    const volatility = priceHistory.length >= 5
      ? this.calculateVolatility(priceHistory.slice(-5))
      : 0.2; // Default volatility
    
    let buyProbability = 0.5; // Neutral starting point
    let sellProbability = 0.5;
    
    // Adjust based on trader type
    switch (trader.traderType) {
      case 'whale':
        // Whales prefer large, stable moves
        if (volatility < 0.1 && Math.abs(momentum) > 0.02) {
          buyProbability += momentum > 0 ? 0.3 : -0.3;
        }
        break;
        
      case 'momentum':
        // Momentum traders follow price direction
        buyProbability += momentum * 2;
        if (volumeProfile > 1.5) buyProbability += 0.2; // High volume confirmation
        break;
        
      case 'contrarian':
        // Contrarians trade against sentiment
        buyProbability -= marketSentiment * 0.3;
        if (momentum < -0.05) buyProbability += 0.4; // Buy on dips
        break;
        
      case 'arbitrage':
        // Arbitrage traders look for pricing inefficiencies
        const pricingEfficiency = this.calculatePricingEfficiency(assetPrice, priceHistory);
        if (pricingEfficiency < 0.8) buyProbability += 0.3;
        break;
    }
    
    // Apply personality factors
    buyProbability += (aggressiveness - 0.5) * 0.3;
    buyProbability += (marketSentiment * emotionality - 0.5) * 0.2;
    
    // Intelligence affects decision quality
    const noiseReduction = intelligence * 0.2;
    buyProbability = buyProbability * (1 - noiseReduction) + 0.5 * noiseReduction;
    
    // Determine action
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    if (buyProbability > 0.6) {
      action = 'buy';
    } else if (buyProbability < 0.4) {
      action = 'sell';
    }
    
    // Calculate quantity based on available capital and position sizing
    const maxPosition = Number(trader.maxPositionSize);
    const availableCapital = Number(trader.availableCapital);
    const maxQuantity = Math.min(maxPosition / assetPrice, availableCapital / assetPrice);
    
    let quantity = 0;
    if (action !== 'hold') {
      const positionSizing = Math.abs(buyProbability - 0.5) * 2; // 0 to 1
      quantity = maxQuantity * positionSizing * aggressiveness;
    }
    
    const urgency = Math.abs(buyProbability - 0.5) * 2;
    const confidence = intelligence * (1 - volatility);
    
    return {
      action,
      quantity: Math.floor(quantity),
      urgency,
      confidence
    };
  }
  
  /**
   * Calculate volatility from price history
   */
  private static calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0.2;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance * 252); // Annualized volatility
  }
  
  /**
   * Calculate pricing efficiency for arbitrage opportunities
   */
  private static calculatePricingEfficiency(currentPrice: number, priceHistory: number[]): number {
    if (priceHistory.length < 3) return 1.0;
    
    const expectedPrice = priceHistory.slice(-3).reduce((sum, p) => sum + p, 0) / 3;
    const priceDifference = Math.abs(currentPrice - expectedPrice) / expectedPrice;
    
    return Math.max(0, 1 - priceDifference * 5); // 0 to 1, where 1 is perfectly efficient
  }
  
  /**
   * Update NPC trader performance metrics
   */
  static updateTraderPerformance(
    trader: NpcTrader,
    tradeResult: {
      profit: number;
      winningTrade: boolean;
      tradeReturn: number;
    }
  ): Partial<NpcTrader> {
    
    const totalTrades = (trader.totalTrades || 0) + 1;
    const currentWinRate = Number(trader.winRate || 0);
    const currentAvgReturn = Number(trader.avgTradeReturn || 0);
    const currentTotalPnL = Number(trader.totalPnL || 0);
    
    // Update win rate
    const newWinRate = ((currentWinRate * (totalTrades - 1)) + (tradeResult.winningTrade ? 100 : 0)) / totalTrades;
    
    // Update average trade return
    const newAvgReturn = ((currentAvgReturn * (totalTrades - 1)) + tradeResult.tradeReturn) / totalTrades;
    
    // Update total P&L
    const newTotalPnL = currentTotalPnL + tradeResult.profit;
    
    return {
      totalTrades,
      winRate: newWinRate.toString(),
      avgTradeReturn: newAvgReturn.toString(),
      totalPnL: newTotalPnL.toString(),
      lastTradeTime: new Date()
    };
  }

  /**
   * PHASE 1 CRITICAL: Execute NPC Trading Cycle for market liquidity
   */
  static async executeNpcTradingCycle(
    storage: any,
    marketEngine: any
  ): Promise<{
    tradersProcessed: number;
    ordersCreated: number;
    totalVolume: number;
    errors: string[];
  }> {
    console.log('🤖 Starting NPC Trading Cycle...');
    
    const results = {
      tradersProcessed: 0,
      ordersCreated: 0,
      totalVolume: 0,
      errors: []
    };
    
    try {
      // Get all active NPC traders
      const npcTraders = await storage.getAllNpcTraders({ isActive: true });
      
      if (npcTraders.length === 0) {
        console.log('📭 No active NPC traders found');
        return results;
      }
      
      console.log(`🎯 Processing ${npcTraders.length} active NPC traders`);
      
      // Get market data for trading decisions
      const assets = await storage.getAssets();
      const marketData = new Map();
      
      for (const asset of assets) {
        const currentPrice = await storage.getAssetCurrentPrice(asset.id);
        if (currentPrice) {
          marketData.set(asset.id, {
            asset,
            currentPrice,
            priceHistory: [] // We'll simulate this for now
          });
        }
      }
      
      // Process each NPC trader
      for (const trader of npcTraders) {
        try {
          results.tradersProcessed++;
          
          // Skip if trader recently traded (respect trading frequency)
          const lastTradeTime = trader.lastTradeTime ? new Date(trader.lastTradeTime) : new Date(0);
          const timeSinceLastTrade = Date.now() - lastTradeTime.getTime();
          const minTradingInterval = 5 * 60 * 1000; // 5 minutes minimum
          
          if (timeSinceLastTrade < minTradingInterval) {
            continue;
          }
          
          // Randomly select assets for trading decision (simulate market scanning)
          const availableAssets = Array.from(marketData.keys());
          const assetsToConsider = availableAssets
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(5, availableAssets.length)); // Consider up to 5 assets
          
          for (const assetId of assetsToConsider) {
            const data = marketData.get(assetId);
            if (!data) continue;
            
            const currentPrice = parseFloat(data.currentPrice.currentPrice);
            
            // Generate some price history (simplified)
            const priceHistory = [
              currentPrice * (0.95 + Math.random() * 0.1),
              currentPrice * (0.97 + Math.random() * 0.06),
              currentPrice * (0.98 + Math.random() * 0.04),
              currentPrice
            ];
            
            // Calculate market sentiment (simplified)
            const marketSentiment = (Math.random() - 0.5) * 2; // -1 to 1
            const volumeProfile = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
            
            const decision = this.calculateTradingDecision(
              trader,
              currentPrice,
              priceHistory,
              marketSentiment,
              volumeProfile
            );
            
            // Execute trade if decision is not 'hold' and confidence is high enough
            if (decision.action !== 'hold' && decision.confidence > 0.7 && decision.quantity > 0) {
              
              // Create NPC portfolio if it doesn't exist
              let npcPortfolio = await storage.getPortfolioByUserId(trader.id);
              if (!npcPortfolio) {
                const portfolioData = {
                  userId: trader.id,
                  name: `${trader.traderName} Portfolio`,
                  totalValue: trader.availableCapital,
                  cashBalance: trader.availableCapital,
                  initialCashAllocation: trader.availableCapital
                };
                npcPortfolio = await storage.createPortfolio(portfolioData);
              }
              
              // Create order for NPC trader
              const orderData = {
                userId: trader.id,
                portfolioId: npcPortfolio.id,
                assetId: assetId,
                type: decision.action as 'buy' | 'sell',
                orderType: Math.random() > 0.3 ? 'market' : 'limit', // 70% market, 30% limit
                quantity: Math.min(decision.quantity, 100).toString(), // Cap at 100 shares
                price: decision.action === 'buy' 
                  ? (currentPrice * 1.001).toString() // Slightly above market for buy limits
                  : (currentPrice * 0.999).toString(), // Slightly below market for sell limits
                metadata: {
                  npcTrader: true,
                  confidence: decision.confidence,
                  urgency: decision.urgency,
                  traderType: trader.traderType
                }
              };
              
              const order = await storage.createOrder(orderData);
              results.ordersCreated++;
              results.totalVolume += parseFloat(orderData.quantity) * currentPrice;
              
              console.log(`🤖 ${trader.traderName} (${trader.traderType}) placed ${decision.action} order for ${orderData.quantity} ${data.asset.symbol} at $${currentPrice.toFixed(2)}`);
              
              // Update trader's last trade time
              await storage.updateNpcTrader(trader.id, {
                lastTradeTime: new Date()
              });
              
              break; // Only one trade per cycle per trader
            }
          }
          
        } catch (error) {
          const errorMsg = `Failed to process trader ${trader.traderName}: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      }
      
      console.log(`✅ NPC Trading Cycle Complete: ${results.ordersCreated} orders, $${results.totalVolume.toFixed(2)} volume`);
      
    } catch (error) {
      const errorMsg = `NPC Trading Cycle failed: ${error}`;
      console.error(errorMsg);
      results.errors.push(errorMsg);
    }
    
    return results;
  }
}

// Information Tier Access Manager
export class InformationTierManager {
  
  /**
   * Check if user has access to news based on their tier
   */
  static hasNewsAccess(
    userTier: 'elite' | 'pro' | 'free',
    article: NewsArticle
  ): boolean {
    const now = new Date();
    
    switch (userTier) {
      case 'elite':
        return now >= new Date(article.eliteReleaseTime);
      case 'pro':
        return now >= new Date(article.proReleaseTime);
      case 'free':
        return now >= new Date(article.freeReleaseTime);
      default:
        return false;
    }
  }
  
  /**
   * Get news access delay for user tier
   */
  static getNewsDelay(userTier: 'elite' | 'pro' | 'free'): number {
    switch (userTier) {
      case 'elite': return 0;
      case 'pro': return 15;
      case 'free': return 30;
      default: return 60;
    }
  }
  
  /**
   * Calculate analysis quality score based on tier
   */
  static getAnalysisQuality(userTier: 'elite' | 'pro' | 'free'): {
    accuracy: number;
    depth: string;
    features: string[];
  } {
    switch (userTier) {
      case 'elite':
        return {
          accuracy: 0.95,
          depth: 'comprehensive',
          features: ['advanced_charting', 'whale_tracking', 'firm_intelligence', 'exclusive_research']
        };
      case 'pro':
        return {
          accuracy: 0.85,
          depth: 'standard',
          features: ['advanced_charting', 'real_time_alerts']
        };
      case 'free':
        return {
          accuracy: 0.70,
          depth: 'basic',
          features: ['basic_charting']
        };
      default:
        return {
          accuracy: 0.50,
          depth: 'minimal',
          features: []
        };
    }
  }
}

// Trading Firm Specialty Engine
export class TradingFirmEngine {
  
  /**
   * Calculate trading bonus/penalty for a firm based on asset type
   */
  static calculateFirmBonus(
    firm: TradingFirm,
    assetType: string,
    tradeSize: number
  ): {
    bonusMultiplier: number;
    specialtyMatch: boolean;
    explanation: string;
  } {
    
    const specialties = firm.primarySpecialties || [];
    const weaknesses = firm.weaknesses || [];
    const specialtyBonuses = (firm.specialtyBonuses as any) || {};
    const weaknessPenalties = (firm.weaknessPenalties as any) || {};
    
    let bonusMultiplier = 1.0;
    let specialtyMatch = false;
    let explanation = '';
    
    // Check for specialty bonuses
    for (const specialty of specialties) {
      if (assetType.includes(specialty) || specialty === assetType) {
        const bonus = specialtyBonuses[specialty] || 0;
        bonusMultiplier += bonus / 100;
        specialtyMatch = true;
        explanation += `${specialty} specialty bonus: +${bonus}%. `;
        break;
      }
    }
    
    // Check for weakness penalties
    for (const weakness of weaknesses) {
      if (assetType.includes(weakness) || weakness === assetType) {
        const penalty = weaknessPenalties[weakness] || 0;
        bonusMultiplier += penalty / 100; // Penalties are negative
        explanation += `${weakness} weakness penalty: ${penalty}%. `;
        break;
      }
    }
    
    // Adjust based on trade size vs firm capacity
    const tradeRatio = tradeSize / Number(firm.marketCapacityUSD);
    if (tradeRatio > 0.1) { // Large trade relative to capacity
      bonusMultiplier *= 0.9; // 10% penalty for oversized trades
      explanation += 'Large trade size penalty: -10%. ';
    }
    
    return {
      bonusMultiplier: Math.max(0.1, bonusMultiplier), // Minimum 10% of normal execution
      specialtyMatch,
      explanation: explanation.trim()
    };
  }
  
  /**
   * Calculate firm reputation impact from trade performance
   */
  static calculateReputationImpact(
    firm: TradingFirm,
    tradePerformance: {
      successful: boolean;
      profitLoss: number;
      clientSatisfaction: number;
    }
  ): number {
    
    const currentReputation = Number(firm.reputation || 50);
    let reputationChange = 0;
    
    // Base reputation change from trade success
    if (tradePerformance.successful) {
      reputationChange += 0.1;
    } else {
      reputationChange -= 0.2;
    }
    
    // Factor in profit/loss magnitude
    const profitImpact = Math.min(Math.abs(tradePerformance.profitLoss) / 1000000, 5) * 0.05; // Up to 0.25 points
    reputationChange += tradePerformance.profitLoss > 0 ? profitImpact : -profitImpact;
    
    // Factor in client satisfaction
    reputationChange += (tradePerformance.clientSatisfaction - 50) / 100; // -0.5 to +0.5
    
    // Ensure reputation stays within bounds
    const newReputation = Math.max(0, Math.min(100, currentReputation + reputationChange));
    
    return newReputation;
  }
}