import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, BookOpen, Crown, Zap, Flame, Clock, Users, Sword, 
  Target, Eye, Brain, Mountain, Compass, Waves, Star, Sun,
  Trophy, Scroll, Gem, PlayCircle, CheckCircle, Lock, Sparkles,
  ArrowRight, TrendingUp, BarChart3, Activity, Layers, Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface HouseTrainingGroundsProps {
  houseId: MythologicalHouse;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  sacredTitle: string;
  mysticalDescription: string;
  difficultyLevel: string;
  estimatedHours: number;
  experienceReward: number;
  karmaReward: number;
  lessonSequence: string[];
  completionRewards: any;
}

interface TrainingSpecialty {
  id: string;
  name: string;
  description: string;
  icon: any;
  progress: number;
  totalSkills: number;
  unlockedSkills: number;
  specialFeatures: string[];
}

const HOUSE_SPECIALTIES: Record<MythologicalHouse, TrainingSpecialty> = {
  heroes: {
    id: 'character-trading',
    name: 'Character Asset Mastery',
    description: 'Master the art of character options and futures trading through battle-tested strategies',
    icon: Shield,
    progress: 0,
    totalSkills: 12,
    unlockedSkills: 0,
    specialFeatures: [
      'Options Trading Simulator',
      'Character Futures Analysis',
      'Battle Outcome Predictions',
      'Hero Power Scaling Models'
    ]
  },
  wisdom: {
    id: 'creator-analysis',
    name: 'Creator Bond Analytics',
    description: 'Unlock the secrets of creator bonds and intellectual property valuation',
    icon: BookOpen,
    progress: 0,
    totalSkills: 10,
    unlockedSkills: 0,
    specialFeatures: [
      'Creator Portfolio Tools',
      'IP Valuation Models',
      'Collaboration Network Analysis',
      'Publishing Deal Simulator'
    ]
  },
  power: {
    id: 'publisher-dominance',
    name: 'Publisher Stock Mastery',
    description: 'Command the corporate throne rooms and master franchise valuations',
    icon: Crown,
    progress: 0,
    totalSkills: 14,
    unlockedSkills: 0,
    specialFeatures: [
      'Corporate Analysis Suite',
      'Franchise Valuation Tools',
      'Market Dominance Metrics',
      'Executive Decision Simulator'
    ]
  },
  mystery: {
    id: 'rare-derivatives',
    name: 'Rare Derivative Mysticism',
    description: 'Navigate the shadow realms of rare issue derivatives and speculation',
    icon: Zap,
    progress: 0,
    totalSkills: 8,
    unlockedSkills: 0,
    specialFeatures: [
      'Rarity Detection Algorithms',
      'Speculation Risk Models',
      'Market Anomaly Scanner',
      'Mystical Price Patterns'
    ]
  },
  elements: {
    id: 'cross-universe',
    name: 'Multi-Universe Harmony',
    description: 'Master the cosmic balance of cross-universe asset diversification',
    icon: Flame,
    progress: 0,
    totalSkills: 11,
    unlockedSkills: 0,
    specialFeatures: [
      'Universe Balance Calculator',
      'Cross-Platform Synergies',
      'Elemental Portfolio Theory',
      'Cosmic Correlation Maps'
    ]
  },
  time: {
    id: 'historical-analysis',
    name: 'Temporal Market Wisdom',
    description: 'Guard the chronological sanctuaries of historical pattern analysis',
    icon: Clock,
    progress: 0,
    totalSkills: 9,
    unlockedSkills: 0,
    specialFeatures: [
      'Historical Pattern Scanner',
      'Time Series Forecasting',
      'Vintage Asset Valuator',
      'Era Transition Predictor'
    ]
  },
  spirit: {
    id: 'social-dynamics',
    name: 'Community Trading Harmony',
    description: 'Navigate the community circles of social trading and sentiment',
    icon: Users,
    progress: 0,
    totalSkills: 10,
    unlockedSkills: 0,
    specialFeatures: [
      'Sentiment Analysis Engine',
      'Community Pulse Monitor',
      'Social Trading Networks',
      'Collective Wisdom Aggregator'
    ]
  }
};

