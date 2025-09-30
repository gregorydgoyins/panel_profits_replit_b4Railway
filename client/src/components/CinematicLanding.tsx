import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, Activity, DollarSign, Skull, Eye } from "lucide-react";

export function CinematicLanding() {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200]);
  const textY = useTransform(scrollY, [0, 1000], [0, 100]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Dark Background */}
      <div className="fixed inset-0">
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, #0a0a0a 0%, #000000 50%),
              radial-gradient(circle at 20% 80%, #1a0033 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #001a33 0%, transparent 50%)
            `
          }}
        />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #4a0080 0%, transparent 70%)',
            left: '10%',
            top: '20%',
            x: mousePosition.x,
            y: mousePosition.y
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #003366 0%, transparent 70%)',
            right: '15%',
            bottom: '30%',
            x: -mousePosition.x,
            y: -mousePosition.y
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Scan lines */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)'
          }}
          animate={{
            y: [0, 10]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{ y: textY }}
      >
        <div className="text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Glitch text effect */}
            <h1 className="relative">
              <motion.span 
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(147, 51, 234, 0.5)',
                    '0 0 40px rgba(147, 51, 234, 0.8)',
                    '0 0 20px rgba(147, 51, 234, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PANEL PROFITS
              </motion.span>
              
              {/* Glitch layers */}
              <span className="absolute inset-0 text-6xl md:text-8xl font-bold text-red-500 opacity-50 animate-pulse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                PANEL PROFITS
              </span>
              <span className="absolute inset-0 text-6xl md:text-8xl font-bold text-blue-500 opacity-50 animate-pulse" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
                PANEL PROFITS
              </span>
            </h1>
            
            <motion.p 
              className="mt-6 text-xl md:text-2xl text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              THE EXCHANGE AWAITS
            </motion.p>
          </motion.div>

          {/* Animated metrics */}
          <motion.div 
            className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-green-500"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                $2.4M
              </motion.div>
              <div className="text-sm text-gray-500 mt-1">24H VOLUME</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-red-500"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                -12.3%
              </motion.div>
              <div className="text-sm text-gray-500 mt-1">MORAL DECAY</div>
            </div>
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-purple-500"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                666
              </motion.div>
              <div className="text-sm text-gray-500 mt-1">SOULS TRADED</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-12"
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-none border border-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(147,51,234,0.8)] transition-all duration-300"
              data-testid="button-enter-exchange"
              onClick={() => window.location.href = '/trading'}
            >
              <Skull className="w-5 h-5 mr-2" />
              ENTER THE EXCHANGE
              <Eye className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Second Section - The Philosophy */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div 
          className="max-w-4xl mx-auto text-center z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            EVERY PROFIT HAS A VICTIM
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            In the shadows of the market, fortunes rise on the bones of the fallen. 
            Each trade extracts its toll. Each victory demands sacrifice. 
            The algorithm watches. The void consumes. Your humanity dissolves into numbers.
          </p>
          
          <div className="mt-12 flex justify-center gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring" }}
            >
              <Activity className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">TRADE</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring" }}
            >
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">PROFIT</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring" }}
            >
              <Skull className="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">CONSUME</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Matrix rain effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20
            }}
            animate={{
              y: [0, window.innerHeight + 100]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}