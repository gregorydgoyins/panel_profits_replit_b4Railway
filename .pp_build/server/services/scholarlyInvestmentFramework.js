"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scholarlyInvestmentFramework = void 0;
class ScholarlyInvestmentFramework {
    /**
     * Evaluate Historical Significance
     * "The degree to which an artwork captures, influences, or is shaped by pivotal events"
     */
    evaluateHistoricalSignificance(asset) {
        let score = 0;
        // Era Premium: Golden Age (1938-1950) gets major bonus
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 40; // Golden Age premium
        }
        else if (year >= 1951 && year <= 1970) {
            score += 25; // Silver Age premium
        }
        else if (year >= 1971 && year <= 1985) {
            score += 15; // Bronze Age
        }
        // Foundation Comics (Birth of genres/universes)
        if (asset.name.includes('Action Comics #1')) {
            score += 50; // Birth of superhero genre
        }
        else if (asset.name.includes('Detective Comics #27')) {
            score += 45; // Birth of dark hero archetype
        }
        else if (asset.name.includes('Marvel Comics #1')) {
            score += 40; // Birth of Marvel Universe
        }
        // First Appearances Scaling
        if (asset.category === 'First Appearances') {
            if (asset.marketCap >= 1000000)
                score += 30; // $1M+ characters
            else if (asset.marketCap >= 100000)
                score += 20; // $100K+ characters
            else
                score += 15; // Other first appearances
        }
        // Industry Milestones
        if (asset.name.includes('Fantastic Four #1')) {
            score += 25; // Marvel Silver Age foundation
        }
        if (asset.name.includes('Amazing Fantasy #15')) {
            score += 25; // Most relatable superhero
        }
        return Math.min(100, score);
    }
    /**
     * Evaluate Artistic Merit
     * "Creative excellence, originality, innovation, artist's command over medium"
     */
    evaluateArtisticMerit(asset) {
        const factors = {
            artistReputation: 0,
            visualInnovation: 0,
            styleSignificance: 0,
            creativeBoldness: 0
        };
        // Legendary artists
        const legendaryArtists = ['Jack Kirby', 'Steve Ditko', 'Neal Adams', 'John Byrne'];
        if (legendaryArtists.some(artist => asset.creators?.some((c) => c.name.includes(artist)))) {
            factors.artistReputation = 30;
        }
        // Visual innovation periods
        if (asset.yearPublished && asset.yearPublished >= 1960 && asset.yearPublished <= 1970) {
            factors.visualInnovation = 25; // Silver Age innovation
        }
        return Math.min(100, Object.values(factors).reduce((sum, val) => sum + val, 0));
    }
    /**
     * Evaluate Technical Mastery
     * "Level of skill and control the artist demonstrates over chosen medium"
     */
    evaluateTechnicalMastery(asset) {
        const factors = {
            craftmanship: 0,
            mediumMastery: 0,
            executionQuality: 0,
            innovation: 0
        };
        // Printing and production quality of era
        if (asset.yearPublished && asset.yearPublished >= 1950) {
            factors.craftmanship = 20;
        }
        // Superior execution based on grade/condition
        if (asset.grade && parseFloat(asset.grade) >= 9.0) {
            factors.executionQuality = 25;
        }
        return Math.min(100, Object.values(factors).reduce((sum, val) => sum + val, 0));
    }
    /**
     * Evaluate Cross-Cultural Relevance
     * "Power to resonate beyond the culture that produced it"
     */
    evaluateCrossCulturalRelevance(asset) {
        const factors = {
            globalRecognition: 0,
            universalThemes: 0,
            internationalAdaptation: 0,
            culturalTranscendence: 0
        };
        // Globally recognized characters
        const globalCharacters = ['Superman', 'Batman', 'Spider-Man', 'X-Men'];
        if (globalCharacters.some(char => asset.name.includes(char))) {
            factors.globalRecognition = 35;
            factors.culturalTranscendence = 25;
        }
        // Universal themes (justice, heroism, sacrifice)
        if (asset.category === 'Team Origins' || asset.category === 'First Appearances') {
            factors.universalThemes = 20;
        }
        return Math.min(100, Object.values(factors).reduce((sum, val) => sum + val, 0));
    }
    /**
     * Evaluate Curatorial Fit
     * "Ability to belong within institutional collections"
     */
    evaluateCuratorialFit(asset) {
        const factors = {
            museumWorthy: 0,
            academicInterest: 0,
            institutionalRecognition: 0,
            culturalSignificance: 0
        };
        // Museum-quality pieces
        if (asset.name.includes('Action Comics #1') || asset.name.includes('Detective Comics #27')) {
            factors.museumWorthy = 40;
            factors.institutionalRecognition = 30;
        }
        // Academic study subjects
        if (asset.category === 'Golden Age' || asset.category === 'First Appearances') {
            factors.academicInterest = 20;
        }
        return Math.min(100, Object.values(factors).reduce((sum, val) => sum + val, 0));
    }
    /**
     * Evaluate Emotional Intensity
     * "Visceral, immediate impact that bypasses intellect and moves the heart"
     */
    evaluateEmotionalIntensity(asset) {
        const factors = {
            iconicImagery: 0,
            emotionalResonance: 0,
            nostalgicPower: 0,
            viscerallmpact: 0
        };
        // Iconic cover imagery
        if (asset.name.includes('Amazing Fantasy #15') || asset.name.includes('X-Men #1')) {
            factors.iconicImagery = 30;
        }
        // Emotional themes
        if (asset.category === 'Origin Stories' || asset.category === 'Character Deaths') {
            factors.emotionalResonance = 25;
        }
        return Math.min(100, Object.values(factors).reduce((sum, val) => sum + val, 0));
    }
    /**
     * Evaluate complete investment profile for a comic book asset
     */
    evaluateAsset(asset) {
        const metrics = {
            // Core Investment Metrics (1-12)
            historicalSignificance: this.evaluateHistoricalSignificance(asset),
            artisticMerit: this.evaluateArtisticMerit(asset),
            technicalMastery: this.evaluateTechnicalMastery(asset),
            narrativeQuality: this.evaluateNarrativeQuality(asset),
            symbolicDensity: this.evaluateSymbolicDensity(asset),
            rarityIrreplaceability: this.evaluateRarityIrreplaceability(asset),
            provenanceMystery: this.evaluateProvenanceMystery(asset),
            crossCulturalRelevance: this.evaluateCrossCulturalRelevance(asset),
            curatorialFit: this.evaluateCuratorialFit(asset),
            materialIntegrity: this.evaluateMaterialIntegrity(asset),
            emotionalIntensity: this.evaluateEmotionalIntensity(asset),
            enduranceValue: this.evaluateEnduranceValue(asset),
            // Additional Investment Metrics (13-20) - Complete 20 Art Investment Metrics
            marketLiquidity: this.evaluateMarketLiquidity(asset),
            institutionalRecognition: this.evaluateInstitutionalRecognition(asset),
            scholarlyAttention: this.evaluateScholarlyAttention(asset),
            conservationState: this.evaluateConservationState(asset),
            culturalImpact: this.evaluateCulturalImpact(asset),
            economicSignificance: this.evaluateEconomicSignificance(asset),
            aestheticInnovation: this.evaluateAestheticInnovation(asset),
            socialRelevance: this.evaluateSocialRelevance(asset)
        };
        const overallScore = this.calculateOverallScore(metrics);
        const investmentGrade = this.determineInvestmentGrade(overallScore);
        const reasoning = this.generateReasoning(asset, metrics, overallScore);
        const comparativeAnalysis = this.generateComparativeAnalysis(asset, metrics);
        return {
            asset,
            metrics,
            overallScore,
            investmentGrade,
            reasoning,
            comparativeAnalysis
        };
    }
    /**
     * Placeholder methods for remaining metrics - to be implemented
     */
    evaluateNarrativeQuality(asset) {
        let score = 40; // Base narrative quality
        // Legendary Writer Bonuses
        if (asset.creators?.some(c => c.name.includes('Stan Lee')))
            score += 30;
        if (asset.creators?.some(c => c.name.includes('Jerry Siegel')))
            score += 25;
        if (asset.creators?.some(c => c.name.includes('Bob Kane')))
            score += 20;
        if (asset.creators?.some(c => c.name.includes('Bill Finger')))
            score += 20;
        // Genre-Defining Stories
        if (asset.name.includes('Action Comics #1') || asset.name.includes('Detective Comics #27')) {
            score += 25; // Genre-defining narratives
        }
        // Character Depth Innovation
        if (asset.name.includes('Amazing Fantasy #15'))
            score += 20; // Flawed hero archetype
        if (asset.name.includes('X-Men #1'))
            score += 15; // Metaphor for prejudice
        return Math.min(100, score);
    }
    evaluateSymbolicDensity(asset) {
        let score = 35; // Base symbolic content
        // Archetypal Characters (Deep symbolic resonance)
        if (asset.name.includes('Action Comics #1')) {
            score += 40; // Superman = immigrant hope, American Dream
        }
        else if (asset.name.includes('Detective Comics #27')) {
            score += 35; // Batman = trauma, justice, dark heroism
        }
        // Social Metaphor Characters
        if (asset.name.includes('X-Men #1'))
            score += 30; // Prejudice, civil rights
        if (asset.name.includes('Amazing Fantasy #15'))
            score += 25; // Responsibility, coming of age
        if (asset.name.includes('Fantastic Four #1'))
            score += 20; // Family, scientific wonder
        // Era Symbolic Density
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 20; // Golden Age archetypal establishment
        }
        else if (year >= 1960 && year <= 1975) {
            score += 15; // Silver/Bronze Age social commentary
        }
        // Cultural Foundation Status
        if (asset.category === 'First Appearances' && asset.marketCap >= 100000) {
            score += 15; // Major characters = symbolic density
        }
        return Math.min(100, score);
    }
    evaluateRarityIrreplaceability(asset) {
        let score = 20; // Base rarity
        // Era-based rarity (Golden Age extremely rare)
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1945) {
            score += 50; // Pre-war comics extremely rare
        }
        else if (year >= 1946 && year <= 1955) {
            score += 35; // Post-war Golden Age
        }
        else if (year >= 1956 && year <= 1970) {
            score += 20; // Silver Age rarity
        }
        // Market Cap Indicates Survival Rarity
        if (asset.marketCap >= 1000000)
            score += 25; // Million+ indicates extreme rarity
        else if (asset.marketCap >= 500000)
            score += 20;
        else if (asset.marketCap >= 100000)
            score += 15;
        // Grade Premium (High grade = extreme rarity)
        if (asset.grade) {
            const gradeNum = parseFloat(asset.grade);
            if (gradeNum >= 9.0)
                score += 15; // Museum quality
            else if (gradeNum >= 8.0)
                score += 10;
            else if (gradeNum >= 7.0)
                score += 5;
        }
        return Math.min(100, score);
    }
    evaluateProvenanceMystery(asset) {
        let score = 40; // Base provenance value
        // Golden Age Provenance Premium (fewer documented owners)
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 30; // Golden Age mystery premium
        }
        else if (year >= 1951 && year <= 1970) {
            score += 15; // Silver Age documented interest
        }
        // High Market Cap = Documented Significance
        if (asset.marketCap >= 1000000)
            score += 25; // Museum/auction house documentation
        else if (asset.marketCap >= 500000)
            score += 15; // Serious collector documentation
        else if (asset.marketCap >= 100000)
            score += 10; // Hobby documentation
        // Grade Quality = Professional Documentation
        if (asset.grade) {
            const gradeNum = parseFloat(asset.grade);
            if (gradeNum >= 9.0)
                score += 10; // CGC/CBCS professional documentation
            else if (gradeNum >= 8.0)
                score += 5;
        }
        return Math.min(100, score);
    }
    evaluateMaterialIntegrity(asset) {
        let score = 30; // Base material score
        // Era-based Paper Quality
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 35; // Golden Age paper quality premium
        }
        else if (year >= 1951 && year <= 1970) {
            score += 25; // Silver Age quality
        }
        else if (year >= 1971 && year <= 1985) {
            score += 15; // Bronze Age standards
        }
        // Grade Reflects Material Integrity
        if (asset.grade) {
            const gradeNum = parseFloat(asset.grade);
            if (gradeNum >= 9.5)
                score += 30; // Near perfect preservation
            else if (gradeNum >= 9.0)
                score += 25; // Excellent preservation
            else if (gradeNum >= 8.5)
                score += 20; // Very good preservation
            else if (gradeNum >= 8.0)
                score += 15; // Good preservation
            else if (gradeNum >= 7.0)
                score += 10; // Acceptable preservation
        }
        // High Value = Superior Material Integrity
        if (asset.marketCap >= 1000000)
            score += 10; // Only highest integrity commands millions
        return Math.min(100, score);
    }
    evaluateEnduranceValue(asset) {
        let score = 30; // Base endurance
        // Age Test: Still relevant after decades
        const age = 2025 - (asset.yearPublished || 2025);
        if (age >= 85)
            score += 40; // 85+ years = legendary endurance
        else if (age >= 60)
            score += 30; // 60+ years = proven staying power
        else if (age >= 35)
            score += 20; // 35+ years = established classics
        else if (age >= 15)
            score += 10; // 15+ years = emerging classics
        // Continuous Cultural Presence
        if (asset.name.includes('Action Comics #1') || asset.name.includes('Detective Comics #27')) {
            score += 30; // Superman/Batman never left culture
        }
        // Cross-Generational Appeal
        if (asset.name.includes('Amazing Fantasy #15'))
            score += 25; // Spider-Man spans generations
        if (asset.name.includes('Fantastic Four #1'))
            score += 20; // FF family dynamics timeless
        if (asset.name.includes('X-Men #1'))
            score += 20; // Social metaphors always relevant
        // Market Cap Reflects Enduring Value
        if (asset.marketCap >= 1000000)
            score += 15; // Million+ = enduring demand
        else if (asset.marketCap >= 100000)
            score += 10;
        return Math.min(100, score);
    }
    /**
     * Metrics 13-20: Complete the 20 Art Investment Metrics
     */
    evaluateMarketLiquidity(asset) {
        let score = 30; // Base liquidity
        // Market Cap Indicates Liquidity
        if (asset.marketCap >= 1000000)
            score += 40; // Million+ = high liquidity
        else if (asset.marketCap >= 500000)
            score += 30;
        else if (asset.marketCap >= 100000)
            score += 20;
        else if (asset.marketCap >= 50000)
            score += 10;
        // Era Liquidity (Golden Age more liquid in high grades)
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950 && asset.grade && parseFloat(asset.grade) >= 8.0) {
            score += 20; // Golden Age high grade = premium liquidity
        }
        // Publisher Recognition = Liquidity
        if (asset.publisher === 'DC Comics' || asset.publisher === 'Marvel Comics') {
            score += 10; // Major publisher recognition
        }
        return Math.min(100, score);
    }
    evaluateInstitutionalRecognition(asset) {
        let score = 20; // Base recognition
        // Museum-Level Recognition
        if (asset.name.includes('Action Comics #1')) {
            score += 60; // Smithsonian/MoMA level
        }
        else if (asset.name.includes('Detective Comics #27')) {
            score += 55; // Metropolitan Museum level
        }
        else if (asset.name.includes('Marvel Comics #1')) {
            score += 45; // National Gallery level
        }
        // Academic Institution Interest
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1955) {
            score += 25; // Golden Age academic study
        }
        else if (year >= 1956 && year <= 1970) {
            score += 15; // Silver Age cultural studies
        }
        // High Market Cap = Institutional Validation
        if (asset.marketCap >= 1000000)
            score += 15;
        return Math.min(100, score);
    }
    evaluateScholarlyAttention(asset) {
        let score = 25; // Base scholarly interest
        // Foundation Comics = Academic Study
        if (asset.name.includes('Action Comics #1') || asset.name.includes('Detective Comics #27')) {
            score += 50; // PhD dissertations, academic papers
        }
        // Historical Significance = Scholarly Attention
        if (asset.category === 'First Appearances' && asset.marketCap >= 100000) {
            score += 25; // Major character studies
        }
        // Era Academic Interest
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 20; // Golden Age scholarly focus
        }
        // Cultural Studies Subject
        if (asset.name.includes('X-Men #1'))
            score += 15; // Civil rights metaphor studies
        return Math.min(100, score);
    }
    evaluateConservationState(asset) {
        let score = 40; // Base conservation
        // Grade = Conservation Quality
        if (asset.grade) {
            const gradeNum = parseFloat(asset.grade);
            if (gradeNum >= 9.5)
                score += 40; // Museum conservation
            else if (gradeNum >= 9.0)
                score += 35; // Archival conservation
            else if (gradeNum >= 8.5)
                score += 25; // Professional conservation
            else if (gradeNum >= 8.0)
                score += 15; // Good conservation
        }
        // Era Conservation Challenges
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1955) {
            // Golden Age paper more fragile, higher conservation scores for survivors
            score += 15;
        }
        return Math.min(100, score);
    }
    evaluateCulturalImpact(asset) {
        let score = 30; // Base cultural impact
        // Foundational Cultural Icons
        if (asset.name.includes('Action Comics #1')) {
            score += 50; // Superman = global cultural icon
        }
        else if (asset.name.includes('Detective Comics #27')) {
            score += 45; // Batman = dark hero archetype
        }
        // Major Character Cultural Impact
        if (asset.name.includes('Amazing Fantasy #15'))
            score += 30; // Spider-Man global appeal
        if (asset.name.includes('Fantastic Four #1'))
            score += 25; // Marvel cultural foundation
        if (asset.name.includes('X-Men #1'))
            score += 25; // Diversity/inclusion cultural impact
        // Cross-Generational Impact
        const age = 2025 - (asset.yearPublished || 2025);
        if (age >= 60)
            score += 15; // Multi-generational cultural presence
        return Math.min(100, score);
    }
    evaluateEconomicSignificance(asset) {
        let score = 25; // Base economic value
        // Market Cap = Economic Significance
        if (asset.marketCap >= 5000000)
            score += 50; // $5M+ = major economic asset
        else if (asset.marketCap >= 1000000)
            score += 40; // $1M+ = significant economic value
        else if (asset.marketCap >= 500000)
            score += 30;
        else if (asset.marketCap >= 100000)
            score += 20;
        // Era Economic Premium
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 20; // Golden Age economic significance
        }
        // Industry Economic Impact
        if (asset.category === 'First Appearances' && asset.marketCap >= 100000) {
            score += 15; // Major character economic value
        }
        return Math.min(100, score);
    }
    evaluateAestheticInnovation(asset) {
        let score = 35; // Base aesthetic value
        // Legendary Artist Innovation
        if (asset.creators?.some(c => c.name.includes('Jack Kirby')))
            score += 35; // Kirby dynamics
        if (asset.creators?.some(c => c.name.includes('Steve Ditko')))
            score += 30; // Ditko style
        if (asset.creators?.some(c => c.name.includes('Neal Adams')))
            score += 25; // Adams realism
        // Era Aesthetic Innovation
        const year = asset.yearPublished || 2000;
        if (year >= 1938 && year <= 1950) {
            score += 25; // Golden Age style establishment
        }
        else if (year >= 1956 && year <= 1975) {
            score += 20; // Silver/Bronze Age innovation
        }
        // Genre-Defining Aesthetics
        if (asset.name.includes('Action Comics #1') || asset.name.includes('Detective Comics #27')) {
            score += 20; // Foundational visual languages
        }
        return Math.min(100, score);
    }
    evaluateSocialRelevance(asset) {
        let score = 30; // Base social relevance
        // Social Metaphor Characters
        if (asset.name.includes('X-Men #1'))
            score += 40; // Civil rights metaphor
        if (asset.name.includes('Amazing Fantasy #15'))
            score += 30; // Responsibility ethics
        if (asset.name.includes('Action Comics #1'))
            score += 25; // Immigrant hope/American Dream
        // Era Social Context
        const year = asset.yearPublished || 2000;
        if (year >= 1960 && year <= 1975) {
            score += 20; // Civil rights era relevance
        }
        else if (year >= 1938 && year <= 1950) {
            score += 15; // Depression/WWII context
        }
        // Continuing Social Relevance
        if (asset.marketCap >= 100000)
            score += 15; // Market validates social importance
        return Math.min(100, score);
    }
    calculateOverallScore(metrics) {
        // Complete 20 Art Investment Metrics Weighting
        const weights = {
            // Core Investment Metrics (1-12) - 80% weight
            historicalSignificance: 0.12,
            artisticMerit: 0.08,
            technicalMastery: 0.06,
            narrativeQuality: 0.07,
            symbolicDensity: 0.06,
            rarityIrreplaceability: 0.12,
            provenanceMystery: 0.07,
            crossCulturalRelevance: 0.10,
            curatorialFit: 0.08,
            materialIntegrity: 0.06,
            emotionalIntensity: 0.04,
            enduranceValue: 0.08,
            // Additional Investment Metrics (13-20) - 20% weight  
            marketLiquidity: 0.02,
            institutionalRecognition: 0.05,
            scholarlyAttention: 0.03,
            conservationState: 0.02,
            culturalImpact: 0.04,
            economicSignificance: 0.03,
            aestheticInnovation: 0.02,
            socialRelevance: 0.03
        };
        let score = 0;
        Object.entries(weights).forEach(([key, weight]) => {
            const value = metrics[key];
            score += (typeof value === 'number' ? value : 0) * weight;
        });
        return Math.round(score);
    }
    determineInvestmentGrade(score) {
        if (score >= 85)
            return 'INSTITUTIONAL';
        if (score >= 70)
            return 'INVESTMENT';
        if (score >= 55)
            return 'SPECULATIVE';
        return 'COLLECTIBLE';
    }
    generateReasoning(asset, metrics, score) {
        const strengths = [];
        const weaknesses = [];
        Object.entries(metrics).forEach(([key, value]) => {
            if (value >= 70)
                strengths.push(key);
            if (value <= 30)
                weaknesses.push(key);
        });
        return `Investment Grade Analysis: ${asset.name} scores ${score}/100, qualifying as ${this.determineInvestmentGrade(score)} grade. Primary strengths: ${strengths.join(', ')}. Areas for consideration: ${weaknesses.join(', ')}.`;
    }
    generateComparativeAnalysis(asset, metrics) {
        // TODO: Implement comparative analysis against market benchmarks
        return `Comparative analysis: This asset demonstrates ${metrics.crossCulturalRelevance >= 70 ? 'strong' : 'moderate'} cross-cultural appeal and ${metrics.curatorialFit >= 70 ? 'high' : 'limited'} institutional fit, positioning it ${metrics.historicalSignificance >= 80 ? 'among the most historically significant' : 'as a noteworthy'} investment in the comic book asset class.`;
    }
    /**
     * Generate objective PPIx 50 constituents based on investment metrics
     */
    generatePPIx50Constituents(assets) {
        const evaluations = assets.map(asset => this.evaluateAsset(asset));
        // Debug logging
        console.log(`🎓 DEBUG: Evaluating ${evaluations.length} assets for PPIx 50`);
        evaluations.forEach(evaluation => {
            console.log(`🎓 ${evaluation.asset.name}: Score ${evaluation.overallScore}, Grade ${evaluation.investmentGrade}`);
            if (evaluation.asset.name.includes('Action Comics #1') || evaluation.asset.name.includes('Detective Comics #27')) {
                console.log(`  📊 Detailed metrics: Historical=${evaluation.metrics.historicalSignificance}, Artistic=${evaluation.metrics.artisticMerit}, Cross-Cultural=${evaluation.metrics.crossCulturalRelevance}, Curatorial=${evaluation.metrics.curatorialFit}, Endurance=${evaluation.metrics.enduranceValue}, Rarity=${evaluation.metrics.rarityIrreplaceability}`);
            }
        });
        // Filter for INSTITUTIONAL and INVESTMENT grade only
        const investmentGradeAssets = evaluations.filter(evaluation => evaluation.investmentGrade === 'INSTITUTIONAL' || evaluation.investmentGrade === 'INVESTMENT');
        console.log(`🎓 DEBUG: ${investmentGradeAssets.length} assets qualified for PPIx 50 (70+ score)`);
        // Sort by overall score and institutional fit
        return investmentGradeAssets
            .sort((a, b) => {
            // Primary sort: Overall score
            if (b.overallScore !== a.overallScore) {
                return b.overallScore - a.overallScore;
            }
            // Secondary sort: Curatorial fit (institutional legitimacy)
            return b.metrics.curatorialFit - a.metrics.curatorialFit;
        })
            .slice(0, 50);
    }
    /**
     * Generate objective PPIx 100 constituents based on investment metrics
     */
    generatePPIx100Constituents(assets) {
        const evaluations = assets.map(asset => this.evaluateAsset(asset));
        // Include all investment grades for broader growth index
        const qualifiedAssets = evaluations.filter(evaluation => evaluation.investmentGrade !== 'COLLECTIBLE');
        console.log(`🎓 DEBUG: ${qualifiedAssets.length} assets qualified for PPIx 100 (55+ score)`);
        return qualifiedAssets
            .sort((a, b) => b.overallScore - a.overallScore)
            .slice(0, 100);
    }
}
exports.scholarlyInvestmentFramework = new ScholarlyInvestmentFramework();
