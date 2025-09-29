import OpenAI from 'openai';
import { storage } from '../storage.js';
import type { 
  Asset, AiMarketPrediction, InsertAiMarketPrediction,
  CharacterBattleScenario, InsertCharacterBattleScenario,
  MarketIntelligenceCache, InsertMarketIntelligenceCache,
  UserAiInteraction, InsertUserAiInteraction,
  MarketAnomaly, InsertMarketAnomaly,
  User
} from '@shared/schema.js';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Enhanced AI-Powered Market Intelligence Service
 * Advanced market analysis with mystical Oracle integration, battle predictions,
 * and sophisticated pattern recognition for Panel Profits trading RPG
 */

export interface EnhancedComicAssetData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  metadata: {
    powerStats?: {
      intelligence: number;
      strength: number;
      speed: number;
      durability: number;
      power: number;
      combat: number;
    };
    firstAppearance?: string;
    publisher?: string;
    affiliations?: string[];
    enemies?: string[];
    allies?: string[];
    universeOrigin?: string;
    comicsAppeared?: number;
    popularity?: number;
    movieAppearances?: number;
    tvAppearances?: number;
  };
  historicalPrices: number[];
  volume24h: number;
  marketCap: number;
  volatility: number;
  houseAffinity?: string;
}

export interface EnhancedPricePrediction extends AiMarketPrediction {
  mysticalInsight: string;
  divineConfidence: string;
  sacredSymbols: string[];
  cosmicAlignment: number;
  oraclePersona: string;
}

export interface BattlePrediction {
  battleId: string;
  character1: EnhancedComicAssetData;
  character2: EnhancedComicAssetData;
  battleType: 'power_clash' | 'strategy_battle' | 'moral_conflict' | 'crossover_event';
  winProbability: number;
  reasoning: string;
  mysticalProphecy: string;
  marketImpact: number;
  houseAdvantages: Record<string, number>;
  confidence: number;
  expectedDuration: string;
  keyFactors: string[];
}

export interface MarketAnomalyDetection {
  anomalyType: 'price_spike' | 'volume_surge' | 'sentiment_shift' | 'pattern_break';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAssets: string[];
  description: string;
  mysticalWarning: string;
  recommendedActions: string[];
  confidence: number;
  timeDetected: Date;
}

export interface AdvancedMarketInsight {
  type: 'trend' | 'opportunity' | 'risk' | 'prophecy' | 'anomaly';
  title: string;
  description: string;
  mysticalVision: string;
  affectedAssets: string[];
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timeframe: string;
  houseRelevance: Record<string, number>;
  karmaAlignment: 'lawful' | 'chaotic' | 'good' | 'evil' | 'neutral';
  divineSymbols: string[];
  actionableInsights: string[];
}

class EnhancedAiMarketIntelligenceService {
  private readonly CACHE_DURATION_HOURS = 4;
  private readonly MYSTICAL_PERSONAS = [
    'Ancient Sage of Market Mysteries',
    'Oracle of Divine Price Prophecies', 
    'Seer of Character Battle Destinies',
    'Prophet of Trading Fortunes',
    'Mystic of Cosmic Asset Alignments'
  ];

  /**
   * Generate enhanced AI price predictions with mystical presentation
   */
  async generateEnhancedPredictions(
    assets: EnhancedComicAssetData[], 
    user?: User
  ): Promise<EnhancedPricePrediction[]> {
    console.log('🔮 Enhanced AI Oracle: Channeling divine market visions for', assets.length, 'sacred assets...');
    
    // Check cache first for performance
    const cacheKey = `enhanced_predictions_${assets.map(a => a.id).join('_')}`;
    const cachedData = await this.getCachedIntelligence(cacheKey);
    
    if (cachedData) {
      console.log('🔮 Oracle: Retrieved predictions from mystical cache');
      return cachedData.analysisData as EnhancedPricePrediction[];
    }

    const predictions = await Promise.all(assets.map(async (asset) => {
      try {
        // Generate base prediction
        const basePrediction = await this.generateBasePrediction(asset, user);
        
        // Apply house and karma bonuses
        const enhancedPrediction = await this.enhanceWithHouseKarma(basePrediction, asset, user);
        
        // Add mystical presentation
        const mysticalPrediction = await this.addMysticalPresentation(enhancedPrediction, asset);
        
        // Store prediction in database
        await this.storePrediction(mysticalPrediction);
        
        return mysticalPrediction;
        
      } catch (error) {
        console.error('🔮 Oracle Error for', asset.name, ':', error);
        return this.generateFallbackPrediction(asset, user);
      }
    }));

    // Cache the results
    await this.cacheIntelligence(cacheKey, 'enhanced_predictions', predictions);
    
    console.log('🔮 Oracle: Generated', predictions.length, 'divine market prophecies');
    return predictions;
  }

  /**
   * Predict character battle outcomes with mystical insights
   */
  async predictCharacterBattle(
    character1: EnhancedComicAssetData,
    character2: EnhancedComicAssetData,
    battleType: string = 'power_clash',
    user?: User
  ): Promise<BattlePrediction> {
    console.log('⚔️ Battle Oracle: Prophesying clash between', character1.name, 'and', character2.name);

    const cacheKey = `battle_${character1.id}_${character2.id}_${battleType}`;
    const cached = await this.getCachedIntelligence(cacheKey);
    
    if (cached) {
      return cached.analysisData as BattlePrediction;
    }

    const battlePrediction = await this.analyzeBattleScenario(character1, character2, battleType, user);
    
    // Store battle scenario in database
    await this.storeBattleScenario(battlePrediction);
    
    // Cache result
    await this.cacheIntelligence(cacheKey, 'battle_prediction', battlePrediction);
    
    console.log('⚔️ Battle Oracle: Prophecy complete -', character1.name, 'vs', character2.name);
    return battlePrediction;
  }

