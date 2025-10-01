import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EasterEggUnlock {
  id: string;
  egg_id: string;
  egg_name?: string;
  egg_description?: string;
  egg_rarity?: string;
  unlocked_at: string;
  reward_claimed: boolean;
}

export function useEasterEggNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const previousUnlocksRef = useRef<Set<string>>(new Set());
  const hasInitializedRef = useRef(false);

  const { data: unlocks = [] } = useQuery<EasterEggUnlock[]>({
    queryKey: ['/api/easter-eggs/unlocked'],
    enabled: !!user,
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    if (!unlocks || unlocks.length === 0) {
      return;
    }

    const currentUnlockIds = new Set(unlocks.map(u => u.id));

    // On first load, just store the current unlocks without showing notifications
    if (!hasInitializedRef.current) {
      previousUnlocksRef.current = currentUnlockIds;
      hasInitializedRef.current = true;
      return;
    }

    // Find newly unlocked eggs
    const newUnlocks = unlocks.filter(unlock => 
      !previousUnlocksRef.current.has(unlock.id)
    );

    // Show notification for each newly unlocked egg
    newUnlocks.forEach(unlock => {
      const rarityEmoji = getRarityEmoji(unlock.egg_rarity || 'common');
      const rarityColor = getRarityColor(unlock.egg_rarity || 'common');

      toast({
        title: `${rarityEmoji} Easter Egg Discovered!`,
        description: (
          <div className="space-y-2">
            <p className="font-bold" style={{ color: rarityColor }}>
              {unlock.egg_name || 'Secret Achievement'}
            </p>
            {unlock.egg_description && (
              <p className="text-sm text-muted-foreground">
                {unlock.egg_description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Visit Easter Eggs page to claim your reward!
            </p>
          </div>
        ),
        duration: 8000, // Show for 8 seconds
      });
    });

    // Update the previous unlocks set
    previousUnlocksRef.current = currentUnlockIds;
  }, [unlocks, toast]);

  return {
    unlockedCount: unlocks.length,
    hasNewUnlocks: unlocks.some(u => !u.reward_claimed),
  };
}

function getRarityEmoji(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'legendary': return '👑';
    case 'epic': return '⭐';
    case 'rare': return '💎';
    case 'uncommon': return '✨';
    case 'common': return '🎯';
    default: return '🏆';
  }
}

function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'legendary': return '#fbbf24'; // yellow-400
    case 'epic': return '#a855f7'; // purple-400
    case 'rare': return '#60a5fa'; // blue-400
    case 'uncommon': return '#34d399'; // green-400
    case 'common': return '#9ca3af'; // gray-400
    default: return '#9ca3af';
  }
}
