import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

interface RiskMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'danger';
  description: string;
}

export function PortfolioRiskMetricsWidget() {
  const metrics: RiskMetric[] = [
    {
      name: 'Value at Risk (VaR)',
      value: '-$4,230',
      status: 'warning',
      description: '95% confidence, 1-day horizon'
    },
    {
      name: 'Sharpe Ratio',
      value: '1.84',
      status: 'good',
      description: 'Risk-adjusted return metric'
    },
    {
      name: 'Portfolio Beta',
      value: '1.12',
      status: 'good',
      description: 'Market correlation factor'
    },
    {
      name: 'Max Drawdown',
      value: '-8.4%',
      status: 'warning',
      description: 'Peak to trough decline'
    },
    {
      name: 'Volatility (30d)',
      value: '18.2%',
      status: 'warning',
      description: 'Annualized standard deviation'
    },
    {
      name: 'Sortino Ratio',
      value: '2.31',
      status: 'good',
      description: 'Downside risk-adjusted'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <Shield className="w-4 h-4 text-green-500" />;
      case 'warning': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card data-testid="widget-risk-metrics">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Portfolio Risk Metrics</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced risk analytics
            </p>
          </div>
          <Badge variant="outline">
            <TrendingDown className="w-3 h-3 mr-1" />
            Risk: Moderate
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="p-4 rounded-lg border hover-elevate"
              data-testid={`metric-${metric.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <p className="text-sm ">{metric.name}</p>
                </div>
              </div>
              <p className={`text-2xl  ${getStatusColor(metric.status)}`}>
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Risk Summary */}
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div className="text-xs">
              <p className=" text-yellow-500">Risk Assessment</p>
              <p className="text-muted-foreground mt-1">
                Portfolio shows moderate volatility with healthy risk-adjusted returns. 
                VaR indicates potential $4.2K loss in worst-case scenario. Consider rebalancing if volatility exceeds 20%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
