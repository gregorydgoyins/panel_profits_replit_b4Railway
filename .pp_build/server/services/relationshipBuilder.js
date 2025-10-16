"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTeammateRelationships = buildTeammateRelationships;
exports.buildFranchiseRelationships = buildFranchiseRelationships;
exports.buildCreatorRelationships = buildCreatorRelationships;
exports.buildLocationRelationships = buildLocationRelationships;
exports.buildGadgetRelationships = buildGadgetRelationships;
exports.insertRelationshipBatch = insertRelationshipBatch;
exports.buildAllRelationships = buildAllRelationships;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Build teammate relationships from shared team tags
 * Strategy: Extract teams from metadata.characterAttributes.teams and find overlaps
 */
async function buildTeammateRelationships(batchSize = 1000, offset = 0) {
    console.log(`🔗 Building teammate relationships (batch: ${offset}-${offset + batchSize})...`);
    const relationships = [];
    // Get all characters with metadata (with offset for pagination)
    const characters = await databaseStorage_1.db
        .select({
        id: schema_1.assets.id,
        name: schema_1.assets.name,
        metadata: schema_1.assets.metadata,
    })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.eq)(schema_1.assets.type, "character"))
        .limit(batchSize)
        .offset(offset);
    // Extract teams from metadata
    const charactersWithTeams = characters
        .map(char => {
        const metadata = char.metadata;
        const teams = metadata?.characterAttributes?.teams || [];
        return { ...char, teams };
    })
        .filter(char => char.teams.length > 0);
    console.log(`📊 Found ${charactersWithTeams.length} characters with team affiliations`);
    // Build relationships for characters sharing teams
    for (let i = 0; i < charactersWithTeams.length; i++) {
        const char1 = charactersWithTeams[i];
        for (let j = i + 1; j < charactersWithTeams.length; j++) {
            const char2 = charactersWithTeams[j];
            // Find shared teams
            const sharedTeams = char1.teams.filter((team) => char2.teams.includes(team));
            if (sharedTeams.length > 0) {
                // Calculate relationship strength based on number of shared teams
                const strength = Math.min(sharedTeams.length * 0.25, 1.0);
                // Create bidirectional relationships
                relationships.push({
                    sourceAssetId: char1.id,
                    targetAssetId: char2.id,
                    relationshipType: "teammate",
                    relationshipStrength: strength.toString(),
                    description: `Shared teams: ${sharedTeams.join(", ")}`,
                    metadata: { sharedTeams, discoveryMethod: "metadata_teams" },
                });
                relationships.push({
                    sourceAssetId: char2.id,
                    targetAssetId: char1.id,
                    relationshipType: "teammate",
                    relationshipStrength: strength.toString(),
                    description: `Shared teams: ${sharedTeams.join(", ")}`,
                    metadata: { sharedTeams, discoveryMethod: "metadata_teams" },
                });
            }
        }
    }
    console.log(`✅ Generated ${relationships.length} teammate relationships`);
    return {
        relationships,
        sourceType: "metadata_teams",
        count: relationships.length,
    };
}
/**
 * Build franchise relationships from shared publishers
 * Strategy: Characters from same publisher are allies (weaker relationship)
 */
async function buildFranchiseRelationships(batchSize = 1000, offset = 0) {
    console.log(`🔗 Building franchise/publisher relationships (batch: ${offset}-${offset + batchSize})...`);
    const relationships = [];
    // Get all characters with metadata (with offset for pagination)
    const characters = await databaseStorage_1.db
        .select({
        id: schema_1.assets.id,
        name: schema_1.assets.name,
        metadata: schema_1.assets.metadata,
    })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.eq)(schema_1.assets.type, "character"))
        .limit(batchSize)
        .offset(offset);
    // Extract publishers from metadata
    const charactersWithPublishers = characters
        .map(char => {
        const metadata = char.metadata;
        const publisher = metadata?.publisher || metadata?.characterAttributes?.creator;
        return { ...char, publisher };
    })
        .filter(char => char.publisher);
    console.log(`📊 Found ${charactersWithPublishers.length} characters with publisher/franchise data`);
    // Group by publisher
    const publisherGroups = new Map();
    for (const char of charactersWithPublishers) {
        const publisher = char.publisher;
        if (!publisherGroups.has(publisher)) {
            publisherGroups.set(publisher, []);
        }
        publisherGroups.get(publisher).push(char);
    }
    // Build relationships within each publisher group
    // OPTIMIZATION: Only create franchise relationships for top 20 characters per publisher
    // to avoid O(n²) explosion. Franchise relationships are weak "ally" connections anyway.
    Array.from(publisherGroups.entries()).forEach(([publisher, chars]) => {
        if (chars.length < 2)
            return;
        // Only build relationships for major publishers (> 5 characters)
        if (chars.length < 5)
            return;
        // Limit to top 20 characters to prevent O(n²) explosion
        const limitedChars = chars.slice(0, 20);
        for (let i = 0; i < limitedChars.length; i++) {
            for (let j = i + 1; j < limitedChars.length; j++) {
                relationships.push({
                    sourceAssetId: limitedChars[i].id,
                    targetAssetId: limitedChars[j].id,
                    relationshipType: "ally",
                    relationshipStrength: "0.15",
                    description: `Same universe: ${publisher}`,
                    metadata: { publisher, discoveryMethod: "publisher_grouping" },
                });
                relationships.push({
                    sourceAssetId: limitedChars[j].id,
                    targetAssetId: limitedChars[i].id,
                    relationshipType: "ally",
                    relationshipStrength: "0.15",
                    description: `Same universe: ${publisher}`,
                    metadata: { publisher, discoveryMethod: "publisher_grouping" },
                });
            }
        }
    });
    console.log(`✅ Generated ${relationships.length} franchise relationships`);
    return {
        relationships,
        sourceType: "publisher_metadata",
        count: relationships.length,
    };
}
/**
 * Build creator relationships
 * Strategy: Link characters to their creators
 */
