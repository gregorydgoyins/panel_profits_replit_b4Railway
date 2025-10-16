"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEVEN_HOUSES_CONFIG = void 0;
const express_1 = require("express");
const replitAuth_js_1 = require("../replitAuth.js");
const storage_js_1 = require("../storage.js");
const router = (0, express_1.Router)();
// Seven Houses of Paneltown Configuration
exports.SEVEN_HOUSES_CONFIG = [
    {
        id: 'sequential-securities',
        name: 'Sequential Securities',
        description: 'The publishers and series syndicate - controlling the flow of storylines',
        color: '#DC2626',
        symbol: 'briefcase',
        specialization: 'Publishers/Series',
        reputationScore: 100,
        powerLevel: 85,
        marketInfluence: 0.18,
        narrativeWeight: 0.15
    },
    {
        id: 'ink-blood-syndicate',
        name: 'Ink & Blood Syndicate',
        description: 'Dark dealers in anti-heroes and villains - where morality has a price',
        color: '#7C3AED',
        symbol: 'droplets',
        specialization: 'Anti-heroes/Villains',
        reputationScore: 100,
        powerLevel: 90,
        marketInfluence: 0.20,
        narrativeWeight: 0.25
    },
    {
        id: 'heroic-trust',
        name: 'The Heroic Trust',
        description: 'Guardians of classic heroes and teams - the old guard of justice',
        color: '#2563EB',
        symbol: 'shield',
        specialization: 'Heroes/Teams',
        reputationScore: 100,
        powerLevel: 88,
        marketInfluence: 0.16,
        narrativeWeight: 0.18
    },
    {
        id: 'narrative-capital',
        name: 'Narrative Capital',
        description: 'The scribes of power - trading in writers and storylines',
        color: '#059669',
        symbol: 'book-open',
        specialization: 'Writers/Storylines',
        reputationScore: 100,
        powerLevel: 75,
        marketInfluence: 0.14,
        narrativeWeight: 0.30
    },
    {
        id: 'visual-holdings',
        name: 'Visual Holdings',
        description: 'Masters of the artistic market - where imagery becomes currency',
        color: '#EA580C',
        symbol: 'palette',
        specialization: 'Artists/Artwork',
        reputationScore: 100,
        powerLevel: 70,
        marketInfluence: 0.12,
        narrativeWeight: 0.10
    },
    {
        id: 'vigilante-exchange',
        name: 'The Vigilante Exchange',
        description: 'Street-level justice has its price - the underground market',
        color: '#64748B',
        symbol: 'eye',
        specialization: 'Street-level Heroes',
        reputationScore: 100,
        powerLevel: 65,
        marketInfluence: 0.10,
        narrativeWeight: 0.20
    },
    {
        id: 'crossover-consortium',
        name: 'Crossover Consortium',
        description: 'Reality brokers - dealing in multiverse events and crossovers',
        color: '#BE185D',
        symbol: 'globe',
        specialization: 'Multiverse/Crossovers',
        reputationScore: 100,
        powerLevel: 95,
        marketInfluence: 0.10,
        narrativeWeight: 0.35
    }
];
// Get all Seven Houses
router.get('/api/seven-houses', async (req, res) => {
    try {
        const houses = await storage_js_1.storage.getAllHouses();
        // If no houses in DB, seed them
        if (!houses || houses.length === 0) {
            const seededHouses = [];
            for (const houseConfig of exports.SEVEN_HOUSES_CONFIG) {
                const house = await storage_js_1.storage.createHouse({
                    id: houseConfig.id,
                    name: houseConfig.name,
                    description: houseConfig.description,
                    color: houseConfig.color,
                    symbol: houseConfig.symbol,
                    specialization: houseConfig.specialization,
                    reputationScore: houseConfig.reputationScore,
                    powerLevel: houseConfig.powerLevel,
                    totalMarketCap: 0,
                    totalVolume24h: 0,
                    memberCount: 0,
                    averageAssetPrice: 0,
                    dominancePercentage: 0
                });
                seededHouses.push(house);
            }
            return res.json(seededHouses);
        }
        res.json(houses);
    }
    catch (error) {
        console.error('Error fetching houses:', error);
        res.status(500).json({ error: 'Failed to fetch houses' });
    }
});
// Get single house by ID
router.get('/api/seven-houses/:houseId', async (req, res) => {
    try {
        const house = await storage_js_1.storage.getHouse(req.params.houseId);
        if (!house) {
            return res.status(404).json({ error: 'House not found' });
        }
        res.json(house);
    }
    catch (error) {
        console.error('Error fetching house:', error);
        res.status(500).json({ error: 'Failed to fetch house' });
    }
});
// Get house power rankings
router.get('/api/seven-houses/rankings/power', async (req, res) => {
    try {
        const rankings = await storage_js_1.storage.getHousePowerRankings();
        res.json(rankings);
    }
    catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({ error: 'Failed to fetch power rankings' });
    }
});
// Update house power rankings (admin only)
router.post('/api/seven-houses/rankings/update', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const { houseId, changeAmount, reason } = req.body;
        // Validate input
        if (!houseId || typeof changeAmount !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const ranking = await storage_js_1.storage.updateHousePowerRanking(houseId, changeAmount, reason);
        res.json(ranking);
    }
    catch (error) {
        console.error('Error updating rankings:', error);
        res.status(500).json({ error: 'Failed to update power rankings' });
    }
});
// Get house market events
router.get('/api/seven-houses/events', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const events = await storage_js_1.storage.getHouseMarketEvents(limit);
        res.json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch market events' });
    }
});
// Create house market event
router.post('/api/seven-houses/events', replitAuth_js_1.isAuthenticated, async (req, res) => {
    try {
        const { affectedHouseId, eventType, description, marketImpact } = req.body;
        if (!affectedHouseId || !eventType || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const event = await storage_js_1.storage.createHouseMarketEvent({
            affectedHouseId,
            eventType,
            description,
            marketImpact: marketImpact || 0,
            powerShift: 0,
            volumeChange: 0
        });
        res.json(event);
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create market event' });
    }
});
// Get assets by house
router.get('/api/seven-houses/:houseId/assets', async (req, res) => {
    try {
        const assets = await storage_js_1.storage.getAssetsByHouse(req.params.houseId);
        res.json(assets);
    }
    catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: 'Failed to fetch house assets' });
    }
});
// Get house statistics
router.get('/api/seven-houses/:houseId/stats', async (req, res) => {
    try {
        const stats = await storage_js_1.storage.getHouseStatistics(req.params.houseId);
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch house statistics' });
    }
});
exports.default = router;
