import { useQuery } from "@tanstack/react-query";
import { Star, TrendingUp, DollarSign, BookOpen, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface AppearanceCard {
  id: string;
  characterName: string;
  characterImageUrl: string | null;
  appearanceType: "first" | "second" | "key" | "cameo";
  comicTitle: string;
  issueNumber: string;
  publisher: string;
  year: string;
  coverUrl: string | null;
  significance: string;
  estimatedValue: string;
  priceChange24h: number;
  investmentPotential: "high" | "medium" | "low";
}

const getAppearanceColor = (type: string) => {
  switch (type) {
    case "first":
      return { text: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-500/60", glow: "shadow-yellow-500/20" };
    case "second":
      return { text: "text-orange-400", bg: "bg-orange-950/30", border: "border-orange-500/60", glow: "shadow-orange-500/20" };
    case "key":
      return { text: "text-purple-400", bg: "bg-purple-950/30", border: "border-purple-500/60", glow: "shadow-purple-500/20" };
    default:
      return { text: "text-cyan-400", bg: "bg-cyan-950/30", border: "border-cyan-500/60", glow: "shadow-cyan-500/20" };
  }
};

export default function AppearanceTrackerWidget() {
  const { data: appearances, isLoading } = useQuery<AppearanceCard[]>({
    queryKey: ["/api/appearances/tracker"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-appearances-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Star className="h-4 w-4" />
            Appearance Tracker
          </div>
        </div>

        <div className="relative p-4">
          <div className="flex gap-4 overflow-x-hidden">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-72 flex-shrink-0 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!appearances || appearances.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-appearances-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        
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
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
      data-testid="widget-appearance-tracker"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
              <Star className="h-4 w-4" />
              Appearance Tracker
            </div>
            <p className="text-xs text-indigo-400/70 font-light mt-1">
              1st • 2nd • Key • Investment Potential
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400/50">
            <Sparkles className="h-3 w-3" />
            <span>Parallax View</span>
          </div>
        </div>
      </div>

      {/* 4x1 Parallax Scroll - BIG CARDS */}
      <div className="relative p-4">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {appearances.map((appearance, index) => {
            const colors = getAppearanceColor(appearance.appearanceType);
            const isPositive = appearance.priceChange24h >= 0;

            return (
              <div
                key={appearance.id}
                className={`flex-shrink-0 w-72 hover-elevate active-elevate-2 rounded-lg p-4 bg-[#252B3C]/80 border ${colors.border} shadow-lg ${colors.glow} transition-all duration-300`}
                data-testid={`appearance-card-${index}`}
              >
                {/* Header with Type Badge */}
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="outline"
                    className={`${colors.text} ${colors.bg} ${colors.border} text-xs font-light uppercase tracking-wider`}
                  >
                    {appearance.appearanceType === "first" && "1st Appearance"}
                    {appearance.appearanceType === "second" && "2nd Appearance"}
                    {appearance.appearanceType === "key" && "Key Appearance"}
                    {appearance.appearanceType === "cameo" && "Cameo"}
                  </Badge>
                  
                  {/* Investment Indicator */}
                  <div className={`px-2 py-1 rounded-md ${
                    appearance.investmentPotential === 'high' ? 'bg-green-950/30 border border-green-500/40' :
                    appearance.investmentPotential === 'medium' ? 'bg-yellow-950/30 border border-yellow-500/40' :
                    'bg-indigo-950/30 border border-indigo-500/40'
                  }`}>
                    {appearance.investmentPotential === 'high' && <TrendingUp className="h-3 w-3 text-green-400" />}
                    {appearance.investmentPotential === 'medium' && <DollarSign className="h-3 w-3 text-yellow-400" />}
                    {appearance.investmentPotential === 'low' && <BookOpen className="h-3 w-3 text-indigo-400" />}
                  </div>
                </div>

                {/* Character Info */}
                <div className="flex items-center gap-3 mb-3">
                  {appearance.characterImageUrl ? (
                    <img
                      src={appearance.characterImageUrl}
                      alt={appearance.characterName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                      style={{ padding: '1px', boxSizing: 'border-box' }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-950/50 border-2 border-indigo-500/50 flex items-center justify-center">
                      <Star className="h-6 w-6 text-indigo-500/50" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-light ${colors.text} truncate`}>
                      {appearance.characterName}
                    </h4>
                    <p className="text-xs text-indigo-400/60">
                      {appearance.publisher} • {appearance.year}
                    </p>
                  </div>
                </div>

                {/* Comic Cover */}
                {appearance.coverUrl ? (
                  <div className="relative mb-3">
                    <img
                      src={appearance.coverUrl}
                      alt={`${appearance.comicTitle} ${appearance.issueNumber}`}
                      className="w-full aspect-[2/3] object-cover rounded-md border-2 border-indigo-800/30"
                      style={{ padding: '1px', boxSizing: 'border-box' }}
                      data-testid={`img-cover-${index}`}
                    />
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                      <span className={`text-xs font-light ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{appearance.priceChange24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[2/3] bg-indigo-950/30 rounded-md border-2 border-indigo-800/30 mb-3 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-indigo-500/30" />
                  </div>
                )}

                {/* Comic Details */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-light text-indigo-100 line-clamp-1">
                      {appearance.comicTitle}
                    </p>
                    <p className="text-xs text-indigo-400/70 font-light">
                      Issue {appearance.issueNumber}
                    </p>
                  </div>

                  {/* Significance */}
                  <p className="text-xs text-indigo-300/70 italic font-light line-clamp-2">
                    "{appearance.significance}"
                  </p>

                  {/* Value */}
                  <div className="pt-2 border-t border-indigo-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-indigo-400/70" />
                      <span className="text-sm text-indigo-100 font-mono font-light">
                        {appearance.estimatedValue}
                      </span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${colors.text} ${colors.bg} ${colors.border}`}>
                      {appearance.investmentPotential.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 right-6 text-xs text-indigo-400/40 font-light">
          Scroll →
        </div>
      </div>
    </div>
  );
}
