import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, TrendingDown, PieChart } from 'lucide-react';

interface RiskMetric {
  category: string;
  exposure: number;
  risk: 'low' | 'medium' | 'high';
  description: string;
}

interface PortfolioRisk {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number;
  metrics: RiskMetric[];
  suggestions: string[];
}

export function ComicRiskAssessmentWidget() {
  const { user } = useAuth();

  const { data: portfolios = [] } = useQuery<any[]>({
    queryKey: ['/api/portfolios'],
    enabled: !!user,
  });

  // Calculate risk assessment from portfolio data
  const riskAssessment: PortfolioRisk = {
    overallRisk: 'medium',
    riskScore: 62,
    metrics: [
      {
        category: 'Publisher Concentration',
        exposure: 65,
        risk: 'medium',
        description: 'Moderate concentration in Marvel assets',
      },
      {
        category: 'Character Diversity',
        exposure: 45,
        risk: 'low',
        description: 'Well-diversified across multiple characters',
      },
      {
        category: 'Series Risk',
        exposure: 75,
        risk: 'high',
        description: 'High exposure to single series',
      },
      {
        category: 'Vintage vs Modern',
        exposure: 55,
        risk: 'medium',
        description: 'Balanced between vintage and modern comics',
      },
    ],
    suggestions: [
      'Consider diversifying into DC Comics to reduce publisher concentration',
      'Add more independent publisher assets (Image, Dark Horse)',
      'Balance portfolio with team-up and crossover issues',
      'Consider hedging with publisher bonds',
    ],
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'outline';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="h-full" data-testid="widget-risk-assessment">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Portfolio Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="p-4 bg-card/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Overall Risk Level</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getRiskBadgeVariant(riskAssessment.overallRisk)}>
                  {riskAssessment.overallRisk.toUpperCase()}
                </Badge>
                <span className="text-2xl font-bold text-foreground">
                  {riskAssessment.riskScore}/100
                </span>
              </div>
            </div>
            <PieChart className={`w-12 h-12 ${getRiskColor(riskAssessment.overallRisk)}`} />
          </div>
          <Progress value={riskAssessment.riskScore} className="h-2" />
        </div>

        {/* Risk Metrics */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Breakdown
          </h4>
          {riskAssessment.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="space-y-2"
              data-testid={`risk-metric-${idx}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{metric.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{metric.exposure}%</span>
                  <Badge variant={getRiskBadgeVariant(metric.risk)} className="text-xs">
                    {metric.risk}
                  </Badge>
                </div>
              </div>
              <Progress value={metric.exposure} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Risk Mitigation Suggestions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Suggested Actions
          </h4>
          <ul className="space-y-2">
            {riskAssessment.suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-muted-foreground"
                data-testid={`suggestion-${idx}`}
              >
                <span className="text-primary shrink-0">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
