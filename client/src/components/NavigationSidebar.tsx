import { useState } from 'react';
import { 
  Home, DollarSign, Newspaper, Briefcase, Brain, LineChart, Layers, 
  Users, Building, Zap, BookOpen, Calendar, Settings, HelpCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigationItems: NavigationItem[] = [
    // Main Navigation
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', category: 'main' },
    { id: 'ai-studio', label: 'AI Studio', icon: Brain, path: '/ai-studio', category: 'main', badge: 'NEW' },
    { id: 'charting', label: 'Charting Studio', icon: LineChart, path: '/charting', category: 'main' },
    
    // Trading
    { id: 'order-desk', label: 'Order Desk', icon: DollarSign, path: '/trading', category: 'trading' },
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

  const handleItemClick = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
    setActiveItem(itemId);
  };

  const getItemColor = (itemId: string) => {
    const colors = {
      dashboard: 'text-indigo-400 bg-indigo-900/30 hover:bg-indigo-600',
      'ai-studio': 'text-cyan-400 bg-cyan-900/30 hover:bg-cyan-600',
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
                  <Button
                    key={item.id}
                    variant="ghost"
                    size={isCollapsed ? "icon" : "sm"}
                    className={`w-full justify-start ${itemColors} ${isActive ? 'bg-opacity-100 text-white' : ''}`}
                    onClick={() => handleItemClick(item.id)}
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
                  </Button>
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
                  <Button
                    key={item.id}
                    variant="ghost"
                    size={isCollapsed ? "icon" : "sm"}
                    className={`w-full justify-start ${itemColors} ${isActive ? 'bg-opacity-100 text-white' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                    data-testid={`nav-item-${item.id}`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">{item.label}</span>}
                  </Button>
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
                  <Button
                    key={item.id}
                    variant="ghost"
                    size={isCollapsed ? "icon" : "sm"}
                    className={`w-full justify-start ${itemColors} ${isActive ? 'bg-opacity-100 text-white' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                    data-testid={`nav-item-${item.id}`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">{item.label}</span>}
                  </Button>
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
                      <Button
                        key={item.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => handleItemClick(item.id)}
                        data-testid={`nav-item-${item.id}`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="ml-2">{item.label}</span>
                      </Button>
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
                      <Button
                        key={item.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => handleItemClick(item.id)}
                        data-testid={`nav-item-${item.id}`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="ml-2">{item.label}</span>
                      </Button>
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