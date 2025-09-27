import { useState, useEffect } from 'react';
import { Brain, Trophy, BarChart3, Zap, Eye, Shield, TrendingUp, Camera, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureMetric {
  label: string;
  value: string;
  trend: number;
  color: 'primary' | 'green' | 'yellow' | 'cyan';
}

interface Competition {
  id: string;
  title: string;
  description: string;
  participants: number;
  prizePool: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert' | 'Master';
  timeRemaining: string;
}

export function FeatureShowcase() {
  const [aiGradingMetrics, setAiGradingMetrics] = useState<FeatureMetric[]>([
    { label: 'Accuracy Rate', value: '94.7%', trend: 0.3, color: 'green' },
    { label: 'Scans Processed', value: '847K', trend: 12.5, color: 'primary' },
    { label: 'Value Predictions', value: '99.2%', trend: 0.8, color: 'cyan' },
    { label: 'Response Time', value: '0.3s', trend: -15.2, color: 'yellow' }
  ]);

  const [activeCompetitions] = useState<Competition[]>([
    {
      id: 'weekly-predictions',
      title: 'Weekly Price Predictions',
      description: 'Predict which comics will gain the most value this week',
      participants: 1247,
      prizePool: 'CC 50,000',
      difficulty: 'Intermediate',
      timeRemaining: '3d 14h'
    },
    {
      id: 'ai-grading-challenge',
      title: 'AI Grading Challenge',
      description: 'Grade comics more accurately than our neural network',
      participants: 523,
      prizePool: 'CC 25,000',
      difficulty: 'Expert',
      timeRemaining: '1d 8h'
    },
    {
      id: 'market-sentiment',
      title: 'Market Sentiment Analysis',
      description: 'Predict market movements using social signals',
      participants: 892,
      prizePool: 'CC 75,000',
      difficulty: 'Master',
      timeRemaining: '5d 2h'
    }
  ]);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAiGradingMetrics(prev => prev.map(metric => ({
        ...metric,
        trend: metric.trend + (Math.random() - 0.5) * 0.2
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Expert': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Master': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-16 py-16" data-testid="feature-showcase">
      
      {/* AI Comic Grading Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-violet-500/20 rounded-full">
              <Brain className="h-8 w-8 text-violet-400" />
            </div>
            <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-lg px-4 py-2">
              Neural Network Powered
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif" data-testid="ai-grading-title">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Comic Grading
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionary computer vision algorithms analyze condition, authenticity, and market value with 
            institutional-grade precision. Our neural networks have processed millions of comic scans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Metrics */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20" data-testid="ai-metrics-card">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-violet-400" />
                  <span>Live Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="grid grid-cols-2 gap-4">
                  {aiGradingMetrics.map((metric) => (
                    <div 
                      key={metric.label}
                      className="p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10"
                      data-testid={`ai-metric-${metric.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        {metric.label}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold font-mono text-white">
                          {metric.value}
                        </span>
                        <div className={`text-xs ${metric.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Key Capabilities</h3>
              <div className="space-y-3">
                {[
                  { icon: Camera, title: 'Image Analysis', desc: 'Advanced computer vision for condition assessment' },
                  { icon: Shield, title: 'Authenticity Detection', desc: 'Anti-fraud neural networks verify legitimacy' },
                  { icon: Target, title: 'Value Prediction', desc: 'Market trend analysis for price forecasting' }
                ].map((capability) => (
                  <div key={capability.title} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover-elevate">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                      <capability.icon className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{capability.title}</h4>
                      <p className="text-sm text-muted-foreground">{capability.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Demo Interface */}
          <Card className="p-6 bg-black/40 backdrop-blur-md border-violet-500/20" data-testid="ai-demo-interface">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
                <span>Neural Network Interface</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                {/* Simulated scan results */}
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-400">Analysis Complete</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Grade: 9.4
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Condition Assessment:</span>
                      <span className="text-white font-mono">94.7% accuracy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Market Value:</span>
                      <span className="text-white font-mono">CC 15,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Confidence Level:</span>
                      <span className="text-white font-mono">98.2%</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-violet-600 hover:bg-violet-700" data-testid="button-try-ai-grading">
                  <Camera className="mr-2 h-4 w-4" />
                  Try AI Grading
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Beat the AI Competitions */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <Trophy className="h-8 w-8 text-amber-400" />
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-lg px-4 py-2">
              Live Competitions
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif" data-testid="competitions-title">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Beat the AI
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Think you can outsmart our algorithms? Compete against our AI systems in prediction challenges, 
            grading contests, and market analysis competitions. Prove your expertise and earn rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCompetitions.map((competition) => (
            <Card 
              key={competition.id} 
              className="p-6 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20 hover-elevate"
              data-testid={`competition-${competition.id}`}
            >
              <CardHeader className="px-0 pt-0">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{competition.title}</CardTitle>
                  <Badge className={getDifficultyColor(competition.difficulty)}>
                    {competition.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {competition.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants:</span>
                      <span className="font-mono text-white">{competition.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="font-mono text-amber-400 font-semibold">{competition.prizePool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Left:</span>
                      <span className="font-mono text-red-400">{competition.timeRemaining}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700" 
                    data-testid={`button-join-${competition.id}`}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Join Competition
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            data-testid="button-view-all-competitions"
          >
            View All Competitions
          </Button>
        </div>
      </section>

      {/* Market Intelligence Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-cyan-500/20 rounded-full">
              <Eye className="h-8 w-8 text-cyan-400" />
            </div>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-lg px-4 py-2">
              Real-Time Analytics
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif" data-testid="market-intelligence-title">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Market Intelligence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Proprietary algorithms process social signals, auction data, and collector behavior to reveal 
            market patterns invisible to human analysis. Access institutional-grade market intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Social Sentiment',
              value: '+127%',
              description: 'Positive mentions trending upward across collector communities',
              icon: TrendingUp,
              color: 'green'
            },
            {
              title: 'Liquidity Index',
              value: '94.2',
              description: 'High market liquidity with active buyer-seller matching',
              icon: BarChart3,
              color: 'blue'
            },
            {
              title: 'Volatility Signal',
              value: 'Low',
              description: 'Stable price action with minimal unexpected movements',
              icon: Zap,
              color: 'cyan'
            }
          ].map((intel, index) => (
            <Card 
              key={intel.title}
              className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20 hover-elevate"
              data-testid={`market-intel-${intel.title.toLowerCase().replace(' ', '-')}`}
            >
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <intel.icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{intel.title}</h3>
                      <div className="text-2xl font-bold font-mono text-cyan-400">
                        {intel.value}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {intel.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}