import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";

const houseThemedPanelVariants = cva(
  "relative transition-all duration-500 ease-out overflow-hidden house-theme-transition",
  {
    variants: {
      variant: {
        default: "comic-panel",
        splash: "min-h-64 shadow-2xl",
        action: "speed-lines shadow-lg",
        quiet: "shadow-sm opacity-90",
        flashback: "border-dashed opacity-80",
        trading: "house-trading-bonus",
        cosmic: "house-power-cosmic-explosion",
        noir: "house-wisdom-venetian-blinds",
        mystical: "house-mystery-mist-reveal",
        elemental: "house-elements-fire-flow",
        temporal: "house-time-ripple",
        ethereal: "house-spirit-divine-aura",
      },
      house: {
        heroes: "comic-panel house-heroes house-heroes-speed-lines",
        wisdom: "comic-panel house-wisdom house-wisdom-venetian-blinds",
        power: "comic-panel house-power house-power-energy-surge",
        mystery: "comic-panel house-mystery house-mystery-mist-reveal",
        elements: "comic-panel house-elements house-elements-fire-flow",
        time: "comic-panel house-time house-time-ripple",
        spirit: "comic-panel house-spirit house-spirit-divine-aura",
      },
      shape: {
        rectangular: "", // Applied via CSS based on house
        circular: "rounded-full aspect-square",
        diamond: "rotate-45",
        hexagon: "clip-path-hexagon",
        star: "clip-path-star",
        explosion: "clip-path-explosion",
        jagged: "clip-path-jagged",
        wavy: "clip-path-wavy",
      },
      size: {
        sm: "min-h-24 p-3 text-sm",
        default: "min-h-32 p-4",
        lg: "min-h-48 p-6 text-lg",
        splash: "min-h-64 p-8 text-xl",
        trading: "min-h-40 p-5",
      },
      intensity: {
        subtle: "opacity-80",
        normal: "opacity-100",
        intense: "opacity-100 scale-[1.02]",
        dramatic: "opacity-100 scale-105 shadow-2xl",
      },
      animation: {
        none: "",
        pulse: "mystical-pulse",
        shimmer: "divine-shimmer",
        float: "ethereal-float",
        glow: "sacred-glow-moderate",
        flow: "house-themed-flow",
      },
    },
    defaultVariants: {
      variant: "default",
      house: "heroes",
      shape: "rectangular",
      size: "default",
      intensity: "normal",
      animation: "none",
    },
  }
);

export interface HouseThemedPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof houseThemedPanelVariants> {
  panelNumber?: number;
  isActive?: boolean;
  isTrading?: boolean;
  soundEffect?: string;
  narrativeText?: string;
  houseOverride?: MythologicalHouse;
  tradingValue?: number;
  tradingChange?: number;
  showHouseEffects?: boolean;
  effectIntensity?: 'low' | 'medium' | 'high';
  onPanelClick?: (house: MythologicalHouse) => void;
}

