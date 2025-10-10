import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PublisherData {
  publisher: string;
  marketShare: number;
  percentChange: number;
  totalAssets: number;
  avgPrice: number;
  volumeToday: number;
  logo?: string;
}

interface PublisherPerformanceWidgetProps {
  className?: string;
}

export function PublisherPerformanceWidget({ className }: PublisherPerformanceWidgetProps) {
  const { data: publishers = [], isLoading } = useQuery<PublisherData[]>({
    queryKey: ['/api/publishers/performance'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="markets-rimlight-hover p-6" data-testid="widget-publisher-loading">
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="flex items-center gap-2 mb-6 text-orange-100 font-light tracking-wider uppercase text-sm">
          <Building2 className="h-4 w-4" />
          Publisher Performance
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!publishers.length) {
    return (
      <Card className="markets-rimlight-hover p-6" data-testid="widget-publisher-empty">
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="flex items-center gap-2 mb-6 text-orange-100 font-light tracking-wider uppercase text-sm">
          <Building2 className="h-4 w-4" />
          Publisher Performance
        </div>
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Building2 className="h-12 w-12 text-orange-500/30 mb-4" />
          <p className="text-orange-300/60 text-sm font-light">
            No publisher data available
          </p>
        </div>
      </Card>
    );
  }

  const maxMarketShare = Math.max(...publishers.map(p => p.marketShare));

  return (
    <Card className="markets-rimlight-hover p-6" data-testid="widget-publisher-performance">
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-6 text-orange-100 font-light tracking-wider uppercase text-sm">
          <Building2 className="h-4 w-4" />
          Publisher Performance
        </div>

        <div className="space-y-4">
          {publishers.map((publisher, idx) => (
            <div
              key={publisher.publisher}
              className="bg-[#252B3C] border border-orange-900/30 rounded-md p-4 hover-elevate"
              data-testid={`publisher-${idx}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base text-orange-100" data-testid={`text-publisher-name-${idx}`}>
                      {publisher.publisher}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-orange-950/30 border-orange-800/30 text-orange-300"
                    >
                      {publisher.marketShare.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-orange-300/70">
                    <span>{publisher.totalAssets.toLocaleString()} assets</span>
                    <span className="text-orange-400/50">•</span>
                    <span>Avg ${publisher.avgPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className={`flex items-center gap-1 text-sm ${
                    publisher.percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {publisher.percentChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span data-testid={`text-change-${idx}`}>
                      {Math.abs(publisher.percentChange).toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-xs text-orange-400/50">
                    ${publisher.volumeToday.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Market Share Bar */}
              <div className="relative h-2 bg-[#1A1F2E] rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${(publisher.marketShare / maxMarketShare) * 100}%` }}
                  data-testid={`bar-share-${idx}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
