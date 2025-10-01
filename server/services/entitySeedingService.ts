import { comicDataService } from './comicDataService';
import { storage } from '../storage';

/**
 * Entity Mining & Seeding Service
 * Mines the Marvel and Comic Vine APIs to create tradable assets
 * across publishers, franchises, characters, and creators
 */
class EntitySeedingService {
  /**
   * Generate realistic ticker symbol for an entity
   */
  private generateSymbol(name: string, type: string): string {
    const cleanName = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const suffix = {
      publisher: 'PUB',
      franchise: 'FRNCH',
      character: 'HERO', // Will override for villains
      creator: 'CRTR'
    }[type] || 'ASSET';
    
    // Take first 4-6 chars of name
    const base = cleanName.slice(0, Math.min(6, cleanName.length));
    return `${base}.${suffix}`;
  }

  /**
   * Calculate realistic pricing based on entity type and metadata
   */
  private calculateEntityPrice(entity: any, type: string): number {
    let basePrice = 100; // Starting point

    switch (type) {
      case 'publisher':
        // Publishers price based on output volume and market presence
        basePrice = 1000 + Math.random() * 4000; // $1,000 - $5,000
        break;

      case 'franchise':
        // Franchises as aggregate blue-chip assets
        basePrice = 500 + Math.random() * 2500; // $500 - $3,000
        break;

      case 'character':
        // Characters priced by appearance count and significance
        const appearances = entity.metadata?.countOfIssueAppearances || 0;
        if (appearances > 1000) {
          basePrice = 300 + Math.random() * 700; // Major characters: $300-$1,000
        } else if (appearances > 100) {
          basePrice = 100 + Math.random() * 200; // Mid-tier: $100-$300
        } else {
          basePrice = 20 + Math.random() * 80; // Minor: $20-$100
        }
        break;

      case 'creator':
        // Creators priced by body of work and critical acclaim
        const credits = entity.metadata?.countOfIssueAppearances || 0;
        if (credits > 500) {
          basePrice = 200 + Math.random() * 800; // Legendary: $200-$1,000
        } else if (credits > 100) {
          basePrice = 75 + Math.random() * 175; // Established: $75-$250
        } else {
          basePrice = 25 + Math.random() * 75; // Rising: $25-$100
        }
        break;
    }

    return Math.floor(basePrice * 100) / 100; // Round to 2 decimals
  }

  /**
   * Seed major publishers from Comic Vine
   */
  async seedPublishers(): Promise<void> {
    console.log('🏢 Mining publishers from Comic Vine...');
    
    try {
      const publishers = await comicDataService.fetchComicVinePublishers(30);
      
      // Focus on major publishers
      const majorPublishers = [
        'Marvel', 'DC Comics', 'Image Comics', 'Dark Horse Comics', 
        'IDW Publishing', 'Boom Studios', 'Vertigo', 'Dynamite Entertainment'
      ];

      for (const pub of publishers) {
        // Only seed major publishers
        if (!majorPublishers.some(major => pub.name.includes(major))) {
          continue;
        }

        const symbol = this.generateSymbol(pub.name, 'publisher');
        const price = this.calculateEntityPrice(pub, 'publisher');

        // Check if already exists
        const existing = await storage.getAssetBySymbol(symbol);
        if (existing) {
          console.log(`   ♻️  Publisher already exists: ${pub.name}`);
          continue;
        }

        // Create publisher asset
        await storage.createAsset({
          symbol,
          name: pub.name,
          type: 'publisher',
          description: pub.description || `Major comic book publisher`,
          imageUrl: pub.imageUrl,
          metadata: {
            ...pub.metadata,
            location: `${pub.locationCity}, ${pub.locationState}`,
            aliases: pub.aliases
          }
        });

        // Create initial price
        await storage.createMarketData({
          assetId: symbol,
          timeframe: '1d',
          periodStart: new Date(),
          open: price.toString(),
          high: (price * 1.02).toString(),
          low: (price * 0.98).toString(),
          close: price.toString(),
          volume: Math.floor(1000 + Math.random() * 5000),
          change: '0',
          percentChange: '0'
        });

        console.log(`   ✅ Created publisher: ${pub.name} (${symbol}) @ $${price}`);
      }
    } catch (error) {
      console.error('❌ Error seeding publishers:', error);
    }
  }

