import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const panelShapeVariants = cva(
  "comic-panel relative overflow-hidden transition-mystical hover-elevate",
  {
    variants: {
      shape: {
        rectangular: "rounded-md border-2 border-black",
        square: "aspect-square rounded-md border-2 border-black", 
        circular: "aspect-square rounded-full border-2 border-black",
        oval: "aspect-video rounded-full border-2 border-black",
        diamond: "aspect-square rotate-45 border-2 border-black",
        hexagon: "aspect-square clip-path-hexagon border-2 border-black",
        star: "aspect-square clip-path-star border-2 border-black",
        speech: "rounded-full border-2 border-black relative",
        thought: "rounded-full border-2 border-black border-dashed",
        explosion: "clip-path-explosion border-2 border-red-600",
        jagged: "clip-path-jagged border-2 border-black",
        wavy: "clip-path-wavy border-2 border-blue-600",
      },
      size: {
        xs: "w-16 h-16 text-xs",
        sm: "w-24 h-24 text-sm",
        default: "w-32 h-32 text-base",
        lg: "w-48 h-48 text-lg",
        xl: "w-64 h-64 text-xl",
        splash: "w-full h-64 text-2xl",
      },
      border: {
        thin: "border border-black",
        normal: "border-2 border-black", 
        thick: "border-4 border-black",
        heavy: "border-8 border-black",
        double: "border-2 border-black shadow-[inset_0_0_0_2px_white]",
      },
      effect: {
        none: "",
        glow: "shadow-lg animate-pulse",
        shake: "animate-shake",
        float: "animate-float",
        spin: "animate-spin-slow",
        bounce: "animate-bounce-subtle",
        speed: "relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-speed-lines",
      },
    },
    defaultVariants: {
      shape: "rectangular",
      size: "default",
      border: "normal",
      effect: "none",
    },
  }
);

export interface ComicPanelShapeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelShapeVariants> {
  panelId?: string;
  house?: string;
  isActive?: boolean;
  soundEffect?: string;
  tailDirection?: "top" | "bottom" | "left" | "right";
  borderColor?: string;
}

const ComicPanelShape = React.forwardRef<HTMLDivElement, ComicPanelShapeProps>(
  ({ 
    className,
    shape,
    size,
    border,
    effect,
    panelId,
    house,
    isActive = false,
    soundEffect,
    tailDirection = "bottom",
    borderColor,
    children,
    ...props 
  }, ref) => {
    const houseColors = {
      heroes: "border-red-600",
      wisdom: "border-blue-600", 
      power: "border-purple-600",
      mystery: "border-green-600",
      elements: "border-yellow-600",
      time: "border-gray-600",
      spirit: "border-cyan-600",
    };

    const customBorderColor = house && houseColors[house as keyof typeof houseColors];

    return (
      <div className="relative inline-block">
        <div
          ref={ref}
          className={cn(
            panelShapeVariants({ shape, size, border, effect }),
            customBorderColor || (borderColor && `border-${borderColor}`),
            isActive && "ring-2 ring-primary ring-offset-2",
            className
          )}
          data-testid={`panel-shape-${panelId || shape}`}
          {...props}
        >
          {/* Speech/Thought bubble tail */}
          {(shape === "speech" || shape === "thought") && (
            <div className={cn(
              "absolute w-0 h-0 border-solid",
              tailDirection === "bottom" && "top-full left-6 border-t-8 border-t-black border-x-8 border-x-transparent",
              tailDirection === "top" && "bottom-full left-6 border-b-8 border-b-black border-x-8 border-x-transparent",
              tailDirection === "left" && "right-full top-6 border-r-8 border-r-black border-y-8 border-y-transparent",
              tailDirection === "right" && "left-full top-6 border-l-8 border-l-black border-y-8 border-y-transparent"
            )} />
          )}

          {/* Sound Effect Overlay */}
          {soundEffect && (
            <div className="absolute top-2 right-2 font-comic-action text-red-500 text-lg transform -rotate-12 z-20 animate-bounce">
              {soundEffect}
            </div>
          )}

          {/* Panel Content */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center p-2",
            shape === "diamond" && "transform -rotate-45",
            shape === "star" && "transform scale-75"
          )}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ComicPanelShape.displayName = "ComicPanelShape";

// Predefined panel combinations for common scenarios
export const PanelShapePresets = {
  tradingSequence: [
    { shape: "rectangular" as const, soundEffect: "DING!", content: "Order Placed" },
    { shape: "circular" as const, soundEffect: "WHOOSH!", content: "Processing" },
    { shape: "star" as const, soundEffect: "POW!", content: "Executed!" },
    { shape: "explosion" as const, soundEffect: "BOOM!", content: "Profit!" },
  ],
  
  alertFlow: [
    { shape: "speech" as const, content: "Price Alert!" },
    { shape: "diamond" as const, soundEffect: "ZAP!", content: "Take Action?" },
    { shape: "rectangular" as const, content: "Decision Made" },
  ],
  
  storyBeats: [
    { shape: "rectangular" as const, content: "Setup" },
    { shape: "circular" as const, content: "Rising Action" },
    { shape: "explosion" as const, soundEffect: "CRASH!", content: "Climax" },
    { shape: "oval" as const, content: "Resolution" },
  ],
  
  emotionalJourney: [
    { shape: "thought" as const, content: "Hmm..." },
    { shape: "speech" as const, content: "I should buy!" },
    { shape: "star" as const, soundEffect: "YES!", content: "Success!" },
    { shape: "circular" as const, content: "Profit" },
  ]
};

export { ComicPanelShape, panelShapeVariants };