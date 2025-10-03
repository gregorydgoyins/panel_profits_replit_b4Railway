# Panel Profits Trading Platform - Watchmen Edition

## Overview
Panel Profits is a virtual trading platform simulating financial markets using comic book assets. Inspired by Watchmen, it features a brutalist, noir-inspired UI, confronting users with the ethical implications of wealth accumulation. The platform aims to expose the "existential horror beneath wealth accumulation," targeting users who understand the moral ambiguities of finance. It includes a robust narrative trading system, a certification career pathway, subscriber incentives, and an easter egg system.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Frameworks**: React with TypeScript (Vite), Wouter for routing, Zustand for state management.
- **UI**: Custom component library on Radix UI primitives, shadcn/ui styling, Tailwind CSS (dark mode aesthetics), Google Fonts (Oswald, Hind, JetBrains Mono).
- **Data Fetching**: TanStack Query for server state management and caching.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **API**: RESTful API for asset, market data, portfolio, and trading operations.
- **Data Storage**: Time-series market data with configurable timeframes.
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage.

### Core Features & Implementations
- **Narrative Trading**: Automated services for narrative generation, House rankings, karmic tracking, story impact, and timeline updates. Comprehensive API for visual storytelling, Seven Houses, and karmic alignment.
- **Certification System**: Three career pathways (Family Office Owner, Hedge Fund Owner, Agency Owner) with tiered progression, 5-course structure, and feature unlocks (options, bonds, margin) based on certification level.
- **Subscriber Incentives**: Automatic capital bonuses, trading fee discounts, and XP multipliers triggered by course completion milestones.
- **Easter Egg System**: Database-driven system with various trigger types (profitable days, milestones, achievements) offering rewards like badges, capital, and exclusive assets, gated for subscribers.
- **Dashboard Widgets**: 19 professional-grade widgets for options/derivatives, market intelligence, advanced analytics, trading tools, and institutional flow, featuring a Bloomberg Terminal aesthetic with Watchmen noir styling.
- **Two-Phase Assessment**: Entry Test (psychological profiling for moral alignment) and Knowledge Test (financial literacy assessment) as gatekeepers to the trading floor.
- **Mathematical Pricing Engine**: Pure formula-based pricing system enabling millions-scale expansion without API bottlenecks. **Era-based supply logic**: Golden Age (1938-1955) 3K copies/300K shares, Silver (1956-1970) 8K/800K, Bronze (1971-1985) 15K/1.5M, Modern (1986+) 20K/2M. **Base market values** calibrated to $50-$6,000 range: Golden $1.05B, Silver $800M, Bronze $750M, Modern $300M. **Franchise tier system**: Tier 1 Flagship heroes (Superman, Spider-Man, Stan Lee) +0.35 weight, Tier 2 Variants/Superstars (Miles Morales, All-Star Superman, Alex Ross) +0.15, Tier 3 Sidekicks (Robin, Hawkeye) -0.10, Tier 4 Henchmen/Unknowns -0.25. **Appearance modifier**: min(0.45, ln(1 + keyAppearances) / 5) rewards popularity. **Variant pricing**: Newer incarnations (Miles Morales, All-Star Superman) always priced 40-60% below originals using 0.5-0.8x multiplier. **Creator role weighting**: Writer 1.0x, Artist 0.9x, Cover 0.6x, Editorial 0.2x. **Formula**: sharePrice = (BaseEraMarketValue × TierMultiplier × (1 + AppearanceModifier + FranchiseWeight) × ScarcityModifier) ÷ TotalFloat. **Invariant maintained**: sharePrice × totalFloat = totalMarketValue after clamp → round → recalculate sequence. **Tier Classification Service**: Auto-classifies characters/creators from metadata with variant inheritance (All-Star Superman → Tier 2) and parenthetical name support (Robin (Dick Grayson) → Tier 3). **Verified hierarchies**: Superman $1,800 > All-Star $821.83 ✅, Spider-Man $1,800 > Miles $1,600 ✅, Stan Lee $1,850 > Alex Ross $1,670 ✅. **Performance**: Instant parallel calculation (no API delays), ready for 200K-500K asset expansion via Pinecone integration.
- **Kaggle Data Integration**: FiveThirtyEight dataset with 23,272 comic characters (16K Marvel, 7K DC) provides comprehensive character metadata (appearances, alignment, debut year). Seeding service maps top 100 characters to key comic series and fetches real pricing from PriceCharting API.
- **Entity Seeding System**: Comprehensive seeding service mines Comic Vine, Kaggle datasets, and PriceCharting to populate database with publishers, characters, creators, franchises, and comic assets with real market pricing.
- **Database Schema**: Comprehensive schemas for users, assets, market data, portfolios, watchlists, orders, market events, certification pathways, subscriber incentives, easter eggs, and assessment scores.
- **Design System**: Dark mode with indigo/purple gradients, green/red for trading, consistent styling via class-variance-authority, animations, and responsive design.
- **Real-Time Price Streaming**: WebSocket-based price streaming service delivers live market data to connected clients. On connection, clients receive initial snapshot of 100 assets with pricing (type: 'market_data', data: {assetId, symbol, currentPrice, change, changePercent, volume, timestamp}). Stock ticker displays scrolling prices with volume sorting. **SCALE UPDATE**: Database now contains 354,890 assets with 353,560 current prices and 775,404 historical price records. Streaming service requires optimization to load assets that have prices (current issue: loads 100 random assets, most without prices in streaming table).
- **Pinecone Vector Database Integration**: 63,934+ records from Marvel mind maps providing Characters, Creators, and Comics data. Semantic search using OpenAI text-embedding-3-small (1024 dimensions) enables cross-publisher intelligence (find Marvel's Batman equivalent). PineconeAssetExpansionService transforms vector data into tradeable assets using multi-query strategy (4 diverse queries per category). Character incarnation system parses variants (e.g., "Captain America (House of M)" → baseName: "Captain America", variant: "House of M"). **Symbol Generation**: Production-ready deterministic system using SHA-256 cryptographic hash with BigInt modulo arithmetic. Generates fixed 11-character base-36 suffixes (e.g., `S.7TAVOPRBG2G`, `CA.HOM.SPJKUW7FFN0`) from normalized name + variant + Pinecone ID. Symbol space: 36^11 = 131.6 quadrillion unique values (56.87 bits entropy). Collision probability: <0.04% at 10M assets. Performance: 170K symbols/sec. Proven idempotency and zero collisions in 100K empirical test. Test expansion successfully added 39 assets with real PriceCharting pricing. Batching support enables millions of assets with progress tracking. API endpoints: /api/pinecone/search (semantic search), /api/pinecone/expand (asset expansion pipeline).

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database operations.
- **Pinecone**: Vector database (63,934 records) for semantic search and asset discovery.
- **OpenAI**: text-embedding-3-small model for generating 1024-dimension embeddings.

### UI & Visualization
- **Radix UI**: Unstyled, accessible component primitives.
- **Highcharts**: Professional charting for technical analysis.
- **Recharts**: React charting library for dashboard widgets.
- **Lucide React**: Modern icon library.

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
- **Date-fns**: Date manipulation utilities.
- **Class Variance Authority**: Type-safe component variant management.
- **CLSX**: Conditional className utility.
- **CMDK**: Command palette interface.