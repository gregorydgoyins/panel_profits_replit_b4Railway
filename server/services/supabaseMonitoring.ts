import { db } from '../databaseStorage';
import { assets as assetsTable } from '@shared/schema';
import { sql } from 'drizzle-orm';
import { getAllQueueMetrics } from '../queue/queues';

export interface AcquisitionMetrics {
  totalAssets: number;
  newAssetsToday: number;
  newAssetsThisHour: number;
  assetsBySource: Record<string, number>;
  assetsByType: Record<string, number>;
  lastUpdate: string;
  errors: number;
  pendingJobs: Record<string, number>;
  queueHealth: any[];
}

class AcquisitionMonitoringService {
  private metricsCache: AcquisitionMetrics | null = null;
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 30000; // 30 seconds
  private metricsHistory: AcquisitionMetrics[] = [];

  constructor() {
    console.log('✅ Acquisition monitoring service initialized');
  }

  /**
   * Get current acquisition metrics from database
   */
  async getAcquisitionMetrics(): Promise<AcquisitionMetrics> {
    const now = Date.now();
    
    // Return cached metrics if still fresh
    if (this.metricsCache && (now - this.lastCacheUpdate) < this.CACHE_TTL) {
      return this.metricsCache;
    }

    try {
      // Get total assets count
      const totalAssetsResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM assets
      `);
      const totalAssets = Number(totalAssetsResult.rows[0]?.count || 0);

      // Get assets created today
      const todayResult = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM assets 
        WHERE created_at >= CURRENT_DATE
      `);
      const newAssetsToday = Number(todayResult.rows[0]?.count || 0);

      // Get assets created this hour
      const thisHourResult = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM assets 
        WHERE created_at >= date_trunc('hour', NOW())
      `);
      const newAssetsThisHour = Number(thisHourResult.rows[0]?.count || 0);

      // Get assets by source
      const sourceResult = await db.execute(sql`
        SELECT 
          metadata->>'source' as source,
          COUNT(*) as count
        FROM assets
        WHERE metadata->>'source' IS NOT NULL
        GROUP BY metadata->>'source'
      `);
      
      const assetsBySource: Record<string, number> = {};
      for (const row of sourceResult.rows) {
        assetsBySource[row.source as string] = Number(row.count);
      }

      // Get assets by type
      const typeResult = await db.execute(sql`
        SELECT 
          type,
          COUNT(*) as count
        FROM assets
        GROUP BY type
      `);
      
      const assetsByType: Record<string, number> = {};
      for (const row of typeResult.rows) {
        assetsByType[row.type as string] = Number(row.count);
      }

      // Get queue health
      const queueHealth = await getAllQueueMetrics();

      // Extract pending jobs count
      const pendingJobs: Record<string, number> = {};
      for (const queue of queueHealth) {
        if (queue) {
          pendingJobs[queue.name] = queue.waiting + queue.active;
        }
      }

      const metrics: AcquisitionMetrics = {
        totalAssets,
        newAssetsToday,
        newAssetsThisHour,
        assetsBySource,
        assetsByType,
        lastUpdate: new Date().toISOString(),
        errors: 0, // TODO: Track errors from queue failures
        pendingJobs,
        queueHealth,
      };

      // Update cache
      this.metricsCache = metrics;
      this.lastCacheUpdate = now;

      return metrics;
    } catch (error) {
      console.error('❌ Failed to get acquisition metrics:', error);
      throw error;
    }
  }

  /**
   * Store metrics in history (in-memory for now)
   */
  async storeMetrics(metrics: AcquisitionMetrics): Promise<void> {
    this.metricsHistory.push(metrics);
    
    // Keep only last 100 entries
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }
    
    console.log('✅ Metrics stored in history');
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit: number = 20): AcquisitionMetrics[] {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Log error (in-memory for now)
   */
  async logError(error: {
    source: string;
    message: string;
    stack?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    console.error(`❌ [${error.source}] ${error.message}`, error.metadata);
    
    // Could store errors in database here if needed
  }

  /**
   * Start periodic metrics collection (every 5 minutes by default)
   */
  startPeriodicCollection(intervalMs: number = 300000): NodeJS.Timeout {
    console.log(`📊 Starting periodic metrics collection (every ${intervalMs / 1000}s)`);
    
    return setInterval(async () => {
      try {
        const metrics = await this.getAcquisitionMetrics();
        await this.storeMetrics(metrics);
        
        console.log(`📈 Metrics update: ${metrics.totalAssets} total, +${metrics.newAssetsThisHour} this hour`);
      } catch (error) {
        console.error('❌ Periodic metrics collection failed:', error);
      }
    }, intervalMs);
  }

  /**
   * Clear metrics cache to force refresh
   */
  clearCache(): void {
    this.metricsCache = null;
    this.lastCacheUpdate = 0;
  }
}

export const acquisitionMonitoring = new AcquisitionMonitoringService();
