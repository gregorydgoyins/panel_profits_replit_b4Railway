import { unifiedPricingEngine } from './unifiedPricingEngine';
import { tierClassificationService } from './tierClassificationService';
import { assetInsertionService } from './assetInsertionService';
import crypto from 'crypto';

/**
 * Marvel API Asset Expansion Service
 * Transforms 65K+ Marvel characters, 50K+ comics, 10K+ creators into tradeable assets
 * Uses MD5 hash authentication with public/private keys
 */

interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    items: Array<{ resourceURI: string; name: string }>;
  };
  series: {
    available: number;
  };
  stories: {
    available: number;
  };
  events: {
    available: number;
  };
  urls: Array<{ type: string; url: string }>;
}

interface MarvelComic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  format: string;
  pageCount: number;
  thumbnail: {
    path: string;
    extension: string;
  };
  series: {
    resourceURI: string;
    name: string;
  };
  dates: Array<{ type: string; date: string }>;
  prices: Array<{ type: string; price: number }>;
  creators: {
    available: number;
    items: Array<{ resourceURI: string; name: string; role: string }>;
  };
  characters: {
    available: number;
    items: Array<{ resourceURI: string; name: string }>;
  };
}

interface MarvelCreator {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  fullName: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
  };
  series: {
    available: number;
  };
  stories: {
    available: number;
  };
  events: {
    available: number;
  };
  urls: Array<{ type: string; url: string }>;
}

interface MarvelAPIResponse<T> {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
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
  resourceType: 'characters' | 'comics' | 'creators';
  totalAvailable: number;
  processed: number;
  inserted: number;
  skipped: number;
  errors: number;
  startTime: string;
  lastOffset: number;
  isComplete: boolean;
  rate: number; // assets per second
}

export class MarvelExpansionService {
  private publicKey: string;
  private privateKey: string;
  private baseUrl = 'https://gateway.marvel.com/v1/public';
  private rateLimit = 1000; // 1 second between requests (safe for 3000/day limit)
  private maxRetries = 3;

  constructor() {
    this.publicKey = process.env.MARVEL_API_PUBLIC_KEY || '';
    this.privateKey = process.env.MARVEL_API_PRIVATE_KEY || '';
    
    if (!this.publicKey || !this.privateKey) {
      console.warn('⚠️ Marvel API keys not set - expansion will not work');
    }
  }

  /**
   * Generate MD5 hash for Marvel API authentication
   * Format: md5(timestamp + privateKey + publicKey)
   */
  private generateAuthHash(timestamp: string): string {
    const hashInput = timestamp + this.privateKey + this.publicKey;
    return crypto.createHash('md5').update(hashInput).digest('hex');
  }

