/**
 * Sequential Story Engine - Transforms trading data into comic panel narratives
 * Maps market movements, technical indicators, and portfolio changes into visual storytelling
 */

import type { MythologicalHouse } from '@/contexts/HouseThemeContext';
import type { MarketDataUpdate } from '@/services/websocketService';

// Data Contracts
export interface PanelScript {
  id: string;
  type: PanelType;
  layoutSlot: LayoutSlot;
  narrativeBeats: NarrativeBeat[];
  dialogue: DialogueElement[];
  effects: VisualEffect[];
  duration: number; // How long panel should be displayed (ms)
  triggerConditions?: TriggerCondition[];
  houseTheme?: MythologicalHouse;
  timestamp: Date;
}

export interface NarrativeBeat {
  id: string;
  type: 'setup' | 'conflict' | 'climax' | 'resolution';
  text: string;
  emotion: 'excitement' | 'tension' | 'triumph' | 'despair' | 'mystery' | 'calm';
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export interface DialogueElement {
  id: string;
  speaker: 'narrator' | 'market' | 'trader' | 'ai' | 'house_spirit';
  text: string;
  style: 'speech' | 'thought' | 'whisper' | 'shout' | 'mystical';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  timing: number; // When to show (ms from panel start)
}

export interface VisualEffect {
  id: string;
  type: 'sound' | 'speed_lines' | 'explosion' | 'glow' | 'shake' | 'particles';
  intensity: 'low' | 'normal' | 'high' | 'extreme';
  duration: number;
  delay: number;
  housePowered?: boolean; // Use house-specific effect variations
}

export interface TriggerCondition {
  metric: string;
  operator: '>' | '<' | '=' | 'change' | 'trend';
  value: number;
  timeframe?: '1m' | '5m' | '15m' | '1h';
}

export type PanelType = 
  | 'market_beat'           // Live price movements
  | 'indicator_analysis'    // Technical analysis
  | 'order_execution'       // Trade execution stories
  | 'portfolio_overview'    // Portfolio spread view
  | 'news_flash'           // Breaking news/events
  | 'house_blessing'       // House-specific bonuses/events
  | 'achievement'          // Trading milestones
  | 'flashback';           // Historical context

export type LayoutSlot = 
  | 'full_page'            // Takes entire comic page
  | 'top_row'              // Top row of page
  | 'bottom_row'           // Bottom row
  | 'left_column'          // Left side column
  | 'right_column'         // Right side column
  | 'center_focus'         // Center spotlight panel
  | 'corner_insert'        // Small corner panel
  | 'splash_overlay';      // Overlay on existing panels

export interface StoryBeat {
  category: 'live_trade' | 'technical_analysis' | 'portfolio_spread' | 'event_flashback';
  significance: 'minor' | 'moderate' | 'major' | 'historic';
  marketContext: MarketContext;
  tradingContext: TradingContext;
  narrativeArc: NarrativeArc;
}

export interface MarketContext {
  asset: {
    id: string;
    symbol: string;
    name: string;
    type: 'character' | 'comic' | 'creator' | 'publisher';
  };
  priceData: {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
    volume: number;
    high24h?: number;
    low24h?: number;
  };
  technicalIndicators: {
    rsi?: number;
    macd?: { value: number; signal: number; histogram: number };
    sma?: { [period: string]: number };
    ema?: { [period: string]: number };
    bollinger?: { upper: number; middle: number; lower: number };
  };
  sentiment: {
    score: number; // -1 to 1
    confidence: number; // 0 to 1
    sources: string[];
  };
}

export interface TradingContext {
  orderFlow: {
    buys: number;
    sells: number;
    volume: number;
  };
  portfolioImpact: {
    affectedHoldings: string[];
    valueChange: number;
    percentChange: number;
  };
  userAction?: {
    type: 'buy' | 'sell' | 'watch' | 'analyze';
    timestamp: Date;
    details: any;
  };
}

export interface NarrativeArc {
  title: string;
  description: string;
  characters: string[]; // Market participants, houses, etc.
  conflict: string;
  stakes: string;
  resolution?: string;
  nextBeat?: string;
}

export interface ComicIssue {
  id: string;
  title: string;
  coverPage: PanelScript;
  pages: ComicPage[];
  totalPages: number;
  currentPage: number;
  startTime: Date;
  estimatedDuration: number; // ms
  houseTheme: MythologicalHouse;
}

export interface ComicPage {
  id: string;
  pageNumber: number;
  layout: 'standard' | 'splash' | 'widescreen' | 'portrait' | 'experimental';
  panels: PanelScript[];
  pageNarrative: string;
  transitions: PageTransition[];
}

export interface PageTransition {
  from: string; // panel id or 'page_start'
  to: string;   // panel id or 'page_end'
  type: 'fade' | 'slide' | 'flip' | 'zoom' | 'shatter' | 'dissolve';
  duration: number;
  trigger: 'auto' | 'click' | 'data_change';
}

export class SequentialStoryEngine {
  private activePanels = new Map<string, PanelScript>();
  private storyHistory: StoryBeat[] = [];
  private currentIssue: ComicIssue | null = null;
  private narrativeTemplates = new Map<PanelType, string[]>();
  private housePoweredNarratives = new Map<MythologicalHouse, Map<PanelType, string[]>>();

