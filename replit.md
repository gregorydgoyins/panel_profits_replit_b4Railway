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
- **Real Comic Pricing**: PriceCharting API integration provides authentic comic book pricing with full CGC grading support (Ungraded, CGC 4.0-4.5, 6.0-6.5, 8.0-8.5, 9.2, 9.8, 10.0). Grading critical for pricing accuracy—price differences range from 10x to 172x between ungraded and graded copies.
- **Database Schema**: Comprehensive schemas for users, assets, market data, portfolios, watchlists, orders, market events, certification pathways, subscriber incentives, easter eggs, and assessment scores.
- **Design System**: Dark mode with indigo/purple gradients, green/red for trading, consistent styling via class-variance-authority, animations, and responsive design.

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database operations.

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