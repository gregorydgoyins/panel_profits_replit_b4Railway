import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CoverImage {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  year?: number;
}

interface CoverGalleryWidgetProps {
  entityName: string;
  covers: CoverImage[];
  autoRotate?: boolean;
  rotationInterval?: number; // milliseconds
  className?: string;
}

export function CoverGalleryWidget({
  entityName,
  covers,
  autoRotate = true,
  rotationInterval = 5000,
  className
}: CoverGalleryWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentCover = covers[currentIndex];
  
  // Controls are visible if hovered, focused, or on touch device
  const showControls = isHovered || isFocused || isTouchDevice;
  
  // User is actively interacting if hovered, focused, or touch+interacting
  const isUserInteracting = isHovered || isFocused || isTouchInteracting;

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    // Listen for first touch to confirm touch device
    const handleTouch = () => setIsTouchDevice(true);
    window.addEventListener('touchstart', handleTouch, { once: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  // Auto-rotation effect - pause when user is actively interacting
  useEffect(() => {
    if (!autoRotate || covers.length <= 1 || isUserInteracting) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % covers.length);
    }, rotationInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, covers.length, isUserInteracting, rotationInterval]);

  // Preload next image
  useEffect(() => {
    if (covers.length === 0) return;

    const nextIndex = (currentIndex + 1) % covers.length;
    const nextCover = covers[nextIndex];

    if (nextCover && !loadedImages.has(nextCover.url)) {
      const img = new Image();
      img.src = nextCover.url;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(nextCover.url));
      };
    }
  }, [currentIndex, covers, loadedImages]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + covers.length) % covers.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % covers.length);
  };

  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => new Set(prev).add(url));
  };

  if (covers.length === 0) {
    return (
      <Card className={cn('hover-elevate', className)} data-testid="widget-cover-gallery">
        <CardHeader>
          <CardTitle className="text-lg">Cover Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <p data-testid="text-no-covers">No covers available for {entityName}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn('hover-elevate relative overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only hide if focus left the entire widget
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      onTouchStart={() => setIsTouchInteracting(true)}
      onTouchEnd={() => setIsTouchInteracting(false)}
      onTouchCancel={() => setIsTouchInteracting(false)}
      data-testid="widget-cover-gallery"
    >
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Cover Gallery</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground" data-testid="text-cover-count">
              {currentIndex + 1} / {covers.length}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {/* Main Image Display */}
        <div className="relative aspect-[2/3] w-full max-w-md mx-auto">
          <img
            src={currentCover.url}
            alt={currentCover.title}
            className={cn(
              "w-full h-full object-cover rounded-md transition-opacity duration-300",
              loadedImages.has(currentCover.url) ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            onLoad={() => handleImageLoad(currentCover.url)}
            data-testid={`img-cover-${currentCover.id}`}
          />
          
          {/* Loading State */}
          {!loadedImages.has(currentCover.url) && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-md">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {/* Navigation Controls - Show on Hover */}
          {covers.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm transition-opacity",
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={goToPrevious}
                aria-label="Previous cover"
                title="Previous cover"
                data-testid="button-cover-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm transition-opacity",
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={goToNext}
                aria-label="Next cover"
                title="Next cover"
                data-testid="button-cover-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Maximize Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 bg-background/80 backdrop-blur-sm transition-opacity",
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Maximize cover image"
            title="Maximize cover image"
            data-testid="button-cover-maximize"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Cover Info */}
        <div className="mt-4 text-center space-y-1">
          <h3 className="font-medium" data-testid="text-cover-title">
            {currentCover.title}
          </h3>
          {currentCover.subtitle && (
            <p className="text-sm text-muted-foreground" data-testid="text-cover-subtitle">
              {currentCover.subtitle}
            </p>
          )}
          {currentCover.year && (
            <p className="text-xs text-muted-foreground" data-testid="text-cover-year">
              {currentCover.year}
            </p>
          )}
        </div>

        {/* Thumbnail Strip - Show on Hover */}
        {covers.length > 1 && (
          <div 
            className={cn(
              "mt-4 flex gap-2 overflow-x-auto pb-2 transition-opacity",
              showControls ? 'opacity-100' : 'opacity-50'
            )}
            data-testid="container-thumbnail-strip"
          >
            {covers.map((cover, index) => (
              <button
                key={cover.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "flex-shrink-0 w-16 h-24 rounded border-2 transition-all overflow-hidden hover-elevate active-elevate-2",
                  currentIndex === index 
                    ? 'border-primary' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
                aria-label={`View ${cover.title}`}
                title={cover.title}
                data-testid={`button-thumbnail-${cover.id}`}
              >
                <img
                  src={cover.url}
                  alt={cover.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
