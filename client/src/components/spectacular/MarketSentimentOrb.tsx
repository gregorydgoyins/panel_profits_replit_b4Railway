import React, { useState, useEffect, useRef } from 'react';
import { Brain, TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';

interface SentimentData {
  overall: number; // -1 to 1
  confidence: number; // 0 to 1
  categories: {
    news: number;
    social: number;
    technical: number;
    volume: number;
  };
  sources: {
    ai: number;
    human: number;
    algorithmic: number;
  };
}

interface MarketSentimentOrbProps {
  sentimentData: SentimentData;
  className?: string;
}

export function MarketSentimentOrb({ sentimentData, className = "" }: MarketSentimentOrbProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
  }>>([]);
  
  const orbRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Generate particles based on sentiment
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 200,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: sentimentData.overall > 0 ? 'rgb(34, 197, 94)' : 
             sentimentData.overall < 0 ? 'rgb(239, 68, 68)' : 
             'rgb(156, 163, 175)'
    }));
    setParticles(newParticles);
  }, [sentimentData]);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 200) % 200,
        y: (particle.y + particle.vy + 200) % 200,
        opacity: (Math.sin(Date.now() * 0.001 + particle.id) + 1) * 0.4 + 0.2
      })));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getSentimentColor = (value: number) => {
    if (value > 0.3) return 'text-emerald-400 from-emerald-500/30 to-green-400/30';
    if (value > 0.1) return 'text-blue-400 from-blue-500/30 to-cyan-400/30';
    if (value > -0.1) return 'text-yellow-400 from-yellow-500/30 to-amber-400/30';
    if (value > -0.3) return 'text-orange-400 from-orange-500/30 to-red-400/30';
    return 'text-red-400 from-red-500/30 to-pink-400/30';
  };

  const sentimentColorClass = getSentimentColor(sentimentData.overall);
  const confidencePercent = Math.round(sentimentData.confidence * 100);

  return (
    <div className={`relative ${className}`}>
      {/* Main Orb Container */}
      <div 
        ref={orbRef}
        className="relative w-64 h-64 mx-auto overflow-hidden rounded-full bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50"
      >
        {/* Outer Glow Ring */}
        <div className={`
          absolute inset-2 rounded-full border-2 opacity-60 animate-pulse
          ${sentimentData.overall > 0 ? 'border-emerald-400' : 
            sentimentData.overall < 0 ? 'border-red-400' : 
            'border-slate-400'}
        `} />

        {/* Inner Energy Ring */}
        <div className={`
          absolute inset-4 rounded-full bg-gradient-to-br ${sentimentColorClass.split(' ').slice(1).join(' ')} opacity-20 animate-pulse
        `} />

        {/* Particle System */}
        <svg className="absolute inset-0 w-full h-full">
          {particles.map(particle => (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={particle.color}
              opacity={particle.opacity}
            />
          ))}
        </svg>

        {/* Central Core */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-600/50 flex items-center justify-center">
          <div className="text-center">
            <Brain className={`w-8 h-8 mx-auto mb-2 ${sentimentColorClass.split(' ')[0]} animate-pulse`} />
            <div className={`text-2xl font-display font-bold ${sentimentColorClass.split(' ')[0]} font-trading`}>
              {(sentimentData.overall * 100).toFixed(0)}
            </div>
            <div className="text-xs text-slate-400 font-light">SENTIMENT</div>
          </div>
        </div>

        {/* Rotating Data Points */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
          {/* News Sentiment */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          </div>
          
          {/* Social Sentiment */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          </div>
          
          {/* Technical Sentiment */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          
          {/* Volume Sentiment */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Scanning Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Data Panel */}
      <div className="mt-6 space-y-3">
        {/* Confidence Meter */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400 flex items-center space-x-1">
              <Activity className="w-4 h-4" />
              <span>AI Confidence</span>
            </span>
            <span className="text-white font-trading">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${
                confidencePercent > 80 ? 'from-emerald-500 to-green-400' :
                confidencePercent > 60 ? 'from-blue-500 to-cyan-400' :
                confidencePercent > 40 ? 'from-yellow-500 to-amber-400' :
                'from-red-500 to-orange-400'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">News</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.news > 0 ? 'text-emerald-400' : 
                sentimentData.categories.news < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.news * 100).toFixed(0)}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Social</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.social > 0 ? 'text-emerald-400' : 
                sentimentData.categories.social < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.social * 100).toFixed(0)}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Technical</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.technical > 0 ? 'text-emerald-400' : 
                sentimentData.categories.technical < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.technical * 100).toFixed(0)}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Volume</span>
              <span className={`text-sm font-trading ${
                sentimentData.categories.volume > 0 ? 'text-emerald-400' : 
                sentimentData.categories.volume < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {(sentimentData.categories.volume * 100).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketSentimentOrb;