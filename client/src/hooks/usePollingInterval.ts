import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Polling intervals by subscription tier (in milliseconds)
 * Narrative: "Trading floor delays" - higher tiers get faster market data processing
 */
const POLLING_INTERVALS = {
  free: 300000,      // 5 minutes - "Back office processing time"
  basic: 60000,      // 1 minute - "Standard trading floor delay"
  premium: 15000,    // 15 seconds - "Priority order book access"
  pro: 5000,         // 5 seconds - "Direct market feed"
} as const;

type SubscriptionTier = keyof typeof POLLING_INTERVALS;

/**
 * Hook that returns the appropriate polling interval based on user's subscription tier
 * Used with TanStack Query's refetchInterval to implement tiered market data delays
 * 
 * @example
 * ```tsx
 * const pollingInterval = usePollingInterval();
 * const { data } = useQuery({
 *   queryKey: ['/api/market-data/snapshot'],
 *   refetchInterval: pollingInterval,
 * });
 * ```
 */
export function usePollingInterval(): number {
  const { user } = useAuth();
  
  const interval = useMemo(() => {
    // Handle unauthenticated users - use free tier
    if (!user) {
      return POLLING_INTERVALS.free;
    }
    
    const tier = (user.subscriptionTier as SubscriptionTier) || 'free';
    return POLLING_INTERVALS[tier] || POLLING_INTERVALS.free;
  }, [user, user?.subscriptionTier]);
  
  return interval;
}

/**
 * Get human-readable delay description for subscription tier
 */
export function getPollingDelayDescription(tier?: string): string {
  const delays = {
    free: 'Updates every 5 minutes',
    basic: 'Updates every minute',
    premium: 'Updates every 15 seconds',
    pro: 'Updates every 5 seconds',
  };
  
  return delays[tier as SubscriptionTier] || delays.free;
}

/**
 * Get narrative description of the delay ("trading floor processing time")
 */
export function getPollingNarrativeReason(tier?: string): string {
  const narratives = {
    free: 'Back office processing time',
    basic: 'Standard trading floor delay',
    premium: 'Priority order book access',
    pro: 'Direct market feed',
  };
  
  return narratives[tier as SubscriptionTier] || narratives.free;
}
