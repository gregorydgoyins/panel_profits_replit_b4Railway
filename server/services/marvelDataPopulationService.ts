import crypto from 'crypto';
import { db } from '../databaseStorage';
import { marvelCharacters, marvelCreators, marvelComics, marvelSeries } from '../../shared/schema';
import { sql } from 'drizzle-orm';

const MARVEL_PUBLIC_KEY = process.env.MARVEL_API_PUBLIC_KEY!;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_API_PRIVATE_KEY!;
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

interface MarvelApiResponse<T> {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
}

interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  urls: Array<{ type: string; url: string }>;
}

interface MarvelCreator {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  fullName: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  urls: Array<{ type: string; url: string }>;
}

interface MarvelComic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: Array<{ type: string; language: string; text: string }>;
  resourceURI: string;
  urls: Array<{ type: string; url: string }>;
  series: {
    resourceURI: string;
    name: string;
  };
  variants: Array<{ resourceURI: string; name: string }>;
  collections: Array<{ resourceURI: string; name: string }>;
  collectedIssues: Array<{ resourceURI: string; name: string }>;
  dates: Array<{ type: string; date: string }>;
  prices: Array<{ type: string; price: number }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  images: Array<{ path: string; extension: string }>;
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; role: string }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
}

interface MarvelSeries {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  urls: Array<{ type: string; url: string }>;
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; role: string }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  next: { resourceURI: string; name: string } | null;
  previous: { resourceURI: string; name: string } | null;
}

function generateAuthParams(): { ts: string; apikey: string; hash: string } {
  const ts = Date.now().toString();
  const hash = crypto
    .createHash('md5')
    .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
    .digest('hex');
  
  return { ts, apikey: MARVEL_PUBLIC_KEY, hash };
}

interface MarvelEvent {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  urls: Array<{ type: string; url: string }>;
  modified: string;
  start: string;
  end: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; role: string }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  next: { resourceURI: string; name: string } | null;
  previous: { resourceURI: string; name: string } | null;
}

interface MarvelStory {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  type: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  } | null;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string; role: string }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{ resourceURI: string; name: string }>;
  };
  originalIssue: { resourceURI: string; name: string } | null;
}

function generateTradingSymbol(type: string, name: string, id: number): string {
  const prefixMap: Record<string, string> = {
    'character': 'CHAR',
    'creator': 'CRTR',
    'comic': 'COMC',
    'series': 'SERS',
    'event': 'EVNT',
    'story': 'STRY'
  };
  const prefix = prefixMap[type] || 'UNKN';
  const hash = crypto.createHash('sha256').update(`${name}-${id}`).digest('hex').substring(0, 8).toUpperCase();
  return `${prefix}.${hash}`;
}

function determineFranchiseTier(name: string, appearanceCount: number): string {
  const blueChipHeroes = [
    'Spider-Man', 'Iron Man', 'Captain America', 'Thor', 'Hulk', 'Black Widow',
    'Wolverine', 'Deadpool', 'Black Panther', 'Doctor Strange', 'Ant-Man',
    'Captain Marvel', 'Scarlet Witch', 'Vision', 'Hawkeye', 'Nick Fury'
  ];
  
  const midCapHeroes = [
    'Daredevil', 'Luke Cage', 'Jessica Jones', 'Punisher', 'Ghost Rider',
    'Moon Knight', 'Blade', 'She-Hulk', 'Falcon', 'Winter Soldier', 'War Machine',
    'Rocket Raccoon', 'Groot', 'Star-Lord', 'Gamora', 'Drax'
  ];
  
  if (blueChipHeroes.some(hero => name.includes(hero))) {
    return 'blue-chip';
  } else if (midCapHeroes.some(hero => name.includes(hero)) || appearanceCount > 100) {
    return 'mid-cap';
  } else if (appearanceCount > 20) {
    return 'small-cap';
  } else {
    return 'penny-stock';
  }
}

function calculateBaseMarketValue(franchiseTier: string, appearanceCount: number): number {
  const tierMultipliers = {
    'blue-chip': 100000,
    'mid-cap': 50000,
    'small-cap': 10000,
    'penny-stock': 1000
  };
  
  const baseValue = tierMultipliers[franchiseTier as keyof typeof tierMultipliers] || 1000;
  const appearanceBonus = Math.log10(appearanceCount + 1) * 1000;
  
  return baseValue + appearanceBonus;
}

