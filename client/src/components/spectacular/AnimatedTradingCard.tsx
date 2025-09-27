import React, { useState, useRef, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Zap, Eye, Heart } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  image?: string;
  significance?: number;
  marketCap?: number;
  volume?: number;
  rating?: string;
}

interface AnimatedTradingCardProps {
  asset: Asset;
  onClick?: () => void;
  className?: string;
}

export function AnimatedTradingCard({ asset, onClick, className = "" }: AnimatedTradingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isPositive = asset.change > 0;
  const isNegative = asset.change < 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const getRatingColor = (rating: string | undefined) => {
    switch (rating) {
      case 'Strong Buy': return 'from-emerald-500 to-green-400';
      case 'Buy': return 'from-blue-500 to-emerald-400';
      case 'Hold': return 'from-yellow-500 to-orange-400';
      case 'Sell': return 'from-red-500 to-orange-500';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer select-none ${className}
        transform transition-all duration-500 ease-out
        ${isHovered ? 'scale-105 rotate-1' : 'scale-100 rotate-0'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Dynamic Cursor Light Effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-10 w-96 h-96 rounded-full opacity-20 transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${isPositive ? 'rgb(34, 197, 94)' : isNegative ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'} 0%, transparent 70%)`,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      )}

      {/* Card Container */}
      <div className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-500
        ${isHovered 
          ? 'border-white/30 shadow-2xl shadow-white/10' 
          : 'border-slate-700/50 shadow-lg shadow-black/25'
        }
        bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
      `}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`
            w-full h-full transform transition-transform duration-1000
            ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
          `}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30" />
            <div className="grid grid-cols-6 grid-rows-8 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`
                    border border-white/10 transition-all duration-500
                    ${isHovered ? 'bg-white/5' : 'bg-transparent'}
                  `}
                  style={{ 
                    animationDelay: `${i * 0.02}s`,
                    transform: isHovered ? `translateY(-${Math.random() * 5}px)` : 'translateY(0)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="relative p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Asset Image or Icon */}
              <div className="relative">
                {asset.image ? (
                  <img 
                    src={asset.image} 
                    alt={asset.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-600/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-display font-bold text-lg">
                      {asset.symbol.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Live Indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              </div>

              <div>
                <h3 className="font-display font-bold text-white text-lg leading-tight">
                  {asset.symbol}
                </h3>
                <p className="text-slate-400 text-sm font-light truncate max-w-32">
                  {asset.name}
                </p>
              </div>
            </div>

            {/* Rating Badge */}
            {asset.rating && (
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium text-white
                bg-gradient-to-r ${getRatingColor(asset.rating)}
                shadow-lg transform transition-all duration-300
                ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}
              `}>
                {asset.rating}
              </div>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="relative p-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-display font-bold text-white font-trading">
                CC {asset.price.toLocaleString()}
              </span>
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-all duration-300
                ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 
                  isNegative ? 'bg-red-500/20 text-red-400' : 
                  'bg-slate-500/20 text-slate-400'}
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : 
                 isNegative ? <TrendingDown className="w-4 h-4" /> : 
                 <Zap className="w-4 h-4" />}
                <span>{asset.change > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {asset.significance && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Significance</span>
                </span>
                <span className="text-white font-trading">{asset.significance}%</span>
              </div>
            )}
            
            {asset.volume && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Volume</span>
                </span>
                <span className="text-white font-trading">
                  {asset.volume >= 1e6 ? `${(asset.volume / 1e6).toFixed(1)}M` : 
                   asset.volume >= 1e3 ? `${(asset.volume / 1e3).toFixed(1)}K` : 
                   asset.volume.toString()}
                </span>
              </div>
            )}

            {asset.marketCap && (
              <div className="flex items-center justify-between col-span-2">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>Market Cap</span>
                </span>
                <span className="text-white font-trading">
                  CC {asset.marketCap >= 1e6 ? `${(asset.marketCap / 1e6).toFixed(1)}M` : 
                       asset.marketCap >= 1e3 ? `${(asset.marketCap / 1e3).toFixed(1)}K` : 
                       asset.marketCap.toString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Animated Border Effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none
          ${isHovered ? 'ring-2 ring-white/20 ring-offset-2 ring-offset-transparent' : ''}
        `} />

        {/* Corner Accents */}
        <div className={`
          absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 transition-all duration-300
          ${isHovered ? 'border-white/60 scale-110' : 'border-slate-600/40 scale-100'}
        `} />
        <div className={`
          absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 transition-all duration-300
          ${isHovered ? 'border-white/60 scale-110' : 'border-slate-600/40 scale-100'}
        `} />
        <div className={`
          absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 transition-all duration-300
          ${isHovered ? 'border-white/60 scale-110' : 'border-slate-600/40 scale-100'}
        `} />
        <div className={`
          absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 transition-all duration-300
          ${isHovered ? 'border-white/60 scale-110' : 'border-slate-600/40 scale-100'}
        `} />
      </div>
    </div>
  );
}

export default AnimatedTradingCard;