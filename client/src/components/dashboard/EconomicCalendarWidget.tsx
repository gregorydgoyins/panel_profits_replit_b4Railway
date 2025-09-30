import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle } from 'lucide-react';

interface EconomicEvent {
  time: string;
  event: string;
  currency: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export function EconomicCalendarWidget() {
  const events: EconomicEvent[] = [
    {
      time: '08:30 AM',
      event: 'Non-Farm Payrolls',
      currency: 'USD',
      impact: 'high',
      actual: '256K',
      forecast: '180K',
      previous: '150K'
    },
    {
      time: '10:00 AM',
      event: 'Fed Interest Rate Decision',
      currency: 'USD',
      impact: 'high',
      forecast: '5.50%',
      previous: '5.25%'
    },
    {
      time: '11:30 AM',
      event: 'Comic Sales Report',
      currency: 'USD',
      impact: 'medium',
      actual: '+12.3%',
      forecast: '+8.0%',
      previous: '+6.5%'
    },
    {
      time: '02:00 PM',
      event: 'Publisher Earnings',
      currency: 'USD',
      impact: 'high',
      forecast: '$2.45 EPS',
      previous: '$2.12 EPS'
    },
    {
      time: '03:30 PM',
      event: 'Market Sentiment Index',
      currency: 'USD',
      impact: 'low',
      previous: '62.4'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-muted';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return 'HIGH';
      case 'medium': return 'MED';
      case 'low': return 'LOW';
      default: return '';
    }
  };

  return (
    <Card data-testid="widget-economic-calendar">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Economic Calendar</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Today's market-moving events
            </p>
          </div>
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            5 Events
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
              data-testid={`event-${idx}`}
            >
              <div className="flex-shrink-0 w-16 text-sm font-mono text-muted-foreground">
                {event.time}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm truncate">{event.event}</p>
                  <Badge className={`text-xs px-2 py-0 ${getImpactColor(event.impact)}`}>
                    {getImpactLabel(event.impact)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  {event.actual && (
                    <div>
                      <span className="opacity-60">Actual:</span>{' '}
                      <span className="font-semibold text-green-500">{event.actual}</span>
                    </div>
                  )}
                  {event.forecast && (
                    <div>
                      <span className="opacity-60">Forecast:</span>{' '}
                      <span className="font-semibold">{event.forecast}</span>
                    </div>
                  )}
                  {event.previous && (
                    <div>
                      <span className="opacity-60">Previous:</span>{' '}
                      <span>{event.previous}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {event.currency}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-blue-500">High Impact Alert</p>
              <p className="text-muted-foreground mt-1">
                2 high-impact events scheduled today. Expect increased volatility during Fed decision and NFP release.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
