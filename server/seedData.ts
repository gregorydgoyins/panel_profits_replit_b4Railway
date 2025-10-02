import { storage } from './storage.js';
import type { InsertAsset, InsertAssetCurrentPrice, InsertMarketEvent } from '@shared/schema.js';

/**
 * Seed Data Generator for Panel Profits Market Simulation
 * Creates 5 comic character assets with realistic metadata and initial market data
 */

export const SEED_COMIC_ASSETS: InsertAsset[] = [
  {
    symbol: 'SPIDER',
    name: 'Spider-Man',
    type: 'character',
    description: 'The friendly neighborhood Spider-Man - one of Marvel\'s most iconic characters',
    imageUrl: '/assets/stock_images/spider-man_comic_boo_155e6aae.jpg',
    metadata: {
      publisher: 'Marvel',
      firstAppearance: 'Amazing Fantasy #15 (1962)',
      creator: 'Stan Lee, Steve Ditko',
      popularity: '0.95',
      rarity: '0.3',
      movieAppearances: 10,
      comicSales: 500000000,
      fanRating: 9.2,
      universeImportance: 'high',
      totalSupply: 500000,
      marketSegment: 'superhero'
    }
  },
  {
    symbol: 'BATMAN',
    name: 'Batman',
    type: 'character',
    description: 'The Dark Knight of Gotham City - DC\'s legendary caped crusader',
    imageUrl: '/assets/stock_images/batman_comic_book_co_054b939e.jpg',
    metadata: {
      publisher: 'DC',
      firstAppearance: 'Detective Comics #27 (1939)',
      creator: 'Bob Kane, Bill Finger',
      popularity: '0.93',
      rarity: '0.25',
      movieAppearances: 15,
      comicSales: 600000000,
      fanRating: 9.4,
      universeImportance: 'high',
      totalSupply: 400000,
      marketSegment: 'superhero'
    }
  },
  {
    symbol: 'XMEN',
    name: 'X-Men',
    type: 'character',
    description: 'Marvel\'s mutant superhero team fighting for peaceful coexistence',
    imageUrl: '/assets/stock_images/x-men_comic_book_cov_4df97e0a.jpg',
    metadata: {
      publisher: 'Marvel',
      firstAppearance: 'X-Men #1 (1963)',
      creator: 'Stan Lee, Jack Kirby',
      popularity: '0.88',
      rarity: '0.4',
      movieAppearances: 12,
      comicSales: 400000000,
      fanRating: 8.9,
      universeImportance: 'high',
      totalSupply: 600000,
      marketSegment: 'superhero'
    }
  },
  {
    symbol: 'AVENG',
    name: 'The Avengers',
    type: 'character',
    description: 'Earth\'s Mightiest Heroes assembled to face threats no single hero could handle',
    imageUrl: '/assets/stock_images/avengers_comic_book__cc39d6cd.jpg',
    metadata: {
      publisher: 'Marvel',
      firstAppearance: 'The Avengers #1 (1963)',
      creator: 'Stan Lee, Jack Kirby',
      popularity: '0.92',
      rarity: '0.35',
      movieAppearances: 8,
      comicSales: 450000000,
      fanRating: 9.1,
      universeImportance: 'high',
      totalSupply: 550000,
      marketSegment: 'superhero'
    }
  },
  {
    symbol: 'WOLVR',
    name: 'Wolverine',
    type: 'character',
    description: 'The adamantium-clawed mutant with a mysterious past and healing factor',
    imageUrl: '/assets/wolverine_placeholder.jpg',
    metadata: {
      publisher: 'Marvel',
      firstAppearance: 'The Incredible Hulk #180 (1974)',
      creator: 'Roy Thomas, Len Wein, John Romita Sr.',
      popularity: '0.85',
      rarity: '0.45',
      movieAppearances: 9,
      comicSales: 300000000,
      fanRating: 8.7,
      universeImportance: 'high',
      totalSupply: 450000,
      marketSegment: 'superhero'
    }
  }
];

export const SEED_MARKET_EVENTS: InsertMarketEvent[] = [
  {
    title: 'Spider-Man: No Way Home Record Box Office',
    description: 'The latest Spider-Man film breaks opening weekend records, driving massive interest in Spider-Man related properties.',
    category: 'movie_release',
    impact: 'positive',
    significance: 9,
    affectedAssets: [], // Will be filled after assets are created
    eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isActive: true
  },
  {
    title: 'Comic-Con International Announces Record Attendance',
    description: 'San Diego Comic-Con reports highest attendance in history, boosting overall market sentiment for comic properties.',
    category: 'comic_convention',
    impact: 'positive',
    significance: 7,
    affectedAssets: [], // Will affect all assets
    eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isActive: true
  },
  {
    title: 'Marvel Studios Announces Phase 5 Slate',
    description: 'Marvel Studios reveals ambitious Phase 5 plans including multiple character debuts and returning favorites.',
    category: 'publisher_announcement',
    impact: 'positive',
    significance: 8,
    affectedAssets: [], // Will be filled with Marvel assets
    eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isActive: true
  },
  {
    title: 'DC Comics Restructuring Concerns',
    description: 'Industry reports suggest potential restructuring at DC Comics, creating uncertainty around future projects.',
    category: 'publisher_announcement',
    impact: 'negative',
    significance: 6,
    affectedAssets: [], // Will be filled with DC assets
    eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isActive: true
  }
];

/**
 * Seed the database with initial comic character assets and market data
 */
