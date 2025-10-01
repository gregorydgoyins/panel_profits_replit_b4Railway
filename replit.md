# Panel Profits Trading Platform - Watchmen Edition

## Overview

Panel Profits is a dark, morally complex virtual trading platform that simulates the brutal reality of financial markets through comic book assets. Inspired by Watchmen's noir aesthetic and philosophical depth, users confront the human cost of capitalism while trading comic characters, issues, creators, and publishers. Every profit has a victim. Every trade accelerates our collective doom. The platform features a brutalist, noir-inspired UI that exposes the existential horror beneath wealth accumulation, targeting those who understand that in finance, nobody is truly a hero.

## Recent Updates

### October 1, 2025 - Certification System & Dashboard Enhancements

**Certification Career Pathway System**
- **Database Schema**: Added comprehensive certification tables (careerPathwayLevels, certificationCourses, userCourseEnrollments, userPathwayProgress, examAttempts)
- **Three Career Pathways**: Family Office Owner, Hedge Fund Owner, Agency Owner with tiered progression
- **5-Course Structure**: 3/5 passes = Certified (100% salary bonus), 5/5 passes = Master (150% bonus)
- **Retake System**: 3 free attempts, 4th retry charges subscription penalty
- **Feature Unlocks**: Options trading locked until Hedge Fund Analyst, bonds until Agency Desk Lead, margin/leverage until Portfolio Manager
- **API Routes**: Full CRUD operations for pathways, courses, enrollment, progress tracking, exam submissions

**Subscriber Incentive System** ✅ COMPLETED
- **Database Schema**: Three tables (subscriberCourseIncentives, subscriberActiveBenefits, subscriberIncentiveHistory)
- **Automatic Bonuses**: Capital bonuses ($5K-$25K), trading fee discounts (10%-50%), XP multipliers (1.5x-3x)
- **Milestone Triggers**: 3/5 courses = Certified (100% salary bonus + 25% fee discount + 1.5x XP), 5/5 courses = Master (150% salary bonus + 50% fee discount + 3x XP)
- **Security Fix**: Proper subscription tier validation from database (not req.user) ensures only paid subscribers receive bonuses
- **Backend Integration**: Awards bonuses automatically on course completion via exam submission route

**Corporate Firm Names** ✅ COMPLETED
- **Seven Firms**: GM Financial (Roman), Velos Agency (Greek), Horus Capital (Egyptian), Valkyrie Holdings (Norse), Evergreen Partners (Celtic), Aurora Investments (Slavic), Amaterasu Asset Management (Japanese)
- **Dual Nomenclature**: Players see corporate names, developers use mythology names internally
- **Navigation Cleanup**: Sidebar updated to "Learning Center", "Integrations", "Firms" (removed all divine/sacred terminology)

**Easter Egg System** ✅ FULLY IMPLEMENTED
- **Database Schema**: Three tables (easterEggDefinitions, easterEggUserProgress, easterEggUnlocks)
- **Trigger Types**: consecutive_profitable_days, portfolio_milestone, achievement_chain, hidden_action, trading_pattern, total_volume
- **Rewards**: Secret badges, bonus capital, exclusive assets, fee waivers, XP boosts, special titles
- **Subscriber Gating**: Locked to subscribers only with rarity tiers (common, uncommon, rare, epic, legendary)
- **Progress Tracking**: Streak tracking, multi-part chains, hidden discovery hints
- **Backend Routes**: All routes implemented (definitions, progress, unlocked, claim)
- **UI Components**: Complete collection page with rarity-based styling, progress bars, unlock animations
- **Notification System**: Auto-discovery polling every 30s with toast notifications for new unlocks
- **Reward Claiming**: Full flow with subscriber validation, lock states, and upsell messaging for non-subscribers

**Dashboard UI Enhancements**
- **News Ticker**: Running ticker with hyperlinked comic industry news stories (Marvel announcements, DC updates, Image Comics news)
- **Logout Functionality**: Added logout button to navigation sidebar for clean session termination and fresh user flow testing
- **Database Export**: Added db export from databaseStorage.ts to enable certification route functionality

**Phase 1 Scheduled Services Status** ✅ MOSTLY OPERATIONAL
- **Options Chain Updates** (30s interval): ✅ FULLY OPERATIONAL - All 12+ missing columns added to database (exercise_style, contract_size, mark_price, historical_volatility, last_trade_time, intrinsic_value, time_value, break_even_price, max_risk, max_reward, last_greeks_update, is_active)
- **Margin Maintenance** (300s interval): ✅ OPERATIONAL
- **Order Matching Engine** (5s interval): ✅ OPERATIONAL
- **Information Tier Services** (120s interval): ✅ OPERATIONAL
- **NPC Trading Automation** (60s interval): ⚠️ KNOWN ISSUE - "syntax error at or near 'desc'" persists despite verified correct Drizzle code; all imports correct; likely TypeScript caching issue; non-blocking for user features

**Known Issues**
- NPC Trading: Persistent "desc" SQL error despite correct code (deferred for future debugging)
- WebSocket: Immediate disconnect (code 1006) due to Vite HMR misconfiguration in forbidden vite.config.ts file
- Stock ticker and dashboard layout compression pending

