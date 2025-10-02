#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';

// Comprehensive publisher list 1900-2025
const PUBLISHERS = [
  // Golden Age (1938-1956)
  { name: 'Timely Comics', years: '1939-1950', era: 'Golden Age', became: 'Marvel' },
  { name: 'National Allied Publications', years: '1934-1946', era: 'Golden Age', became: 'DC Comics' },
  { name: 'All-American Publications', years: '1939-1946', era: 'Golden Age', became: 'DC Comics' },
  { name: 'Detective Comics Inc', years: '1937-1946', era: 'Golden Age', became: 'DC Comics' },
  { name: 'Fawcett Comics', years: '1939-1953', era: 'Golden Age', notable: 'Captain Marvel' },
  { name: 'Quality Comics', years: '1937-1956', era: 'Golden Age', notable: 'Blackhawk' },
  { name: 'Charlton Comics', years: '1946-1986', era: 'Golden-Modern', notable: 'Blue Beetle' },
  { name: 'MLJ Comics', years: '1939-1946', era: 'Golden Age', became: 'Archie Comics' },
  
  // Silver Age (1956-1970)
  { name: 'DC Comics', years: '1937-present', era: 'All', notable: 'Superman, Batman' },
  { name: 'Marvel Comics', years: '1961-present', era: 'All', notable: 'Spider-Man, X-Men' },
  { name: 'Archie Comics', years: '1939-present', era: 'All', notable: 'Archie' },
  { name: 'Gold Key Comics', years: '1962-1984', era: 'Silver-Bronze', notable: 'Magnus Robot Fighter' },
  { name: 'Tower Comics', years: '1965-1969', era: 'Silver Age', notable: 'T.H.U.N.D.E.R. Agents' },
  
  // Bronze Age (1970-1985)
  { name: 'Atlas/Seaboard Comics', years: '1974-1975', era: 'Bronze Age', notable: 'The Grim Ghost' },
  { name: 'Pacific Comics', years: '1971-1984', era: 'Bronze Age', notable: 'Captain Victory' },
  { name: 'Eclipse Comics', years: '1978-1994', era: 'Bronze-Copper', notable: 'Miracleman' },
  { name: 'First Comics', years: '1983-1991', era: 'Bronze-Copper', notable: 'Nexus' },
  { name: 'Comico', years: '1982-1997', era: 'Bronze-Modern', notable: 'Elementals' },
  
  // Copper Age (1985-1992)
  { name: 'Dark Horse Comics', years: '1986-present', era: 'Modern', notable: 'Hellboy' },
  { name: 'Malibu Comics', years: '1986-1994', era: 'Copper Age', notable: 'Ultraverse' },
  { name: 'Valiant Comics', years: '1989-present', era: 'Modern', notable: 'X-O Manowar' },
  
  // Modern Age (1992-present)
  { name: 'Image Comics', years: '1992-present', era: 'Modern', notable: 'Spawn, Savage Dragon' },
  { name: 'Wildstorm', years: '1992-2010', era: 'Modern', notable: 'WildC.A.T.s' },
  { name: 'Top Cow', years: '1992-present', era: 'Modern', notable: 'Witchblade' },
  { name: 'CrossGen', years: '1998-2004', era: 'Modern', notable: 'Mystic' },
  { name: 'Boom! Studios', years: '2005-present', era: 'Modern', notable: 'Irredeemable' },
  { name: 'IDW Publishing', years: '1999-present', era: 'Modern', notable: 'G.I. Joe' },
  { name: 'Dynamite Entertainment', years: '2004-present', era: 'Modern', notable: 'The Boys' },
  { name: 'Avatar Press', years: '1996-present', era: 'Modern', notable: 'Crossed' },
  { name: 'Zenescope', years: '2005-present', era: 'Modern', notable: 'Grimm Fairy Tales' },
  { name: 'AfterShock Comics', years: '2015-present', era: 'Modern', notable: 'Animosity' },
  { name: 'Black Mask Studios', years: '2013-present', era: 'Modern', notable: 'We Can Never Go Home' },
  { name: 'Vertigo', years: '1993-2020', era: 'Modern', notable: 'Sandman, Preacher' },
  
  // International
  { name: '2000 AD', years: '1977-present', era: 'Modern', notable: 'Judge Dredd', country: 'UK' },
  { name: 'Rebellion', years: '1992-present', era: 'Modern', notable: '2000 AD reprints', country: 'UK' },
];

