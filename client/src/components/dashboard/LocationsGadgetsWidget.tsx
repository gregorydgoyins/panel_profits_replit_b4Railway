import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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

  if (isLoading) {
    return (
      <Card className="h-full border-2 border-[#8B4513] bg-[#8B4513]/5 rounded-lg location-rimlight-hover" data-testid="widget-locations-gadgets">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-12 h-12 text-[#8B4513]" data-testid="icon-mappin" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Locations & Gadgets
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[280px] h-[400px] bg-muted rounded-lg animate-pulse shrink-0" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card className="h-full border-2 border-[#8B4513] bg-[#8B4513]/5 rounded-lg location-rimlight-hover" data-testid="widget-locations-gadgets">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-12 h-12 text-[#8B4513]" data-testid="icon-mappin" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Locations & Gadgets
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Failed to load locations & gadgets. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-2 border-[#8B4513] bg-[#8B4513]/5 rounded-lg location-rimlight-hover" data-testid="widget-locations-gadgets">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <MapPin className="w-12 h-12 text-[#8B4513]" data-testid="icon-mappin" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Locations & Gadgets
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#8B4513]/30 scrollbar-track-transparent">
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
            const isLocation = item.entityType === 'location';
            const accentColor = isLocation ? '#8B4513' : '#DAA520';
            
            const linkPath = isLocation ? `/location/${item.id}` : `/gadget/${item.id}`;
            const rimlightClass = isLocation ? 'location-rimlight-hover' : 'gadget-rimlight-hover';
            
            return (
              <Link 
                key={item.id} 
                href={linkPath}
                data-testid={`link-${isLocation ? 'location' : 'gadget'}-${item.id}`}
              >
                <div 
                  className={`relative w-[280px] h-[400px] rounded-lg overflow-hidden shrink-0 hover-elevate cursor-pointer ${rimlightClass}`}
                  data-testid={`card-item-${item.id}`}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: imageUrl ? 'transparent' : '#1a1a1a',
                  }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${accentColor}ee 0%, ${accentColor}99 30%, transparent 100%)`
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
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#ffffff',
                      }}
                    >
                      {isLocation ? 'LOCATION' : 'GADGET'}
                    </div>
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
                  </div>

                  {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-32 h-32 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
