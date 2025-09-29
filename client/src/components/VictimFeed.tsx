import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
      <Card className="animate-pulse" data-testid="victim-feed-loading">
        <CardHeader>
          <CardTitle>Loading victims...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (victims.length === 0) {
    return (
      <Card data-testid="victim-feed-empty">
        <CardHeader>
          <CardTitle className="text-muted-foreground">No victims... yet</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-red-900/20" data-testid="victim-feed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="h-5 w-5" />
          Trading Victims
          {victims.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {victims.length} Lives Affected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 p-4">
            {victims.map((victim) => (
              <div
                key={victim.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-500",
                  getImpactColor(victim.impactLevel),
                  newVictimAlert === victim.id && "animate-fade-in-shake scale-105"
                )}
                data-testid={`victim-card-${victim.id}`}
              >
                {/* Victim Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{victim.victimName}</div>
                      {victim.occupation && victim.age && (
                        <div className="text-xs text-muted-foreground">
                          {victim.age} years old • {victim.occupation}
                          {victim.familySize && victim.familySize > 0 && 
                            ` • ${victim.familySize} dependents`}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={getImpactBadgeVariant(victim.impactLevel)}>
                    {victim.impactLevel}
                  </Badge>
                </div>

                {/* Story */}
                <div className="text-sm mb-3 text-foreground/90 italic">
                  "{victim.victimStory}"
                </div>

                {/* Consequence */}
                {victim.consequence && (
                  <div className="text-xs text-red-600 font-medium mb-2 border-l-2 border-red-600 pl-2">
                    {victim.consequence}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-bold text-red-600">
                      {formatCurrency(victim.lossAmount)} lost
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatTimeAgo(victim.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

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
    </Card>
  );
}