"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderMatchingEngine = exports.OrderMatchingEngine = void 0;
const storage_1 = require("../storage");
const tradingService_1 = require("./tradingService");
const notificationService_1 = require("./notificationService");
class OrderMatchingEngine {
    constructor() {
        this.isProcessing = false;
        this.matchingInterval = null;
    }
    static getInstance() {
        if (!OrderMatchingEngine.instance) {
            OrderMatchingEngine.instance = new OrderMatchingEngine();
        }
        return OrderMatchingEngine.instance;
    }
    /**
     * Start the order matching engine
     */
    start(intervalMs = 1000) {
        if (this.matchingInterval) {
            console.log("Order matching engine already running");
            return;
        }
        console.log("🎯 Starting order matching engine...");
        this.matchingInterval = setInterval(async () => {
            if (!this.isProcessing) {
                await this.processOrderBook();
            }
        }, intervalMs);
    }
    /**
     * Stop the order matching engine
     */
    stop() {
        if (this.matchingInterval) {
            clearInterval(this.matchingInterval);
            this.matchingInterval = null;
            console.log("🛑 Order matching engine stopped");
        }
    }
    /**
     * Process orders - public method called by scheduled services
     */
    async processOrders() {
        if (!this.isProcessing) {
            await this.processOrderBook();
        }
    }
    /**
     * Process all pending orders in the order book
     */
    async processOrderBook() {
        this.isProcessing = true;
        try {
            // Get all pending orders
            const pendingOrders = await storage_1.storage.getOrdersByStatus('pending');
            if (pendingOrders.length === 0) {
                this.isProcessing = false;
                return;
            }
            // Group orders by asset
            const ordersByAsset = this.groupOrdersByAsset(pendingOrders);
            // Process each asset's order book
            for (const [assetId, orders] of ordersByAsset) {
                await this.processAssetOrderBook(assetId, orders);
            }
        }
        catch (error) {
            console.error("Error processing order book:", error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    /**
     * Group orders by asset ID
     */
    groupOrdersByAsset(orders) {
        const ordersByAsset = new Map();
        for (const order of orders) {
            if (!ordersByAsset.has(order.assetId)) {
                ordersByAsset.set(order.assetId, []);
            }
            ordersByAsset.get(order.assetId).push(order);
        }
        return ordersByAsset;
    }
    /**
     * Process orders for a specific asset
     */
    async processAssetOrderBook(assetId, orders) {
        const result = {
            trades: [],
            updatedOrders: [],
            notifications: []
        };
        // Get current market price
        const currentPrice = await storage_1.storage.getAssetCurrentPrice(assetId);
        if (!currentPrice) {
            console.warn(`No price available for asset ${assetId}`);
            return result;
        }
        const marketPrice = parseFloat(currentPrice.currentPrice);
        // Separate buy and sell orders
        const buyOrders = orders
            .filter(o => o.side === 'buy')
            .sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0")); // Highest price first
        const sellOrders = orders
            .filter(o => o.side === 'sell')
            .sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0")); // Lowest price first
        // Process market orders first
        await this.executeMarketOrders(orders.filter(o => o.orderType === 'market'), marketPrice, result);
        // Match limit orders
        await this.matchLimitOrders(buyOrders.filter(o => o.orderType === 'limit'), sellOrders.filter(o => o.orderType === 'limit'), marketPrice, result);
        // Check limit orders against market price
        await this.checkLimitOrdersAgainstMarket(buyOrders.filter(o => o.orderType === 'limit'), sellOrders.filter(o => o.orderType === 'limit'), marketPrice, result);
        return result;
    }
    /**
     * Execute market orders immediately
     */
    async executeMarketOrders(marketOrders, marketPrice, result) {
        for (const order of marketOrders) {
            try {
                // Execute the market order
                const trade = await this.executeTrade(order, marketPrice, parseFloat(order.quantity));
                if (trade) {
                    result.trades.push(trade);
                    // Update order status
                    const updatedOrder = await storage_1.storage.updateOrder(order.id, {
                        status: 'filled',
                        filledQuantity: order.quantity,
                        averageFillPrice: marketPrice.toString(),
                        filledAt: new Date()
                    });
                    if (updatedOrder) {
                        result.updatedOrders.push(updatedOrder);
                    }
                    // Send notification
                    await this.sendExecutionNotification(order, trade);
                }
            }
            catch (error) {
                console.error(`Failed to execute market order ${order.id}:`, error);
                // Cancel the order if execution fails
                await storage_1.storage.updateOrder(order.id, {
                    status: 'cancelled',
                    rejectionReason: error instanceof Error ? error.message : 'Execution failed'
                });
            }
        }
    }
    /**
     * Match buy and sell limit orders
     */
    async matchLimitOrders(buyOrders, sellOrders, marketPrice, result) {
        let buyIndex = 0;
        let sellIndex = 0;
        while (buyIndex < buyOrders.length && sellIndex < sellOrders.length) {
            const buyOrder = buyOrders[buyIndex];
            const sellOrder = sellOrders[sellIndex];
            const buyPrice = parseFloat(buyOrder.price || "0");
            const sellPrice = parseFloat(sellOrder.price || "0");
            // Check if orders can match (buy price >= sell price)
            if (buyPrice >= sellPrice) {
                // Orders can match
                const buyRemaining = parseFloat(buyOrder.quantity) - parseFloat(buyOrder.filledQuantity || "0");
                const sellRemaining = parseFloat(sellOrder.quantity) - parseFloat(sellOrder.filledQuantity || "0");
                const matchQuantity = Math.min(buyRemaining, sellRemaining);
                const matchPrice = (buyPrice + sellPrice) / 2; // Use mid-price for fairness
                if (matchQuantity > 0) {
                    // Execute trades for both sides
                    const buyTrade = await this.executeTrade(buyOrder, matchPrice, matchQuantity);
                    const sellTrade = await this.executeTrade(sellOrder, matchPrice, matchQuantity);
                    if (buyTrade && sellTrade) {
                        result.trades.push(buyTrade, sellTrade);
                        // Update order filled quantities
                        const newBuyFilled = parseFloat(buyOrder.filledQuantity || "0") + matchQuantity;
                        const newSellFilled = parseFloat(sellOrder.filledQuantity || "0") + matchQuantity;
                        // Update buy order
                        const updatedBuyOrder = await storage_1.storage.updateOrder(buyOrder.id, {
                            filledQuantity: newBuyFilled.toString(),
                            status: newBuyFilled >= parseFloat(buyOrder.quantity) ? 'filled' : 'partially_filled',
                            averageFillPrice: matchPrice.toString(),
                            filledAt: newBuyFilled >= parseFloat(buyOrder.quantity) ? new Date() : undefined
                        });
                        // Update sell order
                        const updatedSellOrder = await storage_1.storage.updateOrder(sellOrder.id, {
                            filledQuantity: newSellFilled.toString(),
                            status: newSellFilled >= parseFloat(sellOrder.quantity) ? 'filled' : 'partially_filled',
                            averageFillPrice: matchPrice.toString(),
                            filledAt: newSellFilled >= parseFloat(sellOrder.quantity) ? new Date() : undefined
                        });
                        if (updatedBuyOrder)
                            result.updatedOrders.push(updatedBuyOrder);
                        if (updatedSellOrder)
                            result.updatedOrders.push(updatedSellOrder);
                        // Send notifications
                        await this.sendExecutionNotification(buyOrder, buyTrade);
                        await this.sendExecutionNotification(sellOrder, sellTrade);
                    }
                }
                // Move to next order if one is fully filled
                if (buyRemaining <= sellRemaining) {
                    buyIndex++;
                }
                if (sellRemaining <= buyRemaining) {
                    sellIndex++;
                }
            }
            else {
                // No more matches possible
                break;
            }
        }
    }
    /**
     * Check limit orders against current market price
     */
    async checkLimitOrdersAgainstMarket(buyOrders, sellOrders, marketPrice, result) {
        // Execute buy limit orders where limit price >= market price
        for (const buyOrder of buyOrders) {
            const limitPrice = parseFloat(buyOrder.price || "0");
            const remaining = parseFloat(buyOrder.quantity) - parseFloat(buyOrder.filledQuantity || "0");
            if (limitPrice >= marketPrice && remaining > 0 && buyOrder.status === 'pending') {
                const trade = await this.executeTrade(buyOrder, marketPrice, remaining);
                if (trade) {
                    result.trades.push(trade);
                    const updatedOrder = await storage_1.storage.updateOrder(buyOrder.id, {
                        status: 'filled',
                        filledQuantity: buyOrder.quantity,
                        averageFillPrice: marketPrice.toString(),
                        filledAt: new Date()
                    });
                    if (updatedOrder)
                        result.updatedOrders.push(updatedOrder);
                    await this.sendExecutionNotification(buyOrder, trade);
                }
            }
        }
        // Execute sell limit orders where limit price <= market price
        for (const sellOrder of sellOrders) {
            const limitPrice = parseFloat(sellOrder.price || "0");
            const remaining = parseFloat(sellOrder.quantity) - parseFloat(sellOrder.filledQuantity || "0");
            if (limitPrice <= marketPrice && remaining > 0 && sellOrder.status === 'pending') {
                const trade = await this.executeTrade(sellOrder, marketPrice, remaining);
                if (trade) {
                    result.trades.push(trade);
                    const updatedOrder = await storage_1.storage.updateOrder(sellOrder.id, {
                        status: 'filled',
                        filledQuantity: sellOrder.quantity,
                        averageFillPrice: marketPrice.toString(),
                        filledAt: new Date()
                    });
                    if (updatedOrder)
                        result.updatedOrders.push(updatedOrder);
                    await this.sendExecutionNotification(sellOrder, trade);
                }
            }
        }
    }
    /**
     * Execute a trade for an order
     */
    async executeTrade(order, price, quantity) {
        try {
            // Get balance and check funds
            const balance = await storage_1.storage.getBalance(order.userId, order.portfolioId);
            if (!balance) {
                throw new Error("Balance not found");
            }
            const totalValue = price * quantity;
            const fees = totalValue * 0.001; // 0.1% fee
            // Validate funds for buy orders
            if (order.side === 'buy') {
                const requiredFunds = totalValue + fees;
                if (parseFloat(balance.cash) < requiredFunds) {
                    throw new Error("Insufficient funds");
                }
            }
            // Validate position for sell orders
            if (order.side === 'sell') {
                const position = await storage_1.storage.getPosition(order.userId, order.portfolioId, order.assetId);
                if (!position || parseFloat(position.quantity) < quantity) {
                    throw new Error("Insufficient position");
                }
            }
            // Create the trade
            const trade = {
                userId: order.userId,
                portfolioId: order.portfolioId,
                assetId: order.assetId,
                orderId: order.id,
                side: order.side,
                quantity: quantity.toString(),
                price: price.toString(),
                totalValue: totalValue.toString(),
                fees: fees.toString(),
                tradeType: order.orderType === 'limit' ? 'manual' : 'manual'
            };
            const createdTrade = await storage_1.storage.createTrade(trade);
            // Update position and balance
            if (createdTrade) {
                await tradingService_1.tradingService.updatePosition(order.userId, order.portfolioId, order.assetId, createdTrade);
            }
            return createdTrade;
        }
        catch (error) {
            console.error(`Failed to execute trade for order ${order.id}:`, error);
            return undefined;
        }
    }
    /**
     * Send execution notification to user
     */
    async sendExecutionNotification(order, trade) {
        try {
            const asset = await storage_1.storage.getAsset(order.assetId);
            const assetName = asset?.name || 'Unknown Asset';
            const notification = {
                userId: order.userId,
                type: 'order',
                title: 'Order Executed',
                message: `Your ${order.side} order for ${trade.quantity} shares of ${assetName} has been filled at $${trade.price}`,
                priority: 'high',
                metadata: {
                    orderId: order.id,
                    tradeId: trade.id,
                    assetId: order.assetId,
                    side: order.side,
                    quantity: trade.quantity,
                    price: trade.price,
                    totalValue: trade.totalValue
                }
            };
            await notificationService_1.notificationService.createNotification(notification);
        }
        catch (error) {
            console.error("Failed to send execution notification:", error);
        }
    }
    /**
     * Handle partial fills for large orders
     */
    async handlePartialFill(order, filledQuantity, fillPrice) {
        const currentFilled = parseFloat(order.filledQuantity || "0");
        const newFilled = currentFilled + filledQuantity;
        const totalQuantity = parseFloat(order.quantity);
        const currentAvgPrice = parseFloat(order.averageFillPrice || "0");
        const newAvgPrice = currentFilled > 0
            ? ((currentAvgPrice * currentFilled) + (fillPrice * filledQuantity)) / newFilled
            : fillPrice;
        return await storage_1.storage.updateOrder(order.id, {
            filledQuantity: newFilled.toString(),
            averageFillPrice: newAvgPrice.toString(),
            status: newFilled >= totalQuantity ? 'filled' : 'partially_filled',
            filledAt: newFilled >= totalQuantity ? new Date() : undefined
        });
    }
    /**
     * Cancel an order and release reserved funds
     */
    async cancelOrder(orderId) {
        const order = await storage_1.storage.getOrder(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.status === 'filled' || order.status === 'cancelled') {
            throw new Error(`Cannot cancel ${order.status} order`);
        }
        // Release reserved funds for buy orders
        if (order.side === 'buy' && order.status === 'pending') {
            const totalValue = parseFloat(order.totalValue || "0");
            const fees = parseFloat(order.fees || "0");
            await tradingService_1.tradingService.releaseFunds(order.userId, order.portfolioId, totalValue + fees);
        }
        return await storage_1.storage.updateOrder(orderId, {
            status: 'cancelled',
            rejectionReason: 'User cancelled'
        });
    }
}
exports.OrderMatchingEngine = OrderMatchingEngine;
exports.orderMatchingEngine = OrderMatchingEngine.getInstance();
