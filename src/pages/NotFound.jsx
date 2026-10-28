import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
        <Radio className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-200 mb-1">Parking Bay Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        The requested routing node or telemetry resource does not exist in the Smart Parking system registry.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/user/dashboard"
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
