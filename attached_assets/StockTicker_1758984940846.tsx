import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown, Pause, Play, Settings, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockApi } from '../../data/mockApi';

// Stock ticker asset interface
export interface TickerAsset {
  symbol: string;
  name: string;
  type: string;
  price: number;
  change: number;
  percentageChange: number;
  volume: number;
  link: string;
}

interface StockTickerProps {
  className?: string;
  maxAssets?: number;
  speed?: number;
  showControls?: boolean;
  scrollDuration?: string;
  speedMultiplier?: number;
  onSpeedChange?: (multiplier: number) => void;
}

export function StockTicker({ 
  className = '', 
  maxAssets = 500, // Increased to show all assets
  speed: initialSpeed = 0.3,
  showControls = true,
  scrollDuration = '700s',
  speedMultiplier = 1,
  onSpeedChange
}: StockTickerProps) {
  const [assets, setAssets] = useState<TickerAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug: Log ticker state
  useEffect(() => {
    console.log('StockTicker: isPaused =', isPaused, 'assets count =', assets.length);
  }, [isPaused, assets.length]);

  // Fetch real asset data
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const assetData = await mockApi.fetchAssets(); // Get all 500+ tradeable assets including bonds, funds, ETFs, creators, locations, gadgets
        const formattedAssets: TickerAsset[] = assetData.map(asset => ({
          symbol: asset.symbol,
          name: asset.name,
          type: asset.type || 'character',
          price: Math.round(asset.price || asset.nav || 0), // Ensure whole numbers
          change: Math.round(asset.change || 0), // Ensure whole numbers  
          percentageChange: Math.round((asset.percentageChange || 0) * 100) / 100, // Keep 2 decimals for %
          volume: asset.volume || 0,
          link: asset.link || `/trading/${asset.symbol}`
        }));
        
        // Shuffle array to ensure bonds, options, ETFs, NFTs, funds are mixed throughout
        const shuffledAssets = formattedAssets.sort(() => Math.random() - 0.5);
        setAssets(shuffledAssets);
        console.log(`StockTicker: Loaded ${shuffledAssets.length} assets including characters, creators, bonds, funds, ETFs, locations, and gadgets - shuffled for variety`);
      } catch (err) {
        console.error('StockTicker: Failed to fetch assets:', err);
        setError('Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
    
    // Refresh assets every 30 seconds to show market activity
    const interval = setInterval(fetchAssets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="h-10 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500" />
              <span className="text-gray-400 text-sm">Loading market data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="h-12 flex items-center justify-center">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="h-10 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No market data available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/70 backdrop-blur-md border-b border-slate-700/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent transition-all ${className}`}>
      <div className="w-full px-4">
        <div className="h-10 flex items-center justify-start">
          {/* Label */}
          <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-blue-900/50 border border-blue-700/50">
            <BarChart2 className="h-4 w-4 text-green-400" />
            <span className="text-xs text-white font-medium">MARKET ASSETS ({assets.length})</span>
          </div>

          {/* Ticker Content */}
          <div className="flex-1 overflow-hidden">
            <div
              className={`flex flex-nowrap ${isPaused ? '' : 'animate-scroll'}`}
              style={{ 
                minWidth: 'max-content',
                '--scroll-duration': isPaused ? 'none' : scrollDuration
              } as React.CSSProperties}
            >
              {/* First set of assets */}
              {assets.map((asset) => (
                (() => {
                  // Dynamic styling based on asset performance
                  const isPositive = asset.percentageChange > 0;
                  const isNeutral = asset.percentageChange === 0;
                  
                  const getBaseClasses = () => {
                    if (isPositive) {
                      return 'bg-green-900/20 border-green-700/30 hover:bg-green-600 hover:border-green-500';
                    } else if (isNeutral) {
                      return 'bg-yellow-900/20 border-yellow-700/30 hover:bg-yellow-600 hover:border-yellow-500';
                    } else {
                      return 'bg-red-900/20 border-red-700/30 hover:bg-red-600 hover:border-red-500';
                    }
                  };
                  
                  const getDotColor = () => {
                    if (isPositive) return 'bg-green-400 group-hover:bg-green-200';
                    if (isNeutral) return 'bg-yellow-400 group-hover:bg-yellow-200';
                    return 'bg-red-400 group-hover:bg-red-200';
                  };
                  
                  const getPercentageColor = () => {
                    if (isPositive) return 'text-green-400 group-hover:text-green-100';
                    if (isNeutral) return 'text-yellow-400 group-hover:text-yellow-100';
                    return 'text-red-400 group-hover:text-red-100';
                  };
                  
                  return (
                <Link 
                    key={asset.symbol}
                  to={asset.link}
                      className={`inline-flex items-center space-x-3 px-4 py-1 rounded-lg border transition-all duration-200 whitespace-nowrap group hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent ${getBaseClasses()}`}
                  style={{ marginRight: '2px' }}
                >
                      <span className={`h-2 w-2 rounded-full ${getDotColor()}`} />
                  
                      <span className="font-bold text-white group-hover:text-white text-sm">
                    {asset.symbol}
                  </span>
                  
                      <span className="text-gray-300 group-hover:text-gray-100 text-sm">
                    CC {asset.price.toLocaleString()}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {asset.percentageChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400 group-hover:text-green-100" />
                    ) : (
                        <TrendingDown className="h-3 w-3 text-red-400 group-hover:text-red-100" />
                    )}
                      <span className={`text-sm font-medium ${getPercentageColor()}`}>
                      {asset.percentageChange > 0 ? '+' : ''}{asset.percentageChange.toFixed(1)}%
                    </span>
                  </div>
                </Link>
                  );
                })()
              ))}
              
              {/* Duplicate set for seamless loop */}
              {assets.map((asset) => (
                (() => {
                  // Dynamic styling based on asset performance (duplicate set)
                  const isPositive = asset.percentageChange > 0;
                  const isNeutral = asset.percentageChange === 0;
                  
                  const getBaseClasses = () => {
                    if (isPositive) {
                      return 'bg-green-900/20 border-green-700/30 hover:bg-green-600 hover:border-green-500';
                    } else if (isNeutral) {
                      return 'bg-yellow-900/20 border-yellow-700/30 hover:bg-yellow-600 hover:border-yellow-500';
                    } else {
                      return 'bg-red-900/20 border-red-700/30 hover:bg-red-600 hover:border-red-500';
                    }
                  };
                  
                  const getDotColor = () => {
                    if (isPositive) return 'bg-green-400 group-hover:bg-green-200';
                    if (isNeutral) return 'bg-yellow-400 group-hover:bg-yellow-200';
                    return 'bg-red-400 group-hover:bg-red-200';
                  };
                  
                  const getPercentageColor = () => {
                    if (isPositive) return 'text-green-400 group-hover:text-green-100';
                    if (isNeutral) return 'text-yellow-400 group-hover:text-yellow-100';
                    return 'text-red-400 group-hover:text-red-100';
                  };
                  
                  return (
                <Link 
                    key={`${asset.symbol}-duplicate`}
                  to={asset.link}
                      className={`inline-flex items-center space-x-3 px-4 py-1 rounded-lg border transition-all duration-200 whitespace-nowrap group hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent ${getBaseClasses()}`}
                  style={{ marginRight: '2px' }}
                >
                      <span className={`h-2 w-2 rounded-full ${getDotColor()}`} />
                  
                      <span className="font-bold text-white group-hover:text-white text-sm">
                    {asset.symbol}
                  </span>
                  
                      <span className="text-gray-300 group-hover:text-gray-100 text-sm">
                    CC {asset.price.toLocaleString()}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {asset.percentageChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400 group-hover:text-green-100" />
                    ) : (
                        <TrendingDown className="h-3 w-3 text-red-400 group-hover:text-red-100" />
                    )}
                      <span className={`text-sm font-medium ${getPercentageColor()}`}>
                      {asset.percentageChange > 0 ? '+' : ''}{asset.percentageChange.toFixed(1)}%
                    </span>
                  </div>
                </Link>
                  );
                })()
              ))}
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="flex items-center space-x-2 flex-shrink-0 border-l border-slate-700/50 pl-4">
              {/* Speed Controls */}
              <button
                onClick={() => onSpeedChange && onSpeedChange(0.5)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  speedMultiplier === 0.5
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="0.5x slower"
              >
                0.5x
              </button>
              
              <button
                onClick={() => onSpeedChange && onSpeedChange(1)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  speedMultiplier === 1
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Normal speed"
              >
                1x
              </button>
              
              <button
                onClick={() => onSpeedChange && onSpeedChange(2)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  speedMultiplier === 2
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="2x faster"
              >
                2x
              </button>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded touch-target"
                title={isPaused ? 'Resume ticker' : 'Pause ticker'}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}