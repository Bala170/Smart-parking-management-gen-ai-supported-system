import React from 'react';

const statusConfig = {
  ACTIVE: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  AVAILABLE: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  OCCUPIED: { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
  RESERVED: { bg: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-600' },
  MAINTENANCE: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  COMPLETED: { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
  REVOKED: { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  EXPIRED: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  SUCCESS: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  FAILED: { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  REJECTED: { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  PENDING: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  'PENDING VERIFICATION': { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-600' },
  PARKED: { bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-600' },
  IDLE: { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-500' },
};

export const StatusBadge = ({ status, className = '', showDot = true }) => {
  const norm = String(status || '').toUpperCase().trim();
  const config = statusConfig[norm] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    ping: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${config.bg} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
        </span>
      )}
      <span>{status}</span>
    </span>
  );
};
