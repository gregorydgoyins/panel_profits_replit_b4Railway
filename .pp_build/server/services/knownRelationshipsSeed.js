"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedKnownRelationships = seedKnownRelationships;
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const KNOWN_RELATIONSHIPS = [
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
async function findCharacter(name) {
    return await databaseStorage_1.db
        .select({ id: schema_1.assets.id, name: schema_1.assets.name })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assets.type, 'character'), (0, drizzle_orm_1.ilike)(schema_1.assets.name, name)));
}
/**
 * Find location asset by name (from assets table, not marvelLocations)
 */
async function findLocation(name) {
    const results = await databaseStorage_1.db
        .select({ id: schema_1.assets.id, name: schema_1.assets.name })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assets.type, 'location'), (0, drizzle_orm_1.ilike)(schema_1.assets.name, name)))
        .limit(1);
    return results[0] || null;
}
/**
 * Find gadget asset by name (from assets table, not marvelGadgets)
 */
async function findGadget(name) {
    const results = await databaseStorage_1.db
        .select({ id: schema_1.assets.id, name: schema_1.assets.name })
        .from(schema_1.assets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assets.type, 'gadget'), (0, drizzle_orm_1.ilike)(schema_1.assets.name, name)))
        .limit(1);
    return results[0] || null;
}
/**
 * Seed known relationships
 */
async function seedKnownRelationships() {
    console.log('🌱 Seeding known character-location-gadget relationships...\n');
    const relationships = [];
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
        let targetId = null;
        if (known.targetType === 'location') {
            const location = await findLocation(known.targetName);
            targetId = location?.id || null;
        }
        else if (known.targetType === 'gadget') {
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
            await databaseStorage_1.db.insert(schema_1.assetRelationships).values(relationships);
            console.log(`\n💾 Inserted ${relationships.length} known relationships`);
        }
        catch (error) {
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
