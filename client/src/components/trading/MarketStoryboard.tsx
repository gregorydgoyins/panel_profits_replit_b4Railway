import React, { useState, useEffect } from 'react';
import { ComicPageLayout, LayoutTemplates } from '@/components/ui/comic-page-layout';
import { ComicPanel } from '@/components/ui/comic-panel';
import { ComicSoundEffect } from '@/components/ui/comic-sound-effect';
import { CaptionBox, NarrativeCaptionBox, TimeCaptionBox } from '@/components/ui/caption-box';
import { PanelSequenceTransition } from '@/components/ui/comic-transitions';
import { cn } from '@/lib/utils';

interface MarketMoment {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  priceChange: number;
  volume: number;
  significance: 'minor' | 'moderate' | 'major' | 'historic';
  category: 'earnings' | 'news' | 'technical' | 'sentiment' | 'external';
  soundEffect?: string;
  visualStyle?: 'normal' | 'dramatic' | 'explosive' | 'quiet';
}

interface MarketStoryboardProps {
  symbol: string;
  moments: MarketMoment[];
  autoAdvance?: boolean;
  showTimestamps?: boolean;
  className?: string;
}

export function MarketStoryboard({
  symbol,
  moments,
  autoAdvance = false,
  showTimestamps = true,
  className
}: MarketStoryboardProps) {
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoAdvance);
  const [storyMode, setStoryMode] = useState<'timeline' | 'highlights' | 'dramatic'>('timeline');

  // Filter and sort moments based on story mode
  const processedMoments = React.useMemo(() => {
    let filtered = [...moments];

    switch (storyMode) {
      case 'highlights':
        filtered = moments.filter(m => ['major', 'historic'].includes(m.significance));
        break;
      case 'dramatic':
        filtered = moments.filter(m => Math.abs(m.priceChange) > 5);
        break;
      default:
        // timeline shows all moments
        break;
    }

    return filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [moments, storyMode]);

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying || processedMoments.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMomentIndex(prev => (prev + 1) % processedMoments.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, processedMoments.length]);

  if (processedMoments.length === 0) {
    return (
      <div className={cn("market-storyboard flex items-center justify-center h-64", className)}>
        <CaptionBox variant="narrative">
          <span className="font-comic-narrative">No market story to tell yet...</span>
        </CaptionBox>
      </div>
    );
  }

  const currentMoment = processedMoments[currentMomentIndex];

  return (
    <div className={cn("market-storyboard", className)}>
      {/* Story Mode Selector */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-2">
          {(['timeline', 'highlights', 'dramatic'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStoryMode(mode)}
              className={cn(
                "font-comic-display text-xs px-3 py-1 rounded border-2 border-black transition-colors",
                storyMode === mode 
                  ? "bg-black text-white" 
                  : "bg-white text-black hover:bg-gray-100"
              )}
              data-testid={`story-mode-${mode}`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="font-comic-display text-xs bg-red-600 text-white px-3 py-1 rounded hover-elevate"
            data-testid="auto-advance-toggle"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
        </div>
      </div>

      {/* Main Storyboard Panel */}
      <ComicPanel
        variant={getStoryVariant(currentMoment)}
        size={currentMoment.significance === 'historic' ? 'splash' : 'lg'}
        soundEffect={currentMoment.soundEffect}
        className="mb-6"
      >
        <div className="h-full flex flex-col">
          {/* Moment Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-comic-display text-lg font-bold">
                {currentMoment.title}
              </h3>
              <div className="font-comic-narrative text-sm opacity-75">
                {symbol} • {formatSignificance(currentMoment.significance)}
              </div>
            </div>

            {showTimestamps && (
              <TimeCaptionBox
                timestamp={currentMoment.timestamp}
                position="relative"
                size="sm"
              />
            )}
          </div>

          {/* Price Impact Visualization */}
          <div className="flex-1 flex items-center justify-center my-4">
            <PriceImpactVisualization moment={currentMoment} />
          </div>

          {/* Moment Description */}
          <NarrativeCaptionBox position="relative" className="mt-auto">
            <div className="font-comic-narrative text-sm">
              {currentMoment.description}
            </div>
          </NarrativeCaptionBox>
        </div>

        {/* Sound Effect */}
        {currentMoment.soundEffect && (
          <ComicSoundEffect
            sound={currentMoment.soundEffect}
            variant="impact"
            intensity={getIntensityFromSignificance(currentMoment.significance)}
            trigger={true}
            position="top-right"
          />
        )}
      </ComicPanel>

      {/* Story Timeline */}
      <div className="story-timeline">
        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
          {processedMoments.map((moment, index) => (
            <div
              key={moment.id}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all",
                index === currentMomentIndex ? "scale-110" : "scale-100 opacity-75"
              )}
              onClick={() => setCurrentMomentIndex(index)}
            >
              <ComicPanel
                size="sm"
                variant={index === currentMomentIndex ? 'action' : 'quiet'}
                className="w-24 h-24"
                data-testid={`timeline-moment-${index}`}
              >
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MomentIcon moment={moment} />
                  <div className="font-comic-display text-xs mt-1">
                    {moment.priceChange > 0 ? '+' : ''}{moment.priceChange.toFixed(1)}%
                  </div>
                  <div className="font-comic-narrative text-xs opacity-75">
                    {moment.timestamp.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </ComicPanel>
            </div>
          ))}
        </div>
      </div>

      {/* Story Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StoryStatCard
          label="Total Moments"
          value={processedMoments.length}
          icon="📊"
        />
        <StoryStatCard
          label="Major Events"
          value={moments.filter(m => ['major', 'historic'].includes(m.significance)).length}
          icon="⚡"
        />
        <StoryStatCard
          label="Avg Change"
          value={`${(moments.reduce((sum, m) => sum + Math.abs(m.priceChange), 0) / moments.length).toFixed(1)}%`}
          icon="📈"
        />
        <StoryStatCard
          label="Timespan"
          value={getTimespan(moments)}
          icon="⏰"
        />
      </div>
    </div>
  );
}

// Helper Components
function PriceImpactVisualization({ moment }: { moment: MarketMoment }) {
  const isPositive = moment.priceChange > 0;
  const intensity = Math.abs(moment.priceChange);
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Impact Circle */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-4 transition-all duration-1000",
          isPositive ? "border-green-500" : "border-red-500",
          intensity > 10 && "animate-ping",
          getImpactSize(intensity)
        )}
      />
      
      {/* Price Change */}
      <div className={cn(
        "font-comic-display text-2xl font-bold z-10",
        isPositive ? "text-green-600" : "text-red-600"
      )}>
        {moment.priceChange > 0 ? '+' : ''}{moment.priceChange.toFixed(1)}%
      </div>

      {/* Volume Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="font-comic-narrative text-xs text-gray-600">
          Vol: {formatVolume(moment.volume)}
        </div>
      </div>
    </div>
  );
}

function MomentIcon({ moment }: { moment: MarketMoment }) {
  const iconMap = {
    earnings: '💼',
    news: '📰',
    technical: '📊',
    sentiment: '🎭',
    external: '🌍'
  };

  const baseIcon = iconMap[moment.category] || '📈';
  
  if (moment.significance === 'historic') {
    return <span className="text-lg animate-pulse">🏆</span>;
  }
  
  if (Math.abs(moment.priceChange) > 10) {
    return <span className="text-lg animate-bounce">{moment.priceChange > 0 ? '🚀' : '💥'}</span>;
  }
  
  return <span className="text-sm">{baseIcon}</span>;
}

function StoryStatCard({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string | number; 
  icon: string; 
}) {
  return (
    <div className="bg-white border-2 border-black rounded p-3 hover-elevate">
      <div className="flex items-center space-x-2">
        <span className="text-lg">{icon}</span>
        <div>
          <div className="font-comic-display text-sm font-bold">{value}</div>
          <div className="font-comic-narrative text-xs text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Utility Functions
function getStoryVariant(moment: MarketMoment) {
  switch (moment.visualStyle) {
    case 'dramatic': return 'action';
    case 'explosive': return 'splash';
    case 'quiet': return 'quiet';
    default: return 'default';
  }
}

function formatSignificance(significance: string): string {
  return {
    minor: 'Minor Move',
    moderate: 'Notable Event',
    major: 'Major Event',
    historic: 'Historic Moment'
  }[significance] || significance;
}

function getIntensityFromSignificance(significance: string): 'low' | 'normal' | 'high' | 'extreme' {
  return {
    minor: 'low',
    moderate: 'normal', 
    major: 'high',
    historic: 'extreme'
  }[significance] as 'low' | 'normal' | 'high' | 'extreme' || 'normal';
}

function getImpactSize(changePercent: number): string {
  if (changePercent > 15) return "scale-150";
  if (changePercent > 10) return "scale-125";
  if (changePercent > 5) return "scale-110";
  return "scale-100";
}

function formatVolume(volume: number): string {
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toString();
}

function getTimespan(moments: MarketMoment[]): string {
  if (moments.length < 2) return '1 day';
  
  const timestamps = moments.map(m => m.timestamp.getTime());
  const span = Math.max(...timestamps) - Math.min(...timestamps);
  const days = Math.ceil(span / (1000 * 60 * 60 * 24));
  
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.ceil(days / 7)} weeks`;
  return `${Math.ceil(days / 30)} months`;
}

export default MarketStoryboard;