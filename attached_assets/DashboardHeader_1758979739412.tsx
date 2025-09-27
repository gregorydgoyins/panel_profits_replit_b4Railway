import React from 'react';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

interface DashboardHeaderProps {
  marketSentiment: number;
  marketIndex: number;
  currentTime: Date;
}

export function DashboardHeader({ marketSentiment, marketIndex, currentTime }: DashboardHeaderProps) {
  const isMarketUp = marketSentiment > 0;
  const sentimentPercentage = Math.abs(marketSentiment * 100);

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            Panel Profits Exchange
          </h1>
          <p className="text-white/90 text-base">
            Trade comic characters, creators, and collectibles in the ultimate virtual market
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Market Index */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-white/70 mb-1">
              <Activity className="h-3 w-3" />
              <span className="text-xs font-medium">Market Index</span>
            </div>
            <div className="text-lg font-bold text-white">
              {marketIndex.toLocaleString('en-US', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
              })}
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-white/70 mb-1">
              {isMarketUp ? (
                <TrendingUp className="h-3 w-3 text-orange-300" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-300" />
              )}
              <span className="text-xs font-medium">Sentiment</span>
            </div>
            <div className={`text-xl font-bold ${isMarketUp ? 'text-green-300' : 'text-red-300'}`}>
              {isMarketUp ? '+' : '-'}{sentimentPercentage.toFixed(1)}%
            </div>
          </div>

          {/* Current Time */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center space-x-1 text-white/70 mb-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-medium">Market Time</span>
            </div>
            <div className="text-base font-bold text-white">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}