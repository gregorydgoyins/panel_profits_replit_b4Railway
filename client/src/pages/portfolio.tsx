import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Link } from 'wouter';

interface Position {
  id: string;
  assetId: string;
  symbol: string;
  assetName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPL: number;
  totalPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  positionCount: number;
  cash: number;
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery<PortfolioSummary>({
    queryKey: ['/api/portfolios/summary', user?.id],
    enabled: !!user?.id,
  });

  const { data: positions, isLoading: positionsLoading, refetch: refetchPositions } = useQuery<Position[]>({
    queryKey: ['/api/portfolios/positions', user?.id],
    enabled: !!user?.id,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSummary(), refetchPositions()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const isLoading = summaryLoading || positionsLoading;

  const performanceChartOptions: Highcharts.Options = {
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      height: 280,
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      type: 'datetime',
      gridLineColor: '#333',
      lineColor: '#666',
      tickColor: '#666',
      labels: {
        style: {
          color: '#999',
          fontFamily: 'Hind, sans-serif',
          fontWeight: '300',
          fontSize: '11px',
        },
      },
    },
    yAxis: {
      title: { text: '' },
      gridLineColor: '#222',
      labels: {
        style: {
          color: '#999',
          fontFamily: 'Hind, sans-serif',
          fontWeight: '300',
          fontSize: '11px',
        },
        formatter: function() {
          return '$' + (this.value as number).toLocaleString();
        },
      },
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.2,
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true, radius: 4 },
          },
        },
      },
    },
    series: [{
      type: 'areaspline',
      name: 'Portfolio Value',
      data: Array.from({ length: 30 }, (_, i) => {
        const date = Date.now() - (29 - i) * 24 * 60 * 60 * 1000;
        const value = (summary?.totalValue || 100000) * (0.95 + Math.random() * 0.1);
        return [date, value];
      }),
      color: summary?.dayChange && summary.dayChange >= 0 ? '#22c55e' : '#ef4444',
    }],
    tooltip: {
      backgroundColor: '#000',
      borderColor: '#333',
      style: {
        color: '#fff',
        fontFamily: 'Hind, sans-serif',
        fontWeight: '300',
      },
      formatter: function() {
        return '<b>$' + (this.y as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</b>';
      },
    },
  };

  const allocationChartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 280,
    },
    title: { text: '' },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%',
          style: {
            color: '#999',
            fontFamily: 'Hind, sans-serif',
            fontWeight: '300',
            fontSize: '11px',
            textOutline: 'none',
          },
        },
      },
    },
    series: [{
      type: 'pie',
      name: 'Allocation',
      data: positions?.slice(0, 5).map((p, i) => ({
        name: p.symbol,
        y: p.totalValue,
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i],
      })) || [],
    }],
    tooltip: {
      backgroundColor: '#000',
      borderColor: '#333',
      style: {
        color: '#fff',
        fontFamily: 'Hind, sans-serif',
        fontWeight: '300',
      },
      formatter: function() {
        return '<b>' + this.point.name + '</b>: $' + (this.y as number).toLocaleString();
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  const hasPositions = positions && positions.length > 0;
  const sortedPositions = positions?.sort((a, b) => b.totalValue - a.totalValue) || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-2xl  text-foreground"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
          >
            Portfolio Command
          </h1>
          <p 
            className="text-sm text-muted-foreground mt-1"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
          >
            Real-time position monitoring and analytics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          data-testid="button-refresh-portfolio"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>Refresh</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-total-value">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle 
              className="text-sm "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-total-value"
            >
              ${summary?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {summary && (
              <p 
                className={cn(
                  "text-xs mt-1",
                  summary.dayChange >= 0 ? "text-green-500" : "text-red-500"
                )}
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                {summary.dayChange >= 0 ? "+" : ""}
                ${summary.dayChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {" "}({summary.dayChangePercent >= 0 ? "+" : ""}{summary.dayChangePercent.toFixed(2)}%)
              </p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-total-pl">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle 
              className="text-sm "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Total P/L
            </CardTitle>
            {summary && summary.totalPL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div 
              className={cn(
                "text-2xl ",
                summary && summary.totalPL >= 0 ? "text-green-500" : "text-red-500"
              )}
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-total-pl"
            >
              {summary && summary.totalPL >= 0 ? "+" : ""}
              ${summary?.totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {summary && (
              <p 
                className={cn(
                  "text-xs mt-1",
                  summary.totalPL >= 0 ? "text-green-500" : "text-red-500"
                )}
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                {summary.totalPLPercent >= 0 ? "+" : ""}{summary.totalPLPercent.toFixed(2)}% All-Time
              </p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-positions">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle 
              className="text-sm "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Positions
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-position-count"
            >
              {summary?.positionCount || 0}
            </div>
            <p 
              className="text-xs text-muted-foreground mt-1"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Active holdings
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-cash">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle 
              className="text-sm "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Buying Power
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl "
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              data-testid="text-cash"
            >
              ${summary?.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p 
              className="text-xs text-muted-foreground mt-1"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Available cash
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card data-testid="card-performance-chart">
          <CardHeader>
            <CardTitle 
              className="text-base"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Portfolio Performance (30D)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HighchartsReact highcharts={Highcharts} options={performanceChartOptions} />
          </CardContent>
        </Card>

        <Card data-testid="card-allocation-chart">
          <CardHeader>
            <CardTitle 
              className="text-base"
              style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
            >
              Position Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasPositions ? (
              <HighchartsReact highcharts={Highcharts} options={allocationChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>No positions yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card data-testid="card-positions-table">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle 
            className="text-base"
            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
          >
            Current Positions
          </CardTitle>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'grid')}>
            <TabsList>
              <TabsTrigger value="list" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                List
              </TabsTrigger>
              <TabsTrigger value="grid" style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {!hasPositions ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 
                className="text-lg  mb-2"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                No Positions Yet
              </h3>
              <p 
                className="text-sm text-muted-foreground mb-4"
                style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
              >
                Start trading to build your portfolio
              </p>
              <Link href="/trading">
                <Button data-testid="button-start-trading">
                  <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>Start Trading</span>
                </Button>
              </Link>
            </div>
          ) : viewMode === 'list' ? (
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {sortedPositions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                    data-testid={`position-row-${position.symbol}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <Link href={`/asset/${position.symbol}`}>
                            <a className=" hover:underline" data-testid={`link-asset-${position.symbol}`}>
                              <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                                {position.symbol}
                              </span>
                            </a>
                          </Link>
                          <p 
                            className="text-sm text-muted-foreground"
                            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                          >
                            {position.assetName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p 
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          Quantity
                        </p>
                        <p 
                          className=""
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          {position.quantity.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p 
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          Avg Price
                        </p>
                        <p 
                          className=""
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          ${position.averagePrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p 
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          Current Price
                        </p>
                        <div className="flex items-center gap-2">
                          <p 
                            className=""
                            style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                          >
                            ${position.currentPrice.toFixed(2)}
                          </p>
                          <Badge
                            variant={position.dayChange >= 0 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                              {position.dayChange >= 0 ? "+" : ""}
                              {position.dayChangePercent.toFixed(2)}%
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <p 
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          Market Value
                        </p>
                        <p 
                          className=""
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          ${position.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="text-right min-w-[120px]">
                        <p 
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          Unrealized P/L
                        </p>
                        <p 
                          className={cn(
                            "",
                            position.unrealizedPL >= 0 ? "text-green-500" : "text-red-500"
                          )}
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                          data-testid={`text-pl-${position.symbol}`}
                        >
                          {position.unrealizedPL >= 0 ? "+" : ""}
                          ${position.unrealizedPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-xs ml-1">
                            ({position.unrealizedPLPercent >= 0 ? "+" : ""}
                            {position.unrealizedPLPercent.toFixed(2)}%)
                          </span>
                        </p>
                      </div>

                      <Link href={`/asset/${position.symbol}`}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          data-testid={`button-view-${position.symbol}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPositions.map((position) => (
                <Card key={position.id} className="hover-elevate" data-testid={`position-card-${position.symbol}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle 
                          className="text-base"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          {position.symbol}
                        </CardTitle>
                        <p 
                          className="text-xs text-muted-foreground mt-1"
                          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                        >
                          {position.assetName}
                        </p>
                      </div>
                      <Badge
                        variant={position.unrealizedPL >= 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>
                          {position.unrealizedPL >= 0 ? "+" : ""}
                          {position.unrealizedPLPercent.toFixed(2)}%
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        Quantity:
                      </span>
                      <span 
                        className=""
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        {position.quantity.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        Avg Price:
                      </span>
                      <span 
                        className=""
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        ${position.averagePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        Current:
                      </span>
                      <span 
                        className=""
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        ${position.currentPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        Market Value:
                      </span>
                      <span 
                        className=""
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        ${position.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        Unrealized P/L:
                      </span>
                      <span 
                        className={cn(
                          "",
                          position.unrealizedPL >= 0 ? "text-green-500" : "text-red-500"
                        )}
                        style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
                      >
                        {position.unrealizedPL >= 0 ? "+" : ""}
                        ${position.unrealizedPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Link href={`/asset/${position.symbol}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        data-testid={`button-view-grid-${position.symbol}`}
                      >
                        <span style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}>View Details</span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
