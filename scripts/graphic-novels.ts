#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';

// Major Graphic Novels by Publisher
const GRAPHIC_NOVELS = {
  'DC Comics / Vertigo': [
    'Watchmen', 'The Sandman', 'V for Vendetta', 'Preacher', 'Y: The Last Man',
    'Fables', 'Transmetropolitan', '100 Bullets', 'The Invisibles', 'Scalped',
    'Saga of the Swamp Thing', 'Hellblazer', 'The League of Extraordinary Gentlemen',
    'Kingdom Come', 'The Dark Knight Returns', 'Batman: Year One', 'Batman: The Killing Joke',
    'All-Star Superman', 'Batman: The Long Halloween', 'Superman: Red Son',
    'Joker', 'Batman: Hush', 'Identity Crisis', 'Crisis on Infinite Earths'
  ],
  'Marvel Comics': [
    'Marvels', 'Civil War', 'Secret Wars', 'Old Man Logan', 'Infinity Gauntlet',
    'Daredevil: Born Again', 'The Death of Captain America', 'Kraven\'s Last Hunt',
    'Spider-Man: Blue', 'The Ultimates', 'Ultimate Spider-Man', 'House of M',
    'Vision', 'Hawkeye', 'X-Men: Days of Future Past', 'God Loves, Man Kills'
  ],
  'Image Comics': [
    'Saga', 'The Walking Dead', 'Invincible', 'Monstress', 'Paper Girls',
    'East of West', 'Descender', 'Chew', 'Lazarus', 'Nowhere Men',
    'Black Science', 'The Wicked + The Divine', 'I Kill Giants', 'Bone',
    'Strangers in Paradise', 'Astro City'
  ],
  'Dark Horse Comics': [
    'Sin City', 'Hellboy', '300', 'The Goon', 'B.P.R.D.',
    'American Vampire', 'Criminal', 'The Umbrella Academy', 'Usagi Yojimbo'
  ],
  'Independent': [
    'Persepolis', 'Maus', 'Ghost World', 'Blankets', 'Fun Home',
    'Black Hole', 'Habibi', 'Jimmy Corrigan', 'Daytripper', 'Locke & Key',
    'Scott Pilgrim', 'Mouse Guard', 'Atomic Robo', 'Grandville',
    'Palestine', 'From Hell', 'Lost Girls', 'A Contract with God',
    'American Born Chinese', 'Stitches', 'Asterios Polyp'
  ],
  'Boom! Studios': [
    'Lumberjanes', 'Mouse Guard', 'Giant Days', 'The Woods', 'Klaus'
  ],
  'Valiant': [
    'Harbinger Wars', 'The Valiant', 'Divinity', 'Bloodshot Reborn'
  ],
  'IDW': [
    'Locke & Key', '30 Days of Night', 'V-Wars', 'The Crow'
  ]
};

function calculateGraphicNovelPrice(title: string, publisher: string): number {
  // Iconic classics get higher prices
  const classics = ['Watchmen', 'The Sandman', 'Maus', 'The Dark Knight Returns', 'V for Vendetta', 'From Hell'];
  const modern = ['Saga', 'The Walking Dead', 'Invincible', 'Monstress'];
  
  if (classics.includes(title)) return 800 + Math.random() * 1200;
  if (modern.includes(title)) return 500 + Math.random() * 800;
  return 200 + Math.random() * 600;
}

async function importGraphicNovels() {
  console.log('📖 IMPORTING MAJOR GRAPHIC NOVELS\n');
  
  let totalImported = 0;
  
  for (const [publisher, titles] of Object.entries(GRAPHIC_NOVELS)) {
    console.log(`\n📚 ${publisher}: ${titles.length} graphic novels`);
    
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const title of titles) {
      const symbol = `GN${Date.now()}${totalImported}`;
      const price = calculateGraphicNovelPrice(title, publisher);
      const float = 400000 + Math.floor(Math.random() * 1600000);
      
      assetBatch.push({
        symbol,
        name: title,
        type: 'comic',
        description: `${title} - Graphic novel published by ${publisher}`,
        metadata: {
          publisher,
          format: 'graphic_novel',
          collectsIssues: true
        }
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 1.15 + Math.random() * 0.25, // Higher scarcity
        averageComicValue: price * 100,
        priceSource: 'GraphicNovel',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 75000)
      });
      
      totalImported++;
    }
    
    if (assetBatch.length > 0) {
      const insertedAssets = await db.insert(assets).values(assetBatch).returning();
      const pricesWithIds = priceBatch.map((p, idx) => ({
        ...p,
        assetId: insertedAssets[idx].id
      }));
      await db.insert(assetCurrentPrices).values(pricesWithIds);
    }
    
    console.log(`   ✅ ${titles.length} graphic novels imported`);
  }
  
  console.log(`\n\n🏁 GRAPHIC NOVEL IMPORT COMPLETE!`);
  console.log(`   Publishers covered: ${Object.keys(GRAPHIC_NOVELS).length}`);
  console.log(`   Total graphic novels: ${totalImported}`);
  console.log(`\n📊 Breakdown:`);
  console.log(`   DC/Vertigo: ${GRAPHIC_NOVELS['DC Comics / Vertigo'].length} titles`);
  console.log(`   Marvel: ${GRAPHIC_NOVELS['Marvel Comics'].length} titles`);
  console.log(`   Image: ${GRAPHIC_NOVELS['Image Comics'].length} titles`);
  console.log(`   Independent: ${GRAPHIC_NOVELS['Independent'].length} titles`);
}

importGraphicNovels().catch(console.error).finally(() => process.exit());
