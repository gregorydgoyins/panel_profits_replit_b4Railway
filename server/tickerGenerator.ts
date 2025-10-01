/**
 * Smart Ticker Generation System
 * Generates alphabetic tickers with period variations
 * Examples: BATM, BT.89, SPDY, SP.NWH
 */

interface TickerOptions {
  baseName: string;
  variation?: string; // e.g., "89", "NWH", "BY" for period notation
  type?: 'stock' | 'option' | 'bond' | 'etf';
}

export class TickerGenerator {
  private usedTickers: Set<string> = new Set();

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
