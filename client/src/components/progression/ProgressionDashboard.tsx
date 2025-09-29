import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  BookOpen, 
  Star, 
  Target, 
  TrendingUp, 
  Award, 
  Zap,
  Crown,
  Shield,
  Gem,
  Swords,
  Clock,
  Heart,
  Eye
} from "lucide-react";

// ============================================================================
// PROGRESSION DASHBOARD COMPONENT - COMIC COLLECTION MECHANICS
// ============================================================================

interface ProgressionDashboardData {
  progressionStatus: {
    overallProgressionTier: number;
    progressionTitle: string;
    totalCollectionValue: string;
    totalIssuesOwned: number;
    totalVariantsOwned: number;
    standardCoversOwned: number;
    variantCoversOwned: number;
    rareVariantsOwned: number;
    ultraRareVariantsOwned: number;
    legendaryVariantsOwned: number;
    firstAppearancesOwned: number;
    deathIssuesOwned: number;
    resurrectionIssuesOwned: number;
    keyStorylineIssuesOwned: number;
    crossoverIssuesOwned: number;
    maxTradingTier: number;
    tradingToolsUnlocked: string[];
  };
  collections: any[];
  achievements: any[];
  houseProgressions: any[];
  tradingUnlocks: any[];
  activeChallenges: any[];
  summary: {
    totalCollectionValue: number;
    progressionTier: number;
    progressionTitle: string;
    totalAchievements: number;
    unlockedTradingTools: number;
    activeHouses: number;
  };
}

