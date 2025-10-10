import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ETFData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  aum: string;
  expense: number;
}

export function ComicETFsWidget() {
  const etfs: ETFData[] = [
    {
      symbol: 'MRVL',
      name: 'Marvel Universe ETF',
      price: 284.50,
      change: 12.30,
      changePercent: 4.52,
      volume: '8.2M',
      aum: '$2.4B',
      expense: 0.15
    },
    {
      symbol: 'DCLG',
      name: 'DC Legends Fund',
      price: 195.80,
      change: -3.20,
      changePercent: -1.61,
      volume: '5.1M',
      aum: '$1.8B',
      expense: 0.18
    },
    {
      symbol: 'INDI',
      name: 'Indie Comics Index',
      price: 87.40,
      change: 2.15,
      changePercent: 2.52,
      volume: '2.3M',
      aum: '$480M',
      expense: 0.22
    },
    {
      symbol: 'MNGA',
      name: 'Manga Masters Fund',
      price: 156.90,
      change: 8.70,
      changePercent: 5.87,
      volume: '6.8M',
      aum: '$1.2B',
      expense: 0.20
    }
  ];

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;

  return (
    <Card data-testid="widget-comic-etfs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Comic ETFs</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Diversified comic universe funds
            </p>
          </div>
          <Badge variant="outline">4 Funds</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {etfs.map((etf) => (
            <div
              key={etf.symbol}
              className="flex items-center justify-between p-3 rounded-md hover-elevate border"
              data-testid={`etf-${etf.symbol.toLowerCase()}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className=" text-lg">{etf.symbol}</span>
                  <Badge variant="secondary" className="text-xs">
                    {etf.expense}% ER
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{etf.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="">{formatPrice(etf.price)}</p>
                  <div className={`flex items-center text-sm ${etf.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {etf.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {formatChange(etf.change)} ({formatPercent(etf.changePercent)})
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Vol: {etf.volume}</p>
                  <p>AUM: {etf.aum}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
