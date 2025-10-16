"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage");
const replitAuth_1 = require("./replitAuth");
const databaseStorage_1 = require("./databaseStorage");
const comicData_js_1 = __importDefault(require("./routes/comicData.js"));
const vectorRoutes_js_1 = __importDefault(require("./routes/vectorRoutes.js"));
const dataImportRoutes_js_1 = __importDefault(require("./routes/dataImportRoutes.js"));
const housesRoutes_js_1 = __importDefault(require("./routes/housesRoutes.js"));
const sevenHousesRoutes_js_1 = __importDefault(require("./routes/sevenHousesRoutes.js"));
const karmaRoutes_js_1 = __importDefault(require("./routes/karmaRoutes.js"));
const learningRoutes_js_1 = __importDefault(require("./routes/learningRoutes.js"));
const integrations_js_1 = __importDefault(require("./routes/integrations.js"));
const collectorRoutes_js_1 = __importDefault(require("./routes/collectorRoutes.js"));
const comicRoutes_1 = require("./routes/comicRoutes");
const comicCoverRoutes_js_1 = require("./routes/comicCoverRoutes.js");
const notificationRoutes_js_1 = require("./routes/notificationRoutes.js");
const enhancedDataRoutes_js_1 = __importDefault(require("./routes/enhancedDataRoutes.js"));
const enhancedAiRoutes_js_1 = __importDefault(require("./routes/enhancedAiRoutes.js"));
const visualStorytellingRoutes_js_1 = __importDefault(require("./routes/visualStorytellingRoutes.js"));
const progressionRoutes_js_1 = __importDefault(require("./routes/progressionRoutes.js"));
const phase1Routes_js_1 = __importDefault(require("./phase1Routes.js"));
const tradingRoutes_js_1 = __importDefault(require("./routes/tradingRoutes.js"));
const storyMarketRoutes_js_1 = require("./routes/storyMarketRoutes.js");
const shadowRoutes_js_1 = __importDefault(require("./routes/shadowRoutes.js"));
const journalRoutes_js_1 = __importDefault(require("./routes/journalRoutes.js"));
const warfareRoutes_js_1 = __importDefault(require("./routes/warfareRoutes.js"));
const pinecone_js_1 = __importDefault(require("./routes/pinecone.js"));
// Comic Vine API disabled - service no longer available
// import comicVineRoutes from "./routes/comicVineRoutes.js";
const marvelRoutes_js_1 = __importDefault(require("./routes/marvelRoutes.js"));
const coverRoutes_js_1 = __importDefault(require("./routes/coverRoutes.js"));
const dcRoutes_js_1 = __importDefault(require("./routes/dcRoutes.js"));
const kaggleComicsRoutes_js_1 = __importDefault(require("./routes/kaggleComicsRoutes.js"));
const characterAttributesRoutes_js_1 = __importDefault(require("./routes/characterAttributesRoutes.js"));
const datasetExpansionRoutes_js_1 = __importDefault(require("./routes/datasetExpansionRoutes.js"));
const analyticsRoutes_js_1 = __importDefault(require("./routes/analyticsRoutes.js"));
const symbolGeneration_js_1 = __importDefault(require("./routes/symbolGeneration.js"));
const youtube_js_1 = __importDefault(require("./routes/youtube.js"));
const marketSimulation_js_1 = require("./marketSimulation.js");
const leaderboardService_js_1 = require("./leaderboardService.js");
const schema_1 = require("@shared/schema");
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const entitySeedingService_1 = require("./services/entitySeedingService");
async function registerRoutes(app) {
    // Setup Replit Auth middleware
    await (0, replitAuth_1.setupAuth)(app);
    // Public object storage route - for serving comic covers and other public assets
    app.get("/public-objects/:filePath(*)", async (req, res) => {
        const filePath = req.params.filePath;
        const { ObjectStorageService } = await Promise.resolve().then(() => __importStar(require('./objectStorage')));
        const { getObjectAclPolicy } = await Promise.resolve().then(() => __importStar(require('./objectAcl')));
        const objectStorageService = new ObjectStorageService();
        try {
            const file = await objectStorageService.searchPublicObject(filePath);
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }
            // Enforce ACL visibility check - only serve public objects
            // Deny by default: reject if no ACL policy or not marked public
            const aclPolicy = await getObjectAclPolicy(file);
            if (!aclPolicy || aclPolicy.visibility !== 'public') {
                return res.status(403).json({ error: "Access denied" });
            }
            objectStorageService.downloadObject(file, res);
        }
        catch (error) {
            console.error("Error searching for public object:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
    // Auth routes
    app.get('/api/auth/user', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const user = await storage_1.storage.getUser(userId);
            res.json(user);
        }
        catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Failed to fetch user" });
        }
    });
    // Market Status - Returns current market status
    app.get('/api/market/status', async (req, res) => {
        try {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const day = now.getDay();
            const currentMinutes = hours * 60 + minutes; // Convert to total minutes since midnight
            // Market hours in minutes:
            // Open: 9:30 AM (570 min) - 3:30 PM (870 min)
            // Pre-market: 4:00 AM (240 min) - 9:00 AM (540 min) 
            // After-hours: 4:00 PM (960 min) - 8:00 PM (1200 min)
            let status = 'closed';
            if (day >= 1 && day <= 5) { // Monday-Friday
                if (currentMinutes >= 570 && currentMinutes < 870) {
                    status = 'open'; // 9:30 AM - 3:30 PM
                }
                else if (currentMinutes >= 240 && currentMinutes < 540) {
                    status = 'pre-market'; // 4:00 AM - 9:00 AM
                }
                else if (currentMinutes >= 960 && currentMinutes < 1200) {
                    status = 'after-hours'; // 4:00 PM - 8:00 PM
                }
            }
            res.json({
                status,
                nextChange: status === 'open' ? '3:30 PM EST' : '9:30 AM EST'
            });
        }
        catch (error) {
            console.error("Error fetching market status:", error);
            res.status(500).json({ message: "Failed to fetch market status" });
        }
    });
    // Era-Based Market Ticker - Prioritizes older eras (smaller float, higher volatility)
    app.get('/api/market/ticker', async (req, res) => {
        try {
            const { eraBasedTickerService } = await Promise.resolve().then(() => __importStar(require('./services/eraBasedTickerService.js')));
            const limit = req.query.limit ? parseInt(req.query.limit) : 30;
            const tickerAssets = await eraBasedTickerService.getTickerAssets(limit);
            res.json(tickerAssets);
        }
        catch (error) {
            console.error("Error fetching ticker data:", error);
            res.status(500).json({ message: "Failed to fetch ticker data" });
        }
    });
    // Era Distribution - Get market breakdown by comic book era
    app.get('/api/market/era-distribution', async (req, res) => {
        try {
            const { eraBasedTickerService } = await Promise.resolve().then(() => __importStar(require('./services/eraBasedTickerService.js')));
            const distribution = await eraBasedTickerService.getEraDistribution();
            res.json(distribution);
        }
        catch (error) {
            console.error("Error fetching era distribution:", error);
            res.status(500).json({ message: "Failed to fetch era distribution" });
        }
    });
    // Era Assets - Get assets from a specific era
    app.get('/api/market/era/:era', async (req, res) => {
        try {
            const { eraBasedTickerService } = await Promise.resolve().then(() => __importStar(require('./services/eraBasedTickerService.js')));
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const assets = await eraBasedTickerService.getEraAssets(req.params.era, limit);
            res.json(assets);
        }
        catch (error) {
            console.error(`Error fetching ${req.params.era} assets:`, error);
            res.status(500).json({ message: "Failed to fetch era assets" });
        }
    });
    // Entity Mining & Seeding - Mine comic book universe for tradable assets
    app.post('/api/admin/seed-entities', async (req, res) => {
        try {
            console.log('🎭 Starting entity seeding from API request...');
            // Run seeding service asynchronously
            entitySeedingService_1.entitySeedingService.seedAllEntities()
                .then(() => {
                console.log('✅ Entity seeding completed successfully');
            })
                .catch((error) => {
                console.error('❌ Entity seeding failed:', error);
            });
            // Return immediately so the request doesn't timeout
            res.json({
                success: true,
                message: 'Entity seeding started. Check server logs for progress.'
            });
        }
        catch (error) {
            console.error('Error starting entity seeding:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to start entity seeding'
            });
        }
    });
    // Price History Seeding - Create historical price snapshots for all assets
    app.post('/api/admin/seed-price-history', async (req, res) => {
        try {
            console.log('📊 Starting price history seeding from API request...');
            const { seedPriceHistory } = await Promise.resolve().then(() => __importStar(require('./services/priceHistorySeeding')));
            // Run seeding service asynchronously
            seedPriceHistory()
                .then(() => {
                console.log('✅ Price history seeding completed successfully');
            })
                .catch((error) => {
                console.error('❌ Price history seeding failed:', error);
            });
            // Return immediately so the request doesn't timeout
            res.json({
                success: true,
                message: 'Price history seeding started. Creating 90 days of historical data for all assets and CGC grades. Check server logs for progress.'
            });
        }
        catch (error) {
            console.error('Error starting price history seeding:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to start price history seeding'
            });
        }
    });
    // PriceCharting Integration - Test API connection with comic search
    app.get('/api/admin/pricecharting/test', async (req, res) => {
        try {
            const { priceChartingService } = await Promise.resolve().then(() => __importStar(require('./services/priceChartingService')));
            console.log('💰 Testing PriceCharting API with comic book search...');
            // Test searches for popular characters
            const tests = [
                { query: 'Amazing Spider-Man', type: 'series' },
                { query: 'Batman', type: 'character' },
                { query: 'X-Men', type: 'series' }
            ];
            const results = [];
            for (const test of tests) {
                const products = await priceChartingService.searchComics(test.query);
                if (products.length > 0) {
                    const topProduct = products[0];
                    const price = priceChartingService.getBestPrice(topProduct);
                    const seriesName = priceChartingService.extractSeriesName(topProduct['console-name']);
                    results.push({
                        query: test.query,
                        type: test.type,
                        found: products.length,
                        topResult: {
                            name: topProduct['product-name'],
                            series: seriesName,
                            genre: topProduct['genre'],
                            releaseDate: topProduct['release-date'],
                            price: `$${price.toFixed(2)}`,
                            gradedPrices: {
                                ungraded: topProduct['loose-price'] ? `$${(topProduct['loose-price'] / 100).toFixed(2)}` : 'N/A',
                                cgc_4: topProduct['cib-price'] ? `$${(topProduct['cib-price'] / 100).toFixed(2)}` : 'N/A',
                                cgc_6: topProduct['new-price'] ? `$${(topProduct['new-price'] / 100).toFixed(2)}` : 'N/A',
                                cgc_8: topProduct['graded-price'] ? `$${(topProduct['graded-price'] / 100).toFixed(2)}` : 'N/A',
                                cgc_92: topProduct['box-only-price'] ? `$${(topProduct['box-only-price'] / 100).toFixed(2)}` : 'N/A',
                                cgc_98: topProduct['manual-only-price'] ? `$${(topProduct['manual-only-price'] / 100).toFixed(2)}` : 'N/A',
                                cgc_10: topProduct['bgs-10-price'] ? `$${(topProduct['bgs-10-price'] / 100).toFixed(2)}` : 'N/A'
                            }
                        }
                    });
                }
                else {
                    results.push({
                        query: test.query,
                        type: test.type,
                        found: 0,
                        topResult: null
                    });
                }
            }
            const successfulSearches = results.filter(r => r.found > 0).length;
            if (successfulSearches === 0) {
                return res.json({
                    success: false,
                    message: 'PriceCharting API is not returning comic book data. Check API token permissions.',
                    results
                });
            }
            res.json({
                success: true,
                message: `PriceCharting API is working! Found data for ${successfulSearches}/${tests.length} searches.`,
                results
            });
        }
        catch (error) {
            console.error('❌ PriceCharting test failed:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to test PriceCharting connection',
                details: error.message
            });
        }
    });
    // NPC Trader Seeding - Populate market with 10,000 AI traders
    app.post('/api/admin/seed-npcs', async (req, res) => {
        try {
            console.log('🤖 Starting NPC trader seeding from API request...');
            const { count = 10000 } = req.body;
            const traderCount = typeof count === 'number' && count > 0 ? count : 10000;
            const { seedNPCTradersToDatabase } = await Promise.resolve().then(() => __importStar(require('./services/npcTraderGenerator')));
            // Run seeding service asynchronously
            seedNPCTradersToDatabase(databaseStorage_1.db, traderCount)
                .then((result) => {
                if (result.success) {
                    console.log('✅ NPC trader seeding completed successfully');
                    console.log(`📊 Seeded ${result.tradersSeeded} traders`);
                    console.log('🎭 Archetype distribution:', result.archetypeDistribution);
                    console.log('💰 Capital distribution:', result.capitalDistribution);
                }
                else {
                    console.log('⚠️ NPC seeding skipped:', result.message);
                }
            })
                .catch((error) => {
                console.error('❌ NPC trader seeding failed:', error);
            });
            // Return immediately so the request doesn't timeout
            res.json({
                success: true,
                message: `NPC trader seeding started. Generating ${traderCount} traders with diverse personalities and capital levels. Check server logs for progress.`
            });
        }
        catch (error) {
            console.error('Error starting NPC trader seeding:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to start NPC trader seeding'
            });
        }
    });
    // Entry Test Routes - Hidden Psychological Profiling
    app.post('/api/entry-test/submit', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { responses } = req.body;
            if (!responses || !Array.isArray(responses)) {
                return res.status(400).json({ error: "Invalid test responses" });
            }
            // Import test scenarios and process responses
            const { ENTRY_TEST_SCENARIOS } = await Promise.resolve().then(() => __importStar(require('@shared/entryTestScenarios')));
            // Initialize or get existing alignment score
            let alignmentScore = await storage_1.storage.getUserAlignmentScore(userId);
            if (!alignmentScore) {
                alignmentScore = await storage_1.storage.createAlignmentScore({ userId });
            }
            // Process each response and update alignment
            let totalDisplayScore = 0;
            const alignmentDeltas = {
                ruthlessnessDelta: 0,
                individualismDelta: 0,
                lawfulnessDelta: 0,
                greedDelta: 0
            };
            for (const response of responses) {
                const scenario = ENTRY_TEST_SCENARIOS.find(s => s.id === response.scenarioId);
                if (!scenario)
                    continue;
                const choice = scenario.choices.find(c => c.id === response.choiceId);
                if (!choice)
                    continue;
                // Record the decision (hidden tracking)
                await storage_1.storage.recordUserDecision({
                    userId,
                    decisionType: 'entry_test',
                    scenarioId: response.scenarioId,
                    choiceId: response.choiceId,
                    ruthlessnessImpact: String(choice.alignmentImpact.ruthlessness),
                    individualismImpact: String(choice.alignmentImpact.individualism),
                    lawfulnessImpact: String(choice.alignmentImpact.lawfulness),
                    greedImpact: String(choice.alignmentImpact.greed),
                    displayedScore: choice.displayedScore,
                    displayedFeedback: choice.displayedFeedback,
                    responseTime: response.responseTime,
                    contextData: { narrativeTags: choice.narrativeTags }
                });
                // Accumulate alignment changes
                alignmentDeltas.ruthlessnessDelta += choice.alignmentImpact.ruthlessness;
                alignmentDeltas.individualismDelta += choice.alignmentImpact.individualism;
                alignmentDeltas.lawfulnessDelta += choice.alignmentImpact.lawfulness;
                alignmentDeltas.greedDelta += choice.alignmentImpact.greed;
                totalDisplayScore += choice.displayedScore;
            }
            // Update alignment scores based on all responses
            await storage_1.storage.updateAlignmentScore(userId, alignmentDeltas);
            // Calculate House assignment based on final alignment
            const houseAssignment = await storage_1.storage.calculateHouseAssignment(userId);
            // Update user's House assignment
            const user = await storage_1.storage.getUser(userId);
            if (user) {
                await storage_1.storage.updateUser(userId, {
                    houseId: houseAssignment.primaryHouse,
                    houseJoinedAt: new Date()
                });
            }
            // Return the assignment (but not the hidden alignment scores!)
            res.json({
                primaryHouse: houseAssignment.primaryHouse,
                secondaryHouse: houseAssignment.secondaryHouse,
                displayScore: Math.round(totalDisplayScore / responses.length),
                testComplete: true
            });
        }
        catch (error) {
            console.error("Error processing entry test:", error);
            res.status(500).json({ error: "Failed to process test results" });
        }
    });
    // Check if user has completed Entry Test
    app.get('/api/entry-test/status', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const user = await storage_1.storage.getUser(userId);
            // Check if user has portfolio holdings (returning "Closers")
            const userPortfolios = await storage_1.storage.getUserPortfolios(userId);
            const hasPortfolio = userPortfolios && userPortfolios.length > 0;
            // Check if user has any trading activity
            const hasTraded = user?.lastTradingActivity != null;
            // "Closers" (returning users) bypass tests if they have portfolio or trading history
            const isReturningUser = hasPortfolio || hasTraded || !!user?.houseId;
            res.json({
                completed: !!user?.houseId, // Keep original semantics - test actually completed
                houseId: user?.houseId || null,
                requiresTest: !isReturningUser // Bypass for returning users
            });
        }
        catch (error) {
            console.error("Error checking test status:", error);
            res.status(500).json({ error: "Failed to check test status" });
        }
    });
    // Knowledge Test Routes - Financial Literacy Assessment (disguised as "Market Mastery Challenge")
    app.post('/api/knowledge-test/submit', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { responses, result } = req.body;
            if (!responses || !Array.isArray(responses) || !result) {
                return res.status(400).json({ error: "Invalid test submission" });
            }
            // Store the test result
            const testResult = await storage_1.storage.createKnowledgeTestResult({
                userId,
                profitScore: String(result.visibleScore),
                performanceRating: result.visibleScore >= 80 ? 'exceptional' :
                    result.visibleScore >= 65 ? 'strong' :
                        result.visibleScore >= 50 ? 'developing' : 'needs_improvement',
                displayedFeedback: `Your market optimization score: ${result.visibleScore}%. ${result.recommendation}`,
                knowledgeScore: String(result.hiddenKnowledgeScore),
                tier: result.tier,
                weakAreas: result.weakAreas,
                strengths: result.strengths,
                tradingFloorAccess: result.hiddenKnowledgeScore >= 60,
                accessLevel: result.tier === 'master' ? 'unlimited' :
                    result.tier === 'specialist' ? 'advanced' :
                        result.tier === 'trader' ? 'standard' :
                            result.tier === 'associate' ? 'basic' : 'restricted',
                restrictionReason: result.hiddenKnowledgeScore < 60 ? result.recommendation : null,
                timeSpent: responses.reduce((acc, r) => acc + (r.responseTime || 0), 0),
                questionsAnswered: responses.length,
                retakeAllowedAt: result.hiddenKnowledgeScore < 60 ?
                    new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24 hours for retake
                attemptNumber: 1 // Would need to track this properly in real implementation
            });
            // Store individual responses for analysis
            for (const response of responses) {
                const { KNOWLEDGE_TEST_SCENARIOS } = await Promise.resolve().then(() => __importStar(require('@shared/knowledgeTestScenarios')));
                const scenario = KNOWLEDGE_TEST_SCENARIOS.find((s) => s.id === response.scenarioId);
                if (!scenario)
                    continue;
                const choice = scenario.choices.find((c) => c.id === response.choiceId);
                if (!choice)
                    continue;
                await storage_1.storage.createKnowledgeTestResponse({
                    resultId: testResult.id,
                    userId,
                    scenarioId: response.scenarioId,
                    choiceId: response.choiceId,
                    knowledgeScore: String(choice.knowledgeScore),
                    profitScore: String(choice.profitScore),
                    responseTime: response.responseTime,
                    isCorrect: choice.knowledgeScore >= 70,
                    knowledgeAreas: scenario.requiredKnowledge
                });
            }
            // Update user's trading permissions based on test result
            const user = await storage_1.storage.getUser(userId);
            if (user) {
                const canTrade = result.hiddenKnowledgeScore >= 60;
                const canUseMargin = result.tier === 'master' || result.tier === 'specialist';
                const canShort = result.tier === 'master';
                await storage_1.storage.updateUser(userId, {
                    tradingPermissions: {
                        canTrade,
                        canUseMargin,
                        canShort,
                        knowledgeTier: result.tier
                    }
                });
            }
            // Create portfolio with score-based funding
            // Check if user already has a portfolio
            const existingPortfolios = await storage_1.storage.getUserPortfolios(userId);
            if (existingPortfolios.length === 0) {
                // Determine initial balance based on Knowledge Test score
                let initialBalance = "10000.00"; // Failed: $10,000
                const score = result.hiddenKnowledgeScore;
                if (score >= 90) {
                    initialBalance = "50000.00"; // 90-100%: $50,000
                }
                else if (score >= 80) {
                    initialBalance = "35000.00"; // 80-90%: $35,000
                }
                else if (score >= 70) {
                    initialBalance = "25000.00"; // 70-80%: $25,000
                }
                else if (score >= 60) {
                    initialBalance = "15000.00"; // 60-70%: $15,000
                }
                // Create default portfolio with score-based funding
                await storage_1.storage.createPortfolio({
                    userId,
                    name: "Primary Trading Account",
                    description: `Initial funding based on Market Mastery Challenge performance (${score}%)`,
                    cashBalance: initialBalance,
                    initialCashAllocation: initialBalance,
                    totalValue: initialBalance,
                    isDefault: true,
                    portfolioType: "default"
                });
            }
            res.json({
                success: true,
                result: {
                    ...result,
                    testId: testResult.id
                }
            });
        }
        catch (error) {
            console.error("Error processing knowledge test:", error);
            res.status(500).json({ error: "Failed to process test results" });
        }
    });
    // Check Knowledge Test status
    app.get('/api/knowledge-test/status', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            // Check if user is a returning "Closer" with portfolio or trading history
            const user = await storage_1.storage.getUser(userId);
            const userPortfolios = await storage_1.storage.getUserPortfolios(userId);
            const hasPortfolio = userPortfolios && userPortfolios.length > 0;
            const hasTraded = user?.lastTradingActivity != null;
            // "Closers" (returning users) bypass both tests if they have portfolio or trading history
            const isReturningUser = hasPortfolio || hasTraded || !!user?.houseId;
            if (isReturningUser) {
                // Bypass knowledge test for returning users
                return res.json({
                    hasCompletedTest: true, // Treat as completed for returning users
                    requiresTest: false
                });
            }
            // For new users: check if Entry Test is completed
            const hasCompletedEntryTest = !!user?.houseId;
            // If Entry Test not completed, they don't need Knowledge Test yet
            if (!hasCompletedEntryTest) {
                return res.json({
                    hasCompletedTest: false,
                    requiresTest: false // Entry Test must be done first
                });
            }
            // Check Knowledge Test completion for new users
            const latestResult = await storage_1.storage.getLatestKnowledgeTestResult(userId);
            if (!latestResult) {
                return res.json({
                    hasCompletedTest: false,
                    requiresTest: true // Entry Test done, now needs Knowledge Test
                });
            }
            res.json({
                hasCompletedTest: true,
                lastAttempt: {
                    completedAt: latestResult.completedAt,
                    tier: latestResult.tier,
                    profitScore: parseFloat(latestResult.profitScore),
                    knowledgeScore: parseFloat(latestResult.knowledgeScore),
                    retakeAllowedAt: latestResult.retakeAllowedAt
                }
            });
        }
        catch (error) {
            console.error("Error checking knowledge test status:", error);
            res.status(500).json({ error: "Failed to check test status" });
        }
    });
    // ================================
    // MARKET DATA POLLING ENDPOINT
    // Simple REST endpoint for market data snapshots (replaces WebSocket)
    // ================================
    app.get('/api/market-data/snapshot', async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const sortBy = req.query.sortBy || 'volume'; // volume, price, change
            // Get top assets from price streaming service
            const snapshot = priceStreamingService.getTopAssetsByVolume(limit);
            // Optionally re-sort based on query param
            if (sortBy === 'price') {
                snapshot.sort((a, b) => b.currentPrice - a.currentPrice);
            }
            else if (sortBy === 'change') {
                snapshot.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
            }
            res.json({
                timestamp: new Date().toISOString(),
                count: snapshot.length,
                data: snapshot
            });
        }
        catch (error) {
            console.error('Error generating market snapshot:', error);
            res.status(500).json({ error: 'Failed to generate market snapshot' });
        }
    });
    // Asset Management Routes
    app.get("/api/assets", async (req, res) => {
        try {
            const type = req.query.type;
            const search = req.query.search;
            const publisher = req.query.publisher;
            const limit = parseInt(req.query.limit) || 100;
            const offset = parseInt(req.query.offset) || 0;
            const assets = await storage_1.storage.getAssets({ type, search, publisher, limit, offset });
            res.json(assets);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch assets" });
        }
    });
    app.get("/api/assets/:id", async (req, res) => {
        try {
            const asset = await storage_1.storage.getAsset(req.params.id);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            res.json(asset);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch asset" });
        }
    });
    app.get("/api/assets/symbol/:symbol", async (req, res) => {
        try {
            const asset = await storage_1.storage.getAssetBySymbol(req.params.symbol);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            res.json(asset);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch asset" });
        }
    });
    // Trending Characters - Heroes and villains across all publishers
    app.get("/api/characters/trending", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 12;
            // Fetch character assets with latest market data (limit to 100 to avoid overflow)
            const characters = await storage_1.storage.getAssets({ type: 'CHARACTER', limit: 100 });
            // Get latest prices for characters that have them
            const charactersWithPrices = await Promise.all(characters.slice(0, limit).map(async (char) => {
                const latestData = await storage_1.storage.getLatestMarketData(char.symbol);
                return {
                    ...char,
                    price: latestData?.close || null,
                    percentChange: latestData?.percentChange || null,
                    volume: latestData?.volume || null
                };
            }));
            // Sort by random or volume for now (since we don't have consistent price data)
            const trending = charactersWithPrices.sort(() => Math.random() - 0.5);
            res.json(trending);
        }
        catch (error) {
            console.error('Error fetching trending characters:', error);
            res.status(500).json({ error: "Failed to fetch trending characters" });
        }
    });
    // Creator Spotlight - Hot writers and artists across all publishers
    app.get("/api/creators/spotlight", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 8;
            // Fetch creator assets with latest market data
            const creators = await storage_1.storage.getAssets({ type: 'CREATOR' });
            // Get latest prices for creators
            const creatorsWithPrices = await Promise.all(creators.slice(0, limit).map(async (creator) => {
                const latestData = await storage_1.storage.getLatestMarketData(creator.symbol);
                return {
                    ...creator,
                    price: latestData?.close || null,
                    percentChange: latestData?.percentChange || null,
                    volume: latestData?.volume || null
                };
            }));
            // Sort by price change or random for now
            const spotlight = creatorsWithPrices.sort((a, b) => {
                if (a.percentChange && b.percentChange) {
                    return Math.abs(b.percentChange) - Math.abs(a.percentChange);
                }
                return Math.random() - 0.5;
            });
            res.json(spotlight);
        }
        catch (error) {
            console.error('Error fetching creator spotlight:', error);
            res.status(500).json({ error: "Failed to fetch creator spotlight" });
        }
    });
    // Timeline Key Moments - Visual timeline of major narrative milestones
    app.get("/api/timeline/key-moments", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 12;
            // Sample seed data to demonstrate widget functionality
            // In future (Task 39), this will query entityNarrativeMilestones table
            const sampleMoments = [
                {
                    id: "1",
                    title: "Spider-Man Gets Black Suit",
                    description: "Peter Parker obtains the alien symbiote suit during the Secret Wars",
                    date: "1984",
                    imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
                    issue: "Secret Wars #8",
                    significance: "Introduction of the symbiote that would become Venom",
                    entityName: "Spider-Man",
                    entityType: "character"
                },
                {
                    id: "2",
                    title: "Death of Superman",
                    description: "Superman dies fighting Doomsday in epic battle over Metropolis",
                    date: "1992",
                    imageUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
                    issue: "Superman #75",
                    significance: "One of the best-selling comic books of all time",
                    entityName: "Superman",
                    entityType: "character"
                },
                {
                    id: "3",
                    title: "Batman Breaks His Back",
                    description: "Bane breaks Batman's back, leaving Bruce Wayne paralyzed",
                    date: "1993",
                    imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
                    issue: "Batman #497",
                    significance: "Led to the Knightfall saga and Azrael as Batman",
                    entityName: "Batman",
                    entityType: "character"
                },
                {
                    id: "4",
                    title: "Gwen Stacy Dies",
                    description: "Green Goblin kills Gwen Stacy, ending the Silver Age innocence",
                    date: "1973",
                    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=600&fit=crop",
                    issue: "Amazing Spider-Man #121",
                    significance: "Marked the end of the Silver Age and introduced lasting consequences",
                    entityName: "Spider-Man",
                    entityType: "character"
                },
                {
                    id: "5",
                    title: "Wolverine First Appearance",
                    description: "Logan debuts as Canadian government agent fighting the Hulk",
                    date: "1974",
                    imageUrl: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=600&fit=crop",
                    issue: "Incredible Hulk #181",
                    significance: "Introduction of one of Marvel's most popular characters",
                    entityName: "Wolverine",
                    entityType: "character"
                },
                {
                    id: "6",
                    title: "Dark Phoenix Saga",
                    description: "Jean Grey becomes the Dark Phoenix, threatening the universe",
                    date: "1980",
                    imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
                    issue: "X-Men #137",
                    significance: "One of the greatest X-Men stories ever told",
                    entityName: "Jean Grey",
                    entityType: "character"
                },
                {
                    id: "7",
                    title: "Captain America Frozen",
                    description: "Steve Rogers frozen in ice at the end of World War II",
                    date: "1964",
                    imageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=600&fit=crop",
                    issue: "Avengers #4",
                    significance: "Brought Cap into the modern Marvel Age",
                    entityName: "Captain America",
                    entityType: "character"
                },
                {
                    id: "8",
                    title: "Civil War Begins",
                    description: "Superhero Registration Act divides heroes into two factions",
                    date: "2006",
                    imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
                    issue: "Civil War #1",
                    significance: "Major crossover event that reshaped the Marvel Universe",
                    entityName: "Marvel Universe",
                    entityType: "event"
                }
            ];
            res.json(sampleMoments.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching timeline key moments:', error);
            res.status(500).json({ error: "Failed to fetch timeline key moments" });
        }
    });
    // Creator Showcase - Visual showcase with iconic covers
    app.get("/api/creators/showcase", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 6;
            // Sample seed data showcasing famous creators with their iconic covers
            const sampleCreators = [
                {
                    id: "1",
                    name: "Stan Lee",
                    role: "Writer, Editor, Publisher",
                    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
                    bio: "The legendary co-creator of Spider-Man, X-Men, Iron Man, and countless Marvel heroes. Revolutionized comic storytelling with human, flawed characters.",
                    iconicCovers: [
                        {
                            id: "c1",
                            title: "Amazing Fantasy #15",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=450&fit=crop",
                            year: "1962",
                            publisher: "Marvel"
                        },
                        {
                            id: "c2",
                            title: "Fantastic Four #1",
                            coverUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=300&h=450&fit=crop",
                            year: "1961",
                            publisher: "Marvel"
                        },
                        {
                            id: "c3",
                            title: "X-Men #1",
                            coverUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=300&h=450&fit=crop",
                            year: "1963",
                            publisher: "Marvel"
                        }
                    ],
                    awards: ["Eisner Award", "Inkpot Award", "National Medal of Arts"],
                    notableWorks: ["Spider-Man", "X-Men", "Fantastic Four", "Avengers"]
                },
                {
                    id: "2",
                    name: "Jack Kirby",
                    role: "Artist, Writer",
                    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop",
                    bio: "The King of Comics. Co-created Captain America, Fantastic Four, X-Men, and the visual language of superhero comics. Master of dynamic action and cosmic scope.",
                    iconicCovers: [
                        {
                            id: "c4",
                            title: "Captain America Comics #1",
                            coverUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=300&h=450&fit=crop",
                            year: "1941",
                            publisher: "Timely"
                        },
                        {
                            id: "c5",
                            title: "New Gods #1",
                            coverUrl: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=300&h=450&fit=crop",
                            year: "1971",
                            publisher: "DC"
                        },
                        {
                            id: "c6",
                            title: "Fantastic Four #1",
                            coverUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=450&fit=crop",
                            year: "1961",
                            publisher: "Marvel"
                        }
                    ],
                    awards: ["Eisner Hall of Fame", "Kirby Award (named after him)"],
                    notableWorks: ["Fantastic Four", "New Gods", "Captain America", "Thor"]
                },
                {
                    id: "3",
                    name: "Alan Moore",
                    role: "Writer",
                    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
                    bio: "Deconstructed superhero mythology with Watchmen. Created sophisticated, layered narratives that elevated comics to literature.",
                    iconicCovers: [
                        {
                            id: "c7",
                            title: "Watchmen #1",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=450&fit=crop",
                            year: "1986",
                            publisher: "DC"
                        },
                        {
                            id: "c8",
                            title: "V for Vendetta #1",
                            coverUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=300&h=450&fit=crop",
                            year: "1982",
                            publisher: "DC"
                        },
                        {
                            id: "c9",
                            title: "Swamp Thing #21",
                            coverUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=300&h=450&fit=crop",
                            year: "1984",
                            publisher: "DC"
                        }
                    ],
                    awards: ["Hugo Award", "Eisner Award (multiple)", "British Fantasy Award"],
                    notableWorks: ["Watchmen", "V for Vendetta", "Swamp Thing", "From Hell"]
                },
                {
                    id: "4",
                    name: "Frank Miller",
                    role: "Writer, Artist",
                    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
                    bio: "Revolutionized Batman with The Dark Knight Returns. Brought noir sensibility and mature themes to mainstream comics.",
                    iconicCovers: [
                        {
                            id: "c10",
                            title: "The Dark Knight Returns #1",
                            coverUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=300&h=450&fit=crop",
                            year: "1986",
                            publisher: "DC"
                        },
                        {
                            id: "c11",
                            title: "Daredevil #181",
                            coverUrl: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=300&h=450&fit=crop",
                            year: "1982",
                            publisher: "Marvel"
                        },
                        {
                            id: "c12",
                            title: "Sin City #1",
                            coverUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=450&fit=crop",
                            year: "1991",
                            publisher: "Dark Horse"
                        }
                    ],
                    awards: ["Eisner Award (multiple)", "Harvey Award", "Inkpot Award"],
                    notableWorks: ["Dark Knight Returns", "Batman: Year One", "Sin City", "Daredevil"]
                }
            ];
            res.json(sampleCreators.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching creator showcase:', error);
            res.status(500).json({ error: "Failed to fetch creator showcase" });
        }
    });
    // Creator Market Impact - Stan Lee vs others performance metrics
    app.get("/api/creators/market-impact", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            // Sample seed data showing creator market performance
            const sampleCreatorImpact = [
                {
                    creatorName: "Stan Lee",
                    creatorImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    totalComics: 1247,
                    avgPrice: 8450,
                    priceChange24h: 12.5,
                    marketShare: 28.3,
                    topComic: {
                        title: "Amazing Fantasy #15",
                        price: 285000,
                        coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                    }
                },
                {
                    creatorName: "Jack Kirby",
                    creatorImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                    totalComics: 1089,
                    avgPrice: 7250,
                    priceChange24h: 8.7,
                    marketShare: 22.1,
                    topComic: {
                        title: "Fantastic Four #1",
                        price: 195000,
                        coverUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=150&h=225&fit=crop"
                    }
                },
                {
                    creatorName: "Frank Miller",
                    creatorImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                    totalComics: 342,
                    avgPrice: 6890,
                    priceChange24h: -3.2,
                    marketShare: 9.8,
                    topComic: {
                        title: "Dark Knight Returns #1",
                        price: 42000,
                        coverUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=150&h=225&fit=crop"
                    }
                },
                {
                    creatorName: "Alan Moore",
                    creatorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                    totalComics: 287,
                    avgPrice: 9120,
                    priceChange24h: 15.3,
                    marketShare: 8.4,
                    topComic: {
                        title: "Watchmen #1",
                        price: 58000,
                        coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                    }
                },
                {
                    creatorName: "Todd McFarlane",
                    creatorImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
                    totalComics: 456,
                    avgPrice: 4320,
                    priceChange24h: 5.8,
                    marketShare: 6.2,
                    topComic: {
                        title: "Amazing Spider-Man #300",
                        price: 38000,
                        coverUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=150&h=225&fit=crop"
                    }
                }
            ];
            res.json(sampleCreatorImpact.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching creator market impact:', error);
            res.status(500).json({ error: "Failed to fetch creator market impact" });
        }
    });
    // Franchise Tracker - All variants at a glance (all Spider-Men, all Batmen, etc.)
    app.get("/api/franchises/tracker", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 3;
            // Sample seed data showing franchise families with all variants
            const sampleFranchises = [
                {
                    id: "spider-verse",
                    franchiseName: "Spider-Man",
                    publisher: "Marvel",
                    totalVariants: 6,
                    totalMarketCap: 145000000,
                    avgPriceChange: 8.3,
                    variants: [
                        {
                            id: "peter-616",
                            variantName: "Spider-Man (Peter Parker)",
                            realName: "Peter Parker",
                            imageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=200&h=200&fit=crop",
                            universe: "Earth-616",
                            currentPrice: 4250,
                            priceChange24h: 12.5,
                            marketCap: 48000000,
                            tradingVolume: 285000,
                            firstAppearance: "Amazing Fantasy #15 (1962)",
                            popularity: 98
                        },
                        {
                            id: "miles-1610",
                            variantName: "Spider-Man (Miles Morales)",
                            realName: "Miles Morales",
                            imageUrl: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=200&h=200&fit=crop",
                            universe: "Earth-1610",
                            currentPrice: 3890,
                            priceChange24h: 15.7,
                            marketCap: 32000000,
                            tradingVolume: 195000,
                            firstAppearance: "Ultimate Fallout #4 (2011)",
                            popularity: 92
                        },
                        {
                            id: "gwen-65",
                            variantName: "Spider-Gwen",
                            realName: "Gwen Stacy",
                            imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&h=200&fit=crop",
                            universe: "Earth-65",
                            currentPrice: 2750,
                            priceChange24h: 8.2,
                            marketCap: 18000000,
                            tradingVolume: 142000,
                            firstAppearance: "Edge of Spider-Verse #2 (2014)",
                            popularity: 85
                        },
                        {
                            id: "miguel-928",
                            variantName: "Spider-Man 2099",
                            realName: "Miguel O'Hara",
                            imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&h=200&fit=crop",
                            universe: "Earth-928",
                            currentPrice: 1980,
                            priceChange24h: 5.3,
                            marketCap: 12000000,
                            tradingVolume: 87000,
                            firstAppearance: "Spider-Man 2099 #1 (1992)",
                            popularity: 76
                        },
                        {
                            id: "noir",
                            variantName: "Spider-Man Noir",
                            realName: "Peter Parker",
                            imageUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=200&h=200&fit=crop",
                            universe: "Earth-90214",
                            currentPrice: 1450,
                            priceChange24h: -2.1,
                            marketCap: 8500000,
                            tradingVolume: 64000,
                            firstAppearance: "Spider-Man Noir #1 (2009)",
                            popularity: 68
                        },
                        {
                            id: "scarlet",
                            variantName: "Scarlet Spider",
                            realName: "Ben Reilly",
                            imageUrl: "https://images.unsplash.com/photo-1608889825481-5ae0b3a1f223?w=200&h=200&fit=crop",
                            universe: "Earth-616",
                            currentPrice: 980,
                            priceChange24h: 3.8,
                            marketCap: 5200000,
                            tradingVolume: 42000,
                            firstAppearance: "Amazing Spider-Man #149 (1975)",
                            popularity: 62
                        }
                    ]
                },
                {
                    id: "bat-family",
                    franchiseName: "Batman",
                    publisher: "DC",
                    totalVariants: 5,
                    totalMarketCap: 128000000,
                    avgPriceChange: 6.7,
                    variants: [
                        {
                            id: "bruce-main",
                            variantName: "Batman",
                            realName: "Bruce Wayne",
                            imageUrl: "https://images.unsplash.com/photo-1608889825271-279e9be36b30?w=200&h=200&fit=crop",
                            universe: "Earth-0",
                            currentPrice: 5890,
                            priceChange24h: 9.2,
                            marketCap: 52000000,
                            tradingVolume: 312000,
                            firstAppearance: "Detective Comics #27 (1939)",
                            popularity: 99
                        },
                        {
                            id: "thomas-flashpoint",
                            variantName: "Batman (Thomas Wayne)",
                            realName: "Thomas Wayne",
                            imageUrl: "https://images.unsplash.com/photo-1608889825250-e80a672d76a2?w=200&h=200&fit=crop",
                            universe: "Flashpoint",
                            currentPrice: 3250,
                            priceChange24h: 12.4,
                            marketCap: 28000000,
                            tradingVolume: 186000,
                            firstAppearance: "Flashpoint #1 (2011)",
                            popularity: 82
                        },
                        {
                            id: "terry-beyond",
                            variantName: "Batman Beyond",
                            realName: "Terry McGinnis",
                            imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&h=200&fit=crop",
                            universe: "Earth-12",
                            currentPrice: 2890,
                            priceChange24h: 5.8,
                            marketCap: 22000000,
                            tradingVolume: 148000,
                            firstAppearance: "Batman Beyond #1 (1999)",
                            popularity: 78
                        },
                        {
                            id: "azrael",
                            variantName: "Azrael Batman",
                            realName: "Jean-Paul Valley",
                            imageUrl: "https://images.unsplash.com/photo-1608889335901-91804976b5d3?w=200&h=200&fit=crop",
                            universe: "Earth-0",
                            currentPrice: 1750,
                            priceChange24h: -1.2,
                            marketCap: 14000000,
                            tradingVolume: 95000,
                            firstAppearance: "Batman #488 (1993)",
                            popularity: 65
                        },
                        {
                            id: "damian-batman",
                            variantName: "Batman (Damian Wayne)",
                            realName: "Damian Wayne",
                            imageUrl: "https://images.unsplash.com/photo-1608889335660-3b5e4a9c4b1e?w=200&h=200&fit=crop",
                            universe: "Earth-666",
                            currentPrice: 1450,
                            priceChange24h: 8.9,
                            marketCap: 12000000,
                            tradingVolume: 78000,
                            firstAppearance: "Batman #666 (2007)",
                            popularity: 71
                        }
                    ]
                },
                {
                    id: "wolverine-claws",
                    franchiseName: "Wolverine",
                    publisher: "Marvel",
                    totalVariants: 4,
                    totalMarketCap: 89000000,
                    avgPriceChange: 10.2,
                    variants: [
                        {
                            id: "logan-616",
                            variantName: "Wolverine",
                            realName: "James Howlett",
                            imageUrl: "https://images.unsplash.com/photo-1608889335771-538a411d4f35?w=200&h=200&fit=crop",
                            universe: "Earth-616",
                            currentPrice: 4780,
                            priceChange24h: 11.3,
                            marketCap: 42000000,
                            tradingVolume: 245000,
                            firstAppearance: "Incredible Hulk #181 (1974)",
                            popularity: 95
                        },
                        {
                            id: "old-man-logan",
                            variantName: "Old Man Logan",
                            realName: "James Howlett",
                            imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&h=200&fit=crop",
                            universe: "Earth-807128",
                            currentPrice: 3250,
                            priceChange24h: 14.7,
                            marketCap: 26000000,
                            tradingVolume: 168000,
                            firstAppearance: "Wolverine #66 (2008)",
                            popularity: 88
                        },
                        {
                            id: "x-23",
                            variantName: "X-23 / Wolverine",
                            realName: "Laura Kinney",
                            imageUrl: "https://images.unsplash.com/photo-1608889335250-e80a672d76a2?w=200&h=200&fit=crop",
                            universe: "Earth-616",
                            currentPrice: 2180,
                            priceChange24h: 9.8,
                            marketCap: 15000000,
                            tradingVolume: 112000,
                            firstAppearance: "NYX #3 (2004)",
                            popularity: 81
                        },
                        {
                            id: "daken",
                            variantName: "Daken",
                            realName: "Akihiro",
                            imageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=200&h=200&fit=crop",
                            universe: "Earth-616",
                            currentPrice: 1340,
                            priceChange24h: 6.2,
                            marketCap: 9500000,
                            tradingVolume: 68000,
                            firstAppearance: "Wolverine Origins #10 (2007)",
                            popularity: 64
                        }
                    ]
                }
            ];
            res.json(sampleFranchises.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching franchise tracker:', error);
            res.status(500).json({ error: "Failed to fetch franchise tracker" });
        }
    });
    // Story Arc Explorer - Major comic storylines with full descriptions
    app.get("/api/story-arcs/explorer", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 8;
            // Sample seed data showcasing major comic book storylines
            const sampleStoryArcs = [
                {
                    id: "1",
                    title: "Civil War",
                    publisher: "Marvel",
                    yearRange: "2006-2007",
                    description: "A landmark Marvel crossover where the Superhero Registration Act divides the hero community into two factions. Iron Man leads those supporting government oversight, while Captain America champions freedom and privacy. The conflict tears friendships apart and reshapes the Marvel Universe, exploring themes of security versus liberty in a post-9/11 world.",
                    keyIssues: ["Civil War #1-7", "Amazing Spider-Man #529-538", "Captain America #22-24"],
                    protagonists: ["Iron Man", "Captain America", "Spider-Man", "Fantastic Four"],
                    antagonists: ["Baron Zemo", "Taskmaster"],
                    impact: "Redefined hero-villain dynamics; led to Secret Invasion and Dark Reign. Spider-Man's unmasking had lasting consequences.",
                    coverImageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
                    totalIssues: 102,
                    crossoverEvents: ["Secret Invasion", "Dark Reign"]
                },
                {
                    id: "2",
                    title: "Infinity Gauntlet",
                    publisher: "Marvel",
                    yearRange: "1991",
                    description: "Thanos acquires all six Infinity Gems, becoming omnipotent. With a snap of his fingers, he erases half of all life in the universe to impress Death herself. Earth's heroes mount a desperate last stand against a god-like foe. Jim Starlin's cosmic epic explores the corrupting nature of absolute power and the resilience of hope.",
                    keyIssues: ["Infinity Gauntlet #1-6", "Silver Surfer #34-38", "Thanos Quest #1-2"],
                    protagonists: ["Adam Warlock", "Silver Surfer", "Dr. Strange", "Avengers"],
                    antagonists: ["Thanos", "Mephisto", "Nebula"],
                    impact: "Established Thanos as Marvel's ultimate cosmic threat. Inspired the MCU's Infinity Saga. Defined modern cosmic Marvel storytelling.",
                    coverImageUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
                    totalIssues: 6,
                    crossoverEvents: ["Infinity War", "Infinity Crusade", "Endgame"]
                },
                {
                    id: "3",
                    title: "Crisis on Infinite Earths",
                    publisher: "DC",
                    yearRange: "1985-1986",
                    description: "The Anti-Monitor threatens to destroy the entire DC Multiverse. Heroes from infinite parallel Earths unite for the first time in a battle for existence itself. The 12-issue maxiseries streamlined DC's continuity, eliminating parallel worlds and establishing a single unified timeline. Iconic deaths include Supergirl and the Flash (Barry Allen).",
                    keyIssues: ["Crisis on Infinite Earths #1-12"],
                    protagonists: ["The Monitor", "Flash (Barry Allen)", "Supergirl", "Superman", "Wonder Woman"],
                    antagonists: ["Anti-Monitor", "The Shadow Demons"],
                    impact: "Rebooted the DC Universe. Death of Barry Allen and Supergirl. Streamlined 50 years of continuity into one timeline.",
                    coverImageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=600&fit=crop",
                    totalIssues: 12,
                    crossoverEvents: ["Infinite Crisis", "Final Crisis", "Dark Nights: Metal"]
                },
                {
                    id: "4",
                    title: "The Dark Phoenix Saga",
                    publisher: "Marvel",
                    yearRange: "1980",
                    description: "Jean Grey's cosmic powers corrupt her absolutely as she transforms into Dark Phoenix, consuming a star and destroying an inhabited world. The X-Men face an impossible choice: save their teammate or save the universe. Chris Claremont and John Byrne crafted a Greek tragedy exploring power, corruption, sacrifice, and redemption.",
                    keyIssues: ["Uncanny X-Men #129-138"],
                    protagonists: ["X-Men", "Jean Grey", "Cyclops", "Professor X"],
                    antagonists: ["Dark Phoenix", "Hellfire Club", "Shi'ar Empire"],
                    impact: "Redefined cosmic-level threats in comics. Jean Grey's sacrifice became a template for heroic deaths. Introduced the Hellfire Club.",
                    coverImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
                    totalIssues: 10,
                    crossoverEvents: ["Phoenix: Endsong", "Avengers vs. X-Men"]
                },
                {
                    id: "5",
                    title: "The Death of Superman",
                    publisher: "DC",
                    yearRange: "1992-1993",
                    description: "An unstoppable creature called Doomsday rampages toward Metropolis. Superman engages in a brutal fight to the death, sacrificing himself to save humanity. The world mourns. Four new Supermen emerge claiming his mantle. But is Clark Kent truly gone forever? The arc explored what Superman means to the world.",
                    keyIssues: ["Superman #75", "Adventures of Superman #497", "Action Comics #684"],
                    protagonists: ["Superman", "Justice League", "Lois Lane"],
                    antagonists: ["Doomsday", "Cyborg Superman", "Mongul"],
                    impact: "Best-selling comic of all time (Superman #75). Launched the Reign of the Supermen saga. Proved Superman's cultural importance.",
                    coverImageUrl: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=600&fit=crop",
                    totalIssues: 8,
                    crossoverEvents: ["Reign of the Supermen", "Return of Superman"]
                },
                {
                    id: "6",
                    title: "Secret Wars",
                    publisher: "Marvel",
                    yearRange: "1984-1985",
                    description: "The Beyonder transports Marvel's greatest heroes and villains to Battleworld, forcing them to fight for his amusement. Alliances shift, characters evolve, and Spider-Man discovers the black symbiote suit that will become Venom. Jim Shooter's 12-issue series was Marvel's first major crossover event.",
                    keyIssues: ["Marvel Super Heroes Secret Wars #1-12"],
                    protagonists: ["Spider-Man", "Captain America", "Fantastic Four", "X-Men"],
                    antagonists: ["Doctor Doom", "Galactus", "The Beyonder"],
                    impact: "Introduced the symbiote costume. Established the crossover event format. Spider-Man got his iconic black suit.",
                    coverImageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=600&fit=crop",
                    totalIssues: 12,
                    crossoverEvents: ["Secret Wars II", "Secret Wars (2015)"]
                },
                {
                    id: "7",
                    title: "Watchmen",
                    publisher: "DC",
                    yearRange: "1986-1987",
                    description: "In an alternate 1985 where costumed vigilantes are real, the murder of a former hero unravels a conspiracy that threatens nuclear war. Alan Moore and Dave Gibbons deconstructed the superhero genre, exploring moral ambiguity, the corrupting nature of power, and whether the ends justify the means. A landmark work that proved comics could be literature.",
                    keyIssues: ["Watchmen #1-12"],
                    protagonists: ["Rorschach", "Nite Owl", "Silk Spectre", "Dr. Manhattan"],
                    antagonists: ["Ozymandias", "The Comedian"],
                    impact: "Elevated comics to literary status. Won Hugo Award. Redefined what superhero stories could be. Endlessly analyzed and studied.",
                    coverImageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=600&fit=crop",
                    totalIssues: 12,
                    crossoverEvents: ["Doomsday Clock", "Before Watchmen"]
                },
                {
                    id: "8",
                    title: "House of M",
                    publisher: "Marvel",
                    yearRange: "2005",
                    description: "Scarlet Witch, driven mad by grief, warps reality creating a world where mutants rule and Magneto's family reigns supreme. Heroes awaken to false memories of their perfect lives. When they restore reality, Wanda utters three words that decimate mutantkind: 'No more mutants.' The event reduced Earth's mutant population from millions to 198.",
                    keyIssues: ["House of M #1-8", "Decimation", "Son of M"],
                    protagonists: ["Wolverine", "Layla Miller", "Emma Frost", "Doctor Strange"],
                    antagonists: ["Scarlet Witch", "Magneto", "Quicksilver"],
                    impact: "Decimation of mutants reshaped X-Men for years. Led to Messiah Complex, Messiah War, and Second Coming. Set stage for Avengers vs. X-Men.",
                    coverImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
                    totalIssues: 8,
                    crossoverEvents: ["Decimation", "Messiah Complex", "Avengers vs. X-Men"]
                }
            ];
            res.json(sampleStoryArcs.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching story arcs:', error);
            res.status(500).json({ error: "Failed to fetch story arcs" });
        }
    });
    // Narrative Milestones - Character evolution timeline
    app.get("/api/narrative/milestones", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            // Sample seed data showcasing major character evolution moments
            const sampleMilestones = [
                {
                    id: "1",
                    characterName: "Jean Grey",
                    characterImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                    milestoneType: "death",
                    title: "Death of Phoenix",
                    description: "Jean Grey sacrifices herself on the Moon to save the universe from Dark Phoenix. She chooses death over becoming a threat to all existence, making the ultimate heroic choice.",
                    issueReference: "Uncanny X-Men #137",
                    year: "1980",
                    impact: "Established death as meaningful in comics. Led to decades of Phoenix resurrection storylines.",
                    reversible: true
                },
                {
                    id: "2",
                    characterName: "Spider-Man",
                    characterImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    milestoneType: "costume_change",
                    title: "Black Suit Acquisition",
                    description: "Peter Parker bonds with an alien symbiote on Battleworld during Secret Wars, gaining a sentient black costume that amplifies his powers but also his aggression. This costume would later become Venom.",
                    issueReference: "Amazing Spider-Man #252",
                    year: "1984",
                    impact: "Created one of Marvel's most iconic villains. Introduced the symbiote concept to the Marvel Universe.",
                    reversible: true
                },
                {
                    id: "3",
                    characterName: "Superman",
                    characterImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                    milestoneType: "death",
                    title: "Death at Doomsday's Hands",
                    description: "Superman fights Doomsday to the death in the streets of Metropolis. Both combatants die from their injuries. The world mourns the loss of its greatest hero.",
                    issueReference: "Superman #75",
                    year: "1992",
                    impact: "Best-selling comic of all time. Proved Superman's importance to the world. Led to four replacement Supermen.",
                    reversible: true
                },
                {
                    id: "4",
                    characterName: "Captain America",
                    characterImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                    milestoneType: "identity_change",
                    title: "Becomes Nomad",
                    description: "Disillusioned with the American government after the Secret Empire scandal, Steve Rogers abandons the Captain America identity. He becomes Nomad, the man without a country.",
                    issueReference: "Captain America #180",
                    year: "1974",
                    impact: "Explored Cap's idealism vs. reality. Showed that the symbol can exist independent of government.",
                    reversible: true
                },
                {
                    id: "5",
                    characterName: "Thor",
                    characterImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                    milestoneType: "power_evolution",
                    title: "Becomes Unworthy",
                    description: "After Nick Fury whispers a terrible secret, Thor finds himself unable to lift Mjolnir. He loses his godly powers and becomes unworthy, watching as others wield his hammer.",
                    issueReference: "Original Sin #7",
                    year: "2014",
                    impact: "Led to Jane Foster becoming Thor. Explored what makes someone worthy beyond strength.",
                    reversible: true
                },
                {
                    id: "6",
                    characterName: "Gwen Stacy",
                    characterImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                    milestoneType: "death",
                    title: "The Night Gwen Stacy Died",
                    description: "The Green Goblin throws Gwen from the George Washington Bridge. Spider-Man's webbing catches her, but the whiplash snaps her neck. Peter Parker's first love dies in his arms.",
                    issueReference: "Amazing Spider-Man #121",
                    year: "1973",
                    impact: "Ended the Silver Age. Proved that heroes can't save everyone. Made death permanent and meaningful.",
                    reversible: false
                },
                {
                    id: "7",
                    characterName: "Hal Jordan",
                    characterImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    milestoneType: "identity_change",
                    title: "Fall to Parallax",
                    description: "Driven mad by Coast City's destruction, Hal Jordan absorbs the Central Power Battery and becomes Parallax. The greatest Green Lantern becomes the universe's greatest threat.",
                    issueReference: "Green Lantern #50",
                    year: "1994",
                    impact: "Introduced fear as a power source. Retconned years later as possession by fear entity Parallax.",
                    reversible: true
                },
                {
                    id: "8",
                    characterName: "Barry Allen",
                    characterImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                    milestoneType: "resurrection",
                    title: "Return from Speed Force",
                    description: "After 23 years dead, Barry Allen races back from the Speed Force. His return heralds the Rebirth era and restores hope to the DC Universe.",
                    issueReference: "Final Crisis #2",
                    year: "2008",
                    impact: "Launched DC Rebirth. Proved even the most permanent deaths can be undone with good storytelling.",
                    reversible: false
                },
                {
                    id: "9",
                    characterName: "Bucky Barnes",
                    characterImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                    milestoneType: "resurrection",
                    title: "Revealed as Winter Soldier",
                    description: "Captain America's supposedly dead sidekick Bucky Barnes is revealed to be alive, brainwashed as a Soviet assassin called the Winter Soldier. Cap's greatest failure becomes his greatest challenge.",
                    issueReference: "Captain America #1",
                    year: "2005",
                    impact: "Retconned a 'permanent' Golden Age death. Created one of Marvel's best redemption arcs.",
                    reversible: false
                },
                {
                    id: "10",
                    characterName: "Carol Danvers",
                    characterImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                    milestoneType: "power_evolution",
                    title: "Ascends to Captain Marvel",
                    description: "Carol Danvers leaves behind the Ms. Marvel identity to assume the mantle of Captain Marvel, honoring her mentor Mar-Vell while stepping into her own as one of Earth's mightiest heroes.",
                    issueReference: "Avenging Spider-Man #9",
                    year: "2012",
                    impact: "Established Carol as a flagship Marvel character. Led to MCU prominence and inspired a generation.",
                    reversible: false
                }
            ];
            res.json(sampleMilestones.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching narrative milestones:', error);
            res.status(500).json({ error: "Failed to fetch narrative milestones" });
        }
    });
    // Appearance Tracker - 4x1 Parallax widget showing major appearances
    app.get("/api/appearances/tracker", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 8;
            // Sample seed data - flat array of appearance cards for 4x1 parallax
            const sampleAppearances = [
                {
                    id: "app-1",
                    characterName: "Spider-Man",
                    characterImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    appearanceType: "first",
                    comicTitle: "Amazing Fantasy",
                    issueNumber: "#15",
                    publisher: "Marvel",
                    year: "1962",
                    coverUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
                    significance: "The birth of Spider-Man. Peter Parker gains powers and learns that with great power comes great responsibility",
                    estimatedValue: "$285,000",
                    priceChange24h: 12.5,
                    investmentPotential: "high"
                },
                {
                    id: "app-2",
                    characterName: "Wolverine",
                    characterImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                    appearanceType: "first",
                    comicTitle: "The Incredible Hulk",
                    issueNumber: "#181",
                    publisher: "Marvel",
                    year: "1974",
                    coverUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
                    significance: "First full appearance. Wolverine battles Hulk and Wendigo in a legendary three-way fight",
                    estimatedValue: "$24,500",
                    priceChange24h: 8.3,
                    investmentPotential: "high"
                },
                {
                    id: "app-3",
                    characterName: "Harley Quinn",
                    characterImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                    appearanceType: "second",
                    comicTitle: "The Batman Adventures",
                    issueNumber: "#12",
                    publisher: "DC",
                    year: "1993",
                    coverUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=600&fit=crop",
                    significance: "First comic book appearance. Brings the character from animation to print continuity",
                    estimatedValue: "$2,850",
                    priceChange24h: 15.7,
                    investmentPotential: "high"
                },
                {
                    id: "app-4",
                    characterName: "Venom",
                    characterImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
                    appearanceType: "key",
                    comicTitle: "The Amazing Spider-Man",
                    issueNumber: "#300",
                    publisher: "Marvel",
                    year: "1988",
                    coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
                    significance: "Full appearance and origin of Venom. Eddie Brock bonds with the alien symbiote",
                    estimatedValue: "$3,200",
                    priceChange24h: -2.1,
                    investmentPotential: "medium"
                },
                {
                    id: "app-5",
                    characterName: "Batman",
                    characterImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                    appearanceType: "first",
                    comicTitle: "Detective Comics",
                    issueNumber: "#27",
                    publisher: "DC",
                    year: "1939",
                    coverUrl: "https://images.unsplash.com/photo-1608889825271-279e9be36b30?w=400&h=600&fit=crop",
                    significance: "The debut of the Dark Knight. Batman's first appearance establishes the vigilante archetype",
                    estimatedValue: "$1,500,000",
                    priceChange24h: 5.2,
                    investmentPotential: "high"
                },
                {
                    id: "app-6",
                    characterName: "Deadpool",
                    characterImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                    appearanceType: "first",
                    comicTitle: "The New Mutants",
                    issueNumber: "#98",
                    publisher: "Marvel",
                    year: "1991",
                    coverUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=600&fit=crop",
                    significance: "First appearance of the Merc with a Mouth. Created by Rob Liefeld and Fabian Nicieza",
                    estimatedValue: "$4,800",
                    priceChange24h: 18.9,
                    investmentPotential: "high"
                },
                {
                    id: "app-7",
                    characterName: "Miles Morales",
                    characterImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                    appearanceType: "first",
                    comicTitle: "Ultimate Fallout",
                    issueNumber: "#4",
                    publisher: "Marvel",
                    year: "2011",
                    coverUrl: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=600&fit=crop",
                    significance: "First full appearance of Miles Morales as Spider-Man. A new generation of web-slinger",
                    estimatedValue: "$580",
                    priceChange24h: 22.4,
                    investmentPotential: "high"
                },
                {
                    id: "app-8",
                    characterName: "Thanos",
                    characterImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                    appearanceType: "cameo",
                    comicTitle: "Iron Man",
                    issueNumber: "#55",
                    publisher: "Marvel",
                    year: "1973",
                    coverUrl: "https://images.unsplash.com/photo-1620420158368-89d607a0423c?w=400&h=600&fit=crop",
                    significance: "Cameo appearance of the Mad Titan. Created by Jim Starlin as Marvel's ultimate cosmic threat",
                    estimatedValue: "$1,250",
                    priceChange24h: 6.8,
                    investmentPotential: "medium"
                }
            ];
            res.json(sampleAppearances.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching appearance tracker:', error);
            res.status(500).json({ error: "Failed to fetch appearance tracker" });
        }
    });
    // Relationship Web - Character connections
    app.get("/api/relationships/web", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            // Sample seed data showcasing character relationship networks
            const sampleRelationships = [
                {
                    id: "1",
                    characterName: "Spider-Man",
                    characterId: "spiderman",
                    imageUrl: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=200&h=200&fit=crop",
                    relationships: [
                        {
                            targetName: "Mary Jane Watson",
                            targetId: "mj",
                            targetImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                            relationType: "love_interest",
                            description: "His wife and soulmate through countless trials",
                            strength: 10
                        },
                        {
                            targetName: "Green Goblin",
                            targetId: "goblin",
                            targetImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                            relationType: "enemy",
                            description: "Norman Osborn, his greatest nemesis",
                            strength: 10
                        },
                        {
                            targetName: "Iron Man",
                            targetId: "ironman",
                            targetImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                            relationType: "mentor",
                            description: "Tony Stark mentored Peter in the MCU",
                            strength: 8
                        },
                        {
                            targetName: "Avengers",
                            targetId: "avengers",
                            targetImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                            relationType: "teammate",
                            description: "Member of Earth's Mightiest Heroes",
                            strength: 9
                        }
                    ]
                },
                {
                    id: "2",
                    characterName: "Batman",
                    characterId: "batman",
                    imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&h=200&fit=crop",
                    relationships: [
                        {
                            targetName: "Robin",
                            targetId: "robin",
                            targetImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                            relationType: "mentee",
                            description: "Dick Grayson, his first protégé",
                            strength: 10
                        },
                        {
                            targetName: "Joker",
                            targetId: "joker",
                            targetImageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=200&fit=crop",
                            relationType: "enemy",
                            description: "The Clown Prince of Crime, eternal rival",
                            strength: 10
                        },
                        {
                            targetName: "Catwoman",
                            targetId: "catwoman",
                            targetImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                            relationType: "love_interest",
                            description: "Selina Kyle, complicated romance",
                            strength: 8
                        },
                        {
                            targetName: "Superman",
                            targetId: "superman",
                            targetImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                            relationType: "ally",
                            description: "World's Finest partnership",
                            strength: 9
                        },
                        {
                            targetName: "Justice League",
                            targetId: "jla",
                            targetImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                            relationType: "teammate",
                            description: "Founding member and strategist",
                            strength: 9
                        }
                    ]
                },
                {
                    id: "3",
                    characterName: "Wolverine",
                    characterId: "wolverine",
                    imageUrl: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=200&h=200&fit=crop",
                    relationships: [
                        {
                            targetName: "Professor X",
                            targetId: "professorx",
                            targetImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                            relationType: "mentor",
                            description: "Charles Xavier gave him purpose and family",
                            strength: 9
                        },
                        {
                            targetName: "Sabretooth",
                            targetId: "sabretooth",
                            targetImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                            relationType: "enemy",
                            description: "Victor Creed, lifelong rival and tormentor",
                            strength: 10
                        },
                        {
                            targetName: "Jean Grey",
                            targetId: "jeangrey",
                            targetImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                            relationType: "love_interest",
                            description: "Unrequited love across timelines",
                            strength: 7
                        },
                        {
                            targetName: "X-Men",
                            targetId: "xmen",
                            targetImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                            relationType: "teammate",
                            description: "The family he never had",
                            strength: 10
                        }
                    ]
                },
                {
                    id: "4",
                    characterName: "Wonder Woman",
                    characterId: "wonderwoman",
                    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                    relationships: [
                        {
                            targetName: "Steve Trevor",
                            targetId: "stevetrevor",
                            targetImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                            relationType: "love_interest",
                            description: "The man who showed her humanity",
                            strength: 9
                        },
                        {
                            targetName: "Ares",
                            targetId: "ares",
                            targetImageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=200&fit=crop",
                            relationType: "enemy",
                            description: "God of War, eternal adversary",
                            strength: 8
                        },
                        {
                            targetName: "Superman",
                            targetId: "superman",
                            targetImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                            relationType: "ally",
                            description: "Mutual respect and friendship",
                            strength: 8
                        },
                        {
                            targetName: "Justice League",
                            targetId: "jla",
                            targetImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                            relationType: "teammate",
                            description: "Ambassador and warrior",
                            strength: 9
                        }
                    ]
                },
                {
                    id: "5",
                    characterName: "Captain America",
                    characterId: "captainamerica",
                    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                    relationships: [
                        {
                            targetName: "Bucky Barnes",
                            targetId: "bucky",
                            targetImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                            relationType: "ally",
                            description: "Best friend since childhood, Winter Soldier",
                            strength: 10
                        },
                        {
                            targetName: "Red Skull",
                            targetId: "redskull",
                            targetImageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=200&fit=crop",
                            relationType: "enemy",
                            description: "Nazi archnemesis from WWII",
                            strength: 10
                        },
                        {
                            targetName: "Peggy Carter",
                            targetId: "peggy",
                            targetImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                            relationType: "love_interest",
                            description: "The love he lost to time",
                            strength: 10
                        },
                        {
                            targetName: "Iron Man",
                            targetId: "ironman",
                            targetImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
                            relationType: "ally",
                            description: "Avengers co-leader, complex friendship",
                            strength: 7
                        },
                        {
                            targetName: "Avengers",
                            targetId: "avengers",
                            targetImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                            relationType: "teammate",
                            description: "Leader and moral compass",
                            strength: 10
                        }
                    ]
                }
            ];
            res.json(sampleRelationships.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching relationship web:', error);
            res.status(500).json({ error: "Failed to fetch relationship web" });
        }
    });
    // Creator Collaborations - Famous creative teams
    app.get("/api/creators/collaborations", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 6;
            // Sample seed data showcasing legendary creative partnerships
            const sampleCollaborations = [
                {
                    id: "1",
                    teamName: "The Architects of Marvel",
                    creator1: {
                        name: "Stan Lee",
                        role: "Writer/Editor",
                        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    },
                    creator2: {
                        name: "Jack Kirby",
                        role: "Artist",
                        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"
                    },
                    notableWorks: [
                        {
                            title: "Fantastic Four #1",
                            publisher: "Marvel",
                            year: "1961",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        },
                        {
                            title: "X-Men #1",
                            publisher: "Marvel",
                            year: "1963",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Avengers #1",
                            publisher: "Marvel",
                            year: "1963",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        }
                    ],
                    runsCount: 15,
                    issuesCount: 487,
                    legacy: "Created the Marvel Universe foundation",
                    impact: "Highest valued collaborations in comic history"
                },
                {
                    id: "2",
                    teamName: "The Uncanny X-Men Masterminds",
                    creator1: {
                        name: "Chris Claremont",
                        role: "Writer",
                        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                    },
                    creator2: {
                        name: "John Byrne",
                        role: "Artist",
                        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
                    },
                    notableWorks: [
                        {
                            title: "Uncanny X-Men #137",
                            publisher: "Marvel",
                            year: "1980",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Days of Future Past",
                            publisher: "Marvel",
                            year: "1981",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Dark Phoenix Saga",
                            publisher: "Marvel",
                            year: "1980",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        }
                    ],
                    runsCount: 8,
                    issuesCount: 142,
                    legacy: "Defined modern mutant mythology",
                    impact: "Dark Phoenix keys consistently 5-figure values"
                },
                {
                    id: "3",
                    teamName: "The Watchmen Duo",
                    creator1: {
                        name: "Alan Moore",
                        role: "Writer",
                        imageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=100&h=100&fit=crop"
                    },
                    creator2: {
                        name: "Dave Gibbons",
                        role: "Artist",
                        imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=100&h=100&fit=crop"
                    },
                    notableWorks: [
                        {
                            title: "Watchmen #1",
                            publisher: "DC Comics",
                            year: "1986",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Watchmen #12",
                            publisher: "DC Comics",
                            year: "1987",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Watchmen Limited Series",
                            publisher: "DC Comics",
                            year: "1986-87",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        }
                    ],
                    runsCount: 1,
                    issuesCount: 12,
                    legacy: "Deconstructed superhero genre forever",
                    impact: "Single run valued over $10K in high grade"
                },
                {
                    id: "4",
                    teamName: "The New X-Men Architects",
                    creator1: {
                        name: "Grant Morrison",
                        role: "Writer",
                        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"
                    },
                    creator2: {
                        name: "Frank Quitely",
                        role: "Artist",
                        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    },
                    notableWorks: [
                        {
                            title: "New X-Men #114",
                            publisher: "Marvel",
                            year: "2001",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        },
                        {
                            title: "All-Star Superman",
                            publisher: "DC Comics",
                            year: "2005",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        },
                        {
                            title: "We3",
                            publisher: "Vertigo",
                            year: "2004",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        }
                    ],
                    runsCount: 5,
                    issuesCount: 87,
                    legacy: "Revitalized X-Men for modern era",
                    impact: "New X-Men run trending 15-20% annually"
                },
                {
                    id: "5",
                    teamName: "The Dark Knight Masters",
                    creator1: {
                        name: "Frank Miller",
                        role: "Writer/Artist",
                        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                    },
                    creator2: {
                        name: "Klaus Janson",
                        role: "Inker",
                        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
                    },
                    notableWorks: [
                        {
                            title: "Dark Knight Returns #1",
                            publisher: "DC Comics",
                            year: "1986",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Daredevil: Born Again",
                            publisher: "Marvel",
                            year: "1986",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Batman: Year One",
                            publisher: "DC Comics",
                            year: "1987",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        }
                    ],
                    runsCount: 6,
                    issuesCount: 54,
                    legacy: "Redefined Batman as dark knight",
                    impact: "DKR #1 CGC 9.8 consistently $2K+"
                },
                {
                    id: "6",
                    teamName: "The Ultimate Spider-Man Creators",
                    creator1: {
                        name: "Brian Michael Bendis",
                        role: "Writer",
                        imageUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=100&h=100&fit=crop"
                    },
                    creator2: {
                        name: "Mark Bagley",
                        role: "Artist",
                        imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=100&h=100&fit=crop"
                    },
                    notableWorks: [
                        {
                            title: "Ultimate Spider-Man #1",
                            publisher: "Marvel",
                            year: "2000",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Ultimate Spider-Man #13",
                            publisher: "Marvel",
                            year: "2001",
                            coverUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=150&h=225&fit=crop"
                        },
                        {
                            title: "Ultimate Spider-Man #160",
                            publisher: "Marvel",
                            year: "2011",
                            coverUrl: "https://images.unsplash.com/photo-1608889825652-5b19d1e50b07?w=150&h=225&fit=crop"
                        }
                    ],
                    runsCount: 3,
                    issuesCount: 160,
                    legacy: "Longest creative partnership on one title",
                    impact: "Created Miles Morales, modern speculation driver"
                }
            ];
            res.json(sampleCollaborations.slice(0, limit));
        }
        catch (error) {
            console.error('Error fetching creator collaborations:', error);
            res.status(500).json({ error: "Failed to fetch creator collaborations" });
        }
    });
    app.post("/api/assets", async (req, res) => {
        try {
            const validatedData = schema_1.insertAssetSchema.parse(req.body);
            const asset = await storage_1.storage.createAsset(validatedData);
            res.status(201).json(asset);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid asset data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create asset" });
        }
    });
    app.patch("/api/assets/:id", async (req, res) => {
        try {
            const updateData = schema_1.insertAssetSchema.partial().parse(req.body);
            const asset = await storage_1.storage.updateAsset(req.params.id, updateData);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            res.json(asset);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid asset data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to update asset" });
        }
    });
    app.delete("/api/assets/:id", async (req, res) => {
        try {
            const deleted = await storage_1.storage.deleteAsset(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Asset not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete asset" });
        }
    });
    // Market Data Routes (OHLC time-series)
    app.get("/api/market-data/latest", async (req, res) => {
        try {
            const timeframe = req.query.timeframe || '1d';
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            // Get all assets first
            const assets = await storage_1.storage.getAssets({});
            const assetIds = assets.map(a => a.id).slice(0, limit);
            // Get latest market data for each asset
            const marketDataPromises = assetIds.map(assetId => storage_1.storage.getLatestMarketData(assetId, timeframe));
            const marketDataResults = await Promise.all(marketDataPromises);
            // Filter out nulls and add symbol from asset
            const enrichedData = marketDataResults
                .filter(data => data !== null)
                .map((data, index) => {
                const asset = assets.find(a => a.id === assetIds[index]);
                return {
                    ...data,
                    symbol: asset?.symbol || 'UNKNOWN'
                };
            });
            res.json(enrichedData);
        }
        catch (error) {
            console.error("Failed to fetch latest market data:", error);
            res.status(500).json({ error: "Failed to fetch market data" });
        }
    });
    app.get("/api/market-data/:assetId/latest", async (req, res) => {
        try {
            const timeframe = req.query.timeframe || '1d';
            const marketData = await storage_1.storage.getLatestMarketData(req.params.assetId, timeframe);
            if (!marketData) {
                return res.status(404).json({ error: "No market data found" });
            }
            res.json(marketData);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market data" });
        }
    });
    app.get("/api/market-data/:assetId/history", async (req, res) => {
        try {
            const timeframe = req.query.timeframe;
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const from = req.query.from ? new Date(req.query.from) : undefined;
            const to = req.query.to ? new Date(req.query.to) : undefined;
            if (!timeframe) {
                return res.status(400).json({ error: "Timeframe parameter is required" });
            }
            const history = await storage_1.storage.getMarketDataHistory(req.params.assetId, timeframe, limit, from, to);
            res.json(history);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market data history" });
        }
    });
    app.post("/api/market-data", async (req, res) => {
        try {
            const validatedData = schema_1.insertMarketDataSchema.parse(req.body);
            const marketData = await storage_1.storage.createMarketData(validatedData);
            res.status(201).json(marketData);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid market data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create market data" });
        }
    });
    app.post("/api/market-data/bulk", async (req, res) => {
        try {
            const assetIds = zod_1.z.array(zod_1.z.string()).parse(req.body.assetIds);
            const timeframe = req.body.timeframe || '1d';
            const marketData = await storage_1.storage.getBulkLatestMarketData(assetIds, timeframe);
            res.json(marketData);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid request data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to fetch bulk market data" });
        }
    });
    // Trading Terminal API Endpoints
    app.get("/api/market/orderbook/:symbol", async (req, res) => {
        try {
            const symbol = req.params.symbol;
            const asset = await storage_1.storage.getAssetBySymbol(symbol);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            const currentPrice = await storage_1.storage.getAssetCurrentPrice(asset.id);
            if (!currentPrice) {
                return res.status(404).json({ error: "No price data found" });
            }
            // Generate simulated order book data
            const price = parseFloat(currentPrice.currentPrice);
            const spread = price * 0.002; // 0.2% spread
            const bids = [];
            const asks = [];
            // Generate bid orders (below current price)
            for (let i = 0; i < 20; i++) {
                const bidPrice = price - spread / 2 - (i * price * 0.001);
                const quantity = Math.floor(Math.random() * 1000) + 100;
                bids.push({
                    price: bidPrice,
                    quantity: quantity,
                    total: bidPrice * quantity
                });
            }
            // Generate ask orders (above current price)
            for (let i = 0; i < 20; i++) {
                const askPrice = price + spread / 2 + (i * price * 0.001);
                const quantity = Math.floor(Math.random() * 1000) + 100;
                asks.push({
                    price: askPrice,
                    quantity: quantity,
                    total: askPrice * quantity
                });
            }
            res.json({
                symbol,
                timestamp: new Date().toISOString(),
                spread: spread,
                spreadPercent: (spread / price) * 100,
                bids: bids,
                asks: asks
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch order book" });
        }
    });
    app.get("/api/market/trades/:symbol", async (req, res) => {
        try {
            const symbol = req.params.symbol;
            const limit = parseInt(req.query.limit) || 50;
            const asset = await storage_1.storage.getAssetBySymbol(symbol);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            const currentPrice = await storage_1.storage.getAssetCurrentPrice(asset.id);
            if (!currentPrice) {
                return res.status(404).json({ error: "No price data found" });
            }
            // Generate simulated recent trades
            const price = parseFloat(currentPrice.currentPrice);
            const trades = [];
            const now = new Date();
            for (let i = 0; i < limit; i++) {
                const tradeTime = new Date(now.getTime() - (i * 30000)); // 30 seconds apart
                const tradePrice = price * (0.99 + Math.random() * 0.02); // ±1% from current price
                const quantity = Math.floor(Math.random() * 500) + 50;
                const side = Math.random() > 0.5 ? 'buy' : 'sell';
                trades.push({
                    id: `trade_${asset.id}_${i}`,
                    timestamp: tradeTime.toISOString(),
                    price: tradePrice,
                    quantity: quantity,
                    side: side,
                    value: tradePrice * quantity
                });
            }
            res.json({
                symbol,
                trades: trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch trade history" });
        }
    });
    app.get("/api/market/depth/:symbol", async (req, res) => {
        try {
            const symbol = req.params.symbol;
            const levels = parseInt(req.query.levels) || 10;
            const asset = await storage_1.storage.getAssetBySymbol(symbol);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            const currentPrice = await storage_1.storage.getAssetCurrentPrice(asset.id);
            if (!currentPrice) {
                return res.status(404).json({ error: "No price data found" });
            }
            const price = parseFloat(currentPrice.currentPrice);
            const spread = price * 0.002;
            // Generate market depth data with cumulative quantities
            const bidDepth = [];
            const askDepth = [];
            let cumulativeBidQty = 0;
            let cumulativeAskQty = 0;
            for (let i = 0; i < levels; i++) {
                // Bid depth
                const bidPrice = price - spread / 2 - (i * price * 0.001);
                const bidQty = Math.floor(Math.random() * 1000) + 200;
                cumulativeBidQty += bidQty;
                bidDepth.push({
                    price: bidPrice,
                    quantity: bidQty,
                    cumulative: cumulativeBidQty,
                    total: bidPrice * cumulativeBidQty
                });
                // Ask depth
                const askPrice = price + spread / 2 + (i * price * 0.001);
                const askQty = Math.floor(Math.random() * 1000) + 200;
                cumulativeAskQty += askQty;
                askDepth.push({
                    price: askPrice,
                    quantity: askQty,
                    cumulative: cumulativeAskQty,
                    total: askPrice * cumulativeAskQty
                });
            }
            res.json({
                symbol,
                timestamp: new Date().toISOString(),
                bidDepth: bidDepth,
                askDepth: askDepth,
                totalBidVolume: cumulativeBidQty,
                totalAskVolume: cumulativeAskQty
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market depth" });
        }
    });
    app.get("/api/analytics/performance", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const portfolios = await storage_1.storage.getUserPortfolios(userId);
            if (!portfolios || portfolios.length === 0) {
                return res.json({
                    totalValue: 0,
                    totalReturn: 0,
                    totalReturnPercent: 0,
                    dayChange: 0,
                    dayChangePercent: 0,
                    sharpeRatio: 0,
                    maxDrawdown: 0,
                    winRate: 0,
                    profitFactor: 0
                });
            }
            const portfolio = portfolios[0];
            const holdings = await storage_1.storage.getPortfolioHoldings(portfolio.id);
            // Calculate basic performance metrics
            const totalValue = parseFloat(portfolio.totalValue || '0');
            const initialValue = parseFloat(portfolio.initialValue || '100000'); // Default starting balance
            const totalReturn = totalValue - initialValue;
            const totalReturnPercent = initialValue > 0 ? (totalReturn / initialValue) * 100 : 0;
            // Simulated additional metrics (in a real system, these would be calculated from historical data)
            const dayChange = totalValue * (Math.random() * 0.02 - 0.01); // ±1% random
            const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;
            const sharpeRatio = Math.max(0, Math.random() * 2); // 0-2 random Sharpe ratio
            const maxDrawdown = Math.random() * 10; // 0-10% drawdown
            const winRate = 50 + Math.random() * 30; // 50-80% win rate
            const profitFactor = 1 + Math.random() * 1.5; // 1-2.5 profit factor
            res.json({
                totalValue,
                totalReturn,
                totalReturnPercent,
                dayChange,
                dayChangePercent,
                sharpeRatio,
                maxDrawdown,
                winRate,
                profitFactor,
                positionCount: Array.isArray(holdings) ? holdings.length : 0
            });
        }
        catch (error) {
            console.error("Error fetching performance analytics:", error);
            res.status(500).json({ error: "Failed to fetch performance data" });
        }
    });
    // Portfolio Management Routes
    app.get("/api/portfolios/user/:userId", async (req, res) => {
        try {
            const portfolios = await storage_1.storage.getUserPortfolios(req.params.userId);
            if (portfolios && portfolios.length > 0) {
                const portfolio = portfolios[0];
                // Get holdings
                const holdings = await storage_1.storage.getHoldings(portfolio.id);
                // Calculate diversity score
                let diversityScore = 0;
                if (holdings && holdings.length > 0) {
                    const totalValue = portfolio.totalValue || 0;
                    if (totalValue > 0) {
                        // Calculate Herfindahl-Hirschman Index (HHI) for diversity
                        // Lower HHI = more diverse
                        const marketShares = holdings.map(h => {
                            const holdingValue = h.quantity * (h.currentPrice || 0);
                            return Math.pow((holdingValue / totalValue) * 100, 2);
                        });
                        const hhi = marketShares.reduce((sum, share) => sum + share, 0);
                        // Convert HHI to diversity score (0-100, higher = more diverse)
                        diversityScore = Math.max(0, 100 - (hhi / 100));
                    }
                }
                res.json({
                    ...portfolio,
                    holdings,
                    diversityScore
                });
            }
            else {
                res.json(portfolios);
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch portfolios" });
        }
    });
    app.get("/api/portfolios/:id", async (req, res) => {
        try {
            const portfolio = await storage_1.storage.getPortfolio(req.params.id);
            if (!portfolio) {
                return res.status(404).json({ error: "Portfolio not found" });
            }
            res.json(portfolio);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch portfolio" });
        }
    });
    app.post("/api/portfolios", async (req, res) => {
        try {
            const validatedData = schema_1.insertPortfolioSchema.parse(req.body);
            const portfolio = await storage_1.storage.createPortfolio(validatedData);
            res.status(201).json(portfolio);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid portfolio data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create portfolio" });
        }
    });
    app.patch("/api/portfolios/:id", async (req, res) => {
        try {
            const updateData = schema_1.insertPortfolioSchema.partial().parse(req.body);
            const portfolio = await storage_1.storage.updatePortfolio(req.params.id, updateData);
            if (!portfolio) {
                return res.status(404).json({ error: "Portfolio not found" });
            }
            res.json(portfolio);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid portfolio data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to update portfolio" });
        }
    });
    app.delete("/api/portfolios/:id", async (req, res) => {
        try {
            const deleted = await storage_1.storage.deletePortfolio(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Portfolio not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete portfolio" });
        }
    });
    app.get("/api/portfolios/:id/holdings", async (req, res) => {
        try {
            const holdings = await storage_1.storage.getPortfolioHoldings(req.params.id);
            res.json(holdings);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch holdings" });
        }
    });
    app.post("/api/holdings", async (req, res) => {
        try {
            const validatedData = schema_1.insertHoldingSchema.parse(req.body);
            const holding = await storage_1.storage.createHolding(validatedData);
            res.status(201).json(holding);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid holding data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create holding" });
        }
    });
    app.patch("/api/holdings/:id", async (req, res) => {
        try {
            const updateData = schema_1.insertHoldingSchema.partial().parse(req.body);
            const holding = await storage_1.storage.updateHolding(req.params.id, updateData);
            if (!holding) {
                return res.status(404).json({ error: "Holding not found" });
            }
            res.json(holding);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid holding data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to update holding" });
        }
    });
    app.delete("/api/holdings/:id", async (req, res) => {
        try {
            const deleted = await storage_1.storage.deleteHolding(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Holding not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete holding" });
        }
    });
    // Market Insights Routes (AI-powered)
    app.get("/api/market-insights", async (req, res) => {
        try {
            const assetId = req.query.assetId;
            const category = req.query.category;
            const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined;
            const insights = await storage_1.storage.getMarketInsights({ assetId, category, isActive });
            res.json(insights);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market insights" });
        }
    });
    app.post("/api/market-insights", async (req, res) => {
        try {
            const validatedData = schema_1.insertMarketInsightSchema.parse(req.body);
            const insight = await storage_1.storage.createMarketInsight(validatedData);
            res.status(201).json(insight);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid insight data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create market insight" });
        }
    });
    // Market Indices Routes (CCIX, PPIX100, etc.)
    app.get("/api/market-indices", async (req, res) => {
        try {
            const indices = await storage_1.storage.getMarketIndices();
            res.json(indices);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market indices" });
        }
    });
    app.get("/api/market-indices/:symbol", async (req, res) => {
        try {
            const index = await storage_1.storage.getMarketIndex(req.params.symbol);
            if (!index) {
                return res.status(404).json({ error: "Market index not found" });
            }
            res.json(index);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market index" });
        }
    });
    app.get("/api/market-indices/:indexId/data/latest", async (req, res) => {
        try {
            const timeframe = req.query.timeframe || '1d';
            const indexData = await storage_1.storage.getLatestMarketIndexData(req.params.indexId, timeframe);
            if (!indexData) {
                return res.status(404).json({ error: "No index data found" });
            }
            res.json(indexData);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch index data" });
        }
    });
    app.get("/api/market-indices/:indexId/data/history", async (req, res) => {
        try {
            const timeframe = req.query.timeframe;
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const from = req.query.from ? new Date(req.query.from) : undefined;
            const to = req.query.to ? new Date(req.query.to) : undefined;
            if (!timeframe) {
                return res.status(400).json({ error: "Timeframe parameter is required" });
            }
            const history = await storage_1.storage.getMarketIndexDataHistory(req.params.indexId, timeframe, limit, from, to);
            res.json(history);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch index data history" });
        }
    });
    // Watchlist Routes
    app.get("/api/watchlists/user/:userId", async (req, res) => {
        try {
            const watchlists = await storage_1.storage.getUserWatchlists(req.params.userId);
            res.json(watchlists);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch watchlists" });
        }
    });
    app.post("/api/watchlists", async (req, res) => {
        try {
            const validatedData = schema_1.insertWatchlistSchema.parse(req.body);
            const watchlist = await storage_1.storage.createWatchlist(validatedData);
            res.status(201).json(watchlist);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid watchlist data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create watchlist" });
        }
    });
    app.delete("/api/watchlists/:id", async (req, res) => {
        try {
            const deleted = await storage_1.storage.deleteWatchlist(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Watchlist not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete watchlist" });
        }
    });
    app.get("/api/watchlists/:id/assets", async (req, res) => {
        try {
            const assets = await storage_1.storage.getWatchlistAssets(req.params.id);
            res.json(assets);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch watchlist assets" });
        }
    });
    app.post("/api/watchlists/assets", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { assetId, watchlistId, alertPrice, notes } = req.body;
            // If no watchlistId provided, use user's default watchlist
            let targetWatchlistId = watchlistId;
            if (!targetWatchlistId) {
                const userWatchlists = await storage_1.storage.getUserWatchlists(userId);
                const defaultWatchlist = userWatchlists.find(w => w.isDefault) || userWatchlists[0];
                if (!defaultWatchlist) {
                    // Create default watchlist if none exists
                    const newWatchlist = await storage_1.storage.createWatchlist({
                        userId,
                        name: "My Watchlist",
                        isDefault: true
                    });
                    targetWatchlistId = newWatchlist.id;
                }
                else {
                    targetWatchlistId = defaultWatchlist.id;
                }
            }
            const validatedData = schema_1.insertWatchlistAssetSchema.parse({
                watchlistId: targetWatchlistId,
                assetId,
                alertPrice,
                notes
            });
            await storage_1.storage.addAssetToWatchlist(validatedData);
            // Return the updated watchlist with assets
            const updatedWatchlists = await storage_1.storage.getUserWatchlists(userId);
            const updatedWatchlist = updatedWatchlists.find(w => w.id === targetWatchlistId);
            res.status(201).json({ success: true, watchlist: updatedWatchlist });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid watchlist asset data", details: error.errors });
            }
            console.error("Error adding asset to watchlist:", error);
            res.status(500).json({ error: "Failed to add asset to watchlist" });
        }
    });
    app.delete("/api/watchlists/:watchlistId/assets/:assetId", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { watchlistId, assetId } = req.params;
            // Verify the watchlist belongs to the authenticated user
            const userWatchlists = await storage_1.storage.getUserWatchlists(userId);
            const watchlist = userWatchlists.find(w => w.id === watchlistId);
            if (!watchlist) {
                return res.status(404).json({ error: "Watchlist not found or access denied" });
            }
            const removed = await storage_1.storage.removeAssetFromWatchlist(watchlistId, assetId);
            if (!removed) {
                return res.status(404).json({ error: "Asset not found in watchlist" });
            }
            // Return the updated watchlist with assets
            const updatedWatchlists = await storage_1.storage.getUserWatchlists(userId);
            const updatedWatchlist = updatedWatchlists.find(w => w.id === watchlistId);
            res.json({ success: true, watchlist: updatedWatchlist });
        }
        catch (error) {
            console.error("Error removing asset from watchlist:", error);
            res.status(500).json({ error: "Failed to remove asset from watchlist" });
        }
    });
    // Trading Routes
    app.get("/api/orders/user/:userId", async (req, res) => {
        try {
            const status = req.query.status;
            const orders = await storage_1.storage.getUserOrders(req.params.userId, status);
            res.json(orders);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch orders" });
        }
    });
    app.get("/api/orders/:id", async (req, res) => {
        try {
            const order = await storage_1.storage.getOrder(req.params.id);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch order" });
        }
    });
    app.post("/api/orders", async (req, res) => {
        try {
            const validatedData = schema_1.insertOrderSchema.parse(req.body);
            const order = await storage_1.storage.createOrder(validatedData);
            res.status(201).json(order);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid order data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create order" });
        }
    });
    app.patch("/api/orders/:id", async (req, res) => {
        try {
            const updateData = zod_1.z.object({
                status: zod_1.z.enum(['pending', 'filled', 'cancelled']).optional(),
                price: zod_1.z.string().optional(),
                totalValue: zod_1.z.string().optional()
            }).parse(req.body);
            const order = await storage_1.storage.updateOrder(req.params.id, updateData);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid order update data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to update order" });
        }
    });
    app.post("/api/orders/:id/cancel", async (req, res) => {
        try {
            const order = await storage_1.storage.cancelOrder(req.params.id);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Cannot cancel')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to cancel order" });
        }
    });
    app.delete("/api/orders/:id", async (req, res) => {
        try {
            const deleted = await storage_1.storage.deleteOrder(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete order" });
        }
    });
    // Bulk market data ingestion for historical backfill
    app.post("/api/market-data/bulk-historical", async (req, res) => {
        try {
            const dataPoints = zod_1.z.array(schema_1.insertMarketDataSchema).parse(req.body);
            const results = await storage_1.storage.createBulkMarketData(dataPoints);
            res.status(201).json({ created: results.length, data: results });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid bulk market data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create bulk market data" });
        }
    });
    // Market Events Routes
    app.get("/api/market-events", async (req, res) => {
        try {
            const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined;
            const category = req.query.category;
            const events = await storage_1.storage.getMarketEvents({ isActive, category });
            res.json(events);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market events" });
        }
    });
    // Dashboard-specific API endpoints (required for frontend integration)
    // Market overview endpoint for dashboard
    app.get("/api/market/overview", async (req, res) => {
        try {
            // Get top gainers and losers from simulation
            const assets = await storage_1.storage.getAssets({ limit: 50 });
            const currentPrices = await storage_1.storage.getAssetCurrentPrices(assets.map(a => a.id));
            // Calculate performance metrics
            const movers = currentPrices.map(price => {
                const asset = assets.find(a => a.id === price.assetId);
                return {
                    id: asset?.id,
                    symbol: asset?.symbol,
                    name: asset?.name,
                    type: asset?.type,
                    coverUrl: asset?.coverUrl,
                    currentPrice: parseFloat(price.currentPrice),
                    change: parseFloat(price.dayChange || '0'),
                    changePercent: parseFloat(price.dayChangePercent || '0'),
                    volume: price.volume24h || 0
                };
            }).filter(m => m.id);
            // Sort by performance
            const topGainers = movers
                .filter(m => m.changePercent > 0)
                .sort((a, b) => b.changePercent - a.changePercent)
                .slice(0, 5);
            const topLosers = movers
                .filter(m => m.changePercent < 0)
                .sort((a, b) => a.changePercent - b.changePercent)
                .slice(0, 5);
            res.json({
                topGainers,
                topLosers,
                totalAssets: assets.length,
                activeVolume: currentPrices.reduce((sum, p) => sum + (p.volume24h || 0), 0)
            });
        }
        catch (error) {
            console.error("Error fetching market overview:", error);
            res.status(500).json({ error: "Failed to fetch market overview" });
        }
    });
    // Market indices endpoint for dashboard
    app.get("/api/market/indices", async (req, res) => {
        try {
            const indices = await storage_1.storage.getMarketIndices();
            res.json(indices);
        }
        catch (error) {
            console.error("Error fetching market indices:", error);
            res.status(500).json({ error: "Failed to fetch market indices" });
        }
    });
    // Market events endpoint for dashboard
    app.get("/api/market/events", async (req, res) => {
        try {
            const isActive = req.query.isActive ? req.query.isActive === 'true' : true;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const events = await storage_1.storage.getMarketEvents({ isActive });
            res.json(events.slice(0, limit));
        }
        catch (error) {
            console.error("Error fetching market events:", error);
            res.status(500).json({ error: "Failed to fetch market events" });
        }
    });
    // Publisher performance endpoint for dashboard
    app.get('/api/publishers/performance', async (req, res) => {
        try {
            const publishers = await databaseStorage_1.db
                .select({
                publisher: (0, drizzle_orm_1.sql) `COALESCE(${schema_1.assets.type}, 'Unknown')`,
                assetCount: (0, drizzle_orm_1.sql) `count(distinct ${schema_1.assets.id})`,
                avgPrice: (0, drizzle_orm_1.sql) `avg(CAST(${schema_1.assetCurrentPrices.currentPrice} AS DECIMAL))`,
                totalVolume: (0, drizzle_orm_1.sql) `sum(CAST(COALESCE(${schema_1.assetCurrentPrices.volume24h}, 0) AS DECIMAL))`,
            })
                .from(schema_1.assets)
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.sql) `${schema_1.assets.type} IS NOT NULL AND ${schema_1.assets.type} != ''`)
                .groupBy((0, drizzle_orm_1.sql) `COALESCE(${schema_1.assets.type}, 'Unknown')`)
                .orderBy((0, drizzle_orm_1.sql) `count(distinct ${schema_1.assets.id}) desc`)
                .limit(6);
            const totalAssets = publishers.reduce((sum, p) => sum + Number(p.assetCount), 0);
            const publisherData = publishers.map(p => ({
                publisher: p.publisher || 'Unknown',
                marketShare: totalAssets > 0 ? (Number(p.assetCount) / totalAssets) * 100 : 0,
                percentChange: (Math.random() - 0.5) * 10, // Will be replaced with real data
                totalAssets: Number(p.assetCount),
                avgPrice: Number(p.avgPrice) || 0,
                volumeToday: Number(p.totalVolume) || 0,
            }));
            res.json(publisherData);
        }
        catch (error) {
            console.error('Error fetching publisher performance:', error);
            res.status(500).json({ error: error.message });
        }
    });
    // User watchlists endpoint for dashboard (authenticated)
    app.get("/api/watchlists", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const watchlists = await storage_1.storage.getUserWatchlists(userId);
            res.json(watchlists);
        }
        catch (error) {
            console.error("Error fetching user watchlists:", error);
            res.status(500).json({ error: "Failed to fetch watchlists" });
        }
    });
    // Portfolios endpoint for dashboard (authenticated)
    app.get("/api/portfolios", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const portfolios = await storage_1.storage.getUserPortfolios(userId);
            res.json(portfolios);
        }
        catch (error) {
            console.error("Error fetching user portfolios:", error);
            res.status(500).json({ error: "Failed to fetch portfolios" });
        }
    });
    app.post("/api/market-events", async (req, res) => {
        try {
            const validatedData = schema_1.insertMarketEventSchema.parse(req.body);
            const event = await storage_1.storage.createMarketEvent(validatedData);
            res.status(201).json(event);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid event data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create market event" });
        }
    });
    // Market Updates for live feed
    app.get("/api/market-updates", async (req, res) => {
        try {
            // Get recent market events and activities for live feed
            const recentEvents = await storage_1.storage.getMarketEvents({ isActive: true });
            // Transform market events into market updates format
            const updates = recentEvents.slice(0, 10).map(event => ({
                id: event.id,
                type: 'news-impact',
                symbol: event.title.split(' ')[0] || 'UNKNOWN',
                name: event.title,
                assetType: event.category === 'character' ? 'character' : 'comic',
                message: event.description,
                impact: event.impact,
                timestamp: event.eventDate,
                value: Math.floor(Math.random() * 4000) + 1000, // Mock for now
                change: (Math.random() - 0.5) * 10 // Mock for now
            }));
            res.json(updates);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market updates" });
        }
    });
    // Asset Growth Metrics - NEW assets tracking
    app.get("/api/growth/metrics", async (req, res) => {
        try {
            const { getAssetGrowthMetrics } = await Promise.resolve().then(() => __importStar(require('./services/assetGrowthMetrics.js')));
            const metrics = await getAssetGrowthMetrics();
            res.json(metrics);
        }
        catch (error) {
            console.error("Error fetching growth metrics:", error);
            res.status(500).json({ error: "Failed to fetch growth metrics" });
        }
    });
    // Institutional Order Flow - Live NPC trading activity
    app.get("/api/institutional/order-flow", async (req, res) => {
        try {
            const timeWindow = req.query.timeWindow ? parseInt(req.query.timeWindow) : 300; // 5 minutes default
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            // Query recent NPC trading activity
            const recentActivity = await databaseStorage_1.db
                .select({
                assetId: schema_1.npcTraderActivityLog.assetId,
                action: schema_1.npcTraderActivityLog.action,
                quantity: schema_1.npcTraderActivityLog.quantity,
                price: schema_1.npcTraderActivityLog.price,
                timestamp: schema_1.npcTraderActivityLog.timestamp,
                assetName: schema_1.assets.name,
                assetSymbol: schema_1.assets.symbol,
                assetType: schema_1.assets.type
            })
                .from(schema_1.npcTraderActivityLog)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.npcTraderActivityLog.assetId, schema_1.assets.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `${schema_1.npcTraderActivityLog.timestamp} >= NOW() - INTERVAL '${drizzle_orm_1.sql.raw(timeWindow.toString())} seconds'`, (0, drizzle_orm_1.sql) `${schema_1.npcTraderActivityLog.action} IN ('buy', 'sell')`))
                .orderBy((0, drizzle_orm_1.sql) `${schema_1.npcTraderActivityLog.timestamp} DESC`)
                .limit(500);
            // Aggregate by asset
            const assetFlow = new Map();
            for (const activity of recentActivity) {
                if (!activity.assetId)
                    continue;
                const key = activity.assetId;
                if (!assetFlow.has(key)) {
                    assetFlow.set(key, {
                        assetId: activity.assetId,
                        symbol: activity.assetSymbol || 'UNKNOWN',
                        name: activity.assetName || 'Unknown Asset',
                        type: activity.assetType || 'unknown',
                        buyVolume: 0,
                        sellVolume: 0,
                        buyOrders: 0,
                        sellOrders: 0,
                        netFlow: 0,
                        pressure: 0,
                        totalVolume: 0,
                        avgBuyPrice: 0,
                        avgSellPrice: 0,
                        lastActivity: activity.timestamp || new Date()
                    });
                }
                const flow = assetFlow.get(key);
                const qty = activity.quantity || 0;
                const price = parseFloat(activity.price || '0');
                if (activity.action === 'buy') {
                    flow.buyVolume += qty;
                    flow.buyOrders++;
                    flow.avgBuyPrice = ((flow.avgBuyPrice * (flow.buyOrders - 1)) + price) / flow.buyOrders;
                }
                else if (activity.action === 'sell') {
                    flow.sellVolume += qty;
                    flow.sellOrders++;
                    flow.avgSellPrice = ((flow.avgSellPrice * (flow.sellOrders - 1)) + price) / flow.sellOrders;
                }
                flow.totalVolume = flow.buyVolume + flow.sellVolume;
                flow.netFlow = flow.buyVolume - flow.sellVolume;
                flow.pressure = flow.totalVolume > 0
                    ? ((flow.buyVolume - flow.sellVolume) / flow.totalVolume) * 100
                    : 0;
                if (activity.timestamp > flow.lastActivity) {
                    flow.lastActivity = activity.timestamp;
                }
            }
            // Convert to array and sort by total volume
            const flowData = Array.from(assetFlow.values())
                .sort((a, b) => b.totalVolume - a.totalVolume)
                .slice(0, limit);
            res.json({
                timeWindow,
                totalAssets: flowData.length,
                totalActivity: recentActivity.length,
                data: flowData
            });
        }
        catch (error) {
            console.error("Error fetching institutional order flow:", error);
            res.status(500).json({ error: "Failed to fetch order flow data" });
        }
    });
    // Market Insights Routes
    app.get("/api/market-insights", async (req, res) => {
        try {
            const insights = await storage_1.storage.getMarketInsights();
            res.json(insights);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch market insights" });
        }
    });
    app.post("/api/market-insights", async (req, res) => {
        try {
            const validatedData = schema_1.insertMarketInsightSchema.parse(req.body);
            const insight = await storage_1.storage.createMarketInsight(validatedData);
            res.status(201).json(insight);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid insight data", details: error.errors });
            }
            res.status(500).json({ error: "Failed to create market insight" });
        }
    });
    // Comic Data Routes
    app.use("/api/comic-data", comicData_js_1.default);
    // Register new comic routes for real data integration
    (0, comicRoutes_1.registerComicRoutes)(app);
    // Register comic cover routes for cover display
    (0, comicCoverRoutes_js_1.registerComicCoverRoutes)(app);
    // Register notification routes for real-time notification system
    (0, notificationRoutes_js_1.registerNotificationRoutes)(app);
    // Collector-Grade Asset Display Routes
    app.use("/api/collector", collectorRoutes_js_1.default);
    // Comic Asset Data Service Routes - Visual Trading Experience
    const { comicAssetService } = await Promise.resolve().then(() => __importStar(require('./services/comicAssetService.js')));
    app.get("/api/comic-assets/top", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const assets = await comicAssetService.getTopComicAssets(limit);
            res.json(assets);
        }
        catch (error) {
            console.error('Failed to fetch top comic assets:', error);
            res.status(500).json({ error: "Failed to fetch comic assets" });
        }
    });
    app.get("/api/comic-assets/:id/history", async (req, res) => {
        try {
            const days = parseInt(req.query.days) || 30;
            const history = await comicAssetService.getComicPriceHistory(req.params.id, days);
            if (!history) {
                return res.status(404).json({ error: "Asset not found" });
            }
            res.json(history);
        }
        catch (error) {
            console.error('Failed to fetch price history:', error);
            res.status(500).json({ error: "Failed to fetch price history" });
        }
    });
    app.get("/api/comic-assets/heatmap", async (req, res) => {
        try {
            const heatmap = await comicAssetService.getComicHeatMap();
            res.json(heatmap);
        }
        catch (error) {
            console.error('Failed to fetch heatmap:', error);
            res.status(500).json({ error: "Failed to fetch heatmap data" });
        }
    });
    // RSS News Feed Routes - Real Comic Book News
    const { rssFeedService } = await Promise.resolve().then(() => __importStar(require('./services/rssFeedService.js')));
    app.get("/api/news/rss", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const news = await rssFeedService.getLatestNews(limit);
            res.json(news);
        }
        catch (error) {
            console.error('Failed to fetch RSS news:', error);
            res.status(500).json({ error: "Failed to fetch news" });
        }
    });
    // AI Market Intelligence Routes
    const aiRoutes = (await Promise.resolve().then(() => __importStar(require('./routes/aiRoutes.js')))).default;
    app.use("/api/ai", aiRoutes);
    // Enhanced AI Market Intelligence Routes (Advanced Oracle System)
    app.use("/api/ai", enhancedAiRoutes_js_1.default);
    // Vector-Powered AI Routes (pgvector enhanced features)
    app.use("/api/vectors", vectorRoutes_js_1.default);
    // Data import routes (Marvel vs DC dataset)
    app.use("/api/import", dataImportRoutes_js_1.default);
    // Pinecone vector search routes
    app.use("/api/pinecone", pinecone_js_1.default);
    // Comic Vine API disabled - service no longer available
    //   // Comic Vine API expansion routes
    //   app.use("/api/comicvine", comicVineRoutes);
    // Marvel API expansion routes
    app.use("/api/marvel", marvelRoutes_js_1.default);
    // Cover Orchestrator API - central service for querying comic covers
    app.use("/api/covers", coverRoutes_js_1.default);
    // DC multi-source expansion routes (Metron + GCD)
    app.use("/api/dc", dcRoutes_js_1.default);
    // Kaggle Comics expansion routes (Marvel + DC datasets)
    app.use("/api/kaggle-comics", kaggleComicsRoutes_js_1.default);
    // Character Attributes enhancement routes (Superheroes NLP dataset)
    app.use("/api/character-attributes", characterAttributesRoutes_js_1.default);
    // Dataset expansion routes (Pokemon, Funko, Manga, Movies)
    app.use("/api/datasets", datasetExpansionRoutes_js_1.default);
    // Advanced analytics routes (Quantum Momentum, Whale Tracker, etc.)
    app.use("/api/analytics", analyticsRoutes_js_1.default);
    // Symbol Generation routes
    app.use("/api/symbols", symbolGeneration_js_1.default);
    // YouTube Video Content - ComicGirl19 & NerdSync
    app.use("/api/youtube", youtube_js_1.default);
    // ================================
    // EXTERNAL SCRAPER ROUTES
    // Expand asset database from external comic book APIs
    // ================================
    // Superhero API expansion routes
    const { SuperheroApiExpansionService } = await Promise.resolve().then(() => __importStar(require('./services/superheroApiExpansion.js')));
    app.post("/api/scrapers/superhero/expand-all", async (req, res) => {
        try {
            console.log('🦸 Starting Superhero API full expansion...');
            const results = await SuperheroApiExpansionService.expandAll();
            res.json({
                success: true,
                message: `Superhero API expansion complete`,
                ...results
            });
        }
        catch (error) {
            console.error('Superhero API expansion failed:', error);
            res.status(500).json({ error: "Failed to expand from Superhero API" });
        }
    });
    app.get("/api/scrapers/superhero/search/:name", async (req, res) => {
        try {
            const results = await SuperheroApiExpansionService.searchCharacter(req.params.name);
            res.json(results);
        }
        catch (error) {
            console.error('Superhero API search failed:', error);
            res.status(500).json({ error: "Failed to search Superhero API" });
        }
    });
    app.get("/api/scrapers/superhero/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const character = await SuperheroApiExpansionService.fetchCharacterById(id);
            if (!character) {
                return res.status(404).json({ error: "Character not found" });
            }
            res.json(character);
        }
        catch (error) {
            console.error('Superhero API fetch failed:', error);
            res.status(500).json({ error: "Failed to fetch character" });
        }
    });
    // Metron DB expansion routes (Python wrapper)
    const { exec } = await Promise.resolve().then(() => __importStar(require('child_process')));
    const { promisify } = await Promise.resolve().then(() => __importStar(require('util')));
    const execAsync = promisify(exec);
    app.post("/api/scrapers/metron/recent", async (req, res) => {
        try {
            const days = req.body.days || 7;
            console.log(`📖 Fetching Metron issues from past ${days} days...`);
            const { stdout, stderr } = await execAsync(`python3 server/services/metronExpansion.py recent ${days}`);
            if (stderr && !stderr.includes('WARNING')) {
                console.error('Metron stderr:', stderr);
            }
            const issues = JSON.parse(stdout);
            res.json({
                success: true,
                count: issues.length,
                issues
            });
        }
        catch (error) {
            console.error('Metron expansion failed:', error);
            res.status(500).json({ error: "Failed to fetch from Metron DB" });
        }
    });
    app.get("/api/scrapers/metron/series/:name", async (req, res) => {
        try {
            console.log(`📖 Fetching Metron series: ${req.params.name}`);
            const { stdout, stderr } = await execAsync(`python3 server/services/metronExpansion.py series "${req.params.name}"`);
            if (stderr && !stderr.includes('WARNING')) {
                console.error('Metron stderr:', stderr);
            }
            const series = JSON.parse(stdout);
            if (!series) {
                return res.status(404).json({ error: "Series not found" });
            }
            res.json(series);
        }
        catch (error) {
            console.error('Metron series fetch failed:', error);
            res.status(500).json({ error: "Failed to fetch series" });
        }
    });
    // Grand Comic Database expansion routes
    const { GcdExpansionService } = await Promise.resolve().then(() => __importStar(require('./services/gcdExpansion.js')));
    app.post("/api/scrapers/gcd/process-dump", async (req, res) => {
        try {
            const dumpPath = req.body.dumpPath;
            console.log('📚 Processing GCD database dump...');
            const results = await GcdExpansionService.processDump(dumpPath);
            res.json({
                success: true,
                message: 'GCD dump processing complete',
                ...results
            });
        }
        catch (error) {
            console.error('GCD processing failed:', error);
            res.status(500).json({ error: "Failed to process GCD dump" });
        }
    });
    app.get("/api/scrapers/gcd/setup", async (req, res) => {
        const instructions = GcdExpansionService.getSetupInstructions();
        res.json({
            instructions,
            dumpUrl: 'https://www.comics.org/download/',
            license: 'CC BY-SA 4.0',
            attribution: 'Grand Comics Database™'
        });
    });
    // Scraper status endpoint
    app.get("/api/scrapers/status", async (req, res) => {
        const superheroToken = process.env.SUPERHERO_API_TOKEN ? '✅ Configured' : '❌ Missing';
        const metronUsername = process.env.METRON_USERNAME ? '✅ Configured' : '❌ Missing';
        const metronPassword = process.env.METRON_PASSWORD ? '✅ Configured' : '❌ Missing';
        const gcdPath = process.env.GCD_DUMP_PATH ? '✅ Configured' : '⚠️  Optional';
        res.json({
            scrapers: {
                superhero_api: {
                    status: superheroToken,
                    endpoint: 'https://superheroapi.com',
                    expansion_route: '/api/scrapers/superhero/expand-all',
                    coverage: '~731 characters (Marvel, DC, and more)'
                },
                metron_db: {
                    status: metronUsername === '✅ Configured' && metronPassword === '✅ Configured' ? '✅ Configured' : '❌ Incomplete',
                    endpoint: 'https://metron.cloud',
                    expansion_route: '/api/scrapers/metron/recent',
                    coverage: 'Community-driven comic database with REST API',
                    rate_limit: '30 req/min, 10K req/day'
                },
                grand_comic_database: {
                    status: gcdPath,
                    endpoint: 'https://www.comics.org',
                    expansion_route: '/api/scrapers/gcd/process-dump',
                    coverage: 'Comprehensive comic database (requires manual dump download)',
                    license: 'CC BY-SA 4.0'
                }
            },
            total_assets: (await storage_1.storage.getAssets()).length,
            setup_urls: {
                superhero_api: 'https://www.superheroapi.com/',
                metron_db: 'https://metron.cloud/',
                gcd: 'https://www.comics.org/download/'
            }
        });
    });
    // Houses System Routes (Seven Mythological Houses)
    app.use("/api/houses", housesRoutes_js_1.default);
    app.use(sevenHousesRoutes_js_1.default);
    app.use("/api/karma", karmaRoutes_js_1.default);
    // Sacred Learning System Routes (Mythological Education RPG)
    app.use("/api/learning", learningRoutes_js_1.default);
    // External Integrations Routes (Divine Connections Chamber) - Phase 8
    app.use("/api/integrations", replitAuth_1.isAuthenticated, integrations_js_1.default);
    // Phase 1: Core Trading Foundation Routes
    app.use("/api/phase1", replitAuth_1.isAuthenticated, phase1Routes_js_1.default);
    // Phase 1: Trading Routes
    app.use("/api/trading", replitAuth_1.isAuthenticated, tradingRoutes_js_1.default);
    // Shadow Economy Routes (requires corruption > 30)
    app.use("/api/shadow", shadowRoutes_js_1.default);
    // Noir Journal Routes
    app.use("/api/journal", journalRoutes_js_1.default);
    // Social Warfare Routes - predatory trading mechanics
    app.use(warfareRoutes_js_1.default);
    // Phase 1: Initialization Route
    app.post("/api/phase1/initialize", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { Phase1Initializer } = await Promise.resolve().then(() => __importStar(require('./phase1Initialization.js')));
            const result = await Phase1Initializer.initializeAllSystems();
            res.json(result);
        }
        catch (error) {
            console.error('Error initializing Phase 1:', error);
            res.status(500).json({ error: 'Failed to initialize Phase 1 systems' });
        }
    });
    // Phase 1: Status Route
    app.get("/api/phase1/status", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { Phase1Initializer } = await Promise.resolve().then(() => __importStar(require('./phase1Initialization.js')));
            const status = await Phase1Initializer.getInitializationStatus();
            const isInitialized = await Phase1Initializer.isPhase1Initialized();
            res.json({ ...status, isInitialized });
        }
        catch (error) {
            console.error('Error getting Phase 1 status:', error);
            res.status(500).json({ error: 'Failed to get Phase 1 status' });
        }
    });
    // Enhanced Trading Data Routes (Phase 3 Mythological Interface)
    app.use("/api", enhancedDataRoutes_js_1.default);
    // Visual Storytelling Routes (Phase 2 Narrative Systems)
    app.use("/api/storytelling", visualStorytellingRoutes_js_1.default);
    // Art-Driven Progression System Routes (Phase 3 Comic Collection Mechanics)
    app.use("/api/progression", replitAuth_1.isAuthenticated, progressionRoutes_js_1.default);
    // Story-Driven Market Visualization Routes (Phase 3)
    (0, storyMarketRoutes_js_1.registerStoryMarketRoutes)(app, storage_1.storage);
    // PPIx Index Routes (Comic Book Market Indices) - SCHOLARLY INVESTMENT FRAMEWORK
    app.get("/api/ppix/indices", async (req, res) => {
        console.log('🎓 PPIx indices endpoint called! [SCHOLARLY FRAMEWORK]');
        try {
            console.log('🎓 Applying 20 Art Investment Metrics to comic book assets...');
            const { scholarlyPPIxService } = await Promise.resolve().then(() => __importStar(require('./services/scholarlyPPIxService.js')));
            // Calculate indices using scholarly investment framework
            const ppix50 = scholarlyPPIxService.calculateScholarlyPPIx50();
            const ppix100 = scholarlyPPIxService.calculateScholarlyPPIx100();
            // Generate comparison data
            const comparison = {
                correlation: 0.76,
                ppix50Performance: {
                    day: ppix50.dayChangePercent,
                    week: -0.73,
                    month: 4.32,
                    year: 18.75
                },
                ppix100Performance: {
                    day: ppix100.dayChangePercent,
                    week: 4.87,
                    month: 8.91,
                    year: 24.33
                }
            };
            console.log(`🎓 Scholarly PPIx calculation complete! PPIx 50: ${ppix50.constituents.length} assets, PPIx 100: ${ppix100.constituents.length} assets`);
            res.json({
                success: true,
                indices: {
                    ppix50: {
                        ...ppix50,
                        methodology: ppix50.methodology
                    },
                    ppix100: {
                        ...ppix100,
                        methodology: ppix100.methodology
                    }
                },
                comparison,
                lastUpdated: new Date().toISOString(),
                framework: {
                    name: "20 Art Investment Metrics for Comic Books",
                    basis: ppix50.academicBasis,
                    selectionCriteria: {
                        ppix50: ppix50.selectionCriteria,
                        ppix100: ppix100.selectionCriteria
                    }
                }
            });
        }
        catch (error) {
            console.error('🎓 ERROR calculating scholarly PPIx indices:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to calculate scholarly indices',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    app.get("/api/ppix/:indexType", async (req, res) => {
        try {
            const indexType = req.params.indexType;
            if (!['ppix50', 'ppix100'].includes(indexType)) {
                return res.status(400).json({ error: 'Invalid index type. Use ppix50 or ppix100' });
            }
            const { marketPricingService } = await Promise.resolve().then(() => __importStar(require('./services/marketPricingService.js')));
            // Generate sample assets for faster calculation
            console.log(`Generating ${indexType} with sample data...`);
            const assets = await marketPricingService.generateTradingAssetsWithPricing(30);
            if (!assets || assets.length === 0) {
                throw new Error('No trading assets available');
            }
            const { ppixIndexService } = await Promise.resolve().then(() => __importStar(require('./services/ppixIndexService.js')));
            // Calculate specific index
            const indexData = indexType === 'ppix50'
                ? await ppixIndexService.calculatePPIx50(assets)
                : await ppixIndexService.calculatePPIx100(assets);
            res.json({
                success: true,
                index: {
                    ...indexData,
                    type: indexType,
                    methodology: ppixIndexService.getIndexMethodology(indexType)
                },
                lastUpdated: new Date().toISOString()
            });
        }
        catch (error) {
            console.error(`Error calculating ${req.params.indexType}:`, error);
            res.status(500).json({
                success: false,
                error: `Failed to calculate ${req.params.indexType}`,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    // Subscription Management Routes
    app.get("/api/subscription/tiers", async (req, res) => {
        try {
            const { tierFeatures } = await Promise.resolve().then(() => __importStar(require('./services/subscriptionService.js')));
            res.json({
                success: true,
                tiers: {
                    free: {
                        name: 'Comic Curious',
                        price: 0,
                        features: tierFeatures.free,
                        description: 'Perfect for comic enthusiasts getting started'
                    },
                    pro: {
                        name: 'Serious Collector',
                        price: 29,
                        features: tierFeatures.pro,
                        description: 'Advanced tools for dedicated collectors'
                    },
                    elite: {
                        name: 'Investment Powerhouse',
                        price: 99,
                        features: tierFeatures.elite,
                        description: 'Complete suite for professional investors'
                    }
                }
            });
        }
        catch (error) {
            console.error('Error fetching subscription tiers:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch subscription tiers'
            });
        }
    });
    app.get("/api/subscription/user/:userId/access/:feature", async (req, res) => {
        try {
            const { userId, feature } = req.params;
            // Get user from storage (mock for now - you'll implement this)
            const user = await storage_1.storage.getUser?.(userId) || {
                id: userId,
                email: 'demo@example.com',
                firstName: 'Demo',
                lastName: 'User',
                profileImageUrl: null,
                subscriptionTier: 'free',
                subscriptionStatus: 'active',
                subscriptionStartDate: null,
                subscriptionEndDate: null,
                stripeCustomerId: null,
                monthlyTradingCredits: 0,
                usedTradingCredits: 0,
                competitionWins: 0,
                competitionRanking: null,
                preferences: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const { SubscriptionService } = await Promise.resolve().then(() => __importStar(require('./services/subscriptionService.js')));
            const hasAccess = SubscriptionService.hasFeatureAccess(user, feature);
            const remainingCredits = SubscriptionService.getRemainingCredits(user);
            let upgradeRecommendation = null;
            if (!hasAccess) {
                upgradeRecommendation = SubscriptionService.getUpgradeRecommendations(user, feature);
            }
            res.json({
                success: true,
                hasAccess,
                currentTier: user.subscriptionTier,
                remainingCredits,
                upgradeRecommendation,
                featureGateMessage: !hasAccess ?
                    SubscriptionService.getFeatureGateMessage(feature, upgradeRecommendation?.recommendedTier || 'pro') :
                    null
            });
        }
        catch (error) {
            console.error('Error checking feature access:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to check feature access'
            });
        }
    });
    // Comic Grading Analysis Route (OpenAI Vision API)
    app.post("/api/grading/analyze", async (req, res) => {
        try {
            const { imageData, imageName, userId } = req.body;
            if (!imageData) {
                return res.status(400).json({ error: "Image data is required" });
            }
            // Check if OpenAI API key is configured
            if (!process.env.OPENAI_API_KEY) {
                return res.status(500).json({
                    error: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
                });
            }
            const startTime = Date.now();
            // Initialize OpenAI
            const OpenAI = require('openai');
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            // Create detailed comic grading prompt
            const gradingPrompt = `You are a professional comic book grader with expertise in CGC (Certified Guaranty Company) standards. Analyze this comic book image and provide a detailed grading assessment.

Please analyze the following aspects and provide your assessment in JSON format:

1. **Overall Grade**: Provide a numerical grade on the 0.5-10.0 CGC scale
2. **Grade Category**: Classify as one of: "Poor", "Fair", "Good", "Very Good", "Fine", "Very Fine", "Near Mint", "Mint"
3. **Condition Factors**: Assess each factor on a scale of 1-10:
   - corners: Corner wear and damage
   - spine: Spine condition and stress marks
   - pages: Page quality, yellowing, brittleness
   - colors: Color vibrancy and fading
   - cover: Overall cover condition
   - creases: Presence of creases and folds
   - tears: Any tears or missing pieces
   - staples: Staple condition and rust

4. **Confidence Score**: Your confidence in this assessment (0-100%)
5. **Analysis Details**: Detailed explanation of the grading decision
6. **Grading Notes**: Specific observations that affect the grade

Respond with valid JSON in this exact format:
{
  "predictedGrade": 8.5,
  "gradeCategory": "Very Fine",
  "conditionFactors": {
    "corners": 8,
    "spine": 7,
    "pages": 9,
    "colors": 8,
    "cover": 8,
    "creases": 9,
    "tears": 10,
    "staples": 8
  },
  "confidenceScore": 87.5,
  "analysisDetails": "Detailed analysis of the comic's condition...",
  "gradingNotes": "Specific notes about condition factors..."
}`;
            // Analyze image with OpenAI Vision API
            const visionResponse = await openai.chat.completions.create({
                model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: gradingPrompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageData}`
                                }
                            }
                        ],
                    },
                ],
                response_format: { type: "json_object" },
                max_completion_tokens: 2048,
            });
            const processingTime = Date.now() - startTime;
            // Parse the AI response
            const aiAnalysis = JSON.parse(visionResponse.choices[0].message.content);
            // Create the grading prediction record
            const predictionData = schema_1.insertComicGradingPredictionSchema.parse({
                userId: userId || null,
                imageUrl: `data:image/jpeg;base64,${imageData.substring(0, 100)}...`, // Store truncated version
                imageName: imageName || 'uploaded-comic.jpg',
                predictedGrade: aiAnalysis.predictedGrade.toString(),
                gradeCategory: aiAnalysis.gradeCategory,
                conditionFactors: aiAnalysis.conditionFactors,
                confidenceScore: aiAnalysis.confidenceScore.toString(),
                analysisDetails: aiAnalysis.analysisDetails,
                gradingNotes: aiAnalysis.gradingNotes,
                processingTimeMs: processingTime,
                aiModel: "gpt-5",
                status: "completed"
            });
            // Save to storage
            const prediction = await storage_1.storage.createComicGradingPrediction(predictionData);
            res.status(201).json({
                success: true,
                prediction: {
                    id: prediction.id,
                    predictedGrade: parseFloat(prediction.predictedGrade),
                    gradeCategory: prediction.gradeCategory,
                    conditionFactors: prediction.conditionFactors,
                    confidenceScore: parseFloat(prediction.confidenceScore),
                    analysisDetails: prediction.analysisDetails,
                    gradingNotes: prediction.gradingNotes,
                    processingTimeMs: prediction.processingTimeMs,
                    createdAt: prediction.createdAt
                }
            });
        }
        catch (error) {
            console.error('Comic grading analysis error:', error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    error: "Invalid grading data",
                    details: error.errors
                });
            }
            // Handle OpenAI API errors
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error;
                if (apiError.response?.status === 401) {
                    return res.status(500).json({
                        error: "OpenAI API authentication failed. Please check your API key."
                    });
                }
                if (apiError.response?.status === 429) {
                    return res.status(429).json({
                        error: "OpenAI API rate limit exceeded. Please try again later."
                    });
                }
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                error: "Failed to analyze comic image",
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            });
        }
    });
    // Get comic grading history
    app.get("/api/grading/history", async (req, res) => {
        try {
            const userId = req.query.userId;
            const predictions = await storage_1.storage.getComicGradingPredictions({ userId });
            res.json({
                success: true,
                predictions: predictions.map(p => ({
                    id: p.id,
                    predictedGrade: parseFloat(p.predictedGrade),
                    gradeCategory: p.gradeCategory,
                    confidenceScore: parseFloat(p.confidenceScore),
                    imageName: p.imageName,
                    createdAt: p.createdAt
                }))
            });
        }
        catch (error) {
            console.error('Error fetching grading history:', error);
            res.status(500).json({ error: "Failed to fetch grading history" });
        }
    });
    // ================================
    // MARKET SIMULATION ENGINE ROUTES
    // ================================
    // Current Asset Prices - Real-time prices with bid/ask spreads
    app.get("/api/market/prices", async (req, res) => {
        try {
            const assetIds = req.query.assetIds;
            const marketStatus = req.query.marketStatus;
            let prices;
            if (assetIds) {
                // Get specific assets
                const idsArray = assetIds.split(',');
                prices = await marketSimulation_js_1.marketSimulation.getCurrentPrices(idsArray);
            }
            else {
                // Get all current prices
                prices = await storage_1.storage.getAllAssetCurrentPrices(marketStatus);
            }
            res.json({
                success: true,
                data: prices,
                marketOpen: marketSimulation_js_1.marketSimulation.isMarketOpen()
            });
        }
        catch (error) {
            console.error('Error fetching current prices:', error);
            res.status(500).json({ error: "Failed to fetch current prices" });
        }
    });
    // Weighted Market Cap Details - Share pricing and float data for an asset
    app.get("/api/market/market-cap/:assetId", async (req, res) => {
        try {
            const { assetId } = req.params;
            const priceData = await storage_1.storage.getAssetCurrentPrices([assetId]);
            if (!priceData || priceData.length === 0) {
                return res.status(404).json({ error: "Asset not found" });
            }
            const price = priceData[0];
            res.json({
                success: true,
                data: {
                    assetId,
                    sharePrice: parseFloat(price.currentPrice),
                    totalMarketValue: price.totalMarketValue ? parseFloat(price.totalMarketValue) : null,
                    totalFloat: price.totalFloat,
                    sharesPerCopy: price.sharesPerCopy || 100,
                    averageComicValue: price.averageComicValue ? parseFloat(price.averageComicValue) : null,
                    scarcityModifier: price.scarcityModifier ? parseFloat(price.scarcityModifier) : 1.0,
                    censusDistribution: price.censusDistribution || [],
                    priceSource: price.priceSource
                }
            });
        }
        catch (error) {
            console.error('Error fetching market cap details:', error);
            res.status(500).json({ error: "Failed to fetch market cap details" });
        }
    });
    // Market Depth - Simulated order book data
    app.get("/api/market/depth/:assetId", async (req, res) => {
        try {
            const marketData = marketSimulation_js_1.marketSimulation.getAssetMarketData(req.params.assetId);
            if (!marketData) {
                return res.status(404).json({ error: "Asset not found" });
            }
            const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
            const spread = parseFloat(marketData.currentPrice.askPrice || '0') - parseFloat(marketData.currentPrice.bidPrice || '0');
            // Simulate market depth (order book)
            const depth = {
                bids: [],
                asks: []
            };
            // Generate realistic bid/ask ladder
            let runningBidTotal = 0;
            let runningAskTotal = 0;
            for (let i = 0; i < 10; i++) {
                // Bids (decreasing price)
                const bidPrice = currentPrice * (1 - (i + 1) * spread / currentPrice);
                const bidQuantity = Math.floor(Math.random() * 500 + 100);
                runningBidTotal += bidQuantity;
                depth.bids.push({
                    price: Math.round(bidPrice * 100) / 100,
                    quantity: bidQuantity,
                    total: runningBidTotal
                });
                // Asks (increasing price)
                const askPrice = currentPrice * (1 + (i + 1) * spread / currentPrice);
                const askQuantity = Math.floor(Math.random() * 500 + 100);
                runningAskTotal += askQuantity;
                depth.asks.push({
                    price: Math.round(askPrice * 100) / 100,
                    quantity: askQuantity,
                    total: runningAskTotal
                });
            }
            res.json({
                success: true,
                data: {
                    assetId: req.params.assetId,
                    symbol: marketData.asset.symbol,
                    currentPrice,
                    spread: Math.round(spread * 100) / 100,
                    depth
                }
            });
        }
        catch (error) {
            console.error('Error fetching market depth:', error);
            res.status(500).json({ error: "Failed to fetch market depth" });
        }
    });
    // Market History - OHLC data for charting
    app.get("/api/market/history/:assetId", async (req, res) => {
        try {
            const timeframe = req.query.timeframe || '1d';
            const limit = req.query.limit ? parseInt(req.query.limit) : 100;
            const from = req.query.from ? new Date(req.query.from) : undefined;
            const to = req.query.to ? new Date(req.query.to) : undefined;
            const chartData = await storage_1.storage.getMarketDataHistory(req.params.assetId, timeframe, limit, from, to);
            // Get current price for latest data point
            const currentPrice = await storage_1.storage.getAssetCurrentPrice(req.params.assetId);
            res.json({
                success: true,
                data: {
                    assetId: req.params.assetId,
                    timeframe,
                    currentPrice: currentPrice ? parseFloat(currentPrice.currentPrice) : null,
                    ohlc: chartData.map(d => ({
                        timestamp: d.periodStart,
                        open: parseFloat(d.open),
                        high: parseFloat(d.high),
                        low: parseFloat(d.low),
                        close: parseFloat(d.close),
                        volume: d.volume
                    }))
                }
            });
        }
        catch (error) {
            console.error('Error fetching chart data:', error);
            res.status(500).json({ error: "Failed to fetch chart data" });
        }
    });
    // Place Order - Create pending order without immediate execution
    app.post("/api/orders/place", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            // Validate order data
            const orderData = schema_1.insertOrderSchema.parse({
                ...req.body,
                userId,
                status: 'pending' // Force pending status for placed orders
            });
            // Validate the order through the matching engine before placing
            const tempOrder = await storage_1.storage.createOrder(orderData);
            const validation = await marketSimulation_js_1.orderMatching.validateOrder(tempOrder);
            if (!validation.isValid) {
                // Delete the temp order and return validation error
                await storage_1.storage.deleteOrder(tempOrder.id);
                return res.status(400).json({
                    success: false,
                    error: validation.reason || 'Order validation failed'
                });
            }
            // Order is valid, return the placed order
            res.status(201).json({
                success: true,
                data: {
                    orderId: tempOrder.id,
                    status: 'pending',
                    message: 'Order placed successfully',
                    orderDetails: {
                        assetId: tempOrder.assetId,
                        type: tempOrder.type,
                        orderType: tempOrder.orderType,
                        quantity: tempOrder.quantity,
                        price: tempOrder.price,
                        estimatedValue: parseFloat(tempOrder.quantity) * parseFloat(tempOrder.price || '0')
                    }
                }
            });
        }
        catch (error) {
            console.error('Error placing order:', error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    error: "Invalid order data",
                    details: error.errors
                });
            }
            res.status(500).json({ error: "Failed to place order" });
        }
    });
    // Order Execution - Process buy/sell orders immediately
    app.post("/api/orders/execute", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            // Validate order data
            const orderData = schema_1.insertOrderSchema.parse({
                ...req.body,
                userId
            });
            // Create the order
            const order = await storage_1.storage.createOrder(orderData);
            // Process the order through the matching engine
            const execution = await marketSimulation_js_1.orderMatching.processOrder(order);
            if (execution) {
                res.status(201).json({
                    success: true,
                    data: {
                        orderId: execution.orderId,
                        status: 'filled',
                        executedQuantity: execution.executedQuantity,
                        executedPrice: execution.executedPrice,
                        fees: execution.fees,
                        slippage: execution.slippage,
                        timestamp: execution.timestamp
                    }
                });
            }
            else {
                // Order was rejected or placed as pending
                const updatedOrder = await storage_1.storage.getOrder(order.id);
                res.status(200).json({
                    success: true,
                    data: {
                        orderId: order.id,
                        status: updatedOrder?.status || 'pending',
                        message: updatedOrder?.rejectionReason || 'Order placed successfully'
                    }
                });
            }
        }
        catch (error) {
            console.error('Error executing order:', error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    error: "Invalid order data",
                    details: error.errors
                });
            }
            res.status(500).json({ error: "Failed to execute order" });
        }
    });
    // Order Status and Management
    app.get("/api/orders/user/:userId", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const status = req.query.status;
            // Ensure user can only access their own orders
            if (req.params.userId !== userId) {
                return res.status(403).json({ error: "Access denied" });
            }
            const orders = await storage_1.storage.getUserOrders(userId, status);
            res.json({
                success: true,
                data: orders
            });
        }
        catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ error: "Failed to fetch orders" });
        }
    });
    // Cancel Order
    app.delete("/api/orders/:orderId", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const order = await storage_1.storage.getOrder(req.params.orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            // Ensure user can only cancel their own orders
            if (order.userId !== userId) {
                return res.status(403).json({ error: "Access denied" });
            }
            // Only allow cancellation of pending orders
            if (order.status !== 'pending') {
                return res.status(400).json({ error: "Cannot cancel non-pending order" });
            }
            const cancelledOrder = await storage_1.storage.cancelOrder(req.params.orderId);
            res.json({
                success: true,
                data: cancelledOrder
            });
        }
        catch (error) {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: "Failed to cancel order" });
        }
    });
    // Market Overview
    app.get("/api/market/overview", async (req, res) => {
        try {
            const overview = await marketSimulation_js_1.marketSimulation.getMarketOverview();
            // Calculate total market volume
            const recentMarketData = await databaseStorage_1.db
                .select({
                totalVolume: (0, drizzle_orm_1.sql) `COALESCE(SUM(CAST(${schema_1.marketData.volume} AS DECIMAL)), 0)`
            })
                .from(schema_1.marketData)
                .where((0, drizzle_orm_1.sql) `${schema_1.marketData.timestamp} >= NOW() - INTERVAL '24 hours'`);
            const totalVolume = recentMarketData[0]?.totalVolume || 0;
            res.json({
                success: true,
                data: {
                    ...overview,
                    totalVolume
                }
            });
        }
        catch (error) {
            console.error('Error fetching market overview:', error);
            res.status(500).json({ error: "Failed to fetch market overview" });
        }
    });
    // Current Asset Prices
    app.get("/api/market/prices", async (req, res) => {
        try {
            const assetIds = req.query.assetIds;
            if (!assetIds) {
                // Get asset prices (limit to 100 to avoid overflow)
                const assets = await storage_1.storage.getAssets({ limit: 100 });
                const allAssetIds = assets.map(asset => asset.id);
                const prices = await storage_1.storage.getAssetCurrentPrices(allAssetIds);
                res.json({
                    success: true,
                    data: prices
                });
            }
            else {
                // Get specific asset prices
                const assetIdArray = assetIds.split(',');
                const prices = await storage_1.storage.getAssetCurrentPrices(assetIdArray);
                res.json({
                    success: true,
                    data: prices
                });
            }
        }
        catch (error) {
            console.error('Error fetching current prices:', error);
            res.status(500).json({ error: "Failed to fetch current prices" });
        }
    });
    // Historical Market Data for Asset
    app.get("/api/market/data/:assetId", async (req, res) => {
        try {
            const { assetId } = req.params;
            const timeframe = req.query.timeframe || '1h';
            const limit = req.query.limit ? parseInt(req.query.limit) : 100;
            const from = req.query.from ? new Date(req.query.from) : undefined;
            const to = req.query.to ? new Date(req.query.to) : undefined;
            const marketData = await storage_1.storage.getMarketDataHistory(assetId, timeframe, limit, from, to);
            res.json({
                success: true,
                data: marketData,
                meta: {
                    assetId,
                    timeframe,
                    limit,
                    count: marketData.length
                }
            });
        }
        catch (error) {
            console.error('Error fetching market data:', error);
            res.status(500).json({ error: "Failed to fetch market data" });
        }
    });
    // Active Market Events
    app.get("/api/market/events", async (req, res) => {
        try {
            const isActive = req.query.active !== 'false'; // Default to true
            const category = req.query.category;
            const events = await storage_1.storage.getMarketEvents({
                isActive: isActive || undefined,
                category
            });
            res.json({
                success: true,
                data: events
            });
        }
        catch (error) {
            console.error('Error fetching market events:', error);
            res.status(500).json({ error: "Failed to fetch market events" });
        }
    });
    // LEADERBOARD API ROUTES
    // Get all leaderboard categories
    app.get("/api/leaderboards/categories", async (req, res) => {
        try {
            const categories = await storage_1.storage.getLeaderboardCategories({ isActive: true });
            res.json(categories);
        }
        catch (error) {
            console.error("Error fetching leaderboard categories:", error);
            res.status(500).json({ error: "Failed to fetch leaderboard categories" });
        }
    });
    // Get leaderboard data by category ID
    app.get("/api/leaderboards/:categoryId", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const leaderboard = await leaderboardService_js_1.leaderboardService.generateLeaderboard(req.params.categoryId, limit);
            res.json(leaderboard);
        }
        catch (error) {
            console.error("Error generating leaderboard:", error);
            res.status(500).json({ error: "Failed to generate leaderboard" });
        }
    });
    // Get multiple leaderboards at once
    app.get("/api/leaderboards", async (req, res) => {
        try {
            const categoryIds = req.query.categories?.split(',') || [];
            const limit = parseInt(req.query.limit) || 25;
            if (categoryIds.length === 0) {
                // Get all active categories if none specified
                const categories = await storage_1.storage.getLeaderboardCategories({ isActive: true });
                const leaderboards = await leaderboardService_js_1.leaderboardService.getMultipleLeaderboards(categories.map(c => c.id), limit);
                res.json(leaderboards);
            }
            else {
                const leaderboards = await leaderboardService_js_1.leaderboardService.getMultipleLeaderboards(categoryIds, limit);
                res.json(leaderboards);
            }
        }
        catch (error) {
            console.error("Error fetching multiple leaderboards:", error);
            res.status(500).json({ error: "Failed to fetch leaderboards" });
        }
    });
    // Get user's rankings across all categories
    app.get("/api/leaderboards/user/:userId/rankings", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.params.userId;
            const rankings = await leaderboardService_js_1.leaderboardService.getUserRankings(userId);
            res.json(rankings);
        }
        catch (error) {
            console.error("Error fetching user rankings:", error);
            res.status(500).json({ error: "Failed to fetch user rankings" });
        }
    });
    // Get current user's rankings (authenticated route)
    app.get("/api/leaderboards/my-rankings", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const rankings = await leaderboardService_js_1.leaderboardService.getUserRankings(userId);
            res.json(rankings);
        }
        catch (error) {
            console.error("Error fetching user rankings:", error);
            res.status(500).json({ error: "Failed to fetch user rankings" });
        }
    });
    // Get user's trader statistics
    app.get("/api/leaderboards/user/:userId/stats", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.params.userId;
            const stats = await storage_1.storage.getTraderStats(userId);
            if (!stats) {
                return res.status(404).json({ error: "Trader stats not found" });
            }
            res.json(stats);
        }
        catch (error) {
            console.error("Error fetching trader stats:", error);
            res.status(500).json({ error: "Failed to fetch trader stats" });
        }
    });
    // Get current user's trader statistics
    app.get("/api/leaderboards/my-stats", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const stats = await storage_1.storage.getTraderStats(userId);
            res.json(stats);
        }
        catch (error) {
            console.error("Error fetching trader stats:", error);
            res.status(500).json({ error: "Failed to fetch trader stats" });
        }
    });
    // Get user achievements
    app.get("/api/achievements/user/:userId", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.params.userId;
            const category = req.query.category;
            const tier = req.query.tier;
            const achievements = await storage_1.storage.getUserAchievements(userId, {
                category,
                tier,
                isVisible: true
            });
            res.json(achievements);
        }
        catch (error) {
            console.error("Error fetching user achievements:", error);
            res.status(500).json({ error: "Failed to fetch achievements" });
        }
    });
    // Get current user's achievements
    app.get("/api/achievements/my-achievements", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const category = req.query.category;
            const tier = req.query.tier;
            const achievements = await storage_1.storage.getUserAchievements(userId, {
                category,
                tier,
                isVisible: true
            });
            res.json(achievements);
        }
        catch (error) {
            console.error("Error fetching user achievements:", error);
            res.status(500).json({ error: "Failed to fetch achievements" });
        }
    });
    // Get available achievements and progress
    app.get("/api/achievements/available", async (req, res) => {
        try {
            const achievements = await storage_1.storage.getAvailableAchievements();
            res.json(achievements);
        }
        catch (error) {
            console.error("Error fetching available achievements:", error);
            res.status(500).json({ error: "Failed to fetch available achievements" });
        }
    });
    // Get user achievement progress
    app.get("/api/achievements/progress/:achievementId", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const achievementId = req.params.achievementId;
            const progress = await storage_1.storage.getUserAchievementProgress(userId, achievementId);
            if (!progress) {
                return res.status(404).json({ error: "Achievement progress not found" });
            }
            res.json(progress);
        }
        catch (error) {
            console.error("Error fetching achievement progress:", error);
            res.status(500).json({ error: "Failed to fetch achievement progress" });
        }
    });
    // Get leaderboard overview and analytics
    app.get("/api/leaderboards/overview", async (req, res) => {
        try {
            const overview = await leaderboardService_js_1.leaderboardService.getLeaderboardOverview();
            res.json(overview);
        }
        catch (error) {
            console.error("Error fetching leaderboard overview:", error);
            res.status(500).json({ error: "Failed to fetch leaderboard overview" });
        }
    });
    // Get trading activity summary
    app.get("/api/leaderboards/activity/:timeframe", async (req, res) => {
        try {
            const timeframe = req.params.timeframe;
            if (!['daily', 'weekly', 'monthly'].includes(timeframe)) {
                return res.status(400).json({ error: "Invalid timeframe. Must be daily, weekly, or monthly" });
            }
            const summary = await leaderboardService_js_1.leaderboardService.getTradingActivitySummary(timeframe);
            res.json(summary);
        }
        catch (error) {
            console.error("Error fetching trading activity summary:", error);
            res.status(500).json({ error: "Failed to fetch trading activity summary" });
        }
    });
    // Admin route to recalculate all rankings (for maintenance)
    app.post("/api/leaderboards/recalculate", replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            // Note: In production, this should have admin role check
            await leaderboardService_js_1.leaderboardService.recalculateAllRankings();
            res.json({ message: "Rankings recalculated successfully" });
        }
        catch (error) {
            console.error("Error recalculating rankings:", error);
            res.status(500).json({ error: "Failed to recalculate rankings" });
        }
    });
    // Initialize leaderboard service
    try {
        console.log('🏆 Initializing leaderboard service...');
        await leaderboardService_js_1.leaderboardService.initializeDefaultCategories();
        console.log('✅ Leaderboard service initialized successfully');
    }
    catch (error) {
        console.error('❌ Failed to initialize leaderboard service:', error);
        // Continue anyway - the service can be manually restarted
    }
    // Initialize and start the market simulation engine
    try {
        console.log('🏪 Initializing market simulation engine...');
        // Import and run seed data
        const { seedMarketData, generateHistoricalData } = await Promise.resolve().then(() => __importStar(require('./seedData.js')));
        await seedMarketData();
        await generateHistoricalData();
        await marketSimulation_js_1.marketSimulation.initialize();
        // Delay starting price updates to allow server to fully start first
        setTimeout(() => {
            const updateInterval = process.env.NODE_ENV === 'development' ? 30000 : 60000;
            marketSimulation_js_1.marketSimulation.start(updateInterval);
            console.log('✅ Market simulation price updates started');
        }, 10000); // Wait 10 seconds after server starts
        console.log('✅ Market simulation engine initialized successfully');
    }
    catch (error) {
        console.error('❌ Failed to initialize market simulation engine:', error);
        // Continue anyway - the engine can be manually restarted
    }
    // FINAL FIX: Apply binary-level WebSocket frame protection
    // TEMPORARILY DISABLED: These WebSocket overrides cause Vite HMR frame errors
    // console.log('🔧 [FINAL] Applying final binary-level WebSocket fix...');
    // const { applyFinalWebSocketFix, overrideViteWebSocketProcessing } = await import('./utils/finalWebSocketFix.js');
    // applyFinalWebSocketFix();
    // overrideViteWebSocketProcessing();
    // ULTIMATE FIX: Apply comprehensive WebSocket character ID prevention
    // TEMPORARILY DISABLED: These WebSocket overrides cause Vite HMR frame errors
    // console.log('🚀 [ULTIMATE] Applying ultimate WebSocket character ID prevention...');
    // const { applyUltimateWebSocketFix } = await import('./utils/ultimateWebSocketFix.js');
    // applyUltimateWebSocketFix();
    // EMERGENCY FIX: Keep emergency fix as additional layer
    // TEMPORARILY DISABLED: These WebSocket overrides cause Vite HMR frame errors
    // console.log('🚨 [EMERGENCY] Applying final WebSocket character ID fix...');
    // const { applyEmergencyWebSocketFix } = await import('./utils/webSocketEmergencyFix.js');
    // applyEmergencyWebSocketFix();
    const httpServer = (0, http_1.createServer)(app);
    // ================================
    // POLLING-BASED MARKET DATA API
    // Simple REST endpoint for market data snapshots (replaces WebSocket)
    // ================================
    // WebSocket support disabled - using polling instead
    // Start the price streaming service (for data generation only)
    // await priceStreamingService.start();
    // console.log('💹 Price streaming service started (polling mode)');
    // DISABLED: WebSocket real-time streaming (replaced with polling)
    // Keeping code commented for reference in case we want to re-enable later
    /*
    // Setup WebSocket for real-time market data
    // Try simple server mode with path - client monkey-patch is now disabled
  // WS_DISABLED:   const wss = new WebSocketServer({
      server: httpServer,
      path: '/ws/market-data',
      perMessageDeflate: false // Disable compression to avoid frame issues
    });
    
    // Store connected clients for broadcasting
    const marketDataClients = new Set<any>();
    
    wss.on('connection', (ws, req) => {
      console.log('📡 New WebSocket client connected for market data');
      
      // TEMPORARILY DISABLED: Test if sanitization patch is causing immediate disconnect
      // patchWebSocketWithSanitization(ws);
      
      // Setup heartbeat to keep connection alive
      (ws as any).isAlive = true;
      ws.on('pong', () => {
        (ws as any).isAlive = true;
      });
      
      marketDataClients.add(ws);
      
      // Add client to price streaming service
      priceStreamingService.addClient(ws);
      
      // Send market snapshot repeatedly until client is ready
      let snapshotAttempts = 0;
      const maxAttempts = 10;
      const snapshotInterval = setInterval(() => {
        snapshotAttempts++;
        if (ws.readyState === 1) { // OPEN
          console.log(`📊 Sending snapshot attempt ${snapshotAttempts}`);
          priceStreamingService.sendMarketSnapshot(ws, 100);
          clearInterval(snapshotInterval);
        } else if (snapshotAttempts >= maxAttempts || ws.readyState === 3) { // CLOSED
          console.log(`❌ Failed to send snapshot after ${snapshotAttempts} attempts, readyState: ${ws.readyState}`);
          clearInterval(snapshotInterval);
        }
      }, 50); // Try every 50ms
      
      ws.on('message', (message) => {
        try {
          console.log('📨 Received WebSocket message:', message.toString().substring(0, 100));
          const data = JSON.parse(message.toString());
          console.log('📋 Parsed message type:', data.type);
          
          // Handle client subscriptions to specific assets
          if (data.type === 'subscribe_asset') {
            // Validate that assetId is a string and not something that could be misused
            if (typeof data.assetId === 'string' && data.assetId.length > 0) {
              ws.assetSubscriptions = ws.assetSubscriptions || new Set();
              ws.assetSubscriptions.add(data.assetId);
              priceStreamingService.subscribeToAsset(ws, data.assetId);
              console.log(`📊 Client subscribed to asset: ${data.assetId}`);
            } else {
              console.warn('Invalid assetId in subscription request:', data.assetId);
            }
          }
          
          if (data.type === 'unsubscribe_asset') {
            if (typeof data.assetId === 'string') {
              ws.assetSubscriptions?.delete(data.assetId);
              priceStreamingService.unsubscribeFromAsset(ws, data.assetId);
              console.log(`📊 Client unsubscribed from asset: ${data.assetId}`);
            }
          }
          
          // Handle bulk subscriptions
          if (data.type === 'subscribe_assets' && Array.isArray(data.assetIds)) {
            for (const assetId of data.assetIds) {
              if (typeof assetId === 'string' && assetId.length > 0) {
                ws.assetSubscriptions = ws.assetSubscriptions || new Set();
                ws.assetSubscriptions.add(assetId);
                priceStreamingService.subscribeToAsset(ws, assetId);
              }
            }
            console.log(`📊 Client subscribed to ${data.assetIds.length} assets`);
          }
          
          // Handle subscribe to top assets by volume
          if (data.type === 'subscribe_top_assets') {
            const count = typeof data.count === 'number' ? data.count : 100;
            console.log(`📊 Client requesting top ${count} assets by volume`);
            
            // Get top assets and send as snapshot
            priceStreamingService.sendMarketSnapshot(ws, count);
            
            // Also subscribe client to these assets for ongoing updates
            const topAssets = priceStreamingService.getTopAssetsByVolume(count);
            for (const asset of topAssets) {
              ws.assetSubscriptions = ws.assetSubscriptions || new Set();
              ws.assetSubscriptions.add(asset.assetId);
              priceStreamingService.subscribeToAsset(ws, asset.assetId);
            }
            console.log(`📊 Client subscribed to top ${count} assets for live updates`);
          }
          
          // Handle ping/pong for connection keepalive
          if (data.type === 'ping') {
            safeWebSocketSend(ws, { type: 'pong', timestamp: Date.now() });
          }
          
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          // Don't close connection for message parsing errors, just log them
        }
      });
      
      ws.on('close', (code, reason) => {
        console.log(`📡 WebSocket client disconnected (code: ${code}, reason: ${reason?.toString()})`);
        marketDataClients.delete(ws);
        // Remove client from price streaming service
        priceStreamingService.removeClient(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        marketDataClients.delete(ws);
        // Remove client from price streaming service
        priceStreamingService.removeClient(ws);
        // Use safe close for error conditions
        safeWebSocketClose(ws, WebSocketCloseCodes.INTERNAL_SERVER_ERROR, 'Connection error');
      });
    });
    
    // Broadcast market data updates to connected clients
    const broadcastMarketUpdate = async () => {
      if (marketDataClients.size === 0) return;
      
      try {
        const overview = await marketSimulation.getMarketOverview();
        
        const updateMessage = {
          type: 'market_update',
          data: overview,
          timestamp: new Date().toISOString()
        };
        
        // Create array of clients to avoid Set modification during iteration
        const clientsArray = Array.from(marketDataClients);
        
        clientsArray.forEach(client => {
          try {
            if (client.readyState === 1) { // WebSocket.OPEN
              // Use sanitized send to prevent character IDs from causing protocol errors
              safeWebSocketSend(client, updateMessage);
            } else {
              marketDataClients.delete(client);
            }
          } catch (error) {
            console.error('Error sending update to client:', error);
            marketDataClients.delete(client);
            // Don't try to close here as the client might already be disconnected
          }
        });
      } catch (error) {
        console.error('Error broadcasting market update:', error);
      }
    };
    
    // Broadcast updates every 30 seconds
    setInterval(broadcastMarketUpdate, 30000);
    
    // Heartbeat interval to keep connections alive and terminate dead ones
    setInterval(() => {
      wss.clients.forEach((ws: any) => {
        if (ws.isAlive === false) {
          console.log('💀 Terminating dead WebSocket connection');
          marketDataClients.delete(ws);
          priceStreamingService.removeClient(ws);
          return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Ping every 30 seconds
    
    // Store the broadcast function for use in market simulation
    (marketSimulation as any).broadcastUpdate = broadcastMarketUpdate;
    */
    // END OF DISABLED WEBSOCKET CODE
    // ================================
    // SSE (Server-Sent Events) FALLBACK FOR MARKET DATA
    // Kept as alternative streaming option if needed
    // ================================
    app.get('/api/market-data/stream', (req, res) => {
        console.log('📡 New SSE client connected for market data');
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx
        // Send initial comment to establish connection
        res.write(': SSE connection established\n\n');
        // Send initial market snapshot
        const initialSnapshot = priceStreamingService.getTopAssetsByVolume(100);
        res.write(`event: snapshot\n`);
        res.write(`data: ${JSON.stringify({ type: 'market_data_snapshot', data: initialSnapshot })}\n\n`);
        // Create update interval for this client
        const updateInterval = setInterval(() => {
            try {
                // Send market updates every 2 seconds
                const updates = priceStreamingService.getTopAssetsByVolume(100);
                res.write(`event: update\n`);
                res.write(`data: ${JSON.stringify({ type: 'market_data_snapshot', data: updates })}\n\n`);
            }
            catch (error) {
                console.error('Error sending SSE update:', error);
                clearInterval(updateInterval);
            }
        }, 2000); // Update every 2 seconds
        // Send keepalive ping every 30 seconds
        const pingInterval = setInterval(() => {
            res.write(': keepalive\n\n');
        }, 30000);
        // Clean up on client disconnect
        req.on('close', () => {
            console.log('📡 SSE client disconnected');
            clearInterval(updateInterval);
            clearInterval(pingInterval);
            res.end();
        });
    });
    // ================================
    // CAREER PATHWAY CERTIFICATION ROUTES
    // ================================
    // Get all career pathway levels
    app.get('/api/certifications/pathways', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const pathways = await databaseStorage_1.db.select().from(schema_1.careerPathwayLevels).where((0, drizzle_orm_1.eq)(schema_1.careerPathwayLevels.isActive, true)).orderBy(schema_1.careerPathwayLevels.displayOrder);
            res.json(pathways);
        }
        catch (error) {
            console.error('Error fetching certification pathways:', error);
            res.status(500).json({ error: 'Failed to fetch certification pathways' });
        }
    });
    // Get user's certification progress across all pathways
    app.get('/api/certifications/progress', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const progress = await databaseStorage_1.db.select().from(schema_1.userPathwayProgress).where((0, drizzle_orm_1.eq)(schema_1.userPathwayProgress.userId, userId));
            res.json(progress);
        }
        catch (error) {
            console.error('Error fetching user certification progress:', error);
            res.status(500).json({ error: 'Failed to fetch certification progress' });
        }
    });
    // Get courses for a specific pathway level
    app.get('/api/certifications/courses/:pathwayLevelId', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { pathwayLevelId } = req.params;
            const courses = await databaseStorage_1.db.select().from(schema_1.certificationCourses)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.certificationCourses.pathwayLevelId, pathwayLevelId), (0, drizzle_orm_1.eq)(schema_1.certificationCourses.isActive, true)))
                .orderBy(schema_1.certificationCourses.courseNumber);
            res.json(courses);
        }
        catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    });
    // Get user's enrollment for a specific pathway level
    app.get('/api/certifications/enrollments/:pathwayLevelId', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { pathwayLevelId } = req.params;
            const enrollments = await databaseStorage_1.db.select().from(schema_1.userCourseEnrollments)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userCourseEnrollments.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userCourseEnrollments.pathwayLevelId, pathwayLevelId)));
            res.json(enrollments);
        }
        catch (error) {
            console.error('Error fetching enrollments:', error);
            res.status(500).json({ error: 'Failed to fetch enrollments' });
        }
    });
    // Enroll in a course
    app.post('/api/certifications/enroll', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { courseId, pathwayLevelId } = req.body;
            // Check if already enrolled
            const existing = await databaseStorage_1.db.select().from(schema_1.userCourseEnrollments)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userCourseEnrollments.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userCourseEnrollments.courseId, courseId)))
                .limit(1);
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Already enrolled in this course' });
            }
            // Create enrollment
            const [enrollment] = await databaseStorage_1.db.insert(schema_1.userCourseEnrollments).values({
                userId,
                courseId,
                pathwayLevelId,
                status: 'enrolled'
            }).returning();
            res.json(enrollment);
        }
        catch (error) {
            console.error('Error enrolling in course:', error);
            res.status(500).json({ error: 'Failed to enroll in course' });
        }
    });
    // Submit exam attempt
    app.post('/api/certifications/exam', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { courseId, enrollmentId, responses } = req.body;
            // Get course and enrollment data
            const [course] = await databaseStorage_1.db.select().from(schema_1.certificationCourses).where((0, drizzle_orm_1.eq)(schema_1.certificationCourses.id, courseId)).limit(1);
            const [enrollment] = await databaseStorage_1.db.select().from(schema_1.userCourseEnrollments).where((0, drizzle_orm_1.eq)(schema_1.userCourseEnrollments.id, enrollmentId)).limit(1);
            if (!course || !enrollment) {
                return res.status(404).json({ error: 'Course or enrollment not found' });
            }
            // Calculate score
            const examQuestions = course.examQuestions;
            let correctAnswers = 0;
            examQuestions.forEach((q, index) => {
                if (responses[index] === q.correct) {
                    correctAnswers++;
                }
            });
            const score = (correctAnswers / examQuestions.length) * 100;
            const passed = score >= (course.passingScore || 70);
            const attemptNumber = enrollment.examAttempts + 1;
            const isPenaltyAttempt = attemptNumber > (course.maxAttempts || 3);
            const penaltyCharged = isPenaltyAttempt ? parseFloat(course.retryPenaltyAmount || '0') : 0;
            // Create exam attempt
            const [attempt] = await databaseStorage_1.db.insert(schema_1.examAttempts).values({
                userId,
                courseId,
                enrollmentId,
                attemptNumber,
                isPenaltyAttempt,
                penaltyCharged: penaltyCharged.toString(),
                score: score.toString(),
                passed,
                totalQuestions: examQuestions.length,
                correctAnswers,
                responses: JSON.stringify(responses)
            }).returning();
            // Update enrollment
            await databaseStorage_1.db.update(schema_1.userCourseEnrollments)
                .set({
                examAttempts: attemptNumber,
                lastAttemptScore: score.toString(),
                bestScore: enrollment.bestScore ? Math.max(parseFloat(enrollment.bestScore), score).toString() : score.toString(),
                passed: passed || enrollment.passed,
                passedAt: passed ? new Date() : enrollment.passedAt,
                penaltyCharges: (parseFloat(enrollment.penaltyCharges || '0') + penaltyCharged).toString(),
                penaltyAttempts: isPenaltyAttempt ? (enrollment.penaltyAttempts || 0) + 1 : enrollment.penaltyAttempts,
                status: passed ? 'completed' : 'in_progress',
                completedAt: passed ? new Date() : enrollment.completedAt
            })
                .where((0, drizzle_orm_1.eq)(schema_1.userCourseEnrollments.id, enrollmentId));
            // If passed, update pathway progress
            if (passed && !enrollment.passed) {
                const [pathwayProgress] = await databaseStorage_1.db.select().from(schema_1.userPathwayProgress)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userPathwayProgress.userId, userId), (0, drizzle_orm_1.eq)(schema_1.userPathwayProgress.currentLevelId, enrollment.pathwayLevelId)))
                    .limit(1);
                if (pathwayProgress) {
                    const newCoursesPassed = (pathwayProgress.coursesPassed || 0) + 1;
                    const isCertified = newCoursesPassed >= 3;
                    const isMasterCertified = newCoursesPassed >= 5;
                    await databaseStorage_1.db.update(schema_1.userPathwayProgress)
                        .set({
                        coursesPassed: newCoursesPassed,
                        isCertified,
                        isMasterCertified,
                        totalCoursesCompleted: (pathwayProgress.totalCoursesCompleted || 0) + 1
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.userPathwayProgress.id, pathwayProgress.id));
                    // Award subscriber incentives for certification milestones
                    // Fetch full user record to get subscription tier
                    const [user] = await databaseStorage_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
                    const isSubscriber = user && user.subscriptionTier !== 'free';
                    if (isSubscriber) {
                        // Get pathway level info for calculating bonuses
                        const [pathwayLevel] = await databaseStorage_1.db.select().from(schema_1.careerPathwayLevels)
                            .where((0, drizzle_orm_1.eq)(schema_1.careerPathwayLevels.id, enrollment.pathwayLevelId))
                            .limit(1);
                        if (pathwayLevel) {
                            const bonuses = [];
                            // Award bonuses based on certification level
                            if (isMasterCertified && !pathwayProgress.isMasterCertified) {
                                // Master Certified (5/5 courses) - 150% salary bonus
                                const masterBonus = parseFloat(pathwayLevel.baseSalaryMax) * 1.5;
                                bonuses.push({
                                    type: 'capital_bonus',
                                    value: masterBonus,
                                    description: `Master Certification Bonus: ${pathwayLevel.name} (5/5 courses)`
                                });
                                bonuses.push({
                                    type: 'fee_discount',
                                    value: 50,
                                    description: 'Master Trader Fee Discount: 50% off trading fees'
                                });
                                bonuses.push({
                                    type: 'xp_multiplier',
                                    value: 3.0,
                                    description: 'Master XP Multiplier: 3x experience points'
                                });
                            }
                            else if (isCertified && !pathwayProgress.isCertified) {
                                // Certified (3/5 courses) - 100% salary bonus
                                const certBonus = parseFloat(pathwayLevel.baseSalaryMax) * 1.0;
                                bonuses.push({
                                    type: 'capital_bonus',
                                    value: certBonus,
                                    description: `Certification Bonus: ${pathwayLevel.name} (3/5 courses)`
                                });
                                bonuses.push({
                                    type: 'fee_discount',
                                    value: 25,
                                    description: 'Certified Trader Fee Discount: 25% off trading fees'
                                });
                                bonuses.push({
                                    type: 'xp_multiplier',
                                    value: 1.5,
                                    description: 'Certified XP Multiplier: 1.5x experience points'
                                });
                            }
                            // Create incentive records and update active benefits
                            for (const bonus of bonuses) {
                                // Create incentive record
                                const [incentive] = await databaseStorage_1.db.insert(schema_1.subscriberCourseIncentives).values({
                                    userId,
                                    courseId,
                                    pathwayLevelId: enrollment.pathwayLevelId,
                                    incentiveType: bonus.type,
                                    incentiveValue: bonus.value.toString(),
                                    status: 'active',
                                    activatedAt: new Date(),
                                    description: bonus.description,
                                    isActive: true
                                }).returning();
                                // Create history record
                                await databaseStorage_1.db.insert(schema_1.subscriberIncentiveHistory).values({
                                    userId,
                                    incentiveId: incentive.id,
                                    eventType: 'awarded',
                                    incentiveType: bonus.type,
                                    incentiveValue: bonus.value.toString(),
                                    sourceType: 'certification_earned',
                                    sourceId: enrollment.pathwayLevelId,
                                    description: bonus.description
                                });
                            }
                            // Update user's active benefits
                            const [existingBenefits] = await databaseStorage_1.db.select().from(schema_1.subscriberActiveBenefits)
                                .where((0, drizzle_orm_1.eq)(schema_1.subscriberActiveBenefits.userId, userId))
                                .limit(1);
                            if (existingBenefits) {
                                // Update existing benefits
                                let updates = {};
                                bonuses.forEach(bonus => {
                                    if (bonus.type === 'capital_bonus') {
                                        updates.totalCapitalBonusEarned = (parseFloat(existingBenefits.totalCapitalBonusEarned) + bonus.value).toString();
                                        updates.pendingCapitalBonus = (parseFloat(existingBenefits.pendingCapitalBonus) + bonus.value).toString();
                                    }
                                    else if (bonus.type === 'fee_discount') {
                                        updates.tradingFeeDiscount = Math.max(parseFloat(existingBenefits.tradingFeeDiscount), bonus.value).toString();
                                    }
                                    else if (bonus.type === 'xp_multiplier') {
                                        updates.xpMultiplier = Math.max(parseFloat(existingBenefits.xpMultiplier), bonus.value).toString();
                                    }
                                });
                                if (isMasterCertified) {
                                    updates.certificationBadgeTier = 'master';
                                }
                                else if (isCertified) {
                                    updates.certificationBadgeTier = 'certified';
                                }
                                updates.updatedAt = new Date();
                                await databaseStorage_1.db.update(schema_1.subscriberActiveBenefits)
                                    .set(updates)
                                    .where((0, drizzle_orm_1.eq)(schema_1.subscriberActiveBenefits.userId, userId));
                            }
                            else {
                                // Create new benefits record
                                const initialBenefits = {
                                    userId,
                                    totalCapitalBonusEarned: '0',
                                    pendingCapitalBonus: '0',
                                    tradingFeeDiscount: '0',
                                    xpMultiplier: '1.00',
                                    certificationBadgeTier: isMasterCertified ? 'master' : (isCertified ? 'certified' : null),
                                    displayBadge: true
                                };
                                bonuses.forEach(bonus => {
                                    if (bonus.type === 'capital_bonus') {
                                        initialBenefits.totalCapitalBonusEarned = bonus.value.toString();
                                        initialBenefits.pendingCapitalBonus = bonus.value.toString();
                                    }
                                    else if (bonus.type === 'fee_discount') {
                                        initialBenefits.tradingFeeDiscount = bonus.value.toString();
                                    }
                                    else if (bonus.type === 'xp_multiplier') {
                                        initialBenefits.xpMultiplier = bonus.value.toString();
                                    }
                                });
                                await databaseStorage_1.db.insert(schema_1.subscriberActiveBenefits).values(initialBenefits);
                            }
                        }
                    }
                }
            }
            res.json({ attempt, passed, score, penaltyCharged });
        }
        catch (error) {
            console.error('Error submitting exam:', error);
            res.status(500).json({ error: 'Failed to submit exam' });
        }
    });
    // ================================
    // EASTER EGG SYSTEM ROUTES
    // ================================
    // Get all Easter egg definitions (filtered by subscriber status)
    app.get('/api/easter-eggs', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const [user] = await databaseStorage_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
            const isSubscriber = user && user.subscriptionTier !== 'free';
            // Get all active eggs
            const eggs = await databaseStorage_1.db.select().from(schema_1.easterEggDefinitions)
                .where((0, drizzle_orm_1.eq)(schema_1.easterEggDefinitions.isActive, true));
            // Filter by subscriber status and visibility
            const visibleEggs = eggs.filter(egg => {
                if (egg.subscribersOnly && !isSubscriber)
                    return false;
                return true;
            });
            // Get user's progress to determine which eggs to show
            const progress = await databaseStorage_1.db.select().from(schema_1.easterEggUserProgress)
                .where((0, drizzle_orm_1.eq)(schema_1.easterEggUserProgress.userId, userId));
            const progressMap = new Map(progress.map(p => [p.eggId, p]));
            // Only show non-secret eggs OR eggs the user has discovered
            const filteredEggs = visibleEggs.filter(egg => {
                const userProgress = progressMap.get(egg.id);
                return !egg.isSecret || (userProgress && userProgress.isUnlocked);
            });
            res.json(filteredEggs);
        }
        catch (error) {
            console.error('Error fetching Easter eggs:', error);
            res.status(500).json({ error: 'Failed to fetch Easter eggs' });
        }
    });
    // Get user's progress on all Easter eggs
    app.get('/api/easter-eggs/progress', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const progress = await databaseStorage_1.db.select().from(schema_1.easterEggUserProgress)
                .where((0, drizzle_orm_1.eq)(schema_1.easterEggUserProgress.userId, userId));
            res.json(progress);
        }
        catch (error) {
            console.error('Error fetching Easter egg progress:', error);
            res.status(500).json({ error: 'Failed to fetch Easter egg progress' });
        }
    });
    // Get user's unlocked Easter eggs
    app.get('/api/easter-eggs/unlocked', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const unlocked = await databaseStorage_1.db.select({
                id: schema_1.easterEggUnlocks.id,
                egg_id: schema_1.easterEggUnlocks.eggId,
                unlocked_at: schema_1.easterEggUnlocks.unlockedAt,
                reward_claimed: schema_1.easterEggUnlocks.rewardClaimed,
                reward_claimed_at: schema_1.easterEggUnlocks.rewardClaimedAt,
                egg_name: schema_1.easterEggDefinitions.name,
                egg_description: schema_1.easterEggDefinitions.description,
                egg_rarity: schema_1.easterEggDefinitions.rarity,
            })
                .from(schema_1.easterEggUnlocks)
                .leftJoin(schema_1.easterEggDefinitions, (0, drizzle_orm_1.eq)(schema_1.easterEggUnlocks.eggId, schema_1.easterEggDefinitions.id))
                .where((0, drizzle_orm_1.eq)(schema_1.easterEggUnlocks.userId, userId));
            res.json(unlocked);
        }
        catch (error) {
            console.error('Error fetching unlocked Easter eggs:', error);
            res.status(500).json({ error: 'Failed to fetch unlocked Easter eggs' });
        }
    });
    // Claim reward from an unlocked Easter egg
    app.post('/api/easter-eggs/claim/:unlockId', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { unlockId } = req.params;
            // Get the unlock record
            const [unlock] = await databaseStorage_1.db.select().from(schema_1.easterEggUnlocks)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.easterEggUnlocks.id, unlockId), (0, drizzle_orm_1.eq)(schema_1.easterEggUnlocks.userId, userId)))
                .limit(1);
            if (!unlock) {
                return res.status(404).json({ error: 'Unlock not found' });
            }
            if (unlock.rewardClaimed) {
                return res.status(400).json({ error: 'Reward already claimed' });
            }
            // Apply reward based on type
            const rewardValue = parseFloat(unlock.rewardValue);
            let rewardApplied = false;
            if (unlock.rewardType === 'capital_bonus') {
                // Add capital to user's portfolio
                const [portfolio] = await databaseStorage_1.db.select().from(schema_1.portfolios)
                    .where((0, drizzle_orm_1.eq)(schema_1.portfolios.userId, userId))
                    .limit(1);
                if (portfolio) {
                    const newCash = parseFloat(portfolio.cash) + rewardValue;
                    await databaseStorage_1.db.update(schema_1.portfolios)
                        .set({ cash: newCash.toString() })
                        .where((0, drizzle_orm_1.eq)(schema_1.portfolios.id, portfolio.id));
                    rewardApplied = true;
                }
            }
            else if (unlock.rewardType === 'fee_waiver' || unlock.rewardType === 'xp_boost') {
                // Update user's active benefits
                const [benefits] = await databaseStorage_1.db.select().from(schema_1.subscriberActiveBenefits)
                    .where((0, drizzle_orm_1.eq)(schema_1.subscriberActiveBenefits.userId, userId))
                    .limit(1);
                if (benefits) {
                    let updates = {};
                    if (unlock.rewardType === 'fee_waiver') {
                        updates.tradingFeeDiscount = Math.max(parseFloat(benefits.tradingFeeDiscount), rewardValue).toString();
                    }
                    else if (unlock.rewardType === 'xp_boost') {
                        updates.xpMultiplier = Math.max(parseFloat(benefits.xpMultiplier), rewardValue).toString();
                    }
                    updates.updatedAt = new Date();
                    await databaseStorage_1.db.update(schema_1.subscriberActiveBenefits)
                        .set(updates)
                        .where((0, drizzle_orm_1.eq)(schema_1.subscriberActiveBenefits.userId, userId));
                    rewardApplied = true;
                }
                else {
                    // Create new benefits record
                    const initialBenefits = {
                        userId,
                        totalCapitalBonusEarned: '0',
                        pendingCapitalBonus: '0',
                        tradingFeeDiscount: unlock.rewardType === 'fee_waiver' ? rewardValue.toString() : '0',
                        xpMultiplier: unlock.rewardType === 'xp_boost' ? rewardValue.toString() : '1.00',
                        displayBadge: false
                    };
                    await databaseStorage_1.db.insert(schema_1.subscriberActiveBenefits).values(initialBenefits);
                    rewardApplied = true;
                }
            }
            // Mark as claimed
            await databaseStorage_1.db.update(schema_1.easterEggUnlocks)
                .set({
                rewardClaimed: true,
                rewardClaimedAt: new Date(),
                rewardApplied
            })
                .where((0, drizzle_orm_1.eq)(schema_1.easterEggUnlocks.id, unlockId));
            res.json({ success: true, rewardApplied });
        }
        catch (error) {
            console.error('Error claiming Easter egg reward:', error);
            res.status(500).json({ error: 'Failed to claim reward' });
        }
    });
    // =============================================
    // INVESTMENT CLUBS API ROUTES
    // =============================================
    const { investmentClubService } = await Promise.resolve().then(() => __importStar(require('./services/investmentClubService.js')));
    const { insertInvestmentClubSchema, insertClubProposalSchema } = await Promise.resolve().then(() => __importStar(require('@shared/schema.js')));
    // Create new investment club
    app.post('/api/investment-clubs/create', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, description, minMembers, initialMembers } = req.body;
            const club = await investmentClubService.createClub(userId, {
                name,
                description,
                minMembers: minMembers || 3
            }, initialMembers || []);
            res.json(club);
        }
        catch (error) {
            console.error('Error creating investment club:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Get user's clubs
    app.get('/api/investment-clubs', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.id;
            const clubs = await storage_1.storage.getUserInvestmentClubs(userId);
            res.json(clubs);
        }
        catch (error) {
            console.error('Error fetching user clubs:', error);
            res.status(500).json({ error: 'Failed to fetch clubs' });
        }
    });
    // Get club details
    app.get('/api/investment-clubs/:id', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const club = await storage_1.storage.getInvestmentClub(id);
            if (!club) {
                return res.status(404).json({ error: 'Club not found' });
            }
            const membership = await storage_1.storage.getClubMembership(id, userId);
            if (!membership) {
                return res.status(403).json({ error: 'Not a member of this club' });
            }
            const members = await storage_1.storage.getClubMemberships(id, 'active');
            const portfolio = await storage_1.storage.getClubPortfolioByClubId(id);
            res.json({
                ...club,
                members,
                portfolio,
                userRole: membership.role
            });
        }
        catch (error) {
            console.error('Error fetching club details:', error);
            res.status(500).json({ error: 'Failed to fetch club details' });
        }
    });
    // Invite member to club
    app.post('/api/investment-clubs/:id/invite', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const { inviteeId } = req.body;
            const inviterId = req.user.id;
            await investmentClubService.inviteMember(id, inviterId, inviteeId);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error inviting member:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Join club (accept invitation)
    app.post('/api/investment-clubs/:id/join', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await investmentClubService.acceptInvitation(id, userId);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error joining club:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Leave club
    app.post('/api/investment-clubs/:id/leave', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await investmentClubService.leaveClub(id, userId);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error leaving club:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Remove member from club
    app.delete('/api/investment-clubs/:id/members/:userId', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id, userId: memberIdToRemove } = req.params;
            const removerId = req.user.id;
            await investmentClubService.removeMember(id, removerId, memberIdToRemove);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error removing member:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Create proposal
    app.post('/api/investment-clubs/:id/proposals', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const proposalData = req.body;
            const proposal = await investmentClubService.createProposal(id, userId, proposalData);
            res.json(proposal);
        }
        catch (error) {
            console.error('Error creating proposal:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Get club proposals
    app.get('/api/investment-clubs/:id/proposals', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const { status, proposalType } = req.query;
            const proposals = await storage_1.storage.getClubProposals(id, {
                status: status,
                proposalType: proposalType
            });
            res.json(proposals);
        }
        catch (error) {
            console.error('Error fetching proposals:', error);
            res.status(500).json({ error: 'Failed to fetch proposals' });
        }
    });
    // Cast vote on proposal
    app.post('/api/investment-clubs/:id/proposals/:proposalId/vote', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { proposalId } = req.params;
            const { vote } = req.body;
            const userId = req.user.id;
            if (!['for', 'against', 'abstain'].includes(vote)) {
                return res.status(400).json({ error: 'Invalid vote type' });
            }
            await investmentClubService.castVote(proposalId, userId, vote);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error casting vote:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Get club activity log
    app.get('/api/investment-clubs/:id/activity', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const { limit } = req.query;
            const userId = req.user.id;
            const membership = await storage_1.storage.getClubMembership(id, userId);
            if (!membership) {
                return res.status(403).json({ error: 'Not a member of this club' });
            }
            const activityLog = await storage_1.storage.getClubActivityLog(id, limit ? parseInt(limit) : 50);
            res.json(activityLog);
        }
        catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ error: 'Failed to fetch activity log' });
        }
    });
    // Dissolve club (owner only)
    app.post('/api/investment-clubs/:id/dissolve', replitAuth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await investmentClubService.dissolveClub(id, userId);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error dissolving club:', error);
            res.status(400).json({ error: error.message });
        }
    });
    // Price History Routes - Historical pricing data for graded comics
    // Get price history for specific asset and grade
    app.get('/api/price-history/:assetId', async (req, res) => {
        try {
            const { assetId } = req.params;
            const { grade, days } = req.query;
            if (!grade) {
                return res.status(400).json({ error: 'Grade parameter is required' });
            }
            const daysNum = days ? parseInt(days) : 30;
            if (isNaN(daysNum) || daysNum <= 0) {
                return res.status(400).json({ error: 'Days must be a positive number' });
            }
            const pricePoints = await storage_1.storage.getPriceHistory(assetId, grade, daysNum);
            if (pricePoints.length === 0) {
                return res.json({
                    assetId,
                    grade,
                    pricePoints: [],
                    stats: {
                        percentChange: 0,
                        high: 0,
                        low: 0
                    }
                });
            }
            const prices = pricePoints.map(p => parseFloat(p.price));
            const currentPrice = prices[0];
            const oldestPrice = prices[prices.length - 1];
            const high = Math.max(...prices);
            const low = Math.min(...prices);
            const percentChange = oldestPrice > 0 ? ((currentPrice - oldestPrice) / oldestPrice) * 100 : 0;
            res.json({
                assetId,
                grade,
                pricePoints: pricePoints.map(p => ({
                    date: p.snapshotDate,
                    price: parseFloat(p.price)
                })),
                stats: {
                    percentChange: parseFloat(percentChange.toFixed(2)),
                    high: parseFloat(high.toFixed(2)),
                    low: parseFloat(low.toFixed(2))
                }
            });
        }
        catch (error) {
            console.error('Error fetching price history:', error);
            res.status(500).json({ error: 'Failed to fetch price history' });
        }
    });
    // Get latest prices for all grades of an asset
    app.get('/api/price-history/:assetId/grades', async (req, res) => {
        try {
            const { assetId } = req.params;
            const latestPrices = await storage_1.storage.getLatestPricesByGrade(assetId);
            res.json({
                assetId,
                grades: latestPrices.map(p => ({
                    grade: p.grade,
                    price: parseFloat(p.price),
                    lastUpdated: p.snapshotDate
                }))
            });
        }
        catch (error) {
            console.error('Error fetching latest prices by grade:', error);
            res.status(500).json({ error: 'Failed to fetch latest prices by grade' });
        }
    });
    // Get price trends for an asset over a specified timeframe
    app.get('/api/price-history/:assetId/trends/:timeframe', async (req, res) => {
        try {
            const { assetId, timeframe } = req.params;
            if (!['30d', '90d', '1y'].includes(timeframe)) {
                return res.status(400).json({
                    error: 'Invalid timeframe. Must be one of: 30d, 90d, 1y'
                });
            }
            const trends = await storage_1.storage.getPriceTrends(assetId, timeframe);
            res.json(trends);
        }
        catch (error) {
            console.error('Error fetching price trends:', error);
            res.status(500).json({ error: 'Failed to fetch price trends' });
        }
    });
    // Villains & Henchmen Routes - Narrative Entities System
    // Get list of villains and henchmen
    app.get('/api/narrative/villains', async (req, res) => {
        try {
            const villains = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                alternateImageUrls: schema_1.narrativeEntities.alternateImageUrls,
                biography: schema_1.narrativeEntities.biography,
                teams: schema_1.narrativeEntities.teams,
                enemies: schema_1.narrativeEntities.enemies,
                assetImageUrl: schema_1.assets.imageUrl,
                assetCoverImageUrl: schema_1.assets.coverImageUrl,
                assetId: schema_1.assets.id,
                assetSymbol: schema_1.assets.symbol,
                assetPrice: schema_1.assetCurrentPrices.currentPrice,
                assetPriceChange: schema_1.assetCurrentPrices.dayChangePercent,
            })
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'character'), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'villain'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'henchman'))))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.narrativeEntities.popularityScore))
                .limit(20);
            res.json({
                success: true,
                data: villains
            });
        }
        catch (error) {
            console.error('Error fetching villains:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch villains'
            });
        }
    });
    // Get location-gadget pairs with relationship narratives
    app.get('/api/narrative/location-gadget-pairs', async (req, res) => {
        try {
            // Fetch locations from marvel_locations table
            const locations = await databaseStorage_1.db
                .select({
                id: schema_1.marvelLocations.id,
                canonicalName: schema_1.marvelLocations.name,
                entityType: (0, drizzle_orm_1.sql) `'location'`,
                subtype: schema_1.marvelLocations.locationType,
                universe: schema_1.marvelLocations.primaryUniverse,
                primaryImageUrl: schema_1.marvelLocations.imageUrl,
                alternateImageUrls: (0, drizzle_orm_1.sql) `NULL`,
                biography: schema_1.marvelLocations.description,
                assetImageUrl: schema_1.marvelLocations.imageUrl,
                assetCoverImageUrl: schema_1.marvelLocations.imageUrl,
                assetId: schema_1.marvelLocations.id,
                assetSymbol: schema_1.marvelLocations.symbol,
                assetPrice: schema_1.marvelLocations.currentPrice,
                assetPriceChange: (0, drizzle_orm_1.sql) `NULL`,
            })
                .from(schema_1.marvelLocations)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.marvelLocations.tier))
                .limit(10);
            // Fetch gadgets from marvel_gadgets table
            const gadgets = await databaseStorage_1.db
                .select({
                id: schema_1.marvelGadgets.id,
                canonicalName: schema_1.marvelGadgets.name,
                entityType: (0, drizzle_orm_1.sql) `'gadget'`,
                subtype: schema_1.marvelGadgets.gadgetCategory,
                universe: (0, drizzle_orm_1.sql) `NULL`,
                primaryImageUrl: schema_1.marvelGadgets.imageUrl,
                alternateImageUrls: (0, drizzle_orm_1.sql) `NULL`,
                biography: schema_1.marvelGadgets.description,
                assetImageUrl: schema_1.marvelGadgets.imageUrl,
                assetCoverImageUrl: schema_1.marvelGadgets.imageUrl,
                assetId: schema_1.marvelGadgets.id,
                assetSymbol: schema_1.marvelGadgets.symbol,
                assetPrice: schema_1.marvelGadgets.currentPrice,
                assetPriceChange: (0, drizzle_orm_1.sql) `NULL`,
            })
                .from(schema_1.marvelGadgets)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.marvelGadgets.tier))
                .limit(10);
            const pairs = [];
            for (const location of locations.slice(0, 4)) {
                // Find matching gadget from same universe
                const gadget = gadgets.find(g => g.universe === location.universe) || gadgets[0];
                if (gadget) {
                    pairs.push({
                        location,
                        gadget,
                        relationship: {
                            firstAppearance: `${location.universe || 'Marvel'} Comics`,
                            keyIssues: [`Iconic scenes set in ${location.canonicalName}`, `${gadget.canonicalName} deployed at location`],
                            creators: ['Stan Lee', 'Jack Kirby'],
                            franchise: location.universe || 'Marvel',
                            summary: `${location.canonicalName} serves as a pivotal setting where ${gadget.canonicalName} has been deployed in critical moments within the ${location.universe || 'Marvel'} universe.`,
                            priceImpact: '+6.7%'
                        }
                    });
                }
            }
            res.json({ success: true, data: pairs });
        }
        catch (error) {
            console.error('Error fetching location-gadget pairs:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch location-gadget pairs'
            });
        }
    });
    // Get sidekick-superhero pairs with relationship narratives
    app.get('/api/narrative/sidekick-superhero-pairs', async (req, res) => {
        try {
            // Fetch sidekicks and superheroes separately
            const allEntities = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                alternateImageUrls: schema_1.narrativeEntities.alternateImageUrls,
                biography: schema_1.narrativeEntities.biography,
                teams: schema_1.narrativeEntities.teams,
                allies: schema_1.narrativeEntities.allies,
                assetImageUrl: schema_1.assets.imageUrl,
                assetCoverImageUrl: schema_1.assets.coverImageUrl,
                assetId: schema_1.assets.id,
                assetSymbol: schema_1.assets.symbol,
                assetPrice: schema_1.assetCurrentPrices.currentPrice,
                assetPriceChange: schema_1.assetCurrentPrices.dayChangePercent,
            })
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'character'), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'sidekick'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'superhero'))))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.narrativeEntities.popularityScore));
            // Create hero pairs/singles
            const sidekicks = allEntities.filter(e => e.subtype === 'sidekick');
            const superheroes = allEntities.filter(e => e.subtype === 'superhero');
            const pairs = [];
            for (const superhero of superheroes) {
                // Try to find sidekick who shares a team
                const sidekick = sidekicks.find(s => s.teams && superhero.teams &&
                    s.teams.some(team => superhero.teams?.includes(team)));
                if (sidekick) {
                    // Team pair
                    const sharedTeam = superhero.teams?.find(team => sidekick.teams?.includes(team)) || superhero.universe;
                    pairs.push({
                        superhero,
                        sidekick,
                        relationship: {
                            firstAppearance: `${superhero.universe} Comics`,
                            keyIssues: [`${sharedTeam} formation`, `Iconic partnership moments`],
                            creators: ['Stan Lee', 'Jack Kirby'],
                            franchise: superhero.universe,
                            summary: `${superhero.canonicalName} and ${sidekick.canonicalName} form a legendary heroic partnership as members of ${sharedTeam}, inspiring generations with their teamwork and courage.`,
                            priceImpact: '+8.3%'
                        }
                    });
                }
                else {
                    // Solo hero
                    pairs.push({
                        superhero,
                        sidekick: null,
                        relationship: {
                            firstAppearance: `${superhero.universe} Comics`,
                            keyIssues: [`Solo heroic debut`, `Legendary solo missions`],
                            creators: ['Stan Lee', 'Jack Kirby'],
                            franchise: superhero.universe,
                            summary: `${superhero.canonicalName} stands as a solo champion in the ${superhero.universe} universe, protecting the innocent with unwavering resolve.`,
                            priceImpact: '+8.3%'
                        }
                    });
                }
            }
            res.json({ success: true, data: pairs });
        }
        catch (error) {
            console.error('Error fetching sidekick-superhero pairs:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch sidekick-superhero pairs'
            });
        }
    });
    // Get villain-henchman pairs with relationship narratives
    app.get('/api/narrative/villain-henchman-pairs', async (req, res) => {
        try {
            // Fetch villains and henchmen separately
            const allEntities = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                alternateImageUrls: schema_1.narrativeEntities.alternateImageUrls,
                biography: schema_1.narrativeEntities.biography,
                teams: schema_1.narrativeEntities.teams,
                enemies: schema_1.narrativeEntities.enemies,
                allies: schema_1.narrativeEntities.allies,
                firstAppearance: schema_1.narrativeEntities.firstAppearance,
                creators: schema_1.narrativeEntities.creators,
                assetImageUrl: schema_1.assets.imageUrl,
                assetCoverImageUrl: schema_1.assets.coverImageUrl,
                assetId: schema_1.assets.id,
                assetSymbol: schema_1.assets.symbol,
                assetPrice: schema_1.assetCurrentPrices.currentPrice,
                assetPriceChange: schema_1.assetCurrentPrices.dayChangePercent,
            })
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'character'), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'villain'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'henchman'))))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.narrativeEntities.popularityScore));
            // Separate villains and henchmen
            const villains = allEntities.filter(e => e.subtype === 'villain');
            const henchmen = allEntities.filter(e => e.subtype === 'henchman');
            const pairs = [];
            const usedHenchmen = new Set();
            // Pair each villain with an available henchman
            for (const villain of villains) {
                const henchman = henchmen.find(h => !usedHenchmen.has(h.id));
                if (henchman) {
                    usedHenchmen.add(henchman.id);
                    const relationships = [`${villain.canonicalName} & ${henchman.canonicalName}`];
                    if (villain.enemies && villain.enemies.length > 0)
                        relationships.push(`vs ${villain.enemies[0]}`);
                    pairs.push({
                        villain,
                        henchman,
                        relationship: {
                            firstAppearance: villain.firstAppearance || `${villain.universe} Comics`,
                            keyIssues: [`${villain.canonicalName}'s criminal operations`, `${henchman.canonicalName} as enforcer`],
                            creators: villain.creators && villain.creators.length > 0 ? villain.creators : ['Unknown'],
                            franchise: villain.universe,
                            summary: `${henchman.canonicalName} serves as loyal enforcer for ${villain.canonicalName}, carrying out villainous schemes across the ${villain.universe} universe.`,
                            relationships,
                            assetPrice: villain.assetPrice,
                            assetPriceChange: villain.assetPriceChange
                        }
                    });
                }
                else {
                    // Standalone villain
                    const relationships = [];
                    if (villain.allies && villain.allies.length > 0)
                        relationships.push(`${villain.canonicalName} & ${villain.allies[0]}`);
                    if (villain.enemies && villain.enemies.length > 0)
                        relationships.push(`vs ${villain.enemies[0]}`);
                    pairs.push({
                        villain,
                        henchman: null,
                        relationship: {
                            firstAppearance: villain.firstAppearance || `${villain.universe} Comics`,
                            keyIssues: [`Criminal mastermind`],
                            creators: villain.creators && villain.creators.length > 0 ? villain.creators : ['Unknown'],
                            franchise: villain.universe,
                            summary: `${villain.canonicalName} terrorizes the ${villain.universe} universe with cunning schemes and ruthless ambition.`,
                            relationships: relationships.length > 0 ? relationships : [`${villain.canonicalName}`],
                            assetPrice: villain.assetPrice,
                            assetPriceChange: villain.assetPriceChange
                        }
                    });
                }
            }
            // Add standalone henchmen
            for (const henchman of henchmen) {
                if (!usedHenchmen.has(henchman.id)) {
                    const relationships = [`${henchman.canonicalName}`];
                    if (henchman.allies && henchman.allies.length > 0)
                        relationships.push(`${henchman.canonicalName} & ${henchman.allies[0]}`);
                    pairs.push({
                        villain: null,
                        henchman,
                        relationship: {
                            firstAppearance: henchman.firstAppearance || `${henchman.universe} Comics`,
                            keyIssues: [`Freelance enforcer`],
                            creators: henchman.creators && henchman.creators.length > 0 ? henchman.creators : ['Unknown'],
                            franchise: henchman.universe,
                            summary: `${henchman.canonicalName} operates as a freelance enforcer in the ${henchman.universe} criminal underworld.`,
                            relationships,
                            assetPrice: henchman.assetPrice,
                            assetPriceChange: henchman.assetPriceChange
                        }
                    });
                }
            }
            res.json({ success: true, data: pairs });
        }
        catch (error) {
            console.error('Error fetching villain-henchman pairs:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch villain-henchman pairs'
            });
        }
    });
    // Get single featured villain/henchman
    app.get('/api/narrative/featured-villain', async (req, res) => {
        try {
            // Fetch a random villain, supervillain, franchise_villain, or henchman
            const allCharacters = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                biography: schema_1.narrativeEntities.biography,
                firstAppearance: schema_1.narrativeEntities.firstAppearance,
                creators: schema_1.narrativeEntities.creators,
            })
                .from(schema_1.narrativeEntities)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'character'), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'villain'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'supervillain'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'franchise_villain'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'henchman'))))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.narrativeEntities.popularityScore))
                .limit(20);
            if (allCharacters.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'No characters found'
                });
            }
            // Select a random character from the top 20
            const character = allCharacters[Math.floor(Math.random() * allCharacters.length)];
            // Format creators as array of objects with name and id
            const formattedCreators = character.creators && Array.isArray(character.creators)
                ? character.creators.map((creatorName) => ({
                    name: creatorName,
                    id: creatorName.toLowerCase().replace(/\s+/g, '-')
                }))
                : [];
            // Determine publisher and publisher ID (use universe as publisher)
            const publisher = character.universe || 'Unknown';
            const publisherId = publisher.toLowerCase().replace(/\s+/g, '-');
            res.json({
                success: true,
                data: {
                    id: character.id,
                    canonicalName: character.canonicalName,
                    type: character.subtype,
                    universe: character.universe,
                    publisher,
                    publisherId,
                    primaryImageUrl: character.primaryImageUrl,
                    biography: character.biography,
                    firstAppearance: character.firstAppearance,
                    creators: formattedCreators,
                }
            });
        }
        catch (error) {
            console.error('Error fetching featured villain:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch featured villain'
            });
        }
    });
    // Get franchise/universe information
    app.get('/api/narrative/franchise/:name', async (req, res) => {
        try {
            const franchiseName = decodeURIComponent(req.params.name);
            // Get all entities from this franchise
            const entities = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                entityType: schema_1.narrativeEntities.entityType,
                subtype: schema_1.narrativeEntities.subtype,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                assetId: schema_1.narrativeEntities.assetId,
            })
                .from(schema_1.narrativeEntities)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.universe, franchiseName))
                .limit(50);
            // Get character count
            const characters = entities.filter(e => e.entityType === 'character');
            const creators = entities.filter(e => e.entityType === 'creator');
            const locations = entities.filter(e => e.entityType === 'location');
            res.json({
                success: true,
                data: {
                    name: franchiseName,
                    totalEntities: entities.length,
                    characterCount: characters.length,
                    creatorCount: creators.length,
                    locationCount: locations.length,
                    entities: entities,
                }
            });
        }
        catch (error) {
            console.error('Error fetching franchise:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch franchise information'
            });
        }
    });
    // Get single villain detail with powers and market data
    app.get('/api/narrative/villain/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Get villain entity
            const [villain] = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!villain) {
                return res.status(404).json({
                    success: false,
                    error: 'Villain not found'
                });
            }
            // Get villain's powers and weaknesses
            const traits = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeTraits)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeTraits.entityId, id));
            res.json({
                success: true,
                data: {
                    ...villain.narrativeEntities,
                    asset: villain.assets,
                    powers: traits.filter(t => t.traitCategory === 'power'),
                    weaknesses: traits.filter(t => t.traitCategory === 'weakness'),
                    skills: traits.filter(t => t.traitCategory === 'skill'),
                    equipment: traits.filter(t => t.traitCategory === 'equipment'),
                }
            });
        }
        catch (error) {
            console.error('Error fetching villain detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch villain detail'
            });
        }
    });
    // Sidekicks & Superheroes Routes - Narrative Entities System
    // Get list of sidekicks and superheroes
    app.get('/api/narrative/sidekicks', async (req, res) => {
        try {
            const heroes = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                alternateImageUrls: schema_1.narrativeEntities.alternateImageUrls,
                biography: schema_1.narrativeEntities.biography,
                teams: schema_1.narrativeEntities.teams,
                allies: schema_1.narrativeEntities.allies,
                assetImageUrl: schema_1.assets.imageUrl,
                assetCoverImageUrl: schema_1.assets.coverImageUrl,
                assetId: schema_1.assets.id,
                assetSymbol: schema_1.assets.symbol,
                assetPrice: schema_1.assetCurrentPrices.currentPrice,
                assetPriceChange: schema_1.assetCurrentPrices.dayChangePercent,
            })
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'character'), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'sidekick'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.subtype, 'hero'))))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.narrativeEntities.popularityScore))
                .limit(20);
            res.json({
                success: true,
                data: heroes
            });
        }
        catch (error) {
            console.error('Error fetching sidekicks/superheroes:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch sidekicks/superheroes'
            });
        }
    });
    // Get single superhero detail with powers and market data
    app.get('/api/narrative/superhero/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Get superhero entity
            const [hero] = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!hero) {
                return res.status(404).json({
                    success: false,
                    error: 'Superhero not found'
                });
            }
            // Get superhero's powers and weaknesses
            const traits = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeTraits)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeTraits.entityId, id));
            res.json({
                success: true,
                data: {
                    ...hero.narrativeEntities,
                    asset: hero.assets,
                    powers: traits.filter(t => t.traitCategory === 'power'),
                    weaknesses: traits.filter(t => t.traitCategory === 'weakness'),
                    skills: traits.filter(t => t.traitCategory === 'skill'),
                    equipment: traits.filter(t => t.traitCategory === 'equipment'),
                }
            });
        }
        catch (error) {
            console.error('Error fetching superhero detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch superhero detail'
            });
        }
    });
    // DATA VERIFICATION ENDPOINTS - Multi-source verification for 401,666 assets
    app.post('/api/narrative/verify-entity/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { multiSourceVerification } = await Promise.resolve().then(() => __importStar(require('./services/multiSourceDataVerification.js')));
            // Get entity name
            const [entity] = await databaseStorage_1.db
                .select({ id: schema_1.narrativeEntities.id, name: schema_1.narrativeEntities.canonicalName })
                .from(schema_1.narrativeEntities)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!entity) {
                return res.status(404).json({ success: false, error: 'Entity not found' });
            }
            const result = await multiSourceVerification.verifyEntity(entity.id, entity.name);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error('Error verifying entity:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to verify entity'
            });
        }
    });
    app.post('/api/narrative/batch-verify', async (req, res) => {
        try {
            const { entityIds } = req.body;
            const { multiSourceVerification } = await Promise.resolve().then(() => __importStar(require('./services/multiSourceDataVerification.js')));
            if (!entityIds || !Array.isArray(entityIds)) {
                return res.status(400).json({ success: false, error: 'entityIds array required' });
            }
            // Get entity names
            const entities = await databaseStorage_1.db
                .select({ id: schema_1.narrativeEntities.id, name: schema_1.narrativeEntities.canonicalName })
                .from(schema_1.narrativeEntities)
                .where(inArray(schema_1.narrativeEntities.id, entityIds));
            const results = await multiSourceVerification.batchVerify(entities, 3);
            res.json({
                success: true,
                data: {
                    verified: results.length,
                    results
                }
            });
        }
        catch (error) {
            console.error('Error batch verifying entities:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to batch verify entities'
            });
        }
    });
    // Verify all unverified entities (for mass verification)
    app.post('/api/narrative/verify-all-unverified', async (req, res) => {
        try {
            const { limit = 100 } = req.body;
            const { multiSourceVerification } = await Promise.resolve().then(() => __importStar(require('./services/multiSourceDataVerification.js')));
            // Get unverified entities
            const entities = await databaseStorage_1.db
                .select({ id: schema_1.narrativeEntities.id, name: schema_1.narrativeEntities.canonicalName })
                .from(schema_1.narrativeEntities)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.verificationStatus, 'unverified'))
                .limit(limit);
            const results = await multiSourceVerification.batchVerify(entities, 5);
            res.json({
                success: true,
                data: {
                    totalUnverified: entities.length,
                    verified: results.length,
                    results
                }
            });
        }
        catch (error) {
            console.error('Error verifying all unverified entities:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to verify unverified entities'
            });
        }
    });
    // ==========================================
    // INDUSTRIAL-STRENGTH VERIFICATION ENDPOINTS
    // Queue-based verification for 401,666 assets
    // ==========================================
    // Queue entity for verification (async, resilient)
    app.post('/api/narrative/queue-verification/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { forceRefresh = false, priority = 0 } = req.body;
            const { entityVerificationQueue } = await Promise.resolve().then(() => __importStar(require('./queue/queues.js')));
            const [entity] = await databaseStorage_1.db
                .select({ id: schema_1.narrativeEntities.id, name: schema_1.narrativeEntities.canonicalName, type: schema_1.narrativeEntities.entityType })
                .from(schema_1.narrativeEntities)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!entity) {
                return res.status(404).json({ success: false, error: 'Entity not found' });
            }
            const job = await entityVerificationQueue.add('verify-entity', {
                entityId: entity.id,
                canonicalName: entity.name,
                entityType: entity.type,
                forceRefresh,
                priority,
            }, {
                priority,
            });
            res.json({
                success: true,
                data: {
                    jobId: job.id,
                    entityId: entity.id,
                    entityName: entity.name,
                    queued: true,
                }
            });
        }
        catch (error) {
            console.error('Error queueing verification:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to queue verification'
            });
        }
    });
    // Queue batch verification (async, resilient, scalable)
    app.post('/api/narrative/queue-batch-verification', async (req, res) => {
        try {
            const { limit = 1000, skipRecentlyVerified = true, maxAgeHours = 168 } = req.body;
            const { entityVerificationQueue } = await Promise.resolve().then(() => __importStar(require('./queue/queues.js')));
            let query = databaseStorage_1.db
                .select({ id: schema_1.narrativeEntities.id, name: schema_1.narrativeEntities.canonicalName, type: schema_1.narrativeEntities.entityType })
                .from(schema_1.narrativeEntities);
            if (skipRecentlyVerified) {
                const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
                query = query.where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.verificationStatus, 'unverified'), (0, drizzle_orm_1.lt)(schema_1.narrativeEntities.lastVerifiedAt, cutoffDate)));
            }
            const entities = await query.limit(limit);
            const jobs = await Promise.all(entities.map((entity, index) => entityVerificationQueue.add('verify-entity', {
                entityId: entity.id,
                canonicalName: entity.name,
                entityType: entity.type,
                forceRefresh: false,
                priority: 0,
            }, {
                priority: 0,
                delay: index * 100,
            })));
            res.json({
                success: true,
                data: {
                    queued: jobs.length,
                    jobIds: jobs.map(j => j.id),
                    entities: entities.map(e => ({ id: e.id, name: e.name })),
                }
            });
        }
        catch (error) {
            console.error('Error queueing batch verification:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to queue batch verification'
            });
        }
    });
    // Get verification job status
    app.get('/api/narrative/verification-job/:jobId', async (req, res) => {
        try {
            const { jobId } = req.params;
            const { entityVerificationQueue } = await Promise.resolve().then(() => __importStar(require('./queue/queues.js')));
            const job = await entityVerificationQueue.getJob(jobId);
            if (!job) {
                return res.status(404).json({ success: false, error: 'Job not found' });
            }
            const state = await job.getState();
            const progress = job.progress;
            const returnValue = job.returnvalue;
            const failedReason = job.failedReason;
            res.json({
                success: true,
                data: {
                    jobId: job.id,
                    state,
                    progress,
                    data: job.data,
                    result: returnValue,
                    error: failedReason,
                    timestamp: job.timestamp,
                    processedOn: job.processedOn,
                    finishedOn: job.finishedOn,
                }
            });
        }
        catch (error) {
            console.error('Error fetching job status:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch job status'
            });
        }
    });
    // Start bulk verification process (545k+ items)
    app.post('/api/bulk-verification/start', async (req, res) => {
        try {
            const { tableType = 'assets', batchSize = 500, delayBetweenBatches = 2000, totalBatches = 1100 } = req.body;
            if (tableType !== 'assets' && tableType !== 'creators') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid tableType. Must be "assets" or "creators"'
                });
            }
            const { bulkVerificationService } = await Promise.resolve().then(() => __importStar(require('./services/bulkVerificationService.js')));
            const result = await bulkVerificationService.startBulkVerification(tableType, batchSize, delayBetweenBatches, totalBatches);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error('Error starting bulk verification:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to start bulk verification'
            });
        }
    });
    // Get bulk verification progress
    app.get('/api/bulk-verification/progress/:jobId?', async (req, res) => {
        try {
            const { jobId } = req.params;
            const { bulkVerificationService } = await Promise.resolve().then(() => __importStar(require('./services/bulkVerificationService.js')));
            if (jobId) {
                const progress = bulkVerificationService.getProgress(jobId);
                if (!progress) {
                    return res.status(404).json({
                        success: false,
                        error: 'Job not found'
                    });
                }
                res.json({
                    success: true,
                    data: progress
                });
            }
            else {
                const allProgress = bulkVerificationService.getAllProgress();
                res.json({
                    success: true,
                    data: allProgress
                });
            }
        }
        catch (error) {
            console.error('Error fetching bulk verification progress:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch progress'
            });
        }
    });
    // Stop bulk verification process
    app.post('/api/bulk-verification/stop/:jobId', async (req, res) => {
        try {
            const { jobId } = req.params;
            const { bulkVerificationService } = await Promise.resolve().then(() => __importStar(require('./services/bulkVerificationService.js')));
            const stopped = await bulkVerificationService.stopBulkVerification(jobId);
            if (!stopped) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found or already stopped'
                });
            }
            res.json({
                success: true,
                message: `Bulk verification job ${jobId} stopped`
            });
        }
        catch (error) {
            console.error('Error stopping bulk verification:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to stop bulk verification'
            });
        }
    });
    // Get verification queue metrics
    app.get('/api/narrative/verification-metrics', async (req, res) => {
        try {
            const { entityVerificationQueue } = await Promise.resolve().then(() => __importStar(require('./queue/queues.js')));
            const { resilientApiClient } = await Promise.resolve().then(() => __importStar(require('./services/resilientApiClient.js')));
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                entityVerificationQueue.getWaitingCount(),
                entityVerificationQueue.getActiveCount(),
                entityVerificationQueue.getCompletedCount(),
                entityVerificationQueue.getFailedCount(),
                entityVerificationQueue.getDelayedCount(),
            ]);
            const circuitBreakerStatus = resilientApiClient.getCircuitBreakerStatus();
            res.json({
                success: true,
                data: {
                    queue: {
                        waiting,
                        active,
                        completed,
                        failed,
                        delayed,
                        total: waiting + active + completed + failed + delayed,
                    },
                    circuitBreakers: circuitBreakerStatus,
                }
            });
        }
        catch (error) {
            console.error('Error fetching verification metrics:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch verification metrics'
            });
        }
    });
    // Reset circuit breaker for a specific source
    app.post('/api/narrative/reset-circuit-breaker/:source', async (req, res) => {
        try {
            const { source } = req.params;
            const { resilientApiClient } = await Promise.resolve().then(() => __importStar(require('./services/resilientApiClient.js')));
            resilientApiClient.resetCircuitBreaker(source);
            res.json({
                success: true,
                message: `Circuit breaker reset for ${source}`,
            });
        }
        catch (error) {
            console.error('Error resetting circuit breaker:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to reset circuit breaker'
            });
        }
    });
    // ============================================
    // GOCOLLECT GRADED COMICS API
    // ============================================
    // Get recent graded comic sales (CGC, CBCS, PGX)
    app.get('/api/gocollect/sales/recent', async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const { goCollectService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectService.js')));
            const sales = await goCollectService.getRecentSales(limit);
            res.json({
                success: true,
                data: {
                    sales,
                    count: sales.length,
                    graders: {
                        cgc: sales.filter(s => s.grader === 'CGC').length,
                        cbcs: sales.filter(s => s.grader === 'CBCS').length,
                        pgx: sales.filter(s => s.grader === 'PGX').length,
                    }
                }
            });
        }
        catch (error) {
            console.error('Error fetching GoCollect sales:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch sales data'
            });
        }
    });
    // Get market data for specific issue
    app.get('/api/gocollect/market-data', async (req, res) => {
        try {
            const { comic, issue, grader } = req.query;
            if (!comic || !issue) {
                return res.status(400).json({
                    success: false,
                    error: 'comic and issue parameters required'
                });
            }
            const { goCollectService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectService.js')));
            const marketData = await goCollectService.getMarketDataByIssue(comic, issue, grader);
            if (!marketData) {
                return res.status(404).json({
                    success: false,
                    error: 'Market data not found for this issue'
                });
            }
            res.json({
                success: true,
                data: marketData
            });
        }
        catch (error) {
            console.error('Error fetching market data:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch market data'
            });
        }
    });
    // Get trending graded comics
    app.get('/api/gocollect/trending', async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const { goCollectService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectService.js')));
            const trending = await goCollectService.getTrendingGradedComics(limit);
            res.json({
                success: true,
                data: {
                    trending,
                    count: trending.length
                }
            });
        }
        catch (error) {
            console.error('Error fetching trending comics:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch trending data'
            });
        }
    });
    // Get grader statistics (CGC, CBCS, PGX breakdown)
    app.get('/api/gocollect/grader-stats', async (req, res) => {
        try {
            const { goCollectService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectService.js')));
            const stats = await goCollectService.getGraderStatistics();
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Error fetching grader statistics:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch grader statistics'
            });
        }
    });
    // Get price history for specific graded comic
    app.get('/api/gocollect/price-history', async (req, res) => {
        try {
            const { comic, issue, grade, grader, days } = req.query;
            if (!comic || !issue || !grade) {
                return res.status(400).json({
                    success: false,
                    error: 'comic, issue, and grade parameters required'
                });
            }
            const { goCollectService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectService.js')));
            const history = await goCollectService.getPriceHistory(comic, issue, grade, grader || 'CGC', days ? parseInt(days) : 365);
            res.json({
                success: true,
                data: {
                    history,
                    count: history.length,
                    period: `${days || 365} days`
                }
            });
        }
        catch (error) {
            console.error('Error fetching price history:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch price history'
            });
        }
    });
    // Get census data for a comic
    app.get('/api/gocollect/census/:comicId', async (req, res) => {
        try {
            const { comicId } = req.params;
            const { goCollectService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectService.js')));
            const census = await goCollectService.getCensusData(comicId);
            if (!census) {
                return res.status(404).json({
                    success: false,
                    error: 'Census data not found'
                });
            }
            res.json({
                success: true,
                data: census
            });
        }
        catch (error) {
            console.error('Error fetching census data:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch census data'
            });
        }
    });
    // ============================================
    // GOCOLLECT ASSET EXPANSION
    // ============================================
    // Expand trending comics into graded assets
    app.post('/api/gocollect/expand/trending', async (req, res) => {
        try {
            const limit = parseInt(req.body.limit) || 100;
            const { goCollectExpansionService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectExpansionService.js')));
            console.log(`🚀 Starting GoCollect expansion for ${limit} trending comics...`);
            const result = await goCollectExpansionService.expandTrendingComics(limit);
            res.json({
                success: true,
                message: `Expanded ${result.comicsProcessed} comics into ${result.totalCreated} new graded assets`,
                data: result
            });
        }
        catch (error) {
            console.error('Error expanding trending comics:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to expand trending comics'
            });
        }
    });
    // Expand specific comic into all graded variants
    app.post('/api/gocollect/expand/comic', async (req, res) => {
        try {
            const { title, issueNumber, publisher, year, coverDate, comicId } = req.body;
            if (!title || !issueNumber || !publisher) {
                return res.status(400).json({
                    success: false,
                    error: 'title, issueNumber, and publisher are required'
                });
            }
            const { goCollectExpansionService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectExpansionService.js')));
            const result = await goCollectExpansionService.expandComicToGradedAssets({
                comicId: comicId || `${title}-${issueNumber}`,
                title,
                issueNumber,
                publisher,
                year: year || new Date().getFullYear(),
                coverDate
            });
            res.json({
                success: true,
                message: `Created ${result.created} graded assets from ${title} #${issueNumber}`,
                data: result
            });
        }
        catch (error) {
            console.error('Error expanding comic:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to expand comic'
            });
        }
    });
    // Expand entire comic series
    app.post('/api/gocollect/expand/series', async (req, res) => {
        try {
            const { seriesName, startIssue, endIssue } = req.body;
            if (!seriesName) {
                return res.status(400).json({
                    success: false,
                    error: 'seriesName is required'
                });
            }
            const { goCollectExpansionService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectExpansionService.js')));
            const result = await goCollectExpansionService.expandComicSeries(seriesName, startIssue || 1, endIssue || 100);
            res.json({
                success: true,
                message: `Expanded ${seriesName} series`,
                data: result
            });
        }
        catch (error) {
            console.error('Error expanding series:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to expand series'
            });
        }
    });
    // Get graded asset statistics
    app.get('/api/gocollect/expansion/stats', async (req, res) => {
        try {
            const { goCollectExpansionService } = await Promise.resolve().then(() => __importStar(require('./services/goCollectExpansionService.js')));
            const stats = await goCollectExpansionService.getGradedAssetStats();
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Error fetching expansion stats:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch expansion stats'
            });
        }
    });
    // DEMO: Expand existing comics into graded variants
    app.post('/api/gocollect/expand/demo', async (req, res) => {
        try {
            const limit = parseInt(req.body.limit) || 10;
            const { goCollectDemoExpansion } = await Promise.resolve().then(() => __importStar(require('./services/goCollectDemoExpansion.js')));
            console.log(`🚀 Starting DEMO expansion for ${limit} existing comics...`);
            const result = await goCollectDemoExpansion.expandExistingComics(limit);
            res.json({
                success: true,
                message: `Expanded ${result.comicsProcessed} comics into ${result.totalCreated} graded assets`,
                data: result
            });
        }
        catch (error) {
            console.error('Error in demo expansion:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to expand comics'
            });
        }
    });
    // Get single sidekick detail with powers and market data
    app.get('/api/narrative/sidekick/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Get sidekick entity
            const [sidekick] = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!sidekick) {
                return res.status(404).json({
                    success: false,
                    error: 'Sidekick not found'
                });
            }
            // Get sidekick's powers and weaknesses
            const traits = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeTraits)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeTraits.entityId, id));
            res.json({
                success: true,
                data: {
                    ...sidekick.narrativeEntities,
                    asset: sidekick.assets,
                    powers: traits.filter(t => t.traitCategory === 'power'),
                    weaknesses: traits.filter(t => t.traitCategory === 'weakness'),
                    skills: traits.filter(t => t.traitCategory === 'skill'),
                    equipment: traits.filter(t => t.traitCategory === 'equipment'),
                }
            });
        }
        catch (error) {
            console.error('Error fetching sidekick detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch sidekick detail'
            });
        }
    });
    // Locations & Gadgets Routes - Narrative Entities System
    // Get list of locations and gadgets/artifacts
    app.get('/api/narrative/locations', async (req, res) => {
        try {
            const locationsAndGadgets = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                entityType: schema_1.narrativeEntities.entityType,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                alternateImageUrls: schema_1.narrativeEntities.alternateImageUrls,
                description: schema_1.narrativeEntities.description,
                assetImageUrl: schema_1.assets.imageUrl,
                assetCoverImageUrl: schema_1.assets.coverImageUrl,
                assetId: schema_1.assets.id,
                assetSymbol: schema_1.assets.symbol,
                assetPrice: schema_1.assetCurrentPrices.currentPrice,
                assetPriceChange: schema_1.assetCurrentPrices.dayChangePercent,
            })
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'location'), (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.entityType, 'artifact')))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.narrativeEntities.popularityScore))
                .limit(20);
            res.json({
                success: true,
                data: locationsAndGadgets
            });
        }
        catch (error) {
            console.error('Error fetching locations/gadgets:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch locations/gadgets'
            });
        }
    });
    // Get single location detail with traits and market data
    app.get('/api/narrative/location/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Get location entity
            const [location] = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!location) {
                return res.status(404).json({
                    success: false,
                    error: 'Location not found'
                });
            }
            // Get location's notable events and features
            const traits = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeTraits)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeTraits.entityId, id));
            res.json({
                success: true,
                data: {
                    ...location.narrativeEntities,
                    asset: location.assets,
                    notableEvents: traits.filter(t => t.traitCategory === 'event'),
                    features: traits.filter(t => t.traitCategory === 'feature'),
                    associatedCharacters: traits.filter(t => t.traitCategory === 'character_link'),
                }
            });
        }
        catch (error) {
            console.error('Error fetching location detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch location detail'
            });
        }
    });
    // Get single gadget/artifact detail with traits and market data
    app.get('/api/narrative/gadget/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Get gadget entity
            const [gadget] = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!gadget) {
                return res.status(404).json({
                    success: false,
                    error: 'Gadget not found'
                });
            }
            // Get gadget's capabilities and owner info
            const traits = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeTraits)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeTraits.entityId, id));
            res.json({
                success: true,
                data: {
                    ...gadget.narrativeEntities,
                    asset: gadget.assets,
                    capabilities: traits.filter(t => t.traitCategory === 'capability'),
                    features: traits.filter(t => t.traitCategory === 'feature'),
                    owner: traits.filter(t => t.traitCategory === 'owner'),
                }
            });
        }
        catch (error) {
            console.error('Error fetching gadget detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch gadget detail'
            });
        }
    });
    // Unified Entity Detail - Works for any entity type
    app.get('/api/narrative/entity/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Get entity with asset and price data
            const [entity] = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                entityType: schema_1.narrativeEntities.entityType,
                subtype: schema_1.narrativeEntities.subtype,
                universe: schema_1.narrativeEntities.universe,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
                alternateImageUrls: schema_1.narrativeEntities.alternateImageUrls,
                biography: schema_1.narrativeEntities.biography,
                description: schema_1.narrativeEntities.description,
                teams: schema_1.narrativeEntities.teams,
                allies: schema_1.narrativeEntities.allies,
                enemies: schema_1.narrativeEntities.enemies,
                popularityScore: schema_1.narrativeEntities.popularityScore,
                assetId: schema_1.narrativeEntities.assetId,
                asset: {
                    id: schema_1.assets.id,
                    symbol: schema_1.assets.symbol,
                    name: schema_1.assets.name,
                    type: schema_1.assets.type,
                    imageUrl: schema_1.assets.imageUrl,
                    coverImageUrl: schema_1.assets.coverImageUrl,
                },
                price: {
                    current: schema_1.assetCurrentPrices.currentPrice,
                    dayChange: schema_1.assetCurrentPrices.dayChangePercent,
                    weekChange: schema_1.assetCurrentPrices.weekChangePercent,
                    monthChange: schema_1.assetCurrentPrices.monthChangePercent,
                    yearChange: schema_1.assetCurrentPrices.yearChangePercent,
                    lastUpdated: schema_1.assetCurrentPrices.lastUpdated,
                }
            })
                .from(schema_1.narrativeEntities)
                .leftJoin(schema_1.assets, (0, drizzle_orm_1.eq)(schema_1.narrativeEntities.assetId, schema_1.assets.id))
                .leftJoin(schema_1.assetCurrentPrices, (0, drizzle_orm_1.eq)(schema_1.assets.id, schema_1.assetCurrentPrices.assetId))
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, id))
                .limit(1);
            if (!entity) {
                return res.status(404).json({
                    success: false,
                    error: 'Entity not found'
                });
            }
            // Get entity's traits/characteristics
            const traits = await databaseStorage_1.db
                .select()
                .from(schema_1.narrativeTraits)
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeTraits.entityId, id));
            // Get related entities (same universe)
            const relatedEntities = await databaseStorage_1.db
                .select({
                id: schema_1.narrativeEntities.id,
                canonicalName: schema_1.narrativeEntities.canonicalName,
                entityType: schema_1.narrativeEntities.entityType,
                subtype: schema_1.narrativeEntities.subtype,
                primaryImageUrl: schema_1.narrativeEntities.primaryImageUrl,
            })
                .from(schema_1.narrativeEntities)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.universe, entity.universe), ne(schema_1.narrativeEntities.id, id)))
                .limit(6);
            res.json({
                success: true,
                data: {
                    ...entity,
                    traits,
                    relatedEntities
                }
            });
        }
        catch (error) {
            console.error('Error fetching entity detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch entity detail'
            });
        }
    });
    // Creator Affiliation Routes
    app.post('/api/creators/expand/stan-lee', async (req, res) => {
        try {
            const { creatorAffiliationService } = await Promise.resolve().then(() => __importStar(require('./services/creatorAffiliationService')));
            const result = await creatorAffiliationService.expandStanLee();
            res.json({ success: true, ...result });
        }
        catch (error) {
            console.error('Stan Lee expansion error:', error);
            res.status(500).json({ error: error.message });
        }
    });
    app.post('/api/creators/expand/jack-kirby', async (req, res) => {
        try {
            const { creatorAffiliationService } = await Promise.resolve().then(() => __importStar(require('./services/creatorAffiliationService')));
            const result = await creatorAffiliationService.expandJackKirby();
            res.json({ success: true, ...result });
        }
        catch (error) {
            console.error('Jack Kirby expansion error:', error);
            res.status(500).json({ error: error.message });
        }
    });
    // Populate Narrative Entities from existing character data
    app.post('/api/narrative/populate', async (req, res) => {
        try {
            console.log('📚 Starting narrative entities population...');
            // Sample diverse characters with alignment metadata
            const characters = await databaseStorage_1.db
                .select()
                .from(schema_1.assets)
                .where((0, drizzle_orm_1.eq)(schema_1.assets.type, 'character'))
                .limit(100); // Start with 100 characters
            let inserted = 0;
            let skipped = 0;
            for (const char of characters) {
                const metadata = char.metadata;
                if (!metadata || !metadata.alignment) {
                    skipped++;
                    continue;
                }
                // Determine entity type and subtype based on alignment
                let entityType = 'character';
                let subtype = '';
                // Get franchise tier from name/metadata
                const isFranchise = char.franchiseTags && char.franchiseTags.length > 0;
                const hasTeam = char.teamTags && char.teamTags.length > 0;
                if (metadata.alignment === 'Bad') {
                    // Villains (franchise) vs Henchmen (non-franchise)
                    subtype = isFranchise ? 'villain' : 'henchman';
                }
                else if (metadata.alignment === 'Good') {
                    // Superheroes (franchise/team) vs Sidekicks (non-franchise)
                    subtype = (isFranchise || hasTeam) ? 'superhero' : 'sidekick';
                }
                else {
                    // Neutral - can be sidekick
                    subtype = 'sidekick';
                }
                // Check if already exists
                const existing = await databaseStorage_1.db
                    .select()
                    .from(schema_1.narrativeEntities)
                    .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.canonicalName, char.name))
                    .limit(1);
                if (existing.length > 0) {
                    skipped++;
                    continue;
                }
                // Insert into narrative_entities
                await databaseStorage_1.db.insert(schema_1.narrativeEntities).values({
                    canonicalName: char.name,
                    entityType,
                    subtype,
                    universe: metadata.publisher || 'unknown',
                    realName: metadata.realName || null,
                    gender: metadata.gender || null,
                    firstAppearance: metadata.firstAppearance || null,
                    creators: metadata.creators ? [metadata.creators] : [],
                    teams: char.teamTags || [],
                    allies: [],
                    enemies: [],
                    familyMembers: [],
                    assetId: char.id,
                    popularityScore: '0.00',
                    biography: char.biography,
                    description: char.description,
                    primaryImageUrl: char.imageUrl,
                    alternateImageUrls: char.coverImageUrl ? [char.coverImageUrl] : [],
                    verificationStatus: 'verified',
                });
                inserted++;
            }
            console.log(`✅ Population complete: ${inserted} inserted, ${skipped} skipped`);
            res.json({
                success: true,
                inserted,
                skipped,
                total: characters.length
            });
        }
        catch (error) {
            console.error('Error populating narrative entities:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
    // Marvel API Asset Extraction
    app.post('/api/marvel/extract', async (req, res) => {
        try {
            const { characterIds } = req.body;
            if (!characterIds || !Array.isArray(characterIds)) {
                return res.status(400).json({ success: false, error: 'characterIds array required' });
            }
            const { marvelAssetExtractionService } = await Promise.resolve().then(() => __importStar(require('./services/marvelAssetExtractionService.js')));
            console.log(`🦸 Starting Marvel extraction for ${characterIds.length} characters...`);
            const result = await marvelAssetExtractionService.bulkExtractMarvelAssets(characterIds);
            res.json({
                success: true,
                message: `Extracted ${result.totalAssetsCreated} assets from ${result.totalCharacters} Marvel characters`,
                data: result
            });
        }
        catch (error) {
            console.error('Error in Marvel extraction:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // Pinecone Vector Extraction - Extract all 63,934 vectors
    app.post('/api/pinecone/extract', async (req, res) => {
        try {
            const { pineconeAssetExtractionService } = await Promise.resolve().then(() => __importStar(require('./services/pineconeAssetExtractionService.js')));
            console.log('🌲 Starting Pinecone extraction for all 63,934 vectors...');
            const result = await pineconeAssetExtractionService.extractWithPagination();
            res.json({
                success: true,
                message: `Extracted ${result.assetsCreated} assets from ${result.totalVectors} Pinecone vectors`,
                data: result
            });
        }
        catch (error) {
            console.error('Error in Pinecone extraction:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // Marvel Data Population - Fetch fresh Marvel data and populate new tables
    app.post('/api/marvel/populate', async (req, res) => {
        try {
            const { populateAllMarvelData } = await Promise.resolve().then(() => __importStar(require('./services/marvelDataPopulationService.js')));
            const charactersLimit = parseInt(req.body.charactersLimit) || 100;
            const creatorsLimit = parseInt(req.body.creatorsLimit) || 100;
            const comicsLimit = parseInt(req.body.comicsLimit) || 100;
            const seriesLimit = parseInt(req.body.seriesLimit) || 50;
            console.log(`🦸 Starting Marvel data population (${charactersLimit} characters, ${creatorsLimit} creators, ${comicsLimit} comics, ${seriesLimit} series)...`);
            await populateAllMarvelData(charactersLimit, creatorsLimit, comicsLimit, seriesLimit);
            res.json({
                success: true,
                message: `Successfully populated Marvel data`
            });
        }
        catch (error) {
            console.error('Error in Marvel population:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // News Storage - Fetch and store 200 stories/day from NewsData.io + RSS
    app.post('/api/news/fetch-and-store', async (req, res) => {
        try {
            const { newsStorageService } = await Promise.resolve().then(() => __importStar(require('./services/newsStorageService.js')));
            console.log('📰 Starting news fetch and storage (NewsData.io + RSS)...');
            const result = await newsStorageService.fetchAndStoreAllNews();
            res.json({
                success: true,
                message: `Stored ${result.totalStored} news articles (${result.fromNewsDataIO} from NewsData.io, ${result.fromRSS} from RSS)`,
                data: result
            });
        }
        catch (error) {
            console.error('Error in news storage:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // Get recent news
    app.get('/api/news/recent', async (req, res) => {
        try {
            const { newsStorageService } = await Promise.resolve().then(() => __importStar(require('./services/newsStorageService.js')));
            const limit = parseInt(req.query.limit) || 50;
            const articles = await newsStorageService.getRecentNews(limit);
            res.json({
                success: true,
                data: articles
            });
        }
        catch (error) {
            console.error('Error fetching recent news:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // Comics Worth Watching - Bloomberg-style institutional signals
    app.get('/api/comics-worth-watching', async (req, res) => {
        try {
            const result = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          cw.*,
          cc.image_url,
          cc.series,
          cc.issue_number,
          cc.publisher
        FROM comics_worth_watching cw
        JOIN comic_covers cc ON cw.comic_cover_id = cc.id
        WHERE cw.expires_at > NOW()
        ORDER BY cw.rank ASC
        LIMIT 10
      `);
            res.json({
                success: true,
                data: result.rows
            });
        }
        catch (error) {
            console.error('Error fetching comics worth watching:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // Comic of the Day - Historical significance
    app.get('/api/comic-of-the-day', async (req, res) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const result = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          cod.*,
          cc.image_url,
          cc.series,
          cc.issue_number,
          cc.publisher,
          cc.volume_year
        FROM comic_of_the_day cod
        JOIN comic_covers cc ON cod.comic_cover_id = cc.id
        WHERE DATE(cod.feature_date) = DATE(${today.toISOString()})
        LIMIT 1
      `);
            if (result.rows.length === 0) {
                return res.json({
                    success: true,
                    data: null
                });
            }
            res.json({
                success: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Error fetching comic of the day:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    // TEST ENDPOINT: Entity scraper validation
    app.get('/api/test/entity-scraper/:publisher', async (req, res) => {
        console.log(`✅ TEST ENDPOINT HIT: /api/test/entity-scraper/${req.params.publisher}`);
        try {
            const { ComicVineScraper } = await Promise.resolve().then(() => __importStar(require('./services/entityScrapers/ComicVineScraper.js')));
            const apiKey = process.env.COMIC_VINE_API_KEY;
            if (!apiKey) {
                console.error('❌ COMIC_VINE_API_KEY not configured');
                return res.status(500).json({ error: 'COMIC_VINE_API_KEY not configured' });
            }
            const scraper = new ComicVineScraper(apiKey);
            const publisher = req.params.publisher;
            console.log(`🔍 Testing Comic Vine scraper for publisher: ${publisher}`);
            const entities = await scraper.scrapeEntities({
                entityType: 'character',
                publisher: publisher,
                limit: 5
            });
            console.log(`✅ Comic Vine test complete: ${entities.length} entities for ${publisher}`);
            const result = {
                success: true,
                publisher,
                entityCount: entities.length,
                entities: entities.map(e => ({
                    id: e.entityId,
                    name: e.entityName,
                    publisher: e.publisher,
                    firstAppearance: e.firstAppearance,
                    relationships: e.relationships?.length || 0,
                    attributes: e.attributes?.length || 0
                }))
            };
            console.log(`📤 Sending response:`, JSON.stringify(result).substring(0, 200));
            res.json(result);
        }
        catch (error) {
            console.error('❌ Entity scraper test error:', error);
            res.status(500).json({ error: error.message });
        }
    });
    // WebSocket support disabled - using polling instead
    // Initialize WebSocket notification service for real-time notifications
    // console.log('🔔 Initializing WebSocket notification service...');
    // wsNotificationService.initialize(httpServer, '/ws/notifications');
    // console.log('✅ WebSocket notification service initialized');
    return httpServer;
}
