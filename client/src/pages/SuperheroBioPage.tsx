import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Zap, ShieldAlert, Users, Book } from 'lucide-react';
import { Link } from 'wouter';

interface SuperheroDetail {
  id: string;
  canonicalName: string;
  realName: string | null;
  subtype: string;
  biography: string | null;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  teams: string[] | null;
  allies: string[] | null;
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

export default function SuperheroBioPage() {
  const params = useParams();
  const heroId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: SuperheroDetail }>({
    queryKey: ['/api/narrative/superhero', heroId],
    enabled: !!heroId,
  });

  const hero = data?.data;

  const getHeroImageUrl = () => {
    return hero?.primaryImageUrl || 
           hero?.asset?.imageUrl || 
           hero?.asset?.coverImageUrl || 
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

  if (error || !hero) {
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
              <p className="text-muted-foreground">Superhero information not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const heroImageUrl = getHeroImageUrl();

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
          className="relative h-[800px] rounded-lg overflow-hidden mb-8 superhero-rimlight-hover"
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
          
          {/* Hero info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-4" style={{ backgroundColor: '#00CED1', color: 'white' }}>
              SUPERHERO
            </Badge>
            <h1 
              className="text-white mb-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt' }}
            >
              {hero.canonicalName}
            </h1>
            {hero.realName && (
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                {hero.realName}
              </p>
            )}
            <p 
              className="text-white/60 mt-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
            >
              {hero.universe.toUpperCase()} Universe
            </p>
          </div>

          {/* Placeholder if no image */}
          {!heroImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-64 h-64 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Alternate Images Gallery */}
        {hero.alternateImageUrls && hero.alternateImageUrls.length > 0 && (
          <div className="mb-8">
            <h2 
              className="mb-4"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              Gallery
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {hero.alternateImageUrls.map((imageUrl, index) => (
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

        {/* Biography Section */}
        {hero.biography && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Book className="w-6 h-6" />
                Biography
              </h2>
            </CardHeader>
            <CardContent>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
              >
                {hero.biography}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Powers Section */}
        {hero.powers && hero.powers.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Zap className="w-6 h-6" style={{ color: '#00CED1' }} />
                Powers
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hero.powers.map((power) => (
                  <div 
                    key={power.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: '#00CED1', backgroundColor: '#00CED1/10' }}
                    data-testid={`power-${power.id}`}
                  >
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#00CED1'
                      }}
                    >
                      {power.traitName}
                    </h3>
                    {power.description && (
                      <p 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                      >
                        {power.description}
                      </p>
                    )}
                    {power.potencyLevel !== null && (
                      <p 
                        className="mt-2 text-sm"
                        style={{ color: '#00CED1' }}
                      >
                        Potency Level: {power.potencyLevel}/10
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weaknesses Section */}
        {hero.weaknesses && hero.weaknesses.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <ShieldAlert className="w-6 h-6" style={{ color: '#DC2626' }} />
                Weaknesses
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hero.weaknesses.map((weakness) => (
                  <div 
                    key={weakness.id}
                    className="p-4 rounded-lg border border-destructive/30 bg-destructive/5"
                    data-testid={`weakness-${weakness.id}`}
                  >
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#DC2626'
                      }}
                    >
                      {weakness.traitName}
                    </h3>
                    {weakness.description && (
                      <p 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                      >
                        {weakness.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Allies Section */}
        {hero.allies && hero.allies.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Users className="w-6 h-6" />
                Allies
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hero.allies.map((ally, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="text-base py-1 px-3"
                    data-testid={`ally-${index}`}
                  >
                    {ally}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teams/Affiliations Section */}
        {hero.teams && hero.teams.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Users className="w-6 h-6" />
                Teams & Affiliations
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hero.teams.map((team, index) => (
                  <Badge 
                    key={index}
                    style={{ backgroundColor: '#00CED1', color: 'white' }}
                    className="text-base py-1 px-3"
                    data-testid={`team-${index}`}
                  >
                    {team}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* First Appearance Section */}
        {hero.firstAppearance && (
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
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
              >
                {hero.firstAppearance}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
