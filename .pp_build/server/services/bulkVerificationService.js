"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkVerificationService = exports.BulkVerificationService = void 0;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const progressTracking = new Map();
class BulkVerificationService {
    constructor() {
        this.isRunning = false;
        this.currentBatch = 0;
    }
    async startBulkVerification(tableType, batchSize = 500, delayBetweenBatches = 2000, totalBatches = 1000) {
        const jobId = `bulk-verification-${tableType}-${Date.now()}`;
        const progress = {
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
        this.processBulkVerificationInBackground(jobId, tableType, batchSize, delayBetweenBatches, totalBatches);
        return {
            jobId,
            message: `Bulk verification started for ${tableType}. Processing ${batchSize} items per batch with ${delayBetweenBatches}ms delay.`
        };
    }
    async processBulkVerificationInBackground(jobId, tableType, batchSize, delayBetweenBatches, totalBatches) {
        const progress = progressTracking.get(jobId);
        if (!progress)
            return;
        try {
            const table = tableType === 'creators' ? schema_1.comicCreators : schema_1.assets;
            const totalCountResult = await databaseStorage_1.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)::int` })
                .from(table)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.isNull)(table.verificationStatus), (0, drizzle_orm_1.eq)(table.verificationStatus, 'unverified')));
            progress.totalItems = Number(totalCountResult[0]?.count || 0);
            console.log(`📊 Total unverified ${tableType}: ${progress.totalItems}`);
            const { entityVerificationQueue } = await Promise.resolve().then(() => __importStar(require('../queue/queues.js')));
            let lastId = null;
            let batchNumber = 0;
            while (batchNumber < totalBatches && progress.isRunning) {
                const whereConditions = [
                    (0, drizzle_orm_1.or)((0, drizzle_orm_1.isNull)(table.verificationStatus), (0, drizzle_orm_1.eq)(table.verificationStatus, 'unverified'))
                ];
                if (lastId) {
                    whereConditions.push((0, drizzle_orm_1.gt)(table.id, lastId));
                }
                const items = await databaseStorage_1.db
                    .select({
                    id: table.id,
                    name: tableType === 'creators' ? schema_1.comicCreators.name : schema_1.assets.name,
                    type: tableType === 'creators' ? schema_1.comicCreators.role : schema_1.assets.type
                })
                    .from(table)
                    .where(whereConditions.length > 1 ? (0, drizzle_orm_1.and)(...whereConditions) : whereConditions[0])
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
                        await entityVerificationQueue.add('verify-entity', {
                            entityId: item.id,
                            canonicalName: item.name,
                            entityType: item.type || 'unknown',
                            tableType,
                            forceRefresh: false,
                            priority: 0,
                        }, {
                            priority: 10,
                            delay: i * 50,
                        });
                        progress.queuedItems++;
                    }
                    catch (error) {
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
        }
        catch (error) {
            console.error(`❌ Bulk verification error for ${jobId}:`, error);
            progress.isRunning = false;
            progress.errorCount++;
        }
    }
    getProgress(jobId) {
        return progressTracking.get(jobId) || null;
    }
    getAllProgress() {
        return Array.from(progressTracking.values());
    }
    async stopBulkVerification(jobId) {
        const progress = progressTracking.get(jobId);
        if (progress) {
            progress.isRunning = false;
            return true;
        }
        return false;
    }
}
exports.BulkVerificationService = BulkVerificationService;
exports.bulkVerificationService = new BulkVerificationService();
