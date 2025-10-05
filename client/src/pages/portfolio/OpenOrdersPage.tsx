import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

export default function OpenOrdersPage() {
  const { data: orders } = useQuery({
    queryKey: ['/api/orders'],
  });

  const openOrders = (orders as any)?.filter((o: any) => o.status === 'pending')?.length || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Open Orders
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-rose-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Pending Orders
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold text-white" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
            {openOrders}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Buy Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {(orders as any)?.filter((o: any) => o.status === 'pending' && o.type === 'buy')?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Sell Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {(orders as any)?.filter((o: any) => o.status === 'pending' && o.type === 'sell')?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  ${((orders as any)?.filter((o: any) => o.status === 'pending')?.reduce((sum: number, o: any) => sum + (o.price * o.quantity), 0) || 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              What are Open Orders?
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Open Orders are pending buy or sell orders that have been placed but not yet executed. These orders 
              are waiting for market conditions to meet your specified price and quantity requirements before they 
              fill. You can cancel open orders at any time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
