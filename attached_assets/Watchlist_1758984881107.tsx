import React, { useState } from 'react';
import { Star, TrendingUp, TrendingDown, Plus, X, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: 'character' | 'creator' | 'publisher' | 'bond' | 'fund' | 'location' | 'gadget';
  price: number;
  change: number;
  percentageChange: number;
  addedAt: Date;
  priceAlerts?: {
    above?: number;
    below?: number;
  };
  notes?: string;
}

interface WatchlistProps {
  userId?: string;
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export function Watchlist({ userId, maxItems, showFilters = true, compact = false }: WatchlistProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [showValues, setShowValues] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [alertAbove, setAlertAbove] = useState<string>('');
  const [alertBelow, setAlertBelow] = useState<string>('');
  
  // Mock watchlist data
  const mockWatchlist: WatchlistItem[] = [
    {
      id: '1',
      symbol: 'ASM300',
      name: 'Amazing Spider-Man #300',
      type: 'character',
      price: 2500,
      change: 125,
      percentageChange: 5.2,
      addedAt: new Date('2024-05-15'),
      priceAlerts: {
        above: 2700,
        below: 2300
      },
      notes: 'First full appearance of Venom. Watching for movie news.'
    },
    {
      id: '2',
      symbol: 'TMFS',
      name: 'Todd McFarlane',
      type: 'creator',
      price: 1850,
      change: -37,
      percentageChange: -2.0,
      addedAt: new Date('2024-05-10'),
      priceAlerts: {
        above: 2000
      },
      notes: 'New Spawn project announced soon.'
    },
    {
      id: '3',
      symbol: 'BATM',
      name: 'Batman',
      type: 'character',
      price: 4200,
      change: 210,
      percentageChange: 5.3,
      addedAt: new Date('2024-05-05'),
      notes: 'Upcoming movie release in Q3.'
    },
    {
      id: '4',
      symbol: 'MRVLB',
      name: 'Marvel Entertainment Bond',
      type: 'bond',
      price: 1035.50,
      change: 8.25,
      percentageChange: 0.80,
      addedAt: new Date('2024-05-01')
    },
    {
      id: '5',
      symbol: 'SHUF',
      name: 'Superhero Universe Fund',
      type: 'fund',
      price: 25.75,
      change: 0.45,
      percentageChange: 1.78,
      addedAt: new Date('2024-04-28')
    }
  ];
  
  // Filter watchlist based on search and type
  const filteredWatchlist = mockWatchlist
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded':
          return b.addedAt.getTime() - a.addedAt.getTime();
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.percentageChange - a.percentageChange;
        default:
          return 0;
      }
    })
    .slice(0, maxItems);
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return '👤';
      case 'creator': return '👨‍🎨';
      case 'publisher': return '🏢';
      case 'bond': return '📜';
      case 'fund': return '📊';
      case 'location': return '🗺️';
      case 'gadget': return '🔧';
      default: return '📦';
    }
  };
  
  // Handle removing item from watchlist
  const handleRemove = (id: string) => {
    // In a real app, this would call an API to remove the item
    console.log(`Removing item ${id} from watchlist`);
  };
  
  // Handle editing notes
  const startEditing = (item: WatchlistItem) => {
    setEditingItem(item.id);
    setEditNote(item.notes || '');
    setAlertAbove(item.priceAlerts?.above?.toString() || '');
    setAlertBelow(item.priceAlerts?.below?.toString() || '');
  };
  
  const saveEdits = (id: string) => {
    // In a real app, this would call an API to update the item
    console.log(`Saving edits for item ${id}`, {
      notes: editNote,
      priceAlerts: {
        above: alertAbove ? parseFloat(alertAbove) : undefined,
        below: alertBelow ? parseFloat(alertBelow) : undefined
      }
    });
    setEditingItem(null);
  };
  
  const cancelEdits = () => {
    setEditingItem(null);
  };
  
  // Handle adding new item to watchlist
  const [newSymbol, setNewSymbol] = useState('');
  
  const handleAddItem = () => {
    if (!newSymbol) return;
    
    // In a real app, this would call an API to add the item
    console.log(`Adding symbol ${newSymbol} to watchlist`);
    setNewSymbol('');
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Watchlist</h2>
        </div>
        
        {showFilters && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-2 rounded-lg bg-slate-700/50 text-gray-300 hover:text-white transition-colors"
              aria-label={showValues ? 'Hide values' : 'Show values'}
            >
              {showValues ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>
      
      {/* Add new item */}
      <div className="mb-6 flex space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="Enter symbol to add..."
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <button
          onClick={handleAddItem}
          disabled={!newSymbol}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search watchlist..."
              className="pl-10 pr-4 py-2 w-full bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2 w-full"
            >
              <option value="all">All Types</option>
              <option value="character">Characters</option>
              <option value="creator">Creators</option>
              <option value="publisher">Publishers</option>
              <option value="bond">Bonds</option>
              <option value="fund">Funds</option>
              <option value="location">Locations</option>
              <option value="gadget">Gadgets</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
          >
            <option value="dateAdded">Date Added</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="price">Price (High to Low)</option>
            <option value="change">% Change</option>
          </select>
        </div>
      )}
      
      {/* Watchlist items */}
      <div className="space-y-4">
        {filteredWatchlist.length > 0 ? (
          filteredWatchlist.map((item) => (
            <div key={item.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
              {editingItem === item.id ? (
                // Edit mode
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.symbol} • {getTypeIcon(item.type)} {item.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveEdits(item.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdits}
                        className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Alert Above (CC)
                      </label>
                      <input
                        type="number"
                        value={alertAbove}
                        onChange={(e) => setAlertAbove(e.target.value)}
                        placeholder="No alert"
                        className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Alert Below (CC)
                      </label>
                      <input
                        type="number"
                        value={alertBelow}
                        onChange={(e) => setAlertBelow(e.target.value)}
                        placeholder="No alert"
                        className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Add notes about this asset..."
                      className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg px-4 py-2 text-white h-24"
                    />
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/${item.type}/${item.symbol}`} className="font-semibold text-white hover:text-indigo-300 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-400">{item.symbol} • {getTypeIcon(item.type)} {item.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        aria-label="Edit"
                      >
                        <Star className="h-5 w-5 text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Remove from watchlist"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-400">Current Price</p>
                      <p className="font-semibold text-white">
                        {showValues ? `CC ${item.price.toLocaleString()}` : '••••••'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">24h Change</p>
                      <div className="flex items-center">
                        {item.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <p className={`font-semibold ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.change > 0 ? '+' : ''}{item.percentageChange}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Alerts</p>
                      <div className="text-sm">
                        {item.priceAlerts?.above && (
                          <span className="text-green-400">Above: CC {item.priceAlerts.above.toLocaleString()}</span>
                        )}
                        {item.priceAlerts?.above && item.priceAlerts?.below && (
                          <span className="mx-1">|</span>
                        )}
                        {item.priceAlerts?.below && (
                          <span className="text-red-400">Below: CC {item.priceAlerts.below.toLocaleString()}</span>
                        )}
                        {!item.priceAlerts?.above && !item.priceAlerts?.below && (
                          <span className="text-gray-400">None set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Added</p>
                      <p className="text-gray-300">
                        {item.addedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-4 bg-slate-600/30 p-3 rounded-lg border border-slate-500/30">
                      <p className="text-sm text-gray-300">{item.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/trading/${item.symbol}`}
                      className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      <span>Trade</span>
                      <TrendingUp className="h-4 w-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-slate-700/30 rounded-lg">
            <Star className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Your watchlist is empty</p>
            <p className="text-sm text-gray-500">Add assets to track their performance</p>
          </div>
        )}
      </div>
      
      {filteredWatchlist.length > 0 && filteredWatchlist.length < mockWatchlist.length && (
        <div className="mt-6 text-center">
          <button className="text-indigo-400 hover:text-indigo-300 text-sm">
            View All Watchlist Items →
          </button>
        </div>
      )}
    </div>
  );
}

export default Watchlist;