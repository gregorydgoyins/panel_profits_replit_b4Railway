import { storage } from "../storage";
import { moralConsequenceEngine } from "./moralConsequenceEngine";
import type { 
  User, Order, Trade, Position, Balance, Asset, Portfolio,
  InsertOrder, InsertTrade, InsertPosition, InsertBalance,
  AssetCurrentPrice, TradingVictim
} from "@shared/schema";

interface ExecuteOrderResult {
  success: boolean;
  trade?: Trade;
  position?: Position;
  balance?: Balance;
  victim?: TradingVictim;
  corruptionIncrease?: number;
  error?: string;
}

export class TradingService {
  private static instance: TradingService;

  private constructor() {}

  static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  /**
   * Execute a market order immediately at current market price
   */
  async executeMarketOrder(
    userId: string,
    portfolioId: string,
    assetId: string,
    side: 'buy' | 'sell',
    quantity: number
  ): Promise<ExecuteOrderResult> {
    try {
      // Get current asset price
      const currentPrice = await storage.getAssetCurrentPrice(assetId);
      if (!currentPrice) {
        return { success: false, error: "Asset price not available" };
      }

      const price = parseFloat(currentPrice.currentPrice);
      const totalValue = price * quantity;

      // Get user balance
      const balance = await storage.getBalance(userId, portfolioId);
      if (!balance) {
        // Initialize balance for new users
        const newBalance: InsertBalance = {
          userId,
          portfolioId,
          cash: "100000.00",
          totalValue: "100000.00",
          buyingPower: "100000.00"
        };
        await storage.createBalance(newBalance);
      }

      // Check buying power for buy orders
      if (side === 'buy') {
        const currentBalance = balance || await storage.getBalance(userId, portfolioId);
        if (!currentBalance) {
          return { success: false, error: "Unable to retrieve balance" };
        }

        const buyingPower = parseFloat(currentBalance.buyingPower);
        const fees = totalValue * 0.001; // 0.1% trading fee
        const totalCost = totalValue + fees;

        if (buyingPower < totalCost) {
          return { success: false, error: `Insufficient funds. Required: $${totalCost.toFixed(2)}, Available: $${buyingPower.toFixed(2)}` };
        }
      }

      // Check position for sell orders
      if (side === 'sell') {
        const position = await storage.getPosition(userId, portfolioId, assetId);
        if (!position || parseFloat(position.quantity) < quantity) {
          const availableQty = position ? parseFloat(position.quantity) : 0;
          return { success: false, error: `Insufficient position. You have ${availableQty} shares, trying to sell ${quantity}` };
        }
      }

      // Create the order
      const order: InsertOrder = {
        userId,
        portfolioId,
        assetId,
        type: side,
        side,
        orderType: 'market',
        quantity: quantity.toString(),
        price: price.toString(),
        totalValue: totalValue.toString(),
        status: 'filled',
        filledQuantity: quantity.toString(),
        averageFillPrice: price.toString(),
        fees: (totalValue * 0.001).toString(),
        filledAt: new Date()
      };

      const createdOrder = await storage.createOrder(order);

      // Execute the trade
      const trade = await this.executeTrade(
        userId,
        portfolioId,
        assetId,
        createdOrder.id,
        side,
        quantity,
        price
      );

      if (!trade) {
        return { success: false, error: "Failed to execute trade" };
      }

      // Update position
      const position = await this.updatePosition(userId, portfolioId, assetId, trade);
      
      // Update balance
      const updatedBalance = await this.updateBalance(userId, portfolioId, trade);

      // Generate victim and track corruption for profitable trades
      let victim: TradingVictim | undefined;
      let corruptionIncrease: number | undefined;
      
      if (trade.pnl && parseFloat(trade.pnl) > 0) {
        const profit = parseFloat(trade.pnl);
        
        // Generate a victim for this profitable trade
        victim = await moralConsequenceEngine.generateVictim(trade, profit);
        
        // Update user's corruption level
        corruptionIncrease = await moralConsequenceEngine.calculateCorruption(userId, profit);
        
        console.log(`😈 Profitable trade generated victim: ${victim.victimName} - Corruption +${corruptionIncrease.toFixed(2)}`);
      }

      return {
        success: true,
        trade,
        position,
        balance: updatedBalance,
        victim,
        corruptionIncrease
      };

    } catch (error) {
      console.error("Market order execution failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Execute a limit order (queued for execution when price is met)
   */
  async executeLimitOrder(
    userId: string,
    portfolioId: string,
    assetId: string,
    side: 'buy' | 'sell',
    quantity: number,
    limitPrice: number
  ): Promise<ExecuteOrderResult> {
    try {
      const totalValue = limitPrice * quantity;

      // Get user balance for validation
      const balance = await storage.getBalance(userId, portfolioId);
      if (!balance) {
        return { success: false, error: "Balance not found" };
      }

      // Check buying power for buy orders
      if (side === 'buy') {
        const buyingPower = parseFloat(balance.buyingPower);
        const fees = totalValue * 0.001; // 0.1% trading fee
        const totalCost = totalValue + fees;

        if (buyingPower < totalCost) {
          return { success: false, error: `Insufficient funds for limit order` };
        }
      }

      // Check position for sell orders
      if (side === 'sell') {
        const position = await storage.getPosition(userId, portfolioId, assetId);
        if (!position || parseFloat(position.quantity) < quantity) {
          return { success: false, error: `Insufficient position for sell order` };
        }
      }

      // Create the limit order (pending status)
      const order: InsertOrder = {
        userId,
        portfolioId,
        assetId,
        type: side,
        side,
        orderType: 'limit',
        quantity: quantity.toString(),
        price: limitPrice.toString(),
        totalValue: totalValue.toString(),
        status: 'pending',
        fees: (totalValue * 0.001).toString()
      };

      const createdOrder = await storage.createOrder(order);

      // Reserve funds for buy orders
      if (side === 'buy') {
        const totalCost = totalValue + parseFloat(order.fees || "0");
        await this.reserveFunds(userId, portfolioId, totalCost);
      }

      return {
        success: true,
        trade: undefined, // No trade yet for limit order
        position: undefined,
        balance
      };

    } catch (error) {
      console.error("Limit order creation failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Execute a trade and record it
   */
  private async executeTrade(
    userId: string,
    portfolioId: string,
    assetId: string,
    orderId: string,
    side: 'buy' | 'sell',
    quantity: number,
    price: number
  ): Promise<Trade | undefined> {
    const totalValue = quantity * price;
    const fees = totalValue * 0.001; // 0.1% trading fee

    let pnl = null;
    let pnlPercent = null;
    let costBasis = null;

    // Calculate P&L for sell trades
    if (side === 'sell') {
      const position = await storage.getPosition(userId, portfolioId, assetId);
      if (position) {
        const avgCost = parseFloat(position.averageCost);
        costBasis = avgCost * quantity;
        pnl = (price - avgCost) * quantity - fees;
        pnlPercent = ((price - avgCost) / avgCost) * 100;
      }
    }

    const trade: InsertTrade = {
      userId,
      portfolioId,
      assetId,
      orderId,
      side,
      quantity: quantity.toString(),
      price: price.toString(),
      totalValue: totalValue.toString(),
      fees: fees.toString(),
      pnl: pnl?.toString(),
      pnlPercent: pnlPercent?.toString(),
      costBasis: costBasis?.toString(),
      tradeType: 'manual'
    };

    return await storage.createTrade(trade);
  }

  /**
   * Update position after a trade
   */
  async updatePosition(
    userId: string,
    portfolioId: string,
    assetId: string,
    trade: Trade
  ): Promise<Position | undefined> {
    const existingPosition = await storage.getPosition(userId, portfolioId, assetId);
    const tradeQty = parseFloat(trade.quantity);
    const tradePrice = parseFloat(trade.price);

    if (trade.side === 'buy') {
      if (existingPosition) {
        // Update existing position - calculate new average cost
        const currentQty = parseFloat(existingPosition.quantity);
        const currentAvgCost = parseFloat(existingPosition.averageCost);
        const newQty = currentQty + tradeQty;
        const newAvgCost = ((currentQty * currentAvgCost) + (tradeQty * tradePrice)) / newQty;
        const totalCostBasis = newQty * newAvgCost;

        return await storage.updatePosition(existingPosition.id, {
          quantity: newQty.toString(),
          averageCost: newAvgCost.toString(),
          totalCostBasis: totalCostBasis.toString(),
          lastTradeDate: new Date(),
          totalBuys: (existingPosition.totalBuys || 0) + 1
        });
      } else {
        // Create new position
        const position: InsertPosition = {
          userId,
          portfolioId,
          assetId,
          quantity: tradeQty.toString(),
          averageCost: tradePrice.toString(),
          totalCostBasis: (tradeQty * tradePrice).toString(),
          firstBuyDate: new Date(),
          lastTradeDate: new Date(),
          totalBuys: 1,
          totalSells: 0
        };
        return await storage.createPosition(position);
      }
    } else { // sell
      if (!existingPosition) {
        throw new Error("Cannot sell - no position exists");
      }

      const currentQty = parseFloat(existingPosition.quantity);
      const newQty = currentQty - tradeQty;

      if (newQty <= 0) {
        // Close position completely
        await storage.deletePosition(existingPosition.id);
        return undefined;
      } else {
        // Partial sell - keep average cost the same
        const totalCostBasis = newQty * parseFloat(existingPosition.averageCost);
        return await storage.updatePosition(existingPosition.id, {
          quantity: newQty.toString(),
          totalCostBasis: totalCostBasis.toString(),
          lastTradeDate: new Date(),
          totalSells: (existingPosition.totalSells || 0) + 1
        });
      }
    }
  }

  /**
   * Update balance after a trade
   */
  private async updateBalance(
    userId: string,
    portfolioId: string,
    trade: Trade
  ): Promise<Balance | undefined> {
    const balance = await storage.getBalance(userId, portfolioId);
    if (!balance) {
      throw new Error("Balance not found");
    }

    const tradeValue = parseFloat(trade.totalValue);
    const fees = parseFloat(trade.fees || "0");
    const currentCash = parseFloat(balance.cash);
    let newCash: number;
    let realizedPnl = parseFloat(balance.realizedPnl || "0");

    if (trade.side === 'buy') {
      newCash = currentCash - tradeValue - fees;
    } else { // sell
      newCash = currentCash + tradeValue - fees;
      if (trade.pnl) {
        realizedPnl += parseFloat(trade.pnl);
      }
    }

    // Calculate total portfolio value
    const positions = await storage.getPositions(userId, portfolioId);
    let positionsValue = 0;
    let unrealizedPnl = 0;

    for (const position of positions) {
      const currentPrice = await storage.getAssetCurrentPrice(position.assetId);
      if (currentPrice) {
        const price = parseFloat(currentPrice.currentPrice);
        const qty = parseFloat(position.quantity);
        const value = price * qty;
        const costBasis = parseFloat(position.totalCostBasis);
        
        positionsValue += value;
        unrealizedPnl += value - costBasis;
      }
    }

    const totalValue = newCash + positionsValue;
    const totalPnl = realizedPnl + unrealizedPnl;

    return await storage.updateBalance(balance.id, {
      cash: newCash.toString(),
      totalValue: totalValue.toString(),
      buyingPower: newCash.toString(), // For now, buying power = cash (no margin)
      positionsValue: positionsValue.toString(),
      realizedPnl: realizedPnl.toString(),
      unrealizedPnl: unrealizedPnl.toString(),
      totalPnl: totalPnl.toString(),
      lastTradeAt: new Date()
    });
  }

  /**
   * Calculate P&L for a position
   */
  calculatePnL(position: Position, currentPrice: number): { unrealizedPnl: number; unrealizedPnlPercent: number } {
    const qty = parseFloat(position.quantity);
    const avgCost = parseFloat(position.averageCost);
    const currentValue = qty * currentPrice;
    const costBasis = qty * avgCost;
    
    const unrealizedPnl = currentValue - costBasis;
    const unrealizedPnlPercent = ((currentPrice - avgCost) / avgCost) * 100;

    return { unrealizedPnl, unrealizedPnlPercent };
  }

  /**
   * Get total portfolio value for a user
   */
  async getPortfolioValue(userId: string, portfolioId: string): Promise<number> {
    const balance = await storage.getBalance(userId, portfolioId);
    if (!balance) {
      return 0;
    }

    const cash = parseFloat(balance.cash);
    const positions = await storage.getPositions(userId, portfolioId);
    
    let positionsValue = 0;
    for (const position of positions) {
      const currentPrice = await storage.getAssetCurrentPrice(position.assetId);
      if (currentPrice) {
        const price = parseFloat(currentPrice.currentPrice);
        const qty = parseFloat(position.quantity);
        positionsValue += price * qty;
      }
    }

    return cash + positionsValue;
  }

  /**
   * Reserve funds for pending orders
   */
  private async reserveFunds(userId: string, portfolioId: string, amount: number): Promise<void> {
    const balance = await storage.getBalance(userId, portfolioId);
    if (!balance) {
      throw new Error("Balance not found");
    }

    const currentBuyingPower = parseFloat(balance.buyingPower);
    const newBuyingPower = currentBuyingPower - amount;

    await storage.updateBalance(balance.id, {
      buyingPower: newBuyingPower.toString()
    });
  }

  /**
   * Release reserved funds when order is cancelled
   */
  async releaseFunds(userId: string, portfolioId: string, amount: number): Promise<void> {
    const balance = await storage.getBalance(userId, portfolioId);
    if (!balance) {
      throw new Error("Balance not found");
    }

    const currentBuyingPower = parseFloat(balance.buyingPower);
    const newBuyingPower = currentBuyingPower + amount;

    await storage.updateBalance(balance.id, {
      buyingPower: newBuyingPower.toString()
    });
  }
}

export const tradingService = TradingService.getInstance();