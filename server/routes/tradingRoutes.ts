import { Router } from "express";
import { storage } from "../storage";
import { tradingService } from "../services/tradingService";
import { positionService } from "../services/positionService";
import { orderMatchingEngine } from "../services/orderMatchingEngine";
import { z } from "zod";
import type { Request, Response } from "express";

const router = Router();

// Validation schemas
const placeOrderSchema = z.object({
  portfolioId: z.string(),
  assetId: z.string(),
  orderType: z.enum(['market', 'limit']),
  side: z.enum(['buy', 'sell']),
  quantity: z.number().positive(),
  price: z.number().positive().optional(), // Required for limit orders
});

/**
 * POST /api/trading/order/market - Place a market order (simplified endpoint)
 */
router.post("/order/market", async (req: any, res: Response) => {
  try {
    // Check authentication
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { userId, portfolioId, assetId, side, quantity } = req.body;
    
    if (!userId || !assetId || !side || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Execute market order with moral consequences
    const result = await tradingService.executeMarketOrder(
      userId,
      portfolioId || 'default',
      assetId,
      side,
      quantity
    );
    
    // Return trade result including any victim data
    res.json(result);
  } catch (error: any) {
    console.error("Market order error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to execute order",
      trade: null,
      victim: null
    });
  }
});

/**
 * POST /api/trading/order - Place a market or limit order
 */
