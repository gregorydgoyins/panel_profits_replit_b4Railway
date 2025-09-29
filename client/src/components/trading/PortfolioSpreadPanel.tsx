/**
 * PortfolioSpreadPanel - Portfolio view as comic spread with interactive selection
 * Renders portfolio holdings as a multi-panel comic spread with house-themed organization
 */

import { useState, useEffect, useRef } from 'react';
import { ComicPanel } from '@/components/ui/comic-panel';
import { ComicPageLayout } from '@/components/ui/comic-page-layout';
import { SpeechBubble } from '@/components/ui/speech-bubble';
import { CaptionBox } from '@/components/ui/caption-box';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Star,
  Crown,
  Shield,
  Zap,
  Eye,
  BarChart3,
  PieChart,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHouseTheme, type MythologicalHouse } from '@/contexts/HouseThemeContext';
import type { PanelScript } from '@/services/sequentialStoryEngine';

interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  houseFavorite?: boolean;
}

interface PortfolioStats {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  diversificationScore: number;
  cash: number;
}

interface PortfolioSpreadPanelProps {
  panelScript: PanelScript;
  holdings: PortfolioHolding[];
  stats: PortfolioStats;
  className?: string;
  isActive?: boolean;
  onHoldingSelect?: (holding: PortfolioHolding) => void;
  onPanelClick?: () => void;
  selectedHoldingId?: string;
  viewMode?: 'spread' | 'detailed' | 'summary';
  showHouseHighlights?: boolean;
  houseTheme?: MythologicalHouse;
}

interface PanelLayout {
  id: string;
  holding?: PortfolioHolding;
  type: 'summary' | 'holding' | 'stats' | 'spotlight';
  gridArea?: string;
  narrative?: string;
}