const HOUSE_ENVIRONMENTS: Record<MythologicalHouse, {
  name: string;
  atmosphere: string;
  primaryColor: string;
  accentColor: string;
  effects: string[];
}> = {
  heroes: {
    name: 'Battle-Tested Trading Arena',
    atmosphere: 'Heroic battlegrounds with golden light and valor emblems',
    primaryColor: 'from-red-900/20 to-orange-900/20',
    accentColor: 'border-red-500/30',
    effects: ['Glowing battle standards', 'Victory fanfares', 'Heroic aura particles']
  },
  wisdom: {
    name: 'Ancient Library Sanctum',
    atmosphere: 'Mystical libraries with floating tomes and wisdom crystals',
    primaryColor: 'from-blue-900/20 to-indigo-900/20',
    accentColor: 'border-blue-500/30',
    effects: ['Floating scrolls', 'Wisdom orb illumination', 'Ancient rune inscriptions']
  },
  power: {
    name: 'Corporate Throne Chamber',
    atmosphere: 'Imperial throne rooms with purple majesty and authority symbols',
    primaryColor: 'from-purple-900/20 to-violet-900/20',
    accentColor: 'border-purple-500/30',
    effects: ['Royal crown projections', 'Authority aura', 'Imperial decree scrolls']
  },
  mystery: {
    name: 'Shadow Realm Sanctum',
    atmosphere: 'Mysterious shadow realms with emerald mysticism and hidden secrets',
    primaryColor: 'from-green-900/20 to-emerald-900/20',
    accentColor: 'border-green-500/30',
    effects: ['Shadow tendrils', 'Mysterious green glow', 'Hidden symbol reveals']
  },
  elements: {
    name: 'Cosmic Balance Chamber',
    atmosphere: 'Elemental harmony chambers with amber energy and cosmic balance',
    primaryColor: 'from-yellow-900/20 to-amber-900/20',
    accentColor: 'border-yellow-500/30',
    effects: ['Elemental orbs', 'Cosmic energy flows', 'Harmonic resonance waves']
  },
  time: {
    name: 'Chronological Sanctuary',
    atmosphere: 'Time-worn sanctuaries with temporal flows and historical echoes',
    primaryColor: 'from-slate-900/20 to-gray-900/20',
    accentColor: 'border-slate-500/30',
    effects: ['Temporal spirals', 'Historical echoes', 'Time rift glimpses']
  },
  spirit: {
    name: 'Community Circle Chamber',
    atmosphere: 'Social harmony circles with teal energy and communal bonds',
    primaryColor: 'from-teal-900/20 to-cyan-900/20',
    accentColor: 'border-teal-500/30',
    effects: ['Community light streams', 'Social bond networks', 'Harmony resonance']
  }
};

