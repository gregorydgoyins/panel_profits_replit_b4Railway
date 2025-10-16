"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storage_js_1 = require("../storage.js");
const vectorEmbeddingService_js_1 = require("../services/vectorEmbeddingService.js");
const router = express_1.default.Router();
/**
 * Vector-Powered API Routes for Panel Profits AI
 * Provides semantic search, visual similarity, and intelligent recommendations
 */
// Asset Recommendation Engine - "Comics You Might Like"
router.get('/assets/:assetId/similar', async (req, res) => {
    try {
        const { assetId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const threshold = parseFloat(req.query.threshold) || 0.7;
        console.log(`🔮 Finding similar assets for: ${assetId}`);
        const similarAssets = await storage_js_1.storage.findSimilarAssets(assetId, limit, threshold);
        console.log(`🔮 Found ${similarAssets.length} similar assets`);
        res.json({
            success: true,
            assetId,
            similarAssets: similarAssets.map(asset => ({
                ...asset,
                similarityScore: Math.round(asset.similarityScore * 100) / 100
            })),
            count: similarAssets.length
        });
    }
    catch (error) {
        console.error('🚨 Asset similarity search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find similar assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Generate asset recommendations for user
router.get('/recommendations/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        console.log(`🎯 Generating recommendations for user: ${userId}`);
        const result = await storage_js_1.storage.getRecommendationsForUser(userId, limit);
        console.log(`🎯 Generated ${result?.recommendations?.length} recommendations`);
        if (result.success) {
            res.json({
                ...result,
                recommendations: result.recommendations.map(rec => ({
                    ...rec,
                    recommendationScore: Math.round(rec.recommendationScore * 100) / 100
                }))
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to generate recommendations',
                message: 'No recommendations available'
            });
        }
    }
    catch (error) {
        console.error('🚨 User recommendations error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate recommendations',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Portfolio-based asset recommendations
router.get('/recommendations/portfolio/:portfolioId', async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        console.log(`📊 Finding portfolio-similar assets for: ${portfolioId}`);
        const result = await storage_js_1.storage.getPortfolioSimilarAssets(portfolioId, limit);
        console.log(`📊 Found ${result?.similarAssets?.length} portfolio-similar assets`);
        if (result.success) {
            res.json({
                ...result,
                similarAssets: result.similarAssets.map(asset => ({
                    ...asset,
                    similarityScore: Math.round(asset.similarityScore * 100) / 100,
                    portfolioWeight: Math.round(asset.portfolioWeight * 100) / 100
                }))
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to find portfolio-similar assets',
                message: 'No similar assets available'
            });
        }
    }
    catch (error) {
        console.error('🚨 Portfolio similarity error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find portfolio-similar assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Comic Visual Similarity Engine - "Find Similar Comics"
router.get('/comics/:gradingId/similar', async (req, res) => {
    try {
        const { gradingId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const threshold = parseFloat(req.query.threshold) || 0.7;
        console.log(`🎨 Finding visually similar comics for: ${gradingId}`);
        const similarComics = await storage_js_1.storage.findSimilarComicsByImage(gradingId, limit, threshold);
        console.log(`🎨 Found ${similarComics.length} visually similar comics`);
        res.json({
            success: true,
            gradingId,
            similarComics: similarComics.map(comic => ({
                ...comic,
                similarityScore: Math.round(comic.similarityScore * 100) / 100
            })),
            count: similarComics.length
        });
    }
    catch (error) {
        console.error('🚨 Comic visual similarity error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find similar comics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Market Insight Semantic Search
router.get('/insights/search', async (req, res) => {
    try {
        const query = req.query.q;
        const limit = parseInt(req.query.limit) || 10;
        const threshold = parseFloat(req.query.threshold) || 0.6;
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required',
                message: 'Please provide a search query parameter (q)'
            });
        }
        console.log(`🔍 Semantic search for insights: "${query}"`);
        const searchResults = await storage_js_1.storage.searchMarketInsightsByContent(query, limit, threshold);
        console.log(`🔍 Found ${searchResults.length} relevant insights`);
        res.json({
            success: true,
            query,
            insights: searchResults.map(insight => ({
                ...insight,
                similarityScore: Math.round(insight.similarityScore * 100) / 100
            })),
            count: searchResults.length
        });
    }
    catch (error) {
        console.error('🚨 Market insight search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search market insights',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Find similar market insights
router.get('/insights/:insightId/similar', async (req, res) => {
    try {
        const { insightId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const threshold = parseFloat(req.query.threshold) || 0.7;
        console.log(`📈 Finding similar market insights for: ${insightId}`);
        const similarInsights = await storage_js_1.storage.findSimilarMarketInsights(insightId, limit, threshold);
        console.log(`📈 Found ${similarInsights.length} similar insights`);
        res.json({
            success: true,
            insightId,
            similarInsights: similarInsights.map(insight => ({
                ...insight,
                similarityScore: Math.round(insight.similarityScore * 100) / 100
            })),
            count: similarInsights.length
        });
    }
    catch (error) {
        console.error('🚨 Similar insights error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find similar insights',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Price Pattern Recognition - Similar Price Movements
router.get('/patterns/:assetId/similar', async (req, res) => {
    try {
        const { assetId } = req.params;
        const timeframe = req.query.timeframe || '1d';
        const limit = parseInt(req.query.limit) || 10;
        const threshold = parseFloat(req.query.threshold) || 0.7;
        console.log(`📊 Finding similar price patterns for: ${assetId} (${timeframe})`);
        const similarPatterns = await storage_js_1.storage.findSimilarPricePatterns(assetId, timeframe, limit, threshold);
        console.log(`📊 Found ${similarPatterns.length} similar price patterns`);
        res.json({
            success: true,
            assetId,
            timeframe,
            similarPatterns: similarPatterns.map(pattern => ({
                ...pattern,
                similarityScore: Math.round(pattern.similarityScore * 100) / 100
            })),
            count: similarPatterns.length
        });
    }
    catch (error) {
        console.error('🚨 Price pattern search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to find similar price patterns',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Enhanced Asset Search with Vector Similarity
router.get('/assets/search', async (req, res) => {
    try {
        const query = req.query.q;
        const type = req.query.type;
        const publisher = req.query.publisher;
        const limit = parseInt(req.query.limit) || 20;
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required',
                message: 'Please provide a search query parameter (q)'
            });
        }
        console.log(`🔍 Enhanced asset search: "${query}"`);
        const searchResults = await storage_js_1.storage.searchAssetsWithSimilarity(query, { type, publisher }, limit);
        console.log(`🔍 Found ${searchResults.length} assets with enhanced search`);
        res.json({
            success: true,
            query,
            filters: { type, publisher },
            assets: searchResults.map(asset => ({
                ...asset,
                similarityScore: asset.similarityScore ? Math.round(asset.similarityScore * 100) / 100 : undefined,
                searchScore: Math.round(asset.searchScore * 100) / 100
            })),
            count: searchResults.length
        });
    }
    catch (error) {
        console.error('🚨 Enhanced asset search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Frontend-Compatible Asset Search (POST /search/assets)
router.post('/search/assets', async (req, res) => {
    try {
        const { query, assetType, publisher, limit } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required',
                message: 'Please provide a search query in the request body'
            });
        }
        console.log(`🔍 Vector asset search: "${query}" (type: ${assetType}, publisher: ${publisher})`);
        const searchResults = await storage_js_1.storage.searchAssetsWithSimilarity(query, { type: assetType, publisher }, limit || 10);
        console.log(`🔍 Found ${searchResults.length} assets with vector search`);
        res.json({
            success: true,
            query,
            results: searchResults.map(asset => ({
                ...asset,
                similarityScore: asset.similarityScore ? Math.round(asset.similarityScore * 100) / 100 : undefined,
                searchScore: Math.round(asset.searchScore * 100) / 100
            })),
            count: searchResults.length
        });
    }
    catch (error) {
        console.error('🚨 Vector asset search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Generate and update embeddings for assets
router.post('/embeddings/assets/:assetId', async (req, res) => {
    try {
        const { assetId } = req.params;
        console.log(`🔮 Generating embedding for asset: ${assetId}`);
        // Get asset data
        const asset = await storage_js_1.storage.getAsset(assetId);
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found',
                message: `Asset with id ${assetId} does not exist`
            });
        }
        // Generate embedding
        const embeddingResult = await vectorEmbeddingService_js_1.vectorEmbeddingService.generateAssetMetadataEmbedding({
            name: asset.name,
            type: asset.type,
            description: asset.description || undefined,
            publisher: asset.metadata?.publisher || undefined,
            yearPublished: asset.metadata?.yearPublished || undefined,
            category: asset.metadata?.category || undefined,
            tags: asset.metadata?.tags || undefined
        });
        if (!embeddingResult) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate embedding',
                message: 'Vector embedding service unavailable'
            });
        }
        // Update asset with embedding
        const updated = await storage_js_1.storage.updateAssetEmbedding(assetId, embeddingResult.embedding);
        console.log(`🔮 Updated asset embedding: ${assetId}`);
        res.json({
            success: true,
            assetId,
            embeddingGenerated: true,
            dimensions: embeddingResult.dimensions,
            model: embeddingResult.model,
            updated
        });
    }
    catch (error) {
        console.error('🚨 Asset embedding generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate asset embedding',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Generate embeddings for comic grading images
router.post('/embeddings/comics/:gradingId', async (req, res) => {
    try {
        const { gradingId } = req.params;
        const { imageData } = req.body;
        if (!imageData) {
            return res.status(400).json({
                success: false,
                error: 'Image data is required',
                message: 'Please provide base64 image data in request body'
            });
        }
        console.log(`🎨 Generating image embedding for comic: ${gradingId}`);
        // Get comic grading data
        const grading = await storage_js_1.storage.getComicGradingPrediction(gradingId);
        if (!grading) {
            return res.status(404).json({
                success: false,
                error: 'Comic grading not found',
                message: `Grading with id ${gradingId} does not exist`
            });
        }
        // Generate image embedding
        const embeddingResult = await vectorEmbeddingService_js_1.vectorEmbeddingService.generateComicImageEmbedding(imageData, grading.imageName || undefined);
        if (!embeddingResult) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate image embedding',
                message: 'Vector embedding service unavailable'
            });
        }
        // Update comic with embedding
        const updated = await storage_js_1.storage.updateComicImageEmbedding(gradingId, embeddingResult.embedding);
        console.log(`🎨 Updated comic image embedding: ${gradingId}`);
        res.json({
            success: true,
            gradingId,
            embeddingGenerated: true,
            dimensions: embeddingResult.dimensions,
            model: embeddingResult.model,
            updated
        });
    }
    catch (error) {
        console.error('🚨 Comic embedding generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate comic embedding',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Vector index management
router.post('/indices/create', async (req, res) => {
    try {
        console.log('🏗️ Creating vector indices...');
        const created = await storage_js_1.storage.createVectorIndices();
        console.log(`🏗️ Vector indices creation: ${created ? 'successful' : 'failed'}`);
        res.json({
            success: created,
            message: created ? 'Vector indices created successfully' : 'Failed to create vector indices'
        });
    }
    catch (error) {
        console.error('🚨 Vector index creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create vector indices',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/indices/refresh', async (req, res) => {
    try {
        console.log('🔄 Refreshing vector indices...');
        const refreshed = await storage_js_1.storage.refreshVectorIndices();
        console.log(`🔄 Vector indices refresh: ${refreshed ? 'successful' : 'failed'}`);
        res.json({
            success: refreshed,
            message: refreshed ? 'Vector indices refreshed successfully' : 'Failed to refresh vector indices'
        });
    }
    catch (error) {
        console.error('🚨 Vector index refresh error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to refresh vector indices',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/indices/status', async (req, res) => {
    try {
        console.log('📊 Checking vector index status...');
        const indexStatus = await storage_js_1.storage.getVectorIndexStatus();
        console.log(`📊 Retrieved status for ${indexStatus.length} vector indices`);
        res.json({
            success: true,
            indices: indexStatus,
            count: indexStatus.length
        });
    }
    catch (error) {
        console.error('🚨 Vector index status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get vector index status',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Service status and configuration
router.get('/status', async (req, res) => {
    try {
        const serviceStatus = vectorEmbeddingService_js_1.vectorEmbeddingService.getServiceStatus();
        res.json({
            success: true,
            vectorEmbeddingService: serviceStatus,
            endpoints: {
                assetSimilarity: '/api/vectors/assets/:assetId/similar',
                comicSimilarity: '/api/vectors/comics/:gradingId/similar',
                insightSearch: '/api/vectors/insights/search',
                patternRecognition: '/api/vectors/patterns/:assetId/similar',
                recommendations: '/api/vectors/recommendations/user/:userId',
                enhancedSearch: '/api/vectors/assets/search'
            }
        });
    }
    catch (error) {
        console.error('🚨 Vector service status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get service status',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
