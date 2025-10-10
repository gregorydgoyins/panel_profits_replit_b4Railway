import { useQuery } from "@tanstack/react-query";
import { Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";

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
  writer?: string;
  artist?: string;
  coverArtist?: string;
}

export default function ComicPanelTimelineWidget() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const { data: panels, isLoading } = useQuery<TimelinePanel[]>({
    queryKey: ["/api/timeline/key-moments"],
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
        data-testid="widget-timeline-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Calendar className="h-4 w-4" />
            Key Moments Timeline
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-32 w-24 rounded-md flex-shrink-0" />
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

  if (!panels || panels.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
        data-testid="widget-timeline-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Calendar className="h-4 w-4" />
            Key Moments Timeline
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Calendar className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No timeline data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden dashboard-rimlight-hover"
      data-testid="widget-timeline"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Calendar className="h-4 w-4" />
          Key Moments Timeline
        </div>
        <p className="text-xs text-indigo-400/70 font-light mt-1">
          Defining Moments in Comic History
        </p>
      </div>

      {/* Parallax Timeline */}
      <div 
        ref={scrollRef}
        className="relative max-h-[600px] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {panels.map((panel, index) => {
            const parallaxOffset = (scrollY * 0.3) - (index * 25);

            return (
              <div 
                key={panel.id}
                className="relative hover-elevate active-elevate-2 rounded-md overflow-hidden"
                data-testid={`timeline-panel-${index}`}
              >
                {/* Parallax Background Panel */}
                {panel.imageUrl && (
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      transform: `translateY(${parallaxOffset}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <img
                      src={panel.imageUrl}
                      alt=""
                      className="w-full h-full object-contain scale-110 blur-sm"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative flex gap-4 p-4 bg-gradient-to-r from-[#1A1F2E]/95 to-[#252B3C]/90">
                  {/* Timeline connector */}
                  {index < panels.length - 1 && (
                    <div className="absolute left-[58px] top-[140px] bottom-0 w-px bg-indigo-800/30" />
                  )}

                  {/* Panel Image */}
                  <div className="flex-shrink-0 relative z-10">
                    {/* Timeline dot */}
                    <div className="absolute -left-2 top-16 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#1A1F2E] z-20" />
                    
                    {panel.imageUrl ? (
                      <img
                        src={panel.imageUrl}
                        alt={panel.title}
                        className="w-24 h-32 rounded-md object-contain border border-indigo-800/30 bg-black/50"
                        style={{ padding: '1px', boxSizing: 'border-box' }}
                        data-testid={`img-panel-${index}`}
                      />
                    ) : (
                      <div className="w-24 h-32 rounded-md bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-center">
                        <Calendar className="h-10 w-10 text-indigo-500/20" />
                      </div>
                    )}
                  </div>

                  {/* Panel Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 
                          className="text-base text-indigo-100 mb-1"
                          data-testid={`text-panel-title-${index}`}
                        >
                          {panel.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-indigo-400/80 font-light mb-2">
                          <span className="font-mono">{panel.issue}</span>
                          <span className="text-indigo-500/50">•</span>
                          <span>{panel.date}</span>
                        </div>
                      </div>

                      {/* Entity Badge */}
                      {panel.entityName && (
                        <Badge
                          variant="outline"
                          className="bg-indigo-950/30 border-indigo-800/30 text-indigo-300 text-xs"
                          data-testid={`badge-entity-${index}`}
                        >
                          {panel.entityName}
                        </Badge>
                      )}
                    </div>

                    {/* Creator Info */}
                    {(panel.writer || panel.artist || panel.coverArtist) && (
                      <div className="flex items-center gap-3 mb-3 text-xs text-indigo-400/70 font-light">
                        <User className="h-3 w-3" />
                        <div className="flex flex-wrap gap-2">
                          {panel.writer && <span>Writer: {panel.writer}</span>}
                          {panel.artist && <span>Artist: {panel.artist}</span>}
                          {panel.coverArtist && <span>Cover: {panel.coverArtist}</span>}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-indigo-300/80 leading-relaxed mb-3 font-light">
                      {panel.description}
                    </p>

                    {/* Significance */}
                    {panel.significance && (
                      <div className="pt-3 border-t border-indigo-900/30">
                        <p className="text-xs text-indigo-300/60 italic font-light">
                          <span className="text-indigo-400">Significance:</span> {panel.significance}
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
