import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Skull, Zap, ShieldAlert, Users, Swords } from 'lucide-react';
import { Link } from 'wouter';

interface VillainDetail {
  id: string;
  canonicalName: string;
  realName: string | null;
  subtype: string;
  biography: string | null;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  teams: string[] | null;
  enemies: string[] | null;
  firstAppearance: string | null;
  universe: string;
  asset: {
    imageUrl: string | null;
    coverImageUrl: string | null;
  } | null;
  powers: Array<{
    id: string;
    traitName: string;
    description: string;
    potencyLevel: number | null;
  }>;
  weaknesses: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    traitName: string;
    description: string;
    masteryLevel: number | null;
  }>;
  equipment: Array<{
    id: string;
    traitName: string;
    description: string;
  }>;
}

export default function VillainBioPage() {
  const params = useParams();
  const villainId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: VillainDetail }>({
    queryKey: ['/api/narrative/villain', villainId],
    enabled: !!villainId,
  });

  const villain = data?.data;

  const getHeroImageUrl = () => {
    return villain?.primaryImageUrl || 
           villain?.asset?.imageUrl || 
           villain?.asset?.coverImageUrl || 
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

  if (error || !villain) {
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
              <p className="text-muted-foreground">Villain information not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const heroImageUrl = getHeroImageUrl();
  const isVillain = villain.subtype === 'villain';
  const accentColor = isVillain ? '#8b0000' : '#4a0080';

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

        {/* Hero Image Section */}
        <div 
          className="relative h-[800px] rounded-lg overflow-hidden mb-8"
          style={{
            backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: heroImageUrl ? 'transparent' : '#1a1a1a',
          }}
          data-testid="hero-image-section"
        >
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          
          {/* Villain info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-4" style={{ backgroundColor: accentColor, color: 'white' }}>
              {isVillain ? 'VILLAIN' : 'HENCHMAN'}
            </Badge>
            <h1 
              className="text-white mb-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              {villain.canonicalName}
            </h1>
            {villain.realName && (
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
              >
                {villain.realName}
              </p>
            )}
            <p 
              className="text-white/60 mt-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
            >
              {villain.universe.toUpperCase()} Universe
            </p>
          </div>

          {/* Placeholder if no image */}
          {!heroImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skull className="w-64 h-64 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Alternate Images Gallery */}
        {villain.alternateImageUrls && villain.alternateImageUrls.length > 0 && (
          <div className="mb-8">
            <h2 
              className="mb-4"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              Gallery
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {villain.alternateImageUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-64 h-96 rounded-lg overflow-hidden shrink-0 border-2 border-white/20"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  data-testid={`img-alternate-${index}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Biography Section */}
        <Card className="!bg-[#1A1F2E] mb-8">
          <CardHeader>
            <h2 
              className="flex items-center gap-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              <Skull className="w-6 h-6" style={{ color: accentColor }} />
              Biography
            </h2>
          </CardHeader>
          <CardContent>
            <p 
              className="text-foreground/90 leading-relaxed"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
            >
              {villain.biography || `${villain.canonicalName} is a notorious ${isVillain ? 'villain' : 'henchman'} in the ${villain.universe} universe.`}
            </p>
          </CardContent>
        </Card>

        {/* Powers Section */}
        {villain.powers.length > 0 && (
          <Card className="!bg-[#1A1F2E] mb-8">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Zap className="w-6 h-6" style={{ color: accentColor }} />
                Powers & Abilities
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {villain.powers.map((power) => (
                  <div 
                    key={power.id} 
                    className="border-2 rounded-lg p-4"
                    style={{ borderColor: accentColor + '40', backgroundColor: accentColor + '10' }}
                    data-testid={`power-card-${power.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt', color: accentColor }}
                      >
                        {power.traitName}
                      </h3>
                      {power.potencyLevel && (
                        <Badge variant="outline" style={{ borderColor: accentColor, color: accentColor }}>
                          Level {power.potencyLevel}
                        </Badge>
                      )}
                    </div>
                    <p 
                      className="text-foreground/80"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                    >
                      {power.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weaknesses Section */}
        {villain.weaknesses.length > 0 && (
          <Card className="!bg-[#1A1F2E] mb-8">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <ShieldAlert className="w-6 h-6" style={{ color: accentColor }} />
                Weaknesses
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {villain.weaknesses.map((weakness) => (
                  <div 
                    key={weakness.id} 
                    className="border-l-4 pl-4 py-2"
                    style={{ borderColor: accentColor }}
                    data-testid={`weakness-${weakness.id}`}
                  >
                    <h3 
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
                    >
                      {weakness.traitName}
                    </h3>
                    <p 
                      className="text-foreground/80"
                      style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                    >
                      {weakness.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enemies Section */}
        {villain.enemies && villain.enemies.length > 0 && (
          <Card className="!bg-[#1A1F2E] mb-8">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Swords className="w-6 h-6" style={{ color: accentColor }} />
                Enemies & Rivals
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {villain.enemies.map((enemy, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="text-base px-4 py-2"
                    style={{ borderColor: accentColor, color: accentColor }}
                    data-testid={`badge-enemy-${index}`}
                  >
                    {enemy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teams/Affiliations Section */}
        {villain.teams && villain.teams.length > 0 && (
          <Card className="!bg-[#1A1F2E] mb-8">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Users className="w-6 h-6" style={{ color: accentColor }} />
                Teams & Affiliations
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {villain.teams.map((team, index) => (
                  <Badge 
                    key={index}
                    className="text-base px-4 py-2"
                    style={{ backgroundColor: accentColor, color: 'white' }}
                    data-testid={`badge-team-${index}`}
                  >
                    {team}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* First Appearance */}
        {villain.firstAppearance && (
          <Card className="!bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                First Appearance
              </h2>
            </CardHeader>
            <CardContent>
              <p 
                className="text-foreground/90"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
              >
                {villain.firstAppearance}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
