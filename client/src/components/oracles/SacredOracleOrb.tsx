import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, TrendingUp, TrendingDown, Zap, Activity, Eye, Crown, 
  Shield, Flame, Globe, Users, Star, Sparkles 
} from 'lucide-react';

type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface SacredSentimentData {
  overall: number; // -1 to 1
  confidence: number; // 0 to 1
  divineBlessing: number; // House blessing multiplier
  selectedHouse?: HouseType;
  categories: {
    prophecies: number;
    communal: number;
    mystical: number;
    elemental: number;
  };
  sources: {
    oracles: number;
    sages: number;
    celestial: number;
  };
  sacredInsights: string[];
}

interface SacredOracleOrbProps {
  sentimentData: SacredSentimentData;
  className?: string;
  house?: HouseType;
}

export function SacredOracleOrb({ sentimentData, className = "", house = 'wisdom' }: SacredOracleOrbProps) {
  const [mysticalParticles, setMysticalParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>>([]);
  
  const [orbEnergy, setOrbEnergy] = useState(0);
  const [isChanneling, setIsChanneling] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Generate mystical particles based on sentiment and house
  useEffect(() => {
    const getHouseColors = (house: HouseType) => {
      switch (house) {
        case 'heroes': return ['rgb(225, 100, 70)', 'rgb(59, 130, 246)'];
        case 'wisdom': return ['rgb(139, 92, 246)', 'rgb(147, 197, 253)'];
        case 'power': return ['rgb(239, 68, 68)', 'rgb(15, 23, 42)'];
        case 'mystery': return ['rgb(34, 197, 94)', 'rgb(6, 78, 59)'];
        case 'elements': return ['rgb(251, 191, 36)', 'rgb(245, 158, 11)'];
        case 'time': return ['rgb(100, 116, 139)', 'rgb(59, 130, 246)'];
        case 'spirit': return ['rgb(20, 184, 166)', 'rgb(6, 182, 212)'];
        default: return ['rgb(139, 92, 246)', 'rgb(147, 197, 253)'];
      }
    };

    const houseColors = getHouseColors(house);
    const sentimentColors = sentimentData.overall > 0 ? 
      ['rgb(34, 197, 94)', 'rgb(16, 185, 129)'] : 
      sentimentData.overall < 0 ? 
      ['rgb(239, 68, 68)', 'rgb(220, 38, 38)'] : 
      ['rgb(156, 163, 175)', 'rgb(107, 114, 128)'];

    const newParticles = Array.from({ length: 60 }, (_, i) => {
      const isRare = Math.random() > 0.8;
      const isEpic = Math.random() > 0.95;
      const isLegendary = Math.random() > 0.98;
      
      let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
      let color = sentimentColors[0];
      
      if (isLegendary) {
        rarity = 'legendary';
        color = 'rgb(251, 191, 36)'; // Divine gold
      } else if (isEpic) {
        rarity = 'epic';
        color = houseColors[0];
      } else if (isRare) {
        rarity = 'rare';
        color = houseColors[1];
      } else {
        color = sentimentColors[Math.floor(Math.random() * 2)];
      }

      return {
        id: i,
        x: Math.random() * 280,
        y: Math.random() * 280,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: rarity === 'legendary' ? 4 : rarity === 'epic' ? 3 : rarity === 'rare' ? 2.5 : Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color,
        rarity
      };
    });
    setMysticalParticles(newParticles);
  }, [sentimentData, house]);

  // Orb energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbEnergy(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Channeling animation trigger
  useEffect(() => {
    const channelInterval = setInterval(() => {
      setIsChanneling(true);
      setTimeout(() => setIsChanneling(false), 3000);
    }, 10000);
    return () => clearInterval(channelInterval);
  }, []);

  // Animate mystical particles
  useEffect(() => {
    const animate = () => {
      setMysticalParticles(prev => prev.map(particle => {
        const centerX = 140;
        const centerY = 140;
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Add orbital motion for legendary particles
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        
        if (particle.rarity === 'legendary' && distance < 100) {
          const angle = Math.atan2(dy, dx) + 0.02;
          const radius = distance;
          newX = centerX + Math.cos(angle) * radius;
          newY = centerY + Math.sin(angle) * radius;
        }

        return {
          ...particle,
          x: (newX + 280) % 280,
          y: (newY + 280) % 280,
          opacity: (Math.sin(Date.now() * 0.001 + particle.id) + 1) * 0.4 + 0.2
        };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getSacredSentimentColor = (value: number) => {
    if (value > 0.3) return 'text-emerald-400 from-emerald-500/40 to-green-400/40';
    if (value > 0.1) return 'text-blue-400 from-blue-500/40 to-cyan-400/40';
    if (value > -0.1) return 'text-amber-400 from-amber-500/40 to-yellow-400/40';
    if (value > -0.3) return 'text-orange-400 from-orange-500/40 to-red-400/40';
    return 'text-red-400 from-red-500/40 to-pink-400/40';
  };

  const getHouseIcon = (house: HouseType) => {
    switch (house) {
      case 'heroes': return Shield;
      case 'wisdom': return Eye;
      case 'power': return Crown;
      case 'mystery': return Gem;
      case 'elements': return Flame;
      case 'time': return Globe;
      case 'spirit': return Users;
      default: return Star;
    }
  };

  const sentimentColorClass = getSacredSentimentColor(sentimentData.overall);
  const confidencePercent = Math.round(sentimentData.confidence * 100);
  const blessingPercent = Math.round(sentimentData.divineBlessing * 100);
  const HouseIcon = getHouseIcon(house);

  return (
    <div className={`relative ${className}`}>
      {/* Sacred Orb Container */}
      <div 
        ref={orbRef}
        className={`
          relative w-80 h-80 mx-auto overflow-hidden rounded-full transition-arcane
          bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
          backdrop-blur-xl border-2 border-slate-700/50
          ${isChanneling ? 'sacred-glow-divine scale-105' : 'sacred-glow-moderate'}
          ${house ? `house-aura-${house}` : ''}
        `}
      >
        {/* Divine Outer Ring */}
        <div className={`
          absolute inset-3 rounded-full border-2 transition-divine mystical-pulse
          ${sentimentData.overall > 0 ? 'border-emerald-400/60' : 
            sentimentData.overall < 0 ? 'border-red-400/60' : 
            'border-amber-400/60'}
          ${isChanneling ? 'scale-105' : 'scale-100'}
        `} />

        {/* House Energy Ring */}
        <div className={`
          absolute inset-6 rounded-full transition-mystical
          bg-gradient-to-br from-var(--house-${house}-primary)/20 to-var(--house-${house}-secondary)/10
          ${isChanneling ? 'scale-110 opacity-80' : 'opacity-40'}
        `} />

        {/* Sacred Particle System */}
        <svg className="absolute inset-0 w-full h-full">
          {mysticalParticles.map(particle => (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={particle.color}
              opacity={particle.opacity}
              className={particle.rarity === 'legendary' ? 'mystical-pulse' : ''}
            />
          ))}
          
          {/* Sacred Geometric Patterns */}
          <defs>
            <pattern id="sacredGeometry" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sacredGeometry)" opacity="0.3" />
        </svg>

        {/* Central Sacred Core */}
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-slate-800/95 to-slate-900/95 
                        border border-slate-600/50 flex items-center justify-center transition-arcane
                        hover:scale-105">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Brain className={`w-6 h-6 ${sentimentColorClass.split(' ')[0]} mystical-pulse`} />
              <HouseIcon className={`w-5 h-5 text-var(--house-${house}-primary) ethereal-float`} />
            </div>
            <div className={`text-3xl font-display font-bold ${sentimentColorClass.split(' ')[0]} font-trading`}>
              {(sentimentData.overall * 100).toFixed(0)}
            </div>
            <div className="text-xs text-slate-400 font-light uppercase tracking-wider">
              Sacred Oracle
            </div>
          </div>
        </div>

        {/* Rotating House Emblems */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '30s' }}>
          {/* Prophecies Sentiment */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-blue-400 rounded-full mystical-pulse opacity-80" />
          </div>
          
          {/* Communal Sentiment */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-purple-400 rounded-full mystical-pulse opacity-80" />
          </div>
          
          {/* Mystical Sentiment */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-cyan-400 rounded-full mystical-pulse opacity-80" />
          </div>
          
          {/* Elemental Sentiment */}
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-amber-400 rounded-full mystical-pulse opacity-80" />
          </div>
        </div>

        {/* Divine Scanning Runes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent 
                         via-cyan-400/60 to-transparent mystical-pulse" />
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent 
                         via-purple-400/60 to-transparent mystical-pulse" 
               style={{ animationDelay: '1.5s' }} />
        </div>

        {/* House Blessing Indicator */}
        {sentimentData.divineBlessing > 0 && (
          <div className="absolute top-4 right-4">
            <div className="px-2 py-1 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 
                           text-amber-400 text-xs rounded-full border border-amber-500/50
                           mystical-pulse flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Blessed</span>
            </div>
          </div>
        )}
      </div>

      {/* Sacred Data Panels */}
      <div className="mt-6 space-y-4">
        {/* Divine Confidence Meter */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 border border-slate-700/50 
                        transition-mystical hover-elevate">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Divine Confidence</span>
              <HouseIcon className={`w-3 h-3 text-var(--house-${house}-primary)`} />
            </span>
            <span className="text-white font-trading text-lg">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-700 bg-gradient-to-r ${
                confidencePercent > 80 ? 'from-emerald-500 to-green-400' :
                confidencePercent > 60 ? 'from-blue-500 to-cyan-400' :
                confidencePercent > 40 ? 'from-amber-500 to-yellow-400' :
                'from-red-500 to-orange-400'
              } mystical-pulse`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* House Blessing Power */}
        {sentimentData.divineBlessing > 0 && (
          <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 backdrop-blur-md 
                         rounded-lg p-4 border border-amber-500/30 transition-mystical hover-elevate">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-amber-400 flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>House Blessing</span>
                <Sparkles className="w-3 h-3" />
              </span>
              <span className="text-amber-300 font-trading text-lg">+{blessingPercent}%</span>
            </div>
            <div className="w-full bg-amber-900/30 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full karma-fill bg-gradient-to-r from-amber-500 to-yellow-400"
                style={{ width: `${blessingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Sacred Category Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50 
                         transition-mystical hover-elevate">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Prophecies</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.prophecies > 0 ? 'text-emerald-400' : 
                sentimentData.categories.prophecies < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.prophecies * 100).toFixed(0)}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50 
                         transition-mystical hover-elevate">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Communal</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.communal > 0 ? 'text-emerald-400' : 
                sentimentData.categories.communal < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.communal * 100).toFixed(0)}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50 
                         transition-mystical hover-elevate">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Mystical</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.mystical > 0 ? 'text-emerald-400' : 
                sentimentData.categories.mystical < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.mystical * 100).toFixed(0)}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50 
                         transition-mystical hover-elevate">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Elemental</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.elemental > 0 ? 'text-emerald-400' : 
                sentimentData.categories.elemental < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.elemental * 100).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Sacred Insights */}
        {sentimentData.sacredInsights && sentimentData.sacredInsights.length > 0 && (
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md 
                         rounded-lg p-4 border border-slate-700/50">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Sacred Insights</span>
            </h4>
            <div className="space-y-1">
              {sentimentData.sacredInsights.slice(0, 2).map((insight, index) => (
                <p key={index} className="text-xs text-slate-300 italic">
                  "{insight}"
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SacredOracleOrb;