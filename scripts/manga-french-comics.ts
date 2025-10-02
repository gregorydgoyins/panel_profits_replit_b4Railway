#!/usr/bin/env tsx
import { db } from '../server/databaseStorage.js';
import { assets, assetCurrentPrices } from '../shared/schema.js';
import fs from 'fs';

// Major Japanese Manga Publishers & Titles
const MANGA_PUBLISHERS = {
  'Shueisha': {
    magazine: 'Weekly Shonen Jump',
    titles: [
      'One Piece', 'Naruto', 'Bleach', 'Dragon Ball', 'My Hero Academia',
      'Jujutsu Kaisen', 'Demon Slayer', 'Hunter x Hunter', 'Yu Yu Hakusho',
      'Death Note', 'Rurouni Kenshin', 'JoJo\'s Bizarre Adventure', 'Gintama',
      'Chainsaw Man', 'Spy x Family', 'Dr. Stone', 'Black Clover', 'Haikyu!!',
      'The Promised Neverland', 'Assassination Classroom', 'Slam Dunk'
    ]
  },
  'Kodansha': {
    magazine: 'Weekly Shonen Magazine',
    titles: [
      'Attack on Titan', 'Fairy Tail', 'Tokyo Revengers', 'Seven Deadly Sins',
      'Fire Force', 'Vinland Saga', 'Akira', 'Ghost in the Shell', 'Parasyte',
      'Battle Angel Alita', 'Great Teacher Onizuka', 'Chobits', 'Love Hina'
    ]
  },
  'Shogakukan': {
    magazine: 'Weekly Shonen Sunday',
    titles: [
      'Detective Conan', 'Inuyasha', 'Ranma 1/2', 'Urusei Yatsura', 'Magi',
      'Zatch Bell!', 'Rave Master', 'Hayate the Combat Butler'
    ]
  },
  'Square Enix': {
    magazine: 'Monthly Shonen Gangan',
    titles: [
      'Fullmetal Alchemist', 'Soul Eater', 'Pandora Hearts', 'D.Gray-man'
    ]
  },
  'Hakusensha': {
    magazine: 'Young Animal',
    titles: [
      'Berserk', 'The Ancient Magus\' Bride', 'Banana Fish', 'Nana'
    ]
  }
};

// French/Belgian Bandes Dessinées Publishers & Titles
const FRENCH_PUBLISHERS = {
  'Dupuis': {
    country: 'Belgium',
    titles: [
      'Spirou et Fantasio', 'Gaston Lagaffe', 'Lucky Luke', 'Les Schtroumpfs (Smurfs)',
      'Marsupilami', 'Boule et Bill', 'Largo Winch', 'XIII'
    ]
  },
  'Dargaud': {
    country: 'France',
    titles: [
      'Asterix', 'Blueberry', 'Valérian et Laureline', 'Tanguy et Laverdure',
      'Achille Talon', 'Thorgal', 'Blake et Mortimer'
    ]
  },
  'Casterman': {
    country: 'Belgium',
    titles: [
      'Tintin', 'Corto Maltese', 'Blacksad', 'Sillage', 'Alix'
    ]
  },
  'Le Lombard': {
    country: 'Belgium',
    titles: [
      'Blake et Mortimer', 'Buck Danny', 'Yoko Tsuno', 'Jérôme K. Jérôme Bloche'
    ]
  },
  'Glénat': {
    country: 'France',
    titles: [
      'Titeuf', 'Lanfeust de Troy', 'Les Légendaires', 'Ekhö Monde Miroir'
    ]
  },
  'Delcourt': {
    country: 'France',
    titles: [
      'Universal War One', 'Complainte des Landes Perdues', 'Carthago'
    ]
  },
  'Soleil': {
    country: 'France',
    titles: [
      'Lanfeust', 'Trolls de Troy', 'Les Naufragés d\'Ythaq'
    ]
  }
};

function calculateMangaPrice(popularity: 'high' | 'medium' | 'low'): number {
  const base = { high: 300, medium: 150, low: 80 };
  return base[popularity] + Math.random() * 200;
}

async function importMangaAndFrench() {
  console.log('🇯🇵🇫🇷 IMPORTING MANGA & FRENCH COMICS\n');
  
  let totalImported = 0;
  
  // Import Manga
  console.log('📚 JAPANESE MANGA:\n');
  for (const [publisher, data] of Object.entries(MANGA_PUBLISHERS)) {
    console.log(`🇯🇵 ${publisher} (${data.magazine}): ${data.titles.length} titles`);
    
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const title of data.titles) {
      const symbol = `MANGA${Date.now()}${totalImported}`;
      const popularity = data.titles.indexOf(title) < 5 ? 'high' : 
                        data.titles.indexOf(title) < 12 ? 'medium' : 'low';
      const price = calculateMangaPrice(popularity);
      const float = 800000 + Math.floor(Math.random() * 2000000);
      
      assetBatch.push({
        symbol,
        name: title,
        type: 'comic',
        description: `${title} - Japanese manga series from ${publisher}`,
        metadata: {
          publisher,
          magazine: data.magazine,
          country: 'Japan',
          format: 'manga',
          language: 'Japanese'
        }
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 1.1 + Math.random() * 0.2,
        averageComicValue: price * 100,
        priceSource: 'Manga-Japanese',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 100000)
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
    
    console.log(`   ✅ ${data.titles.length} manga imported`);
  }
  
  // Import French Comics
  console.log('\n\n📚 FRENCH/BELGIAN BANDES DESSINÉES:\n');
  for (const [publisher, data] of Object.entries(FRENCH_PUBLISHERS)) {
    console.log(`🇫🇷 ${publisher} (${data.country}): ${data.titles.length} titles`);
    
    const assetBatch: any[] = [];
    const priceBatch: any[] = [];
    
    for (const title of data.titles) {
      const symbol = `BD${Date.now()}${totalImported}`;
      const price = 120 + Math.random() * 280; // €120-400
      const float = 300000 + Math.floor(Math.random() * 700000);
      
      assetBatch.push({
        symbol,
        name: title,
        type: 'comic',
        description: `${title} - ${data.country} bande dessinée from ${publisher}`,
        metadata: {
          publisher,
          country: data.country,
          format: 'bande_dessinee',
          language: 'French'
        }
      });
      
      priceBatch.push({
        currentPrice: price,
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: 1.05 + Math.random() * 0.15,
        averageComicValue: price * 100,
        priceSource: 'BD-French',
        marketStatus: 'open',
        volume: Math.floor(Math.random() * 50000)
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
    
    console.log(`   ✅ ${data.titles.length} BD imported`);
  }
  
  // Save publisher lists
  const publisherData = {
    manga: MANGA_PUBLISHERS,
    french: FRENCH_PUBLISHERS,
    totalPublishers: Object.keys(MANGA_PUBLISHERS).length + Object.keys(FRENCH_PUBLISHERS).length
  };
  
  fs.writeFileSync('data/manga-french-publishers.json', JSON.stringify(publisherData, null, 2));
  
  console.log(`\n\n🏁 IMPORT COMPLETE!`);
  console.log(`   🇯🇵 Manga publishers: ${Object.keys(MANGA_PUBLISHERS).length}`);
  console.log(`   🇫🇷 French/Belgian publishers: ${Object.keys(FRENCH_PUBLISHERS).length}`);
  console.log(`   📚 Total titles imported: ${totalImported}`);
  console.log(`\n✅ Publisher data saved to data/manga-french-publishers.json`);
}

importMangaAndFrench().catch(console.error).finally(() => process.exit());
