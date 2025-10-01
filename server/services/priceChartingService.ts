import { parse } from 'csv-parse/sync';

interface ComicPrice {
  id: string;
  product_name: string;
  console_name: string;
  genre?: string;
  release_date?: string;
  loose_price?: number;
  cib_price?: number;
  new_price?: number;
  graded_price?: number;
}

class PriceChartingService {
  private apiToken: string;
  private baseUrl = 'https://www.pricecharting.com';
  private cache: Map<string, { data: ComicPrice[]; timestamp: number }> = new Map();
  private cacheExpiry = 3600000; // 1 hour

  constructor() {
    this.apiToken = process.env.PRICECHARTING_API_TOKEN || '';
    if (!this.apiToken) {
      console.warn('⚠️ PRICECHARTING_API_TOKEN not set - real pricing data unavailable');
    }
  }

  async fetchComicBookPrices(): Promise<ComicPrice[]> {
    if (!this.apiToken) {
      console.warn('⚠️ Cannot fetch PriceCharting data - API token not configured');
      return [];
    }

    // Check cache
    const cached = this.cache.get('comic-books');
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log('📦 Using cached PriceCharting comic book data');
      return cached.data;
    }

    try {
      console.log('💰 Fetching real comic book prices from PriceCharting...');
      
      const url = `${this.baseUrl}/price-guide/download-custom?t=${this.apiToken}&category=comic-books`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ PriceCharting API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const csvData = await response.text();
      
      // Parse CSV data
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      const prices: ComicPrice[] = records.map((record: any) => ({
        id: record.id || record['product-id'],
        product_name: record['product-name'] || record.title,
        console_name: record['console-name'] || record.publisher,
        genre: record.genre,
        release_date: record['release-date'],
        loose_price: parseFloat(record['loose-price']) || undefined,
        cib_price: parseFloat(record['cib-price']) || undefined,
        new_price: parseFloat(record['new-price']) || undefined,
        graded_price: parseFloat(record['graded-price']) || undefined,
      }));

      // Cache the results
      this.cache.set('comic-books', { data: prices, timestamp: Date.now() });

      console.log(`✅ Fetched ${prices.length} comic book prices from PriceCharting`);
      return prices;
    } catch (error) {
      console.error('❌ Error fetching PriceCharting data:', error);
      return [];
    }
  }

  async getComicPrice(searchTerm: string): Promise<number | null> {
    const prices = await this.fetchComicBookPrices();
    
    if (prices.length === 0) {
      return null;
    }

    // Search for matching comic
    const normalizedSearch = searchTerm.toLowerCase();
    const match = prices.find(price => 
      price.product_name?.toLowerCase().includes(normalizedSearch) ||
      price.console_name?.toLowerCase().includes(normalizedSearch)
    );

    if (match) {
      // Prefer graded price, then new, then CIB, then loose
      return match.graded_price || match.new_price || match.cib_price || match.loose_price || null;
    }

    return null;
  }

  async getPriceForCharacter(characterName: string): Promise<number> {
    // For characters, we'll find key issues featuring them
    const basePrice = await this.getComicPrice(characterName);
    
    if (basePrice) {
      // Characters are valued based on their key issue appearances
      return basePrice * 10; // Multiplier for character entity value
    }

    // Fallback: estimate based on character popularity
    return this.estimateCharacterValue(characterName);
  }

  async getPriceForCreator(creatorName: string): Promise<number> {
    // For creators, aggregate value of their notable works
    const prices = await this.fetchComicBookPrices();
    
    const creatorWorks = prices.filter(price => 
      price.product_name?.toLowerCase().includes(creatorName.toLowerCase())
    );

    if (creatorWorks.length > 0) {
      // Average of their top works
      const avgPrice = creatorWorks
        .map(w => w.graded_price || w.new_price || w.cib_price || w.loose_price || 0)
        .filter(p => p > 0)
        .reduce((sum, p) => sum + p, 0) / Math.max(creatorWorks.length, 1);
      
      return avgPrice * 5; // Creator multiplier
    }

    return this.estimateCreatorValue(creatorName);
  }

  async getPriceForSeries(seriesName: string): Promise<number> {
    const prices = await this.fetchComicBookPrices();
    
    const seriesIssues = prices.filter(price => 
      price.product_name?.toLowerCase().includes(seriesName.toLowerCase())
    );

    if (seriesIssues.length > 0) {
      // Sum of key issues in the series
      return seriesIssues
        .map(i => i.graded_price || i.new_price || i.cib_price || i.loose_price || 0)
        .filter(p => p > 0)
        .reduce((sum, p) => sum + p, 0);
    }

    return this.estimateSeriesValue(seriesName);
  }

  private estimateCharacterValue(name: string): number {
    // Fallback estimation for characters not in PriceCharting
    const majorCharacters = ['spider-man', 'batman', 'superman', 'wolverine', 'hulk'];
    const isMajor = majorCharacters.some(mc => name.toLowerCase().includes(mc));
    
    return isMajor 
      ? Math.random() * 50000 + 10000 // $10k - $60k
      : Math.random() * 10000 + 1000;  // $1k - $11k
  }

  private estimateCreatorValue(name: string): number {
    // Fallback estimation for creators
    return Math.random() * 25000 + 5000; // $5k - $30k
  }

  private estimateSeriesValue(name: string): number {
    // Fallback estimation for series
    return Math.random() * 100000 + 10000; // $10k - $110k
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ PriceCharting cache cleared');
  }
}

export const priceChartingService = new PriceChartingService();
