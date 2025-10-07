import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown, DollarSign, Calendar, Book, User, Landmark, FileText } from 'lucide-react';

interface ComicOfTheDay {
  id: number;
  title: string;
  series: string;
  issueNumber: number;
  coverUrl: string;
  description: string;
  printPrice: number;
  estimatedValue: number;
  onsaleDate: string | null;
  creators: Array<{ name: string; role: string }>;
  pageCount: number;
  format: string;
  yearsOld: number;
  isFirstIssue: boolean;
  isKeyIssue: boolean;
  historicalContext: string;
  significance: string;
}

export function ComicOfTheDayWidget() {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: ComicOfTheDay }>({
    queryKey: ['/api/comic-covers/comic-of-the-day'],
    refetchInterval: 60 * 60 * 1000, // Refresh every hour
  });

  const comic = data?.data;

  if (isLoading || !comic) {
    return (
      <Card className="h-full !bg-[#1A1F2E] green-rimlight-hover">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', marginBottom: '-4px' }}>
            <Star className="w-5 h-5 text-green-500" />
            <span>Comic of the Day</span>
          </div>
          <p className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
            Featured key issue with historical significance
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-32 aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full !bg-[#1A1F2E] green-rimlight-hover">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', marginBottom: '-4px' }}>
            <Star className="w-5 h-5 text-green-500" />
            <span>Comic of the Day</span>
          </div>
          <p className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
            Featured key issue with historical significance
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Failed to load featured comic. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate price change (simulated market movement)
  const priceChangePercent = ((comic.estimatedValue - comic.printPrice) / comic.printPrice) * 100;

  return (
    <Card className="h-full !bg-[#1A1F2E] green-rimlight-hover" data-testid="widget-comic-of-the-day">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt', marginBottom: '-4px' }}>
          <Star className="w-5 h-5 text-green-500" />
          <span>Comic of the Day</span>
        </div>
        <p className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
          Featured key issue with historical significance
        </p>
      </CardHeader>
      <CardContent>
        <div className="bg-[#252B3C] p-4 rounded-lg">
        {/* Main Content Area - Image + Info Sections Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left Side - Larger Comic Cover */}
          <div className="lg:w-2/5">
            <Link href={`/series/${encodeURIComponent(comic.series)}`} data-testid="link-series-detail">
              <div className="w-full aspect-[2/3] bg-muted rounded-lg overflow-visible border-2 border-white/40 green-rimlight-hover cursor-pointer">
                {comic.coverUrl ? (
                  <img
                    src={comic.coverUrl}
                    alt={comic.title}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    data-testid="img-comic-of-the-day-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg">
                    <Book className="w-12 h-12 text-primary/50" />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Right Side - Comic Info + Information Sections */}
          <div className="lg:w-3/5 space-y-4">
            {/* Comic Title & Metadata */}
            <div className="space-y-3 pb-2">
              <div>
                <Badge className="mb-2 bg-yellow-500 text-black" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {comic.significance}
                </Badge>
                <h3 className="text-2xl text-foreground line-clamp-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {comic.title}
                </h3>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>{comic.series} #{comic.issueNumber}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {comic.onsaleDate && (
                  <Badge variant="outline" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(comic.onsaleDate).getFullYear()}
                  </Badge>
                )}
                <Badge variant="secondary" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {comic.yearsOld} years old
                </Badge>
                {comic.format && (
                  <Badge variant="secondary" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    {comic.format}
                  </Badge>
                )}
              </div>

              {/* Price and Valuation */}
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Print Price</p>
                  <p className="text-lg text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    ${comic.printPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>Estimated Value</p>
                    <p className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                      ${comic.estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Significance */}
            <Link href="/comic-of-day/historical" data-testid="link-comic-of-day-historical" className="block">
              <div className="bg-primary/5 border-2 border-green-500 rounded-lg p-4 green-rimlight-hover cursor-pointer overflow-visible">
                <h4 className="text-foreground flex items-center gap-2 mb-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                  <Landmark className="w-4 h-4 text-amber-500" />
                  Historical Significance
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                  {comic.historicalContext}
                </p>
              </div>
            </Link>

            {/* About This Issue */}
            {comic.description && (
              <Link href="/comic-of-day/about" data-testid="link-comic-of-day-about" className="block">
                <div className="bg-primary/5 border-2 border-green-500 rounded-lg p-4 green-rimlight-hover cursor-pointer overflow-visible">
                  <h4 className="text-foreground flex items-center gap-2 mb-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    About This Issue
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }}>
                    {comic.description}
                  </p>
                </div>
              </Link>
            )}

            {/* Creative Team */}
            {comic.creators && comic.creators.length > 0 && (
              <Link href="/comic-of-day/creators" data-testid="link-comic-of-day-creators" className="block">
                <div className="bg-primary/5 border-2 border-green-500 rounded-lg p-4 green-rimlight-hover cursor-pointer overflow-visible">
                  <h4 className="text-foreground flex items-center gap-2 mb-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '15pt' }}>
                    <User className="w-4 h-4 text-purple-500" />
                    Creative Team
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comic.creators.map((creator, idx) => (
                      <Badge key={idx} variant="outline" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300, fontSize: '13pt' }}>
                        {creator.name} <span className="text-muted-foreground ml-1" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>({creator.role})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Key Facts - One Orange Box Around All Items */}
        <div className="space-y-2 mt-6">
          <h4 className="text-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>Quick Facts</h4>
          <div className="border-2 border-orange-500 rounded-lg p-4 bg-orange-500/5 orange-rimlight-hover overflow-visible">
            <ul className="space-y-3">
              {comic.isFirstIssue && (
                <li className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <Link href={`/issue/${comic.id}`} data-testid="link-quick-fact-first-issue" className="text-foreground hover-elevate cursor-pointer transition-all duration-200" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    First issue of the series - highly collectible
                  </Link>
                </li>
              )}
              {comic.isKeyIssue && (
                <li className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <Link href={`/issue/${comic.id}`} data-testid="link-quick-fact-key-issue" className="text-foreground hover-elevate cursor-pointer transition-all duration-200" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    Key issue with significant historical importance
                  </Link>
                </li>
              )}
              {comic.pageCount > 0 && (
                <li className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <Link href={`/issue/${comic.id}`} data-testid="link-quick-fact-page-count" className="text-foreground hover-elevate cursor-pointer transition-all duration-200" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                    {comic.pageCount} pages of storytelling excellence
                  </Link>
                </li>
              )}
              <li className="flex items-start gap-2 text-sm">
                <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <Link href={`/issue/${comic.id}`} data-testid="link-quick-fact-value" className="text-foreground hover-elevate cursor-pointer transition-all duration-200" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Value appreciation: {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(0)}% from print price
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trading Actions */}
        <div className="flex gap-2 mt-6">
          <Link href={`/order-desk/${comic.id}`} data-testid="link-order-desk" className="flex-1">
            <div className="blue-white-rimlight-hover rounded-lg p-3 cursor-pointer overflow-visible flex items-center justify-center gap-2 text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }} data-testid="button-trade-comic-of-day">
              <DollarSign className="w-4 h-4" />
              Trade Now
            </div>
          </Link>
          <Link href={`/issue/${comic.id}`} data-testid="link-learn-more" className="flex-1">
            <div className="orange-white-rimlight-hover rounded-lg p-3 cursor-pointer overflow-visible flex items-center justify-center gap-2 text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300' }} data-testid="button-learn-more">
              Learn More
            </div>
          </Link>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
