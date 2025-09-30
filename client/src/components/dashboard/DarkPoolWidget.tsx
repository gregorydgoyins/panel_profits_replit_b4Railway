import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface DarkPoolTrade {
  symbol: string;
  size: number;
  price: number;
  timestamp: string;
  premium: number;
  type: 'buy' | 'sell';
}

export function DarkPoolWidget() {
  const trades: DarkPoolTrade[] = [
    {
      symbol: 'SPIDEY',
      size: 250000,
      price: 118.50,
      timestamp: '10:34:21',
      premium: 2.5,
      type: 'buy'
    },
    {
      symbol: 'BATMAN',
      size: 180000,
      price: 96.75,
      timestamp: '10:28:15',
      premium: 1.8,
      type: 'sell'
    },
    {
      symbol: 'IRONM',
      size: 320000,
      price: 142.30,
      timestamp: '10:22:03',
      premium: 3.2,
      type: 'buy'
    },
    {
      symbol: 'WWOND',
      size: 150000,
      price: 88.90,
      timestamp: '10:15:47',
      premium: 1.5,
      type: 'buy'
    },
    {
      symbol: 'HULK',
      size: 275000,
      price: 104.25,
      timestamp: '10:09:32',
      premium: 2.8,
      type: 'sell'
    }
  ];

  const totalVolume = trades.reduce((sum, t) => sum + t.size, 0);
  const totalValue = trades.reduce((sum, t) => sum + (t.size * t.price), 0);

  return (
    <Card data-testid="widget-dark-pool">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Dark Pool Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Off-exchange institutional trades
            </p>
          </div>
          <Badge variant="outline">
            <EyeOff className="w-3 h-3 mr-1" />
            {trades.length} Prints
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trades.map((trade, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${trade.type === 'buy' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'} hover-elevate`}
              data-testid={`dark-pool-${trade.symbol}-${idx}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {trade.symbol}
                  </Badge>
                  <Badge className={trade.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                    {trade.type.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{trade.timestamp}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Size</p>
                  <p className="font-bold">{(trade.size / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Price</p>
                  <p className="font-bold">${trade.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Premium</p>
                  <p className={`font-bold ${trade.premium > 2 ? 'text-red-500' : 'text-yellow-500'}`}>
                    {trade.premium.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="text-lg font-bold">{(totalVolume / 1000000).toFixed(2)}M</p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-lg font-bold">${(totalValue / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-purple-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-purple-500">Institutional Flow</p>
              <p className="text-muted-foreground mt-1">
                {trades.filter(t => t.type === 'buy').length} buy prints vs {trades.filter(t => t.type === 'sell').length} sell prints. 
                Net institutional sentiment: {trades.filter(t => t.type === 'buy').length > trades.filter(t => t.type === 'sell').length ? 'Bullish' : 'Bearish'}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
