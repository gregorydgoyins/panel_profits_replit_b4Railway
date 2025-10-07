#!/usr/bin/env tsx

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

import { db } from '../databaseStorage';
import { assets } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { 
  buildTeammateRelationships, 
  buildFranchiseRelationships,
  buildCreatorRelationships,
  insertRelationshipBatch 
} from '../services/relationshipBuilder';

const BATCH_SIZE = 2000; // Process 2000 characters at a time
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay to avoid overwhelming DB

async function getTotalCharacterCount(): Promise<number> {
  const result = await db
    .select({ count: db.$count(assets.id) })
    .from(assets)
    .where(eq(assets.type, 'character'));
  
  return Number(result[0]?.count || 0);
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("🚀 Bulk Relationship Backfill Pipeline");
  console.log("=" .repeat(70));
  
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

    // Process in batches
    for (let batchNum = 1; batchNum <= totalBatches; batchNum++) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📦 BATCH ${batchNum}/${totalBatches}`);
      console.log('='.repeat(70));

      // Build teammate relationships
      console.log('\n1️⃣  Building teammate relationships...');
      const teammateResult = await buildTeammateRelationships(BATCH_SIZE);
      const teammateCount = await insertRelationshipBatch(teammateResult.relationships);
      grandTotal.teammate += teammateCount;
      console.log(`   ✅ Added ${teammateCount} teammate relationships`);

      // Build franchise/publisher relationships
      console.log('\n2️⃣  Building franchise relationships...');
      const franchiseResult = await buildFranchiseRelationships(BATCH_SIZE);
      const franchiseCount = await insertRelationshipBatch(franchiseResult.relationships);
      grandTotal.franchise += franchiseCount;
      console.log(`   ✅ Added ${franchiseCount} franchise relationships`);

      // Build creator relationships (larger batch)
      console.log('\n3️⃣  Building creator relationships...');
      const creatorResult = await buildCreatorRelationships(BATCH_SIZE * 2);
      const creatorCount = await insertRelationshipBatch(creatorResult.relationships);
      grandTotal.creator += creatorCount;
      console.log(`   ✅ Added ${creatorCount} creator relationships`);

      const batchTotal = teammateCount + franchiseCount + creatorCount;
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
  } catch (error) {
    console.error("\n❌ Fatal error in bulk backfill:", error);
    process.exit(1);
  }
}

main();
