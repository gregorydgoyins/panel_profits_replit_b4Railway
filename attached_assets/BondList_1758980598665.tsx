import React, { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Calendar, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { BondCard } from './BondCard';
import { allBonds, creatorBonds, publisherBonds, specialtyBonds } from '../../data/bondData';
import { Bond } from '../../types';

export function BondList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('yield');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const bondTypes = ['all', 'creator', 'publisher', 'specialty'];
  const ratings = ['all', 'AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];

  // Get bonds based on selected type
  const getBondsByType = (): Bond[] => {
    switch (selectedType) {
      case 'creator':
        return creatorBonds;
      case 'publisher':
        return publisherBonds;
      case 'specialty':
        return specialtyBonds;
      default:
        return allBonds;
    }
  };

  const filteredBonds = getBondsByType()
    .filter(bond => {
      const matchesSearch = bond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bond.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bond.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = selectedRating === 'all' || bond.creditRating === selectedRating;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'yield':
          return b.yield - a.yield;
        case 'price':
          return b.price - a.price;
        case 'maturity':
          return new Date(a.maturity).getTime() - new Date(b.maturity).getTime();
        case 'rating':
          // Sort by credit rating (AAA is highest)
          const ratingOrder: Record<string, number> = {
            'AAA': 1, 'AA': 2, 'A': 3, 'BBB': 4, 'BB': 5, 'B': 6, 'CCC': 7, 'CC': 8, 'C': 9, 'D': 10
          };
          return ratingOrder[a.creditRating] - ratingOrder[b.creditRating];
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Bonds' }]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Bond Market</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Real-time data</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bonds..."
              className="pl-10 pr-4 py-2 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 w-full touch-target"
            >
              {bondTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Types' : `${type.charAt(0).toUpperCase() + type.slice(1)} Bonds`}</option>
              ))}
            </select>
          </div>

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
            <option value="yield">Yield (High to Low)</option>
            <option value="price">Price (High to Low)</option>
            <option value="maturity">Maturity (Soonest First)</option>
            <option value="rating">Rating (Highest First)</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            {filteredBonds.length} bonds found
          </div>
        </div>
      </div>

      {/* Bonds Grid - 3x3 Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredBonds.slice(0, 9).map((bond) => (
          <BondCard 
            key={bond.id}
            bond={bond}
            onSelect={(id) => setSelectedCard(selectedCard === id ? null : id)}
            isSelected={selectedCard === bond.id}
          />
        ))}
      </div>

      {filteredBonds.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No bonds found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

export default BondList;