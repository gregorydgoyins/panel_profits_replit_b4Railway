import React, { useState } from 'react';
import { Sparkles, Eye, Palette, Zap, Globe, Brain } from 'lucide-react';
import { HolographicPriceDisplay } from '../components/spectacular/HolographicPriceDisplay';
import { AnimatedTradingCard } from '../components/spectacular/AnimatedTradingCard';
import { MarketSentimentOrb } from '../components/spectacular/MarketSentimentOrb';
import { Portfolio3DGlobe } from '../components/spectacular/Portfolio3DGlobe';
import { QuantumMarketDashboard } from '../components/spectacular/QuantumMarketDashboard';

// Mock data for showcase
const mockAsset = {
  symbol: "SPDR",
  name: "Spider-Man",
  price: 4800,
  change: 145.50,
  changePercent: 3.13,
  significance: 98,
  marketCap: 2400000,
  volume: 28500,
  rating: "Strong Buy",
  image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400"
};

const mockSentimentData = {
  overall: 0.65,
  confidence: 0.89,
  categories: {
    news: 0.72,
    social: 0.58,
    technical: 0.69,
    volume: 0.61
  },
  sources: {
    ai: 0.85,
    human: 0.67,
    algorithmic: 0.78
  }
};

const mockPortfolioAssets = [
  {
    symbol: "SPDR",
    name: "Spider-Man",
    allocation: 25.5,
    value: 1275000,
    change: 145.50,
    changePercent: 3.13,
    category: "character" as const,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    symbol: "BATM",
    name: "Batman",
    allocation: 22.3,
    value: 1115000,
    change: -23.20,
    changePercent: -2.08,
    category: "character" as const,
    coordinates: { lat: 39.2904, lng: -76.6122 }
  },
  {
    symbol: "TMFS",
    name: "Todd McFarlane",
    allocation: 15.2,
    value: 760000,
    change: 67.80,
    changePercent: 4.47,
    category: "creator" as const,
    coordinates: { lat: 51.0447, lng: -114.0719 }
  },
  {
    symbol: "MRVL",
    name: "Marvel",
    allocation: 18.7,
    value: 935000,
    change: 89.20,
    changePercent: 2.91,
    category: "publisher" as const,
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    symbol: "WTCH",
    name: "Watchtower",
    allocation: 8.9,
    value: 445000,
    change: 12.10,
    changePercent: 1.23,
    category: "location" as const,
    coordinates: { lat: 38.9072, lng: -77.0369 }
  },
  {
    symbol: "WEBZ",
    name: "Web Shooters",
    allocation: 9.4,
    value: 470000,
    change: -5.60,
    changePercent: -0.78,
    category: "gadget" as const,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }
];

const mockMarketData = {
  index: 14785,
  change: 2.34,
  volume: 2850000000,
  volatility: 0.18,
  marketCap: 890000000000,
  activeAssets: 547,
  topGainers: [
    { symbol: "SPDR", change: 3.13 },
    { symbol: "TMFS", change: 4.47 },
    { symbol: "WNDR", change: 2.89 }
  ],
  topLosers: [
    { symbol: "BATM", change: -2.08 },
    { symbol: "JOKR", change: -1.95 },
    { symbol: "WEBZ", change: -0.78 }
  ],
  sectorPerformance: [
    { sector: "Characters", performance: 1.85, allocation: 45 },
    { sector: "Creators", performance: 3.21, allocation: 25 },
    { sector: "Publishers", performance: 0.94, allocation: 20 },
    { sector: "Locations", performance: -0.32, allocation: 7 },
    { sector: "Gadgets", performance: -1.12, allocation: 3 }
  ],
  sentimentData: {
    overall: 0.65,
    confidence: 0.89,
    trend: "bullish" as const
  }
};

