#!/usr/bin/env tsx
"use strict";
/**
 * Seed Known Relationships Script
 *
 * Populates well-known character-location-gadget relationships
 * based on comic book canon (Thor → Asgard, Thor → Mjolnir, etc.)
 *
 * Usage:
 *   tsx server/scripts/seedKnownRelationships.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const knownRelationshipsSeed_1 = require("../services/knownRelationshipsSeed");
async function main() {
    console.log("🌱 Seeding Known Relationships");
    console.log("=".repeat(60));
    try {
        const count = await (0, knownRelationshipsSeed_1.seedKnownRelationships)();
        console.log("\n" + "=".repeat(60));
        console.log(`✨ Seeding Complete! Created ${count} relationships`);
        console.log("=".repeat(60));
        process.exit(0);
    }
    catch (error) {
        console.error("\n❌ Fatal error:", error);
        process.exit(1);
    }
}
main();
