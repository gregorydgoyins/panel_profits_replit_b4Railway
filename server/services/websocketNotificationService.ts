import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import type { Notification } from '@shared/schema.js';
import { 
  patchWebSocketWithSanitization, 
  safeWebSocketClose,
  WebSocketCloseCodes 
} from '../utils/websocketSanitizer.js';

/**
 * WebSocket Notification Service for Panel Profits
 * 
 * Handles real-time notification delivery via WebSocket connections
 * Separate from market data WebSocket for dedicated notification channels
 */

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

interface NotificationMessage {
  type: 'notification' | 'notification_read' | 'all_notifications_read' | 'connection_confirmed';
  data?: any;
  timestamp?: string;
}

export class WebSocketNotificationService {
  private wss?: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();
  private heartbeatInterval?: NodeJS.Timeout;

  /**
   * Initialize WebSocket server for notifications
   */
  initialize(server: any, path: string = '/ws/notifications'): void {
    console.log(`🔔 Initializing WebSocket notification service on ${path}`);
    
    this.wss = new WebSocketServer({
      server,
      path,
      clientTracking: true
    });

    this.setupConnectionHandling();
    this.startHeartbeat();
    
    console.log(`✅ WebSocket notification service initialized on ${path}`);
  }

  /**
   * Set up WebSocket connection handling
   */
  private setupConnectionHandling(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
      console.log('📡 New WebSocket notification connection attempt');
      
      // Extract user ID from query parameters or session
      const userId = this.extractUserIdFromRequest(req);
      
      if (!userId) {
        console.warn('❌ WebSocket connection rejected: No user ID found');
        safeWebSocketClose(ws, WebSocketCloseCodes.POLICY_VIOLATION, 'Authentication required');
        return;
      }

      // Apply WebSocket close code sanitization to this connection
      patchWebSocketWithSanitization(ws);

      // Set up authenticated connection
      ws.userId = userId;
      ws.isAlive = true;
      
      // Store client connection
      this.clients.set(userId, ws);
      console.log(`✅ User ${userId} connected to notification WebSocket`);
      
      // Send connection confirmation
      this.sendToClient(userId, {
        type: 'connection_confirmed',
        data: { userId, timestamp: new Date().toISOString() }
      });

      // Set up message handling
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(userId, message);
        } catch (error) {
          console.error(`Error parsing WebSocket message from user ${userId}:`, error);
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Invalid message format' }
          }));
        }
      });

      // Handle client disconnect
      ws.on('close', (code: number, reason: Buffer) => {
        console.log(`📡 User ${userId} disconnected from notification WebSocket (${code}: ${reason.toString()})`);
        this.clients.delete(userId);
      });

      // Handle connection errors
      ws.on('error', (error: Error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
        this.clients.delete(userId);
      });

      // Handle heartbeat
      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });
  }

  /**
   * Extract user ID from WebSocket request
   */
  private extractUserIdFromRequest(req: IncomingMessage): string | null {
    try {
      // Try to get user ID from query parameters
      const { query } = parse(req.url || '', true);
      if (query.userId && typeof query.userId === 'string') {
        return query.userId;
      }

      // Try to get from session (this would require session middleware)
      // For now, return null until proper auth integration
      
      return null;
    } catch (error) {
      console.error('Error extracting user ID from WebSocket request:', error);
      return null;
    }
  }

  /**
   * Handle incoming messages from clients
   */
  private handleClientMessage(userId: string, message: any): void {
    console.log(`📥 WebSocket message from user ${userId}:`, message.type);

    switch (message.type) {
      case 'ping':
        this.sendToClient(userId, {
          type: 'pong',
          data: { timestamp: new Date().toISOString() }
        });
        break;

      case 'mark_notification_read':
        if (message.notificationId) {
          // This would trigger notification service to mark as read
          console.log(`User ${userId} marked notification ${message.notificationId} as read`);
        }
        break;

      case 'mark_all_read':
        // This would trigger notification service to mark all as read
        console.log(`User ${userId} marked all notifications as read`);
        break;

      case 'subscribe_to_alerts':
        // User wants to receive specific types of notifications
        console.log(`User ${userId} subscribed to alerts:`, message.alertTypes);
        break;

      default:
        console.warn(`Unknown message type from user ${userId}:`, message.type);
    }
  }

  /**
   * Send notification to specific user
   */
  sendNotificationToUser(userId: string, notification: Notification): boolean {
    return this.sendToClient(userId, {
      type: 'notification',
      data: notification,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send notification read status to user
   */
  sendNotificationReadStatus(userId: string, notificationId: string): boolean {
    return this.sendToClient(userId, {
      type: 'notification_read',
      data: { notificationId },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send all notifications read status to user
   */
  sendAllNotificationsReadStatus(userId: string): boolean {
    return this.sendToClient(userId, {
      type: 'all_notifications_read',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send message to specific client
   */
  private sendToClient(userId: string, message: NotificationMessage): boolean {
    const client = this.clients.get(userId);
    
    if (!client || client.readyState !== WebSocket.OPEN) {
      console.log(`Cannot send to user ${userId}: not connected`);
      return false;
    }

    try {
      client.send(JSON.stringify(message));
      console.log(`📤 Sent ${message.type} to user ${userId}`);
      return true;
    } catch (error) {
      console.error(`Error sending message to user ${userId}:`, error);
      this.clients.delete(userId);
      return false;
    }
  }

  /**
   * Broadcast notification to all connected users
   */
  broadcastToAllUsers(message: NotificationMessage): void {
    const connectedUsers = Array.from(this.clients.keys());
    console.log(`📢 Broadcasting ${message.type} to ${connectedUsers.length} users`);
    
    connectedUsers.forEach(userId => {
      this.sendToClient(userId, message);
    });
  }

  /**
   * Start heartbeat to detect disconnected clients
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((ws, userId) => {
        if (!ws.isAlive) {
          console.log(`💔 Removing dead connection for user ${userId}`);
          this.clients.delete(userId);
          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): { totalConnections: number; connectedUsers: string[] } {
    return {
      totalConnections: this.clients.size,
      connectedUsers: Array.from(this.clients.keys())
    };
  }

  /**
   * Close specific user connection
   */
  disconnectUser(userId: string): void {
    const client = this.clients.get(userId);
    if (client) {
      safeWebSocketClose(client, WebSocketCloseCodes.NORMAL_CLOSURE, 'Server initiated disconnect');
      this.clients.delete(userId);
      console.log(`🔌 Disconnected user ${userId} from notification WebSocket`);
    }
  }

  /**
   * Shutdown WebSocket service
   */
  shutdown(): void {
    console.log('🛑 Shutting down WebSocket notification service...');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all client connections
    this.clients.forEach((ws, userId) => {
      safeWebSocketClose(ws, WebSocketCloseCodes.GOING_AWAY, 'Server shutting down');
    });
    this.clients.clear();

    // Close WebSocket server
    if (this.wss) {
      this.wss.close(() => {
        console.log('✅ WebSocket notification service shut down');
      });
    }
  }
}

// Export singleton instance
export const wsNotificationService = new WebSocketNotificationService();