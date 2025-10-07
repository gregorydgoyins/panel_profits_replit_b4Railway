/**
 * Entity Normalization Service
 * 
 * Handles:
 * - Name canonicalization for cross-source matching
 * - Fuzzy matching for near-duplicates
 * - Alias resolution
 * - Publisher-aware deduplication
 */

export interface CanonicalEntity {
  canonicalName: string;
  aliases: string[];
  publisher?: string;
  entityType: string;
}

export class NormalizationService {
  /**
   * Canonicalize entity name for matching
   * 
   * Examples:
   * - "Spider-Man (Peter Parker)" → "spiderman"
   * - "The Amazing Spider-Man" → "spiderman"
   * - "Superman (Clark Kent)" → "superman"
   * - "Dr. Strange" → "strange"
   * - "Doctor Strange" → "strange"
   * - "Strange, Doctor" → "strange" (comma-inverted)
   * - "Lantern, The Green" → "green-lantern" (inverted with article)
   */
  canonicalizeName(name: string): string {
    const original = name.toLowerCase();
    let canonical = original;
    
    // Remove parentheticals (character identifiers)
    canonical = canonical.replace(/\([^)]*\)/g, '');
    
    // Handle comma-inverted names (e.g., "Strange, Doctor" → "Doctor Strange")
    if (canonical.includes(',')) {
      const parts = canonical.split(',').map(p => p.trim());
      if (parts.length === 2) {
        // Reverse order: "Lastname, Firstname" → "Firstname Lastname"
        canonical = `${parts[1]} ${parts[0]}`;
      }
    }
    
    // Remove common prefixes ONLY if result would be non-empty
    const withoutPrefix = canonical.replace(/^(the|a|an)\s+/i, '');
    if (withoutPrefix.trim()) {
      canonical = withoutPrefix;
    }
    
    // Remove descriptive epithets ONLY if result would be non-empty
    const withoutEpithets = canonical.replace(/\b(amazing|astonishing|incredible|spectacular|invincible|mighty|ultimate|superior|sensational|fantastic|uncanny|extraordinary|all-new|all-star)\s+/gi, '');
    if (withoutEpithets.trim()) {
      canonical = withoutEpithets;
    }
    
    // Remove titles ONLY if result would be non-empty
    // This ensures "Doctor" (standalone) stays "doctor" but "Doctor Strange" becomes "strange"
    const withoutTitles = canonical.replace(/\b(doctor|dr|mister|mr|mistress|mrs|miss|ms|professor|prof|captain|capt|general|gen|major|maj|lieutenant|lt|sergeant|sgt|admiral|adm)\.?\s*/gi, '');
    if (withoutTitles.trim()) {
      canonical = withoutTitles;
    }
    
    // Remove punctuation and special chars
    canonical = canonical.replace(/[^\w\s]/g, '');
    
    // Collapse whitespace
    canonical = canonical.replace(/\s+/g, ' ').trim();
    
    // Use kebab case for consistency
    canonical = canonical.replace(/\s+/g, '-');
    
