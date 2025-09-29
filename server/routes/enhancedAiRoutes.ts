import express from 'express';
import { z } from 'zod';
import { enhancedAiMarketIntelligence } from '../services/enhancedAiMarketIntelligence.js';
import { storage } from '../storage.js';
import type { User, Asset } from '@shared/schema.js';

const router = express.Router();

// Request validation schemas
const generateInsightsSchema = z.object({
  assetIds: z.array(z.string()).optional(),
  analysisType: z.enum(['full', 'quick', 'targeted']).default('full'),
  includeHouseSpecific: z.boolean().default(true),
  includeKarmaAlignment: z.boolean().default(true)
});

const battlePredictionSchema = z.object({
  character1Id: z.string(),
  character2Id: z.string(),
  battleType: z.enum(['power_clash', 'strategy_battle', 'moral_conflict', 'crossover_event']).default('power_clash')
});

const marketAnomalySchema = z.object({
  assetIds: z.array(z.string()).optional(),
  severityThreshold: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

/**
 * Enhanced AI Market Intelligence API Routes
 * Provides mystical AI-powered market analysis with RPG presentation
 */

// GET endpoint for enhanced AI predictions (for frontend TanStack Query)
router.get('/enhanced-predictions', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    const { assetIds, analysisType = 'full', includeHouseSpecific = true, includeKarmaAlignment = true } = req.query;

    console.log('🔮 Enhanced AI Oracle: Generating predictions for', user?.email || 'anonymous user');

    // Parse assetIds from query string if provided
    const parsedAssetIds = assetIds ? (Array.isArray(assetIds) ? assetIds as string[] : [assetIds as string]) : undefined;

    // Get assets to analyze
    let assets: Asset[] = [];
    if (parsedAssetIds && parsedAssetIds.length > 0) {
      // Get specific assets
      assets = await Promise.all(
        parsedAssetIds.map(id => storage.getAsset(id)).filter(Boolean)
      ) as Asset[];
    } else {
      // Get trending or popular assets
      assets = await storage.getAssets({ type: 'character' });
      assets = assets.slice(0, 10); // Limit to top 10 for performance
    }

    if (assets.length === 0) {
      return res.status(400).json({ 
        error: 'No valid assets found for analysis',
        mysticalMessage: 'The cosmic forces require sacred assets to divine upon.'
      });
    }

    // Transform to enhanced format
    const enhancedAssets = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      currentPrice: parseFloat(asset.metadata?.currentPrice || '100'),
      type: asset.type as 'character' | 'comic' | 'creator' | 'publisher',
      metadata: {
        powerStats: asset.metadata?.powerStats,
        firstAppearance: asset.metadata?.firstAppearance,
        publisher: asset.metadata?.publisher,
        affiliations: asset.metadata?.affiliations,
        enemies: asset.metadata?.enemies,
        allies: asset.metadata?.allies,
        universeOrigin: asset.metadata?.universeOrigin,
        comicsAppeared: asset.metadata?.comicsAppeared,
        popularity: asset.metadata?.popularity || 50,
        movieAppearances: asset.metadata?.movieAppearances || 0,
        tvAppearances: asset.metadata?.tvAppearances || 0
      },
      historicalPrices: asset.metadata?.historicalPrices || Array.from({ length: 30 }, 
        (_, i) => parseFloat(asset.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: asset.metadata?.volume24h || 1000 + Math.random() * 5000,
      marketCap: asset.metadata?.marketCap || 1000000 + Math.random() * 10000000,
      volatility: asset.metadata?.volatility || 0.1 + Math.random() * 0.3,
      houseAffinity: asset.metadata?.houseAffinity
    }));

    // Generate enhanced predictions
    const predictions = await enhancedAiMarketIntelligence.generateEnhancedPredictions(
      enhancedAssets, 
      user
    );

    // Add asset details to predictions
    const enrichedPredictions = predictions.map(prediction => ({
      ...prediction,
      assetName: assets.find(a => a.id === prediction.assetId)?.name || 'Unknown Asset',
      assetSymbol: assets.find(a => a.id === prediction.assetId)?.symbol || 'UNK'
    }));

    res.json(enrichedPredictions);
  } catch (error) {
    console.error('Enhanced AI Predictions Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate enhanced predictions',
      mysticalMessage: 'The Oracle\'s visions are clouded by cosmic interference. Please try again.'
    });
  }
});

