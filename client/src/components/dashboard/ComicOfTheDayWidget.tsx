import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Book } from 'lucide-react';

interface ComicOfTheDay {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume?: number;
  publisher?: string;
  year?: number;
  description?: string;
  keyFacts: string[];
  whyFeatured: string;
}

export function ComicOfTheDayWidget() {
  const { data: assets = [] } = useQuery<any[]>({
    queryKey: ['/api/comic-assets/top'],
    refetchInterval: 60000,
  });

  // Select the top performer as comic of the day
  const comicOfTheDay: ComicOfTheDay | null = assets.length > 0 ? {
    id: assets[0].id,
    symbol: assets[0].symbol,
    name: assets[0].name,
    currentPrice: assets[0].currentPrice || 0,
    changePercent: assets[0].changePercent || 0,
    volume: assets[0].volume,
    publisher: 'Marvel Comics',
    year: 1962,
    description: 'One of the most iconic and valuable comic assets in the market, representing decades of storytelling excellence and cultural impact.',
    keyFacts: [
      'First appearance marked a revolutionary moment in comic history',
      'Multiple story arcs spanning decades of publication',
      'Significant cinematic universe representation',
      'High collector demand and market liquidity',
    ],
    whyFeatured: 'Showing exceptional market performance with strong trading volume and positive sentiment.',
  } : null;

  if (!comicOfTheDay) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Comic of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading featured comic...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" data-testid="widget-comic-of-the-day">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Comic of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Comic Header */}
        <div className="flex items-start gap-4">
          {/* Cover Placeholder */}
          <div className="w-32 aspect-[2/3] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg flex items-center justify-center shrink-0">
            <Book className="w-12 h-12 text-primary/50" />
          </div>

          {/* Comic Info */}
          <div className="flex-1 space-y-3">
            <div>
              <Badge className="mb-2">Featured</Badge>
              <h3 className="text-2xl font-bold text-foreground">{comicOfTheDay.name}</h3>
              <p className="text-sm text-muted-foreground">{comicOfTheDay.symbol}</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary">
                {comicOfTheDay.publisher}
              </Badge>
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                {comicOfTheDay.year}
              </Badge>
            </div>

            {/* Price and Performance */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold text-foreground">
                  ${comicOfTheDay.currentPrice.toLocaleString()}
                </p>
              </div>
              <div className={`flex items-center gap-2 ${comicOfTheDay.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {comicOfTheDay.changePercent >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="text-xl font-bold">
                  {comicOfTheDay.changePercent >= 0 ? '+' : ''}{comicOfTheDay.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">About This Comic</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {comicOfTheDay.description}
          </p>
        </div>

        {/* Key Facts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Key Facts</h4>
          <ul className="space-y-2">
            {comicOfTheDay.keyFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why Featured */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-primary mb-1">Why Featured Today</p>
          <p className="text-sm text-foreground/80">{comicOfTheDay.whyFeatured}</p>
        </div>

        {/* Trading Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" data-testid="button-trade-comic-of-day">
            <DollarSign className="w-4 h-4 mr-2" />
            Trade Now
          </Button>
          <Button variant="outline" data-testid="button-view-details">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
