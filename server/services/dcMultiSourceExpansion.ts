/**
 * DC Multi-Source Expansion Service
 * 
 * Combines multiple free DC data sources to create comprehensive asset catalog:
 * 1. Metron API (https://metron.cloud) - Community-curated DC comics, characters, series
 * 2. Grand Comics Database (https://www.comics.org/api/) - 200K+ issues including DC
 * 
 * NO API keys required - both are free public APIs
 * Goal: Expand from 401K to 1M+ assets by mining all DC sources
 */

import { createHash } from 'crypto';
import { tierClassificationService } from './tierClassificationService';
import { unifiedPricingEngine } from './unifiedPricingEngine';
import { assetInsertionService } from './assetInsertionService';

// PricedAsset type matching AssetInsertionService interface
export interface PricedAsset {
  type: 'character' | 'creator' | 'comic';
  name: string;
  symbol: string;
  currentPrice: number;
  totalMarketValue: number;
  totalFloat: number;
  category?: string;
  tier?: number;
  source?: string;
  metadata?: any;
}

// Metron API types
interface MetronCharacter {
  id: number;
  name: string;
  alias: string[];
  image?: string;
  desc?: string;
  creators: Array<{
    name: string;
    role: string;
  }>;
  teams: Array<{
    name: string;
  }>;
  first_appearance?: {
    name: string;
    issue: string;
  };
}

interface MetronSeries {
  id: number;
  name: string;
  sort_name: string;
  publisher: { name: string };
  year_began: number;
  year_end?: number;
  issue_count: number;
  desc?: string;
  image?: string;
}

interface MetronIssue {
  id: number;
  series: { name: string };
  number: string;
  cover_date: string;
  image?: string;
  story_titles: string[];
  creators: Array<{
    name: string;
    role: string;
  }>;
  characters: Array<{ name: string }>;
}

// GCD API types
interface GCDIssue {
  id: number;
  series: {
    name: string;
    publisher: { name: string };
    year_began: number;
  };
  number: string;
  publication_date: string;
  price?: string;
  page_count?: number;
  story_set: Array<{
    title: string;
    feature: string;
    credits: Array<{
      creator: { name: string };
      credit_type: { name: string };
    }>;
  }>;
}

interface ExpansionProgress {
  source: string;
  processed: number;
  inserted: number;
  skipped: number;
  errors: number;
  totalAvailable: number;
  lastOffset: number;
  isComplete: boolean;
  rate: number;
}

export class DCMultiSourceExpansionService {
  private readonly metronBaseUrl = 'https://metron.cloud/api';
  private readonly gcdBaseUrl = 'https://www.comics.org/api';
  private readonly rateLimit = 1000; // 1 second between requests
  private lastRequestTime = 0;

  /**
   * Generate deterministic symbol using SHA-256 hash
   */
  private generateSymbol(name: string, variant: string | null, sourceId: number): string {
    const normalized = `${name.toLowerCase().trim()}${variant ? `-${variant.toLowerCase().trim()}` : ''}-dc-${sourceId}`;
    const hash = createHash('sha256').update(normalized).digest('hex');
    
    // Use modulo arithmetic for base-36 suffix
    const hashValue = BigInt(`0x${hash.substring(0, 16)}`);
    const base36Space = BigInt('131621703842267136'); // 36^11
    const suffix = (hashValue % base36Space).toString(36).padStart(11, '0').toUpperCase();
    
    if (variant) {
      const variantCode = variant.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
      return `${name.substring(0, 2).toUpperCase()}.${variantCode}.${suffix}`;
    }
    
    return `${name.substring(0, 1).toUpperCase()}.${suffix}`;
  }

