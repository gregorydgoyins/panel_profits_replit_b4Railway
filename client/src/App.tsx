import { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { NotificationSystemProvider } from '@/components/notifications/NotificationSystemProvider';
import { LandingPage } from '@/components/LandingPage';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { HeroBanner } from '@/components/HeroBanner';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { LiveDataTerminal } from '@/components/LiveDataTerminal';
import AIStudio from '@/pages/AIStudio';
import BeatTheAI from '@/pages/BeatTheAI';
import ComicGrading from '@/pages/ComicGrading';
import Recommendations from '@/pages/Recommendations';
import { ChartingStudio } from '@/components/ChartingStudio';
import NotFound from '@/pages/not-found';

// Dashboard page (new main dashboard)
import DashboardPage from '@/pages/DashboardPage';

// Trading pages
import TradingPage from '@/pages/trading';
import TradingTerminalPage from '@/pages/TradingTerminal';
import CharactersPage from '@/pages/characters';
import ComicsPage from '@/pages/comics';
import CreatorsPage from '@/pages/creators';
import PublishersPage from '@/pages/publishers';

// Portfolio pages
import PortfolioPage from '@/pages/portfolio';
import WatchlistPage from '@/pages/watchlist';
import LeaderboardPage from '@/pages/LeaderboardPage';

// Tools & Other pages
import NewsPage from '@/pages/news';
import CalendarPage from '@/pages/calendar';
import SettingsPage from '@/pages/settings';
import HelpPage from '@/pages/help';
import SpectacularShowcase from '@/pages/SpectacularShowcase';
import RealDataShowcase from '@/pages/RealDataShowcase';
import PPIxDashboard from '@/pages/PPIxDashboard';

// WebSocket service for real-time data
import { webSocketService } from '@/services/websocketService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Landing page for non-authenticated users
function LandingDashboard() {
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
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          <Route path="/" component={DashboardPage} />
      <Route path="/ai-studio" component={AIStudio} />
      <Route path="/beat-ai" component={BeatTheAI} />
      <Route path="/grading" component={ComicGrading} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/charting" component={ChartingStudio} />
      
      {/* Trading routes */}
      <Route path="/trading" component={TradingPage} />
      <Route path="/terminal" component={TradingTerminalPage} />
      <Route path="/characters" component={CharactersPage} />
      <Route path="/comics" component={ComicsPage} />
      <Route path="/creators" component={CreatorsPage} />
      <Route path="/publishers" component={PublishersPage} />
      
      {/* Portfolio routes */}
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/leaderboards" component={LeaderboardPage} />
      
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
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <NotificationSystemProvider>
          <AuthenticatedLayout />
        </NotificationSystemProvider>
        <Toaster />
      </ToastProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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

  return (
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
  );
}