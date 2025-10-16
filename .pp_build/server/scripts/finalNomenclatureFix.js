"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseStorage_js_1 = require("../databaseStorage.js");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * FINAL NOMENCLATURE FIX
 * Format: SERIESKEY.EE.Vn.#ISSUE
 *
 * Examples:
 * - Amazing Spider-Man (1963) #1 → ASM.63.V1.#1
 * - Batman (1940) #404 → BATM.40.V1.#404
 * - Thor (1998) Vol 2 #62 → THOR.98.V2.#62
 * - Ultimate Spider-Man (2000) #5 → USM.00.V1.#5
 */
const seriesMap = {
    'amazing spider-man': 'ASM',
    'spectacular spider-man': 'SPEC',
    'ultimate spider-man': 'USM',
    'spider-man': 'SPDR',
    'batman': 'BATM',
    'detective comics': 'DETC',
    'superman': 'SUPM',
    'action comics': 'ACTC',
    'uncanny x-men': 'UXM',
    'x-men': 'XMEN',
    'astonishing x-men': 'AXM',
    'new x-men': 'NXM',
    'avengers': 'AVNG',
    'new avengers': 'NAVG',
    'mighty avengers': 'MAVG',
    'justice league': 'JLA',
    'fantastic four': 'FF',
    'hulk': 'HULK',
    'incredible hulk': 'IHULK',
    'iron man': 'IRON',
    'captain america': 'CAP',
    'thor': 'THOR',
    'wonder woman': 'WW',
    'flash': 'FLSH',
    'green lantern': 'GL',
    'aquaman': 'AQUA',
    'daredevil': 'DD',
    'punisher': 'PNSH',
    'wolverine': 'WOLV',
    'deadpool': 'DPOOL',
    'spawn': 'SPWN',
    'walking dead': 'TWD',
    'saga': 'SAGA',
    'invincible': 'INVC'
};
async function fixComicNomenclature() {
    console.log('🚀 FINAL Comic Nomenclature Fix: SERIESKEY.EE.Vn.#ISSUE\n');
    // Step 1: Build series map SQL for CASE statement
    const seriesCases = Object.entries(seriesMap)
        .map(([key, abbr]) => `WHEN LOWER(series_part) LIKE '%${key}%' THEN '${abbr}'`)
        .join('\n        ');
    // Step 2: Update all comics with era-based nomenclature
    console.log('📦 Updating 171,026 comics with era-based symbols...');
    await databaseStorage_js_1.db.execute((0, drizzle_orm_1.sql) `
    UPDATE assets
    SET symbol = (
      -- Extract series name (remove year, volume, issue)
      WITH parsed AS (
        SELECT 
          id,
          name,
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(name, '\([0-9]{4}\)', '', 'g'),
                'vol(ume)?\.?\s*[0-9]+', '', 'gi'
              ),
              '#[0-9]+', '', 'g'
            ),
            'issue\s+[0-9]+', '', 'gi'
          ) as series_part,
          -- Extract year (era)
          COALESCE(
            (REGEXP_MATCH(name, '\(([0-9]{4})\)'))[1],
            '0000'
          ) as year_part,
          -- Extract volume
          COALESCE(
            (REGEXP_MATCH(name, 'vol(ume)?\.?\s*([0-9]+)', 'i'))[2],
            '1'
          ) as vol_part,
          -- Extract issue
          COALESCE(
            (REGEXP_MATCH(name, '#([0-9]+)'))[1],
            (REGEXP_MATCH(name, 'issue\s+([0-9]+)', 'i'))[1],
            UPPER(SUBSTR(MD5(id::text), 1, 4))
          ) as issue_part
      )
      SELECT 
        -- Series key
        CASE
          ${drizzle_orm_1.sql.raw(seriesCases)}
          ELSE UPPER(REGEXP_REPLACE(TRIM(series_part), '[^A-Za-z0-9]', '', 'g'))
        END ||
        -- Era (last 2 digits of year)
        '.' || RIGHT(year_part, 2) ||
        -- Volume
        '.V' || vol_part ||
        -- Issue
        '.#' || issue_part
      FROM parsed
      WHERE parsed.id = assets.id
    )
    WHERE type = 'comic'
  `);
    console.log('   ✅ Comics updated\n');
    // Step 3: Verify with samples
    console.log('📊 Sample Results:');
    const samples = await databaseStorage_js_1.db.execute((0, drizzle_orm_1.sql) `
    SELECT name, symbol
    FROM assets
    WHERE type = 'comic'
    AND name ~ '\([0-9]{4}\)'
    ORDER BY RANDOM()
    LIMIT 15
  `);
    samples.rows.forEach((row) => {
        const nameShort = row.name.substring(0, 55).padEnd(55);
        console.log(`${nameShort} → ${row.symbol}`);
    });
    console.log('\n✅ Complete!');
}
fixComicNomenclature()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
});