router.post("/order", async (req: any, res: Response) => {
  try {
    // Check authentication
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const validatedData = placeOrderSchema.parse(req.body);

    // Get or create default portfolio if not specified
    let portfolioId = validatedData.portfolioId;
    if (!portfolioId) {
      const portfolios = await storage.getUserPortfolios(userId);
      const defaultPortfolio = portfolios.find(p => p.isDefault);
      
      if (defaultPortfolio) {
        portfolioId = defaultPortfolio.id;
      } else {
        // Create default portfolio for new users
        const newPortfolio = await storage.createPortfolio({
          userId,
          name: "Default Trading Portfolio",
          description: "Main trading portfolio",
          portfolioType: "default",
          isDefault: true,
          cashBalance: "100000.00",
          initialCashAllocation: "100000.00"
        });
        portfolioId = newPortfolio.id;
      }
    }

    let result;
    if (validatedData.orderType === 'market') {
      // Execute market order immediately
      result = await tradingService.executeMarketOrder(
        userId,
        portfolioId,
        validatedData.assetId,
        validatedData.side,
        validatedData.quantity
      );
    } else {
      // Place limit order
      if (!validatedData.price) {
        return res.status(400).json({ error: "Price is required for limit orders" });
      }
      
      result = await tradingService.executeLimitOrder(
        userId,
        portfolioId,
        validatedData.assetId,
        validatedData.side,
        validatedData.quantity,
        validatedData.price
      );
    }

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      trade: result.trade,
      position: result.position,
      balance: result.balance
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid order data", details: error.errors });
    }
    console.error("Order placement error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

/**
 * GET /api/trading/positions - Get user's current positions
 */
router.get("/positions", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const portfolioId = req.query.portfolioId as string;

    if (!portfolioId) {
      // Get positions for all user portfolios
      const portfolios = await storage.getUserPortfolios(userId);
      const allPositions = [];
      
      for (const portfolio of portfolios) {
        const positions = await storage.getPositions(userId, portfolio.id);
        for (const position of positions) {
          const asset = await storage.getAsset(position.assetId);
          const currentPrice = await storage.getAssetCurrentPrice(position.assetId);
          
          allPositions.push({
            ...position,
            portfolioId: portfolio.id,
            portfolioName: portfolio.name,
            asset,
            currentPrice: currentPrice?.currentPrice
          });
        }
      }
      
      return res.json(allPositions);
    }

    // Get positions for specific portfolio
    const positions = await storage.getPositions(userId, portfolioId);
    const enrichedPositions = [];

    for (const position of positions) {
      const asset = await storage.getAsset(position.assetId);
      const currentPrice = await storage.getAssetCurrentPrice(position.assetId);
      
      // Calculate current P&L
      if (currentPrice) {
        const price = parseFloat(currentPrice.currentPrice);
        const pnl = positionService.calculatePnL(position, price);
        
        enrichedPositions.push({
          ...position,
          asset,
          currentPrice: price,
          currentValue: parseFloat(position.quantity) * price,
          unrealizedPnl: pnl.unrealizedPnl,
          unrealizedPnlPercent: pnl.unrealizedPnlPercent
        });
      } else {
        enrichedPositions.push({
          ...position,
          asset,
          currentPrice: null,
          currentValue: null,
          unrealizedPnl: null,
          unrealizedPnlPercent: null
        });
      }
    }

    res.json(enrichedPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

/**
 * GET /api/trading/orders - Get user's orders
 */
router.get("/orders", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const status = req.query.status as string;
    const portfolioId = req.query.portfolioId as string;

    let orders = await storage.getUserOrders(userId, status);

    // Filter by portfolio if specified
    if (portfolioId) {
      orders = orders.filter(order => order.portfolioId === portfolioId);
    }

    // Enrich orders with asset information
    const enrichedOrders = [];
    for (const order of orders) {
      const asset = await storage.getAsset(order.assetId);
      enrichedOrders.push({
        ...order,
        asset
      });
    }

    res.json(enrichedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * GET /api/trading/portfolio - Get portfolio summary with P&L
 */
router.get("/portfolio", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const portfolioId = req.query.portfolioId as string;

    if (!portfolioId) {
      return res.status(400).json({ error: "Portfolio ID is required" });
    }

    // Get portfolio
    const portfolio = await storage.getPortfolio(portfolioId);
    if (!portfolio || portfolio.userId !== userId) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    // Get balance
    let balance = await storage.getBalance(userId, portfolioId);
    if (!balance) {
      // Initialize balance for new portfolios
      balance = await storage.createBalance({
        userId,
        portfolioId,
        cash: portfolio.cashBalance || "100000.00",
        totalValue: portfolio.totalValue || "100000.00",
        buyingPower: portfolio.cashBalance || "100000.00"
      });
    }

    // Get positions and calculate metrics
    const positionMetrics = await positionService.calculateUnrealizedPnL(userId, portfolioId);

    // Get recent trades
    const trades = await storage.getTrades(userId, portfolioId, 10); // Last 10 trades

    // Calculate performance metrics
    const totalValue = parseFloat(balance.cash) + positionMetrics.totalValue;
    const initialValue = parseFloat(portfolio.initialCashAllocation || "100000.00");
    const totalReturn = totalValue - initialValue;
    const totalReturnPercent = (totalReturn / initialValue) * 100;

    res.json({
      portfolio: {
        ...portfolio,
        totalValue: totalValue.toString(),
        totalReturn: totalReturn.toString(),
        totalReturnPercent: totalReturnPercent.toString()
      },
      balance,
      positions: positionMetrics,
      recentTrades: trades,
      performance: {
        dayPnl: balance.dayPnl,
        dayPnlPercent: balance.dayPnlPercent,
        realizedPnl: balance.realizedPnl,
        unrealizedPnl: positionMetrics.unrealizedPnl.toString(),
        totalPnl: (parseFloat(balance.realizedPnl || "0") + positionMetrics.unrealizedPnl).toString(),
        winRate: balance.winRate,
        sharpeRatio: balance.sharpeRatio
      }
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

/**
 * DELETE /api/trading/order/:id - Cancel an open order
 */
router.delete("/order/:id", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const orderId = req.params.id;

    // Get order
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify ownership
    if (order.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Cancel order
    const cancelledOrder = await orderMatchingEngine.cancelOrder(orderId);
    
    res.json({
      success: true,
      order: cancelledOrder
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to cancel order" 
    });
  }
});

/**
 * GET /api/trading/trades - Get trade history
 */
router.get("/trades", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const portfolioId = req.query.portfolioId as string;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!portfolioId) {
      return res.status(400).json({ error: "Portfolio ID is required" });
    }

    const trades = await storage.getTrades(userId, portfolioId, limit);
    
    // Enrich trades with asset information
    const enrichedTrades = [];
    for (const trade of trades) {
      const asset = await storage.getAsset(trade.assetId);
      enrichedTrades.push({
        ...trade,
        asset
      });
    }

    res.json(enrichedTrades);
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

/**
 * POST /api/trading/risk-management - Set stop loss and take profit
 */
router.post("/risk-management", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const { positionId, stopLossPrice, takeProfitPrice } = req.body;

    if (!positionId) {
      return res.status(400).json({ error: "Position ID is required" });
    }

    // Verify position ownership
    const position = await storage.getPositionById(positionId);
    if (!position || position.userId !== userId) {
      return res.status(404).json({ error: "Position not found" });
    }

    const updatedPosition = await positionService.setRiskManagement(
      positionId,
      stopLossPrice,
      takeProfitPrice
    );

    res.json({
      success: true,
      position: updatedPosition
    });
  } catch (error) {
    console.error("Error setting risk management:", error);
    res.status(500).json({ error: "Failed to set risk management" });
  }
});

/**
 * GET /api/trading/concentration-risk - Get portfolio concentration risk
 */
router.get("/concentration-risk", async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.claims?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const portfolioId = req.query.portfolioId as string;

    if (!portfolioId) {
      return res.status(400).json({ error: "Portfolio ID is required" });
    }

    const riskMetrics = await positionService.getConcentrationRisk(userId, portfolioId);

    res.json(riskMetrics);
  } catch (error) {
    console.error("Error calculating concentration risk:", error);
    res.status(500).json({ error: "Failed to calculate concentration risk" });
  }
});

export default router;