import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'wouter';

export default function BuyingPowerPage() {
  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
  });

  const buyingPower = (portfolio as any)?.buyingPower || 0;
  const cashBalance = (portfolio as any)?.cashBalance || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Buying Power
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-amber-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Available Buying Power
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
            ${buyingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Cash Component
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  ${cashBalance.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Margin Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  ${(buyingPower - cashBalance).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              What is Buying Power?
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Buying Power represents the total amount of capital you can deploy for new trades. This includes your 
              available cash balance plus any margin or leverage available to you based on your certification level 
              and account status.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
