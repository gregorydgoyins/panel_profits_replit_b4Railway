# Panel Profits API Structure
## Mythological Financial RPG Endpoints

### 🏛️ Core Domains

```
/api/auth/*          - Authentication & User Management
/api/houses/*        - Seven Mythological Houses System
/api/assets/*        - Comic Assets & Market Data
/api/trading/*       - Order Management & Execution
/api/portfolio/*     - Portfolio & Holdings Management  
/api/karma/*         - Karma System & Modifiers
/api/achievements/*  - Achievements & Progression
/api/ai/*           - AI Intelligence & Predictions
/api/notifications/* - Real-time Notifications
/api/admin/*        - Administrative Functions
```

## 🔐 Authentication Routes
```
GET    /api/auth/user              - Get current user
POST   /api/auth/logout            - Logout user
```

## 🏛️ Houses System Routes
```
GET    /api/houses                 - List all 7 mythological houses
GET    /api/houses/:houseId        - Get house details & specializations
POST   /api/houses/:houseId/join   - Join a house (one-time selection)
GET    /api/houses/:houseId/members - Get house member rankings
GET    /api/houses/:houseId/bonuses - Get current house trading bonuses
GET    /api/houses/my-house        - Get user's house info & status
```

## 💎 Assets & Market Routes  
```
GET    /api/assets                 - List all tradeable assets
GET    /api/assets/:id             - Get asset details
GET    /api/assets/symbol/:symbol  - Get asset by trading symbol
GET    /api/assets/:id/chart       - Get price chart data
GET    /api/assets/:id/similar     - Get similar assets (AI-powered)

GET    /api/market/overview        - Market summary & statistics
GET    /api/market/movers          - Top gainers/losers
GET    /api/market/events          - Market-moving events
GET    /api/market/status          - Market open/closed status
GET    /api/market/indices         - Market indices (PPIx, etc.)
```

## ⚔️ Trading Routes
```
POST   /api/trading/orders         - Place buy/sell order
GET    /api/trading/orders         - Get user's order history
GET    /api/trading/orders/:id     - Get specific order details
PATCH  /api/trading/orders/:id     - Update order (cancel, modify)
DELETE /api/trading/orders/:id     - Cancel pending order

GET    /api/trading/positions      - Get current trading positions
GET    /api/trading/limits         - Get house-based trading limits
GET    /api/trading/fees           - Get trading fees (house-modified)
```

## 💼 Portfolio Routes
```
GET    /api/portfolio              - Get user's portfolio summary
GET    /api/portfolio/holdings     - Get all holdings
GET    /api/portfolio/performance  - Get performance analytics
GET    /api/portfolio/value        - Get total portfolio value
POST   /api/portfolio/watchlist    - Add asset to watchlist
DELETE /api/portfolio/watchlist/:id - Remove from watchlist
```

## ⚡ Karma System Routes
```
GET    /api/karma/score            - Get user's karma score
GET    /api/karma/history          - Get karma transaction history
GET    /api/karma/modifiers        - Get active trading modifiers
GET    /api/karma/leaderboard      - Get karma leaderboard
POST   /api/karma/actions          - Record karma-affecting action
```

## 🏆 Achievements Routes
```
GET    /api/achievements           - Get user's achievements
GET    /api/achievements/available - Get available achievements
GET    /api/achievements/progress  - Get achievement progress
GET    /api/achievements/rewards   - Get achievement rewards
```

## 🤖 AI Intelligence Routes
```
GET    /api/ai/predictions         - Get AI price predictions
GET    /api/ai/insights           - Get market insights
GET    /api/ai/recommendations    - Get personalized recommendations
POST   /api/ai/chat               - Chat with AI trading assistant
GET    /api/ai/sentiment          - Get market sentiment analysis
```

## 🔔 Notifications Routes
```
GET    /api/notifications          - Get user notifications
POST   /api/notifications/:id/read - Mark notification as read
POST   /api/notifications/read-all - Mark all as read
DELETE /api/notifications/:id      - Delete notification
GET    /api/notifications/settings - Get notification preferences
PUT    /api/notifications/settings - Update notification preferences
```

## 🛠️ Admin Routes
```
POST   /api/admin/market/simulate  - Trigger market simulation
POST   /api/admin/data/import      - Import asset data
GET    /api/admin/system/status    - Get system health status
POST   /api/admin/houses/rebalance - Rebalance house bonuses
```

## 🌐 WebSocket Endpoints
```
/ws/market-data     - Real-time price updates
/ws/notifications   - Real-time notifications
/ws/trading         - Real-time order updates
/ws/house-events    - House-specific events
```

---

## 🎯 Key Improvements Needed

1. **Consolidate scattered routes** from multiple files
2. **Group by logical domains** (houses, trading, karma, etc.)
3. **Consistent naming conventions** (RESTful patterns)
4. **Clear URL hierarchy** that reflects the RPG structure
5. **House-specific endpoints** for the mythological system
6. **Karma integration** across trading endpoints