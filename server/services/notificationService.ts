import { storage } from '../storage.js';
import type { 
  Notification, InsertNotification, 
  PriceAlert, InsertPriceAlert,
  NotificationPreferences, InsertNotificationPreferences,
  NotificationTemplate, InsertNotificationTemplate,
  Asset, AssetCurrentPrice, Order, User
} from '@shared/schema.js';
import { WebSocketServer } from 'ws';

/**
 * Comprehensive Notification Service for Panel Profits
 * 
 * Handles real-time notifications for:
 * - Order fill notifications
 * - Price alerts
 * - Market updates
 * - Portfolio notifications
 */

export interface NotificationServiceConfig {
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableWebSocketNotifications: boolean;
  defaultQuietHoursStart: string;
  defaultQuietHoursEnd: string;
  maxNotificationsPerUser: number;
  priceCheckIntervalMs: number;
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationServiceConfig = {
  enableEmailNotifications: false, // Can be enabled when email service is set up
  enablePushNotifications: true,
  enableWebSocketNotifications: true,
  defaultQuietHoursStart: '22:00',
  defaultQuietHoursEnd: '08:00',
  maxNotificationsPerUser: 100,
  priceCheckIntervalMs: 60000, // Check prices every minute
};

export class NotificationService {
  private config: NotificationServiceConfig;
  private wsServer?: WebSocketServer;
  private priceCheckInterval?: NodeJS.Timeout;
  private connectedClients: Map<string, WebSocket> = new Map();
  
  constructor(config: NotificationServiceConfig = DEFAULT_NOTIFICATION_CONFIG) {
    this.config = config;
  }

  /**
   * Initialize the notification service
   */
  async initialize(wsServer?: WebSocketServer): Promise<void> {
    console.log('🔔 Initializing Notification Service...');
    
    this.wsServer = wsServer;
    
    // Set up WebSocket handling for notifications
    if (this.wsServer) {
      this.setupWebSocketHandling();
    }
    
    // Initialize default notification templates
    await this.initializeNotificationTemplates();
    
    // Start price monitoring for alerts
    if (this.config.priceCheckIntervalMs > 0) {
      this.startPriceMonitoring();
    }
    
    console.log('✅ Notification service initialized successfully');
  }