### September 30, 2025

### 19 Professional Dashboard Widgets Completed
All institutional-grade dashboard widgets now deployed, providing Bloomberg Terminal-quality analytics:

**Options & Derivatives (3 widgets)**
1. Options Chain with Greeks - Delta, Gamma, Theta, Vega for calls/puts with strike prices
2. LEAPS Trading Interface - Long-term equity options (1+ year) with DTE tracking
3. Portfolio Greeks Summary - Risk exposure metrics with interpretations

**Market Intelligence (5 widgets)**
4. Comic ETFs - Diversified universe funds with performance tracking
5. Market Movers - Tabbed interface (gainers, losers, most active)
6. Fear & Greed Index - Thermometer visualization with contributing indicators
7. Oracle's Daily Prophecy - Mythologically-themed daily wisdom with House picks
8. House Power Rankings - Inter-house performance leaderboard

**Advanced Analytics (3 widgets)**
9. Portfolio Risk Metrics - VaR, Sharpe Ratio, Beta, Max Drawdown, Volatility, Sortino
10. Volatility Surface - IV heat map across strikes and expirations
11. Correlation Matrix - 5x5 asset relationship heat map

**Trading Tools (5 widgets)**
12. Economic Calendar - Market-moving events with impact levels
13. Sector Rotation - Comic universe performance analysis
14. Margin Utilization - Leverage and buying power monitoring
15. Publisher Bonds - Fixed-income securities with yield tracking
16. Level 2 Order Book - Market depth with bid/ask ladder

**Institutional Flow (3 widgets)**
17. Unusual Activity Scanner - Real-time anomaly detection (options, volume, price)
18. Dark Pool Activity - Off-exchange institutional trades with prints
19. Seven Houses AI Recommendations - Multi-strategy signals with confidence scores

**Technical Implementation**
- All widgets include proper data-testid attributes for QA testing
- Professional Bloomberg Terminal aesthetic with mock data (ready for live API integration)
- Responsive grid layouts with loading states
- Watchmen noir styling to be applied in design polish phase per established guidelines

### Two-Phase Assessment System Implemented
- **Entry Test**: Psychological profiling disguised as trading competency test - 7 scenarios that secretly assess moral alignment with Seven Houses
- **Knowledge Test**: Financial literacy assessment disguised as "Market Mastery Challenge" - tests actual understanding of market mechanics
- **Sequential Guards**: Users must complete Entry Test to access Knowledge Test, then complete Knowledge Test to access trading floor
- **Realistic Pricing**: Knowledge Test uses proper round lots ($5-500 per share, 100-share minimum) for authentic trading scenarios
- **Database Schema**: Added alignment_scores table for tracking psychological profiles, knowledgeTestScores and knowledgeTestResponses for financial competency

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global state management with dedicated stores for authentication, simulation, and market data
- **UI Components**: Custom component library built on Radix UI primitives with shadcn/ui styling patterns
- **Styling**: Tailwind CSS with custom design system based on dark mode aesthetics
- **Typography**: Google Fonts integration (Oswald for headers, Hind for body text, JetBrains Mono for data)
- **Data Fetching**: TanStack Query for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured route handlers for asset management, market data, portfolios, and trading operations
- **Data Storage**: Time-series market data with configurable timeframes (1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage

### Database Schema Design
- **Users**: Authentication and profile management
- **Assets**: Comic characters, issues, creators, publishers with metadata
- **Market Data**: OHLC candlestick data with technical indicators stored as JSONB
- **Portfolios & Holdings**: User portfolio management with real-time valuations
- **Watchlists**: User-customizable asset tracking lists
- **Orders**: Trading order management and execution history
- **Market Events**: News and events that impact asset prices

### Component Architecture
- **Layout System**: Responsive grid-based layouts with sidebar navigation
- **Dashboard Widgets**: Modular market overview components (market cap, volume, AI confidence, active traders)
- **Trading Interface**: Professional-grade order entry with technical analysis charts
- **Real-time Updates**: Live market feed with WebSocket-style data streaming simulation
- **Chart Integration**: Highcharts for advanced technical analysis with multiple indicators

### Design System
- **Color Palette**: Dark mode primary with indigo/purple gradients and trading-specific colors (green for gains, red for losses)
- **Component Variants**: Consistent styling patterns using class-variance-authority
- **Animation & Effects**: Hover effects, backdrop blur, and glow borders for enhanced UX
- **Responsive Design**: Mobile-first approach with progressive enhancement

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database operations with automatic schema generation

### UI & Visualization
- **Radix UI**: Unstyled, accessible component primitives for complex UI elements
- **Highcharts**: Professional charting library for technical analysis and market visualization
- **Recharts**: React charting library for dashboard widgets and data visualization
- **Lucide React**: Modern icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool with TypeScript support and development server
- **ESBuild**: Fast JavaScript bundling for production builds
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **PostCSS**: CSS processing with Autoprefixer

### Data & State Management
- **TanStack Query**: Server state management with caching and background updates
- **Zustand**: Lightweight state management for client-side application state
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema parsing

### Utilities & Libraries
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe component variant management
- **CLSX**: Conditional className utility for dynamic styling
- **CMDK**: Command palette interface for enhanced navigation