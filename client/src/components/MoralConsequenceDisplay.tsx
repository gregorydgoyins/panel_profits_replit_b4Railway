import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skull, Heart, DollarSign, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MoralStanding {
  corruption: number;
  soulWeight: string;
  victimCount: number;
  bloodMoney: number;
  canConfess: boolean;
}

export function MoralConsequenceDisplay({ userId }: { userId?: string }) {
  const { toast } = useToast();
  const [isShaking, setIsShaking] = useState(false);
  const [showBloodEffect, setShowBloodEffect] = useState(false);

  // Fetch moral standing
  const { data: moralStanding, isLoading } = useQuery<MoralStanding>({
    queryKey: ['/api/moral/standing'],
    enabled: !!userId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Confession mutation
  const { mutate: confess, isPending: isConfessing } = useMutation({
    mutationFn: () => apiRequest('/api/moral/confess', 'POST'),
    onSuccess: (data: any) => {
      toast({
        title: 'Confession Complete',
        description: data.message,
        variant: 'destructive',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/moral/standing'] });
      queryClient.invalidateQueries({ queryKey: ['/api/moral/victims'] });
      
      // Trigger visual effect
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    },
    onError: () => {
      toast({
        title: 'Confession Failed',
        description: 'Your sins are too heavy to confess right now',
        variant: 'destructive',
      });
    },
  });

  // Trigger blood effect when corruption increases
  useEffect(() => {
    if (moralStanding && moralStanding.corruption > 0) {
      setShowBloodEffect(true);
      setTimeout(() => setShowBloodEffect(false), 2000);
    }
  }, [moralStanding?.victimCount]);

  if (isLoading || !moralStanding) {
    return null;
  }

  const getSoulWeightColor = (weight: string) => {
    switch (weight) {
      case 'unburdened':
        return 'text-green-500';
      case 'tainted':
        return 'text-yellow-500';
      case 'heavy':
        return 'text-orange-500';
      case 'crushing':
        return 'text-red-600';
      case 'damned':
        return 'text-red-900';
      default:
        return 'text-gray-500';
    }
  };

  const getCorruptionColor = (level: number) => {
    if (level < 20) return 'bg-green-500';
    if (level < 40) return 'bg-yellow-500';
    if (level < 60) return 'bg-orange-500';
    if (level < 80) return 'bg-red-600';
    return 'bg-red-900';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      {/* Blood drip effect overlay */}
      {showBloodEffect && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 animate-blood-drip"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, transparent 80%, rgba(139, 0, 0, 0.3) 100%)',
          }}
        />
      )}

      {/* Corruption vignette overlay */}
      {moralStanding.corruption > 30 && (
        <div 
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: `radial-gradient(circle, transparent 30%, rgba(0, 0, 0, ${moralStanding.corruption / 200}) 100%)`,
          }}
        />
      )}

      <Card 
        className={cn(
          "border-2 transition-all duration-500",
          moralStanding.corruption > 50 && "border-red-900/50 shadow-red-900/20 shadow-xl",
          moralStanding.corruption > 80 && "animate-pulse-slow",
          isShaking && "animate-shake",
          moralStanding.corruption > 70 && "crack-effect"
        )}
        data-testid="moral-consequence-display"
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Skull className={cn("h-5 w-5", getSoulWeightColor(moralStanding.soulWeight))} />
              Moral Standing
            </span>
            <Badge 
              variant="destructive"
              className={cn(
                "text-xs",
                getSoulWeightColor(moralStanding.soulWeight)
              )}
            >
              {moralStanding.soulWeight.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Corruption Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Corruption Level</span>
              <span className="font-bold text-red-600">
                {moralStanding.corruption.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={moralStanding.corruption} 
                className="h-3"
              />
              <div 
                className={cn(
                  "absolute inset-0 h-3 rounded-full transition-all duration-500",
                  getCorruptionColor(moralStanding.corruption)
                )}
                style={{ width: `${moralStanding.corruption}%` }}
              />
              {moralStanding.corruption > 60 && (
                <div className="absolute inset-0 h-3 rounded-full bg-gradient-to-r from-transparent via-red-900/30 to-transparent animate-pulse" />
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-muted-foreground">Victims</div>
                <div className="font-bold text-red-600">{moralStanding.victimCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-muted-foreground">Blood Money</div>
                <div className="font-bold text-red-600">
                  {formatCurrency(moralStanding.bloodMoney)}
                </div>
              </div>
            </div>
          </div>

          {/* Warning messages based on corruption level */}
          {moralStanding.corruption > 40 && (
            <div className="text-xs text-red-600 italic border-l-2 border-red-600 pl-2">
              {moralStanding.corruption < 60 
                ? "The weight of your actions grows heavy..."
                : moralStanding.corruption < 80
                ? "Your soul darkens with each trade..."
                : "You are becoming the monster you feed..."}
            </div>
          )}

          {/* Confession Button */}
          {moralStanding.canConfess && (
            <Button
              onClick={() => confess()}
              disabled={isConfessing}
              variant="outline"
              className="w-full border-red-900 hover:bg-red-900/10 text-red-900"
              data-testid="button-confess"
            >
              <Heart className="h-4 w-4 mr-2" />
              {isConfessing ? 'Confessing...' : 'Confess Sins (10% of Blood Money)'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* CSS for special effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blood-drip {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(0); opacity: 0; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        
        .animate-blood-drip {
          animation: blood-drip 2s ease-out;
        }
        
        .animate-shake {
          animation: shake 1s ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .crack-effect {
          position: relative;
        }
        
        .crack-effect::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M20,50 L30,30 L35,60 L45,20 L50,70 L60,35 L70,55 L80,40" stroke="rgba(139,0,0,0.3)" stroke-width="0.5" fill="none"/></svg>');
          opacity: 0.5;
          pointer-events: none;
        }
      ` }} />
    </>
  );
}