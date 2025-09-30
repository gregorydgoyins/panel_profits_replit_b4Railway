import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserNotificationProvider } from '@/components/ui/browser-notification-provider';
import { ToastNotificationSystem } from '@/components/ui/toast-notification-system';
import { useToast } from '@/hooks/use-toast';

/**
 * Comprehensive Notification System Provider for Panel Profits
 * 
 * This provider combines all notification components and services:
 * - Browser notification permissions and management
 * - Toast notification system with priority levels
 * - WebSocket real-time notification integration
 * - Notification preferences and settings
 * - Real-time notification feed and management
 */

interface NotificationSystemProviderProps {
  children: ReactNode;
}

export function NotificationSystemProvider({ children }: NotificationSystemProviderProps) {
  const { toast } = useToast();
  const [wsConnected, setWsConnected] = useState(false);
  const [notificationWs, setNotificationWs] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection for real-time notifications
  useEffect(() => {
    console.log('🔔 Initializing notification system...');
    
    // Get current user for WebSocket authentication
    const initializeNotificationWebSocket = async () => {
      try {
        // Get current user to authenticate WebSocket connection
        const userResponse = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          console.warn('User not authenticated, skipping notification WebSocket');
          return;
        }
        
        const user = await userResponse.json();
        if (!user?.id) {
          console.warn('No user ID found, skipping notification WebSocket');
          return;
        }

        // Create WebSocket connection for notifications
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/notifications?userId=${user.id}`;
        
        console.log('🔌 Connecting to notification WebSocket:', wsUrl);
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('✅ Notification WebSocket connected');
          setWsConnected(true);
          setNotificationWs(ws);
          
          // Send initial ping
          ws.send(JSON.stringify({ type: 'ping' }));
        };
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleNotificationMessage(message);
          } catch (error) {
            console.error('Error parsing notification WebSocket message:', error);
          }
        };
        
        ws.onclose = (event) => {
          console.log('📡 Notification WebSocket disconnected:', event.code, event.reason);
          setWsConnected(false);
          setNotificationWs(null);
          
          // Attempt to reconnect after 5 seconds if not intentional
          if (event.code !== 1000) {
            setTimeout(() => {
              console.log('🔄 Attempting to reconnect notification WebSocket...');
              initializeNotificationWebSocket();
            }, 5000);
          }
        };
        
        ws.onerror = (error) => {
          console.error('❌ Notification WebSocket error:', error);
          setWsConnected(false);
        };
        
        // Store WebSocket for cleanup
        return ws;
        
      } catch (error) {
        console.error('❌ Failed to initialize notification WebSocket:', error);
      }
    };

    // TEMPORARILY DISABLED: WebSocket notifications causing connection errors
    // Will re-enable after fixing server-side WebSocket handler
    // const ws = initializeNotificationWebSocket();
    
    // Cleanup on unmount
    return () => {
      // if (ws instanceof Promise) {
      //   ws.then(socket => socket?.close());
      // } else if (notificationWs) {
      //   notificationWs.close(1000, 'Component unmounting');
      // }
    };
  }, []);

  // Handle incoming notification messages
  const handleNotificationMessage = (message: any) => {
    console.log('📥 Received notification message:', message.type);
    
    switch (message.type) {
      case 'connection_confirmed':
        console.log('✅ Notification WebSocket connection confirmed for user:', message.data.userId);
        toast({
          title: 'Real-time Notifications Active',
          description: 'You will receive instant notifications for trading activity',
        });
        break;
        
      case 'notification':
        handleIncomingNotification(message.data);
        break;
        
      case 'notification_read':
        console.log('📖 Notification marked as read:', message.data.notificationId);
        break;
        
      case 'all_notifications_read':
        console.log('📚 All notifications marked as read');
        break;
        
      case 'pong':
        // Heartbeat response
        break;
        
      default:
        console.log('🔔 Unknown notification message type:', message.type);
    }
  };

  // Handle incoming real-time notifications
  const handleIncomingNotification = (notification: any) => {
    console.log('🔔 Processing incoming notification:', notification);
    
    // Show toast notification using global notification helper
    if ((window as any).showNotificationToast) {
      (window as any).showNotificationToast({
        id: notification.id,
        type: notification.type,
        priority: notification.priority,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        actionLabel: 'View Details'
      });
    } else {
      // Fallback to regular toast
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.priority === 'critical' ? 'destructive' : 'default',
      });
    }
    
    // Invalidate notification queries to refresh the notification center
    if ((window as any).queryClient) {
      (window as any).queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  };

  // Send WebSocket message
  const sendNotificationMessage = (message: any) => {
    if (notificationWs && notificationWs.readyState === WebSocket.OPEN) {
      notificationWs.send(JSON.stringify(message));
      return true;
    }
    return false;
  };

  // Provide WebSocket context to children
  useEffect(() => {
    // Attach WebSocket utilities to window for global access
    (window as any).notificationWebSocket = {
      connected: wsConnected,
      send: sendNotificationMessage,
      markAsRead: (notificationId: string) => {
        sendNotificationMessage({
          type: 'mark_notification_read',
          notificationId
        });
      },
      markAllAsRead: () => {
        sendNotificationMessage({
          type: 'mark_all_read'
        });
      }
    };
    
    return () => {
      delete (window as any).notificationWebSocket;
    };
  }, [wsConnected, sendNotificationMessage]);

  return (
    <BrowserNotificationProvider>
      <ToastNotificationSystem />
      
      {/* Connection Status Indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`text-xs px-2 py-1 rounded ${
            wsConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            Notifications: {wsConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      )}
      
      {children}
    </BrowserNotificationProvider>
  );
}

export default NotificationSystemProvider;