import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  Trophy, Users, TrendingUp, Zap, Target, Crown, 
  RefreshCw, Info, ChevronRight 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import leaderboard components
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';
import { TraderStatsCard } from '@/components/leaderboard/TraderStatsCard';
import { AchievementBadges } from '@/components/leaderboard/AchievementBadges';

// Import types from shared schema
import type { LeaderboardCategory, TraderStats, UserAchievement, User } from '@shared/schema';

// Extended types for frontend
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: User;
  stats: TraderStats;
  change?: number;
  achievements?: UserAchievement[];
}

export interface LeaderboardData {
  category: LeaderboardCategory;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
  totalParticipants: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface UserRanking {
  category: LeaderboardCategory;
  rank: number;
  totalUsers: number;
  stats: TraderStats;
}

export interface LeaderboardOverview {
  totalActiveTraders: number;
  totalTrades: number;
  totalVolume: string;
  topPerformer: TraderStats & { user: User };
  categories: LeaderboardCategory[];
  recentAchievements: Array<UserAchievement & { user: User }>;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch leaderboard categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<LeaderboardCategory[]>({
    queryKey: ['/api/leaderboards/categories'],
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch leaderboard overview
  const { data: overview, isLoading: overviewLoading } = useQuery<LeaderboardOverview>({
    queryKey: ['/api/leaderboards/overview'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch current leaderboard data
  const { data: currentLeaderboard, isLoading: leaderboardLoading, refetch: refetchLeaderboard } = useQuery<LeaderboardData>({
    queryKey: ['/api/leaderboards', activeCategory],
    enabled: !!activeCategory,
    refetchInterval: 30000, // Real-time updates every 30 seconds
  });

  // Fetch user's personal rankings
  const { data: userRankings, isLoading: rankingsLoading } = useQuery<UserRanking[]>({
    queryKey: ['/api/leaderboards/my-rankings'],
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });

  // Set default active category when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      // Find "All-Time Leaders" category or use first category
      const defaultCategory = categories.find(c => c.timeframe === 'all_time') || categories[0];
      setActiveCategory(defaultCategory.id);
    }
  }, [categories, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchLeaderboard();
      toast({
        title: "Leaderboard Refreshed",
        description: "Rankings updated with latest data",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to update rankings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: num >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  const getUserRankInActiveCategory = () => {
    if (!userRankings || !activeCategory) return null;
    const activeRanking = userRankings.find(r => r.category.id === activeCategory);
    return activeRanking;
  };

  const isLoading = categoriesLoading || overviewLoading || leaderboardLoading;

  return (
    <div className="min-h-screen p-6 space-y-6" data-testid="leaderboard-page">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-lg">
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl ">Trading Leaderboards</h1>
            <p className="text-muted-foreground">
              Compete with the best traders on Panel Profits
            </p>
          </div>
        </div>

        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
          data-testid="button-refresh-leaderboard"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data-testid="stat-active-traders">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Active Traders</div>
                  <div className="text-xl ">{formatNumber(overview.totalActiveTraders)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-total-trades">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                  <div className="text-xl ">{formatNumber(overview.totalTrades)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-total-volume">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Trading Volume</div>
                  <div className="text-xl ">{formatCurrency(overview.totalVolume)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-top-performer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Top Performer</div>
                  <div className="text-sm  truncate">
                    {overview.topPerformer?.user 
                      ? (overview.topPerformer.user.firstName && overview.topPerformer.user.lastName 
                          ? `${overview.topPerformer.user.firstName} ${overview.topPerformer.user.lastName}`
                          : overview.topPerformer.user.email?.split('@')[0] || 'Anonymous'
                        )
                      : 'No data'
                    }
                  </div>
                  <div className="text-xs text-green-400">
                    {overview.topPerformer ? formatCurrency(overview.topPerformer.totalPortfolioValue || 0) : '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User's Personal Rankings */}
      {user && userRankings && userRankings.length > 0 && (
        <Card data-testid="user-rankings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRankings.slice(0, 6).map((ranking) => (
                <div 
                  key={ranking.category.id} 
                  className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center"
                  data-testid={`user-rank-${ranking.category.categoryType}`}
                >
                  <div>
                    <div className="text-sm ">{ranking.category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ranking.category.timeframe.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="">#{ranking.rank}</div>
                    <div className="text-xs text-muted-foreground">
                      of {formatNumber(ranking.totalUsers)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {userRankings.length > 6 && (
              <div className="mt-3 text-center">
                <Badge variant="outline">
                  +{userRankings.length - 6} more categories
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      {categories && categories.length > 0 && (
        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="space-y-6">
          <LeaderboardTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
          />

          {/* Leaderboard Content */}
          <TabsContent value={activeCategory} className="space-y-4">
            {currentLeaderboard && (
              <>
                {/* Category Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className=" text-lg">{currentLeaderboard.category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(currentLeaderboard.totalParticipants)} participants • 
                          Last updated: {new Date(currentLeaderboard.lastUpdated).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {getUserRankInActiveCategory() && (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Your Rank</div>
                          <div className="text-2xl  text-primary">
                            #{getUserRankInActiveCategory()?.rank}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top 3 Traders Highlight */}
                {currentLeaderboard.entries.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentLeaderboard.entries.slice(0, 3).map((entry, index) => (
                      <TraderStatsCard 
                        key={entry.userId}
                        entry={entry}
                        variant={index === 0 ? 'detailed' : 'compact'}
                        showDetailedStats={index === 0}
                      />
                    ))}
                  </div>
                )}

                {/* Full Leaderboard Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Full Rankings</span>
                      <Badge variant="outline">
                        {currentLeaderboard.entries.length} traders
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LeaderboardTable 
                      entries={currentLeaderboard.entries}
                      loading={leaderboardLoading}
                      sortable={true}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                <div className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 bg-slate-800/50 rounded-lg animate-pulse" />
                  ))}
                </div>
                <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse" />
              </div>
            )}

            {/* No Data State */}
            {!isLoading && (!currentLeaderboard || currentLeaderboard.entries.length === 0) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg  mb-2">No Rankings Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to start trading and appear on this leaderboard!
                  </p>
                  <Button className="flex items-center gap-2">
                    Start Trading
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Recent Achievements */}
      {overview?.recentAchievements && overview.recentAchievements.length > 0 && (
        <Card data-testid="recent-achievements">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.recentAchievements.slice(0, 5).map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  data-testid={`recent-achievement-${achievement.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <span className="">
                        {achievement.user.firstName && achievement.user.lastName 
                          ? `${achievement.user.firstName} ${achievement.user.lastName}` 
                          : achievement.user.email?.split('@')[0] || 'Anonymous'
                        }
                      </span>
                      <span className="text-muted-foreground"> earned </span>
                      <span className=" text-primary">{achievement.title}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.unlockedAt 
                      ? new Date(achievement.unlockedAt).toLocaleDateString()
                      : 'Recently'
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}