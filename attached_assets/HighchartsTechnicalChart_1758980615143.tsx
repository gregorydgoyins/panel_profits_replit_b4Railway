import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

// Initialize Highcharts Stock indicators (these are included in highstock)
import HighchartsIndicators from 'highcharts/indicators/indicators-all';
HighchartsIndicators(Highcharts);

// Note: Advanced indicators removed to fix import errors
// Basic Highcharts/Highstock includes essential functionality

interface TechnicalIndicators {
  // Moving Averages
  sma20: boolean;
  sma30: boolean;
  sma50: boolean;
  sma60: boolean;
  sma90: boolean;
  sma200: boolean;
  ema12: boolean;
  ema26: boolean;
  
  // Bollinger Bands
  bollingerBands: boolean;
  
  // MACD
  macd: boolean;
  
  // Oscillators
  rsi: boolean;
  stochastic: boolean;
  williams_r: boolean;
  cci: boolean;
  
  // Volume Indicators
  obv: boolean;
  
  // Volatility Indicators
  atr: boolean;
  
  // Trend Indicators
  adx: boolean;
  parabolicSar: boolean;
  
  // Support/Resistance
  supportResistance: boolean;
  fibonacciRetracements: boolean;
}

interface HighchartsTechnicalChartProps {
  symbol: string;
  timeRange: '1d' | '1w' | '1m' | '1y' | '5y' | '10y' | 'all';
  selectedDate?: Date;
  height?: number;
  className?: string;
  indicators: TechnicalIndicators;
}

interface MarketSession {
  name: string;
  start: number;
  end: number;
  color: string;
  timezone: string;
}

const MARKET_SESSIONS: MarketSession[] = [
  { name: 'Tokyo', start: 20, end: 5, color: '#ef4444', timezone: 'JST' },
  { name: 'London', start: 3, end: 12, color: '#3b82f6', timezone: 'GMT' },
  { name: 'New York', start: 9.5, end: 16, color: '#10b981', timezone: 'EST' },
  { name: 'After Hours', start: 16, end: 20, color: '#6b7280', timezone: 'EST' },
  { name: 'Pre Market', start: 4, end: 9.5, color: '#8b5cf6', timezone: 'EST' }
];

