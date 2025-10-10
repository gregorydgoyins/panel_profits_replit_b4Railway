import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Skull, Star, Building2, Link as LinkIcon } from 'lucide-react';
import { Link } from 'wouter';

interface SeriesDetail {
  seriesName: string;
  publisher: string;
  year: number;
  description: string;
  heroes: string[];
  villains: string[];
  sidekicks: string[];
  henchmen: string[];
  teams: string[];
  connectedAssets: Array<{
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
  }>;
}

export default function SeriesDetailPage() {
  const params = useParams();
  const seriesName = decodeURIComponent(params.series || '');

  const { data, isLoading, error } = useQuery<{ success: boolean; data: SeriesDetail }>({
    queryKey: ['/api/series/detail', seriesName],
    enabled: !!seriesName,
  });

  const series = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-20 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse w-32" />
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Series not found. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Series Overview */}
            <Card className="!bg-[#1A1F2E]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl  mb-2">{series.seriesName}</CardTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-base">
                        <Building2 className="w-4 h-4 mr-2" />
                        {series.publisher}
                      </Badge>
                      {series.year && (
                        <Badge variant="secondary" className="text-base">
                          {series.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {series.description || 'A legendary comic book series that has captivated readers for generations.'}
                </p>
              </CardContent>
            </Card>

            {/* Characters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heroes */}
              {series.heroes && series.heroes.length > 0 && (
                <Card className="!bg-[#1A1F2E]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-500">
                      <Shield className="w-5 h-5" />
                      Heroes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {series.heroes.map((hero, idx) => (
                        <div key={idx} className="text-sm text-foreground/80 flex items-center gap-2">
                          <Star className="w-3 h-3 text-green-500" />
                          {hero}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Villains */}
              {series.villains && series.villains.length > 0 && (
                <Card className="!bg-[#1A1F2E]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                      <Skull className="w-5 h-5" />
                      Villains
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {series.villains.map((villain, idx) => (
                        <div key={idx} className="text-sm text-foreground/80 flex items-center gap-2">
                          <Star className="w-3 h-3 text-red-500" />
                          {villain}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sidekicks */}
              {series.sidekicks && series.sidekicks.length > 0 && (
                <Card className="!bg-[#1A1F2E]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-500">
                      <Users className="w-5 h-5" />
                      Sidekicks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {series.sidekicks.map((sidekick, idx) => (
                        <div key={idx} className="text-sm text-foreground/80 flex items-center gap-2">
                          <Star className="w-3 h-3 text-blue-500" />
                          {sidekick}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Henchmen */}
              {series.henchmen && series.henchmen.length > 0 && (
                <Card className="!bg-[#1A1F2E]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-500">
                      <Users className="w-5 h-5" />
                      Henchmen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {series.henchmen.map((henchman, idx) => (
                        <div key={idx} className="text-sm text-foreground/80 flex items-center gap-2">
                          <Star className="w-3 h-3 text-orange-500" />
                          {henchman}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Teams */}
            {series.teams && series.teams.length > 0 && (
              <Card className="!bg-[#1A1F2E]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Affiliated Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {series.teams.map((team, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Connected Assets */}
          <div className="space-y-6">
            <Card className="!bg-[#1A1F2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Connected Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {series.connectedAssets && series.connectedAssets.length > 0 ? (
                  <div className="space-y-3">
                    {series.connectedAssets.map((asset) => (
                      <div key={asset.id} className="border border-border rounded-lg p-3 hover-elevate cursor-pointer" data-testid={`asset-${asset.id}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className=" text-foreground text-sm">{asset.symbol}</p>
                            <p className="text-xs text-muted-foreground">{asset.name}</p>
                          </div>
                          <p className="text-lg  text-green-500">
                            ${asset.currentPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No connected assets available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
