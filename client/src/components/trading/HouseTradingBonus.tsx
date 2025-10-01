import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Gift, Star, TrendingUp, DollarSign, Zap, 
  Shield, Crown, Clock, Users, BookOpen,
  Flame, Info, ArrowUp, Target
} from 'lucide-react';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import { useUserHouseStatus, useHouseBonuses } from '@/hooks/useHouses';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface HouseTradingBonusProps {
  assetType?: string;
  tradeAmount?: number;
  showMinimized?: boolean;
  className?: string;
}

export function HouseTradingBonus({ 
  assetType,
  tradeAmount,
  showMinimized = false,
  className = ""
}: HouseTradingBonusProps) {
  const { data: userHouseStatus } = useUserHouseStatus();
  const { data: houseBonuses } = useHouseBonuses(userHouseStatus?.house?.id || '');
  const { getCurrentHouseColorClass } = useHouseTheme();

  if (!userHouseStatus?.hasHouse || !houseBonuses) {
    return (
      <Card className={`border-muted ${className}`}>
        <CardContent className="p-4 text-center">
          <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Join a house to unlock trading bonuses</p>
        </CardContent>
      </Card>
    );
  }

  const house = userHouseStatus.house!;
  const bonuses = houseBonuses.bonuses;

  const getApplicableBonuses = () => {
    const applicable = [];
    
    // Asset-specific bonuses
    if (assetType === 'character' && bonuses.characterTrades) {
      applicable.push({
        name: 'Character Trading Bonus',
        value: `+${Math.round(bonuses.characterTrades * 100)}%`,
        description: 'Success rate increase for character trades',
        icon: Shield
      });
    }
    
    if (assetType === 'creator' && bonuses.creatorTrades) {
      applicable.push({
        name: 'Creator Trading Bonus',
        value: `+${Math.round(bonuses.creatorTrades * 100)}%`,
        description: 'Success rate increase for creator trades',
        icon: BookOpen
      });
    }
    
    if (assetType === 'rare' && bonuses.rareTrades) {
      applicable.push({
        name: 'Rare Asset Bonus',
        value: `+${Math.round(bonuses.rareTrades * 100)}%`,
        description: 'Success rate increase for rare asset trades',
        icon: Zap
      });
    }

    // Universal bonuses
    if (bonuses.tradingFees) {
      applicable.push({
        name: 'Fee Reduction',
        value: `${Math.round((1 - bonuses.tradingFees) * 100)}%`,
        description: 'Reduced trading fees',
        icon: DollarSign
      });
    }

    if (bonuses.tradingLimits && bonuses.tradingLimits > 1) {
      applicable.push({
        name: 'Higher Limits',
        value: `${bonuses.tradingLimits}x`,
        description: 'Increased trading limits',
        icon: TrendingUp
      });
    }

    if (bonuses.karmaMultiplier > 1) {
      applicable.push({
        name: 'XP Multiplier',
        value: `${bonuses.karmaMultiplier}x`,
        description: 'Experience gain multiplier from trades',
        icon: Star
      });
    }

    return applicable;
  };

  const applicableBonuses = getApplicableBonuses();
  const estimatedSavings = tradeAmount && bonuses.tradingFees 
    ? tradeAmount * (1 - bonuses.tradingFees) - tradeAmount
    : 0;

  if (showMinimized) {
    return (
      <div className={`flex items-center gap-2 p-2 bg-primary/10 rounded-lg border ${className}`}>
        <HouseEmblem house={house.id as MythologicalHouse} size="sm" variant="solid" />
        <div className="flex-1">
          <div className="text-sm font-medium">House Bonuses Active</div>
          <div className="text-xs text-muted-foreground">
            {applicableBonuses.length} bonuses applied
          </div>
        </div>
        <Badge variant="outline">{house.karmaMultiplier}x</Badge>
      </div>
    );
  }

  return (
    <Card className={`${className}`} data-testid="house-trading-bonus">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <HouseEmblem house={house.id as MythologicalHouse} size="default" variant="solid" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span>House Trading Bonuses</span>
              <HouseBadge house={house.id as MythologicalHouse} size="sm" />
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {house.specialization} • Rank #{house.userRank}
            </div>
          </div>
          <Gift className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {applicableBonuses.length > 0 ? (
          <>
            <div className="space-y-3">
              {applicableBonuses.map((bonus, index) => {
                const IconComponent = bonus.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    data-testid={`bonus-${bonus.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{bonus.name}</div>
                        <div className="text-xs text-muted-foreground">{bonus.description}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      {bonus.value}
                    </Badge>
                  </div>
                );
              })}
            </div>

            {estimatedSavings > 0 && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Estimated Savings</span>
                  </div>
                  <span className="font-bold text-green-500">
                    ${Math.abs(estimatedSavings).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  On this trade compared to standard fees
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience Progress</span>
                <span className="font-medium">{house.userKarma} / {(house.userRank + 1) * 1000}</span>
              </div>
              <Progress 
                value={(house.userKarma % 1000) / 10} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                Next rank: {Math.max(0, (house.userRank + 1) * 1000 - house.userKarma)} experience needed
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No applicable bonuses for this trade type</p>
            <p className="text-xs">
              Trade {house.specialization.toLowerCase()} for maximum bonuses
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}