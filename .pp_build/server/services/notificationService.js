"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = exports.DEFAULT_NOTIFICATION_CONFIG = void 0;
const storage_js_1 = require("../storage.js");
exports.DEFAULT_NOTIFICATION_CONFIG = {
    enableEmailNotifications: false, // Can be enabled when email service is set up
    enablePushNotifications: true,
    enableWebSocketNotifications: true,
    defaultQuietHoursStart: '22:00',
    defaultQuietHoursEnd: '08:00',
    maxNotificationsPerUser: 100,
    priceCheckIntervalMs: 60000, // Check prices every minute
};
class NotificationService {
    // private connectedClients: Map<string, WSWebSocket> = new Map();
    constructor(config = exports.DEFAULT_NOTIFICATION_CONFIG) {
        this.config = config;
    }
    /**
     * Initialize the notification service
     */
    async initialize() {
        console.log('🔔 Initializing Notification Service...');
        // WebSocket support disabled - using polling instead
        // this.wsServer = wsServer;
        // Set up WebSocket handling for notifications
        // if (this.wsServer) {
        //   this.setupWebSocketHandling();
        // }
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
    //   private setupWebSocketHandling(): void {
    //     if (!this.wsServer) return;
    // 
    //     this.wsServer.on('connection', (ws, req) => {
    //       // Extract user ID from connection (this would be set by auth middleware)
    //       const userId = this.extractUserIdFromConnection(req);
    //       
    //       if (userId) {
    //         console.log(`📡 User ${userId} connected to notification channel`);
    //         this.connectedClients.set(userId, ws);
    //         
    //         ws.on('close', () => {
    //           console.log(`📡 User ${userId} disconnected from notification channel`);
    //           this.connectedClients.delete(userId);
    //         });
    //         
    //         ws.on('message', (message) => {
    //           try {
    //             const data = JSON.parse(message.toString());
    //             this.handleWebSocketMessage(userId, data);
    //           } catch (error) {
    //             console.error('Error parsing WebSocket message:', error);
    //           }
    //         });
    //       }
    //     });
    //   }
    /**
     * Extract user ID from WebSocket connection
     */
    //   private extractUserIdFromConnection(req: any): string | null {
    //     // This would extract user ID from session or JWT token
    //     // For now, return null until auth integration is complete
    //     return req.session?.user?.id || null;
    //   }
    /**
     * Handle incoming WebSocket messages
     */
    //   private handleWebSocketMessage(userId: string, data: any): void {
    //     switch (data.type) {
    //       case 'mark_read':
    //         if (data.notificationId) {
    //           this.markNotificationAsRead(userId, data.notificationId);
    //         }
    //         break;
    //       case 'mark_all_read':
    //         this.markAllNotificationsAsRead(userId);
    //         break;
    //       case 'subscribe':
    //         // User explicitly subscribing to real-time notifications
    //         console.log(`User ${userId} subscribed to real-time notifications`);
    //         break;
    //       default:
    //         console.warn(`Unknown WebSocket message type: ${data.type}`);
    //     }
    //   }
    /**
     * Create a new notification
     */
    async createNotification(notification) {
        // Check user preferences before creating notification
        const preferences = await this.getUserNotificationPreferences(notification.userId);
        if (!this.shouldSendNotification(notification, preferences)) {
            console.log(`Notification blocked by user preferences for user ${notification.userId}`);
            return null; // Skip notification
        }
        // Check quiet hours
        if (preferences && this.isInQuietHours(preferences)) {
            console.log(`Notification delayed due to quiet hours for user ${notification.userId}`);
            // Could implement queuing for after quiet hours
            return null;
        }
        // Create notification in database
        const createdNotification = await storage_js_1.storage.createNotification(notification);
        // WebSocket support disabled - using polling instead
        // Send real-time notification via WebSocket
        // if (this.config.enableWebSocketNotifications) {
        //   await this.sendWebSocketNotification(notification.userId, createdNotification);
        // }
        // Send push notification if enabled and user has permission
        if (this.config.enablePushNotifications && preferences?.pushNotifications) {
            await this.sendPushNotification(notification.userId, createdNotification);
        }
        return createdNotification;
    }
    /**
     * Send WebSocket notification to connected user
     */
    //   private async sendWebSocketNotification(userId: string, notification: Notification): Promise<void> {
    //     // Use the dedicated WebSocket notification service
    //     try {
    //       wsNotificationService.sendNotification(userId, {
    //         type: 'notification',
    //         data: notification,
    //         timestamp: new Date().toISOString()
    //       });
    //       console.log(`📤 WebSocket notification sent to user ${userId}`);
    //     } catch (error) {
    //       console.error(`Error sending WebSocket notification to user ${userId}:`, error);
    //     }
    //   }
    /**
     * Send browser push notification
     */
    async sendPushNotification(userId, notification) {
        // This would integrate with browser push notification API
        // For now, just log that we would send a push notification
        console.log(`📱 Push notification would be sent to user ${userId}: ${notification.title}`);
    }
    /**
     * Check if notification should be sent based on user preferences
     */
    shouldSendNotification(notification, preferences) {
        if (!preferences)
            return true; // Default to sending if no preferences set
        // Check type-specific preferences
        switch (notification.type) {
            case 'order':
                return preferences.orderNotifications || false;
            case 'price_alert':
                return preferences.priceAlerts || false;
            case 'market_update':
                return preferences.marketUpdates || false;
            case 'portfolio':
                return preferences.portfolioAlerts || false;
            default:
                return true;
        }
    }
    /**
     * Check if current time is in user's quiet hours
     */
    isInQuietHours(preferences) {
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
        }
        else {
            return currentTime >= startTime && currentTime <= endTime;
        }
    }
    /**
     * Create order fill notification
     */
    async createOrderFillNotification(userId, order, asset) {
        const notification = {
            userId,
            type: 'order',
            title: `Order Filled: ${asset.symbol}`,
            message: `Your ${order.side || order.type} order for ${order.quantity} shares of ${asset.name} has been filled at $${order.price}`,
            priority: 'high',
            actionUrl: `/trading?order=${order.id}`,
            metadata: {
                orderId: order.id,
                assetId: asset.id,
                assetSymbol: asset.symbol,
                orderSide: order.side || order.type,
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
    async createPriceAlertNotification(userId, alert, asset, currentPrice) {
        const direction = alert.alertType === 'price_above' ? 'above' : 'below';
        const notification = {
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
    async createMarketUpdateNotification(userId, title, message, priority = 'medium') {
        const notification = {
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
    startPriceMonitoring() {
        console.log('📊 Starting price monitoring for alerts...');
        this.priceCheckInterval = setInterval(async () => {
            await this.checkPriceAlerts();
        }, this.config.priceCheckIntervalMs);
    }
    /**
     * Check all active price alerts
     */
    async checkPriceAlerts() {
        try {
            const activeAlerts = await storage_js_1.storage.getPriceAlerts({ isActive: true });
            for (const alert of activeAlerts) {
                await this.checkSinglePriceAlert(alert);
            }
        }
        catch (error) {
            console.error('Error checking price alerts:', error);
        }
    }
    /**
     * Check a single price alert
     */
    async checkSinglePriceAlert(alert) {
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
            const currentPrice = await storage_js_1.storage.getAssetCurrentPrice(alert.assetId);
            if (!currentPrice)
                return;
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
                const asset = await storage_js_1.storage.getAsset(alert.assetId);
                if (!asset)
                    return;
                // Create notification
                await this.createPriceAlertNotification(alert.userId, alert, asset, price);
                // Update alert trigger information
                await storage_js_1.storage.updatePriceAlert(alert.id, {
                    lastTriggeredPrice: price.toString(),
                    triggerCount: (alert.triggerCount || 0) + 1
                });
                console.log(`🔔 Price alert triggered for user ${alert.userId}: ${asset.symbol} at $${price}`);
            }
            else {
                // Alert not triggered, continue monitoring
            }
        }
        catch (error) {
            console.error(`Error checking price alert ${alert.id}:`, error);
        }
    }
    /**
     * Get user notification preferences
     */
    async getUserNotificationPreferences(userId) {
        const preferences = await storage_js_1.storage.getNotificationPreferences(userId);
        return preferences || null;
    }
    /**
     * Mark notification as read
     */
    async markNotificationAsRead(userId, notificationId) {
        await storage_js_1.storage.updateNotification(notificationId, { read: true });
        // Send WebSocket update
        const ws = this.connectedClients.get(userId);
        if (ws && ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                type: 'notification_read',
                data: { notificationId }
            }));
        }
    }
    /**
     * Mark all notifications as read for a user
     */
    async markAllNotificationsAsRead(userId) {
        await storage_js_1.storage.markAllNotificationsAsRead(userId);
        // Send WebSocket update
        const ws = this.connectedClients.get(userId);
        if (ws && ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                type: 'all_notifications_read'
            }));
        }
    }
    /**
     * Initialize default notification templates
     */
    async initializeNotificationTemplates() {
        const templates = [
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
                const existing = await storage_js_1.storage.getNotificationTemplate(template.type);
                if (!existing) {
                    await storage_js_1.storage.createNotificationTemplate(template);
                    console.log(`📝 Created notification template: ${template.type}`);
                }
            }
            catch (error) {
                console.error(`Error creating notification template ${template.type}:`, error);
            }
        }
    }
    /**
     * Stop the notification service
     */
    stop() {
        if (this.priceCheckInterval) {
            clearInterval(this.priceCheckInterval);
            this.priceCheckInterval = undefined;
        }
        // Close all WebSocket connections
        this.connectedClients.forEach((ws) => {
            safeWebSocketClose(ws, WebSocketCloseCodes.GOING_AWAY, 'Server shutting down');
        });
        this.connectedClients.clear();
        console.log('🛑 Notification service stopped');
    }
}
exports.NotificationService = NotificationService;
// Export singleton instance
exports.notificationService = new NotificationService();
