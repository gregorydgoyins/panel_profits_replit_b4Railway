import { db } from '../databaseStorage';
import { assets, comicIssues, assetCurrentPrices, marketData } from '@shared/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export interface ComicAssetCard {
  id: string;
  symbol: string;
  name: string;
  coverImageUrl: string | null;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  marketTrend: 'up' | 'down' | 'stable';
  historicalSignificance: string;
  whySpecial: string;
  gradeCondition?: string;
  firstAppearance?: string;
  keyCreators?: string[];
  publisher?: string;
}

export interface ComicPriceHistory {
  assetId: string;
  symbol: string;
  name: string;
  priceHistory: Array<{
    timestamp: Date;
    price: number;
    event?: string;
  }>;
}

export interface ComicHeatMapData {
  publisher: string;
  character?: string;
  era?: string;
  priceChange: number;
  volume: number;
  color: string;
}

export class ComicAssetService {
  
  async getTopComicAssets(limit: number = 20): Promise<ComicAssetCard[]> {
    // Get top traded comic assets with complete data
    const assetData = await db
      .select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        imageUrl: assets.imageUrl,
        type: assets.type,
        description: assets.description,
        metadata: assets.metadata,
        currentPrice: assetCurrentPrices.currentPrice,
        dayChange: assetCurrentPrices.dayChange,
        dayChangePercent: assetCurrentPrices.dayChangePercent,
        volume: assetCurrentPrices.volume,
        marketStatus: assetCurrentPrices.marketStatus,
      })
      .from(assets)
      .leftJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .where(eq(assets.type, 'comic'))
      .orderBy(desc(assetCurrentPrices.volume))
      .limit(limit);

    // Enrich with comic-specific data
    const enrichedAssets: ComicAssetCard[] = await Promise.all(
      assetData.map(async (asset) => {
        // Try to get comic issue details for cover and historical info
        const comicDetails = await db
          .select()
          .from(comicIssues)
          .where(eq(comicIssues.id, asset.id))
          .limit(1);

        const comic = comicDetails[0];
        const metadata = asset.metadata as any || {};

        return {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          coverImageUrl: comic?.coverImageUrl || asset.imageUrl,
          currentPrice: parseFloat(asset.currentPrice || '0'),
          dayChange: parseFloat(asset.dayChange || '0'),
          dayChangePercent: parseFloat(asset.dayChangePercent || '0'),
          volume: asset.volume || 0,
          marketTrend: this.determineMarketTrend(
            parseFloat(asset.dayChangePercent || '0')
          ),
          historicalSignificance: this.extractHistoricalSignificance(metadata, comic),
          whySpecial: this.extractWhySpecial(metadata, comic),
          gradeCondition: comic?.gradeCondition || undefined,
          firstAppearance: metadata.firstAppearance,
          keyCreators: this.extractCreators(comic),
          publisher: metadata.publisher || comic?.imprint
        };
      })
    );

    return enrichedAssets;
  }

  async getComicPriceHistory(assetId: string, days: number = 30): Promise<ComicPriceHistory | null> {
    const asset = await db
      .select()
      .from(assets)
      .where(eq(assets.id, assetId))
      .limit(1);

    if (!asset.length) return null;

    // Get historical price data from market_data table
    const historicalData = await db
      .select({
        periodStart: marketData.periodStart,
        close: marketData.close,
      })
      .from(marketData)
      .where(
        and(
          eq(marketData.assetId, assetId),
          eq(marketData.timeframe, '1d')
        )
      )
      .orderBy(desc(marketData.periodStart))
      .limit(days);

    return {
      assetId: asset[0].id,
      symbol: asset[0].symbol,
      name: asset[0].name,
      priceHistory: historicalData.map(d => ({
        timestamp: d.periodStart,
        price: parseFloat(d.close),
        // Could add event annotations here based on metadata
      }))
    };
  }

  async getComicHeatMap(): Promise<ComicHeatMapData[]> {
    // Aggregate price changes by publisher and character
    const heatMapData = await db
      .select({
        symbol: assets.symbol,
        name: assets.name,
        metadata: assets.metadata,
        dayChangePercent: assetCurrentPrices.dayChangePercent,
        volume: assetCurrentPrices.volume,
      })
      .from(assets)
      .leftJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId))
      .where(eq(assets.type, 'character'))
      .orderBy(desc(assetCurrentPrices.volume));

    return heatMapData.map(item => {
      const metadata = item.metadata as any || {};
      const priceChange = parseFloat(item.dayChangePercent || '0');
      
      return {
        publisher: metadata.publisher || 'Unknown',
        character: item.name,
        era: metadata.era || metadata.decade,
        priceChange,
        volume: item.volume || 0,
        color: this.getHeatMapColor(priceChange)
      };
    });
  }

  private determineMarketTrend(changePercent: number): 'up' | 'down' | 'stable' {
    if (changePercent > 1) return 'up';
    if (changePercent < -1) return 'down';
    return 'stable';
  }

  private extractHistoricalSignificance(metadata: any, comic: any): string {
    if (!metadata && !comic) return 'A collectible comic book asset';
    
    const parts: string[] = [];
    
    if (metadata.firstAppearance) {
      parts.push(`First appearance of ${metadata.firstAppearance}`);
    }
    
    if (metadata.historicalEvent) {
      parts.push(metadata.historicalEvent);
    }
    
    if (comic?.issueDescription) {
      parts.push(comic.issueDescription);
    }
    
    return parts.join('. ') || 'A valuable comic book asset';
  }

  private extractWhySpecial(metadata: any, comic: any): string {
    const reasons: string[] = [];
    
    if (metadata.keyIssue) {
      reasons.push('Key Issue');
    }
    
    if (metadata.movieTieIn) {
      reasons.push(`Movie: ${metadata.movieTieIn}`);
    }
    
    if (comic?.coverArtist && comic.coverArtist !== 'Unknown') {
      reasons.push(`Cover by ${comic.coverArtist}`);
    }
    
    if (metadata.variant) {
      reasons.push('Rare Variant');
    }
    
    if (metadata.limitedPrint) {
      reasons.push('Limited Print Run');
    }
    
    return reasons.join(' • ') || 'Collectible comic asset';
  }

  private extractCreators(comic: any): string[] {
    if (!comic) return [];
    
    const creators: string[] = [];
    if (comic.writer && comic.writer !== 'Unknown') creators.push(comic.writer);
    if (comic.penciler && comic.penciler !== 'Unknown') creators.push(comic.penciler);
    if (comic.coverArtist && comic.coverArtist !== 'Unknown') creators.push(comic.coverArtist);
    
    return Array.from(new Set(creators)); // Remove duplicates
  }

  private getHeatMapColor(changePercent: number): string {
    if (changePercent > 5) return '#22c55e'; // Strong green
    if (changePercent > 2) return '#86efac'; // Light green
    if (changePercent > 0) return '#dcfce7'; // Very light green
    if (changePercent === 0) return '#9ca3af'; // Gray
    if (changePercent > -2) return '#fecaca'; // Light red
    if (changePercent > -5) return '#f87171'; // Medium red
    return '#ef4444'; // Strong red
  }
}

export const comicAssetService = new ComicAssetService();
