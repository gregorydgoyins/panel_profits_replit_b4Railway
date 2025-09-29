import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ComicPanel } from "./comic-panel";
import { ComicSoundEffect } from "./comic-sound-effect";
import { ComicTransition } from "./comic-transitions";
import { SpeechBubble } from "./speech-bubble";
import { ComicButton } from "./comic-button";

const actionSequenceVariants = cva(
  "action-sequence-chart relative overflow-hidden",
  {
    variants: {
      style: {
        dynamic: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        explosive: "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50",
        stealth: "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white",
        victory: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
      },
      sequence: {
        "3-panel": "grid-cols-3",
        "4-panel": "grid-cols-4",
        "5-panel": "grid-cols-5",
        vertical: "grid-cols-1 grid-rows-4",
        "z-pattern": "grid-cols-2 grid-rows-2",
      },
      speed: {
        slow: "gap-6",
        normal: "gap-4",
        fast: "gap-2",
        lightning: "gap-1",
      },
    },
    defaultVariants: {
      style: "dynamic",
      sequence: "4-panel",
      speed: "normal",
    },
  }
);

export interface TradingAction {
  id: string;
  type: "order_placed" | "order_filled" | "price_movement" | "profit_loss" | "alert" | "cancel";
  title: string;
  description: string;
  timestamp: Date;
  
  // Trading specific data
  assetSymbol: string;
  orderType: "buy" | "sell" | "limit" | "market" | "stop";
  quantity: number;
  price?: number;
  totalValue?: number;
  
  // Visual effects
  intensity: "low" | "medium" | "high" | "extreme";
  soundEffect?: string;
  mood: "confident" | "nervous" | "excited" | "panic" | "relief" | "focused";
  
  // Outcome
  success: boolean;
  profitLoss?: number;
  impact: "minor" | "moderate" | "significant" | "critical";
}

export interface ActionSequence {
  id: string;
  title: string;
  description: string;
  actions: TradingAction[];
  startTime: Date;
  endTime: Date;
  outcome: "pending" | "success" | "failure" | "mixed";
  totalProfitLoss?: number;
  house?: string;
}

export interface ActionSequenceChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof actionSequenceVariants> {
  sequence: ActionSequence;
  currentAction?: number;
  onActionClick?: (action: TradingAction, index: number) => void;
  autoPlay?: boolean;
  playSpeed?: number;
  showDialogue?: boolean;
  showEffects?: boolean;
  interactive?: boolean;
}

