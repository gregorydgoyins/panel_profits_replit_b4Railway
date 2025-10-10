import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Palette, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface CreatorShowcase {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string;
  iconicCovers: {
    id: string;
    title: string;
    coverUrl: string;
    year: string;
    publisher: string;
  }[];
  awards: string[];
  notableWorks: string[];
}

export default function CreatorShowcaseWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: creators, isLoading } = useQuery<CreatorShowcase[]>({
    queryKey: ["/api/creators/showcase"],
    refetchInterval: 30000,
  });

  const currentCreator = creators && creators.length > 0 ? creators[currentIndex] : null;

  const handlePrevious = () => {
    if (!creators) return;
    setCurrentIndex((prev) => (prev === 0 ? creators.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!creators) return;
    setCurrentIndex((prev) => (prev === creators.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-creator-showcase-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Palette className="h-4 w-4" />
            Creator Showcase
          </div>
        </div>

        <div className="relative p-6">
          <div className="flex gap-6">
            <Skeleton className="h-64 w-48 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-3 gap-3 mt-6">
                <Skeleton className="h-32 rounded-md" />
                <Skeleton className="h-32 rounded-md" />
                <Skeleton className="h-32 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCreator) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-creator-showcase-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Palette className="h-4 w-4" />
            Creator Showcase
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Palette className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No creators in spotlight
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
      data-testid="widget-creator-showcase"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Palette className="h-4 w-4" />
          Creator Showcase
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-400/60 font-light">
            {currentIndex + 1} / {creators?.length || 0}
          </span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevious}
              className="h-7 w-7"
              data-testid="button-creator-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="h-7 w-7"
              data-testid="button-creator-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Creator Showcase */}
      <div className="relative p-6">
        <div className="flex gap-6">
          {/* Creator Portrait */}
          <div className="flex-shrink-0">
            {currentCreator.imageUrl ? (
              <img
                src={currentCreator.imageUrl}
                alt={currentCreator.name}
                className="w-48 h-64 object-cover rounded-md border border-indigo-800/30"
                data-testid="img-creator-portrait"
              />
            ) : (
              <div className="w-48 h-64 bg-indigo-950/30 rounded-md border border-indigo-800/30 flex items-center justify-center">
                <Palette className="h-16 w-16 text-indigo-500/20" />
              </div>
            )}
          </div>

          {/* Creator Info */}
          <div className="flex-1 min-w-0">
            <h2 
              className="text-3xl  text-indigo-100 mb-2"
              data-testid="text-creator-name"
            >
              {currentCreator.name}
            </h2>
            
            <p className="text-indigo-400 text-sm mb-4 uppercase tracking-wide font-light">
              {currentCreator.role}
            </p>

            <p className="text-indigo-300/70 text-sm leading-relaxed mb-6 font-light">
              {currentCreator.bio}
            </p>

            {/* Awards */}
            {currentCreator.awards && currentCreator.awards.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-indigo-400 text-xs uppercase tracking-wide mb-2">
                  <Award className="h-3 w-3" />
                  Awards & Recognition
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentCreator.awards.slice(0, 3).map((award, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-900/30 border border-indigo-800/30 rounded text-xs text-indigo-300 font-light"
                      data-testid={`badge-award-${index}`}
                    >
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Iconic Covers */}
            <div>
              <div className="text-indigo-400 text-xs uppercase tracking-wide mb-3 font-light">
                Iconic Covers
              </div>
              <div className="grid grid-cols-3 gap-3">
                {currentCreator.iconicCovers.slice(0, 3).map((cover, index) => (
                  <div 
                    key={cover.id}
                    className="relative group hover-elevate active-elevate-2 rounded-md overflow-hidden"
                    data-testid={`cover-${index}`}
                  >
                    <img
                      src={cover.coverUrl}
                      alt={cover.title}
                      className="w-full aspect-[2/3] object-cover"
                      loading="lazy"
                      data-testid={`img-cover-${index}`}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs  line-clamp-1">
                          {cover.title}
                        </p>
                        <p className="text-indigo-300 text-xs font-light">
                          {cover.year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notable Works */}
            {currentCreator.notableWorks && currentCreator.notableWorks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-indigo-900/30">
                <p className="text-indigo-400/60 text-xs font-light italic">
                  Notable: {currentCreator.notableWorks.slice(0, 3).join(" • ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
