#!/bin/bash

# Global Rimlight System - Apply to ALL Widgets
# Rule: RIM COLOR = NAVIGATION CATEGORY

echo "🎨 Applying Universal Rimlight System to ALL widgets..."

# Dashboard Widgets = Purple (dashboard-rimlight-hover)
DASHBOARD_WIDGETS=(
  "client/src/components/widgets/NarrativeMilestonesWidget.tsx"
  "client/src/components/widgets/StoryArcExplorerWidget.tsx"
  "client/src/components/widgets/CreatorShowcaseWidget.tsx"
  "client/src/components/widgets/AppearanceTrackerWidget.tsx"
  "client/src/components/widgets/RelationshipWebWidget.tsx"
  "client/src/components/widgets/CreatorCollaborationsWidget.tsx"
  "client/src/components/widgets/ComicPanelTimelineWidget.tsx"
  "client/src/components/widgets/CharacterPortraitWidget.tsx"
  "client/src/components/widgets/CoverGalleryWidget.tsx"
  "client/src/components/dashboard/CreatorInfluenceWidget.tsx"
  "client/src/components/dashboard/CreatorSpotlightWidget.tsx"
  "client/src/components/dashboard/TrendingCharactersWidget.tsx"
  "client/src/components/dashboard/HousePowerRankingsWidget.tsx"
)

# Markets Widgets = Orange (markets-rimlight-hover)
MARKETS_WIDGETS=(
  "client/src/components/dashboard/MarketMoversWidget.tsx"
  "client/src/components/dashboard/StockTickerWidget.tsx"
  "client/src/components/dashboard/AssetGrowthWidget.tsx"
  "client/src/components/dashboard/PublisherPerformanceWidget.tsx"
  "client/src/components/dashboard/ComicHeatMapWidget.tsx"
  "client/src/components/dashboard/ComicSentimentWidget.tsx"
  "client/src/components/dashboard/SectorRotationWidget.tsx"
  "client/src/components/dashboard/FearGreedWidget.tsx"
  "client/src/components/dashboard/EconomicCalendarWidget.tsx"
)

# Trading Widgets = Blue (trading-rimlight-hover)
TRADING_WIDGETS=(
  "client/src/components/dashboard/OptionsChainWidget.tsx"
  "client/src/components/dashboard/InstitutionalOrderFlowWidget.tsx"
  "client/src/components/dashboard/WhaleTrackerWidget.tsx"
  "client/src/components/dashboard/OrderBookWidget.tsx"
  "client/src/components/dashboard/TradeBlotterWidget.tsx"
  "client/src/components/dashboard/LEAPSWidget.tsx"
  "client/src/components/dashboard/UnusualActivityWidget.tsx"
  "client/src/components/dashboard/DarkPoolWidget.tsx"
  "client/src/components/dashboard/PositionMonitorWidget.tsx"
  "client/src/components/dashboard/MarginUtilizationWidget.tsx"
)

# Portfolio Widgets = Orange (portfolio-rimlight-hover)
PORTFOLIO_WIDGETS=(
  "client/src/components/dashboard/PortfolioRiskMetricsWidget.tsx"
  "client/src/components/dashboard/PortfolioGreeksWidget.tsx"
  "client/src/components/dashboard/WatchlistPanelWidget.tsx"
  "client/src/components/dashboard/CashFlowStatementWidget.tsx"
)

# Research/Analytics Widgets = Pink (research-rimlight-hover)
RESEARCH_WIDGETS=(
  "client/src/components/dashboard/CGCGradeComparisonWidget.tsx"
  "client/src/components/dashboard/ComicRiskAssessmentWidget.tsx"
  "client/src/components/dashboard/AIRecommendationsWidget.tsx"
  "client/src/components/dashboard/CorrelationMatrixWidget.tsx"
  "client/src/components/dashboard/FractalPatternWidget.tsx"
  "client/src/components/dashboard/QuantumMomentumWidget.tsx"
  "client/src/components/dashboard/VolatilitySurfaceWidget.tsx"
  "client/src/components/dashboard/MarketMicrostructureWidget.tsx"
  "client/src/components/dashboard/SentimentVelocityWidget.tsx"
  "client/src/components/dashboard/AnomalyDetectorWidget.tsx"
  "client/src/components/dashboard/ArbitrageScannerWidget.tsx"
)

# Function to add rimlight class
add_rimlight() {
  local file=$1
  local rimlight_class=$2
  
  if [ -f "$file" ]; then
    # Add rimlight to main container divs that don't have it
    sed -i.bak 's/className="relative bg-\[#1A1F2E\] border border-indigo-900\/30 rounded-md overflow-hidden"/className="relative bg-[#1A1F2E] border border-indigo-900\/30 rounded-md overflow-hidden '"$rimlight_class"'"/g' "$file"
    
    # Also update Card components
    sed -i.bak 's/className="h-full !bg-\[#1A1F2E\]"/className="h-full !bg-[#1A1F2E] '"$rimlight_class"'"/g' "$file"
    
    rm -f "${file}.bak"
    echo "  ✓ Updated: $file"
  fi
}

# Apply Dashboard rimlight (Purple)
echo "📊 Applying Dashboard rimlight (Purple)..."
for widget in "${DASHBOARD_WIDGETS[@]}"; do
  add_rimlight "$widget" "dashboard-rimlight-hover"
done

# Apply Markets rimlight (Orange)
echo "📈 Applying Markets rimlight (Orange)..."
for widget in "${MARKETS_WIDGETS[@]}"; do
  add_rimlight "$widget" "markets-rimlight-hover"
done

# Apply Trading rimlight (Blue)
echo "💹 Applying Trading rimlight (Blue)..."
for widget in "${TRADING_WIDGETS[@]}"; do
  add_rimlight "$widget" "trading-rimlight-hover"
done

# Apply Portfolio rimlight (Orange)
echo "💼 Applying Portfolio rimlight (Orange)..."
for widget in "${PORTFOLIO_WIDGETS[@]}"; do
  add_rimlight "$widget" "portfolio-rimlight-hover"
done

# Apply Research rimlight (Pink)
echo "🔬 Applying Research rimlight (Pink)..."
for widget in "${RESEARCH_WIDGETS[@]}"; do
  add_rimlight "$widget" "research-rimlight-hover"
done

echo "✅ Universal Rimlight System applied to all widgets!"
