import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Award, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CreatorImpact {
  creatorName: string;
  creatorImageUrl: string | null;
  totalComics: number;
  avgPrice: number;
  priceChange24h: number;
  marketShare: number;
  topComic: {
    title: string;
    price: number;
    coverUrl: string | null;
  };
}

export function CreatorMarketImpactWidget() {
  const { data: creators, isLoading } = useQuery<CreatorImpact[]>({
    queryKey: ["/api/creators/market-impact"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-orange-500/30 rounded-md overflow-hidden markets-rimlight-hover"
        data-testid="widget-creator-impact-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-orange-500/30">
          <div className="flex items-center gap-2 text-orange-100 font-light tracking-wider uppercase text-sm">
            <Award className="h-4 w-4" />
            Creator Market Impact
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-orange-500/30 rounded-md overflow-hidden markets-rimlight-hover"
        data-testid="widget-creator-impact-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-orange-500/30">
          <div className="flex items-center gap-2 text-orange-100 font-light tracking-wider uppercase text-sm">
            <Award className="h-4 w-4" />
            Creator Market Impact
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Award className="h-12 w-12 text-orange-500/30 mb-4" />
          <p className="text-orange-300/60 text-sm font-light">
            No creator data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-orange-500/30 rounded-md overflow-hidden markets-rimlight-hover"
      data-testid="widget-creator-impact"
    >
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-100 font-light tracking-wider uppercase text-sm">
            <Award className="h-4 w-4" />
            Creator Market Impact
          </div>
          <div className="text-xs text-orange-300/50 font-light">
            24H Performance
          </div>
        </div>
      </div>

      {/* Creators List */}
      <div className="relative p-6 space-y-6">
        {creators.map((creator, index) => {
          const isPositive = creator.priceChange24h >= 0;
          
          return (
            <div 
              key={creator.creatorName}
              className="flex gap-4 items-start"
              data-testid={`creator-impact-${index}`}
            >
              {/* Creator Avatar */}
              <div className="relative flex-shrink-0">
                {creator.creatorImageUrl ? (
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-orange-500/30 bg-black">
                    <img
                      src={creator.creatorImageUrl}
                      alt={creator.creatorName}
                      className="w-full h-full object-cover"
                      style={{ padding: '1px', boxSizing: 'border-box' }}
                      loading="lazy"
                      data-testid={`img-creator-${index}`}
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full border-2 border-orange-500/30 bg-gradient-to-br from-orange-900 via-yellow-900 to-orange-900 flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-400/50" />
                  </div>
                )}
                
                {/* Rank Badge */}
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-yellow-500 border-2 border-[#1A1F2E] flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-900">1</span>
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-orange-100 font-light text-base tracking-wide truncate"
                  data-testid={`text-creator-name-${index}`}
                >
                  {creator.creatorName}
                </h4>
                
                <div className="flex items-center gap-3 mt-1 text-xs text-orange-300/60">
                  <span data-testid={`text-total-comics-${index}`}>
                    {creator.totalComics} comics
                  </span>
                  <span className="text-orange-500/30">•</span>
                  <span data-testid={`text-market-share-${index}`}>
                    {creator.marketShare.toFixed(1)}% share
                  </span>
                </div>

                {/* Top Comic Preview */}
                {creator.topComic && (
                  <div className="mt-2 flex items-center gap-2">
                    {creator.topComic.coverUrl && (
                      <div className="h-12 w-8 rounded border border-orange-500/20 bg-black overflow-hidden flex-shrink-0">
                        <img
                          src={creator.topComic.coverUrl}
                          alt={creator.topComic.title}
                          className="w-full h-full object-contain"
                          style={{ padding: '1px', boxSizing: 'border-box' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-orange-300/80 truncate">
                        {creator.topComic.title}
                      </p>
                      <p className="text-xs text-orange-400 font-light">
                        ${creator.topComic.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-orange-400" />
                  <span 
                    className="text-orange-100 font-light text-sm"
                    data-testid={`text-avg-price-${index}`}
                  >
                    {creator.avgPrice.toLocaleString()}
                  </span>
                </div>
                
                <div 
                  className={`flex items-center gap-1 text-xs font-light ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                  data-testid={`text-price-change-${index}`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {creator.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="relative px-6 pb-4">
        <div className="flex items-center justify-center gap-4 text-xs text-orange-300/40 font-light">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span>Rising</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <span>Falling</span>
          </div>
        </div>
      </div>
    </div>
  );
}
