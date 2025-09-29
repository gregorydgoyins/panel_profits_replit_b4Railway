import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sword, Shield, Crown, Trophy, Target, Flame, Zap, Eye, 
  Clock, Star, Users, Brain, CheckCircle, XCircle, Play,
  Pause, RotateCcw, Award, Gem, Sparkles, Scroll,
  Timer, TrendingUp, Activity, BarChart3, Globe, Compass,
  ArrowRight, PlayCircle, AlertTriangle, Settings, Volume2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { useToast } from '@/hooks/use-toast';
import { HouseEmblem } from '@/components/ui/house-emblem';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface TrialOfMastery {
  id: string;
  name: string;
  description: string;
  houseId: string;
  trialType: 'knowledge' | 'simulation' | 'strategy' | 'speed' | 'endurance' | 'creativity';
  difficultyLevel: 'initiate' | 'adept' | 'master' | 'grandmaster';
  estimatedMinutes: number;
  maxAttempts: number;
  passingScore: number;
  rewards: {
    experience: number;
    karma: number;
    skills: string[];
    certifications: string[];
    titles: string[];
  };
  prerequisites: {
    skills: string[];
    lessons: string[];
    karma: number;
    houseLevel: number;
  };
  trialStructure: {
    phases: Array<{
      id: string;
      name: string;
      type: 'knowledge_test' | 'trading_simulation' | 'strategy_puzzle' | 'time_challenge';
      duration: number;
      weight: number;
      description: string;
    }>;
  };
  sacredName: string;
  mysticalDescription: string;
  trialKeeper: string;
  ceremonialAspects: string[];
  atmosphericEffects: string[];
  isActive: boolean;
  canAttempt: boolean;
}

interface UserTrialAttempt {
  id: string;
  trialId: string;
  status: 'in_progress' | 'completed' | 'failed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  duration: number;
  score: number;
  phaseScores: Record<string, number>;
  passed: boolean;
  feedback: string;
  experienceEarned: number;
  karmaEarned: number;
}

interface TrialLeaderboard {
  trialId: string;
  entries: Array<{
    userId: string;
    username: string;
    houseId: string;
    score: number;
    completionTime: number;
    rank: number;
    achievedAt: string;
  }>;
}

interface TrialsOfMasteryProps {
  houseId?: MythologicalHouse;
  selectedTrialId?: string;
  onTrialComplete?: (attempt: UserTrialAttempt) => void;
}

const TRIAL_TYPE_CONFIGS = {
  knowledge: {
    name: 'Knowledge Trials',
    icon: Brain,
    description: 'Test your understanding of sacred trading principles',
    primaryColor: 'from-blue-500/20 to-indigo-500/20',
    accentColor: 'border-blue-500/30',
    effects: ['Wisdom auras', 'Knowledge streams', 'Ancient whispers']
  },
  simulation: {
    name: 'Trading Simulations',
    icon: Activity,
    description: 'Prove your skills in realistic market scenarios',
    primaryColor: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'border-green-500/30',
    effects: ['Market projections', 'Trading flows', 'Profit energies']
  },
  strategy: {
    name: 'Strategic Trials',
    icon: Target,
    description: 'Demonstrate advanced strategic thinking',
    primaryColor: 'from-purple-500/20 to-violet-500/20',
    accentColor: 'border-purple-500/30',
    effects: ['Strategic webs', 'Decision matrices', 'Tactical auras']
  },
  speed: {
    name: 'Speed Challenges',
    icon: Zap,
    description: 'Race against time to prove your reflexes',
    primaryColor: 'from-yellow-500/20 to-amber-500/20',
    accentColor: 'border-yellow-500/30',
    effects: ['Lightning arcs', 'Speed trails', 'Time distortions']
  },
  endurance: {
    name: 'Endurance Tests',
    icon: Shield,
    description: 'Sustain excellence over extended periods',
    primaryColor: 'from-red-500/20 to-orange-500/20',
    accentColor: 'border-red-500/30',
    effects: ['Stamina auras', 'Endurance circles', 'Perseverance flames']
  },
  creativity: {
    name: 'Creative Challenges',
    icon: Sparkles,
    description: 'Innovate unique solutions to complex problems',
    primaryColor: 'from-pink-500/20 to-rose-500/20',
    accentColor: 'border-pink-500/30',
    effects: ['Inspiration sparks', 'Creative flows', 'Innovation bursts']
  }
};

