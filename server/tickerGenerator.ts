/**
 * Hierarchical Ticker Generation System
 * Supports SERIES.YEAR.CATEGORY.INDEX format for infinite scalability
 * Examples: 
 * - DC.39.HER.1 (Detective Comics 1939, Hero #1 - Batman)
 * - ASM.63.KEY.1 (Amazing Spider-Man 1963, Key Issue #1)
 * - DC.39.GAD.1 (Detective Comics 1939, Gadget #1 - Batarang)
 */

import { db } from './databaseStorage.js';
import { assets } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

export type AssetCategory = 
  | 'HER'  // Heroes/Superheroes
  | 'VIL'  // Villains/Supervillains
  | 'SID'  // Sidekicks
  | 'HEN'  // Henchmen
  | 'GAD'  // Gadgets/Technology
  | 'LOC'  // Locations/Places
  | 'KEY'  // Key Comic Issues
  | 'CRT'  // Creators (Artists/Writers)
  | 'TEM'  // Teams
  | 'PUB'  // Publishers
  | 'ETF'  // Funds/ETFs
  | 'OPT'  // Options
  | 'BND'  // Bonds
  | 'DRV'; // Other Derivatives

interface TickerOptions {
  baseName: string;
  variation?: string; // e.g., "89", "NWH", "BY" for period notation
  type?: 'stock' | 'option' | 'bond' | 'etf';
}

interface HierarchicalTickerOptions {
  series: string;        // e.g., "Detective Comics", "Amazing Spider-Man"
  year?: number;         // e.g., 1939, 1963
  category: AssetCategory;
  index?: number;        // Auto-assigned if not provided
  name: string;          // Full asset name for fallback
}

export class TickerGenerator {
  private usedTickers: Set<string> = new Set();

  /**
   * Generate hierarchical ticker: SERIES.YEAR.CATEGORY.INDEX
   * Example: DC.39.HER.1 (Detective Comics 1939, Hero #1 - Batman)
   * Uses database to persist counters across runs
   */
  async generateHierarchicalTicker(options: HierarchicalTickerOptions): Promise<string> {
    const { series, year, category, index, name } = options;

    // Generate series code (2-3 chars)
    const seriesCode = this.generateSeriesCode(series);
    
    // Format year (2 digits)
    const yearCode = year ? String(year).slice(-2) : '00';
    
    // Get or assign index for this category
    const prefix = `${seriesCode}.${yearCode}.${category}`;
    let assetIndex = index;
    
    if (assetIndex === undefined) {
      // Query database for max index with this prefix
      const result = await db.execute<{ max_index: number }>(sql`
        SELECT COALESCE(MAX(CAST(
          SPLIT_PART(symbol, '.', 4) AS INTEGER
        )), 0) as max_index
        FROM assets
        WHERE symbol LIKE ${prefix + '.%'}
      `);
      
      const maxIndex = result.rows[0]?.max_index || 0;
      assetIndex = maxIndex + 1;
    }

    // Build ticker: SERIES.YEAR.CATEGORY.INDEX
    const ticker = `${seriesCode}.${yearCode}.${category}.${assetIndex}`;
    
    this.usedTickers.add(ticker);
    return ticker;
  }

  /**
   * Generate series code from series name
   * "Detective Comics" → "DC"
   * "Amazing Spider-Man" → "ASM"
   */
  private generateSeriesCode(series: string): string {
    // Clean and uppercase
    const cleaned = series
      .replace(/^(THE|AN|A)\s+/i, '')
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '');

