import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, desc, sql, inArray, gte, lte, isNotNull } from 'drizzle-orm';
import { 
  narrativeTimelines, storyBeats, enhancedCharacters, battleScenarios, 
  enhancedComicIssues, moviePerformanceData, assetFinancialMapping,
  assets, marketInsights, marketData
} from '@shared/schema.js';
import type {
  InsertNarrativeTimeline, InsertStoryBeat, NarrativeTimeline, StoryBeat,
  EnhancedCharacter, BattleScenario, EnhancedComicIssue, Asset
} from '@shared/schema.js';

// Initialize database connection
const sql_connection = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_connection);

/**
 * Visual Storytelling Service for Phase 2
 * Creates living narratives that drive market sentiment through mythology and storytelling
 */
export class VisualStorytellingService {
  
  // Trading House Themes and Specializations
  private readonly HOUSE_THEMES = {
    heroes: {
      keywords: ['hero', 'captain', 'spider', 'superman', 'wonder', 'flash', 'heroic', 'justice', 'protect'],
      themes: ['heroic_journey', 'redemption', 'sacrifice', 'team_formation', 'origin_story'],
      beatTypes: ['introduction', 'inciting_incident', 'character_death', 'power_revelation', 'team_formation'],
      narrativeGenres: ['superhero', 'action', 'adventure'],
      emotionalTones: ['hopeful', 'inspiring', 'action'],
      alignments: ['heroic', 'lawful_good']
    },
    wisdom: {
      keywords: ['doctor', 'professor', 'sage', 'oracle', 'scholar', 'strange', 'detective', 'mystery'],
      themes: ['knowledge_seeking', 'mystery_unraveling', 'strategic_planning', 'ancient_wisdom'],
      beatTypes: ['revelation', 'investigation', 'discovery', 'strategic_planning'],
      narrativeGenres: ['mystery', 'detective', 'supernatural'],
      emotionalTones: ['mysterious', 'contemplative', 'cerebral'],
      alignments: ['neutral_good', 'lawful_neutral']
    },
    power: {
      keywords: ['hulk', 'thor', 'strength', 'cosmic', 'phoenix', 'galactus', 'omega', 'infinity'],
      themes: ['power_corruption', 'cosmic_threat', 'universal_stakes', 'power_upgrade'],
      beatTypes: ['climax', 'power_revelation', 'cosmic_battle', 'transformation'],
      narrativeGenres: ['cosmic', 'epic', 'action'],
      emotionalTones: ['epic', 'overwhelming', 'awe_inspiring'],
      alignments: ['chaotic_neutral', 'lawful_evil']
    },
    mystery: {
      keywords: ['batman', 'shadow', 'night', 'dark', 'mystic', 'occult', 'secret', 'hidden'],
      themes: ['secret_identity', 'hidden_conspiracy', 'dark_secrets', 'psychological_thriller'],
      beatTypes: ['plot_twist', 'revelation', 'identity_crisis', 'betrayal'],
      narrativeGenres: ['noir', 'psychological', 'thriller'],
      emotionalTones: ['dark', 'mysterious', 'psychological'],
      alignments: ['chaotic_good', 'neutral']
    },
    elements: {
      keywords: ['storm', 'fire', 'ice', 'earth', 'water', 'elemental', 'nature', 'environment'],
      themes: ['elemental_conflict', 'environmental_crisis', 'nature_vs_technology', 'balance'],
      beatTypes: ['environmental_threat', 'elemental_battle', 'balance_restoration'],
      narrativeGenres: ['fantasy', 'environmental', 'adventure'],
      emotionalTones: ['natural', 'primal', 'balanced'],
      alignments: ['neutral', 'chaotic_neutral']
    },
    time: {
      keywords: ['time', 'temporal', 'chrono', 'speed', 'future', 'past', 'timeline', 'paradox'],
      themes: ['time_travel', 'alternate_timeline', 'temporal_paradox', 'destiny'],
      beatTypes: ['timeline_split', 'temporal_crisis', 'future_revelation', 'past_alteration'],
      narrativeGenres: ['time_travel', 'sci_fi', 'alternate_reality'],
      emotionalTones: ['mind_bending', 'philosophical', 'complex'],
      alignments: ['lawful_neutral', 'neutral']
    },
    spirit: {
      keywords: ['ghost', 'spirit', 'soul', 'astral', 'phantom', 'supernatural', 'afterlife', 'mystical'],
      themes: ['afterlife_journey', 'spiritual_awakening', 'supernatural_threat', 'soul_searching'],
      beatTypes: ['spiritual_revelation', 'afterlife_encounter', 'supernatural_battle'],
      narrativeGenres: ['supernatural', 'horror', 'mystical'],
      emotionalTones: ['ethereal', 'haunting', 'transcendent'],
      alignments: ['neutral_good', 'chaotic_good']
    }
  };

  constructor() {
    console.log('🔮 Visual Storytelling Service: The Seven Houses await their narrative destinies...');
  }

  /**
   * Generate narrative timelines from ingested comic and character data
   */
  async generateNarrativeTimelines(): Promise<string[]> {
    try {
      console.log('📖 Generating narrative timelines from comic universe data...');

      const timelineIds: string[] = [];
      
      // Generate Character Origin Timelines
      const originTimelineIds = await this.generateCharacterOriginTimelines();
      timelineIds.push(...originTimelineIds);
      
      // Generate Major Comic Event Timelines
      const eventTimelineIds = await this.generateMajorEventTimelines();
      timelineIds.push(...eventTimelineIds);
      
      // Generate Battle-Driven Timelines
      const battleTimelineIds = await this.generateBattleTimelines();
      timelineIds.push(...battleTimelineIds);
      
      // Generate Cultural Impact Timelines
      const culturalTimelineIds = await this.generateCulturalImpactTimelines();
      timelineIds.push(...culturalTimelineIds);

      console.log(`✨ Generated ${timelineIds.length} narrative timelines across the Seven Houses`);
      return timelineIds;

    } catch (error) {
      console.error('❌ Error generating narrative timelines:', error);
      throw error;
    }
  }

  /**
   * Generate character origin story timelines
   */
  private async generateCharacterOriginTimelines(): Promise<string[]> {
    const characters = await db.select().from(enhancedCharacters)
      .where(isNotNull(enhancedCharacters.originStory));

    const timelineIds: string[] = [];

    for (const character of characters) {
      try {
        const primaryHouse = this.determineCharacterHouse(character);
        const houseTheme = this.HOUSE_THEMES[primaryHouse as keyof typeof this.HOUSE_THEMES];

        const timelineData: InsertNarrativeTimeline = {
          timelineName: `${character.name}: Origin Story`,
          timelineType: 'character_arc',
          scope: 'character',
          universe: character.universe || 'unknown',
          continuity: character.continuity || 'main',
          timelineStatus: 'active',
          timelineEra: this.determineEra(character.firstAppearance),
          primaryEntities: [character.id],
          associatedHouses: [primaryHouse],
          primaryHouse: primaryHouse,
          houseRelevanceScore: this.calculateHouseRelevance(character, primaryHouse),
          tradingEducationValue: this.calculateEducationalValue(character),
          marketInfluence: this.calculateMarketInfluence(character),
          volatilityPotential: this.calculateVolatilityPotential(character),
          speculativeValue: this.calculateSpeculativeValue(character),
          longTermImpact: this.calculateLongTermImpact(character),
          plotComplexity: this.calculatePlotComplexity(character),
          characterDevelopmentDepth: this.calculateDevelopmentDepth(character),
          primaryThemes: houseTheme.themes.slice(0, 3),
          moralAlignment: this.determineAlignment(character),
          emotionalTone: houseTheme.emotionalTones[0],
          narrativeGenre: houseTheme.narrativeGenres,
          culturalSignificance: this.calculateCulturalSignificance(character),
          socialCommentary: this.extractSocialCommentary(character),
          fandomEngagement: this.calculateFandomEngagement(character),
          crossoverPotential: this.calculateCrossoverPotential(character),
          merchandisingValue: this.calculateMerchandisingValue(character),
          adaptationSuccess: this.calculateAdaptationSuccess(character),
          iconicStatus: this.calculateIconicStatus(character),
          qualityScore: this.calculateQualityScore(character)
        };

        const [timeline] = await db.insert(narrativeTimelines).values(timelineData).returning();
        timelineIds.push(timeline.id);

        // Generate story beats for this origin timeline
        await this.generateOriginStoryBeats(timeline, character);

      } catch (error) {
        console.error(`Error creating origin timeline for ${character.name}:`, error);
      }
    }

    return timelineIds;
  }

