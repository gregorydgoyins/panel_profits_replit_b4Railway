import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import darkRainyCityImage1 from '@assets/stock_images/dark_rainy_city_stre_a2f53200.jpg';
import darkRainyCityImage2 from '@assets/stock_images/dark_rainy_city_stre_279816f5.jpg';
import darkRainyCityImage3 from '@assets/stock_images/dark_rainy_city_stre_eb2ad3bc.jpg';

// Typewriter animation component
function TypewriterText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <div className={className}>
      {displayText}
      {isTyping && displayText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}

export function LandingPage() {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);
  
  // Scroll progress for each scene
  const scene1Progress = useTransform(scrollY, [0, 800], [0, 1]);
  const scene2Progress = useTransform(scrollY, [800, 1600], [0, 1]);
  const scene3Progress = useTransform(scrollY, [1600, 2400], [0, 1]);
  const scene4Progress = useTransform(scrollY, [2400, 3200], [0, 1]);
  const scene5Progress = useTransform(scrollY, [3200, 4000], [0, 1]);
  
  // Noir video sources from free stock video sites
  const videoSources = {
    // Scene 1: Overhead rain shot - dark rain on city streets
    rain: "https://cdn.pixabay.com/video/2024/02/08/199879_large.mp4",
    // Scene 2: Street crossing - person walking in urban environment
    streetWalk: "https://cdn.pixabay.com/video/2020/04/20/36634-410769783_large.mp4",
    // Scene 3: Face reveal - dramatic portrait shot
    portrait: "https://cdn.pixabay.com/video/2023/09/24/181894_large.mp4",
    // Scene 4: Building exterior - urban architecture at night
    building: "https://cdn.pixabay.com/video/2019/11/22/29297-374659322_large.mp4",
    // Scene 5: Final monologue - abstract dark scene
    finale: "https://cdn.pixabay.com/video/2024/08/24/228197_large.mp4"
  };

  // Narrative text for each scene
  const narratives = [
    {
      text: "The rain seems to always be falling on the streets of Panelwon. It's how the city washes the grit and grime from under its nails as it rips through the souls of lesser men... but not you...",
      delay: 1000
    },
    {
      text: "The Mastermind - a would-be soothsayer, a part-time hoodlum, and a full-time broker",
      delay: 500
    },
    {
      text: "Sequential Securities has always been one of the quieter houses in town... but not today",
      delay: 500
    },
    {
      text: "Today The Mastermind needs a place to hang his shingle. He brought his book of clients but he's not looking for a handout",
      delay: 500
    },
    {
      text: "Any firm would be glad to have the wolf of wall street... No, today he's got one thing on his mind. Payback. And karma's a motherfucking bitch...",
      delay: 500
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sceneHeight = 800;
      const newScene = Math.floor(scrollPosition / sceneHeight);
      if (newScene !== currentScene && newScene >= 0 && newScene <= 5) {
        setCurrentScene(newScene);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentScene]);

  // Film grain effect component
  const FilmGrain = () => (
    <div 
      className="absolute inset-0 pointer-events-none z-30 opacity-40"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay"
      }}
    />
  );

  // Rain effect overlay
  const RainOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(180deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 3px)`,
          backgroundSize: "100% 100px",
          animation: "rain 0.3s linear infinite"
        }}
      />
    </div>
  );

  // CSS for rain animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rain {
        0% { transform: translateY(-100px); }
        100% { transform: translateY(100px); }
      }
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: "4800px" }}>
      {/* Scene 1: Overhead POV of rainy street */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ opacity: useTransform(scrollY, [0, 800, 1600], [1, 1, 0]) }}
      >
        <div className="relative w-full h-full">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.3) contrast(1.4) saturate(0.2)" }}
            data-testid="noir-video-rain"
          >
            <source src={videoSources.rain} type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img 
              src={darkRainyCityImage1} 
              alt="Rain on city streets" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.3) contrast(1.4) saturate(0.2)" }}
            />
          </video>

          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          <FilmGrain />
          <RainOverlay />

          {/* Voiceover text */}
          <AnimatePresence>
            {currentScene === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end justify-center pb-32 px-8 z-40"
              >
                <TypewriterText
                  text={narratives[0].text}
                  delay={narratives[0].delay}
                  className="text-2xl md:text-4xl font-light text-gray-200 max-w-4xl text-center font-mono tracking-wide"
                  style={{ textShadow: "0 0 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Scene 2: The Mastermind crossing the street */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ 
          opacity: useTransform(scrollY, [600, 800, 1600, 2400], [0, 1, 1, 0]),
          display: currentScene >= 1 && currentScene <= 2 ? "block" : "none"
        }}
      >
        <div className="relative w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.4) contrast(1.3) saturate(0.1)" }}
            data-testid="noir-video-streetwalk"
          >
            <source src={videoSources.streetWalk} type="video/mp4" />
            <img 
              src={darkRainyCityImage2} 
              alt="Street crossing" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.4) contrast(1.3) saturate(0.1)" }}
            />
          </video>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
          
          <FilmGrain />

          {/* Graphic novel style panel borders */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-0 left-0 w-1/3 h-full border-r-4 border-black" />
            <div className="absolute top-0 right-0 w-1/3 h-full border-l-4 border-black" />
          </div>

          <AnimatePresence>
            {currentScene === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-20 left-10 right-10 z-40"
              >
                <div className="bg-black/80 p-6 border-2 border-white/20 backdrop-blur-sm">
                  <TypewriterText
                    text={narratives[1].text}
                    delay={narratives[1].delay}
                    className="text-xl md:text-3xl font-bold text-red-500 font-mono tracking-tight uppercase"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(255,0,0,0.3)" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Scene 3: Medium shot revealing face */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ 
          opacity: useTransform(scrollY, [1400, 1600, 2400, 3200], [0, 1, 1, 0]),
          display: currentScene >= 2 && currentScene <= 3 ? "block" : "none"
        }}
      >
        <div className="relative w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.35) contrast(1.5) saturate(0)" }}
            data-testid="noir-video-portrait"
          >
            <source src={videoSources.portrait} type="video/mp4" />
            <img 
              src={darkRainyCityImage3} 
              alt="Portrait shot" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.35) contrast(1.5) saturate(0)" }}
            />
          </video>

          {/* Venetian blind effect */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.5) 3px, rgba(0,0,0,0.5) 6px)`,
            }}
          />
          
          <FilmGrain />

          <AnimatePresence>
            {currentScene === 2 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-40"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-red-600/20 blur-xl" />
                  <div className="relative bg-black p-8 border-4 border-white/10 backdrop-blur-sm">
                    <TypewriterText
                      text={narratives[2].text}
                      delay={narratives[2].delay}
                      className="text-lg md:text-2xl text-gray-300 font-mono max-w-2xl"
                      style={{ textShadow: "0 0 10px rgba(255,0,0,0.3), 0 2px 4px rgba(0,0,0,0.8)" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Scene 4: Sequential Securities building */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ 
          opacity: useTransform(scrollY, [2200, 2400, 3200, 4000], [0, 1, 1, 0]),
          display: currentScene >= 3 && currentScene <= 4 ? "block" : "none"
        }}
      >
        <div className="relative w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.3) contrast(1.6) saturate(0.15) hue-rotate(10deg)" }}
            data-testid="noir-video-building"
          >
            <source src={videoSources.building} type="video/mp4" />
            <img 
              src={darkRainyCityImage1} 
              alt="Building exterior" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.3) contrast(1.6) saturate(0.15) hue-rotate(10deg)" }}
            />
          </video>

          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)`
          }} />
          
          <FilmGrain />

          {/* Building sign overlay with neon effect */}
          <motion.div 
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentScene === 3 ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white/80 tracking-wider"
              style={{
                textShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,0,0,0.3), 0 2px 4px rgba(0,0,0,0.9)",
                fontFamily: "'Space Grotesk', monospace",
                animation: "flicker 3s infinite"
              }}
            >
              SEQUENTIAL SECURITIES
            </h2>
          </motion.div>

          <AnimatePresence>
            {currentScene === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute bottom-32 left-10 right-10 z-40"
              >
                <TypewriterText
                  text={narratives[3].text}
                  delay={narratives[3].delay}
                  className="text-xl md:text-2xl text-yellow-400/90 font-mono max-w-3xl"
                  style={{ textShadow: "0 0 20px rgba(0,0,0,1), 0 0 40px rgba(255,200,0,0.2)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Scene 5: Final monologue and CTA */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ 
          opacity: useTransform(scrollY, [3000, 3200, 4800], [0, 1, 1]),
          display: currentScene >= 4 ? "block" : "none"
        }}
      >
        <div className="relative w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.25) contrast(2) saturate(0)" }}
            data-testid="noir-video-finale"
          >
            <source src={videoSources.finale} type="video/mp4" />
            <img 
              src={darkRainyCityImage2} 
              alt="Final scene" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.25) contrast(2) saturate(0)" }}
            />
          </video>

          {/* Heavy dark overlay for final scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
          
          <FilmGrain />
          
          {/* Blood splatter effect */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-red-600/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
            <AnimatePresence>
              {currentScene >= 4 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mb-16 px-8"
                  >
                    <TypewriterText
                      text={narratives[4].text}
                      delay={narratives[4].delay}
                      className="text-2xl md:text-3xl text-white font-mono max-w-4xl text-center italic"
                      style={{ 
                        textShadow: "0 0 30px rgba(255,0,0,0.5), 2px 2px 4px rgba(0,0,0,1)",
                        lineHeight: "1.6"
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-red-900/50 border-2 border-red-500 text-white hover:bg-red-800/70 hover:border-red-400 backdrop-blur-sm px-12 py-8 text-xl font-bold tracking-widest transition-all duration-500 transform hover:scale-105"
                      onClick={() => window.location.href = "/trading"}
                      data-testid="button-enter-sequential"
                      style={{
                        textShadow: "0 0 20px rgba(255,0,0,0.5)",
                        boxShadow: "0 0 40px rgba(255,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5)"
                      }}
                    >
                      ENTER SEQUENTIAL SECURITIES
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Scroll indicator */}
      {currentScene < 4 && (
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/40 text-sm font-mono tracking-widest flex flex-col items-center"
          >
            <span>SCROLL</span>
            <div className="mt-2 w-px h-8 bg-white/20" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}