// Generate enhanced AI predictions with mystical presentation (POST for backwards compatibility)
router.post('/enhanced-predictions', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    const { assetIds, analysisType, includeHouseSpecific, includeKarmaAlignment } = 
      generateInsightsSchema.parse(req.body);

    console.log('🔮 Enhanced AI Oracle: Generating predictions for', user?.email || 'anonymous user');

    // Get assets to analyze
    let assets: Asset[] = [];
    if (assetIds && assetIds.length > 0) {
      // Get specific assets
      assets = await Promise.all(
        assetIds.map(id => storage.getAsset(id)).filter(Boolean)
      ) as Asset[];
    } else {
      // Get trending or popular assets
      assets = await storage.getAssets({ type: 'character' });
      assets = assets.slice(0, 10); // Limit to top 10 for performance
    }

    if (assets.length === 0) {
      return res.status(400).json({ 
        error: 'No valid assets found for analysis',
        mysticalMessage: 'The cosmic forces require sacred assets to divine upon.'
      });
    }

    // Transform to enhanced format
    const enhancedAssets = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      currentPrice: parseFloat(asset.metadata?.currentPrice || '100'),
      type: asset.type as 'character' | 'comic' | 'creator' | 'publisher',
      metadata: {
        powerStats: asset.metadata?.powerStats,
        firstAppearance: asset.metadata?.firstAppearance,
        publisher: asset.metadata?.publisher,
        affiliations: asset.metadata?.affiliations,
        enemies: asset.metadata?.enemies,
        allies: asset.metadata?.allies,
        universeOrigin: asset.metadata?.universeOrigin,
        comicsAppeared: asset.metadata?.comicsAppeared,
        popularity: asset.metadata?.popularity || 50,
        movieAppearances: asset.metadata?.movieAppearances || 0,
        tvAppearances: asset.metadata?.tvAppearances || 0
      },
      historicalPrices: asset.metadata?.historicalPrices || Array.from({ length: 30 }, 
        (_, i) => parseFloat(asset.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: asset.metadata?.volume24h || 1000 + Math.random() * 5000,
      marketCap: asset.metadata?.marketCap || 1000000 + Math.random() * 10000000,
      volatility: asset.metadata?.volatility || 0.1 + Math.random() * 0.3,
      houseAffinity: asset.metadata?.houseAffinity
    }));

    // Generate enhanced predictions
    const predictions = await enhancedAiMarketIntelligence.generateEnhancedPredictions(
      enhancedAssets, 
      user
    );

    // Add asset details to predictions
    const enrichedPredictions = predictions.map(prediction => ({
      ...prediction,
      assetName: assets.find(a => a.id === prediction.assetId)?.name || 'Unknown Asset',
      assetSymbol: assets.find(a => a.id === prediction.assetId)?.symbol || 'UNK'
    }));

    res.json(enrichedPredictions);
  } catch (error) {
    console.error('Enhanced AI Predictions Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate enhanced predictions',
      mysticalMessage: 'The Oracle\'s visions are clouded by cosmic interference. Please try again.'
    });
  }
});

