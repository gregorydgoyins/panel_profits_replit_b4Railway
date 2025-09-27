// Mock API for simulating real-time market data and trading operations
import { Character } from '../types';
import { allCharacters } from './characterData';
import { allCreators } from './creatorData';
import { allBonds } from './bondData';
import { allFunds } from './fundData';
import { allLocations } from './locationData';
import { gadgets } from './gadgetData';
import { allETFs } from './etfData';

// Market state for tracking real-time changes
let marketState = {
  lastUpdate: new Date(),
  volatility: 0.025,
  sentiment: 0.15,
  trend: 'bull' as 'bull' | 'bear' | 'sideways'
};

// News impact handler
export function applyNewsImpact(newsData: {
  impact: 'positive' | 'negative' | 'neutral';
  relatedSecurity: {
    type: 'comic' | 'creator' | 'publisher' | 'option';
    symbol: string;
    name: string;
  };
}) {
  console.log('Applying news impact:', newsData);
  
  // Adjust market sentiment based on news impact
  if (newsData.impact === 'positive') {
    marketState.sentiment = Math.min(1, marketState.sentiment + 0.05);
  } else if (newsData.impact === 'negative') {
    marketState.sentiment = Math.max(-1, marketState.sentiment - 0.05);
  }
  
  // Update last update time
  marketState.lastUpdate = new Date();
}

