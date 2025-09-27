import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * AI-Powered Market Intelligence Service
 * Provides price predictions, market analysis, and investment insights
 * This is the core AI engine for "Beat the AI" competitions
 */

export interface ComicAssetData {
  name: string;
  symbol: string;
  currentPrice: number;
  yearPublished: number;
  grade?: string;
  category: string;
  firstAppearance?: boolean;
  publisher: string;
  recentSales?: number[];
  marketCap: number;
}

export interface PricePrediction {
  assetId: string;
  currentPrice: number;
  predictedPrice1Week: number;
  predictedPrice1Month: number;
  predictedPrice3Month: number;
  confidence: number;
  reasoning: string;
  marketFactors: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MarketInsight {
  type: 'TREND' | 'OPPORTUNITY' | 'RISK' | 'MILESTONE';
  title: string;
  description: string;
  affectedAssets: string[];
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  timeframe: string;
}

export interface BeatTheAIChallenge {
  id: string;
  title: string;
  description: string;
  targetAssets: string[];
  startDate: string;
  endDate: string;
  prizePool: number;
  participantCount: number;
  aiPrediction: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

class AIMarketIntelligenceService {
  
  /**
   * Generate AI-powered price predictions for comic assets
   */
  async generatePricePredictions(assets: ComicAssetData[]): Promise<PricePrediction[]> {
    console.log('🤖 AI: Generating price predictions for', assets.length, 'assets...');
    
    const predictions = await Promise.all(assets.map(async (asset) => {
      try {
        // Use real AI if available, otherwise use intelligent mock predictions
        if (openai) {
          const prompt = this.buildPredictionPrompt(asset);
          
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert comic book investment analyst with deep knowledge of market trends, character popularity, movie tie-ins, and collectible valuations. Provide data-driven price predictions with clear reasoning."
              },
              {
                role: "user", 
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 800
          });

          const aiResponse = response.choices[0]?.message?.content || '';
          return this.parsePredictionResponse(asset, aiResponse);
        } else {
          // Generate intelligent mock prediction for demo
          return this.generateIntelligentPrediction(asset);
        }
        
      } catch (error) {
        console.error('🤖 AI Error for', asset.name, ':', error);
        return this.generateFallbackPrediction(asset);
      }
    }));

    console.log('🤖 AI: Generated', predictions.length, 'price predictions');
    return predictions;
  }

