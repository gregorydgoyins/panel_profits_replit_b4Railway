import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Award, Calendar, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    symbol: string;
    role: string;
    age: number;
    price: number;
    change: number;
    percentageChange: number;
    marketCap: number;
    volume: number;
    rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
    nextProject?: string;
    recentWorks: string[];
    yearsActive: number;
    awards: number;
    popularity: number;
    avatar?: string;
  };
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export function CreatorCard({ creator, onSelect, isSelected }: CreatorCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Buy':
        return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'Hold':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'Sell':
        return 'bg-red-900/50 text-red-200 border-red-700/50';
      default:
        return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(creator.id)}
      className={`group relative bg-slate-800/90 backdrop-blur-md rounded-xl p-5 sm:p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1 cursor-pointer touch-target
        ${isSelected ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : ''}`}
    >
      {/* Creator Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-20 h-20 rounded-xl object-cover border-2 border-slate-600 shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-2 shadow-lg">
            <Star className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-xl mb-1">{creator.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-1 bg-indigo-900/50 rounded-full text-xs font-medium text-indigo-200 border border-indigo-700/50">
              {creator.symbol}
            </span>
            <span className="text-sm text-gray-300">{creator.role}</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-400">Age:</span>
            <span className="text-sm text-white font-medium">{creator.age} years</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-400">Active:</span>
            <span className="text-sm text-white font-medium">{creator.yearsActive} years</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(creator.rating)}`}>
              {creator.rating}
            </span>
            <div className="flex items-center space-x-2">
              <Award className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-yellow-300 font-medium">{creator.awards} Awards</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-300 font-medium">{creator.popularity}% Popularity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Change */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Current Stock Price</p>
          <p className="text-2xl font-bold text-white">CC {creator.price.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2">
            {creator.change > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`font-semibold ${
              creator.change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {creator.change > 0 ? '+' : ''}{creator.percentageChange}%
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {creator.change > 0 ? '+' : ''}CC {creator.change.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <p className="text-xs text-gray-400">Market Cap</p>
          <p className="font-bold text-white text-sm">CC {(creator.marketCap / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">24h Volume</p>
          <p className="font-bold text-white text-sm">{creator.volume.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Experience</p>
          <p className="font-bold text-white text-sm">{creator.yearsActive} years</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Recognition</p>
          <p className="font-bold text-white text-sm">{creator.awards} awards</p>
        </div>
      </div>

      {/* Recent Works with Tooltip */}
      <div 
        className="mb-6 relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <p className="text-sm font-medium text-white">Recent Projects</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {creator.recentWorks.slice(0, 3).map((work, index) => (
            <span key={index} className="px-3 py-1 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-full text-xs text-indigo-200 border border-indigo-700/50 hover:border-indigo-500/50 transition-colors">
              {work}
            </span>
          ))}
          {creator.recentWorks.length > 3 && (
            <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-gray-400 border border-slate-600/50">
              +{creator.recentWorks.length - 3} more
            </span>
          )}
        </div>
        
        {showTooltip && (
          <div className="absolute z-10 bottom-0 left-1/2 transform translate-y-full -translate-x-1/2 w-72 bg-slate-800/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700/50 mt-2">
            <p className="text-sm text-white font-semibold mb-3">Complete Project Portfolio</p>
            <ul className="space-y-2">
              {creator.recentWorks.map((work, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span className="text-xs text-gray-300">{work}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-600/50">
              <p className="text-xs text-indigo-400 font-medium">Market Impact</p>
              <p className="text-xs text-gray-400">Each project influences creator stock valuation</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Project */}
      {creator.nextProject && (
        <div className="mb-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-700/30">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <h4 className="font-medium text-white">Upcoming Release</h4>
          </div>
          <p className="text-indigo-200 font-medium">{creator.nextProject}</p>
          <p className="text-xs text-indigo-300 mt-1">Expected to drive significant market interest</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Link
          to={`/creator-stock/${creator.symbol}`}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center touch-target transform hover:-translate-y-1 hover:shadow-lg"
        >
          Full Profile
        </Link>
        <Link
          to={`/trading/${creator.symbol}`}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center touch-target transform hover:-translate-y-1 hover:shadow-lg"
        >
          Trade Stock
        </Link>
      </div>
    </div>
  );
}

export default CreatorCard;