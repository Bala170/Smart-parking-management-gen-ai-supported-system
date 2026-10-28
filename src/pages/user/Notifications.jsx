import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  ShieldCheck,
  Radio,
  KeyRound,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'UNREAD', 'SECURITY'

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Entry':
        return <Radio className="w-4 h-4 text-blue-600" />;
      case 'Token':
        return <KeyRound className="w-4 h-4 text-emerald-600" />;
      case 'Delegation':
        return <UserCheck className="w-4 h-4 text-amber-600" />;
      case 'Fee':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'Security':
        return <ShieldCheck className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'SECURITY') return n.severity === 'security' || n.category === 'Security';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, entry/exit logs, delegation alerts and fee warnings
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
            filter === 'UNREAD'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('SECURITY')}
          className={`py-2 px-4 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
            filter === 'SECURITY'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Security & Access
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)]">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => markAsRead(item.id)}
            className={`p-4.5 transition-all flex items-start gap-4 cursor-pointer hover:bg-slate-50/80 ${
              !item.read ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              {getCategoryIcon(item.category)}
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">{item.time}</span>
              </div>

              <p className="text-slate-600 mt-1 leading-relaxed">{item.message}</p>

              <div className="flex items-center gap-3 mt-2 text-[10.5px] text-slate-400">
                <span className="font-mono">{item.timestamp}</span>
                <span>•</span>
                <span className="capitalize font-semibold text-slate-500">{item.category} Event</span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">
            No notifications in this view.
          </div>
        )}
      </div>
    </div>
  );
};
