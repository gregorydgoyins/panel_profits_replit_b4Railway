import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";
import { HOUSE_EFFECT_LIBRARIES, type SoundEffect } from "@/lib/house-visual-effects";

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

// House-specific sound effect mappings
const HOUSE_SOUND_MAPPINGS: Record<MythologicalHouse, Record<string, string>> = {
  heroes: {
    click: 'CLICK',
    success: 'POW!',
    error: 'WHAM!',
    victory: 'KAPOW!',
    action: 'BAM!',
  },
  wisdom: {
    click: 'CLICK',
    success: 'AHA!',
    error: 'HMPH',
    discovery: 'EUREKA!',
    investigate: 'CLACK',
  },
  power: {
    click: 'ZAP!',
    success: 'BLAST!',
    error: 'CRASH!',
    energy: 'BOOM!',
    surge: 'WOOSH',
  },
  mystery: {
    click: 'whisper...',
    success: 'REVEAL!',
    error: 'POOF!',
    mystical: 'SHIMMER',
    supernatural: 'WHOOSH',
  },
  elements: {
    click: 'FLOW',
    success: 'CRACKLE',
    error: 'RUMBLE',
    fire: 'CRACKLE',
    water: 'SPLASH',
  },
  time: {
    click: 'TICK',
    success: 'CHIME',
    error: 'VWORP',
    rewind: 'WHIRR',
    paradox: 'VWORP',
  },
  spirit: {
    click: 'GLOW',
    success: 'ENLIGHTEN',
    error: 'AURA',
    divine: 'RADIATE',
    transcendent: 'SHINE',
  },
};

export interface ComicSoundEffectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof soundEffectVariants> {
  sound?: SoundEffectType | string;
  trigger?: boolean;
  duration?: number;
  onComplete?: () => void;
  autoPlay?: boolean;
}

const ComicSoundEffect = React.forwardRef<HTMLDivElement, ComicSoundEffectProps>(
  ({
    className,
    variant,
    intensity,
    position,
    sound,
    trigger = false,
    duration = 1000,
    house,
    houseOverride,
    useHouseSound = true,
    customIntensity = 'medium',
    onComplete,
    autoPlay = false,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [currentSound, setCurrentSound] = React.useState<string>('');
    const { currentHouse } = useHouseTheme();
    const activeHouse = houseOverride || house || currentHouse;
    
    // Get house-specific sound effect
    const getHouseSoundEffect = (soundKey: string): string => {
      if (!useHouseSound) return soundKey;
      
      const houseLibrary = HOUSE_EFFECT_LIBRARIES[activeHouse];
      const houseSoundMappings = HOUSE_SOUND_MAPPINGS[activeHouse];
      
      // Check if sound exists in house sound mappings
      if (houseSoundMappings[soundKey]) {
        return houseSoundMappings[soundKey];
      }
      
      // Check if sound exists in house library
      if (houseLibrary.soundEffects[soundKey]) {
        return houseLibrary.soundEffects[soundKey].visual;
      }
      
      // Fallback to trading sound effects
      if (tradingSoundEffects[soundKey as SoundEffectType]) {
        return tradingSoundEffects[soundKey as SoundEffectType];
      }
      
      return soundKey;
    };
    
    // Get house-specific styling
    const getHouseStyling = () => {
      const houseStyles = {
        heroes: 'text-red-500 text-shadow-strong font-comic-action',
        wisdom: 'text-blue-500 text-shadow-medium font-mono',
        power: 'text-purple-500 text-shadow-heavy font-comic-action',
        mystery: 'text-green-500 text-shadow-medium font-comic-thought italic',
        elements: 'text-orange-500 text-shadow-medium font-comic-speech',
        time: 'text-yellow-500 text-shadow-light font-mono tracking-wider',
        spirit: 'text-cyan-500 text-shadow-medium font-comic-thought italic',
      };
      return houseStyles[activeHouse] || 'text-yellow-500 text-shadow-medium';
    };
    
    // Trigger sound effect
    React.useEffect(() => {
      if (trigger || autoPlay) {
        const soundText = sound ? getHouseSoundEffect(sound) : 'POW!';
        setCurrentSound(soundText);
        setIsVisible(true);
        
        const timer = setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [trigger, autoPlay, sound, duration, activeHouse, useHouseSound]);
    
    if (!isVisible) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          soundEffectVariants({ variant, intensity, position }),
          getHouseStyling(),
          useHouseSound && `house-${activeHouse}`,
          className
        )}
        data-testid={`comic-sound-effect-${activeHouse}`}
        {...props}
      >
        {currentSound}
      </div>
    );
  }
);

ComicSoundEffect.displayName = 'ComicSoundEffect';

// House-specific sound effect presets
export function HeroesSoundEffect({ children, ...props }: Omit<ComicSoundEffectProps, 'house'>) {
  return (
    <ComicSoundEffect 
      house="heroes" 
      variant="impact" 
      intensity="high" 
      useHouseSound={true}
      {...props}
    >
      {children}
    </ComicSoundEffect>
  );
}

export function WisdomSoundEffect({ children, ...props }: Omit<ComicSoundEffectProps, 'house'>) {
  return (
    <ComicSoundEffect 
      house="wisdom" 
      variant="secondary" 
      intensity="normal" 
      useHouseSound={true}
      {...props}
    >
      {children}
    </ComicSoundEffect>
  );
}

export function PowerSoundEffect({ children, ...props }: Omit<ComicSoundEffectProps, 'house'>) {
  return (
    <ComicSoundEffect 
      house="power" 
      variant="dramatic" 
      intensity="extreme" 
      useHouseSound={true}
      {...props}
    >
      {children}
    </ComicSoundEffect>
  );
}

export { ComicSoundEffect, soundEffectVariants, tradingSoundEffects, HOUSE_SOUND_MAPPINGS };
  house?: MythologicalHouse;
  houseOverride?: MythologicalHouse;
  useHouseSound?: boolean;
  customIntensity?: 'low' | 'medium' | 'high';
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