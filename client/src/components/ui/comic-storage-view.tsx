import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { Badge } from "./badge";
import { AssetGradingCard } from "./asset-grading-card";
import { VariantCoverDisplay } from "./variant-cover-display";

const comicStorageVariants = cva(
  "comic-storage-view relative",
  {
    variants: {
      layout: {
        "long-box": "grid-cols-1 gap-6",
        "short-box": "grid-cols-2 lg:grid-cols-3 gap-4",
        "magazine-box": "grid-cols-3 lg:grid-cols-4 gap-3",
        "display-case": "grid-cols-2 lg:grid-cols-4 gap-6",
        "vault": "grid-cols-1 lg:grid-cols-2 gap-8",
      },
      organization: {
        alphabetical: "order-alphabetical",
        chronological: "order-chronological",
        value: "order-value",
        rarity: "order-rarity",
        series: "order-series",
        publisher: "order-publisher",
      },
      theme: {
        classic: "bg-paper border-4 border-black shadow-2xl",
        modern: "bg-white border border-slate-300 shadow-xl",
        vintage: "bg-sepia-50 border-4 border-amber-800 shadow-2xl",
        premium: "bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-400 shadow-2xl",
      },
    },
    defaultVariants: {
      layout: "short-box",
      organization: "value",
      theme: "classic",
    },
  }
);

export interface StorageBox {
  id: string;
  name: string;
  description: string;
  capacity: number;
  currentCount: number;
  boxType: "long-box" | "short-box" | "magazine-box" | "top-loader" | "graded-slab" | "display-case";
  condition: "mint" | "near-mint" | "very-fine" | "fine" | "good" | "poor";
  location: string;
  acquisitionDate: Date;
  totalValue: number;
  averageGrade?: number;
  keyIssues: number;
  rarities: {
    legendary: number;
    epic: number;
    rare: number;
    uncommon: number;
    common: number;
  };
}

export interface CollectionAsset {
  id: string;
  symbol: string;
  name: string;
  type: "character" | "comic" | "creator" | "publisher";
  currentPrice: number;
  purchasePrice: number;
  quantity: number;
  grade?: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  storageBoxId: string;
  acquisitionDate: Date;
  lastValuation: Date;
  profitLoss: number;
  profitLossPercent: number;
  imageUrl?: string;
  house?: string;
  keyIssue?: boolean;
  variant?: boolean;
  graded?: boolean;
  signed?: boolean;
}

export interface ComicStorageViewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof comicStorageVariants> {
  storageBoxes: StorageBox[];
  assets: CollectionAsset[];
  selectedBoxId?: string;
  onBoxSelect?: (boxId: string) => void;
  onAssetSelect?: (asset: CollectionAsset) => void;
  showBoxStats?: boolean;
  showAssetDetails?: boolean;
  allowReorganization?: boolean;
  house?: string;
}

