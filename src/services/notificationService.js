import { userNotifications } from '../data/mockData';

let notificationsState = [...userNotifications];

export const notificationService = {
  // GET /api/notifications
  async getNotifications() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...notificationsState];
  },

  // POST /api/notifications/{id}/read
  async markAsRead(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    notificationsState = notificationsState.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return { success: true };
  },

  // POST /api/notifications/read-all
  async markAllAsRead() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    notificationsState = notificationsState.map((n) => ({ ...n, read: true }));
    return { success: true };
  }
};
