import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, TrendingDown, Wallet, DollarSign, Eye, BarChart3,
  Briefcase, Activity, Star, RefreshCw, Bell, Target, Users,
  ArrowUpRight, ArrowDownRight, Plus, Minus, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// We'll create these components in the next tasks
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { PortfolioHoldings } from '@/components/dashboard/PortfolioHoldings';
import { TradingBalance } from '@/components/dashboard/TradingBalance';
import { WatchlistManager } from '@/components/dashboard/WatchlistManager';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { OptionsChainWidget } from '@/components/dashboard/OptionsChainWidget';
import { ComicETFsWidget } from '@/components/dashboard/ComicETFsWidget';
import { MarketMoversWidget } from '@/components/dashboard/MarketMoversWidget';
import { FearGreedWidget } from '@/components/dashboard/FearGreedWidget';
import { OracleProphecyWidget } from '@/components/dashboard/OracleProphecyWidget';
import { HousePowerRankingsWidget } from '@/components/dashboard/HousePowerRankingsWidget';
import { PortfolioRiskMetricsWidget } from '@/components/dashboard/PortfolioRiskMetricsWidget';
import { VolatilitySurfaceWidget } from '@/components/dashboard/VolatilitySurfaceWidget';
import { CorrelationMatrixWidget } from '@/components/dashboard/CorrelationMatrixWidget';
import { EconomicCalendarWidget } from '@/components/dashboard/EconomicCalendarWidget';
import { SectorRotationWidget } from '@/components/dashboard/SectorRotationWidget';
import { MarginUtilizationWidget } from '@/components/dashboard/MarginUtilizationWidget';
import { LEAPSWidget } from '@/components/dashboard/LEAPSWidget';
import { PublisherBondsWidget } from '@/components/dashboard/PublisherBondsWidget';
import { UnusualActivityWidget } from '@/components/dashboard/UnusualActivityWidget';
import { DarkPoolWidget } from '@/components/dashboard/DarkPoolWidget';
import { OrderBookWidget } from '@/components/dashboard/OrderBookWidget';
import { AIRecommendationsWidget } from '@/components/dashboard/AIRecommendationsWidget';
import { PortfolioGreeksWidget } from '@/components/dashboard/PortfolioGreeksWidget';
import { NewsTicker } from '@/components/dashboard/NewsTicker';
import { StockTicker } from '@/components/dashboard/StockTicker';
import { ComicCoverCardsWidget } from '@/components/dashboard/ComicCoverCardsWidget';
import { ComicHeatMapWidget } from '@/components/dashboard/ComicHeatMapWidget';
import { ComicSentimentWidget } from '@/components/dashboard/ComicSentimentWidget';
import { WorldClocksWidget } from '@/components/dashboard/WorldClocksWidget';
import { PositionMonitorWidget } from '@/components/dashboard/PositionMonitorWidget';
import { TradeBlotterWidget } from '@/components/dashboard/TradeBlotterWidget';
import { WatchlistPanelWidget } from '@/components/dashboard/WatchlistPanelWidget';
import { CashFlowStatementWidget } from '@/components/dashboard/CashFlowStatementWidget';

// New Comic Widgets - Added for comic-focused trading experience
import { ComicCoverWidget } from '@/components/dashboard/ComicCoverWidget';
import { ComicHistoryWidget } from '@/components/dashboard/ComicHistoryWidget';
import { ComicTriviaWidget } from '@/components/dashboard/ComicTriviaWidget';
import { ComicRecommendationsWidget } from '@/components/dashboard/ComicRecommendationsWidget';
import { ComicRiskAssessmentWidget } from '@/components/dashboard/ComicRiskAssessmentWidget';
import { ComicOfTheDayWidget } from '@/components/dashboard/ComicOfTheDayWidget';

// Tracking Widgets - Publishers, Creators, Gadgets & Memorabilia
import { PublisherPerformanceWidget } from '@/components/dashboard/PublisherPerformanceWidget';
import { CreatorInfluenceWidget } from '@/components/dashboard/CreatorInfluenceWidget';
import { GadgetsMemorabiliaWidget } from '@/components/dashboard/GadgetsMemorabiliaWidget';

// Mosaic Layout System
import { MosaicLayout, MosaicItem, MosaicSection } from '@/components/dashboard/MosaicLayout';

interface UserData {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  availableCash?: number;
}

interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue?: string;
  dayChange?: string;
  dayChangePercent?: string;
  cashBalance?: string;
  holdings?: Holding[];
}

interface Holding {
  id: string;
  portfolioId: string;
  assetId: string;
  quantity: number;
  currentValue?: string;
  averageCost?: string;
}

interface Watchlist {
  id: string;
  userId: string;
  name: string;
  assets?: WatchlistAsset[];
}

interface WatchlistAsset {
  id: string;
  watchlistId: string;
  assetId: string;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  type: string;
  totalValue?: string;
}

