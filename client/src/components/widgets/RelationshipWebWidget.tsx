import { useQuery } from "@tanstack/react-query";
import { Users, Heart, Swords, Shield, Zap } from "lucide-react";
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
  }[];
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
      return "text-blue-400 bg-blue-950/30 border-blue-800/30";
    case "enemy":
      return "text-red-400 bg-red-950/30 border-red-800/30";
    case "teammate":
      return "text-green-400 bg-green-950/30 border-green-800/30";
    case "mentor":
    case "mentee":
      return "text-purple-400 bg-purple-950/30 border-purple-800/30";
    case "love_interest":
      return "text-pink-400 bg-pink-950/30 border-pink-800/30";
    default:
      return "text-indigo-400 bg-indigo-950/30 border-indigo-800/30";
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
            <Users className="h-4 w-4" />
            Relationship Web
          </div>
        </div>

        <div className="relative p-6 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <div className="flex gap-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-16 w-20 rounded-md" />
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
            <Users className="h-4 w-4" />
            Relationship Web
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-indigo-500/30 mb-4" />
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
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Users className="h-4 w-4" />
          Relationship Web
        </div>
        <p className="text-xs text-indigo-400/70 font-light mt-1">
          Allies, Enemies, Teams, Mentors
        </p>
      </div>

      {/* Relationship Networks */}
      <div className="relative p-6 space-y-8 max-h-[600px] overflow-y-auto">
        {relationshipData.map((node, nodeIndex) => (
          <div key={node.id} data-testid={`character-${node.characterId}`}>
            {/* Central Character */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                {node.imageUrl ? (
                  <img
                    src={node.imageUrl}
                    alt={node.characterName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                    data-testid={`img-center-${nodeIndex}`}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-950/50 border-2 border-indigo-500/50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-500/50" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-[#1A1F2E]" />
              </div>
              <div>
                <h3 className="text-lg  text-indigo-100" data-testid={`text-name-${nodeIndex}`}>
                  {node.characterName}
                </h3>
                <p className="text-xs text-indigo-400/70 font-light">
                  {node.relationships.length} connection{node.relationships.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pl-15">
              {node.relationships.map((rel, relIndex) => {
                const Icon = getRelationshipIcon(rel.relationType);
                const colorClass = getRelationshipColor(rel.relationType);

                return (
                  <div
                    key={`${node.id}-${rel.targetId}`}
                    className="relative hover-elevate active-elevate-2 rounded-md p-3 bg-[#252B3C]/50 border border-indigo-900/20"
                    data-testid={`relationship-${nodeIndex}-${relIndex}`}
                  >
                    {/* Relationship Type Badge */}
                    <Badge
                      variant="outline"
                      className={`${colorClass} text-xs font-light mb-2 w-full justify-center`}
                      data-testid={`badge-type-${nodeIndex}-${relIndex}`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {rel.relationType.replace('_', ' ')}
                    </Badge>

                    {/* Target Character */}
                    <div className="flex flex-col items-center gap-2">
                      {rel.targetImageUrl ? (
                        <img
                          src={rel.targetImageUrl}
                          alt={rel.targetName}
                          className="w-16 h-16 rounded-full object-cover border border-indigo-800/30"
                          data-testid={`img-target-${nodeIndex}-${relIndex}`}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-center">
                          <Users className="h-8 w-8 text-indigo-500/30" />
                        </div>
                      )}

                      <div className="text-center">
                        <p className="text-sm  text-indigo-100 line-clamp-1">
                          {rel.targetName}
                        </p>
                        <p className="text-xs text-indigo-400/70 italic font-light line-clamp-2 mt-1">
                          {rel.description}
                        </p>
                      </div>

                      {/* Strength Indicator */}
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < Math.ceil(rel.strength / 2)
                                ? 'bg-indigo-400'
                                : 'bg-indigo-900/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
