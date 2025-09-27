import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketUpdate {
  id: string;
  type: 'price-alert' | 'volume-spike' | 'news-impact' | 'technical-signal';
  symbol: string;
  name: string;
  assetType: 'character' | 'comic' | 'creator' | 'publisher';
  message: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  value?: number;
  change?: number;
}

export function LiveMarketFeed() {
  const [updates, setUpdates] = useState<MarketUpdate[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Generate initial updates
    const generateUpdate = (): MarketUpdate => {
      const symbols = ['SPDR', 'BATM', 'AF15', 'TMFS', 'JOKR', 'ASM300', 'WNDR'];
      const names = ['Spider-Man', 'Batman', 'Amazing Fantasy #15', 'Todd McFarlane', 'The Joker', 'Amazing Spider-Man #300', 'Wonder Woman'];
      const types: Array<'character' | 'comic' | 'creator' | 'publisher'> = ['character', 'character', 'comic', 'creator', 'character', 'comic', 'character'];
      
      const updateTypes: Array<'price-alert' | 'volume-spike' | 'news-impact' | 'technical-signal'> = ['price-alert', 'volume-spike', 'news-impact', 'technical-signal'];
      
      const randomIndex = Math.floor(Math.random() * symbols.length);
      const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      const messages = {
        'price-alert': ['broke through resistance at', 'approaching support level at', 'hit new 52-week high at', 'testing key support at'],
        'volume-spike': ['unusual volume spike detected', 'trading volume 3x normal', 'heavy institutional buying', 'significant selling pressure'],
        'news-impact': ['positive media coverage impact', 'movie announcement boost', 'creator interview influence', 'convention announcement effect'],
        'technical-signal': ['bullish breakout pattern', 'bearish divergence signal', 'golden cross formation', 'death cross warning']
      };
      
      const impacts: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
      const impact = impacts[Math.floor(Math.random() * impacts.length)];
      
      return {
        id: `${Date.now()}-${Math.random()}`,
        type: updateType,
        symbol: symbols[randomIndex],
        name: names[randomIndex],
        assetType: types[randomIndex],
        message: messages[updateType][Math.floor(Math.random() * messages[updateType].length)],
        impact,
        timestamp: new Date(),
        value: 1000 + Math.floor(Math.random() * 4000),
        change: (Math.random() - 0.5) * 10
      };
    };

    // Initialize with some updates
    const initialUpdates = Array.from({ length: 6 }, generateUpdate);
    setUpdates(initialUpdates);

    // Add new updates every 4-7 seconds
    const interval = setInterval(() => {
      if (!isPaused) {
        const newUpdate = generateUpdate();
        setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, Math.random() * 3000 + 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price-alert': return '💰';
      case 'volume-spike': return '📊';
      case 'news-impact': return '📰';
      case 'technical-signal': return '📈';
      default: return '⚡';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-l-green-500 bg-green-900/10';
      case 'negative': return 'border-l-red-500 bg-red-900/10';
      default: return 'border-l-yellow-500 bg-yellow-900/10';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-400" />
          <h3 className="font-semibold text-white text-lg">Live Market Feed</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={isPaused ? 'Resume feed' : 'Pause feed'}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {updates.map((update) => (
          <div 
            key={update.id} 
            className={`flex items-start justify-between p-3 rounded-lg border-l-4 ${getImpactColor(update.impact)} transition-all hover:bg-slate-700/20`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg mt-0.5">{getTypeIcon(update.type)}</span>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Link 
                    to={`/${update.assetType}/${update.symbol}`}
                    className="text-white font-medium hover:text-indigo-300 transition-colors"
                  >
                    {update.symbol}
                  </Link>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-400 text-xs capitalize">{update.type.replace('-', ' ')}</span>
                </div>
                <p className="text-gray-300 text-sm">{update.message}</p>
                {update.value && (
                  <p className="text-xs text-gray-400 mt-1">
                    CC {update.value.toLocaleString()}
                    {update.change && (
                      <span className={` ml-2 ${update.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({update.change > 0 ? '+' : ''}{update.change.toFixed(1)}%)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatTime(update.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="text-blue-400 font-medium">
              {updates.filter(u => u.impact === 'positive').length}
            </span>
            <span> positive signals, </span>
            <span className="text-red-400 font-medium">
              {updates.filter(u => u.impact === 'negative').length}
            </span>
            <span> alerts detected</span>
          </div>
          <Link 
            to="/markets"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View All Signals →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LiveMarketFeed;