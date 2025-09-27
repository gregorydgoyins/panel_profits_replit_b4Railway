import React, { useState } from 'react';
import { Briefcase, TrendingUp, TrendingDown, Calendar, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FundCard } from './FundCard';
import { allFunds, themedFunds, customFunds } from '../../data/fundData';
import { Fund } from '../../types';

export function FundList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('performance');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const fundTypes = ['all', 'themed', 'custom'];
  const riskLevels = ['all', 'Low', 'Medium', 'High'];

  // Get funds based on selected type
  const getFundsByType = (): Fund[] => {
    switch (selectedType) {
      case 'themed':
        return themedFunds;
      case 'custom':
        return customFunds;
      default:
        return allFunds;
    }
  };

  const filteredFunds = getFundsByType()
    .filter(fund => {
      const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           fund.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           fund.manager.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = selectedRisk === 'all' || fund.riskLevel === selectedRisk;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'performance':
          return b.ytdReturn - a.ytdReturn;
        case 'nav':
          return b.nav - a.nav;
        case 'aum':
          return b.aum - a.aum;
        case 'expense':
          return a.expenseRatio - b.expenseRatio;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Funds' }]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Fund Marketplace</h1>
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
              placeholder="Search funds..."
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
              {fundTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Types' : `${type.charAt(0).toUpperCase() + type.slice(1)} Funds`}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 touch-target"
          >
            {riskLevels.map(risk => (
              <option key={risk} value={risk}>{risk === 'all' ? 'All Risk Levels' : `${risk} Risk`}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 touch-target"
          >
            <option value="performance">Performance (Best First)</option>
            <option value="nav">NAV (High to Low)</option>
            <option value="aum">AUM (High to Low)</option>
            <option value="expense">Expense Ratio (Low to High)</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            {filteredFunds.length} funds found
          </div>
        </div>
      </div>

      {/* Funds Grid - 3x3 Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredFunds.slice(0, 9).map((fund) => (
          <FundCard 
            key={fund.id}
            fund={fund}
            onSelect={(id) => setSelectedCard(selectedCard === id ? null : id)}
            isSelected={selectedCard === fund.id}
          />
        ))}
      </div>

      {filteredFunds.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No funds found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

export default FundList;