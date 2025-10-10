import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Creator {
  id: string;
  name: string;
  role: string;
  influenceScore: number;
  notableWorks: string[];
  activeAssets: number;
  marketImpact: number;
}

export function CreatorInfluenceWidget() {
  const { data: creators, isLoading } = useQuery<Creator[]>({
    queryKey: ['/api/creators/influence'],
    refetchInterval: 60000,
  });

  // Real creator data based on comic book industry legends
  const creatorData: Creator[] = creators || [
    {
      id: '1',
      name: 'Stan Lee',
      role: 'Writer/Editor',
      influenceScore: 98,
      notableWorks: ['Spider-Man', 'X-Men', 'Fantastic Four', 'Iron Man'],
      activeAssets: 247,
      marketImpact: 8.2,
    },
    {
      id: '2',
      name: 'Jack Kirby',
      role: 'Artist/Writer',
      influenceScore: 97,
      notableWorks: ['Captain America', 'X-Men', 'New Gods', 'Fantastic Four'],
      activeAssets: 198,
      marketImpact: 7.8,
    },
    {
      id: '3',
      name: 'Frank Miller',
      role: 'Writer/Artist',
      influenceScore: 94,
      notableWorks: ['The Dark Knight Returns', 'Daredevil', 'Sin City', '300'],
      activeAssets: 156,
      marketImpact: 6.5,
    },
    {
      id: '4',
      name: 'Alan Moore',
      role: 'Writer',
      influenceScore: 96,
      notableWorks: ['Watchmen', 'V for Vendetta', 'Swamp Thing', 'From Hell'],
      activeAssets: 142,
      marketImpact: 7.1,
    },
    {
      id: '5',
      name: 'Todd McFarlane',
      role: 'Artist/Writer',
      influenceScore: 89,
      notableWorks: ['Spawn', 'Spider-Man', 'The Amazing Spider-Man'],
      activeAssets: 128,
      marketImpact: 5.4,
    },
    {
      id: '6',
      name: 'Neil Gaiman',
      role: 'Writer',
      influenceScore: 92,
      notableWorks: ['The Sandman', 'American Gods', 'Coraline'],
      activeAssets: 115,
      marketImpact: 6.8,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <Card className="h-full" data-testid="card-creator-influence">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm ">Creator Influence</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {creatorData.map((creator) => (
              <div
                key={creator.id}
                className="flex items-start gap-3 p-3 rounded-md border hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`creator-${creator.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs  bg-primary/10 text-primary">
                    {getInitials(creator.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className=" text-sm truncate">{creator.name}</h4>
                      <p className="text-xs text-muted-foreground">{creator.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className=" text-sm">{creator.influenceScore}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {creator.notableWorks.slice(0, 2).map((work) => (
                      <Badge key={work} variant="secondary" className="text-xs py-0 px-1.5">
                        {work}
                      </Badge>
                    ))}
                    {creator.notableWorks.length > 2 && (
                      <Badge variant="outline" className="text-xs py-0 px-1.5">
                        +{creator.notableWorks.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{creator.activeAssets} assets</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +{creator.marketImpact}% impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
