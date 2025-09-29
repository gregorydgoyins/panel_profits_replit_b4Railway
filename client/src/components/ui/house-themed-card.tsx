import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";

const houseThemedCardVariants = cva(
  "relative overflow-hidden transition-all duration-500 ease-out house-theme-transition",
  {
    variants: {
      variant: {
        default: "rounded-xl border shadow-sm",
        trading: "house-trading-bonus rounded-lg border-2 shadow-lg",
        asset: "rounded-lg border-2 shadow-md hover-elevate",
        splash: "rounded-2xl border-4 shadow-2xl min-h-48",
        minimal: "rounded-lg border shadow-sm",
        cosmic: "rounded-xl border-0 shadow-2xl overflow-hidden",
        noir: "rounded-sm border shadow-lg",
        mystical: "rounded-lg border shadow-xl",
        elemental: "rounded-xl border-2 shadow-lg",
        temporal: "rounded-full border-2 shadow-lg aspect-square",
        ethereal: "rounded-2xl border-0 shadow-2xl overflow-hidden",
      },
      house: {
        heroes: "house-heroes comic-panel",
        wisdom: "house-wisdom comic-panel",
        power: "house-power comic-panel",
        mystery: "house-mystery comic-panel", 
        elements: "house-elements comic-panel",
        time: "house-time comic-panel",
        spirit: "house-spirit comic-panel",
      },
      size: {
        sm: "min-h-24",
        default: "min-h-32",
        lg: "min-h-48",
        xl: "min-h-64",
        trading: "min-h-40",
        asset: "min-h-56",
      },
      intensity: {
        subtle: "opacity-90",
        normal: "opacity-100",
        intense: "opacity-100 shadow-lg",
        dramatic: "opacity-100 shadow-2xl scale-[1.01]",
      },
      animation: {
        none: "",
        pulse: "mystical-pulse",
        glow: "sacred-glow-moderate",
        float: "ethereal-float",
        shimmer: "divine-shimmer",
        flow: "house-themed-flow",
      },
    },
    defaultVariants: {
      variant: "default",
      house: "heroes",
      size: "default",
      intensity: "normal",
      animation: "none",
    },
  }
);

export interface HouseThemedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof houseThemedCardVariants> {
  houseOverride?: MythologicalHouse;
  tradingValue?: number;
  tradingChange?: number;
  isTrading?: boolean;
  showHouseEffects?: boolean;
  effectIntensity?: 'low' | 'medium' | 'high';
  badge?: string | number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  assetType?: string;
  onCardClick?: (house: MythologicalHouse) => void;
  glowOnHover?: boolean;
}

