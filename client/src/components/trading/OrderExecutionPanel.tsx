/**
 * OrderExecutionPanel - Trade execution stories with comic effects
 * Renders order lifecycle as dramatic comic sequences with house-themed celebrations
 */

import { useState, useEffect, useRef } from 'react';
import { ComicPanel } from '@/components/ui/comic-panel';
import { SpeechBubble } from '@/components/ui/speech-bubble';
import { CaptionBox } from '@/components/ui/caption-box';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X, 
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  Star,
  Crown,
  Swords
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHouseTheme, type MythologicalHouse } from '@/contexts/HouseThemeContext';
import type { PanelScript } from '@/services/sequentialStoryEngine';

interface OrderDetails {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  status: 'pending' | 'filling' | 'filled' | 'cancelled' | 'rejected';
  filledQuantity?: number;
  averageFillPrice?: number;
  totalValue: number;
  timestamp: Date;
  orderType: 'market' | 'limit' | 'stop';
  executionSpeed?: 'instant' | 'fast' | 'normal' | 'slow';
}

interface OrderExecutionPanelProps {
  panelScript: PanelScript;
  orderDetails: OrderDetails;
  className?: string;
  isActive?: boolean;
  onPanelClick?: () => void;
  showExecutionStory?: boolean;
  celebrationMode?: boolean;
  houseTheme?: MythologicalHouse;
}

interface ExecutionStage {
  stage: 'placed' | 'routing' | 'matching' | 'executing' | 'completed' | 'failed';
  message: string;
  duration: number;
  effects: string[];
}