// GET endpoint for battle predictions (for frontend TanStack Query)
router.get('/battle-predictions', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    console.log('⚔️ Battle Oracle: Generating popular battle predictions');

    // Get character assets for popular battles
    const characters = await storage.getAssets({ type: 'character' });
    const popularCharacters = characters.slice(0, 6); // Top 6 characters

    if (popularCharacters.length < 2) {
      return res.status(400).json({ 
        error: 'Insufficient characters for battle predictions',
        mysticalMessage: 'The cosmic spirits require more legendary beings to divine battle outcomes.'
      });
    }

    // Generate multiple battle predictions for popular matchups
    const battlePredictions = [];
    
    for (let i = 0; i < Math.min(popularCharacters.length - 1, 3); i++) {
      const char1 = popularCharacters[i];
      const char2 = popularCharacters[i + 1];
      
      if (char1 && char2) {
        // Transform to enhanced format
        const enhancedChar1 = {
          id: char1.id,
          name: char1.name,
          symbol: char1.symbol,
          currentPrice: parseFloat(char1.metadata?.currentPrice || '100'),
          type: 'character' as const,
          metadata: {
            powerStats: char1.metadata?.powerStats || {
              intelligence: 50 + Math.random() * 50,
              strength: 50 + Math.random() * 50,
              speed: 50 + Math.random() * 50,
              durability: 50 + Math.random() * 50,
              power: 50 + Math.random() * 50,
              combat: 50 + Math.random() * 50
            },
            firstAppearance: char1.metadata?.firstAppearance,
            publisher: char1.metadata?.publisher,
            affiliations: char1.metadata?.affiliations,
            enemies: char1.metadata?.enemies,
            allies: char1.metadata?.allies,
            universeOrigin: char1.metadata?.universeOrigin,
            comicsAppeared: char1.metadata?.comicsAppeared || 50 + Math.random() * 200,
            popularity: char1.metadata?.popularity || 50 + Math.random() * 50,
            movieAppearances: char1.metadata?.movieAppearances || Math.floor(Math.random() * 5),
            tvAppearances: char1.metadata?.tvAppearances || Math.floor(Math.random() * 10)
          },
          historicalPrices: Array.from({ length: 30 }, 
            (_, i) => parseFloat(char1.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
          ),
          volume24h: 1000 + Math.random() * 5000,
          marketCap: 1000000 + Math.random() * 10000000,
          volatility: 0.1 + Math.random() * 0.3,
          houseAffinity: char1.metadata?.houseAffinity
        };

        const enhancedChar2 = {
          id: char2.id,
          name: char2.name,
          symbol: char2.symbol,
          currentPrice: parseFloat(char2.metadata?.currentPrice || '100'),
          type: 'character' as const,
          metadata: {
            powerStats: char2.metadata?.powerStats || {
              intelligence: 50 + Math.random() * 50,
              strength: 50 + Math.random() * 50,
              speed: 50 + Math.random() * 50,
              durability: 50 + Math.random() * 50,
              power: 50 + Math.random() * 50,
              combat: 50 + Math.random() * 50
            },
            firstAppearance: char2.metadata?.firstAppearance,
            publisher: char2.metadata?.publisher,
            affiliations: char2.metadata?.affiliations,
            enemies: char2.metadata?.enemies,
            allies: char2.metadata?.allies,
            universeOrigin: char2.metadata?.universeOrigin,
            comicsAppeared: char2.metadata?.comicsAppeared || 50 + Math.random() * 200,
            popularity: char2.metadata?.popularity || 50 + Math.random() * 50,
            movieAppearances: char2.metadata?.movieAppearances || Math.floor(Math.random() * 5),
            tvAppearances: char2.metadata?.tvAppearances || Math.floor(Math.random() * 10)
          },
          historicalPrices: Array.from({ length: 30 }, 
            (_, i) => parseFloat(char2.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
          ),
          volume24h: 1000 + Math.random() * 5000,
          marketCap: 1000000 + Math.random() * 10000000,
          volatility: 0.1 + Math.random() * 0.3,
          houseAffinity: char2.metadata?.houseAffinity
        };

        // Generate battle prediction
        const battleType = ['power_clash', 'strategy_battle', 'moral_conflict'][Math.floor(Math.random() * 3)];
        const battlePrediction = await enhancedAiMarketIntelligence.predictCharacterBattle(
          enhancedChar1,
          enhancedChar2,
          battleType,
          user
        );

        battlePredictions.push(battlePrediction);
      }
    }

    res.json(battlePredictions);
  } catch (error) {
    console.error('GET Battle Prediction Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate battle predictions',
      mysticalMessage: 'The Battle Oracle\'s sight is clouded by cosmic turbulence. The clashes remain hidden in shadow.'
    });
  }
});

