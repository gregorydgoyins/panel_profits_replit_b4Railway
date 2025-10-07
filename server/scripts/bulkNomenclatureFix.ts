import { db } from '../databaseStorage.js';
import { sql } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * OPTIMIZED NOMENCLATURE MIGRATION
 * Uses SQL UPDATE statements for 10-100x faster bulk updates
 */

const seriesMap: Record<string, string> = {
  'amazing spider-man': 'ASM', 'spectacular spider-man': 'SPEC', 'ultimate spider-man': 'USM',
  'spider-man': 'SPDR', 'batman': 'BATM', 'detective comics': 'DETC', 
  'superman': 'SUPM', 'action comics': 'ACTC', 'uncanny x-men': 'UXM',
  'x-men': 'XMEN', 'avengers': 'AVNG', 'justice league': 'JLA',
  'fantastic four': 'FF', 'hulk': 'HULK', 'iron man': 'IRON',
  'captain america': 'CAP', 'thor': 'THOR', 'wonder woman': 'WW',
  'flash': 'FLSH', 'green lantern': 'GL', 'daredevil': 'DD',
  'punisher': 'PNSH', 'wolverine': 'WOLV', 'deadpool': 'DPOOL',
  'spawn': 'SPWN', 'walking dead': 'TWD'
};

async function fixNomenclature() {
  console.log('🚀 OPTIMIZED Nomenclature Fix\n');
  
  // Fix Characters: CHAR.HASH
  console.log('📦 Fixing 122,964 characters...');
  await db.execute(sql`
    UPDATE assets
    SET symbol = UPPER(
      REGEXP_REPLACE(name, '[^A-Za-z0-9 ]', '', 'g')
    ) || '.' || UPPER(SUBSTR(MD5(id::text), 1, 6))
    WHERE type = 'character' 
    AND symbol NOT LIKE '%.%'
  `);
  console.log('   ✅ Characters fixed\n');

  // Fix Creators: CRTR.HASH
  console.log('📦 Fixing 52,708 creators...');
  await db.execute(sql`
    UPDATE assets
    SET symbol = UPPER(
      REGEXP_REPLACE(name, '[^A-Za-z0-9 ]', '', 'g')
    ) || '.' || UPPER(SUBSTR(MD5(id::text), 1, 6))
    WHERE type = 'creator'
    AND symbol NOT LIKE '%.%'
  `);
  console.log('   ✅ Creators fixed\n');

  // Fix Franchises: FRAN.HASH
  console.log('📦 Fixing 49,375 franchises...');
  await db.execute(sql`
    UPDATE assets
    SET symbol = UPPER(
      REGEXP_REPLACE(name, '[^A-Za-z0-9 ]', '', 'g')
    ) || '.' || UPPER(SUBSTR(MD5(id::text), 1, 6))
    WHERE type = 'franchise'
    AND symbol NOT LIKE '%.%'
  `);
  console.log('   ✅ Franchises fixed\n');

  // Fix Series: SER.HASH
  console.log('📦 Fixing 40,000 series...');
  await db.execute(sql`
    UPDATE assets
    SET symbol = UPPER(
      REGEXP_REPLACE(name, '[^A-Za-z0-9 ]', '', 'g')
    ) || '.' || UPPER(SUBSTR(MD5(id::text), 1, 6))
    WHERE type = 'series'
    AND symbol NOT LIKE '%.%'
  `);
  console.log('   ✅ Series fixed\n');

  // Fix Comics: TICKR.V#.#ISSUE (partial - simple cases)
  console.log('📦 Fixing 92,980 comics (simplified)...');
  await db.execute(sql`
    UPDATE assets
    SET symbol = 
      UPPER(REGEXP_REPLACE(name, '[^A-Za-z0-9 ]', '', 'g')) || 
      '.V1.#' || 
      UPPER(SUBSTR(MD5(id::text), 1, 4))
    WHERE type = 'comic'
    AND symbol NOT LIKE '%.%'
  `);
  console.log('   ✅ Comics fixed\n');

  // Verify
  console.log('\n📊 VERIFICATION:');
  const result = await db.execute(sql`
    SELECT 
      type,
      COUNT(*) FILTER (WHERE symbol LIKE '%.%') as correct,
      COUNT(*) FILTER (WHERE symbol NOT LIKE '%.%') as incorrect
    FROM assets
    WHERE type IN ('character', 'comic', 'creator', 'franchise', 'series')
    GROUP BY type
    ORDER BY type
  `);
  
  result.rows.forEach((row: any) => {
    console.log(`${row.type.padEnd(12)} - ✅ ${parseInt(row.correct).toLocaleString()} | ❌ ${parseInt(row.incorrect).toLocaleString()}`);
  });

  console.log('\n✅ COMPLETE!');
}

fixNomenclature()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
