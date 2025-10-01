/**
 * NPC Trading Service
 * 
 * Implements behavioral triggers and trading execution for 1000 AI traders.
 * Integrates with personality engine and executes realistic trading patterns.
 */

import { db } from '../databaseStorage';
import { storage } from '../storage';
import {
  shouldNPCTrade,
  getNPCTradeDirection,
  calculateNPCPositionSize,
  type GeneratedPersonality
} from './npcPersonalityEngine';
import type { 
  NpcTrader, 
  NpcTraderStrategy, 
  NpcTraderPsychology,
  NpcTraderPosition,
  Asset,
  MarketEvent,
  InsertNpcTraderPosition,
  InsertNpcTraderActivityLog
} from '@shared/schema';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { 
  npcTraders, 
  npcTraderStrategies, 
  npcTraderPsychology, 
  npcTraderPositions,
  npcTraderActivityLog,
  assets,
  marketData,
  marketEvents
} from '@shared/schema';

interface MarketIntelligence {
  assetId: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent: number;
  volume24h: number;
  averageVolume: number;
  volumeRatio: number;
  volatility: number;
  momentum: number;
  heatScore: number;
  supportLevel?: number;
  resistanceLevel?: number;
}

interface NewsImpact {
  assetId: string;
  sentiment: number; // -100 to 100
  significance: number; // 0 to 10
  category: string;
  timestamp: Date;
}

interface TradingCycleSummary {
  tradesExecuted: number;
  buyOrders: number;
  sellOrders: number;
  totalVolume: number;
  totalValueTraded: number;
  npcsByArchetype: Record<string, number>;
  failedOrders: number;
  errors: string[];
}

interface NPCWithContext {
  trader: NpcTrader;
  strategy: NpcTraderStrategy;
  psychology: NpcTraderPsychology;
  positions: NpcTraderPosition[];
  personality: GeneratedPersonality;
}

export class NPCTradingService {
  private static instance: NPCTradingService;

  private constructor() {}

  static getInstance(): NPCTradingService {
    if (!NPCTradingService.instance) {
      NPCTradingService.instance = new NPCTradingService();
    }
    return NPCTradingService.instance;
  }

  /**
   * Main execution cycle - runs trading logic for all active NPCs
   */
  async runNPCTradingCycle(): Promise<TradingCycleSummary> {
    console.log('🤖 Starting NPC Trading Cycle...');
    
    const summary: TradingCycleSummary = {
      tradesExecuted: 0,
      buyOrders: 0,
      sellOrders: 0,
      totalVolume: 0,
      totalValueTraded: 0,
      npcsByArchetype: {},
      failedOrders: 0,
      errors: []
    };

    try {
      // 1. Fetch all active NPCs with their context
      const npcsWithContext = await this.getActiveNPCsWithContext();
      console.log(`📊 Found ${npcsWithContext.length} active NPC traders`);

      if (npcsWithContext.length === 0) {
        console.log('📭 No active NPC traders found');
        return summary;
      }

      // 2. Gather market intelligence
      const marketIntel = await this.gatherMarketIntelligence();
      console.log(`📈 Analyzed ${marketIntel.length} assets`);

      // 3. Get recent news events
      const newsImpacts = await this.getRecentNewsImpacts();
      console.log(`📰 Processing ${newsImpacts.length} news events`);

      // 4. For each NPC, determine if they should trade
      for (const npcContext of npcsWithContext) {
        try {
          await this.processNPCTradingDecision(
            npcContext,
            marketIntel,
            newsImpacts,
            summary
          );
        } catch (error) {
          console.error(`Error processing NPC ${npcContext.trader.name}:`, error);
          summary.errors.push(`${npcContext.trader.name}: ${error}`);
          summary.failedOrders++;
        }
      }

      console.log(`✅ Trading cycle complete: ${summary.tradesExecuted} trades executed`);
      return summary;

    } catch (error) {
      console.error('❌ NPC Trading Cycle failed:', error);
      summary.errors.push(`Cycle error: ${error}`);
      return summary;
    }
  }

