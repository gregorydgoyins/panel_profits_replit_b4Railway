import { db } from "../databaseStorage";
import { assets, assetRelationships, marvelLocations, marvelGadgets } from "@shared/schema";
import { eq, and, sql, ilike } from "drizzle-orm";
import type { InsertAssetRelationship } from "@shared/schema";

/**
 * Known Relationships Seed Service
 * 
 * Populates well-known character-location-gadget relationships
 * based on comic book canon (Thor → Asgard, Thor → Mjolnir, etc.)
 */

interface KnownRelationship {
  characterName: string;
  targetName: string;
  targetType: 'location' | 'gadget';
  relationshipType: 'location' | 'uses_gadget';
  strength: string;
  description: string;
}

const KNOWN_RELATIONSHIPS: KnownRelationship[] = [
  // Thor relationships
  { characterName: 'Thor', targetName: 'Asgard', targetType: 'location', relationshipType: 'location', strength: '0.95', description: 'Prince of Asgard' },
  { characterName: 'Thor', targetName: 'Mjolnir', targetType: 'gadget', relationshipType: 'uses_gadget', strength: '0.98', description: 'Wields Mjolnir' },
  
  // Black Panther relationships
  { characterName: 'Black Panther', targetName: 'Wakanda', targetType: 'location', relationshipType: 'location', strength: '0.95', description: 'King of Wakanda' },
  
  // Doctor Doom relationships
  { characterName: 'Doctor Doom', targetName: 'Latveria', targetType: 'location', relationshipType: 'location', strength: '0.98', description: 'Ruler of Latveria' },
  
  // Aquaman relationships
  { characterName: 'Aquaman', targetName: 'Atlantis', targetType: 'location', relationshipType: 'location', strength: '0.95', description: 'King of Atlantis' },
  
  // Captain America relationships
  { characterName: 'Captain America', targetName: "Captain America's Shield", targetType: 'gadget', relationshipType: 'uses_gadget', strength: '0.98', description: 'Wields the shield' },
  
  // Iron Man relationships
  { characterName: 'Iron Man', targetName: 'Iron Man Armor', targetType: 'gadget', relationshipType: 'uses_gadget', strength: '0.98', description: 'Wears the armor' },
  
  // Thanos relationships
  { characterName: 'Thanos', targetName: 'Infinity Gauntlet', targetType: 'gadget', relationshipType: 'uses_gadget', strength: '0.90', description: 'Wields the Infinity Gauntlet' },
];

/**
 * Find character by name (case-insensitive, handles multiple versions)
 */
async function findCharacter(name: string): Promise<{ id: string; name: string }[]> {
  return await db
    .select({ id: assets.id, name: assets.name })
    .from(assets)
    .where(
      and(
        eq(assets.type, 'character'),
        ilike(assets.name, name)
      )
    );
}

/**
 * Find location by name
 */
async function findLocation(name: string): Promise<{ id: string; name: string } | null> {
  const results = await db
    .select({ id: marvelLocations.id, name: marvelLocations.name })
    .from(marvelLocations)
    .where(ilike(marvelLocations.name, name))
    .limit(1);
  
  return results[0] || null;
}

/**
 * Find gadget by name
 */
async function findGadget(name: string): Promise<{ id: string; name: string } | null> {
  const results = await db
    .select({ id: marvelGadgets.id, name: marvelGadgets.name })
    .from(marvelGadgets)
    .where(ilike(marvelGadgets.name, name))
    .limit(1);
  
  return results[0] || null;
}

/**
 * Seed known relationships
 */
export async function seedKnownRelationships(): Promise<number> {
  console.log('🌱 Seeding known character-location-gadget relationships...\n');
  
  const relationships: InsertAssetRelationship[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const known of KNOWN_RELATIONSHIPS) {
    // Find character(s)
    const characters = await findCharacter(known.characterName);
    
    if (characters.length === 0) {
      console.log(`  ⚠️  Character not found: ${known.characterName}`);
      failCount++;
      continue;
    }

    // Find target (location or gadget)
    let targetId: string | null = null;
    
    if (known.targetType === 'location') {
      const location = await findLocation(known.targetName);
      targetId = location?.id || null;
    } else if (known.targetType === 'gadget') {
      const gadget = await findGadget(known.targetName);
      targetId = gadget?.id || null;
    }

    if (!targetId) {
      console.log(`  ⚠️  ${known.targetType} not found: ${known.targetName}`);
      failCount++;
      continue;
    }

    // Create relationships for all character versions
    for (const character of characters) {
      relationships.push({
        sourceAssetId: character.id,
        targetAssetId: targetId,
        relationshipType: known.relationshipType,
        relationshipStrength: known.strength,
        description: known.description,
        metadata: { 
          discoveryMethod: 'known_canon', 
          characterName: character.name,
          targetName: known.targetName,
        },
      });

      console.log(`  ✅ ${character.name} → ${known.targetName} (${known.relationshipType})`);
      successCount++;
    }
  }

  // Insert relationships
  if (relationships.length > 0) {
    try {
      await db.insert(assetRelationships).values(relationships);
      console.log(`\n💾 Inserted ${relationships.length} known relationships`);
    } catch (error: any) {
      console.error(`\n❌ Error inserting relationships: ${error.message}`);
      throw error;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  - Success: ${successCount}`);
  console.log(`  - Failed: ${failCount}`);
  console.log(`  - Total relationships: ${relationships.length}`);

  return relationships.length;
}