  /**
   * Generate major comic event timelines (crossovers, reboots, major storylines)
   */
  private async generateMajorEventTimelines(): Promise<string[]> {
    const majorEvents = await db.select().from(enhancedComicIssues)
      .where(sql`${enhancedComicIssues.significanceScore} > 0.7`);

    const timelineIds: string[] = [];
    const eventGroups = this.groupEventsByStoryline(majorEvents);

    for (const [storyArc, issues] of eventGroups.entries()) {
      try {
        const primaryHouse = this.determineEventHouse(issues);
        const houseTheme = this.HOUSE_THEMES[primaryHouse as keyof typeof this.HOUSE_THEMES];

        const timelineData: InsertNarrativeTimeline = {
          timelineName: storyArc,
          timelineType: 'event_series',
          scope: issues.length > 10 ? 'universe' : 'team',
          universe: this.determineEventUniverse(issues),
          continuity: 'main',
          timelineStatus: 'completed',
          timelineEra: 'modern_age',
          primaryEntities: this.extractPrimaryEntities(issues),
          associatedHouses: this.determineAssociatedHouses(issues),
          primaryHouse: primaryHouse,
          houseRelevanceScore: this.calculateEventHouseRelevance(issues),
          tradingEducationValue: this.calculateEventEducationalValue(issues),
          marketInfluence: this.calculateEventMarketInfluence(issues),
          volatilityPotential: this.calculateEventVolatilityPotential(issues),
          speculativeValue: this.calculateEventSpeculativeValue(issues),
          longTermImpact: this.calculateEventLongTermImpact(issues),
          totalStoryBeats: issues.length,
          plotComplexity: this.calculateEventComplexity(issues),
          characterDevelopmentDepth: this.calculateEventDevelopmentDepth(issues),
          primaryThemes: houseTheme.themes.slice(0, 4),
          moralAlignment: this.determineEventAlignment(issues),
          emotionalTone: this.determineEventTone(issues),
          narrativeGenre: houseTheme.narrativeGenres,
          culturalSignificance: this.calculateEventCulturalSignificance(issues),
          fandomEngagement: this.calculateEventFandomEngagement(issues),
          crossoverPotential: 1.0, // Major events are inherently crossover-heavy
          merchandisingValue: this.calculateEventMerchandisingValue(issues),
          iconicStatus: this.calculateEventIconicStatus(issues),
          qualityScore: this.calculateEventQualityScore(issues)
        };

        const [timeline] = await db.insert(narrativeTimelines).values(timelineData).returning();
        timelineIds.push(timeline.id);

        // Generate story beats for this event timeline
        await this.generateEventStoryBeats(timeline, issues);

      } catch (error) {
        console.error(`Error creating event timeline for ${storyArc}:`, error);
      }
    }

    return timelineIds;
  }

  /**
   * Generate battle-driven timelines from battle scenarios
   */
  private async generateBattleTimelines(): Promise<string[]> {
    const battles = await db.select().from(battleScenarios)
      .where(sql`${battleScenarios.battleSignificance} > 0.6`);

    const timelineIds: string[] = [];

    for (const battle of battles) {
      try {
        const primaryHouse = this.determineBattleHouse(battle);
        const houseTheme = this.HOUSE_THEMES[primaryHouse as keyof typeof this.HOUSE_THEMES];

        const timelineData: InsertNarrativeTimeline = {
          timelineName: battle.battleName,
          timelineType: 'battle_arc',
          scope: battle.battleScope || 'team',
          universe: battle.universe || 'unknown',
          continuity: 'main',
          timelineStatus: 'completed',
          timelineEra: 'modern_age',
          primaryEntities: [
            ...(battle.heroesInvolved || []),
            ...(battle.villainsInvolved || [])
          ],
          associatedHouses: this.determineBattleHouses(battle),
          primaryHouse: primaryHouse,
          houseRelevanceScore: this.calculateBattleHouseRelevance(battle),
          tradingEducationValue: this.calculateBattleEducationalValue(battle),
          marketInfluence: this.calculateBattleMarketInfluence(battle),
          volatilityPotential: this.calculateBattleVolatilityPotential(battle),
          speculativeValue: this.calculateBattleSpeculativeValue(battle),
          longTermImpact: this.calculateBattleLongTermImpact(battle),
          plotComplexity: this.calculateBattleComplexity(battle),
          characterDevelopmentDepth: this.calculateBattleDevelopmentDepth(battle),
          primaryThemes: ['conflict', 'power_struggle', 'heroic_triumph'],
          moralAlignment: this.determineBattleAlignment(battle),
          emotionalTone: 'action',
          narrativeGenre: ['action', 'adventure', 'superhero'],
          culturalSignificance: this.calculateBattleCulturalSignificance(battle),
          fandomEngagement: this.calculateBattleFandomEngagement(battle),
          crossoverPotential: this.calculateBattleCrossoverPotential(battle),
          iconicStatus: this.calculateBattleIconicStatus(battle),
          qualityScore: this.calculateBattleQualityScore(battle)
        };

        const [timeline] = await db.insert(narrativeTimelines).values(timelineData).returning();
        timelineIds.push(timeline.id);

        // Generate story beats for this battle timeline
        await this.generateBattleStoryBeats(timeline, battle);

      } catch (error) {
        console.error(`Error creating battle timeline for ${battle.battleName}:`, error);
      }
    }

    return timelineIds;
  }

  /**
   * Generate cultural impact timelines from movie and media performance data
   */
  private async generateCulturalImpactTimelines(): Promise<string[]> {
    const movies = await db.select().from(moviePerformanceData)
      .where(sql`${moviePerformanceData.boxOfficeGross} > 100000000`);

    const timelineIds: string[] = [];

    for (const movie of movies) {
      try {
        const primaryHouse = this.determineMovieHouse(movie);
        const houseTheme = this.HOUSE_THEMES[primaryHouse as keyof typeof this.HOUSE_THEMES];

        const timelineData: InsertNarrativeTimeline = {
          timelineName: `${movie.title}: Cultural Impact`,
          timelineType: 'cultural_moment',
          scope: 'universe',
          universe: movie.universe || 'unknown',
          continuity: 'main',
          timelineStatus: 'completed',
          timelineEra: 'modern_age',
          primaryEntities: movie.featuredCharacters || [],
          associatedHouses: this.determineMovieHouses(movie),
          primaryHouse: primaryHouse,
          houseRelevanceScore: this.calculateMovieHouseRelevance(movie),
          tradingEducationValue: 0.8, // Movies are highly educational for market sentiment
          marketInfluence: this.calculateMovieMarketInfluence(movie),
          volatilityPotential: this.calculateMovieVolatilityPotential(movie),
          speculativeValue: this.calculateMovieSpeculativeValue(movie),
          longTermImpact: this.calculateMovieLongTermImpact(movie),
          plotComplexity: 0.6, // Movies tend to be less complex than comics
          characterDevelopmentDepth: 0.7,
          primaryThemes: houseTheme.themes.slice(0, 3),
          moralAlignment: 'heroic',
          emotionalTone: 'inspiring',
          narrativeGenre: ['superhero', 'action', 'adventure'],
          culturalSignificance: this.calculateMovieCulturalSignificance(movie),
          fandomEngagement: this.calculateMovieFandomEngagement(movie),
          crossoverPotential: this.calculateMovieCrossoverPotential(movie),
          merchandisingValue: this.calculateMovieMerchandisingValue(movie),
          adaptationSuccess: this.calculateMovieAdaptationSuccess(movie),
          iconicStatus: this.calculateMovieIconicStatus(movie),
          qualityScore: this.calculateMovieQualityScore(movie)
        };

        const [timeline] = await db.insert(narrativeTimelines).values(timelineData).returning();
        timelineIds.push(timeline.id);

        // Generate story beats for this cultural impact timeline
        await this.generateCulturalStoryBeats(timeline, movie);

      } catch (error) {
        console.error(`Error creating cultural timeline for ${movie.title}:`, error);
      }
    }

    return timelineIds;
  }