export async function seedMarketData(): Promise<void> {
  console.log('🌱 Starting market data seeding...');
  
  try {
    // Create assets
    const createdAssets = [];
    for (const assetData of SEED_COMIC_ASSETS) {
      const existingAsset = await storage.getAssetBySymbol(assetData.symbol);
      if (!existingAsset) {
        const asset = await storage.createAsset(assetData);
        createdAssets.push(asset);
        console.log(`✅ Created asset: ${asset.symbol} - ${asset.name}`);
      } else {
        createdAssets.push(existingAsset);
        console.log(`♻️ Asset already exists: ${existingAsset.symbol} - ${existingAsset.name}`);
      }
    }

    // Create initial asset prices
    for (const asset of createdAssets) {
      const existingPrice = await storage.getAssetCurrentPrice(asset.id);
      if (!existingPrice) {
        const metadata = asset.metadata as any;
        
        // Generate realistic initial prices based on popularity and rarity (max 999.99)
        const basePrice = 20; // Base price for characters
        const popularityMultiplier = 0.5 + (parseFloat(metadata.popularity) || 0.5) * 1.5;
        const rarityMultiplier = 0.8 + (parseFloat(metadata.rarity) || 0.5) * 0.4;
        const randomVariation = 0.8 + Math.random() * 0.4; // ±20% random
        
        const price = Math.min(999.99, basePrice * popularityMultiplier * rarityMultiplier * randomVariation);
        const spread = price * 0.002; // 0.2% spread
        
        const priceData: InsertAssetCurrentPrice = {
          assetId: asset.id,
          currentPrice: price.toFixed(2),
          bidPrice: Math.max(0.01, price - spread).toFixed(2),
          askPrice: Math.min(999.99, price + spread).toFixed(2),
          volume: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 volume
          volatility: (0.02 + Math.random() * 0.03).toFixed(4), // 2-5% volatility
          marketStatus: 'open',
          priceSource: 'simulation',
          dayChange: '0.00',
          dayChangePercent: '0.00',
          weekHigh: Math.min(999.99, price * 1.1).toFixed(2),
          lastTradePrice: price.toFixed(2),
          lastTradeTime: new Date(),
        };
        
        await storage.createAssetCurrentPrice(priceData);
        console.log(`💰 Set initial price for ${asset.symbol}: $${price.toFixed(2)}`);
      } else {
        console.log(`💰 Price already exists for ${asset.symbol}: $${existingPrice.currentPrice}`);
      }
    }

    // Create market events
    const assetIds = createdAssets.map(a => a.id);
    const marvelAssets = createdAssets.filter(a => (a.metadata as any)?.publisher === 'Marvel').map(a => a.id);
    const dcAssets = createdAssets.filter(a => (a.metadata as any)?.publisher === 'DC').map(a => a.id);
    const spiderManAsset = createdAssets.find(a => a.symbol === 'SPIDER')?.id;

    // Update event affected assets
    SEED_MARKET_EVENTS[0].affectedAssets = spiderManAsset ? [spiderManAsset] : []; // Spider-Man movie
    SEED_MARKET_EVENTS[1].affectedAssets = assetIds; // Comic-Con affects all
    SEED_MARKET_EVENTS[2].affectedAssets = marvelAssets; // Marvel announcement
    SEED_MARKET_EVENTS[3].affectedAssets = dcAssets; // DC concerns

    for (const eventData of SEED_MARKET_EVENTS) {
      const event = await storage.createMarketEvent(eventData);
      console.log(`📰 Created market event: ${event.title}`);
    }

    console.log('✅ Market data seeding completed successfully!');
    console.log(`📊 Created ${createdAssets.length} assets and ${SEED_MARKET_EVENTS.length} market events`);
    
  } catch (error) {
    console.error('❌ Error seeding market data:', error);
    throw error;
  }
}

/**
 * Generate historical market data for testing
 */
export async function generateHistoricalData(): Promise<void> {
  console.log('📈 Generating historical market data...');
  
  try {
    const assets = await storage.getAssets({ limit: 100 });
    const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
    
    for (const asset of assets.slice(0, 5)) { // Only for seed assets
      console.log(`Generating history for ${asset.symbol}...`);
      
      const currentPrice = await storage.getAssetCurrentPrice(asset.id);
      if (!currentPrice) continue;
      
      const price = parseFloat(currentPrice.currentPrice);
      const volatility = parseFloat(currentPrice.volatility || '0.025');
      
      // Generate 30 days of daily data
      for (let i = 30; i >= 1; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        
        // Generate OHLC with random walk (ensure values stay within limits)
        const dailyChange = (Math.random() - 0.5) * volatility * price;
        const open = Math.min(999.99, Math.max(0.01, price + dailyChange));
        const intraRange = price * volatility * 0.5;
        const high = Math.min(999.99, open + Math.random() * intraRange);
        const low = Math.max(0.01, open - Math.random() * intraRange);
        const close = Math.min(999.99, Math.max(0.01, low + Math.random() * (high - low)));
        
        const change = close - open;
        const percentChange = Math.min(999.99, Math.max(-999.99, (change / open * 100)));
        
        const marketData = {
          assetId: asset.id,
          timeframe: '1d',
          periodStart: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          open: open.toFixed(2),
          high: high.toFixed(2),
          low: low.toFixed(2),
          close: close.toFixed(2),
          volume: Math.floor(Math.random() * 10000) + 5000,
          change: change.toFixed(2),
          percentChange: percentChange.toFixed(2),
        };
        
        await storage.createMarketData(marketData);
      }
    }
    
    console.log('✅ Historical data generation completed!');
  } catch (error) {
    console.error('❌ Error generating historical data:', error);
    throw error;
  }
}