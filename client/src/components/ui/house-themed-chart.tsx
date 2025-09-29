import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useHouseTheme, type MythologicalHouse } from "@/contexts/HouseThemeContext";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

const houseThemedChartVariants = cva(
  "relative transition-all duration-500 ease-out house-theme-transition",
  {
    variants: {
      variant: {
        default: "rounded-lg border shadow-sm",
        trading: "house-trading-bonus rounded-lg border-2 shadow-lg",
        splash: "rounded-xl border-4 shadow-2xl min-h-96",
        minimal: "border-0 shadow-none",
        cosmic: "rounded-xl border-0 shadow-2xl overflow-hidden",
        noir: "rounded-sm border shadow-lg",
        mystical: "rounded-lg border shadow-xl",
        elemental: "rounded-xl border-2 shadow-lg",
        temporal: "rounded-lg border-2 shadow-lg",
        ethereal: "rounded-2xl border-0 shadow-2xl overflow-hidden",
      },
      house: {
        heroes: "house-heroes comic-panel",
        wisdom: "house-wisdom comic-panel",
        power: "house-power comic-panel",
        mystery: "house-mystery comic-panel",
        elements: "house-elements comic-panel",
        time: "house-time comic-panel",
        spirit: "house-spirit comic-panel",
      },
      chartType: {
        line: "",
        area: "",
        bar: "",
        candlestick: "",
        volume: "",
        sentiment: "",
      },
      size: {
        sm: "h-32",
        default: "h-64",
        lg: "h-96",
        xl: "h-[32rem]",
        splash: "h-[40rem]",
      },
      animation: {
        none: "",
        pulse: "mystical-pulse",
        glow: "sacred-glow-moderate",
        flow: "house-themed-flow",
      },
    },
    defaultVariants: {
      variant: "default",
      house: "heroes",
      chartType: "line",
      size: "default",
      animation: "none",
    },
  }
);

export interface TradingDataPoint {
  timestamp: string | number;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  sentiment?: number;
  houseBonus?: number;
  trend?: 'up' | 'down' | 'neutral';
  volatility?: number;
}

export interface HouseThemedChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof houseThemedChartVariants> {
  data: TradingDataPoint[];
  houseOverride?: MythologicalHouse;
  showHouseEffects?: boolean;
  effectIntensity?: 'low' | 'medium' | 'high';
  tradingIndicators?: boolean;
  marketSentiment?: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  assetType?: string;
  timeframe?: '1h' | '4h' | '1d' | '1w' | '1m';
  showVolume?: boolean;
  showSentiment?: boolean;
  onDataPointClick?: (data: TradingDataPoint) => void;
  customConfig?: ChartConfig;
  trendLines?: boolean;
  houseMultiplier?: number;
}

// House-specific color schemes for charts
const HOUSE_CHART_COLORS = {
  heroes: {
    primary: '#dc2626', // Red
    secondary: '#2563eb', // Blue  
    accent: '#eab308', // Yellow
    gradient: ['#dc2626', '#2563eb'],
    background: 'rgba(220, 38, 38, 0.1)',
    grid: 'rgba(220, 38, 38, 0.2)',
  },
  wisdom: {
    primary: '#1d4ed8', // Blue
    secondary: '#64748b', // Slate
    accent: '#93c5fd', // Light blue
    gradient: ['#1e293b', '#1d4ed8'],
    background: 'rgba(29, 78, 216, 0.1)',
    grid: 'rgba(29, 78, 216, 0.2)',
  },
  power: {
    primary: '#7c3aed', // Purple
    secondary: '#4338ca', // Indigo
    accent: '#fbbf24', // Yellow
    gradient: ['#7c3aed', '#4338ca'],
    background: 'rgba(124, 58, 237, 0.1)',
    grid: 'rgba(124, 58, 237, 0.2)',
  },
  mystery: {
    primary: '#059669', // Green
    secondary: '#047857', // Emerald
    accent: '#6ee7b7', // Light green
    gradient: ['#047857', '#059669'],
    background: 'rgba(5, 150, 105, 0.1)',
    grid: 'rgba(5, 150, 105, 0.2)',
  },
  elements: {
    primary: '#ea580c', // Orange
    secondary: '#eab308', // Yellow
    accent: '#fed7aa', // Light orange
    gradient: ['#ea580c', '#eab308'],
    background: 'rgba(234, 88, 12, 0.1)',
    grid: 'rgba(234, 88, 12, 0.2)',
  },
  time: {
    primary: '#64748b', // Slate
    secondary: '#eab308', // Yellow
    accent: '#fbbf24', // Gold
    gradient: ['#64748b', '#eab308'],
    background: 'rgba(100, 116, 139, 0.1)',
    grid: 'rgba(234, 179, 8, 0.2)',
  },
  spirit: {
    primary: '#0891b2', // Cyan
    secondary: '#0d9488', // Teal
    accent: '#67e8f9', // Light cyan
    gradient: ['#0891b2', '#0d9488'],
    background: 'rgba(8, 145, 178, 0.1)',
    grid: 'rgba(8, 145, 178, 0.2)',
  },
} as const;

