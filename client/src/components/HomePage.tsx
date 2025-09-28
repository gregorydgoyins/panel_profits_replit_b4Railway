import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, TrendingUp, Wallet, Trophy } from "lucide-react";

export function HomePage() {
  const { user } = useAuth();

  if (!user) {
    return null; // This should not happen as this component is only rendered when authenticated
  }

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Trader';
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'T';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'pro': return 'bg-gradient-to-r from-blue-400 to-purple-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12" data-testid="avatar-user">
                <AvatarImage src={user.profileImageUrl || undefined} alt={getDisplayName()} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold" data-testid="text-welcome">
                  Welcome back, {getDisplayName()}!
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`text-white ${getTierColor(user.subscriptionTier)}`}
                    data-testid="badge-subscription-tier"
                  >
                    {user.subscriptionTier.toUpperCase()}
                  </Badge>
                  <span className="text-muted-foreground text-sm" data-testid="text-subscription-status">
                    {user.subscriptionStatus}
                  </span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-trading-credits">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trading Credits</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-credits-remaining">
                {(user.monthlyTradingCredits || 0) - (user.usedTradingCredits || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                of {user.monthlyTradingCredits || 0} monthly credits
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-competition-wins">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Competition Wins</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-competition-wins">
                {user.competitionWins || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.competitionRanking ? `Rank #${user.competitionRanking}` : 'Unranked'}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-account-status">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500" data-testid="text-account-status">
                Active
              </div>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="h-20 flex-col space-y-2"
            variant="outline"
            data-testid="button-start-trading"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Start Trading</span>
          </Button>
          
          <Button 
            className="h-20 flex-col space-y-2"
            variant="outline"
            data-testid="button-view-portfolio"
          >
            <Wallet className="h-6 w-6" />
            <span>View Portfolio</span>
          </Button>
          
          <Button 
            className="h-20 flex-col space-y-2"
            variant="outline"
            data-testid="button-market-insights"
          >
            <Trophy className="h-6 w-6" />
            <span>Market Insights</span>
          </Button>
          
          <Button 
            className="h-20 flex-col space-y-2"
            variant="outline"
            data-testid="button-join-competition"
          >
            <Trophy className="h-6 w-6" />
            <span>Join Competition</span>
          </Button>
        </div>
      </div>
    </div>
  );
}