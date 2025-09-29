import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Zap, TrendingUp, TrendingDown, AlertTriangle, Sparkles,
  Flame, Shield, Swords, Crown, Eye, Clock, ChevronLeft,
  ChevronRight, BookOpen, Star, Skull, Heart, Diamond
} from 'lucide-react';

interface MarketEventPanel {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  impact: 'critical' | 'major' | 'moderate' | 'minor';
  type: 'battle' | 'alliance' | 'betrayal' | 'discovery' | 'prophecy';
  affectedAssets: Array<{
    id: string;
    name: string;
    role: 'hero' | 'villain' | 'bystander';
    changePercent: number;
  }>;
  visualStyle: 'action' | 'dramatic' | 'mysterious' | 'epic';
  soundEffect?: string;
  panelLayout: 'full' | 'split' | 'corner' | 'overlay';
}

interface ComicSequence {
  title: string;
  issue: number;
  panels: MarketEventPanel[];
  currentPage: number;
  totalPages: number;
}

export function ComicPanelMarketEvents() {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const controls = useAnimation();

  // Fetch market events formatted as comic panels
  const { data: comicSequence, isLoading } = useQuery<ComicSequence>({
    queryKey: ['/api/market/comic-events'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Auto-advance panels
  useEffect(() => {
    if (!isAutoPlay || !comicSequence) return;

    const timer = setInterval(() => {
      setCurrentPanel((prev) => 
        prev < comicSequence.panels.length - 1 ? prev + 1 : 0
      );
    }, 8000); // 8 seconds per panel

    return () => clearInterval(timer);
  }, [isAutoPlay, comicSequence]);

  // Trigger panel animations
  useEffect(() => {
    if (!comicSequence) return;
    
    const panel = comicSequence.panels[currentPanel];
    if (panel?.visualStyle === 'action') {
      controls.start({
        scale: [1, 1.05, 1],
        rotate: [0, -1, 1, 0],
        transition: { duration: 0.3, repeat: 2 }
      });
    } else if (panel?.visualStyle === 'dramatic') {
      controls.start({
        opacity: [1, 0.7, 1],
        transition: { duration: 2 }
      });
    }
  }, [currentPanel, comicSequence, controls]);

  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-gradient-to-br from-red-900 to-red-600 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
      case 'major':
        return 'bg-gradient-to-br from-orange-900 to-orange-600 border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.5)]';
      case 'moderate':
        return 'bg-gradient-to-br from-yellow-900 to-yellow-600 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]';
      case 'minor':
        return 'bg-gradient-to-br from-blue-900 to-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      default:
        return 'bg-gradient-to-br from-gray-900 to-gray-600 border-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'battle': return <Swords className="w-6 h-6" />;
      case 'alliance': return <Shield className="w-6 h-6" />;
      case 'betrayal': return <Skull className="w-6 h-6" />;
      case 'discovery': return <Eye className="w-6 h-6" />;
      case 'prophecy': return <Star className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'hero': return 'text-green-400 bg-green-900/50';
      case 'villain': return 'text-red-400 bg-red-900/50';
      case 'bystander': return 'text-gray-400 bg-gray-900/50';
      default: return 'text-blue-400 bg-blue-900/50';
    }
  };

  const getPanelLayout = (layout: string, panel: MarketEventPanel) => {
    switch (layout) {
      case 'full':
        return (
          <div className="relative w-full h-full p-8 flex flex-col justify-between">
            {/* Title Banner */}
            <div className="absolute top-0 left-0 right-0 bg-black/80 p-4 border-b-4 border-yellow-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(panel.type)}
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase tracking-wider">
                    {panel.title}
                  </h2>
                </div>
                <Badge className="bg-red-600 text-white font-bold animate-pulse">
                  {panel.impact.toUpperCase()}!
                </Badge>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center mt-20">
              <motion.div
                animate={controls}
                className="text-center max-w-2xl"
              >
                <p className="text-xl text-white/90 italic leading-relaxed mb-6">
                  "{panel.description}"
                </p>
                
                {/* Affected Assets */}
                <div className="flex flex-wrap justify-center gap-3">
                  {panel.affectedAssets.map((asset) => (
                    <motion.div
                      key={asset.id}
                      whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2",
                        getRoleColor(asset.role)
                      )}
                    >
                      <p className="font-bold">{asset.name}</p>
                      <p className={cn(
                        "text-sm font-mono",
                        asset.changePercent >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Timestamp */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(panel.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        );

      case 'split':
        return (
          <div className="grid grid-cols-2 gap-4 h-full p-6">
            <div className="flex flex-col justify-center p-4 border-r-4 border-yellow-400">
              <div className="mb-4">{getTypeIcon(panel.type)}</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                {panel.title}
              </h3>
              <p className="text-white/80 italic">{panel.description}</p>
            </div>
            <div className="flex flex-col justify-center p-4">
              <h4 className="text-lg font-bold text-white/90 mb-3">IMPACT ZONE</h4>
              <div className="space-y-2">
                {panel.affectedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className={cn(
                      "p-2 rounded border",
                      getRoleColor(asset.role)
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{asset.name}</span>
                      <span className={cn(
                        "font-mono text-sm",
                        asset.changePercent >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return getPanelLayout('full', panel);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[600px] bg-gradient-to-br from-purple-950 to-indigo-950">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-yellow-400 animate-pulse mx-auto mb-4" />
            <p className="text-yellow-400 text-xl font-bold">Loading Comic Sequence...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!comicSequence || comicSequence.panels.length === 0) {
    return null;
  }

  const currentPanelData = comicSequence.panels[currentPanel];

  return (
    <div className="space-y-6" data-testid="comic-panel-events">
      {/* Comic Book Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 uppercase">
              {comicSequence.title}
            </h2>
            <p className="text-sm text-yellow-400/60">
              Issue #{comicSequence.issue} • Page {currentPanel + 1} of {comicSequence.panels.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          >
            {isAutoPlay ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>

      {/* Main Comic Panel */}
      <motion.div
        key={currentPanel}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className={cn(
          "relative h-[500px] rounded-lg border-4 overflow-hidden",
          getImpactStyle(currentPanelData.impact)
        )}
        data-testid={`panel-${currentPanel}`}
      >
        <AnimatePresence mode="wait">
          {getPanelLayout(currentPanelData.panelLayout, currentPanelData)}
        </AnimatePresence>

        {/* Comic Panel Effects */}
        {currentPanelData.visualStyle === 'action' && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Zap className="w-32 h-32 text-yellow-400/30" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Panel Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPanel(Math.max(0, currentPanel - 1))}
          disabled={currentPanel === 0}
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          data-testid="button-prev-panel"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {/* Panel Indicators */}
        <div className="flex gap-2">
          {comicSequence.panels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPanel(idx)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                currentPanel === idx
                  ? "bg-yellow-400 w-8"
                  : "bg-yellow-400/30 hover:bg-yellow-400/50"
              )}
              data-testid={`indicator-${idx}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentPanel(Math.min(comicSequence.panels.length - 1, currentPanel + 1))}
          disabled={currentPanel === comicSequence.panels.length - 1}
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          data-testid="button-next-panel"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Quick Event List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {comicSequence.panels.slice(0, 4).map((panel, idx) => (
          <motion.button
            key={panel.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPanel(idx)}
            className={cn(
              "p-3 rounded-lg border-2 text-left transition-all",
              currentPanel === idx
                ? "border-yellow-400 bg-yellow-400/20"
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
            data-testid={`quick-event-${idx}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon(panel.type)}
              <Badge className={cn("text-xs", 
                panel.impact === 'critical' ? "bg-red-600" :
                panel.impact === 'major' ? "bg-orange-600" :
                panel.impact === 'moderate' ? "bg-yellow-600" : "bg-blue-600"
              )}>
                {panel.impact}
              </Badge>
            </div>
            <p className="text-xs font-medium text-white/90 line-clamp-2">
              {panel.title}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}