async function buildCreatorRelationships(batchSize = 5000, offset = 0) {
    console.log(`🔗 Building creator-character relationships (batch: ${offset}-${offset + batchSize})...`);
    const relationships = [];
    // Get all characters (with offset for pagination)
    const characters = await databaseStorage_1.db
        .select({
        id: schema_1.assets.id,
        name: schema_1.assets.name,
        metadata: schema_1.assets.metadata,
    })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.eq)(schema_1.assets.type, "character"))
        .limit(batchSize)
        .offset(offset);
    // Get all creators
    const creators = await databaseStorage_1.db
        .select({
        id: schema_1.assets.id,
        name: schema_1.assets.name,
    })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.eq)(schema_1.assets.type, "creator"));
    const creatorMap = new Map(creators.map((c) => [c.name.toLowerCase(), c.id]));
    console.log(`📊 Processing ${characters.length} characters against ${creators.length} creators`);
    // Link characters to creators based on metadata
    for (const character of characters) {
        const metadata = character.metadata;
        const creatorNames = metadata?.creators || metadata?.createdBy || [];
        for (const creatorName of creatorNames) {
            const creatorId = creatorMap.get(creatorName.toLowerCase());
            if (creatorId) {
                relationships.push({
                    sourceAssetId: character.id,
                    targetAssetId: creatorId,
                    relationshipType: "creator",
                    relationshipStrength: "0.90",
                    description: `Created by ${creatorName}`,
                    metadata: { discoveryMethod: "character_metadata" },
                });
            }
        }
    }
    console.log(`✅ Generated ${relationships.length} creator relationships`);
    return {
        relationships,
        sourceType: "creator_metadata",
        count: relationships.length,
    };
}
/**
 * Build location relationships
 * Strategy: Link characters to Marvel locations based on name matching and metadata
 */
async function buildLocationRelationships() {
    console.log("🔗 Building character-location relationships...");
    const relationships = [];
    // Get all Marvel locations
    const locations = await databaseStorage_1.db
        .select({
        id: schema_1.marvelLocations.id,
        name: schema_1.marvelLocations.name,
        notableResidents: schema_1.marvelLocations.notableResidents,
        relatedCharacterIds: schema_1.marvelLocations.relatedCharacterIds,
    })
        .from(schema_1.marvelLocations);
    console.log(`📊 Processing ${locations.length} Marvel locations`);
    for (const location of locations) {
        // Link via notableResidents (character names)
        if (location.notableResidents && location.notableResidents.length > 0) {
            for (const residentName of location.notableResidents) {
                const characters = await databaseStorage_1.db
                    .select({ id: schema_1.assets.id, name: schema_1.assets.name })
                    .from(schema_1.assets)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assets.type, "character"), (0, drizzle_orm_1.sql) `LOWER(${schema_1.assets.name}) = LOWER(${residentName})`));
                for (const character of characters) {
                    relationships.push({
                        sourceAssetId: character.id,
                        targetAssetId: location.id,
                        relationshipType: "location",
                        relationshipStrength: "0.70",
                        description: `Associated with ${location.name}`,
                        metadata: { discoveryMethod: "location_residents" },
                    });
                }
            }
        }
        // Link via relatedCharacterIds (direct IDs)
        if (location.relatedCharacterIds && location.relatedCharacterIds.length > 0) {
            for (const charId of location.relatedCharacterIds) {
                relationships.push({
                    sourceAssetId: charId,
                    targetAssetId: location.id,
                    relationshipType: "location",
                    relationshipStrength: "0.80",
                    description: `Associated with ${location.name}`,
                    metadata: { discoveryMethod: "location_character_ids" },
                });
            }
        }
    }
    console.log(`✅ Generated ${relationships.length} location relationships`);
    return {
        relationships,
        sourceType: "marvel_locations",
        count: relationships.length,
    };
}
/**
 * Build gadget relationships
 * Strategy: Link characters to Marvel gadgets based on associated characters
 */
