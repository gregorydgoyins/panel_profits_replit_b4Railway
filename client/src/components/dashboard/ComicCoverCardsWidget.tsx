import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComicAssetCard {
  id: string;
  symbol: string;
  name: string;
  coverImageUrl: string | null;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  marketTrend: 'up' | 'down' | 'stable';
  historicalSignificance: string;
  whySpecial: string;
  gradeCondition?: string;
  firstAppearance?: string;
  keyCreators?: string[];
  publisher?: string;
}

export function ComicCoverCardsWidget() {
  const { data: comics, isLoading } = useQuery<ComicAssetCard[]>({
    queryKey: ['/api/comic-assets/top'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="col-span-full" data-testid="comic-cover-cards-widget">
        <CardHeader>
          <CardTitle>Top Comic Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-2">
                <div className="aspect-[2/3] bg-muted animate-pulse rounded-md" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!comics || comics.length === 0) {
    return (
      <Card className="col-span-full" data-testid="comic-cover-cards-widget">
        <CardHeader>
          <CardTitle>Top Comic Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No comic assets available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full" data-testid="comic-cover-cards-widget">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top Comic Assets
          <Badge variant="secondary" className="ml-auto">
            Live Pricing
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {comics.slice(0, 12).map((comic) => (
            <TooltipProvider key={comic.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="group cursor-pointer space-y-2 hover-elevate active-elevate-2 rounded-lg p-2 transition-all"
                    data-testid={`comic-card-${comic.symbol}`}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[2/3] bg-muted rounded-md overflow-hidden border border-border">
                      {comic.coverImageUrl ? (
                        <img
                          src={comic.coverImageUrl}
                          alt={comic.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
                          <span className="text-xs text-center text-muted-foreground px-2">
                            {comic.symbol}
                          </span>
                        </div>
                      )}
                      
                      {/* Grade Badge */}
                      {comic.gradeCondition && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                            {comic.gradeCondition}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Trend Indicator */}
                      <div className="absolute bottom-2 left-2">
                        {getTrendIcon(comic.marketTrend)}
                      </div>
                    </div>

                    {/* Asset Info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-medium truncate" title={comic.name}>
                          {comic.symbol}
                        </span>
                        <Info className="w-3 h-3 text-muted-foreground shrink-0" />
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold">
                          {formatPrice(comic.currentPrice)}
                        </span>
                      </div>
                      
                      {/* Change */}
                      <div className={`text-xs ${getChangeColor(comic.dayChangePercent)}`}>
                        {comic.dayChangePercent > 0 ? '+' : ''}
                        {comic.dayChangePercent.toFixed(2)}%
                      </div>
                      
                      {/* Volume */}
                      <div className="text-xs text-muted-foreground">
                        Vol: {formatVolume(comic.volume)}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold">{comic.name}</h4>
                      {comic.publisher && (
                        <p className="text-xs text-muted-foreground">{comic.publisher}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-yellow-400">Why Special:</p>
                      <p className="text-xs text-muted-foreground">{comic.whySpecial}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium">Historical Significance:</p>
                      <p className="text-xs text-muted-foreground">{comic.historicalSignificance}</p>
                    </div>
                    
                    {comic.keyCreators && comic.keyCreators.length > 0 && (
                      <div>
                        <p className="text-xs font-medium">Key Creators:</p>
                        <p className="text-xs text-muted-foreground">
                          {comic.keyCreators.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
