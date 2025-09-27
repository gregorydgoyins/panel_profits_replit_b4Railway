import { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { DashboardHeader } from '@/components/DashboardHeader';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { LiveMarketFeed } from '@/components/LiveMarketFeed';
import { KeyComicSearchSection } from '@/components/KeyComicSearchSection';
import { AIStudio } from '@/components/AIStudio';
import { ChartingStudio } from '@/components/ChartingStudio';
import { MarketOverviewStats } from '@/components/MarketOverviewStats';
import NotFound from '@/pages/not-found';

// Trading pages
import TradingPage from '@/pages/trading';
import CharactersPage from '@/pages/characters';
import ComicsPage from '@/pages/comics';
import CreatorsPage from '@/pages/creators';
import PublishersPage from '@/pages/publishers';

// Portfolio pages
import PortfolioPage from '@/pages/portfolio';
import WatchlistPage from '@/pages/watchlist';

// Tools & Other pages
import NewsPage from '@/pages/news';
import CalendarPage from '@/pages/calendar';
import SettingsPage from '@/pages/settings';
import HelpPage from '@/pages/help';
import SpectacularShowcase from '@/pages/SpectacularShowcase';
import RealDataShowcase from '@/pages/RealDataShowcase';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketSentiment] = useState(0.025); // Mock positive sentiment
  const [marketIndex] = useState(14750); // Mock market index

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        marketSentiment={marketSentiment}
        marketIndex={marketIndex}
        currentTime={currentTime}
        aiConfidence={87.5}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <MarketOverviewStats />
          <KeyComicSearchSection />
        </div>
        <div className="space-y-6">
          <LiveMarketFeed />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/ai-studio" component={AIStudio} />
      <Route path="/charting" component={ChartingStudio} />
      
      {/* Trading routes */}
      <Route path="/trading" component={TradingPage} />
      <Route path="/characters" component={CharactersPage} />
      <Route path="/comics" component={ComicsPage} />
      <Route path="/creators" component={CreatorsPage} />
      <Route path="/publishers" component={PublishersPage} />
      
      {/* Portfolio routes */}
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/watchlist" component={WatchlistPage} />
      
      {/* Tools & Other routes */}
      <Route path="/news" component={NewsPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/help" component={HelpPage} />
      
      {/* Spectacular Components Showcase */}
      <Route path="/spectacular" component={SpectacularShowcase} />
      
      {/* Real Data Integration Showcase */}
      <Route path="/real-data" component={RealDataShowcase} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="flex-shrink-0">
            <NavigationSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
              <Router />
            </main>
          </div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}