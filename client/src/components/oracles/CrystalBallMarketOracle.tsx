import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, Users, Zap, 
  Crystal, Eye, Crown, Sparkles, Star, Globe, Flame, Shield 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface MysticalMarketStat {
  id: string;
  oracleName: string;
  sacredValue: string;
  divineChange: number;
  icon: any;
  prophecy: 'ascending' | 'descending' | 'balanced';
  house: HouseType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  mysticalPower?: number;
  blessing?: boolean;
}

interface CrystalBallMarketOracleProps {
  selectedHouse?: HouseType;
}

export function CrystalBallMarketOracle({ selectedHouse = 'heroes' }: CrystalBallMarketOracleProps) {
  const [isScrying, setIsScrying] = useState(false);
  const [activeOracle, setActiveOracle] = useState<string | null>(null);
  const [mysticalEnergy, setMysticalEnergy] = useState(0);

  // Sacred Market Prophecies - enhanced with mystical theming
  const sacredProphecies: MysticalMarketStat[] = [
    {
      id: 'realm-treasury',
      oracleName: 'Realm Treasury',
      sacredValue: 'CC 847.2B',
      divineChange: 2.34,
      icon: Crown,
      prophecy: 'ascending',
      house: 'power',
      rarity: 'legendary',
      mysticalPower: 95,
      blessing: true
    },
    {
      id: 'guild-warriors',
      oracleName: 'Guild Warriors',
      sacredValue: '23,847',
      divineChange: 5.67,
      icon: Shield,
      prophecy: 'ascending',
      house: 'heroes',
      rarity: 'epic',
      mysticalPower: 87
    },
    {
      id: 'mystic-flows',
      oracleName: 'Mystic Flows',
      sacredValue: 'CC 12.8B',
      divineChange: -1.23,
      icon: Activity,
      prophecy: 'descending',
      house: 'elements',
      rarity: 'rare',
      mysticalPower: 72
    },
    {
      id: 'divine-sentiment',
      oracleName: 'Divine Sentiment',
      sacredValue: 'Exalted',
      divineChange: 8.45,
      icon: Eye,
      prophecy: 'ascending',
      house: 'wisdom',
      rarity: 'legendary',
      mysticalPower: 92,
      blessing: true
    },
    {
      id: 'chaos-index',
      oracleName: 'Chaos Index',
      sacredValue: '34.2',
      divineChange: -2.11,
      icon: Zap,
      prophecy: 'descending',
      house: 'mystery',
      rarity: 'epic',
      mysticalPower: 68
    },
    {
      id: 'blessed-assets',
      oracleName: 'Blessed Assets',
      sacredValue: '142',
      divineChange: 12.5,
      icon: Sparkles,
      prophecy: 'ascending',
      house: 'spirit',
      rarity: 'rare',
      mysticalPower: 89
    }
  ];

  // Mystical Energy Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Trigger scrying animation
  useEffect(() => {
    const scryingInterval = setInterval(() => {
      setIsScrying(true);
      setTimeout(() => setIsScrying(false), 2000);
    }, 8000);
    return () => clearInterval(scryingInterval);
  }, []);

  const getProphecyColor = (prophecy: string, change: number) => {
    if (prophecy === 'ascending' || change > 0) return 'text-emerald-400';
    if (prophecy === 'descending' || change < 0) return 'text-red-400';
    return 'text-amber-400';
  };

  const getProphecyIcon = (prophecy: string, change: number) => {
    if (prophecy === 'ascending' || change > 0) return <TrendingUp className="h-3 w-3" />;
    if (prophecy === 'descending' || change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  const getRarityClasses = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'rarity-legendary legendary-text border-2 divine-shimmer mystical-pulse';
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
      case 'wisdom': return Eye;
      case 'power': return Crown;
      case 'mystery': return Crystal;
      case 'elements': return Flame;
      case 'time': return Globe;
      case 'spirit': return Users;
      default: return Star;
    }
  };

  return (
    <div className="sacred-particles relative">
      <Card className={`p-6 transition-arcane hover-elevate ${selectedHouse ? `house-aura-${selectedHouse}` : ''}`} 
            data-testid="crystal-ball-market-oracle">
        
        {/* Sacred Header with Crystal Ball */}
        <CardHeader className="px-0 pt-0 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-display font-bold flex items-center space-x-3">
              <div className="relative">
                <Crystal className={`h-8 w-8 transition-mystical ${isScrying ? 'sacred-glow-divine' : 'sacred-glow-moderate'} 
                  ${isScrying ? 'scale-125' : 'scale-100'}`} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="legendary-text">Crystal Ball Oracle</span>
              <Badge className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 
                               border-cyan-500/30 mystical-pulse">
                Divine Sight
              </Badge>
            </CardTitle>
            
            {/* House Emblem */}
            {selectedHouse && (
              <div className={`p-2 rounded-lg bg-gradient-to-br from-var(--house-${selectedHouse}-primary)/20 to-transparent`}>
                {React.createElement(getHouseIcon(selectedHouse), { 
                  className: `w-6 h-6 text-var(--house-${selectedHouse}-primary) mystical-pulse` 
                })}
              </div>
            )}
          </div>

          {/* Mystical Energy Waves */}
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div 
              className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-divine"
              style={{ 
                transform: `translateX(${Math.sin(mysticalEnergy * 0.05) * 200}px)`,
                opacity: isScrying ? 0.8 : 0.3
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {/* Sacred Prophecies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sacredProphecies.map((prophecy) => {
              const IconComponent = prophecy.icon;
              const HouseIcon = getHouseIcon(prophecy.house);
              const prophecyColor = getProphecyColor(prophecy.prophecy, prophecy.divineChange);
              const ProphecyIcon = getProphecyIcon(prophecy.prophecy, prophecy.divineChange);
              const isActive = activeOracle === prophecy.id;

              return (
                <Card 
                  key={prophecy.id} 
                  className={`
                    transition-mystical hover-elevate cursor-pointer
                    ${getRarityClasses(prophecy.rarity)}
                    ${isActive ? 'sacred-glow-intense scale-105' : ''}
                    ${prophecy.blessing ? 'blessing-active' : ''}
                    ${prophecy.house ? `house-aura-${prophecy.house}` : ''}
                  `}
                  onMouseEnter={() => setActiveOracle(prophecy.id)}
                  onMouseLeave={() => setActiveOracle(null)}
                  data-testid={`oracle-${prophecy.id}`}
                >
                  <CardContent className="p-4 relative">
                    {/* Sacred Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="grid grid-cols-4 grid-rows-3 h-full w-full">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`border border-white/10 transition-mystical
                              ${isActive ? 'bg-white/10' : 'bg-transparent'}`}
                            style={{ 
                              animationDelay: `${i * 0.1}s`,
                              transform: isActive ? `translateY(-${Math.random() * 2}px)` : 'translateY(0)'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Oracle Icon with House Theme */}
                        <div className={`
                          relative p-3 rounded-lg transition-mystical
                          bg-gradient-to-br from-var(--house-${prophecy.house}-primary)/20 to-var(--house-${prophecy.house}-secondary)/10
                          ${isActive ? 'scale-110' : 'scale-100'}
                        `}>
                          <IconComponent className={`h-6 w-6 text-var(--house-${prophecy.house}-primary)`} />
                          <HouseIcon className="absolute -top-1 -right-1 w-3 h-3 text-amber-400" />
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-400 flex items-center space-x-1">
                            <span>{prophecy.oracleName}</span>
                            {prophecy.mysticalPower && (
                              <span className="text-xs text-amber-400">⚡{prophecy.mysticalPower}</span>
                            )}
                          </p>
                          <p className={`text-xl font-bold font-trading transition-mystical
                            ${prophecy.rarity === 'legendary' ? 'legendary-text' : 
                              prophecy.rarity === 'epic' ? 'epic-text' : 
                              prophecy.rarity === 'rare' ? 'rare-text' : 'text-white'}`}>
                            {prophecy.sacredValue}
                          </p>
                        </div>
                      </div>
                      
                      {/* Divine Change Indicator */}
                      <div className={`
                        flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-mystical
                        ${prophecy.divineChange > 0 ? 'bg-emerald-500/20 text-emerald-400' : 
                          prophecy.divineChange < 0 ? 'bg-red-500/20 text-red-400' : 
                          'bg-amber-500/20 text-amber-400'}
                        ${isActive ? 'scale-110' : 'scale-100'}
                      `}>
                        {ProphecyIcon}
                        <span className="font-trading">
                          {prophecy.divineChange > 0 ? '+' : ''}{prophecy.divineChange}%
                        </span>
                      </div>
                    </div>

                    {/* Mystical Power Bar */}
                    {prophecy.mysticalPower && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400">Mystical Power</span>
                          <span className="text-amber-400">{prophecy.mysticalPower}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 karma-fill`}
                            style={{ width: `${prophecy.mysticalPower}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Sacred Corner Runes */}
                    <div className={`
                      absolute top-1 left-1 w-2 h-2 border-l border-t transition-mystical
                      ${isActive ? `border-var(--house-${prophecy.house}-primary) scale-125` : 'border-slate-600/40'}
                    `} />
                    <div className={`
                      absolute top-1 right-1 w-2 h-2 border-r border-t transition-mystical
                      ${isActive ? `border-var(--house-${prophecy.house}-primary) scale-125` : 'border-slate-600/40'}
                    `} />
                    <div className={`
                      absolute bottom-1 left-1 w-2 h-2 border-l border-b transition-mystical
                      ${isActive ? `border-var(--house-${prophecy.house}-primary) scale-125` : 'border-slate-600/40'}
                    `} />
                    <div className={`
                      absolute bottom-1 right-1 w-2 h-2 border-r border-b transition-mystical
                      ${isActive ? `border-var(--house-${prophecy.house}-primary) scale-125` : 'border-slate-600/40'}
                    `} />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sacred Realm Status */}
          <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg 
                         border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>Sacred Realm Status</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  The Crystal Prophecies reveal harmonious energy flows across all trading realms
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mystical-pulse" />
                  <span className="text-sm font-medium text-emerald-400">Mystical Harmony</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Active Oracles</div>
                  <div className="text-lg font-bold text-white font-trading">
                    {sacredProphecies.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CrystalBallMarketOracle;