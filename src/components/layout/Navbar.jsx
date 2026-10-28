import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Shield,
  ChevronDown,
  LogOut,
  Sparkles,
  CreditCard,
  Radio,
  CheckCheck,
  Activity,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar = ({ toggleMobile }) => {
  const { user, role, switchRole, logout, isAdmin } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = () => {
    const next = isAdmin ? 'user' : 'admin';
    switchRole(next);
    navigate(next === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 min-h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Hardware Telemetry Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer active:scale-95 transition-all"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2.5">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
              isAdmin
                ? 'bg-amber-50 text-amber-900 border-amber-200/90'
                : 'bg-blue-50 text-blue-900 border-blue-200/90'
            }`}>
              {isAdmin ? 'Operator Command Console' : 'Vehicle Owner Portal'}
            </span>
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono bg-slate-50/80 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>RFID Station Gate-1 Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Role Quick Switch Pill */}
        <button
          onClick={handleRoleSwitch}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
            isAdmin
              ? 'bg-amber-50/90 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-blue-50/90 text-blue-900 border-blue-200 hover:bg-blue-100'
          }`}
          title="Toggle between Vehicle Owner and Parking Admin Operator view"
        >
          {isAdmin ? <Shield className="w-3.5 h-3.5 text-amber-600" /> : <User className="w-3.5 h-3.5 text-blue-600" />}
          <span>{isAdmin ? 'Admin Console' : 'Owner Portal'}</span>
          <span className="text-[10px] bg-white px-2 py-0.2 rounded-full border border-slate-200 text-slate-600 font-mono shadow-2xs">
            Switch ⇄
          </span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[9.5px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.15)] border border-slate-200/90 py-3.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Telemetry & Alerts</h4>
                  <p className="text-[11px] text-slate-400">RFID gate sensors & token triggers</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs hover:bg-slate-50 transition-colors ${
                      !item.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{item.message}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-3 border-t border-slate-100 text-center">
                <Link
                  to="/user/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all live alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full hover:bg-slate-100/90 transition-all text-left cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-slate-100">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block leading-tight">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-slate-500 capitalize">{role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.15)] border border-slate-200/90 py-2.5 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate font-mono">{user.email}</p>
                <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold bg-slate-100 text-slate-700">
                  ID: {user.id}
                </span>
              </div>

              <Link
                to={isAdmin ? '/admin/dashboard' : '/user/profile'}
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile & RFID Tags</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

