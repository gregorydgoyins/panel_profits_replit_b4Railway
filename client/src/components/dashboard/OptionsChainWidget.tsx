import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface OptionData {
  strike: number;
  callBid: number;
  callAsk: number;
  callVolume: number;
  callOI: number;
  callDelta: number;
  callGamma: number;
  callTheta: number;
  callVega: number;
  putBid: number;
  putAsk: number;
  putVolume: number;
  putOI: number;
  putDelta: number;
  putGamma: number;
  putTheta: number;
  putVega: number;
}

export function OptionsChainWidget() {
  const [selectedAsset, setSelectedAsset] = useState<string>('SPIDEY');
  const [selectedExpiration, setSelectedExpiration] = useState<string>('2025-01-17');

  // Fetch options chain data
  const { data: optionsData, isLoading } = useQuery({
    queryKey: ['/api/options/chain', selectedAsset, selectedExpiration],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Mock data for demonstration (will be replaced with real API)
  const mockOptions: OptionData[] = [
    {
      strike: 95,
      callBid: 8.20, callAsk: 8.40, callVolume: 1250, callOI: 5420,
      callDelta: 0.78, callGamma: 0.032, callTheta: -0.15, callVega: 0.21,
      putBid: 0.85, putAsk: 0.95, putVolume: 890, putOI: 3210,
      putDelta: -0.22, putGamma: 0.032, putTheta: -0.08, putVega: 0.21
    },
    {
      strike: 100,
      callBid: 5.10, callAsk: 5.30, callVolume: 2340, callOI: 8900,
      callDelta: 0.56, callGamma: 0.045, callTheta: -0.18, callVega: 0.28,
      putBid: 2.10, putAsk: 2.25, putVolume: 1980, putOI: 6540,
      putDelta: -0.44, putGamma: 0.045, putTheta: -0.12, putVega: 0.28
    },
    {
      strike: 105,
      callBid: 2.80, callAsk: 2.95, callVolume: 1890, callOI: 7200,
      callDelta: 0.35, callGamma: 0.048, callTheta: -0.19, callVega: 0.32,
      putBid: 4.90, putAsk: 5.10, putVolume: 1560, putOI: 5800,
      putDelta: -0.65, putGamma: 0.048, putTheta: -0.14, putVega: 0.32
    },
    {
      strike: 110,
      callBid: 1.25, callAsk: 1.40, callVolume: 980, callOI: 4300,
      callDelta: 0.18, callGamma: 0.038, callTheta: -0.16, callVega: 0.26,
      putBid: 8.30, putAsk: 8.55, putVolume: 750, putOI: 3900,
      putDelta: -0.82, putGamma: 0.038, putTheta: -0.09, putVega: 0.26
    }
  ];

  const currentPrice = 102.45;
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatGreek = (value: number) => value.toFixed(3);
  const formatVolume = (vol: number) => vol.toLocaleString();

  return (
    <Card className="col-span-full" data-testid="widget-options-chain">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Options Chain</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Live Greeks • Calls & Puts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Asset:</span>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPIDEY">SPIDEY</SelectItem>
                  <SelectItem value="BATS">BATS</SelectItem>
                  <SelectItem value="IRONM">IRONM</SelectItem>
                  <SelectItem value="WWOND">WWOND</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Expiry:</span>
              <Select value={selectedExpiration} onValueChange={setSelectedExpiration}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-01-17">Jan 17, 2025</SelectItem>
                  <SelectItem value="2025-02-21">Feb 21, 2025</SelectItem>
                  <SelectItem value="2025-03-21">Mar 21, 2025</SelectItem>
                  <SelectItem value="2025-06-20">Jun 20, 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="ml-2">
              Spot: {formatPrice(currentPrice)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th colSpan={5} className="text-center py-2 text-green-500 font-semibold">CALLS</th>
                <th className="py-2 px-3 text-center font-semibold bg-muted/30">STRIKE</th>
                <th colSpan={5} className="text-center py-2 text-red-500 font-semibold">PUTS</th>
              </tr>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-right py-2 px-2">Bid</th>
                <th className="text-right py-2 px-2">Ask</th>
                <th className="text-right py-2 px-2">Vol</th>
                <th className="text-right py-2 px-2">OI</th>
                <th className="text-right py-2 px-2">Greeks</th>
                <th className="text-center py-2 px-3 bg-muted/30">Price</th>
                <th className="text-left py-2 px-2">Greeks</th>
                <th className="text-left py-2 px-2">OI</th>
                <th className="text-left py-2 px-2">Vol</th>
                <th className="text-left py-2 px-2">Ask</th>
                <th className="text-left py-2 px-2">Bid</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-muted-foreground">
                    Loading options chain...
                  </td>
                </tr>
              ) : mockOptions.map((option, idx) => {
                const isITM_Call = currentPrice > option.strike;
                const isITM_Put = currentPrice < option.strike;
                const isATM = Math.abs(currentPrice - option.strike) < 3;

                return (
                  <tr 
                    key={idx} 
                    className={`border-b hover-elevate transition-colors ${
                      isATM ? 'bg-indigo-500/5' : ''
                    }`}
                  >
                    {/* CALLS */}
                    <td className={`text-right py-2 px-2 ${isITM_Call ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {formatPrice(option.callBid)}
                    </td>
                    <td className={`text-right py-2 px-2 ${isITM_Call ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {formatPrice(option.callAsk)}
                    </td>
                    <td className={`text-right py-2 px-2 text-xs ${isITM_Call ? 'text-green-400/70' : 'text-muted-foreground'}`}>
                      {formatVolume(option.callVolume)}
                    </td>
                    <td className={`text-right py-2 px-2 text-xs ${isITM_Call ? 'text-green-400/70' : 'text-muted-foreground'}`}>
                      {formatVolume(option.callOI)}
                    </td>
                    <td className="text-right py-2 px-2">
                      <div className="flex flex-col text-xs space-y-0.5">
                        <span className={isITM_Call ? 'text-green-400' : 'text-muted-foreground'}>
                          Δ {formatGreek(option.callDelta)} | Γ {formatGreek(option.callGamma)}
                        </span>
                        <span className="text-muted-foreground/70">
                          Θ {formatGreek(option.callTheta)} | V {formatGreek(option.callVega)}
                        </span>
                      </div>
                    </td>

                    {/* STRIKE */}
                    <td className={`text-center py-2 px-3 font-bold bg-muted/30 ${
                      isATM ? 'text-indigo-400' : 'text-foreground'
                    }`}>
                      {formatPrice(option.strike)}
                    </td>

                    {/* PUTS */}
                    <td className="text-left py-2 px-2">
                      <div className="flex flex-col text-xs space-y-0.5">
                        <span className={isITM_Put ? 'text-red-400' : 'text-muted-foreground'}>
                          Δ {formatGreek(option.putDelta)} | Γ {formatGreek(option.putGamma)}
                        </span>
                        <span className="text-muted-foreground/70">
                          Θ {formatGreek(option.putTheta)} | V {formatGreek(option.putVega)}
                        </span>
                      </div>
                    </td>
                    <td className={`text-left py-2 px-2 text-xs ${isITM_Put ? 'text-red-400/70' : 'text-muted-foreground'}`}>
                      {formatVolume(option.putOI)}
                    </td>
                    <td className={`text-left py-2 px-2 text-xs ${isITM_Put ? 'text-red-400/70' : 'text-muted-foreground'}`}>
                      {formatVolume(option.putVolume)}
                    </td>
                    <td className={`text-left py-2 px-2 ${isITM_Put ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {formatPrice(option.putAsk)}
                    </td>
                    <td className={`text-left py-2 px-2 ${isITM_Put ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {formatPrice(option.putBid)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Greeks Legend */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>Δ = Delta (Price Sensitivity)</span>
            <span>Γ = Gamma (Delta Change)</span>
            <span>Θ = Theta (Time Decay)</span>
            <span>V = Vega (Volatility Sensitivity)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              ITM Calls
            </Badge>
            <Badge variant="outline" className="text-red-500 border-red-500/30">
              ITM Puts
            </Badge>
            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
              ATM
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
