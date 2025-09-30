import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, User, DollarSign, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useOptimizedWebSocket } from '@/hooks/useOptimizedWebSocket';

interface TradingVictim {
  id: string;
  victimName: string;
  victimStory: string;
  lossAmount: string;
  impactLevel: 'minor' | 'moderate' | 'severe' | 'catastrophic';
  age?: number;
  occupation?: string;
  familySize?: number;
  consequence?: string;
  createdAt: string;
}

interface VictimFeedProps {
  userId?: string;
  limit?: number;
  autoRefresh?: boolean;
}

// Memoized victim item component
const VictimItem = memo(({ 
  victim, 
  isNew,
  formatCurrency,
  formatTimeAgo 
}: {
  victim: TradingVictim;
  isNew: boolean;
  formatCurrency: (amount: string) => string;
  formatTimeAgo: (date: string) => string;
}) => {
  const impactColor = useMemo(() => {
    switch (victim.impactLevel) {
      case 'catastrophic': return "border-red-500 text-red-500";
      case 'severe': return "border-red-600/70 text-red-600/70";
      case 'moderate': return "border-red-700/50 text-red-700/50";
      default: return "border-red-800/30 text-red-800/30";
    }
  }, [victim.impactLevel]);

  return (
    <div
      className={cn(
        "p-2 border-l-2 transition-all duration-300 transform-gpu",
        impactColor,
        isNew && "animate-fade-in bg-red-900/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        victim.impactLevel === 'catastrophic' && "animate-pulse-optimized"
      )}
      data-testid={`victim-item-${victim.id}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <div className="font-mono font-bold">
            {victim.victimName}
          </div>
          <div className="text-xs opacity-70 mt-1 line-clamp-2">
            {victim.victimStory}
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="font-bold">
            {formatCurrency(victim.lossAmount)}
          </div>
          <div className="opacity-50">
            {formatTimeAgo(victim.createdAt)}
          </div>
        </div>
      </div>
      {victim.consequence && (
        <div className="text-xs mt-1 opacity-60 italic">
          {victim.consequence}
        </div>
      )}
    </div>
  );
});
VictimItem.displayName = 'VictimItem';

export const VictimFeed = memo(function VictimFeed({ 
  userId, 
  limit = 10, 
  autoRefresh = true 
}: VictimFeedProps) {
  const [newVictimAlert, setNewVictimAlert] = useState<string | null>(null);
  const [recentVictims, setRecentVictims] = useState<TradingVictim[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Check if mobile before using in WebSocket config
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Subscribe to WebSocket for real-time victim updates with optimizations
  const { isConnected } = useOptimizedWebSocket({ 
    subscribeTo: { 
      victims: true 
    },
    throttleMs: isMobile ? 500 : 200, // Slower updates on mobile
    enableBatching: true
  });

  // Fetch victims from API with optimized intervals
  const { data: apiVictims = [], isLoading } = useQuery<TradingVictim[]>({
    queryKey: ['/api/moral/victims', { limit }],
    enabled: !!userId,
    refetchInterval: autoRefresh ? (isMobile ? 60000 : 30000) : false, // Slower refresh on mobile
    staleTime: 15000, // Consider data fresh for 15 seconds
  });
  
  // Combine and optimize victim list (memoized)
  const victims = useMemo(() => {
    // Use a Map for efficient deduplication
    const victimMap = new Map<string, TradingVictim>();
    
    // Add recent victims first (higher priority)
    recentVictims.forEach(v => victimMap.set(v.id, v));
    
    // Add API victims (won't override existing)
    apiVictims.forEach(v => {
      if (!victimMap.has(v.id)) {
        victimMap.set(v.id, v);
      }
    });
    
    // Convert to array, sort, and limit
    return Array.from(victimMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [recentVictims, apiVictims, limit]);

  // Optimized victim update handler
  const handleVictimUpdate = useCallback((event: CustomEvent) => {
    const newVictim = event.detail as TradingVictim;
    
    setRecentVictims(prev => {
      // Limit memory usage - keep only 50 recent victims
      const updated = [newVictim, ...prev].slice(0, 50);
      return updated;
    });
    
    // Show alert for new victim
    setNewVictimAlert(newVictim.id);
    
    // Scroll to top only if not on mobile (better UX)
    if (scrollRef.current && !isMobile) {
      scrollRef.current.scrollTop = 0;
    }
    
    // Clear previous timeout to prevent memory leaks
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    // Remove alert after animation
    alertTimeoutRef.current = setTimeout(() => {
      setNewVictimAlert(null);
    }, 2000); // Reduced from 3000ms for faster UI
  }, [isMobile]);

  // Listen for WebSocket victim events
  useEffect(() => {
    window.addEventListener('ws:victim_created' as any, handleVictimUpdate as any);
    
    return () => {
      window.removeEventListener('ws:victim_created' as any, handleVictimUpdate as any);
      // Clear timeout on unmount
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [handleVictimUpdate]);

  // Memoized formatters
  const formatCurrency = useCallback((amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }, []);

  const formatTimeAgo = useCallback((date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black p-4 font-mono text-xs text-red-500" data-testid="victim-feed-loading">
        <div className="animate-pulse">LOADING VICTIM DATA...</div>
      </div>
    );
  }

  if (victims.length === 0) {
    return (
      <div className="bg-black p-4 font-mono text-xs text-red-500/40" data-testid="victim-feed-empty">
        NO VICTIMS... YET
      </div>
    );
  }

  return (
    <div className="h-full bg-black font-mono text-xs contain-layout" data-testid="victim-feed">
      <div className="p-2 border-b border-red-900/30 text-red-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          VICTIM LOG
          {isConnected && recentVictims.length > 0 && (
            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse ml-1" />
          )}
        </span>
        <span className="text-red-500/60">
          [{victims.length} AFFECTED]
        </span>
      </div>
      <ScrollArea 
        className="h-[calc(100%-30px)] terminal-scroll optimized-scroll" 
        ref={scrollRef}
      >
        <div className="p-2 space-y-1">
          {victims.map((victim) => (
            <VictimItem
              key={victim.id}
              victim={victim}
              isNew={newVictimAlert === victim.id}
              formatCurrency={formatCurrency}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

// Export default for lazy loading
export default VictimFeed;