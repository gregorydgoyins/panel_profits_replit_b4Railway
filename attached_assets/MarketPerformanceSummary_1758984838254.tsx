import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Activity, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketPerformanceData } from '../../hooks/useAssetMarketData';

interface MarketPerformanceSummaryProps {
  className?: string;
}

export function MarketPerformanceSummary({ className = '' }: MarketPerformanceSummaryProps) {
  const { performance: performanceData, isLoading } = useMarketPerformanceData();

  if (isLoading || !performanceData) {
    return (
      <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
          <span className="ml-3 text-gray-400">Loading performance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 ${className}`}>
      <div className="flex items-center space-x-2 mb-5">
        <BarChart2 className="h-6 w-6 text-blue-400" />
        <h3 className="font-semibold text-white text-lg">Market Performance</h3>
        <div className="ml-auto">
          <span className="px-2 py-1 bg-blue-900/50 text-blue-200 rounded-full text-xs border border-blue-700/50">
            Live Data
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {performanceData.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${category.percentChange > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-white font-medium">{category.category}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm">{(category.volume / 1000).toFixed(1)}K</span>
              <div className="flex items-center space-x-1">
                {category.percentChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={`font-semibold ${category.percentChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {category.percentChange > 0 ? '+' : ''}{category.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span>Market is </span>
            <span className={`font-medium ${
              performanceData.filter(p => p.percentChange > 0).length > performanceData.length / 2 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {performanceData.filter(p => p.percentChange > 0).length > performanceData.length / 2 
                ? 'trending upward' 
                : 'trending downward'}
            </span>
            <span> across most sectors</span>
          </div>
          <Link 
            to="/markets"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarketPerformanceSummary;