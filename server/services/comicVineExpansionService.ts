import { unifiedPricingEngine } from './unifiedPricingEngine';
import { tierClassificationService } from './tierClassificationService';
import { assetInsertionService } from './assetInsertionService';
import crypto from 'crypto';

/**
 * Comic Vine Asset Expansion Service
 * Transforms 800K-1.2M Comic Vine records into tradeable assets
 * Supports: Characters, Issues, Volumes, Creators
 */

interface ComicVineCharacter {
  id: number;
  name: string;
  real_name?: string;
  deck?: string;
  description?: string;
  publisher?: {
    id: number;
    name: string;
  };
  count_of_issue_appearances?: number;
  first_appeared_in_issue?: {
    id: number;
    name: string;
    issue_number: string;
  };
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
  };
  origin?: {
    id: number;
    name: string;
  };
  powers?: Array<{
    id: number;
    name: string;
  }>;
  date_added: string;
  date_last_updated: string;
  site_detail_url: string;
}

interface ComicVineIssue {
  id: number;
  name: string;
  issue_number: string;
  deck?: string;
  description?: string;
  cover_date?: string;
  store_date?: string;
  volume: {
    id: number;
    name: string;
  };
  publisher?: {
    id: number;
    name: string;
  };
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
  };
  character_credits?: Array<{
    id: number;
    name: string;
  }>;
  person_credits?: Array<{
    id: number;
    name: string;
    role: string;
  }>;
  date_added: string;
  date_last_updated: string;
}

interface ComicVineVolume {
  id: number;
  name: string;
  deck?: string;
  description?: string;
  start_year: string;
  count_of_issues: number;
  publisher?: {
    id: number;
    name: string;
  };
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
  };
  first_issue?: {
    id: number;
    name: string;
    issue_number: string;
  };
  last_issue?: {
    id: number;
    name: string;
    issue_number: string;
  };
  date_added: string;
  date_last_updated: string;
}

interface ComicVinePerson {
  id: number;
  name: string;
  deck?: string;
  description?: string;
  country?: string;
  hometown?: string;
  birth?: string;
  death?: string;
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
  };
  date_added: string;
  date_last_updated: string;
}

interface PricedAsset {
  type: string;
  name: string;
  baseName?: string;
  variant?: string | null;
  symbol: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  metadata?: any;
  pricing?: {
    currentPrice: number;
    totalMarketValue: number;
    totalFloat: number;
    source: string;
    lastUpdated: string;
    breakdown?: any;
  };
  tier?: number;
}

interface ExpansionProgress {
  resourceType: 'characters' | 'issues' | 'volumes' | 'creators';
  totalAvailable: number;
  processed: number;
  inserted: number;
  skipped: number;
  errors: number;
  startTime: string;
  lastOffset: number;
  isComplete: boolean;
}

export class ComicVineExpansionService {
  private apiKey: string;
  private baseUrl = 'https://comicvine.gamespot.com/api';
  private rateLimit = 18000; // 18 seconds between requests (200/hour safe limit)
  private maxRetries = 3;

