// Frontend service for interacting with comic data APIs

export interface TradingAsset {
  symbol: string;
  name: string;
  category: 'character' | 'creator' | 'publisher' | 'location' | 'gadget';
  description: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  significance: number;
  image: string | null;
  metadata: {
    marvelId?: number;
    modified?: string;
    comicsAppeared?: number;
    seriesAppeared?: number;
    powerStats?: {
      intelligence: string;
      strength: string;
      speed: string;
      durability: string;
      power: string;
      combat: string;
    } | null;
    publisher?: string;
    firstAppearance?: string;
    alignment?: string;
    type?: string;
  };
}

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
  };
}

export interface SuperHero {
  response: string;
  id: string;
  name: string;
  powerstats: {
    intelligence: string;
    strength: string;
    speed: string;
    durability: string;
    power: string;
    combat: string;
  };
  biography: {
    'full-name': string;
    'alter-egos': string;
    aliases: string[];
    'place-of-birth': string;
    'first-appearance': string;
    publisher: string;
    alignment: string;
  };
  appearance: {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
    'eye-color': string;
    'hair-color': string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    'group-affiliation': string;
    relatives: string;
  };
  image: {
    url: string;
  };
}

class ComicApiService {
  private baseUrl = '/api/comic-data';

  async getTradingAssets(): Promise<{ success: boolean; data: TradingAsset[]; count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/trading-assets`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trading assets');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching trading assets:', error);
      throw error;
    }
  }

  async getMarvelCharacters(limit = 20, offset = 0): Promise<{ success: boolean; data: MarvelCharacter[]; count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/marvel/characters?limit=${limit}&offset=${offset}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch Marvel characters');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching Marvel characters:', error);
      throw error;
    }
  }

  async getMarvelComics(limit = 20, offset = 0): Promise<{ success: boolean; data: any[]; count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/marvel/comics?limit=${limit}&offset=${offset}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch Marvel comics');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching Marvel comics:', error);
      throw error;
    }
  }

  async searchSuperHero(characterName: string): Promise<{ success: boolean; data: SuperHero }> {
    try {
      const response = await fetch(`${this.baseUrl}/superhero/search/${encodeURIComponent(characterName)}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to search superhero');
      }
      
