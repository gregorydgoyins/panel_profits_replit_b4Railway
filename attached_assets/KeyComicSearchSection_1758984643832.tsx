import React, { useState } from 'react';
import { BookOpen, Search, TrendingUp, TrendingDown, Plus, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAssetSearch, useWatchlistActions } from '../../hooks/useAssetMarketData';

export function KeyComicSearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedPublisher, setSelectedPublisher] = useState('all');
  const { results: searchResults, isLoading: searchLoading } = useAssetSearch(searchQuery);
  const { addToWatchlist, isAdding, lastAdded } = useWatchlistActions();

  // Quick access comics for display
  const quickAccessComics = [
    { symbol: 'ACM1', title: 'Action Comics #1', price: 3200000, change: 4.06 },
    { symbol: 'DTM27', title: 'Detective Comics #27', price: 2800000, change: 3.13 },
    { symbol: 'AF15', title: 'Amazing Fantasy #15', price: 1800000, change: 5.57 },
    { symbol: 'ASM300', title: 'Amazing Spider-Man #300', price: 2500, change: 5.26 }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Key Comic Pricing Search</h2>
        <div className="ml-auto">
          <span className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-xs border border-indigo-700/50">
            Panel Profits Pricing
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, symbol, or character..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="bg-slate-700/50 text-white border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Ages</option>
              <option value="golden">Golden Age</option>
              <option value="silver">Silver Age</option>
              <option value="bronze">Bronze Age</option>
              <option value="modern">Modern Age</option>
            </select>
            
            <select 
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="bg-slate-700/50 text-white border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Publishers</option>
              <option value="marvel">Marvel</option>
              <option value="dc">DC Comics</option>
              <option value="image">Image</option>
            </select>
          </div>
          
          <Link
            to="/key-comics"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors text-center"
          >
            Advanced Search
          </Link>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="font-medium text-white mb-4">
            {searchQuery ? 'Search Results' : 'Quick Price Lookup'}
          </h3>
          
          {searchLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : searchQuery && searchResults ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {searchResults.slice(0, 4).map((comic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Link to={`/key-comics`} className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{comic.title || comic.name}</p>
                        <p className="text-xs text-gray-400">{comic.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">CC {(comic.currentPrice || comic.price)?.toLocaleString()}</p>
                        <p className={`text-sm ${(comic.percentChange || comic.change) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(comic.percentChange || comic.change) > 0 ? '+' : ''}{(comic.percentChange || comic.change)?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-3">
                    <button
                      onClick={() => addToWatchlist(comic.symbol)}
                      disabled={isAdding || lastAdded === comic.symbol}
                      className={`p-2 rounded-lg transition-colors ${
                        lastAdded === comic.symbol
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-indigo-600 text-gray-300 hover:text-white'
                      }`}
                      title="Add to Watchlist"
                    >
                      {lastAdded === comic.symbol ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {searchResults.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No results found</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {quickAccessComics.map((comic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Link to={`/key-comics`} className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{comic.title}</p>
                        <p className="text-xs text-gray-400">{comic.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">CC {comic.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-1">
                          {comic.change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-400" />
                          )}
                          <p className={`text-sm ${comic.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {comic.change > 0 ? '+' : ''}{comic.change}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="ml-3">
                    <button
                      onClick={() => addToWatchlist(comic.symbol)}
                      disabled={isAdding || lastAdded === comic.symbol}
                      className={`p-2 rounded-lg transition-colors ${
                        lastAdded === comic.symbol
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-indigo-600 text-gray-300 hover:text-white'
                      }`}
                      title="Add to Watchlist"
                    >
                      {lastAdded === comic.symbol ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Link 
            to="/key-comics"
            className="block w-full mt-4 bg-slate-600 hover:bg-slate-700 text-white text-center py-2 rounded-lg transition-colors"
          >
            View All Key Comics
          </Link>
        </div>
      </div>
    </div>
  );
}

export default KeyComicSearchSection;