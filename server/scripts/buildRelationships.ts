#!/usr/bin/env tsx

/**
 * Relationship Building Script
 * 
 * Populates asset_relationships table by discovering connections between:
 * - Characters who share teams/franchises (teammates, allies)
 * - Characters created by same creators
 * - Characters linked to locations (Thor -> Asgard)
 * - Characters linked to gadgets (Thor -> Mjolnir)
 * 
 * Usage:
 *   npm run build-relationships
 *   or
 *   tsx server/scripts/buildRelationships.ts
 */

import { buildAllRelationships } from '../services/relationshipBuilder';

async function main() {
  console.log("🚀 Starting Relationship Building Pipeline");
  console.log("=" .repeat(60));
  
  try {
    const results = await buildAllRelationships();
    
    console.log("\n" + "=".repeat(60));
    console.log("✨ Pipeline Complete!");
    console.log(`📊 Total relationships created: ${results.total}`);
    console.log("=".repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error in relationship building:", error);
    process.exit(1);
  }
}

main();
