import { Crown, Calendar, Clock, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardCategory } from '@shared/schema';

interface LeaderboardTabsProps {
  categories: LeaderboardCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  loading?: boolean;
}

export function LeaderboardTabs({ categories, activeCategory, onCategoryChange, loading = false }: LeaderboardTabsProps) {
  const getCategoryIcon = (categoryType: string, timeframe: string) => {
    if (categoryType === 'volume') return <BarChart3 className="h-4 w-4" />;
    if (categoryType === 'win_rate') return <Target className="h-4 w-4" />;
    if (categoryType === 'consistency') return <TrendingUp className="h-4 w-4" />;
    
    // For total_return, use different icons based on timeframe
    if (timeframe === 'all_time') return <Crown className="h-4 w-4" />;
    if (timeframe === 'monthly') return <Calendar className="h-4 w-4" />;
    if (timeframe === 'weekly' || timeframe === 'daily') return <Clock className="h-4 w-4" />;
    
    return <Crown className="h-4 w-4" />;
  };

  const getCategoryColors = (categoryType: string, timeframe: string) => {
    if (categoryType === 'volume') return 'text-blue-400';
    if (categoryType === 'win_rate') return 'text-green-400';
    if (categoryType === 'consistency') return 'text-purple-400';
    
    if (timeframe === 'all_time') return 'text-yellow-400';
    if (timeframe === 'monthly') return 'text-emerald-400';
    if (timeframe === 'weekly') return 'text-cyan-400';
    if (timeframe === 'daily') return 'text-orange-400';
    
    return 'text-gray-400';
  };

  const getTimeframeBadge = (timeframe: string) => {
    switch (timeframe) {
      case 'all_time': return 'All-Time';
      case 'monthly': return 'Month';
      case 'weekly': return 'Week';
      case 'daily': return 'Today';
      default: return timeframe;
    }
  };

  const getBadgeVariant = (timeframe: string) => {
    switch (timeframe) {
      case 'all_time': return 'default';
      case 'monthly': return 'secondary';
      case 'weekly': return 'outline';
      case 'daily': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-32 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Sort categories by display order
  const sortedCategories = [...categories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="mb-6" data-testid="leaderboard-tabs">
      <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-1 h-auto bg-slate-800/50 p-1">
          {sortedCategories.map((category) => {
            const isActive = activeCategory === category.id;
            const iconColors = getCategoryColors(category.categoryType, category.timeframe);
            
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`flex flex-col items-center gap-1 p-3 text-xs font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-700 text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-slate-700/50'
                }`}
                data-testid={`category-tab-${category.categoryType}-${category.timeframe}`}
              >
                <div className={`flex items-center gap-1 ${isActive ? 'text-white' : iconColors}`}>
                  {getCategoryIcon(category.categoryType, category.timeframe)}
                  <span className="font-semibold text-xs lg:text-sm whitespace-nowrap">
                    {category.name.replace(' Leaders', '').replace(' Champions', '')}
                  </span>
                </div>
                
                <Badge 
                  variant={getBadgeVariant(category.timeframe)} 
                  className="text-xs px-1.5 py-0.5 h-auto"
                >
                  {getTimeframeBadge(category.timeframe)}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      
      {/* Category Description */}
      {activeCategory && (
        <div className="mt-3 text-center">
          {(() => {
            const category = categories.find(c => c.id === activeCategory);
            return category ? (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}