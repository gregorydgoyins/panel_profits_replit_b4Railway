import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Zap, ShieldAlert, Users, Book, UserPlus } from 'lucide-react';
import { Link } from 'wouter';

interface SidekickDetail {
  id: string;
  canonicalName: string;
  realName: string | null;
  subtype: string;
  biography: string | null;
  primaryImageUrl: string | null;
  alternateImageUrls: string[] | null;
  teams: string[] | null;
  allies: string[] | null;
  mentorId: string | null;
  mentorName: string | null;
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

export default function SidekickBioPage() {
  const params = useParams();
  const sidekickId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: SidekickDetail }>({
    queryKey: ['/api/narrative/sidekick', sidekickId],
    enabled: !!sidekickId,
  });

  const sidekick = data?.data;

  const getHeroImageUrl = () => {
    return sidekick?.primaryImageUrl || 
           sidekick?.asset?.imageUrl || 
           sidekick?.asset?.coverImageUrl || 
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

  if (error || !sidekick) {
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
              <p className="text-muted-foreground">Sidekick information not found.</p>
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
          
          {/* Sidekick info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-4" style={{ backgroundColor: '#001f3f', color: 'white' }}>
              SIDEKICK
            </Badge>
            <h1 
              className="text-white mb-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt' }}
            >
              {sidekick.canonicalName}
            </h1>
            {sidekick.realName && (
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                {sidekick.realName}
              </p>
            )}
            <p 
              className="text-white/60 mt-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
            >
              {sidekick.universe.toUpperCase()} Universe
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
        {sidekick.alternateImageUrls && sidekick.alternateImageUrls.length > 0 && (
          <div className="mb-8">
            <h2 
              className="mb-4"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              Gallery
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {sidekick.alternateImageUrls.map((imageUrl, index) => (
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
        {sidekick.biography && (
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
                {sidekick.biography}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mentor Section */}
        {sidekick.mentorName && sidekick.mentorId && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <UserPlus className="w-6 h-6" style={{ color: '#001f3f' }} />
                Mentor
              </h2>
            </CardHeader>
            <CardContent>
              <Link href={`/superhero/${sidekick.mentorId}`} data-testid="link-mentor">
                <div className="flex items-center gap-4 p-4 rounded-lg border hover-elevate cursor-pointer" style={{ borderColor: '#001f3f' }}>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Shield className="w-8 h-8" style={{ color: '#001f3f' }} />
                  </div>
                  <div>
                    <p 
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#001f3f'
                      }}
                    >
                      {sidekick.mentorName}
                    </p>
                    <p className="text-muted-foreground text-sm">View Superhero Profile</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Powers Section */}
        {sidekick.powers && sidekick.powers.length > 0 && (
          <Card className="mb-8 !bg-[#1A1F2E]">
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Zap className="w-6 h-6" style={{ color: '#001f3f' }} />
                Powers
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sidekick.powers.map((power) => (
                  <div 
                    key={power.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: '#001f3f', backgroundColor: 'rgba(0, 31, 63, 0.1)' }}
                    data-testid={`power-${power.id}`}
                  >
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Hind, sans-serif', 
                        fontWeight: '300', 
                        fontSize: '15pt',
                        color: '#001f3f'
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
                        style={{ color: '#001f3f' }}
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
        {sidekick.weaknesses && sidekick.weaknesses.length > 0 && (
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
                {sidekick.weaknesses.map((weakness) => (
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
        {sidekick.allies && sidekick.allies.length > 0 && (
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
                {sidekick.allies.map((ally, index) => (
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
        {sidekick.teams && sidekick.teams.length > 0 && (
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
                {sidekick.teams.map((team, index) => (
                  <Badge 
                    key={index}
                    style={{ backgroundColor: '#001f3f', color: 'white' }}
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
        {sidekick.firstAppearance && (
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
                {sidekick.firstAppearance}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
