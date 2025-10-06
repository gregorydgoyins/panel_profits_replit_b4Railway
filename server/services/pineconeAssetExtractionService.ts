/**
 * Pinecone Asset Extraction Service
 * Extract 63,934 vectors from Pinecone and create tradeable assets
 * Characters, comics, creators, teams, locations, all from Marvel mind maps
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { db } from '../databaseStorage';
import { assets as assetsTable, assetCurrentPrices } from '@shared/schema';
import { eq } from 'drizzle-orm';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'core';

interface PineconeMetadata {
  name: string;
  type?: string;
  description?: string;
  publisher?: string;
  firstAppearance?: string;
  creators?: string;
  teams?: string;
  powers?: string;
  locations?: string;
  [key: string]: any;
}

export class PineconeAssetExtractionService {
  private pinecone: Pinecone | null = null;
  private index: any = null;

  async initialize() {
    if (!PINECONE_API_KEY) {
      console.error('❌ PINECONE_API_KEY not configured');
      return false;
    }

    try {
      this.pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
      this.index = this.pinecone.index(PINECONE_INDEX_NAME);
      console.log(`✅ Pinecone initialized: ${PINECONE_INDEX_NAME}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Pinecone:', error);
      return false;
    }
  }

  /**
   * Calculate price based on entity type and metadata
   */
  private calculatePrice(type: string, metadata: PineconeMetadata): number {
    const basePrices: Record<string, number> = {
      character: 150,
      comic: 80,
      creator: 120,
      team: 200,
      location: 100,
      power: 90,
      event: 250,
      default: 100,
    };

    const base = basePrices[type.toLowerCase()] || basePrices.default;
    
    // Add randomness (±30%)
    const variance = base * 0.3;
    return base + (Math.random() * variance * 2 - variance);
  }

  /**
   * Determine asset type from Pinecone metadata
   */
  private determineAssetType(metadata: PineconeMetadata): string {
    const typeStr = metadata.type?.toLowerCase() || '';
    
    if (typeStr.includes('character') || metadata.powers) return 'character';
    if (typeStr.includes('comic') || typeStr.includes('issue')) return 'comic';
    if (typeStr.includes('creator') || typeStr.includes('writer') || typeStr.includes('artist')) return 'creator';
    if (typeStr.includes('team') || metadata.teams) return 'franchise';
    if (typeStr.includes('location') || metadata.locations) return 'franchise';
    if (typeStr.includes('event')) return 'franchise';
    if (typeStr.includes('series')) return 'series';
    
    return 'character'; // Default
  }

  /**
   * Generate symbol from name
   */
  private generateSymbol(name: string, id: string): string {
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
    const idPart = id.substring(0, 6);
    return `${cleaned}.${idPart}`;
  }

  /**
   * Create asset from Pinecone vector
   */
  private async createAssetFromVector(
    id: string,
    metadata: PineconeMetadata
  ): Promise<{ created: boolean; symbol?: string }> {
    if (!metadata.name) {
      return { created: false };
    }

    const symbol = this.generateSymbol(metadata.name, id);
    
    // Check if exists
    const existing = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.symbol, symbol))
      .limit(1);

    if (existing.length > 0) {
      return { created: false, symbol };
    }

    const assetType = this.determineAssetType(metadata);
    const price = this.calculatePrice(assetType, metadata);

    const description = metadata.description || 
      `${metadata.name}${metadata.publisher ? ` from ${metadata.publisher}` : ''}${metadata.firstAppearance ? `. First appeared: ${metadata.firstAppearance}` : ''}.`;

    // Create asset
    const [newAsset] = await db.insert(assetsTable).values({
      symbol,
      name: metadata.name,
      type: assetType,
      description,
      metadata: {
        ...metadata,
        source: 'pinecone',
        pineconeId: id,
      },
      verificationStatus: 'verified',
      primaryDataSource: 'pinecone',
      lastVerifiedAt: new Date(),
    }).returning({ id: assetsTable.id });

    // Create price
    await db.insert(assetCurrentPrices).values({
      assetId: newAsset.id,
      currentPrice: price.toFixed(2),
      bidPrice: (price * 0.98).toFixed(2),
      askPrice: (price * 1.02).toFixed(2),
      volume: 0,
    });

    return { created: true, symbol };
  }

  /**
   * Extract all vectors from Pinecone in batches
   */
  async extractAllVectors(batchSize: number = 100): Promise<{
    totalVectors: number;
    assetsCreated: number;
    assetsSkipped: number;
    errors: number;
  }> {
    console.log('🌲 Starting Pinecone vector extraction...');
    
    if (!this.index) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize Pinecone');
      }
    }

    let assetsCreated = 0;
    let assetsSkipped = 0;
    let errors = 0;
    let totalProcessed = 0;

    try {
      // Query all vectors (Pinecone returns paginated results)
      const queryResponse = await this.index.query({
        vector: new Array(1024).fill(0), // Dummy vector
        topK: 10000,
        includeMetadata: true,
      });

      const vectors = queryResponse.matches || [];
      console.log(`📊 Found ${vectors.length} vectors to process`);

      // Process in batches
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        
        for (const vector of batch) {
          try {
            const result = await this.createAssetFromVector(
              vector.id,
              vector.metadata as PineconeMetadata
            );

            if (result.created) {
              assetsCreated++;
              if (assetsCreated % 100 === 0) {
                console.log(`✅ Created ${assetsCreated} assets so far...`);
              }
            } else {
              assetsSkipped++;
            }

            totalProcessed++;
          } catch (error) {
            console.error(`❌ Error processing vector ${vector.id}:`, error);
            errors++;
          }
        }

        // Log progress
        console.log(`📊 Progress: ${totalProcessed}/${vectors.length} vectors processed`);
        
        // Small delay to avoid overwhelming database
        if (i + batchSize < vectors.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`\n✅ Pinecone Extraction Complete:`);
      console.log(`   Total Vectors: ${vectors.length}`);
      console.log(`   Assets Created: ${assetsCreated}`);
      console.log(`   Assets Skipped: ${assetsSkipped}`);
      console.log(`   Errors: ${errors}`);

      return {
        totalVectors: vectors.length,
        assetsCreated,
        assetsSkipped,
        errors,
      };
    } catch (error) {
      console.error('❌ Fatal error in Pinecone extraction:', error);
      throw error;
    }
  }

  /**
   * Extract vectors by scanning with pagination
   */
  async extractWithPagination(): Promise<{
    totalVectors: number;
    assetsCreated: number;
    assetsSkipped: number;
    errors: number;
  }> {
    console.log('🌲 Starting paginated Pinecone extraction...');
    
    if (!this.index) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize Pinecone');
      }
    }

    let assetsCreated = 0;
    let assetsSkipped = 0;
    let errors = 0;
    let totalVectors = 0;

    try {
      // List all vector IDs
      const listResponse = await this.index.listPaginated({ limit: 100 });
      let vectors = listResponse.vectors || [];
      let paginationToken = listResponse.pagination?.next;

      // Process first batch
      for (const vector of vectors) {
        try {
          if (vector.metadata) {
            const result = await this.createAssetFromVector(
              vector.id,
              vector.metadata as PineconeMetadata
            );

            if (result.created) assetsCreated++;
            else assetsSkipped++;
          }
          totalVectors++;
        } catch (error) {
          errors++;
        }
      }

      // Continue pagination
      while (paginationToken) {
        const nextBatch = await this.index.listPaginated({ 
          paginationToken,
          limit: 100 
        });
        
        vectors = nextBatch.vectors || [];
        paginationToken = nextBatch.pagination?.next;

        for (const vector of vectors) {
          try {
            if (vector.metadata) {
              const result = await this.createAssetFromVector(
                vector.id,
                vector.metadata as PineconeMetadata
              );

              if (result.created) assetsCreated++;
              else assetsSkipped++;
            }
            totalVectors++;

            if (totalVectors % 100 === 0) {
              console.log(`📊 Progress: ${totalVectors} vectors, ${assetsCreated} assets created`);
            }
          } catch (error) {
            errors++;
          }
        }

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log(`\n✅ Pinecone Extraction Complete:`);
      console.log(`   Total Vectors: ${totalVectors}`);
      console.log(`   Assets Created: ${assetsCreated}`);
      console.log(`   Assets Skipped: ${assetsSkipped}`);
      console.log(`   Errors: ${errors}`);

      return {
        totalVectors,
        assetsCreated,
        assetsSkipped,
        errors,
      };
    } catch (error) {
      console.error('❌ Fatal error in paginated extraction:', error);
      throw error;
    }
  }
}

export const pineconeAssetExtractionService = new PineconeAssetExtractionService();