export default function HighchartsTechnicalChart({
  symbol,
  timeRange,
  selectedDate,
  height = 600,
  className = '',
  indicators
}: HighchartsTechnicalChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate comprehensive historical data for 20 years
  const generateHistoricalData = (symbol: string, timeRange: string) => {
    const data = [];
    const now = new Date();
    let startDate = new Date();
    let interval = 'day';
    let points = 0;

    // Set date range based on timeRange
    switch (timeRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        interval = 'hour';
        points = 24;
        break;
      case '1w':
        startDate.setDate(now.getDate() - 7);
        interval = 'day';
        points = 7;
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        interval = 'day';
        points = 30;
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        interval = 'day';
        points = 365;
        break;
      case '5y':
        startDate.setFullYear(now.getFullYear() - 5);
        interval = 'week';
        points = 260;
        break;
      case '10y':
        startDate.setFullYear(now.getFullYear() - 10);
        interval = 'week';
        points = 520;
        break;
      case 'all':
        startDate.setFullYear(now.getFullYear() - 20);
        interval = 'month';
        points = 240;
        break;
    }

    // Base price varies by symbol
    const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let basePrice = 10000 + (symbolHash % 5000);
    
    // Generate data points
    for (let i = 0; i < points; i++) {
      const currentDate = new Date(startDate);
      
      if (interval === 'hour') {
        currentDate.setHours(startDate.getHours() + i);
      } else if (interval === 'day') {
        currentDate.setDate(startDate.getDate() + i);
      } else if (interval === 'week') {
        currentDate.setDate(startDate.getDate() + (i * 7));
      } else if (interval === 'month') {
        currentDate.setMonth(startDate.getMonth() + i);
      }

      // Generate OHLC data with realistic patterns
      const volatility = 0.02 + (Math.sin(i / 20) * 0.01);
      const trend = Math.sin(i / 50) * 0.001;
      
      const open = basePrice;
      const change = (Math.random() - 0.5) * volatility * basePrice + (trend * basePrice);
      const close = open + change;
      
      const high = Math.max(open, close) + (Math.random() * volatility * basePrice * 0.5);
      const low = Math.min(open, close) - (Math.random() * volatility * basePrice * 0.5);
      
      const volume = 50000 + Math.random() * 100000;
      
      // Update base price for next iteration
      basePrice = close;
      
      // Highcharts expects timestamp in milliseconds
      data.push([
        currentDate.getTime(),
        Math.round(open),
        Math.round(high),
        Math.round(low),
        Math.round(close),
        Math.round(volume)
      ]);
    }

    return data;
  };

  // Load data when component mounts or props change
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = generateHistoricalData(symbol, timeRange);
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chart data');
    } finally {
      setIsLoading(false);
    }
  }, [symbol, timeRange, selectedDate]);

  // Build Highcharts options
  const getChartOptions = (): Highcharts.Options => {
    const series: any[] = [
      {
        type: 'candlestick',
        name: symbol,
        data: chartData,
        id: 'main-series',
        color: '#ef4444',
        upColor: '#22c55e',
        lineColor: '#ef4444',
        upLineColor: '#22c55e'
      }
    ];

    // Add volume series
    series.push({
      type: 'column',
      name: 'Volume',
      data: chartData.map(point => [point[0], point[5]]),
      yAxis: 1,
      color: '#6b7280',
      opacity: 0.5
    });

    // Add technical indicators based on enabled state
    if (indicators.sma20) {
      series.push({
        type: 'sma',
        linkedTo: 'main-series',
        params: { period: 20 },
        color: '#10b981',
        name: 'SMA 20'
      });
    }

    if (indicators.sma50) {
      series.push({
        type: 'sma',
        linkedTo: 'main-series',
        params: { period: 50 },
        color: '#f59e0b',
        name: 'SMA 50'
      });
    }

    if (indicators.sma200) {
      series.push({
        type: 'sma',
        linkedTo: 'main-series',
        params: { period: 200 },
        color: '#ef4444',
        name: 'SMA 200'
      });
    }

    if (indicators.ema12) {
      series.push({
        type: 'ema',
        linkedTo: 'main-series',
        params: { period: 12 },
        color: '#8b5cf6',
        name: 'EMA 12'
      });
    }

    if (indicators.ema26) {
      series.push({
        type: 'ema',
        linkedTo: 'main-series',
        params: { period: 26 },
        color: '#ec4899',
        name: 'EMA 26'
      });
    }

    if (indicators.bollingerBands) {
      series.push({
        type: 'bb',
        linkedTo: 'main-series',
        params: { period: 20, standardDeviation: 2 },
        color: '#6b7280',
        name: 'Bollinger Bands'
      });
    }

    if (indicators.macd) {
      series.push({
        type: 'macd',
        linkedTo: 'main-series',
        yAxis: 2,
        params: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
        color: '#10b981',
        name: 'MACD'
      });
    }

    if (indicators.rsi) {
      series.push({
        type: 'rsi',
        linkedTo: 'main-series',
        yAxis: 3,
        params: { period: 14 },
        color: '#8b5cf6',
        name: 'RSI'
      });
    }

    if (indicators.stochastic) {
      series.push({
        type: 'stochastic',
        linkedTo: 'main-series',
        yAxis: 4,
        params: { kPeriod: 14, dPeriod: 3 },
        color: '#3b82f6',
        name: 'Stochastic'
      });
    }

    if (indicators.williams_r) {
      series.push({
        type: 'williamsr',
        linkedTo: 'main-series',
        yAxis: 5,
        params: { period: 14 },
        color: '#f97316',
        name: 'Williams %R'
      });
    }

    if (indicators.cci) {
      series.push({
        type: 'cci',
        linkedTo: 'main-series',
        yAxis: 6,
        params: { period: 20 },
        color: '#06b6d4',
        name: 'CCI'
      });
    }

    if (indicators.obv) {
      series.push({
        type: 'obv',
        linkedTo: 'main-series',
        yAxis: 7,
        color: '#eab308',
        name: 'OBV'
      });
    }

    if (indicators.atr) {
      series.push({
        type: 'atr',
        linkedTo: 'main-series',
        yAxis: 8,
        params: { period: 14 },
        color: '#f59e0b',
        name: 'ATR'
      });
    }

    if (indicators.adx) {
      series.push({
        // ADX indicator not available - placeholder for future implementation
        type: 'line',
        linkedTo: 'main-series',
        data: [],
        name: 'ADX (Not Available)',
        visible: false
      });
    }

    if (indicators.parabolicSar) {
      series.push({
        type: 'psar',
        linkedTo: 'main-series',
        color: '#f97316',
        name: 'Parabolic SAR'
      });
    }

    // Build yAxis configuration
    const yAxis: any[] = [
      {
        // Main price axis
        height: '60%',
        lineWidth: 2,
        resize: { enabled: true },
        labels: {
          style: { color: '#9ca3af' }
        },
        gridLineColor: '#374151',
        title: {
          text: 'Price (CC)',
          style: { color: '#9ca3af' }
        }
      },
      {
        // Volume axis
        top: '65%',
        height: '15%',
        offset: 0,
        lineWidth: 2,
        labels: {
          style: { color: '#9ca3af' }
        },
        gridLineColor: '#374151',
        title: {
          text: 'Volume',
          style: { color: '#9ca3af' }
        }
      }
    ];

    // Add additional axes for indicators
    let currentTop = 82;
    const indicatorHeight = 8;
    const indicatorSpacing = 2;

    if (indicators.macd) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'MACD', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.rsi) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        min: 0,
        max: 100,
        plotLines: [
          { value: 70, color: '#ef4444', dashStyle: 'dash', width: 1 },
          { value: 30, color: '#10b981', dashStyle: 'dash', width: 1 }
        ],
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'RSI', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.stochastic) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        min: 0,
        max: 100,
        plotLines: [
          { value: 80, color: '#ef4444', dashStyle: 'dash', width: 1 },
          { value: 20, color: '#10b981', dashStyle: 'dash', width: 1 }
        ],
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'Stochastic', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.williams_r) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        min: -100,
        max: 0,
        plotLines: [
          { value: -20, color: '#ef4444', dashStyle: 'dash', width: 1 },
          { value: -80, color: '#10b981', dashStyle: 'dash', width: 1 }
        ],
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'Williams %R', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.cci) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        plotLines: [
          { value: 100, color: '#ef4444', dashStyle: 'dash', width: 1 },
          { value: -100, color: '#10b981', dashStyle: 'dash', width: 1 }
        ],
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'CCI', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.obv) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'OBV', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.atr) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'ATR', style: { color: '#9ca3af' } }
      });
      currentTop += indicatorHeight + indicatorSpacing;
    }

    if (indicators.adx) {
      yAxis.push({
        top: `${currentTop}%`,
        height: `${indicatorHeight}%`,
        offset: 0,
        lineWidth: 2,
        labels: { style: { color: '#9ca3af' } },
        gridLineColor: '#374151',
        title: { text: 'ADX (Not Available)', style: { color: '#9ca3af' } }
      });
    }

    return {
      chart: {
        backgroundColor: 'transparent',
        height: height,
        style: {
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      },
      title: {
        text: `${symbol} - Technical Analysis`,
        style: {
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: `${timeRange.toUpperCase()} • Global Trading Sessions`,
        style: {
          color: '#9ca3af',
          fontSize: '14px'
        }
      },
      xAxis: {
        type: 'datetime',
        lineColor: '#374151',
        tickColor: '#374151',
        labels: {
          style: { color: '#9ca3af' }
        },
        gridLineColor: '#374151',
        plotBands: timeRange === '1d' ? MARKET_SESSIONS.map(session => ({
          from: Date.UTC(2024, 0, 1, session.start),
          to: Date.UTC(2024, 0, 1, session.end),
          color: session.color + '20',
          label: {
            text: session.name,
            style: { color: session.color }
          }
        })) : []
      },
      yAxis: yAxis,
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        x: -10,
        y: 50,
        itemStyle: {
          color: '#9ca3af',
          fontSize: '12px'
        },
        itemHoverStyle: {
          color: '#ffffff'
        }
      },
      plotOptions: {
        candlestick: {
          lineWidth: 1
        },
        series: {
          animation: false,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#475569',
        borderRadius: 8,
        style: {
          color: '#ffffff'
        },
        shared: true,
        split: false,
        formatter: function() {
          let tooltip = `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b><br/>`;
          
          this.points?.forEach(point => {
            if (point.series.name === symbol && point.point.open !== undefined) {
              tooltip += `<br/><span style="color:${point.color}">●</span> <b>${point.series.name}</b><br/>`;
              tooltip += `Open: <b>${point.point.open}</b><br/>`;
              tooltip += `High: <b>${point.point.high}</b><br/>`;
              tooltip += `Low: <b>${point.point.low}</b><br/>`;
              tooltip += `Close: <b>${point.point.close}</b><br/>`;
            } else {
              tooltip += `<br/><span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y?.toFixed(2)}</b>`;
            }
          });
          
          return tooltip;
        }
      },
      series: series,
      rangeSelector: {
        enabled: true,
        buttons: [
          { type: 'day', count: 1, text: '1D' },
          { type: 'week', count: 1, text: '1W' },
          { type: 'month', count: 1, text: '1M' },
          { type: 'year', count: 1, text: '1Y' },
          { type: 'year', count: 5, text: '5Y' },
          { type: 'year', count: 10, text: '10Y' },
          { type: 'all', text: '20Y' }
        ],
        selected: timeRange === '1d' ? 0 : timeRange === '1w' ? 1 : timeRange === '1m' ? 2 : 
                  timeRange === '1y' ? 3 : timeRange === '5y' ? 4 : timeRange === '10y' ? 5 : 6,
        buttonTheme: {
          fill: '#374151',
          stroke: '#4b5563',
          style: { color: '#9ca3af' },
          states: {
            hover: { fill: '#4b5563' },
            select: { fill: '#3b82f6', style: { color: '#ffffff' } }
          }
        }
      },
      navigator: {
        enabled: true,
        height: 40,
        maskFill: 'rgba(59, 130, 246, 0.1)',
        outlineColor: '#3b82f6',
        handles: {
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8'
        }
      },
      scrollbar: {
        enabled: true,
        barBackgroundColor: '#374151',
        barBorderColor: '#4b5563',
        buttonBackgroundColor: '#4b5563',
        buttonBorderColor: '#6b7280',
        rifleColor: '#9ca3af',
        trackBackgroundColor: '#1f2937',
        trackBorderColor: '#374151'
      },
      credits: {
        enabled: false
      }
    };
  };

  if (isLoading) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-400">Loading Highcharts data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-400 mb-2">⚠️ Chart Error</div>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 ${className}`}>
      <div className="p-4">
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={getChartOptions()}
          ref={chartRef}
        />
      </div>
      
      {/* Global Trading Sessions Legend */}
      <div className="px-4 pb-4">
        <div className="bg-slate-800/30 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Global Trading Sessions</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {MARKET_SESSIONS.map((session, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: session.color }}
                ></div>
                <div className="text-xs">
                  <div className="text-gray-300 font-medium">{session.name}</div>
                  <div className="text-gray-500">{session.start}:00-{session.end}:00 {session.timezone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}