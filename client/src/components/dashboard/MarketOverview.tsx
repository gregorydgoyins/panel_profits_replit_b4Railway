import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, TrendingDown, Activity, Target, Clock,
  Users, BookOpen, Layers, Building, BarChart3, RefreshCw,
  ArrowUpRight, ArrowDownRight, Zap, Globe
} from 'lucide-react';

interface MarketMover {
  id: string;
  symbol: string;
  name: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  description: string;
}

interface MarketEvent {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  relatedAssets: string[];
}

export function MarketOverview() {
  // Real API calls for market data
  const { data: marketOverview, isLoading: isOverviewLoading, error: overviewError } = useQuery({ 
    queryKey: ['/api/market/overview'],
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  const { data: marketIndices, isLoading: isIndicesLoading, error: indicesError } = useQuery({ 
    queryKey: ['/api/market/indices'],
    refetchInterval: 60000 // Refetch every minute
  });
  
  const { data: marketEvents, isLoading: isEventsLoading, error: eventsError } = useQuery({ 
    queryKey: ['/api/market/events'],
    refetchInterval: 120000 // Refetch every 2 minutes
  });

  // Extract data from API responses
  const topGainers = useMemo(() => marketOverview?.topGainers || [], [marketOverview]);
  const topLosers = useMemo(() => marketOverview?.topLosers || [], [marketOverview]);
  const recentEvents = useMemo(() => {
    return (marketEvents || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      impact: event.impact,
      timestamp: new Date(event.eventDate || event.createdAt),
      relatedAssets: event.relatedAssets || []
    }));
  }, [marketEvents]);

  // Loading state
  if (isOverviewLoading || isIndicesLoading || isEventsLoading) {
    return (
      <Card className="hover-elevate" data-testid="card-market-overview">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <CardTitle>Market Overview</CardTitle>
            <RefreshCw className="w-4 h-4 animate-spin ml-auto" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-muted/50 rounded animate-pulse" />
            <div className="h-24 bg-muted/50 rounded animate-pulse" />
            <div className="h-40 bg-muted/50 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (overviewError || indicesError || eventsError) {
    return (
      <Card className="hover-elevate" data-testid="card-market-overview">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <CardTitle>Market Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Failed to load market data. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMinutes}m ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="w-3 h-3" />;
      case 'comic': return <BookOpen className="w-3 h-3" />;
      case 'creator': return <Layers className="w-3 h-3" />;
      case 'publisher': return <Building className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const getPerformanceColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getEventImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-500/20 bg-green-500/5';
      case 'negative': return 'border-red-500/20 bg-red-500/5';
      default: return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  const getEventImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="hover-elevate" data-testid="card-market-overview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <CardTitle>Market Overview</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Live
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Market Indices */}
        <div className="space-y-3" data-testid="market-indices">
          <h4 className="text-sm font-medium">Market Indices</h4>
          <div className="space-y-2">
            {marketIndices.map((index) => (
              <div 
                key={index.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
                data-testid={`index-${index.id}`}
              >
                <div>
                  <h5 className="font-medium text-sm">{index.name}</h5>
                  <p className="text-xs text-muted-foreground">{index.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium" data-testid={`index-value-${index.id}`}>
                    {formatNumber(index.value)}
                  </p>
                  <div className={`flex items-center gap-1 text-xs ${getPerformanceColor(index.change)}`}>
                    {index.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span data-testid={`index-change-${index.id}`}>
                      {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="top-movers">
          {/* Top Gainers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h4 className="text-sm font-medium">Top Gainers</h4>
            </div>
            <div className="space-y-2">
              {topGainers.map((asset) => (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-2 border rounded-lg"
                  data-testid={`gainer-${asset.symbol.toLowerCase()}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getTypeIcon(asset.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(asset.currentPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-500" data-testid={`gainer-change-${asset.symbol.toLowerCase()}`}>
                      +{asset.changePercent.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Vol: {formatNumber(asset.volume)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-medium">Top Losers</h4>
            </div>
            <div className="space-y-2">
              {topLosers.map((asset) => (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-2 border rounded-lg"
                  data-testid={`loser-${asset.symbol.toLowerCase()}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getTypeIcon(asset.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(asset.currentPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-red-500" data-testid={`loser-change-${asset.symbol.toLowerCase()}`}>
                      {asset.changePercent.toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Vol: {formatNumber(asset.volume)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Market Events */}
        <div className="space-y-3" data-testid="market-events">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-medium">Recent Market Events</h4>
          </div>
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 border rounded-lg ${getEventImpactColor(event.impact)}`}
                data-testid={`event-${event.id}`}
              >
                <div className="flex items-start gap-3">
                  {getEventImpactIcon(event.impact)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium">{event.title}</h5>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                    {event.relatedAssets.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">Related:</span>
                        {event.relatedAssets.map((asset, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Status */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Market Status</p>
              <p className="text-sm font-medium text-green-500" data-testid="text-market-status">
                Open
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assets Trading</p>
              <p className="text-sm font-medium" data-testid="text-assets-trading">
                328
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Sentiment</p>
              <p className="text-sm font-medium text-green-500" data-testid="text-market-sentiment">
                Bullish
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}