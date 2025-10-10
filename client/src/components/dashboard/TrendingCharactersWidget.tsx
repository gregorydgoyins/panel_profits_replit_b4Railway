import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, User2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CharacterAsset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  imageUrl: string | null;
  description: string | null;
  metadata: any;
  price: string | null;
  percentChange: string | null;
  volume: number | null;
}

export default function TrendingCharactersWidget() {
  const { data: characters, isLoading } = useQuery<CharacterAsset[]>({
    queryKey: ["/api/characters/trending"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-indigo-900/30" data-testid="card-trending-characters-loading">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm  text-indigo-100 uppercase tracking-wider">
            Trending Characters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: string | null) => {
    if (!price) return "—";
    return `$${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatChange = (change: string | null) => {
    if (!change) return null;
    const changeNum = parseFloat(change);
    return {
      value: changeNum,
      formatted: `${changeNum > 0 ? '+' : ''}${changeNum.toFixed(2)}%`,
      isPositive: changeNum >= 0
    };
  };

  return (
    <Card className="bg-black/40 border-indigo-900/30 backdrop-blur-sm" data-testid="card-trending-characters">
      <CardHeader className="pb-3 border-b border-indigo-900/30">
        <CardTitle className="text-sm  text-indigo-100 uppercase tracking-wider flex items-center gap-2">
          <User2 className="h-4 w-4" />
          Trending Characters
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {characters && characters.length > 0 ? (
            characters.slice(0, 8).map((character) => {
              const changeData = formatChange(character.percentChange);
              
              return (
                <div
                  key={character.id}
                  className="flex items-center gap-3 p-2 rounded-md hover-elevate active-elevate-2 cursor-pointer"
                  data-testid={`character-item-${character.symbol}`}
                >
                  {character.imageUrl ? (
                    <img
                      src={character.imageUrl}
                      alt={character.name}
                      className="h-12 w-12 rounded-md object-cover border border-indigo-900/30"
                      data-testid={`img-character-${character.symbol}`}
                    />
                  ) : (
                    <div 
                      className="h-12 w-12 rounded-md bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center border border-indigo-900/30"
                      data-testid={`avatar-fallback-${character.symbol}`}
                    >
                      <User2 className="h-6 w-6 text-indigo-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className=" text-sm text-indigo-50 truncate" data-testid={`text-name-${character.symbol}`}>
                      {character.name}
                    </div>
                    <div className="text-xs text-indigo-400 font-mono" data-testid={`text-symbol-${character.symbol}`}>
                      {character.symbol}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm  text-indigo-100 font-mono" data-testid={`text-price-${character.symbol}`}>
                      {formatPrice(character.price)}
                    </div>
                    {changeData && (
                      <div
                        className={`flex items-center justify-end gap-1 text-xs font-mono ${
                          changeData.isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                        data-testid={`text-change-${character.symbol}`}
                      >
                        {changeData.isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {changeData.formatted}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-indigo-400/70" data-testid="empty-state-characters">
              <User2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No trending characters available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
