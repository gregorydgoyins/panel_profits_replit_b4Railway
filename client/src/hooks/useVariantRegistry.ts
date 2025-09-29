import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Types for the variant registry system
export interface VariantCover {
  id: string;
  baseAssetId: string;
  variantIdentifier: string;
  variantName: string;
  coverArtist?: string;
  variantType: 'retailer' | 'convention' | 'artist' | 'incentive' | 'sketch';
  printRun?: number;
  incentiveRatio?: string;
  exclusiveRetailer?: string;
  releaseDate?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  backCoverUrl?: string;
  baseRarityMultiplier: number;
  currentPremium: number;
  description?: string;
  specialFeatures?: string[];
}

export interface VariantDiscovery {
  variants: VariantCover[];
  totalVariants: number;
  rarityDistribution: {
    [key: string]: number;
  };
  marketSummary: {
    averagePremium: number;
    highestPremium: number;
    mostValuableVariant: VariantCover | null;
  };
}

export interface VariantTradingCardData {
  frontData: {
    name: string;
    artist: string;
    rarity: string;
    powerLevel: number;
    specialAbilities: string[];
    imageUrl: string;
  };
  backData: {
    lore: string;
    stats: {
      scarcity: number;
      demand: number;
      artistry: number;
      collectibility: number;
    };
    marketValue: number;
    lastSale: string;
  };
  holographicEffect: boolean;
  animationTriggers: string[];
}

export interface VariantMarketTrends {
  priceHistory: Array<{
    date: Date;
    price: number;
    volume: number;
  }>;
  trendAnalysis: {
    direction: 'up' | 'down' | 'stable';
    changePercent: number;
    volatility: number;
    momentum: number;
  };
}

export interface CatalogVariantRequest {
  baseAssetId: string;
  variantData: {
    variantIdentifier: string;
    variantName: string;
    coverArtist?: string;
    variantType: string;
    printRun?: number;
    incentiveRatio?: string;
    exclusiveRetailer?: string;
    releaseDate?: string;
    coverImageUrl?: string;
    thumbnailUrl?: string;
    backCoverUrl?: string;
    description?: string;
    specialFeatures?: string[];
  };
  marketData?: {
    baseAssetPrice: number;
    variantPrice: number;
    recentSales?: Array<{
      price: number;
      date: string;
      marketplace: string;
    }>;
  };
}

export interface VariantSearchCriteria {
  variantType?: string;
  coverArtist?: string;
  publisher?: string;
  minRarity?: string;
  maxPrice?: number;
  hasSpecialFeatures?: boolean;
}

