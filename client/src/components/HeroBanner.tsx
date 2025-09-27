import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Brain, Zap, TrendingUp, Eye, Sparkles, BarChart3, Shield, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface MarketPulse {
  metric: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export function HeroBanner() {
  const [, setLocation] = useLocation();
  
  const [marketPulses, setMarketPulses] = useState<MarketPulse[]>([
    { metric: 'AI Accuracy', value: '94.7%', change: 0.3, trend: 'up' },
    { metric: 'Signal Strength', value: '87.2', change: -1.1, trend: 'down' },
    { metric: 'Market Volatility', value: '23.4', change: 2.5, trend: 'up' },
    { metric: 'Trading Volume', value: 'CC 847M', change: 5.7, trend: 'up' }
  ]);

  const [currentTimestamp, setCurrentTimestamp] = useState(new Date());
  const [aiConfidence, setAiConfidence] = useState(94.7);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(new Date());
      
      // Simulate minor fluctuations in AI confidence
      setAiConfidence(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(90, Math.min(99, prev + change));
      });

      // Occasionally update market pulses
      if (Math.random() < 0.3) {
        setMarketPulses(prev => prev.map(pulse => ({
          ...pulse,
          change: pulse.change + (Math.random() - 0.5) * 0.5
        })));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden" data-testid="hero-banner">
      {/* Background with mystical gradient and subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]" />
      </div>

      {/* Floating market data elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-xs font-mono text-primary/20 animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          >
            {i % 2 === 0 ? '+2.34%' : 'BUY'}
          </div>
        ))}
      </div>

      <div className="relative z-10 px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Main content */}
            <div className="space-y-8">
              {/* AI Status Indicator */}
              <div className="flex items-center space-x-3" data-testid="ai-status-indicator">
                <div className="flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-primary font-medium text-sm">AI Systems Online</span>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  Neural Network Active
                </Badge>
              </div>

              {/* Main headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold font-serif leading-tight" data-testid="hero-headline">
                  <span className="bg-gradient-to-r from-white via-primary-foreground to-primary bg-clip-text text-transparent">
                    Decode the
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Comic Markets
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Advanced AI-powered analysis reveals hidden patterns in comic valuations. 
                  Access institutional-grade market intelligence for serious collectors.
                </p>
              </div>

              {/* Value propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10" data-testid="value-prop-ai-grading">
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Brain className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Comic Grading</h3>
                    <p className="text-sm text-gray-300">Neural networks assess condition and rarity with 94.7% accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10" data-testid="value-prop-market-intel">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Eye className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Market Intelligence</h3>
                    <p className="text-sm text-gray-300">Real-time analysis of price movements and emerging trends</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg"
                  data-testid="button-start-trading"
                  onClick={() => setLocation('/ai-studio')}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Begin Advanced Analysis
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/50 text-primary hover:bg-primary/10 font-semibold px-8 py-3 text-lg backdrop-blur-sm"
                  data-testid="button-beat-ai"
                  onClick={() => setLocation('/beat-ai')}
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Challenge the AI
                </Button>
              </div>
            </div>

            {/* Right side - Live market data terminal */}
            <div className="space-y-6">
              {/* AI Confidence Display */}
              <Card className="p-6 bg-black/40 backdrop-blur-md border-primary/20" data-testid="ai-confidence-display">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">AI Market Confidence</span>
                  </div>
                  <div className="relative">
                    <div className="text-5xl font-bold font-mono bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                      {aiConfidence.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Last updated: {currentTimestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-cyan-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${aiConfidence}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Live Market Pulses */}
              <div className="grid grid-cols-2 gap-3">
                {marketPulses.map((pulse, index) => (
                  <Card 
                    key={pulse.metric} 
                    className="p-4 bg-black/30 backdrop-blur-sm border-gray-700/50 hover-elevate"
                    data-testid={`market-pulse-${pulse.metric.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        {pulse.metric}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold font-mono text-white">
                          {pulse.value}
                        </span>
                        <div className={`flex items-center space-x-1 text-sm ${
                          pulse.trend === 'up' ? 'text-green-400' : 
                          pulse.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-mono">
                            {pulse.change > 0 ? '+' : ''}{pulse.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Quick access panel */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-md border-primary/30" data-testid="quick-access-panel">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary">Terminal Access</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Exclusive algorithms analyze over <span className="text-primary font-bold">2.4M data points</span> 
                    across comic valuations, creator trajectories, and market sentiment.
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Institutional-grade security • Real-time data streams</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}