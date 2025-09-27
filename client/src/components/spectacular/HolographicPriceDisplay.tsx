import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface HolographicPriceDisplayProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  className?: string;
}

export function HolographicPriceDisplay({
  symbol,
  price,
  change,
  changePercent,
  volume,
  marketCap,
  className = ""
}: HolographicPriceDisplayProps) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(true);
      setPriceHistory(prev => [...prev.slice(-10), price]); // Keep last 10 prices
      setTimeout(() => setIsGlowing(false), 300);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className={`relative group ${className}`}>
      {/* Holographic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Main Container */}
      <div className={`
        relative backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 
        rounded-2xl p-6 border border-slate-700/50 overflow-hidden
        transform transition-all duration-500 hover:scale-105 hover:rotate-1
        ${isGlowing ? 'ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/25' : ''}
      `}>
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-cyan-400/20 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Symbol and Icon */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">{symbol}</h3>
              <p className="text-slate-400 text-sm font-light">Live Pricing</p>
            </div>
          </div>
          
          {/* Trend Icon */}
          <div className={`
            p-2 rounded-full transition-all duration-300
            ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 
              isNegative ? 'bg-red-500/20 text-red-400' : 
              'bg-slate-500/20 text-slate-400'}
          `}>
            {isPositive ? <TrendingUp className="w-6 h-6" /> : 
             isNegative ? <TrendingDown className="w-6 h-6" /> : 
             <div className="w-6 h-6 bg-slate-400 rounded-full" />}
          </div>
        </div>

        {/* Price Display */}
        <div className="relative mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-white font-trading">
              CC {price.toLocaleString()}
            </span>
            <div className={`
              flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium
              ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 
                isNegative ? 'bg-red-500/20 text-red-400' : 
                'bg-slate-500/20 text-slate-400'}
            `}>
              <span>{change > 0 ? '+' : ''}{change.toFixed(2)}</span>
              <span>({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        {priceHistory.length > 2 && (
          <div className="relative h-12 mb-4">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="url(#priceGradient)"
                strokeWidth="2"
                points={priceHistory
                  .map((p, i) => {
                    const x = (i / (priceHistory.length - 1)) * 100;
                    const minPrice = Math.min(...priceHistory);
                    const maxPrice = Math.max(...priceHistory);
                    const y = 90 - ((p - minPrice) / (maxPrice - minPrice)) * 80;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        )}

        {/* Additional Stats */}
        {(volume || marketCap) && (
          <div className="flex justify-between text-sm">
            {volume && (
              <div>
                <span className="text-slate-400">Volume:</span>
                <span className="text-white ml-1 font-trading">
                  {volume >= 1e6 ? `${(volume / 1e6).toFixed(1)}M` : 
                   volume >= 1e3 ? `${(volume / 1e3).toFixed(1)}K` : 
                   volume.toString()}
                </span>
              </div>
            )}
            {marketCap && (
              <div>
                <span className="text-slate-400">Market Cap:</span>
                <span className="text-white ml-1 font-trading">
                  CC {marketCap >= 1e6 ? `${(marketCap / 1e6).toFixed(1)}M` : 
                       marketCap >= 1e3 ? `${(marketCap / 1e3).toFixed(1)}K` : 
                       marketCap.toString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse" />
        
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60" />
      </div>
    </div>
  );
}

export default HolographicPriceDisplay;