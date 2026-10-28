import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Clock,
  Car,
  Phone,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { delegationService } from '../../services/delegationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export const DelegationManagement = () => {
  const [delegations, setDelegations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { showToast } = useNotifications();

  useEffect(() => {
    loadDelegations();
  }, []);

  const loadDelegations = async () => {
    try {
      const data = await delegationService.getDelegations();
      setDelegations(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRevoke = async (id) => {
    if (window.confirm(`Revoke delegation pass ${id} by administrative security order?`)) {
      await delegationService.revokeDelegation(id);
      showToast(`Delegation ${id} revoked by administrator`, 'warning');
      loadDelegations();
    }
  };

  const filtered = delegations.filter((d) => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (
      search &&
      !d.id.toLowerCase().includes(search.toLowerCase()) &&
      !d.delegateeName.toLowerCase().includes(search.toLowerCase()) &&
      !d.vehicleNumber.toLowerCase().includes(search.toLowerCase()) &&
      !d.ownerName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Delegation Governance & Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervise all time-bound owner authorizations, temporary pickup passes, and expiration windows
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {delegations.filter((d) => d.status === 'ACTIVE').length} Active Authorizations
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search delegations by ID, vehicle plate, owner, or delegate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'ACTIVE', 'COMPLETED', 'REVOKED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Pass ID</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Registered Owner</th>
                <th className="py-3 px-4">Authorized Delegate</th>
                <th className="py-3 px-4">Delegate Contact</th>
                <th className="py-3 px-4">Validity Period</th>
                <th className="py-3 px-4">Gate OTP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{d.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{d.vehicleNumber}</td>
                  <td className="py-3.5 px-4 text-slate-700">{d.ownerName}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{d.delegateeName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{d.delegateePhone}</td>
                  <td className="py-3.5 px-4 text-slate-600">{d.formattedFrom} → {d.formattedUntil}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{d.otp}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {d.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleAdminRevoke(d.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                      >
                        Revoke Pass
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