const ComicStorageView = React.forwardRef<HTMLDivElement, ComicStorageViewProps>(
  ({ 
    className,
    layout,
    organization,
    theme,
    storageBoxes,
    assets,
    selectedBoxId,
    onBoxSelect,
    onAssetSelect,
    showBoxStats = true,
    showAssetDetails = true,
    allowReorganization = true,
    house,
    ...props 
  }, ref) => {
    const [activeBox, setActiveBox] = React.useState<string | null>(selectedBoxId || null);
    const [sortBy, setSortBy] = React.useState<string>(organization || "value");
    const [viewMode, setViewMode] = React.useState<"boxes" | "assets">("boxes");

    // Get assets for the active box
    const boxAssets = React.useMemo(() => {
      if (!activeBox) return [];
      return assets.filter(asset => asset.storageBoxId === activeBox);
    }, [assets, activeBox]);

    // Sort assets based on current sort criteria
    const sortedAssets = React.useMemo(() => {
      const assetsToSort = viewMode === "boxes" ? assets : boxAssets;
      return [...assetsToSort].sort((a, b) => {
        switch (sortBy) {
          case "alphabetical":
            return a.name.localeCompare(b.name);
          case "chronological":
            return new Date(b.acquisitionDate).getTime() - new Date(a.acquisitionDate).getTime();
          case "value":
            return b.currentPrice - a.currentPrice;
          case "rarity":
            const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
          default:
            return 0;
        }
      });
    }, [assets, boxAssets, sortBy, viewMode]);

    const getBoxConditionColor = (condition: StorageBox["condition"]) => {
      switch (condition) {
        case "mint": return "text-green-600 bg-green-50 border-green-200";
        case "near-mint": return "text-blue-600 bg-blue-50 border-blue-200";
        case "very-fine": return "text-purple-600 bg-purple-50 border-purple-200";
        case "fine": return "text-orange-600 bg-orange-50 border-orange-200";
        case "good": return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "poor": return "text-red-600 bg-red-50 border-red-200";
      }
    };

    const getBoxTypeIcon = (boxType: StorageBox["boxType"]) => {
      switch (boxType) {
        case "long-box": return "📦";
        case "short-box": return "📋";
        case "magazine-box": return "📚";
        case "top-loader": return "🗂️";
        case "graded-slab": return "💎";
        case "display-case": return "🏛️";
        default: return "📦";
      }
    };

    const getRarityStats = (box: StorageBox) => {
      const total = Object.values(box.rarities).reduce((sum, count) => sum + count, 0);
      return [
        { label: "Legendary", count: box.rarities.legendary, color: "text-yellow-600" },
        { label: "Epic", count: box.rarities.epic, color: "text-purple-600" },
        { label: "Rare", count: box.rarities.rare, color: "text-blue-600" },
        { label: "Uncommon", count: box.rarities.uncommon, color: "text-green-600" },
        { label: "Common", count: box.rarities.common, color: "text-slate-600" },
      ].filter(rarity => rarity.count > 0);
    };

    const getTotalPortfolioValue = () => {
      return assets.reduce((total, asset) => total + (asset.currentPrice * asset.quantity), 0);
    };

    const getTotalProfitLoss = () => {
      return assets.reduce((total, asset) => total + asset.profitLoss, 0);
    };

    const handleBoxClick = (boxId: string) => {
      setActiveBox(activeBox === boxId ? null : boxId);
      onBoxSelect?.(boxId);
    };

    return (
      <div
        ref={ref}
        className={cn("comic-storage-container", className)}
        data-testid="comic-storage-view"
        {...props}
      >
        {/* Storage Header */}
        <div className="mb-6 p-4 bg-black text-white rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-comic-display text-2xl font-bold">
                COMIC STORAGE VAULT
              </h2>
              <p className="font-comic-narrative text-sm opacity-75">
                Professional Collection Management System
              </p>
            </div>
            <div className="text-right">
              <div className="font-comic-display text-xl font-bold">
                ${getTotalPortfolioValue().toFixed(2)}
              </div>
              <div className={cn(
                "font-comic-narrative text-sm",
                getTotalProfitLoss() >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {getTotalProfitLoss() >= 0 ? "+" : ""}${getTotalProfitLoss().toFixed(2)} P&L
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-comic-display text-sm">View:</span>
              <button
                onClick={() => setViewMode("boxes")}
                className={cn(
                  "px-3 py-1 rounded text-sm font-comic-display",
                  viewMode === "boxes" ? "bg-primary text-primary-foreground" : "bg-white border"
                )}
                data-testid="view-boxes"
              >
                📦 BOXES
              </button>
              <button
                onClick={() => setViewMode("assets")}
                className={cn(
                  "px-3 py-1 rounded text-sm font-comic-display",
                  viewMode === "assets" ? "bg-primary text-primary-foreground" : "bg-white border"
                )}
                data-testid="view-assets"
              >
                📊 ALL ASSETS
              </button>
            </div>

            {allowReorganization && (
              <div className="flex items-center space-x-2">
                <span className="font-comic-display text-sm">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                  data-testid="sort-select"
                >
                  <option value="value">By Value</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="chronological">By Date</option>
                  <option value="rarity">By Rarity</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="font-comic-display">
              {storageBoxes.length} Boxes • {assets.length} Assets
            </span>
          </div>
        </div>

        {/* Storage View */}
        {viewMode === "boxes" && (
          <div className={cn(
            "grid gap-6",
            comicStorageVariants({ layout, organization, theme })
          )}>
            {storageBoxes.map((box) => (
              <Card
                key={box.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105 hover-elevate",
                  activeBox === box.id && "ring-2 ring-primary border-primary"
                )}
                onClick={() => handleBoxClick(box.id)}
                data-testid={`storage-box-${box.id}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getBoxTypeIcon(box.boxType)}</span>
                      <div>
                        <h3 className="font-comic-display text-lg font-bold">
                          {box.name}
                        </h3>
                        <p className="font-comic-narrative text-sm text-slate-600">
                          {box.description}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getBoxConditionColor(box.condition))}
                    >
                      {box.condition.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Capacity Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-comic-display">Capacity</span>
                      <span className="font-comic-narrative">
                        {box.currentCount} / {box.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          box.currentCount / box.capacity > 0.9 ? "bg-red-500" :
                          box.currentCount / box.capacity > 0.7 ? "bg-yellow-500" : "bg-green-500"
                        )}
                        style={{ width: `${(box.currentCount / box.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Box Stats */}
                  {showBoxStats && (
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="font-comic-display text-lg font-bold">
                          ${box.totalValue.toFixed(0)}
                        </div>
                        <div className="font-comic-narrative text-xs text-slate-600">
                          Total Value
                        </div>
                      </div>
                      <div>
                        <div className="font-comic-display text-lg font-bold">
                          {box.averageGrade?.toFixed(1) || "N/A"}
                        </div>
                        <div className="font-comic-narrative text-xs text-slate-600">
                          Avg Grade
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rarity Breakdown */}
                  <div className="space-y-2">
                    <div className="font-comic-display text-xs font-bold text-center">
                      RARITY BREAKDOWN
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {getRarityStats(box).map((rarity) => (
                        <Badge 
                          key={rarity.label}
                          variant="outline" 
                          className={cn("text-xs", rarity.color)}
                        >
                          {rarity.count} {rarity.label.slice(0, 3).toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Issues */}
                  {box.keyIssues > 0 && (
                    <div className="text-center">
                      <Badge variant="destructive" className="text-xs">
                        🔥 {box.keyIssues} KEY ISSUES
                      </Badge>
                    </div>
                  )}

                  {/* Box Location */}
                  <div className="text-center text-xs text-slate-500">
                    📍 {box.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Asset Grid View */}
        {viewMode === "assets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAssets.map((asset) => (
              <Card
                key={asset.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover-elevate"
                onClick={() => onAssetSelect?.(asset)}
                data-testid={`asset-${asset.id}`}
              >
                <CardHeader className="pb-2">
                  <div className="text-center space-y-2">
                    {/* Asset Image */}
                    <div className="mx-auto w-24 h-32 bg-slate-200 rounded border overflow-hidden">
                      {asset.imageUrl ? (
                        <img 
                          src={asset.imageUrl} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="text-2xl">📊</span>
                        </div>
                      )}
                    </div>

                    {/* Asset Info */}
                    <div>
                      <h4 className="font-comic-display text-sm font-bold">
                        {asset.name}
                      </h4>
                      <p className="font-comic-narrative text-xs text-slate-600">
                        {asset.symbol} • {asset.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="font-comic-display text-sm font-bold">
                        ${asset.currentPrice.toFixed(2)}
                      </div>
                      <div className="font-comic-narrative text-xs text-slate-600">
                        Current
                      </div>
                    </div>
                    <div>
                      <div className={cn(
                        "font-comic-display text-sm font-bold",
                        asset.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {asset.profitLoss >= 0 ? "+" : ""}${asset.profitLoss.toFixed(2)}
                      </div>
                      <div className="font-comic-narrative text-xs text-slate-600">
                        P&L
                      </div>
                    </div>
                  </div>

                  {/* Special Attributes */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {asset.keyIssue && <Badge variant="destructive" className="text-xs">KEY</Badge>}
                    {asset.variant && <Badge variant="secondary" className="text-xs">VAR</Badge>}
                    {asset.graded && <Badge variant="outline" className="text-xs">GRADED</Badge>}
                    {asset.signed && <Badge variant="outline" className="text-xs">SIGNED</Badge>}
                  </div>

                  {/* Quantity */}
                  <div className="text-center text-xs text-slate-600">
                    Qty: {asset.quantity}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Box Detail View */}
        {activeBox && viewMode === "boxes" && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border-2 border-primary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-comic-display text-xl font-bold">
                Box Contents: {storageBoxes.find(b => b.id === activeBox)?.name}
              </h3>
              <button
                onClick={() => setActiveBox(null)}
                className="text-slate-500 hover:text-slate-700"
                data-testid="close-box-detail"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {boxAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover-elevate"
                  onClick={() => onAssetSelect?.(asset)}
                  data-testid={`box-asset-${asset.id}`}
                >
                  <CardContent className="p-3 text-center space-y-2">
                    <div className="font-comic-display text-sm font-bold">
                      {asset.name}
                    </div>
                    <div className="font-comic-display text-lg font-bold">
                      ${asset.currentPrice.toFixed(2)}
                    </div>
                    <div className={cn(
                      "text-xs",
                      asset.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {asset.profitLoss >= 0 ? "+" : ""}${asset.profitLoss.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ComicStorageView.displayName = "ComicStorageView";

// Utility function to organize assets into storage boxes
export function organizeAssetsIntoBoxes(
  assets: CollectionAsset[],
  organizationMethod: "type" | "rarity" | "value" | "house" | "alphabetical" = "type"
): StorageBox[] {
  const boxes: StorageBox[] = [];
  
  switch (organizationMethod) {
    case "type": {
      const typeGroups = assets.reduce((groups, asset) => {
        if (!groups[asset.type]) groups[asset.type] = [];
        groups[asset.type].push(asset);
        return groups;
      }, {} as Record<string, CollectionAsset[]>);

      Object.entries(typeGroups).forEach(([type, typeAssets], index) => {
        const totalValue = typeAssets.reduce((sum, asset) => sum + asset.currentPrice * asset.quantity, 0);
        boxes.push({
          id: `box-${type}`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Collection`,
          description: `All ${type} assets in collection`,
          capacity: 100,
          currentCount: typeAssets.length,
          boxType: "short-box",
          condition: "mint",
          location: `Shelf A-${index + 1}`,
          acquisitionDate: new Date(),
          totalValue,
          keyIssues: typeAssets.filter(a => a.keyIssue).length,
          rarities: typeAssets.reduce((counts, asset) => {
            counts[asset.rarity]++;
            return counts;
          }, { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0 })
        });
      });
      break;
    }

    case "rarity": {
      const rarityGroups = assets.reduce((groups, asset) => {
        if (!groups[asset.rarity]) groups[asset.rarity] = [];
        groups[asset.rarity].push(asset);
        return groups;
      }, {} as Record<string, CollectionAsset[]>);

      Object.entries(rarityGroups).forEach(([rarity, rarityAssets], index) => {
        const totalValue = rarityAssets.reduce((sum, asset) => sum + asset.currentPrice * asset.quantity, 0);
        boxes.push({
          id: `box-${rarity}`,
          name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Collection`,
          description: `All ${rarity} rarity assets`,
          capacity: 50,
          currentCount: rarityAssets.length,
          boxType: rarity === "legendary" ? "display-case" : "short-box",
          condition: "mint",
          location: `Premium Vault ${index + 1}`,
          acquisitionDate: new Date(),
          totalValue,
          keyIssues: rarityAssets.filter(a => a.keyIssue).length,
          rarities: { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0, [rarity]: rarityAssets.length }
        });
      });
      break;
    }

    default: {
      // Default single box
      const totalValue = assets.reduce((sum, asset) => sum + asset.currentPrice * asset.quantity, 0);
      boxes.push({
        id: "box-main",
        name: "Main Collection",
        description: "Primary asset storage",
        capacity: 200,
        currentCount: assets.length,
        boxType: "long-box",
        condition: "mint",
        location: "Primary Storage",
        acquisitionDate: new Date(),
        totalValue,
        keyIssues: assets.filter(a => a.keyIssue).length,
        rarities: assets.reduce((counts, asset) => {
          counts[asset.rarity]++;
          return counts;
        }, { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0 })
      });
    }
  }

  return boxes;
}

export { ComicStorageView, comicStorageVariants };