  /**
   * Generate story beats for character origin timelines
   */
  private async generateOriginStoryBeats(timeline: NarrativeTimeline, character: EnhancedCharacter): Promise<void> {
    const houseTheme = this.HOUSE_THEMES[timeline.primaryHouse as keyof typeof this.HOUSE_THEMES];
    const beats: InsertStoryBeat[] = [];

    // Origin story structure
    const originBeats = [
      { 
        beatTitle: `${character.name} - Normal Life`,
        beatType: 'introduction',
        beatCategory: 'character_moment',
        order: 1,
        description: `Before ${character.name} gained their powers`
      },
      {
        beatTitle: `${character.name} - Origin Event`,
        beatType: 'inciting_incident',
        beatCategory: 'transformation',
        order: 2,
        description: character.originStory || `The event that created ${character.name}`
      },
      {
        beatTitle: `${character.name} - First Powers`,
        beatType: 'power_revelation',
        beatCategory: 'transformation',
        order: 3,
        description: `${character.name} discovers their abilities`
      },
      {
        beatTitle: `${character.name} - First Challenge`,
        beatType: 'rising_action',
        beatCategory: 'confrontation',
        order: 4,
        description: `${character.name} faces their first major challenge`
      },
      {
        beatTitle: `${character.name} - Hero's Resolution`,
        beatType: 'resolution',
        beatCategory: 'character_moment',
        order: 5,
        description: `${character.name} accepts their heroic destiny`
      }
    ];

    for (const beat of originBeats) {
      const storyBeat: InsertStoryBeat = {
        timelineId: timeline.id,
        beatTitle: beat.beatTitle,
        beatType: beat.beatType,
        beatCategory: beat.beatCategory,
        narrativeFunction: beat.order <= 2 ? 'exposition' : beat.order >= 4 ? 'payoff' : 'development',
        chronologicalOrder: beat.order,
        relativePosition: beat.order / originBeats.length,
        primaryParticipants: [character.id],
        secondaryParticipants: [],
        primaryHouse: timeline.primaryHouse,
        associatedHouses: timeline.associatedHouses,
        marketRelevance: this.calculateBeatMarketRelevance(character, beat.order),
        priceImpactPotential: this.calculateBeatPriceImpact(character, beat.order),
        volatilityTrigger: this.calculateBeatVolatilityTrigger(character, beat.order),
        speculationOpportunity: this.calculateBeatSpeculationOpportunity(character, beat.order),
        plotSignificance: beat.order === 2 || beat.order === 4 ? 1.0 : 0.7,
        iconicStatus: this.calculateBeatIconicStatus(character, beat.order),
        fanResonance: this.calculateBeatFanResonance(character),
        moralImplications: this.determineBeatMoralImplications(beat.beatType),
        ethicalComplexity: this.calculateBeatEthicalComplexity(beat.beatType),
        description: beat.description,
        thematicElements: houseTheme.themes.slice(0, 2),
        emotionalImpact: this.calculateBeatEmotionalImpact(beat.beatType),
        characterGrowth: beat.order >= 3 ? 0.8 : 0.5,
        worldBuilding: beat.order === 1 ? 0.9 : 0.4
      };

      beats.push(storyBeat);
    }

    if (beats.length > 0) {
      await db.insert(storyBeats).values(beats);
    }

    // Update timeline with story beat count
    await db.update(narrativeTimelines)
      .set({ 
        totalStoryBeats: beats.length,
        completedStoryBeats: beats.length 
      })
      .where(eq(narrativeTimelines.id, timeline.id));
  }

  /**
   * Generate story beats for major event timelines
   */
  private async generateEventStoryBeats(timeline: NarrativeTimeline, issues: any[]): Promise<void> {
    const beats: InsertStoryBeat[] = [];
    let order = 1;

    for (const issue of issues.slice(0, 20)) { // Limit to first 20 issues to prevent overwhelming
      const storyBeat: InsertStoryBeat = {
        timelineId: timeline.id,
        beatTitle: issue.title,
        beatType: this.determineEventBeatType(issue, order, issues.length),
        beatCategory: this.determineEventBeatCategory(issue),
        narrativeFunction: this.determineEventNarrativeFunction(order, issues.length),
        chronologicalOrder: order,
        relativePosition: order / issues.length,
        primaryParticipants: issue.featuredCharacters || [],
        primaryHouse: timeline.primaryHouse,
        associatedHouses: timeline.associatedHouses,
        marketRelevance: issue.significanceScore || 0.5,
        priceImpactPotential: this.calculateEventBeatPriceImpact(issue),
        volatilityTrigger: this.calculateEventBeatVolatilityTrigger(issue),
        speculationOpportunity: this.calculateEventBeatSpeculationOpportunity(issue),
        plotSignificance: issue.plotSignificance || 0.7,
        iconicStatus: issue.iconicStatus || 0.6,
        fanResonance: issue.fanRating ? issue.fanRating / 10 : 0.7,
        moralImplications: this.determineEventBeatMoralImplications(issue),
        ethicalComplexity: this.calculateEventBeatEthicalComplexity(issue),
        description: issue.synopsis || `Major event in ${timeline.timelineName}`,
        thematicElements: timeline.primaryThemes || [],
        emotionalImpact: this.calculateEventBeatEmotionalImpact(issue),
        characterGrowth: this.calculateEventBeatCharacterGrowth(issue),
        worldBuilding: this.calculateEventBeatWorldBuilding(issue)
      };

      beats.push(storyBeat);
      order++;
    }

    if (beats.length > 0) {
      await db.insert(storyBeats).values(beats);
    }

    // Update timeline with story beat count
    await db.update(narrativeTimelines)
      .set({ 
        totalStoryBeats: beats.length,
        completedStoryBeats: beats.length,
        criticalStoryBeats: beats.filter(b => (b.plotSignificance || 0) > 0.8).length
      })
      .where(eq(narrativeTimelines.id, timeline.id));
  }

