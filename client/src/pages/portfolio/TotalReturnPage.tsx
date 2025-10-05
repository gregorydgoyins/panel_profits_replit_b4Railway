import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'wouter';

export default function TotalReturnPage() {
  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
  });

  const totalReturn = (portfolio as any)?.totalReturnPercent || 0;
  const totalReturnValue = (portfolio as any)?.totalReturn || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Total Return
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              All-Time Return
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`} style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
            {totalReturn >= 0 ? <ArrowUpRight className="w-12 h-12 text-green-500" /> : <ArrowDownRight className="w-12 h-12 text-red-500" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Dollar Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalReturnValue >= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {totalReturnValue >= 0 ? '+' : ''}${totalReturnValue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {totalReturn >= 0 ? 'Positive' : 'Negative'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              What is Total Return?
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Total Return measures the overall performance of your portfolio from inception to the present day. 
              It includes all realized gains from closed positions as well as unrealized gains from current holdings, 
              expressed as a percentage of your initial investment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
