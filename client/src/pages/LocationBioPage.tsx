import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Users, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

interface LocationDetail {
  id: string;
  canonicalName: string;
  subtype: string | null;
  description: string | null;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  firstAppearance: string | null;
  universe: string;
  asset: {
    imageUrl: string | null;
    coverImageUrl: string | null;
  } | null;
  notableEvents: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
  features: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
  associatedCharacters: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
}

export default function LocationBioPage() {
  const params = useParams();
  const locationId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: LocationDetail }>({
    queryKey: ['/api/narrative/location', locationId],
    enabled: !!locationId,
  });

  const location = data?.data;

  const getLocationImageUrl = () => {
    return location?.primaryImageUrl || 
           location?.asset?.imageUrl || 
           location?.asset?.coverImageUrl || 
           '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <div className="h-[800px] bg-muted rounded-lg animate-pulse mb-8" />
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !location) {
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
              <p className="text-muted-foreground">Location information not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const locationImageUrl = getLocationImageUrl();

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div 
          className="relative h-[800px] rounded-lg overflow-hidden mb-8 location-rimlight-hover"
          style={{
            backgroundImage: locationImageUrl ? `url(${locationImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: locationImageUrl ? 'transparent' : '#1a1a1a',
          }}
          data-testid="location-image-section"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-4" style={{ backgroundColor: '#8B4513', color: 'white' }}>
              LOCATION
            </Badge>
            <h1 
              className="text-white mb-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              {location.canonicalName}
            </h1>
            {location.subtype && (
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
              >
                {location.subtype}
              </p>
            )}
            <p 
              className="text-white/60 mt-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
            >
              {location.universe.toUpperCase()} Universe
            </p>
          </div>

          {!locationImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-64 h-64 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {location.alternateImageUrls && location.alternateImageUrls.length > 0 && (
          <div className="mb-8">
            <h2 
              className="mb-4"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              Gallery
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {location.alternateImageUrls.map((imageUrl, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  data-testid={`gallery-image-${index}`}
                />
              ))}
            </div>
          </div>
        )}

        {location.description && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <BookOpen className="w-6 h-6" />
                Description
              </h2>
            </CardHeader>
            <CardContent>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
              >
                {location.description}
              </p>
            </CardContent>
          </Card>
        )}

        {location.notableEvents && location.notableEvents.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Calendar className="w-6 h-6" style={{ color: '#8B4513' }} />
                Notable Events
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {location.notableEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: '#8B4513', backgroundColor: 'rgba(139, 69, 19, 0.1)' }}
                    data-testid={`event-${event.id}`}
                  >
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#8B4513'
                      }}
                    >
                      {event.traitName}
                    </h3>
                    {event.description && (
                      <p 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                      >
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {location.associatedCharacters && location.associatedCharacters.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Users className="w-6 h-6" />
                Associated Heroes & Villains
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {location.associatedCharacters.map((character, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="text-base py-1 px-3"
                    data-testid={`character-${index}`}
                  >
                    {character.traitName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {location.firstAppearance && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                First Appearance
              </h2>
            </CardHeader>
            <CardContent>
              <p 
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
              >
                {location.firstAppearance}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
