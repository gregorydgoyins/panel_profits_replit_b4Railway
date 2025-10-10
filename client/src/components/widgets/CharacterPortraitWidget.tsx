import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Zap, Shield, Brain, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterData {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  characterType?: string;
  powers?: string[];
  abilities?: string[];
  weaknesses?: string[];
  teams?: string[];
  price?: number;
  percentChange?: number;
  // Enhanced stats if available
  strength?: number;
  speed?: number;
  intelligence?: number;
  powerLevel?: number;
}

interface CharacterPortraitWidgetProps {
  className?: string;
  characterId?: string; // Optional: show specific character
  showControls?: boolean;
}

export function CharacterPortraitWidget({ 
  className,
  characterId,
  showControls = true 
}: CharacterPortraitWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch trending characters
  const { data: characters = [], isLoading } = useQuery<CharacterData[]>({
    queryKey: ['/api/characters/trending'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <CardTitle className="text-lg">Character Portrait</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!characters.length) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <CardTitle className="text-lg">Character Portrait</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No characters available</p>
        </CardContent>
      </Card>
    );
  }

  const character = characters[currentIndex];
  const hasImage = character.imageUrl || character.thumbnailUrl;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const getCharacterTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'hero': return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
      case 'villain': return 'bg-red-500/20 border-red-500/50 text-red-200';
      case 'anti-hero': return 'bg-purple-500/20 border-purple-500/50 text-purple-200';
      default: return 'bg-muted/20 border-muted/50';
    }
  };

  return (
    <Card className={cn('hover-elevate relative overflow-hidden', className)} data-testid="widget-character-portrait">
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Character Portrait</CardTitle>
          {showControls && characters.length > 1 && (
            <div className="flex items-center gap-1" data-testid="container-navigation-controls">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePrevious}
                aria-label="Previous character"
                data-testid="button-previous-character"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleNext}
                aria-label="Next character"
                data-testid="button-next-character"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative p-0">
        {/* Character Portrait with Overlay */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-background/50 to-background">
          {/* Background Image */}
          {hasImage ? (
            <img
              src={character.imageUrl || character.thumbnailUrl}
              alt={character.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              data-testid="img-character-portrait"
            />
          ) : (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-muted"
              data-testid="container-character-placeholder"
            >
              <Shield className="h-24 w-24 text-muted-foreground/20" />
            </div>
          )}

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Texture overlays */}
          <div className="absolute inset-0 bg-halftone opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-newsprint opacity-5 mix-blend-overlay pointer-events-none" />

          {/* Stats Overlay - Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            {/* Character Name & Type */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-3xl  text-foreground" data-testid="text-character-name">
                  {character.name}
                </h3>
                {character.price && (
                  <div className="text-right">
                    <div className="text-2xl  text-foreground" data-testid="text-character-price">
                      ${character.price.toFixed(2)}
                    </div>
                    {character.percentChange !== null && character.percentChange !== undefined && (
                      <div className={cn(
                        "flex items-center gap-1 text-sm ",
                        character.percentChange >= 0 ? "text-green-400" : "text-red-400"
                      )} data-testid="text-price-change">
                        {character.percentChange >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(character.percentChange).toFixed(2)}%
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {character.characterType && (
                  <Badge 
                    className={cn("border", getCharacterTypeColor(character.characterType))}
                    data-testid={`badge-character-type-${character.characterType.toLowerCase()}`}
                  >
                    {character.characterType}
                  </Badge>
                )}
                {character.symbol && (
                  <Badge variant="outline" data-testid="badge-character-symbol">
                    {character.symbol}
                  </Badge>
                )}
              </div>
            </div>

            {/* Power Stats Grid - if available */}
            {(character.strength || character.speed || character.intelligence) && (
              <div className="grid grid-cols-3 gap-3" data-testid="container-power-stats">
                {character.strength && (
                  <div className="bg-background/80 backdrop-blur-sm rounded-md p-3 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">Strength</span>
                    </div>
                    <div className="text-2xl " data-testid="text-strength-stat">
                      {character.strength}/10
                    </div>
                  </div>
                )}
                {character.speed && (
                  <div className="bg-background/80 backdrop-blur-sm rounded-md p-3 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-muted-foreground">Speed</span>
                    </div>
                    <div className="text-2xl " data-testid="text-speed-stat">
                      {character.speed}/10
                    </div>
                  </div>
                )}
                {character.intelligence && (
                  <div className="bg-background/80 backdrop-blur-sm rounded-md p-3 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-muted-foreground">Intelligence</span>
                    </div>
                    <div className="text-2xl " data-testid="text-intelligence-stat">
                      {character.intelligence}/10
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Teams */}
            {character.teams && character.teams.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap" data-testid="container-character-teams">
                <span className="text-sm text-muted-foreground">Teams:</span>
                {character.teams.slice(0, 3).map((team, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-background/60 backdrop-blur-sm"
                    data-testid={`badge-team-${idx}`}
                  >
                    {team}
                  </Badge>
                ))}
                {character.teams.length > 3 && (
                  <Badge 
                    variant="secondary" 
                    className="bg-background/60 backdrop-blur-sm"
                    data-testid="badge-team-count"
                  >
                    +{character.teams.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Powers & Abilities */}
            {character.powers && character.powers.length > 0 && (
              <div className="space-y-1" data-testid="container-character-powers">
                <span className="text-sm text-muted-foreground">Powers:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {character.powers.slice(0, 4).map((power, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline"
                      className="bg-background/60 backdrop-blur-sm text-xs"
                      data-testid={`badge-power-${idx}`}
                    >
                      {power}
                    </Badge>
                  ))}
                  {character.powers.length > 4 && (
                    <Badge 
                      variant="outline"
                      className="bg-background/60 backdrop-blur-sm text-xs"
                      data-testid="badge-power-count"
                    >
                      +{character.powers.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Character Index Indicator */}
        {characters.length > 1 && (
          <div 
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm text-muted-foreground border border-border/50"
            data-testid="text-character-index"
          >
            {currentIndex + 1} / {characters.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
