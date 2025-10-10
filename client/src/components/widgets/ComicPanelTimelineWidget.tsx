import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface TimelinePanel {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string | null;
  issue: string;
  significance: string;
  entityName?: string;
  entityType?: string;
}

export default function ComicPanelTimelineWidget() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [timelineRef, setTimelineRef] = useState<HTMLDivElement | null>(null);

  const { data: panels, isLoading } = useQuery<TimelinePanel[]>({
    queryKey: ["/api/timeline/key-moments"],
    refetchInterval: 30000,
  });

  const handleScroll = (direction: "left" | "right") => {
    if (!timelineRef) return;
    const scrollAmount = 400;
    const newPosition = direction === "left" 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    timelineRef.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-timeline-loading"
      >
        {/* Texture overlays */}
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Calendar className="h-4 w-4" />
            Key Moments Timeline
          </div>
        </div>

        <div className="relative p-6">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64">
                <Skeleton className="h-80 w-full mb-3 rounded-md" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!panels || panels.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-timeline-empty"
      >
        {/* Texture overlays */}
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Calendar className="h-4 w-4" />
            Key Moments Timeline
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <BookOpen className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No timeline data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
      data-testid="widget-timeline"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Calendar className="h-4 w-4" />
          Key Moments Timeline
        </div>
        
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleScroll("left")}
            className="h-7 w-7"
            data-testid="button-timeline-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleScroll("right")}
            className="h-7 w-7"
            data-testid="button-timeline-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline bar */}
        <div className="absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent z-0" />
        
        {/* Scrollable panels */}
        <div 
          ref={setTimelineRef}
          className="relative overflow-x-auto hide-scrollbar p-6 pt-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6 min-w-max pb-2">
            {panels.map((panel, index) => (
              <div 
                key={panel.id}
                className="flex-shrink-0 w-64 group"
                data-testid={`timeline-panel-${index}`}
              >
                {/* Timeline dot */}
                <div className="relative flex justify-center mb-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#1A1F2E] relative z-10" />
                </div>

                {/* Panel card */}
                <div className="relative bg-[#252B3C]/80 border border-indigo-800/30 rounded-md overflow-hidden hover-elevate active-elevate-2 transition-all">
                  {/* Panel image */}
                  {panel.imageUrl ? (
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={panel.imageUrl}
                        alt={panel.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        data-testid={`img-panel-${index}`}
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Issue badge */}
                      <div className="absolute top-2 right-2 bg-indigo-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-indigo-100 border border-indigo-700/50">
                        {panel.issue}
                      </div>

                      {/* Date badge */}
                      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-indigo-300 border border-indigo-900/50">
                        {panel.date}
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[3/4] bg-indigo-950/30 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-indigo-500/20" />
                    </div>
                  )}

                  {/* Panel info */}
                  <div className="p-3 space-y-2">
                    <h3 
                      className="text-indigo-100 font-medium text-sm line-clamp-2"
                      data-testid={`text-panel-title-${index}`}
                    >
                      {panel.title}
                    </h3>
                    
                    <p className="text-indigo-300/70 text-xs line-clamp-2 font-light">
                      {panel.description}
                    </p>

                    {panel.significance && (
                      <div className="pt-2 border-t border-indigo-800/30">
                        <p className="text-indigo-400/60 text-xs italic font-light">
                          {panel.significance}
                        </p>
                      </div>
                    )}

                    {panel.entityName && (
                      <div className="flex items-center gap-2 text-xs text-indigo-400/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                        <span className="font-light">{panel.entityName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
