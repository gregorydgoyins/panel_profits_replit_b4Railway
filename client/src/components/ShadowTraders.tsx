import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Ghost, Skull, TrendingDown, TrendingUp, Eye } from 'lucide-react';

interface ShadowTrader {
  id: string;
  shadowName: string;
  userId?: string;
  portfolioValue: string;
  corruptionLevel: string;
  status: 'active' | 'fallen' | 'consumed' | 'rising';
  shadowColor: string;
  opacity: string;
  isAI: boolean;
  displayName: string;
  glowIntensity: number;
  driftSpeed: number;
  startPosition: number;
}

export function ShadowTraders() {
  const [hoveredShadow, setHoveredShadow] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const shadowPositions = useRef<Map<string, number>>(new Map());

  // Fetch shadow traders
  const { data: shadows = [], isLoading } = useQuery<ShadowTrader[]>({
    queryKey: ['/api/warfare/shadows'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Animate shadows drifting across screen
  useEffect(() => {
    const animate = () => {
      shadows.forEach(shadow => {
        const currentPos = shadowPositions.current.get(shadow.id) || shadow.startPosition;
        const newPos = (currentPos + 0.1 * shadow.driftSpeed) % 100;
        shadowPositions.current.set(shadow.id, newPos);
      });

      // Force re-render for animation
      if (containerRef.current) {
        containerRef.current.style.transform = `translateZ(0)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (shadows.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shadows]);

  if (isLoading) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Shadow traders drifting across the screen */}
      {shadows.map((shadow, index) => {
        const position = shadowPositions.current.get(shadow.id) || shadow.startPosition;
        const yPosition = 20 + (index % 3) * 30; // Distribute vertically
        const isHovered = hoveredShadow === shadow.id;
        const portfolioValue = parseFloat(shadow.portfolioValue);
        const corruption = parseFloat(shadow.corruptionLevel);
        
        // Determine shadow state for visual effects
        const isFallen = shadow.status === 'fallen';
        const isConsumed = shadow.status === 'consumed';
        const isProfitable = portfolioValue > 100000;
        const isDangerous = corruption > 60;

        return (
          <div
            key={shadow.id}
            className={cn(
              "absolute transition-all duration-1000 pointer-events-auto",
              isFallen && "animate-pulse",
              isConsumed && "opacity-20"
            )}
            style={{
              left: `${position}%`,
              top: `${yPosition}%`,
              transform: `translateX(-50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`,
            }}
            onMouseEnter={() => setHoveredShadow(shadow.id)}
            onMouseLeave={() => setHoveredShadow(null)}
          >
            {/* Shadow figure */}
            <div 
              className="relative"
              style={{
                filter: `blur(${isHovered ? 0 : 2}px)`,
                opacity: parseFloat(shadow.opacity),
              }}
            >
              {/* Shadow body */}
              <div 
                className={cn(
                  "w-16 h-24 rounded-full",
                  "bg-gradient-to-b",
                  isFallen ? "from-red-900/80 to-black/90" : 
                  isProfitable ? "from-green-900/60 to-black/80" :
                  "from-gray-900/70 to-black/85"
                )}
                style={{
                  boxShadow: `0 0 ${20 * shadow.glowIntensity}px ${shadow.shadowColor}`,
                  animation: `float ${5 / shadow.driftSpeed}s ease-in-out infinite`,
                }}
              >
                {/* Status icon */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                  {isFallen ? (
                    <Skull className="w-4 h-4 text-red-500 animate-pulse" />
                  ) : isConsumed ? (
                    <Ghost className="w-4 h-4 text-gray-500" />
                  ) : isDangerous ? (
                    <Eye className="w-4 h-4 text-purple-500" />
                  ) : isProfitable ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>

                {/* Portfolio value display */}
                {isHovered && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="text-xs font-mono">
                      <span className={cn(
                        isProfitable ? "text-green-400" : "text-red-400"
                      )}>
                        ${(portfolioValue / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shadow name on hover */}
              {isHovered && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    "bg-black/80 backdrop-blur-sm",
                    isFallen && "text-red-400 border border-red-900",
                    isConsumed && "text-gray-500",
                    !isFallen && !isConsumed && "text-gray-300"
                  )}>
                    {shadow.displayName}
                    {corruption > 0 && (
                      <span className="ml-1 text-purple-400">
                        ({corruption.toFixed(0)}% corrupt)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Blood pool for fallen traders */}
              {isFallen && !isConsumed && (
                <div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                  style={{
                    width: '80px',
                    height: '20px',
                    background: 'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.8) 0%, transparent 70%)',
                    animation: 'spread 3s ease-out infinite',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Global shadow effects CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spread {
          0% { 
            width: 40px;
            opacity: 0.8;
          }
          100% { 
            width: 120px;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}