import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, MessageSquare, Palette, Lightbulb, Quote, Star } from 'lucide-react';

export default function ComicOfDayAboutPage() {
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
          About This Issue
        </h1>
        <p className="text-xl text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
          {comic.title} - {comic.series} #{comic.issueNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden border-4 border-blue-500/30 shadow-2xl blue-rimlight-hover">
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

          {/* Publication Details */}
          <Card className="mt-4 bg-[#1A1F2E] blue-rimlight-hover">
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Publication Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Format:</span>
                <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{comic.format || 'Comic'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Page Count:</span>
                <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{comic.pageCount || 32} pages</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Print Price:</span>
                <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>${(comic.printPrice || 3.99).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Age:</span>
                <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{comic.yearsOld || 0} years</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Issue Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synopsis */}
          <Card className="bg-[#1A1F2E] blue-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <BookOpen className="w-5 h-5 text-blue-500" />
                Story Synopsis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                {comic.description || 
                  `This compelling issue weaves together action, drama, and character development in a masterful display of sequential storytelling. The narrative pushes the boundaries of what readers expect, delivering both thrilling moments and thoughtful exploration of deeper themes.`}
              </p>
            </CardContent>
          </Card>

          {/* Plot Summary */}
          <Card className="bg-[#1A1F2E] purple-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <MessageSquare className="w-5 h-5 text-purple-500" />
                Plot Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                This issue explores deeper themes of heroism, sacrifice, and the human condition. The narrative weaves together multiple character arcs, creating a rich tapestry of storytelling that rewards both casual readers and dedicated fans alike.
              </p>
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                The character development is exceptional. Each hero faces personal challenges that test not just their powers, but their principles. The protagonist's journey from doubt to determination forms the emotional core of the story, while supporting characters provide depth and nuance to the overall narrative.
              </p>
            </CardContent>
          </Card>

          {/* Art & Writing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1A1F2E] pink-rimlight-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                  <Palette className="w-5 h-5 text-pink-500" />
                  Art Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  The visual presentation is stunning, with dynamic panel layouts and expressive character work. The artist's use of color and shadow creates atmosphere while maintaining clarity in the action sequences.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1F2E] orange-rimlight-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  Writing Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  The dialogue feels natural and character-driven, with each voice distinctly their own. The pacing balances action with quieter character moments, creating a satisfying rhythm throughout.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Themes */}
          <Card className="bg-[#1A1F2E] green-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Themes & Motifs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                Central themes include the weight of responsibility, the cost of heroism, and the importance of hope in dark times. Recurring visual motifs of light and shadow reinforce the story's exploration of moral complexity.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Badge variant="outline" className="justify-center">Responsibility</Badge>
                <Badge variant="outline" className="justify-center">Heroism</Badge>
                <Badge variant="outline" className="justify-center">Hope</Badge>
                <Badge variant="outline" className="justify-center">Sacrifice</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notable Quotes */}
          <Card className="bg-[#1A1F2E] yellow-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <Quote className="w-5 h-5 text-yellow-500" />
                Notable Quotes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="italic text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                  "With great power comes great responsibility"
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="italic text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                  "It's not about being perfect. It's about doing what's right."
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="italic text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                  "Heroes aren't born. They're made in moments of crisis."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Collector's Notes */}
          <Card className="bg-[#1A1F2E] purple-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <Star className="w-5 h-5 text-purple-500" />
                Collector's Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                This issue is highly sought after by collectors for its pivotal story developments and iconic cover art. First printings in mint condition command premium prices in the market. Key factors affecting value include issue number significance, creator lineup, and historical importance to the overall series.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
