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
        <CardHeader>
          <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Comic of the Day</span>
          </div>
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
        <CardHeader>
          <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Comic of the Day</span>
          </div>
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
      <CardHeader>
        <div className="flex items-center gap-2" style={{ fontFamily: 'Hind, sans-serif', fontWeight: '300', fontSize: '20pt' }}>
          <Star className="w-5 h-5 text-yellow-500" />
          <span>Comic of the Day</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-[#252B3C] p-4 rounded-lg">
        {/* Featured Comic Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Real Comic Cover from Marvel API - Clickable to Series Detail */}
          <Link href={`/series/${encodeURIComponent(comic.series)}`} data-testid="link-series-detail">
            <div className="w-32 aspect-[2/3] bg-muted rounded-lg overflow-visible shrink-0 border-2 border-white/40 green-rimlight-hover cursor-pointer">
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

        {/* Information Sections with Equal Spacing */}
        <div className="space-y-4">
        {/* Historical Context - Storytelling - Clickable to Detail Page */}
        <Link href={`/historical-significance/${comic.id}`} data-testid="link-historical-significance" className="block">
          <div className="bg-primary/5 border-2 border-green-500 rounded-lg p-4 green-rimlight-hover cursor-pointer overflow-visible">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2" style={{ fontSize: '15pt' }}>
              <Landmark className="w-4 h-4 text-amber-500" />
              Historical Significance
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {comic.historicalContext}
            </p>
          </div>
        </Link>

        {/* Description - About This Issue - Clickable to Issue Detail */}
        {comic.description && (
          <Link href={`/issue/${comic.id}`} data-testid="link-issue-detail" className="block">
            <div className="bg-primary/5 border-2 border-green-500 rounded-lg p-4 green-rimlight-hover cursor-pointer overflow-visible">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2" style={{ fontSize: '15pt' }}>
                <FileText className="w-4 h-4 text-blue-500" />
                About This Issue
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {comic.description}
              </p>
            </div>
          </Link>
        )}

        {/* Creators - Creative Team with White Rimlight */}
        {comic.creators && comic.creators.length > 0 && (
          <div className="bg-primary/5 border-2 border-green-500 rounded-lg p-4 green-rimlight-hover overflow-visible">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2" style={{ fontSize: '15pt' }}>
              <User className="w-4 h-4 text-purple-500" />
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
        </div>

        {/* Key Facts - One Orange Box Around All Items */}
        <div className="space-y-2 mt-6">
          <h4 className="font-semibold text-foreground">Quick Facts</h4>
          <div className="border-2 border-orange-500 rounded-lg p-4 bg-orange-500/5 orange-rimlight-hover overflow-visible">
            <ul className="space-y-3">
              {comic.isFirstIssue && (
                <li className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground">First issue of the series - highly collectible</span>
                </li>
              )}
              {comic.isKeyIssue && (
                <li className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground">Key issue with significant historical importance</span>
                </li>
              )}
              {comic.pageCount > 0 && (
                <li className="flex items-start gap-2 text-sm">
                  <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-foreground">{comic.pageCount} pages of storytelling excellence</span>
                </li>
              )}
              <li className="flex items-start gap-2 text-sm">
                <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  Value appreciation: {priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(0)}% from print price
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trading Actions */}
        <div className="flex gap-2 mt-6">
          <Link href={`/order-desk/${comic.id}`} data-testid="link-order-desk" className="flex-1">
            <div className="blue-white-rimlight-hover rounded-lg p-3 cursor-pointer overflow-visible flex items-center justify-center gap-2 font-semibold text-white" data-testid="button-trade-comic-of-day">
              <DollarSign className="w-4 h-4" />
              Trade Now
            </div>
          </Link>
          <Link href={`/issue/${comic.id}`} data-testid="link-learn-more" className="flex-1">
            <div className="orange-white-rimlight-hover rounded-lg p-3 cursor-pointer overflow-visible flex items-center justify-center gap-2 font-semibold text-white" data-testid="button-learn-more">
              Learn More
            </div>
          </Link>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
