import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const transitionVariants = cva(
  "transition-all duration-500 ease-comic",
  {
    variants: {
      type: {
        pageFlip: "transform-style-preserve-3d",
        slideLeft: "transform translate-x-full",
        slideRight: "transform -translate-x-full",
        slideUp: "transform translate-y-full",
        slideDown: "transform -translate-y-full",
        fade: "opacity-0",
        zoom: "transform scale-0",
        rotate: "transform rotate-90",
        flip: "transform rotateY(-180deg)",
        shatter: "transform scale-0 rotate-180 opacity-0",
        dissolve: "filter blur(10px) opacity-0",
        comic: "transform scale-95 skew-x-2 opacity-80",
      },
      duration: {
        fast: "duration-200",
        normal: "duration-500",
        slow: "duration-700",
        epic: "duration-1000",
      },
      easing: {
        linear: "ease-linear",
        comic: "ease-comic",
        bounce: "ease-bounce",
        elastic: "ease-elastic",
        dramatic: "ease-dramatic",
      },
    },
    defaultVariants: {
      type: "fade",
      duration: "normal", 
      easing: "comic",
    },
  }
);

export interface ComicTransitionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof transitionVariants> {
  isVisible?: boolean;
  direction?: "in" | "out";
  onComplete?: () => void;
  delay?: number;
}

const ComicTransition = React.forwardRef<HTMLDivElement, ComicTransitionProps>(
  ({ 
    className,
    type,
    duration,
    easing,
    isVisible = true,
    direction = "in",
    onComplete,
    delay = 0,
    children,
    ...props 
  }, ref) => {
    const [shouldRender, setShouldRender] = React.useState(isVisible);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (isVisible && !shouldRender) {
        setShouldRender(true);
      }
    }, [isVisible, shouldRender]);

    React.useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      if (isVisible) {
        timeoutId = setTimeout(() => {
          setIsAnimating(true);
        }, delay);
      } else {
        setIsAnimating(false);
        timeoutId = setTimeout(() => {
          setShouldRender(false);
          onComplete?.();
        }, delay + 500);
      }

      return () => clearTimeout(timeoutId);
    }, [isVisible, delay, onComplete]);

    if (!shouldRender) return null;

    return (
      <div
        ref={ref}
        className={cn(
          transitionVariants({ type, duration, easing }),
          direction === "in" && isAnimating && "transform scale-100 translate-x-0 translate-y-0 opacity-100 rotate-0 skew-x-0",
          direction === "out" && !isAnimating && transitionVariants({ type }),
          className
        )}
        data-testid={`comic-transition-${type}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComicTransition.displayName = "ComicTransition";

// Page Turn Effect Component
export function PageTurnTransition({ 
  isFlipping, 
  direction = "right",
  children,
  className,
  ...props
}: {
  isFlipping: boolean;
  direction?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "relative transform-style-preserve-3d transition-transform duration-700 ease-comic",
        isFlipping && direction === "right" && "rotate-y-180",
        isFlipping && direction === "left" && "rotate-y-neg-180",
        className
      )}
      {...props}
    >
      <div className="backface-hidden">
        {children}
      </div>
    </div>
  );
}

// Panel Sequence Transition
export function PanelSequenceTransition({
  panels,
  currentPanel = 0,
  onPanelChange,
  autoAdvance = false,
  interval = 3000,
}: {
  panels: React.ReactNode[];
  currentPanel?: number;
  onPanelChange?: (index: number) => void;
  autoAdvance?: boolean;
  interval?: number;
}) {
  const [activePanel, setActivePanel] = React.useState(currentPanel);

  React.useEffect(() => {
    setActivePanel(currentPanel);
  }, [currentPanel]);

  React.useEffect(() => {
    if (autoAdvance && panels.length > 1) {
      const timer = setInterval(() => {
        setActivePanel((prev) => {
          const next = (prev + 1) % panels.length;
          onPanelChange?.(next);
          return next;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoAdvance, panels.length, interval, onPanelChange]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {panels.map((panel, index) => (
        <ComicTransition
          key={index}
          type="slideLeft"
          isVisible={index === activePanel}
          className="absolute inset-0"
          data-testid={`panel-${index}`}
        >
          {panel}
        </ComicTransition>
      ))}
      
      {/* Panel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {panels.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActivePanel(index);
              onPanelChange?.(index);
            }}
            className={cn(
              "w-3 h-3 rounded-full border border-black transition-colors",
              index === activePanel ? "bg-yellow-400" : "bg-white"
            )}
            data-testid={`panel-indicator-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

// Speed Lines Transition Effect
export function SpeedLinesTransition({
  trigger,
  direction = "right",
  intensity = "normal",
  children,
}: {
  trigger: boolean;
  direction?: "left" | "right" | "up" | "down";
  intensity?: "subtle" | "normal" | "intense";
  children: React.ReactNode;
}) {
  const intensityClasses = {
    subtle: "opacity-30 scale-105",
    normal: "opacity-50 scale-110",
    intense: "opacity-70 scale-120",
  };

  const directionClasses = {
    right: "bg-gradient-to-r from-transparent via-white to-transparent animate-speed-right",
    left: "bg-gradient-to-l from-transparent via-white to-transparent animate-speed-left", 
    up: "bg-gradient-to-t from-transparent via-white to-transparent animate-speed-up",
    down: "bg-gradient-to-b from-transparent via-white to-transparent animate-speed-down",
  };

  return (
    <div className="relative overflow-hidden">
      {trigger && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none z-10",
            directionClasses[direction],
            intensityClasses[intensity]
          )}
        />
      )}
      <div className={cn("transition-transform duration-300", trigger && "scale-105")}>
        {children}
      </div>
    </div>
  );
}

// Comic Book Reading Flow Transition
export function ReadingFlowTransition({
  panels,
  readingOrder = "left-to-right",
  onComplete,
}: {
  panels: { id: string; content: React.ReactNode; delay?: number }[];
  readingOrder?: "left-to-right" | "right-to-left" | "top-to-bottom" | "z-pattern";
  onComplete?: () => void;
}) {
  const [revealedPanels, setRevealedPanels] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const revealNextPanel = (index: number) => {
      if (index >= panels.length) {
        onComplete?.();
        return;
      }

      const panel = panels[index];
      const delay = panel.delay || index * 500;

      setTimeout(() => {
        setRevealedPanels(prev => new Set(prev).add(panel.id));
        revealNextPanel(index + 1);
      }, delay);
    };

    revealNextPanel(0);
  }, [panels, onComplete]);

  const getTransitionDelay = (index: number) => {
    switch (readingOrder) {
      case "left-to-right":
        return index * 100;
      case "right-to-left":
        return (panels.length - index - 1) * 100;
      case "top-to-bottom":
        return index * 200;
      case "z-pattern":
        const row = Math.floor(index / 3);
        const col = index % 3;
        return (row * 300) + (row % 2 === 0 ? col * 100 : (2 - col) * 100);
      default:
        return index * 100;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {panels.map((panel, index) => (
        <ComicTransition
          key={panel.id}
          type="zoom"
          isVisible={revealedPanels.has(panel.id)}
          delay={getTransitionDelay(index)}
          className="comic-panel"
        >
          {panel.content}
        </ComicTransition>
      ))}
    </div>
  );
}

export { ComicTransition, transitionVariants };