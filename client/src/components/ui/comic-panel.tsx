import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          comicPanelVariants({ variant, house, shape, size }),
          isActive && "ring-2 ring-primary shadow-lg",
          className
        )}
        data-testid={`comic-panel-${panelNumber || 'default'}`}
        {...props}
      >
        {/* Panel Number Indicator */}
        {panelNumber && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
            {panelNumber}
          </div>
        )}

        {/* Sound Effect Overlay */}
        {soundEffect && (
          <div className="absolute top-2 right-2 font-comic-action text-red-500 comic-sound-secondary transform -rotate-12 z-20">
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