  /**
   * Generate story beats for battle timelines
   */
  private async generateBattleStoryBeats(timeline: NarrativeTimeline, battle: BattleScenario): Promise<void> {
    const beats: InsertStoryBeat[] = [];
    
    // Battle story structure
    const battleBeats = [
      {
        beatTitle: `${battle.battleName} - Setup`,
        beatType: 'introduction',
        beatCategory: 'exposition',
        order: 1,
        description: battle.battleDescription || `The setup for ${battle.battleName}`
      },
      {
        beatTitle: `${battle.battleName} - First Clash`,
        beatType: 'inciting_incident',
        beatCategory: 'action_sequence',
        order: 2,
        description: `Initial confrontation in ${battle.battleName}`
      },
      {
        beatTitle: `${battle.battleName} - Escalation`,
        beatType: 'rising_action',
        beatCategory: 'confrontation',
        order: 3,
        description: `The battle intensifies`
      },
      {
        beatTitle: `${battle.battleName} - Climax`,
        beatType: 'climax',
        beatCategory: 'action_sequence',
        order: 4,
        description: `The decisive moment of ${battle.battleName}`
      },
      {
        beatTitle: `${battle.battleName} - Resolution`,
        beatType: 'resolution',
        beatCategory: 'character_moment',
        order: 5,
        description: `The aftermath and consequences of ${battle.battleName}`
      }
    ];

    for (const beat of battleBeats) {
      const storyBeat: InsertStoryBeat = {
        timelineId: timeline.id,
        beatTitle: beat.beatTitle,
        beatType: beat.beatType,
        beatCategory: beat.beatCategory,
        narrativeFunction: beat.order <= 2 ? 'setup' : beat.order >= 4 ? 'payoff' : 'conflict',
        chronologicalOrder: beat.order,
        relativePosition: beat.order / battleBeats.length,
        primaryParticipants: [
          ...(battle.heroesInvolved || []),
          ...(battle.villainsInvolved || [])
        ].slice(0, 5), // Limit participants
        primaryHouse: timeline.primaryHouse,
        associatedHouses: timeline.associatedHouses,
        marketRelevance: this.calculateBattleBeatMarketRelevance(battle, beat.order),
        priceImpactPotential: this.calculateBattleBeatPriceImpact(battle, beat.order),
        volatilityTrigger: this.calculateBattleBeatVolatilityTrigger(battle, beat.order),
        speculationOpportunity: this.calculateBattleBeatSpeculationOpportunity(battle, beat.order),
        plotSignificance: beat.order === 4 ? 1.0 : 0.8,
        iconicStatus: this.calculateBattleBeatIconicStatus(battle, beat.order),
        fanResonance: battle.fanRating ? battle.fanRating / 10 : 0.8,
        moralImplications: this.determineBattleBeatMoralImplications(battle),
        ethicalComplexity: this.calculateBattleBeatEthicalComplexity(battle),
        description: beat.description,
        thematicElements: ['conflict', 'power_struggle', 'heroic_triumph'],
        emotionalImpact: this.calculateBattleBeatEmotionalImpact(beat.order),
        characterGrowth: beat.order >= 4 ? 0.9 : 0.6,
        worldBuilding: beat.order === 1 ? 0.8 : 0.5
      };

      beats.push(storyBeat);
    }

    if (beats.length > 0) {
      await db.insert(storyBeats).values(beats);
    }

    // Update timeline with story beat count
    await db.update(narrativeTimelines)
      .set({ 
        totalStoryBeats: beats.length,
        completedStoryBeats: beats.length,
        criticalStoryBeats: beats.filter(b => (b.plotSignificance || 0) > 0.8).length
      })
      .where(eq(narrativeTimelines.id, timeline.id));
  }

  /**
   * Generate story beats for cultural impact timelines
   */
  private async generateCulturalStoryBeats(timeline: NarrativeTimeline, movie: any): Promise<void> {
    const beats: InsertStoryBeat[] = [];
    
    // Cultural impact structure
    const culturalBeats = [
      {
        beatTitle: `${movie.title} - Announcement`,
        beatType: 'introduction',
        beatCategory: 'cultural_moment',
        order: 1,
        description: `${movie.title} announced to the public`
      },
      {
        beatTitle: `${movie.title} - Marketing Campaign`,
        beatType: 'rising_action',
        beatCategory: 'cultural_moment',
        order: 2,
        description: `Marketing campaign builds excitement for ${movie.title}`
      },
      {
        beatTitle: `${movie.title} - Release`,
        beatType: 'climax',
        beatCategory: 'cultural_moment',
        order: 3,
        description: `${movie.title} hits theaters worldwide`
      },
      {
        beatTitle: `${movie.title} - Cultural Impact`,
        beatType: 'falling_action',
        beatCategory: 'cultural_moment',
        order: 4,
        description: `${movie.title} influences pop culture and markets`
      },
      {
        beatTitle: `${movie.title} - Legacy`,
        beatType: 'resolution',
        beatCategory: 'cultural_moment',
        order: 5,
        description: `Long-term impact of ${movie.title} on the comic universe`
      }
    ];

    for (const beat of culturalBeats) {
      const storyBeat: InsertStoryBeat = {
        timelineId: timeline.id,
        beatTitle: beat.beatTitle,
        beatType: beat.beatType,
        beatCategory: beat.beatCategory,
        narrativeFunction: beat.order === 3 ? 'payoff' : beat.order < 3 ? 'setup' : 'callback',
        chronologicalOrder: beat.order,
        relativePosition: beat.order / culturalBeats.length,
        primaryParticipants: movie.featuredCharacters || [],
        primaryHouse: timeline.primaryHouse,
        associatedHouses: timeline.associatedHouses,
        marketRelevance: this.calculateMovieBeatMarketRelevance(movie, beat.order),
        priceImpactPotential: this.calculateMovieBeatPriceImpact(movie, beat.order),
        volatilityTrigger: this.calculateMovieBeatVolatilityTrigger(movie, beat.order),
        speculationOpportunity: this.calculateMovieBeatSpeculationOpportunity(movie, beat.order),
        plotSignificance: beat.order === 3 ? 1.0 : 0.7,
        iconicStatus: this.calculateMovieBeatIconicStatus(movie, beat.order),
        fanResonance: movie.imdbRating ? movie.imdbRating / 10 : 0.8,
        moralImplications: this.determineMovieBeatMoralImplications(movie),
        ethicalComplexity: 0.5, // Movies tend to be less ethically complex than comics
        description: beat.description,
        thematicElements: timeline.primaryThemes || [],
        emotionalImpact: this.calculateMovieBeatEmotionalImpact(beat.order),
        characterGrowth: beat.order >= 4 ? 0.7 : 0.5,
        worldBuilding: beat.order === 4 ? 0.9 : 0.6
      };

      beats.push(storyBeat);
    }

    if (beats.length > 0) {
      await db.insert(storyBeats).values(beats);
    }

    // Update timeline with story beat count
    await db.update(narrativeTimelines)
      .set({ 
        totalStoryBeats: beats.length,
        completedStoryBeats: beats.length,
        criticalStoryBeats: beats.filter(b => (b.plotSignificance || 0) > 0.8).length
      })
      .where(eq(narrativeTimelines.id, timeline.id));
  }

  /**
   * Create market sentiment integration by connecting story beats to market volatility
   */
  async createMarketSentimentIntegration(): Promise<void> {
    try {
      console.log('🎭 Creating market sentiment integration through narrative momentum...');

      // Get all active timelines and story beats
      const timelines = await db.select().from(narrativeTimelines)
        .where(eq(narrativeTimelines.timelineStatus, 'active'));

      const beats = await db.select().from(storyBeats)
        .where(inArray(storyBeats.timelineId, timelines.map(t => t.id)));

      // Generate narrative momentum that affects asset prices
      for (const timeline of timelines) {
        const timelineBeats = beats.filter(b => b.timelineId === timeline.id);
        await this.generateNarrativeMomentum(timeline, timelineBeats);
      }

      // Create house-specific story themes that resonate with asset types
      await this.createHouseSpecificResonance();

      // Generate timeline events that create trading opportunities
      await this.generateTradingOpportunities(timelines, beats);

      console.log('✨ Market sentiment integration complete - stories now drive market movements!');

    } catch (error) {
      console.error('❌ Error creating market sentiment integration:', error);
      throw error;
    }
  }

