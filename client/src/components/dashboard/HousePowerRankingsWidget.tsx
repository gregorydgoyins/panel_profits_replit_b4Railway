import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, TrendingDown } from 'lucide-react';

interface HouseData {
  rank: number;
  name: string;
  performance: number;
  avgReturn: number;
  assets: number;
  volume: string;
  trend: 'up' | 'down' | 'neutral';
}

export function HousePowerRankingsWidget() {
  const houses: HouseData[] = [
    { rank: 1, name: 'House Valor', performance: 12.4, avgReturn: 8.7, assets: 23, volume: '$2.8B', trend: 'up' },
    { rank: 2, name: 'House Industry', performance: 9.8, avgReturn: 7.2, assets: 18, volume: '$2.1B', trend: 'up' },
    { rank: 3, name: 'House Shadow', performance: 6.2, avgReturn: 5.1, assets: 15, volume: '$1.9B', trend: 'down' },
    { rank: 4, name: 'House Wonder', performance: 5.9, avgReturn: 4.8, assets: 12, volume: '$1.4B', trend: 'up' },
    { rank: 5, name: 'House Speed', performance: 3.1, avgReturn: 2.9, assets: 10, volume: '$890M', trend: 'down' },
    { rank: 6, name: 'House Cosmos', performance: 1.8, avgReturn: 1.5, assets: 8, volume: '$620M', trend: 'neutral' },
    { rank: 7, name: 'House Mysticism', performance: -0.5, avgReturn: -0.2, assets: 6, volume: '$410M', trend: 'down' }
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Crown className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Crown className="w-4 h-4 text-amber-700" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  return (
    <Card data-testid="widget-house-rankings">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">House Power Rankings</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Inter-house performance comparison
            </p>
          </div>
          <Badge variant="outline">7 Houses</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {houses.map((house) => (
            <div
              key={house.name}
              className={`flex items-center gap-3 p-3 rounded-md border hover-elevate ${
                house.rank <= 3 ? 'bg-indigo-500/5' : ''
              }`}
              data-testid={`house-${house.name.toLowerCase().replace(' ', '-')}`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankBadge(house.rank)}
              </div>

              {/* House Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="">{house.name}</p>
                  {house.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {house.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{house.assets} assets • {house.volume} volume</p>
              </div>

              {/* Performance */}
              <div className="text-right">
                <p className={` ${house.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {house.performance >= 0 ? '+' : ''}{house.performance}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg: {house.avgReturn >= 0 ? '+' : ''}{house.avgReturn}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-yellow-500" />
              <span>Top House</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>Rising</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span>Falling</span>
            </div>
          </div>
          <p>Updated: Live</p>
        </div>
      </CardContent>
    </Card>
  );
}
