#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets } from '../shared/schema.js';
import { eq, like } from 'drizzle-orm';

const OpenAI = require('openai').default;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enrichCreators() {
  console.log('👨‍🎨 Starting creator bio enrichment...');
  
  // Get creator assets
  const creators = await db.select().from(assets)
    .where(like(assets.symbol, '%.WRITE%'))
    .limit(50);
  
  console.log(`📦 Found ${creators.length} creators to enrich`);
  
  let enriched = 0;
  
  for (const creator of creators) {
    if (creator.description && creator.description.length > 100) continue;
    
    try {
      const prompt = `Write a 2-3 sentence bio for comic book creator ${creator.name}. Focus on their most famous works and impact on the industry. Be factual and concise.`;
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      });
      
      const bio = completion.choices[0].message.content;
      
      if (bio) {
        await db.update(assets)
          .set({ description: bio })
          .where(eq(assets.id, creator.id));
        
        enriched++;
        console.log(`  ✅ ${creator.symbol}: ${bio.substring(0, 80)}...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`  ❌ ${creator.symbol}:`, err);
    }
  }
  
  console.log(`\n🏁 Enriched ${enriched} creators with bios`);
}

enrichCreators().catch(console.error).finally(() => process.exit());
