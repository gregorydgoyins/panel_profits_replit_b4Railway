import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface LocationGadget {
  id: string;
  canonicalName: string;
  entityType: string;
  subtype: string | null;
  universe: string;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  description: string | null;
  assetImageUrl: string | null;
  assetCoverImageUrl: string | null;
  assetId: string | null;
  assetSymbol: string | null;
  assetPrice: string | null;
  assetPriceChange: string | null;
}

export function LocationsGadgetsWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: LocationGadget[] }>({
    queryKey: ['/api/narrative/locations'],
    refetchInterval: 30000,
  });

  const items = data?.data || [];

  const getImageUrl = (item: LocationGadget): string => {
    return item.primaryImageUrl || 
           item.assetImageUrl || 
           item.assetCoverImageUrl || 
           '';
  };

  const getSignificanceText = (item: LocationGadget): string => {
    const isLocation = item.entityType === 'location';
    if (isLocation) {
      return `Iconic ${item.universe} location with significant story importance and fan recognition`;
    } else {
      return `Notable ${item.universe} equipment or artifact with unique powers or historical value`;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full narrative-foundation narrative-foundation-location border-2 border-[#8B4513]/30" data-testid="widget-locations-gadgets">
        <CardHeader className="pb-3 space-y-0 relative z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-12 h-12 text-[#8B4513]" data-testid="icon-mappin" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Locations & Gadgets
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
      <Card className="h-full narrative-foundation narrative-foundation-location border-2 border-[#8B4513]/30" data-testid="widget-locations-gadgets">
        <CardHeader className="pb-3 space-y-0 relative z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-12 h-12 text-[#8B4513]" data-testid="icon-mappin" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Locations & Gadgets
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center text-muted-foreground py-8">
            Failed to load locations & gadgets. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full narrative-foundation narrative-foundation-location border-2 border-[#8B4513]/30" data-testid="widget-locations-gadgets">
      <CardHeader className="pb-3 space-y-0 relative z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-12 h-12 text-[#8B4513]" data-testid="icon-mappin" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Locations & Gadgets
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#8B4513]/30 scrollbar-track-transparent">
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
            const isLocation = item.entityType === 'location';
            const accentColor = isLocation ? '#8B4513' : '#DAA520';
            const linkPath = isLocation ? `/location/${item.id}` : `/gadget/${item.id}`;
            const rimlightClass = isLocation ? 'narrative-rimlight narrative-rimlight-location' : 'narrative-rimlight narrative-rimlight-gadget';
            
            const price = item.assetPrice ? parseFloat(item.assetPrice) : null;
            const priceChange = item.assetPriceChange ? parseFloat(item.assetPriceChange) : null;
            const isPriceUp = priceChange !== null && priceChange > 0;
            const isPriceDown = priceChange !== null && priceChange < 0;
            
            return (
              <Link 
                key={item.id} 
                href={linkPath}
                data-testid={`link-${isLocation ? 'location' : 'gadget'}-${item.id}`}
              >
                <div 
                  className={`relative w-[280px] h-[480px] rounded-lg overflow-visible shrink-0 narrative-hover cursor-pointer ${rimlightClass}`}
                  data-testid={`card-item-${item.id}`}
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
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 40%, transparent 100%)`
                      }}
                    />
                    
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
                        {item.universe?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    
                    {/* Placeholder if no image */}
                    {!imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-32 h-32 text-muted-foreground/20" />
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
                      {isLocation ? 'LOCATION' : 'GADGET'}
                    </div>

                    {/* Item name */}
                    <h3 
                      className="text-white line-clamp-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt' 
                      }}
                    >
                      {item.canonicalName}
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
                      {getSignificanceText(item)}
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
