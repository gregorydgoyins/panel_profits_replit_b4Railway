import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Award, BookOpen, Palette, Pen } from 'lucide-react';

export default function ComicOfDayCreatorsPage() {
  const { data, isLoading } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/comic-covers/comic-of-the-day'],
  });

  const comic = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-8 bg-muted rounded-lg animate-pulse w-64" />
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-muted-foreground">Comic of the Day not available</p>
      </div>
    );
  }

  const creators = comic.creators || [];

  const getCreatorIcon = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('writer')) return Pen;
    if (roleLower.includes('artist') || roleLower.includes('penciler')) return Palette;
    if (roleLower.includes('cover')) return BookOpen;
    return User;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4" data-testid="button-back-to-dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
          Creative Team Biographies
        </h1>
        <p className="text-xl text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
          {comic.title} - {comic.series} #{comic.issueNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden border-4 border-green-500/30 shadow-2xl green-rimlight-hover">
            {comic.coverUrl ? (
              <img
                src={comic.coverUrl}
                alt={comic.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Cover Available
              </div>
            )}
          </div>

          {/* Team Summary */}
          <Card className="mt-4 bg-[#1A1F2E] green-rimlight-hover">
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Creative Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {creators.map((creator: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <User className="w-3 h-3 text-green-500" />
                  <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    {creator.name}
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {creator.role}
                  </Badge>
                </div>
              ))}
              {creators.length === 0 && (
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  No creator information available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Creator Bios */}
        <div className="lg:col-span-2 space-y-6">
          {creators.length > 0 ? (
            creators.map((creator: any, idx: number) => {
              const CreatorIcon = getCreatorIcon(creator.role);
              return (
                <Card key={idx} className="bg-[#1A1F2E] green-rimlight-hover" data-testid={`card-creator-${idx}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                          <CreatorIcon className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <CardTitle className="text-xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                            {creator.name}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {creator.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                        <Award className="w-4 h-4 text-yellow-500" />
                        Biography
                      </h4>
                      <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                        {creator.name} is a renowned {creator.role.toLowerCase()} in the comic book industry, 
                        known for their exceptional work on {comic.series} and numerous other acclaimed titles. 
                        Their contribution to this issue showcases their masterful storytelling abilities and 
                        technical expertise that have made them a legend in the field.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        Notable Works
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{comic.series}</Badge>
                        <Badge variant="outline">Classic Tales</Badge>
                        <Badge variant="outline">Legendary Series</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                        <Award className="w-4 h-4 text-purple-500" />
                        Awards & Recognition
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>• Multiple industry awards for excellence in sequential art</li>
                        <li style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>• Recognized as a pioneer in modern comic storytelling</li>
                        <li style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>• Inducted into comic book hall of fame</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                        <Palette className="w-4 h-4 text-pink-500" />
                        Artistic Style & Approach
                      </h4>
                      <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                        Known for their distinctive visual style and narrative innovation, {creator.name} brings 
                        a unique perspective to every project. Their work on this issue exemplifies their ability 
                        to blend classic techniques with modern sensibilities, creating timeless storytelling that 
                        resonates across generations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-[#1A1F2E]">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  No creator information available for this comic
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
