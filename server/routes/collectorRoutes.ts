import express from 'express';
import { z } from 'zod';
import { storage } from '../storage.js';
import { GradingEvaluationService } from '../services/gradingEvaluationService.js';
import { VariantRegistryService } from '../services/variantRegistry.js';
import { isAuthenticated } from '../replitAuth.js';
import {
  insertGradedAssetProfileSchema,
  insertVariantCoverRegistrySchema,
  insertCollectionStorageBoxSchema
} from '../../shared/schema.js';

const router = express.Router();
const gradingService = new GradingEvaluationService(storage);
const variantService = new VariantRegistryService(storage);

// =============================================================================
// GRADING EVALUATION ROUTES
// =============================================================================

// Perform grading assessment for an asset
router.post('/grading/assess', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const assessmentSchema = z.object({
      assetId: z.string(),
      gradingCriteria: z.object({
        condition: z.number().min(0.5).max(10.0),
        centering: z.number().min(0.5).max(10.0),
        corners: z.number().min(0.5).max(10.0),
        edges: z.number().min(0.5).max(10.0),
        surface: z.number().min(0.5).max(10.0)
      }),
      certificationAuthority: z.string().optional(),
      additionalNotes: z.string().optional()
    });

    const validatedData = assessmentSchema.parse(req.body);
    
    // Perform grading assessment
    const gradingAssessment = await gradingService.performGradingAssessment(
      validatedData.assetId,
      validatedData.gradingCriteria,
      validatedData.certificationAuthority,
      validatedData.additionalNotes
    );

    // Calculate rarity analysis
    const rarityAnalysis = await gradingService.calculateRarityAnalysis(
      validatedData.assetId
    );

    res.json({
      success: true,
      gradingAssessment,
      rarityAnalysis
    });
  } catch (error) {
    console.error('Grading assessment error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid grading data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to perform grading assessment' });
  }
});

// Create graded asset profile
router.post('/grading/profiles', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = insertGradedAssetProfileSchema.parse({
      ...req.body,
      userId,
      acquisitionDate: new Date(req.body.acquisitionDate)
    });
    
    const gradedProfile = await storage.createGradedAssetProfile(validatedData);
    
    res.status(201).json({
      success: true,
      gradedProfile
    });
  } catch (error) {
    console.error('Create graded profile error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid profile data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create graded asset profile' });
  }
});

// Get user's graded asset profiles
router.get('/grading/profiles', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { rarity, storageType, sortBy } = req.query;
    
    const profiles = await storage.getUserGradedAssetProfiles(userId, {
      rarityFilter: rarity as string,
      storageTypeFilter: storageType as string,
      sortBy: sortBy as string
    });
    
    res.json({
      success: true,
      profiles
    });
  } catch (error) {
    console.error('Get graded profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch graded profiles' });
  }
});

// Get variants for a base asset
router.get('/variants/discover/:baseAssetId', async (req, res) => {
  try {
    const variantDiscovery = await variantService.discoverVariants(req.params.baseAssetId);
    
    res.json({
      success: true,
      ...variantDiscovery
    });
  } catch (error) {
    console.error('Variant discovery error:', error);
    res.status(500).json({ error: 'Failed to discover variants' });
  }
});

// Generate trading card data for variant
router.get('/variants/:id/trading-card', async (req, res) => {
  try {
    const tradingCardData = await variantService.generateTradingCardData(req.params.id);
    
    res.json({
      success: true,
      tradingCard: tradingCardData
    });
  } catch (error) {
    console.error('Trading card generation error:', error);
    res.status(500).json({ error: 'Failed to generate trading card data' });
  }
});

// Get collection analytics overview
router.get('/analytics/overview', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const analytics = await storage.getCollectionAnalytics(userId);
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Collection analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch collection analytics' });
  }
});

// =============================================================================
// COLLECTOR VAULT ROUTES
// =============================================================================

// Get user's collector vault with all graded assets
router.get('/vault', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { rarity, storageType, sortBy } = req.query;
    
    const gradedProfiles = await storage.getUserGradedAssetProfiles(userId, {
      rarityFilter: rarity as string,
      storageTypeFilter: storageType as string,
      sortBy: sortBy as string
    });
    
    const storageBoxes = await storage.getCollectionStorageBoxes(userId);
    const analytics = await storage.getCollectionAnalytics(userId);
    
    res.json({
      success: true,
      vault: {
        gradedProfiles,
        storageBoxes,
        analytics
      }
    });
  } catch (error) {
    console.error('Collector vault error:', error);
    res.status(500).json({ error: 'Failed to fetch collector vault' });
  }
});

// =============================================================================
// COLLECTION STORAGE BOX ROUTES
// =============================================================================

// Get user's storage boxes
router.get('/storage/boxes', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const storageBoxes = await storage.getCollectionStorageBoxes(userId);
    
    res.json({
      success: true,
      storageBoxes
    });
  } catch (error) {
    console.error('Storage boxes error:', error);
    res.status(500).json({ error: 'Failed to fetch storage boxes' });
  }
});

// Create new storage box
router.post('/storage/boxes', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = insertCollectionStorageBoxSchema.parse({
      ...req.body,
      userId
    });
    
    const storageBox = await storage.createCollectionStorageBox(validatedData);
    
    res.status(201).json({
      success: true,
      storageBox
    });
  } catch (error) {
    console.error('Create storage box error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid storage box data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create storage box' });
  }
});

// Update storage box
router.patch('/storage/boxes/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const updates = insertCollectionStorageBoxSchema.partial().parse(req.body);
    
    // CRITICAL SECURITY: Pass userId to ensure users can only update their own storage boxes
    const storageBox = await storage.updateCollectionStorageBox(req.params.id, updates, userId);
    
    if (!storageBox) {
      return res.status(404).json({ error: 'Storage box not found or not authorized' });
    }
    
    res.json({
      success: true,
      storageBox
    });
  } catch (error) {
    console.error('Update storage box error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid storage box data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update storage box' });
  }
});

// =============================================================================
// VARIANT REGISTRY ROUTES
// =============================================================================

// Search variants by criteria
router.get('/variants/search', async (req, res) => {
  try {
    const { variantType, coverArtist, publisher, minRarity, maxPrice, hasSpecialFeatures } = req.query;
    
    const variants = await storage.searchVariantCovers({
      variantType: variantType as string,
      coverArtist: coverArtist as string,
      publisher: publisher as string,
      minRarity: minRarity as string,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined
    });
    
    res.json({
      success: true,
      variants
    });
  } catch (error) {
    console.error('Variant search error:', error);
    res.status(500).json({ error: 'Failed to search variants' });
  }
});

// Get variant market trends
router.get('/variants/:id/trends', async (req, res) => {
  try {
    const { timeframe = '3m' } = req.query;
    const variantId = req.params.id;
    
    // For now, return mock trends data
    // In a real implementation, this would fetch actual market data
    const trends = {
      priceHistory: [],
      trendAnalysis: {
        direction: 'stable' as const,
        changePercent: 0,
        volatility: 0,
        momentum: 0
      }
    };
    
    res.json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Variant trends error:', error);
    res.status(500).json({ error: 'Failed to fetch variant trends' });
  }
});

// Catalog new variant
router.post('/variants/catalog', isAuthenticated, async (req: any, res) => {
  try {
    const validatedData = insertVariantCoverRegistrySchema.parse(req.body);
    const variant = await storage.createVariantCover(validatedData);
    
    res.status(201).json({
      success: true,
      variant
    });
  } catch (error) {
    console.error('Catalog variant error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid variant data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to catalog variant' });
  }
});

export default router;