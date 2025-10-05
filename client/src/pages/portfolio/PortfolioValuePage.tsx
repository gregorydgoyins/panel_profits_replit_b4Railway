import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Link } from 'wouter';

export default function PortfolioValuePage() {
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/portfolio'],
  });

  const portfolioValue = portfolio?.totalValue || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Portfolio Value
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-indigo-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Current Portfolio Value
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolioLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <>
              <div className="text-5xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                ${portfolioValue.toLocaleString()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Card className="bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Cash Holdings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      ${(portfolio?.cashBalance || 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      Asset Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                      ${((portfolio?.totalValue || 0) - (portfolio?.cashBalance || 0)).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  What is Portfolio Value?
                </h3>
                <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Portfolio Value represents the total current market value of all your holdings, including both 
                  cash balance and the market value of all comic book assets you own. This is calculated in real-time 
                  based on current market prices.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
