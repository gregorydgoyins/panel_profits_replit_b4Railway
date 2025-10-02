import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PricePoint {
  date: string;
  price: number;
}

interface PriceHistoryData {
  assetId: string;
  grade: string;
  pricePoints: PricePoint[];
  stats: {
    percentChange: number;
    high: number;
    low: number;
  };
}

interface PriceHistoryChartWidgetProps {
  assetId?: string;
  defaultGrade?: string;
}

export function PriceHistoryChartWidget({ 
  assetId, 
  defaultGrade = 'ungraded' 
}: PriceHistoryChartWidgetProps) {
  const [selectedGrade, setSelectedGrade] = useState(defaultGrade);
  const [timeframe, setTimeframe] = useState<'30' | '90' | '365'>('30');

  const { data: priceHistory, isLoading, error } = useQuery<PriceHistoryData>({
    queryKey: ['/api/price-history', assetId, { grade: selectedGrade, days: timeframe }],
    queryFn: async () => {
      if (!assetId) throw new Error('No asset selected');
      const response = await fetch(`/api/price-history/${assetId}?grade=${selectedGrade}&days=${timeframe}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch price history: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    enabled: !!assetId,
    retry: 1,
  });

  const grades = [
    { value: 'ungraded', label: 'Ungraded' },
    { value: 'cgc-4.0', label: 'CGC 4.0' },
    { value: 'cgc-4.5', label: 'CGC 4.5' },
    { value: 'cgc-6.0', label: 'CGC 6.0' },
    { value: 'cgc-6.5', label: 'CGC 6.5' },
    { value: 'cgc-8.0', label: 'CGC 8.0' },
    { value: 'cgc-8.5', label: 'CGC 8.5' },
    { value: 'cgc-9.2', label: 'CGC 9.2' },
    { value: 'cgc-9.8', label: 'CGC 9.8' },
    { value: 'cgc-10.0', label: 'CGC 10.0' },
  ];

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      height: 280,
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      gridLineColor: 'hsl(var(--border))',
    },
    yAxis: {
      title: {
        text: 'Price ($)',
        style: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))',
        },
        formatter: function() {
          return '$' + this.value.toLocaleString();
        },
      },
      gridLineColor: 'hsl(var(--border))',
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, (priceHistory?.stats?.percentChange ?? 0) >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'],
            [1, 'rgba(0, 0, 0, 0)'],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 2,
        lineColor: (priceHistory?.stats?.percentChange ?? 0) >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        states: {
          hover: {
            lineWidth: 2,
          },
        },
        threshold: null,
      },
    },
    tooltip: {
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      style: {
        color: 'hsl(var(--popover-foreground))',
      },
      formatter: function() {
        return `<b>${Highcharts.dateFormat('%b %e, %Y', this.x as number)}</b><br/>$${this.y?.toLocaleString()}`;
      },
    },
    series: [{
      type: 'area',
      name: 'Price',
      data: priceHistory?.pricePoints.map(point => [
        new Date(point.date).getTime(),
        point.price,
      ]) || [],
    }],
  };

  const percentChange = priceHistory?.stats.percentChange || 0;
  const isPositive = percentChange >= 0;

  // Show placeholder if no asset selected
  if (!assetId) {
    return (
      <Card data-testid="widget-price-history">
        <CardHeader>
          <CardTitle className="text-lg">Price History</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Historical pricing trends</p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Select an asset to view price history</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="widget-price-history">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">Price History</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Historical pricing trends</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[140px]" data-testid="select-grade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {grades.map(grade => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as '30' | '90' | '365')} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="30" data-testid="tab-30-days">
              30D
            </TabsTrigger>
            <TabsTrigger value="90" data-testid="tab-90-days">
              90D
            </TabsTrigger>
            <TabsTrigger value="365" data-testid="tab-1-year">
              1Y
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="h-[280px] flex items-center justify-center">
              <Activity className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center gap-2">
              <TrendingDown className="w-8 h-8 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Failed to load price history</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            </div>
          ) : priceHistory && priceHistory.pricePoints.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {timeframe === '30' ? '30-day' : timeframe === '90' ? '90-day' : '1-year'} change
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Range</div>
                  <div className="text-sm font-medium">
                    ${priceHistory.stats.low.toLocaleString()} - ${priceHistory.stats.high.toLocaleString()}
                  </div>
                </div>
              </div>
              <TabsContent value={timeframe} className="mt-0">
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              </TabsContent>
            </>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              No price history available
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
