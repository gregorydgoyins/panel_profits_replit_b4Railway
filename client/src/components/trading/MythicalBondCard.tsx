import React, { useState, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Shield, Crown, BookOpen, Calendar,
  DollarSign, Target, Star, Clock, Flame, Gem, Users, Award
} from 'lucide-react';
import { HouseEmblem } from '@/components/ui/house-emblem';

type AssetRarity = 'common' | 'rare' | 'epic' | 'legendary';
type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';
type BondType = 'creator' | 'publisher' | 'specialty';

interface MythicalBond {
  id: string;
  name: string;
  symbol: string;
  type: BondType;
  issuer: string;
  price: number;
  change: number;
  percentageChange: number;
  yield: number;
  maturityDate: string;
  creditRating: string;
  couponRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  rarity?: AssetRarity;
  house?: HouseType;
  powerLevel?: number;
  blessing?: boolean;
  specialization?: string;
  bondStrength?: number;
  maturityBonus?: number;
}

interface MythicalBondCardProps {
  bond: MythicalBond;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  className?: string;
}

export function MythicalBondCard({ bond, onSelect, isSelected = false, className = "" }: MythicalBondCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isPositive = bond.change > 0;
  const isNegative = bond.change < 0;
  const rarity = bond.rarity || 'common';
  const house = bond.house || 'wisdom';

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

  const getBondTypeIcon = (type: BondType) => {
    switch (type) {
      case 'creator': return BookOpen;
      case 'publisher': return Crown;
      case 'specialty': return Gem;
      default: return Shield;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA': case 'AA+': case 'AA': case 'AA-':
        return 'bg-emerald-900/50 text-emerald-200 border-emerald-700/50';
      case 'A+': case 'A': case 'A-':
        return 'bg-blue-900/50 text-blue-200 border-blue-700/50';
      case 'BBB+': case 'BBB': case 'BBB-':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'BB+': case 'BB': case 'BB-': case 'B+': case 'B': case 'B-':
        return 'bg-orange-900/50 text-orange-200 border-orange-700/50';
      default:
        return 'bg-red-900/50 text-red-200 border-red-700/50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const BondIcon = getBondTypeIcon(bond.type);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect && onSelect(bond.id)}
      className={`
        relative group cursor-pointer select-none ${className}
        transition-mystical hover-elevate
        ${isHovered ? 'scale-105 ethereal-float' : 'scale-100'}
        ${isSelected ? 'ring-2 ring-yellow-400/50' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`mystical-bond-card-${bond.symbol}`}
    >
      {/* Sacred Particle Background */}
      <div className="sacred-particles absolute inset-0 rounded-2xl" />

      {/* Mystical Bond Container */}
      <div className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl transition-arcane
        ${getRarityClasses(rarity)}
        bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
        ${rarity === 'legendary' ? 'divine-shimmer mystical-pulse' : ''}
        ${bond.blessing ? 'blessing-active' : ''}
        ${isSelected ? 'sacred-glow-intense' : ''}
      `}>
        
        {/* Sacred Header Section */}
        <div className="relative p-4 border-b border-slate-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Bond Type Icon */}
              <div className={`
                p-3 rounded-lg transition-mystical
                bg-gradient-to-br from-var(--house-${house}-primary)/20 to-var(--house-${house}-secondary)/20
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}>
                <BondIcon className={`w-6 h-6 text-var(--house-${house}-primary)`} />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className={`font-display font-bold leading-tight transition-mystical
                    ${rarity === 'legendary' ? 'legendary-text text-lg' : 
                      rarity === 'epic' ? 'epic-text text-lg' : 
                      rarity === 'rare' ? 'rare-text text-lg' : 'text-white text-lg'}`}>
                    {bond.name}
                  </h3>
                  <HouseEmblem house={house} size="sm" className="mystical-pulse" />
                </div>
                <p className="text-slate-400 text-sm">{bond.symbol} • {bond.type} bond</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border transition-mystical
                    ${getRatingColor(bond.creditRating)}
                    ${isHovered ? 'scale-105' : 'scale-100'}`}>
                    {bond.creditRating}
                  </span>
                  <span className="text-xs text-slate-400">{bond.issuer}</span>
                </div>
              </div>
            </div>

            {/* Power Level Badge */}
            {bond.powerLevel && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r 
                             from-amber-500/20 to-yellow-500/20 text-amber-400 text-xs 
                             rounded-full border border-amber-500/30 mystical-pulse">
                <Star className="w-3 h-3" />
                <span>Power {bond.powerLevel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sacred Price & Performance Section */}
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400">Current Price</p>
              <p className={`text-xl font-bold font-trading transition-mystical
                ${rarity === 'legendary' ? 'legendary-text' : 
                  rarity === 'epic' ? 'epic-text' : 
                  rarity === 'rare' ? 'rare-text' : 'text-white'}`}>
                CC {bond.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-mystical
                ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 
                  isNegative ? 'bg-red-500/20 text-red-400' : 
                  'bg-slate-500/20 text-slate-400'}
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : 
                 isNegative ? <TrendingDown className="w-4 h-4" /> : 
                 <Target className="w-4 h-4" />}
                <span>{bond.change > 0 ? '+' : ''}{bond.percentageChange}%</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {bond.change > 0 ? '+' : ''}CC {bond.change.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Mystical Bond Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-400">Sacred Yield</p>
              <p className="font-semibold text-emerald-400">{bond.yield}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Maturity</p>
              <p className="font-semibold text-white">
                {new Date(bond.maturityDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Coupon Rate</p>
              <p className="font-semibold text-blue-400">{bond.couponRate}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Risk Level</p>
              <p className={`font-semibold ${getRiskColor(bond.riskLevel)}`}>
                {bond.riskLevel}
              </p>
            </div>
          </div>

          {/* Specialization & Bond Strength */}
          <div className="space-y-3">
            {bond.specialization && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>Specialization</span>
                </span>
                <span className="text-white font-medium">{bond.specialization}</span>
              </div>
            )}

            {bond.bondStrength && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Bond Strength</span>
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${bond.bondStrength}%` }}
                    />
                  </div>
                  <span className="text-white font-trading text-sm">{bond.bondStrength}%</span>
                </div>
              </div>
            )}

            {bond.maturityBonus && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400">Maturity Bonus:</span>
                  <span className="text-amber-400 font-medium">+{bond.maturityBonus}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative p-4 pt-0">
          <div className="flex space-x-3">
            <button
              className={`
                flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                font-medium py-2 px-4 rounded-lg transition-mystical hover-elevate
                ${isHovered ? 'scale-105' : 'scale-100'}
              `}
            >
              View Sacred Details
            </button>
            <button
              className={`
                flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white 
                font-medium py-2 px-4 rounded-lg transition-mystical hover-elevate
                ${isHovered ? 'scale-105' : 'scale-100'}
              `}
            >
              Forge Bond
            </button>
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

export default MythicalBondCard;