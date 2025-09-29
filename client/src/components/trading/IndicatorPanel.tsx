/**
 * IndicatorPanel - Technical analysis expressed via speech bubbles/caption boxes
 * Renders technical indicators as comic narratives with house-themed mystical analysis
 */

import { useState, useEffect, useRef } from 'react';
import { ComicPanel } from '@/components/ui/comic-panel';
import { SpeechBubble } from '@/components/ui/speech-bubble';
import { CaptionBox } from '@/components/ui/caption-box';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Zap, 
  Eye, 
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHouseTheme, type MythologicalHouse } from '@/contexts/HouseThemeContext';
import type { PanelScript } from '@/services/sequentialStoryEngine';

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: 'weak' | 'moderate' | 'strong' | 'extreme';
  interpretation: string;
}

interface IndicatorPanelProps {
  panelScript: PanelScript;
  indicators: TechnicalIndicator[];
  className?: string;
  isActive?: boolean;
  onPanelClick?: () => void;
  showMysticalAnalysis?: boolean;
  analysisMode?: 'basic' | 'advanced' | 'mystical';
  houseTheme?: MythologicalHouse;
}

interface IndicatorVisualization {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  bollinger: { position: 'upper' | 'middle' | 'lower'; strength: number };
  volume: { trend: 'increasing' | 'decreasing' | 'stable'; ratio: number };
  momentum: 'acceleration' | 'deceleration' | 'stable';
}

