import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function FearGreedWidget() {
  const fearGreedScore = 68;
  const sentiment = fearGreedScore >= 75 ? 'Extreme Greed' :
                   fearGreedScore >= 55 ? 'Greed' :
                   fearGreedScore >= 45 ? 'Neutral' :
                   fearGreedScore >= 25 ? 'Fear' : 'Extreme Fear';
  
  const color = fearGreedScore >= 75 ? 'text-red-500' :
                fearGreedScore >= 55 ? 'text-orange-500' :
                fearGreedScore >= 45 ? 'text-yellow-500' :
                fearGreedScore >= 25 ? 'text-blue-500' : 'text-indigo-500';

  const bgColor = fearGreedScore >= 75 ? 'bg-red-500/20' :
                  fearGreedScore >= 55 ? 'bg-orange-500/20' :
                  fearGreedScore >= 45 ? 'bg-yellow-500/20' :
                  fearGreedScore >= 25 ? 'bg-blue-500/20' : 'bg-indigo-500/20';

  const indicators = [
    { name: 'Market Momentum', value: 72, trend: 'up' },
    { name: 'Stock Price Strength', value: 65, trend: 'up' },
    { name: 'Market Breadth', value: 58, trend: 'down' },
    { name: 'Put/Call Ratio', value: 43, trend: 'down' },
    { name: 'VIX Level', value: 38, trend: 'up' },
    { name: 'Safe Haven Demand', value: 52, trend: 'neutral' }
  ];

  return (
    <Card data-testid="widget-fear-greed">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Fear & Greed Index</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Market sentiment gauge</p>
          </div>
          <Badge className={color}>{sentiment}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Thermometer Visualization */}
          <div className="flex items-center gap-6 py-4">
            {/* Thermometer */}
            <div className="relative w-12 h-64 bg-muted rounded-full overflow-hidden border-2 border-border">
              {/* Thermometer bulb */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-muted border-2 border-border -mb-5" />
              
              {/* Thermometer fill - gradient from bottom to top */}
              <div className="absolute bottom-0 left-0 right-0 transition-all duration-500" style={{ height: `${fearGreedScore}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 via-blue-500 via-yellow-500 via-orange-500 to-red-500" />
              </div>
              
              {/* Thermometer tick marks */}
              <div className="absolute inset-0 flex flex-col justify-between py-2">
                {[100, 75, 50, 25, 0].map((tick) => (
                  <div key={tick} className="w-full h-px bg-border" />
                ))}
              </div>
            </div>

            {/* Score Display */}
            <div className="flex-1">
              <div className="text-center mb-4">
                <p className={`text-6xl  ${color}`} data-testid="text-fear-greed-score">{fearGreedScore}</p>
                <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                <p className={`mt-2 text-xl  ${color}`}>{sentiment}</p>
              </div>
              
              {/* Scale labels */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-red-500">Extreme Greed</span>
                  <span className="text-muted-foreground">75-100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500">Greed</span>
                  <span className="text-muted-foreground">55-75</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500">Neutral</span>
                  <span className="text-muted-foreground">45-55</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-500">Fear</span>
                  <span className="text-muted-foreground">25-45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-500">Extreme Fear</span>
                  <span className="text-muted-foreground">0-25</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm  mb-3">Contributing Indicators</p>
            {indicators.map((ind) => (
              <div key={ind.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {ind.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {ind.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                  {ind.trend === 'neutral' && <Minus className="w-3 h-3 text-muted-foreground" />}
                  <span className="text-muted-foreground">{ind.name}</span>
                </div>
                <span className="">{ind.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
