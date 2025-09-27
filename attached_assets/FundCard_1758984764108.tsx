import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fund } from '../../types';

interface FundCardProps {
  fund: Fund;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export function FundCard({ fund, onSelect, isSelected }: FundCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Medium':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'High':
        return 'bg-red-900/50 text-red-200 border-red-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'themed':
        return '🎭';
      case 'custom':
        return '🛠️';
      case 'index':
        return '📊';
      case 'sector':
        return '🏛️';
      default:
        return '📈';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(fund.id)}
      className={`group relative bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1 cursor-pointer touch-target
        ${isSelected ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : ''}`}
    >
      {/* Fund Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon(fund.type)}</span>
            <h3 className="font-bold text-white text-lg">{fund.name}</h3>
          </div>
          <p className="text-sm text-gray-400">{fund.symbol} • {fund.type} fund</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(fund.riskLevel)}`}>
              {fund.riskLevel} Risk
            </span>
            <span className="text-xs text-gray-400">Managed by {fund.manager}</span>
          </div>
        </div>
      </div>

      {/* NAV and Change */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">NAV</p>
          <p className="text-xl font-bold text-white">CC {fund.nav.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {fund.change > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`font-semibold ${
              fund.change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {fund.change > 0 ? '+' : ''}{fund.percentageChange}%
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {fund.change > 0 ? '+' : ''}CC {fund.change.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Fund Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">YTD Return</p>
          <p className={`font-semibold ${fund.ytdReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {fund.ytdReturn >= 0 ? '+' : ''}{fund.ytdReturn}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">1Y Return</p>
          <p className={`font-semibold ${fund.oneYearReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {fund.oneYearReturn >= 0 ? '+' : ''}{fund.oneYearReturn}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">AUM</p>
          <p className="font-semibold text-white">CC {(fund.aum / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Expense Ratio</p>
          <p className="font-semibold text-white">{fund.expenseRatio}%</p>
        </div>
      </div>

      {/* Fund Info with Tooltip */}
      <div 
        className="mb-4 bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <p className="text-sm text-gray-300">
          <span className="font-medium">Manager:</span> {fund.manager}
        </p>
        <p className="text-sm text-gray-300">
          <span className="font-medium">Inception:</span> {new Date(fund.inceptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </p>
        
        {showTooltip && (
          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700">
            <p className="text-sm text-white font-medium mb-1">Top Holdings:</p>
            <ul className="text-xs text-gray-300 space-y-1">
              {fund.topHoldings.slice(0, 3).map((holding, index) => (
                <li key={index}>• {holding.name} ({holding.weight}%)</li>
              ))}
              {fund.topHoldings.length > 3 && (
                <li>• +{fund.topHoldings.length - 3} more holdings</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link
          to={`/fund/${fund.symbol}`}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center touch-target"
        >
          View Details
        </Link>
        <Link
          to={`/trading/${fund.symbol}`}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center touch-target"
        >
          Trade
        </Link>
      </div>
    </div>
  );
}

export default FundCard;