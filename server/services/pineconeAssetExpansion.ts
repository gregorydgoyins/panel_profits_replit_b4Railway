import { pineconeService } from './pineconeService';
import { openaiService } from './openaiService';

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
   * Extract creator name from filename
   */
  extractCreatorName(filename: string): string {
    return filename.replace('.md', '').replace(/_/g, ' ');
  }

  /**
   * Generate asset symbol from name
   */
  generateAssetSymbol(name: string): string {
    // Take first letters of each word, max 5 chars
    const words = name.split(' ').filter(w => w.length > 0);
    const symbol = words
      .map(w => w[0].toUpperCase())
      .join('')
      .substring(0, 5);
    
    return symbol || 'ASSET';
  }

  /**
   * Transform Pinecone records into asset proposals
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

    // Transform characters
    const characterAssets = records.characters.map(record => ({
      type: 'character',
      name: record.metadata.filename 
        ? this.extractCharacterName(record.metadata.filename)
        : record.id,
      symbol: record.metadata.filename
        ? this.generateAssetSymbol(this.extractCharacterName(record.metadata.filename))
        : this.generateAssetSymbol(record.id),
      category: 'CHARACTER',
      metadata: {
        pineconeId: record.id,
        filepath: record.metadata.filepath,
        processedDate: record.metadata.processed_date,
        publisher: record.metadata.publisher || 'Marvel'
      }
    }));

    // Transform creators
    const creatorAssets = records.creators.map(record => ({
      type: 'creator',
      name: record.metadata.filename
        ? this.extractCreatorName(record.metadata.filename)
        : record.id,
      symbol: record.metadata.filename
        ? this.generateAssetSymbol(this.extractCreatorName(record.metadata.filename))
        : this.generateAssetSymbol(record.id),
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
        ? this.generateAssetSymbol(record.metadata.name)
        : this.generateAssetSymbol(record.id),
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

    return {
      characterAssets,
      creatorAssets,
      comicAssets
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
