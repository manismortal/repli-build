import { storage } from "../storage";
import { User } from "@shared/schema";

export class NotificationService {
  
  async sendToUser(userId: string, message: string) {
    try {
      await storage.createNotification(userId, message);
      return true;
    } catch (e) {
      console.error(`Failed to send notification to user ${userId}:`, e);
      return false;
    }
  }

  async broadcast(message: string) {
    try {
      const users = await storage.getAllUsers();
      // Process in chunks to avoid memory spikes/blocking for too long if generic loop
      const chunkSize = 50;
      let deliveredCount = 0;

      for (let i = 0; i < users.length; i += chunkSize) {
        const chunk = users.slice(i, i + chunkSize);
        const promises = chunk.map(u => storage.createNotification(u.id, message));
        await Promise.all(promises);
        deliveredCount += chunk.length;
      }
      
      console.log(`Broadcast completed. Delivered to ${deliveredCount} users.`);
      return deliveredCount;
    } catch (e) {
      console.error("Broadcast failed:", e);
      throw e;
    }
  }

  async getStats() {
    // This would require more complex queries if not in storage, 
    // but for now let's just return what we can or implement a simple counter if storage allows.
    // Since we don't have direct DB access here cleanly without storage interface expansion,
    // we will rely on route-level stats or expand storage later.
    return {
        serviceStatus: "active",
        uptime: process.uptime()
    };
  }
}

export const notificationService = new NotificationService();
