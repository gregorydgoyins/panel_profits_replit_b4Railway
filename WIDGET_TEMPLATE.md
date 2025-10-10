# Universal Widget Template - Two-Tier Color System

## **GOLDEN RULE:**
```
RIM COLOR = NAVIGATION CATEGORY (where widget lives)
INNER WIDGET ELEMENTS = SPECIFIC ACTION/DESTINATION (where they lead)
```

---

## **Widget Template Structure**

```tsx
// Example: Markets Widget with Multi-Destination Actions
export function ExampleMarketsWidget() {
  return (
    <Card className="markets-rimlight-hover"> {/* Orange rim - on Markets page */}
      <CardHeader>
        <h3>Market Analysis</h3>
      </CardHeader>
      
      <CardContent>
        {/* Content here */}
        
        {/* Action buttons use DESTINATION colors */}
        <div className="flex gap-2">
          {/* Goes to Research = Pink */}
          <Button 
            variant="outline" 
            className="border-pink-500/60 text-pink-400 hover:bg-pink-500/10"
            data-testid="button-research"
          >
            Deep Research
          </Button>
          
          {/* Goes to Learn = Cyan */}
          <Button 
            variant="outline" 
            className="border-cyan-500/60 text-cyan-400 hover:bg-cyan-500/10"
            data-testid="button-learn"
          >
            Take Course
          </Button>
          
          {/* Goes to Trading = Blue */}
          <Button 
            variant="outline" 
            className="border-blue-500/60 text-blue-400 hover:bg-blue-500/10"
            data-testid="button-trade"
          >
            Trade Now
          </Button>
          
          {/* Stays in Markets = Orange */}
          <Button 
            variant="outline" 
            className="border-orange-500/60 text-orange-400 hover:bg-orange-500/10"
            data-testid="button-charts"
          >
            View Charts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## **Color Reference by Destination**

| Destination | Color | Border | Text | Hover BG |
|-------------|-------|--------|------|----------|
| **Dashboard** | Purple | `border-purple-500/60` | `text-purple-400` | `hover:bg-purple-500/10` |
| **Trading** | Blue | `border-blue-500/60` | `text-blue-400` | `hover:bg-blue-500/10` |
| **Portfolio** | Orange | `border-orange-500/60` | `text-orange-400` | `hover:bg-orange-500/10` |
| **Markets** | Orange | `border-orange-500/60` | `text-orange-400` | `hover:bg-orange-500/10` |
| **Research** | Pink | `border-pink-500/60` | `text-pink-400` | `hover:bg-pink-500/10` |
| **Learn** | Cyan | `border-cyan-500/60` | `text-cyan-400` | `hover:bg-cyan-500/10` |
| **News** | Green | `border-green-500/60` | `text-green-400` | `hover:bg-green-500/10` |
| **Analytics** | Green | `border-green-500/60` | `text-green-400` | `hover:bg-green-500/10` |

---

## **Widget Rim Colors by Page**

| Page Category | Rim Class | Example |
|---------------|-----------|---------|
| **Dashboard** | `dashboard-rimlight-hover` | Purple border |
| **Trading** | `trading-rimlight-hover` | Blue border |
| **Portfolio** | `portfolio-rimlight-hover` | Orange border |
| **Markets** | `markets-rimlight-hover` | Orange border |
| **Research** | `research-rimlight-hover` | Pink border |
| **Learn** | `learn-rimlight-hover` | Cyan border |
| **News** | `news-rimlight-hover` | Green border |
| **Analytics** | `analytics-rimlight-hover` | Green border |

---

## **Real-World Examples**

### **Example 1: Dashboard Widget with Mixed Actions**
```tsx
<Card className="dashboard-rimlight-hover"> {/* Purple rim */}
  {/* ... content ... */}
  
  <Button className="border-pink-500/60 text-pink-400">Research This</Button>
  <Button className="border-cyan-500/60 text-cyan-400">Learn More</Button>
  <Button className="border-blue-500/60 text-blue-400">Trade Now</Button>
</Card>
```

### **Example 2: Trading Widget Staying In-Category**
```tsx
<Card className="trading-rimlight-hover"> {/* Blue rim */}
  {/* ... content ... */}
  
  <Button className="border-blue-500/60 text-blue-400">Execute Trade</Button>
  <Button className="border-blue-500/60 text-blue-400">View Order Book</Button>
</Card>
```

### **Example 3: Research Widget with External Links**
```tsx
<Card className="research-rimlight-hover"> {/* Pink rim */}
  {/* ... content ... */}
  
  <Button className="border-orange-500/60 text-orange-400">View Market Data</Button>
  <Button className="border-blue-500/60 text-blue-400">Start Trading</Button>
  <Button className="border-pink-500/60 text-pink-400">Deep Dive Analysis</Button>
</Card>
```

---

## **Detail Pages Follow Same Pattern**

Detail pages inherit the category color of their parent navigation:

| Detail Page Type | Parent Nav | Rim Color |
|------------------|------------|-----------|
| Asset Detail (`/asset/[id]`) | Trading/Markets | Blue/Orange |
| Character Detail (`/character/[id]`) | Dashboard | Purple |
| Creator Detail (`/creator/[id]`) | Dashboard | Purple |
| News Article (`/news/[id]`) | News | Green |
| Course Detail (`/course/[id]`) | Learn | Cyan |
| Research Report (`/research/[id]`) | Research | Pink |

**Within these detail pages**, action buttons still follow destination colors.

---

## **Implementation Checklist**

When creating a new widget:

- [ ] Determine which page/category widget lives on
- [ ] Apply correct rimlight class to outer Card
- [ ] Identify all action buttons/links inside
- [ ] Apply destination-based colors to each button
- [ ] Add proper data-testid attributes
- [ ] Ensure consistent spacing and layout
- [ ] Test hover states for both rim and buttons
- [ ] Verify accessibility (contrast ratios)

---

## **Migration Guide for Existing Widgets**

1. **Identify widget's home page** → Apply correct rim class
2. **Find all buttons/links** → Determine their destinations
3. **Update button styles** → Use destination color classes
4. **Remove conflicting styles** → No manual hover states
5. **Test interactions** → Verify rim glow and button colors

---

## **Common Patterns**

### **Multi-Action Widget Footer**
```tsx
<CardFooter className="flex justify-between gap-2">
  <Button variant="outline" className="border-pink-500/60 text-pink-400">
    Research
  </Button>
  <Button variant="outline" className="border-cyan-500/60 text-cyan-400">
    Learn
  </Button>
  <Button variant="outline" className="border-blue-500/60 text-blue-400">
    Trade
  </Button>
</CardFooter>
```

### **Primary Action with Context**
```tsx
<div className="space-y-2">
  <Button className="w-full border-blue-500/60 text-blue-400">
    Primary Action (Trade)
  </Button>
  <div className="flex gap-2">
    <Button variant="ghost" className="text-pink-400">Research</Button>
    <Button variant="ghost" className="text-cyan-400">Learn</Button>
  </div>
</div>
```

---

## **Future Widget Development**

All new widgets MUST follow this template. No exceptions.

This ensures:
- ✅ Consistent visual hierarchy
- ✅ Clear user navigation cues
- ✅ Accessible color coding
- ✅ Scalable design system
- ✅ Unified brand experience
