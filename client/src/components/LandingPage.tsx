import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Smoke/fog effect component
function SmokeEffect({ position }: { position: { top?: string; bottom?: string; left?: string; right?: string } }) {
  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        ...position,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'smoke-drift 15s ease-in-out infinite'
      }}
    />
  );
}

// Create noir visual elements using pure CSS
function NeonSign({ text, delay = 0 }: { text: string; delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <div 
        className="text-4xl font-black tracking-widest"
        style={{
          color: '#FFD700',
          textShadow: `
            0 0 10px #FFD700,
            0 0 20px #FFD700,
            0 0 30px #FFD700,
            0 0 40px #FFA500,
            0 0 70px #FFA500,
            0 0 80px #FFA500,
            0 0 100px #FFA500,
            0 0 150px #FFA500
          `,
          animation: 'neon-flicker 2s ease-in-out infinite alternate'
        }}
      >
        {text}
      </div>
    </div>
  );
}

// Mastermind silhouette component
function MastermindSilhouette({ position, size = "medium", delay = 0 }: {
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: "small" | "medium" | "large";
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  const sizes = {
    small: { width: '80px', height: '120px' },
    medium: { width: '120px', height: '200px' },
    large: { width: '180px', height: '280px' }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute z-25"
      style={position}
    >
      <div className="relative">
        {/* Body */}
        <div 
          style={{
            ...sizes[size],
            background: 'black',
            clipPath: 'polygon(35% 0%, 65% 0%, 70% 30%, 65% 100%, 35% 100%, 30% 30%)',
            filter: 'drop-shadow(0 0 20px rgba(139, 0, 0, 0.3))'
          }}
        />
        {/* Fedora */}
        <div 
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black"
          style={{
            width: `${parseInt(sizes[size].width) * 1.2}px`,
            height: '20px',
            clipPath: 'ellipse(50% 40% at 50% 50%)'
          }}
        />
      </div>
    </motion.div>
  );
}

// Venetian blind shadows
function VenetianBlinds() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-15"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 8px,
          rgba(0, 0, 0, 0.7) 8px,
          rgba(0, 0, 0, 0.7) 10px
        )`
      }}
    />
  );
}

// Rain effect component with multiple layers
function RainEffect({ intensity = 1, layer = 1 }: { intensity?: number; layer?: number }) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(180deg, transparent, rgba(255,255,255,${0.01 * intensity}))`,
        backgroundSize: `${3 + layer}px ${100 + layer * 10}px`,
        animation: `rain ${0.3 + layer * 0.1}s linear infinite`,
        zIndex: 40 + layer
      }}
    />
  );
}

// Wet street reflection
function WetStreetReflection() {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-1/3"
      style={{
        background: `linear-gradient(to top, 
          rgba(0,0,0,0.8) 0%, 
          rgba(0,0,0,0.4) 50%, 
          transparent 100%)`,
        transform: 'scaleY(-1)',
        filter: 'blur(2px)',
        opacity: 0.6
      }}
    />
  );
}

// Blood drip effect
function BloodDrip({ position }: { position: { left: string } }) {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: '200px' }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="absolute top-20"
      style={{
        ...position,
        width: '4px',
        background: `linear-gradient(to bottom, 
          transparent 0%,
          rgba(139, 0, 0, 0.4) 10%,
          rgba(139, 0, 0, 0.8) 30%,
          rgba(139, 0, 0, 1) 50%,
          rgba(139, 0, 0, 0.8) 70%,
          rgba(139, 0, 0, 0.4) 90%,
          transparent 100%
        )`,
        filter: 'blur(1px)'
      }}
    />
  );
}

