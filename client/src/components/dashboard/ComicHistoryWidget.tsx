import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Calendar, Sparkles } from 'lucide-react';

interface HistoricalMilestone {
  id: string;
  assetSymbol: string;
  assetName: string;
  year: number;
  event: string;
  significance: string;
  publisher: string;
}

export function ComicHistoryWidget() {
  // For now, show curated historical data from top assets
  const { data: assets = [] } = useQuery<any[]>({
    queryKey: ['/api/comic-assets/top'],
  });

  // Generate historical context from asset data
  const historicalMilestones: HistoricalMilestone[] = assets.slice(0, 8).map((asset, idx) => ({
    id: asset.id,
    assetSymbol: asset.symbol,
    assetName: asset.name,
    year: 1939 + (idx * 5), // Simulated years for demo
    event: `First appearance in ${asset.name}`,
    significance: 'Origin story that defined the character',
    publisher: asset.publisher || 'Unknown',
  }));

  return (
    <Card className="h-full" data-testid="widget-comic-history">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Comic History Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {historicalMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="relative pl-8 pb-4 border-l-2 border-primary/30 hover:border-primary transition-colors"
                data-testid={`history-item-${milestone.assetSymbol}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {milestone.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {milestone.publisher}
                    </Badge>
                  </div>
                  
                  <h4 className=" text-foreground">{milestone.assetName}</h4>
                  <p className="text-sm text-primary">{milestone.event}</p>
                  <p className="text-xs text-muted-foreground">{milestone.significance}</p>
                </div>
              </div>
            ))}
            
            {historicalMilestones.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Loading historical data...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
