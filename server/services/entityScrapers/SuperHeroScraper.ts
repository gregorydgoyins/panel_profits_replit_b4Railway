import { BaseEntityScraper, EntityData, ScraperConfig } from './BaseEntityScraper';

interface SuperHeroCharacter {
  id: number;
  name: string;
  slug: string;
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  appearance: {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
    eyeColor: string;
    hairColor: string;
  };
  biography: {
    fullName: string;
    alterEgos: string;
    aliases: string[];
    placeOfBirth: string;
    firstAppearance: string;
    publisher: string;
    alignment: string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    groupAffiliation: string;
    relatives: string;
  };
  images: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
}

export class SuperHeroScraper extends BaseEntityScraper {
  private baseUrl = 'https://akabab.github.io/superhero-api/api';
  private allHeroesUrl = `${this.baseUrl}/all.json`;
  private heroesCache: SuperHeroCharacter[] | null = null;

  constructor() {
    const config: ScraperConfig = {
      sourceName: 'superhero-api',
      sourceReliability: 0.85, // Community-maintained, good quality
      rateLimit: 500, // 500ms between requests
      maxRetries: 3,
      timeout: 10000,
    };
    
    super(config);
  }

  async scrapeEntities(query?: { entityType?: string; publisher?: string; limit?: number; offset?: number }): Promise<EntityData[]> {
    const limit = query?.limit || 20;
    const offset = query?.offset || 0;

    try {
      await this.loadHeroesCache();
      
      if (!this.heroesCache) {
        return [];
      }

      let filtered = this.heroesCache;
      
      // Filter by publisher if specified
      if (query?.publisher) {
        filtered = filtered.filter(h => 
          h.biography.publisher.toLowerCase().includes(query.publisher!.toLowerCase())
        );
      }

      const paginated = filtered.slice(offset, offset + limit);
      return paginated.map(hero => this.mapToEntityData(hero));
      
    } catch (error) {
      console.error('SuperHero scraper error:', error);
      return [];
    }
  }

  async scrapeEntity(sourceEntityId: string): Promise<EntityData | null> {
    try {
      const heroUrl = `${this.baseUrl}/id/${sourceEntityId}.json`;
      const response = await fetch(heroUrl);
      
      if (!response.ok) {
        throw new Error(`SuperHero API error: ${response.status} ${response.statusText}`);
      }

      const hero: SuperHeroCharacter = await response.json();
      return this.mapToEntityData(hero);
      
    } catch (error) {
      console.error(`SuperHero scraper error for ${sourceEntityId}:`, error);
      return null;
    }
  }

  async hasEntityData(entityName: string, entityType: string): Promise<boolean> {
    try {
      await this.loadHeroesCache();
      
      if (!this.heroesCache) {
        return false;
      }

      const normalizedName = entityName.toLowerCase();
      return this.heroesCache.some(h => 
        h.name.toLowerCase().includes(normalizedName) ||
        h.slug.toLowerCase().includes(normalizedName)
      );
      
    } catch (error) {
      console.error(`SuperHero hasEntityData error for ${entityName}:`, error);
      return false;
    }
  }

  private async loadHeroesCache(): Promise<void> {
    if (this.heroesCache) {
      return; // Already loaded
    }

    try {
      const response = await fetch(this.allHeroesUrl);
      if (!response.ok) {
        throw new Error(`Failed to load heroes: ${response.status}`);
      }

      this.heroesCache = await response.json();
      console.log(`Loaded ${this.heroesCache?.length || 0} superheroes from SuperHero API`);
      
    } catch (error) {
      console.error('Failed to load SuperHero cache:', error);
      this.heroesCache = null;
    }
  }

  private mapToEntityData(hero: SuperHeroCharacter): EntityData {
    const entityData: EntityData = {
      entityId: `superhero-${hero.id}`,
      entityName: hero.name,
      entityType: 'character',
      publisher: hero.biography.publisher || undefined,
      firstAppearance: this.extractFirstAppearance(hero),
      attributes: this.extractAttributes(hero),
      relationships: this.extractRelationships(hero),
      appearances: [], // SuperHero API doesn't provide appearance list
      sourceEntityId: hero.id.toString(),
      sourceUrl: `https://www.superherodb.com/character/${hero.slug}/`,
      sourceData: hero,
    };

    return entityData;
  }

  private extractFirstAppearance(hero: SuperHeroCharacter): EntityData['firstAppearance'] {
    if (!hero.biography.firstAppearance || hero.biography.firstAppearance === '-') {
      return undefined;
    }

    return {
      comicTitle: hero.biography.firstAppearance,
      coverUrl: hero.images.lg || hero.images.md || hero.images.sm,
      franchise: this.extractFranchise(hero.biography.publisher),
    };
  }