// Comic panel component
function ComicPanel({ 
  id,
  gridArea,
  children, 
  delay = 0,
  isRevealed
}: { 
  id: number;
  gridArea: string;
  children: React.ReactNode;
  delay?: number;
  isRevealed: boolean;
}) {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (isRevealed && !isActivated) {
      const timeout = setTimeout(() => {
        setIsActivated(true);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed, delay, isActivated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActivated ? 1 : 0.2,
        scale: isActivated ? 1 : 0.9,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden border-4 border-white bg-black ${isActivated ? 'z-20' : 'z-10'}`}
      style={{ 
        gridArea,
        boxShadow: isActivated ? '10px 10px 0 rgba(0,0,0,1)' : '5px 5px 0 rgba(0,0,0,0.5)'
      }}
      data-testid={`comic-panel-${id}`}
    >
      {/* Film grain */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Panel content */}
      <div className="relative h-full">
        {children}
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const [panelsRevealed, setPanelsRevealed] = useState<boolean[]>(Array(9).fill(false));
  const [allPanelsRevealed, setAllPanelsRevealed] = useState(false);

  // Start sequential reveal
  useEffect(() => {
    panelsRevealed.forEach((_, index) => {
      setTimeout(() => {
        setPanelsRevealed(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 400);
    });
  }, []);

  // Check if all panels are revealed
  useEffect(() => {
    if (panelsRevealed.every(p => p)) {
      setTimeout(() => setAllPanelsRevealed(true), 500);
    }
  }, [panelsRevealed]);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rain {
        0% { transform: translateY(-100px); }
        100% { transform: translateY(calc(100vh + 100px)); }
      }
      
      @keyframes neon-flicker {
        0%, 100% { opacity: 1; }
        33% { opacity: 0.8; }
        66% { opacity: 0.9; }
      }
      
      @keyframes headlight-sweep {
        0% { transform: translateX(-100%) rotate(-15deg); }
        100% { transform: translateX(200%) rotate(-15deg); }
      }
      
      @keyframes smoke-drift {
        0% { transform: translateX(0) translateY(0); opacity: 0.3; }
        50% { transform: translateX(20px) translateY(-30px); opacity: 0.15; }
        100% { transform: translateX(40px) translateY(-60px); opacity: 0; }
      }
      
      @keyframes ticker-scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      
      @keyframes gun-flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      
      @keyframes window-glow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* Multiple rain layers for depth */}
      <RainEffect intensity={1} layer={1} />
      <RainEffect intensity={0.5} layer={2} />
      <RainEffect intensity={0.3} layer={3} />
      
      {/* Main Comic Grid */}
      <div 
        className="relative z-10 h-full p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          gap: '12px',
          gridTemplateAreas: `
            "panel1 panel1 panel2 panel3 panel3 panel3"
            "panel1 panel1 panel2 panel3 panel3 panel3"
            "panel4 panel4 panel5 panel5 panel6 panel6"
            "panel4 panel4 panel5 panel5 panel6 panel6"
            "panel7 panel8 panel8 panel8 panel9 panel9"
            "panel7 panel8 panel8 panel8 panel9 panel9"
          `
        }}
      >
        
        {/* Panel 1: Rain-slicked street with neon sign */}
        <ComicPanel id={1} gridArea="panel1" delay={0} isRevealed={panelsRevealed[0]}>
          <div className="relative h-full">
            {/* Wet street background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
            
            {/* Neon sign reflection in puddles */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2">
              <div 
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-yellow-500 blur-2xl opacity-30"
                style={{ animation: 'neon-flicker 3s ease-in-out infinite' }}
              />
            </div>
            
            {/* Neon sign */}
            <NeonSign text="SEQUENTIAL" delay={500} />
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
              <div 
                className="text-3xl tracking-widest"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 900,
                  color: '#FFD700',
                  textShadow: '0 0 20px #FFD700, 0 0 40px #FFA500',
                  animation: 'neon-flicker 2s ease-in-out infinite alternate 0.5s'
                }}
              >
                SECURITIES
              </div>
            </div>
            
            {/* Add smoke/fog */}
            <SmokeEffect position={{ bottom: '10px', left: '20px' }} />
            <SmokeEffect position={{ bottom: '30px', right: '40px' }} />
            
            <WetStreetReflection />
          </div>
        </ComicPanel>

        {/* Panel 2: Silhouette watching from window */}
        <ComicPanel id={2} gridArea="panel2" delay={400} isRevealed={panelsRevealed[1]}>
          <div className="relative h-full bg-gradient-to-b from-gray-800 to-black">
            {/* Window frame */}
            <div className="absolute inset-4 border-4 border-gray-700">
              <VenetianBlinds />
            </div>
            
            {/* Mastermind silhouette */}
            <MastermindSilhouette 
              position={{ bottom: '0', left: '50%', transform: 'translateX(-50%)' }}
              size="medium"
              delay={800}
            />
            
            {/* City lights background */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-yellow-300"
                  style={{
                    width: '4px',
                    height: '4px',
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                    boxShadow: '0 0 10px rgba(255, 255, 0, 0.5)',
                    animation: `window-glow ${2 + i}s ease-in-out infinite`
                  }}
                />
              ))}
            </div>
          </div>
        </ComicPanel>

        {/* Panel 3: Stock tickers, red numbers falling */}
        <ComicPanel id={3} gridArea="panel3" delay={800} isRevealed={panelsRevealed[2]}>
          <div className="relative h-full bg-black">
            {/* Multiple ticker displays */}
            <div className="absolute inset-0 flex flex-col justify-center p-4">
              {['BATMAN -12.3%', 'SPIDER -8.7%', 'XMEN -15.2%', 'JOKER -666%'].map((ticker, i) => (
                <motion.div
                  key={ticker}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="text-red-600 font-mono text-xl mb-2"
                  style={{
                    textShadow: '0 0 10px rgba(220, 20, 60, 0.8)'
                  }}
                >
                  {ticker}
                </motion.div>
              ))}
            </div>
            
            {/* Falling numbers effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-red-600 font-mono text-sm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animation: `rain ${2 + Math.random() * 2}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                >
                  -{Math.floor(Math.random() * 100)}%
                </div>
              ))}
            </div>
          </div>
        </ComicPanel>

        {/* Panel 4: Hands exchanging briefcase */}
        <ComicPanel id={4} gridArea="panel4" delay={1200} isRevealed={panelsRevealed[3]}>
          <div className="relative h-full bg-gradient-to-br from-gray-900 to-black">
            {/* Hands silhouettes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Left hand */}
              <div 
                className="absolute left-10 w-24 h-16 bg-black"
                style={{
                  clipPath: 'polygon(0 40%, 30% 20%, 60% 30%, 80% 20%, 100% 40%, 100% 100%, 0 100%)',
                  transform: 'rotate(-10deg)'
                }}
              />
              {/* Briefcase */}
              <div className="w-32 h-20 bg-gray-800 border-2 border-gray-600 relative">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-700" />
              </div>
              {/* Right hand */}
              <div 
                className="absolute right-10 w-24 h-16 bg-black"
                style={{
                  clipPath: 'polygon(0 40%, 20% 20%, 40% 30%, 60% 20%, 100% 40%, 100% 100%, 0 100%)',
                  transform: 'rotate(10deg) scaleX(-1)'
                }}
              />
            </div>
            
            {/* Shadow/smoke effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-gray-900 to-transparent opacity-80" />
          </div>
        </ComicPanel>

        {/* Panel 5: Car speeding, headlights cutting through rain */}
        <ComicPanel id={5} gridArea="panel5" delay={1600} isRevealed={panelsRevealed[4]}>
          <div className="relative h-full bg-black overflow-hidden">
            {/* Car silhouette */}
            <div className="absolute bottom-10 left-0 w-48 h-20 bg-gray-900"
              style={{
                clipPath: 'polygon(10% 30%, 25% 0%, 90% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 60%)'
              }}
            />
            
            {/* Headlight beams */}
            <div className="absolute bottom-14 left-32">
              <div 
                className="absolute w-96 h-32 bg-gradient-to-r from-yellow-400 to-transparent opacity-60 blur-xl"
                style={{
                  clipPath: 'polygon(0 40%, 100% 20%, 100% 80%, 0 60%)',
                  animation: 'headlight-sweep 3s ease-in-out infinite'
                }}
              />
            </div>
            
            {/* Speed lines */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 bg-white opacity-20 blur-sm"
                  style={{
                    width: `${30 + Math.random() * 40}%`,
                    left: `${Math.random() * 50}%`,
                    top: `${40 + i * 8}%`
                  }}
                />
              ))}
            </div>
          </div>
        </ComicPanel>

        {/* Panel 6: Two figures facing off, guns drawn */}
        <ComicPanel id={6} gridArea="panel6" delay={2000} isRevealed={panelsRevealed[5]}>
          <div className="relative h-full bg-gradient-to-b from-gray-800 to-black">
            {/* Left figure */}
            <div className="absolute bottom-0 left-4 w-20 h-32 bg-black"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 80% 30%, 75% 100%, 25% 100%, 20% 30%)'
              }}
            />
            {/* Left gun */}
            <div className="absolute bottom-16 left-20 w-8 h-2 bg-gray-600" />
            
            {/* Right figure */}
            <div className="absolute bottom-0 right-4 w-20 h-32 bg-black"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 80% 30%, 75% 100%, 25% 100%, 20% 30%)'
              }}
            />
            {/* Right gun */}
            <div className="absolute bottom-16 right-20 w-8 h-2 bg-gray-600" />
            
            {/* Muzzle flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.2, delay: 2.5, repeat: 2, repeatDelay: 0.5 }}
              className="absolute bottom-16 left-28 w-8 h-8 bg-yellow-400 rounded-full blur-xl"
            />
          </div>
        </ComicPanel>

        {/* Panel 7: Blood dripping down window */}
        <ComicPanel id={7} gridArea="panel7" delay={2400} isRevealed={panelsRevealed[6]}>
          <div className="relative h-full bg-gray-900">
            {/* Window pane */}
            <div className="absolute inset-2 border-4 border-gray-700 bg-gray-800" />
            
            {/* Blood drips */}
            <BloodDrip position={{ left: '30%' }} />
            <BloodDrip position={{ left: '50%' }} />
            <BloodDrip position={{ left: '70%' }} />
            
            {/* Rain on window */}
            <div className="absolute inset-0 opacity-30">
              <RainEffect intensity={2} layer={1} />
            </div>
          </div>
        </ComicPanel>

        {/* Panel 8: Mastermind entering Sequential Securities */}
        <ComicPanel id={8} gridArea="panel8" delay={2800} isRevealed={panelsRevealed[7]}>
          <div className="relative h-full bg-gradient-to-b from-black to-gray-900">
            {/* Building entrance */}
            <div className="absolute inset-0">
              {/* Doorway */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gray-800 border-4 border-gray-600">
                {/* Door panels */}
                <div className="absolute inset-2 bg-black" />
              </div>
              
              {/* Mastermind entering */}
              <MastermindSilhouette 
                position={{ bottom: '0', left: '50%', transform: 'translateX(-50%)' }}
                size="large"
                delay={3000}
              />
              
              {/* Sequential Securities sign above door */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                <div 
                  className="text-2xl font-black tracking-widest text-yellow-400"
                  style={{
                    textShadow: '0 0 20px #FFD700'
                  }}
                >
                  SEQUENTIAL
                </div>
              </div>
            </div>
            
            {/* Red glow from below */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-red-900/30 to-transparent" />
          </div>
        </ComicPanel>

        {/* Panel 9: ENTER button */}
        <ComicPanel id={9} gridArea="panel9" delay={3200} isRevealed={panelsRevealed[8]}>
          <div className="relative h-full bg-black flex items-center justify-center">
            {/* Neon ENTER sign */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: allPanelsRevealed ? 1 : 0 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-black border-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-12 py-8 text-3xl font-black tracking-widest transition-all duration-300"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-enter-sequential"
                  style={{
                    boxShadow: `
                      0 0 20px #FFD700,
                      0 0 40px #FFD700,
                      0 0 60px #FFA500,
                      inset 0 0 20px rgba(255, 215, 0, 0.2)
                    `,
                    textShadow: '0 0 10px currentColor'
                  }}
                >
                  ENTER
                </Button>
              </motion.div>
              
              {/* Door closing effect */}
              {allPanelsRevealed && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute inset-0 bg-black origin-left pointer-events-none"
                />
              )}
            </div>
          </div>
        </ComicPanel>
      </div>

      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
}