import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ComicPanel } from "./comic-panel";
import { ComicSoundEffect } from "./comic-sound-effect";
import { CaptionBox } from "./caption-box";
import { ComicPageLayout } from "./comic-page-layout";
import { SpeechBubble } from "./speech-bubble";

const marketStoryboardVariants = cva(
  "market-storyboard relative",
  {
    variants: {
      theme: {
        classic: "bg-paper border-4 border-black shadow-2xl",
        modern: "bg-white border border-slate-300 shadow-xl rounded-lg",
        noir: "bg-slate-900 text-white border-2 border-white shadow-2xl",
        vintage: "bg-sepia-50 border-4 border-amber-800 shadow-2xl",
      },
      layout: {
        "3-act": "grid-cols-3 grid-rows-2",
        "hero-journey": "grid-cols-4 grid-rows-2", 
        "newspaper": "grid-cols-4 grid-rows-3",
        "magazine": "grid-cols-3 grid-rows-3",
        "splash": "grid-cols-2 grid-rows-3",
      },
      storytelling: {
        linear: "gap-4",
        dramatic: "gap-2",
        epic: "gap-6",
        urgent: "gap-1",
      },
    },
    defaultVariants: {
      theme: "classic",
      layout: "3-act",
      storytelling: "dramatic",
    },
  }
);

export interface MarketEvent {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  impact: "low" | "medium" | "high" | "critical";
  sentiment: "bullish" | "bearish" | "neutral" | "volatile";
  characters: string[]; // Asset symbols involved
  newsSource?: string;
  priceImpact?: number;
  volumeSpike?: number;
  marketCap?: number;
  soundEffect?: string;
}

export interface StoryBeat {
  id: string;
  title: string;
  panelType: "setup" | "rising-action" | "climax" | "falling-action" | "resolution";
  events: MarketEvent[];
  narrative: string;
  visualElements: {
    characters: string[];
    setting: string;
    mood: string;
    symbols: string[];
  };
  timeframe: string;
  significance: "minor" | "major" | "legendary";
}

export interface MarketStoryboardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marketStoryboardVariants> {
  storyTitle: string;
  storyBeats: StoryBeat[];
  currentBeat?: number;
  onBeatChange?: (beatIndex: number) => void;
  autoAdvance?: boolean;
  advanceInterval?: number;
  showNarration?: boolean;
  showCharacterDialogue?: boolean;
  house?: string;
}

const MarketStoryboard = React.forwardRef<HTMLDivElement, MarketStoryboardProps>(
  ({ 
    className,
    theme,
    layout,
    storytelling,
    storyTitle,
    storyBeats,
    currentBeat = 0,
    onBeatChange,
    autoAdvance = false,
    advanceInterval = 5000,
    showNarration = true,
    showCharacterDialogue = true,
    house,
    ...props 
  }, ref) => {
    const [activeBeat, setActiveBeat] = React.useState(currentBeat);
    const [soundTriggers, setSoundTriggers] = React.useState<Record<string, boolean>>({});
    const [revealedPanels, setRevealedPanels] = React.useState<Set<string>>(new Set());

    // Auto-advance through story beats
    React.useEffect(() => {
      if (autoAdvance && storyBeats.length > 1) {
        const timer = setInterval(() => {
          setActiveBeat(prev => {
            const next = (prev + 1) % storyBeats.length;
            onBeatChange?.(next);
            return next;
          });
        }, advanceInterval);

        return () => clearInterval(timer);
      }
    }, [autoAdvance, storyBeats.length, advanceInterval, onBeatChange]);

    // Progressive panel reveal for dramatic effect
    React.useEffect(() => {
      const currentStoryBeat = storyBeats[activeBeat];
      if (!currentStoryBeat) return;

      // Clear previous reveals
      setRevealedPanels(new Set());

      // Reveal panels progressively
      currentStoryBeat.events.forEach((event, index) => {
        setTimeout(() => {
          setRevealedPanels(prev => new Set(prev).add(event.id));
          
          // Trigger sound effect
          if (event.soundEffect) {
            setSoundTriggers(prev => ({ ...prev, [event.id]: true }));
            setTimeout(() => {
              setSoundTriggers(prev => ({ ...prev, [event.id]: false }));
            }, 100);
          }
        }, index * 800);
      });
    }, [activeBeat, storyBeats]);

    const getImpactIntensity = (impact: MarketEvent["impact"]) => {
      switch (impact) {
        case "critical": return "extreme";
        case "high": return "high"; 
        case "medium": return "normal";
        default: return "low";
      }
    };

    const getSentimentColors = (sentiment: MarketEvent["sentiment"]) => {
      switch (sentiment) {
        case "bullish": return "bg-green-50 border-green-200 text-green-800";
        case "bearish": return "bg-red-50 border-red-200 text-red-800";
        case "volatile": return "bg-orange-50 border-orange-200 text-orange-800";
        default: return "bg-slate-50 border-slate-200 text-slate-800";
      }
    };

    const getPanelVariant = (panelType: StoryBeat["panelType"]) => {
      switch (panelType) {
        case "climax": return "splash";
        case "rising-action": return "action";
        case "falling-action": return "quiet";
        default: return "default";
      }
    };

    const generateCharacterDialogue = (event: MarketEvent): string => {
      const character = event.characters[0] || "Market";
      
      switch (event.sentiment) {
        case "bullish":
          return `"Time to soar to new heights!" - ${character}`;
        case "bearish":
          return `"The bears are taking control..." - ${character}`;
        case "volatile":
          return `"Wild swings ahead!" - ${character}`;
        default:
          return `"Steady as she goes..." - ${character}`;
      }
    };

    const currentStoryBeat = storyBeats[activeBeat];

    if (!currentStoryBeat) {
      return (
        <div className="p-8 text-center">
          <div className="font-comic-display text-xl">No story beats available</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("market-storyboard-container", className)}
        data-testid={`market-storyboard-${activeBeat}`}
        {...props}
      >
        {/* Story Header */}
        <div className="mb-6 p-4 bg-black text-white rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-comic-display text-2xl font-bold">
                {storyTitle}
              </h2>
              <h3 className="font-comic-narrative text-lg">
                {currentStoryBeat.title}
              </h3>
            </div>
            <div className="text-right">
              <div className="font-comic-display text-sm">
                Beat {activeBeat + 1} of {storyBeats.length}
              </div>
              <div className="text-xs opacity-75">
                {currentStoryBeat.timeframe}
              </div>
            </div>
          </div>
        </div>

        {/* Main Storyboard Grid */}
        <ComicPageLayout
          layout={layout === "3-act" ? "standard" : layout === "hero-journey" ? "widescreen" : "newspaper"}
          gutter={storytelling === "urgent" ? "tight" : storytelling === "epic" ? "wide" : "normal"}
          background={theme === "vintage" ? "aged" : theme === "noir" ? "dark" : "paper"}
          className={cn(marketStoryboardVariants({ theme, layout, storytelling }))}
        >
          {currentStoryBeat.events.map((event, index) => (
            <div key={event.id} className="relative">
              <ComicPanel
                variant={getPanelVariant(currentStoryBeat.panelType)}
                house={house}
                panelNumber={index + 1}
                isActive={revealedPanels.has(event.id)}
                soundEffect={soundTriggers[event.id] ? event.soundEffect : undefined}
                narrativeText={showNarration ? currentStoryBeat.narrative : undefined}
                className={cn(
                  "transition-all duration-1000",
                  revealedPanels.has(event.id) ? "opacity-100 scale-100" : "opacity-0 scale-95",
                  getSentimentColors(event.sentiment)
                )}
                style={{ transitionDelay: `${index * 200}ms` }}
                data-testid={`story-panel-${event.id}`}
              >
                <div className="flex flex-col h-full space-y-3">
                  {/* Event Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-comic-display text-sm font-bold">
                        {event.title}
                      </h4>
                      <p className="font-comic-narrative text-xs text-slate-600">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-xs font-bold",
                      event.impact === "critical" ? "bg-red-600 text-white" :
                      event.impact === "high" ? "bg-orange-500 text-white" :
                      event.impact === "medium" ? "bg-yellow-500 text-black" :
                      "bg-gray-400 text-white"
                    )}>
                      {event.impact.toUpperCase()}
                    </div>
                  </div>

                  {/* Characters/Assets Involved */}
                  <div className="flex flex-wrap gap-1">
                    {event.characters.map(character => (
                      <span 
                        key={character}
                        className="px-2 py-1 bg-black text-white text-xs rounded font-comic-display"
                      >
                        {character}
                      </span>
                    ))}
                  </div>

                  {/* Event Description */}
                  <div className="flex-1">
                    <p className="font-comic-narrative text-sm leading-tight">
                      {event.description}
                    </p>
                  </div>

                  {/* Market Impact Metrics */}
                  {(event.priceImpact || event.volumeSpike) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {event.priceImpact && (
                        <div className="text-center">
                          <div className={cn(
                            "font-bold",
                            event.priceImpact > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {event.priceImpact > 0 ? "+" : ""}{event.priceImpact.toFixed(1)}%
                          </div>
                          <div className="text-slate-500">Price</div>
                        </div>
                      )}
                      {event.volumeSpike && (
                        <div className="text-center">
                          <div className="font-bold text-blue-600">
                            +{event.volumeSpike.toFixed(0)}%
                          </div>
                          <div className="text-slate-500">Volume</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ComicPanel>

              {/* Character Dialogue */}
              {showCharacterDialogue && revealedPanels.has(event.id) && (
                <SpeechBubble
                  variant={event.sentiment === "volatile" ? "shout" : "default"}
                  size="sm"
                  tail="bottom"
                  speaker={event.characters[0] || "Market"}
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10 max-w-48"
                >
                  {generateCharacterDialogue(event)}
                </SpeechBubble>
              )}

              {/* Sound Effects */}
              {soundTriggers[event.id] && event.soundEffect && (
                <ComicSoundEffect
                  sound={event.soundEffect}
                  variant="impact"
                  intensity={getImpactIntensity(event.impact) as any}
                  trigger={true}
                  position="top-right"
                />
              )}
            </div>
          ))}
        </ComicPageLayout>

        {/* Story Navigation */}
        <div className="mt-6 flex items-center justify-between bg-slate-100 p-4 rounded-lg">
          <button
            onClick={() => {
              const prev = Math.max(0, activeBeat - 1);
              setActiveBeat(prev);
              onBeatChange?.(prev);
            }}
            disabled={activeBeat === 0}
            className="font-comic-display px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover-elevate"
            data-testid="story-prev-button"
          >
            ← PREVIOUS BEAT
          </button>

          <div className="flex space-x-2">
            {storyBeats.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveBeat(index);
                  onBeatChange?.(index);
                }}
                className={cn(
                  "w-4 h-4 rounded-full transition-colors",
                  index === activeBeat ? "bg-primary" : "bg-slate-400 hover:bg-slate-300"
                )}
                data-testid={`story-beat-${index}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              const next = Math.min(storyBeats.length - 1, activeBeat + 1);
              setActiveBeat(next);
              onBeatChange?.(next);
            }}
            disabled={activeBeat === storyBeats.length - 1}
            className="font-comic-display px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover-elevate"
            data-testid="story-next-button"
          >
            NEXT BEAT →
          </button>
        </div>

        {/* Story Legend */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-center">
          <div className="font-comic-narrative text-sm text-slate-600">
            <strong>Current Arc:</strong> {currentStoryBeat.panelType.replace("-", " ").toUpperCase()} • 
            <strong> Significance:</strong> {currentStoryBeat.significance.toUpperCase()} • 
            <strong> Events:</strong> {currentStoryBeat.events.length}
          </div>
        </div>
      </div>
    );
  }
);

MarketStoryboard.displayName = "MarketStoryboard";

// Utility function to create story beats from market events
export function createMarketStory(
  events: MarketEvent[],
  storyStructure: "3-act" | "hero-journey" | "five-act" = "3-act"
): StoryBeat[] {
  if (events.length === 0) return [];

  const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  switch (storyStructure) {
    case "3-act": {
      const firstAct = Math.floor(sortedEvents.length * 0.25);
      const secondAct = Math.floor(sortedEvents.length * 0.75);
      
      return [
        {
          id: "setup",
          title: "Market Setup",
          panelType: "setup",
          events: sortedEvents.slice(0, firstAct),
          narrative: "The stage is set, tensions build in the market...",
          visualElements: {
            characters: [...new Set(sortedEvents.slice(0, firstAct).flatMap(e => e.characters))],
            setting: "Market Opening",
            mood: "anticipation",
            symbols: ["📈", "👀", "⏰"]
          },
          timeframe: "Pre-Market & Early Trading",
          significance: "minor"
        },
        {
          id: "confrontation", 
          title: "Market Climax",
          panelType: "climax",
          events: sortedEvents.slice(firstAct, secondAct),
          narrative: "The decisive moment arrives! Major moves unfold...",
          visualElements: {
            characters: [...new Set(sortedEvents.slice(firstAct, secondAct).flatMap(e => e.characters))],
            setting: "Peak Trading Hours",
            mood: "intense",
            symbols: ["⚡", "💥", "🎯"]
          },
          timeframe: "Mid-Day Trading",
          significance: "major"
        },
        {
          id: "resolution",
          title: "Market Resolution", 
          panelType: "resolution",
          events: sortedEvents.slice(secondAct),
          narrative: "The dust settles, outcomes become clear...",
          visualElements: {
            characters: [...new Set(sortedEvents.slice(secondAct).flatMap(e => e.characters))],
            setting: "Market Close",
            mood: "reflective",
            symbols: ["🏁", "📊", "✅"]
          },
          timeframe: "End of Trading Day",
          significance: "major"
        }
      ];
    }
    
    default:
      return [{
        id: "single-act",
        title: "Market Events",
        panelType: "setup",
        events: sortedEvents,
        narrative: "Market events unfold throughout the day...",
        visualElements: {
          characters: [...new Set(sortedEvents.flatMap(e => e.characters))],
          setting: "Trading Day",
          mood: "dynamic",
          symbols: ["📈", "📉", "💹"]
        },
        timeframe: "Full Trading Day",
        significance: "major"
      }];
  }
}

export { MarketStoryboard, marketStoryboardVariants };