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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderMatching = exports.marketSimulation = exports.OrderMatchingEngine = exports.MarketSimulationEngine = exports.DEFAULT_MARKET_CONFIG = void 0;
const storage_js_1 = require("./storage.js");
const tradingConsequencesService_js_1 = require("./services/tradingConsequencesService.js");
exports.DEFAULT_MARKET_CONFIG = {
    baseVolatility: 0.025, // 2.5% daily volatility
    trendStrength: 0.3,
    meanReversion: 0.1,
    minSpreadPercent: 0.002, // 0.2%
    maxSpreadPercent: 0.02, // 2%
    liquidityFactor: 1.0,
    baseVolumePerDay: 1000,
    volumeVariability: 0.3,
    slippageFactor: 0.001,
    commissionRate: 0.001, // 0.1%
    marketOpenHour: 9,
    marketCloseHour: 16,
};
// PRICE SAFETY CONSTANTS - Prevent DECIMAL(10,2) overflow
const MAX_PRICE = 99999999.99; // Database DECIMAL(10,2) limit  
const MIN_PRICE = 0.01; // Minimum tradeable price
const SAFE_MAX_PRICE = 99999.99; // Safe upper bound for regular trading
const MAX_SINGLE_PRICE_CHANGE = 0.50; // Maximum 50% price change per update
class MarketSimulationEngine {
    constructor(config = exports.DEFAULT_MARKET_CONFIG) {
        this.marketData = new Map();
        this.marketEvents = [];
        this.simulationInterval = null;
        this.lastUpdateTime = new Date();
        this.config = config;
    }
    /**
     * Initialize the market simulation engine
     */
    async initialize() {
        try {
            console.log('🏪 Initializing Market Simulation Engine...');
            // Load all assets and their current prices
            console.log('  📦 Loading assets...');
            const assets = await storage_js_1.storage.getAssets();
            console.log(`  📦 Loaded ${assets.length} assets`);
            // Load all prices at once for fast lookup
            console.log('  💰 Loading all asset prices...');
            const allPrices = await storage_js_1.storage.getAllAssetCurrentPrices();
            const priceMap = new Map(allPrices.map(p => [p.assetId, p]));
            console.log(`  💰 Loaded ${allPrices.length} prices`);
            console.log('  🔄 Initializing market data...');
            let loadedCount = 0;
            let initializedCount = 0;
            for (const asset of assets) {
                try {
                    const existingPrice = priceMap.get(asset.id);
                    if (existingPrice) {
                        // Asset already has price data, just load it into memory
                        this.marketData.set(asset.id, {
                            asset,
                            currentPrice: existingPrice,
                            priceHistory: [parseFloat(existingPrice.currentPrice)],
                            trend: (Math.random() - 0.5) * 2,
                            momentum: 0,
                            volatility: parseFloat(existingPrice.volatility || '0.02'),
                            volume24h: existingPrice.volume || 0,
                            marketCap: this.calculateMarketCap(asset, parseFloat(existingPrice.currentPrice)),
                        });
                        loadedCount++;
                    }
                    else {
                        // No price yet, initialize from scratch
                        await this.initializeAssetMarketData(asset);
                        initializedCount++;
                    }
                }
                catch (error) {
                    console.error(`  ❌ Error initializing asset ${asset.symbol}:`, error);
                    // Continue with other assets
                }
            }
            console.log(`  ✅ Initialized ${initializedCount} new assets, loaded ${loadedCount} existing assets`);
            // Load active market events
            console.log('  📰 Loading market events...');
            this.marketEvents = await storage_js_1.storage.getMarketEvents({ isActive: true });
            console.log(`  📰 Loaded ${this.marketEvents.length} market events`);
            console.log(`📈 Market simulation initialized with ${assets.length} assets`);
        }
        catch (error) {
            console.error('❌ Error initializing Market Simulation Engine:', error);
            throw error;
        }
    }
    /**
     * Start the market simulation (real-time price updates)
     */
    start(updateIntervalMs = 60000) {
        if (this.simulationInterval) {
            console.warn('⚠️ Market simulation already running');
            return;
        }
        console.log('🚀 Starting market simulation engine...');
        this.simulationInterval = setInterval(async () => {
            if (this.isMarketOpen()) {
                await this.updateAllAssetPrices();
                // Generate random market events occasionally
                if (Math.random() < 0.05) { // 5% chance per update cycle
                    await this.generateRandomMarketEvent();
                }
                // Process pending orders every few update cycles
                if (Math.random() < 0.3) { // 30% chance = roughly every 3rd update cycle
                    await exports.orderMatching.processAllPendingOrders();
                }
                // PHASE 1 INTEGRATION: Execute NPC Trading Cycle
                if (Math.random() < 0.2) { // 20% chance = roughly every 5th update cycle
                    try {
                        const { NpcTradingEngine } = await Promise.resolve().then(() => __importStar(require('./tradingEngine.js')));
                        await NpcTradingEngine.executeNpcTradingCycle(storage_js_1.storage, this);
                    }
                    catch (error) {
                        console.error('Failed to execute NPC trading cycle:', error);
                    }
                }
            }
        }, updateIntervalMs);
    }
    /**
     * Stop the market simulation
     */
    stop() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
            console.log('🛑 Market simulation stopped');
        }
    }
    /**
     * Check if market is currently open
     */
    isMarketOpen() {
        const now = new Date();
        const hour = now.getHours();
        // Simple market hours check (can be enhanced for weekends, holidays)
        return hour >= this.config.marketOpenHour && hour < this.config.marketCloseHour;
    }
    /**
     * Initialize market data for a specific asset
     */
    async initializeAssetMarketData(asset) {
        let currentPrice = await storage_js_1.storage.getAssetCurrentPrice(asset.id);
        if (!currentPrice) {
            // Generate initial price based on asset characteristics
            const initialPrice = this.generateInitialPrice(asset);
            const newPrice = {
                assetId: asset.id,
                currentPrice: initialPrice.toString(),
                bidPrice: (initialPrice * 0.999).toString(),
                askPrice: (initialPrice * 1.001).toString(),
                volume: Math.floor(Math.random() * this.config.baseVolumePerDay),
                volatility: this.calculateAssetVolatility(asset).toString(),
                marketStatus: 'open',
                priceSource: 'simulation',
            };
            currentPrice = await storage_js_1.storage.createAssetCurrentPrice(newPrice);
        }
        const marketData = {
            asset,
            currentPrice,
            priceHistory: [parseFloat(currentPrice.currentPrice)],
            trend: (Math.random() - 0.5) * 2, // Random initial trend
            momentum: 0,
            volatility: parseFloat(currentPrice.volatility || '0.02'),
            volume24h: currentPrice.volume || 0,
            marketCap: this.calculateMarketCap(asset, parseFloat(currentPrice.currentPrice)),
        };
        this.marketData.set(asset.id, marketData);
    }
    /**
     * Generate realistic initial price for an asset
     */
    generateInitialPrice(asset) {
        const metadata = asset.metadata;
        // Base price factors
        let basePrice = 10; // Default $10
        // Asset type multipliers
        switch (asset.type) {
            case 'character':
                basePrice = 25; // Characters typically more valuable
                break;
            case 'comic':
                basePrice = 15;
                break;
            case 'creator':
                basePrice = 30; // Creators can be premium
                break;
            case 'publisher':
                basePrice = 50; // Publishers typically highest value
                break;
        }
        // Popularity/rarity modifiers
        if (metadata?.popularity) {
            const popularity = parseFloat(metadata.popularity) || 0.5;
            basePrice *= (0.5 + popularity * 1.5); // 0.5x to 2x multiplier
        }
        if (metadata?.rarity) {
            const rarity = parseFloat(metadata.rarity) || 0.5;
            basePrice *= (0.8 + rarity * 0.4); // 0.8x to 1.2x multiplier
        }
        // Add some randomness
        basePrice *= (0.8 + Math.random() * 0.4); // ±20% random variation
        return Math.round(basePrice * 100) / 100; // Round to 2 decimal places
    }
    /**
     * Calculate asset volatility based on characteristics
     */
    calculateAssetVolatility(asset) {
        const metadata = asset.metadata;
        let volatility = this.config.baseVolatility;
        // More popular assets might be less volatile
        if (metadata?.popularity) {
            const popularity = parseFloat(metadata.popularity) || 0.5;
            volatility *= (1.5 - popularity * 0.5); // High popularity = lower volatility
        }
        // Rare assets might be more volatile
        if (metadata?.rarity) {
            const rarity = parseFloat(metadata.rarity) || 0.5;
            volatility *= (0.8 + rarity * 0.4); // Higher rarity = higher volatility
        }
        // Asset type modifiers
        switch (asset.type) {
            case 'character':
                volatility *= 1.2; // Characters more volatile
                break;
            case 'comic':
                volatility *= 1.0; // Base volatility
                break;
            case 'creator':
                volatility *= 0.9; // Creators slightly less volatile
                break;
            case 'publisher':
                volatility *= 0.7; // Publishers least volatile
                break;
        }
        return Math.max(0.005, Math.min(0.1, volatility)); // Clamp between 0.5% and 10%
    }
    /**
     * Calculate market cap for an asset
     */
    calculateMarketCap(asset, price) {
        const metadata = asset.metadata;
        // Estimate total supply based on asset type
        let estimatedSupply = 1000000; // Default 1M shares
        switch (asset.type) {
            case 'character':
                estimatedSupply = 500000; // Characters have lower supply
                break;
            case 'comic':
                estimatedSupply = 750000;
                break;
            case 'creator':
                estimatedSupply = 300000; // Creators have lowest supply
                break;
            case 'publisher':
                estimatedSupply = 2000000; // Publishers have highest supply
                break;
        }
        if (metadata?.totalSupply) {
            estimatedSupply = parseInt(metadata.totalSupply);
        }
        return price * estimatedSupply;
    }
    /**
     * Update prices for all assets
     */
    async updateAllAssetPrices() {
        const now = new Date();
        const timeDelta = (now.getTime() - this.lastUpdateTime.getTime()) / 1000 / 60; // Minutes
        const priceUpdates = [];
        for (const [assetId, marketData] of Array.from(this.marketData.entries())) {
            priceUpdates.push(this.updateAssetPrice(assetId, marketData, timeDelta));
        }
        await Promise.all(priceUpdates);
        this.lastUpdateTime = now;
        console.log(`📊 Updated prices for ${this.marketData.size} assets`);
    }
    /**
     * Validate and cap price to prevent database overflow
     */
    validatePrice(price, context, assetSymbol) {
        if (!isFinite(price) || price < MIN_PRICE) {
            console.warn(`🔧 Market Simulation Price Validation: ${context} (${assetSymbol}) - Invalid price ${price}, setting to minimum ${MIN_PRICE}`);
            return MIN_PRICE;
        }
        if (price > MAX_PRICE) {
            console.warn(`🔧 Market Simulation Price Validation: ${context} (${assetSymbol}) - Price ${price} exceeds database limit, capping at ${SAFE_MAX_PRICE}`);
            return SAFE_MAX_PRICE;
        }
        if (price > SAFE_MAX_PRICE) {
            console.warn(`📉 Market Simulation Price Cap: ${context} (${assetSymbol}) - Price ${price.toFixed(2)} exceeds safe limit, capping at ${SAFE_MAX_PRICE}`);
            return SAFE_MAX_PRICE;
        }
        return Math.round(price * 100) / 100; // Round to 2 decimal places
    }
    /**
     * Update price for a specific asset - SAFE VERSION WITH OVERFLOW PROTECTION
     */
    async updateAssetPrice(assetId, marketData, timeDelta) {
        try {
            const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
            const assetSymbol = marketData.asset.symbol;
            // Validate current price first
            if (currentPrice > SAFE_MAX_PRICE) {
                console.warn(`⚠️ Asset ${assetSymbol} current price ${currentPrice} exceeds safe limit, resetting to safe value`);
                // Reset price to a safe value and exit early
                const safePrice = Math.min(currentPrice * 0.1, SAFE_MAX_PRICE);
                await this.resetAssetToSafePrice(assetId, marketData, safePrice);
                return;
            }
            // Generate price movement with safety caps
            let priceChange = this.generatePriceMovement(marketData, timeDelta);
            // Cap extreme price changes to prevent overflow
            priceChange = Math.max(-MAX_SINGLE_PRICE_CHANGE, Math.min(priceChange, MAX_SINGLE_PRICE_CHANGE));
            // Calculate new price with safety validation
            let newPrice = currentPrice * (1 + priceChange);
            newPrice = this.validatePrice(Math.max(MIN_PRICE, newPrice), 'Price Update', assetSymbol);
            // If the new price would be capped, reduce the price change proportionally
            if (newPrice >= SAFE_MAX_PRICE && currentPrice < SAFE_MAX_PRICE) {
                const maxAllowedChange = (SAFE_MAX_PRICE / currentPrice) - 1;
                priceChange = Math.min(priceChange, maxAllowedChange * 0.9); // 90% of max to leave buffer
                newPrice = this.validatePrice(currentPrice * (1 + priceChange), 'Adjusted Price Update', assetSymbol);
                console.log(`📊 Price change adjusted for ${assetSymbol}: ${(priceChange * 100).toFixed(2)}% to prevent overflow`);
            }
            // Update trend and momentum (safely bounded)
            marketData.trend = this.updateTrend(marketData.trend, priceChange);
            marketData.momentum = priceChange;
            // Calculate bid/ask spread with safety validation
            const spread = this.calculateSpread(marketData);
            let bidPrice = this.validatePrice(newPrice * (1 - spread / 2), 'Bid Price', assetSymbol);
            let askPrice = this.validatePrice(newPrice * (1 + spread / 2), 'Ask Price', assetSymbol);
            // Ensure bid < ask, adjust if necessary due to capping
            if (bidPrice >= askPrice) {
                bidPrice = newPrice * 0.999;
                askPrice = newPrice * 1.001;
            }
            // Simulate volume
            const newVolume = this.simulateVolume(marketData);
            // Calculate day change safely
            const dayChange = this.validatePrice(Math.abs(newPrice - currentPrice), 'Day Change', assetSymbol);
            const dayChangePercent = currentPrice > 0 ? Math.max(-99.99, Math.min(999.99, (newPrice / currentPrice - 1) * 100)) : 0;
            // Update market data
            marketData.priceHistory.push(newPrice);
            if (marketData.priceHistory.length > 1440) { // Keep 24 hours of minute data
                marketData.priceHistory.shift();
            }
            // Prepare safe update data
            const updateData = {
                currentPrice: newPrice.toFixed(2),
                bidPrice: bidPrice.toFixed(2),
                askPrice: askPrice.toFixed(2),
                dayChange: (newPrice >= currentPrice ? dayChange : -dayChange).toFixed(2),
                dayChangePercent: dayChangePercent.toFixed(2),
                volume: newVolume,
                lastTradePrice: newPrice.toFixed(2),
                lastTradeTime: new Date(),
            };
            // Validate all numeric fields before database update
            for (const [key, value] of Object.entries(updateData)) {
                if (typeof value === 'string' && key !== 'lastTradeTime') {
                    const numValue = parseFloat(value);
                    if (!isFinite(numValue)) {
                        console.error(`❌ Invalid numeric value for ${key}: ${value} in asset ${assetSymbol}`);
                        return; // Skip this update to prevent database error
                    }
                }
            }
            // Update in database with error handling
            const updatedPrice = await storage_js_1.storage.updateAssetCurrentPrice(assetId, updateData);
            if (updatedPrice) {
                marketData.currentPrice = updatedPrice;
            }
            // Store historical data (every 5 minutes to avoid too much data)
            if (Math.random() < 0.2) { // 20% chance = roughly every 5 updates
                await this.storeHistoricalData(assetId, newPrice, newVolume);
            }
        }
        catch (error) {
            console.error(`🚨 Critical error updating price for asset ${assetId}:`, error);
            // If database error contains overflow, reset to safe price
            if (error.message && error.message.includes('overflow')) {
                console.log(`🛡️ Detected price overflow for ${assetId}, resetting to safe price...`);
                await this.resetAssetToSafePrice(assetId, marketData, SAFE_MAX_PRICE * 0.1);
            }
        }
    }
    /**
     * Reset an asset to a safe price when overflow is detected
     */
    async resetAssetToSafePrice(assetId, marketData, safePrice) {
        try {
            const validSafePrice = this.validatePrice(safePrice, 'Safe Price Reset', marketData.asset.symbol);
            const resetData = {
                currentPrice: validSafePrice.toFixed(2),
                bidPrice: (validSafePrice * 0.999).toFixed(2),
                askPrice: (validSafePrice * 1.001).toFixed(2),
                dayChange: '0.00',
                dayChangePercent: '0.00',
                volume: 1000,
                lastTradePrice: validSafePrice.toFixed(2),
                lastTradeTime: new Date(),
            };
            const updatedPrice = await storage_js_1.storage.updateAssetCurrentPrice(assetId, resetData);
            if (updatedPrice) {
                marketData.currentPrice = updatedPrice;
                marketData.priceHistory = [validSafePrice]; // Reset price history
                marketData.trend = 0; // Reset trend
                marketData.momentum = 0; // Reset momentum
            }
            console.log(`✅ Successfully reset ${marketData.asset.symbol} price to safe value: $${validSafePrice.toFixed(2)}`);
        }
        catch (resetError) {
            console.error(`❌ Failed to reset asset ${assetId} to safe price:`, resetError);
        }
    }
    /**
     * Generate realistic price movement
     */
    generatePriceMovement(marketData, timeDelta) {
        const { volatility, trend } = marketData;
        // Random walk component
        const randomComponent = (Math.random() - 0.5) * 2;
        // Trend component
        const trendComponent = trend * this.config.trendStrength;
        // Mean reversion component
        const meanReversionComponent = -trend * this.config.meanReversion;
        // Apply market events
        const eventComponent = this.applyMarketEvents(marketData.asset);
        // Combine components
        const totalMovement = (randomComponent * volatility * 0.7 +
            trendComponent * volatility * 0.2 +
            meanReversionComponent * volatility * 0.1 +
            eventComponent);
        // Scale by time delta (for different update frequencies)
        return totalMovement * Math.sqrt(timeDelta / 60); // Normalize to hourly movements
    }
    /**
     * Update trend based on recent price movements
     */
    updateTrend(currentTrend, priceChange) {
        // Momentum-based trend updates
        const momentumImpact = priceChange * 10; // Amplify momentum effect
        let newTrend = currentTrend * 0.95 + momentumImpact * 0.05; // Slow trend changes
        // Clamp trend between -1 and 1
        return Math.max(-1, Math.min(1, newTrend));
    }
    /**
     * Calculate bid-ask spread based on volatility and liquidity
     */
    calculateSpread(marketData) {
        const { volatility } = marketData;
        const { minSpreadPercent, maxSpreadPercent } = this.config;
        // Base spread increases with volatility
        let spread = minSpreadPercent + (volatility * 2); // Higher volatility = wider spread
        // Liquidity factor (could be enhanced with order book depth)
        spread /= this.config.liquidityFactor;
        // Clamp spread
        return Math.max(minSpreadPercent, Math.min(maxSpreadPercent, spread));
    }
    /**
     * Simulate trading volume
     */
    simulateVolume(marketData) {
        const baseVolume = this.config.baseVolumePerDay / (24 * 60); // Per minute
        // Volume influenced by price movement and trend
        const priceMovementFactor = 1 + Math.abs(marketData.momentum) * 5;
        const trendFactor = 1 + Math.abs(marketData.trend) * 0.3;
        // Add randomness
        const randomFactor = 0.7 + Math.random() * 0.6; // 0.7x to 1.3x
        return Math.floor(baseVolume * priceMovementFactor * trendFactor * randomFactor);
    }
    /**
     * Apply market events to price movements with enhanced simulation
     */
    applyMarketEvents(asset) {
        let eventImpact = 0;
        for (const event of this.marketEvents) {
            if (event.affectedAssets?.includes(asset.id)) {
                const impact = this.calculateEventImpact(event, asset);
                // Events decay over time with different rates based on type
                const eventDate = event.eventDate || event.createdAt || new Date();
                const eventAge = new Date().getTime() - new Date(eventDate).getTime();
                const ageInDays = eventAge / (1000 * 60 * 60 * 24);
                const decayFactor = this.getEventDecayFactor(event.category, ageInDays);
                eventImpact += impact * decayFactor;
            }
        }
        return eventImpact;
    }
    /**
     * Calculate sophisticated event impact based on type and asset characteristics
     */
    calculateEventImpact(event, asset) {
        let baseImpact = 0;
        // Base impact from event type
        switch (event.impact) {
            case 'positive':
                baseImpact = 0.05; // 5% base positive impact
                break;
            case 'negative':
                baseImpact = -0.05; // 5% base negative impact
                break;
            case 'neutral':
                baseImpact = 0;
                break;
        }
        // Category-specific multipliers
        const categoryMultiplier = this.getCategoryMultiplier(event.category, asset, event);
        // Significance multiplier (0.5x to 3x)
        const significance = event.significance ? parseFloat(event.significance.toString()) : 5;
        const significanceMultiplier = 0.5 + (significance / 10) * 2.5;
        // Asset-specific factors
        const assetMultiplier = this.getAssetEventMultiplier(asset, event);
        return baseImpact * categoryMultiplier * significanceMultiplier * assetMultiplier;
    }
    /**
     * Get category-specific impact multipliers
     */
    getCategoryMultiplier(category, asset, event) {
        const metadata = asset.metadata;
        switch (category) {
            case 'movie_release':
                // Movies have huge impact on character assets
                return asset.type === 'character' ? 2.5 : 1.2;
            case 'comic_convention':
                // Conventions boost all comic-related assets
                return 1.8;
            case 'creator_news':
                // Creator news impacts creator assets and their associated works
                return asset.type === 'creator' ? 3.0 : 1.5;
            case 'publisher_announcement':
                // Publisher news impacts publisher and their properties
                const assetPublisher = metadata?.publisher;
                const eventTitle = event?.title || '';
                return asset.type === 'publisher' || assetPublisher === eventTitle ? 2.2 : 1.0;
            case 'industry_news':
                // Industry news has moderate impact across all assets
                return 1.3;
            case 'award_ceremony':
                // Awards boost specific assets significantly
                return 2.0;
            case 'tv_series':
                // TV series have sustained impact on character assets
                return asset.type === 'character' ? 2.0 : 1.1;
            default:
                return 1.0;
        }
    }
    /**
     * Get asset-specific event multipliers
     */
    getAssetEventMultiplier(asset, event) {
        const metadata = asset.metadata;
        let multiplier = 1.0;
        // Popularity factor (more popular = more sensitive to events)
        if (metadata?.popularity) {
            const popularity = parseFloat(metadata.popularity) || 0.5;
            multiplier *= (0.8 + popularity * 0.4); // 0.8x to 1.2x based on popularity
        }
        // Rarity factor (rare assets less affected by general events)
        if (metadata?.rarity) {
            const rarity = parseFloat(metadata.rarity) || 0.5;
            if (event.category !== 'creator_news' && event.category !== 'award_ceremony') {
                multiplier *= (1.2 - rarity * 0.4); // Less impact for rare assets on general events
            }
        }
        // Market cap factor (larger market cap = less volatile)
        const marketData = this.marketData.get(asset.id);
        if (marketData?.marketCap) {
            const capMultiplier = Math.max(0.5, Math.min(1.5, 100000000 / marketData.marketCap));
            multiplier *= capMultiplier;
        }
        return multiplier;
    }
    /**
     * Get event decay factor based on category and age
     */
    getEventDecayFactor(category, ageInDays) {
        const decayRates = {
            'movie_release': 30, // Movies have long-lasting impact
            'tv_series': 60, // TV series have very long impact
            'comic_convention': 7, // Conventions are short-term
            'creator_news': 14, // Creator news moderate duration
            'publisher_announcement': 21, // Publisher news longer impact
            'industry_news': 10, // Industry news moderate
            'award_ceremony': 14, // Awards moderate duration
            'default': 7
        };
        const decayPeriod = decayRates[category] || decayRates.default;
        return Math.exp(-ageInDays / decayPeriod);
    }
    /**
     * Generate random market events to simulate dynamic market conditions
     */
    async generateRandomMarketEvent() {
        // Only generate events occasionally
        if (Math.random() > 0.1)
            return; // 10% chance
        const eventTypes = [
            { category: 'industry_news', weight: 3 },
            { category: 'comic_convention', weight: 2 },
            { category: 'creator_news', weight: 2 },
            { category: 'publisher_announcement', weight: 2 },
            { category: 'movie_release', weight: 1 },
            { category: 'tv_series', weight: 1 },
            { category: 'award_ceremony', weight: 1 },
        ];
        // Weighted random selection
        const totalWeight = eventTypes.reduce((sum, type) => sum + type.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedCategory = 'industry_news';
        for (const type of eventTypes) {
            random -= type.weight;
            if (random <= 0) {
                selectedCategory = type.category;
                break;
            }
        }
        // Generate event details
        const impact = Math.random() > 0.5 ? 'positive' : 'negative';
        const significance = Math.floor(Math.random() * 10) + 1; // 1-10
        // Select affected assets (1-3 random assets)
        const allAssets = Array.from(this.marketData.keys());
        const numAffected = Math.floor(Math.random() * 3) + 1;
        const affectedAssets = this.shuffleArray(allAssets).slice(0, numAffected);
        const event = {
            title: this.generateEventTitle(selectedCategory, impact),
            description: this.generateEventDescription(selectedCategory, impact),
            category: selectedCategory,
            impact,
            significance: significance.toString(),
            affectedAssets,
            eventDate: new Date(),
            isActive: true,
        };
        try {
            await storage_js_1.storage.createMarketEvent(event);
            console.log(`📰 Generated market event: ${event.title} (${impact}, significance: ${significance})`);
        }
        catch (error) {
            console.error('Error creating market event:', error);
        }
    }
    /**
     * Generate realistic event titles
     */
    generateEventTitle(category, impact) {
        const titles = {
            movie_release: {
                positive: ['Major Studio Announces Blockbuster Adaptation', 'Star-Studded Cast Revealed for Upcoming Film', 'Record Box Office Opening Weekend Predicted'],
                negative: ['Film Adaptation Faces Production Delays', 'Director Drops Out of Highly Anticipated Movie', 'Studio Cuts Budget for Planned Adaptation']
            },
            comic_convention: {
                positive: ['Major Comic Convention Announces Record Attendance', 'Exclusive Reveals Expected at Upcoming Convention', 'Industry Veterans Confirm Convention Appearances'],
                negative: ['Comic Convention Faces Venue Issues', 'Major Publishers Skip Upcoming Convention', 'Convention Tickets Sales Below Expectations']
            },
            creator_news: {
                positive: ['Legendary Creator Signs Exclusive Deal', 'Award-Winning Creator Announces New Project', 'Creator\'s Work Adapted for Streaming Platform'],
                negative: ['Creator Announces Retirement from Industry', 'Legal Issues Surrounding Creator\'s Work', 'Creator\'s New Project Receives Mixed Reviews']
            },
            industry_news: {
                positive: ['Comic Industry Reports Record Sales Growth', 'Digital Comics Platform Gains Major Traction', 'New Investment Flows into Comic Industry'],
                negative: ['Comic Sales Decline in Recent Quarter', 'Industry Faces Distribution Challenges', 'Print Comics Market Shows Weakness']
            }
        };
        const categoryTitles = titles[category] || titles.industry_news;
        const impactTitles = categoryTitles[impact];
        return impactTitles[Math.floor(Math.random() * impactTitles.length)];
    }
    /**
     * Generate realistic event descriptions
     */
    generateEventDescription(category, impact) {
        const descriptions = {
            movie_release: impact === 'positive'
                ? 'Industry sources report strong market confidence in upcoming adaptations.'
                : 'Market concerns grow over adaptation quality and production timeline.',
            comic_convention: impact === 'positive'
                ? 'Strong attendance and industry engagement expected to boost market sentiment.'
                : 'Reduced industry participation may signal weakening market confidence.',
            creator_news: impact === 'positive'
                ? 'Creator developments typically drive significant interest in related properties.'
                : 'Changes in creator status often impact associated asset valuations.',
            industry_news: impact === 'positive'
                ? 'Positive industry trends support broad market growth expectations.'
                : 'Industry challenges may create headwinds for market performance.'
        };
        return descriptions[category] || descriptions.industry_news;
    }
    /**
     * Utility function to shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    /**
     * Store historical market data with multi-timeframe support
     */
    async storeHistoricalData(assetId, price, volume) {
        const now = new Date();
        const marketData = this.marketData.get(assetId);
        if (!marketData)
            return;
        // Always store 1-minute data as base timeframe
        await this.storeOHLCData(assetId, '1m', now, price, volume, marketData);
        // Aggregate and store higher timeframes periodically
        const minutes = now.getMinutes();
        const hours = now.getHours();
        const day = now.getDate();
        // Store 5-minute data every 5 minutes
        if (minutes % 5 === 0) {
            await this.aggregateAndStoreTimeframe(assetId, '5m', now, 5);
        }
        // Store 15-minute data every 15 minutes
        if (minutes % 15 === 0) {
            await this.aggregateAndStoreTimeframe(assetId, '15m', now, 15);
        }
        // Store 1-hour data every hour
        if (minutes === 0) {
            await this.aggregateAndStoreTimeframe(assetId, '1h', now, 60);
        }
        // Store 4-hour data every 4 hours
        if (minutes === 0 && hours % 4 === 0) {
            await this.aggregateAndStoreTimeframe(assetId, '4h', now, 240);
        }
        // Store daily data at midnight
        if (minutes === 0 && hours === 0) {
            await this.aggregateAndStoreTimeframe(assetId, '1d', now, 1440);
        }
    }
    /**
     * Store OHLC data for a specific timeframe
     */
    async storeOHLCData(assetId, timeframe, timestamp, price, volume, marketData) {
        // Calculate realistic OHLC based on volatility and recent price history
        const volatility = marketData.volatility;
        const priceVariation = price * volatility * 0.1; // Small intraperiod variation
        const open = price;
        const high = price + (Math.random() * priceVariation);
        const low = price - (Math.random() * priceVariation);
        const close = price + (Math.random() - 0.5) * priceVariation * 0.5;
        // Calculate change from previous period
        const previousPrice = marketData.priceHistory[marketData.priceHistory.length - 2] || price;
        const change = close - previousPrice;
        const percentChange = (change / previousPrice) * 100;
        const ohlcData = {
            assetId,
            timeframe,
            periodStart: this.roundTimeToTimeframe(timestamp, timeframe),
            open: open.toFixed(2),
            high: Math.max(open, high, low, close).toFixed(2),
            low: Math.min(open, high, low, close).toFixed(2),
            close: close.toFixed(2),
            volume,
            change: change.toFixed(2),
            percentChange: percentChange.toFixed(2),
            technicalIndicators: await this.calculateTechnicalIndicators(assetId, timeframe, close),
        };
        try {
            await storage_js_1.storage.createMarketData(ohlcData);
        }
        catch (error) {
            console.error(`Error storing ${timeframe} data for ${assetId}:`, error);
        }
    }
    /**
     * Aggregate minute data into higher timeframes
     */
    async aggregateAndStoreTimeframe(assetId, timeframe, currentTime, minutes) {
        try {
            const endTime = new Date(currentTime);
            const startTime = new Date(endTime.getTime() - (minutes * 60 * 1000));
            // Get 1-minute data for aggregation
            const minuteData = await storage_js_1.storage.getMarketDataHistory(assetId, '1m', minutes, startTime, endTime);
            if (minuteData.length === 0)
                return;
            // Aggregate OHLC data
            const open = parseFloat(minuteData[minuteData.length - 1].open); // First in chronological order
            const close = parseFloat(minuteData[0].close); // Last in chronological order
            const high = Math.max(...minuteData.map(d => parseFloat(d.high)));
            const low = Math.min(...minuteData.map(d => parseFloat(d.low)));
            const volume = minuteData.reduce((sum, d) => sum + d.volume, 0);
            const change = close - open;
            const percentChange = (change / open) * 100;
            const aggregatedData = {
                assetId,
                timeframe,
                periodStart: this.roundTimeToTimeframe(currentTime, timeframe),
                open: open.toFixed(2),
                high: high.toFixed(2),
                low: low.toFixed(2),
                close: close.toFixed(2),
                volume,
                change: change.toFixed(2),
                percentChange: percentChange.toFixed(2),
                technicalIndicators: await this.calculateTechnicalIndicators(assetId, timeframe, close),
            };
            await storage_js_1.storage.createMarketData(aggregatedData);
            console.log(`📊 Aggregated ${timeframe} data for ${assetId}: O:${open.toFixed(2)} H:${high.toFixed(2)} L:${low.toFixed(2)} C:${close.toFixed(2)}`);
        }
        catch (error) {
            console.error(`Error aggregating ${timeframe} data for ${assetId}:`, error);
        }
    }
    /**
     * Round timestamp to appropriate timeframe boundary
     */
    roundTimeToTimeframe(timestamp, timeframe) {
        const date = new Date(timestamp);
        switch (timeframe) {
            case '1m':
                date.setSeconds(0, 0);
                break;
            case '5m':
                date.setMinutes(Math.floor(date.getMinutes() / 5) * 5, 0, 0);
                break;
            case '15m':
                date.setMinutes(Math.floor(date.getMinutes() / 15) * 15, 0, 0);
                break;
            case '1h':
                date.setMinutes(0, 0, 0);
                break;
            case '4h':
                date.setHours(Math.floor(date.getHours() / 4) * 4, 0, 0, 0);
                break;
            case '1d':
                date.setHours(0, 0, 0, 0);
                break;
            default:
                date.setSeconds(0, 0);
        }
        return date;
    }
    /**
     * Get current market overview
     */
    async getMarketOverview() {
        try {
            const assets = Array.from(this.marketData.values());
            // Ensure we have valid market data before processing
            if (assets.length === 0) {
                console.warn('⚠️ Market simulation has no asset data - returning safe defaults');
                return {
                    totalAssets: 0,
                    totalMarketCap: 0,
                    totalVolume24h: 0,
                    marketStatus: this.isMarketOpen() ? 'open' : 'closed',
                    topGainers: [],
                    topLosers: [],
                };
            }
            const totalMarketCap = assets.reduce((sum, data) => sum + (data.marketCap || 0), 0);
            const totalVolume24h = assets.reduce((sum, data) => sum + data.volume24h, 0);
            // Sort by day change for gainers/losers with proper error handling
            const sorted = assets
                .filter(data => data.asset && data.currentPrice) // Ensure valid data
                .map(data => {
                // Validate that asset ID is a proper UUID, not a comic character ID
                const assetId = data.asset.id;
                if (!assetId || typeof assetId !== 'string') {
                    console.warn('⚠️ Invalid asset ID found in market data:', assetId);
                    return null;
                }
                // CRITICAL: Check if asset ID looks like a character ID that could cause WebSocket errors
                if (/^\d{4,6}$/.test(assetId)) {
                    console.error('🚨 BLOCKED: Character-like ID detected in WebSocket data:', assetId);
                    return null; // Block this from being sent via WebSocket
                }
                return {
                    assetId: assetId,
                    symbol: data.asset.symbol || 'UNKNOWN',
                    change: parseFloat(data.currentPrice.dayChangePercent || '0'),
                };
            })
                .filter(item => item !== null) // Remove any invalid entries
                .sort((a, b) => b.change - a.change);
            return {
                totalAssets: assets.length,
                totalMarketCap,
                totalVolume24h,
                marketStatus: this.isMarketOpen() ? 'open' : 'closed',
                topGainers: sorted.slice(0, 5),
                topLosers: sorted.slice(-5).reverse(),
            };
        }
        catch (error) {
            console.error('❌ Error in getMarketOverview:', error);
            // Return safe defaults to prevent WebSocket frame corruption
            return {
                totalAssets: 0,
                totalMarketCap: 0,
                totalVolume24h: 0,
                marketStatus: 'closed',
                topGainers: [],
                topLosers: [],
            };
        }
    }
    /**
     * Get detailed market data for a specific asset
     */
    getAssetMarketData(assetId) {
        return this.marketData.get(assetId);
    }
    /**
     * Get current prices for multiple assets
     */
    async getCurrentPrices(assetIds) {
        return await storage_js_1.storage.getAssetCurrentPrices(assetIds);
    }
    /**
     * Calculate technical indicators for market data
     */
    async calculateTechnicalIndicators(assetId, timeframe, currentPrice) {
        try {
            // Get historical data for calculations (last 50 periods for most indicators)
            const historicalData = await storage_js_1.storage.getMarketDataHistory(assetId, timeframe, 50);
            if (historicalData.length < 14) {
                // Not enough data for most indicators
                return {
                    sma_20: currentPrice,
                    ema_12: currentPrice,
                    ema_26: currentPrice,
                    rsi_14: 50, // Neutral RSI
                    macd: { signal: 0, histogram: 0, macd: 0 },
                    volume_sma: 0,
                };
            }
            const prices = [currentPrice, ...historicalData.map(d => parseFloat(d.close))];
            const volumes = [0, ...historicalData.map(d => d.volume)];
            return {
                sma_20: this.calculateSMA(prices, 20),
                ema_12: this.calculateEMA(prices, 12),
                ema_26: this.calculateEMA(prices, 26),
                rsi_14: this.calculateRSI(prices, 14),
                macd: this.calculateMACD(prices),
                volume_sma: this.calculateSMA(volumes, 20),
                bollinger: this.calculateBollingerBands(prices, 20, 2),
            };
        }
        catch (error) {
            console.error('Error calculating technical indicators:', error);
            return {};
        }
    }
    /**
     * Simple Moving Average
     */
    calculateSMA(prices, period) {
        if (prices.length < period)
            return prices[0] || 0;
        const slice = prices.slice(0, period);
        return slice.reduce((sum, price) => sum + price, 0) / period;
    }
    /**
     * Exponential Moving Average
     */
    calculateEMA(prices, period) {
        if (prices.length < period)
            return prices[0] || 0;
        const multiplier = 2 / (period + 1);
        let ema = this.calculateSMA(prices.slice(-period), period);
        for (let i = prices.length - period - 1; i >= 0; i--) {
            ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
        }
        return ema;
    }
    /**
     * Relative Strength Index
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1)
            return 50;
        const gains = [];
        const losses = [];
        for (let i = 1; i < prices.length && i <= period; i++) {
            const change = prices[i - 1] - prices[i];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
        const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
        if (avgLoss === 0)
            return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
    /**
     * MACD (Moving Average Convergence Divergence)
     */
    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macd = ema12 - ema26;
        // Signal line is 9-period EMA of MACD line
        // For simplicity, using approximation here
        const signal = macd * 0.2; // Simplified signal line
        const histogram = macd - signal;
        return { macd, signal, histogram };
    }
    /**
     * Bollinger Bands
     */
    calculateBollingerBands(prices, period, stdDev) {
        const sma = this.calculateSMA(prices, period);
        const slice = prices.slice(0, period);
        // Calculate standard deviation
        const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
        const standardDeviation = Math.sqrt(variance);
        return {
            upper: sma + (standardDeviation * stdDev),
            middle: sma,
            lower: sma - (standardDeviation * stdDev),
        };
    }
}
exports.MarketSimulationEngine = MarketSimulationEngine;
/**
 * Order Matching Engine for processing trades
 */
class OrderMatchingEngine {
    constructor(marketEngine, config = exports.DEFAULT_MARKET_CONFIG) {
        this.marketEngine = marketEngine;
        this.config = config;
    }
    /**
     * Process a new order - either market or limit order
     */
    async processOrder(order) {
        try {
            // Validate order
            const validationResult = await this.validateOrder(order);
            if (!validationResult.isValid) {
                await this.rejectOrder(order.id, validationResult.reason || 'Order validation failed');
                return null;
            }
            // Process based on order type
            switch (order.orderType) {
                case 'market':
                    return await this.processMarketOrder(order);
                case 'limit':
                    return await this.processLimitOrder(order);
                case 'stop':
                    return await this.processStopOrder(order);
                default:
                    await this.rejectOrder(order.id, `Unsupported order type: ${order.orderType}`);
                    return null;
            }
        }
        catch (error) {
            console.error('Error processing order:', error);
            await this.rejectOrder(order.id, 'Internal error processing order');
            return null;
        }
    }
    /**
     * Process market order - immediate execution at current price
     */
    async processMarketOrder(order) {
        const marketData = this.marketEngine.getAssetMarketData(order.assetId);
        if (!marketData) {
            await this.rejectOrder(order.id, 'Asset not found');
            return null;
        }
        const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
        const quantity = parseFloat(order.quantity);
        // Determine execution price based on order side
        let executionPrice;
        if (order.type === 'buy') {
            executionPrice = parseFloat(marketData.currentPrice.askPrice || currentPrice.toString());
        }
        else {
            executionPrice = parseFloat(marketData.currentPrice.bidPrice || currentPrice.toString());
        }
        // Calculate slippage for large orders
        const slippage = this.calculateSlippage(quantity, marketData);
        if (order.type === 'buy') {
            executionPrice *= (1 + slippage);
        }
        else {
            executionPrice *= (1 - slippage);
        }
        // Apply karmic alignment consequences to execution price
        let karmaConsequences = null;
        let mysticalEvents = [];
        try {
            // Get the asset data for consequence calculations
            const asset = await storage_js_1.storage.getAsset(order.assetId);
            if (asset && order.userId) {
                const consequenceResult = await tradingConsequencesService_js_1.tradingConsequencesService.applyTradingConsequences(order.userId, order, asset, executionPrice);
                executionPrice = consequenceResult.modifiedPrice;
                karmaConsequences = consequenceResult.consequences;
                mysticalEvents = consequenceResult.mysticalEvents;
                // Log mystical events for this trade
                if (mysticalEvents.length > 0) {
                    console.log(`🔮 Karmic Trading Events for Order ${order.id}:`, mysticalEvents);
                }
            }
        }
        catch (error) {
            console.warn('Failed to apply karma consequences:', error);
            // Continue with normal execution if karma system fails
        }
        // Calculate fees
        const totalValue = quantity * executionPrice;
        const fees = this.calculateOrderFees(totalValue);
        // Execute the order
        const execution = {
            orderId: order.id,
            executedQuantity: quantity,
            executedPrice: executionPrice,
            fees,
            slippage: slippage * 100, // Convert to percentage
            timestamp: new Date(),
        };
        // Update order status
        await storage_js_1.storage.updateOrder(order.id, {
            status: 'filled',
            filledQuantity: quantity.toString(),
            averageFillPrice: executionPrice.toString(),
            fees: fees.toString(),
            executionDetails: {
                executionType: 'market',
                slippage: execution.slippage,
                marketPrice: currentPrice,
            },
        });
        // Update portfolio holdings
        await this.updatePortfolioHoldings(order, execution);
        // Update market data (add volume, update last trade)
        await this.updateMarketAfterTrade(order.assetId, quantity, executionPrice);
        return execution;
    }
    /**
     * Process limit order - execute only if price reaches limit
     */
    async processLimitOrder(order) {
        const marketData = this.marketEngine.getAssetMarketData(order.assetId);
        if (!marketData) {
            await this.rejectOrder(order.id, 'Asset not found');
            return null;
        }
        const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
        const limitPrice = parseFloat(order.price || '0');
        const quantity = parseFloat(order.quantity);
        // Check if limit order can be executed
        let canExecute = false;
        let executionPrice = limitPrice;
        if (order.type === 'buy' && currentPrice <= limitPrice) {
            canExecute = true;
            // For buy orders, execute at the better of current price or limit price
            executionPrice = Math.min(currentPrice, limitPrice);
        }
        else if (order.type === 'sell' && currentPrice >= limitPrice) {
            canExecute = true;
            // For sell orders, execute at the better of current price or limit price
            executionPrice = Math.max(currentPrice, limitPrice);
        }
        if (!canExecute) {
            // Order remains pending
            return null;
        }
        // Apply karmic alignment consequences to execution price
        let karmaConsequences = null;
        let mysticalEvents = [];
        try {
            // Get the asset data for consequence calculations
            const asset = await storage_js_1.storage.getAsset(order.assetId);
            if (asset && order.userId) {
                const consequenceResult = await tradingConsequencesService_js_1.tradingConsequencesService.applyTradingConsequences(order.userId, order, asset, executionPrice);
                executionPrice = consequenceResult.modifiedPrice;
                karmaConsequences = consequenceResult.consequences;
                mysticalEvents = consequenceResult.mysticalEvents;
                // Log mystical events for this trade
                if (mysticalEvents.length > 0) {
                    console.log(`🔮 Karmic Trading Events for Order ${order.id}:`, mysticalEvents);
                }
            }
        }
        catch (error) {
            console.warn('Failed to apply karma consequences:', error);
            // Continue with normal execution if karma system fails
        }
        // Calculate fees
        const totalValue = quantity * executionPrice;
        const fees = this.calculateOrderFees(totalValue);
        // Execute the order
        const execution = {
            orderId: order.id,
            executedQuantity: quantity,
            executedPrice: executionPrice,
            fees,
            slippage: 0, // Limit orders don't have slippage by definition
            timestamp: new Date(),
        };
        // Update order status
        await storage_js_1.storage.updateOrder(order.id, {
            status: 'filled',
            filledQuantity: quantity.toString(),
            averageFillPrice: executionPrice.toString(),
            fees: fees.toString(),
            executionDetails: {
                executionType: 'limit',
                limitPrice: limitPrice,
                marketPrice: currentPrice,
            },
        });
        // Update portfolio holdings
        await this.updatePortfolioHoldings(order, execution);
        // Update market data
        await this.updateMarketAfterTrade(order.assetId, quantity, executionPrice);
        return execution;
    }
    /**
     * Process stop order (basic implementation)
     */
    async processStopOrder(order) {
        // Stop orders become market orders when triggered
        // This is a simplified implementation
        return await this.processMarketOrder(order);
    }
    /**
     * Validate order before processing - NOW WITH PHASE 1 INTEGRATION
     */
    async validateOrder(order) {
        // Get user and portfolio
        const user = await storage_js_1.storage.getUser(order.userId);
        if (!user) {
            return { isValid: false, reason: 'User not found' };
        }
        const portfolio = await storage_js_1.storage.getPortfolio(order.portfolioId);
        if (!portfolio) {
            return { isValid: false, reason: 'Portfolio not found' };
        }
        // Check if market is open
        if (!this.marketEngine.isMarketOpen()) {
            return { isValid: false, reason: 'Market is closed' };
        }
        // Validate order parameters
        const quantity = parseFloat(order.quantity);
        if (quantity <= 0) {
            return { isValid: false, reason: 'Invalid quantity' };
        }
        // Check asset exists and has current price
        const marketData = this.marketEngine.getAssetMarketData(order.assetId);
        if (!marketData) {
            return { isValid: false, reason: 'Asset not found' };
        }
        const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
        const orderValue = quantity * currentPrice;
        // PHASE 1 INTEGRATION: IMF Vaulting Checks
        try {
            const vaultSettings = await storage_js_1.storage.getImfVaultSettings(order.assetId);
            if (vaultSettings) {
                const { ImfVaultingEngine } = await Promise.resolve().then(() => __importStar(require('./tradingEngine.js')));
                // Check if vaulting would be triggered by this trade
                const shouldVault = ImfVaultingEngine.shouldTriggerVaulting(vaultSettings, currentPrice, parseFloat(marketData.marketCap || '0'), marketData.volume24h / (parseFloat(marketData.currentPrice.volume?.toString() || '1')));
                if (shouldVault && order.type === 'buy') {
                    const vaultingFee = ImfVaultingEngine.calculateVaultingFee(vaultSettings, quantity, currentPrice);
                    console.log(`🏦 IMF Vaulting triggered for ${order.assetId}: Additional fee ${vaultingFee}`);
                }
                // Apply scarcity multiplier to price calculations
                const scarcityMultiplier = ImfVaultingEngine.calculateScarcityMultiplier(vaultSettings);
                if (scarcityMultiplier > 1.5) {
                    console.log(`⚡ High scarcity detected for ${order.assetId}: ${scarcityMultiplier}x multiplier`);
                }
            }
        }
        catch (error) {
            console.warn('Failed to check IMF vaulting settings:', error);
        }
        // PHASE 1 INTEGRATION: Margin Account Validation
        try {
            const marginAccount = await storage_js_1.storage.getMarginAccount(order.userId);
            if (marginAccount) {
                const marginEquity = parseFloat(marginAccount.marginEquity);
                const marginDebt = parseFloat(marginAccount.marginDebt);
                const buyingPower = parseFloat(marginAccount.buyingPower);
                // Check margin requirements for leveraged positions
                if (order.type === 'buy' && orderValue > buyingPower) {
                    return { isValid: false, reason: `Order exceeds buying power: $${buyingPower.toFixed(2)}` };
                }
                // Check maintenance margin requirements
                const maintenanceMargin = parseFloat(marginAccount.maintenanceMargin);
                if (marginEquity < maintenanceMargin) {
                    return { isValid: false, reason: 'Account below maintenance margin requirement' };
                }
            }
        }
        catch (error) {
            console.warn('Failed to check margin account:', error);
        }
        // PHASE 1 INTEGRATION: Short Position Validation
        if (order.type === 'sell') {
            try {
                const shortPositions = await storage_js_1.storage.getShortPositions(order.userId);
                const existingShort = shortPositions.find(pos => pos.assetId === order.assetId);
                if (existingShort && order.metadata?.isShortSale) {
                    const currentShortQuantity = parseFloat(existingShort.quantity);
                    const unrealizedPnL = parseFloat(existingShort.unrealizedPnL);
                    // Check if adding to short position exceeds risk limits
                    const maxShortPosition = parseFloat(user.maxPositionSize || '5000') * 0.5; // 50% of max for shorts
                    if ((currentShortQuantity + quantity) * currentPrice > maxShortPosition) {
                        return { isValid: false, reason: `Short position would exceed maximum short limit` };
                    }
                    console.log(`📉 Existing short position for ${order.assetId}: ${currentShortQuantity} shares, P&L: $${unrealizedPnL}`);
                }
                // Check available shares for borrowing (basic implementation)
                const holding = await storage_js_1.storage.getHolding(order.portfolioId, order.assetId);
                if (!holding || parseFloat(holding.quantity) < quantity) {
                    if (!order.metadata?.isShortSale) {
                        return { isValid: false, reason: 'Insufficient holdings for sell order' };
                    }
                }
            }
            catch (error) {
                console.warn('Failed to check short positions:', error);
            }
        }
        // Check position size limits
        const maxPositionSize = parseFloat(user.maxPositionSize || '5000');
        if (orderValue > maxPositionSize) {
            return { isValid: false, reason: `Order exceeds maximum position size of $${maxPositionSize}` };
        }
        // Check daily trading limits
        const dailyLimit = parseFloat(user.dailyTradingLimit || '10000');
        const dailyUsed = parseFloat(user.dailyTradingUsed || '0');
        if (dailyUsed + orderValue > dailyLimit) {
            return { isValid: false, reason: `Order exceeds daily trading limit` };
        }
        // For buy orders, check available cash (enhanced with margin)
        if (order.type === 'buy') {
            const cashBalance = parseFloat(portfolio.cashBalance || '100000');
            const fees = this.calculateOrderFees(orderValue);
            const totalRequired = orderValue + fees;
            // Check if margin account provides additional buying power
            try {
                const marginAccount = await storage_js_1.storage.getMarginAccount(order.userId);
                const availableBuyingPower = marginAccount
                    ? parseFloat(marginAccount.buyingPower)
                    : cashBalance;
                if (totalRequired > availableBuyingPower) {
                    return { isValid: false, reason: `Insufficient buying power: $${availableBuyingPower.toFixed(2)} available` };
                }
            }
            catch {
                if (totalRequired > cashBalance) {
                    return { isValid: false, reason: 'Insufficient cash balance' };
                }
            }
        }
        return { isValid: true };
    }
    /**
     * Calculate slippage based on order size and market liquidity
     */
    calculateSlippage(quantity, marketData) {
        const volume24h = marketData.volume24h;
        const currentPrice = parseFloat(marketData.currentPrice.currentPrice);
        const orderValue = quantity * currentPrice;
        // Calculate order size as percentage of daily volume
        const volumeImpact = orderValue / (volume24h * currentPrice || 1);
        // Apply slippage factor
        const slippage = volumeImpact * this.config.slippageFactor;
        // Cap slippage at reasonable levels
        return Math.min(slippage, 0.05); // Max 5% slippage
    }
    /**
     * Calculate trading fees and commissions
     */
    calculateOrderFees(orderValue) {
        // Simple commission structure
        const commission = orderValue * this.config.commissionRate;
        // Minimum fee
        const minFee = 1.0;
        return Math.max(commission, minFee);
    }
    /**
     * Update portfolio holdings after order execution
     */
    async updatePortfolioHoldings(order, execution) {
        const portfolio = await storage_js_1.storage.getPortfolio(order.portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }
        const { executedQuantity, executedPrice, fees } = execution;
        const totalValue = executedQuantity * executedPrice;
        if (order.type === 'buy') {
            // Deduct cash and add/update holding
            const newCashBalance = parseFloat(portfolio.cashBalance || '0') - totalValue - fees;
            await storage_js_1.storage.updatePortfolio(order.portfolioId, {
                cashBalance: newCashBalance.toString(),
            });
            // Update or create holding
            let holding = await storage_js_1.storage.getHolding(order.portfolioId, order.assetId);
            if (holding) {
                // Update existing holding
                const existingQuantity = parseFloat(holding.quantity);
                const existingCost = parseFloat(holding.averageCost);
                const newQuantity = existingQuantity + executedQuantity;
                const newAverageCost = ((existingQuantity * existingCost) + totalValue) / newQuantity;
                await storage_js_1.storage.updateHolding(holding.id, {
                    quantity: newQuantity.toString(),
                    averageCost: newAverageCost.toString(),
                    currentValue: (newQuantity * executedPrice).toString(),
                });
            }
            else {
                // Create new holding
                const newHolding = {
                    portfolioId: order.portfolioId,
                    assetId: order.assetId,
                    quantity: executedQuantity.toString(),
                    averageCost: executedPrice.toString(),
                    currentValue: totalValue.toString(),
                };
                await storage_js_1.storage.createHolding(newHolding);
            }
        }
        else {
            // Sell order: add cash and reduce/remove holding
            const newCashBalance = parseFloat(portfolio.cashBalance || '0') + totalValue - fees;
            await storage_js_1.storage.updatePortfolio(order.portfolioId, {
                cashBalance: newCashBalance.toString(),
            });
            // Update holding
            const holding = await storage_js_1.storage.getHolding(order.portfolioId, order.assetId);
            if (holding) {
                const existingQuantity = parseFloat(holding.quantity);
                const newQuantity = existingQuantity - executedQuantity;
                if (newQuantity <= 0) {
                    // Remove holding completely
                    await storage_js_1.storage.deleteHolding(holding.id);
                }
                else {
                    // Reduce holding quantity
                    await storage_js_1.storage.updateHolding(holding.id, {
                        quantity: newQuantity.toString(),
                        currentValue: (newQuantity * executedPrice).toString(),
                    });
                }
            }
        }
        // Update user's daily trading usage
        const user = await storage_js_1.storage.getUser(order.userId);
        if (user) {
            const newDailyUsed = parseFloat(user.dailyTradingUsed || '0') + totalValue;
            await storage_js_1.storage.upsertUser({
                id: order.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImageUrl: user.profileImageUrl,
                // Update the trading fields we need
                dailyTradingUsed: newDailyUsed.toString(),
                lastTradingActivity: new Date(),
            });
        }
    }
    /**
     * Update market data after a trade
     */
    async updateMarketAfterTrade(assetId, quantity, price) {
        const currentPrice = await storage_js_1.storage.getAssetCurrentPrice(assetId);
        if (currentPrice) {
            const newVolume = (currentPrice.volume || 0) + Math.floor(quantity);
            await storage_js_1.storage.updateAssetCurrentPrice(assetId, {
                volume: newVolume,
                lastTradePrice: price.toString(),
                lastTradeQuantity: quantity.toString(),
                lastTradeTime: new Date(),
            });
        }
    }
    /**
     * Reject an order with a reason
     */
    async rejectOrder(orderId, reason) {
        await storage_js_1.storage.updateOrder(orderId, {
            status: 'cancelled',
            rejectionReason: reason,
        });
    }
    /**
     * Check and process pending limit orders for a specific user
     */
    async processPendingOrdersForUser(userId) {
        const pendingOrders = await storage_js_1.storage.getUserOrders(userId, 'pending');
        for (const order of pendingOrders) {
            if (order.orderType === 'limit') {
                const execution = await this.processLimitOrder(order);
                if (execution) {
                    console.log(`✅ Executed limit order ${order.id} at $${execution.executedPrice}`);
                }
            }
        }
    }
    /**
     * Process pending orders for all users (would need to be called periodically)
     */
    async processAllPendingOrders() {
        console.log('🔄 Processing pending orders across all users...');
        try {
            // Get all pending orders from storage
            const pendingOrders = await storage_js_1.storage.getOrdersByStatus('pending');
            if (pendingOrders.length === 0) {
                return;
            }
            console.log(`Found ${pendingOrders.length} pending orders to process`);
            // Sort orders by price/time priority
            const sortedOrders = this.sortOrdersByPriority(pendingOrders);
            let executedCount = 0;
            for (const order of sortedOrders) {
                const execution = await this.processOrder(order);
                if (execution) {
                    executedCount++;
                    console.log(`✅ Executed pending order ${order.id} at $${execution.executedPrice}`);
                }
            }
            if (executedCount > 0) {
                console.log(`🎯 Executed ${executedCount} pending orders`);
                // Trigger market data broadcast if available
                if (this.marketEngine.broadcastUpdate) {
                    await this.marketEngine.broadcastUpdate();
                }
            }
        }
        catch (error) {
            console.error('Error processing pending orders:', error);
        }
    }
    /**
     * Sort orders by price/time priority
     */
    sortOrdersByPriority(orders) {
        return orders.sort((a, b) => {
            // For buy orders, higher prices have priority
            // For sell orders, lower prices have priority
            if (a.type === 'buy' && b.type === 'buy') {
                const priceA = parseFloat(a.price || '0');
                const priceB = parseFloat(b.price || '0');
                if (priceA !== priceB) {
                    return priceB - priceA; // Higher prices first for buy orders
                }
            }
            else if (a.type === 'sell' && b.type === 'sell') {
                const priceA = parseFloat(a.price || '0');
                const priceB = parseFloat(b.price || '0');
                if (priceA !== priceB) {
                    return priceA - priceB; // Lower prices first for sell orders
                }
            }
            // If prices are equal or different order types, sort by time (FIFO)
            return new Date(a.createdAt || new Date()).getTime() - new Date(b.createdAt || new Date()).getTime();
        });
    }
}
exports.OrderMatchingEngine = OrderMatchingEngine;
// Export singleton instances
exports.marketSimulation = new MarketSimulationEngine();
exports.orderMatching = new OrderMatchingEngine(exports.marketSimulation);
