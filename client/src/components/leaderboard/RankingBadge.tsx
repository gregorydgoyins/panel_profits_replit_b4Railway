import { Crown, Medal, Award, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RankingBadgeProps {
  rank: number;
  change?: number; // Position change from previous period
  size?: 'sm' | 'md' | 'lg';
  showChange?: boolean;
}

export function RankingBadge({ rank, change, size = 'md', showChange = true }: RankingBadgeProps) {
  const getRankIcon = () => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank === 2) return <Medal className="h-4 w-4" />;
    if (rank === 3) return <Award className="h-4 w-4" />;
    if (rank <= 10) return <Trophy className="h-3 w-3" />;
    return null;
  };

  const getRankColors = () => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-orange-700 text-white border-amber-500';
    if (rank <= 10) return 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-400';
    return 'bg-slate-700 text-slate-300 border-slate-600';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs min-w-[2rem]';
      case 'lg': return 'px-4 py-2 text-lg min-w-[3rem]';
      default: return 'px-3 py-1.5 text-sm min-w-[2.5rem]';
    }
  };

  const getChangeIndicator = () => {
    if (!showChange || change === undefined || change === 0) return null;
    
    if (change > 0) {
      return (
        <span className="ml-1 text-green-400 text-xs" data-testid="rank-change-up">
          ↑{change}
        </span>
      );
    } else {
      return (
        <span className="ml-1 text-red-400 text-xs" data-testid="rank-change-down">
          ↓{Math.abs(change)}
        </span>
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        className={cn(
          'flex items-center gap-1 font-bold border-2 shadow-lg',
          getRankColors(),
          getSizeClasses()
        )}
        data-testid={`ranking-badge-${rank}`}
      >
        {getRankIcon()}
        #{rank}
      </Badge>
      {getChangeIndicator()}
    </div>
  );
}