  /**
   * Generate narrative momentum that affects asset prices
   */
  private async generateNarrativeMomentum(timeline: NarrativeTimeline, beats: StoryBeat[]): Promise<void> {
    // Calculate overall narrative momentum for timeline
    const momentum = this.calculateNarrativeMomentum(timeline, beats);
    
    // Update asset financial mappings with narrative-driven volatility factors
    const affectedAssets = await db.select().from(assets)
      .where(inArray(assets.id, timeline.primaryEntities || []));

    for (const asset of affectedAssets) {
      try {
        // Check if financial mapping exists
        const existingMapping = await db.select().from(assetFinancialMapping)
          .where(eq(assetFinancialMapping.assetId, asset.id))
          .limit(1);

        const narrativeFactors = {
          narrativeMomentum: momentum,
          storyRelevance: timeline.houseRelevanceScore,
          culturalImpact: timeline.culturalSignificance,
          fanEngagement: timeline.fandomEngagement
        };

        if (existingMapping.length > 0) {
          // Update existing mapping with narrative factors
          await db.update(assetFinancialMapping)
            .set({
              volatilityMultiplier: this.calculateNarrativeVolatilityMultiplier(momentum),
              updatedAt: new Date()
            })
            .where(eq(assetFinancialMapping.assetId, asset.id));
        } else {
          // Create new financial mapping with narrative factors
          await db.insert(assetFinancialMapping).values({
            assetId: asset.id,
            basePrice: '10.00', // Default base price
            volatilityMultiplier: this.calculateNarrativeVolatilityMultiplier(momentum),
            trendDirection: this.calculateNarrativeTrendDirection(timeline),
            supportLevel: '8.00',
            resistanceLevel: '15.00',
            beta: this.calculateNarrativeBeta(timeline),
            correlationFactors: narrativeFactors
          });
        }

        // Generate market insight based on narrative
        await this.generateNarrativeMarketInsight(asset, timeline, momentum);

      } catch (error) {
        console.error(`Error updating financial mapping for ${asset.symbol}:`, error);
      }
    }
  }

