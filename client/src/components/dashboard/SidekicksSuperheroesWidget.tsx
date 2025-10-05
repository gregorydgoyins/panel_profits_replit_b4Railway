import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield } from 'lucide-react';

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
}

export function SidekicksSuperheroesWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Hero[] }>({
    queryKey: ['/api/narrative/sidekicks'],
    refetchInterval: 30000, // 30 seconds
  });

  const heroes = data?.data || [];

  // Get image URL with fallbacks
  const getImageUrl = (hero: Hero): string => {
    return hero.primaryImageUrl || 
           hero.assetImageUrl || 
           hero.assetCoverImageUrl || 
           '';
  };

  if (isLoading) {
    return (
      <Card className="h-full border-2 border-[#89CFF0] bg-[#89CFF0]/5 sidekick-rimlight-hover" data-testid="widget-sidekicks-superheroes">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Shield className="w-12 h-12 text-[#89CFF0]" data-testid="icon-shield" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Sidekicks & Superheroes
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
      <Card className="h-full border-2 border-[#89CFF0] bg-[#89CFF0]/5 sidekick-rimlight-hover" data-testid="widget-sidekicks-superheroes">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Shield className="w-12 h-12 text-[#89CFF0]" data-testid="icon-shield" />
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
    <Card className="h-full border-2 border-[#89CFF0] bg-[#89CFF0]/5 sidekick-rimlight-hover" data-testid="widget-sidekicks-superheroes">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <Shield className="w-12 h-12 text-[#89CFF0]" data-testid="icon-shield" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Sidekicks & Superheroes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#89CFF0]/30 scrollbar-track-transparent">
          {heroes.map((hero) => {
            const imageUrl = getImageUrl(hero);
            const isSidekick = hero.subtype === 'sidekick';
            const accentColor = isSidekick ? '#89CFF0' : '#00CED1';
            
            const linkPath = isSidekick ? `/sidekick/${hero.id}` : `/superhero/${hero.id}`;
            const rimlightClass = isSidekick ? 'sidekick-rimlight-hover' : 'superhero-rimlight-hover';
            
            return (
              <Link 
                key={hero.id} 
                href={linkPath}
                data-testid={`link-${isSidekick ? 'sidekick' : 'superhero'}-${hero.id}`}
              >
                <div 
                  className={`relative w-[280px] h-[400px] rounded-lg overflow-hidden shrink-0 hover-elevate cursor-pointer ${rimlightClass}`}
                  data-testid={`card-hero-${hero.id}`}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: imageUrl ? 'transparent' : '#1a1a1a',
                  }}
                >
                  {/* Bright gradient overlay */}
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
                      {hero.universe?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  {/* Hero name at bottom */}
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
                      {isSidekick ? 'SIDEKICK' : 'SUPERHERO'}
                    </div>
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
                  </div>

                  {/* Placeholder if no image */}
                  {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-32 h-32 text-muted-foreground/20" />
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
