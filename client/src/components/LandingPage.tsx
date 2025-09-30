import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import darkRainyCityImage1 from '@assets/stock_images/dark_rainy_city_stre_a2f53200.jpg';
import darkRainyCityImage2 from '@assets/stock_images/dark_rainy_city_stre_279816f5.jpg';
import darkRainyCityImage3 from '@assets/stock_images/dark_rainy_city_stre_eb2ad3bc.jpg';

// Caption box component
function CaptionBox({ text, delay = 0 }: { text: string; delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute z-30 bg-black border-2 border-white px-3 py-2 max-w-[250px]"
      style={{
        top: '10px',
        left: '10px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.8)'
      }}
    >
      <div className="text-white text-xs font-mono uppercase leading-tight tracking-wider">
        {text}
      </div>
    </motion.div>
  );
}

// Speech bubble component
function SpeechBubble({ text, position, delay = 0 }: { 
  text: string; 
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number 
}) {
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
      className="absolute z-30"
      style={position}
    >
      <div className="relative bg-white rounded-2xl px-4 py-2 shadow-2xl">
        <div className="text-black text-sm font-bold uppercase">{text}</div>
        <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white" />
      </div>
    </motion.div>
  );
}

// Sound effect component
function SoundEffect({ text, position, delay = 0, size = "large" }: { 
  text: string; 
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  size?: "small" | "medium" | "large" | "huge";
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  const sizeClasses = {
    small: "text-2xl",
    medium: "text-4xl",
    large: "text-6xl",
    huge: "text-8xl"
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400 }}
      className={`absolute z-35 font-black ${sizeClasses[size]}`}
      style={{
        ...position,
        color: '#fff',
        textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
        transform: 'rotate(-5deg)',
        fontFamily: 'Impact, sans-serif'
      }}
    >
      {text}
    </motion.div>
  );
}

