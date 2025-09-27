import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Zap, Clock, Signal, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DataStream {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  timestamp: Date;
}

interface MarketIndicator {
  name: string;
  value: string;
  change: number;
  status: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

export function LiveDataTerminal() {
  const [dataStreams, setDataStreams] = useState<DataStream[]>([
    {
      id: '1',
      symbol: 'SM-X1',
      name: 'Spider-Man #1 (1990)',
      price: 875.50,
      change: 12.75,
      volume: '2.3K',
      signal: 'strong_buy',
      timestamp: new Date()
    },
    {
      id: '2',
      symbol: 'BM-Y2',
      name: 'Batman: Year Two #1',
      price: 234.80,
      change: -5.40,
      volume: '892',
      signal: 'hold',
      timestamp: new Date()
    },
    {
      id: '3',
      symbol: 'XM-G1',
      name: 'X-Men Giant Size #1',
      price: 4250.00,
      change: 85.50,
      volume: '145',
      signal: 'buy',
      timestamp: new Date()
    },
    {
      id: '4',
      symbol: 'FF-A4',
      name: 'Fantastic Four Annual #4',
      price: 145.25,
      change: -2.10,
      volume: '567',
      signal: 'sell',
      timestamp: new Date()
    }
  ]);

  const [marketIndicators] = useState<MarketIndicator[]>([
    { name: 'Comic Market Index', value: '14,752', change: 2.34, status: 'bullish', confidence: 94 },
    { name: 'Volatility Index', value: '23.4', change: -0.8, status: 'neutral', confidence: 87 },
    { name: 'Sentiment Score', value: '0.78', change: 0.12, status: 'bullish', confidence: 91 },
    { name: 'Liquidity Ratio', value: '1.24', change: 0.05, status: 'bullish', confidence: 96 }
  ]);

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [dataPointsProcessed, setDataPointsProcessed] = useState(2847392);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDataStreams(prev => prev.map(stream => ({
        ...stream,
        price: stream.price + (Math.random() - 0.5) * 10,
        change: stream.change + (Math.random() - 0.5) * 2,
        timestamp: new Date()
      })));

      setDataPointsProcessed(prev => prev + Math.floor(Math.random() * 50));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'buy': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'hold': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'sell': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'strong_sell': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'STRONG BUY';
      case 'buy': return 'BUY';
      case 'hold': return 'HOLD';
      case 'sell': return 'SELL';
      case 'strong_sell': return 'STRONG SELL';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="space-y-6" data-testid="live-data-terminal">
      
      {/* Terminal Header */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold font-mono">LIVE DATA TERMINAL</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`} />
              <span className="text-sm font-mono uppercase tracking-wide">
                {connectionStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm font-mono">
            <div className="text-center">
              <div className="text-xs text-gray-400">DATA POINTS</div>
              <div className="text-primary font-bold">
                {dataPointsProcessed.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">LATENCY</div>
              <div className="text-green-400 font-bold">23ms</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">UPTIME</div>
              <div className="text-cyan-400 font-bold">99.9%</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Real-time Data Stream */}
        <Card className="p-6 bg-black/30 backdrop-blur-sm border-gray-700/50" data-testid="real-time-data-stream">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center space-x-2">
              <Signal className="h-5 w-5 text-cyan-400" />
              <span className="font-mono">REAL-TIME STREAM</span>
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-mono">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-0 pb-0">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {dataStreams.map((stream) => (
                <div 
                  key={stream.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover-elevate transition-all"
                  data-testid={`data-stream-${stream.symbol}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-primary font-bold">
                        {stream.symbol}
                      </span>
                      <Badge className={getSignalColor(stream.signal)}>
                        {getSignalText(stream.signal)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {stream.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-3">
                    {stream.name}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-xs text-gray-400">PRICE</div>
                        <div className="font-mono text-white font-bold">
                          CC {stream.price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">24H</div>
                        <div className={`font-mono font-bold ${
                          stream.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stream.change >= 0 ? '+' : ''}{stream.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">VOLUME</div>
                      <div className="font-mono text-white">
                        {stream.volume}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Indicators */}
        <Card className="p-6 bg-black/30 backdrop-blur-sm border-gray-700/50" data-testid="market-indicators">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-mono">MARKET INDICATORS</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {marketIndicators.map((indicator) => (
                <div 
                  key={indicator.name}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                  data-testid={`market-indicator-${indicator.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      {indicator.name}
                    </span>
                    <div className={`text-sm font-mono ${
                      indicator.status === 'bullish' ? 'text-green-400' :
                      indicator.status === 'bearish' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {indicator.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-mono font-bold text-white">
                        {indicator.value}
                      </div>
                      <div className="flex items-center space-x-1">
                        {indicator.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm font-mono ${
                          indicator.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {indicator.change >= 0 ? '+' : ''}{indicator.change}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">CONFIDENCE</div>
                      <div className="text-sm font-mono text-cyan-400">
                        {indicator.confidence}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Confidence bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-800 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-primary h-1 rounded-full transition-all duration-1000"
                        style={{ width: `${indicator.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-cyan-500/10 border-primary/20" data-testid="system-status">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-mono text-sm">NEURAL NETWORKS ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-mono">
                Last Update: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="text-sm font-mono text-cyan-400">
            PROCESSING {Math.floor(dataPointsProcessed / 1000)}K+ DATA POINTS
          </div>
        </div>
      </Card>
    </div>
  );
}