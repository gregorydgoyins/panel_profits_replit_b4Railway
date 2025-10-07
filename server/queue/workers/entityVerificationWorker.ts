import { Worker, Job } from 'bullmq';
import { redisConnectionConfig, defaultWorkerOptions } from '../config';
import { QueueName, EntityVerificationJob } from '../types';
import { db } from '../../databaseStorage';
import { narrativeEntities, assets as assetsTable, comicCreators } from '@shared/schema';
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
    const table = tableType === 'creators' ? comicCreators : 
                  tableType === 'assets' ? assetsTable : 
                  narrativeEntities;

    const entityResults = await db
      .select()
      .from(table)
      .where(eq(table.id, entityId))
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

    // Primary: Superhero API (free and working)
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

    await job.updateProgress(50);

    // Secondary: Marvel API
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
        .update(table)
        .set({
          verificationStatus: 'failed',
          lastVerifiedAt: new Date(),
        })
        .where(eq(table.id, entityId));

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
      const narrativeEntity = entity as typeof narrativeEntities.$inferSelect;
      await db
        .update(narrativeEntities)
        .set({
          biography: mergedData.biography || narrativeEntity.biography,
          firstAppearance: mergedData.firstAppearance || narrativeEntity.firstAppearance,
          creators: mergedData.creators || narrativeEntity.creators,
          teams: mergedData.teams || narrativeEntity.teams,
          allies: mergedData.allies || narrativeEntity.allies,
          enemies: mergedData.enemies || narrativeEntity.enemies,
          primaryImageUrl: mergedData.imageUrl || narrativeEntity.primaryImageUrl,
          verificationStatus: 'verified' as const,
          primaryDataSource: primarySource,
          dataSourceBreakdown: dataSourceBreakdown,
          sourceConflicts: Object.keys(conflicts).length > 0 ? conflicts : null,
          lastVerifiedAt: new Date(),
        })
        .where(eq(narrativeEntities.id, entityId));
    } else {
      await db
        .update(table)
        .set({
          verificationStatus: 'verified' as const,
          primaryDataSource: primarySource,
          lastVerifiedAt: new Date(),
        })
        .where(eq(table.id, entityId));
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

  } catch (error: any) {
    console.error(`❌ Error verifying entity ${canonicalName}:`, error);
    throw error;
  }
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
      realName: character.name,
      biography: character.description,
      firstAppearance: character.comics?.items?.[0]?.name,
      teams: character.series?.items?.map((s: any) => s.name) || [],
      imageUrl: character.thumbnail ? `${character.thumbnail.path}.${character.thumbnail.extension}` : null,
      externalId: character.id,
      publisher: 'Marvel Comics',
    }
  };
}

function mergeDataSources(sources: DataSource[]): Record<string, any> {
  const merged: Record<string, any> = {};
  const fieldCoverage: Record<string, DataSource[]> = {};

  for (const source of sources) {
    for (const [key, value] of Object.entries(source.data)) {
      if (!value) continue;
      
      if (!fieldCoverage[key]) {
        fieldCoverage[key] = [];
      }
      fieldCoverage[key].push(source);

      if (!merged[key]) {
        merged[key] = value;
      } else {
        const existingSource = fieldCoverage[key].find(s => s.data[key] === merged[key]);
        if (!existingSource || source.confidence > existingSource.confidence) {
          merged[key] = value;
        }
      }
    }
  }

  return merged;
}

function buildSourceBreakdown(sources: DataSource[], mergedData: Record<string, any>): Record<string, string[]> {
  const breakdown: Record<string, string[]> = {};

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

function detectConflicts(sources: DataSource[], mergedData: Record<string, any>): Record<string, any> {
  const conflicts: Record<string, any> = {};

  const allFields: string[] = [];
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

function selectPrimarySource(sources: DataSource[]): string {
  if (sources.length === 0) return 'none';
  return sources.reduce((prev, curr) => 
    curr.confidence > prev.confidence ? curr : prev
  ).name;
}

export function createEntityVerificationWorker() {
  const worker = new Worker<EntityVerificationJob>(
    QueueName.ENTITY_VERIFICATION,
    processEntityVerificationJob,
    {
      connection: redisConnectionConfig,
      ...defaultWorkerOptions,
    }
  );

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
