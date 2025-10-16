"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coverOrchestratorService_1 = require("../services/coverOrchestratorService");
const router = (0, express_1.Router)();
// Get character's first appearance cover
router.get('/character/:name/first-appearance', async (req, res) => {
    try {
        const { name } = req.params;
        const cover = await coverOrchestratorService_1.coverOrchestrator.getCharacterFirstAppearance(name);
        if (!cover) {
            return res.status(404).json({ error: 'No first appearance cover found for this character' });
        }
        res.json(cover);
    }
    catch (error) {
        console.error('Error fetching first appearance cover:', error);
        res.status(500).json({ error: 'Failed to fetch first appearance cover' });
    }
});
// Get all covers featuring a character
router.get('/character/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const covers = await coverOrchestratorService_1.coverOrchestrator.getCharacterCovers(name, limit);
        res.json(covers);
    }
    catch (error) {
        console.error('Error fetching character covers:', error);
        res.status(500).json({ error: 'Failed to fetch character covers' });
    }
});
// Get key issues by significance tier
router.get('/key-issues', async (req, res) => {
    try {
        const publisher = req.query.publisher;
        const tier = req.query.tier ? parseInt(req.query.tier) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const covers = await coverOrchestratorService_1.coverOrchestrator.getKeyIssues(publisher, tier, limit);
        res.json(covers);
    }
    catch (error) {
        console.error('Error fetching key issues:', error);
        res.status(500).json({ error: 'Failed to fetch key issues' });
    }
});
// Get covers for a series
router.get('/series/:series', async (req, res) => {
    try {
        const { series } = req.params;
        const volumeYear = req.query.volumeYear ? parseInt(req.query.volumeYear) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        const covers = await coverOrchestratorService_1.coverOrchestrator.getSeriesCovers(series, volumeYear, limit);
        res.json(covers);
    }
    catch (error) {
        console.error('Error fetching series covers:', error);
        res.status(500).json({ error: 'Failed to fetch series covers' });
    }
});
// Get covers by tags
router.get('/tags', async (req, res) => {
    try {
        const tags = req.query.tags?.split(',') || [];
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        if (tags.length === 0) {
            return res.status(400).json({ error: 'No tags provided' });
        }
        const covers = await coverOrchestratorService_1.coverOrchestrator.getCoversByTag(tags, limit);
        res.json(covers);
    }
    catch (error) {
        console.error('Error fetching covers by tags:', error);
        res.status(500).json({ error: 'Failed to fetch covers by tags' });
    }
});
// Advanced search with multiple filters
router.post('/search', async (req, res) => {
    try {
        const covers = await coverOrchestratorService_1.coverOrchestrator.searchCovers(req.body);
        res.json(covers);
    }
    catch (error) {
        console.error('Error searching covers:', error);
        res.status(500).json({ error: 'Failed to search covers' });
    }
});
// Get cover statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await coverOrchestratorService_1.coverOrchestrator.getCoverStats();
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching cover stats:', error);
        res.status(500).json({ error: 'Failed to fetch cover stats' });
    }
});
// Get cover by ID
router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cover = await coverOrchestratorService_1.coverOrchestrator.getCoverById(id);
        if (!cover) {
            return res.status(404).json({ error: 'Cover not found' });
        }
        res.json(cover);
    }
    catch (error) {
        console.error('Error fetching cover by ID:', error);
        res.status(500).json({ error: 'Failed to fetch cover' });
    }
});
// Get specific issue cover
router.get('/issue', async (req, res) => {
    try {
        const { publisher, series, issueNumber, volumeYear, variant } = req.query;
        if (!publisher || !series || !issueNumber) {
            return res.status(400).json({
                error: 'Missing required parameters: publisher, series, issueNumber'
            });
        }
        const cover = await coverOrchestratorService_1.coverOrchestrator.getCoverByIssue(publisher, series, issueNumber, volumeYear ? parseInt(volumeYear) : undefined, variant || 'regular');
        if (!cover) {
            return res.status(404).json({ error: 'Cover not found for this issue' });
        }
        res.json(cover);
    }
    catch (error) {
        console.error('Error fetching issue cover:', error);
        res.status(500).json({ error: 'Failed to fetch issue cover' });
    }
});
// Get highest graded cover for an issue
router.get('/issue/highest-grade', async (req, res) => {
    try {
        const { publisher, series, issueNumber, volumeYear } = req.query;
        if (!publisher || !series || !issueNumber) {
            return res.status(400).json({
                error: 'Missing required parameters: publisher, series, issueNumber'
            });
        }
        const cover = await coverOrchestratorService_1.coverOrchestrator.getHighestGradedCover(publisher, series, issueNumber, volumeYear ? parseInt(volumeYear) : undefined);
        if (!cover) {
            return res.status(404).json({ error: 'No graded cover found for this issue' });
        }
        res.json(cover);
    }
    catch (error) {
        console.error('Error fetching highest graded cover:', error);
        res.status(500).json({ error: 'Failed to fetch highest graded cover' });
    }
});
// Get recently collected covers
router.get('/recent', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const covers = await coverOrchestratorService_1.coverOrchestrator.getRecentlyCollected(limit);
        res.json(covers);
    }
    catch (error) {
        console.error('Error fetching recent covers:', error);
        res.status(500).json({ error: 'Failed to fetch recent covers' });
    }
});
exports.default = router;