// Main hook for variant registry operations
export function useVariantRegistry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Discover variants for a base asset
  const useDiscoverVariants = (baseAssetId: string | null) => {
    return useQuery<VariantDiscovery>({
      queryKey: ['/api/collector/variants/discover', baseAssetId],
      queryFn: async () => {
        if (!baseAssetId) throw new Error('Base asset ID required');
        
        const response = await apiRequest('GET', `/api/collector/variants/discover/${baseAssetId}`);
        return response.json();
      },
      enabled: !!baseAssetId
    });
  };

  // Search variants by criteria
  const useSearchVariants = (searchCriteria: VariantSearchCriteria) => {
    return useQuery<VariantCover[]>({
      queryKey: ['/api/collector/variants/search', searchCriteria],
      queryFn: async () => {
        const params = new URLSearchParams();
        Object.entries(searchCriteria).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        
        const response = await apiRequest('GET', `/api/collector/variants/search?${params.toString()}`);
        const data = await response.json();
        return data.variants || [];
      }
    });
  };

  // Get variant market trends
  const useVariantMarketTrends = (variantId: string | null, timeframe: '1w' | '1m' | '3m' | '6m' | '1y' = '3m') => {
    return useQuery<VariantMarketTrends>({
      queryKey: ['/api/collector/variants', variantId, 'trends', timeframe],
      queryFn: async () => {
        if (!variantId) throw new Error('Variant ID required');
        
        const response = await apiRequest('GET', `/api/collector/variants/${variantId}/trends?timeframe=${timeframe}`);
        const data = await response.json();
        return data.trends;
      },
      enabled: !!variantId
    });
  };

  // Get trading card data for variant
  const useVariantTradingCard = (variantId: string | null) => {
    return useQuery<VariantTradingCardData>({
      queryKey: ['/api/collector/variants', variantId, 'trading-card'],
      queryFn: async () => {
        if (!variantId) throw new Error('Variant ID required');
        
        const response = await apiRequest('GET', `/api/collector/variants/${variantId}/trading-card`);
        const data = await response.json();
        return data.tradingCard;
      },
      enabled: !!variantId
    });
  };

  // Catalog new variant
  const catalogVariant = useMutation({
    mutationFn: async (request: CatalogVariantRequest): Promise<VariantCover> => {
      const response = await apiRequest('POST', '/api/collector/variants', request);
      const data = await response.json();
      return data.variant;
    },
    onSuccess: (variant) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['/api/collector/variants/discover', variant.baseAssetId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/collector/variants/search'] 
      });
      
      toast({
        title: "Variant Cataloged",
        description: `${variant.variantName} has been added to the variant registry.`,
      });
    },
    onError: (error: any) => {
      console.error('Catalog variant failed:', error);
      toast({
        title: "Cataloging Failed",
        description: "Unable to catalog variant. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update variant valuation
  const updateVariantValuation = useMutation({
    mutationFn: async ({ variantId, marketData }: {
      variantId: string;
      marketData: {
        baseAssetPrice: number;
        variantPrice: number;
        recentSales: Array<{
          price: number;
          date: string;
          marketplace: string;
        }>;
      };
    }) => {
      const response = await apiRequest('PATCH', `/api/collector/variants/${variantId}/valuation`, {
        marketData
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['/api/collector/variants/discover'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/collector/variants/search'] 
      });
      
      toast({
        title: "Valuation Updated",
        description: "Variant market valuation has been refreshed with latest data.",
      });
    },
    onError: (error: any) => {
      console.error('Update valuation failed:', error);
      toast({
        title: "Update Failed",
        description: "Unable to update variant valuation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const getVariantsByType = (variants: VariantCover[], type: string) => {
    return variants.filter(variant => variant.variantType === type);
  };

  const getVariantsByArtist = (variants: VariantCover[], artist: string) => {
    return variants.filter(variant => 
      variant.coverArtist?.toLowerCase().includes(artist.toLowerCase())
    );
  };

  const getTopValueVariants = (variants: VariantCover[], limit: number = 10) => {
    return [...variants]
      .sort((a, b) => b.currentPremium - a.currentPremium)
      .slice(0, limit);
  };

  const getIncentiveVariants = (variants: VariantCover[]) => {
    return variants.filter(variant => 
      variant.variantType === 'incentive' && variant.incentiveRatio
    );
  };

  const calculateRarityScore = (variant: VariantCover) => {
    let score = 0;
    
    // Base rarity from multiplier
    score += Math.min(50, variant.baseRarityMultiplier * 10);
    
    // Print run scarcity
    if (variant.printRun) {
      if (variant.printRun < 100) score += 40;
      else if (variant.printRun < 500) score += 30;
      else if (variant.printRun < 1000) score += 20;
      else if (variant.printRun < 5000) score += 10;
    }
    
    // Incentive ratio bonus
    if (variant.incentiveRatio) {
      const ratio = parseInt(variant.incentiveRatio.split(':')[1] || '1');
      score += Math.min(30, 100 / ratio);
    }
    
    // Special features bonus
    if (variant.specialFeatures && variant.specialFeatures.length > 0) {
      score += variant.specialFeatures.length * 5;
    }
    
    return Math.min(100, score);
  };

  const getRarityTier = (score: number): string => {
    if (score >= 95) return 'Mythic';
    if (score >= 85) return 'Legendary';
    if (score >= 70) return 'Epic';
    if (score >= 55) return 'Rare';
    if (score >= 35) return 'Uncommon';
    return 'Common';
  };

  return {
    // Query hooks
    useDiscoverVariants,
    useSearchVariants,
    useVariantMarketTrends,
    useVariantTradingCard,
    
    // Mutation hooks
    catalogVariant,
    updateVariantValuation,
    
    // Helper functions
    getVariantsByType,
    getVariantsByArtist,
    getTopValueVariants,
    getIncentiveVariants,
    calculateRarityScore,
    getRarityTier,
    
    // Refetch function
    refetchVariants: (baseAssetId?: string) => {
      if (baseAssetId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/collector/variants/discover', baseAssetId] 
        });
      }
      queryClient.invalidateQueries({ 
        queryKey: ['/api/collector/variants/search'] 
      });
    }
  };
}