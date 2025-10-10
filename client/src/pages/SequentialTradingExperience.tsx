/**
 * SequentialTradingExperience Page
 * Main container that orchestrates the comic trading experience
 * Transforms real-time market data into immersive comic book narratives
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  BookOpen,
  Zap,
  Brain,
  Wallet,
  Clock,
  Eye,
  Settings,
  Maximize,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useHouseTheme } from '@/hooks/useHouseTheme';

// Core Sequential Art Components
import { ComicPageLayout } from '@/components/ui/comic-page-layout';
import { ComicPanel } from '@/components/ui/comic-panel';
import { SpeechBubble } from '@/components/ui/speech-bubble';
import { CaptionBox } from '@/components/ui/caption-box';

// Panel Renderers
import { MarketBeatPanel } from '@/components/trading/MarketBeatPanel';
import { IndicatorPanel } from '@/components/trading/IndicatorPanel';
import { OrderExecutionPanel } from '@/components/trading/OrderExecutionPanel';
import { PortfolioSpreadPanel } from '@/components/trading/PortfolioSpreadPanel';

// Trading Components
import { SequentialArtChart } from '@/components/trading/SequentialArtChart';
import { MarketStoryboard } from '@/components/trading/MarketStoryboard';

// Services and Hooks
import { useSequentialArtFeed } from '@/hooks/useSequentialArtFeed';
import { sequentialStoryEngine, type PanelScript, type ComicIssue } from '@/services/sequentialStoryEngine';

interface ChapterConfig {
  id: 'live_trade' | 'technical_analysis' | 'portfolio_spread' | 'event_flashback';
  title: string;
  description: string;
  icon: any;
  autoAdvance: boolean;
  defaultDuration: number;
  panelCount: number;
}

interface TimelineState {
  isPlaying: boolean;
  currentChapter: string;
  currentPage: number;
  totalPages: number;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
}

interface StorySettings {
  showNarratives: boolean;
  enableSoundEffects: boolean;
  housePoweredEffects: boolean;
  autoGenerateStory: boolean;
  storyCoherence: 'loose' | 'moderate' | 'tight';
  effectIntensity: 'low' | 'medium' | 'high';
}

export default function SequentialTradingExperience() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentHouse, houseTheme } = useHouseTheme();
  
  // Sequential Art Feed Hook
  const {
    activePanels,
    currentIssue,
    currentPage,
    isAutoAdvancing,
    storyTimeline,
    latestMarketData,
    generateLiveTradeStory,
    generateTechnicalChronicle,
    generatePortfolioSpread,
    generateEventFlashback,
    setStoryMode,
    setAutoAdvance,
    pauseStory,
    resumeStory,
    jumpToPanel,
    clearStoryHistory,
    getStoryMetrics
  } = useSequentialArtFeed({
    watchedAssets: ['BATMAN', 'SPIDERMAN', 'SUPERMAN', 'WONDERWOMAN'],
    autoAdvance: true,
    storyMode: 'live_trade',
    enableDerivedMetrics: true
  });

  // State Management
  const [timeline, setTimeline] = useState<TimelineState>({
    isPlaying: true,
    currentChapter: 'live_trade',
    currentPage: 1,
    totalPages: 1,
    playbackSpeed: 1,
    volume: 0.7,
    isMuted: false
  });

  const [storySettings, setStorySettings] = useState<StorySettings>({
    showNarratives: true,
    enableSoundEffects: true,
    housePoweredEffects: true,
    autoGenerateStory: true,
    storyCoherence: 'moderate',
    effectIntensity: 'medium'
  });

  const [selectedHolding, setSelectedHolding] = useState<string | null>(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Chapter Configurations
  const chapters: ChapterConfig[] = [
    {
      id: 'live_trade',
      title: 'Live Trade Story',
      description: 'Real-time market movements as dramatic comic panels',
      icon: Zap,
      autoAdvance: true,
      defaultDuration: 3000,
      panelCount: 6
    },
    {
      id: 'technical_analysis',
      title: 'Technical Analysis Chronicle',
      description: 'Indicators and charts narrated through mystical analysis',
      icon: Brain,
      autoAdvance: true,
      defaultDuration: 5000,
      panelCount: 4
    },
    {
      id: 'portfolio_spread',
      title: 'Portfolio Spread',
      description: 'Your holdings displayed as an interactive comic spread',
      icon: Wallet,
      autoAdvance: false,
      defaultDuration: 0,
      panelCount: 9
    },
    {
      id: 'event_flashback',
      title: 'Event Flashbacks',
      description: 'Market events and news as dramatic flashback sequences',
      icon: Clock,
      autoAdvance: false,
      defaultDuration: 4000,
      panelCount: 3
    }
  ];

  // Fetch user portfolio data
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/portfolios/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Fetch user orders for execution stories
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['/api/orders/user', user?.id, 'recent'],
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  // Update timeline state when issue changes
  useEffect(() => {
    if (currentIssue) {
      setTimeline(prev => ({
        ...prev,
        totalPages: currentIssue.totalPages,
        currentPage: currentIssue.currentPage
      }));
    }
  }, [currentIssue]);

  // Chapter switching logic
  const switchChapter = useCallback(async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    setTimeline(prev => ({ ...prev, currentChapter: chapterId }));
    setStoryMode(chapter.id);
    setAutoAdvance(chapter.autoAdvance);

    // Generate appropriate story content
    try {
      switch (chapter.id) {
        case 'live_trade':
          await generateLiveTradeStory(30000);
          break;
        case 'technical_analysis':
          if (latestMarketData.size > 0) {
            const firstAssetId = Array.from(latestMarketData.keys())[0];
            await generateTechnicalChronicle(firstAssetId);
          }
          break;
        case 'portfolio_spread':
          await generatePortfolioSpread();
          break;
        case 'event_flashback':
          await generateEventFlashback('market_surge');
          break;
      }

      toast({
        title: `${chapter.title} Active`,
        description: chapter.description,
      });
    } catch (error) {
      console.error('Failed to generate chapter content:', error);
      toast({
        title: 'Chapter Generation Failed',
        description: 'Unable to create story content for this chapter.',
        variant: 'destructive'
      });
    }
  }, [chapters, setStoryMode, setAutoAdvance, generateLiveTradeStory, generateTechnicalChronicle, generatePortfolioSpread, generateEventFlashback, latestMarketData, toast]);

  // Timeline controls
  const handlePlayPause = useCallback(() => {
    if (timeline.isPlaying) {
      pauseStory();
      setTimeline(prev => ({ ...prev, isPlaying: false }));
    } else {
      resumeStory();
      setTimeline(prev => ({ ...prev, isPlaying: true }));
    }
  }, [timeline.isPlaying, pauseStory, resumeStory]);

  const handleSpeedChange = useCallback((speed: number[]) => {
    setTimeline(prev => ({ ...prev, playbackSpeed: speed[0] }));
    // Adjust the story engine timing based on speed
    // Implementation would depend on story engine capabilities
  }, []);

  const handleVolumeChange = useCallback((volume: number[]) => {
    setTimeline(prev => ({ ...prev, volume: volume[0] }));
  }, []);

  const toggleMute = useCallback(() => {
    setTimeline(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const resetStory = useCallback(() => {
    clearStoryHistory();
    setTimeline(prev => ({ ...prev, currentPage: 1 }));
    toast({
      title: 'Story Reset',
      description: 'Comic timeline has been reset to the beginning.',
    });
  }, [clearStoryHistory, toast]);

  // Generate sample technical indicators for demo
  const sampleIndicators = [
    {
      name: 'RSI',
      value: 65.4,
      signal: 'bullish' as const,
      strength: 'moderate' as const,
      interpretation: 'Momentum building, watch for continuation'
    },
    {
      name: 'MACD',
      value: 2.3,
      signal: 'bullish' as const,
      strength: 'strong' as const,
      interpretation: 'Strong upward momentum confirmed'
    },
    {
      name: 'Bollinger',
      value: 0.8,
      signal: 'neutral' as const,
      strength: 'weak' as const,
      interpretation: 'Price approaching upper band resistance'
    }
  ];

  // Generate sample portfolio data for demo
  const samplePortfolio = {
    holdings: [
      {
        id: '1',
        symbol: 'BATMAN',
        name: 'Batman Character Rights',
        quantity: 100,
        averageCost: 85.50,
        currentPrice: 92.30,
        currentValue: 9230,
        gainLoss: 680,
        gainLossPercent: 7.95,
        type: 'character' as const,
        houseFavorite: true
      },
      {
        id: '2',
        symbol: 'SPIDERMAN',
        name: 'Spider-Man Rights',
        quantity: 50,
        averageCost: 124.75,
        currentPrice: 118.20,
        currentValue: 5910,
        gainLoss: -327.50,
        gainLossPercent: -5.25,
        type: 'character' as const
      },
      {
        id: '3',
        symbol: 'MARVEL_1',
        name: 'Amazing Fantasy #15',
        quantity: 1,
        averageCost: 2500.00,
        currentPrice: 2750.00,
        currentValue: 2750,
        gainLoss: 250,
        gainLossPercent: 10.0,
        type: 'comic' as const
      }
    ],
    stats: {
      totalValue: 17890,
      dayChange: 423.50,
      dayChangePercent: 2.42,
      totalGainLoss: 602.50,
      totalGainLossPercent: 3.49,
      diversificationScore: 7.8,
      cash: 5000
    }
  };

  // Get current chapter config
  const currentChapter = chapters.find(c => c.id === timeline.currentChapter) || chapters[0];

  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground transition-all duration-300",
      fullscreenMode && "fixed inset-0 z-50 bg-black"
    )} data-testid="sequential-trading-experience">
      
      {/* Header Controls */}
      <div className={cn(
        "sticky top-0 z-40 bg-background/95 backdrop-blur border-b",
        fullscreenMode && "absolute top-0 left-0 right-0 bg-black/90"
      )}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Title and House Theme */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl ">Sequential Art Trading</h1>
                <Badge variant="outline" className={cn(
                  "capitalize",
                  `house-${currentHouse}`
                )}>
                  {currentHouse}
                </Badge>
              </div>
              
              {/* Story Metrics */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>Issue #{currentIssue?.id.slice(-4) || '0001'}</span>
                <span>•</span>
                <span>Page {timeline.currentPage}/{timeline.totalPages}</span>
                <span>•</span>
                <span>{activePanels.length} Panels</span>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePlayPause}
                data-testid="button-play-pause"
              >
                {timeline.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetStory}
                data-testid="button-reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleMute}
                data-testid="button-mute"
              >
                {timeline.isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFullscreenMode(!fullscreenMode)}
                data-testid="button-fullscreen"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress 
                  value={(timeline.currentPage / timeline.totalPages) * 100} 
                  className="h-2"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>Speed:</span>
                <div className="w-16">
                  <Slider
                    value={[timeline.playbackSpeed]}
                    onValueChange={handleSpeedChange}
                    min={0.5}
                    max={3}
                    step={0.5}
                    className="h-2"
                  />
                </div>
                <span>{timeline.playbackSpeed}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Comic Experience */}
      <div className="container mx-auto px-4 py-6">
        {/* Chapter Navigation */}
        <Tabs 
          value={timeline.currentChapter} 
          onValueChange={switchChapter}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-card">
            {chapters.map((chapter) => {
              const IconComponent = chapter.icon;
              return (
                <TabsTrigger 
                  key={chapter.id}
                  value={chapter.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-testid={`tab-chapter-${chapter.id}`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{chapter.title}</span>
                  <span className="sm:hidden">{chapter.icon.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Chapter Content */}
          <div className="mt-6">
            <TabsContent value="live_trade" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Live Trade Story
                    {timeline.isPlaying && (
                      <Badge variant="default" className="animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Real-time market movements transformed into epic comic narratives
                  </p>
                </CardHeader>
                <CardContent>
                  <ComicPageLayout
                    layout="standard"
                    gutter="normal"
                    background="paper"
                    className="min-h-96"
                    data-testid="live-trade-comic-layout"
                  >
                    <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
                      {Array.from(latestMarketData.values()).slice(0, 6).map((marketData, index) => (
                        <MarketBeatPanel
                          key={`market-${marketData.assetId}-${index}`}
                          panelScript={{
                            id: `live-${index}`,
                            type: 'market_beat',
                            layoutSlot: 'center_focus',
                            narrativeBeats: [{
                              id: `beat-${index}`,
                              type: 'conflict',
                              text: `${marketData.symbol} ${marketData.changePercent > 0 ? 'surges' : 'struggles'} with ${Math.abs(marketData.changePercent).toFixed(1)}% movement!`,
                              emotion: marketData.changePercent > 0 ? 'excitement' : 'tension',
                              priority: 'high'
                            }],
                            dialogue: [{
                              id: `dialogue-${index}`,
                              speaker: 'market',
                              text: `${houseTheme.name} power flows through ${marketData.symbol}!`,
                              style: 'speech',
                              position: 'top-right',
                              timing: 500
                            }],
                            effects: [{
                              id: `effect-${index}`,
                              type: Math.abs(marketData.changePercent) > 5 ? 'explosion' : 'glow',
                              intensity: 'high',
                              duration: 1500,
                              delay: 0,
                              housePowered: true
                            }],
                            duration: 3000,
                            houseTheme: currentHouse,
                            timestamp: new Date()
                          }}
                          marketData={marketData}
                          isActive={index === 0}
                          autoAdvance={timeline.isPlaying}
                          showNarrative={storySettings.showNarratives}
                          effectIntensity={storySettings.effectIntensity}
                        />
                      ))}
                    </div>
                  </ComicPageLayout>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical_analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Technical Analysis Chronicle
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Market indicators and patterns revealed through mystical analysis
                  </p>
                </CardHeader>
                <CardContent>
                  <ComicPageLayout
                    layout="splash"
                    gutter="wide"
                    background="aged"
                    className="min-h-96"
                    data-testid="technical-analysis-comic-layout"
                  >
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                      {sampleIndicators.map((indicator, index) => (
                        <IndicatorPanel
                          key={`indicator-${index}`}
                          panelScript={{
                            id: `tech-${index}`,
                            type: 'indicator_analysis',
                            layoutSlot: 'center_focus',
                            narrativeBeats: [{
                              id: `analysis-${index}`,
                              type: 'setup',
                              text: `The ${indicator.name} oracle speaks of ${indicator.signal} energies...`,
                              emotion: 'mystery',
                              priority: 'normal'
                            }],
                            dialogue: [{
                              id: `tech-dialogue-${index}`,
                              speaker: 'house_spirit',
                              text: `${houseTheme.name} wisdom reveals ${indicator.name} patterns!`,
                              style: 'mystical',
                              position: 'center',
                              timing: 1000
                            }],
                            effects: [{
                              id: `tech-effect-${index}`,
                              type: 'glow',
                              intensity: 'normal',
                              duration: 2000,
                              delay: 500,
                              housePowered: true
                            }],
                            duration: 5000,
                            houseTheme: currentHouse,
                            timestamp: new Date()
                          }}
                          indicators={[indicator]}
                          isActive={index === 0}
                          showMysticalAnalysis={storySettings.housePoweredEffects}
                          analysisMode="mystical"
                          houseTheme={currentHouse}
                        />
                      ))}
                    </div>
                  </ComicPageLayout>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio_spread" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-500" />
                    Portfolio Spread
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your legendary holdings displayed as an interactive comic spread
                  </p>
                </CardHeader>
                <CardContent>
                  <PortfolioSpreadPanel
                    panelScript={{
                      id: 'portfolio-spread',
                      type: 'portfolio_overview',
                      layoutSlot: 'full_page',
                      narrativeBeats: [{
                        id: 'portfolio-beat',
                        type: 'resolution',
                        text: 'Your legendary portfolio stands revealed across the mystical realm...',
                        emotion: 'triumph',
                        priority: 'high'
                      }],
                      dialogue: [{
                        id: 'portfolio-dialogue',
                        speaker: 'narrator',
                        text: `Behold the power of ${currentHouse}! Your assets shine with market strength.`,
                        style: 'speech',
                        position: 'top-center',
                        timing: 0
                      }],
                      effects: [{
                        id: 'portfolio-particles',
                        type: 'particles',
                        intensity: 'high',
                        duration: 3000,
                        delay: 0,
                        housePowered: true
                      }],
                      duration: 10000,
                      houseTheme: currentHouse,
                      timestamp: new Date()
                    }}
                    holdings={samplePortfolio.holdings}
                    stats={samplePortfolio.stats}
                    isActive={timeline.currentChapter === 'portfolio_spread'}
                    onHoldingSelect={(holding) => setSelectedHolding(holding.id)}
                    selectedHoldingId={selectedHolding}
                    viewMode="spread"
                    showHouseHighlights={storySettings.housePoweredEffects}
                    houseTheme={currentHouse}
                    data-testid="portfolio-spread-display"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="event_flashback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    Event Flashbacks
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Market events and news transformed into dramatic flashback sequences
                  </p>
                </CardHeader>
                <CardContent>
                  <ComicPageLayout
                    layout="experimental"
                    gutter="bleed"
                    background="dark"
                    className="min-h-96"
                    data-testid="event-flashback-comic-layout"
                  >
                    <div className="relative h-full">
                      {/* Main flashback panel */}
                      <ComicPanel
                        variant="flashback"
                        house={currentHouse}
                        size="splash"
                        isActive={true}
                        narrativeText="A disturbance in the market force echoes from the past..."
                        className="absolute inset-0"
                      >
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <h3 className="text-2xl  mb-4 text-amber-700">
                            The Great Surge of 2023
                          </h3>
                          <p className="text-amber-600 mb-6">
                            When BATMAN soared beyond all expectations...
                          </p>
                          
                          {/* Historical chart visualization */}
                          <div className="w-full max-w-md h-32 bg-amber-50 rounded border-2 border-amber-600 flex items-center justify-center">
                            <TrendingUp className="h-16 w-16 text-amber-600" />
                          </div>
                        </div>

                        {/* Flashback speech bubble */}
                        <SpeechBubble
                          variant="whisper"
                          size="sm"
                          speaker="Memory"
                          className="absolute bottom-4 left-4 max-w-40"
                        >
                          Remember the triumph of that day...
                        </SpeechBubble>

                        {/* Time distortion effect */}
                        <CaptionBox
                          variant="time"
                          position="top-center"
                          timestamp="March 15, 2023"
                          className="bg-amber-100 border-amber-600"
                        >
                          Market surge echoes through time...
                        </CaptionBox>
                      </ComicPanel>
                    </div>
                  </ComicPageLayout>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Story Settings Panel */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Story Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm ">Narratives</label>
                <Button
                  variant={storySettings.showNarratives ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStorySettings(prev => ({
                    ...prev,
                    showNarratives: !prev.showNarratives
                  }))}
                  className="w-full"
                  data-testid="toggle-narratives"
                >
                  {storySettings.showNarratives ? 'Show' : 'Hide'} Narratives
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm ">House Effects</label>
                <Button
                  variant={storySettings.housePoweredEffects ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStorySettings(prev => ({
                    ...prev,
                    housePoweredEffects: !prev.housePoweredEffects
                  }))}
                  className="w-full"
                  data-testid="toggle-house-effects"
                >
                  {storySettings.housePoweredEffects ? 'Enable' : 'Disable'} House Power
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm ">Auto Story</label>
                <Button
                  variant={storySettings.autoGenerateStory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStorySettings(prev => ({
                    ...prev,
                    autoGenerateStory: !prev.autoGenerateStory
                  }))}
                  className="w-full"
                  data-testid="toggle-auto-story"
                >
                  {storySettings.autoGenerateStory ? 'Auto' : 'Manual'} Generation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Metrics Dashboard */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Story Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl ">{getStoryMetrics().totalPanels}</div>
                <div className="text-sm text-muted-foreground">Total Panels</div>
              </div>
              <div>
                <div className="text-2xl ">{(getStoryMetrics().storyCoherence * 100).toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Coherence</div>
              </div>
              <div>
                <div className="text-2xl ">{(getStoryMetrics().houseAlignment * 100).toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">House Alignment</div>
              </div>
              <div>
                <div className="text-2xl ">{latestMarketData.size}</div>
                <div className="text-sm text-muted-foreground">Live Assets</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}