  /**
   * Fetch all active NPCs with their strategies, psychology, and positions
   */
  private async getActiveNPCsWithContext(): Promise<NPCWithContext[]> {
    const activeTraders = await db
      .select()
      .from(npcTraders)
      .where(eq(npcTraders.isActive, true));

    const npcsWithContext: NPCWithContext[] = [];

    for (const trader of activeTraders) {
      try {
        // Get strategy
        const strategyResults = await db
          .select()
          .from(npcTraderStrategies)
          .where(eq(npcTraderStrategies.traderId, trader.id))
          .limit(1);
        
        // Get psychology
        const psychologyResults = await db
          .select()
          .from(npcTraderPsychology)
          .where(eq(npcTraderPsychology.traderId, trader.id))
          .limit(1);

        // Get positions
        const positions = await db
          .select()
          .from(npcTraderPositions)
          .where(eq(npcTraderPositions.traderId, trader.id));

        if (!strategyResults[0] || !psychologyResults[0]) {
          console.warn(`Missing strategy/psychology for NPC ${trader.name}`);
          continue;
        }

        const strategy = strategyResults[0];
        const psychology = psychologyResults[0];

        // Reconstruct personality from stored data
        const personality: GeneratedPersonality = {
          archetype: trader.personalityArchetype,
          riskTolerance: parseFloat(trader.riskTolerance),
          skillLevel: trader.skillLevel,
          positionSizing: parseFloat(strategy.maxPositionSize),
          holdingPeriod: strategy.holdingPeriodDays,
          stopLoss: parseFloat(strategy.stopLossPercent || '10'),
          takeProfit: parseFloat(strategy.takeProfitPercent || '20'),
          panicThreshold: parseFloat(psychology.panicThreshold),
          greedThreshold: parseFloat(psychology.greedThreshold),
          fomoSusceptibility: psychology.fomoSusceptibility,
          // Ranges (not used in decision making, but needed for type)
          riskToleranceRange: [0, 100],
          skillLevelRange: [1, 10],
          positionSizingRange: [0, 100],
          holdingPeriodRange: [1, 365],
          stopLossRange: [0, 100],
          takeProfitRange: [0, 100],
          panicThresholdRange: [0, 100],
          greedThresholdRange: [0, 100],
          fomoSusceptibilityRange: [0, 100],
          tradingFrequency: this.mapHoldingPeriodToFrequency(strategy.holdingPeriodDays),
          preferredAssetTypes: strategy.preferredAssets || [],
          newsReaction: psychology.newsReaction as 'ignore' | 'consider' | 'emotional',
          lossCutSpeed: psychology.lossCutSpeed as 'instant' | 'slow' | 'never',
        };

        npcsWithContext.push({
          trader,
          strategy,
          psychology,
          positions,
          personality
        });

      } catch (error) {
        console.error(`Error loading context for NPC ${trader.name}:`, error);
      }
    }

    return npcsWithContext;
  }

  /**
   * Map holding period to trading frequency
   */
  private mapHoldingPeriodToFrequency(holdingPeriod: number): 'very_high' | 'high' | 'medium' | 'low' | 'very_low' {
    if (holdingPeriod < 1) return 'very_high'; // Day traders
    if (holdingPeriod < 7) return 'high'; // Swing traders
    if (holdingPeriod < 30) return 'medium';
    if (holdingPeriod < 90) return 'low';
    return 'very_low'; // Long-term investors
  }

  /**
   * Gather market intelligence for all assets
   */
  private async gatherMarketIntelligence(): Promise<MarketIntelligence[]> {
    const intelligence: MarketIntelligence[] = [];

    try {
      // Get all active assets
      const allAssets = await db.select().from(assets);

      for (const asset of allAssets) {
        try {
          const intel = await this.analyzeAsset(asset.id);
          if (intel) {
            intelligence.push(intel);
          }
        } catch (error) {
          console.error(`Error analyzing asset ${asset.symbol}:`, error);
        }
      }

    } catch (error) {
      console.error('Error gathering market intelligence:', error);
    }

    return intelligence;
  }

