import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";
import { houseEffects, triggerHouseAnimation, triggerHouseSound } from "@/lib/house-visual-effects";

const comicPanelVariants = cva(
  "comic-panel transition-mystical hover-elevate",
  {
    variants: {
      variant: {
        default: "comic-panel",
        splash: "comic-panel border-4 shadow-lg",
        action: "comic-panel border-3 shadow-md speed-lines",
        quiet: "comic-panel border border-slate-400 shadow-sm",
        flashback: "comic-panel border-dashed border-amber-600 bg-sepia",
      },
      house: {
        none: "",
        heroes: "house-heroes border-house-heroes-primary",
        wisdom: "house-wisdom border-house-wisdom-primary", 
        power: "house-power border-house-power-primary",
        mystery: "house-mystery border-house-mystery-primary",
        elements: "house-elements border-house-elements-primary",
        time: "house-time border-house-time-primary",
        spirit: "house-spirit border-house-spirit-primary",
      },
      shape: {
        rectangular: "rounded-md",
        circular: "rounded-full aspect-square",
        diamond: "rotate-45 rounded-lg",
        hexagon: "clip-path-hexagon",
      },
      size: {
        sm: "min-h-24 p-3",
        default: "min-h-32 p-4",
        lg: "min-h-48 p-6",
        splash: "min-h-64 p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      house: "none",
      shape: "rectangular",
      size: "default",
    },
  }
);

export interface ComicPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof comicPanelVariants> {
  panelNumber?: number;
  isActive?: boolean;
  soundEffect?: string;
  narrativeText?: string;
  houseOverride?: MythologicalHouse;
  showHouseEffects?: boolean;
  onPanelClick?: (house: MythologicalHouse) => void;
  effectIntensity?: 'low' | 'medium' | 'high';
}

const ComicPanel = React.forwardRef<HTMLDivElement, ComicPanelProps>(
  ({ 
    className, 
    variant, 
    house, 
    shape, 
    size, 
    panelNumber, 
    isActive = false, 
    soundEffect,
    narrativeText,
    houseOverride,
    showHouseEffects = true,
    onPanelClick,
    effectIntensity = 'medium',
    children, 
    ...props 
  }, ref) => {
    const { currentHouse, getHouseTheme } = useHouseTheme();
    const activeHouse = houseOverride || house || currentHouse;
    const panelRef = React.useRef<HTMLDivElement>(null);
    
    // Trigger house-specific animations when panel becomes active
    React.useEffect(() => {
      if (isActive && panelRef.current && showHouseEffects) {
        // Get house-specific animation
        const houseLibrary = houseEffects.getHouseEffects(activeHouse);
        const animationName = Object.keys(houseLibrary.animations)[0]; // Use first animation
        
        if (animationName) {
          triggerHouseAnimation(
            panelRef.current,
            activeHouse,
            animationName,
            { intensity: effectIntensity }
          );
        }
      }
    }, [isActive, activeHouse, showHouseEffects, effectIntensity]);
    
    const handleClick = () => {
      if (onPanelClick) {
        onPanelClick(activeHouse);
      }
      
      // Trigger sound effect if provided
      if (soundEffect && panelRef.current) {
        triggerHouseSound(activeHouse, 'click', panelRef.current);
      }
    };
    return (
      <div
        ref={(el) => {
          panelRef.current = el;
          if (ref) {
            if (typeof ref === 'function') ref(el);
            else ref.current = el;
          }
        }}
        className={cn(
          comicPanelVariants({ variant, house: activeHouse, shape, size }),
          isActive && "ring-2 ring-primary shadow-lg house-themed-glow",
          onPanelClick && "cursor-pointer hover-elevate",
          showHouseEffects && "house-theme-transition",
          className
        )}
        onClick={handleClick}
        data-testid={`comic-panel-${activeHouse}-${panelNumber || 'default'}`}
        {...props}
      >
        {/* Panel Number Indicator */}
        {panelNumber && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
            {panelNumber}
          </div>
        )}

        {/* House-specific visual effects overlay */}
        {showHouseEffects && (
          <div className={cn(
            "absolute inset-0 pointer-events-none",
            effectIntensity === 'high' ? "opacity-20" : effectIntensity === 'medium' ? "opacity-10" : "opacity-5",
            activeHouse === 'heroes' && "house-heroes-speed-lines",
            activeHouse === 'wisdom' && "house-wisdom-venetian-blinds",
            activeHouse === 'power' && "house-power-energy-surge",
            activeHouse === 'mystery' && "house-mystery-mist-reveal",
            activeHouse === 'elements' && "house-elements-fire-flow",
            activeHouse === 'time' && "house-time-ripple",
            activeHouse === 'spirit' && "house-spirit-divine-aura"
          )} />
        )}

        {/* Sound Effect Overlay with house-specific styling */}
        {soundEffect && (
          <div className={cn(
            "absolute top-2 right-2 font-comic-action transform -rotate-12 z-20",
            activeHouse === 'heroes' && "text-red-500 comic-sound-secondary",
            activeHouse === 'wisdom' && "text-blue-500 comic-sound-secondary",
            activeHouse === 'power' && "text-purple-500 comic-sound-primary",
            activeHouse === 'mystery' && "text-green-500 comic-sound-secondary",
            activeHouse === 'elements' && "text-orange-500 comic-sound-secondary",
            activeHouse === 'time' && "text-yellow-500 comic-sound-secondary",
            activeHouse === 'spirit' && "text-cyan-500 comic-sound-secondary"
          )}>
            {soundEffect}
          </div>
        )}

        {/* Panel Content */}
        <div className="relative h-full w-full flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Narrative Caption */}
          {narrativeText && (
            <div className="caption-box narrative mt-auto">
              <div className="font-comic-narrative text-xs">
                {narrativeText}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ComicPanel.displayName = "ComicPanel";

export { ComicPanel, comicPanelVariants };