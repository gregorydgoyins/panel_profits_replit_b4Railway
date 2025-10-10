import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Circle } from 'lucide-react';

interface Sector {
  name: string;
  performance: number;
  status: 'leading' | 'lagging' | 'neutral';
  trend: 'up' | 'down' | 'flat';
}

export function SectorRotationWidget() {
  const sectors: Sector[] = [
    { name: 'Marvel Universe', performance: 8.4, status: 'leading', trend: 'up' },
    { name: 'DC Universe', performance: -2.1, status: 'lagging', trend: 'down' },
    { name: 'Independent Comics', performance: 5.2, status: 'leading', trend: 'up' },
    { name: 'Golden Age', performance: 1.3, status: 'neutral', trend: 'flat' },
    { name: 'Modern Age', performance: 6.7, status: 'leading', trend: 'up' },
    { name: 'Manga & Anime', performance: -0.8, status: 'lagging', trend: 'down' },
    { name: 'Graphic Novels', performance: 3.5, status: 'neutral', trend: 'up' },
    { name: 'Web Comics', performance: -1.5, status: 'lagging', trend: 'down' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'leading': return 'text-green-500';
      case 'lagging': return 'text-red-500';
      case 'neutral': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'leading': return 'bg-green-500/10 border-green-500/30';
      case 'lagging': return 'bg-red-500/10 border-red-500/30';
      case 'neutral': return 'bg-yellow-500/10 border-yellow-500/30';
      default: return 'bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'flat': return <Circle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const leading = sectors.filter(s => s.status === 'leading');
  const lagging = sectors.filter(s => s.status === 'lagging');

  return (
    <Card data-testid="widget-sector-rotation">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Sector Rotation</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Comic universe performance analysis
            </p>
          </div>
          <Badge variant="outline">
            {leading.length} Leading
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${getStatusBg(sector.status)} hover-elevate`}
              data-testid={`sector-${sector.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                {getTrendIcon(sector.trend)}
                <div>
                  <p className=" text-sm">{sector.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{sector.status}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg  ${getStatusColor(sector.status)}`}>
                  {sector.performance > 0 ? '+' : ''}{sector.performance}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rotation Summary */}
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3 text-xs">
          <div className="text-center p-2 rounded-lg bg-green-500/10">
            <p className=" text-green-500">{leading.length} Leading</p>
            <p className="text-muted-foreground mt-1">Strong momentum</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-500/10">
            <p className=" text-yellow-500">{sectors.filter(s => s.status === 'neutral').length} Neutral</p>
            <p className="text-muted-foreground mt-1">Consolidating</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-red-500/10">
            <p className=" text-red-500">{lagging.length} Lagging</p>
            <p className="text-muted-foreground mt-1">Underperforming</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
