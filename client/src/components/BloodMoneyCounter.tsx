import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Skull, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface BloodMoneyData {
  totalBloodMoney: number;
  totalVictims: number;
  recentProfit: number;
  soulWeight: string;
}

interface BloodMoneyCounterProps {
  userId?: string;
  className?: string;
  compact?: boolean;
}

export function BloodMoneyCounter({ userId, className, compact = false }: BloodMoneyCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [showBloodDrip, setShowBloodDrip] = useState(false);

  // Fetch blood money data
  const { data: bloodMoneyData } = useQuery<BloodMoneyData>({
    queryKey: ['/api/moral/blood-money'],
    enabled: !!userId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Animate counter when value changes
  useEffect(() => {
    if (bloodMoneyData?.totalBloodMoney && bloodMoneyData.totalBloodMoney !== displayValue) {
      const difference = bloodMoneyData.totalBloodMoney - displayValue;
      const steps = 20;
      const increment = difference / steps;
      let currentStep = 0;

      if (difference > 0) {
        setIsIncreasing(true);
        setShowBloodDrip(true);
        setTimeout(() => setShowBloodDrip(false), 2000);
      }

      const interval = setInterval(() => {
        currentStep++;
        setDisplayValue(prev => {
          const newValue = prev + increment;
          if (currentStep >= steps) {
            clearInterval(interval);
            setIsIncreasing(false);
            return bloodMoneyData.totalBloodMoney;
          }
          return newValue;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [bloodMoneyData?.totalBloodMoney]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSoulWeightIcon = (weight?: string) => {
    if (!weight) return null;
    switch (weight) {
      case 'damned':
      case 'crushing':
        return <Skull className="h-4 w-4 text-red-900" />;
      case 'heavy':
      case 'tainted':
        return <Heart className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md border",
          "bg-red-900/10 border-red-900/30",
          isIncreasing && "animate-pulse-red",
          className
        )}
        data-testid="blood-money-counter-compact"
      >
        <DollarSign className={cn(
          "h-4 w-4",
          isIncreasing ? "text-red-600 animate-bounce" : "text-red-800"
        )} />
        <span className={cn(
          "font-mono font-bold",
          isIncreasing ? "text-red-600" : "text-red-800"
        )}>
          {formatCurrency(displayValue)}
        </span>
        {bloodMoneyData && getSoulWeightIcon(bloodMoneyData.soulWeight)}
      </div>
    );
  }

  return (
    <>
      {/* Blood drip overlay */}
      {showBloodDrip && (
        <div className="fixed inset-x-0 top-0 h-32 pointer-events-none z-50 overflow-hidden">
          <div className="blood-drip" />
        </div>
      )}

      <Card 
        className={cn(
          "border-2 border-red-900/30 bg-gradient-to-br from-red-950/20 to-black/40",
          isIncreasing && "shadow-red-900/50 shadow-2xl animate-glow-red",
          className
        )}
        data-testid="blood-money-counter"
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                isIncreasing ? "bg-red-600/20 animate-pulse" : "bg-red-900/20"
              )}>
                <DollarSign className={cn(
                  "h-5 w-5",
                  isIncreasing ? "text-red-600" : "text-red-800"
                )} />
              </div>
              <div className="text-xs text-red-600 font-medium uppercase tracking-wider">
                Blood Money
              </div>
            </div>
            {bloodMoneyData && getSoulWeightIcon(bloodMoneyData.soulWeight)}
          </div>

          {/* Main counter */}
          <div className={cn(
            "text-3xl font-mono font-bold mb-3 transition-all duration-300",
            isIncreasing ? "text-red-500 scale-105" : "text-red-700"
          )}>
            {formatCurrency(displayValue)}
            {isIncreasing && (
              <TrendingUp className="inline-block ml-2 h-5 w-5 text-red-500 animate-bounce" />
            )}
          </div>

          {/* Stats */}
          {bloodMoneyData && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-red-600 font-semibold">
                    {bloodMoneyData.totalVictims}
                  </span> victims
                </div>
                {bloodMoneyData.recentProfit > 0 && (
                  <div className="text-red-500">
                    +{formatCurrency(bloodMoneyData.recentProfit)} today
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warning text */}
          {displayValue > 10000 && (
            <div className="mt-3 text-xs text-red-600/80 italic border-t border-red-900/30 pt-2">
              "Every dollar has a human cost"
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSS for special effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-red {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
          }
          50% { 
            box-shadow: 0 0 40px rgba(139, 0, 0, 0.8);
          }
        }
        
        @keyframes pulse-red {
          0%, 100% { 
            background-color: rgba(139, 0, 0, 0.1);
          }
          50% { 
            background-color: rgba(139, 0, 0, 0.2);
          }
        }
        
        @keyframes blood-drop {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(200px);
            opacity: 0;
          }
        }
        
        .animate-glow-red {
          animation: glow-red 2s ease-in-out infinite;
        }
        
        .animate-pulse-red {
          animation: pulse-red 1s ease-in-out infinite;
        }
        
        .blood-drip {
          position: absolute;
          width: 100%;
          height: 200px;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(139, 0, 0, 0.3) 20%,
            rgba(139, 0, 0, 0.6) 50%,
            rgba(139, 0, 0, 0.3) 80%,
            transparent 100%
          );
          animation: blood-drop 2s ease-out;
        }
        
        .blood-drip::before,
        .blood-drip::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 30px;
          background: radial-gradient(ellipse, rgba(139, 0, 0, 0.8), transparent);
          border-radius: 50%;
          animation: blood-drop 2s ease-out;
        }
        
        .blood-drip::before {
          left: 30%;
          animation-delay: 0.3s;
        }
        
        .blood-drip::after {
          right: 25%;
          animation-delay: 0.6s;
        }
      ` }} />
    </>
  );
}