// Generate realistic 24-hour intraday data with proper OHLC structure
function generateIntradayData(selectedDate: Date): any[] {
  const data = [];
  const baseDate = new Date(selectedDate);
  baseDate.setHours(0, 0, 0, 0); // Start at midnight
  
  // Base CMI value for the selected date (varies by date for historical context)
  const dateHash = baseDate.getTime() / (1000 * 60 * 60 * 24);
  const baseCMI = 14000 + (dateHash % 1000); // Varies between 14000-15000 based on date
  
  // Generate 48 data points (30-minute intervals) for full 24-hour coverage
  for (let i = 0; i < 48; i++) {
    const timestamp = new Date(baseDate);
    timestamp.setMinutes(i * 30); // 30-minute intervals
    
    const hour = timestamp.getHours() + timestamp.getMinutes() / 60;
    
    // Determine market session
    let marketSession = 'after-hours';
    if (hour >= 20 || hour < 5) marketSession = 'tokyo';
    else if (hour >= 3 && hour < 12) marketSession = 'london';
    else if (hour >= 9.5 && hour < 16) marketSession = 'new-york';
    else if (hour >= 16 && hour < 20) marketSession = 'after-hours';
    else if (hour >= 4 && hour < 9.5) marketSession = 'pre-market';
    
    // Session-based volatility (higher during active sessions)
    const sessionVolatility = marketSession === 'new-york' ? 0.008 : 
                             marketSession === 'london' ? 0.006 :
                             marketSession === 'tokyo' ? 0.004 : 0.002;
    
    // Generate OHLC data with realistic patterns
    const previousClose = i === 0 ? baseCMI : data[i - 1].close;
    const gapFactor = i === 0 ? 0 : (Math.random() - 0.5) * 0.002; // Small overnight gap
    
    const open = previousClose * (1 + gapFactor);
    const volatilityRange = open * sessionVolatility;
    
    const high = open + Math.random() * volatilityRange * 2;
    const low = open - Math.random() * volatilityRange * 2;
    const close = low + Math.random() * (high - low);
    
    // Volume patterns (higher during active sessions)
    const baseVolume = marketSession === 'new-york' ? 2500 :
                      marketSession === 'london' ? 1800 :
                      marketSession === 'tokyo' ? 1200 : 600;
    const volume = baseVolume + Math.random() * 1000;
    
    // Technical indicators (simplified calculations)
    const sma30 = i >= 30 ? data.slice(Math.max(0, i - 30), i).reduce((sum, d) => sum + d.close, 0) / Math.min(30, i) : close;
    const sma60 = i >= 60 ? data.slice(Math.max(0, i - 60), i).reduce((sum, d) => sum + d.close, 0) / Math.min(60, i) : close;
    const sma90 = i >= 90 ? data.slice(Math.max(0, i - 90), i).reduce((sum, d) => sum + d.close, 0) / Math.min(90, i) : close;
    const sma50 = i >= 50 ? data.slice(Math.max(0, i - 50), i).reduce((sum, d) => sum + d.close, 0) / Math.min(50, i) : close;
    const sma200 = i >= 200 ? data.slice(Math.max(0, i - 200), i).reduce((sum, d) => sum + d.close, 0) / Math.min(200, i) : close;
    
    // Bollinger Bands (20-period)
    const period = Math.min(20, i + 1);
    const recentPrices = data.slice(Math.max(0, i - period + 1), i).map(d => d.close).concat([close]);
    const sma20 = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma20, 2), 0) / recentPrices.length;
    const stdDev = Math.sqrt(variance);
    
    const bollingerUpper = sma20 + (2 * stdDev);
    const bollingerMiddle = sma20;
    const bollingerLower = sma20 - (2 * stdDev);
    
    // MACD calculation (simplified)
    const ema12 = i >= 12 ? close * 0.15 + (data[i - 1]?.ema12 || close) * 0.85 : close;
    const ema26 = i >= 26 ? close * 0.075 + (data[i - 1]?.ema26 || close) * 0.925 : close;
    const macd = ema12 - ema26;
    const macdSignal = i >= 9 ? macd * 0.2 + (data[i - 1]?.macdSignal || macd) * 0.8 : macd;
    const macdHistogram = macd - macdSignal;
    
    // RSI calculation (simplified)
    const rsi = 30 + Math.random() * 40; // Random between 30-70
    
    // Stochastic Oscillator calculation (simplified)
    const stochasticK = Math.random() * 100;
    const stochasticD = i >= 3 ? (stochasticK + (data[i - 1]?.stochasticK || stochasticK) + (data[i - 2]?.stochasticK || stochasticK)) / 3 : stochasticK;
    
    // On-Balance Volume calculation (simplified)
    const obvChange = close > (data[i - 1]?.close || close) ? volume : -volume;
    const obv = (data[i - 1]?.obv || 0) + obvChange;
    
    // Average True Range calculation (simplified)
    const trueRange = Math.max(high - low, Math.abs(high - (data[i - 1]?.close || open)), Math.abs(low - (data[i - 1]?.close || open)));
    const atr = i >= 14 ? (data[i - 1]?.atr || trueRange) * 0.93 + trueRange * 0.07 : trueRange;
    
    // Williams %R calculation (simplified)
    const williams_r = -Math.random() * 100;
    
    // CCI calculation (simplified)
    const cci = (Math.random() - 0.5) * 400;
    
    // ADX calculation (simplified)
    const adx = 20 + Math.random() * 60;
    
    // Parabolic SAR calculation (simplified)
    const parabolicSar = close * (0.98 + Math.random() * 0.04);
    
    // Support and Resistance levels (simplified)
    const support = low - volatilityRange * 0.5;
    const resistance = high + volatilityRange * 0.5;
    
    // Fibonacci levels
    const fibonacciLevels = {
      '23.6': low + (high - low) * 0.236,
      '38.2': low + (high - low) * 0.382,
      '50.0': low + (high - low) * 0.5,
      '61.8': low + (high - low) * 0.618,
      '78.6': low + (high - low) * 0.786
    };
    
    // Historical events for specific times/dates
    let event = null;
    let eventUrl = null;
    let marginCallAlert = false;
    
    // Add margin call alert at 3:30 PM
    if (hour === 15.5) {
      marginCallAlert = true;
    }
    
    // Historical events based on date and time
    if (selectedDate.getFullYear() === 2024) {
      if (selectedDate.getMonth() === 0 && selectedDate.getDate() === 15 && hour === 10) {
        event = "Marvel announces new Spider-Man series launch";
        eventUrl = "https://marvel.com/news";
      } else if (selectedDate.getMonth() === 2 && selectedDate.getDate() === 20 && hour === 14) {
        event = "DC Comics reports record quarterly earnings";
        eventUrl = "https://dccomics.com/news";
      } else if (selectedDate.getMonth() === 5 && selectedDate.getDate() === 10 && hour === 9) {
        event = "Image Comics IPO announcement";
        eventUrl = "https://imagecomics.com/news";
      }
    } else if (selectedDate.getFullYear() === 2023) {
      if (selectedDate.getMonth() === 6 && selectedDate.getDate() === 4 && hour === 11) {
        event = "Comic-Con International announces major partnerships";
        eventUrl = "https://comic-con.org/news";
      } else if (selectedDate.getMonth() === 9 && selectedDate.getDate() === 31 && hour === 16) {
        event = "Halloween comic sales surge reported";
        eventUrl = "https://comicbook.com/news";
      }
    }
    
    data.push({
      date: timestamp.toISOString(),
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      value: Math.round(close), // For compatibility with non-1d views
      volume: Math.round(volume),
      marketSession,
      sma30: Math.round(sma30),
      sma60: Math.round(sma60),
      sma90: Math.round(sma90),
      sma20: Math.round(sma20),
      sma50: Math.round(sma50),
      sma200: Math.round(sma200),
      bollingerUpper: Math.round(bollingerUpper),
      bollingerMiddle: Math.round(bollingerMiddle),
      bollingerLower: Math.round(bollingerLower),
      macd: parseFloat(macd.toFixed(2)),
      macdSignal: parseFloat(macdSignal.toFixed(2)),
      macdHistogram: parseFloat(macdHistogram.toFixed(2)),
      ema12: Math.round(ema12),
      ema26: Math.round(ema26),
      rsi: parseFloat(rsi.toFixed(2)),
      stochasticK: parseFloat(stochasticK.toFixed(2)),
      stochasticD: parseFloat(stochasticD.toFixed(2)),
      obv: Math.round(obv),
      atr: parseFloat(atr.toFixed(2)),
      williams_r: parseFloat(williams_r.toFixed(2)),
      cci: parseFloat(cci.toFixed(2)),
      adx: parseFloat(adx.toFixed(2)),
      parabolicSar: Math.round(parabolicSar),
      support: Math.round(support),
      resistance: Math.round(resistance),
      fibonacciLevels,
      event,
      eventUrl,
      marginCallAlert
    });
  }
  
  return data;
}

