import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, Clock, TrendingUp, TrendingDown, 
  Zap, CheckCircle, XCircle, AlertCircle,
  Filter, Play, Pause
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TradingFeedProps {
  refreshTrigger?: number;
}

interface TradeExecution {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  value: number;
  type: 'market' | 'limit' | 'stop';
}

interface OrderUpdate {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partially_filled';
  type: 'market' | 'limit' | 'stop';
}

interface MarketAlert {
  id: string;
  timestamp: string;
  type: 'price_alert' | 'volume_spike' | 'news' | 'volatility';
  symbol?: string;
  message: string;
  severity: 'info' | 'warning' | 'high';
}

export function TradingFeedComponent({ refreshTrigger = 0 }: TradingFeedProps) {
  const { user } = useAuth();
  const [isLiveFeed, setIsLiveFeed] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trades' | 'orders' | 'alerts'>('all');

  // Fetch recent orders for order updates
  const { data: recentOrders } = useQuery({
    queryKey: [`/api/orders/user/${user?.id}`, refreshTrigger],
    enabled: !!user?.id,
    refetchInterval: isLiveFeed ? 5000 : false,
  });

  // Generate simulated trading feed data
  // In a real implementation, this would come from WebSocket connections
  const generateTradingFeed = (): (TradeExecution | OrderUpdate | MarketAlert)[] => {
    const feed: (TradeExecution | OrderUpdate | MarketAlert)[] = [];
    
    // Add recent orders as order updates
    if (recentOrders && Array.isArray(recentOrders)) {
      const orderUpdates: OrderUpdate[] = recentOrders.slice(0, 10).map((order: any) => ({
        id: order.id,
        timestamp: order.createdAt,
        symbol: order.asset?.symbol || 'N/A',
        side: order.type,
        quantity: parseFloat(order.quantity || '0'),
        price: parseFloat(order.price || '0'),
        status: order.status,
        type: order.orderType || 'market',
      }));
      feed.push(...orderUpdates);
    }

    // Generate simulated market trades
    const symbols = ['SPIDER', 'BATMAN', 'XMEN', 'AVENG', 'WOLVR'];
    const now = new Date();
    
    for (let i = 0; i < 15; i++) {
      const tradeTime = new Date(now.getTime() - (i * 30000)); // 30 seconds apart
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const isBuy = Math.random() > 0.5;
      const basePrice = 50 + Math.random() * 100;
      const quantity = Math.floor(Math.random() * 500) + 100;
      
      const trade: TradeExecution = {
        id: `trade_${Date.now()}_${i}`,
        timestamp: tradeTime.toISOString(),
        symbol,
        side: isBuy ? 'buy' : 'sell',
        quantity,
        price: basePrice,
        value: quantity * basePrice,
        type: Math.random() > 0.7 ? 'limit' : 'market',
      };
      feed.push(trade);
    }

    // Generate market alerts
    const alerts: MarketAlert[] = [
      {
        id: 'alert_1',
        timestamp: new Date(now.getTime() - 60000).toISOString(),
        type: 'volume_spike',
        symbol: 'SPIDER',
        message: 'Volume spike detected - 300% above average',
        severity: 'warning',
      },
      {
        id: 'alert_2',
        timestamp: new Date(now.getTime() - 180000).toISOString(),
        type: 'news',
        message: 'Market News: Comic-Con announces record attendance',
        severity: 'info',
      },
      {
        id: 'alert_3',
        timestamp: new Date(now.getTime() - 300000).toISOString(),
        type: 'volatility',
        symbol: 'BATMAN',
        message: 'High volatility detected - Price swing 5%+',
        severity: 'high',
      },
    ];
    feed.push(...alerts);

    // Sort by timestamp (newest first)
    return feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const feedData = generateTradingFeed();

  // Filter data based on selected filter
  const getFilteredFeed = () => {
    switch (selectedFilter) {
      case 'trades':
        return feedData.filter(item => 'value' in item); // TradeExecution items
      case 'orders':
        return feedData.filter(item => 'status' in item && !('severity' in item)); // OrderUpdate items
      case 'alerts':
        return feedData.filter(item => 'severity' in item); // MarketAlert items
      default:
        return feedData;
    }
  };

  const filteredFeed = getFilteredFeed();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return formatTime(timestamp);
  };

  const renderTradeExecution = (trade: TradeExecution) => (
    <div
      key={trade.id}
      className="p-2 hover:bg-muted/30 rounded transition-colors"
      data-testid={`trade-execution-${trade.symbol}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {trade.side === 'buy' ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className="font-medium text-sm">{trade.symbol}</span>
          <Badge variant="outline" className="text-xs">
            {trade.type.toUpperCase()}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {getTimeAgo(trade.timestamp)}
        </div>
      </div>
      
      <div className="mt-1 text-sm">
        <span className={trade.side === 'buy' ? 'text-emerald-500' : 'text-red-500'}>
          {trade.side.toUpperCase()} {trade.quantity.toLocaleString()}
        </span>
        <span className="text-muted-foreground"> @ </span>
        <span className="font-medium">{formatCurrency(trade.price)}</span>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Total: {formatCurrency(trade.value)}
      </div>
    </div>
  );

  const renderOrderUpdate = (order: OrderUpdate) => (
    <div
      key={order.id}
      className="p-2 hover:bg-muted/30 rounded transition-colors"
      data-testid={`order-update-${order.symbol}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {order.status === 'filled' ? (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          ) : order.status === 'cancelled' ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : (
            <Clock className="h-4 w-4 text-yellow-500" />
          )}
          <span className="font-medium text-sm">{order.symbol}</span>
          <Badge 
            variant={
              order.status === 'filled' ? 'default' :
              order.status === 'cancelled' ? 'destructive' : 'secondary'
            }
            className="text-xs"
          >
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {getTimeAgo(order.timestamp)}
        </div>
      </div>
      
      <div className="mt-1 text-sm">
        <span className={order.side === 'buy' ? 'text-emerald-500' : 'text-red-500'}>
          {order.side.toUpperCase()} {order.quantity.toLocaleString()}
        </span>
        <span className="text-muted-foreground"> @ </span>
        <span className="font-medium">{formatCurrency(order.price)}</span>
      </div>
      
      <div className="text-xs text-muted-foreground capitalize">
        {order.type} order
      </div>
    </div>
  );

  const renderMarketAlert = (alert: MarketAlert) => (
    <div
      key={alert.id}
      className={`p-2 rounded transition-colors ${
        alert.severity === 'high' ? 'bg-red-500/10 border border-red-500/20' :
        alert.severity === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
        'bg-blue-500/10 border border-blue-500/20'
      }`}
      data-testid={`market-alert-${alert.type}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className={`h-4 w-4 ${
            alert.severity === 'high' ? 'text-red-500' :
            alert.severity === 'warning' ? 'text-yellow-500' :
            'text-blue-500'
          }`} />
          {alert.symbol && (
            <span className="font-medium text-sm">{alert.symbol}</span>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {alert.type.replace('_', ' ')}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {getTimeAgo(alert.timestamp)}
        </div>
      </div>
      
      <div className="mt-1 text-sm">
        {alert.message}
      </div>
    </div>
  );

  const renderFeedItem = (item: TradeExecution | OrderUpdate | MarketAlert) => {
    if ('value' in item) {
      return renderTradeExecution(item);
    } else if ('status' in item && !('severity' in item)) {
      return renderOrderUpdate(item);
    } else if ('severity' in item) {
      return renderMarketAlert(item);
    }
    return null;
  };

  return (
    <div className="space-y-4" data-testid="trading-feed-component">
      {/* Feed Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isLiveFeed ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLiveFeed(!isLiveFeed)}
            data-testid="button-toggle-live-feed"
          >
            {isLiveFeed ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Live
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Paused
              </>
            )}
          </Button>
          
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {filteredFeed.length} items
          </Badge>
        </div>

        {/* Filter Selector */}
        <Tabs value={selectedFilter} onValueChange={(value: any) => setSelectedFilter(value)}>
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-2" data-testid="filter-all">All</TabsTrigger>
            <TabsTrigger value="trades" className="text-xs px-2" data-testid="filter-trades">Trades</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs px-2" data-testid="filter-orders">Orders</TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs px-2" data-testid="filter-alerts">Alerts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Feed Content */}
      <ScrollArea className="h-80">
        {filteredFeed.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No feed data available</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFeed.map(renderFeedItem)}
          </div>
        )}
      </ScrollArea>

      {/* Feed Statistics */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Last update: {new Date().toLocaleTimeString()}
        </span>
        <div className="flex items-center gap-2">
          <span>{isLiveFeed ? 'Auto-refresh: 5s' : 'Manual refresh'}</span>
        </div>
      </div>
    </div>
  );
}