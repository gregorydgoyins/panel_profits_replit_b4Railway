import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Zap, Crown, Star, Shield, Flame, 
  RotateCcw, Eye, TrendingUp, Award 
} from 'lucide-react';
import { useHouseTheme } from '@/contexts/HouseThemeContext';

interface VariantTradingCardData {
  frontData: {
    name: string;
    artist: string;
    rarity: string;
    powerLevel: number;
    specialAbilities: string[];
    imageUrl: string;
  };
  backData: {
    lore: string;
    stats: {
      scarcity: number;
      demand: number;
      artistry: number;
      collectibility: number;
    };
    marketValue: number;
    lastSale: string;
  };
  holographicEffect: boolean;
  animationTriggers: string[];
}

interface VariantTradingCardProps {
  variantId: string;
  tradingCardData: VariantTradingCardData;
  onFlip?: () => void;
  showFlipButton?: boolean;
  autoRotate?: boolean;
  houseAffiliation?: string;
  className?: string;
}

export function VariantTradingCard({
  variantId,
  tradingCardData,
  onFlip,
  showFlipButton = true,
  autoRotate = false,
  houseAffiliation,
  className = ""
}: VariantTradingCardProps) {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sparkleElements, setSparkleElements] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number>();

  const house = houseAffiliation || currentHouse;
  const { frontData, backData, holographicEffect } = tradingCardData;

  // Generate sparkle effects for rare cards
  useEffect(() => {
    if (holographicEffect) {
      const generateSparkles = () => {
        const sparkles = Array.from({ length: 8 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2
        }));
        setSparkleElements(sparkles);
      };

      generateSparkles();
      const interval = setInterval(generateSparkles, 3000);
      return () => clearInterval(interval);
    }
  }, [holographicEffect]);

  // Auto-rotate effect
  useEffect(() => {
    if (autoRotate && holographicEffect) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (cardRef.current) {
          const rotation = Math.sin(elapsed * 0.5) * 3; // Gentle rotation
          cardRef.current.style.transform = `perspective(1000px) rotateY(${rotation}deg) rotateX(${rotation * 0.3}deg)`;
        }
        animationFrame.current = requestAnimationFrame(animate);
      };
      animationFrame.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
      };
    }
  }, [autoRotate, holographicEffect]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'mythic': return 'from-amber-400 via-yellow-300 to-amber-400';
      case 'legendary': return 'from-orange-400 via-red-400 to-orange-400';
      case 'epic': return 'from-purple-400 via-pink-400 to-purple-400';
      case 'rare': return 'from-blue-400 via-cyan-400 to-blue-400';
      case 'uncommon': return 'from-green-400 via-emerald-400 to-green-400';
      default: return 'from-gray-400 via-gray-300 to-gray-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'mythic': return Crown;
      case 'legendary': return Award;
      case 'epic': return Star;
      case 'rare': return Zap;
      case 'uncommon': return Shield;
      default: return Eye;
    }
  };

  const getPowerLevelColor = (level: number) => {
    if (level >= 90) return 'text-amber-400';
    if (level >= 75) return 'text-orange-400';
    if (level >= 60) return 'text-purple-400';
    if (level >= 45) return 'text-blue-400';
    if (level >= 30) return 'text-green-400';
    return 'text-gray-400';
  };

  const getStatColor = (value: number) => {
    if (value >= 85) return 'from-amber-500 to-yellow-400';
    if (value >= 70) return 'from-orange-500 to-red-400';
    if (value >= 55) return 'from-purple-500 to-pink-400';
    if (value >= 40) return 'from-blue-500 to-cyan-400';
    if (value >= 25) return 'from-green-500 to-emerald-400';
    return 'from-gray-500 to-gray-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const RarityIcon = getRarityIcon(frontData.rarity);

  return (
    <div 
      className={`perspective-1000 ${className}`}
      data-testid={`variant-trading-card-${variantId}`}
    >
      <motion.div
        ref={cardRef}
        className="relative w-full h-full cursor-pointer preserve-3d"
        initial={false}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          scale: isHovered ? 1.05 : 1 
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleFlip}
        whileHover={holographicEffect ? { 
          boxShadow: `0 0 30px ${frontData.rarity === 'mythic' ? 'rgba(251, 191, 36, 0.5)' : 
                                   frontData.rarity === 'legendary' ? 'rgba(249, 115, 22, 0.5)' : 
                                   'rgba(147, 51, 234, 0.5)'}`,
          rotateX: 2,
          rotateZ: 1
        } : { scale: 1.05 }}
      >
        {/* Card Front */}
        <motion.div className="absolute inset-0 w-full h-full backface-hidden">
          <Card className={`
            h-full relative overflow-hidden 
            ${holographicEffect ? 'holographic-card' : ''}
            bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
            border-2 ${holographicEffect ? `border-gradient bg-gradient-to-r ${getRarityColor(frontData.rarity)}` : 'border-slate-600'}
          `}>
            {/* Holographic Sparkles */}
            {holographicEffect && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <AnimatePresence>
                  {sparkleElements.map((sparkle) => (
                    <motion.div
                      key={sparkle.id}
                      className="absolute"
                      style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360] 
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: sparkle.delay,
                        repeat: Infinity,
                        repeatDelay: 3 
                      }}
                    >
                      <Sparkles className="h-3 w-3 text-white" />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Holographic Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
            )}

            <CardContent className="p-4 h-full flex flex-col relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                    {frontData.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">by {frontData.artist}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={`bg-gradient-to-r ${getRarityColor(frontData.rarity)} text-black font-bold text-xs px-2 py-1`}>
                    <RarityIcon className="h-3 w-3 mr-1" />
                    {frontData.rarity.toUpperCase()}
                  </Badge>
                  <div className={`text-xl font-bold ${getPowerLevelColor(frontData.powerLevel)}`}>
                    ⚡{frontData.powerLevel}
                  </div>
                </div>
              </div>

              {/* Art/Image Area */}
              <div className="flex-1 mb-3 relative">
                <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded border-2 border-slate-600 overflow-hidden relative">
                  {frontData.imageUrl ? (
                    <motion.img
                      src={frontData.imageUrl}
                      alt={frontData.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                  
                  {/* Power Level Overlay */}
                  <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1">
                    <span className={`text-sm font-bold ${getPowerLevelColor(frontData.powerLevel)}`}>
                      PWR {frontData.powerLevel}
                    </span>
                  </div>

                  {/* House Emblem */}
                  {house && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className={`text-xs bg-${house}-primary/20 border-${house}-primary`}>
                        {house.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Abilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Special Abilities</h4>
                <div className="flex flex-wrap gap-1">
                  {frontData.specialAbilities.slice(0, 4).map((ability, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-slate-700 text-gray-200 hover:bg-slate-600"
                    >
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Flip Indicator */}
              {showFlipButton && (
                <div className="mt-2 text-center">
                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-slate-700">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Flip Card
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Card Back */}
        <motion.div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <Card className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-600">
            <CardContent className="p-4 h-full flex flex-col">
              {/* Back Header */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white">{frontData.name}</h3>
                <Badge className={`bg-gradient-to-r ${getRarityColor(frontData.rarity)} text-black font-bold`}>
                  {frontData.rarity.toUpperCase()} VARIANT
                </Badge>
              </div>

              {/* Lore */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-300 mb-2">LORE</h4>
                <p className="text-xs text-gray-400 leading-relaxed italic">
                  {backData.lore}
                </p>
              </div>

              {/* Stats */}
              <div className="mb-4 flex-1">
                <h4 className="text-sm font-bold text-gray-300 mb-3">COLLECTIBLE STATS</h4>
                <div className="space-y-3">
                  {Object.entries(backData.stats).map(([statName, value]) => (
                    <div key={statName} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 capitalize">{statName}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${getStatColor(value)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white w-8 text-right">
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-300">MARKET DATA</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Current Value</span>
                  <span className="text-sm font-bold text-green-400">
                    {formatCurrency(backData.marketValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last Sale</span>
                  <span className="text-xs text-gray-300">{backData.lastSale}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                <p className="text-xs text-gray-500">
                  Panel Profits Collector Trading Card
                </p>
                <Badge variant="outline" className="text-xs mt-1 cursor-pointer hover:bg-slate-700">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Flip Back
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}