// Generate character battle predictions (POST for specific battles)
router.post('/battle-predictions', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    const { character1Id, character2Id, battleType } = battlePredictionSchema.parse(req.body);

    console.log('⚔️ Battle Oracle: Predicting clash between characters');

    // Get character assets
    const character1 = await storage.getAsset(character1Id);
    const character2 = await storage.getAsset(character2Id);

    if (!character1 || !character2) {
      return res.status(400).json({ 
        error: 'One or both characters not found',
        mysticalMessage: 'The cosmic spirits cannot locate these legendary beings in the sacred realm.'
      });
    }

    // Transform to enhanced format
    const enhancedChar1 = {
      id: character1.id,
      name: character1.name,
      symbol: character1.symbol,
      currentPrice: parseFloat(character1.metadata?.currentPrice || '100'),
      type: 'character' as const,
      metadata: {
        powerStats: character1.metadata?.powerStats || {
          intelligence: 50 + Math.random() * 50,
          strength: 50 + Math.random() * 50,
          speed: 50 + Math.random() * 50,
          durability: 50 + Math.random() * 50,
          power: 50 + Math.random() * 50,
          combat: 50 + Math.random() * 50
        },
        firstAppearance: character1.metadata?.firstAppearance,
        publisher: character1.metadata?.publisher,
        affiliations: character1.metadata?.affiliations,
        enemies: character1.metadata?.enemies,
        allies: character1.metadata?.allies,
        universeOrigin: character1.metadata?.universeOrigin,
        comicsAppeared: character1.metadata?.comicsAppeared || 50 + Math.random() * 200,
        popularity: character1.metadata?.popularity || 50 + Math.random() * 50,
        movieAppearances: character1.metadata?.movieAppearances || Math.floor(Math.random() * 5),
        tvAppearances: character1.metadata?.tvAppearances || Math.floor(Math.random() * 10)
      },
      historicalPrices: Array.from({ length: 30 }, 
        (_, i) => parseFloat(character1.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: 1000 + Math.random() * 5000,
      marketCap: 1000000 + Math.random() * 10000000,
      volatility: 0.1 + Math.random() * 0.3,
      houseAffinity: character1.metadata?.houseAffinity
    };

    const enhancedChar2 = {
      id: character2.id,
      name: character2.name,
      symbol: character2.symbol,
      currentPrice: parseFloat(character2.metadata?.currentPrice || '100'),
      type: 'character' as const,
      metadata: {
        powerStats: character2.metadata?.powerStats || {
          intelligence: 50 + Math.random() * 50,
          strength: 50 + Math.random() * 50,
          speed: 50 + Math.random() * 50,
          durability: 50 + Math.random() * 50,
          power: 50 + Math.random() * 50,
          combat: 50 + Math.random() * 50
        },
        firstAppearance: character2.metadata?.firstAppearance,
        publisher: character2.metadata?.publisher,
        affiliations: character2.metadata?.affiliations,
        enemies: character2.metadata?.enemies,
        allies: character2.metadata?.allies,
        universeOrigin: character2.metadata?.universeOrigin,
        comicsAppeared: character2.metadata?.comicsAppeared || 50 + Math.random() * 200,
        popularity: character2.metadata?.popularity || 50 + Math.random() * 50,
        movieAppearances: character2.metadata?.movieAppearances || Math.floor(Math.random() * 5),
        tvAppearances: character2.metadata?.tvAppearances || Math.floor(Math.random() * 10)
      },
      historicalPrices: Array.from({ length: 30 }, 
        (_, i) => parseFloat(character2.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: 1000 + Math.random() * 5000,
      marketCap: 1000000 + Math.random() * 10000000,
      volatility: 0.1 + Math.random() * 0.3,
      houseAffinity: character2.metadata?.houseAffinity
    };

    // Generate battle prediction
    const battlePrediction = await enhancedAiMarketIntelligence.predictCharacterBattle(
      enhancedChar1,
      enhancedChar2,
      battleType,
      user
    );

    res.json(battlePrediction);
  } catch (error) {
    console.error('Battle Prediction Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate battle prediction',
      mysticalMessage: 'The Battle Oracle\'s sight is clouded by cosmic turbulence. The clash remains hidden in shadow.'
    });
  }
});

// Detect market anomalies
router.get('/market-anomalies', async (req, res) => {
  try {
    const { assetIds, severityThreshold } = marketAnomalySchema.parse(req.query);

    console.log('🚨 Anomaly Oracle: Scanning for mystical market disturbances');

    // Get assets to analyze
    let assets: Asset[] = [];
    if (assetIds && assetIds.length > 0) {
      assets = await Promise.all(
        assetIds.map(id => storage.getAsset(id)).filter(Boolean)
      ) as Asset[];
    } else {
      // Get all assets for comprehensive scan
      assets = await storage.getAssets();
      assets = assets.slice(0, 20); // Limit for performance
    }

    // Transform to enhanced format
    const enhancedAssets = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      currentPrice: parseFloat(asset.metadata?.currentPrice || '100'),
      type: asset.type as 'character' | 'comic' | 'creator' | 'publisher',
      metadata: {
        powerStats: asset.metadata?.powerStats,
        firstAppearance: asset.metadata?.firstAppearance,
        publisher: asset.metadata?.publisher,
        popularity: asset.metadata?.popularity || 50
      },
      historicalPrices: asset.metadata?.historicalPrices || Array.from({ length: 30 }, 
        (_, i) => parseFloat(asset.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: asset.metadata?.volume24h || 1000 + Math.random() * 5000,
      marketCap: asset.metadata?.marketCap || 1000000 + Math.random() * 10000000,
      volatility: asset.metadata?.volatility || 0.1 + Math.random() * 0.3
    }));

    // Detect anomalies
    const anomalies = await enhancedAiMarketIntelligence.detectMarketAnomalies(enhancedAssets);

    // Filter by severity threshold
    const filteredAnomalies = anomalies.filter(anomaly => {
      const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
      const thresholdLevel = severityLevels[severityThreshold];
      const anomalyLevel = severityLevels[anomaly.severity];
      return anomalyLevel >= thresholdLevel;
    });

    // Add IDs and format response
    const enrichedAnomalies = filteredAnomalies.map((anomaly, index) => ({
      id: `anomaly_${Date.now()}_${index}`,
      ...anomaly
    }));

    res.json(enrichedAnomalies);
  } catch (error) {
    console.error('Market Anomaly Detection Error:', error);
    res.status(500).json({ 
      error: 'Failed to detect market anomalies',
      mysticalMessage: 'The cosmic sensors are disrupted. Market disturbances remain hidden from sight.'
    });
  }
});

