import { db } from '../databaseStorage.js';
import { sql } from 'drizzle-orm';

/**
 * Fix Comic Volume Numbers
 * Parse actual volume numbers from comic names (V2, V3, etc.) instead of hardcoding V1
 */

async function fixComicVolumes() {
  console.log('🔧 Fixing comic volume numbers...\n');
  
  // Parse volumes from comic names
  // Patterns: "Vol 2", "Vol. 3", "Volume 4", "V5", "(2016)" for year-based volumes
  await db.execute(sql`
    UPDATE assets
    SET symbol = 
      CASE
        -- Pattern: "Vol 2" or "Vol. 2" or "Volume 2"
        WHEN name ~* 'vol(ume)?\.?\s*([0-9]+)' THEN
          UPPER(REGEXP_REPLACE(
            REGEXP_REPLACE(name, 'vol(ume)?\.?\s*[0-9]+', '', 'i'),
            '[^A-Za-z0-9 ]', '', 'g'
          )) || '.V' || 
          (REGEXP_MATCH(name, 'vol(ume)?\.?\s*([0-9]+)', 'i'))[2] ||
          '.#' || COALESCE(
            (REGEXP_MATCH(name, '#([0-9]+)'))[1],
            UPPER(SUBSTR(MD5(id::text), 1, 4))
          )
        
        -- Pattern: "#123" with no volume
        WHEN name ~ '#([0-9]+)' AND name !~* 'vol' THEN
          UPPER(REGEXP_REPLACE(
            REGEXP_REPLACE(name, '#[0-9]+', '', 'g'),
            '[^A-Za-z0-9 ]', '', 'g'
          )) || '.V1.#' || (REGEXP_MATCH(name, '#([0-9]+)'))[1]
        
        -- Default: Use hash for issue
        ELSE
          UPPER(REGEXP_REPLACE(name, '[^A-Za-z0-9 ]', '', 'g')) || 
          '.V1.#' || UPPER(SUBSTR(MD5(id::text), 1, 4))
      END
    WHERE type = 'comic'
  `);
  
  console.log('✅ Comic volumes updated\n');
  
  // Verify
  const samples = await db.execute(sql`
    SELECT name, symbol
    FROM assets
    WHERE type = 'comic'
    AND (name ILIKE '%vol%' OR name ~ '#[0-9]+')
    LIMIT 15
  `);
  
  console.log('📊 Sample Results:');
  samples.rows.forEach((row: any) => {
    console.log(`${row.name.substring(0, 50).padEnd(50)} → ${row.symbol}`);
  });
  
  console.log('\n✅ Complete!');
}

fixComicVolumes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
