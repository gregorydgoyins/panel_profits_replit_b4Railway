import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";

const houseThemedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2 transition-all duration-300 ease-out relative overflow-hidden house-theme-transition",
  {
    variants: {
      variant: {
        default: "house-themed-background house-themed-border house-themed-shadow",
        primary: "text-primary-foreground font-bold uppercase",
        action: "font-black transform hover:scale-105 shadow-xl",
        trading: "house-trading-bonus shadow-lg",
        heroic: "font-comic-display uppercase tracking-wide",
        mystical: "font-comic-thought italic",
        cosmic: "font-comic-action text-shadow-lg",
        investigation: "font-mono tracking-wider",
        elemental: "font-comic-speech rounded-lg",
        temporal: "font-mono border-dashed",
        spiritual: "font-comic-thought rounded-full",
        ghost: "bg-transparent border-2 border-current hover:bg-current/10",
        outline: "bg-transparent border-2 border-current hover:bg-current hover:text-background",
      },
      house: {
        heroes: "house-heroes-themed",
        wisdom: "house-wisdom-themed", 
        power: "house-power-themed",
        mystery: "house-mystery-themed",
        elements: "house-elements-themed",
        time: "house-time-themed",
        spirit: "house-spirit-themed",
      },
      size: {
        sm: "min-h-8 px-3 py-1 text-xs rounded-md",
        default: "min-h-10 px-4 py-2 text-sm rounded-md",
        lg: "min-h-12 px-6 py-3 text-base rounded-lg",
        xl: "min-h-14 px-8 py-4 text-lg rounded-lg",
        icon: "h-10 w-10 rounded-md",
        trading: "min-h-12 px-6 py-3 text-sm rounded-lg",
      },
      effect: {
        none: "",
        impact: "house-heroes-impact-burst",
        speed: "house-heroes-speed-lines",
        glow: "sacred-glow-moderate",
        pulse: "mystical-pulse",
        shimmer: "divine-shimmer",
        float: "ethereal-float",
        flow: "house-themed-flow",
        energy: "house-power-energy-surge",
        mist: "house-mystery-mist-reveal",
        ripple: "house-time-ripple",
        aura: "house-spirit-divine-aura",
      },
      intensity: {
        subtle: "opacity-90",
        normal: "opacity-100",
        intense: "opacity-100 shadow-lg",
        dramatic: "opacity-100 shadow-2xl scale-[1.02]",
      },
      tradingAction: {
        none: "",
        buy: "bg-green-600/90 border-green-500 text-green-50",
        sell: "bg-red-600/90 border-red-500 text-red-50", 
        hold: "bg-yellow-600/90 border-yellow-500 text-yellow-50",
        analyze: "bg-blue-600/90 border-blue-500 text-blue-50",
      },
    },
    defaultVariants: {
      variant: "default",
      house: "heroes",
      size: "default",
      effect: "none",
      intensity: "normal",
      tradingAction: "none",
    },
  }
);

export interface HouseThemedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof houseThemedButtonVariants> {
  asChild?: boolean;
  soundEffect?: string;
  houseOverride?: MythologicalHouse;
  tradingValue?: number;
  tradingChange?: number;
  isTrading?: boolean;
  showHouseEffects?: boolean;
  effectDuration?: number;
  onHouseAction?: (house: MythologicalHouse, action: string) => void;
  badge?: string | number;
  glowOnHover?: boolean;
}

// House-specific sound effects for authentic comic book experience
const HOUSE_SOUND_EFFECTS = {
  heroes: {
    default: 'POW!',
    action: 'BAM!',
    success: 'KAPOW!',
    trading: 'DING!',
  },
  wisdom: {
    default: 'CLICK',
    action: 'SNAP',
    success: 'EUREKA!',
    trading: 'CHIME',
  },
  power: {
    default: 'BOOM!',
    action: 'CRASH!',
    success: 'BLAST!',
    trading: 'ZAP!',
  },
  mystery: {
    default: 'WHOOSH',
    action: 'POOF!',
    success: 'SHIMMER',
    trading: 'WHISPER',
  },
  elements: {
    default: 'WHOMP',
    action: 'CRACK!',
    success: 'SPARK!',
    trading: 'FLOW',
  },
  time: {
    default: 'TICK',
    action: 'WHIRR',
    success: 'CHIME',
    trading: 'ECHO',
  },
  spirit: {
    default: 'GLOW',
    action: 'SHINE',
    success: 'RADIATE',
    trading: 'AURA',
  },
} as const;

