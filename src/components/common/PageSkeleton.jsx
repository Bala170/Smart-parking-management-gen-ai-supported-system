import React from 'react';

export const PageSkeleton = ({ label = 'Loading page content' }) => (
  <div role="status" aria-busy="true" aria-label={label} className="space-y-6 py-2">
    <span className="sr-only">{label}</span>
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="space-y-2.5">
        <div className="h-7 w-56 max-w-[65vw] rounded bg-slate-200" />
        <div className="h-3 w-80 max-w-[75vw] rounded bg-slate-100" />
      </div>
      <div className="hidden h-10 w-32 rounded-md bg-slate-100 sm:block" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="h-3 w-24 rounded bg-slate-100" />
          <div className="h-7 w-32 max-w-full rounded bg-slate-200" />
          <div className="h-3 w-40 max-w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-h-64 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
        <div className="h-4 w-44 rounded bg-slate-200" />
        <div className="mt-6 h-40 rounded-lg bg-slate-50" />
      </div>
      <div className="min-h-64 rounded-xl border border-slate-200 bg-white p-5">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="mt-6 space-y-4">
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  </div>
);