  /**
   * Analyze a single asset for market intelligence
   */
  private async analyzeAsset(assetId: string): Promise<MarketIntelligence | null> {
    try {
      // Get current price
      const currentPriceData = await storage.getAssetCurrentPrice(assetId);
      if (!currentPriceData) return null;

      const currentPrice = parseFloat(currentPriceData.currentPrice);

      // Get 24h historical data
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentData = await db
        .select()
        .from(marketData)
        .where(
          and(
            eq(marketData.assetId, assetId),
            gte(marketData.periodStart, oneDayAgo)
          )
        )
        .orderBy(desc(marketData.periodStart));

      if (recentData.length === 0) {
        return {
          assetId,
          currentPrice,
          priceChange24h: 0,
          priceChangePercent: 0,
          volume24h: 0,
          averageVolume: 0,
          volumeRatio: 1,
          volatility: 0,
          momentum: 0,
          heatScore: 0
        };
      }

      // Calculate metrics
      const oldest = recentData[recentData.length - 1];
      const oldestPrice = parseFloat(oldest.close);
      const priceChange24h = currentPrice - oldestPrice;
      const priceChangePercent = (priceChange24h / oldestPrice) * 100;

      // Volume analysis
      const totalVolume = recentData.reduce((sum, d) => sum + d.volume, 0);
      const averageVolume = totalVolume / recentData.length;
      const latestVolume = recentData[0]?.volume || 0;
      const volumeRatio = latestVolume / (averageVolume || 1);

      // Volatility (standard deviation of price changes)
      const prices = recentData.map(d => parseFloat(d.close));
      const volatility = this.calculateVolatility(prices);

      // Momentum (price trend strength)
      const momentum = this.calculateMomentum(prices);

      // Heat score (combines volatility, volume, and momentum)
      const heatScore = this.calculateHeatScore(volatility, volumeRatio, Math.abs(momentum));

      // Support and resistance (simplified)
      const support = Math.min(...prices);
      const resistance = Math.max(...prices);

      return {
        assetId,
        currentPrice,
        priceChange24h,
        priceChangePercent,
        volume24h: totalVolume,
        averageVolume,
        volumeRatio,
        volatility,
        momentum,
        heatScore,
        supportLevel: support,
        resistanceLevel: resistance
      };

    } catch (error) {
      console.error(`Error analyzing asset ${assetId}:`, error);
      return null;
    }
  }

  /**
   * Calculate volatility (standard deviation of prices)
   */
  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;

