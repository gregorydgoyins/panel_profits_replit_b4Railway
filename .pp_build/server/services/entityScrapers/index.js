"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostomaniaScraper = exports.ComicCoverScraper = exports.MetronScraper = exports.ScraperOrchestrator = exports.LeagueOfGeeksScraper = exports.MyComicShopScraper = exports.ComicVineScraper = exports.GCDScraper = exports.FandomWikiScraper = exports.WikidataScraper = exports.BaseEntityScraper = void 0;
var BaseEntityScraper_1 = require("./BaseEntityScraper");
Object.defineProperty(exports, "BaseEntityScraper", { enumerable: true, get: function () { return BaseEntityScraper_1.BaseEntityScraper; } });
var WikidataScraper_1 = require("./WikidataScraper");
Object.defineProperty(exports, "WikidataScraper", { enumerable: true, get: function () { return WikidataScraper_1.WikidataScraper; } });
var FandomWikiScraper_1 = require("./FandomWikiScraper");
Object.defineProperty(exports, "FandomWikiScraper", { enumerable: true, get: function () { return FandomWikiScraper_1.FandomWikiScraper; } });
var GCDScraper_1 = require("./GCDScraper");
Object.defineProperty(exports, "GCDScraper", { enumerable: true, get: function () { return GCDScraper_1.GCDScraper; } });
var ComicVineScraper_1 = require("./ComicVineScraper");
Object.defineProperty(exports, "ComicVineScraper", { enumerable: true, get: function () { return ComicVineScraper_1.ComicVineScraper; } });
var MyComicShopScraper_1 = require("./MyComicShopScraper");
Object.defineProperty(exports, "MyComicShopScraper", { enumerable: true, get: function () { return MyComicShopScraper_1.MyComicShopScraper; } });
var LeagueOfGeeksScraper_1 = require("./LeagueOfGeeksScraper");
Object.defineProperty(exports, "LeagueOfGeeksScraper", { enumerable: true, get: function () { return LeagueOfGeeksScraper_1.LeagueOfGeeksScraper; } });
var ScraperOrchestrator_1 = require("./ScraperOrchestrator");
Object.defineProperty(exports, "ScraperOrchestrator", { enumerable: true, get: function () { return ScraperOrchestrator_1.ScraperOrchestrator; } });
// Legacy scrapers (available but not in primary orchestration):
var MetronScraper_1 = require("./MetronScraper");
Object.defineProperty(exports, "MetronScraper", { enumerable: true, get: function () { return MetronScraper_1.MetronScraper; } });
var ComicCoverScraper_1 = require("./ComicCoverScraper");
Object.defineProperty(exports, "ComicCoverScraper", { enumerable: true, get: function () { return ComicCoverScraper_1.ComicCoverScraper; } });
var NostomaniaScraper_1 = require("./NostomaniaScraper");
Object.defineProperty(exports, "NostomaniaScraper", { enumerable: true, get: function () { return NostomaniaScraper_1.NostomaniaScraper; } });
