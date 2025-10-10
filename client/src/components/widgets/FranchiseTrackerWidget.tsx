import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, TrendingDown, DollarSign, Trophy, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FranchiseVariant {
  id: string;
  variantName: string;
  realName: string;
  imageUrl: string | null;
  universe: string; // Earth-616, Earth-1610, etc.
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  tradingVolume: number;
  firstAppearance: string;
  popularity: number; // 1-100
}

interface FranchiseFamily {
  id: string;
  franchiseName: string; // "Spider-Man", "Batman", "Wolverine"
  publisher: string;
  totalVariants: number;
  totalMarketCap: number;
  avgPriceChange: number;
  variants: FranchiseVariant[];
}

export function FranchiseTrackerWidget() {
  const { data: franchises, isLoading } = useQuery<FranchiseFamily[]>({
    queryKey: ['/api/franchises/tracker'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="relative bg-[#1A1F2E] border border-orange-900/30 rounded-md overflow-hidden markets-rimlight-hover">
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-orange-900/30">
          <div className="flex items-center gap-2 text-orange-100 font-light tracking-wider uppercase text-sm">
            <Users className="h-4 w-4" />
            Franchise Tracker
          </div>
        </div>

        <div className="relative p-6">
          <div className="text-orange-300/50 text-sm font-light">Loading franchise variants...</div>
        </div>
      </div>
    );
  }

  if (!franchises || franchises.length === 0) {
    return (
      <div className="relative bg-[#1A1F2E] border border-orange-900/30 rounded-md overflow-hidden markets-rimlight-hover">
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-orange-900/30">
          <div className="flex items-center gap-2 text-orange-100 font-light tracking-wider uppercase text-sm">
            <Users className="h-4 w-4" />
            Franchise Tracker
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-orange-500/30 mb-4" />
          <p className="text-orange-300/60 text-sm font-light">
            No franchise data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#1A1F2E] border border-orange-900/30 rounded-md overflow-hidden markets-rimlight-hover">
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-orange-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-100 font-light tracking-wider uppercase text-sm">
              <Users className="h-4 w-4" />
              Franchise Tracker
            </div>
            <p className="text-xs text-orange-400/70 font-light mt-1">
              All Variants • Market Performance • Universe Explorer
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-orange-400/50">
            <BarChart3 className="h-3 w-3" />
            <span>Multi-Verse Analytics</span>
          </div>
        </div>
      </div>

      {/* Franchise Families */}
      <div className="relative p-6 space-y-8 max-h-[700px] overflow-y-auto">
        {franchises.map((franchise, franchiseIndex) => (
          <div key={franchise.id} className="space-y-4" data-testid={`franchise-${franchise.id}`}>
            {/* Franchise Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-orange-500" />
                <div>
                  <h3 className="text-lg font-light text-orange-100" data-testid={`franchise-name-${franchiseIndex}`}>
                    {franchise.franchiseName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-orange-400/60">
                    <span>{franchise.publisher}</span>
                    <span className="text-orange-500/30">•</span>
                    <span>{franchise.totalVariants} variant{franchise.totalVariants !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Family Stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-orange-400/50 font-light">Market Cap</div>
                  <div className="text-sm text-orange-100 font-light">
                    ${(franchise.totalMarketCap / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-orange-400/50 font-light">24h Avg</div>
                  <div className={`text-sm font-light flex items-center gap-1 ${
                    franchise.avgPriceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {franchise.avgPriceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {franchise.avgPriceChange >= 0 ? '+' : ''}{franchise.avgPriceChange.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Variant Grid - SHOW ALL VARIANTS! */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {franchise.variants.map((variant, variantIndex) => {
                const isPositive = variant.priceChange24h >= 0;
                const popularityColor = variant.popularity >= 80 ? 'text-orange-400' : 
                                       variant.popularity >= 50 ? 'text-orange-500/70' : 
                                       'text-orange-600/50';

                return (
                  <div
                    key={variant.id}
                    className="relative hover-elevate active-elevate-2 rounded-md p-3 bg-[#252B3C]/80 border border-orange-900/20 transition-all duration-300"
                    data-testid={`variant-${franchiseIndex}-${variantIndex}`}
                  >
                    {/* Variant Image */}
                    <div className="relative mb-3">
                      {variant.imageUrl ? (
                        <div className="relative">
                          <img
                            src={variant.imageUrl}
                            alt={variant.variantName}
                            className="w-full aspect-square object-cover rounded-md border border-orange-800/30"
                            style={{ padding: '1px', boxSizing: 'border-box' }}
                            data-testid={`img-variant-${franchiseIndex}-${variantIndex}`}
                          />
                          {/* Popularity Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-0.5 bg-black/80 border-orange-500/40 ${popularityColor}`}
                            >
                              {variant.popularity}%
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-orange-950/30 rounded-md border border-orange-800/30 flex items-center justify-center">
                          <Users className="h-8 w-8 text-orange-500/30" />
                        </div>
                      )}
                    </div>

                    {/* Variant Info */}
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-light text-orange-100 truncate" data-testid={`variant-name-${franchiseIndex}-${variantIndex}`}>
                          {variant.variantName}
                        </h4>
                        {variant.realName && (
                          <p className="text-xs text-orange-400/60 truncate">{variant.realName}</p>
                        )}
                      </div>

                      {/* Universe Badge */}
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-indigo-950/30 border-indigo-500/40 text-indigo-400 font-light w-full justify-center"
                      >
                        {variant.universe}
                      </Badge>

                      {/* Market Stats */}
                      <div className="pt-2 border-t border-orange-900/20 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-400/50 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Price
                          </span>
                          <span className="text-orange-100 font-light">
                            ${variant.currentPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-400/50">24h</span>
                          <span className={`font-light flex items-center gap-1 ${
                            isPositive ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {isPositive ? '+' : ''}{variant.priceChange24h.toFixed(2)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-400/50">Volume</span>
                          <span className="text-orange-100 font-light">
                            ${(variant.tradingVolume / 1000).toFixed(1)}K
                          </span>
                        </div>

                        {/* First Appearance */}
                        {variant.firstAppearance && (
                          <div className="pt-1 border-t border-orange-900/10">
                            <div className="text-xs text-orange-400/40">Debut: {variant.firstAppearance}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            {franchiseIndex < franchises.length - 1 && (
              <div className="mt-6 border-t border-orange-900/20" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="relative px-6 py-4 border-t border-orange-900/30 bg-[#252B3C]/30">
        <div className="flex items-center justify-center gap-6 text-xs text-orange-400/50 font-light">
          <div className="flex items-center gap-2">
            <Trophy className="h-3 w-3 text-orange-400" />
            <span>Franchise Families</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-indigo-400" />
            <span>Multi-Verse Variants</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-3 w-3 text-green-400" />
            <span>Market Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
