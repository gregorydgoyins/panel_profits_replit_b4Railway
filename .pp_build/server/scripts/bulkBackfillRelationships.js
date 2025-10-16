#!/usr/bin/env tsx
"use strict";
/**
 * Bulk Relationship Backfill Script
 *
 * Processes all 153K+ characters in batches to build comprehensive relationship graph.
 * Uses the relationship builder service to discover connections between:
 * - Characters sharing teams (teammates)
 * - Characters from same publisher (allies)
 * - Characters and their creators
 *
 * Progress tracking and batch processing prevents memory overflow.
 *
 * Usage:
 *   tsx server/scripts/bulkBackfillRelationships.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const relationshipBuilder_1 = require("../services/relationshipBuilder");
const BATCH_SIZE = 5000; // Process 5000 characters at a time
const DELAY_BETWEEN_BATCHES = 500; // 0.5 second delay to avoid overwhelming DB
async function getTotalCharacterCount() {
    const result = await databaseStorage_1.db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.eq)(schema_1.assets.type, 'character'));
    return Number(result[0]?.count || 0);
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    console.log("🚀 Bulk Relationship Backfill Pipeline");
    console.log("=".repeat(70));
    try {
        const totalCharacters = await getTotalCharacterCount();
        console.log(`📊 Total characters in database: ${totalCharacters.toLocaleString()}`);
        const totalBatches = Math.ceil(totalCharacters / BATCH_SIZE);
        console.log(`📦 Processing in ${totalBatches} batches of ${BATCH_SIZE} characters\n`);
        let grandTotal = {
            teammate: 0,
            franchise: 0,
            creator: 0,
        };
        // Process in batches with proper offset
        for (let batchNum = 1; batchNum <= totalBatches; batchNum++) {
            const offset = (batchNum - 1) * BATCH_SIZE;
            console.log(`\n${'='.repeat(70)}`);
            console.log(`📦 BATCH ${batchNum}/${totalBatches} (offset: ${offset})`);
            console.log('='.repeat(70));
            // Build teammate relationships with offset
            console.log('\n1️⃣  Building teammate relationships...');
            const teammateResult = await (0, relationshipBuilder_1.buildTeammateRelationships)(BATCH_SIZE, offset);
            const teammateCount = await (0, relationshipBuilder_1.insertRelationshipBatch)(teammateResult.relationships);
            grandTotal.teammate += teammateCount;
            console.log(`   ✅ Added ${teammateCount} teammate relationships`);
            // SKIP franchise relationships - they create millions of weak "ally" relationships
            // that slow down the backfill. Focus on valuable relationships instead.
            const franchiseCount = 0;
            // Build creator relationships with offset (larger batch)
            console.log('\n2️⃣  Building creator relationships...');
            const creatorResult = await (0, relationshipBuilder_1.buildCreatorRelationships)(BATCH_SIZE * 2, offset * 2);
            const creatorCount = await (0, relationshipBuilder_1.insertRelationshipBatch)(creatorResult.relationships);
            grandTotal.creator += creatorCount;
            console.log(`   ✅ Added ${creatorCount} creator relationships`);
            const batchTotal = teammateCount + creatorCount;
            console.log(`\n📊 Batch ${batchNum} Total: ${batchTotal} relationships`);
            // Progress update
            const progress = ((batchNum / totalBatches) * 100).toFixed(1);
            console.log(`🔄 Overall Progress: ${progress}% (${batchNum}/${totalBatches} batches)`);
            // Delay between batches
            if (batchNum < totalBatches) {
                console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
                await sleep(DELAY_BETWEEN_BATCHES);
            }
        }
        // Final summary
        console.log("\n" + "=".repeat(70));
        console.log("✨ BULK BACKFILL COMPLETE!");
        console.log("=".repeat(70));
        console.log("\n📊 Grand Total Summary:");
        console.log(`  - Teammate relationships: ${grandTotal.teammate.toLocaleString()}`);
        console.log(`  - Franchise relationships: ${grandTotal.franchise.toLocaleString()}`);
        console.log(`  - Creator relationships: ${grandTotal.creator.toLocaleString()}`);
        console.log(`  - TOTAL: ${(grandTotal.teammate + grandTotal.franchise + grandTotal.creator).toLocaleString()}`);
        console.log("\n" + "=".repeat(70));
        process.exit(0);
    }
    catch (error) {
        console.error("\n❌ Fatal error in bulk backfill:", error);
        process.exit(1);
    }
}
main();
