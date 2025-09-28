import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, ImageIcon } from 'lucide-react';

interface ComicCoverImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showHoverEffect?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-16 h-24',
  md: 'w-32 h-48', 
  lg: 'w-40 h-60',
  xl: 'w-48 h-72'
};

export function ComicCoverImage({
  src,
  alt,
  className,
  fallbackClassName,
  onLoad,
  onError,
  priority = false,
  size = 'md',
  showHoverEffect = true,
  onClick
}: ComicCoverImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(src || null);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(null);
    onError?.();
  };

  const handleClick = () => {
    if (onClick && imageSrc && !hasError) {
      onClick();
    }
  };

  // Convert comics.org gallery URLs to potential direct image URLs
  const getDirectImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // If it's already a direct image URL, use it
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url;
    }
    
    // For comics.org URLs, try to construct a direct image URL
    if (url.includes('comics.org') && url.includes('/covers/')) {
      // This is a gallery URL, we'll display a placeholder and handle it in the fallback
      return null;
    }
    
    return url;
  };

  const directImageUrl = getDirectImageUrl(imageSrc);
  const isClickable = onClick && imageSrc && !hasError;

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-md border bg-muted flex items-center justify-center',
        sizeClasses[size],
        isClickable && 'cursor-pointer',
        showHoverEffect && isClickable && 'hover-elevate transition-transform duration-200',
        className
      )}
      onClick={handleClick}
      data-testid={`comic-cover-${alt.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Loading State */}
      {isLoading && directImageUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* Main Image */}
      {directImageUrl && !hasError && (
        <img
          src={directImageUrl}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      
      {/* Fallback State */}
      {(!directImageUrl || hasError) && (
        <div className={cn(
          'w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50',
          fallbackClassName
        )}>
          <ImageIcon className="h-8 w-8 mb-2" />
          <span className="text-xs text-center px-2 leading-tight">
            {imageSrc?.includes('comics.org') 
              ? 'Comics.org Gallery' 
              : 'Cover Not Available'
            }
          </span>
          {imageSrc?.includes('comics.org') && (
            <span className="text-xs text-center px-2 mt-1 text-primary/60">
              Click to view gallery
            </span>
          )}
        </div>
      )}
      
      {/* Hover overlay for clickable covers */}
      {isClickable && showHoverEffect && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-medium">
            {imageSrc?.includes('comics.org') ? 'View Gallery' : 'View Cover'}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComicCoverImage;