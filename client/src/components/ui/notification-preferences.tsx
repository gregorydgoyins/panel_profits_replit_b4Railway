import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Moon,
  Settings,
  Save,
  AlertTriangle,
  Activity,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Notification Preferences Component
 * 
 * Comprehensive notification settings for Panel Profits:
 * - Notification type preferences (order, price, market, portfolio)
 * - Delivery method settings (toast, email, push, sound)
 * - Priority level filtering
 * - Quiet hours configuration
 * - Advanced notification management settings
 */

const notificationPreferencesSchema = z.object({
  // Notification type preferences
  orderNotifications: z.boolean().default(true),
  priceAlerts: z.boolean().default(true),
  marketUpdates: z.boolean().default(true),
  portfolioAlerts: z.boolean().default(true),
  
  // Delivery method preferences
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  toastNotifications: z.boolean().default(true),
  
  // Priority filtering
  lowPriorityEnabled: z.boolean().default(true),
  mediumPriorityEnabled: z.boolean().default(true),
  highPriorityEnabled: z.boolean().default(true),
  criticalPriorityEnabled: z.boolean().default(true),
  
  // Quiet hours settings
  quietHoursEnabled: z.boolean().default(false),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  quietHoursTimezone: z.string().default('UTC'),
  
  // Advanced preferences
  groupSimilarNotifications: z.boolean().default(true),
  maxDailyNotifications: z.number().min(1).max(500).default(50),
  soundEnabled: z.boolean().default(true),
  vibrationEnabled: z.boolean().default(true)
});

type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;

