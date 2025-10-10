# Panel Profits Design System - Rimlight Hover Architecture

## 🎨 **WHY THIS SYSTEM EXISTS**

The Universal Widget Rimlight System is the foundation of Panel Profits' visual identity. It serves five critical purposes:

### 1. **VISUAL HIERARCHY**
Each widget category gets a unique color identity for **instant recognition**. Users can identify widget types at a glance based on border color.

### 2. **INTERACTION FEEDBACK**
Hover states provide clear, **professional affordance** without theatrical effects. The subtle glow communicates interactivity using Bloomberg Terminal aesthetic principles.

### 3. **BRAND CONSISTENCY** 
Restrained glows, not garish neon. Every widget follows the same mathematical formula for hover effects, ensuring cohesive visual language across the entire platform.

### 4. **ACCESSIBILITY**
High-contrast borders (60% opacity base, 100% on hover) ensure **visibility in dark mode** for all users.

### 5. **TWO-TIER COLOR SYSTEM**

## **SIMPLE RULE:**
```
RIM COLOR = NAVIGATION CATEGORY
INNER WIDGET ELEMENTS = SPECIFIC ACTION/DESTINATION
```

**Widget Borders/Rimlights** → Match the **nav bar category** where widget lives:
- Dashboard widgets = Purple rim
- Trading widgets = Blue rim
- Portfolio widgets = Orange rim
- Markets widgets = Orange rim
- Research widgets = Pink rim
- Learn widgets = Cyan rim
- News widgets = Green rim

**Buttons/Actions INSIDE Widgets** → Match their **specific destination or purpose**:
- "Research Asset" → Pink (goes to Research)
- "Take Course" → Cyan (goes to Learn)
- "View Market Data" → Orange (goes to Markets)
- "Trade Now" → Blue (goes to Trading)
- "Read Article" → Green (goes to News)

**Example**: Markets widget (Orange rim) contains:
- "Deep Dive Research" button → **Pink** (leads to Research)
- "Learn Strategy" button → **Cyan** (leads to Learn)
- "View Live Data" button → **Orange** (stays in Markets)

---

## 📐 **IMPLEMENTATION STANDARD**

Every widget MUST follow this exact pattern:

### **1. BASE STATE**
```css
border: 2px solid rgba(COLOR, 0.6); /* 60% opacity category color */
```

Example for purple dashboard widgets:
```css
border: 2px solid rgba(168, 85, 247, 0.6);
```

### **2. HOVER STATE**
```css
.{color}-rimlight-hover:hover {
  box-shadow: 
    0 0 0 2px rgba(COLOR, 1),      /* Solid rim - 100% opacity */
    0 0 12px rgba(COLOR, 0.8),     /* Inner glow - 80% opacity */
    0 0 24px rgba(COLOR, 0.4);     /* Outer bleed - 40% opacity */
}
```

### **3. TRANSITION**
```css
transition: box-shadow 0.2s ease-in-out;
```

---

## 🎯 **COLOR ASSIGNMENTS BY NAV CATEGORY**

### **Core Platform Widgets (MATCHES NAV BAR)**
| Nav Category | Color | Hex | RGB | CSS Class |
|--------------|-------|-----|-----|-----------|
| **Dashboard** | Purple | `#A855F7` | `rgba(168, 85, 247)` | `.dashboard-rimlight-hover` |
| **Trading** | Blue | `#3B82F6` | `rgba(59, 130, 246)` | `.trading-rimlight-hover` |
| **Portfolio** | Orange | `#FB923C` | `rgba(251, 146, 60)` | `.portfolio-rimlight-hover` |
| **News** | Green | `#22C55E` | `rgba(34, 197, 94)` | `.news-rimlight-hover` |
| **Markets** | Orange | `#FB923C` | `rgba(251, 146, 60)` | `.markets-rimlight-hover` |
| **Research** | Pink/Magenta | `#EC4899` | `rgba(236, 72, 153)` | `.research-rimlight-hover` |
| **Analytics** | Green | `#22C55E` | `rgba(34, 197, 94)` | `.analytics-rimlight-hover` |
| **Learn** | Cyan/Teal | `#06B6D4` | `rgba(6, 182, 212)` | `.learn-rimlight-hover` |

### **Narrative Entity Widgets**
| Entity | Color | Hex | RGB | CSS Class |
|--------|-------|-----|-----|-----------|
| **Villain** | Blood-red | `#8B0000` | `rgba(139, 0, 0)` | `.villain-rimlight-hover` |
| **Sidekick** | Baby blue | `#89CFF0` | `rgba(137, 207, 240)` | `.sidekick-rimlight-hover` |
| **Superhero** | Cyan | `#00CED1` | `rgba(0, 206, 209)` | `.superhero-rimlight-hover` |
| **Location** | Brown | `#8B4513` | `rgba(139, 69, 19)` | `.location-rimlight-hover` |
| **Gadget** | Goldenrod | `#DAA520` | `rgba(218, 165, 32)` | `.gadget-rimlight-hover` |

---

## 🛠️ **USAGE EXAMPLES**

### **Dashboard Widget Example**
```tsx
<Card className="dashboard-rimlight-hover">
  {/* Widget content */}
</Card>
```

Result:
- **Base**: 2px solid purple border at 60% opacity
- **Hover**: Solid purple rim with 80% inner glow, 40% outer bleed

### **Trading Widget Example**
```tsx
<Card className="trading-rimlight-hover">
  {/* Widget content */}
</Card>
```

