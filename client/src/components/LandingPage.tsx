import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull, DollarSign, TrendingDown, AlertTriangle, Brain, Eye, Clock, Trophy, Zap, Flame, Shield, Archive, Database, Activity } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { VideoBackground } from "@/components/VideoBackground";
import { useEffect, useRef, useState } from "react";

export function LandingPage() {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isCardsInView = useInView(cardsRef, { once: true });

  // Parallax transforms
  const yPosAnim = useTransform(scrollY, [0, 500], [0, -100]);
  const scaleAnim = useTransform(scrollY, [0, 300], [1, 1.2]);
  const opacityAnim = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Epic text animation variants
  const titleVariants = {
    hidden: { 
      y: -100, 
      opacity: 0,
      scale: 0.5,
      filter: "blur(20px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.68, -0.55, 0.265, 1.55],
        type: "spring",
        stiffness: 100
      }
    }
  };

  const subtitleVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 100,
      rotateX: -45,
      scale: 0.8
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: i * 0.1,
        ease: [0.215, 0.61, 0.355, 1],
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const exchangeSections = [
    {
      title: "THE FLOOR",
      icon: Flame,
      heading: "Where Fortunes Dissolve",
      description: "Watch digital empires crumble into binary dust. Every tick downward is a dream extinguished, a future erased. The floor doesn't care about your ambitions."
    },
    {
      title: "THE LEDGER", 
      icon: Database,
      heading: "Permanent Scars",
      description: "Every transaction etches itself into the eternal record. Your losses are immortalized, your gains fleeting. The ledger remembers what you'd rather forget."
    },
    {
      title: "THE MIRROR",
      icon: Eye,
      heading: "Market's Reflection", 
      description: "Look into the abyss of your portfolio and see what stares back. You entered human. The market made you something else. Something that feeds on volatility."
    },
    {
      title: "THE VAULT",
      icon: Shield,
      heading: "Compound Nightmares",
      description: "Where broken dreams accumulate interest. Each failed position adds to the pile. The vault grows heavy with the weight of what could have been."
    },
    {
      title: "THE TERMINAL",
      icon: Activity,
      heading: "Final Interface",
      description: "Your last connection to financial mortality. Here, at the edge of ruin, you make your final trades. The terminal knows your fate before you do."
    },
    {
      title: "THE ECHO",
      icon: Clock,
      heading: "Portfolio Ghosts",
      description: "Listen to the whispers of crashed positions. They speak of margin calls at 3 AM, of leveraged bets that consumed everything. Their warnings fall on deaf ears."
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Epic Video Background */}
      <VideoBackground />

      {/* Hero Section with epic animations */}
      <motion.div 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: yPosAnim }}
      >
        <motion.div 
          className="absolute inset-0 crosshatch" 
          style={{ scale: scaleAnim, opacity: opacityAnim }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 z-20">
          <div className="text-center">
            {/* Epic Skull with Energy Pulse */}
            <motion.div 
              className="mb-6 relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-32 h-32 bg-red-600/30 rounded-full blur-3xl" />
              </motion.div>
              <Skull className="h-16 w-16 text-destructive mx-auto mb-4 relative z-10 energy-glow" />
            </motion.div>
            
            {/* Epic Title with Slam Animation */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-6 ink-bleed-heavy uppercase tracking-wider glitch-text"
              data-testid="heading-hero-title"
              variants={titleVariants}
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              data-text="THE EXCHANGE"
              style={{ perspective: 1000 }}
            >
              <motion.span 
                className="inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,0,0,0.5)",
                    "0 0 40px rgba(255,0,0,0.8)",
                    "0 0 20px rgba(255,0,0,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                THE EXCHANGE
              </motion.span>
            </motion.h1>

            {/* Typewriter Subtitle */}
            <motion.p 
              className="text-2xl md:text-3xl font-semibold text-destructive mb-4 uppercase ink-bleed typewriter-text"
              variants={subtitleVariants}
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
            >
              <span className="glowing-text">Every Number Has A Shadow</span>
            </motion.p>

            {/* Epic Description with Fade-in Words */}
            <motion.p 
              className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto font-mono" 
              data-testid="text-hero-description"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {["Enter", "a", "world", "where", "algorithms", "dream", "in", "red", "and", "portfolios", "bleed", "pixels.", "The", "market", "never", "sleeps.", "Neither", "do", "its", "ghosts.", "Trading", "floors", "are", "built", "on", "buried", "ambitions.", "Your", "portfolio.", "Their", "obituary."].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* Epic Pulsing CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 1.5, type: "spring", stiffness: 100 }}
              className="relative inline-block"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Particle Effects */}
              <AnimatePresence>
                {isHovered && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-red-500 rounded-full"
                        initial={{ 
                          x: 0, 
                          y: 0,
                          scale: 0
                        }}
                        animate={{ 
                          x: Math.cos((i / 8) * Math.PI * 2) * 100,
                          y: Math.sin((i / 8) * Math.PI * 2) * 100,
                          scale: [0, 1, 0],
                          opacity: [1, 0.5, 0]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ left: "50%", top: "50%" }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              
              {/* Energy Rings */}
              <motion.div
                className="absolute inset-0 rounded-none"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(220,20,60,0.5)",
                    "0 0 40px rgba(220,20,60,0.8), 0 0 60px rgba(220,20,60,0.4)",
                    "0 0 20px rgba(220,20,60,0.5)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              <Button 
                size="lg" 
                className="bg-destructive hover:bg-destructive/80 text-white px-8 py-6 text-lg md:text-xl font-bold uppercase shadow-noir-lg border-4 border-white relative z-10 power-button transform-gpu"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                <motion.div
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center"
                >
                  <Skull className="mr-2 h-6 w-6" />
                  <span className="electric-text">ENTER THE EXCHANGE</span>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Energy Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
                y: (typeof window !== "undefined" ? window.innerHeight : 1080) + 10
              }}
              animate={{ 
                y: -10,
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920)
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
              style={{ filter: "blur(1px)" }}
            />
          ))}
        </div>
      </motion.div>

      {/* The Exchange Sections with Epic Reveals */}
      <motion.div 
        ref={cardsRef}
        className="max-w-7xl mx-auto px-6 py-16 relative z-20"
        initial={{ opacity: 0 }}
        animate={isCardsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={isCardsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase ink-bleed glitch-text" data-testid="heading-houses" data-text="Enter The Exchange">
            <motion.span
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Enter The Exchange
            </motion.span>
          </h2>
          <p className="text-destructive text-lg md:text-xl uppercase font-mono glowing-text" data-testid="text-houses-description">
            Six chambers of financial purgatory. The market doesn't forgive.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
          {exchangeSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                variants={cardVariants}
                initial="hidden"
                animate={isCardsInView ? "visible" : "hidden"}
                whileHover="hover"
                custom={index}
                className="transform-gpu"
              >
                <Card className="bg-black border-4 border-white noir-panel crosshatch shadow-noir-md card-3d hover:shadow-noir-xl transition-all duration-300" data-testid={`card-exchange-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-destructive uppercase">
                      <Icon className="mr-2 h-5 w-5 text-destructive" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white font-mono text-sm">
                      <span className="text-destructive font-bold">{section.heading}</span><br/>
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Epic Call to Action with Power Surge */}
      <motion.div 
        className="max-w-4xl mx-auto px-6 py-16 text-center relative ink-splatter-1 z-20"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <motion.h3 
          className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase ink-bleed-heavy glitch-text" 
          data-testid="heading-cta"
          data-text="THE END IS WRITTEN"
          animate={{
            scale: [1, 1.02, 1],
            textShadow: [
              "0 0 20px rgba(255,0,0,0.5)",
              "0 0 40px rgba(255,0,0,1)",
              "0 0 20px rgba(255,0,0,0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          THE END IS WRITTEN
        </motion.h3>

        <motion.p 
          className="text-xl md:text-2xl text-white mb-8 font-mono" 
          data-testid="text-cta-description"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          There are no heroes in this market. No redemption. No second chances. Just winners, losers, and the void that awaits us all. Choose your sin and face your damnation.
        </motion.p>

        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 rounded-none"
            animate={{
              boxShadow: [
                "0 0 30px rgba(220,20,60,0.5), inset 0 0 30px rgba(220,20,60,0.2)",
                "0 0 60px rgba(220,20,60,1), inset 0 0 60px rgba(220,20,60,0.4)",
                "0 0 30px rgba(220,20,60,0.5), inset 0 0 30px rgba(220,20,60,0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Button 
            size="lg"
            className="bg-black border-4 border-destructive hover:bg-destructive text-white px-8 py-6 text-lg md:text-xl font-bold uppercase shadow-noir-xl relative z-10 power-button-final"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-cta-login"
          >
            <motion.div
              className="inline-flex items-center"
              animate={{
                x: [0, -2, 2, -2, 2, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Skull className="mr-2 h-6 w-6" />
              <span className="electric-text">ACCEPT YOUR DAMNATION</span>
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Additional texture overlays */}
      <div className="fixed inset-0 pointer-events-none scratched opacity-20 z-30" />
      <div className="fixed inset-0 pointer-events-none halftone opacity-10 z-30" />
    </div>
  );
}