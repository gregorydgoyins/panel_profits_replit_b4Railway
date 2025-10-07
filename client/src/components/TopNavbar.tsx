import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  Newspaper,
  GraduationCap,
  Globe,
  BookOpen,
  BarChart3,
  User,
  Bell,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  glowClass: string;
  categoryColor: string;
  hoverTextClass: string;
  activeBgClass: string;
  activeTextClass: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, glowClass: 'rim-glow-dashboard', categoryColor: '#FE4365', hoverTextClass: 'hover:text-[#FE4365]', activeBgClass: 'bg-[#FE4365]', activeTextClass: 'text-white' },
  { path: '/trading', label: 'Trading', icon: TrendingUp, glowClass: 'rim-glow-trading', categoryColor: '#45ADA8', hoverTextClass: 'hover:text-[#45ADA8]', activeBgClass: 'bg-[#45ADA8]', activeTextClass: 'text-white' },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase, glowClass: 'rim-glow-portfolio', categoryColor: '#F9D423', hoverTextClass: 'hover:text-[#F9D423]', activeBgClass: 'bg-[#F9D423]', activeTextClass: 'text-black' },
  { path: '/news', label: 'News', icon: Newspaper, glowClass: 'rim-glow-news', categoryColor: '#22c55e', hoverTextClass: 'hover:text-[#22c55e]', activeBgClass: 'bg-[#22c55e]', activeTextClass: 'text-white' },
  { path: '/learn', label: 'Learn', icon: GraduationCap, glowClass: 'rim-glow-learn', categoryColor: '#FF4F50', hoverTextClass: 'hover:text-[#FF4F50]', activeBgClass: 'bg-[#FF4F50]', activeTextClass: 'text-white' },
  { path: '/markets', label: 'Markets', icon: Globe, glowClass: 'rim-glow-markets', categoryColor: '#E8175D', hoverTextClass: 'hover:text-[#E8175D]', activeBgClass: 'bg-[#E8175D]', activeTextClass: 'text-white' },
  { path: '/research', label: 'Research', icon: BookOpen, glowClass: 'rim-glow-research', categoryColor: '#A8E6CE', hoverTextClass: 'hover:text-[#A8E6CE]', activeBgClass: 'bg-[#A8E6CE]', activeTextClass: 'text-black' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, glowClass: 'rim-glow-analytics', categoryColor: '#E84A5F', hoverTextClass: 'hover:text-[#E84A5F]', activeBgClass: 'bg-[#E84A5F]', activeTextClass: 'text-white' },
];

interface MarketClock {
  code: string;
  city: string;
  timezone: string;
  status: 'open' | 'closed' | 'extended';
  time: Date;
}

export function TopNavbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [markets, setMarkets] = useState<MarketClock[]>([]);

  const getMarketStatus = (
    timezone: string,
    openHour: number,
    closeHour: number,
    hasExtended: boolean = false,
    extStart?: number,
    extEnd?: number
  ): 'open' | 'closed' | 'extended' => {
    const now = new Date();
    const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const hour = marketTime.getHours() + marketTime.getMinutes() / 60;
    const day = marketTime.getDay();
    
    if (day === 0 || day === 6) return 'closed';
    
    if (hasExtended && extStart !== undefined && extEnd !== undefined) {
      if (hour >= extStart && hour < openHour) return 'extended';
      if (hour >= closeHour && hour < extEnd) return 'extended';
    }
    
    return hour >= openHour && hour < closeHour ? 'open' : 'closed';
  };

  const updateMarkets = () => {
    const nyTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const lonTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
    const tkyTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));

    setMarkets([
      {
        code: 'NYSE',
        city: 'NY',
        timezone: 'America/New_York',
        status: getMarketStatus('America/New_York', 9.5, 16, true, 4, 20),
        time: nyTime
      },
      {
        code: 'LSE',
        city: 'LON',
        timezone: 'Europe/London',
        status: getMarketStatus('Europe/London', 8, 16.5),
        time: lonTime
      },
      {
        code: 'TSE',
        city: 'TYO',
        timezone: 'Asia/Tokyo',
        status: getMarketStatus('Asia/Tokyo', 9, 15),
        time: tkyTime
      }
    ]);
  };

  useEffect(() => {
    updateMarkets();
    const interval = setInterval(updateMarkets, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = location === item.path || location.startsWith(item.path + '/');
    const groupHoverClass = item.hoverTextClass.replace('hover:', 'group-hover:');
    
    return (
      <Link key={item.path} href={item.path}>
        <button
          className={`
            group inline-flex items-center gap-2 px-3 h-8 rounded-sm
            ${isActive ? `${item.activeBgClass} ${item.activeTextClass}` : 'bg-transparent'}
            transition-all duration-200
            ${item.glowClass}
            ${isActive ? `${item.glowClass}-active` : ''}
          `}
          data-testid={`link-nav-${item.label.toLowerCase()}`}
        >
          <Icon className={`w-4 h-4 ${isActive ? item.activeTextClass : `text-foreground ${groupHoverClass}`}`} />
          <span 
            className={`text-sm ${isActive ? item.activeTextClass : `text-foreground ${groupHoverClass}`}`}
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
          >
            {item.label}
          </span>
        </button>
      </Link>
    );
  };

  return (
    <nav className="h-9 px-4 bg-black/90 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between gap-4">
      {/* Group 1: Logo/Brand */}
      <div className="flex items-center flex-shrink-0">
        <Link href="/dashboard">
          <a 
            className="text-sm text-white hover:text-gray-300 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            data-testid="link-logo"
          >
            PANEL PROFITS
          </a>
        </Link>
      </div>

      {/* Separator 1 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" data-testid="separator-1-dot-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" data-testid="separator-1-dot-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" data-testid="separator-1-dot-3" />
      </div>

      {/* Group 2: All Navigation Buttons */}
      <div className="hidden md:flex items-center gap-1 flex-shrink-0">
        {navItems.map(renderNavItem)}
      </div>

      {/* Separator 2 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" data-testid="separator-2-dot-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" data-testid="separator-2-dot-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" data-testid="separator-2-dot-3" />
      </div>

      {/* Global Market Clocks */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {markets.map((market) => (
          <div key={market.code} className="flex items-center gap-1.5" data-testid={`market-clock-${market.code.toLowerCase()}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              market.status === 'open' ? 'bg-green-500' : 
              market.status === 'extended' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              {market.code}
            </span>
            <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              {market.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        ))}
      </div>

      {/* Separator 3 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" data-testid="separator-3-dot-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" data-testid="separator-3-dot-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" data-testid="separator-3-dot-3" />
      </div>

      {/* Group 3: Notification, Settings, Profile Icons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9"
          data-testid="button-notifications"
        >
          <Bell className="w-4 h-4" />
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9"
          data-testid="button-settings"
          asChild
        >
          <Link href="/settings">
            <a>
              <Settings className="w-4 h-4" />
            </a>
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              data-testid="button-user-menu"
            >
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <a className="flex items-center gap-2 w-full" data-testid="link-profile">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <a className="flex items-center gap-2 w-full" data-testid="link-settings">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Menu */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden h-9 w-9"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}
