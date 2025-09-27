import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { storage } from '../storage.js';
import { vectorEmbeddingService } from './vectorEmbeddingService.js';
import type { InsertAsset, InsertMarketData, InsertMarketInsight } from '@shared/schema.js';

/**
 * Marvel vs DC Dataset Import Service
 * Transforms 1,691 movie/TV show entries into tradeable comic assets
 * Generates market data, vector embeddings, and professional trading symbols
 */

export interface MarvelDcEntry {
  ID: string;
  Movie: string;
  Year: string;
  Genre: string;
  RunTime: string;
  Description: string;
  IMDB_Score: string;
}

export interface TransformedAsset {
  asset: InsertAsset;
  marketData: InsertMarketData[];
  insights: InsertMarketInsight[];
}

class MarvelDcDataImportService {
  private readonly csvFilePath = path.join(process.cwd(), 'attached_assets', 'Marvel Vs DC NEW_1759010283315.csv');
  
  /**
   * Import and transform the complete Marvel vs DC dataset
   */
  async importMarvelDcDataset(): Promise<{
    success: boolean;
    imported: number;
    errors: string[];
    assets: string[];
  }> {
    console.log('🚀 Starting Marvel vs DC dataset import...');
    
    const result = {
      success: false,
      imported: 0,
      errors: [] as string[],
      assets: [] as string[]
    };

    try {
      // Parse CSV file
      const rawData = await this.parseCSVFile();
      console.log(`📋 Parsed ${rawData.length} entries from CSV`);

      // Transform entries into trading assets
      const transformedAssets: TransformedAsset[] = [];
      for (const entry of rawData) {
        try {
          const transformed = await this.transformToTradingAsset(entry);
          transformedAssets.push(transformed);
        } catch (error) {
          result.errors.push(`Failed to transform ${entry.Movie}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      console.log(`🔄 Transformed ${transformedAssets.length} assets`);

      // Import assets to database
      for (const { asset, marketData, insights } of transformedAssets) {
        try {
          // Create asset
          const createdAsset = await storage.createAsset(asset);
          console.log(`✅ Created asset: ${createdAsset.symbol}`);
          
          // Create market data for all timeframes
          const marketDataWithAssetId = marketData.map(md => ({
            ...md,
            assetId: createdAsset.id
          }));
          
          await storage.createBulkMarketData(marketDataWithAssetId);
          
          // Create market insights
          for (const insight of insights) {
            await storage.createMarketInsight({
              ...insight,
              assetId: createdAsset.id
            });
          }
          
          result.imported++;
          result.assets.push(createdAsset.symbol);
          
        } catch (error) {
          result.errors.push(`Failed to import ${asset.symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      result.success = result.imported > 0;
      console.log(`🎉 Import completed! ${result.imported} assets imported, ${result.errors.length} errors`);
      
      return result;

    } catch (error) {
      console.error('🚨 Import process failed:', error);
      result.errors.push(`Import process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Parse the CSV file and return raw entries
   */
  private async parseCSVFile(): Promise<MarvelDcEntry[]> {
    try {
      const csvContent = fs.readFileSync(this.csvFilePath, 'utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
      
      return records.map((record: any) => ({
        ID: record.ID || '',
        Movie: record.Movie || '',
        Year: record.Year || '',
        Genre: record.Genre || '',
        RunTime: record.RunTime || '',
        Description: record.Description || '',
        IMDB_Score: record.IMDB_Score || '0'
      }));
      
    } catch (error) {
      console.error('🚨 CSV parsing failed:', error);
      throw new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform a single Marvel/DC entry into a complete trading asset
   */
  private async transformToTradingAsset(entry: MarvelDcEntry): Promise<TransformedAsset> {
    // Generate trading symbol
    const symbol = this.generateTradingSymbol(entry.Movie, entry.Year);
    
    // Determine asset type and category
    const { type, category } = this.categorizeAsset(entry);
    
    // Extract publisher from content patterns
    const publisher = this.extractPublisher(entry.Movie, entry.Description);
    
    // Generate enhanced description for trading
    const enhancedDescription = this.enhanceDescription(entry);
    
    // Create comprehensive metadata
    const metadata = this.createAssetMetadata(entry, category, publisher);
    
    // Generate initial pricing based on IMDB score and other factors
    const pricing = this.calculateAssetPricing(entry);
    
    // Create asset
    const asset: InsertAsset = {
      symbol,
      name: entry.Movie,
      type,
      description: enhancedDescription,
      imageUrl: this.generateImageUrl(entry.Movie, publisher),
      metadata
    };

    // Generate vector embedding for asset metadata
    if (vectorEmbeddingService) {
      try {
        const embeddingResult = await vectorEmbeddingService.generateAssetMetadataEmbedding({
          name: asset.name,
          type: asset.type,
          description: asset.description || '',
          publisher,
          yearPublished: this.extractYear(entry.Year) || undefined,
          category,
          tags: this.generateTags(entry)
        });
        
        if (embeddingResult) {
          // Note: metadataEmbedding will be set when creating the asset
          console.log(`🔮 Generated embedding for ${asset.name} (${embeddingResult.dimensions} dimensions)`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to generate embedding for ${asset.name}:`, error);
      }
    }

    // Generate market data for multiple timeframes
    const marketData = this.generateMarketData(pricing);
    
    // Generate market insights
    const insights = this.generateMarketInsights(entry, pricing);

    return { asset, marketData, insights };
  }

  /**
   * Generate a professional trading symbol
   */
  private generateTradingSymbol(movie: string, year: string): string {
    // Clean and format movie name
    let cleanName = movie
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .toUpperCase();
    
    // Handle common patterns
    cleanName = cleanName
      .replace(/^THE_/, '') // Remove "THE" prefix
      .replace(/_THE_/, '_') // Remove "THE" in middle
      .replace(/^A_/, '') // Remove "A" prefix
      .replace(/_AND_/g, '_') // Simplify "AND"
      .replace(/_OF_/g, '_') // Simplify "OF"
      .replace(/_\d+$/, ''); // Remove trailing numbers initially
    
    // Extract year
    const yearMatch = year.match(/(\d{4})/);
    const yearSuffix = yearMatch ? `_${yearMatch[1]}` : '';
    
    // Truncate if too long and add year
    if (cleanName.length > 15) {
      cleanName = cleanName.substring(0, 15);
    }
    
    return `${cleanName}${yearSuffix}`;
  }

  /**
   * Categorize asset type based on content analysis
   */
  private categorizeAsset(entry: MarvelDcEntry): { type: string; category: string } {
    const movie = entry.Movie.toLowerCase();
    const description = entry.Description.toLowerCase();
    const content = `${movie} ${description}`;
    
    // Character-focused content
    if (content.includes('spider-man') || content.includes('iron man') || 
        content.includes('captain america') || content.includes('thor') ||
        content.includes('hulk') || content.includes('batman') ||
        content.includes('superman') || content.includes('wonder woman')) {
      return { type: 'character', category: 'superhero' };
    }
    
    // Franchise/Universe content
    if (content.includes('avengers') || content.includes('guardians') ||
        content.includes('x-men') || content.includes('fantastic four') ||
        content.includes('justice league')) {
      return { type: 'franchise', category: 'team' };
    }
    
    // Media content (movies, shows)
    if (entry.RunTime || content.includes('movie') || content.includes('film') ||
        content.includes('series') || content.includes('tv')) {
      return { type: 'media', category: 'entertainment' };
    }
    
    // Default to comic
    return { type: 'comic', category: 'publication' };
  }

  /**
   * Extract publisher from content patterns
   */
  private extractPublisher(movie: string, description: string): string {
    const content = `${movie} ${description}`.toLowerCase();
    
    // Marvel indicators
    if (content.includes('marvel') || content.includes('mcu') || 
        content.includes('avengers') || content.includes('spider-man') ||
        content.includes('iron man') || content.includes('thor') ||
        content.includes('captain america') || content.includes('hulk') ||
        content.includes('guardians') || content.includes('ant-man') ||
        content.includes('doctor strange') || content.includes('black panther')) {
      return 'Marvel';
    }
    
    // DC indicators
    if (content.includes('dc ') || content.includes('batman') || 
        content.includes('superman') || content.includes('wonder woman') ||
        content.includes('justice league') || content.includes('aquaman') ||
        content.includes('flash') || content.includes('green lantern')) {
      return 'DC';
    }
    
    return 'Independent';
  }

  /**
   * Enhance description for trading context
   */
  private enhanceDescription(entry: MarvelDcEntry): string {
    const baseDescription = entry.Description || entry.Movie;
    const imdbScore = parseFloat(entry.IMDB_Score) || 0;
    const year = this.extractYear(entry.Year);
    const genres = entry.Genre.split(',').map(g => g.trim()).filter(g => g);
    
    // Add trading-relevant context
    let enhanced = baseDescription;
    
    if (year) {
      enhanced += ` Released in ${year}.`;
    }
    
    if (genres.length > 0) {
      enhanced += ` Genres: ${genres.join(', ')}.`;
    }
    
    if (imdbScore > 0) {
      enhanced += ` IMDB Rating: ${imdbScore}/10.`;
      
      if (imdbScore >= 8.0) {
        enhanced += ' Highly acclaimed blockbuster with strong trading potential.';
      } else if (imdbScore >= 7.0) {
        enhanced += ' Well-received content with solid market appeal.';
      } else if (imdbScore >= 6.0) {
        enhanced += ' Moderate performance with niche trading opportunities.';
      } else {
        enhanced += ' Undervalued asset with potential for contrarian plays.';
      }
    }
    
    return enhanced;
  }

  /**
   * Create comprehensive asset metadata
   */
  private createAssetMetadata(entry: MarvelDcEntry, category: string, publisher: string): Record<string, any> {
    return {
      originalId: entry.ID,
      publisher,
      category,
      year: this.extractYear(entry.Year),
      genres: entry.Genre.split(',').map(g => g.trim()).filter(g => g),
      runtime: this.parseRuntime(entry.RunTime),
      imdbScore: parseFloat(entry.IMDB_Score) || 0,
      tradingTier: this.calculateTradingTier(entry),
      riskLevel: this.calculateRiskLevel(entry),
      volatilityFactor: this.calculateVolatility(entry),
      marketSegment: this.determineMarketSegment(entry),
      investmentTheme: this.determineInvestmentTheme(entry),
      tags: this.generateTags(entry)
    };
  }

  /**
   * Calculate asset pricing based on multiple factors
   */
  private calculateAssetPricing(entry: MarvelDcEntry): {
    basePrice: number;
    marketCap: number;
    volatility: number;
    volume: number;
  } {
    const imdbScore = parseFloat(entry.IMDB_Score) || 5.0;
    const year = this.extractYear(entry.Year) || 2000;
    const runtime = this.parseRuntime(entry.RunTime);
    
    // Base price calculation (range: $10 - $500)
    let basePrice = 50; // Default
    
    // IMDB score factor (major influence)
    basePrice *= (imdbScore / 5.0); // Scale from IMDB score
    
    // Recency factor
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    if (age < 5) basePrice *= 1.5; // Recent content premium
    else if (age < 10) basePrice *= 1.2;
    else if (age > 20) basePrice *= 0.8; // Vintage discount
    
    // Content length factor
    if (runtime > 120) basePrice *= 1.1; // Feature film premium
    else if (runtime < 30) basePrice *= 0.8; // Short content discount
    
    // Publisher factor
    const publisher = this.extractPublisher(entry.Movie, entry.Description);
    if (publisher === 'Marvel') basePrice *= 1.3; // Marvel premium
    else if (publisher === 'DC') basePrice *= 1.2; // DC premium
    
    // Franchise factor
    if (this.isMajorFranchise(entry.Movie)) {
      basePrice *= 1.5;
    }
    
    // Ensure reasonable bounds
    basePrice = Math.max(10, Math.min(500, basePrice));
    
    // Market cap (range: $1M - $10B)
    const marketCap = basePrice * Math.pow(10, 6) * (1 + Math.random() * 9);
    
    // Volatility (higher for newer/unproven content)
    const volatility = Math.max(0.1, Math.min(0.8, 
      0.3 + (age > 10 ? -0.1 : 0.1) + (imdbScore < 6 ? 0.2 : -0.1)
    ));
    
    // Volume (based on popularity and recognition)
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    return { basePrice, marketCap, volatility, volume };
  }

  /**
   * Generate realistic market data for multiple timeframes
   */
  private generateMarketData(pricing: { basePrice: number; volatility: number; volume: number }): InsertMarketData[] {
    const timeframes = ['1d', '1h', '15m'];
    const marketData: InsertMarketData[] = [];
    
    for (const timeframe of timeframes) {
      const periodsToGenerate = this.getPeriodsForTimeframe(timeframe);
      
      for (let i = 0; i < periodsToGenerate; i++) {
        const period = this.calculatePeriodStart(timeframe, i);
        const ohlcData = this.generateOHLCData(pricing.basePrice, pricing.volatility, i);
        
        marketData.push({
          assetId: '', // Will be set when creating
          timeframe,
          periodStart: period,
          open: ohlcData.open.toString(),
          high: ohlcData.high.toString(),
          low: ohlcData.low.toString(),
          close: ohlcData.close.toString(),
          volume: Math.floor(pricing.volume * (0.5 + Math.random())),
          change: (ohlcData.close - ohlcData.open).toFixed(2),
          percentChange: (((ohlcData.close - ohlcData.open) / ohlcData.open) * 100).toFixed(2),
          marketCap: (ohlcData.close * 1000000).toString(),
          technicalIndicators: this.generateTechnicalIndicators(ohlcData)
        });
      }
    }
    
    return marketData;
  }

  /**
   * Generate market insights based on asset characteristics
   */
  private generateMarketInsights(entry: MarvelDcEntry, pricing: { basePrice: number }): InsertMarketInsight[] {
    const insights: InsertMarketInsight[] = [];
    const imdbScore = parseFloat(entry.IMDB_Score) || 0;
    const publisher = this.extractPublisher(entry.Movie, entry.Description);
    
    // Performance insight
    const performanceCategory = imdbScore >= 7.5 ? 'bullish' : imdbScore <= 6.0 ? 'bearish' : 'neutral';
    insights.push({
      assetId: '', // Will be set when creating
      title: `${entry.Movie} Market Analysis`,
      content: this.generateInsightContent(entry, pricing, 'performance'),
      sentimentScore: this.calculateSentimentScore(imdbScore).toString(),
      confidence: '0.85',
      tags: ['analysis', 'performance', publisher.toLowerCase()],
      source: 'AI Market Intelligence',
      category: performanceCategory,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    // Franchise insight (if applicable)
    if (this.isMajorFranchise(entry.Movie)) {
      insights.push({
        assetId: '',
        title: `Franchise Investment Opportunity: ${entry.Movie}`,
        content: this.generateInsightContent(entry, pricing, 'franchise'),
        sentimentScore: '0.75',
        confidence: '0.90',
        tags: ['franchise', 'opportunity', publisher.toLowerCase()],
        source: 'Franchise Analysis Engine',
        category: 'bullish',
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
      });
    }
    
    return insights;
  }

  // Helper methods
  private extractYear(yearString: string): number | null {
    const match = yearString.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
  }

  private parseRuntime(runtimeString: string): number {
    const match = runtimeString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private calculateTradingTier(entry: MarvelDcEntry): string {
    const imdbScore = parseFloat(entry.IMDB_Score) || 0;
    const year = this.extractYear(entry.Year) || 2000;
    const currentYear = new Date().getFullYear();
    
    if (imdbScore >= 8.0 || (imdbScore >= 7.5 && currentYear - year < 5)) return 'premium';
    if (imdbScore >= 7.0 || this.isMajorFranchise(entry.Movie)) return 'standard';
    return 'basic';
  }

  private calculateRiskLevel(entry: MarvelDcEntry): string {
    const imdbScore = parseFloat(entry.IMDB_Score) || 0;
    const year = this.extractYear(entry.Year) || 2000;
    const age = new Date().getFullYear() - year;
    
    if (imdbScore >= 7.5 && age < 10) return 'low';
    if (imdbScore >= 6.5 && age < 15) return 'medium';
    return 'high';
  }

  private calculateVolatility(entry: MarvelDcEntry): number {
    const imdbScore = parseFloat(entry.IMDB_Score) || 5;
    const year = this.extractYear(entry.Year) || 2000;
    const age = new Date().getFullYear() - year;
    
    let volatility = 0.3; // Base volatility
    
    if (imdbScore < 6) volatility += 0.2; // Higher volatility for lower rated
    if (age < 3) volatility += 0.1; // New releases more volatile
    if (age > 15) volatility -= 0.1; // Established content less volatile
    
    return Math.max(0.1, Math.min(0.8, volatility));
  }

  private determineMarketSegment(entry: MarvelDcEntry): string {
    if (this.isMajorFranchise(entry.Movie)) return 'blockbuster';
    if (entry.Genre.includes('Action')) return 'action';
    if (entry.Genre.includes('Comedy')) return 'comedy';
    if (entry.Genre.includes('Drama')) return 'drama';
    return 'general';
  }

  private determineInvestmentTheme(entry: MarvelDcEntry): string {
    const content = entry.Movie.toLowerCase();
    if (content.includes('avengers') || content.includes('justice league')) return 'team-franchise';
    if (content.includes('spider-man') || content.includes('batman')) return 'iconic-character';
    if (this.extractYear(entry.Year) && this.extractYear(entry.Year)! > 2020) return 'modern-content';
    return 'classic-content';
  }

  private generateTags(entry: MarvelDcEntry): string[] {
    const tags = [];
    
    tags.push(this.extractPublisher(entry.Movie, entry.Description).toLowerCase());
    
    const genres = entry.Genre.split(',').map(g => g.trim().toLowerCase()).filter(g => g);
    tags.push(...genres);
    
    const year = this.extractYear(entry.Year);
    if (year) {
      if (year >= 2020) tags.push('modern');
      else if (year >= 2010) tags.push('recent');
      else tags.push('classic');
    }
    
    const imdbScore = parseFloat(entry.IMDB_Score) || 0;
    if (imdbScore >= 8) tags.push('highly-rated');
    else if (imdbScore <= 6) tags.push('undervalued');
    
    if (this.isMajorFranchise(entry.Movie)) tags.push('franchise');
    
    return Array.from(new Set(tags)); // Remove duplicates
  }

  private isMajorFranchise(movie: string): boolean {
    const franchises = [
      'avengers', 'spider-man', 'iron man', 'thor', 'captain america',
      'guardians', 'x-men', 'fantastic four', 'batman', 'superman',
      'justice league', 'wonder woman'
    ];
    
    return franchises.some(franchise => movie.toLowerCase().includes(franchise));
  }

  private generateImageUrl(movie: string, publisher: string): string {
    // Generate placeholder image URLs - in production, these would be actual poster images
    const cleanName = movie.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `https://via.placeholder.com/400x600/2563eb/ffffff?text=${encodeURIComponent(movie)}`;
  }

  private calculateSentimentScore(imdbScore: number): number {
    // Convert IMDB score (0-10) to sentiment score (-1 to 1)
    return Math.max(-1, Math.min(1, (imdbScore - 5) / 5));
  }

  private generateInsightContent(entry: MarvelDcEntry, pricing: { basePrice: number }, type: 'performance' | 'franchise'): string {
    const imdbScore = parseFloat(entry.IMDB_Score) || 0;
    const publisher = this.extractPublisher(entry.Movie, entry.Description);
    
    if (type === 'performance') {
      return `${entry.Movie} presents a ${imdbScore >= 7 ? 'strong' : 'moderate'} investment opportunity in the ${publisher} universe. ` +
        `With an IMDB rating of ${imdbScore}/10 and current trading price around $${pricing.basePrice.toFixed(2)}, ` +
        `this asset shows ${imdbScore >= 7.5 ? 'bullish' : imdbScore <= 6 ? 'bearish' : 'neutral'} market sentiment. ` +
        `${entry.Description.substring(0, 100)}...`;
    } else {
      return `As part of the ${publisher} franchise ecosystem, ${entry.Movie} benefits from cross-promotional value and ` +
        `established fan base loyalty. Franchise assets typically outperform individual titles by 15-25% in the comic trading market. ` +
        `Current technical indicators suggest ${pricing.basePrice > 100 ? 'premium' : 'value'} positioning for long-term growth.`;
    }
  }

  private getPeriodsForTimeframe(timeframe: string): number {
    switch (timeframe) {
      case '15m': return 96; // Last 24 hours of 15min data
      case '1h': return 168; // Last week of hourly data
      case '1d': return 365; // Last year of daily data
      default: return 30;
    }
  }

  private calculatePeriodStart(timeframe: string, periodsAgo: number): Date {
    const now = new Date();
    let millisecondsAgo: number;
    
    switch (timeframe) {
      case '15m':
        millisecondsAgo = periodsAgo * 15 * 60 * 1000;
        break;
      case '1h':
        millisecondsAgo = periodsAgo * 60 * 60 * 1000;
        break;
      case '1d':
        millisecondsAgo = periodsAgo * 24 * 60 * 60 * 1000;
        break;
      default:
        millisecondsAgo = periodsAgo * 24 * 60 * 60 * 1000;
    }
    
    return new Date(now.getTime() - millisecondsAgo);
  }

  private generateOHLCData(basePrice: number, volatility: number, periodsAgo: number): {
    open: number;
    high: number;
    low: number;
    close: number;
  } {
    // Generate realistic OHLC data with trend and randomness
    const trendFactor = 1 + (Math.random() - 0.5) * 0.02; // Small overall trend
    const volatilityFactor = volatility * (0.5 + Math.random());
    
    const open = basePrice * trendFactor * (1 + (Math.random() - 0.5) * volatilityFactor);
    const priceRange = open * volatilityFactor;
    
    const high = open + Math.random() * priceRange;
    const low = open - Math.random() * priceRange;
    const close = low + Math.random() * (high - low);
    
    return {
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100
    };
  }

  private generateTechnicalIndicators(ohlc: { open: number; high: number; low: number; close: number }): Record<string, any> {
    const typical = (ohlc.high + ohlc.low + ohlc.close) / 3;
    
    return {
      sma_20: typical * (0.95 + Math.random() * 0.1), // Simple Moving Average approximation
      rsi: Math.floor(Math.random() * 40) + 30, // RSI between 30-70
      macd: Math.random() * 2 - 1, // MACD between -1 and 1
      bollinger_upper: ohlc.close * 1.02,
      bollinger_lower: ohlc.close * 0.98,
      volume_ma: Math.floor(Math.random() * 500000) + 100000
    };
  }
}

export const marvelDcDataImportService = new MarvelDcDataImportService();