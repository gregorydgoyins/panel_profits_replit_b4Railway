import React, { useState } from 'react';
import { 
  BookOpen, TrendingUp, TrendingDown, Filter, Search, Calendar, 
  Tag, Edit, Trash2, Save, X, Plus, BarChart2, PieChart 
} from 'lucide-react';

interface TradeEntry {
  id: string;
  date: Date;
  symbol: string;
  name: string;
  type: 'character' | 'creator' | 'publisher' | 'bond' | 'fund' | 'location' | 'gadget';
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  exitPrice?: number;
  exitDate?: Date;
  pnl?: number;
  pnlPercentage?: number;
  strategy: string[];
  notes: string;
  emotions: 'neutral' | 'confident' | 'fearful' | 'greedy' | 'uncertain';
}

interface TradingJournalProps {
  userId?: string;
  maxEntries?: number;
  showFilters?: boolean;
  showAnalytics?: boolean;
}

export function TradingJournal({ 
  userId, 
  maxEntries, 
  showFilters = true, 
  showAnalytics = true 
}: TradingJournalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStrategy, setEditStrategy] = useState<string[]>([]);
  const [editEmotions, setEditEmotions] = useState<'neutral' | 'confident' | 'fearful' | 'greedy' | 'uncertain'>('neutral');
  const [activeTab, setActiveTab] = useState<'entries' | 'analytics'>('entries');
  
  // Mock trade entries
  const mockTradeEntries: TradeEntry[] = [
    {
      id: '1',
      date: new Date('2024-05-15T10:30:00'),
      symbol: 'ASM300',
      name: 'Amazing Spider-Man #300',
      type: 'character',
      action: 'buy',
      quantity: 2,
      price: 2400,
      strategy: ['trend-following', 'news-catalyst'],
      notes: 'Bought based on upcoming Venom movie news. Expecting significant price increase over next 3 months.',
      emotions: 'confident'
    },
    {
      id: '2',
      date: new Date('2024-05-10T14:45:00'),
      symbol: 'TMFS',
      name: 'Todd McFarlane',
      type: 'creator',
      action: 'buy',
      quantity: 50,
      price: 1800,
      strategy: ['value-investing'],
      notes: 'Undervalued based on upcoming projects and historical performance.',
      emotions: 'confident'
    },
    {
      id: '3',
      date: new Date('2024-05-05T09:15:00'),
      symbol: 'BATM',
      name: 'Batman',
      type: 'character',
      action: 'sell',
      quantity: 1,
      price: 4300,
      exitPrice: 4300,
      exitDate: new Date('2024-05-05T09:15:00'),
      pnl: 300,
      pnlPercentage: 7.5,
      strategy: ['profit-taking'],
      notes: 'Taking profits after significant run-up following movie announcement.',
      emotions: 'greedy'
    },
    {
      id: '4',
      date: new Date('2024-04-28T11:30:00'),
      symbol: 'MRVLB',
      name: 'Marvel Entertainment Bond',
      type: 'bond',
      action: 'buy',
      quantity: 10,
      price: 1030.25,
      strategy: ['income-generation', 'diversification'],
      notes: 'Adding bonds to portfolio for income and diversification.',
      emotions: 'neutral'
    },
    {
      id: '5',
      date: new Date('2024-04-20T15:20:00'),
      symbol: 'SPDR',
      name: 'Spider-Man',
      type: 'character',
      action: 'buy',
      quantity: 3,
      price: 3500,
      strategy: ['dip-buying'],
      notes: 'Buying the dip after temporary price decline. Strong fundamentals remain intact.',
      emotions: 'confident'
    },
    {
      id: '6',
      date: new Date('2024-04-15T10:05:00'),
      symbol: 'DCCP',
      name: 'DC Comics',
      type: 'publisher',
      action: 'sell',
      quantity: 25,
      price: 3600,
      exitPrice: 3600,
      exitDate: new Date('2024-04-15T10:05:00'),
      pnl: -5000,
      pnlPercentage: -5.3,
      strategy: ['stop-loss'],
      notes: 'Triggered stop-loss after negative earnings announcement.',
      emotions: 'fearful'
    },
    {
      id: '7',
      date: new Date('2024-04-10T13:45:00'),
      symbol: 'JLES',
      name: 'Jim Lee',
      type: 'creator',
      action: 'buy',
      quantity: 40,
      price: 2150,
      strategy: ['value-investing', 'news-catalyst'],
      notes: 'Bought after announcement of new DC project. Expecting significant upside.',
      emotions: 'confident'
    }
  ];
  
  // Filter trade entries
  const filteredEntries = mockTradeEntries
    .filter(entry => {
      // Search filter
      const matchesSearch = entry.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = selectedType === 'all' || entry.type === selectedType;
      
      // Action filter
      const matchesAction = selectedAction === 'all' || entry.action === selectedAction;
      
      // Strategy filter
      const matchesStrategy = selectedStrategy === 'all' || entry.strategy.includes(selectedStrategy);
      
      // Date range filter
      let matchesDateRange = true;
      const now = new Date();
      if (selectedDateRange === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDateRange = entry.date >= sevenDaysAgo;
      } else if (selectedDateRange === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDateRange = entry.date >= thirtyDaysAgo;
      } else if (selectedDateRange === '90d') {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        matchesDateRange = entry.date >= ninetyDaysAgo;
      }
      
      return matchesSearch && matchesType && matchesAction && matchesStrategy && matchesDateRange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'pnl':
          const aPnl = a.pnlPercentage || 0;
          const bPnl = b.pnlPercentage || 0;
          return bPnl - aPnl;
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    })
    .slice(0, maxEntries);
  
  // Get all unique strategies
  const allStrategies = Array.from(
    new Set(mockTradeEntries.flatMap(entry => entry.strategy))
  );
  
  // Handle editing entry
  const startEditing = (entry: TradeEntry) => {
    setEditingEntry(entry.id);
    setEditNotes(entry.notes);
    setEditStrategy(entry.strategy);
    setEditEmotions(entry.emotions);
  };
  
  const saveEdits = (id: string) => {
    // In a real app, this would call an API to update the entry
    console.log(`Saving edits for entry ${id}`, {
      notes: editNotes,
      strategy: editStrategy,
      emotions: editEmotions
    });
    setEditingEntry(null);
  };
  
  const cancelEdits = () => {
    setEditingEntry(null);
  };
  
  // Handle deleting entry
  const deleteEntry = (id: string) => {
    // In a real app, this would call an API to delete the entry
    console.log(`Deleting entry ${id}`);
  };
  
  // Generate analytics data
  const generateAnalytics = () => {
    // Win rate
    const closedTrades = mockTradeEntries.filter(entry => entry.pnl !== undefined);
    const winningTrades = closedTrades.filter(entry => (entry.pnl || 0) > 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    // P&L by asset type
    const pnlByType = mockTradeEntries
      .filter(entry => entry.pnl !== undefined)
      .reduce((acc, entry) => {
        const type = entry.type;
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += entry.pnl || 0;
        return acc;
      }, {} as Record<string, number>);
    
    const pnlByTypeData = Object.entries(pnlByType).map(([name, value]) => ({
      name,
      value: Math.abs(value),
      isPositive: value >= 0
    }));
    
    // Strategy performance
    const strategyPerformance = allStrategies.map(strategy => {
      const tradesWithStrategy = mockTradeEntries.filter(
        entry => entry.strategy.includes(strategy) && entry.pnl !== undefined
      );
      
      const totalPnl = tradesWithStrategy.reduce((sum, entry) => sum + (entry.pnl || 0), 0);
      const avgPnl = tradesWithStrategy.length > 0 ? totalPnl / tradesWithStrategy.length : 0;
      const strategyWinRate = tradesWithStrategy.length > 0 
        ? (tradesWithStrategy.filter(entry => (entry.pnl || 0) > 0).length / tradesWithStrategy.length) * 100 
        : 0;
      
      return {
        name: strategy,
        trades: tradesWithStrategy.length,
        winRate: strategyWinRate,
        avgPnl,
        totalPnl
      };
    }).sort((a, b) => b.totalPnl - a.totalPnl);
    
    // Emotions analysis
    const emotionsData = mockTradeEntries.reduce((acc, entry) => {
      if (!acc[entry.emotions]) {
        acc[entry.emotions] = { count: 0, pnl: 0, trades: 0 };
      }
      acc[entry.emotions].count += 1;
      acc[entry.emotions].pnl += entry.pnl || 0;
      if (entry.pnl !== undefined) {
        acc[entry.emotions].trades += 1;
      }
      return acc;
    }, {} as Record<string, { count: number, pnl: number, trades: number }>);
    
    const emotionsChartData = Object.entries(emotionsData).map(([name, data]) => ({
      name,
      value: data.count,
      avgPnl: data.trades > 0 ? data.pnl / data.trades : 0
    }));
    
    return {
      winRate,
      pnlByTypeData,
      strategyPerformance,
      emotionsChartData
    };
  };
  
  // Placeholder for analytics data
  const analytics = { winRate: 0, pnlByTypeData: [], strategyPerformance: [], emotionsChartData: [] };
  
  // Colors for charts
  const COLORS = ['#818cf8', '#22c55e', '#eab308', '#ec4899', '#14b8a6'];
  
  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'confident': return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'fearful': return 'bg-red-900/50 text-red-200 border-red-700/50';
      case 'greedy': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'uncertain': return 'bg-purple-900/50 text-purple-200 border-purple-700/50';
      default: return 'bg-slate-700/50 text-gray-200 border-slate-600/50';
    }
  };
  
  // Get strategy badges
  const renderStrategyBadges = (strategies: string[]) => {
    return strategies.map(strategy => (
      <span 
        key={strategy} 
        className="px-2 py-1 bg-indigo-900/50 rounded text-xs text-indigo-200 border border-indigo-700/50"
      >
        {strategy}
      </span>
    ));
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Trading Journal</h2>
        </div>
        
        {showAnalytics && (
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('entries')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'entries'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
              }`}
            >
              Journal Entries
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20 hover:text-white'
              }`}
            >
              Analytics
            </button>
          </div>
        )}
      </div>
      
      {activeTab === 'entries' && (
        <>
          {/* Add new entry button */}
          <div className="mb-6">
            <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
              <span>Add New Trade Entry</span>
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
                  placeholder="Search journal entries..."
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
                  <option value="all">All Asset Types</option>
                  <option value="character">Characters</option>
                  <option value="creator">Creators</option>
                  <option value="publisher">Publishers</option>
                  <option value="bond">Bonds</option>
                  <option value="fund">Funds</option>
                </select>
              </div>
              
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
              >
                <option value="all">All Actions</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          )}
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
              >
                <option value="all">All Strategies</option>
                {allStrategies.map(strategy => (
                  <option key={strategy} value={strategy}>{strategy}</option>
                ))}
              </select>
              
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
              >
                <option value="date">Date (Newest First)</option>
                <option value="symbol">Symbol (A-Z)</option>
                <option value="pnl">P&L (Highest First)</option>
                <option value="price">Price (Highest First)</option>
              </select>
            </div>
          )}
          
          {/* Journal entries */}
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div key={entry.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
                  {editingEntry === entry.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{entry.name}</h3>
                          <p className="text-sm text-gray-400">{entry.symbol} • {entry.action.toUpperCase()} • {entry.quantity} @ CC {entry.price.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEdits(entry.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={cancelEdits}
                            className="flex items-center space-x-1 px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Strategy Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {allStrategies.map(strategy => (
                            <button
                              key={strategy}
                              onClick={() => {
                                if (editStrategy.includes(strategy)) {
                                  setEditStrategy(editStrategy.filter(s => s !== strategy));
                                } else {
                                  setEditStrategy([...editStrategy, strategy]);
                                }
                              }}
                              className={`px-2 py-1 rounded text-xs border transition-colors ${
                                editStrategy.includes(strategy)
                                  ? 'bg-indigo-900/50 text-indigo-200 border-indigo-700/50'
                                  : 'bg-slate-700/50 text-gray-300 border-slate-600/50'
                              }`}
                            >
                              {strategy}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add new strategy tag..."
                          className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg px-4 py-2 text-white mb-4"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              setEditStrategy([...editStrategy, e.currentTarget.value]);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Emotional State
                        </label>
                        <select
                          value={editEmotions}
                          onChange={(e) => setEditEmotions(e.target.value as any)}
                          className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg px-4 py-2 text-white mb-4"
                        >
                          <option value="neutral">Neutral</option>
                          <option value="confident">Confident</option>
                          <option value="fearful">Fearful</option>
                          <option value="greedy">Greedy</option>
                          <option value="uncertain">Uncertain</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes about this trade..."
                          className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg px-4 py-2 text-white h-24"
                        />
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              entry.action === 'buy' 
                                ? 'bg-green-900/50 text-green-200 border border-green-700/50' 
                                : 'bg-red-900/50 text-red-200 border border-red-700/50'
                            }`}>
                              {entry.action.toUpperCase()}
                            </span>
                            <h3 className="font-semibold text-white">{entry.name}</h3>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{entry.symbol} • {entry.type} • {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(entry)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Quantity</p>
                          <p className="font-semibold text-white">{entry.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Price</p>
                          <p className="font-semibold text-white">CC {entry.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total</p>
                          <p className="font-semibold text-white">CC {(entry.quantity * entry.price).toLocaleString()}</p>
                        </div>
                        {entry.pnl !== undefined && (
                          <div>
                            <p className="text-sm text-gray-400">P&L</p>
                            <div className="flex items-center">
                              {entry.pnl > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                              )}
                              <p className={`font-semibold ${entry.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {entry.pnl > 0 ? '+' : ''}CC {entry.pnl.toLocaleString()} ({entry.pnl > 0 ? '+' : ''}{entry.pnlPercentage}%)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag className="h-4 w-4 text-indigo-400" />
                          <p className="text-sm text-gray-400">Strategy:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {renderStrategyBadges(entry.strategy)}
                        </div>
                      </div>
                      
                      {entry.emotions && (
                        <div className="mt-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(entry.emotions)}`}>
                            Emotional State: {entry.emotions.charAt(0).toUpperCase() + entry.emotions.slice(1)}
                          </span>
                        </div>
                      )}
                      
                      {entry.notes && (
                        <div className="mt-4 bg-slate-600/30 p-3 rounded-lg border border-slate-500/30">
                          <p className="text-sm text-gray-300">{entry.notes}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-slate-700/30 rounded-lg">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No journal entries found</p>
                <p className="text-sm text-gray-500">Add trades to your journal to track your performance</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'analytics' && showAnalytics && (
        <div className="space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-white">{analytics.winRate.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Total Trades</p>
              <p className="text-xl font-bold text-white">{mockTradeEntries.length}</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Avg. Holding Time</p>
              <p className="text-xl font-bold text-white">12.5 days</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Risk/Reward Ratio</p>
              <p className="text-xl font-bold text-white">1:2.3</p>
            </div>
          </div>
          
          {/* P&L by Asset Type */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="font-medium text-white mb-4">P&L by Asset Type</h3>
            <div className="h-64 text-center flex items-center justify-center">
              <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">P&L by Asset Type Chart</p>
            </div>
          </div>
          
          {/* Strategy Performance */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="font-medium text-white mb-4">Strategy Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-600/50">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Strategy</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Trades</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Win Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Avg. P&L</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/50">
                  {analytics.strategyPerformance.map((strategy, index) => (
                    <tr key={strategy.name} className={index % 2 === 0 ? 'bg-slate-700/30' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{strategy.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">{strategy.trades}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">{strategy.winRate.toFixed(1)}%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <span className={strategy.avgPnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {strategy.avgPnl >= 0 ? '+' : ''}CC {strategy.avgPnl.toFixed(0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <span className={strategy.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {strategy.totalPnl >= 0 ? '+' : ''}CC {strategy.totalPnl.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Emotions Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Placeholder for Emotions Analysis Chart */}
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 text-center h-64 flex items-center justify-center">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Emotions Analysis Chart</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="font-medium text-white mb-4">Emotions vs. Performance</h3>
              <div className="h-64">
                <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Emotions vs. Performance Chart</p>
              </div>
            </div>
          </div>
          
          {/* Insights */}
          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
            <h3 className="font-medium text-white mb-3">Trading Insights</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Your most profitable strategy is <strong>trend-following</strong> with an average P&L of CC 300 per trade.</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Trades made with <strong>confident</strong> emotional state have a 75% win rate.</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingDown className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Trades made with <strong>fearful</strong> emotional state have a 30% win rate.</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>Character</strong> assets have been your most profitable category.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TradingJournal;