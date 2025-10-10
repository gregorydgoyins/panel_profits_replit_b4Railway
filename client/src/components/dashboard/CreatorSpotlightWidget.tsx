import { useQuery } from "@tanstack/react-query";
import { Pen, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";

interface Creator {
  id: string;
  name: string;
  symbol: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  metadata: any;
  price: number | null;
  percentChange: number | null;
  volume: number | null;
}

export default function CreatorSpotlightWidget() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const { data: creators, isLoading } = useQuery<Creator[]>({
    queryKey: ["/api/creators/spotlight"],
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

  const getCreatorRole = (metadata: any) => {
    if (!metadata) return "Creator";
    if (metadata.role) return metadata.role;
    if (metadata.roles && Array.isArray(metadata.roles)) {
      return metadata.roles.join(", ");
    }
    return "Writer/Artist";
  };

  const getNotableWorks = (metadata: any) => {
    if (!metadata) return [];
    if (metadata.notableWorks && Array.isArray(metadata.notableWorks)) {
      return metadata.notableWorks.slice(0, 3);
    }
    if (metadata.notable_works) {
      return metadata.notable_works.slice(0, 3);
    }
    return [];
  };

  const getCoverImage = (metadata: any) => {
    if (!metadata) return null;
    return metadata.coverUrl || metadata.cover_url || metadata.iconicCoverUrl || null;
  };

  if (isLoading) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-creator-spotlight-loading"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Pen className="h-4 w-4" />
            Creator Showcase
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
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

  if (!creators || creators.length === 0) {
    return (
      <div 
        className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
        data-testid="widget-creator-spotlight-empty"
      >
        <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative p-4 border-b border-indigo-900/30">
          <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
            <Pen className="h-4 w-4" />
            Creator Showcase
          </div>
        </div>

        <div className="relative p-12 flex flex-col items-center justify-center text-center">
          <Pen className="h-12 w-12 text-indigo-500/30 mb-4" />
          <p className="text-indigo-300/60 text-sm font-light">
            No creators in spotlight
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-[#1A1F2E] border border-indigo-900/30 rounded-md overflow-hidden"
      data-testid="widget-creator-showcase"
    >
      {/* Texture overlays */}
      <div className="absolute inset-0 bg-[url('/newsprint-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/halftone-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-4 border-b border-indigo-900/30">
        <div className="flex items-center gap-2 text-indigo-100 font-light tracking-wider uppercase text-sm">
          <Pen className="h-4 w-4" />
          Creator Showcase
        </div>
        <p className="text-xs text-indigo-400/70 font-light mt-1">
          Legendary Writers & Artists
        </p>
      </div>

      {/* Parallax Creator Grid */}
      <div 
        ref={scrollRef}
        className="relative max-h-[600px] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {creators.slice(0, 4).map((creator, index) => {
            const role = getCreatorRole(creator.metadata);
            const notableWorks = getNotableWorks(creator.metadata);
            const coverImage = getCoverImage(creator.metadata);
            const parallaxOffset = (scrollY * 0.3) - (index * 30);

            return (
              <div 
                key={creator.id}
                className="relative hover-elevate active-elevate-2 rounded-md overflow-hidden"
                data-testid={`creator-${index}`}
              >
                {/* Parallax Background Cover */}
                {coverImage && (
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      transform: `translateY(${parallaxOffset}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <img
                      src={coverImage}
                      alt=""
                      className="w-full h-full object-contain scale-110 blur-sm"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative flex gap-4 p-4 bg-gradient-to-r from-[#1A1F2E]/95 to-[#252B3C]/90">
                  {/* Creator Portrait / Cover */}
                  <div className="flex-shrink-0 relative z-10">
                    {creator.imageUrl || coverImage ? (
                      <img
                        src={creator.imageUrl || coverImage}
                        alt={creator.name}
                        className="w-24 h-32 rounded-md object-contain border border-indigo-800/30 bg-black/50"
                        style={{ padding: '1px', boxSizing: 'border-box' }}
                        data-testid={`img-creator-${index}`}
                      />
                    ) : (
                      <div className="w-24 h-32 rounded-md bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-center">
                        <Pen className="h-10 w-10 text-indigo-500/30" />
                      </div>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 
                          className="text-lg text-indigo-100 mb-1"
                          data-testid={`text-name-${index}`}
                        >
                          {creator.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-3 w-3 text-indigo-400/70" />
                          <p className="text-sm text-indigo-400 font-light">
                            {role}
                          </p>
                        </div>
                      </div>

                      {/* Price Badge */}
                      {creator.price && (
                        <Badge
                          variant="outline"
                          className="bg-indigo-950/30 border-indigo-800/30 text-indigo-300 text-xs"
                          data-testid={`badge-price-${index}`}
                        >
                          ${creator.price.toFixed(2)}
                        </Badge>
                      )}
                    </div>

                    {/* Notable Works */}
                    {notableWorks.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-indigo-400 uppercase tracking-wide mb-2 font-light">
                          Iconic Works
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {notableWorks.map((work: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-purple-950/30 border-purple-800/30 text-purple-300"
                              data-testid={`badge-work-${index}-${idx}`}
                            >
                              {work}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {creator.description && (
                      <p className="text-sm text-indigo-300/80 leading-relaxed font-light line-clamp-2">
                        {creator.description}
                      </p>
                    )}

                    {/* Trading Stats */}
                    {creator.volume !== null && (
                      <div className="mt-3 pt-3 border-t border-indigo-900/30">
                        <div className="flex items-center gap-4 text-xs text-indigo-400/70 font-light">
                          <span>Volume: ${creator.volume?.toLocaleString() || 0}</span>
                          {creator.percentChange !== null && (
                            <span className={creator.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {creator.percentChange >= 0 ? '+' : ''}{creator.percentChange.toFixed(2)}%
                            </span>
                          )}
                        </div>
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
