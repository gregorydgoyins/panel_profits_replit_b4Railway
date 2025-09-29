import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, Play, Pause, RotateCcw, FastForward, Volume2, 
  VolumeX, Maximize, Settings, CheckCircle, XCircle, Star,
  Eye, Brain, Sparkles, Scroll, Gem, Crown, Trophy, Target,
  Clock, Zap, Heart, ArrowRight, ArrowLeft, SkipForward,
  PlayCircle, PauseCircle, RefreshCw, Award, Flame
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { useToast } from '@/hooks/use-toast';
import { HouseEmblem } from '@/components/ui/house-emblem';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface SacredLesson {
  id: string;
  title: string;
  description: string;
  houseId: string;
  pathId: string;
  lessonType: 'crystal_orb' | 'sacred_tome' | 'mystical_simulation' | 'ancient_scroll' | 'ritual_practice';
  difficultyLevel: string;
  estimatedMinutes: number;
  experienceReward: number;
  karmaReward: number;
  contentFormat: 'text' | 'video' | 'interactive' | 'simulation' | 'assessment';
  contentData: {
    sections: Array<{
      id: string;
      title: string;
      type: 'text' | 'video' | 'interactive' | 'quiz' | 'simulation';
      content: string;
      mediaUrl?: string;
      questions?: Array<{
        id: string;
        question: string;
        type: 'multiple_choice' | 'true_false' | 'short_answer';
        options?: string[];
        correctAnswer: string | number;
        explanation: string;
      }>;
      simulationConfig?: any;
    }>;
  };
  sacredTitle: string;
  mysticalNarrative: string;
  guidingSpirit: string;
  ritualDescription: string;
  atmosphericEffects: string[];
  prerequisites: string[];
  nextLessons: string[];
}

interface UserLessonProgress {
  id: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  progressPercent: number;
  currentSection: number;
  completedSections: number[];
  timeSpent: number;
  assessmentScores: Record<string, number>;
  experienceEarned: number;
  karmaEarned: number;
  lastAccessedAt: string;
}

interface ImmersiveLessonInterfaceProps {
  lessonId: string;
  onComplete?: () => void;
  onNext?: () => void;
}

const LESSON_TYPE_CONFIGS = {
  crystal_orb: {
    name: 'Crystal Orb Knowledge Download',
    icon: Gem,
    description: 'Absorb ancient wisdom through mystical crystal orb communion',
    primaryColor: 'from-blue-500/20 to-cyan-500/20',
    accentColor: 'border-blue-500/30',
    effects: ['Crystalline particles', 'Knowledge streams', 'Mystical resonance']
  },
  sacred_tome: {
    name: 'Sacred Tome Reading',
    icon: BookOpen,
    description: 'Study the ancient texts with mystical scrolling revelation',
    primaryColor: 'from-purple-500/20 to-violet-500/20',
    accentColor: 'border-purple-500/30',
    effects: ['Floating glyphs', 'Parchment glow', 'Ancient whispers']
  },
  mystical_simulation: {
    name: 'Mystical Trading Simulation',
    icon: Brain,
    description: 'Practice trading arts in the ethereal simulation realm',
    primaryColor: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'border-green-500/30',
    effects: ['Reality ripples', 'Simulation matrices', 'Virtual auras']
  },
  ancient_scroll: {
    name: 'Ancient Wisdom Scroll',
    icon: Scroll,
    description: 'Unfurl the secrets of the ancient trading masters',
    primaryColor: 'from-amber-500/20 to-yellow-500/20',
    accentColor: 'border-amber-500/30',
    effects: ['Papyrus shimmer', 'Golden wisdom', 'Time echoes']
  },
  ritual_practice: {
    name: 'Sacred Trading Ritual',
    icon: Flame,
    description: 'Perform the ceremonial trading rituals of your house',
    primaryColor: 'from-red-500/20 to-orange-500/20',
    accentColor: 'border-red-500/30',
    effects: ['Ritual flames', 'Sacred circles', 'Divine energy']
  }
};

