import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import EntryTest from '@/components/EntryTest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Shield, Users, Target, Zap, Brain } from 'lucide-react';
import { SEVEN_HOUSES } from '@shared/entryTestScenarios';

interface TestStatus {
  completed: boolean;
  houseId: string | null;
  requiresTest: boolean;
}

export default function EntryTestPage() {
  const [, setLocation] = useLocation();
  const [testCompleted, setTestCompleted] = useState(false);
  const [houseAssignment, setHouseAssignment] = useState<{
    primaryHouse: string;
    secondaryHouse: string;
  } | null>(null);

  // Check if user has already completed the test
  const { data: testStatus, isLoading } = useQuery<TestStatus>({
    queryKey: ['/api/entry-test/status'],
    enabled: true,
  });

  useEffect(() => {
    // If user already completed test, redirect to knowledge test
    if (testStatus?.completed && !testCompleted) {
      setLocation('/knowledge-test');
    }
  }, [testStatus, setLocation, testCompleted]);

  const handleTestComplete = (assignment: { primaryHouse: string; secondaryHouse: string }) => {
    setHouseAssignment(assignment);
    setTestCompleted(true);
  };

  const handleContinueToDashboard = () => {
    setLocation('/knowledge-test');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test status...</p>
        </div>
      </div>
    );
  }

  // Show house assignment result
  if (testCompleted && houseAssignment) {
    const primaryHouse = Object.values(SEVEN_HOUSES).find(h => h.id === houseAssignment.primaryHouse);
    const secondaryHouse = Object.values(SEVEN_HOUSES).find(h => h.id === houseAssignment.secondaryHouse);

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-3xl border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <Trophy className="w-16 h-16 text-primary mx-auto animate-pulse" />
            </div>
            <CardTitle className="text-3xl mb-2">Trading Profile Complete</CardTitle>
            <CardDescription className="text-lg">
              Your trading style has been analyzed and categorized
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Primary House Assignment */}
            <Card className="border-2" style={{ borderColor: primaryHouse?.color }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Primary Trading Style</span>
                  <Shield className="w-5 h-5" style={{ color: primaryHouse?.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold mb-2" style={{ color: primaryHouse?.color }}>
                  {primaryHouse?.name}
                </h3>
                <p className="text-muted-foreground mb-3">{primaryHouse?.description}</p>
                <p className="text-sm italic" style={{ color: primaryHouse?.color }}>
                  "{primaryHouse?.motto}"
                </p>
              </CardContent>
            </Card>

            {/* Secondary House (Alternative Style) */}
            <Card className="border opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Alternative Style</span>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-lg font-semibold mb-1">{secondaryHouse?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  You also show traits aligned with this trading philosophy
                </p>
              </CardContent>
            </Card>

            {/* What This Means */}
            <Card className="bg-muted/50 border-muted">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  What This Means For Your Trading
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 text-primary/60" />
                    <span>Your strategies will be optimized for your trading style</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 text-primary/60" />
                    <span>Market events will be filtered based on your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-primary/60" />
                    <span>AI recommendations will adapt to your trading philosophy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <div className="pt-4">
              <Button 
                onClick={handleContinueToDashboard}
                className="w-full"
                size="lg"
                data-testid="button-continue-dashboard"
              >
                Continue to Market Mastery Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show Entry Test
  if (!testStatus?.completed) {
    return <EntryTest onComplete={handleTestComplete} />;
  }

  return null;
}