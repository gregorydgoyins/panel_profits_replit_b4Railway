import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bond } from '../../types';

interface BondCardProps {
  bond: Bond;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export function BondCard({ bond, onSelect, isSelected }: BondCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA':
      case 'AA':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'A':
        return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'BBB':
      case 'BB':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'B':
      case 'CCC':
      case 'CC':
      case 'C':
      case 'D':
        return 'bg-red-900/50 text-red-200 border-red-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'High':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creator':
        return '👨‍🎨';
      case 'publisher':
        return '🏢';
      case 'specialty':
        return '🔍';
      default:
        return '📊';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(bond.id)}
      className={`group relative bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1 cursor-pointer touch-target
        ${isSelected ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : ''}`}
    >
      {/* Bond Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon(bond.type)}</span>
            <h3 className="font-bold text-white text-lg">{bond.name}</h3>
          </div>
          <p className="text-sm text-gray-400">{bond.symbol} • {bond.type} bond</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(bond.creditRating)}`}>
              {bond.creditRating}
            </span>
            <span className="text-xs text-gray-400">{bond.issuer}</span>
          </div>
        </div>
      </div>

      {/* Price and Change */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Current Price</p>
          <p className="text-xl font-bold text-white">CC {bond.price.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {bond.change > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`font-semibold ${
              bond.change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {bond.change > 0 ? '+' : ''}{bond.percentageChange}%
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {bond.change > 0 ? '+' : ''}CC {bond.change.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bond Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">Yield</p>
          <p className="font-semibold text-green-400">{bond.yield}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Maturity</p>
          <p className="font-semibold text-white">
            {new Date(bond.maturity).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Coupon</p>
          <p className="font-semibold text-white">{bond.couponRate}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Face Value</p>
          <p className="font-semibold text-white">CC {bond.faceValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Bond Info with Tooltip */}
      <div 
        className="mb-4 bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-300">Risk Level:</p>
          <p className={`text-sm font-medium ${getRiskLevelColor(bond.riskLevel)}`}>
            {bond.riskLevel}
          </p>
        </div>
        
        {showTooltip && (
          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700">
            <p className="text-sm text-white font-medium mb-1">{bond.description}</p>
            <p className="text-xs text-gray-300">Interest paid {bond.interestFrequency.toLowerCase()}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link
          to={`/bond/${bond.symbol}`}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center touch-target"
        >
          View Details
        </Link>
        <Link
          to={`/trading/${bond.symbol}`}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center touch-target"
        >
          Trade
        </Link>
      </div>
    </div>
  );
}

export default BondCard;