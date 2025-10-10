import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Zap, Shield, Brain, Target, Book, User, Swords, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  strength?: number;
  speed?: number;
  intelligence?: number;
  powerLevel?: number;
  keyIssues?: string[];
  storyArcs?: string[];
  creators?: Array<{ name: string; role: string }>;
  firstAppearance?: string;
  publisher?: string;
}

interface CharacterPortraitWidgetProps {
  className?: string;
  characterId?: string;
  showControls?: boolean;
}

export function CharacterPortraitWidget({ 
  className,
  characterId,
  showControls = true 
}: CharacterPortraitWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareWith, setCompareWith] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const { data: characters = [], isLoading } = useQuery<CharacterData[]>({
    queryKey: ['/api/characters/trending'],
    refetchInterval: 30000,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollY(scrollRef.current.scrollTop);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-character-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Shield className="h-4 w-4" />
            Character Dossier
          </div>
        </div>

        <div className="relative p-6">
          <div className="flex gap-6">
            <Skeleton className="w-48 h-64 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!characters.length) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-character-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Shield className="h-4 w-4" />
            Character Dossier
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Shield className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No characters available
          </p>
        </div>
      </div>
    );
  }

  const character = characters[currentIndex];
  const comparedCharacter = compareWith ? characters.find(c => c.id === compareWith) : null;
  const parallaxOffset = scrollY * 0.3;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
      data-testid="widget-character-portrait"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Shield className="h-4 w-4" />
          Character Dossier
        </div>
        
        <div className="flex items-center gap-2">
          {showControls && characters.length > 1 && (
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePrevious}
                className="h-7 w-7"
                data-testid="button-previous-character"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleNext}
                className="h-7 w-7"
                data-testid="button-next-character"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Parallax Content */}
      <div 
        ref={scrollRef}
        className="relative max-h-[700px] overflow-y-auto"
      >
        {/* Parallax Background */}
        {character.imageUrl && (
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              transform: `translateY(${parallaxOffset}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img
              src={character.imageUrl}
              alt=""
              className="w-full h-full object-contain scale-125 blur-sm"
            />
          </div>
        )}

        <div className="relative p-6 bg-gradient-to-b from-[#1A1F2E]/95 to-[#252B3C]/90">
          <div className="flex gap-6">
            {/* Character Portrait */}
            <div className="flex-shrink-0">
              {character.imageUrl || character.thumbnailUrl ? (
                <img
                  src={character.imageUrl || character.thumbnailUrl}
                  alt={character.name}
                  className="w-48 h-64 rounded-md object-contain border border-indigo-800/30 bg-black/50"
                  style={{ padding: '1px', boxSizing: 'border-box' }}
                  data-testid="img-character-portrait"
                />
              ) : (
                <div className="w-48 h-64 rounded-md bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-indigo-500/20" />
                </div>
              )}
            </div>

            {/* Character Info */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Name & Type */}
              <div>
                <h3 className="text-2xl text-indigo-100 mb-2" data-testid="text-character-name">
                  {character.name}
                </h3>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  {character.characterType && (
                    <Badge variant="outline" className="bg-indigo-950/30 border-indigo-800/30 text-indigo-300">
                      {character.characterType}
                    </Badge>
                  )}
                  {character.symbol && (
                    <Badge variant="outline" className="bg-purple-950/30 border-purple-800/30 text-purple-300 font-mono">
                      {character.symbol}
                    </Badge>
                  )}
                  {character.publisher && (
                    <Badge variant="outline" className="bg-blue-950/30 border-blue-800/30 text-blue-300">
                      {character.publisher}
                    </Badge>
                  )}
                </div>

                {/* Price */}
                {character.price && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-lg text-indigo-100">${character.price.toFixed(2)}</span>
                    {character.percentChange !== null && character.percentChange !== undefined && (
                      <span className={character.percentChange >= 0 ? 'text-green-400 flex items-center gap-1' : 'text-red-400 flex items-center gap-1'}>
                        {character.percentChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(character.percentChange).toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Power Stats */}
              {(character.strength || character.speed || character.intelligence) && (
                <div>
                  <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                    Power Stats
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {character.strength && (
                      <div className="bg-[#252B3C]/80 border border-indigo-800/30 rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-indigo-400/70">Strength</span>
                        </div>
                        <div className="text-lg text-indigo-100">{character.strength}/10</div>
                      </div>
                    )}
                    {character.speed && (
                      <div className="bg-[#252B3C]/80 border border-indigo-800/30 rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Target className="h-3 w-3 text-blue-400" />
                          <span className="text-xs text-indigo-400/70">Speed</span>
                        </div>
                        <div className="text-lg text-indigo-100">{character.speed}/10</div>
                      </div>
                    )}
                    {character.intelligence && (
                      <div className="bg-[#252B3C]/80 border border-indigo-800/30 rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Brain className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-indigo-400/70">Intelligence</span>
                        </div>
                        <div className="text-lg text-indigo-100">{character.intelligence}/10</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Powers & Abilities */}
              {character.powers && character.powers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                    <Swords className="h-3 w-3" />
                    Powers & Abilities
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {character.powers.map((power, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-purple-950/30 border-purple-800/30 text-purple-300"
                        data-testid={`badge-power-${idx}`}
                      >
                        {power}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams */}
              {character.teams && character.teams.length > 0 && (
                <div>
                  <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                    Team Affiliations
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {character.teams.map((team, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-blue-950/30 border-blue-800/30 text-blue-300"
                        data-testid={`badge-team-${idx}`}
                      >
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Issues */}
          {character.keyIssues && character.keyIssues.length > 0 && (
            <div className="mt-6 pt-4 border-t border-indigo-900/30">
              <div className="flex items-center gap-2 text-xs text-indigo-400 uppercase tracking-wide mb-3 font-light">
                <Book className="h-3 w-3" />
                Key Issues
              </div>
              <div className="flex flex-wrap gap-2">
                {character.keyIssues.map((issue, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-indigo-900/30 border border-indigo-800/30 rounded text-xs text-indigo-300 font-mono"
                    data-testid={`key-issue-${idx}`}
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Story Arcs */}
          {character.storyArcs && character.storyArcs.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-indigo-400 uppercase tracking-wide mb-3 font-light">
                Major Story Arcs
              </div>
              <div className="flex flex-wrap gap-1">
                {character.storyArcs.map((arc, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs bg-amber-950/30 border-amber-800/30 text-amber-300"
                    data-testid={`badge-arc-${idx}`}
                  >
                    {arc}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Creators */}
          {character.creators && character.creators.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs text-indigo-400 uppercase tracking-wide mb-3 font-light">
                <User className="h-3 w-3" />
                Created By
              </div>
              <div className="flex flex-wrap gap-2">
                {character.creators.map((creator, idx) => (
                  <span
                    key={idx}
                    className="text-sm text-indigo-300/80 font-light"
                    data-testid={`creator-${idx}`}
                  >
                    {creator.name} <span className="text-indigo-400/60">({creator.role})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* First Appearance */}
          {character.firstAppearance && (
            <div className="mt-4">
              <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                First Appearance
              </div>
              <p className="text-sm text-indigo-300/80 font-light font-mono">
                {character.firstAppearance}
              </p>
            </div>
          )}

          {/* Compare with Dropdown */}
          {characters.length > 1 && (
            <div className="mt-6 pt-4 border-t border-indigo-900/30">
              <div className="text-xs text-indigo-400 uppercase tracking-wide mb-3 font-light">
                Compare Stats With
              </div>
              <Select value={compareWith || ""} onValueChange={(val) => setCompareWith(val || null)}>
                <SelectTrigger className="w-full bg-[#252B3C] border-indigo-800/30">
                  <SelectValue placeholder="Select character to compare..." />
                </SelectTrigger>
                <SelectContent>
                  {characters.filter(c => c.id !== character.id).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Comparison Stats */}
              {comparedCharacter && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {character.strength && comparedCharacter.strength && (
                    <div className="bg-[#252B3C]/80 border border-indigo-800/30 rounded p-3">
                      <div className="text-xs text-indigo-400/70 mb-2">Strength</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-100">{character.strength}</span>
                        <span className="text-xs text-indigo-500">vs</span>
                        <span className={`text-sm ${comparedCharacter.strength > character.strength ? 'text-red-400' : 'text-green-400'}`}>
                          {comparedCharacter.strength}
                        </span>
                      </div>
                    </div>
                  )}
                  {character.speed && comparedCharacter.speed && (
                    <div className="bg-[#252B3C]/80 border border-indigo-800/30 rounded p-3">
                      <div className="text-xs text-indigo-400/70 mb-2">Speed</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-100">{character.speed}</span>
                        <span className="text-xs text-indigo-500">vs</span>
                        <span className={`text-sm ${comparedCharacter.speed > character.speed ? 'text-red-400' : 'text-green-400'}`}>
                          {comparedCharacter.speed}
                        </span>
                      </div>
                    </div>
                  )}
                  {character.intelligence && comparedCharacter.intelligence && (
                    <div className="bg-[#252B3C]/80 border border-indigo-800/30 rounded p-3">
                      <div className="text-xs text-indigo-400/70 mb-2">Intelligence</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-100">{character.intelligence}</span>
                        <span className="text-xs text-indigo-500">vs</span>
                        <span className={`text-sm ${comparedCharacter.intelligence > character.intelligence ? 'text-red-400' : 'text-green-400'}`}>
                          {comparedCharacter.intelligence}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