interface NotificationPreferences extends NotificationPreferencesFormData {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationPreferencesProps {
  className?: string;
}

export function NotificationPreferences({ className }: NotificationPreferencesProps) {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>('default');

  // Fetch notification preferences
  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['/api/notifications/preferences'],
  });

  // Form setup
  const form = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      orderNotifications: true,
      priceAlerts: true,
      marketUpdates: true,
      portfolioAlerts: true,
      emailNotifications: false,
      pushNotifications: true,
      toastNotifications: true,
      lowPriorityEnabled: true,
      mediumPriorityEnabled: true,
      highPriorityEnabled: true,
      criticalPriorityEnabled: true,
      quietHoursEnabled: false,
      quietHoursTimezone: 'UTC',
      groupSimilarNotifications: true,
      maxDailyNotifications: 50,
      soundEnabled: true,
      vibrationEnabled: true
    }
  });

  // Update form when preferences are loaded
  useEffect(() => {
    if (preferences) {
      form.reset(preferences);
    }
  }, [preferences, form]);

  // Check browser notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setBrowserNotificationPermission(Notification.permission);
    }
  }, []);

  // Watch form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: NotificationPreferencesFormData) => {
      return await apiRequest('/api/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/preferences'] });
      setHasChanges(false);
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update notification preferences',
        variant: 'destructive',
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: NotificationPreferencesFormData) => {
    updatePreferencesMutation.mutate(data);
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive browser notifications',
        });
      } else {
        toast({
          title: 'Notifications Disabled',
          description: 'Browser notifications are disabled',
          variant: 'destructive',
        });
      }
    }
  };

  // Test notification
  const sendTestNotification = () => {
    toast({
      title: 'Test Notification',
      description: 'This is a test notification to preview your settings',
    });

    // Also send browser notification if enabled
    if (form.watch('pushNotifications') && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Panel Profits Test', {
        body: 'This is a test notification to preview your settings',
        icon: '/favicon.ico'
      });
    }
  };

  // Generate time options for quiet hours
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading notification preferences...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load notification preferences
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-notification-preferences-title">
            Notification Preferences
          </h2>
          <p className="text-muted-foreground">
            Customize how and when you receive notifications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={sendTestNotification}
            data-testid="button-test-notification"
          >
            <Bell className="h-4 w-4 mr-2" />
            Test Notification
          </Button>
          
          {hasChanges && (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="button-save-preferences"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <Label htmlFor="orderNotifications" className="font-medium">
                    Order Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your orders are filled, cancelled, or updated
                  </p>
                </div>
              </div>
              <Switch
                id="orderNotifications"
                checked={form.watch('orderNotifications')}
                onCheckedChange={(checked) => form.setValue('orderNotifications', checked)}
                data-testid="switch-order-notifications"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <Label htmlFor="priceAlerts" className="font-medium">
                    Price Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when price alerts are triggered
                  </p>
                </div>
              </div>
              <Switch
                id="priceAlerts"
                checked={form.watch('priceAlerts')}
                onCheckedChange={(checked) => form.setValue('priceAlerts', checked)}
                data-testid="switch-price-alerts"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <Label htmlFor="marketUpdates" className="font-medium">
                    Market Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Breaking news and important market movements
                  </p>
                </div>
              </div>
              <Switch
                id="marketUpdates"
                checked={form.watch('marketUpdates')}
                onCheckedChange={(checked) => form.setValue('marketUpdates', checked)}
                data-testid="switch-market-updates"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-purple-500" />
                <div>
                  <Label htmlFor="portfolioAlerts" className="font-medium">
                    Portfolio Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Performance updates and portfolio risk alerts
                  </p>
                </div>
              </div>
              <Switch
                id="portfolioAlerts"
                checked={form.watch('portfolioAlerts')}
                onCheckedChange={(checked) => form.setValue('portfolioAlerts', checked)}
                data-testid="switch-portfolio-alerts"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Delivery Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <div>
                  <Label htmlFor="toastNotifications" className="font-medium">
                    Toast Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications in the app interface
                  </p>
                </div>
              </div>
              <Switch
                id="toastNotifications"
                checked={form.watch('toastNotifications')}
                onCheckedChange={(checked) => form.setValue('toastNotifications', checked)}
                data-testid="switch-toast-notifications"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <div>
                  <Label htmlFor="pushNotifications" className="font-medium">
                    Browser Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications even when the tab is not active
                  </p>
                  {browserNotificationPermission === 'denied' && (
                    <Badge variant="destructive" className="mt-1">
                      Permission Denied
                    </Badge>
                  )}
                  {browserNotificationPermission === 'default' && (
                    <Badge variant="secondary" className="mt-1">
                      Permission Required
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {browserNotificationPermission !== 'granted' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={requestNotificationPermission}
                    data-testid="button-request-permission"
                  >
                    Enable
                  </Button>
                )}
                <Switch
                  id="pushNotifications"
                  checked={form.watch('pushNotifications') && browserNotificationPermission === 'granted'}
                  onCheckedChange={(checked) => form.setValue('pushNotifications', checked)}
                  disabled={browserNotificationPermission !== 'granted'}
                  data-testid="switch-push-notifications"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send critical notifications via email
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={form.watch('emailNotifications')}
                onCheckedChange={(checked) => form.setValue('emailNotifications', checked)}
                data-testid="switch-email-notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* Priority Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="criticalPriorityEnabled" className="font-medium text-red-500">
                  Critical
                </Label>
                <Switch
                  id="criticalPriorityEnabled"
                  checked={form.watch('criticalPriorityEnabled')}
                  onCheckedChange={(checked) => form.setValue('criticalPriorityEnabled', checked)}
                  data-testid="switch-critical-priority"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="highPriorityEnabled" className="font-medium text-orange-500">
                  High
                </Label>
                <Switch
                  id="highPriorityEnabled"
                  checked={form.watch('highPriorityEnabled')}
                  onCheckedChange={(checked) => form.setValue('highPriorityEnabled', checked)}
                  data-testid="switch-high-priority"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="mediumPriorityEnabled" className="font-medium text-blue-500">
                  Medium
                </Label>
                <Switch
                  id="mediumPriorityEnabled"
                  checked={form.watch('mediumPriorityEnabled')}
                  onCheckedChange={(checked) => form.setValue('mediumPriorityEnabled', checked)}
                  data-testid="switch-medium-priority"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowPriorityEnabled" className="font-medium text-gray-500">
                  Low
                </Label>
                <Switch
                  id="lowPriorityEnabled"
                  checked={form.watch('lowPriorityEnabled')}
                  onCheckedChange={(checked) => form.setValue('lowPriorityEnabled', checked)}
                  data-testid="switch-low-priority"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Quiet Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quietHoursEnabled" className="font-medium">
                  Enable Quiet Hours
                </Label>
                <p className="text-sm text-muted-foreground">
                  Suppress non-critical notifications during specified hours
                </p>
              </div>
              <Switch
                id="quietHoursEnabled"
                checked={form.watch('quietHoursEnabled')}
                onCheckedChange={(checked) => form.setValue('quietHoursEnabled', checked)}
                data-testid="switch-quiet-hours"
              />
            </div>

            {form.watch('quietHoursEnabled') && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quietHoursStart">Start Time</Label>
                    <Select
                      value={form.watch('quietHoursStart') || '22:00'}
                      onValueChange={(value) => form.setValue('quietHoursStart', value)}
                    >
                      <SelectTrigger data-testid="select-quiet-hours-start">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quietHoursEnd">End Time</Label>
                    <Select
                      value={form.watch('quietHoursEnd') || '08:00'}
                      onValueChange={(value) => form.setValue('quietHoursEnd', value)}
                    >
                      <SelectTrigger data-testid="select-quiet-hours-end">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="soundEnabled" className="font-medium">
                  Notification Sounds
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for notifications
                </p>
              </div>
              <Switch
                id="soundEnabled"
                checked={form.watch('soundEnabled')}
                onCheckedChange={(checked) => form.setValue('soundEnabled', checked)}
                data-testid="switch-sound-enabled"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="groupSimilarNotifications" className="font-medium">
                  Group Similar Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Combine similar notifications to reduce clutter
                </p>
              </div>
              <Switch
                id="groupSimilarNotifications"
                checked={form.watch('groupSimilarNotifications')}
                onCheckedChange={(checked) => form.setValue('groupSimilarNotifications', checked)}
                data-testid="switch-group-notifications"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="maxDailyNotifications">
                Maximum Daily Notifications
              </Label>
              <Input
                type="number"
                min="1"
                max="500"
                value={form.watch('maxDailyNotifications')}
                onChange={(e) => form.setValue('maxDailyNotifications', parseInt(e.target.value) || 50)}
                data-testid="input-max-daily-notifications"
              />
              <p className="text-sm text-muted-foreground">
                Limit the number of notifications per day to prevent overload
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updatePreferencesMutation.isPending}
              data-testid="button-save-preferences-bottom"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}