import { useState, useEffect, useRef, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, Clock, BarChart3, 
  Wallet, Target, AlertTriangle, RefreshCw, Eye, Terminal,
  Crown, Swords, Trophy, Zap, Power, Skull, ArrowUp, ArrowDown,
  Heart, Flame, Ghost
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedWebSocket } from '@/hooks/useOptimizedWebSocket';
import { useCorruption, useBloodMoney } from '@/hooks/useCorruption';
import { OrderHistory } from '@/components/trading/OrderHistory';
import { OrderBook } from '@/components/trading/OrderBook';
import { VictimNotification, VictimData } from '@/components/VictimNotification';
import { BloodMoneyCounter } from '@/components/BloodMoneyCounter';
import { cn } from '@/lib/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { apiRequest } from '@/lib/queryClient';

// Lazy load heavy components for better performance
const MoralConsequenceDisplay = lazy(() => import('@/components/MoralConsequenceDisplay').then(module => ({ default: module.MoralConsequenceDisplay })));
const VictimFeed = lazy(() => import('@/components/VictimFeed').then(module => ({ default: module.VictimFeed })));
const ShadowTraders = lazy(() => import('@/components/ShadowTraders').then(module => ({ default: module.ShadowTraders })));
const WarfarePanel = lazy(() => import('@/components/WarfarePanel').then(module => ({ default: module.WarfarePanel })));

interface TradingStats {
  availableBalance: number;
  dayTradingUsed: number;
  dayTradingLimit: number;
  totalPortfolioValue: number;
  totalTrades: number;
  profitToday: number;
  pendingOrders: number;
}

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  currentPrice?: number;
  dayChange?: number;
  dayChangePercent?: number;
  volume?: number;
}

