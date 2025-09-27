import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarketStat {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: any;
  trend: 'up' | 'down' | 'neutral';
}

export function MarketOverviewStats() {
  // Mock market data - in real app this would come from API
  const marketStats: MarketStat[] = [
    {
      id: 'total-market-cap',
      label: 'Total Market Cap',
      value: 'CC 847.2B',
      change: 2.34,
      icon: DollarSign,
      trend: 'up'
    },
    {
      id: 'active-traders',
      label: 'Active Traders',
      value: '23,847',
      change: 5.67,
      icon: Users,
      trend: 'up'
    },
    {
      id: 'daily-volume',
      label: '24h Volume',
      value: 'CC 12.8B',
      change: -1.23,
      icon: Activity,
      trend: 'down'
    },
    {
      id: 'market-sentiment',
      label: 'Market Sentiment',
      value: 'Bullish',
      change: 8.45,
      icon: TrendingUp,
      trend: 'up'
    },
    {
      id: 'volatility-index',
      label: 'Volatility Index',
      value: '34.2',
      change: -2.11,
      icon: Zap,
      trend: 'down'
    },
    {
      id: 'top-gainers',
      label: 'Assets Up >5%',
      value: '142',
      change: 12.5,
      icon: TrendingUp,
      trend: 'up'
    }
  ];

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) return 'text-green-400';
    if (trend === 'down' || change < 0) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend === 'down' || change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  return (
    <Card className="p-6" data-testid="market-overview-stats">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-serif flex items-center space-x-3">
          <Activity className="h-6 w-6 text-primary" />
          <span>Market Overview</span>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Live Data
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {marketStats.map((stat) => {
            const IconComponent = stat.icon;
            const trendColor = getTrendColor(stat.trend, stat.change);
            const TrendIcon = getTrendIcon(stat.trend, stat.change);

            return (
              <Card 
                key={stat.id} 
                className="hover-elevate" 
                data-testid={`market-stat-${stat.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold font-mono">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 ${trendColor}`}>
                      {TrendIcon}
                      <span className="text-sm font-medium font-mono">
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Market Status Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Market Status</h3>
              <p className="text-sm text-muted-foreground">
                Panel Profits Exchange is operating normally with high liquidity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}