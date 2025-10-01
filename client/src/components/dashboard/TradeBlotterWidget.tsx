import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, ArrowUpRight, ArrowDownRight, Download, Filter,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Trade {
  id: string;
  timestamp: string;
  asset: string;
  assetType: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalValue: number;
  status: string;
  orderId: string;
}

export function TradeBlotterWidget() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('all');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('filled');
  const [sortBy, setSortBy] = useState<'date' | 'asset' | 'value'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  const pageSize = 20;

  const { data: orders = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Transform orders to trades
  const allTrades: Trade[] = useMemo(() => {
    return orders
      .filter((order: any) => order.status === 'filled' || order.status === 'executed')
      .map((order: any) => ({
        id: order.id,
        timestamp: order.executedAt || order.createdAt,
        asset: order.assetName || order.assetSymbol || 'Unknown',
        assetType: order.assetType || 'unknown',
        side: order.orderType?.toLowerCase() === 'sell' ? 'sell' : 'buy',
        quantity: parseFloat(order.quantity || '0'),
        price: parseFloat(order.price || '0'),
        totalValue: parseFloat(order.totalValue || '0'),
        status: order.status,
        orderId: order.id,
      }));
  }, [orders]);

  // Apply filters
  const filteredTrades = useMemo(() => {
    let filtered = [...allTrades];

    if (assetTypeFilter !== 'all') {
      filtered = filtered.filter(t => t.assetType === assetTypeFilter);
    }

    if (sideFilter !== 'all') {
      filtered = filtered.filter(t => t.side === sideFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'asset':
          return a.asset.localeCompare(b.asset);
        case 'value':
          return b.totalValue - a.totalValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTrades, assetTypeFilter, sideFilter, statusFilter, searchTerm, sortBy]);

  const paginatedTrades = filteredTrades.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredTrades.length / pageSize);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const headers = ['Date/Time', 'Asset', 'Side', 'Quantity', 'Price', 'Total Value', 'Status'];
    const rows = filteredTrades.map(t => [
      formatDateTime(t.timestamp),
      t.asset,
      t.side.toUpperCase(),
      t.quantity.toString(),
      t.price.toString(),
      t.totalValue.toString(),
      t.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-blotter-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="hover-elevate" data-testid="card-trade-blotter">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <CardTitle>Trade Blotter</CardTitle>
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
    <Card className="hover-elevate" data-testid="card-trade-blotter">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <CardTitle>Trade Blotter - Historical Log</CardTitle>
            <Badge variant="outline">{filteredTrades.length} trades</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              disabled={filteredTrades.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
          <Input
            placeholder="Search assets or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-trades"
          />
          <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
            <SelectTrigger data-testid="select-asset-type">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="character">Character</SelectItem>
              <SelectItem value="comic">Comic</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="publisher">Publisher</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sideFilter} onValueChange={setSideFilter}>
            <SelectTrigger data-testid="select-side">
              <SelectValue placeholder="Side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sides</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger data-testid="select-sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="asset">Sort by Asset</SelectItem>
              <SelectItem value="value">Sort by Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {paginatedTrades.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-trades">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Trades Found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || assetTypeFilter !== 'all' || sideFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Complete your first trade to see it here'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-trades">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="text-left p-2">Date/Time</th>
                    <th className="text-left p-2">Asset</th>
                    <th className="text-center p-2">Side</th>
                    <th className="text-right p-2">Quantity</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Total Value</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrades.map((trade) => (
                    <tr 
                      key={trade.id} 
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                      data-testid={`trade-row-${trade.id}`}
                    >
                      <td className="p-2 text-sm text-muted-foreground">
                        {formatDateTime(trade.timestamp)}
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-sm">{trade.asset}</div>
                          <div className="text-xs text-muted-foreground capitalize">{trade.assetType}</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        {trade.side === 'buy' ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500 flex items-center gap-1 justify-center w-20 mx-auto">
                            <ArrowDownRight className="w-3 h-3" />
                            BUY
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-500 flex items-center gap-1 justify-center w-20 mx-auto">
                            <ArrowUpRight className="w-3 h-3" />
                            SELL
                          </Badge>
                        )}
                      </td>
                      <td className="text-right p-2 text-sm">{trade.quantity}</td>
                      <td className="text-right p-2 text-sm">{formatCurrency(trade.price)}</td>
                      <td className="text-right p-2 text-sm font-medium">
                        {formatCurrency(trade.totalValue)}
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="outline" className="capitalize">
                          {trade.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, filteredTrades.length)} of {filteredTrades.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm" data-testid="text-page-info">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