// GET endpoint for advanced market insights (for frontend TanStack Query)
router.get('/advanced-insights', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    console.log('🧙‍♂️ Market Sage: Channeling advanced mystical wisdom for GET request');

    // Get diverse asset mix for comprehensive insights
    const characters = await storage.getAssets({ type: 'character' });
    const comics = await storage.getAssets({ type: 'comic' });
    const creators = await storage.getAssets({ type: 'creator' });
    
    const assets = [
      ...characters.slice(0, 5),
      ...comics.slice(0, 3),
      ...creators.slice(0, 2)
    ];

    if (assets.length === 0) {
      return res.status(400).json({ 
        error: 'No valid assets found for analysis',
        mysticalMessage: 'The cosmic forces require sacred assets to divine upon.'
      });
    }

    // Transform to enhanced format
    const enhancedAssets = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      currentPrice: parseFloat(asset.metadata?.currentPrice || '100'),
      type: asset.type as 'character' | 'comic' | 'creator' | 'publisher',
      metadata: {
        powerStats: asset.metadata?.powerStats,
        firstAppearance: asset.metadata?.firstAppearance,
        publisher: asset.metadata?.publisher,
        affiliations: asset.metadata?.affiliations,
        universeOrigin: asset.metadata?.universeOrigin,
        comicsAppeared: asset.metadata?.comicsAppeared,
        popularity: asset.metadata?.popularity || 50,
        movieAppearances: asset.metadata?.movieAppearances || 0,
        tvAppearances: asset.metadata?.tvAppearances || 0,
        intelligence: asset.metadata?.powerStats?.intelligence
      },
      historicalPrices: asset.metadata?.historicalPrices || Array.from({ length: 30 }, 
        (_, i) => parseFloat(asset.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: asset.metadata?.volume24h || 1000 + Math.random() * 5000,
      marketCap: asset.metadata?.marketCap || 1000000 + Math.random() * 10000000,
      volatility: asset.metadata?.volatility || 0.1 + Math.random() * 0.3
    }));

    // Generate advanced insights
    const insights = await enhancedAiMarketIntelligence.generateAdvancedMarketInsights(
      enhancedAssets,
      user
    );

    // Add IDs and enrich response
    const enrichedInsights = insights.map((insight, index) => ({
      id: `insight_${Date.now()}_${index}`,
      ...insight
    }));

    res.json(enrichedInsights);
  } catch (error) {
    console.error('GET Advanced Insights Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate advanced insights',
      mysticalMessage: 'The Market Sage\'s wisdom is temporarily veiled by cosmic storms. Please seek guidance again.'
    });
  }
});

