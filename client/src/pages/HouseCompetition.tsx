import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Users, TrendingUp, Zap, Crown, Award,
  BarChart3, Target, Star, Shield, Swords,
  Flame, ArrowUp, ArrowDown, Medal, Calendar
} from 'lucide-react';
import { useHouses, useUserHouseStatus, useHouseLeaderboard } from '@/hooks/useHouses';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface HouseCompetitionData {
  house: string;
  name: string;
  specialization: string;
  totalMembers: number;
  totalKarma: number;
  avgKarmaPerMember: number;
  weeklyGrowth: number;
  topTraderKarma: number;
  competitionRank: number;
  achievements: number;
}

export default function HouseCompetition() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'season'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'karma' | 'growth' | 'members'>('karma');
  
  const { data: housesData, isLoading: housesLoading } = useHouses();
  const { data: userHouseStatus } = useUserHouseStatus();
  const { data: leaderboardData, isLoading: leaderboardLoading } = useHouseLeaderboard(selectedMetric, selectedPeriod);
  
  const houses = housesData?.houses || [];
  const isLoading = housesLoading || leaderboardLoading;
  
  // Use real API data instead of mock data
  const competitionData: HouseCompetitionData[] = leaderboardData?.leaderboard?.map(house => ({
    house: house.house,
    name: house.name,
    specialization: house.specialization,
    totalMembers: house.totalMembers,
    totalKarma: house.totalKarma,
    avgKarmaPerMember: house.avgKarmaPerMember,
    weeklyGrowth: house.weeklyGrowth,
    topTraderKarma: house.topTraderKarma,
    competitionRank: house.competitionRank,
    achievements: house.achievements,
  })) || [];

  const sortedHouses = competitionData; // Already sorted by API

  const userHouse = userHouseStatus?.house?.id;
  const userHouseData = competitionData.find(h => h.house === userHouse);

  const getMetricValue = (house: HouseCompetitionData, metric: string) => {
    switch (metric) {
      case 'karma':
        return house.totalKarma.toLocaleString();
      case 'growth':
        return `${house.weeklyGrowth > 0 ? '+' : ''}${house.weeklyGrowth.toFixed(1)}%`;
      case 'members':
        return house.totalMembers.toLocaleString();
      default:
        return '';
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (growth < 0) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Target className="h-3 w-3 text-muted-foreground" />;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Inter-House Competition</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how all houses stack up against each other in trading performance, 
          member growth, and community achievements.
        </p>
      </div>

      {/* User House Summary */}
      {userHouseData && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HouseEmblem house={userHouse as MythologicalHouse} size="lg" />
              Your House Performance
              <HouseBadge house={userHouse as MythologicalHouse} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  #{userHouseData.competitionRank}
                </div>
                <div className="text-sm text-muted-foreground">Overall Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userHouseData.totalKarma.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Karma</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userHouseData.totalMembers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  {getGrowthIcon(userHouseData.weeklyGrowth)}
                  {userHouseData.weeklyGrowth.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Weekly Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competition Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          {['week', 'month', 'season'].map((period) => (
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
        
        <div className="flex gap-2">
          {[
            { key: 'karma', label: 'Total Karma', icon: Trophy },
            { key: 'growth', label: 'Growth Rate', icon: TrendingUp },
            { key: 'members', label: 'Member Count', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={selectedMetric === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric(key as any)}
              data-testid={`button-metric-${key}`}
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Competition Tabs */}
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">House Rankings</TabsTrigger>
          <TabsTrigger value="comparison" data-testid="tab-comparison">Head-to-Head</TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">Competition Events</TabsTrigger>
        </TabsList>

        {/* House Rankings Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid gap-4">
            {sortedHouses.map((house, index) => {
              const actualRank = index + 1;
              const isUserHouse = house.house === userHouse;
              
              return (
                <Card 
                  key={house.house}
                  className={`transition-all duration-200 ${
                    isUserHouse ? 'border-primary bg-primary/5' : 'hover-elevate'
                  }`}
                  data-testid={`house-rank-${house.house}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(actualRank)}
                          <HouseEmblem 
                            house={house.house as MythologicalHouse}
                            size="lg"
                            variant="solid"
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{house.name}</h3>
                            {isUserHouse && (
                              <Badge variant="outline" className="text-xs">Your House</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{house.specialization}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold">
                          {getMetricValue(house, selectedMetric)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {house.totalMembers.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(house.weeklyGrowth)}
                            {house.weeklyGrowth.toFixed(1)}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {house.achievements}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Head-to-Head Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitionData.map((houseData) => {
              return (
                <Card key={houseData.house} className="hover-elevate" data-testid={`comparison-card-${houseData.house}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <HouseEmblem 
                        house={houseData.house as MythologicalHouse}
                        size="default"
                        variant="solid"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{houseData.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{houseData.specialization}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total Karma</div>
                        <div className="font-bold">{houseData.totalKarma.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Members</div>
                        <div className="font-bold">{houseData.totalMembers.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg. Karma</div>
                        <div className="font-bold">{houseData.avgKarmaPerMember}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Growth</div>
                        <div className="flex items-center gap-1 font-bold">
                          {getGrowthIcon(houseData.weeklyGrowth)}
                          {houseData.weeklyGrowth.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Performance vs. Average</div>
                      <Progress 
                        value={Math.min(100, (houseData.totalKarma / 30000) * 100)} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Competition Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming House Competitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Trading Challenge</h4>
                    <p className="text-sm text-muted-foreground">Compete for the highest trading volume</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">3 days left</div>
                    <div className="text-sm text-muted-foreground">Ends Sunday</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Karma Growth Contest</h4>
                    <p className="text-sm text-muted-foreground">Which house gains the most karma this month?</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">12 days left</div>
                    <div className="text-sm text-muted-foreground">Monthly event</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                  <div>
                    <h4 className="font-medium">House Unity Tournament</h4>
                    <p className="text-sm text-muted-foreground">Team-based trading competition</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Coming Soon</div>
                    <div className="text-sm text-muted-foreground">Next season</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Last Week's Trading Champion</span>
                  <HouseBadge house="mystery" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Fastest Growing House</span>
                  <HouseBadge house="spirit" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Most Active Community</span>
                  <HouseBadge house="heroes" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}