const HouseThemedCard = React.forwardRef<HTMLDivElement, HouseThemedCardProps>(
  ({ 
    className, 
    variant, 
    house, 
    size, 
    intensity,
    animation,
    houseOverride,
    tradingValue,
    tradingChange,
    isTrading = false,
    showHouseEffects = true,
    effectIntensity = 'medium',
    badge,
    rarity,
    assetType,
    onCardClick,
    glowOnHover = false,
    children,
    ...props 
  }, ref) => {
    const { currentHouse, houseTheme, getHouseTheme } = useHouseTheme();
    const activeHouse = houseOverride || house || currentHouse;
    const activeTheme = getHouseTheme(activeHouse);

    // House-specific card styling based on comic art traditions
    const getHouseCardClasses = (houseName: MythologicalHouse) => {
      const cardStyles = {
        heroes: {
          base: "bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50 border-black/20",
          border: "border-2 border-black",
          shadow: "shadow-lg drop-shadow-lg",
          effects: "house-heroes-speed-lines",
        },
        wisdom: {
          base: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-blue-400/30",
          border: "border-2 border-blue-400/50",
          shadow: "shadow-2xl drop-shadow-xl",
          effects: "house-wisdom-venetian-blinds",
        },
        power: {
          base: "bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border-purple-400/30",
          border: "border-0",
          shadow: "shadow-2xl drop-shadow-2xl",
          effects: "house-power-energy-surge",
        },
        mystery: {
          base: "bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 border-green-400/30",
          border: "border border-green-400/40",
          shadow: "shadow-xl drop-shadow-xl",
          effects: "house-mystery-mist-reveal",
        },
        elements: {
          base: "bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-100 border-orange-400/40",
          border: "border-2 border-orange-400/60",
          shadow: "shadow-lg drop-shadow-lg",
          effects: "house-elements-fire-flow",
        },
        time: {
          base: "bg-gradient-to-br from-slate-800 via-yellow-900 to-slate-700 border-yellow-400/40",
          border: "border-2 border-yellow-400/60 border-dashed",
          shadow: "shadow-xl drop-shadow-xl",
          effects: "house-time-ripple",
        },
        spirit: {
          base: "bg-gradient-to-br from-cyan-900 via-teal-900 to-cyan-800 border-cyan-400/30",
          border: "border-0",
          shadow: "shadow-2xl drop-shadow-2xl",
          effects: "house-spirit-divine-aura",
        },
      };
      return cardStyles[houseName] || cardStyles.heroes;
    };

    // Get rarity-specific styling
    const getRarityClasses = (rarity?: string) => {
      const rarityStyles = {
        common: "ring-1 ring-gray-300",
        uncommon: "ring-2 ring-green-400",
        rare: "ring-2 ring-blue-400 animate-pulse",
        epic: "ring-2 ring-purple-400 animate-pulse shadow-purple-400/50",
        legendary: "ring-4 ring-yellow-400 animate-pulse shadow-yellow-400/50 shadow-2xl",
      };
      return rarity ? rarityStyles[rarity as keyof typeof rarityStyles] || '' : '';
    };

    // Trading status indicators
    const getTradingIndicator = () => {
      if (!isTrading || tradingChange === undefined) return null;
      
      const isPositive = tradingChange >= 0;
      const intensityClass = Math.abs(tradingChange) > 5 ? 'animate-pulse' : '';
      
      return (
        <div className={cn(
          "absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold z-20",
          isPositive ? "bg-green-500/90 text-green-50 border border-green-400" : "bg-red-500/90 text-red-50 border border-red-400",
          intensityClass
        )}>
          {isPositive ? '+' : ''}{tradingChange.toFixed(2)}%
        </div>
      );
    };

    const handleClick = () => {
      if (onCardClick) {
        onCardClick(activeHouse);
      }
    };

    const houseStyles = getHouseCardClasses(activeHouse);

    return (
      <div
        ref={ref}
        className={cn(
          houseThemedCardVariants({ 
            variant, 
            house: activeHouse, 
            size, 
            intensity,
            animation: showHouseEffects ? animation : 'none'
          }),
          // House-specific styling
          houseStyles.base,
          houseStyles.border,
          houseStyles.shadow,
          // Rarity styling
          getRarityClasses(rarity),
          // Interactive states
          onCardClick && "cursor-pointer hover-elevate",
          glowOnHover && "hover:sacred-glow-moderate",
          isTrading && "house-trading-bonus active",
          className
        )}
        onClick={handleClick}
        data-testid={`house-themed-card-${activeHouse}`}
        style={{
          '--house-current-background': `var(--house-${activeHouse}-card)`,
          '--house-current-border': `var(--house-${activeHouse}-border)`,
          '--house-current-shadow': `var(--house-${activeHouse}-shadow)`,
        } as React.CSSProperties}
        {...props}
      >
        {/* House-specific visual effect overlay */}
        {showHouseEffects && (
          <div className={cn(
            "absolute inset-0 pointer-events-none",
            effectIntensity === 'high' ? "opacity-20" : effectIntensity === 'medium' ? "opacity-10" : "opacity-5",
            houseStyles.effects
          )} />
        )}

        {/* Trading Value Indicator */}
        {getTradingIndicator()}

        {/* House Badge */}
        {badge && (
          <div className={cn(
            "absolute top-2 left-2 house-achievement-badge text-xs z-20",
            activeHouse
          )}>
            {badge}
          </div>
        )}

        {/* Asset Type Indicator */}
        {assetType && (
          <div className={cn(
            "absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium opacity-80 z-20",
            activeHouse === 'heroes' && "bg-red-500/20 text-red-200 border border-red-400/40",
            activeHouse === 'wisdom' && "bg-blue-500/20 text-blue-200 border border-blue-400/40",
            activeHouse === 'power' && "bg-purple-500/20 text-purple-200 border border-purple-400/40",
            activeHouse === 'mystery' && "bg-green-500/20 text-green-200 border border-green-400/40",
            activeHouse === 'elements' && "bg-orange-500/20 text-orange-800 border border-orange-400/40",
            activeHouse === 'time' && "bg-yellow-500/20 text-yellow-200 border border-yellow-400/40",
            activeHouse === 'spirit' && "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
          )}>
            {assetType}
          </div>
        )}

        {/* Trading Value Display */}
        {tradingValue !== undefined && (
          <div className={cn(
            "absolute bottom-2 right-2 px-2 py-1 rounded text-sm font-bold z-20",
            "bg-background/80 border text-foreground"
          )}>
            ${tradingValue.toFixed(0)}
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>

        {/* House-specific border decoration */}
        <div className={cn(
          "absolute inset-0 pointer-events-none rounded-inherit",
          houseStyles.border
        )} />
      </div>
    );
  }
);

HouseThemedCard.displayName = "HouseThemedCard";

// House-themed card header component
const HouseThemedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    house?: MythologicalHouse;
    showHouseIcon?: boolean;
  }
>(({ className, house, showHouseIcon = true, children, ...props }, ref) => {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const activeHouse = house || currentHouse;
  const activeTheme = getHouseTheme(activeHouse);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6 relative z-10",
        // House-specific typography
        activeHouse === 'heroes' && "font-comic-display",
        activeHouse === 'wisdom' && "font-mono",
        activeHouse === 'power' && "font-comic-action",
        activeHouse === 'mystery' && "font-comic-thought",
        activeHouse === 'elements' && "font-comic-speech",
        activeHouse === 'time' && "font-mono",
        activeHouse === 'spirit' && "font-comic-thought",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
HouseThemedCardHeader.displayName = "HouseThemedCardHeader";

// House-themed card title component  
const HouseThemedCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    house?: MythologicalHouse;
  }
>(({ className, house, children, ...props }, ref) => {
  const { currentHouse } = useHouseTheme();
  const activeHouse = house || currentHouse;

  return (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight house-themed-text",
        // House-specific styling
        activeHouse === 'heroes' && "text-shadow-lg uppercase",
        activeHouse === 'wisdom' && "font-mono tracking-wider",
        activeHouse === 'power' && "text-shadow-xl",
        activeHouse === 'mystery' && "italic",
        activeHouse === 'elements' && "",
        activeHouse === 'time' && "font-mono tracking-widest",
        activeHouse === 'spirit' && "italic",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
HouseThemedCardTitle.displayName = "HouseThemedCardTitle";

// House-themed card description component
const HouseThemedCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    house?: MythologicalHouse;
  }
>(({ className, house, children, ...props }, ref) => {
  const { currentHouse } = useHouseTheme();
  const activeHouse = house || currentHouse;

  return (
    <div
      ref={ref}
      className={cn(
        "text-sm house-themed-text",
        // House-specific text coloring
        activeHouse === 'heroes' && "text-slate-600 dark:text-slate-300",
        activeHouse === 'wisdom' && "text-blue-600 dark:text-blue-300",
        activeHouse === 'power' && "text-purple-600 dark:text-purple-300",
        activeHouse === 'mystery' && "text-green-600 dark:text-green-300",
        activeHouse === 'elements' && "text-orange-600 dark:text-orange-300",
        activeHouse === 'time' && "text-yellow-600 dark:text-yellow-300",
        activeHouse === 'spirit' && "text-cyan-600 dark:text-cyan-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
HouseThemedCardDescription.displayName = "HouseThemedCardDescription";

// House-themed card content component
const HouseThemedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    house?: MythologicalHouse;
  }
>(({ className, house, children, ...props }, ref) => {
  const { currentHouse } = useHouseTheme();
  const activeHouse = house || currentHouse;

  return (
    <div 
      ref={ref} 
      className={cn(
        "p-6 pt-0 relative z-10 house-themed-text",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
});
HouseThemedCardContent.displayName = "HouseThemedCardContent";

// House-themed card footer component
const HouseThemedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    house?: MythologicalHouse;
  }
>(({ className, house, children, ...props }, ref) => {
  const { currentHouse } = useHouseTheme();
  const activeHouse = house || currentHouse;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0 relative z-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
HouseThemedCardFooter.displayName = "HouseThemedCardFooter";

export {
  HouseThemedCard,
  HouseThemedCardHeader,
  HouseThemedCardFooter,
  HouseThemedCardTitle,
  HouseThemedCardDescription,
  HouseThemedCardContent,
  houseThemedCardVariants,
};