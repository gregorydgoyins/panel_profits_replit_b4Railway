/**
 * Entity Scraper Infrastructure - 6 PRIORITY SCRAPERS ACTIVE
 * 
 * Multi-source comic entity intelligence system with parallel execution and deduplication:
 * 
 * ACTIVE SCRAPERS (6):
 * 1. Wikidata - SPARQL queries (reliability: 0.90)
 * 2. Fandom Wiki - MediaWiki API for Dark Horse, Image, IDW, Valiant, Boom (reliability: 0.75)
 * 3. Grand Comics Database (GCD) - Creator contributions, story credits (reliability: 0.88)
 * 4. Comic Vine - Official API (reliability: 0.92)
 * 5. MyComicShop - Pricing and availability data (reliability: 0.90)
 * 6. League of Comic Geeks - 600K+ comics catalog (reliability: 0.88)
 * 
 * Features:
 * - Parallel execution across all 6 sources
 * - Intelligent deduplication via Levenshtein distance fuzzy matching
 * - Consensus validation (2+ sources = verified)
 * - First appearance cross-verification
 * - Entity attributes (powers, weaknesses, origins, deaths, resurrections)
 * - Relationship graph (allies, enemies, teams, mentors)
 * - Comic appearance tracking
 */

export { BaseEntityScraper, type EntityData, type ScraperConfig, type ScraperResult } from './BaseEntityScraper';
export { WikidataScraper } from './WikidataScraper';
export { FandomWikiScraper } from './FandomWikiScraper';
export { GCDScraper } from './GCDScraper';
export { ComicVineScraper } from './ComicVineScraper';
export { MyComicShopScraper } from './MyComicShopScraper';
export { LeagueOfGeeksScraper } from './LeagueOfGeeksScraper';
export { ScraperOrchestrator, type OrchestratorConfig, type OrchestratorResult } from './ScraperOrchestrator';

// Legacy scrapers (available but not in primary orchestration):
export { MetronScraper } from './MetronScraper';
export { ComicCoverScraper } from './ComicCoverScraper';
export { NostomaniaScraper } from './NostomaniaScraper';
