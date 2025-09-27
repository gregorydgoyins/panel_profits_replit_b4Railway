import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity,
  Target
} from 'lucide-react';

interface PortfolioSummaryWidgetProps {
  className?: string;
}

export default function PortfolioSummaryWidget({ className = '' }: PortfolioSummaryWidgetProps) {
  // Mock portfolio data
  const portfolioData = {
    totalValue: 125750.50,
    dayChange: 2340.75,
    dayChangePercent: 1.9,
    totalReturn: 15680.25,
    totalReturnPercent: 14.2,
    topHolding: 'AAPL',
    topHoldingValue: 23450.00,
    diversificationScore: 8.5
  };

  return (
    <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Portfolio Summary</h2>
        <PieChart className="h-6 w-6 text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Portfolio Value */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Value</p>
            <DollarSign className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            ${portfolioData.totalValue.toLocaleString()}
          </p>
          <div className="flex items-center mt-1">
            {portfolioData.dayChange >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
            )}
            <span className={`text-xs ${portfolioData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.dayChange >= 0 ? '+' : ''}${portfolioData.dayChange.toLocaleString()} 
              ({portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent}%)
            </span>
          </div>
        </div>

        {/* Total Return */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Return</p>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            +${portfolioData.totalReturn.toLocaleString()}
          </p>
          <p className="text-xs text-green-400 mt-1">
            +{portfolioData.totalReturnPercent}% All Time
          </p>
        </div>

        {/* Diversification Score */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Diversification</p>
            <Target className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {portfolioData.diversificationScore}/10
          </p>
          <p className="text-xs text-gray-400 mt-1">Good Balance</p>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-3">Top Holdings</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div>
                <p className="text-white font-medium">{portfolioData.topHolding}</p>
                <p className="text-xs text-gray-400">Apple Inc.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">${portfolioData.topHoldingValue.toLocaleString()}</p>
              <p className="text-xs text-gray-400">18.7% of portfolio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3 mt-6">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Add Funds
        </button>
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Rebalance
        </button>
        <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}