// PPIx Index Service - Comic Book Market Indices (Like DOW 30 and NASDAQ 100)
import { MarketIndex, MarketIndexData, Asset } from '@shared/schema.js';
import { marketPricingService } from './marketPricingService.js';

interface IndexConstituent {
  assetId: string;
  symbol: string;
  name: string;
  weight: number; // Percentage weight in index (0-100)
  marketCap: number;
  significance: number;
  category: string;
}

interface IndexCalculation {
  currentValue: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  volume: number;
  constituents: IndexConstituent[];
  lastRebalance: Date;
  nextRebalance: Date;
}

class PPIxIndexService {
  
  // PPIx 50 - The "Comic DOW Jones" - Blue Chip Characters and Publishers
  async calculatePPIx50(assets: any[]): Promise<IndexCalculation> {
    console.log('Calculating PPIx 50 (Blue Chip Comic Index)...');
    
    // Define blue chip criteria
    const blueChipAssets = assets
      .filter(asset => {
        // Must be major characters or legendary creators
        const isMajorCharacter = this.isMajorCharacter(asset);
        const isLegendaryCreator = this.isLegendaryCreator(asset);
        const hasHighSignificance = (asset.significance || 0) >= 80;
        const hasStableMarket = asset.price >= 1000; // High-value assets
        
        return (isMajorCharacter || isLegendaryCreator) && hasHighSignificance && hasStableMarket;
      })
      .sort((a, b) => (b.significance || 0) - (a.significance || 0))
      .slice(0, 50); // Top 50 blue chips

    return this.calculateIndexValue(blueChipAssets, 'ppix50');
  }

  // PPIx 100 - The "Comic NASDAQ" - Growth and Modern Characters  
  async calculatePPIx100(assets: any[]): Promise<IndexCalculation> {
    console.log('Calculating PPIx 100 (Growth Comic Index)...');
    
    // Define growth criteria
    const growthAssets = assets
      .filter(asset => {
        // Focus on modern characters, rising stars, and volatile assets
        const isModernCharacter = this.isModernCharacter(asset);
        const hasGrowthPotential = this.hasGrowthPotential(asset);
        const hasMarketVolume = (asset.volume || 0) > 10000;
        
        return (isModernCharacter || hasGrowthPotential) && hasMarketVolume;
      })
      .sort((a, b) => {
        // Sort by volatility and recent performance
        const aVolatility = Math.abs((a.changePercent || 0));
        const bVolatility = Math.abs((b.changePercent || 0));
        return bVolatility - aVolatility;
      })
      .slice(0, 100); // Top 100 growth assets

    return this.calculateIndexValue(growthAssets, 'ppix100');
  }

  // Calculate weighted index value
  private calculateIndexValue(constituents: any[], indexType: 'ppix50' | 'ppix100'): IndexCalculation {
    const totalMarketCap = constituents.reduce((sum, asset) => sum + (asset.marketCap || 0), 0);
    
    // Calculate weights based on market cap (like S&P 500)
    const weightedConstituents: IndexConstituent[] = constituents.map(asset => ({
      assetId: asset.id || asset.symbol,
      symbol: asset.symbol,
      name: asset.name,
      weight: totalMarketCap > 0 ? ((asset.marketCap || 0) / totalMarketCap) * 100 : 100 / constituents.length,
      marketCap: asset.marketCap || 0,
      significance: asset.significance || 0,
      category: asset.category || 'character'
    }));

    // Calculate index value (price-weighted like DOW, but with market cap adjustments)
    let indexValue = 0;
    let totalChange = 0;
    let totalVolume = 0;

    weightedConstituents.forEach(constituent => {
      const asset = constituents.find(a => a.symbol === constituent.symbol);
      if (asset) {
        indexValue += (asset.price || 0) * (constituent.weight / 100);
        totalChange += (asset.change || 0) * (constituent.weight / 100);
        totalVolume += asset.volume || 0;
      }
    });

    const dayChangePercent = indexValue > 0 ? (totalChange / indexValue) * 100 : 0;
    
    // Simulate week change (normally would come from historical data)
    const weekChange = totalChange * (1.2 + Math.random() * 2.6); // 1.2x to 3.8x daily change
    
    const now = new Date();
    const nextRebalance = new Date(now);
    nextRebalance.setMonth(nextRebalance.getMonth() + 1); // Monthly rebalancing

    return {
      currentValue: Math.round(indexValue * 100) / 100,
      dayChange: Math.round(totalChange * 100) / 100,
      dayChangePercent: Math.round(dayChangePercent * 100) / 100,
      weekChange: Math.round(weekChange * 100) / 100,
      volume: totalVolume,
      constituents: weightedConstituents,
      lastRebalance: now,
      nextRebalance
    };
  }

  // Identify major characters for PPIx 50
  private isMajorCharacter(asset: any): boolean {
    const majorCharacters = [
      'Spider-Man', 'Batman', 'Superman', 'Wonder Woman', 'Iron Man',
      'Captain America', 'Hulk', 'Thor', 'Wolverine', 'Deadpool',
      'X-Men', 'Avengers', 'Justice League', 'Fantastic Four',
      'Flash', 'Green Lantern', 'Aquaman', 'Catwoman', 'Joker',
      'Captain Marvel', 'Black Widow', 'Doctor Strange', 'Daredevil',
      'Punisher', 'Green Arrow', 'Harley Quinn', 'Venom', 'Carnage'
    ];

    const name = asset.name?.toLowerCase() || '';
    return majorCharacters.some(major => 
      name.includes(major.toLowerCase()) || 
      asset.symbol?.toLowerCase().includes(major.toLowerCase())
    );
  }

  // Identify legendary creators for PPIx 50
  private isLegendaryCreator(asset: any): boolean {
    const legendaryCreators = [
      'Stan Lee', 'Jack Kirby', 'Steve Ditko', 'John Byrne', 'Frank Miller',
      'Alan Moore', 'Grant Morrison', 'Neil Gaiman', 'Todd McFarlane',
      'Jim Lee', 'Rob Liefeld', 'Chris Claremont', 'Will Eisner'
    ];

    const name = asset.name?.toLowerCase() || '';
    return asset.category === 'creator' && legendaryCreators.some(creator => 
      name.includes(creator.toLowerCase())
    );
  }

  // Identify modern characters for PPIx 100
  private isModernCharacter(asset: any): boolean {
    const modernCharacters = [
      'Miles Morales', 'Kamala Khan', 'Kate Bishop', 'America Chavez',
      'Moon Girl', 'Ironheart', 'Spider-Gwen', 'Silk', 'Spider-Woman',
      'Captain Marvel', 'Falcon', 'Winter Soldier', 'War Machine',
      'Ant-Man', 'Wasp', 'Gamora', 'Rocket', 'Groot', 'Star-Lord',
      'Deadpool', 'Domino', 'Cable', 'X-23', 'Old Man Logan'
    ];

    const name = asset.name?.toLowerCase() || '';
    return modernCharacters.some(modern => 
      name.includes(modern.toLowerCase())
    );
  }

  // Check growth potential indicators
  private hasGrowthPotential(asset: any): boolean {
    // High volatility = growth potential
    const hasHighVolatility = Math.abs(asset.changePercent || 0) > 5;
    
    // Rising volume = interest
    const hasRisingVolume = (asset.volume || 0) > 15000;
    
    // Media presence = future growth
    const hasMediaTies = this.hasMediaPresence(asset);
    
    // New or emerging characters
    const isEmerging = (asset.significance || 0) >= 60 && (asset.significance || 0) < 85;
    
    return hasHighVolatility || hasRisingVolume || hasMediaTies || isEmerging;
  }

  // Check for media presence (MCU, TV shows, upcoming movies)
  private hasMediaPresence(asset: any): boolean {
    const mediaCharacters = [
      'Shang-Chi', 'Eternals', 'Black Panther', 'Captain Marvel',
      'Wanda', 'Vision', 'Loki', 'Falcon', 'Winter Soldier',
      'Hawkeye', 'Moon Knight', 'She-Hulk', 'Ms. Marvel',
      'Guardians', 'Ant-Man', 'Wasp', 'Doctor Strange'
    ];

    const name = asset.name?.toLowerCase() || '';
    return mediaCharacters.some(media => 
      name.includes(media.toLowerCase())
    );
  }

  // Get index methodology explanation
  getIndexMethodology(indexType: 'ppix50' | 'ppix100'): string {
    if (indexType === 'ppix50') {
      return `The PPIx 50 is a market-capitalization weighted index of the 50 most significant and stable comic book assets, similar to the Dow Jones Industrial Average. It includes major superhero characters, legendary creators, and blue-chip publishers that represent the foundation of the comic book market. Assets are selected based on cultural significance (80+ rating), market stability (>$1000 price), and historical importance. The index is rebalanced monthly to maintain representation of the most valuable and stable comic assets.`;
    } else {
      return `The PPIx 100 is a market-capitalization weighted index of 100 growth-oriented comic book assets, similar to the NASDAQ-100. It focuses on modern characters, emerging creators, and volatile assets with high growth potential. Selection criteria include market volatility (>5% daily moves), trading volume (>10K), media presence, and emerging significance (60-85 rating). This index captures the dynamic and speculative side of comic investing, featuring characters with movie/TV tie-ins and rising market interest. Rebalanced monthly to reflect changing market trends.`;
    }
  }

  // Generate index comparison data (vs other indices)
  generateIndexComparison(ppix50: IndexCalculation, ppix100: IndexCalculation): any {
    return {
      ppix50: {
        name: 'PPIx 50 (Blue Chip)',
        value: ppix50.currentValue,
        change: ppix50.dayChange,
        changePercent: ppix50.dayChangePercent,
        description: 'Stable, high-value comic assets',
        riskLevel: 'Low',
        constituents: ppix50.constituents.length
      },
      ppix100: {
        name: 'PPIx 100 (Growth)',
        value: ppix100.currentValue,
        change: ppix100.dayChange,
        changePercent: ppix100.dayChangePercent,
        description: 'High-growth, volatile comic assets',
        riskLevel: 'High',
        constituents: ppix100.constituents.length
      },
      comparison: {
        correlation: this.calculateCorrelation(ppix50, ppix100),
        betaRatio: ppix100.currentValue / ppix50.currentValue,
        volatilitySpread: Math.abs(ppix100.dayChangePercent) - Math.abs(ppix50.dayChangePercent)
      }
    };
  }

  private calculateCorrelation(index1: IndexCalculation, index2: IndexCalculation): number {
    // Simplified correlation calculation
    // In production, this would use historical data
    const vol1 = Math.abs(index1.dayChangePercent);
    const vol2 = Math.abs(index2.dayChangePercent);
    
    // Higher volatility difference = lower correlation
    const volDiff = Math.abs(vol1 - vol2);
    return Math.max(0.3, 1 - (volDiff / 10)); // 0.3 to 1.0 range
  }
}

export const ppixIndexService = new PPIxIndexService();