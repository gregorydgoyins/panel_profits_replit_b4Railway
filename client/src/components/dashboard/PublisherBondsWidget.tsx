import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp } from 'lucide-react';

interface Bond {
  publisher: string;
  coupon: number;
  maturity: string;
  price: number;
  yield: number;
  rating: string;
}

export function PublisherBondsWidget() {
  const bonds: Bond[] = [
    {
      publisher: 'Marvel Comics',
      coupon: 4.5,
      maturity: '2028',
      price: 98.2,
      yield: 4.8,
      rating: 'AA'
    },
    {
      publisher: 'DC Comics',
      coupon: 5.0,
      maturity: '2030',
      price: 102.5,
      yield: 4.6,
      rating: 'AA-'
    },
    {
      publisher: 'Image Comics',
      coupon: 6.25,
      maturity: '2027',
      price: 95.8,
      yield: 6.8,
      rating: 'A+'
    },
    {
      publisher: 'Dark Horse',
      coupon: 5.75,
      maturity: '2029',
      price: 97.3,
      yield: 6.1,
      rating: 'A'
    }
  ];

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('AA')) return 'text-green-500';
    if (rating.startsWith('A')) return 'text-blue-500';
    if (rating.startsWith('B')) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card data-testid="widget-publisher-bonds">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Publisher Bonds</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Fixed-income comic securities
            </p>
          </div>
          <Badge variant="outline">
            <Building2 className="w-3 h-3 mr-1" />
            {bonds.length} Bonds
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bonds.map((bond, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border hover-elevate"
              data-testid={`bond-${bond.publisher.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{bond.publisher}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${getRatingColor(bond.rating)}`}>
                      {bond.rating}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {bond.coupon}% • Matures {bond.maturity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${bond.price}</p>
                  <p className="text-xs text-muted-foreground">Price</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs">
                  <span className="text-muted-foreground">Coupon Rate:</span>{' '}
                  <span className="font-semibold">{bond.coupon}%</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Yield:</span>{' '}
                  <span className="font-semibold text-green-500">{bond.yield}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Summary */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Avg Yield</p>
            <p className="text-lg font-bold text-green-500">
              {(bonds.reduce((sum, b) => sum + b.yield, 0) / bonds.length).toFixed(2)}%
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Portfolio Value</p>
            <p className="text-lg font-bold">
              ${(bonds.reduce((sum, b) => sum + b.price, 0) * 1000).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bond Info */}
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-green-500">Fixed Income</p>
              <p className="text-muted-foreground mt-1">
                Publisher bonds provide stable returns with lower volatility. 
                Average credit rating: A+ with yields ranging 4.6% to 6.8%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