export function PortfolioSpreadPanel({
  panelScript,
  holdings,
  stats,
  className,
  isActive = false,
  onHoldingSelect,
  onPanelClick,
  selectedHoldingId,
  viewMode = 'spread',
  showHouseHighlights = true,
  houseTheme
}: PortfolioSpreadPanelProps) {
  const { currentHouse, houseTheme: defaultHouseTheme } = useHouseTheme();
  const activeHouse = houseTheme || currentHouse;
  const [layoutMode, setLayoutMode] = useState<'grid' | 'magazine' | 'newspaper'>('magazine');
  const [hoveredHolding, setHoveredHolding] = useState<string | null>(null);
  const [panelLayouts, setPanelLayouts] = useState<PanelLayout[]>([]);
  const spreadRef = useRef<HTMLDivElement>(null);

  // Generate panel layouts based on holdings
  useEffect(() => {
    const layouts: PanelLayout[] = [];

    // Portfolio summary panel
    layouts.push({
      id: 'portfolio-summary',
      type: 'summary',
      gridArea: '1 / 1 / 2 / 3',
      narrative: `Your legendary ${activeHouse} portfolio stands revealed...`
    });

    // Stats panel
    layouts.push({
      id: 'portfolio-stats',
      type: 'stats',
      gridArea: '1 / 3 / 2 / 4',
      narrative: 'The numbers tell their tale...'
    });

    // Holdings panels (limit to fit layout)
    const maxHoldings = layoutMode === 'magazine' ? 6 : layoutMode === 'newspaper' ? 12 : 9;
    holdings.slice(0, maxHoldings).forEach((holding, index) => {
      const row = Math.floor(index / 3) + 2;
      const col = (index % 3) + 1;
      
      layouts.push({
        id: `holding-${holding.id}`,
        holding,
        type: 'holding',
        gridArea: `${row} / ${col} / ${row + 1} / ${col + 1}`,
        narrative: getHoldingNarrative(holding, activeHouse)
      });
    });

    // Spotlight panel for selected holding
    if (selectedHoldingId) {
      const selectedHolding = holdings.find(h => h.id === selectedHoldingId);
      if (selectedHolding) {
        layouts.push({
          id: 'spotlight',
          holding: selectedHolding,
          type: 'spotlight',
          gridArea: `2 / 1 / 4 / 3`,
          narrative: `Behold the chosen asset of ${activeHouse}!`
        });
      }
    }

    setPanelLayouts(layouts);
  }, [holdings, activeHouse, layoutMode, selectedHoldingId]);

  function getHoldingNarrative(holding: PortfolioHolding, house: MythologicalHouse): string {
    const gainLoss = holding.gainLossPercent > 0 ? 'rises triumphant' : 
                    holding.gainLossPercent < 0 ? 'faces adversity' : 'holds steady';
    
    const houseNarratives = {
      heroes: `${holding.symbol} ${gainLoss} with heroic resolve!`,
      wisdom: `The wise investment in ${holding.symbol} ${gainLoss}...`,
      power: `${holding.symbol} ${gainLoss} through sheer force!`,
      mystery: `${holding.symbol} ${gainLoss} in shadow's embrace...`,
      elements: `${holding.symbol} ${gainLoss} with nature's flow...`,
      time: `Through time's passage, ${holding.symbol} ${gainLoss}...`,
      spirit: `In unity, ${holding.symbol} ${gainLoss} together...`
    };

    return houseNarratives[house];
  }

  function getHousePortfolioMessage(house: MythologicalHouse): string {
    const messages = {
      heroes: 'Your heroic investments stand ready for battle!',
      wisdom: 'Ancient wisdom guides these chosen assets...',
      power: 'Behold the portfolio that dominates all markets!',
      mystery: 'Hidden gems emerge from the portfolio depths...',
      elements: 'Natural forces align in perfect balance...',
      time: 'Time has woven these assets into destiny...',
      spirit: 'United holdings create harmonious strength!'
    };
    return messages[house];
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format percentage
  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Get holding performance color
  function getPerformanceColor(percent: number): string {
    if (percent > 5) return 'text-green-600 border-green-400';
    if (percent > 0) return 'text-green-500 border-green-300';
    if (percent < -5) return 'text-red-600 border-red-400';
    if (percent < 0) return 'text-red-500 border-red-300';
    return 'text-gray-500 border-gray-300';
  }

  // Render individual holding panel
  function renderHoldingPanel(layout: PanelLayout) {
    if (!layout.holding) return null;

    const holding = layout.holding;
    const isSelected = holding.id === selectedHoldingId;
    const isHovered = holding.id === hoveredHolding;
    const isSpotlight = layout.type === 'spotlight';

    return (
      <div
        key={layout.id}
        className={cn(
          "relative cursor-pointer transition-all duration-300",
          getPerformanceColor(holding.gainLossPercent),
          isSelected && "ring-2 ring-primary scale-105",
          isHovered && "scale-102 shadow-lg",
          isSpotlight && "ring-4 ring-gold-400"
        )}
        style={{ gridArea: layout.gridArea }}
        onClick={() => onHoldingSelect?.(holding)}
        onMouseEnter={() => setHoveredHolding(holding.id)}
        onMouseLeave={() => setHoveredHolding(null)}
        data-testid={`holding-panel-${holding.symbol}`}
      >
        <ComicPanel
          variant={isSpotlight ? 'splash' : holding.houseFavorite ? 'action' : 'default'}
          house={activeHouse}
          size={isSpotlight ? 'lg' : 'sm'}
          isActive={isSelected}
          narrativeText={layout.narrative}
          className="h-full"
        >
          {/* House favorite indicator */}
          {holding.houseFavorite && showHouseHighlights && (
            <Crown className="absolute top-1 right-1 h-4 w-4 text-yellow-500 z-20" />
          )}

          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {holding.symbol}
              </Badge>
              {holding.gainLossPercent > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : holding.gainLossPercent < 0 ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : (
                <BarChart3 className="h-3 w-3 text-gray-500" />
              )}
            </div>

            {/* Price and performance */}
            <div className="flex-1 text-center">
              <div className="text-sm font-bold">
                {formatCurrency(holding.currentPrice)}
              </div>
              <div className={cn(
                "text-xs font-medium",
                getPerformanceColor(holding.gainLossPercent)
              )}>
                {formatPercent(holding.gainLossPercent)}
              </div>
              
              {isSpotlight && (
                <div className="mt-2 space-y-1 text-xs">
                  <div>Qty: {holding.quantity}</div>
                  <div>Value: {formatCurrency(holding.currentValue)}</div>
                  <div className={cn(
                    "font-medium",
                    holding.gainLoss > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    P&L: {formatCurrency(holding.gainLoss)}
                  </div>
                </div>
              )}
            </div>

            {/* Type indicator */}
            <div className="text-xs text-muted-foreground capitalize">
              {holding.type}
            </div>
          </div>
        </ComicPanel>
      </div>
    );
  }

  // Render portfolio summary panel
  function renderSummaryPanel(layout: PanelLayout) {
    return (
      <div
        key={layout.id}
        style={{ gridArea: layout.gridArea }}
        className="relative"
        data-testid="portfolio-summary-panel"
      >
        <ComicPanel
          variant="splash"
          house={activeHouse}
          size="lg"
          isActive={isActive}
          narrativeText={layout.narrative}
          className="h-full"
        >
          <div className="h-full flex flex-col justify-center text-center">
            <div className="mb-3">
              <h2 className="text-xl font-bold">Portfolio Overview</h2>
              <div className="text-3xl font-bold mt-2">
                {formatCurrency(stats.totalValue)}
              </div>
              <div className={cn(
                "text-lg font-medium flex items-center justify-center gap-1 mt-1",
                stats.dayChangePercent > 0 ? "text-green-600" : 
                stats.dayChangePercent < 0 ? "text-red-600" : "text-gray-600"
              )}>
                {stats.dayChangePercent > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : stats.dayChangePercent < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                <span>{formatPercent(stats.dayChangePercent)}</span>
                <span className="text-sm">({formatCurrency(stats.dayChange)})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Holdings</div>
                <div className="font-medium">{holdings.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Cash</div>
                <div className="font-medium">{formatCurrency(stats.cash)}</div>
              </div>
            </div>
          </div>

          {/* House portfolio message */}
          <SpeechBubble
            variant="thought"
            size="sm"
            speaker={`${activeHouse} Guardian`}
            className="absolute top-2 right-2 max-w-32 z-20"
            data-testid="house-portfolio-message"
          >
            {getHousePortfolioMessage(activeHouse)}
          </SpeechBubble>
        </ComicPanel>
      </div>
    );
  }

  // Render stats panel
  function renderStatsPanel(layout: PanelLayout) {
    return (
      <div
        key={layout.id}
        style={{ gridArea: layout.gridArea }}
        className="relative"
        data-testid="portfolio-stats-panel"
      >
        <ComicPanel
          variant="default"
          house={activeHouse}
          size="default"
          narrativeText={layout.narrative}
          className="h-full"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total P&L:</span>
                <span className={cn(
                  "font-medium",
                  stats.totalGainLoss > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatCurrency(stats.totalGainLoss)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diversity:</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{stats.diversificationScore.toFixed(1)}</span>
                  <Star className="h-3 w-3 text-yellow-500" />
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Best:</span>
                <span className="font-medium text-green-600">
                  {holdings.length > 0 ? holdings.reduce((prev, current) => 
                    (prev.gainLossPercent > current.gainLossPercent) ? prev : current
                  ).symbol : 'N/A'}
                </span>
              </div>
            </div>

            {/* Layout mode toggle */}
            <div className="flex gap-1 mt-2">
              <Button
                variant={layoutMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutMode('grid')}
                className="flex-1 p-1"
              >
                <Grid3X3 className="h-3 w-3" />
              </Button>
              <Button
                variant={layoutMode === 'magazine' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutMode('magazine')}
                className="flex-1 p-1"
              >
                <PieChart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </ComicPanel>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <ComicPanel
        variant="quiet"
        house={activeHouse}
        size="lg"
        isActive={isActive}
        onPanelClick={onPanelClick}
        className={cn("flex items-center justify-center", className)}
        data-testid="portfolio-empty"
      >
        <div className="text-center text-muted-foreground">
          <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Empty Portfolio</h3>
          <p className="text-sm">
            Begin your {activeHouse} trading journey by acquiring your first assets!
          </p>
        </div>
      </ComicPanel>
    );
  }

  return (
    <div
      ref={spreadRef}
      className={cn("w-full", className)}
      data-testid="portfolio-spread-panel"
    >
      <ComicPageLayout
        layout={layoutMode}
        gutter="normal"
        background="paper"
        className="min-h-96"
        onPanelClick={onPanelClick}
      >
        <div className={cn(
          layoutMode === 'magazine' ? "grid grid-cols-3 grid-rows-4 gap-2" :
          layoutMode === 'newspaper' ? "grid grid-cols-4 grid-rows-4 gap-1" :
          "grid grid-cols-3 grid-rows-3 gap-2",
          "h-full"
        )}>
          {panelLayouts.map(layout => {
            switch (layout.type) {
              case 'summary':
                return renderSummaryPanel(layout);
              case 'stats':
                return renderStatsPanel(layout);
              case 'holding':
              case 'spotlight':
                return renderHoldingPanel(layout);
              default:
                return null;
            }
          })}
        </div>
      </ComicPageLayout>

      {/* Portfolio performance caption */}
      <CaptionBox
        variant="narrative"
        position="relative"
        narrator={`House of ${activeHouse}`}
        className="mt-4"
        data-testid="portfolio-performance-caption"
      >
        Your portfolio reflects the {stats.totalGainLoss > 0 ? 'rising power' : 'enduring strength'} of {activeHouse}. 
        {stats.diversificationScore > 7 ? ' Excellent diversification shows wisdom.' : ' Consider broadening your holdings.'}
      </CaptionBox>
    </div>
  );
}

export default PortfolioSpreadPanel;