export function HouseTrainingGrounds({ houseId }: HouseTrainingGroundsProps) {
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'skills' | 'tools'>('overview');
  
  const { user } = useAuth();
  const { getHouseTheme } = useHouseTheme();
  
  const house = getHouseTheme(houseId);
  const specialty = HOUSE_SPECIALTIES[houseId];
  const environment = HOUSE_ENVIRONMENTS[houseId];

  // Mystical atmosphere animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Fetch house-specific learning paths
  const { data: learningPaths, isLoading: pathsLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning/paths/house', houseId],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch house-specific skills
  const { data: houseSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ['/api/learning/skills/house', houseId],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's house progress
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/learning/progress/house', houseId],
    enabled: !!user,
    staleTime: 1 * 60 * 1000,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Training Grounds Header */}
      <div className="relative overflow-hidden">
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${environment.primaryColor} rounded-lg blur-xl`}
          style={{
            transform: `scale(${1 + Math.sin(mysticalEnergy * 0.02) * 0.05})`,
            opacity: 0.4 + Math.sin(mysticalEnergy * 0.03) * 0.1
          }}
        />
        <Card className={`relative border-2 ${environment.accentColor} bg-gradient-to-br from-background/95 via-background/90 to-background/95`}>
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="relative">
                <HouseEmblem 
                  house={houseId} 
                  size="2xl" 
                  variant="solid"
                  className="animate-pulse" 
                />
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-lg"
                  style={{
                    transform: `rotate(${mysticalEnergy * 0.5}deg)`,
                    opacity: 0.6 + Math.sin(mysticalEnergy * 0.1) * 0.3
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {environment.name}
                </CardTitle>
                <p className="text-xl text-muted-foreground mt-2">{house.name}</p>
                <p className="text-lg text-accent italic mt-1">"{environment.atmosphere}"</p>
              </div>
            </div>

            {/* House Specialty Overview */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-muted/50 to-accent/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <specialty.icon className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <h3 className="text-2xl font-bold">{specialty.name}</h3>
                      <p className="text-muted-foreground">{specialty.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{specialty.unlockedSkills}</div>
                      <div className="text-sm text-muted-foreground">Mastered Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">{specialty.totalSkills}</div>
                      <div className="text-sm text-muted-foreground">Total Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{Math.round(specialty.progress)}%</div>
                      <div className="text-sm text-muted-foreground">Mastery Progress</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>House Mastery Progress:</span>
                      <span className="text-primary">{Math.round(specialty.progress)}%</span>
                    </div>
                    <Progress value={specialty.progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Atmospheric Effects Display */}
      <Card className="bg-gradient-to-r from-muted/30 to-accent/5">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Atmospheric Effects:</span>
            {environment.effects.map((effect, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {effect}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <Target className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="paths" data-testid="tab-paths">
            <Compass className="h-4 w-4 mr-2" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">
            <Gem className="h-4 w-4 mr-2" />
            Skills & Abilities
          </TabsTrigger>
          <TabsTrigger value="tools" data-testid="tab-tools">
            <Activity className="h-4 w-4 mr-2" />
            Specialty Tools
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paths Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  Sacred Learning Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pathsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {learningPaths?.slice(0, 4).map((path) => (
                      <div key={path.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover-elevate">
                        <div className="p-2 rounded bg-primary/20">
                          <Scroll className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{path.sacredTitle || path.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {path.lessonSequence.length} lessons • {path.estimatedHours}h
                          </p>
                        </div>
                        <Badge variant="outline">{path.difficultyLevel}</Badge>
                      </div>
                    ))}
                    {(learningPaths?.length || 0) > 4 && (
                      <Button variant="ghost" size="sm" className="w-full">
                        View All {learningPaths?.length} Paths
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-accent" />
                  Mystical Abilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {houseSkills?.slice(0, 4).map((skill: any) => (
                      <div key={skill.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover-elevate">
                        <div className="p-2 rounded bg-accent/20">
                          <Zap className="h-4 w-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{skill.sacredName || skill.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Tier {skill.tier} • {skill.skillCategory}
                          </p>
                        </div>
                        <Badge variant="outline" className={`
                          ${skill.rarityLevel === 'legendary' ? 'border-yellow-500 text-yellow-400' :
                            skill.rarityLevel === 'epic' ? 'border-purple-500 text-purple-400' :
                            skill.rarityLevel === 'rare' ? 'border-blue-500 text-blue-400' :
                            'border-gray-500 text-gray-400'}
                        `}>
                          {skill.rarityLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Special Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Exclusive Training Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {specialty.specialFeatures.map((feature, index) => (
                  <Card key={index} className="hover-elevate cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="p-3 rounded-full bg-primary/20 w-fit mx-auto mb-3">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-sm">{feature}</h4>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Launch
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Paths Tab */}
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
              {learningPaths?.map((path) => (
                <Card key={path.id} className="hover-elevate cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {path.difficultyLevel}
                        </Badge>
                        <CardTitle className="text-lg leading-tight">{path.sacredTitle || path.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {path.mysticalDescription || path.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span>{path.experienceReward} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-accent" />
                          <span>{path.karmaReward} Karma</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Scroll className="h-4 w-4" />
                        <span>{path.lessonSequence.length} lessons</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{path.estimatedHours}h</span>
                      </div>
                      
                      <Button className="w-full mt-4" data-testid={`start-path-${path.id}`}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Begin Sacred Path
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Skills Tab */}
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
              {houseSkills?.map((skill: any) => (
                <Card key={skill.id} className="hover-elevate relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
                    skill.rarityLevel === 'legendary' ? 'from-yellow-500' :
                    skill.rarityLevel === 'epic' ? 'from-purple-500' :
                    skill.rarityLevel === 'rare' ? 'from-blue-500' :
                    'from-gray-500'
                  }`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className={`mb-2 ${
                          skill.rarityLevel === 'legendary' ? 'border-yellow-500 text-yellow-400' :
                          skill.rarityLevel === 'epic' ? 'border-purple-500 text-purple-400' :
                          skill.rarityLevel === 'rare' ? 'border-blue-500 text-blue-400' :
                          'border-gray-500 text-gray-400'
                        }`}>
                          {skill.rarityLevel}
                        </Badge>
                        <CardTitle className="text-lg leading-tight flex items-center gap-2">
                          <Lock className="h-5 w-5 text-muted-foreground" />
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
                      
                      <Button variant="ghost" size="sm" className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Unlock Required
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Specialty Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialty.specialFeatures.map((feature, index) => (
              <Card key={index} className="hover-elevate cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    {feature}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Advanced {house.name} specialty tool for {feature.toLowerCase()} training and analysis.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button className="flex-1">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Launch Tool
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}