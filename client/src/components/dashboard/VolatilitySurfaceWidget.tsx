import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface VolPoint {
  strike: number;
  expiry: string;
  iv: number;
}

export function VolatilitySurfaceWidget() {
  // Generate volatility surface data
  const strikes = [90, 95, 100, 105, 110];
  const expiries = ['1W', '1M', '3M', '6M'];
  
  const volData: VolPoint[] = [];
  expiries.forEach((expiry, expIdx) => {
    strikes.forEach((strike) => {
      // Simplified vol smile/skew model
      const atm = 100;
      const skew = Math.abs(strike - atm) * 0.15;
      const termStructure = expIdx * 2;
      const baseVol = 25 + termStructure;
      const iv = baseVol + skew;
      volData.push({ strike, expiry, iv });
    });
  });

  const getVolColor = (iv: number) => {
    if (iv < 25) return 'bg-blue-500/80';
    if (iv < 30) return 'bg-green-500/80';
    if (iv < 35) return 'bg-yellow-500/80';
    if (iv < 40) return 'bg-orange-500/80';
    return 'bg-red-500/80';
  };

  const getVolTextColor = (iv: number) => {
    if (iv < 25) return 'text-blue-400';
    if (iv < 30) return 'text-green-400';
    if (iv < 35) return 'text-yellow-400';
    if (iv < 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card data-testid="widget-volatility-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Volatility Surface</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Implied volatility across strikes & expirations
            </p>
          </div>
          <Badge variant="outline">
            <Activity className="w-3 h-3 mr-1" />
            Live IV
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* 3D Surface Simulation */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Strike</th>
                {expiries.map((exp) => (
                  <th key={exp} className="text-center py-2 px-3">{exp}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {strikes.map((strike) => (
                <tr key={strike} className="border-b">
                  <td className="py-2 px-3 ">${strike}</td>
                  {expiries.map((expiry) => {
                    const point = volData.find(v => v.strike === strike && v.expiry === expiry);
                    if (!point) return <td key={expiry} />;
                    
                    return (
                      <td key={expiry} className="text-center py-2 px-3">
                        <div className={`inline-block px-3 py-1 rounded ${getVolColor(point.iv)}`}>
                          <span className=" text-white">{point.iv.toFixed(1)}%</span>
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
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">IV Range:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500/80 rounded" />
              <span className="text-blue-400">&lt;25%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500/80 rounded" />
              <span className="text-green-400">25-30%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500/80 rounded" />
              <span className="text-yellow-400">30-35%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500/80 rounded" />
              <span className="text-orange-400">35-40%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/80 rounded" />
              <span className="text-red-400">&gt;40%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">ATM IV: 28.4%</p>
        </div>
      </CardContent>
    </Card>
  );
}
