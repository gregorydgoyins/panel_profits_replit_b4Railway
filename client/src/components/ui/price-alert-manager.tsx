import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Plus, Edit3, Trash2, Bell, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Price Alert Manager Component
 * 
 * Comprehensive price alert management for Panel Profits:
 * - Create, edit, and delete price alerts
 * - Support for multiple alert types (price above/below, percentage change, volume spike)
 * - Alert status tracking and management
 * - Integration with real-time price monitoring
 */

const priceAlertSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  alertType: z.enum(['price_above', 'price_below', 'percent_change', 'volume_spike']),
  thresholdValue: z.string().min(1, 'Threshold value is required'),
  percentageThreshold: z.string().optional(),
  name: z.string().min(1, 'Alert name is required'),
  notes: z.string().optional(),
  cooldownMinutes: z.string().default('60'),
  isActive: z.boolean().default(true)
});

type PriceAlertFormData = z.infer<typeof priceAlertSchema>;

interface PriceAlert {
  id: string;
  userId: string;
  assetId: string;
  alertType: 'price_above' | 'price_below' | 'percent_change' | 'volume_spike';
  thresholdValue: string;
  percentageThreshold?: string;
  isActive: boolean;
  lastTriggeredPrice?: string;
  triggerCount: number;
  cooldownMinutes: number;
  name?: string;
  notes?: string;
  createdAt: string;
  triggeredAt?: string;
  lastCheckedAt: string;
  asset?: {
    id: string;
    symbol: string;
    name: string;
    imageUrl?: string;
  };
}

interface Asset {
  id: string;
  symbol: string;
  name: string;
  imageUrl?: string;
}

interface PriceAlertManagerProps {
  className?: string;
}

