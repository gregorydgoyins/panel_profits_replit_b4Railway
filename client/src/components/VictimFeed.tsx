import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, User, DollarSign, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

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

export function VictimFeed({ userId, limit = 10, autoRefresh = true }: VictimFeedProps) {
  const [newVictimAlert, setNewVictimAlert] = useState<string | null>(null);

  // Fetch victims
  const { data: victims = [], isLoading } = useQuery<TradingVictim[]>({
    queryKey: ['/api/moral/victims', { limit }],
    enabled: !!userId,
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds
  });

  // Show alert when new victim appears
  useEffect(() => {
    if (victims.length > 0 && !newVictimAlert) {
      const latestVictim = victims[0];
      setNewVictimAlert(latestVictim.id);
      setTimeout(() => setNewVictimAlert(null), 3000);
    }
  }, [victims.length]);

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'minor':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'moderate':
        return 'border-orange-500 bg-orange-500/10';
      case 'severe':
        return 'border-red-600 bg-red-600/10';
      case 'catastrophic':
        return 'border-red-900 bg-red-900/20 animate-pulse';
      default:
        return 'border-gray-500';
    }
  };

  const getImpactBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'minor':
      case 'moderate':
        return 'secondary';
      case 'severe':
      case 'catastrophic':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

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
    <div className="h-full bg-black font-mono text-xs" data-testid="victim-feed">
      <div className="p-2 border-b border-red-900/30 text-red-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          VICTIM LOG
        </span>
        <span className="text-red-500/60">
          [{victims.length} AFFECTED]
        </span>
      </div>
      <ScrollArea className="h-[calc(100%-30px)] terminal-scroll">
        <div className="p-2 space-y-1">
            {victims.map((victim) => (
              <div
                key={victim.id}
                className={cn(
                  "p-2 border-l-2 transition-all duration-300",
                  victim.impactLevel === 'catastrophic' ? "border-red-500 text-red-500" :
                  victim.impactLevel === 'severe' ? "border-red-600/70 text-red-600/70" :
                  victim.impactLevel === 'moderate' ? "border-red-700/50 text-red-700/50" :
                  "border-red-800/30 text-red-800/30",
                  newVictimAlert === victim.id && "animate-fade-in-shake bg-red-900/10"
                )}
                data-testid={`victim-card-${victim.id}`}
              >
                {/* Terminal log format */}
                <div className="flex items-start gap-2">
                  <span className="text-red-500/60">
                    [{formatTimeAgo(victim.createdAt).toUpperCase()}]
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {victim.impactLevel.toUpperCase()}
                      </span>
                      <span>-</span>
                      <span>{victim.victimName.toUpperCase()}</span>
                      {victim.age && victim.occupation && (
                        <span className="text-red-500/40">
                          ({victim.age}YRS/{victim.occupation.toUpperCase()})
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-red-500/60 pl-2">
                      {'>'} {victim.victimStory}
                    </div>
                    {victim.consequence && (
                      <div className="mt-1 text-red-400 pl-2">
                        {'>>'} {victim.consequence}
                      </div>
                    )}
                    <div className="mt-1 text-red-500/40 pl-2">
                      LOSS: ${parseFloat(victim.lossAmount).toFixed(0)}
                      {victim.familySize && victim.familySize > 0 && 
                        ` | DEPENDENTS: ${victim.familySize}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>

      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-shake {
          0% { 
            opacity: 0;
            transform: translateX(-10px);
          }
          25% {
            transform: translateX(5px);
          }
          50% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(3px);
          }
          100% { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-shake {
          animation: fade-in-shake 0.5s ease-out;
        }
      ` }} />
    </div>
  );
}