interface DashboardStats {
  portfolioValue: number;
  dayChange: number;
  dayChangePercent: number;
  availableCash: number;
  totalTrades: number;
  winRate: number;
  watchlistCount: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real API calls for dashboard data
  const { data: userData, isLoading: isUserLoading } = useQuery<UserData>({ 
    queryKey: ['/api/auth/user'],
    refetchInterval: 300000 // Refetch every 5 minutes
  });
  
  const { data: portfolios, isLoading: isPortfoliosLoading } = useQuery<Portfolio[]>({ 
    queryKey: ['/api/portfolios'],
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  const { data: watchlists, isLoading: isWatchlistsLoading } = useQuery<Watchlist[]>({ 
    queryKey: ['/api/watchlists'],
    refetchInterval: 60000 // Refetch every minute
  });
  
  const { data: orders } = useQuery<Order[]>({ 
    queryKey: ['/api/orders/user', userData?.id],
    enabled: !!userData?.id,
    refetchInterval: 30000
  });

  // Calculate real dashboard stats from API data
  const dashboardStats = useMemo((): DashboardStats => {
    // Calculate portfolio value from holdings
    const portfolioValue = portfolios?.reduce((total: number, portfolio: any) => {
      const holdingsValue = portfolio.holdings?.reduce((sum: number, holding: any) => {
        return sum + (parseFloat(holding.currentValue || '0'));
      }, 0) || 0;
      return total + holdingsValue;
    }, 0) || 0;

    // Calculate day change from portfolio performance
    const dayChange = portfolios?.reduce((total: number, portfolio: any) => {
      return total + parseFloat(portfolio.dayChange || '0');
    }, 0) || 0;

    const dayChangePercent = portfolioValue > 0 ? (dayChange / (portfolioValue - dayChange)) * 100 : 0;

    // Get available cash (assuming it's stored in user data or calculated)
    const availableCash = userData?.availableCash || portfolios?.reduce((total: number, portfolio: any) => {
      return total + parseFloat(portfolio.cashBalance || '0');
    }, 0) || 50000; // Default if no data

    // Count total trades from orders
    const totalTrades = orders?.filter((order: any) => order.status === 'filled').length || 0;

    // Calculate win rate from profitable trades
    const filledOrders = orders?.filter((order: any) => order.status === 'filled') || [];
    const profitableTrades = filledOrders.filter((order: any) => {
      // Simple logic: if it's a sell order and price is higher than average buy, it's profitable
      return order.type === 'sell' && parseFloat(order.totalValue || '0') > 0;
    }).length;
    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

    // Count watchlist assets
    const watchlistCount = watchlists?.reduce((total: number, watchlist: any) => {
      return total + (watchlist.assets?.length || 0);
    }, 0) || 0;

    return {
      portfolioValue,
      dayChange,
      dayChangePercent,
      availableCash,
      totalTrades,
      winRate,
      watchlistCount
    };
  }, [portfolios, userData, orders, watchlists]);

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Trader';
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'T';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    try {
      // Refetch all dashboard data
      const { queryClient } = await import('@/lib/queryClient');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/watchlists'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/orders/user', userData?.id] })
      ]);
      
      toast({
        title: "Data Refreshed",
        description: "Dashboard updated with latest portfolio data",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsRefreshing(false);
  };

  // Show loading state while initial data loads
  if (isUserLoading || isPortfoliosLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="page-dashboard">
        <div className="border-b bg-card/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="w-48 h-5 bg-muted rounded animate-pulse" />
                <div className="w-64 h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-dashboard">
      {/* Dashboard Header */}
      <div className="border-b bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10" data-testid="avatar-user">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={getDisplayName()} />
                <AvatarFallback className="bg-indigo-600 text-white font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold" data-testid="text-welcome">
                  Welcome back, {getDisplayName()}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Panel Profits • {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Market Open
              </Badge>
              <Button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                data-testid="button-refresh-data"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" data-testid="button-notifications">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <NewsTicker />

      {/* Stock Ticker - Live asset prices directly under news ticker */}
      <StockTicker />

      {/* World Clocks - Global market hours under stock ticker */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <WorldClocksWidget />
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="dashboard-quick-stats">
          <Card className="hover-elevate" data-testid="card-portfolio-value">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-portfolio-value">
                    {formatCurrency(dashboardStats.portfolioValue)}
                  </p>
                  <div className={`flex items-center text-sm ${dashboardStats.dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dashboardStats.dayChangePercent >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {formatCurrency(dashboardStats.dayChange)} ({dashboardStats.dayChangePercent >= 0 ? '+' : ''}{dashboardStats.dayChangePercent.toFixed(2)}%)
                  </div>
                </div>
                <Briefcase className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-available-cash">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Cash</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-available-cash">
                    {formatCurrency(dashboardStats.availableCash)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Buying Power Ready
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-trading-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trading Stats</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-trades">
                    {dashboardStats.totalTrades}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dashboardStats.winRate}% Win Rate
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-watchlist-count">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Watchlist Items</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-watchlist-count">
                    {dashboardStats.watchlistCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Assets Tracked
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MOSAIC LAYOUT - All Widgets Fit Together Like Puzzle Pieces with NO GAPS */}
        <MosaicLayout>
          {/* Comic of the Day - Featured spotlight (full width) */}
          <MosaicSection className="mb-0">
            <ComicOfTheDayWidget />
          </MosaicSection>

          {/* Comic Covers Row - Visual Trading */}
          <MosaicSection className="mb-0">
            <ComicCoverWidget />
          </MosaicSection>

          {/* Portfolio & Trading - Main Section */}
          <MosaicItem span={2}>
            <PortfolioOverview />
          </MosaicItem>
          <MosaicItem span={1}>
            <TradingBalance />
          </MosaicItem>

          {/* Position Monitor - Real-time tracking */}
          <MosaicItem span={2}>
            <PositionMonitorWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <WatchlistPanelWidget />
          </MosaicItem>

          {/* Holdings & Market Overview */}
          <MosaicItem span={2}>
            <PortfolioHoldings />
          </MosaicItem>
          <MosaicItem span={1}>
            <MarketOverview />
          </MosaicItem>

          {/* Comic Content Widgets Row */}
          <MosaicItem span={1}>
            <ComicHistoryWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <ComicTriviaWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <ComicRecommendationsWidget />
          </MosaicItem>

          {/* Publisher & Creator Tracking Row */}
          <MosaicItem span={2}>
            <PublisherPerformanceWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <CreatorInfluenceWidget />
          </MosaicItem>

          {/* Gadgets & Memorabilia Tracking */}
          <MosaicItem span={1}>
            <GadgetsMemorabiliaWidget />
          </MosaicItem>
          <MosaicItem span={2}>
            <ComicRiskAssessmentWidget />
          </MosaicItem>

          {/* Portfolio Risk */}
          <MosaicSection>
            <PortfolioRiskMetricsWidget />
          </MosaicSection>

          {/* Trade Blotter - Full Width */}
          <MosaicSection>
            <TradeBlotterWidget />
          </MosaicSection>

          {/* Income & Watchlist */}
          <MosaicItem span={1}>
            <CashFlowStatementWidget />
          </MosaicItem>
          <MosaicItem span={2}>
            <WatchlistManager />
          </MosaicItem>

          {/* Options & Derivatives */}
          <MosaicSection>
            <OptionsChainWidget />
          </MosaicSection>

          {/* Market Intelligence Row */}
          <MosaicItem span={1}>
            <ComicETFsWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <MarketMoversWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <ComicSentimentWidget />
          </MosaicItem>

          {/* Market Dynamics */}
          <MosaicItem span={1}>
            <FearGreedWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <OracleProphecyWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <HousePowerRankingsWidget />
          </MosaicItem>

          {/* Advanced Analytics */}
          <MosaicItem span={1}>
            <VolatilitySurfaceWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <CorrelationMatrixWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <ComicHeatMapWidget />
          </MosaicItem>

          {/* Trading Tools */}
          <MosaicItem span={1}>
            <EconomicCalendarWidget />
          </MosaicItem>
          <MosaicItem span={2}>
            <SectorRotationWidget />
          </MosaicItem>

          {/* Advanced Trading Instruments */}
          <MosaicItem span={1}>
            <MarginUtilizationWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <LEAPSWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <PublisherBondsWidget />
          </MosaicItem>

          {/* Advanced Trading Tools */}
          <MosaicItem span={1}>
            <UnusualActivityWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <DarkPoolWidget />
          </MosaicItem>
          <MosaicItem span={1}>
            <OrderBookWidget />
          </MosaicItem>

          {/* AI & Portfolio Tools */}
          <MosaicItem span={1}>
            <AIRecommendationsWidget />
          </MosaicItem>
          <MosaicItem span={2}>
            <PortfolioGreeksWidget />
          </MosaicItem>
        </MosaicLayout>

        {/* Quick Actions Footer */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Common trading and portfolio actions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" data-testid="button-quick-buy">
                <Plus className="w-4 h-4 mr-2" />
                Quick Buy
              </Button>
              <Button variant="outline" size="sm" data-testid="button-quick-sell">
                <Minus className="w-4 h-4 mr-2" />
                Quick Sell
              </Button>
              <Button variant="outline" size="sm" data-testid="button-add-watchlist">
                <Star className="w-4 h-4 mr-2" />
                Add to Watchlist
              </Button>
              <Button variant="outline" size="sm" data-testid="button-market-analysis">
                <Target className="w-4 h-4 mr-2" />
                Market Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}