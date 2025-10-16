"use strict";
/**
 * Hydrate Narrative Entity Images from Comic Vine
 * Updates narrative_entities table with real comic book cover images
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const schema_1 = require("@db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY;
const COMIC_VINE_BASE_URL = 'https://comicvine.gamespot.com/api';
async function searchComicVineCharacter(name) {
    if (!COMIC_VINE_API_KEY) {
        console.log('⚠️ COMIC_VINE_API_KEY not found');
        return null;
    }
    try {
        const url = `${COMIC_VINE_BASE_URL}/search?api_key=${COMIC_VINE_API_KEY}&format=json&resources=character&query=${encodeURIComponent(name)}&limit=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Panel Profits Trading Platform'
            }
        });
        if (!response.ok) {
            console.log(`❌ Comic Vine API error: ${response.status}`);
            return null;
        }
        const data = await response.json();
        if (data.results && data.results.length > 0 && data.results[0].image) {
            return data.results[0].image.super_url || data.results[0].image.medium_url;
        }
        return null;
    }
    catch (error) {
        console.error(`Error fetching image for ${name}:`, error);
        return null;
    }
}
async function searchComicVineLocation(name) {
    if (!COMIC_VINE_API_KEY) {
        return null;
    }
    try {
        const url = `${COMIC_VINE_BASE_URL}/search?api_key=${COMIC_VINE_API_KEY}&format=json&resources=location&query=${encodeURIComponent(name)}&limit=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Panel Profits Trading Platform'
            }
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (data.results && data.results.length > 0 && data.results[0].image) {
            return data.results[0].image.super_url || data.results[0].image.medium_url;
        }
        return null;
    }
    catch (error) {
        console.error(`Error fetching location image for ${name}:`, error);
        return null;
    }
}
async function hydrateImages() {
    console.log('🎨 Starting narrative entity image hydration...\n');
    // Get all entities
    const entities = await db_1.db.select().from(schema_1.narrativeEntities);
    console.log(`📦 Found ${entities.length} narrative entities to process\n`);
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    for (const entity of entities) {
        console.log(`Processing: ${entity.canonicalName} (${entity.entityType}/${entity.subtype})`);
        // Skip if already has a valid Comic Vine image
        if (entity.primaryImageUrl && entity.primaryImageUrl.includes('comicvine')) {
            console.log(`  ✓ Already has Comic Vine image, skipping\n`);
            skipped++;
            continue;
        }
        let imageUrl = null;
        // Search based on entity type
        if (entity.entityType === 'character') {
            imageUrl = await searchComicVineCharacter(entity.canonicalName);
        }
        else if (entity.entityType === 'location') {
            imageUrl = await searchComicVineLocation(entity.canonicalName);
        }
        else if (entity.entityType === 'artifact') {
            // Try searching as object/thing
            const url = `${COMIC_VINE_BASE_URL}/search?api_key=${COMIC_VINE_API_KEY}&format=json&resources=object&query=${encodeURIComponent(entity.canonicalName)}&limit=1`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Panel Profits Trading Platform' }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0 && data.results[0].image) {
                    imageUrl = data.results[0].image.super_url || data.results[0].image.medium_url;
                }
            }
        }
        if (imageUrl) {
            // Update the entity with the new image
            await db_1.db
                .update(schema_1.narrativeEntities)
                .set({ primaryImageUrl: imageUrl })
                .where((0, drizzle_orm_1.eq)(schema_1.narrativeEntities.id, entity.id));
            console.log(`  ✅ Updated with: ${imageUrl}\n`);
            updated++;
        }
        else {
            console.log(`  ❌ No image found\n`);
            failed++;
        }
        // Rate limit: 1 request per second
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n📊 Hydration Complete!');
    console.log(`  ✅ Updated: ${updated}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  ❌ Failed: ${failed}`);
}
// Run the hydration
hydrateImages().catch(console.error);