export function ImmersiveLessonInterface({ lessonId, onComplete, onNext }: ImmersiveLessonInterfaceProps) {
  const [mysticalEnergy, setMysticalEnergy] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({});
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { getHouseTheme } = useHouseTheme();
  const queryClient = useQueryClient();
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  // Mystical energy animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Time tracking
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
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
  }, [isPlaying]);

  // Fetch lesson data
  const { data: lesson, isLoading: lessonLoading } = useQuery<SacredLesson>({
    queryKey: ['/api/learning/lessons', lessonId],
    enabled: !!lessonId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch user progress
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserLessonProgress>({
    queryKey: ['/api/learning/progress/lessons', lessonId],
    enabled: !!lessonId && !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Start lesson mutation
  const startLessonMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/learning/lessons/${lessonId}/start`);
      return response.json();
    },
    onSuccess: () => {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress/lessons', lessonId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Begin Sacred Lesson",
        description: error.message || "The cosmic energies are misaligned. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete lesson mutation
  const completeLessonMutation = useMutation({
    mutationFn: async (data: { score: number; timeSpent: number }) => {
      const response = await apiRequest('POST', `/api/learning/lessons/${lessonId}/complete`, data);
      return response.json();
    },
    onSuccess: (data) => {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      toast({
        title: "🎉 Sacred Lesson Mastered!",
        description: `Gained ${data.experienceEarned} XP and ${data.karmaEarned} Karma`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
      onComplete?.();
    },
    onError: (error: any) => {
      toast({
        title: "Lesson Completion Failed",
        description: error.message || "The cosmic completion ritual failed.",
        variant: "destructive",
      });
    },
  });

  if (lessonLoading || !lesson) {
    return (
      <div className="container mx-auto p-6">
        <Card className="animate-pulse">
          <CardContent className="p-8">
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const house = getHouseTheme(lesson.houseId as MythologicalHouse);
  const lessonConfig = LESSON_TYPE_CONFIGS[lesson.lessonType];
  const currentSectionData = lesson.contentData.sections[currentSection];
  const progressPercent = ((currentSection + 1) / lesson.contentData.sections.length) * 100;
  const LessonIcon = lessonConfig.icon;

  const handleStartLesson = () => {
    if (!userProgress || userProgress.status === 'not_started') {
      startLessonMutation.mutate();
    } else {
      setIsPlaying(true);
    }
  };

  const handleSectionComplete = (score?: number) => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
      if (score !== undefined) {
        setSectionScores(prev => ({ ...prev, [currentSectionData.id]: score }));
      }
    }
  };

  const handleNextSection = () => {
    if (currentSection < lesson.contentData.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleCompleteLesson = () => {
    const averageScore = Object.values(sectionScores).reduce((sum, score) => sum + score, 0) / Object.values(sectionScores).length || 100;
    completeLessonMutation.mutate({
      score: averageScore,
      timeSpent: Math.floor(timeSpent / 60) // Convert to minutes
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Lesson Header */}
      <div className="relative overflow-hidden">
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${lessonConfig.primaryColor} rounded-lg blur-xl`}
          style={{
            transform: `rotate(${mysticalEnergy * 0.2}deg) scale(${1 + Math.sin(mysticalEnergy * 0.05) * 0.1})`,
            opacity: 0.3 + Math.sin(mysticalEnergy * 0.03) * 0.2
          }}
        />
        <Card className={`relative border-2 ${lessonConfig.accentColor} bg-gradient-to-br from-background/95 via-background/90 to-background/95`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <HouseEmblem house={lesson.houseId as MythologicalHouse} size="lg" variant="solid" />
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-lg"
                    style={{
                      transform: `rotate(${mysticalEnergy * 0.8}deg)`,
                      opacity: 0.4 + Math.sin(mysticalEnergy * 0.1) * 0.3
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LessonIcon className="h-6 w-6 text-primary" />
                    <Badge variant="outline">{lessonConfig.name}</Badge>
                    <Badge>{lesson.difficultyLevel}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{lesson.sacredTitle || lesson.title}</CardTitle>
                  <p className="text-muted-foreground italic mt-1">"{lesson.mysticalNarrative}"</p>
                  <p className="text-sm text-accent mt-2">Guided by: {lesson.guidingSpirit}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{Math.round(progressPercent)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="text-sm text-accent mt-1">{formatTime(timeSpent)}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={progressPercent} className="h-3" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Atmospheric Effects */}
      <Card className="bg-gradient-to-r from-muted/30 to-accent/5">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Mystical Atmosphere:</span>
            {lessonConfig.effects.map((effect, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {effect}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleStartLesson}
                disabled={startLessonMutation.isPending}
                className="gap-2"
                data-testid="start-lesson-button"
              >
                {isPlaying ? (
                  <>
                    <PauseCircle className="h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-5 w-5" />
                    {userProgress?.status === 'not_started' ? 'Begin Sacred Journey' : 'Resume'}
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentSection(0)}
                disabled={currentSection === 0}
                data-testid="restart-lesson-button"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setAudioEnabled(!audioEnabled)}
                data-testid="toggle-audio-button"
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePreviousSection}
                disabled={currentSection === 0}
                data-testid="previous-section-button"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Section {currentSection + 1} of {lesson.contentData.sections.length}
              </span>
              
              <Button
                variant="outline"
                onClick={handleNextSection}
                disabled={currentSection >= lesson.contentData.sections.length - 1}
                data-testid="next-section-button"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Sacred Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lesson.contentData.sections.map((section, index) => (
                <Button
                  key={section.id}
                  variant={index === currentSection ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start text-left h-auto p-3 ${
                    completedSections.includes(index) ? 'text-green-400' : ''
                  }`}
                  onClick={() => setCurrentSection(index)}
                  data-testid={`section-button-${index}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    {completedSections.includes(index) ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : index === currentSection ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{section.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{section.type}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentSectionData.type === 'video' && <PlayCircle className="h-5 w-5" />}
              {currentSectionData.type === 'text' && <BookOpen className="h-5 w-5" />}
              {currentSectionData.type === 'interactive' && <Brain className="h-5 w-5" />}
              {currentSectionData.type === 'quiz' && <Target className="h-5 w-5" />}
              {currentSectionData.type === 'simulation' && <Eye className="h-5 w-5" />}
              {currentSectionData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-96">
            {currentSectionData.type === 'text' && (
              <div className="prose prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
                  className="text-lg leading-relaxed"
                />
              </div>
            )}

            {currentSectionData.type === 'video' && currentSectionData.mediaUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video 
                  src={currentSectionData.mediaUrl} 
                  controls 
                  className="w-full h-full"
                  autoPlay={isPlaying}
                />
              </div>
            )}

            {currentSectionData.type === 'quiz' && currentSectionData.questions && (
              <div className="space-y-6">
                {currentSectionData.questions.map((question, qIndex) => (
                  <Card key={question.id}>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">{question.question}</h4>
                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <Button
                              key={oIndex}
                              variant="outline"
                              className="w-full text-left justify-start"
                              onClick={() => {
                                const isCorrect = oIndex === question.correctAnswer;
                                handleSectionComplete(isCorrect ? 100 : 0);
                                if (isCorrect) {
                                  toast({
                                    title: "Correct!",
                                    description: question.explanation,
                                  });
                                }
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {currentSectionData.type === 'simulation' && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mystical Trading Simulation</h3>
                <p className="text-muted-foreground mb-6">
                  Enter the ethereal realm where trading concepts become reality
                </p>
                <Button size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Launch Simulation
                </Button>
              </div>
            )}

            {currentSectionData.type === 'interactive' && (
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Learning Experience</h3>
                <p className="text-muted-foreground mb-6">
                  Engage with mystical elements to deepen your understanding
                </p>
                <Button size="lg" className="gap-2">
                  <Eye className="h-5 w-5" />
                  Begin Interaction
                </Button>
              </div>
            )}

            {/* Section Completion */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {completedSections.includes(currentSection) && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Section Mastered
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!completedSections.includes(currentSection) && (
                    <Button
                      onClick={() => handleSectionComplete(100)}
                      data-testid="complete-section-button"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  
                  {currentSection < lesson.contentData.sections.length - 1 ? (
                    <Button
                      onClick={handleNextSection}
                      disabled={!completedSections.includes(currentSection)}
                      data-testid="next-section-main-button"
                    >
                      Next Section
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCompleteLesson}
                      disabled={completedSections.length < lesson.contentData.sections.length || completeLessonMutation.isPending}
                      className="bg-gradient-to-r from-primary to-accent"
                      data-testid="complete-lesson-button"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Complete Sacred Journey
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Info Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{lesson.experienceReward}</div>
              <div className="text-sm text-muted-foreground">Experience Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{lesson.karmaReward}</div>
              <div className="text-sm text-muted-foreground">Karma Reward</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{lesson.estimatedMinutes}</div>
              <div className="text-sm text-muted-foreground">Est. Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{completedSections.length}/{lesson.contentData.sections.length}</div>
              <div className="text-sm text-muted-foreground">Sections Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl animate-bounce">🎉</div>
            <div className="text-4xl font-bold text-primary mt-4 animate-pulse">
              Lesson Mastered!
            </div>
            <div className="text-xl text-accent mt-2">
              Sacred knowledge has been absorbed
            </div>
          </div>
        </div>
      )}
    </div>
  );
}