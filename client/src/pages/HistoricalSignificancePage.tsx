import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar, Star, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

interface HistoricalSignificance {
  comicId: number;
  title: string;
  series: string;
  issueNumber: number;
  coverUrl: string;
  onsaleDate: string | null;
  significance: string;
  historicalContext: string;
  fullAnalysis: string;
  culturalImpact: string;
  marketImportance: string;
  recommendation: string;
  keyPoints: string[];
  estimatedValue: number;
  printPrice: number;
}

export default function HistoricalSignificancePage() {
  const params = useParams();
  const comicId = params.id;

  const { data, isLoading, error } = useQuery<{ success: boolean; data: HistoricalSignificance }>({
    queryKey: ['/api/comic-covers/historical-significance', comicId],
    enabled: !!comicId,
  });

  const comic = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <Card>
            <CardHeader>
              <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="h-40 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="min-h-screen !bg-[#1A1F2E] p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Historical significance data not found. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const priceChangePercent = ((comic.estimatedValue - comic.printPrice) / comic.printPrice) * 100;

  return (
    <div className="min-h-screen !bg-[#1A1F2E] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Main Article Card */}
        <Card className="!bg-[#1A1F2E]">
          <CardHeader>
            <div className="flex items-start gap-6 mb-4">
              {/* Cover Image */}
              {comic.coverUrl && (
                <img
                  src={comic.coverUrl}
                  alt={comic.title}
                  className="w-32 aspect-[2/3] object-cover rounded-lg border-2 border-border"
                  data-testid="img-historical-significance-cover"
                />
              )}
              
              {/* Title and Metadata */}
              <div className="flex-1">
                <Badge className="mb-3 bg-yellow-500 text-black">
                  {comic.significance}
                </Badge>
                <CardTitle className="text-3xl  mb-3">{comic.title}</CardTitle>
                <p className="text-lg text-muted-foreground mb-3">
                  {comic.series} #{comic.issueNumber}
                </p>
                
                <div className="flex items-center gap-4 flex-wrap">
                  {comic.onsaleDate && (
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(comic.onsaleDate).getFullYear()}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-green-500">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{priceChangePercent.toFixed(0)}% Value Growth
                  </Badge>
                  <Badge variant="outline">
                    ${comic.estimatedValue.toLocaleString()} Current Value
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Historical Context */}
            <section>
              <h2 className="text-2xl  mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Historical Context
              </h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                {comic.historicalContext}
              </p>
            </section>

            {/* Full Analysis */}
            {comic.fullAnalysis && (
              <section>
                <h2 className="text-2xl  mb-4">In-Depth Analysis</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                    {comic.fullAnalysis}
                  </p>
                </div>
              </section>
            )}

            {/* Cultural Impact */}
            {comic.culturalImpact && (
              <section className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <h2 className="text-2xl  mb-4 text-primary">Cultural Impact</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {comic.culturalImpact}
                </p>
              </section>
            )}

            {/* Market Importance */}
            {comic.marketImportance && (
              <section className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h2 className="text-2xl  mb-4 text-green-500">Market Importance</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {comic.marketImportance}
                </p>
              </section>
            )}

            {/* Key Points */}
            {comic.keyPoints && comic.keyPoints.length > 0 && (
              <section>
                <h2 className="text-2xl  mb-4">Key Takeaways</h2>
                <ul className="space-y-3">
                  {comic.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
                      <span className="text-foreground/80 text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Recommendation */}
            {comic.recommendation && (
              <section className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                <h2 className="text-2xl  mb-4 text-indigo-400">Why This Comic Matters</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {comic.recommendation}
                </p>
              </section>
            )}

            {/* Investment Summary */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl  mb-4">Investment Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Original Print Price</p>
                  <p className="text-2xl  text-foreground">${comic.printPrice.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Market Value</p>
                  <p className="text-2xl  text-green-500">
                    ${comic.estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Value Appreciation</p>
                  <p className="text-2xl  text-yellow-500">
                    +{priceChangePercent.toFixed(0)}%
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
