import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, Award as Certificate, TrendingUp, History, Eye, Star, 
  Calendar, DollarSign, Award, CheckCircle, AlertTriangle,
  Users, BarChart3, Zap, Crown
} from 'lucide-react';
import { useHouseTheme } from '@/contexts/HouseThemeContext';

interface GradingCertification {
  id: string;
  certificationType: 'initial_grade' | 're_grade' | 'signature_verification';
  previousGrade?: number;
  newGrade: number;
  certifyingAuthority: string;
  completionDate: string;
  certificationNotes: string;
  qualityAssessment: {
    condition: number;
    centering: number;
    corners: number;
    edges: number;
    surface: number;
    confidence: number;
  };
}

interface MarketComparable {
  id: string;
  salePrice: number;
  saleDate: string;
  marketplace: string;
  comparableGrade: number;
  gradingAuthority: string;
  relevanceScore: number;
  saleConditions: string;
}

interface GradedAsset {
  id: string;
  assetId: string;
  name: string;
  symbol: string;
  type: 'character' | 'comic' | 'creator' | 'publisher';
  imageUrl?: string;
  
  // Grading Information
  overallGrade: number;
  conditionScore: number;
  centeringScore: number;
  cornersScore: number;
  edgesScore: number;
  surfaceScore: number;
  certificationAuthority: string;
  certificationNumber?: string;
  gradingDate: string;
  gradingNotes: string;
  
  // Rarity & Market Data
  rarityTier: 'common' | 'uncommon' | 'rare' | 'ultra_rare' | 'legendary' | 'mythic';
  rarityScore: number;
  marketDemandScore: number;
  currentMarketValue: number;
  acquisitionPrice: number;
  acquisitionDate: string;
  
  // Collection Metadata
  storageType: string;
  storageCondition: string;
  isKeyIssue: boolean;
  isFirstAppearance: boolean;
  isSigned: boolean;
  signatureAuthenticated: boolean;
  houseAffiliation?: string;
  collectorNotes?: string;
  personalRating?: number;
  
  // Certifications and Comparables
  certifications: GradingCertification[];
  marketComparables: MarketComparable[];
}

interface GradedSlabModalProps {
  asset: GradedAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onReGrade?: (assetId: string) => void;
  onUpdateNotes?: (assetId: string, notes: string) => void;
}

