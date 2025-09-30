import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import darkRainyCityImage1 from '@assets/stock_images/dark_rainy_city_stre_a2f53200.jpg';
import darkRainyCityImage2 from '@assets/stock_images/dark_rainy_city_stre_279816f5.jpg';
import darkRainyCityImage3 from '@assets/stock_images/dark_rainy_city_stre_eb2ad3bc.jpg';

// Typewriter component for caption text
function TypewriterCaption({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <>{displayText}</>;
}

// Speech bubble component
function SpeechBubble({ text, position, delay = 0 }: { text: string; position: 'left' | 'right'; delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className={`absolute ${position === 'left' ? 'left-4' : 'right-4'} top-8 z-30`}
    >
      <div className="relative bg-white rounded-2xl px-4 py-2 shadow-2xl max-w-[150px]">
        <div className="text-black text-sm font-bold comic-font">{text}</div>
        <div className={`absolute -bottom-2 ${position === 'left' ? 'left-4' : 'right-4'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white`} />
      </div>
    </motion.div>
  );
}

// Caption box component
function CaptionBox({ text, position = 'bottom', delay = 0 }: { text: string; position?: 'top' | 'bottom'; delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-20`}
    >
      <div className="bg-black/95 border-2 border-yellow-400/80 px-4 py-3">
        <div className="text-yellow-400 text-sm font-mono leading-tight">
          <TypewriterCaption text={text} delay={100} />
        </div>
      </div>
    </motion.div>
  );
}

// Comic panel component
function ComicPanel({ 
  id, 
  backgroundImage,
  backgroundColor = 'bg-gray-900',
  children, 
  delay = 0,
  kenBurnsType = 'zoomIn'
}: { 
  id: number;
  backgroundImage?: string;
  backgroundColor?: string;
  children: React.ReactNode;
  delay?: number;
  kenBurnsType?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsRevealed(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  // Ken Burns animation classes
  const kenBurnsClasses = {
    zoomIn: 'ken-burns-zoom-in',
    zoomOut: 'ken-burns-zoom-out',
    panLeft: 'ken-burns-pan-left',
    panRight: 'ken-burns-pan-right'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isRevealed ? 1 : 0, 
        scale: isRevealed ? 1 : 0.8,
        filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
      }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden border-4 border-black ${isHovered ? 'z-40' : 'z-10'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
      data-testid={`comic-panel-${id}`}
    >
      {/* Panel background */}
      <div className={`absolute inset-0 ${backgroundColor}`}>
        {backgroundImage && (
          <div 
            className={`absolute inset-0 ${kenBurnsClasses[kenBurnsType]}`}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.4) contrast(1.5) saturate(0.3)'
            }}
          />
        )}
        
        {/* Crosshatch overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px),
                            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`
          }}
        />
        
        {/* Film grain */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Panel content */}
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  // CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ken-burns-zoom-in {
        0% { transform: scale(1); }
        100% { transform: scale(1.15); }
      }
      
      @keyframes ken-burns-zoom-out {
        0% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      
      @keyframes ken-burns-pan-left {
        0% { transform: scale(1.1) translateX(5%); }
        100% { transform: scale(1.1) translateX(-5%); }
      }
      
      @keyframes ken-burns-pan-right {
        0% { transform: scale(1.1) translateX(-5%); }
        100% { transform: scale(1.1) translateX(5%); }
      }
      
      .ken-burns-zoom-in {
        animation: ken-burns-zoom-in 20s ease-in-out infinite alternate;
      }
      
      .ken-burns-zoom-out {
        animation: ken-burns-zoom-out 20s ease-in-out infinite alternate;
      }
      
      .ken-burns-pan-left {
        animation: ken-burns-pan-left 25s ease-in-out infinite alternate;
      }
      
      .ken-burns-pan-right {
        animation: ken-burns-pan-right 25s ease-in-out infinite alternate;
      }
      
      @keyframes grain {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -5%); }
        20% { transform: translate(-10%, 5%); }
        30% { transform: translate(5%, -10%); }
        40% { transform: translate(-5%, 15%); }
        50% { transform: translate(-10%, 5%); }
        60% { transform: translate(15%, 0); }
        70% { transform: translate(0, 10%); }
        80% { transform: translate(-15%, 0); }
        90% { transform: translate(10%, 5%); }
        100% { transform: translate(0, 0); }
      }
      
      .animate-grain {
        animation: grain 8s steps(10) infinite;
      }
      
      .comic-font {
        font-family: 'Space Grotesk', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      @keyframes rain {
        0% { background-position: 0 0; }
        100% { background-position: 0 100px; }
      }
      
      .rain-effect {
        background-image: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
        background-size: 2px 100px;
        animation: rain 0.5s linear infinite;
      }
      
      @keyframes lightning {
        0%, 100% { opacity: 0; }
        5% { opacity: 0.5; }
        10% { opacity: 0; }
      }
      
      .lightning-flash {
        animation: lightning 8s ease-in-out infinite;
      }
      
      @keyframes neon-glow {
        0%, 100% { 
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.8),
                      0 0 20px rgba(255, 0, 0, 0.6),
                      0 0 30px rgba(255, 0, 0, 0.4);
        }
        50% { 
          text-shadow: 0 0 15px rgba(255, 0, 0, 1),
                      0 0 30px rgba(255, 0, 0, 0.8),
                      0 0 45px rgba(255, 0, 0, 0.6);
        }
      }
      
      .neon-text {
        animation: neon-glow 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Comic panel grid - 3x3 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 p-2 h-full">
        
        {/* Panel 1: Rain on Panelwon streets (overhead view) */}
        <ComicPanel id={1} backgroundImage={darkRainyCityImage1} delay={0} kenBurnsType="zoomIn">
          <CaptionBox 
            text="The rain seems to always be falling on the streets of Panelwon..." 
            position="top"
            delay={500}
          />
          {/* Rain effect overlay */}
          <div className="absolute inset-0 rain-effect opacity-30 pointer-events-none" />
          {/* Red neon sign accent */}
          <div className="absolute top-1/3 right-8 text-red-500 text-2xl font-bold neon-text transform rotate-12">
            BAR
          </div>
        </ComicPanel>

        {/* Panel 2: The Mastermind's feet stepping into puddle */}
        <ComicPanel id={2} backgroundColor="bg-gray-950" delay={200} kenBurnsType="panRight">
          <div className="absolute inset-0 flex items-end justify-center">
            {/* Feet silhouette */}
            <div className="relative w-full h-1/2">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-black" 
                style={{
                  clipPath: 'polygon(35% 0%, 65% 0%, 70% 60%, 65% 100%, 55% 100%, 50% 60%, 45% 100%, 35% 100%, 30% 60%)'
                }}
              />
              {/* Puddle reflection with red tint */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-900/20 to-transparent blur-sm" />
            </div>
          </div>
          <CaptionBox 
            text="It washes the grit from under its nails..." 
            position="bottom"
            delay={700}
          />
        </ComicPanel>

        {/* Panel 3: Wide shot - crossing street, cars stopping */}
        <ComicPanel id={3} backgroundImage={darkRainyCityImage2} delay={400} kenBurnsType="panLeft">
          {/* Silhouette crossing */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-32 bg-black/80 transform rotate-3"
              style={{
                clipPath: 'polygon(40% 0%, 60% 0%, 65% 30%, 60% 100%, 40% 100%, 35% 30%)'
              }}
            />
          </div>
          {/* Car headlights - yellow accent */}
          <div className="absolute bottom-8 left-8 flex gap-4">
            <div className="w-6 h-6 bg-yellow-400 rounded-full blur-xl opacity-80" />
            <div className="w-6 h-6 bg-yellow-400 rounded-full blur-xl opacity-80" />
          </div>
          <CaptionBox 
            text="The Mastermind... a would-be soothsayer" 
            position="top"
            delay={900}
          />
        </ComicPanel>

        {/* Panel 4: Close-up of face under fedora brim */}
        <ComicPanel id={4} backgroundColor="bg-gray-900" delay={600} kenBurnsType="zoomOut">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Fedora shadow */}
            <div className="relative">
              <div className="w-48 h-48 bg-black rounded-full transform -translate-y-12"
                style={{
                  clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'
                }}
              />
              {/* Eyes glint - red accent */}
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            </div>
          </div>
          <CaptionBox 
            text="A part-time hoodlum, full-time broker" 
            position="bottom"
            delay={1100}
          />
        </ComicPanel>

        {/* Panel 5: Sequential Securities building facade */}
        <ComicPanel id={5} backgroundImage={darkRainyCityImage3} delay={800} kenBurnsType="zoomIn">
          {/* Building sign with neon effect */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
            <div className="text-yellow-400 text-xl font-bold tracking-wider neon-text">
              SEQUENTIAL
            </div>
            <div className="text-yellow-400 text-xl font-bold tracking-wider neon-text">
              SECURITIES
            </div>
          </div>
          {/* Lightning flash effect */}
          <div className="absolute inset-0 bg-white opacity-0 lightning-flash pointer-events-none" />
          <CaptionBox 
            text="One of the quieter houses... but not today" 
            position="top"
            delay={1300}
          />
        </ComicPanel>

        {/* Panel 6: Two guards talking */}
        <ComicPanel id={6} backgroundColor="bg-gray-950" delay={1000} kenBurnsType="panRight">
          <div className="absolute inset-0 flex items-center justify-around">
            {/* Guard 1 silhouette */}
            <div className="w-20 h-32 bg-black/90 rounded-t-full" />
            {/* Guard 2 silhouette */}
            <div className="w-20 h-32 bg-black/90 rounded-t-full" />
          </div>
          <SpeechBubble text="Who's that?" position="left" delay={1500} />
          <SpeechBubble text="Trouble." position="right" delay={2000} />
        </ComicPanel>

        {/* Panel 7: The Mastermind at entrance */}
        <ComicPanel id={7} backgroundImage={darkRainyCityImage1} delay={1200} kenBurnsType="panLeft">
          <div className="absolute inset-0 flex items-end justify-center">
            {/* Figure at door */}
            <div className="w-32 h-48 bg-black mb-4"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 75% 50%, 70% 100%, 30% 100%, 25% 50%)'
              }}
            />
            {/* Door frame with red accent */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-3/4 border-4 border-red-800/50" />
          </div>
          <CaptionBox 
            text="Today he's not looking for a handout..." 
            position="top"
            delay={1500}
          />
        </ComicPanel>

        {/* Panel 8: Hand on door handle */}
        <ComicPanel id={8} backgroundColor="bg-gray-900" delay={1400} kenBurnsType="zoomIn">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Hand silhouette */}
            <div className="relative">
              <div className="w-32 h-32 bg-black transform rotate-45"
                style={{
                  clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'
                }}
              />
              {/* Blood drop - red accent */}
              <div className="absolute top-1/2 left-1/2 w-2 h-8 bg-red-600 rounded-full transform translate-y-full"
                style={{
                  animation: 'drip 3s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          <CaptionBox 
            text="He's got one thing on his mind..." 
            position="bottom"
            delay={1700}
          />
        </ComicPanel>

        {/* Panel 9: SEQUENTIAL SECURITIES sign with ENTER button */}
        <ComicPanel id={9} backgroundColor="bg-black" delay={1600} kenBurnsType="zoomOut">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Main title with dramatic styling */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-red-600 tracking-wider mb-2 neon-text">
                SEQUENTIAL
              </h1>
              <h1 className="text-3xl font-black text-red-600 tracking-wider neon-text">
                SECURITIES
              </h1>
            </div>
            
            {/* Enter button */}
            <Button 
              size="lg" 
              className="bg-red-900/70 border-2 border-yellow-400 text-yellow-400 hover:bg-red-800 hover:text-yellow-300 px-8 py-4 text-xl font-bold tracking-widest transform hover:scale-110 transition-all duration-300"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-enter-sequential"
              style={{
                boxShadow: '0 0 30px rgba(255, 200, 0, 0.5), inset 0 0 20px rgba(0,0,0,0.8)'
              }}
            >
              ENTER
            </Button>
          </div>
          <CaptionBox 
            text="Payback. And karma's a motherfucking bitch." 
            position="bottom"
            delay={1900}
          />
        </ComicPanel>
      </div>

      {/* Overall film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}