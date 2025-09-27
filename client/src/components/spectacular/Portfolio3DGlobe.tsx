import React, { useState, useEffect, useRef } from 'react';
import { Globe, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, User, PenTool, BookOpen, MapPin, Zap, Star } from 'lucide-react';

interface PortfolioAsset {
  symbol: string;
  name: string;
  allocation: number; // percentage
  value: number;
  change: number;
  changePercent: number;
  category: 'character' | 'creator' | 'publisher' | 'location' | 'gadget';
  coordinates: { lat: number; lng: number }; // For globe positioning
}

interface Portfolio3DGlobeProps {
  assets: PortfolioAsset[];
  totalValue: number;
  totalReturn: number;
  className?: string;
}

export function Portfolio3DGlobe({ assets, totalValue, totalReturn, className = "" }: Portfolio3DGlobeProps) {
  const [rotationY, setRotationY] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAsset | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const globeRef = useRef<HTMLDivElement>(null);

  // Continuous rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'character': return 'from-blue-500 to-cyan-400';
      case 'creator': return 'from-purple-500 to-pink-400';
      case 'publisher': return 'from-emerald-500 to-green-400';
      case 'location': return 'from-yellow-500 to-amber-400';
      case 'gadget': return 'from-red-500 to-orange-400';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'character': return <User className="w-3 h-3 text-white" />;
      case 'creator': return <PenTool className="w-3 h-3 text-white" />;
      case 'publisher': return <BookOpen className="w-3 h-3 text-white" />;
      case 'location': return <MapPin className="w-3 h-3 text-white" />;
      case 'gadget': return <Zap className="w-3 h-3 text-white" />;
      default: return <Star className="w-3 h-3 text-white" />;
    }
  };

  // Position assets on sphere based on allocation
  const positionAssets = (assets: PortfolioAsset[]) => {
    return assets.map((asset, index) => {
      const angle = (index / assets.length) * 2 * Math.PI;
      const y = Math.sin(angle) * 0.5; // Vertical position
      const x = Math.cos(angle) * Math.cos(rotationY * Math.PI / 180) * 0.5;
      const z = Math.cos(angle) * Math.sin(rotationY * Math.PI / 180) * 0.5;
      
      return {
        ...asset,
        position: { x, y, z },
        visible: z > -0.3, // Only show front-facing assets
        scale: Math.max(0.5, 1 + z * 0.5) // Perspective scaling
      };
    });
  };

  const positionedAssets = positionAssets(assets);

  return (
    <div className={`relative ${className}`}>
      {/* Main Globe Container */}
      <div className="relative w-80 h-80 mx-auto">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Globe Structure */}
        <div 
          ref={globeRef}
          className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-slate-700/50 overflow-hidden"
          style={{
            boxShadow: `
              inset 0 0 50px rgba(148, 163, 184, 0.1),
              0 0 50px rgba(59, 130, 246, 0.2),
              0 0 100px rgba(147, 51, 234, 0.1)
            `
          }}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {/* Latitude lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`lat-${i}`}
                className="absolute left-0 w-full border-t border-slate-600/30"
                style={{ top: `${(i + 1) * 12.5}%` }}
              />
            ))}
            
            {/* Longitude lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`lng-${i}`}
                className="absolute top-0 h-full border-l border-slate-600/30"
                style={{ 
                  left: `${(i + 1) * 12.5}%`,
                  transform: `rotateY(${rotationY}deg)`
                }}
              />
            ))}
          </div>

          {/* Asset Points */}
          {positionedAssets.map((asset, index) => (
            asset.visible && (
              <div
                key={asset.symbol}
                className="absolute cursor-pointer transition-all duration-300 hover:scale-125"
                style={{
                  left: `${50 + asset.position.x * 100}%`,
                  top: `${50 + asset.position.y * 100}%`,
                  transform: `translate(-50%, -50%) scale(${asset.scale})`,
                  zIndex: Math.round((asset.position.z + 1) * 10)
                }}
                onMouseEnter={(e) => {
                  setSelectedAsset(asset);
                  setHoverPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setSelectedAsset(null)}
              >
                {/* Asset Dot */}
                <div className={`
                  w-6 h-6 rounded-full border-2 border-white/60 
                  bg-gradient-to-br ${getCategoryColor(asset.category)}
                  shadow-lg relative overflow-hidden
                  ${asset.change > 0 ? 'animate-pulse' : ''}
                `}>
                  {/* Inner glow */}
                  <div className="absolute inset-1 rounded-full bg-white/20" />
                  
                  {/* Category icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getCategoryIcon(asset.category)}
                  </div>
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" />
              </div>
            )
          ))}

          {/* Central Core */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-slate-600/50 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400 animate-pulse" />
              <div className="text-sm font-display font-bold text-white">Portfolio</div>
              <div className="text-xs text-slate-400">Globe View</div>
            </div>
          </div>

          {/* Rotating Highlight Ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-400/60 via-transparent to-blue-400/60"
            style={{
              transform: `rotateZ(${rotationY}deg)`,
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)'
            }}
          />
        </div>

        {/* Orbit Rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-8 rounded-full border border-blue-400/30"
            style={{ transform: `rotateX(60deg) rotateY(${rotationY * 0.5}deg)` }}
          />
          <div 
            className="absolute inset-16 rounded-full border border-purple-400/20"
            style={{ transform: `rotateX(45deg) rotateY(${-rotationY * 0.3}deg)` }}
          />
        </div>
      </div>

      {/* Asset Tooltip */}
      {selectedAsset && (
        <div 
          className="fixed z-50 bg-slate-900/95 backdrop-blur-xl rounded-lg p-3 border border-slate-700/50 shadow-2xl max-w-xs pointer-events-none"
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getCategoryColor(selectedAsset.category)}`} />
            <span className="font-display font-bold text-white">{selectedAsset.symbol}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Value:</span>
              <span className="text-white font-trading">CC {selectedAsset.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Change:</span>
              <span className={`font-trading ${
                selectedAsset.change > 0 ? 'text-emerald-400' : 
                selectedAsset.change < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {selectedAsset.change > 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Allocation:</span>
              <span className="text-white font-trading">{selectedAsset.allocation.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 border border-slate-700/50 text-center">
          <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <div className="text-lg font-display font-bold text-white font-trading">
            CC {totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Total Value</div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 border border-slate-700/50 text-center">
          {totalReturn > 0 ? <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-400" /> :
           totalReturn < 0 ? <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-400" /> :
           <BarChart3 className="w-6 h-6 mx-auto mb-2 text-slate-400" />}
          <div className={`text-lg font-display font-bold font-trading ${
            totalReturn > 0 ? 'text-emerald-400' : 
            totalReturn < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400">Total Return</div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-4 border border-slate-700/50 text-center">
          <PieChart className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <div className="text-lg font-display font-bold text-white font-trading">
            {assets.length}
          </div>
          <div className="text-xs text-slate-400">Assets</div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio3DGlobe;