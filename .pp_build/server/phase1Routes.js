"use strict";
/**
 * Phase 1 Core Trading Foundation API Routes
 *
 * This file contains API routes for all Phase 1 systems:
 * - Trading Firms Management
 * - IMF Vaulting System
 * - Options Chain
 * - Global Market Hours
 * - Margin Accounts & Short Positions
 * - NPC Traders
 * - Information Tiers & News
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
// Note: validateRequest function will be implemented inline for now
const databaseStorage_js_1 = require("./databaseStorage.js");
const tradingEngine_js_1 = require("./tradingEngine.js");
const schema_js_1 = require("@shared/schema.js");
const router = (0, express_1.Router)();
// =============================================
// TRADING FIRMS ROUTES
// =============================================
// Get all trading firms
router.get('/trading-firms', async (req, res) => {
    try {
        const firms = await databaseStorage_js_1.databaseStorage.getAllTradingFirms();
        res.json(firms);
    }
    catch (error) {
        console.error('Error fetching trading firms:', error);
        res.status(500).json({ error: 'Failed to fetch trading firms' });
    }
});
// Get trading firm by ID
router.get('/trading-firms/:id', async (req, res) => {
    try {
        const firm = await databaseStorage_js_1.databaseStorage.getTradingFirm(req.params.id);
        if (!firm) {
            return res.status(404).json({ error: 'Trading firm not found' });
        }
        res.json(firm);
    }
    catch (error) {
        console.error('Error fetching trading firm:', error);
        res.status(500).json({ error: 'Failed to fetch trading firm' });
    }
});
// Get trading firms by house
router.get('/trading-firms/house/:houseId', async (req, res) => {
    try {
        const firms = await databaseStorage_js_1.databaseStorage.getTradingFirmsByHouse(req.params.houseId);
        res.json(firms);
    }
    catch (error) {
        console.error('Error fetching trading firms by house:', error);
        res.status(500).json({ error: 'Failed to fetch trading firms by house' });
    }
});
// Create new trading firm
router.post('/trading-firms', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertTradingFirmSchema.parse(req.body);
        const firm = await databaseStorage_js_1.databaseStorage.createTradingFirm(validatedData);
        res.status(201).json(firm);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid trading firm data', details: error.errors });
        }
        console.error('Error creating trading firm:', error);
        res.status(500).json({ error: 'Failed to create trading firm' });
    }
});
// Calculate trading bonus for firm and asset type
router.post('/trading-firms/:id/calculate-bonus', async (req, res) => {
    try {
        const { assetType, tradeSize } = req.body;
        if (!assetType || !tradeSize) {
            return res.status(400).json({ error: 'Asset type and trade size required' });
        }
        const firm = await databaseStorage_js_1.databaseStorage.getTradingFirm(req.params.id);
        if (!firm) {
            return res.status(404).json({ error: 'Trading firm not found' });
        }
        const bonus = tradingEngine_js_1.TradingFirmEngine.calculateFirmBonus(firm, assetType, tradeSize);
        res.json(bonus);
    }
    catch (error) {
        console.error('Error calculating firm bonus:', error);
        res.status(500).json({ error: 'Failed to calculate firm bonus' });
    }
});
// =============================================
// IMF VAULTING SYSTEM ROUTES
// =============================================
// Get vault settings for asset
router.get('/imf-vault/:assetId', async (req, res) => {
    try {
        const vaultSettings = await databaseStorage_js_1.databaseStorage.getImfVaultSettings(req.params.assetId);
        if (!vaultSettings) {
            return res.status(404).json({ error: 'Vault settings not found' });
        }
        res.json(vaultSettings);
    }
    catch (error) {
        console.error('Error fetching vault settings:', error);
        res.status(500).json({ error: 'Failed to fetch vault settings' });
    }
});
// Get all vault settings
router.get('/imf-vault', async (req, res) => {
    try {
        const vaultSettings = await databaseStorage_js_1.databaseStorage.getAllImfVaultSettings();
        res.json(vaultSettings);
    }
    catch (error) {
        console.error('Error fetching all vault settings:', error);
        res.status(500).json({ error: 'Failed to fetch vault settings' });
    }
});
// Create vault settings
router.post('/imf-vault', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertImfVaultSettingsSchema.parse(req.body);
        const vaultSettings = await databaseStorage_js_1.databaseStorage.createImfVaultSettings(validatedData);
        res.status(201).json(vaultSettings);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid vault settings data', details: error.errors });
        }
        console.error('Error creating vault settings:', error);
        res.status(500).json({ error: 'Failed to create vault settings' });
    }
});
// Calculate scarcity multiplier
router.post('/imf-vault/:assetId/scarcity', async (req, res) => {
    try {
        const vaultSettings = await databaseStorage_js_1.databaseStorage.getImfVaultSettings(req.params.assetId);
        if (!vaultSettings) {
            return res.status(404).json({ error: 'Vault settings not found' });
        }
        const scarcityMultiplier = tradingEngine_js_1.ImfVaultingEngine.calculateScarcityMultiplier(vaultSettings);
        // Update the vault settings with new scarcity multiplier
        await databaseStorage_js_1.databaseStorage.updateImfVaultSettings(req.params.assetId, {
            scarcityMultiplier: scarcityMultiplier.toString(),
            lastScarcityUpdate: new Date()
        });
        res.json({ scarcityMultiplier });
    }
    catch (error) {
        console.error('Error calculating scarcity multiplier:', error);
        res.status(500).json({ error: 'Failed to calculate scarcity multiplier' });
    }
});
// Check vaulting trigger
router.post('/imf-vault/:assetId/check-vaulting', async (req, res) => {
    try {
        const { currentPrice, marketCap, volumeRatio } = req.body;
        if (!currentPrice || !marketCap || volumeRatio === undefined) {
            return res.status(400).json({ error: 'Current price, market cap, and volume ratio required' });
        }
        const vaultSettings = await databaseStorage_js_1.databaseStorage.getImfVaultSettings(req.params.assetId);
        if (!vaultSettings) {
            return res.status(404).json({ error: 'Vault settings not found' });
        }
        const shouldVault = tradingEngine_js_1.ImfVaultingEngine.shouldTriggerVaulting(vaultSettings, currentPrice, marketCap, volumeRatio);
        const vaultingFee = shouldVault
            ? tradingEngine_js_1.ImfVaultingEngine.calculateVaultingFee(vaultSettings, 1, currentPrice)
            : 0;
        res.json({ shouldVault, vaultingFee });
    }
    catch (error) {
        console.error('Error checking vaulting trigger:', error);
        res.status(500).json({ error: 'Failed to check vaulting trigger' });
    }
});
// =============================================
// OPTIONS CHAIN ROUTES
// =============================================
// Get options chain for underlying asset
router.get('/options/:underlyingAssetId', async (req, res) => {
    try {
        const options = await databaseStorage_js_1.databaseStorage.getOptionsChainByUnderlying(req.params.underlyingAssetId);
        res.json(options);
    }
    catch (error) {
        console.error('Error fetching options chain:', error);
        res.status(500).json({ error: 'Failed to fetch options chain' });
    }
});
// Get options by expiration date
router.get('/options/expiration/:date', async (req, res) => {
    try {
        const expirationDate = new Date(req.params.date);
        const options = await databaseStorage_js_1.databaseStorage.getOptionsChainByExpiration(expirationDate);
        res.json(options);
    }
    catch (error) {
        console.error('Error fetching options by expiration:', error);
        res.status(500).json({ error: 'Failed to fetch options by expiration' });
    }
});
// Calculate option pricing and Greeks
router.post('/options/calculate-pricing', async (req, res) => {
    try {
        const { underlyingPrice, strikePrice, timeToExpiration, riskFreeRate = 0.05, volatility, optionType } = req.body;
        if (!underlyingPrice || !strikePrice || !timeToExpiration || !volatility || !optionType) {
            return res.status(400).json({ error: 'Missing required parameters for option pricing' });
        }
        const pricing = tradingEngine_js_1.OptionsCalculator.calculateOptionPricing(underlyingPrice, strikePrice, timeToExpiration, riskFreeRate, volatility, optionType);
        res.json(pricing);
    }
    catch (error) {
        console.error('Error calculating option pricing:', error);
        res.status(500).json({ error: 'Failed to calculate option pricing' });
    }
});
// Calculate implied volatility
router.post('/options/implied-volatility', async (req, res) => {
    try {
        const { marketPrice, underlyingPrice, strikePrice, timeToExpiration, riskFreeRate = 0.05, optionType } = req.body;
        if (!marketPrice || !underlyingPrice || !strikePrice || !timeToExpiration || !optionType) {
            return res.status(400).json({ error: 'Missing required parameters for implied volatility' });
        }
        const impliedVolatility = tradingEngine_js_1.OptionsCalculator.calculateImpliedVolatility(marketPrice, underlyingPrice, strikePrice, timeToExpiration, riskFreeRate, optionType);
        res.json({ impliedVolatility });
    }
    catch (error) {
        console.error('Error calculating implied volatility:', error);
        res.status(500).json({ error: 'Failed to calculate implied volatility' });
    }
});
// Create new option
router.post('/options', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertOptionsChainSchema.parse(req.body);
        const option = await databaseStorage_js_1.databaseStorage.createOptionsChain(validatedData);
        res.status(201).json(option);
    }
    catch (error) {
        console.error('Error creating option:', error);
        res.status(500).json({ error: 'Failed to create option' });
    }
});
// =============================================
// GLOBAL MARKET HOURS ROUTES
// =============================================
// Get all market hours
router.get('/market-hours', async (req, res) => {
    try {
        const marketHours = await databaseStorage_js_1.databaseStorage.getAllGlobalMarketHours();
        res.json(marketHours);
    }
    catch (error) {
        console.error('Error fetching market hours:', error);
        res.status(500).json({ error: 'Failed to fetch market hours' });
    }
});
// Get active markets
router.get('/market-hours/active', async (req, res) => {
    try {
        const activeMarkets = await databaseStorage_js_1.databaseStorage.getActiveMarkets();
        // Add real-time market status
        const marketsWithStatus = activeMarkets.map(market => ({
            ...market,
            isCurrentlyOpen: tradingEngine_js_1.MarketHoursManager.isMarketOpen(market),
            nextOpenTime: tradingEngine_js_1.MarketHoursManager.getNextMarketOpen(market)
        }));
        res.json(marketsWithStatus);
    }
    catch (error) {
        console.error('Error fetching active markets:', error);
        res.status(500).json({ error: 'Failed to fetch active markets' });
    }
});
// Get market hours by code
router.get('/market-hours/:marketCode', async (req, res) => {
    try {
        const marketHours = await databaseStorage_js_1.databaseStorage.getGlobalMarketHours(req.params.marketCode);
        if (!marketHours) {
            return res.status(404).json({ error: 'Market hours not found' });
        }
        const status = {
            ...marketHours,
            isCurrentlyOpen: tradingEngine_js_1.MarketHoursManager.isMarketOpen(marketHours),
            nextOpenTime: tradingEngine_js_1.MarketHoursManager.getNextMarketOpen(marketHours)
        };
        res.json(status);
    }
    catch (error) {
        console.error('Error fetching market hours:', error);
        res.status(500).json({ error: 'Failed to fetch market hours' });
    }
});
// Calculate cross-market adjustment
router.post('/market-hours/cross-market-adjustment', async (req, res) => {
    try {
        const { primaryMarketCode, tradingMarketCode } = req.body;
        if (!primaryMarketCode || !tradingMarketCode) {
            return res.status(400).json({ error: 'Primary and trading market codes required' });
        }
        const primaryMarket = await databaseStorage_js_1.databaseStorage.getGlobalMarketHours(primaryMarketCode);
        const tradingMarket = await databaseStorage_js_1.databaseStorage.getGlobalMarketHours(tradingMarketCode);
        if (!primaryMarket || !tradingMarket) {
            return res.status(404).json({ error: 'Market hours not found' });
        }
        const adjustment = tradingEngine_js_1.MarketHoursManager.getCrossMarketAdjustment(primaryMarket, tradingMarket);
        res.json({ adjustment });
    }
    catch (error) {
        console.error('Error calculating cross-market adjustment:', error);
        res.status(500).json({ error: 'Failed to calculate cross-market adjustment' });
    }
});
// =============================================
// MARGIN ACCOUNTS ROUTES
// =============================================
// Get user margin accounts
router.get('/margin-accounts/user/:userId', async (req, res) => {
    try {
        const marginAccounts = await databaseStorage_js_1.databaseStorage.getUserMarginAccounts(req.params.userId);
        res.json(marginAccounts);
    }
    catch (error) {
        console.error('Error fetching user margin accounts:', error);
        res.status(500).json({ error: 'Failed to fetch margin accounts' });
    }
});
// Get specific margin account
router.get('/margin-accounts/:userId/:portfolioId', async (req, res) => {
    try {
        const marginAccount = await databaseStorage_js_1.databaseStorage.getMarginAccount(req.params.userId, req.params.portfolioId);
        if (!marginAccount) {
            return res.status(404).json({ error: 'Margin account not found' });
        }
        res.json(marginAccount);
    }
    catch (error) {
        console.error('Error fetching margin account:', error);
        res.status(500).json({ error: 'Failed to fetch margin account' });
    }
});
// Create margin account
router.post('/margin-accounts', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertMarginAccountSchema.parse(req.body);
        const marginAccount = await databaseStorage_js_1.databaseStorage.createMarginAccount(validatedData);
        res.status(201).json(marginAccount);
    }
    catch (error) {
        console.error('Error creating margin account:', error);
        res.status(500).json({ error: 'Failed to create margin account' });
    }
});
// =============================================
// SHORT POSITIONS ROUTES
// =============================================
// Get user short positions
router.get('/short-positions/user/:userId', async (req, res) => {
    try {
        const shortPositions = await databaseStorage_js_1.databaseStorage.getUserShortPositions(req.params.userId);
        res.json(shortPositions);
    }
    catch (error) {
        console.error('Error fetching user short positions:', error);
        res.status(500).json({ error: 'Failed to fetch short positions' });
    }
});
// Get portfolio short positions
router.get('/short-positions/portfolio/:portfolioId', async (req, res) => {
    try {
        const shortPositions = await databaseStorage_js_1.databaseStorage.getPortfolioShortPositions(req.params.portfolioId);
        res.json(shortPositions);
    }
    catch (error) {
        console.error('Error fetching portfolio short positions:', error);
        res.status(500).json({ error: 'Failed to fetch short positions' });
    }
});
// Create short position
router.post('/short-positions', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertShortPositionSchema.parse(req.body);
        const shortPosition = await databaseStorage_js_1.databaseStorage.createShortPosition(validatedData);
        res.status(201).json(shortPosition);
    }
    catch (error) {
        console.error('Error creating short position:', error);
        res.status(500).json({ error: 'Failed to create short position' });
    }
});
// =============================================
// NPC TRADERS ROUTES
// =============================================
// Get all active NPC traders
router.get('/npc-traders', async (req, res) => {
    try {
        const npcTraders = await databaseStorage_js_1.databaseStorage.getActiveNpcTraders();
        res.json(npcTraders);
    }
    catch (error) {
        console.error('Error fetching NPC traders:', error);
        res.status(500).json({ error: 'Failed to fetch NPC traders' });
    }
});
// Get NPC traders by type
router.get('/npc-traders/type/:traderType', async (req, res) => {
    try {
        const npcTraders = await databaseStorage_js_1.databaseStorage.getNpcTradersByType(req.params.traderType);
        res.json(npcTraders);
    }
    catch (error) {
        console.error('Error fetching NPC traders by type:', error);
        res.status(500).json({ error: 'Failed to fetch NPC traders by type' });
    }
});
// Get NPC traders by firm
router.get('/npc-traders/firm/:firmId', async (req, res) => {
    try {
        const npcTraders = await databaseStorage_js_1.databaseStorage.getNpcTradersByFirm(req.params.firmId);
        res.json(npcTraders);
    }
    catch (error) {
        console.error('Error fetching NPC traders by firm:', error);
        res.status(500).json({ error: 'Failed to fetch NPC traders by firm' });
    }
});
// Calculate NPC trading decision
router.post('/npc-traders/:id/trading-decision', async (req, res) => {
    try {
        const { assetPrice, priceHistory, marketSentiment, volumeProfile } = req.body;
        if (!assetPrice || !priceHistory || marketSentiment === undefined || !volumeProfile) {
            return res.status(400).json({ error: 'Missing required parameters for trading decision' });
        }
        const trader = await databaseStorage_js_1.databaseStorage.getNpcTrader(req.params.id);
        if (!trader) {
            return res.status(404).json({ error: 'NPC trader not found' });
        }
        const decision = tradingEngine_js_1.NpcTradingEngine.calculateTradingDecision(trader, assetPrice, priceHistory, marketSentiment, volumeProfile);
        res.json(decision);
    }
    catch (error) {
        console.error('Error calculating NPC trading decision:', error);
        res.status(500).json({ error: 'Failed to calculate trading decision' });
    }
});
// Create NPC trader
router.post('/npc-traders', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertNpcTraderSchema.parse(req.body);
        const npcTrader = await databaseStorage_js_1.databaseStorage.createNpcTrader(validatedData);
        res.status(201).json(npcTrader);
    }
    catch (error) {
        console.error('Error creating NPC trader:', error);
        res.status(500).json({ error: 'Failed to create NPC trader' });
    }
});
// =============================================
// INFORMATION TIERS ROUTES
// =============================================
// Get all information tiers
router.get('/information-tiers', async (req, res) => {
    try {
        const tiers = await databaseStorage_js_1.databaseStorage.getAllInformationTiers();
        res.json(tiers);
    }
    catch (error) {
        console.error('Error fetching information tiers:', error);
        res.status(500).json({ error: 'Failed to fetch information tiers' });
    }
});
// Get specific information tier
router.get('/information-tiers/:tierName', async (req, res) => {
    try {
        const tier = await databaseStorage_js_1.databaseStorage.getInformationTier(req.params.tierName);
        if (!tier) {
            return res.status(404).json({ error: 'Information tier not found' });
        }
        res.json(tier);
    }
    catch (error) {
        console.error('Error fetching information tier:', error);
        res.status(500).json({ error: 'Failed to fetch information tier' });
    }
});
// =============================================
// NEWS ARTICLES ROUTES
// =============================================
// Get news articles by user tier
router.get('/news/:userTier', async (req, res) => {
    try {
        const { userTier } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (!['elite', 'pro', 'free'].includes(userTier)) {
            return res.status(400).json({ error: 'Invalid user tier' });
        }
        const articles = await databaseStorage_js_1.databaseStorage.getNewsArticlesByTier(userTier, limit);
        // Filter articles based on tier access
        const accessibleArticles = articles.filter(article => tradingEngine_js_1.InformationTierManager.hasNewsAccess(userTier, article));
        res.json(accessibleArticles);
    }
    catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
});
// Get news articles for specific asset
router.get('/news/asset/:assetId', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const articles = await databaseStorage_js_1.databaseStorage.getNewsArticlesByAsset(req.params.assetId, limit);
        res.json(articles);
    }
    catch (error) {
        console.error('Error fetching news articles for asset:', error);
        res.status(500).json({ error: 'Failed to fetch news articles for asset' });
    }
});
// Create news article
router.post('/news', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertNewsArticleSchema.parse(req.body);
        const article = await databaseStorage_js_1.databaseStorage.createNewsArticle(validatedData);
        res.status(201).json(article);
    }
    catch (error) {
        console.error('Error creating news article:', error);
        res.status(500).json({ error: 'Failed to create news article' });
    }
});
// =============================================
// ASSET FINANCIAL MAPPING ROUTES
// =============================================
// Get asset financial mapping
router.get('/asset-mapping/:assetId', async (req, res) => {
    try {
        const mapping = await databaseStorage_js_1.databaseStorage.getAssetFinancialMapping(req.params.assetId);
        if (!mapping) {
            return res.status(404).json({ error: 'Asset financial mapping not found' });
        }
        res.json(mapping);
    }
    catch (error) {
        console.error('Error fetching asset financial mapping:', error);
        res.status(500).json({ error: 'Failed to fetch asset financial mapping' });
    }
});
// Get asset mappings by type
router.get('/asset-mapping/type/:instrumentType', async (req, res) => {
    try {
        const mappings = await databaseStorage_js_1.databaseStorage.getAssetFinancialMappingsByType(req.params.instrumentType);
        res.json(mappings);
    }
    catch (error) {
        console.error('Error fetching asset mappings by type:', error);
        res.status(500).json({ error: 'Failed to fetch asset mappings by type' });
    }
});
// Create asset financial mapping
router.post('/asset-mapping', async (req, res) => {
    try {
        const validatedData = schema_js_1.insertAssetFinancialMappingSchema.parse(req.body);
        const mapping = await databaseStorage_js_1.databaseStorage.createAssetFinancialMapping(validatedData);
        res.status(201).json(mapping);
    }
    catch (error) {
        console.error('Error creating asset financial mapping:', error);
        res.status(500).json({ error: 'Failed to create asset financial mapping' });
    }
});
exports.default = router;
