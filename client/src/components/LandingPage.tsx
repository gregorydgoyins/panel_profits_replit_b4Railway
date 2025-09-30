import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import darkRainyCityImage1 from '@assets/stock_images/dark_rainy_city_stre_a2f53200.jpg';
import darkRainyCityImage2 from '@assets/stock_images/dark_rainy_city_stre_279816f5.jpg';
import darkRainyCityImage3 from '@assets/stock_images/dark_rainy_city_stre_eb2ad3bc.jpg';

// Typewriter animation component
function TypewriterText({ text, delay = 0, className = "", style }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) {
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
    <div className={className} style={style}>
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

  // Enhanced CSS rain effect with multiple layers
  const RainEffect = () => (
    <>
      {/* Primary rain layer */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
            backgroundSize: '2px 100px',
            animation: 'rainFall 0.5s linear infinite'
          }}
        />
      </div>
      {/* Secondary rain layer for depth */}
      <div className="absolute inset-0 pointer-events-none z-21 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 60%, transparent 100%)`,
            backgroundSize: '3px 120px',
            animation: 'rainFall 0.7s linear infinite'
          }}
        />
      </div>
      {/* Rain splash effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-22">
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50" />
      </div>
    </>
  );

  // CSS animations and keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainFall {
        0% { 
          background-position: 0 -100px;
        }
        100% { 
          background-position: 0 100px;
        }
      }
      
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes neonFlicker {
        0%, 100% { 
          opacity: 1;
          filter: brightness(1) blur(0px);
        }
        20% {
          opacity: 0.9;
          filter: brightness(0.9) blur(0.5px);
        }
        40% {
          opacity: 0.95;
          filter: brightness(0.95) blur(0px);
        }
      }
      
      @keyframes silhouetteWalk {
        0% { transform: translateX(-100vw) scaleX(1); }
        50% { transform: translateX(0) scaleX(1); }
        100% { transform: translateX(100vw) scaleX(1); }
      }
      
      @keyframes buildingPerspective {
        0% { transform: rotateX(0deg) rotateY(0deg); }
        50% { transform: rotateX(2deg) rotateY(-2deg); }
        100% { transform: rotateX(0deg) rotateY(0deg); }
      }
      
      @keyframes lightningFlash {
        0%, 100% { opacity: 0; }
        5% { opacity: 0.3; }
        10% { opacity: 0; }
        15% { opacity: 0.2; }
        20% { opacity: 0; }
      }
      
      @keyframes venetianBlinds {
        0% { transform: translateY(0); }
        100% { transform: translateY(6px); }
      }
      
      @keyframes bloodDrip {
        0% { 
          transform: translateY(0) scaleY(0);
          opacity: 0;
        }
        20% {
          transform: translateY(0) scaleY(0.3);
          opacity: 0.8;
        }
        100% { 
          transform: translateY(100vh) scaleY(1);
          opacity: 0;
        }
      }

      @keyframes cityLights {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      
      @keyframes smokeFloat {
        0% { 
          transform: translateX(0) translateY(0) scale(1);
          opacity: 0.15;
        }
        50% { 
          transform: translateX(30px) translateY(-50px) scale(1.2);
          opacity: 0.25;
        }
        100% { 
          transform: translateX(-20px) translateY(-100px) scale(1.5);
          opacity: 0;
        }
      }

      .rain-layer {
        background-image: repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        );
      }
      
      .building-window {
        background: linear-gradient(135deg, transparent 30%, rgba(255, 200, 0, 0.1) 50%, transparent 70%);
        animation: cityLights 4s ease-in-out infinite;
        animation-delay: calc(var(--delay) * 0.1s);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Animated silhouette component for The Mastermind
  const MastermindSilhouette = ({ scene }: { scene: number }) => {
    if (scene !== 1) return null;
    
    return (
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {/* Walking silhouette */}
        <div 
          className="absolute bottom-20 h-64 w-32"
          style={{
            animation: 'silhouetteWalk 8s ease-in-out infinite',
            background: `linear-gradient(to top, black, rgba(0,0,0,0.8))`,
            clipPath: `polygon(40% 0%, 60% 0%, 65% 20%, 70% 40%, 65% 60%, 60% 80%, 55% 100%, 45% 100%, 40% 80%, 35% 60%, 30% 40%, 35% 20%)`,
            filter: 'blur(1px)'
          }}
        />
        {/* Shadow */}
        <div 
          className="absolute bottom-16 h-4 w-40"
          style={{
            animation: 'silhouetteWalk 8s ease-in-out infinite',
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent)`,
            filter: 'blur(8px)'
          }}
        />
      </motion.div>
    );
  };

  // Building facade with windows
  const BuildingFacade = () => (
    <div className="absolute inset-0 pointer-events-none z-15">
      <div 
        className="absolute inset-0 flex flex-wrap justify-center items-center p-8"
        style={{
          perspective: '1000px',
          animation: 'buildingPerspective 10s ease-in-out infinite'
        }}
      >
        {/* Create a grid of windows */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="building-window m-2 w-16 h-20 bg-black border border-gray-800"
            style={{
              '--delay': i,
              boxShadow: 'inset 0 0 20px rgba(255, 200, 0, 0.05)'
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );

  // Lightning flash effect
  const LightningFlash = () => (
    <div 
      className="absolute inset-0 pointer-events-none z-50 bg-white"
      style={{
        animation: 'lightningFlash 10s ease-in-out infinite',
        mixBlendMode: 'overlay'
      }}
    />
  );

  // Smoke/fog effect
  const SmokeEffect = () => (
    <div className="absolute inset-0 pointer-events-none z-18">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 w-full h-1/2"
          style={{
            background: `radial-gradient(ellipse at bottom, rgba(150, 150, 150, 0.1) 0%, transparent 70%)`,
            animation: `smokeFloat ${10 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
            filter: 'blur(20px)'
          }}
        />
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: "4800px" }}>
      {/* Scene 1: Overhead POV of rainy street */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ opacity: useTransform(scrollY, [0, 800, 1600], [1, 1, 0]) }}
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Background image with parallax */}
          <motion.div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${darkRainyCityImage1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: "brightness(0.3) contrast(1.4) saturate(0.2)",
              scale: useTransform(scene1Progress, [0, 1], [1, 1.1])
            }}
          />

          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          {/* Animated rain layers */}
          <RainEffect />
          
          {/* Film grain */}
          <FilmGrain />
          
          {/* Lightning effect */}
          <LightningFlash />
          
          {/* City lights reflection on wet street */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(255, 200, 0, 0.05) 0%, transparent 100%)`,
                animation: 'cityLights 3s ease-in-out infinite'
              }}
            />
          </div>

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
        <div className="relative w-full h-full overflow-hidden">
          {/* Background with perspective shift */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${darkRainyCityImage2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: "brightness(0.4) contrast(1.3) saturate(0.1)",
              transform: useTransform(scene2Progress, [0, 1], ['perspective(1000px) rotateY(0deg)', 'perspective(1000px) rotateY(2deg)'])
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
          
          {/* Animated silhouette of The Mastermind */}
          <MastermindSilhouette scene={currentScene} />
          
          {/* Rain effect */}
          <RainEffect />
          
          <FilmGrain />
          
          {/* Smoke effect */}
          <SmokeEffect />

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

      {/* Scene 3: Medium shot revealing character */}
      <motion.section 
        className="fixed inset-0 w-full h-screen"
        style={{ 
          opacity: useTransform(scrollY, [1400, 1600, 2400, 3200], [0, 1, 1, 0]),
          display: currentScene >= 2 && currentScene <= 3 ? "block" : "none"
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${darkRainyCityImage3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: "brightness(0.35) contrast(1.5) saturate(0)"
            }}
          />

          {/* Venetian blind effect - animated */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full bg-black"
                style={{
                  height: '5%',
                  top: `${i * 5}%`,
                  opacity: 0.5,
                  animation: 'venetianBlinds 4s ease-in-out infinite',
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
          
          <FilmGrain />

          {/* Character silhouette in center */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-64 h-96 bg-gradient-to-b from-black/80 to-transparent rounded-t-full blur-xl" />
          </motion.div>

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
        <div className="relative w-full h-full overflow-hidden">
          {/* Background with building */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${darkRainyCityImage1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: "brightness(0.3) contrast(1.6) saturate(0.15) hue-rotate(10deg)"
            }}
          />

          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)`
          }} />
          
          {/* 3D Building facade */}
          <BuildingFacade />
          
          <FilmGrain />
          
          {/* Rain effect */}
          <RainEffect />

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
                animation: "neonFlicker 3s infinite"
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
        <div className="relative w-full h-full overflow-hidden">
          {/* Dark dramatic background */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${darkRainyCityImage2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: "brightness(0.25) contrast(2) saturate(0)"
            }}
          />

          {/* Heavy dark overlay for final scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
          
          <FilmGrain />
          
          {/* Animated blood drip effects */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-1 bg-gradient-to-b from-red-600 to-red-900"
              style={{
                left: `${20 + i * 30}%`,
                height: '200px',
                animation: `bloodDrip ${8 + i * 2}s ease-in infinite`,
                animationDelay: `${i * 2}s`,
                filter: 'blur(2px)'
              }}
            />
          ))}
          
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
                      onClick={() => window.location.href = "/api/login"}
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