    return canonical;
  }

  /**
   * Extract aliases from entity name
   * 
   * CONSERVATIVE STRATEGY: Only canonical + parenthetical to prevent false positives.
   * No token splitting, no colon variants - maximum precision.
   * 
   * Examples:
   * - "Spider-Man (Peter Parker)" → ["spiderman", "peter-parker"]
   * - "Superman (Clark Kent)" → ["superman", "clark-kent"]
   * - "Doctor Strange" → ["strange"]
   * - "Green Lantern" → ["green-lantern"]
   * - "Green Lantern Corps" → ["green-lantern-corps"] (no collision with "green-lantern")
   */
  extractAliases(name: string): string[] {
    const aliases: string[] = [];
    
    // Extract parenthetical as alias (full only)
    const parentheticalMatch = name.match(/\(([^)]+)\)/);
    if (parentheticalMatch) {
      const parentheticalAlias = this.canonicalizeName(parentheticalMatch[1]);
      aliases.push(parentheticalAlias);
    }
    
    // Add main name without parenthetical
    const mainName = name.replace(/\([^)]*\)/g, '').trim();
    const canonicalMain = this.canonicalizeName(mainName);
    aliases.push(canonicalMain);
    
    return [...new Set(aliases)]; // Deduplicate
  }

  /**
   * Calculate string similarity using Levenshtein distance
   * Returns 0-1 where 1 is identical
   */
  calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Levenshtein distance implementation
   */
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
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Fuzzy match entities with similarity threshold
   * Returns true if entities are likely the same
   */
  fuzzyMatch(
    entity1: CanonicalEntity,
    entity2: CanonicalEntity,
    threshold: number = 0.85
  ): boolean {
    // Must be same type
    if (entity1.entityType !== entity2.entityType) {
      return false;
    }
    
    // If publishers differ and both are known, they're different entities
    // (Exception: cross-publisher characters exist but are rare)
    if (entity1.publisher && entity2.publisher && 
        entity1.publisher !== entity2.publisher &&
        entity1.publisher !== 'Unknown' && entity2.publisher !== 'Unknown') {
      // Only strict name match for cross-publisher
      return entity1.canonicalName === entity2.canonicalName;
    }
    
    // Check canonical name similarity
    const nameSimilarity = this.calculateSimilarity(
      entity1.canonicalName,
      entity2.canonicalName
    );
    
    if (nameSimilarity >= threshold) {
      return true;
    }
    
    // Check aliases
    for (const alias1 of entity1.aliases) {
      for (const alias2 of entity2.aliases) {
        const aliasSimilarity = this.calculateSimilarity(alias1, alias2);
        if (aliasSimilarity >= threshold) {
          return true;
        }
      }
      
      // Check if alias matches canonical name
      const aliasToCanonicalSim = this.calculateSimilarity(alias1, entity2.canonicalName);
      if (aliasToCanonicalSim >= threshold) {
        return true;
      }
    }
    
    for (const alias2 of entity2.aliases) {
      const canonicalToAliasSim = this.calculateSimilarity(entity1.canonicalName, alias2);
      if (canonicalToAliasSim >= threshold) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Create canonical entity for matching
   */
  createCanonicalEntity(
    name: string,
    entityType: string,
    publisher?: string
  ): CanonicalEntity {
    return {
      canonicalName: this.canonicalizeName(name),
      aliases: this.extractAliases(name),
      publisher,
      entityType,
    };
  }

  /**
   * Group entities by similarity
   * Returns groups of matching entities
   */
  groupSimilarEntities<T extends { entityName: string; entityType: string; publisher?: string }>(
    entities: T[],
    threshold: number = 0.85
  ): T[][] {
    const groups: T[][] = [];
    const processed = new Set<number>();
    
    for (let i = 0; i < entities.length; i++) {
      if (processed.has(i)) continue;
      
      const group: T[] = [entities[i]];
      processed.add(i);
      
      const canonical1 = this.createCanonicalEntity(
        entities[i].entityName,
        entities[i].entityType,
        entities[i].publisher
      );
      
      for (let j = i + 1; j < entities.length; j++) {
        if (processed.has(j)) continue;
        
        const canonical2 = this.createCanonicalEntity(
          entities[j].entityName,
          entities[j].entityType,
          entities[j].publisher
        );
        
        if (this.fuzzyMatch(canonical1, canonical2, threshold)) {
          group.push(entities[j]);
          processed.add(j);
        }
      }
      
      groups.push(group);
    }
    
    return groups;
  }

  /**
   * Select best name from group
   * Prefers most complete/official name
   */
  selectBestName(names: string[]): string {
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    
    // Prefer names with parentheticals (more specific)
    const withParenthetical = names.filter(n => /\([^)]+\)/.test(n));
    if (withParenthetical.length === 1) return withParenthetical[0];
    
    // Prefer longer names (more complete)
    return names.sort((a, b) => b.length - a.length)[0];
  }
}

// Singleton instance
export const normalizationService = new NormalizationService();
