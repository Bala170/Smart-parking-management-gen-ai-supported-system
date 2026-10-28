import React, { createContext, useContext, useState, useEffect } from 'react';
import { userNotifications } from '../data/mockData';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(userNotifications);
  const [toast, setToast] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      time: 'Just now',
      timestamp: new Date().toLocaleString(),
      read: false,
      severity: 'info',
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(notif.title, notif.severity || 'info');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        showToast,
        addNotification,
        toast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 animate-slide-up text-sm max-w-md">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'warning' ? 'bg-amber-500' : toast.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
          <span className="flex-1 font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer">✕</button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
