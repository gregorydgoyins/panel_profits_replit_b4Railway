import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, TrendingUp, Shield, Crown, BookOpen, Zap, 
  Flame, Clock, Star, Award, ArrowRight, Info,
  BarChart3, Target, Heart, DollarSign
} from 'lucide-react';
import { useHouses, useJoinHouse, useCanJoinHouse, useUserHouseStatus } from '@/hooks/useHouses';
import { HouseEmblem } from '@/components/ui/house-emblem';
import { HouseBadge } from '@/components/ui/house-badge';
import { HouseSelector } from '@/components/ui/house-selector';
import { useHouseTheme } from '@/hooks/useHouseTheme';
import { getHouseIcon } from '@/lib/houseIcons';
import { useToast } from '@/hooks/use-toast';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

export default function HouseSelection() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedHouse, setSelectedHouse] = useState<MythologicalHouse | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  const { data: housesData, isLoading } = useHouses();
  const { data: userHouseStatus } = useUserHouseStatus();
  const joinHouseMutation = useJoinHouse();
  const canJoinHouse = useCanJoinHouse();
  const { houseTheme, setCurrentHouse } = useHouseTheme();

  const houses = housesData?.houses || [];

  const handleJoinHouse = async (houseId: string) => {
    if (!canJoinHouse) {
      toast({
        title: "Already in a House",
        description: "You're already a member of a house.",
        variant: "destructive"
      });
      return;
    }

    try {
      await joinHouseMutation.mutateAsync(houseId);
      setCurrentHouse(houseId as MythologicalHouse);
      setLocation('/houses/dashboard');
    } catch (error) {
      console.error('Failed to join house:', error);
    }
  };

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

  const formatBonus = (key: string, value: any) => {
    if (typeof value === 'number') {
      if (key.includes('Fee') || key.includes('Multiplier')) {
        return `${Math.round((1 - value) * 100)}% reduction`;
      }
      if (key.includes('Limit')) {
        return `${value}x increase`;
      }
      return `+${Math.round(value * 100)}%`;
    }
    if (typeof value === 'boolean') {
      return value ? 'Enabled' : 'Disabled';
    }
    if (Array.isArray(value)) {
      return `${value.length} perks`;
    }
    return value.toString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Mythological House</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each house specializes in different types of trading assets and offers unique bonuses. 
          Choose wisely, as your house will shape your trading journey.
        </p>
        
        {userHouseStatus?.hasHouse && (
          <div className="bg-card border rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              You're already a member of <HouseBadge house={userHouseStatus.house?.id as MythologicalHouse} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" data-testid="tab-overview">House Overview</TabsTrigger>
          <TabsTrigger value="comparison" data-testid="tab-comparison">Compare Houses</TabsTrigger>
          <TabsTrigger value="selection" data-testid="tab-selection">Make Selection</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {houses.map((house) => {
              const IconComponent = getHouseIcon(house.id as MythologicalHouse);
              const SpecIcon = getSpecializationIcon(house.specialization);
              
              return (
                <Card 
                  key={house.id} 
                  className="hover-elevate cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedHouse(house.id as MythologicalHouse)}
                  data-testid={`house-card-${house.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <HouseEmblem 
                        house={house.id as MythologicalHouse}
                        size="lg"
                        variant="solid"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{house.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <SpecIcon className="h-3 w-3" />
                          {house.specialization}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{house.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Karma Multiplier</span>
                        <Badge variant="outline">
                          {house.karmaMultiplier}x
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Members</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{house.memberCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Bonuses</h4>
                      <div className="space-y-1">
                        {Object.entries(house.bonuses).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-medium">
                              {formatBonus(key, value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {canJoinHouse && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinHouse(house.id);
                        }}
                        disabled={joinHouseMutation.isPending}
                        data-testid={`button-join-${house.id}`}
                      >
                        {joinHouseMutation.isPending ? 'Joining...' : 'Join House'}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">House</th>
                  <th className="text-left p-4 font-medium">Specialization</th>
                  <th className="text-left p-4 font-medium">Karma Multiplier</th>
                  <th className="text-left p-4 font-medium">Key Bonuses</th>
                  <th className="text-left p-4 font-medium">Members</th>
                  {canJoinHouse && <th className="text-left p-4 font-medium">Action</th>}
                </tr>
              </thead>
              <tbody>
                {houses.map((house) => (
                  <tr key={house.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <HouseEmblem 
                          house={house.id as MythologicalHouse}
                          size="sm"
                          variant="solid"
                        />
                        <span className="font-medium">{house.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{house.specialization}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{house.karmaMultiplier}x</Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        {Object.entries(house.bonuses).slice(0, 2).map(([key, value]) => (
                          <div key={key}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}: {formatBonus(key, value)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{house.memberCount || 0}</span>
                      </div>
                    </td>
                    {canJoinHouse && (
                      <td className="p-4">
                        <Button 
                          size="sm"
                          onClick={() => handleJoinHouse(house.id)}
                          disabled={joinHouseMutation.isPending}
                          data-testid={`button-join-table-${house.id}`}
                        >
                          Join
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Selection Tab */}
        <TabsContent value="selection" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Interactive House Selection</h2>
              <p className="text-muted-foreground">
                Use the selector below to choose your house, or explore the grid view for detailed comparison.
              </p>
            </div>

            {canJoinHouse ? (
              <div className="space-y-8">
                <HouseSelector 
                  variant="grid"
                  onHouseSelect={(house) => {
                    setSelectedHouse(house);
                    handleJoinHouse(house);
                  }}
                  className="w-full"
                />
                
                {selectedHouse && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <HouseEmblem house={selectedHouse} size="lg" />
                        Ready to join {houses.find(h => h.id === selectedHouse)?.name}?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleJoinHouse(selectedHouse)}
                          disabled={joinHouseMutation.isPending}
                          data-testid={`button-confirm-join-${selectedHouse}`}
                        >
                          {joinHouseMutation.isPending ? 'Joining...' : 'Confirm and Join'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedHouse(null)}
                          data-testid="button-cancel-selection"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Already a House Member</h3>
                  <p className="text-muted-foreground mb-4">
                    You're currently a member of a house. Visit your dashboard to manage your membership.
                  </p>
                  <Button onClick={() => setLocation('/houses/dashboard')} data-testid="button-go-to-dashboard">
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}