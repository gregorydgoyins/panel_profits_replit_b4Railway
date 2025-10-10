import { useState, useEffect } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, PieChart, Target, AlertTriangle,
  Briefcase, DollarSign, BarChart3, Activity, Info, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PortfolioData {
  id: string;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  diversificationScore: number;
  cashBalance: number;
  totalHoldings: number;
  riskScore: number;
}

interface PortfolioAllocation {
  assetType: string;
  value: number;
  percentage: number;
  color: string;
}

export function PortfolioOverview() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch user portfolios
  const { data: userPortfolios, isLoading: portfoliosLoading, refetch } = useQuery({
    queryKey: ['/api/portfolios', 'user', user?.id],
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Get the default/first portfolio
  const defaultPortfolio = userPortfolios?.[0];

  // Fetch portfolio holdings
  const { data: holdings, isLoading: holdingsLoading } = useQuery({
    queryKey: ['/api/portfolios', defaultPortfolio?.id, 'holdings'],
    enabled: !!defaultPortfolio?.id,
    refetchInterval: 30000,
  });

  // Calculate portfolio metrics from real data
  const portfolioData = React.useMemo(() => {
    if (!defaultPortfolio || !holdings) {
      return {
        id: 'loading',
        totalValue: 0,
        dayChange: 0,
        dayChangePercent: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        diversificationScore: 0,
        cashBalance: user?.virtualTradingBalance ? parseFloat(user.virtualTradingBalance) : 100000,
        totalHoldings: 0,
        riskScore: 0
      };
    }

    const totalValue = holdings.reduce((sum: number, holding: any) => sum + parseFloat(holding.currentValue || '0'), 0);
    const totalCost = holdings.reduce((sum: number, holding: any) => sum + parseFloat(holding.totalCost || '0'), 0);
    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
    
    const dayChange = holdings.reduce((sum: number, holding: any) => {
      const dayChangeValue = parseFloat(holding.dayChange || '0') * parseFloat(holding.quantity || '0');
      return sum + dayChangeValue;
    }, 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;

    // Calculate diversification score based on holdings spread
    const assetTypes = new Set(holdings.map((h: any) => h.assetType || 'unknown'));
    const diversificationScore = Math.min(assetTypes.size * 2, 10);

    // Simple risk score based on volatility (placeholder calculation)
    const riskScore = Math.min(Math.abs(totalReturnPercent) / 10 + 2, 10);

    return {
      id: defaultPortfolio.id,
      totalValue,
      dayChange,
      dayChangePercent,
      totalReturn,
      totalReturnPercent,
      diversificationScore,
      cashBalance: user?.virtualTradingBalance ? parseFloat(user.virtualTradingBalance) : 100000,
      totalHoldings: holdings.length,
      riskScore
    };
  }, [defaultPortfolio, holdings, user]);

  // Calculate allocations from real holdings data
  const allocations = React.useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    const totalValue = portfolioData.totalValue;
    if (totalValue === 0) return [];

    const typeMap: { [key: string]: { value: number; color: string } } = {
      'character': { value: 0, color: 'bg-blue-500' },
      'comic': { value: 0, color: 'bg-green-500' },
      'creator': { value: 0, color: 'bg-purple-500' },
      'publisher': { value: 0, color: 'bg-orange-500' }
    };

    holdings.forEach((holding: any) => {
      const assetType = holding.assetType || 'unknown';
      const value = parseFloat(holding.currentValue || '0');
      if (typeMap[assetType]) {
        typeMap[assetType].value += value;
      }
    });

    return Object.entries(typeMap)
      .filter(([_, data]) => data.value > 0)
      .map(([type, data]) => ({
        assetType: type.charAt(0).toUpperCase() + type.slice(1) + 's',
        value: data.value,
        percentage: (data.value / totalValue) * 100,
        color: data.color
      }));
  }, [holdings, portfolioData.totalValue]);

  const isLoading = portfoliosLoading || holdingsLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPerformanceColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getPerformanceIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getRiskLabel = (score: number) => {
    if (score >= 7) return { label: 'High Risk', color: 'text-red-500' };
    if (score >= 4) return { label: 'Medium Risk', color: 'text-yellow-500' };
    return { label: 'Low Risk', color: 'text-green-500' };
  };

  const getDiversificationLabel = (score: number) => {
    if (score >= 8) return { label: 'Excellent', color: 'text-green-500' };
    if (score >= 6) return { label: 'Good', color: 'text-blue-500' };
    if (score >= 4) return { label: 'Fair', color: 'text-yellow-500' };
    return { label: 'Poor', color: 'text-red-500' };
  };

  const handleOptimizePortfolio = () => {
    toast({
      title: "Portfolio Analysis Started",
      description: "AI is analyzing your portfolio for optimization opportunities...",
    });
  };


  return (
    <Card className="hover-elevate" data-testid="card-portfolio-overview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <CardTitle>Portfolio Overview</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOptimizePortfolio}
              data-testid="button-optimize-portfolio"
            >
              <Target className="w-4 h-4 mr-2" />
              Optimize
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div>
            {/* Main Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="portfolio-main-stats">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Value</span>
            </div>
            <p className="text-2xl " data-testid="text-total-portfolio-value">
              {formatCurrency(portfolioData.totalValue)}
            </p>
            <div className={`flex items-center gap-1 text-sm ${getPerformanceColor(portfolioData.dayChange)}`}>
              {getPerformanceIcon(portfolioData.dayChange)}
              <span data-testid="text-day-change">
                {portfolioData.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioData.dayChange)} 
                ({portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Return</span>
            </div>
            <p className="text-xl " data-testid="text-total-return">
              {formatCurrency(portfolioData.totalReturn)}
            </p>
            <div className={`flex items-center gap-1 text-sm ${getPerformanceColor(portfolioData.totalReturn)}`}>
              <span data-testid="text-total-return-percent">
                {portfolioData.totalReturnPercent >= 0 ? '+' : ''}{portfolioData.totalReturnPercent.toFixed(2)}%
              </span>
              <span className="text-muted-foreground">All Time</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Holdings</span>
            </div>
            <p className="text-xl " data-testid="text-total-holdings">
              {portfolioData.totalHoldings} Assets
            </p>
            <div className="text-sm text-muted-foreground">
              <span data-testid="text-cash-balance">
                {formatCurrency(portfolioData.cashBalance)} Cash
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="portfolio-health-metrics">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm ">Diversification Score</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${getDiversificationLabel(portfolioData.diversificationScore).color}`}>
                  {getDiversificationLabel(portfolioData.diversificationScore).label}
                </span>
                <span className="text-sm " data-testid="text-diversification-score">
                  {portfolioData.diversificationScore.toFixed(1)}/10
                </span>
              </div>
            </div>
            <Progress 
              value={portfolioData.diversificationScore * 10} 
              className="h-2"
              data-testid="progress-diversification"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm ">Risk Score</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${getRiskLabel(portfolioData.riskScore).color}`}>
                  {getRiskLabel(portfolioData.riskScore).label}
                </span>
                <span className="text-sm " data-testid="text-risk-score">
                  {portfolioData.riskScore.toFixed(1)}/10
                </span>
              </div>
            </div>
            <Progress 
              value={portfolioData.riskScore * 10} 
              className="h-2"
              data-testid="progress-risk"
            />
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="space-y-4" data-testid="portfolio-allocation">
          <div className="flex items-center justify-between">
            <h4 className="text-sm ">Asset Allocation</h4>
            <Button variant="ghost" size="sm">
              <Info className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {allocations.map((allocation, index) => (
              <div key={allocation.assetType} className="space-y-2" data-testid={`allocation-${allocation.assetType.toLowerCase().replace(' ', '-')}`}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${allocation.color}`} />
                    <span>{allocation.assetType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="">{formatCurrency(allocation.value)}</span>
                    <span className="text-muted-foreground">{allocation.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={allocation.percentage} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Insights */}
        <div className="border-t pt-4">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg" data-testid="portfolio-insights">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm ">Portfolio Insights</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your portfolio shows strong performance in character assets</li>
                <li>• Consider rebalancing to increase diversification score</li>
                <li>• Marvel assets are trending upward in current market</li>
              </ul>
            </div>
          </div>
        </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}