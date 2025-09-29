import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, TrendingUp, TrendingDown, Calendar, BookOpen, Crown, 
  Zap, Flame, Shield, Eye, Heart, Sparkles, Award 
} from 'lucide-react';
import { HouseEmblem } from '@/components/ui/house-emblem';

type AssetRarity = 'common' | 'rare' | 'epic' | 'legendary';
type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface ComicAsset {
  id: string;
  title: string;
  issue?: string;
  publisher: string;
  year: number;
  coverImage: string;
  currentPrice: number;
  percentChange: number;
  change: number;
  volume: number;
  marketCap?: number;
  significance?: number;
  rarity?: AssetRarity;
  house?: HouseType;
  gradeAverage?: number;
  keyIssue?: boolean;
  firstAppearance?: string;
  creators?: string[];
  marketInsights?: {
    analystRating: string;
    targetPrice: number;
    priceHistory: number[];
  };
}

interface MythicalComicCardProps {
  comic: ComicAsset;
  onClick?: () => void;
  className?: string;
  featured?: boolean;
}

export function MythicalComicCard({ comic, onClick, className = "", featured = false }: MythicalComicCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isPositive = comic.change > 0;
  const isNegative = comic.change < 0;
  const rarity = comic.rarity || 'common';
  const house = comic.house || 'heroes';

  const getRarityClasses = (rarity: AssetRarity) => {
    switch (rarity) {
      case 'legendary':
        return 'rarity-legendary border-2 legendary-text';
      case 'epic':
        return 'rarity-epic border-2 epic-text';
      case 'rare':
        return 'rarity-rare border-2 rare-text';
      default:
        return 'rarity-common border';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'Buy': return 'bg-blue-900/50 text-blue-200 border-blue-700/50';
      case 'Hold': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'Sell': return 'bg-red-900/50 text-red-200 border-red-700/50';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer select-none ${className}
        transition-mystical hover-elevate
        ${isHovered ? 'scale-105 ethereal-float' : 'scale-100'}
        ${featured ? 'col-span-full md:col-span-2' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-testid={`mystical-comic-card-${comic.id}`}
    >
      {/* Sacred Particle Background */}
      <div className="sacred-particles absolute inset-0 rounded-2xl" />

      {/* Mystical Artifact Card Container */}
      <div className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl transition-arcane
        ${getRarityClasses(rarity)}
        bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
        ${rarity === 'legendary' ? 'divine-shimmer mystical-pulse' : ''}
        ${comic.keyIssue ? 'sacred-glow-intense' : ''}
        ${featured ? 'h-96' : 'h-80'}
      `}>
        
        {/* Mystical Header */}
        <div className="relative p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className={`w-5 h-5 text-var(--house-${house}-primary) transition-mystical
                ${isHovered ? 'scale-125' : 'scale-100'}`} />
              <div>
                <h3 className={`font-display font-bold leading-tight transition-mystical
                  ${rarity === 'legendary' ? 'legendary-text text-lg' : 
                    rarity === 'epic' ? 'epic-text text-lg' : 
                    rarity === 'rare' ? 'rare-text text-lg' : 'text-white text-lg'}`}>
                  {comic.title} {comic.issue && `#${comic.issue}`}
                </h3>
                <p className="text-slate-400 text-sm">{comic.publisher} • {comic.year}</p>
              </div>
            </div>

            {/* House Emblem */}
            <HouseEmblem house={house} size="sm" className="mystical-pulse" />
          </div>

          {/* Key Issue Badge */}
          {comic.keyIssue && (
            <div className="absolute top-2 right-12">
              <div className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 
                             text-amber-400 text-xs rounded-full border border-amber-500/30
                             mystical-pulse flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>Key Issue</span>
              </div>
            </div>
          )}
        </div>

        {/* Comic Cover & Details Grid */}
        <div className={`relative ${featured ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'block'} p-4`}>
          {/* Mystical Cover Image */}
          <div className="relative group">
            <div className={`relative ${featured ? 'h-64' : 'h-40'} rounded-lg overflow-hidden
              ${rarity === 'legendary' ? 'sacred-glow-divine' : 
                rarity === 'epic' ? 'sacred-glow-intense' : 
                rarity === 'rare' ? 'sacred-glow-moderate' : 'sacred-glow-subtle'}`}>
              <img 
                src={comic.coverImage}
                alt={`${comic.title} ${comic.issue} cover`}
                className={`w-full h-full object-cover transition-arcane
                  ${isHovered ? 'scale-110' : 'scale-100'}
                  ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Mystical Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Grade Badge */}
              {comic.gradeAverage && (
                <div className="absolute top-2 left-2">
                  <div className="px-2 py-1 bg-slate-900/80 text-white text-xs rounded-full 
                                 backdrop-blur-sm border border-slate-600/50">
                    Grade {comic.gradeAverage}/10
                  </div>
                </div>
              )}

              {/* Rarity Corner Indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full transition-mystical
                ${rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-amber-500 mystical-pulse' :
                  rarity === 'epic' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                  rarity === 'rare' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                  'bg-gradient-to-br from-gray-500 to-slate-600'}`} />
            </div>
          </div>

          {/* Sacred Information Panel */}
          <div className={`${featured ? 'space-y-4' : 'mt-4 space-y-3'}`}>
            {/* Price & Performance */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className={`text-xl font-display font-bold font-trading transition-mystical
                  ${rarity === 'legendary' ? 'legendary-text' : 
                    rarity === 'epic' ? 'epic-text' : 
                    rarity === 'rare' ? 'rare-text' : 'text-white'}`}>
                  CC {comic.currentPrice.toLocaleString()}
                </span>
                <div className={`
                  flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-mystical
                  ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 
                    isNegative ? 'bg-red-500/20 text-red-400' : 
                    'bg-slate-500/20 text-slate-400'}
                  ${isHovered ? 'scale-110' : 'scale-100'}
                `}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : 
                   isNegative ? <TrendingDown className="w-3 h-3" /> : 
                   <Zap className="w-3 h-3" />}
                  <span>{comic.change > 0 ? '+' : ''}{comic.percentChange}%</span>
                </div>
              </div>

              {/* Market Insights */}
              {comic.marketInsights && (
                <div className={`px-3 py-2 rounded-lg border transition-mystical
                  ${getRatingColor(comic.marketInsights.analystRating)}
                  ${isHovered ? 'scale-105' : 'scale-100'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyst Rating</span>
                    <span className="font-medium">{comic.marketInsights.analystRating}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span>Target Price</span>
                    <span>CC {comic.marketInsights.targetPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mystical Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Volume</span>
                </span>
                <span className="text-white font-trading">
                  {comic.volume >= 1e6 ? `${(comic.volume / 1e6).toFixed(1)}M` : 
                   comic.volume >= 1e3 ? `${(comic.volume / 1e3).toFixed(1)}K` : 
                   comic.volume.toString()}
                </span>
              </div>

              {comic.significance && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Significance</span>
                  </span>
                  <span className="text-white font-trading">{comic.significance}%</span>
                </div>
              )}

              {comic.marketCap && (
                <div className="flex items-center justify-between col-span-2">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>Market Cap</span>
                  </span>
                  <span className="text-white font-trading">
                    CC {comic.marketCap >= 1e6 ? `${(comic.marketCap / 1e6).toFixed(1)}M` : 
                         comic.marketCap >= 1e3 ? `${(comic.marketCap / 1e3).toFixed(1)}K` : 
                         comic.marketCap.toString()}
                  </span>
                </div>
              )}
            </div>

            {/* First Appearance Info */}
            {comic.firstAppearance && (
              <div className="pt-2 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400">First Appearance:</span>
                  <span className="text-amber-400 font-medium">{comic.firstAppearance}</span>
                </div>
              </div>
            )}

            {/* Creators */}
            {comic.creators && comic.creators.length > 0 && (
              <div className="pt-2 border-t border-slate-700/50">
                <div className="text-sm">
                  <span className="text-slate-400">Creators: </span>
                  <span className="text-white">{comic.creators.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
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

export default MythicalComicCard;