"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateMarvelCharacters = populateMarvelCharacters;
exports.populateMarvelCreators = populateMarvelCreators;
exports.populateMarvelComics = populateMarvelComics;
exports.populateMarvelSeries = populateMarvelSeries;
exports.populateMarvelEvents = populateMarvelEvents;
exports.populateMarvelStories = populateMarvelStories;
exports.populateAllMarvelData = populateAllMarvelData;
const crypto_1 = __importDefault(require("crypto"));
const databaseStorage_1 = require("../databaseStorage");
const schema_1 = require("../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const MARVEL_PUBLIC_KEY = process.env.MARVEL_API_PUBLIC_KEY;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_API_PRIVATE_KEY;
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';
function generateAuthParams() {
    const ts = Date.now().toString();
    const hash = crypto_1.default
        .createHash('md5')
        .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
        .digest('hex');
    return { ts, apikey: MARVEL_PUBLIC_KEY, hash };
}
function generateTradingSymbol(type, name, id) {
    const prefixMap = {
        'character': 'CHAR',
        'creator': 'CRTR',
        'comic': 'COMC',
        'series': 'SERS',
        'event': 'EVNT',
        'story': 'STRY'
    };
    const prefix = prefixMap[type] || 'UNKN';
    const hash = crypto_1.default.createHash('sha256').update(`${name}-${id}`).digest('hex').substring(0, 8).toUpperCase();
    return `${prefix}.${hash}`;
}
function determineFranchiseTier(name, appearanceCount) {
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
    }
    else if (midCapHeroes.some(hero => name.includes(hero)) || appearanceCount > 100) {
        return 'mid-cap';
    }
    else if (appearanceCount > 20) {
        return 'small-cap';
    }
    else {
        return 'penny-stock';
    }
}
function calculateBaseMarketValue(franchiseTier, appearanceCount) {
    const tierMultipliers = {
        'blue-chip': 100000,
        'mid-cap': 50000,
        'small-cap': 10000,
        'penny-stock': 1000
    };
    const baseValue = tierMultipliers[franchiseTier] || 1000;
    const appearanceBonus = Math.log10(appearanceCount + 1) * 1000;
    return baseValue + appearanceBonus;
}
async function fetchMarvelData(endpoint, params = {}) {
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
        const data = await response.json();
        return data.data.results;
    }
    catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return [];
    }
}
async function populateMarvelCharacters(limit = 100) {
    console.log(`Fetching ${limit} Marvel characters...`);
    const characters = await fetchMarvelData('/characters', { limit: limit.toString() });
    console.log(`Fetched ${characters.length} characters. Inserting into database...`);
    for (const char of characters) {
        const imageUrl = `${char.thumbnail.path}.${char.thumbnail.extension}`;
        const appearanceCount = char.comics.available;
        const franchiseTier = determineFranchiseTier(char.name, appearanceCount);
        const baseMarketValue = calculateBaseMarketValue(franchiseTier, appearanceCount);
        const symbol = generateTradingSymbol('character', char.name, char.id);
        try {
            await databaseStorage_1.db.insert(schema_1.marvelCharacters).values({
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
        }
        catch (error) {
            console.error(`Error inserting character ${char.name}:`, error);
        }
    }
    console.log(`✓ Completed Marvel characters population`);
}
async function populateMarvelCreators(limit = 100) {
    console.log(`Fetching ${limit} Marvel creators...`);
    const creators = await fetchMarvelData('/creators', { limit: limit.toString() });
    console.log(`Fetched ${creators.length} creators. Inserting into database...`);
    for (const creator of creators) {
        const imageUrl = creator.thumbnail ? `${creator.thumbnail.path}.${creator.thumbnail.extension}` : null;
        const totalWorks = creator.comics.available + creator.series.available;
        const franchiseTier = totalWorks > 100 ? 'legendary' : totalWorks > 50 ? 'acclaimed' : totalWorks > 20 ? 'established' : 'emerging';
        const baseMarketValue = calculateBaseMarketValue(franchiseTier === 'legendary' ? 'blue-chip' : franchiseTier === 'acclaimed' ? 'mid-cap' : 'small-cap', totalWorks);
        const symbol = generateTradingSymbol('creator', creator.fullName, creator.id);
        try {
            await databaseStorage_1.db.insert(schema_1.marvelCreators).values({
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
        }
        catch (error) {
            console.error(`Error inserting creator ${creator.fullName}:`, error);
        }
    }
    console.log(`✓ Completed Marvel creators population`);
}
async function populateMarvelComics(limit = 100) {
    console.log(`Fetching ${limit} Marvel comics...`);
    const comics = await fetchMarvelData('/comics', {
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
            await databaseStorage_1.db.insert(schema_1.marvelComics).values({
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
        }
        catch (error) {
            console.error(`Error inserting comic ${comic.title}:`, error);
        }
    }
    console.log(`✓ Completed Marvel comics population`);
}
async function populateMarvelSeries(limit = 100) {
    console.log(`Fetching ${limit} Marvel series...`);
    const series = await fetchMarvelData('/series', { limit: limit.toString() });
    console.log(`Fetched ${series.length} series. Inserting into database...`);
    for (const s of series) {
        const imageUrl = `${s.thumbnail.path}.${s.thumbnail.extension}`;
        const totalIssues = s.comics.available;
        const franchiseTier = totalIssues > 100 ? 'blue-chip' : totalIssues > 50 ? 'mid-cap' : 'small-cap';
        const baseMarketValue = totalIssues * 500;
        const symbol = generateTradingSymbol('series', s.title, s.id);
        try {
            await databaseStorage_1.db.insert(schema_1.marvelSeries).values({
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
        }
        catch (error) {
            console.error(`Error inserting series ${s.title}:`, error);
        }
    }
    console.log(`✓ Completed Marvel series population`);
}
async function populateMarvelEvents(limit = 50) {
    console.log(`Fetching ${limit} Marvel events...`);
    const events = await fetchMarvelData('/events', { limit: limit.toString() });
    console.log(`Fetched ${events.length} events. Inserting into database...`);
    for (const event of events) {
        const imageUrl = event.thumbnail ? `${event.thumbnail.path}.${event.thumbnail.extension}` : null;
        const impactScore = event.comics.available + event.series.available + event.characters.available;
        const franchiseTier = impactScore > 100 ? 'blue-chip' : impactScore > 50 ? 'mid-cap' : 'small-cap';
        const baseMarketValue = impactScore * 1000;
        const symbol = generateTradingSymbol('event', event.title, event.id);
        try {
            await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
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
        }
        catch (error) {
            console.error(`Error inserting event ${event.title}:`, error);
        }
    }
    console.log(`✓ Completed Marvel events population`);
}
async function populateMarvelStories(limit = 100) {
    console.log(`Fetching ${limit} Marvel stories...`);
    const stories = await fetchMarvelData('/stories', { limit: limit.toString() });
    console.log(`Fetched ${stories.length} stories. Inserting into database...`);
    for (const story of stories) {
        const impactScore = story.comics.available + story.series.available + story.characters.available;
        const franchiseTier = impactScore > 50 ? 'mid-cap' : impactScore > 20 ? 'small-cap' : 'penny-stock';
        const baseMarketValue = impactScore * 500;
        const symbol = generateTradingSymbol('story', story.title, story.id);
        try {
            await databaseStorage_1.db.execute((0, drizzle_orm_1.sql) `
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
        }
        catch (error) {
            console.error(`Error inserting story ${story.title}:`, error);
        }
    }
    console.log(`✓ Completed Marvel stories population`);
}
async function populateAllMarvelData(charactersLimit = 100, creatorsLimit = 100, comicsLimit = 100, seriesLimit = 50, eventsLimit = 50, storiesLimit = 100) {
    console.log('Starting comprehensive Marvel data population...');
    await populateMarvelCharacters(charactersLimit);
    await populateMarvelCreators(creatorsLimit);
    await populateMarvelComics(comicsLimit);
    await populateMarvelSeries(seriesLimit);
    await populateMarvelEvents(eventsLimit);
    await populateMarvelStories(storiesLimit);
    console.log('✓ All Marvel data population completed!');
}
