import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  KeyRound,
  QrCode,
  UserX,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Radio,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export const SecurityMonitoring = () => {
  const { showToast } = useNotifications();

  const securityThreatStats = [
    { category: 'Failed Auth', count: 3 },
    { category: 'Invalid OTP', count: 2 },
    { category: 'Expired QR', count: 4 },
    { category: 'Unauthorized Gate', count: 1 },
    { category: 'Rate Limit Triggers', count: 2 },
  ];

  const recentIncidents = [
    {
      id: "SEC-INC-0091",
      title: "Unauthorized Gate Query Intercepted",
      severity: "HIGH",
      time: "08:52 AM Today",
      device: "Gate 2 Exit Reader (10.0.8.21)",
      description: "Unregistered RFID card 0x4E99A2 scanned without valid session. Gate maintained locked. Video frame recorded.",
      actionTaken: "Security alert broadcasted; Barrier held locked.",
    },
    {
      id: "SEC-INC-0090",
      title: "Multiple Invalid OTP Challenges",
      severity: "MEDIUM",
      time: "07:50 AM Today",
      device: "Web Client Recovery (117.200.14.88)",
      description: "2 consecutive incorrect OTP submissions for vehicle TN-03-P-2024 recovery request. Cooldown applied.",
      actionTaken: "Rate limiter imposed 15-minute temporary lockout.",
    },
    {
      id: "SEC-INC-0089",
      title: "Expired Delegation Pass Presented",
      severity: "LOW",
      time: "Yesterday, 06:15 PM",
      device: "Gate 2 Scanner",
      description: "QR credential DEL-2026-0775 presented 3 hours after scheduled expiration window.",
      actionTaken: "Exit barrier access denied. User instructed to re-authorize.",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Security & Threat Monitoring</h1>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
              Shield Level 1 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active threat detection, credential revocation alerts, and gate perimeter defense telemetry
          </p>
        </div>

        <button
          onClick={() => showToast('Security diagnostics scanned: All perimeter nodes healthy', 'success')}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run Diagnostic Sweep</span>
        </button>
      </div>

      {/* Security Threat KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">Failed Auth</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">3</span>
          <span className="text-[10px] text-slate-400">Past 24 hours</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Invalid OTP</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">2</span>
          <span className="text-[10px] text-slate-400">Recovery attempts</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Expired QR</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">4</span>
          <span className="text-[10px] text-slate-400">Auto-rejected</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">Unauthorized Gate</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">1</span>
          <span className="text-[10px] text-slate-400">Boom barrier locked</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Active Delegations</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">3</span>
          <span className="text-[10px] text-slate-400">Under time window</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Reader Uptime</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">99.8%</span>
          <span className="text-[10px] text-slate-400">RFID Loop Nodes</span>
        </div>
      </div>

      {/* Threat Histogram + Active Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Perimeter Threat Incident Frequency</h3>
            <p className="text-xs text-slate-500">Security challenge rejections categorized by policy engine</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securityThreatStats} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE9" />
                <XAxis dataKey="category" stroke="#75817B" fontSize={11} />
                <YAxis stroke="#75817B" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3DD', borderRadius: '8px', color: '#1E2521', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#A3423D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Perimeter Security Policy Engine
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Dual Ingress Verification</span>
                <span className="text-slate-500 text-[11px]">
                  Physical vehicle magnetic presence required before RFID antenna energizes.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Anti-Passback Enforcement</span>
                <span className="text-slate-500 text-[11px]">
                  RFID tags cannot be scanned twice without registered egress sequence.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Cryptographic QR Tokens</span>
                <span className="text-slate-500 text-[11px]">
                  QR tokens expire upon session exit or timeout; screenshots cannot be replayed.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Log Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Recent Security Incidents & Threat Mitigations
        </h3>

        <div className="space-y-3">
          {recentIncidents.map((inc) => (
            <div
              key={inc.id}
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                inc.severity === 'HIGH'
                  ? 'bg-red-50/40 border-red-200'
                  : inc.severity === 'MEDIUM'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    inc.severity === 'HIGH' ? 'bg-red-600 text-white' : inc.severity === 'MEDIUM' ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="font-bold text-slate-900">{inc.title}</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">{inc.time}</span>
              </div>

              <p className="text-slate-600 text-[11px] leading-relaxed">{inc.description}</p>

              <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-200/60">
                <span>Node: <strong className="font-mono text-slate-700">{inc.device}</strong></span>
                <span className="text-emerald-700 font-semibold">{inc.actionTaken}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