// Generate comprehensive historical data for technical analysis
export const generateHistoricalData = (
  symbol: string, 
  timeRange: string, 
  year?: number
): MarketDataPoint[] => {
  const data: MarketDataPoint[] = [];
  const now = new Date();
  let startDate = new Date();
  let interval = 'day';
  let points = 0;

  // Extended date ranges including 20-year historical data
  switch (timeRange) {
    case '1d':
      startDate.setDate(now.getDate() - 1);
      interval = 'hour';
      points = 24;
      break;
    case '1w':
      startDate.setDate(now.getDate() - 7);
      interval = 'day';
      points = 7;
      break;
    case '1m':
      startDate.setMonth(now.getMonth() - 1);
      interval = 'day';
      points = 30;
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      interval = 'day';
      points = 365;
      break;
    case '5y':
      startDate.setFullYear(now.getFullYear() - 5);
      interval = 'week';
      points = 260;
      break;
    case '10y':
      startDate.setFullYear(now.getFullYear() - 10);
      interval = 'week';
      points = 520;
      break;
    case 'all': // 20-year historical data
      startDate.setFullYear(now.getFullYear() - 20);
      interval = 'month';
      points = 240; // 20 years * 12 months
      break;
  }

  // Return empty array as placeholder
  return [];
}

// Generate longer-term historical data
// MockApi class that encapsulates all data fetching and trading operations
class MockApi {
  // Persistent asset data to prevent blinking
  private _allAssets: any[] = [];
  private _lastPriceUpdate: number = 0;
  private _updateInterval: number = 5000; // Update prices every 5 seconds

  // Market state for tracking real-time changes
  private marketState = {
    lastUpdate: new Date(),
    volatility: 0.025,
    sentiment: 0.15,
    trend: 'bull' as 'bull' | 'bear' | 'sideways'
  };

  constructor() {
    this._initializeAssets();
  }

