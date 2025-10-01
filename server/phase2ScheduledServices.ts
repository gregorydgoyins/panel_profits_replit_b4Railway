import { storage } from './storage.js';
import type { IStorage } from './storage';
import { VisualStorytellingService } from './services/visualStorytellingService';
import { NarrativeTradingMetricsService } from './services/narrativeTradingMetricsService';
import { KarmicAlignmentService } from './services/karmicAlignmentService';
import { NarrativeMarketIntegration } from './services/narrativeMarketIntegration';

/**
 * Phase 2 Scheduled Services Architecture
 * Orchestrates narrative-driven trading features:
 * - Narrative timeline generation
 * - House power rankings
 * - Karmic alignment tracking
 * - Story beat market impacts
 */
export class Phase2ScheduledServices {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;
  private storage: IStorage;
  private visualStorytelling: VisualStorytellingService;
  private narrativeMetrics: NarrativeTradingMetricsService;
  private karmicAlignment: KarmicAlignmentService;
  private narrativeMarket: NarrativeMarketIntegration;

  // Service intervals (in milliseconds)
  private readonly config = {
    narrativeGenerationInterval: 1800000, // 30 minutes - Generate new story beats
    houseRankingsInterval: 600000, // 10 minutes - Update house leaderboards
    karmicTrackingInterval: 300000, // 5 minutes - Process karmic actions
    storyImpactInterval: 120000, // 2 minutes - Apply narrative market impacts
    timelineUpdateInterval: 3600000, // 60 minutes - Refresh narrative timelines
  };

  constructor(storage: IStorage) {
    this.storage = storage;
    this.visualStorytelling = new VisualStorytellingService();
    this.narrativeMetrics = new NarrativeTradingMetricsService();
    this.karmicAlignment = new KarmicAlignmentService();
    this.narrativeMarket = new NarrativeMarketIntegration();
  }

  /**
   * Start all Phase 2 scheduled services
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Phase 2 services already running');
      return;
    }

    console.log('🚀 Starting Phase 2 Narrative Trading Architecture...');

    try {
      // Start all scheduled cycles
      this.startNarrativeGeneration();
      this.startHouseRankings();
      this.startKarmicTracking();
      this.startStoryImpacts();
      this.startTimelineUpdates();

      this.isRunning = true;
      console.log('✅ Phase 2 Scheduled Services started successfully');
      console.log('📖 Narrative-driven trading is now LIVE!');

    } catch (error) {
      console.error('❌ Failed to start Phase 2 services:', error);
      this.stop();
      throw error;
    }
  }

  /**
   * Stop all Phase 2 scheduled services
   */
  stop(): void {
    console.log('🛑 Stopping Phase 2 services...');
    
    this.intervals.forEach((interval, name) => {
      clearInterval(interval);
      console.log(`⏹️ Stopped ${name}`);
    });
    
    this.intervals.clear();
    this.isRunning = false;
    console.log('✅ Phase 2 services stopped');
  }

  /**
   * Narrative Generation Cycle
   * Generates new story beats and timelines based on market activity
   */
  private startNarrativeGeneration(): void {
    const interval = setInterval(async () => {
      try {
        console.log('📖 Starting narrative generation cycle...');
        
        // Generate new narrative timelines
        const timelineIds = await this.visualStorytelling.generateNarrativeTimelines();
        
        if (timelineIds.length > 0) {
          console.log(`✨ Generated ${timelineIds.length} new narrative timelines`);
        }
        
      } catch (error) {
        console.error('Narrative generation failed:', error);
      }
    }, this.config.narrativeGenerationInterval);
    
    this.intervals.set('narrativeGeneration', interval);
    console.log(`📖 Narrative generation scheduled every ${this.config.narrativeGenerationInterval / 60000}min`);
  }

  /**
   * House Rankings Update Cycle
   * Updates Seven Houses power rankings and leaderboards
   */
  private startHouseRankings(): void {
    const interval = setInterval(async () => {
      try {
        await this.updateHouseRankings();
      } catch (error) {
        console.error('House rankings update failed:', error);
      }
    }, this.config.houseRankingsInterval);
    
    this.intervals.set('houseRankings', interval);
    console.log(`🏛️ House rankings scheduled every ${this.config.houseRankingsInterval / 60000}min`);
  }

