import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface HeatMapAsset {
  symbol: string;
  name: string;
  changePercent: number;
  volume: number;
  color: string;
}

export function ComicHeatMapWidget() {
  const [hoveredAsset, setHoveredAsset] = useState<HeatMapAsset | null>(null);

  const { data: heatMapData = [], isLoading } = useQuery<HeatMapAsset[]>({
    queryKey: ['/api/comic-assets/heat-map'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const getIntensity = (changePercent: number): number => {
    // Map change percentage to opacity (0.3 to 1.0)
    const absChange = Math.abs(changePercent);
    if (absChange > 10) return 1.0;
    if (absChange > 5) return 0.8;
    if (absChange > 2) return 0.6;
    return 0.4;
  };

  const getBackgroundColor = (asset: HeatMapAsset): string => {
    const intensity = getIntensity(asset.changePercent);
    if (asset.changePercent > 0) {
      return `rgba(34, 197, 94, ${intensity})`; // Green
    } else if (asset.changePercent < 0) {
      return `rgba(239, 68, 68, ${intensity})`; // Red
    }
    return `rgba(156, 163, 175, 0.3)`; // Gray for no change
  };

  const getTextColor = (changePercent: number): string => {
    const absChange = Math.abs(changePercent);
    // Use white text for strong colors, dark for light colors
    return absChange > 3 ? 'text-white' : 'text-foreground';
  };

  if (isLoading) {
    return (
      <Card data-testid="widget-comic-heat-map">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Comic Asset Heat Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="widget-comic-heat-map">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Comic Asset Heat Map
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          24-hour performance - size indicates trading volume
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
          {heatMapData.map((asset) => (
            <div
              key={asset.symbol}
              className="aspect-square rounded-md transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center p-2"
              style={{
                backgroundColor: getBackgroundColor(asset),
                minHeight: '80px',
              }}
              onMouseEnter={() => setHoveredAsset(asset)}
              onMouseLeave={() => setHoveredAsset(null)}
              data-testid={`heat-map-cell-${asset.symbol}`}
            >
              <div className={`text-center ${getTextColor(asset.changePercent)}`}>
                <div className="font-bold text-xs mb-1">{asset.symbol}</div>
                <div className="flex items-center justify-center gap-1">
                  {asset.changePercent > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : asset.changePercent < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  <span className="text-sm font-semibold">
                    {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hover details */}
        {hoveredAsset && (
          <div className="bg-card border border-border rounded-lg p-3 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{hoveredAsset.name}</div>
                <div className="text-sm text-muted-foreground">{hoveredAsset.symbol}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${hoveredAsset.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {hoveredAsset.changePercent >= 0 ? '+' : ''}{hoveredAsset.changePercent.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Vol: {hoveredAsset.volume.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }} />
            <span className="text-xs text-muted-foreground">Strong Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(156, 163, 175, 0.3)' }} />
            <span className="text-xs text-muted-foreground">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }} />
            <span className="text-xs text-muted-foreground">Strong Gain</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
