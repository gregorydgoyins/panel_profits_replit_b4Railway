import { Star, Zap, Target, TrendingUp, Shield, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { UserAchievement } from '@shared/schema';

interface AchievementBadgesProps {
  achievements: UserAchievement[];
  maxDisplay?: number;
  showTooltips?: boolean;
}

export function AchievementBadges({ achievements, maxDisplay = 3, showTooltips = true }: AchievementBadgesProps) {
  const getAchievementIcon = (achievementId: string) => {
    switch (achievementId) {
      case 'first_trade': return <Star className="h-3 w-3" />;
      case 'profitable_streak': return <Flame className="h-3 w-3" />;
      case 'volume_milestone': return <TrendingUp className="h-3 w-3" />;
      case 'win_rate_achievement': return <Target className="h-3 w-3" />;
      case 'portfolio_milestone': return <Shield className="h-3 w-3" />;
      case 'trading_frequency': return <Zap className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const getAchievementColor = (achievementId: string) => {
    switch (achievementId) {
      case 'first_trade': return 'bg-blue-600 text-white border-blue-400';
      case 'profitable_streak': return 'bg-red-600 text-white border-red-400';
      case 'volume_milestone': return 'bg-green-600 text-white border-green-400';
      case 'win_rate_achievement': return 'bg-purple-600 text-white border-purple-400';
      case 'portfolio_milestone': return 'bg-amber-600 text-white border-amber-400';
      case 'trading_frequency': return 'bg-cyan-600 text-white border-cyan-400';
      default: return 'bg-gray-600 text-white border-gray-400';
    }
  };

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const displayedAchievements = achievements.slice(0, maxDisplay);
  const remainingCount = achievements.length - maxDisplay;

  const AchievementBadge = ({ achievement }: { achievement: UserAchievement }) => (
    <Badge 
      className={`flex items-center gap-1 text-xs font-medium border px-2 py-1 ${getAchievementColor(achievement.achievementId)}`}
      data-testid={`achievement-badge-${achievement.achievementId}`}
    >
      {getAchievementIcon(achievement.achievementId)}
      {achievement.title}
    </Badge>
  );

  return (
    <div className="flex items-center gap-1 flex-wrap" data-testid="achievement-badges-container">
      {displayedAchievements.map((achievement) => {
        if (showTooltips) {
          return (
            <Tooltip key={achievement.id}>
              <TooltipTrigger>
                <AchievementBadge achievement={achievement} />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="p-2">
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        }
        return <AchievementBadge key={achievement.id} achievement={achievement} />;
      })}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}