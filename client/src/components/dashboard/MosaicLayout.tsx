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
      className={`mosaic-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        width: '100%',
      }}
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
 */
export function MosaicItem({ children, span = 1, rowSpan = 1, className = '' }: MosaicItemProps) {
  return (
    <div
      className={`mosaic-item ${className}`}
      style={{
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
        minHeight: rowSpan === 1 ? '300px' : rowSpan === 2 ? '600px' : '900px',
        display: 'flex',
        flexDirection: 'column',
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
