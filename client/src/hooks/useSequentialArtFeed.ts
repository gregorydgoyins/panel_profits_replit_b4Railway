/**
 * useSequentialArtFeed Hook
 * Merges WebSocket market data with derived trading metrics for sequential art story generation
 * Provides real-time comic panel transitions and story progression
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQuery } from '@tanstack/react-query';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { sequentialStoryEngine, type PanelScript, type ComicIssue } from '@/services/sequentialStoryEngine';
import type { MarketDataUpdate } from '@/services/websocketService';

interface TechnicalIndicators {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  sma: { [period: string]: number };
  ema: { [period: string]: number };
  bollinger: { upper: number; middle: number; lower: number };
  volume: {
    average: number;
    ratio: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

interface DerivedMetrics {
  volatility: number;
  momentum: 'bullish' | 'bearish' | 'neutral';
  strength: 'weak' | 'moderate' | 'strong' | 'extreme';
  trend: 'uptrend' | 'downtrend' | 'sideways';
  support: number;
  resistance: number;
  breakout: boolean;
  tradingOpportunity: 'buy' | 'sell' | 'hold' | 'watch';
}

interface StorySceneTransition {
  from: string;
  to: string;
  trigger: 'price_movement' | 'volume_spike' | 'indicator_signal' | 'time_based' | 'user_action';
  intensity: 'subtle' | 'dramatic' | 'explosive';
  narrative: string;
}

interface SequentialArtFeedData {
  // Current State
  activePanels: PanelScript[];
  currentIssue: ComicIssue | null;
  currentPage: number;
  isAutoAdvancing: boolean;
  
  // Market Data
  latestMarketData: Map<string, MarketDataUpdate>;
  technicalIndicators: Map<string, TechnicalIndicators>;
  derivedMetrics: Map<string, DerivedMetrics>;
  
  // Story Progression
  storyTimeline: PanelScript[];
  recentTransitions: StorySceneTransition[];
  narrativeHistory: string[];
  
  // Performance Metrics
  panelTransitionRate: number;
  averagePanelDuration: number;
  storyCoherence: number;
}

interface UseSequentialArtFeedOptions {
  watchedAssets?: string[];
  autoAdvance?: boolean;
  transitionDelay?: number;
  storyMode?: 'live_trade' | 'technical_analysis' | 'portfolio_spread' | 'event_flashback' | 'full_story';
  maxPanelsInMemory?: number;
  enableDerivedMetrics?: boolean;
  houseTheme?: string;
}

interface UseSequentialArtFeedReturn extends SequentialArtFeedData {
  // Actions
  subscribeToAsset: (assetId: string) => void;
  unsubscribeFromAsset: (assetId: string) => void;
  triggerPanelTransition: (targetPanel?: string) => void;
  pauseStory: () => void;
  resumeStory: () => void;
  jumpToPanel: (panelId: string) => void;
  regenerateCurrentPage: () => void;
  
  // Story Generation
  generateLiveTradeStory: (duration?: number) => Promise<PanelScript[]>;
  generateTechnicalChronicle: (assetId: string) => Promise<PanelScript[]>;
  generatePortfolioSpread: () => Promise<PanelScript[]>;
  generateEventFlashback: (eventType: string) => Promise<PanelScript[]>;
  
  // Story Controls
  setStoryMode: (mode: UseSequentialArtFeedOptions['storyMode']) => void;
  setAutoAdvance: (enabled: boolean) => void;
  clearStoryHistory: () => void;
  
  // Metrics & Analytics
  getStoryMetrics: () => {
    totalPanels: number;
    averageEngagement: number;
    storyCoherence: number;
    houseAlignment: number;
  };
}

export function useSequentialArtFeed(options: UseSequentialArtFeedOptions = {}): UseSequentialArtFeedReturn {
  const {
    watchedAssets = [],
    autoAdvance = true,
    transitionDelay = 3000,
    storyMode = 'live_trade',
    maxPanelsInMemory = 50,
    enableDerivedMetrics = true,
    houseTheme: optionsHouseTheme
  } = options;

  // Hooks
  const { currentHouse, houseTheme } = useHouseTheme();
  const activeHouseTheme = optionsHouseTheme || currentHouse;
  
  const {
    marketData,
    subscribeToAsset: wsSubscribeToAsset,
    unsubscribeFromAsset: wsUnsubscribeFromAsset,
    isConnected
  } = useWebSocket({
    subscribeTo: { assets: watchedAssets }
  });

  // State
  const [feedData, setFeedData] = useState<SequentialArtFeedData>({
    activePanels: [],
    currentIssue: null,
    currentPage: 0,
    isAutoAdvancing: autoAdvance,
    latestMarketData: new Map(),
    technicalIndicators: new Map(),
    derivedMetrics: new Map(),
    storyTimeline: [],
    recentTransitions: [],
    narrativeHistory: [],
    panelTransitionRate: 0,
    averagePanelDuration: transitionDelay,
    storyCoherence: 0.8
  });

  const [currentStoryMode, setCurrentStoryMode] = useState(storyMode);
  const [transitionTimer, setTransitionTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch technical indicators for watched assets
  const { data: technicalData } = useQuery({
    queryKey: ['/api/technical-indicators', watchedAssets],
    enabled: watchedAssets.length > 0 && enableDerivedMetrics,
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Compute derived metrics from market data
  const computeDerivedMetrics = useCallback((assetId: string, marketUpdate: MarketDataUpdate): DerivedMetrics => {
    const changePercent = Math.abs(marketUpdate.changePercent);
    
    return {
      volatility: changePercent / 10, // Normalize to 0-1 scale
      momentum: marketUpdate.changePercent > 2 ? 'bullish' : 
                marketUpdate.changePercent < -2 ? 'bearish' : 'neutral',
      strength: changePercent > 10 ? 'extreme' :
                changePercent > 5 ? 'strong' :
                changePercent > 2 ? 'moderate' : 'weak',
      trend: marketUpdate.changePercent > 0 ? 'uptrend' : 
             marketUpdate.changePercent < 0 ? 'downtrend' : 'sideways',
      support: marketUpdate.currentPrice * 0.95,
      resistance: marketUpdate.currentPrice * 1.05,
      breakout: Math.abs(marketUpdate.changePercent) > 5,
      tradingOpportunity: marketUpdate.changePercent > 3 ? 'buy' :
                         marketUpdate.changePercent < -3 ? 'sell' : 'hold'
    };
  }, []);

  // Generate panel script from market data
  const generatePanelFromMarketData = useCallback((
    marketUpdate: MarketDataUpdate,
    previousMetrics?: DerivedMetrics
  ): PanelScript => {
    const currentMetrics = computeDerivedMetrics(marketUpdate.assetId, marketUpdate);
    
    // Build trading context
    const tradingContext = {
      orderFlow: {
        buys: marketUpdate.volume * (marketUpdate.changePercent > 0 ? 0.6 : 0.4),
        sells: marketUpdate.volume * (marketUpdate.changePercent > 0 ? 0.4 : 0.6),
        volume: marketUpdate.volume
      },
      portfolioImpact: {
        affectedHoldings: [marketUpdate.assetId],
        valueChange: marketUpdate.change,
        percentChange: marketUpdate.changePercent
      }
    };

    return sequentialStoryEngine.generatePanelScript(
      marketUpdate,
      tradingContext,
      activeHouseTheme
    );
  }, [computeDerivedMetrics, activeHouseTheme]);

  // Handle new market data
  useEffect(() => {
    if (!isConnected) return;

    const latestData = new Map(feedData.latestMarketData);
    const newMetrics = new Map(feedData.derivedMetrics);
    const newPanels: PanelScript[] = [];

    // Process each market data update
    marketData.forEach((marketUpdate, assetId) => {
      const previousData = latestData.get(assetId);
      latestData.set(assetId, marketUpdate);

      if (enableDerivedMetrics) {
        const previousMetrics = newMetrics.get(assetId);
        const currentMetrics = computeDerivedMetrics(assetId, marketUpdate);
        newMetrics.set(assetId, currentMetrics);

        // Generate panel if significant change
        if (!previousData || Math.abs(marketUpdate.changePercent) > 1) {
          const panel = generatePanelFromMarketData(marketUpdate, previousMetrics);
          newPanels.push(panel);
        }
      }
    });

    if (newPanels.length > 0) {
      setFeedData(prev => ({
        ...prev,
        latestMarketData: latestData,
        derivedMetrics: newMetrics,
        storyTimeline: [...prev.storyTimeline, ...newPanels].slice(-maxPanelsInMemory),
        activePanels: currentStoryMode === 'live_trade' ? newPanels.slice(-3) : prev.activePanels
      }));
    }
  }, [marketData, isConnected, enableDerivedMetrics, computeDerivedMetrics, generatePanelFromMarketData, currentStoryMode, maxPanelsInMemory, feedData.latestMarketData, feedData.derivedMetrics]);

  // Auto-advance story panels
  useEffect(() => {
    if (!feedData.isAutoAdvancing || feedData.activePanels.length === 0) {
      if (transitionTimer) {
        clearTimeout(transitionTimer);
        setTransitionTimer(null);
      }
      return;
    }

    const timer = setTimeout(() => {
      triggerPanelTransition();
    }, transitionDelay);

    setTransitionTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [feedData.isAutoAdvancing, feedData.activePanels, transitionDelay]);

  // Story generation functions
  const generateLiveTradeStory = useCallback(async (duration: number = 30000): Promise<PanelScript[]> => {
    const sessionData = {
      marketUpdates: Array.from(feedData.latestMarketData.values()),
      tradingActions: [],
      timeframe: '5m'
    };

    const panels = sequentialStoryEngine.generateChapterStoryBeats(
      'live_trade',
      sessionData,
      activeHouseTheme
    );

    return panels;
  }, [feedData.latestMarketData, activeHouseTheme]);

  const generateTechnicalChronicle = useCallback(async (assetId: string): Promise<PanelScript[]> => {
    const marketData = feedData.latestMarketData.get(assetId);
    const technicalIndicators = feedData.technicalIndicators.get(assetId);

    if (!marketData) return [];

    const panels = sequentialStoryEngine.generateChapterStoryBeats(
      'technical_analysis',
      { marketData, technicalIndicators },
      activeHouseTheme
    );

    return panels;
  }, [feedData.latestMarketData, feedData.technicalIndicators, activeHouseTheme]);

  const generatePortfolioSpread = useCallback(async (): Promise<PanelScript[]> => {
    const portfolioData = {
      holdings: Array.from(feedData.latestMarketData.values()),
      totalValue: 0,
      dayChange: 0
    };

    const panels = sequentialStoryEngine.generateChapterStoryBeats(
      'portfolio_spread',
      portfolioData,
      activeHouseTheme
    );

    return panels;
  }, [feedData.latestMarketData, activeHouseTheme]);

  const generateEventFlashback = useCallback(async (eventType: string): Promise<PanelScript[]> => {
    const eventData = {
      type: eventType,
      timestamp: new Date(),
      impact: 'major'
    };

    const panels = sequentialStoryEngine.generateChapterStoryBeats(
      'event_flashback',
      eventData,
      activeHouseTheme
    );

    return panels;
  }, [activeHouseTheme]);

  // Control functions
  const subscribeToAsset = useCallback((assetId: string) => {
    wsSubscribeToAsset(assetId);
  }, [wsSubscribeToAsset]);

  const unsubscribeFromAsset = useCallback((assetId: string) => {
    wsUnsubscribeFromAsset(assetId);
  }, [wsUnsubscribeFromAsset]);

  const triggerPanelTransition = useCallback((targetPanel?: string) => {
    setFeedData(prev => {
      const currentIndex = prev.activePanels.findIndex(p => p.id === targetPanel) || 0;
      const nextIndex = targetPanel ? currentIndex : (currentIndex + 1) % Math.max(prev.storyTimeline.length, 1);
      
      if (prev.storyTimeline.length === 0) return prev;

      const nextPanel = prev.storyTimeline[nextIndex];
      if (!nextPanel) return prev;

      const transition: StorySceneTransition = {
        from: prev.activePanels[0]?.id || 'start',
        to: nextPanel.id,
        trigger: 'time_based',
        intensity: 'subtle',
        narrative: `Transitioning to ${nextPanel.type} panel`
      };

      return {
        ...prev,
        activePanels: [nextPanel],
        recentTransitions: [transition, ...prev.recentTransitions.slice(0, 9)],
        currentPage: Math.floor(nextIndex / 6) // Assuming 6 panels per page
      };
    });
  }, []);

  const pauseStory = useCallback(() => {
    setFeedData(prev => ({ ...prev, isAutoAdvancing: false }));
    if (transitionTimer) {
      clearTimeout(transitionTimer);
      setTransitionTimer(null);
    }
  }, [transitionTimer]);

  const resumeStory = useCallback(() => {
    setFeedData(prev => ({ ...prev, isAutoAdvancing: true }));
  }, []);

  const jumpToPanel = useCallback((panelId: string) => {
    const panelIndex = feedData.storyTimeline.findIndex(p => p.id === panelId);
    if (panelIndex >= 0) {
      triggerPanelTransition(panelId);
    }
  }, [feedData.storyTimeline, triggerPanelTransition]);

  const regenerateCurrentPage = useCallback(() => {
    const currentPanels = feedData.activePanels;
    if (currentPanels.length === 0) return;

    // Regenerate panels based on current market data
    const latestData = Array.from(feedData.latestMarketData.values());
    if (latestData.length > 0) {
      const newPanels = latestData.map(data => generatePanelFromMarketData(data));
      setFeedData(prev => ({
        ...prev,
        activePanels: newPanels.slice(0, 3),
        storyTimeline: [...prev.storyTimeline, ...newPanels]
      }));
    }
  }, [feedData.activePanels, feedData.latestMarketData, generatePanelFromMarketData]);

  const setStoryMode = useCallback((mode: UseSequentialArtFeedOptions['storyMode']) => {
    setCurrentStoryMode(mode);
    
    // Generate appropriate panels for the new mode
    switch (mode) {
      case 'live_trade':
        generateLiveTradeStory().then(panels => {
          setFeedData(prev => ({
            ...prev,
            activePanels: panels.slice(0, 3),
            storyTimeline: [...prev.storyTimeline, ...panels]
          }));
        });
        break;
      case 'portfolio_spread':
        generatePortfolioSpread().then(panels => {
          setFeedData(prev => ({
            ...prev,
            activePanels: panels,
            storyTimeline: [...prev.storyTimeline, ...panels]
          }));
        });
        break;
    }
  }, [generateLiveTradeStory, generatePortfolioSpread]);

  const setAutoAdvance = useCallback((enabled: boolean) => {
    setFeedData(prev => ({ ...prev, isAutoAdvancing: enabled }));
  }, []);

  const clearStoryHistory = useCallback(() => {
    setFeedData(prev => ({
      ...prev,
      storyTimeline: [],
      activePanels: [],
      recentTransitions: [],
      narrativeHistory: []
    }));
    sequentialStoryEngine.clearStoryHistory();
  }, []);

  const getStoryMetrics = useCallback(() => {
    return {
      totalPanels: feedData.storyTimeline.length,
      averageEngagement: 0.75, // Placeholder metric
      storyCoherence: feedData.storyCoherence,
      houseAlignment: 0.9 // How well story aligns with house theme
    };
  }, [feedData.storyTimeline.length, feedData.storyCoherence]);

  return {
    // Current State
    ...feedData,
    
    // Actions
    subscribeToAsset,
    unsubscribeFromAsset,
    triggerPanelTransition,
    pauseStory,
    resumeStory,
    jumpToPanel,
    regenerateCurrentPage,
    
    // Story Generation
    generateLiveTradeStory,
    generateTechnicalChronicle,
    generatePortfolioSpread,
    generateEventFlashback,
    
    // Story Controls
    setStoryMode,
    setAutoAdvance,
    clearStoryHistory,
    
    // Metrics & Analytics
    getStoryMetrics
  };
}

export default useSequentialArtFeed;