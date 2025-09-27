import React, { useState, useEffect, useRef } from 'react';
import { Activity, TrendingUp, TrendingDown, Zap, Globe, Brain, Eye, Target } from 'lucide-react';

interface MarketData {
  index: number;
  change: number;
  volume: number;
  volatility: number;
  marketCap: number;
  activeAssets: number;
  topGainers: Array<{ symbol: string; change: number }>;
  topLosers: Array<{ symbol: string; change: number }>;
  sectorPerformance: Array<{ sector: string; performance: number; allocation: number }>;
  sentimentData: {
    overall: number;
    confidence: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  };
}

interface QuantumMarketDashboardProps {
  marketData: MarketData;
  className?: string;
}

export function QuantumMarketDashboard({ marketData, className = "" }: QuantumMarketDashboardProps) {
  const [activeNodes, setActiveNodes] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    pulse: boolean;
  }>>([]);
  
  const [quantumField, setQuantumField] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate quantum network nodes
  useEffect(() => {
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 300,
      size: Math.random() * 6 + 2,
      color: marketData.change > 0 ? 'rgb(34, 197, 94)' : 
             marketData.change < 0 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)',
      pulse: Math.random() > 0.7
    }));
    setActiveNodes(nodes);
  }, [marketData]);

  // Quantum field animation
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumField(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw quantum connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw quantum field
      for (let i = 0; i < activeNodes.length; i++) {
        for (let j = i + 1; j < activeNodes.length; j++) {
          const node1 = activeNodes[i];
          const node2 = activeNodes[j];
          const distance = Math.sqrt(
            Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
          );
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      activeNodes.forEach(node => {
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.pulse ? 0.8 + Math.sin(Date.now() * 0.01) * 0.2 : 0.6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeNodes]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-emerald-400 bg-emerald-500/20';
    if (sentiment > 0.1) return 'text-blue-400 bg-blue-500/20';
    if (sentiment > -0.1) return 'text-yellow-400 bg-yellow-500/20';
    if (sentiment > -0.3) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Quantum Background Field */}
      <div className="absolute inset-0 opacity-20">
        <canvas 
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-full"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Index - Main Display */}
        <div className="lg:col-span-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 overflow-hidden">
          <div className="relative">
            {/* Holographic Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Globe className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">Comic Market Index</h2>
                  <p className="text-slate-400 text-sm">Real-time quantum analysis</p>
                </div>
              </div>
              
              {/* Live Status */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">LIVE</span>
              </div>
            </div>

            {/* Main Index Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <div className="text-4xl font-display font-bold text-white font-trading mb-2">
                  {marketData.index.toLocaleString()}
                </div>
                <div className={`
                  flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
                  ${marketData.change > 0 ? 'bg-emerald-500/20 text-emerald-400' : 
                    marketData.change < 0 ? 'bg-red-500/20 text-red-400' : 
                    'bg-slate-500/20 text-slate-400'}
                `}>
                  {marketData.change > 0 ? <TrendingUp className="w-4 h-4" /> : 
                   marketData.change < 0 ? <TrendingDown className="w-4 h-4" /> : 
                   <Activity className="w-4 h-4" />}
                  <span>{marketData.change > 0 ? '+' : ''}{marketData.change.toFixed(2)}%</span>
                </div>
              </div>

              {/* Quantum Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-400">Volume</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    {marketData.volume >= 1e9 ? `${(marketData.volume / 1e9).toFixed(1)}B` : 
                     marketData.volume >= 1e6 ? `${(marketData.volume / 1e6).toFixed(1)}M` : 
                     `${(marketData.volume / 1e3).toFixed(1)}K`}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-400">Volatility</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    {(marketData.volatility * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Active</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    {marketData.activeAssets}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Cap</span>
                  </div>
                  <div className="text-lg font-display font-bold text-white font-trading">
                    CC {marketData.marketCap >= 1e9 ? `${(marketData.marketCap / 1e9).toFixed(1)}B` : 
                         `${(marketData.marketCap / 1e6).toFixed(1)}M`}
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Performance Visualization */}
            <div>
              <h3 className="text-lg font-display font-semibold text-white mb-3">Sector Quantum State</h3>
              <div className="space-y-2">
                {marketData.sectorPerformance.map((sector, index) => (
                  <div key={sector.sector} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{sector.sector}</span>
                      <span className={`text-sm font-trading ${
                        sector.performance > 0 ? 'text-emerald-400' : 
                        sector.performance < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 relative overflow-hidden">
                      {/* Base allocation bar */}
                      <div 
                        className="h-2 bg-slate-600 rounded-full"
                        style={{ width: `${sector.allocation}%` }}
                      />
                      {/* Performance overlay */}
                      <div 
                        className={`
                          absolute top-0 left-0 h-2 rounded-full transition-all duration-500
                          ${sector.performance > 0 ? 'bg-emerald-500' : 
                            sector.performance < 0 ? 'bg-red-500' : 'bg-slate-500'}
                        `}
                        style={{ 
                          width: `${Math.min(sector.allocation, Math.abs(sector.performance) * 10)}%`,
                          opacity: Math.abs(sector.performance) / 10
                        }}
                      />
                      {/* Quantum particle effect */}
                      <div 
                        className="absolute top-0 left-0 w-1 h-2 bg-white rounded-full animate-pulse"
                        style={{ 
                          left: `${(sector.allocation * (Math.sin(quantumField * 0.1 + index) + 1)) / 2}%`,
                          opacity: 0.6
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Sentiment & Movers */}
        <div className="space-y-6">
          {/* AI Sentiment Panel */}
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-display font-semibold text-white">AI Sentiment</h3>
            </div>
            
            <div className="text-center mb-4">
              <div className={`
                inline-flex items-center justify-center w-16 h-16 rounded-full mb-2
                ${getSentimentColor(marketData.sentimentData.overall)}
              `}>
                <span className="text-2xl font-display font-bold font-trading">
                  {(marketData.sentimentData.overall * 100).toFixed(0)}
                </span>
              </div>
              <div className="text-sm text-slate-400 capitalize">
                {marketData.sentimentData.trend}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Confidence</span>
                <span className="text-white">{(marketData.sentimentData.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${marketData.sentimentData.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Market Movers */}
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50">
            <h3 className="text-lg font-display font-semibold text-white mb-3">Quantum Movers</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm text-emerald-400 mb-2 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Top Gainers</span>
                </h4>
                <div className="space-y-1">
                  {marketData.topGainers.slice(0, 3).map((gainer, index) => (
                    <div key={gainer.symbol} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{gainer.symbol}</span>
                      <span className="text-emerald-400 font-trading">+{gainer.change.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-red-400 mb-2 flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>Top Losers</span>
                </h4>
                <div className="space-y-1">
                  {marketData.topLosers.slice(0, 3).map((loser, index) => (
                    <div key={loser.symbol} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{loser.symbol}</span>
                      <span className="text-red-400 font-trading">{loser.change.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Field Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          style={{ 
            transform: `translateX(${Math.sin(quantumField * 0.02) * 100}px)`,
            opacity: 0.6 
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
          style={{ 
            transform: `translateX(${Math.sin(quantumField * 0.015 + Math.PI) * 100}px)`,
            opacity: 0.4 
          }}
        />
      </div>
    </div>
  );
}

export default QuantumMarketDashboard;