const ProgressionDashboard = () => {
  const { data: dashboardData, isLoading, error, refetch } = useQuery<ProgressionDashboardData>({
    queryKey: ["/api/progression/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1: return <BookOpen className="h-6 w-6" />;
      case 2: return <Target className="h-6 w-6" />;
      case 3: return <Star className="h-6 w-6" />;
      case 4: return <Crown className="h-6 w-6" />;
      case 5: return <Trophy className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "bg-slate-500";
      case 2: return "bg-blue-500";
      case 3: return "bg-purple-500";
      case 4: return "bg-amber-500";
      case 5: return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const getHouseIcon = (houseId: string) => {
    switch (houseId.toLowerCase()) {
      case 'heroes': return <Shield className="h-5 w-5" />;
      case 'wisdom': return <Eye className="h-5 w-5" />;
      case 'power': return <Zap className="h-5 w-5" />;
      case 'mystery': return <Star className="h-5 w-5" />;
      case 'elements': return <Gem className="h-5 w-5" />;
      case 'time': return <Clock className="h-5 w-5" />;
      case 'spirit': return <Heart className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(typeof value === 'string' ? parseFloat(value) : value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-destructive">Failed to load progression data</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { progressionStatus, summary, houseProgressions, achievements, tradingUnlocks, activeChallenges } = dashboardData!;

  return (
    <div className="space-y-6" data-testid="progression-dashboard">
      {/* Progression Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Tier</CardTitle>
            <div className={`p-2 rounded-full ${getTierColor(summary.progressionTier)}`}>
              {getTierIcon(summary.progressionTier)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-progression-tier">
              Tier {summary.progressionTier}
            </div>
            <p className="text-xs text-muted-foreground" data-testid="text-progression-title">
              {summary.progressionTitle}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-collection-value">
              {formatCurrency(summary.totalCollectionValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {progressionStatus?.totalIssuesOwned || 0} issues owned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-achievements-count">
              {summary.totalAchievements}
            </div>
            <p className="text-xs text-muted-foreground">
              {achievements.filter(a => a.tier === 'legendary').length} legendary
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trading Tools</CardTitle>
            <Swords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-trading-tools-count">
              {summary.unlockedTradingTools}
            </div>
            <p className="text-xs text-muted-foreground">
              Max tier {progressionStatus?.maxTradingTier || 1}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progression Tabs */}
      <Tabs defaultValue="collection" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="collection" data-testid="tab-collection">Collection</TabsTrigger>
          <TabsTrigger value="houses" data-testid="tab-houses">Houses</TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
          <TabsTrigger value="trading" data-testid="tab-trading">Trading</TabsTrigger>
          <TabsTrigger value="challenges" data-testid="tab-challenges">Challenges</TabsTrigger>
        </TabsList>

        {/* Collection Tab */}
        <TabsContent value="collection" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Collection Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Standard Covers</span>
                    <Badge variant="secondary" data-testid="badge-standard-covers">
                      {progressionStatus?.standardCoversOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Variant Covers (1:10)</span>
                    <Badge variant="outline" data-testid="badge-variant-covers">
                      {progressionStatus?.variantCoversOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rare Variants (1:25)</span>
                    <Badge variant="secondary" data-testid="badge-rare-variants">
                      {progressionStatus?.rareVariantsOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ultra-Rare (1:100)</span>
                    <Badge variant="default" data-testid="badge-ultra-rare">
                      {progressionStatus?.ultraRareVariantsOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Legendary (1:1000)</span>
                    <Badge variant="destructive" data-testid="badge-legendary">
                      {progressionStatus?.legendaryVariantsOwned || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Key Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">First Appearances</span>
                    <Badge variant="secondary" data-testid="badge-first-appearances">
                      {progressionStatus?.firstAppearancesOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Death Issues</span>
                    <Badge variant="outline" data-testid="badge-death-issues">
                      {progressionStatus?.deathIssuesOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resurrection Issues</span>
                    <Badge variant="secondary" data-testid="badge-resurrection-issues">
                      {progressionStatus?.resurrectionIssuesOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Key Storylines</span>
                    <Badge variant="default" data-testid="badge-key-storylines">
                      {progressionStatus?.keyStorylineIssuesOwned || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Crossover Events</span>
                    <Badge variant="destructive" data-testid="badge-crossover-events">
                      {progressionStatus?.crossoverIssuesOwned || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value="houses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {houseProgressions.map((house: any) => (
              <Card key={house.houseId} data-testid={`card-house-${house.houseId}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getHouseIcon(house.houseId)}
                    {house.houseId.charAt(0).toUpperCase() + house.houseId.slice(1)} House
                  </CardTitle>
                  <CardDescription>Level {house.currentLevel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Experience</span>
                      <span>{house.experiencePoints} / {house.nextLevelRequiredXP}</span>
                    </div>
                    <Progress 
                      value={house.progressionPercentage || 0} 
                      className="h-2"
                      data-testid={`progress-house-${house.houseId}`}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total XP: {house.totalXPEarned || 0}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {achievements.slice(0, 10).map((achievement: any) => (
                <Card key={achievement.id} data-testid={`card-achievement-${achievement.achievementId}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={achievement.tier === 'legendary' ? 'destructive' : 'secondary'}>
                          {achievement.tier}
                        </Badge>
                        <span className="text-sm font-medium">+{achievement.points}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Trading Tools Tab */}
        <TabsContent value="trading" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tradingUnlocks.map((tool: any) => (
              <Card key={tool.id} data-testid={`card-trading-tool-${tool.toolName}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Swords className="h-5 w-5" />
                      {tool.toolName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                    <Badge variant={tool.isUnlocked ? 'default' : 'secondary'}>
                      {tool.isUnlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{tool.toolDescription}</CardDescription>
                </CardHeader>
                {tool.isUnlocked && (
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Benefits:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tool.toolBenefits?.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1 w-1 bg-current rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          {activeChallenges.length > 0 ? (
            <div className="space-y-4">
              {activeChallenges.map((challenge: any) => (
                <Card key={challenge.id} data-testid={`card-challenge-${challenge.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {challenge.challengeTitle}
                      </span>
                      <Badge variant="outline">{challenge.challengeType}</Badge>
                    </CardTitle>
                    <CardDescription>{challenge.challengeDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>0 / {challenge.targetValue}</span>
                      </div>
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Ends: {new Date(challenge.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No active challenges</p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for new collection challenges!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressionDashboard;