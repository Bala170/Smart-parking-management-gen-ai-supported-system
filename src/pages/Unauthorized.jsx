import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Unauthorized = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const elevateToAdmin = () => {
    switchRole('admin');
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">403 Unauthorized</h1>
      <h2 className="text-lg font-bold text-slate-200 mb-1">Access Restricted</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        You do not possess the required clearance level or role to access this restricted operator console.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={elevateToAdmin}
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          Elevate to Admin Role
        </button>
        <Link
          to="/user/dashboard"
          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
        >
          Return to Owner Portal
        </Link>
      </div>
    </div>
  );
};
