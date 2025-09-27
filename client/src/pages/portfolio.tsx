import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Briefcase, TrendingUp, TrendingDown, Target, Users, Brain, 
  Sparkles, DollarSign, BarChart3, PieChart, ArrowUpRight,
  Heart, RefreshCw, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface PortfolioAsset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  percentChange: number;
  weight: number;
  riskScore: number;
}

interface PortfolioAnalysis {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  diversificationScore: number;
  riskScore: number;
  aiInsights: string[];
  recommendedActions: string[];
}

interface SimilarPortfolio {
  id: string;
  ownerName: string;
  similarityScore: number;
  totalValue: number;
  performance: number;
  topAssets: string[];
  strategy: string;
}

interface VectorPortfolioResponse {
  success: boolean;
  portfolioId: string;
  analysis: PortfolioAnalysis;
  similarPortfolios: SimilarPortfolio[];
  recommendations: {
    id: string;
    name: string;
    reason: string;
    confidence: number;
    expectedReturn: number;
  }[];
}

export default function PortfolioPage() {
  const [selectedPortfolioId] = useState('demo-portfolio-1');
  const { toast } = useToast();

  // Mock portfolio data
  const portfolioAssets: PortfolioAsset[] = [
    {
      id: 'xmen1',
      name: 'X-Men #1 (1963)',
      type: 'Key Issue',
      quantity: 1,
      avgPrice: 8500,
      currentPrice: 12000,
      totalValue: 12000,
      percentChange: 41.2,
      weight: 35.3,
      riskScore: 6.5
    },
    {
      id: 'ih181',
      name: 'Incredible Hulk #181',
      type: 'Key Issue',
      quantity: 2,
      avgPrice: 6200,
      currentPrice: 8500,
      totalValue: 17000,
      percentChange: 37.1,
      weight: 50.0,
      riskScore: 7.2
    },
    {
      id: 'asm129',
      name: 'Amazing Spider-Man #129',
      type: 'Key Issue',
      quantity: 1,
      avgPrice: 4800,
      currentPrice: 5000,
      totalValue: 5000,
      percentChange: 4.2,
      weight: 14.7,
      riskScore: 5.8
    }
  ];

  const totalPortfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.totalValue, 0);
  const totalPortfolioChange = portfolioAssets.reduce((sum, asset) => sum + (asset.totalValue - (asset.avgPrice * asset.quantity)), 0);
  const totalPortfolioChangePercent = (totalPortfolioChange / (totalPortfolioValue - totalPortfolioChange)) * 100;

  // Vector portfolio analysis query
  const { 
    data: vectorAnalysis, 
    isLoading: analysisLoading,
    refetch: refetchAnalysis 
  } = useQuery<VectorPortfolioResponse>({
    queryKey: ['/api/vectors/portfolio/analysis', selectedPortfolioId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/vectors/portfolio/analysis/${selectedPortfolioId}`);
      return response.json();
    }
  });

  // Portfolio optimization mutation
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/vectors/portfolio/optimize/${selectedPortfolioId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio Optimized!",
        description: "AI analysis complete. Check your recommendations below.",
      });
      refetchAnalysis();
    },
    onError: (error: any) => {
      console.error('Portfolio optimization failed:', error);
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize portfolio. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 7) return "text-red-600";
    if (riskScore >= 5) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskLabel = (riskScore: number) => {
    if (riskScore >= 7) return "High Risk";
    if (riskScore >= 5) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="space-y-6" data-testid="page-portfolio">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered portfolio analysis with vector-based insights and recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            AI Analysis
          </Badge>
          <Button
            onClick={() => optimizeMutation.mutate()}
            disabled={optimizeMutation.isPending}
            variant="outline"
            data-testid="button-optimize-portfolio"
          >
            {optimizeMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Optimize Portfolio
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="portfolio-overview">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold" data-testid="text-total-value">
                  {formatPrice(totalPortfolioValue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${totalPortfolioChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-total-change">
                  {totalPortfolioChangePercent >= 0 ? '+' : ''}{totalPortfolioChangePercent.toFixed(1)}%
                </p>
              </div>
              {totalPortfolioChangePercent >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diversification</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="text-diversification">
                  {vectorAnalysis?.analysis.diversificationScore ? `${vectorAnalysis.analysis.diversificationScore}/10` : '7.2/10'}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskColor(6.5)}`} data-testid="text-risk-score">
                  {vectorAnalysis?.analysis.riskScore ? vectorAnalysis.analysis.riskScore.toFixed(1) : '6.5'}/10
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      <Card data-testid="card-holdings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Your Holdings
          </CardTitle>
          <CardDescription>
            Current portfolio composition with AI-powered risk and performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`holding-${asset.id}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{asset.name}</h3>
                    <Badge variant="outline">{asset.type}</Badge>
                    <Badge className={getRiskColor(asset.riskScore)}>
                      {getRiskLabel(asset.riskScore)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Qty: {asset.quantity}</span>
                    <span>Avg: {formatPrice(asset.avgPrice)}</span>
                    <span>Current: {formatPrice(asset.currentPrice)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(asset.totalValue)}</p>
                  <p className={`text-sm ${asset.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.percentChange >= 0 ? '+' : ''}{asset.percentChange.toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">Weight:</span>
                    <span className="text-xs font-medium">{asset.weight.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vector-Based Recommendations */}
        <Card data-testid="card-ai-recommendations">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Vector-powered investment suggestions based on your portfolio patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vectorAnalysis?.recommendations && vectorAnalysis.recommendations.length > 0 ? (
              <div className="space-y-3">
                {vectorAnalysis.recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 border rounded-lg" data-testid={`recommendation-${rec.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{rec.name}</h4>
                      <Badge variant="secondary">{(rec.confidence * 100).toFixed(0)}% Confidence</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-green-600">
                        Expected Return: +{rec.expectedReturn.toFixed(1)}%
                      </span>
                      <Button size="sm" variant="outline">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        View Asset
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mock recommendations */}
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">Batman #1 (1940)</h4>
                    <Badge variant="secondary">87% Confidence</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Similar investment pattern to your X-Men holdings. Strong vintage appeal.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600">Expected Return: +15.2%</span>
                    <Button size="sm" variant="outline">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      View Asset
                    </Button>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">Fantastic Four #5</h4>
                    <Badge variant="secondary">82% Confidence</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    First Doctor Doom complements your villain collection strategy.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600">Expected Return: +12.8%</span>
                    <Button size="sm" variant="outline">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      View Asset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Similar Portfolios */}
        <Card data-testid="card-similar-portfolios">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Similar Portfolios
            </CardTitle>
            <CardDescription>
              Learn from portfolios with similar investment patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vectorAnalysis?.similarPortfolios && vectorAnalysis.similarPortfolios.length > 0 ? (
              <div className="space-y-3">
                {vectorAnalysis.similarPortfolios.map((portfolio) => (
                  <div key={portfolio.id} className="p-3 border rounded-lg" data-testid={`similar-portfolio-${portfolio.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{portfolio.ownerName}</h4>
                      <Badge variant="outline">{(portfolio.similarityScore * 100).toFixed(0)}% Similar</Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                      <span>Value: {formatPrice(portfolio.totalValue)}</span>
                      <span className={portfolio.performance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {portfolio.performance >= 0 ? '+' : ''}{portfolio.performance.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Strategy: {portfolio.strategy}</p>
                    <div className="flex flex-wrap gap-1">
                      {portfolio.topAssets.map((asset, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mock similar portfolios */}
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">ComicInvestor_Pro</h4>
                    <Badge variant="outline">89% Similar</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <span>Value: {formatPrice(45000)}</span>
                    <span className="text-green-600">+23.4%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Strategy: Key Issue Focus</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">X-Men #1</Badge>
                    <Badge variant="outline" className="text-xs">Hulk #181</Badge>
                    <Badge variant="outline" className="text-xs">FF #1</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">VintageCollector</h4>
                    <Badge variant="outline">84% Similar</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <span>Value: {formatPrice(38500)}</span>
                    <span className="text-green-600">+18.7%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Strategy: Silver Age Focus</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">ASM #1</Badge>
                    <Badge variant="outline" className="text-xs">X-Men #1</Badge>
                    <Badge variant="outline" className="text-xs">FF #4</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Alert */}
      <Alert data-testid="alert-ai-insights">
        <Brain className="w-4 h-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">AI Portfolio Analysis Complete</p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Strong foundation in key Marvel issues
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-yellow-600" />
                Consider diversifying into DC Comics for balance
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-3 h-3 text-blue-600" />
                Excellent timing for X-Men related investments
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}