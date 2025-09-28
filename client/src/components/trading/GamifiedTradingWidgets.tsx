import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Target, Crown, Flame, Zap, 
  Shield, Swords, TrendingUp, Award, Users,
  Sparkles, BarChart3, Activity, DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { HouseBadge } from '@/components/ui/house-badge';

interface TradingAchievement {
  id: string;
  title: string;
  description: string;
  category: 'trading' | 'battle' | 'discovery' | 'social';
  difficulty: 'bronze' | 'silver' | 'gold' | 'legendary';
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  rewards: string[];
  icon: string;
}

interface BattleNotification {
  id: string;
  type: 'victory' | 'defeat' | 'draw';
  characterName: string;
  opponent: string;
  marketImpact: number;
  portfolioEffect: number;
  timestamp: string;
  isRead: boolean;
}

interface TradingStreak {
  currentStreak: number;
  bestStreak: number;
  streakMultiplier: number;
  nextMilestone: number;
  bonusActive: boolean;
}

interface HouseRanking {
  rank: number;
  totalMembers: number;
  housePerformance: number;
  weeklyChange: number;
  specializations: string[];
  achievements: number;
}

export function GamifiedTradingWidgets() {
  const { user } = useAuth();
  const { houseTheme, currentHouse, getCurrentHouseColorClass } = useHouseTheme();
  const [selectedNotification, setSelectedNotification] = useState<BattleNotification | null>(null);

  // Fetch user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/user/achievements', user?.id],
    queryFn: () => fetch(`/api/user/achievements`).then(res => res.json()),
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Fetch battle notifications
  const { data: battleNotifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/user/battle-notifications', user?.id],
    queryFn: () => fetch('/api/user/battle-notifications').then(res => res.json()),
    enabled: !!user,
    refetchInterval: 15000,
  });

  // Fetch trading streak
  const { data: tradingStreak, isLoading: streakLoading } = useQuery({
    queryKey: ['/api/user/trading-streak', user?.id],
    queryFn: () => fetch('/api/user/trading-streak').then(res => res.json()),
    enabled: !!user,
    refetchInterval: 60000,
  });

  // Fetch house ranking
  const { data: houseRanking, isLoading: rankingLoading } = useQuery({
    queryKey: ['/api/houses/ranking', currentHouse],
    queryFn: () => fetch(`/api/houses/ranking/${currentHouse}`).then(res => res.json()),
    enabled: !!currentHouse,
    refetchInterval: 120000,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'text-orange-600 bg-orange-900/20 border-orange-500/30';
      case 'silver': return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      case 'gold': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'legendary': return 'text-purple-400 bg-purple-900/20 border-purple-500/30';
      default: return 'text-slate-400 bg-slate-900/20 border-slate-500/30';
    }
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'trading': return <DollarSign className="h-4 w-4" />;
      case 'battle': return <Swords className="h-4 w-4" />;
      case 'discovery': return <Target className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="space-y-6" data-testid="gamified-trading-widgets">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Legendary Achievements
            </h2>
            <p className="text-slate-400 mt-1">
              Track your trading mastery • {achievements?.completed || 0} of {achievements?.total || 0} unlocked
            </p>
          </div>
          <HouseBadge size="lg" variant="soft" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements Panel */}
        <Card className="lg:col-span-2 bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-700 h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {achievements?.data?.map((achievement: TradingAchievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.isCompleted
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-slate-700/30 border-slate-600/50'
                    } hover:bg-slate-700/50 hover-elevate`}
                    data-testid={`achievement-${achievement.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${getDifficultyColor(achievement.difficulty)}`}>
                        {getAchievementIcon(achievement.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{achievement.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getDifficultyColor(achievement.difficulty)}`}
                          >
                            {achievement.difficulty.toUpperCase()}
                          </Badge>
                          {achievement.isCompleted && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">
                          {achievement.description}
                        </p>
                        
                        {!achievement.isCompleted && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white">
                                {achievement.progress} / {achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100}
                              className="h-2"
                            />
                          </div>
                        )}

                        {achievement.rewards.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-slate-400">Rewards:</span>
                            {achievement.rewards.map((reward, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Trading Streak */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-orange-400" />
                Trading Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              {streakLoading ? (
                <div className="animate-pulse bg-slate-700 h-24 rounded" />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">
                      {tradingStreak?.currentStreak || 0}
                    </div>
                    <div className="text-sm text-slate-400">Current Streak</div>
                    {tradingStreak?.bonusActive && (
                      <Badge className="mt-2 bg-orange-600">
                        <Zap className="h-3 w-3 mr-1" />
                        Bonus Active!
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="text-slate-400">Best Streak</div>
                      <div className="font-semibold text-white">
                        {tradingStreak?.bestStreak || 0}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400">Multiplier</div>
                      <div className="font-semibold text-green-400">
                        {tradingStreak?.streakMultiplier?.toFixed(2) || '1.00'}x
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Next Milestone</span>
                      <span className="text-white">{tradingStreak?.nextMilestone || 10}</span>
                    </div>
                    <Progress 
                      value={((tradingStreak?.currentStreak || 0) / (tradingStreak?.nextMilestone || 10)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* House Ranking */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-yellow-400" />
                House Standing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankingLoading ? (
                <div className="animate-pulse bg-slate-700 h-32 rounded" />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      #{houseRanking?.rank || 1}
                    </div>
                    <div className="text-sm text-slate-400">
                      of 7 Houses
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Members</span>
                      <span className="text-white">{houseRanking?.totalMembers || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Performance</span>
                      <span className="text-green-400">
                        {houseRanking?.housePerformance?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Weekly Change</span>
                      <span className={`flex items-center gap-1 ${
                        (houseRanking?.weeklyChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <TrendingUp className="h-3 w-3" />
                        {houseRanking?.weeklyChange?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${getCurrentHouseColorClass()}`}
                    size="sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View House Leaderboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Battle Notifications */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-red-400" />
                Battle Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-700 h-12 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {battleNotifications?.data?.slice(0, 5).map((notification: BattleNotification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded border cursor-pointer hover-elevate transition-colors ${
                        notification.isRead 
                          ? 'bg-slate-700/20 border-slate-600/30' 
                          : 'bg-blue-900/20 border-blue-500/30'
                      }`}
                      onClick={() => setSelectedNotification(notification)}
                      data-testid={`battle-notification-${notification.id}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1 rounded ${
                          notification.type === 'victory' 
                            ? 'bg-green-900/20 text-green-400' 
                            : notification.type === 'defeat'
                            ? 'bg-red-900/20 text-red-400'
                            : 'bg-yellow-900/20 text-yellow-400'
                        }`}>
                          {notification.type === 'victory' ? (
                            <Trophy className="h-3 w-3" />
                          ) : notification.type === 'defeat' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <Target className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-white">
                            {notification.characterName} vs {notification.opponent}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Portfolio impact: {notification.portfolioEffect > 0 ? '+' : ''}{notification.portfolioEffect.toFixed(2)}%
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!battleNotifications?.data || battleNotifications.data.length === 0) && (
                    <div className="text-center py-6 text-slate-400">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent battle activity</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}