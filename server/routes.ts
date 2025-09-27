import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import comicDataRoutes from "./routes/comicData.js";
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
  insertMarketEventSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Asset Management Routes
  app.get("/api/assets", async (req, res) => {
    try {
      const type = req.query.type as string;
      const search = req.query.search as string;
      const publisher = req.query.publisher as string;
      const assets = await storage.getAssets({ type, search, publisher });
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

  app.post("/api/watchlists/assets", async (req, res) => {
    try {
      const validatedData = insertWatchlistAssetSchema.parse(req.body);
      const watchlistAsset = await storage.addAssetToWatchlist(validatedData);
      res.status(201).json(watchlistAsset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid watchlist asset data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add asset to watchlist" });
    }
  });

  app.delete("/api/watchlists/:watchlistId/assets/:assetId", async (req, res) => {
    try {
      const removed = await storage.removeAssetFromWatchlist(req.params.watchlistId, req.params.assetId);
      if (!removed) {
        return res.status(404).json({ error: "Asset not found in watchlist" });
      }
      res.status(204).send();
    } catch (error) {
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

  // PPIx Index Routes (Comic Book Market Indices)
  app.get("/api/ppix/indices", async (req, res) => {
    console.log('🔥 PPIx indices endpoint called!');
    
    try {
      console.log('🔥 Importing market pricing service...');
      const { marketPricingService } = await import('./services/marketPricingService.js');
      
      // Generate smaller sample of assets for faster calculation (50 for demo)
      console.log('🔥 Generating PPIx indices with sample data...');
      const assets = await marketPricingService.generateTradingAssetsWithPricing(50);
      console.log(`🔥 Generated ${assets.length} assets for PPIx calculation`);
      
      if (!assets || assets.length === 0) {
        console.error('🔥 ERROR: No trading assets available');
        throw new Error('No trading assets available');
      }

      console.log('🔥 Importing PPIx index service...');
      const { ppixIndexService } = await import('./services/ppixIndexService.js');
      
      // Calculate both indices
      console.log('🔥 Calculating PPIx indices...');
      const ppix50 = await ppixIndexService.calculatePPIx50(assets);
      const ppix100 = await ppixIndexService.calculatePPIx100(assets);
      const comparison = ppixIndexService.generateIndexComparison(ppix50, ppix100);

      console.log('🔥 PPIx calculation successful! Returning data...');
      
      res.json({
        success: true,
        indices: {
          ppix50: {
            ...ppix50,
            methodology: ppixIndexService.getIndexMethodology('ppix50')
          },
          ppix100: {
            ...ppix100,
            methodology: ppixIndexService.getIndexMethodology('ppix100')
          }
        },
        comparison,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('🔥 ERROR calculating PPIx indices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate market indices',
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
        username: 'demo_user',
        password: 'mock',
        email: 'demo@example.com',
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

  const httpServer = createServer(app);

  return httpServer;
}