      return result;
    } catch (error) {
      console.error('Error searching superhero:', error);
      throw error;
    }
  }

  async getComicVineVolumes(limit = 20, offset = 0): Promise<{ success: boolean; data: any[]; count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/comicvine/volumes?limit=${limit}&offset=${offset}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch Comic Vine volumes');
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching Comic Vine volumes:', error);
      throw error;
    }
  }

  async searchComicVineCharacter(characterName: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/comicvine/search/${encodeURIComponent(characterName)}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to search Comic Vine character');
      }
      
      return result;
    } catch (error) {
      console.error('Error searching Comic Vine character:', error);
      throw error;
    }
  }

  // Transform trading asset for showcase components
  transformForShowcase(asset: TradingAsset) {
    return {
      symbol: asset.symbol,
      name: asset.name,
      price: asset.price,
      change: asset.change,
      changePercent: asset.changePercent,
      volume: asset.volume,
      marketCap: asset.marketCap,
      significance: asset.significance,
      image: asset.image || undefined,
      category: asset.category,
      rating: this.calculateRating(asset),
      metadata: asset.metadata
    };
  }

  private calculateRating(asset: TradingAsset): string {
    const score = asset.significance;
    if (score >= 90) return 'Strong Buy';
    if (score >= 75) return 'Buy';
    if (score >= 50) return 'Hold';
    if (score >= 25) return 'Sell';
    return 'Strong Sell';
  }

  // Generate mock market sentiment based on real data
  generateMarketSentiment(assets: TradingAsset[]) {
    if (assets.length === 0) {
      return {
        overall: 0,
        confidence: 0.5,
        categories: {
          news: 0,
          social: 0,
          technical: 0,
          volume: 0
        },
        sources: {
          ai: 0.5,
          human: 0.5,
          algorithmic: 0.5
        }
      };
    }

    const avgChange = assets.reduce((sum, asset) => sum + asset.changePercent, 0) / assets.length;
    const avgSignificance = assets.reduce((sum, asset) => sum + asset.significance, 0) / assets.length;
    
    // Normalize sentiment based on price changes and significance
    const overall = Math.max(-1, Math.min(1, avgChange / 10));
    const confidence = Math.max(0, Math.min(1, avgSignificance / 100));
    
    return {
      overall,
      confidence,
      categories: {
        news: overall * 0.9 + (Math.random() - 0.5) * 0.2,
        social: overall * 0.8 + (Math.random() - 0.5) * 0.3,
        technical: overall * 1.1 + (Math.random() - 0.5) * 0.2,
        volume: overall * 0.7 + (Math.random() - 0.5) * 0.4
      },
      sources: {
        ai: confidence * 0.9,
        human: confidence * 0.7,
        algorithmic: confidence * 0.8
      }
    };
  }

  // Generate portfolio data from trading assets
  generatePortfolioData(assets: TradingAsset[]) {
    if (assets.length === 0) return [];

    // Take first 6 assets for portfolio
    const portfolioAssets = assets.slice(0, 6);
    let totalValue = 0;
    
    const portfolio = portfolioAssets.map((asset, index) => {
      const allocation = 30 - (index * 4); // Decreasing allocation
      const value = asset.price * (allocation * 100); // Mock position size
      totalValue += value;
      
      return {
        symbol: asset.symbol,
        name: asset.name,
        allocation,
        value,
        change: asset.change,
        changePercent: asset.changePercent,
        category: asset.category,
        coordinates: {
          lat: 40.7128 + (Math.random() - 0.5) * 20, // Random coordinates around NYC
          lng: -74.0060 + (Math.random() - 0.5) * 40
        }
      };
    });

    // Normalize allocations to 100%
    portfolio.forEach(item => {
      item.allocation = (item.value / totalValue) * 100;
    });

    return portfolio;
  }

  // Generate market dashboard data
  generateMarketDashboard(assets: TradingAsset[]) {
    if (assets.length === 0) {
      return {
        index: 10000,
        change: 0,
        volume: 1000000,
        volatility: 0.1,
        marketCap: 1000000000,
        activeAssets: 0,
        topGainers: [],
        topLosers: [],
        sectorPerformance: [],
        sentimentData: {
          overall: 0,
          confidence: 0.5,
          trend: 'neutral' as const
        }
      };
    }

    const totalMarketCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0);
    const avgChange = assets.reduce((sum, asset) => sum + asset.changePercent, 0) / assets.length;
    const totalVolume = assets.reduce((sum, asset) => sum + asset.volume, 0);
    
    const sortedGainers = [...assets]
      .filter(asset => asset.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
      
    const sortedLosers = [...assets]
      .filter(asset => asset.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);

    // Group by category for sector performance
    const sectorStats = assets.reduce((acc, asset) => {
      const sector = asset.category.charAt(0).toUpperCase() + asset.category.slice(1) + 's';
      if (!acc[sector]) {
        acc[sector] = { count: 0, totalChange: 0, totalCap: 0 };
      }
      acc[sector].count++;
      acc[sector].totalChange += asset.changePercent;
      acc[sector].totalCap += asset.marketCap;
      return acc;
    }, {} as Record<string, { count: number; totalChange: number; totalCap: number }>);

    const sectorPerformance = Object.entries(sectorStats).map(([sector, stats]) => ({
      sector,
      performance: stats.totalChange / stats.count,
      allocation: (stats.totalCap / totalMarketCap) * 100
    }));

    return {
      index: Math.floor(totalMarketCap / 1000000), // Market index based on total cap
      change: avgChange,
      volume: totalVolume,
      volatility: Math.abs(avgChange) / 100,
      marketCap: totalMarketCap,
      activeAssets: assets.length,
      topGainers: sortedGainers.map(asset => ({ symbol: asset.symbol, change: asset.changePercent })),
      topLosers: sortedLosers.map(asset => ({ symbol: asset.symbol, change: asset.changePercent })),
      sectorPerformance,
      sentimentData: {
        overall: Math.max(-1, Math.min(1, avgChange / 10)),
        confidence: 0.85,
        trend: avgChange > 1 ? 'bullish' as const : avgChange < -1 ? 'bearish' as const : 'neutral' as const
      }
    };
  }
}

export const comicApiService = new ComicApiService();