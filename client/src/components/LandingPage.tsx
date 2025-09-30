import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function LandingPage() {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  
  // Scroll-based opacity transforms for each section's text
  const text1Opacity = useTransform(scrollY, [0, 300, 600, 900], [0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollY, [600, 900, 1500, 1800], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollY, [1500, 1800, 2400, 2700], [0, 1, 1, 0]);
  const text4Opacity = useTransform(scrollY, [2400, 2700, 3300, 3600], [0, 1, 1, 0]);
  const text5Opacity = useTransform(scrollY, [3300, 3600, 4200, 4500], [0, 1, 1, 0]);
  const text6Opacity = useTransform(scrollY, [4200, 4500, 5100], [0, 1, 1]);
  
  // Dark noir backgrounds for each section
  const videoSections = [
    {
      background: "radial-gradient(ellipse at center, #0a0000 0%, #000000 100%)",
      title: "PANEL PROFITS",
      subtitle: ""
    },
    {
      background: "linear-gradient(180deg, #000000 0%, #1a0000 100%)",
      title: "Every Number Has A Shadow",
      subtitle: ""
    },
    {
      background: "radial-gradient(circle at 30% 50%, #0a0a0a 0%, #000000 100%)",
      title: "THE FLOOR",
      subtitle: "Where fortunes dissolve into void"
    },
    {
      background: "linear-gradient(45deg, #000000 0%, #0a0000 50%, #000000 100%)",
      title: "THE REFLECTION",
      subtitle: "What stares back isn't human anymore"
    },
    {
      background: "radial-gradient(ellipse at top, #050505 0%, #000000 100%)",
      title: "THE TERMINAL",
      subtitle: "Your final interface with mortality"
    },
    {
      background: "linear-gradient(to bottom, #000000 0%, #0a0000 100%)",
      title: "",
      subtitle: "Enter if you dare"
    }
  ];
  
  useEffect(() => {
    // Set up intersection observer for section changes
    const sections = document.querySelectorAll('.video-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-section'));
            setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    sections.forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  const textOpacities = [text1Opacity, text2Opacity, text3Opacity, text4Opacity, text5Opacity, text6Opacity];

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        scrollSnapType: "y mandatory",
        overflowY: "auto",
        height: "100vh"
      }}
    >
      {/* Opening Scene - PANEL PROFITS */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ 
          scrollSnapAlign: "start",
          background: videoSections[0].background
        }}
        data-section="0"
      >
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/30" 
          style={{
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)"
          }}
        />
        
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E')"
          }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ opacity: text1Opacity }}
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-thin text-gray-100 tracking-widest"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{
              textShadow: "0 0 30px rgba(255, 0, 0, 0.2)"
            }}
          >
            PANEL PROFITS
          </motion.h1>
        </motion.div>
      </section>

      {/* The Descent - Every Number Has A Shadow */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ 
          scrollSnapAlign: "start",
          background: videoSections[1].background
        }}
        data-section="1"
      >
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/30" 
          style={{
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)"
          }}
        />
        
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E')"
          }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-end pb-32 pl-12 z-10"
          style={{ opacity: text2Opacity }}
        >
          <motion.p 
            className="text-4xl md:text-6xl font-light text-gray-100 max-w-3xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              textShadow: "0 0 30px rgba(255, 0, 0, 0.2)"
            }}
          >
            Every Number Has A Shadow
          </motion.p>
        </motion.div>
      </section>

      {/* The Floor - Trading chaos */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ 
          scrollSnapAlign: "start",
          background: videoSections[2].background
        }}
        data-section="2"
      >
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/30" 
          style={{
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)"
          }}
        />
        
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E')"
          }}
        />
        
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ opacity: text3Opacity }}
        >
          {/* Text appears at different positions like ghosts */}
          <motion.div 
            className="absolute top-1/4 right-1/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 4, delay: 0, repeat: Infinity, repeatDelay: 2 }}
          >
            <h2 className="text-3xl font-light text-gray-100"
              style={{
                textShadow: "0 0 30px rgba(255, 0, 0, 0.2)"
              }}
            >THE FLOOR</h2>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/3 left-1/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <p className="text-xl font-thin text-gray-100 italic"
              style={{
                textShadow: "0 0 20px rgba(255, 0, 0, 0.15)"
              }}
            >
              Where fortunes dissolve into void
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* The Reflection - Mirror/glass effects */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ 
          scrollSnapAlign: "start",
          background: videoSections[3].background
        }}
        data-section="3"
      >
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/30" 
          style={{
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)"
          }}
        />
        
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E')"
          }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-end pr-16 z-10"
          style={{ opacity: text4Opacity }}
        >
          <div className="text-right">
            <motion.h2 
              className="text-5xl font-light text-gray-100 mb-4"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                textShadow: "0 0 30px rgba(255, 0, 0, 0.2)"
              }}
            >
              THE REFLECTION
            </motion.h2>
            <motion.p 
              className="text-xl font-thin text-gray-100 max-w-md"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
              style={{
                textShadow: "0 0 20px rgba(255, 0, 0, 0.15)"
              }}
            >
              What stares back isn't human anymore
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* The Terminal - Dark screens */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ 
          scrollSnapAlign: "start",
          background: videoSections[4].background
        }}
        data-section="4"
      >
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/30" 
          style={{
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)"
          }}
        />
        
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E')"
          }}
        />
        
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ opacity: text5Opacity }}
        >
          <motion.div 
            className="absolute top-20 left-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl font-mono text-gray-100"
              style={{
                textShadow: "0 0 30px rgba(255, 0, 0, 0.2)"
              }}
            >
              THE TERMINAL
            </h2>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <p className="text-lg font-mono text-gray-100"
              style={{
                textShadow: "0 0 20px rgba(255, 0, 0, 0.15)"
              }}
            >
              Your final interface with mortality
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* The Call - Final scene with CTA */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ 
          scrollSnapAlign: "start",
          background: videoSections[5].background
        }}
        data-section="5"
      >
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-black/30" 
          style={{
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)"
          }}
        />
        
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E')"
          }}
        />
        
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          style={{ opacity: text6Opacity }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-center"
          >
            <motion.p 
              className="text-2xl md:text-3xl font-light text-gray-100 mb-12"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                textShadow: "0 0 30px rgba(255, 0, 0, 0.2)"
              }}
            >
              Enter if you dare
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-transparent border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-12 py-6 text-lg font-light tracking-widest transition-all duration-500"
                onClick={() => window.location.href = "/trading"}
                data-testid="button-enter-exchange"
              >
                ENTER THE EXCHANGE
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Subtle scroll indicator for first section only */}
      {activeSection === 0 && (
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/30 text-sm font-light tracking-widest"
          >
            SCROLL
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}