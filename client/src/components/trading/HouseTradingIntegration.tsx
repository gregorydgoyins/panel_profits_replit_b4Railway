import * as React from "react";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { HouseThemedCard, HouseThemedCardHeader, HouseThemedCardContent, HouseThemedCardTitle } from "@/components/ui/house-themed-card";
import { HouseThemedButton } from "@/components/ui/house-themed-button";
import { HouseThemedChart, HouseTradingChart, HouseVolumeChart, HouseSentimentChart } from "@/components/ui/house-themed-chart";
import { houseEffects, triggerHouseAnimation, triggerHouseSound } from "@/lib/house-visual-effects";
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, Zap, 
  Shield, Crown, Clock, Users, BookOpen, Flame, 
  Star, Target, Award, BarChart3, LineChart,
  Timer, Sparkles, Eye, Lightbulb
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE TRADING BONUS INDICATORS
// ═══════════════════════════════════════════════════════════════════════════════════════

interface HouseTradingBonusIndicatorProps {
  house: MythologicalHouse;
  bonusPercentage: number;
  assetType?: string;
  isActive?: boolean;
  className?: string;
}

function HouseTradingBonusIndicator({
  house,
  bonusPercentage,
  assetType,
  isActive = false,
  className
}: HouseTradingBonusIndicatorProps) {
  const { getHouseTheme } = useHouseTheme();
  const theme = getHouseTheme(house);
  
  const getBonusIcon = (house: MythologicalHouse) => {
    const icons = {
      heroes: Shield,
      wisdom: Lightbulb,
      power: Zap,
      mystery: Eye,
      elements: Flame,
      time: Timer,
      spirit: Sparkles,
    };
    return icons[house] || Shield;
  };
  
  const Icon = getBonusIcon(house);
  
  return (
    <HouseThemedCard
      house={house}
      variant="trading"
      size="sm"
      className={cn("relative overflow-hidden", className)}
      isTrading={isActive}
      showHouseEffects={isActive}
    >
      <HouseThemedCardContent house={house} className="p-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <div className="flex-1">
            <div className="text-sm font-semibold">
              +{bonusPercentage.toFixed(1)}% {house.toUpperCase()} BONUS
            </div>
            {assetType && (
              <div className="text-xs opacity-70">
                {assetType} trades
              </div>
            )}
          </div>
          {isActive && (
            <Badge variant="outline" className="text-xs animate-pulse">
              ACTIVE
            </Badge>
          )}
        </div>
      </HouseThemedCardContent>
    </HouseThemedCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE ACHIEVEMENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════════════

interface HouseAchievement {
  id: string;
  name: string;
  description: string;
  house: MythologicalHouse;
  progress: number;
  maxProgress: number;
  reward?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
}

interface HouseAchievementCardProps {
  achievement: HouseAchievement;
  onClaim?: (achievementId: string) => void;
  className?: string;
}

function HouseAchievementCard({
  achievement,
  onClaim,
  className
}: HouseAchievementCardProps) {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
  const isComplete = achievement.progress >= achievement.maxProgress;
  const effectRef = React.useRef<HTMLDivElement>(null);
  
  // Trigger completion effects
  React.useEffect(() => {
    if (isComplete && effectRef.current) {
      triggerHouseAnimation(
        effectRef.current,
        achievement.house,
        'victoryCelebration',
        { intensity: 'high' }
      );
      triggerHouseSound(achievement.house, 'victory', effectRef.current);
    }
  }, [isComplete, achievement.house]);
  
  return (
    <HouseThemedCard
      ref={effectRef}
      house={achievement.house}
      variant="asset"
      rarity={achievement.rarity}
      className={cn("transition-all duration-300", className)}
      animation={isComplete ? "glow" : "none"}
      glowOnHover={!isComplete}
    >
      <HouseThemedCardHeader house={achievement.house}>
        <div className="flex items-center justify-between">
          <HouseThemedCardTitle house={achievement.house} className="text-lg">
            {achievement.name}
          </HouseThemedCardTitle>
          <Badge 
            variant={isComplete ? "default" : "outline"}
            className={cn(
              "text-xs",
              isComplete && "animate-pulse"
            )}
          >
            {achievement.rarity.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm opacity-80">{achievement.description}</p>
      </HouseThemedCardHeader>
      
      <HouseThemedCardContent house={achievement.house}>
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className={cn(
                "h-2",
                isComplete && "bg-gradient-to-r from-green-500 to-green-400"
              )}
            />
          </div>
          
          {/* Reward */}
          {achievement.reward && (
            <div className="text-xs">
              <span className="opacity-70">Reward: </span>
              <span className="font-medium">{achievement.reward}</span>
            </div>
          )}
          
          {/* Claim Button */}
          {isComplete && !achievement.isUnlocked && onClaim && (
            <HouseThemedButton
              house={achievement.house}
              variant="primary"
              size="sm"
              soundEffect="victory"
              onClick={() => onClaim(achievement.id)}
              className="w-full"
            >
              <Award className="w-4 h-4 mr-1" />
              CLAIM REWARD
            </HouseThemedButton>
          )}
        </div>
      </HouseThemedCardContent>
    </HouseThemedCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE MARKET SENTIMENT VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════════════

interface HouseMarketSentimentProps {
  house: MythologicalHouse;
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  confidence: number; // 0-100
  trendData: Array<{ timestamp: number; sentiment: number; }>;
  className?: string;
}

function HouseMarketSentiment({
  house,
  sentiment,
  confidence,
  trendData,
  className
}: HouseMarketSentimentProps) {
  const getSentimentConfig = () => {
    const configs = {
      bullish: {
        icon: TrendingUp,
        color: "text-green-500",
        bg: "bg-green-500/10",
        label: "BULLISH",
        description: "Strong upward momentum",
      },
      bearish: {
        icon: TrendingDown,
        color: "text-red-500",
        bg: "bg-red-500/10",
        label: "BEARISH",
        description: "Downward pressure detected",
      },
      neutral: {
        icon: Activity,
        color: "text-gray-500",
        bg: "bg-gray-500/10",
        label: "NEUTRAL",
        description: "Stable market conditions",
      },
      volatile: {
        icon: Activity,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        label: "VOLATILE",
        description: "High volatility detected",
      },
    };
    return configs[sentiment];
  };
  
  const config = getSentimentConfig();
  const Icon = config.icon;
  
  return (
    <HouseThemedCard
      house={house}
      variant="mystical"
      className={cn("relative overflow-hidden", className)}
      animation="pulse"
      showHouseEffects={true}
    >
      <HouseThemedCardHeader house={house}>
        <HouseThemedCardTitle house={house} className="text-lg flex items-center gap-2">
          <Icon className={cn("w-5 h-5", config.color)} />
          {house.toUpperCase()} SENTIMENT
        </HouseThemedCardTitle>
      </HouseThemedCardHeader>
      
      <HouseThemedCardContent house={house}>
        <div className="space-y-4">
          {/* Sentiment Badge */}
          <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-lg", config.bg)}>
            <span className={cn("font-bold text-sm", config.color)}>
              {config.label}
            </span>
            <Badge variant="outline" className="text-xs">
              {confidence}% confident
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-sm opacity-80">{config.description}</p>
          
          {/* Sentiment Chart */}
          <div className="h-32">
            <HouseSentimentChart
              house={house}
              data={trendData.map(d => ({
                timestamp: d.timestamp,
                price: 0, // Not used for sentiment
                sentiment: d.sentiment,
              }))}
              size="sm"
              marketSentiment={sentiment}
            />
          </div>
        </div>
      </HouseThemedCardContent>
    </HouseThemedCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// HOUSE TRADING DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════════════

interface HouseTradingDashboardProps {
  house: MythologicalHouse;
  tradingData: Array<{
    timestamp: number;
    price: number;
    volume?: number;
    sentiment?: number;
  }>;
  bonuses: Record<string, number>;
  achievements: HouseAchievement[];
  marketSentiment: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  sentimentConfidence: number;
  className?: string;
}

function HouseTradingDashboard({
  house,
  tradingData,
  bonuses,
  achievements,
  marketSentiment,
  sentimentConfidence,
  className
}: HouseTradingDashboardProps) {
  const sentimentData = tradingData.map(d => ({
    timestamp: d.timestamp,
    sentiment: d.sentiment || 0,
  }));
  
  const activeAchievements = achievements.filter(a => a.progress > 0 && !a.isUnlocked);
  const completedAchievements = achievements.filter(a => a.isUnlocked);
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <HouseThemedCard house={house} variant="splash" size="lg">
        <HouseThemedCardHeader house={house}>
          <HouseThemedCardTitle house={house} className="text-2xl">
            {house.toUpperCase()} TRADING COMMAND CENTER
          </HouseThemedCardTitle>
        </HouseThemedCardHeader>
      </HouseThemedCard>
      
      {/* Main Trading Chart */}
      <HouseTradingChart
        house={house}
        data={tradingData}
        size="lg"
        showVolume={true}
        marketSentiment={marketSentiment}
        tradingIndicators={true}
        trendLines={true}
        houseMultiplier={1 + (bonuses.general || 0)}
      />
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trading Bonuses */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm uppercase">Active Bonuses</h3>
          {Object.entries(bonuses).map(([type, percentage]) => (
            <HouseTradingBonusIndicator
              key={type}
              house={house}
              bonusPercentage={percentage * 100}
              assetType={type}
              isActive={true}
            />
          ))}
        </div>
        
        {/* Market Sentiment */}
        <HouseMarketSentiment
          house={house}
          sentiment={marketSentiment}
          confidence={sentimentConfidence}
          trendData={sentimentData}
        />
        
        {/* Volume Chart */}
        <div>
          <h3 className="font-semibold text-sm uppercase mb-2">Trading Volume</h3>
          <HouseVolumeChart
            house={house}
            data={tradingData}
            size="sm"
          />
        </div>
      </div>
      
      {/* Achievements */}
      {activeAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Active Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAchievements.map((achievement) => (
              <HouseAchievementCard
                key={achievement.id}
                achievement={achievement}
                onClaim={(id) => console.log(`Claiming achievement: ${id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export {
  HouseTradingBonusIndicator,
  HouseAchievementCard,
  HouseMarketSentiment,
  HouseTradingDashboard,
  type HouseAchievement,
};