  // Initialize all assets once to prevent recreation
  private _initializeAssets() {
    console.log('MockApi: Initializing persistent asset data...');
    
    // Import all asset data
    const allAssets = [];
    
    // Add all characters
    allAssets.push(...allCharacters.map(c => ({ 
      ...c, 
      type: 'character',
      nav: c.price,
      link: `/character/${c.symbol}`,
      originalPrice: c.price // Store original for realistic updates
    })));
    
    // Add all creators
    allAssets.push(...allCreators.map(c => ({ 
      ...c, 
      type: 'creator',
      nav: c.price,
      link: `/creator/${c.symbol}`,
      originalPrice: c.price
    })));
    
    // Add all bonds  
    allAssets.push(...allBonds.map(b => ({ 
      ...b, 
      type: 'bond',
      nav: b.price,
      currentPrice: b.price,
      percentageChange: b.percentageChange,
      link: `/bond/${b.symbol}`,
      originalPrice: b.price
    })));
    
    // Add all funds
    allAssets.push(...allFunds.map(f => ({ 
      ...f, 
      type: 'fund',
      price: f.nav,
      currentPrice: f.nav,
      percentageChange: f.percentageChange,
      link: `/fund/${f.symbol}`,
      originalPrice: f.nav
    })));
    
    // Add all locations
    allAssets.push(...allLocations.map(l => ({ 
      ...l, 
      type: 'location',
      nav: l.price,
      link: `/location/${l.symbol}`,
      originalPrice: l.price
    })));
    
    // Add all gadgets
    allAssets.push(...gadgets.map(g => ({ 
      ...g, 
      type: 'gadget',
      nav: g.price,
      link: `/gadget/${g.symbol}`,
      originalPrice: g.price
    })));
    
    // Add all ETFs
    allAssets.push(...allETFs.map(e => ({ 
      ...e, 
      type: 'etf',
      price: e.nav,
      currentPrice: e.nav,
      percentageChange: e.percentageChange,
      link: `/trading/${e.symbol}`,
      originalPrice: e.nav
    })));
    
    // Add mock options data
    const mockOptions = [
      {
        id: 'opt-1',
        symbol: 'ASM300-C2600',
        name: 'ASM300 Call $2600',
        type: 'option',
        price: 150,
        change: 12,
        percentageChange: 8.7,
        volume: 320,
        marketCap: 50000,
        rating: 'Buy',
        link: `/trading/options/calls`,
        originalPrice: 150,
        optionType: 'call',
        strike: 2600,
        expiry: '2024-09-20'
      },
      {
        id: 'opt-2',
        symbol: 'BATM-P4000',
        name: 'Batman Put $4000',
        type: 'option',
        price: 180,
        change: -8,
        percentageChange: -4.3,
        volume: 250,
        marketCap: 45000,
        rating: 'Hold',
        link: `/trading/options/puts`,
        originalPrice: 180,
        optionType: 'put',
        strike: 4000,
        expiry: '2024-09-20'
      },
      {
        id: 'opt-3',
        symbol: 'SPDR-C3800',
        name: 'Spider-Man Call $3800',
        type: 'option',
        price: 220,
        change: 18,
        percentageChange: 8.9,
        volume: 480,
        marketCap: 105000,
        rating: 'Strong Buy',
        link: `/trading/options/calls`,
        originalPrice: 220,
        optionType: 'call',
        strike: 3800,
        expiry: '2024-12-20'
      },
      {
        id: 'opt-4',
        symbol: 'TMFS-C2000',
        name: 'McFarlane Call $2000',
        type: 'option',
        price: 95,
        change: 6,
        percentageChange: 6.7,
        volume: 180,
        marketCap: 17000,
        rating: 'Buy',
        link: `/trading/options/calls`,
        originalPrice: 95,
        optionType: 'call',
        strike: 2000,
        expiry: '2025-01-17'
      },
      {
        id: 'opt-5',
        symbol: 'WNDR-P3500',
        name: 'Wonder Woman Put $3500',
        type: 'option',
        price: 165,
        change: -12,
        percentageChange: -6.8,
        volume: 290,
        marketCap: 48000,
        rating: 'Hold',
        link: `/trading/options/puts`,
        originalPrice: 165,
        optionType: 'put',
        strike: 3500,
        expiry: '2024-12-20'
      }
    ];
    
    allAssets.push(...mockOptions);
    
    // Shuffle array to ensure good distribution of asset types
    this._allAssets = allAssets.sort(() => Math.random() - 0.5);
    
    console.log(`MockApi: Initialized ${this._allAssets.length} assets including options`);
  }

