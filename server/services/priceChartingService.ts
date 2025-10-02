interface ComicPrice {
  id: string;
  'product-name': string;
  'console-name': string;
  'publisher-name'?: string;
  'series-name'?: string;
  genre?: string;
  'release-date'?: string;
  'sales-volume'?: string;
  'loose-price'?: number;
  'cib-price'?: number;
  'new-price'?: number;
  'graded-price'?: number;
  'manual-only-price'?: number;
  'box-only-price'?: number;
  'bgs-10-price'?: number;
  'condition-17-price'?: number;
  'condition-18-price'?: number;
}

interface ProductsResponse {
  status: string;
  products?: ComicPrice[];
}

interface CGCGradePrice {
  grade: string;
  price: number | null;
  available: boolean;
}

interface ComicPricesByGrade {
  productId: string;
  productName: string;
  seriesName?: string;
  publisherName?: string;
  grades: CGCGradePrice[];
  bestGrade?: string;
  highestPrice?: number;
  releaseDate?: string;
}

interface HistoricalPricePoint {
  date: string;
  price: number;
}

interface HistoricalPriceData {
  productId: string;
  productName: string;
  timeframe: '30d' | '90d' | '1y';
  prices: HistoricalPricePoint[];
  startPrice: number;
  endPrice: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
}

class PriceChartingService {
  private apiToken: string;
  private baseUrl = 'https://www.pricecharting.com/api';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 3600000; // 1 hour

  constructor() {
    this.apiToken = process.env.PRICECHARTING_API_TOKEN || '';
    if (!this.apiToken) {
      console.warn('⚠️ PRICECHARTING_API_TOKEN not set - real pricing data unavailable');
    }
  }