  /**
   * Karmic Alignment Tracking Cycle
   * Processes karmic actions and updates user alignment scores
   */
  private startKarmicTracking(): void {
    const interval = setInterval(async () => {
      try {
        await this.processKarmicActions();
      } catch (error) {
        console.error('Karmic tracking failed:', error);
      }
    }, this.config.karmicTrackingInterval);
    
    this.intervals.set('karmicTracking', interval);
    console.log(`⚖️ Karmic tracking scheduled every ${this.config.karmicTrackingInterval / 60000}min`);
  }

  /**
   * Story Impact Application Cycle
   * Applies narrative story beats to market sentiment and pricing
   */
  private startStoryImpacts(): void {
    const interval = setInterval(async () => {
      try {
        await this.applyStoryImpacts();
      } catch (error) {
        console.error('Story impact application failed:', error);
      }
    }, this.config.storyImpactInterval);
    
    this.intervals.set('storyImpacts', interval);
    console.log(`🎭 Story impacts scheduled every ${this.config.storyImpactInterval / 60000}min`);
  }

  /**
   * Timeline Update Cycle
   * Refreshes narrative timelines with new market data
   */
  private startTimelineUpdates(): void {
    const interval = setInterval(async () => {
      try {
        await this.refreshTimelines();
      } catch (error) {
        console.error('Timeline update failed:', error);
      }
    }, this.config.timelineUpdateInterval);
    
    this.intervals.set('timelineUpdates', interval);
    console.log(`📅 Timeline updates scheduled every ${this.config.timelineUpdateInterval / 60000}min`);
  }

  /**
   * Update house power rankings based on member performance
   */
  private async updateHouseRankings(): Promise<void> {
    try {
      console.log('🏛️ Updating Seven Houses power rankings...');
      
      // Phase 2 house rankings functionality
      // Will be fully implemented when house storage methods are added
      console.log('⚠️ House rankings feature pending storage implementation');
      
    } catch (error) {
      console.error('Error updating house rankings:', error);
    }
  }

  /**
   * Process pending karmic actions and update alignments
   */
  private async processKarmicActions(): Promise<void> {
    try {
      // Get all users with unprocessed karmic actions
      // This would require a new storage method to track pending actions
      console.log('⚖️ Processing karmic actions...');
      
      // For now, log that the system is ready
      // Full implementation requires additional storage methods
      
    } catch (error) {
      console.error('Error processing karmic actions:', error);
    }
  }

  /**
   * Apply narrative story beats to market sentiment
   */
  private async applyStoryImpacts(): Promise<void> {
    try {
      console.log('🎭 Applying story impacts to market...');
      
      // Get recent active story beats (last 24 hours)
      const recentStoryBeats = await this.storage.getRecentStoryBeats?.(24) || [];
      
      if (recentStoryBeats.length === 0) {
        console.log('📭 No active story beats to process');
        return;
      }
      
      console.log(`🎬 Processing ${recentStoryBeats.length} story beats for market impact...`);
      
      let impactsApplied = 0;
      
      // Process each story beat through narrative market integration
      for (const storyBeat of recentStoryBeats) {
        try {
          // Process story beat to generate market events
          await this.narrativeMarket.processStoryBeat(storyBeat);
          impactsApplied++;
          
          console.log(`✨ Applied market impact from story beat: "${storyBeat.beatTitle}"`);
        } catch (error) {
          console.error(`Failed to apply story beat "${storyBeat.beatTitle}":`, error);
        }
      }
      
      if (impactsApplied > 0) {
        console.log(`✅ Successfully applied ${impactsApplied} story impacts to market`);
      }
      
    } catch (error) {
      console.error('Error applying story impacts:', error);
    }
  }

  /**
   * Refresh narrative timelines with latest market data
   */
  private async refreshTimelines(): Promise<void> {
    try {
      console.log('📅 Refreshing narrative timelines...');
      
      // Phase 2 timeline refresh functionality
      // Will update narrative timelines with latest trading data
      console.log('⚠️ Timeline refresh feature pending service method implementation');
      
    } catch (error) {
      console.error('Error refreshing timelines:', error);
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeServices: Array.from(this.intervals.keys()),
      config: this.config
    };
  }
}

// Global instance for use throughout the application
export const phase2Services = new Phase2ScheduledServices(storage);
