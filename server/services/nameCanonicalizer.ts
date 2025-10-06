/**
 * Name Canonicalization Service
 * 
 * Handles name variants and aliases for comic book entities.
 * Essential for matching against multiple data sources that use different naming conventions.
 * 
 * Examples:
 * - "The Joker" → ["Joker", "The Joker"]
 * - "Spider-Man" → ["Spider-Man", "Spiderman", "Spider Man"]
 * - "Harley Quinn" → ["Harley Quinn", "Dr. Harleen Quinzel"]
 */

interface NameVariants {
  canonical: string;
  variants: string[];
  aliases: string[];
  searchTerms: string[];
}

export class NameCanonicalizerService {
  private commonPrefixes = ['the', 'doctor', 'dr', 'mister', 'mr', 'miss', 'ms', 'captain', 'professor'];
  private commonSuffixes = ['jr', 'sr', 'ii', 'iii', 'iv'];
  
  private knownAliases: Record<string, string[]> = {
    'Harley Quinn': ['Dr. Harleen Quinzel', 'Harleen Quinzel', 'Dr. Quinzel'],
    'The Joker': ['Joker', 'Clown Prince of Crime', 'Mr. J'],
    'Batman': ['Bruce Wayne', 'Dark Knight', 'Caped Crusader', 'Bat-Man'],
    'Superman': ['Clark Kent', 'Kal-El', 'Man of Steel'],
    'Spider-Man': ['Peter Parker', 'Spiderman', 'Spider Man', 'Webslinger'],
    'Wonder Woman': ['Diana Prince', 'Diana of Themyscira'],
    'The Flash': ['Flash', 'Barry Allen', 'Scarlet Speedster'],
    'Green Lantern': ['Hal Jordan', 'John Stewart', 'Guy Gardner'],
    'Iron Man': ['Tony Stark', 'Ironman', 'Iron-Man'],
    'Captain America': ['Steve Rogers', 'Cap', 'Sentinel of Liberty'],
    'Wolverine': ['Logan', 'James Howlett', 'Weapon X'],
    'Deadpool': ['Wade Wilson', 'Merc with a Mouth'],
    'Black Widow': ['Natasha Romanoff', 'Natasha Romanova'],
    'Poison Ivy': ['Pamela Isley', 'Dr. Pamela Isley'],
    'Catwoman': ['Selina Kyle'],
    'Two-Face': ['Harvey Dent', 'Two Face'],
    'Riddler': ['Edward Nygma', 'Edward Nigma', 'E. Nygma'],
    'Penguin': ['Oswald Cobblepot', 'The Penguin'],
    'Scarecrow': ['Jonathan Crane', 'Dr. Jonathan Crane'],
  };

  generateVariants(name: string): NameVariants {
    const canonical = name.trim();
    const variants = new Set<string>();
    const aliases: string[] = this.knownAliases[canonical] || [];
    
    variants.add(canonical);

    const withoutThe = this.removePrefix(canonical, 'the');
    if (withoutThe !== canonical) {
      variants.add(withoutThe);
      variants.add(`The ${withoutThe}`);
    }

    const withoutDr = this.removePrefix(canonical, 'dr');
    if (withoutDr !== canonical) {
      variants.add(withoutDr);
    }

    const hyphenVariants = this.generateHyphenVariants(canonical);
    hyphenVariants.forEach(v => variants.add(v));

    const withoutSuffix = this.removeSuffix(canonical);
    if (withoutSuffix !== canonical) {
      variants.add(withoutSuffix);
    }

    const searchTerms = Array.from(variants).map(v => v.toLowerCase());
    aliases.forEach(alias => searchTerms.push(alias.toLowerCase()));

    return {
      canonical,
      variants: Array.from(variants),
      aliases,
      searchTerms: Array.from(new Set(searchTerms)),
    };
  }

  private removePrefix(name: string, prefix: string): string {
    const regex = new RegExp(`^${prefix}\\s+`, 'i');
    return name.replace(regex, '').trim();
  }

  private removeSuffix(name: string): string {
    const parts = name.split(' ');
    const lastPart = parts[parts.length - 1]?.toLowerCase().replace(/[.,]$/g, '');
    
    if (this.commonSuffixes.includes(lastPart)) {
      return parts.slice(0, -1).join(' ').trim();
    }
    
    return name;
  }

  private generateHyphenVariants(name: string): string[] {
    const variants: string[] = [];
    
    if (name.includes('-')) {
      variants.push(name.replace(/-/g, ''));
      variants.push(name.replace(/-/g, ' '));
    }
    
    if (name.includes(' ')) {
      variants.push(name.replace(/\s+/g, '-'));
      variants.push(name.replace(/\s+/g, ''));
    }
    
    return variants;
  }

  findBestMatch(searchName: string, candidateNames: string[]): string | null {
    const searchVariants = this.generateVariants(searchName);
    const searchTermsLower = searchVariants.searchTerms.map(t => t.toLowerCase());
    
    for (const candidate of candidateNames) {
      const candidateVariants = this.generateVariants(candidate);
      const candidateTermsLower = candidateVariants.searchTerms.map(t => t.toLowerCase());
      
      const hasExactMatch = searchTermsLower.some(st => 
        candidateTermsLower.some(ct => ct === st)
      );
      
      if (hasExactMatch) {
        return candidate;
      }
    }
    
    for (const candidate of candidateNames) {
      const candidateLower = candidate.toLowerCase();
      const hasPartialMatch = searchTermsLower.some(st => 
        candidateLower.includes(st) || st.includes(candidateLower)
      );
      
      if (hasPartialMatch) {
        return candidate;
      }
    }
    
    return null;
  }

  normalizeForComparison(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  isSimilar(name1: string, name2: string, threshold: number = 0.8): boolean {
    const normalized1 = this.normalizeForComparison(name1);
    const normalized2 = this.normalizeForComparison(name2);
    
    if (normalized1 === normalized2) return true;
    
    const similarity = this.calculateSimilarity(normalized1, normalized2);
    return similarity >= threshold;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  addKnownAlias(canonical: string, alias: string) {
    if (!this.knownAliases[canonical]) {
      this.knownAliases[canonical] = [];
    }
    if (!this.knownAliases[canonical].includes(alias)) {
      this.knownAliases[canonical].push(alias);
    }
  }

  getKnownAliases(name: string): string[] {
    return this.knownAliases[name] || [];
  }
}

export const nameCanonicalizer = new NameCanonicalizerService();
