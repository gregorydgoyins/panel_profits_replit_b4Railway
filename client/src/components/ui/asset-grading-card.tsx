import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { Badge } from "./badge";

const assetGradingVariants = cva(
  "asset-grading-card relative",
  {
    variants: {
      grade: {
        "10.0": "border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl shadow-yellow-200",
        "9.8": "border-4 border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-xl shadow-emerald-200",
        "9.6": "border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl shadow-blue-200",
        "9.4": "border-4 border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-xl shadow-green-200",
        "9.2": "border-4 border-cyan-400 bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-xl shadow-cyan-200",
        "9.0": "border-4 border-indigo-400 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-xl shadow-indigo-200",
        "8.5": "border-4 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl shadow-purple-200",
        "8.0": "border-4 border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100 shadow-xl shadow-pink-200",
        "7.5": "border-4 border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl shadow-orange-200",
        "7.0": "border-4 border-red-400 bg-gradient-to-br from-red-50 to-red-100 shadow-xl shadow-red-200",
        ungraded: "border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg",
      },
      size: {
        compact: "w-64 h-80",
        standard: "w-80 h-96",
        large: "w-96 h-[28rem]",
        showcase: "w-[32rem] h-[40rem]",
      },
      certification: {
        "panel-profits": "bg-gradient-to-r from-blue-600 to-blue-700",
        "cgc": "bg-gradient-to-r from-yellow-500 to-yellow-600",
        "pgx": "bg-gradient-to-r from-purple-600 to-purple-700",
        "cbcs": "bg-gradient-to-r from-green-600 to-green-700",
        "house": "bg-gradient-to-r from-slate-600 to-slate-700",
      },
    },
    defaultVariants: {
      grade: "ungraded",
      size: "standard",
      certification: "panel-profits",
    },
  }
);

export interface AssetGrading {
  grade: number;
  gradingNotes: string[];
  centeredPercentage: number;
  whitePages: boolean;
  keyIssue: boolean;
  variant: boolean;
  signature: boolean;
  authentication: {
    certificationNumber: string;
    gradingDate: Date;
    grader: string;
    certificationBody: string;
  };
  qualityMetrics: {
    cornerSharpness: number;
    edgeIntegrity: number;
    surfaceQuality: number;
    colorStrike: number;
    spine: number;
    overall: number;
  };
}

export interface AssetData {
  id: string;
  symbol: string;
  name: string;
  description: string;
  type: "character" | "comic" | "creator" | "publisher";
  imageUrl?: string;
  currentPrice: number;
  marketCap?: number;
  volume24h?: number;
  priceChange24h: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  house?: string;
  publisher?: string;
  firstAppearance?: string;
  keyEvents?: string[];
}

export interface AssetGradingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof assetGradingVariants> {
  asset: AssetData;
  grading?: AssetGrading;
  showMetrics?: boolean;
  showAuthentication?: boolean;
  interactive?: boolean;
  onCardClick?: (asset: AssetData) => void;
  house?: string;
}

