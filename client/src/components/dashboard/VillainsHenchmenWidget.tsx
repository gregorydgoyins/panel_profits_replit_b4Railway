import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skull, User, Building2 } from 'lucide-react';

interface Character {
  id: string;
  canonicalName: string;
  type: 'villain' | 'supervillain' | 'franchise_villain' | 'henchman';
  universe: string;
  publisher: string;
  primaryImageUrl: string | null;
  biography: string | null;
  firstAppearance: string | null;
  creators: Array<{ name: string; id: string }>;
  publisherId: string;
}

export function VillainsHenchmenWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Character }>({
    queryKey: ['/api/narrative/featured-villain'],
    refetchInterval: 30000, // 30 seconds
  });

  const character = data?.data;

  // Get image URL with fallback
  const getImageUrl = (char: Character): string => {
    return char.primaryImageUrl || '';
  };

  // Get character type label
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'villain': return 'VILLAIN';
      case 'supervillain': return 'SUPERVILLAIN';
      case 'franchise_villain': return 'FRANCHISE VILLAIN';
      case 'henchman': return 'HENCHMAN';
      default: return 'VILLAIN';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full !bg-[#1A1F2E] villain-rimlight-hover" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]/60 villain-icon-glow" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-[#252B3C] p-4 rounded-lg">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/5">
                <div className="w-full aspect-[2/3] bg-muted rounded-lg animate-pulse" />
              </div>
              <div className="lg:w-3/5 space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-20 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success || !character) {
    return (
      <Card className="h-full !bg-[#1A1F2E] villain-rimlight-hover" data-testid="widget-villains-henchmen">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2">
            <Skull className="w-12 h-12 text-[#8b0000]/60 villain-icon-glow" data-testid="icon-skull" />
            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
              Villains & Henchmen
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
            Failed to load featured character. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full !bg-[#1A1F2E] villain-rimlight-hover" data-testid="widget-villains-henchmen">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <Skull className="w-12 h-12 text-[#8b0000]/60 villain-icon-glow" data-testid="icon-skull" />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            Villains & Henchmen
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-[#252B3C] p-4 rounded-lg">
          {/* Main Content Area - Image + Info Side by Side */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Character Image */}
            <div className="lg:w-2/5">
              <Link href={`/villain/${character.id}`} data-testid={`link-villain-${character.id}`}>
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group">
                  {/* Background placeholder */}
                  <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                    <Skull className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                  
                  {/* Actual image */}
                  {getImageUrl(character) && (
                    <img
                      src={getImageUrl(character)}
                      alt={character.canonicalName}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      data-testid={`img-villain-${character.id}`}
                    />
                  )}
                  
                  {/* Rimlight on hover only */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                       style={{
                         boxShadow: '0 0 2px 2px #8b0000, 0 0 12px 12px rgba(139, 0, 0, 0.8), 0 0 24px 24px rgba(139, 0, 0, 0.4)',
                         borderRadius: '0.5rem'
                       }} />
                  
                  {/* Universe Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20 z-30">
                    <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#ffffff' }}>
                      {character.universe?.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Character Type Label */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/70 backdrop-blur-sm z-30 group-hover:shadow-[0_0_8px_2px_rgba(139,0,0,0.6)] transition-shadow duration-300">
                    <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#8b0000' }}>
                      {getTypeLabel(character.type)}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Publisher Attribution */}
              <div className="mt-4">
                <Link href={`/publisher/${character.publisherId}`} data-testid={`link-publisher-${character.publisherId}`}>
                  <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg hover-elevate cursor-pointer">
                    <Building2 className="w-4 h-4 text-[#89CFF0]" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                        Publisher
                      </p>
                      <p className="text-sm text-[#89CFF0]" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                        {character.publisher}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Side - Character Information */}
            <div className="lg:w-3/5 space-y-4">
              {/* Character Name and First Appearance */}
              <div>
                <Link href={`/villain/${character.id}`}>
                  <h3 className="text-2xl text-foreground mb-2 hover-elevate cursor-pointer" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    {character.canonicalName}
                  </h3>
                </Link>
                
                {character.firstAppearance && (
                  <div className="mb-3">
                    <span className="text-[#8b0000]" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                      First Appearance:
                    </span>
                    <span className="ml-2 text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                      {character.firstAppearance}
                    </span>
                  </div>
                )}
              </div>

              {/* Biography */}
              {character.biography && (
                <div className="bg-primary/5 border-2 border-[#8b0000]/30 rounded-lg p-4">
                  <p className="text-foreground leading-relaxed line-clamp-4" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                    {character.biography}
                  </p>
                </div>
              )}

              {/* Creators */}
              {character.creators && character.creators.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                      Created By
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {character.creators.map((creator, idx) => (
                      <Link 
                        key={idx}
                        href={`/creator/${creator.id}`}
                        data-testid={`link-creator-${creator.id}`}
                      >
                        <Badge 
                          variant="outline" 
                          className="hover-elevate cursor-pointer"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                        >
                          {creator.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Learn More Button */}
              <div className="pt-4">
                <Link href={`/villain/${character.id}`} data-testid="link-learn-more-villain">
                  <div className="orange-white-rimlight-hover rounded-lg p-3 cursor-pointer overflow-visible flex items-center justify-center gap-2 text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Learn More About {character.canonicalName}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
