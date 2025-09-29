import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const comicGridVariants = cva(
  "comic-grid",
  {
    variants: {
      layout: {
        "2x2": "comic-grid-2x2",
        "3x2": "comic-grid-3x2", 
        "splash": "comic-grid-splash",
        "single": "grid-cols-1",
        "responsive": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      },
      spacing: {
        tight: "gap-2",
        normal: "gap-4",
        loose: "gap-6",
        wide: "gap-8",
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      layout: "responsive",
      spacing: "normal", 
      padding: "default",
    },
  }
);

export interface ComicGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof comicGridVariants> {
  pageNumber?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ComicGrid = React.forwardRef<HTMLDivElement, ComicGridProps>(
  ({ 
    className, 
    layout, 
    spacing, 
    padding, 
    pageNumber,
    totalPages,
    onPageChange,
    children, 
    ...props 
  }, ref) => {
    return (
      <div className="comic-page-container relative">
        {/* Page Header */}
        {pageNumber && totalPages && (
          <div className="flex items-center justify-between mb-4 px-2">
            <button
              onClick={() => onPageChange?.(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="font-comic-display text-sm px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-50 hover-elevate"
              data-testid="comic-page-prev"
            >
              « PREV
            </button>
            
            <div className="font-comic-display text-lg">
              PAGE {pageNumber} OF {totalPages}
            </div>
            
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, pageNumber + 1))}
              disabled={pageNumber >= totalPages}
              className="font-comic-display text-sm px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-50 hover-elevate"
              data-testid="comic-page-next"
            >
              NEXT »
            </button>
          </div>
        )}

        {/* Comic Panel Grid */}
        <div
          ref={ref}
          className={cn(
            comicGridVariants({ layout, spacing, padding }),
            className
          )}
          data-testid={`comic-grid-${layout}`}
          {...props}
        >
          {children}
        </div>

        {/* Page Navigation Dots */}
        {totalPages && totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange?.(i + 1)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  pageNumber === i + 1
                    ? "bg-primary"
                    : "bg-slate-400 hover:bg-slate-300"
                )}
                data-testid={`page-dot-${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ComicGrid.displayName = "ComicGrid";

export { ComicGrid, comicGridVariants };