  constructor() {
    this.initializeNarrativeTemplates();
    this.initializeHousePoweredNarratives();
  }

  /**
   * Main entry point: Transform market data into comic panel script
   */
  generatePanelScript(
    marketData: MarketDataUpdate, 
    tradingContext: TradingContext,
    houseTheme: MythologicalHouse = 'heroes'
  ): PanelScript {
    const marketContext = this.buildMarketContext(marketData);
    const storyBeat = this.analyzeStoryBeat(marketContext, tradingContext);
    
    return this.createPanelScript(storyBeat, houseTheme);
  }

  /**
   * Generate full comic issue from trading session data
   */
  generateComicIssue(
    sessionData: {
      marketUpdates: MarketDataUpdate[];
      tradingActions: any[];
      timeframe: string;
    },
    houseTheme: MythologicalHouse = 'heroes'
  ): ComicIssue {
    const storyBeats = this.analyzeSessionStoryBeats(sessionData);
    const pages = this.groupStoryBeatsIntoPages(storyBeats, houseTheme);
    
    const issue: ComicIssue = {
      id: `issue_${Date.now()}`,
      title: this.generateIssueTitle(storyBeats, houseTheme),
      coverPage: this.generateCoverPage(storyBeats[0], houseTheme),
      pages,
      totalPages: pages.length,
      currentPage: 1,
      startTime: new Date(),
      estimatedDuration: pages.length * 30000, // 30s per page
      houseTheme
    };

    this.currentIssue = issue;
    return issue;
  }

  /**
   * Generate story beats for different chapters
   */
  generateChapterStoryBeats(
    chapter: 'live_trade' | 'technical_analysis' | 'portfolio_spread' | 'event_flashback',
    data: any,
    houseTheme: MythologicalHouse
  ): PanelScript[] {
    switch (chapter) {
      case 'live_trade':
        return this.generateLiveTradeStory(data, houseTheme);
      case 'technical_analysis':
        return this.generateTechnicalAnalysisChronicle(data, houseTheme);
      case 'portfolio_spread':
        return this.generatePortfolioSpread(data, houseTheme);
      case 'event_flashback':
        return this.generateEventFlashbacks(data, houseTheme);
      default:
        return [];
    }
  }

  private buildMarketContext(marketData: MarketDataUpdate): MarketContext {
    return {
      asset: {
        id: marketData.assetId,
        symbol: marketData.symbol,
        name: marketData.symbol, // Could be enriched with asset lookup
        type: 'character' // Default, could be determined from asset metadata
      },
      priceData: {
        current: marketData.currentPrice,
        previous: marketData.currentPrice - marketData.change,
        change: marketData.change,
        changePercent: marketData.changePercent,
        volume: marketData.volume
      },
      technicalIndicators: {
        // Placeholder - would be populated from technical analysis service
        rsi: Math.random() * 100
      },
      sentiment: {
        score: (Math.random() - 0.5) * 2, // -1 to 1
        confidence: Math.random(),
        sources: ['market_analysis', 'social_sentiment']
      }
    };
  }

  private analyzeStoryBeat(
    marketContext: MarketContext, 
    tradingContext: TradingContext
  ): StoryBeat {
    const significance = this.determineSignificance(marketContext);
    const category = this.determineBeatCategory(marketContext, tradingContext);
    
    return {
      category,
      significance,
      marketContext,
      tradingContext,
      narrativeArc: this.buildNarrativeArc(marketContext, significance)
    };
  }

