import { useState, useEffect } from 'react';
import { AlertTriangle, User, Skull, Heart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VictimData {
  id: string;
  victimName: string;
  victimStory: string;
  lossAmount: string;
  impactLevel: 'minor' | 'moderate' | 'severe' | 'catastrophic';
  age?: number;
  occupation?: string;
  familySize?: number;
  consequence?: string;
}

interface VictimNotificationProps {
  victim: VictimData;
  onDismiss?: () => void;
}

export function VictimNotification({ victim, onDismiss }: VictimNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in after mount
    const fadeInTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss?.();
      }, 500); // Wait for exit animation
    }, 5000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  const getImpactIcon = () => {
    switch (victim.impactLevel) {
      case 'catastrophic':
        return <Skull className="h-6 w-6 text-red-500 animate-pulse" />;
      case 'severe':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'moderate':
        return <Heart className="h-6 w-6 text-orange-500" />;
      default:
        return <User className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getImpactStyle = () => {
    switch (victim.impactLevel) {
      case 'catastrophic':
        return 'border-red-900 bg-black shadow-blood';
      case 'severe':
        return 'border-red-700 bg-black/95';
      case 'moderate':
        return 'border-red-600 bg-black/90';
      default:
        return 'border-red-500 bg-black/85';
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-[9999] max-w-md",
        "transition-all duration-500 ease-out",
        isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      data-testid="victim-notification"
    >
      <div className={cn(
        "relative border-2 rounded-none p-6",
        "animate-shake-once",
        getImpactStyle()
      )}>
        {/* Blood drip effect for catastrophic */}
        {victim.impactLevel === 'catastrophic' && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="blood-drip" />
          </div>
        )}

        {/* Header with impact icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getImpactIcon()}
            <div>
              <h3 className="text-red-500 font-mono text-sm uppercase tracking-wider">
                {victim.impactLevel === 'catastrophic' ? 'LIFE DESTROYED' : 
                 victim.impactLevel === 'severe' ? 'FAMILY RUINED' :
                 victim.impactLevel === 'moderate' ? 'SERIOUS HARM' : 
                 'COLLATERAL DAMAGE'}
              </h3>
              <p className="text-white font-bold text-lg mt-1">
                {victim.victimName}
              </p>
            </div>
          </div>
          
          {/* Loss amount */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-red-400">
              <DollarSign className="h-4 w-4" />
              <span className="font-mono text-lg">
                {parseFloat(victim.lossAmount).toFixed(0)}
              </span>
            </div>
            <p className="text-red-500/60 text-xs mt-1">LOST</p>
          </div>
        </div>

        {/* Victim details */}
        {(victim.age || victim.occupation) && (
          <div className="mb-3 text-gray-400 text-sm flex items-center gap-3">
            {victim.age && <span>{victim.age} years old</span>}
            {victim.occupation && <span className="capitalize">{victim.occupation}</span>}
            {victim.familySize && victim.familySize > 0 && (
              <span className="text-red-400">{victim.familySize} dependents</span>
            )}
          </div>
        )}

        {/* Story */}
        <p className="text-white/90 text-sm leading-relaxed mb-3">
          {victim.victimStory}
        </p>

        {/* Consequence */}
        {victim.consequence && (
          <div className="pt-3 border-t border-red-900/30">
            <p className="text-red-400 text-sm italic">
              "{victim.consequence}"
            </p>
          </div>
        )}

        {/* Glitch effect overlay for severe cases */}
        {(victim.impactLevel === 'catastrophic' || victim.impactLevel === 'severe') && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="glitch-effect opacity-20" />
          </div>
        )}
      </div>
    </div>
  );
}