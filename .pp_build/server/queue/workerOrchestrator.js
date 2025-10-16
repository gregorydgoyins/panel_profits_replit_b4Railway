"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerOrchestrator = void 0;
const pineconeExpansionWorker_1 = require("./workers/pineconeExpansionWorker");
const entityVerificationWorker_1 = require("./workers/entityVerificationWorker");
const supabaseMonitoring_1 = require("../services/supabaseMonitoring");
class WorkerOrchestrator {
    constructor() {
        this.workers = [];
        this.metricsInterval = null;
        this.isRunning = false;
        console.log('🎯 Worker Orchestrator initialized');
    }
    /**
     * Start all workers
     */
    async start() {
        if (this.isRunning) {
            console.warn('⚠️  Workers already running');
            return;
        }
        console.log('🚀 Starting acquisition workers...');
        try {
            // Register workers
            this.workers = [
                pineconeExpansionWorker_1.pineconeExpansionWorker,
                (0, entityVerificationWorker_1.createEntityVerificationWorker)(),
                // Add more workers here as they're built:
                // marvelCharactersWorker,
                // comicVineCharactersWorker,
            ];
            // Start periodic metrics collection
            this.metricsInterval = supabaseMonitoring_1.acquisitionMonitoring.startPeriodicCollection(300000); // Every 5 minutes
            this.isRunning = true;
            console.log(`✅ ${this.workers.length} workers started`);
            console.log('📊 Metrics collection active (5 minute intervals)');
            // Log worker status
            for (const worker of this.workers) {
                console.log(`  ✓ ${worker.name} worker ready`);
            }
        }
        catch (error) {
            console.error('❌ Failed to start workers:', error);
            throw error;
        }
    }
    /**
     * Stop all workers gracefully
     */
    async stop() {
        if (!this.isRunning) {
            console.warn('⚠️  Workers not running');
            return;
        }
        console.log('🛑 Stopping acquisition workers...');
        try {
            // Stop metrics collection
            if (this.metricsInterval) {
                clearInterval(this.metricsInterval);
                this.metricsInterval = null;
            }
            // Close all workers
            await Promise.all(this.workers.map(async (worker) => {
                console.log(`  Closing ${worker.name}...`);
                await worker.close();
            }));
            this.workers = [];
            this.isRunning = false;
            console.log('✅ All workers stopped');
        }
        catch (error) {
            console.error('❌ Error stopping workers:', error);
            throw error;
        }
    }
    /**
     * Restart all workers
     */
    async restart() {
        console.log('🔄 Restarting workers...');
        await this.stop();
        await this.start();
    }
    /**
     * Get worker status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            workerCount: this.workers.length,
            workers: this.workers.map(w => ({
                name: w.name,
                concurrency: w.opts.concurrency,
            })),
            metricsActive: this.metricsInterval !== null,
        };
    }
    /**
     * Check if workers are running
     */
    isActive() {
        return this.isRunning;
    }
}
exports.workerOrchestrator = new WorkerOrchestrator();
// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('📴 SIGTERM received, shutting down workers...');
    await exports.workerOrchestrator.stop();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('📴 SIGINT received, shutting down workers...');
    await exports.workerOrchestrator.stop();
    process.exit(0);
});
