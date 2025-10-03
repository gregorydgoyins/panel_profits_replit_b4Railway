import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, TrendingUp, Brain, Target, Shield, Zap, Trophy } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ENTRY_TEST_SCENARIOS, type TestScenario, type TestChoice } from '@shared/entryTestScenarios';

interface EntryTestProps {
  onComplete: (houseAssignment: { primaryHouse: string; secondaryHouse: string }) => void;
}

export default function EntryTest({ onComplete }: EntryTestProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [responses, setResponses] = useState<Array<{
    scenarioId: string;
    choiceId: string;
    responseTime: number;
  }>>([]);
  const [scenarioStartTime, setScenarioStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  const { toast } = useToast();
  
  const currentScenario = ENTRY_TEST_SCENARIOS[currentScenarioIndex];
  const progress = ((currentScenarioIndex + 1) / ENTRY_TEST_SCENARIOS.length) * 100;
  
  // Submit test results mutation
  const submitTestMutation = useMutation<
    { primaryHouse: string; secondaryHouse: string; displayScore: number; testComplete: boolean },
    Error,
    { responses: Array<{ scenarioId: string; choiceId: string; responseTime: number }> }
  >({
    mutationFn: async (testData) => {
      const response = await apiRequest('POST', '/api/entry-test/submit', testData);
      return response.json();
    },
    onSuccess: (data) => {
      onComplete({
        primaryHouse: data.primaryHouse,
        secondaryHouse: data.secondaryHouse
      });
    },
    onError: (error) => {
      toast({
        title: 'Test Submission Failed',
        description: 'There was an error processing your results. Please try again.',
        variant: 'destructive',
      });
      console.error('Test submission error:', error);
    }
  });
  
  useEffect(() => {
    setScenarioStartTime(Date.now());
  }, [currentScenarioIndex]);
  
  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
  };
  
  const handleNextScenario = () => {
    if (!selectedChoice) {
      toast({
        title: 'Selection Required',
        description: 'Please select an option before continuing.',
        variant: 'destructive',
      });
      return;
    }
    
    const responseTime = Date.now() - scenarioStartTime;
    const choice = currentScenario.choices.find(c => c.id === selectedChoice);
    
    if (choice) {
      // Update responses
      const newResponse = {
        scenarioId: currentScenario.id,
        choiceId: selectedChoice,
        responseTime
      };
      
      setResponses([...responses, newResponse]);
      setTotalScore(totalScore + choice.displayedScore);
      setShowFeedback(true);
      
      // Show feedback briefly, then move to next scenario
      setTimeout(() => {
        setShowFeedback(false);
        
        if (currentScenarioIndex < ENTRY_TEST_SCENARIOS.length - 1) {
          setCurrentScenarioIndex(currentScenarioIndex + 1);
          setSelectedChoice('');
        } else {
          // Test complete - submit results
          submitTestMutation.mutate({
            responses: [...responses, newResponse]
          });
        }
      }, 2000);
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Risk Assessment': return <TrendingUp className="w-5 h-5" />;
      case 'Information Analysis': return <Brain className="w-5 h-5" />;
      case 'Negotiation Skills': return <Target className="w-5 h-5" />;
      case 'Regulatory Knowledge': return <Shield className="w-5 h-5" />;
      case 'Competitive Strategy': return <Zap className="w-5 h-5" />;
      case 'Crisis Management': return <AlertCircle className="w-5 h-5" />;
      case 'Trading Philosophy': return <Trophy className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };
  
  if (submitTestMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl border-primary/20">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse mb-4">
              <Trophy className="w-16 h-16 text-primary mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Trading Profile...</h2>
            <p className="text-muted-foreground">
              Our advanced algorithms are evaluating your responses to determine your optimal trading style.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentScenario.displayCategory)}
              <span className="text-sm font-medium text-muted-foreground">
                {currentScenario.displayCategory}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Scenario {currentScenarioIndex + 1} of {ENTRY_TEST_SCENARIOS.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle className="text-2xl">{currentScenario.title}</CardTitle>
          <CardDescription className="text-base">
            {currentScenario.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-4">
              <p className="text-sm leading-relaxed">{currentScenario.context}</p>
            </CardContent>
          </Card>
          
          {showFeedback ? (
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary mb-1">
                      Score: {currentScenario.choices.find(c => c.id === selectedChoice)?.displayedScore}/100
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentScenario.choices.find(c => c.id === selectedChoice)?.displayedFeedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <RadioGroup value={selectedChoice} onValueChange={handleChoiceSelect}>
                <div className="space-y-3">
                  {currentScenario.choices.map((choice) => (
                    <Card 
                      key={choice.id} 
                      className={`cursor-pointer transition-all hover:border-primary/50 ${
                        selectedChoice === choice.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleChoiceSelect(choice.id)}
                      data-testid={`choice-${choice.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem 
                            value={choice.id} 
                            id={choice.id}
                            className="mt-0.5"
                          />
                          <Label 
                            htmlFor={choice.id} 
                            className="flex-1 cursor-pointer font-normal"
                          >
                            {choice.text}
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  Current Score: <span className="font-medium text-foreground">{totalScore}</span>
                </div>
                <Button 
                  onClick={handleNextScenario}
                  disabled={!selectedChoice}
                  className="min-w-32"
                  data-testid="button-next-scenario"
                >
                  {currentScenarioIndex === ENTRY_TEST_SCENARIOS.length - 1 ? 'Complete Test' : 'Next Scenario'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}