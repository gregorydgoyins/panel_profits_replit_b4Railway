"use strict";
/**
 * Panel Profits - Market Data Generator
 * Generates realistic price history, volume patterns, and technical indicators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketDataGenerator = exports.MarketDataGenerator = void 0;
const databaseStorage_1 = require("./databaseStorage");
const schema_js_1 = require("../shared/schema.js");
class MarketDataGenerator {
    /**
     * Generate random walk price movement with trend
     */
    generatePriceWalk(startPrice, bars, trend = 'sideways', volatility = 0.02) {
        const prices = [startPrice];
        const trendBias = trend === 'bullish' ? 0.001 : trend === 'bearish' ? -0.001 : 0;
        for (let i = 1; i < bars; i++) {
            const randomChange = (Math.random() - 0.5) * volatility;
            const change = randomChange + trendBias;
            const newPrice = prices[i - 1] * (1 + change);
            prices.push(Math.max(newPrice, 0.01)); // Prevent negative prices
        }
        return prices;
    }
    /**
     * Generate OHLCV data for a single bar
     */
    generateOHLCV(basePrice, volatility = 0.02) {
        const open = basePrice;
        const range = basePrice * volatility;
        // Generate high and low around the base price
        const high = open + (Math.random() * range);
        const low = open - (Math.random() * range);
        // Close somewhere between high and low
        const close = low + (Math.random() * (high - low));
        // Generate volume with some randomness
        const baseVolume = 100000;
        const volume = Math.floor(baseVolume * (0.5 + Math.random()));
        return {
            open,
            high,
            low,
            close,
            volume,
            timestamp: new Date()
        };
    }
    /**
     * Calculate Simple Moving Average
     */
    calculateSMA(prices, period) {
        if (prices.length < period)
            return prices[prices.length - 1];
        const slice = prices.slice(-period);
        const sum = slice.reduce((acc, price) => acc + price, 0);
        return sum / period;
    }
    /**
     * Calculate Exponential Moving Average
     */
    calculateEMA(prices, period) {
        if (prices.length < period)
            return prices[prices.length - 1];
        const multiplier = 2 / (period + 1);
        let ema = this.calculateSMA(prices.slice(0, period), period);
        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }
        return ema;
    }
    /**
     * Calculate RSI (Relative Strength Index)
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1)
            return 50;
        const changes = [];
        for (let i = 1; i < prices.length; i++) {
            changes.push(prices[i] - prices[i - 1]);
        }
        const gains = changes.slice(-period).map(c => c > 0 ? c : 0);
        const losses = changes.slice(-period).map(c => c < 0 ? Math.abs(c) : 0);
        const avgGain = gains.reduce((sum, g) => sum + g, 0) / period;
        const avgLoss = losses.reduce((sum, l) => sum + l, 0) / period;
        if (avgLoss === 0)
            return 100;
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        return rsi;
    }
    /**
     * Calculate MACD (Moving Average Convergence Divergence)
     */
    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macdValue = ema12 - ema26;
        // Signal line is 9-day EMA of MACD
        const macdValues = [macdValue]; // Simplified: use current value
        const signalLine = macdValue; // In reality, would calculate 9-day EMA of MACD history
        const histogram = macdValue - signalLine;
        return {
            value: macdValue,
            signal: signalLine,
            histogram
        };
    }
    /**
     * Calculate Bollinger Bands
     */
    calculateBollingerBands(prices, period = 20) {
        const sma = this.calculateSMA(prices, period);
        // Calculate standard deviation
        const slice = prices.slice(-period);
        const squaredDiffs = slice.map(p => Math.pow(p - sma, 2));
        const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / period;
        const stdDev = Math.sqrt(variance);
        return {
            upper: sma + (2 * stdDev),
            middle: sma,
            lower: sma - (2 * stdDev)
        };
    }
    /**
     * Calculate all technical indicators
     */
    calculateTechnicalIndicators(prices) {
        return {
            rsi: this.calculateRSI(prices, 14),
            macd: this.calculateMACD(prices),
            sma_20: this.calculateSMA(prices, 20),
            sma_50: this.calculateSMA(prices, 50),
            sma_200: this.calculateSMA(prices, 200),
            ema_12: this.calculateEMA(prices, 12),
            ema_26: this.calculateEMA(prices, 26),
            bollingerBands: this.calculateBollingerBands(prices, 20)
        };
    }
    /**
     * Generate historical market data for an asset
     */
    async generateHistoricalData(assetId, symbol, initialPrice, daysOfHistory = 365) {
        console.log(`📊 Generating ${daysOfHistory} days of market data for ${symbol}...`);
        // Generate price walk
        const trend = Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'sideways' : 'bearish';
        const volatility = 0.02 + (Math.random() * 0.03); // 2-5% daily volatility
        const closePrices = this.generatePriceWalk(initialPrice, daysOfHistory, trend, volatility);
        let inserted = 0;
        const now = new Date();
        // Generate daily bars
        for (let i = 0; i < daysOfHistory; i++) {
            const dayOffset = daysOfHistory - i - 1;
            const timestamp = new Date(now.getTime() - (dayOffset * 24 * 60 * 60 * 1000));
            const bar = this.generateOHLCV(closePrices[i], volatility);
            const change = i > 0 ? bar.close - closePrices[i - 1] : 0;
            const percentChange = i > 0 ? (change / closePrices[i - 1]) * 100 : 0;
            // Calculate market cap (simplified: price * 1M shares)
            const marketCap = bar.close * 1000000;
            // Calculate technical indicators from historical closes
            const historicalCloses = closePrices.slice(0, i + 1);
            const indicators = this.calculateTechnicalIndicators(historicalCloses);
            try {
                await databaseStorage_1.db.insert(schema_js_1.marketData).values({
                    assetId,
                    timeframe: '1d',
                    periodStart: timestamp,
                    open: bar.open.toFixed(2),
                    high: bar.high.toFixed(2),
                    low: bar.low.toFixed(2),
                    close: bar.close.toFixed(2),
                    volume: bar.volume,
                    change: change.toFixed(2),
                    percentChange: percentChange.toFixed(2),
                    marketCap: marketCap.toFixed(2),
                    technicalIndicators: indicators
                });
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting market data for ${symbol} on ${timestamp}:`, error);
            }
        }
        console.log(`✅ Generated ${inserted} bars for ${symbol}`);
        return inserted;
    }
    /**
     * Generate market data for all assets
     */
    async generateMarketDataForAllAssets(daysOfHistory = 365) {
        console.log('🚀 Starting market data generation for all assets...\n');
        // Fetch all assets
        const allAssets = await databaseStorage_1.db.select().from(schema_js_1.assets);
        console.log(`Found ${allAssets.length} assets to generate market data for\n`);
        let totalBars = 0;
        for (const asset of allAssets) {
            // Get initial price from metadata
            const metadata = asset.metadata;
            const initialPrice = metadata?.initialPrice || 100;
            const bars = await this.generateHistoricalData(asset.id, asset.symbol, initialPrice, daysOfHistory);
            totalBars += bars;
        }
        console.log('\n' + '='.repeat(60));
        console.log('✨ Market data generation complete!');
        console.log('='.repeat(60));
        console.log(`\n📊 Statistics:`);
        console.log(`   Assets processed: ${allAssets.length}`);
        console.log(`   Total bars generated: ${totalBars.toLocaleString()}`);
        console.log(`   Days of history: ${daysOfHistory}`);
    }
    /**
     * Generate intraday data (1m, 5m, 15m, 1h timeframes)
     */
    async generateIntradayData(assetId, symbol, currentPrice, hours = 24) {
        console.log(`📈 Generating intraday data for ${symbol}...`);
        const timeframes = [
            { name: '1m', intervalMinutes: 1, bars: hours * 60 },
            { name: '5m', intervalMinutes: 5, bars: hours * 12 },
            { name: '15m', intervalMinutes: 15, bars: hours * 4 },
            { name: '1h', intervalMinutes: 60, bars: hours }
        ];
        for (const tf of timeframes) {
            const prices = this.generatePriceWalk(currentPrice, tf.bars, 'sideways', 0.005);
            const now = new Date();
            for (let i = 0; i < tf.bars; i++) {
                const timestamp = new Date(now.getTime() - ((tf.bars - i) * tf.intervalMinutes * 60 * 1000));
                const bar = this.generateOHLCV(prices[i], 0.005);
                await databaseStorage_1.db.insert(schema_js_1.marketData).values({
                    assetId,
                    timeframe: tf.name,
                    periodStart: timestamp,
                    open: bar.open.toFixed(2),
                    high: bar.high.toFixed(2),
                    low: bar.low.toFixed(2),
                    close: bar.close.toFixed(2),
                    volume: bar.volume,
                    change: (bar.close - bar.open).toFixed(2),
                    percentChange: ((bar.close - bar.open) / bar.open * 100).toFixed(2),
                    marketCap: (bar.close * 1000000).toFixed(2)
                });
            }
            console.log(`  ✅ Generated ${tf.bars} ${tf.name} bars`);
        }
    }
}
exports.MarketDataGenerator = MarketDataGenerator;
exports.marketDataGenerator = new MarketDataGenerator();
