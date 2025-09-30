import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface TestStatus {
  hasCompletedTest: boolean;
  requiresTest: boolean;
  lastAttempt?: {
    tier: string;
    tradingFloorAccess: boolean;
  };
}

export default function KnowledgeTestGuard({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  
  // Check if user has completed the knowledge test
  const { data: testStatus, isLoading } = useQuery({
    queryKey: ['/api/knowledge-test/status'],
  }) as { data: TestStatus | undefined; isLoading: boolean };
  
  useEffect(() => {
    if (!isLoading && testStatus) {
      // Only redirect if test not completed AND user has completed entry test
      // (Entry test completion is checked by EntryTestGuard)
      if (!testStatus.hasCompletedTest && testStatus.requiresTest) {
        navigate('/knowledge-test');
      }
    }
  }, [testStatus, isLoading, navigate]);
  
  // Show loading while checking status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950/20 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying trading floor access...</p>
        </div>
      </div>
    );
  }
  
  // If test is required, the redirect will happen via useEffect
  // Otherwise, render children
  return <>{children}</>;
}