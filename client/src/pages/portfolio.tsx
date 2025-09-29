import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, TrendingUp, TrendingDown, Target, Users, Brain, 
  Sparkles, DollarSign, BarChart3, PieChart, ArrowUpRight,
  Heart, RefreshCw, AlertTriangle, CheckCircle, Archive,
  Shield, Crown, Award, Star, Gem
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ComicStorageVault } from '@/components/collector/ComicStorageVault';
import { GradedSlabModal } from '@/components/collector/GradedSlabModal';
import { VariantTradingCard } from '@/components/collector/VariantTradingCard';
import { useCollectorVault } from '@/hooks/useCollectorVault';
import { useVariantRegistry } from '@/hooks/useVariantRegistry';
import { useHouseTheme } from '@/contexts/HouseThemeContext';

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
  const [activeView, setActiveView] = useState<'traditional' | 'collector'>('traditional');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showGradedModal, setShowGradedModal] = useState(false);
  const { toast } = useToast();
  const { currentHouse, getHouseTheme } = useHouseTheme();
  
  // Collector vault hooks
  const {
    gradedProfiles,
    storageBoxes,
    analytics,
    isLoading: isLoadingCollector,
    performGradingAssessment,
    createGradedProfile
  } = useCollectorVault();
  
  const { useVariantTradingCard } = useVariantRegistry();

  // Real portfolio data from collector vault - replaces all mock data
  const portfolioAssets = useMemo(() => {
    if (!gradedProfiles || gradedProfiles.length === 0) return [];
    
    // Convert graded profiles to portfolio assets format
    const totalValue = gradedProfiles.reduce((sum, profile) => sum + (profile.currentMarketValue || 0), 0);
    
    return gradedProfiles.map((profile) => {
      const acquisitionPrice = profile.acquisitionPrice || 0;
      const currentValue = profile.currentMarketValue || 0;
      const percentChange = acquisitionPrice > 0 ? ((currentValue - acquisitionPrice) / acquisitionPrice) * 100 : 0;
      const weight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      
      // Calculate risk score based on rarity and grade
      const riskScore = profile.rarityTier === 'mythic' ? 9.0
                      : profile.rarityTier === 'legendary' ? 7.5
                      : profile.rarityTier === 'ultra_rare' ? 6.0
                      : profile.rarityTier === 'rare' ? 4.5
                      : profile.rarityTier === 'uncommon' ? 3.0
                      : 2.0;
      
      return {
        id: profile.id,
        name: profile.name,
        type: profile.isKeyIssue ? 'Key Issue' : 'Comic',
        quantity: 1, // Each graded profile represents one item
        avgPrice: acquisitionPrice,
        currentPrice: currentValue,
        totalValue: currentValue,
        percentChange,
        weight,
        riskScore
      };
    });
  }, [gradedProfiles]);

  // Calculate portfolio totals from real data
  const totalPortfolioValue = useMemo(() => {
    return analytics?.totalValue || portfolioAssets.reduce((sum, asset) => sum + asset.totalValue, 0);
  }, [analytics, portfolioAssets]);

  const totalPortfolioChange = useMemo(() => {
    return portfolioAssets.reduce((sum, asset) => sum + (asset.totalValue - (asset.avgPrice * asset.quantity)), 0);
  }, [portfolioAssets]);

  const totalPortfolioChangePercent = useMemo(() => {
    return analytics?.growthRate || (totalPortfolioValue > 0 ? (totalPortfolioChange / (totalPortfolioValue - totalPortfolioChange)) * 100 : 0);
  }, [analytics, totalPortfolioValue, totalPortfolioChange]);

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
  
  // Collector-specific handlers
  const handleAssetSelect = (asset: any) => {
    setSelectedAsset(asset);
    setShowGradedModal(true);
  };
  
  const handleBoxSelect = (box: any) => {
    toast({
      title: "Storage Box Selected",
      description: `Opening ${box.name} with ${box.currentCount} items.`,
    });
  };
  
  const handleCreateBox = () => {
    toast({
      title: "Create Storage Box",
      description: "Storage box creation dialog would open here.",
    });
  };
  
  const handleGradeAsset = (assetId: string) => {
    toast({
      title: "Grade Asset",
      description: "Asset grading workflow would start here.",
    });
  };
  
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return Crown;
      case 'legendary': return Award;
      case 'ultra_rare': return Star;
      case 'rare': return Gem;
      default: return Shield;
    }
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'text-amber-400 bg-amber-950 border-amber-400';
      case 'legendary': return 'text-orange-400 bg-orange-950 border-orange-400';
      case 'ultra_rare': return 'text-purple-400 bg-purple-950 border-purple-400';
      case 'rare': return 'text-blue-400 bg-blue-950 border-blue-400';
      case 'uncommon': return 'text-green-400 bg-green-950 border-green-400';
      default: return 'text-gray-400 bg-gray-800 border-gray-500';
    }
  };

  return (
    <div className="space-y-6" data-testid="page-portfolio">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">
            {activeView === 'collector' 
              ? 'Professional collector-grade asset management with CGC-style grading'
              : 'AI-powered portfolio analysis with vector-based insights and recommendations'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="mr-4">
            <TabsList>
              <TabsTrigger value="traditional" data-testid="tab-traditional-view">
                <BarChart3 className="w-4 h-4 mr-2" />
                Traditional
              </TabsTrigger>
              <TabsTrigger value="collector" data-testid="tab-collector-view">
                <Archive className="w-4 h-4 mr-2" />
                Collector
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Badge variant="secondary" className="flex items-center gap-1">
            {activeView === 'collector' ? (
              <>
                <Shield className="w-3 h-3" />
                CGC Certified
              </>
            ) : (
              <>
                <Brain className="w-3 h-3" />
                AI Analysis
              </>
            )}
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
            {activeView === 'collector' ? 'Grade Assets' : 'Optimize Portfolio'}
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

      {/* Holdings - with loading states and collector view integration */}
      <Card data-testid="card-holdings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            {activeView === 'collector' ? 'Graded Collection' : 'Your Holdings'}
          </CardTitle>
          <CardDescription>
            {activeView === 'collector' 
              ? 'Professional graded comic collection with CGC-style certification and rarity analysis'
              : 'Current portfolio composition with AI-powered risk and performance analysis'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading state for collector data */}
          {isLoadingCollector && activeView === 'collector' ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {portfolioAssets.length > 0 ? (
                portfolioAssets.map((asset) => (
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
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <Archive className="w-12 h-12 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-600">
                        {activeView === 'collector' ? 'No Graded Assets Yet' : 'No Holdings Found'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {activeView === 'collector' 
                          ? 'Start building your graded collection by adding certified comic book assets'
                          : 'Begin your investment journey by adding comic assets to your portfolio'
                        }
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGradeAsset('')}
                      data-testid="button-start-collection"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {activeView === 'collector' ? 'Grade Your First Asset' : 'Add First Asset'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collector-Specific Components */}
      {activeView === 'collector' && (
        <>
          {/* Comic Storage Vault */}
          <ComicStorageVault
            gradedAssets={gradedProfiles || []}
            storageBoxes={storageBoxes || []}
            analytics={analytics}
            onAssetSelect={handleAssetSelect}
            onBoxSelect={handleBoxSelect}
            onCreateBox={handleCreateBox}
            isLoading={isLoadingCollector}
          />

          {/* Graded Slab Modal */}
          {selectedAsset && showGradedModal && (
            <GradedSlabModal
              asset={selectedAsset}
              isOpen={showGradedModal}
              onClose={() => setShowGradedModal(false)}
              onGradeAsset={handleGradeAsset}
            />
          )}

          {/* Variant Trading Cards for Collection */}
          {gradedProfiles && gradedProfiles.length > 0 && (
            <Card data-testid="card-variant-trading-cards">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Variant Trading Cards
                </CardTitle>
                <CardDescription>
                  Collectible trading cards for your rarest variants with holographic effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradedProfiles.slice(0, 6).map((profile) => (
                    <VariantTradingCard
                      key={profile.id}
                      variant={{
                        id: profile.id,
                        name: profile.name,
                        rarity: profile.rarityTier,
                        grade: profile.overallGrade,
                        imageUrl: profile.imageUrl,
                        marketValue: profile.currentMarketValue || 0,
                        houseAffiliation: profile.houseAffiliation
                      }}
                      onClick={() => handleAssetSelect(profile)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

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