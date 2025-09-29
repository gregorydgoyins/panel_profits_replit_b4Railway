import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Shield,
  Swords,
  Crystal,
  Sparkles,
  AlertTriangle,
  Target,
  Clock,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface EnhancedPricePrediction {
  id: string;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  confidence: number;
  timeframe: string;
  reasoning: string;
  mysticalInsight: string;
  divineConfidence: string;
  sacredSymbols: string[];
  cosmicAlignment: number;
  oraclePersona: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  houseBonus?: Record<string, number>;
  karmaInfluence?: number;
}

interface BattlePrediction {
  battleId: string;
  character1: {
    id: string;
    name: string;
    imageUrl?: string;
    powerLevel: number;
  };
  character2: {
    id: string;
    name: string;
    imageUrl?: string;
    powerLevel: number;
  };
  battleType: string;
  winProbability: number;
  reasoning: string;
  mysticalProphecy: string;
  marketImpact: number;
  confidence: number;
  expectedDuration: string;
  keyFactors: string[];
  houseAdvantages: Record<string, number>;
}

interface MarketAnomaly {
  id: string;
  anomalyType: 'price_spike' | 'volume_surge' | 'sentiment_shift' | 'pattern_break';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAssets: string[];
  description: string;
  mysticalWarning: string;
  recommendedActions: string[];
  confidence: number;
  timeDetected: string;
}

interface AdvancedMarketInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'risk' | 'prophecy' | 'anomaly';
  title: string;
  description: string;
  mysticalVision: string;
  affectedAssets: string[];
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timeframe: string;
  houseRelevance: Record<string, number>;
  karmaAlignment: string;
  divineSymbols: string[];
  actionableInsights: string[];
}

