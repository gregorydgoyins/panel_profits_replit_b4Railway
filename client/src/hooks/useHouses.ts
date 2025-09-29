import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { MythologicalHouse } from '@/contexts/HouseThemeContext';

export interface House {
  id: string;
  name: string;
  description: string;
  specialization: string;
  bonuses: {
    characterTrades?: number;
    tradingFees?: number;
    earlyAccess?: string[];
    aiInsights?: number;
    creatorTrades?: number;
    researchSpeed?: number;
    tradingLimits?: number;
    premiumAccess?: boolean;
    rareTrades?: number;
    predictionAccuracy?: number;
    crossUniverseBonuses?: number;
    portfolioBalance?: number;
    elementalStacking?: boolean;
    vintageAssets?: number;
    timeBasedKarma?: number;
    historicalInsights?: number;
    socialTradingBonus?: number;
    sentimentAccuracy?: number;
    communityKarma?: number;
  };
  karmaMultiplier: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon: string;
  memberCount?: number;
  topTraders?: any[];
}

export interface HouseMember {
  id: string;
  name: string;
  email: string;
  karma: number;
  rank: number;
  totalTradingProfit: number;
  tradingStreakDays: number;
  joinedAt: string;
}

export interface UserHouseStatus {
  hasHouse: boolean;
  house?: House & {
    userRank: number;
    userKarma: number;
  };
  message?: string;
}

export interface HouseBonuses {
  house: string;
  specialization: string;
  bonuses: House['bonuses'] & {
    karmaMultiplier: number;
    currentKarmaBonus: number;
    totalMultiplier: number;
  };
  userKarma: number;
}

// Get all houses with their details
export function useHouses() {
  return useQuery<{ success: boolean; houses: House[]; count: number }>({
    queryKey: ['/api/houses'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get specific house details
export function useHouse(houseId: string) {
  return useQuery<{ success: boolean; house: House }>({
    queryKey: ['/api/houses', houseId],
    enabled: !!houseId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get house members and rankings
export function useHouseMembers(houseId: string, limit = 20) {
  return useQuery<{
    success: boolean;
    house: string;
    members: HouseMember[];
    memberCount: number;
    hasMore: boolean;
  }>({
    queryKey: ['/api/houses', houseId, 'members', { limit }],
    enabled: !!houseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get user's current house status
export function useUserHouseStatus() {
  return useQuery<UserHouseStatus>({
    queryKey: ['/api/houses/my-house'],
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get house bonuses for specific house
export function useHouseBonuses(houseId: string) {
  return useQuery<{ success: boolean } & HouseBonuses>({
    queryKey: ['/api/houses', houseId, 'bonuses'],
    enabled: !!houseId,
    staleTime: 5 * 60 * 1000,
  });
}

// Join a house mutation
export function useJoinHouse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (houseId: string) => {
      const response = await apiRequest('POST', `/api/houses/${houseId}/join`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "House Joined Successfully!",
        description: data.message || `Welcome to your new house!`,
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/houses/my-house'] });
      queryClient.invalidateQueries({ queryKey: ['/api/houses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Join House",
        description: error.message || "An error occurred while joining the house.",
        variant: "destructive",
      });
    },
  });
}

// Helper hook to check if user can join houses
export function useCanJoinHouse() {
  const { data: houseStatus } = useUserHouseStatus();
  return !houseStatus?.hasHouse;
}

// Get house competition leaderboard
export function useHouseLeaderboard(metric: string = 'karma', period: string = 'week') {
  return useQuery<{
    success: boolean;
    metric: string;
    period: string;
    leaderboard: Array<{
      house: string;
      name: string;
      specialization: string;
      totalMembers: number;
      totalKarma: number;
      avgKarmaPerMember: number;
      weeklyGrowth: number;
      topTraderKarma: number;
      achievements: number;
      competitionRank: number;
    }>;
    lastUpdated: string;
    totalHouses: number;
  }>({
    queryKey: ['/api/houses/leaderboard', { metric, period }],
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get specific house competition data
export function useHouseCompetition(houseId: string) {
  return useQuery<{
    success: boolean;
    house: string;
    data: {
      name: string;
      specialization: string;
      totalMembers: number;
      totalKarma: number;
      avgKarmaPerMember: number;
      weeklyGrowth: number;
      topTraderKarma: number;
      achievements: number;
      lastUpdated: string;
    };
  }>({
    queryKey: ['/api/houses', houseId, 'competition'],
    enabled: !!houseId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get house-specific asset recommendations
export function useHouseAssetRecommendations(
  houseId: string, 
  options?: { 
    limit?: number; 
    category?: 'all' | 'specialty' | 'trending'; 
  }
) {
  return useQuery<{
    success: boolean;
    house: string;
    houseName: string;
    specialization: string;
    category: string;
    recommendations: Array<{
      id: string;
      name: string;
      type: string;
      currentPrice: number;
      priceChange: number;
      houseBonus: number;
      confidence: number;
      reason: string;
      specialization: string;
      isSpecialtyMatch: boolean;
    }>;
    totalRecommendations: number;
    lastUpdated: string;
  }>({
    queryKey: ['/api/houses', houseId, 'recommendations', options],
    enabled: !!houseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Helper hook to get house recommendations based on trading preferences
export function useHouseRecommendations(tradingPreferences?: {
  preferredAssetTypes?: string[];
  riskTolerance?: string;
  tradingFrequency?: string;
}) {
  const { data: housesData } = useHouses();
  
  if (!housesData?.houses || !tradingPreferences) {
    return [];
  }

  // Simple recommendation logic based on asset preferences
  const recommendations = housesData.houses.map(house => {
    let score = 0;
    
    if (tradingPreferences.preferredAssetTypes?.includes('characters') && house.id === 'heroes') {
      score += 3;
    }
    if (tradingPreferences.preferredAssetTypes?.includes('creators') && house.id === 'wisdom') {
      score += 3;
    }
    if (tradingPreferences.preferredAssetTypes?.includes('publishers') && house.id === 'power') {
      score += 3;
    }
    if (tradingPreferences.preferredAssetTypes?.includes('rare') && house.id === 'mystery') {
      score += 3;
    }
    if (tradingPreferences.preferredAssetTypes?.includes('multi-universe') && house.id === 'elements') {
      score += 3;
    }
    if (tradingPreferences.preferredAssetTypes?.includes('historical') && house.id === 'time') {
      score += 3;
    }
    if (tradingPreferences.preferredAssetTypes?.includes('social') && house.id === 'spirit') {
      score += 3;
    }

    // Risk tolerance scoring
    if (tradingPreferences.riskTolerance === 'aggressive' && house.id === 'mystery') {
      score += 2;
    }
    if (tradingPreferences.riskTolerance === 'conservative' && house.id === 'wisdom') {
      score += 2;
    }
    if (tradingPreferences.riskTolerance === 'moderate' && house.id === 'heroes') {
      score += 2;
    }

    return { house, score };
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.house);
}