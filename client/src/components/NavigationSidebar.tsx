import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  Home, DollarSign, Newspaper, Briefcase, Brain, LineChart, Layers, 
  Users, Building, Zap, BookOpen, Calendar, Settings, HelpCircle,
  ChevronLeft, ChevronRight, Trophy, Camera, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NotificationCenter } from '@/components/ui/notification-center';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  category: 'main' | 'trading' | 'portfolio' | 'tools' | 'other';
  badge?: string;
}

export function NavigationSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  
  // Determine active item based on current location
  const getActiveItem = () => {
    if (location === '/') return 'dashboard';
    if (location === '/ai-studio') return 'ai-studio';
    if (location === '/beat-ai') return 'beat-ai';
    if (location === '/grading') return 'ai-grading';
    if (location === '/recommendations') return 'recommendations';
    if (location === '/charting') return 'charting';
    if (location === '/trading') return 'order-desk';
    if (location === '/terminal') return 'terminal';
    if (location === '/characters') return 'characters';
    if (location === '/comics') return 'comics';
    if (location === '/creators') return 'creators';
    if (location === '/publishers') return 'publishers';
    if (location === '/portfolio') return 'portfolio';
    if (location === '/watchlist') return 'watchlist';
    if (location === '/news') return 'news';
    if (location === '/calendar') return 'calendar';
    if (location === '/settings') return 'settings';
    if (location === '/help') return 'help';
    return 'dashboard'; // default
  };
  
  const activeItem = getActiveItem();

  const navigationItems: NavigationItem[] = [
    // Main Navigation
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', category: 'main' },
    { id: 'ai-studio', label: 'AI Studio', icon: Brain, path: '/ai-studio', category: 'main', badge: 'PRO' },
    { id: 'beat-ai', label: 'Beat the AI', icon: Trophy, path: '/beat-ai', category: 'main', badge: 'HOT' },
    { id: 'ai-grading', label: 'AI Grading', icon: Camera, path: '/grading', category: 'main', badge: 'NEW' },
    { id: 'recommendations', label: 'Comics You Might Like', icon: Heart, path: '/recommendations', category: 'main', badge: 'AI' },
    { id: 'charting', label: 'Charting Studio', icon: LineChart, path: '/charting', category: 'main' },
    
    // Trading
    { id: 'order-desk', label: 'Order Desk', icon: DollarSign, path: '/trading', category: 'trading' },
    { id: 'terminal', label: 'Trading Terminal', icon: LineChart, path: '/terminal', category: 'trading', badge: 'PRO' },
    { id: 'characters', label: 'Characters', icon: Users, path: '/characters', category: 'trading' },
    { id: 'comics', label: 'Key Comics', icon: BookOpen, path: '/comics', category: 'trading' },
    { id: 'creators', label: 'Creators', icon: Layers, path: '/creators', category: 'trading' },
    { id: 'publishers', label: 'Publishers', icon: Building, path: '/publishers', category: 'trading' },
    
    // Portfolio
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/portfolio', category: 'portfolio' },
    { id: 'watchlist', label: 'Watchlist', icon: Zap, path: '/watchlist', category: 'portfolio' },
    
    // Tools & Info
    { id: 'news', label: 'News', icon: Newspaper, path: '/news', category: 'tools' },
    { id: 'calendar', label: 'Market Calendar', icon: Calendar, path: '/calendar', category: 'tools' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', category: 'other' },
    { id: 'help', label: 'Help Center', icon: HelpCircle, path: '/help', category: 'other' }
  ];

  const getItemsByCategory = (category: string) => {
    return navigationItems.filter(item => item.category === category);
  };

  // Navigation is handled by Link components, no need for click handler

  const getItemColor = (itemId: string) => {
    const colors = {
      dashboard: 'text-indigo-400 bg-indigo-900/30 hover:bg-indigo-600',
      'ai-studio': 'text-cyan-400 bg-cyan-900/30 hover:bg-cyan-600',
      'ai-grading': 'text-violet-400 bg-violet-900/30 hover:bg-violet-600',
      charting: 'text-pink-400 bg-pink-900/30 hover:bg-pink-600',
      'order-desk': 'text-green-400 bg-green-900/30 hover:bg-green-600',
      characters: 'text-purple-400 bg-purple-900/30 hover:bg-purple-600',
      comics: 'text-orange-400 bg-orange-900/30 hover:bg-orange-600',
      creators: 'text-yellow-400 bg-yellow-900/30 hover:bg-yellow-600',
      publishers: 'text-blue-400 bg-blue-900/30 hover:bg-blue-600',
      portfolio: 'text-emerald-400 bg-emerald-900/30 hover:bg-emerald-600',
      watchlist: 'text-amber-400 bg-amber-900/30 hover:bg-amber-600'
    };
    return colors[itemId as keyof typeof colors] || 'text-gray-400 bg-gray-900/30 hover:bg-gray-600';
  };

  return (
    <Card className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-full`} data-testid="navigation-sidebar">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold font-serif">Panel Profits</h2>
              <p className="text-xs text-muted-foreground">Trading Platform</p>
            </div>
          )}
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            data-testid="button-toggle-sidebar"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-4">
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Main</h3>
            )}
            <div className="space-y-1">
              {getItemsByCategory('main').map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;
                const itemColors = getItemColor(item.id);
                
                return (
                  <Link key={item.id} href={item.path}>
                    <div
                      className={`w-full justify-start flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${itemColors} ${isActive ? 'bg-opacity-100 text-white' : ''} ${isCollapsed ? 'justify-center w-10 h-10' : ''}`}
                      data-testid={`nav-item-${item.id}`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span className="ml-2">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Trading Section */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Trading</h3>
            )}
            <div className="space-y-1">
              {getItemsByCategory('trading').map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;
                const itemColors = getItemColor(item.id);
                
                return (
                  <Link key={item.id} href={item.path}>
                    <div
                      className={`w-full justify-start flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${itemColors} ${isActive ? 'bg-opacity-100 text-white' : ''} ${isCollapsed ? 'justify-center w-10 h-10' : ''}`}
                      data-testid={`nav-item-${item.id}`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Portfolio Section */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Portfolio</h3>
            )}
            <div className="space-y-1">
              {getItemsByCategory('portfolio').map((item) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;
                const itemColors = getItemColor(item.id);
                
                return (
                  <Link key={item.id} href={item.path}>
                    <div
                      className={`w-full justify-start flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${itemColors} ${isActive ? 'bg-opacity-100 text-white' : ''} ${isCollapsed ? 'justify-center w-10 h-10' : ''}`}
                      data-testid={`nav-item-${item.id}`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Tools & Other */}
          {!isCollapsed && (
            <>
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Tools</h3>
                <div className="space-y-1">
                  {getItemsByCategory('tools').map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeItem === item.id;
                    
                    return (
                      <Link key={item.id} href={item.path}>
                        <div
                          className={`w-full justify-start flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                          data-testid={`nav-item-${item.id}`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="ml-2">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="space-y-1">
                  {getItemsByCategory('other').map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeItem === item.id;
                    
                    return (
                      <Link key={item.id} href={item.path}>
                        <div
                          className={`w-full justify-start flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                          data-testid={`nav-item-${item.id}`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="ml-2">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}