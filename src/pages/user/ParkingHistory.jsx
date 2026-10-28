import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Car,
  FileSpreadsheet
} from 'lucide-react';
import { parkingService } from '../../services/parkingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export const ParkingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { showToast } = useNotifications();

  useEffect(() => {
    loadHistory();
  }, [search, methodFilter, statusFilter]);

  const loadHistory = async () => {
    try {
      const data = await parkingService.getHistory({
        search,
        retrievalMethod: methodFilter || undefined,
        status: statusFilter || undefined,
      });
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Session ID', 'Vehicle', 'Slot', 'Entry Time', 'Exit Time', 'Duration', 'Amount', 'Retrieval Method', 'Status', 'Payment'];
    const rows = history.map((h) => [
      h.sessionId,
      h.vehicleNumber,
      h.slot,
      h.entryTime,
      h.exitTime,
      h.duration,
      h.amount,
      h.retrievalMethod,
      h.status,
      h.paymentStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_parking_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Parking history CSV exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Parking & Retrieval History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade record of previous sessions, retrieval mechanisms, and clearance receipts
          </p>
        </div>

        <button
          onClick={handleExport}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by session ID, vehicle plate, or bay..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all font-medium"
          />
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-2.5">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none font-medium"
          >
            <option value="">All Retrieval Methods</option>
            <option value="RFID">RFID Physical Tap</option>
            <option value="Digital Token">Digital Token</option>
            <option value="Lost Token Recovery">Lost Token Recovery</option>
            <option value="Delegated Retrieval">Delegated Retrieval</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none font-medium"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4.5">Session ID</th>
                <th className="py-3.5 px-4.5">Vehicle</th>
                <th className="py-3.5 px-4.5">Bay</th>
                <th className="py-3.5 px-4.5">Entry Time</th>
                <th className="py-3.5 px-4.5">Exit Time</th>
                <th className="py-3.5 px-4.5">Duration</th>
                <th className="py-3.5 px-4.5">Amount</th>
                <th className="py-3.5 px-4.5">Retrieval Method</th>
                <th className="py-3.5 px-4.5">Status</th>
                <th className="py-3.5 px-4.5">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((row) => (
                <tr key={row.sessionId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4.5 font-mono font-bold text-slate-900">{row.sessionId}</td>
                  <td className="py-3.5 px-4.5">
                    <span className="font-mono font-extrabold text-slate-900 block">{row.vehicleNumber}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{row.vehicleModel}</span>
                  </td>
                  <td className="py-3.5 px-4.5 font-extrabold text-blue-700 font-sans">{row.slot}</td>
                  <td className="py-3.5 px-4.5 text-slate-600 font-medium">{row.entryTime}</td>
                  <td className="py-3.5 px-4.5 text-slate-600 font-medium">{row.exitTime}</td>
                  <td className="py-3.5 px-4.5 font-semibold text-slate-800">{row.duration}</td>
                  <td className="py-3.5 px-4.5 font-extrabold text-slate-900 font-sans tabular-nums">{row.amount}</td>
                  <td className="py-3.5 px-4.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                      {row.retrievalMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3.5 px-4.5 text-[11px] text-slate-600 font-medium">{row.paymentStatus}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400 font-medium">
                    No parking sessions found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
