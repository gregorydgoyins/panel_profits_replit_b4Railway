import { db } from "../databaseStorage";
import { narrativeEntities } from "../../shared/schema";
import { eq } from "drizzle-orm";

interface DataSource {
  name: string;
  data: Record<string, any>;
  confidence: number;
}

interface VerificationResult {
  entityId: string;
  verifiedData: Record<string, any>;
  dataSourceBreakdown: Record<string, string[]>;
  conflicts: Record<string, Record<string, any>>;
  primarySource: string;
  verificationDate: Date;
}

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
export class MultiSourceDataVerificationService {
  
  /**
   * Fetch data from Comic Vine API
   */
  private async fetchComicVineData(characterName: string): Promise<DataSource | null> {
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
    } catch (error) {
      console.error(`Comic Vine fetch error for ${characterName}:`, error);
      return null;
    }
  }

  /**
   * Fetch data from Marvel API
   */
  private async fetchMarvelData(characterName: string): Promise<DataSource | null> {
    const publicKey = process.env.MARVEL_API_PUBLIC_KEY;
    const privateKey = process.env.MARVEL_API_PRIVATE_KEY;
    
    if (!publicKey || !privateKey) {
      console.warn('Marvel API keys not configured');
      return null;
    }

    try {
      const crypto = await import('crypto');
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
    } catch (error) {
      console.error(`Marvel API fetch error for ${characterName}:`, error);
      return null;
    }
  }

  /**
   * Fetch data from Superhero API
   */
  private async fetchSuperheroData(characterName: string): Promise<DataSource | null> {
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
    } catch (error) {
      console.error(`Superhero API fetch error for ${characterName}:`, error);
      return null;
    }
  }

  /**
   * Cross-reference data from multiple sources and detect conflicts
   */
  private crossReferenceData(sources: DataSource[]): {
    verifiedData: Record<string, any>;
    dataSourceBreakdown: Record<string, string[]>;
    conflicts: Record<string, Record<string, any>>;
  } {
    const verifiedData: Record<string, any> = {};
    const dataSourceBreakdown: Record<string, string[]> = {};
    const conflicts: Record<string, Record<string, any>> = {};

    // Get all unique fields across all sources
    const allFields = new Set<string>();
    sources.forEach(source => {
      Object.keys(source.data).forEach(field => allFields.add(field));
    });

    // For each field, cross-reference across sources
    allFields.forEach(field => {
      const values: Array<{ source: string; value: any; confidence: number }> = [];
      
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
      } else {
        // Multiple sources have data - check for conflicts
        const uniqueValues = new Set(values.map(v => JSON.stringify(v.value)));
        
        if (uniqueValues.size === 1) {
          // All sources agree - high confidence
          verifiedData[field] = values[0].value;
          dataSourceBreakdown[field] = values.map(v => v.source);
        } else {
          // CONFLICT DETECTED - sources disagree
          const conflictData: Record<string, any> = {};
          values.forEach(v => {
            conflictData[v.source] = v.value;
          });
          conflicts[field] = conflictData;

          // Use the value from the highest confidence source
          const highestConfidence = values.reduce((prev, current) => 
            current.confidence > prev.confidence ? current : prev
          );
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
  async verifyEntity(entityId: string, characterName: string): Promise<VerificationResult> {
    console.log(`🔍 Starting multi-source verification for: ${characterName}`);

    // Fetch from all sources in parallel
    const [comicVineData, marvelData, superheroData] = await Promise.all([
      this.fetchComicVineData(characterName),
      this.fetchMarvelData(characterName),
      this.fetchSuperheroData(characterName),
    ]);

    // Filter out null sources
    const sources = [comicVineData, marvelData, superheroData].filter(Boolean) as DataSource[];

    if (sources.length === 0) {
      throw new Error(`No data sources returned results for: ${characterName}`);
    }

    console.log(`✅ Retrieved data from ${sources.length} source(s): ${sources.map(s => s.name).join(', ')}`);

    // Cross-reference and detect conflicts
    const { verifiedData, dataSourceBreakdown, conflicts } = this.crossReferenceData(sources);

    // Determine primary source (highest confidence)
    const primarySource = sources.reduce((prev, current) => 
      current.confidence > prev.confidence ? current : prev
    ).name;

    // Report conflicts
    if (Object.keys(conflicts).length > 0) {
      console.warn(`⚠️  Data conflicts detected for ${characterName}:`, conflicts);
    }

    // Update database with verified data
    await db.update(narrativeEntities)
      .set({
        biography: verifiedData.biography || null,
        realName: verifiedData.realName || null,
        creators: verifiedData.creators || null,
        teams: verifiedData.teams || null,
        allies: verifiedData.allies || null,
        enemies: verifiedData.enemies || null,
        firstAppearance: verifiedData.firstAppearance || null,
        primaryImageUrl: verifiedData.imageUrl || null,
        gender: verifiedData.gender || null,
        height: verifiedData.height ? parseFloat(verifiedData.height) : null,
        weight: verifiedData.weight ? parseFloat(verifiedData.weight) : null,
        eyeColor: verifiedData.eyeColor || null,
        hairColor: verifiedData.hairColor || null,
        // Data provenance tracking
        dataSourceBreakdown,
        sourceConflicts: Object.keys(conflicts).length > 0 ? conflicts : null,
        primaryDataSource: primarySource,
        lastVerifiedAt: new Date(),
        verificationStatus: Object.keys(conflicts).length > 0 ? 'disputed' : 'verified',
        dataCompleteness: (Object.keys(verifiedData).length / 15).toFixed(2), // Estimate completeness
      })
      .where(eq(narrativeEntities.id, entityId));

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
  async batchVerify(entities: Array<{ id: string; name: string }>, batchSize: number = 5): Promise<VerificationResult[]> {
    const results: VerificationResult[] = [];
    
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entities.length / batchSize)}`);
      
      const batchResults = await Promise.allSettled(
        batch.map(entity => this.verifyEntity(entity.id, entity.name))
      );

      batchResults.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
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

export const multiSourceVerification = new MultiSourceDataVerificationService();
