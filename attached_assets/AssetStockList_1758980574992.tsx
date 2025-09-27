import React, { useState } from 'react';
import { Users, Building2, Briefcase, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { AssetCard } from './AssetCard';
import { Character, Location, Gadget } from '../../types';
import { useAssetMarketData } from '../../hooks/useAssetMarketData';
import { Loader } from '../common/Loader';

interface AssetStockListProps {
  assetType: 'character' | 'location' | 'gadget';
  title: string;
  description?: string;
  filters?: {
    typeOptions?: string[];
    typeLabel?: string;
  };
}

export function AssetStockList({ 
  assetType, 
  title, 
  description,
  filters
}: AssetStockListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('marketCap');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Fetch asset data using the new hook
  const { data: assets, isLoading, error } = useAssetMarketData<Character | Location | Gadget>({
    assetType,
    autoRefresh: true,
    refreshInterval: 10000 // 10 seconds
  });

  const ratings = ['all', 'Strong Buy', 'Buy', 'Hold', 'Sell'];

  if (isLoading) {
    return <Loader label={`Loading ${assetType}s...`} />;
  }

  if (error) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl text-center">
        <p className="text-red-400">Error loading {assetType}s: {error}</p>
      </div>
    );
  }

  if (!assets || !Array.isArray(assets)) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl text-center">
        <p className="text-gray-400">No {assetType}s available</p>
      </div>
    );
  }

  // Get icon based on asset type
  const getAssetIcon = () => {
    switch (assetType) {
      case 'character':
        return <Users className="h-8 w-8 text-indigo-400" />;
      case 'location':
        return <Building2 className="h-8 w-8 text-indigo-400" />;
      case 'gadget':
        return <Briefcase className="h-8 w-8 text-indigo-400" />;
      default:
        return <Users className="h-8 w-8 text-indigo-400" />;
    }
  };

  // Filter assets based on selected filters
  const filteredAssets = (assets as (Character | Location | Gadget)[])
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || 
                         (assetType === 'character' && 'characterType' in asset && asset.characterType === selectedType) ||
                         (assetType === 'location' && 'locationType' in asset && asset.locationType === selectedType) ||
                         (assetType === 'gadget'); // No subtypes for gadgets
      
      const matchesRating = selectedRating === 'all' || asset.rating === selectedRating;
      
      return matchesSearch && matchesType && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap;
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.percentageChange - a.percentageChange;
        case 'popularity':
          if ('popularity' in a && 'popularity' in b) {
            return b.popularity - a.popularity;
          }
          return 0;
        case 'mediaAppearances':
          if ('mediaAppearances' in a && 'mediaAppearances' in b) {
            return b.mediaAppearances - a.mediaAppearances;
          }
          return 0;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getAssetIcon()}
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
          <p className="text-gray-300">{description}</p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${assetType}s...`}
              className="pl-10 pr-4 py-2 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target"
            />
          </div>

          {filters && filters.typeOptions && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 w-full touch-target"
              >
                <option value="all">All {filters.typeLabel || 'Types'}</option>
                {filters.typeOptions.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          )}

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 touch-target"
          >
            {ratings.map(rating => (
              <option key={rating} value={rating}>{rating === 'all' ? 'All Ratings' : rating}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 touch-target"
          >
            <option value="marketCap">Market Cap</option>
            <option value="price">Price</option>
            <option value="change">% Change</option>
            {assetType === 'character' && <option value="popularity">Popularity</option>}
            <option value="mediaAppearances">Media Appearances</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            {filteredAssets.length} {assetType}s found
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAssets.map((asset) => (
          <AssetCard 
            key={asset.id}
            asset={asset}
            assetType={assetType}
            onSelect={(id) => setSelectedCard(selectedCard === id ? null : id)}
            isSelected={selectedCard === asset.id}
          />
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          {getAssetIcon()}
          <h3 className="text-xl font-semibold text-white mb-2">No {assetType}s found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

export default AssetStockList;