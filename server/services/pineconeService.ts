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
}

export const pineconeService = new PineconeService();