// Generate advanced market insights (POST for backwards compatibility)
router.post('/advanced-insights', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    const { assetIds, analysisType, includeHouseSpecific, includeKarmaAlignment } = 
      generateInsightsSchema.parse(req.body);

    console.log('🧙‍♂️ Market Sage: Channeling advanced mystical wisdom');

    // Get assets to analyze
    let assets: Asset[] = [];
    if (assetIds && assetIds.length > 0) {
      assets = await Promise.all(
        assetIds.map(id => storage.getAsset(id)).filter(Boolean)
      ) as Asset[];
    } else {
      // Get diverse asset mix
      const characters = await storage.getAssets({ type: 'character' });
      const comics = await storage.getAssets({ type: 'comic' });
      const creators = await storage.getAssets({ type: 'creator' });
      
      assets = [
        ...characters.slice(0, 5),
        ...comics.slice(0, 3),
        ...creators.slice(0, 2)
      ];
    }

    // Transform to enhanced format
    const enhancedAssets = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      currentPrice: parseFloat(asset.metadata?.currentPrice || '100'),
      type: asset.type as 'character' | 'comic' | 'creator' | 'publisher',
      metadata: {
        powerStats: asset.metadata?.powerStats,
        firstAppearance: asset.metadata?.firstAppearance,
        publisher: asset.metadata?.publisher,
        affiliations: asset.metadata?.affiliations,
        universeOrigin: asset.metadata?.universeOrigin,
        comicsAppeared: asset.metadata?.comicsAppeared,
        popularity: asset.metadata?.popularity || 50,
        movieAppearances: asset.metadata?.movieAppearances || 0,
        tvAppearances: asset.metadata?.tvAppearances || 0,
        intelligence: asset.metadata?.powerStats?.intelligence
      },
      historicalPrices: asset.metadata?.historicalPrices || Array.from({ length: 30 }, 
        (_, i) => parseFloat(asset.metadata?.currentPrice || '100') * (0.9 + Math.random() * 0.2)
      ),
      volume24h: asset.metadata?.volume24h || 1000 + Math.random() * 5000,
      marketCap: asset.metadata?.marketCap || 1000000 + Math.random() * 10000000,
      volatility: asset.metadata?.volatility || 0.1 + Math.random() * 0.3
    }));

    // Generate advanced insights
    const insights = await enhancedAiMarketIntelligence.generateAdvancedMarketInsights(
      enhancedAssets,
      user
    );

    // Add IDs and enrich response
    const enrichedInsights = insights.map((insight, index) => ({
      id: `insight_${Date.now()}_${index}`,
      ...insight
    }));

    res.json(enrichedInsights);
  } catch (error) {
    console.error('Advanced Insights Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate advanced insights',
      mysticalMessage: 'The Market Sage\'s wisdom is temporarily veiled by cosmic storms. Please seek guidance again.'
    });
  }
});

// Get Oracle status and persona information
router.get('/oracle-status', async (req, res) => {
  try {
    const user = req.user as User | undefined;
    
    // Generate Oracle status based on user's house and karma
    const oracleStatus = {
      isActive: true,
      powerLevel: user?.karma ? Math.min(Math.abs(user.karma) / 100 + 1, 10) : 1,
      currentPersona: 'Ancient Sage of Market Mysteries',
      houseAffinity: user?.houseId || 'neutral',
      karmaAlignment: {
        lawful_chaotic: parseFloat(user?.lawfulChaoticAlignment?.toString() || '0'),
        good_evil: parseFloat(user?.goodEvilAlignment?.toString() || '0')
      },
      divineEnergy: 85 + Math.random() * 15, // 85-100% energy
      lastProphecy: new Date().toISOString(),
      availableVisions: [
        'Price Prophecies of Sacred Assets',
        'Battle Outcomes of Legendary Heroes',
        'Market Anomalies in the Cosmic Void',
        'Divine Insights for House Members',
        'Karmic Trading Guidance'
      ],
      mysticalMessage: user?.houseId 
        ? `Welcome, noble member of House ${user.houseId.charAt(0).toUpperCase() + user.houseId.slice(1)}. The cosmos aligns to grant you enhanced wisdom.`
        : 'Greetings, seeker of market wisdom. Choose your sacred house to unlock deeper mysteries.',
      cosmicAlignment: 0.7 + Math.random() * 0.3 // 70-100% alignment
    };

    res.json(oracleStatus);
  } catch (error) {
    console.error('Oracle Status Error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve Oracle status',
      mysticalMessage: 'The Oracle\'s presence flickers between dimensions. Please reconnect.'
    });
  }
});

