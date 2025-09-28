import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RankingBadge } from './RankingBadge';
import { AchievementBadges } from './AchievementBadges';
import type { User, TraderStats, UserAchievement } from '@shared/schema';

// Local type definition for LeaderboardEntry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: User;
  stats: TraderStats;
  change?: number;
  achievements?: UserAchievement[];
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
  sortable?: boolean;
}

type SortField = 'rank' | 'portfolioValue' | 'pnl' | 'winRate' | 'trades' | 'volume' | 'roi';
type SortDirection = 'asc' | 'desc';

export function LeaderboardTable({ entries, loading = false, sortable = true }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: num >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const formatLargeNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  const getPnLColor = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const handleSort = (field: SortField) => {
    if (!sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedEntries = () => {
    if (!sortable) return entries;

    return [...entries].sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortField) {
        case 'rank':
          aValue = a.rank;
          bValue = b.rank;
          break;
        case 'portfolioValue':
          aValue = parseFloat(a.stats.totalPortfolioValue || '0');
          bValue = parseFloat(b.stats.totalPortfolioValue || '0');
          break;
        case 'pnl':
          aValue = parseFloat(a.stats.totalPnL || '0');
          bValue = parseFloat(b.stats.totalPnL || '0');
          break;
        case 'winRate':
          aValue = parseFloat(a.stats.winRate || '0');
          bValue = parseFloat(b.stats.winRate || '0');
          break;
        case 'trades':
          aValue = a.stats.totalTrades || 0;
          bValue = b.stats.totalTrades || 0;
          break;
        case 'volume':
          aValue = parseFloat(a.stats.totalTradingVolume || '0');
          bValue = parseFloat(b.stats.totalTradingVolume || '0');
          break;
        case 'roi':
          aValue = parseFloat(a.stats.roiPercentage || '0');
          bValue = parseFloat(b.stats.roiPercentage || '0');
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (!sortable || sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-primary" />
      : <ArrowDown className="h-4 w-4 text-primary" />;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="text-center">
      {sortable ? (
        <Button
          variant="ghost"
          onClick={() => handleSort(field)}
          className="h-auto p-0 hover:bg-transparent font-semibold text-xs uppercase tracking-wide"
          data-testid={`sort-header-${field}`}
        >
          <div className="flex items-center gap-1">
            {children}
            {getSortIcon(field)}
          </div>
        </Button>
      ) : (
        <div className="font-semibold text-xs uppercase tracking-wide">{children}</div>
      )}
    </TableHead>
  );

  if (loading) {
    return (
      <div className="space-y-2" data-testid="leaderboard-table-loading">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const sortedEntries = getSortedEntries();

  return (
    <div className="overflow-x-auto" data-testid="leaderboard-table">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <SortableHeader field="rank">Rank</SortableHeader>
            <TableHead className="text-left">
              <div className="font-semibold text-xs uppercase tracking-wide">Trader</div>
            </TableHead>
            <SortableHeader field="portfolioValue">Portfolio Value</SortableHeader>
            <SortableHeader field="pnl">Total P&L</SortableHeader>
            <SortableHeader field="winRate">Win Rate</SortableHeader>
            <SortableHeader field="trades">Total Trades</SortableHeader>
            <SortableHeader field="roi">ROI</SortableHeader>
            <SortableHeader field="volume">Volume</SortableHeader>
            <TableHead className="text-center">
              <div className="font-semibold text-xs uppercase tracking-wide">Achievements</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => {
            const userInitials = entry.user.firstName && entry.user.lastName 
              ? `${entry.user.firstName[0]}${entry.user.lastName[0]}`
              : entry.user.email?.[0]?.toUpperCase() || 'U';

            return (
              <TableRow 
                key={entry.userId} 
                className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                data-testid={`leaderboard-row-${entry.userId}`}
              >
                <TableCell className="text-center">
                  <RankingBadge rank={entry.rank} change={entry.change} size="sm" />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {entry.user.firstName && entry.user.lastName 
                          ? `${entry.user.firstName} ${entry.user.lastName}` 
                          : entry.user.email?.split('@')[0] || 'Anonymous'
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.user.subscriptionTier || 'Free'} Trader
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center font-semibold">
                  {formatCurrency(entry.stats.totalPortfolioValue || 0)}
                </TableCell>
                
                <TableCell className={`text-center font-semibold ${getPnLColor(entry.stats.totalPnL || 0)}`}>
                  {formatCurrency(entry.stats.totalPnL || 0)}
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="font-semibold text-green-400">
                    {formatPercentage(entry.stats.winRate || 0)}
                  </span>
                </TableCell>
                
                <TableCell className="text-center font-semibold">
                  {formatLargeNumber(entry.stats.totalTrades || 0)}
                </TableCell>
                
                <TableCell className={`text-center font-semibold ${getPnLColor(entry.stats.roiPercentage || 0)}`}>
                  {formatPercentage(entry.stats.roiPercentage || 0)}
                </TableCell>
                
                <TableCell className="text-center font-semibold">
                  {formatCurrency(entry.stats.totalTradingVolume || 0)}
                </TableCell>
                
                <TableCell className="text-center">
                  {entry.achievements && entry.achievements.length > 0 ? (
                    <AchievementBadges achievements={entry.achievements} maxDisplay={2} showTooltips={false} />
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {sortedEntries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-lg mb-2">No traders found</div>
          <div className="text-sm">Be the first to start trading and appear on the leaderboard!</div>
        </div>
      )}
    </div>
  );
}