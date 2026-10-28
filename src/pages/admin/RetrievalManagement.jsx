import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Radio,
  QrCode,
  KeyRound,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../context/NotificationContext';

export const RetrievalManagement = () => {
  const [retrievals, setRetrievals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRetrieval, setSelectedRetrieval] = useState(null);
  const [search, setSearch] = useState('');

  const { showToast } = useNotifications();

  useEffect(() => {
    loadRetrievals();
  }, []);

  const loadRetrievals = async () => {
    try {
      const data = await adminService.getRetrievals();
      setRetrievals(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await adminService.updateRetrievalStatus(id, action);
      showToast(
        action === 'AUTHORIZE'
          ? `Retrieval ${id} authorized! Boom barrier signal sent.`
          : `Retrieval ${id} rejected. Security lock active.`,
        action === 'AUTHORIZE' ? 'success' : 'error'
      );
      setSelectedRetrieval(null);
      loadRetrievals();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const filtered = retrievals.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Gate Retrieval & Security Clearance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor exit gateway clearance across RFID scans, digital QR tokens, delegation passes & recovery tokens
          </p>
        </div>

        <button
          onClick={loadRetrievals}
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search retrieval queue by plate, ID, method, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Retrieval ID</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Authorization State</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Gate Barrier Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{r.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{r.vehicle}</td>
                  <td className="py-3.5 px-4 text-slate-700">{r.user}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {r.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold ${
                      r.authStatus.includes('Authorized') ? 'text-emerald-700' : r.authStatus.includes('Rejected') ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {r.authStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{r.paymentStatus}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{r.gateStatus}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{r.timestamp}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRetrieval(r)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Clearance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Clearance Modal */}
      <Modal
        isOpen={!!selectedRetrieval}
        onClose={() => setSelectedRetrieval(null)}
        title={`Gate 2 Clearance: ${selectedRetrieval?.id}`}
        subtitle={`Vehicle ${selectedRetrieval?.vehicle} • Method: ${selectedRetrieval?.method}`}
      >
        {selectedRetrieval && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Vehicle Identifier:</span>
                <span className="font-mono font-bold text-slate-900">{selectedRetrieval.vehicle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Claimant / Owner:</span>
                <span className="font-medium text-slate-800">{selectedRetrieval.user}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Retrieval Verification Method:</span>
                <span className="font-bold text-blue-700">{selectedRetrieval.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Fee Settlement Status:</span>
                <span className="font-medium text-slate-800">{selectedRetrieval.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Current Boom Barrier State:</span>
                <span className="font-mono text-slate-700">{selectedRetrieval.gateStatus}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
              Authorizing this retrieval logs a signed event in the Audit Trail and actuates the Gate 2 automated exit boom barrier.
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleAction(selectedRetrieval.id, 'REJECT')}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-semibold cursor-pointer"
              >
                Reject Retrieval
              </button>
              <button
                type="button"
                onClick={() => handleAction(selectedRetrieval.id, 'AUTHORIZE')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
              >
                Authorize & Lift Barrier
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
