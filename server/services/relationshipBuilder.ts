import { db } from "../databaseStorage";
import { assets, assetRelationships, marvelLocations, marvelGadgets } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import type { InsertAssetRelationship } from "@shared/schema";

/**
 * Relationship Builder Service
 * Populates asset_relationships table by discovering connections between:
 * - Characters who share teams/franchises (teammates)
 * - Characters created by same creators
 * - Characters linked to locations (Thor -> Asgard)
 * - Characters linked to gadgets (Thor -> Mjolnir)
 */

interface RelationshipBatch {
  relationships: InsertAssetRelationship[];
  sourceType: string;
  count: number;
}

/**
 * Build teammate relationships from shared team tags
 * Strategy: Extract teams from metadata.characterAttributes.teams and find overlaps
 */
export async function buildTeammateRelationships(batchSize = 1000): Promise<RelationshipBatch> {
  console.log("🔗 Building teammate relationships from shared teams...");
  
  const relationships: InsertAssetRelationship[] = [];
  
  // Get all characters with metadata
  const characters = await db
    .select({
      id: assets.id,
      name: assets.name,
      metadata: assets.metadata,
    })
    .from(assets)
    .where(eq(assets.type, "character"))
    .limit(batchSize);

  // Extract teams from metadata
  const charactersWithTeams = characters
    .map(char => {
      const metadata = char.metadata as any;
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
      const sharedTeams = char1.teams.filter((team: string) => char2.teams.includes(team));
      
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
export async function buildFranchiseRelationships(batchSize = 1000): Promise<RelationshipBatch> {
  console.log("🔗 Building franchise/publisher relationships...");
  
  const relationships: InsertAssetRelationship[] = [];
  
  // Get all characters with metadata
  const characters = await db
    .select({
      id: assets.id,
      name: assets.name,
      metadata: assets.metadata,
    })
    .from(assets)
    .where(eq(assets.type, "character"))
    .limit(batchSize);

  // Extract publishers from metadata
  const charactersWithPublishers = characters
    .map(char => {
      const metadata = char.metadata as any;
      const publisher = metadata?.publisher || metadata?.characterAttributes?.creator;
      return { ...char, publisher };
    })
    .filter(char => char.publisher);

  console.log(`📊 Found ${charactersWithPublishers.length} characters with publisher/franchise data`);

  // Group by publisher
  const publisherGroups = new Map<string, typeof charactersWithPublishers>();
  for (const char of charactersWithPublishers) {
    const publisher = char.publisher;
    if (!publisherGroups.has(publisher)) {
      publisherGroups.set(publisher, []);
    }
    publisherGroups.get(publisher)!.push(char);
  }

  // Build relationships within each publisher group
  Array.from(publisherGroups.entries()).forEach(([publisher, chars]) => {
    if (chars.length < 2) return;
    
    // Only build relationships for major publishers (> 5 characters)
    if (chars.length < 5) return;

    for (let i = 0; i < Math.min(chars.length, 100); i++) {
      for (let j = i + 1; j < Math.min(chars.length, 100); j++) {
        relationships.push({
          sourceAssetId: chars[i].id,
          targetAssetId: chars[j].id,
          relationshipType: "ally",
          relationshipStrength: "0.15",
          description: `Same universe: ${publisher}`,
          metadata: { publisher, discoveryMethod: "publisher_grouping" },
        });

        relationships.push({
          sourceAssetId: chars[j].id,
          targetAssetId: chars[i].id,
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
export async function buildCreatorRelationships(batchSize = 5000): Promise<RelationshipBatch> {
  console.log("🔗 Building creator-character relationships...");
  
  const relationships: InsertAssetRelationship[] = [];
  
  // Get all characters
  const characters = await db
    .select({
      id: assets.id,
      name: assets.name,
      metadata: assets.metadata,
    })
    .from(assets)
    .where(eq(assets.type, "character"))
    .limit(batchSize);

  // Get all creators
  const creators = await db
    .select({
      id: assets.id,
      name: assets.name,
    })
    .from(assets)
    .where(eq(assets.type, "creator"));

  const creatorMap = new Map(creators.map((c: { name: string; id: string }) => [c.name.toLowerCase(), c.id]));

  console.log(`📊 Processing ${characters.length} characters against ${creators.length} creators`);

  // Link characters to creators based on metadata
  for (const character of characters) {
    const metadata = character.metadata as any;
    const creatorNames: string[] = metadata?.creators || metadata?.createdBy || [];
    
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
export async function buildLocationRelationships(): Promise<RelationshipBatch> {
  console.log("🔗 Building character-location relationships...");
  
  const relationships: InsertAssetRelationship[] = [];
  
  // Get all Marvel locations
  const locations = await db
    .select({
      id: marvelLocations.id,
      name: marvelLocations.name,
      notableResidents: marvelLocations.notableResidents,
      relatedCharacterIds: marvelLocations.relatedCharacterIds,
    })
    .from(marvelLocations);

  console.log(`📊 Processing ${locations.length} Marvel locations`);

  for (const location of locations) {
    // Link via notableResidents (character names)
    if (location.notableResidents && location.notableResidents.length > 0) {
      for (const residentName of location.notableResidents) {
        const characters = await db
          .select({ id: assets.id, name: assets.name })
          .from(assets)
          .where(
            and(
              eq(assets.type, "character"),
              sql`LOWER(${assets.name}) = LOWER(${residentName})`
            )
          );

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
export async function buildGadgetRelationships(): Promise<RelationshipBatch> {
  console.log("🔗 Building character-gadget relationships...");
  
  const relationships: InsertAssetRelationship[] = [];
  
  // Get all Marvel gadgets
  const gadgets = await db
    .select({
      id: marvelGadgets.id,
      name: marvelGadgets.name,
      associatedCharacters: marvelGadgets.associatedCharacters,
      relatedCharacterIds: marvelGadgets.relatedCharacterIds,
    })
    .from(marvelGadgets);

  console.log(`📊 Processing ${gadgets.length} Marvel gadgets`);

  for (const gadget of gadgets) {
    // Link via associatedCharacters (character names)
    if (gadget.associatedCharacters && gadget.associatedCharacters.length > 0) {
      for (const charName of gadget.associatedCharacters) {
        const characters = await db
          .select({ id: assets.id, name: assets.name })
          .from(assets)
          .where(
            and(
              eq(assets.type, "character"),
              sql`LOWER(${assets.name}) = LOWER(${charName})`
            )
          );

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
 * Insert relationships in batches to avoid overwhelming the database
 */
export async function insertRelationshipBatch(
  relationships: InsertAssetRelationship[],
  batchSize = 500
): Promise<number> {
  if (relationships.length === 0) {
    return 0;
  }

  let inserted = 0;
  
  for (let i = 0; i < relationships.length; i += batchSize) {
    const batch = relationships.slice(i, i + batchSize);
    
    try {
      await db.insert(assetRelationships).values(batch);
      inserted += batch.length;
      console.log(`  💾 Inserted ${inserted}/${relationships.length} relationships`);
    } catch (error: any) {
      console.error(`  ❌ Error inserting batch: ${error.message}`);
    }
  }

  return inserted;
}

/**
 * Run full relationship building pipeline
 */
export async function buildAllRelationships() {
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
  } catch (error) {
    console.error("❌ Error in relationship building pipeline:", error);
    throw error;
  }
}
