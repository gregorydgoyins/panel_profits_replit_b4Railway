import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const soundEffectVariants = cva(
  "font-comic-action select-none pointer-events-none",
  {
    variants: {
      variant: {
        impact: "comic-sound-primary text-shadow-strong",
        secondary: "comic-sound-secondary text-shadow-medium",
        subtle: "text-lg text-yellow-500 text-shadow-light",
        dramatic: "text-6xl text-red-600 text-shadow-heavy font-comic-horror",
      },
      intensity: {
        low: "opacity-70 scale-90",
        normal: "opacity-100 scale-100",
        high: "opacity-100 scale-110 animate-pulse",
        extreme: "opacity-100 scale-125 animate-bounce",
      },
      position: {
        center: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "top-left": "absolute top-2 left-2",
        "top-right": "absolute top-2 right-2",
        "bottom-left": "absolute bottom-2 left-2",
        "bottom-right": "absolute bottom-2 right-2",
        relative: "relative",
      },
    },
    defaultVariants: {
      variant: "impact",
      intensity: "normal",
      position: "center",
    },
  }
);

// Predefined sound effects for different trading scenarios
const tradingSoundEffects = {
  // Market Events
  marketCrash: "CRASH!",
  marketSurge: "BOOM!",
  volatility: "ZAP!",
  
  // Trading Actions  
  bigGain: "POW!",
  bigLoss: "WHAM!",
  fastMove: "WHOOSH!",
  breakout: "SNAP!",
  
  // Alerts & Notifications
  priceAlert: "DING!",
  newsBreaking: "FLASH!",
  levelUp: "DING DING!",
  achievement: "TADA!",
  
  // Error States
  error: "ERR!",
  warning: "BZZT!",
  blocked: "CLANK!",
  
  // Success States  
  success: "DING!",
  completed: "DONE!",
  victory: "YES!",
} as const;

export type SoundEffectType = keyof typeof tradingSoundEffects;

export interface ComicSoundEffectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof soundEffectVariants> {
  sound?: SoundEffectType | string;
  trigger?: boolean;
  duration?: number;
  onComplete?: () => void;
}

const ComicSoundEffect = React.forwardRef<HTMLDivElement, ComicSoundEffectProps>(
  ({ 
    className, 
    variant, 
    intensity, 
    position, 
    sound = "POW!",
    trigger = false,
    duration = 2000,
    onComplete,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    
    const soundText = sound in tradingSoundEffects 
      ? tradingSoundEffects[sound as SoundEffectType] 
      : sound;

    React.useEffect(() => {
      if (trigger) {
        setIsVisible(true);
        setIsAnimating(true);
        
        const timer = setTimeout(() => {
          setIsAnimating(false);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 300); // Fade out time
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [trigger, duration, onComplete]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          soundEffectVariants({ variant, intensity, position }),
          isAnimating ? "animate-comic-impact" : "animate-fade-out",
          "z-50 transform transition-all duration-300",
          className
        )}
        data-testid={`sound-effect-${sound}`}
        {...props}
      >
        {children || soundText}
      </div>
    );
  }
);

ComicSoundEffect.displayName = "ComicSoundEffect";

// Convenience hook for triggering sound effects
export function useComicSoundEffect() {
  const [triggers, setTriggers] = React.useState<Record<string, boolean>>({});

  const triggerEffect = React.useCallback((effectId: string) => {
    setTriggers(prev => ({ ...prev, [effectId]: true }));
    
    // Reset trigger after a brief delay
    setTimeout(() => {
      setTriggers(prev => ({ ...prev, [effectId]: false }));
    }, 100);
  }, []);

  return { triggers, triggerEffect };
}

// Convenience component for market-specific sound effects
export function MarketSoundEffect({ 
  priceChange, 
  volume, 
  className 
}: { 
  priceChange: number; 
  volume?: number; 
  className?: string; 
}) {
  const getSoundForPriceChange = (change: number): SoundEffectType => {
    const absChange = Math.abs(change);
    
    if (absChange > 10) {
      return change > 0 ? "marketSurge" : "marketCrash";
    } else if (absChange > 5) {
      return change > 0 ? "bigGain" : "bigLoss";
    } else if (absChange > 2) {
      return change > 0 ? "success" : "warning";
    }
    
    return "fastMove";
  };

  const getIntensity = (change: number): "low" | "normal" | "high" | "extreme" => {
    const absChange = Math.abs(change);
    if (absChange > 15) return "extreme";
    if (absChange > 10) return "high";
    if (absChange > 5) return "normal";
    return "low";
  };

  return (
    <ComicSoundEffect
      sound={getSoundForPriceChange(priceChange)}
      variant="impact"
      intensity={getIntensity(priceChange)}
      trigger={true}
      className={className}
    />
  );
}

export { ComicSoundEffect, soundEffectVariants, tradingSoundEffects };