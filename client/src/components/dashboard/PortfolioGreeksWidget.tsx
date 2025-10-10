import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface GreekMetric {
  name: string;
  symbol: string;
  value: number;
  interpretation: string;
  status: 'positive' | 'negative' | 'neutral';
}

export function PortfolioGreeksWidget() {
  const greeks: GreekMetric[] = [
    {
      name: 'Delta',
      symbol: 'Δ',
      value: 245.8,
      interpretation: 'Portfolio moves $245.80 per $1 underlying change',
      status: 'positive'
    },
    {
      name: 'Gamma',
      symbol: 'Γ',
      value: 12.4,
      interpretation: 'Delta accelerates by 12.4 per $1 move',
      status: 'neutral'
    },
    {
      name: 'Theta',
      symbol: 'Θ',
      value: -142.50,
      interpretation: 'Losing $142.50 per day to time decay',
      status: 'negative'
    },
    {
      name: 'Vega',
      symbol: 'ν',
      value: 1850.0,
      interpretation: 'Portfolio gains $1,850 per 1% IV increase',
      status: 'positive'
    },
    {
      name: 'Rho',
      symbol: 'ρ',
      value: 78.3,
      interpretation: 'Portfolio gains $78.30 per 1% rate increase',
      status: 'neutral'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'neutral': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral': return <Activity className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const formatValue = (value: number) => {
    return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  };

  return (
    <Card data-testid="widget-portfolio-greeks">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Portfolio Greeks</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Risk exposure summary
            </p>
          </div>
          <Badge variant="outline">
            <Activity className="w-3 h-3 mr-1" />
            5 Metrics
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {greeks.map((greek) => (
            <div
              key={greek.name}
              className="p-3 rounded-lg border hover-elevate"
              data-testid={`greek-${greek.name.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(greek.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className=" text-sm">{greek.name}</p>
                      <Badge variant="outline" className="text-xs font-mono">
                        {greek.symbol}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className={`text-2xl  ${getStatusColor(greek.status)}`}>
                  {formatValue(greek.value)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{greek.interpretation}</p>
            </div>
          ))}
        </div>

        {/* Risk Summary */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-xs">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-muted-foreground mb-1">Directional Risk</p>
            <p className="text-lg  text-green-500">
              ${greeks.find(g => g.name === 'Delta')?.value.toFixed(2)}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-muted-foreground mb-1">Daily Theta Decay</p>
            <p className="text-lg  text-red-500">
              ${greeks.find(g => g.name === 'Theta')?.value.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-2">
            <Activity className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div className="text-xs">
              <p className=" text-yellow-500">Greeks Analysis</p>
              <p className="text-muted-foreground mt-1">
                Net long delta exposure with positive vega. Portfolio benefits from volatility expansion but experiences daily theta decay. 
                Consider delta-neutral adjustments if market direction uncertain.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
