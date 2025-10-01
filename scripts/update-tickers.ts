import { db } from '../server/db.js';
import { assets } from '../shared/schema.js';
import { tickerGenerator } from '../server/tickerGenerator.js';
import { sql } from 'drizzle-orm';

async function updateAssetTickers() {
  try {
    console.log('🎯 Starting ticker update...\n');

    // Get all assets
    const allAssets = await db.select().from(assets);
    console.log(`Found ${allAssets.length} assets to process\n`);

    // Load existing tickers to avoid conflicts
    const existingTickers = allAssets.map(a => a.symbol);
    tickerGenerator.loadExistingTickers(existingTickers);

    // Generate new tickers
    const updates: Array<{ id: string; oldSymbol: string; newSymbol: string; name: string }> = [];

    for (const asset of allAssets) {
      // Extract variation if it's a sequel/year-specific title
      let variation: string | undefined;
      const yearMatch = asset.name.match(/\((\d{4})\)/); // Match (1989), (2021), etc.
      const sequelMatch = asset.name.match(/:\s*([A-Za-z\s]+)$/); // Match ": No Way Home", ": Beyond", etc.

      if (yearMatch) {
        variation = yearMatch[1].substring(2); // "1989" → "89"
      } else if (sequelMatch) {
        const subtitle = sequelMatch[1].trim();
        variation = subtitle.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase(); // "No Way Home" → "NWH"
      }

      const newTicker = tickerGenerator.generateTicker({
        baseName: asset.name,
        variation
      });

      updates.push({
        id: asset.id,
        oldSymbol: asset.symbol,
        newSymbol: newTicker,
        name: asset.name
      });
    }

    // Update database
    console.log('Updating database...\n');
    for (const update of updates) {
      await db
        .update(assets)
        .set({ symbol: update.newSymbol })
        .where(sql`${assets.id} = ${update.id}`);

      console.log(`${update.oldSymbol.padEnd(12)} → ${update.newSymbol.padEnd(12)} | ${update.name}`);
    }

    // Show stats
    const stats = tickerGenerator.getStats();
    console.log(`\n✅ Updated ${updates.length} tickers`);
    console.log(`📊 Ticker space used: ${stats.totalUsed.toLocaleString()} / ${(stats.totalUsed + stats.availableSpace).toLocaleString()}`);
    console.log(`💡 Remaining capacity: ${stats.availableSpace.toLocaleString()} tickers`);

    // Show some examples
    console.log('\n📝 Sample tickers:');
    const samples = updates.slice(0, 10);
    samples.forEach(s => {
      console.log(`  ${s.newSymbol} - ${s.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating tickers:', error);
    process.exit(1);
  }
}

updateAssetTickers();