  // Simulate realistic price changes for all assets
  private _simulatePriceChanges() {
    const now = Date.now();
    if (now - this._lastPriceUpdate < this._updateInterval) {
      return; // Don't update too frequently
    }
    
    this._lastPriceUpdate = now;
    
    this._allAssets.forEach(asset => {
      if (!asset.originalPrice) asset.originalPrice = asset.price || asset.nav || 100;
      
      // Generate realistic price movement based on asset type
      let volatility = 0.002; // Base volatility
      
      switch (asset.type) {
        case 'character':
          volatility = 0.003;
          break;
        case 'creator':
          volatility = 0.0025;
          break;
        case 'bond':
          volatility = 0.0005; // Bonds are less volatile
          break;
        case 'fund':
          volatility = 0.002;
          break;
        case 'option':
          volatility = 0.008; // Options are more volatile
          break;
        case 'etf':
          volatility = 0.0015;
          break;
        default:
          volatility = 0.002;
      }
      
      // Apply market sentiment
      const sentimentFactor = this.marketState.sentiment * 0.001;
      
      // Generate random price movement
      const randomChange = (Math.random() - 0.5) * volatility;
      const totalChange = randomChange + sentimentFactor;
      
      // Update price
      const oldPrice = asset.price || asset.nav || asset.originalPrice;
      const newPrice = oldPrice * (1 + totalChange);
      
      // Ensure minimum price
      const finalPrice = Math.max(newPrice, asset.originalPrice * 0.1);
      
      // Update asset properties
      if (asset.nav !== undefined) {
        asset.nav = finalPrice;
      }
      if (asset.price !== undefined) {
        asset.price = finalPrice;
      }
      if (asset.currentPrice !== undefined) {
        asset.currentPrice = finalPrice;
      }
      
      // Calculate change
      asset.change = finalPrice - oldPrice;
      asset.percentageChange = ((finalPrice - oldPrice) / oldPrice) * 100;
    });
  }

  // News impact handler
  applyNewsImpact(newsData: {
    impact: 'positive' | 'negative' | 'neutral';
    relatedSecurity: {
      type: 'comic' | 'creator' | 'publisher' | 'option';
      symbol: string;
      name: string;
    };
  }) {
    console.log('Applying news impact:', newsData);
    
    // Adjust market sentiment based on news impact
    if (newsData.impact === 'positive') {
      this.marketState.sentiment = Math.min(1, this.marketState.sentiment + 0.05);
    } else if (newsData.impact === 'negative') {
      this.marketState.sentiment = Math.max(-1, this.marketState.sentiment - 0.05);
    }
    
    // Update last update time
    this.marketState.lastUpdate = new Date();
  }