// Memoized stat display component
const StatDisplay = memo(({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: {
  label: string;
  value: string;
  icon: any;
  trend?: 'up' | 'down' | null;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}) => {
  const colorClass = variant === 'success' ? 'text-green-400' :
                     variant === 'danger' ? 'text-red-500' :
                     variant === 'warning' ? 'text-yellow-500' :
                     'text-gray-400';
  
  return (
    <div className="flex items-center gap-2 p-2 bg-black/50 rounded border border-white/10">
      <Icon className={cn("h-4 w-4", colorClass)} />
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className={cn("font-mono text-sm", colorClass)}>
          {value}
          {trend && (
            trend === 'up' ? 
              <ArrowUp className="inline h-3 w-3 ml-1 text-green-400" /> :
              <ArrowDown className="inline h-3 w-3 ml-1 text-red-400" />
          )}
        </div>
      </div>
    </div>
  );
});
StatDisplay.displayName = 'StatDisplay';

// Memoized asset list item
const AssetListItem = memo(({ 
  asset, 
  isSelected, 
  onSelect,
  realTimePrice 
}: {
  asset: Asset;
  isSelected: boolean;
  onSelect: (asset: Asset) => void;
  realTimePrice?: { price: number; flash: 'up' | 'down' | null } | null;
}) => {
  const handleClick = useCallback(() => {
    onSelect(asset);
  }, [asset, onSelect]);
  
  const displayPrice = realTimePrice?.price || asset.currentPrice || 0;
  const flashClass = realTimePrice?.flash === 'up' ? 'price-flash-up' :
                     realTimePrice?.flash === 'down' ? 'price-flash-down' : '';
  
  return (
    <div
      onClick={handleClick}
      className={cn(
        "p-3 cursor-pointer transition-all transform-gpu will-change-transform",
        "hover:bg-white/5 hover:translate-x-1",
        "border-l-2",
        isSelected ? "bg-red-900/20 border-red-500" : "border-transparent",
        "group"
      )}
      data-testid={`asset-item-${asset.id}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
            {asset.symbol}
          </div>
          <div className="text-xs text-gray-500 truncate max-w-[150px]">
            {asset.name}
          </div>
        </div>
        <div className="text-right">
          <div className={cn("font-mono text-sm", flashClass)}>
            ${displayPrice.toFixed(2)}
          </div>
          {asset.dayChangePercent && (
            <div className={cn(
              "text-xs",
              asset.dayChangePercent > 0 ? "text-green-400" : "text-red-400"
            )}>
              {asset.dayChangePercent > 0 ? "+" : ""}{asset.dayChangePercent.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
AssetListItem.displayName = 'AssetListItem';

export default function OptimizedTradingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [activePanel, setActivePanel] = useState<'orders' | 'positions' | 'orderbook' | 'moral' | 'warfare'>('orderbook');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [chartData, setChartData] = useState<{ ohlc: any[], volume: any[] }>({ ohlc: [], volume: [] });
  const [currentVictim, setCurrentVictim] = useState<VictimData | null>(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [potentialVictimCount, setPotentialVictimCount] = useState(0);
  const [showGlitchPrice, setShowGlitchPrice] = useState(false);
  const [shadowPriceHint, setShadowPriceHint] = useState<number | null>(null);
  
  // Use corruption and blood money hooks
  const { corruption, soulWeight, victimCount, corruptionClass } = useCorruption();
  const { bloodMoney, showBloodDrip, formattedBloodMoney } = useBloodMoney();
  
  // Show glitch effects for corrupt users (throttled)
  useEffect(() => {
    if (corruption > 30 && selectedAsset) {
      const glitchInterval = setInterval(() => {
        setShowGlitchPrice(true);
        // Calculate shadow price hint (simplified)
        const realPrice = selectedAsset.currentPrice || 100;
        const divergence = 1 - (0.95 - (corruption - 30) * 0.015);
        setShadowPriceHint(realPrice * divergence);
        
        setTimeout(() => {
          setShowGlitchPrice(false);
          setShadowPriceHint(null);
        }, 200 + Math.random() * 300);
      }, 10000 + Math.random() * 20000); // Increased interval for performance
      
      return () => clearInterval(glitchInterval);
    }
  }, [corruption, selectedAsset]);
  
  // Subscribe to WebSocket for selected asset with optimizations
  const subscribedAssets = useMemo(() => 
    selectedAsset ? [selectedAsset.id] : [],
    [selectedAsset]
  );
  
  const { 
    priceUpdates, 
    orderBooks, 
    marketPulse,
    getRealTimePrice,
    getOrderBook,
    isConnected,
    lastUpdateTime,
    isMobile
  } = useOptimizedWebSocket({ 
    subscribeTo: { 
      assets: subscribedAssets 
    },
    throttleMs: isMobile ? 200 : 100, // Slower updates on mobile
    enableBatching: true,
    maxBufferSize: isMobile ? 5 : 10 // Smaller buffer on mobile
  });

  // Fetch user data for trading limits and balance
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!user,
    refetchInterval: 60000, // Reduced frequency from 30s to 60s
    staleTime: 30000, // Consider data fresh for 30s
  });

  // Fetch user portfolios for portfolio value
  const { data: userPortfolios, isLoading: portfoliosLoading } = useQuery({
    queryKey: ['/api/portfolios/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 60000, // Reduced frequency
    staleTime: 30000,
  });

  // Fetch user orders for trading stats
  const { data: userOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000, // Keep more frequent for orders
    staleTime: 15000,
  });

  // Calculate trading statistics (memoized)
  const tradingStats: TradingStats = useMemo(() => ({
    availableBalance: userData?.virtualTradingBalance ? parseFloat(userData.virtualTradingBalance as string) : 100000,
    dayTradingUsed: userData?.dailyTradingUsed ? parseFloat(userData.dailyTradingUsed as string) : 0,
    dayTradingLimit: userData?.dailyTradingLimit ? parseFloat(userData.dailyTradingLimit as string) : 10000,
    totalPortfolioValue: userPortfolios && Array.isArray(userPortfolios) ? userPortfolios.reduce((total: number, portfolio: any) => {
      return total + (portfolio.totalValue ? parseFloat(portfolio.totalValue) : 0);
    }, 0) : 0,
    totalTrades: userOrders && Array.isArray(userOrders) ? userOrders.filter((order: any) => order.status === 'filled').length : 0,
    profitToday: 0, // Calculate from orders if needed
    pendingOrders: userOrders && Array.isArray(userOrders) ? userOrders.filter((order: any) => order.status === 'pending').length : 0,
  }), [userData, userPortfolios, userOrders]);

  // Fetch available assets with pagination for performance
  const { data: assetsData, isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/assets', { limit: 50, offset: 0 }], // Limit to 50 assets initially
    staleTime: 60000, // Consider fresh for 1 minute
    gcTime: 300000, // Cache for 5 minutes
  });

  const assets: Asset[] = useMemo(() => 
    Array.isArray(assetsData) ? assetsData : [],
    [assetsData]
  );

  // Memoized callbacks
  const handleAssetSelect = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setOrderPrice(asset.currentPrice?.toString() || '');
  }, []);

  const handleOrderSubmit = useCallback(async () => {
    if (!selectedAsset || !orderQuantity || !orderPrice) {
      toast({
        title: "Invalid Order",
        description: "Please fill in all order details",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          assetId: selectedAsset.id,
          type: orderType,
          quantity: parseFloat(orderQuantity),
          price: parseFloat(orderPrice),
          userId: user?.id,
        }),
      });

      toast({
        title: "Order Placed",
        description: `${orderType.toUpperCase()} order for ${orderQuantity} ${selectedAsset.symbol} @ $${orderPrice}`,
      });

      // Reset form
      setOrderQuantity('');
      setOrderPrice('');
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/orders/user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios/user', user?.id] });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    }
  }, [selectedAsset, orderQuantity, orderPrice, orderType, user?.id, toast]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    queryClient.invalidateQueries();
    toast({
      title: "Refreshing Data",
      description: "Market data updated",
    });
  }, [toast]);

  // Optimized chart options with performance settings
  const chartOptions = useMemo(() => ({
    chart: {
      backgroundColor: '#000000',
      style: { fontFamily: 'Space Grotesk' },
      animation: !isMobile, // Disable animations on mobile
      renderTo: 'container',
    },
    boost: {
      useGPUTranslations: true, // Enable GPU acceleration
      usePreAllocated: true,
    },
    plotOptions: {
      series: {
        animation: !isMobile,
        turboThreshold: 1000, // Optimize for large datasets
        boostThreshold: 100,
      },
      candlestick: {
        lineColor: '#DC143C',
        upLineColor: '#00FF00',
        color: '#DC143C',
        upColor: '#00FF00',
      }
    },
    xAxis: {
      type: 'datetime',
      labels: { style: { color: '#888' } },
      gridLineColor: '#222',
    },
    yAxis: [{
      labels: { style: { color: '#888' }, align: 'right' },
      gridLineColor: '#222',
      height: '60%',
    }, {
      labels: { style: { color: '#888' }, align: 'right' },
      gridLineColor: '#222',
      top: '65%',
      height: '35%',
      offset: 0,
    }],
    series: [{
      type: 'candlestick',
      name: selectedAsset?.symbol || 'Price',
      data: chartData.ohlc.slice(-100), // Limit to last 100 points for performance
      yAxis: 0,
    }, {
      type: 'column',
      name: 'Volume',
      data: chartData.volume.slice(-100), // Limit volume data too
      yAxis: 1,
      color: '#333',
    }],
    credits: { enabled: false },
    navigator: { enabled: !isMobile }, // Disable navigator on mobile
    scrollbar: { enabled: !isMobile },
    rangeSelector: { enabled: !isMobile },
  }), [chartData, selectedAsset, isMobile]);

  // Fetch historical data for selected asset (throttled)
  useEffect(() => {
    if (!selectedAsset) return;

    const fetchChartData = async () => {
      try {
        const response = await fetch(`/api/market/historical/${selectedAsset.id}?period=1d&interval=5m`);
        const data = await response.json();
        
        if (data && data.prices) {
          const ohlc = data.prices.map((p: any) => [
            new Date(p.timestamp).getTime(),
            p.open,
            p.high,
            p.low,
            p.close
          ]);
          
          const volume = data.prices.map((p: any) => [
            new Date(p.timestamp).getTime(),
            p.volume
          ]);
          
          setChartData({ ohlc, volume });
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    // Debounce chart data fetching
    const timeoutId = setTimeout(fetchChartData, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedAsset]);

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 backdrop-blur-sm bg-black/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-bold tracking-wider">TRADING TERMINAL</h1>
            {isConnected ? (
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                LIVE
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-400 border-red-400">
                OFFLINE
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <BloodMoneyCounter />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              className="hover-elevate"
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Trading Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
          <StatDisplay 
            label="Balance" 
            value={`$${tradingStats.availableBalance.toLocaleString()}`}
            icon={Wallet}
            variant="default"
          />
          <StatDisplay 
            label="Portfolio" 
            value={`$${tradingStats.totalPortfolioValue.toLocaleString()}`}
            icon={BarChart3}
            variant={tradingStats.totalPortfolioValue > 100000 ? 'success' : 'default'}
          />
          <StatDisplay 
            label="Day Trading" 
            value={`$${tradingStats.dayTradingUsed.toLocaleString()} / $${tradingStats.dayTradingLimit.toLocaleString()}`}
            icon={Target}
            variant={tradingStats.dayTradingUsed > tradingStats.dayTradingLimit * 0.8 ? 'warning' : 'default'}
          />
          <StatDisplay 
            label="Total Trades" 
            value={tradingStats.totalTrades.toString()}
            icon={Activity}
            variant="default"
          />
          <StatDisplay 
            label="Pending" 
            value={tradingStats.pendingOrders.toString()}
            icon={Clock}
            variant={tradingStats.pendingOrders > 0 ? 'warning' : 'default'}
          />
          <StatDisplay 
            label="Corruption" 
            value={`${corruption}%`}
            icon={Skull}
            variant={corruption > 50 ? 'danger' : 'default'}
          />
          <StatDisplay 
            label="Victims" 
            value={victimCount.toString()}
            icon={Ghost}
            variant={victimCount > 0 ? 'danger' : 'default'}
          />
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Asset List */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-black/50">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Assets
            </h2>
          </div>
          <ScrollArea className="flex-1">
            {assetsLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {assets.map((asset) => (
                  <AssetListItem
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset?.id === asset.id}
                    onSelect={handleAssetSelect}
                    realTimePrice={getRealTimePrice(asset.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Center Panel - Chart and Order Entry */}
        <div className="flex-1 flex flex-col">
          {selectedAsset ? (
            <>
              {/* Chart */}
              <div className="flex-1 p-4 bg-black/30">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                  ref={chartRef}
                />
              </div>
              
              {/* Order Entry */}
              <div className="p-4 border-t border-white/10 bg-black/50">
                <div className="flex gap-4 items-end">
                  <div className="flex gap-2">
                    <Button
                      variant={orderType === 'buy' ? 'default' : 'outline'}
                      onClick={() => setOrderType('buy')}
                      className="hover-elevate"
                      data-testid="button-order-buy"
                    >
                      BUY
                    </Button>
                    <Button
                      variant={orderType === 'sell' ? 'default' : 'outline'}
                      onClick={() => setOrderType('sell')}
                      className="hover-elevate"
                      data-testid="button-order-sell"
                    >
                      SELL
                    </Button>
                  </div>
                  
                  <div className="flex-1 flex gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
                      <Input
                        type="number"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(e.target.value)}
                        placeholder="0"
                        className="w-32 bg-black border-white/20"
                        data-testid="input-order-quantity"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Price
                        {showGlitchPrice && shadowPriceHint && (
                          <span className="ml-2 text-purple-400 animate-pulse">
                            (Shadow: ${shadowPriceHint.toFixed(2)})
                          </span>
                        )}
                      </label>
                      <Input
                        type="number"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                        placeholder="0.00"
                        className={cn(
                          "w-32 bg-black border-white/20",
                          showGlitchPrice && "animate-glitch text-purple-400"
                        )}
                        data-testid="input-order-price"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleOrderSubmit}
                    className={cn(
                      "hover-elevate",
                      orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    )}
                    disabled={!orderQuantity || !orderPrice}
                    data-testid="button-submit-order"
                  >
                    PLACE ORDER
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select an asset to start trading
            </div>
          )}
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="w-96 border-l border-white/10 flex flex-col bg-black/50">
          <div className="flex border-b border-white/10">
            {(['orderbook', 'orders', 'moral', 'warfare'] as const).map((panel) => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={cn(
                  "flex-1 p-3 text-xs uppercase tracking-wider transition-all",
                  "hover:bg-white/5",
                  activePanel === panel ? "bg-red-900/20 text-red-400 border-b-2 border-red-500" : "text-gray-500"
                )}
                data-testid={`button-panel-${panel}`}
              >
                {panel}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={
              <div className="p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            }>
              {activePanel === 'orderbook' && selectedAsset && (
                <OrderBook 
                  assetId={selectedAsset.id}
                  orderBook={getOrderBook(selectedAsset.id)}
                />
              )}
              {activePanel === 'orders' && (
                <OrderHistory userId={user?.id} limit={20} />
              )}
              {activePanel === 'moral' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-hidden">
                    <MoralConsequenceDisplay />
                  </div>
                  <div className="h-1/3 border-t border-white/10 overflow-hidden">
                    <VictimFeed userId={user?.id} limit={10} />
                  </div>
                </div>
              )}
              {activePanel === 'warfare' && (
                <WarfarePanel />
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Victim Notification (absolute positioned) */}
      {currentVictim && (
        <VictimNotification 
          victim={currentVictim}
          onDismiss={() => setCurrentVictim(null)}
        />
      )}
      
      {/* Shadow Traders Overlay (performance optimized) */}
      {corruption > 30 && !isMobile && (
        <Suspense fallback={null}>
          <ShadowTraders />
        </Suspense>
      )}
    </div>
  );
}