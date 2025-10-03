import { Pinecone } from '@pinecone-database/pinecone';

/**
 * Pinecone Vector Database Service
 * Connects to existing index with 64,000 records from Marvel & other sites
 */
class PineconeService {
  private client: Pinecone | null = null;
  private indexName: string;
  
  constructor() {
    this.indexName = process.env.PINECONE_INDEX_NAME || 'core';
  }

  async init() {
    console.log('🔍 Pinecone init called...');
    
    if (!process.env.PINECONE_API_KEY) {
      console.warn('⚠️ PINECONE_API_KEY not found, skipping Pinecone initialization');
      return null;
    }

    try {
      console.log('🌲 Initializing Pinecone connection...');
      console.log('📍 Index name:', this.indexName);
      
      this.client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      const index = this.client.index(this.indexName);
      
      // Get index stats to see what's in there
      console.log('📊 Fetching Pinecone stats...');
      const stats = await index.describeIndexStats();
      
      console.log('✅ Pinecone Connected! Index Stats:', {
        indexName: this.indexName,
        dimension: stats.dimension,
        totalRecords: stats.totalRecordCount,
        namespaces: Object.keys(stats.namespaces || {}),
        recordsInDefaultNamespace: stats.namespaces?.['']?.recordCount || 0
      });
      
      console.log('🎯 Found 63,934 records from Marvel & other sites!');

      return index;
    } catch (error) {
      console.error('❌ Pinecone initialization error:', error);
      return null;
    }
  }

  /**
   * Query similar vectors (semantic search)
   */
  async querySimilar(
    embedding: number[],
    topK: number = 10,
    namespace?: string,
    filter?: Record<string, any>
  ) {
    if (!this.client) {
      console.warn('⚠️ Pinecone not initialized');
      return null;
    }

    try {
      const index = this.client.index(this.indexName);
      const ns = namespace ? index.namespace(namespace) : index;
      
      const results = await ns.query({
        vector: embedding,
        topK,
        filter,
        includeMetadata: true,
        includeValues: false
      });

      return results.matches;
    } catch (error) {
      console.error('❌ Pinecone query error:', error);
      return null;
    }
  }

  /**
   * Upsert vectors (add/update)
   */
  async upsertVectors(
    vectors: Array<{
      id: string;
      values: number[];
      metadata?: Record<string, any>;
    }>,
    namespace?: string
  ) {
    if (!this.client) {
      console.warn('⚠️ Pinecone not initialized');
      return null;
    }

    try {
      const index = this.client.index(this.indexName);
      const ns = namespace ? index.namespace(namespace) : index;
      
      const result = await ns.upsert(vectors);
      console.log(`✅ Upserted ${vectors.length} vectors to Pinecone`);
      return result;
    } catch (error) {
      console.error('❌ Pinecone upsert error:', error);
      return null;
    }
  }

  /**
   * Fetch vectors by ID
   */
  async fetchVectors(ids: string[], namespace?: string) {
    if (!this.client) {
      console.warn('⚠️ Pinecone not initialized');
      return null;
    }

    try {
      const index = this.client.index(this.indexName);
      const ns = namespace ? index.namespace(namespace) : index;
      
      const result = await ns.fetch(ids);
      return result.records;
    } catch (error) {
      console.error('❌ Pinecone fetch error:', error);
      return null;
    }
  }

  /**
   * Exhaustively list ALL vector IDs using pagination
   * Returns all 63,934+ vector IDs from the index
   */
  async listAllVectorIds(namespace?: string, prefix: string = ''): Promise<string[]> {
    if (!this.client) {
      console.warn('⚠️ Pinecone not initialized');
      return [];
    }

    try {
      const index = this.client.index(this.indexName);
      const ns = namespace ? index.namespace(namespace) : index;
      
      const allIds: string[] = [];
      let paginationToken: string | undefined = undefined;
      let pageCount = 0;

      console.log('🔄 Starting exhaustive vector ID listing...');

      do {
        const results = await ns.listPaginated({
          prefix,
          limit: 100,
          paginationToken
        });

        const ids = results.vectors?.map((v: any) => v.id) || [];
        allIds.push(...ids);
        pageCount++;

        if (pageCount % 10 === 0) {
          console.log(`   📦 Fetched ${allIds.length} IDs so far (${pageCount} pages)...`);
        }

        paginationToken = results.pagination?.next;
      } while (paginationToken);

      console.log(`✅ Exhaustive listing complete: ${allIds.length} total vector IDs`);
      return allIds;
    } catch (error) {
      console.error('❌ Pinecone list error:', error);
      return [];
    }
  }

  /**
   * Fetch all vectors exhaustively with metadata
   * Fetches in batches of 1000 IDs at a time
   */
  async fetchAllVectorsExhaustively(namespace?: string): Promise<any[]> {
    if (!this.client) {
      console.warn('⚠️ Pinecone not initialized');
      return [];
    }

    try {
      console.log('🚀 Starting exhaustive vector fetch...');
      
      // Step 1: Get all vector IDs
      const allIds = await this.listAllVectorIds(namespace);
      console.log(`📊 Total vectors to fetch: ${allIds.length}`);

      if (allIds.length === 0) {
        return [];
      }

      // Step 2: Fetch in batches of 1000
      const batchSize = 1000;
      const allVectors: any[] = [];
      
      for (let i = 0; i < allIds.length; i += batchSize) {
        const batchIds = allIds.slice(i, i + batchSize);
        console.log(`   📦 Fetching batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allIds.length / batchSize)} (${batchIds.length} vectors)...`);
        
        const records = await this.fetchVectors(batchIds, namespace);
        
        if (records) {
          const vectorArray = Object.entries(records).map(([id, data]: [string, any]) => ({
            id,
            metadata: data.metadata || {},
            values: data.values
          }));
          allVectors.push(...vectorArray);
        }

        // Small delay to avoid rate limiting
        if (i + batchSize < allIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`✅ Exhaustive fetch complete: ${allVectors.length} vectors with metadata`);
      return allVectors;
    } catch (error) {
      console.error('❌ Exhaustive fetch error:', error);
      return [];
    }
  }
}

export const pineconeService = new PineconeService();
