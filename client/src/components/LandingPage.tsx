import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { VideoBackground } from "@/components/VideoBackground";
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
  
  // Video URLs for each section - using stock cinematic videos
  const videoSections = [
    {
      url: "https://cdn.pixabay.com/video/2024/08/24/228197_large.mp4",
      title: "PANEL PROFITS",
      subtitle: ""
    },
    {
      url: "https://cdn.pixabay.com/video/2023/08/31/178372-859001761_large.mp4",
      title: "Every Number Has A Shadow",
      subtitle: ""
    },
    {
      url: "https://cdn.pixabay.com/video/2022/12/13/142923-781634322_large.mp4",
      title: "THE FLOOR",
      subtitle: "Where fortunes dissolve into void"
    },
    {
      url: "https://cdn.pixabay.com/video/2024/06/17/217090_large.mp4",
      title: "THE REFLECTION",
      subtitle: "What stares back isn't human anymore"
    },
    {
      url: "https://cdn.pixabay.com/video/2023/10/29/187319-879218848_large.mp4",
      title: "THE TERMINAL",
      subtitle: "Your final interface with mortality"
    },
    {
      url: "https://cdn.pixabay.com/video/2024/01/27/198526_large.mp4",
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
        style={{ scrollSnapAlign: "start" }}
        data-section="0"
      >
        <VideoBackground 
          videoUrl={videoSections[0].url}
          overlay={true}
          overlayOpacity={0.4}
          minimalist={true}
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: text1Opacity }}
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-thin text-white tracking-widest mix-blend-difference"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            PANEL PROFITS
          </motion.h1>
        </motion.div>
      </section>

      {/* The Descent - Every Number Has A Shadow */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        data-section="1"
      >
        <VideoBackground 
          videoUrl={videoSections[1].url}
          overlay={true}
          overlayOpacity={0.5}
          minimalist={true}
        />
        <motion.div 
          className="absolute inset-0 flex items-end pb-32 pl-12"
          style={{ opacity: text2Opacity }}
        >
          <motion.p 
            className="text-4xl md:text-6xl font-light text-white/80 mix-blend-exclusion max-w-3xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Every Number Has A Shadow
          </motion.p>
        </motion.div>
      </section>

      {/* The Floor - Trading chaos */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        data-section="2"
      >
        <VideoBackground 
          videoUrl={videoSections[2].url}
          overlay={true}
          overlayOpacity={0.6}
          minimalist={true}
        />
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: text3Opacity }}
        >
          {/* Text appears at different positions like ghosts */}
          <motion.div 
            className="absolute top-1/4 right-1/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 4, delay: 0, repeat: Infinity, repeatDelay: 2 }}
          >
            <h2 className="text-3xl font-light text-white/60 mix-blend-overlay">THE FLOOR</h2>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/3 left-1/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <p className="text-xl font-thin text-white/40 italic mix-blend-difference">
              Where fortunes dissolve into void
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* The Reflection - Mirror/glass effects */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        data-section="3"
      >
        <VideoBackground 
          videoUrl={videoSections[3].url}
          overlay={true}
          overlayOpacity={0.5}
          minimalist={true}
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-end pr-16"
          style={{ opacity: text4Opacity }}
        >
          <div className="text-right">
            <motion.h2 
              className="text-5xl font-light text-white/70 mb-4 mix-blend-screen"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              THE REFLECTION
            </motion.h2>
            <motion.p 
              className="text-xl font-thin text-white/50 max-w-md mix-blend-overlay"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            >
              What stares back isn't human anymore
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* The Terminal - Dark screens, glitching */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        data-section="4"
      >
        <VideoBackground 
          videoUrl={videoSections[4].url}
          overlay={true}
          overlayOpacity={0.7}
          minimalist={true}
        />
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: text5Opacity }}
        >
          <motion.div 
            className="absolute top-20 left-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl font-mono text-green-400/60 mix-blend-screen glitch-text" data-text="THE TERMINAL">
              THE TERMINAL
            </h2>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <p className="text-lg font-mono text-red-500/50 mix-blend-multiply">
              Your final interface with mortality
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* The Call - Final scene with CTA */}
      <section 
        className="video-section relative h-screen w-full overflow-hidden"
        style={{ scrollSnapAlign: "start" }}
        data-section="5"
      >
        <VideoBackground 
          videoUrl={videoSections[5].url}
          overlay={true}
          overlayOpacity={0.8}
          minimalist={true}
        />
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: text6Opacity }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-center"
          >
            <motion.p 
              className="text-2xl md:text-3xl font-light text-white/60 mb-12 mix-blend-difference"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
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
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
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