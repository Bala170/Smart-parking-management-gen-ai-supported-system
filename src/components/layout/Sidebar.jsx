import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  QrCode,
  KeyRound,
  UserCheck,
  CreditCard,
  History,
  Bell,
  User,
  ShieldAlert,
  Grid3X3,
  ListOrdered,
  FileText,
  Users,
  LogOut,
  Radio,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const { role, switchRole, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  const userNavItems = [
    { name: 'Find Parking', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Active Parking', path: '/user/parking', icon: Radio },
    { name: 'Digital Token', path: '/user/token', icon: QrCode },
    { name: 'Lost Token Recovery', path: '/user/recovery', icon: KeyRound },
    { name: 'Delegated Retrieval', path: '/user/delegation', icon: UserCheck },
    { name: 'My Vehicles', path: '/user/vehicles', icon: Car },
    { name: 'Payments & Fee', path: '/user/payments', icon: CreditCard },
    { name: 'Parking History', path: '/user/history', icon: History },
    { name: 'Notifications', path: '/user/notifications', icon: Bell },
    { name: 'Profile & RFID', path: '/user/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Command Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Parking Bays (Slots)', path: '/admin/parking-slots', icon: Grid3X3 },
    { name: 'Active Sessions', path: '/admin/sessions', icon: ListOrdered },
    { name: 'Retrieval Gate Control', path: '/admin/retrievals', icon: ShieldCheck },
    { name: 'Delegations Monitor', path: '/admin/delegations', icon: UserCheck },
    { name: 'Vehicle Registry', path: '/admin/vehicles', icon: Car },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Tariffs & Revenue', path: '/admin/payments', icon: CreditCard },
    { name: 'Security Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { name: 'Security & Incidents', path: '/admin/security', icon: ShieldAlert },
    { name: 'Live Monitoring', path: '/admin/live-monitoring', icon: Activity },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleRoleToggle = () => {
    const nextRole = isAdmin ? 'user' : 'admin';
    switchRole(nextRole);
    navigate(nextRole === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    if (closeMobile) closeMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Subtle Ambient Mesh Highlight */}
        <div className="absolute inset-x-0 top-0 h-40 " />

        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                Parkwise
                <span className="text-[9.5px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded-full">
                  v2.0
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 truncate max-w-[150px] mt-0.5">
                {isAdmin ? 'Public Parking Operations' : 'Public Parking Network'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Card */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 relative z-10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 text-[10.5px] font-medium">Active Mode:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[9.5px] uppercase tracking-wider ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {isAdmin ? 'Admin Operator' : 'Vehicle Owner'}
            </span>
          </div>
          <button
            onClick={handleRoleToggle}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-700/60 active:scale-95 shadow-2xs"
            title="Switch between Vehicle Owner portal and Admin Operator dashboard"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Switch to {isAdmin ? 'Owner View' : 'Admin Console'}</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {isAdmin ? 'Operator Console' : 'Vehicle Owner Portal'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Hardware Status Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-200 font-semibold text-[11px]">RFID Nodes Synced</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            Smart parking for transit hubs and busy public places.
          </p>
        </div>
      </aside>
    </>
  );
};
