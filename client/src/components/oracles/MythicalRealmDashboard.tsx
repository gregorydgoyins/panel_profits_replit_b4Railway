import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, Zap, Globe, Brain, Eye, Target, 
  Crown, Shield, Crystal, Flame, Users, Clock, Star, Sparkles, 
  Scroll, Swords, Gem, BookOpen
} from 'lucide-react';

type HouseType = 'heroes' | 'wisdom' | 'power' | 'mystery' | 'elements' | 'time' | 'spirit';

interface MythicalMarketData {
  index: number;
  change: number;
  volume: number;
  volatility: number;
  marketCap: number;
  activeAssets: number;
  selectedHouse?: HouseType;
  topGainers: Array<{ symbol: string; change: number; house?: HouseType; rarity?: string }>;
  topLosers: Array<{ symbol: string; change: number; house?: HouseType; rarity?: string }>;
  housePerformance: Array<{ 
    house: HouseType; 
    performance: number; 
    allocation: number; 
    powerLevel: number;
    blessing?: boolean;
  }>;
  sentimentData: {
    overall: number;
    confidence: number;
    trend: 'ascending' | 'descending' | 'balanced';
    divineBlessing: number;
  };
}

interface MythicalRealmDashboardProps {
  marketData: MythicalMarketData;
  className?: string;
}

