import { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { HeroBanner } from '@/components/HeroBanner';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { LiveDataTerminal } from '@/components/LiveDataTerminal';
import AIStudio from '@/pages/AIStudio';
import BeatTheAI from '@/pages/BeatTheAI';
import ComicGrading from '@/pages/ComicGrading';
import { ChartingStudio } from '@/components/ChartingStudio';
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
import PPIxDashboard from '@/pages/PPIxDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Dashboard() {
  return (
    <div className="min-h-screen" data-testid="homepage-dashboard">
      {/* Hero Banner - Full width, mystical trading terminal intro */}
      <section className="-mx-6 -mt-6">
        <HeroBanner />
      </section>
      
      {/* Feature Showcase - AI Grading, Beat the AI, Market Intelligence */}
      <section className="max-w-7xl mx-auto px-6">
        <FeatureShowcase />
      </section>
      
      {/* Live Data Terminal - Real-time market data visualization */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <LiveDataTerminal />
      </section>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/ai-studio" component={AIStudio} />
      <Route path="/beat-ai" component={BeatTheAI} />
      <Route path="/grading" component={ComicGrading} />
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
      
      {/* PPIx Market Indices Dashboard */}
      <Route path="/ppix" component={PPIxDashboard} />
      
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