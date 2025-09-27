import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, DollarSign, Newspaper, Briefcase, Brain, LineChart, Layers, Compass
} from 'lucide-react';

interface QuickNavigationToolbarProps {
  className?: string;
}

export function QuickNavigationToolbar({ className = '' }: QuickNavigationToolbarProps) {
  const location = useLocation();
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'order-desk', label: 'Order Desk', icon: DollarSign, path: '/trading' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/news' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/portfolio' },
    { id: 'ai-lab', label: 'AI Lab', icon: Brain, path: '/ideas' },
    { id: 'charting-studio', label: 'Charting Studio', icon: LineChart, path: '/technical-analysis' },
    { id: 'assets', label: 'Assets', icon: Layers, path: '/characters' }
  ];

  // Define unique colors for each navigation item
  const getItemColors = (itemId: string, isActive: boolean) => {
    const colors = {
      dashboard: isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-600 hover:text-white',
      'order-desk': isActive ? 'bg-green-600 text-white' : 'bg-green-900/30 text-green-300 hover:bg-green-600 hover:text-white',
      news: isActive ? 'bg-orange-600 text-white' : 'bg-orange-900/30 text-orange-300 hover:bg-orange-600 hover:text-white',
      portfolio: isActive ? 'bg-purple-600 text-white' : 'bg-purple-900/30 text-purple-300 hover:bg-purple-600 hover:text-white',
      'ai-lab': isActive ? 'bg-cyan-600 text-white' : 'bg-cyan-900/30 text-cyan-300 hover:bg-cyan-600 hover:text-white',
      'charting-studio': isActive ? 'bg-pink-600 text-white' : 'bg-pink-900/30 text-pink-300 hover:bg-pink-600 hover:text-white',
      assets: isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-600 hover:text-white',
    };
    return colors[itemId as keyof typeof colors] || (isActive ? 'bg-slate-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:text-white');
  };

  return (
    <div className={`bg-slate-700 p-2 mx-4 mt-2 mb-4 rounded-xl ${className}`}>
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-yellow-500 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 transition-all">
        <div className="flex items-center space-x-2 flex-shrink-0 pl-0 pr-2 py-1 rounded-md bg-blue-900/50 border border-blue-700/50 mb-4">
          <Compass className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-white font-medium">QUICK NAVIGATION</span>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:border-white hover:border-2 border border-transparent min-h-[80px] ${getItemColors(item.id, isActive)}`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-xs text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuickNavigationToolbar;