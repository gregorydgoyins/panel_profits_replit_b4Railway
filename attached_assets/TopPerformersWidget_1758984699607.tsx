import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Star, Calendar, Users, Flame, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketOverview, useWatchlistActions } from '../../hooks/useAssetMarketData';

interface TopPerformer {
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  change: number;
  percentChange: number;
  price: number;
  volume: number;
  reason: string;
}

export function TopPerformersWidget() {
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m'>('1d');
  const [category, setCategory] = useState<'all' | 'characters' | 'comics' | 'creators'>('all');
  const { marketData } = useMarketOverview();
  const { addToWatchlist, isAdding, lastAdded } = useWatchlistActions();

  // Generate top performers data
  const generateTopPerformers = (): { gainers: TopPerformer[]; losers: TopPerformer[] } => {
    const gainers: TopPerformer[] = [
      {
        symbol: 'ASM300',
        name: 'Amazing Spider-Man #300',
        type: 'comic',
        change: 425,
        percentChange: 8.5,
        price: 2650,
        volume: 1850,
        reason: 'Venom movie sequel confirmed'
      },
      {
        symbol: 'BATM',
        name: 'Batman',
        type: 'character',
        change: 262,
        percentChange: 6.2,
        price: 4462,
        volume: 3200,
        reason: 'The Batman Part II announcement'
      },
      {
        symbol: 'TMFS',
        name: 'Todd McFarlane',
        type: 'creator',
        change: 113.64,
        percentChange: 5.8,
        price: 1958,
        volume: 1250,
        reason: 'Spawn Universe expansion deal'
      },
      {
        symbol: 'SPDR',
        name: 'Spider-Man',
        type: 'character',
        change: 195.36,
        percentChange: 5.3,
        price: 3686,
        volume: 2500,
        reason: 'Spider-Man 4 production start'
      },
      {
        symbol: 'WNDR',
        name: 'Wonder Woman',
        type: 'character',
        change: 195.22,
        percentChange: 4.9,
        price: 3986,
        volume: 2100,
        reason: 'Wonder Woman 3 director announced'
      }
    ];

    const losers: TopPerformer[] = [
      {
        symbol: 'LEXL',
        name: 'Lex Luthor',
        type: 'character',
        change: -116.16,
        percentChange: -3.2,
        price: 3488,
        volume: 1800,
        reason: 'Superman reboot casting controversy'
      },
      {
        symbol: 'ARTS',
        name: 'Stanley Artgerm Lau',
        type: 'creator',
        change: -40.83,
        percentChange: -2.8,
        price: 1459,
        volume: 750,
        reason: 'Exclusive contract renewal uncertainty'
      },
      {
        symbol: 'BMBS',
        name: 'Brian Michael Bendis',
        type: 'creator',
        change: -43.22,
        percentChange: -2.1,
        price: 2058,
        volume: 890,
        reason: 'Project delay announcement'
      }
    ];

    return { gainers, losers };
  };

  const { gainers, losers } = generateTopPerformers();
  const [activeList, setActiveList] = useState<'gainers' | 'losers'>('gainers');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return '👤';
      case 'comic': return '📚';
      case 'creator': return '👨‍🎨';
      case 'publisher': return '🏢';
      default: return '📊';
    }
  };

  const displayList = activeList === 'gainers' ? gainers : losers;

  if (!displayList || displayList.length === 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-slate-700/50 rounded animate-pulse" />
          <div className="w-32 h-6 bg-slate-700/50 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700/50 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-slate-700/50 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-slate-700/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h3 className="font-semibold text-white text-lg">Top Performers</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-xs text-gray-400">Hot Assets</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveList('gainers')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeList === 'gainers'
              ? 'bg-green-600 text-white'
              : 'bg-slate-700/50 text-gray-300 hover:bg-green-600/20'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Top Gainers</span>
        </button>
        <button
          onClick={() => setActiveList('losers')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeList === 'losers'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700/50 text-gray-300 hover:bg-red-600/20'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          <span>Top Losers</span>
        </button>
      </div>

      {/* Timeframe selector */}
      <div className="flex space-x-1 mb-4">
        {[
          { id: '1d', label: '24H' },
          { id: '1w', label: '1W' },
          { id: '1m', label: '1M' }
        ].map(period => (
          <button
            key={period.id}
            onClick={() => setTimeframe(period.id as any)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              timeframe === period.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {displayList.map((performer, index) => (
          <div 
            key={performer.symbol} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-slate-700/30 ${
              activeList === 'gainers' ? 'bg-green-900/10 border-green-700/30' : 'bg-red-900/10 border-red-700/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold ${
                  activeList === 'gainers' ? 'text-green-400' : 'text-red-400'
                }`}>
                  #{index + 1}
                </span>
                <span className="text-lg">{getTypeIcon(performer.type)}</span>
              </div>
              <div>
                <Link 
                  to={`/${performer.type}/${performer.symbol}`}
                  className="text-white font-medium hover:text-indigo-300 transition-colors"
                >
                  {performer.symbol}
                </Link>
                <p className="text-xs text-gray-400">{performer.name}</p>
                <p className="text-xs text-gray-500 mt-1">{performer.reason}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                {performer.percentChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={`font-medium ${activeList === 'gainers' ? 'text-green-400' : 'text-red-400'}`}>
                  {performer.percentChange > 0 ? '+' : ''}{performer.percentChange}%
                </span>
              </div>
              <p className="text-sm text-white">CC {performer.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopPerformersWidget;