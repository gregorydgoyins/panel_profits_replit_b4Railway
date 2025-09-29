import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { Badge } from "./badge";
import { ComicSoundEffect } from "./comic-sound-effect";

const variantCoverVariants = cva(
  "variant-cover-display relative overflow-hidden",
  {
    variants: {
      rarity: {
        "1-in-1": "border-4 border-rainbow bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 shadow-2xl shadow-rainbow/50",
        "1-in-10": "border-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl shadow-yellow-300",
        "1-in-25": "border-4 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl shadow-purple-300",
        "1-in-50": "border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl shadow-blue-300",
        "1-in-100": "border-4 border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-xl shadow-green-300",
        "1-in-500": "border-4 border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl shadow-orange-300",
        "1-in-1000": "border-4 border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-xl shadow-red-300",
        standard: "border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg",
      },
      variantStyle: {
        foil: "bg-gradient-to-br from-silver-50 via-white to-silver-50",
        holographic: "bg-gradient-to-br from-rainbow-start via-rainbow-mid to-rainbow-end",
        metallic: "bg-gradient-to-br from-slate-300 via-slate-100 to-slate-300",
        glossy: "bg-gradient-to-br from-white via-slate-50 to-white",
        matte: "bg-slate-100",
        sketch: "bg-paper filter sepia-10",
        blackwhite: "bg-gradient-to-br from-slate-900 to-slate-700 text-white",
      },
      size: {
        standard: "w-80 h-96",
        large: "w-96 h-[28rem]",
        showcase: "w-[32rem] h-[40rem]",
        gallery: "w-[28rem] h-[35rem]",
      },
      edition: {
        first: "border-double border-8",
        limited: "border-dashed border-4",
        collectors: "border-dotted border-4", 
        special: "border-solid border-6",
        standard: "border-solid border-2",
      },
    },
    defaultVariants: {
      rarity: "standard",
      variantStyle: "glossy",
      size: "standard",
      edition: "standard",
    },
  }
);

export interface VariantAsset {
  id: string;
  baseAssetId: string;
  title: string;
  subtitle?: string;
  variant: {
    name: string;
    type: "cover" | "sketch" | "virgin" | "foil" | "holographic" | "signed" | "graded" | "error";
    artist: string;
    publisher: string;
    printRun: number;
    serialNumber?: number;
    releaseDate: Date;
  };
  rarity: {
    tier: "1-in-1" | "1-in-10" | "1-in-25" | "1-in-50" | "1-in-100" | "1-in-500" | "1-in-1000" | "standard";
    totalPrint: number;
    mintNumber?: number;
    mintDate?: Date;
  };
  pricing: {
    mintPrice: number;
    currentPrice: number;
    lastSale?: number;
    highestSale?: number;
    priceChange24h: number;
    priceChangePercent: number;
  };
  authenticity: {
    verified: boolean;
    certificate?: string;
    blockchain?: string;
    grading?: {
      service: string;
      grade: number;
      population: number;
    };
  };
  metadata: {
    imageUrl?: string;
    description: string;
    keyFeatures: string[];
    specialEffects: string[];
    house?: string;
  };
}

export interface VariantCoverDisplayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>,
    VariantProps<typeof variantCoverVariants> {
  style?: React.CSSProperties;
  asset: VariantAsset;
  showEffects?: boolean;
  showPricing?: boolean;
  showAuthenticity?: boolean;
  showMetadata?: boolean;
  interactive?: boolean;
  onReveal?: (asset: VariantAsset) => void;
  onPurchase?: (asset: VariantAsset) => void;
  revealed?: boolean;
}

const VariantCoverDisplay = React.forwardRef<HTMLDivElement, VariantCoverDisplayProps>(
  ({ 
    className,
    rarity,
    variantStyle,
    size,
    edition,
    style,
    asset,
    showEffects = true,
    showPricing = true,
    showAuthenticity = true,
    showMetadata = true,
    interactive = true,
    onReveal,
    onPurchase,
    revealed = false,
    ...props 
  }, ref) => {
    const [isRevealed, setIsRevealed] = React.useState(revealed);
    const [showSpecialEffect, setShowSpecialEffect] = React.useState(false);
    const [isGlowing, setIsGlowing] = React.useState(false);

    React.useEffect(() => {
      if (asset.rarity.tier === "1-in-1" || asset.rarity.tier === "1-in-10") {
        const interval = setInterval(() => {
          setIsGlowing(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
      }
    }, [asset.rarity.tier]);

    const handleReveal = () => {
      if (!isRevealed) {
        setIsRevealed(true);
        setShowSpecialEffect(true);
        onReveal?.(asset);
        
        setTimeout(() => {
          setShowSpecialEffect(false);
        }, 2000);
      }
    };

    const getRarityDisplay = () => {
      const rarityInfo = {
        "1-in-1": { label: "ONE OF ONE", color: "text-rainbow font-bold animate-pulse", icon: "👑" },
        "1-in-10": { label: "ULTRA RARE", color: "text-yellow-600 font-bold", icon: "💎" },
        "1-in-25": { label: "SUPER RARE", color: "text-purple-600 font-bold", icon: "🌟" },
        "1-in-50": { label: "VERY RARE", color: "text-blue-600 font-bold", icon: "⭐" },
        "1-in-100": { label: "RARE", color: "text-green-600 font-bold", icon: "✨" },
        "1-in-500": { label: "UNCOMMON", color: "text-orange-600 font-bold", icon: "🔥" },
        "1-in-1000": { label: "LIMITED", color: "text-red-600 font-bold", icon: "💫" },
        "standard": { label: "STANDARD", color: "text-slate-600", icon: "📊" },
      }[asset.rarity.tier];

      return {
        ...rarityInfo,
        ratio: asset.rarity.tier
      };
    };

    const getValuePerformance = () => {
      const change = asset.pricing.priceChangePercent;
      if (change > 50) return { label: "🚀 MOONSHOT", color: "text-green-600 animate-bounce" };
      if (change > 25) return { label: "📈 SOARING", color: "text-green-500" };
      if (change > 10) return { label: "⬆️ RISING", color: "text-green-400" };
      if (change > 0) return { label: "➕ GAINING", color: "text-green-300" };
      if (change < -50) return { label: "💥 CRASHED", color: "text-red-600" };
      if (change < -25) return { label: "📉 FALLING", color: "text-red-500" };
      if (change < -10) return { label: "⬇️ DECLINING", color: "text-red-400" };
      if (change < 0) return { label: "➖ LOSING", color: "text-red-300" };
      return { label: "⚖️ STABLE", color: "text-slate-500" };
    };

    const rarityDisplay = getRarityDisplay();
    const performance = getValuePerformance();

    return (
      <div
        ref={ref}
        className={cn(
          "relative transform transition-all duration-500",
          interactive && "hover:scale-105 hover-elevate cursor-pointer",
          isGlowing && "animate-pulse",
          variantCoverVariants({ rarity: asset.rarity.tier, variantStyle, size, edition }),
          className
        )}
        onClick={interactive ? handleReveal : undefined}
        style={style}
        data-testid={`variant-cover-${asset.id}`}
        {...props}
      >
        {/* Holographic Effect Overlay */}
        {(variantStyle === "holographic" || asset.variant.type === "holographic") && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-slow-spin pointer-events-none" />
        )}

        {/* Foil Effect */}
        {(variantStyle === "foil" || asset.variant.type === "foil") && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />
        )}

        {/* Rarity Glow */}
        {(asset.rarity.tier === "1-in-1" || asset.rarity.tier === "1-in-10") && (
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-lg opacity-75 blur-lg animate-pulse pointer-events-none" />
        )}

        {/* Main Card */}
        <Card className="h-full border-0 shadow-none bg-transparent relative z-10">
          {/* Header with Edition Info */}
          <div className="absolute top-0 left-0 right-0 bg-black text-white px-3 py-1 flex justify-between items-center">
            <div className="font-comic-display text-xs font-bold">
              {asset.variant.type.toUpperCase()} VARIANT
            </div>
            <div className="font-comic-narrative text-xs">
              #{asset.rarity.mintNumber || "???"}
            </div>
          </div>

          <CardHeader className="pt-8 pb-2">
            {/* Cover Art Area */}
            <div className="relative mx-auto w-48 h-64 bg-slate-200 rounded border-2 border-slate-400 overflow-hidden">
              {!isRevealed ? (
                // Mystery Cover
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">❓</div>
                    <div className="font-comic-display text-sm">MYSTERY VARIANT</div>
                    <div className="font-comic-narrative text-xs mt-1">Click to Reveal</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
              ) : (
                // Revealed Cover
                <div className="w-full h-full">
                  {asset.metadata.imageUrl ? (
                    <img 
                      src={asset.metadata.imageUrl} 
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{rarityDisplay.icon}</div>
                        <div className="font-comic-display text-lg font-bold">
                          {asset.variant.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Artist Signature */}
                  {asset.variant.type === "signed" && (
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs">
                      ✍️ SIGNED
                    </div>
                  )}
                </div>
              )}

              {/* Rarity Badge */}
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs border-2", rarityDisplay.color)}
                >
                  {rarityDisplay.icon} {rarityDisplay.label}
                </Badge>
              </div>

              {/* Serial Number */}
              {asset.rarity.mintNumber && (
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded font-mono text-xs">
                  #{asset.rarity.mintNumber.toString().padStart(4, '0')}
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="text-center space-y-1 mt-3">
              <h3 className="font-comic-display text-lg font-bold">
                {asset.title}
              </h3>
              {asset.subtitle && (
                <p className="font-comic-narrative text-sm text-slate-600">
                  {asset.subtitle}
                </p>
              )}
              <div className="flex justify-center space-x-2 text-xs">
                <span className="font-bold">{asset.variant.artist}</span>
                <span>•</span>
                <span>{asset.variant.publisher}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Rarity Information */}
            <div className="text-center space-y-2">
              <div className="space-y-1">
                <div className={cn("font-comic-display text-lg", rarityDisplay.color)}>
                  {rarityDisplay.ratio.toUpperCase()}
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">{asset.rarity.totalPrint.toLocaleString()}</span> Total Print Run
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            {showPricing && isRevealed && (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="font-comic-display text-lg font-bold">
                    ${asset.pricing.currentPrice.toFixed(2)}
                  </div>
                  <div className="font-comic-narrative text-xs text-slate-600">
                    Current Value
                  </div>
                </div>
                <div>
                  <div className={cn(
                    "font-comic-display text-lg font-bold",
                    asset.pricing.priceChangePercent >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {asset.pricing.priceChangePercent >= 0 ? "+" : ""}{asset.pricing.priceChangePercent.toFixed(1)}%
                  </div>
                  <div className="font-comic-narrative text-xs text-slate-600">
                    24h Change
                  </div>
                </div>
              </div>
            )}

            {/* Performance Badge */}
            {showPricing && isRevealed && (
              <div className="text-center">
                <Badge variant="outline" className={cn("font-comic-display text-xs", performance.color)}>
                  {performance.label}
                </Badge>
              </div>
            )}

            {/* Special Features */}
            {showMetadata && isRevealed && asset.metadata.keyFeatures.length > 0 && (
              <div className="space-y-2">
                <div className="font-comic-display text-xs font-bold text-center">
                  SPECIAL FEATURES
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {asset.metadata.keyFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Authenticity */}
            {showAuthenticity && isRevealed && asset.authenticity.verified && (
              <div className="space-y-1 text-center">
                <div className="flex justify-center items-center space-x-1">
                  <span className="text-green-600 text-sm">✅</span>
                  <span className="font-comic-display text-xs font-bold text-green-600">
                    AUTHENTICATED
                  </span>
                </div>
                {asset.authenticity.grading && (
                  <div className="text-xs text-slate-600">
                    {asset.authenticity.grading.service} Grade: {asset.authenticity.grading.grade}/10
                  </div>
                )}
              </div>
            )}

            {/* Purchase/Action Buttons */}
            {isRevealed && onPurchase && (
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPurchase(asset);
                  }}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded font-comic-display text-sm font-bold hover-elevate"
                  data-testid={`purchase-${asset.id}`}
                >
                  💰 PURCHASE
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle watchlist
                  }}
                  className="px-4 py-2 border border-slate-300 rounded text-sm hover-elevate"
                  data-testid={`watchlist-${asset.id}`}
                >
                  👁️
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Special Effects */}
        {showEffects && showSpecialEffect && (
          <ComicSoundEffect
            sound={
              asset.rarity.tier === "1-in-1" ? "LEGENDARY!" :
              asset.rarity.tier === "1-in-10" ? "ULTRA RARE!" :
              asset.rarity.tier === "1-in-25" ? "SUPER RARE!" :
              "RARE FIND!"
            }
            variant="dramatic"
            intensity="extreme"
            trigger={true}
            position="center"
          />
        )}

        {/* Edition Stamp */}
        <div className="absolute bottom-1 left-1 text-xs text-slate-400 font-mono">
          {asset.variant.releaseDate.getFullYear()} Edition
        </div>

        {/* Print Run Info */}
        <div className="absolute bottom-1 right-1 text-xs text-slate-400 font-mono">
          Run: {asset.variant.printRun.toLocaleString()}
        </div>
      </div>
    );
  }
);

VariantCoverDisplay.displayName = "VariantCoverDisplay";

// Utility function to generate variant asset from base asset
export function createVariantAsset(baseAsset: any, variantConfig: any): VariantAsset {
  const rarityTiers = ["1-in-1000", "1-in-500", "1-in-100", "1-in-50", "1-in-25", "1-in-10", "1-in-1"];
  const randomRarity = rarityTiers[Math.floor(Math.random() * rarityTiers.length)] as VariantAsset["rarity"]["tier"];
  
  const basePrice = baseAsset.currentPrice || 100;
  const rarityMultiplier = {
    "1-in-1": 100,
    "1-in-10": 50,
    "1-in-25": 25,
    "1-in-50": 10,
    "1-in-100": 5,
    "1-in-500": 3,
    "1-in-1000": 2,
    "standard": 1
  }[randomRarity];

  return {
    id: `variant-${baseAsset.id}-${Date.now()}`,
    baseAssetId: baseAsset.id,
    title: `${baseAsset.name} - ${variantConfig.name}`,
    subtitle: variantConfig.subtitle,
    variant: {
      name: variantConfig.name,
      type: variantConfig.type || "cover",
      artist: variantConfig.artist || "Unknown Artist",
      publisher: baseAsset.publisher || "Panel Profits",
      printRun: Math.floor(1000 / rarityMultiplier),
      serialNumber: variantConfig.serialNumber,
      releaseDate: new Date(),
    },
    rarity: {
      tier: randomRarity,
      totalPrint: Math.floor(1000 / rarityMultiplier),
      mintNumber: Math.floor(Math.random() * Math.floor(1000 / rarityMultiplier)) + 1,
      mintDate: new Date(),
    },
    pricing: {
      mintPrice: basePrice,
      currentPrice: basePrice * rarityMultiplier * (1 + (Math.random() - 0.5) * 0.5),
      priceChange24h: (Math.random() - 0.5) * 20,
      priceChangePercent: (Math.random() - 0.5) * 50,
    },
    authenticity: {
      verified: true,
      certificate: `PP-${Date.now()}`,
      blockchain: "Panel Chain",
      grading: {
        service: "PPGS",
        grade: Math.floor(Math.random() * 4) + 7,
        population: Math.floor(Math.random() * 100) + 1,
      },
    },
    metadata: {
      imageUrl: variantConfig.imageUrl,
      description: variantConfig.description || `Special ${variantConfig.name} variant`,
      keyFeatures: variantConfig.keyFeatures || ["Limited Edition", "Collector's Item"],
      specialEffects: variantConfig.specialEffects || [],
      house: baseAsset.house,
    },
  };
}

export { VariantCoverDisplay, variantCoverVariants };