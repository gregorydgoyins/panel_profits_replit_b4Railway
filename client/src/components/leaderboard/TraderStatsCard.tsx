import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RankingBadge } from './RankingBadge';
import { AchievementBadges } from './AchievementBadges';
import type { User, TraderStats, UserAchievement } from '@shared/schema';

// Local type definition for LeaderboardEntry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: User;
  stats: TraderStats;
  change?: number;
  achievements?: UserAchievement[];
}

interface TraderStatsCardProps {
  entry: LeaderboardEntry;
  showDetailedStats?: boolean;
  variant?: 'compact' | 'detailed';
}

export function TraderStatsCard({ entry, showDetailedStats = false, variant = 'compact' }: TraderStatsCardProps) {
  const { rank, user, stats, change, achievements } = entry;

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: num >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const formatLargeNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  const getPnLColor = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email?.[0]?.toUpperCase() || 'U';

  if (variant === 'compact') {
    return (
      <Card className="hover-elevate transition-all duration-200" data-testid={`trader-card-${user.id}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left side - Rank, Avatar, Name */}
            <div className="flex items-center gap-3">
              <RankingBadge rank={rank} change={change} size="sm" />
              
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-sm">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.email?.split('@')[0] || 'Anonymous Trader'
                    }
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {stats.totalTrades} trades • {formatPercentage(stats.winRate || 0)} win rate
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Key Stats */}
            <div className="text-right">
              <div className="font-bold text-lg">
                {formatCurrency(stats.totalPortfolioValue || 0)}
              </div>
              <div className={`text-sm font-medium ${getPnLColor(stats.totalPnL || 0)}`}>
                {formatPercentage(stats.roiPercentage || 0)} ROI
              </div>
            </div>
          </div>

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="mt-3">
              <AchievementBadges achievements={achievements} maxDisplay={2} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`trader-card-detailed-${user.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RankingBadge rank={rank} change={change} />
            
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-semibold">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.email?.split('@')[0] || 'Anonymous Trader'
                  }
                </h3>
                <Badge variant="outline" className="text-xs">
                  {user.subscriptionTier || 'Free'} Trader
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <AchievementBadges achievements={achievements} maxDisplay={4} />
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <DollarSign className="h-3 w-3" />
              Portfolio Value
            </div>
            <div className="font-bold text-lg">
              {formatCurrency(stats.totalPortfolioValue || 0)}
            </div>
          </div>

          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              {parseFloat(stats.totalPnL || '0') >= 0 ? 
                <TrendingUp className="h-3 w-3" /> : 
                <TrendingDown className="h-3 w-3" />
              }
              Total P&L
            </div>
            <div className={`font-bold text-lg ${getPnLColor(stats.totalPnL || 0)}`}>
              {formatCurrency(stats.totalPnL || 0)}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Target className="h-3 w-3" />
              Win Rate
            </div>
            <div className="font-semibold text-green-400">
              {formatPercentage(stats.winRate || 0)}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Activity className="h-3 w-3" />
              Trades
            </div>
            <div className="font-semibold">
              {formatLargeNumber(stats.totalTrades || 0)}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <BarChart3 className="h-3 w-3" />
              Volume
            </div>
            <div className="font-semibold">
              {formatCurrency(stats.totalTradingVolume || 0)}
            </div>
          </div>
        </div>

        {/* Additional Stats for Detailed View */}
        {showDetailedStats && (
          <div className="pt-3 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI:</span>
              <span className={getPnLColor(stats.roiPercentage || 0)}>
                {formatPercentage(stats.roiPercentage || 0)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Streak:</span>
              <span className={
                (stats.currentWinningStreak || 0) > 0 ? 'text-green-400' : 
                (stats.currentLosingStreak || 0) > 0 ? 'text-red-400' : 'text-muted-foreground'
              }>
                {(stats.currentWinningStreak || 0) > 0 
                  ? `${stats.currentWinningStreak} wins`
                  : (stats.currentLosingStreak || 0) > 0 
                    ? `${stats.currentLosingStreak} losses`
                    : 'No streak'
                }
              </span>
            </div>

            {stats.tradingDaysActive && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trading Days:</span>
                <span>{stats.tradingDaysActive} days</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}