async function buildGadgetRelationships() {
    console.log("🔗 Building character-gadget relationships...");
    const relationships = [];
    // Get all Marvel gadgets
    const gadgets = await databaseStorage_1.db
        .select({
        id: schema_1.marvelGadgets.id,
        name: schema_1.marvelGadgets.name,
        associatedCharacters: schema_1.marvelGadgets.associatedCharacters,
        relatedCharacterIds: schema_1.marvelGadgets.relatedCharacterIds,
    })
        .from(schema_1.marvelGadgets);
    console.log(`📊 Processing ${gadgets.length} Marvel gadgets`);
    for (const gadget of gadgets) {
        // Link via associatedCharacters (character names)
        if (gadget.associatedCharacters && gadget.associatedCharacters.length > 0) {
            for (const charName of gadget.associatedCharacters) {
                const characters = await databaseStorage_1.db
                    .select({ id: schema_1.assets.id, name: schema_1.assets.name })
                    .from(schema_1.assets)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assets.type, "character"), (0, drizzle_orm_1.sql) `LOWER(${schema_1.assets.name}) = LOWER(${charName})`));
                for (const character of characters) {
                    relationships.push({
                        sourceAssetId: character.id,
                        targetAssetId: gadget.id,
                        relationshipType: "uses_gadget",
                        relationshipStrength: "0.75",
                        description: `Uses ${gadget.name}`,
                        metadata: { discoveryMethod: "gadget_associated_characters" },
                    });
                }
            }
        }
        // Link via relatedCharacterIds (direct IDs)
        if (gadget.relatedCharacterIds && gadget.relatedCharacterIds.length > 0) {
            for (const charId of gadget.relatedCharacterIds) {
                relationships.push({
                    sourceAssetId: charId,
                    targetAssetId: gadget.id,
                    relationshipType: "uses_gadget",
                    relationshipStrength: "0.85",
                    description: `Uses ${gadget.name}`,
                    metadata: { discoveryMethod: "gadget_character_ids" },
                });
            }
        }
    }
    console.log(`✅ Generated ${relationships.length} gadget relationships`);
    return {
        relationships,
        sourceType: "marvel_gadgets",
        count: relationships.length,
    };
}
/**
 * Insert relationships in batches with deduplication
 * Uses ON CONFLICT to avoid inserting duplicates
 */
async function insertRelationshipBatch(relationships, batchSize = 500) {
    if (relationships.length === 0) {
        return 0;
    }
    let inserted = 0;
    for (let i = 0; i < relationships.length; i += batchSize) {
        const batch = relationships.slice(i, i + batchSize);
        try {
            // Use raw SQL with ON CONFLICT to handle duplicates
            for (const rel of batch) {
                await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
          INSERT INTO asset_relationships (
            source_asset_id, 
            target_asset_id, 
            relationship_type, 
            relationship_strength, 
            description, 
            metadata
          )
          VALUES (
            ${rel.sourceAssetId},
            ${rel.targetAssetId},
            ${rel.relationshipType},
            ${rel.relationshipStrength},
            ${rel.description},
            ${rel.metadata}::jsonb
          )
          ON CONFLICT (source_asset_id, target_asset_id, relationship_type) 
          DO NOTHING
        `);
            }
            inserted += batch.length;
            console.log(`  💾 Processed ${inserted}/${relationships.length} relationships (duplicates skipped)`);
        }
        catch (error) {
            console.error(`  ❌ Error inserting batch: ${error.message}`);
        }
    }
    return inserted;
}
/**
 * Run full relationship building pipeline
 */
async function buildAllRelationships() {
    console.log("🚀 Starting full relationship building pipeline...\n");
    const results = {
        teammate: 0,
        franchise: 0,
        creator: 0,
        location: 0,
        gadget: 0,
        total: 0,
    };
    try {
        // 1. Build teammate relationships
        const teammateResult = await buildTeammateRelationships(500);
        results.teammate = await insertRelationshipBatch(teammateResult.relationships);
        // 2. Build franchise relationships  
        const franchiseResult = await buildFranchiseRelationships(500);
        results.franchise = await insertRelationshipBatch(franchiseResult.relationships);
        // 3. Build creator relationships
        const creatorResult = await buildCreatorRelationships(2000);
        results.creator = await insertRelationshipBatch(creatorResult.relationships);
        // 4. Build location relationships
        const locationResult = await buildLocationRelationships();
        results.location = await insertRelationshipBatch(locationResult.relationships);
        // 5. Build gadget relationships
        const gadgetResult = await buildGadgetRelationships();
        results.gadget = await insertRelationshipBatch(gadgetResult.relationships);
        results.total =
            results.teammate +
                results.franchise +
                results.creator +
                results.location +
                results.gadget;
        console.log("\n✨ Relationship building complete!");
        console.log("📊 Summary:");
        console.log(`  - Teammate relationships: ${results.teammate}`);
        console.log(`  - Franchise relationships: ${results.franchise}`);
        console.log(`  - Creator relationships: ${results.creator}`);
        console.log(`  - Location relationships: ${results.location}`);
        console.log(`  - Gadget relationships: ${results.gadget}`);
        console.log(`  - Total relationships: ${results.total}`);
        return results;
    }
    catch (error) {
        console.error("❌ Error in relationship building pipeline:", error);
        throw error;
    }
}
