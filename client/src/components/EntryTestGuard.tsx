import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface TestStatus {
  completed: boolean;
  houseId: string | null;
  requiresTest: boolean;
}

interface EntryTestGuardProps {
  children: React.ReactNode;
}

export function EntryTestGuard({ children }: EntryTestGuardProps) {
  const [location, setLocation] = useLocation();
  
  // Check if user has completed the Entry Test
  const { data: testStatus, isLoading, error } = useQuery<TestStatus>({
    queryKey: ['/api/entry-test/status'],
    enabled: true,
    refetchInterval: false,
    retry: 1,
  });

  useEffect(() => {
    console.log('EntryTestGuard status check:', { testStatus, isLoading, error, location });
    // If user hasn't completed test and not already on test page, redirect to test
    if (!isLoading && testStatus?.requiresTest && location !== '/entry-test') {
      console.log('Redirecting to entry test...');
      setLocation('/entry-test');
    }
  }, [testStatus, isLoading, error, location, setLocation]);

  // Show loading while checking test status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying trading profile...</p>
        </div>
      </div>
    );
  }

  // If there was an error checking status, show the content anyway
  if (error) {
    console.error('Error checking entry test status:', error);
    return <>{children}</>;
  }

  // If test is required and we're not on the test page, show loading (redirect will happen)
  if (testStatus?.requiresTest && location !== '/entry-test') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to trading assessment...</p>
        </div>
      </div>
    );
  }

  // User has completed test or is on test page - show content
  return <>{children}</>;
}