export function MythicalRealmDashboard({ marketData, className = "" }: MythicalRealmDashboardProps) {
  const [activeNodes, setActiveNodes] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    pulse: boolean;
    house: HouseType;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>>([]);
  
  const [mysticalField, setMysticalField] = useState(0);
  const [isScrying, setIsScrying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate mystical network nodes with house themes
  useEffect(() => {
    const houses: HouseType[] = ['heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'];
    const nodes = Array.from({ length: 28 }, (_, i) => {
      const house = houses[i % houses.length];
      const isRare = Math.random() > 0.7;
      const isEpic = Math.random() > 0.9;
      const isLegendary = Math.random() > 0.95;
      
      let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
      if (isLegendary) rarity = 'legendary';
      else if (isEpic) rarity = 'epic';
      else if (isRare) rarity = 'rare';

      const getHouseColor = (house: HouseType) => {
        switch (house) {
          case 'heroes': return marketData.change > 0 ? 'rgb(59, 130, 246)' : 'rgb(225, 100, 70)';
          case 'wisdom': return 'rgb(139, 92, 246)';
          case 'power': return 'rgb(239, 68, 68)';
          case 'mystery': return 'rgb(34, 197, 94)';
          case 'elements': return 'rgb(251, 191, 36)';
          case 'time': return 'rgb(100, 116, 139)';
          case 'spirit': return 'rgb(20, 184, 166)';
          default: return 'rgb(156, 163, 175)';
        }
      };

      return {
        id: i,
        x: Math.random() * 500,
        y: Math.random() * 350,
        size: rarity === 'legendary' ? 8 : rarity === 'epic' ? 6 : rarity === 'rare' ? 4 : Math.random() * 4 + 2,
        color: getHouseColor(house),
        pulse: rarity !== 'common' || Math.random() > 0.6,
        house,
        rarity
      };
    });
    setActiveNodes(nodes);
  }, [marketData]);

  // Mystical field animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalField(prev => (prev + 1) % 360);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Scrying animation
  useEffect(() => {
    const scryingInterval = setInterval(() => {
      setIsScrying(true);
      setTimeout(() => setIsScrying(false), 3000);
    }, 12000);
    return () => clearInterval(scryingInterval);
  }, []);

  // Draw mystical connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw house-based mystical connections
      for (let i = 0; i < activeNodes.length; i++) {
        for (let j = i + 1; j < activeNodes.length; j++) {
          const node1 = activeNodes[i];
          const node2 = activeNodes[j];
          const distance = Math.sqrt(
            Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
          );
          
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.4;
            const sameHouse = node1.house === node2.house;
            
            ctx.strokeStyle = sameHouse ? 
              `rgba(251, 191, 36, ${opacity})` : // Gold for same house
              `rgba(139, 92, 246, ${opacity * 0.6})`; // Purple for different houses
            ctx.lineWidth = sameHouse ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes with rarity effects
      activeNodes.forEach(node => {
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.pulse ? 0.8 + Math.sin(Date.now() * 0.01) * 0.3 : 0.7;
        
        // Draw outer glow for rare+ nodes
        if (node.rarity !== 'common') {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = node.rarity === 'legendary' ? 15 : node.rarity === 'epic' ? 10 : 5;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeNodes]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-emerald-400 bg-emerald-500/30';
    if (sentiment > 0.1) return 'text-blue-400 bg-blue-500/30';
    if (sentiment > -0.1) return 'text-amber-400 bg-amber-500/30';
    if (sentiment > -0.3) return 'text-orange-400 bg-orange-500/30';
    return 'text-red-400 bg-red-500/30';
  };

  const getHouseIcon = (house: HouseType) => {
    switch (house) {
      case 'heroes': return Shield;
      case 'wisdom': return BookOpen;
      case 'power': return Crown;
      case 'mystery': return Crystal;
      case 'elements': return Flame;
      case 'time': return Clock;
      case 'spirit': return Users;
      default: return Star;
    }
  };

  const selectedHouse = marketData.selectedHouse || 'heroes';

  return (
    <div className={`relative overflow-hidden sacred-particles ${className}`}>
      {/* Mystical Background Field */}
      <div className="absolute inset-0 opacity-25">
        <canvas 
          ref={canvasRef}
          width={500}
          height={350}
          className="w-full h-full"
        />
      </div>

      {/* Main Mystical Dashboard Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sacred Market Index - Main Display */}
        <div className={`
          lg:col-span-2 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
          backdrop-blur-xl rounded-2xl p-6 border-2 border-slate-700/50 overflow-hidden transition-arcane
          ${isScrying ? 'sacred-glow-divine border-amber-400/50' : ''}
          ${selectedHouse ? `house-aura-${selectedHouse}` : ''}
        `}>
          <div className="relative">
            {/* Sacred Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Globe className={`w-8 h-8 text-cyan-400 transition-mystical ${isScrying ? 'scale-125 sacred-glow-intense' : 'mystical-pulse'}`} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                  {React.createElement(getHouseIcon(selectedHouse), { 
                    className: `absolute -bottom-1 -left-1 w-4 h-4 text-var(--house-${selectedHouse}-primary) mystical-pulse` 
                  })}
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white legendary-text">
                    Mythical Realm Index
                  </h2>
                  <p className="text-slate-400 text-sm">Sacred prophecies from the mystical realms</p>
                </div>
              </div>
              
              {/* Divine Status */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 
                             rounded-full border border-emerald-500/30 mystical-pulse">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-emerald-400 text-sm font-medium">DIVINE SIGHT</span>
              </div>
            </div>

            {/* Main Index Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <div className={`text-4xl font-display font-bold font-trading mb-2 transition-mystical
                  ${Math.abs(marketData.change) > 5 ? 'legendary-text' : 
                    Math.abs(marketData.change) > 2 ? 'epic-text' : 'text-white'}`}>
                  {marketData.index.toLocaleString()}
                </div>
                <div className={`
                  flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-mystical
                  ${marketData.change > 0 ? 'bg-emerald-500/20 text-emerald-400' : 
                    marketData.change < 0 ? 'bg-red-500/20 text-red-400' : 
                    'bg-amber-500/20 text-amber-400'}
                  ${isScrying ? 'scale-110' : 'scale-100'}
                `}>
                  {marketData.change > 0 ? <TrendingUp className="w-4 h-4" /> : 
                   marketData.change < 0 ? <TrendingDown className="w-4 h-4" /> : 
                   <Activity className="w-4 h-4" />}
                  <span>{marketData.change > 0 ? '+' : ''}{marketData.change.toFixed(2)}%</span>
                </div>
              </div>

              {/* Sacred Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 transition-mystical hover-elevate">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-400">Mystic Flows</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    {marketData.volume >= 1e9 ? `${(marketData.volume / 1e9).toFixed(1)}B` : 
                     marketData.volume >= 1e6 ? `${(marketData.volume / 1e6).toFixed(1)}M` : 
                     `${(marketData.volume / 1e3).toFixed(1)}K`}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 transition-mystical hover-elevate">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">Chaos Level</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    {(marketData.volatility * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 transition-mystical hover-elevate">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Sacred Assets</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    {marketData.activeAssets}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50 transition-mystical hover-elevate">
                  <div className="flex items-center space-x-2 mb-1">
                    <Crown className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Realm Value</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    CC {marketData.marketCap >= 1e9 ? `${(marketData.marketCap / 1e9).toFixed(1)}B` : 
                         `${(marketData.marketCap / 1e6).toFixed(1)}M`}
                  </div>
                </div>
              </div>
            </div>

            {/* House Performance Visualization */}
            <div>
              <h3 className="text-lg font-display font-semibold text-white mb-3 flex items-center space-x-2">
                <Scroll className="w-5 h-5 text-amber-400" />
                <span>Seven Houses Sacred Power</span>
              </h3>
              <div className="space-y-3">
                {marketData.housePerformance.map((house, index) => {
                  const HouseIcon = getHouseIcon(house.house);
                  return (
                    <div key={house.house} className="relative group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <HouseIcon className={`w-4 h-4 text-var(--house-${house.house}-primary) mystical-pulse`} />
                          <span className="text-sm text-slate-300 capitalize font-medium">
                            House of {house.house}
                          </span>
                          {house.blessing && (
                            <Sparkles className="w-3 h-3 text-amber-400 mystical-pulse" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-trading ${
                            house.performance > 0 ? 'text-emerald-400' : 
                            house.performance < 0 ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {house.performance > 0 ? '+' : ''}{house.performance.toFixed(2)}%
                          </span>
                          <span className="text-xs text-amber-400">⚡{house.powerLevel}</span>
                        </div>
                      </div>
                      
                      <div className="relative w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        {/* Base allocation bar */}
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r from-var(--house-${house.house}-primary)/30 to-var(--house-${house.house}-secondary)/20`}
                          style={{ width: `${house.allocation}%` }}
                        />
                        
                        {/* Performance overlay */}
                        <div 
                          className={`
                            absolute top-0 left-0 h-3 rounded-full transition-all duration-700
                            ${house.performance > 0 ? 
                              `bg-gradient-to-r from-var(--house-${house.house}-primary) to-emerald-400` : 
                              house.performance < 0 ? 
                              `bg-gradient-to-r from-var(--house-${house.house}-primary) to-red-400` : 
                              `bg-var(--house-${house.house}-primary)`}
                          `}
                          style={{ 
                            width: `${Math.min(house.allocation, Math.abs(house.performance) * 8)}%`,
                            opacity: Math.min(1, Math.abs(house.performance) / 5)
                          }}
                        />
                        
                        {/* Sacred energy particle */}
                        <div 
                          className="absolute top-0 w-1 h-3 bg-white rounded-full mystical-pulse"
                          style={{ 
                            left: `${(house.allocation * (Math.sin(mysticalField * 0.1 + index) + 1)) / 2}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divine Sentiment & Sacred Movers */}
        <div className="space-y-6">
          {/* Sacred Sentiment Orb */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
                         backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 transition-mystical hover-elevate">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400 mystical-pulse" />
              <h3 className="text-lg font-display font-semibold text-white">Divine Oracle</h3>
            </div>
            
            <div className="text-center mb-4">
              <div className={`
                inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 border-2 transition-arcane
                ${getSentimentColor(marketData.sentimentData.overall)}
                ${isScrying ? 'scale-110 sacred-glow-moderate' : ''}
              `}>
                <span className="text-2xl font-display font-bold font-trading">
                  {(marketData.sentimentData.overall * 100).toFixed(0)}
                </span>
              </div>
              <div className="text-sm text-slate-400 capitalize flex items-center justify-center space-x-1">
                <span>{marketData.sentimentData.trend}</span>
                {marketData.sentimentData.divineBlessing > 0 && (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Divine Confidence</span>
                  <span className="text-white">{(marketData.sentimentData.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700 mystical-pulse"
                    style={{ width: `${marketData.sentimentData.confidence * 100}%` }}
                  />
                </div>
              </div>

              {marketData.sentimentData.divineBlessing > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-400">Sacred Blessing</span>
                    <span className="text-amber-300">+{(marketData.sentimentData.divineBlessing * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-amber-900/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full karma-fill"
                      style={{ width: `${marketData.sentimentData.divineBlessing * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sacred Market Movers */}
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 
                         backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 transition-mystical hover-elevate">
            <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center space-x-2">
              <Swords className="w-5 h-5 text-cyan-400" />
              <span>Sacred Champions</span>
            </h3>
            
            <div className="space-y-4">
              {/* Ascending Champions */}
              <div>
                <h4 className="text-sm text-emerald-400 mb-2 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Ascending Champions</span>
                </h4>
                <div className="space-y-1">
                  {marketData.topGainers.slice(0, 3).map((gainer, index) => {
                    const HouseIcon = gainer.house ? getHouseIcon(gainer.house) : Star;
                    return (
                      <div key={gainer.symbol} className="flex items-center justify-between text-sm group hover-elevate p-1 rounded">
                        <div className="flex items-center space-x-2">
                          <HouseIcon className={`w-3 h-3 ${gainer.house ? `text-var(--house-${gainer.house}-primary)` : 'text-slate-400'}`} />
                          <span className={`text-slate-300 ${gainer.rarity === 'legendary' ? 'legendary-text text-xs' : 
                            gainer.rarity === 'epic' ? 'epic-text text-xs' : 
                            gainer.rarity === 'rare' ? 'rare-text text-xs' : ''}`}>
                            {gainer.symbol}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-trading">+{gainer.change.toFixed(2)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fallen Champions */}
              <div>
                <h4 className="text-sm text-red-400 mb-2 flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>Fallen Champions</span>
                </h4>
                <div className="space-y-1">
                  {marketData.topLosers.slice(0, 3).map((loser, index) => {
                    const HouseIcon = loser.house ? getHouseIcon(loser.house) : Star;
                    return (
                      <div key={loser.symbol} className="flex items-center justify-between text-sm group hover-elevate p-1 rounded">
                        <div className="flex items-center space-x-2">
                          <HouseIcon className={`w-3 h-3 ${loser.house ? `text-var(--house-${loser.house}-primary)` : 'text-slate-400'}`} />
                          <span className={`text-slate-300 ${loser.rarity === 'legendary' ? 'legendary-text text-xs' : 
                            loser.rarity === 'epic' ? 'epic-text text-xs' : 
                            loser.rarity === 'rare' ? 'rare-text text-xs' : ''}`}>
                            {loser.symbol}
                          </span>
                        </div>
                        <span className="text-red-400 font-trading">{loser.change.toFixed(2)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Energy Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-divine"
          style={{ 
            transform: `translateX(${Math.sin(mysticalField * 0.03) * 100}px)`,
            opacity: isScrying ? 0.8 : 0.4
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent transition-divine"
          style={{ 
            transform: `translateX(${Math.sin(mysticalField * 0.025 + Math.PI) * 100}px)`,
            opacity: isScrying ? 0.6 : 0.3
          }}
        />
      </div>
    </div>
  );
}

export default MythicalRealmDashboard;