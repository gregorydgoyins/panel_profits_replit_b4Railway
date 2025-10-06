# Panel Profits Trading Platform - Watchmen Edition

## Overview
Panel Profits is a virtual trading platform simulating financial markets using comic book assets, inspired by Watchmen. It features a brutalist, noir-inspired UI and aims to expose the "existential horror beneath wealth accumulation" by confronting users with the ethical implications of wealth. Key capabilities include a narrative trading system, a certification career pathway, subscriber incentives, an easter egg system, and a professional-grade dashboard with Watchmen noir styling. The platform is designed for users who understand the moral ambiguities of finance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React with TypeScript (Vite), Wouter for routing, Zustand for state management.
- **UI**: Custom component library on Radix UI primitives, shadcn/ui styling, Tailwind CSS (dark mode), Google Fonts.
- **Data Fetching**: TanStack Query for server state management and caching.

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
    - **External Scraper Infrastructure**: Production-ready services for Superhero API, Metron DB, and Grand Comic Database (GCD) enable millions-scale asset growth, all feeding into the unified pricing engine and database schema.
- **Entity Seeding System**: Populates the database with publishers, characters, creators, franchises, and comic assets using data from Comic Vine, Kaggle, and PriceCharting.
- **Database Schema**: Comprehensive schemas for users, assets, market data, portfolios, watchlists, orders, market events, certifications, subscriber incentives, easter eggs, and assessment scores.
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