Result:
- **Base**: 2px solid blue border at 60% opacity
- **Hover**: Solid blue rim with 80% inner glow, 40% outer bleed

### **Narrative Entity Example (Villain)**
```tsx
<Card className="villain-rimlight-hover">
  {/* Villain widget content */}
</Card>
```

Result:
- **Base**: 2px solid blood-red border at 60% opacity
- **Hover**: Solid blood-red rim with 80% inner glow, 40% outer bleed

---

## 🔧 **ADDING NEW WIDGET TYPES**

To add a new rimlight class:

1. **Choose appropriate category color** (see table above)
2. **Add CSS to `client/src/index.css`**:

```css
/* New Widget Type Rimlights - Color Name */
.newtype-rimlight-hover {
  position: relative;
  transition: box-shadow 0.2s ease-in-out;
  border: 2px solid rgba(R, G, B, 0.6);
}

.newtype-rimlight-hover:hover {
  box-shadow: 
    0 0 0 2px rgba(R, G, B, 1),
    0 0 12px rgba(R, G, B, 0.8),
    0 0 24px rgba(R, G, B, 0.4);
}
```

3. **Document the new class** in this file and update color assignments table

---

## ⚠️ **CRITICAL RULES**

### ✅ **DO:**
- Always use the exact box-shadow formula (solid rim + inner glow + outer bleed)
- Match base border color to hover color at 60% opacity
- Apply rimlight class to the Card wrapper component
- Use category-aligned colors (Dashboard widgets = purple, Trading widgets = blue, etc.)

### ❌ **DON'T:**
- Never create custom hover effects that deviate from the formula
- Never use colors not in the official table
- Never apply rimlight AND other hover classes together
- Never change opacity values from the standard (60% base, 100%/80%/40% hover)

---

## 📊 **MATHEMATICAL FORMULA**

The rimlight effect follows this precise formula:

```
Base Border:     2px solid rgba(R, G, B, 0.6)
Hover Rim:       0 0 0 2px rgba(R, G, B, 1.0)   ← 100% solid
Hover Inner:     0 0 12px rgba(R, G, B, 0.8)    ← 80% glow
Hover Outer:     0 0 24px rgba(R, G, B, 0.4)    ← 40% bleed
```

This creates:
- **2px solid border** in resting state (visible but subtle)
- **Intensified border** on hover (full opacity)
- **Tight 12px glow** around widget (creates depth)
- **Subtle 24px spread** beyond widget (atmospheric bleed)

---

## 🎯 **ICON GLOW SYSTEM**

Some narrative widgets include icon glows that activate on hover:

```css
/* Icon Glow - Activates on widget hover */
.villain-icon-glow {
  transition: filter 0.2s ease-in-out, drop-shadow 0.2s ease-in-out;
}

.villain-rimlight-hover:hover .villain-icon-glow {
  filter: drop-shadow(0 0 8px rgba(139, 0, 0, 0.8)) 
          drop-shadow(0 0 16px rgba(139, 0, 0, 0.6));
}
```

Available icon glow classes:
- `.villain-icon-glow` → Blood-red skull glow
- `.sidekick-icon-glow` → Baby blue shield glow
- `.location-icon-glow` → Brown map pin glow
- `.gadget-icon-glow` → Goldenrod wrench glow

---

## 📝 **MAINTENANCE CHECKLIST**

When adding/modifying widgets:

- [ ] Widget assigned correct category color
- [ ] Rimlight class applied to Card wrapper
- [ ] Base border matches hover color at 60% opacity
- [ ] Hover formula uses exact box-shadow values
- [ ] No conflicting hover classes applied
- [ ] Icon glow class added if widget has category icon
- [ ] Documentation updated in this file
- [ ] Testing completed in both light and dark modes

---

## 🌐 **CROSS-PAGE CONSISTENCY**

Every page must follow this system:

✅ **Dashboard Page** → dashboard-rimlight-hover  
✅ **Trading Pages** → trading-rimlight-hover  
✅ **Portfolio Pages** → portfolio-rimlight-hover  
✅ **News Pages** → news-rimlight-hover  
✅ **Markets Pages** → markets-rimlight-hover  
✅ **Research Pages** → research-rimlight-hover  
✅ **Analytics Pages** → analytics-rimlight-hover  
✅ **Learn Pages** → learn-rimlight-hover  
✅ **Detail Pages** → Use entity-specific classes (villain, superhero, etc.)

---

## 🔍 **VISUAL REFERENCE**

### Purple Dashboard Widget (Resting)
```
┌─────────────────────────┐
│ border: rgba(168,85,247,0.6) ← 60% purple
│                         │
│   Dashboard Widget      │
│                         │
└─────────────────────────┘
```

### Purple Dashboard Widget (Hover)
```
    ╔═══════════════════════════╗ ← 40% purple bleed (24px)
  ┌─╨─────────────────────────╨─┐ ← 80% purple glow (12px)
  │ ╔═══════════════════════════╗ ← 100% purple rim (2px)
  │ ║   Dashboard Widget        ║
  │ ║                           ║
  │ ╚═══════════════════════════╝
  └───────────────────────────────┘
```

---

## 📚 **REFERENCE IMPLEMENTATION**

See `/client/src/index.css` lines 776-970 for complete rimlight system implementation.

All widget components must import and use these standardized CSS classes—no custom hover effects allowed.
