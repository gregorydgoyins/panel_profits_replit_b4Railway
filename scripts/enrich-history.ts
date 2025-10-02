#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const OpenAI = require('openai').default;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enrichHistory() {
  console.log('📚 Starting historical context enrichment...');
  
  // Get top 30 assets
  const topAssets = await db.select().from(assets).limit(30);
  console.log(`📦 Found ${topAssets.length} assets to enrich`);
  
  let enriched = 0;
  
  for (const asset of topAssets) {
    try {
      const prompt = `Provide 1-2 sentences of historical context about ${asset.name} in comic books. Include first appearance year if known, and cultural significance.`;
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
      });
      
      const context = completion.choices[0].message.content;
      
      if (context) {
        const metadata = asset.metadata || {};
        metadata.historicalContext = context;
        
        await db.update(assets)
          .set({ metadata })
          .where(eq(assets.id, asset.id));
        
        enriched++;
        console.log(`  ✅ ${asset.symbol}: ${context.substring(0, 60)}...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`  ❌ ${asset.symbol}:`, err);
    }
  }
  
  console.log(`\n🏁 Enriched ${enriched} assets with historical context`);
}

enrichHistory().catch(console.error).finally(() => process.exit());
