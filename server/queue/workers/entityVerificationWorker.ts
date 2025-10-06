import { Worker, Job } from 'bullmq';
import { redisConnectionConfig, defaultWorkerOptions } from '../config';
import { QueueName, EntityVerificationJob } from '../types';
import { db } from '../../databaseStorage';
import { narrativeEntities, assets, comicCreators } from '@shared/schema';
import { eq, and, sql, lt } from 'drizzle-orm';
import { resilientApiClient } from '../../services/resilientApiClient';
import { nameCanonicalizer } from '../../services/nameCanonicalizer';

interface DataSource {
  name: string;
  data: Record<string, any>;
  confidence: number;
}

async function processEntityVerificationJob(job: Job<EntityVerificationJob>) {
  const { entityId, canonicalName, entityType, forceRefresh = false, tableType = 'narrative_entities' } = job.data;
  
  console.log(`🔍 Verifying entity: ${canonicalName} (${entityType})`);
  
  try {
    const entityResults = await db
      .select({
        id: narrativeEntities.id,
        canonicalName: narrativeEntities.canonicalName,
        verificationStatus: narrativeEntities.verificationStatus,
        lastVerifiedAt: narrativeEntities.lastVerifiedAt,
        biography: narrativeEntities.biography,
        firstAppearance: narrativeEntities.firstAppearance,
        creators: narrativeEntities.creators,
        teams: narrativeEntities.teams,
        allies: narrativeEntities.allies,
        enemies: narrativeEntities.enemies,
        primaryImageUrl: narrativeEntities.primaryImageUrl,
      })
      .from(narrativeEntities)
      .where(eq(narrativeEntities.id, entityId))
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

    const nameVariants = nameCanonicalizer.generateVariants(canonicalName);
    console.log(`📝 Generated ${nameVariants.variants.length} name variants for ${canonicalName}`);

    await job.updateProgress(20);

    const dataSources: DataSource[] = [];
    const errors: Record<string, any> = {};

    const comicVineResult = await resilientApiClient.fetchWithResilience(
      'comic_vine',
      () => fetchComicVineData(nameVariants.searchTerms[0]),
      { maxAttempts: 2 }
    );

    if (comicVineResult.data) {
      dataSources.push(comicVineResult.data);
    } else if (comicVineResult.error) {
      errors.comic_vine = comicVineResult.error;
    }

    await job.updateProgress(40);

    const superheroResult = await resilientApiClient.fetchWithResilience(
      'superhero',
      () => fetchSuperheroData(nameVariants.searchTerms),
      { maxAttempts: 3 }
    );

    if (superheroResult.data) {
      dataSources.push(superheroResult.data);
    } else if (superheroResult.error) {
      errors.superhero = superheroResult.error;
    }

    await job.updateProgress(60);

    const marvelResult = await resilientApiClient.fetchWithResilience(
      'marvel',
      () => fetchMarvelData(canonicalName),
      { maxAttempts: 2 }
    );

    if (marvelResult.data) {
      dataSources.push(marvelResult.data);
    } else if (marvelResult.error) {
      errors.marvel = marvelResult.error;
    }

    await job.updateProgress(80);

    if (dataSources.length === 0) {
      console.warn(`⚠️ No data sources returned results for: ${canonicalName}`);
      
      await db
        .update(narrativeEntities)
        .set({
          verificationStatus: 'failed',
          lastVerifiedAt: new Date(),
        })
        .where(eq(narrativeEntities.id, entityId));

      return {
        success: false,
        error: 'no_data_sources',
        errors,
        attempts: {
          comic_vine: comicVineResult.attempts,
          superhero: superheroResult.attempts,
          marvel: marvelResult.attempts,
        },
      };
    }

    const mergedData = mergeDataSources(dataSources);
    const dataSourceBreakdown = buildSourceBreakdown(dataSources, mergedData);
    const conflicts = detectConflicts(dataSources, mergedData);
    const primarySource = selectPrimarySource(dataSources);

    await db
      .update(narrativeEntities)
      .set({
        biography: mergedData.biography || entity.biography,
        firstAppearance: mergedData.firstAppearance || entity.firstAppearance,
        creators: mergedData.creators || entity.creators,
        teams: mergedData.teams || entity.teams,
        allies: mergedData.allies || entity.allies,
        enemies: mergedData.enemies || entity.enemies,
        primaryImageUrl: mergedData.imageUrl || entity.primaryImageUrl,
        verificationStatus: 'verified' as const,
        primaryDataSource: primarySource,
        dataSourceBreakdown: dataSourceBreakdown,
        sourceConflicts: Object.keys(conflicts).length > 0 ? conflicts : null,
        lastVerifiedAt: new Date(),
      })
      .where(eq(narrativeEntities.id, entityId));

    console.log(`✅ Successfully verified: ${canonicalName}`);

    await job.updateProgress(100);

    return {
      success: true,
      entityId,
      sourcesUsed: dataSources.length,
      primarySource,
      conflicts: Object.keys(conflicts).length,
    };

  } catch (error: any) {
    console.error(`❌ Error verifying entity ${canonicalName}:`, error);
    throw error;
  }
}