  private createPanelScript(storyBeat: StoryBeat, houseTheme: MythologicalHouse): PanelScript {
    const panelType = this.mapCategoryToPanelType(storyBeat.category);
    const narrativeBeats = this.generateNarrativeBeats(storyBeat, houseTheme);
    const dialogue = this.generateDialogue(storyBeat, houseTheme);
    const effects = this.generateVisualEffects(storyBeat, houseTheme);
    
    return {
      id: `panel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: panelType,
      layoutSlot: this.determineLayoutSlot(storyBeat),
      narrativeBeats,
      dialogue,
      effects,
      duration: this.calculatePanelDuration(storyBeat),
      houseTheme,
      timestamp: new Date()
    };
  }

  private generateLiveTradeStory(data: any, houseTheme: MythologicalHouse): PanelScript[] {
    // Live Trade Story - Real-time panels cycling every N seconds
    const panels: PanelScript[] = [];
    
    // Generate rapid-fire panels for live price movements
    for (let i = 0; i < 6; i++) {
      panels.push({
        id: `live_${i}`,
        type: 'market_beat',
        layoutSlot: 'center_focus',
        narrativeBeats: [{
          id: `beat_${i}`,
          type: 'conflict',
          text: this.getLiveTradeNarrative(houseTheme, i),
          emotion: 'excitement',
          priority: 'high'
        }],
        dialogue: [{
          id: `dialogue_${i}`,
          speaker: 'market',
          text: `${this.getHouseTradingPhrase(houseTheme)} The price surges!`,
          style: 'speech',
          position: 'top-right',
          timing: 500
        }],
        effects: [{
          id: `effect_${i}`,
          type: 'speed_lines',
          intensity: 'high',
          duration: 1000,
          delay: 0,
          housePowered: true
        }],
        duration: 3000,
        houseTheme,
        timestamp: new Date()
      });
    }
    
    return panels;
  }

  private generateTechnicalAnalysisChronicle(data: any, houseTheme: MythologicalHouse): PanelScript[] {
    // Technical Analysis Chronicle - Panels narrating indicator changes
    return [{
      id: 'tech_analysis',
      type: 'indicator_analysis',
      layoutSlot: 'full_page',
      narrativeBeats: [{
        id: 'analysis_beat',
        type: 'setup',
        text: 'The ancient charts reveal hidden patterns...',
        emotion: 'mystery',
        priority: 'normal'
      }],
      dialogue: [{
        id: 'analyst_dialogue',
        speaker: 'house_spirit',
        text: this.getHouseAnalysisPhrase(houseTheme),
        style: 'mystical',
        position: 'center',
        timing: 1000
      }],
      effects: [{
        id: 'mystical_glow',
        type: 'glow',
        intensity: 'normal',
        duration: 2000,
        delay: 500,
        housePowered: true
      }],
      duration: 5000,
      houseTheme,
      timestamp: new Date()
    }];
  }

  private generatePortfolioSpread(data: any, houseTheme: MythologicalHouse): PanelScript[] {
    // Portfolio Spread - Static multi-panel overview with interactive selection
    return [{
      id: 'portfolio_spread',
      type: 'portfolio_overview',
      layoutSlot: 'full_page',
      narrativeBeats: [{
        id: 'portfolio_beat',
        type: 'resolution',
        text: 'Your legendary portfolio stands revealed across the mystical realm...',
        emotion: 'triumph',
        priority: 'high'
      }],
      dialogue: [{
        id: 'portfolio_dialogue',
        speaker: 'narrator',
        text: `Behold the power of ${houseTheme}! Your assets shine with divine light.`,
        style: 'speech',
        position: 'top-center',
        timing: 0
      }],
      effects: [{
        id: 'portfolio_particles',
        type: 'particles',
        intensity: 'high',
        duration: 3000,
        delay: 0,
        housePowered: true
      }],
      duration: 10000, // Longer for interactive exploration
      houseTheme,
      timestamp: new Date()
    }];
  }

  private generateEventFlashbacks(data: any, houseTheme: MythologicalHouse): PanelScript[] {
    // Event Flashbacks - Speech bubbles + caption boxes triggered by major events
    return [{
      id: 'event_flashback',
      type: 'flashback',
      layoutSlot: 'splash_overlay',
      narrativeBeats: [{
        id: 'flashback_beat',
        type: 'climax',
        text: 'A disturbance in the market force echoes from the past...',
        emotion: 'tension',
        priority: 'critical'
      }],
      dialogue: [{
        id: 'flashback_dialogue',
        speaker: 'narrator',
        text: 'Remember the great surge of yesteryear...',
        style: 'whisper',
        position: 'bottom-left',
        timing: 1500
      }],
      effects: [{
        id: 'time_distortion',
        type: 'shake',
        intensity: 'low',
        duration: 2000,
        delay: 1000,
        housePowered: false
      }],
      duration: 4000,
      houseTheme,
      timestamp: new Date()
    }];
  }

  // Utility methods for narrative generation
  private initializeNarrativeTemplates(): void {
    this.narrativeTemplates.set('market_beat', [
      'The market pulses with ancient energy!',
      'Price movements tell tales of epic battles!',
      'A new chapter unfolds in the trading saga!'
    ]);
    
    this.narrativeTemplates.set('indicator_analysis', [
      'The technical oracles speak of hidden patterns...',
      'Chart formations reveal the path ahead...',
      'Sacred indicators align in mystical harmony!'
    ]);
    
    this.narrativeTemplates.set('order_execution', [
      'Your trading spell takes effect!',
      'The market responds to your command!',
      'Victory! Your order finds its mark!'
    ]);
  }

  private initializeHousePoweredNarratives(): void {
    // House-specific narrative variations
    const heroesNarratives = new Map<PanelType, string[]>();
    heroesNarratives.set('market_beat', [
      'With righteous determination, the price charges forward!',
      'Justice prevails as market forces align!',
      'The heroic bull rally answers the call!'
    ]);
    
    const wisdomNarratives = new Map<PanelType, string[]>();
    wisdomNarratives.set('market_beat', [
      'Ancient knowledge guides the price to its destiny...',
      'The wise market moves with calculated precision...',
      'Scholarly analysis reveals the true path!'
    ]);
    
    this.housePoweredNarratives.set('heroes', heroesNarratives);
    this.housePoweredNarratives.set('wisdom', wisdomNarratives);
  }

  private determineSignificance(marketContext: MarketContext): 'minor' | 'moderate' | 'major' | 'historic' {
    const changePercent = Math.abs(marketContext.priceData.changePercent);
    
    if (changePercent > 20) return 'historic';
    if (changePercent > 10) return 'major';
    if (changePercent > 5) return 'moderate';
    return 'minor';
  }

  private determineBeatCategory(
    marketContext: MarketContext, 
    tradingContext: TradingContext
  ): 'live_trade' | 'technical_analysis' | 'portfolio_spread' | 'event_flashback' {
    // Simple logic - could be more sophisticated
    if (tradingContext.userAction) return 'live_trade';
    if (marketContext.technicalIndicators.rsi) return 'technical_analysis';
    if (tradingContext.portfolioImpact.affectedHoldings.length > 0) return 'portfolio_spread';
    return 'event_flashback';
  }

  private mapCategoryToPanelType(category: string): PanelType {
    const mapping: Record<string, PanelType> = {
      'live_trade': 'market_beat',
      'technical_analysis': 'indicator_analysis',
      'portfolio_spread': 'portfolio_overview',
      'event_flashback': 'flashback'
    };
    return mapping[category] || 'market_beat';
  }

  private buildNarrativeArc(marketContext: MarketContext, significance: string): NarrativeArc {
    return {
      title: `The ${significance} Movement of ${marketContext.asset.symbol}`,
      description: `Price ${marketContext.priceData.change > 0 ? 'surge' : 'decline'} creates market drama`,
      characters: ['traders', 'market_makers', 'bulls', 'bears'],
      conflict: `${marketContext.asset.symbol} faces resistance at $${marketContext.priceData.current}`,
      stakes: `$${Math.abs(marketContext.priceData.change * marketContext.priceData.volume)} in volume`
    };
  }

  private generateNarrativeBeats(storyBeat: StoryBeat, houseTheme: MythologicalHouse): NarrativeBeat[] {
    const templates = this.housePoweredNarratives.get(houseTheme)?.get('market_beat') || 
                     this.narrativeTemplates.get('market_beat') || 
                     ['The market moves with purpose!'];
    
    return [{
      id: 'main_beat',
      type: 'conflict',
      text: templates[Math.floor(Math.random() * templates.length)],
      emotion: storyBeat.marketContext.priceData.change > 0 ? 'excitement' : 'tension',
      priority: storyBeat.significance === 'historic' ? 'critical' : 'normal'
    }];
  }

  private generateDialogue(storyBeat: StoryBeat, houseTheme: MythologicalHouse): DialogueElement[] {
    return [{
      id: 'main_dialogue',
      speaker: 'market',
      text: this.getHouseTradingPhrase(houseTheme),
      style: 'speech',
      position: 'top-right',
      timing: 500
    }];
  }

  private generateVisualEffects(storyBeat: StoryBeat, houseTheme: MythologicalHouse): VisualEffect[] {
    const intensity = storyBeat.significance === 'historic' ? 'extreme' : 
                     storyBeat.significance === 'major' ? 'high' : 'normal';
    
    return [{
      id: 'main_effect',
      type: Math.abs(storyBeat.marketContext.priceData.changePercent) > 10 ? 'explosion' : 'glow',
      intensity,
      duration: 1500,
      delay: 0,
      housePowered: true
    }];
  }

  private determineLayoutSlot(storyBeat: StoryBeat): LayoutSlot {
    switch (storyBeat.significance) {
      case 'historic':
        return 'full_page';
      case 'major':
        return 'splash_overlay';
      case 'moderate':
        return 'center_focus';
      default:
        return 'right_column';
    }
  }

  private calculatePanelDuration(storyBeat: StoryBeat): number {
    const baseDuration = 3000; // 3 seconds
    const significanceMultiplier = {
      'minor': 0.5,
      'moderate': 1,
      'major': 1.5,
      'historic': 3
    }[storyBeat.significance];
    
    return baseDuration * significanceMultiplier;
  }

  private analyzeSessionStoryBeats(sessionData: any): StoryBeat[] {
    // Analyze session data and return story beats
    // Placeholder implementation
    return [];
  }

  private groupStoryBeatsIntoPages(storyBeats: StoryBeat[], houseTheme: MythologicalHouse): ComicPage[] {
    // Group story beats into comic pages
    // Placeholder implementation
    return [];
  }

  private generateIssueTitle(storyBeats: StoryBeat[], houseTheme: MythologicalHouse): string {
    return `The ${houseTheme} Trading Chronicles - Issue #${Date.now()}`;
  }

  private generateCoverPage(storyBeat: StoryBeat, houseTheme: MythologicalHouse): PanelScript {
    return {
      id: 'cover',
      type: 'market_beat',
      layoutSlot: 'full_page',
      narrativeBeats: [],
      dialogue: [],
      effects: [],
      duration: 2000,
      houseTheme,
      timestamp: new Date()
    };
  }

  private getLiveTradeNarrative(houseTheme: MythologicalHouse, index: number): string {
    const narratives = {
      heroes: [
        'The brave bull charges into battle!',
        'Heroic momentum builds unstoppably!',
        'Victory is within reach!'
      ],
      wisdom: [
        'Ancient patterns guide the way...',
        'Scholarly analysis reveals truth...',
        'Knowledge becomes power!'
      ]
    };
    
    const houseNarratives = narratives[houseTheme] || narratives.heroes;
    return houseNarratives[index % houseNarratives.length];
  }

  private getHouseTradingPhrase(houseTheme: MythologicalHouse): string {
    const phrases = {
      heroes: 'For honor and profit!',
      wisdom: 'Knowledge is the key...',
      power: 'Might makes right!',
      mystery: 'The shadows whisper secrets...',
      elements: 'Nature\'s force guides us!',
      time: 'Time reveals all truths...',
      spirit: 'Unity brings strength!'
    };
    
    return phrases[houseTheme] || phrases.heroes;
  }

  private getHouseAnalysisPhrase(houseTheme: MythologicalHouse): string {
    const phrases = {
      heroes: 'The righteous path becomes clear!',
      wisdom: 'Ancient charts reveal hidden wisdom...',
      power: 'Dominate the market with force!',
      mystery: 'Secrets emerge from the shadows...',
      elements: 'The elements align favorably...',
      time: 'The timeline converges on opportunity...',
      spirit: 'Collective energy builds momentum!'
    };
    
    return phrases[houseTheme] || phrases.heroes;
  }

  // Public API
  getCurrentIssue(): ComicIssue | null {
    return this.currentIssue;
  }

  getStoryHistory(): StoryBeat[] {
    return [...this.storyHistory];
  }

  clearStoryHistory(): void {
    this.storyHistory = [];
  }
}

// Export singleton instance
export const sequentialStoryEngine = new SequentialStoryEngine();
export default sequentialStoryEngine;