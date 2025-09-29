import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, desc, sql, inArray, gte, lte, isNotNull } from 'drizzle-orm';
import { narrativeTradingMetricsService } from './narrativeTradingMetricsService.js';
import { narrativeMarketIntegration } from './narrativeMarketIntegration.js';
import { 
  storyBeats, enhancedCharacters, enhancedComicIssues, narrativeTimelines,
  assets, narrativeTradingMetrics, moviePerformanceData
} from '@shared/schema.js';
import type {
  StoryBeat, EnhancedCharacter, EnhancedComicIssue, NarrativeTimeline,
  Asset, MoviePerformanceData
} from '@shared/schema.js';

// Initialize database connection
const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

/**
 * Narrative Data Pipeline Service
 * Automated pipeline that transforms narrative data into trading opportunities
 * Connects enhancedComicDataIntegration output to trading metrics generation
 */
export class NarrativeDataPipeline {
  
  private processingQueue: Map<string, any> = new Map();
  private isProcessing = false;
  private batchSize = 25;
  private processingInterval: NodeJS.Timeout | null = null;
  
  // Performance caching
  private metricsCache: Map<string, { metrics: any, timestamp: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes
  
  // Processing statistics
  private stats = {
    totalProcessed: 0,
    successfulUpdates: 0,
    errors: 0,
    lastProcessingTime: new Date(),
    averageProcessingTime: 0
  };

  constructor() {
    console.log('📊 Narrative Data Pipeline: Transforming story data into trading opportunities...');
  }

  /**
   * Initialize the narrative data pipeline
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Narrative Data Pipeline...');
    
    // Initialize house financial profiles
    await narrativeTradingMetricsService.initializeHouseFinancialProfiles();
    
    // Start automated processing
    this.startAutomatedProcessing();
    
    // Perform initial bulk update
    await this.performInitialBulkUpdate();
    
    console.log('✅ Narrative Data Pipeline initialized successfully');
  }

  /**
   * Process new story beat and trigger trading metrics updates
   */
  async processNewStoryBeat(storyBeat: StoryBeat): Promise<void> {
    const processingStart = Date.now();
    
    try {
      console.log(`📖 Processing new story beat: ${storyBeat.beatTitle}`);
      
      // Add to narrative market integration queue
      narrativeMarketIntegration.addStoryBeatToQueue(storyBeat);
      
      // Get affected assets
      const affectedAssets = await this.getAffectedAssetsByStoryBeat(storyBeat);
      
      // Update trading metrics for affected assets
      for (const asset of affectedAssets) {
        await this.updateAssetTradingMetrics(asset.id);
      }
      
      // Generate market insights
      for (const asset of affectedAssets) {
        await this.generateAssetMarketInsights(asset.id);
      }
      
      // Update processing statistics
      this.updateProcessingStats(processingStart, true);
      
      console.log(`✅ Processed story beat affecting ${affectedAssets.length} assets`);

    } catch (error) {
      this.updateProcessingStats(processingStart, false);
      console.error('Error processing story beat:', error);
    }
  }

  /**
   * Process enhanced comic issue and extract trading signals
   */
  async processEnhancedComicIssue(comicIssue: EnhancedComicIssue): Promise<void> {
    try {
      console.log(`📚 Processing enhanced comic issue: ${comicIssue.comicSeries} #${comicIssue.issueName}`);
      
      // Extract trading signals from comic content
      const tradingSignals = await this.extractTradingSignalsFromComic(comicIssue);
      
      // Get related assets (characters, creators, series)
      const relatedAssets = await this.getRelatedAssetsByComic(comicIssue);
      
      // Apply trading signals to related assets
      for (const asset of relatedAssets) {
        await this.applyTradingSignalsToAsset(asset.id, tradingSignals);
      }
      
      // Process visual storytelling elements if available
      // Note: visualStorytellingData integration would be implemented separately
      // if (comicIssue.visualStorytellingData) {
      //   await this.processVisualStorytellingData(comicIssue);
      // }

    } catch (error) {
      console.error('Error processing enhanced comic issue:', error);
    }
  }

  /**
   * Process character updates and power level changes
   */
  async processCharacterUpdate(character: EnhancedCharacter): Promise<void> {
    try {
      console.log(`👤 Processing character update: ${character.name}`);
      
      // Find character asset
      const characterAssets = await db.select().from(assets)
        .where(and(
          eq(assets.type, 'character'),
          eq(assets.name, character.name)
        ));

      for (const asset of characterAssets) {
        // Update trading metrics based on character changes
        await this.updateAssetTradingMetrics(asset.id);
        
        // Check for power level changes that affect volatility
        await this.processPowerLevelChanges(asset.id, character);
        
        // Update house affiliations based on character alignment/abilities
        await this.updateHouseAffiliations(asset.id, character);
      }

    } catch (error) {
      console.error('Error processing character update:', error);
    }
  }

  /**
   * Process media performance data (movies/TV shows) and apply momentum boosts
   */
  async processMediaPerformanceData(mediaData: MoviePerformanceData): Promise<void> {
    try {
      console.log(`🎬 Processing media performance: ${mediaData.filmTitle}`);
      
      // Get related character and franchise assets
      const relatedAssets = await this.getRelatedAssetsByMedia(mediaData);
      
      // Calculate media momentum boost
      const momentumBoost = await this.calculateMediaMomentumBoost(mediaData);
      
      // Apply momentum boost to related assets
      for (const asset of relatedAssets) {
        await this.applyMediaMomentumBoost(asset.id, momentumBoost);
      }

    } catch (error) {
      console.error('Error processing media performance data:', error);
    }
  }

  /**
   * Batch update all asset trading metrics
   */
  async updateAllAssetTradingMetrics(): Promise<number> {
    const startTime = Date.now();
    let updatedCount = 0;
    
    try {
      console.log('🔄 Starting batch update of all asset trading metrics...');
      
      // Get all assets in batches
      const allAssets = await db.select().from(assets);
      
      // Process in batches for performance
      for (let i = 0; i < allAssets.length; i += this.batchSize) {
        const batch = allAssets.slice(i, i + this.batchSize);
        
        // Process batch in parallel
        const batchPromises = batch.map(asset => this.updateAssetTradingMetrics(asset.id));
        const results = await Promise.allSettled(batchPromises);
        
        // Count successful updates
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        updatedCount += successCount;
        
        // Log progress
        if (i % (this.batchSize * 4) === 0) {
          console.log(`📊 Processed ${i + batch.length}/${allAssets.length} assets...`);
        }
        
        // Brief pause to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const duration = Date.now() - startTime;
      console.log(`✅ Batch update completed: ${updatedCount}/${allAssets.length} assets updated in ${duration}ms`);
      
    } catch (error) {
      console.error('Error in batch trading metrics update:', error);
    }
    
    return updatedCount;
  }

  /**
   * Generate real-time trading opportunities from narrative events
   */
  async generateTradingOpportunities(): Promise<any[]> {
    const opportunities = [];
    
    try {
      // Get recently updated assets with significant narrative activity
      const activeAssets = await db.select()
        .from(narrativeTradingMetrics)
        .where(gte(narrativeTradingMetrics.lastRecalculation, new Date(Date.now() - 300000))) // Last 5 minutes
        .limit(50);

      for (const metrics of activeAssets) {
        const opportunity = await this.evaluateTradingOpportunity(metrics);
        if (opportunity) {
          opportunities.push(opportunity);
        }
      }

    } catch (error) {
      console.error('Error generating trading opportunities:', error);
    }
    
    return opportunities;
  }

  /**
   * Process narrative timelines and detect story arc phases
   */
  async processNarrativeTimeline(timeline: NarrativeTimeline): Promise<void> {
    try {
      console.log(`📈 Processing narrative timeline: ${timeline.timelineName}`);
      
      // Get related assets
      const relatedAssets = await this.getRelatedAssetsByTimeline(timeline);
      
      // Determine story arc phase and its market implications
      const storyArcPhase = await this.determineStoryArcPhase(timeline);
      const phaseMultipliers = await this.getPhaseVolatilityMultipliers(storyArcPhase);
      
      // Apply story arc adjustments to related assets
      for (const asset of relatedAssets) {
        await this.applyStoryArcAdjustments(asset.id, storyArcPhase, phaseMultipliers);
      }

    } catch (error) {
      console.error('Error processing narrative timeline:', error);
    }
  }

  /**
   * Create automated alerts for significant narrative events
   */
  async createNarrativeAlerts(): Promise<void> {
    try {
      // Detect significant market movements driven by narrative events
      const significantMovements = await this.detectSignificantNarrativeMovements();
      
      for (const movement of significantMovements) {
        await this.createMarketAlert(movement);
      }

    } catch (error) {
      console.error('Error creating narrative alerts:', error);
    }
  }

  /**
   * Performance optimization: Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of Array.from(this.metricsCache.entries())) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.metricsCache.delete(key);
      }
    }
  }

  /**
   * Get pipeline performance statistics
   */
  getPerformanceStats(): any {
    return {
      ...this.stats,
      cacheSize: this.metricsCache.size,
      queueSize: this.processingQueue.size,
      isProcessing: this.isProcessing
    };
  }

  // ========================================================================================
  // PRIVATE HELPER METHODS
  // ========================================================================================

  private async updateAssetTradingMetrics(assetId: string): Promise<void> {
    // Check cache first
    const cacheKey = `metrics_${assetId}`;
    const cached = this.metricsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return; // Use cached version
    }
    
    try {
      // Generate new trading metrics
      const newMetrics = await narrativeTradingMetricsService.generateTradingMetrics(assetId);
      
      // Check if metrics exist
      const existingMetrics = await db.select()
        .from(narrativeTradingMetrics)
        .where(eq(narrativeTradingMetrics.assetId, assetId))
        .limit(1);

      if (existingMetrics.length > 0) {
        // Update existing metrics
        await db.update(narrativeTradingMetrics)
          .set({
            ...newMetrics,
            calculationVersion: (existingMetrics[0].calculationVersion || 0) + 1,
            lastRecalculation: new Date()
          })
          .where(eq(narrativeTradingMetrics.assetId, assetId));
      } else {
        // Insert new metrics
        await db.insert(narrativeTradingMetrics).values(newMetrics);
      }
      
      // Cache the result
      this.metricsCache.set(cacheKey, { metrics: newMetrics, timestamp: Date.now() });

    } catch (error) {
      console.error(`Error updating trading metrics for asset ${assetId}:`, error);
    }
  }

  private async generateAssetMarketInsights(assetId: string): Promise<void> {
    try {
      const insights = await narrativeTradingMetricsService.generateNarrativeMarketInsights(assetId);
      // Here we would save the insights to the database or broadcast them
      // This integration point would connect to the real-time insights system
    } catch (error) {
      console.error(`Error generating market insights for asset ${assetId}:`, error);
    }
  }

  private async getAffectedAssetsByStoryBeat(storyBeat: StoryBeat): Promise<Asset[]> {
    const affectedAssets: Asset[] = [];
    
    try {
      // Get assets related to the story beat through the timeline
      if (storyBeat.timelineId) {
        const timeline = await db.select().from(narrativeTimelines)
          .where(eq(narrativeTimelines.id, storyBeat.timelineId))
          .limit(1);
        
        if (timeline[0]) {
          // Find assets by timeline name or universe
          const relatedAssets = await db.select().from(assets)
            .where(and(
              eq(assets.type, 'character')
              // Can expand this logic to match timeline to relevant assets
            ));
          affectedAssets.push(...relatedAssets);
        }
      }
      
      // Find assets mentioned in story beat content through primary/secondary entities
      if (storyBeat.primaryEntities && Array.isArray(storyBeat.primaryEntities)) {
        for (const entityName of storyBeat.primaryEntities) {
          const entityAssets = await db.select().from(assets)
            .where(eq(assets.name, entityName));
          affectedAssets.push(...entityAssets);
        }
      }
      
      if (storyBeat.secondaryEntities && Array.isArray(storyBeat.secondaryEntities)) {
        for (const entityName of storyBeat.secondaryEntities) {
          const entityAssets = await db.select().from(assets)
            .where(eq(assets.name, entityName));
          affectedAssets.push(...entityAssets);
        }
      }

    } catch (error) {
      console.error('Error getting affected assets by story beat:', error);
    }
    
    return affectedAssets;
  }

  private async extractTradingSignalsFromComic(comicIssue: EnhancedComicIssue): Promise<any> {
    // Extract narrative signals that affect trading
    const signals = {
      volatilitySignals: [] as any[],
      momentumSignals: [] as any[],
      sentimentSignals: [] as any[],
      culturalImpactSignals: [] as any[]
    };
    
    // Analyze issue content for trading signals using available fields
    if (comicIssue.significantEvents && Array.isArray(comicIssue.significantEvents)) {
      for (const event of comicIssue.significantEvents) {
        // Character deaths, power upgrades, resurrections, etc.
        const eventType = this.classifyEventType(event);
        const impact = this.calculateEventImpact(event, eventType);
        
        signals.volatilitySignals.push({ event, type: eventType, impact });
      }
    }
    
    // Analyze first appearances and key issue rating for cultural impact
    if (comicIssue.firstAppearances && Array.isArray(comicIssue.firstAppearances)) {
      const firstAppearanceImpact = comicIssue.firstAppearances.length * 0.05;
      signals.culturalImpactSignals.push({
        significance: 'first_appearances',
        impact: firstAppearanceImpact
      });
    }
    
    // Use key issue rating for cultural significance
    if (comicIssue.keyIssueRating) {
      const ratingValue = parseFloat(comicIssue.keyIssueRating.toString());
      signals.culturalImpactSignals.push({
        significance: 'key_issue_rating',
        impact: 0.1 * Math.log10(ratingValue + 1)
      });
    }
    
    return signals;
  }

  private async getRelatedAssetsByComic(comicIssue: EnhancedComicIssue): Promise<Asset[]> {
    const relatedAssets: Asset[] = [];
    
    try {
      // Character assets from first appearances
      if (comicIssue.firstAppearances && Array.isArray(comicIssue.firstAppearances)) {
        for (const characterName of comicIssue.firstAppearances) {
          const characterAssets = await db.select().from(assets)
            .where(and(
              eq(assets.type, 'character'),
              eq(assets.name, characterName)
            ));
          relatedAssets.push(...characterAssets);
        }
      }
      
      // Creator assets from writers
      if (comicIssue.writers && Array.isArray(comicIssue.writers)) {
        for (const writerName of comicIssue.writers) {
          const writerAssets = await db.select().from(assets)
            .where(and(
              eq(assets.type, 'creator'),
              eq(assets.name, writerName)
            ));
          relatedAssets.push(...writerAssets);
        }
      }
      
      // Creator assets from pencilers
      if (comicIssue.pencilers && Array.isArray(comicIssue.pencilers)) {
        for (const artistName of comicIssue.pencilers) {
          const artistAssets = await db.select().from(assets)
            .where(and(
              eq(assets.type, 'creator'),
              eq(assets.name, artistName)
            ));
          relatedAssets.push(...artistAssets);
        }
      }
      
      // Series/comic assets
      const seriesAssets = await db.select().from(assets)
        .where(and(
          eq(assets.type, 'comic'),
          eq(assets.name, comicIssue.comicSeries)
        ));
      relatedAssets.push(...seriesAssets);

    } catch (error) {
      console.error('Error getting related assets by comic:', error);
    }
    
    return relatedAssets;
  }

  private async applyTradingSignalsToAsset(assetId: string, signals: any): Promise<void> {
    try {
      // Get current metrics
      const currentMetrics = await db.select()
        .from(narrativeTradingMetrics)
        .where(eq(narrativeTradingMetrics.assetId, assetId))
        .limit(1);

      if (currentMetrics.length === 0) return;

      // Apply volatility signals
      let volatilityAdjustment = 0;
      for (const signal of signals.volatilitySignals) {
        volatilityAdjustment += signal.impact;
      }

      // Apply momentum signals
      let momentumAdjustment = 0;
      for (const signal of signals.momentumSignals) {
        momentumAdjustment += signal.impact;
      }

      // Update metrics with signal adjustments
      const updatedMythicVolatility = Math.min(
        parseFloat(currentMetrics[0].mythicVolatilityScore) + volatilityAdjustment,
        10.0
      );
      
      const updatedNarrativeMomentum = Math.min(Math.max(
        parseFloat(currentMetrics[0].narrativeMomentumScore) + momentumAdjustment,
        -5.0
      ), 5.0);

      await db.update(narrativeTradingMetrics)
        .set({
          mythicVolatilityScore: updatedMythicVolatility.toString(),
          narrativeMomentumScore: updatedNarrativeMomentum.toString(),
          lastRecalculation: new Date()
        })
        .where(eq(narrativeTradingMetrics.assetId, assetId));

    } catch (error) {
      console.error(`Error applying trading signals to asset ${assetId}:`, error);
    }
  }

  private async processVisualStorytellingData(comicIssue: EnhancedComicIssue): Promise<void> {
    // Process visual storytelling elements for additional trading signals
    // Note: Visual storytelling data would be added as additional field if needed
    try {
      // For now, use basic comic data for intensity signals
      const intensitySignals = {
        emotionalIntensity: comicIssue.keyIssueRating ? parseFloat(comicIssue.keyIssueRating.toString()) * 0.1 : 0,
        actionLevel: comicIssue.significantEvents ? comicIssue.significantEvents.length : 0,
        dialogueIntensity: 0.5 // Default value
      };
      
      // Apply to related assets
      const relatedAssets = await this.getRelatedAssetsByComic(comicIssue);
      for (const asset of relatedAssets) {
        await this.applyIntensitySignals(asset.id, intensitySignals);
      }

    } catch (error) {
      console.error('Error processing visual storytelling data:', error);
    }
  }

  private async processPowerLevelChanges(assetId: string, character: EnhancedCharacter): Promise<void> {
    try {
      const currentMetrics = await db.select()
        .from(narrativeTradingMetrics)
        .where(eq(narrativeTradingMetrics.assetId, assetId))
        .limit(1);

      if (currentMetrics.length === 0) return;

      // Calculate power level volatility factor based on available character stats
      const powerLevel = character.powerLevel ? parseFloat(character.powerLevel.toString()) : 1.0;
      const strength = character.strength || 1;
      const speed = character.speed || 1;
      const intelligence = character.intelligence || 1;
      
      // Calculate composite power factor
      const compositePowerScore = (strength + speed + intelligence) / 3;
      const powerFactor = Math.min(Math.max(powerLevel * 0.1, 0.5), 5.0);
      
      await db.update(narrativeTradingMetrics)
        .set({
          powerLevelVolatilityFactor: powerFactor.toString(),
          lastRecalculation: new Date()
        })
        .where(eq(narrativeTradingMetrics.assetId, assetId));

    } catch (error) {
      console.error('Error processing power level changes:', error);
    }
  }

  private async updateHouseAffiliations(assetId: string, character: EnhancedCharacter): Promise<void> {
    try {
      // Determine house affiliation based on character attributes
      const houseAffiliation = await this.determineCharacterHouseAffiliation(character);
      
      await db.update(narrativeTradingMetrics)
        .set({
          houseAffiliation: houseAffiliation,
          lastRecalculation: new Date()
        })
        .where(eq(narrativeTradingMetrics.assetId, assetId));

    } catch (error) {
      console.error('Error updating house affiliations:', error);
    }
  }

  private async getRelatedAssetsByMedia(mediaData: MoviePerformanceData): Promise<Asset[]> {
    const relatedAssets: Asset[] = [];
    
    try {
      // Find assets related to featured characters
      if (mediaData.featuredCharacters && Array.isArray(mediaData.featuredCharacters)) {
        for (const characterName of mediaData.featuredCharacters) {
          const characterAssets = await db.select().from(assets)
            .where(and(
              eq(assets.type, 'character'),
              eq(assets.name, characterName)
            ));
          relatedAssets.push(...characterAssets);
        }
      }
      
      // Find franchise/universe assets based on character family
      if (mediaData.characterFamily) {
        const franchiseAssets = await db.select().from(assets)
          .where(and(
            eq(assets.type, 'comic'),
            eq(assets.name, mediaData.characterFamily)
          ));
        relatedAssets.push(...franchiseAssets);
      }
      
      // Find related assets by film title
      const titleAssets = await db.select().from(assets)
        .where(and(
          eq(assets.type, 'comic'),
          eq(assets.name, mediaData.filmTitle)
        ));
      relatedAssets.push(...titleAssets);

    } catch (error) {
      console.error('Error getting related assets by media:', error);
    }
    
    return relatedAssets;
  }

  private async calculateMediaMomentumBoost(mediaData: MoviePerformanceData): Promise<number> {
    // Calculate momentum boost based on media performance
    let boost = 0.1; // Base boost
    
    // Movie performance boost based on worldwide gross
    if (mediaData.worldwideGross) {
      const grossValue = parseFloat(mediaData.worldwideGross.toString());
      boost += Math.log10(grossValue / 1000000) * 0.05; // Logarithmic scaling
    }
    
    // Rating boost based on Rotten Tomatoes score
    if (mediaData.rottenTomatoesScore) {
      const ratingScore = parseFloat(mediaData.rottenTomatoesScore.toString());
      boost += (ratingScore - 50.0) * 0.001; // Above 50% rating gives boost
    }
    
    // Success category boost
    if (mediaData.successCategory === 'Success') {
      boost += 0.1;
    } else if (mediaData.successCategory === 'Flop') {
      boost -= 0.05;
    }
    
    return Math.min(Math.max(boost, -0.2), 0.5); // Cap between -20% and 50% boost
  }

  private async applyMediaMomentumBoost(assetId: string, boost: number): Promise<void> {
    try {
      const currentMetrics = await db.select()
        .from(narrativeTradingMetrics)
        .where(eq(narrativeTradingMetrics.assetId, assetId))
        .limit(1);

      if (currentMetrics.length === 0) return;

      const currentBoost = currentMetrics[0].mediaBoostFactor ? parseFloat(currentMetrics[0].mediaBoostFactor.toString()) : 1.0;
      const updatedMediaBoost = Math.min(
        currentBoost + boost,
        2.0 // Cap at 200%
      );

      await db.update(narrativeTradingMetrics)
        .set({
          mediaBoostFactor: updatedMediaBoost.toString(),
          lastRecalculation: new Date()
        })
        .where(eq(narrativeTradingMetrics.assetId, assetId));

    } catch (error) {
      console.error('Error applying media momentum boost:', error);
    }
  }

  private startAutomatedProcessing(): void {
    this.processingInterval = setInterval(async () => {
      if (this.isProcessing) return;
      
      this.isProcessing = true;
      
      try {
        // Clear expired cache
        this.clearExpiredCache();
        
        // Process any queued updates
        await this.processQueuedUpdates();
        
        // Generate trading opportunities
        await this.generateTradingOpportunities();
        
        // Create narrative alerts
        await this.createNarrativeAlerts();

      } catch (error) {
        console.error('Error in automated processing:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 60000); // Every minute
  }

  private async performInitialBulkUpdate(): Promise<void> {
    console.log('🚀 Performing initial bulk update of trading metrics...');
    await this.updateAllAssetTradingMetrics();
  }

  private updateProcessingStats(startTime: number, success: boolean): void {
    const duration = Date.now() - startTime;
    
    this.stats.totalProcessed++;
    if (success) {
      this.stats.successfulUpdates++;
    } else {
      this.stats.errors++;
    }
    
    this.stats.lastProcessingTime = new Date();
    this.stats.averageProcessingTime = 
      (this.stats.averageProcessingTime * (this.stats.totalProcessed - 1) + duration) / this.stats.totalProcessed;
  }

  // Additional helper methods would continue here...
  private classifyEventType(event: string): string {
    const eventLower = event.toLowerCase();
    
    if (eventLower.includes('death') || eventLower.includes('killed')) return 'character_death';
    if (eventLower.includes('resurrection') || eventLower.includes('returned')) return 'resurrection';
    if (eventLower.includes('power') && (eventLower.includes('gain') || eventLower.includes('upgrade'))) return 'power_upgrade';
    if (eventLower.includes('reveal') || eventLower.includes('identity')) return 'identity_reveal';
    if (eventLower.includes('cosmic') || eventLower.includes('universal')) return 'cosmic_event';
    
    return 'general_event';
  }

  private calculateEventImpact(event: string, eventType: string): number {
    const impactMultipliers = {
      'character_death': 0.8,
      'resurrection': 1.2,
      'power_upgrade': 0.6,
      'identity_reveal': 0.4,
      'cosmic_event': 2.0,
      'general_event': 0.2
    };
    
    return (impactMultipliers as any)[eventType] || 0.2;
  }

  private async determineCharacterHouseAffiliation(character: EnhancedCharacter): Promise<string> {
    // Determine house based on character attributes using available schema fields
    const specialAbilities = character.specialAbilities || [];
    const teams = character.teams || [];
    const searchText = `${character.name} ${character.identity || ''} ${specialAbilities.join(' ')} ${teams.join(' ')}`.toLowerCase();
    
    const houseKeywords = {
      heroes: ['hero', 'captain', 'spider', 'superman', 'wonder', 'flash', 'heroic', 'justice', 'protect', 'avenger'],
      wisdom: ['doctor', 'professor', 'sage', 'oracle', 'scholar', 'strange', 'detective', 'mystery', 'intelligent'],
      power: ['hulk', 'thor', 'strength', 'cosmic', 'phoenix', 'galactus', 'omega', 'infinity', 'powerful'],
      mystery: ['batman', 'shadow', 'night', 'dark', 'mystic', 'occult', 'secret', 'hidden', 'stealth'],
      elements: ['storm', 'fire', 'ice', 'earth', 'water', 'elemental', 'nature', 'environment', 'weather'],
      time: ['time', 'temporal', 'chrono', 'speed', 'future', 'past', 'timeline', 'paradox', 'fast'],
      spirit: ['ghost', 'spirit', 'soul', 'astral', 'phantom', 'supernatural', 'afterlife', 'mystical', 'magic']
    };
    
    let bestMatch = { house: 'heroes', score: 0 };
    
    // Factor in character statistics for house affiliation
    const intelligence = character.intelligence || 1;
    const strength = character.strength || 1;
    const speed = character.speed || 1;
    
    for (const [houseId, keywords] of Object.entries(houseKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (searchText.includes(keyword)) {
          score += 1;
        }
      }
      
      // Bonus scoring based on character stats
      if (houseId === 'wisdom' && intelligence >= 8) score += 2;
      if (houseId === 'power' && strength >= 8) score += 2;
      if (houseId === 'time' && speed >= 8) score += 2;
      
      if (score > bestMatch.score) {
        bestMatch = { house: houseId, score };
      }
    }
    
    return bestMatch.house;
  }

  private async processQueuedUpdates(): Promise<void> {
    // Process any queued updates
    const queueEntries = Array.from(this.processingQueue.entries()).slice(0, 10);
    
    for (const [key, value] of queueEntries) {
      try {
        // Process the queued update
        await this.updateAssetTradingMetrics(value.assetId);
        this.processingQueue.delete(key);
      } catch (error) {
        console.error(`Error processing queued update ${key}:`, error);
      }
    }
  }

  private async evaluateTradingOpportunity(metrics: any): Promise<any> {
    // Evaluate if the current metrics present a trading opportunity
    const volatility = parseFloat(metrics.mythicVolatilityScore);
    const momentum = parseFloat(metrics.narrativeMomentumScore);
    
    if (volatility > 0.15 || Math.abs(momentum) > 2.0) {
      return {
        assetId: metrics.assetId,
        type: volatility > 0.15 ? 'high_volatility' : 'high_momentum',
        score: Math.max(volatility, Math.abs(momentum)),
        houseAffiliation: metrics.houseAffiliation,
        recommendation: this.generateRecommendation(volatility, momentum)
      };
    }
    
    return null;
  }

  private generateRecommendation(volatility: number, momentum: number): string {
    if (volatility > 0.2) return 'High volatility - consider protective strategies';
    if (momentum > 2.0) return 'Strong positive momentum - potential buying opportunity';
    if (momentum < -2.0) return 'Negative momentum - consider selling or shorting';
    return 'Moderate activity - monitor for changes';
  }

  private async getRelatedAssetsByTimeline(timeline: NarrativeTimeline): Promise<Asset[]> {
    const assets: Asset[] = [];
    
    try {
      // Get assets related to timeline scope and universe
      if (timeline.scope === 'character' && timeline.universe) {
        const characterAssets = await db.select().from(assets)
          .where(eq(assets.type, 'character'));
        
        // Filter by universe in the metadata or description if available
        for (const asset of characterAssets) {
          if ((asset.description && asset.description.toLowerCase().includes(timeline.universe.toLowerCase())) ||
              asset.name.toLowerCase().includes(timeline.timelineName.toLowerCase())) {
            assets.push(asset);
          }
        }
      }
      
      // Get assets by timeline name matching
      const timelineAssets = await db.select().from(assets)
        .where(eq(assets.name, timeline.timelineName));
      assets.push(...timelineAssets);
      
    } catch (error) {
      console.error('Error getting related assets by timeline:', error);
    }
    
    return assets;
  }

  private async determineStoryArcPhase(timeline: NarrativeTimeline): Promise<string> {
    // Determine phase based on timeline status and type
    if (timeline.timelineStatus === 'active') return 'rising_action';
    if (timeline.timelineStatus === 'completed') return 'resolution';
    if (timeline.timelineType === 'character_arc') return 'climax';
    
    return 'rising_action'; // Default phase
  }

  private async getPhaseVolatilityMultipliers(phase: string): Promise<any> {
    const multipliers = {
      'origin': { volatility: 1.2, momentum: 0.6 },
      'rising_action': { volatility: 1.1, momentum: 0.8 },
      'climax': { volatility: 1.8, momentum: 1.5 },
      'falling_action': { volatility: 0.9, momentum: 0.4 },
      'resolution': { volatility: 0.8, momentum: 0.2 }
    };
    
    return (multipliers as any)[phase] || multipliers.rising_action;
  }

  private async applyStoryArcAdjustments(assetId: string, phase: string, multipliers: any): Promise<void> {
    try {
      await db.update(narrativeTradingMetrics)
        .set({
          storyArcPhase: phase,
          storyArcVolatilityMultiplier: multipliers.volatility.toString(),
          lastRecalculation: new Date()
        })
        .where(eq(narrativeTradingMetrics.assetId, assetId));
    } catch (error) {
      console.error('Error applying story arc adjustments:', error);
    }
  }

  private async detectSignificantNarrativeMovements(): Promise<any[]> {
    // Detect assets with significant recent changes
    const movements = [];
    
    try {
      const recentlyUpdated = await db.select()
        .from(narrativeTradingMetrics)
        .where(gte(narrativeTradingMetrics.lastRecalculation, new Date(Date.now() - 300000))) // Last 5 minutes
        .limit(20);

      for (const metrics of recentlyUpdated) {
        const volatility = parseFloat(metrics.mythicVolatilityScore);
        const momentum = parseFloat(metrics.narrativeMomentumScore);
        
        if (volatility > 0.2 || Math.abs(momentum) > 2.5) {
          movements.push({
            assetId: metrics.assetId,
            volatility,
            momentum,
            severity: volatility > 0.3 ? 'high' : 'moderate'
          });
        }
      }
    } catch (error) {
      console.error('Error detecting significant movements:', error);
    }
    
    return movements;
  }

  private async createMarketAlert(movement: any): Promise<void> {
    // Create market alerts for significant movements
    console.log(`🚨 Market Alert: Asset ${movement.assetId} experiencing ${movement.severity} narrative activity`);
    // This would integrate with the notification system
  }

  private extractIntensitySignals(panelAnalysis: any): any {
    // Extract intensity signals from visual analysis
    return {
      emotionalIntensity: panelAnalysis?.averageEmotionalIntensity || 0,
      actionLevel: panelAnalysis?.actionSequenceCount || 0,
      dialogueIntensity: panelAnalysis?.dialogueIntensity || 0
    };
  }

  private async applyIntensitySignals(assetId: string, signals: any): Promise<void> {
    // Apply visual intensity signals to trading metrics
    try {
      const intensityBoost = (signals.emotionalIntensity + signals.actionLevel) * 0.01;
      
      const currentMetrics = await db.select()
        .from(narrativeTradingMetrics)
        .where(eq(narrativeTradingMetrics.assetId, assetId))
        .limit(1);

      if (currentMetrics.length > 0) {
        const updatedVolatility = Math.min(
          parseFloat(currentMetrics[0].mythicVolatilityScore) + intensityBoost,
          10.0
        );

        await db.update(narrativeTradingMetrics)
          .set({
            mythicVolatilityScore: updatedVolatility.toString(),
            lastRecalculation: new Date()
          })
          .where(eq(narrativeTradingMetrics.assetId, assetId));
      }
    } catch (error) {
      console.error('Error applying intensity signals:', error);
    }
  }

  /**
   * Cleanup method
   */
  async shutdown(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    this.processingQueue.clear();
    this.metricsCache.clear();
    
    console.log('📊 Narrative Data Pipeline shutdown complete');
  }
}

// Export singleton instance
export const narrativeDataPipeline = new NarrativeDataPipeline();