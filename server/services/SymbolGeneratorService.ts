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
    // Replace hyphens, slashes, and other punctuation with spaces FIRST (to preserve word boundaries)
    const spacedName = name.replace(/[-\/\.]/g, ' ');
    
    // Remove special characters, keep only alphanumeric and spaces
    const cleaned = spacedName.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    
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
   * Detect if character is a villain based on metadata
   */
  private isVillain(metadata?: any): boolean {
    if (!metadata) return false;
    
    const role = metadata.role?.toLowerCase() || '';
    const alignment = metadata.alignment?.toLowerCase() || '';
    const type = metadata.type?.toLowerCase() || '';
    const tags = metadata.tags || [];
    
    return role.includes('villain') || 
           alignment.includes('evil') || 
           alignment.includes('bad') ||
           type.includes('villain') ||
           tags.some((t: string) => t.toLowerCase().includes('villain'));
  }

  /**
   * Detect if character is a sidekick based on metadata
   */
  private isSidekick(metadata?: any): boolean {
    if (!metadata) return false;
    
    const role = metadata.role?.toLowerCase() || '';
    const type = metadata.type?.toLowerCase() || '';
    const tags = metadata.tags || [];
    const relationship = metadata.relationship?.toLowerCase() || '';
    
    return role.includes('sidekick') || 
           type.includes('sidekick') ||
           relationship.includes('sidekick') ||
           tags.some((t: string) => t.toLowerCase().includes('sidekick'));
  }

  /**
   * Generate symbol for a character asset (auto-detects hero/villain/sidekick)
   */
  generateCharacterSymbol(name: string, metadata?: any): string {
    // Route to specialized handlers if detected
    if (this.isVillain(metadata)) {
      return this.generateVillainSymbol(name, metadata);
    }
    if (this.isSidekick(metadata)) {
      return this.generateSidekickSymbol(name, metadata);
    }
    
    // Default hero handling
    return this.generateHeroSymbol(name, metadata);
  }

  /**
   * Generate symbol for a hero asset
   * Format: CHARNAME or CHARNAME.VARIANT
   */
  generateHeroSymbol(name: string, metadata?: any): string {
    // Extract variant first before abbreviating (e.g., "Spider-Man (Miles Morales)")
    const variantMatch = name.match(/\(([^)]+)\)/);
    const baseName = variantMatch ? name.replace(/\s*\([^)]+\)/, '').trim() : name;
    const abbrev = this.cleanAndAbbreviate(baseName, 10);
    
    if (variantMatch) {
      const variant = this.cleanAndAbbreviate(variantMatch[1], 4);
      return `${abbrev}.${variant}`;
    }
    
    // Check for universe/franchise prefix
    if (metadata?.universe || metadata?.franchise) {
      const prefix = this.cleanAndAbbreviate(metadata.universe || metadata.franchise, 3);
      return `${prefix}.${abbrev}`;
    }
    
    return abbrev;
  }

  /**
   * Generate symbol for a villain asset
   * Format: VNAME
   */
  generateVillainSymbol(name: string, metadata?: any): string {
    // Extract variant first before abbreviating
    const variantMatch = name.match(/\(([^)]+)\)/);
    const baseName = variantMatch ? name.replace(/\s*\([^)]+\)/, '').trim() : name;
    const abbrev = this.cleanAndAbbreviate(baseName, 10);
    
    if (variantMatch) {
      const variant = this.cleanAndAbbreviate(variantMatch[1], 4);
      return `${abbrev}.${variant}`;
    }
    
    return abbrev;
  }

  /**
   * Generate symbol for a sidekick asset
   * Format: SNAME or HERO.SNAME
   */
  generateSidekickSymbol(name: string, metadata?: any): string {
    // Extract variant first before abbreviating
    const variantMatch = name.match(/\(([^)]+)\)/);
    const baseName = variantMatch ? name.replace(/\s*\([^)]+\)/, '').trim() : name;
    const abbrev = this.cleanAndAbbreviate(baseName, 8);
    
    // If we know the associated hero, prefix with hero name
    if (metadata?.associatedHero || metadata?.mentor) {
      const heroName = metadata.associatedHero || metadata.mentor;
      const heroAbbrev = this.cleanAndAbbreviate(heroName, 6);
      return `${heroAbbrev}.${abbrev}`;
    }
    
    // If variant in name (e.g., "Robin (Dick Grayson)")
    if (variantMatch) {
      const variant = this.cleanAndAbbreviate(variantMatch[1], 3);
      return `${abbrev}.${variant}`;
    }
    
    return abbrev;
  }

  /**
   * Generate symbol for a henchman asset
   * Format: VILLAIN.HENCH or HENCHNAME
   */
  generateHenchmanSymbol(name: string, metadata?: any): string {
    const abbrev = this.cleanAndAbbreviate(name, 8);
    
    // If we know the associated villain, prefix with villain name
    if (metadata?.villain || metadata?.boss) {
      const villainName = metadata.villain || metadata.boss;
      const villainAbbrev = this.cleanAndAbbreviate(villainName, 6);
      return `${villainAbbrev}.${abbrev}`;
    }
    
    return abbrev;
  }

  /**
   * Generate symbol for a gadget asset
   * Format: OWNER.GADGET
   */
  generateGadgetSymbol(name: string, metadata?: any): string {
    // Extract owner from metadata first
    const owner = metadata?.owner || metadata?.character;
    if (owner) {
      const ownerAbbrev = this.cleanAndAbbreviate(owner, 6);
      const gadgetAbbrev = this.cleanAndAbbreviate(name, 8);
      return `${ownerAbbrev}.${gadgetAbbrev}`;
    }
    
    // Try to extract from name (e.g., "Batman's Batmobile")
    const ownerMatch = name.match(/^([A-Za-z]+)'s/);
    if (ownerMatch) {
      const ownerAbbrev = this.cleanAndAbbreviate(ownerMatch[1], 6);
      const cleanGadget = name.replace(/^[A-Za-z]+'s\s+/, '');
      const gadgetAbbrev = this.cleanAndAbbreviate(cleanGadget, 8);
      return `${ownerAbbrev}.${gadgetAbbrev}`;
    }
    
    // Fallback: just gadget name
    return this.cleanAndAbbreviate(name, 10);
  }

  /**
   * Generate symbol for a location asset
   * Format: CITYNAME or LOC.NAME
   */
  generateLocationSymbol(name: string, metadata?: any): string {
    const abbrev = this.cleanAndAbbreviate(name, 10);
    
    // If it's a well-known location, use simple abbreviation
    return abbrev;
  }

  /**
   * Generate symbol for a hideout asset
   * Format: OWNER.HIDEOUT
   */
  generateHideoutSymbol(name: string, metadata?: any): string {
    const hideoutAbbrev = this.cleanAndAbbreviate(name, 8);
    
    // Extract owner from metadata or name
    const owner = metadata?.owner || metadata?.character;
    if (owner) {
      const ownerAbbrev = this.cleanAndAbbreviate(owner, 6);
      return `${ownerAbbrev}.${hideoutAbbrev}`;
    }
    
    // Try to extract from name (e.g., "Batcave")
    const commonPrefixes = ['bat', 'super', 'spider', 'iron', 'wonder'];
    for (const prefix of commonPrefixes) {
      if (name.toLowerCase().startsWith(prefix)) {
        const ownerAbbrev = prefix.toUpperCase();
        return `${ownerAbbrev}.${hideoutAbbrev}`;
      }
    }
    
    return hideoutAbbrev;
  }

  /**
   * Generate symbol for a fund asset
   * Format: THEME.FND
   */
  generateFundSymbol(name: string, metadata?: any): string {
    // Remove "Fund" from the name to get theme
    const themeName = name.replace(/\s*fund\s*$/i, '').trim();
    const themeAbbrev = this.cleanAndAbbreviate(themeName, 12);
    
    return `${themeAbbrev}.FND`;
  }

  /**
   * Generate symbol for an ETF asset
   * Format: THEME.ETF
   */
  generateETFSymbol(name: string, metadata?: any): string {
    // Remove "ETF" from the name to get theme
    const themeName = name.replace(/\s*etf\s*$/i, '').trim();
    const themeAbbrev = this.cleanAndAbbreviate(themeName, 12);
    
    return `${themeAbbrev}.ETF`;
  }

  /**
   * Parse creator name into LASTNAME_FIRSTNAME format
   */
  private parseCreatorName(name: string): string {
    // Remove any parenthetical info
    const cleanName = name.replace(/\([^)]*\)/g, '').trim();
    
    // Split by comma first (e.g., "Lee, Stan")
    if (cleanName.includes(',')) {
      const parts = cleanName.split(',').map(p => p.trim());
      const lastName = this.cleanAndAbbreviate(parts[0], 8);
      const firstName = parts[1] ? this.cleanAndAbbreviate(parts[1], 6) : '';
      return firstName ? `${lastName}_${firstName}` : lastName;
    }
    
    // Split by space (e.g., "Stan Lee")
    const words = cleanName.split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) {
      return this.cleanAndAbbreviate(name, 10);
    }
    
    if (words.length === 1) {
      return this.cleanAndAbbreviate(words[0], 10);
    }
    
    // Assume last word is last name, first word is first name
    const firstName = this.cleanAndAbbreviate(words[0], 6);
    const lastName = this.cleanAndAbbreviate(words[words.length - 1], 8);
    
    return `${lastName}_${firstName}`;
  }

  /**
   * Generate symbol for a creator asset
   * Format: LASTNAME_FIRSTNAME.PUBLISHER.YEAR
   */
  generateCreatorSymbol(name: string, metadata?: any): string {
    const nameFormatted = this.parseCreatorName(name);
    
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
      const pubAbbrev = this.cleanAndAbbreviate(publisher, 8);
      
      if (year) {
        return `${nameFormatted}.${pubAbbrev}.${year}`;
      }
      
      return `${nameFormatted}.${pubAbbrev}`;
    }
    
    // If we have year but no publisher
    if (year) {
      return `${nameFormatted}.${year}`;
    }
    
    // Fallback: just name
    return nameFormatted;
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
      case 'hero':
        return this.generateHeroSymbol(name, metadata);
      case 'villain':
        return this.generateVillainSymbol(name, metadata);
      case 'sidekick':
        return this.generateSidekickSymbol(name, metadata);
      case 'henchman':
      case 'hench':
        return this.generateHenchmanSymbol(name, metadata);
      case 'creator':
      case 'artist':
      case 'writer':
        return this.generateCreatorSymbol(name, metadata);
      case 'publisher':
        return this.generatePublisherSymbol(name, metadata);
      case 'gadget':
      case 'weapon':
      case 'item':
        return this.generateGadgetSymbol(name, metadata);
      case 'location':
      case 'city':
        return this.generateLocationSymbol(name, metadata);
      case 'hideout':
      case 'base':
      case 'lair':
        return this.generateHideoutSymbol(name, metadata);
      case 'fund':
        return this.generateFundSymbol(name, metadata);
      case 'etf':
        return this.generateETFSymbol(name, metadata);
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
