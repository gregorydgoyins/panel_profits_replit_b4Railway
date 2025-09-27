import { useState } from 'react';
import { LineChart, BarChart3, TrendingUp, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

export function ChartingStudio() {
  const [selectedAsset, setSelectedAsset] = useState('SPDR');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [isLive, setIsLive] = useState(true);
  const [indicators, setIndicators] = useState<string[]>(['MA20', 'RSI']);

  // Mock chart data
  const generateChartData = (): ChartData[] => {
    const data: ChartData[] = [];
    let price = 1000;
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      price += (Math.random() - 0.5) * 50;
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: Math.max(500, price),
        volume: 10000 + Math.random() * 50000
      });
    }
    return data;
  };

  const [chartData] = useState(generateChartData());

  const availableAssets = [
    { symbol: 'SPDR', name: 'Spider-Man', price: 1247.50, change: 2.34 },
    { symbol: 'BATM', name: 'Batman', price: 1893.25, change: -1.12 },
    { symbol: 'AF15', name: 'Amazing Fantasy #15', price: 180000, change: 5.67 },
    { symbol: 'SUPN', name: 'Superman', price: 2156.75, change: 1.89 },
    { symbol: 'WNDR', name: 'Wonder Woman', price: 987.40, change: -0.78 }
  ];

  const availableIndicators = [
    { id: 'MA20', name: 'Moving Average (20)', category: 'Trend' },
    { id: 'MA50', name: 'Moving Average (50)', category: 'Trend' },
    { id: 'RSI', name: 'RSI (14)', category: 'Momentum' },
    { id: 'MACD', name: 'MACD', category: 'Momentum' },
    { id: 'BB', name: 'Bollinger Bands', category: 'Volatility' },
    { id: 'VOL', name: 'Volume', category: 'Volume' }
  ];

  const selectedAssetData = availableAssets.find(asset => asset.symbol === selectedAsset);

  const toggleIndicator = (indicatorId: string) => {
    setIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  return (
    <Card className="p-6" data-testid="charting-studio">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LineChart className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-serif">Advanced Charting Studio</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isLive ? "default" : "secondary"} className="flex items-center space-x-1">
              {isLive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              <span>{isLive ? 'Live' : 'Paused'}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Chart Controls */}
          <div className="xl:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Chart Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Asset</label>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger data-testid="select-asset">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssets.map(asset => (
                        <SelectItem key={asset.symbol} value={asset.symbol}>
                          {asset.symbol} - {asset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAssetData && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-mono">CC {selectedAssetData.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Change:</span>
                        <span className={`font-mono ${selectedAssetData.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedAssetData.change > 0 ? '+' : ''}{selectedAssetData.change}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Timeframe</label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger data-testid="select-timeframe">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1M">1 Minute</SelectItem>
                      <SelectItem value="5M">5 Minutes</SelectItem>
                      <SelectItem value="15M">15 Minutes</SelectItem>
                      <SelectItem value="1H">1 Hour</SelectItem>
                      <SelectItem value="1D">1 Day</SelectItem>
                      <SelectItem value="1W">1 Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Chart Type</label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger data-testid="select-chart-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candlestick">Candlestick</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={isLive ? "default" : "outline"}
                    onClick={() => setIsLive(!isLive)}
                    data-testid="button-toggle-live"
                  >
                    {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    data-testid="button-reset-chart"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableIndicators.map(indicator => (
                    <div key={indicator.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{indicator.name}</p>
                        <p className="text-xs text-muted-foreground">{indicator.category}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={indicators.includes(indicator.id) ? "default" : "outline"}
                        onClick={() => toggleIndicator(indicator.id)}
                        data-testid={`button-indicator-${indicator.id}`}
                      >
                        {indicators.includes(indicator.id) ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart Area */}
          <div className="xl:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">Professional Chart View</h3>
                      <p className="text-muted-foreground">
                        {selectedAsset} • {timeframe} • {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Active Indicators: {indicators.join(', ') || 'None'}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold font-mono text-green-400">
                          {selectedAssetData?.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Current Price</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold font-mono ${selectedAssetData && selectedAssetData.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedAssetData?.change}%
                        </p>
                        <p className="text-xs text-muted-foreground">24h Change</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold font-mono text-primary">
                          {Math.floor(Math.random() * 100000).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Volume</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}