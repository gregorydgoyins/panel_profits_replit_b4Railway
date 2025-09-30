import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export function OrderBookWidget() {
  const asks: OrderBookLevel[] = [
    { price: 120.50, size: 850, total: 850 },
    { price: 120.25, size: 1200, total: 2050 },
    { price: 120.00, size: 2500, total: 4550 },
    { price: 119.75, size: 1800, total: 6350 },
    { price: 119.50, size: 950, total: 7300 }
  ];

  const bids: OrderBookLevel[] = [
    { price: 119.25, size: 1100, total: 1100 },
    { price: 119.00, size: 2200, total: 3300 },
    { price: 118.75, size: 1600, total: 4900 },
    { price: 118.50, size: 2800, total: 7700 },
    { price: 118.25, size: 1300, total: 9000 }
  ];

  const maxTotal = Math.max(
    ...asks.map(a => a.total),
    ...bids.map(b => b.total)
  );

  const spread = asks[asks.length - 1].price - bids[0].price;
  const midPrice = (asks[asks.length - 1].price + bids[0].price) / 2;

  return (
    <Card data-testid="widget-order-book">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Level 2 Order Book</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              SPIDEY market depth
            </p>
          </div>
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            Spread: ${spread.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-red-500 mb-2">ASKS (SELL)</p>
          {[...asks].reverse().map((ask, idx) => (
            <div
              key={idx}
              className="relative"
              data-testid={`ask-${ask.price}`}
            >
              <div
                className="absolute right-0 h-full bg-red-500/10"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <div className="relative grid grid-cols-3 gap-2 py-1 px-2 text-xs font-mono">
                <span className="text-red-500 font-bold">${ask.price.toFixed(2)}</span>
                <span className="text-center">{ask.size}</span>
                <span className="text-right text-muted-foreground">{ask.total}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spread Indicator */}
        <div className="my-3 py-2 px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Mid Price:</span>
            <span className="font-bold text-yellow-500">${midPrice.toFixed(2)}</span>
            <span className="text-muted-foreground">Spread: ${spread.toFixed(2)}</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-green-500 mb-2">BIDS (BUY)</p>
          {bids.map((bid, idx) => (
            <div
              key={idx}
              className="relative"
              data-testid={`bid-${bid.price}`}
            >
              <div
                className="absolute right-0 h-full bg-green-500/10"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <div className="relative grid grid-cols-3 gap-2 py-1 px-2 text-xs font-mono">
                <span className="text-green-500 font-bold">${bid.price.toFixed(2)}</span>
                <span className="text-center">{bid.size}</span>
                <span className="text-right text-muted-foreground">{bid.total}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Column Headers */}
        <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <span>Price</span>
          <span className="text-center">Size</span>
          <span className="text-right">Total</span>
        </div>
      </CardContent>
    </Card>
  );
}