export function GradedSlabModal({
  asset,
  isOpen,
  onClose,
  onReGrade,
  onUpdateNotes
}: GradedSlabModalProps) {
  const { currentHouse, getHouseTheme } = useHouseTheme();
  const [activeTab, setActiveTab] = useState<'certification' | 'provenance' | 'market'>('certification');

  if (!asset) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'from-amber-400 to-yellow-300';
      case 'legendary': return 'from-orange-400 to-amber-300';
      case 'ultra_rare': return 'from-purple-400 to-pink-300';
      case 'rare': return 'from-blue-400 to-cyan-300';
      case 'uncommon': return 'from-green-400 to-emerald-300';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9.5) return 'text-emerald-400';
    if (grade >= 8.0) return 'text-blue-400';
    if (grade >= 6.0) return 'text-yellow-400';
    if (grade >= 4.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAuthorityLogo = (authority: string) => {
    const logos = {
      'cgc': '/assets/cgc-logo.png',
      'cbcs': '/assets/cbcs-logo.png',
      'pgx': '/assets/pgx-logo.png',
      'internal': '/assets/panel-profits-logo.png'
    };
    return logos[authority as keyof typeof logos] || logos.internal;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProfitLoss = () => {
    const profit = asset.currentMarketValue - asset.acquisitionPrice;
    const percentage = (profit / asset.acquisitionPrice) * 100;
    return { profit, percentage };
  };

  const { profit, percentage } = calculateProfitLoss();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="graded-slab-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            CGC-Style Grading Certificate
            <Badge className={`bg-gradient-to-r ${getRarityColor(asset.rarityTier)} text-black font-bold`}>
              {asset.rarityTier.charAt(0).toUpperCase() + asset.rarityTier.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graded Slab Visual */}
          <div className="space-y-4">
            <motion.div
              initial={{ rotateY: 0 }}
              whileHover={{ rotateY: 5 }}
              className="relative"
            >
              {/* Protective Slab Case */}
              <div className="bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-lg p-4 shadow-2xl border-4 border-slate-300 dark:border-slate-600">
                {/* Certification Label */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 rounded-t text-center mb-2">
                  <div className="flex items-center justify-center gap-2">
                    <img 
                      src={getAuthorityLogo(asset.certificationAuthority)} 
                      alt={asset.certificationAuthority.toUpperCase()}
                      className="h-6 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="font-bold text-sm">
                      {asset.certificationAuthority.toUpperCase()} CERTIFIED
                    </span>
                  </div>
                </div>

                {/* Asset Image */}
                <div className="relative mb-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded p-2 min-h-[300px] flex items-center justify-center">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="max-w-full max-h-[300px] object-contain rounded shadow-lg"
                    />
                  ) : (
                    <div className="w-48 h-72 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center">
                      <Eye className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Special Badges */}
                  {asset.isKeyIssue && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black font-bold">
                      KEY ISSUE
                    </Badge>
                  )}
                  {asset.isSigned && (
                    <Badge className="absolute top-2 right-2 bg-purple-500 text-white font-bold">
                      SIGNED {asset.signatureAuthenticated && <CheckCircle className="h-3 w-3 ml-1" />}
                    </Badge>
                  )}
                </div>

                {/* Grade Display */}
                <div className="text-center space-y-2">
                  <div className={`text-4xl font-bold ${getGradeColor(asset.overallGrade)}`}>
                    {asset.overallGrade.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {asset.certificationNumber ? `#${asset.certificationNumber}` : 'Certified Grade'}
                  </div>
                </div>

                {/* Asset Information */}
                <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded text-center">
                  <div className="font-bold text-lg">{asset.name}</div>
                  <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Graded: {new Date(asset.gradingDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-2 flex justify-center">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Tamper-Evident Seal
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(asset.currentMarketValue)}
                  </div>
                  <div className="text-xs text-muted-foreground">Market Value</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className={`h-6 w-6 mx-auto mb-2 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">P&L</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="certification" data-testid="tab-certification">Certification</TabsTrigger>
                <TabsTrigger value="provenance" data-testid="tab-provenance">Provenance</TabsTrigger>
                <TabsTrigger value="market" data-testid="tab-market">Market</TabsTrigger>
              </TabsList>

              <TabsContent value="certification" className="space-y-4">
                {/* Grading Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4" />
                      Grading Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Overall Condition', score: asset.conditionScore, key: 'condition' },
                      { label: 'Centering', score: asset.centeringScore, key: 'centering' },
                      { label: 'Corners', score: asset.cornersScore, key: 'corners' },
                      { label: 'Edges', score: asset.edgesScore, key: 'edges' },
                      { label: 'Surface Quality', score: asset.surfaceScore, key: 'surface' }
                    ].map((item) => (
                      <div key={item.key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.label}</span>
                          <span className={`font-bold ${getGradeColor(item.score)}`}>
                            {item.score.toFixed(1)}
                          </span>
                        </div>
                        <Progress 
                          value={(item.score / 10) * 100} 
                          className="h-2"
                          data-testid={`progress-${item.key}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Grading Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Grading Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {asset.gradingNotes}
                    </p>
                  </CardContent>
                </Card>

                {/* Rarity Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4" />
                      Rarity Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rarity Score</span>
                      <Badge className={`bg-gradient-to-r ${getRarityColor(asset.rarityTier)} text-black font-bold`}>
                        {asset.rarityScore.toFixed(1)}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Demand</span>
                      <span className="text-sm font-bold">{asset.marketDemandScore.toFixed(1)}/100</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {asset.isKeyIssue && <Badge variant="secondary">Key Issue</Badge>}
                      {asset.isFirstAppearance && <Badge variant="secondary">1st Appearance</Badge>}
                      {asset.isSigned && <Badge variant="secondary">Signed</Badge>}
                      {asset.houseAffiliation && (
                        <Badge variant="outline">House {asset.houseAffiliation}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="provenance" className="space-y-4">
                {/* Acquisition Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Acquisition History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Purchase Date</span>
                      <span className="text-sm font-medium">
                        {new Date(asset.acquisitionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Purchase Price</span>
                      <span className="text-sm font-medium text-blue-400">
                        {formatCurrency(asset.acquisitionPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Storage Type</span>
                      <span className="text-sm font-medium">{asset.storageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Storage Condition</span>
                      <Badge variant="secondary">{asset.storageCondition}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Certification History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <History className="h-4 w-4" />
                      Certification History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {asset.certifications.map((cert, index) => (
                        <div key={cert.id} className="p-3 bg-muted/20 rounded border-l-4 border-blue-400">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {cert.certificationType.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(cert.completionDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {cert.previousGrade && (
                              <span className="text-sm text-muted-foreground">
                                {cert.previousGrade.toFixed(1)} →
                              </span>
                            )}
                            <span className={`text-sm font-bold ${getGradeColor(cert.newGrade)}`}>
                              {cert.newGrade.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {cert.certificationNotes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Notes */}
                {asset.collectorNotes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Collector Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {asset.collectorNotes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="market" className="space-y-4">
                {/* Price Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      Price Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Value</span>
                      <span className="text-lg font-bold text-green-400">
                        {formatCurrency(asset.currentMarketValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Acquisition Cost</span>
                      <span className="text-sm font-medium text-blue-400">
                        {formatCurrency(asset.acquisitionPrice)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm">Total Gain/Loss</span>
                      <span className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(Math.abs(profit))} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Comparables */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4" />
                      Recent Sales
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Similar items sold in the market
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {asset.marketComparables.slice(0, 5).map((comp) => (
                        <div key={comp.id} className="flex justify-between items-center p-2 bg-muted/10 rounded text-sm">
                          <div>
                            <div className="font-medium">{formatCurrency(comp.salePrice)}</div>
                            <div className="text-xs text-muted-foreground">
                              Grade {comp.comparableGrade.toFixed(1)} • {comp.marketplace}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              {new Date(comp.saleDate).toLocaleDateString()}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {(comp.relevanceScore * 100).toFixed(0)}% match
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onReGrade && (
                <Button 
                  variant="outline" 
                  onClick={() => onReGrade(asset.id)}
                  data-testid="button-regrade"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Re-Grade
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => navigator.share && navigator.share({
                  title: `${asset.name} - Grade ${asset.overallGrade}`,
                  text: `Check out my ${asset.rarityTier} graded ${asset.name}!`,
                })}
                data-testid="button-share"
              >
                <Users className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}