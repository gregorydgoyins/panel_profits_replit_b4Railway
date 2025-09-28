import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, 
  RefreshCw, Clock, BarChart3, Users
} from 'lucide-react';

interface MarketDataWidgetProps {
  assetId?: string;
  showMarketOverview?: boolean;
}

interface AssetPrice {
  assetId: string;
  currentPrice: string;
  bidPrice?: string;
  askPrice?: string;
  dayChange?: string;
  dayChangePercent?: string;
  volume?: number;
  marketStatus: string;
  volatility?: string;
  lastTradeTime?: string;
}

interface MarketOverview {
  totalMarketCap: number;
  totalVolume: number;
  activeTraders: number;
  topGainers: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  topLosers: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
}

export function MarketDataWidget({ assetId, showMarketOverview = false }: MarketDataWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch asset price data if assetId provided
  const { data: assetPrice, isLoading: priceLoading, refetch: refetchPrice } = useQuery({
    queryKey: ['/api/market/prices', assetId],
    queryFn: () => fetch(`/api/market/prices?assetIds=${assetId}`).then(res => res.json()),
    enabled: !!assetId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch market overview data
  const { data: marketOverview, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ['/api/market/overview'],
    queryFn: () => fetch('/api/market/overview').then(res => res.json()),
    enabled: showMarketOverview,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get current price data
  const currentPrice: AssetPrice | null = (assetPrice?.data && Array.isArray(assetPrice.data) && assetPrice.data[0]) || null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (assetId) {
        await refetchPrice();
      }
      if (showMarketOverview) {
        await refetchOverview();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBadge = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <Badge variant={isPositive ? 'default' : 'destructive'} className={isPositive ? 'bg-green-600' : ''}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {isPositive ? '+' : ''}${change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </Badge>
    );
  };

  if (assetId && !showMarketOverview) {
    // Single asset price display
    return (
      <Card data-testid="widget-asset-price">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Real-Time Price</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-testid="button-refresh-price"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {priceLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ) : currentPrice ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    ${parseFloat(currentPrice.currentPrice).toFixed(2)}
                  </div>
                  {currentPrice.dayChange && currentPrice.dayChangePercent && (
                    <div className="mt-1">
                      {getChangeBadge(
                        parseFloat(currentPrice.dayChange),
                        parseFloat(currentPrice.dayChangePercent)
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant={currentPrice.marketStatus === 'open' ? 'default' : 'secondary'}>
                    <Clock className="h-3 w-3 mr-1" />
                    {currentPrice.marketStatus === 'open' ? 'Market Open' : 'Market Closed'}
                  </Badge>
                  {currentPrice.volume && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Vol: {formatNumber(currentPrice.volume)}
                    </div>
                  )}
                </div>
              </div>

              {/* Bid/Ask Spread */}
              {currentPrice.bidPrice && currentPrice.askPrice && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground">Bid</div>
                    <div className="font-medium">${parseFloat(currentPrice.bidPrice).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ask</div>
                    <div className="font-medium">${parseFloat(currentPrice.askPrice).toFixed(2)}</div>
                  </div>
                </div>
              )}

              {/* Volatility */}
              {currentPrice.volatility && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Volatility</span>
                    <span>{parseFloat(currentPrice.volatility).toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(parseFloat(currentPrice.volatility) * 2, 100)} />
                </div>
              )}

              {currentPrice.lastTradeTime && (
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(currentPrice.lastTradeTime).toLocaleTimeString()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No price data available
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (showMarketOverview) {
    // Market overview display
    return (
      <Card data-testid="widget-market-overview">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Market Overview
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-testid="button-refresh-market"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {overviewLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : marketOverview ? (
            <div className="space-y-6">
              {/* Market Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="text-lg font-bold">{formatCurrency(marketOverview?.totalMarketCap || 0)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                  <div className="text-lg font-bold">{formatCurrency(marketOverview?.totalVolume || 0)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Active Traders</div>
                  <div className="text-lg font-bold flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    {formatNumber(marketOverview?.activeTraders || 0)}
                  </div>
                </div>
              </div>

              {/* Top Gainers & Losers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Top Gainers</h4>
                  <div className="space-y-2">
                    {marketOverview?.topGainers?.slice(0, 3).map((asset: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{asset.symbol}</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</div>
                        </div>
                        <Badge variant="default" className="bg-green-600 text-xs">
                          +{asset.changePercent.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Top Losers</h4>
                  <div className="space-y-2">
                    {marketOverview?.topLosers?.slice(0, 3).map((asset: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{asset.symbol}</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</div>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {asset.changePercent.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No market data available
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}