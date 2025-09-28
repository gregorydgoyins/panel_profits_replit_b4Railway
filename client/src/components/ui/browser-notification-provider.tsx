import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Browser Notification Provider for Panel Profits
 * 
 * Handles browser notification permissions and provides a consistent
 * interface for requesting and managing browser notifications across the app
 */

// Extended notification options that includes custom click handler
interface ExtendedNotificationOptions extends Omit<NotificationOptions, 'onclick'> {
  onclick?: (event: Event) => void;
}

interface BrowserNotificationContextType {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: ExtendedNotificationOptions) => boolean;
  isEnabled: boolean;
}

const BrowserNotificationContext = createContext<BrowserNotificationContextType | undefined>(undefined);

interface BrowserNotificationProviderProps {
  children: ReactNode;
}

export function BrowserNotificationProvider({ children }: BrowserNotificationProviderProps) {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  // Check browser notification support and permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    } else {
      setIsSupported(false);
      console.warn('Browser notifications are not supported in this environment');
    }
  }, []);

  // Request notification permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      toast({
        title: 'Notifications Not Supported',
        description: 'Your browser does not support notifications',
        variant: 'destructive',
      });
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive browser notifications from Panel Profits',
        });
        
        // Show a welcome notification
        showNotification('Panel Profits Notifications', {
          body: 'Browser notifications are now enabled. You\'ll receive important trading alerts.',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'welcome-notification'
        });
      } else if (permission === 'denied') {
        toast({
          title: 'Notifications Denied',
          description: 'You can enable notifications in your browser settings',
          variant: 'destructive',
        });
      }
      
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Permission Error',
        description: 'Failed to request notification permission',
        variant: 'destructive',
      });
      return 'denied';
    }
  };

  // Show browser notification
  const showNotification = (title: string, options?: ExtendedNotificationOptions): boolean => {
    if (!isSupported) {
      console.warn('Browser notifications not supported');
      return false;
    }

    if (permission !== 'granted') {
      console.warn('Browser notification permission not granted');
      return false;
    }

    try {
      // Extract custom onclick handler and create standard NotificationOptions
      const { onclick: customOnclick, ...notificationOptions } = options || {};
      
      const defaultOptions: NotificationOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false,
        ...notificationOptions
      };

      const notification = new Notification(title, defaultOptions);
      
      // Auto-close notification after 5 seconds unless requireInteraction is true
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Handle notification click - focus the window
      notification.onclick = (event) => {
        window.focus();
        notification.close();
        
        // If a custom onclick handler was provided, call it
        if (customOnclick) {
          customOnclick(event);
        }
      };

      // Handle notification error
      notification.onerror = (error) => {
        console.error('Browser notification error:', error);
      };

      return true;
    } catch (error) {
      console.error('Error showing browser notification:', error);
      return false;
    }
  };

  const value: BrowserNotificationContextType = {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    isEnabled: isSupported && permission === 'granted'
  };

  return (
    <BrowserNotificationContext.Provider value={value}>
      {children}
    </BrowserNotificationContext.Provider>
  );
}

// Hook to use browser notifications
export function useBrowserNotifications() {
  const context = useContext(BrowserNotificationContext);
  if (context === undefined) {
    throw new Error('useBrowserNotifications must be used within a BrowserNotificationProvider');
  }
  return context;
}

// Helper functions for common notification types
export const browserNotificationHelpers = {
  // Order notifications
  orderFilled: (assetName: string, quantity: number, price: number) => {
    const context = useContext(BrowserNotificationContext);
    if (!context) return false;

    return context.showNotification('Order Filled - Panel Profits', {
      body: `Your order for ${quantity} shares of ${assetName} has been filled at $${price.toFixed(2)}`,
      tag: 'order-notification',
      requireInteraction: true,
      icon: '/favicon.ico'
    });
  },

  // Price alert notifications
  priceAlert: (assetName: string, currentPrice: number, threshold: number, direction: 'above' | 'below') => {
    const context = useContext(BrowserNotificationContext);
    if (!context) return false;

    return context.showNotification('Price Alert Triggered - Panel Profits', {
      body: `${assetName} is now $${currentPrice.toFixed(2)}, ${direction} your threshold of $${threshold.toFixed(2)}`,
      tag: 'price-alert',
      requireInteraction: true,
      icon: '/favicon.ico'
    });
  },

  // Market update notifications
  marketUpdate: (title: string, message: string, critical: boolean = false) => {
    const context = useContext(BrowserNotificationContext);
    if (!context) return false;

    return context.showNotification(`Market Update - Panel Profits`, {
      body: `${title}: ${message}`,
      tag: 'market-update',
      requireInteraction: critical,
      icon: '/favicon.ico'
    });
  },

  // Portfolio alerts
  portfolioAlert: (title: string, message: string, urgent: boolean = false) => {
    const context = useContext(BrowserNotificationContext);
    if (!context) return false;

    return context.showNotification(`Portfolio Alert - Panel Profits`, {
      body: `${title}: ${message}`,
      tag: 'portfolio-alert',
      requireInteraction: urgent,
      icon: '/favicon.ico'
    });
  }
};

export default BrowserNotificationProvider;