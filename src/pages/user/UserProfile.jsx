import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Radio,
  ShieldCheck,
  CreditCard,
  KeyRound,
  ExternalLink,
  Car,
  QrCode,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { currentUser } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';

export const UserProfile = () => {
  const { user, switchRole, isAdmin } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-2xl ring-4 ring-slate-100">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{currentUser.name}</h1>
              <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {currentUser.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.department} • {currentUser.institution}
            </p>
          </div>
        </div>

        <button
          onClick={() => switchRole(isAdmin ? 'user' : 'admin')}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <ExternalLink className="w-4 h-4 text-blue-600" />
          <span>Switch to Operator Console</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Academic Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Account & Institution Telemetry
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email
              </span>
              <span className="font-semibold text-slate-800 font-mono">{currentUser.email}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Mobile Phone
              </span>
              <span className="font-mono font-bold text-slate-800">{currentUser.phone}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" /> Department
              </span>
              <span className="font-semibold text-slate-800">{currentUser.department}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" /> University
              </span>
              <span className="font-semibold text-slate-800">{currentUser.institution}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" /> Digital Wallet Balance
              </span>
              <span className="font-extrabold text-emerald-700 text-sm font-sans tabular-nums">
                ₹{currentUser.walletBalance}.00
              </span>
            </div>
          </div>
        </div>

        {/* Security & RFID Pairing Status */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Hardware RFID Security & Tag Pairing
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Primary UHF Tag (Two-Wheeler)</span>
                <StatusBadge status="ACTIVE" />
              </div>
              <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                <span className="text-blue-700 font-semibold">Tag: RFID-9A2F-881C</span>
                <span className="font-bold text-slate-800">Plate: TN-09-BK-4821</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Secondary UHF Tag (EV Four-Wheeler)</span>
                <StatusBadge status="ACTIVE" />
              </div>
              <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                <span className="text-purple-700 font-semibold">Tag: RFID-4B10-EE72</span>
                <span className="font-bold text-slate-800">Plate: TN-02-CB-1904</span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-2xl text-blue-900 text-[11px] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Two-Factor OTP challenge is enforced whenever a physical RFID token is reported lost or when issuing temporary delegation credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