export function OrderExecutionPanel({
  panelScript,
  orderDetails,
  className,
  isActive = false,
  onPanelClick,
  showExecutionStory = true,
  celebrationMode = false,
  houseTheme
}: OrderExecutionPanelProps) {
  const { currentHouse, houseTheme: defaultHouseTheme } = useHouseTheme();
  const activeHouse = houseTheme || currentHouse;
  const [currentStage, setCurrentStage] = useState<ExecutionStage | null>(null);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [executionEffects, setExecutionEffects] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Execution story stages
  const executionStages: ExecutionStage[] = [
    {
      stage: 'placed',
      message: `${getHouseBattleCry(activeHouse)} Order placed!`,
      duration: 500,
      effects: ['glow']
    },
    {
      stage: 'routing',
      message: 'Seeking the best market path...',
      duration: 1000,
      effects: ['scan', 'pulse']
    },
    {
      stage: 'matching',
      message: 'Connecting with market counterpart...',
      duration: 800,
      effects: ['connect', 'spark']
    },
    {
      stage: 'executing',
      message: `Executing with ${getHousePower(activeHouse)}!`,
      duration: 1200,
      effects: ['explosion', 'lightning']
    },
    {
      stage: 'completed',
      message: getHouseVictoryMessage(activeHouse, orderDetails.type),
      duration: 2000,
      effects: ['victory', 'celebration']
    }
  ];

  // Run execution story animation
  useEffect(() => {
    if (!showExecutionStory || orderDetails.status !== 'filling') return;

    let stageIndex = 0;
    const runStage = () => {
      if (stageIndex >= executionStages.length) {
        if (orderDetails.status === 'filled') {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
        return;
      }

      const stage = executionStages[stageIndex];
      setCurrentStage(stage);
      setExecutionEffects(stage.effects);
      setExecutionProgress((stageIndex + 1) / executionStages.length * 100);

      setTimeout(() => {
        stageIndex++;
        runStage();
      }, stage.duration);
    };

    runStage();
  }, [showExecutionStory, orderDetails.status, activeHouse]);

  // Celebration effect for successful orders
  useEffect(() => {
    if (celebrationMode && orderDetails.status === 'filled') {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [celebrationMode, orderDetails.status]);

  function getHouseBattleCry(house: MythologicalHouse): string {
    const cries = {
      heroes: 'For justice and profit!',
      wisdom: 'With calculated precision!',
      power: 'By the might of our will!',
      mystery: 'From the shadows we strike!',
      elements: 'With nature\'s force!',
      time: 'At the perfect moment!',
      spirit: 'United we trade!'
    };
    return cries[house];
  }

  function getHousePower(house: MythologicalHouse): string {
    const powers = {
      heroes: 'heroic determination',
      wisdom: 'ancient knowledge',
      power: 'absolute authority',
      mystery: 'enigmatic skill',
      elements: 'elemental force',
      time: 'temporal mastery',
      spirit: 'collective energy'
    };
    return powers[house];
  }

  function getHouseVictoryMessage(house: MythologicalHouse, orderType: 'buy' | 'sell'): string {
    const action = orderType === 'buy' ? 'acquired' : 'sold';
    const messages = {
      heroes: `Heroically ${action} with honor!`,
      wisdom: `Wisely ${action} through knowledge!`,
      power: `Powerfully ${action} with dominance!`,
      mystery: `Mysteriously ${action} from shadows!`,
      elements: `Naturally ${action} with elemental flow!`,
      time: `Perfectly ${action} through time!`,
      spirit: `Harmoniously ${action} together!`
    };
    return messages[house];
  }

  // Get status icon and color
  function getStatusVisualization() {
    switch (orderDetails.status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
      case 'filling':
        return { icon: Zap, color: 'text-blue-500 animate-pulse', bgColor: 'bg-blue-50' };
      case 'filled':
        return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50' };
      case 'cancelled':
        return { icon: X, color: 'text-gray-500', bgColor: 'bg-gray-50' };
      case 'rejected':
        return { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50' };
      default:
        return { icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-50' };
    }
  }

  // Get order type icon
  function getOrderTypeIcon() {
    if (orderDetails.type === 'buy') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
  }

  // Get sound effect based on order status
  function getSoundEffect(): string | undefined {
    if (showCelebration && orderDetails.status === 'filled') {
      return orderDetails.type === 'buy' ? 'ACQUIRED!' : 'SOLD!';
    }
    if (currentStage?.stage === 'executing') {
      return 'EXECUTING!';
    }
    return undefined;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const statusViz = getStatusVisualization();
  const StatusIcon = statusViz.icon;

  return (
    <ComicPanel
      ref={panelRef}
      variant={showCelebration ? 'splash' : orderDetails.status === 'filled' ? 'action' : 'default'}
      house={activeHouse}
      size={showCelebration ? 'lg' : 'default'}
      isActive={isActive}
      soundEffect={getSoundEffect()}
      narrativeText={panelScript.narrativeBeats[0]?.text}
      onPanelClick={onPanelClick}
      className={cn(
        "relative overflow-hidden",
        statusViz.bgColor,
        showCelebration && "ring-4 ring-gold-400 shadow-xl",
        className
      )}
      data-testid="order-execution-panel"
    >
      {/* Celebration Effects */}
      {showCelebration && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-gold-400/20 to-yellow-400/20 animate-pulse" />
          <div className="absolute inset-0 particles-celebration pointer-events-none" />
        </>
      )}

      {/* Execution Effects */}
      {executionEffects.includes('explosion') && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-ping pointer-events-none" />
      )}
      {executionEffects.includes('lightning') && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse pointer-events-none" />
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant={orderDetails.type === 'buy' ? 'default' : 'secondary'}
              className={cn(
                "text-xs",
                orderDetails.type === 'buy' ? "bg-green-600 text-white" : "bg-red-600 text-white"
              )}
            >
              {orderDetails.type.toUpperCase()}
            </Badge>
            {getOrderTypeIcon()}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1">
            <StatusIcon className={cn("h-4 w-4", statusViz.color)} />
            <span className={cn("text-xs font-medium", statusViz.color)}>
              {orderDetails.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="mb-3">
            <h3 className="text-lg font-bold">{orderDetails.symbol}</h3>
            <div className="text-sm text-muted-foreground">
              {orderDetails.quantity} shares @ {formatCurrency(orderDetails.price)}
            </div>
            <div className="text-lg font-semibold mt-1">
              Total: {formatCurrency(orderDetails.totalValue)}
            </div>
          </div>

          {/* Execution Progress */}
          {orderDetails.status === 'filling' && currentStage && (
            <div className="mb-3 space-y-2">
              <div className="text-sm font-medium">{currentStage.message}</div>
              <Progress value={executionProgress} className="h-2" />
            </div>
          )}

          {/* Fill Information */}
          {orderDetails.status === 'filled' && orderDetails.filledQuantity && (
            <div className="mb-3 p-2 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">
                Filled: {orderDetails.filledQuantity} shares
              </div>
              {orderDetails.averageFillPrice && (
                <div className="text-xs text-green-600">
                  Avg Price: {formatCurrency(orderDetails.averageFillPrice)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Execution Story Speech Bubble */}
        {currentStage && showExecutionStory && (
          <SpeechBubble
            variant={currentStage.stage === 'executing' ? 'shout' : 'default'}
            size="sm"
            speaker={`${activeHouse} Trader`}
            className="absolute top-2 left-2 max-w-36 z-20"
            data-testid="execution-story"
          >
            {currentStage.message}
          </SpeechBubble>
        )}

        {/* Victory Celebration */}
        {showCelebration && orderDetails.status === 'filled' && (
          <>
            <SpeechBubble
              variant="shout"
              size="lg"
              speaker={`House of ${activeHouse}`}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
              data-testid="victory-celebration"
            >
              <div className="text-center">
                <Crown className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                VICTORY ACHIEVED!
                <div className="text-xs mt-1">
                  {getHouseVictoryMessage(activeHouse, orderDetails.type)}
                </div>
              </div>
            </SpeechBubble>

            <CaptionBox
              variant="narrative"
              position="bottom-center"
              className="z-30"
              data-testid="victory-caption"
            >
              The markets bow to the power of {activeHouse}!
            </CaptionBox>
          </>
        )}

        {/* Order Metadata Caption */}
        <CaptionBox
          variant="time"
          size="sm"
          position="bottom-right"
          timestamp={orderDetails.timestamp}
          className="z-20"
          data-testid="order-timestamp"
        >
          Order #{orderDetails.id.slice(0, 8)}...
        </CaptionBox>
      </div>

      {/* House-themed celebration overlay */}
      {showCelebration && (
        <div className={cn(
          "absolute inset-0 pointer-events-none",
          activeHouse === 'heroes' && "house-heroes-victory-aura",
          activeHouse === 'wisdom' && "house-wisdom-enlightenment",
          activeHouse === 'power' && "house-power-domination",
          activeHouse === 'mystery' && "house-mystery-revelation",
          activeHouse === 'elements' && "house-elements-harmony",
          activeHouse === 'time' && "house-time-convergence",
          activeHouse === 'spirit' && "house-spirit-unity"
        )} />
      )}
    </ComicPanel>
  );
}

export default OrderExecutionPanel;