// Comic panel component with irregular sizing
function ComicPanel({ 
  id,
  gridArea,
  backgroundImage,
  backgroundColor = 'bg-gray-900',
  children, 
  delay = 0,
  kenBurnsType = 'zoomIn',
  isRevealed,
  onReveal
}: { 
  id: number;
  gridArea: string;
  backgroundImage?: string;
  backgroundColor?: string;
  children: React.ReactNode;
  delay?: number;
  kenBurnsType?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown';
  isRevealed: boolean;
  onReveal?: () => void;
}) {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (isRevealed && !isActivated) {
      const timeout = setTimeout(() => {
        setIsActivated(true);
        if (onReveal) onReveal();
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed, delay, isActivated, onReveal]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActivated ? 1 : 0.3,
        scale: isActivated ? 1 : 0.9,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden border-8 border-black shadow-2xl ${isActivated ? 'z-20' : 'z-10'}`}
      style={{ 
        gridArea,
        transform: isActivated ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      data-testid={`comic-panel-${id}`}
    >
      {/* Panel background */}
      <div className={`absolute inset-0 ${backgroundColor}`}>
        {backgroundImage && (
          <div 
            className={`absolute inset-0 ${isActivated ? `ken-burns-${kenBurnsType}` : ''}`}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3) contrast(1.8) saturate(0)'
            }}
          />
        )}
        
        {/* Crosshatch overlay */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
                            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)`
          }}
        />
      </div>

      {/* Panel content */}
      <div className="relative h-full">
        {children}
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const [showOverview, setShowOverview] = useState(true);
  const [panelsRevealed, setPanelsRevealed] = useState<boolean[]>(Array(9).fill(false));
  const [allPanelsRevealed, setAllPanelsRevealed] = useState(false);

  // Start sequential reveal after overview
  useEffect(() => {
    const overviewTimer = setTimeout(() => {
      setShowOverview(false);
      // Start revealing panels one by one
      panelsRevealed.forEach((_, index) => {
        setTimeout(() => {
          setPanelsRevealed(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 300); // Stagger each panel by 300ms
      });
    }, 2000); // Show overview for 2 seconds

    return () => clearTimeout(overviewTimer);
  }, []);

  // Check if all panels are revealed
  useEffect(() => {
    if (panelsRevealed.every(p => p)) {
      setAllPanelsRevealed(true);
    }
  }, [panelsRevealed]);

  // CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ken-burns-zoomIn {
        0% { transform: scale(1); }
        100% { transform: scale(1.2); }
      }
      
      @keyframes ken-burns-zoomOut {
        0% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      @keyframes ken-burns-panLeft {
        0% { transform: scale(1.15) translateX(5%); }
        100% { transform: scale(1.15) translateX(-5%); }
      }
      
      @keyframes ken-burns-panRight {
        0% { transform: scale(1.15) translateX(-5%); }
        100% { transform: scale(1.15) translateX(5%); }
      }
      
      @keyframes ken-burns-panUp {
        0% { transform: scale(1.15) translateY(5%); }
        100% { transform: scale(1.15) translateY(-5%); }
      }
      
      @keyframes ken-burns-panDown {
        0% { transform: scale(1.15) translateY(-5%); }
        100% { transform: scale(1.15) translateY(5%); }
      }
      
      .ken-burns-zoomIn {
        animation: ken-burns-zoomIn 20s ease-in-out infinite alternate;
      }
      
      .ken-burns-zoomOut {
        animation: ken-burns-zoomOut 20s ease-in-out infinite alternate;
      }
      
      .ken-burns-panLeft {
        animation: ken-burns-panLeft 25s ease-in-out infinite alternate;
      }
      
      .ken-burns-panRight {
        animation: ken-burns-panRight 25s ease-in-out infinite alternate;
      }
      
      .ken-burns-panUp {
        animation: ken-burns-panUp 22s ease-in-out infinite alternate;
      }
      
      .ken-burns-panDown {
        animation: ken-burns-panDown 22s ease-in-out infinite alternate;
      }
      
      @keyframes ticker-scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      
      @keyframes float-left {
        0% { transform: translateX(100vw) rotate(2deg); }
        100% { transform: translateX(-100%) rotate(-2deg); }
      }
      
      @keyframes float-right {
        0% { transform: translateX(-100%) rotate(-2deg); }
        100% { transform: translateX(100vw) rotate(2deg); }
      }
      
      @keyframes rain {
        0% { background-position: 0 0; }
        100% { background-position: -10px 100px; }
      }
      
      .rain-effect {
        background-image: linear-gradient(180deg, 
          transparent 0%, 
          rgba(255,255,255,0.02) 50%, 
          transparent 100%);
        background-size: 3px 100px;
        animation: rain 0.3s linear infinite;
      }
      
      @keyframes streetlamp-glow {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.7; }
      }
      
      @keyframes shadow-pass {
        0% { transform: translateX(-200%); }
        100% { transform: translateX(200%); }
      }
      
      .film-grain {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* Background Layer: Stock Tickers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-0 right-0 h-8 overflow-hidden opacity-20">
          <div className="whitespace-nowrap" style={{ animation: 'ticker-scroll 30s linear infinite' }}>
            <span className="text-white text-xs font-mono mr-8">BATMAN -12.3%</span>
            <span className="text-white text-xs font-mono mr-8">SPIDER +8.7%</span>
            <span className="text-white text-xs font-mono mr-8">XMEN -3.2%</span>
            <span className="text-white text-xs font-mono mr-8">SUPERMAN +15.1%</span>
            <span className="text-white text-xs font-mono mr-8">JOKER +666%</span>
            <span className="text-white text-xs font-mono mr-8">BATMAN -12.3%</span>
            <span className="text-white text-xs font-mono mr-8">SPIDER +8.7%</span>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 h-8 overflow-hidden opacity-20">
          <div className="whitespace-nowrap" style={{ animation: 'ticker-scroll 40s linear infinite reverse' }}>
            <span className="text-white text-xs font-mono mr-8">FLASH -7.9%</span>
            <span className="text-white text-xs font-mono mr-8">THOR +22.4%</span>
            <span className="text-white text-xs font-mono mr-8">HULK -15.6%</span>
            <span className="text-white text-xs font-mono mr-8">IRONMAN +9.3%</span>
            <span className="text-white text-xs font-mono mr-8">FLASH -7.9%</span>
            <span className="text-white text-xs font-mono mr-8">THOR +22.4%</span>
          </div>
        </div>
      </div>

      {/* Middle Layer: Newspaper Headlines */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div 
          className="absolute top-32 text-gray-300 text-lg font-bold uppercase opacity-10 transform rotate-3"
          style={{ animation: 'float-left 45s linear infinite' }}
        >
          SEQUENTIAL SECURITIES UNDER INVESTIGATION
        </div>
        <div 
          className="absolute top-64 text-gray-300 text-md font-bold uppercase opacity-10 transform -rotate-2"
          style={{ animation: 'float-right 50s linear infinite' }}
        >
          SEVEN HOUSES CONTROL 90% OF PANELTOWN
        </div>
        <div 
          className="absolute bottom-32 text-gray-300 text-lg font-bold uppercase opacity-10 transform rotate-1"
          style={{ animation: 'float-left 55s linear infinite' }}
        >
          MASTERMIND SPOTTED IN FINANCIAL DISTRICT
        </div>
      </div>

      {/* Main Comic Panel Grid - Irregular Kirby Layout */}
      <div 
        className={`relative z-10 h-full p-4 transition-all duration-1000 ${showOverview ? 'scale-75 opacity-70' : 'scale-100 opacity-100'}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          gap: '8px',
          gridTemplateAreas: `
            "panel1 panel1 panel2 panel3 panel4 panel4"
            "panel1 panel1 panel2 panel3 panel4 panel4"
            "panel5 panel5 panel5 panel6 panel6 panel7"
            "panel5 panel5 panel5 panel6 panel6 panel7"
            "panel8 panel8 panel8 panel8 panel9 panel9"
            "panel8 panel8 panel8 panel8 panel9 panel9"
          `
        }}
      >
        
        {/* Panel 1: Large establishing shot (2x2) */}
        <ComicPanel 
          id={1} 
          gridArea="panel1"
          backgroundImage={darkRainyCityImage1} 
          delay={0} 
          kenBurnsType="zoomIn"
          isRevealed={panelsRevealed[0]}
        >
          <CaptionBox 
            text="Paneltown. Where the Seven Houses rule the market..." 
            delay={300}
          />
          <div className="absolute inset-0 rain-effect opacity-40 pointer-events-none" />
          {/* Streetlamp halo */}
          <div 
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-500 rounded-full opacity-10 blur-3xl"
            style={{ animation: 'streetlamp-glow 4s ease-in-out infinite' }}
          />
        </ComicPanel>

        {/* Panel 2: Thin vertical strip - Mastermind's shadow */}
        <ComicPanel 
          id={2} 
          gridArea="panel2"
          backgroundColor="bg-gray-950" 
          delay={300} 
          kenBurnsType="panDown"
          isRevealed={panelsRevealed[1]}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-3/4 bg-black" 
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 60% 100%, 40% 100%)',
                filter: 'blur(2px)'
              }}
            />
          </div>
          <CaptionBox text="Tonight..." delay={600} />
        </ComicPanel>

        {/* Panel 3: Thin vertical strip - Rain on glass */}
        <ComicPanel 
          id={3} 
          gridArea="panel3"
          backgroundColor="bg-gray-900" 
          delay={600} 
          kenBurnsType="panUp"
          isRevealed={panelsRevealed[2]}
        >
          <div className="absolute inset-0 rain-effect opacity-60" />
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <div className="text-white text-xs font-mono opacity-50">DRIP</div>
            <div className="text-white text-xs font-mono opacity-50 ml-2">DRIP</div>
            <div className="text-white text-xs font-mono opacity-50 ml-2">DRIP</div>
          </div>
        </ComicPanel>

        {/* Panel 4: Wide cinematic (2x2) - Sequential Securities building */}
        <ComicPanel 
          id={4} 
          gridArea="panel4"
          backgroundImage={darkRainyCityImage3} 
          delay={900} 
          kenBurnsType="panRight"
          isRevealed={panelsRevealed[3]}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-yellow-400 text-3xl font-black tracking-wider opacity-80">
              SEQUENTIAL
            </div>
            <div className="text-yellow-400 text-3xl font-black tracking-wider opacity-80">
              SECURITIES
            </div>
          </div>
          <CaptionBox text="One of the Seven Houses..." delay={1200} />
          {/* Shadow passing */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-60"
            style={{ animation: 'shadow-pass 15s linear infinite' }}
          />
        </ComicPanel>

        {/* Panel 5: Wide action (3x2) - Street scene with multiple figures */}
        <ComicPanel 
          id={5} 
          gridArea="panel5"
          backgroundImage={darkRainyCityImage2} 
          delay={1200} 
          kenBurnsType="panLeft"
          isRevealed={panelsRevealed[4]}
        >
          <SoundEffect text="SCREECH!" position={{ top: '20px', right: '40px' }} delay={1500} size="large" />
          <div className="absolute bottom-8 left-8 flex gap-8">
            {/* Car headlights */}
            <div className="w-8 h-8 bg-yellow-400 rounded-full blur-2xl opacity-60" />
            <div className="w-8 h-8 bg-yellow-400 rounded-full blur-2xl opacity-60" />
          </div>
          <CaptionBox text="The Mastermind arrives..." delay={1500} />
        </ComicPanel>

        {/* Panel 6: Medium square (2x2) - Guards */}
        <ComicPanel 
          id={6} 
          gridArea="panel6"
          backgroundColor="bg-gray-900" 
          delay={1500} 
          kenBurnsType="zoomOut"
          isRevealed={panelsRevealed[5]}
        >
          <div className="absolute inset-0 flex items-center justify-around">
            <div className="w-24 h-40 bg-black/80 rounded-t-2xl" />
            <div className="w-24 h-40 bg-black/80 rounded-t-2xl" />
          </div>
          <SpeechBubble text="Stop right there" position={{ top: '30px', left: '20px' }} delay={1800} />
          <SpeechBubble text="Not tonight" position={{ bottom: '40px', right: '20px' }} delay={2100} />
        </ComicPanel>

        {/* Panel 7: Thin vertical - Blood drip */}
        <ComicPanel 
          id={7} 
          gridArea="panel7"
          backgroundColor="bg-black" 
          delay={1800} 
          kenBurnsType="panDown"
          isRevealed={panelsRevealed[6]}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Blood drip */}
            <div className="w-4 h-full bg-gradient-to-b from-transparent via-red-900 to-red-600 opacity-80" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SoundEffect text="CRACK!" position={{}} delay={2100} size="medium" />
          </div>
        </ComicPanel>

        {/* Panel 8: Large dramatic (4x2) - Mastermind at entrance */}
        <ComicPanel 
          id={8} 
          gridArea="panel8"
          backgroundImage={darkRainyCityImage1} 
          delay={2100} 
          kenBurnsType="zoomIn"
          isRevealed={panelsRevealed[7]}
        >
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative mb-8">
              {/* Mastermind silhouette */}
              <div className="w-40 h-64 bg-black"
                style={{
                  clipPath: 'polygon(35% 0%, 65% 0%, 70% 30%, 65% 100%, 35% 100%, 30% 30%)',
                  filter: 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.3))'
                }}
              />
              {/* Fedora */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-black rounded-full" />
            </div>
          </div>
          <CaptionBox text="He's got business with the House..." delay={2400} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-900/20 to-transparent" />
        </ComicPanel>

        {/* Panel 9: Medium finale (2x2) - Enter button */}
        <ComicPanel 
          id={9} 
          gridArea="panel9"
          backgroundColor="bg-black" 
          delay={2400} 
          kenBurnsType="zoomOut"
          isRevealed={panelsRevealed[8]}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-white tracking-wider mb-1">
                SEQUENTIAL
              </h1>
              <h1 className="text-4xl font-black text-yellow-400 tracking-wider">
                SECURITIES
              </h1>
            </div>
            
            {allPanelsRevealed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="bg-red-900 border-4 border-white text-white hover:bg-red-800 px-8 py-6 text-2xl font-black tracking-widest transform hover:scale-110 transition-all duration-300"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-enter-sequential"
                  style={{
                    boxShadow: '6px 6px 0 rgba(0,0,0,1)',
                    textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
                  }}
                >
                  ENTER
                </Button>
              </motion.div>
            )}
          </div>
          <CaptionBox text="Welcome to the game." delay={2700} />
        </ComicPanel>
      </div>

      {/* Rain overlay across all layers */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 rain-effect opacity-30" />
      </div>

      {/* Streetlamp halos creating depth */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-yellow-300 rounded-full opacity-5 blur-3xl"
          style={{ animation: 'streetlamp-glow 5s ease-in-out infinite' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300 rounded-full opacity-5 blur-3xl"
          style={{ animation: 'streetlamp-glow 7s ease-in-out infinite' }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-56 h-56 bg-yellow-300 rounded-full opacity-3 blur-3xl"
          style={{ animation: 'streetlamp-glow 6s ease-in-out infinite' }}
        />
      </div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-60 mix-blend-overlay film-grain" />

      {/* Shadow passing in parallax */}
      <div className="absolute inset-0 z-3 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-black to-transparent opacity-20"
          style={{ animation: 'shadow-pass 20s linear infinite' }}
        />
      </div>
    </div>
  );
}