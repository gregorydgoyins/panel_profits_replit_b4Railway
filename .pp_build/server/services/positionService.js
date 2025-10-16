"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionService = exports.PositionService = void 0;
const storage_1 = require("../storage");
class PositionService {
    constructor() { }
    static getInstance() {
        if (!PositionService.instance) {
            PositionService.instance = new PositionService();
        }
        return PositionService.instance;
    }
    /**
     * Track cost basis for a position after a trade
     */
    async trackCostBasis(userId, portfolioId, assetId, trade) {
        const existingPosition = await storage_1.storage.getPosition(userId, portfolioId, assetId);
        const tradeQty = parseFloat(trade.quantity);
        const tradePrice = parseFloat(trade.price);
        if (trade.side === 'buy') {
            return await this.handleBuyTrade(userId, portfolioId, assetId, existingPosition, tradeQty, tradePrice);
        }
        else {
            return await this.handleSellTrade(userId, portfolioId, assetId, existingPosition, tradeQty, tradePrice);
        }
    }
    /**
     * Handle buy trade - update or create position
     */
    async handleBuyTrade(userId, portfolioId, assetId, existingPosition, quantity, price) {
        if (existingPosition) {
            // Calculate new weighted average cost
            const currentQty = parseFloat(existingPosition.quantity);
            const currentAvgCost = parseFloat(existingPosition.averageCost);
            const currentCostBasis = currentQty * currentAvgCost;
            const newQty = currentQty + quantity;
            const newCostBasis = currentCostBasis + (quantity * price);
            const newAvgCost = newCostBasis / newQty;
            const updatedPosition = await storage_1.storage.updatePosition(existingPosition.id, {
                quantity: newQty.toString(),
                averageCost: newAvgCost.toString(),
                totalCostBasis: newCostBasis.toString(),
                lastTradeDate: new Date(),
                totalBuys: (existingPosition.totalBuys || 0) + 1
            });
            return {
                position: updatedPosition,
                averageCost: newAvgCost
            };
        }
        else {
            // Create new position
            const costBasis = quantity * price;
            const newPosition = {
                userId,
                portfolioId,
                assetId,
                quantity: quantity.toString(),
                averageCost: price.toString(),
                totalCostBasis: costBasis.toString(),
                firstBuyDate: new Date(),
                lastTradeDate: new Date(),
                totalBuys: 1,
                totalSells: 0
            };
            const createdPosition = await storage_1.storage.createPosition(newPosition);
            return {
                position: createdPosition,
                averageCost: price
            };
        }
    }
    /**
     * Handle sell trade - update or close position
     */
    async handleSellTrade(userId, portfolioId, assetId, existingPosition, quantity, price) {
        const currentQty = parseFloat(existingPosition.quantity);
        const avgCost = parseFloat(existingPosition.averageCost);
        if (quantity > currentQty) {
            throw new Error(`Cannot sell ${quantity} shares. Only ${currentQty} available.`);
        }
        // Calculate realized P&L for this sale
        const costBasisSold = quantity * avgCost;
        const proceeds = quantity * price;
        const realizedPnl = proceeds - costBasisSold;
        const remainingQty = currentQty - quantity;
        if (remainingQty <= 0) {
            // Close position completely
            await storage_1.storage.deletePosition(existingPosition.id);
            return {
                position: existingPosition,
                averageCost: avgCost,
                realizedPnl
            };
        }
        else {
            // Partial sell - average cost remains the same
            const newCostBasis = remainingQty * avgCost;
            const updatedPosition = await storage_1.storage.updatePosition(existingPosition.id, {
                quantity: remainingQty.toString(),
                totalCostBasis: newCostBasis.toString(),
                lastTradeDate: new Date(),
                totalSells: (existingPosition.totalSells || 0) + 1
            });
            return {
                position: updatedPosition,
                averageCost: avgCost,
                realizedPnl
            };
        }
    }
    /**
     * Calculate unrealized gains/losses for all positions
     */
    async calculateUnrealizedPnL(userId, portfolioId) {
        const positions = await storage_1.storage.getPositions(userId, portfolioId);
        const positionDetails = [];
        let totalValue = 0;
        let totalCostBasis = 0;
        for (const position of positions) {
            const currentPrice = await storage_1.storage.getAssetCurrentPrice(position.assetId);
            if (!currentPrice)
                continue;
            const asset = await storage_1.storage.getAsset(position.assetId);
            const price = parseFloat(currentPrice.currentPrice);
            const qty = parseFloat(position.quantity);
            const avgCost = parseFloat(position.averageCost);
            const costBasis = parseFloat(position.totalCostBasis);
            const currentValue = qty * price;
            const unrealizedPnl = currentValue - costBasis;
            const unrealizedPnlPercent = ((price - avgCost) / avgCost) * 100;
            // Calculate holding period
            const firstBuyDate = new Date(position.firstBuyDate);
            const holdingPeriod = Math.floor((Date.now() - firstBuyDate.getTime()) / (1000 * 60 * 60 * 24));
            totalValue += currentValue;
            totalCostBasis += costBasis;
            // Update position with current values
            await storage_1.storage.updatePosition(position.id, {
                currentValue: currentValue.toString(),
                currentPrice: price.toString(),
                unrealizedPnl: unrealizedPnl.toString(),
                unrealizedPnlPercent: unrealizedPnlPercent.toString(),
                holdingPeriodDays: holdingPeriod
            });
            positionDetails.push({
                position,
                asset,
                currentPrice: price,
                currentValue,
                unrealizedPnl,
                unrealizedPnlPercent,
                holdingPeriod,
                percentOfPortfolio: 0 // Will calculate after we have total
            });
        }
        // Calculate portfolio percentages
        positionDetails.forEach(detail => {
            detail.percentOfPortfolio = totalValue > 0 ? (detail.currentValue / totalValue) * 100 : 0;
        });
        const totalUnrealizedPnl = totalValue - totalCostBasis;
        const totalUnrealizedPnlPercent = totalCostBasis > 0
            ? ((totalValue - totalCostBasis) / totalCostBasis) * 100
            : 0;
        return {
            totalValue,
            totalCostBasis,
            unrealizedPnl: totalUnrealizedPnl,
            unrealizedPnlPercent: totalUnrealizedPnlPercent,
            positions: positionDetails
        };
    }
    /**
     * Handle position averaging when multiple buys at different prices
     */
    async handlePositionAveraging(position, newQuantity, newPrice) {
        const currentQty = parseFloat(position.quantity);
        const currentAvgCost = parseFloat(position.averageCost);
        const totalQty = currentQty + newQuantity;
        const totalCostBasis = (currentQty * currentAvgCost) + (newQuantity * newPrice);
        const newAverageCost = totalCostBasis / totalQty;
        return {
            newAverageCost,
            totalCostBasis
        };
    }
    /**
     * Track holding periods for tax purposes
     */
    getHoldingPeriod(position) {
        const firstBuyDate = new Date(position.firstBuyDate);
        const now = new Date();
        const days = Math.floor((now.getTime() - firstBuyDate.getTime()) / (1000 * 60 * 60 * 24));
        // Long-term capital gains apply after 365 days
        const isLongTerm = days >= 365;
        // Simplified tax rates (actual rates vary by income)
        const taxRate = isLongTerm ? 0.15 : 0.25; // 15% long-term, 25% short-term
        return {
            days,
            isLongTerm,
            taxRate
        };
    }
    /**
     * Update position with stop loss and take profit levels
     */
    async setRiskManagement(positionId, stopLossPrice, takeProfitPrice) {
        return await storage_1.storage.updatePosition(positionId, {
            stopLossPrice: stopLossPrice?.toString(),
            takeProfitPrice: takeProfitPrice?.toString()
        });
    }
    /**
     * Check if any positions hit their stop loss or take profit
     */
    async checkRiskLevels(userId, portfolioId) {
        const positions = await storage_1.storage.getPositions(userId, portfolioId);
        const stopLossHit = [];
        const takeProfitHit = [];
        for (const position of positions) {
            const currentPrice = await storage_1.storage.getAssetCurrentPrice(position.assetId);
            if (!currentPrice)
                continue;
            const price = parseFloat(currentPrice.currentPrice);
            if (position.stopLossPrice && price <= parseFloat(position.stopLossPrice)) {
                stopLossHit.push(position);
            }
            if (position.takeProfitPrice && price >= parseFloat(position.takeProfitPrice)) {
                takeProfitHit.push(position);
            }
        }
        return { stopLossHit, takeProfitHit };
    }
    /**
     * Track maximum unrealized profit for a position
     */
    async updateMaxUnrealizedProfit(position) {
        const currentPrice = await storage_1.storage.getAssetCurrentPrice(position.assetId);
        if (!currentPrice)
            return;
        const price = parseFloat(currentPrice.currentPrice);
        const qty = parseFloat(position.quantity);
        const avgCost = parseFloat(position.averageCost);
        const costBasis = qty * avgCost;
        const currentValue = qty * price;
        const unrealizedProfit = currentValue - costBasis;
        const maxProfit = position.maxUnrealizedProfit
            ? parseFloat(position.maxUnrealizedProfit)
            : 0;
        if (unrealizedProfit > maxProfit) {
            await storage_1.storage.updatePosition(position.id, {
                maxPositionValue: currentValue.toString(),
                maxUnrealizedProfit: unrealizedProfit.toString()
            });
        }
    }
    /**
     * Get position concentration risk metrics
     */
    async getConcentrationRisk(userId, portfolioId) {
        const metrics = await this.calculateUnrealizedPnL(userId, portfolioId);
        const positions = metrics.positions.sort((a, b) => b.percentOfPortfolio - a.percentOfPortfolio);
        // Check if any single position is over 20% of portfolio
        const isConcentrated = positions.some(p => p.percentOfPortfolio > 20);
        // Get top 3 positions
        const topPositions = positions.slice(0, 3).map(p => ({
            assetId: p.position.assetId,
            percentage: p.percentOfPortfolio
        }));
        // Calculate diversification score (0-100, where 100 is well diversified)
        // Based on Herfindahl-Hirschman Index
        const hhi = positions.reduce((sum, p) => sum + Math.pow(p.percentOfPortfolio, 2), 0);
        const diversificationScore = Math.max(0, 100 - (hhi / 100));
        return {
            isConcentrated,
            topPositions,
            diversificationScore
        };
    }
}
exports.PositionService = PositionService;
exports.positionService = PositionService.getInstance();
