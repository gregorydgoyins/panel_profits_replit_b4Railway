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
  glowClass: string;
  categoryColor: string;
  hoverTextClass: string;
  activeBgClass: string;
  activeTextClass: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, glowClass: 'rim-glow-dashboard', categoryColor: 'hsl(270 80% 60%)', hoverTextClass: 'hover:text-[hsl(270,80%,60%)]', activeBgClass: 'bg-[hsl(270,80%,60%)]', activeTextClass: 'text-white' },
  { path: '/trading', label: 'Trading', icon: TrendingUp, glowClass: 'rim-glow-trading', categoryColor: 'hsl(210 100% 50%)', hoverTextClass: 'hover:text-[hsl(210,100%,50%)]', activeBgClass: 'bg-[hsl(210,100%,50%)]', activeTextClass: 'text-white' },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase, glowClass: 'rim-glow-portfolio', categoryColor: 'hsl(45 100% 50%)', hoverTextClass: 'hover:text-[hsl(45,100%,50%)]', activeBgClass: 'bg-[hsl(45,100%,50%)]', activeTextClass: 'text-black' },
  { path: '/news', label: 'News', icon: Newspaper, glowClass: 'rim-glow-news', categoryColor: 'hsl(0 0% 100%)', hoverTextClass: 'hover:text-white', activeBgClass: 'bg-white', activeTextClass: 'text-black' },
  { path: '/learn', label: 'Learn', icon: GraduationCap, glowClass: 'rim-glow-learn', categoryColor: 'hsl(180 100% 50%)', hoverTextClass: 'hover:text-[hsl(180,100%,50%)]', activeBgClass: 'bg-[hsl(180,100%,50%)]', activeTextClass: 'text-white' },
  { path: '/markets', label: 'Markets', icon: Globe, glowClass: 'rim-glow-markets', categoryColor: 'hsl(25 95% 53%)', hoverTextClass: 'hover:text-[hsl(25,95%,53%)]', activeBgClass: 'bg-[hsl(25,95%,53%)]', activeTextClass: 'text-white' },
  { path: '/research', label: 'Research', icon: BookOpen, glowClass: 'rim-glow-research', categoryColor: 'hsl(320 85% 60%)', hoverTextClass: 'hover:text-[hsl(320,85%,60%)]', activeBgClass: 'bg-[hsl(320,85%,60%)]', activeTextClass: 'text-white' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, glowClass: 'rim-glow-analytics', categoryColor: 'hsl(140 70% 45%)', hoverTextClass: 'hover:text-[hsl(140,70%,45%)]', activeBgClass: 'bg-[hsl(140,70%,45%)]', activeTextClass: 'text-white' },
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
            className={`font-bold text-sm ${isActive ? item.activeTextClass : `text-foreground ${groupHoverClass}`}`}
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
            className="text-sm font-bold text-white hover:text-gray-300 transition-colors whitespace-nowrap"
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
