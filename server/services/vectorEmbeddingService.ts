import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Vector Embedding Service for Panel Profits AI
 * Generates vector embeddings for visual similarity, semantic search, and pattern matching
 * Supports OpenAI text and image embeddings for comic trading intelligence
 */

export interface EmbeddingResult {
  embedding: number[];
  dimensions: number;
  model: string;
  usage?: {
    promptTokens: number;
    totalTokens: number;
  };
}

export interface AssetMetadata {
  name: string;
  type: string;
  description?: string;
  publisher?: string;
  yearPublished?: number;
  category?: string;
  tags?: string[];
}

export interface MarketInsightContent {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  source?: string;
}

export interface PricePatternData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change?: number;
  percentChange?: number;
  technicalIndicators?: Record<string, any>;
}

class VectorEmbeddingService {
  private readonly textEmbeddingModel = "text-embedding-3-small"; // Latest OpenAI embedding model
  private readonly imageEmbeddingModel = "gpt-5"; // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  private readonly embeddingDimensions = 1536; // Standard OpenAI embedding dimensions

  /**
   * Generate text embedding for asset metadata (for recommendations)
   */
  async generateAssetMetadataEmbedding(metadata: AssetMetadata): Promise<EmbeddingResult | null> {
    if (!openai) {
      console.warn('🔧 OpenAI API key not available, skipping embedding generation');
      return null;
    }

    try {
      // Create comprehensive text representation of asset
      const assetText = this.buildAssetText(metadata);
      
      console.log(`🔮 Generating asset metadata embedding for: ${metadata.name}`);
      
      const response = await openai.embeddings.create({
        model: this.textEmbeddingModel,
        input: assetText,
      });

      return {
        embedding: response.data[0].embedding,
        dimensions: response.data[0].embedding.length,
        model: this.textEmbeddingModel,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        }
      };

    } catch (error) {
      console.error(`🚨 Asset embedding error for ${metadata.name}:`, error);
      return null;
    }
  }

  /**
   * Generate text embedding for market insight content (for semantic search)
   */
  async generateMarketInsightEmbedding(insight: MarketInsightContent): Promise<EmbeddingResult | null> {
    if (!openai) {
      console.warn('🔧 OpenAI API key not available, skipping embedding generation');
      return null;
    }

    try {
      // Create comprehensive text representation of market insight
      const insightText = this.buildInsightText(insight);
      
      console.log(`🔮 Generating market insight embedding for: ${insight.title}`);
      
      const response = await openai.embeddings.create({
        model: this.textEmbeddingModel,
        input: insightText,
      });

      return {
        embedding: response.data[0].embedding,
        dimensions: response.data[0].embedding.length,
        model: this.textEmbeddingModel,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        }
      };

    } catch (error) {
      console.error(`🚨 Market insight embedding error for ${insight.title}:`, error);
      return null;
    }
  }

  /**
   * Generate image embedding for comic grading (for visual similarity)
   */
  async generateComicImageEmbedding(imageData: string, imageName?: string): Promise<EmbeddingResult | null> {
    if (!openai) {
      console.warn('🔧 OpenAI API key not available, skipping embedding generation');
      return null;
    }

    try {
      console.log(`🔮 Generating comic image embedding for: ${imageName || 'comic image'}`);
      
      // Use vision model to analyze image and extract visual features
      const visionResponse = await openai.chat.completions.create({
        model: this.imageEmbeddingModel,
        messages: [
          {
            role: "system",
            content: "Analyze this comic book image and extract detailed visual features for similarity matching. Focus on condition factors, artwork style, character presence, cover design, and any defects or notable characteristics."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this comic book image and provide a detailed description focusing on visual characteristics for similarity matching."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`,
                  detail: "high"
                }
              }
            ],
          },
        ],
        max_completion_tokens: 1000,
      });

      const visualAnalysis = visionResponse.choices[0].message.content || '';
      
      // Generate embedding from visual analysis text
      const embeddingResponse = await openai.embeddings.create({
        model: this.textEmbeddingModel,
        input: visualAnalysis,
      });

      return {
        embedding: embeddingResponse.data[0].embedding,
        dimensions: embeddingResponse.data[0].embedding.length,
        model: `${this.imageEmbeddingModel}+${this.textEmbeddingModel}`,
        usage: {
          promptTokens: embeddingResponse.usage.prompt_tokens,
          totalTokens: embeddingResponse.usage.total_tokens,
        }
      };

    } catch (error) {
      console.error(`🚨 Comic image embedding error for ${imageName}:`, error);
      return null;
    }
  }

  /**
   * Generate price pattern embedding for market data (for pattern recognition)
   */
  async generatePricePatternEmbedding(priceData: PricePatternData[], assetName?: string): Promise<EmbeddingResult | null> {
    if (!openai) {
      console.warn('🔧 OpenAI API key not available, skipping embedding generation');
      return null;
    }

    try {
      // Create text representation of price patterns
      const patternText = this.buildPricePatternText(priceData, assetName);
      
      console.log(`🔮 Generating price pattern embedding for: ${assetName || 'market data'}`);
      
      const response = await openai.embeddings.create({
        model: this.textEmbeddingModel,
        input: patternText,
      });

      return {
        embedding: response.data[0].embedding,
        dimensions: response.data[0].embedding.length,
        model: this.textEmbeddingModel,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        }
      };

    } catch (error) {
      console.error(`🚨 Price pattern embedding error for ${assetName}:`, error);
      return null;
    }
  }

  /**
   * Generate embedding for general text content
   */
  async generateTextEmbedding(text: string, context?: string): Promise<EmbeddingResult | null> {
    if (!openai) {
      console.warn('🔧 OpenAI API key not available, skipping embedding generation');
      return null;
    }

    try {
      console.log(`🔮 Generating text embedding for: ${context || 'text content'}`);
      
      const response = await openai.embeddings.create({
        model: this.textEmbeddingModel,
        input: text,
      });

      return {
        embedding: response.data[0].embedding,
        dimensions: response.data[0].embedding.length,
        model: this.textEmbeddingModel,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        }
      };

    } catch (error) {
      console.error(`🚨 Text embedding error for ${context}:`, error);
      return null;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generate SQL for vector similarity search
   */
  generateSimilaritySearchSQL(
    tableName: string,
    vectorColumn: string,
    queryVector: number[],
    limit: number = 10,
    threshold: number = 0.7
  ): { sql: string; params: any[] } {
    const vectorString = `[${queryVector.join(',')}]`;
    
    const sql = `
      SELECT *, 
             (1 - (${vectorColumn} <=> $1::vector)) as similarity_score
      FROM ${tableName} 
      WHERE ${vectorColumn} IS NOT NULL
        AND (1 - (${vectorColumn} <=> $1::vector)) > $2
      ORDER BY ${vectorColumn} <=> $1::vector
      LIMIT $3
    `;

    return {
      sql,
      params: [vectorString, threshold, limit]
    };
  }

  /**
   * Build comprehensive text representation for asset metadata
   */
  private buildAssetText(metadata: AssetMetadata): string {
    const parts = [
      `Asset: ${metadata.name}`,
      `Type: ${metadata.type}`,
      metadata.publisher && `Publisher: ${metadata.publisher}`,
      metadata.yearPublished && `Year: ${metadata.yearPublished}`,
      metadata.category && `Category: ${metadata.category}`,
      metadata.description && `Description: ${metadata.description}`,
      metadata.tags && metadata.tags.length > 0 && `Tags: ${metadata.tags.join(', ')}`
    ].filter(Boolean);

    return parts.join('\n');
  }

  /**
   * Build comprehensive text representation for market insights
   */
  private buildInsightText(insight: MarketInsightContent): string {
    const parts = [
      `Title: ${insight.title}`,
      `Content: ${insight.content}`,
      insight.category && `Category: ${insight.category}`,
      insight.source && `Source: ${insight.source}`,
      insight.tags && insight.tags.length > 0 && `Tags: ${insight.tags.join(', ')}`
    ].filter(Boolean);

    return parts.join('\n');
  }

  /**
   * Build text representation for price pattern analysis
   */
  private buildPricePatternText(priceData: PricePatternData[], assetName?: string): string {
    const analysis = this.analyzePricePattern(priceData);
    
    const parts = [
      assetName && `Asset: ${assetName}`,
      `Price Pattern Analysis:`,
      `Trend: ${analysis.trend}`,
      `Volatility: ${analysis.volatility}`,
      `Volume Pattern: ${analysis.volumePattern}`,
      `Support Level: ${analysis.supportLevel}`,
      `Resistance Level: ${analysis.resistanceLevel}`,
      `Pattern Type: ${analysis.patternType}`,
      `Technical Summary: ${analysis.technicalSummary}`
    ].filter(Boolean);

    return parts.join('\n');
  }

  /**
   * Analyze price data to extract pattern characteristics
   */
  private analyzePricePattern(priceData: PricePatternData[]): {
    trend: string;
    volatility: string;
    volumePattern: string;
    supportLevel: number;
    resistanceLevel: number;
    patternType: string;
    technicalSummary: string;
  } {
    if (priceData.length === 0) {
      return {
        trend: 'Unknown',
        volatility: 'Unknown',
        volumePattern: 'Unknown',
        supportLevel: 0,
        resistanceLevel: 0,
        patternType: 'Insufficient Data',
        technicalSummary: 'No price data available for analysis'
      };
    }

    const prices = priceData.map(d => d.close);
    const volumes = priceData.map(d => d.volume);
    const first = prices[0];
    const last = prices[prices.length - 1];
    
    // Calculate trend
    const overallChange = ((last - first) / first) * 100;
    const trend = overallChange > 5 ? 'Strong Uptrend' : 
                  overallChange > 1 ? 'Uptrend' :
                  overallChange < -5 ? 'Strong Downtrend' :
                  overallChange < -1 ? 'Downtrend' : 'Sideways';

    // Calculate volatility
    const changes = priceData.map(d => Math.abs(d.percentChange || 0));
    const avgVolatility = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const volatility = avgVolatility > 10 ? 'High' : avgVolatility > 5 ? 'Medium' : 'Low';

    // Analyze volume pattern
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const recentVolume = volumes.slice(-3).reduce((sum, vol) => sum + vol, 0) / 3;
    const volumePattern = recentVolume > avgVolume * 1.5 ? 'Increasing' : 
                         recentVolume < avgVolume * 0.5 ? 'Decreasing' : 'Stable';

    // Calculate support and resistance
    const supportLevel = Math.min(...prices);
    const resistanceLevel = Math.max(...prices);

    // Identify pattern type
    const patternType = this.identifyPatternType(priceData);

    const technicalSummary = `${trend.toLowerCase()} with ${volatility.toLowerCase()} volatility, ${volumePattern.toLowerCase()} volume, trading between $${supportLevel} and $${resistanceLevel}`;

    return {
      trend,
      volatility,
      volumePattern,
      supportLevel,
      resistanceLevel,
      patternType,
      technicalSummary
    };
  }

  /**
   * Identify technical analysis pattern type
   */
  private identifyPatternType(priceData: PricePatternData[]): string {
    if (priceData.length < 10) return 'Insufficient Data';

    const prices = priceData.map(d => d.close);
    const highs = priceData.map(d => d.high);
    const lows = priceData.map(d => d.low);

    // Simple pattern detection logic
    const recentPrices = prices.slice(-10);
    const firstHalf = recentPrices.slice(0, 5);
    const secondHalf = recentPrices.slice(5);

    const firstAvg = firstHalf.reduce((sum, price) => sum + price, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, price) => sum + price, 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.05) return 'Ascending Pattern';
    if (secondAvg < firstAvg * 0.95) return 'Descending Pattern';
    
    // Check for consolidation
    const priceRange = Math.max(...recentPrices) - Math.min(...recentPrices);
    const avgPrice = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const rangePercent = (priceRange / avgPrice) * 100;

    if (rangePercent < 5) return 'Consolidation';
    if (rangePercent > 20) return 'High Volatility';

    return 'Range-bound';
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return openai !== null;
  }

  /**
   * Get service status and configuration info
   */
  getServiceStatus(): {
    configured: boolean;
    textModel: string;
    imageModel: string;
    dimensions: number;
  } {
    return {
      configured: this.isConfigured(),
      textModel: this.textEmbeddingModel,
      imageModel: this.imageEmbeddingModel,
      dimensions: this.embeddingDimensions
    };
  }
}

export const vectorEmbeddingService = new VectorEmbeddingService();