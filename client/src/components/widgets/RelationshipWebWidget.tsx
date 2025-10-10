import { useQuery } from "@tanstack/react-query";
import { Users, Heart, Swords, Shield, Zap, Network, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface RelationshipNode {
  id: string;
  characterName: string;
  characterId: string;
  imageUrl: string | null;
  relationships: {
    targetName: string;
    targetId: string;
    targetImageUrl: string | null;
    relationType: "ally" | "enemy" | "teammate" | "mentor" | "mentee" | "love_interest";
    description: string;
    strength: number; // 1-10
    firstMet?: string; // issue reference
    keyMoments?: string[]; // significant story moments
  }[];
  totalConnections?: number;
  networkInfluence?: number; // 1-100
}

const getRelationshipIcon = (type: string) => {
  switch (type) {
    case "ally":
      return Shield;
    case "enemy":
      return Swords;
    case "teammate":
      return Users;
    case "mentor":
    case "mentee":
      return Zap;
    case "love_interest":
      return Heart;
    default:
      return Users;
  }
};

const getRelationshipColor = (type: string) => {
  switch (type) {
    case "ally":
      return { text: "text-blue-400", bg: "bg-blue-950/30", border: "border-blue-500/60", glow: "shadow-blue-500/20" };
    case "enemy":
      return { text: "text-red-400", bg: "bg-red-950/30", border: "border-red-500/60", glow: "shadow-red-500/20" };
    case "teammate":
      return { text: "text-green-400", bg: "bg-green-950/30", border: "border-green-500/60", glow: "shadow-green-500/20" };
    case "mentor":
    case "mentee":
      return { text: "text-purple-400", bg: "bg-purple-950/30", border: "border-purple-500/60", glow: "shadow-purple-500/20" };
    case "love_interest":
      return { text: "text-pink-400", bg: "bg-pink-950/30", border: "border-pink-500/60", glow: "shadow-pink-500/20" };
    default:
      return { text: "text-indigo-400", bg: "bg-indigo-950/30", border: "border-indigo-500/60", glow: "shadow-indigo-500/20" };
  }
};

export default function RelationshipWebWidget() {
  const { data: relationshipData, isLoading } = useQuery<RelationshipNode[]>({
    queryKey: ["/api/relationships/web"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-relationships-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Network className="h-4 w-4" />
            Relationship Network
          </div>
        </div>

        <div className="relative p-6 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pl-24">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-32 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relationshipData || relationshipData.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-relationships-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Network className="h-4 w-4" />
            Relationship Network
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Network className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No relationships tracked
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
      data-testid="widget-relationship-web"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
              <Network className="h-4 w-4" />
              Relationship Network
            </div>
            <p className="text-xs text-indigo-400/70 font-light mt-1">
              Allies • Enemies • Teams • Mentors • Relationships
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400/50">
            <TrendingUp className="h-3 w-3" />
            <span>Network Intelligence</span>
          </div>
        </div>
      </div>

      {/* Relationship Networks */}
      <div className="relative p-6 space-y-10 max-h-[700px] overflow-y-auto">
        {relationshipData.map((node, nodeIndex) => (
          <div key={node.id} className="relative" data-testid={`character-${node.characterId}`}>
            {/* Central Character Hub */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                {node.imageUrl ? (
                  <div className="relative">
                    <img
                      src={node.imageUrl}
                      alt={node.characterName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500/50 shadow-lg shadow-indigo-500/30"
                      style={{ padding: '2px', boxSizing: 'border-box' }}
                      data-testid={`img-center-${nodeIndex}`}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-2 border-2 border-[#1A1F2E]">
                      <Network className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-950/50 border-4 border-indigo-500/50 flex items-center justify-center shadow-lg">
                    <Users className="h-8 w-8 text-indigo-500/50" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-light text-indigo-100 tracking-wide mb-1" data-testid={`text-name-${nodeIndex}`}>
                  {node.characterName}
                </h3>
                <div className="flex items-center gap-4 text-xs text-indigo-400/70">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{node.relationships.length} direct connection{node.relationships.length !== 1 ? 's' : ''}</span>
                  </div>
                  {node.totalConnections && (
                    <>
                      <span className="text-indigo-500/30">•</span>
                      <div className="flex items-center gap-1">
                        <Network className="h-3 w-3" />
                        <span>{node.totalConnections} network nodes</span>
                      </div>
                    </>
                  )}
                  {node.networkInfluence && (
                    <>
                      <span className="text-indigo-500/30">•</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{node.networkInfluence}% influence</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Connections Grid - RICH DATA DISPLAY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-0 md:pl-24">
              {node.relationships.map((rel, relIndex) => {
                const Icon = getRelationshipIcon(rel.relationType);
                const colors = getRelationshipColor(rel.relationType);
                const strengthPercent = (rel.strength / 10) * 100;

                return (
                  <div
                    key={`${node.id}-${rel.targetId}`}
                    className={`relative hover-elevate active-elevate-2 rounded-lg p-4 bg-[#252B3C]/80 border ${colors.border} shadow-lg ${colors.glow} transition-all duration-300`}
                    data-testid={`relationship-${nodeIndex}-${relIndex}`}
                  >
                    {/* Connection Line Indicator */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
                      <div className={`h-px w-8 ${colors.bg} ${colors.border} border-t`} />
                      <Icon className={`h-4 w-4 ${colors.text}`} />
                    </div>

                    {/* Relationship Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className={`${colors.text} ${colors.bg} ${colors.border} text-xs font-light uppercase tracking-wider`}
                        data-testid={`badge-type-${nodeIndex}-${relIndex}`}
                      >
                        <Icon className="h-3 w-3 mr-1.5" />
                        {rel.relationType.replace('_', ' ')}
                      </Badge>
                      
                      {/* Strength Meter */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-indigo-950/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors.bg} ${colors.border} border-r transition-all duration-500`}
                            style={{ width: `${strengthPercent}%` }}
                          />
                        </div>
                        <span className={`text-xs ${colors.text} font-light`}>{rel.strength}/10</span>
                      </div>
                    </div>

                    {/* Target Character - BIGGER & MORE DATA */}
                    <div className="flex items-start gap-3 mb-3">
                      {rel.targetImageUrl ? (
                        <img
                          src={rel.targetImageUrl}
                          alt={rel.targetName}
                          className={`w-16 h-16 rounded-lg object-cover border-2 ${colors.border} flex-shrink-0`}
                          style={{ padding: '1px', boxSizing: 'border-box' }}
                          data-testid={`img-target-${nodeIndex}-${relIndex}`}
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                          <Users className={`h-8 w-8 ${colors.text}/30`} />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-light ${colors.text} truncate`}>
                          {rel.targetName}
                        </p>
                        <p className="text-xs text-indigo-400/60 italic font-light line-clamp-2 mt-0.5">
                          "{rel.description}"
                        </p>
                      </div>
                    </div>

                    {/* Rich Metadata - SHOW MORE DATA! */}
                    {(rel.firstMet || rel.keyMoments) && (
                      <div className="pt-3 border-t border-indigo-900/20 space-y-2">
                        {rel.firstMet && (
                          <div className="text-xs">
                            <span className="text-indigo-400/50">First Met: </span>
                            <span className={`${colors.text} font-light`}>{rel.firstMet}</span>
                          </div>
                        )}
                        {rel.keyMoments && rel.keyMoments.length > 0 && (
                          <div className="text-xs">
                            <span className="text-indigo-400/50">Key Moments: </span>
                            <span className="text-indigo-300/80 font-light">
                              {rel.keyMoments.slice(0, 2).join(', ')}
                              {rel.keyMoments.length > 2 && '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            {nodeIndex < relationshipData.length - 1 && (
              <div className="mt-10 border-t border-indigo-900/20" />
            )}
          </div>
        ))}
      </div>

      {/* Network Stats Footer */}
      <div className="relative px-6 py-4 border-t border-indigo-900/30 bg-[#252B3C]/30">
        <div className="flex items-center justify-center gap-6 text-xs text-indigo-400/50 font-light">
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 text-blue-400" />
            <span>Allies</span>
          </div>
          <div className="flex items-center gap-2">
            <Swords className="h-3 w-3 text-red-400" />
            <span>Enemies</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-green-400" />
            <span>Teams</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-purple-400" />
            <span>Mentors</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-3 w-3 text-pink-400" />
            <span>Relationships</span>
          </div>
        </div>
      </div>
    </div>
  );
}