export function PriceAlertManager({ className }: PriceAlertManagerProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Fetch user's price alerts
  const { data: priceAlerts = [], isLoading: alertsLoading, error: alertsError } = useQuery({
    queryKey: ['/api/alerts/price'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch available assets for alert creation
  const { data: assets = [] } = useQuery({
    queryKey: ['/api/assets'],
  });

  // Form setup
  const form = useForm<PriceAlertFormData>({
    resolver: zodResolver(priceAlertSchema),
    defaultValues: {
      alertType: 'price_above',
      cooldownMinutes: '60',
      isActive: true
    }
  });

  // Create price alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (data: PriceAlertFormData) => {
      return await apiRequest('/api/alerts/price', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          thresholdValue: parseFloat(data.thresholdValue),
          percentageThreshold: data.percentageThreshold ? parseFloat(data.percentageThreshold) : undefined,
          cooldownMinutes: parseInt(data.cooldownMinutes)
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/price'] });
      setIsCreateDialogOpen(false);
      form.reset();
      setSelectedAsset(null);
      toast({
        title: 'Price Alert Created',
        description: 'Your price alert has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create price alert',
        variant: 'destructive',
      });
    }
  });

  // Update price alert mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PriceAlertFormData> }) => {
      return await apiRequest(`/api/alerts/price/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          thresholdValue: data.thresholdValue ? parseFloat(data.thresholdValue) : undefined,
          percentageThreshold: data.percentageThreshold ? parseFloat(data.percentageThreshold) : undefined,
          cooldownMinutes: data.cooldownMinutes ? parseInt(data.cooldownMinutes) : undefined
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/price'] });
      setEditingAlert(null);
      form.reset();
      setSelectedAsset(null);
      toast({
        title: 'Price Alert Updated',
        description: 'Your price alert has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update price alert',
        variant: 'destructive',
      });
    }
  });

  // Delete price alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return await apiRequest(`/api/alerts/price/${alertId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/price'] });
      toast({
        title: 'Price Alert Deleted',
        description: 'Your price alert has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete price alert',
        variant: 'destructive',
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: PriceAlertFormData) => {
    if (editingAlert) {
      updateAlertMutation.mutate({ id: editingAlert.id, data });
    } else {
      createAlertMutation.mutate(data);
    }
  };

  // Handle editing alert
  const handleEditAlert = (alert: PriceAlert) => {
    setEditingAlert(alert);
    setSelectedAsset(alert.asset || null);
    form.reset({
      assetId: alert.assetId,
      alertType: alert.alertType,
      thresholdValue: alert.thresholdValue,
      percentageThreshold: alert.percentageThreshold || '',
      name: alert.name || '',
      notes: alert.notes || '',
      cooldownMinutes: alert.cooldownMinutes.toString(),
      isActive: alert.isActive
    });
    setIsCreateDialogOpen(true);
  };

  // Handle deleting alert
  const handleDeleteAlert = (alertId: string) => {
    if (confirm('Are you sure you want to delete this price alert?')) {
      deleteAlertMutation.mutate(alertId);
    }
  };

  // Get alert type display info
  const getAlertTypeInfo = (alertType: string) => {
    switch (alertType) {
      case 'price_above':
        return { icon: TrendingUp, label: 'Price Above', color: 'text-green-500' };
      case 'price_below':
        return { icon: TrendingDown, label: 'Price Below', color: 'text-red-500' };
      case 'percent_change':
        return { icon: Activity, label: 'Percent Change', color: 'text-blue-500' };
      case 'volume_spike':
        return { icon: Activity, label: 'Volume Spike', color: 'text-purple-500' };
      default:
        return { icon: AlertTriangle, label: 'Unknown', color: 'text-gray-500' };
    }
  };

  // Get alert status badge
  const getStatusBadge = (alert: PriceAlert) => {
    if (!alert.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (alert.triggeredAt) {
      return <Badge variant="default">Triggered</Badge>;
    }
    return <Badge variant="outline">Active</Badge>;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-price-alerts-title">
            Price Alerts
          </h2>
          <p className="text-muted-foreground">
            Manage your price alerts to stay informed about market movements
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingAlert(null);
                form.reset();
                setSelectedAsset(null);
              }}
              data-testid="button-create-price-alert"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'Edit Price Alert' : 'Create Price Alert'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Asset Selection */}
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset</Label>
                <Select
                  value={form.watch('assetId')}
                  onValueChange={(value) => {
                    form.setValue('assetId', value);
                    const asset = assets.find((a: Asset) => a.id === value);
                    setSelectedAsset(asset || null);
                  }}
                >
                  <SelectTrigger data-testid="select-asset">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-48">
                      {assets.map((asset: Asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          <div className="flex items-center gap-2">
                            {asset.imageUrl && (
                              <img 
                                src={asset.imageUrl} 
                                alt={asset.name}
                                className="w-6 h-6 rounded object-cover"
                              />
                            )}
                            <span className="font-medium">{asset.symbol}</span>
                            <span className="text-muted-foreground">{asset.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                {form.formState.errors.assetId && (
                  <p className="text-sm text-destructive">{form.formState.errors.assetId.message}</p>
                )}
              </div>

              {/* Alert Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Alert Name</Label>
                <Input
                  {...form.register('name')}
                  placeholder="e.g., Spider-Man High Price Alert"
                  data-testid="input-alert-name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Alert Type */}
              <div className="space-y-2">
                <Label htmlFor="alertType">Alert Type</Label>
                <Select
                  value={form.watch('alertType')}
                  onValueChange={(value) => form.setValue('alertType', value as any)}
                >
                  <SelectTrigger data-testid="select-alert-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_above">Price Above Threshold</SelectItem>
                    <SelectItem value="price_below">Price Below Threshold</SelectItem>
                    <SelectItem value="percent_change">Percentage Change</SelectItem>
                    <SelectItem value="volume_spike">Volume Spike</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Threshold Value */}
              <div className="space-y-2">
                <Label htmlFor="thresholdValue">
                  {form.watch('alertType') === 'percent_change' ? 'Percentage Threshold' : 'Price Threshold'}
                </Label>
                <Input
                  {...form.register('thresholdValue')}
                  type="number"
                  step="0.01"
                  placeholder={form.watch('alertType') === 'percent_change' ? '5.0' : '100.00'}
                  data-testid="input-threshold-value"
                />
                {form.formState.errors.thresholdValue && (
                  <p className="text-sm text-destructive">{form.formState.errors.thresholdValue.message}</p>
                )}
              </div>

              {/* Cooldown Period */}
              <div className="space-y-2">
                <Label htmlFor="cooldownMinutes">Cooldown Period (minutes)</Label>
                <Input
                  {...form.register('cooldownMinutes')}
                  type="number"
                  min="1"
                  placeholder="60"
                  data-testid="input-cooldown-minutes"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum time between alert triggers
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  {...form.register('notes')}
                  placeholder="Add any additional notes about this alert..."
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  data-testid="switch-is-active"
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={createAlertMutation.isPending || updateAlertMutation.isPending}
                data-testid="button-submit-alert"
              >
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      <div className="grid gap-4">
        {alertsLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading price alerts...
          </div>
        ) : alertsError ? (
          <div className="text-center py-8 text-destructive">
            Failed to load price alerts
          </div>
        ) : priceAlerts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Price Alerts</h3>
              <p className="text-muted-foreground mb-4">
                Create your first price alert to get notified about market movements
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Price Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          priceAlerts.map((alert: PriceAlert) => {
            const typeInfo = getAlertTypeInfo(alert.alertType);
            const Icon = typeInfo.icon;

            return (
              <Card key={alert.id} data-testid={`price-alert-card-${alert.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className={`h-5 w-5 ${typeInfo.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-lg">
                            {alert.name || `${alert.asset?.symbol} Alert`}
                          </h3>
                          {getStatusBadge(alert)}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {alert.asset?.imageUrl && (
                            <img 
                              src={alert.asset.imageUrl} 
                              alt={alert.asset.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                          <span className="font-medium">{alert.asset?.symbol}</span>
                          <span className="text-muted-foreground">{alert.asset?.name}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {typeInfo.label}: ${parseFloat(alert.thresholdValue).toFixed(2)}
                          {alert.alertType === 'percent_change' && alert.percentageThreshold && 
                            ` (${alert.percentageThreshold}%)`
                          }
                        </p>
                        
                        {alert.notes && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.notes}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Triggered {alert.triggerCount} times</span>
                          <span>Cooldown: {alert.cooldownMinutes}m</span>
                          {alert.triggeredAt && (
                            <span>Last triggered: {new Date(alert.triggeredAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAlert(alert)}
                        data-testid={`button-edit-alert-${alert.id}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-alert-${alert.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}