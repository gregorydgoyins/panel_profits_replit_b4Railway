import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Sparkles, Crown, Trophy, Star, Clock, Users, Zap,
  Eye, Scroll, Gem, Flame, Shield, Target, CheckCircle, Lock,
  ArrowRight, PlayCircle, Award, Compass, Map, Brain, Heart,
  Sword, Magic, Feather, ChevronRight, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { useUserHouseStatus } from '@/hooks/useHouses';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface LearningPath {
  id: string;
  name: string;
  description: string;
  houseId: string;
  specialization: string;
  difficultyLevel: 'initiate' | 'adept' | 'master' | 'grandmaster';
  prerequisites: string[];
  estimatedHours: number;
  experienceReward: number;
  karmaReward: number;
  sacredTitle: string;
  mysticalDescription: string;
  pathIcon: string;
  pathColor: string;
  lessonSequence: string[];
  unlockConditions: any;
  completionRewards: any;
  isActive: boolean;
  displayOrder: number;
}

interface UserProgress {
  id: string;
  pathId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  progressPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  experienceEarned: number;
  karmaEarned: number;
  lastAccessedAt: string;
}

interface MysticalSkill {
  id: string;
  name: string;
  description: string;
  houseId: string;
  skillCategory: string;
  skillType: string;
  tier: number;
  rarityLevel: 'common' | 'rare' | 'epic' | 'legendary';
  tradingBonuses: any;
  prerequisites: any;
  sacredName: string;
  mysticalAura: string;
  isActive: boolean;
}

interface UserSkillUnlock {
  id: string;
  skillId: string;
  unlockMethod: string;
  masteryLevel: number;
  effectivenessBonus: number;
  unlockedAt: string;
}

