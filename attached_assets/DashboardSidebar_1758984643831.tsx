import React from 'react';
import { Shield, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortfolioHealthCheck } from '../portfolio/PortfolioHealthCheck';
import { useMarketOverview, usePortfolioData } from '../../hooks/useAssetMarketData';

export function DashboardSidebar() {
  const { marketData } = useMarketOverview();
  const { portfolio } = usePortfolioData();

  return (
    <div className="space-y-6">
      {/* Quick Portfolio Overview */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-6 w-6 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Portfolio Snapshot</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Value</span>
            <span className="text-xl font-bold text-white">
              CC {portfolio?.summary?.totalValue?.toLocaleString() || '2,847,230'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Today's P&L</span>
            <span className={`text-lg font-semibold ${
              (portfolio?.summary?.dayChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(portfolio?.summary?.dayChange || 0) >= 0 ? '+' : ''}CC {portfolio?.summary?.dayChange?.toLocaleString() || '42,150'} 
              ({(portfolio?.summary?.dayChange || 0) >= 0 ? '+' : ''}{portfolio?.summary?.dayChangePercent?.toFixed(1) || '1.5'}%)
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${portfolio?.summary?.diversificationScore || 68}%` }} />
          </div>
          <p className="text-sm text-gray-400">Diversification Score: {portfolio?.summary?.diversificationScore || 68}/100</p>
        </div>
        
        <Link 
          to="/portfolio"
          className="block w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg transition-colors"
        >
          View Full Portfolio
        </Link>
      </div>

      {/* Portfolio Health Check */}
      <PortfolioHealthCheck />

      {/* Top Movers */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-6 w-6 text-green-400" />
          <h3 className="text-lg font-bold text-white">Top Movers</h3>
        </div>
        
        <div className="space-y-3">
          {marketData?.topGainers?.slice(0, 4).map((asset, index) => (
            <Link 
              key={index}
              to={`/character/${asset.symbol}`}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-white">{asset.symbol}</p>
                <p className="text-xs text-gray-400">{asset.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-green-400">
                  +{asset.percentageChange?.toFixed(1)}%
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
          )) || [
            { symbol: 'ASM300', name: 'Amazing Spider-Man #300', change: '+8.5%' },
            { symbol: 'BATM', name: 'Batman', change: '+5.2%' },
            { symbol: 'TMFS', name: 'Todd McFarlane', change: '+4.8%' },
            { symbol: 'SPDR', name: 'Spider-Man', change: '+5.3%' }
          ].map((asset, index) => (
            <Link 
              key={index}
              to={`/character/${asset.symbol}`}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-white">{asset.symbol}</p>
                <p className="text-xs text-gray-400">{asset.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-green-400">
                  {asset.change}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;