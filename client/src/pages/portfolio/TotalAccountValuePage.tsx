import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Link } from 'wouter';

export default function TotalAccountValuePage() {
  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
  });

  const { data: marketData } = useQuery({
    queryKey: ['/api/market-stats'],
  });

  const totalAccountValue = (marketData as any)?.totalMarketCap || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Total Account Value
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calculator className="w-10 h-10 text-green-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Complete Account Valuation
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
            ${totalAccountValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  ${((portfolio as any)?.totalValue || 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Market Capitalization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  ${totalAccountValue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              What is Total Account Value?
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Total Account Value represents the complete market capitalization of all assets available on the Panel 
              Profits platform. This includes your personal portfolio value as well as the aggregate value of all 
              tradeable comic book assets in the marketplace.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
