import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Activity, DollarSign, Clock, BarChart3, 
  Wallet, Target, AlertTriangle, RefreshCw, Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { OrderEntryForm } from '@/components/trading/OrderEntryForm';
import { OrderHistory } from '@/components/trading/OrderHistory';
import { MarketDataWidget } from '@/components/trading/MarketDataWidget';

interface TradingStats {
  availableBalance: number;
  dayTradingUsed: number;
  dayTradingLimit: number;
  totalPortfolioValue: number;
  totalTrades: number;
  profitToday: number;
  pendingOrders: number;
}

export default function TradingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('order-entry');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user data for trading limits and balance
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: '/api/auth/user',
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user portfolios for portfolio value
  const { data: userPortfolios, isLoading: portfoliosLoading } = useQuery({
    queryKey: `/api/portfolios/user/${user?.id}`,
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Fetch user orders for trading stats
  const { data: userOrders, isLoading: ordersLoading } = useQuery({
    queryKey: `/api/orders/user/${user?.id}`,
    enabled: !!user?.id,
    refetchInterval: 15000, // More frequent updates for orders
  });

  // Calculate trading statistics
  const tradingStats: TradingStats = {
    availableBalance: userData?.virtualTradingBalance ? parseFloat(userData.virtualTradingBalance) : 0,
    dayTradingUsed: userData?.dailyTradingUsed ? parseFloat(userData.dailyTradingUsed) : 0,
    dayTradingLimit: userData?.dailyTradingLimit ? parseFloat(userData.dailyTradingLimit) : 10000,
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

  const handleOrderPlaced = (orderId: string) => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: 'Order Placed Successfully',
      description: `Order ${orderId.slice(0, 8)}... has been placed`,
    });
    
    // Switch to order history tab to see the new order
    setActiveTab('order-history');
  };

  const isMarketOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 16; // Simple market hours (9 AM - 4 PM)
  };

  return (
    <div className="space-y-6" data-testid="page-trading">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading Desk</h1>
          <p className="text-muted-foreground">
            Execute buy and sell orders for comic book assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isMarketOpen() ? 'default' : 'secondary'}>
            <Clock className="h-3 w-3 mr-1" />
            {isMarketOpen() ? 'Market Open' : 'Market Closed'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setRefreshTrigger(prev => prev + 1)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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

      {/* Main Trading Interface */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Trading Forms and Market Data */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}