export function SpectacularShowcase() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const components = [
    {
      id: 'holographic',
      name: 'Holographic Price Display',
      description: 'Futuristic price display with holographic effects, real-time updates, and scanning animations',
      icon: <Sparkles className="w-6 h-6" />,
      component: (
        <HolographicPriceDisplay
          symbol={mockAsset.symbol}
          price={mockAsset.price}
          change={mockAsset.change}
          changePercent={mockAsset.changePercent}
          volume={mockAsset.volume}
          marketCap={mockAsset.marketCap}
        />
      )
    },
    {
      id: 'trading-card',
      name: 'Animated Trading Card',
      description: 'Interactive trading card with cursor tracking, 3D effects, and dynamic animations',
      icon: <Eye className="w-6 h-6" />,
      component: (
        <AnimatedTradingCard
          asset={mockAsset}
          onClick={() => console.log('Card clicked!')}
        />
      )
    },
    {
      id: 'sentiment-orb',
      name: 'Market Sentiment Orb',
      description: 'AI-powered sentiment visualization with particle system and rotating data points',
      icon: <Brain className="w-6 h-6" />,
      component: (
        <MarketSentimentOrb sentimentData={mockSentimentData} />
      )
    },
    {
      id: 'portfolio-globe',
      name: 'Portfolio 3D Globe',
      description: '3D globe visualization showing portfolio assets positioned in space with orbit rings',
      icon: <Globe className="w-6 h-6" />,
      component: (
        <Portfolio3DGlobe
          assets={mockPortfolioAssets}
          totalValue={5000000}
          totalReturn={8.47}
        />
      )
    },
    {
      id: 'quantum-dashboard',
      name: 'Quantum Market Dashboard',
      description: 'Comprehensive market visualization with quantum field effects and real-time analytics',
      icon: <Zap className="w-6 h-6" />,
      component: (
        <QuantumMarketDashboard marketData={mockMarketData} />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Palette className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-display  text-white">
                Spectacular Components
              </h1>
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
              Revolutionary, out-of-the-box UI components designed to set Panel Profits apart. 
              Experience the future of comic book financial trading with these innovative visualizations.
            </p>
          </div>
        </div>
      </div>

      {/* Component Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {components.map((comp) => (
            <div
              key={comp.id}
              className={`
                relative group bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500
                ${selectedComponent === comp.id 
                  ? 'border-cyan-400/50 shadow-2xl shadow-cyan-500/25 scale-105' 
                  : 'border-slate-700/50 hover:border-slate-600/50 hover:shadow-xl'
                }
              `}
              onClick={() => setSelectedComponent(selectedComponent === comp.id ? null : comp.id)}
            >
              {/* Component Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                  {comp.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display  text-white">{comp.name}</h3>
                  <p className="text-slate-400 text-sm font-light">{comp.description}</p>
                </div>
              </div>

              {/* Component Preview */}
              <div className="relative">
                {comp.component}
              </div>

              {/* Selection Indicator */}
              {selectedComponent === comp.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Typography Preview */}
        <div className="mt-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-display  text-white mb-6 flex items-center space-x-3">
            <Palette className="w-6 h-6 text-purple-400" />
            <span>Enhanced Typography System</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-display  text-white mb-4">Space Grotesk (Headers)</h3>
              <div className="space-y-3">
                <h1 className="text-3xl font-display  text-white">Panel Profits Trading</h1>
                <h2 className="text-2xl font-display  text-white">Market Analysis</h2>
                <h3 className="text-xl font-display  text-white">Portfolio Overview</h3>
                <h4 className="text-lg font-display text-white">Asset Details</h4>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-display  text-white mb-4">Hind 300 (Body Text)</h3>
              <div className="space-y-3">
                <p className="text-slate-300 font-light">
                  Ultra-clean, lightweight interface text for optimal readability across all trading interfaces.
                </p>
                <div className="font-trading text-white">
                  <span className="text-slate-400">Trading Data: </span>
                  CC 4,800.00 (+3.13%)
                </div>
                <div className="text-sm text-slate-400 font-light">
                  Sophisticated typography designed for professional financial trading platforms.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-emerald-700/30">
            <Sparkles className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-display  text-white mb-2">Holographic Effects</h3>
            <p className="text-emerald-200 text-sm font-light">
              Advanced visual effects with particle systems, quantum fields, and holographic displays.
            </p>
          </div>
          
          <div className="bg-blue-900/20 backdrop-blur-xl rounded-xl p-6 border border-blue-700/30">
            <Brain className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-display  text-white mb-2">AI-Powered</h3>
            <p className="text-blue-200 text-sm font-light">
              Intelligent sentiment analysis, market predictions, and adaptive user interfaces.
            </p>
          </div>
          
          <div className="bg-purple-900/20 backdrop-blur-xl rounded-xl p-6 border border-purple-700/30">
            <Globe className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-display  text-white mb-2">3D Visualizations</h3>
            <p className="text-purple-200 text-sm font-light">
              Immersive 3D portfolio views, interactive globes, and spatial data representation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpectacularShowcase;