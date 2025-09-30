import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';

interface CorrelationData {
  asset1: string;
  asset2: string;
  correlation: number;
}

export function CorrelationMatrixWidget() {
  const assets = ['SPIDEY', 'BATS', 'IRONM', 'WWOND', 'HULK'];
  
  const correlations: CorrelationData[] = [
    // SPIDEY correlations
    { asset1: 'SPIDEY', asset2: 'SPIDEY', correlation: 1.00 },
    { asset1: 'SPIDEY', asset2: 'BATS', correlation: 0.45 },
    { asset1: 'SPIDEY', asset2: 'IRONM', correlation: 0.78 },
    { asset1: 'SPIDEY', asset2: 'WWOND', correlation: 0.32 },
    { asset1: 'SPIDEY', asset2: 'HULK', correlation: 0.65 },
    // BATS correlations
    { asset1: 'BATS', asset2: 'SPIDEY', correlation: 0.45 },
    { asset1: 'BATS', asset2: 'BATS', correlation: 1.00 },
    { asset1: 'BATS', asset2: 'IRONM', correlation: 0.41 },
    { asset1: 'BATS', asset2: 'WWOND', correlation: 0.58 },
    { asset1: 'BATS', asset2: 'HULK', correlation: 0.39 },
    // IRONM correlations
    { asset1: 'IRONM', asset2: 'SPIDEY', correlation: 0.78 },
    { asset1: 'IRONM', asset2: 'BATS', correlation: 0.41 },
    { asset1: 'IRONM', asset2: 'IRONM', correlation: 1.00 },
    { asset1: 'IRONM', asset2: 'WWOND', correlation: 0.29 },
    { asset1: 'IRONM', asset2: 'HULK', correlation: 0.71 },
    // WWOND correlations
    { asset1: 'WWOND', asset2: 'SPIDEY', correlation: 0.32 },
    { asset1: 'WWOND', asset2: 'BATS', correlation: 0.58 },
    { asset1: 'WWOND', asset2: 'IRONM', correlation: 0.29 },
    { asset1: 'WWOND', asset2: 'WWOND', correlation: 1.00 },
    { asset1: 'WWOND', asset2: 'HULK', correlation: 0.24 },
    // HULK correlations
    { asset1: 'HULK', asset2: 'SPIDEY', correlation: 0.65 },
    { asset1: 'HULK', asset2: 'BATS', correlation: 0.39 },
    { asset1: 'HULK', asset2: 'IRONM', correlation: 0.71 },
    { asset1: 'HULK', asset2: 'WWOND', correlation: 0.24 },
    { asset1: 'HULK', asset2: 'HULK', correlation: 1.00 }
  ];

  const getCorrelation = (a1: string, a2: string): number => {
    const corr = correlations.find(c => c.asset1 === a1 && c.asset2 === a2);
    return corr?.correlation || 0;
  };

  const getCorrelationColor = (corr: number): string => {
    if (corr === 1) return 'bg-indigo-500/80 text-white';
    if (corr >= 0.7) return 'bg-red-500/80 text-white';
    if (corr >= 0.4) return 'bg-orange-500/60 text-white';
    if (corr >= 0.1) return 'bg-yellow-500/40 text-foreground';
    if (corr >= -0.1) return 'bg-muted text-muted-foreground';
    if (corr >= -0.4) return 'bg-blue-500/40 text-foreground';
    if (corr >= -0.7) return 'bg-blue-500/60 text-white';
    return 'bg-blue-500/80 text-white';
  };

  return (
    <Card data-testid="widget-correlation-matrix">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Correlation Matrix</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Asset relationship heat map
            </p>
          </div>
          <Badge variant="outline">
            <Network className="w-3 h-3 mr-1" />
            5 Assets
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="py-2 px-2"></th>
                {assets.map((asset) => (
                  <th key={asset} className="text-center py-2 px-2 font-semibold">
                    {asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((asset1) => (
                <tr key={asset1}>
                  <td className="py-2 px-2 font-semibold">{asset1}</td>
                  {assets.map((asset2) => {
                    const corr = getCorrelation(asset1, asset2);
                    return (
                      <td key={asset2} className="p-1">
                        <div 
                          className={`flex items-center justify-center h-10 rounded ${getCorrelationColor(corr)}`}
                          data-testid={`corr-${asset1}-${asset2}`}
                        >
                          <span className="font-bold">{corr.toFixed(2)}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Correlation Strength</p>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500/80 rounded" />
              <span>Strong Negative</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500/40 rounded" />
              <span>Weak Negative</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-muted rounded" />
              <span>No Correlation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500/40 rounded" />
              <span>Weak Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-500/60 rounded" />
              <span>Moderate Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500/80 rounded" />
              <span>Strong Positive</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