const HouseThemedChart = React.forwardRef<HTMLDivElement, HouseThemedChartProps>(
  ({
    className,
    variant,
    house,
    chartType,
    size,
    animation,
    data,
    houseOverride,
    showHouseEffects = true,
    effectIntensity = 'medium',
    tradingIndicators = true,
    marketSentiment = 'neutral',
    assetType,
    timeframe = '1d',
    showVolume = false,
    showSentiment = false,
    onDataPointClick,
    customConfig,
    trendLines = false,
    houseMultiplier = 1,
    ...props
  }, ref) => {
    const { currentHouse, getHouseTheme } = useHouseTheme();
    const activeHouse = houseOverride || house || currentHouse;
    const activeTheme = getHouseTheme(activeHouse);
    const houseColors = HOUSE_CHART_COLORS[activeHouse];

    // Default chart configuration with house theming
    const defaultChartConfig: ChartConfig = {
      price: {
        label: "Price",
        color: houseColors.primary,
      },
      volume: {
        label: "Volume",
        color: houseColors.secondary,
      },
      sentiment: {
        label: "Sentiment",
        color: houseColors.accent,
      },
      ...customConfig,
    };

    // House-specific chart styling
    const getHouseChartClasses = (houseName: MythologicalHouse) => {
      const chartStyles = {
        heroes: {
          base: "bg-gradient-to-br from-red-50/50 via-blue-50/50 to-yellow-50/50 border-red-200",
          effects: "house-heroes-speed-lines",
          grid: "stroke-red-200",
        },
        wisdom: {
          base: "bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-slate-800/90 border-blue-400/30",
          effects: "house-wisdom-venetian-blinds",
          grid: "stroke-blue-300",
        },
        power: {
          base: "bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-800/90 border-purple-400/30",
          effects: "house-power-energy-surge",
          grid: "stroke-purple-300",
        },
        mystery: {
          base: "bg-gradient-to-br from-green-900/90 via-emerald-900/90 to-green-800/90 border-green-400/30",
          effects: "house-mystery-mist-reveal",
          grid: "stroke-green-300",
        },
        elements: {
          base: "bg-gradient-to-br from-orange-100/50 via-yellow-100/50 to-orange-100/50 border-orange-400/40",
          effects: "house-elements-fire-flow",
          grid: "stroke-orange-300",
        },
        time: {
          base: "bg-gradient-to-br from-slate-800/90 via-yellow-900/90 to-slate-700/90 border-yellow-400/40",
          effects: "house-time-ripple",
          grid: "stroke-yellow-300",
        },
        spirit: {
          base: "bg-gradient-to-br from-cyan-900/90 via-teal-900/90 to-cyan-800/90 border-cyan-400/30",
          effects: "house-spirit-divine-aura",
          grid: "stroke-cyan-300",
        },
      };
      return chartStyles[houseName] || chartStyles.heroes;
    };

    // Market sentiment indicator
    const getSentimentIndicator = () => {
      const sentimentConfig = {
        bullish: {
          icon: TrendingUp,
          color: "text-green-500",
          bg: "bg-green-500/20",
          label: "Bullish",
        },
        bearish: {
          icon: TrendingDown,
          color: "text-red-500",
          bg: "bg-red-500/20",
          label: "Bearish",
        },
        neutral: {
          icon: Activity,
          color: "text-gray-500",
          bg: "bg-gray-500/20",
          label: "Neutral",
        },
        volatile: {
          icon: Activity,
          color: "text-purple-500",
          bg: "bg-purple-500/20",
          label: "Volatile",
        },
      };

      const config = sentimentConfig[marketSentiment];
      const Icon = config.icon;

      return (
        <div className={cn(
          "absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-lg z-20",
          config.bg,
          "border border-current/20"
        )}>
          <Icon className={cn("w-4 h-4", config.color)} />
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>
        </div>
      );
    };

    // Custom tooltip for house-themed data
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className={cn(
            "rounded-lg border p-3 shadow-lg backdrop-blur-sm",
            "bg-background/95 text-foreground border-primary/20"
          )}>
            <p className="font-medium mb-2">{`Time: ${label}`}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${entry.dataKey}: ${entry.value}`}
                {entry.dataKey === 'price' && houseMultiplier !== 1 && (
                  <span className="text-xs opacity-70 ml-1">
                    (x{houseMultiplier} house bonus)
                  </span>
                )}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    // Render different chart types
    const renderChart = () => {
      const commonProps = {
        data,
        onClick: onDataPointClick,
      };

      switch (chartType) {
        case 'area':
          return (
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id={`house-gradient-${activeHouse}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={houseColors.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={houseColors.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={houseColors.grid} />
              <XAxis dataKey="timestamp" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={houseColors.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#house-gradient-${activeHouse})`}
              />
              {showVolume && (
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke={houseColors.secondary}
                  strokeWidth={1}
                  fillOpacity={0.3}
                  fill={houseColors.secondary}
                />
              )}
            </AreaChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={houseColors.grid} />
              <XAxis dataKey="timestamp" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="price" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.trend === 'up' ? houseColors.primary : 
                          entry.trend === 'down' ? houseColors.secondary : houseColors.accent} 
                  />
                ))}
              </Bar>
              {showVolume && (
                <Bar dataKey="volume" fill={houseColors.accent} opacity={0.6} />
              )}
            </BarChart>
          );

        case 'line':
        default:
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={houseColors.grid} />
              <XAxis dataKey="timestamp" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={houseColors.primary}
                strokeWidth={2}
                dot={{ fill: houseColors.primary, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 6, stroke: houseColors.primary, strokeWidth: 2 }}
              />
              {showSentiment && (
                <Line
                  type="monotone"
                  dataKey="sentiment"
                  stroke={houseColors.accent}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
              {trendLines && (
                <ReferenceLine 
                  y={data.reduce((sum, d) => sum + d.price, 0) / data.length} 
                  stroke={houseColors.secondary} 
                  strokeDasharray="3 3" 
                />
              )}
            </LineChart>
          );
      }
    };

    const houseStyles = getHouseChartClasses(activeHouse);

    return (
      <div
        ref={ref}
        className={cn(
          houseThemedChartVariants({
            variant,
            house: activeHouse,
            chartType,
            size,
            animation: showHouseEffects ? animation : 'none'
          }),
          houseStyles.base,
          className
        )}
        data-testid={`house-themed-chart-${activeHouse}-${chartType}`}
        {...props}
      >
        {/* House-specific visual effect overlay */}
        {showHouseEffects && (
          <div className={cn(
            "absolute inset-0 pointer-events-none rounded-inherit",
            effectIntensity === 'high' ? "opacity-15" : effectIntensity === 'medium' ? "opacity-10" : "opacity-5",
            houseStyles.effects
          )} />
        )}

        {/* Market sentiment indicator */}
        {tradingIndicators && getSentimentIndicator()}

        {/* House multiplier indicator */}
        {houseMultiplier !== 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-primary/20 border border-primary/40 z-20">
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <DollarSign className="w-4 h-4" />
              x{houseMultiplier.toFixed(1)}
            </div>
          </div>
        )}

        {/* Asset type indicator */}
        {assetType && (
          <div className="absolute bottom-4 left-4 px-2 py-1 rounded text-xs font-medium bg-background/80 border z-20">
            {assetType.toUpperCase()}
          </div>
        )}

        {/* Chart container */}
        <ChartContainer
          config={defaultChartConfig}
          className={cn(
            "relative z-10",
            size === 'sm' ? "h-32" : size === 'lg' ? "h-96" : size === 'xl' ? "h-[32rem]" : "h-64"
          )}
        >
          {renderChart()}
        </ChartContainer>

        {/* Trading indicators overlay */}
        {tradingIndicators && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            <div className={cn(
              "px-2 py-1 rounded text-xs font-medium bg-background/80 border",
              timeframe
            )}>
              {timeframe.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    );
  }
);

