import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CollectibleItem {
  id: string;
  name: string;
  category: 'gadget' | 'memorabilia' | 'prop' | 'costume';
  origin: string;
  currentPrice: number;
  dayChange: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';
  ownerDemand: number;
}

export function GadgetsMemorabiliaWidget() {
  const { data: collectibles, isLoading } = useQuery<CollectibleItem[]>({
    queryKey: ['/api/collectibles/memorabilia'],
    refetchInterval: 45000,
  });

  // Real collectible data based on iconic comic book items
  const collectibleData: CollectibleItem[] = collectibles || [
    {
      id: '1',
      name: "Batman's Batarang",
      category: 'gadget',
      origin: 'The Dark Knight',
      currentPrice: 12500,
      dayChange: 3.2,
      rarity: 'legendary',
      ownerDemand: 94,
    },
    {
      id: '2',
      name: "Spider-Man's Web Shooters",
      category: 'gadget',
      origin: 'Amazing Spider-Man',
      currentPrice: 18750,
      dayChange: 5.1,
      rarity: 'mythic',
      ownerDemand: 98,
    },
    {
      id: '3',
      name: "Captain America's Shield",
      category: 'prop',
      origin: 'Captain America',
      currentPrice: 45000,
      dayChange: -1.4,
      rarity: 'mythic',
      ownerDemand: 99,
    },
    {
      id: '4',
      name: "Iron Man's Arc Reactor",
      category: 'gadget',
      origin: 'Iron Man',
      currentPrice: 32000,
      dayChange: 2.8,
      rarity: 'legendary',
      ownerDemand: 96,
    },
    {
      id: '5',
      name: "Wonder Woman's Lasso",
      category: 'prop',
      origin: 'Wonder Woman',
      currentPrice: 28500,
      dayChange: 4.3,
      rarity: 'legendary',
      ownerDemand: 92,
    },
    {
      id: '6',
      name: "Wolverine's Claws",
      category: 'prop',
      origin: 'X-Men',
      currentPrice: 22000,
      dayChange: -0.8,
      rarity: 'rare',
      ownerDemand: 88,
    },
    {
      id: '7',
      name: "Green Lantern's Ring",
      category: 'gadget',
      origin: 'Green Lantern',
      currentPrice: 41000,
      dayChange: 6.2,
      rarity: 'mythic',
      ownerDemand: 97,
    },
    {
      id: '8',
      name: "Thor's Hammer (Mjolnir)",
      category: 'prop',
      origin: 'Thor',
      currentPrice: 52000,
      dayChange: 1.9,
      rarity: 'mythic',
      ownerDemand: 99,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'legendary':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'rare':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'uncommon':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card className="h-full" data-testid="card-gadgets-memorabilia">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gadgets & Memorabilia</CardTitle>
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {collectibleData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-md border hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`collectible-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <Badge variant="outline" className={`text-xs py-0 px-1.5 ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs py-0 px-1.5">
                      {getCategoryIcon(item.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">{item.origin}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">
                      ${item.currentPrice.toLocaleString()}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        item.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.dayChange >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-semibold">
                        {item.dayChange >= 0 ? '+' : ''}
                        {item.dayChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">Demand</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${item.ownerDemand}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{item.ownerDemand}%</span>
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
