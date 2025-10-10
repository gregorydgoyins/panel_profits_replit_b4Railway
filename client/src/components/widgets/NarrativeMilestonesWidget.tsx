import { useQuery } from "@tanstack/react-query";
import { Skull, Heart, Sparkles, Zap, Shield, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
      return { text: "text-red-400", bg: "bg-red-950/30", border: "border-red-500/60", glow: "shadow-red-500/20" };
    case "resurrection":
      return { text: "text-green-400", bg: "bg-green-950/30", border: "border-green-500/60", glow: "shadow-green-500/20" };
    case "costume_change":
      return { text: "text-purple-400", bg: "bg-purple-950/30", border: "border-purple-500/60", glow: "shadow-purple-500/20" };
    case "identity_change":
      return { text: "text-blue-400", bg: "bg-blue-950/30", border: "border-blue-500/60", glow: "shadow-blue-500/20" };
    case "power_evolution":
      return { text: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-500/60", glow: "shadow-yellow-500/20" };
    default:
      return { text: "text-indigo-400", bg: "bg-indigo-950/30", border: "border-indigo-500/60", glow: "shadow-indigo-500/20" };
  }
};

export default function NarrativeMilestonesWidget() {
  const { data: milestones, isLoading } = useQuery<NarrativeMilestone[]>({
    queryKey: ["/api/narrative/milestones"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-milestones-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Clock className="h-4 w-4" />
            Narrative Timeline
          </div>
        </div>

        <div className="relative p-4">
          <div className="flex gap-4 overflow-x-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-80 flex-shrink-0 rounded-md" />
            ))}
          </div>
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
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Clock className="h-4 w-4" />
            Narrative Timeline
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Clock className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No narrative milestones tracked
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
              <Clock className="h-4 w-4" />
              Narrative Timeline
            </div>
            <p className="text-xs text-indigo-400/70 font-light mt-1">
              Deaths • Resurrections • Transformations • Legacy Moments
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400/50">
            <ArrowRight className="h-3 w-3" />
            <span>Chronological Flow</span>
          </div>
        </div>
      </div>

      {/* 1x100 Parallax Timeline - FULL WIDTH SCROLL */}
      <div className="relative p-4">
        {/* Timeline base line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-500/20 pointer-events-none" style={{ transform: 'translateY(-50%)' }} />
        
        <div className="flex gap-6 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide relative">
          {milestones.map((milestone, index) => {
            const Icon = getMilestoneIcon(milestone.milestoneType);
            const colors = getMilestoneColor(milestone.milestoneType);

            return (
              <div
                key={milestone.id}
                className="flex flex-col items-center flex-shrink-0 relative"
                data-testid={`milestone-${index}`}
              >
                {/* Timeline connector dot */}
                <div className={`absolute top-[112px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${colors.bg} ${colors.border} border-2 z-10`} />

                {/* Milestone Card */}
                <div
                  className={`w-72 hover-elevate active-elevate-2 rounded-lg p-4 bg-[#252B3C]/90 border ${colors.border} shadow-lg ${colors.glow} transition-all duration-300 mb-6`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    {milestone.characterImageUrl ? (
                      <img
                        src={milestone.characterImageUrl}
                        alt={milestone.characterName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                        style={{ padding: '1px', boxSizing: 'border-box' }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-950/50 border-2 border-indigo-500/50 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-indigo-500/50" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-light text-indigo-100 truncate">
                        {milestone.characterName}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${colors.text} ${colors.bg} ${colors.border} text-xs font-light mt-1`}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {milestone.milestoneType.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Cover Image if available */}
                  {milestone.coverUrl && (
                    <div className="mb-3">
                      <img
                        src={milestone.coverUrl}
                        alt={milestone.title}
                        className="w-full h-32 object-cover rounded-md border border-indigo-800/30"
                        style={{ padding: '1px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className={`text-base font-light ${colors.text}`}>
                      {milestone.title}
                    </h3>
                    
                    <p className="text-xs text-indigo-300/70 italic line-clamp-2">
                      "{milestone.description}"
                    </p>

                    {/* Metadata */}
                    <div className="pt-2 border-t border-indigo-900/20 space-y-1 text-xs text-indigo-400/60">
                      <div className="flex items-center justify-between">
                        <span>{milestone.issueReference}</span>
                        <span>{milestone.year}</span>
                      </div>
                      
                      {milestone.reversible !== undefined && (
                        <div className={`text-xs ${milestone.reversible ? 'text-orange-400/70' : 'text-green-400/70'}`}>
                          {milestone.reversible ? "⟳ Reversible" : "⚡ Permanent"}
                        </div>
                      )}
                    </div>

                    {/* Impact */}
                    <div className="pt-2 border-t border-indigo-900/10">
                      <p className="text-xs text-indigo-300/60 font-light">
                        <span className="text-indigo-400/50">Impact: </span>
                        {milestone.impact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Year marker below timeline */}
                <div className="text-xs font-mono text-indigo-400/50 mt-2">
                  {milestone.year}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 right-6 text-xs text-indigo-400/40 font-light flex items-center gap-1">
          <span>Scroll Timeline</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