export function TrialsOfMastery({ houseId, selectedTrialId, onTrialComplete }: TrialsOfMasteryProps) {
  const [activeTab, setActiveTab] = useState<'available' | 'leaderboards' | 'history' | 'active'>('available');
  const [selectedTrial, setSelectedTrial] = useState<TrialOfMastery | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<UserTrialAttempt | null>(null);
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [trialInProgress, setTrialInProgress] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const queryClient = useQueryClient();
  const timerRef = useRef<NodeJS.Timeout>();
  
  const targetHouse = houseId || currentHouse;
  const house = getHouseTheme(targetHouse);

  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Phase timer
  useEffect(() => {
    if (trialInProgress && selectedTrial) {
      timerRef.current = setInterval(() => {
        setPhaseTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [trialInProgress, selectedTrial]);

  // Fetch available trials
  const { data: trials, isLoading: trialsLoading } = useQuery<TrialOfMastery[]>({
    queryKey: ['/api/learning/trials', houseId ? { houseId } : {}],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user trial attempts
  const { data: userAttempts, isLoading: attemptsLoading } = useQuery<UserTrialAttempt[]>({
    queryKey: ['/api/learning/trials/attempts'],
    enabled: !!user,
    staleTime: 1 * 60 * 1000,
  });

  // Fetch leaderboards
  const { data: leaderboards, isLoading: leaderboardsLoading } = useQuery<TrialLeaderboard[]>({
    queryKey: ['/api/learning/trials/leaderboards', houseId],
    enabled: !!user && activeTab === 'leaderboards',
    staleTime: 2 * 60 * 1000,
  });

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async (trialId: string) => {
      const response = await apiRequest('POST', `/api/learning/trials/${trialId}/start`);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentAttempt(data);
      setTrialInProgress(true);
      setCurrentPhase(0);
      setPhaseTimer(0);
      setActiveTab('active');
      
      toast({
        title: "Trial Commenced!",
        description: "May the cosmic forces guide your journey to mastery.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/learning/trials/attempts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Trial Initiation Failed",
        description: error.message || "The sacred trial chamber is not responding.",
        variant: "destructive",
      });
    },
  });

  // Complete trial mutation
  const completeTrialMutation = useMutation({
    mutationFn: async (data: { trialId: string; phaseScores: Record<string, number>; totalScore: number }) => {
      const response = await apiRequest('POST', `/api/learning/trials/${data.trialId}/complete`, data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentAttempt(data);
      setTrialInProgress(false);
      
      const passed = data.score >= (selectedTrial?.passingScore || 70);
      
      toast({
        title: passed ? "🎉 Trial Mastered!" : "Trial Completed",
        description: passed 
          ? `Congratulations! Gained ${data.experienceEarned} XP and ${data.karmaEarned} Karma`
          : `Score: ${data.score}%. Study more and try again when ready.`,
        variant: passed ? "default" : "destructive",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/learning'] });
      onTrialComplete?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Trial Completion Failed",
        description: error.message || "The trial results could not be recorded.",
        variant: "destructive",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'initiate': return 'text-green-400 border-green-500';
      case 'adept': return 'text-blue-400 border-blue-500';
      case 'master': return 'text-purple-400 border-purple-500';
      case 'grandmaster': return 'text-yellow-400 border-yellow-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getTrialTypeConfig = (type: string) => {
    return TRIAL_TYPE_CONFIGS[type as keyof typeof TRIAL_TYPE_CONFIGS] || TRIAL_TYPE_CONFIGS.knowledge;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTrial = (trial: TrialOfMastery) => {
    setSelectedTrial(trial);
    startTrialMutation.mutate(trial.id);
  };

  const handleCompletePhase = (phaseScore: number) => {
    if (!selectedTrial || !currentAttempt) return;

    const newPhaseScores = {
      ...currentAttempt.phaseScores,
      [selectedTrial.trialStructure.phases[currentPhase].id]: phaseScore
    };

    if (currentPhase < selectedTrial.trialStructure.phases.length - 1) {
      setCurrentPhase(prev => prev + 1);
      setPhaseTimer(0);
      setCurrentAttempt(prev => prev ? { ...prev, phaseScores: newPhaseScores } : null);
    } else {
      // Calculate total score
      const totalWeight = selectedTrial.trialStructure.phases.reduce((sum, phase) => sum + phase.weight, 0);
      const weightedScore = selectedTrial.trialStructure.phases.reduce((sum, phase) => {
        const score = newPhaseScores[phase.id] || 0;
        return sum + (score * phase.weight);
      }, 0);
      const totalScore = Math.round(weightedScore / totalWeight);

      completeTrialMutation.mutate({
        trialId: selectedTrial.id,
        phaseScores: newPhaseScores,
        totalScore
      });
    }
  };

  if (trialsLoading || !trials) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Trials Header */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-lg blur-xl"
          style={{
            transform: `rotate(${mysticalEnergy * 0.1}deg) scale(${1 + Math.sin(mysticalEnergy * 0.05) * 0.1})`,
            opacity: 0.4 + Math.sin(mysticalEnergy * 0.03) * 0.2
          }}
        />
        <Card className="relative border-primary/20 bg-gradient-to-br from-background via-background/95 to-primary/5">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="relative">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Sword className="h-16 w-16 text-primary" />
                </div>
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-lg"
                  style={{
                    transform: `rotate(${mysticalEnergy * 0.8}deg)`,
                    opacity: 0.5 + Math.sin(mysticalEnergy * 0.1) * 0.3
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Trials of Mastery
                </CardTitle>
                <p className="text-xl text-muted-foreground mt-2">
                  Epic Challenges of Sacred Trading Knowledge
                </p>
                {houseId && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <HouseEmblem house={houseId} size="sm" />
                    <span className="text-accent">{house.name} Trials</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available" data-testid="tab-available">
            <Sword className="h-4 w-4 mr-2" />
            Available Trials
          </TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active" disabled={!trialInProgress}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Active Trial
          </TabsTrigger>
          <TabsTrigger value="leaderboards" data-testid="tab-leaderboards">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboards
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">
            <Scroll className="h-4 w-4 mr-2" />
            Trial History
          </TabsTrigger>
        </TabsList>

        {/* Available Trials Tab */}
        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trials.map((trial) => {
              const trialConfig = getTrialTypeConfig(trial.trialType);
              const TrialIcon = trialConfig.icon;
              const userAttempt = userAttempts?.find(a => a.trialId === trial.id);
              const attemptsRemaining = trial.maxAttempts - (userAttempts?.filter(a => a.trialId === trial.id).length || 0);

              return (
                <Card key={trial.id} className="hover-elevate cursor-pointer group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${trialConfig.primaryColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <TrialIcon className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className={getDifficultyColor(trial.difficultyLevel)}>
                            {trial.difficultyLevel}
                          </Badge>
                          <Badge variant="outline">
                            {trial.trialType}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{trial.sacredName || trial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {trial.mysticalDescription || trial.description}
                        </p>
                        <p className="text-xs text-accent mt-2 italic">
                          Guided by: {trial.trialKeeper}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="space-y-3">
                      {/* Trial Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{trial.estimatedMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-accent" />
                          <span>{trial.passingScore}% to pass</span>
                        </div>
                      </div>
                      
                      {/* Phases */}
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="h-4 w-4" />
                          <span>{trial.trialStructure.phases.length} Phases</span>
                        </div>
                        <div className="text-xs">
                          {trial.trialStructure.phases.map((phase, index) => (
                            <span key={phase.id}>
                              {phase.name}{index < trial.trialStructure.phases.length - 1 ? ' • ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span>{trial.rewards.experience} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-accent" />
                          <span>{trial.rewards.karma} Karma</span>
                        </div>
                      </div>

                      {/* Attempts Remaining */}
                      {attemptsRemaining > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <span>{attemptsRemaining} attempts remaining</span>
                        </div>
                      )}

                      {/* Best Score */}
                      {userAttempt && userAttempt.passed && (
                        <div className="text-sm text-green-400">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Best: {userAttempt.score}%
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleStartTrial(trial)}
                        disabled={!trial.canAttempt || attemptsRemaining <= 0 || startTrialMutation.isPending}
                        data-testid={`start-trial-${trial.id}`}
                      >
                        {!trial.canAttempt ? (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Prerequisites Required
                          </>
                        ) : attemptsRemaining <= 0 ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            No Attempts Remaining
                          </>
                        ) : userAttempt && userAttempt.passed ? (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retry Trial
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Begin Trial
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Active Trial Tab */}
        <TabsContent value="active" className="space-y-6">
          {trialInProgress && selectedTrial && currentAttempt ? (
            <div className="space-y-6">
              {/* Trial Progress Header */}
              <Card className="border-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedTrial.sacredName}</CardTitle>
                      <p className="text-muted-foreground">Phase {currentPhase + 1} of {selectedTrial.trialStructure.phases.length}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {formatTime(phaseTimer)}
                      </div>
                      <div className="text-sm text-muted-foreground">Elapsed Time</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress:</span>
                      <span className="text-primary">
                        {Math.round(((currentPhase + 1) / selectedTrial.trialStructure.phases.length) * 100)}%
                      </span>
                    </div>
                    <Progress value={((currentPhase + 1) / selectedTrial.trialStructure.phases.length) * 100} className="h-3" />
                  </div>
                </CardHeader>
              </Card>

              {/* Current Phase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {selectedTrial.trialStructure.phases[currentPhase].name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {selectedTrial.trialStructure.phases[currentPhase].description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Brain className="h-20 w-20 mx-auto text-primary mb-4" />
                    <h3 className="text-2xl font-semibold mb-4">
                      Phase {currentPhase + 1}: {selectedTrial.trialStructure.phases[currentPhase].name}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {selectedTrial.trialStructure.phases[currentPhase].description}
                    </p>
                    
                    {/* Simulated Phase Interface */}
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This phase requires {selectedTrial.trialStructure.phases[currentPhase].duration} minutes to complete.
                          Your performance will be weighted {selectedTrial.trialStructure.phases[currentPhase].weight * 100}% toward your final score.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-center justify-center gap-4">
                        <Button 
                          size="lg" 
                          onClick={() => handleCompletePhase(Math.floor(Math.random() * 30) + 70)} // Simulated score 70-100
                          data-testid="complete-phase-button"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Complete Phase
                        </Button>
                        <Button variant="outline" size="lg">
                          <Settings className="h-5 w-5 mr-2" />
                          Phase Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phase Navigation */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {selectedTrial.trialStructure.phases.map((phase, index) => (
                      <div
                        key={phase.id}
                        className={`flex-1 h-2 rounded-full ${
                          index < currentPhase ? 'bg-green-400' :
                          index === currentPhase ? 'bg-primary' :
                          'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    {selectedTrial.trialStructure.phases.map((phase, index) => (
                      <span key={phase.id} className={index === currentPhase ? 'text-primary font-medium' : ''}>
                        {phase.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Sword className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Trial</h3>
                <p className="text-muted-foreground">
                  Select a trial from the Available Trials tab to begin your journey to mastery.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboards Tab */}
        <TabsContent value="leaderboards" className="space-y-6">
          {leaderboardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaderboards?.map((leaderboard) => {
                const trial = trials.find(t => t.id === leaderboard.trialId);
                if (!trial) return null;

                return (
                  <Card key={leaderboard.trialId}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-accent" />
                        {trial.sacredName || trial.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {leaderboard.entries.slice(0, 5).map((entry, index) => (
                          <div key={entry.userId} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              index === 1 ? 'bg-gray-500/20 text-gray-400' :
                              index === 2 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {entry.rank}
                            </div>
                            <HouseEmblem house={entry.houseId as MythologicalHouse} size="sm" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{entry.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {entry.score}% • {formatTime(entry.completionTime)}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.achievedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Trial History Tab */}
        <TabsContent value="history" className="space-y-6">
          {attemptsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-16 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userAttempts?.map((attempt) => {
                const trial = trials.find(t => t.id === attempt.trialId);
                if (!trial) return null;

                return (
                  <Card key={attempt.id} className="hover-elevate">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            attempt.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {attempt.passed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{trial.sacredName || trial.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(attempt.startedAt).toLocaleDateString()} • {formatTime(attempt.duration)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            attempt.passed ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {attempt.score}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {attempt.passed ? 'Mastered' : 'Failed'}
                          </div>
                        </div>
                      </div>
                      
                      {attempt.feedback && (
                        <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                          {attempt.feedback}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {(!userAttempts || userAttempts.length === 0) && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Scroll className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Trial History</h3>
                    <p className="text-muted-foreground">
                      Complete trials to build your legendary record of achievements.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}