  // Enhanced market trend data API
  async fetchMarketTrendData(
    timeRange: '1d' | '1w' | '1m' | '1y' | '5y' | '10y' | 'all' = '1d',
    selectedYear: number = new Date().getFullYear(),
    startDate?: Date,
    endDate?: Date,
    selectedDate?: Date
  ): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      if (timeRange === '1d' && selectedDate) {
        // Generate detailed intraday data for specific date
        return generateIntradayData(selectedDate);
      } else if (timeRange === '1d') {
        // Generate intraday data for today
        return generateIntradayData(new Date());
      } else {
        // Generate historical data for longer timeframes
        return generateHistoricalData(timeRange as any, selectedYear);
      }
    } catch (error) {
      console.error('Error fetching market trend data:', error);
      throw new Error('Failed to fetch market trend data');
    }
  }

  // Portfolio performance data
  async fetchPortfolioPerformance(timeRange: string = '1y'): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const data = [];
    const points = timeRange === '1d' ? 24 : timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : 365;
    const baseValue = 50000;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (points - i));
      
      const trend = 0.0002; // Slight upward trend
      const volatility = 0.02;
      const value = baseValue * (1 + trend * i + (Math.random() - 0.5) * volatility);
      
      data.push({
        date: date.toISOString(),
        value: Math.round(value),
        change: i > 0 ? value - data[i - 1].value : 0
      });
    }
    
    return data;
  }

  // Asset performance data
  async fetchAssetPerformance(symbol: string, timeRange: string = '1y'): Promise<any[]> { // Removed unused parameter 'timeRange'
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Find the asset to get realistic base price
    const allAssets = this.getAllAssets();
    
    const asset = allAssets.find(a => a.symbol === symbol);
    const basePrice = asset?.currentPrice || 100;
    
    const data = [];
    const points = timeRange === '1d' ? 24 : timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : 365;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (points - i));
      
      const volatility = 0.03;
      const price = basePrice * (1 + (Math.random() - 0.5) * volatility * Math.sqrt(i + 1));
      
      data.push({
        date: date.toISOString(),
        price: Math.round(price * 100) / 100,
        volume: Math.round(Math.random() * 10000 + 1000)
      });
    }
    
    return data;
  }

  // Market news data
  async fetchMarketNews(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newsItems = [
      {
        id: '1',
        title: 'Marvel Studios Announces Phase 6 Expansion',
        summary: 'New character introductions expected to boost related comic valuations significantly.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        impact: 'positive' as const,
        relatedSecurity: {
          type: 'comic' as const,
          symbol: 'SPDR',
          name: 'Spider-Man'
        },
        source: 'Marvel News',
        url: 'https://marvel.com/news'
      },
      {
        id: '2',
        title: 'DC Comics Reports Record Q4 Earnings',
        summary: 'Strong performance across all character franchises, particularly Batman and Superman series.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        impact: 'positive' as const,
        relatedSecurity: {
          type: 'publisher' as const,
          symbol: 'DC',
          name: 'DC Comics'
        },
        source: 'DC Financial',
        url: 'https://dccomics.com/news'
      },
      {
        id: '3',
        title: 'Image Comics IPO Filing Submitted',
        summary: 'Independent publisher seeks public listing, could reshape comic book investment landscape.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        impact: 'neutral' as const,
        relatedSecurity: {
          type: 'publisher' as const,
          symbol: 'IMG',
          name: 'Image Comics'
        },
        source: 'Financial Times',
        url: 'https://ft.com/comics'
      },
      {
        id: '4',
        title: 'Vintage Comic Auction Sets New Records',
        summary: 'Action Comics #1 sells for $6.2M, indicating strong collector market fundamentals.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        impact: 'positive' as const,
        relatedSecurity: {
          type: 'comic' as const,
          symbol: 'SUPM',
          name: 'Superman'
        },
        source: 'Heritage Auctions',
        url: 'https://ha.com/news'
      },
      {
        id: '5',
        title: 'Digital Comics Platform Merger Announced',
        summary: 'ComiXology and Marvel Unlimited integration could impact digital distribution valuations.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        impact: 'neutral' as const,
        relatedSecurity: {
          type: 'option' as const,
          symbol: 'DIGI-C',
          name: 'Digital Comics ETF'
        },
        source: 'TechCrunch',
        url: 'https://techcrunch.com/comics'
      }
    ];
    
    return newsItems;
  }

  // Sector performance data
  async fetchSectorPerformance(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return [
      {
        name: 'Superhero Comics',
        performance: 12.5,
        volume: 2500000,
        marketCap: 15600000000,
        topAssets: ['SPDR', 'BTMN', 'SUPM']
      },
      {
        name: 'Independent Publishers',
        performance: 8.3,
        volume: 1200000,
        marketCap: 4200000000,
        topAssets: ['SAGA', 'WALK', 'INVN']
      },
      {
        name: 'Manga & Anime',
        performance: 15.7,
        volume: 1800000,
        marketCap: 8900000000,
        topAssets: ['NRTO', 'DBZK', 'ATCK']
      },
      {
        name: 'Vintage Collectibles',
        performance: 6.2,
        volume: 800000,
        marketCap: 12300000000,
        topAssets: ['AC1', 'FF1', 'XM1']
      },
      {
        name: 'Digital Platforms',
        performance: -2.1,
        volume: 950000,
        marketCap: 3100000000,
        topAssets: ['DIGI', 'WEBT', 'NFTS']
      }
    ];
  }

  // Trading volume data
  async fetchTradingVolume(timeRange: string = '1d'): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const data = [];
    const points = timeRange === '1d' ? 24 : timeRange === '1w' ? 7 : 30;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      if (timeRange === '1d') {
        date.setHours(date.getHours() - (points - i));
      } else {
        date.setDate(date.getDate() - (points - i));
      }
      
      const baseVolume = 50000;
      const volume = baseVolume + Math.random() * 30000;
      
      data.push({
        date: date.toISOString(),
        volume: Math.round(volume),
        trades: Math.round(volume / 25), // Average 25 shares per trade
      });
    }
    
    return data;
  }

  // Market depth data (order book)
  async fetchMarketDepth(symbol: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const asset = allCharacters.find(c => c.symbol === symbol) || allCharacters[0];
    const currentPrice = asset.currentPrice;
    
    const bids = [];
    const asks = [];
    
    // Generate realistic bid/ask spread
    for (let i = 0; i < 10; i++) {
      bids.push({
        price: currentPrice - (i + 1) * 0.25,
        quantity: Math.round(Math.random() * 1000 + 100),
        orders: Math.round(Math.random() * 5 + 1)
      });
      
      asks.push({
        price: currentPrice + (i + 1) * 0.25,
        quantity: Math.round(Math.random() * 1000 + 100),
        orders: Math.round(Math.random() * 5 + 1)
      });
    }
    
    return {
      symbol,
      bids: bids.sort((a, b) => b.price - a.price),
      asks: asks.sort((a, b) => a.price - b.price),
      spread: asks[0].price - bids[0].price,
      lastUpdate: new Date().toISOString()
    };
  }

  // Get all assets for search and filtering
  getAllAssets() {
    const allAssets = [];
    
    // Add all characters
    allAssets.push(...allCharacters.map(c => ({ 
      ...c, 
      type: 'character',
      nav: c.price, // For compatibility with fund structure
      link: `/character/${c.symbol}`
    })));
    
    // Add all creators
    allAssets.push(...allCreators.map(c => ({ 
      ...c, 
      type: 'creator',
      nav: c.price,
      link: `/creator/${c.symbol}`
    })));
    
    // Add all bonds  
    allAssets.push(...allBonds.map(b => ({ 
      ...b, 
      type: 'bond',
      nav: b.price,
      currentPrice: b.price,
      percentageChange: b.percentageChange,
      link: `/bond/${b.symbol}`
    })));
    
    // Add all funds
    allAssets.push(...allFunds.map(f => ({ 
      ...f, 
      type: 'fund',
      price: f.nav,
      currentPrice: f.nav,
      percentageChange: f.percentageChange,
      link: `/fund/${f.symbol}`
    })));
    
    // Add all locations
    allAssets.push(...allLocations.map(l => ({ 
      ...l, 
      type: 'location',
      nav: l.price,
      link: `/location/${l.symbol}`
    })));
    
    // Add all gadgets
    allAssets.push(...gadgets.map(g => ({ 
      ...g, 
      type: 'gadget',
      nav: g.price,
      link: `/gadget/${g.symbol}`
    })));
    
    // Add all ETFs
    allAssets.push(...allETFs.map(e => ({ 
      ...e, 
      type: 'etf',
      price: e.nav,
      currentPrice: e.nav,
      percentageChange: e.percentageChange,
      link: `/trading/${e.symbol}`
    })));
    
    return allAssets;
  }

  // Fetch assets with optional filtering
  async fetchAssets(type?: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate price changes on existing data instead of regenerating
    this._simulatePriceChanges();
    
    // Return copy of persistent assets
    const assets = [...this._allAssets];
    return type ? assets.filter(a => a.type === type) : assets;
  }

  // Fetch asset by symbol
  async fetchAssetBySymbol(symbol: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Simulate price changes and return from persistent data
    this._simulatePriceChanges();
    return this._allAssets.find(a => a.symbol === symbol);
  }

  // Execute trade
  async executeTrade(trade: {
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
  }): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      id: `trade-${Date.now()}`,
      ...trade,
      timestamp: new Date().toISOString(),
      status: 'executed',
      fees: trade.quantity * trade.price * 0.005 // 0.5% fee
    };
  }

  // Fetch portfolio holdings
  async fetchPortfolioHoldings(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [
      { symbol: 'SPDR', quantity: 100, avgCost: 45.20, currentPrice: 52.35 },
      { symbol: 'BTMN', quantity: 50, avgCost: 78.90, currentPrice: 85.40 },
      { symbol: 'SUPM', quantity: 75, avgCost: 92.10, currentPrice: 88.75 }
    ];
  }

  // Fetch portfolio summary
  async fetchPortfolioSummary(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      totalValue: 52000,
      dayChange: 1250,
      dayChangePercent: 2.45,
      totalReturn: 8500,
      totalReturnPercent: 19.5
    };
  }

  // Fetch market overview
  async fetchMarketOverview(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      cmi: 14250,
      change: 125,
      changePercent: 0.88,
      volume: 2500000,
      marketCap: 125000000000
    };
  }

  // Fetch market performance
  async fetchMarketPerformance(timeRange: string = '1d'): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return [
      {
        category: 'Superhero Comics',
        percentChange: 12.5 + (Math.random() - 0.5) * 5,
        volume: 2500000 + Math.random() * 500000
      },
      {
        category: 'Independent Publishers',
        percentChange: 8.3 + (Math.random() - 0.5) * 4,
        volume: 1200000 + Math.random() * 300000
      },
      {
        category: 'Manga & Anime',
        percentChange: 15.7 + (Math.random() - 0.5) * 6,
        volume: 1800000 + Math.random() * 400000
      },
      {
        category: 'Vintage Collectibles',
        percentChange: 6.2 + (Math.random() - 0.5) * 3,
        volume: 800000 + Math.random() * 200000
      },
      {
        category: 'Digital Platforms',
        percentChange: -2.1 + (Math.random() - 0.5) * 4,
        volume: 950000 + Math.random() * 250000
      }
    ];
  }

  // Fetch market insights
  async fetchMarketInsights(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [
      {
        type: 'trend',
        title: 'Superhero Comics Rally',
        description: 'Marvel and DC stocks showing strong momentum',
        confidence: 0.85
      },
      {
        type: 'alert',
        title: 'High Volume Activity',
        description: 'Trading volume 150% above average',
        confidence: 0.92
      }
    ];
  }

  // Search assets
  async searchAssets(query: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const assets = this.getAllAssets();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Fetch trading activities
  async fetchTradingActivities(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: '1',
        type: 'buy',
        symbol: 'SPDR',
        quantity: 25,
        price: 52.35,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'sell',
        symbol: 'BTMN',
        quantity: 10,
        price: 85.40,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Fetch upcoming events
  async fetchUpcomingEvents(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      {
        id: '1',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        title: 'Marvel Q4 Earnings',
        impact: 'high',
        type: 'earnings',
        relatedSymbols: [
          { symbol: 'SPDR', name: 'Spider-Man', type: 'character' },
          { symbol: 'BTMN', name: 'Batman', type: 'character' },
          { symbol: 'SUPM', name: 'Superman', type: 'character' }
        ]
      },
      {
        id: '2',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        title: 'DC Comics Annual Meeting',
        impact: 'medium',
        type: 'convention',
        relatedSymbols: [
          { symbol: 'BTMN', name: 'Batman', type: 'character' },
          { symbol: 'SUPM', name: 'Superman', type: 'character' }
        ]
      },
      {
        id: '3',
        date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        title: 'New Spider-Man Movie Release',
        impact: 'high',
        type: 'movie',
        relatedSymbols: [
          { symbol: 'SPDR', name: 'Spider-Man', type: 'character' }
        ]
      },
      {
        id: '4',
        date: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(),
        title: 'Comic-Con International 2024',
        impact: 'medium',
        type: 'convention',
        relatedSymbols: [
          { symbol: 'SPDR', name: 'Spider-Man', type: 'character' },
          { symbol: 'BTMN', name: 'Batman', type: 'character' },
          { symbol: 'WOND', name: 'Wonder Woman', type: 'character' },
          { symbol: 'HULK', name: 'Hulk', type: 'character' }
        ]
      }
    ];
  }

  // Add to watchlist
  async addToWatchlist(symbol: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`Added ${symbol} to watchlist`);
    return true;
  }
}

// Create and export mockApi instance
export const mockApi = new MockApi();

// Export individual functions for backward compatibility
export const fetchMarketTrendData = mockApi.fetchMarketTrendData.bind(mockApi);
export const fetchPortfolioPerformance = mockApi.fetchPortfolioPerformance.bind(mockApi);
export const fetchAssetPerformance = mockApi.fetchAssetPerformance.bind(mockApi);
export const fetchMarketNews = mockApi.fetchMarketNews.bind(mockApi);
export const fetchSectorPerformance = mockApi.fetchSectorPerformance.bind(mockApi);
export const fetchTradingVolume = mockApi.fetchTradingVolume.bind(mockApi);
export const fetchMarketDepth = mockApi.fetchMarketDepth.bind(mockApi);
export const getAllAssets = mockApi.getAllAssets.bind(mockApi);