/**
 * MarketBeatPanel - Live price movements with narrative captions
 * Renders real-time market data as dynamic comic panels with house-themed visual effects
 */

import { useState, useEffect, useRef } from 'react';
import { ComicPanel } from '@/components/ui/comic-panel';
import { SpeechBubble } from '@/components/ui/speech-bubble';
import { CaptionBox } from '@/components/ui/caption-box';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Volume, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHouseTheme, type MythologicalHouse } from '@/contexts/HouseThemeContext';
import type { PanelScript } from '@/services/sequentialStoryEngine';
import type { MarketDataUpdate } from '@/services/websocketService';

interface MarketBeatPanelProps {
  panelScript: PanelScript;
  marketData: MarketDataUpdate;
  className?: string;
  isActive?: boolean;
  onPanelClick?: () => void;
  autoAdvance?: boolean;
  showNarrative?: boolean;
  effectIntensity?: 'low' | 'medium' | 'high';
}

interface PriceMovementAnimation {
  direction: 'up' | 'down' | 'sideways';
  intensity: 'subtle' | 'moderate' | 'dramatic' | 'explosive';
  duration: number;
}

export function MarketBeatPanel({
  panelScript,
  marketData,
  className,
  isActive = false,
  onPanelClick,
  autoAdvance = false,
  showNarrative = true,
  effectIntensity = 'medium'
}: MarketBeatPanelProps) {
  const { currentHouse, houseTheme } = useHouseTheme();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showPriceAnimation, setShowPriceAnimation] = useState(false);
  const [priceMovement, setPriceMovement] = useState<PriceMovementAnimation>({
    direction: 'sideways',
    intensity: 'subtle',
    duration: 1000
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Analyze price movement for visual effects
  useEffect(() => {
    const changePercent = Math.abs(marketData.changePercent);
    const direction = marketData.changePercent > 0 ? 'up' : 
                     marketData.changePercent < 0 ? 'down' : 'sideways';
    
    const intensity = changePercent > 10 ? 'explosive' :
                     changePercent > 5 ? 'dramatic' :
                     changePercent > 2 ? 'moderate' : 'subtle';

    setPriceMovement({
      direction,
      intensity,
      duration: intensity === 'explosive' ? 2000 : 
               intensity === 'dramatic' ? 1500 : 1000
    });

    // Trigger price animation
    setShowPriceAnimation(true);
    setTimeout(() => setShowPriceAnimation(false), priceMovement.duration);
  }, [marketData.changePercent, priceMovement.duration]);

  // Auto-advance dialogue
  useEffect(() => {
    if (!autoAdvance || panelScript.dialogue.length === 0) return;

    const timer = setInterval(() => {
      setCurrentDialogueIndex(prev => 
        prev < panelScript.dialogue.length - 1 ? prev + 1 : 0
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [autoAdvance, panelScript.dialogue.length]);

  // Get house-themed visual classes
  const getHouseEffectClasses = () => {
    const baseClasses = "absolute inset-0 pointer-events-none transition-all duration-1000";
    
    if (!showPriceAnimation) return `${baseClasses} opacity-0`;

    const houseEffects = {
      heroes: `${baseClasses} bg-gradient-to-r from-red-500/20 to-blue-500/20`,
      wisdom: `${baseClasses} bg-gradient-to-r from-blue-500/20 to-purple-500/20`,
      power: `${baseClasses} bg-gradient-to-r from-purple-500/20 to-red-500/20`,
      mystery: `${baseClasses} bg-gradient-to-r from-green-500/20 to-gray-500/20`,
      elements: `${baseClasses} bg-gradient-to-r from-orange-500/20 to-yellow-500/20`,
      time: `${baseClasses} bg-gradient-to-r from-yellow-500/20 to-cyan-500/20`,
      spirit: `${baseClasses} bg-gradient-to-r from-cyan-500/20 to-white/20`
    };

    return houseEffects[currentHouse] || houseEffects.heroes;
  };

  // Get price trend icon
  const getPriceTrendIcon = () => {
    if (priceMovement.direction === 'up') {
      return <TrendingUp className={cn(
        "h-6 w-6",
        priceMovement.intensity === 'explosive' ? "text-green-600 animate-bounce" :
        priceMovement.intensity === 'dramatic' ? "text-green-500 animate-pulse" :
        "text-green-400"
      )} />;
    } else if (priceMovement.direction === 'down') {
      return <TrendingDown className={cn(
        "h-6 w-6",
        priceMovement.intensity === 'explosive' ? "text-red-600 animate-bounce" :
        priceMovement.intensity === 'dramatic' ? "text-red-500 animate-pulse" :
        "text-red-400"
      )} />;
    }
    return <Activity className="h-6 w-6 text-gray-400" />;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get sound effect based on market movement
  const getSoundEffect = () => {
    if (priceMovement.intensity === 'explosive') {
      return priceMovement.direction === 'up' ? 'BOOM!' : 'CRASH!';
    } else if (priceMovement.intensity === 'dramatic') {
      return priceMovement.direction === 'up' ? 'SURGE!' : 'DROP!';
    }
    return undefined;
  };

  // Get panel variant based on movement intensity
  const getPanelVariant = () => {
    switch (priceMovement.intensity) {
      case 'explosive':
        return 'splash';
      case 'dramatic':
        return 'action';
      default:
        return 'default';
    }
  };

  const currentDialogue = panelScript.dialogue[currentDialogueIndex];

  return (
    <ComicPanel
      ref={panelRef}
      variant={getPanelVariant()}
      house={currentHouse}
      size={priceMovement.intensity === 'explosive' ? 'splash' : 'default'}
      isActive={isActive}
      soundEffect={getSoundEffect()}
      narrativeText={showNarrative ? panelScript.narrativeBeats[0]?.text : undefined}
      onPanelClick={onPanelClick}
      effectIntensity={effectIntensity}
      className={cn(
        "relative overflow-hidden",
        priceMovement.direction === 'up' ? "border-green-400" :
        priceMovement.direction === 'down' ? "border-red-400" :
        "border-gray-400",
        className
      )}
      data-testid="market-beat-panel"
    >
      {/* House-themed visual effects overlay */}
      <div className={getHouseEffectClasses()} />

      {/* Price movement speed lines effect */}
      {showPriceAnimation && priceMovement.intensity !== 'subtle' && (
        <div className={cn(
          "absolute inset-0 pointer-events-none",
          priceMovement.direction === 'up' ? "speed-lines-up" : "speed-lines-down",
          priceMovement.intensity === 'explosive' ? "opacity-60" : "opacity-30"
        )} />
      )}

      {/* Main Content Area */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Asset Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {marketData.symbol}
            </Badge>
            {getPriceTrendIcon()}
          </div>
          
          {/* Volume indicator */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Volume className="h-3 w-3" />
            <span>{marketData.volume.toLocaleString()}</span>
          </div>
        </div>

        {/* Price Display */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className={cn(
            "text-2xl font-bold transition-all duration-500",
            showPriceAnimation && priceMovement.intensity !== 'subtle' ? "scale-110" : "",
            priceMovement.direction === 'up' ? "text-green-600" :
            priceMovement.direction === 'down' ? "text-red-600" :
            "text-gray-600"
          )}>
            {formatCurrency(marketData.currentPrice)}
          </div>
          
          <div className={cn(
            "text-sm font-medium flex items-center gap-1",
            priceMovement.direction === 'up' ? "text-green-500" :
            priceMovement.direction === 'down' ? "text-red-500" :
            "text-gray-500"
          )}>
            <span>
              {marketData.changePercent > 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%
            </span>
            <span className="text-xs">
              ({marketData.change > 0 ? '+' : ''}{formatCurrency(marketData.change)})
            </span>
          </div>

          {/* Volatility Alert */}
          {priceMovement.intensity === 'explosive' && (
            <div className="mt-2 flex items-center gap-1 text-orange-600 animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs font-bold">HIGH VOLATILITY</span>
            </div>
          )}
        </div>

        {/* Dialogue/Speech Bubbles */}
        {currentDialogue && (
          <SpeechBubble
            variant={currentDialogue.style === 'shout' ? 'shout' : 
                    currentDialogue.style === 'whisper' ? 'whisper' : 'default'}
            size="sm"
            speaker={currentDialogue.speaker}
            priority={priceMovement.intensity === 'explosive' ? 'urgent' : 'normal'}
            className={cn(
              "absolute z-20",
              currentDialogue.position === 'top-left' ? "top-2 left-2" :
              currentDialogue.position === 'top-right' ? "top-2 right-2" :
              currentDialogue.position === 'bottom-left' ? "bottom-16 left-2" :
              currentDialogue.position === 'bottom-right' ? "bottom-16 right-2" :
              "bottom-16 left-1/2 transform -translate-x-1/2"
            )}
            data-testid="market-dialogue"
          >
            {currentDialogue.text}
          </SpeechBubble>
        )}

        {/* Market Context Caption */}
        {marketData.volume > 100000 && (
          <CaptionBox
            variant="narrative"
            size="sm"
            position="bottom-right"
            timestamp={new Date()}
            className="z-30"
            data-testid="market-context"
          >
            {priceMovement.intensity === 'explosive' ? 
              "Massive volume surge drives extreme volatility!" :
              "Heavy trading activity detected"
            }
          </CaptionBox>
        )}
      </div>

      {/* Panel Transition Indicators */}
      {autoAdvance && panelScript.dialogue.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1 z-40">
          {panelScript.dialogue.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                index === currentDialogueIndex ? "bg-primary" : "bg-primary/30"
              )}
            />
          ))}
        </div>
      )}
    </ComicPanel>
  );
}

export default MarketBeatPanel;