import type { Express, Request, Response } from "express";
import { storage } from "../storage.js";
import { isAuthenticated } from "../replitAuth.js";
import { 
  insertNotificationSchema,
  insertPriceAlertSchema, 
  insertNotificationPreferencesSchema,
  type Notification,
  type PriceAlert,
  type NotificationPreferences
} from "@shared/schema.js";
import { z } from "zod";
import { notificationService } from "../services/notificationService.js";

/**
 * Notification API Routes for Panel Profits Phase 1
 * 
 * Provides comprehensive notification management:
 * - User notifications CRUD
 * - Price alerts management
 * - Notification preferences
 * - Real-time notification delivery
 */

export function registerNotificationRoutes(app: Express): void {
  // =============================================
  // NOTIFICATION MANAGEMENT ROUTES
  // =============================================

  /**
   * GET /api/notifications
   * Get user's notifications with filtering and pagination
   */
  app.get("/api/notifications", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { 
        type, 
        read, 
        priority, 
        limit = 50,
        offset = 0 
      } = req.query;

      const filters: any = {};
      if (type) filters.type = type;
      if (read !== undefined) filters.read = read === 'true';
      if (priority) filters.priority = priority;
      if (limit) filters.limit = parseInt(limit as string);

      const notifications = await storage.getUserNotifications(userId, filters);
      const unreadCount = await storage.getUserUnreadNotificationCount(userId);

      res.json({
        notifications,
        unreadCount,
        hasMore: notifications.length === parseInt(limit as string)
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  /**
   * GET /api/notifications/unread-count
   * Get count of unread notifications for user
   */
  app.get("/api/notifications/unread-count", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUserUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  /**
   * POST /api/notifications/:id/mark-read
   * Mark a specific notification as read
   */
  app.post("/api/notifications/:id/mark-read", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const notificationId = req.params.id;

      // Verify notification belongs to user
      const notification = await storage.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      if (notification.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  /**
   * POST /api/notifications/mark-all-read
   * Mark all notifications as read for the user
   */
  app.post("/api/notifications/mark-all-read", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  /**
   * DELETE /api/notifications/:id
   * Delete a specific notification
   */
  app.delete("/api/notifications/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const notificationId = req.params.id;

      // Verify notification belongs to user
      const notification = await storage.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      if (notification.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const deleted = await storage.deleteNotification(notificationId);
      if (!deleted) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.status(204).send();
    } catch (error) {
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
  app.get("/api/alerts/price", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { assetId, isActive } = req.query;

      const filters: any = {};
      if (assetId) filters.assetId = assetId;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const alerts = await storage.getUserPriceAlerts(userId, filters);
      
      // Enrich with asset information
      const enrichedAlerts = await Promise.all(
        alerts.map(async (alert) => {
          const asset = await storage.getAsset(alert.assetId);
          return {
            ...alert,
            asset: asset ? {
              id: asset.id,
              symbol: asset.symbol,
              name: asset.name,
              imageUrl: asset.imageUrl
            } : null
          };
        })
      );

      res.json(enrichedAlerts);
    } catch (error) {
      console.error("Error fetching price alerts:", error);
      res.status(500).json({ error: "Failed to fetch price alerts" });
    }
  });

  /**
   * POST /api/alerts/price
   * Create a new price alert
   */
  app.post("/api/alerts/price", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      
      const validatedData = insertPriceAlertSchema.parse({
        ...req.body,
        userId
      });

      // Verify asset exists
      const asset = await storage.getAsset(validatedData.assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const alert = await storage.createPriceAlert(validatedData);
      
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
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  app.put("/api/alerts/price/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const alertId = req.params.id;

      // Verify alert belongs to user
      const existingAlert = await storage.getPriceAlert(alertId);
      if (!existingAlert) {
        return res.status(404).json({ error: "Price alert not found" });
      }
      if (existingAlert.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updateData = insertPriceAlertSchema.partial().parse(req.body);
      const updatedAlert = await storage.updatePriceAlert(alertId, updateData);

      if (!updatedAlert) {
        return res.status(404).json({ error: "Price alert not found" });
      }

      res.json(updatedAlert);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  app.delete("/api/alerts/price/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const alertId = req.params.id;

      // Verify alert belongs to user
      const alert = await storage.getPriceAlert(alertId);
      if (!alert) {
        return res.status(404).json({ error: "Price alert not found" });
      }
      if (alert.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const deleted = await storage.deletePriceAlert(alertId);
      if (!deleted) {
        return res.status(404).json({ error: "Price alert not found" });
      }

      res.status(204).send();
    } catch (error) {
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
  app.get("/api/notifications/preferences", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      let preferences = await storage.getNotificationPreferences(userId);
      
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
        
        preferences = await storage.createNotificationPreferences(defaultPreferences);
      }

      res.json(preferences);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ error: "Failed to fetch notification preferences" });
    }
  });

  /**
   * PUT /api/notifications/preferences
   * Update user's notification preferences
   */
  app.put("/api/notifications/preferences", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      
      const updateData = insertNotificationPreferencesSchema.partial().parse(req.body);
      
      const preferences = await storage.updateNotificationPreferences(userId, updateData);
      if (!preferences) {
        return res.status(404).json({ error: "Notification preferences not found" });
      }

      res.json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  app.post("/api/notifications/test", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { type = 'market_update', priority = 'medium', title, message } = req.body;

      await notificationService.createNotification({
        userId,
        type,
        title: title || 'Test Notification',
        message: message || 'This is a test notification from the Panel Profits notification system.',
        priority,
        metadata: { source: 'test_endpoint' }
      });

      res.json({ success: true, message: 'Test notification sent' });
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({ error: "Failed to send test notification" });
    }
  });

  console.log('🔔 Notification routes registered successfully');
}