  async searchComics(query: string): Promise<ComicPrice[]> {
    if (!this.apiToken) {
      console.warn('⚠️ Cannot search PriceCharting - API token not configured');
      return [];
    }

    const cacheKey = `search:${query}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached PriceCharting search for: ${query}`);
      return cached.data;
    }

    try {
      console.log(`💰 Searching PriceCharting for comics: ${query}`);
      
      // Search for comic books specifically by including series name
      const url = `${this.baseUrl}/products?t=${this.apiToken}&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ PriceCharting API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: ProductsResponse = await response.json();
      
      if (data.status !== 'success' || !data.products) {
        console.error('❌ PriceCharting search failed:', data);
        return [];
      }

      // Filter results to ONLY include comic books
      // Comics have console-name starting with "Comic Books" + series name
      // Video games have console-name like "Xbox 360", "Playstation 3", etc.
      const comicProducts = data.products.filter(p => 
        p['console-name']?.startsWith('Comic Books') ||
        p['genre'] === 'Comic Book'
      );

      this.cache.set(cacheKey, { data: comicProducts, timestamp: Date.now() });

      console.log(`✅ Found ${comicProducts.length} comic books for: ${query}`);
      if (comicProducts.length > 0) {
        console.log(`   Top result: ${comicProducts[0]['product-name']} | Publisher: ${comicProducts[0]['publisher-name']} | Series: ${comicProducts[0]['series-name']}`);
      }
      return comicProducts;
    } catch (error) {
      console.error('❌ Error searching PriceCharting:', error);
      return [];
    }
  }

  async getProduct(productId: string): Promise<ComicPrice | null> {
    if (!this.apiToken) {
      return null;
    }

    const cacheKey = `product:${productId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/product?t=${this.apiToken}&id=${productId}`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (data.status !== 'success') {
        return null;
      }

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data as ComicPrice;
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      return null;
    }
  }

  extractSeriesName(consoleName: string): string {
    // For comics, console-name is "Comic Books {SeriesName}"
    if (consoleName.startsWith('Comic Books ')) {
      return consoleName.replace('Comic Books ', '');
    }
    return consoleName;
  }

  getBestPrice(product: ComicPrice): number {
    // For comics, prefer graded prices, then ungraded
    const prices = [
      product['bgs-10-price'],      // CGC 10.0
      product['manual-only-price'],  // CGC 9.8
      product['box-only-price'],     // CGC 9.2
      product['graded-price'],       // CGC 8.0-8.5
      product['new-price'],          // CGC 6.0-6.5
      product['cib-price'],          // CGC 4.0-4.5
      product['loose-price']         // Ungraded
    ].filter(p => p && p > 0);

    if (prices.length === 0) {
      return 0;
    }

    // Return highest grade price available
    return prices[0] ? prices[0] / 100 : 0; // Convert from pennies to dollars
  }

  async getPriceForCharacter(characterName: string): Promise<number> {
    // Search for key issues featuring the character
    const results = await this.searchComics(characterName);
    
    if (results.length === 0) {
      return this.estimateCharacterValue(characterName);
    }

    // Get top 3 most valuable appearances
    const topIssues = results
      .map(r => this.getBestPrice(r))
      .sort((a, b) => b - a)
      .slice(0, 3);

    if (topIssues.length === 0) {
      return this.estimateCharacterValue(characterName);
    }

    // Character value = average of top 3 key issues
    const avgValue = topIssues.reduce((sum, price) => sum + price, 0) / topIssues.length;
    return Math.round(avgValue);
  }

  async getPriceForSeries(seriesName: string): Promise<number> {
    const results = await this.searchComics(seriesName);
    
    if (results.length === 0) {
      return this.estimateSeriesValue(seriesName);
    }

    // Series value = sum of top 10 issues
    const prices = results
      .map(r => this.getBestPrice(r))
      .sort((a, b) => b - a)
      .slice(0, 10);

    if (prices.length === 0) {
      return this.estimateSeriesValue(seriesName);
    }

    return Math.round(prices.reduce((sum, p) => sum + p, 0));
  }

  async getPriceForCreator(creatorName: string): Promise<number> {
    // Search for works by this creator
    const results = await this.searchComics(creatorName);
    
    if (results.length === 0) {
      return this.estimateCreatorValue(creatorName);
    }

    // Creator value = average of their top 5 works
    const topWorks = results
      .map(r => this.getBestPrice(r))
      .sort((a, b) => b - a)
      .slice(0, 5);

    if (topWorks.length === 0) {
      return this.estimateCreatorValue(creatorName);
    }

    const avgValue = topWorks.reduce((sum, price) => sum + price, 0) / topWorks.length;
    return Math.round(avgValue * 3); // Creator multiplier
  }

  private estimateCharacterValue(name: string): number {
    const majorCharacters = ['spider-man', 'batman', 'superman', 'wolverine', 'hulk', 'iron man'];
    const isMajor = majorCharacters.some(mc => name.toLowerCase().includes(mc));
    
    return isMajor 
      ? Math.random() * 50000 + 10000 
      : Math.random() * 10000 + 1000;
  }

  private estimateCreatorValue(name: string): number {
    return Math.random() * 25000 + 5000;
  }

  private estimateSeriesValue(name: string): number {
    return Math.random() * 100000 + 10000;
  }

  async getComicPricesByGrade(comicName: string): Promise<ComicPricesByGrade | null> {
    const cacheKey = `grades:${comicName}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached CGC grades for: ${comicName}`);
      return cached.data;
    }

    const results = await this.searchComics(comicName);
    
    if (results.length === 0) {
      console.warn(`⚠️ No results found for: ${comicName}`);
      return null;
    }

    const topResult = results[0];
    
    const gradeMapping: Array<{ grade: string; field: keyof ComicPrice }> = [
      { grade: 'Ungraded', field: 'loose-price' },
      { grade: 'CGC 4.0', field: 'condition-17-price' },
      { grade: 'CGC 4.5', field: 'condition-17-price' },
      { grade: 'CGC 6.0', field: 'condition-18-price' },
      { grade: 'CGC 6.5', field: 'condition-18-price' },
      { grade: 'CGC 8.0', field: 'graded-price' },
      { grade: 'CGC 8.5', field: 'graded-price' },
      { grade: 'CGC 9.2', field: 'box-only-price' },
      { grade: 'CGC 9.8', field: 'manual-only-price' },
      { grade: 'CGC 10.0', field: 'bgs-10-price' }
    ];

    const grades: CGCGradePrice[] = gradeMapping.map(({ grade, field }) => {
      const priceInCents = topResult[field];
      const priceValue = typeof priceInCents === 'number' ? priceInCents : 
                         typeof priceInCents === 'string' ? parseFloat(priceInCents) : 0;
      const price = priceValue > 0 ? priceValue / 100 : null;
      
      return {
        grade,
        price,
        available: price !== null
      };
    });

    const availableGrades = grades.filter(g => g.available);
    const bestGrade = availableGrades.length > 0 
      ? availableGrades[availableGrades.length - 1].grade 
      : undefined;
    const highestPrice = availableGrades.length > 0
      ? Math.max(...availableGrades.map(g => g.price!))
      : undefined;

    const result: ComicPricesByGrade = {
      productId: topResult.id,
      productName: topResult['product-name'],
      seriesName: topResult['series-name'],
      publisherName: topResult['publisher-name'],
      grades,
      bestGrade,
      highestPrice,
      releaseDate: topResult['release-date']
    };

    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    console.log(`✅ Retrieved CGC grades for: ${comicName}`);
    console.log(`   Best grade: ${bestGrade} | Highest price: $${highestPrice?.toFixed(2) || 'N/A'}`);
    
    return result;
  }

  async getHistoricalPrices(productId: string, timeframe: '30d' | '90d' | '1y'): Promise<HistoricalPriceData | null> {
    if (!this.apiToken) {
      console.warn('⚠️ Cannot fetch historical prices - API token not configured');
      return null;
    }

    const cacheKey = `history:${productId}:${timeframe}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached historical prices for product ${productId} (${timeframe})`);
      return cached.data;
    }

    try {
      console.log(`📊 Fetching ${timeframe} historical prices for product: ${productId}`);
      
      const url = `${this.baseUrl}/price-history?t=${this.apiToken}&id=${productId}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ PriceCharting API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      
      if (data.status !== 'success') {
        console.error('❌ Historical price fetch failed:', data);
        return null;
      }

      const product = await this.getProduct(productId);
      if (!product) {
        console.error('❌ Could not fetch product details');
        return null;
      }

      const now = new Date();
      const daysMap = { '30d': 30, '90d': 90, '1y': 365 };
      const daysBack = daysMap[timeframe];
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

      const priceHistory = data['price-history'] || [];
      const filteredPrices: HistoricalPricePoint[] = priceHistory
        .filter((point: any) => {
          const pointDate = new Date(point.date);
          return pointDate >= startDate && pointDate <= now;
        })
        .map((point: any) => ({
          date: point.date,
          price: point.price / 100
        }));

      if (filteredPrices.length === 0) {
        console.warn(`⚠️ No historical data available for ${timeframe}`);
        const currentPrice = this.getBestPrice(product);
        filteredPrices.push({
          date: now.toISOString().split('T')[0],
          price: currentPrice
        });
      }

      const prices = filteredPrices.map(p => p.price);
      const startPrice = prices[0];
      const endPrice = prices[prices.length - 1];
      const percentChange = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
      const highPrice = Math.max(...prices);
      const lowPrice = Math.min(...prices);

      const result: HistoricalPriceData = {
        productId,
        productName: product['product-name'],
        timeframe,
        prices: filteredPrices,
        startPrice,
        endPrice,
        percentChange,
        highPrice,
        lowPrice
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

      console.log(`✅ Retrieved ${filteredPrices.length} price points for ${timeframe}`);
      console.log(`   Change: ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}% | High: $${highPrice.toFixed(2)} | Low: $${lowPrice.toFixed(2)}`);

      return result;
    } catch (error) {
      console.error('❌ Error fetching historical prices:', error);
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ PriceCharting cache cleared');
  }
}

export const priceChartingService = new PriceChartingService();

export type { 
  ComicPrice, 
  CGCGradePrice, 
  ComicPricesByGrade, 
  HistoricalPricePoint, 
  HistoricalPriceData 
};