async function fetchComicVineData(characterName: string): Promise<DataSource | null> {
  const apiKey = process.env.COMIC_VINE_API_KEY;
  if (!apiKey) return null;

  const searchUrl = `https://comicvine.gamespot.com/api/search/?api_key=${apiKey}&format=json&query=${encodeURIComponent(characterName)}&resources=character&limit=1`;
  const searchResponse = await fetch(searchUrl, {
    headers: { 'User-Agent': 'Panel Profits Trading Platform' }
  });
  
  if (!searchResponse.ok) {
    throw new Error(`Comic Vine search failed: ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  
  if (!searchData.results || searchData.results.length === 0) {
    return null;
  }

  const characterId = searchData.results[0].id;
  
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
      biography: character.deck || character.description?.replace(/<[^>]*>/g, ''),
      firstAppearance: character.first_appeared_in_issue?.name,
      creators: character.creators?.map((c: any) => c.name) || [],
      teams: character.teams?.map((t: any) => t.name) || [],
      allies: character.allies?.map((a: any) => a.name) || [],
      enemies: character.enemies?.map((e: any) => e.name) || [],
      powers: character.powers?.map((p: any) => p.name) || [],
      imageUrl: character.image?.medium_url,
      externalId: character.id,
      publisher: character.publisher?.name,
    }
  };
}

async function fetchSuperheroData(searchTerms: string[]): Promise<DataSource | null> {
  const apiToken = process.env.SUPERHERO_API_TOKEN;
  if (!apiToken) return null;

  for (const term of searchTerms) {
    try {
      const url = `https://superheroapi.com/api/${apiToken}/search/${encodeURIComponent(term)}`;
      const response = await fetch(url);
      
      if (!response.ok) continue;
      
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
    } catch (error) {
      continue;
    }
  }
  
  return null;
}

async function fetchMarvelData(characterName: string): Promise<DataSource | null> {
  const publicKey = process.env.MARVEL_API_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_API_PRIVATE_KEY;
  
  if (!publicKey || !privateKey) return null;

  const crypto = await import('crypto');
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
      biography: character.description,
      imageUrl: character.thumbnail ? `${character.thumbnail.path}.${character.thumbnail.extension}` : undefined,
      externalId: character.id,
      teams: character.comics?.items?.map((c: any) => c.name) || [],
      publisher: 'Marvel Comics',
    }
  };
}

function mergeDataSources(sources: DataSource[]): Record<string, any> {
  const merged: Record<string, any> = {};
  const fieldScores: Record<string, { value: any; score: number }> = {};

  for (const source of sources) {
    for (const [key, value] of Object.entries(source.data)) {
      if (value === null || value === undefined || value === '') continue;

      if (!fieldScores[key] || source.confidence > fieldScores[key].score) {
        fieldScores[key] = { value, score: source.confidence };
      }
    }
  }

  for (const [key, { value }] of Object.entries(fieldScores)) {
    merged[key] = value;
  }

  return merged;
}

function buildSourceBreakdown(sources: DataSource[], mergedData: Record<string, any>): Record<string, string[]> {
  const breakdown: Record<string, string[]> = {};

  for (const [key] of Object.entries(mergedData)) {
    breakdown[key] = sources
      .filter(s => s.data[key] !== null && s.data[key] !== undefined)
      .map(s => s.name);
  }

  return breakdown;
}

function detectConflicts(sources: DataSource[], mergedData: Record<string, any>): Record<string, Record<string, any>> {
  const conflicts: Record<string, Record<string, any>> = {};

  for (const key of Object.keys(mergedData)) {
    const values = sources
      .filter(s => s.data[key] !== null && s.data[key] !== undefined)
      .map(s => ({ source: s.name, value: s.data[key] }));

    if (values.length > 1) {
      const uniqueValuesSet = new Set(values.map(v => JSON.stringify(v.value)));
      const uniqueValues = Array.from(uniqueValuesSet);
      if (uniqueValues.length > 1) {
        conflicts[key] = Object.fromEntries(
          values.map(v => [v.source, v.value])
        );
      }
    }
  }

  return conflicts;
}

function selectPrimarySource(sources: DataSource[]): string {
  return sources.sort((a, b) => b.confidence - a.confidence)[0]?.name || 'unknown';
}

export function createEntityVerificationWorker() {
  const worker = new Worker(
    QueueName.ENTITY_VERIFICATION,
    processEntityVerificationJob,
    {
      connection: redisConnectionConfig,
      ...defaultWorkerOptions,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Verification job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Verification job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('❌ Verification worker error:', err);
  });

  return worker;
}