export function OracleVisionChamber() {
  const [activeTab, setActiveTab] = useState('prophecies');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [oracleDialogue, setOracleDialogue] = useState<string>('');
  const [isChanneling, setIsChanneling] = useState(false);

  // Fetch AI predictions
  const { data: predictions, isLoading: loadingPredictions } = useQuery({
    queryKey: ['/api/ai/enhanced-predictions'],
    enabled: true
  });

  // Fetch battle predictions
  const { data: battlePredictions, isLoading: loadingBattles } = useQuery({
    queryKey: ['/api/ai/battle-predictions'],
    enabled: true
  });

  // Fetch market anomalies
  const { data: anomalies, isLoading: loadingAnomalies } = useQuery({
    queryKey: ['/api/ai/market-anomalies'],
    enabled: true
  });

  // Fetch advanced insights
  const { data: insights, isLoading: loadingInsights } = useQuery({
    queryKey: ['/api/ai/advanced-insights'],
    enabled: true
  });

  // Generate new AI insights
  const generateInsightsMutation = useMutation({
    mutationFn: (assetIds: string[]) => 
      apiRequest('/api/ai/generate-insights', {
        method: 'POST',
        body: { assetIds }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/advanced-insights'] });
      setIsChanneling(false);
    }
  });

  const channelOracleWisdom = () => {
    setIsChanneling(true);
    setOracleDialogue('The Ancient Oracle stirs... Divine visions flow through the cosmic void...');
    
    setTimeout(() => {
      generateInsightsMutation.mutate(selectedAssets);
    }, 2000);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'text-emerald-400';
      case 'MEDIUM': return 'text-amber-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-emerald-500 bg-emerald-500/10';
      case 'medium': return 'border-amber-500 bg-amber-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'critical': return 'border-red-500 bg-red-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence > 0.9) return <Star className="h-4 w-4 text-gold" />;
    if (confidence > 0.8) return <Sparkles className="h-4 w-4 text-mystical-blue" />;
    if (confidence > 0.7) return <Crystal className="h-4 w-4 text-rare-purple" />;
    return <Eye className="h-4 w-4 text-muted-silver" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-abyssal-depths via-shadowed-stone to-abyssal-depths p-6">
      {/* Mystical Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-legendary-gold mb-2 font-display">
          🔮 Oracle's Vision Chamber 🔮
        </h1>
        <p className="text-misted-silver text-lg">
          Channel the Ancient AI Oracle's divine market wisdom
        </p>
        
        {/* Oracle Status */}
        <motion.div 
          className="mt-4 p-4 rounded-lg bg-shadowed-stone/50 border border-legendary-gold/20"
          animate={{ 
            boxShadow: isChanneling 
              ? '0 0 30px rgba(251, 191, 36, 0.4)' 
              : '0 0 10px rgba(251, 191, 36, 0.1)' 
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: isChanneling ? 360 : 0 }}
              transition={{ duration: 2, repeat: isChanneling ? Infinity : 0 }}
            >
              <Crystal className="h-6 w-6 text-legendary-gold" />
            </motion.div>
            <span className="text-pure-light font-medium">
              {isChanneling ? 'Channeling Divine Visions...' : 'Ancient Oracle Awaits Your Call'}
            </span>
          </div>
          
          {oracleDialogue && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-misted-silver italic mt-2 text-sm"
            >
              "{oracleDialogue}"
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Main Oracle Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-shadowed-stone border border-legendary-gold/20">
          <TabsTrigger 
            value="prophecies" 
            className="data-[state=active]:bg-legendary-gold data-[state=active]:text-abyssal-depths"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Price Prophecies
          </TabsTrigger>
          <TabsTrigger 
            value="battles"
            className="data-[state=active]:bg-legendary-gold data-[state=active]:text-abyssal-depths"
          >
            <Swords className="h-4 w-4 mr-2" />
            Battle Oracles
          </TabsTrigger>
          <TabsTrigger 
            value="anomalies"
            className="data-[state=active]:bg-legendary-gold data-[state=active]:text-abyssal-depths"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Mystical Warnings
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="data-[state=active]:bg-legendary-gold data-[state=active]:text-abyssal-depths"
          >
            <Eye className="h-4 w-4 mr-2" />
            Divine Insights
          </TabsTrigger>
          <TabsTrigger 
            value="chamber"
            className="data-[state=active]:bg-legendary-gold data-[state=active]:text-abyssal-depths"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Sacred Chamber
          </TabsTrigger>
        </TabsList>

        {/* Price Prophecies Tab */}
        <TabsContent value="prophecies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {loadingPredictions ? (
              <div className="col-span-2 text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Crystal className="h-8 w-8 text-legendary-gold" />
                </motion.div>
                <p className="text-misted-silver mt-2">Channeling price prophecies...</p>
              </div>
            ) : (
              predictions?.map((prediction: EnhancedPricePrediction) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-shadowed-stone/80 border-legendary-gold/20 hover:border-legendary-gold/40 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-legendary-gold font-display">
                          {prediction.assetName}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          {getConfidenceIcon(prediction.confidence)}
                          <Badge 
                            variant="outline" 
                            className={`${getRiskColor(prediction.riskLevel)} border-current`}
                          >
                            {prediction.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-pure-light">
                          Current: ${prediction.currentPrice.toLocaleString()}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          prediction.predictedChange > 0 ? 'text-emerald-enchantment' : 'text-crimson-doom'
                        }`}>
                          {prediction.predictedChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {(prediction.predictedChange * 100).toFixed(1)}%
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Cosmic Alignment Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-misted-silver">Cosmic Alignment</span>
                          <span className="text-legendary-gold">
                            {(prediction.cosmicAlignment * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={prediction.cosmicAlignment * 100} 
                          className="h-2 bg-abyssal-depths"
                        />
                      </div>

                      {/* Sacred Symbols */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-misted-silver">Sacred Signs:</span>
                        {prediction.sacredSymbols.map((symbol, idx) => (
                          <span key={idx} className="text-legendary-gold text-lg">
                            {symbol}
                          </span>
                        ))}
                      </div>

                      {/* Mystical Insight */}
                      <div className="p-3 rounded-lg bg-abyssal-depths/50 border border-legendary-gold/10">
                        <p className="text-pure-light text-sm italic">
                          "{prediction.mysticalInsight}"
                        </p>
                        <p className="text-misted-silver text-xs mt-1">
                          — {prediction.oraclePersona}
                        </p>
                      </div>

                      {/* Divine Confidence */}
                      <div className="text-center">
                        <Badge variant="outline" className="text-mystical-blue border-mystical-blue">
                          {prediction.divineConfidence}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Battle Oracles Tab */}
        <TabsContent value="battles" className="space-y-4">
          <div className="grid gap-4">
            {loadingBattles ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Swords className="h-8 w-8 text-legendary-gold" />
                </motion.div>
                <p className="text-misted-silver mt-2">Divining battle outcomes...</p>
              </div>
            ) : (
              battlePredictions?.map((battle: BattlePrediction) => (
                <motion.div
                  key={battle.battleId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group"
                >
                  <Card className="bg-shadowed-stone/80 border-legendary-gold/20 hover:border-legendary-gold/40 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-legendary-gold font-display">
                          ⚔️ Legendary Clash ⚔️
                        </CardTitle>
                        <Badge variant="outline" className="text-mystical-blue border-mystical-blue">
                          {battle.battleType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Battle Participants */}
                      <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Character 1 */}
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-legendary-gold to-emerald-enchantment mx-auto flex items-center justify-center">
                            <Shield className="h-8 w-8 text-abyssal-depths" />
                          </div>
                          <h3 className="font-medium text-pure-light">{battle.character1.name}</h3>
                          <p className="text-xs text-misted-silver">
                            Power: {battle.character1.powerLevel.toFixed(1)}
                          </p>
                        </div>

                        {/* VS with probability */}
                        <div className="text-center">
                          <div className="text-2xl text-legendary-gold mb-2">⚡ VS ⚡</div>
                          <div className="space-y-1">
                            <Progress 
                              value={battle.winProbability * 100} 
                              className="h-3"
                            />
                            <p className="text-xs text-misted-silver">
                              {(battle.winProbability * 100).toFixed(0)}% - {((1 - battle.winProbability) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        {/* Character 2 */}
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-crimson-doom to-rare-purple mx-auto flex items-center justify-center">
                            <Swords className="h-8 w-8 text-pure-light" />
                          </div>
                          <h3 className="font-medium text-pure-light">{battle.character2.name}</h3>
                          <p className="text-xs text-misted-silver">
                            Power: {battle.character2.powerLevel.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      {/* Battle Prophecy */}
                      <div className="p-4 rounded-lg bg-abyssal-depths/50 border border-legendary-gold/10">
                        <h4 className="text-legendary-gold font-medium mb-2">🔮 Divine Prophecy</h4>
                        <p className="text-pure-light text-sm italic">
                          "{battle.mysticalProphecy}"
                        </p>
                      </div>

                      {/* Battle Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-misted-silver">Duration:</span>
                          <span className="text-pure-light ml-2">{battle.expectedDuration}</span>
                        </div>
                        <div>
                          <span className="text-misted-silver">Market Impact:</span>
                          <span className={`ml-2 ${
                            battle.marketImpact > 0 ? 'text-emerald-enchantment' : 'text-crimson-doom'
                          }`}>
                            {(battle.marketImpact * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Key Factors */}
                      <div className="space-y-2">
                        <h5 className="text-legendary-gold font-medium text-sm">⚡ Key Battle Factors</h5>
                        <div className="flex flex-wrap gap-2">
                          {battle.keyFactors.map((factor, idx) => (
                            <Badge 
                              key={idx}
                              variant="outline" 
                              className="text-xs text-misted-silver border-misted-silver/30"
                            >
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Mystical Warnings Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          <div className="space-y-4">
            {loadingAnomalies ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <AlertTriangle className="h-8 w-8 text-legendary-gold" />
                </motion.div>
                <p className="text-misted-silver mt-2">Scanning for mystical disturbances...</p>
              </div>
            ) : (
              anomalies?.map((anomaly: MarketAnomaly) => (
                <motion.div
                  key={anomaly.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Alert className={`${getSeverityColor(anomaly.severity)} hover:scale-[1.01] transition-transform`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-legendary-gold font-medium">
                          {anomaly.anomalyType.replace('_', ' ').toUpperCase()} DETECTED
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`${getSeverityColor(anomaly.severity)} border-current`}
                        >
                          {anomaly.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-pure-light text-sm">
                        {anomaly.description}
                      </p>
                      
                      <div className="p-3 rounded-lg bg-abyssal-depths/30">
                        <p className="text-mystical-blue text-sm italic">
                          🌟 "{anomaly.mysticalWarning}"
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-legendary-gold font-medium text-sm">⚡ Sacred Guidance</h5>
                        <ul className="space-y-1">
                          {anomaly.recommendedActions.map((action, idx) => (
                            <li key={idx} className="text-misted-silver text-sm flex items-start gap-2">
                              <Target className="h-3 w-3 mt-0.5 text-legendary-gold flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-misted-silver">
                          Detected: {new Date(anomaly.timeDetected).toLocaleString()}
                        </span>
                        <span className="text-legendary-gold">
                          Confidence: {(anomaly.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Divine Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {loadingInsights ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Eye className="h-8 w-8 text-legendary-gold" />
                </motion.div>
                <p className="text-misted-silver mt-2">Channeling divine market wisdom...</p>
              </div>
            ) : (
              insights?.map((insight: AdvancedMarketInsight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  className="group"
                >
                  <Card className="bg-shadowed-stone/80 border-legendary-gold/20 hover:border-legendary-gold/40 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-legendary-gold font-display">
                          {insight.divineSymbols.join(' ')} {insight.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${
                              insight.impact === 'positive' ? 'text-emerald-enchantment border-emerald-enchantment' :
                              insight.impact === 'negative' ? 'text-crimson-doom border-crimson-doom' :
                              'text-misted-silver border-misted-silver'
                            }`}
                          >
                            {insight.impact.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-mystical-blue border-mystical-blue">
                            {insight.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-pure-light text-sm">
                        {insight.description}
                      </p>
                      
                      <div className="p-4 rounded-lg bg-abyssal-depths/50 border border-legendary-gold/10">
                        <h4 className="text-mystical-blue font-medium mb-2">🔮 Mystical Vision</h4>
                        <p className="text-pure-light text-sm italic">
                          "{insight.mysticalVision}"
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-misted-silver">Timeframe:</span>
                          <span className="text-pure-light ml-2">{insight.timeframe}</span>
                        </div>
                        <div>
                          <span className="text-misted-silver">Confidence:</span>
                          <span className="text-legendary-gold ml-2">
                            {(insight.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-legendary-gold font-medium text-sm">⚡ Sacred Actions</h5>
                        <ul className="space-y-1">
                          {insight.actionableInsights.map((action, idx) => (
                            <li key={idx} className="text-misted-silver text-sm flex items-start gap-2">
                              <Target className="h-3 w-3 mt-0.5 text-legendary-gold flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Sacred Chamber Tab */}
        <TabsContent value="chamber" className="space-y-6">
          <div className="text-center space-y-6">
            <motion.div 
              className="relative mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-legendary-gold via-mystical-blue to-rare-purple p-1"
              animate={{ 
                rotate: 360,
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.3)',
                  '0 0 40px rgba(59, 130, 246, 0.3)',
                  '0 0 20px rgba(168, 85, 247, 0.3)',
                  '0 0 20px rgba(251, 191, 36, 0.3)'
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <div className="w-full h-full rounded-full bg-abyssal-depths flex items-center justify-center relative overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl"
                >
                  🔮
                </motion.div>
                
                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-legendary-gold rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 30 * Math.PI / 180) * 60],
                      y: [0, Math.sin(i * 30 * Math.PI / 180) * 60],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity
                    }}
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-legendary-gold font-display">
                Sacred Oracle Communion
              </h2>
              <p className="text-misted-silver max-w-2xl mx-auto">
                Channel the Ancient AI Oracle's infinite wisdom. Select sacred assets and invoke 
                the divine algorithms to receive personalized prophecies, battle predictions, 
                and market revelations aligned with your cosmic destiny.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={channelOracleWisdom}
                disabled={isChanneling || generateInsightsMutation.isPending}
                className="bg-gradient-to-r from-legendary-gold to-mystical-blue text-abyssal-depths font-bold px-8 py-3 text-lg hover:shadow-lg"
                data-testid="button-channel-oracle"
              >
                {isChanneling ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mr-2"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    Channeling Divine Wisdom...
                  </>
                ) : (
                  <>
                    <Crystal className="h-5 w-5 mr-2" />
                    Invoke Oracle's Wisdom
                  </>
                )}
              </Button>
            </motion.div>
            
            <Card className="bg-shadowed-stone/50 border-legendary-gold/20 max-w-2xl mx-auto">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-legendary-gold font-medium text-lg text-center">
                  🌟 Oracle's Divine Guidance 🌟
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-8 w-8 text-emerald-enchantment mx-auto" />
                    <p className="text-pure-light font-medium">Price Prophecies</p>
                    <p className="text-misted-silver">Divine market forecasts with mystical confidence</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Swords className="h-8 w-8 text-crimson-doom mx-auto" />
                    <p className="text-pure-light font-medium">Battle Oracles</p>
                    <p className="text-misted-silver">Character clash predictions and market impacts</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Eye className="h-8 w-8 text-mystical-blue mx-auto" />
                    <p className="text-pure-light font-medium">Sacred Insights</p>
                    <p className="text-misted-silver">House-aligned wisdom and karmic guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}