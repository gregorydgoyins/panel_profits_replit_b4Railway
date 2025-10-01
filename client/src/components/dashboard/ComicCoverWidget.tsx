import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Book } from 'lucide-react';

interface ComicAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  coverImageUrl?: string;
  issueNumber?: string;
  publisher?: string;
  year?: number;
}

export function ComicCoverWidget() {
  const { data: comics = [], isLoading } = useQuery<ComicAsset[]>({
    queryKey: ['/api/comic-assets/top'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const featuredComics = comics.slice(0, 6);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Featured Comic Covers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading comic covers...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" data-testid="widget-comic-covers">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          Featured Comic Covers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredComics.map((comic) => (
            <div
              key={comic.id}
              className="group relative aspect-[2/3] bg-card border border-border rounded-lg overflow-hidden hover-elevate cursor-pointer transition-all"
              data-testid={`comic-cover-${comic.symbol}`}
            >
              {/* Cover Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 flex items-center justify-center">
                <div className="text-center p-4">
                  <Book className="w-8 h-8 mx-auto mb-2 text-primary/50" />
                  <p className="text-xs font-bold text-foreground/70">{comic.symbol}</p>
                  {comic.issueNumber && (
                    <p className="text-[10px] text-muted-foreground">#{comic.issueNumber}</p>
                  )}
                </div>
              </div>

              {/* Hover Overlay with Trading Info */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                <p className="text-xs font-bold text-foreground mb-1">{comic.name}</p>
                {comic.publisher && (
                  <Badge variant="secondary" className="text-[10px] mb-2">
                    {comic.publisher}
                  </Badge>
                )}
                <p className="text-lg font-bold text-foreground">${comic.currentPrice.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-xs ${comic.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {comic.changePercent >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {comic.changePercent >= 0 ? '+' : ''}{comic.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
