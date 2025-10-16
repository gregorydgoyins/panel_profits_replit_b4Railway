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
exports.createEntityVerificationWorker = createEntityVerificationWorker;
const bullmq_1 = require("bullmq");
const config_1 = require("../config");
const types_1 = require("../types");
const databaseStorage_1 = require("../../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const resilientApiClient_1 = require("../../services/resilientApiClient");
const nameCanonicalizer_1 = require("../../services/nameCanonicalizer");
async function processEntityVerificationJob(job) {
    const { entityId, canonicalName, entityType, forceRefresh = false, tableType = 'narrative_entities' } = job.data;
    console.log(`🔍 Verifying entity: ${canonicalName} (${entityType})`);
    try {
        const table = tableType === 'creators' ? schema_1.comicCreators :
            tableType === 'assets' ? schema_1.assets :
                schema_1.narrativeEntities;
        const entityResults = await databaseStorage_1.db
            .select()
            .from(table)
            .where((0, drizzle_orm_1.eq)(table.id, entityId))
            .limit(1);
        const entity = entityResults[0];
        if (!entity) {
            throw new Error(`Entity not found: ${entityId}`);
        }
        if (!forceRefresh && entity.verificationStatus === 'verified') {
            const lastVerified = entity.lastVerifiedAt;
            if (lastVerified) {
                const hoursSinceVerification = (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60);
                if (hoursSinceVerification < 168) {
                    console.log(`✓ Entity recently verified (${Math.round(hoursSinceVerification)}h ago) - skipping`);
                    return {
                        success: true,
                        skipped: true,
                        reason: 'recently_verified',
                        hoursSinceVerification: Math.round(hoursSinceVerification),
                    };
                }
            }
        }
        await job.updateProgress(10);
        const nameVariants = nameCanonicalizer_1.nameCanonicalizer.generateVariants(canonicalName);
        console.log(`📝 Generated ${nameVariants.variants.length} name variants for ${canonicalName}`);
        await job.updateProgress(20);
        const dataSources = [];
        const errors = {};
        // Primary: Superhero API (free and working)
        const superheroResult = await resilientApiClient_1.resilientApiClient.fetchWithResilience('superhero', () => fetchSuperheroData(nameVariants.searchTerms), { maxAttempts: 3 });
        if (superheroResult.data) {
            dataSources.push(superheroResult.data);
        }
        else if (superheroResult.error) {
            errors.superhero = superheroResult.error;
        }
        await job.updateProgress(50);
        // Secondary: Marvel API
        const marvelResult = await resilientApiClient_1.resilientApiClient.fetchWithResilience('marvel', () => fetchMarvelData(canonicalName), { maxAttempts: 2 });
        if (marvelResult.data) {
            dataSources.push(marvelResult.data);
        }
        else if (marvelResult.error) {
            errors.marvel = marvelResult.error;
        }
        await job.updateProgress(80);
        if (dataSources.length === 0) {
            console.warn(`⚠️ No data sources returned results for: ${canonicalName}`);
            await databaseStorage_1.db
                .update(table)
                .set({
                verificationStatus: 'failed',
                lastVerifiedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(table.id, entityId));
            return {
                success: false,
                error: 'no_data_sources',
                errors,
                attempts: {
                    superhero: superheroResult.attempts,
                    marvel: marvelResult.attempts,
                },
            };
        }
        const mergedData = mergeDataSources(dataSources);
        const dataSourceBreakdown = buildSourceBreakdown(dataSources, mergedData);
        const conflicts = detectConflicts(dataSources, mergedData);
        const primarySource = selectPrimarySource(dataSources);
        if (tableType === 'narrative_entities') {
            const narrativeEntity = entity;
            await databaseStorage_1.db
                .update(schema_1.narrativeEntities)
                .set({
                biography: mergedData.biography || narrativeEntity.biography,
                firstAppearance: mergedData.firstAppearance || narrativeEntity.firstAppearance,
                creators: mergedData.creators || narrativeEntity.creators,
                teams: mergedData.teams || narrativeEntity.teams,
                allies: mergedData.allies || narrativeEntity.allies,
                enemies: mergedData.enemies || narrativeEntity.enemies,
                primaryImageUrl: mergedData.imageUrl || narrativeEntity.primaryImageUrl,
                verificationStatus: 'verified',
                primaryDataSource: primarySource,
                dataSourceBreakdown: dataSourceBreakdown,
                sourceConflicts: Object.keys(conflicts).length > 0 ? conflicts : null,
                lastVerifiedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, entityId));
        }
        else {
            await databaseStorage_1.db
                .update(table)
                .set({
                verificationStatus: 'verified',
                primaryDataSource: primarySource,
                lastVerifiedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(table.id, entityId));
        }
        console.log(`✅ Successfully verified: ${canonicalName}`);
        await job.updateProgress(100);
        return {
            success: true,
            entityId,
            sourcesUsed: dataSources.length,
            primarySource,
            conflicts: Object.keys(conflicts).length,
        };
    }
    catch (error) {
        console.error(`❌ Error verifying entity ${canonicalName}:`, error);
        throw error;
    }
}
async function fetchSuperheroData(searchTerms) {
    const apiToken = process.env.SUPERHERO_API_TOKEN;
    if (!apiToken)
        return null;
    for (const term of searchTerms) {
        try {
            const url = `https://superheroapi.com/api/${apiToken}/search/${encodeURIComponent(term)}`;
            const response = await fetch(url);
            if (!response.ok)
                continue;
            const data = await response.json();
            if (data.response === 'success' && data.results && data.results.length > 0) {
                const hero = data.results[0];
                return {
                    name: 'superhero_api',
                    confidence: 0.85,
                    data: {
                        realName: hero.biography?.['full-name'],
                        biography: hero.biography?.['first-appearance'],
                        allies: hero.connections?.['group-affiliation']?.split(', ') || [],
                        publisher: hero.biography?.publisher,
                        gender: hero.appearance?.gender,
                        height: hero.appearance?.height?.[1],
                        weight: hero.appearance?.weight?.[1],
                        eyeColor: hero.appearance?.['eye-color'],
                        hairColor: hero.appearance?.['hair-color'],
                        powers: Object.entries(hero.powerstats || {})
                            .filter(([_, value]) => value !== 'null')
                            .map(([key, value]) => `${key}: ${value}`),
                        imageUrl: hero.image?.url,
                        externalId: hero.id,
                    }
                };
            }
        }
        catch (error) {
            continue;
        }
    }
    return null;
}
async function fetchMarvelData(characterName) {
    const publicKey = process.env.MARVEL_API_PUBLIC_KEY;
    const privateKey = process.env.MARVEL_API_PRIVATE_KEY;
    if (!publicKey || !privateKey)
        return null;
    const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
    const ts = Date.now().toString();
    const hash = crypto.createHash('md5').update(ts + privateKey + publicKey).digest('hex');
    const url = `https://gateway.marvel.com/v1/public/characters?name=${encodeURIComponent(characterName)}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Marvel API failed: ${response.status}`);
    }
    const data = await response.json();
    if (!data.data?.results || data.data.results.length === 0) {
        return null;
    }
    const character = data.data.results[0];
    return {
        name: 'marvel',
        confidence: 0.95,
        data: {
            realName: character.name,
            biography: character.description,
            firstAppearance: character.comics?.items?.[0]?.name,
            teams: character.series?.items?.map((s) => s.name) || [],
            imageUrl: character.thumbnail ? `${character.thumbnail.path}.${character.thumbnail.extension}` : null,
            externalId: character.id,
            publisher: 'Marvel Comics',
        }
    };
}
function mergeDataSources(sources) {
    const merged = {};
    const fieldCoverage = {};
    for (const source of sources) {
        for (const [key, value] of Object.entries(source.data)) {
            if (!value)
                continue;
            if (!fieldCoverage[key]) {
                fieldCoverage[key] = [];
            }
            fieldCoverage[key].push(source);
            if (!merged[key]) {
                merged[key] = value;
            }
            else {
                const existingSource = fieldCoverage[key].find(s => s.data[key] === merged[key]);
                if (!existingSource || source.confidence > existingSource.confidence) {
                    merged[key] = value;
                }
            }
        }
    }
    return merged;
}
function buildSourceBreakdown(sources, mergedData) {
    const breakdown = {};
    for (const [field, value] of Object.entries(mergedData)) {
        const sourcesForField = sources
            .filter(s => s.data[field] === value)
            .map(s => s.name);
        if (sourcesForField.length > 0) {
            breakdown[field] = sourcesForField;
        }
    }
    return breakdown;
}
function detectConflicts(sources, mergedData) {
    const conflicts = {};
    const allFields = [];
    sources.forEach(s => Object.keys(s.data).forEach(k => {
        if (!allFields.includes(k)) {
            allFields.push(k);
        }
    }));
    for (const field of allFields) {
        const values = new Set(sources.map(s => s.data[field]).filter(Boolean));
        if (values.size > 1) {
            conflicts[field] = {
                merged: mergedData[field],
                alternatives: sources
                    .map(s => ({ source: s.name, value: s.data[field], confidence: s.confidence }))
                    .filter(x => x.value)
            };
        }
    }
    return conflicts;
}
function selectPrimarySource(sources) {
    if (sources.length === 0)
        return 'none';
    return sources.reduce((prev, curr) => curr.confidence > prev.confidence ? curr : prev).name;
}
function createEntityVerificationWorker() {
    const worker = new bullmq_1.Worker(types_1.QueueName.ENTITY_VERIFICATION, processEntityVerificationJob, {
        connection: config_1.redisConnectionConfig,
        ...config_1.defaultWorkerOptions,
    });
    worker.on('completed', (job) => {
        console.log(`✅ Verification job ${job.id} completed successfully`);
    });
    worker.on('failed', (job, err) => {
        console.error(`❌ Verification job ${job?.id} failed:`, err.message);
    });
    worker.on('error', (err) => {
        console.error('❌ Verification worker error:', err);
    });
    console.log('🚀 Entity Verification Worker started');
    return worker;
}
