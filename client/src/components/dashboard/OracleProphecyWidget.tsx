import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export function OracleProphecyWidget() {
  const prophecy = {
    title: "The Seven Houses Align in Twilight",
    message: "The cosmic forces reveal a convergence of momentum in House Valor assets. Today's prophecy: Spider-Man's web strengthens as the masses seek heroic exposure. The Iron Forges glow with institutional demand. Beware the Shadow's pull on Gotham's knight - volatility looms after 3PM EST.",
    confidence: 87,
    timeframe: "Today, Sep 30",
    topPicks: [
      { symbol: 'SPIDEY', house: 'Valor', signal: 'Strong Buy', bias: '+4.2%' },
      { symbol: 'IRONM', house: 'Industry', signal: 'Buy', bias: '+2.8%' },
      { symbol: 'BATS', house: 'Shadow', signal: 'Caution', bias: '-1.5%' }
    ]
  };

  return (
    <Card className="border-indigo-500/30" data-testid="widget-oracle-prophecy">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <CardTitle className="text-lg">Oracle's Daily Prophecy</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Mythological market wisdom</p>
            </div>
          </div>
          <Badge variant="outline" className="text-indigo-400 border-indigo-500/50">
            {prophecy.confidence}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Prophecy */}
        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <h3 className=" text-indigo-400 mb-2">{prophecy.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "{prophecy.message}"
          </p>
          <p className="text-xs text-muted-foreground mt-3">— {prophecy.timeframe}</p>
        </div>

        {/* Top Picks */}
        <div className="space-y-2">
          <p className="text-sm ">Oracle's Picks</p>
          {prophecy.topPicks.map((pick) => (
            <div
              key={pick.symbol}
              className="flex items-center justify-between p-3 rounded-md border hover-elevate"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="">{pick.symbol}</span>
                  <Badge variant="secondary" className="text-xs">
                    House {pick.house}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pick.signal}</p>
              </div>
              <div className="text-right">
                <p className={` text-sm ${
                  pick.bias.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {pick.bias}
                </p>
                <p className="text-xs text-muted-foreground">Expected</p>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
          <div className="text-xs">
            <p className=" text-yellow-500">Oracle's Warning</p>
            <p className="text-muted-foreground mt-1">
              Market volatility may spike during Power Hour. House Shadow assets show elevated risk.
            </p>
          </div>
        </div>

        {/* Action */}
        <Button className="w-full" variant="outline" data-testid="button-view-full-analysis">
          <Sparkles className="w-4 h-4 mr-2" />
          View Full Oracle Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
