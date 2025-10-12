import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Zap, TrendingUp, TrendingDown, Target, AlertTriangle,
  Sparkles, Flame, Shield, Swords, Crown, Eye
} from 'lucide-react';

interface PricePoint {
  timestamp: Date;
  price: number;
  volume: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  eventType?: 'breakout' | 'reversal' | 'consolidation' | 'volatility';
}

interface SplashPageData {
  assetId: string;
  assetName: string;
  assetType: 'character' | 'comic' | 'creator' | 'publisher';
  currentPrice: number;
  change24h: number;
  volume24h: number;
  priceHistory: PricePoint[];
  keyMoments: Array<{
    time: Date;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    icon: string;
  }>;
  narrativeArc: {
    title: string;
    phase: 'origin' | 'rising' | 'climax' | 'falling' | 'resolution';
    description: string;
  };
}

export function ComicMarketSplashPage({ assetId }: { assetId: string }) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null);
  const [splashEffect, setSplashEffect] = useState<string>('');

  // Fetch market data with comic narrative
  const { data: splashData, isLoading } = useQuery<SplashPageData>({
    queryKey: [`/api/market/comic-splash/${assetId}`],
    refetchInterval: 30000
  });

  // Generate comic book styled chart options
  const getChartOptions = (): Highcharts.Options => {
    if (!splashData) return {};

    // Comic book color palette based on sentiment
    const getComicColors = (phase: string) => {
      switch (phase) {
        case 'origin': return ['#1e3a8a', '#3b82f6', '#60a5fa']; // Blue tones - Beginning
        case 'rising': return ['#059669', '#10b981', '#34d399']; // Green tones - Growth
        case 'climax': return ['#dc2626', '#f87171', '#fca5a5']; // Red tones - Peak action
        case 'falling': return ['#7c3aed', '#a78bfa', '#c4b5fd']; // Purple tones - Decline
        case 'resolution': return ['#ea580c', '#fb923c', '#fdba74']; // Orange tones - Ending
        default: return ['#6b7280', '#9ca3af', '#d1d5db']; // Gray tones - Neutral
      }
    };

    const colors = getComicColors(splashData.narrativeArc.phase);

    return {
      chart: {
        type: 'areaspline',
        backgroundColor: 'transparent',
        height: 500,
        style: {
          fontFamily: '"Oswald", sans-serif'
        },
        animation: {
          duration: 2000,
          easing: 'easeOutBounce'
        }
      },
      title: {
        text: splashData.narrativeArc.title,
        style: {
          fontSize: '32px',
          fontWeight: '300',
          color: colors[0],
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: `3px 3px 0px ${colors[1]}, 6px 6px 0px ${colors[2]}`,
        }
      },
      subtitle: {
        text: splashData.narrativeArc.description,
        style: {
          fontSize: '14px',
          fontStyle: 'italic',
          color: '#94a3b8'
        }
      },
      xAxis: {
        type: 'datetime',
        lineWidth: 3,
        lineColor: colors[0],
        gridLineWidth: 2,
        gridLineColor: `${colors[2]}20`,
        gridLineDashStyle: 'Dash',
        labels: {
          style: {
            color: colors[1],
            fontSize: '12px',
            fontWeight: '300'
          }
        },
        plotBands: splashData.keyMoments.map((moment, idx) => ({
          from: new Date(moment.time).getTime() - 3600000,
          to: new Date(moment.time).getTime() + 3600000,
          color: `${colors[0]}10`,
          label: {
            text: '💥',
            style: {
              fontSize: '24px'
            }
          },
          events: {
            click: () => setSelectedMoment(idx)
          }
        }))
      },
      yAxis: {
        title: {
          text: 'POWER LEVEL',
          style: {
            color: colors[0],
            fontSize: '16px',
            fontWeight: '300',
            letterSpacing: '1px'
          }
        },
        lineWidth: 3,
        lineColor: colors[0],
        gridLineWidth: 2,
        gridLineColor: `${colors[2]}20`,
        gridLineDashStyle: 'Dash',
        labels: {
          style: {
            color: colors[1],
            fontSize: '12px',
            fontWeight: '300'
          },
          formatter: function() {
            return '$' + this.value;
          }
        }
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.3,
          lineWidth: 4,
          marker: {
            enabled: true,
            radius: 6,
            lineWidth: 2,
            lineColor: '#ffffff',
            states: {
              hover: {
                enabled: true,
                radius: 8,
                lineWidth: 3
              }
            }
          },
          states: {
            hover: {
              lineWidth: 6
            }
          },
          animation: {
            defer: 500
          }
        }
      },
      series: [{
        name: 'PRICE POWER',
        data: splashData.priceHistory.map(point => ({
          x: new Date(point.timestamp).getTime(),
          y: point.price,
          marker: {
            fillColor: point.eventType ? '#ff0000' : colors[1],
            symbol: point.eventType ? 'diamond' : 'circle',
            radius: point.eventType ? 10 : 6
          }
        })),
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, colors[0]],
            [0.5, colors[1]],
            [1, colors[2]]
          ]
        },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${colors[0]}60`],
            [0.7, `${colors[1]}30`],
            [1, `${colors[2]}10`]
          ]
        }
      }],
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: colors[0],
        borderWidth: 3,
        borderRadius: 8,
        style: {
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '300'
        },
        formatter: function() {
          const point = this.point as any;
          const pricePoint = splashData.priceHistory.find(
            p => new Date(p.timestamp).getTime() === point.x
          );
          
          return `
            <div style="padding: 8px;">
              <div style="font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">
                💰 ${this.y?.toFixed(2)}
              </div>
              ${pricePoint?.eventType ? `
                <div style="color: #fbbf24; margin-top: 4px;">
                  ⚡ ${pricePoint.eventType.toUpperCase()}!
                </div>
              ` : ''}
              <div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">
                Volume: ${pricePoint?.volume.toLocaleString() || 'N/A'}
              </div>
            </div>
          `;
        },
        useHTML: true
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    };
  };

  // Trigger splash effects on key events
  useEffect(() => {
    if (splashData?.narrativeArc.phase === 'climax') {
      setSplashEffect('animate-pulse');
      setTimeout(() => setSplashEffect(''), 3000);
    }
  }, [splashData?.narrativeArc.phase]);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'origin': return <Sparkles className="w-6 h-6" />;
      case 'rising': return <TrendingUp className="w-6 h-6" />;
      case 'climax': return <Flame className="w-6 h-6" />;
      case 'falling': return <TrendingDown className="w-6 h-6" />;
      case 'resolution': return <Shield className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="animate-pulse">
          <div className="h-96 bg-muted/30 rounded-lg" />
        </div>
      </Card>
    );
  }

  if (!splashData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900",
        "border-4 border-yellow-500",
        "shadow-[0_0_40px_rgba(234,179,8,0.3)]",
        splashEffect
      )}
      data-testid="comic-market-splash"
    >
      {/* Comic Book Title Header */}
      <div className="relative p-6 bg-gradient-to-r from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getPhaseIcon(splashData.narrativeArc.phase)}
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 uppercase tracking-wider">
                {splashData.assetName}
              </h1>
              <p className="text-sm text-yellow-200/80 italic">
                Chapter: {splashData.narrativeArc.phase}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
              ${splashData.currentPrice.toFixed(2)}
            </Badge>
            <Badge 
              className={cn(
                "font-bold text-lg px-4 py-2",
                splashData.change24h >= 0 ? "bg-green-500" : "bg-red-500"
              )}
            >
              {splashData.change24h >= 0 ? '+' : ''}{splashData.change24h.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Comic Splash Chart */}
      <div className="p-6">
        <div className="relative">
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={getChartOptions()}
          />
          
          {/* Explosion Effects on Key Moments */}
          <AnimatePresence>
            {selectedMoment !== null && splashData.keyMoments[selectedMoment] && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-yellow-400 rounded-full p-8 shadow-[0_0_100px_rgba(234,179,8,0.8)]">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-black mb-2">
                      {splashData.keyMoments[selectedMoment].title}
                    </p>
                    <p className="text-lg text-black/80">
                      {splashData.keyMoments[selectedMoment].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Key Moments Timeline */}
      <div className="p-6 bg-black/40">
        <h3 className="text-xl font-bold text-yellow-400 mb-4 uppercase">
          Epic Moments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {splashData.keyMoments.map((moment, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMoment(idx)}
              className={cn(
                "p-4 rounded-lg border-2 text-left transition-all",
                selectedMoment === idx
                  ? "border-yellow-400 bg-yellow-400/20"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
              data-testid={`moment-${idx}`}
            >
              <div className="flex items-start gap-3">
                <span className={cn("text-2xl", getImpactColor(moment.impact))}>
                  {moment.impact === 'high' ? '💥' : moment.impact === 'medium' ? '⚡' : '✨'}
                </span>
                <div>
                  <p className="font-bold text-white">{moment.title}</p>
                  <p className="text-sm text-white/60 mt-1">{moment.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comic Action Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-10">
          <defs>
            <radialGradient id="speedLines">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="70%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#speedLines)"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}