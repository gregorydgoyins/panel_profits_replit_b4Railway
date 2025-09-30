import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';

interface LEAPSOption {
  symbol: string;
  strike: number;
  expiry: string;
  type: 'CALL' | 'PUT';
  premium: number;
  delta: number;
  iv: number;
  daysToExpiry: number;
}

export function LEAPSWidget() {
  const leaps: LEAPSOption[] = [
    {
      symbol: 'SPIDEY',
      strike: 120,
      expiry: 'Jan 2026',
      type: 'CALL',
      premium: 1850,
      delta: 0.68,
      iv: 32.4,
      daysToExpiry: 456
    },
    {
      symbol: 'BATMAN',
      strike: 95,
      expiry: 'Jun 2026',
      type: 'CALL',
      premium: 2340,
      delta: 0.72,
      iv: 28.9,
      daysToExpiry: 638
    },
    {
      symbol: 'IRONM',
      strike: 80,
      expiry: 'Dec 2025',
      type: 'PUT',
      premium: 980,
      delta: -0.42,
      iv: 35.1,
      daysToExpiry: 365
    },
    {
      symbol: 'WWOND',
      strike: 110,
      expiry: 'Mar 2026',
      type: 'CALL',
      premium: 1620,
      delta: 0.61,
      iv: 30.7,
      daysToExpiry: 547
    }
  ];

  return (
    <Card data-testid="widget-leaps">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">LEAPS Trading</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Long-term equity options (1+ year)
            </p>
          </div>
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            {leaps.length} Contracts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaps.map((leap, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border hover-elevate"
              data-testid={`leaps-${leap.symbol}-${idx}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {leap.symbol}
                  </Badge>
                  <Badge className={leap.type === 'CALL' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                    {leap.type}
                  </Badge>
                  <span className="text-sm font-semibold">${leap.strike}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${leap.premium}</p>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-muted-foreground">Expiry:</span>{' '}
                    <span className="font-semibold">{leap.expiry}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DTE:</span>{' '}
                    <span className="font-semibold">{leap.daysToExpiry}d</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-muted-foreground">Δ:</span>{' '}
                    <span className="font-semibold">{leap.delta.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">IV:</span>{' '}
                    <span className="font-semibold">{leap.iv}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LEAPS Info */}
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-blue-500">Long-Term Strategy</p>
              <p className="text-muted-foreground mt-1">
                LEAPS provide leverage for directional plays with reduced time decay. 
                Average DTE: {Math.round(leaps.reduce((sum, l) => sum + l.daysToExpiry, 0) / leaps.length)} days.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