const ActionSequenceChart = React.forwardRef<HTMLDivElement, ActionSequenceChartProps>(
  ({ 
    className,
    style,
    sequence: sequenceType,
    speed,
    sequence,
    currentAction = 0,
    onActionClick,
    autoPlay = false,
    playSpeed = 2000,
    showDialogue = true,
    showEffects = true,
    interactive = true,
    ...props 
  }, ref) => {
    const [activeAction, setActiveAction] = React.useState(currentAction);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [completedActions, setCompletedActions] = React.useState<Set<number>>(new Set());
    const [soundTriggers, setSoundTriggers] = React.useState<Record<string, boolean>>({});

    // Auto-play sequence
    React.useEffect(() => {
      if (isPlaying && activeAction < sequence.actions.length - 1) {
        const timer = setTimeout(() => {
          const nextAction = activeAction + 1;
          setActiveAction(nextAction);
          setCompletedActions(prev => new Set(prev).add(activeAction));
          
          // Trigger sound effect
          const action = sequence.actions[nextAction];
          if (action.soundEffect && showEffects) {
            triggerSoundEffect(action.id);
          }
        }, playSpeed);

        return () => clearTimeout(timer);
      } else if (isPlaying && activeAction === sequence.actions.length - 1) {
        setIsPlaying(false);
        setCompletedActions(prev => new Set(prev).add(activeAction));
      }
    }, [isPlaying, activeAction, sequence.actions.length, playSpeed, showEffects]);

    const triggerSoundEffect = (actionId: string) => {
      setSoundTriggers(prev => ({ ...prev, [actionId]: true }));
      setTimeout(() => {
        setSoundTriggers(prev => ({ ...prev, [actionId]: false }));
      }, 100);
    };

    const handleActionClick = (action: TradingAction, index: number) => {
      if (!interactive) return;
      
      setActiveAction(index);
      onActionClick?.(action, index);
      
      if (action.soundEffect && showEffects) {
        triggerSoundEffect(action.id);
      }
    };

    const getMoodIntensity = (mood: TradingAction["mood"], intensity: TradingAction["intensity"]) => {
      const baseIntensity = {
        low: "opacity-75",
        medium: "opacity-90", 
        high: "opacity-100 scale-105",
        extreme: "opacity-100 scale-110 animate-pulse"
      }[intensity];

      const moodEffect = {
        confident: "bg-blue-50 border-blue-200",
        nervous: "bg-yellow-50 border-yellow-200",
        excited: "bg-green-50 border-green-200", 
        panic: "bg-red-50 border-red-200",
        relief: "bg-emerald-50 border-emerald-200",
        focused: "bg-slate-50 border-slate-200"
      }[mood];

      return `${baseIntensity} ${moodEffect}`;
    };

    const getActionDialogue = (action: TradingAction): string => {
      switch (action.type) {
        case "order_placed":
          return `"Placing ${action.orderType} order for ${action.quantity} ${action.assetSymbol}!"`;
        case "order_filled":
          return action.success ? `"Order executed! ${action.assetSymbol} acquired!"` : `"Order failed to execute!"`;
        case "price_movement":
          return action.profitLoss && action.profitLoss > 0 
            ? `"Yes! ${action.assetSymbol} is moving up!"` 
            : `"Hold steady, ${action.assetSymbol} is dropping..."`;
        case "profit_loss":
          return action.profitLoss && action.profitLoss > 0
            ? `"Victory! Profit of $${action.profitLoss.toFixed(2)}!"`
            : `"Taking the loss... -$${Math.abs(action.profitLoss || 0).toFixed(2)}"`;
        case "alert":
          return `"Alert! ${action.description}"`;
        default:
          return `"${action.description}"`;
      }
    };

    const getActionIcon = (action: TradingAction): string => {
      switch (action.type) {
        case "order_placed": return "📝";
        case "order_filled": return "✅";
        case "price_movement": return action.profitLoss && action.profitLoss > 0 ? "📈" : "📉";
        case "profit_loss": return action.profitLoss && action.profitLoss > 0 ? "💰" : "💸";
        case "alert": return "⚠️";
        case "cancel": return "❌";
        default: return "📊";
      }
    };

    const getSequenceOutcomeStyle = () => {
      switch (sequence.outcome) {
        case "success": return "border-green-500 bg-green-50";
        case "failure": return "border-red-500 bg-red-50";
        case "mixed": return "border-orange-500 bg-orange-50";
        default: return "border-slate-500 bg-slate-50";
      }
    };

    return (
      <div
        ref={ref}
        className={cn("action-sequence-container", className)}
        data-testid={`action-sequence-${sequence.id}`}
        {...props}
      >
        {/* Sequence Header */}
        <div className={cn(
          "mb-6 p-4 border-2 rounded-lg",
          getSequenceOutcomeStyle()
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-comic-display text-xl font-bold">
                {sequence.title}
              </h3>
              <p className="font-comic-narrative text-sm">
                {sequence.description}
              </p>
            </div>
            <div className="text-right">
              <div className={cn(
                "font-comic-display text-lg font-bold",
                sequence.totalProfitLoss && sequence.totalProfitLoss > 0 ? "text-green-600" : "text-red-600"
              )}>
                {sequence.totalProfitLoss && (
                  <>
                    {sequence.totalProfitLoss > 0 ? "+" : ""}
                    ${sequence.totalProfitLoss.toFixed(2)}
                  </>
                )}
              </div>
              <div className="font-comic-narrative text-xs">
                {sequence.actions.length} Actions
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mb-4 flex items-center justify-center space-x-4">
          <ComicButton
            variant="action"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeAction >= sequence.actions.length - 1}
            data-testid="sequence-play-button"
          >
            {isPlaying ? "⏸️ PAUSE" : "▶️ PLAY"}
          </ComicButton>
          
          <ComicButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveAction(0);
              setCompletedActions(new Set());
              setIsPlaying(false);
            }}
            data-testid="sequence-reset-button"
          >
            🔄 RESET
          </ComicButton>
          
          <ComicButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveAction(sequence.actions.length - 1);
              setCompletedActions(new Set(Array.from({ length: sequence.actions.length }, (_, i) => i)));
              setIsPlaying(false);
            }}
            data-testid="sequence-end-button"
          >
            ⏭️ END
          </ComicButton>
        </div>

        {/* Action Sequence Grid */}
        <div 
          className={cn(
            "grid gap-4 p-4",
            actionSequenceVariants({ style, sequence: sequenceType, speed })
          )}
        >
          {sequence.actions.map((action, index) => (
            <div key={action.id} className="relative">
              <ComicTransition
                type="zoom"
                isVisible={index <= activeAction}
                delay={index * 100}
              >
                <ComicPanel
                  variant={action.success ? "action" : "quiet"}
                  house={sequence.house}
                  panelNumber={index + 1}
                  isActive={index === activeAction}
                  className={cn(
                    "cursor-pointer transition-all duration-300 min-h-32",
                    interactive && "hover:scale-105",
                    getMoodIntensity(action.mood, action.intensity),
                    completedActions.has(index) && "opacity-100 border-primary border-2"
                  )}
                  onClick={() => handleActionClick(action, index)}
                  data-testid={`action-panel-${index}`}
                >
                  <div className="flex flex-col h-full space-y-2">
                    {/* Action Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getActionIcon(action)}</span>
                        <span className="font-comic-display text-xs font-bold">
                          {action.type.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {action.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Action Title */}
                    <h4 className="font-comic-display text-sm font-bold">
                      {action.title}
                    </h4>

                    {/* Trading Details */}
                    <div className="flex-1 space-y-1">
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div>
                          <span className="font-bold">{action.assetSymbol}</span>
                        </div>
                        <div className="text-right">
                          {action.quantity} @ ${action.price?.toFixed(2) || "Market"}
                        </div>
                      </div>
                      
                      {action.totalValue && (
                        <div className="text-center text-xs font-bold">
                          Total: ${action.totalValue.toFixed(2)}
                        </div>
                      )}

                      {action.profitLoss && (
                        <div className={cn(
                          "text-center text-sm font-bold",
                          action.profitLoss > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {action.profitLoss > 0 ? "+" : ""}${action.profitLoss.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Success/Failure Indicator */}
                    <div className="text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold",
                        action.success ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {action.success ? "SUCCESS" : "FAILED"}
                      </span>
                    </div>
                  </div>
                </ComicPanel>
              </ComicTransition>

              {/* Character Dialogue */}
              {showDialogue && index <= activeAction && (
                <SpeechBubble
                  variant={action.mood === "panic" ? "shout" : action.mood === "nervous" ? "whisper" : "default"}
                  size="sm"
                  tail="bottom"
                  speaker={action.assetSymbol}
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10 max-w-48"
                >
                  {getActionDialogue(action)}
                </SpeechBubble>
              )}

              {/* Sound Effects */}
              {showEffects && soundTriggers[action.id] && action.soundEffect && (
                <ComicSoundEffect
                  sound={action.soundEffect}
                  variant="impact"
                  intensity={action.intensity as any}
                  trigger={true}
                  position="top-right"
                />
              )}

              {/* Connection Lines */}
              {index < sequence.actions.length - 1 && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-black z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-y-2 border-y-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sequence Progress */}
        <div className="mt-6 bg-slate-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-comic-display text-sm">Progress</span>
            <span className="font-comic-narrative text-xs">
              {activeAction + 1} / {sequence.actions.length} Actions
            </span>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((activeAction + 1) / sequence.actions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Sequence Summary */}
        <div className="mt-4 text-center">
          <div className="font-comic-narrative text-sm text-slate-600">
            <strong>Duration:</strong> {Math.floor((sequence.endTime.getTime() - sequence.startTime.getTime()) / 1000 / 60)}m • 
            <strong> Outcome:</strong> {sequence.outcome.toUpperCase()} • 
            <strong> House:</strong> {sequence.house?.toUpperCase() || "NONE"}
          </div>
        </div>
      </div>
    );
  }
);

ActionSequenceChart.displayName = "ActionSequenceChart";

// Utility function to create an action sequence from trading orders
export function createActionSequence(
  orders: any[],
  title: string,
  description: string,
  house?: string
): ActionSequence {
  const actions: TradingAction[] = orders.map((order, index) => {
    const isSuccess = order.status === "filled";
    const profitLoss = order.totalValue ? (order.type === "sell" ? order.totalValue - (order.averageCost || 0) * order.quantity : 0) : undefined;
    
    return {
      id: order.id || `action-${index}`,
      type: "order_placed",
      title: `${order.type.toUpperCase()} ${order.assetId}`,
      description: `${order.type} ${order.quantity} shares at $${order.price}`,
      timestamp: new Date(order.createdAt),
      assetSymbol: order.assetId,
      orderType: order.type,
      quantity: order.quantity,
      price: order.price,
      totalValue: order.totalValue,
      intensity: profitLoss && Math.abs(profitLoss) > 1000 ? "extreme" : "medium",
      soundEffect: isSuccess ? "DING!" : "BZZT!",
      mood: isSuccess ? (profitLoss && profitLoss > 0 ? "excited" : "confident") : "nervous",
      success: isSuccess,
      profitLoss,
      impact: Math.abs(profitLoss || 0) > 5000 ? "critical" : Math.abs(profitLoss || 0) > 1000 ? "significant" : "moderate"
    };
  });

  const totalProfitLoss = actions.reduce((sum, action) => sum + (action.profitLoss || 0), 0);
  const outcome = totalProfitLoss > 0 ? "success" : totalProfitLoss < 0 ? "failure" : "mixed";

  return {
    id: `sequence-${Date.now()}`,
    title,
    description,
    actions,
    startTime: actions[0]?.timestamp || new Date(),
    endTime: actions[actions.length - 1]?.timestamp || new Date(),
    outcome,
    totalProfitLoss,
    house
  };
}

export { ActionSequenceChart, actionSequenceVariants };