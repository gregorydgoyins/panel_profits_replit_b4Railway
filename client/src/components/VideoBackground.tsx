import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoBackgroundProps {
  videoUrl?: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export function VideoBackground({
  videoUrl = "https://cdn.pixabay.com/video/2024/08/24/228197_large.mp4", // Epic dark cinematic placeholder - user can replace
  fallbackImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3072&auto=format&fit=crop", // Dark ocean storm fallback
  overlay = true,
  overlayOpacity = 0.5,
  children
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [dataRainElements, setDataRainElements] = useState<number[]>([]);

  useEffect(() => {
    // Create data rain effect elements
    const elements = Array.from({ length: 30 }, (_, i) => i);
    setDataRainElements(elements);
  }, []);

  const handleVideoError = () => {
    setShowFallback(true);
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
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
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ filter: "brightness(0.4) contrast(1.2)" }}
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
              filter: "brightness(0.4) contrast(1.2)"
            }}
            data-testid="image-fallback"
          />
        )}
      </AnimatePresence>

      {/* Dark Overlay with Gradient */}
      {overlay && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at top, transparent 0%, rgba(0,0,0,${overlayOpacity}) 50%),
              linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.5}) 0%, rgba(0,0,0,${overlayOpacity * 1.2}) 100%)
            `
          }}
        />
      )}

      {/* Matrix-style Data Rain Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dataRainElements.map((i) => (
          <motion.div
            key={i}
            className="absolute text-green-500/20 font-mono text-xs"
            initial={{ 
              x: `${Math.random() * 100}%`,
              y: -20 
            }}
            animate={{ 
              y: "110vh",
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              writingMode: "vertical-rl",
              textOrientation: "upright"
            }}
          >
            {Array.from({ length: 20 }, () => 
              Math.random() > 0.5 ? Math.floor(Math.random() * 2) : 
              String.fromCharCode(65 + Math.floor(Math.random() * 26))
            ).join("")}
          </motion.div>
        ))}
      </div>

      {/* Lightning Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none lightning-container" />

      {/* Lens Flare Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none">
        <div className="lens-flare" />
      </div>

      {/* Energy Grid Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="cyan" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          animate={{
            y: ["0vh", "100vh"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
          animate={{
            y: ["100vh", "0vh"]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 1.5
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}