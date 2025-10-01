import { useState } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, TrendingDown, MoreHorizontal, ArrowUpRight, 
  Users, BookOpen, Layers, Building, Target, DollarSign,
  Minus, Plus, Eye, BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Holding {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  imageUrl?: string;
}

export function PortfolioHoldings() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user portfolios to get default portfolio
  const { data: userPortfolios } = useQuery<any[]>({
    queryKey: ['/api/portfolios', 'user', user?.id],
    enabled: !!user,
  });

  const defaultPortfolio = userPortfolios?.[0];

  // Fetch real holdings data
  const { data: holdings = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ['/api/portfolios', defaultPortfolio?.id, 'holdings'],
    enabled: !!defaultPortfolio?.id,
    refetchInterval: 30000,
  });

  // Transform holdings data to match interface
  const transformedHoldings: Holding[] = React.useMemo(() => {
    if (!holdings) return [];
    
    return holdings.map((holding: any) => ({
      id: holding.id,
      assetId: holding.assetId,
      symbol: holding.assetSymbol || 'N/A',
      name: holding.assetName || 'Unknown Asset',
      type: holding.assetType as 'character' | 'comic' | 'creator' | 'publisher',
      quantity: parseFloat(holding.quantity || '0'),
      avgPrice: parseFloat(holding.avgPrice || '0'),
      currentPrice: parseFloat(holding.currentPrice || '0'),
      totalValue: parseFloat(holding.currentValue || '0'),
      unrealizedPnL: parseFloat(holding.unrealizedPnL || '0'),
      unrealizedPnLPercent: parseFloat(holding.unrealizedPnLPercent || '0'),
      dayChange: parseFloat(holding.dayChange || '0'),
      dayChangePercent: parseFloat(holding.dayChangePercent || '0'),
      imageUrl: holding.assetImageUrl
    }));
  }, [holdings]);

  // Mock holdings data for fallback when no real data
  const mockHoldings: Holding[] = [
    {
      id: 'holding-1',
      assetId: 'spider-man',
      symbol: 'SPIDER',
      name: 'Spider-Man',
      type: 'character',
      quantity: 10,
      avgPrice: 35.50,
      currentPrice: 42.15,
      totalValue: 421.50,
      unrealizedPnL: 66.50,
      unrealizedPnLPercent: 18.73,
      dayChange: 1.25,
      dayChangePercent: 3.06
    },
    {
      id: 'holding-2',
      assetId: 'batman',
      symbol: 'BATMAN',
      name: 'Batman',
      type: 'character',
      quantity: 8,
      avgPrice: 180.00,
      currentPrice: 195.75,
      totalValue: 1566.00,
      unrealizedPnL: 126.00,
      unrealizedPnLPercent: 8.75,
      dayChange: -2.50,
      dayChangePercent: -1.26
    },
    {
      id: 'holding-3',
      assetId: 'xmen-1',
      symbol: 'XMEN1',
      name: 'X-Men #1 (1963)',
      type: 'comic',
      quantity: 1,
      avgPrice: 8500.00,
      currentPrice: 9200.00,
      totalValue: 9200.00,
      unrealizedPnL: 700.00,
      unrealizedPnLPercent: 8.24,
      dayChange: 150.00,
      dayChangePercent: 1.66
    },
    {
      id: 'holding-4',
      assetId: 'stan-lee',
      symbol: 'STANLEE',
      name: 'Stan Lee',
      type: 'creator',
      quantity: 25,
      avgPrice: 12.80,
      currentPrice: 15.30,
      totalValue: 382.50,
      unrealizedPnL: 62.50,
      unrealizedPnLPercent: 19.53,
      dayChange: 0.75,
      dayChangePercent: 5.15
    },
    {
      id: 'holding-5',
      assetId: 'marvel',
      symbol: 'MARVEL',
      name: 'Marvel Comics',
      type: 'publisher',
      quantity: 50,
      avgPrice: 25.00,
      currentPrice: 28.90,
      totalValue: 1445.00,
      unrealizedPnL: 195.00,
      unrealizedPnLPercent: 15.60,
      dayChange: 0.40,
      dayChangePercent: 1.40
    }
  ] as Holding[];

  // Use real holdings if available, otherwise fallback to mock for demo
  const displayHoldings: Holding[] = transformedHoldings.length > 0 ? transformedHoldings : (user ? [] : mockHoldings);

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

  const getPerformanceColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getPerformanceIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const totalHoldingsValue = displayHoldings.reduce((sum: number, holding: Holding) => sum + holding.totalValue, 0);
  const totalUnrealizedPnL = displayHoldings.reduce((sum: number, holding: Holding) => sum + holding.unrealizedPnL, 0);
  const totalUnrealizedPnLPercent = totalHoldingsValue > totalUnrealizedPnL && (totalHoldingsValue - totalUnrealizedPnL) > 0 
    ? (totalUnrealizedPnL / (totalHoldingsValue - totalUnrealizedPnL)) * 100 
    : 0;

  return (
    <Card className="hover-elevate" data-testid="card-portfolio-holdings">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <CardTitle>Portfolio Holdings</CardTitle>
            <Badge variant="outline">{displayHoldings.length} positions</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-sm font-medium ${getPerformanceColor(totalUnrealizedPnL)}`} data-testid="text-total-pnl">
                {totalUnrealizedPnL >= 0 ? '+' : ''}{formatCurrency(totalUnrealizedPnL)} ({totalUnrealizedPnLPercent >= 0 ? '+' : ''}{totalUnrealizedPnLPercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3" data-testid="holdings-list">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            displayHoldings.map((holding: Holding) => (
            <div 
              key={holding.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid={`holding-${holding.symbol.toLowerCase()}`}
            >
              {/* Asset Info */}
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${getTypeColor(holding.type)} font-semibold`}>
                    {getTypeIcon(holding.type)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{holding.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {holding.symbol}
                    </Badge>
                    <Badge className={`text-xs ${getTypeColor(holding.type)}`}>
                      {holding.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Qty: {holding.quantity}</span>
                    <span>Avg: {formatCurrency(holding.avgPrice)}</span>
                    <span>Current: {formatCurrency(holding.currentPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" data-testid={`value-${holding.symbol.toLowerCase()}`}>
                    {formatCurrency(holding.totalValue)}
                  </span>
                  <div className={`flex items-center gap-1 text-xs ${getPerformanceColor(holding.dayChange)}`}>
                    {getPerformanceIcon(holding.dayChange)}
                    <span data-testid={`day-change-${holding.symbol.toLowerCase()}`}>
                      {holding.dayChange >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className={`text-xs ${getPerformanceColor(holding.unrealizedPnL)}`}>
                  <span data-testid={`pnl-${holding.symbol.toLowerCase()}`}>
                    {holding.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(holding.unrealizedPnL)} 
                    ({holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid={`actions-${holding.symbol.toLowerCase()}`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Plus className="w-4 h-4 mr-2" />
                      Buy More
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Minus className="w-4 h-4 mr-2" />
                      Sell Position
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Add to Watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Holdings Summary */}
        {displayHoldings.length === 0 && !isLoading && (
          <div className="text-center py-8" data-testid="empty-holdings">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Holdings Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your portfolio by purchasing your first comic assets
            </p>
            <Button data-testid="button-start-trading">
              <DollarSign className="w-4 h-4 mr-2" />
              Start Trading
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}