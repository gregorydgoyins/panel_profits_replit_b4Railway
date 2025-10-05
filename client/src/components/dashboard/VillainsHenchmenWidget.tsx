import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skull, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Villain {
  id: string;
  canonicalName: string;
  subtype: string;
  universe: string;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  biography: string | null;
  teams: string[] | null;
  enemies: string[] | null;
  assetImageUrl: string | null;
  assetCoverImageUrl: string | null;
  assetId: string | null;
  assetSymbol: string | null;
  assetPrice: string | null;
  assetPriceChange: string | null;
}

export function VillainsHenchmenWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Villain[] }>({
    queryKey: ['/api/narrative/villains'],
    refetchInterval: 30000, // 30 seconds
  });

  const villains = data?.data || [];

  // Get image URL with fallbacks
  const getImageUrl = (villain: Villain): string => {
    return villain.primaryImageUrl || 
           villain.assetImageUrl || 
           villain.assetCoverImageUrl || 
           '';
  };

  // Get character significance text
  const getSignificanceText = (villain: Villain): string => {
    const isVillain = villain.subtype === 'villain';
    if (isVillain) {
      return `Major ${villain.universe} antagonist with significant comic history and fan following`;
    } else {
      return `Supporting criminal character in the ${villain.universe} universe`;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full narrative-foundation narrative-foundation-villain border-2 border-[#8b0000]/30" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0 relative z-10">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[280px] h-[480px] bg-muted rounded-lg animate-pulse shrink-0" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card className="h-full narrative-foundation narrative-foundation-villain border-2 border-[#8b0000]/30" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0 relative z-10">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center text-muted-foreground py-8">
            Failed to load villains. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full narrative-foundation narrative-foundation-villain border-2 border-[#8b0000]/30" data-testid="widget-villains-henchmen">
      <CardHeader className="pb-3 space-y-0 relative z-10">
        <div className="flex items-center gap-2">
          <Skull className="w-12 h-12 text-[#8b0000]" data-testid="icon-skull" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Villains & Henchmen
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#8b0000]/30 scrollbar-track-transparent">
          {villains.map((villain) => {
            const imageUrl = getImageUrl(villain);
            const isVillain = villain.subtype === 'villain';
            const accentColor = isVillain ? '#8b0000' : '#89CFF0';
            const linkPath = isVillain ? `/villain/${villain.id}` : `/henchman/${villain.id}`;
            const rimlightClass = isVillain ? 'narrative-rimlight narrative-rimlight-villain' : 'narrative-rimlight narrative-rimlight-sidekick';
            
            const price = villain.assetPrice ? parseFloat(villain.assetPrice) : null;
            const priceChange = villain.assetPriceChange ? parseFloat(villain.assetPriceChange) : null;
            const isPriceUp = priceChange !== null && priceChange > 0;
            const isPriceDown = priceChange !== null && priceChange < 0;
            
            return (
              <Link 
                key={villain.id} 
                href={linkPath}
                data-testid={`link-${isVillain ? 'villain' : 'henchman'}-${villain.id}`}
              >
                <div 
                  className={`relative w-[280px] h-[480px] rounded-lg overflow-visible shrink-0 narrative-hover cursor-pointer ${rimlightClass}`}
                  data-testid={`card-villain-${villain.id}`}
                >
                  {/* Image container with rimlight */}
                  <div 
                    className="absolute inset-0 rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: imageUrl ? 'transparent' : '#1a1a1a',
                    }}
                  >
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                    
                    {/* Franchise Badge - Top Right */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20">
                      <span 
                        style={{ 
                          fontFamily: 'Hind, sans-serif', 
                          fontWeight: '300', 
                          fontSize: '10pt',
                          color: '#ffffff',
                        }}
                      >
                        {villain.universe?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    
                    {/* Placeholder if no image */}
                    {!imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Skull className="w-24 h-24 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom content area - Secondary Layer */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 narrative-secondary rounded-b-lg">
                    {/* Category label */}
                    <div 
                      className="mb-1"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: accentColor,
                      }}
                    >
                      {isVillain ? 'VILLAIN' : 'HENCHMAN'}
                    </div>

                    {/* Character name */}
                    <h3 
                      className="text-white line-clamp-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt' 
                      }}
                    >
                      {villain.canonicalName}
                    </h3>

                    {/* Significance text */}
                    <p 
                      className="text-white/80 line-clamp-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '12pt',
                      }}
                    >
                      {getSignificanceText(villain)}
                    </p>

                    {/* Asset pricing section */}
                    {price !== null && (
                      <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded px-3 py-2 border border-white/10">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#50C878]" />
                          <span 
                            style={{ 
                              fontFamily: 'Hind, sans-serif', 
                              fontWeight: '300', 
                              fontSize: '12pt',
                              color: '#50C878',
                            }}
                          >
                            ${price.toFixed(2)}
                          </span>
                        </div>
                        
                        {priceChange !== null && (
                          <div className="flex items-center gap-1">
                            {isPriceUp && (
                              <>
                                <TrendingUp className="w-4 h-4 text-[#50C878]" data-testid="icon-trending-up" />
                                <span 
                                  style={{ 
                                    fontFamily: 'Hind, sans-serif', 
                                    fontWeight: '300', 
                                    fontSize: '12pt',
                                    color: '#50C878',
                                  }}
                                >
                                  +{Math.abs(priceChange).toFixed(2)}%
                                </span>
                              </>
                            )}
                            {isPriceDown && (
                              <>
                                <TrendingDown className="w-4 h-4 text-[#DC143C]" data-testid="icon-trending-down" />
                                <span 
                                  style={{ 
                                    fontFamily: 'Hind, sans-serif', 
                                    fontWeight: '300', 
                                    fontSize: '12pt',
                                    color: '#DC143C',
                                  }}
                                >
                                  {priceChange.toFixed(2)}%
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
