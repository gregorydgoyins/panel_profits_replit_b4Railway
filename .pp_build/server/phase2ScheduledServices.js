"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phase2Services = exports.Phase2ScheduledServices = void 0;
const storage_js_1 = require("./storage.js");
const visualStorytellingService_1 = require("./services/visualStorytellingService");
const narrativeTradingMetricsService_1 = require("./services/narrativeTradingMetricsService");
const karmicAlignmentService_1 = require("./services/karmicAlignmentService");
const narrativeMarketIntegration_1 = require("./services/narrativeMarketIntegration");
/**
 * Phase 2 Scheduled Services Architecture
 * Orchestrates narrative-driven trading features:
 * - Narrative timeline generation
 * - House power rankings
 * - Karmic alignment tracking
 * - Story beat market impacts
 */
class Phase2ScheduledServices {
    constructor(storage) {
        this.intervals = new Map();
        this.isRunning = false;
        // Service intervals (in milliseconds)
        this.config = {
            narrativeGenerationInterval: 1800000, // 30 minutes - Generate new story beats
            houseRankingsInterval: 600000, // 10 minutes - Update house leaderboards
            karmicTrackingInterval: 300000, // 5 minutes - Process karmic actions
            storyImpactInterval: 120000, // 2 minutes - Apply narrative market impacts
            timelineUpdateInterval: 3600000, // 60 minutes - Refresh narrative timelines
        };
        this.storage = storage;
        this.visualStorytelling = new visualStorytellingService_1.VisualStorytellingService();
        this.narrativeMetrics = new narrativeTradingMetricsService_1.NarrativeTradingMetricsService();
        this.karmicAlignment = new karmicAlignmentService_1.KarmicAlignmentService();
        this.narrativeMarket = new narrativeMarketIntegration_1.NarrativeMarketIntegration();
    }
    /**
     * Start all Phase 2 scheduled services
     */
    async start() {
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
        }
        catch (error) {
            console.error('❌ Failed to start Phase 2 services:', error);
            this.stop();
            throw error;
        }
    }
    /**
     * Stop all Phase 2 scheduled services
     */
    stop() {
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
    startNarrativeGeneration() {
        const interval = setInterval(async () => {
            try {
                console.log('📖 Starting narrative generation cycle...');
                // Generate new narrative timelines
                const timelineIds = await this.visualStorytelling.generateNarrativeTimelines();
                if (timelineIds.length > 0) {
                    console.log(`✨ Generated ${timelineIds.length} new narrative timelines`);
                }
            }
            catch (error) {
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
    startHouseRankings() {
        const interval = setInterval(async () => {
            try {
                await this.updateHouseRankings();
            }
            catch (error) {
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
    startKarmicTracking() {
        const interval = setInterval(async () => {
            try {
                await this.processKarmicActions();
            }
            catch (error) {
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
    startStoryImpacts() {
        const interval = setInterval(async () => {
            try {
                await this.applyStoryImpacts();
            }
            catch (error) {
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
    startTimelineUpdates() {
        const interval = setInterval(async () => {
            try {
                await this.refreshTimelines();
            }
            catch (error) {
                console.error('Timeline update failed:', error);
            }
        }, this.config.timelineUpdateInterval);
        this.intervals.set('timelineUpdates', interval);
        console.log(`📅 Timeline updates scheduled every ${this.config.timelineUpdateInterval / 60000}min`);
    }
    /**
     * Update house power rankings based on member performance
     */
    async updateHouseRankings() {
        try {
            console.log('🏛️ Updating Seven Houses power rankings...');
            // Phase 2 house rankings functionality
            // Will be fully implemented when house storage methods are added
            console.log('⚠️ House rankings feature pending storage implementation');
        }
        catch (error) {
            console.error('Error updating house rankings:', error);
        }
    }
    /**
     * Process pending karmic actions and update alignments
     */
    async processKarmicActions() {
        try {
            // Get all users with unprocessed karmic actions
            // This would require a new storage method to track pending actions
            console.log('⚖️ Processing karmic actions...');
            // For now, log that the system is ready
            // Full implementation requires additional storage methods
        }
        catch (error) {
            console.error('Error processing karmic actions:', error);
        }
    }
    /**
     * Apply narrative story beats to market sentiment
     */
    async applyStoryImpacts() {
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
                }
                catch (error) {
                    console.error(`Failed to apply story beat "${storyBeat.beatTitle}":`, error);
                }
            }
            if (impactsApplied > 0) {
                console.log(`✅ Successfully applied ${impactsApplied} story impacts to market`);
            }
        }
        catch (error) {
            console.error('Error applying story impacts:', error);
        }
    }
    /**
     * Refresh narrative timelines with latest market data
     */
    async refreshTimelines() {
        try {
            console.log('📅 Refreshing narrative timelines...');
            // Phase 2 timeline refresh functionality
            // Will update narrative timelines with latest trading data
            console.log('⚠️ Timeline refresh feature pending service method implementation');
        }
        catch (error) {
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
exports.Phase2ScheduledServices = Phase2ScheduledServices;
// Global instance for use throughout the application
exports.phase2Services = new Phase2ScheduledServices(storage_js_1.storage);