async function fetchMarvelData<T>(endpoint: string, params: Record<string, any> = {}): Promise<T[]> {
  const authParams = generateAuthParams();
  const queryParams = new URLSearchParams({
    ...authParams,
    limit: '100',
    ...params
  });
  
  const url = `${MARVEL_BASE_URL}${endpoint}?${queryParams}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
    }
    
    const data: MarvelApiResponse<T> = await response.json();
    return data.data.results;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return [];
  }
}

export async function populateMarvelCharacters(limit: number = 100): Promise<void> {
  console.log(`Fetching ${limit} Marvel characters...`);
  
  const characters = await fetchMarvelData<MarvelCharacter>('/characters', { limit: limit.toString() });
  
  console.log(`Fetched ${characters.length} characters. Inserting into database...`);
  
  for (const char of characters) {
    const imageUrl = `${char.thumbnail.path}.${char.thumbnail.extension}`;
    const appearanceCount = char.comics.available;
    const franchiseTier = determineFranchiseTier(char.name, appearanceCount);
    const baseMarketValue = calculateBaseMarketValue(franchiseTier, appearanceCount);
    const symbol = generateTradingSymbol('character', char.name, char.id);
    
    try {
      await db.insert(marvelCharacters).values({
        name: char.name,
        description: char.description || `Marvel character: ${char.name}`,
        characterType: 'hero', // Default, can be refined later
        franchiseTier,
        imageUrl: imageUrl.includes('image_not_available') ? null : imageUrl,
        thumbnailUrl: imageUrl.includes('image_not_available') ? null : imageUrl,
        appearanceCount,
        symbol,
        baseMarketValue: baseMarketValue.toFixed(2),
        currentPrice: baseMarketValue.toFixed(2),
        totalMarketValue: (baseMarketValue * 1000000).toFixed(2), // 1M shares
        totalFloat: 1000000,
        relationshipRecencyScore: '50.00',
      }).onConflictDoNothing();
      
      console.log(`✓ Inserted character: ${char.name} (${franchiseTier})`);
    } catch (error) {
      console.error(`Error inserting character ${char.name}:`, error);
    }
  }
  
  console.log(`✓ Completed Marvel characters population`);
}

export async function populateMarvelCreators(limit: number = 100): Promise<void> {
  console.log(`Fetching ${limit} Marvel creators...`);
  
  const creators = await fetchMarvelData<MarvelCreator>('/creators', { limit: limit.toString() });
  
  console.log(`Fetched ${creators.length} creators. Inserting into database...`);
  
  for (const creator of creators) {
    const imageUrl = creator.thumbnail ? `${creator.thumbnail.path}.${creator.thumbnail.extension}` : null;
    const totalWorks = creator.comics.available + creator.series.available;
    const franchiseTier = totalWorks > 100 ? 'legendary' : totalWorks > 50 ? 'acclaimed' : totalWorks > 20 ? 'established' : 'emerging';
    const baseMarketValue = calculateBaseMarketValue(
      franchiseTier === 'legendary' ? 'blue-chip' : franchiseTier === 'acclaimed' ? 'mid-cap' : 'small-cap',
      totalWorks
    );
    const symbol = generateTradingSymbol('creator', creator.fullName, creator.id);
    
    try {
      await db.insert(marvelCreators).values({
        name: creator.fullName,
        primaryRole: 'writer', // Default, can be refined
        franchiseTier,
        imageUrl: imageUrl?.includes('image_not_available') ? null : imageUrl,
        totalWorks,
        symbol,
        baseMarketValue: baseMarketValue.toFixed(2),
        currentPrice: baseMarketValue.toFixed(2),
        totalMarketValue: (baseMarketValue * 1000000).toFixed(2),
        totalFloat: 1000000,
        relationshipRecencyScore: '50.00',
      }).onConflictDoNothing();
      
      console.log(`✓ Inserted creator: ${creator.fullName} (${franchiseTier})`);
    } catch (error) {
      console.error(`Error inserting creator ${creator.fullName}:`, error);
    }
  }
  
  console.log(`✓ Completed Marvel creators population`);
}

export async function populateMarvelComics(limit: number = 100): Promise<void> {
  console.log(`Fetching ${limit} Marvel comics...`);
  
  const comics = await fetchMarvelData<MarvelComic>('/comics', { 
    limit: limit.toString(),
    format: 'comic',
    noVariants: 'true'
  });
  
  console.log(`Fetched ${comics.length} comics. Inserting into database...`);
  
  for (const comic of comics) {
    const imageUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
    const publishDate = comic.dates.find(d => d.type === 'onsaleDate')?.date;
    const baseMarketValue = 5000 + (comic.pageCount || 0) * 10;
    const symbol = generateTradingSymbol('comic', comic.title, comic.id);
    
    try {
      await db.insert(marvelComics).values({
        comicName: comic.title,
        issueNumber: comic.issueNumber || null,
        issueDescription: comic.description || null,
        publishDate: publishDate || null,
        coverImageUrl: imageUrl.includes('image_not_available') ? null : imageUrl,
        pageCount: comic.pageCount || null,
        symbol,
        franchiseTier: 'small-cap',
        baseMarketValue: baseMarketValue.toFixed(2),
        currentPrice: baseMarketValue.toFixed(2),
        totalMarketValue: (baseMarketValue * 100000).toFixed(2),
        totalFloat: 100000,
      }).onConflictDoNothing();
      
      console.log(`✓ Inserted comic: ${comic.title}`);
    } catch (error) {
      console.error(`Error inserting comic ${comic.title}:`, error);
    }
  }
  
  console.log(`✓ Completed Marvel comics population`);
}

export async function populateMarvelSeries(limit: number = 100): Promise<void> {
  console.log(`Fetching ${limit} Marvel series...`);
  
  const series = await fetchMarvelData<MarvelSeries>('/series', { limit: limit.toString() });
  
  console.log(`Fetched ${series.length} series. Inserting into database...`);
  
  for (const s of series) {
    const imageUrl = `${s.thumbnail.path}.${s.thumbnail.extension}`;
    const totalIssues = s.comics.available;
    const franchiseTier = totalIssues > 100 ? 'blue-chip' : totalIssues > 50 ? 'mid-cap' : 'small-cap';
    const baseMarketValue = totalIssues * 500;
    const symbol = generateTradingSymbol('series', s.title, s.id);
    
    try {
      await db.insert(marvelSeries).values({
        name: s.title,
        startYear: s.startYear || null,
        endYear: s.endYear || null,
        description: s.description || null,
        totalIssues,
        coverImageUrl: imageUrl.includes('image_not_available') ? null : imageUrl,
        symbol,
        franchiseTier,
        baseMarketValue: baseMarketValue.toFixed(2),
        currentPrice: baseMarketValue.toFixed(2),
        totalMarketValue: (baseMarketValue * 1000000).toFixed(2),
        totalFloat: 1000000,
      }).onConflictDoNothing();
      
      console.log(`✓ Inserted series: ${s.title} (${franchiseTier})`);
    } catch (error) {
      console.error(`Error inserting series ${s.title}:`, error);
    }
  }
  
  console.log(`✓ Completed Marvel series population`);
}

export async function populateMarvelEvents(limit: number = 50): Promise<void> {
  console.log(`Fetching ${limit} Marvel events...`);
  
  const events = await fetchMarvelData<MarvelEvent>('/events', { limit: limit.toString() });
  
  console.log(`Fetched ${events.length} events. Inserting into database...`);
  
  for (const event of events) {
    const imageUrl = event.thumbnail ? `${event.thumbnail.path}.${event.thumbnail.extension}` : null;
    const impactScore = event.comics.available + event.series.available + event.characters.available;
    const franchiseTier = impactScore > 100 ? 'blue-chip' : impactScore > 50 ? 'mid-cap' : 'small-cap';
    const baseMarketValue = impactScore * 1000;
    const symbol = generateTradingSymbol('event', event.title, event.id);
    
    try {
      await db.execute(sql`
        INSERT INTO marvel_events (
          marvel_api_id, name, description, resource_uri, urls, modified_date,
          start_date, end_date, comics_available, series_available, stories_available,
          creators_available, characters_available, comics_list, series_list,
          stories_list, creators_list, characters_list, next_event, previous_event,
          symbol, franchise_tier, base_market_value, current_price, total_market_value,
          total_float, thumbnail_url, story_stub
        ) VALUES (
          ${event.id}, ${event.title}, ${event.description || null}, ${event.resourceURI},
          ${JSON.stringify(event.urls)}, ${event.modified}, ${event.start || null}, 
          ${event.end || null}, ${event.comics.available}, ${event.series.available},
          ${event.stories.available}, ${event.creators.available}, ${event.characters.available},
          ${JSON.stringify(event.comics.items)}, ${JSON.stringify(event.series.items)},
          ${JSON.stringify(event.stories.items)}, ${JSON.stringify(event.creators.items)},
          ${JSON.stringify(event.characters.items)}, ${event.next ? JSON.stringify(event.next) : null},
          ${event.previous ? JSON.stringify(event.previous) : null}, ${symbol}, ${franchiseTier},
          ${baseMarketValue}, ${baseMarketValue}, ${baseMarketValue * 1000000}, 1000000,
          ${imageUrl?.includes('image_not_available') ? null : imageUrl},
          'Crossover events that reshape entire universes. Civil War, Secret Wars, and Infinity Saga moments become tradeable commemoratives—their value tied to lasting narrative impact and media adaptation potential.'
        ) ON CONFLICT (marvel_api_id) DO NOTHING
      `);
      
      console.log(`✓ Inserted event: ${event.title} (${franchiseTier})`);
    } catch (error) {
      console.error(`Error inserting event ${event.title}:`, error);
    }
  }
  
  console.log(`✓ Completed Marvel events population`);
}

export async function populateMarvelStories(limit: number = 100): Promise<void> {
  console.log(`Fetching ${limit} Marvel stories...`);
  
  const stories = await fetchMarvelData<MarvelStory>('/stories', { limit: limit.toString() });
  
  console.log(`Fetched ${stories.length} stories. Inserting into database...`);
  
  for (const story of stories) {
    const impactScore = story.comics.available + story.series.available + story.characters.available;
    const franchiseTier = impactScore > 50 ? 'mid-cap' : impactScore > 20 ? 'small-cap' : 'penny-stock';
    const baseMarketValue = impactScore * 500;
    const symbol = generateTradingSymbol('story', story.title, story.id);
    
    try {
      await db.execute(sql`
        INSERT INTO marvel_stories (
          marvel_api_id, title, description, resource_uri, story_type, modified_date,
          comics_available, series_available, events_available, creators_available,
          characters_available, comics_list, series_list, events_list, creators_list,
          characters_list, original_issue, symbol, franchise_tier, base_market_value,
          current_price, total_market_value, total_float, story_stub
        ) VALUES (
          ${story.id}, ${story.title}, ${story.description || null}, ${story.resourceURI},
          ${story.type}, ${story.modified}, ${story.comics.available}, ${story.series.available},
          ${story.events.available}, ${story.creators.available}, ${story.characters.available},
          ${JSON.stringify(story.comics.items)}, ${JSON.stringify(story.series.items)},
          ${JSON.stringify(story.events.items)}, ${JSON.stringify(story.creators.items)},
          ${JSON.stringify(story.characters.items)}, ${story.originalIssue ? JSON.stringify(story.originalIssue) : null},
          ${symbol}, ${franchiseTier}, ${baseMarketValue}, ${baseMarketValue},
          ${baseMarketValue * 500000}, 500000,
          'Individual story arcs within comics—the building blocks of Marvel mythology. Origin stories, death issues, and paradigm shifts trade as discrete narrative assets, their worth measured in cultural permanence.'
        ) ON CONFLICT (marvel_api_id) DO NOTHING
      `);
      
      console.log(`✓ Inserted story: ${story.title} (${story.type})`);
    } catch (error) {
      console.error(`Error inserting story ${story.title}:`, error);
    }
  }
  
  console.log(`✓ Completed Marvel stories population`);
}

export async function populateAllMarvelData(
  charactersLimit: number = 100, 
  creatorsLimit: number = 100, 
  comicsLimit: number = 100, 
  seriesLimit: number = 50,
  eventsLimit: number = 50,
  storiesLimit: number = 100
): Promise<void> {
  console.log('Starting comprehensive Marvel data population...');
  
  await populateMarvelCharacters(charactersLimit);
  await populateMarvelCreators(creatorsLimit);
  await populateMarvelComics(comicsLimit);
  await populateMarvelSeries(seriesLimit);
  await populateMarvelEvents(eventsLimit);
  await populateMarvelStories(storiesLimit);
  
  console.log('✓ All Marvel data population completed!');
}
