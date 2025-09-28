import { useEffect, useState } from 'react';
import { Toast, ToastAction, ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X,
  TrendingUp,
  Wallet,
  Activity,
  Bell
} from 'lucide-react';

/**
 * Toast Notification System for Panel Profits
 * 
 * Enhanced toast system with priority levels, notification types,
 * and integration with the notification center
 */

interface NotificationToast {
  id: string;
  type: 'order' | 'price_alert' | 'market_update' | 'portfolio' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastNotificationSystemProps {
  className?: string;
}

export function ToastNotificationSystem({ className }: ToastNotificationSystemProps) {
  const { toasts, toast, dismiss } = useToast();
  const [notificationQueue, setNotificationQueue] = useState<NotificationToast[]>([]);

  // Enhanced toast function for notifications
  const showNotificationToast = (notification: NotificationToast) => {
    const { type, priority, title, message, actionUrl, actionLabel, duration, persistent } = notification;
    
    // Determine toast styling based on priority
    const getToastVariant = (priority: string) => {
      switch (priority) {
        case 'critical':
          return 'destructive';
        case 'high':
          return 'default';
        case 'medium':
          return 'default';
        case 'low':
          return 'default';
        default:
          return 'default';
      }
    };

    // Get notification icon
    const getNotificationIcon = (type: string, priority: string) => {
      const iconProps = {
        className: `h-5 w-5 ${getIconColor(priority)}`
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
        case 'system':
          return priority === 'critical' ? <AlertCircle {...iconProps} /> : <Info {...iconProps} />;
        default:
          return <Bell {...iconProps} />;
      }
    };

    const getIconColor = (priority: string): string => {
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

    // Determine duration based on priority
    const getToastDuration = (): number => {
      if (persistent) return Infinity;
      if (duration) return duration;
      
      switch (priority) {
        case 'critical':
          return 10000; // 10 seconds
        case 'high':
          return 7000;  // 7 seconds
        case 'medium':
          return 5000;  // 5 seconds
        case 'low':
          return 3000;  // 3 seconds
        default:
          return 5000;
      }
    };

    // Create action if actionUrl is provided
    const toastAction = actionUrl ? (
      <ToastAction 
        altText={actionLabel || 'View Details'}
        onClick={() => {
          window.location.href = actionUrl;
        }}
      >
        {actionLabel || 'View'}
      </ToastAction>
    ) : undefined;

    // Show the toast
    toast({
      title: (
        <div className="flex items-center gap-2">
          {getNotificationIcon(type, priority)}
          <span>{title}</span>
        </div>
      ),
      description: message,
      action: toastAction,
      variant: getToastVariant(priority),
      duration: getToastDuration(),
    });

    // Play notification sound based on priority
    playNotificationSound(priority);

    // Trigger browser notification if page is not visible
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      showBrowserNotification(title, message, type, priority);
    }
  };

  // Play notification sound
  const playNotificationSound = (priority: string) => {
    // Only play sounds for medium and above priority
    if (priority === 'low') return;

    try {
      // Create audio context for notification sounds
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Different tones for different priorities
      const frequency = priority === 'critical' ? 800 : priority === 'high' ? 600 : 400;
      const duration = priority === 'critical' ? 300 : 200;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      // Silently fail if audio context is not available
      console.debug('Notification sound failed:', error);
    }
  };

  // Show browser notification
  const showBrowserNotification = (title: string, message: string, type: string, priority: string) => {
    try {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico', // Use app favicon
        badge: '/favicon.ico',
        tag: `notification-${type}`, // Prevent duplicate notifications
        requireInteraction: priority === 'critical', // Keep critical notifications visible
        silent: false,
      });

      // Auto-close non-critical notifications after 5 seconds
      if (priority !== 'critical') {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.debug('Browser notification failed:', error);
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Global notification handler - can be called from anywhere in the app
  useEffect(() => {
    // Attach notification handler to window for global access
    (window as any).showNotificationToast = showNotificationToast;
    
    return () => {
      delete (window as any).showNotificationToast;
    };
  }, []);

  return (
    <ToastProvider>
      <ToastViewport className={className} />
    </ToastProvider>
  );
}

// Helper function to show notification toasts from anywhere in the app
export const showNotification = (notification: Partial<NotificationToast> & { title: string; message: string }) => {
  const defaultNotification: NotificationToast = {
    id: Math.random().toString(36).substr(2, 9),
    type: 'system',
    priority: 'medium',
    title: notification.title,
    message: notification.message,
    duration: 5000,
    ...notification
  };

  if ((window as any).showNotificationToast) {
    (window as any).showNotificationToast(defaultNotification);
  }
};

// Predefined notification functions for common use cases
export const notificationHelpers = {
  orderFilled: (assetName: string, quantity: number, price: number) => {
    showNotification({
      type: 'order',
      priority: 'high',
      title: 'Order Filled',
      message: `Your order for ${quantity} shares of ${assetName} has been filled at $${price.toFixed(2)}`,
      actionUrl: '/trading',
      actionLabel: 'View Trading',
      duration: 7000
    });
  },

  priceAlert: (assetName: string, currentPrice: number, threshold: number, direction: 'above' | 'below') => {
    showNotification({
      type: 'price_alert',
      priority: 'medium',
      title: 'Price Alert Triggered',
      message: `${assetName} is now $${currentPrice.toFixed(2)}, ${direction} your threshold of $${threshold.toFixed(2)}`,
      actionUrl: '/trading',
      actionLabel: 'View Asset',
      duration: 6000
    });
  },

  marketUpdate: (title: string, message: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    showNotification({
      type: 'market_update',
      priority,
      title,
      message,
      actionUrl: '/news',
      actionLabel: 'Read More',
      duration: priority === 'critical' ? 10000 : 5000
    });
  },

  portfolioAlert: (title: string, message: string, urgent: boolean = false) => {
    showNotification({
      type: 'portfolio',
      priority: urgent ? 'high' : 'medium',
      title,
      message,
      actionUrl: '/portfolio',
      actionLabel: 'View Portfolio',
      duration: urgent ? 8000 : 5000
    });
  },

  systemMessage: (title: string, message: string, critical: boolean = false) => {
    showNotification({
      type: 'system',
      priority: critical ? 'critical' : 'medium',
      title,
      message,
      persistent: critical,
      duration: critical ? undefined : 5000
    });
  }
};

export default ToastNotificationSystem;