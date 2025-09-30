import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Volume2 } from 'lucide-react';

interface UnusualActivity {
  symbol: string;
  type: 'options' | 'volume' | 'price';
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  details: string;
}

export function UnusualActivityWidget() {
  const activities: UnusualActivity[] = [
    {
      symbol: 'SPIDEY',
      type: 'options',
      description: 'Massive call buying detected',
      severity: 'high',
      timestamp: '2m ago',
      details: '5,000 calls @ $120 strike'
    },
    {
      symbol: 'BATMAN',
      type: 'volume',
      description: '10x average volume spike',
      severity: 'high',
      timestamp: '5m ago',
      details: '2.5M shares traded'
    },
    {
      symbol: 'IRONM',
      type: 'price',
      description: 'Unusual price movement',
      severity: 'medium',
      timestamp: '8m ago',
      details: '+12% in 5 minutes'
    },
    {
      symbol: 'WWOND',
      type: 'options',
      description: 'Put/Call ratio spike',
      severity: 'medium',
      timestamp: '12m ago',
      details: 'P/C ratio: 3.2'
    },
    {
      symbol: 'HULK',
      type: 'volume',
      description: 'Block trade detected',
      severity: 'high',
      timestamp: '15m ago',
      details: '500K shares @ $95.50'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'options': return <TrendingUp className="w-4 h-4" />;
      case 'volume': return <Volume2 className="w-4 h-4" />;
      case 'price': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card data-testid="widget-unusual-activity">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Unusual Activity Scanner</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time anomaly detection
            </p>
          </div>
          <Badge variant="outline" className="text-red-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {activities.filter(a => a.severity === 'high').length} Alerts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${getSeverityColor(activity.severity)} hover-elevate`}
              data-testid={`activity-${activity.symbol}-${idx}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {activity.symbol}
                    </Badge>
                    <Badge className="text-xs px-2 py-0 capitalize">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  
                  <p className="font-semibold text-sm mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-red-500">High Alert Activity</p>
              <p className="text-muted-foreground mt-1">
                {activities.filter(a => a.severity === 'high').length} high-severity anomalies detected in the last 15 minutes. 
                Institutional activity suspected.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
