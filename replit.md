# Panel Profits Trading Platform - Watchmen Edition

## Overview
Panel Profits is a virtual trading platform simulating financial markets using comic book assets, inspired by Watchmen. It features a brutalist, noir-inspired UI and aims to expose the "existential horror beneath wealth accumulation" by confronting users with the ethical implications of wealth. Key capabilities include a narrative trading system, a certification career pathway, subscriber incentives, an easter egg system, and a professional-grade dashboard with Watchmen noir styling. The platform is designed for users who understand the moral ambiguities of finance, offering a unique blend of financial simulation and critical social commentary through a highly themed and engaging user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX
- **Design Language**: Brutalist, noir-inspired, Watchmen aesthetic, Bloomberg Terminal aesthetic for widgets.
- **Color Scheme**: Dark mode with indigo/purple gradients, green/red for trading signals.
- **Frameworks**: React with TypeScript (Vite), Wouter for routing, Zustand for state management.
- **Styling**: Custom component library built on Radix UI primitives, shadcn/ui styling, Tailwind CSS, Google Fonts.
- **Data Visualization**: Highcharts and Recharts for professional charting and dashboard widgets.

### Technical Implementation
- **Backend**: Node.js with Express.js for RESTful API.
- **Database**: PostgreSQL with Drizzle ORM for data persistence and `connect-pg-simple` for session management.
- **Core Features**:
    - **Narrative Trading System**: Automated generation of narratives, House rankings, karmic tracking, and story impact.
    - **Certification System**: Three career pathways with tiered progression and feature unlocks.
    - **Subscriber Incentives**: Capital bonuses, trading fee discounts, and XP multipliers.
    - **Easter Egg System**: Database-driven rewards system.
    - **Dashboard Widgets**: 19 professional-grade widgets including market intelligence, analytics, and narrative entity displays.
    - **Assessment**: Two-phase entry assessment (psychological and financial literacy).
    - **Mathematical Pricing Engine**: Pure formula-based system for comic assets, considering era, franchise tiers, variants, and creator contributions.
    - **Asset Expansion**: Integration of diverse comic datasets (Kaggle, Pinecone vectors, GoCollect graded comics) to generate millions of tradeable assets.
    - **Multi-Source Entity Intelligence System**: Aggregation and normalization of data from 12+ active external sources (e.g., Marvel API, Wikidata, Fandom Wikis, AniList) for comprehensive entity data (characters, creators, story arcs, relationships, first appearances). Includes fuzzy deduplication, consensus verification, and fact-checking.
    - **Comics Worth Watching**: Tracks institutional/whale activity and market signals.
    - **Comic of the Day**: Highlights historically significant comics with fact-checked information.
- **Asynchronous Processing**: Redis Queue (BullMQ via Upstash Redis) for asset verification pipeline, including a resilient API client with circuit breaker and name canonicalization.
- **Data Fetching & State Management**: TanStack Query for server state management with polling-based updates (30-second refetch intervals).

### System Design
- **Scalability**: Designed for millions-scale asset expansion through robust pricing and data ingestion engines.
- **Data Integrity**: Extensive fact-checking and multi-source consensus validation for all entity data.
- **Modularity**: Separation of concerns with distinct frontend, backend, and data ingestion services.
- **Security**: PostgreSQL-backed session management.

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL.
- **Pinecone**: Vector database.
- **Upstash Redis**: Redis service.

### UI & Visualization
- **Radix UI**: Component primitives.
- **Highcharts**: Charting library.
- **Recharts**: React charting library.
- **Lucide React**: Icon library.

### Development & Build Tools
- **Vite**: Build tool.
- **ESBuild**: JavaScript bundler.
- **Tailwind CSS**: CSS framework.
- **PostCSS**: CSS processing.

### Data & State Management
- **TanStack Query**: Server state management.
- **Zustand**: Client-side state management.
- **React Hook Form**: Form management.
- **Zod**: Runtime type validation.

### Utilities & Libraries
- **Drizzle ORM**: Type-safe ORM.
- **OpenAI**: `text-embedding-3-small` model.
- **Date-fns**: Date manipulation.
- **Class Variance Authority**: Component variant management.
- **CLSX**: Conditional className utility.
- **CMDK**: Command palette.