    // Try acronym first (first letter of each word)
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2) {
      const acronym = words.slice(0, 3).map(w => w[0]).join('');
      if (acronym.length >= 2) {
        return acronym;
      }
    }

    // Fallback to consonant compression
    const singleWord = words.join('');
    const compressed = this.generateBaseTicker(singleWord, 3).substring(0, 3);
    return compressed;
  }

  /**
   * Generate a base ticker using consonant compression
   */
  private generateBaseTicker(name: string, targetLength: number = 4): string {
    // Remove common prefixes
    let cleaned = name
      .replace(/^(THE|AN|A)\s+/i, '')
      .replace(/'S\b/i, '')
      .toUpperCase();

    // Remove non-alphanumeric characters
    cleaned = cleaned.replace(/[^A-Z0-9]/g, '');

    if (cleaned.length === 0) return 'XXXX';

    // If it's already short enough, use it
    if (cleaned.length <= targetLength) {
      return cleaned.padEnd(targetLength, 'X');
    }

    // Consonant compression: keep first letter, then consonants
    const firstChar = cleaned[0];
    const rest = cleaned.substring(1);
    const consonants = rest.replace(/[AEIOU]/g, '');

    let result = firstChar + consonants;
    
    // If still too long, truncate
    if (result.length > targetLength) {
      result = result.substring(0, targetLength);
    }
    
    // If too short, pad with next vowels or X
    if (result.length < targetLength) {
      const vowels = rest.replace(/[^AEIOU]/g, '');
      result = result + vowels.substring(0, targetLength - result.length);
      result = result.padEnd(targetLength, 'X');
    }

    return result;
  }

  /**
   * Generate ticker with optional period variation
   */
  generateTicker(options: TickerOptions): string {
    const { baseName, variation, type = 'stock' } = options;
    
    // For stocks, try 4-char base first
    let base = this.generateBaseTicker(baseName, 4);
    
    // Add variation with period if provided
    if (variation) {
      const varTicker = this.generateBaseTicker(baseName, 2);
      const varSuffix = variation.replace(/[^A-Z0-9]/g, '').substring(0, 2).toUpperCase();
      return `${varTicker}.${varSuffix}`;
    }

    // Handle collisions
    let ticker = base;
    let attempt = 0;
    
    while (this.usedTickers.has(ticker) && attempt < 100) {
      attempt++;
      
      if (attempt <= 9) {
        // Replace last char with number
        ticker = base.substring(0, 3) + attempt;
      } else if (attempt <= 35) {
        // Replace last char with letter A-Z
        ticker = base.substring(0, 3) + String.fromCharCode(65 + (attempt - 10));
      } else {
        // Use 2-char base + 2-digit number
        ticker = base.substring(0, 2) + String(attempt).padStart(2, '0');
      }
    }

    this.usedTickers.add(ticker);
    return ticker;
  }

  /**
   * Generate derivative ticker (option, bond, LEAP)
   */
  generateDerivativeTicker(
    baseTicker: string,
    derivativeType: 'option' | 'bond' | 'leap',
    params: {
      month?: string;
      year?: string;
      strike?: number;
      callPut?: 'C' | 'P';
      yield?: number;
    }
  ): string {
    const { month, year, strike, callPut, yield: yieldRate } = params;

    switch (derivativeType) {
      case 'option':
      case 'leap':
        // Format: BATM.01.2025.C or BATM.01.25.P
        const shortYear = year?.substring(2) || '25';
        return `${baseTicker}.${month}.${shortYear}.${callPut}`;
      
      case 'bond':
        // Format: BATM.DEC.2025.5.0
        const monthUpper = month?.toUpperCase().substring(0, 3) || 'DEC';
        return `${baseTicker}.${monthUpper}.${year}.${yieldRate?.toFixed(1)}`;
      
      default:
        return baseTicker;
    }
  }

  /**
   * Generate ETF ticker
   */
  generateETFTicker(name: string): string {
    const base = this.generateBaseTicker(name, 3);
    return `${base}.ETF`;
  }

  /**
   * Batch generate tickers for multiple assets
   */
  batchGenerate(names: string[]): Map<string, string> {
    const result = new Map<string, string>();
    
    for (const name of names) {
      const ticker = this.generateTicker({ baseName: name });
      result.set(name, ticker);
    }
    
    return result;
  }

  /**
   * Check if ticker is already in use
   */
  isTickerUsed(ticker: string): boolean {
    return this.usedTickers.has(ticker);
  }

  /**
   * Reserve a ticker manually
   */
  reserveTicker(ticker: string): void {
    this.usedTickers.add(ticker);
  }

  /**
   * Load existing tickers from database
   */
  loadExistingTickers(tickers: string[]): void {
    tickers.forEach(t => this.usedTickers.add(t));
  }

  /**
   * Get ticker stats
   */
  getStats() {
    return {
      totalUsed: this.usedTickers.size,
      availableSpace: Math.pow(26, 4) - this.usedTickers.size, // 456,976 possible 4-char combos
    };
  }
}

// Export singleton instance
export const tickerGenerator = new TickerGenerator();
