import { useQuery } from "@tanstack/react-query";
import { Star, TrendingUp, DollarSign, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface CharacterAppearance {
  id: string;
  characterName: string;
  characterId: string;
  appearances: {
    appearanceNumber: number;
    type: "first" | "second" | "key" | "regular";
    comicTitle: string;
    issueNumber: string;
    publisher: string;
    year: string;
    coverUrl: string | null;
    significance: string;
    estimatedValue: string;
    investmentPotential: "high" | "medium" | "low";
  }[];
}

const getAppearanceColor = (type: string) => {
  switch (type) {
    case "first":
      return "text-yellow-400 bg-yellow-950/30 border-yellow-800/30";
    case "second":
      return "text-orange-400 bg-orange-950/30 border-orange-800/30";
    case "key":
      return "text-purple-400 bg-purple-950/30 border-purple-800/30";
    default:
      return "text-indigo-400 bg-indigo-950/30 border-indigo-800/30";
  }
};

const getInvestmentIcon = (potential: string) => {
  switch (potential) {
    case "high":
      return <TrendingUp className="h-3 w-3 text-green-400" />;
    case "medium":
      return <DollarSign className="h-3 w-3 text-yellow-400" />;
    default:
      return <BookOpen className="h-3 w-3 text-indigo-400" />;
  }
};

export default function AppearanceTrackerWidget() {
  const { data: appearanceData, isLoading } = useQuery<CharacterAppearance[]>({
    queryKey: ["/api/appearances/tracker"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-appearances-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Star className="h-4 w-4" />
            Appearance Tracker
          </div>
        </div>

        <div className="relative p-6 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <div className="flex gap-3 overflow-x-hidden">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-40 w-28 flex-shrink-0 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!appearanceData || appearanceData.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-appearances-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Star className="h-4 w-4" />
            Appearance Tracker
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Star className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No appearances tracked
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
      data-testid="widget-appearance-tracker"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Star className="h-4 w-4" />
          Appearance Tracker
        </div>
        <p className="text-xs text-indigo-400/70 font-light mt-1">
          1st, 2nd, Key Appearances Mapped
        </p>
      </div>

      {/* Characters and their appearances */}
      <div className="relative p-6 space-y-8 max-h-[500px] overflow-y-auto">
        {appearanceData.map((character) => (
          <div key={character.id} data-testid={`character-${character.characterId}`}>
            {/* Character Name */}
            <h3 className="text-lg  text-indigo-100 mb-4 flex items-center gap-2">
              {character.characterName}
              <Badge variant="outline" className="text-xs text-indigo-400/70 border-indigo-800/30">
                {character.appearances.length} appearances
              </Badge>
            </h3>

            {/* Horizontal scroll of appearances */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
              {character.appearances.map((appearance, index) => (
                <div
                  key={`${character.id}-${index}`}
                  className="flex-shrink-0 w-56 hover-elevate active-elevate-2 rounded-md p-3 bg-[#252B3C]/50 border border-indigo-900/20"
                  data-testid={`appearance-${character.characterId}-${index}`}
                >
                  {/* Appearance Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={`${getAppearanceColor(appearance.type)} text-xs font-light`}
                      data-testid={`badge-type-${index}`}
                    >
                      {appearance.type === "first" && "1st Appearance"}
                      {appearance.type === "second" && "2nd Appearance"}
                      {appearance.type === "key" && `Key #${appearance.appearanceNumber}`}
                      {appearance.type === "regular" && `#${appearance.appearanceNumber}`}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      {getInvestmentIcon(appearance.investmentPotential)}
                    </div>
                  </div>

                  {/* Comic Cover */}
                  {appearance.coverUrl ? (
                    <img
                      src={appearance.coverUrl}
                      alt={`${appearance.comicTitle} ${appearance.issueNumber}`}
                      className="w-full h-32 object-cover rounded border border-indigo-800/30 mb-3"
                      data-testid={`img-cover-${index}`}
                    />
                  ) : (
                    <div className="w-full h-32 bg-indigo-950/30 rounded border border-indigo-800/30 mb-3 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-indigo-500/30" />
                    </div>
                  )}

                  {/* Comic Info */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm  text-indigo-100 line-clamp-1" data-testid={`text-title-${index}`}>
                        {appearance.comicTitle}
                      </p>
                      <p className="text-xs text-indigo-400/70 font-light">
                        {appearance.issueNumber} • {appearance.year}
                      </p>
                    </div>

                    {/* Significance */}
                    <p className="text-xs text-indigo-300/70 italic font-light line-clamp-2">
                      {appearance.significance}
                    </p>

                    {/* Value */}
                    <div className="pt-2 border-t border-indigo-900/20">
                      <p className="text-xs text-indigo-400/80 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-mono">{appearance.estimatedValue}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
