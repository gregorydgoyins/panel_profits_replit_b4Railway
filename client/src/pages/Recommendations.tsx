import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, TrendingUp, Star, BookOpen, DollarSign, Target, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AssetRecommendation {
  id: string;
  name: string;
  type: string;
  currentPrice: number;
  description?: string;
  metadata?: {
    publisher?: string;
    yearPublished?: number;
    category?: string;
    tags?: string[];
  };
  recommendationScore: number;
  reason: string;
}

interface RecommendationsResponse {
  success: boolean;
  userId: string;
  recommendations: AssetRecommendation[];
  count: number;
  error?: string;
}

interface SimilarAsset {
  id: string;
  name: string;
  type: string;
  currentPrice: number;
  similarityScore: number;
  portfolioWeight: number;
}

interface PortfolioSimilarResponse {
  success: boolean;
  portfolioId: string;
  similarAssets: SimilarAsset[];
  count: number;
}

export default function Recommendations() {
  const [selectedUserId] = useState<string>('demo-user-1'); // In real app, this would come from auth context
  const [selectedPortfolioId] = useState<string>('demo-portfolio-1'); // From user's portfolio selection
  const { toast } = useToast();

  // Fetch user-based recommendations
  const { 
    data: userRecommendations, 
    isLoading: userRecommendationsLoading, 
    refetch: refetchUserRecommendations 
  } = useQuery<RecommendationsResponse>({
    queryKey: ['/api/vectors/recommendations/user', selectedUserId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/vectors/recommendations/user/${selectedUserId}?limit=8`);
      return response.json();
    }
  });

  // Fetch portfolio-based recommendations
  const { 
    data: portfolioRecommendations, 
    isLoading: portfolioRecommendationsLoading, 
    refetch: refetchPortfolioRecommendations 
  } = useQuery<PortfolioSimilarResponse>({
    queryKey: ['/api/vectors/recommendations/portfolio', selectedPortfolioId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/vectors/recommendations/portfolio/${selectedPortfolioId}?limit=6`);
      return response.json();
    }
  });

  // Generate embeddings mutation for better recommendations
  const generateEmbeddingsMutation = useMutation({
    mutationFn: async (assetId: string) => {
      const response = await apiRequest('POST', `/api/vectors/embeddings/assets/${assetId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Embeddings Updated!",
        description: "Asset analysis updated for better recommendations",
      });
      // Refetch recommendations after generating embeddings
      refetchUserRecommendations();
      refetchPortfolioRecommendations();
    },
    onError: (error: any) => {
      console.error('Embedding generation failed:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update asset analysis. Please try again.",
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

  const getRecommendationColor = (score: number) => {
    if (score >= 0.8) return "bg-emerald-100 text-emerald-800";
    if (score >= 0.6) return "bg-blue-100 text-blue-800";
    if (score >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPublisherIcon = (publisher?: string) => {
    if (!publisher) return BookOpen;
    if (publisher.toLowerCase().includes('marvel')) return Star;
    if (publisher.toLowerCase().includes('dc')) return Target;
    return BookOpen;
  };

  if (userRecommendationsLoading || portfolioRecommendationsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-pulse" />
          <h1 className="text-3xl  text-purple-600">Comics You Might Like</h1>
          <p className="text-muted-foreground mt-2">AI is analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl  bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Comics You Might Like
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover new investment opportunities with AI-powered recommendations based on your portfolio patterns and market trends
        </p>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button
          onClick={() => {
            refetchUserRecommendations();
            refetchPortfolioRecommendations();
          }}
          variant="outline"
          data-testid="button-refresh-recommendations"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Recommendations
        </Button>
      </div>

      {/* Personalized Recommendations */}
      <Card data-testid="card-personalized-recommendations">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Personalized For You
          </CardTitle>
          <CardDescription>
            AI-curated recommendations based on your portfolio and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRecommendations?.success && userRecommendations.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="recommendations-grid">
              {userRecommendations.recommendations.map((recommendation) => {
                const PublisherIcon = getPublisherIcon(recommendation.metadata?.publisher);
                
                return (
                  <Card
                    key={recommendation.id}
                    className="hover-elevate cursor-pointer"
                    data-testid={`recommendation-${recommendation.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          className={`text-xs ${getRecommendationColor(recommendation.recommendationScore)}`}
                          data-testid={`rec-score-${recommendation.id}`}
                        >
                          {(recommendation.recommendationScore * 100).toFixed(0)}% Match
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg " data-testid={`rec-price-${recommendation.id}`}>
                            {formatPrice(recommendation.currentPrice)}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-sm " data-testid={`rec-name-${recommendation.id}`}>
                        {recommendation.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <PublisherIcon className="w-3 h-3" />
                        <span>{recommendation.metadata?.publisher || 'Unknown Publisher'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Recommendation Reason */}
                        <div className="text-xs text-muted-foreground leading-relaxed" data-testid={`rec-reason-${recommendation.id}`}>
                          {recommendation.reason}
                        </div>

                        {/* Tags */}
                        {recommendation.metadata?.tags && recommendation.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {recommendation.metadata.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => generateEmbeddingsMutation.mutate(recommendation.id)}
                          disabled={generateEmbeddingsMutation.isPending}
                          data-testid={`button-improve-${recommendation.id}`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Alert data-testid="alert-no-recommendations">
              <Sparkles className="w-4 h-4" />
              <AlertDescription>
                No personalized recommendations available yet. Try adding some assets to your portfolio first!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Portfolio-Based Recommendations */}
      <Card data-testid="card-portfolio-recommendations">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Similar to Your Portfolio
          </CardTitle>
          <CardDescription>
            Assets with similar characteristics to your current holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolioRecommendations?.success && portfolioRecommendations.similarAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="portfolio-similar-grid">
              {portfolioRecommendations.similarAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className="hover-elevate bg-blue-50/50 dark:bg-blue-900/20"
                  data-testid={`portfolio-similar-${asset.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" data-testid={`similarity-${asset.id}`}>
                        {(asset.similarityScore * 100).toFixed(1)}% Similar
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg " data-testid={`similar-price-${asset.id}`}>
                          {formatPrice(asset.currentPrice)}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-sm " data-testid={`similar-name-${asset.id}`}>
                      {asset.name}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {asset.type}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Portfolio Weight:</span>
                        <span className="">{(asset.portfolioWeight * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={asset.portfolioWeight * 100} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert data-testid="alert-no-portfolio-recommendations">
              <Target className="w-4 h-4" />
              <AlertDescription>
                No portfolio-based recommendations available. Add more assets to your portfolio for better suggestions!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {(userRecommendations?.recommendations.length || portfolioRecommendations?.similarAssets.length) && (
        <Card data-testid="card-recommendation-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Recommendation Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl " data-testid="text-total-recommendations">
                  {(userRecommendations?.recommendations.length || 0) + (portfolioRecommendations?.similarAssets.length || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Recommendations</div>
              </div>
              <div>
                <div className="text-2xl " data-testid="text-avg-recommendation-score">
                  {userRecommendations?.recommendations.length 
                    ? (userRecommendations.recommendations.reduce((acc, rec) => acc + rec.recommendationScore, 0) / userRecommendations.recommendations.length * 100).toFixed(0)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Match Score</div>
              </div>
              <div>
                <div className="text-2xl " data-testid="text-avg-similarity">
                  {portfolioRecommendations?.similarAssets.length
                    ? (portfolioRecommendations.similarAssets.reduce((acc, asset) => acc + asset.similarityScore, 0) / portfolioRecommendations.similarAssets.length * 100).toFixed(0)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Similarity</div>
              </div>
              <div>
                <div className="text-2xl " data-testid="text-avg-price">
                  {userRecommendations?.recommendations.length
                    ? formatPrice(userRecommendations.recommendations.reduce((acc, rec) => acc + rec.currentPrice, 0) / userRecommendations.recommendations.length)
                    : '$0'}
                </div>
                <div className="text-sm text-muted-foreground">Avg Price</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}