"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquisitionMonitoring = void 0;
const databaseStorage_1 = require("../databaseStorage");
const drizzle_orm_1 = require("drizzle-orm");
const queues_1 = require("../queue/queues");
class AcquisitionMonitoringService {
    constructor() {
        this.metricsCache = null;
        this.lastCacheUpdate = 0;
        this.CACHE_TTL = 30000; // 30 seconds
        this.metricsHistory = [];
        console.log('✅ Acquisition monitoring service initialized');
    }
    /**
     * Get current acquisition metrics from database
     */
    async getAcquisitionMetrics() {
        const now = Date.now();
        // Return cached metrics if still fresh
        if (this.metricsCache && (now - this.lastCacheUpdate) < this.CACHE_TTL) {
            return this.metricsCache;
        }
        try {
            // Get total assets count
            const totalAssetsResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT COUNT(*) as count FROM assets
      `);
            const totalAssets = Number(totalAssetsResult.rows[0]?.count || 0);
            // Get assets created today
            const todayResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT COUNT(*) as count 
        FROM assets 
        WHERE created_at >= CURRENT_DATE
      `);
            const newAssetsToday = Number(todayResult.rows[0]?.count || 0);
            // Get assets created this hour
            const thisHourResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT COUNT(*) as count 
        FROM assets 
        WHERE created_at >= date_trunc('hour', NOW())
      `);
            const newAssetsThisHour = Number(thisHourResult.rows[0]?.count || 0);
            // Get assets by source
            const sourceResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          metadata->>'source' as source,
          COUNT(*) as count
        FROM assets
        WHERE metadata->>'source' IS NOT NULL
        GROUP BY metadata->>'source'
      `);
            const assetsBySource = {};
            for (const row of sourceResult.rows) {
                assetsBySource[row.source] = Number(row.count);
            }
            // Get assets by type
            const typeResult = await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          type,
          COUNT(*) as count
        FROM assets
        GROUP BY type
      `);
            const assetsByType = {};
            for (const row of typeResult.rows) {
                assetsByType[row.type] = Number(row.count);
            }
            // Get queue health
            const queueHealth = await (0, queues_1.getAllQueueMetrics)();
            // Extract pending jobs count
            const pendingJobs = {};
            for (const queue of queueHealth) {
                if (queue) {
                    pendingJobs[queue.name] = queue.waiting + queue.active;
                }
            }
            const metrics = {
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
        }
        catch (error) {
            console.error('❌ Failed to get acquisition metrics:', error);
            throw error;
        }
    }
    /**
     * Store metrics in history (in-memory for now)
     */
    async storeMetrics(metrics) {
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
    getMetricsHistory(limit = 20) {
        return this.metricsHistory.slice(-limit);
    }
    /**
     * Log error (in-memory for now)
     */
    async logError(error) {
        console.error(`❌ [${error.source}] ${error.message}`, error.metadata);
        // Could store errors in database here if needed
    }
    /**
     * Start periodic metrics collection (every 5 minutes by default)
     */
    startPeriodicCollection(intervalMs = 300000) {
        console.log(`📊 Starting periodic metrics collection (every ${intervalMs / 1000}s)`);
        return setInterval(async () => {
            try {
                const metrics = await this.getAcquisitionMetrics();
                await this.storeMetrics(metrics);
                console.log(`📈 Metrics update: ${metrics.totalAssets} total, +${metrics.newAssetsThisHour} this hour`);
            }
            catch (error) {
                console.error('❌ Periodic metrics collection failed:', error);
            }
        }, intervalMs);
    }
    /**
     * Clear metrics cache to force refresh
     */
    clearCache() {
        this.metricsCache = null;
        this.lastCacheUpdate = 0;
    }
}
exports.acquisitionMonitoring = new AcquisitionMonitoringService();
