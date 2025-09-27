import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Info, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchlistActions } from '../../hooks/useAssetMarketData';
import { Character, Location, Gadget } from '../../types';

type Asset = Character | Location | Gadget;

interface AssetCardProps {
  asset: Asset;
  assetType: 'character' | 'location' | 'gadget';
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export function AssetCard({ asset, assetType, onSelect, isSelected }: AssetCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { addToWatchlist, isAdding, lastAdded } = useWatchlistActions();

  // Common properties across all asset types
  const id = asset.id;
  const name = asset.name;
  const symbol = asset.symbol;
  const price = asset.price;
  const change = asset.change;
  const percentageChange = asset.percentageChange;
  const marketCap = asset.marketCap;
  const volume = asset.volume;
  const rating = asset.rating;
  const firstAppearance = 'firstAppearance' in asset ? asset.firstAppearance : '';
  const publisher = 'publisher' in asset ? asset.publisher : '';
  const mediaAppearances = 'mediaAppearances' in asset ? asset.mediaAppearances : 0;
  const description = asset.description || '';

  // Type-specific properties
  const characterType = 'characterType' in asset ? asset.characterType : undefined;
  const locationType = 'locationType' in asset ? asset.locationType : undefined;
  const owner = 'owner' in asset ? asset.owner : undefined;
  const creator = 'creator' in asset ? asset.creator : undefined;
  const powers = 'powers' in asset ? asset.powers : [];
  const nemesis = 'nemesis' in asset ? asset.nemesis : undefined;
  const allies = 'allies' in asset ? asset.allies : [];

  // Get rating color
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

  // Get type icon
  const getTypeIcon = () => {
    if (assetType === 'character') {
      switch (characterType) {
        case 'hero': return '🦸‍♂️';
        case 'villain': return '🦹‍♂️';
        case 'sidekick': return '🤝';
        case 'henchman': return '🧟‍♂️';
        default: return '👤';
      }
    } else if (assetType === 'location') {
      switch (locationType) {
        case 'hangout': return '🏢';
        case 'hideout': return '🏰';
        default: return '🗺️';
      }
    } else if (assetType === 'gadget') {
      return '🔧';
    }
    return '📦';
  };

  // Determine the detail page route based on asset type
  const getDetailRoute = () => {
    switch (assetType) {
      case 'character':
        return `/${characterType}/${symbol}`;
      case 'location':
        return `/${locationType}/${symbol}`;
      case 'gadget':
        return `/gadget/${symbol}`;
      default:
        return '#';
    }
  };

  // Determine the trading route
  const getTradingRoute = () => {
    return `/trading/${symbol}`;
  };

  return (
    <div
      onClick={() => onSelect && onSelect(id)}
      className={`group relative bg-slate-800/90 backdrop-blur-md rounded-xl p-5 sm:p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1 cursor-pointer touch-target
        ${isSelected ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : ''}`}
    >
      {/* Asset Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon()}</span>
            <h3 className="font-bold text-white text-lg">{name}</h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">{symbol} • {publisher}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(rating)}`}>
              {rating}
            </span>
            {assetType === 'character' && characterType && (
              <span className="text-xs text-gray-400 capitalize">{characterType}</span>
            )}
            {assetType === 'location' && locationType && (
              <span className="text-xs text-gray-400 capitalize">{locationType}</span>
            )}
            {assetType === 'gadget' && owner && (
              <span className="text-xs text-gray-400">Owned by {owner}</span>
            )}
          </div>
        </div>
      </div>

      {/* Price and Change */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-gray-400">Current Price</p>
          <p className="text-xl font-bold text-white">CC {price.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {percentageChange > 0 ? (
              <TrendingUp className="h-4 w-4 icon-positive" />
            ) : (
              <TrendingDown className="h-4 w-4 icon-negative" />
            )}
            <span className={`font-semibold ${
              percentageChange > 0 ? 'text-positive' : percentageChange === 0 ? 'text-neutral' : 'text-negative'
            }`}>
              {percentageChange > 0 ? '+' : ''}{percentageChange}%
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {change > 0 ? '+' : ''}CC {change.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Asset Details */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
        <div>
          <p className="text-xs text-gray-400">Market Cap</p>
          <p className="font-semibold text-white text-sm">CC {(marketCap / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">24h Volume</p>
          <p className="font-semibold text-white text-sm">{volume.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">First Appearance</p>
          <p className="font-semibold text-white text-xs">{firstAppearance.split('(')[1]?.replace(')', '') || firstAppearance}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Media Count</p>
          <p className="font-semibold text-white text-sm">{mediaAppearances}</p>
        </div>
      </div>

      {/* Character-specific quick stats */}
      {assetType === 'character' && (
        <div className="mb-5 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400">Powers</p>
              <p className="text-white">{powers.length} abilities</p>
            </div>
            <div>
              <p className="text-gray-400">Universe</p>
              <p className="text-white">{publisher}</p>
            </div>
            {nemesis && (
              <>
                <div className="col-span-1">
                  <p className="text-red-400">Nemesis</p>
                  <p className="text-red-300 truncate">{nemesis}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-green-400">Allies</p>
                  <p className="text-green-300">{allies.length} allies</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Asset Info with Tooltip */}
      <div 
        className="mb-5 bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-indigo-400" />
          <p className="text-sm text-gray-300 line-clamp-2">{description.substring(0, 100)}...</p>
        </div>
        
        {showTooltip && (
          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-slate-800/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700/50">
            <p className="text-sm text-white font-medium mb-1">{name}</p>
            <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
            {assetType === 'character' && 'powers' in asset && (
              <div className="mt-2">
                <p className="text-xs font-medium text-indigo-400">Powers:</p>
                <ul className="text-xs text-gray-300 mt-1 space-y-1">
                  {(asset as Character).powers.slice(0, 3).map((power, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                      <span>{power}</span>
                    </li>
                  ))}
                  {(asset as Character).powers.length > 3 && (
                    <li className="text-indigo-400 text-xs">+{(asset as Character).powers.length - 3} more abilities</li>
                  )}
                </ul>
                {assetType === 'character' && nemesis && (
                  <div className="mt-2 pt-2 border-t border-slate-600/50">
                    <p className="text-xs font-medium text-red-400">Nemesis:</p>
                    <p className="text-xs text-red-300">{nemesis}</p>
                  </div>
                )}
                {assetType === 'character' && allies && allies.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-600/50">
                    <p className="text-xs font-medium text-green-400">Key Allies:</p>
                    <p className="text-xs text-green-300">{allies.slice(0, 2).join(', ')}{allies.length > 2 ? ` +${allies.length - 2} more` : ''}</p>
                  </div>
                )}
              </div>
            )}
            {assetType === 'gadget' && 'capabilities' in asset && (
              <div className="mt-2">
                <p className="text-xs font-medium text-indigo-400">Capabilities:</p>
                <ul className="text-xs text-gray-300 mt-1">
                  {(asset as Gadget).capabilities.slice(0, 3).map((capability, index) => (
                    <li key={index}>• {capability}</li>
                  ))}
                  {(asset as Gadget).capabilities.length > 3 && (
                    <li>• +{(asset as Gadget).capabilities.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToWatchlist(symbol);
          }}
          disabled={isAdding || lastAdded === symbol}
          className={`p-2 rounded-lg transition-colors ${
            lastAdded === symbol
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 hover:bg-yellow-600 text-gray-300 hover:text-white'
          }`}
          title="Add to Watchlist"
        >
          {lastAdded === symbol ? (
            <Check className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </button>
        <Link
          to={getDetailRoute()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center touch-target"
        >
          View Details
        </Link>
        <Link
          to={getTradingRoute()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center touch-target"
        >
          Trade
        </Link>
      </div>
    </div>
  );
}

export default AssetCard;