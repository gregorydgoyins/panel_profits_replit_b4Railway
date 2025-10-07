import { db } from '../databaseStorage.js';
import { assets } from '../../shared/schema';
import { eq, sql, and, not, like } from 'drizzle-orm';
import crypto from 'crypto';

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

function generateDeterministicHash(input: string, length: number = 6): string {
  return crypto.createHash('sha256').update(input).digest('hex').substring(0, length).toUpperCase();
}

function cleanAndAbbreviate(name: string, maxLength: number = 8): string {
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

function parseComicName(name: string): { series: string; volume?: string; issue?: string } {
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

function getSeriesTicker(seriesName: string): string | null {
  if (!seriesName || !seriesName.trim()) return null;
  
  const normalized = seriesName.toLowerCase().trim();
  
  if (seriesAbbreviations.has(normalized)) {
    return seriesAbbreviations.get(normalized)!;
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

function generateComicSymbol(name: string, id: string): string {
  const parsed = parseComicName(name);
  const ticker = getSeriesTicker(parsed.series) || cleanAndAbbreviate(parsed.series, 6);
  const volume = parsed.volume || '1';
  const issue = parsed.issue || generateDeterministicHash(id, 4);
  
  return `${ticker}.V${volume}.#${issue}`;
}

function generateCharacterSymbol(name: string, id: string): string {
  const ticker = cleanAndAbbreviate(name, 6);
  const hash = generateDeterministicHash(id, 6);
  return `${ticker}.${hash}`;
}

function generateCreatorSymbol(name: string, id: string): string {
  const ticker = cleanAndAbbreviate(name, 6);
  const hash = generateDeterministicHash(id, 6);
  return `${ticker}.${hash}`;
}

function generateFranchiseSymbol(name: string, id: string): string {
  const ticker = cleanAndAbbreviate(name, 6);
  const hash = generateDeterministicHash(id, 6);
  return `${ticker}.${hash}`;
}

function generateSeriesSymbol(name: string, id: string): string {
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
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM ${assets} 
      WHERE type = ${assetType} 
      AND symbol NOT LIKE '%.%'
    `);
    
    const totalCount = parseInt(countResult.rows[0].count as string);
    console.log(`   Found ${totalCount.toLocaleString()} assets needing migration`);
    
    let processed = 0;
    let updated = 0;
    
    while (processed < totalCount) {
      // Fetch batch
      const batch = await db.select({
        id: assets.id,
        symbol: assets.symbol,
        name: assets.name,
        type: assets.type
      })
      .from(assets)
      .where(and(
        eq(assets.type, assetType),
        not(like(assets.symbol, '%.%'))
      ))
      .limit(batchSize)
      .offset(processed);
      
      // Update each asset
      for (const asset of batch) {
        let newSymbol: string;
        
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
        await db.update(assets)
          .set({ symbol: newSymbol })
          .where(eq(assets.id, asset.id));
        
        updated++;
      }
      
      processed += batch.length;
      console.log(`   Progress: ${processed.toLocaleString()}/${totalCount.toLocaleString()} (${Math.round(processed/totalCount*100)}%)`);
      
      if (batch.length === 0) break;
    }
    
    console.log(`   ✅ Updated ${updated.toLocaleString()} ${assetType} symbols`);
  }
  
  console.log('\n✅ Nomenclature migration complete!');
  console.log('📊 Verifying results...\n');
  
  // Verify
  for (const assetType of types) {
    const result = await db.execute(sql`
      SELECT 
        COUNT(*) FILTER (WHERE symbol LIKE '%.%') as with_dots,
        COUNT(*) FILTER (WHERE symbol NOT LIKE '%.%') as without_dots
      FROM ${assets}
      WHERE type = ${assetType}
    `);
    
    const withDots = parseInt(result.rows[0].with_dots as string);
    const withoutDots = parseInt(result.rows[0].without_dots as string);
    
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
