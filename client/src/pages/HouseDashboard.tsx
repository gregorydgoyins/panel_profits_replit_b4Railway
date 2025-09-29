import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, TrendingUp, Award, Crown, Star, Target,
  BarChart3, DollarSign, Calendar, Info, Trophy,
  Zap, Shield, BookOpen, Flame, Clock, ArrowUp,
  ArrowDown, Minus, Medal, Gift, Timer
} from 'lucide-react';
import { useUserHouseStatus, useHouseMembers, useHouseBonuses } from '@/hooks/useHouses';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

export default function HouseDashboard() {
  const [location, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  const { data: userHouseStatus, isLoading: statusLoading } = useUserHouseStatus();
  const { data: houseMembers, isLoading: membersLoading } = useHouseMembers(
    userHouseStatus?.house?.id || '', 
    20
  );
  const { data: houseBonuses, isLoading: bonusesLoading } = useHouseBonuses(
    userHouseStatus?.house?.id || ''
  );
  
  const { getCurrentHouseColorClass } = useHouseTheme();

  if (statusLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!userHouseStatus?.hasHouse) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No House Membership</h3>
            <p className="text-muted-foreground mb-4">
              You haven't joined a house yet. Join one to access exclusive trading bonuses and features.
            </p>
            <Button onClick={() => setLocation('/houses')} data-testid="button-join-house">
              Choose Your House
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const house = userHouseStatus.house!;
  const currentUser = houseMembers?.members.find(m => m.rank === house.userRank);

  const formatBonus = (key: string, value: any) => {
    if (typeof value === 'number') {
      if (key.includes('Fee') || key.includes('Multiplier')) {
        return `${Math.round((1 - value) * 100)}%`;
      }
      if (key.includes('Limit')) {
        return `${value}x`;
      }
      return `+${Math.round(value * 100)}%`;
    }
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    if (Array.isArray(value)) {
      return `${value.length} perks`;
    }
    return value.toString();
  };

  const getPerformanceIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'Character Assets': return Shield;
      case 'Creator Assets': return BookOpen;
      case 'Publisher Assets': return Crown;
      case 'Rare Assets': return Zap;
      case 'Multi-Universe Assets': return Flame;
      case 'Historical Assets': return Clock;
      case 'Social Assets': return Users;
      default: return Star;
    }
  };

  const SpecIcon = getSpecializationIcon(house.specialization);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HouseEmblem 
            house={house.id as MythologicalHouse}
            size="xl"
            variant="solid"
          />
          <div>
            <h1 className="text-3xl font-bold">{house.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SpecIcon className="h-4 w-4" />
              <span>{house.specialization}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">#{house.userRank}</div>
          <div className="text-sm text-muted-foreground">Your Rank</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{house.userKarma}</div>
                <div className="text-sm text-muted-foreground">Your Karma</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{house.karmaMultiplier}x</div>
                <div className="text-sm text-muted-foreground">Karma Multiplier</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{houseMembers?.memberCount || 0}</div>
                <div className="text-sm text-muted-foreground">House Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {currentUser?.tradingStreakDays || 0}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bonuses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bonuses" data-testid="tab-bonuses">House Bonuses</TabsTrigger>
          <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* House Bonuses Tab */}
        <TabsContent value="bonuses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Active House Bonuses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bonusesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(house.bonuses).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      data-testid={`bonus-${key}`}
                    >
                      <div>
                        <div className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active bonus from your house
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        {formatBonus(key, value)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bonus Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {houseBonuses?.userKarma || house.userKarma}
                    </div>
                    <div className="text-sm text-muted-foreground">Base Karma</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {house.karmaMultiplier}x
                    </div>
                    <div className="text-sm text-muted-foreground">House Multiplier</div>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {Math.round((houseBonuses?.userKarma || house.userKarma) * house.karmaMultiplier)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Karma Power</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                House Leaderboard
              </CardTitle>
              <div className="flex gap-2">
                {['week', 'month', 'all'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period as any)}
                    data-testid={`button-period-${period}`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {houseMembers?.members.map((member, index) => (
                    <div 
                      key={member.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        member.rank === house.userRank 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      data-testid={`member-${member.rank}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          <span className="font-bold text-sm">#{member.rank}</span>
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.tradingStreakDays} day streak
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold">{member.karma} karma</div>
                        <div className="text-sm text-muted-foreground">
                          ${member.totalTradingProfit.toLocaleString()} profit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Profit</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      ${currentUser?.totalTradingProfit.toLocaleString() || 0}
                    </span>
                    {getPerformanceIcon(5.2)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Current Streak</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {currentUser?.tradingStreakDays || 0} days
                    </span>
                    <Timer className="h-3 w-3 text-primary" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>House Rank</span>
                  <span className="font-bold">#{house.userRank}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Members</span>
                  <span className="font-bold">{houseMembers?.memberCount || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Avg. Member Karma</span>
                  <span className="font-bold">
                    {houseMembers?.members.length 
                      ? Math.round(houseMembers.members.reduce((sum, m) => sum + m.karma, 0) / houseMembers.members.length)
                      : 0
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Specialization</span>
                  <HouseBadge house={house.id as MythologicalHouse} size="sm" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                House Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>House achievements coming soon!</p>
                <p className="text-sm">Complete trading challenges to unlock special rewards.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}