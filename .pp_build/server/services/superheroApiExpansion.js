"use strict";
/**
 * Superhero API Expansion Service
 * Scrapes character data from superheroapi.com to expand tradeable assets
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperheroApiExpansionService = void 0;
const storage_js_1 = require("../storage.js");
const SUPERHERO_API_BASE = 'https://superheroapi.com/api';
const API_TOKEN = process.env.SUPERHERO_API_TOKEN;
class SuperheroApiExpansionService {
    /**
     * Fetch character by ID
     */
    static async fetchCharacterById(id) {
        if (!API_TOKEN) {
            console.error('SUPERHERO_API_TOKEN not configured');
            return null;
        }
        try {
            const response = await fetch(`${SUPERHERO_API_BASE}/${API_TOKEN}/${id}`);
            if (!response.ok) {
                console.error(`Failed to fetch character ${id}:`, response.status);
                return null;
            }
            const data = await response.json();
            if (data.response === 'error') {
                return null; // Character doesn't exist
            }
            return data;
        }
        catch (error) {
            console.error(`Error fetching character ${id}:`, error);
            return null;
        }
    }
    /**
     * Search characters by name
     */
    static async searchCharacter(name) {
        if (!API_TOKEN) {
            console.error('SUPERHERO_API_TOKEN not configured');
            return [];
        }
        try {
            const response = await fetch(`${SUPERHERO_API_BASE}/${API_TOKEN}/search/${encodeURIComponent(name)}`);
            if (!response.ok) {
                console.error(`Failed to search for "${name}":`, response.status);
                return [];
            }
            const data = await response.json();
            if (data.response === 'error' || !data.results) {
                return [];
            }
            return data.results;
        }
        catch (error) {
            console.error(`Error searching for "${name}":`, error);
            return [];
        }
    }
    /**
     * Expand database with all Superhero API characters (IDs 1-731)
     */
    static async expandAll() {
        console.log('🦸 Starting Superhero API expansion...');
        let processed = 0;
        let created = 0;
        let skipped = 0;
        let errors = 0;
        const MAX_ID = 731; // Superhero API has ~731 characters
        const BATCH_SIZE = 10; // Process 10 at a time to respect rate limits
        for (let startId = 1; startId <= MAX_ID; startId += BATCH_SIZE) {
            const endId = Math.min(startId + BATCH_SIZE - 1, MAX_ID);
            const promises = [];
            for (let id = startId; id <= endId; id++) {
                promises.push(this.processCharacter(id));
            }
            const results = await Promise.all(promises);
            results.forEach(result => {
                if (result === 'created')
                    created++;
                else if (result === 'skipped')
                    skipped++;
                else if (result === 'error')
                    errors++;
                processed++;
            });
            console.log(`📊 Progress: ${processed}/${MAX_ID} processed (${created} created, ${skipped} skipped, ${errors} errors)`);
            // Rate limit protection: wait 1 second between batches
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(`✅ Superhero API expansion complete: ${created} characters added`);
        return { processed, created, skipped, errors };
    }
    /**
     * Process a single character
     */
    static async processCharacter(id) {
        try {
            const character = await this.fetchCharacterById(id);
            if (!character) {
                return 'skipped';
            }
            // Generate deterministic symbol
            const symbol = this.generateSymbol(character.name);
            // Check if already exists
            const existing = await storage_js_1.storage.getAssetBySymbol(symbol);
            if (existing) {
                return 'skipped';
            }
            // Create asset
            const asset = {
                symbol,
                name: character.name,
                type: 'character',
                description: `${character.biography['full-name'] || character.name} - ${character.biography.publisher}`,
                totalShares: '1000000', // 1M shares per character
                availableShares: '1000000',
                metadata: {
                    source: 'superhero_api',
                    superheroApiId: character.id,
                    publisher: character.biography.publisher || 'Unknown',
                    powerstats: character.powerstats,
                    biography: character.biography,
                    appearance: character.appearance,
                    work: character.work,
                    connections: character.connections,
                    imageUrl: character.image.url,
                },
            };
            await storage_js_1.storage.createAsset(asset);
            return 'created';
        }
        catch (error) {
            console.error(`Error processing character ${id}:`, error);
            return 'error';
        }
    }
    /**
     * Generate deterministic trading symbol from character name
     */
    static generateSymbol(name) {
        const cleaned = name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 8);
        return `SH${cleaned}`;
    }
}
exports.SuperheroApiExpansionService = SuperheroApiExpansionService;
