import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TradeActivity {
  id: string;
  symbol: string;
  name: string;
  type: 'character' | 'creator' | 'publisher' | 'bond' | 'fund';
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  traderName: string;
  impact: 'large' | 'medium' | 'small';
}

interface TradingActivityFeedProps {
  className?: string;
}

export function TradingActivityFeed({ className = '' }: TradingActivityFeedProps) {
  const [activities, setActivities] = useState<TradeActivity[]>([]);
  const [showTraderNames, setShowTraderNames] = useState(false);

  // Generate mock trading activities
  useEffect(() => {
    const generateActivity = (): TradeActivity => {
      const symbols = ['SPDR', 'BATM', 'SUPR', 'TMFS', 'JLES', 'MRVLB', 'SHUF'];
      const names = ['Spider-Man', 'Batman', 'Superman', 'Todd McFarlane', 'Jim Lee', 'Marvel Bond', 'Superhero Fund'];
      const types: Array<'character' | 'creator' | 'publisher' | 'bond' | 'fund'> = ['character', 'character', 'character', 'creator', 'creator', 'bond', 'fund'];
      const traderNames = [
        'Alex Chen', 'Maria Rodriguez', 'James Wilson', 'Sarah Kim', 'Michael Brown',
        'Jessica Lee', 'David Martinez', 'Emily Wang', 'Ryan O\'Connor', 'Lisa Thompson',
        'Kevin Patel', 'Amanda Johnson', 'Chris Garcia', 'Nicole Davis', 'Brandon Smith',
        'Taylor Anderson', 'Jordan Miller', 'Casey Williams', 'Morgan Taylor', 'Drew Johnson'
      ];
      
      const randomIndex = Math.floor(Math.random() * symbols.length);
      const quantity = Math.floor(Math.random() * 50) + 1;
      const price = 1000 + Math.floor(Math.random() * 3000);
      const impact = quantity * price > 100000 ? 'large' : quantity * price > 25000 ? 'medium' : 'small';
      
      return {
        id: `${Date.now()}-${Math.random()}`,
        symbol: symbols[randomIndex],
        name: names[randomIndex],
        type: types[randomIndex],
        action: Math.random() > 0.5 ? 'buy' : 'sell',
        quantity,
        price,
        timestamp: new Date(),
        traderName: traderNames[Math.floor(Math.random() * traderNames.length)],
        impact
      };
    };

    // Initialize with some activities
    const initialActivities = Array.from({ length: 5 }, generateActivity);
    setActivities(initialActivities);

    // Add new activity every 3-8 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return '👤';
      case 'creator': return '👨‍🎨';
      case 'publisher': return '🏢';
      case 'bond': return '📜';
      case 'fund': return '📊';
      default: return '📦';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'large': return 'border-l-purple-500 bg-purple-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-900/10';
      case 'small': return 'border-l-gray-500 bg-gray-900/10';
      default: return 'border-l-gray-500 bg-gray-900/10';
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
    <div className={`bg-slate-800/90 rounded-xl p-6 border border-slate-700/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-green-400" />
          <h3 className="font-semibold text-white text-lg">Live Trading Activity</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
          <button
            onClick={() => setShowTraderNames(!showTraderNames)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={showTraderNames ? 'Hide trader names' : 'Show trader names'}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {(activities || []).map((activity) => (
          <div 
            key={activity.id} 
            className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${getImpactColor(activity.impact)} transition-all hover:bg-slate-700/20`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getTypeIcon(activity.type)}</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activity.action === 'buy' 
                      ? 'bg-green-900/50 text-green-200 border border-green-700/50' 
                      : 'bg-red-900/50 text-red-200 border border-red-700/50'
                  }`}>
                    {activity.action.toUpperCase()}
                  </span>
                  <Link 
                    to={`/${activity.type}/${activity.symbol}`}
                    className="text-white font-medium hover:text-indigo-300 transition-colors"
                  >
                    {activity.symbol}
                  </Link>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  {showTraderNames && (
                    <>
                    <span>•</span>
                    <span className="text-indigo-300">{activity.traderName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-white">
                CC {(activity.quantity * activity.price).toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatTime(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-600/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="text-green-400 font-medium">
              {(activities || []).filter(a => a.action === 'buy').length}
            </span>
            <span> buys, </span>
            <span className="text-red-400 font-medium">
              {(activities || []).filter(a => a.action === 'sell').length}
            </span>
            <span> sells by active traders</span>
          </div>
          <Link 
            to="/trading"
            className="text-green-400 hover:text-green-300 text-sm font-medium"
          >
            Start Trading →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TradingActivityFeed;