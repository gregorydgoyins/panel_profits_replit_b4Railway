# Panel Profits Trading Platform Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from professional trading platforms like Robinhood and financial dashboards like Bloomberg Terminal, combined with modern gaming UI aesthetics to reflect the comic book theme.

## Core Design Elements

### Color Palette
**Dark Mode Primary (Default)**
- Primary: 239 68% 68% (indigo-500 equivalent)
- Background Base: 210 40% 6% (slate-900)
- Surface: 210 40% 12% (slate-800)
- Accent Green: 142 76% 36% (emerald-500 for gains)
- Accent Red: 0 84% 60% (red-500 for losses)
- Warning: 48 96% 89% (yellow-400)
- Text Primary: 0 0% 100% (white)
- Text Secondary: 210 40% 60% (slate-400)

**Light Mode Colors**
- Background: 0 0% 97% (gray-50)
- Surface: 0 0% 100% (white)
- Text: 210 40% 10% (slate-800)

### Typography
**Font Stack**: 
- Headers: 'Oswald' (600-700 weights) - Bold, superhero-inspired headings
- Body: 'Hind' (300 weight) - Clean, readable interface text
- Numbers/Data: System monospace for trading data consistency

### Layout System
**Tailwind Spacing Primitives**: Consistent use of 2, 4, 6, and 8 units
- Small elements: p-2, m-2, gap-2
- Standard spacing: p-4, m-4, gap-4  
- Section spacing: p-6, m-6, gap-6
- Large layouts: p-8, m-8, gap-8

### Component Library

**Navigation & Controls**
- Modular navigation buttons with distinctive hover effects and glow borders
- Quick navigation toolbar with colored category indicators
- Ticker controls with speed adjustments and pause functionality

**Data Displays**
- Professional trading cards with gradient backgrounds and blur effects
- Real-time charts with Highcharts integration and technical indicators
- Market heatmaps with color-coded performance visualization
- Live feeds with auto-updating content and smooth animations

**Trading Interface**
- Stock ticker with customizable scroll speeds and asset filtering
- Portfolio widgets with performance metrics and health indicators
- Order entry forms with validation and confirmation states
- Watchlist management with drag-and-drop organization

**Content Sections**
- Featured asset cards with cover images and AI-powered insights
- Market overview stats with icon-based categories
- News integration with impact indicators and sentiment analysis
- Comic search interface with cover thumbnails and price history

### Visual Treatments

**Backgrounds & Surfaces**
- Slate-800/90 with backdrop-blur for glass morphism effects
- Gradient overlays from indigo to purple for hero sections
- Subtle border treatments with colored accents (blue, green, yellow)
- Hover effects with glow shadows and border highlighting

**Interactive Elements**
- Smooth transitions on all interactive components
- Color-coded feedback (green for positive, red for negative, yellow for warnings)
- Loading states with skeleton animations
- Progressive disclosure for complex data

### Animations
**Minimal & Purposeful**
- Smooth hover transitions (300ms)
- Real-time data updates with subtle fade effects
- Loading spinners for data fetching
- Gentle pulse animations for live indicators
- NO complex or distracting animations

### Accessibility
- Consistent dark mode implementation across all components
- High contrast ratios for text and interactive elements
- Icon-text combinations for better comprehension
- Keyboard navigation support
- Screen reader friendly structure

### Images
**Hero Section**: Large dynamic hero with market highlights, rotating featured assets, and live market data overlays
**Asset Cards**: Comic cover thumbnails (400x600px) for key issues and character portraits
**Chart Backgrounds**: Subtle gradient overlays that don't interfere with data visualization
**Icon Library**: Lucide React icons throughout for consistency

The design emphasizes professional trading functionality while maintaining the exciting comic book theme through strategic use of colors, typography, and visual hierarchy.