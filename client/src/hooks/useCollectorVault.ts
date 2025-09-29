import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Types for the collector vault system
export interface GradedAssetProfile {
  id: string;
  assetId: string;
  userId: string;
  name: string;
  symbol: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  imageUrl?: string;
  
  // Grading Information
  overallGrade: number;
  conditionScore: number;
  centeringScore: number;
  cornersScore: number;
  edgesScore: number;
  surfaceScore: number;
  certificationAuthority: string;
  certificationNumber?: string;
  gradingDate: string;
  gradingNotes: string;
  
  // Rarity & Market Data
  rarityTier: 'common' | 'uncommon' | 'rare' | 'ultra_rare' | 'legendary' | 'mythic';
  rarityScore: number;
  marketDemandScore: number;
  currentMarketValue: number;
  acquisitionPrice: number;
  acquisitionDate: string;
  
  // Collection Metadata
  storageType: string;
  storageCondition: string;
  isKeyIssue: boolean;
  isFirstAppearance: boolean;
  isSigned: boolean;
  signatureAuthenticated: boolean;
  houseAffiliation?: string;
  collectorNotes?: string;
  personalRating?: number;
  displayPriority: number;
}

export interface CollectionStorageBox {
  id: string;
  userId: string;
  boxName: string;
  boxType: 'long_box' | 'short_box' | 'magazine_box' | 'display_case' | 'graded_slab_storage';
  capacity: number;
  currentCount: number;
  organizationMethod: string;
  location: string;
  condition: string;
  totalValue: number;
  averageGrade: number;
  keyIssuesCount: number;
  commonCount: number;
  uncommonCount: number;
  rareCount: number;
  ultraRareCount: number;
  legendaryCount: number;
  mythicCount: number;
}

export interface CollectionAnalytics {
  totalItems: number;
  totalValue: number;
  averageGrade: number;
  gradeDistribution: { [grade: string]: number };
  rarityDistribution: { [rarity: string]: number };
  houseDistribution: { [house: string]: number };
  keyIssuesCount: number;
  signedCount: number;
  growthRate: number;
  topPerformers: GradedAssetProfile[];
}

export interface GradingAssessmentRequest {
  assetId: string;
  gradingCriteria: {
    condition: number;
    centering: number;
    corners: number;
    edges: number;
    surface: number;
  };
  certificationAuthority?: string;
  additionalNotes?: string;
}

export interface GradingAssessmentResult {
  gradingAssessment: {
    overallGrade: number;
    conditionScore: number;
    centeringScore: number;
    cornersScore: number;
    edgesScore: number;
    surfaceScore: number;
    gradingNotes: string;
    confidence: number;
  };
  rarityAnalysis: {
    rarityTier: string;
    rarityScore: number;
    marketDemandScore: number;
    scarcityFactors: {
      ageBonus: number;
      keyIssueMultiplier: number;
      variantRarity: number;
      marketPresence: number;
    };
  };
}

export interface CreateGradedProfileRequest {
  assetId: string;
  acquisitionDate: string;
  acquisitionPrice?: number;
  storageType?: string;
  storageCondition?: string;
  variantType?: string;
  isKeyIssue?: boolean;
  isFirstAppearance?: boolean;
  isSigned?: boolean;
  collectorNotes?: string;
  houseAffiliation?: string;
}