  /**
   * Build authenticated API URL
   */
  private buildAuthUrl(endpoint: string, params: Record<string, any> = {}): string {
    const timestamp = Date.now().toString();
    const hash = this.generateAuthHash(timestamp);
    
    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.publicKey,
      hash: hash,
      ...params
    });

    return `${this.baseUrl}/${endpoint}?${queryParams}`;
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
  ): Promise<MarvelAPIResponse<T>> {
    const url = this.buildAuthUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        headers: { 
          'User-Agent': 'PanelProfits/1.0',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.maxRetries) {
          // Rate limited - wait and retry
          const waitTime = Math.pow(2, retryCount) * 2000; // Exponential backoff
          console.warn(`⚠️ Rate limited, waiting ${waitTime}ms before retry ${retryCount + 1}/${this.maxRetries}`);
          await this.sleep(waitTime);
          return this.makeRequest(endpoint, params, retryCount + 1);
        }
        
        const errorText = await response.text();
        throw new Error(`Marvel API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(`Marvel API returned error code ${data.code}: ${data.status}`);
      }

      // Rate limit: wait before next request
      await this.sleep(this.rateLimit);
      
      return data;
    } catch (error: any) {
      if (retryCount < this.maxRetries) {
        console.warn(`⚠️ Request failed, retry ${retryCount + 1}/${this.maxRetries}:`, error.message);
        await this.sleep(Math.pow(2, retryCount) * 1000);
        return this.makeRequest(endpoint, params, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Fetch characters from Marvel API
   */
  async fetchCharacters(limit: number = 100, offset: number = 0): Promise<MarvelAPIResponse<MarvelCharacter>> {
    return this.makeRequest<MarvelCharacter>('characters', {
      limit: Math.min(limit, 100), // Marvel max is 100 per request
      offset,
      orderBy: 'name'
    });
  }

  /**
   * Fetch comics from Marvel API
   */
  async fetchComics(limit: number = 100, offset: number = 0): Promise<MarvelAPIResponse<MarvelComic>> {
    return this.makeRequest<MarvelComic>('comics', {
      limit: Math.min(limit, 100),
      offset,
      orderBy: 'title'
    });
  }

  /**
   * Fetch creators from Marvel API
   */
  async fetchCreators(limit: number = 100, offset: number = 0): Promise<MarvelAPIResponse<MarvelCreator>> {
    return this.makeRequest<MarvelCreator>('creators', {
      limit: Math.min(limit, 100),
      offset,
      orderBy: 'lastName'
    });
  }

  /**
   * Generate deterministic symbol from Marvel entity
   */
  private generateSymbol(name: string, variant: string | null, marvelId: number): string {
    const normalized = name.trim().toUpperCase();
    const variantPart = variant ? `_${variant.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')}` : '';
    const input = `${normalized}${variantPart}_MARVEL_${marvelId}`;
    
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    const hashNum = BigInt('0x' + hash.slice(0, 16));
    const base36 = (hashNum % BigInt(36 ** 11)).toString(36).toUpperCase().padStart(11, '0');
    
    return `M.${base36}`;
  }

  /**
   * Transform Marvel character into tradeable asset
   */
  private async transformCharacter(character: MarvelCharacter): Promise<PricedAsset> {
    const name = character.name;
    const symbol = this.generateSymbol(name, null, character.id);
    
    // Classify tier based on appearance count
    const appearanceCount = character.comics.available + character.stories.available;
    const tier = tierClassificationService.classifyCharacter({
      name,
      appearances: appearanceCount,
      franchise: 'Marvel',
      publisher: 'Marvel'
    });

    // Build image URL
    const imageUrl = character.thumbnail && character.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
      ? `${character.thumbnail.path}.${character.thumbnail.extension}`
      : undefined;

    // Generate pricing using unified engine
    const pricing = await unifiedPricingEngine.calculateAssetPrice({
      type: 'character',
      name,
      publisher: 'Marvel',
      tier,
      appearances: appearanceCount,
      debutYear: new Date(character.modified).getFullYear(),
      franchise: 'Marvel',
      metadata: {
        marvelId: character.id,
        comics: character.comics.available,
        series: character.series.available,
        stories: character.stories.available,
        events: character.events.available
      }
    });

    return {
      type: 'character',
      name,
      symbol,
      category: 'Marvel Character',
      description: character.description || `Marvel character ${name}`,
      imageUrl,
      tier,
      pricing,
      metadata: {
        source: 'marvel',
        marvelId: character.id,
        resourceURI: character.resourceURI,
        comics: character.comics.available,
        series: character.series.available,
        stories: character.stories.available,
        events: character.events.available,
        modified: character.modified,
        urls: character.urls
      }
    };
  }

  /**
   * Transform Marvel comic into tradeable asset
   */
  private async transformComic(comic: MarvelComic): Promise<PricedAsset> {
    const name = comic.title;
    const variant = comic.variantDescription || null;
    const symbol = this.generateSymbol(name, variant, comic.id);
    
    // Extract year from dates
    const onsaleDate = comic.dates.find(d => d.type === 'onsaleDate');
    const debutYear = onsaleDate ? new Date(onsaleDate.date).getFullYear() : new Date().getFullYear();
    
    // Determine tier based on creators and format
    const tier = tierClassificationService.classifyComic({
      title: name,
      debutYear,
      publisher: 'Marvel',
      format: comic.format,
      creators: comic.creators.items.map(c => ({ name: c.name, role: c.role }))
    });

    const imageUrl = comic.thumbnail && comic.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
      ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
      : undefined;

    const pricing = await unifiedPricingEngine.calculateAssetPrice({
      type: 'comic',
      name,
      variant,
      publisher: 'Marvel',
      tier,
      debutYear,
      franchise: 'Marvel',
      metadata: {
        marvelId: comic.id,
        issueNumber: comic.issueNumber,
        format: comic.format,
        pageCount: comic.pageCount,
        creators: comic.creators.available,
        characters: comic.characters.available
      }
    });

    return {
      type: 'comic',
      name,
      baseName: name,
      variant,
      symbol,
      category: 'Marvel Comic',
      description: comic.description || `${name} #${comic.issueNumber}`,
      imageUrl,
      coverImageUrl: imageUrl,
      tier,
      pricing,
      metadata: {
        source: 'marvel',
        marvelId: comic.id,
        digitalId: comic.digitalId,
        issueNumber: comic.issueNumber,
        variantDescription: comic.variantDescription,
        isbn: comic.isbn,
        upc: comic.upc,
        format: comic.format,
        pageCount: comic.pageCount,
        series: comic.series.name,
        dates: comic.dates,
        prices: comic.prices,
        creators: comic.creators.items,
        characters: comic.characters.items,
        modified: comic.modified
      }
    };
  }

  /**
   * Transform Marvel creator into tradeable asset
   */
  private async transformCreator(creator: MarvelCreator): Promise<PricedAsset> {
    const name = creator.fullName;
    const symbol = this.generateSymbol(name, null, creator.id);
    
    // Classify tier based on work count
    const workCount = creator.comics.available + creator.series.available;
    const tier = tierClassificationService.classifyCreator({
      name,
      worksCount: workCount,
      publisher: 'Marvel'
    });

    const imageUrl = creator.thumbnail && creator.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
      ? `${creator.thumbnail.path}.${creator.thumbnail.extension}`
      : undefined;

    const pricing = await unifiedPricingEngine.calculateAssetPrice({
      type: 'creator',
      name,
      publisher: 'Marvel',
      tier,
      metadata: {
        marvelId: creator.id,
        comics: creator.comics.available,
        series: creator.series.available,
        stories: creator.stories.available,
        events: creator.events.available
      }
    });

    return {
      type: 'creator',
      name,
      symbol,
      category: 'Marvel Creator',
      description: `Marvel creator - ${name}`,
      imageUrl,
      tier,
      pricing,
      metadata: {
        source: 'marvel',
        marvelId: creator.id,
        firstName: creator.firstName,
        middleName: creator.middleName,
        lastName: creator.lastName,
        suffix: creator.suffix,
        resourceURI: creator.resourceURI,
        comics: creator.comics.available,
        series: creator.series.available,
        stories: creator.stories.available,
        events: creator.events.available,
        modified: creator.modified,
        urls: creator.urls
      }
    };
  }

  /**
   * Expand Marvel characters into tradeable assets
   */
  async expandCharacters(startOffset: number = 0, maxToProcess: number = 1000): Promise<ExpansionProgress> {
    const progress: ExpansionProgress = {
      resourceType: 'characters',
      totalAvailable: 0,
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      lastOffset: startOffset,
      isComplete: false,
      rate: 0
    };

    const startTime = Date.now();

    try {
      // Fetch first batch to get total count
      const firstBatch = await this.fetchCharacters(100, startOffset);
      progress.totalAvailable = firstBatch.data.total;

      console.log(`\n🦸 Marvel Character Expansion Started`);
      console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);
      console.log(`   Starting Offset: ${startOffset}`);
      console.log(`   Max To Process: ${maxToProcess}`);

      let currentOffset = startOffset;
      let processedCount = 0;

      while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
        const batch = currentOffset === startOffset 
          ? firstBatch 
          : await this.fetchCharacters(100, currentOffset);

        if (batch.data.results.length === 0) {
          break;
        }

        // Transform to assets
        const assets: PricedAsset[] = [];
        for (const character of batch.data.results) {
          try {
            const asset = await this.transformCharacter(character);
            assets.push(asset);
            progress.processed++;
          } catch (error: any) {
            console.error(`❌ Error transforming character ${character.name}:`, error.message);
            progress.errors++;
          }
        }

        // Bulk insert
        if (assets.length > 0) {
          const result = await assetInsertionService.insertAssets(assets);
          progress.inserted += result.inserted;
          progress.skipped += result.skipped;
          progress.errors += result.errors;
        }

        currentOffset += batch.data.count;
        progress.lastOffset = currentOffset;
        processedCount += batch.data.count;

        const elapsed = (Date.now() - startTime) / 1000;
        progress.rate = progress.processed / elapsed;

        console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);

        if (processedCount >= maxToProcess) {
          break;
        }
      }

      progress.isComplete = currentOffset >= progress.totalAvailable;

      const totalTime = (Date.now() - startTime) / 1000;
      console.log(`\n✅ Marvel Character Expansion Complete`);
      console.log(`   Processed: ${progress.processed.toLocaleString()}`);
      console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
      console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
      console.log(`   Errors: ${progress.errors}`);
      console.log(`   Time: ${totalTime.toFixed(1)}s`);
      console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);

      return progress;
    } catch (error: any) {
      console.error('❌ Marvel character expansion failed:', error);
      throw error;
    }
  }

  /**
   * Expand Marvel comics into tradeable assets
   */
  async expandComics(startOffset: number = 0, maxToProcess: number = 1000): Promise<ExpansionProgress> {
    const progress: ExpansionProgress = {
      resourceType: 'comics',
      totalAvailable: 0,
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      lastOffset: startOffset,
      isComplete: false,
      rate: 0
    };

    const startTime = Date.now();

    try {
      const firstBatch = await this.fetchComics(100, startOffset);
      progress.totalAvailable = firstBatch.data.total;

      console.log(`\n📚 Marvel Comic Expansion Started`);
      console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);
      console.log(`   Starting Offset: ${startOffset}`);
      console.log(`   Max To Process: ${maxToProcess}`);

      let currentOffset = startOffset;
      let processedCount = 0;

      while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
        const batch = currentOffset === startOffset 
          ? firstBatch 
          : await this.fetchComics(100, currentOffset);

        if (batch.data.results.length === 0) {
          break;
        }

        const assets: PricedAsset[] = [];
        for (const comic of batch.data.results) {
          try {
            const asset = await this.transformComic(comic);
            assets.push(asset);
            progress.processed++;
          } catch (error: any) {
            console.error(`❌ Error transforming comic ${comic.title}:`, error.message);
            progress.errors++;
          }
        }

        if (assets.length > 0) {
          const result = await assetInsertionService.insertAssets(assets);
          progress.inserted += result.inserted;
          progress.skipped += result.skipped;
          progress.errors += result.errors;
        }

        currentOffset += batch.data.count;
        progress.lastOffset = currentOffset;
        processedCount += batch.data.count;

        const elapsed = (Date.now() - startTime) / 1000;
        progress.rate = progress.processed / elapsed;

        console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);

        if (processedCount >= maxToProcess) {
          break;
        }
      }

      progress.isComplete = currentOffset >= progress.totalAvailable;

      const totalTime = (Date.now() - startTime) / 1000;
      console.log(`\n✅ Marvel Comic Expansion Complete`);
      console.log(`   Processed: ${progress.processed.toLocaleString()}`);
      console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
      console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
      console.log(`   Errors: ${progress.errors}`);
      console.log(`   Time: ${totalTime.toFixed(1)}s`);
      console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);

      return progress;
    } catch (error: any) {
      console.error('❌ Marvel comic expansion failed:', error);
      throw error;
    }
  }

  /**
   * Expand Marvel creators into tradeable assets
   */
  async expandCreators(startOffset: number = 0, maxToProcess: number = 1000): Promise<ExpansionProgress> {
    const progress: ExpansionProgress = {
      resourceType: 'creators',
      totalAvailable: 0,
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      lastOffset: startOffset,
      isComplete: false,
      rate: 0
    };

    const startTime = Date.now();

    try {
      const firstBatch = await this.fetchCreators(100, startOffset);
      progress.totalAvailable = firstBatch.data.total;

      console.log(`\n✍️ Marvel Creator Expansion Started`);
      console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);
      console.log(`   Starting Offset: ${startOffset}`);
      console.log(`   Max To Process: ${maxToProcess}`);

      let currentOffset = startOffset;
      let processedCount = 0;

      while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
        const batch = currentOffset === startOffset 
          ? firstBatch 
          : await this.fetchCreators(100, currentOffset);

        if (batch.data.results.length === 0) {
          break;
        }

        const assets: PricedAsset[] = [];
        for (const creator of batch.data.results) {
          try {
            const asset = await this.transformCreator(creator);
            assets.push(asset);
            progress.processed++;
          } catch (error: any) {
            console.error(`❌ Error transforming creator ${creator.fullName}:`, error.message);
            progress.errors++;
          }
        }

        if (assets.length > 0) {
          const result = await assetInsertionService.insertAssets(assets);
          progress.inserted += result.inserted;
          progress.skipped += result.skipped;
          progress.errors += result.errors;
        }

        currentOffset += batch.data.count;
        progress.lastOffset = currentOffset;
        processedCount += batch.data.count;

        const elapsed = (Date.now() - startTime) / 1000;
        progress.rate = progress.processed / elapsed;

        console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);

        if (processedCount >= maxToProcess) {
          break;
        }
      }

      progress.isComplete = currentOffset >= progress.totalAvailable;

      const totalTime = (Date.now() - startTime) / 1000;
      console.log(`\n✅ Marvel Creator Expansion Complete`);
      console.log(`   Processed: ${progress.processed.toLocaleString()}`);
      console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
      console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
      console.log(`   Errors: ${progress.errors}`);
      console.log(`   Time: ${totalTime.toFixed(1)}s`);
      console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);

      return progress;
    } catch (error: any) {
      console.error('❌ Marvel creator expansion failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const marvelExpansionService = new MarvelExpansionService();
