import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Award } from 'lucide-react';

interface GradePrice {
  grade: string;
  price: number;
  lastUpdated: string;
}

interface GradePricesData {
  assetId: string;
  grades: GradePrice[];
}

interface CGCGradeComparisonWidgetProps {
  assetId?: string;
}

export function CGCGradeComparisonWidget({ assetId }: CGCGradeComparisonWidgetProps) {
  const { data: gradePrices, isLoading, error } = useQuery<GradePricesData>({
    queryKey: ['/api/price-history', assetId, 'grades'],
    queryFn: async () => {
      if (!assetId) throw new Error('No asset selected');
      const response = await fetch(`/api/price-history/${assetId}/grades`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch grade prices: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    enabled: !!assetId,
    retry: 1,
  });

  const gradeLabels: Record<string, string> = {
    'ungraded': 'Raw/Ungraded',
    'cgc-4.0': 'CGC 4.0',
    'cgc-4.5': 'CGC 4.5',
    'cgc-6.0': 'CGC 6.0',
    'cgc-6.5': 'CGC 6.5',
    'cgc-8.0': 'CGC 8.0',
    'cgc-8.5': 'CGC 8.5',
    'cgc-9.2': 'CGC 9.2',
    'cgc-9.8': 'CGC 9.8',
    'cgc-10.0': 'CGC 10.0',
  };

  const gradeColors: Record<string, string> = {
    'ungraded': 'bg-slate-500/20 text-slate-300',
    'cgc-4.0': 'bg-red-500/20 text-red-300',
    'cgc-4.5': 'bg-orange-500/20 text-orange-300',
    'cgc-6.0': 'bg-yellow-500/20 text-yellow-300',
    'cgc-6.5': 'bg-lime-500/20 text-lime-300',
    'cgc-8.0': 'bg-green-500/20 text-green-300',
    'cgc-8.5': 'bg-emerald-500/20 text-emerald-300',
    'cgc-9.2': 'bg-cyan-500/20 text-cyan-300',
    'cgc-9.8': 'bg-blue-500/20 text-blue-300',
    'cgc-10.0': 'bg-purple-500/20 text-purple-300',
  };

  // Calculate price multipliers relative to ungraded
  const ungradedPrice = gradePrices?.grades.find(g => g.grade === 'ungraded')?.price || 0;
  
  const gradesWithMultiplier = gradePrices?.grades.map(g => ({
    ...g,
    multiplier: ungradedPrice > 0 ? g.price / ungradedPrice : 1,
  })).sort((a, b) => b.price - a.price) || [];

  const maxPrice = Math.max(...(gradePrices?.grades.map(g => g.price) || [0]));
  const hasValidPrices = maxPrice > 0;

  // Show placeholder if no asset selected
  if (!assetId) {
    return (
      <Card data-testid="widget-cgc-grade-comparison">
        <CardHeader>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              CGC Grading Impact
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Price by grade condition</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select an asset to view grading comparison</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="widget-cgc-grade-comparison">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              CGC Grading Impact
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Price by grade condition</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Award className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="font-medium text-destructive">Failed to load grading data</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        ) : gradePrices && gradesWithMultiplier.length > 0 ? (
          <div className="space-y-2">
            {gradesWithMultiplier.map(({ grade, price, multiplier }) => (
              <div 
                key={grade} 
                className="relative overflow-hidden rounded-md border border-border p-3"
                data-testid={`grade-row-${grade}`}
              >
                {/* Background bar showing relative value */}
                <div 
                  className="absolute inset-0 bg-primary/5"
                  style={{ 
                    width: hasValidPrices ? `${(price / maxPrice) * 100}%` : '0%',
                    transition: 'width 0.3s ease'
                  }}
                />
                
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge 
                      className={`${gradeColors[grade] || 'bg-muted'} font-mono text-xs min-w-[90px] justify-center`}
                      data-testid={`badge-${grade}`}
                    >
                      {gradeLabels[grade] || grade}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg" data-testid={`price-${grade}`}>
                        ${price.toLocaleString()}
                      </span>
                      {grade !== 'ungraded' && multiplier > 1 && (
                        <div className="flex items-center gap-1 text-green-500 text-sm">
                          <TrendingUp className="w-3 h-3" />
                          <span>{multiplier.toFixed(1)}x</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {grade === 'cgc-10.0' && price === maxPrice && (
                    <Badge variant="outline" className="text-xs text-primary border-primary">
                      Highest Value
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t border-border">
              {ungradedPrice > 0 && maxPrice > 0 ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Grading Premium Range</span>
                  <span className="font-medium">
                    {((maxPrice / ungradedPrice) - 1).toFixed(0)}% increase
                  </span>
                </div>
              ) : (
                <div className="text-sm text-amber-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Ungraded baseline price not available - multipliers may be inaccurate</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No grading data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