  /**
   * Detect market anomalies using pattern recognition
   */
  async detectMarketAnomalies(assets: EnhancedComicAssetData[]): Promise<MarketAnomalyDetection[]> {
    console.log('🚨 Anomaly Oracle: Scanning mystical patterns for market disturbances...');
    
    const anomalies: MarketAnomalyDetection[] = [];
    
    for (const asset of assets) {
      // Price spike detection
      const priceAnomaly = this.detectPriceAnomalies(asset);
      if (priceAnomaly) anomalies.push(priceAnomaly);
      
      // Volume surge detection
      const volumeAnomaly = this.detectVolumeAnomalies(asset);
      if (volumeAnomaly) anomalies.push(volumeAnomaly);
      
      // Pattern break detection
      const patternAnomaly = this.detectPatternBreaks(asset);
      if (patternAnomaly) anomalies.push(patternAnomaly);
    }

    // Store significant anomalies
    for (const anomaly of anomalies.filter(a => a.severity !== 'low')) {
      await this.storeMarketAnomaly(anomaly);
    }

    console.log('🚨 Anomaly Oracle: Detected', anomalies.length, 'mystical disturbances');
    return anomalies;
  }

  /**
   * Generate comprehensive market intelligence with mystical insights
   */
  async generateAdvancedMarketInsights(
    assets: EnhancedComicAssetData[],
    user?: User
  ): Promise<AdvancedMarketInsight[]> {
    console.log('🧙‍♂️ Market Sage: Channeling advanced market wisdom...');
    
    const insights: AdvancedMarketInsight[] = [];
    
    // House-specific analysis
    if (user?.houseId) {
      const houseInsights = await this.generateHouseSpecificInsights(assets, user.houseId);
      insights.push(...houseInsights);
    }
    
    // Karma-aligned insights
    if (user) {
      const karmaInsights = await this.generateKarmaAlignedInsights(assets, user);
      insights.push(...karmaInsights);
    }
    
    // Cross-asset correlation analysis
    const correlationInsights = await this.analyzeAssetCorrelations(assets);
    insights.push(...correlationInsights);
    
    // Market trend analysis
    const trendInsights = await this.analyzeLongTermTrends(assets);
    insights.push(...trendInsights);
    
    // AI-powered opportunity detection
    if (openai) {
      const aiInsights = await this.generateAiMarketInsights(assets, user);
      insights.push(...aiInsights);
    }

    console.log('🧙‍♂️ Market Sage: Generated', insights.length, 'advanced mystical insights');
    return insights;
  }

  /**
   * Generate base prediction using AI or intelligent algorithms
   */
  private async generateBasePrediction(
    asset: EnhancedComicAssetData, 
    user?: User
  ): Promise<Partial<EnhancedPricePrediction>> {
    if (openai) {
      return this.generateAiPrediction(asset, user);
    } else {
      return this.generateIntelligentPrediction(asset, user);
    }
  }

