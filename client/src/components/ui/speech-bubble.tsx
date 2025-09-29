import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const speechBubbleVariants = cva(
  "speech-bubble font-comic-speech",
  {
    variants: {
      variant: {
        default: "speech-bubble",
        thought: "thought-bubble font-comic-thought",
        shout: "speech-bubble border-4 border-red-500 bg-red-50 text-red-800",
        whisper: "speech-bubble border-dashed border-gray-400 bg-gray-50 text-gray-700 text-sm",
        robot: "speech-bubble border-blue-500 bg-blue-50 text-blue-800 font-mono",
      },
      tail: {
        none: "",
        bottom: "tail-bottom",
        top: "tail-top",
        left: "tail-left",
        right: "tail-right",
      },
      size: {
        sm: "text-sm max-w-48 px-3 py-2",
        default: "text-base max-w-72 px-4 py-3",
        lg: "text-lg max-w-96 px-6 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      tail: "bottom",
      size: "default",
    },
  }
);

export interface SpeechBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof speechBubbleVariants> {
  speaker?: string;
  priority?: "low" | "normal" | "high" | "urgent";
}

const SpeechBubble = React.forwardRef<HTMLDivElement, SpeechBubbleProps>(
  ({ className, variant, tail, size, speaker, priority = "normal", children, ...props }, ref) => {
    const priorityStyles = {
      low: "opacity-75",
      normal: "",
      high: "border-orange-400 bg-orange-50 text-orange-800",
      urgent: "border-red-500 bg-red-50 text-red-800 animate-pulse",
    };

    return (
      <div
        ref={ref}
        className={cn(
          speechBubbleVariants({ variant, tail, size }),
          priorityStyles[priority],
          className
        )}
        role="alert"
        aria-live={priority === "urgent" ? "assertive" : "polite"}
        data-testid={`speech-bubble-${speaker?.toLowerCase().replace(/\s+/g, "-") || "default"}`}
        {...props}
      >
        {speaker && (
          <div className="font-bold mb-1 text-xs uppercase tracking-wider opacity-75">
            {speaker}
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

SpeechBubble.displayName = "SpeechBubble";

export { SpeechBubble, speechBubbleVariants };