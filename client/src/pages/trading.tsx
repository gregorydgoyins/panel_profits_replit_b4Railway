import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, Clock, BarChart3, 
  Wallet, Target, AlertTriangle, RefreshCw, Eye, Terminal,
  Crown, Swords, Trophy, Zap, Power, Skull, ArrowUp, ArrowDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { OrderHistory } from '@/components/trading/OrderHistory';
import { MoralConsequenceDisplay } from '@/components/MoralConsequenceDisplay';
import { VictimFeed } from '@/components/VictimFeed';
import { BloodMoneyCounter } from '@/components/BloodMoneyCounter';
import { cn } from '@/lib/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_boost from 'highcharts/modules/boost';

// Initialize Highcharts modules
if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
  HC_exporting(Highcharts);
  HC_boost(Highcharts);
}

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

export default function TradingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [activePanel, setActivePanel] = useState<'orders' | 'positions' | 'moral'>('orders');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Fetch user data for trading limits and balance
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user portfolios for portfolio value
  const { data: userPortfolios, isLoading: portfoliosLoading } = useQuery({
    queryKey: ['/api/portfolios/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Fetch user orders for trading stats
  const { data: userOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 15000, // More frequent updates for orders
  });

  // Calculate trading statistics
  const tradingStats: TradingStats = {
    availableBalance: userData?.virtualTradingBalance ? parseFloat(userData.virtualTradingBalance as string) : 100000, // Default virtual balance
    dayTradingUsed: userData?.dailyTradingUsed ? parseFloat(userData.dailyTradingUsed as string) : 0,
    dayTradingLimit: userData?.dailyTradingLimit ? parseFloat(userData.dailyTradingLimit as string) : 10000,
    totalPortfolioValue: userPortfolios && Array.isArray(userPortfolios) ? userPortfolios.reduce((total: number, portfolio: any) => {
      return total + (portfolio.totalValue ? parseFloat(portfolio.totalValue) : 0);
    }, 0) : 0,
    totalTrades: userOrders && Array.isArray(userOrders) ? userOrders.filter((order: any) => order.status === 'filled').length : 0,
    profitToday: userOrders && Array.isArray(userOrders) ? userOrders.filter((order: any) => {
      const isToday = new Date(order.createdAt).toDateString() === new Date().toDateString();
      return isToday && order.status === 'filled';
    }).reduce((total: number, order: any) => {
      // Simple profit calculation - this could be more sophisticated
      return total + (order.totalValue ? parseFloat(order.totalValue) * 0.01 : 0);
    }, 0) : 0,
    pendingOrders: userOrders && Array.isArray(userOrders) ? userOrders.filter((order: any) => 
      order.status === 'pending' || order.status === 'partially_filled'
    ).length : 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getProgressPercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const handleOrderSubmit = async () => {
    if (!selectedAsset || !orderQuantity) return;
    
    toast({
      title: 'ORDER EXECUTED',
      description: `${orderType.toUpperCase()} ${orderQuantity} ${selectedAsset.symbol}`,
      className: 'bg-black border-green-500 text-green-500',
    });
    
    setOrderQuantity('');
    setOrderPrice('');
    setRefreshTrigger(prev => prev + 1);
  };

  const isMarketOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 16; // Simple market hours (9 AM - 4 PM)
  };

  // Fetch available assets
  const { data: assets } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const res = await fetch('/api/assets?type=character,comic,creator,publisher');
      return res.json();
    },
  });

  // Generate mock chart data for cinematic effect
  const generateChartData = () => {
    const data = [];
    const volumeData = [];
    const now = Date.now();
    const basePrice = selectedAsset ? 100 : 50;
    
    for (let i = 100; i >= 0; i--) {
      const time = now - i * 60 * 1000;
      const open = basePrice + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      
      data.push([time, open, high, low, close]);
      volumeData.push([time, volume]);
    }
    
    return { ohlc: data, volume: volumeData };
  };

  const chartData = generateChartData();

  // Cinematic dark chart configuration
  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: '#000000',
      style: {
        fontFamily: 'JetBrains Mono, monospace'
      },
      height: '100%',
      animation: {
        duration: 2000
      }
    },
    title: {
      text: selectedAsset ? `${selectedAsset.symbol} / USD` : 'SELECT ASSET',
      style: {
        color: '#00ff00',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 0 20px #00ff00'
      }
    },
    xAxis: {
      type: 'datetime',
      lineColor: 'rgba(0, 255, 0, 0.2)',
      lineWidth: 1,
      gridLineColor: 'rgba(0, 255, 0, 0.05)',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#00ff00',
          fontSize: '10px',
          textShadow: '0 0 5px #00ff00'
        }
      },
      crosshair: {
        color: 'rgba(0, 255, 0, 0.3)',
        width: 1,
        dashStyle: 'Dot'
      }
    },
    yAxis: [{
      labels: {
        align: 'left',
        x: 10,
        style: {
          color: '#00ff00',
          fontSize: '12px',
          textShadow: '0 0 5px #00ff00'
        },
        format: '${value}'
      },
      title: {
        text: null
      },
      height: '75%',
      resize: {
        enabled: false
      },
      lineWidth: 0,
      gridLineColor: 'rgba(0, 255, 0, 0.05)',
      gridLineWidth: 1
    }, {
      labels: {
        align: 'left',
        x: 10,
        style: {
          color: '#00ff00',
          fontSize: '10px'
        }
      },
      title: {
        text: null
      },
      top: '75%',
      height: '25%',
      offset: 0,
      lineWidth: 0,
      gridLineColor: 'rgba(0, 255, 0, 0.05)',
      gridLineWidth: 1
    }],
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderColor: '#00ff00',
      borderWidth: 1,
      style: {
        color: '#00ff00',
        fontSize: '12px'
      },
      shadow: {
        color: 'rgba(0, 255, 0, 0.5)',
        width: 10,
        offsetX: 0,
        offsetY: 0
      },
      shared: true,
      useHTML: true,
      formatter: function() {
        const points = this.points || [];
        const point = points[0];
        if (!point) return '';
        
        return `
          <div style="font-family: 'JetBrains Mono', monospace; padding: 8px;">
            <div style="color: #00ff00; font-weight: bold; margin-bottom: 4px;">
              ${selectedAsset?.symbol || 'ASSET'}
            </div>
            <div style="color: #00ff00;">O: ${(point.point as any).open?.toFixed(2)}</div>
            <div style="color: #00ff00;">H: ${(point.point as any).high?.toFixed(2)}</div>
            <div style="color: #00ff00;">L: ${(point.point as any).low?.toFixed(2)}</div>
            <div style="color: #00ff00;">C: ${(point.point as any).close?.toFixed(2)}</div>
            ${points[1] ? `<div style="color: #00ff00;">V: ${(points[1].y || 0).toLocaleString()}</div>` : ''}
          </div>
        `;
      }
    },
    plotOptions: {
      candlestick: {
        color: 'rgba(255, 0, 0, 0.8)',
        lineColor: '#ff0000',
        upColor: 'rgba(0, 255, 0, 0.8)',
        upLineColor: '#00ff00',
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 2
          }
        }
      },
      column: {
        borderWidth: 0,
        borderRadius: 0
      },
      series: {
        animation: {
          duration: 2000
        },
        dataLabels: {
          style: {
            textShadow: '0 0 10px currentColor'
          }
        }
      }
    },
    series: [{
      type: 'candlestick',
      name: 'Price',
      id: 'price',
      data: chartData.ohlc,
      yAxis: 0,
      dataGrouping: {
        enabled: false
      }
    }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: chartData.volume,
      yAxis: 1,
      color: 'rgba(0, 255, 0, 0.2)',
      dataGrouping: {
        enabled: false
      }
    }],
    credits: {
      enabled: false
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    rangeSelector: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    time: {
      useUTC: false
    },
    exporting: {
      enabled: false
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden terminal-interface" data-testid="page-trading">
      {/* Scan line effect */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="scanline" />
      </div>
      
      {/* Film grain effect */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.03]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.29' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />
      
      {/* Grid pattern overlay */}
      <div className="pointer-events-none fixed inset-0 z-30" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Terminal header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/90 border-b border-green-900/30 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Terminal className="w-5 h-5 text-green-500" />
          <span className="text-green-500 font-mono text-sm uppercase tracking-wider">
            TRADING TERMINAL v2.0.1
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500/60 text-xs font-mono">
              {isMarketOpen() ? 'MARKET OPEN' : 'MARKET CLOSED'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <BloodMoneyCounter userId={user?.id} compact className="border-none" />
          <span className="text-green-500 font-mono text-xs">
            BAL: {formatCurrency(tradingStats.availableBalance)}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex h-full pt-12">
        {/* Left panel - Chart (70%) */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 p-2">
            <div className="h-full rounded-none bg-black/50">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartRef}
              />
            </div>
          </div>
        </div>

        {/* Right panel - Trading controls (30%) */}
        <div className="w-[30%] bg-black/90 border-l border-green-900/30 flex flex-col">
          {/* Asset selector */}
          <div className="p-4 border-b border-green-900/30">
            <div className="space-y-2">
              <label className="text-green-500 text-xs font-mono uppercase">SELECT ASSET</label>
              <select
                className="w-full bg-black border border-green-900/50 text-green-500 p-2 font-mono text-sm focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)]" 
                value={selectedAsset?.id || ''}
                onChange={(e) => {
                  const asset = assets?.find((a: Asset) => a.id === e.target.value);
                  setSelectedAsset(asset || null);
                }}
              >
                <option value="">-- SELECT ASSET --</option>
                {assets?.map((asset: Asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.symbol} - {asset.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedAsset && (
              <div className="mt-3 p-2 border border-green-900/30">
                <div className="flex justify-between items-center">
                  <span className="text-green-500 font-mono text-xs">PRICE</span>
                  <span className="text-green-500 font-mono text-lg font-bold">
                    ${(Math.random() * 200 + 50).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-green-500/60 font-mono text-xs">24H</span>
                  <span className="text-red-500 font-mono text-xs">
                    <ArrowDown className="inline w-3 h-3" /> -2.34%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Order entry */}
          <div className="p-4 border-b border-green-900/30 space-y-3">
            <div className="flex gap-2">
              <button
                className={cn(
                  "flex-1 py-2 font-mono text-sm uppercase transition-all",
                  orderType === 'buy' 
                    ? "bg-green-500/20 text-green-500 border border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.5)]" 
                    : "bg-black text-green-500/50 border border-green-900/30 hover:border-green-500/50"
                )}
                onClick={() => setOrderType('buy')}
              >
                BUY
              </button>
              <button
                className={cn(
                  "flex-1 py-2 font-mono text-sm uppercase transition-all",
                  orderType === 'sell' 
                    ? "bg-red-500/20 text-red-500 border border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.5)]" 
                    : "bg-black text-red-500/50 border border-red-900/30 hover:border-red-500/50"
                )}
                onClick={() => setOrderType('sell')}
              >
                SELL
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-green-500 text-xs font-mono uppercase">QUANTITY</label>
              <input
                type="number"
                className="w-full bg-black border border-green-900/50 text-green-500 p-2 font-mono text-sm focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)]"
                placeholder="0.00"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-green-500 text-xs font-mono uppercase">LIMIT PRICE (OPTIONAL)</label>
              <input
                type="number"
                className="w-full bg-black border border-green-900/50 text-green-500 p-2 font-mono text-sm focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)]"
                placeholder="0.00"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
              />
            </div>

            <button
              className={cn(
                "w-full py-3 font-mono text-sm uppercase transition-all font-bold",
                orderType === 'buy'
                  ? "bg-green-500/20 text-green-500 border border-green-500 hover:bg-green-500/30 hover:shadow-[0_0_30px_rgba(0,255,0,0.5)]"
                  : "bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500/30 hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]"
              )}
              onClick={handleOrderSubmit}
              disabled={!selectedAsset || !orderQuantity}
            >
              EXECUTE {orderType}
            </button>
          </div>

          {/* Tab panels */}
          <div className="flex border-b border-green-900/30">
            <button
              className={cn(
                "flex-1 py-2 text-xs font-mono uppercase transition-all",
                activePanel === 'orders' 
                  ? "text-green-500 border-b-2 border-green-500 bg-green-500/5" 
                  : "text-green-500/50 hover:text-green-500/70"
              )}
              onClick={() => setActivePanel('orders')}
            >
              ORDERS
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-xs font-mono uppercase transition-all",
                activePanel === 'positions' 
                  ? "text-green-500 border-b-2 border-green-500 bg-green-500/5" 
                  : "text-green-500/50 hover:text-green-500/70"
              )}
              onClick={() => setActivePanel('positions')}
            >
              POSITIONS
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-xs font-mono uppercase transition-all",
                activePanel === 'moral' 
                  ? "text-red-500 border-b-2 border-red-500 bg-red-500/5" 
                  : "text-red-500/50 hover:text-red-500/70"
              )}
              onClick={() => setActivePanel('moral')}
            >
              <Skull className="inline w-3 h-3 mr-1" />
              VICTIMS
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'orders' && (
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  <div className="text-green-500 font-mono text-xs uppercase mb-3">RECENT ORDERS</div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-2 border border-green-900/20 hover:border-green-900/50 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-green-500 font-mono text-xs">
                          {i % 2 === 0 ? 'BUY' : 'SELL'} BATMAN
                        </span>
                        <span className={cn(
                          "font-mono text-xs",
                          i % 2 === 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {i % 2 === 0 ? '+' : '-'}${(Math.random() * 1000).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-green-500/40 font-mono text-xs mt-1">
                        {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {activePanel === 'positions' && (
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  <div className="text-green-500 font-mono text-xs uppercase mb-3">OPEN POSITIONS</div>
                  {userPortfolios?.[0] ? (
                    <>
                      <div className="p-2 border border-green-900/20">
                        <div className="flex justify-between items-center">
                          <span className="text-green-500 font-mono text-xs">PORTFOLIO VALUE</span>
                          <span className="text-green-500 font-mono text-sm font-bold">
                            {formatCurrency(tradingStats.totalPortfolioValue)}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 border border-green-900/20">
                        <div className="flex justify-between items-center">
                          <span className="text-green-500 font-mono text-xs">DAY P&L</span>
                          <span className={cn(
                            "font-mono text-sm font-bold",
                            tradingStats.profitToday >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {tradingStats.profitToday >= 0 ? '+' : ''}{formatCurrency(tradingStats.profitToday)}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 border border-green-900/20">
                        <div className="flex justify-between items-center">
                          <span className="text-green-500 font-mono text-xs">TOTAL TRADES</span>
                          <span className="text-green-500 font-mono text-sm">
                            {tradingStats.totalTrades}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-green-500/40 font-mono text-xs text-center py-8">
                      NO POSITIONS
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}

            {activePanel === 'moral' && (
              <div className="h-full overflow-hidden">
                <VictimFeed userId={user?.id} limit={20} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moral consequence overlay */}
      <div className="fixed bottom-4 left-4 z-20">
        <MoralConsequenceDisplay userId={user?.id} />
      </div>
      {/* Header with House Theme Integration */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <HouseEmblem size="lg" variant="soft" />
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                Trading Desk
                <HouseBadge size="sm" variant="secondary" showIcon={false} />
              </h1>
              <p className="text-muted-foreground">
                Execute buy and sell orders for comic book assets • {houseTheme.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isMarketOpen() ? 'default' : 'secondary'}>
            <Clock className="h-3 w-3 mr-1" />
            {isMarketOpen() ? 'Market Open' : 'Market Closed'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setRefreshTrigger(prev => prev + 1)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <HouseSelector variant="compact" size="sm" />
        </div>
      </div>

      {/* Trading Statistics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-available-balance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(tradingStats.availableBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Cash available for trading
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-daily-limit">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Trading Limit</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(tradingStats.dayTradingLimit - tradingStats.dayTradingUsed)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(tradingStats.dayTradingUsed, tradingStats.dayTradingLimit)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {getProgressPercentage(tradingStats.dayTradingUsed, tradingStats.dayTradingLimit).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used: {formatCurrency(tradingStats.dayTradingUsed)}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-portfolio-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(tradingStats.totalPortfolioValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total invested assets
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-trading-activity">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tradingStats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              Total trades executed
            </p>
            {tradingStats.pendingOrders > 0 && (
              <Badge variant="secondary" className="mt-2">
                {tradingStats.pendingOrders} pending
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warning for market hours */}
      {!isMarketOpen() && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-800">Market is Currently Closed</h4>
                <p className="text-sm text-orange-700">
                  Orders can be placed but will be executed when the market opens (9:00 AM - 4:00 PM).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Mythological Trading Interface */}
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="mythic-dashboard" data-testid="tab-mythic-dashboard">
              <Crown className="h-4 w-4 mr-2" />
              Mythic Nexus
            </TabsTrigger>
            <TabsTrigger value="battle-intel" data-testid="tab-battle-intel">
              <Swords className="h-4 w-4 mr-2" />
              Battle Intel
            </TabsTrigger>
            <TabsTrigger value="asset-discovery" data-testid="tab-asset-discovery">
              <Target className="h-4 w-4 mr-2" />
              Asset Oracle
            </TabsTrigger>
            <TabsTrigger value="gamified-trading" data-testid="tab-gamified-trading">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="classic-trading" data-testid="tab-classic-trading">
              <DollarSign className="h-4 w-4 mr-2" />
              Classic Trade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mythic-dashboard">
            <EnhancedTradingDashboard />
          </TabsContent>

          <TabsContent value="battle-intel">
            <BattleDrivenIntelligence />
          </TabsContent>

          <TabsContent value="asset-discovery">
            <AssetDiscoveryEngine />
          </TabsContent>

          <TabsContent value="gamified-trading">
            <GamifiedTradingWidgets />
          </TabsContent>

          <TabsContent value="classic-trading" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column - Trading Forms and Market Data */}
              <div className="lg:col-span-8 space-y-6">
                <Tabs value="order-entry" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="order-entry" data-testid="tab-order-entry">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Order Entry
                    </TabsTrigger>
                    <TabsTrigger value="order-history" data-testid="tab-order-history">
                      <Clock className="h-4 w-4 mr-2" />
                      Order History
                    </TabsTrigger>
                    <TabsTrigger value="market-watch" data-testid="tab-market-watch">
                      <Eye className="h-4 w-4 mr-2" />
                      Market Watch
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="order-entry" className="space-y-4">
                    <OrderEntryForm onOrderPlaced={handleOrderPlaced} />
                  </TabsContent>

                  <TabsContent value="order-history" className="space-y-4">
                    <OrderHistory refreshTrigger={refreshTrigger} userId={user?.id} />
                  </TabsContent>

                  <TabsContent value="market-watch" className="space-y-4">
                    <div className="grid gap-4">
                      <MarketDataWidget showMarketOverview={true} />
                      
                      {/* Quick Trading Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <Button 
                              variant="default" 
                              className="h-16 flex flex-col"
                              onClick={() => setActiveTab('order-entry')}
                              data-testid="button-quick-buy"
                            >
                              <TrendingUp className="h-6 w-6 mb-1" />
                              Place Buy Order
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-16 flex flex-col"
                              onClick={() => setActiveTab('order-entry')}
                              data-testid="button-quick-sell"
                            >
                              <TrendingUp className="h-6 w-6 mb-1 rotate-180" />
                              Place Sell Order
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Real-time Market Data */}
              <div className="lg:col-span-4 space-y-6">
                <MarketDataWidget showMarketOverview={true} />
          
                {/* Account Summary */}
                <Card data-testid="card-account-summary">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cash Balance:</span>
                        <span className="font-medium">{formatCurrency(tradingStats.availableBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Portfolio Value:</span>
                        <span className="font-medium">{formatCurrency(tradingStats.totalPortfolioValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Value:</span>
                        <span className="font-bold text-lg">
                          {formatCurrency(tradingStats.availableBalance + tradingStats.totalPortfolioValue)}
                        </span>
                      </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily P&L:</span>
                    <span className={`font-medium ${tradingStats.profitToday >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tradingStats.profitToday >= 0 ? '+' : ''}{formatCurrency(tradingStats.profitToday)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Trades:</span>
                    <span className="font-medium">{tradingStats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Orders:</span>
                    <span className="font-medium">{tradingStats.pendingOrders}</span>
                  </div>
                </div>
              </div>

              {/* Trading Limits Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Trading Limit</span>
                  <span>
                    {formatCurrency(tradingStats.dayTradingUsed)} / {formatCurrency(tradingStats.dayTradingLimit)}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getProgressPercentage(tradingStats.dayTradingUsed, tradingStats.dayTradingLimit) > 80 
                        ? 'bg-red-500' 
                        : getProgressPercentage(tradingStats.dayTradingUsed, tradingStats.dayTradingLimit) > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${getProgressPercentage(tradingStats.dayTradingUsed, tradingStats.dayTradingLimit)}%` }}
                  />
                </div>
                
                {/* Risk Management */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Risk Management</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Risk Tolerance:</span>
                          <Badge variant="outline" className="text-xs">
                            {(userData as any)?.riskTolerance || 'Moderate'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Position Size:</span>
                          <span>{formatCurrency(parseFloat((userData as any)?.maxPositionSize || '5000'))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subscription Tier:</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {(userData as any)?.subscriptionTier || 'Free'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}