// Major superhero titles by publisher
const SUPERHERO_TITLES: Record<string, string[]> = {
  'DC Comics': [
    'Action Comics', 'Detective Comics', 'Batman', 'Superman', 'Wonder Woman',
    'Justice League', 'Flash', 'Green Lantern', 'Aquaman', 'Teen Titans',
    'Swamp Thing', 'Doom Patrol', 'Legion of Super-Heroes', 'JSA', 'JLA',
    'Nightwing', 'Robin', 'Batgirl', 'Supergirl', 'Green Arrow',
    'Hawkman', 'Shazam', 'Blue Beetle', 'Static Shock', 'Martian Manhunter'
  ],
  'Marvel Comics': [
    'Amazing Spider-Man', 'Uncanny X-Men', 'Avengers', 'Fantastic Four', 'Incredible Hulk',
    'Iron Man', 'Thor', 'Captain America', 'Daredevil', 'Punisher',
    'X-Force', 'X-Factor', 'New Mutants', 'Wolverine', 'Deadpool',
    'Ghost Rider', 'Silver Surfer', 'Doctor Strange', 'Black Panther', 'Captain Marvel',
    'Ms. Marvel', 'Spider-Gwen', 'Miles Morales Spider-Man', 'Guardians of the Galaxy'
  ],
  'Image Comics': [
    'Spawn', 'Savage Dragon', 'WildC.A.T.s', 'Gen13', 'Witchblade',
    'The Darkness', 'Invincible', 'The Walking Dead', 'Saga', 'Radiant Black'
  ],
  'Dark Horse Comics': [
    'Hellboy', 'B.P.R.D.', 'The Mask', 'Barb Wire', 'X'
  ],
  'Valiant Comics': [
    'X-O Manowar', 'Harbinger', 'Bloodshot', 'Archer & Armstrong', 'Quantum and Woody',
    'Ninjak', 'Faith', 'Eternal Warrior'
  ],
  'IDW Publishing': [
    'G.I. Joe', 'Transformers', 'Teenage Mutant Ninja Turtles', 'Ghostbusters'
  ],
  'Boom! Studios': [
    'Irredeemable', 'Incorruptible', 'Mighty Morphin Power Rangers'
  ],
  'Dynamite Entertainment': [
    'The Boys', 'The Shadow', 'Green Hornet', 'Vampirella', 'Red Sonja'
  ]
};

async function createComprehensiveTitles() {
  console.log('📚 CREATING COMPREHENSIVE PUBLISHER & TITLE DATABASE\n');
  console.log(`🏢 Publishers: ${PUBLISHERS.length}`);
  
  // Calculate total titles
  let totalTitles = 0;
  for (const titles of Object.values(SUPERHERO_TITLES)) {
    totalTitles += titles.length;
  }
  console.log(`📖 Superhero Titles: ${totalTitles}\n`);
  
  // Save publisher list
  fs.writeFileSync('data/comprehensive-publishers.json', JSON.stringify(PUBLISHERS, null, 2));
  console.log('✅ Saved publisher list to data/comprehensive-publishers.json\n');
  
  let imported = 0;
  
  // Create assets for each title
  for (const [publisher, titles] of Object.entries(SUPERHERO_TITLES)) {
    console.log(`\n📚 ${publisher}: ${titles.length} titles`);
    
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const title of titles) {
      const symbol = `TITLE${Date.now()}${imported}`;
      const price = 100 + Math.random() * 900; // $100-$1000 for titles
      const float = 500000 + Math.floor(Math.random() * 1500000);
      
      assetBatch.push({
        symbol,
        name: title,
        type: 'comic',
        description: `${title} - ${publisher} superhero title`,
        metadata: {
          publisher,
          titleType: 'ongoing_series',
          genre: 'superhero'
        }
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 1.0 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'ComprehensiveTitles',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 50000)
      });
      
      imported++;
    }
    
    if (assetBatch.length > 0) {
      const insertedAssets = await db.insert(assets).values(assetBatch).returning();
      const pricesWithIds = priceBatch.map((p, idx) => ({
        ...p,
        assetId: insertedAssets[idx].id
      }));
      await db.insert(assetCurrentPrices).values(pricesWithIds);
    }
    
    console.log(`   ✅ ${titles.length} titles imported`);
  }
  
  console.log(`\n\n🏁 COMPREHENSIVE IMPORT COMPLETE!`);
  console.log(`   Publishers documented: ${PUBLISHERS.length}`);
  console.log(`   Superhero titles imported: ${imported}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Golden Age publishers: ${PUBLISHERS.filter(p => p.era.includes('Golden')).length}`);
  console.log(`   - Silver Age publishers: ${PUBLISHERS.filter(p => p.era.includes('Silver')).length}`);
  console.log(`   - Bronze Age publishers: ${PUBLISHERS.filter(p => p.era.includes('Bronze')).length}`);
  console.log(`   - Copper Age publishers: ${PUBLISHERS.filter(p => p.era.includes('Copper')).length}`);
  console.log(`   - Modern Age publishers: ${PUBLISHERS.filter(p => p.era.includes('Modern')).length}`);
}

createComprehensiveTitles().catch(console.error).finally(() => process.exit());
