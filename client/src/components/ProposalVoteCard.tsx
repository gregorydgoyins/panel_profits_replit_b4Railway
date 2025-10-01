import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ThumbsUp, ThumbsDown, Minus, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Proposal {
  id: string;
  proposalType: string;
  assetId?: string;
  assetSymbol?: string;
  assetName?: string;
  quantity?: number;
  targetPrice?: string;
  rationale: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  votesNeeded: number;
  expiresAt?: string;
  proposerUsername: string;
  userVote?: string | null;
}

interface ProposalVoteCardProps {
  proposal: Proposal;
  clubId: string;
}

export function ProposalVoteCard({ proposal, clubId }: ProposalVoteCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const hasVoted = !!proposal.userVote;
  const isExpired = proposal.expiresAt && new Date(proposal.expiresAt) < new Date();
  const isClosed = proposal.status !== 'pending' || isExpired;

  const voteMutation = useMutation({
    mutationFn: async (vote: 'for' | 'against' | 'abstain') => {
      const res = await apiRequest('POST', `/api/investment-clubs/${clubId}/proposals/${proposal.id}/vote`, {
        vote,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investment-clubs', clubId] });
      toast({
        title: "Vote Recorded",
        description: "Your vote has been counted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Vote Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = () => {
    switch (proposal.status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-600">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'executed':
        return <Badge variant="default" className="bg-blue-600">Executed</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="secondary">{proposal.status}</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (proposal.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTimeRemaining = () => {
    if (!proposal.expiresAt) return null;
    const now = new Date();
    const expires = new Date(proposal.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <Card className="p-6" data-testid={`proposal-${proposal.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold font-serif capitalize">
              {proposal.proposalType.replace(/_/g, ' ')}
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground">
            Proposed by <span className="font-semibold">{proposal.proposerUsername}</span>
          </p>
        </div>
        {getStatusIcon()}
      </div>

      {(proposal.assetSymbol || proposal.assetName) && (
        <div className="mb-4 p-3 bg-muted rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Asset</p>
              <p className="font-semibold">{proposal.assetSymbol} - {proposal.assetName}</p>
            </div>
            {proposal.quantity && (
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold">{proposal.quantity}</p>
              </div>
            )}
            {proposal.targetPrice && (
              <div>
                <p className="text-sm text-muted-foreground">Target Price</p>
                <p className="font-semibold">${parseFloat(proposal.targetPrice).toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-1">Rationale</p>
        <p className="text-sm">{proposal.rationale}</p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Votes</span>
            <span className="text-sm font-medium" data-testid={`vote-count-${proposal.id}`}>
              {proposal.votesFor} For / {proposal.votesAgainst} Against
            </span>
          </div>
          <Progress value={forPercentage} className="h-2" data-testid={`vote-progress-${proposal.id}`} />
        </div>

        {proposal.expiresAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span data-testid={`time-remaining-${proposal.id}`}>{getTimeRemaining()}</span>
          </div>
        )}

        {hasVoted && (
          <div className="text-sm text-muted-foreground" data-testid={`user-vote-${proposal.id}`}>
            You voted: <span className="font-semibold capitalize">{proposal.userVote}</span>
          </div>
        )}

        {!isClosed && !hasVoted && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => voteMutation.mutate('for')}
              disabled={voteMutation.isPending}
              className="flex-1 gap-2"
              variant="default"
              data-testid={`button-vote-for-${proposal.id}`}
            >
              <ThumbsUp className="h-4 w-4" />
              For
            </Button>
            <Button
              onClick={() => voteMutation.mutate('against')}
              disabled={voteMutation.isPending}
              className="flex-1 gap-2"
              variant="destructive"
              data-testid={`button-vote-against-${proposal.id}`}
            >
              <ThumbsDown className="h-4 w-4" />
              Against
            </Button>
            <Button
              onClick={() => voteMutation.mutate('abstain')}
              disabled={voteMutation.isPending}
              className="flex-1 gap-2"
              variant="outline"
              data-testid={`button-vote-abstain-${proposal.id}`}
            >
              <Minus className="h-4 w-4" />
              Abstain
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
