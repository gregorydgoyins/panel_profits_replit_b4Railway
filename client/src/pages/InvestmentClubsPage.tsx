import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateClubModal } from '@/components/CreateClubModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Users, TrendingUp, TrendingDown, DollarSign, Plus, AlertTriangle } from 'lucide-react';

interface InvestmentClub {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: string;
  totalValue: string;
  monthlyReturns: string[];
  memberCount: number;
  createdAt: string;
}

export default function InvestmentClubsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: clubs, isLoading } = useQuery<InvestmentClub[]>({
    queryKey: ['/api/investment-clubs'],
  });

  const { data: userSubscription } = useQuery<{ tier: string; status: string }>({
    queryKey: ['/api/user/subscription'],
  });

  const isOfficeManager = userSubscription?.tier === 'pro' || userSubscription?.tier === 'elite';

  const handleCreateClick = () => {
    if (!isOfficeManager) {
      toast({
        title: "Restricted Access",
        description: "Investment Clubs require Office Manager (Pro) tier or higher",
        variant: "destructive"
      });
      return;
    }
    setShowCreateModal(true);
  };

  const getLatestReturn = (monthlyReturns: string[]) => {
    if (!monthlyReturns || monthlyReturns.length === 0) return "0.00";
    return monthlyReturns[monthlyReturns.length - 1];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-clubs">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary rounded-full animate-spin border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading investment clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="investment-clubs-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl  font-serif tracking-tight">Investment Clubs</h1>
          <p className="text-muted-foreground mt-1">Collaborative trading syndicate operations</p>
        </div>
        <Button 
          onClick={handleCreateClick}
          className="gap-2"
          data-testid="button-create-club"
        >
          <Plus className="h-4 w-4" />
          Create New Club
        </Button>
      </div>

      {!isOfficeManager && (
        <Card className="p-4 border-l-4 border-l-warning bg-warning/10" data-testid="eligibility-warning">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className=" text-warning">Office Manager Access Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Investment Clubs are restricted to Office Manager (Pro) tier and above. 
                Upgrade your subscription to create and manage collaborative trading syndicates.
              </p>
            </div>
          </div>
        </Card>
      )}

      {clubs && clubs.length === 0 ? (
        <Card className="p-12" data-testid="empty-clubs">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg  mb-2">No Investment Clubs</h3>
            <p className="text-muted-foreground mb-4">
              You are not a member of any investment clubs. Create one to start collaborative trading.
            </p>
            <Button onClick={handleCreateClick} data-testid="button-create-first-club">
              Create Your First Club
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs?.map((club) => {
            const latestReturn = parseFloat(getLatestReturn(club.monthlyReturns));
            const isPositive = latestReturn >= 0;
            
            return (
              <Link key={club.id} href={`/investment-clubs/${club.id}`}>
                <Card 
                  className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                  data-testid={`club-card-${club.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg  font-serif mb-1" data-testid={`club-name-${club.id}`}>
                        {club.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {club.description}
                      </p>
                    </div>
                    <Badge 
                      variant={club.status === 'active' ? 'default' : 'secondary'}
                      data-testid={`club-status-${club.id}`}
                    >
                      {club.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span data-testid={`club-members-${club.id}`}>{club.memberCount} members</span>
                      </div>
                      <div className="text-sm " data-testid={`club-value-${club.id}`}>
                        ${parseFloat(club.totalValue || '0').toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Monthly Return</div>
                      <div className={`flex items-center gap-1  ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span data-testid={`club-return-${club.id}`}>
                          {isPositive ? '+' : ''}{latestReturn.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <CreateClubModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
