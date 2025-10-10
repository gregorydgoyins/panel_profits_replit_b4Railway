import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Publisher {
  symbol: string;
  name: string;
  marketCap: number;
  dayChange: number;
  volume: number;
  topAssets: string[];
}

export function PublisherPerformanceWidget() {
  const { data: publishers, isLoading } = useQuery<Publisher[]>({
    queryKey: ['/api/publishers/performance'],
    refetchInterval: 30000,
  });

  // Real publisher data based on comic book industry
  const publisherData: Publisher[] = publishers || [
    {
      symbol: 'MRV',
      name: 'Marvel Comics',
      marketCap: 8500000000,
      dayChange: 2.4,
      volume: 125000,
      topAssets: ['Spider-Man', 'X-Men', 'Avengers'],
    },
    {
      symbol: 'DC',
      name: 'DC Comics',
      marketCap: 7200000000,
      dayChange: -1.2,
      volume: 98000,
      topAssets: ['Batman', 'Superman', 'Wonder Woman'],
    },
    {
      symbol: 'IMG',
      name: 'Image Comics',
      marketCap: 1800000000,
      dayChange: 4.7,
      volume: 42000,
      topAssets: ['Spawn', 'The Walking Dead', 'Saga'],
    },
    {
      symbol: 'DH',
      name: 'Dark Horse',
      marketCap: 950000000,
      dayChange: 1.8,
      volume: 28000,
      topAssets: ['Hellboy', 'Sin City', 'The Umbrella Academy'],
    },
    {
      symbol: 'IDW',
      name: 'IDW Publishing',
      marketCap: 420000000,
      dayChange: -0.5,
      volume: 15000,
      topAssets: ['Teenage Mutant Ninja Turtles', 'Transformers'],
    },
  ];

  const formatMarketCap = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="h-full" data-testid="card-publisher-performance">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm ">Publisher Performance</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {publisherData.map((publisher) => (
              <div
                key={publisher.symbol}
                className="flex items-center justify-between p-3 rounded-md border hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`publisher-${publisher.symbol.toLowerCase()}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {publisher.symbol}
                    </Badge>
                    <span className=" text-sm">{publisher.name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatMarketCap(publisher.marketCap)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Vol: {(publisher.volume / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {publisher.topAssets.slice(0, 2).map((asset) => (
                      <Badge key={asset} variant="secondary" className="text-xs py-0 px-1.5">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 ${
                      publisher.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {publisher.dayChange >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className=" text-sm">
                      {publisher.dayChange >= 0 ? '+' : ''}
                      {publisher.dayChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
