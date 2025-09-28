import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Volume2, BarChart3, Activity, Settings,
  Maximize2, RefreshCw
} from 'lucide-react';

// Import Highcharts modules for financial charting
import HC_indicators from 'highcharts/indicators/indicators';
import HC_ema from 'highcharts/indicators/ema';
import HC_rsi from 'highcharts/indicators/rsi';
import HC_macd from 'highcharts/indicators/macd';
import HC_bollinger from 'highcharts/indicators/bollinger-bands';

// Initialize Highcharts modules
if (typeof Highcharts === 'object') {
  HC_indicators(Highcharts);
  HC_ema(Highcharts);
  HC_rsi(Highcharts);
  HC_macd(Highcharts);
  HC_bollinger(Highcharts);
}

interface AdvancedTradingChartProps {
  symbol: string;
  onAssetSelect?: (symbol: string) => void;
  isFullscreen?: boolean;
  refreshTrigger?: number;
}

export function AdvancedTradingChart({ 
  symbol, 
  onAssetSelect, 
  isFullscreen = false,
  refreshTrigger = 0
}: AdvancedTradingChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [timeframe, setTimeframe] = useState('1d');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState<string[]>(['volume']);

  // Fetch market data for the chart
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['/api/market-data', symbol, 'history', timeframe],
    queryFn: () => fetch(`/api/market-data/${symbol}/history?timeframe=${timeframe}&limit=200`)
      .then(res => res.json()),
    enabled: !!symbol,
    refetchInterval: timeframe === '1m' ? 30000 : timeframe === '5m' ? 60000 : 300000,
  });

  // Fetch current price for real-time updates
  const { data: currentPrice } = useQuery({
    queryKey: ['/api/market/prices', symbol],
    queryFn: () => fetch(`/api/market/prices?assetIds=${symbol}`).then(res => res.json()),
    enabled: !!symbol,
    refetchInterval: 5000,
  });

  // Process market data for Highcharts
  const processMarketData = (data: any[]) => {
    if (!data || !Array.isArray(data)) return { ohlc: [], volume: [] };
    
    const ohlc = data.map(item => [
      new Date(item.timestamp).getTime(),
      parseFloat(item.openPrice),
      parseFloat(item.highPrice),
      parseFloat(item.lowPrice),
      parseFloat(item.closePrice)
    ]);

    const volume = data.map(item => [
      new Date(item.timestamp).getTime(),
      parseInt(item.volume || '0')
    ]);

    return { ohlc, volume };
  };

  // Chart configuration
  const getChartOptions = () => {
    const { ohlc, volume } = processMarketData(marketData || []);

    const series: any[] = [
      {
        type: chartType,
        name: symbol,
        data: ohlc,
        id: 'ohlc',
        yAxis: 0,
        tooltip: {
          valueDecimals: 2
        }
      }
    ];

    // Add volume series if selected
    if (indicators.includes('volume')) {
      series.push({
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
        color: 'rgba(64, 165, 120, 0.5)'
      });
    }

    // Add technical indicators
    if (indicators.includes('sma')) {
      series.push({
        type: 'sma',
        linkedTo: 'ohlc',
        params: {
          period: 20
        },
        color: '#1f77b4',
        name: 'SMA (20)'
      });
    }

    if (indicators.includes('ema')) {
      series.push({
        type: 'ema',
        linkedTo: 'ohlc',
        params: {
          period: 21
        },
        color: '#ff7f0e',
        name: 'EMA (21)'
      });
    }

    if (indicators.includes('rsi')) {
      series.push({
        type: 'rsi',
        linkedTo: 'ohlc',
        yAxis: 2,
        params: {
          period: 14
        },
        color: '#d62728',
        name: 'RSI (14)'
      });
    }

    if (indicators.includes('macd')) {
      series.push({
        type: 'macd',
        linkedTo: 'ohlc',
        yAxis: 3,
        params: {
          shortPeriod: 12,
          longPeriod: 26,
          signalPeriod: 9
        },
        name: 'MACD'
      });
    }

    if (indicators.includes('bb')) {
      series.push({
        type: 'bb',
        linkedTo: 'ohlc',
        params: {
          period: 20,
          standardDeviation: 2
        },
        color: '#9467bd',
        name: 'Bollinger Bands'
      });
    }

    const yAxisConfig: any[] = [
      {
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      },
      {
        top: '60%',
        height: '20%',
        offset: 0,
        lineWidth: 2
      }
    ];

    // Add additional y-axes for indicators
    if (indicators.includes('rsi')) {
      yAxisConfig.push({
        top: '80%',
        height: '20%',
        offset: 0,
        lineWidth: 2,
        min: 0,
        max: 100,
        plotLines: [{
          value: 70,
          color: 'red',
          dashStyle: 'shortdash',
          width: 1
        }, {
          value: 30,
          color: 'green',
          dashStyle: 'shortdash',
          width: 1
        }]
      });
    }

    if (indicators.includes('macd')) {
      yAxisConfig.push({
        top: '80%',
        height: '20%',
        offset: 0,
        lineWidth: 2
      });
    }

    return {
      chart: {
        backgroundColor: 'transparent',
        height: isFullscreen ? '100%' : 400,
      },
      title: {
        text: null
      },
      rangeSelector: {
        selected: 1,
        buttons: [{
          type: 'minute',
          count: 15,
          text: '15m'
        }, {
          type: 'minute',
          count: 60,
          text: '1h'
        }, {
          type: 'day',
          count: 1,
          text: '1d'
        }, {
          type: 'week',
          count: 1,
          text: '1w'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'all',
          text: 'All'
        }]
      },
      yAxis: yAxisConfig,
      series: series,
      legend: {
        enabled: true
      },
      tooltip: {
        split: true
      },
      plotOptions: {
        candlestick: {
          color: '#ef4444',
          upColor: '#22c55e'
        },
        series: {
          dataGrouping: {
            enabled: false
          }
        }
      },
      navigator: {
        enabled: !isFullscreen
      },
      scrollbar: {
        enabled: !isFullscreen
      },
      credits: {
        enabled: false
      }
    };
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const timeframes = [
    { value: '1m', label: '1M' },
    { value: '5m', label: '5M' },
    { value: '15m', label: '15M' },
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '1d', label: '1D' },
    { value: '1w', label: '1W' },
  ];

  return (
    <div className="h-full flex flex-col" data-testid="advanced-trading-chart">
      {/* Chart Controls */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
                data-testid={`button-timeframe-${tf.value}`}
              >
                {tf.label}
              </Button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant={chartType === 'candlestick' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('candlestick')}
              data-testid="button-chart-candlestick"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              data-testid="button-chart-line"
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="flex items-center gap-1">
          {['volume', 'sma', 'ema', 'rsi', 'macd', 'bb'].map((indicator) => (
            <Button
              key={indicator}
              variant={indicators.includes(indicator) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleIndicator(indicator)}
              data-testid={`button-indicator-${indicator}`}
            >
              {indicator.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={getChartOptions()}
            ref={chartRef}
          />
        )}
      </div>
    </div>
  );
}