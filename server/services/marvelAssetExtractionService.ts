/**
 * Marvel API Asset Extraction Service
 * Extract comics, series, stories, events from Marvel API
 * Creating thousands of tradeable assets from Marvel's 1,564 characters
 */

import { db } from '../databaseStorage';
import { assets as assetsTable, assetCurrentPrices } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import crypto from 'crypto';

const MARVEL_PUBLIC_KEY = process.env.MARVEL_API_PUBLIC_KEY;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_API_PRIVATE_KEY;
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  comics: { available: number; items: Array<{ resourceURI: string; name: string }> };
  series: { available: number; items: Array<{ resourceURI: string; name: string }> };
  stories: { available: number; items: Array<{ resourceURI: string; name: string }> };
  events: { available: number; items: Array<{ resourceURI: string; name: string }> };
}

export class MarvelAssetExtractionService {
  /**
   * Generate Marvel API authentication
   */
  private getMarvelAuth() {
    const ts = Date.now().toString();
    const hash = crypto
      .createHash('md5')
      .update(`${ts}${MARVEL_PRIVATE_KEY}${MARVEL_PUBLIC_KEY}`)
      .digest('hex');
    
    return { ts, apikey: MARVEL_PUBLIC_KEY, hash };
  }

  /**
   * Fetch character from Marvel API
   */
  private async fetchMarvelCharacter(characterId: number): Promise<MarvelCharacter | null> {
    if (!MARVEL_PUBLIC_KEY || !MARVEL_PRIVATE_KEY) {
      console.error('❌ Marvel API keys not configured');
      return null;
    }

    try {
      const auth = this.getMarvelAuth();
      const url = `${MARVEL_BASE_URL}/characters/${characterId}?ts=${auth.ts}&apikey=${auth.apikey}&hash=${auth.hash}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ Marvel API error for character ${characterId}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      
      if (!data.data || !data.data.results || data.data.results.length === 0) {
        return null;
      }

      return data.data.results[0];
    } catch (error) {
      console.error(`❌ Error fetching Marvel character ${characterId}:`, error);
      return null;
    }
  }

  /**
   * Create comic asset
   */
  private async createComicAsset(
    characterName: string,
    comicName: string,
    resourceURI: string
  ): Promise<{ created: boolean; symbol?: string }> {
    // Extract comic ID from URI
    const comicId = resourceURI.split('/').pop();
    const symbol = `MRV.COMIC.${comicId}`;

    // Check if exists
    const existing = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.symbol, symbol))
      .limit(1);

    if (existing.length > 0) {
      return { created: false, symbol };
    }

    // Create asset
    const name = comicName;
    const description = `Marvel comic featuring ${characterName}. ${comicName}`;
    const price = 75 + Math.random() * 150; // $75-$225

    const [newAsset] = await db.insert(assetsTable).values({
      symbol,
      name,
      type: 'comic',
      description,
      metadata: {
        characterName,
        marvelComicId: comicId,
        resourceURI,
        source: 'marvel',
      },
      verificationStatus: 'verified',
      primaryDataSource: 'marvel',
      lastVerifiedAt: new Date(),
    }).returning({ id: assetsTable.id });

    await db.insert(assetCurrentPrices).values({
      assetId: newAsset.id,
      currentPrice: price.toFixed(2),
      bidPrice: (price * 0.98).toFixed(2),
      askPrice: (price * 1.02).toFixed(2),
      volume: 0,
    });

    return { created: true, symbol };
  }

  /**
   * Create series asset
   */
  private async createSeriesAsset(
    characterName: string,
    seriesName: string,
    resourceURI: string
  ): Promise<{ created: boolean; symbol?: string }> {
    const seriesId = resourceURI.split('/').pop();
    const symbol = `MRV.SERIES.${seriesId}`;

    const existing = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.symbol, symbol))
      .limit(1);

    if (existing.length > 0) {
      return { created: false, symbol };
    }

    const name = seriesName;
    const description = `Marvel series featuring ${characterName}. ${seriesName}`;
    const price = 200 + Math.random() * 300; // $200-$500

    const [newAsset] = await db.insert(assetsTable).values({
      symbol,
      name,
      type: 'series',
      description,
      metadata: {
        characterName,
        marvelSeriesId: seriesId,
        resourceURI,
        source: 'marvel',
      },
      verificationStatus: 'verified',
      primaryDataSource: 'marvel',
      lastVerifiedAt: new Date(),
    }).returning({ id: assetsTable.id });

    await db.insert(assetCurrentPrices).values({
      assetId: newAsset.id,
      currentPrice: price.toFixed(2),
      bidPrice: (price * 0.98).toFixed(2),
      askPrice: (price * 1.02).toFixed(2),
      volume: 0,
    });

    return { created: true, symbol };
  }

  /**
   * Create event asset
   */
  private async createEventAsset(
    characterName: string,
    eventName: string,
    resourceURI: string
  ): Promise<{ created: boolean; symbol?: string }> {
    const eventId = resourceURI.split('/').pop();
    const symbol = `MRV.EVENT.${eventId}`;

    const existing = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.symbol, symbol))
      .limit(1);

    if (existing.length > 0) {
      return { created: false, symbol };
    }

    const name = eventName;
    const description = `Marvel event featuring ${characterName}. ${eventName}`;
    const price = 300 + Math.random() * 700; // $300-$1000

    const [newAsset] = await db.insert(assetsTable).values({
      symbol,
      name,
      type: 'franchise',
      description,
      metadata: {
        characterName,
        marvelEventId: eventId,
        resourceURI,
        source: 'marvel',
      },
      verificationStatus: 'verified',
      primaryDataSource: 'marvel',
      lastVerifiedAt: new Date(),
    }).returning({ id: assetsTable.id });

    await db.insert(assetCurrentPrices).values({
      assetId: newAsset.id,
      currentPrice: price.toFixed(2),
      bidPrice: (price * 0.98).toFixed(2),
      askPrice: (price * 1.02).toFixed(2),
      volume: 0,
    });

    return { created: true, symbol };
  }

  /**
   * Extract all assets for a character
   */
  async extractAssetsForCharacter(characterId: number): Promise<{
    characterName: string;
    comicsCreated: number;
    seriesCreated: number;
    eventsCreated: number;
    total: number;
  }> {
    console.log(`🔍 Extracting assets for Marvel character ID: ${characterId}...`);

    const character = await this.fetchMarvelCharacter(characterId);
    
    if (!character) {
      console.warn(`⚠️ Character ${characterId} not found`);
      return { characterName: '', comicsCreated: 0, seriesCreated: 0, eventsCreated: 0, total: 0 };
    }

    console.log(`📚 ${character.name}:`);
    console.log(`   Comics: ${character.comics.available}`);
    console.log(`   Series: ${character.series.available}`);
    console.log(`   Events: ${character.events.available}`);

    let comicsCreated = 0;
    let seriesCreated = 0;
    let eventsCreated = 0;

    // Extract comics (limit to first 20 to avoid rate limits)
    const comicsToProcess = character.comics.items.slice(0, 20);
    for (const comic of comicsToProcess) {
      const result = await this.createComicAsset(character.name, comic.name, comic.resourceURI);
      if (result.created) comicsCreated++;
    }

    // Extract series (limit to first 10)
    const seriesToProcess = character.series.items.slice(0, 10);
    for (const series of seriesToProcess) {
      const result = await this.createSeriesAsset(character.name, series.name, series.resourceURI);
      if (result.created) seriesCreated++;
    }

    // Extract events (all of them, usually < 50)
    for (const event of character.events.items) {
      const result = await this.createEventAsset(character.name, event.name, event.resourceURI);
      if (result.created) eventsCreated++;
    }

    const total = comicsCreated + seriesCreated + eventsCreated;

    console.log(`✅ ${character.name}: ${total} assets created (${comicsCreated} comics, ${seriesCreated} series, ${eventsCreated} events)`);

    return {
      characterName: character.name,
      comicsCreated,
      seriesCreated,
      eventsCreated,
      total,
    };
  }

  /**
   * Bulk extract from multiple characters
   */
  async bulkExtractMarvelAssets(characterIds: number[]): Promise<{
    totalCharacters: number;
    totalAssetsCreated: number;
    errors: number;
  }> {
    console.log(`🚀 Starting Marvel bulk extraction for ${characterIds.length} characters...`);

    let totalAssetsCreated = 0;
    let errors = 0;

    for (const characterId of characterIds) {
      try {
        const result = await this.extractAssetsForCharacter(characterId);
        totalAssetsCreated += result.total;
        
        // Delay to respect rate limits (1 request per second max)
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (error) {
        console.error(`❌ Error processing character ${characterId}:`, error);
        errors++;
      }
    }

    console.log(`\n✅ Marvel Extraction Complete:`);
    console.log(`   Characters Processed: ${characterIds.length}`);
    console.log(`   Total Assets Created: ${totalAssetsCreated}`);
    console.log(`   Errors: ${errors}`);

    return {
      totalCharacters: characterIds.length,
      totalAssetsCreated,
      errors,
    };
  }
}

export const marvelAssetExtractionService = new MarvelAssetExtractionService();
