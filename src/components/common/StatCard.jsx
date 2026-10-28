import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'default',
  trend,
  className = '',
}) => {
  return (
    <div
      className={`group relative bg-white rounded-xl border border-slate-200 p-5 transition-colors duration-150 hover:border-slate-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors duration-150">
            <Icon className="w-4 h-4" strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
          {value}
        </span>
        {badgeText && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            {badgeText}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100/80">
          {trend && (
            <span
              className={`inline-flex items-center font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="truncate text-slate-500 text-[11px]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
