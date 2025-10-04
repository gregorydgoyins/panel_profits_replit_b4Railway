import { Link, useLocation } from 'wouter';
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

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const leftNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trading', label: 'Trading', icon: TrendingUp },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
];

const rightNavItems: NavItem[] = [
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/markets', label: 'Markets', icon: Globe },
  { path: '/research', label: 'Research', icon: BookOpen },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function TopNavbar() {
  const [location] = useLocation();
  const { user } = useAuth();

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
    
    return (
      <Link key={item.path} href={item.path}>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          className={`gap-2 ${isActive ? 'bg-gray-800' : ''}`}
          data-testid={`link-nav-${item.label.toLowerCase()}`}
          asChild
        >
          <a>
            <Icon className="w-4 h-4" />
            <span 
              className="font-normal text-sm"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              {item.label}
            </span>
          </a>
        </Button>
      </Link>
    );
  };

  return (
    <nav className="h-14 px-4 bg-black/90 backdrop-blur-sm border-b border-gray-800 flex items-center">
      {/* Left Section: Logo + First 3 Nav Items (1/6 width) */}
      <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '16.66%' }}>
        <Link href="/dashboard">
          <a 
            className="text-sm font-normal text-white hover:text-gray-300 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            data-testid="link-logo"
          >
            PANEL PROFITS
          </a>
        </Link>
        
        <div className="h-6 w-px bg-gray-700" />
        
        <div className="hidden md:flex items-center gap-1">
          {leftNavItems.map(renderNavItem)}
        </div>
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Right Section: Remaining Nav Items + Action Buttons (1/6 width) */}
      <div className="flex items-center gap-2 justify-end flex-shrink-0" style={{ width: '16.66%' }}>
        {/* Right Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {rightNavItems.map(renderNavItem)}
        </div>
        
        <div className="h-6 w-px bg-gray-700 mx-2" />
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9"
          data-testid="button-notifications"
        >
          <Bell className="w-4 h-4" />
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