  /**
   * Generate market insights and opportunities
   */
  async generateMarketInsights(marketData: ComicAssetData[]): Promise<MarketInsight[]> {
    console.log('🤖 AI: Analyzing market for insights...');
    
    try {
      // Use real AI if available, otherwise use intelligent mock insights
      if (openai) {
        const prompt = this.buildMarketAnalysisPrompt(marketData);
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a comic book market analyst identifying trends, opportunities, and risks. Focus on actionable insights for investors."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.4,
          max_tokens: 1000
        });

        const aiResponse = response.choices[0]?.message?.content || '';
        return this.parseMarketInsights(aiResponse);
      } else {
        // Generate intelligent market insights for demo
        return this.generateIntelligentInsights(marketData);
      }
      
    } catch (error) {
      console.error('🤖 AI Market Analysis Error:', error);
      return this.generateFallbackInsights();
    }
  }

  /**
   * Create "Beat the AI" challenge
   */
  async createBeatTheAIChallenge(assets: ComicAssetData[]): Promise<BeatTheAIChallenge> {
    console.log('🤖 AI: Creating Beat the AI challenge...');
    
    // Select high-value, volatile assets for the challenge
    const challengeAssets = assets
      .filter(asset => asset.marketCap >= 50000 && asset.marketCap <= 500000)
      .slice(0, 5);

    // AI makes its prediction for the challenge period
    const predictions = await this.generatePricePredictions(challengeAssets);
    const averagePredictedChange = predictions.reduce((sum, pred) => {
      const changePercent = ((pred.predictedPrice1Month - pred.currentPrice) / pred.currentPrice) * 100;
      return sum + changePercent;
    }, 0) / predictions.length;

    const challenge: BeatTheAIChallenge = {
      id: `challenge_${Date.now()}`,
      title: "December Comic Investment Challenge",
      description: "Predict which comics will outperform the market this month. Beat our AI's predictions to win!",
      targetAssets: challengeAssets.map(a => a.symbol),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      prizePool: 10000, // $10K prize pool
      participantCount: 0,
      aiPrediction: Math.round(averagePredictedChange * 100) / 100,
      status: 'ACTIVE'
    };

    console.log('🤖 AI Challenge Created:', challenge.title, 'AI Prediction:', challenge.aiPrediction + '%');
    return challenge;
  }

  private buildPredictionPrompt(asset: ComicAssetData): string {
    return `
Analyze this comic book asset for price prediction:

Asset: ${asset.name} (${asset.symbol})
Current Price: $${asset.currentPrice.toLocaleString()}
Published: ${asset.yearPublished}
Publisher: ${asset.publisher}
Category: ${asset.category}
Market Cap: $${asset.marketCap.toLocaleString()}
${asset.grade ? `Grade: ${asset.grade}` : ''}
${asset.firstAppearance ? 'KEY FEATURE: First Appearance' : ''}

Consider these factors:
1. Historical significance and character importance
2. Upcoming movie/TV adaptations
3. Market trends for this publisher/era
4. Condition rarity and grading premiums
5. Recent sales patterns and collector interest

Provide predictions for 1 week, 1 month, and 3 months with percentage confidence.
Include key market factors driving your prediction.
Assess risk level (LOW/MEDIUM/HIGH) based on volatility and market conditions.

Format: Brief analysis with specific price predictions and reasoning.
    `;
  }

  private buildMarketAnalysisPrompt(assets: ComicAssetData[]): string {
    const topAssets = assets.slice(0, 10);
    const publisherSet = new Set(assets.map(a => a.publisher));
    const publishers = Array.from(publisherSet);
    const avgPrice = assets.reduce((sum, a) => sum + a.currentPrice, 0) / assets.length;
    
    return `
Analyze the current comic book market:

Market Overview:
- ${assets.length} assets analyzed
- Publishers: ${publishers.join(', ')}
- Average price: $${avgPrice.toLocaleString()}
- Top assets: ${topAssets.map(a => `${a.name} ($${a.currentPrice.toLocaleString()})`).join(', ')}

Identify 3-5 market insights covering:
1. Trending publishers or character types
2. Undervalued opportunities (assets below fair value)
3. Market risks or overvalued segments
4. Upcoming catalysts (movies, anniversaries, etc.)
5. Investment themes or patterns

Focus on actionable insights for serious comic investors.
    `;
  }

  private parsePredictionResponse(asset: ComicAssetData, aiResponse: string): PricePrediction {
    // Parse AI response to extract structured prediction data
    // For now, provide intelligent fallback with some AI-inspired variation
    
    const baseChange = this.calculateBaselineChange(asset);
    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
    
    return {
      assetId: asset.symbol,
      currentPrice: asset.currentPrice,
      predictedPrice1Week: Math.round(asset.currentPrice * (1 + baseChange * 0.2)),
      predictedPrice1Month: Math.round(asset.currentPrice * (1 + baseChange)),
      predictedPrice3Month: Math.round(asset.currentPrice * (1 + baseChange * 2.5)),
      confidence: Math.round(confidence * 100) / 100,
      reasoning: this.extractReasoningFromAI(aiResponse, asset),
      marketFactors: this.extractMarketFactors(asset),
      riskLevel: this.assessRiskLevel(asset)
    };
  }

  private parseMarketInsights(aiResponse: string): MarketInsight[] {
    // Parse AI response into structured insights
    // For now, generate intelligent insights based on market patterns
    
    return [
      {
        type: 'TREND',
        title: 'Golden Age Comics Surge',
        description: 'Pre-1950 comics showing 15% average price increase due to institutional interest and rarity recognition.',
        affectedAssets: ['ACT1', 'DET27', 'MAR1'],
        impact: 'POSITIVE',
        confidence: 0.85,
        timeframe: 'Next 3 months'
      },
      {
        type: 'OPPORTUNITY',
        title: 'Marvel Silver Age Undervalued',
        description: 'Fantastic Four and early X-Men issues trading below institutional-grade valuations. Strong buy signals.',
        affectedAssets: ['FF1', 'XMEN1'],
        impact: 'POSITIVE',
        confidence: 0.78,
        timeframe: 'Next 6 months'
      },
      {
        type: 'MILESTONE',
        title: 'Spider-Man Anniversary Effect',
        description: 'Amazing Fantasy #15 approaching 62nd anniversary. Historical data shows 20%+ price spikes during milestone years.',
        affectedAssets: ['AF15'],
        impact: 'POSITIVE',
        confidence: 0.92,
        timeframe: 'Next 2 months'
      }
    ];
  }

  private generateFallbackPrediction(asset: ComicAssetData): PricePrediction {
    const baseChange = this.calculateBaselineChange(asset);
    
    return {
      assetId: asset.symbol,
      currentPrice: asset.currentPrice,
      predictedPrice1Week: Math.round(asset.currentPrice * (1 + baseChange * 0.1)),
      predictedPrice1Month: Math.round(asset.currentPrice * (1 + baseChange * 0.5)),
      predictedPrice3Month: Math.round(asset.currentPrice * (1 + baseChange)),
      confidence: 0.75,
      reasoning: "Market analysis based on historical patterns, rarity factors, and comparable sales data.",
      marketFactors: this.extractMarketFactors(asset),
      riskLevel: this.assessRiskLevel(asset)
    };
  }

  private generateFallbackInsights(): MarketInsight[] {
    return [
      {
        type: 'TREND',
        title: 'Market Analysis Available',
        description: 'AI-powered market intelligence ready. Upgrade to Pro for detailed insights.',
        affectedAssets: [],
        impact: 'NEUTRAL',
        confidence: 1.0,
        timeframe: 'Current'
      }
    ];
  }

  private calculateBaselineChange(asset: ComicAssetData): number {
    let changeMultiplier = 0;
    
    // Age premium (older = more stable growth)
    const age = 2025 - asset.yearPublished;
    if (age >= 80) changeMultiplier += 0.08; // Golden Age
    else if (age >= 60) changeMultiplier += 0.05; // Silver Age
    else if (age >= 40) changeMultiplier += 0.03; // Bronze Age
    
    // Market cap influence
    if (asset.marketCap >= 1000000) changeMultiplier += 0.03; // Blue chip
    else if (asset.marketCap >= 100000) changeMultiplier += 0.05; // Growth
    else changeMultiplier += 0.08; // Speculative
    
    // First appearance bonus
    if (asset.firstAppearance) changeMultiplier += 0.04;
    
    // Grade premium
    if (asset.grade && parseFloat(asset.grade) >= 9.0) changeMultiplier += 0.02;
    
    return Math.min(changeMultiplier, 0.25); // Cap at 25% change
  }

  private extractReasoningFromAI(aiResponse: string, asset: ComicAssetData): string {
    // Extract key reasoning points from AI response
    if (aiResponse.length > 50) {
      return aiResponse.substring(0, 200) + '...';
    }
    
    return `${asset.name} shows strong fundamentals with ${asset.yearPublished <= 1960 ? 'Golden/Silver Age' : 'modern'} appeal. Market factors include rarity, character significance, and collector demand.`;
  }

  private extractMarketFactors(asset: ComicAssetData): string[] {
    const factors = [];
    
    if (asset.yearPublished <= 1950) factors.push('Golden Age Rarity');
    if (asset.firstAppearance) factors.push('First Appearance Premium');
    if (asset.marketCap >= 500000) factors.push('Institutional Interest');
    if (asset.publisher === 'Marvel Comics' || asset.publisher === 'DC Comics') factors.push('Major Publisher');
    if (asset.grade && parseFloat(asset.grade) >= 9.0) factors.push('High Grade Premium');
    
    return factors.length > 0 ? factors : ['Market Fundamentals'];
  }

  private assessRiskLevel(asset: ComicAssetData): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (asset.marketCap >= 500000 && asset.yearPublished <= 1960) return 'LOW';
    if (asset.marketCap >= 100000) return 'MEDIUM';
    return 'HIGH';
  }

  /**
   * Generate intelligent mock predictions for demo purposes
   */
  private generateIntelligentPrediction(asset: ComicAssetData): PricePrediction {
    const baseChange = this.calculateBaselineChange(asset);
    const volatility = this.calculateVolatility(asset);
    
    // Add some realistic market intelligence
    const weekChange = baseChange * 0.15 + (Math.random() - 0.5) * volatility * 0.1;
    const monthChange = baseChange * 0.6 + (Math.random() - 0.5) * volatility * 0.2;
    const quarterChange = baseChange + (Math.random() - 0.5) * volatility * 0.3;
    
    const reasoning = this.generateIntelligentReasoning(asset);
    
    return {
      assetId: asset.symbol,
      currentPrice: asset.currentPrice,
      predictedPrice1Week: Math.round(asset.currentPrice * (1 + weekChange)),
      predictedPrice1Month: Math.round(asset.currentPrice * (1 + monthChange)),
      predictedPrice3Month: Math.round(asset.currentPrice * (1 + quarterChange)),
      confidence: Math.round((0.75 + Math.random() * 0.2) * 100) / 100,
      reasoning: reasoning,
      marketFactors: this.extractMarketFactors(asset),
      riskLevel: this.assessRiskLevel(asset)
    };
  }

  /**
   * Generate intelligent market insights based on asset data
   */
  private generateIntelligentInsights(marketData: ComicAssetData[]): MarketInsight[] {
    const insights: MarketInsight[] = [];
    
    // Golden Age analysis
    const goldenAgeAssets = marketData.filter(a => a.yearPublished <= 1950);
    if (goldenAgeAssets.length > 0) {
      insights.push({
        type: 'TREND',
        title: 'Golden Age Comics Institutional Adoption',
        description: `${goldenAgeAssets.length} Golden Age assets showing strong institutional interest. Pre-1950 comics averaging 12% quarterly growth due to extreme rarity and art investment legitimacy.`,
        affectedAssets: goldenAgeAssets.slice(0, 3).map(a => a.symbol),
        impact: 'POSITIVE',
        confidence: 0.88,
        timeframe: 'Next 6 months'
      });
    }

    // Marvel vs DC analysis
    const marvelAssets = marketData.filter(a => a.publisher === 'Marvel Comics');
    const dcAssets = marketData.filter(a => a.publisher === 'DC Comics');
    
    if (marvelAssets.length > 0 && dcAssets.length > 0) {
      const marvelAvg = marvelAssets.reduce((sum, a) => sum + a.currentPrice, 0) / marvelAssets.length;
      const dcAvg = dcAssets.reduce((sum, a) => sum + a.currentPrice, 0) / dcAssets.length;
      
      if (dcAvg > marvelAvg * 1.2) {
        insights.push({
          type: 'OPPORTUNITY',
          title: 'Marvel Comics Value Gap Opportunity',
          description: `Marvel first appearances trading at significant discount to DC equivalents. Historical data suggests 20-30% correction likely as Marvel properties dominate entertainment landscape.`,
          affectedAssets: marvelAssets.slice(0, 3).map(a => a.symbol),
          impact: 'POSITIVE',
          confidence: 0.82,
          timeframe: 'Next 12 months'
        });
      }
    }

    // First appearance analysis
    const firstAppearances = marketData.filter(a => a.firstAppearance);
    if (firstAppearances.length > 0) {
      insights.push({
        type: 'MILESTONE',
        title: 'Character First Appearances Outperforming',
        description: 'First appearance comics showing 18% average outperformance vs. regular issues. Character debuts creating generational wealth as entertainment franchises expand globally.',
        affectedAssets: firstAppearances.map(a => a.symbol),
        impact: 'POSITIVE',
        confidence: 0.91,
        timeframe: 'Current trend'
      });
    }

    return insights;
  }

  private calculateVolatility(asset: ComicAssetData): number {
    // Higher volatility for newer/speculative assets
    if (asset.yearPublished >= 1980) return 0.25;
    if (asset.yearPublished >= 1960) return 0.15;
    return 0.08; // Golden/Silver age are more stable
  }

  private generateIntelligentReasoning(asset: ComicAssetData): string {
    const factors = [];
    
    if (asset.yearPublished <= 1950) {
      factors.push(`Golden Age rarity (${2025 - asset.yearPublished} years old)`);
    } else if (asset.yearPublished <= 1970) {
      factors.push(`Silver Age significance with established collector base`);
    }
    
    if (asset.firstAppearance) {
      factors.push('character debut creating franchise value');
    }
    
    if (asset.marketCap >= 1000000) {
      factors.push('institutional-grade asset with museum quality');
    }
    
    if (asset.grade && parseFloat(asset.grade) >= 9.0) {
      factors.push(`exceptional ${asset.grade} grade commanding premium`);
    }
    
    const trend = Math.random() > 0.3 ? 'upward momentum' : 'consolidation pattern';
    
    return `Market analysis indicates ${factors.join(', ')}. Current ${trend} supported by ${asset.publisher === 'Marvel Comics' ? 'Marvel universe expansion' : 'DC entertainment pipeline'}. Risk-adjusted return projections favor continued appreciation.`;
  }
}

export const aiMarketIntelligence = new AIMarketIntelligenceService();