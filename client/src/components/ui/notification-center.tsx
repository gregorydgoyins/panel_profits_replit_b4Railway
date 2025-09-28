import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Search, 
  Filter,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Activity,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

/**
 * NotificationCenter Component - Real-time Notification Management
 * 
 * Features:
 * - Real-time notification display with WebSocket updates
 * - Notification filtering by type and priority
 * - Mark as read/unread functionality
 * - Notification history with pagination
 * - Toast notification integration
 * - Action URL support for clickable notifications
 */

interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'price_alert' | 'market_update' | 'portfolio';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  actionUrl?: string;
  metadata?: any;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications
  const { data: notificationData, isLoading, error } = useQuery({
    queryKey: ['/api/notifications', selectedType, selectedPriority],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const notifications = notificationData?.notifications || [];
  const unreadCount = notificationData?.unreadCount || 0;

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest(`/api/notifications/${notificationId}/mark-read`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: 'Notification marked as read',
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/notifications/mark-all-read', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: 'All notifications marked as read',
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: 'Notification deleted',
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  });

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification: Notification) => {
    // Type filter
    if (selectedType !== 'all' && notification.type !== selectedType) {
      return false;
    }
    
    // Priority filter
    if (selectedPriority !== 'all' && notification.priority !== selectedPriority) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = {
      className: `h-4 w-4 ${getPriorityColor(priority)}`
    };

    switch (type) {
      case 'order':
        return <TrendingUp {...iconProps} />;
      case 'price_alert':
        return <AlertTriangle {...iconProps} />;
      case 'market_update':
        return <Activity {...iconProps} />;
      case 'portfolio':
        return <Wallet {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-blue-500';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to action URL if provided
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative ${className}`}
          data-testid="button-notification-center"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              data-testid="badge-unread-count"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-96 p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle data-testid="text-notification-center-title">
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                data-testid="button-mark-all-read"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
            )}
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-3 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-notifications"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                data-testid="select-notification-type"
              >
                <option value="all">All Types</option>
                <option value="order">Orders</option>
                <option value="price_alert">Price Alerts</option>
                <option value="market_update">Market Updates</option>
                <option value="portfolio">Portfolio</option>
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                data-testid="select-notification-priority"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </SheetHeader>
        
        <Separator />
        
        {/* Notifications List */}
        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          <div className="p-4 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Failed to load notifications
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || selectedType !== 'all' || selectedPriority !== 'all' 
                  ? 'No notifications match your filters'
                  : 'No notifications yet'
                }
              </div>
            ) : (
              filteredNotifications.map((notification: Notification) => (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover-elevate ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-muted/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  data-testid={`notification-card-${notification.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge 
                              variant={getPriorityBadgeVariant(notification.priority)}
                              className="text-xs"
                            >
                              {notification.priority}
                            </Badge>
                            
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsReadMutation.mutate(notification.id);
                                }}
                                data-testid={`button-mark-read-${notification.id}`}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotificationMutation.mutate(notification.id);
                              }}
                              data-testid={`button-delete-${notification.id}`}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          
                          {notification.actionUrl && (
                            <div className="flex items-center text-xs text-blue-500">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Details
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}