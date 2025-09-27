# Panel Profits Trading Platform

## Overview

Panel Profits is a sophisticated virtual trading platform that simulates a stock market for comic book assets. Users can trade comic characters, key comic issues, creators, publishers, and other comic-related assets with real-time market dynamics, technical analysis tools, and AI-powered insights. The platform features a modern gaming-inspired UI combined with professional trading platform aesthetics, targeting comic enthusiasts and virtual trading enthusiasts.

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