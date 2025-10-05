import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown, DollarSign, Calendar, Book, User } from 'lucide-react';

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
      <Card className="h-full !bg-[#1A1F2E] white-rimlight-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Comic of the Day
          </CardTitle>
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
      <Card className="h-full !bg-[#1A1F2E] white-rimlight-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Comic of the Day
          </CardTitle>
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
    <Card className="h-full !bg-[#1A1F2E] white-rimlight-hover" data-testid="widget-comic-of-the-day">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Comic of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Comic Header */}
        <div className="flex items-start gap-4">
          {/* Real Comic Cover from Marvel API - Clickable to Series Detail */}
          <Link href={`/series/${encodeURIComponent(comic.series)}`} data-testid="link-series-detail">
            <div className="w-32 aspect-[2/3] bg-muted rounded-lg overflow-visible shrink-0 border-2 border-border white-rimlight-hover cursor-pointer">
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

          {/* Comic Info */}
          <div className="flex-1 space-y-3">
            <div>
              <Badge className="mb-2 bg-yellow-500 text-black">
                {comic.significance}
              </Badge>
              <h3 className="text-2xl font-bold text-foreground line-clamp-2">
                {comic.title}
              </h3>
              <p className="text-sm text-muted-foreground">{comic.series} #{comic.issueNumber}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {comic.onsaleDate && (
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(comic.onsaleDate).getFullYear()}
                </Badge>
              )}
              <Badge variant="secondary">
                {comic.yearsOld} years old
              </Badge>
              {comic.format && (
                <Badge variant="secondary">
                  {comic.format}
                </Badge>
              )}
            </div>

            {/* Price and Valuation */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Print Price</p>
                <p className="text-lg font-semibold text-foreground">
                  ${comic.printPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <TrendingUp className="w-4 h-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                  <p className="text-2xl font-bold">
                    ${comic.estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Context - Storytelling - Clickable to Detail Page */}
        <Link href={`/historical-significance/${comic.id}`} data-testid="link-historical-significance">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 white-rimlight-hover cursor-pointer overflow-visible">
            <p className="text-sm font-semibold text-primary mb-2">Historical Significance</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {comic.historicalContext}
            </p>
          </div>
        </Link>

        {/* Description - About This Issue - Clickable to Issue Detail */}
        {comic.description && (
          <Link href={`/issue/${comic.id}`} data-testid="link-issue-detail">
            <div className="space-y-2 border border-border rounded-lg p-4 white-rimlight-hover cursor-pointer overflow-visible">
              <h4 className="font-semibold text-foreground">About This Issue</h4>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {comic.description}
              </p>
            </div>
          </Link>
        )}

        {/* Creators - Creative Team with White Rimlight */}
        {comic.creators && comic.creators.length > 0 && (
          <div className="space-y-2 bg-primary/5 border border-primary/10 rounded-lg p-4 white-rimlight-hover overflow-visible">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Creative Team
            </h4>
            <div className="flex flex-wrap gap-2">
              {comic.creators.map((creator, idx) => (
                <Link key={idx} href={`/creator/${encodeURIComponent(creator.name)}`} data-testid={`link-creator-${idx}`}>
                  <Badge variant="outline" className="text-xs white-rimlight-hover cursor-pointer overflow-visible">
                    {creator.name} <span className="text-muted-foreground ml-1">({creator.role})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Key Facts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Quick Facts</h4>
          <ul className="space-y-3">
            {comic.isFirstIssue && (
              <li className="border-2 border-orange-500 rounded-lg p-3 bg-orange-500/5 orange-rimlight-hover overflow-visible">
                <div className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground underline decoration-orange-500 decoration-2">First issue of the series - highly collectible</span>
                </div>
              </li>
            )}
            {comic.isKeyIssue && (
              <li className="border-2 border-orange-500 rounded-lg p-3 bg-orange-500/5 orange-rimlight-hover overflow-visible">
                <div className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground underline decoration-orange-500 decoration-2">Key issue with significant historical importance</span>
                </div>
              </li>
            )}
            {comic.pageCount > 0 && (
              <li className="border-2 border-orange-500 rounded-lg p-3 bg-orange-500/5 orange-rimlight-hover overflow-visible">
                <div className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground underline decoration-orange-500 decoration-2">{comic.pageCount} pages of storytelling excellence</span>
                </div>
              </li>
            )}
            <li className="border-2 border-orange-500 rounded-lg p-3 bg-orange-500/5 orange-rimlight-hover overflow-visible">
              <div className="flex items-start gap-2 text-sm">
                <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-foreground underline decoration-orange-500 decoration-2">
                  Value appreciation: {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(0)}% from print price
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Trading Actions */}
        <div className="flex gap-2">
          <Link href={`/order-desk/${comic.id}`} data-testid="link-order-desk" className="flex-1">
            <div className="blue-rimlight-hover rounded-lg p-3 bg-blue-500/10 cursor-pointer overflow-visible flex items-center justify-center gap-2 text-foreground font-semibold" data-testid="button-trade-comic-of-day">
              <DollarSign className="w-4 h-4" />
              Trade Now
            </div>
          </Link>
          <Button variant="outline" data-testid="button-view-details">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
