import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProposalVoteCard } from '@/components/ProposalVoteCard';
import { CreateProposalModal } from '@/components/CreateProposalModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Plus, 
  FileText, Activity, Crown, Shield, User
} from 'lucide-react';
import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ClubDetail {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: string;
  totalValue: string;
  monthlyReturns: string[];
  createdAt: string;
  members: Array<{
    id: string;
    userId: string;
    username: string;
    role: string;
    sharePercentage: string;
    contributionAmount: string;
  }>;
  portfolio: {
    cashBalance: string;
    totalValue: string;
    holdings: Array<{
      assetId: string;
      assetName: string;
      symbol: string;
      quantity: number;
      averagePrice: string;
      currentPrice: string;
      totalValue: string;
    }>;
  };
  proposals: Array<any>;
  activities: Array<{
    id: string;
    actionType: string;
    userId: string;
    username: string;
    details: any;
    timestamp: string;
  }>;
}

export default function InvestmentClubDetailPage() {
  const [, params] = useRoute('/investment-clubs/:id');
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: club, isLoading } = useQuery<ClubDetail>({
    queryKey: ['/api/investment-clubs', params?.id],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-club-detail">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Club not found</p>
      </div>
    );
  }

  const isOwner = club.ownerId === user?.id;
  const latestReturn = club.monthlyReturns?.[club.monthlyReturns.length - 1] || '0';
  const isPositive = parseFloat(latestReturn) >= 0;

  const performanceChartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
    },
    title: {
      text: 'Monthly Returns',
      style: { color: '#9CA3AF' }
    },
    xAxis: {
      categories: club.monthlyReturns?.map((_, i) => `Month ${i + 1}`) || [],
      labels: { style: { color: '#9CA3AF' } }
    },
    yAxis: {
      title: { text: 'Return %', style: { color: '#9CA3AF' } },
      labels: { style: { color: '#9CA3AF' } }
    },
    series: [{
      type: 'line',
      name: 'Returns',
      data: club.monthlyReturns?.map(r => parseFloat(r)) || [],
      color: '#10B981'
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner': return <Badge variant="default" className="bg-yellow-600">Owner</Badge>;
      case 'admin': return <Badge variant="default" className="bg-blue-600">Admin</Badge>;
      default: return <Badge variant="secondary">Member</Badge>;
    }
  };

  return (
    <div className="space-y-6" data-testid="club-detail-page">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl  font-serif tracking-tight" data-testid="club-detail-name">
            {club.name}
          </h1>
          <p className="text-muted-foreground mt-1">{club.description}</p>
        </div>
        <Badge 
          variant={club.status === 'active' ? 'default' : 'secondary'}
          data-testid="club-detail-status"
        >
          {club.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl " data-testid="club-total-value">
                ${parseFloat(club.totalValue || '0').toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl " data-testid="club-member-count">
                {club.members?.length || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Return</p>
              <p className={`text-2xl  ${isPositive ? 'text-green-500' : 'text-red-500'}`} data-testid="club-monthly-return">
                {isPositive ? '+' : ''}{latestReturn}%
              </p>
            </div>
            {isPositive ? (
              <TrendingUp className="h-8 w-8 text-green-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500" />
            )}
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5" data-testid="club-tabs">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio" data-testid="tab-portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="proposals" data-testid="tab-proposals">Proposals</TabsTrigger>
          <TabsTrigger value="members" data-testid="tab-members">Members</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <HighchartsReact highcharts={Highcharts} options={performanceChartOptions} />
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg ">Cash Balance</h3>
              <p className="text-2xl " data-testid="club-cash-balance">
                ${parseFloat(club.portfolio?.cashBalance || '0').toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg  mb-4">Holdings</h3>
            <div className="space-y-2">
              {club.portfolio?.holdings?.map((holding) => (
                <div 
                  key={holding.assetId} 
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                  data-testid={`holding-${holding.assetId}`}
                >
                  <div>
                    <p className="">{holding.symbol}</p>
                    <p className="text-sm text-muted-foreground">{holding.assetName}</p>
                  </div>
                  <div className="text-right">
                    <p className="">{holding.quantity} shares</p>
                    <p className="text-sm text-muted-foreground">
                      ${parseFloat(holding.totalValue).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!club.portfolio?.holdings || club.portfolio.holdings.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No holdings yet</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowCreateProposal(true)} 
              className="gap-2"
              data-testid="button-create-proposal"
            >
              <Plus className="h-4 w-4" />
              Create Proposal
            </Button>
          </div>

          <div className="space-y-3">
            {club.proposals?.map((proposal) => (
              <ProposalVoteCard 
                key={proposal.id} 
                proposal={proposal} 
                clubId={club.id}
              />
            ))}
            {(!club.proposals || club.proposals.length === 0) && (
              <Card className="p-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No proposals yet</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg  mb-4">Club Members</h3>
            <div className="space-y-2">
              {club.members?.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                  data-testid={`member-${member.userId}`}
                >
                  <div className="flex items-center gap-3">
                    {getRoleIcon(member.role)}
                    <div>
                      <p className="">{member.username}</p>
                      {getRoleBadge(member.role)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="" data-testid={`member-share-${member.userId}`}>
                      {parseFloat(member.sharePercentage).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${parseFloat(member.contributionAmount || '0').toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg  mb-4">Activity Log</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {club.activities?.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex gap-3 pb-3 border-b border-border last:border-0"
                    data-testid={`activity-${activity.id}`}
                  >
                    <Activity className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="">{activity.username}</span>{' '}
                        {activity.actionType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!club.activities || club.activities.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">No activity yet</p>
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateProposalModal 
        open={showCreateProposal} 
        onClose={() => setShowCreateProposal(false)}
        clubId={club.id}
      />
    </div>
  );
}