  /**
   * Set up WebSocket handling for real-time notifications
   */
  private setupWebSocketHandling(): void {
    if (!this.wsServer) return;

    this.wsServer.on('connection', (ws, req) => {
      // Extract user ID from connection (this would be set by auth middleware)
      const userId = this.extractUserIdFromConnection(req);
      
      if (userId) {
        console.log(`📡 User ${userId} connected to notification channel`);
        this.connectedClients.set(userId, ws);
        
        ws.on('close', () => {
          console.log(`📡 User ${userId} disconnected from notification channel`);
          this.connectedClients.delete(userId);
        });
        
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message.toString());
            this.handleWebSocketMessage(userId, data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });
      }
    });
  }

  /**
   * Extract user ID from WebSocket connection
   */
  private extractUserIdFromConnection(req: any): string | null {
    // This would extract user ID from session or JWT token
    // For now, return null until auth integration is complete
    return req.session?.user?.id || null;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(userId: string, data: any): void {
    switch (data.type) {
      case 'mark_read':
        if (data.notificationId) {
          this.markNotificationAsRead(userId, data.notificationId);
        }
        break;
      case 'mark_all_read':
        this.markAllNotificationsAsRead(userId);
        break;
      case 'subscribe':
        // User explicitly subscribing to real-time notifications
        console.log(`User ${userId} subscribed to real-time notifications`);
        break;
      default:
        console.warn(`Unknown WebSocket message type: ${data.type}`);
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(notification: InsertNotification): Promise<Notification> {
    // Check user preferences before creating notification
    const preferences = await this.getUserNotificationPreferences(notification.userId);
    
    if (!this.shouldSendNotification(notification, preferences)) {
      console.log(`Notification blocked by user preferences for user ${notification.userId}`);
      return null as any; // Skip notification
    }
    
    // Check quiet hours
    if (preferences && this.isInQuietHours(preferences)) {
      console.log(`Notification delayed due to quiet hours for user ${notification.userId}`);
      // Could implement queuing for after quiet hours
      return null as any;
    }
    
    // Create notification in database
    const createdNotification = await storage.createNotification(notification);
    
    // Send real-time notification via WebSocket
    if (this.config.enableWebSocketNotifications) {
      await this.sendWebSocketNotification(notification.userId, createdNotification);
    }
    
    // Send push notification if enabled and user has permission
    if (this.config.enablePushNotifications && preferences?.pushNotifications) {
      await this.sendPushNotification(notification.userId, createdNotification);
    }
    
    return createdNotification;
  }

  /**
   * Send WebSocket notification to connected user
   */
  private async sendWebSocketNotification(userId: string, notification: Notification): Promise<void> {
    const ws = this.connectedClients.get(userId);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));
        console.log(`📤 WebSocket notification sent to user ${userId}`);
      } catch (error) {
        console.error(`Error sending WebSocket notification to user ${userId}:`, error);
      }
    } else {
      console.log(`User ${userId} not connected to WebSocket for notification`);
    }
  }

  /**
   * Send browser push notification
   */
  private async sendPushNotification(userId: string, notification: Notification): Promise<void> {
    // This would integrate with browser push notification API
    // For now, just log that we would send a push notification
    console.log(`📱 Push notification would be sent to user ${userId}: ${notification.title}`);
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  private shouldSendNotification(notification: InsertNotification, preferences: NotificationPreferences | null): boolean {
    if (!preferences) return true; // Default to sending if no preferences set
    
    // Check type-specific preferences
    switch (notification.type) {
      case 'order':
        return preferences.orderNotifications;
      case 'price_alert':
        return preferences.priceAlerts;
      case 'market_update':
        return preferences.marketUpdates;
      case 'portfolio':
        return preferences.portfolioAlerts;
      default:
        return true;
    }
  }

  /**
   * Check if current time is in user's quiet hours
   */
  private isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHoursEnabled || !preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const startTime = preferences.quietHoursStart;
    const endTime = preferences.quietHoursEnd;
    
    // Handle quiet hours that span midnight
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  /**
   * Create order fill notification
   */
  async createOrderFillNotification(userId: string, order: Order, asset: Asset): Promise<void> {
    const notification: InsertNotification = {
      userId,
      type: 'order',
      title: `Order Filled: ${asset.symbol}`,
      message: `Your ${order.side} order for ${order.quantity} shares of ${asset.name} has been filled at $${order.price}`,
      priority: 'high',
      actionUrl: `/trading?order=${order.id}`,
      metadata: {
        orderId: order.id,
        assetId: asset.id,
        assetSymbol: asset.symbol,
        orderSide: order.side,
        quantity: order.quantity,
        price: order.price,
        totalValue: order.totalValue
      }
    };
    
    await this.createNotification(notification);
  }

  /**
   * Create price alert notification
   */
  async createPriceAlertNotification(userId: string, alert: PriceAlert, asset: Asset, currentPrice: number): Promise<void> {
    const direction = alert.alertType === 'price_above' ? 'above' : 'below';
    
    const notification: InsertNotification = {
      userId,
      type: 'price_alert',
      title: `Price Alert: ${asset.symbol}`,
      message: `${asset.name} is now $${currentPrice.toFixed(2)}, ${direction} your alert threshold of $${alert.thresholdValue}`,
      priority: 'medium',
      actionUrl: `/trading?symbol=${asset.symbol}`,
      metadata: {
        alertId: alert.id,
        assetId: asset.id,
        assetSymbol: asset.symbol,
        alertType: alert.alertType,
        thresholdValue: alert.thresholdValue,
        currentPrice
      }
    };
    
    await this.createNotification(notification);
  }

  /**
   * Create market update notification
   */
  async createMarketUpdateNotification(userId: string, title: string, message: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<void> {
    const notification: InsertNotification = {
      userId,
      type: 'market_update',
      title,
      message,
      priority,
      actionUrl: '/news'
    };
    
    await this.createNotification(notification);
  }

  /**
   * Start price monitoring for alerts
   */
  private startPriceMonitoring(): void {
    console.log('📊 Starting price monitoring for alerts...');
    
    this.priceCheckInterval = setInterval(async () => {
      await this.checkPriceAlerts();
    }, this.config.priceCheckIntervalMs);
  }

  /**
   * Check all active price alerts
   */
  private async checkPriceAlerts(): Promise<void> {
    try {
      const activeAlerts = await storage.getPriceAlerts({ isActive: true });
      
      for (const alert of activeAlerts) {
        await this.checkSinglePriceAlert(alert);
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  }

  /**
   * Check a single price alert
   */
  private async checkSinglePriceAlert(alert: PriceAlert): Promise<void> {
    try {
      // Check cooldown period
      if (alert.triggeredAt) {
        const timeSinceLastTrigger = Date.now() - new Date(alert.triggeredAt).getTime();
        const cooldownMs = (alert.cooldownMinutes || 60) * 60 * 1000;
        
        if (timeSinceLastTrigger < cooldownMs) {
          return; // Still in cooldown
        }
      }
      
      // Get current price
      const currentPrice = await storage.getAssetCurrentPrice(alert.assetId);
      if (!currentPrice) return;
      
      const price = parseFloat(currentPrice.currentPrice);
      const threshold = parseFloat(alert.thresholdValue.toString());
      
      let shouldTrigger = false;
      
      switch (alert.alertType) {
        case 'price_above':
          shouldTrigger = price >= threshold;
          break;
        case 'price_below':
          shouldTrigger = price <= threshold;
          break;
        case 'percent_change':
          // This would require calculating percentage change from a baseline
          // Implementation depends on requirements
          break;
        case 'volume_spike':
          // This would check volume against historical averages
          // Implementation depends on requirements
          break;
      }
      
      if (shouldTrigger) {
        // Get asset info
        const asset = await storage.getAsset(alert.assetId);
        if (!asset) return;
        
        // Create notification
        await this.createPriceAlertNotification(alert.userId, alert, asset, price);
        
        // Update alert trigger information
        await storage.updatePriceAlert(alert.id, {
          triggeredAt: new Date(),
          lastTriggeredPrice: price.toString(),
          triggerCount: (alert.triggerCount || 0) + 1,
          lastCheckedAt: new Date()
        });
        
        console.log(`🔔 Price alert triggered for user ${alert.userId}: ${asset.symbol} at $${price}`);
      } else {
        // Update last checked time
        await storage.updatePriceAlert(alert.id, {
          lastCheckedAt: new Date()
        });
      }
    } catch (error) {
      console.error(`Error checking price alert ${alert.id}:`, error);
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    return await storage.getNotificationPreferences(userId);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    await storage.updateNotification(notificationId, { read: true });
    
    // Send WebSocket update
    const ws = this.connectedClients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'notification_read',
        data: { notificationId }
      }));
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await storage.markAllNotificationsAsRead(userId);
    
    // Send WebSocket update
    const ws = this.connectedClients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'all_notifications_read'
      }));
    }
  }

  /**
   * Initialize default notification templates
   */
  private async initializeNotificationTemplates(): Promise<void> {
    const templates: InsertNotificationTemplate[] = [
      {
        type: 'order_filled',
        priority: 'high',
        titleTemplate: 'Order Filled: {assetSymbol}',
        messageTemplate: 'Your {orderSide} order for {quantity} shares of {assetName} has been filled at ${price}',
        actionUrlTemplate: '/trading?order={orderId}'
      },
      {
        type: 'order_cancelled',
        priority: 'medium',
        titleTemplate: 'Order Cancelled: {assetSymbol}',
        messageTemplate: 'Your {orderSide} order for {quantity} shares of {assetName} has been cancelled',
        actionUrlTemplate: '/trading?order={orderId}'
      },
      {
        type: 'price_alert_triggered',
        priority: 'medium',
        titleTemplate: 'Price Alert: {assetSymbol}',
        messageTemplate: '{assetName} is now ${currentPrice}, {direction} your alert threshold of ${thresholdValue}',
        actionUrlTemplate: '/trading?symbol={assetSymbol}'
      },
      {
        type: 'market_open',
        priority: 'low',
        titleTemplate: 'Market Open',
        messageTemplate: 'The comic asset market is now open for trading',
        actionUrlTemplate: '/trading'
      },
      {
        type: 'market_close',
        priority: 'low',
        titleTemplate: 'Market Closed',
        messageTemplate: 'The comic asset market has closed for the day',
        actionUrlTemplate: '/portfolio'
      }
    ];
    
    for (const template of templates) {
      try {
        // Check if template already exists
        const existing = await storage.getNotificationTemplate(template.type);
        if (!existing) {
          await storage.createNotificationTemplate(template);
          console.log(`📝 Created notification template: ${template.type}`);
        }
      } catch (error) {
        console.error(`Error creating notification template ${template.type}:`, error);
      }
    }
  }

  /**
   * Stop the notification service
   */
  stop(): void {
    if (this.priceCheckInterval) {
      clearInterval(this.priceCheckInterval);
      this.priceCheckInterval = undefined;
    }
    
    // Close all WebSocket connections
    this.connectedClients.forEach((ws) => {
      ws.close();
    });
    this.connectedClients.clear();
    
    console.log('🛑 Notification service stopped');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();