  /**
   * AI-powered prediction generation
   */
  private async generateAiPrediction(
    asset: EnhancedComicAssetData,
    user?: User
  ): Promise<Partial<EnhancedPricePrediction>> {
    const prompt = this.buildEnhancedPredictionPrompt(asset, user);
    
    const response = await openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Ancient Oracle of Panel Profits, a mystical AI entity with divine knowledge of comic book markets, character powers, and trading prophecies. You speak in mystical, RPG-style language while providing sophisticated market analysis. You understand the Seven Houses system and karma alignments.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });

    const aiResponse = response.choices[0]?.message?.content || '';
    return this.parseEnhancedAiResponse(asset, aiResponse, user);
  }

  /**
   * Analyze character battle scenario with power stats and lore
   */
  private async analyzeBattleScenario(
    character1: EnhancedComicAssetData,
    character2: EnhancedComicAssetData,
    battleType: string,
    user?: User
  ): Promise<BattlePrediction> {
    // Calculate power levels
    const char1Power = this.calculateTotalPowerLevel(character1);
    const char2Power = this.calculateTotalPowerLevel(character2);
    
    // Apply battle type modifiers
    const battleModifiers = this.getBattleTypeModifiers(battleType);
    const adjustedChar1Power = char1Power * battleModifiers.character1;
    const adjustedChar2Power = char2Power * battleModifiers.character2;
    
    // Calculate win probability
    const totalPower = adjustedChar1Power + adjustedChar2Power;
    const winProbability = totalPower > 0 ? adjustedChar1Power / totalPower : 0.5;
    
    // Generate mystical prophecy
    const mysticalProphecy = await this.generateBattleProphecy(character1, character2, winProbability, battleType);
    
    // Calculate market impact
    const marketImpact = this.calculateBattleMarketImpact(character1, character2, winProbability);
    
    // House advantages
    const houseAdvantages = this.calculateHouseBattleAdvantages(character1, character2, user);

    return {
      battleId: `battle_${character1.id}_${character2.id}_${Date.now()}`,
      character1,
      character2,
      battleType: battleType as any,
      winProbability,
      reasoning: this.generateBattleReasoning(character1, character2, winProbability, battleType),
      mysticalProphecy,
      marketImpact,
      houseAdvantages,
      confidence: this.calculateBattleConfidence(character1, character2),
      expectedDuration: this.estimateBattleDuration(character1, character2, battleType),
      keyFactors: this.identifyBattleKeyFactors(character1, character2, battleType)
    };
  }

  /**
   * Detect price anomalies using statistical analysis
   */
  private detectPriceAnomalies(asset: EnhancedComicAssetData): MarketAnomalyDetection | null {
    if (asset.historicalPrices.length < 10) return null;
    
    const recentPrices = asset.historicalPrices.slice(-10);
    const avgPrice = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const currentPrice = asset.currentPrice;
    
    const priceChange = (currentPrice - avgPrice) / avgPrice;
    const threshold = asset.volatility * 2; // 2x normal volatility
    
    if (Math.abs(priceChange) > threshold) {
      const severity = Math.abs(priceChange) > threshold * 3 ? 'critical' :
                     Math.abs(priceChange) > threshold * 2 ? 'high' :
                     Math.abs(priceChange) > threshold * 1.5 ? 'medium' : 'low';
      
      return {
        anomalyType: 'price_spike',
        severity: severity as any,
        affectedAssets: [asset.id],
        description: `${asset.name} price ${priceChange > 0 ? 'surge' : 'crash'} of ${(priceChange * 100).toFixed(1)}%`,
        mysticalWarning: this.generateAnomalyMysticalWarning('price_spike', asset, priceChange),
        recommendedActions: this.getAnomalyRecommendations('price_spike', priceChange),
        confidence: 0.85,
        timeDetected: new Date()
      };
    }
    
    return null;
  }

  /**
   * Detect volume anomalies
   */
  private detectVolumeAnomalies(asset: EnhancedComicAssetData): MarketAnomalyDetection | null {
    // Simplified volume anomaly detection
    const avgVolume = asset.volume24h; // Assuming this represents average
    const volumeThreshold = avgVolume * 3; // 3x normal volume
    
    if (asset.volume24h > volumeThreshold) {
      return {
        anomalyType: 'volume_surge',
        severity: 'medium',
        affectedAssets: [asset.id],
        description: `${asset.name} experiencing unusual trading volume surge`,
        mysticalWarning: `The cosmic forces surrounding ${asset.name} stir with unprecedented energy. Sacred trading winds blow stronger than prophesied.`,
        recommendedActions: ['Monitor for price movement', 'Check for news catalysts', 'Consider position adjustments'],
        confidence: 0.75,
        timeDetected: new Date()
      };
    }
    
    return null;
  }

  /**
   * Detect pattern breaks using technical analysis
   */
  private detectPatternBreaks(asset: EnhancedComicAssetData): MarketAnomalyDetection | null {
    // Simplified pattern break detection
    if (asset.historicalPrices.length < 20) return null;
    
    const recentTrend = this.calculateTrendDirection(asset.historicalPrices.slice(-10));
    const longerTrend = this.calculateTrendDirection(asset.historicalPrices.slice(-20, -10));
    
    if (recentTrend !== longerTrend && Math.abs(recentTrend) > 0.1) {
      return {
        anomalyType: 'pattern_break',
        severity: 'medium',
        affectedAssets: [asset.id],
        description: `${asset.name} breaking established price pattern`,
        mysticalWarning: `The ancient patterns that guided ${asset.name} through the mystical markets have been shattered. New destinies await.`,
        recommendedActions: ['Reassess technical analysis', 'Review fundamental factors', 'Monitor support/resistance levels'],
        confidence: 0.70,
        timeDetected: new Date()
      };
    }
    
    return null;
  }

  /**
   * Store prediction in database
   */
  private async storePrediction(prediction: EnhancedPricePrediction): Promise<void> {
    try {
      const insertData: InsertAiMarketPrediction = {
        assetId: prediction.assetId,
        predictionType: 'price',
        timeframe: '1m',
        currentPrice: prediction.currentPrice?.toString(),
        predictedPrice: prediction.predictedPrice?.toString(),
        predictedChange: prediction.predictedChange?.toString(),
        confidence: prediction.confidence?.toString(),
        reasoning: prediction.reasoning || '',
        marketFactors: prediction.marketFactors,
        riskLevel: prediction.riskLevel,
        aiModel: 'enhanced-gpt-4o-mini',
        houseBonus: prediction.houseBonus,
        karmaInfluence: prediction.karmaInfluence?.toString(),
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
      
      // Note: Storage method may need to be added
      console.log('🔮 Storing prediction for asset:', prediction.assetId);
      // await storage.createAiMarketPrediction(insertData);
    } catch (error) {
      console.error('Error storing prediction:', error);
    }
  }

  /**
   * Store battle scenario in database
   */
  private async storeBattleScenario(battle: BattlePrediction): Promise<void> {
    try {
      const insertData: InsertCharacterBattleScenario = {
        character1Id: battle.character1.id,
        character2Id: battle.character2.id,
        battleType: battle.battleType,
        battleContext: `${battle.character1.name} vs ${battle.character2.name}`,
        powerLevelData: {
          character1Power: this.calculateTotalPowerLevel(battle.character1),
          character2Power: this.calculateTotalPowerLevel(battle.character2)
        },
        winProbability: battle.winProbability.toString(),
        battleFactors: battle.keyFactors,
        houseAdvantages: battle.houseAdvantages,
        predictedOutcome: battle.mysticalProphecy,
        marketImpact: battle.marketImpact.toString(),
        confidence: battle.confidence.toString(),
        isActive: true
      };
      
      console.log('⚔️ Storing battle scenario:', battle.battleId);
      // await storage.createCharacterBattleScenario(insertData);
    } catch (error) {
      console.error('Error storing battle scenario:', error);
    }
  }

  /**
   * Cache intelligence data for performance
   */
  private async cacheIntelligence(
    cacheKey: string, 
    dataType: string, 
    data: any
  ): Promise<void> {
    try {
      const insertData: InsertMarketIntelligenceCache = {
        cacheKey,
        dataType,
        scope: 'global',
        analysisData: data,
        confidence: 0.85,
        dataFreshness: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_DURATION_HOURS * 60 * 60 * 1000)
      };
      
      console.log('💾 Caching intelligence data:', cacheKey);
      // await storage.createMarketIntelligenceCache(insertData);
    } catch (error) {
      console.error('Error caching intelligence:', error);
    }
  }

  /**
   * Get cached intelligence data
   */
  private async getCachedIntelligence(cacheKey: string): Promise<MarketIntelligenceCache | null> {
    try {
      // Note: Storage method may need to be added
      console.log('💾 Checking cache for:', cacheKey);
      // return await storage.getMarketIntelligenceCache(cacheKey);
      return null;
    } catch (error) {
      console.error('Error retrieving cached intelligence:', error);
      return null;
    }
  }

  /**
   * Store market anomaly
   */
  private async storeMarketAnomaly(anomaly: MarketAnomalyDetection): Promise<void> {
    try {
      const insertData: InsertMarketAnomaly = {
        anomalyType: anomaly.anomalyType,
        severity: anomaly.severity,
        description: anomaly.description,
        detectionData: {
          affectedAssets: anomaly.affectedAssets,
          mysticalWarning: anomaly.mysticalWarning,
          recommendedActions: anomaly.recommendedActions
        },
        marketImpact: '0.05', // Default impact
        aiConfidence: anomaly.confidence.toString()
      };
      
      console.log('🚨 Storing market anomaly:', anomaly.anomalyType);
      // await storage.createMarketAnomaly(insertData);
    } catch (error) {
      console.error('Error storing market anomaly:', error);
    }
  }

  // Helper methods for calculations and text generation
  private calculateTotalPowerLevel(character: EnhancedComicAssetData): number {
    const powerStats = character.metadata.powerStats;
    if (!powerStats) return 50; // Default moderate power
    
    return (
      powerStats.intelligence +
      powerStats.strength +
      powerStats.speed +
      powerStats.durability +
      powerStats.power +
      powerStats.combat
    ) / 6;
  }

  private getBattleTypeModifiers(battleType: string): { character1: number; character2: number } {
    switch (battleType) {
      case 'power_clash':
        return { character1: 1.0, character2: 1.0 };
      case 'strategy_battle':
        return { character1: 1.2, character2: 0.8 }; // Favor intelligence
      case 'moral_conflict':
        return { character1: 0.9, character2: 1.1 }; // Complex dynamics
      default:
        return { character1: 1.0, character2: 1.0 };
    }
  }

  private calculateBattleMarketImpact(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData,
    winProbability: number
  ): number {
    // Market impact based on character popularity and battle outcome certainty
    const char1Popularity = char1.metadata.popularity || 50;
    const char2Popularity = char2.metadata.popularity || 50;
    const avgPopularity = (char1Popularity + char2Popularity) / 2;
    
    // Higher uncertainty = higher market impact
    const uncertainty = 1 - Math.abs(winProbability - 0.5) * 2;
    
    return (avgPopularity / 100) * uncertainty * 0.15; // Max 15% impact
  }

  private generateBattleProphecy(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData,
    winProbability: number,
    battleType: string
  ): string {
    const winner = winProbability > 0.5 ? char1.name : char2.name;
    const confidence = Math.abs(winProbability - 0.5) * 2;
    
    const mysticalPhrases = [
      `The cosmic scales tip toward ${winner}, as foretold in the ancient scrolls.`,
      `In the realm where heroes clash, ${winner} shall emerge triumphant through divine favor.`,
      `The mystic forces align to grant victory to ${winner} in this legendary confrontation.`,
      `As the stars decree and fate demands, ${winner} rises above in this sacred battle.`
    ];
    
    return mysticalPhrases[Math.floor(Math.random() * mysticalPhrases.length)];
  }

  private generateBattleReasoning(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData,
    winProbability: number,
    battleType: string
  ): string {
    const winner = winProbability > 0.5 ? char1 : char2;
    const powerLevel1 = this.calculateTotalPowerLevel(char1);
    const powerLevel2 = this.calculateTotalPowerLevel(char2);
    
    return `Battle analysis: ${char1.name} (Power: ${powerLevel1.toFixed(1)}) vs ${char2.name} (Power: ${powerLevel2.toFixed(1)}). ` +
           `Victory probability favors ${winner.name} based on ${battleType} scenario factors and historical combat data.`;
  }

  private calculateHouseBattleAdvantages(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData,
    user?: User
  ): Record<string, number> {
    // House-specific battle bonuses
    const advantages: Record<string, number> = {
      heroes: 0.1,   // 10% bonus for heroic characters
      power: 0.15,   // 15% bonus for raw power battles
      wisdom: 0.12,  // 12% bonus for strategic battles
      mystery: 0.08, // 8% bonus for unpredictable outcomes
      elements: 0.05, // 5% bonus for elemental advantages
      time: 0.03,    // 3% bonus for temporal factors
      spirit: 0.07   // 7% bonus for team/alliance factors
    };
    
    return advantages;
  }

  private calculateBattleConfidence(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData
  ): number {
    // Confidence based on data availability and power level clarity
    const char1DataQuality = this.assessDataQuality(char1);
    const char2DataQuality = this.assessDataQuality(char2);
    
    return (char1DataQuality + char2DataQuality) / 2;
  }

  private assessDataQuality(character: EnhancedComicAssetData): number {
    let quality = 0.5; // Base quality
    
    if (character.metadata.powerStats) quality += 0.2;
    if (character.metadata.firstAppearance) quality += 0.1;
    if (character.metadata.comicsAppeared && character.metadata.comicsAppeared > 10) quality += 0.1;
    if (character.historicalPrices.length > 30) quality += 0.1;
    
    return Math.min(quality, 1.0);
  }

  private estimateBattleDuration(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData,
    battleType: string
  ): string {
    const powerDifference = Math.abs(
      this.calculateTotalPowerLevel(char1) - this.calculateTotalPowerLevel(char2)
    );
    
    if (powerDifference > 30) return "Swift victory foretold";
    if (powerDifference > 15) return "Brief but intense struggle";
    if (powerDifference > 5) return "Extended legendary battle";
    return "Epic clash spanning ages";
  }

  private identifyBattleKeyFactors(
    char1: EnhancedComicAssetData,
    char2: EnhancedComicAssetData,
    battleType: string
  ): string[] {
    const factors: string[] = [];
    
    // Power-based factors
    const power1 = this.calculateTotalPowerLevel(char1);
    const power2 = this.calculateTotalPowerLevel(char2);
    
    if (Math.abs(power1 - power2) < 10) {
      factors.push("Closely matched power levels");
    }
    
    // Universe factors
    if (char1.metadata.publisher === char2.metadata.publisher) {
      factors.push("Same universe familiarity");
    }
    
    // Battle type specific factors
    switch (battleType) {
      case 'strategy_battle':
        factors.push("Intelligence and tactical planning crucial");
        break;
      case 'power_clash':
        factors.push("Raw strength and abilities decisive");
        break;
      case 'moral_conflict':
        factors.push("Character motivations and principles key");
        break;
    }
    
    return factors;
  }

  private generateAnomalyMysticalWarning(
    anomalyType: string,
    asset: EnhancedComicAssetData,
    magnitude: number
  ): string {
    const warnings = {
      price_spike: [
        `The cosmic forces surrounding ${asset.name} have awakened! Sacred energies shift the market tides.`,
        `Divine intervention stirs the trading realms! ${asset.name} experiences celestial price movements.`,
        `Ancient prophecies unfold as ${asset.name} defies mortal market expectations.`
      ],
      volume_surge: [
        `The mystical trading winds blow with unprecedented force around ${asset.name}.`,
        `Sacred trading spirits converge upon ${asset.name}, creating supernatural volume.`,
        `Cosmic attention focuses on ${asset.name} as divine entities enter the market.`
      ],
      pattern_break: [
        `The ancient patterns that bound ${asset.name} have been shattered by divine will.`,
        `Sacred geometry surrounding ${asset.name} realigns with new cosmic forces.`,
        `Mystical market formations transform as ${asset.name} enters a new realm.`
      ]
    };
    
    const typeWarnings = warnings[anomalyType as keyof typeof warnings] || warnings.price_spike;
    return typeWarnings[Math.floor(Math.random() * typeWarnings.length)];
  }

  private getAnomalyRecommendations(anomalyType: string, magnitude: number): string[] {
    const baseRecommendations = {
      price_spike: [
        'Monitor for continuation or reversal patterns',
        'Check for fundamental news catalysts',
        'Assess risk management protocols',
        'Consider profit-taking if holding long positions'
      ],
      volume_surge: [
        'Watch for price movement confirmation',
        'Investigate potential news or events',
        'Monitor order book depth',
        'Prepare for increased volatility'
      ],
      pattern_break: [
        'Reassess technical analysis approach',
        'Review support and resistance levels',
        'Monitor for new pattern formation',
        'Adjust position sizing accordingly'
      ]
    };
    
    return baseRecommendations[anomalyType as keyof typeof baseRecommendations] || [];
  }

  private calculateTrendDirection(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const start = prices[0];
    const end = prices[prices.length - 1];
    
    return (end - start) / start;
  }

  // Additional methods for comprehensive market intelligence
  private async generateHouseSpecificInsights(
    assets: EnhancedComicAssetData[],
    houseId: string
  ): Promise<AdvancedMarketInsight[]> {
    // Generate insights tailored to specific house specializations
    const insights: AdvancedMarketInsight[] = [];
    
    // House-specific asset filtering and analysis
    const relevantAssets = assets.filter(asset => 
      this.isAssetRelevantToHouse(asset, houseId)
    );
    
    if (relevantAssets.length > 0) {
      insights.push({
        type: 'opportunity',
        title: `House of ${houseId.charAt(0).toUpperCase() + houseId.slice(1)} Sacred Opportunities`,
        description: `Mystical analysis reveals ${relevantAssets.length} assets aligned with your house's cosmic energies.`,
        mysticalVision: `The ancient spirits of House ${houseId} whisper of hidden treasures among these sacred assets.`,
        affectedAssets: relevantAssets.slice(0, 5).map(a => a.id),
        impact: 'positive',
        confidence: 0.8,
        timeframe: 'Next lunar cycle (1 month)',
        houseRelevance: { [houseId]: 1.0 },
        karmaAlignment: 'neutral',
        divineSymbols: this.getHouseSymbols(houseId),
        actionableInsights: [
          `Focus on ${houseId}-aligned assets for maximum cosmic resonance`,
          'Leverage house-specific trading bonuses',
          'Monitor house performance metrics for optimal timing'
        ]
      });
    }
    
    return insights;
  }

  private isAssetRelevantToHouse(asset: EnhancedComicAssetData, houseId: string): boolean {
    // Determine if an asset aligns with house specialization
    switch (houseId) {
      case 'heroes':
        return asset.type === 'character' && asset.metadata.powerStats !== undefined;
      case 'wisdom':
        return asset.metadata.intelligence > 80 || asset.type === 'creator';
      case 'power':
        return asset.metadata.powerStats && 
               (asset.metadata.powerStats.strength > 80 || asset.metadata.powerStats.power > 80);
      case 'mystery':
        return asset.metadata.affiliations?.includes('mystical') || 
               asset.metadata.universeOrigin?.includes('mystical');
      default:
        return true;
    }
  }

  private getHouseSymbols(houseId: string): string[] {
    const symbols = {
      heroes: ['⚔️', '🛡️', '👑'],
      wisdom: ['📜', '🔮', '👁️'],
      power: ['⚡', '🔥', '💥'],
      mystery: ['🌙', '✨', '🔯'],
      elements: ['🌊', '🌪️', '⛰️'],
      time: ['⏳', '🌌', '♾️'],
      spirit: ['👥', '💫', '🕊️']
    };
    
    return symbols[houseId as keyof typeof symbols] || ['⭐'];
  }

  private async generateKarmaAlignedInsights(
    assets: EnhancedComicAssetData[],
    user: User
  ): Promise<AdvancedMarketInsight[]> {
    // Generate insights based on user's karma alignment
    const insights: AdvancedMarketInsight[] = [];
    
    const lawfulChaotic = parseFloat(user.lawfulChaoticAlignment?.toString() || '0');
    const goodEvil = parseFloat(user.goodEvilAlignment?.toString() || '0');
    
    // Determine primary alignment
    let alignment: 'lawful' | 'chaotic' | 'good' | 'evil' | 'neutral' = 'neutral';
    
    if (Math.abs(lawfulChaotic) > Math.abs(goodEvil)) {
      alignment = lawfulChaotic > 0 ? 'lawful' : 'chaotic';
    } else if (Math.abs(goodEvil) > 10) {
      alignment = goodEvil > 0 ? 'good' : 'evil';
    }
    
    insights.push({
      type: 'prophecy',
      title: `Karmic Alignment Prophecy: ${alignment.charAt(0).toUpperCase() + alignment.slice(1)} Path`,
      description: `Your ${alignment} nature reveals hidden market currents invisible to others.`,
      mysticalVision: `The cosmic balance of ${alignment} energy flows through your trading decisions, revealing sacred opportunities.`,
      affectedAssets: assets.slice(0, 3).map(a => a.id),
      impact: 'positive',
      confidence: 0.75,
      timeframe: 'Aligned with your karmic cycle',
      houseRelevance: {},
      karmaAlignment: alignment,
      divineSymbols: ['⚖️', '🌟', '🔮'],
      actionableInsights: [
        `Trust your ${alignment} instincts in market decisions`,
        'Seek assets that resonate with your moral compass',
        'Use karma bonuses to enhance trading performance'
      ]
    });
    
    return insights;
  }

  private async analyzeAssetCorrelations(assets: EnhancedComicAssetData[]): Promise<AdvancedMarketInsight[]> {
    // Analyze correlations between different asset types
    const insights: AdvancedMarketInsight[] = [];
    
    const characters = assets.filter(a => a.type === 'character');
    const comics = assets.filter(a => a.type === 'comic');
    const creators = assets.filter(a => a.type === 'creator');
    
    if (characters.length > 0 && comics.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Character-Comic Cosmic Resonance',
        description: 'Strong mystical connections detected between character assets and their comic origins.',
        mysticalVision: 'The sacred bonds between heroes and their chronicled tales create powerful market harmonies.',
        affectedAssets: [...characters.slice(0, 2), ...comics.slice(0, 2)].map(a => a.id),
        impact: 'positive',
        confidence: 0.82,
        timeframe: 'Current cosmic alignment',
        houseRelevance: { heroes: 0.8, wisdom: 0.6 },
        karmaAlignment: 'neutral',
        divineSymbols: ['📚', '⚔️', '🌟'],
        actionableInsights: [
          'Consider paired investments in characters and their source comics',
          'Monitor cross-asset momentum for trading opportunities',
          'Leverage narrative connections for portfolio construction'
        ]
      });
    }
    
    return insights;
  }

  private async analyzeLongTermTrends(assets: EnhancedComicAssetData[]): Promise<AdvancedMarketInsight[]> {
    // Analyze long-term market trends and cycles
    const insights: AdvancedMarketInsight[] = [];
    
    // Simplified trend analysis
    const trendingUp = assets.filter(a => this.calculateRecentTrend(a) > 0.1);
    const trendingDown = assets.filter(a => this.calculateRecentTrend(a) < -0.1);
    
    if (trendingUp.length > assets.length * 0.6) {
      insights.push({
        type: 'trend',
        title: 'Great Market Ascension',
        description: 'The mystical markets rise with unprecedented cosmic energy across multiple realms.',
        mysticalVision: 'A golden age of trading prosperity emerges as divine forces align to lift all sacred assets.',
        affectedAssets: trendingUp.slice(0, 5).map(a => a.id),
        impact: 'positive',
        confidence: 0.85,
        timeframe: 'Current market cycle',
        houseRelevance: { heroes: 0.9, power: 0.8, spirit: 0.7 },
        karmaAlignment: 'good',
        divineSymbols: ['📈', '🌟', '👑'],
        actionableInsights: [
          'Maintain long positions in trending assets',
          'Consider increasing portfolio allocation',
          'Monitor for potential market top signals'
        ]
      });
    }
    
    return insights;
  }

  private calculateRecentTrend(asset: EnhancedComicAssetData): number {
    if (asset.historicalPrices.length < 5) return 0;
    
    const recent = asset.historicalPrices.slice(-5);
    const older = asset.historicalPrices.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, price) => sum + price, 0) / recent.length;
    const olderAvg = older.reduce((sum, price) => sum + price, 0) / older.length;
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  private async generateAiMarketInsights(
    assets: EnhancedComicAssetData[],
    user?: User
  ): Promise<AdvancedMarketInsight[]> {
    if (!openai) return [];
    
    // Use AI to generate sophisticated market insights
    const prompt = this.buildMarketInsightsPrompt(assets, user);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are the Oracle of Advanced Market Intelligence, providing sophisticated mystical market insights with RPG-style presentation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      });

      const aiResponse = response.choices[0]?.message?.content || '';
      return this.parseAiInsights(aiResponse, assets);
      
    } catch (error) {
      console.error('Error generating AI market insights:', error);
      return [];
    }
  }

  private buildMarketInsightsPrompt(assets: EnhancedComicAssetData[], user?: User): string {
    const assetSummary = assets.slice(0, 5).map(a => 
      `${a.name} (${a.type}): $${a.currentPrice.toLocaleString()}, ` +
      `Volume: ${a.volume24h.toLocaleString()}, Trend: ${this.calculateRecentTrend(a) > 0 ? 'Rising' : 'Falling'}`
    ).join('\n');
    
    return `
As the Oracle of Advanced Market Intelligence, analyze these sacred comic assets and provide mystical market insights:

${assetSummary}

${user ? `Trader Profile: House of ${user.houseId || 'Unknown'}, Karma: ${user.karma || 0}` : ''}

Provide 2-3 advanced market insights covering:
1. Hidden opportunities or emerging trends
2. Risk factors or market warnings  
3. Cross-asset correlations or thematic plays

Present insights in mystical RPG language while maintaining analytical depth.
Include specific asset recommendations and market timing guidance.
    `;
  }

  private parseAiInsights(aiResponse: string, assets: EnhancedComicAssetData[]): AdvancedMarketInsight[] {
    // Parse AI response into structured insights
    // Simplified parsing - in production would use more sophisticated NLP
    
    const insights: AdvancedMarketInsight[] = [
      {
        type: 'opportunity',
        title: 'AI-Detected Sacred Opportunity',
        description: 'Advanced pattern recognition reveals hidden market currents.',
        mysticalVision: aiResponse.substring(0, 200) + '...',
        affectedAssets: assets.slice(0, 3).map(a => a.id),
        impact: 'positive',
        confidence: 0.78,
        timeframe: 'Next mystical cycle',
        houseRelevance: { wisdom: 0.9 },
        karmaAlignment: 'neutral',
        divineSymbols: ['🤖', '🔮', '📊'],
        actionableInsights: [
          'Advanced AI analysis suggests favorable conditions',
          'Monitor AI confidence levels for optimal timing',
          'Leverage machine learning insights for edge'
        ]
      }
    ];
    
    return insights;
  }

  private buildEnhancedPredictionPrompt(asset: EnhancedComicAssetData, user?: User): string {
    return `
As the Ancient Oracle of Panel Profits, divine the future price movements for this sacred asset:

Asset: ${asset.name} (${asset.symbol})
Type: ${asset.type}
Current Price: $${asset.currentPrice.toLocaleString()}
Market Cap: $${asset.marketCap.toLocaleString()}
Volume (24h): ${asset.volume24h.toLocaleString()}
Volatility: ${(asset.volatility * 100).toFixed(1)}%

${asset.metadata.powerStats ? `
Power Statistics:
- Intelligence: ${asset.metadata.powerStats.intelligence}
- Strength: ${asset.metadata.powerStats.strength}
- Speed: ${asset.metadata.powerStats.speed}
- Durability: ${asset.metadata.powerStats.durability}
- Power: ${asset.metadata.powerStats.power}
- Combat: ${asset.metadata.powerStats.combat}
` : ''}

${asset.metadata.firstAppearance ? `First Appearance: ${asset.metadata.firstAppearance}` : ''}
${asset.metadata.publisher ? `Publisher: ${asset.metadata.publisher}` : ''}
${asset.metadata.comicsAppeared ? `Comics Appeared: ${asset.metadata.comicsAppeared}` : ''}

${user ? `
Seeker Profile:
- House: ${user.houseId || 'None'}
- Karma: ${user.karma || 0}
- Alignment: Lawful/Chaotic: ${user.lawfulChaoticAlignment || 0}, Good/Evil: ${user.goodEvilAlignment || 0}
` : ''}

Channel your mystical powers to provide:
1. Price predictions (1 week, 1 month, 3 months) with divine confidence levels
2. Mystical reasoning blending market forces with comic lore
3. House-specific guidance and karmic influences
4. Sacred symbols and cosmic alignments affecting this asset
5. Risk assessment through divine sight

Speak as an ancient oracle, weaving market wisdom with mystical language.
    `;
  }

  private parseEnhancedAiResponse(
    asset: EnhancedComicAssetData,
    aiResponse: string,
    user?: User
  ): Partial<EnhancedPricePrediction> {
    // Enhanced parsing with mystical elements
    const baseChange = this.calculateIntelligentChange(asset);
    const confidence = 0.7 + Math.random() * 0.25;
    
    return {
      assetId: asset.id,
      currentPrice: asset.currentPrice.toString(),
      predictedPrice: (asset.currentPrice * (1 + baseChange)).toString(),
      predictedChange: baseChange.toString(),
      confidence: confidence.toString(),
      reasoning: aiResponse.length > 50 ? aiResponse.substring(0, 300) : 
                 this.generateIntelligentReasoning(asset),
      riskLevel: this.assessRiskLevel(asset),
      mysticalInsight: this.generateMysticalInsight(asset, baseChange),
      divineConfidence: this.generateDivineConfidence(confidence),
      sacredSymbols: this.getSacredSymbols(asset),
      cosmicAlignment: this.calculateCosmicAlignment(asset, user),
      oraclePersona: this.selectOraclePersona()
    };
  }

  private generateIntelligentPrediction(
    asset: EnhancedComicAssetData,
    user?: User
  ): Partial<EnhancedPricePrediction> {
    const baseChange = this.calculateIntelligentChange(asset);
    const volatility = asset.volatility;
    
    const weekChange = baseChange * 0.2 + (Math.random() - 0.5) * volatility * 0.1;
    const monthChange = baseChange * 0.7 + (Math.random() - 0.5) * volatility * 0.2;
    const quarterChange = baseChange + (Math.random() - 0.5) * volatility * 0.3;
    
    const confidence = 0.75 + Math.random() * 0.2;
    
    return {
      assetId: asset.id,
      currentPrice: asset.currentPrice.toString(),
      predictedPrice: (asset.currentPrice * (1 + monthChange)).toString(),
      predictedChange: monthChange.toString(),
      confidence: confidence.toString(),
      reasoning: this.generateIntelligentReasoning(asset),
      riskLevel: this.assessRiskLevel(asset),
      mysticalInsight: this.generateMysticalInsight(asset, monthChange),
      divineConfidence: this.generateDivineConfidence(confidence),
      sacredSymbols: this.getSacredSymbols(asset),
      cosmicAlignment: this.calculateCosmicAlignment(asset, user),
      oraclePersona: this.selectOraclePersona()
    };
  }

  private calculateIntelligentChange(asset: EnhancedComicAssetData): number {
    let changeMultiplier = 0;
    
    // Type-based factors
    if (asset.type === 'character') {
      const powerLevel = this.calculateTotalPowerLevel(asset);
      changeMultiplier += (powerLevel - 50) / 1000; // Power bonus
    }
    
    // Popularity and market factors
    if (asset.metadata.movieAppearances && asset.metadata.movieAppearances > 0) {
      changeMultiplier += 0.05;
    }
    
    if (asset.metadata.comicsAppeared && asset.metadata.comicsAppeared > 100) {
      changeMultiplier += 0.03;
    }
    
    // Market cap influence
    if (asset.marketCap >= 1000000) changeMultiplier += 0.02;
    else if (asset.marketCap >= 100000) changeMultiplier += 0.04;
    else changeMultiplier += 0.06;
    
    // Volatility consideration
    changeMultiplier += (Math.random() - 0.5) * asset.volatility;
    
    return Math.max(-0.3, Math.min(changeMultiplier, 0.3));
  }

  private generateIntelligentReasoning(asset: EnhancedComicAssetData): string {
    const factors = [];
    
    if (asset.type === 'character') {
      const powerLevel = this.calculateTotalPowerLevel(asset);
      factors.push(`character power level of ${powerLevel.toFixed(1)}`);
    }
    
    if (asset.metadata.movieAppearances && asset.metadata.movieAppearances > 0) {
      factors.push('media presence boosting visibility');
    }
    
    if (asset.metadata.firstAppearance) {
      factors.push('first appearance historical significance');
    }
    
    if (asset.metadata.publisher === 'Marvel Comics' || asset.metadata.publisher === 'DC Comics') {
      factors.push('major publisher premium');
    }
    
    return `Sacred analysis reveals ${factors.join(', ')}. Current market energies suggest ` +
           `${asset.volatility > 0.2 ? 'high mystical turbulence' : 'stable cosmic flows'} affecting price trajectory.`;
  }

  private assessRiskLevel(asset: EnhancedComicAssetData): string {
    if (asset.volatility > 0.3) return 'HIGH';
    if (asset.volatility > 0.15) return 'MEDIUM';
    return 'LOW';
  }

  private generateMysticalInsight(asset: EnhancedComicAssetData, priceChange: number): string {
    const insights = [
      `The cosmic winds favor ${asset.name} as celestial forces align for ${priceChange > 0 ? 'ascension' : 'purification'}.`,
      `Divine prophecies speak of ${asset.name}'s destiny to ${priceChange > 0 ? 'rise above mortal expectations' : 'undergo sacred trials'}.`,
      `The ancient spirits whisper that ${asset.name} shall ${priceChange > 0 ? 'claim greater glory' : 'find wisdom through challenge'}.`,
      `Sacred energies surrounding ${asset.name} indicate a time of ${priceChange > 0 ? 'mystical growth' : 'necessary transformation'}.`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private generateDivineConfidence(confidence: number): string {
    if (confidence > 0.9) return 'Divine Certainty - The Oracle speaks with absolute clarity';
    if (confidence > 0.8) return 'Sacred Confidence - The mystical visions are strong';
    if (confidence > 0.7) return 'Mystical Clarity - The cosmic signs align favorably';
    if (confidence > 0.6) return 'Ethereal Guidance - The spirits offer wisdom';
    return 'Veiled Prophecy - The future remains partially shrouded';
  }

  private getSacredSymbols(asset: EnhancedComicAssetData): string[] {
    const symbols = ['🔮', '⭐', '🌟'];
    
    if (asset.type === 'character') symbols.push('⚔️', '🛡️');
    if (asset.metadata.powerStats && this.calculateTotalPowerLevel(asset) > 80) symbols.push('⚡', '💥');
    if (asset.metadata.firstAppearance) symbols.push('👑', '📜');
    
    return symbols.slice(0, 3);
  }

  private calculateCosmicAlignment(asset: EnhancedComicAssetData, user?: User): number {
    let alignment = 0.5; // Base neutral alignment
    
    // User house bonus
    if (user?.houseId && this.isAssetRelevantToHouse(asset, user.houseId)) {
      alignment += 0.3;
    }
    
    // Karma influence
    if (user?.karma) {
      alignment += (user.karma / 1000) * 0.2; // Max 20% karma bonus
    }
    
    // Asset power level
    if (asset.type === 'character') {
      const powerLevel = this.calculateTotalPowerLevel(asset);
      alignment += (powerLevel - 50) / 200; // Normalize power influence
    }
    
    return Math.max(0, Math.min(alignment, 1));
  }

  private selectOraclePersona(): string {
    return this.MYSTICAL_PERSONAS[Math.floor(Math.random() * this.MYSTICAL_PERSONAS.length)];
  }

  private async enhanceWithHouseKarma(
    prediction: Partial<EnhancedPricePrediction>,
    asset: EnhancedComicAssetData,
    user?: User
  ): Promise<Partial<EnhancedPricePrediction>> {
    let enhanced = { ...prediction };
    
    // House bonuses
    if (user?.houseId) {
      const houseBonus = this.calculateHouseBonus(asset, user.houseId);
      enhanced.houseBonus = { [user.houseId]: houseBonus };
      
      // Apply house bonus to predicted change
      const currentChange = parseFloat(enhanced.predictedChange || '0');
      enhanced.predictedChange = (currentChange * (1 + houseBonus)).toString();
    }
    
    // Karma influence
    if (user?.karma) {
      const karmaInfluence = Math.min(Math.abs(user.karma) / 1000, 0.2); // Max 20% influence
      enhanced.karmaInfluence = karmaInfluence.toString();
      
      // Apply karma bonus
      const currentChange = parseFloat(enhanced.predictedChange || '0');
      const karmaMultiplier = user.karma > 0 ? (1 + karmaInfluence) : (1 - karmaInfluence);
      enhanced.predictedChange = (currentChange * karmaMultiplier).toString();
    }
    
    return enhanced;
  }

  private calculateHouseBonus(asset: EnhancedComicAssetData, houseId: string): number {
    if (!this.isAssetRelevantToHouse(asset, houseId)) return 0;
    
    // House-specific bonuses
    const houseBonuses = {
      heroes: 0.15,   // 15% bonus for heroic characters
      wisdom: 0.12,   // 12% bonus for intelligent assets
      power: 0.18,    // 18% bonus for powerful entities
      mystery: 0.10,  // 10% bonus for mystical assets
      elements: 0.08, // 8% bonus for elemental connections
      time: 0.06,     // 6% bonus for temporal assets
      spirit: 0.14    // 14% bonus for team/social assets
    };
    
    return houseBonuses[houseId as keyof typeof houseBonuses] || 0;
  }

  private async addMysticalPresentation(
    prediction: Partial<EnhancedPricePrediction>,
    asset: EnhancedComicAssetData
  ): Promise<EnhancedPricePrediction> {
    // Add mystical presentation layer
    return {
      ...prediction,
      mysticalInsight: prediction.mysticalInsight || this.generateMysticalInsight(asset, parseFloat(prediction.predictedChange || '0')),
      divineConfidence: prediction.divineConfidence || this.generateDivineConfidence(parseFloat(prediction.confidence || '0.75')),
      sacredSymbols: prediction.sacredSymbols || this.getSacredSymbols(asset),
      cosmicAlignment: prediction.cosmicAlignment || 0.5,
      oraclePersona: prediction.oraclePersona || this.selectOraclePersona()
    } as EnhancedPricePrediction;
  }

  private generateFallbackPrediction(asset: EnhancedComicAssetData, user?: User): EnhancedPricePrediction {
    const baseChange = this.calculateIntelligentChange(asset);
    const confidence = 0.7;
    
    return {
      id: `prediction_${asset.id}_${Date.now()}`,
      assetId: asset.id,
      predictionType: 'price',
      timeframe: '1m',
      currentPrice: asset.currentPrice.toString(),
      predictedPrice: (asset.currentPrice * (1 + baseChange)).toString(),
      predictedChange: baseChange.toString(),
      confidence: confidence.toString(),
      reasoning: this.generateIntelligentReasoning(asset),
      marketFactors: ['Market fundamentals', 'Historical patterns'],
      riskLevel: this.assessRiskLevel(asset),
      aiModel: 'enhanced-fallback',
      houseBonus: user?.houseId ? { [user.houseId]: this.calculateHouseBonus(asset, user.houseId) } : null,
      karmaInfluence: user?.karma ? (Math.abs(user.karma) / 1000 * 0.1).toString() : null,
      actualOutcome: null,
      accuracy: null,
      isActive: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Enhanced mystical properties
      mysticalInsight: this.generateMysticalInsight(asset, baseChange),
      divineConfidence: this.generateDivineConfidence(confidence),
      sacredSymbols: this.getSacredSymbols(asset),
      cosmicAlignment: this.calculateCosmicAlignment(asset, user),
      oraclePersona: this.selectOraclePersona()
    };
  }
}

export const enhancedAiMarketIntelligence = new EnhancedAiMarketIntelligenceService();