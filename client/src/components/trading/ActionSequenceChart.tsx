import React, { useState, useEffect } from 'react';
import { ComicPanelShape, PanelShapePresets } from '@/components/ui/comic-panel-shapes';
import { ComicGrid } from '@/components/ui/comic-grid';
import { ComicSoundEffect, useComicSoundEffect } from '@/components/ui/comic-sound-effect';
import { SpeedLinesTransition } from '@/components/ui/comic-transitions';
import { CaptionBox } from '@/components/ui/caption-box';
import { cn } from '@/lib/utils';

interface ActionFrame {
  id: string;
  type: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  title: string;
  description: string;
  priceAction: {
    from: number;
    to: number;
    changePercent: number;
    timeframe: string;
  };
  visualStyle: {
    shape: 'rectangular' | 'circular' | 'star' | 'explosion' | 'diamond';
    effect: 'none' | 'glow' | 'shake' | 'float' | 'speed';
    intensity: 'low' | 'normal' | 'high' | 'extreme';
  };
  soundEffect?: string;
  duration: number; // in milliseconds
}

interface ActionSequenceChartProps {
  symbol: string;
  sequence: ActionFrame[];
  autoPlay?: boolean;
  onSequenceComplete?: () => void;
  className?: string;
}

export function ActionSequenceChart({
  symbol,
  sequence,
  autoPlay = false,
  onSequenceComplete,
  className
}: ActionSequenceChartProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedFrames, setCompletedFrames] = useState<Set<number>>(new Set());
  const { triggers, triggerEffect } = useComicSoundEffect();

  // Auto-play sequence
  useEffect(() => {
    if (!isPlaying || sequence.length === 0) return;

    const frame = sequence[currentFrame];
    const timer = setTimeout(() => {
      // Trigger sound effect
      if (frame.soundEffect) {
        triggerEffect(`frame-${currentFrame}`);
      }

      // Mark frame as completed
      setCompletedFrames(prev => new Set(prev).add(currentFrame));

      // Advance to next frame
      const nextFrame = currentFrame + 1;
      if (nextFrame >= sequence.length) {
        setIsPlaying(false);
        onSequenceComplete?.();
      } else {
        setCurrentFrame(nextFrame);
      }
    }, frame.duration);

    return () => clearTimeout(timer);
  }, [currentFrame, isPlaying, sequence, triggerEffect, onSequenceComplete]);

  // Reset sequence
  const resetSequence = () => {
    setCurrentFrame(0);
    setCompletedFrames(new Set());
    setIsPlaying(false);
  };

  if (sequence.length === 0) {
    return (
      <div className={cn("action-sequence-chart flex items-center justify-center h-64", className)}>
        <CaptionBox variant="narrative">
          <span className="font-comic-narrative">No action sequence available...</span>
        </CaptionBox>
      </div>
    );
  }

  const activeFrame = sequence[currentFrame];

  return (
    <div className={cn("action-sequence-chart", className)}>
      {/* Sequence Title */}
      <div className="mb-4 text-center">
        <h3 className="font-comic-display text-xl font-bold">
          {symbol} ACTION SEQUENCE
        </h3>
        <div className="font-comic-narrative text-sm text-gray-600">
          Episode {currentFrame + 1} of {sequence.length}: {activeFrame.title}
        </div>
      </div>

      {/* Main Action Panel */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <SpeedLinesTransition
            trigger={activeFrame.visualStyle.effect === 'speed'}
            direction="right"
            intensity={activeFrame.visualStyle.intensity}
          >
            <ComicPanelShape
              shape={activeFrame.visualStyle.shape}
              size="xl"
              effect={activeFrame.visualStyle.effect}
              borderColor={getFrameColor(activeFrame.type)}
              className="relative"
              data-testid={`action-frame-${currentFrame}`}
            >
              <div className="text-center space-y-4">
                {/* Frame Type Indicator */}
                <div className={cn(
                  "font-comic-display text-sm px-3 py-1 rounded",
                  getFrameTypeStyle(activeFrame.type)
                )}>
                  {activeFrame.type.replace('_', ' ').toUpperCase()}
                </div>

                {/* Price Action Display */}
                <PriceActionDisplay priceAction={activeFrame.priceAction} />

                {/* Frame Description */}
                <div className="font-comic-narrative text-sm max-w-xs mx-auto">
                  {activeFrame.description}
                </div>
              </div>

              {/* Sound Effect */}
              {activeFrame.soundEffect && (
                <ComicSoundEffect
                  sound={activeFrame.soundEffect}
                  variant="impact"
                  intensity={activeFrame.visualStyle.intensity}
                  trigger={triggers[`frame-${currentFrame}`]}
                  position="top-right"
                />
              )}
            </ComicPanelShape>
          </SpeedLinesTransition>

          {/* Frame Progress Indicator */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 border-black transition-all",
              completedFrames.has(currentFrame) 
                ? "bg-green-500" 
                : isPlaying 
                  ? "bg-yellow-400 animate-pulse" 
                  : "bg-white"
            )} />
          </div>
        </div>
      </div>

      {/* Sequence Timeline */}
      <div className="mb-4">
        <ComicGrid layout="responsive" spacing="tight" className="max-w-4xl mx-auto">
          {sequence.map((frame, index) => (
            <ComicPanelShape
              key={frame.id}
              shape="rectangular"
              size="sm"
              className={cn(
                "cursor-pointer transition-all",
                index === currentFrame ? "ring-2 ring-blue-500 scale-105" : "",
                completedFrames.has(index) ? "opacity-100" : "opacity-60"
              )}
              onClick={() => setCurrentFrame(index)}
              data-testid={`timeline-frame-${index}`}
            >
              <div className="text-center space-y-1">
                <div className="font-comic-display text-xs">
                  {frame.type.split('_').map(word => word[0]).join('')}
                </div>
                <div className="text-xs">
                  {frame.priceAction.changePercent > 0 ? '+' : ''}
                  {frame.priceAction.changePercent.toFixed(1)}%
                </div>
                <div className="w-full h-1 bg-gray-200 rounded">
                  <div 
                    className={cn(
                      "h-full rounded transition-all duration-500",
                      completedFrames.has(index) ? "bg-green-500" : "bg-transparent"
                    )}
                    style={{ 
                      width: index <= currentFrame ? '100%' : '0%' 
                    }}
                  />
                </div>
              </div>
            </ComicPanelShape>
          ))}
        </ComicGrid>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={completedFrames.size === sequence.length}
          className={cn(
            "font-comic-display px-6 py-2 rounded border-2 transition-colors",
            isPlaying 
              ? "bg-red-600 text-white border-red-800 hover:bg-red-700" 
              : "bg-green-600 text-white border-green-800 hover:bg-green-700",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          data-testid="sequence-play-toggle"
        >
          {isPlaying ? 'PAUSE' : completedFrames.size === sequence.length ? 'COMPLETE' : 'PLAY'}
        </button>

        <button
          onClick={resetSequence}
          className="font-comic-display px-4 py-2 bg-gray-600 text-white border-2 border-gray-800 rounded hover:bg-gray-700 transition-colors"
          data-testid="sequence-reset"
        >
          RESET
        </button>

        <div className="font-comic-narrative text-sm text-gray-600">
          {completedFrames.size} of {sequence.length} complete
        </div>
      </div>

      {/* Sequence Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <SequenceStatCard
          label="Total Change"
          value={`${calculateTotalChange(sequence)}%`}
          icon="📊"
        />
        <SequenceStatCard
          label="Duration"
          value={formatDuration(sequence.reduce((sum, f) => sum + f.duration, 0))}
          icon="⏱️"
        />
        <SequenceStatCard
          label="Frames"
          value={sequence.length}
          icon="🎬"
        />
        <SequenceStatCard
          label="Intensity"
          value={getSequenceIntensity(sequence)}
          icon="⚡"
        />
      </div>
    </div>
  );
}

// Helper Components
function PriceActionDisplay({ priceAction }: { priceAction: ActionFrame['priceAction'] }) {
  const isPositive = priceAction.changePercent > 0;
  const intensity = Math.abs(priceAction.changePercent);

  return (
    <div className="space-y-2">
      <div className={cn(
        "font-comic-display text-lg font-bold",
        isPositive ? "text-green-600" : "text-red-600"
      )}>
        ${priceAction.from.toFixed(2)} → ${priceAction.to.toFixed(2)}
      </div>
      
      <div className={cn(
        "font-comic-action text-base",
        isPositive ? "text-green-500" : "text-red-500",
        intensity > 10 && "animate-pulse"
      )}>
        {priceAction.changePercent > 0 ? '+' : ''}
        {priceAction.changePercent.toFixed(1)}%
      </div>
      
      <div className="font-comic-narrative text-xs text-gray-600">
        {priceAction.timeframe}
      </div>
    </div>
  );
}

function SequenceStatCard({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string | number; 
  icon: string; 
}) {
  return (
    <div className="bg-white border-2 border-black rounded p-3 text-center hover-elevate">
      <div className="text-xl mb-1">{icon}</div>
      <div className="font-comic-display text-sm font-bold">{value}</div>
      <div className="font-comic-narrative text-xs text-gray-600">{label}</div>
    </div>
  );
}

// Utility Functions
function getFrameColor(type: ActionFrame['type']): string {
  const colorMap = {
    setup: 'blue-500',
    rising_action: 'yellow-500',
    climax: 'red-500',
    falling_action: 'orange-500',
    resolution: 'green-500'
  };
  return colorMap[type];
}

function getFrameTypeStyle(type: ActionFrame['type']): string {
  const styleMap = {
    setup: 'bg-blue-500 text-white',
    rising_action: 'bg-yellow-500 text-black',
    climax: 'bg-red-500 text-white',
    falling_action: 'bg-orange-500 text-white',
    resolution: 'bg-green-500 text-white'
  };
  return styleMap[type];
}

function calculateTotalChange(sequence: ActionFrame[]): number {
  if (sequence.length === 0) return 0;
  
  const first = sequence[0].priceAction.from;
  const last = sequence[sequence.length - 1].priceAction.to;
  return ((last - first) / first) * 100;
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function getSequenceIntensity(sequence: ActionFrame[]): string {
  const avgIntensity = sequence.reduce((sum, frame) => {
    const intensityScore = {
      low: 1,
      normal: 2,
      high: 3,
      extreme: 4
    }[frame.visualStyle.intensity];
    return sum + intensityScore;
  }, 0) / sequence.length;

  if (avgIntensity >= 3.5) return 'EXTREME';
  if (avgIntensity >= 2.5) return 'HIGH';
  if (avgIntensity >= 1.5) return 'NORMAL';
  return 'LOW';
}

// Preset Action Sequences
export const ActionSequencePresets = {
  breakout: [
    {
      id: 'setup',
      type: 'setup' as const,
      title: 'Consolidation',
      description: 'Price consolidates near resistance...',
      priceAction: { from: 100, to: 102, changePercent: 2, timeframe: '1h' },
      visualStyle: { shape: 'rectangular' as const, effect: 'none' as const, intensity: 'low' as const },
      duration: 2000
    },
    {
      id: 'rising',
      type: 'rising_action' as const,
      title: 'Building Pressure',
      description: 'Volume increases as buyers step in...',
      priceAction: { from: 102, to: 108, changePercent: 5.9, timeframe: '15m' },
      visualStyle: { shape: 'diamond' as const, effect: 'glow' as const, intensity: 'normal' as const },
      soundEffect: 'ZAP!',
      duration: 3000
    },
    {
      id: 'climax',
      type: 'climax' as const,
      title: 'BREAKOUT!',
      description: 'Resistance shattered! Bulls charge!',
      priceAction: { from: 108, to: 125, changePercent: 15.7, timeframe: '5m' },
      visualStyle: { shape: 'explosion' as const, effect: 'speed' as const, intensity: 'extreme' as const },
      soundEffect: 'BOOM!',
      duration: 4000
    },
    {
      id: 'resolution',
      type: 'resolution' as const,
      title: 'New Level',
      description: 'Price stabilizes at higher levels.',
      priceAction: { from: 125, to: 122, changePercent: -2.4, timeframe: '30m' },
      visualStyle: { shape: 'circular' as const, effect: 'float' as const, intensity: 'low' as const },
      duration: 3000
    }
  ]
};

export default ActionSequenceChart;