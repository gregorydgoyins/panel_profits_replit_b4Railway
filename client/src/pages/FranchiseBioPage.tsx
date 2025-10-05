import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Users, MapPin, Palette } from 'lucide-react';
import { Link } from 'wouter';

interface FranchiseEntity {
  id: string;
  canonicalName: string;
  entityType: string;
  subtype: string | null;
  primaryImageUrl: string | null;
  assetId: string | null;
}

interface FranchiseDetail {
  name: string;
  totalEntities: number;
  characterCount: number;
  creatorCount: number;
  locationCount: number;
  entities: FranchiseEntity[];
}

export default function FranchiseBioPage() {
  const params = useParams();
  const franchiseName = params.name ? decodeURIComponent(params.name) : '';

  const { data, isLoading, error } = useQuery<{ success: boolean; data: FranchiseDetail }>({
    queryKey: ['/api/narrative/franchise', franchiseName],
    enabled: !!franchiseName,
  });

  const franchise = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <div className="h-[400px] bg-muted rounded-lg animate-pulse mb-8" />
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !franchise) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="!bg-[#1A1F2E]">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Franchise information not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const characters = franchise.entities.filter(e => e.entityType === 'character');
  const creators = franchise.entities.filter(e => e.entityType === 'creator');
  const locations = franchise.entities.filter(e => e.entityType === 'location');

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Section */}
        <Card className="!bg-[#252B3C] mb-8" data-testid="franchise-header">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-lg bg-[#1A1F2E]">
                <Building2 className="w-16 h-16 text-white" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt', color: '#ffffff' }}>
                  {franchise.name}
                </h1>
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: '#89CFF0' }}>
                  Comic Book Universe
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="!bg-[#252B3C]" data-testid="stat-total-entities">
            <CardContent className="pt-6">
              <div className="text-center">
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt', color: '#ffffff' }}>
                  {franchise.totalEntities}
                </p>
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#89CFF0' }}>
                  Total Entities
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-[#252B3C]" data-testid="stat-characters">
            <CardContent className="pt-6">
              <div className="text-center">
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt', color: '#ffffff' }}>
                  {franchise.characterCount}
                </p>
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#89CFF0' }}>
                  Characters
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-[#252B3C]" data-testid="stat-creators">
            <CardContent className="pt-6">
              <div className="text-center">
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt', color: '#ffffff' }}>
                  {franchise.creatorCount}
                </p>
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#89CFF0' }}>
                  Creators
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-[#252B3C]" data-testid="stat-locations">
            <CardContent className="pt-6">
              <div className="text-center">
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt', color: '#ffffff' }}>
                  {franchise.locationCount}
                </p>
                <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#89CFF0' }}>
                  Locations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Characters Section */}
        {characters.length > 0 && (
          <Card className="!bg-[#252B3C] mb-8" data-testid="section-characters">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-white" />
                <h2 style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', color: '#ffffff' }}>
                  Characters
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characters.slice(0, 12).map((character) => {
                  // Map subtypes to correct routes
                  let route = 'villain'; // Default fallback
                  if (character.subtype === 'villain' || character.subtype === 'henchman') {
                    route = character.subtype === 'villain' ? 'villain' : 'henchman';
                  } else if (character.subtype === 'superhero' || character.subtype === 'sidekick') {
                    route = character.subtype === 'superhero' ? 'superhero' : 'sidekick';
                  }
                  
                  return (
                    <Link key={character.id} href={`/${route}/${character.id}`}>
                      <Card className="!bg-[#1A1F2E] hover-elevate active-elevate-2 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-[#0a0a0a] rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                            {character.primaryImageUrl ? (
                              <img 
                                src={character.primaryImageUrl} 
                                alt={character.canonicalName}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Users className="w-12 h-12 text-muted-foreground/30" />
                            )}
                          </div>
                          <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#ffffff' }} className="text-center truncate">
                            {character.canonicalName}
                          </p>
                          {character.subtype && (
                            <Badge variant="outline" className="w-full mt-1">
                              <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '10pt' }}>
                                {character.subtype}
                              </span>
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Creators Section */}
        {creators.length > 0 && (
          <Card className="!bg-[#252B3C] mb-8" data-testid="section-creators">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-8 h-8 text-white" />
                <h2 style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', color: '#ffffff' }}>
                  Creators
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {creators.slice(0, 12).map((creator) => (
                  <Link key={creator.id} href={`/creator/${encodeURIComponent(creator.canonicalName)}`}>
                    <Badge 
                      variant="outline" 
                      className="w-full hover-elevate active-elevate-2 cursor-pointer py-2"
                    >
                      <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '11pt' }} className="truncate">
                        {creator.canonicalName}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locations Section */}
        {locations.length > 0 && (
          <Card className="!bg-[#252B3C]" data-testid="section-locations">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-8 h-8 text-white" />
                <h2 style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', color: '#ffffff' }}>
                  Locations
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {locations.slice(0, 8).map((location) => (
                  <Card key={location.id} className="!bg-[#1A1F2E] hover-elevate active-elevate-2">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-[#0a0a0a] rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        {location.primaryImageUrl ? (
                          <img 
                            src={location.primaryImageUrl} 
                            alt={location.canonicalName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <MapPin className="w-12 h-12 text-muted-foreground/30" />
                        )}
                      </div>
                      <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt', color: '#ffffff' }} className="text-center truncate">
                        {location.canonicalName}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
