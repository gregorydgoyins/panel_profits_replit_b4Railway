import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  KNOWLEDGE_TEST_SCENARIOS,
  KNOWLEDGE_TEST_CONFIG,
  MarketPricing,
  type KnowledgeScenario
} from '@shared/knowledgeTestScenarios';
import {
  ChevronRight,
  Clock,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  ChartBar,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Response {
  scenarioId: string;
  choiceId: string;
  responseTime: number;
}

interface KnowledgeTestProps {
  onComplete: (responses: Response[]) => void;
}

export default function KnowledgeTest({ onComplete }: KnowledgeTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(KNOWLEDGE_TEST_CONFIG.timePerQuestion);
  const [testStartTime] = useState(Date.now());

  const scenario = KNOWLEDGE_TEST_SCENARIOS[currentQuestion];
  const progress = ((currentQuestion + 1) / KNOWLEDGE_TEST_SCENARIOS.length) * 100;

  // Timer countdown
  useEffect(() => {
    if (showRationale) return; // Pause timer during rationale display
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit with no choice (penalty)
          handleSubmit(null);
          return KNOWLEDGE_TEST_CONFIG.timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showRationale]);

  const handleSubmit = (choiceId: string | null) => {
    if (showRationale) return;

    const responseTime = Date.now() - questionStartTime;
    
    // Record response (null choice = timeout)
    const newResponse: Response = {
      scenarioId: scenario.id,
      choiceId: choiceId || 'timeout',
      responseTime
    };
    
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    
    if (choiceId && KNOWLEDGE_TEST_CONFIG.showRationale) {
      setShowRationale(true);
    } else {
      nextQuestion(updatedResponses);
    }
  };

  const nextQuestion = (updatedResponses: Response[]) => {
    if (currentQuestion >= KNOWLEDGE_TEST_SCENARIOS.length - 1) {
      // Test complete
      onComplete(updatedResponses);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedChoice(null);
      setShowRationale(false);
      setQuestionStartTime(Date.now());
      setTimeRemaining(KNOWLEDGE_TEST_CONFIG.timePerQuestion);
    }
  };

  const renderVisualData = () => {
    if (!scenario.visualData) return null;

    const { type, data } = scenario.visualData;

    if (type === 'orderbook') {
      return (
        <Card className="bg-black/40 border-indigo-900/30 mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-indigo-400 flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Order Book Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="text-green-400 font-medium mb-2">Bids</h4>
                {data.bids.map((bid: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-400">
                    <span>${bid.price}</span>
                    <span>{bid.size.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-red-400 font-medium mb-2">Asks</h4>
                {data.asks.map((ask: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-400">
                    <span>${ask.price}</span>
                    <span>{ask.size.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950/20 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Market Mastery Challenge</h1>
          <p className="text-gray-400">Optimize your trading strategies for maximum profit</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {KNOWLEDGE_TEST_SCENARIOS.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className={`text-sm font-mono ${timeRemaining < 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black/60 border-indigo-900/50 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="border-indigo-500 text-indigo-400">
                    {scenario.difficulty.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    <Target className="h-3 w-3 mr-1" />
                    Profit Optimization
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white">{scenario.title}</CardTitle>
                <CardDescription className="text-gray-300 whitespace-pre-wrap mt-3">
                  {scenario.context}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {renderVisualData()}
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">{scenario.question}</h3>
                </div>

                <div className="space-y-3">
                  {scenario.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => !showRationale && setSelectedChoice(choice.id)}
                      disabled={showRationale}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedChoice === choice.id
                          ? 'border-indigo-500 bg-indigo-950/30'
                          : 'border-gray-700 hover:border-gray-600 bg-black/40'
                      } ${showRationale ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-4 h-4 rounded-full border-2 ${
                          selectedChoice === choice.id
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-500'
                        }`}>
                          {selectedChoice === choice.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200">{choice.text}</p>
                          {showRationale && selectedChoice === choice.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Alert className="mt-3 border-indigo-900/50 bg-indigo-950/30">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  <span className="font-semibold">Analysis:</span> {choice.rationale}
                                </AlertDescription>
                              </Alert>
                              <div className="mt-2 flex gap-4 text-xs">
                                <Badge variant="outline" className="border-green-500 text-green-400">
                                  Profit Score: {choice.profitScore}
                                </Badge>
                                {/* Hidden knowledge score - not shown to user */}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  {!showRationale ? (
                    <Button
                      onClick={() => selectedChoice && handleSubmit(selectedChoice)}
                      disabled={!selectedChoice}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Submit Answer
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => nextQuestion(responses)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {currentQuestion < KNOWLEDGE_TEST_SCENARIOS.length - 1 ? 'Next Question' : 'Complete Test'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Knowledge Areas Being Tested (subtle hint) */}
        <div className="text-center text-xs text-gray-600">
          <BookOpen className="h-3 w-3 inline-block mr-1" />
          Testing market dynamics and trading optimization strategies
        </div>
      </div>
    </div>
  );
}