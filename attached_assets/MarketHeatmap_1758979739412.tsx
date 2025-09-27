import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Filter, Maximize, Eye, Info, Tag, Clock, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeatmapAsset {
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher' | 'bond' | 'fund';
  era?: string;
  publisher?: string;
  percentChange: number;
  marketCap: number;
  volume: number;
  size: number; // For heatmap sizing
}

export function MarketHeatmap() {
  const [viewMode, setViewMode] = useState<'type' | 'era' | 'publisher'>('type');
  const [showValues, setShowValues] = useState(true);

  // Generate heatmap data
  const generateHeatmapData = (): HeatmapAsset[] => {
    return [
      // Characters
      { symbol: 'SPDR', name: 'Spider-Man', type: 'character', era: 'Silver', publisher: 'Marvel', percentChange: 5.3, marketCap: 175000000, volume: 2500, size: 100 },
      { symbol: 'BATM', name: 'Batman', type: 'character', era: 'Golden', publisher: 'DC', percentChange: 6.2, marketCap: 210000000, volume: 3200, size: 120 },
      { symbol: 'SUPR', name: 'Superman', type: 'character', era: 'Golden', publisher: 'DC', percentChange: 2.8, marketCap: 225000000, volume: 3800, size: 130 },
      { symbol: 'WNDR', name: 'Wonder Woman', type: 'character', era: 'Golden', publisher: 'DC', percentChange: 4.9, marketCap: 195000000, volume: 2900, size: 110 },
      { symbol: 'JOKR', name: 'The Joker', type: 'character', era: 'Golden', publisher: 'DC', percentChange: -2.0, marketCap: 190000000, volume: 2800, size: 108 },
      
      // Creators
      { symbol: 'TMFS', name: 'Todd McFarlane', type: 'creator', percentChange: 5.8, marketCap: 125000000, volume: 1250, size: 80 },
      { symbol: 'JLES', name: 'Jim Lee', type: 'creator', percentChange: 5.3, marketCap: 160000000, volume: 1800, size: 90 },
      { symbol: 'DCTS', name: 'Donny Cates', type: 'creator', percentChange: -2.8, marketCap: 90000000, volume: 980, size: 70 },
      { symbol: 'ARTS', name: 'Stanley Lau', type: 'creator', percentChange: -1.6, marketCap: 75000000, volume: 750, size: 65 },
      
      // Key Comics
      { symbol: 'AF15', name: 'Amazing Fantasy #15', type: 'comic', era: 'Silver', publisher: 'Marvel', percentChange: 5.57, marketCap: 90000000, volume: 125, size: 85 },
      { symbol: 'ASM300', name: 'ASM #300', type: 'comic', era: 'Modern', publisher: 'Marvel', percentChange: 8.5, marketCap: 12500000, volume: 1250, size: 60 },
      { symbol: 'ACM1', name: 'Action Comics #1', type: 'comic', era: 'Golden', publisher: 'DC', percentChange: 1.2, marketCap: 160000000, volume: 15, size: 95 },
      { symbol: 'DTM27', name: 'Detective Comics #27', type: 'comic', era: 'Golden', publisher: 'DC', percentChange: 0.8, marketCap: 140000000, volume: 12, size: 88 },
      
      // Publishers & Funds
      { symbol: 'MRVL', name: 'Marvel Entertainment', type: 'publisher', percentChange: 3.1, marketCap: 500000000, volume: 5000, size: 140 },
      { symbol: 'DCCP', name: 'DC Comics', type: 'publisher', percentChange: 1.2, marketCap: 480000000, volume: 4500, size: 135 },
      { symbol: 'SHUF', name: 'Superhero Fund', type: 'fund', percentChange: 1.78, marketCap: 450000000, volume: 2500, size: 120 },
      { symbol: 'VPFD', name: 'Villain Portfolio Fund', type: 'fund', percentChange: -1.82, marketCap: 280000000, volume: 1800, size: 100 }
    ];
  };

  const heatmapData = generateHeatmapData();

  const getAssetColor = (percentChange: number) => {
    if (percentChange > 5) return 'bg-green-500';
    if (percentChange > 2) return 'bg-green-400';
    if (percentChange > 0) return 'bg-green-300';
    if (percentChange === 0) return 'bg-yellow-400';
    if (percentChange > -2) return 'bg-red-400';
    if (percentChange > -5) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getAssetOpacity = (percentChange: number) => {
    const intensity = Math.min(Math.abs(percentChange) / 10, 1);
    return 0.3 + (intensity * 0.7);
  };

  const getAssetSize = (asset: HeatmapAsset) => {
    // Base size calculation on market cap and volume
    const baseSize = Math.sqrt(asset.size) * 2;
    return Math.max(40, Math.min(120, baseSize));
  };

  const groupAssets = () => {
    switch (viewMode) {
      case 'type':
        return {
          'Characters': heatmapData.filter(a => a.type === 'character'),
          'Comics': heatmapData.filter(a => a.type === 'comic'),
          'Creators': heatmapData.filter(a => a.type === 'creator'),
          'Publishers/Funds': heatmapData.filter(a => a.type === 'publisher' || a.type === 'fund')
        };
      case 'era':
        return {
          'Golden Age': heatmapData.filter(a => a.era === 'Golden'),
          'Silver Age': heatmapData.filter(a => a.era === 'Silver'),
          'Modern Age': heatmapData.filter(a => a.era === 'Modern'),
          'Other': heatmapData.filter(a => !a.era)
        };
      case 'publisher':
        return {
          'Marvel': heatmapData.filter(a => a.publisher === 'Marvel'),
          'DC': heatmapData.filter(a => a.publisher === 'DC'),
          'Independent': heatmapData.filter(a => !a.publisher || (a.publisher !== 'Marvel' && a.publisher !== 'DC'))
        };
      default:
        return { 'All Assets': heatmapData };
    }
  };

  const groupedAssets = groupAssets();

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h3 className="font-semibold text-white text-lg">Market Heatmap</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowValues(!showValues)}
            className="p-2 rounded-lg bg-slate-700/50 text-gray-300 hover:text-white transition-colors"
            title={showValues ? 'Hide values' : 'Show values'}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Heatmap Introduction */}
      <div className="mb-6 bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-indigo-200 text-sm leading-relaxed">
              This market heatmap visualizes performance across different comic assets. 
              <span className="text-green-300 font-medium"> Green blocks indicate price gains</span>, 
              <span className="text-red-300 font-medium"> red blocks show declines</span>, and 
              <span className="text-indigo-300 font-medium"> larger blocks represent higher market capitalization</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced View Mode Buttons */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 justify-center">
          <div className="flex space-x-4">
            {[
              { id: 'type', label: 'Asset Type', icon: Tag, description: 'Group by characters, comics, creators' },
              { id: 'era', label: 'Comic Era', icon: Clock, description: 'Group by Golden, Silver, Modern Age' },
              { id: 'publisher', label: 'Publisher', icon: Building2, description: 'Group by Marvel, DC, Independent' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all hover:-translate-y-1 hover:shadow-lg ${
                  viewMode === mode.id
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
                }`}
                title={mode.description}
              >
                <mode.icon className="h-5 w-5" />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <div className="space-y-6">
        {Object.entries(groupedAssets).map(([groupName, assets]) => (
          <div key={groupName} className="bg-slate-700/20 p-4 rounded-lg border border-slate-600/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span>{groupName}</span>
              <span className="text-sm text-gray-400">({assets.length} assets)</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {assets.map((asset) => (
                <Link
                  key={asset.symbol}
                  to={`/${asset.type}/${asset.symbol}`}
                  className="relative group cursor-pointer transition-all hover:scale-105 hover:z-10"
                  style={{
                    width: `${Math.max(80, getAssetSize(asset))}px`,
                    height: `${Math.max(60, getAssetSize(asset) * 0.75)}px`
                  }}
                >
                  <div
                    className={`w-full h-full rounded-lg ${getAssetColor(asset.percentChange)} flex flex-col items-center justify-center transition-all shadow-lg hover:shadow-xl`}
                    style={{
                      opacity: getAssetOpacity(asset.percentChange)
                    }}
                  >
                    <div className="text-center text-white p-2">
                      <p className="font-bold text-sm">{asset.symbol}</p>
                      {showValues && (
                        <>
                          <p className="text-xs font-semibold">
                            {asset.percentChange > 0 ? '+' : ''}{asset.percentChange.toFixed(1)}%
                          </p>
                          <p className="text-xs opacity-90">
                            CC {asset.marketCap > 1000000000 
                              ? `${(asset.marketCap / 1000000000).toFixed(1)}B` 
                              : `${(asset.marketCap / 1000000).toFixed(0)}M`}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-slate-900/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <p className="text-white font-medium">{asset.name}</p>
                    <p className="text-gray-300 text-sm">{asset.symbol}</p>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Change:</span>
                        <span className={asset.percentChange > 0 ? 'text-green-400' : 'text-red-400'}>
                          {asset.percentChange > 0 ? '+' : ''}{asset.percentChange.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volume:</span>
                        <span className="text-white">{asset.volume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-white">
                          CC {asset.marketCap > 1000000000 
                            ? `${(asset.marketCap / 1000000000).toFixed(1)}B` 
                            : `${(asset.marketCap / 1000000).toFixed(0)}M`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-700/50">
                        <span className="text-indigo-400 text-xs">Click to view details →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded shadow-sm"></div>
              <span className="text-sm text-gray-300 font-medium">Price Gains</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded shadow-sm"></div>
              <span className="text-sm text-gray-300 font-medium">Price Declines</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-indigo-400" />
              <span className="text-sm text-gray-300 font-medium">Size indicates market capitalization</span>
            </div>
          </div>
          <Link
            to="/markets"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Full Market View →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarketHeatmap;