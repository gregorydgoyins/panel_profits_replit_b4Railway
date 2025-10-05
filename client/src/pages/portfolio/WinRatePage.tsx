import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award } from 'lucide-react';
import { Link } from 'wouter';

export default function WinRatePage() {
  const { data: performance } = useQuery({
    queryKey: ['/api/portfolio/performance'],
  });

  const winRate = (performance as any)?.winRate || 0;
  const totalTrades = (performance as any)?.totalTrades || 0;
  const winningTrades = Math.round((totalTrades * winRate) / 100);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Win Rate
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10 text-lime-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Trading Success Rate
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
            {winRate.toFixed(1)}%
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Total Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {totalTrades.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Winning Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {winningTrades.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Losing Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {(totalTrades - winningTrades).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              What is Win Rate?
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Win Rate measures the percentage of your closed trades that resulted in a profit. A higher win rate 
              indicates better trade selection and timing. Professional traders typically aim for a win rate above 
              50%, though profitability also depends on the size of wins versus losses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
