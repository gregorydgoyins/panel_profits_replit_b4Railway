import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FeaturedComic {
  id: number;
  title: string;
  series: string;
  issueNumber: number;
  coverUrl: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  symbol: string;
}

export function FeaturedComicsSection() {
  const { data, isLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ['/api/comic-covers/key-issues?limit=6'],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const comics = data?.data?.slice(0, 6) || [];

  // Transform comics to include pricing data
  const featuredComics: FeaturedComic[] = comics.map((comic, index) => {
    // Generate ticker symbol from series and issue - filter out special characters
    const seriesAbbrev = comic.series
      ?.split(' ')
      .map((w: string) => w[0])
      .filter((char: string) => /[A-Za-z0-9]/.test(char))
      .join('')
      .toUpperCase() || 'CMC';
    const symbol = `${seriesAbbrev}.V1.#${comic.issueNumber || index + 1}`;
    
    // Generate realistic price data
    const basePrice = comic.estimatedValue || (Math.random() * 500 + 50);
    const priceChange = (Math.random() - 0.5) * 20;
    const priceChangePercent = (priceChange / basePrice) * 100;

    return {
      id: comic.id,
      title: comic.title,
      series: comic.series,
      issueNumber: comic.issueNumber,
      coverUrl: comic.coverUrl,
      currentPrice: basePrice,
      priceChange,
      priceChangePercent,
      symbol,
    };
  });

  if (isLoading || comics.length === 0) {
    return (
      <div className="bg-[#1A1F2E] rounded-lg p-6 pink-rimlight-hover overflow-visible">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Featured Comics</h3>
        <div className="bg-[#252B3C] p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1F2E] rounded-lg p-6 pink-rimlight-hover overflow-visible">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Featured Comics</h3>
      
      <div className="bg-[#252B3C] p-4 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredComics.map((comic) => (
            <Link 
              key={comic.id} 
              href={`/comic-bio/${comic.id}`}
              data-testid={`link-featured-comic-${comic.id}`}
            >
              <div className="group cursor-pointer">
                {/* Comic Cover with Pink Rimlight Hover and Active State */}
                <div className="aspect-[2/3] bg-muted rounded-lg overflow-visible mb-3 pink-rimlight-hover active:brightness-125 transition-all">
                  {comic.coverUrl ? (
                    <img
                      src={comic.coverUrl}
                      alt={comic.title}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No Cover
                    </div>
                  )}
                </div>

                {/* Ticker Label - No Text Wrap */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground truncate" title={comic.symbol}>
                    {comic.symbol}
                  </div>
                  
                  {/* Price with Movement Icon */}
                  <div className="flex items-center gap-1 text-xs">
                    {comic.priceChangePercent >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500 shrink-0" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 shrink-0" />
                    )}
                    <span className={comic.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                      ${comic.currentPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
