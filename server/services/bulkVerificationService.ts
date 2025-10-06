import { db } from '../databaseStorage';
import { assets as assetsTable, comicCreators } from '@shared/schema';
import { or, isNull, eq, gt, and, sql } from 'drizzle-orm';

interface BulkVerificationProgress {
  tableType: 'assets' | 'creators';
  totalItems: number;
  processedItems: number;
  queuedItems: number;
  isRunning: boolean;
  startedAt: Date | null;
  lastProcessedId: string | null;
  errorCount: number;
}

const progressTracking: Map<string, BulkVerificationProgress> = new Map();

export class BulkVerificationService {
  private isRunning = false;
  private currentBatch = 0;
  
  async startBulkVerification(
    tableType: 'assets' | 'creators',
    batchSize = 500,
    delayBetweenBatches = 2000,
    totalBatches = 1000
  ): Promise<{ jobId: string; message: string }> {
    const jobId = `bulk-verification-${tableType}-${Date.now()}`;
    
    const progress: BulkVerificationProgress = {
      tableType,
      totalItems: 0,
      processedItems: 0,
      queuedItems: 0,
      isRunning: true,
      startedAt: new Date(),
      lastProcessedId: null,
      errorCount: 0,
    };
    
    progressTracking.set(jobId, progress);
    
    this.processBulkVerificationInBackground(
      jobId,
      tableType,
      batchSize,
      delayBetweenBatches,
      totalBatches
    );
    
    return {
      jobId,
      message: `Bulk verification started for ${tableType}. Processing ${batchSize} items per batch with ${delayBetweenBatches}ms delay.`
    };
  }
  
  private async processBulkVerificationInBackground(
    jobId: string,
    tableType: 'assets' | 'creators',
    batchSize: number,
    delayBetweenBatches: number,
    totalBatches: number
  ) {
    const progress = progressTracking.get(jobId);
    if (!progress) return;
    
    try {
      const table = tableType === 'creators' ? comicCreators : assetsTable;
      
      const totalCountResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(table)
        .where(
          or(
            isNull(table.verificationStatus),
            eq(table.verificationStatus, 'unverified')
          )
        );
      
      progress.totalItems = Number(totalCountResult[0]?.count || 0);
      console.log(`📊 Total unverified ${tableType}: ${progress.totalItems}`);
      
      const { entityVerificationQueue } = await import('../queue/queues.js');
      
      let lastId: string | null = null;
      let batchNumber = 0;
      
      while (batchNumber < totalBatches && progress.isRunning) {
        const whereConditions = [
          or(
            isNull(table.verificationStatus),
            eq(table.verificationStatus, 'unverified')
          )
        ];
        
        if (lastId) {
          whereConditions.push(gt(table.id, lastId));
        }
        
        const items = await db
          .select({
            id: table.id,
            name: tableType === 'creators' ? comicCreators.name : assetsTable.name,
            type: tableType === 'creators' ? comicCreators.role : assetsTable.type
          })
          .from(table)
          .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0])
          .orderBy(table.id)
          .limit(batchSize);
        
        if (items.length === 0) {
          console.log(`✅ Bulk verification complete for ${tableType}. No more items to process.`);
          break;
        }
        
        console.log(`📦 Processing batch ${batchNumber + 1}: ${items.length} ${tableType}`);
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          try {
            await entityVerificationQueue.add(
              'verify-entity',
              {
                entityId: item.id,
                canonicalName: item.name,
                entityType: item.type || 'unknown',
                tableType,
                forceRefresh: false,
                priority: 0,
              },
              {
                priority: 10,
                delay: i * 50,
              }
            );
            
            progress.queuedItems++;
          } catch (error: any) {
            console.error(`Failed to queue item ${item.id}:`, error.message);
            progress.errorCount++;
          }
        }
        
        lastId = items[items.length - 1].id;
        progress.lastProcessedId = lastId;
        progress.processedItems += items.length;
        
        console.log(`✓ Batch ${batchNumber + 1} queued: ${items.length} items. Total progress: ${progress.processedItems}/${progress.totalItems}`);
        
        batchNumber++;
        
        if (batchNumber < totalBatches) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
      
      progress.isRunning = false;
      console.log(`🎉 Bulk verification completed for ${jobId}. Queued ${progress.queuedItems} items.`);
      
    } catch (error: any) {
      console.error(`❌ Bulk verification error for ${jobId}:`, error);
      progress.isRunning = false;
      progress.errorCount++;
    }
  }
  
  getProgress(jobId: string): BulkVerificationProgress | null {
    return progressTracking.get(jobId) || null;
  }
  
  getAllProgress(): BulkVerificationProgress[] {
    return Array.from(progressTracking.values());
  }
  
  async stopBulkVerification(jobId: string): Promise<boolean> {
    const progress = progressTracking.get(jobId);
    if (progress) {
      progress.isRunning = false;
      return true;
    }
    return false;
  }
}

export const bulkVerificationService = new BulkVerificationService();
