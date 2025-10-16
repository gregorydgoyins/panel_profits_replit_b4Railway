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
exports.multiSourceVerification = exports.MultiSourceDataVerificationService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Multi-Source Data Verification Service
 *
 * For 401,666 assets, we need industrial-strength data verification.
 * This service pulls data from multiple sources, cross-references for accuracy,
 * and tracks provenance to ensure comic book collectors (historians of pop culture)
 * can trust the information.
 *
 * Data Sources:
 * - Comic Vine API
 * - Marvel API
 * - Superhero API
 * - Wikipedia (future)
 */
class MultiSourceDataVerificationService {
    /**
     * Fetch data from Comic Vine API
     */
    async fetchComicVineData(characterName) {
        const apiKey = process.env.COMIC_VINE_API_KEY;
        if (!apiKey) {
            console.warn('Comic Vine API key not configured');
            return null;
        }
        try {
            // Search for character
            const searchUrl = `https://comicvine.gamespot.com/api/search/?api_key=${apiKey}&format=json&query=${encodeURIComponent(characterName)}&resources=character&limit=1`;
            const searchResponse = await fetch(searchUrl, {
                headers: { 'User-Agent': 'Panel Profits Trading Platform' }
            });
            if (!searchResponse.ok) {
                throw new Error(`Comic Vine search failed: ${searchResponse.status}`);
            }
            const searchData = await searchResponse.json();
            if (!searchData.results || searchData.results.length === 0) {
                console.warn(`No Comic Vine results for: ${characterName}`);
                return null;
            }
            const characterId = searchData.results[0].id;
            // Fetch detailed character data
            const detailUrl = `https://comicvine.gamespot.com/api/character/4005-${characterId}/?api_key=${apiKey}&format=json`;
            const detailResponse = await fetch(detailUrl, {
                headers: { 'User-Agent': 'Panel Profits Trading Platform' }
            });
            if (!detailResponse.ok) {
                throw new Error(`Comic Vine detail fetch failed: ${detailResponse.status}`);
            }
            const detailData = await detailResponse.json();
            const character = detailData.results;
            return {
                name: 'comic_vine',
                confidence: 0.9,
                data: {
                    realName: character.real_name,
                    biography: character.deck || character.description?.replace(/<[^>]*>/g, ''), // Strip HTML
                    firstAppearance: character.first_appeared_in_issue?.name,
                    creators: character.creators?.map((c) => c.name) || [],
                    teams: character.teams?.map((t) => t.name) || [],
                    allies: character.allies?.map((a) => a.name) || [],
                    enemies: character.enemies?.map((e) => e.name) || [],
                    powers: character.powers?.map((p) => p.name) || [],
                    imageUrl: character.image?.medium_url,
                    externalId: character.id,
                    publisher: character.publisher?.name,
                }
            };
        }
        catch (error) {
            console.error(`Comic Vine fetch error for ${characterName}:`, error);
            return null;
        }
    }
    /**
     * Fetch data from Marvel API
     */
    async fetchMarvelData(characterName) {
        const publicKey = process.env.MARVEL_API_PUBLIC_KEY;
        const privateKey = process.env.MARVEL_API_PRIVATE_KEY;
        if (!publicKey || !privateKey) {
            console.warn('Marvel API keys not configured');
            return null;
        }
        try {
            const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
            const ts = Date.now().toString();
            const hash = crypto.createHash('md5').update(ts + privateKey + publicKey).digest('hex');
            const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(characterName)}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Marvel API failed: ${response.status}`);
            }
            const data = await response.json();
            if (!data.data || !data.data.results || data.data.results.length === 0) {
                console.warn(`No Marvel results for: ${characterName}`);
                return null;
            }
            const character = data.data.results[0];
            return {
                name: 'marvel_api',
                confidence: 0.95,
                data: {
                    biography: character.description,
                    imageUrl: `${character.thumbnail.path}.${character.thumbnail.extension}`,
                    externalId: character.id,
                    comics: character.comics?.available || 0,
                    series: character.series?.available || 0,
                    stories: character.stories?.available || 0,
                    publisher: 'Marvel Comics',
                }
            };
        }
        catch (error) {
            console.error(`Marvel API fetch error for ${characterName}:`, error);
            return null;
        }
    }
    /**
     * Fetch data from Superhero API
     */
    async fetchSuperheroData(characterName) {
        const apiToken = process.env.SUPERHERO_API_TOKEN;
        if (!apiToken) {
            console.warn('Superhero API token not configured');
            return null;
        }
        try {
            const searchUrl = `https://superheroapi.com/api/${apiToken}/search/${encodeURIComponent(characterName)}`;
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`Superhero API failed: ${response.status}`);
            }
            const data = await response.json();
            if (data.response !== 'success' || !data.results || data.results.length === 0) {
                console.warn(`No Superhero API results for: ${characterName}`);
                return null;
            }
            const character = data.results[0];
            return {
                name: 'superhero_api',
                confidence: 0.8,
                data: {
                    realName: character.biography?.['full-name'],
                    biography: character.biography?.['first-appearance'],
                    allies: character.connections?.['group-affiliation']?.split(', ') || [],
                    publisher: character.biography?.publisher,
                    gender: character.appearance?.gender,
                    height: character.appearance?.height?.[1], // Metric
                    weight: character.appearance?.weight?.[1], // Metric
                    eyeColor: character.appearance?.['eye-color'],
                    hairColor: character.appearance?.['hair-color'],
                    powers: character.powerstats ? Object.entries(character.powerstats).map(([key, val]) => `${key}: ${val}`) : [],
                    imageUrl: character.image?.url,
                    externalId: character.id,
                }
            };
        }
        catch (error) {
            console.error(`Superhero API fetch error for ${characterName}:`, error);
            return null;
        }
    }
    /**
     * Cross-reference data from multiple sources and detect conflicts
     */
    crossReferenceData(sources) {
        const verifiedData = {};
        const dataSourceBreakdown = {};
        const conflicts = {};
        // Get all unique fields across all sources
        const allFields = new Set();
        sources.forEach(source => {
            Object.keys(source.data).forEach(field => allFields.add(field));
        });
        // For each field, cross-reference across sources
        allFields.forEach(field => {
            const values = [];
            sources.forEach(source => {
                if (source.data[field] !== undefined && source.data[field] !== null && source.data[field] !== '') {
                    values.push({
                        source: source.name,
                        value: source.data[field],
                        confidence: source.confidence
                    });
                }
            });
            if (values.length === 0) {
                return; // No data for this field
            }
            if (values.length === 1) {
                // Only one source has data for this field
                verifiedData[field] = values[0].value;
                dataSourceBreakdown[field] = [values[0].source];
            }
            else {
                // Multiple sources have data - check for conflicts
                const uniqueValues = new Set(values.map(v => JSON.stringify(v.value)));
                if (uniqueValues.size === 1) {
                    // All sources agree - high confidence
                    verifiedData[field] = values[0].value;
                    dataSourceBreakdown[field] = values.map(v => v.source);
                }
                else {
                    // CONFLICT DETECTED - sources disagree
                    const conflictData = {};
                    values.forEach(v => {
                        conflictData[v.source] = v.value;
                    });
                    conflicts[field] = conflictData;
                    // Use the value from the highest confidence source
                    const highestConfidence = values.reduce((prev, current) => current.confidence > prev.confidence ? current : prev);
                    verifiedData[field] = highestConfidence.value;
                    dataSourceBreakdown[field] = values.map(v => v.source);
                }
            }
        });
        return { verifiedData, dataSourceBreakdown, conflicts };
    }
    /**
     * Verify and update entity data from multiple sources
     */
    async verifyEntity(entityId, characterName) {
        console.log(`🔍 Starting multi-source verification for: ${characterName}`);
        // Fetch from all sources in parallel
        const [comicVineData, marvelData, superheroData] = await Promise.all([
            this.fetchComicVineData(characterName),
            this.fetchMarvelData(characterName),
            this.fetchSuperheroData(characterName),
        ]);
        // Filter out null sources
        const sources = [comicVineData, marvelData, superheroData].filter(Boolean);
        if (sources.length === 0) {
            throw new Error(`No data sources returned results for: ${characterName}`);
        }
        console.log(`✅ Retrieved data from ${sources.length} source(s): ${sources.map(s => s.name).join(', ')}`);
        // Cross-reference and detect conflicts
        const { verifiedData, dataSourceBreakdown, conflicts } = this.crossReferenceData(sources);
        // Determine primary source (highest confidence)
        const primarySource = sources.reduce((prev, current) => current.confidence > prev.confidence ? current : prev).name;
        // Report conflicts
        if (Object.keys(conflicts).length > 0) {
            console.warn(`⚠️  Data conflicts detected for ${characterName}:`, conflicts);
        }
        // Update database with verified data (only fields that exist in DB)
        await databaseStorage_1.db.update(schema_1.narrativeEntities)
            .set({
            biography: verifiedData.biography || null,
            createdBy: verifiedData.creators ? verifiedData.creators.join(', ') : null,
            teams: verifiedData.teams || null,
            allies: verifiedData.allies || null,
            enemies: verifiedData.enemies || null,
            firstAppearance: verifiedData.firstAppearance || null,
            primaryImageUrl: verifiedData.imageUrl || null,
            // Data provenance tracking
            dataSourceBreakdown,
            sourceConflicts: Object.keys(conflicts).length > 0 ? conflicts : null,
            primaryDataSource: primarySource,
            lastVerifiedAt: new Date(),
            verificationStatus: Object.keys(conflicts).length > 0 ? 'disputed' : 'verified',
        })
            .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, entityId));
        console.log(`✅ Successfully verified and updated: ${characterName}`);
        return {
            entityId,
            verifiedData,
            dataSourceBreakdown,
            conflicts,
            primarySource,
            verificationDate: new Date(),
        };
    }
    /**
     * Batch verify multiple entities
     */
    async batchVerify(entities, batchSize = 5) {
        const results = [];
        for (let i = 0; i < entities.length; i += batchSize) {
            const batch = entities.slice(i, i + batchSize);
            console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entities.length / batchSize)}`);
            const batchResults = await Promise.allSettled(batch.map(entity => this.verifyEntity(entity.id, entity.name)));
            batchResults.forEach((result, idx) => {
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                }
                else {
                    console.error(`❌ Failed to verify ${batch[idx].name}:`, result.reason);
                }
            });
            // Rate limiting: wait 2 seconds between batches
            if (i + batchSize < entities.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        return results;
    }
}
exports.MultiSourceDataVerificationService = MultiSourceDataVerificationService;
exports.multiSourceVerification = new MultiSourceDataVerificationService();
