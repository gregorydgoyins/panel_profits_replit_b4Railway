import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageLayoutVariants = cva(
  "comic-page relative w-full",
  {
    variants: {
      layout: {
        standard: "grid grid-cols-3 grid-rows-3",
        splash: "grid grid-cols-2 grid-rows-3",
        widescreen: "grid grid-cols-4 grid-rows-2", 
        portrait: "grid grid-cols-2 grid-rows-4",
        newspaper: "grid grid-cols-4 grid-rows-4",
        magazine: "grid grid-cols-3 grid-rows-4",
        action: "grid grid-cols-2 grid-rows-2 gap-2",
        experimental: "grid grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr]",
      },
      gutter: {
        none: "gap-0",
        tight: "gap-1",
        normal: "gap-2", 
        wide: "gap-4",
        bleed: "gap-6 p-2",
      },
      background: {
        white: "bg-white",
        paper: "bg-yellow-50",
        newsprint: "bg-gray-100",
        aged: "bg-amber-50",
        dark: "bg-slate-900",
      },
    },
    defaultVariants: {
      layout: "standard",
      gutter: "normal",
      background: "paper",
    },
  }
);

interface PanelDefinition {
  id: string;
  gridArea?: string;
  className?: string;
  content?: React.ReactNode;
  house?: string;
  isActive?: boolean;
  soundEffect?: string;
  narrative?: string;
}

export interface ComicPageLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageLayoutVariants> {
  panels?: PanelDefinition[];
  pageNumber?: number;
  totalPages?: number;
  onPanelClick?: (panelId: string) => void;
  showPageNumber?: boolean;
  showGutterLines?: boolean;
}

const ComicPageLayout = React.forwardRef<HTMLDivElement, ComicPageLayoutProps>(
  ({ 
    className,
    layout,
    gutter,
    background,
    panels = [],
    pageNumber,
    totalPages,
    onPanelClick,
    showPageNumber = true,
    showGutterLines = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div className="comic-page-wrapper relative">
        {/* Page Number */}
        {showPageNumber && pageNumber && (
          <div className="absolute -top-8 right-0 z-50">
            <div className="font-comic-display text-sm bg-black text-white px-2 py-1 rounded">
              {pageNumber}
              {totalPages && ` / ${totalPages}`}
            </div>
          </div>
        )}

        {/* Page Layout Container */}
        <div
          ref={ref}
          className={cn(
            pageLayoutVariants({ layout, gutter, background }),
            "min-h-96 border-2 border-black shadow-lg",
            className
          )}
          data-testid={`comic-page-${pageNumber || 'default'}`}
          {...props}
        >
          {/* Gutter Lines - Visual Guide */}
          {showGutterLines && (
            <>
              {/* Vertical gutter lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-px bg-blue-300 opacity-50 absolute left-1/3"></div>
                <div className="h-full w-px bg-blue-300 opacity-50 absolute left-2/3"></div>
              </div>
              {/* Horizontal gutter lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-px bg-blue-300 opacity-50 absolute top-1/3"></div>
                <div className="w-full h-px bg-blue-300 opacity-50 absolute top-2/3"></div>
              </div>
            </>
          )}

          {/* Render Panels */}
          {panels.map((panel, index) => (
            <div
              key={panel.id}
              className={cn(
                "comic-panel hover-elevate cursor-pointer",
                panel.house && `house-${panel.house}`,
                panel.isActive && "ring-2 ring-primary",
                panel.className
              )}
              style={{ gridArea: panel.gridArea }}
              onClick={() => onPanelClick?.(panel.id)}
              data-testid={`panel-${panel.id}`}
            >
              {/* Panel Number */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                {index + 1}
              </div>

              {/* Sound Effect */}
              {panel.soundEffect && (
                <div className="absolute top-2 right-2 font-comic-action text-red-500 text-lg transform -rotate-12 z-20">
                  {panel.soundEffect}
                </div>
              )}

              {/* Panel Content */}
              <div className="h-full w-full p-4 flex flex-col">
                <div className="flex-1">
                  {panel.content}
                </div>
                
                {/* Narrative Caption */}
                {panel.narrative && (
                  <div className="caption-box narrative mt-auto">
                    <div className="font-comic-narrative text-xs">
                      {panel.narrative}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Default Children if no panels defined */}
          {panels.length === 0 && children}
        </div>
      </div>
    );
  }
);

ComicPageLayout.displayName = "ComicPageLayout";

// Predefined layout templates
export const LayoutTemplates = {
  tradingDashboard: {
    layout: "standard" as const,
    panels: [
      { id: "portfolio", gridArea: "1 / 1 / 2 / 3", narrative: "Your current positions" },
      { id: "watchlist", gridArea: "1 / 3 / 2 / 4", narrative: "Assets on watch" },
      { id: "chart", gridArea: "2 / 1 / 4 / 3", narrative: "Market movements unfold" },
      { id: "news", gridArea: "2 / 3 / 3 / 4", narrative: "Breaking developments" },
      { id: "orders", gridArea: "3 / 3 / 4 / 4", narrative: "Active trades" },
    ]
  },
  
  marketAnalysis: {
    layout: "splash" as const,
    panels: [
      { id: "main-chart", gridArea: "1 / 1 / 4 / 2", narrative: "The market tells its story", className: "comic-panel-splash" },
      { id: "indicators", gridArea: "1 / 2 / 2 / 3", narrative: "Technical signals" },
      { id: "sentiment", gridArea: "2 / 2 / 3 / 3", narrative: "Market mood" },
      { id: "predictions", gridArea: "3 / 2 / 4 / 3", narrative: "Future outlook" },
    ]
  },

  assetDetails: {
    layout: "magazine" as const,
    panels: [
      { id: "header", gridArea: "1 / 1 / 2 / 4", narrative: "Asset identity" },
      { id: "price", gridArea: "2 / 1 / 3 / 2", narrative: "Current value" },
      { id: "chart", gridArea: "2 / 2 / 4 / 4", narrative: "Price history" },
      { id: "stats", gridArea: "3 / 1 / 4 / 2", narrative: "Key metrics" },
      { id: "actions", gridArea: "4 / 1 / 5 / 4", narrative: "Trading options" },
    ]
  },

  actionSequence: {
    layout: "action" as const,
    panels: [
      { id: "setup", narrative: "Market conditions align..." },
      { id: "action", soundEffect: "POW!", narrative: "The trade executes!" },
      { id: "reaction", narrative: "Market responds..." },
      { id: "outcome", narrative: "Results unfold..." },
    ]
  },

  storyMode: {
    layout: "newspaper" as const,
    panels: Array.from({ length: 16 }, (_, i) => ({
      id: `panel-${i + 1}`,
      narrative: `Panel ${i + 1} continues the story...`
    }))
  }
};

export { ComicPageLayout, pageLayoutVariants };