import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DollarSign, TrendingUp, Users, BookOpen, Layers, Calendar, Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface IncomeStream {
  id: string;
  sourceType: 'dividend' | 'bond_interest' | 'creator_royalty';
  assetName: string;
  assetType: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
  nextPaymentDate: string;
  annualYield: number;
}

export function CashFlowStatementWidget() {
  const { user } = useAuth();
  const [incomeTypeFilter, setIncomeTypeFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');

  const { data: userPortfolios } = useQuery<any[]>({
    queryKey: ['/api/portfolios', 'user', user?.id],
    enabled: !!user,
  });

  const defaultPortfolio = userPortfolios?.[0];

  const { data: holdings = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/portfolios', defaultPortfolio?.id, 'holdings'],
    enabled: !!defaultPortfolio?.id,
    refetchInterval: 30000,
  });

  // Generate income streams from holdings
  const allIncomeStreams: IncomeStream[] = useMemo(() => {
    const streams: IncomeStream[] = [];

    holdings.forEach((holding: any) => {
      const currentPrice = parseFloat(holding.currentPrice || '0');
      const quantity = parseFloat(holding.quantity || '0');
      
      // Character dividends (1-3% annual yield, paid quarterly)
      if (holding.assetType === 'character' && currentPrice > 0) {
        const annualYield = 0.015 + (Math.random() * 0.015); // 1.5% - 3%
        const quarterlyAmount = (currentPrice * quantity * annualYield) / 4;
        
        streams.push({
          id: `dividend-${holding.id}`,
          sourceType: 'dividend',
          assetName: holding.assetName || 'Unknown Character',
          assetType: holding.assetType,
          amount: quarterlyAmount,
          frequency: 'quarterly',
          nextPaymentDate: getNextQuarterlyDate(),
          annualYield: annualYield * 100,
        });
      }

      // Bond interest (publisher bonds, paid monthly)
      if (holding.assetType === 'publisher' && currentPrice > 0) {
        const annualYield = 0.04 + (Math.random() * 0.02); // 4% - 6%
        const monthlyAmount = (currentPrice * quantity * annualYield) / 12;
        
        streams.push({
          id: `bond-${holding.id}`,
          sourceType: 'bond_interest',
          assetName: holding.assetName || 'Unknown Publisher',
          assetType: holding.assetType,
          amount: monthlyAmount,
          frequency: 'monthly',
          nextPaymentDate: getNextMonthlyDate(),
          annualYield: annualYield * 100,
        });
      }

      // Creator royalties (paid annually)
      if (holding.assetType === 'creator' && currentPrice > 0) {
        const annualYield = 0.05 + (Math.random() * 0.03); // 5% - 8%
        const annualAmount = currentPrice * quantity * annualYield;
        
        streams.push({
          id: `royalty-${holding.id}`,
          sourceType: 'creator_royalty',
          assetName: holding.assetName || 'Unknown Creator',
          assetType: holding.assetType,
          amount: annualAmount,
          frequency: 'annual',
          nextPaymentDate: getNextAnnualDate(),
          annualYield: annualYield * 100,
        });
      }
    });

    return streams;
  }, [holdings]);

  // Apply filters
  const filteredStreams = useMemo(() => {
    let filtered = [...allIncomeStreams];

    if (incomeTypeFilter !== 'all') {
      filtered = filtered.filter(s => s.sourceType === incomeTypeFilter);
    }

    if (assetFilter !== 'all') {
      filtered = filtered.filter(s => s.assetType === assetFilter);
    }

    // Sort by next payment date
    filtered.sort((a, b) => 
      new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
    );

    return filtered;
  }, [allIncomeStreams, incomeTypeFilter, assetFilter]);

  // Calculate summaries
  const totalMonthlyIncome = useMemo(() => {
    return allIncomeStreams.reduce((sum, stream) => {
      if (stream.frequency === 'monthly') return sum + stream.amount;
      if (stream.frequency === 'quarterly') return sum + (stream.amount / 3);
      if (stream.frequency === 'annual') return sum + (stream.amount / 12);
      return sum;
    }, 0);
  }, [allIncomeStreams]);

  const totalAnnualIncome = totalMonthlyIncome * 12;
  const averageYield = allIncomeStreams.length > 0
    ? allIncomeStreams.reduce((sum, s) => sum + s.annualYield, 0) / allIncomeStreams.length
    : 0;

  function getNextMonthlyDate(): string {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return next.toISOString();
  }

  function getNextQuarterlyDate(): string {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const nextQuarter = (currentQuarter + 1) % 4;
    const year = nextQuarter === 0 ? now.getFullYear() + 1 : now.getFullYear();
    const month = nextQuarter * 3;
    return new Date(year, month, 1).toISOString();
  }

  function getNextAnnualDate(): string {
    const now = new Date();
    return new Date(now.getFullYear() + 1, 0, 1).toISOString();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'dividend': return <Users className="w-4 h-4" />;
      case 'bond_interest': return <BookOpen className="w-4 h-4" />;
      case 'creator_royalty': return <Layers className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'dividend': return 'bg-blue-500/10 text-blue-500';
      case 'bond_interest': return 'bg-green-500/10 text-green-500';
      case 'creator_royalty': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getSourceLabel = (type: string) => {
    switch (type) {
      case 'dividend': return 'Dividend';
      case 'bond_interest': return 'Bond Interest';
      case 'creator_royalty': return 'Royalty';
      default: return type;
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'annual': return 'Annual';
      default: return freq;
    }
  };

  if (isLoading) {
    return (
      <Card className="hover-elevate" data-testid="card-cashflow-statement">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <CardTitle>Cash Flow Statement</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate" data-testid="card-cashflow-statement">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <CardTitle>Cash Flow Statement - Income Tracking</CardTitle>
            <Badge variant="outline">{filteredStreams.length} streams</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={incomeTypeFilter} onValueChange={setIncomeTypeFilter}>
              <SelectTrigger className="w-40" data-testid="select-income-type">
                <SelectValue placeholder="Income Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dividend">Dividends</SelectItem>
                <SelectItem value="bond_interest">Bond Interest</SelectItem>
                <SelectItem value="creator_royalty">Royalties</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assetFilter} onValueChange={setAssetFilter}>
              <SelectTrigger className="w-40" data-testid="select-asset-filter">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="character">Characters</SelectItem>
                <SelectItem value="creator">Creators</SelectItem>
                <SelectItem value="publisher">Publishers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <p className="text-lg  text-green-500" data-testid="text-monthly-income">
              {formatCurrency(totalMonthlyIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Income</p>
            <p className="text-lg  text-green-500" data-testid="text-annual-income">
              {formatCurrency(totalAnnualIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Yield</p>
            <p className="text-lg " data-testid="text-average-yield">
              {averageYield.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredStreams.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-income-streams">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg  mb-2">No Income Streams</h3>
            <p className="text-sm text-muted-foreground">
              {incomeTypeFilter !== 'all' || assetFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Hold income-generating assets to see cash flows here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-testid="income-streams">
            {filteredStreams.map((stream) => (
              <div 
                key={stream.id} 
                className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors"
                data-testid={`income-stream-${stream.id}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded ${getSourceColor(stream.sourceType)}`}>
                    {getSourceIcon(stream.sourceType)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className=" text-sm">{stream.assetName}</span>
                      <Badge className={`text-xs ${getSourceColor(stream.sourceType)}`}>
                        {getSourceLabel(stream.sourceType)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {getFrequencyLabel(stream.frequency)}
                      </span>
                      <span>Next: {formatDate(stream.nextPaymentDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className=" text-sm text-green-500">
                    {formatCurrency(stream.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stream.annualYield.toFixed(2)}% yield
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Preview */}
        {filteredStreams.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm  mb-3">Upcoming Payments</h4>
            <div className="space-y-2">
              {filteredStreams.slice(0, 5).map((stream) => (
                <div key={`timeline-${stream.id}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getSourceColor(stream.sourceType)}`} />
                    <span className="text-muted-foreground">{formatDate(stream.nextPaymentDate)}</span>
                    <span className="">{stream.assetName}</span>
                  </div>
                  <span className=" text-green-500">{formatCurrency(stream.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
