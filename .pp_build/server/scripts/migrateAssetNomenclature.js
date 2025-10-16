"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseStorage_js_1 = require("../databaseStorage.js");
const schema_1 = require("../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = __importDefault(require("crypto"));
/**
 * CRITICAL NOMENCLATURE MIGRATION
 *
 * Migrates 357,027 assets from placeholder symbols (A######) to proper dot-delimited format:
 * - Comics: TICKR.V#.#ISSUE (e.g., ASM.V1.#300)
 * - Characters: CHAR.HASH (e.g., SPIDEY.A1B2C3)
 * - Creators: CRTR.HASH (e.g., STANLEE.X9Y8Z7)
 * - Franchises: FRAN.HASH (e.g., MARVEL.Q5W6E7)
 * - Series: SER.HASH (e.g., ASM.R3T4Y5)
 */
const seriesAbbreviations = new Map([
    ['amazing spider-man', 'ASM'],
    ['amazing spiderman', 'ASM'],
    ['spectacular spider-man', 'SPEC'],
    ['ultimate spider-man', 'USM'],
    ['spider-man', 'SPDR'],
    ['spiderman', 'SPDR'],
    ['batman', 'BATM'],
    ['detective comics', 'DETC'],
    ['batman detective comics', 'DETC'],
    ['superman', 'SUPM'],
    ['action comics', 'ACTC'],
    ['uncanny x-men', 'UXM'],
    ['x-men', 'XMEN'],
    ['astonishing x-men', 'AXM'],
    ['avengers', 'AVNG'],
    ['new avengers', 'NAVG'],
    ['justice league', 'JLA'],
    ['fantastic four', 'FF'],
    ['hulk', 'HULK'],
    ['incredible hulk', 'IHULK'],
    ['iron man', 'IRON'],
    ['captain america', 'CAP'],
    ['thor', 'THOR'],
    ['wonder woman', 'WW'],
    ['flash', 'FLSH'],
    ['green lantern', 'GL'],
    ['daredevil', 'DD'],
    ['punisher', 'PNSH'],
    ['wolverine', 'WOLV'],
    ['deadpool', 'DPOOL'],
    ['spawn', 'SPWN'],
    ['walking dead', 'TWD'],
]);
function generateDeterministicHash(input, length = 6) {
    return crypto_1.default.createHash('sha256').update(input).digest('hex').substring(0, length).toUpperCase();
}
function cleanAndAbbreviate(name, maxLength = 8) {
    const spacedName = name.replace(/[-\/\.]/g, ' ');
    const cleaned = spacedName.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) {
        return name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxLength) || 'ASSET';
    }
    if (words.length === 1) {
        return words[0].slice(0, maxLength);
    }
    const acronym = words.map(w => w[0]).join('');
    if (acronym.length <= maxLength && acronym.length >= 3) {
        return acronym;
    }
    const firstWord = words[0].slice(0, Math.min(4, maxLength - (words.length - 1)));
    const otherLetters = words.slice(1).map(w => w[0]).join('');
    return (firstWord + otherLetters).slice(0, maxLength);
}
function parseComicName(name) {
    const volMatch = name.match(/\b(?:vol(?:ume)?\.?|v)\s*(\d+)/i);
    const volume = volMatch ? volMatch[1] : undefined;
    const issueMatch = name.match(/#(\d+)|issue\s+(\d+)/i);
    const issue = issueMatch ? (issueMatch[1] || issueMatch[2]) : undefined;
    let series = name
        .replace(/\b(?:vol(?:ume)?\.?|v)\s*\d+/i, '')
        .replace(/#\d+/g, '')
        .replace(/issue\s+\d+/i, '')
        .replace(/\(\d{4}\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return { series, volume, issue };
}
function getSeriesTicker(seriesName) {
    if (!seriesName || !seriesName.trim())
        return null;
    const normalized = seriesName.toLowerCase().trim();
    if (seriesAbbreviations.has(normalized)) {
        return seriesAbbreviations.get(normalized);
    }
    if (normalized.length >= 3) {
        for (const [key, ticker] of seriesAbbreviations.entries()) {
            if (normalized.includes(key) || key.includes(normalized)) {
                return ticker;
            }
        }
    }
    return null;
}
function generateComicSymbol(name, id) {
    const parsed = parseComicName(name);
    const ticker = getSeriesTicker(parsed.series) || cleanAndAbbreviate(parsed.series, 6);
    const volume = parsed.volume || '1';
    const issue = parsed.issue || generateDeterministicHash(id, 4);
    return `${ticker}.V${volume}.#${issue}`;
}
function generateCharacterSymbol(name, id) {
    const ticker = cleanAndAbbreviate(name, 6);
    const hash = generateDeterministicHash(id, 6);
    return `${ticker}.${hash}`;
}
function generateCreatorSymbol(name, id) {
    const ticker = cleanAndAbbreviate(name, 6);
    const hash = generateDeterministicHash(id, 6);
    return `${ticker}.${hash}`;
}
function generateFranchiseSymbol(name, id) {
    const ticker = cleanAndAbbreviate(name, 6);
    const hash = generateDeterministicHash(id, 6);
    return `${ticker}.${hash}`;
}
function generateSeriesSymbol(name, id) {
    const ticker = getSeriesTicker(name) || cleanAndAbbreviate(name, 6);
    const hash = generateDeterministicHash(id, 6);
    return `${ticker}.${hash}`;
}
async function migrateAssets() {
    console.log('🚀 Starting nomenclature migration for 357,027 assets...\n');
    const batchSize = 1000;
    const types = ['character', 'comic', 'creator', 'franchise', 'series'];
    for (const assetType of types) {
        console.log(`\n📦 Processing ${assetType} assets...`);
        // Get count
        const countResult = await databaseStorage_js_1.db.execute((0, drizzle_orm_1.sql) `
      SELECT COUNT(*) as count 
      FROM ${schema_1.assets} 
      WHERE type = ${assetType} 
      AND symbol NOT LIKE '%.%'
    `);
        const totalCount = parseInt(countResult.rows[0].count);
        console.log(`   Found ${totalCount.toLocaleString()} assets needing migration`);
        let processed = 0;
        let updated = 0;
        while (processed < totalCount) {
            // Fetch batch
            const batch = await databaseStorage_js_1.db.select({
                id: schema_1.assets.id,
                symbol: schema_1.assets.symbol,
                name: schema_1.assets.name,
                type: schema_1.assets.type
            })
                .from(schema_1.assets)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.assets.type, assetType), (0, drizzle_orm_1.not)((0, drizzle_orm_1.like)(schema_1.assets.symbol, '%.%'))))
                .limit(batchSize)
                .offset(processed);
            // Update each asset
            for (const asset of batch) {
                let newSymbol;
                switch (assetType) {
                    case 'comic':
                        newSymbol = generateComicSymbol(asset.name, asset.id);
                        break;
                    case 'character':
                        newSymbol = generateCharacterSymbol(asset.name, asset.id);
                        break;
                    case 'creator':
                        newSymbol = generateCreatorSymbol(asset.name, asset.id);
                        break;
                    case 'franchise':
                        newSymbol = generateFranchiseSymbol(asset.name, asset.id);
                        break;
                    case 'series':
                        newSymbol = generateSeriesSymbol(asset.name, asset.id);
                        break;
                    default:
                        continue;
                }
                // Update symbol
                await databaseStorage_js_1.db.update(schema_1.assets)
                    .set({ symbol: newSymbol })
                    .where((0, drizzle_orm_1.eq)(schema_1.assets.id, asset.id));
                updated++;
            }
            processed += batch.length;
            console.log(`   Progress: ${processed.toLocaleString()}/${totalCount.toLocaleString()} (${Math.round(processed / totalCount * 100)}%)`);
            if (batch.length === 0)
                break;
        }
        console.log(`   ✅ Updated ${updated.toLocaleString()} ${assetType} symbols`);
    }
    console.log('\n✅ Nomenclature migration complete!');
    console.log('📊 Verifying results...\n');
    // Verify
    for (const assetType of types) {
        const result = await databaseStorage_js_1.db.execute((0, drizzle_orm_1.sql) `
      SELECT 
        COUNT(*) FILTER (WHERE symbol LIKE '%.%') as with_dots,
        COUNT(*) FILTER (WHERE symbol NOT LIKE '%.%') as without_dots
      FROM ${schema_1.assets}
      WHERE type = ${assetType}
    `);
        const withDots = parseInt(result.rows[0].with_dots);
        const withoutDots = parseInt(result.rows[0].without_dots);
        console.log(`${assetType.padEnd(12)} - ✅ ${withDots.toLocaleString()} correct | ❌ ${withoutDots.toLocaleString()} incorrect`);
    }
}
migrateAssets()
    .then(() => {
    console.log('\n🎉 Migration completed successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});
