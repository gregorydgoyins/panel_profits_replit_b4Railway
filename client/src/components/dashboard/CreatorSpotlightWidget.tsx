import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Pen, TrendingUp, TrendingDown, User2 } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  symbol: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  metadata: any;
  price: number | null;
  percentChange: number | null;
  volume: number | null;
}

export default function CreatorSpotlightWidget() {
  const { data: creators, isLoading } = useQuery<Creator[]>({
    queryKey: ["/api/creators/spotlight"],
    refetchInterval: 30000,
  });

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentChange = (change: number | null) => {
    if (!change) return null;
    const isPositive = change > 0;
    return (
      <span className={`flex items-center gap-1 text-xs font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  const getCreatorRole = (metadata: any) => {
    if (!metadata) return "Creator";
    if (metadata.role) return metadata.role;
    if (metadata.roles && Array.isArray(metadata.roles)) {
      return metadata.roles.join(", ");
    }
    return "Writer/Artist";
  };

  const getNotableWorks = (metadata: any) => {
    if (!metadata) return null;
    if (metadata.notableWorks && Array.isArray(metadata.notableWorks)) {
      return metadata.notableWorks.slice(0, 2).join(", ");
    }
    if (metadata.notable_works) {
      return metadata.notable_works.slice(0, 2).join(", ");
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950/95 via-indigo-950/30 to-purple-950/20 border-indigo-900/30" data-testid="widget-creator-spotlight">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base  text-indigo-50">
          <Pen className="h-4 w-4 text-indigo-400" />
          CREATOR SPOTLIGHT
        </CardTitle>
        <p className="text-xs text-indigo-400/70 font-mono">Hot Writers & Artists</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-md bg-indigo-950/20 animate-pulse"
                  data-testid={`skeleton-creator-${i}`}
                >
                  <div className="h-12 w-12 rounded-md bg-indigo-900/30" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-indigo-900/30 rounded w-2/3" />
                    <div className="h-2 bg-indigo-900/30 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : creators && creators.length > 0 ? (
            creators.map((creator) => {
              const role = getCreatorRole(creator.metadata);
              const notableWorks = getNotableWorks(creator.metadata);
              
              return (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 p-2 rounded-md hover-elevate active-elevate-2 cursor-pointer"
                  data-testid={`creator-item-${creator.symbol}`}
                >
                  {creator.imageUrl ? (
                    <img
                      src={creator.imageUrl}
                      alt={creator.name}
                      className="h-12 w-12 rounded-md object-cover border border-indigo-900/30"
                      data-testid={`img-creator-${creator.symbol}`}
                    />
                  ) : (
                    <div 
                      className="h-12 w-12 rounded-md bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center border border-indigo-900/30"
                      data-testid={`avatar-fallback-${creator.symbol}`}
                    >
                      <Pen className="h-6 w-6 text-indigo-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className=" text-sm text-indigo-50 truncate" data-testid={`text-name-${creator.symbol}`}>
                      {creator.name}
                    </div>
                    <div className="text-xs text-indigo-400/70 font-mono truncate" data-testid={`text-role-${creator.symbol}`}>
                      {role}
                    </div>
                    {notableWorks && (
                      <div className="text-xs text-indigo-400/50 truncate mt-0.5" data-testid={`text-works-${creator.symbol}`}>
                        {notableWorks}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="text-sm font-mono  text-indigo-50" data-testid={`text-price-${creator.symbol}`}>
                      {formatPrice(creator.price)}
                    </div>
                    <div data-testid={`text-change-${creator.symbol}`}>
                      {formatPercentChange(creator.percentChange)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-indigo-400/70" data-testid="empty-state-creators">
              <Pen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No creators in spotlight</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
