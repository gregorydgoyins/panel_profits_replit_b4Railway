import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface CreatorStockChartProps {
  symbol: string;
  name?: string;
  timeRange?: '1d' | '1w' | '1m' | '3m' | '1y' | 'all';
  showEvents?: boolean;
  height?: number;
  className?: string;
}

export function CreatorStockChart({
  symbol,
  name,
  timeRange: initialTimeRange = '1m',
  showEvents: initialShowEvents = true,
  height = 300,
  className = ''
}: CreatorStockChartProps) {
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [showEvents, setShowEvents] = useState(initialShowEvents);
  const [infoOpen, setInfoOpen] = useState(false);

  // Generate realistic historical data based on symbol
  const generateHistoricalData = (creatorSymbol: string) => {
    // Use symbol to generate consistent but unique data
    const symbolHash = creatorSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = symbolHash / 100;
    
    // Base values that vary by creator
    const basePrice = 1000 + (symbolHash % 3000);
    const volatility = 0.2 + (symbolHash % 10) / 100;
    const trend = 0.5 + (symbolHash % 10) / 20; // Upward trend factor
    
    // Generate data points
    const data = [];
    let currentPrice = basePrice;
    
    // Key events affecting the creator with realistic impacts
    const events: Record<string, { change: number, reason: string }> = {};
    
    // Generate events based on symbol
    if (creatorSymbol === 'TMFS') {
      events['2023-12'] = { change: 8.5, reason: 'Spawn Universe Expansion Announced' };
      events['2024-02'] = { change: 5.2, reason: 'New Toy Line Launch' };
      events['2024-04'] = { change: 7.3, reason: 'Spawn Movie Development Deal' };
    } else if (creatorSymbol === 'JLES') {
      events['2023-11'] = { change: 6.8, reason: 'DC Executive Promotion' };
      events['2024-01'] = { change: 4.5, reason: 'Batman Variant Cover Series' };
      events['2024-03'] = { change: 9.2, reason: 'Exclusive Contract Extension' };
    } else if (creatorSymbol === 'DCTS') {
      events['2023-10'] = { change: 7.5, reason: 'Venom Sequel Announced' };
      events['2024-01'] = { change: -3.2, reason: 'Left Marvel Title' };
      events['2024-05'] = { change: 12.5, reason: 'New Creator-Owned Series' };
    } else {
      // Generic events for other creators
      events['2023-11'] = { change: 4.5, reason: 'New Series Announcement' };
      events['2024-02'] = { change: 6.2, reason: 'Industry Award Win' };
      events['2024-04'] = { change: -2.8, reason: 'Project Delay' };
    }
    
    // Generate time periods based on selected range
    let startDate = new Date();
    let endDate = new Date();
    let interval: 'day' | 'week' | 'month' = 'day';
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        interval = 'day';
        break;
      case '1w':
        startDate.setDate(startDate.getDate() - 7);
        interval = 'day';
        break;
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        interval = 'day';
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        interval = 'week';
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        interval = 'month';
        break;
      case 'all':
        startDate = new Date(2023, 0, 1); // Start from beginning of 2023
        interval = 'month';
        break;
    }
    
    // Generate data points
    for (let date = new Date(startDate); date <= endDate; ) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const dateStr = date.toISOString().split('T')[0];
      
      // Base daily variation (-1% to +1.5%)
      const baseVariation = (Math.random() * 2.5 - 1) / 100;
      
      // Add trend factor
      const trendFactor = trend / 100;
      
      // Add event impact if exists
      const event = events[dateKey];
      const eventImpact = event ? event.change / 100 : 0;
      
      // Calculate new price with compounding effects
      currentPrice = currentPrice * (1 + baseVariation + trendFactor + eventImpact);
      
      data.push({
        date: dateStr,
        price: Math.round(currentPrice * 100) / 100,
        event: event?.reason
      });
      
      // Increment date based on interval
      if (interval === 'day') {
        date.setDate(date.getDate() + 1);
      } else if (interval === 'week') {
        date.setDate(date.getDate() + 7);
      } else {
        date.setMonth(date.getMonth() + 1);
      }
    }
    
    return data;
  };

  const chartData = generateHistoricalData(symbol);
  
  // Calculate current value and change
  const currentValue = chartData[chartData.length - 1].price;
  const previousValue = chartData[chartData.length - 2]?.price || chartData[0].price;
  const changeValue = currentValue - previousValue;
  const changePercent = (changeValue / previousValue) * 100;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-700/50">
          <p className="text-sm text-gray-400 mb-1">{new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-lg font-bold text-white">Price: CC {dataPoint.price.toLocaleString()}</p>
          
          {dataPoint.event && (
            <div className="mt-2 pt-2 border-t border-slate-700/50">
              <p className="text-sm font-medium text-indigo-400">Event:</p>
              <p className="text-sm text-gray-300">{dataPoint.event}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">{name || symbol} Price History</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {['1d', '1w', '1m', '3m', '1y', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'all' ? 'ALL' : range.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setInfoOpen(!infoOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
            
            {infoOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-700/90 backdrop-blur-md rounded-lg shadow-xl border border-slate-600/50 p-4 z-10">
                <h3 className="font-semibold text-white mb-2">About Creator Stock Charts</h3>
                <p className="text-sm text-gray-300 mb-2">
                  This chart tracks the market performance of creator stocks over time, showing price movements and key events.
                </p>
                <p className="text-sm text-gray-300">
                  Creator stocks are influenced by new project announcements, industry awards, exclusive contracts, and media adaptations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-xl font-bold text-white">CC {currentValue.toLocaleString()}</p>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            changeValue >= 0 
              ? 'bg-green-900/30 border-green-700/30' 
              : 'bg-red-900/30 border-red-700/30'
          }`}>
            <p className="text-sm text-gray-400">Change</p>
            <div className="flex items-center">
              {changeValue >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
              )}
              <p className={`text-xl font-bold ${
                changeValue >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {changeValue >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={() => setShowEvents(!showEvents)}
              className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Events</span>
          </label>
        </div>
      </div>
      
      <div className="h-[300px]" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => {
                const d = new Date(date);
                if (timeRange === '1d') {
                  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (timeRange === '1w' || timeRange === '1m') {
                  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                } else {
                  return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
                }
              }}
              stroke="#94a3b8"
            />
            <YAxis 
              stroke="#94a3b8"
              tickFormatter={(value) => `${value.toLocaleString()}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#818cf8" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#818cf8' }}
              className="chart-glow"
            />
            
            {/* Market Events */}
            {showEvents && chartData.map((entry, index) => {
              if (entry.event) {
                return (
                  <ReferenceLine 
                    key={`event-${index}`}
                    x={entry.date} 
                    stroke="#9333ea" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: entry.event, 
                      position: 'insideTopRight',
                      fill: '#9333ea',
                      fontSize: 10
                    }}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <p>* Price data reflects market valuation based on trading activity</p>
        <p>* Events shown include major announcements, project launches, and industry recognition</p>
      </div>
    </div>
  );
}

export default CreatorStockChart;