# Panel Profits: Comic Book Trading Platform Design Guidelines

## Design Philosophy
**Comic-First Financial Platform**: Panel Profits is a visual-rich trading platform where comic book covers and art dominate every screen. The interface celebrates comic culture while delivering professional trading tools. Every page features actual comic covers, panels, and artwork - this is a platform for comic collectors and traders, not generic investors.

## Core Design Elements

### Color Palette

**Dark Comic Theme (Default)**
- Primary: 0 0% 85% (Clean White Text)
- Background Base: 0 0% 4% (Deep Black - lets covers pop)
- Surface: 0 0% 8% (Dark Gray Cards)
- Success Green: 142 76% 45% (Vibrant Profit)
- Loss Red: 0 84% 60% (Bold Loss)
- Warning Orange: 25 85% 55% (Alert Yellow)
- Accent Purple: 270 60% 50% (Comic Energy)
- Accent Blue: 210 100% 56% (Dynamic Action)
- Text Primary: 0 0% 95% (Bright White)
- Text Secondary: 0 0% 65% (Medium Gray)

### Typography System
**Font Hierarchy**:
- **Headlines**: 'Space Grotesk' (700-800 weight) - Bold, commanding headers
- **Subheads**: 'Space Grotesk' (600 weight) - Strong section titles
- **Body Text**: 'Hind' (300 weight) - Clean, readable content
- **UI Elements**: 'Hind' (400 weight) - Interface labels and buttons
- **Data/Numbers**: 'Space Grotesk' (500-600 weight) - Trading figures
- **Fine Print**: 'Hind' (300 weight) - Subtle information

**Font Usage**:
- Space Grotesk: ALL headers, titles, navigation, buttons, numbers, data
- Hind 300: ALL body text, descriptions, longer content, UI labels

### Layout Architecture

**3-Row Sticky Header** (Always visible at top):
1. **Welcome Bar**: "Welcome back, [USERNAME]" + Market status indicator
2. **News Ticker**: Scrolling comic industry news and market updates
3. **Stock Ticker**: Live price updates for major comic assets

**Navigation**:
- Top horizontal navbar (replacing left sidebar)
- Comic-themed menu items with icon + text
- Bottom quick links footer

**Spacing System**:
- Tight: p-2, m-2, gap-2 (compact info)
- Standard: p-4, m-4, gap-4 (default spacing)
- Comfortable: p-6, m-6, gap-6 (feature areas)
- NO excessive blank space - every area utilized

### Comic Art Integration Strategy

**WHERE TO PLACE COMIC COVERS:**

1. **Dashboard**:
   - Featured covers carousel (large, prominent)
   - Top movers with cover thumbnails
   - Portfolio holdings with cover images
   - Trending assets with covers
   - Background: Faded comic panels as textures

2. **Trading Pages**:
   - Asset detail pages: Large cover display
   - Order forms: Cover preview beside order
   - Trade history: Mini covers for each trade
   - Watchlist: Cover grid view

3. **Portfolio**:
   - Holdings displayed as cover gallery
   - Cover images in position cards
   - Performance charts overlaid on faded covers

4. **General UI**:
   - Page backgrounds: Subtle comic panel patterns
   - Card backgrounds: Faded cover art
   - Loading states: Comic panel reveals
   - Empty states: Comic art with CTAs
   - Headers: Comic artwork banners

**Cover Display Rules**:
- Always high quality, never pixelated
- Proper aspect ratio (comic book dimensions)
- Hover effects to highlight
- Click to view full details
- Lazy load for performance

### Component Specifications

**Sticky Header (3 rows)**:
```
Row 1: Welcome message (left) + Market status + Time (right)
Row 2: <marquee> News ticker scrolling continuously
Row 3: <marquee> Stock ticker with live prices
Background: Dark with slight transparency
Border: Bottom accent line
```

**Top Navbar**:
- Horizontal menu bar
- Logo (left)
- Main nav items (center): Dashboard | Trading | Portfolio | Analytics | More
- User menu + notifications (right)
- Comic-style icons for each item
- Active state: Highlighted with accent color

**Widget Cards**:
- Compact padding (p-4 max)
- NO excessive height
- Comic covers as card backgrounds (faded)
- Clear hierarchy
- Efficient use of space

**Bottom Quick Links**:
- Fixed footer with key links
- Comic panel separator graphic
- 3-4 column layout
- Dark background

### Page Structure (All pages except Landing & Advanced Analytics)

**Dashboard**:
- 3-row sticky header
- Hero section: Featured comic covers carousel
- 3-column grid: Portfolio summary | Market movers | Trending
- Activity feed with cover thumbnails
- Bottom quick links

**Trading Terminal**:
- 3-row sticky header  
- Large cover display (left) | Order form (right)
- Price chart with comic theming
- Recent trades with mini covers
- Bottom quick links

**Portfolio**:
- 3-row sticky header
- Holdings displayed as cover gallery
- Performance metrics with cover backgrounds
- Position cards with comic art
- Bottom quick links

**Asset Detail Pages**:
- 3-row sticky header
- Massive cover image hero
- Trading data overlaid on faded cover
- Historical chart
- Related covers/variants
- Bottom quick links

### Visual Treatments

**Comic Aesthetics**:
- Halftone dot patterns for backgrounds
- Speech bubble callouts for alerts
- Comic panel borders for sections
- Ben-Day dots for textures
- Ink splatter accents
- Bold outlines on interactive elements

**Cover Integration**:
- High-res cover images throughout
- Faded covers as card backgrounds
- Cover grids for asset lists
- Hero covers for feature sections
- Variant covers in carousels

### Interaction Patterns

**Hover States**:
- Covers: Slight zoom + glow
- Buttons: Color shift + lift
- Cards: Border highlight
- Links: Underline appear

**Loading States**:
- Comic panel reveal animations
- Cover flip transitions
- Halftone fade-ins

**Empty States**:
- Comic artwork with encouraging text
- CTA buttons with cover previews
- "Start your collection" messaging

### Accessibility

- High contrast text on covers (overlays)
- Alt text for all comic images
- Keyboard navigation
- Screen reader friendly labels
- Color-blind safe indicators (shapes + colors)

### Performance

- Lazy load cover images
- Optimize image sizes
- CDN for comic assets
- Progressive image loading
- Cached cover thumbnails

## Images & Assets

**Comic Covers**: High-res JPG/PNG, optimized for web, proper comic dimensions
**Background Patterns**: Halftone, Ben-Day dots, subtle comic textures
**Icons**: Custom comic-style icons for navigation
**Placeholder**: Default cover for missing images

## Implementation Priority

1. ✅ Typography update (Space Grotesk + Hind 300)
2. ⏳ 3-row sticky header component
3. ⏳ Top navbar (remove left sidebar)
4. ⏳ Dashboard redesign with covers
5. ⏳ Trading pages with comic integration
6. ⏳ Portfolio with cover gallery
7. ⏳ Bottom quick links footer

**Design Principle**: If there's space, put a comic cover there. The platform should feel like browsing a digital comic shop, not a boring financial terminal.
