# Panel Profits Trading Platform - Watchmen Edition

## Overview
Panel Profits is a virtual trading platform simulating financial markets using comic book assets, inspired by Watchmen. It features a brutalist, noir-inspired UI and aims to expose the "existential horror beneath wealth accumulation" by confronting users with the ethical implications of wealth. Key capabilities include a narrative trading system, a certification career pathway, subscriber incentives, an easter egg system, and a professional-grade dashboard with Watchmen noir styling. The platform is designed for users who understand the moral ambiguities of finance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React with TypeScript (Vite), Wouter for routing, Zustand for state management.
- **UI**: Custom component library on Radix UI primitives, shadcn/ui styling, Tailwind CSS (dark mode), Google Fonts.
- **Data Fetching**: TanStack Query for server state management and caching with polling-based updates (WebSocket support removed - polling is sufficient for market data and notifications).

### Backend
- **Runtime**: Node.js with Express.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **API**: RESTful API for assets, market data, portfolio, and trading operations.
- **Data Storage**: Time-series market data with configurable timeframes.
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage.

### Core Features & Implementations
- **Narrative Trading**: Automated services for narrative generation, House rankings, karmic tracking, story impact, and timeline updates. Includes an API for visual storytelling, Seven Houses, and karmic alignment.
- **Certification System**: Three career pathways (Family Office Owner, Hedge Fund Owner, Agency Owner) with tiered progression, 5-course structure, and feature unlocks based on certification level.
- **Subscriber Incentives**: Automatic capital bonuses, trading fee discounts, and XP multipliers triggered by course completion.
- **Easter Egg System**: Database-driven system with various trigger types offering rewards like badges, capital, and exclusive assets, gated for subscribers.
- **Dashboard Widgets**: 19 professional-grade widgets for options/derivatives, market intelligence, advanced analytics, and trading tools, with a Bloomberg Terminal aesthetic. Includes Narrative Entity Widgets for Villains/Henchmen, Sidekicks/Superheroes, and Locations/Gadgets, displaying franchise badges and providing navigation to detailed bios.
- **Assessment**: Two-phase assessment (Entry Test for psychological profiling, Knowledge Test for financial literacy) as gatekeepers to the trading floor.
- **Ticker Nomenclature**: Standardized dot-delimited symbol format (TICKR.V#.#ISSUE) with centralized series abbreviation mapping and intelligent volume parsing. Integrated with Comic Vine and Marvel expansion services.
- **Mathematical Pricing Engine**: Pure formula-based pricing system for millions-scale expansion, incorporating era-based supply, base market values, franchise tiers, appearance modifiers, variant pricing, and creator role weighting. Includes a Tier Classification Service and ensures invariant sharePrice × totalFloat = totalMarketValue.
- **Asset Expansion**:
    - **Kaggle Asset Expansion**: Processes FiveThirtyEight dataset (23,272 comic characters) generating tradeable assets with SHA-256-based deterministic symbol generation, era/tier classification, and pricing engine integration.
    - **Pinecone Vector Database Integration**: Processes 63,934 vectors from Marvel mind maps, creating 20,429 tradeable assets (characters, creators, comics) with semantic search using OpenAI embeddings. Features production-ready deterministic symbol generation and a high-speed bulk insertion service.
    - **GoCollect Graded Comics Expansion**: Real-world graded comic pricing across CGC, CBCS, and PGX graders. Each comic expands into 50+ tradeable assets based on grade (10.0 down to 0.5), grader (3 companies), and label type (Universal, Restored, Signature Series, Qualified). Includes market trends, sales history, census data, and price indices. Enables millions of assets with authentic market pricing.
    - **Manga Separation**: 70,938 manga/anime comics isolated into dedicated manga_comics table (separate from superhero assets). Enables future manga-specific trading mechanics and preserves superhero market focus. Main assets table now contains 474,853 superhero-only assets (170,564 comics, 153,631 characters, 59,799 creators, 49,377 franchises, 40,000 series, 1,482 collectibles).
    - **External Scraper Infrastructure**: Production-ready services for Superhero API, Metron DB, and Grand Comic Database (GCD) enable millions-scale asset growth, all feeding into the unified pricing engine and database schema.
- **Entity Seeding System**: Populates the database with publishers, characters, creators, franchises, and comic assets using data from Comic Vine, Kaggle, and PriceCharting.
- **Multi-Source Entity Intelligence System**: Comprehensive entity database aggregating 15-20 free data sources (Metron API, Marvel API, SuperHero API, Grand Comics Database, Marvel/DC Wikis, MyComicShop, League of Comic Geeks) to replace Comic Vine. Features:
    - **Active Data Sources** (5 scrapers operational):
        - **Metron API**: Comic metadata, character appearances, publisher data (reliability: 0.90)
        - **Marvel Comics API**: Official Marvel character/comic data with authenticated MD5 hash access (reliability: 0.95)
        - **SuperHero API**: Character powers, powerstats, biography, team affiliations, family relationships across Marvel/DC/Image (reliability: 0.85)
        - **Marvel Wiki (Fandom)**: MediaWiki API extraction of detailed character powers, weaknesses, first appearances, relationships (reliability: 0.80)
        - **DC Wiki (Fandom)**: MediaWiki API extraction of DC character data, abilities, team affiliations, enemies/allies (reliability: 0.80)
    - **Infrastructure Components**:
        - **BaseEntityScraper**: Abstract base class with rate limiting, retry logic, error handling, data normalization
        - **ScraperOrchestrator**: Multi-source aggregation with parallel scraping, fuzzy deduplication, consensus verification
        - **NormalizationService**: 85% Levenshtein threshold fuzzy matching, handles inverted names ("Strange, Doctor" ⇔ "Doctor Strange"), title-only entities, alias resolution
        - **FactVerificationService**: 3+ source consensus validation with confidence scoring (reliability × source_count_weight), comprehensive field comparison, conflict detection
    - **Entity First Appearances**: Maps any entity to its first appearance comic cover with multi-source verification (2+ source consensus, expanding to 3+ as more sources added)
    - **Entity Attributes**: Powers, weaknesses, origins, deaths, resurrections tracked across all sources
    - **Entity Relationships**: Universal ally/enemy/team/mentor graph with cross-publisher support
    - **Entity Appearances**: Complete comic appearance tracking (not just first) across Marvel, DC, Image, Dark Horse, indie
    - **Data Source Tracking**: Monitors 5 active sources (expanding to 15-20) with sync status, data completeness metrics, and reliability scores
    - **Fact Verification**: 2+ source consensus validation (threshold will increase to 3+ when additional sources added) with confidence-only-from-consensus-variant calculation ensures accuracy before display
- **Database Schema**: Comprehensive schemas for users, assets, market data, portfolios, watchlists, orders, market events, certifications, subscriber incentives, easter eggs, assessment scores, and entity intelligence (9 entity tables total):
    - **Core Entity Data** (5 tables): entity_first_appearances, entity_attributes, entity_relationships, entity_appearances, entity_data_sources
    - **Comprehensive Entity Data** (4 new tables as of Oct 2025):
        - **entity_story_arcs**: Major storylines, crossover events, plot arcs (Civil War, Crisis on Infinite Earths, Infinity Gauntlet)
        - **entity_creator_contributions**: Detailed creator work beyond first appearances (iconic runs, awards, collaborations)
        - **entity_narrative_milestones**: Character evolution moments (costume changes, power upgrades, identity reveals, deaths/resurrections)
        - **entity_appearance_order**: Explicit tracking of 2nd, 3rd, nth appearances with ordinal ranking and key appearance flagging
- **Comics Worth Watching**: Institutional/whale activity tracking system featuring Bloomberg-style market signals. Detects whale accumulation, institutional flows, smart money movements, and dark pool activity. Each entry includes street consensus (buy/sell/hold), analyst targets, technical indicators, and detailed catalysts/risks for comprehensive financial analysis on detail pages.
- **Comic of the Day**: Historical significance system showcasing comics with revolutionary impact. Features first appearances (major characters, creators, locations, gadgets), breakthrough storytelling (Watchmen panel innovation, G.I. Joe #21 silent issue, Kirby montage techniques), and cultural milestones (e.g., Deadpool as Deathstroke parody). Rotates across comic eras for diversity. Includes production-ready fact-checking verification system that validates all comic information (first issue claims, publication dates, creator data, page counts) before display to prevent errors.
- **Design System**: Dark mode with indigo/purple gradients, green/red for trading, consistent styling via `class-variance-authority`, animations, and responsive design.
- **Price Update System**: Polling-based price updates using TanStack Query with 30-second refetch intervals for market data.
- **Redis Queue System**: BullMQ-powered asynchronous verification pipeline for assets, utilizing Upstash Redis. Includes active workers, a worker orchestrator, a resilient API client with a circuit breaker pattern, and a name canonicalizer for entity matching across data sources.

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting.
- **Pinecone**: Vector database for semantic search and asset discovery.
- **Upstash Redis**: Redis service for queue management.

### UI & Visualization
- **Radix UI**: Unstyled, accessible component primitives.
- **Highcharts**: Professional charting for technical analysis.
- **Recharts**: React charting library for dashboard widgets.
- **Lucide React**: Icon library.

### Development & Build Tools
- **Vite**: Fast build tool.
- **ESBuild**: Fast JavaScript bundling.
- **Tailwind CSS**: Utility-first CSS framework.
- **PostCSS**: CSS processing.

### Data & State Management
- **TanStack Query**: Server state management.
- **Zustand**: Lightweight client-side state management.
- **React Hook Form**: Form state management with validation.
- **Zod**: Runtime type validation.

### Utilities & Libraries
- **Drizzle ORM**: Type-safe database operations.
- **OpenAI**: `text-embedding-3-small` model for embeddings.
- **Date-fns**: Date manipulation utilities.
- **Class Variance Authority**: Type-safe component variant management.
- **CLSX**: Conditional className utility.
- **CMDK**: Command palette interface.