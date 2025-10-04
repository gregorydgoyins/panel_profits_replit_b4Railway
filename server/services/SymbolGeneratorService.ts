import crypto from 'crypto';

/**
 * Symbol Generator Service
 * Generates dot-delimited symbols for different asset types
 * 
 * Format:
 * - Comics: TIKR.VOL.ISSUE (e.g., SPIDEY.1.15)
 * - Characters: CHAR (e.g., SPIDEY, BATMAN)
 * - Creators: CRTR.YR.PUB (e.g., STANLEE.1922.MARVEL)
 * - Publishers: PUB (e.g., MARVEL, DC)
 */
class SymbolGeneratorService {
  /**
   * Clean and abbreviate a name for symbol use
   */
  private cleanAndAbbreviate(name: string, maxLength: number = 8): string {
    // Remove special characters, keep only alphanumeric
    const cleaned = name.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    
    // Split into words
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) {
      // Fallback: use first characters of original name
      return name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxLength) || 'ASSET';
    }
    
    // If single word, truncate it
    if (words.length === 1) {
      return words[0].slice(0, maxLength);
    }
    
    // Multi-word: try to create acronym first
    const acronym = words.map(w => w[0]).join('');
    if (acronym.length <= maxLength && acronym.length >= 3) {
      return acronym;
    }
    
    // If acronym too short or long, use first word + first letters of others
    const firstWord = words[0].slice(0, Math.min(4, maxLength - (words.length - 1)));
    const otherLetters = words.slice(1).map(w => w[0]).join('');
    return (firstWord + otherLetters).slice(0, maxLength);
  }

  /**
   * Parse comic name to extract series, volume, and issue
   */
  private parseComicName(name: string): { series: string; volume?: string; issue?: string } {
    // Common patterns:
    // "Spider-Man Vol 3 #14"
    // "Amazing Spider-Man #1"
    // "Batman (2016) #50"
    // "X-Men Vol. 2 Issue 15"
    
    // Extract volume
    const volMatch = name.match(/vol\.?\s*(\d+)/i);
    const volume = volMatch ? volMatch[1] : undefined;
    
    // Extract issue - try multiple patterns
    const issueMatch = name.match(/#(\d+)|issue\s+(\d+)/i);
    const issue = issueMatch ? (issueMatch[1] || issueMatch[2]) : undefined;
    
    // Extract year in parentheses
    const yearMatch = name.match(/\((\d{4})\)/);
    
    // Get series name by removing all the extracted parts
    let series = name
      .replace(/vol\.?\s*\d+/i, '')
      .replace(/#\d+/g, '')
      .replace(/issue\s+\d+/i, '')
      .replace(/\(\d{4}\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return { series, volume, issue };
  }

  /**
   * Generate symbol for a comic asset
   * Format: TIKR.VOLUME.ISSUE# (e.g., SPDY.V1.#1)
   */
  generateComicSymbol(name: string, metadata?: any): string {
    const parsed = this.parseComicName(name);
    const seriesAbbrev = this.cleanAndAbbreviate(parsed.series, 6);
    
    // If we have volume and issue, use full format: TIKR.V#.##
    if (parsed.volume && parsed.issue) {
      return `${seriesAbbrev}.V${parsed.volume}.#${parsed.issue}`;
    }
    
    // If we have just issue, default to V1
    if (parsed.issue) {
      return `${seriesAbbrev}.V1.#${parsed.issue}`;
    }
    
    // If metadata has year, use it as volume indicator
    if (metadata?.year) {
      const yearShort = metadata.year.toString().slice(-2);
      return `${seriesAbbrev}.V${yearShort}.#1`;
    }
    
    // Fallback: use V1.#1 format
    return `${seriesAbbrev}.V1.#1`;
  }

  /**
   * Generate symbol for a character asset
   */
  generateCharacterSymbol(name: string, metadata?: any): string {
    const abbrev = this.cleanAndAbbreviate(name, 10);
    
    // If character has a variant (e.g., "Spider-Man (Miles Morales)")
    const variantMatch = name.match(/\(([^)]+)\)/);
    if (variantMatch) {
      const variant = this.cleanAndAbbreviate(variantMatch[1], 4);
      return `${abbrev}.${variant}`;
    }
    
    return abbrev;
  }

  /**
   * Generate symbol for a creator asset
   */
  generateCreatorSymbol(name: string, metadata?: any): string {
    const nameAbbrev = this.cleanAndAbbreviate(name, 8);
    
    // Try to extract year from metadata
    let year = metadata?.birthYear || metadata?.debutYear || metadata?.year;
    
    // If no year in metadata, try to parse from name
    if (!year) {
      const yearMatch = name.match(/\b(19\d{2}|20\d{2})\b/);
      if (yearMatch) {
        year = yearMatch[1];
      }
    }
    
    // Get publisher from metadata
    let publisher = metadata?.publisher || metadata?.primaryPublisher;
    if (publisher) {
      const pubAbbrev = this.cleanAndAbbreviate(publisher, 6);
      
      if (year) {
        return `${nameAbbrev}.${year}.${pubAbbrev}`;
      }
      
      return `${nameAbbrev}.${pubAbbrev}`;
    }
    
    // If we have year but no publisher
    if (year) {
      return `${nameAbbrev}.${year}`;
    }
    
    // Fallback: just name
    return nameAbbrev;
  }

  /**
   * Generate symbol for a publisher asset
   */
  generatePublisherSymbol(name: string, metadata?: any): string {
    return this.cleanAndAbbreviate(name, 8);
  }

  /**
   * Main entry point: generate symbol based on asset type
   */
  generateSymbol(type: string, name: string, metadata?: any): string {
    switch (type.toLowerCase()) {
      case 'comic':
        return this.generateComicSymbol(name, metadata);
      case 'character':
        return this.generateCharacterSymbol(name, metadata);
      case 'creator':
        return this.generateCreatorSymbol(name, metadata);
      case 'publisher':
        return this.generatePublisherSymbol(name, metadata);
      default:
        // Fallback for unknown types
        return this.cleanAndAbbreviate(name, 10);
    }
  }

  /**
   * Ensure symbol uniqueness by appending counter if needed
   */
  async makeUnique(symbol: string, checkExists: (symbol: string) => Promise<boolean>): Promise<string> {
    let candidate = symbol;
    let counter = 1;
    
    while (await checkExists(candidate)) {
      // Append alphabetic counter (A, B, C, etc.)
      const suffix = String.fromCharCode(65 + (counter - 1)); // A=65
      candidate = `${symbol}.${suffix}`;
      counter++;
      
      if (counter > 26) {
        // If we exhaust alphabet, use numeric
        candidate = `${symbol}.${counter - 26}`;
      }
    }
    
    return candidate;
  }
}

export const symbolGeneratorService = new SymbolGeneratorService();
