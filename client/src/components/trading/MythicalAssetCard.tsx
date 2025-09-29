import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, TrendingUp, TrendingDown, Zap, Eye, Heart, Shield, 
  Crown, BookOpen, Sparkles, Gem, Swords, Flame, Clock, Users 
} from 'lucide-react';
import { HouseEmblem } from '@/components/ui/house-emblem';

type AssetRarity = 'common' | 'rare' | 'epic' | 'legendary';
type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

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
  rarity?: AssetRarity;
  house?: HouseType;
  powerLevel?: number;
  blessing?: boolean;
  achievements?: string[];
}

interface MythicalAssetCardProps {
  asset: Asset;
  onClick?: () => void;
  className?: string;
  showHouseAura?: boolean;
}

export function MythicalAssetCard({ asset, onClick, className = "", showHouseAura = true }: MythicalAssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isPositive = asset.change > 0;
  const isNegative = asset.change < 0;
  const rarity = asset.rarity || 'common';
  const house = asset.house || 'heroes';

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

  const getRarityClasses = (rarity: AssetRarity) => {
    switch (rarity) {
      case 'legendary':
        return 'rarity-legendary legendary-text border-2';
      case 'epic':
        return 'rarity-epic epic-text border-2';
      case 'rare':
        return 'rarity-rare rare-text border-2';
      default:
        return 'rarity-common border';
    }
  };

  const getHouseIcon = (house: HouseType) => {
    switch (house) {
      case 'heroes': return Shield;
      case 'wisdom': return BookOpen;
      case 'power': return Crown;
      case 'mystery': return Gem;
      case 'elements': return Flame;
      case 'time': return Clock;
      case 'spirit': return Users;
      default: return Star;
    }
  };

  const getRatingColor = (rating: string | undefined) => {
    switch (rating) {
      case 'Strong Buy': return 'from-emerald-500 to-green-400';
      case 'Buy': return 'from-blue-500 to-emerald-400';
      case 'Hold': return 'from-yellow-500 to-orange-400';
      case 'Sell': return 'from-red-500 to-orange-500';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  const HouseIcon = getHouseIcon(house);

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer select-none ${className}
        transition-mystical hover-elevate
        ${isHovered ? 'scale-105 ethereal-float' : 'scale-100'}
        ${showHouseAura ? `house-aura-${house}` : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-testid={`mystical-asset-card-${asset.symbol}`}
    >
      {/* Mystical Cursor Aura Effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-10 w-96 h-96 rounded-full transition-divine"
          style={{
            background: `radial-gradient(circle, 
              ${isPositive ? 'hsl(var(--blessing-active))' : 
                isNegative ? 'hsl(var(--blessing-expired))' : 
                'hsl(var(--house-' + house + '-primary))'} 0%, 
              transparent 70%)`,
            opacity: 0.3,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      )}

      {/* Sacred Particle Background */}
      <div className="sacred-particles absolute inset-0 rounded-2xl" />

      {/* Mystical Card Container */}
      <div className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl transition-arcane
        ${getRarityClasses(rarity)}
        bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
        ${rarity === 'legendary' ? 'divine-shimmer mystical-pulse' : ''}
        ${asset.blessing ? 'blessing-active' : ''}
      `}>
        
        {/* Animated Mystical Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={`
            w-full h-full transition-legendary
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}>
            <div className={`absolute inset-0 bg-gradient-to-br from-var(--house-${house}-primary)/30 to-transparent`} />
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`
                    border border-white/5 transition-mystical
                    ${isHovered ? 'bg-white/10' : 'bg-transparent'}
                  `}
                  style={{ 
                    animationDelay: `${i * 0.03}s`,
                    transform: isHovered ? `translateY(-${Math.random() * 3}px)` : 'translateY(0)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sacred Header Section */}
        <div className="relative p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mystical Asset Image/Icon */}
              <div className="relative">
                {asset.image ? (
                  <img 
                    src={asset.image} 
                    alt={asset.name}
                    className={`w-12 h-12 rounded-lg object-cover border transition-mystical
                      ${rarity === 'legendary' ? 'sacred-glow-divine' : 
                        rarity === 'epic' ? 'sacred-glow-intense' : 
                        rarity === 'rare' ? 'sacred-glow-moderate' : 'sacred-glow-subtle'}`}
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-mystical
                    bg-gradient-to-br from-var(--house-${house}-primary) to-var(--house-${house}-secondary)
                    ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    <span className="text-white font-display font-bold text-lg">
                      {asset.symbol.charAt(0)}
                    </span>
                  </div>
                )}
                
                {/* House Emblem Overlay */}
                <div className="absolute -top-1 -right-1">
                  <HouseEmblem house={house} size="sm" className="mystical-pulse" />
                </div>

                {/* Live Trading Indicator */}
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-display font-bold text-white text-lg leading-tight">
                    {asset.symbol}
                  </h3>
                  <HouseIcon className={`w-4 h-4 text-var(--house-${house}-primary) transition-mystical
                    ${isHovered ? 'scale-125' : 'scale-100'}`} />
                </div>
                <p className="text-slate-400 text-sm font-light truncate max-w-32">
                  {asset.name}
                </p>
                {asset.powerLevel && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">
                      Power {asset.powerLevel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Mystical Rating Badge */}
            {asset.rating && (
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium text-white transition-mystical
                bg-gradient-to-r ${getRatingColor(asset.rating)}
                shadow-lg ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}
                ${rarity === 'legendary' ? 'divine-shimmer' : ''}
              `}>
                {asset.rating}
              </div>
            )}
          </div>
        </div>

        {/* Sacred Price Section */}
        <div className="relative p-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-display font-bold font-trading transition-mystical
                ${rarity === 'legendary' ? 'legendary-text' : 
                  rarity === 'epic' ? 'epic-text' : 
                  rarity === 'rare' ? 'rare-text' : 'text-white'}`}>
                CC {asset.price.toLocaleString()}
              </span>
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-mystical
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

          {/* Mystical Stats Grid */}
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

          {/* Achievement Badges */}
          {asset.achievements && asset.achievements.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex flex-wrap gap-1">
                {asset.achievements.slice(0, 3).map((achievement, index) => (
                  <div 
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 
                               text-amber-400 text-xs rounded-full border border-amber-500/30
                               mystical-pulse"
                  >
                    {achievement}
                  </div>
                ))}
                {asset.achievements.length > 3 && (
                  <div className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full">
                    +{asset.achievements.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sacred Corner Runes */}
        <div className={`
          absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 transition-mystical
          ${isHovered ? `border-var(--house-${house}-primary) scale-125` : 'border-slate-600/40 scale-100'}
        `} />
        <div className={`
          absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 transition-mystical
          ${isHovered ? `border-var(--house-${house}-primary) scale-125` : 'border-slate-600/40 scale-100'}
        `} />
        <div className={`
          absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 transition-mystical
          ${isHovered ? `border-var(--house-${house}-primary) scale-125` : 'border-slate-600/40 scale-100'}
        `} />
        <div className={`
          absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 transition-mystical
          ${isHovered ? `border-var(--house-${house}-primary) scale-125` : 'border-slate-600/40 scale-100'}
        `} />
      </div>
    </div>
  );
}

export default MythicalAssetCard;