import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, 
  BarChart3, Activity, X, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PositionsPanelProps {
  refreshTrigger?: number;
}

interface Position {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: number;
}

export function PositionsPanel({ refreshTrigger = 0 }: PositionsPanelProps) {
  const { user } = useAuth();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Fetch user portfolios
  const { data: userPortfolios, isLoading: portfoliosLoading } = useQuery({
    queryKey: [`/api/portfolios/user/${user?.id}`, refreshTrigger],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Fetch holdings for the main portfolio
  const { data: holdings, isLoading: holdingsLoading } = useQuery({
    queryKey: [`/api/portfolios/${userPortfolios?.[0]?.id}/holdings`, refreshTrigger],
    enabled: !!userPortfolios?.[0]?.id,
    refetchInterval: 15000,
  });

  // Fetch current prices for all held assets
  const { data: pricesData } = useQuery({
    queryKey: ['/api/market/prices', 'positions', refreshTrigger],
    queryFn: () => {
      if (!holdings || !Array.isArray(holdings) || holdings.length === 0) return null;
      const assetIds = holdings.map((h: any) => h.assetId).join(',');
      return fetch(`/api/market/prices?assetIds=${assetIds}`).then(res => res.json());
    },
    enabled: !!holdings && Array.isArray(holdings) && holdings.length > 0,
    refetchInterval: 5000,
  });

  // Process positions data
  const processPositions = (): Position[] => {
    if (!holdings || !Array.isArray(holdings) || !pricesData?.data) return [];

    const portfolioValue = userPortfolios?.[0]?.totalValue ? parseFloat(userPortfolios[0].totalValue) : 0;

    return holdings.map((holding: any) => {
      const priceData = pricesData.data.find((p: any) => p.assetId === holding.assetId);
      const quantity = parseFloat(holding.quantity || '0');
      const averagePrice = parseFloat(holding.averagePrice || '0');
      const currentPrice = priceData ? parseFloat(priceData.currentPrice || '0') : 0;
      const marketValue = quantity * currentPrice;
      const costBasis = quantity * averagePrice;
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;
      const dayChange = priceData ? parseFloat(priceData.dayChange || '0') : 0;
      const dayChangePercent = priceData ? parseFloat(priceData.dayChangePercent || '0') : 0;
      const allocation = portfolioValue > 0 ? (marketValue / portfolioValue) * 100 : 0;

      return {
        id: holding.id,
        assetId: holding.assetId,
        symbol: holding.asset?.symbol || 'N/A',
        name: holding.asset?.name || 'Unknown Asset',
        quantity,
        averagePrice,
        currentPrice,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        dayChange: dayChange * quantity,
        dayChangePercent,
        allocation,
      };
    }).filter(position => position.quantity > 0);
  };

  const positions = processPositions();

  // Portfolio summary calculations
  const portfolioSummary = {
    totalValue: positions.reduce((sum, pos) => sum + pos.marketValue, 0),
    totalUnrealizedPnL: positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0),
    totalDayChange: positions.reduce((sum, pos) => sum + pos.dayChange, 0),
    positionCount: positions.length,
    topGainer: positions.reduce((max, pos) => 
      pos.unrealizedPnLPercent > max.unrealizedPnLPercent ? pos : max, 
      { unrealizedPnLPercent: -Infinity } as Position
    ),
    topLoser: positions.reduce((min, pos) => 
      pos.unrealizedPnLPercent < min.unrealizedPnLPercent ? pos : min, 
      { unrealizedPnLPercent: Infinity } as Position
    ),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  if (portfoliosLoading || holdingsLoading) {
    return (
      <div className="h-64 flex items-center justify-center" data-testid="positions-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading positions...</p>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center" data-testid="no-positions">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Open Positions</h3>
          <p className="text-muted-foreground">
            Your positions will appear here once you start trading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="positions-panel">
      {/* Portfolio Summary */}
      <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Portfolio Value</span>
          <span className="text-lg font-bold">{formatCurrency(portfolioSummary.totalValue)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unrealized P&L:</span>
            <span className={portfolioSummary.totalUnrealizedPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}>
              {formatCurrency(portfolioSummary.totalUnrealizedPnL)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Day Change:</span>
            <span className={portfolioSummary.totalDayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}>
              {formatCurrency(portfolioSummary.totalDayChange)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Positions:</span>
          <Badge variant="outline">{portfolioSummary.positionCount}</Badge>
        </div>
      </div>

      {/* Positions List */}
      <ScrollArea className="h-80">
        <div className="space-y-2">
          {positions.map((position) => (
            <div
              key={position.id}
              className={`p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer ${
                selectedPosition === position.id ? 'bg-muted/50 border-primary' : ''
              }`}
              onClick={() => setSelectedPosition(position.id === selectedPosition ? null : position.id)}
              data-testid={`position-${position.symbol}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{position.symbol}</span>
                    <Badge variant="outline" className="text-xs">
                      {position.allocation.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {position.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {position.quantity.toLocaleString()} shares @ {formatCurrency(position.averagePrice)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">{formatCurrency(position.marketValue)}</div>
                  <div className={`text-sm ${position.unrealizedPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formatCurrency(position.unrealizedPnL)}
                  </div>
                  <div className={`text-xs ${position.unrealizedPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formatPercent(position.unrealizedPnLPercent)}
                  </div>
                </div>

                <div className="ml-2">
                  {position.unrealizedPnL >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              {/* Expanded Position Details */}
              {selectedPosition === position.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Price:</span>
                      <span>{formatCurrency(position.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Day Change:</span>
                      <span className={position.dayChangePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                        {formatPercent(position.dayChangePercent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Basis:</span>
                      <span>{formatCurrency(position.quantity * position.averagePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allocation:</span>
                      <span>{position.allocation.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Allocation Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Portfolio Allocation</span>
                      <span>{position.allocation.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(position.allocation, 100)} 
                      className="h-1"
                    />
                  </div>

                  {/* Risk Indicators */}
                  {position.allocation > 25 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      <span>High concentration risk</span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-emerald-500 border-emerald-500/50">
                      Add Position
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-500/50">
                      Reduce Position
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Stats */}
      {portfolioSummary.positionCount > 0 && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
            <div className="text-muted-foreground">Top Gainer</div>
            <div className="font-medium">{portfolioSummary.topGainer.symbol}</div>
            <div className="text-emerald-500">{formatPercent(portfolioSummary.topGainer.unrealizedPnLPercent)}</div>
          </div>
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded">
            <div className="text-muted-foreground">Top Loser</div>
            <div className="font-medium">{portfolioSummary.topLoser.symbol}</div>
            <div className="text-red-500">{formatPercent(portfolioSummary.topLoser.unrealizedPnLPercent)}</div>
          </div>
        </div>
      )}
    </div>
  );
}