import { pineconeService } from './pineconeService';
import { openaiService } from './openaiService';
import { priceChartingService } from './priceChartingService';
import type { ComicPricesByGrade } from './priceChartingService';
import crypto from 'crypto';

/**
 * Pinecone Asset Expansion Service
 * Transforms 64K Pinecone records into millions of tradeable assets
 */

interface PineconeRecord {
  id: string;
  metadata: {
    category?: string;
    filename?: string;
    filepath?: string;
    processed_date?: string;
    publisher?: string;
    name?: string;
    description?: string;
    type?: string;
    modified?: string;
  };
}

export class PineconeAssetExpansionService {
  /**
   * Helper function to add delay for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Enrich asset with real market pricing data
   * Handles API failures gracefully with fallback to estimates
   */
  async enrichAssetWithPricing(asset: any): Promise<any> {
    try {
      let pricing: {
        currentPrice: number;
        source: string;
        lastUpdated: string;
        grades?: any;
        highestPrice?: number;
        bestGrade?: string;
      } | null = null;

      if (asset.type === 'character') {
        const characterName = asset.baseName || asset.name;
        console.log(`💰 Fetching price for character: ${characterName}`);
        
        const price = await priceChartingService.getPriceForCharacter(characterName);
        
        pricing = {
          currentPrice: price,
          source: 'pricecharting',
          lastUpdated: new Date().toISOString()
        };
        
        console.log(`   ✅ Character price: $${price.toLocaleString()}`);
      } 
      else if (asset.type === 'creator') {
        console.log(`💰 Fetching price for creator: ${asset.name}`);
        
        const price = await priceChartingService.getPriceForCreator(asset.name);
        
        pricing = {
          currentPrice: price,
          source: 'pricecharting',
          lastUpdated: new Date().toISOString()
        };
        
        console.log(`   ✅ Creator price: $${price.toLocaleString()}`);
      } 
      else if (asset.type === 'comic') {
        console.log(`💰 Fetching CGC prices for comic: ${asset.name}`);
        
        const gradeData: ComicPricesByGrade | null = await priceChartingService.getComicPricesByGrade(asset.name);
        
        if (gradeData) {
          pricing = {
            currentPrice: gradeData.highestPrice || 0,
            source: 'pricecharting',
            lastUpdated: new Date().toISOString(),
            grades: gradeData.grades,
            highestPrice: gradeData.highestPrice,
            bestGrade: gradeData.bestGrade
          };
          
          console.log(`   ✅ Comic highest price: $${gradeData.highestPrice?.toLocaleString() || 'N/A'} (${gradeData.bestGrade})`);
        } else {
          const estimatedPrice = Math.random() * 5000 + 500;
          pricing = {
            currentPrice: Math.round(estimatedPrice),
            source: 'estimate',
            lastUpdated: new Date().toISOString()
          };
          console.log(`   ⚠️ Using estimated price: $${pricing.currentPrice.toLocaleString()}`);
        }
      }

      return {
        ...asset,
        pricing
      };
    } catch (error) {
      console.warn(`⚠️ Failed to fetch pricing for ${asset.type} "${asset.name}":`, error instanceof Error ? error.message : 'Unknown error');
      
      const fallbackPrice = asset.type === 'character' ? Math.random() * 10000 + 1000 :
                            asset.type === 'creator' ? Math.random() * 25000 + 5000 :
                            Math.random() * 5000 + 500;
      
      return {
        ...asset,
        pricing: {
          currentPrice: Math.round(fallbackPrice),
          source: 'estimate',
          lastUpdated: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Fetch all records from Pinecone by category
   * Uses multiple search strategies to get diverse results
   */
  async fetchRecordsByCategory(category: 'Characters' | 'Creators' | 'Comics', limit: number = 1000): Promise<PineconeRecord[]> {
    try {
      // Use multiple queries per category for better diversity
      const queries: Record<string, string[]> = {
        Characters: [
          "Marvel superhero character Spider-Man Batman",
          "DC character powers abilities origin story",
          "comic book hero villain mutant team",
          "X-Men Avengers Justice League character profile"
        ],
        Creators: [
          "comic book artist writer Stan Lee Jack Kirby",
          "penciler inker colorist letterer creator",
          "Marvel DC artist illustrator author",
          "comic book creator biography portfolio"
        ],
        Comics: [
          "comic book issue #1 Amazing Spider-Man",
          "Detective Comics Action Comics series",
          "Marvel comic book publication volume",
          "X-Men comic issue story arc event"
        ]
      };

      const allResults: PineconeRecord[] = [];
      const seenIds = new Set<string>();

      // Run multiple queries to get diverse results
      for (const query of queries[category]) {
        const embedding = await openaiService.generateEmbedding(query);
        
        if (!embedding) {
          console.warn(`⚠️ Failed to generate embedding for query: "${query.substring(0, 50)}..."`);
          continue;
        }

        const results = await pineconeService.querySimilar(embedding, Math.ceil(limit / queries[category].length));
        
        if (!results) continue;

        // Filter and deduplicate
        for (const match of results) {
          if (seenIds.has(match.id)) continue;
          
          // Check if it matches our category
          const matchesCategory = 
            (category === 'Characters' && match.metadata?.category === 'Characters') ||
            (category === 'Creators' && match.metadata?.category === 'Creators') ||
            (category === 'Comics' && (match.metadata?.type === 'comics' || match.id.startsWith('comics_')));

          if (matchesCategory) {
            allResults.push({
              id: match.id,
              metadata: match.metadata || {}
            });
            seenIds.add(match.id);
          }
        }
      }

      console.log(`✅ Fetched ${allResults.length} ${category} records from Pinecone`);
      return allResults.slice(0, limit);
    } catch (error) {
      console.error(`❌ Error fetching ${category} records:`, error);
      return [];
    }
  }

  /**
   * Sample diverse records across all categories
   */
  async sampleDiverseRecords(samplesPerCategory: number = 100): Promise<{
    characters: PineconeRecord[];
    creators: PineconeRecord[];
    comics: PineconeRecord[];
  }> {
    console.log('🔍 Sampling diverse records from Pinecone...');
    
    const [characters, creators, comics] = await Promise.all([
      this.fetchRecordsByCategory('Characters', samplesPerCategory),
      this.fetchRecordsByCategory('Creators', samplesPerCategory),
      this.fetchRecordsByCategory('Comics', samplesPerCategory)
    ]);

    return { characters, creators, comics };
  }

  /**
   * Extract character name from filename
   */
  extractCharacterName(filename: string): string {
    return filename.replace('.md', '').replace(/_/g, ' ');
  }

  /**
   * Parse character incarnation details
   * Example: "Captain America (House of M)" → { base: "Captain America", variant: "House of M" }
   */
  parseCharacterIncarnation(name: string): {
    baseName: string;
    variant: string | null;
    fullName: string;
  } {
    const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (match) {
      return {
        baseName: match[1].trim(),
        variant: match[2].trim(),
        fullName: name
      };
    }
    return {
      baseName: name,
      variant: null,
      fullName: name
    };
  }

  /**
   * Extract creator name from filename
   */
  extractCreatorName(filename: string): string {
    return filename.replace('.md', '').replace(/_/g, ' ');
  }

  /**
   * Generate asset symbol from name
   * For variants, includes variant suffix: "CAP.HOM" for "Captain America (House of M)"
   * Adds deterministic hash suffix to prevent collisions while maintaining idempotency
   * Uses crypto hash for strong collision resistance at scale
   */
  generateAssetSymbol(name: string, variant?: string | null, pineconeId?: string): string {
    // Parse base name and variant if not provided
    const parsed = variant !== undefined ? 
      { baseName: name, variant } : 
      this.parseCharacterIncarnation(name);

    // Generate base symbol from first letters
    const words = parsed.baseName.split(' ').filter(w => w.length > 0);
    let baseSymbol = words
      .map(w => w[0].toUpperCase())
      .join('')
      .substring(0, 5);
    
    // If variant exists, add variant suffix
    if (parsed.variant) {
      const variantWords = parsed.variant.split(' ').filter(w => w.length > 0);
      const variantSuffix = variantWords
        .map(w => w[0].toUpperCase())
        .join('')
        .substring(0, 3);
      baseSymbol = `${baseSymbol}.${variantSuffix}`;
    }
    
    // Add deterministic crypto hash suffix for strong collision resistance
    // Uses SHA-256 with fixed 11-char base-36 suffix (36^11 ≈ 131 quadrillion unique values)
    // Input: normalized name + variant + pineconeId for deterministic uniqueness
    const hashInput = `${parsed.baseName.toLowerCase()}|${parsed.variant?.toLowerCase() || ''}|${pineconeId || ''}`;
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
    // Use BigInt to map full hash into 36^11 symbol space (≈56.5 bits for 131Q range)
    // Take first 16 hex chars (64 bits) and reduce modulo 36^11 for uniform distribution
    // Provides <0.01% collision probability at 1M assets, <0.04% at 10M assets
    const hashBigInt = BigInt('0x' + hash.substring(0, 16));
    const symbolSpace = BigInt(36 ** 11); // 131,621,703,842,267,136
    const hashMod = hashBigInt % symbolSpace;
    const hashSuffix = hashMod.toString(36).toUpperCase().padStart(11, '0');
    
    return `${baseSymbol || 'ASSET'}.${hashSuffix}`;
  }

  /**
   * Transform Pinecone records into asset proposals
   * Now includes pricing enrichment with rate limiting
   */
  async transformRecordsToAssets(records: {
    characters: PineconeRecord[];
    creators: PineconeRecord[];
    comics: PineconeRecord[];
  }): Promise<{
    characterAssets: any[];
    creatorAssets: any[];
    comicAssets: any[];
  }> {
    console.log('🔄 Transforming Pinecone records into tradeable assets...');

    // Transform characters (with incarnation support)
    const characterAssets = records.characters.map(record => {
      const fullName = record.metadata.filename 
        ? this.extractCharacterName(record.metadata.filename)
        : record.id;
      
      const incarnation = this.parseCharacterIncarnation(fullName);
      
      return {
        type: 'character',
        name: incarnation.fullName,
        baseName: incarnation.baseName,
        variant: incarnation.variant,
        symbol: this.generateAssetSymbol(incarnation.baseName, incarnation.variant, record.id),
        category: 'CHARACTER',
        metadata: {
          pineconeId: record.id,
          filepath: record.metadata.filepath,
          processedDate: record.metadata.processed_date,
          publisher: record.metadata.publisher || 'Marvel',
          isIncarnation: !!incarnation.variant,
          baseCharacter: incarnation.baseName
        }
      };
    });

    // Transform creators
    const creatorAssets = records.creators.map(record => ({
      type: 'creator',
      name: record.metadata.filename
        ? this.extractCreatorName(record.metadata.filename)
        : record.id,
      symbol: record.metadata.filename
        ? this.generateAssetSymbol(this.extractCreatorName(record.metadata.filename), null, record.id)
        : this.generateAssetSymbol(record.id, null, record.id),
      category: 'CREATOR',
      metadata: {
        pineconeId: record.id,
        filepath: record.metadata.filepath,
        processedDate: record.metadata.processed_date,
        publisher: record.metadata.publisher
      }
    }));

    // Transform comics
    const comicAssets = records.comics.map(record => ({
      type: 'comic',
      name: record.metadata.name || record.id,
      symbol: record.metadata.name
        ? this.generateAssetSymbol(record.metadata.name, null, record.id)
        : this.generateAssetSymbol(record.id, null, record.id),
      category: 'COMIC',
      metadata: {
        pineconeId: record.id,
        description: record.metadata.description,
        publisher: record.metadata.publisher,
        modified: record.metadata.modified,
        issueType: record.metadata.type
      }
    }));

    console.log(`✅ Transformed ${characterAssets.length} characters, ${creatorAssets.length} creators, ${comicAssets.length} comics`);

    // Step 2: Enrich with pricing data (with rate limiting)
    console.log('💰 Enriching assets with real market pricing...');
    
    const allAssets = [...characterAssets, ...creatorAssets, ...comicAssets];
    const enrichedAssets: any[] = [];
    
    for (let i = 0; i < allAssets.length; i++) {
      const asset = allAssets[i];
      
      const enrichedAsset = await this.enrichAssetWithPricing(asset);
      enrichedAssets.push(enrichedAsset);
      
      if (i < allAssets.length - 1) {
        await this.sleep(100);
      }
    }

    const enrichedCharacters = enrichedAssets.filter(a => a.type === 'character');
    const enrichedCreators = enrichedAssets.filter(a => a.type === 'creator');
    const enrichedComics = enrichedAssets.filter(a => a.type === 'comic');

    const pricedCount = enrichedAssets.filter(a => a.pricing?.source === 'pricecharting').length;
    const estimatedCount = enrichedAssets.filter(a => a.pricing?.source === 'estimate').length;

    console.log(`✅ Pricing enrichment complete:`);
    console.log(`   📊 Real prices: ${pricedCount} assets`);
    console.log(`   📊 Estimated prices: ${estimatedCount} assets`);

    return {
      characterAssets: enrichedCharacters,
      creatorAssets: enrichedCreators,
      comicAssets: enrichedComics
    };
  }

  /**
   * Main expansion pipeline: Fetch → Transform → Report
   * Supports batching for massive scale (millions of assets)
   */
  async expandAssetDatabase(
    samplesPerCategory: number = 100,
    options?: {
      batchSize?: number;
      onBatchComplete?: (batchNum: number, totalAssets: number) => void;
    }
  ) {
    console.log('🚀 STARTING PINECONE ASSET EXPANSION PIPELINE');
    console.log(`📊 Target: ${samplesPerCategory} samples per category`);

    const batchSize = options?.batchSize || samplesPerCategory;
    const batches = Math.ceil(samplesPerCategory / batchSize);

    try {
      let allAssets = {
        characterAssets: [] as any[],
        creatorAssets: [] as any[],
        comicAssets: [] as any[]
      };
      let allRecords = {
        characters: [] as PineconeRecord[],
        creators: [] as PineconeRecord[],
        comics: [] as PineconeRecord[]
      };

      // Process in batches for scalability
      for (let i = 0; i < batches; i++) {
        const currentBatchSize = Math.min(batchSize, samplesPerCategory - (i * batchSize));
        console.log(`📦 Processing batch ${i + 1}/${batches} (${currentBatchSize} samples)...`);

        // Step 1: Sample diverse records
        const records = await this.sampleDiverseRecords(currentBatchSize);

        // Step 2: Transform to assets
        const assets = await this.transformRecordsToAssets(records);

        // Accumulate results
        allAssets.characterAssets.push(...assets.characterAssets);
        allAssets.creatorAssets.push(...assets.creatorAssets);
        allAssets.comicAssets.push(...assets.comicAssets);
        allRecords.characters.push(...records.characters);
        allRecords.creators.push(...records.creators);
        allRecords.comics.push(...records.comics);

        const totalSoFar = 
          allAssets.characterAssets.length + 
          allAssets.creatorAssets.length + 
          allAssets.comicAssets.length;

        options?.onBatchComplete?.(i + 1, totalSoFar);
      }

      // Step 3: Report
      const totalAssets = 
        allAssets.characterAssets.length + 
        allAssets.creatorAssets.length + 
        allAssets.comicAssets.length;

      console.log('📈 EXPANSION PIPELINE COMPLETE');
      console.log(`📦 Total Assets Generated: ${totalAssets}`);
      console.log(`👥 Characters: ${allAssets.characterAssets.length}`);
      console.log(`🎨 Creators: ${allAssets.creatorAssets.length}`);
      console.log(`📚 Comics: ${allAssets.comicAssets.length}`);

      // Defensive check: Warn if no assets were generated
      if (totalAssets === 0) {
        console.warn('⚠️ WARNING: No assets were generated. This may indicate:');
        console.warn('   1. OpenAI embedding service not initialized');
        console.warn('   2. Pinecone query failures');
        console.warn('   3. Category filtering too strict');
      }

      return {
        success: true,
        totalAssets,
        assets: allAssets,
        records: allRecords
      };
    } catch (error) {
      console.error('❌ Asset expansion pipeline failed:', error);
      return {
        success: false,
        totalAssets: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const pineconeAssetExpansion = new PineconeAssetExpansionService();
