import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const captionBoxVariants = cva(
  "caption-box font-comic-narrative",
  {
    variants: {
      variant: {
        default: "caption-box bg-yellow-100 border-yellow-800 text-yellow-800",
        narrative: "caption-box narrative bg-black/80 text-white border-white/30",
        flashback: "caption-box bg-sepia-100 border-amber-700 text-amber-900",
        future: "caption-box bg-blue-100 border-blue-700 text-blue-900",
        thought: "caption-box bg-purple-100 border-purple-600 text-purple-800 italic",
        location: "caption-box bg-green-100 border-green-700 text-green-800",
        time: "caption-box bg-orange-100 border-orange-700 text-orange-800",
      },
      size: {
        sm: "text-xs px-2 py-1",
        default: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3",
      },
      position: {
        "top-left": "absolute top-2 left-2",
        "top-right": "absolute top-2 right-2",
        "top-center": "absolute top-2 left-1/2 transform -translate-x-1/2",
        "bottom-left": "absolute bottom-2 left-2",
        "bottom-right": "absolute bottom-2 right-2",
        "bottom-center": "absolute bottom-2 left-1/2 transform -translate-x-1/2",
        "center": "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        relative: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "relative",
    },
  }
);

export interface CaptionBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof captionBoxVariants> {
  timestamp?: string | Date;
  location?: string;
  narrator?: string;
  maxWidth?: string;
}

const CaptionBox = React.forwardRef<HTMLDivElement, CaptionBoxProps>(
  ({ 
    className, 
    variant, 
    size, 
    position, 
    timestamp, 
    location, 
    narrator,
    maxWidth = "max-w-xs",
    children, 
    ...props 
  }, ref) => {
    const formatTimestamp = (time: string | Date) => {
      if (time instanceof Date) {
        return time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      }
      return time;
    };

    return (
      <div
        ref={ref}
        className={cn(
          captionBoxVariants({ variant, size, position }),
          maxWidth,
          "z-40 shadow-lg",
          className
        )}
        data-testid={`caption-box-${variant}`}
        {...props}
      >
        {/* Caption Header */}
        {(timestamp || location || narrator) && (
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-current opacity-60">
            {narrator && (
              <span className="font-bold text-xs uppercase tracking-wider">
                {narrator}
              </span>
            )}
            {location && (
              <span className="text-xs">
                📍 {location}
              </span>
            )}
            {timestamp && (
              <span className="text-xs font-mono">
                {formatTimestamp(timestamp)}
              </span>
            )}
          </div>
        )}

        {/* Caption Content */}
        <div className="leading-tight">
          {children}
        </div>
      </div>
    );
  }
);

CaptionBox.displayName = "CaptionBox";

// Convenience components for specific caption types
export function NarrativeCaptionBox({ children, ...props }: Omit<CaptionBoxProps, 'variant'>) {
  return (
    <CaptionBox variant="narrative" {...props}>
      {children}
    </CaptionBox>
  );
}

export function LocationCaptionBox({ location, children, ...props }: CaptionBoxProps) {
  return (
    <CaptionBox 
      variant="location" 
      location={location}
      position="top-center"
      {...props}
    >
      {children}
    </CaptionBox>
  );
}

export function TimeCaptionBox({ timestamp, children, ...props }: CaptionBoxProps) {
  return (
    <CaptionBox 
      variant="time" 
      timestamp={timestamp}
      position="top-right"
      {...props}
    >
      {children}
    </CaptionBox>
  );
}

export function FlashbackCaptionBox({ children, ...props }: Omit<CaptionBoxProps, 'variant'>) {
  return (
    <CaptionBox variant="flashback" {...props}>
      {children}
    </CaptionBox>
  );
}

export { CaptionBox, captionBoxVariants };