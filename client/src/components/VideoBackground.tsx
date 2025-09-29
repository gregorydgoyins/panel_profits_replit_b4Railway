import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoBackgroundProps {
  videoUrl?: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  minimalist?: boolean;
  children?: React.ReactNode;
}

export function VideoBackground({
  videoUrl = "https://cdn.pixabay.com/video/2024/08/24/228197_large.mp4",
  fallbackImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3072&auto=format&fit=crop",
  overlay = true,
  overlayOpacity = 0.5,
  minimalist = false,
  children
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleVideoError = () => {
    setShowFallback(true);
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Background Video/Image */}
      <AnimatePresence>
        {!showFallback ? (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoLoaded ? 1 : 0 }}
            transition={{ duration: 2 }}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              filter: minimalist 
                ? "brightness(0.6) contrast(1.1)" 
                : "brightness(0.4) contrast(1.2)",
              transform: "scale(1.05)"
            }}
            data-testid="video-background"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${fallbackImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: minimalist 
                ? "brightness(0.6) contrast(1.1)"
                : "brightness(0.4) contrast(1.2)"
            }}
            data-testid="image-fallback"
          />
        )}
      </AnimatePresence>

      {/* Simplified Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: minimalist
              ? `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.5}) 0%, rgba(0,0,0,${overlayOpacity}) 100%)`
              : `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${overlayOpacity}) 70%),
                 linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.5}) 0%, rgba(0,0,0,${overlayOpacity * 1.2}) 100%)`
          }}
        />
      )}

      {/* Only add subtle effects if not minimalist */}
      {!minimalist && (
        <>
          {/* Subtle vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)"
            }}
          />

          {/* Very subtle scan line */}
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            animate={{
              y: ["0vh", "100vh"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}

      {/* Content */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}