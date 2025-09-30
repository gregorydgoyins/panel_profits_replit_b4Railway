import { useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TrendingUp, TrendingDown, Zap, Shield, Swords } from 'lucide-react';

interface MarketEvent {
  id: string;
  type: string;
  asset: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

interface ComicChartProps {
  data: MarketEvent[];
  height?: number;
  showVolume?: boolean;
  showIndicators?: boolean;
  theme?: 'hero' | 'villain' | 'battle';
}

export const ComicChart = memo(({ 
  data, 
  height = 400,
  showVolume = true,
  showIndicators = false,
  theme = 'battle'
}: ComicChartProps) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  
  // Process data for chart
  const chartData = useMemo(() => {
    const priceData = data.map(event => ({
      x: new Date(event.timestamp).getTime(),
      y: event.price,
      color: event.change > 0 ? '#10B981' : '#EF4444',
      marker: {
        symbol: event.change > 0 ? 'triangle' : 'triangle-down',
        radius: Math.abs(event.changePercent) > 3 ? 8 : 5,
        fillColor: event.change > 0 ? '#10B981' : '#EF4444',
        lineWidth: 2,
        lineColor: '#000'
      },
      dataLabels: {
        enabled: Math.abs(event.changePercent) > 3,
        format: Math.abs(event.changePercent) > 3 ? 
          (event.change > 0 ? 'BOOM!' : 'CRASH!') : ''
      }
    }));
    
    const volumeData = data.map(event => ({
      x: new Date(event.timestamp).getTime(),
      y: event.volume,
      color: event.volume > 20000 ? '#F59E0B' : '#6B7280'
    }));
    
    return { priceData, volumeData };
  }, [data]);
  
  // Chart configuration with comic book styling
  const options = useMemo(() => ({
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'monospace'
      },
      animation: {
        duration: 1000,
        easing: 'easeOutBounce'
      }
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      gridLineColor: '#374151',
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      lineColor: '#000',
      lineWidth: 3,
      labels: {
        style: {
          color: '#9CA3AF',
          fontSize: '10px'
        }
      },
      plotLines: data.filter(e => Math.abs(e.changePercent) > 3).map(e => ({
        value: new Date(e.timestamp).getTime(),
        color: e.change > 0 ? '#10B981' : '#EF4444',
        width: 2,
        zIndex: 5,
        dashStyle: 'Solid',
        label: {
          text: e.change > 0 ? '💥' : '💀',
          style: {
            fontSize: '16px'
          },
          verticalAlign: 'top',
          y: -10
        }
      }))
    },
    yAxis: [
      {
        title: {
          text: 'PRICE',
          style: {
            color: '#F3F4F6',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        },
        gridLineColor: '#1F2937',
        gridLineWidth: 2,
        gridLineDashStyle: 'LongDash',
        lineColor: '#000',
        lineWidth: 3,
        labels: {
          style: {
            color: '#9CA3AF',
            fontSize: '10px'
          },
          formatter: function() {
            return '$' + this.value;
          }
        },
        plotBands: [
          {
            from: Math.min(...chartData.priceData.map(d => d.y)) * 0.98,
            to: Math.min(...chartData.priceData.map(d => d.y)),
            color: 'rgba(239, 68, 68, 0.1)',
            label: {
              text: 'DANGER ZONE',
              style: {
                color: '#EF4444',
                fontWeight: 'bold'
              }
            }
          },
          {
            from: Math.max(...chartData.priceData.map(d => d.y)),
            to: Math.max(...chartData.priceData.map(d => d.y)) * 1.02,
            color: 'rgba(16, 185, 129, 0.1)',
            label: {
              text: 'VICTORY ZONE',
              style: {
                color: '#10B981',
                fontWeight: 'bold'
              }
            }
          }
        ]
      },
      showVolume ? {
        title: {
          text: 'VOLUME',
          style: {
            color: '#F3F4F6',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        },
        opposite: true,
        gridLineWidth: 0,
        labels: {
          style: {
            color: '#9CA3AF',
            fontSize: '10px'
          },
          formatter: function() {
            return (this.value as number / 1000) + 'K';
          }
        },
        height: '30%',
        top: '70%'
      } : null
    ].filter(Boolean),
    series: [
      {
        type: 'spline',
        name: 'BATTLE LINE',
        data: chartData.priceData,
        color: '#F59E0B',
        lineWidth: 3,
        shadow: {
          color: 'rgba(0, 0, 0, 0.75)',
          width: 5,
          offsetX: 2,
          offsetY: 2
        },
        zones: [
          {
            value: chartData.priceData.length > 0 ? 
              chartData.priceData[chartData.priceData.length - 1].y * 0.98 : 0,
            color: '#EF4444'
          },
          {
            value: chartData.priceData.length > 0 ? 
              chartData.priceData[chartData.priceData.length - 1].y * 1.02 : Infinity,
            color: '#F59E0B'
          },
          {
            color: '#10B981'
          }
        ],
        marker: {
          enabled: true,
          radius: 6,
          lineWidth: 2,
          lineColor: '#000',
          states: {
            hover: {
              radius: 10,
              lineWidth: 3
            }
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            textShadow: '2px 2px 0 #000'
          }
        },
        animation: {
          defer: 0,
          duration: 1500
        }
      },
      showVolume ? {
        type: 'column',
        name: 'CROWD SIZE',
        data: chartData.volumeData,
        yAxis: 1,
        borderColor: '#000',
        borderWidth: 2,
        animation: {
          defer: 500,
          duration: 1000
        }
      } : null
    ].filter(Boolean),
    plotOptions: {
      series: {
        animation: {
          duration: 1000,
          easing: 'easeOutBounce'
        },
        states: {
          hover: {
            enabled: true,
            lineWidthPlus: 2
          }
        }
      },
      spline: {
        marker: {
          enabled: true,
          symbol: 'circle'
        }
      },
      column: {
        borderRadius: 0,
        groupPadding: 0.1,
        pointPadding: 0.05
      }
    },
    tooltip: {
      backgroundColor: '#000',
      borderColor: '#FFF',
      borderWidth: 3,
      borderRadius: 0,
      style: {
        color: '#FFF',
        fontSize: '12px',
        fontWeight: 'bold'
      },
      formatter: function() {
        const point = this.point as any;
        if (this.series.name === 'BATTLE LINE') {
          return `<b>${this.series.name}</b><br/>
                  PRICE: $${this.y?.toFixed(2)}<br/>
                  ${point.color === '#10B981' ? '🦸 HERO RISING!' : '🦹‍♂️ VILLAIN STRIKES!'}`;
        } else {
          return `<b>${this.series.name}</b><br/>
                  VOLUME: ${((this.y || 0) / 1000).toFixed(1)}K<br/>
                  ${(this.y || 0) > 20000 ? '🔥 MASSIVE CROWD!' : '👥 Normal Activity'}`;
        }
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'top',
      itemStyle: {
        color: '#F3F4F6',
        fontWeight: 'bold',
        fontSize: '11px'
      },
      itemHoverStyle: {
        color: '#F59E0B'
      }
    }
  }), [chartData, data, showVolume]);
  
  // Add comic effects overlay
  const renderComicEffects = () => {
    const latestEvent = data[0];
    if (!latestEvent) return null;
    
    const isVolatile = Math.abs(latestEvent.changePercent) > 3;
    const isBullish = latestEvent.change > 0;
    
    return (
      <AnimatePresence>
        {isVolatile && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {/* Speed lines for dramatic effect */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(8)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${50 + Math.cos(i * Math.PI / 4) * 50}%`}
                  y2={`${50 + Math.sin(i * Math.PI / 4) * 50}%`}
                  stroke={isBullish ? '#10B981' : '#EF4444'}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              ))}
            </svg>
            
            {/* Impact effect */}
            <motion.div
              className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                "text-6xl font-black",
                isBullish ? "text-green-400" : "text-red-400"
              )}
              style={{
                textShadow: '3px 3px 0 #000, -3px -3px 0 #000',
                fontFamily: 'Impact, sans-serif'
              }}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1.5, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isBullish ? "POW!" : "BAM!"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  return (
    <div className="relative" style={{ height }}>
      {/* Chart background with comic book style */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
        {/* Halftone pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '10px 10px'
          }}
        />
        
        {/* Border frame */}
        <div className="absolute inset-0 border-4 border-black rounded-lg" />
      </div>
      
      {/* Highcharts container */}
      <div className="relative z-5 h-full">
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
        />
      </div>
      
      {/* Comic effects overlay */}
      {renderComicEffects()}
      
      {/* Corner badges for special events */}
      {data.some(e => Math.abs(e.changePercent) > 5) && (
        <div className="absolute top-2 right-2 z-20">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-yellow-400 text-black px-3 py-1 font-black text-xs rounded-full"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            EPIC BATTLE!
          </motion.div>
        </div>
      )}
    </div>
  );
});

ComicChart.displayName = 'ComicChart';