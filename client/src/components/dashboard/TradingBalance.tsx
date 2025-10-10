import { useState } from 'react';
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, DollarSign, TrendingUp, Shield, AlertTriangle,
  Target, Activity, Clock, BarChart3, RefreshCw, Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TradingBalanceData {
  virtualBalance: number;
  availableCash: number;
  investedAmount: number;
  dailyTradingLimit: number;
  dailyTradingUsed: number;
  maxPositionSize: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  tradingStreak: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export function TradingBalance() {
  const { user } = useAuth();
  
  // Fetch real user data with trading balance
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });

  // Transform user data to trading balance interface
  const balanceData = React.useMemo((): TradingBalanceData => {
    if (!userData) {
      return {
        virtualBalance: 100000.00,
        availableCash: 100000.00,
        investedAmount: 0.00,
        dailyTradingLimit: 10000.00,
        dailyTradingUsed: 0.00,
        maxPositionSize: 5000.00,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        tradingStreak: 0,
        riskTolerance: 'moderate'
      };
    }

    const virtualBalance = parseFloat(userData.virtualTradingBalance || '100000');
    const dailyTradingLimit = parseFloat(userData.dailyTradingLimit || '10000');
    const dailyTradingUsed = parseFloat(userData.dailyTradingUsed || '0');
    const maxPositionSize = parseFloat(userData.maxPositionSize || '5000');
    const totalProfit = parseFloat(userData.totalTradingProfit || '0');
    const availableCash = virtualBalance - dailyTradingUsed;
    const investedAmount = dailyTradingUsed;

    return {
      virtualBalance,
      availableCash,
      investedAmount,
      dailyTradingLimit,
      dailyTradingUsed,
      maxPositionSize,
      totalTrades: userData.totalTrades || 0,
      winningTrades: userData.winningTrades || 0,
      losingTrades: userData.losingTrades || 0,
      averageWin: userData.averageWin || 0,
      averageLoss: userData.averageLoss || 0,
      profitFactor: userData.profitFactor || 1.0,
      tradingStreak: userData.tradingStreakDays || 0,
      riskTolerance: (userData.riskTolerance as 'conservative' | 'moderate' | 'aggressive') || 'moderate'
    };
  }, [userData]);

  // Mock data for fallback when no real data
  const mockBalanceData = {
    virtualBalance: 100000.00,
    availableCash: 87420.50,
    investedAmount: 12579.50,
    dailyTradingLimit: 10000.00,
    dailyTradingUsed: 2350.00,
    maxPositionSize: 5000.00,
    totalTrades: 47,
    winningTrades: 32,
    losingTrades: 15,
    averageWin: 285.50,
    averageLoss: -145.75,
    profitFactor: 1.96,
    tradingStreak: 5,
    riskTolerance: 'moderate'
  };

  // Use real data if available, otherwise mock for demo
  const displayBalanceData = userData ? balanceData : mockBalanceData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getWinRate = () => {
    if (displayBalanceData.totalTrades === 0) return 0;
    return (displayBalanceData.winningTrades / displayBalanceData.totalTrades) * 100;
  };

  const getDailyLimitUsage = () => {
    return (displayBalanceData.dailyTradingUsed / displayBalanceData.dailyTradingLimit) * 100;
  };

  const getRiskToleranceColor = (tolerance: string) => {
    switch (tolerance) {
      case 'conservative': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'aggressive': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskToleranceIcon = (tolerance: string) => {
    switch (tolerance) {
      case 'conservative': return <Shield className="w-4 h-4" />;
      case 'moderate': return <Target className="w-4 h-4" />;
      case 'aggressive': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover-elevate" data-testid="card-trading-balance">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-500" />
            <CardTitle>Trading Balance</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Active
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Balance Info */}
        <div className="space-y-4" data-testid="balance-overview">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Virtual Trading Balance</p>
            {isLoading ? (
              <div className="animate-pulse bg-muted rounded h-8 w-32 mx-auto"></div>
            ) : (
              <p className="text-3xl  text-foreground" data-testid="text-virtual-balance">
                {formatCurrency(displayBalanceData.virtualBalance)}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Starting Amount: {formatCurrency(100000)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Available Cash</p>
              <p className="text-lg " data-testid="text-available-cash">
                {formatCurrency(displayBalanceData.availableCash)}
              </p>
            </div>
            
            <div className="text-center p-3 border rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Invested</p>
              <p className="text-lg " data-testid="text-invested-amount">
                {formatCurrency(displayBalanceData.investedAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Trading Limits */}
        <div className="space-y-3" data-testid="daily-limits">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm ">Daily Trading Limit</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(displayBalanceData.dailyTradingUsed)} / {formatCurrency(displayBalanceData.dailyTradingLimit)}
            </span>
          </div>
          <Progress 
            value={getDailyLimitUsage()} 
            className="h-2"
            data-testid="progress-daily-limit"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Used: {getDailyLimitUsage().toFixed(1)}%</span>
            <span>Remaining: {formatCurrency(displayBalanceData.dailyTradingLimit - displayBalanceData.dailyTradingUsed)}</span>
          </div>
        </div>

        {/* Risk Management */}
        <div className="space-y-3" data-testid="risk-management">
          <div className="flex items-center justify-between">
            <span className="text-sm ">Risk Profile</span>
            <div className="flex items-center gap-2">
              {getRiskToleranceIcon(displayBalanceData.riskTolerance)}
              <span className={`text-sm capitalize ${getRiskToleranceColor(displayBalanceData.riskTolerance)}`}>
                {displayBalanceData.riskTolerance}
              </span>
            </div>
          </div>
          
          <div className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Max Position Size</span>
              <span className="" data-testid="text-max-position">
                {formatCurrency(displayBalanceData.maxPositionSize)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Trading Streak</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className=" text-green-500" data-testid="text-trading-streak">
                  {displayBalanceData.tradingStreak} wins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="space-y-3" data-testid="trading-statistics">
          <h4 className="text-sm ">Trading Performance</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-xl " data-testid="text-total-trades">
                {displayBalanceData.totalTrades}
              </p>
            </div>
            
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-xl  text-green-500" data-testid="text-win-rate">
                {getWinRate().toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 border rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Win</p>
              <p className="text-sm  text-green-500" data-testid="text-avg-win">
                {formatCurrency(displayBalanceData.averageWin)}
              </p>
            </div>
            
            <div className="text-center p-2 border rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Loss</p>
              <p className="text-sm  text-red-500" data-testid="text-avg-loss">
                {formatCurrency(displayBalanceData.averageLoss)}
              </p>
            </div>
          </div>

          <div className="text-center p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Profit Factor</p>
            <p className={`text-lg  ${displayBalanceData.profitFactor >= 1 ? 'text-green-500' : 'text-red-500'}`} data-testid="text-profit-factor">
              {displayBalanceData.profitFactor.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Trading Insights */}
        <div className="border-t pt-4">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg" data-testid="trading-insights">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm ">Trading Insights</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You're on a {displayBalanceData.tradingStreak}-trade winning streak</li>
                <li>• {getDailyLimitUsage().toFixed(0)}% of daily limit used</li>
                <li>• Profit factor of {displayBalanceData.profitFactor.toFixed(2)} indicates strong performance</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}