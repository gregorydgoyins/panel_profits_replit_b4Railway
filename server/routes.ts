import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
      const assets = await storage.getAssets({ type, search });
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

  const httpServer = createServer(app);

  return httpServer;
}
