import { useQuery } from "@tanstack/react-query";
import { Skull, Heart, Sparkles, Zap, Shield, Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";

interface NarrativeMilestone {
  id: string;
  characterName: string;
  characterImageUrl: string | null;
  milestoneType: "death" | "resurrection" | "costume_change" | "identity_change" | "power_evolution";
  title: string;
  description: string;
  issueReference: string;
  year: string;
  impact: string;
  reversible: boolean;
  coverUrl?: string;
  writer?: string;
  artist?: string;
  coverArtist?: string;
}

const getMilestoneIcon = (type: string) => {
  switch (type) {
    case "death":
      return Skull;
    case "resurrection":
      return Heart;
    case "costume_change":
      return Sparkles;
    case "identity_change":
      return Shield;
    case "power_evolution":
      return Zap;
    default:
      return Clock;
  }
};

const getMilestoneColor = (type: string) => {
  switch (type) {
    case "death":
      return "text-red-400 bg-red-950/30 border-red-800/30";
    case "resurrection":
      return "text-green-400 bg-green-950/30 border-green-800/30";
    case "costume_change":
      return "text-purple-400 bg-purple-950/30 border-purple-800/30";
    case "identity_change":
      return "text-blue-400 bg-blue-950/30 border-blue-800/30";
    case "power_evolution":
      return "text-yellow-400 bg-yellow-950/30 border-yellow-800/30";
    default:
      return "text-indigo-400 bg-indigo-950/30 border-indigo-800/30";
  }
};

export default function NarrativeMilestonesWidget() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const { data: milestones, isLoading } = useQuery<NarrativeMilestone[]>({
    queryKey: ["/api/narrative/milestones"],
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
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-milestones-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Clock className="h-4 w-4" />
            Narrative Milestones
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-20 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!milestones || milestones.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-milestones-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Clock className="h-4 w-4" />
            Narrative Milestones
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Clock className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No milestones tracked
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
      data-testid="widget-narrative-milestones"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Clock className="h-4 w-4" />
          Narrative Milestones
        </div>
        <p className="text-xs text-indigo-400/70 font-light mt-1">
          Character Evolution Timeline
        </p>
      </div>

      {/* Parallax Timeline */}
      <div 
        ref={scrollRef}
        className="relative max-h-[600px] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {milestones.map((milestone, index) => {
            const Icon = getMilestoneIcon(milestone.milestoneType);
            const colorClass = getMilestoneColor(milestone.milestoneType);
            const parallaxOffset = (scrollY * 0.3) - (index * 20);

            return (
              <div 
                key={milestone.id}
                className="relative hover-elevate active-elevate-2 rounded-md overflow-hidden"
                data-testid={`milestone-${index}`}
              >
                {/* Parallax Background Cover */}
                {milestone.coverUrl && (
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      transform: `translateY(${parallaxOffset}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <img
                      src={milestone.coverUrl}
                      alt=""
                      className="w-full h-full object-contain scale-110 blur-sm"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative flex gap-4 p-4 bg-gradient-to-r from-[#1A1F2E]/95 to-[#252B3C]/90">
                  {/* Timeline connector */}
                  {index < milestones.length - 1 && (
                    <div className="absolute left-[52px] top-[120px] bottom-0 w-px bg-indigo-800/30" />
                  )}

                  {/* Cover Image */}
                  <div className="flex-shrink-0 relative z-10">
                    {milestone.coverUrl ? (
                      <img
                        src={milestone.coverUrl}
                        alt={milestone.title}
                        className="w-20 h-28 rounded-md object-contain border border-indigo-800/30 bg-black/50"
                        data-testid={`img-cover-${index}`}
                      />
                    ) : milestone.characterImageUrl ? (
                      <img
                        src={milestone.characterImageUrl}
                        alt={milestone.characterName}
                        className="w-20 h-28 rounded-md object-contain border border-indigo-800/30 bg-black/50"
                        data-testid={`img-character-${index}`}
                      />
                    ) : (
                      <div className="w-20 h-28 rounded-md bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-center">
                        <Icon className="h-10 w-10 text-indigo-500/30" />
                      </div>
                    )}
                  </div>

                  {/* Milestone Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 
                          className="text-base text-indigo-100 mb-1"
                          data-testid={`text-title-${index}`}
                        >
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-indigo-400 font-light">
                          {milestone.characterName}
                        </p>
                      </div>

                      {/* Milestone Type Badge */}
                      <Badge
                        variant="outline"
                        className={`${colorClass} flex items-center gap-1 text-xs`}
                        data-testid={`badge-type-${index}`}
                      >
                        <Icon className="h-3 w-3" />
                        {milestone.milestoneType.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Creator Info */}
                    {(milestone.writer || milestone.artist || milestone.coverArtist) && (
                      <div className="flex items-center gap-3 mb-3 text-xs text-indigo-400/70 font-light">
                        <User className="h-3 w-3" />
                        <div className="flex flex-wrap gap-2">
                          {milestone.writer && <span>Writer: {milestone.writer}</span>}
                          {milestone.artist && <span>Artist: {milestone.artist}</span>}
                          {milestone.coverArtist && <span>Cover: {milestone.coverArtist}</span>}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-indigo-300/80 leading-relaxed mb-3 font-light">
                      {milestone.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-indigo-400/70 font-light">
                      <span className="flex items-center gap-1">
                        <span className="font-mono">{milestone.issueReference}</span>
                      </span>
                      <span className="text-indigo-500/50">•</span>
                      <span>{milestone.year}</span>
                      {milestone.reversible && (
                        <>
                          <span className="text-indigo-500/50">•</span>
                          <span className="text-yellow-400/70">Reversible</span>
                        </>
                      )}
                    </div>

                    {/* Impact */}
                    {milestone.impact && (
                      <div className="mt-3 pt-3 border-t border-indigo-900/30">
                        <p className="text-xs text-indigo-300/60 italic font-light">
                          <span className="text-indigo-400">Impact:</span> {milestone.impact}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
