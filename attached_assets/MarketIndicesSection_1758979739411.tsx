import React from 'react';
import { BarChart2, Activity, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MarketIndicesSection() {
  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">Market Indices</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CCIX - Comic Collectibles Index (DOW equivalent) */}
        <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-blue-600/20">
                <BarChart2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Comic Collectibles Index</h3>
                <p className="text-sm text-gray-400">CCIX • 50 Curated Premium Comics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">8,750.25</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-semibold">+185.50 (+2.16%)</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Tracks the performance of 50 blue-chip comic collectibles, including key issues from Action Comics #1, Detective Comics #27, and other cornerstone publications.
          </p>
          
          <div className="space-y-2 mb-4">
            <h4 className="text-white font-medium text-sm">Top Holdings Today:</h4>
            {[
              { symbol: 'ACM1', name: 'Action Comics #1', weight: 15.2, change: 3.8 },
              { symbol: 'DTM27', name: 'Detective Comics #27', weight: 12.8, change: 2.9 },
              { symbol: 'MRV1', name: 'Marvel Comics #1', weight: 10.5, change: 4.2 },
              { symbol: 'ASM15', name: 'Amazing Fantasy #15', weight: 9.8, change: 5.1 }
            ].map((comic, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{comic.symbol}</span>
                  <span className="text-white">{comic.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{comic.weight}%</span>
                  <span className="text-green-400">+{comic.change}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-400">Day High</p>
              <p className="text-white font-medium">8,785.75</p>
            </div>
            <div>
              <p className="text-gray-400">Day Low</p>
              <p className="text-white font-medium">8,650.20</p>
            </div>
            <div>
              <p className="text-gray-400">Volume</p>
              <p className="text-white font-medium">1.8M</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Link 
              to="/markets/ccix"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View CCIX Details →
            </Link>
          </div>
        </div>

        {/* PPIX100 - Panel Profits Index 100 (NASDAQ equivalent) */}
        <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-purple-600/20">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Panel Profits Index 100</h3>
                <p className="text-sm text-gray-400">PPIX100 • Top 100 Growth Comics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">12,450.80</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-semibold">+320.15 (+2.64%)</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Tracks the 100 fastest-growing comic assets, weighted by market capitalization and trading volume. Focus on modern classics and emerging collectibles.
          </p>
          
          <div className="space-y-2 mb-4">
            <h4 className="text-white font-medium text-sm">Top Contributors Today:</h4>
            {[
              { symbol: 'ASM300', name: 'Amazing Spider-Man #300', weight: 8.5, change: 8.5 },
              { symbol: 'BATM', name: 'Batman Character Stock', weight: 7.2, change: 6.2 },
              { symbol: 'SPDR', name: 'Spider-Man Character Stock', weight: 6.8, change: 5.3 },
              { symbol: 'TMFS', name: 'Todd McFarlane Stock', weight: 5.1, change: 5.8 }
            ].map((asset, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{asset.symbol}</span>
                  <span className="text-white">{asset.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{asset.weight}%</span>
                  <span className="text-green-400">+{asset.change}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Link 
              to="/markets/ppix100"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              View PPIX100 Holdings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketIndicesSection;