import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ComicPanel } from "./comic-panel";
import { ComicSoundEffect } from "./comic-sound-effect";
import { CaptionBox } from "./caption-box";

const sequentialArtChartVariants = cva(
  "sequential-art-chart font-comic-display",
  {
    variants: {
      style: {
        classic: "bg-paper border-2 border-black shadow-lg",
        modern: "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 shadow-xl",
        vintage: "bg-sepia-50 border-2 border-amber-800 shadow-lg",
        noir: "bg-slate-900 border-2 border-white text-white",
      },
      panelCount: {
        "3": "grid-cols-3",
        "4": "grid-cols-4", 
        "6": "grid-cols-2 grid-rows-3",
        "8": "grid-cols-4 grid-rows-2",
        "9": "grid-cols-3 grid-rows-3",
      },
      timeframe: {
        "1h": "gap-1",
        "4h": "gap-2",
        "1d": "gap-3",
        "1w": "gap-4",
        "1M": "gap-6",
      },
    },
    defaultVariants: {
      style: "classic",
      panelCount: "6",
      timeframe: "1d",
    },
  }
);

interface PriceDataPoint {
  timestamp: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  change?: number;
  percentChange?: number;
}

interface ChartPanel {
  id: string;
  timeRange: string;
  priceData: PriceDataPoint;
  narrative: string;
  soundEffect?: string;
  mood: "bullish" | "bearish" | "neutral" | "volatile";
  significance: "low" | "medium" | "high" | "critical";
}

export interface SequentialArtChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sequentialArtChartVariants> {
  assetSymbol: string;
  assetName: string;
  priceHistory: PriceDataPoint[];
  currentPrice: number;
  onPanelClick?: (panel: ChartPanel) => void;
  showSoundEffects?: boolean;
  animate?: boolean;
  house?: string;
}

const SequentialArtChart = React.forwardRef<HTMLDivElement, SequentialArtChartProps>(
  ({ 
    className,
    style,
    panelCount,
    timeframe,
    assetSymbol,
    assetName,
    priceHistory,
    currentPrice,
    onPanelClick,
    showSoundEffects = true,
    animate = true,
    house,
    ...props 
  }, ref) => {
    const [activePanel, setActivePanel] = React.useState<string | null>(null);
    const [soundTriggers, setSoundTriggers] = React.useState<Record<string, boolean>>({});

    // Convert price history into comic panels
    const createChartPanels = React.useCallback((): ChartPanel[] => {
      if (!priceHistory || priceHistory.length === 0) return [];

      const panelCountNum = parseInt(panelCount || "6");
      const step = Math.max(1, Math.floor(priceHistory.length / panelCountNum));
      const panels: ChartPanel[] = [];

      for (let i = 0; i < panelCountNum && i * step < priceHistory.length; i++) {
        const dataIndex = Math.min(i * step, priceHistory.length - 1);
        const data = priceHistory[dataIndex];
        const prevData = i > 0 ? priceHistory[Math.max(0, (i - 1) * step)] : data;
        
        const change = data.close - prevData.close;
        const percentChange = ((change / prevData.close) * 100);
        
        let mood: ChartPanel["mood"] = "neutral";
        let significance: ChartPanel["significance"] = "low";
        let soundEffect = "";
        let narrative = "";

        // Determine mood and significance
        if (Math.abs(percentChange) > 10) {
          significance = "critical";
          mood = percentChange > 0 ? "bullish" : "bearish";
          soundEffect = percentChange > 0 ? "BOOM!" : "CRASH!";
          narrative = percentChange > 0 
            ? `Massive surge! ${assetSymbol} rockets ${percentChange.toFixed(1)}%!`
            : `Market panic! ${assetSymbol} plummets ${Math.abs(percentChange).toFixed(1)}%!`;
        } else if (Math.abs(percentChange) > 5) {
          significance = "high";
          mood = percentChange > 0 ? "bullish" : "bearish";
          soundEffect = percentChange > 0 ? "POW!" : "WHAM!";
          narrative = percentChange > 0
            ? `Strong rally continues! Up ${percentChange.toFixed(1)}%`
            : `Selling pressure mounts. Down ${Math.abs(percentChange).toFixed(1)}%`;
        } else if (Math.abs(percentChange) > 2) {
          significance = "medium";
          mood = percentChange > 0 ? "bullish" : "bearish";
          soundEffect = percentChange > 0 ? "DING!" : "BZZT!";
          narrative = percentChange > 0
            ? `Steady gains building momentum...`
            : `Gradual decline in progress...`;
        } else {
          mood = "neutral";
          narrative = `Sideways action. Consolidation at $${data.close.toFixed(2)}`;
        }

        panels.push({
          id: `panel-${i}`,
          timeRange: new Date(data.timestamp).toLocaleDateString(),
          priceData: { ...data, change, percentChange },
          narrative,
          soundEffect: showSoundEffects ? soundEffect : undefined,
          mood,
          significance,
        });
      }

      return panels;
    }, [priceHistory, panelCount, assetSymbol, showSoundEffects]);

    const panels = createChartPanels();

    const handlePanelClick = (panel: ChartPanel) => {
      setActivePanel(panel.id);
      onPanelClick?.(panel);

      // Trigger sound effect
      if (panel.soundEffect && showSoundEffects) {
        setSoundTriggers(prev => ({ ...prev, [panel.id]: true }));
        setTimeout(() => {
          setSoundTriggers(prev => ({ ...prev, [panel.id]: false }));
        }, 100);
      }
    };

    const getPanelVariant = (mood: ChartPanel["mood"]) => {
      switch (mood) {
        case "bullish": return "action";
        case "bearish": return "default";
        case "volatile": return "splash";
        default: return "quiet";
      }
    };

    const getMoodColors = (mood: ChartPanel["mood"]) => {
      switch (mood) {
        case "bullish": return "text-green-600 bg-green-50 border-green-200";
        case "bearish": return "text-red-600 bg-red-50 border-red-200";
        case "volatile": return "text-orange-600 bg-orange-50 border-orange-200";
        default: return "text-slate-600 bg-slate-50 border-slate-200";
      }
    };

    return (
      <div
        ref={ref}
        className={cn("sequential-art-chart-container", className)}
        data-testid={`sequential-chart-${assetSymbol}`}
        {...props}
      >
        {/* Chart Header */}
        <div className="mb-4 p-4 bg-black text-white rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-comic-display text-xl font-bold">
                {assetName} ({assetSymbol})
              </h3>
              <p className="font-comic-narrative text-sm opacity-75">
                Price Story Unfolds in Sequential Art
              </p>
            </div>
            <div className="text-right">
              <div className="font-comic-display text-2xl font-bold">
                ${currentPrice.toFixed(2)}
              </div>
              <div className="font-comic-narrative text-xs">
                Current Price
              </div>
            </div>
          </div>
        </div>

        {/* Sequential Art Grid */}
        <div
          className={cn(
            "grid gap-4 p-4",
            sequentialArtChartVariants({ style, panelCount, timeframe })
          )}
        >
          {panels.map((panel, index) => (
            <div key={panel.id} className="relative">
              <ComicPanel
                variant={getPanelVariant(panel.mood)}
                house={house}
                panelNumber={index + 1}
                isActive={activePanel === panel.id}
                soundEffect={soundTriggers[panel.id] ? panel.soundEffect : undefined}
                className={cn(
                  "cursor-pointer transition-transform hover:scale-105",
                  animate && "animate-fade-in-up",
                  getMoodColors(panel.mood)
                )}
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => handlePanelClick(panel)}
                data-testid={`chart-panel-${index}`}
              >
                {/* Price Data Visualization */}
                <div className="flex flex-col h-full">
                  {/* Price Header */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-comic-display text-xs font-bold">
                      {panel.timeRange}
                    </span>
                    <span className={cn(
                      "font-comic-display text-sm font-bold",
                      panel.priceData.change && panel.priceData.change > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {panel.priceData.change && panel.priceData.change > 0 ? "↗" : "↘"}
                      {panel.priceData.percentChange?.toFixed(1)}%
                    </span>
                  </div>

                  {/* Simple Price Bar Visualization */}
                  <div className="flex-1 flex items-end mb-2">
                    <div className="w-full bg-slate-200 rounded">
                      <div 
                        className={cn(
                          "h-8 rounded transition-all duration-1000",
                          panel.mood === "bullish" ? "bg-green-500" : 
                          panel.mood === "bearish" ? "bg-red-500" : "bg-slate-400"
                        )}
                        style={{ 
                          width: `${Math.min(100, Math.max(10, Math.abs(panel.priceData.percentChange || 0) * 10))}%`,
                          animationDelay: `${index * 300}ms`
                        }}
                      />
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="text-center">
                    <div className="font-comic-display text-lg font-bold">
                      ${panel.priceData.close.toFixed(2)}
                    </div>
                    <div className="font-comic-narrative text-xs text-slate-600">
                      H: ${panel.priceData.high.toFixed(2)} L: ${panel.priceData.low.toFixed(2)}
                    </div>
                  </div>
                </div>
              </ComicPanel>

              {/* Narrative Caption */}
              <CaptionBox
                variant="narrative"
                position="bottom-center"
                size="sm"
                className="mt-2"
              >
                {panel.narrative}
              </CaptionBox>

              {/* Sound Effect */}
              {showSoundEffects && soundTriggers[panel.id] && panel.soundEffect && (
                <ComicSoundEffect
                  sound={panel.soundEffect}
                  variant="impact"
                  intensity={panel.significance === "critical" ? "extreme" : "normal"}
                  trigger={true}
                  position="center"
                />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="font-comic-narrative">Bullish</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="font-comic-narrative">Bearish</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="font-comic-narrative">Volatile</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-slate-400 rounded"></div>
              <span className="font-comic-narrative">Neutral</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SequentialArtChart.displayName = "SequentialArtChart";

export { SequentialArtChart, sequentialArtChartVariants };