const HouseThemedButton = React.forwardRef<HTMLButtonElement, HouseThemedButtonProps>(
  ({ 
    className, 
    variant, 
    house, 
    size, 
    effect,
    intensity,
    tradingAction,
    asChild = false, 
    soundEffect,
    houseOverride,
    tradingValue,
    tradingChange,
    isTrading = false,
    showHouseEffects = true,
    effectDuration = 1000,
    onHouseAction,
    badge,
    glowOnHover = false,
    onClick,
    children,
    disabled,
    ...props 
  }, ref) => {
    const { currentHouse, houseTheme, getHouseTheme } = useHouseTheme();
    const activeHouse = houseOverride || house || currentHouse;
    const activeTheme = getHouseTheme(activeHouse);
    
    const [showSoundEffect, setShowSoundEffect] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [tradingAnimation, setTradingAnimation] = React.useState(false);
    
    const Comp = asChild ? Slot : "button";

    // Get house-specific styling classes
    const getHouseClasses = (houseName: MythologicalHouse) => {
      const houseStyles = {
        heroes: {
          base: "font-comic-display uppercase tracking-wide bg-gradient-to-r from-red-600 to-blue-600 text-white border-2 border-black shadow-lg",
          active: "house-heroes-impact-burst shadow-2xl",
          font: "font-comic-display",
        },
        wisdom: {
          base: "font-mono tracking-wider bg-gradient-to-r from-slate-700 to-blue-800 text-blue-100 border-2 border-blue-400 shadow-lg",
          active: "house-wisdom-spotlight shadow-2xl",
          font: "font-mono",
        },
        power: {
          base: "font-comic-action text-shadow-lg bg-gradient-to-r from-purple-600 to-indigo-700 text-white border-2 border-purple-400 shadow-lg",
          active: "house-power-cosmic-explosion shadow-2xl",
          font: "font-comic-action",
        },
        mystery: {
          base: "font-comic-thought italic bg-gradient-to-r from-green-800 to-emerald-700 text-green-100 border-2 border-green-400 shadow-lg",
          active: "house-mystery-supernatural-glow shadow-2xl",
          font: "font-comic-thought",
        },
        elements: {
          base: "font-comic-speech bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-2 border-orange-400 shadow-lg",
          active: "house-elements-fire-flow shadow-2xl",
          font: "font-comic-speech",
        },
        time: {
          base: "font-mono border-dashed bg-gradient-to-r from-slate-600 to-yellow-700 text-yellow-100 border-2 border-yellow-400 shadow-lg",
          active: "house-time-ripple shadow-2xl",
          font: "font-mono",
        },
        spirit: {
          base: "font-comic-thought rounded-full bg-gradient-to-r from-cyan-600 to-teal-700 text-cyan-100 border-2 border-cyan-400 shadow-lg",
          active: "house-spirit-energy-flow shadow-2xl",
          font: "font-comic-thought",
        },
      };
      return houseStyles[houseName] || houseStyles.heroes;
    };

    // Get house-specific sound effect
    const getHouseSoundEffect = (houseName: MythologicalHouse, action: string = 'default') => {
      if (soundEffect) return soundEffect;
      const houseEffects = HOUSE_SOUND_EFFECTS[houseName];
      return houseEffects[action as keyof typeof houseEffects] || houseEffects.default;
    };

    // Get trading status styling
    const getTradingStatusClass = () => {
      if (!isTrading || tradingChange === undefined) return '';
      
      if (tradingChange > 5) return 'ring-2 ring-green-400 animate-pulse';
      if (tradingChange < -5) return 'ring-2 ring-red-400 animate-pulse';
      if (Math.abs(tradingChange) > 2) return 'ring-1 ring-yellow-400';
      return '';
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      
      // Trigger visual feedback
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);

      // Trigger sound effect animation
      if (showHouseEffects) {
        setShowSoundEffect(true);
        setTimeout(() => setShowSoundEffect(false), effectDuration);
      }

      // Trigger trading animation if applicable
      if (isTrading) {
        setTradingAnimation(true);
        setTimeout(() => setTradingAnimation(false), 800);
      }

      // Call house action handler
      onHouseAction?.(activeHouse, tradingAction || 'click');
      
      // Call original click handler
      onClick?.(e);
    };

    const houseStyles = getHouseClasses(activeHouse);
    const effectSoundText = getHouseSoundEffect(activeHouse, tradingAction || 'default');

    return (
      <div className="relative inline-block">
        <Comp
          ref={ref}
          className={cn(
            houseThemedButtonVariants({ 
              variant, 
              house: activeHouse, 
              size, 
              effect: showHouseEffects ? effect : 'none',
              intensity,
              tradingAction 
            }),
            // House-specific base styling
            houseStyles.base,
            // Active/pressed state
            isPressed && houseStyles.active,
            // Trading status indication
            getTradingStatusClass(),
            // Glow on hover
            glowOnHover && "hover:sacred-glow-moderate",
            // Trading animation
            tradingAnimation && "scale-110",
            className
          )}
          onClick={handleClick}
          disabled={disabled}
          data-testid={`house-themed-button-${activeHouse}`}
          style={{
            '--house-current-font': `var(--house-${activeHouse}-font-display)`,
            '--house-current-letter-spacing': `var(--house-${activeHouse}-letter-spacing)`,
            '--house-current-text-shadow': `var(--house-${activeHouse}-text-shadow)`,
          } as React.CSSProperties}
          {...props}
        >
          {/* House-specific visual effect background */}
          {showHouseEffects && (
            <div className={cn(
              "absolute inset-0 opacity-10 pointer-events-none",
              activeHouse === 'heroes' && "house-heroes-speed-lines",
              activeHouse === 'wisdom' && "house-wisdom-venetian-blinds",
              activeHouse === 'power' && "house-power-energy-surge",
              activeHouse === 'mystery' && "house-mystery-mist-reveal",
              activeHouse === 'elements' && "house-elements-fire-flow",
              activeHouse === 'time' && "house-time-ripple",
              activeHouse === 'spirit' && "house-spirit-divine-aura"
            )} />
          )}

          {/* Button content */}
          <span className="relative z-10 flex items-center gap-2">
            {children}
            
            {/* Trading value display */}
            {tradingValue !== undefined && (
              <span className="text-xs opacity-80">
                ${tradingValue.toFixed(0)}
              </span>
            )}
          </span>

          {/* Trading change indicator */}
          {tradingChange !== undefined && (
            <span className={cn(
              "absolute -top-1 -right-1 text-xs px-1 rounded-full",
              tradingChange >= 0 ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
            )}>
              {tradingChange >= 0 ? '+' : ''}{tradingChange.toFixed(1)}%
            </span>
          )}

          {/* Custom badge */}
          {badge && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </Comp>
        
        {/* Sound Effect Overlay */}
        {showSoundEffect && effectSoundText && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
            <span className={cn(
              "font-comic-action text-lg animate-bounce",
              activeHouse === 'heroes' && "text-red-500 text-shadow-lg",
              activeHouse === 'wisdom' && "text-blue-400 font-mono",
              activeHouse === 'power' && "text-purple-400 text-shadow-xl",
              activeHouse === 'mystery' && "text-green-400 font-gothic",
              activeHouse === 'elements' && "text-orange-400",
              activeHouse === 'time' && "text-yellow-400 font-mono",
              activeHouse === 'spirit' && "text-cyan-400"
            )}>
              {effectSoundText}
            </span>
          </div>
        )}

        {/* House aura effect on hover */}
        {glowOnHover && (
          <div className={cn(
            "absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-inherit pointer-events-none",
            `house-aura-${activeHouse}`
          )} />
        )}
      </div>
    );
  }
);

