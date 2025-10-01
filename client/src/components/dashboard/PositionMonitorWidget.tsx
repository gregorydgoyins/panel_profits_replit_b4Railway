import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, Users, BookOpen, Layers, Building, 
  Target, ArrowUpDown, DollarSign, TrendingDown as Loss, TrendingUp as Profit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useLocation } from 'wouter';

interface Position {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  totalValue: number;
  pnlDollar: number;
  pnlPercent: number;
}

type SortOption = 'pnlPercent' | 'pnlDollar' | 'totalValue';

export function PositionMonitorWidget() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState<SortOption>('pnlPercent');

  const { data: userPortfolios } = useQuery<any[]>({
    queryKey: ['/api/portfolios', 'user', user?.id],
    enabled: !!user,
  });

  const defaultPortfolio = userPortfolios?.[0];

  const { data: holdings = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/portfolios', defaultPortfolio?.id, 'holdings'],
    enabled: !!defaultPortfolio?.id,
    refetchInterval: 30000,
  });

  // Get real-time prices via WebSocket
  const assetIds = holdings.map((h: any) => h.assetId);
  const { getRealTimePrice, isConnected } = useWebSocket({
    subscribeTo: { assets: assetIds }
  });

  // Transform to positions with real-time prices
  const positions: Position[] = useMemo(() => {
    return holdings.map((holding: any) => {
      const realtimeData = getRealTimePrice(holding.assetId);
      const currentPrice = realtimeData?.price || parseFloat(holding.currentPrice || '0');
      const entryPrice = parseFloat(holding.avgPrice || '0');
      const quantity = parseFloat(holding.quantity || '0');
      const totalValue = currentPrice * quantity;
      const pnlDollar = (currentPrice - entryPrice) * quantity;
      const pnlPercent = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;

      return {
        id: holding.id,
        assetId: holding.assetId,
        symbol: holding.assetSymbol || 'N/A',
        name: holding.assetName || 'Unknown Asset',
        type: holding.assetType as any,
        quantity,
        entryPrice,
        currentPrice,
        totalValue,
        pnlDollar,
        pnlPercent,
      };
    });
  }, [holdings, getRealTimePrice]);

  // Sort positions
  const sortedPositions = useMemo(() => {
    const sorted = [...positions];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'pnlPercent':
          return b.pnlPercent - a.pnlPercent;
        case 'pnlDollar':
          return b.pnlDollar - a.pnlDollar;
        case 'totalValue':
          return b.totalValue - a.totalValue;
        default:
          return 0;
      }
    });
    return sorted;
  }, [positions, sortBy]);

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnlDollar, 0);
  const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0);
  const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="w-4 h-4" />;
      case 'comic': return <BookOpen className="w-4 h-4" />;
      case 'creator': return <Layers className="w-4 h-4" />;
      case 'publisher': return <Building className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'character': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'comic': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'creator': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'publisher': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-500';
    if (pnl < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const handleNavigateToTrade = (assetId: string, symbol: string) => {
    setLocation(`/trading?asset=${assetId}`);
  };

  if (isLoading) {
    return (
      <Card className="hover-elevate" data-testid="card-position-monitor">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <CardTitle>Position Monitor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate" data-testid="card-position-monitor">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <CardTitle>Position Monitor - Real-Time P&L</CardTitle>
            <Badge variant="outline">{positions.length} positions</Badge>
            {isConnected && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40" data-testid="select-sort-positions">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pnlPercent">Sort by P&L %</SelectItem>
                <SelectItem value="pnlDollar">Sort by P&L $</SelectItem>
                <SelectItem value="totalValue">Sort by Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={`text-lg font-bold ${getPnLColor(totalPnL)}`} data-testid="text-total-pnl">
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total P&L %</p>
            <p className={`text-lg font-bold ${getPnLColor(totalPnLPercent)}`} data-testid="text-total-pnl-percent">
              {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-lg font-bold" data-testid="text-total-value">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {sortedPositions.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-positions">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Positions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start trading to see your positions here
            </p>
            <Button onClick={() => setLocation('/trading')} data-testid="button-start-trading">
              <DollarSign className="w-4 h-4 mr-2" />
              Start Trading
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-positions">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="text-left p-2">Asset</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Entry</th>
                  <th className="text-right p-2">Current</th>
                  <th className="text-right p-2">P&L $</th>
                  <th className="text-right p-2">P&L %</th>
                  <th className="text-right p-2">Total Value</th>
                  <th className="text-right p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.map((position) => (
                  <tr 
                    key={position.id} 
                    className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleNavigateToTrade(position.assetId, position.symbol)}
                    data-testid={`position-row-${position.symbol.toLowerCase()}`}
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${getTypeColor(position.type)} text-xs`}>
                            {getTypeIcon(position.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{position.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {position.symbol}
                            <Badge className={`${getTypeColor(position.type)} text-xs`}>
                              {position.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-2 text-sm">{position.quantity}</td>
                    <td className="text-right p-2 text-sm">{formatCurrency(position.entryPrice)}</td>
                    <td className="text-right p-2 text-sm font-medium">
                      {formatCurrency(position.currentPrice)}
                    </td>
                    <td className={`text-right p-2 text-sm font-bold ${getPnLColor(position.pnlDollar)}`}>
                      {position.pnlDollar >= 0 ? (
                        <div className="flex items-center justify-end gap-1">
                          <Profit className="w-3 h-3" />
                          {formatCurrency(position.pnlDollar)}
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <Loss className="w-3 h-3" />
                          {formatCurrency(position.pnlDollar)}
                        </div>
                      )}
                    </td>
                    <td className={`text-right p-2 text-sm font-bold ${getPnLColor(position.pnlPercent)}`}>
                      {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                    </td>
                    <td className="text-right p-2 text-sm font-medium">
                      {formatCurrency(position.totalValue)}
                    </td>
                    <td className="text-right p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToTrade(position.assetId, position.symbol);
                        }}
                        data-testid={`button-trade-${position.symbol.toLowerCase()}`}
                      >
                        Trade
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