const HouseThemedPanel = React.forwardRef<HTMLDivElement, HouseThemedPanelProps>(
  ({ 
    className, 
    variant, 
    house, 
    shape, 
    size, 
    intensity,
    animation,
    panelNumber, 
    isActive = false, 
    isTrading = false,
    soundEffect,
    narrativeText,
    houseOverride,
    tradingValue,
    tradingChange,
    showHouseEffects = true,
    effectIntensity = 'medium',
    onPanelClick,
    children, 
    ...props 
  }, ref) => {
    const { currentHouse, houseTheme, getHouseTheme } = useHouseTheme();
    const activeHouse = houseOverride || house || currentHouse;
    const activeTheme = getHouseTheme(activeHouse);
    
    // House-specific effect classes based on comic art style
    const getHouseEffectClasses = (houseName: MythologicalHouse) => {
      const effectMap = {
        heroes: showHouseEffects ? 'house-heroes-impact-burst' : '',
        wisdom: showHouseEffects ? 'house-wisdom-spotlight' : '',
        power: showHouseEffects ? 'house-power-cosmic-explosion' : '',
        mystery: showHouseEffects ? 'house-mystery-supernatural-glow' : '',
        elements: getElementalEffect(),
        time: showHouseEffects ? 'house-time-paradox' : '',
        spirit: showHouseEffects ? 'house-spirit-energy-flow' : ''
      };
      return effectMap[houseName] || '';
    };

    // Elemental houses cycle through different element effects
    const getElementalEffect = () => {
      if (!showHouseEffects) return '';
      const effects = ['house-elements-fire-flow', 'house-elements-water-flow', 'house-elements-earth-flow', 'house-elements-air-flow'];
      return effects[Math.floor(Date.now() / 3000) % effects.length];
    };

    // House-specific shape based on art style
    const getHouseShape = (houseName: MythologicalHouse) => {
      if (shape && shape !== 'rectangular') return shape;
      
      const shapeMap = {
        heroes: 'rectangular', // Classic four-color comic panels
        wisdom: 'rectangular', // Noir investigation panels
        power: shape === 'splash' ? 'rectangular' : 'rectangular', // Cosmic splash pages can be borderless
        mystery: 'jagged', // Supernatural distorted panels
        elements: 'wavy', // Natural flowing borders
        time: 'circular', // Clock-face layouts
        spirit: 'hexagon' // Ethereal energy frames
      };
      return shapeMap[houseName] || 'rectangular';
    };

    // Trading indicator colors
    const getTradingIndicator = () => {
      if (!isTrading || tradingChange === undefined) return null;
      
      const isPositive = tradingChange >= 0;
      const intensityClass = Math.abs(tradingChange) > 5 ? 'intense' : 'normal';
      
      return (
        <div className={cn(
          "absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold",
          isPositive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300",
          intensityClass === 'intense' && "animate-pulse"
        )}>
          {isPositive ? '+' : ''}{tradingChange.toFixed(2)}%
        </div>
      );
    };

    // House-specific font styling
    const getHouseFontClass = (houseName: MythologicalHouse) => {
      const fontMap = {
        heroes: 'font-comic-display', // Bold block letters
        wisdom: 'font-comic-narrative', // Investigation file styling
        power: 'font-comic-action', // Cosmic energy fonts
        mystery: 'font-comic-thought', // Gothic mystical fonts
        elements: 'font-comic-speech', // Natural element fonts
        time: 'font-mono', // Temporal/chronometer fonts
        spirit: 'font-comic-thought' // Transcendent fonts
      };
      return fontMap[houseName] || 'font-comic-display';
    };

    const handleClick = () => {
      if (onPanelClick) {
        onPanelClick(activeHouse);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          houseThemedPanelVariants({ 
            variant, 
            house: activeHouse, 
            shape: getHouseShape(activeHouse), 
            size, 
            intensity,
            animation: showHouseEffects ? animation : 'none'
          }),
          getHouseEffectClasses(activeHouse),
          getHouseFontClass(activeHouse),
          isActive && "ring-2 ring-primary shadow-2xl scale-105",
          isTrading && "house-trading-bonus active",
          effectIntensity === 'high' && "house-themed-shadow",
          onPanelClick && "cursor-pointer hover-elevate",
          className
        )}
        data-testid={`house-themed-panel-${activeHouse}-${panelNumber || 'default'}`}
        onClick={handleClick}
        style={{
          '--house-current-font': `var(--house-${activeHouse}-font-display)`,
          '--house-current-letter-spacing': `var(--house-${activeHouse}-letter-spacing)`,
          '--house-current-text-shadow': `var(--house-${activeHouse}-text-shadow)`,
          '--house-current-border-width': `var(--house-${activeHouse}-panel-border)`,
          '--house-current-border-radius': `var(--house-${activeHouse}-panel-radius)`,
          '--house-current-shadow': `var(--house-${activeHouse}-shadow)`,
          '--house-current-background': `var(--house-${activeHouse}-card)`,
        } as React.CSSProperties}
        {...props}
      >
        {/* Panel Number Indicator with House Theme */}
        {panelNumber && (
          <div className={cn(
            "absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 border-2",
            `bg-${activeTheme.primaryColor} text-${activeTheme.primaryColor}-foreground border-${activeTheme.primaryColor}-border`
          )}>
            {panelNumber}
          </div>
        )}

        {/* Trading Indicator */}
        {getTradingIndicator()}

        {/* House-Specific Sound Effect Overlay */}
        {soundEffect && (
          <div className={cn(
            "absolute top-2 right-2 transform -rotate-12 z-20 house-themed-text",
            activeHouse === 'heroes' && "comic-sound-primary",
            activeHouse === 'wisdom' && "text-blue-300 font-mono",
            activeHouse === 'power' && "comic-sound-primary text-purple-300",
            activeHouse === 'mystery' && "text-green-300 font-gothic",
            activeHouse === 'elements' && "text-orange-300",
            activeHouse === 'time' && "text-yellow-300 font-mono",
            activeHouse === 'spirit' && "text-cyan-300"
          )}>
            {soundEffect}
          </div>
        )}

        {/* House Theme Visual Effect Overlay */}
        {showHouseEffects && (
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-20",
            activeHouse === 'heroes' && "house-heroes-speed-lines",
            activeHouse === 'wisdom' && "house-wisdom-venetian-blinds",
            activeHouse === 'power' && "house-power-energy-surge",
            activeHouse === 'mystery' && "house-mystery-mist-reveal",
            activeHouse === 'elements' && getElementalEffect(),
            activeHouse === 'time' && "house-time-ripple",
            activeHouse === 'spirit' && "house-spirit-divine-aura"
          )} />
        )}

        {/* Panel Content with House Theming */}
        <div className="relative h-full w-full flex flex-col z-10">
          <div className="flex-1 house-themed-text">
            {children}
          </div>
          
          {/* House-Themed Narrative Caption */}
          {narrativeText && (
            <div className={cn(
              "mt-auto p-2 rounded text-xs house-themed-text",
              activeHouse === 'heroes' && "caption-box bg-yellow-100 border-yellow-600 text-yellow-900",
              activeHouse === 'wisdom' && "bg-blue-900/80 border border-blue-400 text-blue-100",
              activeHouse === 'power' && "bg-purple-900/80 border border-purple-400 text-purple-100",
              activeHouse === 'mystery' && "bg-green-900/80 border border-green-400 text-green-100",
              activeHouse === 'elements' && "bg-orange-100 border-orange-600 text-orange-900",
              activeHouse === 'time' && "bg-slate-800 border border-yellow-400 text-yellow-100",
              activeHouse === 'spirit' && "bg-cyan-900/80 border border-cyan-400 text-cyan-100"
            )}>
              {narrativeText}
            </div>
          )}

          {/* House Achievement Badge */}
          {tradingValue !== undefined && (
            <div className={cn(
              "absolute bottom-2 right-2 house-achievement-badge text-xs",
              activeHouse
            )}>
              ${tradingValue.toFixed(0)}
            </div>
          )}
        </div>

        {/* House-Specific Border Decoration */}
        <div className={cn(
          "absolute inset-0 pointer-events-none border-2 rounded-inherit",
          `border-${activeTheme.primaryColor}-primary`
        )} />
      </div>
    );
  }
);

HouseThemedPanel.displayName = "HouseThemedPanel";

export { HouseThemedPanel, houseThemedPanelVariants };