import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MoverData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export function MarketMoversWidget() {
  const gainers: MoverData[] = [
    { symbol: 'SPIDEY', name: 'Spider-Man', price: 102.45, change: 8.90, changePercent: 9.51, volume: '12.3M' },
    { symbol: 'IRONM', name: 'Iron Man', price: 156.80, change: 11.20, changePercent: 7.69, volume: '8.7M' },
    { symbol: 'WWOND', name: 'Wonder Woman', price: 89.30, change: 5.40, changePercent: 6.44, volume: '6.2M' }
  ];

  const losers: MoverData[] = [
    { symbol: 'FLASH', name: 'The Flash', price: 67.20, change: -6.80, changePercent: -9.19, volume: '9.1M' },
    { symbol: 'HULK', name: 'The Hulk', price: 94.50, change: -5.30, changePercent: -5.31, volume: '7.4M' },
    { symbol: 'AQUAM', name: 'Aquaman', price: 54.10, change: -2.90, changePercent: -5.09, volume: '4.8M' }
  ];

  const active: MoverData[] = [
    { symbol: 'BATS', name: 'Batman', price: 187.60, change: 2.30, changePercent: 1.24, volume: '18.9M' },
    { symbol: 'SUPES', name: 'Superman', price: 198.40, change: -1.10, changePercent: -0.55, volume: '15.2M' },
    { symbol: 'SPIDEY', name: 'Spider-Man', price: 102.45, change: 8.90, changePercent: 9.51, volume: '12.3M' }
  ];

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;

  const MoverRow = ({ mover, type }: { mover: MoverData; type: 'gainer' | 'loser' | 'active' }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`mover-${mover.symbol.toLowerCase()}`}>
      <div className="flex-1">
        <p className="">{mover.symbol}</p>
        <p className="text-xs text-muted-foreground">{mover.name}</p>
      </div>
      <div className="text-right">
        <p className="">{formatPrice(mover.price)}</p>
        <div className={`flex items-center justify-end text-sm ${
          type === 'active' ? (mover.change >= 0 ? 'text-green-500' : 'text-red-500') :
          type === 'gainer' ? 'text-green-500' : 'text-red-500'
        }`}>
          {mover.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {formatChange(mover.change)} ({mover.changePercent.toFixed(2)}%)
        </div>
      </div>
      <p className="text-xs text-muted-foreground ml-4 w-16 text-right">{mover.volume}</p>
    </div>
  );

  return (
    <Card data-testid="widget-market-movers">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Market Movers</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Top performers today</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="gainers" data-testid="tab-gainers">
              <TrendingUp className="w-4 h-4 mr-2" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" data-testid="tab-losers">
              <TrendingDown className="w-4 h-4 mr-2" />
              Losers
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-most-active">
              <Activity className="w-4 h-4 mr-2" />
              Most Active
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="mt-4 space-y-2">
            {gainers.map(g => <MoverRow key={g.symbol} mover={g} type="gainer" />)}
          </TabsContent>
          <TabsContent value="losers" className="mt-4 space-y-2">
            {losers.map(l => <MoverRow key={l.symbol} mover={l} type="loser" />)}
          </TabsContent>
          <TabsContent value="active" className="mt-4 space-y-2">
            {active.map(a => <MoverRow key={a.symbol} mover={a} type="active" />)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
