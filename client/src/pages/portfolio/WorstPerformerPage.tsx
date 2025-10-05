import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingDown, ArrowDownRight } from 'lucide-react';
import { Link } from 'wouter';

export default function WorstPerformerPage() {
  const { data: holdings } = useQuery({
    queryKey: ['/api/portfolio/holdings'],
  });

  const worstPerformer = (holdings as any)?.reduce((worst: any, current: any) => {
    const currentGain = ((current.currentPrice - current.avgCost) / current.avgCost) * 100;
    const worstGain = worst ? ((worst.currentPrice - worst.avgCost) / worst.avgCost) * 100 : Infinity;
    return currentGain < worstGain ? current : worst;
  }, null);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Worst Performer
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingDown className="w-10 h-10 text-orange-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Lowest Performing Asset
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {worstPerformer ? (
            <>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {worstPerformer.symbol}
                </div>
                <ArrowDownRight className="w-12 h-12 text-red-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Card className="bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Loss
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      {(((worstPerformer.currentPrice - worstPerformer.avgCost) / worstPerformer.avgCost) * 100).toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Current Price
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      ${worstPerformer.currentPrice?.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Total Loss
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      ${((worstPerformer.currentPrice - worstPerformer.avgCost) * worstPerformer.quantity).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  What is Worst Performer?
                </h3>
                <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Worst Performer highlights the asset in your portfolio with the largest percentage loss from your average 
                  cost basis. Monitoring underperforming assets helps you make informed decisions about cutting losses, 
                  averaging down, or holding for potential recovery.
                </p>
              </div>
            </>
          ) : (
            <div className="text-gray-400">No positions currently held</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
