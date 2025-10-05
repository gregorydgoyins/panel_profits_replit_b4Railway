import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { NotificationSystemProvider } from '@/components/notifications/NotificationSystemProvider';
import { HouseThemeProvider } from '@/contexts/HouseThemeContext';
import { LandingPage } from '@/components/LandingPage';
import { StickyHeader } from '@/components/StickyHeader';
import { TopNavbar } from '@/components/TopNavbar';
import { Footer } from '@/components/Footer';
import { EntryTestGuard } from '@/components/EntryTestGuard';
import KnowledgeTestGuard from '@/components/KnowledgeTestGuard';
import NotFound from '@/pages/not-found';

// Essential pages only for Phase 0
// Auth
import AuthPage from '@/pages/auth';
import ComicIntro from '@/pages/ComicIntro';
import EntryTestPage from '@/pages/EntryTestPage';
import KnowledgeTestPage from '@/pages/KnowledgeTestPage';

// Dashboard
import DashboardPage from '@/pages/DashboardPage';

// Trading pages
import TradingPage from '@/pages/trading';
import TradingTerminalPage from '@/pages/TradingTerminal';

// Portfolio pages
import PortfolioPage from '@/pages/portfolio';
import WatchlistPage from '@/pages/watchlist';
import LeaderboardPage from '@/pages/LeaderboardPage';

// Portfolio detail pages
import PortfolioValuePage from '@/pages/portfolio/PortfolioValuePage';
import CashBalancePage from '@/pages/portfolio/CashBalancePage';
import MarketAssetsPage from '@/pages/portfolio/MarketAssetsPage';
import DayPLPage from '@/pages/portfolio/DayPLPage';
import TotalReturnPage from '@/pages/portfolio/TotalReturnPage';
import BuyingPowerPage from '@/pages/portfolio/BuyingPowerPage';
import OpenOrdersPage from '@/pages/portfolio/OpenOrdersPage';
import ActivePositionsPage from '@/pages/portfolio/ActivePositionsPage';
import WinRatePage from '@/pages/portfolio/WinRatePage';
import BestPerformerPage from '@/pages/portfolio/BestPerformerPage';
import WorstPerformerPage from '@/pages/portfolio/WorstPerformerPage';
import TotalAccountValuePage from '@/pages/portfolio/TotalAccountValuePage';

// Settings
import SettingsPage from '@/pages/settings';

// Certifications
import CertificationsPage from '@/pages/CertificationsPage';

// Easter Eggs
import EasterEggsPage from '@/pages/EasterEggsPage';
import { useEasterEggNotifications } from '@/hooks/useEasterEggNotifications';

// Investment Clubs
import InvestmentClubsPage from '@/pages/InvestmentClubsPage';
import InvestmentClubDetailPage from '@/pages/InvestmentClubDetailPage';

// Advanced Analytics
import AdvancedAnalytics from '@/pages/AdvancedAnalytics';

// News & Learning
import NewsPage from '@/pages/NewsPage';
import LearnPage from '@/pages/LearnPage';

// Asset Details
import AssetDetailPage from '@/pages/AssetDetailPage';

// Comic Detail Pages
import SeriesDetailPage from '@/pages/SeriesDetailPage';
import HistoricalSignificancePage from '@/pages/HistoricalSignificancePage';
import CreatorBioPage from '@/pages/CreatorBioPage';
import IssueDetailPage from '@/pages/IssueDetailPage';
import OrderDeskPage from '@/pages/OrderDeskPage';

function Router() {
  const { isAuthenticated } = useAuth();

  // For Phase 0, always show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/intro" component={ComicIntro} />
        <Route path="/auth" component={AuthPage} />
        <Route component={LandingPage} />
      </Switch>
    );
  }

  // Authenticated routes - clean, essential pages only
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/entry-test" component={EntryTestPage} />
      <Route path="/knowledge-test" component={KnowledgeTestPage} />
      <Route path="/trading" component={TradingPage} />
      <Route path="/terminal" component={TradingTerminalPage} />
      <Route path="/portfolio/value" component={PortfolioValuePage} />
      <Route path="/portfolio/cash" component={CashBalancePage} />
      <Route path="/portfolio/assets" component={MarketAssetsPage} />
      <Route path="/portfolio/pnl" component={DayPLPage} />
      <Route path="/portfolio/returns" component={TotalReturnPage} />
      <Route path="/portfolio/buying-power" component={BuyingPowerPage} />
      <Route path="/portfolio/orders" component={OpenOrdersPage} />
      <Route path="/portfolio/positions" component={ActivePositionsPage} />
      <Route path="/portfolio/win-rate" component={WinRatePage} />
      <Route path="/portfolio/best-performer" component={BestPerformerPage} />
      <Route path="/portfolio/worst-performer" component={WorstPerformerPage} />
      <Route path="/portfolio/account-value" component={TotalAccountValuePage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/certifications" component={CertificationsPage} />
      <Route path="/easter-eggs" component={EasterEggsPage} />
      <Route path="/investment-clubs" component={InvestmentClubsPage} />
      <Route path="/investment-clubs/:id" component={InvestmentClubDetailPage} />
      <Route path="/analytics" component={AdvancedAnalytics} />
      <Route path="/news/:id?" component={NewsPage} />
      <Route path="/learn/:id?" component={LearnPage} />
      <Route path="/asset/:symbol" component={AssetDetailPage} />
      <Route path="/series/:series" component={SeriesDetailPage} />
      <Route path="/historical-significance/:id" component={HistoricalSignificancePage} />
      <Route path="/creator/:name" component={CreatorBioPage} />
      <Route path="/issue/:id" component={IssueDetailPage} />
      <Route path="/order-desk/:assetId" component={OrderDeskPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <NotificationSystemProvider>
          <HouseThemeProvider defaultHouse="heroes">
            <AuthenticatedLayout />
          </HouseThemeProvider>
        </NotificationSystemProvider>
        <Toaster />
      </ToastProvider>
    </QueryClientProvider>
  );
}

function EasterEggMonitor() {
  useEasterEggNotifications();
  return null;
}

function AuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Router />
      </div>
    );
  }

  // Authenticated layout with progressive guards
  // Entry Test → Knowledge Test → Main App (Dashboard)
  return (
    <EntryTestGuard>
      <Switch>
        {/* Knowledge Test page - accessible after Entry Test, before main app */}
        <Route path="/knowledge-test" component={KnowledgeTestPage} />
        
        {/* All other routes require Knowledge Test completion */}
        <Route>
          <KnowledgeTestGuard>
            <EasterEggMonitor />
            <div className="min-h-screen bg-background text-foreground">
              {/* Sticky header group: Welcome banner + News + Stock tickers + Top Nav */}
              <div className="sticky top-0 z-50">
                <StickyHeader />
                <TopNavbar />
              </div>
              
              {/* Main content area with footer at end */}
              <main>
                <div className="max-w-[1920px] mx-auto px-6 py-6">
                  <Router />
                </div>
                <Footer />
              </main>
            </div>
          </KnowledgeTestGuard>
        </Route>
      </Switch>
    </EntryTestGuard>
  );
}