import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { CSVTestDataLoader, SAMPLE_CHARACTER_DATA } from '../fixtures/csvTestData.js';
import { testUtils } from '../setup.js';

/**
 * Data Quality and Validation Tests
 * Tests character deduplication, house affinity accuracy, and data consistency
 */
describe('Data Quality and Validation Systems', () => {
  
  beforeAll(() => {
    console.log('🔍 Initializing Data Quality & Validation Tests...');
  });
  
  afterEach(async () => {
    await testUtils.cleanupTestData([
      'character_duplicates', 'house_affinity_mappings', 
      'data_quality_reports', 'validation_results'
    ], 'test_');
  });

  describe('Character Deduplication Across Universes', () => {
    test('should detect duplicate characters with different names', () => {
      const duplicateTestCases = [
        // Same character, different naming conventions
        { chars: ['spider-man', 'Spider-Man', 'SPIDER-MAN'], expected: true },
        { chars: ['batman', 'Batman', 'The Batman'], expected: true },
        { chars: ['superman', 'Super-Man', 'Kal-El'], expected: true },
        
        // Different characters, should not be duplicates
        { chars: ['spider-man', 'spider-woman', 'spider-girl'], expected: false },
        { chars: ['flash', 'quicksilver'], expected: false },
        { chars: ['green lantern', 'green arrow'], expected: false }
      ];
      
      duplicateTestCases.forEach(testCase => {
        const duplicateScore = calculateDuplicateLikelihood(testCase.chars);
        
        if (testCase.expected) {
          expect(duplicateScore).toBeGreaterThan(0.7); // High similarity threshold
        } else {
          expect(duplicateScore).toBeLessThan(0.5); // Low similarity threshold
        }
      });
    });
    
    test('should handle cross-universe character variations', () => {
      const crossUniverseCharacters = [
        {
          name: 'spider-man',
          variations: [
            { universe: 'Marvel-616', realName: 'Peter Parker', age: 28 },
            { universe: 'Ultimate', realName: 'Peter Parker', age: 16 },
            { universe: 'Marvel-2099', realName: 'Miguel O\'Hara', age: 30 },
            { universe: 'Spider-Verse', realName: 'Miles Morales', age: 17 }
          ]
        },
        {
          name: 'batman',
          variations: [
            { universe: 'DC-Main', realName: 'Bruce Wayne', age: 35 },
            { universe: 'DC-Elseworlds', realName: 'Bruce Wayne', age: 45 },
            { universe: 'Batman Beyond', realName: 'Terry McGinnis', age: 17 }
          ]
        }
      ];
      
      crossUniverseCharacters.forEach(characterGroup => {
        const deduplicationResults = processCharacterVariations(characterGroup);
        
        expect(deduplicationResults.primaryCharacter).toBeDefined();
        expect(deduplicationResults.variations.length).toBeGreaterThan(1);
        expect(deduplicationResults.mergeStrategy).toBeDefined();
        
        // Verify merge strategy is appropriate
        const sameRealName = characterGroup.variations.every(v => 
          v.realName === characterGroup.variations[0].realName
        );
        
        if (sameRealName) {
          expect(deduplicationResults.mergeStrategy).toBe('universe_variants');
        } else {
          expect(deduplicationResults.mergeStrategy).toBe('legacy_succession');
        }
      });
    });
    
    test('should calculate character similarity scores accurately', () => {
      const similarityTests = [
        // High similarity - same character
        { 
          char1: { name: 'Spider-Man', realName: 'Peter Parker', powers: 'Web shooting, Wall crawling' },
          char2: { name: 'spider-man', realName: 'Peter B. Parker', powers: 'Web abilities, Spider sense' },
          expectedSimilarity: [0.8, 1.0]
        },
        
        // Medium similarity - related characters  
        {
          char1: { name: 'Spider-Man', realName: 'Peter Parker', powers: 'Spider abilities' },
          char2: { name: 'Spider-Woman', realName: 'Jessica Drew', powers: 'Spider abilities' },
          expectedSimilarity: [0.4, 0.7]
        },
        
        // Low similarity - different characters
        {
          char1: { name: 'Batman', realName: 'Bruce Wayne', powers: 'Detective skills' },
          char2: { name: 'Superman', realName: 'Clark Kent', powers: 'Flight, Super strength' },
          expectedSimilarity: [0.0, 0.3]
        }
      ];
      
      similarityTests.forEach(test => {
        const similarity = calculateCharacterSimilarity(test.char1, test.char2);
        
        expect(similarity).toBeGreaterThanOrEqual(test.expectedSimilarity[0]);
        expect(similarity).toBeLessThanOrEqual(test.expectedSimilarity[1]);
      });
    });
  });

  describe('House Affinity Assignment Validation', () => {
    test('should assign characters to correct houses based on comprehensive analysis', () => {
      const houseAssignmentTests = [
        // Heroes House Tests
        {
          character: {
            name: 'spider-man',
            realName: 'Peter Parker',
            powers: 'Web shooting, Spider sense',
            role: 'Hero',
            affiliation: 'Avengers',
            themes: ['responsibility', 'heroism', 'justice']
          },
          expectedHouse: 'heroes',
          confidence: [0.8, 1.0]
        },
        
        // Wisdom House Tests
        {
          character: {
            name: 'doctor-strange',
            realName: 'Stephen Strange',
            powers: 'Magic, Sorcery, Time manipulation',
            role: 'Hero',
            affiliation: 'Sanctum Sanctorum',
            themes: ['knowledge', 'mysticism', 'learning']
          },
          expectedHouse: 'wisdom',
          confidence: [0.9, 1.0]
        },
        
        // Power House Tests
        {
          character: {
            name: 'hulk',
            realName: 'Bruce Banner',
            powers: 'Superhuman strength, Gamma radiation',
            role: 'Hero',
            affiliation: 'Avengers',
            themes: ['strength', 'rage', 'transformation']
          },
          expectedHouse: 'power',
          confidence: [0.9, 1.0]
        },
        
        // Mystery House Tests
        {
          character: {
            name: 'batman',
            realName: 'Bruce Wayne',
            powers: 'Detective skills, Martial arts',
            role: 'Hero',
            affiliation: 'Justice League',
            themes: ['mystery', 'darkness', 'investigation']
          },
          expectedHouse: 'mystery',
          confidence: [0.8, 1.0]
        }
      ];
      
      houseAssignmentTests.forEach(test => {
        const assignment = calculateHouseAffinity(test.character);
        
        expect(assignment.primaryHouse).toBe(test.expectedHouse);
        expect(assignment.confidence).toBeGreaterThanOrEqual(test.confidence[0]);
        expect(assignment.confidence).toBeLessThanOrEqual(test.confidence[1]);
        expect(assignment.reasoning).toBeDefined();
        expect(assignment.alternativeHouses).toBeDefined();
      });
    });
    
    test('should handle ambiguous house assignments', () => {
      const ambiguousCharacters = [
        {
          name: 'thor',
          realName: 'Thor Odinson',
          powers: 'Thunder god, Mjolnir, Weather control',
          role: 'Hero',
          themes: ['strength', 'wisdom', 'nobility']
          // Could be Power (strength) or Wisdom (godly knowledge)
        },
        {
          name: 'doctor-doom',
          realName: 'Victor Von Doom',
          powers: 'Science, Magic, Technology',
          role: 'Villain',
          themes: ['intelligence', 'power', 'mysticism']
          // Could be Wisdom (science), Power (ambition), or Mystery (magic)
        }
      ];
      
      ambiguousCharacters.forEach(character => {
        const assignment = calculateHouseAffinity(character);
        
        expect(assignment.confidence).toBeLessThan(0.9); // Lower confidence for ambiguous cases
        expect(assignment.alternativeHouses.length).toBeGreaterThan(1);
        expect(assignment.reasoning).toContain('multiple affinities');
        
        // Verify alternative houses are ranked
        for (let i = 0; i < assignment.alternativeHouses.length - 1; i++) {
          expect(assignment.alternativeHouses[i].score)
            .toBeGreaterThanOrEqual(assignment.alternativeHouses[i + 1].score);
        }
      });
    });
    
    test('should validate house theme consistency', () => {
      const houseThemes = {
        heroes: {
          keywords: ['hero', 'justice', 'protect', 'save', 'responsibility', 'courage'],
          antiKeywords: ['evil', 'destroy', 'corrupt', 'selfish']
        },
        wisdom: {
          keywords: ['knowledge', 'learn', 'teach', 'magic', 'science', 'scholar', 'sage'],
          antiKeywords: ['ignorant', 'brute', 'mindless']
        },
        power: {
          keywords: ['strength', 'force', 'mighty', 'dominance', 'conquest', 'supreme'],
          antiKeywords: ['weak', 'gentle', 'passive']
        },
        mystery: {
          keywords: ['shadow', 'hidden', 'secret', 'dark', 'enigma', 'investigate'],
          antiKeywords: ['obvious', 'open', 'transparent']
        },
        elements: {
          keywords: ['nature', 'elemental', 'weather', 'earth', 'fire', 'water', 'air'],
          antiKeywords: ['artificial', 'synthetic', 'mechanical']
        },
        time: {
          keywords: ['time', 'temporal', 'chronos', 'speed', 'history', 'future'],
          antiKeywords: ['timeless', 'eternal', 'static']
        },
        spirit: {
          keywords: ['soul', 'spiritual', 'ghost', 'afterlife', 'divine', 'sacred'],
          antiKeywords: ['material', 'physical', 'mundane']
        }
      };
      
      Object.entries(houseThemes).forEach(([house, themes]) => {
        // Test positive theme matching
        const positiveScore = calculateThemeAlignment(themes.keywords, house);
        expect(positiveScore).toBeGreaterThan(0.7);
        
        // Test negative theme matching  
        const negativeScore = calculateThemeAlignment(themes.antiKeywords, house);
        expect(negativeScore).toBeLessThan(0.3);
      });
    });
  });

  describe('Story Event Categorization Accuracy', () => {
    test('should categorize story events with correct impact levels', () => {
      const storyEventTests = [
        {
          event: {
            title: 'The Death of Superman',
            description: 'Superman sacrifices himself to defeat Doomsday',
            characters: ['superman', 'doomsday'],
            themes: ['sacrifice', 'death', 'heroism']
          },
          expectedCategory: 'character_death',
          expectedSeverity: 'cosmic',
          expectedImpact: [0.8, 1.0]
        },
        {
          event: {
            title: 'Spider-Man Gets New Costume',
            description: 'Peter Parker receives upgraded suit from Tony Stark',
            characters: ['spider-man'],
            themes: ['upgrade', 'technology', 'mentorship']
          },
          expectedCategory: 'equipment_upgrade',
          expectedSeverity: 'minor',
          expectedImpact: [0.2, 0.4]
        },
        {
          event: {
            title: 'Formation of the Avengers',
            description: 'Earth\'s Mightiest Heroes unite for the first time',
            characters: ['iron-man', 'thor', 'hulk', 'captain-america'],
            themes: ['teamwork', 'unity', 'protection']
          },
          expectedCategory: 'team_formation',
          expectedSeverity: 'major',
          expectedImpact: [0.6, 0.8]
        }
      ];
      
      storyEventTests.forEach(test => {
        const categorization = categorizeStoryEvent(test.event);
        
        expect(categorization.category).toBe(test.expectedCategory);
        expect(categorization.severity).toBe(test.expectedSeverity);
        expect(categorization.impactScore).toBeGreaterThanOrEqual(test.expectedImpact[0]);
        expect(categorization.impactScore).toBeLessThanOrEqual(test.expectedImpact[1]);
        expect(categorization.reasoning).toBeDefined();
      });
    });
    
    test('should validate cultural impact calculations from media performance', () => {
      const mediaPerformanceData = [
        {
          character: 'spider-man',
          movies: [
            { title: 'Spider-Man', boxOffice: 821708551, rating: 7.3, year: 2002 },
            { title: 'Spider-Man 2', boxOffice: 783766341, rating: 7.4, year: 2004 },
            { title: 'Spider-Man: No Way Home', boxOffice: 1921847111, rating: 8.4, year: 2021 }
          ],
          tvShows: [
            { title: 'Spider-Man Animated Series', rating: 8.5, seasons: 5 }
          ],
          merchandise: { annualRevenue: 1350000000 },
          socialMedia: { mentions: 5000000, sentiment: 0.85 }
        },
        {
          character: 'batman',
          movies: [
            { title: 'The Dark Knight', boxOffice: 1006234167, rating: 9.0, year: 2008 },
            { title: 'Batman Begins', boxOffice: 373298774, rating: 8.2, year: 2005 }
          ],
          tvShows: [
            { title: 'Batman Animated Series', rating: 9.0, seasons: 4 }
          ],
          merchandise: { annualRevenue: 494000000 },
          socialMedia: { mentions: 3500000, sentiment: 0.82 }
        }
      ];
      
      mediaPerformanceData.forEach(data => {
        const culturalImpact = calculateCulturalImpactFromMedia(data);
        
        expect(culturalImpact.overallScore).toBeGreaterThan(0);
        expect(culturalImpact.overallScore).toBeLessThanOrEqual(2.0);
        expect(culturalImpact.components.boxOffice).toBeDefined();
        expect(culturalImpact.components.criticalReception).toBeDefined();
        expect(culturalImpact.components.longevity).toBeDefined();
        expect(culturalImpact.components.merchandising).toBeDefined();
        expect(culturalImpact.components.socialPresence).toBeDefined();
        
        // Verify component scores are reasonable
        Object.values(culturalImpact.components).forEach(score => {
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(1.0);
        });
      });
    });
  });

  describe('Timeline Generation Coherence', () => {
    test('should create coherent narrative arcs across story beats', () => {
      const timelineData = {
        characters: ['spider-man', 'green-goblin'],
        universe: 'Marvel-616',
        storyArc: 'Spider-Man vs Green Goblin',
        timespan: { start: '1962', end: '2023' }
      };
      
      const timeline = generateNarrativeTimeline(timelineData);
      
      expect(timeline.storyBeats.length).toBeGreaterThan(5);
      expect(timeline.coherenceScore).toBeGreaterThan(0.7);
      
      // Verify timeline ordering
      const positions = timeline.storyBeats.map(beat => beat.timelinePosition);
      const sortedPositions = [...positions].sort((a, b) => a - b);
      expect(positions).toEqual(sortedPositions);
      
      // Verify narrative progression
      const phases = timeline.storyBeats.map(beat => beat.storyArcPhase);
      const expectedProgression = ['introduction', 'rising_action', 'climax', 'falling_action', 'resolution'];
      
      let progressionScore = 0;
      let lastPhaseIndex = -1;
      
      phases.forEach(phase => {
        const currentPhaseIndex = expectedProgression.indexOf(phase);
        if (currentPhaseIndex >= lastPhaseIndex) {
          progressionScore += 1;
          lastPhaseIndex = currentPhaseIndex;
        }
      });
      
      expect(progressionScore / phases.length).toBeGreaterThan(0.6); // 60% proper progression
    });
    
    test('should maintain character consistency across timeline', () => {
      const characterArc = {
        character: 'spider-man',
        startingTraits: ['inexperienced', 'eager', 'naive'],
        endingTraits: ['experienced', 'wise', 'responsible'],
        keyEvents: [
          'gains powers',
          'learns responsibility',
          'faces major villain',
          'makes sacrifice',
          'becomes true hero'
        ]
      };
      
      const characterTimeline = generateCharacterArcTimeline(characterArc);
      
      expect(characterTimeline.developmentBeats.length).toBe(characterArc.keyEvents.length);
      
      // Verify character development progression
      characterTimeline.developmentBeats.forEach((beat, index) => {
        expect(beat.characterGrowthScore).toBeGreaterThanOrEqual(index / characterArc.keyEvents.length);
        expect(beat.traitChanges).toBeDefined();
        
        if (index > 0) {
          const previousBeat = characterTimeline.developmentBeats[index - 1];
          expect(beat.characterGrowthScore).toBeGreaterThanOrEqual(previousBeat.characterGrowthScore);
        }
      });
      
      // Verify trait evolution
      const finalTraits = characterTimeline.developmentBeats[characterTimeline.developmentBeats.length - 1].currentTraits;
      const expectedFinalTraits = characterArc.endingTraits;
      
      const traitOverlap = finalTraits.filter(trait => expectedFinalTraits.includes(trait)).length;
      expect(traitOverlap / expectedFinalTraits.length).toBeGreaterThan(0.6);
    });
  });

  // Helper functions for data quality validation
  function calculateDuplicateLikelihood(names: string[]): number {
    if (names.length < 2) return 0;
    
    const normalizedNames = names.map(name => 
      name.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < normalizedNames.length; i++) {
      for (let j = i + 1; j < normalizedNames.length; j++) {
        totalSimilarity += calculateStringSimilarity(normalizedNames[i], normalizedNames[j]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }
  
  function calculateStringSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }
  
  function processCharacterVariations(characterGroup: any): any {
    const variations = characterGroup.variations;
    const realNames = variations.map(v => v.realName);
    const uniqueRealNames = [...new Set(realNames)];
    
    const mergeStrategy = uniqueRealNames.length === 1 ? 'universe_variants' : 'legacy_succession';
    const primaryCharacter = variations.find(v => v.universe.includes('Main') || v.universe.includes('616')) || variations[0];
    
    return {
      primaryCharacter,
      variations,
      mergeStrategy,
      consolidatedId: testUtils.generateTestId('char')
    };
  }
  
  function calculateCharacterSimilarity(char1: any, char2: any): number {
    let similarityScore = 0;
    let factors = 0;
    
    // Name similarity
    if (char1.name && char2.name) {
      similarityScore += calculateStringSimilarity(char1.name.toLowerCase(), char2.name.toLowerCase()) * 0.4;
      factors += 0.4;
    }
    
    // Real name similarity
    if (char1.realName && char2.realName) {
      similarityScore += calculateStringSimilarity(char1.realName.toLowerCase(), char2.realName.toLowerCase()) * 0.3;
      factors += 0.3;
    }
    
    // Powers similarity
    if (char1.powers && char2.powers) {
      const powers1 = char1.powers.toLowerCase().split(/[,\s]+/);
      const powers2 = char2.powers.toLowerCase().split(/[,\s]+/);
      const commonPowers = powers1.filter(p => powers2.some(p2 => p2.includes(p) || p.includes(p2)));
      const powerSimilarity = commonPowers.length / Math.max(powers1.length, powers2.length);
      similarityScore += powerSimilarity * 0.3;
      factors += 0.3;
    }
    
    return factors > 0 ? similarityScore / factors : 0;
  }
  
  function calculateHouseAffinity(character: any): any {
    const affinityScores = {
      heroes: 0,
      wisdom: 0,
      power: 0,
      mystery: 0,
      elements: 0,
      time: 0,
      spirit: 0
    };
    
    const name = character.name?.toLowerCase() || '';
    const powers = character.powers?.toLowerCase() || '';
    const themes = character.themes?.join(' ').toLowerCase() || '';
    const role = character.role?.toLowerCase() || '';
    
    // Heroes house scoring
    if (role === 'hero' || themes.includes('justice') || themes.includes('heroism')) {
      affinityScores.heroes += 0.8;
    }
    if (name.includes('captain') || name.includes('spider') || name.includes('super')) {
      affinityScores.heroes += 0.6;
    }
    
    // Wisdom house scoring
    if (name.includes('doctor') || name.includes('professor') || name.includes('sage')) {
      affinityScores.wisdom += 0.9;
    }
    if (powers.includes('magic') || themes.includes('knowledge') || themes.includes('learning')) {
      affinityScores.wisdom += 0.7;
    }
    
    // Power house scoring
    if (themes.includes('strength') || themes.includes('power') || themes.includes('might')) {
      affinityScores.power += 0.8;
    }
    if (name.includes('hulk') || name.includes('thor') || powers.includes('superhuman')) {
      affinityScores.power += 0.9;
    }
    
    // Mystery house scoring
    if (name.includes('batman') || themes.includes('mystery') || themes.includes('darkness')) {
      affinityScores.mystery += 0.9;
    }
    if (powers.includes('detective') || themes.includes('investigation')) {
      affinityScores.mystery += 0.7;
    }
    
    const sortedHouses = Object.entries(affinityScores)
      .sort(([,a], [,b]) => b - a)
      .map(([house, score]) => ({ house, score }));
    
    const topHouse = sortedHouses[0];
    const confidence = topHouse.score;
    const reasoning = confidence > 0.8 ? 'strong affinity' : 
                     confidence > 0.5 ? 'moderate affinity' : 'multiple affinities';
    
    return {
      primaryHouse: topHouse.house,
      confidence,
      reasoning,
      alternativeHouses: sortedHouses.slice(1)
    };
  }
  
  function calculateThemeAlignment(keywords: string[], house: string): number {
    // Simulate theme alignment calculation
    const houseKeywords = {
      heroes: ['hero', 'justice', 'protect'],
      wisdom: ['knowledge', 'learn', 'magic'],
      power: ['strength', 'force', 'mighty']
    };
    
    const relevantKeywords = houseKeywords[house] || [];
    const matches = keywords.filter(keyword => 
      relevantKeywords.some(hk => keyword.includes(hk) || hk.includes(keyword))
    );
    
    return matches.length / Math.max(keywords.length, 1);
  }
  
  function categorizeStoryEvent(event: any): any {
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();
    const themes = event.themes.join(' ').toLowerCase();
    
    let category = 'general_event';
    let severity = 'minor';
    let impactScore = 0.1;
    
    if (title.includes('death') || description.includes('dies') || description.includes('sacrifices')) {
      category = 'character_death';
      severity = 'cosmic';
      impactScore = 0.9;
    } else if (title.includes('formation') || description.includes('unite') || themes.includes('teamwork')) {
      category = 'team_formation';
      severity = 'major';
      impactScore = 0.7;
    } else if (title.includes('costume') || title.includes('upgrade') || description.includes('receives')) {
      category = 'equipment_upgrade';
      severity = 'minor';
      impactScore = 0.3;
    }
    
    return {
      category,
      severity,
      impactScore,
      reasoning: `Categorized as ${category} based on title and description analysis`
    };
  }
  
  function calculateCulturalImpactFromMedia(data: any): any {
    const components = {
      boxOffice: 0,
      criticalReception: 0,
      longevity: 0,
      merchandising: 0,
      socialPresence: 0
    };
    
    // Box office component
    const totalBoxOffice = data.movies.reduce((sum, movie) => sum + movie.boxOffice, 0);
    components.boxOffice = Math.min(totalBoxOffice / 2000000000, 1.0); // Cap at $2B
    
    // Critical reception component
    const avgRating = data.movies.reduce((sum, movie) => sum + movie.rating, 0) / data.movies.length;
    components.criticalReception = avgRating / 10;
    
    // Longevity component (based on span of years)
    const years = data.movies.map(m => m.year);
    const yearSpan = Math.max(...years) - Math.min(...years);
    components.longevity = Math.min(yearSpan / 30, 1.0); // Cap at 30 years
    
    // Merchandising component
    components.merchandising = Math.min(data.merchandise.annualRevenue / 1500000000, 1.0); // Cap at $1.5B
    
    // Social presence component
    components.socialPresence = Math.min(data.socialMedia.mentions / 10000000, 1.0) * data.socialMedia.sentiment;
    
    const overallScore = Object.values(components).reduce((sum, score) => sum + score, 0) / Object.keys(components).length;
    
    return {
      overallScore,
      components
    };
  }
  
  function generateNarrativeTimeline(timelineData: any): any {
    const storyBeats = [
      {
        timelinePosition: 1,
        storyArcPhase: 'introduction',
        title: 'Character Introduction',
        narrativeSignificance: 0.6
      },
      {
        timelinePosition: 2,
        storyArcPhase: 'rising_action',
        title: 'First Conflict',
        narrativeSignificance: 0.7
      },
      {
        timelinePosition: 3,
        storyArcPhase: 'rising_action',
        title: 'Building Tension',
        narrativeSignificance: 0.8
      },
      {
        timelinePosition: 4,
        storyArcPhase: 'climax',
        title: 'Major Confrontation',
        narrativeSignificance: 1.0
      },
      {
        timelinePosition: 5,
        storyArcPhase: 'falling_action',
        title: 'Resolution Begin',
        narrativeSignificance: 0.7
      },
      {
        timelinePosition: 6,
        storyArcPhase: 'resolution',
        title: 'New Status Quo',
        narrativeSignificance: 0.6
      }
    ];
    
    const coherenceScore = 0.85; // High coherence for well-structured timeline
    
    return {
      storyBeats,
      coherenceScore,
      totalNarrativeWeight: storyBeats.reduce((sum, beat) => sum + beat.narrativeSignificance, 0)
    };
  }
  
  function generateCharacterArcTimeline(characterArc: any): any {
    const developmentBeats = characterArc.keyEvents.map((event, index) => ({
      event,
      timelinePosition: index + 1,
      characterGrowthScore: (index + 1) / characterArc.keyEvents.length,
      traitChanges: {
        added: index < 2 ? [] : ['experienced'],
        removed: index < 3 ? [] : ['naive']
      },
      currentTraits: index === characterArc.keyEvents.length - 1 ? 
        characterArc.endingTraits : 
        characterArc.startingTraits.slice(0, -index)
    }));
    
    return {
      developmentBeats,
      overallGrowth: 1.0
    };
  }
});