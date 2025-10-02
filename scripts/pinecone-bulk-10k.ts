import { db } from '../server/db';
import { assets, assetCurrentPrices } from '../shared/schema';
import { eq } from 'drizzle-orm';

const Pinecone = require('@pinecone-database/pinecone').Pinecone;
const OpenAI = require('openai').default;

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function bulkExpand10K() {
  console.log('🚀 Starting 10K asset expansion...');
  
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'core');
  
  // Query strategy: Multiple diverse queries to maximize unique results
  const queries = [
    "Marvel comic book characters superheroes",
    "DC Comics villains and antiheroes",
    "Independent comic creators artists writers",
    "Golden Age Silver Age comic series",
    "Modern age graphic novels",
    "Comic book crossover events",
    "Limited edition variant covers",
    "Comic book movie adaptations",
    "Underground comix alternative comics",
    "Manga and international comics"
  ];
  
  let totalCreated = 0;
  let totalPriced = 0;
  
  // Load existing symbols to avoid duplicates
  const existingAssets = await db.select({ symbol: assets.symbol }).from(assets);
  const existingSymbols = new Set(existingAssets.map(a => a.symbol));
  console.log(`📊 Loaded ${existingSymbols.size} existing symbols`);
  
  for (const query of queries) {
    console.log(`\n🔍 Query: "${query}"`);
    
    // Get embedding
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      dimensions: 1024
    });
    
    // Search Pinecone - get 1000 results per query
    const results = await index.query({
      vector: embedding.data[0].embedding,
      topK: 1000,
      includeMetadata: true
    });
    
    console.log(`  📦 Found ${results.matches.length} Pinecone matches`);
    
    const batch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const match of results.matches) {
      const metadata = match.metadata as any;
      const category = metadata.category || 'Unknown';
      
      // Generate asset based on category
      if (category === 'Character') {
        const name = metadata.name || metadata.title || 'Unknown';
        const aliases = metadata.aliases || [];
        const publisher = metadata.publisher || 'Independent';
        
        // Base character
        const baseSymbol = name.substring(0, 6).toUpperCase().replace(/[^A-Z]/g, '');
        if (!existingSymbols.has(baseSymbol)) {
          batch.push({
            symbol: baseSymbol,
            name,
            type: 'stock',
            publisher,
            description: `${name} character from ${publisher}`,
            currentPrice: (Math.random() * 500 + 50).toFixed(2)
          });
          priceBatch.push({
            assetId: baseSymbol,
            currentPrice: (Math.random() * 500 + 50).toFixed(2),
            volume: Math.floor(Math.random() * 10000)
          });
          existingSymbols.add(baseSymbol);
        }
        
        // Aliases as variants (20% chance per alias)
        aliases.slice(0, 3).forEach((alias: string, idx: number) => {
          if (Math.random() > 0.8) return;
          const variantSymbol = `${baseSymbol}.V${idx + 1}`;
          if (!existingSymbols.has(variantSymbol)) {
            batch.push({
              symbol: variantSymbol,
              name: `${alias}`,
              type: 'stock',
              publisher,
              description: `${alias} variant of ${name}`,
              currentPrice: (Math.random() * 400 + 30).toFixed(2)
            });
            priceBatch.push({
              assetId: variantSymbol,
              currentPrice: (Math.random() * 400 + 30).toFixed(2),
              volume: Math.floor(Math.random() * 5000)
            });
            existingSymbols.add(variantSymbol);
          }
        });
        
      } else if (category === 'Creator') {
        const name = metadata.name || metadata.title || 'Unknown';
        const role = metadata.role || 'Creator';
        const symbol = name.substring(0, 8).toUpperCase().replace(/[^A-Z]/g, '') + '.' + role.substring(0, 3).toUpperCase();
        
        if (!existingSymbols.has(symbol)) {
          batch.push({
            symbol,
            name: `${name} (${role})`,
            type: 'stock',
            publisher: 'Creator',
            description: `${name} - ${role}`,
            currentPrice: (Math.random() * 300 + 100).toFixed(2)
          });
          priceBatch.push({
            assetId: symbol,
            currentPrice: (Math.random() * 300 + 100).toFixed(2),
            volume: Math.floor(Math.random() * 3000)
          });
          existingSymbols.add(symbol);
        }
        
      } else if (category === 'Comics') {
        const title = metadata.title || metadata.name || 'Unknown';
        const symbol = title.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (!existingSymbols.has(symbol)) {
          batch.push({
            symbol,
            name: title,
            type: 'comic',
            publisher: metadata.publisher || 'Independent',
            description: `${title} comic series`,
            currentPrice: (Math.random() * 1000 + 50).toFixed(2)
          });
          priceBatch.push({
            assetId: symbol,
            currentPrice: (Math.random() * 1000 + 50).toFixed(2),
            volume: Math.floor(Math.random() * 8000)
          });
          existingSymbols.add(symbol);
        }
      }
      
      // Insert batches when we hit 1000
      if (batch.length >= 1000) {
        try {
          await db.insert(assets).values(batch).onConflictDoNothing();
          console.log(`    ✅ Inserted ${batch.length} assets`);
          totalCreated += batch.length;
          
          // Now get the IDs and insert prices
          const symbols = batch.map(a => a.symbol);
          const insertedAssets = await db.select().from(assets).where(eq(assets.symbol, symbols[0])); // Get one to check
          
          // Map prices to actual asset IDs
          const pricesWithIds = await Promise.all(priceBatch.map(async (p) => {
            const asset = await db.select().from(assets).where(eq(assets.symbol, p.assetId)).limit(1);
            if (asset[0]) {
              return {
                assetId: asset[0].id,
                currentPrice: p.currentPrice,
                previousClose: p.currentPrice,
                change: '0',
                changePercent: '0',
                volume: p.volume,
                marketCap: (parseFloat(p.currentPrice) * p.volume).toFixed(2),
                marketStatus: 'open'
              };
            }
            return null;
          }));
          
          const validPrices = pricesWithIds.filter(p => p !== null);
          if (validPrices.length > 0) {
            await db.insert(assetCurrentPrices).values(validPrices).onConflictDoNothing();
            console.log(`    💰 Inserted ${validPrices.length} prices`);
            totalPriced += validPrices.length;
          }
          
          batch.length = 0;
          priceBatch.length = 0;
        } catch (err) {
          console.error('    ❌ Batch insert failed:', err);
          batch.length = 0;
          priceBatch.length = 0;
        }
      }
    }
    
    // Insert remaining
    if (batch.length > 0) {
      try {
        await db.insert(assets).values(batch).onConflictDoNothing();
        console.log(`    ✅ Inserted ${batch.length} assets`);
        totalCreated += batch.length;
        
        const pricesWithIds = await Promise.all(priceBatch.map(async (p) => {
          const asset = await db.select().from(assets).where(eq(assets.symbol, p.assetId)).limit(1);
          if (asset[0]) {
            return {
              assetId: asset[0].id,
              currentPrice: p.currentPrice,
              previousClose: p.currentPrice,
              change: '0',
              changePercent: '0',
              volume: p.volume,
              marketCap: (parseFloat(p.currentPrice) * p.volume).toFixed(2),
              marketStatus: 'open'
            };
          }
          return null;
        }));
        
        const validPrices = pricesWithIds.filter(p => p !== null);
        if (validPrices.length > 0) {
          await db.insert(assetCurrentPrices).values(validPrices).onConflictDoNothing();
          console.log(`    💰 Inserted ${validPrices.length} prices`);
          totalPriced += validPrices.length;
        }
      } catch (err) {
        console.error('    ❌ Final batch insert failed:', err);
      }
    }
    
    console.log(`  ✅ Query complete: ${totalCreated} assets, ${totalPriced} prices so far`);
    
    if (totalCreated >= 10000) {
      console.log(`\n🎯 TARGET REACHED: ${totalCreated} assets created!`);
      break;
    }
  }
  
  console.log(`\n🏁 FINAL: Created ${totalCreated} assets with ${totalPriced} prices`);
}

bulkExpand10K().catch(console.error).finally(() => process.exit());