interface LearningDashboard {
  overallProgress: {
    totalPaths: number;
    completedPaths: number;
    inProgressPaths: number;
    totalExperience: number;
    totalKarma: number;
    currentLevel: number;
    nextLevelProgress: number;
  };
  houseProgress: Record<string, {
    pathsAvailable: number;
    pathsCompleted: number;
    specialtyMastery: number;
    unlockedSkills: number;
    totalSkills: number;
  }>;
  recentAchievements: Array<{
    id: string;
    type: 'lesson' | 'skill' | 'path' | 'trial' | 'certification';
    title: string;
    description: string;
    earnedAt: string;
    rarity: string;
  }>;
  recommendations: Array<{
    id: string;
    type: 'path' | 'lesson' | 'skill';
    title: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function SacredLibrary() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'skills' | 'achievements'>('overview');
  const [selectedHouse, setSelectedHouse] = useState<MythologicalHouse | 'all'>('all');
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  
  const { user } = useAuth();
  const { currentHouse, allHouses, getHouseTheme } = useHouseTheme();
  const { data: userHouseStatus } = useUserHouseStatus();

  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Fetch learning dashboard data
  const { data: dashboard, isLoading: dashboardLoading } = useQuery<LearningDashboard>({
    queryKey: ['/api/learning/dashboard'],
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch learning paths
  const { data: learningPaths, isLoading: pathsLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning/paths', selectedHouse !== 'all' ? { houseId: selectedHouse } : {}],
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user progress
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/learning/progress/lessons'],
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Fetch mystical skills
  const { data: mysticalSkills, isLoading: skillsLoading } = useQuery<MysticalSkill[]>({
    queryKey: ['/api/learning/skills', selectedHouse !== 'all' ? { houseId: selectedHouse } : {}],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user skill unlocks
  const { data: userSkills, isLoading: userSkillsLoading } = useQuery<UserSkillUnlock[]>({
    queryKey: ['/api/learning/progress/skills'],
    enabled: !!user,
    staleTime: 1 * 60 * 1000,
  });

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'initiate': return Feather;
      case 'adept': return Sword;
      case 'master': return Crown;
      case 'grandmaster': return Gem;
      default: return Star;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'initiate': return 'text-green-400';
      case 'adept': return 'text-blue-400';
      case 'master': return 'text-purple-400';
      case 'grandmaster': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSkillRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 text-gray-400';
      case 'rare': return 'border-blue-500 text-blue-400';
      case 'epic': return 'border-purple-500 text-purple-400';
      case 'legendary': return 'border-yellow-500 text-yellow-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const getProgressForPath = (pathId: string): UserProgress | undefined => {
    return userProgress?.find(p => p.pathId === pathId);
  };

  const isSkillUnlocked = (skillId: string): boolean => {
    return userSkills?.some(us => us.skillId === skillId) || false;
  };

  if (dashboardLoading || !dashboard) {
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Sacred Library Header */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-lg blur-xl"
          style={{
            transform: `rotate(${mysticalEnergy * 0.1}deg)`,
            opacity: 0.3 + Math.sin(mysticalEnergy * 0.05) * 0.2
          }}
        />
        <Card className="relative border-primary/20 bg-gradient-to-br from-background via-background/95 to-primary/5">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <BookOpen className="h-12 w-12 text-primary animate-pulse" />
                <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Sacred Library of Knowledge
                </CardTitle>
                <p className="text-xl text-muted-foreground mt-2">
                  Ancient Trading Wisdom of the Seven Houses
                </p>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{dashboard.overallProgress.totalExperience.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Experience Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{dashboard.overallProgress.totalKarma.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Karma Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{dashboard.overallProgress.completedPaths}</div>
                <div className="text-sm text-muted-foreground">Paths Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{dashboard.overallProgress.currentLevel}</div>
                <div className="text-sm text-muted-foreground">Mystic Level</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Level {dashboard.overallProgress.currentLevel} Progress</span>
                <span className="text-sm text-primary">{Math.round(dashboard.overallProgress.nextLevelProgress)}%</span>
              </div>
              <Progress value={dashboard.overallProgress.nextLevelProgress} className="h-3" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* House Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Choose Your Realm:</span>
        <Button
          variant={selectedHouse === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedHouse('all')}
          data-testid="filter-all-houses"
        >
          <Compass className="h-4 w-4 mr-2" />
          All Realms
        </Button>
        {allHouses.map((house) => (
          <Button
            key={house.id}
            variant={selectedHouse === house.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedHouse(house.id)}
            data-testid={`filter-house-${house.id}`}
            className="gap-2"
          >
            <HouseEmblem house={house.id} size="sm" variant="ghost" showTooltip={false} />
            {house.name}
          </Button>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <Map className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="paths" data-testid="tab-paths">
            <BookOpen className="h-4 w-4 mr-2" />
            Sacred Paths
          </TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">
            <Zap className="h-4 w-4 mr-2" />
            Mystical Skills
          </TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* House Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(dashboard.houseProgress).map(([houseId, progress]) => {
              const house = getHouseTheme(houseId as MythologicalHouse);
              return (
                <Card key={houseId} className="hover-elevate cursor-pointer border-house-current-border/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <HouseEmblem house={houseId as MythologicalHouse} size="default" />
                      <div>
                        <h3 className="font-semibold text-sm">{house.name}</h3>
                        <p className="text-xs text-muted-foreground">{house.mythology}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Paths:</span>
                        <span className="text-primary">{progress.pathsCompleted}/{progress.pathsAvailable}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Skills:</span>
                        <span className="text-accent">{progress.unlockedSkills}/{progress.totalSkills}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Mastery:</span>
                          <span>{Math.round(progress.specialtyMastery)}%</span>
                        </div>
                        <Progress value={progress.specialtyMastery} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recommendations */}
          {dashboard.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Cosmic Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboard.recommendations.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`p-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Achievements */}
          {dashboard.recentAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Recent Triumphs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.recentAchievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getSkillRarityColor(achievement.rarity)} bg-opacity-20`}>
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className={getSkillRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sacred Paths Tab */}
        <TabsContent value="paths" className="space-y-6">
          {pathsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths?.map((path) => {
                const progress = getProgressForPath(path.id);
                const DifficultyIcon = getDifficultyIcon(path.difficultyLevel);
                const house = getHouseTheme(path.houseId as MythologicalHouse);
                
                return (
                  <Card key={path.id} className="hover-elevate cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <HouseEmblem house={path.houseId as MythologicalHouse} size="sm" />
                            <Badge className={getDifficultyColor(path.difficultyLevel)}>
                              <DifficultyIcon className="h-3 w-3 mr-1" />
                              {path.difficultyLevel}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight">{path.sacredTitle || path.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {path.mysticalDescription || path.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <div className="space-y-3">
                        {/* Progress */}
                        {progress && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress:</span>
                              <span className="text-primary">{Math.round(progress.progressPercent)}%</span>
                            </div>
                            <Progress value={progress.progressPercent} className="h-2" />
                          </div>
                        )}
                        
                        {/* Rewards */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" />
                            <span>{path.experienceReward} XP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-accent" />
                            <span>{path.karmaReward} Karma</span>
                          </div>
                        </div>
                        
                        {/* Lessons */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Scroll className="h-4 w-4" />
                          <span>{path.lessonSequence.length} Sacred Lessons</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{path.estimatedHours}h</span>
                        </div>
                        
                        {/* Action */}
                        <Button 
                          className="w-full mt-4" 
                          onClick={() => setLocation(`/learning/path/${path.id}`)}
                          data-testid={`start-path-${path.id}`}
                        >
                          {progress && progress.status === 'in_progress' ? (
                            <>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Continue Journey
                            </>
                          ) : progress && progress.status === 'completed' ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Review Mastery
                            </>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Begin Path
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Mystical Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          {skillsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mysticalSkills?.map((skill) => {
                const unlocked = isSkillUnlocked(skill.id);
                
                return (
                  <Card 
                    key={skill.id} 
                    className={`hover-elevate relative overflow-hidden ${
                      unlocked ? 'border-primary/30' : 'border-muted opacity-75'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${getSkillRarityColor(skill.rarityLevel)}`} />
                    
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <HouseEmblem house={skill.houseId as MythologicalHouse} size="sm" />
                            <Badge variant="outline" className={getSkillRarityColor(skill.rarityLevel)}>
                              {skill.rarityLevel}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight flex items-center gap-2">
                            {unlocked ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            )}
                            {skill.sacredName || skill.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Gem className="h-4 w-4 text-purple-400" />
                          <span>Tier {skill.tier}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="capitalize">{skill.skillCategory}</span>
                        </div>
                        
                        {skill.mysticalAura && (
                          <div className="text-xs text-accent italic">
                            "{skill.mysticalAura}"
                          </div>
                        )}
                        
                        {unlocked ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setLocation(`/learning/skill/${skill.id}`)}
                            data-testid={`view-skill-${skill.id}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Mastery
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            disabled
                            data-testid={`locked-skill-${skill.id}`}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Recent Triumphs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard.recentAchievements.length > 0 ? (
                  <div className="space-y-4">
                    {dashboard.recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`p-2 rounded-full ${getSkillRarityColor(achievement.rarity)} bg-opacity-20`}>
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={getSkillRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No achievements yet. Begin your journey to earn legendary recognition!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progress Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Completion:</span>
                      <span className="text-primary">
                        {Math.round((dashboard.overallProgress.completedPaths / dashboard.overallProgress.totalPaths) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(dashboard.overallProgress.completedPaths / dashboard.overallProgress.totalPaths) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{dashboard.overallProgress.currentLevel}</div>
                      <div className="text-sm text-muted-foreground">Current Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{dashboard.overallProgress.inProgressPaths}</div>
                      <div className="text-sm text-muted-foreground">Active Paths</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}