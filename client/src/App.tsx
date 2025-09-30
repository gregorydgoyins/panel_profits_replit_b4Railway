import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { NotificationSystemProvider } from '@/components/notifications/NotificationSystemProvider';
import { HouseThemeProvider } from '@/contexts/HouseThemeContext';
import { LandingPage } from '@/components/LandingPage';
import { NavigationSidebar } from '@/components/NavigationSidebar';
import { EntryTestGuard } from '@/components/EntryTestGuard';
import NotFound from '@/pages/not-found';

// Essential pages only for Phase 0
// Auth
import AuthPage from '@/pages/auth';
import EntryTestPage from '@/pages/EntryTestPage';

// Dashboard
import DashboardPage from '@/pages/DashboardPage';

// Trading pages
import TradingPage from '@/pages/trading';
import TradingTerminalPage from '@/pages/TradingTerminal';

// Portfolio pages
import PortfolioPage from '@/pages/portfolio';
import WatchlistPage from '@/pages/watchlist';
import LeaderboardPage from '@/pages/LeaderboardPage';

// Settings
import SettingsPage from '@/pages/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Router() {
  const { isAuthenticated } = useAuth();

  // For Phase 0, always show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
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
      <Route path="/trading" component={TradingPage} />
      <Route path="/terminal" component={TradingTerminalPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/watchlist" component={WatchlistPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
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

  // Authenticated layout with sidebar - desktop-first design
  return (
    <EntryTestGuard>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen">
          {/* Professional sidebar navigation */}
          <div className="flex-shrink-0">
            <NavigationSidebar />
          </div>
          
          {/* Main content area - optimized for desktop */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
              <Router />
            </main>
          </div>
        </div>
      </div>
    </EntryTestGuard>
  );
}