  /**
   * Seed major characters from Comic Vine (DC, Image, etc.)
   */
  async seedCharacters(): Promise<void> {
    console.log('🦸 Mining characters from Comic Vine...');
    
    try {
      // Fetch characters from major publishers
      const characters = await comicDataService.fetchComicVineCharacters(undefined, 100);
      
      // Filter for major characters (high appearance count)
      const majorCharacters = characters
        .filter(char => (char.metadata?.countOfIssueAppearances || 0) > 50)
        .slice(0, 30); // Top 30 characters

      for (const char of majorCharacters) {
        // Determine if hero or villain
        const isVillain = char.name.toLowerCase().includes('joker') ||
                         char.name.toLowerCase().includes('loki') ||
                         char.name.toLowerCase().includes('magneto') ||
                         char.description?.toLowerCase().includes('villain') ||
                         char.description?.toLowerCase().includes('enemy');
        
        const type = 'character';
        const suffix = isVillain ? 'VILLAIN' : 'HERO';
        const symbol = `${char.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}.${suffix}`;
        const price = this.calculateEntityPrice(char, type);

        // Check if already exists
        const existing = await storage.getAssetBySymbol(symbol);
        if (existing) {
          console.log(`   ♻️  Character already exists: ${char.name}`);
          continue;
        }

        // Create character asset
        await storage.createAsset({
          symbol,
          name: char.name,
          type,
          description: char.description || `${char.publisher || 'Comic'} character with ${char.metadata?.countOfIssueAppearances || 0} appearances`,
          imageUrl: char.imageUrl,
          metadata: {
            ...char.metadata,
            realName: char.realName,
            publisher: char.publisher,
            firstAppearance: char.firstAppearance,
            powers: char.powers,
            aliases: char.aliases,
            origin: char.origin,
            alignment: isVillain ? 'villain' : 'hero'
          }
        });

        // Create initial price
        await storage.createMarketData({
          assetId: symbol,
          timeframe: '1d',
          periodStart: new Date(),
          open: price.toString(),
          high: (price * 1.03).toString(),
          low: (price * 0.97).toString(),
          close: price.toString(),
          volume: Math.floor(500 + Math.random() * 2000),
          change: '0',
          percentChange: '0'
        });

        console.log(`   ✅ Created character: ${char.name} (${symbol}) @ $${price}`);
      }
    } catch (error) {
      console.error('❌ Error seeding characters:', error);
    }
  }

  /**
   * Seed hot creators from Comic Vine
   */
  async seedCreators(): Promise<void> {
    console.log('✍️  Mining creators from Comic Vine...');
    
    try {
      const creators = await comicDataService.fetchComicVineCreators(100);
      
      // Filter for prolific creators
      const prolificCreators = creators
        .filter(creator => (creator.metadata?.countOfIssueAppearances || 0) > 50)
        .slice(0, 30); // Top 30 creators

      for (const creator of prolificCreators) {
        const symbol = this.generateSymbol(creator.name, 'creator');
        const price = this.calculateEntityPrice(creator, 'creator');

        // Check if already exists
        const existing = await storage.getAssetBySymbol(symbol);
        if (existing) {
          console.log(`   ♻️  Creator already exists: ${creator.name}`);
          continue;
        }

        // Create creator asset
        await storage.createAsset({
          symbol,
          name: creator.name,
          type: 'creator',
          description: creator.description || `Comic book creator with ${creator.metadata?.countOfIssueAppearances || 0} credits`,
          imageUrl: creator.imageUrl,
          metadata: {
            ...creator.metadata,
            birthDate: creator.birthDate,
            hometown: creator.hometown,
            country: creator.country,
            aliases: creator.aliases
          }
        });

        // Create initial price
        await storage.createMarketData({
          assetId: symbol,
          timeframe: '1d',
          periodStart: new Date(),
          open: price.toString(),
          high: (price * 1.05).toString(),
          low: (price * 0.95).toString(),
          close: price.toString(),
          volume: Math.floor(200 + Math.random() * 800),
          change: '0',
          percentChange: '0'
        });

        console.log(`   ✅ Created creator: ${creator.name} (${symbol}) @ $${price}`);
      }
    } catch (error) {
      console.error('❌ Error seeding creators:', error);
    }
  }

  /**
   * Seed franchises from Comic Vine volumes
   */
  async seedFranchises(): Promise<void> {
    console.log('📚 Mining franchises from Comic Vine...');
    
    try {
      const volumes = await comicDataService.fetchComicVineVolumes(undefined, 100);
      
      // Filter for major series (high issue count)
      const majorSeries = volumes
        .filter((vol: any) => vol.issueCount > 20)
        .slice(0, 20); // Top 20 series

      for (const seriesData of majorSeries) {
        // Cast to any since fetchComicVineVolumes returns transformed camelCase objects
        const series = seriesData as any;
        const symbol = `${series.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}.FRNCH`;
        const price = this.calculateEntityPrice(series, 'franchise');

        // Check if already exists
        const existing = await storage.getAssetBySymbol(symbol);
        if (existing) {
          console.log(`   ♻️  Franchise already exists: ${series.name}`);
          continue;
        }

        // Create franchise asset
        await storage.createAsset({
          symbol,
          name: series.name,
          type: 'franchise',
          description: series.description || `${series.publisher} franchise with ${series.issueCount} issues`,
          imageUrl: series.imageUrl,
          metadata: {
            ...series.metadata,
            publisher: series.publisher,
            startYear: series.startYear,
            issueCount: series.issueCount,
            firstIssue: series.firstIssue,
            lastIssue: series.lastIssue
          }
        });

        // Create initial price
        await storage.createMarketData({
          assetId: symbol,
          timeframe: '1d',
          periodStart: new Date(),
          open: price.toString(),
          high: (price * 1.04).toString(),
          low: (price * 0.96).toString(),
          close: price.toString(),
          volume: Math.floor(300 + Math.random() * 1500),
          change: '0',
          percentChange: '0'
        });

        console.log(`   ✅ Created franchise: ${series.name} (${symbol}) @ $${price}`);
      }
    } catch (error) {
      console.error('❌ Error seeding franchises:', error);
    }
  }

  /**
   * Run complete seeding process
   */
  async seedAllEntities(): Promise<void> {
    console.log('🎭 Starting entity mining across the comic book universe...');
    console.log('   Mining DC, Image, Dark Horse, IDW, manga, and more...\n');
    
    await this.seedPublishers();
    await this.seedCharacters();
    await this.seedCreators();
    await this.seedFranchises();
    
    console.log('\n✅ Entity mining complete! The mythology trading floor is ready.');
  }
}

export const entitySeedingService = new EntitySeedingService();
