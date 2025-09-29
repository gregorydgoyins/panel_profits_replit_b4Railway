import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Eye,
  Clock,
  Star,
  Sparkles,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketPulse {
  timestamp: string;
  overallSentiment: string;
  energyLevel: number;
  activeForces: number;
  dominantHouse: string;
  cosmicEvents: string[];
  quickInsights: Array<{
    type: 'trending' | 'alert' | 'wisdom';
    message: string;
    urgency: 'low' | 'medium' | 'high';
    symbol: string;
  }>;
  nextMajorEvent: {
    name: string;
    timeUntil: string;
    impact: string;
    preparation: string;
  };
}

interface RealTimeInsight {
  id: string;
  type: 'price_alert' | 'battle_update' | 'anomaly_warning' | 'market_opportunity' | 'oracle_prophecy';
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  affectedAssets: string[];
  mysticalSymbol: string;
  actionRequired: boolean;
  houseRelevance?: string;
  confidenceLevel: number;
  expiresAt?: Date;
}

export function RealTimeInsightsFeed() {
  const [insights, setInsights] = useState<RealTimeInsight[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [unreadCount, setUnreadCount] = useState(0);
  const [feedPaused, setFeedPaused] = useState(false);
  const insightsEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch market pulse data
  const { data: marketPulse, refetch: refetchPulse } = useQuery({
    queryKey: ['/api/ai/market-pulse'],
    refetchInterval: 30000, // Update every 30 seconds
    enabled: isListening && !feedPaused
  });

  // Fetch real-time advanced insights from AI service
  const { data: advancedInsights, refetch: refetchInsights } = useQuery({
    queryKey: ['/api/ai/advanced-insights'],
    refetchInterval: 45000, // Update every 45 seconds for fresh insights
    enabled: isListening && !feedPaused
  });

  // Fetch market anomalies for alerts
  const { data: marketAnomalies, refetch: refetchAnomalies } = useQuery({
    queryKey: ['/api/ai/market-anomalies'],
    refetchInterval: 60000, // Update every minute
    enabled: isListening && !feedPaused
  });

  // Process real AI data into insights feed
  useEffect(() => {
    if (!isListening || feedPaused) return;

    const processRealInsights = () => {
      const newInsights: RealTimeInsight[] = [];
      const currentTime = new Date();

      // Process advanced insights from AI service
      if (advancedInsights && Array.isArray(advancedInsights)) {
        advancedInsights.slice(0, 3).forEach((insight: any, index: number) => {
          const realInsight: RealTimeInsight = {
            id: insight.id || `ai_insight_${Date.now()}_${index}`,
            type: insight.type === 'opportunity' ? 'market_opportunity' : 
                  insight.type === 'risk' ? 'anomaly_warning' :
                  insight.type === 'prophecy' ? 'oracle_prophecy' : 'price_alert',
            title: insight.title || 'Divine Market Insight',
            message: insight.description || insight.mysticalVision || 'The Oracle reveals new wisdom',
            urgency: insight.impact === 'positive' ? 'medium' : 
                     insight.impact === 'negative' ? 'high' : 'low',
            timestamp: currentTime,
            affectedAssets: insight.affectedAssets || [],
            mysticalSymbol: insight.divineSymbols?.[0] || (insight.type === 'prophecy' ? 'Crystal' : 'Eye'),
            actionRequired: insight.actionableInsights && insight.actionableInsights.length > 0,
            houseRelevance: Object.keys(insight.houseRelevance || {})[0] || 'wisdom',
            confidenceLevel: insight.confidence || 0.8,
            expiresAt: insight.urgency === 'critical' ? new Date(Date.now() + 10 * 60 * 1000) : undefined
          };
          newInsights.push(realInsight);
        });
      }

      // Process market anomalies as urgent alerts
      if (marketAnomalies && Array.isArray(marketAnomalies)) {
        marketAnomalies.slice(0, 2).forEach((anomaly: any, index: number) => {
          const urgencyMap = {
            'low': 'medium',
            'medium': 'high', 
            'high': 'critical',
            'critical': 'critical'
          };

          const anomalyInsight: RealTimeInsight = {
            id: anomaly.id || `anomaly_${Date.now()}_${index}`,
            type: 'anomaly_warning',
            title: `${anomaly.anomalyType?.replace('_', ' ').toUpperCase()} Alert`,
            message: anomaly.description || anomaly.mysticalWarning || 'Market disturbance detected',
            urgency: urgencyMap[anomaly.severity as keyof typeof urgencyMap] as RealTimeInsight['urgency'] || 'medium',
            timestamp: currentTime,
            affectedAssets: anomaly.affectedAssets || [],
            mysticalSymbol: 'AlertTriangle',
            actionRequired: true,
            houseRelevance: 'wisdom',
            confidenceLevel: anomaly.confidence || 0.9,
            expiresAt: anomaly.severity === 'critical' ? new Date(Date.now() + 5 * 60 * 1000) : undefined
          };
          newInsights.push(anomalyInsight);
        });
      }

      // Add market pulse insights
      if (marketPulse) {
        marketPulse.quickInsights?.forEach((quickInsight: any, index: number) => {
          const pulseInsight: RealTimeInsight = {
            id: `pulse_${Date.now()}_${index}`,
            type: quickInsight.type === 'alert' ? 'anomaly_warning' : 
                  quickInsight.type === 'trending' ? 'price_alert' : 'oracle_prophecy',
            title: `Market Pulse: ${quickInsight.type.charAt(0).toUpperCase() + quickInsight.type.slice(1)}`,
            message: quickInsight.message || 'Market energy fluctuation detected',
            urgency: quickInsight.urgency as RealTimeInsight['urgency'] || 'low',
            timestamp: currentTime,
            affectedAssets: [],
            mysticalSymbol: quickInsight.type === 'trending' ? 'TrendingUp' :
                             quickInsight.type === 'alert' ? 'AlertTriangle' : 'Eye',
            actionRequired: quickInsight.urgency === 'high',
            houseRelevance: marketPulse.dominantHouse || 'wisdom',
            confidenceLevel: 0.7,
            expiresAt: undefined
          };
          newInsights.push(pulseInsight);
        });
      }

      if (newInsights.length > 0) {
        setInsights(prev => {
          // Merge new insights with existing, avoiding duplicates
          const existingIds = new Set(prev.map(insight => insight.id));
          const uniqueNewInsights = newInsights.filter(insight => !existingIds.has(insight.id));
          
          if (uniqueNewInsights.length > 0) {
            setUnreadCount(prev => prev + uniqueNewInsights.length);
            setLastUpdateTime(new Date());
            
            // Play notification sound for critical insights
            const criticalInsights = uniqueNewInsights.filter(i => i.urgency === 'critical' || i.urgency === 'high');
            if (soundEnabled && criticalInsights.length > 0) {
              playNotificationSound(criticalInsights[0].urgency as 'high' | 'critical');
            }
          }

          return [...uniqueNewInsights, ...prev.slice(0, 47)]; // Keep total at 50
        });
      }
    };

    // Process real insights immediately and then periodically
    processRealInsights();
    const interval = setInterval(processRealInsights, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [isListening, feedPaused, advancedInsights, marketAnomalies, marketPulse, soundEnabled]);

  // Auto-scroll to bottom when new insights arrive
  useEffect(() => {
    if (insightsEndRef.current && !feedPaused) {
      insightsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [insights.length, feedPaused]);

  // Cleanup expired insights
  useEffect(() => {
    const cleanup = setInterval(() => {
      setInsights(prev => prev.filter(insight => 
        !insight.expiresAt || insight.expiresAt > new Date()
      ));
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanup);
  }, []);

  const playNotificationSound = (urgency: 'high' | 'critical') => {
    // Create audio context for mystical sound effects
    if (typeof window !== 'undefined' && soundEnabled) {
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different tones for different urgencies
        oscillator.frequency.setValueAtTime(
          urgency === 'critical' ? 880 : 440, // A5 for critical, A4 for high
          audioContext.currentTime
        );
        
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Audio notification failed:', error);
      }
    }
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const toggleFeed = () => {
    setFeedPaused(!feedPaused);
    if (!feedPaused) {
      setUnreadCount(0);
    }
  };

  const getInsightIcon = (type: RealTimeInsight['type']) => {
    switch (type) {
      case 'price_alert': return <TrendingUp className="h-4 w-4" />;
      case 'battle_update': return <Zap className="h-4 w-4" />;
      case 'anomaly_warning': return <AlertTriangle className="h-4 w-4" />;
      case 'market_opportunity': return <Star className="h-4 w-4" />;
      case 'oracle_prophecy': return <Eye className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: RealTimeInsight['urgency']) => {
    switch (urgency) {
      case 'low': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
      case 'medium': return 'border-amber-500 bg-amber-500/10 text-amber-400';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      default: return 'border-slate-500 bg-slate-500/10 text-slate-400';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-abyssal-depths via-shadowed-stone to-abyssal-depths">
      {/* Feed Header */}
      <div className="p-4 border-b border-legendary-gold/20 bg-shadowed-stone/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isListening && !feedPaused ? 360 : 0 }}
              transition={{ duration: 3, repeat: isListening && !feedPaused ? Infinity : 0, ease: 'linear' }}
            >
              <Sparkles className="h-6 w-6 text-legendary-gold" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-legendary-gold font-display">
                🔮 Oracle's Live Visions
              </h2>
              <p className="text-xs text-misted-silver">
                Real-time mystical market intelligence
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge 
                variant="outline" 
                className="text-legendary-gold border-legendary-gold animate-pulse"
                data-testid="badge-unread-count"
              >
                {unreadCount} new
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-misted-silver border-misted-silver/30"
              data-testid="button-mark-read"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${soundEnabled ? 'text-legendary-gold border-legendary-gold' : 'text-misted-silver border-misted-silver/30'}`}
              data-testid="button-toggle-sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFeed}
              className={`${feedPaused ? 'text-amber-400 border-amber-400' : 'text-emerald-400 border-emerald-400'}`}
              data-testid="button-toggle-feed"
            >
              {feedPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchPulse()}
              className="text-mystical-blue border-mystical-blue"
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Market Pulse Indicator */}
        {marketPulse && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-lg bg-abyssal-depths/30 border border-legendary-gold/10"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-misted-silver">Market Energy:</span>
                <div className="flex items-center gap-1">
                  <div className="w-20 h-2 bg-abyssal-depths rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-enchantment to-legendary-gold"
                      animate={{ width: `${marketPulse.energyLevel}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-legendary-gold font-medium">
                    {marketPulse.energyLevel.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-mystical-blue">{marketPulse.overallSentiment}</span>
              </div>
              
              <div className="text-right">
                <span className="text-misted-silver">Forces: </span>
                <span className="text-pure-light">{marketPulse.activeForces}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Insights Feed */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <AnimatePresence>
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Alert 
                  className={`${getUrgencyColor(insight.urgency)} hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
                  data-testid={`alert-insight-${insight.type}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-pure-light">
                          {insight.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {insight.actionRequired && (
                            <Badge variant="outline" className="text-xs text-amber-400 border-amber-400">
                              Action Required
                            </Badge>
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getUrgencyColor(insight.urgency)} border-current`}
                          >
                            {insight.urgency.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-misted-silver">
                        {insight.message}
                      </p>
                      
                      {insight.affectedAssets.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-misted-silver">Affected:</span>
                          <div className="flex flex-wrap gap-1">
                            {insight.affectedAssets.slice(0, 3).map((asset, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline" 
                                className="text-xs text-legendary-gold border-legendary-gold/30"
                              >
                                {asset}
                              </Badge>
                            ))}
                            {insight.affectedAssets.length > 3 && (
                              <Badge variant="outline" className="text-xs text-misted-silver border-misted-silver/30">
                                +{insight.affectedAssets.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-misted-silver">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(insight.timestamp)}
                          </div>
                          
                          {insight.houseRelevance && (
                            <div className="flex items-center gap-1">
                              <span>House:</span>
                              <span className="text-legendary-gold capitalize">
                                {insight.houseRelevance}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-misted-silver">Confidence:</span>
                          <span className="text-mystical-blue">
                            {(insight.confidenceLevel * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      {insight.expiresAt && (
                        <div className="text-xs text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expires: {insight.expiresAt.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {insights.length === 0 && (
            <div className="text-center py-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Eye className="h-12 w-12 text-legendary-gold mx-auto mb-3" />
              </motion.div>
              <p className="text-misted-silver">
                {feedPaused ? 'Oracle visions paused. Resume to see insights.' : 'The Oracle gazes into the cosmic void...'}
              </p>
              <p className="text-misted-silver text-sm mt-1">
                {feedPaused ? 'Click play to resume the mystical feed.' : 'Divine insights will appear as market energies stir.'}
              </p>
            </div>
          )}
          
          <div ref={insightsEndRef} />
        </div>
      </ScrollArea>
      
      {/* Feed Status Footer */}
      <div className="p-3 border-t border-legendary-gold/20 bg-shadowed-stone/30">
        <div className="flex items-center justify-between text-xs text-misted-silver">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isListening && !feedPaused ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`} />
            <span>
              {feedPaused ? 'Feed Paused' : isListening ? 'Oracle Active' : 'Oracle Sleeping'}
            </span>
          </div>
          
          <span>
            Last Update: {formatTimeAgo(lastUpdateTime)}
          </span>
          
          <span>
            {insights.length} Total Visions
          </span>
        </div>
      </div>
    </div>
  );
}

