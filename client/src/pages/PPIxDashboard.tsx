import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon, InfoIcon } from 'lucide-react';

interface IndexData {
  currentValue: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  volume: number;
  constituents: any[];
  lastRebalance: string;
  nextRebalance: string;
  methodology: string;
}

interface PPIxResponse {
  success: boolean;
  indices: {
    ppix50: IndexData;
    ppix100: IndexData;
  };
  comparison: any;
  lastUpdated: string;
}

export default function PPIxDashboard() {
  const [selectedIndex, setSelectedIndex] = useState<'ppix50' | 'ppix100'>('ppix50');
  
  const { data: ppixData, isLoading, error, refetch } = useQuery<PPIxResponse>({
    queryKey: ['/api/ppix/indices'],
    queryFn: async () => {
      console.log('🔥 PPIx Dashboard - Making API call to /api/ppix/indices');
      const response = await fetch('/api/ppix/indices', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🔥 PPIx Dashboard - API Response received:', data);
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Debug logging
  console.log('🔥 PPIx Dashboard - Query Status:', {
    isLoading,
    hasData: !!ppixData,
    dataSuccess: ppixData?.success,
    error: error?.message,
    dataKeys: ppixData ? Object.keys(ppixData) : null
  });

  const { data: subscriptionData } = useQuery({
    queryKey: ['/api/subscription/tiers'],
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, isPercent = false) => {
    const formatted = isPercent 
      ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
      : `${change > 0 ? '+' : ''}${formatPrice(change)}`;
    return formatted;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            PPIx Market Indices
          </h1>
          <p className="text-muted-foreground">Loading comic book market indices...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-muted rounded w-24 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!ppixData?.success) {
    return (
      <div className="container mx-auto p-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl  mb-4">PPIx Indices Unavailable</h2>
            <p className="text-muted-foreground mb-4">
              Unable to load market indices. Please check your subscription or try again later.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { ppix50, ppix100 } = ppixData.indices;
  const selectedIndexData = selectedIndex === 'ppix50' ? ppix50 : ppix100;

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="ppix-dashboard">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          PPIx Market Indices
        </h1>
        <p className="text-muted-foreground text-lg">
          The premier comic book market indices - tracking the pulse of comic investing
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            Last Updated: {new Date(ppixData.lastUpdated).toLocaleTimeString()}
          </Badge>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => refetch()}
            data-testid="button-refresh"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Index Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover-elevate" onClick={() => setSelectedIndex('ppix50')} data-testid="card-ppix50">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  PPIx 50
                  <Badge variant="secondary" className="text-xs">Blue Chip</Badge>
                </CardTitle>
                <CardDescription>Top 50 stable comic assets</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl " data-testid="text-ppix50-value">
                  {formatPrice(ppix50.currentValue)}
                </div>
                <div className={`text-sm flex items-center gap-1 ${getChangeColor(ppix50.dayChange)}`}>
                  {getChangeIcon(ppix50.dayChange)}
                  {formatChange(ppix50.dayChange)} ({formatChange(ppix50.dayChangePercent, true)})
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Volume:</span>
                <div className="">{ppix50.volume.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Assets:</span>
                <div className="">{ppix50.constituents.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover-elevate" onClick={() => setSelectedIndex('ppix100')} data-testid="card-ppix100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  PPIx 100
                  <Badge variant="secondary" className="text-xs">Growth</Badge>
                </CardTitle>
                <CardDescription>Top 100 growth comic assets</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl " data-testid="text-ppix100-value">
                  {formatPrice(ppix100.currentValue)}
                </div>
                <div className={`text-sm flex items-center gap-1 ${getChangeColor(ppix100.dayChange)}`}>
                  {getChangeIcon(ppix100.dayChange)}
                  {formatChange(ppix100.dayChange)} ({formatChange(ppix100.dayChangePercent, true)})
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Volume:</span>
                <div className="">{ppix100.volume.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Assets:</span>
                <div className="">{ppix100.constituents.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Index View */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">
                {selectedIndex === 'ppix50' ? 'PPIx 50 - Blue Chip Index' : 'PPIx 100 - Growth Index'}
              </CardTitle>
              <CardDescription>
                {selectedIndex === 'ppix50' 
                  ? 'Like the Dow Jones for comic books - stable, high-value assets' 
                  : 'Like the NASDAQ for comic books - growth and volatile assets'
                }
              </CardDescription>
            </div>
            <Tabs value={selectedIndex} onValueChange={(value) => setSelectedIndex(value as 'ppix50' | 'ppix100')}>
              <TabsList>
                <TabsTrigger value="ppix50" data-testid="tab-ppix50">PPIx 50</TabsTrigger>
                <TabsTrigger value="ppix100" data-testid="tab-ppix100">PPIx 100</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Index Performance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Current Value</div>
              <div className="text-2xl " data-testid="text-selected-value">
                {formatPrice(selectedIndexData.currentValue)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Day Change</div>
              <div className={`text-lg  ${getChangeColor(selectedIndexData.dayChange)}`}>
                {formatChange(selectedIndexData.dayChange)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Week Change</div>
              <div className={`text-lg  ${getChangeColor(selectedIndexData.weekChange)}`}>
                {formatChange(selectedIndexData.weekChange)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="text-lg ">
                {selectedIndexData.volume.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Index Methodology */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <InfoIcon className="w-5 h-5" />
                Index Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedIndexData.methodology}
              </p>
            </CardContent>
          </Card>

          {/* Top Constituents */}
          <div>
            <h3 className="text-lg  mb-4">Top Index Constituents</h3>
            <div className="space-y-2">
              {selectedIndexData.constituents.slice(0, 10).map((constituent, index) => (
                <div 
                  key={constituent.assetId} 
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover-elevate"
                  data-testid={`constituent-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className=" flex items-center gap-2">
                        {constituent.name}
                        {constituent.investmentGrade && (
                          <Badge 
                            variant={
                              constituent.investmentGrade === 'INSTITUTIONAL' ? 'default' :
                              constituent.investmentGrade === 'INVESTMENT' ? 'secondary' :
                              constituent.investmentGrade === 'SPECULATIVE' ? 'outline' : 'destructive'
                            } 
                            className="text-xs"
                            data-testid={`grade-${constituent.investmentGrade.toLowerCase()}`}
                          >
                            {constituent.investmentGrade}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {constituent.symbol} • {constituent.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm ">
                      {constituent.weight.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(constituent.marketCap)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rebalancing Info */}
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm  text-blue-700 dark:text-blue-300">
                    Last Rebalance
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedIndexData.lastRebalance).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm  text-blue-700 dark:text-blue-300">
                    Next Rebalance
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedIndexData.nextRebalance).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}