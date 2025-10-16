"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNotificationRoutes = registerNotificationRoutes;
const storage_js_1 = require("../storage.js");
const replitAuth_js_1 = require("../replitAuth.js");
const schema_js_1 = require("@shared/schema.js");
const zod_1 = require("zod");
const notificationService_js_1 = require("../services/notificationService.js");
/**
 * Notification API Routes for Panel Profits Phase 1
 *
 * Provides comprehensive notification management:
 * - User notifications CRUD
 * - Price alerts management
 * - Notification preferences
 * - Real-time notification delivery
 */
function registerNotificationRoutes(app) {
    // =============================================
    // NOTIFICATION MANAGEMENT ROUTES
    // =============================================
    /**
     * GET /api/notifications
     * Get user's notifications with filtering and pagination
     */
    app.get("/api/notifications", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { type, read, priority, limit = 50, offset = 0 } = req.query;
            const filters = {};
            if (type)
                filters.type = type;
            if (read !== undefined)
                filters.read = read === 'true';
            if (priority)
                filters.priority = priority;
            if (limit)
                filters.limit = parseInt(limit);
            const notifications = await storage_js_1.storage.getUserNotifications(userId, filters);
            const unreadCount = await storage_js_1.storage.getUserUnreadNotificationCount(userId);
            res.json({
                notifications,
                unreadCount,
                hasMore: notifications.length === parseInt(limit)
            });
        }
        catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ error: "Failed to fetch notifications" });
        }
    });
    /**
     * GET /api/notifications/unread-count
     * Get count of unread notifications for user
     */
    app.get("/api/notifications/unread-count", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const count = await storage_js_1.storage.getUserUnreadNotificationCount(userId);
            res.json({ count });
        }
        catch (error) {
            console.error("Error fetching unread count:", error);
            res.status(500).json({ error: "Failed to fetch unread count" });
        }
    });
    /**
     * POST /api/notifications/:id/mark-read
     * Mark a specific notification as read
     */
    app.post("/api/notifications/:id/mark-read", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const notificationId = req.params.id;
            // Verify notification belongs to user
            const notification = await storage_js_1.storage.getNotification(notificationId);
            if (!notification) {
                return res.status(404).json({ error: "Notification not found" });
            }
            if (notification.userId !== userId) {
                return res.status(403).json({ error: "Access denied" });
            }
            await storage_js_1.storage.markNotificationAsRead(notificationId);
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            res.status(500).json({ error: "Failed to mark notification as read" });
        }
    });
    /**
     * POST /api/notifications/mark-all-read
     * Mark all notifications as read for the user
     */
    app.post("/api/notifications/mark-all-read", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            await storage_js_1.storage.markAllNotificationsAsRead(userId);
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error marking all notifications as read:", error);
            res.status(500).json({ error: "Failed to mark all notifications as read" });
        }
    });
    /**
     * DELETE /api/notifications/:id
     * Delete a specific notification
     */
    app.delete("/api/notifications/:id", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const notificationId = req.params.id;
            // Verify notification belongs to user
            const notification = await storage_js_1.storage.getNotification(notificationId);
            if (!notification) {
                return res.status(404).json({ error: "Notification not found" });
            }
            if (notification.userId !== userId) {
                return res.status(403).json({ error: "Access denied" });
            }
            const deleted = await storage_js_1.storage.deleteNotification(notificationId);
            if (!deleted) {
                return res.status(404).json({ error: "Notification not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            console.error("Error deleting notification:", error);
            res.status(500).json({ error: "Failed to delete notification" });
        }
    });
    // =============================================
    // PRICE ALERTS MANAGEMENT ROUTES
    // =============================================
    /**
     * GET /api/alerts/price
     * Get user's price alerts
     */
    app.get("/api/alerts/price", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { assetId, isActive } = req.query;
            const filters = {};
            if (assetId)
                filters.assetId = assetId;
            if (isActive !== undefined)
                filters.isActive = isActive === 'true';
            const alerts = await storage_js_1.storage.getUserPriceAlerts(userId, filters);
            // Enrich with asset information
            const enrichedAlerts = await Promise.all(alerts.map(async (alert) => {
                const asset = await storage_js_1.storage.getAsset(alert.assetId);
                return {
                    ...alert,
                    asset: asset ? {
                        id: asset.id,
                        symbol: asset.symbol,
                        name: asset.name,
                        imageUrl: asset.imageUrl
                    } : null
                };
            }));
            res.json(enrichedAlerts);
        }
        catch (error) {
            console.error("Error fetching price alerts:", error);
            res.status(500).json({ error: "Failed to fetch price alerts" });
        }
    });
    /**
     * POST /api/alerts/price
     * Create a new price alert
     */
    app.post("/api/alerts/price", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const validatedData = schema_js_1.insertPriceAlertSchema.parse({
                ...req.body,
                userId
            });
            // Verify asset exists
            const asset = await storage_js_1.storage.getAsset(validatedData.assetId);
            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }
            const alert = await storage_js_1.storage.createPriceAlert(validatedData);
            // Enrich response with asset info
            const enrichedAlert = {
                ...alert,
                asset: {
                    id: asset.id,
                    symbol: asset.symbol,
                    name: asset.name,
                    imageUrl: asset.imageUrl
                }
            };
            res.status(201).json(enrichedAlert);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid price alert data", details: error.errors });
            }
            console.error("Error creating price alert:", error);
            res.status(500).json({ error: "Failed to create price alert" });
        }
    });
    /**
     * PUT /api/alerts/price/:id
     * Update a price alert
     */
    app.put("/api/alerts/price/:id", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const alertId = req.params.id;
            // Verify alert belongs to user
            const existingAlert = await storage_js_1.storage.getPriceAlert(alertId);
            if (!existingAlert) {
                return res.status(404).json({ error: "Price alert not found" });
            }
            if (existingAlert.userId !== userId) {
                return res.status(403).json({ error: "Access denied" });
            }
            const updateData = schema_js_1.insertPriceAlertSchema.partial().parse(req.body);
            const updatedAlert = await storage_js_1.storage.updatePriceAlert(alertId, updateData);
            if (!updatedAlert) {
                return res.status(404).json({ error: "Price alert not found" });
            }
            res.json(updatedAlert);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid price alert data", details: error.errors });
            }
            console.error("Error updating price alert:", error);
            res.status(500).json({ error: "Failed to update price alert" });
        }
    });
    /**
     * DELETE /api/alerts/price/:id
     * Delete a price alert
     */
    app.delete("/api/alerts/price/:id", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const alertId = req.params.id;
            // Verify alert belongs to user
            const alert = await storage_js_1.storage.getPriceAlert(alertId);
            if (!alert) {
                return res.status(404).json({ error: "Price alert not found" });
            }
            if (alert.userId !== userId) {
                return res.status(403).json({ error: "Access denied" });
            }
            const deleted = await storage_js_1.storage.deletePriceAlert(alertId);
            if (!deleted) {
                return res.status(404).json({ error: "Price alert not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            console.error("Error deleting price alert:", error);
            res.status(500).json({ error: "Failed to delete price alert" });
        }
    });
    // =============================================
    // NOTIFICATION PREFERENCES ROUTES
    // =============================================
    /**
     * GET /api/notifications/preferences
     * Get user's notification preferences
     */
    app.get("/api/notifications/preferences", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            let preferences = await storage_js_1.storage.getNotificationPreferences(userId);
            // Create default preferences if none exist
            if (!preferences) {
                const defaultPreferences = {
                    userId,
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
                };
                preferences = await storage_js_1.storage.createNotificationPreferences(defaultPreferences);
            }
            res.json(preferences);
        }
        catch (error) {
            console.error("Error fetching notification preferences:", error);
            res.status(500).json({ error: "Failed to fetch notification preferences" });
        }
    });
    /**
     * PUT /api/notifications/preferences
     * Update user's notification preferences
     */
    app.put("/api/notifications/preferences", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const updateData = schema_js_1.insertNotificationPreferencesSchema.partial().parse(req.body);
            const preferences = await storage_js_1.storage.updateNotificationPreferences(userId, updateData);
            if (!preferences) {
                return res.status(404).json({ error: "Notification preferences not found" });
            }
            res.json(preferences);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: "Invalid notification preferences", details: error.errors });
            }
            console.error("Error updating notification preferences:", error);
            res.status(500).json({ error: "Failed to update notification preferences" });
        }
    });
    // =============================================
    // NOTIFICATION TESTING ROUTES (Development)
    // =============================================
    /**
     * POST /api/notifications/test
     * Create a test notification (development only)
     */
    app.post("/api/notifications/test", replitAuth_js_1.isAuthenticated, async (req, res) => {
        try {
            const userId = req.user.claims.sub;
            const { type = 'market_update', priority = 'medium', title, message } = req.body;
            await notificationService_js_1.notificationService.createNotification({
                userId,
                type,
                title: title || 'Test Notification',
                message: message || 'This is a test notification from the Panel Profits notification system.',
                priority,
                metadata: { source: 'test_endpoint' }
            });
            res.json({ success: true, message: 'Test notification sent' });
        }
        catch (error) {
            console.error("Error sending test notification:", error);
            res.status(500).json({ error: "Failed to send test notification" });
        }
    });
    console.log('🔔 Notification routes registered successfully');
}
