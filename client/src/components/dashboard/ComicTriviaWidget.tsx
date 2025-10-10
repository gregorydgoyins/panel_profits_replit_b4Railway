import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Book, User, Calendar } from 'lucide-react';

interface TriviaItem {
  id: string;
  category: 'character' | 'creator' | 'storyline' | 'publishing';
  title: string;
  fact: string;
  assetSymbol?: string;
  icon: string;
}

export function ComicTriviaWidget() {
  const { data: assets = [] } = useQuery<any[]>({
    queryKey: ['/api/comic-assets/top'],
  });

  // Generate trivia from top assets
  const triviaItems: TriviaItem[] = assets.slice(0, 6).flatMap((asset, idx) => [
    {
      id: `${asset.id}-char`,
      category: 'character' as const,
      title: `${asset.name} Origins`,
      fact: `First appeared in ${1939 + (idx * 5)}, revolutionizing the comic industry with groundbreaking storytelling.`,
      assetSymbol: asset.symbol,
      icon: '🦸',
    },
    {
      id: `${asset.id}-creator`,
      category: 'creator' as const,
      title: 'Creator Insight',
      fact: `Created by legendary writers and artists whose vision shaped modern comic narratives.`,
      assetSymbol: asset.symbol,
      icon: '✍️',
    },
  ]).slice(0, 8);

  return (
    <Card className="h-full" data-testid="widget-comic-trivia">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Comic Trivia & Facts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {triviaItems.map((trivia) => (
              <div
                key={trivia.id}
                className="p-4 bg-card/50 border border-border rounded-lg hover-elevate transition-all"
                data-testid={`trivia-item-${trivia.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">{trivia.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={
                        trivia.category === 'character' ? 'default' :
                        trivia.category === 'creator' ? 'secondary' :
                        trivia.category === 'storyline' ? 'outline' :
                        'secondary'
                      } className="text-xs">
                        {trivia.category}
                      </Badge>
                      {trivia.assetSymbol && (
                        <Badge variant="outline" className="text-xs">
                          {trivia.assetSymbol}
                        </Badge>
                      )}
                    </div>
                    <h4 className=" text-foreground">{trivia.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{trivia.fact}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {triviaItems.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Loading trivia...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
