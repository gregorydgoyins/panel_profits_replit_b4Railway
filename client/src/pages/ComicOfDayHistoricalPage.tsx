import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Calendar, Award, TrendingUp, Star, Info } from 'lucide-react';

export default function ComicOfDayHistoricalPage() {
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

  const currentPrice = comic.estimatedValue || 199.99;
  const printPrice = comic.printPrice || 3.99;
  const priceChange = currentPrice - printPrice;
  const priceChangePercent = ((priceChange / printPrice) * 100);

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
        <h1 className="text-4xl  text-foreground mb-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
          Historical Significance
        </h1>
        <p className="text-xl text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
          {comic.title} - {comic.series} #{comic.issueNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden border-4 border-orange-500/30 shadow-2xl orange-rimlight-hover">
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

          {/* Quick Stats */}
          <Card className="mt-4 bg-[#1A1F2E] orange-rimlight-hover">
            <CardHeader>
              <CardTitle className="text-sm" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Release Date:</span>
                <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {comic.onsaleDate ? new Date(comic.onsaleDate).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Current Value:</span>
                <span className="text-green-500" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>${currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Print Price:</span>
                <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>${printPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Appreciation:</span>
                <span className="text-green-500" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  +{priceChangePercent.toFixed(0)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Historical Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Historical Significance */}
          <Card className="bg-[#1A1F2E] orange-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <BookOpen className="w-5 h-5 text-orange-500" />
                Why This Comic Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                {comic.significance || comic.historicalContext || 
                  `This groundbreaking issue represents a pivotal moment in comic book history. ${comic.title} has become a cornerstone of the medium, influencing countless creators and stories that followed.`}
              </p>
            </CardContent>
          </Card>

          {/* Historical Context */}
          <Card className="bg-[#1A1F2E] orange-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <Calendar className="w-5 h-5 text-blue-500" />
                Historical Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                {comic.historicalContext || 
                  `Published during a transformative era in comics, this issue pushed the boundaries of sequential storytelling. The creative team's innovative approach set new standards for character development, visual narrative, and thematic depth that continue to resonate with readers today.`}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
                  <Award className="w-6 h-6 text-blue-500 mb-2" />
                  <h4 className="text-sm mb-1" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Critical Acclaim</h4>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Widely praised upon release, cementing its legendary status
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border-2 border-purple-500/30 rounded-lg">
                  <Star className="w-6 h-6 text-purple-500 mb-2" />
                  <h4 className="text-sm mb-1" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Cultural Impact</h4>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Influenced popular culture far beyond comic books
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Perspective */}
          <Card className="bg-[#1A1F2E] green-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <TrendingUp className="w-5 h-5 text-green-500" />
                Investment & Collectibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                From a collector and investor perspective, this issue has demonstrated exceptional value appreciation over time. Its historical significance, combined with limited availability, makes it a cornerstone piece for serious collections.
              </p>
              <div className="space-y-2 mt-4">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Exceptional value appreciation: {priceChangePercent.toFixed(0)}% increase from original print price
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Limited availability in high-grade condition
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Recognized by industry experts as essential to serious collections
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <p className="text-sm text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    Strong market demand and historical price stability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="bg-[#1A1F2E] purple-rimlight-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
                <Info className="w-5 h-5 text-purple-500" />
                Expert Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '12pt' }}>
                This comic is essential reading for anyone interested in understanding the evolution of sequential art and storytelling. Whether you're a collector, investor, or enthusiast, this issue deserves a place in your collection as both a cultural artifact and a sound investment in comic book history.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
