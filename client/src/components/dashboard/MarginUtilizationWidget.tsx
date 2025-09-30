import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function MarginUtilizationWidget() {
  const marginData = {
    accountEquity: 50000,
    marginUsed: 32500,
    marginAvailable: 17500,
    buyingPower: 100000,
    maintenanceMargin: 25000,
    utilizationPercent: 65
  };

  const utilizationLevel = 
    marginData.utilizationPercent >= 80 ? 'danger' :
    marginData.utilizationPercent >= 60 ? 'warning' :
    'safe';

  const getUtilizationColor = () => {
    switch (utilizationLevel) {
      case 'danger': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'safe': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getUtilizationBg = () => {
    switch (utilizationLevel) {
      case 'danger': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'safe': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  return (
    <Card data-testid="widget-margin-utilization">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Margin Utilization</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Leverage & buying power
            </p>
          </div>
          <Badge variant="outline" className={getUtilizationColor()}>
            {marginData.utilizationPercent}% Used
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Utilization Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Margin Usage</span>
            <span className={`text-2xl font-bold ${getUtilizationColor()}`}>
              {marginData.utilizationPercent}%
            </span>
          </div>
          <Progress 
            value={marginData.utilizationPercent} 
            className="h-3"
            data-testid="progress-margin-utilization"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>Safe Zone</span>
            <span>Warning</span>
            <span>Danger</span>
            <span>100%</span>
          </div>
        </div>

        {/* Margin Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Account Equity</p>
            </div>
            <p className="text-xl font-bold" data-testid="text-account-equity">
              ${marginData.accountEquity.toLocaleString()}
            </p>
          </div>

          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Buying Power</p>
            </div>
            <p className="text-xl font-bold text-green-500" data-testid="text-buying-power">
              ${marginData.buyingPower.toLocaleString()}
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-yellow-500/10">
            <p className="text-xs text-muted-foreground mb-1">Margin Used</p>
            <p className="text-xl font-bold text-yellow-500" data-testid="text-margin-used">
              ${marginData.marginUsed.toLocaleString()}
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-green-500/10">
            <p className="text-xs text-muted-foreground mb-1">Margin Available</p>
            <p className="text-xl font-bold text-green-500" data-testid="text-margin-available">
              ${marginData.marginAvailable.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Margin Call Warning */}
        {utilizationLevel !== 'safe' && (
          <div className={`mt-4 p-3 rounded-lg ${utilizationLevel === 'danger' ? 'bg-red-500/10 border border-red-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-4 h-4 mt-0.5 ${utilizationLevel === 'danger' ? 'text-red-500' : 'text-yellow-500'}`} />
              <div className="text-xs">
                <p className={`font-semibold ${utilizationLevel === 'danger' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {utilizationLevel === 'danger' ? 'Margin Call Risk' : 'High Utilization Warning'}
                </p>
                <p className="text-muted-foreground mt-1">
                  {utilizationLevel === 'danger' 
                    ? `Your margin usage is critically high. Maintain equity above $${marginData.maintenanceMargin.toLocaleString()} to avoid liquidation.`
                    : 'Consider reducing positions or adding funds to increase margin safety.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