export function IndicatorPanel({
  panelScript,
  indicators,
  className,
  isActive = false,
  onPanelClick,
  showMysticalAnalysis = true,
  analysisMode = 'mystical',
  houseTheme
}: IndicatorPanelProps) {
  const { currentHouse, houseTheme: defaultHouseTheme } = useHouseTheme();
  const activeHouse = houseTheme || currentHouse;
  const [activeIndicatorIndex, setActiveIndicatorIndex] = useState(0);
  const [mysticalInsight, setMysticalInsight] = useState<string>('');
  const [indicatorGlow, setIndicatorGlow] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cycle through indicators
  useEffect(() => {
    if (indicators.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndicatorIndex(prev => (prev + 1) % indicators.length);
      setIndicatorGlow(true);
      setTimeout(() => setIndicatorGlow(false), 800);
    }, 4000);

    return () => clearInterval(timer);
  }, [indicators.length]);

  // Generate mystical analysis based on house theme
  useEffect(() => {
    if (!showMysticalAnalysis || indicators.length === 0) return;

    const activeIndicator = indicators[activeIndicatorIndex];
    const insight = generateMysticalInsight(activeIndicator, activeHouse);
    setMysticalInsight(insight);
  }, [activeIndicatorIndex, indicators, activeHouse, showMysticalAnalysis]);

  function generateMysticalInsight(indicator: TechnicalIndicator, house: MythologicalHouse): string {
    const insights = {
      heroes: {
        bullish: `The heroic ${indicator.name} charges forth with ${indicator.strength} conviction!`,
        bearish: `The villainous forces pressure ${indicator.name}, but heroes persevere!`,
        neutral: `The ${indicator.name} awaits the call to action, poised for battle!`
      },
      wisdom: {
        bullish: `Ancient scrolls reveal ${indicator.name} ascending with scholarly precision...`,
        bearish: `The wise ${indicator.name} teaches patience through temporary decline...`,
        neutral: `The oracle ${indicator.name} contemplates the market's deeper mysteries...`
      },
      power: {
        bullish: `Behold! The mighty ${indicator.name} dominates with ${indicator.strength} force!`,
        bearish: `The ${indicator.name} faces resistance, but power builds beneath!`,
        neutral: `The ${indicator.name} gathers strength, preparing to unleash its might!`
      },
      mystery: {
        bullish: `From the shadows, ${indicator.name} emerges with hidden ${indicator.strength}...`,
        bearish: `The enigmatic ${indicator.name} conceals its true intentions...`,
        neutral: `The mysterious ${indicator.name} whispers secrets only initiates understand...`
      },
      elements: {
        bullish: `The elemental ${indicator.name} flows with natural ${indicator.strength}!`,
        bearish: `Turbulent forces challenge ${indicator.name}, yet nature finds balance...`,
        neutral: `The ${indicator.name} element rests, gathering energy from the earth...`
      },
      time: {
        bullish: `Through temporal currents, ${indicator.name} accelerates with ${indicator.strength}!`,
        bearish: `Time's wheel turns, ${indicator.name} cycles through necessary correction...`,
        neutral: `The chronometer ${indicator.name} marks this moment of potential...`
      },
      spirit: {
        bullish: `United energies lift ${indicator.name} with collective ${indicator.strength}!`,
        bearish: `The ${indicator.name} spirit endures trials, strengthening bonds...`,
        neutral: `Harmonious ${indicator.name} seeks balance in the cosmic dance...`
      }
    };

    return insights[house]?.[indicator.signal] || insights.heroes[indicator.signal];
  }

  // Get indicator-specific icon
  function getIndicatorIcon(indicatorName: string) {
    const iconMap: Record<string, any> = {
      'RSI': Brain,
      'MACD': BarChart3,
      'Bollinger': Target,
      'Volume': Zap,
      'Momentum': Eye,
      'default': BarChart3
    };

    const IconComponent = iconMap[indicatorName] || iconMap.default;
    return <IconComponent className="h-4 w-4" />;
  }

  // Get signal color and intensity
  function getSignalVisualization(indicator: TechnicalIndicator) {
    const colors = {
      bullish: {
        weak: 'text-green-400 border-green-400',
        moderate: 'text-green-500 border-green-500',
        strong: 'text-green-600 border-green-600',
        extreme: 'text-green-700 border-green-700 animate-pulse'
      },
      bearish: {
        weak: 'text-red-400 border-red-400',
        moderate: 'text-red-500 border-red-500',
        strong: 'text-red-600 border-red-600',
        extreme: 'text-red-700 border-red-700 animate-pulse'
      },
      neutral: {
        weak: 'text-gray-400 border-gray-400',
        moderate: 'text-gray-500 border-gray-500',
        strong: 'text-gray-600 border-gray-600',
        extreme: 'text-gray-700 border-gray-700'
      }
    };

    return colors[indicator.signal][indicator.strength];
  }

  // Get house-themed analysis wisdom
  function getHouseAnalysisPhrase(house: MythologicalHouse): string {
    const phrases = {
      heroes: 'Justice guides our technical analysis!',
      wisdom: 'Ancient patterns reveal market truths...',
      power: 'Dominate through superior indicators!',
      mystery: 'Hidden signals emerge from the depths...',
      elements: 'Natural forces shape market flows...',
      time: 'Temporal analysis transcends the moment...',
      spirit: 'Collective wisdom illuminates the path!'
    };

    return phrases[house];
  }

  if (indicators.length === 0) {
    return (
      <ComicPanel
        variant="quiet"
        house={activeHouse}
        size="default"
        isActive={isActive}
        onPanelClick={onPanelClick}
        className={cn("flex items-center justify-center", className)}
        data-testid="indicator-panel-empty"
      >
        <div className="text-center text-muted-foreground">
          <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No technical indicators available</p>
        </div>
      </ComicPanel>
    );
  }

  const activeIndicator = indicators[activeIndicatorIndex];

  return (
    <ComicPanel
      ref={panelRef}
      variant="default"
      house={activeHouse}
      size="default"
      isActive={isActive}
      onPanelClick={onPanelClick}
      narrativeText={panelScript.narrativeBeats[0]?.text}
      className={cn(
        "relative overflow-hidden",
        indicatorGlow && "ring-2 ring-primary/50 shadow-lg",
        className
      )}
      data-testid="indicator-panel"
    >
      {/* Mystical Analysis Background Effect */}
      {showMysticalAnalysis && (
        <div className={cn(
          "absolute inset-0 pointer-events-none transition-all duration-1000",
          activeHouse === 'wisdom' ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10" :
          activeHouse === 'mystery' ? "bg-gradient-to-br from-green-500/10 to-gray-500/10" :
          activeHouse === 'time' ? "bg-gradient-to-br from-yellow-500/10 to-cyan-500/10" :
          "bg-gradient-to-br from-primary/5 to-secondary/5"
        )} />
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Indicator Navigation */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Technical Analysis
            </Badge>
            {getIndicatorIcon(activeIndicator.name)}
          </div>
          
          {/* Indicator dots */}
          <div className="flex gap-1">
            {indicators.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === activeIndicatorIndex ? "bg-primary" : "bg-primary/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Active Indicator Display */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-4">
            <h3 className={cn(
              "text-lg font-bold transition-all duration-300",
              getSignalVisualization(activeIndicator)
            )}>
              {activeIndicator.name}
            </h3>
            
            <div className={cn(
              "text-2xl font-mono font-bold mt-1",
              getSignalVisualization(activeIndicator)
            )}>
              {activeIndicator.value.toFixed(2)}
            </div>

            {/* Signal Strength Indicator */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Signal Strength</span>
                <span className="capitalize">{activeIndicator.strength}</span>
              </div>
              <Progress 
                value={
                  activeIndicator.strength === 'weak' ? 25 :
                  activeIndicator.strength === 'moderate' ? 50 :
                  activeIndicator.strength === 'strong' ? 75 : 100
                }
                className="h-2"
              />
            </div>
          </div>

          {/* Signal Badge */}
          <div className="flex justify-center mb-3">
            <Badge 
              variant={activeIndicator.signal === 'bullish' ? 'default' : 'secondary'}
              className={cn(
                "flex items-center gap-1",
                activeIndicator.signal === 'bullish' ? "bg-green-600 text-white" :
                activeIndicator.signal === 'bearish' ? "bg-red-600 text-white" :
                "bg-gray-500 text-white"
              )}
            >
              {activeIndicator.signal === 'bullish' ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>BULLISH</span>
                </>
              ) : activeIndicator.signal === 'bearish' ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>BEARISH</span>
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  <span>NEUTRAL</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Mystical Analysis Speech Bubble */}
        {showMysticalAnalysis && mysticalInsight && (
          <SpeechBubble
            variant="thought"
            size="sm"
            speaker={`${activeHouse} Oracle`}
            className="absolute top-2 right-2 max-w-40 z-20"
            data-testid="mystical-analysis"
          >
            {mysticalInsight}
          </SpeechBubble>
        )}

        {/* Technical Interpretation Caption */}
        {analysisMode === 'advanced' && activeIndicator.interpretation && (
          <CaptionBox
            variant="narrative"
            size="sm"
            position="bottom-center"
            className="z-30"
            data-testid="technical-interpretation"
          >
            {activeIndicator.interpretation}
          </CaptionBox>
        )}

        {/* House Analysis Wisdom */}
        {analysisMode === 'mystical' && (
          <CaptionBox
            variant="future"
            size="sm"
            position="bottom-left"
            narrator={`House of ${activeHouse}`}
            className="z-30"
            data-testid="house-wisdom"
          >
            {getHouseAnalysisPhrase(activeHouse)}
          </CaptionBox>
        )}
      </div>

      {/* Indicator Change Animation */}
      {indicatorGlow && (
        <div className="absolute inset-0 border-2 border-primary/50 rounded-md pointer-events-none animate-pulse" />
      )}
    </ComicPanel>
  );
}

export default IndicatorPanel;