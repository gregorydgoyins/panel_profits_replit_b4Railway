import { ReactNode } from 'react';

interface MosaicLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mosaic Layout System - Puzzle-piece layout with NO gaps
 * When one widget grows, neighbors grow proportionally
 */
export function MosaicLayout({ children, className = '' }: MosaicLayoutProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full ${className}`}
    >
      {children}
    </div>
  );
}

interface MosaicItemProps {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
  className?: string;
}

/**
 * Mosaic Item - Individual widget in the mosaic
 * Responsive spans: mobile (1 col max), tablet (2 cols max), desktop (3 cols)
 */
export function MosaicItem({ children, span = 1, rowSpan = 1, className = '' }: MosaicItemProps) {
  // Build responsive column span classes based on the span value
  const getColSpanClass = () => {
    if (span === 1) return 'col-span-1';
    if (span === 2) return 'col-span-1 md:col-span-2';
    if (span === 3) return 'col-span-1 md:col-span-2 lg:col-span-3';
    return 'col-span-1 md:col-span-2 lg:col-span-3'; // span >= 4
  };
  
  const getRowSpanClass = () => {
    if (rowSpan === 1) return 'row-span-1';
    if (rowSpan === 2) return 'row-span-2';
    if (rowSpan === 3) return 'row-span-3';
    return 'row-span-1';
  };

  return (
    <div
      className={`mosaic-item flex flex-col ${getColSpanClass()} ${getRowSpanClass()} ${className}`}
      style={{
        minHeight: rowSpan === 1 ? '300px' : rowSpan === 2 ? '600px' : '900px',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Full-width mosaic section
 */
export function MosaicSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-full ${className}`} style={{ gridColumn: '1 / -1' }}>
      {children}
    </div>
  );
}
