import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Hero {
  id: string;
  canonicalName: string;
  subtype: string;
  universe: string;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  biography: string | null;
  teams: string[] | null;
  allies: string[] | null;
  assetImageUrl: string | null;
  assetCoverImageUrl: string | null;
  assetId: string | null;
  assetSymbol: string | null;
  assetPrice: string | null;
  assetPriceChange: string | null;
}

export function SidekicksSuperheroesWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Hero[] }>({
    queryKey: ['/api/narrative/sidekicks'],
    refetchInterval: 30000,
  });

  const heroes = data?.data || [];

  const getImageUrl = (hero: Hero): string => {
    return hero.primaryImageUrl || 
           hero.assetImageUrl || 
           hero.assetCoverImageUrl || 
           '';
  };

  const getSignificanceText = (hero: Hero): string => {
    const isSidekick = hero.subtype === 'sidekick';
    if (isSidekick) {
      return `Supporting heroic character in the ${hero.universe} universe with notable adventures`;
    } else {
      return `Major ${hero.universe} protagonist with significant comic history and cultural impact`;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full !bg-[#1A1F2E] sidekick-rimlight-hover" data-testid="widget-sidekicks-superheroes">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Shield className="w-12 h-12 text-[#89CFF0] sidekick-icon-glow" data-testid="icon-shield" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Sidekicks & Superheroes
            </span>
          </div>
        </CardHeader>
        <CardContent>
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
      <Card className="h-full !bg-[#1A1F2E] sidekick-rimlight-hover" data-testid="widget-sidekicks-superheroes">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Shield className="w-12 h-12 text-[#89CFF0] sidekick-icon-glow" data-testid="icon-shield" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Sidekicks & Superheroes
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Failed to load heroes. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full !bg-[#1A1F2E] sidekick-rimlight-hover" data-testid="widget-sidekicks-superheroes">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <Shield className="w-12 h-12 text-[#89CFF0] sidekick-icon-glow" data-testid="icon-shield" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Sidekicks & Superheroes
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#89CFF0]/30 scrollbar-track-transparent">
          {heroes.map((hero) => {
            const imageUrl = getImageUrl(hero);
            const isSidekick = hero.subtype === 'sidekick';
            const accentColor = isSidekick ? '#89CFF0' : '#00CED1';
            const linkPath = isSidekick ? `/sidekick/${hero.id}` : `/superhero/${hero.id}`;
            const rimlightClass = isSidekick ? 'narrative-rimlight narrative-rimlight-sidekick' : 'narrative-rimlight narrative-rimlight-superhero';
            
            const price = hero.assetPrice ? parseFloat(hero.assetPrice) : null;
            const priceChange = hero.assetPriceChange ? parseFloat(hero.assetPriceChange) : null;
            const isPriceUp = priceChange !== null && priceChange > 0;
            const isPriceDown = priceChange !== null && priceChange < 0;
            
            return (
              <Link 
                key={hero.id} 
                href={linkPath}
                data-testid={`link-${isSidekick ? 'sidekick' : 'superhero'}-${hero.id}`}
              >
                <div 
                  className={`relative w-[280px] h-[480px] rounded-lg overflow-visible shrink-0 narrative-hover cursor-pointer ${rimlightClass}`}
                  data-testid={`card-hero-${hero.id}`}
                >
                  {/* Image container with rimlight */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                    {/* Placeholder icon behind image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-32 h-32 text-muted-foreground/20" />
                    </div>
                    
                    {/* Actual image in front */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={hero.canonicalName}
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ zIndex: 1 }}
                      />
                    )}
                    
                    {/* Dark gradient overlay on top */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 40%, transparent 100%)`,
                        zIndex: 2
                      }}
                    />
                    
                    {/* Franchise Badge - Top Right */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20" style={{ zIndex: 3 }}>
                      <span 
                        style={{ 
                          fontFamily: 'Hind, sans-serif', 
                          fontWeight: '300', 
                          fontSize: '10pt',
                          color: '#ffffff',
                        }}
                      >
                        {hero.universe?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
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
                      {isSidekick ? 'SIDEKICK' : 'SUPERHERO'}
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
                      {hero.canonicalName}
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
                      {getSignificanceText(hero)}
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
