import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";

interface StoryArc {
  id: string;
  title: string;
  publisher: string;
  yearRange: string;
  description: string;
  keyIssues: string[];
  protagonists: string[];
  antagonists: string[];
  impact: string;
  coverImageUrl: string | null;
  totalIssues: number;
  crossoverEvents?: string[];
  writer?: string;
  artist?: string;
  coverArtist?: string;
}

export default function StoryArcExplorerWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const { data: storyArcs, isLoading } = useQuery<StoryArc[]>({
    queryKey: ["/api/story-arcs/explorer"],
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

  const currentArc = storyArcs && storyArcs.length > 0 ? storyArcs[currentIndex] : null;

  const handlePrevious = () => {
    if (!storyArcs) return;
    setCurrentIndex((prev) => (prev === 0 ? storyArcs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!storyArcs) return;
    setCurrentIndex((prev) => (prev === storyArcs.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-story-arc-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <BookOpen className="h-4 w-4" />
            Story Arc Explorer
          </div>
        </div>

        <div className="relative p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentArc) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-story-arc-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <BookOpen className="h-4 w-4" />
            Story Arc Explorer
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <BookOpen className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No story arcs available
          </p>
        </div>
      </div>
    );
  }

  const parallaxOffset = scrollY * 0.3;

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
      data-testid="widget-story-arc-explorer"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <BookOpen className="h-4 w-4" />
          Story Arc Explorer
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-400/60 font-light">
            {currentIndex + 1} / {storyArcs?.length || 0}
          </span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              className="h-7 w-7"
              data-testid="button-arc-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="h-7 w-7"
              data-testid="button-arc-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Parallax Story Arc Content */}
      <div 
        ref={scrollRef}
        className="relative max-h-[600px] overflow-y-auto"
      >
        {/* Parallax Background Cover */}
        {currentArc.coverImageUrl && (
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              transform: `translateY(${parallaxOffset}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img
              src={currentArc.coverImageUrl}
              alt=""
              className="w-full h-full object-contain scale-125 blur-sm"
            />
          </div>
        )}

        <div className="relative p-6 bg-gradient-to-b from-[#1A1F2E]/95 to-[#252B3C]/90">
          <div className="flex gap-6">
            {/* Cover Image */}
            {currentArc.coverImageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={currentArc.coverImageUrl}
                  alt={currentArc.title}
                  className="w-40 aspect-[2/3] object-contain rounded-md border border-indigo-800/30 bg-black/50"
                  data-testid="img-arc-cover"
                />
              </div>
            )}

            {/* Arc Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 
                    className="text-2xl text-indigo-100 mb-1"
                    data-testid="text-arc-title"
                  >
                    {currentArc.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-indigo-400/80 font-light">
                    <span>{currentArc.publisher}</span>
                    <span className="text-indigo-500/50">•</span>
                    <span>{currentArc.yearRange}</span>
                    <span className="text-indigo-500/50">•</span>
                    <span>{currentArc.totalIssues} issues</span>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              {(currentArc.writer || currentArc.artist || currentArc.coverArtist) && (
                <div className="flex items-center gap-3 mb-4 text-xs text-indigo-400/70 font-light">
                  <User className="h-3 w-3" />
                  <div className="flex flex-wrap gap-3">
                    {currentArc.writer && <span>Writer: {currentArc.writer}</span>}
                    {currentArc.artist && <span>Artist: {currentArc.artist}</span>}
                    {currentArc.coverArtist && <span>Cover: {currentArc.coverArtist}</span>}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-indigo-300/80 text-sm leading-relaxed mb-4 font-light">
                {currentArc.description}
              </p>

              {/* Key Participants */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {currentArc.protagonists && currentArc.protagonists.length > 0 && (
                  <div>
                    <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                      Heroes
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentArc.protagonists.map((hero, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-indigo-950/30 border-indigo-800/30 text-indigo-300"
                          data-testid={`badge-hero-${index}`}
                        >
                          {hero}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentArc.antagonists && currentArc.antagonists.length > 0 && (
                  <div>
                    <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                      Villains
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentArc.antagonists.map((villain, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-red-950/30 border-red-800/30 text-red-300"
                          data-testid={`badge-villain-${index}`}
                        >
                          {villain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Issues */}
              {currentArc.keyIssues && currentArc.keyIssues.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                    <Sparkles className="h-3 w-3" />
                    Key Issues
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentArc.keyIssues.map((issue, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-900/30 border border-indigo-800/30 rounded text-xs text-indigo-300 font-mono"
                        data-testid={`key-issue-${index}`}
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact */}
              <div className="pt-4 border-t border-indigo-900/30">
                <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                  Impact
                </div>
                <p className="text-indigo-300/70 text-sm font-light italic">
                  {currentArc.impact}
                </p>
              </div>

              {/* Crossover Events */}
              {currentArc.crossoverEvents && currentArc.crossoverEvents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-900/30">
                  <div className="text-xs text-indigo-400/70 font-light">
                    Related: {currentArc.crossoverEvents.join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