// Main hook for collector vault operations
export function useCollectorVault() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user's graded asset profiles
  const {
    data: gradedProfiles,
    isLoading: isLoadingProfiles,
    error: profilesError
  } = useQuery<GradedAssetProfile[]>({
    queryKey: ['/api/collector/grading/profiles'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/collector/grading/profiles');
      const data = await response.json();
      return data.profiles || [];
    }
  });

  // Fetch storage boxes
  const {
    data: storageBoxes,
    isLoading: isLoadingBoxes,
    error: boxesError
  } = useQuery<CollectionStorageBox[]>({
    queryKey: ['/api/collector/storage/boxes'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/collector/storage/boxes');
      const data = await response.json();
      return data.storageBoxes || [];
    }
  });

  // Fetch collection analytics
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError
  } = useQuery<CollectionAnalytics>({
    queryKey: ['/api/collector/analytics/overview'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/collector/analytics/overview');
      const data = await response.json();
      return data.analytics;
    }
  });

  // Perform grading assessment
  const performGradingAssessment = useMutation({
    mutationFn: async (request: GradingAssessmentRequest): Promise<GradingAssessmentResult> => {
      const response = await apiRequest('POST', '/api/collector/grading/assess', request);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Grading Assessment Complete",
        description: `Asset graded at ${data.gradingAssessment.overallGrade.toFixed(1)} with ${data.rarityAnalysis.rarityTier} rarity.`,
      });
    },
    onError: (error: any) => {
      console.error('Grading assessment failed:', error);
      toast({
        title: "Assessment Failed",
        description: "Unable to perform grading assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create graded asset profile
  const createGradedProfile = useMutation({
    mutationFn: async (request: CreateGradedProfileRequest & { 
      gradingAssessment: GradingAssessmentResult['gradingAssessment'];
      rarityAnalysis: GradingAssessmentResult['rarityAnalysis'];
    }) => {
      const response = await apiRequest('POST', '/api/collector/grading/profiles', {
        assetId: request.assetId,
        gradingAssessment: request.gradingAssessment,
        rarityAnalysis: request.rarityAnalysis,
        additionalData: {
          acquisitionDate: request.acquisitionDate,
          acquisitionPrice: request.acquisitionPrice,
          storageType: request.storageType,
          storageCondition: request.storageCondition,
          variantType: request.variantType,
          isKeyIssue: request.isKeyIssue,
          isFirstAppearance: request.isFirstAppearance,
          isSigned: request.isSigned,
          collectorNotes: request.collectorNotes,
          houseAffiliation: request.houseAffiliation
        }
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/collector/grading/profiles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/collector/analytics/overview'] });
      
      toast({
        title: "Asset Graded Successfully",
        description: "Your asset has been added to the collector vault with certification.",
      });
    },
    onError: (error: any) => {
      console.error('Create graded profile failed:', error);
      toast({
        title: "Grading Failed",
        description: "Unable to create graded asset profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Re-grade asset
  const reGradeAsset = useMutation({
    mutationFn: async ({ profileId, gradingCriteria }: {
      profileId: string;
      gradingCriteria: GradingAssessmentRequest['gradingCriteria'];
    }) => {
      const response = await apiRequest('POST', `/api/collector/grading/profiles/${profileId}/regrade`, {
        gradingCriteria
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collector/grading/profiles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/collector/analytics/overview'] });
      
      toast({
        title: "Re-grading Complete",
        description: "Asset has been re-graded with updated certification.",
      });
    },
    onError: (error: any) => {
      console.error('Re-grading failed:', error);
      toast({
        title: "Re-grading Failed",
        description: "Unable to re-grade asset. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create storage box
  const createStorageBox = useMutation({
    mutationFn: async (boxData: Omit<CollectionStorageBox, 'id' | 'userId' | 'currentCount' | 'totalValue' | 'averageGrade' | 'keyIssuesCount' | 'commonCount' | 'uncommonCount' | 'rareCount' | 'ultraRareCount' | 'legendaryCount' | 'mythicCount'>) => {
      const response = await apiRequest('POST', '/api/collector/storage/boxes', boxData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collector/storage/boxes'] });
      
      toast({
        title: "Storage Box Created",
        description: "New storage box added to your collection vault.",
      });
    },
    onError: (error: any) => {
      console.error('Create storage box failed:', error);
      toast({
        title: "Creation Failed",
        description: "Unable to create storage box. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper functions for data manipulation
  const getProfilesByRarity = (rarity: string) => {
    return gradedProfiles?.filter(profile => profile.rarityTier === rarity) || [];
  };

  const getProfilesByHouse = (house: string) => {
    return gradedProfiles?.filter(profile => profile.houseAffiliation === house) || [];
  };

  const getTopValueAssets = (limit: number = 10) => {
    return gradedProfiles
      ?.sort((a, b) => b.currentMarketValue - a.currentMarketValue)
      .slice(0, limit) || [];
  };

  const getRecentAdditions = (limit: number = 10) => {
    return gradedProfiles
      ?.sort((a, b) => new Date(b.acquisitionDate).getTime() - new Date(a.acquisitionDate).getTime())
      .slice(0, limit) || [];
  };

  return {
    // Data
    gradedProfiles: gradedProfiles || [],
    storageBoxes: storageBoxes || [],
    analytics,
    
    // Loading states
    isLoading: isLoadingProfiles || isLoadingBoxes,
    isLoadingAnalytics,
    
    // Error states
    error: profilesError || boxesError || analyticsError,
    
    // Mutations
    performGradingAssessment,
    createGradedProfile,
    reGradeAsset,
    createStorageBox,
    
    // Helper functions
    getProfilesByRarity,
    getProfilesByHouse,
    getTopValueAssets,
    getRecentAdditions,
    
    // Refetch functions
    refetchProfiles: () => queryClient.invalidateQueries({ queryKey: ['/api/collector/grading/profiles'] }),
    refetchBoxes: () => queryClient.invalidateQueries({ queryKey: ['/api/collector/storage/boxes'] }),
    refetchAnalytics: () => queryClient.invalidateQueries({ queryKey: ['/api/collector/analytics/overview'] })
  };
}