// Generate quick market pulse (for real-time updates)
router.get('/market-pulse', async (req, res) => {
  try {
    console.log('💓 Market Pulse Oracle: Sensing cosmic trading rhythms');

    // Get sample of trending assets
    const assets = await storage.getAssets();
    const sampleAssets = assets.slice(0, 5);

    // Generate quick pulse data
    const marketPulse = {
      timestamp: new Date().toISOString(),
      overallSentiment: ['Bullish Cosmic Energy', 'Neutral Market Balance', 'Bearish Storm Clouds'][Math.floor(Math.random() * 3)],
      energyLevel: 60 + Math.random() * 40, // 60-100% market energy
      activeForces: Math.floor(3 + Math.random() * 7), // 3-10 active forces
      dominantHouse: ['heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'][Math.floor(Math.random() * 7)],
      cosmicEvents: [
        'Mercury in retrograde affecting tech stocks',
        'Solar flare boosting hero valuations',
        'Lunar eclipse causing mystical asset surge',
        'Jupiter alignment favoring long-term investments'
      ],
      quickInsights: [
        {
          type: 'trending',
          message: `${sampleAssets[0]?.name || 'Mystery Asset'} shows divine momentum`,
          urgency: 'medium',
          symbol: '📈'
        },
        {
          type: 'alert',
          message: 'Unusual cosmic activity detected in character battles',
          urgency: 'high',
          symbol: '⚔️'
        },
        {
          type: 'wisdom',
          message: 'The ancient spirits favor long-term vision today',
          urgency: 'low',
          symbol: '🔮'
        }
      ],
      nextMajorEvent: {
        name: 'The Great Cosmic Convergence',
        timeUntil: '3 days, 14 hours',
        impact: 'Major market transformation expected',
        preparation: 'Align portfolios with house specializations'
      }
    };

    res.json(marketPulse);
  } catch (error) {
    console.error('Market Pulse Error:', error);
    res.status(500).json({ 
      error: 'Failed to sense market pulse',
      mysticalMessage: 'The cosmic heartbeat is obscured by dimensional interference.'
    });
  }
});

// Batch battle predictions for popular matchups
router.get('/popular-battles', async (req, res) => {
  try {
    console.log('⚔️ Battle Oracle: Revealing popular legendary matchups');

    // Get character assets
    const characters = await storage.getAssets({ type: 'character' });
    const popularCharacters = characters.slice(0, 8); // Top 8 characters

    // Generate popular battle matchups
    const popularBattles = [];
    
    for (let i = 0; i < Math.min(popularCharacters.length - 1, 4); i++) {
      const char1 = popularCharacters[i];
      const char2 = popularCharacters[i + 1];
      
      if (char1 && char2) {
        const winProbability = 0.3 + Math.random() * 0.4; // 30-70% range
        const marketImpact = 0.02 + Math.random() * 0.08; // 2-10% impact
        
        popularBattles.push({
          battleId: `popular_battle_${char1.id}_${char2.id}`,
          character1: {
            id: char1.id,
            name: char1.name,
            imageUrl: char1.imageUrl,
            powerLevel: 70 + Math.random() * 30
          },
          character2: {
            id: char2.id,
            name: char2.name,
            imageUrl: char2.imageUrl,
            powerLevel: 70 + Math.random() * 30
          },
          battleType: ['power_clash', 'strategy_battle', 'moral_conflict'][Math.floor(Math.random() * 3)],
          winProbability,
          reasoning: `Epic clash between ${char1.name} and ${char2.name} based on power analysis and cosmic alignment.`,
          mysticalProphecy: `In the realm of eternal struggle, ${winProbability > 0.5 ? char1.name : char2.name} shall emerge victorious through divine favor.`,
          marketImpact,
          confidence: 0.75 + Math.random() * 0.2,
          expectedDuration: ['Swift cosmic victory', 'Extended legendary battle', 'Epic struggle of ages'][Math.floor(Math.random() * 3)],
          keyFactors: ['Power level differential', 'Universe familiarity', 'Cosmic alignment'],
          houseAdvantages: {
            heroes: 0.1,
            power: 0.15,
            wisdom: 0.08
          },
          popularity: 80 + Math.random() * 20,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    res.json(popularBattles);
  } catch (error) {
    console.error('Popular Battles Error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve popular battles',
      mysticalMessage: 'The Battle Oracle\'s visions of popular clashes are temporarily obscured.'
    });
  }
});

export default router;