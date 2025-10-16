"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comicDataService_js_1 = require("../services/comicDataService.js");
const marketPricingService_js_1 = require("../services/marketPricingService.js");
const router = (0, express_1.Router)();
// Get trading assets generated from real comic data with market pricing
router.get('/trading-assets', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 500;
        console.log(`Generating ${limit} trading assets with real market pricing...`);
        const assets = await marketPricingService_js_1.marketPricingService.generateTradingAssetsWithPricing(limit);
        res.json({
            success: true,
            count: assets.length,
            data: assets,
            meta: {
                pricingModel: 'real-market-data',
                sources: ['heritage-auctions', 'significance-based', 'market-sentiment'],
                lastUpdated: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error generating trading assets with pricing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate trading assets with market pricing',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Legacy endpoint for basic comic data without advanced pricing
router.get('/trading-assets-basic', async (req, res) => {
    try {
        console.log('Generating basic trading assets from comic APIs...');
        const assets = await comicDataService_js_1.comicDataService.generateTradingAssets();
        res.json({
            success: true,
            count: assets.length,
            data: assets
        });
    }
    catch (error) {
        console.error('Error generating basic trading assets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate basic trading assets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get Marvel characters
router.get('/marvel/characters', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const characters = await comicDataService_js_1.comicDataService.fetchMarvelCharacters(limit, offset);
        res.json({
            success: true,
            count: characters.length,
            data: characters
        });
    }
    catch (error) {
        console.error('Error fetching Marvel characters:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Marvel characters',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get Marvel comics
router.get('/marvel/comics', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const comics = await comicDataService_js_1.comicDataService.fetchMarvelComics(limit, offset);
        res.json({
            success: true,
            count: comics.length,
            data: comics
        });
    }
    catch (error) {
        console.error('Error fetching Marvel comics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Marvel comics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Search superhero data
router.get('/superhero/search/:name', async (req, res) => {
    try {
        const characterName = req.params.name;
        const superHero = await comicDataService_js_1.comicDataService.fetchSuperHero(characterName);
        if (superHero) {
            res.json({
                success: true,
                data: superHero
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
    }
    catch (error) {
        console.error('Error searching superhero:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search superhero',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get Comic Vine volumes
router.get('/comicvine/volumes', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const volumes = await comicDataService_js_1.comicDataService.fetchComicVineVolumes(limit, offset);
        res.json({
            success: true,
            count: volumes.length,
            data: volumes
        });
    }
    catch (error) {
        console.error('Error fetching Comic Vine volumes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Comic Vine volumes',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Search Comic Vine character
router.get('/comicvine/search/:name', async (req, res) => {
    try {
        const characterName = req.params.name;
        const character = await comicDataService_js_1.comicDataService.searchComicVineCharacter(characterName);
        if (character) {
            res.json({
                success: true,
                data: character
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Character not found'
            });
        }
    }
    catch (error) {
        console.error('Error searching Comic Vine character:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search Comic Vine character',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
