/**
 * Entity Scraper Infrastructure
 * 
 * Multi-source comic entity intelligence system that aggregates data from 15+ free sources:
 * - Metron Comic Book Database
 * - Marvel API
 * - SuperHero API
 * - Grand Comics Database (GCD)
 * - Marvel/DC Wiki (MediaWiki API)
 * - MyComicShop
 * - League of Comic Geeks
 * 
 * Features:
 * - Concurrent scraping with rate limiting
 * - Cross-source deduplication and consensus validation (3+ sources = verified)
 * - First appearance mapping
 * - Entity attributes (powers, weaknesses, origins, deaths, resurrections)
 * - Relationship graph (allies, enemies, teams, mentors)
 * - Comic appearance tracking
 */

export { BaseEntityScraper, type EntityData, type ScraperConfig, type ScraperResult } from './BaseEntityScraper';
export { MetronScraper } from './MetronScraper';
export { ScraperOrchestrator, type OrchestratorConfig, type OrchestratorResult } from './ScraperOrchestrator';

// Future scrapers to be added:
// export { MarvelAPIScraper } from './MarvelAPIScraper';
// export { SuperHeroAPIScraper } from './SuperHeroAPIScraper';
// export { GCDScraper } from './GCDScraper';
// export { MarvelWikiScraper } from './MarvelWikiScraper';
// export { DCWikiScraper } from './DCWikiScraper';
// export { MyComicShopScraper } from './MyComicShopScraper';
// export { LeagueOfGeeksScraper } from './LeagueOfGeeksScraper';
