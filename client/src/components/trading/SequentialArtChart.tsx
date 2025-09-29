import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Zap, AlertTriangle, Target } from 'lucide-react';
import { ComicPanel } from '@/components/ui/comic-panel';
import { ComicGrid } from '@/components/ui/comic-grid';
import { ComicSoundEffect } from '@/components/ui/comic-sound-effect';
import { CaptionBox, NarrativeCaptionBox } from '@/components/ui/caption-box';
import { SpeedLinesTransition } from '@/components/ui/comic-transitions';
import { cn } from '@/lib/utils';

interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
  change?: number;
  changePercent?: number;
}

interface MarketEvent {
  type: 'surge' | 'crash' | 'breakout' | 'resistance' | 'support';
  timestamp: number;
  intensity: 'low' | 'normal' | 'high' | 'extreme';
  soundEffect: string;
  narrative: string;
}

interface SequentialArtChartProps {
  symbol: string;
  data: PricePoint[];
  timeframe: '1m' | '5m' | '1h' | '1d' | '1w';
  className?: string;
  autoAdvance?: boolean;
  showNarrative?: boolean;
  house?: string;
}

export function SequentialArtChart({
  symbol,
  data,
  timeframe,
  className,
  autoAdvance = true,
  showNarrative = true,
  house = 'heroes'
}: SequentialArtChartProps) {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [soundTriggers, setSoundTriggers] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(autoAdvance);

  // Transform price data into story beats
  const storyPanels = useMemo(() => {
    if (data.length < 4) return [];

    const panels = [];
    const segmentSize = Math.max(1, Math.floor(data.length / 6)); // Create 6 panels max

    for (let i = 0; i < data.length; i += segmentSize) {
      const segment = data.slice(i, i + segmentSize);
      if (segment.length === 0) continue;

      const startPrice = segment[0].price;
      const endPrice = segment[segment.length - 1].price;
      const change = endPrice - startPrice;
      const changePercent = (change / startPrice) * 100;

      const event = classifyMarketEvent(changePercent, segment);
      const narrative = generateNarrative(symbol, event, startPrice, endPrice, timeframe);

      panels.push({
        id: `panel-${i}`,
        segment,
        startPrice,
        endPrice,
        change,
        changePercent,
        event,
        narrative,
        timestamp: segment[0].timestamp,
      });
    }

    return panels;
  }, [data, symbol, timeframe]);

  // Auto-advance through panels
  useEffect(() => {
    if (!isPlaying || storyPanels.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPanelIndex((prev) => {
        const next = (prev + 1) % storyPanels.length;
        
        // Trigger sound effect
        const panel = storyPanels[next];
        if (panel.event.soundEffect) {
          setSoundTriggers(prev => ({ 
            ...prev, 
            [`panel-${next}`]: true 
          }));
          
          setTimeout(() => {
            setSoundTriggers(prev => ({ 
              ...prev, 
              [`panel-${next}`]: false 
            }));
          }, 1000);
        }
        
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, storyPanels]);

  if (storyPanels.length === 0) {
    return (
      <ComicPanel className={cn("flex items-center justify-center", className)}>
        <CaptionBox variant="narrative">
          <span className="font-comic-narrative">Waiting for market data...</span>
        </CaptionBox>
      </ComicPanel>
    );
  }

  const currentPanel = storyPanels[currentPanelIndex];

  return (
    <div className={cn("sequential-art-chart relative", className)}>
      {/* Main Story Panel */}
      <div className="relative">
        <ComicPanel
          variant={currentPanel.event.intensity === 'extreme' ? 'splash' : 'default'}
          house={house}
          size={currentPanel.event.intensity === 'extreme' ? 'splash' : 'lg'}
          soundEffect={currentPanel.event.soundEffect}
          className="min-h-96"
        >
          {/* Speed Lines for Dramatic Movement */}
          <SpeedLinesTransition
            trigger={Math.abs(currentPanel.changePercent) > 5}
            direction={currentPanel.change > 0 ? 'up' : 'down'}
            intensity={currentPanel.event.intensity}
          >
            <div className="h-full flex flex-col">
              {/* Price Chart Visualization */}
              <div className="flex-1 relative">
                <PriceVisualization 
                  segment={currentPanel.segment}
                  changePercent={currentPanel.changePercent}
                  event={currentPanel.event}
                />
              </div>

              {/* Panel Narrative */}
              {showNarrative && (
                <NarrativeCaptionBox
                  position="bottom-center"
                  className="mt-4"
                >
                  <div className="font-comic-narrative text-sm leading-tight">
                    {currentPanel.narrative}
                  </div>
                </NarrativeCaptionBox>
              )}
            </div>
          </SpeedLinesTransition>

          {/* Sound Effect Overlay */}
          <ComicSoundEffect
            sound={currentPanel.event.soundEffect}
            variant="impact"
            intensity={currentPanel.event.intensity}
            trigger={soundTriggers[`panel-${currentPanelIndex}`]}
            position="top-right"
          />
        </ComicPanel>
      </div>

      {/* Panel Navigation & Controls */}
      <div className="mt-4 flex items-center justify-between">
        {/* Story Beat Indicators */}
        <div className="panel-progress-indicator">
          {storyPanels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPanelIndex(index)}
              className={cn(
                "panel-progress-dot mr-2",
                index === currentPanelIndex && "active",
                index < currentPanelIndex && "completed"
              )}
              data-testid={`story-beat-${index}`}
            />
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="font-comic-display text-xs bg-black text-white px-3 py-1 rounded hover-elevate"
            data-testid="playback-toggle"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          
          <div className="font-comic-narrative text-xs text-gray-600">
            Panel {currentPanelIndex + 1} of {storyPanels.length}
          </div>
        </div>
      </div>

      {/* Story Summary Panels */}
      <div className="mt-6">
        <ComicGrid layout="responsive" spacing="normal" className="grid-cols-3 lg:grid-cols-6">
          {storyPanels.map((panel, index) => (
            <ComicPanel
              key={panel.id}
              size="sm"
              house={house}
              variant={index === currentPanelIndex ? 'action' : 'quiet'}
              isActive={index === currentPanelIndex}
              className="cursor-pointer"
              onClick={() => setCurrentPanelIndex(index)}
              data-testid={`mini-panel-${index}`}
            >
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MovementIcon changePercent={panel.changePercent} />
                <div className="font-comic-display text-xs mt-1">
                  {panel.changePercent > 0 ? '+' : ''}{panel.changePercent.toFixed(1)}%
                </div>
                <div className="font-comic-narrative text-xs opacity-75 mt-1">
                  ${panel.endPrice.toFixed(2)}
                </div>
              </div>
            </ComicPanel>
          ))}
        </ComicGrid>
      </div>
    </div>
  );
}

// Helper component for price visualization
function PriceVisualization({ 
  segment, 
  changePercent, 
  event 
}: { 
  segment: PricePoint[]; 
  changePercent: number;
  event: MarketEvent;
}) {
  const isPositive = changePercent > 0;
  const intensity = Math.abs(changePercent);

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      {/* Dramatic Background Effect */}
      <div className={cn(
        "absolute inset-0 opacity-20",
        event.intensity === 'extreme' && "animate-pulse",
        isPositive ? "bg-gradient-to-t from-green-500/20 to-transparent" :
                    "bg-gradient-to-t from-red-500/20 to-transparent"
      )} />

      {/* Price Line Visualization */}
      <svg className="w-full h-full" viewBox="0 0 300 200">
        {/* Generate path from segment data */}
        <path
          d={generatePricePath(segment)}
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth={intensity > 10 ? "4" : intensity > 5 ? "3" : "2"}
          fill="none"
          className={cn(
            "transition-all duration-500",
            intensity > 10 && "animate-pulse drop-shadow-lg"
          )}
        />
        
        {/* Start and end points */}
        <circle
          cx="30"
          cy="100"
          r="4"
          fill="#64748b"
          className="animate-pulse"
        />
        <circle
          cx="270"
          cy={segment.length > 0 ? scalePrice(segment[segment.length - 1].price, segment) : "100"}
          r="6"
          fill={isPositive ? "#10b981" : "#ef4444"}
          className="animate-bounce"
        />
      </svg>

      {/* Price Movement Arrow */}
      <div className={cn(
        "absolute right-4 text-4xl",
        isPositive ? "text-green-500 animate-bounce" : "text-red-500 animate-pulse"
      )}>
        {isPositive ? "↗️" : "↘️"}
      </div>

      {/* Intensity Effects */}
      {intensity > 15 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-yellow-400/10 animate-ping rounded" />
        </div>
      )}
    </div>
  );
}

// Helper component for movement icons
function MovementIcon({ changePercent }: { changePercent: number }) {
  const absChange = Math.abs(changePercent);
  const isPositive = changePercent > 0;

  if (absChange > 10) {
    return isPositive ? 
      <TrendingUp className="w-6 h-6 text-green-500 animate-bounce" /> :
      <TrendingDown className="w-6 h-6 text-red-500 animate-pulse" />;
  }
  
  if (absChange > 5) {
    return <Zap className="w-5 h-5 text-yellow-500" />;
  }
  
  if (absChange > 2) {
    return <Target className="w-4 h-4 text-blue-500" />;
  }
  
  return <AlertTriangle className="w-4 h-4 text-gray-500" />;
}

// Utility functions
function classifyMarketEvent(changePercent: number, segment: PricePoint[]): MarketEvent {
  const absChange = Math.abs(changePercent);
  
  if (absChange > 15) {
    return {
      type: changePercent > 0 ? 'surge' : 'crash',
      timestamp: segment[0].timestamp,
      intensity: 'extreme',
      soundEffect: changePercent > 0 ? 'BOOM!' : 'CRASH!',
      narrative: changePercent > 0 ? 
        'The bulls charge with overwhelming force!' : 
        'The bears strike with devastating power!'
    };
  }
  
  if (absChange > 8) {
    return {
      type: changePercent > 0 ? 'breakout' : 'crash',
      timestamp: segment[0].timestamp,
      intensity: 'high',
      soundEffect: changePercent > 0 ? 'POW!' : 'WHAM!',
      narrative: changePercent > 0 ? 
        'A powerful breakthrough emerges!' : 
        'The market faces strong resistance!'
    };
  }
  
  if (absChange > 3) {
    return {
      type: changePercent > 0 ? 'surge' : 'support',
      timestamp: segment[0].timestamp,
      intensity: 'normal',
      soundEffect: changePercent > 0 ? 'ZAP!' : 'THUD!',
      narrative: changePercent > 0 ? 
        'Momentum builds steadily...' : 
        'Support levels hold firm...'
    };
  }
  
  return {
    type: 'resistance',
    timestamp: segment[0].timestamp,
    intensity: 'low',
    soundEffect: '',
    narrative: 'The market consolidates quietly...'
  };
}

function generateNarrative(
  symbol: string, 
  event: MarketEvent, 
  startPrice: number, 
  endPrice: number, 
  timeframe: string
): string {
  const change = endPrice - startPrice;
  const changePercent = ((change / startPrice) * 100);
  
  const timeContext = {
    '1m': 'In mere moments',
    '5m': 'Within minutes', 
    '1h': 'Over the hour',
    '1d': 'Throughout the day',
    '1w': 'Across the week'
  }[timeframe] || 'In this period';
  
  if (Math.abs(changePercent) > 15) {
    return `${timeContext}, ${symbol} ${changePercent > 0 ? 'soared' : 'plummeted'} from $${startPrice.toFixed(2)} to $${endPrice.toFixed(2)}! ${event.narrative}`;
  }
  
  if (Math.abs(changePercent) > 5) {
    return `${symbol} ${changePercent > 0 ? 'climbed' : 'dropped'} to $${endPrice.toFixed(2)} as ${event.narrative.toLowerCase()}`;
  }
  
  return `${symbol} trades at $${endPrice.toFixed(2)}. ${event.narrative}`;
}

function generatePricePath(segment: PricePoint[]): string {
  if (segment.length < 2) return "";
  
  const points = segment.map((point, index) => {
    const x = 30 + (index * (240 / (segment.length - 1)));
    const y = scalePrice(point.price, segment);
    return `${x},${y}`;
  });
  
  return `M ${points.join(' L ')}`;
}

function scalePrice(price: number, segment: PricePoint[]): number {
  const prices = segment.map(p => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  
  return 170 - ((price - min) / range) * 140; // Scale to fit in 170px height with 30px padding
}

export default SequentialArtChart;