    const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / prices.length;
    return Math.sqrt(variance) / mean * 100; // As percentage
  }

  /**
   * Calculate momentum (trend strength)
   */
  private calculateMomentum(prices: number[]): number {
    if (prices.length < 2) return 0;

    const oldest = prices[prices.length - 1];
    const newest = prices[0];
    return ((newest - oldest) / oldest) * 100;
  }

  /**
   * Calculate heat score (0-100)
   */
  private calculateHeatScore(volatility: number, volumeRatio: number, momentum: number): number {
    // Combine factors with weights
    const volatilityScore = Math.min(volatility * 2, 40); // Max 40 points
    const volumeScore = Math.min((volumeRatio - 1) * 20, 30); // Max 30 points
    const momentumScore = Math.min(Math.abs(momentum), 30); // Max 30 points

    return Math.min(volatilityScore + volumeScore + momentumScore, 100);
  }

  /**
   * Get recent news impacts
   */
  private async getRecentNewsImpacts(): Promise<NewsImpact[]> {
    const impacts: NewsImpact[] = [];

    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const recentEvents = await db
        .select()
        .from(marketEvents)
        .where(
          and(
            eq(marketEvents.isActive, true),
            gte(marketEvents.eventDate, oneDayAgo)
          )
        )
        .orderBy(desc(marketEvents.eventDate));

      for (const event of recentEvents) {
        const affectedAssets = event.affectedAssets || [];
        const sentiment = this.convertImpactToSentiment(event.impact);
        const significance = parseFloat(event.significance || '5');

        for (const assetId of affectedAssets) {
          impacts.push({
            assetId,
            sentiment,
            significance,
            category: event.category || 'general',
            timestamp: event.eventDate || new Date()
          });
        }
      }

    } catch (error) {
      console.error('Error fetching news impacts:', error);
    }

    return impacts;
  }

  /**
   * Convert impact string to sentiment score
   */
  private convertImpactToSentiment(impact: string | null): number {
    switch (impact) {
      case 'positive': return 75;
      case 'negative': return -75;
      case 'neutral': return 0;
      default: return 0;
    }
  }

  /**
   * Process trading decision for a single NPC
   */
  private async processNPCTradingDecision(
    npcContext: NPCWithContext,
    marketIntel: MarketIntelligence[],
    newsImpacts: NewsImpact[],
    summary: TradingCycleSummary
  ): Promise<void> {
    const { trader, strategy, psychology, positions, personality } = npcContext;

    // Update archetype counter
    summary.npcsByArchetype[personality.archetype] = 
      (summary.npcsByArchetype[personality.archetype] || 0) + 1;

    // Filter assets based on NPC preferences
    const preferredAssets = marketIntel.filter(intel => {
      return this.isPreferredAssetType(intel.assetId, strategy.preferredAssets || []);
    });

    if (preferredAssets.length === 0) {
      return; // No preferred assets available
    }

    // Select best asset to trade based on personality
    const targetAsset = this.selectAssetToTrade(
      preferredAssets,
      newsImpacts,
      personality,
      positions
    );

    if (!targetAsset) {
      return; // No suitable asset found
    }

    // Get news impact for this asset
    const assetNews = newsImpacts.filter(n => n.assetId === targetAsset.assetId);
    const avgSentiment = assetNews.length > 0
      ? assetNews.reduce((sum, n) => sum + n.sentiment, 0) / assetNews.length
      : 0;
    const maxSignificance = assetNews.length > 0
      ? Math.max(...assetNews.map(n => n.significance))
      : 0;

    // Decide if NPC should trade
    const shouldTrade = shouldNPCTrade(
      personality,
      avgSentiment,
      targetAsset.priceChangePercent,
      maxSignificance
    );

    if (!shouldTrade) {
      // Log decision not to trade
      await this.logNPCActivity(trader.id, 'analyze', targetAsset.assetId, null, null, 
        'Analyzed market conditions but decided not to trade at this time');
      return;
    }

    // Determine trade direction
    const direction = getNPCTradeDirection(
      personality,
      avgSentiment,
      targetAsset.priceChangePercent,
      maxSignificance
    );

    // Calculate position size
    const availableCapital = parseFloat(trader.currentCapital);
    const positionSize = calculateNPCPositionSize(
      personality,
      availableCapital,
      targetAsset.volatility
    );

    // Calculate quantity
    const quantity = Math.floor(positionSize / targetAsset.currentPrice);
    if (quantity <= 0) {
      return; // Position too small
    }

    // Execute the trade
    await this.executeNPCTrade(
      npcContext,
      targetAsset,
      direction,
      quantity,
      summary,
      `${direction === 'buy' ? 'Bullish' : 'Bearish'} on price action (${targetAsset.priceChangePercent.toFixed(2)}%), sentiment: ${avgSentiment.toFixed(0)}`
    );
  }

  /**
   * Check if asset matches NPC's preferred types
   */
  private async isPreferredAssetType(assetId: string, preferredTypes: string[]): Promise<boolean> {
    if (preferredTypes.length === 0) return true; // No preference means trade anything

    try {
      const asset = await storage.getAsset(assetId);
      if (!asset) return false;

      return preferredTypes.some(type => 
        asset.type.toLowerCase().includes(type.toLowerCase()) ||
        type.toLowerCase().includes(asset.type.toLowerCase())
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Select the best asset to trade based on personality
   */
  private selectAssetToTrade(
    assets: MarketIntelligence[],
    newsImpacts: NewsImpact[],
    personality: GeneratedPersonality,
    currentPositions: NpcTraderPosition[]
  ): MarketIntelligence | null {
    if (assets.length === 0) return null;

    // Filter based on archetype preferences
    let candidates = [...assets];

    switch (personality.archetype) {
      case 'momentum_chaser':
        // Prefer high momentum assets
        candidates.sort((a, b) => Math.abs(b.momentum) - Math.abs(a.momentum));
        break;

      case 'day_trader':
        // Prefer high volume and volatility
        candidates.sort((a, b) => (b.volumeRatio + b.volatility) - (a.volumeRatio + a.volatility));
        break;

      case 'contrarian':
        // Prefer oversold/overbought (extreme price changes)
        candidates.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent));
        break;

      case 'value_investor':
        // Prefer assets with negative sentiment (buy the dip)
        candidates = candidates.filter(a => {
          const news = newsImpacts.filter(n => n.assetId === a.assetId);
          const avgSentiment = news.length > 0 
            ? news.reduce((sum, n) => sum + n.sentiment, 0) / news.length 
            : 0;
          return avgSentiment < -20; // Negative sentiment
        });
        break;

      case 'panic_seller':
        // Look for positions to sell if there's negative news
        const positionAssets = currentPositions.map(p => p.assetId);
        candidates = candidates.filter(a => positionAssets.includes(a.assetId));
        break;

      case 'swing_trader':
        // Prefer assets near support/resistance
        candidates = candidates.filter(a => {
          if (!a.supportLevel || !a.resistanceLevel) return false;
          const range = a.resistanceLevel - a.supportLevel;
          const distanceToSupport = Math.abs(a.currentPrice - a.supportLevel);
          const distanceToResistance = Math.abs(a.currentPrice - a.resistanceLevel);
          return distanceToSupport < range * 0.1 || distanceToResistance < range * 0.1;
        });
        break;

      case 'whale':
        // Prefer high market cap, established assets (less volatile)
        candidates.sort((a, b) => a.volatility - b.volatility);
        break;

      default:
        // Random selection for other types
        candidates = candidates.sort(() => Math.random() - 0.5);
    }

    // Return the best candidate (or random if none fit criteria)
    return candidates.length > 0 
      ? candidates[0] 
      : assets[Math.floor(Math.random() * assets.length)];
  }

  /**
   * Execute NPC trade
   */
  private async executeNPCTrade(
    npcContext: NPCWithContext,
    targetAsset: MarketIntelligence,
    direction: 'buy' | 'sell',
    quantity: number,
    summary: TradingCycleSummary,
    reasoning: string
  ): Promise<void> {
    const { trader, strategy, positions } = npcContext;

    try {
      const totalValue = quantity * targetAsset.currentPrice;

      // Validate trade
      if (direction === 'sell') {
        const position = positions.find(p => p.assetId === targetAsset.assetId);
        if (!position || position.quantity < quantity) {
          throw new Error('Insufficient position to sell');
        }
      } else {
        // Buy validation
        const availableCapital = parseFloat(trader.currentCapital);
        if (totalValue > availableCapital) {
          throw new Error('Insufficient capital');
        }
      }

      // Execute the trade by updating positions and capital
      if (direction === 'buy') {
        await this.executeNPCBuy(
          trader.id,
          targetAsset.assetId,
          quantity,
          targetAsset.currentPrice
        );
      } else {
        await this.executeNPCSell(
          trader.id,
          targetAsset.assetId,
          quantity,
          targetAsset.currentPrice
        );
      }

      // Update summary
      summary.tradesExecuted++;
      if (direction === 'buy') summary.buyOrders++;
      if (direction === 'sell') summary.sellOrders++;
      summary.totalVolume += quantity;
      summary.totalValueTraded += totalValue;

      // Log the trade
      await this.logNPCActivity(
        trader.id,
        direction,
        targetAsset.assetId,
        quantity,
        targetAsset.currentPrice,
        reasoning
      );

      console.log(`✅ ${trader.name} ${direction} ${quantity} of asset ${targetAsset.assetId} @ $${targetAsset.currentPrice}`);

    } catch (error) {
      console.error(`Failed to execute ${direction} for ${trader.name}:`, error);
      summary.failedOrders++;
      summary.errors.push(`${trader.name}: ${error}`);
      
      // Log failed attempt
      await this.logNPCActivity(
        trader.id,
        'analyze',
        targetAsset.assetId,
        null,
        null,
        `Failed to execute ${direction}: ${error}`
      );
    }
  }

  /**
   * Execute NPC buy order
   */
  private async executeNPCBuy(
    traderId: string,
    assetId: string,
    quantity: number,
    price: number
  ): Promise<void> {
    const totalCost = quantity * price;

    // Get trader
    const traderResults = await db
      .select()
      .from(npcTraders)
      .where(eq(npcTraders.id, traderId))
      .limit(1);

    if (!traderResults[0]) throw new Error('Trader not found');
    const trader = traderResults[0];

    // Update capital
    const newCapital = parseFloat(trader.currentCapital) - totalCost;
    if (newCapital < 0) throw new Error('Insufficient capital');

    // Update or create position
    const existingPosition = await db
      .select()
      .from(npcTraderPositions)
      .where(
        and(
          eq(npcTraderPositions.traderId, traderId),
          eq(npcTraderPositions.assetId, assetId)
        )
      )
      .limit(1);

    if (existingPosition[0]) {
      // Update existing position
      const pos = existingPosition[0];
      const newQuantity = pos.quantity + quantity;
      const newAvgPrice = ((pos.quantity * parseFloat(pos.entryPrice)) + totalCost) / newQuantity;

      await db
        .update(npcTraderPositions)
        .set({
          quantity: newQuantity,
          entryPrice: newAvgPrice.toFixed(2)
        })
        .where(eq(npcTraderPositions.id, pos.id));
    } else {
      // Create new position
      const newPosition: InsertNpcTraderPosition = {
        traderId,
        assetId,
        quantity,
        entryPrice: price.toFixed(2),
        entryDate: new Date()
      };

      await db.insert(npcTraderPositions).values(newPosition);
    }

    // Update trader stats
    await db
      .update(npcTraders)
      .set({
        currentCapital: newCapital.toFixed(2),
        totalTrades: (trader.totalTrades || 0) + 1
      })
      .where(eq(npcTraders.id, traderId));
  }

  /**
   * Execute NPC sell order
   */
  private async executeNPCSell(
    traderId: string,
    assetId: string,
    quantity: number,
    price: number
  ): Promise<void> {
    const totalRevenue = quantity * price;

    // Get trader
    const traderResults = await db
      .select()
      .from(npcTraders)
      .where(eq(npcTraders.id, traderId))
      .limit(1);

    if (!traderResults[0]) throw new Error('Trader not found');
    const trader = traderResults[0];

    // Get position
    const positionResults = await db
      .select()
      .from(npcTraderPositions)
      .where(
        and(
          eq(npcTraderPositions.traderId, traderId),
          eq(npcTraderPositions.assetId, assetId)
        )
      )
      .limit(1);

    if (!positionResults[0]) throw new Error('No position found');
    const position = positionResults[0];

    if (position.quantity < quantity) throw new Error('Insufficient quantity');

    // Calculate P&L
    const costBasis = quantity * parseFloat(position.entryPrice);
    const pnl = totalRevenue - costBasis;
    const isWin = pnl > 0;

    // Update position
    const newQuantity = position.quantity - quantity;
    if (newQuantity <= 0) {
      // Close position
      await db
        .delete(npcTraderPositions)
        .where(eq(npcTraderPositions.id, position.id));
    } else {
      // Reduce position
      await db
        .update(npcTraderPositions)
        .set({ quantity: newQuantity })
        .where(eq(npcTraderPositions.id, position.id));
    }

    // Update trader stats
    const newCapital = parseFloat(trader.currentCapital) + totalRevenue;
    const totalTrades = (trader.totalTrades || 0) + 1;
    
    // Calculate new win rate (simplified - would need to track wins separately in real system)
    const currentWinRate = parseFloat(trader.winRate || '0');
    const prevTrades = trader.totalTrades || 0;
    const newWinRate = ((currentWinRate * prevTrades) + (isWin ? 100 : 0)) / totalTrades;

    await db
      .update(npcTraders)
      .set({
        currentCapital: newCapital.toFixed(2),
        totalTrades,
        winRate: newWinRate.toFixed(2)
      })
      .where(eq(npcTraders.id, traderId));
  }

  /**
   * Log NPC trading activity
   */
  private async logNPCActivity(
    traderId: string,
    action: string,
    assetId: string | null,
    quantity: number | null,
    price: number | null,
    reasoning: string
  ): Promise<void> {
    try {
      const log: InsertNpcTraderActivityLog = {
        traderId,
        action,
        assetId: assetId || undefined,
        quantity: quantity || undefined,
        price: price?.toFixed(2) || undefined,
        reasoning
      };

      await db.insert(npcTraderActivityLog).values(log);
    } catch (error) {
      console.error('Error logging NPC activity:', error);
    }
  }
}

// Export singleton instance
export const npcTradingService = NPCTradingService.getInstance();

/**
 * Main entry point for NPC trading cycle
 */
export async function runNPCTradingCycle(): Promise<TradingCycleSummary> {
  return await npcTradingService.runNPCTradingCycle();
}
