import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Search, Filter, TrendingUp, TrendingDown, X, 
  CheckCircle, AlertCircle, Loader2, DollarSign, Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface Order {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  quantity: string;
  price?: string;
  totalValue?: string;
  status: 'pending' | 'filled' | 'cancelled' | 'partially_filled';
  filledQuantity?: string;
  averageFillPrice?: string;
  fees?: string;
  rejectionReason?: string;
  filledAt?: string;
  createdAt: string;
  // Joined asset data
  asset?: {
    symbol: string;
    name: string;
    imageUrl?: string;
  };
}

interface OrderHistoryProps {
  refreshTrigger?: number;
  userId?: string;
}

export function OrderHistory({ refreshTrigger, userId }: OrderHistoryProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch user's orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: `/api/orders/user/${userId || user?.id}`,
    enabled: !!(userId || user?.id),
    refetchInterval: activeTab === 'pending' ? 10000 : 30000, // More frequent updates for pending orders
  });

  // Refresh orders when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Order Cancelled',
        description: 'Order has been successfully cancelled',
      });
      const currentUserId = userId || user?.id;
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: `/api/orders/user/${currentUserId}` });
        queryClient.invalidateQueries({ queryKey: `/api/portfolios/user/${currentUserId}` });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel order',
        variant: 'destructive',
      });
    },
  });

  // Filter orders based on active tab and filters
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    let filtered = orders;

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter((order: Order) => order.status === 'pending' || order.status === 'partially_filled');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter((order: Order) => order.status === 'filled');
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter((order: Order) => order.status === 'cancelled');
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order: Order) => order.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((order: Order) => order.type === typeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((order: Order) => 
        order.asset?.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.asset?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, activeTab, statusFilter, typeFilter, searchTerm]);

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'filled':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Filled</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'partially_filled':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1" />Partial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    return type === 'buy' ? (
      <Badge variant="default" className="bg-green-600">
        <TrendingUp className="h-3 w-3 mr-1" />Buy
      </Badge>
    ) : (
      <Badge variant="secondary">
        <TrendingDown className="h-3 w-3 mr-1" />Sell
      </Badge>
    );
  };

  // Calculate profit/loss for completed trades
  const calculateProfitLoss = (order: Order) => {
    if (order.status !== 'filled' || !order.averageFillPrice || !order.price) return null;
    
    const fillPrice = parseFloat(order.averageFillPrice);
    const orderPrice = parseFloat(order.price);
    const quantity = parseFloat(order.filledQuantity || order.quantity);
    
    const difference = order.type === 'buy' ? fillPrice - orderPrice : orderPrice - fillPrice;
    const profitLoss = difference * quantity;
    
    return profitLoss;
  };

  const handleCancelOrder = (orderId: string) => {
    cancelOrderMutation.mutate(orderId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Order History
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh-orders">
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters and Search */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by asset, symbol, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-orders"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="partially_filled">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]" data-testid="select-type-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Order Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" data-testid="tab-all-orders">All Orders</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending-orders">Pending</TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-orders">Completed</TabsTrigger>
            <TabsTrigger value="cancelled" data-testid="tab-cancelled-orders">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No ${activeTab} orders found.`}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: Order) => {
                      const profitLoss = calculateProfitLoss(order);
                      
                      return (
                        <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {order.asset?.imageUrl && (
                                <img 
                                  src={order.asset.imageUrl} 
                                  alt={order.asset.symbol}
                                  className="h-8 w-8 rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{order.asset?.symbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  {order.asset?.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(order.type)}
                            <div className="text-xs text-muted-foreground mt-1 capitalize">
                              {order.orderType}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                            {order.rejectionReason && (
                              <div className="text-xs text-destructive mt-1">
                                {order.rejectionReason}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              {order.status === 'partially_filled' ? (
                                <span>
                                  {parseFloat(order.filledQuantity || '0')} / {parseFloat(order.quantity)}
                                </span>
                              ) : (
                                parseFloat(order.quantity)
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {order.averageFillPrice ? (
                                <span>${parseFloat(order.averageFillPrice).toFixed(2)}</span>
                              ) : order.price ? (
                                <span>${parseFloat(order.price).toFixed(2)}</span>
                              ) : (
                                <span className="text-muted-foreground">Market</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {order.totalValue && (
                                <span>${parseFloat(order.totalValue).toFixed(2)}</span>
                              )}
                              {order.fees && parseFloat(order.fees) > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Fees: ${parseFloat(order.fees).toFixed(2)}
                                </div>
                              )}
                              {profitLoss !== null && (
                                <div className={`text-xs ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  P&L: {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">
                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(order.createdAt), 'HH:mm:ss')}
                              </div>
                              {order.filledAt && (
                                <div className="text-xs text-green-600">
                                  Filled: {format(new Date(order.filledAt), 'HH:mm:ss')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(order.status === 'pending' || order.status === 'partially_filled') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancelOrderMutation.isPending}
                                data-testid={`button-cancel-${order.id}`}
                              >
                                {cancelOrderMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}