  /**
   * Create house-specific story themes that resonate with asset types
   */
  private async createHouseSpecificResonance(): Promise<void> {
    for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
      // Get assets that resonate with this house's themes
      const resonantAssets = await db.select().from(assets)
        .where(sql`
          (${assets.metadata}->>'house' = ${houseId}) OR
          (${assets.name} ~* ${houseData.keywords.join('|')}) OR
          (${assets.description} ~* ${houseData.keywords.join('|')})
        `);

      // Update these assets with house-specific volatility patterns
      for (const asset of resonantAssets) {
        await this.applyHouseSpecificVolatility(asset, houseId, houseData);
      }
    }
  }

  /**
   * Generate trading opportunities from timeline events
   */
  private async generateTradingOpportunities(timelines: NarrativeTimeline[], beats: StoryBeat[]): Promise<void> {
    for (const timeline of timelines) {
      const timelineBeats = beats.filter(b => b.timelineId === timeline.id);
      const criticalBeats = timelineBeats.filter(b => (b.plotSignificance || 0) > 0.8);

      for (const beat of criticalBeats) {
        // Generate market insight for this critical story beat
        const insight = {
          title: `Market Alert: ${beat.beatTitle}`,
          description: `Narrative event "${beat.beatTitle}" creates trading opportunity`,
          category: 'narrative_event',
          confidenceScore: beat.plotSignificance || 0.8,
          impactRadius: timeline.scope,
          recommendedAction: this.determineRecommendedAction(beat),
          affectedAssets: beat.primaryParticipants || [],
          houseAlignment: beat.primaryHouse || timeline.primaryHouse,
          timeframe: this.determineEventTimeframe(beat),
          riskLevel: this.calculateEventRiskLevel(beat),
          opportunityScore: beat.speculationOpportunity || 0.7
        };

        // Insert market insight
        await db.insert(marketInsights).values({
          title: insight.title,
          content: insight.description,
          category: insight.category,
          confidenceScore: insight.confidenceScore.toString(),
          tags: [insight.houseAlignment, insight.impactRadius, insight.timeframe],
          relatedAssets: insight.affectedAssets,
          metadata: insight
        });
      }
    }
  }

  // Helper methods for character analysis
  private determineCharacterHouse(character: EnhancedCharacter): string {
    const name = character.name.toLowerCase();
    const powers = (character.powers || []).join(' ').toLowerCase();
    const description = (character.description || '').toLowerCase();
    const searchText = `${name} ${powers} ${description}`;

    // Score each house based on keyword matches
    const houseScores: { [key: string]: number } = {};
    
    for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
      houseScores[houseId] = houseData.keywords.reduce((score, keyword) => {
        return score + (searchText.includes(keyword) ? 1 : 0);
      }, 0);
    }

    // Return house with highest score, default to 'heroes'
    return Object.entries(houseScores).reduce((a, b) => 
      houseScores[a[0]] > houseScores[b[0]] ? a : b
    )[0] || 'heroes';
  }

  private calculateHouseRelevance(character: EnhancedCharacter, house: string): number {
    const houseData = this.HOUSE_THEMES[house as keyof typeof this.HOUSE_THEMES];
    if (!houseData) return 0.5;

    let relevance = 0;
    const searchText = `${character.name} ${character.powers?.join(' ')} ${character.description}`.toLowerCase();
    
    // Calculate keyword match percentage
    const matchedKeywords = houseData.keywords.filter(keyword => 
      searchText.includes(keyword)
    ).length;
    
    relevance = matchedKeywords / houseData.keywords.length;
    
    // Ensure it's between 0 and 1
    return Math.min(Math.max(relevance, 0.1), 1.0);
  }

  // Helper calculation methods
  private calculateEducationalValue(character: EnhancedCharacter): number {
    // Base on character complexity and historical significance
    const complexity = character.powers?.length || 1;
    const significance = character.firstAppearance ? 1.0 : 0.5;
    return Math.min((complexity * 0.1) + (significance * 0.8), 1.0);
  }

  private calculateMarketInfluence(character: EnhancedCharacter): number {
    // Base on popularity metrics and cross-media presence
    const popularity = character.popularityScore || 0.5;
    const mediaPresence = character.movieAppearances ? Math.min(character.movieAppearances * 0.1, 0.5) : 0;
    return Math.min(popularity + mediaPresence, 1.0);
  }

  private calculateVolatilityPotential(character: EnhancedCharacter): number {
    // Characters with more dramatic storylines have higher volatility potential
    const powerLevel = character.powerLevel || 5;
    const controversy = character.controversialEvents ? 0.3 : 0;
    const deaths = character.deathCount || 0;
    return Math.min((powerLevel * 0.1) + controversy + (deaths * 0.2), 1.0);
  }

  private calculateSpeculativeValue(character: EnhancedCharacter): number {
    // Base on rarity and future potential
    const rarity = character.firstAppearance ? 0.8 : 0.4;
    const potential = character.unrealizedPotential || 0.5;
    return Math.min(rarity * potential, 1.0);
  }

  private calculateLongTermImpact(character: EnhancedCharacter): number {
    // Iconic characters have lasting impact
    const iconicStatus = character.iconicStatus || 0.5;
    const franchiseValue = character.franchiseValue || 0.5;
    return Math.min((iconicStatus + franchiseValue) / 2, 1.0);
  }

  private calculatePlotComplexity(character: EnhancedCharacter): number {
    // More complex backstories = higher complexity
    const storyElements = [
      character.originStory,
      character.alterEgo,
      character.secretIdentity
    ].filter(Boolean).length;
    return Math.min(storyElements * 0.3, 1.0);
  }

  private calculateDevelopmentDepth(character: EnhancedCharacter): number {
    // Character growth over time
    const relationships = character.relationships?.length || 0;
    const arcs = character.majorStoryArcs?.length || 1;
    return Math.min((relationships * 0.1) + (arcs * 0.2), 1.0);
  }

  private determineAlignment(character: EnhancedCharacter): string {
    const alignment = character.moralAlignment || 'neutral';
    return alignment.toLowerCase().replace(/\s+/g, '_');
  }

  private calculateCulturalSignificance(character: EnhancedCharacter): number {
    return character.culturalImpact || character.popularityScore || 0.5;
  }

  private extractSocialCommentary(character: EnhancedCharacter): string[] {
    return character.socialThemes || [];
  }

  private calculateFandomEngagement(character: EnhancedCharacter): number {
    return character.fanEngagement || 0.7;
  }

  private calculateCrossoverPotential(character: EnhancedCharacter): number {
    return character.crossoverAppearances ? Math.min(character.crossoverAppearances * 0.1, 1.0) : 0.5;
  }

  private calculateMerchandisingValue(character: EnhancedCharacter): number {
    return character.merchandisingRevenue ? Math.min(character.merchandisingRevenue / 1000000, 1.0) : 0.6;
  }

  private calculateAdaptationSuccess(character: EnhancedCharacter): number {
    return character.adaptationSuccess || 0.5;
  }

  private calculateIconicStatus(character: EnhancedCharacter): number {
    return character.iconicStatus || 0.5;
  }

  private calculateQualityScore(character: EnhancedCharacter): number {
    return character.qualityRating || 0.7;
  }

  private determineEra(firstAppearance?: string): string {
    if (!firstAppearance) return 'modern_age';
    
    const year = parseInt(firstAppearance.split('-')[0] || firstAppearance.slice(0, 4));
    if (year < 1938) return 'golden_age';
    if (year < 1956) return 'golden_age';
    if (year < 1970) return 'silver_age';
    if (year < 1985) return 'bronze_age';
    return 'modern_age';
  }

  // Event processing helper methods
  private groupEventsByStoryline(issues: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();
    
    for (const issue of issues) {
      const storyArc = issue.storyArc || issue.series || 'Untitled Event';
      if (!groups.has(storyArc)) {
        groups.set(storyArc, []);
      }
      groups.get(storyArc)!.push(issue);
    }
    
    return groups;
  }

  private determineEventHouse(issues: any[]): string {
    // Aggregate house determination across all issues
    const houseScores: { [key: string]: number } = {};
    
    for (const issue of issues) {
      const house = this.determineIssueHouse(issue);
      houseScores[house] = (houseScores[house] || 0) + 1;
    }
    
    return Object.entries(houseScores).reduce((a, b) => 
      houseScores[a[0]] > houseScores[b[0]] ? a : b
    )[0] || 'heroes';
  }

  private determineIssueHouse(issue: any): string {
    const title = (issue.title || '').toLowerCase();
    const synopsis = (issue.synopsis || '').toLowerCase();
    const searchText = `${title} ${synopsis}`;

    // Score each house based on keyword matches
    const houseScores: { [key: string]: number } = {};
    
    for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
      houseScores[houseId] = houseData.keywords.reduce((score, keyword) => {
        return score + (searchText.includes(keyword) ? 1 : 0);
      }, 0);
    }

    return Object.entries(houseScores).reduce((a, b) => 
      houseScores[a[0]] > houseScores[b[0]] ? a : b
    )[0] || 'heroes';
  }

  private determineEventUniverse(issues: any[]): string {
    const universes = issues.map(i => i.universe).filter(Boolean);
    const universeCounts: { [key: string]: number } = {};
    
    for (const universe of universes) {
      universeCounts[universe] = (universeCounts[universe] || 0) + 1;
    }
    
    return Object.entries(universeCounts).reduce((a, b) => 
      universeCounts[a[0]] > universeCounts[b[0]] ? a : b
    )[0] || 'unknown';
  }

  private extractPrimaryEntities(issues: any[]): string[] {
    const entities = new Set<string>();
    
    for (const issue of issues) {
      const characters = issue.featuredCharacters || [];
      characters.slice(0, 3).forEach((char: string) => entities.add(char));
    }
    
    return Array.from(entities).slice(0, 10); // Limit to 10 primary entities
  }

  private determineAssociatedHouses(issues: any[]): string[] {
    const houses = new Set<string>();
    
    for (const issue of issues) {
      houses.add(this.determineIssueHouse(issue));
    }
    
    return Array.from(houses);
  }

  // Additional calculation methods for events, battles, and movies would follow similar patterns...
  // For brevity, I'll implement key methods that are referenced

  private calculateEventHouseRelevance(issues: any[]): number {
    return Math.min(issues.length * 0.05, 1.0);
  }

  private calculateEventEducationalValue(issues: any[]): number {
    return Math.min(issues.length * 0.03, 0.9);
  }

  private calculateEventMarketInfluence(issues: any[]): number {
    const avgSignificance = issues.reduce((sum, issue) => sum + (issue.significanceScore || 0.5), 0) / issues.length;
    return Math.min(avgSignificance + (issues.length * 0.01), 1.0);
  }

  private calculateEventVolatilityPotential(issues: any[]): number {
    return Math.min(issues.length * 0.04, 1.0);
  }

  private calculateEventSpeculativeValue(issues: any[]): number {
    return Math.min(issues.length * 0.02, 0.8);
  }

  private calculateEventLongTermImpact(issues: any[]): number {
    return Math.min(issues.length * 0.03, 0.9);
  }

  // Additional helper methods continue...
  // Battle calculation methods
  private determineBattleHouse(battle: BattleScenario): string {
    const searchText = `${battle.battleName} ${battle.battleDescription}`.toLowerCase();
    
    for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
      for (const keyword of houseData.keywords) {
        if (searchText.includes(keyword)) {
          return houseId;
        }
      }
    }
    
    return 'power'; // Default for battles
  }

  private determineBattleHouses(battle: BattleScenario): string[] {
    const houses = new Set<string>();
    houses.add(this.determineBattleHouse(battle));
    
    // Add houses based on participants
    const allParticipants = [
      ...(battle.heroesInvolved || []),
      ...(battle.villainsInvolved || [])
    ];
    
    // For simplicity, add power house for any major battle
    if (allParticipants.length > 5) {
      houses.add('power');
    }
    
    return Array.from(houses);
  }

  // Movie calculation methods
  private determineMovieHouse(movie: any): string {
    const searchText = `${movie.title} ${movie.genre}`.toLowerCase();
    
    for (const [houseId, houseData] of Object.entries(this.HOUSE_THEMES)) {
      for (const keyword of houseData.keywords) {
        if (searchText.includes(keyword)) {
          return houseId;
        }
      }
    }
    
    return 'heroes'; // Default for movies
  }

  private determineMovieHouses(movie: any): string[] {
    return [this.determineMovieHouse(movie)];
  }

  // Beat calculation methods (simplified implementations)
  private calculateBeatMarketRelevance(character: EnhancedCharacter, order: number): number {
    const base = character.popularityScore || 0.5;
    const orderMultiplier = order === 2 || order === 4 ? 1.2 : 1.0; // Peak moments
    return Math.min(base * orderMultiplier, 1.0);
  }

  private calculateBeatPriceImpact(character: EnhancedCharacter, order: number): number {
    const base = character.marketValue ? Math.min(character.marketValue / 1000, 1.0) : 0.5;
    const orderMultiplier = order === 2 ? 1.5 : order === 4 ? 1.3 : 1.0;
    return Math.min(base * orderMultiplier, 1.0);
  }

  private calculateBeatVolatilityTrigger(character: EnhancedCharacter, order: number): number {
    return order === 2 || order === 4 ? 0.9 : 0.6; // Origin event and resolution are high volatility
  }

  private calculateBeatSpeculationOpportunity(character: EnhancedCharacter, order: number): number {
    return order === 3 ? 0.8 : 0.6; // First powers moment has high speculation value
  }

  private calculateBeatIconicStatus(character: EnhancedCharacter, order: number): number {
    const base = character.iconicStatus || 0.5;
    return order === 2 ? Math.min(base * 1.2, 1.0) : base; // Origin event is most iconic
  }

  private calculateBeatFanResonance(character: EnhancedCharacter): number {
    return character.fanEngagement || 0.7;
  }

  private determineBeatMoralImplications(beatType: string): string[] {
    const moralMaps: { [key: string]: string[] } = {
      'introduction': ['normalcy', 'innocence'],
      'inciting_incident': ['responsibility', 'choice'],
      'power_revelation': ['power_responsibility', 'identity'],
      'rising_action': ['courage', 'sacrifice'],
      'resolution': ['acceptance', 'heroism']
    };
    
    return moralMaps[beatType] || ['heroism'];
  }

  private calculateBeatEthicalComplexity(beatType: string): number {
    const complexityMap: { [key: string]: number } = {
      'introduction': 0.3,
      'inciting_incident': 0.8,
      'power_revelation': 0.7,
      'rising_action': 0.6,
      'resolution': 0.5
    };
    
    return complexityMap[beatType] || 0.5;
  }

  private calculateBeatEmotionalImpact(beatType: string): number {
    const impactMap: { [key: string]: number } = {
      'introduction': 0.5,
      'inciting_incident': 0.9,
      'power_revelation': 0.8,
      'rising_action': 0.7,
      'resolution': 0.8
    };
    
    return impactMap[beatType] || 0.6;
  }

  // Narrative momentum and market integration
  private calculateNarrativeMomentum(timeline: NarrativeTimeline, beats: StoryBeat[]): number {
    if (beats.length === 0) return 0.5;
    
    const avgPlotSignificance = beats.reduce((sum, beat) => 
      sum + (beat.plotSignificance || 0.5), 0) / beats.length;
    
    const avgVolatilityTrigger = beats.reduce((sum, beat) => 
      sum + (beat.volatilityTrigger || 0.5), 0) / beats.length;
    
    const timelineInfluence = timeline.marketInfluence || 0.5;
    
    return Math.min((avgPlotSignificance + avgVolatilityTrigger + timelineInfluence) / 3, 1.0);
  }

  private calculateNarrativeVolatilityMultiplier(momentum: number): string {
    // Convert momentum to volatility multiplier (1.0 to 3.0)
    const multiplier = 1.0 + (momentum * 2.0);
    return multiplier.toFixed(2);
  }

  private calculateNarrativeTrendDirection(timeline: NarrativeTimeline): string {
    // Determine trend based on timeline characteristics
    if ((timeline.longTermImpact || 0) > 0.7) return 'bullish';
    if ((timeline.volatilityPotential || 0) > 0.8) return 'volatile';
    return 'neutral';
  }

  private calculateNarrativeBeta(timeline: NarrativeTimeline): string {
    // Calculate beta based on timeline characteristics
    const volatility = timeline.volatilityPotential || 0.5;
    const beta = 0.5 + volatility; // Range 0.5 to 1.5
    return beta.toFixed(2);
  }

  private async generateNarrativeMarketInsight(
    asset: Asset, 
    timeline: NarrativeTimeline, 
    momentum: number
  ): Promise<void> {
    const insight = {
      title: `Narrative Analysis: ${asset.name}`,
      content: `${asset.name} showing ${momentum > 0.7 ? 'strong' : 'moderate'} narrative momentum from "${timeline.timelineName}" storyline. House ${timeline.primaryHouse} themes driving market sentiment.`,
      category: 'narrative_analysis',
      confidenceScore: momentum.toFixed(2),
      tags: [timeline.primaryHouse || 'neutral', timeline.timelineType, 'narrative'],
      relatedAssets: [asset.id],
      metadata: {
        timelineId: timeline.id,
        momentum: momentum,
        houseAlignment: timeline.primaryHouse,
        narrativeThemes: timeline.primaryThemes
      }
    };

    await db.insert(marketInsights).values(insight);
  }

  private async applyHouseSpecificVolatility(asset: Asset, houseId: string, houseData: any): Promise<void> {
    // Apply house-specific volatility patterns
    const houseVolatilityMap: { [key: string]: number } = {
      'heroes': 1.2,    // Moderate volatility, stable trends
      'wisdom': 1.1,    // Lower volatility, strategic movements
      'power': 1.8,     // High volatility, dramatic swings
      'mystery': 1.5,   // Moderate-high volatility, unpredictable
      'elements': 1.3,  // Moderate volatility, cyclical patterns
      'time': 1.6,      // High volatility, complex patterns
      'spirit': 1.4     // Moderate-high volatility, ethereal patterns
    };

    const volatilityMultiplier = houseVolatilityMap[houseId] || 1.2;

    // Update or create financial mapping
    const existingMapping = await db.select().from(assetFinancialMapping)
      .where(eq(assetFinancialMapping.assetId, asset.id))
      .limit(1);

    if (existingMapping.length > 0) {
      await db.update(assetFinancialMapping)
        .set({
          volatilityMultiplier: volatilityMultiplier.toFixed(2),
          updatedAt: new Date()
        })
        .where(eq(assetFinancialMapping.assetId, asset.id));
    } else {
      await db.insert(assetFinancialMapping).values({
        assetId: asset.id,
        basePrice: '10.00',
        volatilityMultiplier: volatilityMultiplier.toFixed(2),
        trendDirection: 'neutral',
        supportLevel: '8.00',
        resistanceLevel: '15.00',
        beta: '1.0',
        correlationFactors: { houseAlignment: houseId }
      });
    }
  }

  private determineRecommendedAction(beat: StoryBeat): string {
    if ((beat.volatilityTrigger || 0) > 0.8) return 'VOLATILITY_PLAY';
    if ((beat.speculationOpportunity || 0) > 0.8) return 'SPECULATIVE_BUY';
    if ((beat.plotSignificance || 0) > 0.9) return 'LONG_TERM_HOLD';
    return 'MONITOR';
  }

  private determineEventTimeframe(beat: StoryBeat): string {
    const significance = beat.plotSignificance || 0.5;
    if (significance > 0.9) return 'long_term';
    if (significance > 0.7) return 'medium_term';
    return 'short_term';
  }

  private calculateEventRiskLevel(beat: StoryBeat): string {
    const volatility = beat.volatilityTrigger || 0.5;
    if (volatility > 0.8) return 'high';
    if (volatility > 0.6) return 'medium';
    return 'low';
  }

  // Additional simplified implementations for remaining methods...
  private determineEventBeatType(issue: any, order: number, totalIssues: number): string {
    if (order === 1) return 'introduction';
    if (order === 2) return 'inciting_incident';
    if (order === totalIssues) return 'resolution';
    if (order === Math.floor(totalIssues * 0.7)) return 'climax';
    return 'rising_action';
  }

  private determineEventBeatCategory(issue: any): string {
    const categories = ['character_moment', 'action_sequence', 'revelation', 'confrontation'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private determineEventNarrativeFunction(order: number, total: number): string {
    if (order <= 2) return 'setup';
    if (order >= total - 1) return 'payoff';
    return 'development';
  }

  private calculateEventBeatPriceImpact(issue: any): number {
    return issue.significanceScore || 0.6;
  }

  private calculateEventBeatVolatilityTrigger(issue: any): number {
    return issue.plotSignificance || 0.7;
  }

  private calculateEventBeatSpeculationOpportunity(issue: any): number {
    return issue.speculationPotential || 0.6;
  }

  private determineEventBeatMoralImplications(issue: any): string[] {
    return ['heroism', 'sacrifice', 'justice'];
  }

  private calculateEventBeatEthicalComplexity(issue: any): number {
    return 0.6;
  }

  private calculateEventBeatEmotionalImpact(issue: any): number {
    return 0.7;
  }

  private calculateEventBeatCharacterGrowth(issue: any): number {
    return 0.6;
  }

  private calculateEventBeatWorldBuilding(issue: any): number {
    return 0.5;
  }

  private calculateEventComplexity(issues: any[]): number {
    return Math.min(issues.length * 0.05, 1.0);
  }

  private calculateEventDevelopmentDepth(issues: any[]): number {
    return Math.min(issues.length * 0.03, 0.9);
  }

  private determineEventAlignment(issues: any[]): string {
    return 'heroic';
  }

  private determineEventTone(issues: any[]): string {
    return 'epic';
  }

  private calculateEventCulturalSignificance(issues: any[]): number {
    return Math.min(issues.length * 0.04, 1.0);
  }

  private calculateEventFandomEngagement(issues: any[]): number {
    return Math.min(issues.length * 0.03, 0.9);
  }

  private calculateEventMerchandisingValue(issues: any[]): number {
    return Math.min(issues.length * 0.02, 0.8);
  }

  private calculateEventIconicStatus(issues: any[]): number {
    return Math.min(issues.length * 0.04, 1.0);
  }

  private calculateEventQualityScore(issues: any[]): number {
    const avgScore = issues.reduce((sum, issue) => sum + (issue.qualityRating || 0.7), 0) / issues.length;
    return avgScore;
  }

  // Battle-specific methods (simplified)
  private calculateBattleHouseRelevance(battle: BattleScenario): number {
    return battle.battleSignificance || 0.8;
  }

  private calculateBattleEducationalValue(battle: BattleScenario): number {
    return 0.7;
  }

  private calculateBattleMarketInfluence(battle: BattleScenario): number {
    return battle.battleSignificance || 0.8;
  }

  private calculateBattleVolatilityPotential(battle: BattleScenario): number {
    return 0.9; // Battles inherently create volatility
  }

  private calculateBattleSpeculativeValue(battle: BattleScenario): number {
    return 0.8;
  }

  private calculateBattleLongTermImpact(battle: BattleScenario): number {
    return battle.battleSignificance || 0.7;
  }

  private calculateBattleComplexity(battle: BattleScenario): number {
    const participants = (battle.heroesInvolved?.length || 0) + (battle.villainsInvolved?.length || 0);
    return Math.min(participants * 0.1, 1.0);
  }

  private calculateBattleDevelopmentDepth(battle: BattleScenario): number {
    return 0.8;
  }

  private determineBattleAlignment(battle: BattleScenario): string {
    return battle.outcome === 'heroes_win' ? 'heroic' : 'gray';
  }

  private calculateBattleCulturalSignificance(battle: BattleScenario): number {
    return battle.culturalImpact || 0.7;
  }

  private calculateBattleFandomEngagement(battle: BattleScenario): number {
    return battle.fanRating ? battle.fanRating / 10 : 0.8;
  }

  private calculateBattleCrossoverPotential(battle: BattleScenario): number {
    return 0.9; // Battles often involve crossovers
  }

  private calculateBattleIconicStatus(battle: BattleScenario): number {
    return battle.battleSignificance || 0.8;
  }

  private calculateBattleQualityScore(battle: BattleScenario): number {
    return battle.qualityRating || 0.8;
  }

  // Battle beat methods
  private calculateBattleBeatMarketRelevance(battle: BattleScenario, order: number): number {
    const base = battle.battleSignificance || 0.8;
    return order === 4 ? base : base * 0.8; // Climax has highest relevance
  }

  private calculateBattleBeatPriceImpact(battle: BattleScenario, order: number): number {
    return order === 4 ? 0.9 : 0.7; // Climax has highest price impact
  }

  private calculateBattleBeatVolatilityTrigger(battle: BattleScenario, order: number): number {
    return order === 4 ? 1.0 : 0.8; // Climax triggers maximum volatility
  }

  private calculateBattleBeatSpeculationOpportunity(battle: BattleScenario, order: number): number {
    return order === 3 ? 0.9 : 0.7; // Escalation offers best speculation
  }

  private calculateBattleBeatIconicStatus(battle: BattleScenario, order: number): number {
    return order === 4 ? battle.battleSignificance || 0.9 : 0.7;
  }

  private determineBattleBeatMoralImplications(battle: BattleScenario): string[] {
    return ['heroism', 'sacrifice', 'justice', 'conflict_resolution'];
  }

  private calculateBattleBeatEthicalComplexity(battle: BattleScenario): number {
    return 0.8; // Battles involve complex ethical decisions
  }

  private calculateBattleBeatEmotionalImpact(order: number): number {
    const impactMap = [0.6, 0.7, 0.8, 1.0, 0.9]; // Climax has maximum impact
    return impactMap[order - 1] || 0.7;
  }

  // Movie-specific methods (simplified)
  private calculateMovieHouseRelevance(movie: any): number {
    return movie.boxOfficeGross ? Math.min(movie.boxOfficeGross / 1000000000, 1.0) : 0.8;
  }

  private calculateMovieMarketInfluence(movie: any): number {
    return movie.boxOfficeGross ? Math.min(movie.boxOfficeGross / 2000000000, 1.0) : 0.8;
  }

  private calculateMovieVolatilityPotential(movie: any): number {
    return 0.9; // Movies create significant market volatility
  }

  private calculateMovieSpeculativeValue(movie: any): number {
    return 0.8;
  }

  private calculateMovieLongTermImpact(movie: any): number {
    return movie.franchiseValue ? Math.min(movie.franchiseValue / 1000, 1.0) : 0.8;
  }

  private calculateMovieCulturalSignificance(movie: any): number {
    return movie.culturalImpactScore || 0.9;
  }

  private calculateMovieFandomEngagement(movie: any): number {
    return movie.imdbRating ? movie.imdbRating / 10 : 0.8;
  }

  private calculateMovieCrossoverPotential(movie: any): number {
    return movie.isSequelOrSpinoff ? 0.9 : 0.7;
  }

  private calculateMovieMerchandisingValue(movie: any): number {
    return movie.merchandisingRevenue ? Math.min(movie.merchandisingRevenue / 500000000, 1.0) : 0.8;
  }

  private calculateMovieAdaptationSuccess(movie: any): number {
    return movie.criticalScore ? movie.criticalScore / 100 : 0.8;
  }

  private calculateMovieIconicStatus(movie: any): number {
    return movie.awardsWon ? Math.min(movie.awardsWon * 0.1, 1.0) : 0.8;
  }

  private calculateMovieQualityScore(movie: any): number {
    const imdbScore = movie.imdbRating ? movie.imdbRating / 10 : 0.8;
    const criticalScore = movie.criticalScore ? movie.criticalScore / 100 : 0.8;
    return (imdbScore + criticalScore) / 2;
  }

  // Movie beat methods
  private calculateMovieBeatMarketRelevance(movie: any, order: number): number {
    const base = movie.boxOfficeGross ? Math.min(movie.boxOfficeGross / 1000000000, 1.0) : 0.8;
    return order === 3 ? base : base * 0.8; // Release has highest relevance
  }

  private calculateMovieBeatPriceImpact(movie: any, order: number): number {
    return order === 3 ? 0.9 : 0.6; // Release has highest price impact
  }

  private calculateMovieBeatVolatilityTrigger(movie: any, order: number): number {
    return order === 3 ? 1.0 : 0.5; // Release triggers maximum volatility
  }

  private calculateMovieBeatSpeculationOpportunity(movie: any, order: number): number {
    return order === 2 ? 0.9 : 0.6; // Marketing phase offers best speculation
  }

  private calculateMovieBeatIconicStatus(movie: any, order: number): number {
    return order === 5 ? 1.0 : 0.7; // Legacy has highest iconic status
  }

  private determineMovieBeatMoralImplications(movie: any): string[] {
    return ['heroism', 'inspiration', 'cultural_impact'];
  }

  private calculateMovieBeatEmotionalImpact(order: number): number {
    const impactMap = [0.6, 0.7, 1.0, 0.8, 0.9]; // Release has maximum impact
    return impactMap[order - 1] || 0.7;
  }
}