  constructor() {
    this.apiKey = process.env.COMIC_VINE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ COMIC_VINE_API_KEY not set - Comic Vine expansion will not work');
    }
  }

  /**
   * Rate limiting helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make API request with retries and rate limiting
   */
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
    retryCount = 0
  ): Promise<T> {
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      format: 'json',
      ...params
    });

    const url = `${this.baseUrl}/${endpoint}/?${queryParams}`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'PanelProfits/1.0' }
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.maxRetries) {
          // Rate limited - wait longer and retry
          console.warn(`⚠️ Rate limited, waiting 60s before retry ${retryCount + 1}/${this.maxRetries}`);
          await this.sleep(60000);
          return this.makeRequest(endpoint, params, retryCount + 1);
        }
        
        const text = await response.text();
        throw new Error(`Comic Vine API error ${response.status}: ${text.substring(0, 200)}`);
      }

      const data = await response.json();
      
      if (data.status_code !== 1) {
        throw new Error(`Comic Vine error: ${data.error}`);
      }

      return data;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.warn(`⚠️ Request failed, retry ${retryCount + 1}/${this.maxRetries}: ${error}`);
        await this.sleep(30000);
        return this.makeRequest(endpoint, params, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Generate deterministic symbol from Comic Vine ID and name
   */
  private generateAssetSymbol(name: string, variant: string | null, comicVineId: number): string {
    const normalized = `${name}-${variant || 'base'}-cv${comicVineId}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const hash = crypto.createHash('sha256').update(normalized).digest();
    const hashNum = BigInt('0x' + hash.toString('hex').substring(0, 16));
    const suffix = (hashNum % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
    
    const prefix = name
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 5);
    
    if (variant) {
      const variantPrefix = variant
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 3);
      return `${prefix}.${variantPrefix}.${suffix}`;
    }
    
    return `${prefix}.${suffix}`;
  }

  /**
   * Determine era from year
   */
  private determineEraFromYear(year: string | number | undefined): 'golden' | 'silver' | 'bronze' | 'modern' {
    if (!year) return 'modern';
    
    const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
    
    if (yearNum < 1956) return 'golden';
    if (yearNum < 1971) return 'silver';
    if (yearNum < 1986) return 'bronze';
    return 'modern';
  }

  /**
   * Transform Comic Vine character to tradeable asset
   */
  private async transformCharacter(character: ComicVineCharacter): Promise<PricedAsset> {
    const name = character.name;
    const appearances = character.count_of_issue_appearances || 0;
    const publisher = character.publisher?.name || 'Unknown Publisher';
    
    // Classify tier
    const classification = tierClassificationService.classifyCharacter({
      name,
      publisher,
      appearances,
      isVariant: false
    });

    // Determine era from first appearance
    const firstAppearanceYear = character.first_appeared_in_issue?.name?.match(/\((\d{4})\)/)?.[1];
    const era = this.determineEraFromYear(firstAppearanceYear);

    // Calculate pricing
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'character',
      name,
      era,
      keyAppearances: Math.floor(appearances * 0.2),
      franchiseTier: classification.tier,
      isVariant: false
    });

    return {
      type: 'character',
      name,
      baseName: name,
      variant: null,
      symbol: this.generateAssetSymbol(name, null, character.id),
      category: 'CHARACTER',
      description: character.deck || character.description?.substring(0, 500) || `${publisher} character`,
      imageUrl: character.image?.medium_url || character.image?.small_url || undefined,
      coverImageUrl: character.image?.super_url || character.image?.screen_url || undefined,
      metadata: {
        source: 'comicvine',
        comicVineId: character.id,
        publisher,
        appearances,
        realName: character.real_name,
        firstAppearance: character.first_appeared_in_issue,
        origin: character.origin,
        powers: character.powers,
        dateAdded: character.date_added,
        siteUrl: character.site_detail_url
      },
      pricing: {
        currentPrice: pricingResult.sharePrice,
        totalMarketValue: pricingResult.totalMarketValue,
        totalFloat: pricingResult.totalFloat,
        source: 'mathematical',
        lastUpdated: new Date().toISOString(),
        breakdown: pricingResult.breakdown
      },
      tier: classification.tier
    };
  }

  /**
   * Transform Comic Vine issue to tradeable asset
   */
  private async transformIssue(issue: ComicVineIssue): Promise<PricedAsset> {
    const name = `${issue.volume.name} #${issue.issue_number}`;
    const publisher = issue.publisher?.name || 'Unknown Publisher';
    
    // Determine era from cover date
    const coverYear = issue.cover_date?.match(/^(\d{4})/)?.[1];
    const era = this.determineEraFromYear(coverYear);

    // Calculate pricing for comic issue
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'comic',
      name,
      era,
      keyAppearances: 0,
      franchiseTier: 3, // Most issues are tier 3
      isVariant: false
    });

    return {
      type: 'comic',
      name,
      symbol: this.generateAssetSymbol(name, null, issue.id),
      category: 'COMIC',
      description: issue.deck || issue.description?.substring(0, 500) || `${publisher} comic issue`,
      imageUrl: issue.image?.medium_url || issue.image?.small_url || undefined,
      coverImageUrl: issue.image?.super_url || issue.image?.screen_url || undefined,
      metadata: {
        source: 'comicvine',
        comicVineId: issue.id,
        publisher,
        issueNumber: issue.issue_number,
        volume: issue.volume,
        coverDate: issue.cover_date,
        storeDate: issue.store_date,
        characters: issue.character_credits,
        creators: issue.person_credits,
        dateAdded: issue.date_added
      },
      pricing: {
        currentPrice: pricingResult.sharePrice,
        totalMarketValue: pricingResult.totalMarketValue,
        totalFloat: pricingResult.totalFloat,
        source: 'mathematical',
        lastUpdated: new Date().toISOString(),
        breakdown: pricingResult.breakdown
      },
      tier: 3
    };
  }

  /**
   * Transform Comic Vine creator/person to tradeable asset
   */
  private async transformCreator(creator: ComicVinePerson): Promise<PricedAsset> {
    const name = creator.name;
    
    // Calculate pricing for creator
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'creator',
      name,
      era: 'modern',
      creatorTier: 2,
      roleWeightedAppearances: 100
    });

    return {
      type: 'creator',
      name,
      symbol: this.generateAssetSymbol(name, null, creator.id),
      category: 'CREATOR',
      description: creator.deck || creator.description?.substring(0, 500) || 'Comic creator',
      imageUrl: creator.image?.medium_url || creator.image?.small_url || undefined,
      coverImageUrl: creator.image?.super_url || creator.image?.screen_url || undefined,
      metadata: {
        source: 'comicvine',
        comicVineId: creator.id,
        country: creator.country,
        hometown: creator.hometown,
        birth: creator.birth,
        death: creator.death,
        dateAdded: creator.date_added
      },
      pricing: {
        currentPrice: pricingResult.sharePrice,
        totalMarketValue: pricingResult.totalMarketValue,
        totalFloat: pricingResult.totalFloat,
        source: 'mathematical',
        lastUpdated: new Date().toISOString(),
        breakdown: pricingResult.breakdown
      },
      tier: 2
    };
  }

  /**
   * Fetch characters from Comic Vine
   */
  async fetchCharacters(limit = 100, offset = 0): Promise<{ total: number; results: ComicVineCharacter[] }> {
    const response = await this.makeRequest<any>('characters', { limit, offset });
    return {
      total: response.number_of_total_results,
      results: response.results
    };
  }

  /**
   * Fetch issues from Comic Vine
   */
  async fetchIssues(limit = 100, offset = 0): Promise<{ total: number; results: ComicVineIssue[] }> {
    const response = await this.makeRequest<any>('issues', { limit, offset });
    return {
      total: response.number_of_total_results,
      results: response.results
    };
  }

  /**
   * Fetch creators from Comic Vine
   */
  async fetchCreators(limit = 100, offset = 0): Promise<{ total: number; results: ComicVinePerson[] }> {
    const response = await this.makeRequest<any>('people', { limit, offset });
    return {
      total: response.number_of_total_results,
      results: response.results
    };
  }

  /**
   * Expand characters with progress tracking
   */
  async expandCharacters(
    startOffset = 0,
    maxToProcess = 10000,
    onProgress?: (progress: ExpansionProgress) => void
  ): Promise<ExpansionProgress> {
    console.log('🦸 Starting Comic Vine character expansion...');
    
    const progress: ExpansionProgress = {
      resourceType: 'characters',
      totalAvailable: 0,
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      lastOffset: startOffset,
      isComplete: false
    };

    try {
      // Get total count
      const firstBatch = await this.fetchCharacters(1, 0);
      progress.totalAvailable = firstBatch.total;
      console.log(`📊 Found ${progress.totalAvailable.toLocaleString()} total characters in Comic Vine`);
      console.log(`🎯 Processing ${maxToProcess.toLocaleString()} characters starting from offset ${startOffset}`);

      const batchSize = 100;
      const endOffset = Math.min(startOffset + maxToProcess, progress.totalAvailable);

      for (let offset = startOffset; offset < endOffset; offset += batchSize) {
        try {
          console.log(`\n📦 Fetching characters ${offset}-${offset + batchSize}...`);
          
          const batch = await this.fetchCharacters(batchSize, offset);
          const characters = batch.results;

          // Transform to priced assets
          const pricedAssets: PricedAsset[] = [];
          for (const character of characters) {
            try {
              const asset = await this.transformCharacter(character);
              pricedAssets.push(asset);
            } catch (error) {
              console.error(`❌ Error transforming character ${character.name}:`, error);
              progress.errors++;
            }
          }

          // Insert batch
          if (pricedAssets.length > 0) {
            const result = await assetInsertionService.insertPricedAssets(pricedAssets, 100);
            progress.inserted += result.inserted;
            progress.skipped += result.skipped;
            progress.errors += result.errors;
          }

          progress.processed += characters.length;
          progress.lastOffset = offset;

          console.log(`✅ Progress: ${progress.processed}/${Math.min(maxToProcess, progress.totalAvailable)} | Inserted: ${progress.inserted} | Skipped: ${progress.skipped} | Errors: ${progress.errors}`);

          if (onProgress) {
            onProgress(progress);
          }

          // Rate limiting
          await this.sleep(this.rateLimit);

        } catch (error) {
          console.error(`❌ Error processing batch at offset ${offset}:`, error);
          progress.errors += batchSize;
          await this.sleep(60000); // Wait longer on error
        }
      }

      progress.isComplete = progress.lastOffset + batchSize >= endOffset;
      console.log(`\n🏁 Character expansion complete!`);
      console.log(`   Total Processed: ${progress.processed}`);
      console.log(`   Inserted: ${progress.inserted}`);
      console.log(`   Skipped: ${progress.skipped}`);
      console.log(`   Errors: ${progress.errors}`);

    } catch (error) {
      console.error('❌ Fatal error in character expansion:', error);
      throw error;
    }

    return progress;
  }

  /**
   * Expand issues with progress tracking
   */
  async expandIssues(
    startOffset = 0,
    maxToProcess = 10000,
    onProgress?: (progress: ExpansionProgress) => void
  ): Promise<ExpansionProgress> {
    console.log('📚 Starting Comic Vine issue expansion...');
    
    const progress: ExpansionProgress = {
      resourceType: 'issues',
      totalAvailable: 0,
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      lastOffset: startOffset,
      isComplete: false
    };

    try {
      // Get total count
      const firstBatch = await this.fetchIssues(1, 0);
      progress.totalAvailable = firstBatch.total;
      console.log(`📊 Found ${progress.totalAvailable.toLocaleString()} total issues in Comic Vine`);
      console.log(`🎯 Processing ${maxToProcess.toLocaleString()} issues starting from offset ${startOffset}`);

      const batchSize = 100;
      const endOffset = Math.min(startOffset + maxToProcess, progress.totalAvailable);

      for (let offset = startOffset; offset < endOffset; offset += batchSize) {
        try {
          console.log(`\n📦 Fetching issues ${offset}-${offset + batchSize}...`);
          
          const batch = await this.fetchIssues(batchSize, offset);
          const issues = batch.results;

          // Transform to priced assets
          const pricedAssets: PricedAsset[] = [];
          for (const issue of issues) {
            try {
              const asset = await this.transformIssue(issue);
              pricedAssets.push(asset);
            } catch (error) {
              console.error(`❌ Error transforming issue ${issue.name}:`, error);
              progress.errors++;
            }
          }

          // Insert batch
          if (pricedAssets.length > 0) {
            const result = await assetInsertionService.insertPricedAssets(pricedAssets, 100);
            progress.inserted += result.inserted;
            progress.skipped += result.skipped;
            progress.errors += result.errors;
          }

          progress.processed += issues.length;
          progress.lastOffset = offset;

          console.log(`✅ Progress: ${progress.processed}/${Math.min(maxToProcess, progress.totalAvailable)} | Inserted: ${progress.inserted} | Skipped: ${progress.skipped} | Errors: ${progress.errors}`);

          if (onProgress) {
            onProgress(progress);
          }

          // Rate limiting
          await this.sleep(this.rateLimit);

        } catch (error) {
          console.error(`❌ Error processing batch at offset ${offset}:`, error);
          progress.errors += batchSize;
          await this.sleep(60000);
        }
      }

      progress.isComplete = progress.lastOffset + batchSize >= endOffset;
      console.log(`\n🏁 Issue expansion complete!`);
      console.log(`   Total Processed: ${progress.processed}`);
      console.log(`   Inserted: ${progress.inserted}`);
      console.log(`   Skipped: ${progress.skipped}`);
      console.log(`   Errors: ${progress.errors}`);

    } catch (error) {
      console.error('❌ Fatal error in issue expansion:', error);
      throw error;
    }

    return progress;
  }

  /**
   * Expand creators with progress tracking
   */
  async expandCreators(
    startOffset = 0,
    maxToProcess = 10000,
    onProgress?: (progress: ExpansionProgress) => void
  ): Promise<ExpansionProgress> {
    console.log('✍️ Starting Comic Vine creator expansion...');
    
    const progress: ExpansionProgress = {
      resourceType: 'creators',
      totalAvailable: 0,
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      lastOffset: startOffset,
      isComplete: false
    };

    try {
      // Get total count
      const firstBatch = await this.fetchCreators(1, 0);
      progress.totalAvailable = firstBatch.total;
      console.log(`📊 Found ${progress.totalAvailable.toLocaleString()} total creators in Comic Vine`);
      console.log(`🎯 Processing ${maxToProcess.toLocaleString()} creators starting from offset ${startOffset}`);

      const batchSize = 100;
      const endOffset = Math.min(startOffset + maxToProcess, progress.totalAvailable);

      for (let offset = startOffset; offset < endOffset; offset += batchSize) {
        try {
          console.log(`\n📦 Fetching creators ${offset}-${offset + batchSize}...`);
          
          const batch = await this.fetchCreators(batchSize, offset);
          const creators = batch.results;

          // Transform to priced assets
          const pricedAssets: PricedAsset[] = [];
          for (const creator of creators) {
            try {
              const asset = await this.transformCreator(creator);
              pricedAssets.push(asset);
            } catch (error) {
              console.error(`❌ Error transforming creator ${creator.name}:`, error);
              progress.errors++;
            }
          }

          // Insert batch
          if (pricedAssets.length > 0) {
            const result = await assetInsertionService.insertPricedAssets(pricedAssets, 100);
            progress.inserted += result.inserted;
            progress.skipped += result.skipped;
            progress.errors += result.errors;
          }

          progress.processed += creators.length;
          progress.lastOffset = offset;

          console.log(`✅ Progress: ${progress.processed}/${Math.min(maxToProcess, progress.totalAvailable)} | Inserted: ${progress.inserted} | Skipped: ${progress.skipped} | Errors: ${progress.errors}`);

          if (onProgress) {
            onProgress(progress);
          }

          // Rate limiting
          await this.sleep(this.rateLimit);

        } catch (error) {
          console.error(`❌ Error processing batch at offset ${offset}:`, error);
          progress.errors += batchSize;
          await this.sleep(60000);
        }
      }

      progress.isComplete = progress.lastOffset + batchSize >= endOffset;
      console.log(`\n🏁 Creator expansion complete!`);
      console.log(`   Total Processed: ${progress.processed}`);
      console.log(`   Inserted: ${progress.inserted}`);
      console.log(`   Skipped: ${progress.skipped}`);
      console.log(`   Errors: ${progress.errors}`);

    } catch (error) {
      console.error('❌ Fatal error in creator expansion:', error);
      throw error;
    }

    return progress;
  }
}

export const comicVineExpansionService = new ComicVineExpansionService();