HouseThemedChart.displayName = "HouseThemedChart";

// Specialized chart components for different trading scenarios
export function HouseTradingChart({
  house,
  data,
  assetType,
  ...props
}: Omit<HouseThemedChartProps, 'variant' | 'chartType'> & {
  house?: MythologicalHouse;
  assetType?: string;
}) {
  return (
    <HouseThemedChart
      variant="trading"
      chartType="area"
      house={house}
      data={data}
      assetType={assetType}
      tradingIndicators={true}
      showHouseEffects={true}
      trendLines={true}
      {...props}
    />
  );
}

export function HouseVolumeChart({
  house,
  data,
  ...props
}: Omit<HouseThemedChartProps, 'variant' | 'chartType' | 'showVolume'> & {
  house?: MythologicalHouse;
}) {
  return (
    <HouseThemedChart
      variant="trading"
      chartType="bar"
      house={house}
      data={data}
      showVolume={true}
      tradingIndicators={true}
      {...props}
    />
  );
}

export function HouseSentimentChart({
  house,
  data,
  ...props
}: Omit<HouseThemedChartProps, 'variant' | 'chartType' | 'showSentiment'> & {
  house?: MythologicalHouse;
}) {
  return (
    <HouseThemedChart
      variant="mystical"
      chartType="line"
      house={house}
      data={data}
      showSentiment={true}
      animation="pulse"
      {...props}
    />
  );
}

export { HouseThemedChart, houseThemedChartVariants, HOUSE_CHART_COLORS };