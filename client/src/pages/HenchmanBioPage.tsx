import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Skull, Zap, ShieldAlert, Users, Swords, Crown } from 'lucide-react';
import { Link } from 'wouter';

interface HenchmanDetail {
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

export default function HenchmanBioPage() {
  const params = useParams();
  const henchmanId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: HenchmanDetail }>({
    queryKey: ['/api/narrative/villain', henchmanId],
    enabled: !!henchmanId,
  });

  const henchman = data?.data;

  const getHeroImageUrl = () => {
    return henchman?.primaryImageUrl || 
           henchman?.asset?.imageUrl || 
           henchman?.asset?.coverImageUrl || 
           '';
  };

  // For demo purposes, extract boss from teams (in real implementation, this would be a specific field)
  const boss = henchman?.teams?.[0] || null;

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

  if (error || !henchman) {
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
              <p className="text-muted-foreground">Henchman information not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const heroImageUrl = getHeroImageUrl();
  const accentColor = '#4a0080';

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
          
          {/* Henchman info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-4" style={{ backgroundColor: accentColor, color: 'white' }}>
              HENCHMAN
            </Badge>
            <h1 
              className="text-white mb-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '32pt' }}
            >
              {henchman.canonicalName}
            </h1>
            {henchman.realName && (
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                {henchman.realName}
              </p>
            )}
            <p 
              className="text-white/60 mt-2"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
            >
              {henchman.universe.toUpperCase()} Universe
            </p>
          </div>

          {/* Placeholder if no image */}
          {!heroImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skull className="w-64 h-64 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Boss/Allegiance Section - Unique to Henchmen */}
        {boss && (
          <Card className="!bg-[#1A1F2E] mb-8" style={{ borderColor: accentColor, borderWidth: '2px' }}>
            <CardHeader>
              <h2 
                className="flex items-center gap-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
              >
                <Crown className="w-6 h-6" style={{ color: accentColor }} />
                Boss / Allegiance
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center"
                  data-testid="img-boss-portrait"
                >
                  <Crown className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p 
                    className="text-muted-foreground mb-1"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                  >
                    Serves under:
                  </p>
                  <h3 
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', color: accentColor }}
                  >
                    {boss}
                  </h3>
                  <p 
                    className="text-foreground/70 mt-1"
                    style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}
                  >
                    Loyal enforcer and trusted operative
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alternate Images Gallery */}
        {henchman.alternateImageUrls && henchman.alternateImageUrls.length > 0 && (
          <div className="mb-8">
            <h2 
              className="mb-4"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}
            >
              Gallery
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {henchman.alternateImageUrls.map((url, index) => (
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
              {henchman.biography || `${henchman.canonicalName} is a loyal henchman in the ${henchman.universe} universe.`}
            </p>
          </CardContent>
        </Card>

        {/* Powers Section */}
        {henchman.powers.length > 0 && (
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
                {henchman.powers.map((power) => (
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
        {henchman.weaknesses.length > 0 && (
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
                {henchman.weaknesses.map((weakness) => (
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
        {henchman.enemies && henchman.enemies.length > 0 && (
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
                {henchman.enemies.map((enemy, index) => (
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

        {/* First Appearance */}
        {henchman.firstAppearance && (
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
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}
              >
                {henchman.firstAppearance}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
