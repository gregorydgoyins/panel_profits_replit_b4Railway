import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, Sparkles, TrendingUp, Globe, Brain, RefreshCw, Loader2 } from 'lucide-react';
import { comicApiService, type TradingAsset } from '../services/comicApiService';
import { HolographicPriceDisplay } from '../components/spectacular/HolographicPriceDisplay';
import { AnimatedTradingCard } from '../components/spectacular/AnimatedTradingCard';
import { MarketSentimentOrb } from '../components/spectacular/MarketSentimentOrb';
import { Portfolio3DGlobe } from '../components/spectacular/Portfolio3DGlobe';
import { QuantumMarketDashboard } from '../components/spectacular/QuantumMarketDashboard';
import { Button } from '../components/ui/button';

export function RealDataShowcase() {
  const [selectedAsset, setSelectedAsset] = useState<TradingAsset | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real trading assets from comic APIs
  const { 
    data: assetsResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['trading-assets'],
    queryFn: () => comicApiService.getTradingAssets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  const assets = assetsResponse?.data || [];
  const assetCount = assetsResponse?.count || 0;

  // Generate showcase data from real assets
  const selectedShowcaseAsset = selectedAsset ? comicApiService.transformForShowcase(selectedAsset) : null;
  const sentimentData = comicApiService.generateMarketSentiment(assets);
  const portfolioData = comicApiService.generatePortfolioData(assets);
  const marketDashboard = comicApiService.generateMarketDashboard(assets);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-select first asset when loaded
  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, selectedAsset]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Loading Real Comic Data</h2>
          <p className="text-slate-400">Fetching authentic Marvel characters, comics, and creators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Database className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-400 mb-4">
            Unable to fetch real comic data. This might be due to API rate limits or connectivity issues.
          </p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Database className="w-8 h-8 text-green-400" />
              <h1 className="text-4xl font-display font-bold text-white">
                Real Comic Data Integration
              </h1>
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light mb-6">
              Live trading platform powered by authentic Marvel API, SuperHero API, and Comic Vine data. 
              Real characters, genuine comic metadata, and authentic publisher information.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400">{assetCount} Real Assets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-400">Live APIs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-400">Authentic Data</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-slate-700 hover:bg-slate-600 border border-slate-600"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Selection */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Select Trading Asset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${selectedAsset?.symbol === asset.symbol 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }
                `}
                onClick={() => setSelectedAsset(asset)}
                data-testid={`asset-selector-${asset.symbol}`}
              >
                <div className="flex items-center space-x-3">
                  {asset.image ? (
                    <img 
                      src={asset.image} 
                      alt={asset.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {asset.symbol.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{asset.symbol}</h3>
                    <p className="text-sm text-slate-400 truncate">{asset.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {asset.category}
                      </span>
                      <span className={`text-xs font-trading ${
                        asset.changePercent > 0 ? 'text-green-400' : 
                        asset.changePercent < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Showcase Components with Real Data */}
        {selectedShowcaseAsset && selectedAsset && (
          <div className="space-y-12">
            {/* Individual Component Showcases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Holographic Price Display */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Holographic Price Display</span>
                </h3>
                <HolographicPriceDisplay
                  symbol={selectedShowcaseAsset.symbol}
                  price={selectedShowcaseAsset.price}
                  change={selectedShowcaseAsset.change}
                  changePercent={selectedShowcaseAsset.changePercent}
                  volume={selectedShowcaseAsset.volume}
                  marketCap={selectedShowcaseAsset.marketCap}
                />
              </div>

              {/* Animated Trading Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span>Animated Trading Card</span>
                </h3>
                <div className="flex justify-center">
                  <AnimatedTradingCard
                    asset={selectedShowcaseAsset}
                    onClick={() => console.log('Card clicked!')}
                  />
                </div>
              </div>
            </div>

            {/* Market Sentiment Orb */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <span>AI Market Sentiment Analysis</span>
              </h3>
              <div className="flex justify-center">
                <MarketSentimentOrb sentimentData={sentimentData} />
              </div>
            </div>

            {/* Portfolio 3D Globe */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-400" />
                <span>Portfolio 3D Globe Visualization</span>
              </h3>
              <div className="flex justify-center">
                <Portfolio3DGlobe
                  assets={portfolioData}
                  totalValue={portfolioData.reduce((sum, asset) => sum + asset.value, 0)}
                  totalReturn={portfolioData.reduce((sum, asset) => sum + asset.changePercent, 0) / portfolioData.length}
                />
              </div>
            </div>

            {/* Quantum Market Dashboard */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center space-x-2">
                <Database className="w-5 h-5 text-yellow-400" />
                <span>Quantum Market Dashboard</span>
              </h3>
              <QuantumMarketDashboard marketData={marketDashboard} />
            </div>

            {/* Real Data Metadata */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-display font-bold text-white mb-4">Real Data Source</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Asset Metadata</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Marvel ID:</span>
                      <span className="text-white">{selectedAsset.metadata.marvelId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Publisher:</span>
                      <span className="text-white">{selectedAsset.metadata.publisher || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Comics Appeared:</span>
                      <span className="text-white">{selectedAsset.metadata.comicsAppeared || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Series Appeared:</span>
                      <span className="text-white">{selectedAsset.metadata.seriesAppeared || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">First Appearance:</span>
                      <span className="text-white">{selectedAsset.metadata.firstAppearance || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                {selectedAsset.metadata.powerStats && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Power Statistics</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedAsset.metadata.powerStats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                          <span className="text-slate-400 capitalize">{stat}:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white">{value}</span>
                            <div className="w-16 bg-slate-700 rounded-full h-1">
                              <div 
                                className="bg-blue-400 h-1 rounded-full"
                                style={{ width: `${(parseInt(value) || 0)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RealDataShowcase;