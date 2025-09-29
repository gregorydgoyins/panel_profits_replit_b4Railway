import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, TrendingUp, Shield, BookOpen, Crown, Zap, 
  Flame, Clock, Users, Target, ArrowRight, Eye,
  DollarSign, BarChart3, Info
} from 'lucide-react';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import { useUserHouseStatus, useHouseAssetRecommendations } from '@/hooks/useHouses';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

interface AssetRecommendation {
  id: string;
  name: string;
  type: string;
  currentPrice: number;
  priceChange: number;
  houseBonus: number;
  confidence: number;
  reason: string;
  specialization: string;
}

interface HouseAssetRecommendationsProps {
  className?: string;
  limit?: number;
  showFullInterface?: boolean;
}

export function HouseAssetRecommendations({ 
  className = "",
  limit = 5,
  showFullInterface = false
}: HouseAssetRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'specialty' | 'trending'>('specialty');
  const { data: userHouseStatus } = useUserHouseStatus();
  const { getCurrentHouseColorClass } = useHouseTheme();

  const house = userHouseStatus?.house;
  
  // Get real recommendations from API
  const { data: recommendationsData, isLoading } = useHouseAssetRecommendations(
    house?.id || '', 
    { limit, category: selectedCategory }
  );

  if (!userHouseStatus?.hasHouse) {
    return (
      <Card className={`border-muted ${className}`}>
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h3 className="font-medium mb-1">Join a House for Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Get personalized asset recommendations based on your house specialization
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!house) {
    return null;
  }

  // Use real API data instead of mock data
  const recommendations = recommendationsData?.recommendations?.slice(0, limit) || [];

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'Character Assets': return Shield;
      case 'Creator Assets': return BookOpen;
      case 'Publisher Assets': return Crown;
      case 'Rare Assets': return Zap;
      case 'Multi-Universe Assets': return Flame;
      case 'Historical Assets': return Clock;
      case 'Social Assets': return Users;
      default: return Star;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 75) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const SpecIcon = getSpecializationIcon(house.specialization);

  if (showFullInterface) {
    return (
      <Card className={className} data-testid="house-asset-recommendations-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <HouseEmblem house={house.id as MythologicalHouse} size="lg" variant="solid" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>House Recommendations</span>
                <HouseBadge house={house.id as MythologicalHouse} size="sm" />
              </div>
              <div className="text-sm font-normal text-muted-foreground">
                Powered by {house.specialization} expertise
              </div>
            </div>
            <Target className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specialty" data-testid="tab-specialty">House Specialty</TabsTrigger>
              <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All Assets</TabsTrigger>
            </TabsList>

            <TabsContent value="specialty" className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <SpecIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Optimized for {house.specialization} (+{Math.round((house.bonuses.characterTrades || house.bonuses.creatorTrades || 0.1) * 100)}% bonus)
                </span>
              </div>
              
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="animate-spin h-8 w-8 mx-auto mb-2 border-2 border-current border-t-transparent rounded-full opacity-50" />
                    <p>Loading house recommendations...</p>
                  </div>
                ) : recommendations.length > 0 ? (
                  recommendations.map((asset) => (
                  <div 
                    key={asset.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    data-testid={`recommendation-${asset.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{asset.name}</h4>
                        <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{asset.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${asset.currentPrice}</span>
                          <span className={getPriceChangeColor(asset.priceChange)}>
                            {asset.priceChange > 0 ? '+' : ''}{asset.priceChange}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-primary" />
                          <span>+{asset.houseBonus}% bonus</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className={`text-sm font-medium ${getConfidenceColor(asset.confidence)}`}>
                        {asset.confidence}% confidence
                      </div>
                      <Button size="sm" variant="outline">
                        View Asset
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p>No recommendations available for your house</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Trending recommendations coming soon!</p>
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All asset recommendations coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-testid="house-asset-recommendations">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SpecIcon className="h-5 w-5 text-primary" />
          House Recommendations
          <HouseBadge house={house.id as MythologicalHouse} size="sm" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((asset) => (
            <div 
              key={asset.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              data-testid={`recommendation-compact-${asset.id}`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{asset.name}</div>
                <div className="text-xs text-muted-foreground">{asset.reason}</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">${asset.currentPrice}</div>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-2 w-2 text-primary" />
                  <span className="text-primary">+{asset.houseBonus}%</span>
                </div>
              </div>
            </div>
          ))
        ) : isLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            <div className="animate-spin h-6 w-6 mx-auto mb-2 border-2 border-current border-t-transparent rounded-full opacity-50" />
            <p className="text-sm">Loading recommendations...</p>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recommendations available</p>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <Button variant="outline" size="sm" className="w-full mt-3">
            <Eye className="h-3 w-3 mr-1" />
            View All Recommendations
          </Button>
        )}
      </CardContent>
    </Card>
  );
}