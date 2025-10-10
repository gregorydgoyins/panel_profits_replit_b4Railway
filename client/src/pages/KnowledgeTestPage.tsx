import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import KnowledgeTest from '@/components/KnowledgeTest';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  AlertTriangle,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  BookOpen,
  ChevronRight,
  Timer,
  Target
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { calculateKnowledgeScore, type KnowledgeTestResult } from '@shared/knowledgeTestScenarios';
import { motion } from 'framer-motion';

interface Response {
  scenarioId: string;
  choiceId: string;
  responseTime: number;
}

interface TestStatus {
  hasCompletedTest: boolean;
  lastAttempt?: {
    completedAt: string;
    tier: string;
    profitScore: number;
    knowledgeScore: number;
    retakeAllowedAt?: string;
  };
}

export default function KnowledgeTestPage() {
  const [, navigate] = useLocation();
  const [testComplete, setTestComplete] = useState(false);
  const [testResult, setTestResult] = useState<KnowledgeTestResult | null>(null);

  // Check if user has already completed the test
  const { data: testStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/knowledge-test/status'],
  }) as { data: TestStatus | undefined; isLoading: boolean };

  // Submit test results
  const submitTestMutation = useMutation({
    mutationFn: async (responses: Response[]) => {
      const result = calculateKnowledgeScore(responses);
      const response = await apiRequest({
        method: 'POST',
        url: '/api/knowledge-test/submit',
        body: { responses, result }
      }) as { success: boolean; result: KnowledgeTestResult };
      return response.result;
    },
    onSuccess: (result) => {
      setTestResult(result);
      setTestComplete(true);
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge-test/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Redirect to trading floor if passed, otherwise show results
      if (result.hiddenKnowledgeScore >= 60) {
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    },
  });

  const handleTestComplete = (responses: Response[]) => {
    submitTestMutation.mutate(responses);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'master': return 'text-purple-400 border-purple-400';
      case 'specialist': return 'text-blue-400 border-blue-400';
      case 'trader': return 'text-green-400 border-green-400';
      case 'associate': return 'text-yellow-400 border-yellow-400';
      case 'novice': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'master':
      case 'specialist':
        return <Trophy className="h-5 w-5" />;
      case 'trader':
        return <TrendingUp className="h-5 w-5" />;
      case 'associate':
        return <BookOpen className="h-5 w-5" />;
      case 'novice':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950/20 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading test status...</p>
        </div>
      </div>
    );
  }

  // Show previous attempt if exists and can't retake yet
  if (testStatus?.hasCompletedTest && testStatus.lastAttempt) {
    const canRetake = testStatus.lastAttempt.retakeAllowedAt 
      ? new Date(testStatus.lastAttempt.retakeAllowedAt) <= new Date()
      : false;

    if (!canRetake) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950/20 to-black p-4">
          <div className="max-w-2xl mx-auto mt-20">
            <Card className="bg-black/60 border-indigo-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Test Already Completed</CardTitle>
                <CardDescription className="text-gray-400">
                  Your trading floor access has been evaluated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-6">
                  <div className={`inline-flex items-center gap-2 ${getTierColor(testStatus.lastAttempt.tier)}`}>
                    {getTierIcon(testStatus.lastAttempt.tier)}
                    <span className="text-2xl  uppercase">{testStatus.lastAttempt.tier}</span>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Performance Score</p>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                          style={{ width: `${testStatus.lastAttempt.profitScore}%` }}
                        />
                      </div>
                      <p className="text-xl font-mono text-white mt-2">
                        {testStatus.lastAttempt.profitScore}%
                      </p>
                    </div>
                    
                    {testStatus.lastAttempt.retakeAllowedAt && (
                      <Alert className="border-yellow-900 bg-yellow-950/20">
                        <Timer className="h-4 w-4" />
                        <AlertTitle>Retake Available</AlertTitle>
                        <AlertDescription>
                          You can retake the test on {new Date(testStatus.lastAttempt.retakeAllowedAt).toLocaleString()}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue to Trading Floor
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  // Show test results
  if (testComplete && testResult) {
    const passed = testResult.hiddenKnowledgeScore >= 60;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950/20 to-black p-4">
        <div className="max-w-3xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-black/60 border-indigo-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl text-white text-center">
                  Market Mastery Challenge Complete
                </CardTitle>
                <CardDescription className="text-gray-400 text-center text-lg">
                  Your trading capabilities have been assessed
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Tier Badge */}
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className={`inline-flex items-center gap-3 ${getTierColor(testResult.tier)}`}
                  >
                    {getTierIcon(testResult.tier)}
                    <span className="text-4xl  uppercase">{testResult.tier}</span>
                  </motion.div>
                </div>

                {/* Scores */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Performance Optimization Score</p>
                    <div className="w-full bg-gray-800 rounded-full h-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${testResult.visibleScore}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
                      />
                    </div>
                    <p className="text-2xl font-mono text-white mt-2">
                      {testResult.visibleScore}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Trading Floor Access</p>
                    <Badge 
                      variant={passed ? 'default' : 'destructive'}
                      className={`text-lg px-4 py-2 ${passed ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}
                    >
                      {passed ? (
                        <>
                          <Unlock className="h-5 w-5 mr-2" />
                          GRANTED
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          RESTRICTED
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Recommendation */}
                <Alert className={`border-indigo-900/50 ${passed ? 'bg-green-950/20' : 'bg-red-950/20'}`}>
                  <Target className="h-4 w-4" />
                  <AlertTitle>Assessment Complete</AlertTitle>
                  <AlertDescription className="text-sm mt-2">
                    {testResult.recommendation}
                  </AlertDescription>
                </Alert>

                {/* Strengths & Weaknesses */}
                {(testResult.strengths.length > 0 || testResult.weakAreas.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {testResult.strengths.length > 0 && (
                      <div>
                        <p className="text-sm text-green-400 mb-2 ">Strengths</p>
                        <div className="space-y-1">
                          {testResult.strengths.map((strength, i) => (
                            <Badge key={i} variant="outline" className="border-green-900 text-green-400">
                              {strength.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {testResult.weakAreas.length > 0 && (
                      <div>
                        <p className="text-sm text-red-400 mb-2 ">Areas for Improvement</p>
                        <div className="space-y-1">
                          {testResult.weakAreas.map((area, i) => (
                            <Badge key={i} variant="outline" className="border-red-900 text-red-400">
                              {area.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Continue Button */}
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={submitTestMutation.isPending}
                >
                  {passed ? 'Enter Trading Floor' : 'View Training Materials'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show the test
  return <KnowledgeTest onComplete={handleTestComplete} />;
}