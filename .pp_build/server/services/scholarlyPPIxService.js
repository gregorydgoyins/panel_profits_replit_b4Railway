"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scholarlyPPIxService = void 0;
const scholarlyInvestmentFramework_js_1 = require("./scholarlyInvestmentFramework.js");
class ScholarlyPPIxService {
    /**
     * Generate scholarly demo data based on real comic investment principles
     */
    generateScholarlyDemoAssets() {
        return [
            // INSTITUTIONAL GRADE (85+ score)
            {
                assetId: 'action-1',
                name: 'Action Comics #1',
                symbol: 'ACT1',
                category: 'First Appearances',
                marketCap: 6000000, // $6M based on scholarly analysis
                price: 6000000,
                yearPublished: 1938,
                grade: '9.0',
                creators: [{ name: 'Jerry Siegel', role: 'Writer' }, { name: 'Joe Shuster', role: 'Artist' }],
                publisher: 'DC Comics',
                description: 'First appearance of Superman - the foundation of the superhero genre'
            },
            {
                assetId: 'detective-27',
                name: 'Detective Comics #27',
                symbol: 'DET27',
                category: 'First Appearances',
                marketCap: 3500000,
                price: 3500000,
                yearPublished: 1939,
                grade: '8.5',
                creators: [{ name: 'Bob Kane', role: 'Artist' }, { name: 'Bill Finger', role: 'Writer' }],
                publisher: 'DC Comics',
                description: 'First appearance of Batman - defining dark superhero archetype'
            },
            {
                assetId: 'marvel-1',
                name: 'Marvel Comics #1',
                symbol: 'MAR1',
                category: 'Golden Age',
                marketCap: 1200000,
                price: 1200000,
                yearPublished: 1939,
                grade: '8.0',
                creators: [{ name: 'Carl Burgos', role: 'Artist' }, { name: 'Lloyd Casey', role: 'Writer' }],
                publisher: 'Marvel Comics',
                description: 'First Marvel publication - birth of Marvel Universe'
            },
            // INVESTMENT GRADE (70-84 score)
            {
                assetId: 'fantastic-four-1',
                name: 'Fantastic Four #1',
                symbol: 'FF1',
                category: 'Team Origins',
                marketCap: 285000,
                price: 285000,
                yearPublished: 1961,
                grade: '9.2',
                creators: [{ name: 'Stan Lee', role: 'Writer' }, { name: 'Jack Kirby', role: 'Artist' }],
                publisher: 'Marvel Comics',
                description: 'Birth of Marvel Silver Age - revolutionary storytelling'
            },
            {
                assetId: 'amazing-fantasy-15',
                name: 'Amazing Fantasy #15',
                symbol: 'AF15',
                category: 'First Appearances',
                marketCap: 425000,
                price: 425000,
                yearPublished: 1962,
                grade: '9.0',
                creators: [{ name: 'Stan Lee', role: 'Writer' }, { name: 'Steve Ditko', role: 'Artist' }],
                publisher: 'Marvel Comics',
                description: 'First appearance of Spider-Man - most relatable superhero'
            },
            {
                assetId: 'x-men-1',
                name: 'X-Men #1',
                symbol: 'XMEN1',
                category: 'Team Origins',
                marketCap: 195000,
                price: 195000,
                yearPublished: 1963,
                grade: '8.5',
                creators: [{ name: 'Stan Lee', role: 'Writer' }, { name: 'Jack Kirby', role: 'Artist' }],
                publisher: 'Marvel Comics',
                description: 'Metaphor for civil rights - social consciousness in comics'
            },
            {
                assetId: 'hulk-181',
                name: 'Incredible Hulk #181',
                symbol: 'IH181',
                category: 'Character Debuts',
                marketCap: 165000,
                price: 165000,
                yearPublished: 1974,
                grade: '9.4',
                creators: [{ name: 'Len Wein', role: 'Writer' }, { name: 'Herb Trimpe', role: 'Artist' }],
                publisher: 'Marvel Comics',
                description: 'First full appearance of Wolverine - antihero archetype'
            },
            // SPECULATIVE GRADE (55-69 score)
            {
                assetId: 'new-mutants-98',
                name: 'New Mutants #98',
                symbol: 'NM98',
                category: 'Modern Keys',
                marketCap: 18500,
                price: 18500,
                yearPublished: 1991,
                grade: '9.8',
                creators: [{ name: 'Rob Liefeld', role: 'Artist' }, { name: 'Fabian Nicieza', role: 'Writer' }],
                publisher: 'Marvel Comics',
                description: 'First appearance of Deadpool - postmodern superhero deconstruction'
            },
            {
                assetId: 'walking-dead-1',
                name: 'Walking Dead #1',
                symbol: 'WD1',
                category: 'Independent',
                marketCap: 12000,
                price: 12000,
                yearPublished: 2003,
                grade: '9.6',
                creators: [{ name: 'Robert Kirkman', role: 'Writer' }, { name: 'Tony Moore', role: 'Artist' }],
                publisher: 'Image Comics',
                description: 'Independent comics success - transmedia cultural phenomenon'
            },
            // Additional assets for comprehensive index
            {
                assetId: 'tales-suspense-39',
                name: 'Tales of Suspense #39',
                symbol: 'TOS39',
                category: 'First Appearances',
                marketCap: 225000,
                price: 225000,
                yearPublished: 1963,
                grade: '8.0',
                creators: [{ name: 'Stan Lee', role: 'Writer' }, { name: 'Don Heck', role: 'Artist' }],
                publisher: 'Marvel Comics',
                description: 'First appearance of Iron Man - technology superhero'
            }
        ];
    }
    /**
     * Calculate PPIx 50 using scholarly investment criteria
     */
    calculateScholarlyPPIx50() {
        const assets = this.generateScholarlyDemoAssets();
        const evaluations = scholarlyInvestmentFramework_js_1.scholarlyInvestmentFramework.generatePPIx50Constituents(assets);
        // Calculate index value based on market cap weighted methodology
        const totalMarketCap = evaluations.reduce((sum, evaluation) => sum + evaluation.asset.marketCap, 0);
        const indexValue = totalMarketCap / 1000; // Scaled for index presentation
        const constituents = evaluations.map((evaluation, index) => ({
            assetId: evaluation.asset.assetId,
            name: evaluation.asset.name,
            symbol: evaluation.asset.symbol,
            category: evaluation.asset.category,
            weight: (evaluation.asset.marketCap / totalMarketCap) * 100,
            marketCap: evaluation.asset.marketCap,
            investmentGrade: evaluation.investmentGrade,
            overallScore: evaluation.overallScore,
            topMetrics: this.getTopMetrics(evaluation)
        }));
        return {
            name: 'PPIx 50',
            description: 'Blue Chip Comic Index - Top 50 Investment-Grade Comic Assets',
            currentValue: indexValue,
            dayChange: indexValue * 0.0143, // Demo: +1.43%
            dayChangePercent: 1.43,
            weekChange: indexValue * -0.0073, // Demo: -0.73%
            volume: 125000,
            constituents,
            lastRebalance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            nextRebalance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            methodology: this.getPPIx50Methodology(),
            selectionCriteria: this.getPPIx50SelectionCriteria(),
            academicBasis: this.getAcademicBasis()
        };
    }
    /**
     * Calculate PPIx 100 using scholarly investment criteria
     */
    calculateScholarlyPPIx100() {
        const assets = this.generateScholarlyDemoAssets();
        const evaluations = scholarlyInvestmentFramework_js_1.scholarlyInvestmentFramework.generatePPIx100Constituents(assets);
        const totalMarketCap = evaluations.reduce((sum, evaluation) => sum + evaluation.asset.marketCap, 0);
        const indexValue = totalMarketCap / 2000; // Different scaling for growth index
        const constituents = evaluations.map((evaluation, index) => ({
            assetId: evaluation.asset.assetId,
            name: evaluation.asset.name,
            symbol: evaluation.asset.symbol,
            category: evaluation.asset.category,
            weight: (evaluation.asset.marketCap / totalMarketCap) * 100,
            marketCap: evaluation.asset.marketCap,
            investmentGrade: evaluation.investmentGrade,
            overallScore: evaluation.overallScore,
            topMetrics: this.getTopMetrics(evaluation)
        }));
        return {
            name: 'PPIx 100',
            description: 'Growth Comic Index - Top 100 Investment & Speculative Comic Assets',
            currentValue: indexValue,
            dayChange: indexValue * -0.0065, // Demo: -0.65%
            dayChangePercent: -0.65,
            weekChange: indexValue * 0.0487, // Demo: +4.87%
            volume: 89500,
            constituents,
            lastRebalance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            nextRebalance: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            methodology: this.getPPIx100Methodology(),
            selectionCriteria: this.getPPIx100SelectionCriteria(),
            academicBasis: this.getAcademicBasis()
        };
    }
    getTopMetrics(evaluation) {
        const metrics = Object.entries(evaluation.metrics)
            .filter(([key, value]) => typeof value === 'number' && value >= 70)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([key]) => this.formatMetricName(key));
        return metrics;
    }
    formatMetricName(key) {
        return key.replace(/([A-Z])/g, ' $1').trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    getPPIx50Methodology() {
        return "The PPIx 50 applies the rigorous 20 Art Investment Metrics to comic books, treating them as investment-grade cultural assets rather than mere collectibles. Selection requires INSTITUTIONAL or INVESTMENT grade ratings (70+ scores) across Historical Significance, Artistic Merit, Cross-Cultural Relevance, Curatorial Fit, and Endurance Value. Like the Dow Jones Industrial Average, constituents represent the most stable, historically significant, and institutionally recognized comic book assets.";
    }
    getPPIx50SelectionCriteria() {
        return "Minimum 70/100 investment score • Institutional or Investment grade rating • Historical significance (major character debuts, industry milestones) • Cross-cultural recognition and appeal • Museum/curatorial interest • Proven endurance across decades • Technical and artistic excellence • Material integrity and condition standards";
    }
    getPPIx100Methodology() {
        return "The PPIx 100 expands the scholarly framework to include SPECULATIVE grade assets (55+ scores), creating a growth-oriented index similar to the NASDAQ 100. This index captures emerging trends, modern keys, and culturally significant works that may not yet have full institutional recognition but demonstrate strong investment fundamentals across the 20 Art Investment Metrics.";
    }
    getPPIx100SelectionCriteria() {
        return "Minimum 55/100 investment score • Investment, Speculative, or Institutional grade • Broader historical and cultural significance • Emerging market recognition • Growth potential in cross-cultural appeal • Modern classics and breakthrough works • Independent and mainstream publisher representation";
    }
    getAcademicBasis() {
        return "Based on established art market investment principles from academic sources including Elkins ('Pictures and Tears'), Thompson ('The $12 Million Stuffed Shark'), and international scholarship on art valuation. Applies time-tested metrics of Historical Significance, Artistic Merit, Technical Mastery, Cross-Cultural Relevance, Curatorial Fit, Material Integrity, and Endurance Value to comic book assets.";
    }
}
exports.scholarlyPPIxService = new ScholarlyPPIxService();