HouseThemedButton.displayName = "HouseThemedButton";

// Convenience buttons for house-specific trading actions
export function HouseTradingButton({ 
  children, 
  house, 
  tradingAction = "buy",
  ...props 
}: Omit<HouseThemedButtonProps, 'variant'> & { 
  house?: MythologicalHouse,
  tradingAction?: 'buy' | 'sell' | 'hold' | 'analyze'
}) {
  return (
    <HouseThemedButton 
      variant="trading" 
      house={house}
      tradingAction={tradingAction}
      effect="glow"
      showHouseEffects={true}
      data-testid={`house-trading-button-${tradingAction}`}
      {...props}
    >
      {children || tradingAction.toUpperCase()}
    </HouseThemedButton>
  );
}

export function HouseActionButton({ 
  children, 
  house,
  action = "default",
  ...props 
}: Omit<HouseThemedButtonProps, 'variant'> & { 
  house?: MythologicalHouse,
  action?: string
}) {
  return (
    <HouseThemedButton 
      variant="action" 
      house={house}
      effect="impact"
      intensity="dramatic"
      showHouseEffects={true}
      onHouseAction={(house, action) => console.log(`House ${house} performed ${action}`)}
      {...props}
    >
      {children}
    </HouseThemedButton>
  );
}

export function HouseHeroButton({ 
  children, 
  house = "heroes",
  ...props 
}: Omit<HouseThemedButtonProps, 'variant' | 'house'> & { 
  house?: MythologicalHouse
}) {
  return (
    <HouseThemedButton 
      variant="heroic" 
      house={house}
      effect="speed"
      intensity="dramatic"
      glowOnHover={true}
      {...props}
    >
      {children}
    </HouseThemedButton>
  );
}

export function HouseMysticalButton({ 
  children, 
  house = "mystery",
  ...props 
}: Omit<HouseThemedButtonProps, 'variant' | 'house'> & { 
  house?: MythologicalHouse
}) {
  return (
    <HouseThemedButton 
      variant="mystical" 
      house={house}
      effect="mist"
      intensity="intense"
      glowOnHover={true}
      {...props}
    >
      {children}
    </HouseThemedButton>
  );
}

export { HouseThemedButton, houseThemedButtonVariants };