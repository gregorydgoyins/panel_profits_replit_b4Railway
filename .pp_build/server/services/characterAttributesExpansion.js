"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterAttributesExpansionService = void 0;
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const sql_connection = (0, serverless_1.neon)(process.env.DATABASE_URL);
const db = (0, neon_http_1.drizzle)(sql_connection);
class CharacterAttributesExpansionService {
    safeParseArray(value) {
        if (!value || value === '[]' || value === "['']")
            return [];
        try {
            // Handle Python-style lists with single quotes
            const cleaned = value
                .replace(/\['/g, '["')
                .replace(/'\]/g, '"]')
                .replace(/', '/g, '", "')
                .replace(/','/g, '","');
            return JSON.parse(cleaned);
        }
        catch {
            return [];
        }
    }
    async processSuperheroesDataset(csvPath) {
        const csvContent = (0, fs_1.readFileSync)(csvPath, 'utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        console.log(`🦸 Processing ${records.length} superheroes with attributes...`);
        let updated = 0;
        let notFound = 0;
        let errors = 0;
        for (const row of records) {
            try {
                // Extract power flags (all has_* fields)
                const powers = [];
                for (const key in row) {
                    if (key.startsWith('has_') && row[key] === '1.0') {
                        const powerName = key.replace('has_', '').replace(/_/g, ' ');
                        powers.push(powerName);
                    }
                }
                // Build comprehensive attributes object
                const attributes = {
                    // Biography
                    realName: row.real_name || null,
                    fullName: row.full_name || null,
                    history: row.history_text || null,
                    powersDescription: row.powers_text || null,
                    // Stats
                    stats: {
                        overall: parseInt(row.overall_score) || null,
                        intelligence: parseInt(row.intelligence_score) || null,
                        strength: parseInt(row.strength_score) || null,
                        speed: parseInt(row.speed_score) || null,
                        durability: parseInt(row.durability_score) || null,
                        power: parseInt(row.power_score) || null,
                        combat: parseInt(row.combat_score) || null
                    },
                    // Powers
                    superpowers: this.safeParseArray(row.superpowers),
                    powers: powers,
                    // Identity
                    alterEgos: this.safeParseArray(row.alter_egos),
                    aliases: this.safeParseArray(row.aliases),
                    // Background
                    placeOfBirth: row.place_of_birth || null,
                    firstAppearance: row.first_appearance || null,
                    creator: row.creator || null,
                    alignment: row.alignment || null, // Good, Bad, Neutral
                    // Occupation & Affiliations
                    occupation: row.occupation || null,
                    base: row.base || null,
                    teams: this.safeParseArray(row.teams),
                    relatives: row.relatives || null,
                    // Physical
                    gender: row.gender || null,
                    race: row.type_race || null,
                    height: row.height || null,
                    weight: row.weight || null,
                    eyeColor: row.eye_color || null,
                    hairColor: row.hair_color || null,
                    skinColor: row.skin_color || null,
                    // Source
                    attributesSource: 'kaggle_superheroes_nlp'
                };
                // Try to find existing character by name
                const existingAssets = await db
                    .select()
                    .from(schema_1.assets)
                    .where((0, drizzle_orm_1.sql) `LOWER(${schema_1.assets.name}) = LOWER(${row.name})`)
                    .limit(1);
                if (existingAssets.length > 0) {
                    const asset = existingAssets[0];
                    // Merge with existing metadata
                    const updatedMetadata = {
                        ...(asset.metadata || {}),
                        characterAttributes: attributes
                    };
                    // Update imageUrl if we have one and asset doesn't
                    const updates = {
                        metadata: updatedMetadata,
                        updatedAt: new Date()
                    };
                    if (row.img && !asset.imageUrl) {
                        updates.imageUrl = row.img;
                    }
                    await db
                        .update(schema_1.assets)
                        .set(updates)
                        .where((0, drizzle_orm_1.eq)(schema_1.assets.id, asset.id));
                    updated++;
                    if (updated % 100 === 0) {
                        console.log(`   ✅ Updated ${updated} characters with attributes`);
                    }
                }
                else {
                    notFound++;
                }
            }
            catch (error) {
                console.error(`Error processing ${row.name}:`, error);
                errors++;
            }
        }
        console.log(`✅ Attribute update complete: ${updated} updated, ${notFound} not found, ${errors} errors`);
        return { updated, notFound, errors };
    }
}
exports.CharacterAttributesExpansionService = CharacterAttributesExpansionService;
