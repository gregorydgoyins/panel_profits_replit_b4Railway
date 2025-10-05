import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skull } from 'lucide-react';

interface Villain {
  id: string;
  canonicalName: string;
  subtype: string;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  biography: string | null;
  teams: string[] | null;
  enemies: string[] | null;
  assetImageUrl: string | null;
  assetCoverImageUrl: string | null;
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

  if (isLoading) {
    return (
      <Card className="h-full border-2 border-[#8b0000] bg-[#8b0000]/5 villain-rimlight-hover" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
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
      <Card className="h-full border-2 border-[#8b0000] bg-[#8b0000]/5 villain-rimlight-hover" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Failed to load villains. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-2 border-[#8b0000] bg-[#8b0000]/5 villain-rimlight-hover" data-testid="widget-villains-henchmen">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <Skull className="w-12 h-12 text-[#8b0000]" data-testid="icon-skull" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Villains & Henchmen
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#8b0000]/30 scrollbar-track-transparent">
          {villains.map((villain) => {
            const imageUrl = getImageUrl(villain);
            const isVillain = villain.subtype === 'villain';
            const accentColor = isVillain ? '#8b0000' : '#4a0080';
            
            const linkPath = isVillain ? `/villain/${villain.id}` : `/henchman/${villain.id}`;
            
            return (
              <Link 
                key={villain.id} 
                href={linkPath}
                data-testid={`link-${isVillain ? 'villain' : 'henchman'}-${villain.id}`}
              >
                <div 
                  className="relative w-[280px] h-[400px] rounded-lg overflow-hidden shrink-0 hover-elevate cursor-pointer"
                  data-testid={`card-villain-${villain.id}`}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: imageUrl ? 'transparent' : '#1a1a1a',
                  }}
                >
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Villain name at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: accentColor,
                      }}
                    >
                      {isVillain ? 'VILLAIN' : 'HENCHMAN'}
                    </div>
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
                  </div>

                  {/* Placeholder if no image */}
                  {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Skull className="w-24 h-24 text-muted-foreground/30" />
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