const AssetGradingCard = React.forwardRef<HTMLDivElement, AssetGradingCardProps>(
  ({ 
    className,
    grade: gradeVariant,
    size,
    certification,
    asset,
    grading,
    showMetrics = true,
    showAuthentication = true,
    interactive = true,
    onCardClick,
    house,
    ...props 
  }, ref) => {
    const actualGrade = grading?.grade ? 
      grading.grade >= 10.0 ? "10.0" :
      grading.grade >= 9.8 ? "9.8" :
      grading.grade >= 9.6 ? "9.6" :
      grading.grade >= 9.4 ? "9.4" :
      grading.grade >= 9.2 ? "9.2" :
      grading.grade >= 9.0 ? "9.0" :
      grading.grade >= 8.5 ? "8.5" :
      grading.grade >= 8.0 ? "8.0" :
      grading.grade >= 7.5 ? "7.5" :
      grading.grade >= 7.0 ? "7.0" : "7.0"
      : "ungraded";

    const getRarityColor = (rarity: AssetData["rarity"]) => {
      switch (rarity) {
        case "legendary": return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "epic": return "text-purple-600 bg-purple-50 border-purple-200";
        case "rare": return "text-blue-600 bg-blue-50 border-blue-200";
        case "uncommon": return "text-green-600 bg-green-50 border-green-200";
        default: return "text-slate-600 bg-slate-50 border-slate-200";
      }
    };

    const getGradeLabel = (grade: number) => {
      if (grade >= 10.0) return "PERFECT MINT";
      if (grade >= 9.8) return "NEAR MINT/MINT";
      if (grade >= 9.6) return "NEAR MINT+";
      if (grade >= 9.4) return "NEAR MINT";
      if (grade >= 9.2) return "NEAR MINT-";
      if (grade >= 9.0) return "VERY FINE/NEAR MINT";
      if (grade >= 8.5) return "VERY FINE+";
      if (grade >= 8.0) return "VERY FINE";
      if (grade >= 7.5) return "VERY FINE-";
      return "FINE/VERY FINE";
    };

    const getPerformanceIndicator = () => {
      const change = asset.priceChange24h;
      if (change > 10) return { label: "🚀 MOONSHOT", color: "text-green-600" };
      if (change > 5) return { label: "📈 BULLISH", color: "text-green-500" };
      if (change > 0) return { label: "📊 POSITIVE", color: "text-green-400" };
      if (change < -10) return { label: "💥 CRASH", color: "text-red-600" };
      if (change < -5) return { label: "📉 BEARISH", color: "text-red-500" };
      if (change < 0) return { label: "📊 NEGATIVE", color: "text-red-400" };
      return { label: "⚖️ STABLE", color: "text-slate-500" };
    };

    const performance = getPerformanceIndicator();

    return (
      <div
        ref={ref}
        className={cn(
          "relative transform transition-all duration-300",
          interactive && "hover:scale-105 hover-elevate cursor-pointer",
          assetGradingVariants({ grade: actualGrade, size, certification }),
          className
        )}
        onClick={() => interactive && onCardClick?.(asset)}
        data-testid={`asset-grading-card-${asset.id}`}
        {...props}
      >
        {/* Certification Header */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-8 flex items-center justify-center text-white font-bold text-sm",
          certification === "panel-profits" ? "bg-gradient-to-r from-blue-600 to-blue-700" :
          certification === "cgc" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
          certification === "house" && house ? `bg-house-${house}-primary` : "bg-gradient-to-r from-slate-600 to-slate-700"
        )}>
          PANEL PROFITS CERTIFIED • {grading?.authentication.certificationNumber || "UNGRADED"}
        </div>

        {/* Main Card Content */}
        <Card className="h-full mt-8 border-0 shadow-none bg-transparent">
          <CardHeader className="pb-2">
            {/* Asset Image */}
            <div className="relative mx-auto w-32 h-40 bg-slate-200 rounded border-2 border-slate-300 overflow-hidden">
              {asset.imageUrl ? (
                <img 
                  src={asset.imageUrl} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs">{asset.type.toUpperCase()}</div>
                  </div>
                </div>
              )}
              
              {/* Grade Overlay */}
              {grading && (
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded font-bold text-lg">
                  {grading.grade.toFixed(1)}
                </div>
              )}

              {/* Special Badges */}
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {grading?.keyIssue && <Badge variant="destructive" className="text-xs">KEY</Badge>}
                {grading?.variant && <Badge variant="secondary" className="text-xs">VAR</Badge>}
                {grading?.signature && <Badge variant="outline" className="text-xs">SIG</Badge>}
              </div>
            </div>

            {/* Asset Title */}
            <div className="text-center space-y-1">
              <h3 className="font-comic-display text-lg font-bold">
                {asset.name}
              </h3>
              <p className="font-comic-narrative text-sm text-slate-600">
                {asset.symbol} • {asset.type.toUpperCase()}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Grade Information */}
            {grading && (
              <div className="text-center space-y-2">
                <div className="space-y-1">
                  <div className="font-comic-display text-2xl font-bold">
                    {grading.grade.toFixed(1)}
                  </div>
                  <div className="font-comic-narrative text-xs font-bold tracking-wider">
                    {getGradeLabel(grading.grade)}
                  </div>
                </div>
                
                {grading.centeredPercentage > 0 && (
                  <div className="text-xs">
                    <span className="font-bold">Centering:</span> {grading.centeredPercentage}%
                  </div>
                )}
              </div>
            )}

            {/* Market Data */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="font-comic-display text-lg font-bold">
                  ${asset.currentPrice.toFixed(2)}
                </div>
                <div className="font-comic-narrative text-xs text-slate-600">
                  Current Price
                </div>
              </div>
              <div>
                <div className={cn(
                  "font-comic-display text-lg font-bold",
                  asset.priceChange24h >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {asset.priceChange24h >= 0 ? "+" : ""}{asset.priceChange24h.toFixed(1)}%
                </div>
                <div className="font-comic-narrative text-xs text-slate-600">
                  24h Change
                </div>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="text-center">
              <Badge variant="outline" className={cn("font-comic-display text-xs", performance.color)}>
                {performance.label}
              </Badge>
            </div>

            {/* Rarity Badge */}
            <div className="text-center">
              <Badge variant="outline" className={cn("font-comic-display text-xs", getRarityColor(asset.rarity))}>
                {asset.rarity.toUpperCase()} RARITY
              </Badge>
            </div>

            {/* Quality Metrics */}
            {showMetrics && grading && (
              <div className="space-y-2">
                <div className="font-comic-display text-xs font-bold text-center">
                  QUALITY METRICS
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span>Corners:</span>
                    <span className="font-bold">{grading.qualityMetrics.cornerSharpness}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edges:</span>
                    <span className="font-bold">{grading.qualityMetrics.edgeIntegrity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surface:</span>
                    <span className="font-bold">{grading.qualityMetrics.surfaceQuality}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span className="font-bold">{grading.qualityMetrics.colorStrike}/10</span>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication */}
            {showAuthentication && grading && (
              <div className="space-y-1 text-center text-xs text-slate-600">
                <div className="font-bold">AUTHENTICATED</div>
                <div>Graded: {grading.authentication.gradingDate.toLocaleDateString()}</div>
                <div>By: {grading.authentication.grader}</div>
              </div>
            )}

            {/* Grading Notes */}
            {grading && grading.gradingNotes.length > 0 && (
              <div className="space-y-1">
                <div className="font-comic-display text-xs font-bold text-center">
                  GRADING NOTES
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  {grading.gradingNotes.map((note, index) => (
                    <div key={index} className="text-center">• {note}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Holographic Security Feature */}
        {grading && grading.grade >= 9.0 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full rounded opacity-20 bg-gradient-to-br from-transparent via-white to-transparent animate-pulse"></div>
          </div>
        )}

        {/* Serial Number */}
        {grading && (
          <div className="absolute bottom-1 right-1 text-xs text-slate-400 font-mono">
            #{grading.authentication.certificationNumber}
          </div>
        )}
      </div>
    );
  }
);

AssetGradingCard.displayName = "AssetGradingCard";

// Utility function to calculate asset grade based on performance
export function calculateAssetGrade(asset: AssetData, marketMetrics: any): AssetGrading {
  // Base grade calculation using various metrics
  let baseGrade = 7.0;
  
  // Performance boost
  if (asset.priceChange24h > 20) baseGrade += 2.0;
  else if (asset.priceChange24h > 10) baseGrade += 1.5;
  else if (asset.priceChange24h > 5) baseGrade += 1.0;
  else if (asset.priceChange24h > 0) baseGrade += 0.5;
  
  // Volume consideration
  if (asset.volume24h && asset.volume24h > 1000000) baseGrade += 0.5;
  
  // Rarity bonus
  const rarityBonus = {
    legendary: 1.5,
    epic: 1.0,
    rare: 0.5,
    uncommon: 0.2,
    common: 0
  }[asset.rarity];
  
  baseGrade += rarityBonus;
  
  // Cap at 10.0
  const finalGrade = Math.min(10.0, baseGrade);
  
  // Generate quality metrics
  const baseQuality = Math.floor(finalGrade);
  const qualityMetrics = {
    cornerSharpness: Math.min(10, baseQuality + Math.floor(Math.random() * 2)),
    edgeIntegrity: Math.min(10, baseQuality + Math.floor(Math.random() * 2)),
    surfaceQuality: Math.min(10, baseQuality + Math.floor(Math.random() * 2)),
    colorStrike: Math.min(10, baseQuality + Math.floor(Math.random() * 2)),
    spine: Math.min(10, baseQuality + Math.floor(Math.random() * 2)),
    overall: finalGrade
  };

  return {
    grade: finalGrade,
    gradingNotes: [
      finalGrade >= 9.5 ? "Exceptional market performance" : "Strong market presence",
      asset.rarity === "legendary" ? "Legendary rarity premium" : "Standard rarity assessment"
    ],
    centeredPercentage: Math.floor(Math.random() * 20) + 80,
    whitePages: true,
    keyIssue: asset.rarity === "legendary" || asset.rarity === "epic",
    variant: asset.type === "comic" && Math.random() > 0.7,
    signature: Math.random() > 0.9,
    authentication: {
      certificationNumber: `PP${Date.now().toString().slice(-8)}`,
      gradingDate: new Date(),
      grader: "Panel Profits Grading Service",
      certificationBody: "PPGS"
    },
    qualityMetrics
  };
}

export { AssetGradingCard, assetGradingVariants };