  private extractAttributes(hero: SuperHeroCharacter): EntityData['attributes'] {
    const attributes: EntityData['attributes'] = [];

    // Extract powers from powerstats
    const powerMapping: Array<{key: keyof typeof hero.powerstats, name: string}> = [
      { key: 'intelligence', name: 'Intelligence' },
      { key: 'strength', name: 'Super Strength' },
      { key: 'speed', name: 'Super Speed' },
      { key: 'durability', name: 'Durability' },
      { key: 'power', name: 'Energy Projection' },
      { key: 'combat', name: 'Combat Skills' },
    ];

    for (const { key, name } of powerMapping) {
      const value = hero.powerstats[key];
      if (value && value > 0) {
        const level = this.getPowerLevel(value);
        attributes.push({
          category: key === 'combat' ? 'ability' : 'power',
          name,
          description: `${name} level: ${value}/100`,
          level,
          isActive: true,
        });
      }
    }

    // Extract origin/background info
    if (hero.biography.placeOfBirth && hero.biography.placeOfBirth !== '-') {
      attributes.push({
        category: 'origin',
        name: 'Place of Birth',
        description: hero.biography.placeOfBirth,
        isActive: true,
      });
    }

    // Extract race/abilities
    if (hero.appearance.race && hero.appearance.race !== 'null' && hero.appearance.race !== '-') {
      const category = this.isRacePower(hero.appearance.race) ? 'power' : 'origin';
      attributes.push({
        category,
        name: 'Species/Race',
        description: hero.appearance.race,
        originType: category === 'origin' ? this.getOriginType(hero.appearance.race) : undefined,
        isActive: true,
      });
    }

    return attributes;
  }

  private extractRelationships(hero: SuperHeroCharacter): EntityData['relationships'] {
    const relationships: EntityData['relationships'] = [];

    // Extract team affiliations
    if (hero.connections.groupAffiliation && hero.connections.groupAffiliation !== '-') {
      const teams = hero.connections.groupAffiliation
        .split(/,|;/)
        .map(t => t.trim())
        .filter(t => t && t.length > 0);

      for (const team of teams) {
        relationships.push({
          targetEntityId: `team-${team.toLowerCase().replace(/\s+/g, '-')}`,
          targetEntityName: team,
          targetEntityType: 'team',
          relationshipType: 'teammate',
          isActive: true,
        });
      }
    }

    // Extract family relationships
    if (hero.connections.relatives && hero.connections.relatives !== '-') {
      const relatives = hero.connections.relatives
        .split(/,|;/)
        .map(r => r.trim())
        .filter(r => r && r.length > 0);

      for (const relative of relatives) {
        // Parse relationship from text like "Bruce Wayne (father)"
        const match = relative.match(/^(.+?)\s*\((.+?)\)$/);
        const relativeName = match ? match[1].trim() : relative;
        const relationshipType = match ? match[2].trim() : 'family';

        relationships.push({
          targetEntityId: `character-${relativeName.toLowerCase().replace(/\s+/g, '-')}`,
          targetEntityName: relativeName,
          targetEntityType: 'character',
          relationshipType: 'family',
          relationshipSubtype: relationshipType,
          isActive: true,
        });
      }
    }

    return relationships;
  }

  private getPowerLevel(value: number): 'primary' | 'secondary' | 'situational' {
    if (value >= 70) return 'primary';
    if (value >= 40) return 'secondary';
    return 'situational';
  }

  private isRacePower(race: string): boolean {
    const powerRaces = ['kryptonian', 'asgardian', 'eternal', 'symbiote', 'speedster', 'atlantean'];
    return powerRaces.some(pr => race.toLowerCase().includes(pr));
  }

  private getOriginType(race: string): 'accident' | 'birth' | 'experiment' | 'magic' | 'technology' | 'mutation' {
    const raceLower = race.toLowerCase();
    if (raceLower.includes('mutant') || raceLower.includes('inhuman')) return 'mutation';
    if (raceLower.includes('god') || raceLower.includes('asgardian')) return 'magic';
    if (raceLower.includes('alien') || raceLower.includes('kryptonian')) return 'birth';
    if (raceLower.includes('android') || raceLower.includes('cyborg')) return 'technology';
    return 'birth';
  }

  private extractFranchise(publisher: string): string | undefined {
    if (!publisher || publisher === '-') return undefined;
    
    if (publisher.toLowerCase().includes('marvel')) return 'Marvel';
    if (publisher.toLowerCase().includes('dc')) return 'DC';
    if (publisher.toLowerCase().includes('image')) return 'Image';
    if (publisher.toLowerCase().includes('dark horse')) return 'Dark Horse';
    
    return publisher;
  }
}