  /**
   * Enforce rate limiting
   */
  private async rateLimitWait(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimit) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimit - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Fetch from Metron API with rate limiting
   */
  private async fetchMetron<T>(endpoint: string): Promise<{ results: T[]; count: number }> {
    await this.rateLimitWait();
    
    const url = `${this.metronBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PanelProfits/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Metron API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch from GCD API with rate limiting
   */
  private async fetchGCD<T>(endpoint: string): Promise<{ results: T[]; count: number }> {
    await this.rateLimitWait();
    
    const url = `${this.gcdBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PanelProfits/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`GCD API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch DC characters from Metron
   */
  async fetchMetronCharacters(limit: number, offset: number): Promise<{ results: MetronCharacter[]; count: number }> {
    return await this.fetchMetron<MetronCharacter>(
      `/character/?limit=${limit}&offset=${offset}&publisher=1` // Publisher ID 1 = DC Comics
    );
  }

  /**
   * Fetch DC series from Metron
   */
  async fetchMetronSeries(limit: number, offset: number): Promise<{ results: MetronSeries[]; count: number }> {
    return await this.fetchMetron<MetronSeries>(
      `/series/?limit=${limit}&offset=${offset}&publisher=1`
    );
  }

  /**
   * Fetch DC issues from Metron
   */
  async fetchMetronIssues(limit: number, offset: number): Promise<{ results: MetronIssue[]; count: number }> {
    return await this.fetchMetron<MetronIssue>(
      `/issue/?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Fetch DC issues from GCD
   */
  async fetchGCDIssues(limit: number, offset: number): Promise<{ results: GCDIssue[]; count: number }> {
    return await this.fetchGCD<GCDIssue>(
      `/issue/?limit=${limit}&offset=${offset}&series__publisher__name__icontains=DC`
    );
  }

  /**
   * Determine era from year
   */
  private determineEra(year: number): 'golden' | 'silver' | 'bronze' | 'modern' {
    if (year >= 1938 && year <= 1955) return 'golden';
    if (year >= 1956 && year <= 1970) return 'silver';
    if (year >= 1971 && year <= 1985) return 'bronze';
    return 'modern';
  }

  /**
   * Transform Metron character to PricedAsset
   */
  private async transformMetronCharacter(character: MetronCharacter): Promise<PricedAsset> {
    const name = character.name;
    const variant = character.alias.length > 0 ? character.alias[0] : null;
    const symbol = this.generateSymbol(name, variant, character.id);
    
    // Classify tier
    const classification = tierClassificationService.classifyCharacter({
      name
    });
    
    // Determine era from first appearance
    let era: 'golden' | 'silver' | 'bronze' | 'modern' = 'modern';
    if (character.first_appearance?.issue) {
      // Try to extract year from issue string
      const yearMatch = character.first_appearance.issue.match(/\((\d{4})\)/);
      if (yearMatch) {
        era = this.determineEra(parseInt(yearMatch[1]));
      }
    }
    
    // Calculate price
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'character',
      name,
      variantOf: variant || undefined,
      era,
      franchiseTier: classification.tier,
      keyAppearances: 0 // Metron doesn't provide this
    });
    
    return {
      type: 'character',
      name,
      symbol,
      currentPrice: pricingResult.sharePrice,
      totalMarketValue: pricingResult.totalMarketValue,
      totalFloat: pricingResult.totalFloat,
      category: 'DC',
      tier: classification.tier,
      source: 'metron',
      metadata: {
        metronId: character.id,
        alias: character.alias,
        description: character.desc,
        imageUrl: character.image,
        teams: character.teams.map(t => t.name),
        creators: character.creators.map(c => ({
          name: c.name,
          role: c.role
        })),
        firstAppearance: character.first_appearance,
        variant,
        era,
        pricingBreakdown: pricingResult.breakdown
      }
    };
  }

