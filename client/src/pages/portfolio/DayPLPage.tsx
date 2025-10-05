import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'wouter';

export default function DayPLPage() {
  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
  });

  const dayPL = (portfolio as any)?.dayPL || 0;
  const dayPLPercent = (portfolio as any)?.dayPLPercent || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
          Day Profit & Loss
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <PieChart className="w-10 h-10 text-purple-400" />
            <CardTitle className="text-2xl" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Today's P&L
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-bold ${dayPL >= 0 ? 'text-green-500' : 'text-red-500'}`} style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              {dayPL >= 0 ? '+' : ''}${dayPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {dayPL >= 0 ? <ArrowUpRight className="w-12 h-12 text-green-500" /> : <ArrowDownRight className="w-12 h-12 text-red-500" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Percentage Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dayPLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {dayPLPercent >= 0 ? '+' : ''}{dayPLPercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dayPL >= 0 ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                  {dayPL >= 0 ? 'Profitable' : 'Loss'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              What is Day P&L?
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
              Day P&L (Profit & Loss) shows your account's performance for the current trading day. It reflects 
              the change in value of your portfolio from market open to the current moment, including both 
              realized and unrealized gains/losses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
