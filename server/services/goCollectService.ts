interface CensusGradeData {
  grade: string;
  count: number;
  lastSalePrice?: number;
  lastSaleDate?: string;
}

interface ComicCensusData {
  comicId: string;
  comicName: string;
  seriesName?: string;
  issueNumber?: string;
  totalCopies: number;
  universalCopies: number; // Blue label, no signatures/restoration
  gradeDistribution: CensusGradeData[];
  highestGrade?: string;
  lowestGrade?: string;
  lastUpdated: string;
}

interface GoCollectSearchResult {
  id: string;
  name: string;
  series: string;
  issueNumber?: string;
  publisher?: string;
}

class GoCollectService {
  private apiKey: string;
  private baseUrl = 'https://api.gocollect.com/api';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 7200000; // 2 hours for census data

  constructor() {
    this.apiKey = process.env.GOCOLLECT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ GOCOLLECT_API_KEY not set - census data unavailable');
    }
  }

  /**
   * Search for a comic to get its GoCollect ID
   */
  async searchComic(query: string): Promise<GoCollectSearchResult[]> {
    if (!this.apiKey) {
      console.warn('⚠️ Cannot search GoCollect - API key not configured');
      return [];
    }

    const cacheKey = `search:${query}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached GoCollect search for: ${query}`);
      return cached.data;
    }

    try {
      console.log(`🔍 Searching GoCollect for: ${query}`);
      
      const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ GoCollect API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const results: GoCollectSearchResult[] = data.results || [];

      this.cache.set(cacheKey, { data: results, timestamp: Date.now() });

      console.log(`✅ Found ${results.length} results on GoCollect for: ${query}`);
      return results;
    } catch (error) {
      console.error('❌ Error searching GoCollect:', error);
      return [];
    }
  }

  /**
   * Get census data including grade distribution for a comic
   */
  async getCensusData(comicId: string): Promise<ComicCensusData | null> {
    if (!this.apiKey) {
      console.warn('⚠️ Cannot fetch census - API key not configured');
      return null;
    }

    const cacheKey = `census:${comicId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached census data for comic: ${comicId}`);
      return cached.data;
    }

    try {
      console.log(`📊 Fetching census data for comic ID: ${comicId}`);
      
      const url = `${this.baseUrl}/census/${comicId}?key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ GoCollect API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();

      // Parse the grade distribution
      const gradeDistribution: CensusGradeData[] = [];
      const gradeMap = data.census || {};

      // Standard CGC grades we care about
      const standardGrades = ['10.0', '9.9', '9.8', '9.6', '9.4', '9.2', '9.0', '8.5', '8.0', '7.5', '7.0', '6.5', '6.0', '5.5', '5.0', '4.5', '4.0', '3.5', '3.0', '2.5', '2.0', '1.5', '1.0'];

      for (const grade of standardGrades) {
        const gradeData = gradeMap[grade];
        if (gradeData && gradeData.count > 0) {
          gradeDistribution.push({
            grade: `CGC ${grade}`,
            count: gradeData.count,
            lastSalePrice: gradeData.lastSale?.price,
            lastSaleDate: gradeData.lastSale?.date
          });
        }
      }

      // Add ungraded if available
      if (gradeMap.ungraded?.count > 0) {
        gradeDistribution.push({
          grade: 'Ungraded',
          count: gradeMap.ungraded.count,
          lastSalePrice: gradeMap.ungraded.lastSale?.price,
          lastSaleDate: gradeMap.ungraded.lastSale?.date
        });
      }

      const totalCopies = data.totalGraded || 0;
      const universalCopies = data.universalCopies || totalCopies; // Universal = Blue label

      const censusData: ComicCensusData = {
        comicId,
        comicName: data.name || '',
        seriesName: data.series || '',
        issueNumber: data.issueNumber || '',
        totalCopies,
        universalCopies,
        gradeDistribution,
        highestGrade: gradeDistribution[0]?.grade,
        lowestGrade: gradeDistribution[gradeDistribution.length - 1]?.grade,
        lastUpdated: new Date().toISOString()
      };

      this.cache.set(cacheKey, { data: censusData, timestamp: Date.now() });

      console.log(`✅ Retrieved census data for: ${data.name}`);
      console.log(`   Total copies: ${totalCopies} | Universal: ${universalCopies}`);
      console.log(`   Grade range: ${censusData.highestGrade} - ${censusData.lowestGrade}`);

      return censusData;
    } catch (error) {
      console.error('❌ Error fetching census data:', error);
      return null;
    }
  }

  /**
   * Get census data by searching for a comic name
   */
  async getCensusDataByName(comicName: string): Promise<ComicCensusData | null> {
    const searchResults = await this.searchComic(comicName);
    
    if (searchResults.length === 0) {
      console.warn(`⚠️ No GoCollect results found for: ${comicName}`);
      return null;
    }

    // Use the first (most relevant) result
    const topResult = searchResults[0];
    return await this.getCensusData(topResult.id);
  }

  /**
   * Get estimated census distribution when API data is unavailable
   * Based on industry standard distributions for different eras
   */
  estimateCensusDistribution(era: 'golden' | 'silver' | 'bronze' | 'modern', totalCopies: number): CensusGradeData[] {
    // Distribution percentages by grade for different eras
    const distributions = {
      golden: { // Pre-1956
        '10.0': 0.0001, '9.8': 0.001, '9.6': 0.002, '9.2': 0.005,
        '8.0': 0.01, '6.0': 0.05, '4.0': 0.15, 'lower': 0.779
      },
      silver: { // 1956-1970
        '10.0': 0.0005, '9.8': 0.005, '9.6': 0.01, '9.2': 0.02,
        '8.0': 0.05, '6.0': 0.1, '4.0': 0.20, 'lower': 0.6145
      },
      bronze: { // 1970-1985
        '10.0': 0.001, '9.8': 0.01, '9.6': 0.03, '9.2': 0.06,
        '8.0': 0.1, '6.0': 0.15, '4.0': 0.20, 'lower': 0.448
      },
      modern: { // 1985+
        '10.0': 0.005, '9.8': 0.05, '9.6': 0.08, '9.2': 0.12,
        '8.0': 0.15, '6.0': 0.18, '4.0': 0.15, 'lower': 0.265
      }
    };

    const dist = distributions[era];
    const gradeDistribution: CensusGradeData[] = [
      { grade: 'CGC 10.0', count: Math.floor(totalCopies * dist['10.0']) },
      { grade: 'CGC 9.8', count: Math.floor(totalCopies * dist['9.8']) },
      { grade: 'CGC 9.6', count: Math.floor(totalCopies * dist['9.6']) },
      { grade: 'CGC 9.2', count: Math.floor(totalCopies * dist['9.2']) },
      { grade: 'CGC 8.0', count: Math.floor(totalCopies * dist['8.0']) },
      { grade: 'CGC 6.0', count: Math.floor(totalCopies * dist['6.0']) },
      { grade: 'CGC 4.0', count: Math.floor(totalCopies * dist['4.0']) },
      { grade: 'Ungraded', count: Math.floor(totalCopies * dist['lower']) }
    ];

    return gradeDistribution.filter(g => g.count > 0);
  }

  /**
   * Calculate weighted market cap using census distribution and real prices
   */
  calculateWeightedMarketCap(
    censusDistribution: CensusGradeData[],
    pricesByGrade: Map<string, number>,
    sharesPerCopy: number = 100
  ): {
    totalMarketValue: number;
    totalFloat: number;
    sharePrice: number;
    averageComicValue: number;
  } {
    let totalMarketValue = 0;
    let totalCopies = 0;

    // Calculate total market value across all grades
    for (const gradeData of censusDistribution) {
      const price = pricesByGrade.get(gradeData.grade) || 0;
      const copiesAtGrade = gradeData.count;
      
      totalMarketValue += price * copiesAtGrade;
      totalCopies += copiesAtGrade;
    }

    // Total float = total copies × shares per copy
    const totalFloat = totalCopies * sharesPerCopy;

    // Share price = total market value ÷ total float
    const sharePrice = totalFloat > 0 ? totalMarketValue / totalFloat : 0;

    // Average comic value for reference
    const averageComicValue = totalCopies > 0 ? totalMarketValue / totalCopies : 0;

    console.log(`💰 Weighted Market Cap Calculation:`);
    console.log(`   Total Market Value: $${totalMarketValue.toLocaleString()}`);
    console.log(`   Total Copies: ${totalCopies.toLocaleString()}`);
    console.log(`   Total Float: ${totalFloat.toLocaleString()} shares`);
    console.log(`   Share Price: $${sharePrice.toFixed(2)}`);
    console.log(`   Avg Comic Value: $${averageComicValue.toLocaleString()}`);

    return {
      totalMarketValue,
      totalFloat,
      sharePrice,
      averageComicValue
    };
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ GoCollect cache cleared');
  }
}

export const goCollectService = new GoCollectService();

export type {
  CensusGradeData,
  ComicCensusData,
  GoCollectSearchResult
};