  /**
   * Transform Metron series to PricedAsset
   */
  private async transformMetronSeries(series: MetronSeries): Promise<PricedAsset> {
    const name = series.name;
    const symbol = this.generateSymbol(name, null, series.id);
    const era = this.determineEra(series.year_began);
    
    // Calculate price for series (using comic pricing)
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'comic',
      name,
      era
    });
    
    return {
      type: 'comic',
      name,
      symbol,
      currentPrice: pricingResult.sharePrice,
      totalMarketValue: pricingResult.totalMarketValue,
      totalFloat: pricingResult.totalFloat,
      category: 'DC',
      tier: 2,
      source: 'metron',
      metadata: {
        metronId: series.id,
        seriesName: series.name,
        publisher: series.publisher.name,
        yearBegan: series.year_began,
        yearEnd: series.year_end,
        issueCount: series.issue_count,
        description: series.desc,
        imageUrl: series.image,
        era,
        pricingBreakdown: pricingResult.breakdown
      }
    };
  }

  /**
   * Transform Metron issue to PricedAsset
   */
  private async transformMetronIssue(issue: MetronIssue): Promise<PricedAsset> {
    const name = `${issue.series.name} #${issue.number}`;
    const symbol = this.generateSymbol(name, null, issue.id);
    
    // Determine era from cover date
    const yearMatch = issue.cover_date.match(/\d{4}/);
    const era = yearMatch ? this.determineEra(parseInt(yearMatch[0])) : 'modern';
    
    // Calculate price for issue
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'comic',
      name,
      era
    });
    
    return {
      type: 'comic',
      name,
      symbol,
      currentPrice: pricingResult.sharePrice,
      totalMarketValue: pricingResult.totalMarketValue,
      totalFloat: pricingResult.totalFloat,
      category: 'DC',
      tier: 2,
      source: 'metron',
      metadata: {
        metronId: issue.id,
        seriesName: issue.series.name,
        issueNumber: issue.number,
        coverDate: issue.cover_date,
        storyTitles: issue.story_titles,
        imageUrl: issue.image,
        creators: issue.creators.map(c => ({
          name: c.name,
          role: c.role
        })),
        characters: issue.characters.map(c => c.name),
        era,
        pricingBreakdown: pricingResult.breakdown
      }
    };
  }

  /**
   * Transform GCD issue to PricedAsset
   */
  private async transformGCDIssue(issue: GCDIssue): Promise<PricedAsset> {
    const name = `${issue.series.name} #${issue.number}`;
    const symbol = this.generateSymbol(name, null, issue.id);
    const era = this.determineEra(issue.series.year_began);
    
    // Calculate price for issue
    const pricingResult = unifiedPricingEngine.calculatePrice({
      assetType: 'comic',
      name,
      era
    });
    
    return {
      type: 'comic',
      name,
      symbol,
      currentPrice: pricingResult.sharePrice,
      totalMarketValue: pricingResult.totalMarketValue,
      totalFloat: pricingResult.totalFloat,
      category: 'DC',
      tier: 2,
      source: 'gcd',
      metadata: {
        gcdId: issue.id,
        seriesName: issue.series.name,
        publisher: issue.series.publisher.name,
        issueNumber: issue.number,
        publicationDate: issue.publication_date,
        price: issue.price,
        pageCount: issue.page_count,
        stories: issue.story_set.map(s => ({
          title: s.title,
          feature: s.feature,
          credits: s.credits.map(c => ({
            name: c.creator.name,
            role: c.credit_type.name
          }))
        })),
        era,
        pricingBreakdown: pricingResult.breakdown
      }
    };
  }

  /**
   * Expand DC characters from Metron
   */
  async expandMetronCharacters(startOffset: number = 0, maxToProcess: number = 1000): Promise<ExpansionProgress> {
    const startTime = Date.now();
    
    const progress: ExpansionProgress = {
      source: 'metron-characters',
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      totalAvailable: 0,
      lastOffset: startOffset,
      isComplete: false,
      rate: 0
    };

    try {
      console.log(`\n🦸 Expanding DC Characters from Metron`);
      console.log(`   Start Offset: ${startOffset}`);
      console.log(`   Max To Process: ${maxToProcess}`);

      // Fetch first batch to get total count
      const firstBatch = await this.fetchMetronCharacters(100, startOffset);
      progress.totalAvailable = firstBatch.count;
      
      console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);

      let currentOffset = startOffset;
      let processedCount = 0;

      while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
        const batch = currentOffset === startOffset 
          ? firstBatch 
          : await this.fetchMetronCharacters(100, currentOffset);

        if (batch.results.length === 0) {
          break;
        }

        const assets: PricedAsset[] = [];
        for (const character of batch.results) {
          try {
            const asset = await this.transformMetronCharacter(character);
            assets.push(asset);
            progress.processed++;
          } catch (error: any) {
            console.error(`❌ Error transforming character ${character.name}:`, error.message);
            progress.errors++;
          }
        }

        if (assets.length > 0) {
          const result = await assetInsertionService.insertPricedAssets(assets);
          progress.inserted += result.inserted;
          progress.skipped += result.skipped;
          progress.errors += result.errors;
        }

        currentOffset += batch.results.length;
        progress.lastOffset = currentOffset;
        processedCount += batch.results.length;

        const elapsed = (Date.now() - startTime) / 1000;
        progress.rate = progress.processed / elapsed;

        console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);

        if (processedCount >= maxToProcess) {
          break;
        }
      }

      progress.isComplete = currentOffset >= progress.totalAvailable;

      const totalTime = (Date.now() - startTime) / 1000;
      console.log(`\n✅ Metron Character Expansion Complete`);
      console.log(`   Processed: ${progress.processed.toLocaleString()}`);
      console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
      console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
      console.log(`   Errors: ${progress.errors}`);
      console.log(`   Time: ${totalTime.toFixed(1)}s`);
      console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);

      return progress;
    } catch (error: any) {
      console.error('❌ Fatal error in Metron character expansion:', error);
      throw error;
    }
  }

  /**
   * Expand DC comics from GCD
   */
  async expandGCDIssues(startOffset: number = 0, maxToProcess: number = 1000): Promise<ExpansionProgress> {
    const startTime = Date.now();
    
    const progress: ExpansionProgress = {
      source: 'gcd-issues',
      processed: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      totalAvailable: 0,
      lastOffset: startOffset,
      isComplete: false,
      rate: 0
    };

    try {
      console.log(`\n📚 Expanding DC Comics from GCD`);
      console.log(`   Start Offset: ${startOffset}`);
      console.log(`   Max To Process: ${maxToProcess}`);

      // Fetch first batch to get total count
      const firstBatch = await this.fetchGCDIssues(100, startOffset);
      progress.totalAvailable = firstBatch.count;
      
      console.log(`   Total Available: ${progress.totalAvailable.toLocaleString()}`);

      let currentOffset = startOffset;
      let processedCount = 0;

      while (processedCount < maxToProcess && currentOffset < progress.totalAvailable) {
        const batch = currentOffset === startOffset 
          ? firstBatch 
          : await this.fetchGCDIssues(100, currentOffset);

        if (batch.results.length === 0) {
          break;
        }

        const assets: PricedAsset[] = [];
        for (const issue of batch.results) {
          try {
            const asset = await this.transformGCDIssue(issue);
            assets.push(asset);
            progress.processed++;
          } catch (error: any) {
            console.error(`❌ Error transforming issue ${issue.series.name} #${issue.number}:`, error.message);
            progress.errors++;
          }
        }

        if (assets.length > 0) {
          const result = await assetInsertionService.insertPricedAssets(assets);
          progress.inserted += result.inserted;
          progress.skipped += result.skipped;
          progress.errors += result.errors;
        }

        currentOffset += batch.results.length;
        progress.lastOffset = currentOffset;
        processedCount += batch.results.length;

        const elapsed = (Date.now() - startTime) / 1000;
        progress.rate = progress.processed / elapsed;

        console.log(`   Progress: ${progress.processed}/${maxToProcess} | Inserted: ${progress.inserted} | Rate: ${progress.rate.toFixed(1)}/s`);

        if (processedCount >= maxToProcess) {
          break;
        }
      }

      progress.isComplete = currentOffset >= progress.totalAvailable;

      const totalTime = (Date.now() - startTime) / 1000;
      console.log(`\n✅ GCD Issue Expansion Complete`);
      console.log(`   Processed: ${progress.processed.toLocaleString()}`);
      console.log(`   Inserted: ${progress.inserted.toLocaleString()}`);
      console.log(`   Skipped: ${progress.skipped.toLocaleString()}`);
      console.log(`   Errors: ${progress.errors}`);
      console.log(`   Time: ${totalTime.toFixed(1)}s`);
      console.log(`   Rate: ${progress.rate.toFixed(1)} assets/sec`);

      return progress;
    } catch (error: any) {
      console.error('❌ Fatal error in GCD issue expansion:', error);
      throw error;
    }
  }
}

export const dcMultiSourceExpansionService = new DCMultiSourceExpansionService();
