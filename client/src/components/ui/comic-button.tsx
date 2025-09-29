import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const comicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-comic-display text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2 uppercase tracking-wide transition-mystical",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-2 border-primary-border shadow-lg",
        action: "bg-red-600 text-white border-2 border-red-800 shadow-lg transform hover:scale-105",
        success: "bg-emerald-600 text-white border-2 border-emerald-800 shadow-lg",
        warning: "bg-orange-600 text-white border-2 border-orange-800 shadow-lg",
        comic: "bg-yellow-400 text-black border-2 border-black shadow-lg font-black text-shadow-sm",
        speech: "bg-white text-black border-2 border-black rounded-full shadow-lg",
        ghost: "border-2 border-transparent hover:bg-accent/20 hover:border-current",
        outline: "border-2 border-current bg-transparent hover:bg-current hover:text-background",
        hero: "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-800 shadow-lg",
        villain: "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-2 border-purple-800 shadow-lg",
      },
      size: {
        default: "min-h-10 px-6 py-2 text-sm",
        sm: "min-h-8 rounded-md px-4 text-xs",
        lg: "min-h-12 rounded-md px-8 text-base",
        xl: "min-h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
      effect: {
        none: "",
        impact: "animate-pulse shadow-xl",
        shake: "animate-bounce",
        glow: "shadow-2xl animate-pulse",
        speed: "speed-lines relative overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default", 
      effect: "none",
    },
  }
);

export interface ComicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof comicButtonVariants> {
  asChild?: boolean;
  soundEffect?: string;
  onComicClick?: () => void;
}

const ComicButton = React.forwardRef<HTMLButtonElement, ComicButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    effect, 
    asChild = false, 
    soundEffect,
    onComicClick,
    onClick,
    children,
    ...props 
  }, ref) => {
    const [showSoundEffect, setShowSoundEffect] = React.useState(false);
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger sound effect animation
      if (soundEffect) {
        setShowSoundEffect(true);
        setTimeout(() => setShowSoundEffect(false), 1000);
      }

      // Call custom comic click handler
      onComicClick?.();
      
      // Call original click handler
      onClick?.(e);
    };

    return (
      <div className="relative inline-block">
        <Comp
          className={cn(comicButtonVariants({ variant, size, effect, className }))}
          ref={ref}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Comp>
        
        {/* Sound Effect Overlay */}
        {soundEffect && showSoundEffect && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
            <span className="font-comic-action text-yellow-500 text-lg animate-bounce">
              {soundEffect}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ComicButton.displayName = "ComicButton";

// Convenience buttons for common trading actions
export function BuyButton({ children, ...props }: Omit<ComicButtonProps, 'variant'>) {
  return (
    <ComicButton 
      variant="success" 
      soundEffect="POW!" 
      data-testid="buy-button"
      {...props}
    >
      {children || "BUY"}
    </ComicButton>
  );
}

export function SellButton({ children, ...props }: Omit<ComicButtonProps, 'variant'>) {
  return (
    <ComicButton 
      variant="action" 
      soundEffect="WHAM!" 
      data-testid="sell-button"
      {...props}
    >
      {children || "SELL"}
    </ComicButton>
  );
}

export function ActionButton({ children, ...props }: Omit<ComicButtonProps, 'variant'>) {
  return (
    <ComicButton 
      variant="action" 
      effect="impact"
      soundEffect="BAM!" 
      {...props}
    >
      {children}
    </ComicButton>
  );
}

export function HeroButton({ children, ...props }: Omit<ComicButtonProps, 'variant'>) {
  return (
    <ComicButton 
      variant="hero" 
      effect="glow"
      soundEffect="DING!" 
      {...props}
    >
      {children}
    </ComicButton>
  );
}

export function ComicSpeechButton({ children, ...props }: Omit<ComicButtonProps, 'variant'>) {
  return (
    <ComicButton 
      variant="speech" 
      {...props}
    >
      {children}
    </ComicButton>
  );
}

export { ComicButton, comicButtonVariants };