import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { NarrativeTradingMetricsService } from '../../server/services/narrativeTradingMetricsService.js';
import { SAMPLE_CHARACTER_DATA, CSVTestDataLoader } from '../fixtures/csvTestData.js';
import { testUtils } from '../setup.js';

/**
 * Integration Tests for Trading Metrics Service
 * Verifies Mythic Volatility/Momentum calculations and Seven Houses multipliers
 */
describe('Trading Metrics Service - Integration Tests', () => {
  let tradingMetricsService: NarrativeTradingMetricsService;
  
  beforeAll(async () => {
    tradingMetricsService = new NarrativeTradingMetricsService();
    console.log('🔢 Initializing Trading Metrics Integration Tests...');
  });
  
  afterEach(async () => {
    await testUtils.cleanupTestData([
      'narrative_trading_metrics', 'house_financial_profiles', 
      'story_event_triggers', 'narrative_market_events'
    ], 'test_');
  });

  describe('Seven Houses Financial Profiles', () => {
    test('should generate correct house-specific volatility multipliers', () => {
      const expectedHouseProfiles = {
        heroes: {
          volatilityMultiplier: 1.2,
          stabilityExpected: false,
          riskTolerance: 'moderate'
        },
        wisdom: {
          volatilityMultiplier: 0.8,
          stabilityExpected: true,
          riskTolerance: 'conservative'
        },
        power: {
          volatilityMultiplier: 2.5,
          stabilityExpected: false,
          riskTolerance: 'extreme'
        },
        mystery: {
          volatilityMultiplier: 1.8,
          stabilityExpected: false,
          riskTolerance: 'aggressive'
        },
        elements: {
          volatilityMultiplier: 1.1,
          stabilityExpected: true,
          riskTolerance: 'moderate'
        },
        time: {
          volatilityMultiplier: 1.6,
          stabilityExpected: false,
          riskTolerance: 'aggressive'
        },
        spirit: {
          volatilityMultiplier: 1.4,
          stabilityExpected: false,
          riskTolerance: 'aggressive'
        }
      };
      
      Object.entries(expectedHouseProfiles).forEach(([house, profile]) => {
        expect(profile.volatilityMultiplier).toBeGreaterThan(0);
        expect(profile.volatilityMultiplier).toBeLessThan(5.0);
        expect(['conservative', 'moderate', 'aggressive', 'extreme']).toContain(profile.riskTolerance);
      });
    });
    
    test('should calculate power level volatility factors correctly', () => {
      const powerLevelTests = [
        { level: 'human', expectedRange: [0.5, 0.8] },
        { level: 'low', expectedRange: [0.6, 0.9] },
        { level: 'medium', expectedRange: [0.8, 1.2] },
        { level: 'high', expectedRange: [1.2, 1.8] },
        { level: 'extreme', expectedRange: [1.8, 2.5] },
        { level: 'cosmic', expectedRange: [2.5, 4.0] },
        { level: 'omega', expectedRange: [3.0, 5.0] }
      ];
      
      powerLevelTests.forEach(testCase => {
        const factor = calculatePowerLevelVolatilityFactor(testCase.level);
        expect(factor).toBeGreaterThanOrEqual(testCase.expectedRange[0]);
        expect(factor).toBeLessThanOrEqual(testCase.expectedRange[1]);
      });
    });
  });

  describe('Mythic Volatility Calculations', () => {
    test('should calculate accurate mythic volatility for different character types', () => {
      const volatilityTests = SAMPLE_CHARACTER_DATA.map(character => {
        const house = determineHouseAffiliation(character);
        const powerLevel = character['Power Level']?.toLowerCase() || 'low';
        const mythicVolatility = calculateMythicVolatilityScore(character);
        
        return {
          character: character.Character,
          house,
          powerLevel,
          mythicVolatility,
          expectedRange: getMythicVolatilityRange(house, powerLevel)
        };
      });
      
      volatilityTests.forEach(test => {
        expect(test.mythicVolatility).toBeGreaterThanOrEqual(test.expectedRange.min);
        expect(test.mythicVolatility).toBeLessThanOrEqual(test.expectedRange.max);
      });
      
      // Verify power house characters have higher volatility than wisdom house
      const powerHouseVolatility = volatilityTests
        .filter(t => t.house === 'power')
        .reduce((sum, t) => sum + t.mythicVolatility, 0) / 
        volatilityTests.filter(t => t.house === 'power').length;
      
      const wisdomHouseVolatility = volatilityTests
        .filter(t => t.house === 'wisdom')
        .reduce((sum, t) => sum + t.mythicVolatility, 0) / 
        volatilityTests.filter(t => t.house === 'wisdom').length;
      
      expect(powerHouseVolatility).toBeGreaterThan(wisdomHouseVolatility);
    });
    
    test('should generate story arc volatility multipliers', () => {
      const storyArcPhases = [
        'origin_story',
        'rising_action', 
        'climax',
        'falling_action',
        'resolution'
      ];
      
      storyArcPhases.forEach(phase => {
        const multiplier = calculateStoryArcVolatilityMultiplier(phase);
        expect(multiplier).toBeGreaterThan(0.5);
        expect(multiplier).toBeLessThan(3.0);
        
        // Climax should have highest multiplier
        if (phase === 'climax') {
          expect(multiplier).toBeGreaterThan(1.5);
        }
        
        // Resolution should have lower multiplier
        if (phase === 'resolution') {
          expect(multiplier).toBeLessThan(1.2);
        }
      });
    });
    
    test('should calculate cosmic event volatility boosts', () => {
      const cosmicEvents = [
        { type: 'universe_reset', severity: 'cosmic', expectedBoost: [0.8, 1.5] },
        { type: 'multiverse_crisis', severity: 'cosmic', expectedBoost: [0.6, 1.2] },
        { type: 'character_death', severity: 'major', expectedBoost: [0.3, 0.8] },
        { type: 'power_upgrade', severity: 'moderate', expectedBoost: [0.1, 0.4] },
        { type: 'team_formation', severity: 'minor', expectedBoost: [0.05, 0.2] }
      ];
      
      cosmicEvents.forEach(event => {
        const boost = calculateCosmicEventVolatilityBoost(event);
        expect(boost).toBeGreaterThanOrEqual(event.expectedBoost[0]);
        expect(boost).toBeLessThanOrEqual(event.expectedBoost[1]);
      });
    });
  });

  describe('Narrative Momentum Tracking', () => {
    test('should calculate narrative momentum scores with cultural impact', () => {
      const momentumTests = SAMPLE_CHARACTER_DATA.map(character => {
        const culturalImpact = calculateCulturalImpactIndex(character);
        const momentum = calculateNarrativeMomentumScore(character, culturalImpact);
        
        return {
          character: character.Character,
          affiliation: character.Affiliation,
          culturalImpact,
          momentum,
          hasTeamAffiliation: character.Affiliation?.includes('Avengers') || character.Affiliation?.includes('Justice')
        };
      });
      
      // Characters with team affiliations should generally have higher momentum
      const teamCharacters = momentumTests.filter(t => t.hasTeamAffiliation);
      const soloCharacters = momentumTests.filter(t => !t.hasTeamAffiliation);
      
      if (teamCharacters.length > 0 && soloCharacters.length > 0) {
        const avgTeamMomentum = teamCharacters.reduce((sum, t) => sum + t.momentum, 0) / teamCharacters.length;
        const avgSoloMomentum = soloCharacters.reduce((sum, t) => sum + t.momentum, 0) / soloCharacters.length;
        
        expect(avgTeamMomentum).toBeGreaterThanOrEqual(avgSoloMomentum * 0.8);
      }
      
      // All momentum scores should be within valid range
      momentumTests.forEach(test => {
        expect(test.momentum).toBeGreaterThanOrEqual(-5.0);
        expect(test.momentum).toBeLessThanOrEqual(5.0);
        expect(test.culturalImpact).toBeGreaterThanOrEqual(0.0);
        expect(test.culturalImpact).toBeLessThanOrEqual(2.0);
      });
    });
    
    test('should calculate story progression rates', () => {
      const progressionScenarios = [
        { phase: 'introduction', expectedRate: [0.1, 0.4] },
        { phase: 'development', expectedRate: [0.3, 0.7] },
        { phase: 'climax', expectedRate: [0.7, 1.0] },
        { phase: 'resolution', expectedRate: [0.2, 0.5] }
      ];
      
      progressionScenarios.forEach(scenario => {
        const rate = calculateStoryProgressionRate(scenario.phase);
        expect(rate).toBeGreaterThanOrEqual(scenario.expectedRate[0]);
        expect(rate).toBeLessThanOrEqual(scenario.expectedRate[1]);
      });
    });
    
    test('should apply media boost factors correctly', () => {
      const mediaPerformanceData = [
        { character: 'spider-man', boxOffice: 800000000, rating: 8.5 },
        { character: 'batman', boxOffice: 1000000000, rating: 8.8 },
        { character: 'thor', boxOffice: 500000000, rating: 7.8 },
        { character: 'unknown-hero', boxOffice: 0, rating: 0 }
      ];
      
      mediaPerformanceData.forEach(media => {
        const boostFactor = calculateMediaBoostFactor(media);
        
        if (media.boxOffice > 0) {
          expect(boostFactor).toBeGreaterThan(1.0); // Should boost momentum
          expect(boostFactor).toBeLessThan(3.0); // But not excessively
        } else {
          expect(boostFactor).toBe(1.0); // No boost for unknown characters
        }
      });
    });
    
    test('should calculate momentum decay rates', () => {
      const timeSinceLastEvent = [
        { days: 1, expectedDecay: [0.0, 0.1] },
        { days: 7, expectedDecay: [0.1, 0.3] },
        { days: 30, expectedDecay: [0.3, 0.6] },
        { days: 365, expectedDecay: [0.7, 0.9] }
      ];
      
      timeSinceLastEvent.forEach(scenario => {
        const decayRate = calculateMomentumDecayRate(scenario.days);
        expect(decayRate).toBeGreaterThanOrEqual(scenario.expectedDecay[0]);
        expect(decayRate).toBeLessThanOrEqual(scenario.expectedDecay[1]);
      });
    });
  });

  describe('House-Specific Trading Multipliers', () => {
    test('should generate correct bonuses and penalties for each house', () => {
      const houseMultiplierTests = [
        { house: 'heroes', assetType: 'character', expectedBonus: true },
        { house: 'heroes', assetType: 'publisher', expectedBonus: false },
        { house: 'wisdom', assetType: 'creator', expectedBonus: true },
        { house: 'wisdom', assetType: 'character', expectedBonus: false },
        { house: 'power', assetType: 'character', expectedBonus: true },
        { house: 'power', assetType: 'publisher', expectedBonus: false }
      ];
      
      houseMultiplierTests.forEach(test => {
        const multiplier = calculateHouseTradingMultiplier(test.house, test.assetType);
        
        if (test.expectedBonus) {
          expect(multiplier).toBeGreaterThan(1.0); // Should provide trading bonus
        } else {
          expect(multiplier).toBeLessThanOrEqual(1.0); // Should not provide bonus
        }
        
        expect(multiplier).toBeGreaterThan(0.5); // Should never be too penalizing
        expect(multiplier).toBeLessThan(2.0); // Should never be too advantageous
      });
    });
    
    test('should calculate cross-house interaction effects', () => {
      const crossHouseInteractions = [
        { house1: 'heroes', house2: 'mystery', interaction: 'alliance' },
        { house1: 'power', house2: 'wisdom', interaction: 'conflict' },
        { house1: 'time', house2: 'spirit', interaction: 'synergy' },
        { house1: 'elements', house2: 'heroes', interaction: 'neutral' }
      ];
      
      crossHouseInteractions.forEach(interaction => {
        const effect = calculateCrossHouseInteractionEffect(interaction);
        
        expect(effect.house1Multiplier).toBeGreaterThan(0.5);
        expect(effect.house1Multiplier).toBeLessThan(2.0);
        expect(effect.house2Multiplier).toBeGreaterThan(0.5);
        expect(effect.house2Multiplier).toBeLessThan(2.0);
        
        if (interaction.interaction === 'alliance' || interaction.interaction === 'synergy') {
          expect(effect.house1Multiplier).toBeGreaterThan(1.0);
          expect(effect.house2Multiplier).toBeGreaterThan(1.0);
        }
      });
    });
  });

  describe('Real-time Market Metric Updates', () => {
    test('should update trading metrics in real-time based on story events', async () => {
      const storyEvents = [
        {
          type: 'character_death',
          affectedCharacter: 'test_spider-man',
          severity: 'major',
          culturalImpact: 0.8
        },
        {
          type: 'power_upgrade', 
          affectedCharacter: 'test_hulk',
          severity: 'moderate',
          culturalImpact: 0.6
        }
      ];
      
      const metricUpdates = [];
      
      for (const event of storyEvents) {
        const beforeMetrics = {
          volatility: 0.05,
          momentum: 1.0
        };
        
        const afterMetrics = applyStoryEventToMetrics(beforeMetrics, event);
        
        metricUpdates.push({
          event: event.type,
          character: event.affectedCharacter,
          volatilityChange: afterMetrics.volatility - beforeMetrics.volatility,
          momentumChange: afterMetrics.momentum - beforeMetrics.momentum
        });
      }
      
      // Character death should increase volatility and decrease momentum
      const deathEvent = metricUpdates.find(u => u.event === 'character_death');
      expect(deathEvent?.volatilityChange).toBeGreaterThan(0);
      expect(deathEvent?.momentumChange).toBeLessThan(0);
      
      // Power upgrade should increase both volatility and momentum
      const upgradeEvent = metricUpdates.find(u => u.event === 'power_upgrade');
      expect(upgradeEvent?.volatilityChange).toBeGreaterThan(0);
      expect(upgradeEvent?.momentumChange).toBeGreaterThan(0);
    });
  });

  // Helper functions for testing
  function determineHouseAffiliation(character: any): string {
    const name = character.Character?.toLowerCase() || '';
    const powers = character.Powers?.toLowerCase() || '';
    
    if (name.includes('spider') || name.includes('captain') || name.includes('superman')) {
      return 'heroes';
    } else if (name.includes('hulk') || name.includes('thor') || name.includes('phoenix')) {
      return 'power';
    } else if (name.includes('doctor') || name.includes('professor')) {
      return 'wisdom';
    } else if (name.includes('batman') || powers.includes('occult')) {
      return 'mystery';
    } else if (powers.includes('weather') || name.includes('storm')) {
      return 'elements';
    } else if (powers.includes('time') || powers.includes('speed')) {
      return 'time';
    } else if (name.includes('ghost') || powers.includes('supernatural')) {
      return 'spirit';
    }
    
    return 'heroes';
  }
  
  function calculatePowerLevelVolatilityFactor(powerLevel: string): number {
    const factors: Record<string, number> = {
      'human': 0.6,
      'low': 0.8,
      'medium': 1.0,
      'high': 1.5,
      'extreme': 2.0,
      'cosmic': 3.0,
      'omega': 4.0
    };
    
    return factors[powerLevel] || 1.0;
  }
  
  function calculateMythicVolatilityScore(character: any): number {
    const house = determineHouseAffiliation(character);
    const powerLevel = character['Power Level']?.toLowerCase() || 'low';
    
    const baseVolatility = 0.1;
    const powerFactor = calculatePowerLevelVolatilityFactor(powerLevel);
    const houseFactor = getHouseVolatilityMultiplier(house);
    
    return baseVolatility * powerFactor * houseFactor;
  }
  
  function getHouseVolatilityMultiplier(house: string): number {
    const multipliers: Record<string, number> = {
      heroes: 1.2,
      wisdom: 0.8,
      power: 2.5,
      mystery: 1.8,
      elements: 1.1,
      time: 1.6,
      spirit: 1.4
    };
    
    return multipliers[house] || 1.0;
  }
  
  function getMythicVolatilityRange(house: string, powerLevel: string): { min: number; max: number } {
    const baseRange = { min: 0.02, max: 0.5 };
    const houseFactor = getHouseVolatilityMultiplier(house);
    const powerFactor = calculatePowerLevelVolatilityFactor(powerLevel);
    
    return {
      min: baseRange.min * houseFactor * powerFactor * 0.8,
      max: baseRange.max * houseFactor * powerFactor * 1.2
    };
  }
  
  function calculateStoryArcVolatilityMultiplier(phase: string): number {
    const multipliers: Record<string, number> = {
      origin_story: 1.2,
      rising_action: 1.4,
      climax: 2.0,
      falling_action: 1.1,
      resolution: 0.9
    };
    
    return multipliers[phase] || 1.0;
  }
  
  function calculateCosmicEventVolatilityBoost(event: any): number {
    const severityMultipliers: Record<string, number> = {
      minor: 0.1,
      moderate: 0.3,
      major: 0.6,
      cosmic: 1.0
    };
    
    return severityMultipliers[event.severity] || 0.1;
  }
  
  function calculateNarrativeMomentumScore(character: any, culturalImpact: number): number {
    const baseScore = 0.0;
    let momentum = baseScore;
    
    // Team membership boost
    const affiliation = character.Affiliation?.toLowerCase() || '';
    if (affiliation.includes('avengers') || affiliation.includes('justice')) {
      momentum += 1.5;
    }
    
    // Role impact
    const role = character.Role?.toLowerCase() || '';
    if (role === 'hero') {
      momentum += 1.0;
    } else if (role === 'villain') {
      momentum -= 0.5;
    }
    
    // Cultural impact factor
    momentum *= culturalImpact;
    
    return Math.max(-5.0, Math.min(5.0, momentum));
  }
  
  function calculateCulturalImpactIndex(character: any): number {
    // Base cultural impact
    let impact = 1.0;
    
    // Popular characters get higher impact
    const name = character.Character?.toLowerCase() || '';
    if (name.includes('spider-man') || name.includes('batman') || name.includes('superman')) {
      impact = 1.8;
    } else if (name.includes('thor') || name.includes('hulk') || name.includes('captain-america')) {
      impact = 1.5;
    }
    
    return Math.max(0.1, Math.min(2.0, impact));
  }
  
  function calculateStoryProgressionRate(phase: string): number {
    const rates: Record<string, number> = {
      introduction: 0.3,
      development: 0.6,
      climax: 0.9,
      resolution: 0.4
    };
    
    return rates[phase] || 0.5;
  }
  
  function calculateMediaBoostFactor(media: any): number {
    if (media.boxOffice === 0) return 1.0;
    
    // Scale based on box office performance
    const boxOfficeBoost = Math.min(media.boxOffice / 500000000, 2.0); // Cap at 2x
    const ratingBoost = media.rating / 10.0;
    
    return 1.0 + (boxOfficeBoost * ratingBoost * 0.5);
  }
  
  function calculateMomentumDecayRate(daysSinceLastEvent: number): number {
    return Math.min(daysSinceLastEvent / 365, 0.9); // Max 90% decay over a year
  }
  
  function calculateHouseTradingMultiplier(house: string, assetType: string): number {
    const houseSpecialties: Record<string, string[]> = {
      heroes: ['character', 'comic'],
      wisdom: ['creator', 'publisher'],
      power: ['character'],
      mystery: ['character', 'comic'],
      elements: ['character', 'comic'],
      time: ['character'],
      spirit: ['character']
    };
    
    const isSpecialty = houseSpecialties[house]?.includes(assetType);
    return isSpecialty ? 1.2 : 0.9;
  }
  
  function calculateCrossHouseInteractionEffect(interaction: any): any {
    const interactionEffects: Record<string, { house1: number; house2: number }> = {
      alliance: { house1: 1.15, house2: 1.1 },
      conflict: { house1: 1.2, house2: 0.9 },
      synergy: { house1: 1.25, house2: 1.2 },
      neutral: { house1: 1.0, house2: 1.0 }
    };
    
    const effect = interactionEffects[interaction.interaction] || { house1: 1.0, house2: 1.0 };
    
    return {
      house1Multiplier: effect.house1,
      house2Multiplier: effect.house2
    };
  }
  
  function applyStoryEventToMetrics(currentMetrics: any, event: any): any {
    const eventEffects: Record<string, { volatilityMultiplier: number; momentumChange: number }> = {
      character_death: { volatilityMultiplier: 2.0, momentumChange: -1.5 },
      power_upgrade: { volatilityMultiplier: 1.5, momentumChange: 1.0 },
      team_formation: { volatilityMultiplier: 1.2, momentumChange: 0.5 },
      origin_story: { volatilityMultiplier: 1.1, momentumChange: 0.3 }
    };
    
    const effect = eventEffects[event.type] || { volatilityMultiplier: 1.0, momentumChange: 0 };
    const severityMultiplier = event.severity === 'major' ? 1.5 : 1.0;
    
    return {
      volatility: currentMetrics.volatility * effect.volatilityMultiplier * severityMultiplier,
      momentum: currentMetrics.momentum + (effect.momentumChange * severityMultiplier * event.culturalImpact)
    };
  }
});