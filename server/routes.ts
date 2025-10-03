import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./databaseStorage";
import { WebSocketServer } from 'ws';
import comicDataRoutes from "./routes/comicData.js";
import vectorRoutes from "./routes/vectorRoutes.js";
import dataImportRoutes from "./routes/dataImportRoutes.js";
import housesRoutes from "./routes/housesRoutes.js";
import sevenHousesRoutes from "./routes/sevenHousesRoutes.js";
import karmaRoutes from "./routes/karmaRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import integrationsRoutes from "./routes/integrations.js";
import collectorRoutes from "./routes/collectorRoutes.js";
import { registerComicRoutes } from "./routes/comicRoutes";
import { registerComicCoverRoutes } from "./routes/comicCoverRoutes.js";
import { registerNotificationRoutes } from "./routes/notificationRoutes.js";
import { wsNotificationService } from "./services/websocketNotificationService.js";
import enhancedDataRoutes from "./routes/enhancedDataRoutes.js";
import enhancedAiRoutes from "./routes/enhancedAiRoutes.js";
import visualStorytellingRoutes from "./routes/visualStorytellingRoutes.js";
import progressionRoutes from "./routes/progressionRoutes.js";
import phase1Routes from "./phase1Routes.js";
import tradingRoutes from "./routes/tradingRoutes.js";
import { registerStoryMarketRoutes } from "./routes/storyMarketRoutes.js";
import shadowRoutes from "./routes/shadowRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import warfareRoutes from "./routes/warfareRoutes.js";
import pineconeRoutes from "./routes/pinecone.js";
import comicVineRoutes from "./routes/comicVineRoutes.js";
import marvelRoutes from "./routes/marvelRoutes.js";
import dcRoutes from "./routes/dcRoutes.js";
import kaggleComicsRoutes from "./routes/kaggleComicsRoutes.js";
import { marketSimulation, orderMatching } from "./marketSimulation.js";
import { leaderboardService } from "./leaderboardService.js";
import { priceStreamingService } from "./services/priceStreamingService.js";
import { narrativeEventService } from "./services/narrativeEventService.js";
import { 
  patchWebSocketWithSanitization, 
  safeWebSocketClose,
  safeWebSocketSend,
  sanitizeWebSocketData,
  WebSocketCloseCodes 
} from "./utils/websocketSanitizer.js";
import { 
  initializeWebSocketProtocolOverride,
  applyEmergencyProtocolOverride 
} from "./utils/webSocketProtocolOverride.js";
import { 
  insertAssetSchema, 
  insertMarketDataSchema,
  insertPortfolioSchema,
  insertHoldingSchema,
  insertMarketInsightSchema,
  insertMarketIndexSchema,
  insertMarketIndexDataSchema,
  insertWatchlistSchema,
  insertWatchlistAssetSchema,
  insertOrderSchema,
  insertMarketEventSchema,
  insertComicGradingPredictionSchema,
  users,
  portfolios,
  careerPathwayLevels,
  certificationCourses,
  userCourseEnrollments,
  userPathwayProgress,
  examAttempts,
  subscriberCourseIncentives,
  subscriberActiveBenefits,
  subscriberIncentiveHistory,
  easterEggDefinitions,
  easterEggUserProgress,
  easterEggUnlocks,
  npcTraderActivityLog,
  assets as assetsTable
} from "@shared/schema";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { entitySeedingService } from "./services/entitySeedingService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Entity Mining & Seeding - Mine comic book universe for tradable assets
  app.post('/api/admin/seed-entities', async (req: any, res) => {
    try {
      console.log('🎭 Starting entity seeding from API request...');
      
      // Run seeding service asynchronously
      entitySeedingService.seedAllEntities()
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
    } catch (error) {
      console.error('Error starting entity seeding:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to start entity seeding' 
      });
    }
  });

  // Price History Seeding - Create historical price snapshots for all assets
  app.post('/api/admin/seed-price-history', async (req: any, res) => {
    try {
      console.log('📊 Starting price history seeding from API request...');
      
      const { seedPriceHistory } = await import('./services/priceHistorySeeding');
      
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
    } catch (error) {
      console.error('Error starting price history seeding:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to start price history seeding' 
      });
    }
  });

  // PriceCharting Integration - Test API connection with comic search
  app.get('/api/admin/pricecharting/test', async (req: any, res) => {
    try {
      const { priceChartingService } = await import('./services/priceChartingService');
      
      console.log('💰 Testing PriceCharting API with comic book search...');
      
      // Test searches for popular characters
      const tests = [
        { query: 'Amazing Spider-Man', type: 'series' },
        { query: 'Batman', type: 'character' },
        { query: 'X-Men', type: 'series' }
      ];
      
      const results: any[] = [];
      
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
        } else {
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
    } catch (error) {
      console.error('❌ PriceCharting test failed:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to test PriceCharting connection',
        details: (error as Error).message
      });
    }
  });

  // NPC Trader Seeding - Populate market with 10,000 AI traders
  app.post('/api/admin/seed-npcs', async (req: any, res) => {
    try {
      console.log('🤖 Starting NPC trader seeding from API request...');
      
      const { count = 10000 } = req.body;
      const traderCount = typeof count === 'number' && count > 0 ? count : 10000;
      
      const { seedNPCTradersToDatabase } = await import('./services/npcTraderGenerator');
      
      // Run seeding service asynchronously
      seedNPCTradersToDatabase(db, traderCount)
        .then((result) => {
          if (result.success) {
            console.log('✅ NPC trader seeding completed successfully');
            console.log(`📊 Seeded ${result.tradersSeeded} traders`);
            console.log('🎭 Archetype distribution:', result.archetypeDistribution);
            console.log('💰 Capital distribution:', result.capitalDistribution);
          } else {
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
    } catch (error) {
      console.error('Error starting NPC trader seeding:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to start NPC trader seeding' 
      });
    }
  });

  // Entry Test Routes - Hidden Psychological Profiling
  app.post('/api/entry-test/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { responses } = req.body;
      
      if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: "Invalid test responses" });
      }
      
      // Import test scenarios and process responses
      const { ENTRY_TEST_SCENARIOS } = await import('@shared/entryTestScenarios');
      
      // Initialize or get existing alignment score
      let alignmentScore = await storage.getUserAlignmentScore(userId);
      if (!alignmentScore) {
        alignmentScore = await storage.createAlignmentScore({ userId });
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
        if (!scenario) continue;
        
        const choice = scenario.choices.find(c => c.id === response.choiceId);
        if (!choice) continue;
        
        // Record the decision (hidden tracking)
        await storage.recordUserDecision({
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
      await storage.updateAlignmentScore(userId, alignmentDeltas);
      
      // Calculate House assignment based on final alignment
      const houseAssignment = await storage.calculateHouseAssignment(userId);
      
      // Update user's House assignment
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUser(userId, {
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
      
    } catch (error) {
      console.error("Error processing entry test:", error);
      res.status(500).json({ error: "Failed to process test results" });
    }
  });
  
  // Check if user has completed Entry Test
  app.get('/api/entry-test/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user has portfolio holdings (returning "Closers")
      const userPortfolios = await storage.getUserPortfolios(userId);
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
    } catch (error) {
      console.error("Error checking test status:", error);
      res.status(500).json({ error: "Failed to check test status" });
    }
  });

  // Knowledge Test Routes - Financial Literacy Assessment (disguised as "Market Mastery Challenge")
  app.post('/api/knowledge-test/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { responses, result } = req.body;
      
      if (!responses || !Array.isArray(responses) || !result) {
        return res.status(400).json({ error: "Invalid test submission" });
      }
      
      // Store the test result
      const testResult = await storage.createKnowledgeTestResult({
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
        timeSpent: responses.reduce((acc: number, r: any) => acc + (r.responseTime || 0), 0),
        questionsAnswered: responses.length,
        retakeAllowedAt: result.hiddenKnowledgeScore < 60 ? 
                        new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24 hours for retake
        attemptNumber: 1 // Would need to track this properly in real implementation
      });
      
      // Store individual responses for analysis
      for (const response of responses) {
        const { KNOWLEDGE_TEST_SCENARIOS } = await import('@shared/knowledgeTestScenarios');
        const scenario = KNOWLEDGE_TEST_SCENARIOS.find((s: any) => s.id === response.scenarioId);
        if (!scenario) continue;
        
        const choice = scenario.choices.find((c: any) => c.id === response.choiceId);
        if (!choice) continue;
        
        await storage.createKnowledgeTestResponse({
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
      const user = await storage.getUser(userId);
      if (user) {
        const canTrade = result.hiddenKnowledgeScore >= 60;
        const canUseMargin = result.tier === 'master' || result.tier === 'specialist';
        const canShort = result.tier === 'master';
        
        await storage.updateUser(userId, {
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
      const existingPortfolios = await storage.getUserPortfolios(userId);
      
      if (existingPortfolios.length === 0) {
        // Determine initial balance based on Knowledge Test score
        let initialBalance = "10000.00"; // Failed: $10,000
        const score = result.hiddenKnowledgeScore;
        
        if (score >= 90) {
          initialBalance = "50000.00"; // 90-100%: $50,000
        } else if (score >= 80) {
          initialBalance = "35000.00"; // 80-90%: $35,000
        } else if (score >= 70) {
          initialBalance = "25000.00"; // 70-80%: $25,000
        } else if (score >= 60) {
          initialBalance = "15000.00"; // 60-70%: $15,000
        }
        
        // Create default portfolio with score-based funding
        await storage.createPortfolio({
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
      
    } catch (error) {
      console.error("Error processing knowledge test:", error);
      res.status(500).json({ error: "Failed to process test results" });
    }
  });
  
  // Check Knowledge Test status
  app.get('/api/knowledge-test/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user is a returning "Closer" with portfolio or trading history
      const user = await storage.getUser(userId);
      const userPortfolios = await storage.getUserPortfolios(userId);
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
      const latestResult = await storage.getLatestKnowledgeTestResult(userId);
      
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
      
    } catch (error) {
      console.error("Error checking knowledge test status:", error);
      res.status(500).json({ error: "Failed to check test status" });
    }
  });

  // Asset Management Routes
  app.get("/api/assets", async (req, res) => {
    try {
      const type = req.query.type as string;
      const search = req.query.search as string;
      const publisher = req.query.publisher as string;
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const assets = await storage.getAssets({ type, search, publisher, limit, offset });
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  });

  app.get("/api/assets/symbol/:symbol", async (req, res) => {
    try {
      const asset = await storage.getAssetBySymbol(req.params.symbol);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  });

  // Trending Characters - Heroes and villains across all publishers
  app.get("/api/characters/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 12;
      
      // Fetch character assets with latest market data (limit to 100 to avoid overflow)
      const characters = await storage.getAssets({ type: 'CHARACTER', limit: 100 });
      
      // Get latest prices for characters that have them
      const charactersWithPrices = await Promise.all(
        characters.slice(0, limit).map(async (char) => {
          const latestData = await storage.getLatestMarketData(char.symbol);
          return {
            ...char,
            price: latestData?.close || null,
            percentChange: latestData?.percentChange || null,
            volume: latestData?.volume || null
          };
        })
      );
      
      // Sort by random or volume for now (since we don't have consistent price data)
      const trending = charactersWithPrices.sort(() => Math.random() - 0.5);
      
      res.json(trending);
    } catch (error) {
      console.error('Error fetching trending characters:', error);
      res.status(500).json({ error: "Failed to fetch trending characters" });
    }
  });

  // Creator Spotlight - Hot writers and artists across all publishers
  app.get("/api/creators/spotlight", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      
      // Fetch creator assets with latest market data
      const creators = await storage.getAssets({ type: 'CREATOR' });
      
      // Get latest prices for creators
      const creatorsWithPrices = await Promise.all(
        creators.slice(0, limit).map(async (creator) => {
          const latestData = await storage.getLatestMarketData(creator.symbol);
          return {
            ...creator,
            price: latestData?.close || null,
            percentChange: latestData?.percentChange || null,
            volume: latestData?.volume || null
          };
        })
      );
      
      // Sort by price change or random for now
      const spotlight = creatorsWithPrices.sort((a, b) => {
        if (a.percentChange && b.percentChange) {
          return Math.abs(b.percentChange) - Math.abs(a.percentChange);
        }
        return Math.random() - 0.5;
      });
      
      res.json(spotlight);
    } catch (error) {
      console.error('Error fetching creator spotlight:', error);
      res.status(500).json({ error: "Failed to fetch creator spotlight" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid asset data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create asset" });
    }
  });

  app.patch("/api/assets/:id", async (req, res) => {
    try {
      const updateData = insertAssetSchema.partial().parse(req.body);
      const asset = await storage.updateAsset(req.params.id, updateData);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid asset data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAsset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  // Market Data Routes (OHLC time-series)
  app.get("/api/market-data/latest", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string || '1d';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      // Get all assets first
      const assets = await storage.getAssets({});
      const assetIds = assets.map(a => a.id).slice(0, limit);
      
      // Get latest market data for each asset
      const marketDataPromises = assetIds.map(assetId => 
        storage.getLatestMarketData(assetId, timeframe)
      );
      
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
    } catch (error) {
      console.error("Failed to fetch latest market data:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/market-data/:assetId/latest", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string || '1d';
      const marketData = await storage.getLatestMarketData(req.params.assetId, timeframe);
      if (!marketData) {
        return res.status(404).json({ error: "No market data found" });
      }
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/market-data/:assetId/history", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      if (!timeframe) {
        return res.status(400).json({ error: "Timeframe parameter is required" });
      }

      const history = await storage.getMarketDataHistory(req.params.assetId, timeframe, limit, from, to);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data history" });
    }
  });

  app.post("/api/market-data", async (req, res) => {
    try {
      const validatedData = insertMarketDataSchema.parse(req.body);
      const marketData = await storage.createMarketData(validatedData);
      res.status(201).json(marketData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid market data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create market data" });
    }
  });

  app.post("/api/market-data/bulk", async (req, res) => {
    try {
      const assetIds = z.array(z.string()).parse(req.body.assetIds);
      const timeframe = req.body.timeframe || '1d';
      const marketData = await storage.getBulkLatestMarketData(assetIds, timeframe);
      res.json(marketData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to fetch bulk market data" });
    }
  });

  // Trading Terminal API Endpoints
  app.get("/api/market/orderbook/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const asset = await storage.getAssetBySymbol(symbol);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const currentPrice = await storage.getAssetCurrentPrice(asset.id);
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
        const bidPrice = price - spread/2 - (i * price * 0.001);
        const quantity = Math.floor(Math.random() * 1000) + 100;
        bids.push({
          price: bidPrice,
          quantity: quantity,
          total: bidPrice * quantity
        });
      }
      
      // Generate ask orders (above current price)
      for (let i = 0; i < 20; i++) {
        const askPrice = price + spread/2 + (i * price * 0.001);
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
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order book" });
    }
  });

  app.get("/api/market/trades/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const asset = await storage.getAssetBySymbol(symbol);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const currentPrice = await storage.getAssetCurrentPrice(asset.id);
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
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trade history" });
    }
  });

  app.get("/api/market/depth/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const levels = parseInt(req.query.levels as string) || 10;
      
      const asset = await storage.getAssetBySymbol(symbol);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const currentPrice = await storage.getAssetCurrentPrice(asset.id);
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
        const bidPrice = price - spread/2 - (i * price * 0.001);
        const bidQty = Math.floor(Math.random() * 1000) + 200;
        cumulativeBidQty += bidQty;
        
        bidDepth.push({
          price: bidPrice,
          quantity: bidQty,
          cumulative: cumulativeBidQty,
          total: bidPrice * cumulativeBidQty
        });
        
        // Ask depth
        const askPrice = price + spread/2 + (i * price * 0.001);
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
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market depth" });
    }
  });

  app.get("/api/analytics/performance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolios = await storage.getUserPortfolios(userId);
      
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
      const holdings = await storage.getPortfolioHoldings(portfolio.id);
      
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
    } catch (error) {
      console.error("Error fetching performance analytics:", error);
      res.status(500).json({ error: "Failed to fetch performance data" });
    }
  });

  // Portfolio Management Routes
  app.get("/api/portfolios/user/:userId", async (req, res) => {
    try {
      const portfolios = await storage.getUserPortfolios(req.params.userId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  });

  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio(req.params.id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid portfolio data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create portfolio" });
    }
  });

  app.patch("/api/portfolios/:id", async (req, res) => {
    try {
      const updateData = insertPortfolioSchema.partial().parse(req.body);
      const portfolio = await storage.updatePortfolio(req.params.id, updateData);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid portfolio data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update portfolio" });
    }
  });

  app.delete("/api/portfolios/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePortfolio(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete portfolio" });
    }
  });

  app.get("/api/portfolios/:id/holdings", async (req, res) => {
    try {
      const holdings = await storage.getPortfolioHoldings(req.params.id);
      res.json(holdings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch holdings" });
    }
  });

  app.post("/api/holdings", async (req, res) => {
    try {
      const validatedData = insertHoldingSchema.parse(req.body);
      const holding = await storage.createHolding(validatedData);
      res.status(201).json(holding);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid holding data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create holding" });
    }
  });

  app.patch("/api/holdings/:id", async (req, res) => {
    try {
      const updateData = insertHoldingSchema.partial().parse(req.body);
      const holding = await storage.updateHolding(req.params.id, updateData);
      if (!holding) {
        return res.status(404).json({ error: "Holding not found" });
      }
      res.json(holding);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid holding data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update holding" });
    }
  });

  app.delete("/api/holdings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteHolding(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Holding not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete holding" });
    }
  });

  // Market Insights Routes (AI-powered)
  app.get("/api/market-insights", async (req, res) => {
    try {
      const assetId = req.query.assetId as string;
      const category = req.query.category as string;
      const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined;
      
      const insights = await storage.getMarketInsights({ assetId, category, isActive });
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market insights" });
    }
  });

  app.post("/api/market-insights", async (req, res) => {
    try {
      const validatedData = insertMarketInsightSchema.parse(req.body);
      const insight = await storage.createMarketInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid insight data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create market insight" });
    }
  });

  // Market Indices Routes (CCIX, PPIX100, etc.)
  app.get("/api/market-indices", async (req, res) => {
    try {
      const indices = await storage.getMarketIndices();
      res.json(indices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market indices" });
    }
  });

  app.get("/api/market-indices/:symbol", async (req, res) => {
    try {
      const index = await storage.getMarketIndex(req.params.symbol);
      if (!index) {
        return res.status(404).json({ error: "Market index not found" });
      }
      res.json(index);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market index" });
    }
  });

  app.get("/api/market-indices/:indexId/data/latest", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string || '1d';
      const indexData = await storage.getLatestMarketIndexData(req.params.indexId, timeframe);
      if (!indexData) {
        return res.status(404).json({ error: "No index data found" });
      }
      res.json(indexData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch index data" });
    }
  });

  app.get("/api/market-indices/:indexId/data/history", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      if (!timeframe) {
        return res.status(400).json({ error: "Timeframe parameter is required" });
      }

      const history = await storage.getMarketIndexDataHistory(req.params.indexId, timeframe, limit, from, to);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch index data history" });
    }
  });

  // Watchlist Routes
  app.get("/api/watchlists/user/:userId", async (req, res) => {
    try {
      const watchlists = await storage.getUserWatchlists(req.params.userId);
      res.json(watchlists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlists" });
    }
  });

  app.post("/api/watchlists", async (req, res) => {
    try {
      const validatedData = insertWatchlistSchema.parse(req.body);
      const watchlist = await storage.createWatchlist(validatedData);
      res.status(201).json(watchlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid watchlist data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create watchlist" });
    }
  });

  app.delete("/api/watchlists/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWatchlist(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Watchlist not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete watchlist" });
    }
  });

  app.get("/api/watchlists/:id/assets", async (req, res) => {
    try {
      const assets = await storage.getWatchlistAssets(req.params.id);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist assets" });
    }
  });

  app.post("/api/watchlists/assets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { assetId, watchlistId, alertPrice, notes } = req.body;
      
      // If no watchlistId provided, use user's default watchlist
      let targetWatchlistId = watchlistId;
      if (!targetWatchlistId) {
        const userWatchlists = await storage.getUserWatchlists(userId);
        const defaultWatchlist = userWatchlists.find(w => w.isDefault) || userWatchlists[0];
        if (!defaultWatchlist) {
          // Create default watchlist if none exists
          const newWatchlist = await storage.createWatchlist({
            userId,
            name: "My Watchlist",
            isDefault: true
          });
          targetWatchlistId = newWatchlist.id;
        } else {
          targetWatchlistId = defaultWatchlist.id;
        }
      }

      const validatedData = insertWatchlistAssetSchema.parse({
        watchlistId: targetWatchlistId,
        assetId,
        alertPrice,
        notes
      });
      
      await storage.addAssetToWatchlist(validatedData);
      
      // Return the updated watchlist with assets
      const updatedWatchlists = await storage.getUserWatchlists(userId);
      const updatedWatchlist = updatedWatchlists.find(w => w.id === targetWatchlistId);
      
      res.status(201).json({ success: true, watchlist: updatedWatchlist });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid watchlist asset data", details: error.errors });
      }
      console.error("Error adding asset to watchlist:", error);
      res.status(500).json({ error: "Failed to add asset to watchlist" });
    }
  });

  app.delete("/api/watchlists/:watchlistId/assets/:assetId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { watchlistId, assetId } = req.params;
      
      // Verify the watchlist belongs to the authenticated user
      const userWatchlists = await storage.getUserWatchlists(userId);
      const watchlist = userWatchlists.find(w => w.id === watchlistId);
      
      if (!watchlist) {
        return res.status(404).json({ error: "Watchlist not found or access denied" });
      }
      
      const removed = await storage.removeAssetFromWatchlist(watchlistId, assetId);
      if (!removed) {
        return res.status(404).json({ error: "Asset not found in watchlist" });
      }
      
      // Return the updated watchlist with assets
      const updatedWatchlists = await storage.getUserWatchlists(userId);
      const updatedWatchlist = updatedWatchlists.find(w => w.id === watchlistId);
      
      res.json({ success: true, watchlist: updatedWatchlist });
    } catch (error) {
      console.error("Error removing asset from watchlist:", error);
      res.status(500).json({ error: "Failed to remove asset from watchlist" });
    }
  });

  // Trading Routes
  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const status = req.query.status as string;
      const orders = await storage.getUserOrders(req.params.userId, status);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const updateData = z.object({
        status: z.enum(['pending', 'filled', 'cancelled']).optional(),
        price: z.string().optional(),
        totalValue: z.string().optional()
      }).parse(req.body);
      
      const order = await storage.updateOrder(req.params.id, updateData);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order update data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.post("/api/orders/:id/cancel", async (req, res) => {
    try {
      const order = await storage.cancelOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot cancel')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to cancel order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteOrder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Bulk market data ingestion for historical backfill
  app.post("/api/market-data/bulk-historical", async (req, res) => {
    try {
      const dataPoints = z.array(insertMarketDataSchema).parse(req.body);
      const results = await storage.createBulkMarketData(dataPoints);
      
      res.status(201).json({ created: results.length, data: results });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid bulk market data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create bulk market data" });
    }
  });

  // Market Events Routes
  app.get("/api/market-events", async (req, res) => {
    try {
      const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined;
      const category = req.query.category as string;
      const events = await storage.getMarketEvents({ isActive, category });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market events" });
    }
  });

  // Dashboard-specific API endpoints (required for frontend integration)
  
  // Market overview endpoint for dashboard
  app.get("/api/market/overview", async (req, res) => {
    try {
      // Get top gainers and losers from simulation
      const assets = await storage.getAssets({ limit: 50 });
      const currentPrices = await storage.getAssetCurrentPrices(assets.map(a => a.id));
      
      // Calculate performance metrics
      const movers = currentPrices.map(price => {
        const asset = assets.find(a => a.id === price.assetId);
        return {
          id: asset?.id,
          symbol: asset?.symbol,
          name: asset?.name,
          type: asset?.type,
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
    } catch (error) {
      console.error("Error fetching market overview:", error);
      res.status(500).json({ error: "Failed to fetch market overview" });
    }
  });

  // Market indices endpoint for dashboard
  app.get("/api/market/indices", async (req, res) => {
    try {
      const indices = await storage.getMarketIndices();
      res.json(indices);
    } catch (error) {
      console.error("Error fetching market indices:", error);
      res.status(500).json({ error: "Failed to fetch market indices" });
    }
  });

  // Market events endpoint for dashboard
  app.get("/api/market/events", async (req, res) => {
    try {
      const isActive = req.query.isActive ? req.query.isActive === 'true' : true;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const events = await storage.getMarketEvents({ isActive });
      res.json(events.slice(0, limit));
    } catch (error) {
      console.error("Error fetching market events:", error);
      res.status(500).json({ error: "Failed to fetch market events" });
    }
  });

  // User watchlists endpoint for dashboard (authenticated)
  app.get("/api/watchlists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const watchlists = await storage.getUserWatchlists(userId);
      res.json(watchlists);
    } catch (error) {
      console.error("Error fetching user watchlists:", error);
      res.status(500).json({ error: "Failed to fetch watchlists" });
    }
  });

  // Portfolios endpoint for dashboard (authenticated)
  app.get("/api/portfolios", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolios = await storage.getUserPortfolios(userId);
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching user portfolios:", error);
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  });

  app.post("/api/market-events", async (req, res) => {
    try {
      const validatedData = insertMarketEventSchema.parse(req.body);
      const event = await storage.createMarketEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid event data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create market event" });
    }
  });

  // Market Updates for live feed
  app.get("/api/market-updates", async (req, res) => {
    try {
      // Get recent market events and activities for live feed
      const recentEvents = await storage.getMarketEvents({ isActive: true });
      
      // Transform market events into market updates format
      const updates = recentEvents.slice(0, 10).map(event => ({
        id: event.id,
        type: 'news-impact' as const,
        symbol: event.title.split(' ')[0] || 'UNKNOWN',
        name: event.title,
        assetType: event.category === 'character' ? 'character' : 'comic' as const,
        message: event.description,
        impact: event.impact as 'positive' | 'negative' | 'neutral',
        timestamp: event.eventDate,
        value: Math.floor(Math.random() * 4000) + 1000, // Mock for now
        change: (Math.random() - 0.5) * 10 // Mock for now
      }));
      
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market updates" });
    }
  });

  // Asset Growth Metrics - NEW assets tracking
  app.get("/api/growth/metrics", async (req, res) => {
    try {
      const { getAssetGrowthMetrics } = await import('./services/assetGrowthMetrics.js');
      const metrics = await getAssetGrowthMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching growth metrics:", error);
      res.status(500).json({ error: "Failed to fetch growth metrics" });
    }
  });

  // Institutional Order Flow - Live NPC trading activity
  app.get("/api/institutional/order-flow", async (req, res) => {
    try {
      const timeWindow = req.query.timeWindow ? parseInt(req.query.timeWindow as string) : 300; // 5 minutes default
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      // Query recent NPC trading activity
      const recentActivity = await db
        .select({
          assetId: npcTraderActivityLog.assetId,
          action: npcTraderActivityLog.action,
          quantity: npcTraderActivityLog.quantity,
          price: npcTraderActivityLog.price,
          timestamp: npcTraderActivityLog.timestamp,
          assetName: assetsTable.name,
          assetSymbol: assetsTable.symbol,
          assetType: assetsTable.type
        })
        .from(npcTraderActivityLog)
        .leftJoin(assetsTable, eq(npcTraderActivityLog.assetId, assetsTable.id))
        .where(
          and(
            sql`${npcTraderActivityLog.timestamp} >= NOW() - INTERVAL '${sql.raw(timeWindow.toString())} seconds'`,
            sql`${npcTraderActivityLog.action} IN ('buy', 'sell')`
          )
        )
        .orderBy(sql`${npcTraderActivityLog.timestamp} DESC`)
        .limit(500);

      // Aggregate by asset
      const assetFlow = new Map<string, {
        assetId: string;
        symbol: string;
        name: string;
        type: string;
        buyVolume: number;
        sellVolume: number;
        buyOrders: number;
        sellOrders: number;
        netFlow: number;
        pressure: number; // -100 to 100, selling to buying pressure
        totalVolume: number;
        avgBuyPrice: number;
        avgSellPrice: number;
        lastActivity: Date;
      }>();

      for (const activity of recentActivity) {
        if (!activity.assetId) continue;
        
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

        const flow = assetFlow.get(key)!;
        const qty = activity.quantity || 0;
        const price = parseFloat(activity.price || '0');

        if (activity.action === 'buy') {
          flow.buyVolume += qty;
          flow.buyOrders++;
          flow.avgBuyPrice = ((flow.avgBuyPrice * (flow.buyOrders - 1)) + price) / flow.buyOrders;
        } else if (activity.action === 'sell') {
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
    } catch (error) {
      console.error("Error fetching institutional order flow:", error);
      res.status(500).json({ error: "Failed to fetch order flow data" });
    }
  });

  // Market Insights Routes
  app.get("/api/market-insights", async (req, res) => {
    try {
      const insights = await storage.getMarketInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market insights" });
    }
  });

  app.post("/api/market-insights", async (req, res) => {
    try {
      const validatedData = insertMarketInsightSchema.parse(req.body);
      const insight = await storage.createMarketInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid insight data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create market insight" });
    }
  });

  // Comic Data Routes
  app.use("/api/comic-data", comicDataRoutes);
  
  // Register new comic routes for real data integration
  registerComicRoutes(app);
  
  // Register comic cover routes for cover display
  registerComicCoverRoutes(app);
  
  // Register notification routes for real-time notification system
  registerNotificationRoutes(app);
  
  // Collector-Grade Asset Display Routes
  app.use("/api/collector", collectorRoutes);
  
  // Comic Asset Data Service Routes - Visual Trading Experience
  const { comicAssetService } = await import('./services/comicAssetService.js');
  
  app.get("/api/comic-assets/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const assets = await comicAssetService.getTopComicAssets(limit);
      res.json(assets);
    } catch (error) {
      console.error('Failed to fetch top comic assets:', error);
      res.status(500).json({ error: "Failed to fetch comic assets" });
    }
  });
  
  app.get("/api/comic-assets/:id/history", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const history = await comicAssetService.getComicPriceHistory(req.params.id, days);
      if (!history) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(history);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });
  
  app.get("/api/comic-assets/heatmap", async (req, res) => {
    try {
      const heatmap = await comicAssetService.getComicHeatMap();
      res.json(heatmap);
    } catch (error) {
      console.error('Failed to fetch heatmap:', error);
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });
  
  // RSS News Feed Routes - Real Comic Book News
  const { rssFeedService } = await import('./services/rssFeedService.js');
  
  app.get("/api/news/rss", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const news = await rssFeedService.getLatestNews(limit);
      res.json(news);
    } catch (error) {
      console.error('Failed to fetch RSS news:', error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });
  
  // AI Market Intelligence Routes
  const aiRoutes = (await import('./routes/aiRoutes.js')).default;
  app.use("/api/ai", aiRoutes);
  
  // Enhanced AI Market Intelligence Routes (Advanced Oracle System)
  app.use("/api/ai", enhancedAiRoutes);

  // Vector-Powered AI Routes (pgvector enhanced features)
  app.use("/api/vectors", vectorRoutes);

  // Data import routes (Marvel vs DC dataset)
  app.use("/api/import", dataImportRoutes);

  // Pinecone vector search routes
  app.use("/api/pinecone", pineconeRoutes);

  // Comic Vine API expansion routes
  app.use("/api/comicvine", comicVineRoutes);

  // Marvel API expansion routes
  app.use("/api/marvel", marvelRoutes);

  // DC multi-source expansion routes (Metron + GCD)
  app.use("/api/dc", dcRoutes);

  // Kaggle Comics expansion routes (Marvel + DC datasets)
  app.use("/api/kaggle-comics", kaggleComicsRoutes);

  // Houses System Routes (Seven Mythological Houses)
  app.use("/api/houses", housesRoutes);
  app.use(sevenHousesRoutes);
  app.use("/api/karma", karmaRoutes);
  
  // Sacred Learning System Routes (Mythological Education RPG)
  app.use("/api/learning", learningRoutes);

  // External Integrations Routes (Divine Connections Chamber) - Phase 8
  app.use("/api/integrations", isAuthenticated, integrationsRoutes);

  // Phase 1: Core Trading Foundation Routes
  app.use("/api/phase1", isAuthenticated, phase1Routes);

  // Phase 1: Trading Routes
  app.use("/api/trading", isAuthenticated, tradingRoutes);
  
  // Shadow Economy Routes (requires corruption > 30)
  app.use("/api/shadow", shadowRoutes);
  
  // Noir Journal Routes
  app.use("/api/journal", journalRoutes);
  
  // Social Warfare Routes - predatory trading mechanics
  app.use(warfareRoutes);

  // Phase 1: Initialization Route
  app.post("/api/phase1/initialize", isAuthenticated, async (req, res) => {
    try {
      const { Phase1Initializer } = await import('./phase1Initialization.js');
      const result = await Phase1Initializer.initializeAllSystems();
      res.json(result);
    } catch (error) {
      console.error('Error initializing Phase 1:', error);
      res.status(500).json({ error: 'Failed to initialize Phase 1 systems' });
    }
  });

  // Phase 1: Status Route
  app.get("/api/phase1/status", isAuthenticated, async (req, res) => {
    try {
      const { Phase1Initializer } = await import('./phase1Initialization.js');
      const status = await Phase1Initializer.getInitializationStatus();
      const isInitialized = await Phase1Initializer.isPhase1Initialized();
      res.json({ ...status, isInitialized });
    } catch (error) {
      console.error('Error getting Phase 1 status:', error);
      res.status(500).json({ error: 'Failed to get Phase 1 status' });
    }
  });

  // Enhanced Trading Data Routes (Phase 3 Mythological Interface)
  app.use("/api", enhancedDataRoutes);

  // Visual Storytelling Routes (Phase 2 Narrative Systems)
  app.use("/api/storytelling", visualStorytellingRoutes);

  // Art-Driven Progression System Routes (Phase 3 Comic Collection Mechanics)
  app.use("/api/progression", isAuthenticated, progressionRoutes);
  
  // Story-Driven Market Visualization Routes (Phase 3)
  registerStoryMarketRoutes(app, storage);

  // PPIx Index Routes (Comic Book Market Indices) - SCHOLARLY INVESTMENT FRAMEWORK
  app.get("/api/ppix/indices", async (req, res) => {
    console.log('🎓 PPIx indices endpoint called! [SCHOLARLY FRAMEWORK]');
    
    try {
      console.log('🎓 Applying 20 Art Investment Metrics to comic book assets...');
      
      const { scholarlyPPIxService } = await import('./services/scholarlyPPIxService.js');
      
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
    } catch (error) {
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
      const indexType = req.params.indexType as 'ppix50' | 'ppix100';
      
      if (!['ppix50', 'ppix100'].includes(indexType)) {
        return res.status(400).json({ error: 'Invalid index type. Use ppix50 or ppix100' });
      }

      const { marketPricingService } = await import('./services/marketPricingService.js');
      
      // Generate sample assets for faster calculation
      console.log(`Generating ${indexType} with sample data...`);
      const assets = await marketPricingService.generateTradingAssetsWithPricing(30);
      
      if (!assets || assets.length === 0) {
        throw new Error('No trading assets available');
      }

      const { ppixIndexService } = await import('./services/ppixIndexService.js');
      
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
    } catch (error) {
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
      const { tierFeatures } = await import('./services/subscriptionService.js');
      
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
    } catch (error) {
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
      const user = await storage.getUser?.(userId) || {
        id: userId,
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        profileImageUrl: null,
        subscriptionTier: 'free' as const,
        subscriptionStatus: 'active' as const,
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

      const { SubscriptionService } = await import('./services/subscriptionService.js');
      
      const hasAccess = SubscriptionService.hasFeatureAccess(user, feature as any);
      const remainingCredits = SubscriptionService.getRemainingCredits(user);
      
      let upgradeRecommendation = null;
      if (!hasAccess) {
        upgradeRecommendation = SubscriptionService.getUpgradeRecommendations(user, feature as any);
      }

      res.json({
        success: true,
        hasAccess,
        currentTier: user.subscriptionTier,
        remainingCredits,
        upgradeRecommendation,
        featureGateMessage: !hasAccess ? 
          SubscriptionService.getFeatureGateMessage(feature as any, upgradeRecommendation?.recommendedTier || 'pro') : 
          null
      });
    } catch (error) {
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
      const predictionData = insertComicGradingPredictionSchema.parse({
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
      const prediction = await storage.createComicGradingPrediction(predictionData);

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

    } catch (error: unknown) {
      console.error('Comic grading analysis error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid grading data", 
          details: error.errors 
        });
      }

      // Handle OpenAI API errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
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
      const userId = req.query.userId as string;
      const predictions = await storage.getComicGradingPredictions({ userId });
      
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
    } catch (error) {
      console.error('Error fetching grading history:', error);
      res.status(500).json({ error: "Failed to fetch grading history" });
    }
  });

  // ================================
  // MARKET SIMULATION ENGINE ROUTES
  // ================================

  // Market Overview - Real-time market statistics
  app.get("/api/market/overview", async (req, res) => {
    try {
      const overview = await marketSimulation.getMarketOverview();
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('Error fetching market overview:', error);
      res.status(500).json({ error: "Failed to fetch market overview" });
    }
  });

  // Current Asset Prices - Real-time prices with bid/ask spreads
  app.get("/api/market/prices", async (req, res) => {
    try {
      const assetIds = req.query.assetIds as string;
      const marketStatus = req.query.marketStatus as string;
      
      let prices;
      if (assetIds) {
        // Get specific assets
        const idsArray = assetIds.split(',');
        prices = await marketSimulation.getCurrentPrices(idsArray);
      } else {
        // Get all current prices
        prices = await storage.getAllAssetCurrentPrices(marketStatus);
      }
      
      res.json({
        success: true,
        data: prices,
        marketOpen: marketSimulation.isMarketOpen()
      });
    } catch (error) {
      console.error('Error fetching current prices:', error);
      res.status(500).json({ error: "Failed to fetch current prices" });
    }
  });

  // Weighted Market Cap Details - Share pricing and float data for an asset
  app.get("/api/market/market-cap/:assetId", async (req, res) => {
    try {
      const { assetId } = req.params;
      const priceData = await storage.getAssetCurrentPrices([assetId]);
      
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
    } catch (error) {
      console.error('Error fetching market cap details:', error);
      res.status(500).json({ error: "Failed to fetch market cap details" });
    }
  });

  // Market Depth - Simulated order book data
  app.get("/api/market/depth/:assetId", async (req, res) => {
    try {
      const marketData = marketSimulation.getAssetMarketData(req.params.assetId);
      
      if (!marketData) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
      const spread = parseFloat(marketData.currentPrice.askPrice || '0') - parseFloat(marketData.currentPrice.bidPrice || '0');
      
      // Simulate market depth (order book)
      const depth = {
        bids: [] as Array<{ price: number; quantity: number; total: number }>,
        asks: [] as Array<{ price: number; quantity: number; total: number }>
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
    } catch (error) {
      console.error('Error fetching market depth:', error);
      res.status(500).json({ error: "Failed to fetch market depth" });
    }
  });

  // Market History - OHLC data for charting
  app.get("/api/market/history/:assetId", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string || '1d';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      const chartData = await storage.getMarketDataHistory(
        req.params.assetId, 
        timeframe, 
        limit, 
        from, 
        to
      );

      // Get current price for latest data point
      const currentPrice = await storage.getAssetCurrentPrice(req.params.assetId);

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
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Place Order - Create pending order without immediate execution
  app.post("/api/orders/place", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate order data
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
        status: 'pending' // Force pending status for placed orders
      });

      // Validate the order through the matching engine before placing
      const tempOrder = await storage.createOrder(orderData);
      const validation = await orderMatching.validateOrder(tempOrder);
      
      if (!validation.isValid) {
        // Delete the temp order and return validation error
        await storage.deleteOrder(tempOrder.id);
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
    } catch (error) {
      console.error('Error placing order:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid order data", 
          details: error.errors 
        });
      }

      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // Order Execution - Process buy/sell orders immediately
  app.post("/api/orders/execute", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate order data
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId
      });

      // Create the order
      const order = await storage.createOrder(orderData);

      // Process the order through the matching engine
      const execution = await orderMatching.processOrder(order);

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
      } else {
        // Order was rejected or placed as pending
        const updatedOrder = await storage.getOrder(order.id);
        res.status(200).json({
          success: true,
          data: {
            orderId: order.id,
            status: updatedOrder?.status || 'pending',
            message: updatedOrder?.rejectionReason || 'Order placed successfully'
          }
        });
      }
    } catch (error) {
      console.error('Error executing order:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid order data", 
          details: error.errors 
        });
      }

      res.status(500).json({ error: "Failed to execute order" });
    }
  });

  // Order Status and Management
  app.get("/api/orders/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const status = req.query.status as string;
      
      // Ensure user can only access their own orders
      if (req.params.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const orders = await storage.getUserOrders(userId, status);
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Cancel Order
  app.delete("/api/orders/:orderId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const order = await storage.getOrder(req.params.orderId);
      
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

      const cancelledOrder = await storage.cancelOrder(req.params.orderId);
      res.json({
        success: true,
        data: cancelledOrder
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: "Failed to cancel order" });
    }
  });

  // Market Status
  app.get("/api/market/status", async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          isOpen: marketSimulation.isMarketOpen(),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching market status:', error);
      res.status(500).json({ error: "Failed to fetch market status" });
    }
  });

  // Market Overview
  app.get("/api/market/overview", async (req, res) => {
    try {
      const overview = await marketSimulation.getMarketOverview();
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('Error fetching market overview:', error);
      res.status(500).json({ error: "Failed to fetch market overview" });
    }
  });

  // Current Asset Prices
  app.get("/api/market/prices", async (req, res) => {
    try {
      const assetIds = req.query.assetIds as string;
      
      if (!assetIds) {
        // Get asset prices (limit to 100 to avoid overflow)
        const assets = await storage.getAssets({ limit: 100 });
        const allAssetIds = assets.map(asset => asset.id);
        const prices = await storage.getAssetCurrentPrices(allAssetIds);
        
        res.json({
          success: true,
          data: prices
        });
      } else {
        // Get specific asset prices
        const assetIdArray = assetIds.split(',');
        const prices = await storage.getAssetCurrentPrices(assetIdArray);
        
        res.json({
          success: true,
          data: prices
        });
      }
    } catch (error) {
      console.error('Error fetching current prices:', error);
      res.status(500).json({ error: "Failed to fetch current prices" });
    }
  });

  // Historical Market Data for Asset
  app.get("/api/market/data/:assetId", async (req, res) => {
    try {
      const { assetId } = req.params;
      const timeframe = (req.query.timeframe as string) || '1h';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      const marketData = await storage.getMarketDataHistory(assetId, timeframe, limit, from, to);
      
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
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Active Market Events
  app.get("/api/market/events", async (req, res) => {
    try {
      const isActive = req.query.active !== 'false'; // Default to true
      const category = req.query.category as string;
      
      const events = await storage.getMarketEvents({ 
        isActive: isActive || undefined, 
        category 
      });
      
      res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching market events:', error);
      res.status(500).json({ error: "Failed to fetch market events" });
    }
  });

  // LEADERBOARD API ROUTES
  
  // Get all leaderboard categories
  app.get("/api/leaderboards/categories", async (req, res) => {
    try {
      const categories = await storage.getLeaderboardCategories({ isActive: true });
      res.json(categories);
    } catch (error) {
      console.error("Error fetching leaderboard categories:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard categories" });
    }
  });

  // Get leaderboard data by category ID
  app.get("/api/leaderboards/:categoryId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await leaderboardService.generateLeaderboard(req.params.categoryId, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error generating leaderboard:", error);
      res.status(500).json({ error: "Failed to generate leaderboard" });
    }
  });

  // Get multiple leaderboards at once
  app.get("/api/leaderboards", async (req, res) => {
    try {
      const categoryIds = (req.query.categories as string)?.split(',') || [];
      const limit = parseInt(req.query.limit as string) || 25;
      
      if (categoryIds.length === 0) {
        // Get all active categories if none specified
        const categories = await storage.getLeaderboardCategories({ isActive: true });
        const leaderboards = await leaderboardService.getMultipleLeaderboards(
          categories.map(c => c.id), 
          limit
        );
        res.json(leaderboards);
      } else {
        const leaderboards = await leaderboardService.getMultipleLeaderboards(categoryIds, limit);
        res.json(leaderboards);
      }
    } catch (error) {
      console.error("Error fetching multiple leaderboards:", error);
      res.status(500).json({ error: "Failed to fetch leaderboards" });
    }
  });

  // Get user's rankings across all categories
  app.get("/api/leaderboards/user/:userId/rankings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      const rankings = await leaderboardService.getUserRankings(userId);
      res.json(rankings);
    } catch (error) {
      console.error("Error fetching user rankings:", error);
      res.status(500).json({ error: "Failed to fetch user rankings" });
    }
  });

  // Get current user's rankings (authenticated route)
  app.get("/api/leaderboards/my-rankings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const rankings = await leaderboardService.getUserRankings(userId);
      res.json(rankings);
    } catch (error) {
      console.error("Error fetching user rankings:", error);
      res.status(500).json({ error: "Failed to fetch user rankings" });
    }
  });

  // Get user's trader statistics
  app.get("/api/leaderboards/user/:userId/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      const stats = await storage.getTraderStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "Trader stats not found" });
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching trader stats:", error);
      res.status(500).json({ error: "Failed to fetch trader stats" });
    }
  });

  // Get current user's trader statistics
  app.get("/api/leaderboards/my-stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getTraderStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching trader stats:", error);
      res.status(500).json({ error: "Failed to fetch trader stats" });
    }
  });

  // Get user achievements
  app.get("/api/achievements/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      const category = req.query.category as string;
      const tier = req.query.tier as string;
      const achievements = await storage.getUserAchievements(userId, { 
        category, 
        tier, 
        isVisible: true 
      });
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Get current user's achievements
  app.get("/api/achievements/my-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const category = req.query.category as string;
      const tier = req.query.tier as string;
      const achievements = await storage.getUserAchievements(userId, { 
        category, 
        tier, 
        isVisible: true 
      });
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Get available achievements and progress
  app.get("/api/achievements/available", async (req, res) => {
    try {
      const achievements = await storage.getAvailableAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching available achievements:", error);
      res.status(500).json({ error: "Failed to fetch available achievements" });
    }
  });

  // Get user achievement progress
  app.get("/api/achievements/progress/:achievementId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievementId = req.params.achievementId;
      const progress = await storage.getUserAchievementProgress(userId, achievementId);
      if (!progress) {
        return res.status(404).json({ error: "Achievement progress not found" });
      }
      res.json(progress);
    } catch (error) {
      console.error("Error fetching achievement progress:", error);
      res.status(500).json({ error: "Failed to fetch achievement progress" });
    }
  });

  // Get leaderboard overview and analytics
  app.get("/api/leaderboards/overview", async (req, res) => {
    try {
      const overview = await leaderboardService.getLeaderboardOverview();
      res.json(overview);
    } catch (error) {
      console.error("Error fetching leaderboard overview:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard overview" });
    }
  });

  // Get trading activity summary
  app.get("/api/leaderboards/activity/:timeframe", async (req, res) => {
    try {
      const timeframe = req.params.timeframe as 'daily' | 'weekly' | 'monthly';
      if (!['daily', 'weekly', 'monthly'].includes(timeframe)) {
        return res.status(400).json({ error: "Invalid timeframe. Must be daily, weekly, or monthly" });
      }
      
      const summary = await leaderboardService.getTradingActivitySummary(timeframe);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching trading activity summary:", error);
      res.status(500).json({ error: "Failed to fetch trading activity summary" });
    }
  });

  // Admin route to recalculate all rankings (for maintenance)
  app.post("/api/leaderboards/recalculate", isAuthenticated, async (req: any, res) => {
    try {
      // Note: In production, this should have admin role check
      await leaderboardService.recalculateAllRankings();
      res.json({ message: "Rankings recalculated successfully" });
    } catch (error) {
      console.error("Error recalculating rankings:", error);
      res.status(500).json({ error: "Failed to recalculate rankings" });
    }
  });

  // Initialize leaderboard service
  try {
    console.log('🏆 Initializing leaderboard service...');
    await leaderboardService.initializeDefaultCategories();
    console.log('✅ Leaderboard service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize leaderboard service:', error);
    // Continue anyway - the service can be manually restarted
  }

  // Initialize and start the market simulation engine
  try {
    console.log('🏪 Initializing market simulation engine...');
    
    // Import and run seed data
    const { seedMarketData, generateHistoricalData } = await import('./seedData.js');
    await seedMarketData();
    await generateHistoricalData();
    
    // TEMPORARY: Comment out market simulation to allow server to start
    // await marketSimulation.initialize();
    
    // Delay starting price updates to allow server to fully start first
    // setTimeout(() => {
    //   const updateInterval = process.env.NODE_ENV === 'development' ? 30000 : 60000;
    //   marketSimulation.start(updateInterval);
    //   console.log('✅ Market simulation price updates started');
    // }, 10000); // Wait 10 seconds after server starts
    
    console.log('✅ Market simulation engine initialized successfully (price updates temporarily disabled)');
  } catch (error) {
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

  const httpServer = createServer(app);
  
  // Start the price streaming service
  await priceStreamingService.start();
  console.log('💹 Price streaming service started');

  // Setup WebSocket for real-time market data
  // Try simple server mode with path - client monkey-patch is now disabled
  const wss = new WebSocketServer({ 
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

  // ================================
  // SSE (Server-Sent Events) FALLBACK FOR MARKET DATA
  // Fallback for when WebSocket connections fail
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
      } catch (error) {
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
  app.get('/api/certifications/pathways', isAuthenticated, async (req: any, res) => {
    try {
      const pathways = await db.select().from(careerPathwayLevels).where(eq(careerPathwayLevels.isActive, true)).orderBy(careerPathwayLevels.displayOrder);
      res.json(pathways);
    } catch (error) {
      console.error('Error fetching certification pathways:', error);
      res.status(500).json({ error: 'Failed to fetch certification pathways' });
    }
  });

  // Get user's certification progress across all pathways
  app.get('/api/certifications/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await db.select().from(userPathwayProgress).where(eq(userPathwayProgress.userId, userId));
      res.json(progress);
    } catch (error) {
      console.error('Error fetching user certification progress:', error);
      res.status(500).json({ error: 'Failed to fetch certification progress' });
    }
  });

  // Get courses for a specific pathway level
  app.get('/api/certifications/courses/:pathwayLevelId', isAuthenticated, async (req: any, res) => {
    try {
      const { pathwayLevelId } = req.params;
      const courses = await db.select().from(certificationCourses)
        .where(and(
          eq(certificationCourses.pathwayLevelId, pathwayLevelId),
          eq(certificationCourses.isActive, true)
        ))
        .orderBy(certificationCourses.courseNumber);
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  // Get user's enrollment for a specific pathway level
  app.get('/api/certifications/enrollments/:pathwayLevelId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { pathwayLevelId } = req.params;
      const enrollments = await db.select().from(userCourseEnrollments)
        .where(and(
          eq(userCourseEnrollments.userId, userId),
          eq(userCourseEnrollments.pathwayLevelId, pathwayLevelId)
        ));
      res.json(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
  });

  // Enroll in a course
  app.post('/api/certifications/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { courseId, pathwayLevelId } = req.body;

      // Check if already enrolled
      const existing = await db.select().from(userCourseEnrollments)
        .where(and(
          eq(userCourseEnrollments.userId, userId),
          eq(userCourseEnrollments.courseId, courseId)
        ))
        .limit(1);

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }

      // Create enrollment
      const [enrollment] = await db.insert(userCourseEnrollments).values({
        userId,
        courseId,
        pathwayLevelId,
        status: 'enrolled'
      }).returning();

      res.json(enrollment);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).json({ error: 'Failed to enroll in course' });
    }
  });

  // Submit exam attempt
  app.post('/api/certifications/exam', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { courseId, enrollmentId, responses } = req.body;

      // Get course and enrollment data
      const [course] = await db.select().from(certificationCourses).where(eq(certificationCourses.id, courseId)).limit(1);
      const [enrollment] = await db.select().from(userCourseEnrollments).where(eq(userCourseEnrollments.id, enrollmentId)).limit(1);

      if (!course || !enrollment) {
        return res.status(404).json({ error: 'Course or enrollment not found' });
      }

      // Calculate score
      const examQuestions = course.examQuestions as any[];
      let correctAnswers = 0;
      examQuestions.forEach((q: any, index: number) => {
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
      const [attempt] = await db.insert(examAttempts).values({
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
      await db.update(userCourseEnrollments)
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
        .where(eq(userCourseEnrollments.id, enrollmentId));

      // If passed, update pathway progress
      if (passed && !enrollment.passed) {
        const [pathwayProgress] = await db.select().from(userPathwayProgress)
          .where(and(
            eq(userPathwayProgress.userId, userId),
            eq(userPathwayProgress.currentLevelId, enrollment.pathwayLevelId)
          ))
          .limit(1);

        if (pathwayProgress) {
          const newCoursesPassed = (pathwayProgress.coursesPassed || 0) + 1;
          const isCertified = newCoursesPassed >= 3;
          const isMasterCertified = newCoursesPassed >= 5;

          await db.update(userPathwayProgress)
            .set({
              coursesPassed: newCoursesPassed,
              isCertified,
              isMasterCertified,
              totalCoursesCompleted: (pathwayProgress.totalCoursesCompleted || 0) + 1
            })
            .where(eq(userPathwayProgress.id, pathwayProgress.id));

          // Award subscriber incentives for certification milestones
          // Fetch full user record to get subscription tier
          const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
          const isSubscriber = user && user.subscriptionTier !== 'free';
          
          if (isSubscriber) {
            // Get pathway level info for calculating bonuses
            const [pathwayLevel] = await db.select().from(careerPathwayLevels)
              .where(eq(careerPathwayLevels.id, enrollment.pathwayLevelId))
              .limit(1);

            if (pathwayLevel) {
              const bonuses: Array<{type: string, value: number, description: string}> = [];

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
              } else if (isCertified && !pathwayProgress.isCertified) {
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
                const [incentive] = await db.insert(subscriberCourseIncentives).values({
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
                await db.insert(subscriberIncentiveHistory).values({
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
              const [existingBenefits] = await db.select().from(subscriberActiveBenefits)
                .where(eq(subscriberActiveBenefits.userId, userId))
                .limit(1);

              if (existingBenefits) {
                // Update existing benefits
                let updates: any = {};
                
                bonuses.forEach(bonus => {
                  if (bonus.type === 'capital_bonus') {
                    updates.totalCapitalBonusEarned = (parseFloat(existingBenefits.totalCapitalBonusEarned) + bonus.value).toString();
                    updates.pendingCapitalBonus = (parseFloat(existingBenefits.pendingCapitalBonus) + bonus.value).toString();
                  } else if (bonus.type === 'fee_discount') {
                    updates.tradingFeeDiscount = Math.max(parseFloat(existingBenefits.tradingFeeDiscount), bonus.value).toString();
                  } else if (bonus.type === 'xp_multiplier') {
                    updates.xpMultiplier = Math.max(parseFloat(existingBenefits.xpMultiplier), bonus.value).toString();
                  }
                });

                if (isMasterCertified) {
                  updates.certificationBadgeTier = 'master';
                } else if (isCertified) {
                  updates.certificationBadgeTier = 'certified';
                }

                updates.updatedAt = new Date();

                await db.update(subscriberActiveBenefits)
                  .set(updates)
                  .where(eq(subscriberActiveBenefits.userId, userId));
              } else {
                // Create new benefits record
                const initialBenefits: any = {
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
                  } else if (bonus.type === 'fee_discount') {
                    initialBenefits.tradingFeeDiscount = bonus.value.toString();
                  } else if (bonus.type === 'xp_multiplier') {
                    initialBenefits.xpMultiplier = bonus.value.toString();
                  }
                });

                await db.insert(subscriberActiveBenefits).values(initialBenefits);
              }
            }
          }
        }
      }

      res.json({ attempt, passed, score, penaltyCharged });
    } catch (error) {
      console.error('Error submitting exam:', error);
      res.status(500).json({ error: 'Failed to submit exam' });
    }
  });

  // ================================
  // EASTER EGG SYSTEM ROUTES
  // ================================

  // Get all Easter egg definitions (filtered by subscriber status)
  app.get('/api/easter-eggs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const isSubscriber = user && user.subscriptionTier !== 'free';

      // Get all active eggs
      const eggs = await db.select().from(easterEggDefinitions)
        .where(eq(easterEggDefinitions.isActive, true));

      // Filter by subscriber status and visibility
      const visibleEggs = eggs.filter(egg => {
        if (egg.subscribersOnly && !isSubscriber) return false;
        return true;
      });

      // Get user's progress to determine which eggs to show
      const progress = await db.select().from(easterEggUserProgress)
        .where(eq(easterEggUserProgress.userId, userId));

      const progressMap = new Map(progress.map(p => [p.eggId, p]));

      // Only show non-secret eggs OR eggs the user has discovered
      const filteredEggs = visibleEggs.filter(egg => {
        const userProgress = progressMap.get(egg.id);
        return !egg.isSecret || (userProgress && userProgress.isUnlocked);
      });

      res.json(filteredEggs);
    } catch (error) {
      console.error('Error fetching Easter eggs:', error);
      res.status(500).json({ error: 'Failed to fetch Easter eggs' });
    }
  });

  // Get user's progress on all Easter eggs
  app.get('/api/easter-eggs/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await db.select().from(easterEggUserProgress)
        .where(eq(easterEggUserProgress.userId, userId));
      res.json(progress);
    } catch (error) {
      console.error('Error fetching Easter egg progress:', error);
      res.status(500).json({ error: 'Failed to fetch Easter egg progress' });
    }
  });

  // Get user's unlocked Easter eggs
  app.get('/api/easter-eggs/unlocked', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const unlocked = await db.select({
        id: easterEggUnlocks.id,
        egg_id: easterEggUnlocks.eggId,
        unlocked_at: easterEggUnlocks.unlockedAt,
        reward_claimed: easterEggUnlocks.rewardClaimed,
        reward_claimed_at: easterEggUnlocks.rewardClaimedAt,
        egg_name: easterEggDefinitions.name,
        egg_description: easterEggDefinitions.description,
        egg_rarity: easterEggDefinitions.rarity,
      })
        .from(easterEggUnlocks)
        .leftJoin(easterEggDefinitions, eq(easterEggUnlocks.eggId, easterEggDefinitions.id))
        .where(eq(easterEggUnlocks.userId, userId));
      res.json(unlocked);
    } catch (error) {
      console.error('Error fetching unlocked Easter eggs:', error);
      res.status(500).json({ error: 'Failed to fetch unlocked Easter eggs' });
    }
  });

  // Claim reward from an unlocked Easter egg
  app.post('/api/easter-eggs/claim/:unlockId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { unlockId } = req.params;

      // Get the unlock record
      const [unlock] = await db.select().from(easterEggUnlocks)
        .where(and(
          eq(easterEggUnlocks.id, unlockId),
          eq(easterEggUnlocks.userId, userId)
        ))
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
        const [portfolio] = await db.select().from(portfolios)
          .where(eq(portfolios.userId, userId))
          .limit(1);

        if (portfolio) {
          const newCash = parseFloat(portfolio.cash) + rewardValue;
          await db.update(portfolios)
            .set({ cash: newCash.toString() })
            .where(eq(portfolios.id, portfolio.id));
          rewardApplied = true;
        }
      } else if (unlock.rewardType === 'fee_waiver' || unlock.rewardType === 'xp_boost') {
        // Update user's active benefits
        const [benefits] = await db.select().from(subscriberActiveBenefits)
          .where(eq(subscriberActiveBenefits.userId, userId))
          .limit(1);

        if (benefits) {
          let updates: any = {};
          if (unlock.rewardType === 'fee_waiver') {
            updates.tradingFeeDiscount = Math.max(parseFloat(benefits.tradingFeeDiscount), rewardValue).toString();
          } else if (unlock.rewardType === 'xp_boost') {
            updates.xpMultiplier = Math.max(parseFloat(benefits.xpMultiplier), rewardValue).toString();
          }
          updates.updatedAt = new Date();

          await db.update(subscriberActiveBenefits)
            .set(updates)
            .where(eq(subscriberActiveBenefits.userId, userId));
          rewardApplied = true;
        } else {
          // Create new benefits record
          const initialBenefits: any = {
            userId,
            totalCapitalBonusEarned: '0',
            pendingCapitalBonus: '0',
            tradingFeeDiscount: unlock.rewardType === 'fee_waiver' ? rewardValue.toString() : '0',
            xpMultiplier: unlock.rewardType === 'xp_boost' ? rewardValue.toString() : '1.00',
            displayBadge: false
          };

          await db.insert(subscriberActiveBenefits).values(initialBenefits);
          rewardApplied = true;
        }
      }

      // Mark as claimed
      await db.update(easterEggUnlocks)
        .set({
          rewardClaimed: true,
          rewardClaimedAt: new Date(),
          rewardApplied
        })
        .where(eq(easterEggUnlocks.id, unlockId));

      res.json({ success: true, rewardApplied });
    } catch (error) {
      console.error('Error claiming Easter egg reward:', error);
      res.status(500).json({ error: 'Failed to claim reward' });
    }
  });

  // =============================================
  // INVESTMENT CLUBS API ROUTES
  // =============================================

  const { investmentClubService } = await import('./services/investmentClubService.js');
  const { insertInvestmentClubSchema, insertClubProposalSchema } = await import('@shared/schema.js');

  // Create new investment club
  app.post('/api/investment-clubs/create', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { name, description, minMembers, initialMembers } = req.body;

      const club = await investmentClubService.createClub(userId, {
        name,
        description,
        minMembers: minMembers || 3
      }, initialMembers || []);

      res.json(club);
    } catch (error) {
      console.error('Error creating investment club:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Get user's clubs
  app.get('/api/investment-clubs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const clubs = await storage.getUserInvestmentClubs(userId);
      res.json(clubs);
    } catch (error) {
      console.error('Error fetching user clubs:', error);
      res.status(500).json({ error: 'Failed to fetch clubs' });
    }
  });

  // Get club details
  app.get('/api/investment-clubs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const club = await storage.getInvestmentClub(id);
      if (!club) {
        return res.status(404).json({ error: 'Club not found' });
      }

      const membership = await storage.getClubMembership(id, userId);
      if (!membership) {
        return res.status(403).json({ error: 'Not a member of this club' });
      }

      const members = await storage.getClubMemberships(id, 'active');
      const portfolio = await storage.getClubPortfolioByClubId(id);

      res.json({
        ...club,
        members,
        portfolio,
        userRole: membership.role
      });
    } catch (error) {
      console.error('Error fetching club details:', error);
      res.status(500).json({ error: 'Failed to fetch club details' });
    }
  });

  // Invite member to club
  app.post('/api/investment-clubs/:id/invite', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { inviteeId } = req.body;
      const inviterId = req.user.id;

      await investmentClubService.inviteMember(id, inviterId, inviteeId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error inviting member:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Join club (accept invitation)
  app.post('/api/investment-clubs/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await investmentClubService.acceptInvitation(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error joining club:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Leave club
  app.post('/api/investment-clubs/:id/leave', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await investmentClubService.leaveClub(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error leaving club:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Remove member from club
  app.delete('/api/investment-clubs/:id/members/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { id, userId: memberIdToRemove } = req.params;
      const removerId = req.user.id;

      await investmentClubService.removeMember(id, removerId, memberIdToRemove);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Create proposal
  app.post('/api/investment-clubs/:id/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const proposalData = req.body;

      const proposal = await investmentClubService.createProposal(id, userId, proposalData);
      res.json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Get club proposals
  app.get('/api/investment-clubs/:id/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, proposalType } = req.query;

      const proposals = await storage.getClubProposals(id, {
        status: status as string,
        proposalType: proposalType as string
      });

      res.json(proposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  });

  // Cast vote on proposal
  app.post('/api/investment-clubs/:id/proposals/:proposalId/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { proposalId } = req.params;
      const { vote } = req.body;
      const userId = req.user.id;

      if (!['for', 'against', 'abstain'].includes(vote)) {
        return res.status(400).json({ error: 'Invalid vote type' });
      }

      await investmentClubService.castVote(proposalId, userId, vote);
      res.json({ success: true });
    } catch (error) {
      console.error('Error casting vote:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Get club activity log
  app.get('/api/investment-clubs/:id/activity', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { limit } = req.query;

      const userId = req.user.id;
      const membership = await storage.getClubMembership(id, userId);
      if (!membership) {
        return res.status(403).json({ error: 'Not a member of this club' });
      }

      const activityLog = await storage.getClubActivityLog(id, limit ? parseInt(limit as string) : 50);
      res.json(activityLog);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      res.status(500).json({ error: 'Failed to fetch activity log' });
    }
  });

  // Dissolve club (owner only)
  app.post('/api/investment-clubs/:id/dissolve', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await investmentClubService.dissolveClub(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error dissolving club:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Price History Routes - Historical pricing data for graded comics
  
  // Get price history for specific asset and grade
  app.get('/api/price-history/:assetId', async (req: any, res) => {
    try {
      const { assetId } = req.params;
      const { grade, days } = req.query;

      if (!grade) {
        return res.status(400).json({ error: 'Grade parameter is required' });
      }

      const daysNum = days ? parseInt(days as string) : 30;
      if (isNaN(daysNum) || daysNum <= 0) {
        return res.status(400).json({ error: 'Days must be a positive number' });
      }

      const pricePoints = await storage.getPriceHistory(assetId, grade as string, daysNum);

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
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  });

  // Get latest prices for all grades of an asset
  app.get('/api/price-history/:assetId/grades', async (req: any, res) => {
    try {
      const { assetId } = req.params;

      const latestPrices = await storage.getLatestPricesByGrade(assetId);

      res.json({
        assetId,
        grades: latestPrices.map(p => ({
          grade: p.grade,
          price: parseFloat(p.price),
          lastUpdated: p.snapshotDate
        }))
      });
    } catch (error) {
      console.error('Error fetching latest prices by grade:', error);
      res.status(500).json({ error: 'Failed to fetch latest prices by grade' });
    }
  });

  // Get price trends for an asset over a specified timeframe
  app.get('/api/price-history/:assetId/trends/:timeframe', async (req: any, res) => {
    try {
      const { assetId, timeframe } = req.params;

      if (!['30d', '90d', '1y'].includes(timeframe)) {
        return res.status(400).json({ 
          error: 'Invalid timeframe. Must be one of: 30d, 90d, 1y' 
        });
      }

      const trends = await storage.getPriceTrends(
        assetId, 
        timeframe as '30d' | '90d' | '1y'
      );

      res.json(trends);
    } catch (error) {
      console.error('Error fetching price trends:', error);
      res.status(500).json({ error: 'Failed to fetch price trends' });
    }
  });

  // Initialize WebSocket notification service for real-time notifications
  console.log('🔔 Initializing WebSocket notification service...');
  wsNotificationService.initialize(httpServer, '/ws/notifications');
  console.log('✅ WebSocket notification service initialized');

  return httpServer;
}
