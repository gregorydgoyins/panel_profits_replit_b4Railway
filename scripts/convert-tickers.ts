import { db } from '../server/db.js';
import { assets } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

// Function to generate 4-character ticker from name
function generateTicker(name: string): string {
  // Remove special characters and spaces
  const cleaned = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  
  // Take first 4 characters
  if (cleaned.length >= 4) {
    return cleaned.substring(0, 4);
  }
  
  // Pad with X if less than 4
  return cleaned.padEnd(4, 'X');
}

async function convertTickers() {
  try {
    console.log('Starting ticker conversion...');
    
    // Get all assets
    const allAssets = await db.select().from(assets);
    console.log(`Found ${allAssets.length} assets to convert`);
    
    // Track used tickers to avoid duplicates
    const usedTickers = new Set<string>();
    const updates: Array<{ id: string; oldSymbol: string; newSymbol: string }> = [];
    
    for (const asset of allAssets) {
      let baseTicker = generateTicker(asset.name);
      let finalTicker = baseTicker;
      let counter = 1;
      
      // Handle collisions by appending numbers
      while (usedTickers.has(finalTicker)) {
        if (counter <= 9) {
          finalTicker = baseTicker.substring(0, 3) + counter;
        } else {
          // Use letters A-Z after numbers run out
          const letter = String.fromCharCode(65 + (counter - 10));
          finalTicker = baseTicker.substring(0, 3) + letter;
        }
        counter++;
      }
      
      usedTickers.add(finalTicker);
      updates.push({
        id: asset.id,
        oldSymbol: asset.symbol,
        newSymbol: finalTicker
      });
    }
    
    // Update all assets
    console.log('\nUpdating assets...');
    for (const update of updates) {
      await db
        .update(assets)
        .set({ symbol: update.newSymbol })
        .where(sql`${assets.id} = ${update.id}`);
      
      console.log(`${update.oldSymbol.padEnd(25)} → ${update.newSymbol}`);
    }
    
    console.log(`\nSuccessfully converted ${updates.length} tickers!`);
    process.exit(0);
  } catch (error) {
    console.error('Error converting tickers:', error);
    process.exit(1);
  }
}

convertTickers();
